// portal/src/lib/projectsConfig.ts
import fs from "node:fs"
import path from "node:path"
import yaml from "js-yaml"

const PROJECTS_PATH = path.join(process.cwd(), "config", "projects.yaml")

export type ProjectStatus = "active" | "planned" | "frozen" | "deprecated"

export interface ProjectConfigEntry {
  project_id: string
  name: string
  root_nh_id: string
  tier: number
  status: ProjectStatus
  repo: string
  owner_agent_nh_id: string
  description: string
}

export interface ProjectsConfig {
  schema_version: number
  projects: ProjectConfigEntry[]
}

let cachedProjects: ProjectsConfig | null = null

export function getProjectsConfig(): ProjectsConfig {
  if (cachedProjects) return cachedProjects

  const raw = fs.readFileSync(PROJECTS_PATH, "utf8")
  const parsed = yaml.load(raw) as ProjectsConfig
  cachedProjects = parsed
  return parsed
}
