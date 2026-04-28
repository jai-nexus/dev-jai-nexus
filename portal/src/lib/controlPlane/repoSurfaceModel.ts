import type {
  ConfiguredAgentScopeKey,
  ControlPlaneConfiguredScopeEntry,
  ControlPlaneProjectEntry,
  ControlPlaneRepoEntry,
  ControlPlaneSurfaceEntry,
  ControlPlaneSurfaceKey,
} from "@/lib/controlPlane/types";

const FULL_REPO_REGISTRY: ControlPlaneRepoEntry[] = [
  {
    repo_id: "sot-nexus",
    org_repo: "jai-nexus/sot-nexus",
    label: "SoT Nexus",
    tier: 0,
    role: "sot-ledger",
    owner: "Jerry Ingram",
    status: "active",
    notes: "Source-of-truth DB and API service.",
    project_ids: ["jai-internal", "teacher-copilot", "offbook"],
  },
  {
    repo_id: "jai-nexus",
    org_repo: "jai-nexus/jai-nexus",
    label: "JAI Nexus",
    tier: 0,
    role: "jai-core",
    owner: "Jerry Ingram",
    status: "active",
    notes:
      "Primary repo for landing-page, customer-portal, API review, and format surfaces.",
    project_ids: ["jai-internal"],
  },
  {
    repo_id: "dev-jai-nexus",
    org_repo: "jai-nexus/dev-jai-nexus",
    label: "Dev JAI Nexus",
    tier: 0,
    role: "dev-spine",
    owner: "Jerry Ingram",
    status: "active",
    notes: "Operator-facing control-plane and status spine.",
    project_ids: ["jai-internal"],
  },
  {
    repo_id: "docs-nexus",
    org_repo: "jai-nexus/docs-nexus",
    label: "Docs Nexus",
    tier: 0,
    role: "docs-kb",
    owner: "Jerry Ingram",
    status: "active",
    notes: "Canonical documentation and knowledge-base surface.",
    project_ids: ["jai-internal", "teacher-copilot", "offbook"],
  },
  {
    repo_id: "offbook-ai",
    org_repo: "JerryIngram/offbook-ai",
    label: "OffBook AI",
    tier: 1,
    role: "product-app",
    owner: "Jerry Ingram",
    status: "planned",
    notes: "Planned product app and service surface for OffBook AI.",
    project_ids: ["offbook"],
  },
];

