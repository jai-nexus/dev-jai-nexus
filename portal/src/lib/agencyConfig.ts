// portal/src/lib/agencyConfig.ts
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

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
  scope: string[];
  responsibilities: string[];
  delegates_to: string[];
  github_labels: string[];
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
  // Walk upward until we find ".nexus" (repo root marker in this project).
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

  // Optional override (useful in CI or one-off debugging)
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

  // 1) If running from repo root
  const p1 = path.join(cwd, "config", "agency.yaml");
  tried.push(p1);
  if (isFile(p1)) {
    cachedAgencyPath = p1;
    return p1;
  }

  // 2) If running from portal/ (common with `pnpm -C portal dev`)
  const p2 = path.join(cwd, "..", "config", "agency.yaml");
  tried.push(p2);
  if (isFile(p2)) {
    cachedAgencyPath = p2;
    return p2;
  }

  // 3) Robust: find repo root via ".nexus"
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

export function getAgencyConfig(): AgencyConfig {
  if (cachedAgency) return cachedAgency;

  const agencyPath = resolveAgencyPath();
  const raw = fs.readFileSync(agencyPath, "utf8");
  const parsed = yaml.load(raw) as AgencyConfig;

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Invalid agency.yaml (expected object): ${agencyPath}`);
  }

  // Defensive normalization (prevents random runtime crashes on partial configs)
  if (!Array.isArray((parsed as any).agents)) (parsed as any).agents = [];
  if (!Array.isArray((parsed as any).delegation_rules)) (parsed as any).delegation_rules = [];

  cachedAgency = parsed;
  return parsed;
}

export function getAgentByNhId(nhId: string): AgencyAgent | null {
  const agency = getAgencyConfig();
  return agency.agents.find((a) => a.nh_id === nhId) ?? null;
}

// Optional: useful for debugging in UI routes (don’t use in client components)
export function getAgencyPathForDebug(): string {
  return resolveAgencyPath();
}

// Optional: allows hot reload / tests to refresh
export function clearAgencyConfigCache() {
  cachedAgency = null;
  cachedAgencyPath = null;
}
