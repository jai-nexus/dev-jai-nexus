import type {
  AgentConfigurationRegistry,
  AgentRegistryAgent,
  AgentRegistryCapabilityKey,
  AgentRegistryCapabilityState,
  AgentRegistryConfiguredScope,
  AgentRegistryCredentialPosture,
  AgentRegistryIdentity,
  AgentRegistryScopeKey,
} from "@/lib/agents/types";
import {
  getConfiguredAgentScopeSubset,
  getSurfaceLabels,
} from "@/lib/controlPlane/repoSurfaceModel";

const CONFIGURED_SCOPES: AgentRegistryConfiguredScope[] =
  getConfiguredAgentScopeSubset().map((scope) => ({
    key: scope.key,
    label: scope.label,
    repo_full_name: scope.repo_full_name,
    surface_keys: [...scope.surface_keys],
    surface_labels: getSurfaceLabels(scope.surface_keys),
    summary: scope.summary,
    notes: [...scope.notes],
  }));

const CONFIGURED_SCOPE_KEYS: AgentRegistryScopeKey[] = CONFIGURED_SCOPES.map(
  (scope) => scope.key,
);

const CAPABILITY_KEYS: AgentRegistryCapabilityKey[] = [
  "view_only",
  "draft_plan",
  "draft_files_preview",
  "branch_write",
  "propose_pr",
  "execute_runtime",
];

function createCapabilitySet(): Record<
  AgentRegistryCapabilityKey,
  AgentRegistryCapabilityState
> {
  return {
    view_only: "enabled",
    draft_plan: "enabled",
    draft_files_preview: "preview_only",
    branch_write: "disabled",
    propose_pr: "disabled",
    execute_runtime: "disabled",
  };
}

function envPrefix(key: string): string {
  return `JAI_AGENT_${key.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`;
}

function createCredentialPosture(key: string): AgentRegistryCredentialPosture[] {
  const prefix = envPrefix(key);
  return [
    {
      key: "model_api_key",
      env_var: `${prefix}_MODEL_API_KEY`,
      purpose:
        "Reserved for a future named-agent model identity. Not read in v0.",
      enabled_in_v0: false,
    },
    {
      key: "github_token",
      env_var: `${prefix}_GITHUB_TOKEN`,
      purpose:
        "Reserved for future branch-write or PR proposals. Disabled in v0.",
      enabled_in_v0: false,
    },
  ];
}

function createNamedAgent(
  key: string,
  label: string,
  summary: string,
  configuredScopeKeys: AgentRegistryScopeKey[],
  notes: string[],
): AgentRegistryAgent {
  return {
    key,
    label,
    handle: `${key}@jai.nexus`,
    kind: "named_agent",
    summary,
    execution_identity: false,
    configured_scope_keys: configuredScopeKeys,
    capabilities: createCapabilitySet(),
    credential_posture: createCredentialPosture(key),
    notes,
  };
}

const HUMAN_OPERATORS: AgentRegistryIdentity[] = [
  {
    id: "human-admin",
    label: "Human operator",
    handle: "admin@jai.nexus",
    kind: "human_operator",
    summary:
      "Interactive operator identity for reviewing surfaces and managing configuration.",
    execution_identity: false,
    view_only_alias: false,
    notes: [
      "This is a human-operated login, not a named JAI agent identity.",
      "Execution and write capability remain disabled in this registry v0 seam.",
    ],
  },
];

const SHARED_ALIASES: AgentRegistryIdentity[] = [
  {
    id: "shared-agent-alias",
    label: "Shared view-only alias",
    handle: "agent@jai.nexus",
    kind: "shared_alias",
    summary:
      "Shared alias for view-only operator access. It is not a future execution identity.",
    execution_identity: false,
    view_only_alias: true,
    notes: [
      "Shared aliases remain non-canonical for execution identity in v0.",
      "This alias is view-only and does not authorize branch writes, PRs, or runtime execution.",
    ],
  },
];

const NAMED_AGENTS: AgentRegistryAgent[] = [
  createNamedAgent(
    "jai-orchestrator",
    "JAI Orchestrator",
    "Future top-level coordination identity for planning and read-only orchestration views.",
    CONFIGURED_SCOPE_KEYS,
    [
      "Configuration only in v0.",
      "Execution identity is reserved, not enabled.",
    ],
  ),
  createNamedAgent(
    "jai-builder",
    "JAI Builder",
    "Future implementation identity for drafting plans and previewing file changes.",
    CONFIGURED_SCOPE_KEYS,
    [
      "May draft files as preview only in v0.",
      "Repo mutation remains disabled.",
    ],
  ),
  createNamedAgent(
    "jai-verifier",
    "JAI Verifier",
    "Future validation identity for review, checks, and evidence gathering.",
    CONFIGURED_SCOPE_KEYS,
    [
      "View and draft-plan posture only in v0.",
      "Runtime execution remains disabled.",
    ],
  ),
  createNamedAgent(
    "jai-librarian",
    "JAI Librarian",
    "Future documentation and governance-reference identity for registry and corpus maintenance.",
    CONFIGURED_SCOPE_KEYS,
    [
      "Registry surface is read-only.",
      "No canonical motion mutation is enabled in v0.",
    ],
  ),
  createNamedAgent(
    "jai-landing-page-agent",
    "JAI Landing Page Agent",
    "Future site-specific identity for jai-nexus landing-page planning and preview work.",
    ["jai-nexus"],
    [
      "Scoped to jai-nexus only.",
      "Branch writes and PR proposals remain disabled in v0.",
    ],
  ),
  createNamedAgent(
    "jai-customer-portal-agent",
    "JAI Customer Portal Agent",
    "Future site-specific identity for customer-portal planning and draft-file previews.",
    ["customer-portal"],
    [
      "Scoped to customer-portal only.",
      "No runtime or repo execution is enabled in v0.",
    ],
  ),
  createNamedAgent(
    "jai-governance-agent",
    "JAI Governance Agent",
    "Future governance-focused identity for read-only policy review and draft-plan support.",
    CONFIGURED_SCOPE_KEYS,
    [
      "Intended for governance review metadata only in v0.",
      "It cannot vote, ratify, or mutate motion packages in this seam.",
    ],
  ),
];

const REGISTRY: AgentConfigurationRegistry = {
  schema_version: "0.1.0",
  execution_posture: "disabled_v0",
  human_operators: HUMAN_OPERATORS,
  shared_aliases: SHARED_ALIASES,
  named_agents: NAMED_AGENTS,
  configured_scopes: CONFIGURED_SCOPES,
  configured_scope_keys: CONFIGURED_SCOPE_KEYS,
  capability_keys: CAPABILITY_KEYS,
};

export function getAgentConfigurationRegistry(): AgentConfigurationRegistry {
  return REGISTRY;
}
