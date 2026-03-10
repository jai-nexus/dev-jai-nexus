import { compactText, deriveRequestedRoleFromAgentKey, type RequestedRole } from "./workPacketContract";

export const RUNTIME_EVENT_KINDS = [
    "WORK_CLAIMED",
    "WORK_COMPLETED",
    "WORK_FAILED",
    "WORK_REQUEUED",
] as const;

export const DEBUG_LOOP_EVENT_KINDS = [
    "debug.plan",
    "debug.patch",
    "debug.verify",
    "debug.docs",
    "debug.approve",
] as const;

export const HANDOFF_EVENT_KINDS = [
    "WORK_DELEGATED",
    "WORK_CLAIMED",
    "WORK_REQUEUED",
] as const;

export type RuntimeOrDebugKind =
    | (typeof RUNTIME_EVENT_KINDS)[number]
    | (typeof DEBUG_LOOP_EVENT_KINDS)[number];

export type HandoffKind = (typeof HANDOFF_EVENT_KINDS)[number];

export type AgentEventLike = {
    id: number | string;
    kind: string;
    summary: string | null;
    ts: Date;
    payload: unknown;
};

export type AgentRunLedgerStatus =
    | "CLAIMED"
    | "COMPLETED"
    | "FAILED"
    | "REQUEUED"
    | "ARTIFACT";

export type AgentRunLedgerEntry = {
    id: string;
    ts: Date;
    kind: string;
    role: RequestedRole | "SYSTEM";
    agentNhId: string | null;
    status: AgentRunLedgerStatus;
    summary: string;
    detail: string;
    payload: unknown;
};

export type HandoffEntry = {
    id: string;
    ts: Date;
    kind: string;
    fromAgentNhId: string | null;
    toAgentNhId: string | null;
    role: RequestedRole | "SYSTEM";
    summary: string;
    payload: unknown;
};

function asRecord(v: unknown): Record<string, unknown> | null {
    return v !== null && typeof v === "object" && !Array.isArray(v)
        ? (v as Record<string, unknown>)
        : null;
}

function getMaybeRecord(v: unknown, key: string): Record<string, unknown> | null {
    const r = asRecord(v);
    if (!r) return null;
    return asRecord(r[key]);
}

export function getEventData(payload: unknown): Record<string, unknown> {
    const top = asRecord(payload);
    if (!top) return {};
    const data = getMaybeRecord(top, "data");
    if (data) return data;
    const inner = getMaybeRecord(top, "payload");
    if (inner) return inner;
    return top;
}

export function getAgentNhIdFromPayload(payload: unknown): string | null {
    const data = getEventData(payload);

    const direct = data.agentNhId;
    if (typeof direct === "string" && direct.trim()) return direct.trim();

    const toAgentNhId = data.toAgentNhId;
    if (typeof toAgentNhId === "string" && toAgentNhId.trim()) return toAgentNhId.trim();

    const fromAgent = asRecord(data.fromAgent);
    if (fromAgent && typeof fromAgent.nhId === "string" && fromAgent.nhId.trim()) {
        return fromAgent.nhId.trim();
    }

    return null;
}

export function getRoleFromEvent(evt: AgentEventLike): RequestedRole | "SYSTEM" {
    const kind = evt.kind;

    if (kind === "debug.plan") return "ARCHITECT";
    if (kind === "debug.patch") return "BUILDER";
    if (kind === "debug.verify") return "VERIFIER";
    if (kind === "debug.docs") return "LIBRARIAN";
    if (kind === "debug.approve") return "OPERATOR";

    const data = getEventData(evt.payload);

    if (typeof data.toAgentKey === "string") {
        return deriveRequestedRoleFromAgentKey(data.toAgentKey) ?? "SYSTEM";
    }

    if (typeof data.agentKey === "string") {
        return deriveRequestedRoleFromAgentKey(data.agentKey) ?? "SYSTEM";
    }

    return "SYSTEM";
}

export function toRunLedgerEntry(evt: AgentEventLike): AgentRunLedgerEntry {
    let status: AgentRunLedgerStatus = "ARTIFACT";

    if (evt.kind === "WORK_CLAIMED") status = "CLAIMED";
    if (evt.kind === "WORK_COMPLETED") status = "COMPLETED";
    if (evt.kind === "WORK_FAILED") status = "FAILED";
    if (evt.kind === "WORK_REQUEUED") status = "REQUEUED";

    return {
        id: String(evt.id),
        ts: evt.ts,
        kind: evt.kind,
        role: getRoleFromEvent(evt),
        agentNhId: getAgentNhIdFromPayload(evt.payload),
        status,
        summary: compactText(evt.summary, 180),
        detail: compactText(JSON.stringify(getEventData(evt.payload)), 220),
        payload: evt.payload,
    };
}

export function toHandoffEntry(evt: AgentEventLike): HandoffEntry {
    const data = getEventData(evt.payload);
    const fromAgent = asRecord(data.fromAgent);

    const fromAgentNhId =
        fromAgent && typeof fromAgent.nhId === "string" && fromAgent.nhId.trim()
            ? fromAgent.nhId.trim()
            : evt.kind === "WORK_REQUEUED"
                ? getAgentNhIdFromPayload(evt.payload)
                : null;

    const toAgentNhId =
        evt.kind === "WORK_DELEGATED"
            ? (typeof data.toAgentNhId === "string" && data.toAgentNhId.trim() ? data.toAgentNhId.trim() : null)
            : getAgentNhIdFromPayload(evt.payload);

    return {
        id: String(evt.id),
        ts: evt.ts,
        kind: evt.kind,
        fromAgentNhId,
        toAgentNhId,
        role: getRoleFromEvent(evt),
        summary: compactText(evt.summary, 180),
        payload: evt.payload,
    };
}
