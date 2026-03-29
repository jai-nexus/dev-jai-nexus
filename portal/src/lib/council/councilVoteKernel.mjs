function asString(v) {
    return typeof v === "string" ? v : null;
}

function asNum(v) {
    return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export function normalizeVoteValue(v) {
    const s = String(v ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");

    if (s === "yes") return "yes";
    if (s === "no") return "no";
    if (s === "abstain") return "abstain";
    if (s === "yes_with_reservations") return "yes_with_reservations";

    // backwards compat: treat unknown as abstain
    return "abstain";
}

export function normalizeRole(v) {
    const s = String(v ?? "").trim().toLowerCase();
    if (!s) return null;

    const allowed = new Set([
        "proposer",
        "executor",
        "challenger",
        "arbiter",
        "librarian",
        "meta_analyst",
        "observer",
    ]);

    return allowed.has(s) ? s : null;
}

export function coerceVotesArray(voteData) {
    const votes = Array.isArray(voteData?.votes) ? voteData.votes : [];

    return votes.map((raw, idx) => {
        const voter_id = asString(raw?.voter_id) ?? `voter_${idx}`;
        const role = normalizeRole(raw?.role);
        const tier = asNum(raw?.tier) ?? null;

        const vote = normalizeVoteValue(raw?.vote);
        const rationale = asString(raw?.rationale) ?? null;

        const blocker_packet =
            raw?.blocker_packet && typeof raw.blocker_packet === "object"
                ? raw.blocker_packet
                : null;

        const reservations = Array.isArray(raw?.reservations) ? raw.reservations : null;
        const ts = asString(raw?.ts) ?? null;

        return {
            voter_id,
            role,
            tier,
            vote,
            rationale,
            blocker_packet,
            reservations,
            ts,
            _raw: raw,
        };
    });
}

export function validateVoteEntry(v) {
    if (v.vote === "no") {
        if (!v.blocker_packet) {
            return { ok: false, reason: "NO vote missing blocker_packet" };
        }

        const bt = asString(v.blocker_packet.blocker_type);
        const claim = asString(v.blocker_packet.claim);
        const minimal_fix = asString(v.blocker_packet.minimal_fix);
        const acceptance_to_flip = asString(v.blocker_packet.acceptance_to_flip);

        if (!bt || !claim || !minimal_fix || !acceptance_to_flip) {
            return {
                ok: false,
                reason:
                    "NO vote blocker_packet incomplete (requires blocker_type, claim, minimal_fix, acceptance_to_flip)",
            };
        }
    }

    if (v.vote === "yes_with_reservations") {
        if (!Array.isArray(v.reservations) || v.reservations.length === 0) {
            return { ok: false, reason: "YES_WITH_RESERVATIONS missing reservations[]" };
        }
    }

    return { ok: true };
}

export function pickLatestByRole(votes) {
    const byRole = new Map();

    const tsVal = (s) => {
        if (!s) return -1;
        const t = new Date(s).getTime();
        return Number.isFinite(t) ? t : -1;
    };

    votes.forEach((v, idx) => {
        if (!v.role) return;

        const prev = byRole.get(v.role);
        if (!prev) {
            byRole.set(v.role, { v, idx });
            return;
        }

        const a = tsVal(prev.v.ts);
        const b = tsVal(v.ts);

        if (b > a) byRole.set(v.role, { v, idx });
        else if (b === a && idx > prev.idx) byRole.set(v.role, { v, idx });
    });

    return byRole;
}

export function evaluateVotes({
    voteMode,
    votes,
    requiredRoles,
    allowYesWithReservations,
}) {
    const reasons = [];
    const normalizedVotes = votes.map((v) => ({
        ...v,
        vote: normalizeVoteValue(v.vote),
    }));

    for (const v of normalizedVotes) {
        const vr = validateVoteEntry(v);
        if (!vr.ok) {
            reasons.push(
                `Invalid vote by ${v.voter_id}${v.role ? ` (${v.role})` : ""}: ${vr.reason}`
            );
        }
    }

    if (reasons.length > 0) {
        return {
            result: "FAIL",
            yes: 0,
            no: 1,
            abstain: 0,
            yes_with_reservations: 0,
            reasons,
            missing_required_roles: [],
        };
    }

    const yesish = (v) =>
        v.vote === "yes" ||
        (allowYesWithReservations && v.vote === "yes_with_reservations");

    const counts = {
        yes: normalizedVotes.filter((v) => v.vote === "yes").length,
        yes_with_reservations: normalizedVotes.filter(
            (v) => v.vote === "yes_with_reservations"
        ).length,
        no: normalizedVotes.filter((v) => v.vote === "no").length,
        abstain: normalizedVotes.filter((v) => v.vote === "abstain").length,
    };

    if (voteMode === "majority") {
        const yesishCount = normalizedVotes.filter(yesish).length;
        const noCount = counts.no;
        const ok = yesishCount > noCount;

        return {
            result: ok ? "PASS" : "FAIL",
            ...counts,
            reasons: ok ? [] : [`majority_vote_failed (yesish=${yesishCount}, no=${noCount})`],
            missing_required_roles: [],
        };
    }

    const byRole = pickLatestByRole(normalizedVotes);
    const missing = requiredRoles.filter((r) => !byRole.has(r));

    const anyNo = normalizedVotes.some((v) => v.vote === "no");
    if (anyNo) {
        return {
            result: "FAIL",
            ...counts,
            reasons: ["blocker_no_present"],
            missing_required_roles: missing,
        };
    }

    if (missing.length > 0) {
        return {
            result: "PENDING",
            ...counts,
            reasons: ["missing_required_role_votes"],
            missing_required_roles: missing,
        };
    }

    if (voteMode === "unanimous") {
        const bad = requiredRoles.filter((r) => {
            const v = byRole.get(r)?.v;
            return !v || v.vote !== "yes";
        });

        if (bad.length > 0) {
            return {
                result: "FAIL",
                ...counts,
                reasons: [`unanimous_failed (non-YES roles: ${bad.join(", ")})`],
                missing_required_roles: [],
            };
        }

        return {
            result: "PASS",
            ...counts,
            reasons: [],
            missing_required_roles: [],
        };
    }

    if (voteMode === "unanimous_consent") {
        const bad = requiredRoles.filter((r) => {
            const v = byRole.get(r)?.v;
            if (!v) return true;
            if (v.vote === "yes") return false;
            if (allowYesWithReservations && v.vote === "yes_with_reservations") return false;
            return true;
        });

        if (bad.length > 0) {
            return {
                result: "FAIL",
                ...counts,
                reasons: [
                    `unanimous_consent_failed (non-consenting roles: ${bad.join(", ")})`,
                ],
                missing_required_roles: [],
            };
        }

        return {
            result: "PASS",
            ...counts,
            reasons: [],
            missing_required_roles: [],
        };
    }

    return {
        result: "FAIL",
        ...counts,
        reasons: [`unknown_vote_mode:${voteMode}`],
        missing_required_roles: [],
    };
}
