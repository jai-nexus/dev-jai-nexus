#!/usr/bin/env node
// portal/scripts/generate-bootstrap.mjs
//
// Wave 0 Bootstrap Artifact Generator — WS-D implementation (motion-0089)
// Spec: .nexus/planning/bootstrap-generator.spec.md (motion-0088)
//
// Usage:
//   node portal/scripts/generate-bootstrap.mjs --intake <path> [options]
//
// Required:
//   --intake <path>     Project intake instance YAML (WS-A output)
//
// Optional:
//   --demand <path>     Agent demand matrix instance YAML (WS-B output).
//                       Falls back to intake.derived_agents if present,
//                       then to inline derivation from intake rules.
//   --topology <path>   Topology plan instance YAML (WS-C output).
//                       Falls back to derivation from intake.topology.
//   --output <path>     Output root (governance-resident repo root).
//                       Default: ./bootstrap-output/<project_id>
//   --baseline <path>   Source repo root for copied baseline files.
//                       Default: detected from this script's location.
//   --dry-run           Print what would be emitted; do not write files.
//   --force             Overwrite existing files (prompts unless --yes).
//   --yes               Skip --force confirmation prompt.
//   --verbose           Extra output.
//
// Exit codes: 0 = success, 1 = error

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("yaml");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_BASELINE = path.resolve(__dirname, "../..");

// ── CLI args ──────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    intake: null,
    demand: null,
    topology: null,
    output: null,
    baseline: DEFAULT_BASELINE,
    dryRun: false,
    force: false,
    yes: false,
    verbose: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--intake"   && argv[i + 1]) { args.intake   = argv[++i]; continue; }
    if (a === "--demand"   && argv[i + 1]) { args.demand   = argv[++i]; continue; }
    if (a === "--topology" && argv[i + 1]) { args.topology = argv[++i]; continue; }
    if (a === "--output"   && argv[i + 1]) { args.output   = argv[++i]; continue; }
    if (a === "--baseline" && argv[i + 1]) { args.baseline = argv[++i]; continue; }
    if (a === "--dry-run") { args.dryRun  = true; continue; }
    if (a === "--force")   { args.force   = true; continue; }
    if (a === "--yes")     { args.yes     = true; continue; }
    if (a === "--verbose") { args.verbose = true; continue; }
  }
  return args;
}

// ── Logging ───────────────────────────────────────────────────────────────────

function die(msg)    { console.error("❌ " + msg); process.exit(1); }
function log(msg)    { console.log(msg); }
function ok(msg)     { console.log("  ✓ " + msg); }
function skip(msg)   { console.log("  ~ " + msg); }
function drylog(msg) { console.log("  » " + msg); }
function warn(msg)   { console.log("  ⚠ " + msg); }

// ── I/O helpers ───────────────────────────────────────────────────────────────

function readYaml(filePath) {
  const abs = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(abs)) die(`File not found: ${abs}`);
  try {
    return yaml.parse(fs.readFileSync(abs, "utf8"));
  } catch (e) {
    die(`Failed to parse YAML at ${abs}: ${e?.message || e}`);
  }
}

