export const MOTION_LIFECYCLE_VALUES = [
  "draft",
  "submitted",
  "in_deliberation",
  "critiqued",
  "voted",
  "ratification_recommended",
  "human_approved",
  "routed",
  "rejected",
  "needs_revision",
  "closed",
] as const;

export type MotionLifecycleStatus = (typeof MOTION_LIFECYCLE_VALUES)[number];

export const VOTE_VALUES = [
  "approve",
  "reject",
  "abstain",
  "revise",
  "blocked",
] as const;

export type VoteValue = (typeof VOTE_VALUES)[number];

export const RATIFICATION_VALUES = [
  "not_ratified",
  "ratified_for_human_approval",
  "ratified_with_conditions",
  "rejected",
  "needs_revision",
] as const;

export type RatificationValue = (typeof RATIFICATION_VALUES)[number];

export const HUMAN_APPROVAL_DECISION_VALUES = [
  "pending",
  "approved",
  "rejected",
  "needs_revision",
] as const;

export type HumanApprovalDecisionValue =
  (typeof HUMAN_APPROVAL_DECISION_VALUES)[number];

export const MOTION_APPROVAL_DRAFT_DECISION_VALUES = [
  "approve_for_draft",
  "request_revision",
  "reject",
  "hold",
] as const;

export type MotionApprovalDraftDecisionValue =
  (typeof MOTION_APPROVAL_DRAFT_DECISION_VALUES)[number];

export type JaiRoleSlotId =
  | "JAI_CONTROL_THREAD"
  | "JAI_ORCHESTRATOR_NEXUS"
  | "JAI_DEV_JAI_NEXUS"
  | "JAI_AUDIT_NEXUS"
  | "JAI_FORMAT"
  | "JAI_REPO_GENERIC";

export type ModelSlotId =
  | "model-slot-mock-deliberator"
  | "model-slot-env-gated-live-placeholder"
  | "model-slot-disabled-reference";

export interface ControlThread {
  id: string;
  label: string;
  scope: string;
  authorityNote: string;
}

export interface RepoThread {
  id: string;
  repo: "dev-jai-nexus" | string;
  branchCandidate?: string;
  scope: string;
  authorityNote: string;
}

export interface EvidencePointer {
  id: string;
  label: string;
  sourceType: "repo_path" | "motion_package" | "operator_note" | "validation_summary";
  ref: string;
  summary: string;
  validationAuthority: "none";
}

export interface CloseoutPlaceholder {
  id: string;
  label: string;
  status: "draft_only" | "not_started" | "blocked";
  notes: string[];
  acceptanceAuthority: "none";
}

export interface JaiRoleSlot {
  id: JaiRoleSlotId;
  displayName: string;
  roleFamily: string;
  purpose: string;
  deliberationResponsibility: string;
  requiredLens: string;
  authorityDisclaimer: string;
}

export interface ModelSlot {
  id: ModelSlotId;
  displayName: string;
  providerFamily: string;
  providerKey?: string;
  modelName?: string;
  enabled: boolean;
  compatibleRoleSlots: JaiRoleSlotId[];
  inferenceMode: "mock" | "env_gated_live_placeholder" | "disabled";
  manualOperatorTriggeredOnly: true;
  mockInferenceEnabled: boolean;
  envGate?: string;
  nonAuthorityDisclaimer: string;
}

export interface DeliberationEntry {
  id: string;
  motionId: string;
  roleSlotId: JaiRoleSlotId;
  modelSlotId: ModelSlotId;
  summary: string;
  reasoning: string[];
  createdAt: string;
  inferenceMode: ModelSlot["inferenceMode"];
  nonAuthorityNote: string;
}

export interface Critique {
  id: string;
  motionId: string;
  roleSlotId: JaiRoleSlotId;
  targetDeliberationId: string;
  severity: "info" | "caution" | "blocker";
  summary: string;
  requiredFollowUp: string;
}

export interface Vote {
  id: string;
  motionId: string;
  roleSlotId: JaiRoleSlotId;
  value: VoteValue;
  rationale: string;
  conditions: string[];
  nonBinding: true;
}

export interface RatificationRecommendation {
  id: string;
  motionId: string;
  value: RatificationValue;
  summary: string;
  conditions: string[];
  advisoryOnly: true;
  humanApprovalRequired: true;
}

export interface HumanApprovalDecision {
  id: string;
  motionId: string;
  value: HumanApprovalDecisionValue;
  decidedBy: string | null;
  decidedAt: string | null;
  notes: string[];
  doesNotAuthorizeAutonomousExecution: true;
  doesNotAuthorizeGitHubMutation: true;
  doesNotOpenProductionGates: true;
  doesNotTransferSourceOfTruth: true;
}

export interface ProgramDraft {
  id: string;
  title: string;
  status: "draft_only" | "blocked_until_human_approval";
  summary: string;
}

export interface BatchDraft {
  id: string;
  label: string;
  status: "draft_only" | "blocked_until_human_approval";
  summary: string;
}

export interface WaveDraft {
  id: string;
  label: string;
  status: "draft_only" | "blocked_until_human_approval";
  summary: string;
}

export interface LaneDraft {
  id: string;
  label: string;
  status: "draft_only" | "blocked_until_human_approval";
  repo: string;
  scope: string;
}

export interface WorkPacketDraft {
  id: string;
  label: string;
  status: "draft_only" | "blocked_until_human_approval";
  targetRepo: string;
  targetBranchCandidate: string;
  instructions: string[];
  nonAuthorizationNotes: string[];
}

