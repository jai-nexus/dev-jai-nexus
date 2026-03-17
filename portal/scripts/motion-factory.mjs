#!/usr/bin/env node
/**
 * Motion Factory v0 — context gathering scaffold
 *
 * Commands:
 *   node portal/scripts/motion-factory.mjs context --intent "..." [--json]
 *
 * Gathers bounded repo-native context from .nexus/ surfaces and prints a
 * structured summary to stdout. No files are written. No API calls are made.
 * No motion packages are generated.
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

// ─── Helpers ──────────────────────────────────────────────────────────────

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

// ─── Motion enumeration ──────────────────────────────────────────────────

async function enumerateMotions(repoRoot) {
    const motionsDir = path.join(repoRoot, ".nexus", "motions");
    if (!(await exists(motionsDir))) return [];

    const entries = await fs.readdir(motionsDir, { withFileTypes: true });
    const motionDirs = entries
        .filter((e) => e.isDirectory() && /^motion-\d+$/.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => {
            const na = parseInt(a.replace("motion-", ""), 10);
            const nb = parseInt(b.replace("motion-", ""), 10);
            return na - nb;
        });

    return motionDirs;
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

// ─── Config summaries ────────────────────────────────────────────────────

async function readStaffingSummary(repoRoot) {
    const p = path.join(repoRoot, ".nexus", "model-slots-phase1.yaml");
    if (!(await exists(p))) return { available: false };

    const obj = safeYamlLoad(await readText(p), "model-slots-phase1.yaml");
    if (!obj) return { available: false };

    const slots = obj.slots || {};
    const deferred = obj.deferred_slots || {};
    const voting = obj.voting || {};
    const providers = obj.providers?.allowlist || Object.keys(obj.providers?.catalog || obj.providers || {});

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
        return { panel_id: id, candidates, selector_status: selectorStatus };
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

// ─── Context command ─────────────────────────────────────────────────────

async function contextCommand({ repoRoot, intent, jsonOutput }) {
    const branch = git(repoRoot, ["rev-parse", "--abbrev-ref", "HEAD"]);
    const headCommit = git(repoRoot, ["rev-parse", "--short", "HEAD"]);

    const motionDirs = await enumerateMotions(repoRoot);
    const nextId = nextMotionId(motionDirs);
    const recentMotions = await readRecentMotions(repoRoot, motionDirs, RECENT_MOTION_WINDOW);

    const staffingSummary = await readStaffingSummary(repoRoot);
    const panelSummary = await readPanelSummary(repoRoot);
    const governanceSummary = await readGovernanceSummary(repoRoot);

    const context = {
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

    if (jsonOutput) {
        console.log(JSON.stringify(context, null, 2));
        return;
    }

    // Human-readable output
    log(`Context for Motion Factory v0`);
    log(`─────────────────────────────────────────`);
    log(`Intent:          ${intent}`);
    log(`Next motion ID:  ${nextId}`);
    log(`Branch:          ${branch}`);
    log(`Head commit:     ${headCommit}`);
    log(`Total motions:   ${motionDirs.length}`);
    log(``);
    log(`Recent motions:`);
    for (const m of recentMotions) {
        log(`  ${m.motion_id}: ${m.title} [${m.status}]`);
    }
    log(``);
    log(`Governance:`);
    if (governanceSummary.available) {
        log(`  Config version:  ${governanceSummary.version}`);
        log(`  Vote mode:       ${governanceSummary.vote_mode}`);
        log(`  Required roles:  ${governanceSummary.required_roles.join(", ")}`);
        log(`  Any NO blocks:   ${governanceSummary.any_no_blocks}`);
    } else {
        log(`  (council.config.yaml not found)`);
    }
    log(``);
    log(`Staffing:`);
    if (staffingSummary.available) {
        log(`  Providers:          ${staffingSummary.providers.join(", ")}`);
        log(`  Live slots:         ${staffingSummary.live_slots}`);
        log(`  Deferred selectors: ${staffingSummary.deferred_selectors}`);
        log(`  Voting roles:       ${staffingSummary.voting_roles.join(", ")}`);
    } else {
        log(`  (model-slots-phase1.yaml not found)`);
    }
    log(``);
    log(`Panels:`);
    if (panelSummary.available) {
        log(`  Panel count: ${panelSummary.panel_count}`);
        for (const p of panelSummary.panels) {
            log(`  ${p.panel_id}: ${p.candidates} candidates, selector ${p.selector_status}`);
        }
    } else {
        log(`  (agent-panels.yaml not found)`);
    }
    log(`─────────────────────────────────────────`);
}

// ─── Main ────────────────────────────────────────────────────────────────

function usage() {
    console.log(`
MOTION-FACTORY ${SCRIPT_VERSION}

Usage:
  node portal/scripts/motion-factory.mjs context --intent "..." [--json]

Commands:
  context    Gather and display repo-native motion context for inspection.
             Writes no files. Calls no API. Generates no motion packages.

Flags:
  --intent   (required) Human intent prompt describing the next motion.
  --json     Output context as a stable JSON object instead of human-readable text.

Future commands (not yet implemented):
  draft      Generate a 9-file motion package from context + intent.
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
    if (!repoRoot) die(`Could not locate repo root (missing .nexus) from cwd: ${process.cwd()}`);

    if (cmd === "context") {
        const intent = args.intent ? String(args.intent) : null;
        if (!intent) die(`Missing --intent. Motion Factory requires human intent to operate.\n  Usage: node portal/scripts/motion-factory.mjs context --intent "..."`);

        const jsonOutput = args.json === true;
        await contextCommand({ repoRoot, intent, jsonOutput });
        return;
    }

    if (cmd === "draft" || cmd === "revise") {
        die(`"${cmd}" is not yet implemented. See motion-0053+ for planned factory stages.`);
    }

    usage();
    die(`Unknown command: ${cmd}`);
}

main().catch((err) => die(err?.message || String(err)));
