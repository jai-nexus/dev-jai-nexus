import type { RequestedRole } from "./workPacketContract";

export type WorkPacketControlPhase =
    | "UNASSIGNED"
    | "QUEUED"
    | "ACTIVE"
    | "PATCH_READY"
    | "VERIFY_READY"
    | "COMPLETE"
    | "ATTENTION";

export type WorkPacketControlTone = "slate" | "sky" | "amber" | "emerald" | "red" | "purple";

export type WorkPacketControlState = {
    phase: WorkPacketControlPhase;
    tone: WorkPacketControlTone;
    reason: string;
    nextAction: string;
};

function normalizeStatus(input: string | null | undefined): string {
    return String(input ?? "").trim().toUpperCase();
}

function looksCompleteStatus(status: string) {
    return ["COMPLETED", "COMPLETE", "DONE", "APPROVED", "APPLIED", "CLOSED", "VERIFIED"].includes(status);
}

function looksAttentionStatus(status: string) {
    return ["FAILED", "BLOCKED", "REJECTED", "ERROR"].includes(status);
}

export function computeWorkPacketControlState(input: {
    packetStatus: string | null | undefined;
    assigneeNhId?: string | null;
    requestedRole?: RequestedRole | null;
    githubPrUrl?: string | null;
    verificationUrl?: string | null;
    latestRuntimeKind?: string | null;
    latestDebugKind?: string | null;
}): WorkPacketControlState {
    const packetStatus = normalizeStatus(input.packetStatus);
    const latestRuntimeKind = normalizeStatus(input.latestRuntimeKind);
    const latestDebugKind = normalizeStatus(input.latestDebugKind);

    if (latestRuntimeKind === "WORK_FAILED" || looksAttentionStatus(packetStatus)) {
        return {
            phase: "ATTENTION",
            tone: "red",
            reason: "Latest runtime signal indicates failure or the packet status is in an error/reject state.",
            nextAction: "Inspect failure details, decide whether to request changes, requeue, or reject.",
        };
    }

    if (latestDebugKind === "DEBUG.APPROVE" || looksCompleteStatus(packetStatus)) {
        return {
            phase: "COMPLETE",
            tone: "emerald",
            reason: "Packet has reached an approval/completion-shaped state.",
            nextAction: "No immediate action required unless follow-up work is needed.",
        };
    }

    if (input.verificationUrl || latestDebugKind === "DEBUG.VERIFY") {
        return {
            phase: "VERIFY_READY",
            tone: "emerald",
            reason: "Verification evidence is present or verifier artifacts exist.",
            nextAction: "Review verification evidence and approve, reject, or request changes.",
        };
    }

    if (input.githubPrUrl || latestDebugKind === "DEBUG.PATCH") {
        return {
            phase: "PATCH_READY",
            tone: "purple",
            reason: "A patch/PR-shaped artifact exists and is ready for verification.",
            nextAction: "Route to verifier and attach verification output.",
        };
    }

    if (latestRuntimeKind === "WORK_CLAIMED" || latestRuntimeKind === "WORK_REQUEUED" || latestDebugKind === "DEBUG.PLAN") {
        return {
            phase: "ACTIVE",
            tone: "sky",
            reason: "An agent has claimed the work or execution artifacts have started to appear.",
            nextAction: "Monitor execution progress and verify expected artifacts appear.",
        };
    }

    if (input.assigneeNhId) {
        return {
            phase: "QUEUED",
            tone: "amber",
            reason: "Packet is assigned, but no stronger execution/verification signal exists yet.",
            nextAction: `Confirm ${input.requestedRole ?? "assigned"} execution begins and artifacts get attached.`,
        };
    }

    return {
        phase: "UNASSIGNED",
        tone: "slate",
        reason: "Packet exists without an assignee/execution lane.",
        nextAction: "Assign an agent and choose a repo to enter governed execution.",
    };
}
