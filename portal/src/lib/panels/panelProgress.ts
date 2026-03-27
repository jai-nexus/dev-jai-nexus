export type PanelProgressStatus =
    | "INVALID"
    | "NEEDS_SCORES"
    | "NEEDS_WINNER"
    | "NEEDS_EVIDENCE"
    | "COMPLETE";

export type PanelProgress = {
    status: PanelProgressStatus;
    reason: string;

    // derived signals (useful for UI / debugging)
    winner: string;
    evidence_commands: number;
    has_any_scores: boolean;
};

function safeStr(v: unknown, fallback = "UNKNOWN") {
    return typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback;
}

function num(v: unknown, fallback = 0) {
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function isObject(v: unknown): v is Record<string, unknown> {
    return !!v && typeof v === "object";
}

function hasAnyNonzeroScore(scores: unknown): boolean {
    if (!isObject(scores)) return false;

    for (const entry of Object.values(scores)) {
        if (!isObject(entry)) continue;

        const total = num((entry as any).total, 0);
        if (total > 0) return true;

        const breakdown = (entry as any).breakdown;
        if (isObject(breakdown)) {
            for (const v of Object.values(breakdown)) {
                if (num(v, 0) > 0) return true;
            }
        }
    }
    return false;
}

/**
 * Canonical progress computation:
 * - COMPLETE definition remains: winner != UNKNOWN AND evidence_plan.commands non-empty
 * - Otherwise provide a deterministic reason why it is not complete.
 */
export function computePanelProgress(selection: unknown): PanelProgress {
    if (!isObject(selection)) {
        return {
            status: "INVALID",
            reason: "selection.json missing or not an object.",
            winner: "UNKNOWN",
            evidence_commands: 0,
            has_any_scores: false,
        };
    }

    const winner = safeStr((selection as any).winner, "UNKNOWN");
    const evidence_commands = Array.isArray((selection as any)?.evidence_plan?.commands)
        ? (selection as any).evidence_plan.commands.length
        : 0;

    const scores = (selection as any).scores;
    if (!isObject(scores)) {
        return {
            status: "INVALID",
            reason: 'selection.json missing "scores" object.',
            winner,
            evidence_commands,
            has_any_scores: false,
        };
    }

    const has_any_scores = hasAnyNonzeroScore(scores);

    // COMPLETE stays exactly as your current semantics
    if (winner !== "UNKNOWN" && evidence_commands > 0) {
        return {
            status: "COMPLETE",
            reason: "Winner selected and evidence commands are present.",
            winner,
            evidence_commands,
            has_any_scores,
        };
    }

    // Winner not chosen yet
    if (winner === "UNKNOWN") {
        if (!has_any_scores) {
            return {
                status: "NEEDS_SCORES",
                reason: "All slot totals are 0; enter rubric scores for at least one slot.",
                winner,
                evidence_commands,
                has_any_scores,
            };
        }

        return {
            status: "NEEDS_WINNER",
            reason: "Scores exist but winner is UNKNOWN; run Compute winner / panel-select to set it.",
            winner,
            evidence_commands,
            has_any_scores,
        };
    }

    // Winner chosen, but not complete
    if (evidence_commands <= 0) {
        return {
            status: "NEEDS_EVIDENCE",
            reason: "Winner is selected but evidence_plan.commands is empty; add verification commands + expected outputs.",
            winner,
            evidence_commands,
            has_any_scores,
        };
    }

    // Should be unreachable due to COMPLETE check above
    return {
        status: "INVALID",
        reason: "Unrecognized progress state; check selection.json shape.",
        winner,
        evidence_commands,
        has_any_scores,
    };
}

export function progressRank(s: PanelProgressStatus): number {
    // Higher rank = more urgent / severe
    // INVALID > NEEDS_EVIDENCE > NEEDS_WINNER > NEEDS_SCORES > COMPLETE
    switch (s) {
        case "INVALID":
            return 4;
        case "NEEDS_EVIDENCE":
            return 3;
        case "NEEDS_WINNER":
            return 2;
        case "NEEDS_SCORES":
            return 1;
        case "COMPLETE":
            return 0;
        default:
            return 0;
    }
}
