import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSotIngestAuthorized } from "@/lib/sotIngestAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Types matching the SourceSignal model and NDJSON input
type InputSignal = {
    version: string;
    ts: string;
    date: string;
    quarter: string;
    vendor: string;
    title: string;
    url: string;
    published_at?: string | null;
    tier?: string | null;
    artifact_path: string;
    artifact_sha256: string;
    summary?: string | null;
};



function parseNDJSON(text: string): { ok: true; items: unknown[] } | { ok: false; error: string } {
    const trimmed = text.trim();
    if (!trimmed) return { ok: true, items: [] };

    if (trimmed.startsWith("[")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (!Array.isArray(parsed)) return { ok: false, error: "JSON is not an array" };
            return { ok: true, items: parsed };
        } catch {
            return { ok: false, error: "Invalid JSON array" };
        }
    }

    const lines = trimmed.split(/\r?\n/);
    const items: unknown[] = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        try {
            items.push(JSON.parse(line));
        } catch {
            return { ok: false, error: `Invalid JSON at line ${i + 1}` };
        }
    }
    return { ok: true, items };
}

export async function POST(req: NextRequest) {
    if (!(await isSotIngestAuthorized(req))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const text = await req.text();
        const parsed = parseNDJSON(text);

        if (!parsed.ok) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const items = parsed.items as InputSignal[];
        let inserted = 0;
        let updated = 0;
        const errors: { line: number; msg: string }[] = [];

        // LIMIT BATCH SIZE
        if (items.length > 1000) {
            return NextResponse.json({ error: "Batch too large (max 1000)" }, { status: 400 });
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // Validate required fields
            if (!item.artifact_sha256 || !item.vendor || !item.url || !item.date) {
                errors.push({ line: i + 1, msg: "Missing required fields (sha, vendor, url, date)" });
                continue;
            }

            try {
                // Parse TS
                const tsDate = new Date(item.ts);
                if (isNaN(tsDate.getTime())) {
                    errors.push({ line: i + 1, msg: "Invalid timestamp" });
                    continue;
                }

                const data = {
                    version: String(item.version || "1"),
                    ts: tsDate,
                    date: String(item.date),
                    quarter: String(item.quarter || ""),
                    vendor: String(item.vendor),
                    title: String(item.title || "").slice(0, 500),
                    url: String(item.url || "").slice(0, 1000),
                    published_at: item.published_at ? String(item.published_at) : null,
                    tier: item.tier ? String(item.tier) : null,
                    artifact_path: String(item.artifact_path || ""),
                    summary: item.summary ? String(item.summary).slice(0, 2000) : null,
                };

                // Idempotent Upsert
                const result = await prisma.sourceSignal.upsert({
                    where: { artifact_sha256: item.artifact_sha256 },
                    update: data,
                    create: {
                        ...data,
                        artifact_sha256: item.artifact_sha256,
                    },
                });

                // Heuristic check for inserted vs updated based on createdAt
                // (In a real high-throughput scenario we might not care, but helpful for stats)
                if (result.createdAt.getTime() > Date.now() - 2000) {
                    inserted++;
                } else {
                    updated++;
                }

            } catch (e: unknown) {
                console.error("Ingest error line", i + 1, e);
                const msg = e instanceof Error ? e.message : String(e);
                errors.push({ line: i + 1, msg: msg || "Unknown error" });
            }
        }

        return NextResponse.json({
            received: items.length,
            inserted,
            updated,
            errors: errors.slice(0, 50), // Limit error volume
        });

    } catch (e: unknown) {
        console.error("Fatal ingest error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