const SURFACE_CATALOG: ControlPlaneSurfaceEntry[] = [
  {
    key: "landing-page",
    label: "Landing page",
    repo_full_name: "jai-nexus/jai-nexus",
    summary: "Public landing and homepage experience inside jai-nexus/jai-nexus.",
    configured_scope_keys: ["jai-nexus"],
    project_ids: ["jai-internal"],
    notes: [
      "This is a surface inside jai-nexus/jai-nexus, not a separate repo.",
    ],
  },
  {
    key: "customer-portal",
    label: "Customer portal",
    repo_full_name: "jai-nexus/jai-nexus",
    summary:
      "Customer portal and intake experience inside jai-nexus/jai-nexus.",
    configured_scope_keys: ["customer-portal"],
    project_ids: ["jai-internal"],
    notes: [
      "Current canon treats customer-portal as a surface under jai-nexus/jai-nexus.",
    ],
  },
  {
    key: "api-nexus",
    label: "API Nexus",
    repo_full_name: "jai-nexus/jai-nexus",
    summary:
      "API contract and schema review surface inside jai-nexus/jai-nexus.",
    configured_scope_keys: ["api-nexus"],
    project_ids: ["jai-internal"],
    notes: [
      "Configured as a surface-level scope key, not a standalone repo registry entry.",
    ],
  },
  {
    key: "jai-format",
    label: "JAI Format",
    repo_full_name: "jai-nexus/jai-nexus",
    summary:
      "Formatting and presentation conventions surfaced inside jai-nexus/jai-nexus.",
    configured_scope_keys: ["jai-format"],
    project_ids: ["jai-internal"],
    notes: [
      "Configured as a surface-level scope key, not a standalone repo registry entry.",
    ],
  },
  {
    key: "operator-motions",
    label: "Operator motions",
    repo_full_name: "jai-nexus/dev-jai-nexus",
    summary: "Read-only Motion Operations surface for canonical motions and contenders.",
    configured_scope_keys: ["dev-jai-nexus"],
    project_ids: ["jai-internal"],
    notes: ["Control-plane operator surface."],
  },
  {
    key: "operator-agents",
    label: "Operator agents",
    repo_full_name: "jai-nexus/dev-jai-nexus",
    summary: "Configuration-only JAI Agent Registry surface.",
    configured_scope_keys: ["dev-jai-nexus"],
    project_ids: ["jai-internal"],
    notes: ["Control-plane operator surface."],
  },
  {
    key: "operator-work",
    label: "Operator work",
    repo_full_name: "jai-nexus/dev-jai-nexus",
    summary:
      "Draft-only work packet and task prompt preview surface for configured agents.",
    configured_scope_keys: ["dev-jai-nexus"],
    project_ids: ["jai-internal"],
    notes: ["Control-plane operator surface."],
  },
  {
    key: "operator-projects",
    label: "Operator projects",
    repo_full_name: "jai-nexus/dev-jai-nexus",
    summary:
      "Project registry view that distinguishes projects from repos and surfaces.",
    configured_scope_keys: ["dev-jai-nexus"],
    project_ids: ["jai-internal"],
    notes: ["Control-plane operator surface."],
  },
  {
    key: "repo-registry",
    label: "Repo registry",
    repo_full_name: "jai-nexus/dev-jai-nexus",
    summary: "Control-plane route for the full repo registry view.",
    configured_scope_keys: ["dev-jai-nexus"],
    project_ids: ["jai-internal"],
    notes: ["Control-plane operator surface."],
  },
  {
    key: "docs-canon",
    label: "Docs canon",
    repo_full_name: "jai-nexus/docs-nexus",
    summary: "Canonical docs and knowledge-base surface.",
    configured_scope_keys: [],
    project_ids: ["jai-internal", "teacher-copilot", "offbook"],
    notes: ["Full repo registry surface not currently exposed as an agent scope subset."],
  },
  {
    key: "sot-ledger",
    label: "Source-of-truth ledger",
    repo_full_name: "jai-nexus/sot-nexus",
    summary: "Source-of-truth ledger and service surface.",
    configured_scope_keys: [],
    project_ids: ["jai-internal", "teacher-copilot", "offbook"],
    notes: ["Full repo registry surface not currently exposed as an agent scope subset."],
  },
  {
    key: "teacher-copilot",
    label: "Teacher Copilot",
    repo_full_name: "jai-nexus/teacher-copilot-nexus",
    summary: "Planned product surface for Texas Teacher Copilot.",
    configured_scope_keys: [],
    project_ids: ["teacher-copilot"],
    notes: ["Referenced by project canon but not present in the current full repo registry."],
  },
  {
    key: "offbook-ai",
    label: "OffBook AI",
    repo_full_name: "JerryIngram/offbook-ai",
    summary: "Planned OffBook AI product and application surface.",
    configured_scope_keys: [],
    project_ids: ["offbook"],
    notes: ["Mapped to the current full repo registry entry for OffBook AI."],
  },
];

const PROJECT_CATALOG: ControlPlaneProjectEntry[] = [
  {
    project_id: "jai-internal",
    name: "JAI Internal / Spine",
    root_nh_id: "1.0",
    tier: 0,
    priority_level: "P1",
    status: "active",
    owner: "Jerry Ingram",
    summary:
      "JAI OS, dev.jai.nexus control-plane surfaces, source-of-truth, docs, and attached product surfaces.",
    repo_full_names: [
      "jai-nexus/jai-nexus",
      "jai-nexus/dev-jai-nexus",
      "jai-nexus/sot-nexus",
      "jai-nexus/docs-nexus",
    ],
    surface_keys: [
      "landing-page",
      "customer-portal",
      "api-nexus",
      "jai-format",
      "operator-motions",
      "operator-agents",
      "operator-work",
      "operator-projects",
      "repo-registry",
      "docs-canon",
      "sot-ledger",
    ],
    notes: [
      "Projects are workstreams that span repos and surfaces.",
      "This project owns the current control-plane and attached jai-nexus surfaces.",
    ],
  },
  {
    project_id: "teacher-copilot",
    name: "Texas Teacher Copilot",
    root_nh_id: "5.0",
    tier: 1,
    priority_level: "P2",
    status: "planned",
    owner: "Jerry Ingram",
    summary:
      "Planned external product workstream spanning a product app repo plus shared docs and source-of-truth surfaces.",
    repo_full_names: [
      "jai-nexus/teacher-copilot-nexus",
      "jai-nexus/docs-nexus",
      "jai-nexus/sot-nexus",
    ],
    surface_keys: ["teacher-copilot", "docs-canon", "sot-ledger"],
    notes: [
      "Teacher Copilot is a project, not a repo.",
      "Its primary product repo is planned and not yet present in the current full repo registry.",
    ],
  },
  {
    project_id: "offbook",
    name: "OffBook.ai",
    root_nh_id: "6.0",
    tier: 1,
    priority_level: "P2",
    status: "planned",
    owner: "Jerry Ingram",
    summary:
      "Planned creative-performance product workstream spanning the OffBook app, docs, and source-of-truth surfaces.",
    repo_full_names: [
      "JerryIngram/offbook-ai",
      "jai-nexus/docs-nexus",
      "jai-nexus/sot-nexus",
    ],
    surface_keys: ["offbook-ai", "docs-canon", "sot-ledger"],
    notes: [
      "OffBook.ai is modeled as a project with multiple repo and surface links.",
    ],
  },
];

