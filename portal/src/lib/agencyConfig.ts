// portal/src/lib/agencyConfig.ts
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const AGENCY_PATH = path.join(process.cwd(), "config", "agency.yaml");

export interface AgencyOwner {
  name: string;
  handle: string;
  nh_root: string;
}

export interface AgencyAgent {
  nh_id: string;
  id: string;
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

export function getAgencyConfig(): AgencyConfig {
  if (cachedAgency) return cachedAgency;

  const raw = fs.readFileSync(AGENCY_PATH, "utf8");
  const parsed = yaml.load(raw) as AgencyConfig;
  cachedAgency = parsed;
  return parsed;
}
