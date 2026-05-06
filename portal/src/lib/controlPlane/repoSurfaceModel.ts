import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type {
  ConfiguredAgentScopeKey,
  ControlPlaneConfiguredScopeEntry,
  ControlPlaneProjectEntry,
  ControlPlaneRepoEntry,
  ControlPlaneSurfaceEntry,
  ControlPlaneSurfaceKey,
} from "@/lib/controlPlane/types";

type CanonicalRepoConfigRow = {
  nh_id?: string;
  repo: string;
  description?: string;
  tier?: number;
  role?: string;
  status?: string;
  owner?: string;
  notes?: string;
  wave?: number | null;
};

type CanonicalRepoConfigFile =
  | CanonicalRepoConfigRow[]
  | {
      schema_version?: string | number;
      repos?: CanonicalRepoConfigRow[];
    };

type RepoMetadata = {
  label?: string;
  owner?: string;
  tier?: number;
  role?: string;
  status?: ControlPlaneRepoEntry["status"];
  notes?: string;
  project_ids?: string[];
};

const DEFAULT_OWNER = "Jerry Ingram";

const REPO_METADATA: Record<string, RepoMetadata> = {
  "jai-nexus/jai-nexus": {
    label: "JAI Nexus",
    tier: 0,
    role: "jai-core",
    project_ids: ["jai-internal"],
    notes:
      "Primary repo for landing-page and customer-facing surfaces. Customer portal remains a surface inside this repo.",
  },
  "jai-nexus/dev-jai-nexus": {
    label: "Dev JAI Nexus",
    tier: 0,
    role: "dev-spine",
    project_ids: ["jai-internal"],
    notes: "Operator-facing control-plane and status spine.",
  },
  "jai-nexus/sot-nexus": {
    label: "SoT Nexus",
    tier: 0,
    role: "sot-ledger",
    project_ids: ["jai-internal", "teacher-copilot", "offbook"],
    notes: "Source-of-truth ledger and service surface.",
  },
  "jai-nexus/docs-nexus": {
    label: "Docs Nexus",
    tier: 0,
    role: "docs-kb",
    project_ids: ["jai-internal", "teacher-copilot", "offbook"],
    notes: "Canonical documentation and knowledge-base repo.",
  },
  "jai-nexus/api-nexus": {
    label: "API Nexus",
    tier: 1,
    role: "api-surface",
    project_ids: ["jai-internal"],
    notes: "Standalone API surface repo; keep distinct from jai-nexus product surfaces.",
  },
  "jai-nexus/jai-format": {
    label: "JAI Format",
    tier: 0,
    role: "format-spec",
    project_ids: ["jai-internal"],
    notes: "Canonical formatting and container-spec repo.",
  },
  "jai-nexus/datacontracts-nexus": {
    label: "DataContracts Nexus",
    tier: 0,
    role: "contracts",
    project_ids: ["jai-internal"],
  },
  "jai-nexus/orchestrator-nexus": {
    label: "Orchestrator Nexus",
    tier: 2,
    role: "orchestrator",
    project_ids: ["jai-internal"],
  },
  "jai-nexus/audit-nexus": {
    label: "Audit Nexus",
    tier: 2,
    role: "tooling",
    project_ids: ["jai-internal"],
  },
  "jai-nexus/community-nexus": {
    label: "Community Nexus",
    tier: 2,
    role: "community",
    project_ids: ["jai-internal"],
  },
  "jai-nexus/integrations-nexus": {
    label: "Integrations Nexus",
    tier: 2,
    role: "integrations",
    project_ids: ["jai-internal"],
  },
  "jai-nexus/jai-pilot": {
    label: "JAI Pilot",
    tier: 1,
    role: "pilot",
    project_ids: ["jai-internal"],
    notes: "Present in broader registry; current control-plane surfaces keep this planned-only.",
  },
  "jai-nexus/jai-nexus-legacy": {
    label: "JAI Nexus Legacy",
    tier: 2,
    role: "legacy",
    status: "frozen",
    project_ids: ["jai-internal"],
    notes: "Legacy placeholder entry for older jai-nexus lineage.",
  },
  "JerryIngram/offbook-ai": {
    label: "OffBook AI",
    tier: 1,
    role: "product-app",
    status: "planned",
    project_ids: ["offbook"],
    notes:
      "External product-app anchor retained in the broader registry. Treat as non-control-plane product coverage, not a core operator repo.",
  },
};

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
      "Customer portal and customer console experience inside jai-nexus/jai-nexus.",
    configured_scope_keys: ["customer-portal"],
    project_ids: ["jai-internal"],
    notes: [
      "Current canon treats customer-portal as a surface under jai-nexus/jai-nexus.",
    ],
  },
  {
    key: "api-nexus",
    label: "API Nexus",
    repo_full_name: "jai-nexus/api-nexus",
    summary: "Standalone API contract and schema surface repo.",
    configured_scope_keys: ["api-nexus"],
    project_ids: ["jai-internal"],
    notes: [
      "This configured scope key now resolves to the actual api-nexus repo entry.",
    ],
  },
  {
    key: "jai-format",
    label: "JAI Format",
    repo_full_name: "jai-nexus/jai-format",
    summary: "Standalone formatting and presentation conventions repo.",
    configured_scope_keys: ["jai-format"],
    project_ids: ["jai-internal"],
    notes: [
      "This configured scope key now resolves to the actual jai-format repo entry.",
    ],
  },
  {
    key: "operator-deliberation",
    label: "Operator deliberation",
    repo_full_name: "jai-nexus/dev-jai-nexus",
    summary:
      "Advisory-only operator deliberation surface for non-binding agent reasoning and next-step prompts.",
    configured_scope_keys: ["dev-jai-nexus"],
    project_ids: ["jai-internal"],
    notes: ["Control-plane operator surface."],
  },
  {
    key: "operator-motions",
    label: "Operator motions",
    repo_full_name: "jai-nexus/dev-jai-nexus",
    summary:
      "Read-only Motion Operations surface for canonical motions and contenders.",
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
    notes: ["Referenced by project canon; repo registration still trails the project naming canon."],
  },
  {
    key: "offbook-ai",
    label: "OffBook AI",
    repo_full_name: "JerryIngram/offbook-ai",
    summary: "Planned and external OffBook AI product and application surface.",
    configured_scope_keys: [],
    project_ids: ["offbook"],
    notes: ["Mapped to the broader repo registry entry for OffBook AI."],
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
    owner: DEFAULT_OWNER,
    summary:
      "JAI OS, dev.jai.nexus control-plane surfaces, source-of-truth, docs, and attached product surfaces.",
    repo_full_names: [
      "jai-nexus/jai-nexus",
      "jai-nexus/dev-jai-nexus",
      "jai-nexus/sot-nexus",
      "jai-nexus/docs-nexus",
      "jai-nexus/api-nexus",
      "jai-nexus/jai-format",
      "jai-nexus/datacontracts-nexus",
      "jai-nexus/orchestrator-nexus",
      "jai-nexus/audit-nexus",
      "jai-nexus/community-nexus",
      "jai-nexus/integrations-nexus",
      "jai-nexus/jai-pilot",
    ],
    surface_keys: [
      "landing-page",
      "customer-portal",
      "api-nexus",
      "jai-format",
      "operator-motions",
      "operator-deliberation",
      "operator-agents",
      "operator-work",
      "operator-projects",
      "repo-registry",
      "docs-canon",
      "sot-ledger",
    ],
    notes: [
      "Projects are workstreams that span repos and surfaces.",
      "Customer portal remains a product surface inside jai-nexus/jai-nexus.",
    ],
  },
  {
    project_id: "teacher-copilot",
    name: "Texas Teacher Copilot",
    root_nh_id: "5.0",
    tier: 1,
    priority_level: "P2",
    status: "planned",
    owner: DEFAULT_OWNER,
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
      "Project naming canon still references teacher-copilot-nexus while the broader repo registry still carries legacy teacher-copilot naming.",
    ],
  },
  {
    project_id: "offbook",
    name: "OffBook.ai",
    root_nh_id: "6.0",
    tier: 1,
    priority_level: "P2",
    status: "planned",
    owner: DEFAULT_OWNER,
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
      "operator-deliberation",
      "operator-agents",
      "operator-work",
      "operator-projects",
      "repo-registry",
    ],
    summary:
      "Configured control-plane subset for dev.jai.nexus operator surfaces.",
    notes: ["This is a configured subset, not the full repo registry."],
  },
  {
    key: "jai-nexus",
    label: "jai-nexus configured subset",
    repo_full_name: "jai-nexus/jai-nexus",
    surface_keys: ["landing-page"],
    summary:
      "Configured subset for the jai-nexus landing-page surface inside jai-nexus/jai-nexus.",
    notes: ["This scope key resolves to a surface inside jai-nexus/jai-nexus."],
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
    repo_full_name: "jai-nexus/api-nexus",
    surface_keys: ["api-nexus"],
    summary:
      "Configured subset for the standalone api-nexus repo and its API review surface.",
    notes: ["This scope key now maps to the actual api-nexus repo entry."],
  },
  {
    key: "jai-format",
    label: "jai-format configured subset",
    repo_full_name: "jai-nexus/jai-format",
    surface_keys: ["jai-format"],
    summary:
      "Configured subset for the standalone jai-format repo and format surface.",
    notes: ["This scope key now maps to the actual jai-format repo entry."],
  },
];

