export function deriveCouncilDecisionOutcome({
    currentStatus = "DRAFT",
    currentNotes = null,
    currentRatifiedBy = null,
    voteResult = "PENDING",
    voteReasons = [],
    missingRequiredRoles = [],
    eligibleToVote = false,
    blockingReasons = [],
    warnings = [],
    voteMode = "majority",
    preferredRatifiedBy = null,
    protocolVersion = "0.0.0",
}) {
    let nextStatus = currentStatus;

    const voteBlocking = [];
    if (voteResult === "FAIL") voteBlocking.push("Vote failed.");
    if (voteResult === "PENDING") voteBlocking.push("Vote pending.");
    if (voteReasons.length > 0) voteBlocking.push(...voteReasons.map((r) => `Vote: ${r}`));
    if (missingRequiredRoles.length > 0) {
        voteBlocking.push(`Missing required role votes: ${missingRequiredRoles.join(", ")}`);
    }

    const canRatify = voteResult === "PASS" && eligibleToVote;

    if (canRatify) nextStatus = "RATIFIED";
    else if (blockingReasons.length > 0 || voteResult === "FAIL") nextStatus = "BLOCKED";
    else if (currentStatus === "RATIFIED" || currentStatus === "BLOCKED") nextStatus = "PROPOSED";

    let nextNotes;
    if (nextStatus === "RATIFIED") {
        const extras = [];
        if (warnings.length > 0) extras.push(`WARN: ${warnings.join("; ")}`);
        if (voteMode !== "majority") extras.push(`vote_mode=${voteMode}`);
        nextNotes = extras.length ? `RATIFIED: ${extras.join(" | ")}` : "RATIFIED: policy PASS + vote PASS";
    } else if (nextStatus === "BLOCKED") {
        const why = [...blockingReasons, ...voteBlocking].filter(Boolean);
        nextNotes = why.length ? `BLOCKED: ${why.join("; ")}` : "BLOCKED";
    } else if (voteResult === "PENDING") {
        nextNotes = "PENDING: awaiting vote";
    } else {
        nextNotes = currentNotes ?? `Outcome determined by council-run.mjs v${protocolVersion}`;
    }

    let nextRatifiedBy = currentRatifiedBy;
    if (nextStatus === "RATIFIED") {
        nextRatifiedBy = preferredRatifiedBy || nextRatifiedBy || "voter";
    } else {
        nextRatifiedBy = nextRatifiedBy ?? null;
    }

    return { nextStatus, nextRatifiedBy, nextNotes };
}