export interface DownstreamDraftSet {
  programDraft: ProgramDraft;
  batchDraft: BatchDraft;
  waveDraft: WaveDraft;
  laneDraft: LaneDraft;
  workPacketDraft: WorkPacketDraft;
}

export interface Motion {
  id: string;
  title: string;
  summary: string;
  lifecycleStatus: MotionLifecycleStatus;
  controlThread: ControlThread;
  repoThread: RepoThread;
  roleSlotIds: JaiRoleSlotId[];
  modelSlotIds: ModelSlotId[];
  deliberations: DeliberationEntry[];
  critiques: Critique[];
  votes: Vote[];
  ratificationRecommendation: RatificationRecommendation;
  humanApprovalDecision: HumanApprovalDecision;
  downstreamDrafts: DownstreamDraftSet;
  evidencePointers: EvidencePointer[];
  closeoutPlaceholder: CloseoutPlaceholder;
  nonAuthorizations: string[];
}

export interface MockInferenceRequest {
  motionId: string;
  roleSlotId: JaiRoleSlotId;
  modelSlotId: ModelSlotId;
  operatorPrompt: string;
}

export interface MockInferenceResponse {
  mode: "mock" | "env_gated_live_placeholder_blocked";
  summary: string;
  reasoning: string[];
  nonAuthorityDisclaimer: string;
}

export interface DeliberationParticipantOutput {
  roleSlotId: JaiRoleSlotId;
  modelSlotId: ModelSlotId;
  critiqueSummary: string;
  voteValue: VoteValue;
  ratificationRecommendation: RatificationValue;
  requiredRevisions: string[];
  blockers: string[];
  confidenceReadinessNote: string;
  nonAuthorizations: string[];
  advisoryOnly: true;
}

export interface ModelSlotDeliberationRequest {
  motion: Motion;
  roleSlotId: JaiRoleSlotId;
  modelSlotId: ModelSlotId;
  operatorPrompt: string;
  requestedMode?: "mock" | "env_gated_provider";
}

export interface ModelSlotDeliberationResponse {
  mode: "mock" | "env_gated_provider_unconfigured";
  providerConfigured: boolean;
  participantOutput: DeliberationParticipantOutput;
  nonAuthorityDisclaimer: string;
}

export interface ManualDeliberationRun {
  id: string;
  motionId: string;
  roleSlotIds: JaiRoleSlotId[];
  modelSlotId: ModelSlotId;
  requestedMode: "mock" | "env_gated_provider";
  operatorTriggeredOnly: true;
  persisted: false;
}

export interface AdvisoryRatificationSummary {
  value: RatificationValue;
  summary: string;
  requiredRevisions: string[];
  blockers: string[];
  voteCounts: Record<VoteValue, number>;
  advisoryOnly: true;
  humanApprovalRequired: true;
  nonAuthorityDisclaimer: string;
}

export interface ManualDeliberationRunResult {
  run: ManualDeliberationRun;
  participantOutputs: DeliberationParticipantOutput[];
  aggregateRatification: AdvisoryRatificationSummary;
  nonAuthorizations: string[];
}

export type ProviderConnectorMode =
  | "mock"
  | "provider_disabled"
  | "provider_config_missing"
  | "provider_configured"
  | "provider_error"
  | "provider_malformed_output";

export interface ProviderConnectorSafeStatus {
  liveInferenceEnabled: boolean;
  providerConfigured: boolean;
  providerKeyPresent: boolean;
  providerName: string | null;
  modelName: string | null;
  mode: ProviderConnectorMode;
  advisoryMessage: string;
}

export interface ProviderDeliberationConnectorResult {
  status: ProviderConnectorSafeStatus;
  participantOutput: DeliberationParticipantOutput;
  nonAuthorityDisclaimer: string;
}

export type DeliberationRunSourceMode =
  | "mock"
  | "provider"
  | "provider_disabled"
  | "provider_unavailable"
  | "persistence_staged";

export type DeliberationRunPersistenceStatus =
  | "persisted"
  | "staged"
  | "preview_only"
  | "blocked";

export interface DeliberationRunHistoryRecord {
  id: string;
  motionId: string;
  motionTitle: string;
  createdAt: string;
  createdBy: string;
  sourceMode: DeliberationRunSourceMode;
  connectorStatusSummary: ProviderConnectorSafeStatus;
  participantOutputs: DeliberationParticipantOutput[];
  aggregateAdvisoryRatification: AdvisoryRatificationSummary;
  evidencePointers: EvidencePointer[];
  nonAuthorizations: string[];
  persistenceStatus: DeliberationRunPersistenceStatus;
  safeAdvisoryMessage: string;
}

export interface DeliberationRunHistoryRepository {
  create(record: DeliberationRunHistoryRecord): Promise<DeliberationRunHistoryRecord>;
  listRecent(limit?: number): Promise<DeliberationRunHistoryRecord[]>;
}

export interface MotionApprovalDraftPacket {
  motionId: string;
  motionTitle: string;
  decision: MotionApprovalDraftDecisionValue;
  explicitOperatorSelection: boolean;
  canGenerateDrafts: boolean;
  advisoryRatificationState: RatificationValue;
  programDraftText: string;
  batchDraftText: string;
  waveDraftText: string;
  laneDraftText: string;
  workPacketDraftText: string;
  routePacketDraftText: string;
  closeoutPlaceholderText: string;
  evidencePointerSummaryText: string;
  fullDraftPacketText: string;
  nonAuthorizations: string[];
}
