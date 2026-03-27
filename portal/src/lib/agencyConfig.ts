import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export const EXECUTION_ROLES = [
  "ARCHITECT",
  "BUILDER",
  "VERIFIER",
  "LIBRARIAN",
  "OPERATOR",
] as const;

export type ExecutionRole = (typeof EXECUTION_ROLES)[number];

export interface AgencyOwner {
  name: string;
  handle: string;
  nh_root: string;
}

export interface AgencyAgent {
  nh_id: string;
  id: string;
  agent_key: string;
  label: string;
  parent_nh_id: string | null;
  tier: number;
  role: string;
  function: string;
  scope: string[];
  responsibilities: string[];
  delegates_to: string[];
  github_labels: string[];
  execution_capable: boolean;
  execution_roles: ExecutionRole[];
  governance_only: boolean;
}

export interface DelegationRule {
  id: string;
  description: string;
  constraints: string[];
}

export interface AgencyConfig {
  schema_version: number;
  owner: AgencyOwner;
  agents: AgencyAgent[];
  delegation_rules: DelegationRule[];
}

let cachedAgency: AgencyConfig | null = null;
let cachedAgencyPath: string | null = null;

function isFile(p: string): boolean {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function findRepoRoot(startDir: string): string {
  let cur = startDir;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(cur, ".nexus"))) return cur;
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return startDir;
}

function resolveAgencyPath(): string {
  if (cachedAgencyPath) return cachedAgencyPath;

  const tried: string[] = [];

  const envPath = process.env.JAI_AGENCY_PATH?.trim();
  if (envPath) {
    const abs = path.resolve(envPath);
    tried.push(abs);
    if (isFile(abs)) {
      cachedAgencyPath = abs;
      return abs;
    }
  }

  const cwd = process.cwd();

  const p1 = path.join(cwd, "config", "agency.yaml");
  tried.push(p1);
  if (isFile(p1)) {
    cachedAgencyPath = p1;
    return p1;
  }

  const p2 = path.join(cwd, "..", "config", "agency.yaml");
  tried.push(p2);
  if (isFile(p2)) {
    cachedAgencyPath = p2;
    return p2;
  }

  const repoRoot = findRepoRoot(cwd);
  const p3 = path.join(repoRoot, "config", "agency.yaml");
  tried.push(p3);
  if (isFile(p3)) {
    cachedAgencyPath = p3;
    return p3;
  }

  const msg =
    "agency.yaml not found. Tried:\n" +
    tried.map((p) => `- ${path.resolve(p)}`).join("\n") +
    "\n\nFix: ensure repoRoot/config/agency.yaml exists, or set JAI_AGENCY_PATH.";
  throw new Error(msg);
}

function asObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  const s = asString(value, "").trim();
  return s ? s : null;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function normalizeExecutionRoles(value: unknown): ExecutionRole[] {
  return asStringArray(value)
    .map((v) => v.trim().toUpperCase())
    .filter((v): v is ExecutionRole =>
      EXECUTION_ROLES.includes(v as ExecutionRole),
    );
}

function normalizeAgent(value: unknown): AgencyAgent {
  const obj = asObject(value);

  const governanceOnly = asBoolean(obj.governance_only, false);
  const rawExecutionRoles = normalizeExecutionRoles(obj.execution_roles);
  const executionCapableRaw =
    asBoolean(obj.execution_capable, false) || rawExecutionRoles.length > 0;

  const execution_capable = governanceOnly ? false : executionCapableRaw;
  const execution_roles = governanceOnly ? [] : rawExecutionRoles;

  return {
    nh_id: asString(obj.nh_id),
    id: asString(obj.id),
    agent_key: asString(obj.agent_key),
    label: asString(obj.label),
    parent_nh_id: asNullableString(obj.parent_nh_id),
    tier: asNumber(obj.tier, 0),
    role: asString(obj.role),
    function: asString(obj.function),
    scope: asStringArray(obj.scope),
    responsibilities: asStringArray(obj.responsibilities),
    delegates_to: asStringArray(obj.delegates_to),
    github_labels: asStringArray(obj.github_labels),
    execution_capable,
    execution_roles,
    governance_only: governanceOnly,
  };
}

function normalizeDelegationRule(value: unknown): DelegationRule {
  const obj = asObject(value);
  return {
    id: asString(obj.id),
    description: asString(obj.description),
    constraints: asStringArray(obj.constraints),
  };
}

export function getAgencyConfig(): AgencyConfig {
  if (cachedAgency) return cachedAgency;

  const agencyPath = resolveAgencyPath();
  const raw = fs.readFileSync(agencyPath, "utf8");
  const parsedUnknown = yaml.load(raw);

  if (!parsedUnknown || typeof parsedUnknown !== "object" || Array.isArray(parsedUnknown)) {
    throw new Error(`Invalid agency.yaml (expected object): ${agencyPath}`);
  }

  const parsed = parsedUnknown as Record<string, unknown>;
  const owner = asObject(parsed.owner);

  const config: AgencyConfig = {
    schema_version: asNumber(parsed.schema_version, 0.1),
    owner: {
      name: asString(owner.name),
      handle: asString(owner.handle),
      nh_root: asString(owner.nh_root),
    },
    agents: Array.isArray(parsed.agents) ? parsed.agents.map(normalizeAgent) : [],
    delegation_rules: Array.isArray(parsed.delegation_rules)
      ? parsed.delegation_rules.map(normalizeDelegationRule)
      : [],
  };

  cachedAgency = config;
  return config;
}

export function getAgentByNhId(nhId: string): AgencyAgent | null {
  const agency = getAgencyConfig();
  return agency.agents.find((a) => a.nh_id === nhId) ?? null;
}

export function isExecutionCapableAgent(agent: AgencyAgent): boolean {
  return agent.execution_capable && !agent.governance_only;
}

export function isAgentEligibleForExecutionRole(
  agent: AgencyAgent,
  role: ExecutionRole | null | undefined,
): boolean {
  if (!isExecutionCapableAgent(agent)) return false;
  if (!role) return true;
  return agent.execution_roles.includes(role);
}

export function getExecutionAgents(role?: ExecutionRole | null): AgencyAgent[] {
  const agency = getAgencyConfig();
  return agency.agents.filter((agent) =>
    isAgentEligibleForExecutionRole(agent, role ?? null),
  );
}

export function getGovernanceAgents(): AgencyAgent[] {
  const agency = getAgencyConfig();
  return agency.agents.filter((agent) => agent.governance_only);
}

export function getAgencyPathForDebug(): string {
  return resolveAgencyPath();
}

export function clearAgencyConfigCache() {
  cachedAgency = null;
  cachedAgencyPath = null;
}
