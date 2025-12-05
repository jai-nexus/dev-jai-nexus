#!/usr/bin/env tsx

import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

type RepoConfig = {
  nh_id: string;
  repo: string;
  tier: number;
  role: string;
  status: "active" | "frozen" | "parked";
  owner_agent_nh_id: string;
};

type ProjectConfig = {
  project_id: string;
  root_nh_id: string;
  tier: number;
  status: string;
  repo: string;
  owner_agent_nh_id: string;
};

type SotEventPayload = {
  tier0Repos: string[];
  tier1Repos: string[];
  frozenRepos: string[];
  anchoredProjectId: string | null;
  issues: string[];
};

function configDir() {
  return path.join(process.cwd(), "config");
}

async function loadYaml<T>(fileName: string): Promise<T> {
  const full = path.join(configDir(), fileName);
  const raw = await fs.readFile(full, "utf8");
  return yaml.load(raw) as T;
}

async function main() {
  console.log("Running Q4-2025 audit...");

  const { repos } = await loadYaml<{ repos: RepoConfig[] }>(
    "repos.yaml",
  );
  const { projects } = await loadYaml<{ projects: ProjectConfig[] }>(
    "projects.yaml",
  );

  const tier0 = repos.filter((r) => r.tier === 0);
  const tier1 = repos.filter((r) => r.tier === 1);
  const frozen = repos.filter((r) => r.status === "frozen");
  const anchored = projects.find(
    (p) => p.tier === 1 && p.status === "active",
  );

  const issues: string[] = [];
  if (!tier0.length) issues.push("No Tier-0 repos defined.");
  if (!tier1.length) issues.push("No Tier-1 repos defined.");
  if (!anchored)
    issues.push("No active Tier-1 external project anchored.");

  console.log("Tier-0 repos:", tier0.map((r) => r.repo));
  console.log("Tier-1 repos:", tier1.map((r) => r.repo));
  console.log("Frozen repos:", frozen.map((r) => r.repo));
  console.log(
    "Anchored project:",
    anchored?.project_id ?? "NONE",
  );

  const summary =
    issues.length === 0
      ? "Q4-2025 audit passed: agency + registry + external project anchored."
      : `Q4-2025 audit completed with issues: ${issues.join(" | ")}`;

  const payload: SotEventPayload = {
    tier0Repos: tier0.map((r) => r.repo),
    tier1Repos: tier1.map((r) => r.repo),
    frozenRepos: frozen.map((r) => r.repo),
    anchoredProjectId: anchored?.project_id ?? null,
    issues,
  };

// Write directly into SotEvent table
await prisma.sotEvent.create({
  data: {
    ts: new Date(),
    source: "q4-audit-script",
    kind: "AUDIT_Q4_2025_COMPLETED",
    summary,
    nhId: "1.0",
    // If your model does NOT have nhId, you can also drop this line.
    payload, // JSON column
    // We intentionally do NOT send version, repoName, or domainName here.
  },
});

  console.log("SoT event written to DB.");

  if (issues.length > 0) {
    console.log("Audit issues:");
    for (const issue of issues) console.log(" - " + issue);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
