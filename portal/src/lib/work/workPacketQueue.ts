import { AgentQueueStatus } from "@prisma/client";

type QueueTx = {
    agentQueueItem: {
        upsert(args: unknown): Promise<unknown>;
        deleteMany(args: unknown): Promise<unknown>;
    };
};

function normalizeRepoScope(repoScope?: string[] | null): string[] {
    if (!Array.isArray(repoScope)) return [];
    return Array.from(
        new Set(
            repoScope
                .map((v) => String(v ?? "").trim())
                .filter(Boolean),
        ),
    );
}

export async function syncAgentQueueItemForPacket(
    tx: QueueTx,
    args: {
        workPacketId: number;
        assigneeNhId: string | null;
        repoScope?: string[] | null;
    },
) {
    const repoScope = normalizeRepoScope(args.repoScope);

    if (!args.assigneeNhId) {
        await tx.agentQueueItem.deleteMany({
            where: { workPacketId: args.workPacketId },
        });

        return {
            mode: "deleted" as const,
            workPacketId: args.workPacketId,
            assigneeNhId: null,
            repoScope,
        };
    }

    const queueItem = await tx.agentQueueItem.upsert({
        where: { workPacketId: args.workPacketId },
        update: {
            agentNhId: args.assigneeNhId,
            repoScope,
            status: AgentQueueStatus.PENDING,
            claimedAt: null,
            leaseExpiry: null,
        },
        create: {
            workPacketId: args.workPacketId,
            agentNhId: args.assigneeNhId,
            repoScope,
            status: AgentQueueStatus.PENDING,
        },
    });

    return {
        mode: "upserted" as const,
        workPacketId: args.workPacketId,
        assigneeNhId: args.assigneeNhId,
        repoScope,
        queueItem,
    };
}
