import type {
  ConfiguredAgentScopeKey,
  ControlPlaneSurfaceKey,
} from "@/lib/controlPlane/types";

export type AgentRegistryIdentityKind =
  | "human_operator"
  | "shared_alias"
  | "named_agent";

export type AgentRegistryCapabilityKey =
  | "view_only"
  | "draft_plan"
  | "draft_files_preview"
  | "branch_write"
  | "propose_pr"
  | "execute_runtime";

export type AgentRegistryCapabilityState =
  | "enabled"
  | "preview_only"
  | "disabled";

export type AgentRegistryAgentClass = "canonical_active" | "palette_draft";

export type AgentRegistryCanonicalLane = "execution" | "governance";

export type AgentRegistryCanonicalActiveKey =
  | "jai-architect"
  | "jai-builder"
  | "jai-verifier"
  | "jai-librarian"
  | "jai-operator"
  | "jai-council-root"
  | "jai-proposer"
  | "jai-executor"
  | "jai-challenger"
  | "jai-arbiter";

export type AgentRegistryScopeKey = ConfiguredAgentScopeKey;
export type AgentRegistryRepoScope = AgentRegistryScopeKey;

export interface AgentRegistryIdentity {
  id: string;
  label: string;
  handle: string;
  kind: "human_operator" | "shared_alias";
  summary: string;
  execution_identity: false;
  view_only_alias: boolean;
  notes: string[];
}

export interface AgentRegistryCredentialPosture {
  key: string;
  env_var: string;
  purpose: string;
  enabled_in_v0: false;
}

export interface AgentRegistryConfiguredScope {
  key: AgentRegistryScopeKey;
  label: string;
  repo_full_name: string;
  surface_keys: ControlPlaneSurfaceKey[];
  surface_labels: string[];
  summary: string;
  notes: string[];
}

export interface AgentRegistryAgent {
  key: string;
  label: string;
  handle: string;
  kind: "named_agent";
  agent_class: AgentRegistryAgentClass;
  canonical_key?: AgentRegistryCanonicalActiveKey;
  canonical_lane?: AgentRegistryCanonicalLane;
  nh_id?: string;
  palette_proposed_role?: AgentRegistryCanonicalActiveKey;
  summary: string;
  execution_identity: false;
  configured_scope_keys: AgentRegistryScopeKey[];
  capabilities: Record<
    AgentRegistryCapabilityKey,
    AgentRegistryCapabilityState
  >;
  credential_posture: AgentRegistryCredentialPosture[];
  notes: string[];
}

export interface AgentConfigurationRegistry {
  schema_version: "0.1.0";
  execution_posture: "disabled_v0";
  human_operators: AgentRegistryIdentity[];
  shared_aliases: AgentRegistryIdentity[];
  named_agents: AgentRegistryAgent[];
  configured_scopes: AgentRegistryConfiguredScope[];
  configured_scope_keys: AgentRegistryScopeKey[];
  capability_keys: AgentRegistryCapabilityKey[];
}
