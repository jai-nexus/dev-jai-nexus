export type ControlPlaneProjectStatus =
  | "active"
  | "planned"
  | "frozen"
  | "deprecated";

export type ControlPlaneSurfaceKey =
  | "landing-page"
  | "customer-portal"
  | "api-nexus"
  | "jai-format"
  | "operator-deliberation"
  | "operator-motions"
  | "operator-agents"
  | "operator-work"
  | "operator-projects"
  | "repo-registry"
  | "docs-canon"
  | "sot-ledger"
  | "teacher-copilot"
  | "offbook-ai";

export type ConfiguredAgentScopeKey =
  | "dev-jai-nexus"
  | "jai-nexus"
  | "customer-portal"
  | "api-nexus"
  | "jai-format";

export interface ControlPlaneRepoEntry {
  repo_id: string;
  org_repo: string;
  label: string;
  tier: number;
  role: string;
  owner: string;
  status: ControlPlaneProjectStatus;
  notes: string;
  project_ids: string[];
}

export interface ControlPlaneSurfaceEntry {
  key: ControlPlaneSurfaceKey;
  label: string;
  repo_full_name: string;
  summary: string;
  configured_scope_keys: ConfiguredAgentScopeKey[];
  project_ids: string[];
  notes: string[];
}

export interface ControlPlaneProjectEntry {
  project_id: string;
  name: string;
  root_nh_id: string;
  tier: number;
  priority_level: string;
  status: ControlPlaneProjectStatus;
  owner: string;
  summary: string;
  repo_full_names: string[];
  surface_keys: ControlPlaneSurfaceKey[];
  notes: string[];
}

export interface ControlPlaneConfiguredScopeEntry {
  key: ConfiguredAgentScopeKey;
  label: string;
  repo_full_name: string;
  surface_keys: ControlPlaneSurfaceKey[];
  summary: string;
  notes: string[];
}

export interface ControlPlaneTargetRef {
  repo_full_name: string;
  surface_key: ControlPlaneSurfaceKey;
  project_id: string | null;
}
