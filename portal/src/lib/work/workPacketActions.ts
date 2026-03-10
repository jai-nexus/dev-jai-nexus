import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";
import {
    emitWorkPacketSotEvent,
    type WorkPacketSotKind,
} from "@/lib/sotWorkPackets";
import { InboxItemStatus, WorkPacketStatus, type Prisma } from "@prisma/client";

import {
    buildInboxTags,
    coerceStringArray,
    getAssigneeFromTags,
} from "./workPacketContract";

export type PacketRouteAction =
    | "ROUTE_ARCHITECT"
    | "ROUTE_BUILDER"
    | "ROUTE_VERIFIER"
    | "REQUEST_CHANGES"
    | "REQUEUE"
    | "APPROVE";

const KNOWN_PACKET_STATUSES = new Set<string>(Object.values(WorkPacketStatus));

function packetStatusIfAvailable(
    candidate: string,
    fallback: WorkPacketStatus,
): WorkPacketStatus {
    return KNOWN_PACKET_STATUSES.has(candidate)
        ? (candidate as WorkPacketStatus)
        : fallback;
}

function routeLaneForAction(action: PacketRouteAction): string | null {
    if (action === "ROUTE_ARCHITECT") return "ARCHITECT";
    if (action === "ROUTE_BUILDER") return "BUILDER";
    if (action === "ROUTE_VERIFIER") return "VERIFIER";
    if (action === "APPROVE") return "OPERATOR_REVIEW";
    return null;
}

function eventKindForAction(action: PacketRouteAction): WorkPacketSotKind {
    if (action === "REQUEST_CHANGES") return "WORK_REVIEW_REQUESTED";
    if (action === "REQUEUE") return "WORK_REQUEUED";
    if (action === "APPROVE") return "WORK_APPROVED";
    return "WORK_ROUTED";
}

function summaryForAction(
    action: PacketRouteAction,
    nhId: string,
    targetLane: string | null,
) {
    if (action === "REQUEST_CHANGES") return `Changes requested: ${nhId}`;
    if (action === "REQUEUE") return `Work requeued: ${nhId}`;
    if (action === "APPROVE") return `Work approved: ${nhId}`;
    return `Work routed: ${nhId} → ${targetLane ?? "UNKNOWN"}`;
}

function nextStatusForAction(
    action: PacketRouteAction,
    current: WorkPacketStatus,
): WorkPacketStatus {
    if (action === "REQUEST_CHANGES") {
        return packetStatusIfAvailable("CHANGES_REQUESTED", current);
    }

    if (action === "APPROVE") {
        return packetStatusIfAvailable("APPROVED", current);
    }

    if (action === "REQUEUE") {
        return packetStatusIfAvailable("DRAFT", current);
    }

    return current;
}

function nextPriorityForAction(
    action: PacketRouteAction,
    currentPriority: number,
) {
    if (action === "ROUTE_VERIFIER") return 80;
    if (action === "ROUTE_BUILDER") return 70;
    if (action === "ROUTE_ARCHITECT") return 60;
    if (action === "REQUEST_CHANGES") return 75;
    if (action === "REQUEUE") return 65;
    return currentPriority;
}

function routeTagForAction(action: PacketRouteAction): string | null {
    const lane = routeLaneForAction(action);
    return lane ? `route:${lane}` : null;
}

function stripManagedTags(tags: string[]) {
    return tags.filter(
        (t) => !t.startsWith("assignee:") && !t.startsWith("route:"),
    );
}

export async function applyPacketRouteAction(args: {
    packetId: number;
    actor: { email: string | null; name: string | null };
    action: PacketRouteAction;
    assigneeNhId?: string | null;
    note?: string | null;
}) {
    const mutationId = crypto.randomUUID();

    return prisma.$transaction(async (tx) => {
        const packet = await tx.workPacket.findUnique({
            where: { id: args.packetId },
            select: {
                id: true,
                nhId: true,
                title: true,
                repoId: true,
                status: true,
            },
        });

        if (!packet) {
            throw new Error(`WorkPacket not found: ${args.packetId}`);
        }

        const latestInbox = await tx.agentInboxItem.findFirst({
            where: { workPacketId: packet.id },
            orderBy: { id: "desc" },
            select: {
                id: true,
                status: true,
                priority: true,
                tags: true,
            },
        });

        const existingTags = coerceStringArray(latestInbox?.tags);
        const existingAssigneeNhId = getAssigneeFromTags(existingTags);
        const effectiveAssigneeNhId =
            args.assigneeNhId ?? existingAssigneeNhId ?? null;

        const targetLane = routeLaneForAction(args.action);
        const nextPacketStatus = nextStatusForAction(args.action, packet.status);
        const nextPriority = nextPriorityForAction(
            args.action,
            latestInbox?.priority ?? 50,
        );

        const nextTags = [
            ...stripManagedTags(existingTags),
            ...buildInboxTags(effectiveAssigneeNhId),
        ];

        const routeTag = routeTagForAction(args.action);
        if (routeTag) nextTags.push(routeTag);

        const dedupedTags = Array.from(new Set(nextTags));

        if (packet.status !== nextPacketStatus) {
            await tx.workPacket.update({
                where: { id: packet.id },
                data: { status: nextPacketStatus },
            });
        }

        const inbox =
            latestInbox != null
                ? await tx.agentInboxItem.update({
                    where: { id: latestInbox.id },
                    data: {
                        status: InboxItemStatus.QUEUED,
                        priority: nextPriority,
                        tags: dedupedTags,
                    },
                    select: {
                        id: true,
                        status: true,
                        priority: true,
                        tags: true,
                    },
                })
                : await tx.agentInboxItem.create({
                    data: {
                        workPacketId: packet.id,
                        status: InboxItemStatus.QUEUED,
                        priority: nextPriority,
                        tags: dedupedTags,
                    },
                    select: {
                        id: true,
                        status: true,
                        priority: true,
                        tags: true,
                    },
                });

        const kind = eventKindForAction(args.action);
        const summary = summaryForAction(args.action, packet.nhId, targetLane);

        const data: Prisma.InputJsonValue = {
            contract_version: "work-packet-0.1",
            workPacketId: packet.id,
            action: args.action,
            targetLane,
            assigneeNhId: effectiveAssigneeNhId,
            previousStatus: packet.status,
            nextStatus: nextPacketStatus,
            inbox: {
                inboxItemId: inbox.id,
                status: inbox.status,
                priority: inbox.priority,
                tags: inbox.tags,
            },
            ...(args.note ? { note: args.note } : {}),
        };

        await emitWorkPacketSotEvent({
            db: tx,
            kind,
            nhId: packet.nhId,
            repoId: packet.repoId ?? null,
            summary,
            mutationId,
            workPacket: { id: packet.id, nhId: packet.nhId },
            actor: args.actor,
            data,
        });

        return {
            ok: true as const,
            packetId: packet.id,
            action: args.action,
            kind,
            summary,
            targetLane,
            assigneeNhId: effectiveAssigneeNhId,
            nextStatus: nextPacketStatus,
            inboxStatus: inbox.status,
            inboxPriority: inbox.priority,
            inboxTags: coerceStringArray(inbox.tags),
        };
    });
}
