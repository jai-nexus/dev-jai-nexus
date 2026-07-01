import type {
  Motion,
  MotionApprovalDraftDecisionValue,
  MotionApprovalDraftPacket,
} from "./types";

export const MOTION_APPROVAL_DRAFT_NON_AUTHORIZATIONS = [
  "Human approval in the UI is not autonomous execution.",
  "Human approval in the UI is not GitHub mutation authority.",
  "JAI vote is not route authority.",
  "JAI ratification is not final authority.",
  "Draft work packet is not routed work.",
  "Draft route packet is not CONTROL_THREAD acceptance.",
  "Closeout placeholder is not closeout.",
  "Evidence pointer is not validation approval.",
  "CONTROL_THREAD remains authority.",
  "Linear remains a temporary mirror only.",
  "Human / CONTROL_THREAD approval remains required before proceeding.",
  "Draft output is copyable planning text only.",
  "Draft output is non-executing.",
  "Draft output does not create route authority.",
  "Draft output does not create acceptance authority.",
  "Draft output does not create execution authority.",
  "Draft output does not create GitHub mutation authority.",
  "Draft output does not create production gate authority.",
  "Draft output does not transfer source of truth.",
  "No autonomous execution.",
  "No GitHub mutation.",
  "No PR creation.",
  "No branch mutation.",
  "No merge action.",
  "No branch deletion.",
  "No production gate opening.",
  "No source-of-truth transfer.",
  "No hidden background execution.",
  "No automatic route execution.",
  "No work-packet execution.",
  "No provider API key persistence.",
  "No provider API key exposure.",
  "No provider secret storage.",
  "No final CONTROL_THREAD approval by UI decision.",
  "No final CONTROL_THREAD approval by draft output.",
  "No route authority by UI decision.",
  "No route authority by draft output.",
  "No execution authority by UI decision.",
  "No execution authority by draft output.",
  "No production gate authority by UI decision.",
  "No production gate authority by draft output.",
  "ZERO GATES GRANTED.",
] as const;

export function canGenerateMotionApprovalDrafts({
  decision,
  explicitOperatorSelection,
}: {
  decision: MotionApprovalDraftDecisionValue;
  explicitOperatorSelection: boolean;
}): boolean {
  return decision === "approve_for_draft" || explicitOperatorSelection;
}

export function buildProgramDraftFromMotion(
  motion: Motion,
  status: "draft_only" | "blocked_until_human_approval",
): string {
  const draft = motion.downstreamDrafts.programDraft;
  return [
    "## Program draft",
    `Program: ${draft.title}`,
    `Status: ${status}`,
    `Summary: ${draft.summary}`,
    "Authority: CONTROL_THREAD remains authority.",
  ].join("\n");
}

export function buildBatchDraftFromMotion(
  motion: Motion,
  status: "draft_only" | "blocked_until_human_approval",
): string {
  const draft = motion.downstreamDrafts.batchDraft;
  return [
    "## Batch draft",
    `Batch: ${draft.label}`,
    `Status: ${status}`,
    `Summary: ${draft.summary}`,
    "Authority: draft text does not create route authority.",
  ].join("\n");
}

export function buildWaveDraftFromMotion(
  motion: Motion,
  status: "draft_only" | "blocked_until_human_approval",
): string {
  const draft = motion.downstreamDrafts.waveDraft;
  return [
    "## Wave draft",
    `Wave: ${draft.label}`,
    `Status: ${status}`,
    `Summary: ${draft.summary}`,
    "Authority: draft text does not create acceptance authority.",
  ].join("\n");
}

export function buildLaneDraftFromMotion(
  motion: Motion,
  status: "draft_only" | "blocked_until_human_approval",
): string {
  const draft = motion.downstreamDrafts.laneDraft;
  return [
    "## Lane draft",
    `Lane: ${draft.label}`,
    `Repo: ${draft.repo}`,
    `Scope: ${draft.scope}`,
    `Status: ${status}`,
    "Authority: draft text does not execute work.",
  ].join("\n");
}

export function buildWorkPacketDraftFromMotion(
  motion: Motion,
  status: "draft_only" | "blocked_until_human_approval",
): string {
  const draft = motion.downstreamDrafts.workPacketDraft;
  return [
    "## Work packet draft",
    `Work packet: ${draft.label}`,
    `Target repo: ${draft.targetRepo}`,
    `Target branch candidate: ${draft.targetBranchCandidate}`,
    `Status: ${status}`,
    "",
    "Instructions:",
    ...draft.instructions.map((instruction) => `- ${instruction}`),
    "",
    "Non-authorizations:",
    ...draft.nonAuthorizationNotes.map((note) => `- ${note}`),
    "- Draft work packet is not routed work.",
    "- No work-packet execution.",
  ].join("\n");
}

