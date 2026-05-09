import type {
  AgentConfigurationRegistry,
  AgentRegistryAgent,
  AgentRegistryCapabilityKey,
  AgentRegistryCapabilityState,
  AgentRegistryCanonicalActiveKey,
  AgentRegistryCanonicalLane,
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

function defaultHandleForKey(key: string): string {
  const handleMap: Record<string, string> = {
    "jai-architect": "architect@jai.nexus",
    "jai-builder": "builder@jai.nexus",
    "jai-verifier": "verifier@jai.nexus",
    "jai-librarian": "librarian@jai.nexus",
    "jai-operator": "operator@jai.nexus",
    "jai-council-root": "council@jai.nexus",
    "jai-proposer": "proposer@jai.nexus",
    "jai-executor": "executor@jai.nexus",
    "jai-challenger": "challenger@jai.nexus",
    "jai-arbiter": "arbiter@jai.nexus",
    "jai-orchestrator": "orchestrator-draft@jai.nexus",
    "jai-landing-page-agent": "landing-page-draft@jai.nexus",
    "jai-customer-portal-agent": "customer-portal-draft@jai.nexus",
    "jai-governance-agent": "governance-draft@jai.nexus",
  };

  return handleMap[key] ?? `${key}@jai.nexus`;
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

function createNamedAgent(args: {
  key: string;
  label: string;
  summary: string;
  configured_scope_keys: AgentRegistryScopeKey[];
  notes: string[];
  agent_class: AgentRegistryAgent["agent_class"];
  canonical_key?: AgentRegistryCanonicalActiveKey;
  canonical_lane?: AgentRegistryCanonicalLane;
  nh_id?: string;
  palette_proposed_role?: AgentRegistryCanonicalActiveKey;
}): AgentRegistryAgent {
  return {
    key: args.key,
    label: args.label,
    handle: defaultHandleForKey(args.key),
    kind: "named_agent",
    agent_class: args.agent_class,
    canonical_key: args.canonical_key,
    canonical_lane: args.canonical_lane,
    nh_id: args.nh_id,
    palette_proposed_role: args.palette_proposed_role,
    summary: args.summary,
    execution_identity: false,
    configured_scope_keys: args.configured_scope_keys,
    capabilities: createCapabilitySet(),
    credential_posture: createCredentialPosture(args.key),
    notes: args.notes,
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

const CANONICAL_ACTIVE_AGENTS: AgentRegistryAgent[] = [
  createNamedAgent({
    key: "jai-architect",
    label: "JAI Architect",
    summary:
      "Canonical active planning and design identity for bounded JAI repo work and system framing.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active baseline identity.",
      "Planning and design posture only in v0.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-architect",
    canonical_lane: "execution",
    nh_id: "6.0.10",
  }),
  createNamedAgent({
    key: "jai-builder",
    label: "JAI Builder",
    summary:
      "Canonical active implementation identity for drafting plans and previewing file changes.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active baseline identity.",
      "May draft files as preview only in v0.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-builder",
    canonical_lane: "execution",
    nh_id: "6.0.11",
  }),
  createNamedAgent({
    key: "jai-verifier",
    label: "JAI Verifier",
    summary:
      "Canonical active validation identity for review, checks, and evidence gathering.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active baseline identity.",
      "Runtime execution remains disabled.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-verifier",
    canonical_lane: "execution",
    nh_id: "6.0.12",
  }),
  createNamedAgent({
    key: "jai-librarian",
    label: "JAI Librarian",
    summary:
      "Canonical active documentation and corpus-maintenance identity for packaging, indexing, and reference upkeep.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active baseline identity.",
      "Registry and documentation posture only in v0.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-librarian",
    canonical_lane: "execution",
    nh_id: "6.0.13",
  }),
  createNamedAgent({
    key: "jai-operator",
    label: "JAI Operator",
    summary:
      "Canonical active operator identity for review, handoff, and bounded control-plane operations.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active baseline identity.",
      "No branch write, PR creation, or execution authority in v0.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-operator",
    canonical_lane: "execution",
    nh_id: "6.0.14",
  }),
  createNamedAgent({
    key: "jai-council-root",
    label: "JAI Council Root",
    summary:
      "Canonical active governance root identity for council topology and decision framing.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active governance baseline.",
      "Governance visibility only; no automatic ratification power is enabled here.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-council-root",
    canonical_lane: "governance",
    nh_id: "6.0",
  }),
  createNamedAgent({
    key: "jai-proposer",
    label: "JAI Proposer",
    summary:
      "Canonical active governance identity for proposing bounded motions and candidate routes.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active governance baseline.",
      "Proposal identity only; no direct execution capability is added.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-proposer",
    canonical_lane: "governance",
    nh_id: "6.0.1",
  }),
  createNamedAgent({
    key: "jai-executor",
    label: "JAI Executor",
    summary:
      "Canonical active governance-loop identity for bounded execution-slot participation without runtime enablement in v0.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active governance baseline.",
      "Execution authority remains disabled despite the canonical role name.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-executor",
    canonical_lane: "governance",
    nh_id: "6.0.2",
  }),
  createNamedAgent({
    key: "jai-challenger",
    label: "JAI Challenger",
    summary:
      "Canonical active governance identity for challenge review, objection surfacing, and risk checks.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active governance baseline.",
      "Challenge posture only; no ratification mutation is enabled here.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-challenger",
    canonical_lane: "governance",
    nh_id: "6.0.3",
  }),
  createNamedAgent({
    key: "jai-arbiter",
    label: "JAI Arbiter",
    summary:
      "Canonical active governance identity for final bounded arbitration within the visible control-plane model.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Canonical active governance baseline.",
      "Arbitration is modeled read-only here; no live authority is activated.",
    ],
    agent_class: "canonical_active",
    canonical_key: "jai-arbiter",
    canonical_lane: "governance",
    nh_id: "6.0.4",
  }),
];

const JAI_PALETTE_DRAFT_AGENTS: AgentRegistryAgent[] = [
  createNamedAgent({
    key: "jai-orchestrator",
    label: "JAI Orchestrator",
    summary:
      "JAI Palette draft for a future top-level coordination identity across grid, zones, and workflow composition.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Palette draft only in v0.",
      "A drafted custom agent becomes canonical only through motion and ratification.",
    ],
    agent_class: "palette_draft",
    palette_proposed_role: "jai-operator",
  }),
  createNamedAgent({
    key: "jai-landing-page-agent",
    label: "JAI Landing Page Agent",
    summary:
      "JAI Palette draft for a surface-specific landing-page planning and preview identity.",
    configured_scope_keys: ["jai-nexus"],
    notes: [
      "Palette draft only in v0.",
      "Maps to the canonical builder role for work-packet display.",
    ],
    agent_class: "palette_draft",
    palette_proposed_role: "jai-builder",
  }),
  createNamedAgent({
    key: "jai-customer-portal-agent",
    label: "JAI Customer Portal Agent",
    summary:
      "JAI Palette draft for a customer-portal planning and draft-preview identity.",
    configured_scope_keys: ["customer-portal"],
    notes: [
      "Palette draft only in v0.",
      "Maps to the canonical builder role for work-packet display.",
    ],
    agent_class: "palette_draft",
    palette_proposed_role: "jai-builder",
  }),
  createNamedAgent({
    key: "jai-governance-agent",
    label: "JAI Governance Agent",
    summary:
      "JAI Palette draft for a future governance-specialized design that remains outside the canonical active baseline.",
    configured_scope_keys: CONFIGURED_SCOPE_KEYS,
    notes: [
      "Palette draft only in v0.",
      "No exact canonical role is assigned in this seam.",
    ],
    agent_class: "palette_draft",
  }),
];

const NAMED_AGENTS: AgentRegistryAgent[] = [
  ...CANONICAL_ACTIVE_AGENTS,
  ...JAI_PALETTE_DRAFT_AGENTS,
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

export function getCanonicalActiveAgents(): AgentRegistryAgent[] {
  return CANONICAL_ACTIVE_AGENTS.map((agent) => ({ ...agent }));
}

export function getPaletteDraftAgents(): AgentRegistryAgent[] {
  return JAI_PALETTE_DRAFT_AGENTS.map((agent) => ({ ...agent }));
}

export function getAgentByKey(key: string): AgentRegistryAgent | undefined {
  return NAMED_AGENTS.find((agent) => agent.key === key);
}

export function getAgentConfigurationRegistry(): AgentConfigurationRegistry {
  return REGISTRY;
}
