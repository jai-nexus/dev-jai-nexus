import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@/lib/prisma";
import { parseSotTimestamp } from "@/lib/time";
import { getToken } from "next-auth/jwt";
import { assertInternalToken } from "@/lib/internalAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// NDJSON Support: Max 5MB body, Max 500 events
const MAX_EVENTS_BATCH = 500;

type RawEvent = {
    version?: string;
    ts: string;
    source: string;
    kind: string;
    eventId: string; // Required now
    nhId?: string;
    summary?: string;
    payload?: Prisma.InputJsonValue;
    repoId?: number;
    domainId?: number;
    repoName?: string;
    domainName?: string;
};

// Reusing auth logic for now, though we might want a specific SOT_INGEST_TOKEN separate logic
// The plan called for SOT_INGEST_TOKEN.
// Auth: Session OR SOT_INGEST_TOKEN (via x-sot-ingest-token or Bearer)
function hasIngestToken(req: NextRequest) {
    const expected = process.env.SOT_INGEST_TOKEN;
    if (!expected) return false; // Fail safe if not set

    const auth = req.headers.get("authorization") ?? "";
    const bearer = auth.replace(/^Bearer\s+/i, "").trim();
    const ingestTokenHeader = (req.headers.get("x-sot-ingest-token") ?? "").trim();
    const legacy = (req.headers.get("x-jai-internal-token") ?? "").trim();

    if (bearer === expected) return true;
    if (ingestTokenHeader === expected) return true;
    if (legacy === expected) return true; // Optional: allow x-header too
    return false;
}

async function hasSession(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return false;
    const token = await getToken({ req, secret });
    return !!token;
}

async function resolveRepoDomainIds(event: RawEvent) {
    let repoId = event.repoId;
    let domainId = event.domainId;

    // Simple caching could go here, but for now direct DB lookups per event
    // optimization can come later if high volume.

    if (!repoId && event.repoName) {
        // We are inside a transaction or loop, be careful. 
        // Usually names are stable.
        const repo = await prisma.repo.findUnique({ where: { name: event.repoName } });
        if (repo) repoId = repo.id;
    }

    if (!domainId && event.domainName) {
        const domain = await prisma.domain.findUnique({ where: { domain: event.domainName } });
        if (domain) domainId = domain.id;
    }

    return { repoId, domainId };
}

export async function POST(req: NextRequest) {
    console.log("[API] POST /api/sot-events/ingest hit");
    // 1. Auth: Ingest Token OR Session OR Internal Token (fallback)
    const isIngest = hasIngestToken(req);
    const isInternal = assertInternalToken(req).ok;
    const isSession = await hasSession(req);

    if (!isIngest && !isInternal && !isSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const text = await req.text();
        if (!text.trim()) {
            return NextResponse.json({ error: "Empty body" }, { status: 400 });
        }

        // 2. Parse NDJSON or JSON Array
        let rawEvents: RawEvent[] = [];
        const firstChar = text.trim()[0];

        if (firstChar === '[') {
            try {
                rawEvents = JSON.parse(text);
                if (!Array.isArray(rawEvents)) throw new Error("Not an array");
            } catch (e) {
                return NextResponse.json({ error: "Invalid JSON array" }, { status: 400 });
            }
        } else {
            // NDJSON
            const lines = text.split(/\r?\n/).filter(l => l.trim());
            for (const line of lines) {
                try {
                    rawEvents.push(JSON.parse(line));
                } catch (e) {
                    // One bad line shouldn't crash whole batch? Or should it?
                    // For atomic capability, we might reject. But log ingestion usually is "best effort".
                    // Let's reject the batch for correctness first.
                    return NextResponse.json({ error: "Invalid NDJSON line" }, { status: 400 });
                }
            }
        }

        if (rawEvents.length > MAX_EVENTS_BATCH) {
            return NextResponse.json({ error: `Too many events. Max ${MAX_EVENTS_BATCH}` }, { status: 400 });
        }

        // 3. Process
        let received = rawEvents.length;
        let inserted = 0;
        let updated = 0;
        let errors = 0;

        const results = [];

        // Process sequentially to keep it simple and safe for connection limits
        for (const evt of rawEvents) {
            if (!evt.eventId || !evt.kind || !evt.source || !evt.ts) {
                errors++;
                results.push({ id: evt.eventId, status: "error", msg: "Missing required fields" });
                continue;
            }

            const ts = parseSotTimestamp(evt.ts);
            if (!ts) {
                errors++;
                results.push({ id: evt.eventId, status: "error", msg: "Invalid ts" });
                continue;
            }

            const { repoId, domainId } = await resolveRepoDomainIds(evt);

            try {
                const result = await prisma.sotEvent.upsert({
                    where: { eventId: evt.eventId },
                    update: {
                        // Allow updating fields on re-ingest? Yes.
                        ts,
                        source: evt.source,
                        kind: evt.kind,
                        nhId: evt.nhId ?? "",
                        summary: evt.summary ?? null,
                        payload: evt.payload ?? Prisma.DbNull,
                        repoId,
                        domainId,
                    },
                    create: {
                        eventId: evt.eventId,
                        ts,
                        source: evt.source,
                        kind: evt.kind,
                        nhId: evt.nhId ?? "",
                        summary: evt.summary ?? null,
                        payload: evt.payload ?? Prisma.DbNull,
                        repoId,
                        domainId,
                    },
                });

                // Determine if it was insert or update? Prisma upsert doesn't explicitly tell us easily
                // without a separate query or checking timestamps. 
                // We'll just count it as "processed". But to be precise for the user:
                // We can check createdAt vs updatedAt if we really want.
                if (result.createdAt.getTime() === result.updatedAt.getTime()) {
                    inserted++;
                } else {
                    updated++;
                }

                results.push({ id: result.eventId, status: "ok", dbId: result.id });
            } catch (err: any) {
                // Simplified log (no secrets, just code)
                console.error(`Ingest Error [${evt.eventId}]: ${err.code} - ${err.message?.split('\n')[0]}`);
                errors++;
                results.push({ id: evt.eventId, status: "error", code: err.code, msg: err.message?.substring(0, 100) });
            }
        }

        const sampleErrors = results.filter(r => r.status === "error").slice(0, 3);

        return NextResponse.json({
            received,
            inserted,
            updated,
            errors,
            sampleErrors: sampleErrors.length > 0 ? sampleErrors : undefined
        });

    } catch (err) {
        console.error("Ingest fatal error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
