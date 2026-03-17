#!/usr/bin/env node
/**
 * Motion Factory v0
 *
 * Commands:
 *   node portal/scripts/motion-factory.mjs context --intent "..." [--json]
 *   node portal/scripts/motion-factory.mjs draft   --intent "..." [--no-api]
 *
 * context:
 *   Gathers bounded repo-native context from .nexus/ surfaces and prints
 *   a structured summary to stdout. No files written. No API calls.
 *
 * draft:
 *   Creates a 9-file motion package in DRAFT state.
 *   - Structural files remain deterministic.
 *   - Narrative files are either:
 *       a) placeholder scaffolds (--no-api), or
 *       b) model-generated draft content via OpenAI.
 *
 * Output contract (stable for future draft/revise consumers):
 *   intent, next_motion_id, branch, head_commit, recent_motions,
 *   staffing_summary, panel_summary, governance_summary
 */

import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import yaml from "js-yaml";

const SCRIPT_VERSION = "motion-factory.v0";
const RECENT_MOTION_WINDOW = 5;
const OPENAI_MODEL = "gpt-5-mini";

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function die(msg) {
    console.error(`\n[MOTION-FACTORY] ERROR: ${msg}\n`);
    process.exit(1);
}

function log(msg) {
    console.log(`[MOTION-FACTORY] ${msg}`);
}

function findRepoRoot(startDir) {
    let cur = startDir;
    for (let i = 0; i < 8; i++) {
        const nexusDir = path.join(cur, ".nexus");
        if (fssync.existsSync(nexusDir)) return cur;
        const parent = path.dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return null;
}

function git(repoRoot, args) {
    try {
        return execFileSync("git", args, {
            cwd: repoRoot,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        }).trim();
    } catch {
        return "(unknown)";
    }
}

function safeYamlLoad(text, label) {
    try {
        const obj = yaml.load(text);
        if (!obj || typeof obj !== "object") return null;
        return obj;
    } catch (err) {
        die(`Failed to parse YAML for ${label}: ${err?.message || String(err)}`);
    }
}

async function exists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function readText(p) {
    return await fs.readFile(p, "utf8");
}

function parseArgs(argv) {
    const args = { _: [] };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith("--")) {
            const key = a.slice(2);
            const next = argv[i + 1];
            if (!next || next.startsWith("--")) {
                args[key] = true;
            } else {
                args[key] = next;
                i++;
            }
        } else {
            args._.push(a);
        }
    }
    return args;
}

function utcNow() {
    return new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z");
}

function stableJson(obj) {
    return JSON.stringify(obj, null, 2) + "\n";
}