export function buildRoutePacketDraftFromMotion({
  motion,
  decision,
  status,
}: {
  motion: Motion;
  decision: MotionApprovalDraftDecisionValue;
  status: "draft_only" | "blocked_until_human_approval";
}): string {
  return [
    "## Route packet draft",
    `Motion: ${motion.id}`,
    `Thread: ${motion.controlThread.label}`,
    `Repo: ${motion.repoThread.repo}`,
    `Branch candidate: ${motion.repoThread.branchCandidate ?? "none"}`,
    `Lifecycle: ${motion.lifecycleStatus}`,
    `JAI ratification: ${motion.ratificationRecommendation.value}`,
    `Local UI approval decision: ${decision}`,
    `Draft status: ${status}`,
    "CONTROL_THREAD remains authority.",
    "Linear remains a temporary mirror only.",
    "Draft route packet is not CONTROL_THREAD acceptance.",
    "ZERO GATES GRANTED.",
  ].join("\n");
}

export function buildCloseoutPlaceholderFromMotion(motion: Motion): string {
  return [
    "## Closeout placeholder",
    `Closeout: ${motion.closeoutPlaceholder.label}`,
    `Status: ${motion.closeoutPlaceholder.status}`,
    `Acceptance authority: ${motion.closeoutPlaceholder.acceptanceAuthority}`,
    ...motion.closeoutPlaceholder.notes.map((note) => `- ${note}`),
    "Closeout placeholder is not closeout.",
  ].join("\n");
}

export function buildEvidencePointerSummary(motion: Motion): string {
  return [
    "## Evidence pointer summary",
    ...motion.evidencePointers.map((pointer) =>
      [
        `- ${pointer.label}`,
        `  - Kind: ${pointer.sourceType}`,
        `  - Reference: ${pointer.ref}`,
        `  - Summary: ${pointer.summary}`,
        `  - Validation authority: ${pointer.validationAuthority}`,
      ].join("\n"),
    ),
    "Evidence pointer is not validation approval.",
  ].join("\n");
}

export function buildMotionApprovalDraftPacket({
  motion,
  decision,
  explicitOperatorSelection,
  deliberationBasisSummary,
}: {
  motion: Motion;
  decision: MotionApprovalDraftDecisionValue;
  explicitOperatorSelection: boolean;
  deliberationBasisSummary: string;
}): MotionApprovalDraftPacket {
  const canGenerateDrafts = canGenerateMotionApprovalDrafts({
    decision,
    explicitOperatorSelection,
  });
  const status = canGenerateDrafts
    ? "draft_only"
    : "blocked_until_human_approval";
  const programDraftText = buildProgramDraftFromMotion(motion, status);
  const batchDraftText = buildBatchDraftFromMotion(motion, status);
  const waveDraftText = buildWaveDraftFromMotion(motion, status);
  const laneDraftText = buildLaneDraftFromMotion(motion, status);
  const workPacketDraftText = buildWorkPacketDraftFromMotion(motion, status);
  const routePacketDraftText = buildRoutePacketDraftFromMotion({
    motion,
    decision,
    status,
  });
  const closeoutPlaceholderText = buildCloseoutPlaceholderFromMotion(motion);
  const evidencePointerSummaryText = buildEvidencePointerSummary(motion);
  const nonAuthorizations = [...MOTION_APPROVAL_DRAFT_NON_AUTHORIZATIONS];

  const fullDraftPacketText = [
    "# Motion approval draft packet",
    "",
    `Motion: ${motion.id}`,
    `Title: ${motion.title}`,
    `Selected deliberation basis: ${deliberationBasisSummary}`,
    `Advisory ratification state: ${motion.ratificationRecommendation.value}`,
    `Human approval decision state: ${decision}`,
    `Explicit operator draft selection: ${explicitOperatorSelection ? "yes" : "no"}`,
    `Draft generation state: ${status}`,
    "",
    "Role-slot output summary:",
    ...motion.deliberations.map(
      (entry) => `- ${entry.roleSlotId}: ${entry.summary}`,
    ),
    ...motion.votes.map(
      (vote) => `- Vote ${vote.roleSlotId}: ${vote.value}; ${vote.rationale}`,
    ),
    ...motion.critiques.map(
      (critique) =>
        `- Critique ${critique.roleSlotId}: ${critique.severity}; ${critique.summary}`,
    ),
    "",
    programDraftText,
    "",
    batchDraftText,
    "",
    waveDraftText,
    "",
    laneDraftText,
    "",
    workPacketDraftText,
    "",
    routePacketDraftText,
    "",
    closeoutPlaceholderText,
    "",
    evidencePointerSummaryText,
    "",
    "## Non-authorizations",
    ...nonAuthorizations.map((note) => `- ${note}`),
  ].join("\n");

  return {
    motionId: motion.id,
    motionTitle: motion.title,
    decision,
    explicitOperatorSelection,
    canGenerateDrafts,
    advisoryRatificationState: motion.ratificationRecommendation.value,
    programDraftText,
    batchDraftText,
    waveDraftText,
    laneDraftText,
    workPacketDraftText,
    routePacketDraftText,
    closeoutPlaceholderText,
    evidencePointerSummaryText,
    fullDraftPacketText,
    nonAuthorizations,
  };
}
