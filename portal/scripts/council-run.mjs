#!/usr/bin/env node
/**
 * Minimal Council Runner v0.1 (file-based)
 * Executes a motion with file-based artifacts + validations.
 *
 * - Validates config/agency.yaml via portal/scripts/validate-agency.mjs
 * - Enforces gates listed in motion.yaml (e.g., dct_replay_check)
 * - Writes verify.json safely (handles empty/corrupt files + atomic writes)
 * - Writes trace.json for every run
 *
 * Windows:
 * - Avoid pnpm -C (fragile in PowerShell).
 * - Use cmd.exe with cwd set to portalDir and only relative paths.
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

function die(msg) {
    console.error(`\n[COUNCIL-RUN] ERROR: ${msg}\n`);
    process.exit(1);
}

function exists(p) {
    return fs.existsSync(p);
}

function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}

function readText(p) {
    return fs.readFileSync(p, "utf8");
}

function writeTextIfMissing(p, contents) {
    if (!exists(p)) fs.writeFileSync(p, contents, "utf8");
}

function nowIso() {
    return new Date().toISOString();
}

function getYamlScalar(yamlText, key) {
    const re = new RegExp(`^\\s*${key}:\\s*(.+)\\s*$`, "m");
    const m = yamlText.match(re);
    return m ? m[1].trim().replace(/^"|"$/g, "") : null;
}

function summarizeFile(p, maxChars = 1200) {
    if (!exists(p)) return null;
    const t = readText(p);
    return t.length > maxChars ? t.slice(0, maxChars) + "\n…(truncated)…" : t;
}

function parseRiskScore(challengeText) {
    const m = challengeText.match(/risk_score:\s*([0-9.]+)/i);
    if (!m) return 0.0;
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : 0.0;
}

function parseOutcome(decisionText) {
    const m = decisionText.match(/^\s*outcome:\s*(.+)\s*$/m);
    return (m?.[1] ?? "").trim();
}

function safeReadJsonFile(p, fallback) {
    if (!exists(p)) return fallback;
    try {
        const txt = readText(p).trim();
        if (!txt) return fallback;
        return JSON.parse(txt);
    } catch {
        try {
            fs.renameSync(p, `${p}.bad.${Date.now()}`);
        } catch { }
        return fallback;
    }
}

function atomicWriteJson(p, obj) {
    const tmp = `${p}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), "utf8");
    fs.renameSync(tmp, p);
}

function run(cmd, args, { cwd, label, required, prettyCommand } = {}) {
    const started = nowIso();
    const res = spawnSync(cmd, args, { stdio: "inherit", shell: false, cwd });

    const spawnError = res.error ? String(res.error.message || res.error) : null;
    if (spawnError) console.error(`[COUNCIL-RUN] Spawn error for ${cmd}: ${spawnError}`);

    const status = typeof res.status === "number" ? res.status : 1;
    const ok = status === 0;

    const meta = {
        gate: label ?? `${cmd} ${args.join(" ")}`,
        started,
        finished: nowIso(),
        ok,
        status,
        command: prettyCommand ?? `${cmd} ${args.join(" ")}`,
        cwd: cwd ? path.relative(process.cwd(), cwd) || "." : ".",
        required: !!required,
        error: spawnError || undefined,
    };

    return { ok, status, meta };
}

// -----------------------------
// Main
// -----------------------------
const motionId = process.argv[2];
if (!motionId) die("Missing motion id. Example: pnpm council:run motion-0001");

const repoRoot = process.cwd();
const portalDir = path.join(repoRoot, "portal");

const nexusDir = path.join(repoRoot, ".nexus");
const motionsDir = path.join(nexusDir, "motions");
const motionDir = path.join(motionsDir, motionId);
const motionSpecPath = path.join(motionDir, "motion.yaml");

const agentManifestPath = path.join(nexusDir, "agent-manifest.yaml");
const depsPath = path.join(nexusDir, "council.deps.yaml");

if (!exists(nexusDir)) die("Missing .nexus directory at repo root.");
if (!exists(agentManifestPath)) die("Missing .nexus/agent-manifest.yaml");
if (!exists(depsPath)) die("Missing .nexus/council.deps.yaml");

ensureDir(motionDir);
if (!exists(motionSpecPath)) {
    die(`Missing motion spec: ${path.relative(repoRoot, motionSpecPath)}\nCreate it first.`);
}

const motionYaml = readText(motionSpecPath);
const title = getYamlScalar(motionYaml, "title") ?? motionId;

const proposalPath = path.join(motionDir, "proposal.md");
const challengePath = path.join(motionDir, "challenge.md");
const executionPath = path.join(motionDir, "execution.md");
const decisionPath = path.join(motionDir, "decision.yaml");
const tracePath = path.join(motionDir, "trace.json");
const verifyPath = path.join(motionDir, "verify.json");

// Seed empty artifacts if missing
writeTextIfMissing(
    proposalPath,
    `# Proposal (${motionId})\n\n## 0.0 Problem\n- \n\n## 1.0 Implications\n- \n\n## 2.0 Solutions\n- \n\n## 3.0 Decision Proposal\n- \n\n## 4.0 Evidence / Links\n- \n\n## 5.0 Next Actions\n- \n`
);
writeTextIfMissing(
    challengePath,
    `# Challenge (${motionId})\n\n## Risks\n- \n\n## Objections\n- \n\n## Required gates\n- \n\n## Risk score\nrisk_score: 0.00\n`
);
writeTextIfMissing(
    executionPath,
    `# Execution Plan (${motionId})\n\n## Intended changes\n- \n\n## Files touched\n- \n\n## Rollback plan\n- \n`
);

console.log(`\n[COUNCIL-RUN] Motion: ${motionId}`);
console.log(`[COUNCIL-RUN] Title: ${title}`);
console.log(`[COUNCIL-RUN] Motion spec: ${path.relative(repoRoot, motionSpecPath)}\n`);

// Verify writer (safe) + latest scoreboard
function writeVerify(update) {
    const base = safeReadJsonFile(verifyPath, {
        version: "0.2",
        motion_id: motionId,
        gates: [],
        latest: {},
    });

    if (!Array.isArray(base.gates)) base.gates = [];
    if (!base.latest || typeof base.latest !== "object") base.latest = {};

    base.gates.push(update);
    base.latest[update.gate] = update;

    const requiredFailed = Object.values(base.latest).some((g) => g.required && g.ok === false);
    base.summary = {
        required_ok: !requiredFailed,
        last_updated: nowIso(),
    };

    atomicWriteJson(verifyPath, base);
}

// -----------------------------
// Gate 1: validate_agency
// -----------------------------
const validateAgency = path.join(portalDir, "scripts", "validate-agency.mjs");
if (exists(validateAgency)) {
    console.log("[COUNCIL-RUN] Running validate-agency.mjs …");
    const r = run("node", [validateAgency], {
        label: "validate_agency",
        required: true,
        prettyCommand: `node ${path.relative(repoRoot, validateAgency)}`,
    });
    writeVerify(r.meta);
    if (!r.ok) die("validate_agency failed.");
} else {
    console.warn("[COUNCIL-RUN] WARN: portal/scripts/validate-agency.mjs not found — skipping.");
}

// -----------------------------
// Gate 2: dct_replay_check
// -----------------------------
const dctReplay = path.join(portalDir, "scripts", "dct-replay-check.ts");
const requiresReplay =
    /checks_required:\s*[\s\S]*\bdct_replay_check\b/i.test(motionYaml) ||
    /-\s*dct_replay_check\b/i.test(motionYaml);

if (exists(dctReplay)) {
    console.log("[COUNCIL-RUN] Running dct-replay-check.ts (via portal tsx) …");

    let r;
    if (process.platform === "win32") {
        // cmd.exe is the most reliable way to invoke pnpm on Windows from Node,
        // while still using cwd=portalDir and relative paths only.
        const cmdLine = `pnpm tsx scripts\\dct-replay-check.ts --file scripts\\fixtures\\dct-test-fixture.json`;
        r = run("cmd.exe", ["/d", "/s", "/c", cmdLine], {
            cwd: portalDir,
            label: "dct_replay_check",
            required: requiresReplay,
            prettyCommand: `cmd.exe /c pnpm tsx scripts/dct-replay-check.ts --file scripts/fixtures/dct-test-fixture.json`,
        });
    } else {
        r = run("pnpm", ["tsx", "scripts/dct-replay-check.ts", "--file", "scripts/fixtures/dct-test-fixture.json"], {
            cwd: portalDir,
            label: "dct_replay_check",
            required: requiresReplay,
            prettyCommand: `pnpm tsx scripts/dct-replay-check.ts --file scripts/fixtures/dct-test-fixture.json`,
        });
    }

    writeVerify(r.meta);

    if (!r.ok && requiresReplay) {
        die("dct_replay_check failed and is required by this motion.");
    } else if (!r.ok) {
        console.warn("[COUNCIL-RUN] NOTE: dct_replay_check failed but is not required by this motion.");
    }
} else {
    const gateResult = {
        gate: "dct_replay_check",
        started: nowIso(),
        finished: nowIso(),
        ok: false,
        skipped: true,
        reason: "script_missing",
        required: requiresReplay,
    };
    writeVerify(gateResult);
    if (requiresReplay) die("dct_replay_check is required but script is missing.");
    console.warn("[COUNCIL-RUN] WARN: portal/scripts/dct-replay-check.ts not found — skipping.");
}

// -----------------------------
// Risk + Decision
// -----------------------------
const challengeText = readText(challengePath);
const riskScore = parseRiskScore(challengeText);

const autoRatifyEnabled = /auto_ratify:\s*\n\s*enabled:\s*true/i.test(motionYaml);
const maxRiskMatch = motionYaml.match(/max_risk_score:\s*([0-9.]+)/i);
const maxRiskScore = maxRiskMatch ? Number(maxRiskMatch[1]) : 0.2;

const decisionTemplate = (outcome) => `version: 0.1
motion_id: ${motionId}
title: "${title}"
ts: "${nowIso()}"
risk_score: ${riskScore.toFixed(2)}
outcome: ${outcome}
notes:
  - "Generated by portal/scripts/council-run.mjs"
`;

if (!exists(decisionPath)) {
    const defaultOutcome = autoRatifyEnabled && riskScore <= maxRiskScore ? "ratified_auto" : "pending_human";
    fs.writeFileSync(decisionPath, decisionTemplate(defaultOutcome), "utf8");
}

let decisionText = readText(decisionPath);
let outcome = parseOutcome(decisionText);

if (!outcome) {
    const defaultOutcome = autoRatifyEnabled && riskScore <= maxRiskScore ? "ratified_auto" : "pending_human";
    fs.writeFileSync(decisionPath, decisionTemplate(defaultOutcome), "utf8");
    decisionText = readText(decisionPath);
    outcome = parseOutcome(decisionText);
}

if (outcome === "pending_human") {
    console.log("\n[COUNCIL-RUN] Decision is PENDING_HUMAN.");
    console.log(`[COUNCIL-RUN] Risk score = ${riskScore.toFixed(2)} (auto threshold = ${maxRiskScore.toFixed(2)})`);
    console.log("[COUNCIL-RUN] Edit decision file and set outcome: ratified_human (or rejected), then rerun.\n");
} else {
    console.log(`\n[COUNCIL-RUN] Decision outcome: ${outcome}\n`);
}

// -----------------------------
// Trace
// -----------------------------
const trace = {
    version: "0.1",
    motion_id: motionId,
    title,
    ts: nowIso(),
    files: {
        motion: path.relative(repoRoot, motionSpecPath),
        proposal: path.relative(repoRoot, proposalPath),
        challenge: path.relative(repoRoot, challengePath),
        execution: path.relative(repoRoot, executionPath),
        decision: path.relative(repoRoot, decisionPath),
        verify: path.relative(repoRoot, verifyPath),
    },
    risk_score: riskScore,
    decision_outcome: outcome,
    excerpts: {
        proposal: summarizeFile(proposalPath),
        challenge: summarizeFile(challengePath),
        execution: summarizeFile(executionPath),
        decision: summarizeFile(decisionPath),
    },
};

fs.writeFileSync(tracePath, JSON.stringify(trace, null, 2), "utf8");

console.log(`[COUNCIL-RUN] Wrote trace: ${path.relative(repoRoot, tracePath)}`);
console.log("[COUNCIL-RUN] Done.\n");
