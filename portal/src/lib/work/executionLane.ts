import type { RequestedRole } from "./workPacketContract";

export type ExecutionLane =
    | "UNASSIGNED"
    | "ARCHITECT"
    | "BUILDER"
    | "VERIFIER"
    | "OPERATOR_REVIEW"
    | "COMPLETE"
    | "ATTENTION";

export type ExecutionLaneState = {
    currentLane: ExecutionLane;
    nextLane: ExecutionLane | null;
    reason: string;
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

function requestedRoleToLane(role: RequestedRole | null | undefined): ExecutionLane | null {
    if (role === "ARCHITECT") return "ARCHITECT";
    if (role === "BUILDER") return "BUILDER";
    if (role === "VERIFIER") return "VERIFIER";
    return null;
}

function nextLaneForRole(role: RequestedRole | null | undefined): ExecutionLane | null {
    if (role === "ARCHITECT") return "BUILDER";
    if (role === "BUILDER") return "VERIFIER";
    if (role === "VERIFIER") return "OPERATOR_REVIEW";
    return null;
}

export function computeExecutionLaneState(input: {
    packetStatus: string | null | undefined;
    requestedRole?: RequestedRole | null;
    assigneeNhId?: string | null;
    githubPrUrl?: string | null;
    verificationUrl?: string | null;
    latestRuntimeKind?: string | null;
    latestDebugKind?: string | null;
}): ExecutionLaneState {
    const packetStatus = normalizeStatus(input.packetStatus);
    const latestRuntimeKind = normalizeStatus(input.latestRuntimeKind);
    const latestDebugKind = normalizeStatus(input.latestDebugKind);

    if (latestRuntimeKind === "WORK_FAILED" || looksAttentionStatus(packetStatus)) {
        return {
            currentLane: "ATTENTION",
            nextLane: "OPERATOR_REVIEW",
            reason: "Latest runtime signal indicates failure or the packet status is in an error/reject state.",
        };
    }

    if (latestDebugKind === "DEBUG.APPROVE" || looksCompleteStatus(packetStatus)) {
        return {
            currentLane: "COMPLETE",
            nextLane: null,
            reason: "Packet has reached an approval/completion-shaped state.",
        };
    }

    if (input.verificationUrl || latestDebugKind === "DEBUG.VERIFY") {
        return {
            currentLane: "VERIFIER",
            nextLane: "OPERATOR_REVIEW",
            reason: "Verification evidence is present or verifier artifacts exist.",
        };
    }

    if (input.githubPrUrl || latestDebugKind === "DEBUG.PATCH") {
        return {
            currentLane: "BUILDER",
            nextLane: "VERIFIER",
            reason: "A patch/PR-shaped artifact exists and is ready for verification.",
        };
    }

    if (latestDebugKind === "DEBUG.PLAN") {
        return {
            currentLane: "ARCHITECT",
            nextLane: "BUILDER",
            reason: "Plan artifacts exist and the next governed lane is builder execution.",
        };
    }

    if (latestRuntimeKind === "WORK_CLAIMED") {
        return {
            currentLane: requestedRoleToLane(input.requestedRole) ?? "UNASSIGNED",
            nextLane: nextLaneForRole(input.requestedRole),
            reason: "A work item has been claimed and is active in its assigned execution lane.",
        };
    }

    if (input.assigneeNhId) {
        return {
            currentLane: requestedRoleToLane(input.requestedRole) ?? "UNASSIGNED",
            nextLane: nextLaneForRole(input.requestedRole),
            reason: "Packet is assigned to an execution lane but stronger runtime/debug signals are not present yet.",
        };
    }

    return {
        currentLane: "UNASSIGNED",
        nextLane: requestedRoleToLane(input.requestedRole),
        reason: "Packet exists without an assignee or active execution lane.",
    };
}
