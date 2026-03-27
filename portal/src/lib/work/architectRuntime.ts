import { prisma } from "@/lib/prisma";
import {
    BaseAgentRuntime,
    type AgentQueueItem,
    type WorkPacketRuntimeContext,
} from "@/lib/agentRuntime";
import { applyPacketRouteAction } from "@/lib/work/workPacketActions";

function packetLabel(packet: WorkPacketRuntimeContext): string {
    return packet.nhId ?? `workPacket#${packet.id}`;
}

function buildArchitectPlan(packet: WorkPacketRuntimeContext, agentNhId: string) {
    return {
        schema: "architect-runtime-0.1",
        agentNhId,
        workPacketId: packet.id,
        requestedRole: packet.requestedRole,
        assigneeNhId: packet.assigneeNhId,
        repoName: packet.repoName,
        plan: {
            objective: `Prepare builder-ready plan for ${packetLabel(packet)}`,
            checkpoints: [
                "Review packet intent, status, and current execution lane.",
                "Identify likely implementation surface and delivery shape.",
                "Record architect planning evidence before builder handoff.",
            ],
            handoffTarget: "BUILDER",
        },
    };
}

export class ArchitectAgentRuntime extends BaseAgentRuntime {
    protected override async canClaimCandidate(
        tx: Parameters<BaseAgentRuntime["loadWorkPacketContext"]>[0],
        candidate: {
            id: string;
            workPacketId: number;
            agentNhId: string;
            status: string;
            claimedAt: Date | null;
            leaseExpiry: Date | null;
            repoScope: string[] | null;
        },
        packet: WorkPacketRuntimeContext,
    ): Promise<boolean> {
        const baseOk = await super.canClaimCandidate(tx, candidate, packet);
        if (!baseOk) return false;

        return packet.requestedRole === "ARCHITECT";
    }

    override async execute(item: AgentQueueItem): Promise<void> {
        const packet = await (prisma as unknown as { $transaction: <T>(fn: (tx: unknown) => Promise<T>) => Promise<T> }).$transaction(
            async (tx) => {
                const loaded = await this.loadWorkPacketContext(
                    tx as Parameters<BaseAgentRuntime["loadWorkPacketContext"]>[0],
                    item.workPacketId,
                );

                if (!loaded) {
                    throw new Error(`WorkPacket not found for queue item: ${item.id}`);
                }

                if (loaded.requestedRole !== "ARCHITECT") {
                    throw new Error(
                        `Architect runtime claimed non-architect packet ${packetLabel(loaded)} (role=${loaded.requestedRole ?? "null"})`,
                    );
                }

                await this.emitDebugArtifact(
                    tx as Parameters<BaseAgentRuntime["emitDebugArtifact"]>[0],
                    {
                        kind: "debug.plan",
                        nhId: loaded.nhId,
                        repoId: loaded.repoId,
                        workPacketId: loaded.id,
                        summary: `Architect plan recorded: ${packetLabel(loaded)}`,
                        payload: buildArchitectPlan(loaded, this.nhId),
                    },
                );

                return loaded;
            },
        );

        await this.complete(item, {
            completedRole: "ARCHITECT",
            handoffTarget: "BUILDER",
            result: "architect_plan_recorded",
            note: `Architect slice complete for ${packetLabel(packet)}.`,
        });

        await applyPacketRouteAction({
            packetId: packet.id,
            action: "ROUTE_BUILDER",
            actor: {
                email: null,
                name: `Architect runtime ${this.nhId}`,
            },
            clearAssignee: true,
            note: `Automatic handoff to builder after architect completion by ${this.nhId}.`,
        });
    }
}

export function createArchitectAgentRuntime(
    nhId: string,
    pollIntervalMs?: number,
): ArchitectAgentRuntime {
    return new ArchitectAgentRuntime(nhId, pollIntervalMs);
}
