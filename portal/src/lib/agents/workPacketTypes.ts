import type {
  AgentRegistryAgent,
  AgentRegistryCapabilityKey,
  AgentRegistryCapabilityState,
  AgentRegistryScopeKey,
} from "@/lib/agents/types";
import type {
  ControlPlaneProjectEntry,
  ControlPlaneSurfaceEntry,
  ControlPlaneTargetRef,
} from "@/lib/controlPlane/types";

export type DraftWorkPacketAction =
  | "draft_plan"
  | "draft_files_preview"
  | "verify";

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

export interface DraftWorkPacketSeed {
  packet_id: string;
  title: string;
  summary: string;
  agent_key: string;
  configured_scope_key: AgentRegistryScopeKey;
  target: ControlPlaneTargetRef;
  requested_actions: DraftWorkPacketAction[];
  allowed_paths: string[];
  blocked_paths: string[];
  verification_commands: string[];
  human_gates: string[];
  evidence_expectations: string[];
}

export interface DraftWorkPacket {
  packet_id: string;
  title: string;
  summary: string;
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
  compatibility: DraftWorkPacketCompatibility;
  human_gates: string[];
  evidence_expectations: string[];
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
  assigned_agent_key: string;
  assigned_agent_label: string;
  target_repo_full_name: string;
  target_surface_label: string;
  target_project_label: string | null;
  branch_name_suggestion: string;
  branch_suggestion_note: string;
  status: "ready_preview" | "warning" | "blocked";
  warnings: string[];
  blocked_reasons: string[];
  validation: DraftWorkPacketTaskPromptValidation;
  prompt_text: string;
}
