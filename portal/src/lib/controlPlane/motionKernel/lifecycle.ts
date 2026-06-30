import {
  HUMAN_APPROVAL_DECISION_VALUES,
  MOTION_LIFECYCLE_VALUES,
  RATIFICATION_VALUES,
  VOTE_VALUES,
  type DownstreamDraftSet,
  type HumanApprovalDecision,
  type Motion,
  type MotionLifecycleStatus,
  type RatificationValue,
  type VoteValue,
} from "./types";

export const MOTION_KERNEL_NON_AUTHORIZATIONS = [
  "JAI ratification is not final authority.",
  "Human / CONTROL_THREAD approval remains required.",
  "No autonomous GitHub action.",
  "No PR creation.",
  "No branch mutation.",
  "No merge action.",
  "No branch deletion.",
  "No autonomous repo execution.",
  "No production gate opening.",
  "No source-of-truth transfer.",
  "No hidden background execution.",
  "No autonomous execution.",
  "No GitHub mutation.",
  "No production gates.",
] as const;

export function isMotionLifecycleStatus(
  value: string,
): value is MotionLifecycleStatus {
  return MOTION_LIFECYCLE_VALUES.includes(value as MotionLifecycleStatus);
}

export function isVoteValue(value: string): value is VoteValue {
  return VOTE_VALUES.includes(value as VoteValue);
}

export function isRatificationValue(value: string): value is RatificationValue {
  return RATIFICATION_VALUES.includes(value as RatificationValue);
}

export function canPrepareWorkPacketDraft(
  decision: HumanApprovalDecision,
): boolean {
  return decision.value === "approved";
}

export function getDraftAvailabilityLabel(decision: HumanApprovalDecision): string {
  if (canPrepareWorkPacketDraft(decision)) {
    return "draft preview available after human approval";
  }
  return "blocked until explicit human / CONTROL_THREAD approval";
}

export function createWorkPacketDraftPreview(motion: Motion): DownstreamDraftSet {
  if (!canPrepareWorkPacketDraft(motion.humanApprovalDecision)) {
    return {
      ...motion.downstreamDrafts,
      programDraft: {
        ...motion.downstreamDrafts.programDraft,
        status: "blocked_until_human_approval",
      },
      batchDraft: {
        ...motion.downstreamDrafts.batchDraft,
        status: "blocked_until_human_approval",
      },
      waveDraft: {
        ...motion.downstreamDrafts.waveDraft,
        status: "blocked_until_human_approval",
      },
      laneDraft: {
        ...motion.downstreamDrafts.laneDraft,
        status: "blocked_until_human_approval",
      },
      workPacketDraft: {
        ...motion.downstreamDrafts.workPacketDraft,
        status: "blocked_until_human_approval",
      },
    };
  }

  return {
    ...motion.downstreamDrafts,
    programDraft: {
      ...motion.downstreamDrafts.programDraft,
      status: "draft_only",
    },
    batchDraft: {
      ...motion.downstreamDrafts.batchDraft,
      status: "draft_only",
    },
    waveDraft: {
      ...motion.downstreamDrafts.waveDraft,
      status: "draft_only",
    },
    laneDraft: {
      ...motion.downstreamDrafts.laneDraft,
      status: "draft_only",
    },
    workPacketDraft: {
      ...motion.downstreamDrafts.workPacketDraft,
      status: "draft_only",
    },
  };
}

export function buildDraftRoutePacket(motion: Motion): string {
  const drafts = createWorkPacketDraftPreview(motion);
  const availability = getDraftAvailabilityLabel(motion.humanApprovalDecision);

  return [
    `Motion: ${motion.id}`,
    `Lifecycle: ${motion.lifecycleStatus}`,
    `Ratification recommendation: ${motion.ratificationRecommendation.value}`,
    `Human approval: ${motion.humanApprovalDecision.value}`,
    `Draft availability: ${availability}`,
    "",
    `Program draft: ${drafts.programDraft.title} (${drafts.programDraft.status})`,
    `Batch draft: ${drafts.batchDraft.label} (${drafts.batchDraft.status})`,
    `Wave draft: ${drafts.waveDraft.label} (${drafts.waveDraft.status})`,
    `Lane draft: ${drafts.laneDraft.label} (${drafts.laneDraft.status})`,
    `Work packet draft: ${drafts.workPacketDraft.label} (${drafts.workPacketDraft.status})`,
    "",
    "Draft-only rules:",
    "- Draft generation must not route work automatically.",
    "- Draft generation must not create a branch.",
    "- Draft generation must not create a PR.",
    "- Draft generation must not mutate GitHub.",
    "- Draft generation must not trigger autonomous execution.",
    "- Draft output must be human-reviewed.",
  ].join("\n");
}

export const motionKernelVocabulary = {
  lifecycle: MOTION_LIFECYCLE_VALUES,
  votes: VOTE_VALUES,
  ratification: RATIFICATION_VALUES,
  humanApproval: HUMAN_APPROVAL_DECISION_VALUES,
} as const;