function repoIdFromOrgRepo(orgRepo: string): string {
  const parts = orgRepo.split("/").filter(Boolean);
  return parts.at(-1) ?? orgRepo;
}

function formatRepoLabel(repoFullName: string): string {
  const slug = repoIdFromOrgRepo(repoFullName);
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeStatus(
  value: string | undefined,
  notes: string | undefined,
): ControlPlaneRepoEntry["status"] {
  const normalized = (value ?? "").trim().toLowerCase();
  if (
    normalized === "active" ||
    normalized === "planned" ||
    normalized === "frozen" ||
    normalized === "deprecated"
  ) {
    return normalized;
  }

  if ((notes ?? "").toLowerCase().includes("deprecated")) {
    return "deprecated";
  }

  return "planned";
}

function resolveCanonicalReposPath(): string {
  const candidates = [
    path.join(process.cwd(), "config", "repos.yaml"),
    path.join(process.cwd(), "portal", "config", "repos.yaml"),
  ];

  const match = candidates.find((candidate) => fs.existsSync(candidate));
  if (!match) {
    throw new Error(
      "Canonical repo registry not found. Expected config/repos.yaml or portal/config/repos.yaml.",
    );
  }

  return match;
}

function loadCanonicalRepoRows(): CanonicalRepoConfigRow[] {
  const configPath = resolveCanonicalReposPath();
  const file = fs.readFileSync(configPath, "utf8");
  const parsed = YAML.parse(file) as CanonicalRepoConfigFile;

  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.repos)) return parsed.repos;
  return [];
}

