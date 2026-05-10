import type {
  AgentRegistryAgent,
  AgentRegistryCapabilityKey,
  AgentRegistryCapabilityState,
  AgentRegistryCanonicalActiveKey,
  AgentRegistryScopeKey,
} from "@/lib/agents/types";
import type {
  ControlPlaneProjectEntry,
  ControlPlaneSurfaceEntry,
  ControlPlaneTargetRef,
} from "@/lib/controlPlane/types";

export type DraftWorkPacketAction =
  | "view_only"
  | "draft_plan"
  | "draft_files_preview"
  | "verify";

export type DraftWorkPacketStatus =
  | "draft"
  | "ready_for_review"
  | "blocked"
  | "deferred"
  | "settled";

export type AgendaRepoPosture = "repo_local" | "cross_repo";
export type AgendaWorkClass = "governance_safe" | "implementation_heavy" | "mixed";
export type AgendaRequestedActionClass =
  | "view_only"
  | "draft_review_only"
  | "preview_only"
  | "blocked";
export type AgendaMutationBoundary =
  | "no_mutation"
  | "repo_local_preview"
  | "cross_repo_blocked";
export type AgendaAuthorityBoundary = "planning_review_only";

export interface DraftWorkPacketSource {
  kind: "motion" | "control_thread";
  label: string;
  motion_id?: string;
}

export interface DraftWorkPacketNextPromptTarget {
  target: "CONTROL_THREAD" | "ORCHESTRATOR" | "REPO_EXECUTION" | "EXPLORATION";
  label: string;
  prompt: string;
}

export type DraftWorkPacketCompatibilityState =
  | "compatible"
  | "preview_only"
  | "blocked";

export interface DraftWorkPacketActionCompatibility {
  requested_action: DraftWorkPacketAction;
  registry_capability_key: AgentRegistryCapabilityKey;
  registry_capability_state: AgentRegistryCapabilityState;
  status: DraftWorkPacketCompatibilityState;
  reason: string;
}

export interface DraftWorkPacketCompatibility {
  agent_exists: boolean;
  configured_scope_exists: boolean;
  target_repo_in_scope: boolean;
  target_surface_in_scope: boolean;
  execution_blocked: true;
  requested_action_statuses: DraftWorkPacketActionCompatibility[];
}

export interface DraftWorkPacketCanonicalRoleResolution {
  canonical_role_key: AgentRegistryCanonicalActiveKey | null;
  canonical_role_label: string | null;
  palette_draft_key: string | null;
  palette_draft_label: string | null;
}

export interface DraftWorkPacketSelectionMetadata {
  repo_posture: AgendaRepoPosture;
  work_class: AgendaWorkClass;
  requested_action_class: AgendaRequestedActionClass;
  has_validation_gate: boolean;
  has_human_decision_gate: boolean;
  mutation_boundary: AgendaMutationBoundary;
  authority_boundary: AgendaAuthorityBoundary;
  deterministic_chain_complete: boolean;
  selection_notes: string[];
}

export interface DraftWorkPacketSeed {
  packet_id: string;
  title: string;
  summary: string;
  status: DraftWorkPacketStatus;
  source: DraftWorkPacketSource;
  agent_key: string;
  configured_scope_key: AgentRegistryScopeKey;
  target: ControlPlaneTargetRef;
  requested_actions: DraftWorkPacketAction[];
  allowed_paths: string[];
  blocked_paths: string[];
  verification_commands: string[];
  human_gates: string[];
  evidence_expectations: string[];
  next_prompt_target: DraftWorkPacketNextPromptTarget;
}

export interface DraftWorkPacket {
  packet_id: string;
  title: string;
  summary: string;
  status: DraftWorkPacketStatus;
  source: DraftWorkPacketSource;
  configured_scope_key: AgentRegistryScopeKey;
  target: {
    repo_full_name: string;
    surface: ControlPlaneSurfaceEntry;
    project: ControlPlaneProjectEntry | null;
  };
  requested_actions: DraftWorkPacketAction[];
  allowed_paths: string[];
  blocked_paths: string[];
  verification_commands: string[];
  agent: AgentRegistryAgent;
  canonical_role: DraftWorkPacketCanonicalRoleResolution;
  compatibility: DraftWorkPacketCompatibility;
  selection_metadata: DraftWorkPacketSelectionMetadata;
  human_gates: string[];
  evidence_expectations: string[];
  next_prompt_target: DraftWorkPacketNextPromptTarget;
}

export interface DraftWorkPacketTaskPromptValidation {
  agent_exists: boolean;
  assigned_agent_is_shared_alias: boolean;
  configured_scope_exists: boolean;
  target_repo_compatible: boolean;
  target_surface_compatible: boolean;
  requested_actions_compatible: boolean;
}

export interface DraftWorkPacketTaskPrompt {
  prompt_id: string;
  packet_id: string;
  agenda_status: DraftWorkPacketStatus;
  source_kind: DraftWorkPacketSource["kind"];
  source_label: string;
  source_motion_id: string | null;
  assigned_agent_key: string;
  assigned_agent_label: string;
  canonical_role_key: AgentRegistryCanonicalActiveKey | null;
  canonical_role_label: string | null;
  palette_draft_key: string | null;
  palette_draft_label: string | null;
  next_prompt_target: DraftWorkPacketNextPromptTarget["target"];
  next_prompt_label: string;
  next_prompt_text: string;
  target_repo_full_name: string;
  target_surface_label: string;
  target_project_label: string | null;
  branch_name_suggestion: string;
  branch_suggestion_note: string;
  preview_status: "ready_preview" | "warning" | "blocked";
  warnings: string[];
  blocked_reasons: string[];
  validation: DraftWorkPacketTaskPromptValidation;
  prompt_text: string;
}
