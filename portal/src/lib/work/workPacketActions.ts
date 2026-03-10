import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { emitWorkPacketSotEvent } from "@/lib/sotWorkPackets";
import { InboxItemStatus, WorkPacketStatus, type Prisma } from "@prisma/client";
import { buildInboxTags } from "./workPacketContract";

export type PacketRouteAction =
    | "ROUTE_ARCHITECT"
    | "ROUTE_BUILDER"
    | "ROUTE_VERIFIER"
    | "REQUEST_CHANGES"
    | "REQUEUE"
    | "APPROVE";

export async function applyPacketRouteAction(args: {
    packetId: number;
    actor: { email: string | null; name: string | null };
    action: PacketRouteAction;
    assigneeNhId?: string | null;
    note?: string | null;
}) {
    // shared transaction:
    // - load packet
    // - load/update/create inbox item
    // - update packet status if needed
    // - emit packet-linked SoT event
    // - return summary object for redirect/UI feedback
}
