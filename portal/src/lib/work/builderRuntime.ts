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
        console.warn(`[builderRuntime] Cannot load motion context for ${motionId}: repo root not found`);
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
            console.warn(`[builderRuntime] execution.md absent for ${motionId} — patch context will be empty`);
        }
    } catch {
        console.warn(`[builderRuntime] Could not read execution.md for ${motionId}`);
    }

    return { motionId, title, executionPlan };
}

function packetLabel(packet: WorkPacketRuntimeContext): string {
    return packet.nhId ?? `workPacket#${packet.id}`;
}

function buildPatchPayload(
    packet: WorkPacketRuntimeContext,
    agentNhId: string,
    item: AgentQueueItem,
    motionContext?: MotionContext | null,
): Record<string, unknown> {
    const base = {
        schema: "debug-loop-0.1",
        contract_version: "work-packet-0.1",
        artifactKind: "debug.patch",
        agentNhId,
        queueItemId: item.id,
        workPacketId: packet.id,
        nhId: packet.nhId,
        repo: packet.repoName,
    };

    if (motionContext) {
        return {
            ...base,
            motionId: motionContext.motionId,
            motionTitle: motionContext.title,
            executionPlan: motionContext.executionPlan || "(execution.md absent)",
            patch: {
                kind: "synthetic-builder-proof",
                summary: `Builder patch recorded for ${packet.nhId} (governed by ${motionContext.motionId})`,
                notes: [
                    `Builder runtime claimed a motion-linked work packet (${motionContext.motionId}).`,
                    "Patch evidence is governed by the motion's execution.md.",
                    "Packet is now ready for verifier routing.",
                ],
            },
        };
    }

    return {
        ...base,
        patch: {
            kind: "synthetic-builder-proof",
            summary: `Builder patch recorded for ${packet.nhId}`,
            notes: [
                "Builder runtime claimed a queue-backed work packet.",
                "Patch evidence was emitted as debug.patch.",
                "Packet is now ready for verifier routing.",
            ],
        },
    };
}

export class BuilderAgentRuntime extends BaseAgentRuntime {
    constructor(nhId: string, pollIntervalMs = 5_000) {
        super(nhId, pollIntervalMs);
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
        return packet.requestedRole === "BUILDER";
    }

    override async execute(item: AgentQueueItem): Promise<void> {
        const packet = await (prisma as unknown as { $transaction: <T>(fn: (tx: unknown) => Promise<T>) => Promise<T> }).$transaction(
            async (tx) => {
                const loaded = await this.loadWorkPacketContext(
                    tx as Parameters<BaseAgentRuntime["loadWorkPacketContext"]>[0],
                    item.workPacketId,
                );

                if (!loaded) {
                    throw new Error(`Builder runtime could not find WorkPacket ${item.workPacketId}`);
                }

                if (loaded.requestedRole !== "BUILDER") {
                    throw new Error(
                        `Builder runtime claimed non-builder packet ${packetLabel(loaded)} (role=${loaded.requestedRole ?? "null"})`,
                    );
                }

                const motionContext = loadMotionContext(loaded.inboxTags);

                await this.emitDebugArtifact(
                    tx as Parameters<BaseAgentRuntime["emitDebugArtifact"]>[0],
                    {
                        kind: "debug.patch",
                        nhId: loaded.nhId,
                        repoId: loaded.repoId,
                        workPacketId: loaded.id,
                        summary: `Builder patch recorded: ${packetLabel(loaded)}`,
                        payload: buildPatchPayload(loaded, this.nhId, item, motionContext),
                    },
                );

                return loaded;
            },
        );

        await this.complete(item, {
            note: "Builder runtime recorded patch evidence",
            artifactKind: "debug.patch",
            agentNhId: this.nhId,
        });

        await applyPacketRouteAction({
            packetId: packet.id,
            action: "ROUTE_VERIFIER",
            actor: {
                email: null,
                name: `builder-runtime:${this.nhId}`,
            },
            note: `Builder runtime completed packet ${packet.nhId} and routed it to verifier.`,
        });
    }
}
