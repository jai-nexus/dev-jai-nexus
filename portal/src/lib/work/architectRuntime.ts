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
        console.warn(`[architectRuntime] Cannot load motion context for ${motionId}: repo root not found`);
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
            console.warn(`[architectRuntime] execution.md absent for ${motionId} — plan context will be empty`);
        }
    } catch {
        console.warn(`[architectRuntime] Could not read execution.md for ${motionId}`);
    }

    return { motionId, title, executionPlan };
}

function packetLabel(packet: WorkPacketRuntimeContext): string {
    return packet.nhId ?? `workPacket#${packet.id}`;
}

function buildArchitectPlan(
    packet: WorkPacketRuntimeContext,
    agentNhId: string,
    motionContext?: MotionContext | null,
) {
    const base = {
        schema: "architect-runtime-0.1",
        agentNhId,
        workPacketId: packet.id,
        requestedRole: packet.requestedRole,
        assigneeNhId: packet.assigneeNhId,
        repoName: packet.repoName,
    };

    if (motionContext) {
        return {
            ...base,
            motionId: motionContext.motionId,
            motionTitle: motionContext.title,
            plan: {
                objective: `Architect review for governed motion ${motionContext.motionId}: ${motionContext.title}`,
                governedBy: motionContext.motionId,
                executionPlan: motionContext.executionPlan || "(execution.md absent)",
                checkpoints: [
                    `Review execution.md for ${motionContext.motionId} implementation surface.`,
                    "Confirm proposed changes match motion success criteria.",
                    "Record governed architect evidence before BUILDER handoff.",
                ],
                handoffTarget: "BUILDER",
            },
        };
    }

    return {
        ...base,
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

                const motionContext = loadMotionContext(loaded.inboxTags);

                await this.emitDebugArtifact(
                    tx as Parameters<BaseAgentRuntime["emitDebugArtifact"]>[0],
                    {
                        kind: "debug.plan",
                        nhId: loaded.nhId,
                        repoId: loaded.repoId,
                        workPacketId: loaded.id,
                        summary: `Architect plan recorded: ${packetLabel(loaded)}`,
                        payload: buildArchitectPlan(loaded, this.nhId, motionContext),
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
