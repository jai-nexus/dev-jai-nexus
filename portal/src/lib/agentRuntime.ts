// portal/src/lib/agentRuntime.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import crypto from "node:crypto";
import { validateReposAgainstAgentScope } from "@/lib/scopeValidator";
import { assertSotEventV01 } from "@/lib/contracts/sotEventV01";

// Keep your existing public type name so other agents compile.
export type AgentQueueItem = {
    id: string; // queue item uuid
    workPacketId: number; // WorkPacket.id (Int)
    agentNhId: string; // "1.2.1"
    repoScope: string[]; // bare repo names preferred; validator tolerates org/repo
    status: "PENDING" | "CLAIMED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    claimedAt: Date | null;
    leaseExpiry: Date | null; // for timeout-based re-queue
};

// Minimal “db-like” surface so we don't depend on PrismaClient typing
// (your prisma wrapper type is currently missing agentQueueItem).
type DbLike = {
    $transaction: <T>(fn: (tx: DbLikeTx) => Promise<T>) => Promise<T>;
};

type DbLikeTx = {
    $queryRaw<T = unknown>(query: unknown): Promise<T>;
    agentQueueItem: {
        update(args: unknown): Promise<unknown>;
        updateMany(args: unknown): Promise<unknown>;
        findMany(args: unknown): Promise<unknown>;
    };
    workPacket: {
        findUnique(args: unknown): Promise<unknown>;
    };
    repo: {
        findUnique(args: unknown): Promise<unknown>;
    };
    sotEvent: {
        create(args: unknown): Promise<unknown>;
    };
};

type RuntimeSotKind = "WORK_CLAIMED" | "WORK_COMPLETED" | "WORK_FAILED" | "WORK_REQUEUED";

function toStatus(s: unknown): AgentQueueItem["status"] {
    const x = String(s ?? "").toUpperCase();
    if (
        x === "PENDING" ||
        x === "CLAIMED" ||
        x === "IN_PROGRESS" ||
        x === "COMPLETED" ||
        x === "FAILED"
    ) {
        return x;
    }
    return "PENDING";
}

function toDate(v: unknown): Date | null {
    if (!v) return null;
    if (v instanceof Date) return v;
    const d = new Date(String(v));
    return Number.isFinite(d.getTime()) ? d : null;
}

function normalizeRepoScope(scope: unknown): string[] {
    if (!Array.isArray(scope)) return [];
    return scope.map((x) => String(x ?? "").trim()).filter(Boolean);
}

export class BaseAgentRuntime {
    readonly nhId: string;
    readonly pollIntervalMs: number;

    // defaults
    readonly leaseMs: number = 60_000;
    readonly sweepIntervalMs: number = 5_000;

    // claim behavior
    readonly claimBatchSize: number = 10;

    private running = false;
    private pollTimer: NodeJS.Timeout | null = null;
    private sweepTimer: NodeJS.Timeout | null = null;

    constructor(nhId: string, pollIntervalMs: number = 5_000) {
        this.nhId = nhId;
        this.pollIntervalMs = pollIntervalMs;
    }

    async start(): Promise<void> {
        if (this.running) return;
        this.running = true;

        await this.tick().catch((e) => {
            console.error(`[agentRuntime:${this.nhId}] initial tick failed`, e);
        });

        this.pollTimer = setInterval(() => {
            this.tick().catch((e) => {
                console.error(`[agentRuntime:${this.nhId}] tick failed`, e);
            });
        }, this.pollIntervalMs);

        this.sweepTimer = setInterval(() => {
            this.requeueExpired().catch((e) => {
                console.error(`[agentRuntime:${this.nhId}] lease sweep failed`, e);
            });
        }, this.sweepIntervalMs);
    }

    async stop(): Promise<void> {
        this.running = false;
        if (this.pollTimer) clearInterval(this.pollTimer);
        if (this.sweepTimer) clearInterval(this.sweepTimer);
        this.pollTimer = null;
        this.sweepTimer = null;
    }

    private async tick(): Promise<void> {
        if (!this.running) return;

        const item = await this.claimNext();
        if (!item) return;

        try {
            await this.execute(item);
        } catch (err) {
            await this.fail(item, err);
        }
    }

