import fs from "fs";
import path from "path";
import YAML from "yaml";

export type RepoConfig = {
  nh_id?: string;
  repo: string;

  description?: string;
  tier?: number;
  role?: string;
  status?: string;
  owner_agent_nh_id?: string;
  notes?: string;

  // optional future extensions
  domain_pod?: string;
  engine_group?: string;
  language?: string;
  owner?: string;
};

type RepoConfigFile =
  | RepoConfig[]
  | {
      schema_version?: string;
      repos?: RepoConfig[];
    };

export function loadRepoConfigs(): RepoConfig[] {
  const configPath = path.join(process.cwd(), "config", "repos.yaml");
  const file = fs.readFileSync(configPath, "utf8");
  const parsed = YAML.parse(file) as RepoConfigFile;

  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.repos)) return parsed.repos;
  return [];
}