function yamlEscape(value) {
    return String(value ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function blockText(text, indent = 2) {
    const normalized = String(text ?? "").trim() || "Draft scaffold — content pending.";
    const pad = " ".repeat(indent);
    return normalized
        .split("\n")
        .map((line) => `${pad}${line}`)
        .join("\n");
}

function yamlList(items, indent = 0) {
    const values = Array.isArray(items) && items.length > 0
        ? items
        : ["Draft scaffold — content pending."];
    const pad = " ".repeat(indent);
    return values.map((item) => `${pad}- "${yamlEscape(item)}"`).join("\n");
}

function stripMarkdownFences(text) {
    const raw = String(text ?? "").trim();
    if (!raw.startsWith("```")) return raw;
    return raw
        .replace(/^```[a-zA-Z0-9_-]*\s*/, "")
        .replace(/\s*```$/, "")
        .trim();
}

function extractOutputText(payload) {
    const output = Array.isArray(payload?.output) ? payload.output : [];
    for (const item of output) {
        if (item?.type === "message" && Array.isArray(item?.content)) {
            for (const c of item.content) {
                if (c?.type === "output_text" && typeof c?.text === "string") {
                    return c.text;
                }
            }
        }
    }
    throw new Error("OpenAI response did not contain output_text.");
}

// ──────────────────────────────────────────────────────────────────────────────
// Motion enumeration
// ──────────────────────────────────────────────────────────────────────────────

async function enumerateMotions(repoRoot) {
    const motionsDir = path.join(repoRoot, ".nexus", "motions");
    if (!(await exists(motionsDir))) return [];

    const entries = await fs.readdir(motionsDir, { withFileTypes: true });
    return entries
        .filter((e) => e.isDirectory() && /^motion-\d+$/.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => {
            const na = parseInt(a.replace("motion-", ""), 10);
            const nb = parseInt(b.replace("motion-", ""), 10);
            return na - nb;
        });
}

function motionIdToNumber(id) {
    return parseInt(id.replace("motion-", ""), 10);
}

function nextMotionId(motionDirs) {
    if (motionDirs.length === 0) return "motion-0001";
    const last = motionDirs[motionDirs.length - 1];
    const num = motionIdToNumber(last) + 1;
    return `motion-${String(num).padStart(4, "0")}`;
}

async function readRecentMotions(repoRoot, motionDirs, window) {
    const recent = motionDirs.slice(-window);
    const results = [];

    for (const dir of recent) {
        const motionYamlPath = path.join(repoRoot, ".nexus", "motions", dir, "motion.yaml");
        const decisionYamlPath = path.join(repoRoot, ".nexus", "motions", dir, "decision.yaml");

        let title = "(unknown)";
        let status = "(unknown)";

        if (await exists(motionYamlPath)) {
            const obj = safeYamlLoad(await readText(motionYamlPath), `${dir}/motion.yaml`);
            if (obj?.title) title = String(obj.title).trim();
            if (obj?.status) status = String(obj.status).trim();
        }

        if (await exists(decisionYamlPath)) {
            const dec = safeYamlLoad(await readText(decisionYamlPath), `${dir}/decision.yaml`);
            if (dec?.status) status = String(dec.status).trim();
        }

        results.push({ motion_id: dir, title, status });
    }

    return results;
}

// ──────────────────────────────────────────────────────────────────────────────
// Config summaries
// ──────────────────────────────────────────────────────────────────────────────

async function readStaffingSummary(repoRoot) {
    const p = path.join(repoRoot, ".nexus", "model-slots-phase1.yaml");
    if (!(await exists(p))) return { available: false };

    const obj = safeYamlLoad(await readText(p), "model-slots-phase1.yaml");
    if (!obj) return { available: false };

    const slots = obj.slots || {};
    const deferred = obj.deferred_slots || {};
    const voting = obj.voting || {};
    const providers =
        obj.providers?.allowlist ||
        Object.keys(obj.providers?.catalog || obj.providers || {});

    const liveSlots = Object.values(slots).filter((s) => s?.live === true).length;
    const deferredCount = Object.keys(deferred).length;
    const votingRoles = Object.keys(voting);

    return {
        available: true,
        providers: Array.isArray(providers) ? providers : [],
        live_slots: liveSlots,
        deferred_selectors: deferredCount,
        voting_roles: votingRoles,
    };
}

async function readPanelSummary(repoRoot) {
    const p = path.join(repoRoot, ".nexus", "agent-panels.yaml");
    if (!(await exists(p))) return { available: false };

    const obj = safeYamlLoad(await readText(p), "agent-panels.yaml");
    if (!obj?.panels) return { available: false };

    const panels = obj.panels;
    const panelIds = Object.keys(panels);
    const panelDetails = panelIds.map((id) => {
        const spec = panels[id];
        const candidates = Array.isArray(spec?.candidates) ? spec.candidates.length : 0;
        const selectorStatus = spec?.selector?.status || "unknown";
        return {
            panel_id: id,
            candidates,
            selector_status: selectorStatus,
        };
    });

    return {
        available: true,
        panel_count: panelIds.length,
        panels: panelDetails,
    };
}

async function readGovernanceSummary(repoRoot) {
    const p = path.join(repoRoot, ".nexus", "council.config.yaml");
    if (!(await exists(p))) return { available: false };

    const obj = safeYamlLoad(await readText(p), "council.config.yaml");
    if (!obj) return { available: false };

    const voting = obj.voting || {};

    return {
        available: true,
        version: obj.version || "(unknown)",
        vote_mode: voting.default_mode || "(unknown)",
        required_roles: voting.required_roles || [],
        allow_yes_with_reservations: voting.allow_yes_with_reservations ?? false,
        max_amendment_rounds: voting.max_amendment_rounds ?? 0,
        any_no_blocks: voting.any_no_blocks ?? true,
    };
}

// ──────────────────────────────────────────────────────────────────────────────
// Context builder / command
// ──────────────────────────────────────────────────────────────────────────────

async function buildContext(repoRoot, intent) {
    const branch = git(repoRoot, ["rev-parse", "--abbrev-ref", "HEAD"]);
    const headCommit = git(repoRoot, ["rev-parse", "--short", "HEAD"]);

    const motionDirs = await enumerateMotions(repoRoot);
    const nextId = nextMotionId(motionDirs);
    const recentMotions = await readRecentMotions(repoRoot, motionDirs, RECENT_MOTION_WINDOW);

    const staffingSummary = await readStaffingSummary(repoRoot);
    const panelSummary = await readPanelSummary(repoRoot);
    const governanceSummary = await readGovernanceSummary(repoRoot);

    return {
        version: SCRIPT_VERSION,
        intent,
        next_motion_id: nextId,
        branch,
        head_commit: headCommit,
        total_motions: motionDirs.length,
        recent_motions: recentMotions,
        staffing_summary: staffingSummary,
        panel_summary: panelSummary,
        governance_summary: governanceSummary,
    };
}

async function contextCommand({ repoRoot, intent, jsonOutput }) {
    const context = await buildContext(repoRoot, intent);

    if (jsonOutput) {
        console.log(JSON.stringify(context, null, 2));
        return;
    }

    log(`Context for Motion Factory v0`);
    log(`─────────────────────────────────────────`);
    log(`Intent:          ${context.intent}`);
    log(`Next motion ID:  ${context.next_motion_id}`);
    log(`Branch:          ${context.branch}`);
    log(`Head commit:     ${context.head_commit}`);
    log(`Total motions:   ${context.total_motions}`);
    log(``);
    log(`Recent motions:`);
    for (const m of context.recent_motions) {
        log(`  ${m.motion_id}: ${m.title} [${m.status}]`);
    }
    log(``);
    log(`Governance:`);
    if (context.governance_summary.available) {
        log(`  Config version:  ${context.governance_summary.version}`);
        log(`  Vote mode:       ${context.governance_summary.vote_mode}`);
        log(`  Required roles:  ${context.governance_summary.required_roles.join(", ")}`);
        log(`  Any NO blocks:   ${context.governance_summary.any_no_blocks}`);
    } else {
        log(`  (council.config.yaml not found)`);
    }
    log(``);
    log(`Staffing:`);
    if (context.staffing_summary.available) {
        log(`  Providers:          ${context.staffing_summary.providers.join(", ")}`);
        log(`  Live slots:         ${context.staffing_summary.live_slots}`);
        log(`  Deferred selectors: ${context.staffing_summary.deferred_selectors}`);
        log(`  Voting roles:       ${context.staffing_summary.voting_roles.join(", ")}`);
    } else {
        log(`  (model-slots-phase1.yaml not found)`);
    }
    log(``);
    log(`Panels:`);
    if (context.panel_summary.available) {
        log(`  Panel count: ${context.panel_summary.panel_count}`);
        for (const p of context.panel_summary.panels) {
            log(`  ${p.panel_id}: ${p.candidates} candidates, selector ${p.selector_status}`);
        }
    } else {
        log(`  (agent-panels.yaml not found)`);
    }
    log(`─────────────────────────────────────────`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Deterministic scaffold generators
// ──────────────────────────────────────────────────────────────────────────────

function generateMotionYaml({ motionId, intent, owner, domain, repo }) {
    return `motion_id: "${yamlEscape(motionId)}"
title: "${yamlEscape(intent)}"

status: "proposed"
created_at: "${utcNow()}"
owner: "${yamlEscape(owner)}"

target:
  domain: "${yamlEscape(domain)}"
  repo: "${yamlEscape(repo)}"

summary: >
${blockText("Draft scaffold — summary pending.", 2)}

problem: >
${blockText("Draft scaffold — problem statement pending.", 2)}

proposal:
${yamlList(["Draft scaffold — proposal pending."], 2)}

non_goals:
${yamlList(["Draft scaffold — non-goals pending."], 2)}

success_criteria:
${yamlList(["Draft scaffold — success criteria pending."], 2)}

vote:
  mode: "unanimous_consent"
  required_roles:
    - "proposer"
    - "challenger"
    - "arbiter"
`;
}

function generateMotionYamlFromNarrative({ motionId, intent, owner, domain, repo, narrative }) {
    const summary = narrative?.summary || "Draft scaffold — summary pending.";
    const problem = narrative?.problem || "Draft scaffold — problem statement pending.";
    const proposal =
        Array.isArray(narrative?.proposal) && narrative.proposal.length > 0
            ? narrative.proposal
            : ["Draft scaffold — proposal pending."];
    const nonGoals =
        Array.isArray(narrative?.non_goals) && narrative.non_goals.length > 0
            ? narrative.non_goals
            : ["Draft scaffold — non-goals pending."];
    const successCriteria =
        Array.isArray(narrative?.success_criteria) && narrative.success_criteria.length > 0
            ? narrative.success_criteria
            : ["Draft scaffold — success criteria pending."];

    return `motion_id: "${yamlEscape(motionId)}"
title: "${yamlEscape(intent)}"

status: "proposed"
created_at: "${utcNow()}"
owner: "${yamlEscape(owner)}"

target:
  domain: "${yamlEscape(domain)}"
  repo: "${yamlEscape(repo)}"

summary: >
${blockText(summary, 2)}

problem: >
${blockText(problem, 2)}

proposal:
${yamlList(proposal, 2)}

non_goals:
${yamlList(nonGoals, 2)}

success_criteria:
${yamlList(successCriteria, 2)}

vote:
  mode: "unanimous_consent"
  required_roles:
    - "proposer"
    - "challenger"
    - "arbiter"
`;
}

function generatePolicyYaml({ motionId, governance }) {
    const version = governance.available ? governance.version : "0.3.8";
    const voteMode = governance.available ? governance.vote_mode : "unanimous_consent";
    const roles = governance.available
        ? governance.required_roles
        : ["proposer", "challenger", "arbiter"];

    return `protocol_version: "${yamlEscape(version)}"
motion_id: ${motionId}
evaluated_at: "${utcNow()}"
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "${yamlEscape(voteMode)}"
required_voters: [${roles.join(", ")}]
risk_score: 0.00
max_risk_score: 0.20
required_gates: [validate_motion, validate_agency]
optional_gates: []
failed_required_gates: []
failed_optional_gates: []
required_ok: true
eligible_to_vote: true
recommended_vote: "yes"
blocking_reasons: []
warnings: []
`;
}

function generateDecisionYaml({ motionId, governance }) {
    const version = governance.available ? governance.version : "0.3.8";
    const voteMode = governance.available ? governance.vote_mode : "unanimous_consent";

    return `protocol_version: "${yamlEscape(version)}"
motion_id: ${motionId}
status: DRAFT
ratified_by: null
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "${yamlEscape(voteMode)}"
required_gates: [validate_motion, validate_agency]
last_updated: "${utcNow()}"
notes: "PENDING: awaiting vote"
`;
}

function generateDecisionMd({ motionId }) {
    return `# Decision - ${motionId}

## Status
DRAFT — awaiting vote.

## Summary
Pending ratification. This package is a draft artifact and requires human
review before ratification.

## Outcome
Not yet determined.
`;
}

function generateVoteJson({ motionId, governance }) {
    const version = governance.available ? governance.version : "0.3.8";
    const voteMode = governance.available ? governance.vote_mode : "unanimous_consent";
    const roles = governance.available
        ? governance.required_roles
        : ["proposer", "challenger", "arbiter"];

    return stableJson({
        version: "0.2",
        motion_id: motionId,
        votes: [],
        protocol_version: version,
        vote_mode: voteMode,
        required_roles: roles,
        outcome: {
            yes: 0,
            no: 0,
            abstain: 0,
            yes_with_reservations: 0,
            result: "PENDING",
            reasons: [],
            missing_required_roles: [...roles],
        },
        last_updated: utcNow(),
    });
}

function generateVerifyJson({ motionId }) {
    return stableJson({
        version: "0.2",
        motion_id: motionId,
        latest: {},
        summary: {
            required_ok: false,
            last_updated: utcNow(),
            notes: "Gates not yet executed. Run council-run.mjs to populate.",
        },
    });
}

function generateProposalMd({ motionId, intent }) {
    return `# Proposal - ${motionId}

## Title
${intent}

## Intent
${intent}

## Why this motion exists
Draft scaffold — narrative content pending.

## What this motion changes
Draft scaffold — narrative content pending.

## What this motion does not change
Draft scaffold — narrative content pending.

## Design stance
Draft scaffold — narrative content pending.

## Why now
Draft scaffold — narrative content pending.
`;
}

function generateChallengeMd({ motionId }) {
    return `# Challenge (${motionId})

## Risks
Draft scaffold — risks pending.

## Objections
Draft scaffold — objections pending.

## Mitigations
Draft scaffold — mitigations pending.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
`;
}

function generateExecutionMd({ motionId }) {
    return `# Execution Plan - ${motionId}

## Goal
Draft scaffold — execution plan pending.

## Plan
Draft scaffold — execution plan pending.

## Files touched
Draft scaffold — execution plan pending.

## Files explicitly not touched
Draft scaffold — execution plan pending.

## Rollback plan
Draft scaffold — execution plan pending.

## Acceptance criteria
Draft scaffold — execution plan pending.

## Done means
Draft scaffold — execution plan pending.
`;
}

// ──────────────────────────────────────────────────────────────────────────────
// OpenAI narrative generation
// ──────────────────────────────────────────────────────────────────────────────

async function generateNarrativeWithOpenAI({ context, motionId, intent }) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        die(`Missing OPENAI_API_KEY. Set it in the environment or use --no-api.`);
    }

    const instructions = [
        "You are generating draft-only JAI NEXUS motion artifacts.",
        "Return JSON only. Do not use markdown fences.",
        "Use repo-native motion conventions.",
        "Do not generate evidence tables.",
        "Do not generate PASS/FAIL claims.",
        "Do not generate proof-result claims.",
        "Do not generate executed test results.",
        "Do not generate vote entries or vote rationales.",
        "Do not generate ratification claims.",
        "Do not claim that any motion has passed validation.",
        "Keep content reviewable and clearly draft-quality.",
        "Generate only the requested narrative fields."
    ].join(" ");

    const task = {
        task: "Generate draft-only motion narrative content",
        motion_id: motionId,
        intent,
        context,
        requested_fields: {
            motion_yaml: ["summary", "problem", "proposal", "non_goals", "success_criteria"],
            markdown_files: ["proposal_md", "challenge_md", "execution_md"]
        },
        output_schema: {
            motion_yaml: {
                summary: "string",
                problem: "string",
                proposal: ["string"],
                non_goals: ["string"],
                success_criteria: ["string"]
            },
            proposal_md: "string",
            challenge_md: "string",
            execution_md: "string"
        }
    };

    const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            instructions,
            input: JSON.stringify(task),
            text: {
                format: { type: "text" },
                verbosity: "medium",
            },
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`OpenAI API request failed (${res.status}): ${body}`);
    }

    const payload = await res.json();
    const text = stripMarkdownFences(extractOutputText(payload));

    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (err) {
        throw new Error(`Failed to parse model JSON output: ${err.message}`);
    }

    return normalizeNarrativePayload(parsed);
}

