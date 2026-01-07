import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@/lib/prisma";
import { parseSotTimestamp } from "@/lib/time";
import { getToken } from "next-auth/jwt";
import { assertInternalToken } from "@/lib/internalAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// NDJSON Support: Max 500 events
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

type IngestOk = { id: string; status: "ok"; dbId: number };
type IngestErr = { id: string; status: "error"; msg: string; code?: string };
type IngestResult = IngestOk | IngestErr;

function coerceErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    return String(e);
}

function coerceErrorCode(e: unknown): string | undefined {
    if (typeof e === "object" && e !== null && "code" in e) {
        const code = (e as { code?: unknown }).code;
        return typeof code === "string" ? code : undefined;
    }
    return undefined;
}

// Auth: Session OR SOT_INGEST_TOKEN (via x-sot-ingest-token or Bearer) OR internal token fallback
function hasIngestToken(req: NextRequest): boolean {
    const expected = process.env.SOT_INGEST_TOKEN;
    if (!expected) return false; // Fail safe if not set

    const auth = req.headers.get("authorization") ?? "";
    const bearer = auth.replace(/^Bearer\s+/i, "").trim();
    const ingestTokenHeader = (req.headers.get("x-sot-ingest-token") ?? "").trim();
    const legacy = (req.headers.get("x-jai-internal-token") ?? "").trim();

    if (bearer === expected) return true;
    if (ingestTokenHeader === expected) return true;
    if (legacy === expected) return true;
    return false;
}

async function hasSession(req: NextRequest): Promise<boolean> {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return false;
    const token = await getToken({ req, secret });
    return !!token;
}

async function resolveRepoDomainIds(event: RawEvent): Promise<{ repoId?: number; domainId?: number }> {
    let repoId = event.repoId;
    let domainId = event.domainId;

    if (!repoId && event.repoName) {
        const repo = await prisma.repo.findUnique({ where: { name: event.repoName } });
        if (repo) repoId = repo.id;
    }

    if (!domainId && event.domainName) {
        const domain = await prisma.domain.findUnique({ where: { domain: event.domainName } });
        if (domain) domainId = domain.id;
    }

    return { repoId, domainId };
}

function parseBodyToEvents(text: string): { ok: true; events: RawEvent[] } | { ok: false; error: string } {
    const trimmed = text.trim();
    if (!trimmed) return { ok: false, error: "Empty body" };

    const firstChar = trimmed[0];

    // JSON array
    if (firstChar === "[") {
        try {
            const parsed: unknown = JSON.parse(trimmed);
            if (!Array.isArray(parsed)) return { ok: false, error: "Invalid JSON array" };
            return { ok: true, events: parsed as RawEvent[] };
        } catch {
            return { ok: false, error: "Invalid JSON array" };
        }
    }

    // NDJSON
    const lines = trimmed.split(/\r?\n/).filter((l) => l.trim());
    const events: RawEvent[] = [];

    for (const line of lines) {
        try {
            const parsed: unknown = JSON.parse(line);
            events.push(parsed as RawEvent);
        } catch {
            return { ok: false, error: "Invalid NDJSON line" };
        }
    }

    return { ok: true, events };
}

export async function POST(req: NextRequest) {
    // 1) Auth
    const isIngest = hasIngestToken(req);
    const isInternal = assertInternalToken(req).ok;
    const isSession = await hasSession(req);

    if (!isIngest && !isInternal && !isSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const text = await req.text();

        // 2) Parse
        const parsed = parseBodyToEvents(text);
        if (!parsed.ok) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const rawEvents = parsed.events;

        if (rawEvents.length > MAX_EVENTS_BATCH) {
            return NextResponse.json(
                { error: `Too many events. Max ${MAX_EVENTS_BATCH}` },
                { status: 400 },
            );
        }

        // 3) Process
        const received = rawEvents.length;
        let inserted = 0;
        let updated = 0;
        let errors = 0;

        const results: IngestResult[] = [];

        for (const evt of rawEvents) {
            const eventId = String(evt.eventId ?? "").trim();

            if (!eventId || !evt.kind || !evt.source || !evt.ts) {
                errors++;
                results.push({
                    id: eventId || "(missing)",
                    status: "error",
                    msg: "Missing required fields",
                });
                continue;
            }

            const ts = parseSotTimestamp(evt.ts);
            if (!ts) {
                errors++;
                results.push({ id: eventId, status: "error", msg: "Invalid ts" });
                continue;
            }

            const { repoId, domainId } = await resolveRepoDomainIds(evt);

            try {
                const result = await prisma.sotEvent.upsert({
                    where: { eventId },
                    update: {
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
                        eventId,
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

                // Heuristic: compare createdAt/updatedAt to count inserts vs updates
                if (result.createdAt.getTime() === result.updatedAt.getTime()) inserted++;
                else updated++;

                results.push({ id: result.eventId, status: "ok", dbId: result.id });
            } catch (e: unknown) {
                const code = coerceErrorCode(e);
                const msg = coerceErrorMessage(e).split("\n")[0] ?? "Unknown error";

                errors++;
                results.push({
                    id: eventId,
                    status: "error",
                    code,
                    msg: msg.slice(0, 120),
                });
            }
        }

        const sampleErrors = results.filter((r): r is IngestErr => r.status === "error").slice(0, 3);

        return NextResponse.json({
            received,
            inserted,
            updated,
            errors,
            sampleErrors: sampleErrors.length ? sampleErrors : undefined,
        });
    } catch (err: unknown) {
        console.error("Ingest fatal error", err);
        // Keep message generic; never leak runtime internals
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
