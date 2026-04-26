import type {
  AgentRegistryAgent,
  AgentRegistryCapabilityKey,
  AgentRegistryCapabilityState,
  AgentRegistryRepoScope,
} from "@/lib/agents/types";

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
  repo_scope_in_scope: boolean;
  execution_blocked: true;
  requested_action_statuses: DraftWorkPacketActionCompatibility[];
}

export interface DraftWorkPacketSeed {
  packet_id: string;
  title: string;
  summary: string;
  agent_key: string;
  repo_scope: AgentRegistryRepoScope;
  requested_actions: DraftWorkPacketAction[];
  human_gates: string[];
  evidence_expectations: string[];
}

export interface DraftWorkPacket {
  packet_id: string;
  title: string;
  summary: string;
  repo_scope: AgentRegistryRepoScope;
  requested_actions: DraftWorkPacketAction[];
  agent: AgentRegistryAgent;
  compatibility: DraftWorkPacketCompatibility;
  human_gates: string[];
  evidence_expectations: string[];
}