function normalizeNarrativePayload(parsed) {
    const motionYaml = parsed?.motion_yaml ?? {};

    return {
        motion_yaml: {
            summary: typeof motionYaml.summary === "string" ? motionYaml.summary.trim() : "",
            problem: typeof motionYaml.problem === "string" ? motionYaml.problem.trim() : "",
            proposal: Array.isArray(motionYaml.proposal)
                ? motionYaml.proposal.map((x) => String(x).trim()).filter(Boolean)
                : [],
            non_goals: Array.isArray(motionYaml.non_goals)
                ? motionYaml.non_goals.map((x) => String(x).trim()).filter(Boolean)
                : [],
            success_criteria: Array.isArray(motionYaml.success_criteria)
                ? motionYaml.success_criteria.map((x) => String(x).trim()).filter(Boolean)
                : [],
        },
        proposal_md: typeof parsed?.proposal_md === "string" ? parsed.proposal_md.trim() : "",
        challenge_md: typeof parsed?.challenge_md === "string" ? parsed.challenge_md.trim() : "",
        execution_md: typeof parsed?.execution_md === "string" ? parsed.execution_md.trim() : "",
    };
}

// ──────────────────────────────────────────────────────────────────────────────
// Draft command
// ──────────────────────────────────────────────────────────────────────────────