    async claimNext(): Promise<AgentQueueItem | null> {
        const now = new Date();
        const leaseExpiry = new Date(now.getTime() + this.leaseMs);

        const db = prisma as unknown as DbLike;

        return db.$transaction(async (tx) => {
            const rows = await tx.$queryRaw<
                Array<{
                    id: string;
                    workPacketId: number;
                    agentNhId: string;
                    status: string;
                    claimedAt: Date | null;
                    leaseExpiry: Date | null;
                    repoScope: string[] | null;
                }>
            >(
                Prisma.sql`
          SELECT
            "id",
            "workPacketId",
            "agentNhId",
            "status",
            "claimedAt",
            "leaseExpiry",
            "repoScope"
          FROM "AgentQueueItem"
          WHERE "agentNhId" = ${this.nhId}
            AND "status" = 'PENDING'
          ORDER BY "createdAt" ASC
          LIMIT ${Prisma.raw(String(this.claimBatchSize))}
          FOR UPDATE SKIP LOCKED
        `
            );

            if (rows.length === 0) return null;

            // Scan a small batch so one "bad" item doesn't block the queue.
            for (const candidate of rows) {
                const repoScope = normalizeRepoScope(candidate.repoScope);

                let reposToCheck: string[] = repoScope;

                if (reposToCheck.length === 0) {
                    const wp = (await tx.workPacket.findUnique({
                        where: { id: candidate.workPacketId },
                        select: { id: true, nhId: true, repo: { select: { name: true } } },
                    })) as { id: number; nhId: string | null; repo: { name: string } | null } | null;

                    reposToCheck = wp?.repo?.name ? [wp.repo.name] : [];
                }

                if (reposToCheck.length === 0) {
                    // Can't scope-check; skip it (leave PENDING).
                    continue;
                }

                const scopeRes = validateReposAgainstAgentScope(this.nhId, reposToCheck);
                if (!scopeRes.valid) {
                    // Reject out-of-scope (do not claim), keep scanning.
                    continue;
                }

                const updated = (await tx.agentQueueItem.update({
                    where: { id: candidate.id },
                    data: { status: "CLAIMED", claimedAt: now, leaseExpiry },
                    select: {
                        id: true,
                        workPacketId: true,
                        agentNhId: true,
                        status: true,
                        claimedAt: true,
                        leaseExpiry: true,
                        repoScope: true,
                    },
                })) as AgentQueueItem;

                const wp = (await tx.workPacket.findUnique({
                    where: { id: updated.workPacketId },
                    select: { id: true, nhId: true, repoId: true },
                })) as { id: number; nhId: string | null; repoId: number | null } | null;

                const workNh = wp?.nhId ?? null;

                await this.emitRuntimeSotEvent(tx, {
                    kind: "WORK_CLAIMED",
                    nhId: workNh,
                    repoId: wp?.repoId ?? null,
                    workPacketId: updated.workPacketId,
                    summary: `Work claimed: ${workNh ?? `workPacket#${updated.workPacketId}`} by ${this.nhId}`,
                    payload: {
                        schema: "agent-runtime-0.1",
                        agentNhId: this.nhId,
                        queueItemId: updated.id,
                        workPacketId: updated.workPacketId,
                        leaseExpiry: updated.leaseExpiry?.toISOString?.() ?? null,
                        repoScope: normalizeRepoScope(updated.repoScope),
                    },
                });

                return {
                    id: updated.id,
                    workPacketId: updated.workPacketId,
                    agentNhId: updated.agentNhId,
                    repoScope: normalizeRepoScope(updated.repoScope),
                    status: toStatus(updated.status),
                    claimedAt: toDate(updated.claimedAt),
                    leaseExpiry: toDate(updated.leaseExpiry),
                };
            }

            return null;
        });
    }

    async execute(item: AgentQueueItem): Promise<void> {
        await this.complete(item, { note: "BaseAgentRuntime default complete" });
    }

    async release(item: AgentQueueItem, reason: string = "released"): Promise<void> {
        const db = prisma as unknown as DbLike;

        await db.$transaction(async (tx) => {
            const updated = (await tx.agentQueueItem.update({
                where: { id: item.id },
                data: { status: "PENDING", claimedAt: null, leaseExpiry: null },
                select: { id: true, workPacketId: true },
            })) as { id: string; workPacketId: number };

            const wp = (await tx.workPacket.findUnique({
                where: { id: updated.workPacketId },
                select: { id: true, nhId: true, repoId: true },
            })) as { id: number; nhId: string | null; repoId: number | null } | null;

            await this.emitRuntimeSotEvent(tx, {
                kind: "WORK_REQUEUED",
                nhId: wp?.nhId ?? null,
                repoId: wp?.repoId ?? null,
                workPacketId: updated.workPacketId,
                summary: `Work requeued: ${wp?.nhId ?? `workPacket#${updated.workPacketId}`} (${reason})`,
                payload: {
                    schema: "agent-runtime-0.1",
                    agentNhId: this.nhId,
                    queueItemId: updated.id,
                    workPacketId: updated.workPacketId,
                    reason,
                },
            });
        });
    }

