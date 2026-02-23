#!/usr/bin/env node
/**
 * Council Runner v0.2 (file-based)
 * Executes a motion using file-based artifacts plus a tiered governance loop.
 *
 * Responsibilities:
 * - Validates config/agency.yaml via portal/scripts/validate-agency.mjs
 * - Executes gates declared in .nexus/motions/<motionId>/motion.yaml
 * - Writes .nexus/motions/<motionId>/verify.json as a scoreboard (latest per gate + summary)
 *   - resilient to empty/corrupt JSON (quarantines bad files)
 *   - uses atomic writes
 *   - SHOULD NOT churn on identical reruns (avoid updating timestamps unless results change)
 * - Writes append-only audit traces (gitignored):
 *   - trace/chat.jsonl (tiered “group chat” events)
 *   - trace/verify.history.jsonl (full gate execution history w/ stdout/stderr tails)
 *
 * Artifacts (per motion):
 * - motion.yaml      : gate requirements + policy (auto-ratify, max_risk_score, checks_required)
 * - proposal.md      : proposal thread
 * - challenge.md     : objections + risk_score
 * - execution.md     : execution plan (human-readable)
 * - execution.patch  : optional patch payload (used by execution_patch_exists / patch_apply_check gates)
 * - decision.yaml    : current status (DRAFT/PROPOSED/RATIFIED...) and ratification metadata
 * - verify.json      : scoreboard-only (committed)
 *
 * Windows notes:
 * - Prefer cmd.exe with an explicit cwd (e.g., portal/) for pnpm/tsx invocations.
 * - Use relative paths and avoid assumptions about PowerShell quoting/escaping.
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

/**
 * Run a command and return { ok, status, meta }.
 * - Captures stdout/stderr for trace and echoes to console.
 */
function run(cmd, args, { cwd, label, required, prettyCommand } = {}) {
    const started = nowIso();
    const res = spawnSync(cmd, args, { stdio: "pipe", shell: false, cwd });

    const stdout = res.stdout?.toString("utf8") || "";
    const stderr = res.stderr?.toString("utf8") || "";

    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);

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
        stdout_tail: stdout.length > 2000 ? stdout.slice(-2000) : stdout,
        stderr_tail: stderr.length > 2000 ? stderr.slice(-2000) : stderr,
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

// v0.2 traces live at repo-root trace/ (gitignored)
const traceDir = path.join(repoRoot, "trace");
ensureDir(traceDir);

const runId = Date.now().toString(36);

function appendJsonl(p, obj) {
    fs.appendFileSync(p, JSON.stringify(obj) + "\n", "utf8");
}

function appendChat(kind, body, tier = 2, agentId = "council-runner") {
    const event = {
        ts: nowIso(),
        motion_id: motionId,
        agent_id: agentId,
        tier,
        kind,
        body,
        run_id: runId,
    };
    appendJsonl(path.join(traceDir, "chat.jsonl"), event);
}

function appendVerifyHistory(gateMeta) {
    const duration_ms =
        gateMeta.finished && gateMeta.started
            ? new Date(gateMeta.finished).getTime() - new Date(gateMeta.started).getTime()
            : 0;

    const entry = {
        ts: nowIso(),
        motion_id: motionId,
        gate_id: gateMeta.gate,
        ok: gateMeta.ok,
        duration_ms,
        cmd: gateMeta.command,
        cwd: gateMeta.cwd,
        required: !!gateMeta.required,
        stdout_tail: gateMeta.stdout_tail,
        stderr_tail: gateMeta.stderr_tail,
        run_id: runId,
    };
    appendJsonl(path.join(traceDir, "verify.history.jsonl"), entry);
}

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
const verifyPath = path.join(motionDir, "verify.json");

// NOTE: legacy trace.json is no longer written into the motion folder (causes churn).
// We instead write a run-scoped trace bundle under repo-root trace/ (gitignored).
const runTracePath = path.join(traceDir, `motion.${motionId}.run.${runId}.json`);

appendChat("RUNNER_START", `Council runner v0.2 started for motion ${motionId}`, 0);

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

function motionRequires(gateId) {
    // simple regex scan for now (swap for YAML parser later)
    return (
        new RegExp(`checks_required:\\s*[\\s\\S]*\\b${gateId}\\b`, "i").test(motionYaml) ||
        new RegExp(`-\\s*${gateId}\\b`, "i").test(motionYaml)
    );
}

const requiresReplay = motionRequires("dct_replay_check");
const requiresPatch = motionRequires("execution_patch_exists");
const requiresApply = motionRequires("patch_apply_check");
const requiresTypecheck = motionRequires("typecheck");

