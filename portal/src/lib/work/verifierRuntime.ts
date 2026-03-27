import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { assertSotEventV01 } from "@/lib/contracts/sotEventV01";
import {
    BaseAgentRuntime,
    type AgentQueueItem,
    type WorkPacketRuntimeContext,
} from "@/lib/agentRuntime";
import { applyPacketRouteAction } from "@/lib/work/workPacketActions";

function compactText(input: string, max: number): string {
    const s = String(input ?? "").trim().replace(/\s+/g, " ");
    return s.length <= max ? s : `${s.slice(0, Math.max(0, max - 1))}…`;
}

function packetLabel(packet: WorkPacketRuntimeContext): string {
    return packet.nhId ?? `workPacket#${packet.id}`;
}

function buildVerificationPayload(packet: WorkPacketRuntimeContext, agentNhId: string) {
    return {
        schema: "verifier-runtime-0.1",
        contract_version: "work-packet-0.1",
        artifactKind: "debug.verify",
        agentNhId,
        workPacketId: packet.id,
        nhId: packet.nhId,
        repoName: packet.repoName,
        requestedRole: packet.requestedRole,
        assigneeNhId: packet.assigneeNhId,
        verify: {
            kind: "synthetic-verifier-proof",
            summary: `Verifier evidence recorded for ${packetLabel(packet)}`,
            checks: [
                "Verifier runtime claimed a queue-backed verifier packet.",
                "Verification evidence was emitted as debug.verify.",
                "Packet is now ready for operator review handoff.",
            ],
            handoffTarget: "OPERATOR_REVIEW",
        },
    };
}

export class VerifierAgentRuntime extends BaseAgentRuntime {
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

        return packet.requestedRole === "VERIFIER";
    }

    override async execute(item: AgentQueueItem): Promise<void> {
        const packet = await (
            prisma as unknown as {
                $transaction: <T>(fn: (tx: unknown) => Promise<T>) => Promise<T>;
            }
        ).$transaction(async (tx) => {
            const loaded = await this.loadWorkPacketContext(
                tx as Parameters<BaseAgentRuntime["loadWorkPacketContext"]>[0],
                item.workPacketId,
            );

            if (!loaded) {
                throw new Error(`WorkPacket not found for queue item: ${item.id}`);
            }

            if (loaded.requestedRole !== "VERIFIER") {
                throw new Error(
                    `Verifier runtime claimed non-verifier packet ${packetLabel(loaded)} (role=${loaded.requestedRole ?? "null"})`,
                );
            }

            await this.emitDebugArtifact(
                tx as Parameters<BaseAgentRuntime["emitDebugArtifact"]>[0],
                {
                    kind: "debug.verify",
                    nhId: loaded.nhId,
                    repoId: loaded.repoId,
                    workPacketId: loaded.id,
                    summary: `Verifier evidence recorded: ${packetLabel(loaded)}`,
                    payload: buildVerificationPayload(loaded, this.nhId),
                },
            );

            return loaded;
        });

        await this.complete(item, {
            completedRole: "VERIFIER",
            handoffTarget: "OPERATOR_REVIEW",
            result: "verifier_evidence_recorded",
            artifactKind: "debug.verify",
            note: `Verifier slice complete for ${packetLabel(packet)}.`,
        });

        await applyPacketRouteAction({
            packetId: packet.id,
            action: "ROUTE_OPERATOR_REVIEW",
            actor: {
                email: null,
                name: `verifier-runtime:${this.nhId}`,
            },
            note: `Verifier runtime completed packet ${packetLabel(packet)} and routed it to operator review.`,
        });
    }
}

export function createVerifierAgentRuntime(
    nhId: string,
    pollIntervalMs?: number,
): VerifierAgentRuntime {
    return new VerifierAgentRuntime(nhId, pollIntervalMs);
}
