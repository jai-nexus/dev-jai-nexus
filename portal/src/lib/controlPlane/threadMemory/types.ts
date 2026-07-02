export const CONTROL_THREAD_IDS = [
  "thread-control-thread",
  "thread-exploration",
  "thread-dev-jai-nexus",
  "thread-sandbox-nexus",
  "thread-repo-generic",
  "thread-future-jai-agent-slot",
] as const;

export type ControlThreadId = (typeof CONTROL_THREAD_IDS)[number];

export const CONTROL_THREAD_KINDS = [
  "CONTROL_THREAD",
  "EXPLORATION",
  "REPO_THREAD",
  "SANDBOX_PLAYGROUND",
  "GENERIC_REPO_THREAD",
  "FUTURE_JAI_AGENT_SLOT",
] as const;

export type ControlThreadKind = (typeof CONTROL_THREAD_KINDS)[number];

export const PASSALONG_ROUTE_STATUSES = [
  "draft",
  "queued",
  "needs_review",
  "recommended",
  "approved_for_manual_passalong",
  "sent_manually",
  "held",
  "rejected",
  "archived",
] as const;

export type PassalongRouteStatus =
  (typeof PASSALONG_ROUTE_STATUSES)[number];

export const SANDBOX_IMPORT_ADOPTION_POSTURES = [
  "discard",
  "archive",
  "iterate",
  "keep_as_example",
  "promote_to_import_candidate",
] as const;

export type SandboxImportAdoptionPosture =
  (typeof SANDBOX_IMPORT_ADOPTION_POSTURES)[number];

export interface ThreadMemoryRecord {
  threadId: ControlThreadId;
  threadLabel: string;
  threadKind: ControlThreadKind;
  currentRole: string;
  posture: string;
  summary: string;
  acceptedBaseline: string[];
  activeScope: string[];
  openQuestions: string[];
  blockedRoutes: string[];
  evidencePointers: string[];
  authorityBoundary: string;
  nonAuthorizations: string[];
  updatedTimestamp: string;
}

export interface PassalongRecord {
  passalongId: string;
  sourceThread: ControlThreadId;
  targetThread: ControlThreadId;
  scope: string;
  mode: string;
  summary: string;
  evidencePointers: string[];
  requestedDecision: string;
  status: PassalongRouteStatus;
  createdTimestamp: string;
  authorityBoundary: string;
  nonAuthorizations: string[];
  sandboxTargetId?: string;
  sandboxImportAdoptionPosture?: SandboxImportAdoptionPosture;
  sandboxOutputInvolved?: boolean;
}

export interface PassalongQueue {
  threadId: ControlThreadId;
  threadLabel: string;
  records: PassalongRecord[];
}

export interface SandboxTargetOption {
  id: "sandbox-nexus";
  label: "sandbox-nexus";
  posture: string;
  allowedUses: string[];
  disallowedUses: string[];
  authorityBoundary: string;
  nonAuthorizations: string[];
}

export interface RouteRecommendation {
  passalongId: string;
  recommendedSource: string;
  recommendedTarget: string;
  recommendedStatusTransition: string;
  requestedDecision: string;
  evidencePointerSummary: string;
  sandboxPosture: string | null;
  importAdoptionPosture: string | null;
  authorityBoundary: string;
  nonAuthorizations: string[];
  manualNextStep: string;
  advisoryOnly: true;
}

export type CopyablePassalongPacket = string;