async function draftCommand({ repoRoot, intent, noApi }) {
    const context = await buildContext(repoRoot, intent);
    const motionId = context.next_motion_id;
    const governanceSummary = context.governance_summary;

    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
    if (await exists(motionDir)) {
        die(
            `Motion directory already exists: .nexus/motions/${motionId}\nDelete it manually before running draft again.`
        );
    }

    // If API mode is requested, require the key before writing anything.
    if (!noApi && !process.env.OPENAI_API_KEY) {
        die(`Missing OPENAI_API_KEY. Set it in the environment or use --no-api.`);
    }

    const owner = "Jerry Ingram";
    const domain = "dev.jai.nexus";
    const repo = "dev-jai-nexus";

    let narrativeMode = "placeholder";
    let warning = null;
    let narrative = null;

    // Create directory after preflight checks.
    await fs.mkdir(motionDir, { recursive: true });

    if (!noApi) {
        try {
            narrative = await generateNarrativeWithOpenAI({ context, motionId, intent });
            narrativeMode = "model-generated";
        } catch (err) {
            narrativeMode = "placeholder";
            warning = err?.message || String(err);
        }
    }

    const files = [
        {
            name: "motion.yaml",
            content: narrative
                ? generateMotionYamlFromNarrative({
                    motionId,
                    intent,
                    owner,
                    domain,
                    repo,
                    narrative: narrative.motion_yaml,
                })
                : generateMotionYaml({ motionId, intent, owner, domain, repo }),
        },
        {
            name: "proposal.md",
            content: narrative?.proposal_md || generateProposalMd({ motionId, intent }),
        },
        {
            name: "challenge.md",
            content: narrative?.challenge_md || generateChallengeMd({ motionId }),
        },
        {
            name: "execution.md",
            content: narrative?.execution_md || generateExecutionMd({ motionId }),
        },
        {
            name: "policy.yaml",
            content: generatePolicyYaml({ motionId, governance: governanceSummary }),
        },
        {
            name: "decision.yaml",
            content: generateDecisionYaml({ motionId, governance: governanceSummary }),
        },
        {
            name: "decision.md",
            content: generateDecisionMd({ motionId }),
        },
        {
            name: "vote.json",
            content: generateVoteJson({ motionId, governance: governanceSummary }),
        },
        {
            name: "verify.json",
            content: generateVerifyJson({ motionId }),
        },
    ];

    for (const f of files) {
        await fs.writeFile(path.join(motionDir, f.name), f.content, "utf8");
    }

    log(`Draft scaffold created for ${motionId}`);
    log(`─────────────────────────────────────────`);
    log(`Motion ID:  ${motionId}`);
    log(`Path:       .nexus/motions/${motionId}/`);
    log(`Intent:     ${intent}`);
    log(`Narrative:  ${narrativeMode}`);
    if (warning) {
        log(`Warning:    ${warning}`);
    }
    log(`Files created:`);
    for (const f of files) {
        log(`  - ${f.name}`);
    }
    log(``);
    log(`⚠  This package is DRAFT-only and requires human review before ratification.`);
    if (narrativeMode === "placeholder") {
        log(`⚠  Narrative content is placeholder scaffold content.`);
    } else {
        log(`⚠  Narrative content is model-generated draft content, not evidence-backed content.`);
    }
    log(`─────────────────────────────────────────`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────

function usage() {
    console.log(`
MOTION-FACTORY ${SCRIPT_VERSION}

Usage:
  node portal/scripts/motion-factory.mjs context --intent "..." [--json]
  node portal/scripts/motion-factory.mjs draft   --intent "..." [--no-api]

Commands:
  context    Gather and display repo-native motion context for inspection.
             Writes no files. Calls no API. Generates no motion packages.

  draft      Create a 9-file motion package in DRAFT state.
             Structural files remain deterministic.
             Narrative files are placeholders (--no-api) or OpenAI-generated.

Flags:
  --intent   (required) Human intent prompt describing the next motion.
  --json     (context only) Output as a stable JSON object.
  --no-api   (draft only) Skip OpenAI generation and use placeholder narrative scaffolds.

Future commands (not yet implemented):
  revise     Revise narrative files in an existing draft from human notes.
`);
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const cmd = args._[0];

    if (!cmd) {
        usage();
        process.exit(1);
    }

    const repoRoot = findRepoRoot(process.cwd());
    if (!repoRoot) {
        die(`Could not locate repo root (missing .nexus) from cwd: ${process.cwd()}`);
    }

    if (cmd === "context") {
        const intent = args.intent ? String(args.intent) : null;
        if (!intent) {
            die(
                `Missing --intent. Motion Factory requires human intent to operate.\n  Usage: node portal/scripts/motion-factory.mjs context --intent "..."`
            );
        }

        const jsonOutput = args.json === true;
        await contextCommand({ repoRoot, intent, jsonOutput });
        return;
    }

    if (cmd === "draft") {
        const intent = args.intent ? String(args.intent) : null;
        if (!intent) {
            die(
                `Missing --intent. Motion Factory requires human intent to operate.\n  Usage: node portal/scripts/motion-factory.mjs draft --intent "..." [--no-api]`
            );
        }

        const noApi = args["no-api"] === true;
        await draftCommand({ repoRoot, intent, noApi });
        return;
    }

    if (cmd === "revise") {
        die(`"revise" is not yet implemented. See motion-0055 for planned factory stages.`);
    }

    usage();
    die(`Unknown command: ${cmd}`);
}

main().catch((err) => die(err?.message || String(err)));
