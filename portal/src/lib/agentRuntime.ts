import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import crypto from "node:crypto";
import { validateReposAgainstAgentScope } from "@/lib/scopeValidator";
import { assertSotEventV01 } from "@/lib/contracts/sotEventV01";
import {
    coerceStringArray,
    getAssigneeFromTags,
    type RequestedRole,
} from "@/lib/work/workPacketContract";

export type AgentQueueItem = {
    id: string;
    workPacketId: number;
    agentNhId: string;
    repoScope: string[];
    status: "PENDING" | "CLAIMED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    claimedAt: Date | null;
    leaseExpiry: Date | null;
};

export type WorkPacketRuntimeContext = {
    id: number;
    nhId: string | null;
    repoId: number | null;
    repoName: string | null;
    status: string | null;
    assigneeNhId: string | null;
    requestedRole: RequestedRole | null;
    githubPrUrl: string | null;
    verificationUrl: string | null;
    inboxTags: string[];
};

type ClaimCandidateRow = {
    id: string;
    workPacketId: number;
    agentNhId: string;
    status: string;
    claimedAt: Date | null;
    leaseExpiry: Date | null;
    repoScope: string[] | null;
};

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
    agentInboxItem: {
        findFirst(args: unknown): Promise<unknown>;
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

type RuntimeSotKind =
    | "WORK_CLAIMED"
    | "WORK_COMPLETED"
    | "WORK_FAILED"
    | "WORK_REQUEUED";

type DebugSotKind =
    | "debug.plan"
    | "debug.patch"
    | "debug.verify"
    | "debug.docs"
    | "debug.approve";

type AgentSotKind = RuntimeSotKind | DebugSotKind;

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

function parseRequestedRoleFromTags(tags: string[]): RequestedRole | null {
    const hit = tags.find((t) => typeof t === "string" && t.startsWith("route:"));
    if (!hit) return null;

    const raw = hit.slice("route:".length).trim().toUpperCase();

    if (raw === "ARCHITECT") return "ARCHITECT";
    if (raw === "BUILDER") return "BUILDER";
    if (raw === "VERIFIER") return "VERIFIER";
    if (raw === "LIBRARIAN") return "LIBRARIAN";
    if (raw === "OPERATOR" || raw === "OPERATOR_REVIEW") return "OPERATOR";

    return null;
}

export class BaseAgentRuntime {
    readonly nhId: string;
    readonly pollIntervalMs: number;

    readonly leaseMs: number = 60_000;
    readonly sweepIntervalMs: number = 5_000;
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

        await this.runOnce().catch((e) => {
            console.error(`[agentRuntime:${this.nhId}] initial tick failed`, e);
        });

        this.pollTimer = setInterval(() => {
            this.runOnce().catch((e) => {
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

    async runOnce(): Promise<boolean> {
        const item = await this.claimNext();
        if (!item) return false;

        try {
            await this.execute(item);
            return true;
        } catch (err) {
            await this.fail(item, err);
            throw err;
        }
    }

    protected async loadWorkPacketContext(
        tx: DbLikeTx,
        workPacketId: number,
    ): Promise<WorkPacketRuntimeContext | null> {
        const packet = (await tx.workPacket.findUnique({
            where: { id: workPacketId },
            select: {
                id: true,
                nhId: true,
                repoId: true,
                status: true,
                githubPrUrl: true,
                verificationUrl: true,
                repo: { select: { name: true } },
            },
        })) as
            | {
                id: number;
                nhId: string | null;
                repoId: number | null;
                status: string | null;
                githubPrUrl: string | null;
                verificationUrl: string | null;
                repo: { name: string } | null;
            }
            | null;

        if (!packet) return null;

        const latestInbox = (await tx.agentInboxItem.findFirst({
            where: { workPacketId },
            orderBy: { id: "desc" },
            select: {
                tags: true,
            },
        })) as { tags: unknown } | null;

        const inboxTags = coerceStringArray(latestInbox?.tags);
        const assigneeNhId = getAssigneeFromTags(inboxTags);
        const requestedRole = parseRequestedRoleFromTags(inboxTags);

        return {
            id: packet.id,
            nhId: packet.nhId,
            repoId: packet.repoId,
            repoName: packet.repo?.name ?? null,
            status: packet.status ?? null,
            assigneeNhId,
            requestedRole,
            githubPrUrl: packet.githubPrUrl ?? null,
            verificationUrl: packet.verificationUrl ?? null,
            inboxTags,
        };
    }

    protected async canClaimCandidate(
        _tx: DbLikeTx,
        _candidate: ClaimCandidateRow,
        packet: WorkPacketRuntimeContext,
    ): Promise<boolean> {
        if (packet.assigneeNhId && packet.assigneeNhId !== this.nhId) {
            return false;
        }
        return true;
    }

    protected async onClaimed(
        tx: DbLikeTx,
        item: AgentQueueItem,
        packet: WorkPacketRuntimeContext,
    ): Promise<void> {
        await this.emitAgentSotEvent(tx, {
            kind: "WORK_CLAIMED",
            nhId: packet.nhId,
            repoId: packet.repoId,
            workPacketId: item.workPacketId,
            summary: `Work claimed: ${packet.nhId ?? `workPacket#${item.workPacketId}`} by ${this.nhId}`,
            payload: {
                schema: "agent-runtime-0.1",
                agentNhId: this.nhId,
                queueItemId: item.id,
                workPacketId: item.workPacketId,
                requestedRole: packet.requestedRole,
                assigneeNhId: packet.assigneeNhId,
                leaseExpiry: item.leaseExpiry?.toISOString?.() ?? null,
                repoScope: item.repoScope,
            },
        });
    }

    protected async emitDebugArtifact(
        tx: DbLikeTx,
        args: {
            kind: DebugSotKind;
            nhId: string | null;
            repoId: number | null;
            workPacketId: number;
            summary: string;
            payload: Record<string, unknown>;
        },
    ): Promise<void> {
        await this.emitAgentSotEvent(tx, args);
    }

    protected async emitRuntimeEvent(
        tx: DbLikeTx,
        args: {
            kind: RuntimeSotKind;
            nhId: string | null;
            repoId: number | null;
            workPacketId: number;
            summary: string;
            payload: Record<string, unknown>;
        },
    ): Promise<void> {
        await this.emitAgentSotEvent(tx, args);
    }

    async claimNext(): Promise<AgentQueueItem | null> {
        const now = new Date();
        const leaseExpiry = new Date(now.getTime() + this.leaseMs);

        const db = prisma as unknown as DbLike;

        return db.$transaction(async (tx) => {
            const rows = await tx.$queryRaw<ClaimCandidateRow[]>(
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
        `,
            );

            if (rows.length === 0) return null;

            for (const candidate of rows) {
                const repoScope = normalizeRepoScope(candidate.repoScope);

                let reposToCheck: string[] = repoScope;

                const packetCtx = await this.loadWorkPacketContext(tx, candidate.workPacketId);
                if (!packetCtx) {
                    continue;
                }

                if (reposToCheck.length === 0) {
                    reposToCheck = packetCtx.repoName ? [packetCtx.repoName] : [];
                }

                if (reposToCheck.length === 0) {
                    continue;
                }

                const scopeRes = validateReposAgainstAgentScope(this.nhId, reposToCheck);
                if (!scopeRes.valid) {
                    continue;
                }

                const claimable = await this.canClaimCandidate(tx, candidate, packetCtx);
                if (!claimable) {
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
                })) as {
                    id: string;
                    workPacketId: number;
                    agentNhId: string;
                    status: string;
                    claimedAt: Date | null;
                    leaseExpiry: Date | null;
                    repoScope: string[] | null;
                };

                const item: AgentQueueItem = {
                    id: updated.id,
                    workPacketId: updated.workPacketId,
                    agentNhId: updated.agentNhId,
                    repoScope: normalizeRepoScope(updated.repoScope),
                    status: toStatus(updated.status),
                    claimedAt: toDate(updated.claimedAt),
                    leaseExpiry: toDate(updated.leaseExpiry),
                };

                await this.onClaimed(tx, item, packetCtx);
                return item;
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

            const packetCtx = await this.loadWorkPacketContext(tx, updated.workPacketId);

            await this.emitRuntimeEvent(tx, {
                kind: "WORK_REQUEUED",
                nhId: packetCtx?.nhId ?? null,
                repoId: packetCtx?.repoId ?? null,
                workPacketId: updated.workPacketId,
                summary: `Work requeued: ${packetCtx?.nhId ?? `workPacket#${updated.workPacketId}`} (${reason})`,
                payload: {
                    schema: "agent-runtime-0.1",
                    agentNhId: this.nhId,
                    queueItemId: updated.id,
                    workPacketId: updated.workPacketId,
                    reason,
                    requestedRole: packetCtx?.requestedRole ?? null,
                    assigneeNhId: packetCtx?.assigneeNhId ?? null,
                },
            });
        });
    }

    protected async complete(
        item: AgentQueueItem,
        extra?: Record<string, unknown>,
    ): Promise<void> {
        const db = prisma as unknown as DbLike;

        await db.$transaction(async (tx) => {
            const updated = (await tx.agentQueueItem.update({
                where: { id: item.id },
                data: { status: "COMPLETED", leaseExpiry: null },
                select: { id: true, workPacketId: true },
            })) as { id: string; workPacketId: number };

            const packetCtx = await this.loadWorkPacketContext(tx, updated.workPacketId);

            await this.emitRuntimeEvent(tx, {
                kind: "WORK_COMPLETED",
                nhId: packetCtx?.nhId ?? null,
                repoId: packetCtx?.repoId ?? null,
                workPacketId: updated.workPacketId,
                summary: `Work completed: ${packetCtx?.nhId ?? `workPacket#${updated.workPacketId}`} by ${this.nhId}`,
                payload: {
                    schema: "agent-runtime-0.1",
                    agentNhId: this.nhId,
                    queueItemId: updated.id,
                    workPacketId: updated.workPacketId,
                    requestedRole: packetCtx?.requestedRole ?? null,
                    assigneeNhId: packetCtx?.assigneeNhId ?? null,
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

            const packetCtx = await this.loadWorkPacketContext(tx, updated.workPacketId);

            await this.emitRuntimeEvent(tx, {
                kind: "WORK_FAILED",
                nhId: packetCtx?.nhId ?? null,
                repoId: packetCtx?.repoId ?? null,
                workPacketId: updated.workPacketId,
                summary: `Work failed: ${packetCtx?.nhId ?? `workPacket#${updated.workPacketId}`} by ${this.nhId}`,
                payload: {
                    schema: "agent-runtime-0.1",
                    agentNhId: this.nhId,
                    queueItemId: updated.id,
                    workPacketId: updated.workPacketId,
                    requestedRole: packetCtx?.requestedRole ?? null,
                    assigneeNhId: packetCtx?.assigneeNhId ?? null,
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
                const packetCtx = await this.loadWorkPacketContext(tx, e.workPacketId);

                await this.emitRuntimeEvent(tx, {
                    kind: "WORK_FAILED",
                    nhId: packetCtx?.nhId ?? null,
                    repoId: packetCtx?.repoId ?? null,
                    workPacketId: e.workPacketId,
                    summary: `Lease expired: ${packetCtx?.nhId ?? `workPacket#${e.workPacketId}`} requeued`,
                    payload: {
                        schema: "agent-runtime-0.1",
                        agentNhId: this.nhId,
                        queueItemId: e.id,
                        workPacketId: e.workPacketId,
                        requestedRole: packetCtx?.requestedRole ?? null,
                        assigneeNhId: packetCtx?.assigneeNhId ?? null,
                        reason: "lease_expired",
                        previousLeaseExpiry: e.leaseExpiry?.toISOString?.() ?? null,
                    },
                });
            }
        });
    }

    private async emitAgentSotEvent(
        db: DbLikeTx,
        args: {
            kind: AgentSotKind;
            nhId: string | null;
            repoId: number | null;
            workPacketId: number;
            summary: string;
            payload: Record<string, unknown>;
        },
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
                nhId: args.nhId ?? "",
                summary: args.summary,
                payload: sotEvent as Prisma.InputJsonValue,
                repoId: args.repoId ?? null,
                workPacketId: args.workPacketId,
            },
        });
    }
}