async function confirmForce() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("  --force will overwrite existing files. Continue? [y/N] ", (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

function writeFileIdempotent(absPath, content, { dryRun, force, label }) {
  const exists = fs.existsSync(absPath);
  const rel = path.relative(process.cwd(), absPath);

  if (dryRun) {
    const action = (exists && !force) ? "SKIP (exists)" : "WRITE       ";
    drylog(`${action} [${label.padEnd(11)}] ${rel}`);
    return exists && !force ? "dry-skip" : "dry";
  }

  if (exists && !force) { skip(`SKIP (exists) ${rel}`); return "skipped"; }

  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, content, "utf8");
  ok(`WROTE  [${label.padEnd(11)}] ${rel}`);
  return "wrote";
}

function copyFileIdempotent(srcAbs, destAbs, { dryRun, force, label }) {
  const exists = fs.existsSync(destAbs);
  const rel    = path.relative(process.cwd(), destAbs);
  const srcRel = path.relative(process.cwd(), srcAbs);

  if (dryRun) {
    const action = (exists && !force) ? "SKIP (exists)" : "COPY        ";
    drylog(`${action} [${label.padEnd(11)}] ${srcRel} → ${rel}`);
    return exists && !force ? "dry-skip" : "dry";
  }

  if (exists && !force) { skip(`SKIP (exists) ${rel}`); return "skipped"; }

  if (!fs.existsSync(srcAbs)) {
    warn(`MISSING baseline source: ${srcRel} — skipping`);
    return "missing";
  }

  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  fs.copyFileSync(srcAbs, destAbs);
  ok(`COPIED [${label.padEnd(11)}] ${rel}`);
  return "copied";
}

// ── Topology derivation (WS-C rules) ─────────────────────────────────────────

function deriveTopology(intake) {
  const repos = intake.topology?.repos ?? [];
  const govRepo = repos.find((r) => r.governance_resident === true);
  if (!govRepo) die("intake.topology.repos has no repo with governance_resident: true");

  const shape = intake.topology?.shape ?? "monorepo";
  const execScope = shape === "polyrepo" ? "cross_repo" : "repo_local";

  const repoProfiles = repos.map((r) => {
    const isGov      = r.governance_resident === true;
    const domScope   = r.domain_scope ?? "src";
    const srcPattern = domScope === "infra" ? "paths:infra/**" : "paths:src/**";

    const agentScopePaths = [srcPattern];
    if (isGov) {
      agentScopePaths.push("paths:.nexus/**", "paths:config/**");
    }
    agentScopePaths.push("deny:**/.env*", "deny:**/*.env*", "deny:**/secrets/**");

    const govRoles  = isGov ? ["council", "proposer", "executor", "challenger", "arbiter"] : [];
    const execRoles = ["ARCHITECT", "BUILDER", "VERIFIER"];
    if (isGov) execRoles.push("OPERATOR");

    return {
      name:              r.name,
      tier:              r.tier,
      domain_scope:      r.domain_scope,
      governance_resident: isGov,
      agent_scope_paths: agentScopePaths,
      roles_scoped_here: [...govRoles, ...execRoles],
    };
  });

  return {
    project_id:              intake.project_id,
    shape,
    execution_scope:         execScope,
    governance_resident_repo: govRepo.name,
    repo_profiles:           repoProfiles,
    governance_surface: {
      nexus_root:   ".nexus/",
      motions_dir:  ".nexus/motions/",
      context_dir:  ".nexus/context/",
      agency_config: "config/agency.yaml",
      resident_repo: govRepo.name,
    },
  };
}

// ── Demand derivation (WS-B rules) ────────────────────────────────────────────

const EXEC_OFFSETS  = { ARCHITECT: ".10", BUILDER: ".11", VERIFIER: ".12", LIBRARIAN: ".13", OPERATOR: ".14" };
const EXEC_ACTIONS  = {
  ARCHITECT: ["read", "plan", "design"],
  BUILDER:   ["read", "patch", "build"],
  VERIFIER:  ["read", "verify", "test"],
  OPERATOR:  ["read", "review", "approve"],
  LIBRARIAN: ["read", "document", "index"],
};

function deriveDemand(intake) {
  const nhRoot    = intake.nh_root ?? "7.0";
  const projectId = intake.project_id;

  // Prefer intake.derived_agents if present (WS-B illustration)
  if (intake.derived_agents) {
    const da = intake.derived_agents;
    return {
      project_id:        projectId,
      nh_root:           da.nh_root ?? nhRoot,
      governance_agents: da.governance ?? [],
      execution_agents:  da.execution  ?? [],
    };
  }

  // Fallback: inline derivation from WS-B rules
  const govAgents = [
    { role: "council",    suffix: "",   },
    { role: "proposer",   suffix: ".1", },
    { role: "executor",   suffix: ".2", },
    { role: "challenger", suffix: ".3", },
    { role: "arbiter",    suffix: ".4", },
  ].map(({ role, suffix }) => ({
    role,
    nh_id:      nhRoot + suffix,
    agent_key:  `${projectId}.${role}`,
    governance_only:  true,
    execution_roles:  [],
  }));

  const requiredRoles = intake.required_roles ?? ["ARCHITECT", "BUILDER", "VERIFIER", "OPERATOR"];
  const execAgents = requiredRoles.map((role) => ({
    role,
    nh_id:                 nhRoot + (EXEC_OFFSETS[role] ?? ".99"),
    agent_key:             `${projectId}.${role.toLowerCase()}`,
    governance_only:       false,
    governance_resident_only: role === "OPERATOR" || role === "LIBRARIAN",
    execution_roles:       [role],
    scope_actions:         EXEC_ACTIONS[role] ?? ["read"],
    slots:                 1,
  }));

  return {
    project_id:        projectId,
    nh_root:           nhRoot,
    governance_agents: govAgents,
    execution_agents:  execAgents,
  };
}

// ── Generated artifact builders ───────────────────────────────────────────────

function buildAgencyYaml(intake, demand, topology) {
  const projectId    = intake.project_id;
  const projectName  = intake.project_name ?? projectId;
  const nhRoot       = demand.nh_root;
  const handle       = projectId.split("-")[0];
  const govRepoName  = topology.governance_resident_repo;
  const allRepoNames = topology.repo_profiles.map((r) => r.name);
  const projectUpper = projectId.replace(/-/g, "_").toUpperCase();

  function getRepoPaths(repoName) {
    const profile = topology.repo_profiles.find((r) => r.name === repoName);
    return profile?.agent_scope_paths ?? ["paths:src/**", "deny:**/.env*"];
  }

  function buildScope(repoNames, scopePaths, actions) {
    const parts = [];
    for (const r of repoNames)  parts.push(`repo:${r}`);
    for (const p of scopePaths) parts.push(p);
    for (const a of actions)    parts.push(`actions:${a}`);
    return parts;
  }

  const GOV_ACTIONS = {
    council:    ["govern"],
    proposer:   ["read", "propose"],
    executor:   ["read", "stage_diff"],
    challenger: ["read", "critique", "verify"],
    arbiter:    ["read", "ratify", "escalate", "ledger_write"],
  };

  const agents = [];

  // Governance agents — always scoped to governance-resident repo
  for (const g of demand.governance_agents) {
    const roleTitle  = g.role.charAt(0).toUpperCase() + g.role.slice(1);
    const parentNhId = g.nh_id === nhRoot ? null : nhRoot;
    const actions    = GOV_ACTIONS[g.role] ?? ["read"];
    const paths      = getRepoPaths(govRepoName);

    agents.push({
      agent_key:        g.agent_key,
      id:               `JAI::${projectUpper}::${g.role.toUpperCase()}`,
      nh_id:            g.nh_id,
      parent_nh_id:     parentNhId,
      label:            `${projectName} ${roleTitle}`,
      tier:             2,
      role:             g.role,
      function:         "council",
      scope:            buildScope([govRepoName], paths, actions),
      delegates_to:     [],
      github_labels:    ["council", g.role],
      execution_capable: false,
      execution_roles:  [],
      governance_only:  true,
    });
  }

  // Execution agents
  for (const e of demand.execution_agents) {
    const role      = e.role;
    const roleTitle = role.charAt(0) + role.slice(1).toLowerCase();
    const isGovOnly = e.governance_resident_only === true || role === "OPERATOR" || role === "LIBRARIAN";
    const scopeRepos = isGovOnly ? [govRepoName] : allRepoNames;

    // Deduplicated paths across scoped repos
    const seenPaths = new Set();
    const scopePaths = [];
    for (const rName of scopeRepos) {
      for (const p of getRepoPaths(rName)) {
        if (!seenPaths.has(p)) { seenPaths.add(p); scopePaths.push(p); }
      }
    }

    const actions = e.scope_actions ?? EXEC_ACTIONS[role] ?? ["read"];

    agents.push({
      agent_key:        e.agent_key,
      id:               `JAI::${projectUpper}::${role.toUpperCase()}`,
      nh_id:            e.nh_id,
      parent_nh_id:     nhRoot,
      label:            `${projectName} ${roleTitle}`,
      tier:             2,
      role:             role.toLowerCase(),
      function:         "execution",
      scope:            buildScope(scopeRepos, scopePaths, actions),
      delegates_to:     [],
      github_labels:    ["execution", role.toLowerCase()],
      execution_capable: true,
      execution_roles:  [role],
      governance_only:  false,
    });
  }

  return yaml.stringify({
    schema_version: 0.1,
    owner: { name: projectName, handle, nh_root: nhRoot },
    agency: { council_dir: ".nexus", motion_dir: ".nexus/motions" },
    agents,
  });
}

function buildConstitution(intake, demand, topology) {
  const requiredRoles = intake.required_roles ?? demand.execution_agents.map((e) => e.role);
  const optionalRoles = intake.optional_roles ?? [];

  return yaml.stringify({
    version:    "0.1",
    artifact:   "project-constitution",
    project:    intake.project_name ?? intake.project_id,
    repo_scope: topology.governance_resident_repo,

    identity: {
      summary: `${intake.project_name ?? intake.project_id} is a governed AI collaboration platform for ${intake.domain ?? intake.project_id}.`,
      purpose: [
        "Enable governed multi-AI and human-AI collaboration.",
        "Preserve durable trace for decisions, execution, and review.",
        "Support structured development across domain and repo tiers.",
        "Reduce repeated recontextualization through governed context artifacts.",
      ],
    },

    governance: {
      primary_unit: "motion",
      canonical_sequence: [
        "problem framing", "proposal", "challenge", "execution",
        "policy evaluation", "vote", "decision", "ratification",
      ],
      decision_modes: ["unanimous_consent", "majority"],
      principles: [
        "Governance before convenience.",
        "Durable artifacts over ephemeral explanation.",
        "Explicit role boundaries over hidden behavior.",
        "Traceable decisions over undocumented intuition.",
        "Small proven increments over speculative overbuild.",
      ],
    },

    roles: {
      executor_roles: [...requiredRoles, ...optionalRoles],
      role_intent: {
        ARCHITECT: "Produces planning, design, and structural approach evidence.",
        BUILDER:   "Produces implementation, patch, and change evidence.",
        VERIFIER:  "Produces verification and validation evidence.",
        OPERATOR:  "Applies governed routing and final human decision actions.",
        LIBRARIAN: "Maintains durable structure, packaging, and memory artifacts.",
      },
    },

    agent_tiers: { tier_0: "Global", tier_1: "Domain", tier_2: "Repo" },

    context_model: {
      stable_layers: [
        "project constitution", "repo capsule", "motion packet",
        "slot policy", "scoring rubric",
      ],
      generated_layers: [
        "motion snapshots", "repo capsule instances",
        "active path packs", "context bundle manifests",
      ],
    },

    invariants: [
      "A motion is the canonical governed unit of meaningful change.",
      "Executor roles are distinct even when artifacts are adjacent.",
      "Operator approval is explicit and must not be inferred automatically.",
      "Generated context artifacts must not replace canonical governance artifacts.",
      "Context should be compiled into governed packets rather than repeatedly narrated.",
    ],

    current_scope: {
      focus: `${intake.project_id} local substrate formalization`,
      exclusions: [
        "cross-repo federation",
        "full semantic retrieval",
        "provider-specific slot staffing policy",
      ],
    },
  });
}

function buildAgentManifest(intake) {
  return yaml.stringify({
    version:     "0.1",
    description: `Local manifest for council runner in ${intake.project_id}`,
    notes:       ["Currently used as an existence marker; content will be wired later."],
  });
}

function buildMotionStub(intake, topology) {
  return yaml.stringify({
    motion_id:   "motion-0001",
    title:       `Inaugural Governance Motion \u2014 ${intake.project_name ?? intake.project_id}`,
    status:      "proposed",
    created_at:  new Date().toISOString(),
    owner:       intake.project_id,
    kind:        "governance-inaugural",
    program:     `${intake.project_id}-bootstrap`,
    target: {
      domain: intake.domain ?? intake.project_id,
      repo:   topology.governance_resident_repo,
    },
    summary:          "<!-- TODO: describe the inaugural governance scope and intent -->",
    proposal:         [],
    non_goals:        [],
    success_criteria: [],
    vote: {
      mode:           "unanimous_consent",
      required_roles: ["proposer", "challenger", "arbiter"],
    },
  });
}

// Manual-only: structural headings + HTML comment placeholders ONLY.
// Hard prohibition: no prose, no rationale, no example governance text.
function buildProposalShell() {
  return [
    "# Proposal: Inaugural Governance Motion",
    "",
    "**Motion:** motion-0001",
    "**Date:** <!-- TODO: date -->",
    "",
    "## Context",
    "",
    "<!-- TODO: author this section -->",
    "",
    "## Problem",
    "",
    "<!-- TODO: author this section -->",
    "",
    "## Proposal",
    "",
    "<!-- TODO: author this section -->",
    "",
    "## Non-goals",
    "",
    "<!-- TODO: author this section -->",
    "",
    "## Success criteria",
    "",
    "<!-- TODO: author this section -->",
    "",
  ].join("\n");
}

function buildClaudeMd(intake, topology) {
  const govRepo = topology.governance_resident_repo;
  return [
    "# CLAUDE.md",
    "",
    "## Repo",
    govRepo,
    "",
    "## Purpose",
    "[TODO: describe project purpose and governance responsibilities]",
    "",
    "## Working assumptions",
    "- Meaningful change should be framed through a motion.",
    "- Durable artifacts are preferred over ad hoc explanation.",
    "- Role boundaries matter.",
    "[TODO: add project-specific working assumptions]",
    "",
    "## Canonical governance surfaces",
    "Primary motion location:",
    "- `.nexus/motions/`",
    "",
    "Context substrate:",
    "- `.nexus/context/project-constitution.yaml`",
    "- `.nexus/context/repo-capsule.schema.yaml`",
    "- `.nexus/context/motion-packet.schema.json`",
    "- `.nexus/context/slot-policy.yaml`",
    "- `.nexus/context/scoring-rubric.yaml`",
    "",
    "Claude-facing setup:",
    "- `CLAUDE.md`",
    "",
    "## Core commands",
    "- `pnpm council:run motion-XXXX`",
    "- `pnpm -C portal typecheck`",
    "- `pnpm -C portal build`",
    "- `node portal/scripts/generate-context-bundle.mjs --motion motion-XXXX`",
    "",
    "## Editing rules",
    "- Preserve current terminology unless there is a motion-backed reason to change it.",
    "- Prefer minimal, reviewable edits over broad rewrites.",
    "- Keep role semantics explicit.",
    "[TODO: add project-specific editing rules]",
    "",
    "## High-sensitivity surfaces",
    "[TODO: list paths that require extra care when editing]",
    "",
    "## How to work in this repo",
    "[TODO: describe project-specific workflow]",
    "1. Identify the current motion or create a new motion.",
    "2. Read the relevant motion package and substrate artifacts.",
    "3. Make the smallest coherent change that satisfies the motion.",
    "4. Run local validation.",
    "5. Ratify the motion only after proof exists.",
    "",
    "## Claude-specific guidance",
    "When operating on this repo:",
    "- treat this file as repo-local operating guidance,",
    "- use the substrate artifacts as stable context,",
    "- use motion packages as the canonical unit of meaningful work.",
    "",
  ].join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  if (!args.intake) {
    die(
      "--intake <path> is required.\n\n" +
      "Usage: node portal/scripts/generate-bootstrap.mjs --intake <path> [--dry-run] [--force]"
    );
  }

  const dryTag = args.dryRun ? " [DRY RUN]" : "";
  log(`\n=== Wave 0 Bootstrap Generator${dryTag} ===\n`);

  // ── Read inputs ──
  const intake = readYaml(args.intake);
  if (!intake.project_id) die("intake.project_id is required");

  const demand   = args.demand   ? readYaml(args.demand)   : deriveDemand(intake);
  const topology = args.topology ? readYaml(args.topology) : deriveTopology(intake);

  log(`  Project:  ${intake.project_name ?? intake.project_id} (${intake.project_id})`);
  log(`  Domain:   ${intake.domain ?? "(not set)"}`);
  log(`  Topology: ${intake.topology?.shape ?? "(not set)"}`);
  log(`  NH root:  ${demand.nh_root}`);
  log(`  Gov repo: ${topology.governance_resident_repo}`);
  log(`  Agents:   ${demand.governance_agents.length} governance + ${demand.execution_agents.length} execution`);
  log(``);

  const outputRoot = args.output
    ? path.resolve(process.cwd(), args.output)
    : path.resolve(process.cwd(), "bootstrap-output", intake.project_id);

  const baseline = path.resolve(process.cwd(), args.baseline);

  log(`  Output:   ${outputRoot}`);
  log(`  Baseline: ${baseline}`);
  log(``);

  // ── Force confirmation ──
  if (args.force && !args.dryRun && !args.yes) {
    const confirmed = await confirmForce();
    if (!confirmed) { log("Aborted."); process.exit(0); }
    log(``);
  }

  const opts = { dryRun: args.dryRun, force: args.force };
  const results = [];
  function rec(id, r) { results.push({ id, result: r }); }

  log("── Wave 0 artifacts ─────────────────────────────────────────────────────");

  // 1. config/agency.yaml [generated]
  rec("agency-config", writeFileIdempotent(
    path.join(outputRoot, "config", "agency.yaml"),
    buildAgencyYaml(intake, demand, topology),
    { ...opts, label: "generated" }
  ));

  // 2. .nexus/context/project-constitution.yaml [generated]
  rec("project-constitution", writeFileIdempotent(
    path.join(outputRoot, ".nexus", "context", "project-constitution.yaml"),
    buildConstitution(intake, demand, topology),
    { ...opts, label: "generated" }
  ));

  // 3. .nexus/agent-manifest.yaml [generated]
  rec("agent-manifest", writeFileIdempotent(
    path.join(outputRoot, ".nexus", "agent-manifest.yaml"),
    buildAgentManifest(intake),
    { ...opts, label: "generated" }
  ));

  // 4. .nexus/council.config.yaml [copied]
  rec("council-config", copyFileIdempotent(
    path.join(baseline, ".nexus", "council.config.yaml"),
    path.join(outputRoot, ".nexus", "council.config.yaml"),
    { ...opts, label: "copied" }
  ));

  // 5. .nexus/council.deps.yaml [copied]
  rec("council-deps", copyFileIdempotent(
    path.join(baseline, ".nexus", "council.deps.yaml"),
    path.join(outputRoot, ".nexus", "council.deps.yaml"),
    { ...opts, label: "copied" }
  ));

  // 6. .nexus/context/slot-policy.yaml [copied]
  rec("slot-policy", copyFileIdempotent(
    path.join(baseline, ".nexus", "context", "slot-policy.yaml"),
    path.join(outputRoot, ".nexus", "context", "slot-policy.yaml"),
    { ...opts, label: "copied" }
  ));

  // 7. .nexus/context/scoring-rubric.yaml [copied]
  rec("scoring-rubric", copyFileIdempotent(
    path.join(baseline, ".nexus", "context", "scoring-rubric.yaml"),
    path.join(outputRoot, ".nexus", "context", "scoring-rubric.yaml"),
    { ...opts, label: "copied" }
  ));

  // 8. .nexus/context/motion-packet.schema.json [copied]
  rec("motion-packet-schema", copyFileIdempotent(
    path.join(baseline, ".nexus", "context", "motion-packet.schema.json"),
    path.join(outputRoot, ".nexus", "context", "motion-packet.schema.json"),
    { ...opts, label: "copied" }
  ));

  // 9. .nexus/context/repo-capsule.schema.yaml [copied]
  // Baseline has a typo in filename ("caspsule") — try correct name first.
  const repoCapsuleSrc = fs.existsSync(path.join(baseline, ".nexus", "context", "repo-capsule.schema.yaml"))
    ? path.join(baseline, ".nexus", "context", "repo-capsule.schema.yaml")
    : path.join(baseline, ".nexus", "context", "repo-caspsule.schema.yaml");
  rec("repo-capsule-schema", copyFileIdempotent(
    repoCapsuleSrc,
    path.join(outputRoot, ".nexus", "context", "repo-capsule.schema.yaml"),
    { ...opts, label: "copied" }
  ));

  // 10. .nexus/motions/motion-0001/motion.yaml [stubbed]
  rec("inaugural-motion-yaml", writeFileIdempotent(
    path.join(outputRoot, ".nexus", "motions", "motion-0001", "motion.yaml"),
    buildMotionStub(intake, topology),
    { ...opts, label: "stubbed" }
  ));

  // 11. .nexus/motions/motion-0001/proposal.md [manual-only]
  rec("inaugural-motion-proposal", writeFileIdempotent(
    path.join(outputRoot, ".nexus", "motions", "motion-0001", "proposal.md"),
    buildProposalShell(),
    { ...opts, label: "manual-only" }
  ));

  // 12. CLAUDE.md [stubbed]
  rec("claude-md", writeFileIdempotent(
    path.join(outputRoot, "CLAUDE.md"),
    buildClaudeMd(intake, topology),
    { ...opts, label: "stubbed" }
  ));

  // ── Summary ──
  log(``);
  log("── Summary ──────────────────────────────────────────────────────────────");

  if (args.dryRun) {
    const wouldWrite = results.filter((r) => r.result === "dry").length;
    const wouldSkip  = results.filter((r) => r.result === "dry-skip").length;
    log(`  Would write/copy: ${wouldWrite}   Would skip: ${wouldSkip}`);
    log(`  Re-run without --dry-run to write files.`);
  } else {
    const wrote   = results.filter((r) => r.result === "wrote" || r.result === "copied").length;
    const skipped = results.filter((r) => r.result === "skipped").length;
    const missing = results.filter((r) => r.result === "missing").length;
    log(`  Wrote/copied: ${wrote}   Skipped: ${skipped}${missing ? `   Missing baseline: ${missing}` : ""}`);
    if (skipped > 0) log(`  (Use --force to overwrite existing files.)`);
  }
  log(``);
}

main().catch((err) => {
  console.error("💥 Unexpected error:", err?.stack || err?.message || String(err));
  process.exit(1);
});