function buildRepoNotes(row: CanonicalRepoConfigRow, metadata: RepoMetadata): string {
  return [row.description, row.notes, metadata.notes]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" ");
}

function buildFullRepoRegistry(): ControlPlaneRepoEntry[] {
  return loadCanonicalRepoRows()
    .filter((row) => typeof row.repo === "string" && row.repo.includes("/"))
    .map((row) => {
      const metadata = REPO_METADATA[row.repo] ?? {};
      const notes = buildRepoNotes(row, metadata);

      return {
        repo_id: repoIdFromOrgRepo(row.repo),
        org_repo: row.repo,
        label: metadata.label ?? formatRepoLabel(row.repo),
        tier: metadata.tier ?? row.tier ?? 2,
        role: metadata.role ?? row.role ?? "registry",
        owner: metadata.owner ?? row.owner ?? DEFAULT_OWNER,
        status: metadata.status ?? normalizeStatus(row.status, row.notes),
        notes,
        project_ids: [...(metadata.project_ids ?? ["jai-internal"])],
      };
    })
    .sort((left, right) => left.org_repo.localeCompare(right.org_repo));
}

const FULL_REPO_REGISTRY = buildFullRepoRegistry();

function cloneRepoEntry(entry: ControlPlaneRepoEntry): ControlPlaneRepoEntry {
  return {
    ...entry,
    project_ids: [...entry.project_ids],
  };
}

function cloneSurfaceEntry(entry: ControlPlaneSurfaceEntry): ControlPlaneSurfaceEntry {
  return {
    ...entry,
    configured_scope_keys: [...entry.configured_scope_keys],
    project_ids: [...entry.project_ids],
    notes: [...entry.notes],
  };
}

function cloneProjectEntry(entry: ControlPlaneProjectEntry): ControlPlaneProjectEntry {
  return {
    ...entry,
    repo_full_names: [...entry.repo_full_names],
    surface_keys: [...entry.surface_keys],
    notes: [...entry.notes],
  };
}

function cloneConfiguredScopeEntry(
  entry: ControlPlaneConfiguredScopeEntry,
): ControlPlaneConfiguredScopeEntry {
  return {
    ...entry,
    surface_keys: [...entry.surface_keys],
    notes: [...entry.notes],
  };
}

export function getFullRepoRegistry(): ControlPlaneRepoEntry[] {
  return FULL_REPO_REGISTRY.map(cloneRepoEntry);
}

export function getSurfaceCatalog(): ControlPlaneSurfaceEntry[] {
  return SURFACE_CATALOG.map(cloneSurfaceEntry);
}

export function getProjectCatalog(): ControlPlaneProjectEntry[] {
  return PROJECT_CATALOG.map(cloneProjectEntry);
}

export function getConfiguredAgentScopeSubset(): ControlPlaneConfiguredScopeEntry[] {
  return CONFIGURED_AGENT_SCOPE_SUBSET.map(cloneConfiguredScopeEntry);
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
    .filter((entry): entry is ControlPlaneSurfaceEntry => Boolean(entry))
    .map(cloneSurfaceEntry);
}

export function getSurfaceLabels(surfaceKeys: ControlPlaneSurfaceKey[]): string[] {
  return surfaceKeys
    .map((key) => getSurfaceEntry(key)?.label ?? key)
    .filter((label, index, values) => values.indexOf(label) === index);
}
