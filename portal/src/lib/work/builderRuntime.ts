import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { assertSotEventV01 } from "@/lib/contracts/sotEventV01";
import { BaseAgentRuntime, type AgentQueueItem } from "@/lib/agentRuntime";
import { applyPacketRouteAction } from "@/lib/work/workPacketActions";

type PacketSnapshot = {
    id: number;
    nhId: string;
    title: string;
    repoId: number | null;
    repo: { name: string } | null;
};

function compactText(input: string, max: number): string {
    const s = String(input ?? "").trim().replace(/\s+/g, " ");
    return s.length <= max ? s : `${s.slice(0, Math.max(0, max - 1))}…`;
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

    override async execute(item: AgentQueueItem): Promise<void> {
        const packet = await this.loadPacket(item.workPacketId);

        if (!packet) {
            throw new Error(`Builder runtime could not find WorkPacket ${item.workPacketId}`);
        }

        await this.emitPatchArtifact(packet, item);

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

    private async loadPacket(workPacketId: number): Promise<PacketSnapshot | null> {
        const packet = await prisma.workPacket.findUnique({
            where: { id: workPacketId },
            select: {
                id: true,
                nhId: true,
                title: true,
                repoId: true,
                repo: {
                    select: { name: true },
                },
            },
        });

        if (!packet) return null;

        return {
            id: packet.id,
            nhId: packet.nhId,
            title: packet.title,
            repoId: packet.repoId ?? null,
            repo: packet.repo ? { name: packet.repo.name } : null,
        };
    }

    private async emitPatchArtifact(packet: PacketSnapshot, item: AgentQueueItem): Promise<void> {
        const ts = new Date();
        const eventId = crypto.randomUUID();

        const payload = {
            schema: "debug-loop-0.1",
            contract_version: "work-packet-0.1",
            artifactKind: "debug.patch",
            agentNhId: this.nhId,
            queueItemId: item.id,
            workPacketId: packet.id,
            nhId: packet.nhId,
            repo: packet.repo?.name ?? null,
            patch: {
                kind: "synthetic-builder-proof",
                summary: `Builder patch recorded for ${packet.nhId}`,
                notes: [
                    "Builder runtime claimed a queue-backed work packet.",
                    "Patch evidence was emitted as debug.patch.",
                    "Packet is now ready for verifier routing.",
                ],
            },
        } satisfies Prisma.InputJsonValue;

        const sotEvent = {
            version: "0.1" as const,
            ts: ts.toISOString(),
            source: "jai-builder-runtime",
            kind: "debug.patch",
            summary: `Builder patch recorded: ${packet.nhId}`,
            nhId: packet.nhId,
            repoName: null,
            domainName: null,
            payload,
        };

        assertSotEventV01(sotEvent);

        await prisma.sotEvent.create({
            data: {
                eventId,
                ts,
                source: sotEvent.source,
                kind: sotEvent.kind,
                nhId: packet.nhId,
                summary: compactText(sotEvent.summary, 240),
                payload: sotEvent as Prisma.InputJsonValue,
                repoId: packet.repoId,
                workPacketId: packet.id,
            },
        });
    }
}
