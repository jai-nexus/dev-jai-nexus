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

export type AgentRegistryRepoScope =
  | "dev-jai-nexus"
  | "jai-nexus"
  | "customer-portal"
  | "api-nexus"
  | "jai-format";

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

export interface AgentRegistryAgent {
  key: string;
  label: string;
  handle: string;
  kind: "named_agent";
  summary: string;
  execution_identity: false;
  repo_scopes: AgentRegistryRepoScope[];
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
  repo_scopes: AgentRegistryRepoScope[];
  capability_keys: AgentRegistryCapabilityKey[];
}