    protected async complete(item: AgentQueueItem, extra?: Record<string, unknown>): Promise<void> {
        const db = prisma as unknown as DbLike;

        await db.$transaction(async (tx) => {
            const updated = (await tx.agentQueueItem.update({
                where: { id: item.id },
                data: { status: "COMPLETED", leaseExpiry: null },
                select: { id: true, workPacketId: true },
            })) as { id: string; workPacketId: number };

            const wp = (await tx.workPacket.findUnique({
                where: { id: updated.workPacketId },
                select: { id: true, nhId: true, repoId: true },
            })) as { id: number; nhId: string | null; repoId: number | null } | null;

            await this.emitRuntimeSotEvent(tx, {
                kind: "WORK_COMPLETED",
                nhId: wp?.nhId ?? null,
                repoId: wp?.repoId ?? null,
                workPacketId: updated.workPacketId,
                summary: `Work completed: ${wp?.nhId ?? `workPacket#${updated.workPacketId}`} by ${this.nhId}`,
                payload: {
                    schema: "agent-runtime-0.1",
                    agentNhId: this.nhId,
                    queueItemId: updated.id,
                    workPacketId: updated.workPacketId,
                    ...(extra ?? {}),
                },
            });
        });
    }

    protected async fail(item: AgentQueueItem, err: unknown): Promise<void> {
        const db = prisma as unknown as DbLike;

        const msg =
            err instanceof Error
                ? err.message
                : typeof err === "string"
                    ? err
                    : (() => {
                        try {
                            return JSON.stringify(err);
                        } catch {
                            return String(err);
                        }
                    })();

        await db.$transaction(async (tx) => {
            const updated = (await tx.agentQueueItem.update({
                where: { id: item.id },
                data: { status: "FAILED", leaseExpiry: null },
                select: { id: true, workPacketId: true },
            })) as { id: string; workPacketId: number };

            const wp = (await tx.workPacket.findUnique({
                where: { id: updated.workPacketId },
                select: { id: true, nhId: true, repoId: true },
            })) as { id: number; nhId: string | null; repoId: number | null } | null;

            await this.emitRuntimeSotEvent(tx, {
                kind: "WORK_FAILED",
                nhId: wp?.nhId ?? null,
                repoId: wp?.repoId ?? null,
                workPacketId: updated.workPacketId,
                summary: `Work failed: ${wp?.nhId ?? `workPacket#${updated.workPacketId}`} by ${this.nhId}`,
                payload: {
                    schema: "agent-runtime-0.1",
                    agentNhId: this.nhId,
                    queueItemId: updated.id,
                    workPacketId: updated.workPacketId,
                    error: msg,
                },
            });
        });
    }

    private async requeueExpired(): Promise<void> {
        const db = prisma as unknown as DbLike;
        const now = new Date();

        await db.$transaction(async (tx) => {
            const expired = (await tx.agentQueueItem.findMany({
                where: { agentNhId: this.nhId, status: "CLAIMED", leaseExpiry: { lt: now } },
                select: { id: true, workPacketId: true, leaseExpiry: true },
                take: 50,
            })) as Array<{ id: string; workPacketId: number; leaseExpiry: Date | null }>;

            if (!expired.length) return;

            await tx.agentQueueItem.updateMany({
                where: { id: { in: expired.map((e) => e.id) } },
                data: { status: "PENDING", claimedAt: null, leaseExpiry: null },
            });

            for (const e of expired) {
                const wp = (await tx.workPacket.findUnique({
                    where: { id: e.workPacketId },
                    select: { id: true, nhId: true, repoId: true },
                })) as { id: number; nhId: string | null; repoId: number | null } | null;

                await this.emitRuntimeSotEvent(tx, {
                    kind: "WORK_FAILED",
                    nhId: wp?.nhId ?? null,
                    repoId: wp?.repoId ?? null,
                    workPacketId: e.workPacketId,
                    summary: `Lease expired: ${wp?.nhId ?? `workPacket#${e.workPacketId}`} requeued`,
                    payload: {
                        schema: "agent-runtime-0.1",
                        agentNhId: this.nhId,
                        queueItemId: e.id,
                        workPacketId: e.workPacketId,
                        reason: "lease_expired",
                        previousLeaseExpiry: e.leaseExpiry?.toISOString?.() ?? null,
                    },
                });
            }
        });
    }

    private async emitRuntimeSotEvent(
        db: DbLikeTx,
        args: {
            kind: RuntimeSotKind;
            nhId: string | null;
            repoId: number | null;
            workPacketId: number;
            summary: string;
            payload: Record<string, unknown>;
        }
    ) {
        const ts = new Date();
        const eventId = crypto.randomUUID();

        const sotEvent = {
            version: "0.1" as const,
            ts: ts.toISOString(),
            source: "jai-agent-runtime",
            kind: args.kind,
            summary: args.summary,
            nhId: args.nhId,
            repoName: null,
            domainName: null,
            payload: args.payload,
        };

        assertSotEventV01(sotEvent);

        await db.sotEvent.create({
            data: {
                eventId,
                ts,
                source: sotEvent.source,
                kind: sotEvent.kind,
                nhId: args.nhId ?? "", // SotEvent.nhId is non-null in your schema
                summary: args.summary,
                payload: sotEvent as Prisma.InputJsonValue,
                repoId: args.repoId ?? null,
                workPacketId: args.workPacketId,
            },
        });
    }
}