// -----------------------------
// verify.json writer (scoreboard-only, no-churn)
// -----------------------------
function writeVerify(update) {
    const base = safeReadJsonFile(verifyPath, {
        version: "0.2",
        motion_id: motionId,
        latest: {},
        summary: { required_ok: true, last_updated: nowIso() },
    });

    if (!base.latest || typeof base.latest !== "object") base.latest = {};
    if (!base.summary || typeof base.summary !== "object") base.summary = { required_ok: true, last_updated: nowIso() };

    const nextEntry = {
        gate: update.gate,
        ok: update.ok,
        status: update.status,
        // ts only updates when entry changes
        ts: update.finished,
        command: update.command,
        cwd: update.cwd,
        required: !!update.required,
    };

    const prev = base.latest[update.gate];

    const same =
        prev &&
        prev.ok === nextEntry.ok &&
        prev.status === nextEntry.status &&
        prev.command === nextEntry.command &&
        prev.cwd === nextEntry.cwd &&
        !!prev.required === !!nextEntry.required;

    let changed = false;

    if (!same) {
        base.latest[update.gate] = nextEntry;
        changed = true;
    }

    const requiredFailed = Object.values(base.latest).some((g) => g.required && g.ok === false);
    const required_ok = !requiredFailed;

    if (base.summary.required_ok !== required_ok) {
        base.summary.required_ok = required_ok;
        changed = true;
    }

    if (changed) {
        base.summary.last_updated = nowIso();
        atomicWriteJson(verifyPath, base);
    }

    // Always record history to gitignored trace
    appendVerifyHistory(update);
    appendChat("GATE_RESULT", `Gate ${update.gate} finished: ${update.ok ? "PASS" : "FAIL"}`, 2);
}

// -----------------------------
// Gate 1: validate_agency
// -----------------------------
const validateAgency = path.join(portalDir, "scripts", "validate-agency.mjs");
if (exists(validateAgency)) {
    console.log("[COUNCIL-RUN] Running validate-agency.mjs …");
    appendChat("GATE_START", "Starting validate_agency gate", 2);
    const r = run("node", [validateAgency], {
        label: "validate_agency",
        required: true,
        prettyCommand: `node ${path.relative(repoRoot, validateAgency)}`,
    });
    writeVerify(r.meta);
    if (!r.ok) console.error("[COUNCIL-RUN] validate_agency FAILED.");
} else {
    console.warn("[COUNCIL-RUN] WARN: portal/scripts/validate-agency.mjs not found — skipping.");
    appendChat("GATE_SKIP", "validate_agency script missing", 2);
}

// -----------------------------
// Gate 2: dct_replay_check
// -----------------------------
const dctReplay = path.join(portalDir, "scripts", "dct-replay-check.ts");