const CONFIGURED_AGENT_SCOPE_SUBSET: ControlPlaneConfiguredScopeEntry[] = [
  {
    key: "dev-jai-nexus",
    label: "dev-jai-nexus configured subset",
    repo_full_name: "jai-nexus/dev-jai-nexus",
    surface_keys: [
      "operator-motions",
      "operator-agents",
      "operator-work",
      "operator-projects",
      "repo-registry",
    ],
    summary:
      "Configured control-plane subset for dev.jai.nexus operator surfaces.",
    notes: [
      "This is a configured subset, not the full repo registry.",
    ],
  },
  {
    key: "jai-nexus",
    label: "jai-nexus configured subset",
    repo_full_name: "jai-nexus/jai-nexus",
    surface_keys: ["landing-page"],
    summary:
      "Configured subset for the jai-nexus landing-page surface inside jai-nexus/jai-nexus.",
    notes: [
      "This scope key resolves to a surface inside jai-nexus/jai-nexus.",
    ],
  },
  {
    key: "customer-portal",
    label: "customer-portal configured subset",
    repo_full_name: "jai-nexus/jai-nexus",
    surface_keys: ["customer-portal"],
    summary:
      "Configured subset for the customer-portal surface inside jai-nexus/jai-nexus.",
    notes: [
      "Current canon treats customer-portal as a surface, not a standalone repo.",
    ],
  },
  {
    key: "api-nexus",
    label: "api-nexus configured subset",
    repo_full_name: "jai-nexus/jai-nexus",
    surface_keys: ["api-nexus"],
    summary:
      "Configured subset for API contract and schema review inside jai-nexus/jai-nexus.",
    notes: [
      "This scope key maps to a surface, not a standalone repo registry entry.",
    ],
  },
  {
    key: "jai-format",
    label: "jai-format configured subset",
    repo_full_name: "jai-nexus/jai-nexus",
    surface_keys: ["jai-format"],
    summary:
      "Configured subset for JAI format and presentation work inside jai-nexus/jai-nexus.",
    notes: [
      "This scope key maps to a surface, not a standalone repo registry entry.",
    ],
  },
];

function cloneArray<T>(value: T[]): T[] {
  return value.map((entry) => ({ ...entry }));
}

export function getFullRepoRegistry(): ControlPlaneRepoEntry[] {
  return cloneArray(FULL_REPO_REGISTRY);
}

export function getSurfaceCatalog(): ControlPlaneSurfaceEntry[] {
  return cloneArray(SURFACE_CATALOG);
}

export function getProjectCatalog(): ControlPlaneProjectEntry[] {
  return cloneArray(PROJECT_CATALOG);
}

export function getConfiguredAgentScopeSubset(): ControlPlaneConfiguredScopeEntry[] {
  return cloneArray(CONFIGURED_AGENT_SCOPE_SUBSET);
}

export function getRepoEntry(
  repoFullName: string,
): ControlPlaneRepoEntry | undefined {
  return FULL_REPO_REGISTRY.find((entry) => entry.org_repo === repoFullName);
}

export function getSurfaceEntry(
  key: ControlPlaneSurfaceKey,
): ControlPlaneSurfaceEntry | undefined {
  return SURFACE_CATALOG.find((entry) => entry.key === key);
}

export function getProjectEntry(
  projectId: string,
): ControlPlaneProjectEntry | undefined {
  return PROJECT_CATALOG.find((entry) => entry.project_id === projectId);
}

export function getConfiguredScopeEntry(
  key: ConfiguredAgentScopeKey,
): ControlPlaneConfiguredScopeEntry | undefined {
  return CONFIGURED_AGENT_SCOPE_SUBSET.find((entry) => entry.key === key);
}

export function getSurfaceEntriesForConfiguredScope(
  key: ConfiguredAgentScopeKey,
): ControlPlaneSurfaceEntry[] {
  const scope = getConfiguredScopeEntry(key);

  if (!scope) {
    return [];
  }

  return scope.surface_keys
    .map((surfaceKey) => getSurfaceEntry(surfaceKey))
    .filter((entry): entry is ControlPlaneSurfaceEntry => Boolean(entry));
}

export function getSurfaceLabels(surfaceKeys: ControlPlaneSurfaceKey[]): string[] {
  return surfaceKeys
    .map((key) => getSurfaceEntry(key)?.label ?? key)
    .filter((label, index, values) => values.indexOf(label) === index);
}
