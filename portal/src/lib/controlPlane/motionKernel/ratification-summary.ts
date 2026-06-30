import type {
  AdvisoryRatificationSummary,
  DeliberationParticipantOutput,
  RatificationValue,
  VoteValue,
} from "./types";

const EMPTY_VOTE_COUNTS: Record<VoteValue, number> = {
  approve: 0,
  reject: 0,
  abstain: 0,
  revise: 0,
  blocked: 0,
};

export function deriveAdvisoryRatificationRecommendation(
  outputs: DeliberationParticipantOutput[],
): AdvisoryRatificationSummary {
  const voteCounts = outputs.reduce<Record<VoteValue, number>>(
    (counts, output) => ({
      ...counts,
      [output.voteValue]: counts[output.voteValue] + 1,
    }),
    { ...EMPTY_VOTE_COUNTS },
  );

  const blockers = outputs.flatMap((output) => output.blockers);
  const requiredRevisions = outputs.flatMap(
    (output) => output.requiredRevisions,
  );
  const hasBlockers = voteCounts.blocked > 0 || blockers.length > 0;
  const value = deriveRatificationValue(voteCounts, hasBlockers);

  return {
    value,
    summary: buildSummary(value, voteCounts, blockers.length),
    requiredRevisions,
    blockers,
    voteCounts,
    advisoryOnly: true,
    humanApprovalRequired: true,
    nonAuthorityDisclaimer:
      "Aggregate ratification is advisory and is not CONTROL_THREAD approval, route authority, execution authority, GitHub mutation authority, or production gate authority.",
  };
}

function deriveRatificationValue(
  voteCounts: Record<VoteValue, number>,
  hasBlockers: boolean,
): RatificationValue {
  if (hasBlockers) {
    return "needs_revision";
  }

  if (voteCounts.reject > voteCounts.approve) {
    return "rejected";
  }

  if (voteCounts.revise > 0) {
    return "needs_revision";
  }

  if (voteCounts.approve > 0 && voteCounts.approve >= voteCounts.reject) {
    return "ratified_for_human_approval";
  }

  return "not_ratified";
}

function buildSummary(
  value: RatificationValue,
  voteCounts: Record<VoteValue, number>,
  blockerCount: number,
): string {
  if (value === "needs_revision" && blockerCount > 0) {
    return `Needs revision due to ${blockerCount} blocker note(s); JAI output remains advisory.`;
  }

  if (value === "needs_revision") {
    return "Needs revision based on advisory role-slot votes.";
  }

  if (value === "rejected") {
    return "Rejected by advisory vote balance; CONTROL_THREAD still decides.";
  }

  if (value === "ratified_for_human_approval") {
    return `Ratified for human approval by ${voteCounts.approve} advisory approval vote(s).`;
  }

  return "Not ratified; insufficient advisory approval signal.";
}
