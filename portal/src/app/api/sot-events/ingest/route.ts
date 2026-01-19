import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, InboxItemStatus, WorkPacketStatus } from "@prisma/client";
import { parseSotTimestamp } from "@/lib/time";
import { isSotIngestAuthorized } from "@/lib/sotIngestAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// NDJSON Support: Max 500 events
const MAX_EVENTS_BATCH = 500;

type RawEvent = {
    version?: string;
    ts: string;
    source: string;
    kind: string;
    eventId: string; // Required
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

/**
 * Option B projection: vscode.work_packet.* SotEvents materialize WorkPacket + AgentInboxItem
 * so /operator/work has real rows (not just events).
 */
type WorkPacketPayload = {
    workPacketId?: string;
    goal?: string;
    title?: string;
    nhId?: string;
};

function isWorkPacketKind(kind: string): boolean {
    return kind.startsWith("vscode.work_packet.");
}

function getWorkPacketExternalId(evt: RawEvent): string | null {
    const p = evt.payload as unknown as WorkPacketPayload | null;
    const id = p?.workPacketId;
    if (!id) return null;
    const s = String(id).trim();
    return s.length ? s : null;
}

function workPacketTitle(evt: RawEvent): string {
    const p = evt.payload as unknown as WorkPacketPayload | null;

    const fromPayload =
        (p?.title ? String(p.title).trim() : "") ||
        (p?.goal ? String(p.goal).trim() : "");

    if (fromPayload) return fromPayload.slice(0, 180);
    if (evt.summary?.trim()) return evt.summary.trim().slice(0, 180);
    return `Work Packet (${evt.kind})`;
}

function statusForWorkPacketKind(kind: string): WorkPacketStatus | null {
    if (kind === "vscode.work_packet.completed") return WorkPacketStatus.DONE;
    if (kind === "vscode.work_packet.requested") return WorkPacketStatus.DRAFT;
    // "updated" should not force a transition
    return null;
}

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

async function resolveRepoDomainIds(
    db: Prisma.TransactionClient,
    event: RawEvent,
): Promise<{ repoId?: number; domainId?: number }> {
    let repoId = event.repoId;
    let domainId = event.domainId;

    if (!repoId && event.repoName) {
        const repo = await db.repo.findUnique({ where: { name: event.repoName } });
        if (repo) repoId = repo.id;
    }

    if (!domainId && event.domainName) {
        const domain = await db.domain.findUnique({ where: { domain: event.domainName } });
        if (domain) domainId = domain.id;
    }

    return { repoId, domainId };
}

async function projectWorkPacketFromEvent(args: {
    tx: Prisma.TransactionClient;
    evt: RawEvent;
    repoId?: number;
}): Promise<number | null> {
    const { tx, evt, repoId } = args;

    if (!isWorkPacketKind(evt.kind)) return null;

    const externalId = getWorkPacketExternalId(evt);
    if (!externalId) return null;

    const title = workPacketTitle(evt);
    const desiredStatus = statusForWorkPacketKind(evt.kind);

    const p = evt.payload as unknown as WorkPacketPayload | null;
    const nhFromPayload = p?.nhId ? String(p.nhId).trim() : "";
    const nh = (evt.nhId?.trim() || nhFromPayload || "").trim();

    // Requires WorkPacket.externalId String? @unique in schema
    const wp = await tx.workPacket.upsert({
        where: { externalId },
        update: {
            title,
            ...(desiredStatus ? { status: desiredStatus } : {}),
            ...(repoId ? { repoId } : {}),
            ...(nh ? { nhId: nh } : {}),
        },
        create: {
            externalId,
            nhId: nh,
            title,
            status: desiredStatus ?? WorkPacketStatus.DRAFT,
            ...(repoId ? { repoId } : {}),
        },
    });

    // Ensure inbox item exists. Mark DONE on completion.
    if (evt.kind === "vscode.work_packet.completed") {
        await tx.agentInboxItem.upsert({
            where: { workPacketId: wp.id },
            update: {
                status: InboxItemStatus.DONE,
                completedAt: new Date(),
            },
            create: {
                workPacketId: wp.id,
                status: InboxItemStatus.DONE,
                priority: 50,
                completedAt: new Date(),
            },
        });
    } else {
        await tx.agentInboxItem.upsert({
            where: { workPacketId: wp.id },
            update: {},
            create: {
                workPacketId: wp.id,
                status: InboxItemStatus.QUEUED,
                priority: 50,
            },
        });
    }

    return wp.id;
}

function parseBodyToEvents(
    text: string,
): { ok: true; events: RawEvent[] } | { ok: false; error: string } {
    const trimmed = text.trim();
    if (!trimmed) return { ok: false, error: "Empty body" };

    // JSON array
    if (trimmed[0] === "[") {
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
    if (!(await isSotIngestAuthorized(req))) {
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

            try {
                const { sot, insertedOrUpdated } = await prisma.$transaction(async (tx) => {
                    const { repoId, domainId } = await resolveRepoDomainIds(tx, evt);

                    const wpDbId = await projectWorkPacketFromEvent({ tx, evt, repoId });

                    const sot = await tx.sotEvent.upsert({
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
                            ...(wpDbId ? { workPacketId: wpDbId } : {}),
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
                            ...(wpDbId ? { workPacketId: wpDbId } : {}),
                        },
                    });

                    const insertedOrUpdated =
                        sot.createdAt.getTime() === sot.updatedAt.getTime() ? "inserted" : "updated";

                    return { sot, insertedOrUpdated };
                });

                if (insertedOrUpdated === "inserted") inserted++;
                else updated++;

                results.push({ id: sot.eventId, status: "ok", dbId: sot.id });
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

        const sampleErrors = results
            .filter((r): r is IngestErr => r.status === "error")
            .slice(0, 3);

        return NextResponse.json({
            received,
            inserted,
            updated,
            errors,
            sampleErrors: sampleErrors.length ? sampleErrors : undefined,
        });
    } catch (err: unknown) {
        console.error("Ingest fatal error", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