if (exists(dctReplay)) {
    console.log("[COUNCIL-RUN] Running dct-replay-check.ts (via portal tsx) …");
    appendChat("GATE_START", "Starting dct_replay_check gate", 2);

    let r;
    if (process.platform === "win32") {
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

    if (!r.ok && requiresReplay) console.error("[COUNCIL-RUN] dct_replay_check FAILED and is required.");
    else if (!r.ok) console.warn("[COUNCIL-RUN] NOTE: dct_replay_check failed but is not required by this motion.");
} else {
    appendChat("GATE_SKIP", "dct_replay_check script missing", 2);
    const gateResult = {
        gate: "dct_replay_check",
        started: nowIso(),
        finished: nowIso(),
        ok: false,
        status: 1,
        command: "missing: portal/scripts/dct-replay-check.ts",
        cwd: "portal",
        required: requiresReplay,
        stdout_tail: "",
        stderr_tail: "script_missing",
    };
    writeVerify(gateResult);
    if (requiresReplay) console.error("[COUNCIL-RUN] dct_replay_check is required but script is missing.");
    console.warn("[COUNCIL-RUN] WARN: portal/scripts/dct-replay-check.ts not found — skipping.");
}

// -----------------------------
// Gate 3: execution_patch_exists
// -----------------------------
const executionPatchPath = path.join(motionDir, "execution.patch");
const hasPatch = exists(executionPatchPath) && readText(executionPatchPath).trim().length > 0;

if (requiresPatch) {
    console.log("[COUNCIL-RUN] Running execution_patch_exists …");
    appendChat("GATE_START", "Checking if execution.patch exists and is non-empty", 2);

    const gateResult = {
        gate: "execution_patch_exists",
        started: nowIso(),
        finished: nowIso(),
        ok: hasPatch,
        status: hasPatch ? 0 : 1,
        command: `check-file ${path.relative(repoRoot, executionPatchPath)}`,
        cwd: ".",
        required: true,
        stdout_tail: "",
        stderr_tail: hasPatch ? "" : "missing_or_empty_execution.patch",
    };
    writeVerify(gateResult);

    if (!hasPatch) console.error("[COUNCIL-RUN] execution.patch is missing or empty.");
}

// -----------------------------
// Gate 4: patch_apply_check
// -----------------------------
if (requiresApply) {
    console.log("[COUNCIL-RUN] Running patch_apply_check (git apply --check) …");
    appendChat("GATE_START", "Running git apply --check execution.patch", 2);

    if (!hasPatch) {
        const gateResult = {
            gate: "patch_apply_check",
            started: nowIso(),
            finished: nowIso(),
            ok: false,
            status: 1,
            command: `git apply --check ${path.relative(repoRoot, executionPatchPath)}`,
            cwd: ".",
            required: true,
            stdout_tail: "",
            stderr_tail: "no_execution.patch_present",
        };
        writeVerify(gateResult);
        console.error("[COUNCIL-RUN] patch_apply_check required but execution.patch missing/empty.");
    } else {
        const r = run("git", ["apply", "--check", path.relative(repoRoot, executionPatchPath)], {
            label: "patch_apply_check",
            required: true,
            prettyCommand: `git apply --check ${path.relative(repoRoot, executionPatchPath)}`,
        });
        writeVerify(r.meta);
        if (!r.ok) console.error("[COUNCIL-RUN] patch_apply_check failed (patch does not apply cleanly).");
    }
}

// -----------------------------
// Gate 5: typecheck
// -----------------------------
if (requiresTypecheck) {
    console.log("[COUNCIL-RUN] Running typecheck (pnpm -C portal typecheck) …");
    appendChat("GATE_START", "Running pnpm typecheck", 2);

    let r;
    if (process.platform === "win32") {
        r = run("cmd.exe", ["/d", "/s", "/c", "pnpm -C portal typecheck"], {
            label: "typecheck",
            required: true,
            prettyCommand: "pnpm -C portal typecheck",
        });
    } else {
        r = run("pnpm", ["-C", "portal", "typecheck"], {
            label: "typecheck",
            required: true,
            prettyCommand: "pnpm -C portal typecheck",
        });
    }

    writeVerify(r.meta);
    if (!r.ok) console.error("[COUNCIL-RUN] typecheck FAILED.");
}

// -----------------------------
// Risk + Decision
// -----------------------------
const challengeText = readText(challengePath);
const riskScore = parseRiskScore(challengeText);

const autoRatifyEnabled = /auto_ratify:\s*\n\s*enabled:\s*true/i.test(motionYaml);
const maxRiskMatch = motionYaml.match(/max_risk_score:\s*([0-9.]+)/i);
const maxRiskScore = maxRiskMatch ? Number(maxRiskMatch[1]) : 0.2;

function requiredGateList() {
    const gates = ["validate_agency"];
    if (requiresReplay) gates.push("dct_replay_check");
    if (requiresPatch) gates.push("execution_patch_exists");
    if (requiresApply) gates.push("patch_apply_check");
    if (requiresTypecheck) gates.push("typecheck");
    return gates;
}

const decisionTemplate = (status, ratifiedBy) => `motion_id: ${motionId}
status: ${status}
ratified_by: ${ratifiedBy ?? "null"}
required_gates: [${requiredGateList().join(", ")}]
last_updated: "${nowIso()}"
notes: "Outcome determined by council-run.mjs v0.2"
`;

function writeDecision(status, ratifiedBy) {
    fs.writeFileSync(decisionPath, decisionTemplate(status, ratifiedBy), "utf8");
}

if (!exists(decisionPath)) {
    console.log("[COUNCIL-RUN] Decision file missing. Creating initial DRAFT...");
    const scoreboard = safeReadJsonFile(verifyPath, {});
    const gatesOk = scoreboard.summary?.required_ok ?? false;
    const initialStatus = gatesOk && autoRatifyEnabled && riskScore <= maxRiskScore ? "RATIFIED" : "DRAFT";
    writeDecision(initialStatus, initialStatus === "RATIFIED" ? "auto" : null);
}

const decisionYaml = exists(decisionPath) ? readText(decisionPath) : "";
let status = getYamlScalar(decisionYaml, "status") || "DRAFT";
console.log(`[COUNCIL-RUN] Current status from file: ${status}`);

if (status === "DRAFT" || status === "PROPOSED") {
    const scoreboard = safeReadJsonFile(verifyPath, {});
    const gatesOk = scoreboard.summary?.required_ok ?? false;

    if (gatesOk && autoRatifyEnabled && riskScore <= maxRiskScore) {
        status = "RATIFIED";
        writeDecision(status, "auto");
    }
}

console.log(`\n[COUNCIL-RUN] Decision status: ${status}`);
appendChat("DECISION", `Motion ${motionId} status is ${status}`, 0);

if (status === "DRAFT" || status === "PROPOSED") {
    console.log(`[COUNCIL-RUN] Risk score = ${riskScore.toFixed(2)} (auto threshold = ${maxRiskScore.toFixed(2)})`);
    console.log("[COUNCIL-RUN] Edit decision file and set status: RATIFIED, then rerun.\n");
}

// -----------------------------
// Run trace bundle (gitignored)
// -----------------------------
const runTrace = {
    version: "0.2",
    motion_id: motionId,
    title,
    run_id: runId,
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
    decision_status: status,
    excerpts: {
        proposal: summarizeFile(proposalPath),
        challenge: summarizeFile(challengePath),
        execution: summarizeFile(executionPath),
        decision: summarizeFile(decisionPath),
    },
};

fs.writeFileSync(runTracePath, JSON.stringify(runTrace, null, 2), "utf8");

appendChat("RUNNER_DONE", `Council runner v0.2 finished for motion ${motionId}`, 0);

console.log(`[COUNCIL-RUN] Wrote run trace: ${path.relative(repoRoot, runTracePath)}`);
console.log("[COUNCIL-RUN] Done.\n");
