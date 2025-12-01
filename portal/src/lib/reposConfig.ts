// portal/src/lib/reposConfig.ts
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

export type RepoConfig = {
  nh_id?: string;
  repo: string;
  description?: string;
  domain_pod?: string;
  engine_group?: string;
  language?: string;
  status?: string;
  owner?: string;
  notes?: string;
};

// Load dev-jai-nexus/config/repos.yaml from the portal app
export function loadRepoConfigs(): RepoConfig[] {
  const configPath = path.join(process.cwd(), '..', 'config', 'repos.yaml');

  const file = fs.readFileSync(configPath, 'utf8');
  const parsed = YAML.parse(file);

  // Support either:
  // - an array of repos
  // - or { repos: [...] }
  if (Array.isArray(parsed)) {
    return parsed as RepoConfig[];
  }

  if (parsed && Array.isArray(parsed.repos)) {
    return parsed.repos as RepoConfig[];
  }

  return [];
}
