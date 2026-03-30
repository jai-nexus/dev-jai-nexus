import fs from "node:fs";
import path from "node:path";

import { prisma } from "@/lib/prisma";
import {
    BaseAgentRuntime,
    type AgentQueueItem,
    type WorkPacketRuntimeContext,
} from "@/lib/agentRuntime";
import { applyPacketRouteAction } from "@/lib/work/workPacketActions";
import { getMotionFromTags } from "@/lib/work/workPacketContract";

type MotionContext = {
    motionId: string;
    title: string;
    executionPlan: string;
};

function findRepoRoot(startDir: string): string | null {
    let cur = startDir;
    for (let i = 0; i < 8; i++) {
        if (fs.existsSync(path.join(cur, ".nexus"))) return cur;
        const parent = path.dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return null;
}

function loadMotionContext(inboxTags: string[]): MotionContext | null {
    const motionId = getMotionFromTags(inboxTags);
    if (!motionId) return null;

    const repoRoot = findRepoRoot(process.cwd());
    if (!repoRoot) {
        console.warn(`[verifierRuntime] Cannot load motion context for ${motionId}: repo root not found`);
        return null;
    }

    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
    const motionYamlPath = path.join(motionDir, "motion.yaml");
    const executionMdPath = path.join(motionDir, "execution.md");

    let title = motionId;
    try {
        if (fs.existsSync(motionYamlPath)) {
            const raw = fs.readFileSync(motionYamlPath, "utf8");
            const m = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m);
            if (m?.[1]) title = m[1].trim();
        }
    } catch {
        // fallback: use motionId as title
    }

    let executionPlan = "";
    try {
        if (fs.existsSync(executionMdPath)) {
            executionPlan = fs.readFileSync(executionMdPath, "utf8");
        } else {
            console.warn(`[verifierRuntime] execution.md absent for ${motionId} — verify context will be empty`);
        }
    } catch {
        console.warn(`[verifierRuntime] Could not read execution.md for ${motionId}`);
    }

    return { motionId, title, executionPlan };
}

function packetLabel(packet: WorkPacketRuntimeContext): string {
    return packet.nhId ?? `workPacket#${packet.id}`;
}

function buildVerificationPayload(
    packet: WorkPacketRuntimeContext,
    agentNhId: string,
    motionContext?: MotionContext | null,
): Record<string, unknown> {
    const base = {
        schema: "verifier-runtime-0.1",
        contract_version: "work-packet-0.1",
        artifactKind: "debug.verify",
        agentNhId,
        workPacketId: packet.id,
        nhId: packet.nhId,
        repoName: packet.repoName,
        requestedRole: packet.requestedRole,
        assigneeNhId: packet.assigneeNhId,
    };

    if (motionContext) {
        return {
            ...base,
            motionId: motionContext.motionId,
            motionTitle: motionContext.title,
            executionPlan: motionContext.executionPlan || "(execution.md absent)",
            verify: {
                kind: "synthetic-verifier-proof",
                summary: `Verifier evidence recorded for ${packetLabel(packet)} (governed by ${motionContext.motionId})`,
                checks: [
                    `Verifier runtime claimed a motion-linked packet (${motionContext.motionId}).`,
                    "Verification evidence is governed by the motion's execution.md.",
                    "Packet is now ready for operator review handoff.",
                ],
                handoffTarget: "OPERATOR_REVIEW",
            },
        };
    }

    return {
        ...base,
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

            const motionContext = loadMotionContext(loaded.inboxTags);

            await this.emitDebugArtifact(
                tx as Parameters<BaseAgentRuntime["emitDebugArtifact"]>[0],
                {
                    kind: "debug.verify",
                    nhId: loaded.nhId,
                    repoId: loaded.repoId,
                    workPacketId: loaded.id,
                    summary: `Verifier evidence recorded: ${packetLabel(loaded)}`,
                    payload: buildVerificationPayload(loaded, this.nhId, motionContext),
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
