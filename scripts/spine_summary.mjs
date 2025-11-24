#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = process.cwd();
const CONFIG_DIR = path.join(ROOT, "config");

async function loadYaml(filename) {
  const fullPath = path.join(CONFIG_DIR, filename);
  const raw = await fs.readFile(fullPath, "utf8");
  const data = yaml.load(raw);
  if (!data) {
    throw new Error(`YAML file ${filename} is empty or invalid`);
  }
  return data;
}

function groupReposByTier(repos) {
  const byTier = new Map();
  for (const repo of repos) {
    const tier = repo.tier ?? 99;
    if (!byTier.has(tier)) byTier.set(tier, []);
    byTier.get(tier).push(repo);
  }
  return byTier;
}

function projectRepoMap(projects) {
  const map = new Map();
  for (const p of projects) {
    map.set(p.project_id, p.repos || []);
  }
  return map;
}

function indexRepos(repos) {
  const byOrgRepo = new Map();
  const byRepoId = new Map();

  for (const repo of repos) {
    if (repo.org_repo) {
      if (byOrgRepo.has(repo.org_repo)) {
        // Not fatal, but worth flagging.
        console.warn(
          `WARN: duplicate org_repo detected in repos.yaml: ${repo.org_repo}`
        );
      }
      byOrgRepo.set(repo.org_repo, repo);
    }
    if (repo.repo_id) {
      if (byRepoId.has(repo.repo_id)) {
        console.warn(
          `WARN: duplicate repo_id detected in repos.yaml: ${repo.repo_id}`
        );
      }
      byRepoId.set(repo.repo_id, repo);
    }
  }

  return { byOrgRepo, byRepoId };
}

function validateProjectRepos(projects, reposByOrgRepo) {
  const errors = [];
  const usedOrgRepos = new Set();

  for (const p of projects) {
    const repoList = p.repos || [];
    for (const r of repoList) {
      usedOrgRepos.add(r);
      if (!reposByOrgRepo.has(r)) {
        errors.push(
          `Project '${p.project_id}' references unknown org_repo '${r}'`
        );
      }
    }
  }

  return { errors, usedOrgRepos };
}

function validateRepoProjectIds(repos, projectIdSet) {
  const errors = [];

  for (const repo of repos) {
    const ids = repo.project_ids || [];
    for (const pid of ids) {
      if (!projectIdSet.has(pid)) {
        errors.push(
          `Repo '${repo.repo_id ?? repo.org_repo}' has unknown project_id '${pid}' in project_ids`
        );
      }
    }
  }

  return errors;
}

function findUnusedRepos(reposByOrgRepo, usedOrgRepos) {
  const unused = [];
  for (const [orgRepo, repo] of reposByOrgRepo.entries()) {
    if (!usedOrgRepos.has(orgRepo)) {
      unused.push(repo);
    }
  }
  return unused;
}

function fmtRepo(repo) {
  const color = repo.triage_color || "unknown";
  const wave = repo.wave ?? "?";
  const nhRoot = repo.nh_root ?? "?";
  const repoId = repo.repo_id || "(no repo_id)";
  const orgRepo = repo.org_repo || "(no org_repo)";
  return `- ${orgRepo} [${repoId}]  (tier=${repo.tier}, wave=${wave}, color=${color}, nh_root=${nhRoot})`;
}

async function main() {
  const { repos } = await loadYaml("repos.yaml");
  const { projects } = await loadYaml("projects.yaml");

  if (!Array.isArray(repos)) {
    throw new Error("repos.yaml: expected 'repos' to be an array");
  }
  if (!Array.isArray(projects)) {
    throw new Error("projects.yaml: expected 'projects' to be an array");
  }

  const byTier = groupReposByTier(repos);
  const projMap = projectRepoMap(projects);
  const { byOrgRepo, byRepoId } = indexRepos(repos);

  // ---------- Validation ----------
  const projectIdSet = new Set(projects.map((p) => p.project_id));
  const { errors: projRepoErrors, usedOrgRepos } = validateProjectRepos(
    projects,
    byOrgRepo
  );
  const repoProjectErrors = validateRepoProjectIds(repos, projectIdSet);
  const unusedRepos = findUnusedRepos(byOrgRepo, usedOrgRepos);

  const allErrors = [...projRepoErrors, ...repoProjectErrors];

  // ---------- Output ----------
  console.log("=== JAI Spine Summary (from config/) ===\n");

  console.log("Projects:");
  // stable-ish ordering: tier asc, then priority, then project_id
  const sortedProjects = [...projects].sort((a, b) => {
    const ta = a.tier ?? 99;
    const tb = b.tier ?? 99;
    if (ta !== tb) return ta - tb;
    const pa = (a.priority_level || "P9").replace("P", "");
    const pb = (b.priority_level || "P9").replace("P", "");
    const pnA = Number.isNaN(+pa) ? 9 : +pa;
    const pnB = Number.isNaN(+pb) ? 9 : +pb;
    if (pnA !== pnB) return pnA - pnB;
    return String(a.project_id).localeCompare(String(b.project_id));
  });

  for (const p of sortedProjects) {
    const priority = p.priority_level || "P?";
    const tier = p.tier ?? "?";
    console.log(
      `• ${p.project_id} — ${p.name}  (tier=${tier}, priority=${priority}, root_nh_id=${p.root_nh_id}, status=${p.status})`
    );
    const repoList = projMap.get(p.project_id) || [];
    if (repoList.length === 0) {
      console.log("    repos: [none]");
    } else {
      console.log("    repos:");
      for (const r of repoList) {
        console.log(`      - ${r}`);
      }
    }
    console.log("");
  }

  console.log("\nRepos by tier:\n");
  const sortedTiers = Array.from(byTier.keys()).sort((a, b) => a - b);
  for (const tier of sortedTiers) {
    const tierRepos = byTier.get(tier);
    console.log(`Tier ${tier}:`);
    for (const repo of tierRepos) {
      console.log(`  ${fmtRepo(repo)}`);
    }
    console.log("");
  }

  const spineRepos = byTier.get(0) || [];
  console.log("Spine check (Tier-0 repos):");
  if (spineRepos.length === 0) {
    console.log("  !! No Tier-0 repos configured.");
  } else {
    for (const repo of spineRepos) {
      console.log(`  ✓ ${repo.org_repo || repo.repo_id}`);
    }
  }

  // ---------- Validation report ----------
  console.log("\nValidation:");

  if (allErrors.length === 0 && unusedRepos.length === 0) {
    console.log("  OK — projects.yaml and repos.yaml are consistent.\n");
  } else {
    if (allErrors.length > 0) {
      console.log("  Errors:");
      for (const e of allErrors) {
        console.log(`    - ${e}`);
      }
    }

    if (unusedRepos.length > 0) {
      console.log("\n  Warnings (repos defined but not referenced by any project.repos):");
      for (const repo of unusedRepos) {
        const id = repo.repo_id || "(no repo_id)";
        const orgRepo = repo.org_repo || "(no org_repo)";
        console.log(`    - ${orgRepo} [${id}]`);
      }
    }
    console.log("");
  }

  if (allErrors.length > 0) {
    // Non-zero exit so CI can fail if things drift.
    process.exitCode = 1;
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
