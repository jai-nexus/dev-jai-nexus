#!/usr/bin/env node
/**
 * Council Runner v0.3.8 (Unanimous/Unanimous-Consent Vote Mode + Blocker Packets + Model Slots-ready)
 *
 * Executes a motion using file-based artifacts plus a governance loop.
 * Stages: motion -> proposal -> critique -> verify -> policy -> vote -> ratify
 *
 * v0.3:
 * - Explicit Policy stage: Generates policy.yaml (risk vs gates)
 * - Explicit Vote stage: Supports manual or auto vote.json
 * - Protocol enforcement: ratification requires PASS vote and eligible policy
 * - Idempotency: avoids updating timestamps if content is unchanged
 *
 * v0.3.1:
 * - Supports checks_optional in motion.yaml
 * - Optional gates run + are logged, but do NOT block eligibility/ratification
 * - Policy emits warnings for optional failures
 *
 * v0.3.2:
 * - Stronger parsing for checks_required/checks_optional (no greedy regex)
 * - validate_agency ALWAYS required and always included in required_gates
 * - Adds protocol_version to policy.yaml + decision.yaml (idempotent comparisons ignore timestamps)
 * - Cleaner verify.json merging: equality ignores ts; ts only updates when entry changes
 *
 * v0.3.3:
 * - Decision refresh: even if status already RATIFIED/BLOCKED, update notes/ratified_by when computed outcome changes
 * - More robust auto_ratify + max_risk_score parsing
 * - Policy/Decision idempotency ignores evaluated_at/last_updated so repeated runs don’t churn
 * - Gate list parsing supports inline lists and YAML-ish booleans for auto_ratify.enabled
 *
 * v0.3.4:
 * - Motion targets: pass motion target domain/repo to validate-agency.mjs
 *   - If target.domain absent => pass --no-domain (Tier 0 only)
 *   - If target.repo absent => pass --no-repo   (Tier 0/1 only)
 *
 * v0.3.5:
 * - Adds validate_motion gate (always required) before validate_agency
 *   - Runs portal/scripts/validate-motion.mjs --motion <motion.yaml>
 *   - Included in required_gates + policy/decision gating
 *
 * v0.3.6:
 * - Shared YAML+Zod motion parser:
 *   - portal/src/lib/motion/motionLib.mjs
 *
 * v0.3.7:
 * - Ensures council-run uses a *strict* parsed motion (from motionLib) after validate_motion passes
 * - Adds target_domain/target_repo to policy.yaml and decision.yaml for self-describing artifacts
 *
 * v0.3.8:
 * - Adds vote mode feature flag:
 *     - Repo default: .nexus/council.config.yaml
 *     - Env override: JAI_COUNCIL_VOTE_MODE (majority|unanimous|unanimous_consent)
 * - Vote evaluation computed by runner (does not trust vote.json outcome blindly)
 * - Supports votes:
 *     - YES
 *     - YES_WITH_RESERVATIONS (requires reservations[])
 *     - NO (requires blocker_packet)
 *     - ABSTAIN
 * - Unanimous / Unanimous-Consent:
 *     - Requires required_roles votes present (from council.config.yaml)
 *     - Any NO blocks
 * - Policy/Decision include vote_mode for traceability
 *
 * Notes:
 * - Keeps stable artifacts: avoids timestamp churn when content unchanged.
 * - validate_motion + validate_agency are always required.
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

import yaml from "js-yaml";
import { parseMotionText } from "../src/lib/motion/motionLib.mjs";

const PROTOCOL_VERSION = "0.3.8";

// -----------------------------
// tiny utils
// -----------------------------
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
function atomicWriteJsonIfChanged(p, obj) {
    const text = JSON.stringify(obj, null, 2);
    if (exists(p) && readText(p) === text) return false;
    const tmp = `${p}.tmp`;
    fs.writeFileSync(tmp, text, "utf8");
    fs.renameSync(tmp, p);
    return true;
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
function normalizeTextForCompare(t) {
    return t
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((l) => l.replace(/[ \t]+$/g, ""))
        .join("\n")
        .trimEnd();
}
function stripYamlLine(yamlText, key) {
    const re = new RegExp(`^\\s*${key}:.*\\n`, "m");
    return yamlText.replace(re, "");
}
function stripYamlLines(yamlText, keys) {
    let out = yamlText;
    for (const k of keys) out = stripYamlLine(out, k);
    return out;
}
function writeYamlIfChangedIgnoringKeys(filePath, nextText, ignoreKeys) {
    const next = normalizeTextForCompare(nextText) + "\n";
    if (exists(filePath)) {
        const old = normalizeTextForCompare(readText(filePath));
        const oldNorm = normalizeTextForCompare(stripYamlLines(old, ignoreKeys));
        const nextNorm = normalizeTextForCompare(stripYamlLines(next, ignoreKeys));
        if (oldNorm === nextNorm) return false;
    }
    fs.writeFileSync(filePath, next, "utf8");
    return true;
}

function asString(v) {
    return typeof v === "string" ? v : null;
}
function asBool(v) {
    return v === true ? true : v === false ? false : null;
}
function asNum(v) {
    return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function asStringArray(v) {
    if (!Array.isArray(v)) return null;
    const out = v.filter((x) => typeof x === "string" && x.trim().length > 0).map((s) => s.trim());
    return out.length ? out : null;
}

function normalizeVoteValue(v) {
    const s = String(v ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
    if (s === "yes") return "yes";
    if (s === "no") return "no";
    if (s === "abstain") return "abstain";
    if (s === "yes_with_reservations") return "yes_with_reservations";
    // backwards compat: treat unknown as abstain
    return "abstain";
}

function normalizeRole(v) {
    const s = String(v ?? "").trim().toLowerCase();
    if (!s) return null;
    const allowed = new Set([
        "proposer",
        "executor",
        "challenger",
        "arbiter",
        "librarian",
        "meta_analyst",
        "observer",
    ]);
    return allowed.has(s) ? s : null;
}

function coerceVotesArray(voteData) {
    const votes = Array.isArray(voteData?.votes) ? voteData.votes : [];
    return votes.map((raw, idx) => {
        const voter_id = asString(raw?.voter_id) ?? `voter_${idx}`;
        const role = normalizeRole(raw?.role);
        const tier = asNum(raw?.tier) ?? null;

        // support legacy `vote` values and `rationale`
        const vote = normalizeVoteValue(raw?.vote);
        const rationale = asString(raw?.rationale) ?? null;

        const blocker_packet = raw?.blocker_packet && typeof raw.blocker_packet === "object" ? raw.blocker_packet : null;
        const reservations = Array.isArray(raw?.reservations) ? raw.reservations : null;

        const ts = asString(raw?.ts) ?? null;

        return { voter_id, role, tier, vote, rationale, blocker_packet, reservations, ts, _raw: raw };
    });
}

function validateVoteEntry(v) {
    // Invalid entries are treated as blocking (FAIL) with explicit reason.
    if (v.vote === "no") {
        if (!v.blocker_packet) return { ok: false, reason: "NO vote missing blocker_packet" };

        const bt = asString(v.blocker_packet.blocker_type);
        const claim = asString(v.blocker_packet.claim);
        const minimal_fix = asString(v.blocker_packet.minimal_fix);
        const acceptance_to_flip = asString(v.blocker_packet.acceptance_to_flip);

        if (!bt || !claim || !minimal_fix || !acceptance_to_flip) {
            return {
                ok: false,
                reason:
                    "NO vote blocker_packet incomplete (requires blocker_type, claim, minimal_fix, acceptance_to_flip)",
            };
        }
    }

    if (v.vote === "yes_with_reservations") {
        if (!Array.isArray(v.reservations) || v.reservations.length === 0) {
            return { ok: false, reason: "YES_WITH_RESERVATIONS missing reservations[]" };
        }
    }

    return { ok: true };
}

function pickLatestByRole(votes) {
    // If multiple entries for same role exist, prefer:
    // 1) most recent ts (if parseable)
    // 2) later position in file
    const byRole = new Map();
    const tsVal = (s) => {
        if (!s) return -1;
        const t = new Date(s).getTime();
        return Number.isFinite(t) ? t : -1;
    };

    votes.forEach((v, idx) => {
        if (!v.role) return;
        const prev = byRole.get(v.role);
        if (!prev) {
            byRole.set(v.role, { v, idx });
            return;
        }
        const a = tsVal(prev.v.ts);
        const b = tsVal(v.ts);
        if (b > a) byRole.set(v.role, { v, idx });
        else if (b === a && idx > prev.idx) byRole.set(v.role, { v, idx });
    });

    return byRole;
}

function evaluateVotes({ voteMode, votes, requiredRoles, allowYesWithReservations }) {
    const reasons = [];
    const normalizedVotes = votes.map((v) => ({ ...v, vote: normalizeVoteValue(v.vote) }));

    // Validate all vote entries first
    for (const v of normalizedVotes) {
        const vr = validateVoteEntry(v);
        if (!vr.ok) {
            reasons.push(`Invalid vote by ${v.voter_id}${v.role ? ` (${v.role})` : ""}: ${vr.reason}`);
        }
    }

    // Any invalid vote blocks
    if (reasons.length > 0) {
        return {
            result: "FAIL",
            yes: 0,
            no: 1,
            abstain: 0,
            yes_with_reservations: 0,
            reasons,
            missing_required_roles: [],
        };
    }

    const yesish = (v) =>
        v.vote === "yes" || (allowYesWithReservations && v.vote === "yes_with_reservations");

    const counts = {
        yes: normalizedVotes.filter((v) => v.vote === "yes").length,
        yes_with_reservations: normalizedVotes.filter((v) => v.vote === "yes_with_reservations").length,
        no: normalizedVotes.filter((v) => v.vote === "no").length,
        abstain: normalizedVotes.filter((v) => v.vote === "abstain").length,
    };

    // majority: yesish > no
    if (voteMode === "majority") {
        const yesishCount = normalizedVotes.filter(yesish).length;
        const noCount = counts.no;
        const ok = yesishCount > noCount;
        return {
            result: ok ? "PASS" : "FAIL",
            ...counts,
            reasons: ok ? [] : [`majority_vote_failed (yesish=${yesishCount}, no=${noCount})`],
            missing_required_roles: [],
        };
    }

    // Role-based modes: require required role votes present and aligned.
    const roleSet = new Set(requiredRoles);
    const byRole = pickLatestByRole(normalizedVotes);
    const missing = requiredRoles.filter((r) => !byRole.has(r));

    // Any NO by a required role blocks; any NO at all blocks (strong safety default)
    const anyNo = normalizedVotes.some((v) => v.vote === "no");
    if (anyNo) {
        return {
            result: "FAIL",
            ...counts,
            reasons: ["blocker_no_present"],
            missing_required_roles: missing,
        };
    }

    if (missing.length > 0) {
        return {
            result: "PENDING",
            ...counts,
            reasons: ["missing_required_role_votes"],
            missing_required_roles: missing,
        };
    }

    // unanimous: all required roles must be YES
    if (voteMode === "unanimous") {
        const bad = requiredRoles.filter((r) => {
            const v = byRole.get(r)?.v;
            return !v || v.vote !== "yes";
        });
        if (bad.length > 0) {
            return {
                result: "FAIL",
                ...counts,
                reasons: [`unanimous_failed (non-YES roles: ${bad.join(", ")})`],
                missing_required_roles: [],
            };
        }
        return { result: "PASS", ...counts, reasons: [], missing_required_roles: [] };
    }

    // unanimous_consent: required roles must be YES or YES_WITH_RESERVATIONS (if allowed)
    if (voteMode === "unanimous_consent") {
        const bad = requiredRoles.filter((r) => {
            const v = byRole.get(r)?.v;
            if (!v) return true;
            if (v.vote === "yes") return false;
            if (allowYesWithReservations && v.vote === "yes_with_reservations") return false;
            return true;
        });
        if (bad.length > 0) {
            return {
                result: "FAIL",
                ...counts,
                reasons: [`unanimous_consent_failed (non-consenting roles: ${bad.join(", ")})`],
                missing_required_roles: [],
            };
        }
        return { result: "PASS", ...counts, reasons: [], missing_required_roles: [] };
    }

    return {
        result: "FAIL",
        ...counts,
        reasons: [`unknown_vote_mode:${voteMode}`],
        missing_required_roles: [],
    };
}

// -----------------------------
// run gate helper
// -----------------------------
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
// main
// -----------------------------
const motionId = process.argv[2];
if (!motionId) die("Missing motion id. Example: pnpm council:run motion-0001");

const repoRoot = process.cwd();
const portalDir = path.join(repoRoot, "portal");

const nexusDir = path.join(repoRoot, ".nexus");
const motionsDir = path.join(nexusDir, "motions");
const motionDir = path.join(motionsDir, motionId);
const motionSpecPath = path.join(motionDir, "motion.yaml");

// traces live at repo-root trace/ (gitignored)
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

// -----------------------------
// Council config (vote mode + required roles)
// -----------------------------
const councilConfigPath = path.join(nexusDir, "council.config.yaml");

function readCouncilConfig() {
    if (!exists(councilConfigPath)) return null;
    try {
        const txt = readText(councilConfigPath);
        const obj = yaml.load(txt);
        return obj && typeof obj === "object" ? obj : null;
    } catch {
        return null;
    }
}
function resolveVoteMode(cfg) {
    const fallbackAllowed = ["majority", "unanimous", "unanimous_consent"];
    const allowed =
        asStringArray(cfg?.feature_flags?.council_vote_mode?.allowed_values) ?? fallbackAllowed;

    const allowedSet = new Set(allowed);

    const envName =
        asString(cfg?.feature_flags?.council_vote_mode?.env_override) ?? "JAI_COUNCIL_VOTE_MODE";

    const env = process.env[envName]?.trim();
    if (env && allowedSet.has(env)) return env;

    const cfgMode = asString(cfg?.voting?.default_mode);
    if (cfgMode && allowedSet.has(cfgMode)) return cfgMode;

    return "majority";
}
function resolveRequiredRoles(cfg) {
    const roles = asStringArray(cfg?.voting?.required_roles);
    // conservative default: keep existing behavior workable without needing per-role votes,
    // while still enabling the new modes once vote.json includes role votes.
    return roles ?? ["proposer", "challenger", "arbiter"];
}
function resolveAllowReservations(cfg) {
    const v = asBool(cfg?.voting?.allow_yes_with_reservations);
    return v === null ? true : v;
}

const councilCfg = readCouncilConfig();
const voteMode = resolveVoteMode(councilCfg);

if (process.env.JAI_COUNCIL_DEBUG === "1") {
    console.log(
        `[COUNCIL-RUN] Council config path: ${path.relative(repoRoot, councilConfigPath)} exists=${exists(councilConfigPath)}`
    );
    console.log(`[COUNCIL-RUN] Council config loaded: ${councilCfg ? "YES" : "NO"}`);
    if (councilCfg?.voting?.default_mode) {
        console.log(`[COUNCIL-RUN] Council default_mode: ${String(councilCfg.voting.default_mode)}`);
    }
    if (process.env.JAI_COUNCIL_VOTE_MODE) {
        console.log(`[COUNCIL-RUN] Env override JAI_COUNCIL_VOTE_MODE: ${process.env.JAI_COUNCIL_VOTE_MODE}`);
    }
}

const allowYesWithReservations = resolveAllowReservations(councilCfg);
const requiredRoles = resolveRequiredRoles(councilCfg);

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

const proposalPath = path.join(motionDir, "proposal.md");
const challengePath = path.join(motionDir, "challenge.md");
const executionPath = path.join(motionDir, "execution.md");
const policyPath = path.join(motionDir, "policy.yaml");
const votePath = path.join(motionDir, "vote.json");
const decisionPath = path.join(motionDir, "decision.yaml");
const verifyPath = path.join(motionDir, "verify.json");

const runTracePath = path.join(traceDir, `motion.${motionId}.run.${runId}.json`);

appendChat(
    "RUNNER_START",
    `Council runner v${PROTOCOL_VERSION} started for motion ${motionId} (vote_mode=${voteMode})`,
    0
);

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

// Best-effort parse just for the header print (validate_motion is authoritative).
let headerTitle = motionId;
let headerTarget = { domain: null, repo: null };
try {
    const pre = parseMotionText(motionYaml);
    headerTitle = pre.title ?? motionId;
    headerTarget = pre.target ?? { domain: null, repo: null };
} catch { }

console.log(`\n[COUNCIL-RUN] Motion: ${motionId}`);
console.log(`[COUNCIL-RUN] Title: ${headerTitle}`);
console.log(`[COUNCIL-RUN] Motion spec: ${path.relative(repoRoot, motionSpecPath)}`);
console.log(
    `[COUNCIL-RUN] Target: domain=${headerTarget.domain ?? "(none)"} repo=${headerTarget.repo ?? "(none)"}`
);
console.log(`[COUNCIL-RUN] Vote mode: ${voteMode} (required_roles=${requiredRoles.join(", ")})\n`);

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
    if (!base.summary || typeof base.summary !== "object") {
        base.summary = { required_ok: true, last_updated: nowIso() };
    }

    const nextEntry = {
        gate: update.gate,
        ok: update.ok,
        status: update.status,
        ts: update.finished, // only meaningful when entry changes
        command: update.command,
        cwd: update.cwd,
        required: !!update.required,
    };

    const prev = base.latest[update.gate];

    // equality intentionally ignores ts
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
        atomicWriteJsonIfChanged(verifyPath, base);
    }

    appendVerifyHistory(update);
    appendChat("GATE_RESULT", `Gate ${update.gate} finished: ${update.ok ? "PASS" : "FAIL"}`, 2);
}

// -----------------------------
// Gate 0: validate_motion (always required)
// -----------------------------
const validateMotion = path.join(portalDir, "scripts", "validate-motion.mjs");
if (exists(validateMotion)) {
    console.log("[COUNCIL-RUN] Running validate-motion.mjs …");
    appendChat("GATE_START", "Starting validate_motion gate", 2);

    const motionRel = path.relative(repoRoot, motionSpecPath);
    const r = run("node", [validateMotion, "--motion", motionRel], {
        label: "validate_motion",
        required: true,
        prettyCommand: `node ${path.relative(repoRoot, validateMotion)} --motion ${motionRel}`,
    });

    writeVerify(r.meta);
    if (!r.ok) {
        console.error("[COUNCIL-RUN] validate_motion FAILED.");
        die("motion.yaml failed schema validation (validate_motion is required).");
    }
} else {
    appendChat("GATE_SKIP", "validate_motion script missing", 2);
    writeVerify({
        gate: "validate_motion",
        started: nowIso(),
        finished: nowIso(),
        ok: false,
        status: 1,
        command: "missing: portal/scripts/validate-motion.mjs",
        cwd: ".",
        required: true,
        stdout_tail: "",
        stderr_tail: "script_missing",
    });
    die("portal/scripts/validate-motion.mjs not found (validate_motion is required).");
}

// Strict parse after validate_motion success
let motionParsed;
try {
    motionParsed = parseMotionText(motionYaml);
} catch (err) {
    die(`validate_motion passed but motion parse failed in-process: ${err?.message || String(err)}`);
}

const title = motionParsed.title ?? motionId;
const motionTarget = motionParsed.target ?? { domain: null, repo: null };

// -----------------------------
// Motion controls (required/optional gates) via motionLib
// -----------------------------
const checksRequired = new Set(motionParsed.checks_required ?? []);
const checksOptional = new Set(motionParsed.checks_optional ?? []);

// validate_motion + validate_agency are ALWAYS required (even if absent)
checksRequired.add("validate_motion");
checksRequired.add("validate_agency");

// If a gate exists in both, treat as required
for (const g of checksOptional) {
    if (checksRequired.has(g)) checksOptional.delete(g);
}

function motionRequires(gateId) {
    return checksRequired.has(gateId);
}
function motionOptional(gateId) {
    return checksOptional.has(gateId);
}

// Required/Optional membership
const requiresReplay = motionRequires("dct_replay_check");
const requiresPatch = motionRequires("execution_patch_exists");
const requiresApply = motionRequires("patch_apply_check");
const requiresTypecheck = motionRequires("typecheck");

const optionalReplay = motionOptional("dct_replay_check");
const optionalPatch = motionOptional("execution_patch_exists");
const optionalApply = motionOptional("patch_apply_check");
const optionalTypecheck = motionOptional("typecheck");

// Run flags (required OR optional)
const runReplay = requiresReplay || optionalReplay;
const runPatch = requiresPatch || optionalPatch;
const runApply = requiresApply || optionalApply;
const runTypecheck = requiresTypecheck || optionalTypecheck;

// -----------------------------
// Gate 1: validate_agency (always required)
// -----------------------------
const validateAgency = path.join(portalDir, "scripts", "validate-agency.mjs");
if (exists(validateAgency)) {
    console.log("✅ registry-backed agency OK");
    console.log("[COUNCIL-RUN] Running validate-agency.mjs …");
    appendChat("GATE_START", "Starting validate_agency gate", 2);

    const vaArgs = [validateAgency];

    if (motionTarget.domain) vaArgs.push("--domain", motionTarget.domain);
    else vaArgs.push("--no-domain");

    if (motionTarget.repo) vaArgs.push("--repo", motionTarget.repo);
    else vaArgs.push("--no-repo");

    const pretty =
        `node ${path.relative(repoRoot, validateAgency)}` +
        (motionTarget.domain ? ` --domain ${motionTarget.domain}` : " --no-domain") +
        (motionTarget.repo ? ` --repo ${motionTarget.repo}` : " --no-repo");

    const r = run("node", vaArgs, {
        label: "validate_agency",
        required: true,
        prettyCommand: pretty,
    });

    writeVerify(r.meta);
    if (!r.ok) {
        console.error("[COUNCIL-RUN] validate_agency FAILED.");
        die("validate_agency failed (required).");
    }
} else {
    appendChat("GATE_SKIP", "validate_agency script missing", 2);
    writeVerify({
        gate: "validate_agency",
        started: nowIso(),
        finished: nowIso(),
        ok: false,
        status: 1,
        command: "missing: portal/scripts/validate-agency.mjs",
        cwd: ".",
        required: true,
        stdout_tail: "",
        stderr_tail: "script_missing",
    });
    die("portal/scripts/validate-agency.mjs not found (validate_agency is required).");
}

// -----------------------------
// Gate 2: dct_replay_check (required or optional)
// -----------------------------
const dctReplay = path.join(portalDir, "scripts", "dct-replay-check.ts");

if (runReplay) {
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
                prettyCommand:
                    "cmd.exe /c pnpm tsx scripts/dct-replay-check.ts --file scripts/fixtures/dct-test-fixture.json",
            });
        } else {
            r = run("pnpm", ["tsx", "scripts/dct-replay-check.ts", "--file", "scripts/fixtures/dct-test-fixture.json"], {
                cwd: portalDir,
                label: "dct_replay_check",
                required: requiresReplay,
                prettyCommand: "pnpm tsx scripts/dct-replay-check.ts --file scripts/fixtures/dct-test-fixture.json",
            });
        }

        writeVerify(r.meta);

        if (!r.ok && requiresReplay) console.error("[COUNCIL-RUN] dct_replay_check FAILED and is required.");
        else if (!r.ok) console.warn("[COUNCIL-RUN] NOTE: dct_replay_check failed but is optional for this motion.");
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
}

// -----------------------------
// Gate 3: execution_patch_exists (required or optional)
// -----------------------------
const executionPatchPath = path.join(motionDir, "execution.patch");
const hasPatch = exists(executionPatchPath) && readText(executionPatchPath).trim().length > 0;

if (runPatch) {
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
        required: requiresPatch,
        stdout_tail: "",
        stderr_tail: hasPatch ? "" : "missing_or_empty_execution.patch",
    };
    writeVerify(gateResult);

    if (!hasPatch && requiresPatch) console.error("[COUNCIL-RUN] execution.patch is missing or empty (required).");
    else if (!hasPatch) console.warn("[COUNCIL-RUN] NOTE: execution.patch missing/empty but gate is optional.");
}

// -----------------------------
// Gate 4: patch_apply_check (required or optional)
// -----------------------------
if (runApply) {
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
            required: requiresApply,
            stdout_tail: "",
            stderr_tail: "no_execution.patch_present",
        };
        writeVerify(gateResult);

        if (requiresApply) console.error("[COUNCIL-RUN] patch_apply_check required but execution.patch missing/empty.");
        else console.warn("[COUNCIL-RUN] NOTE: patch_apply_check failed due to missing patch but gate is optional.");
    } else {
        const r = run("git", ["apply", "--check", path.relative(repoRoot, executionPatchPath)], {
            label: "patch_apply_check",
            required: requiresApply,
            prettyCommand: `git apply --check ${path.relative(repoRoot, executionPatchPath)}`,
        });
        writeVerify(r.meta);
        if (!r.ok && requiresApply) console.error("[COUNCIL-RUN] patch_apply_check failed (required).");
        else if (!r.ok) console.warn("[COUNCIL-RUN] NOTE: patch_apply_check failed but gate is optional.");
    }
}

// -----------------------------
// Gate 5: typecheck (required or optional)
// -----------------------------
if (runTypecheck) {
    console.log("[COUNCIL-RUN] Running typecheck (pnpm -C portal typecheck) …");
    appendChat("GATE_START", "Running pnpm typecheck", 2);

    let r;
    if (process.platform === "win32") {
        r = run("cmd.exe", ["/d", "/s", "/c", "pnpm -C portal typecheck"], {
            label: "typecheck",
            required: requiresTypecheck,
            prettyCommand: "pnpm -C portal typecheck",
        });
    } else {
        r = run("pnpm", ["-C", "portal", "typecheck"], {
            label: "typecheck",
            required: requiresTypecheck,
            prettyCommand: "pnpm -C portal typecheck",
        });
    }

    writeVerify(r.meta);
    if (!r.ok && requiresTypecheck) console.error("[COUNCIL-RUN] typecheck FAILED (required).");
    else if (!r.ok) console.warn("[COUNCIL-RUN] NOTE: typecheck failed but is optional.");
}

// -----------------------------
// Gate lists for policy
// -----------------------------
function requiredGateList() {
    const gates = ["validate_motion", "validate_agency"]; // always required
    if (requiresReplay) gates.push("dct_replay_check");
    if (requiresPatch) gates.push("execution_patch_exists");
    if (requiresApply) gates.push("patch_apply_check");
    if (requiresTypecheck) gates.push("typecheck");
    return gates;
}
function optionalGateList() {
    const gates = [];
    if (!requiresReplay && optionalReplay) gates.push("dct_replay_check");
    if (!requiresPatch && optionalPatch) gates.push("execution_patch_exists");
    if (!requiresApply && optionalApply) gates.push("patch_apply_check");
    if (!requiresTypecheck && optionalTypecheck) gates.push("typecheck");
    return gates;
}

// -----------------------------
// Stage 5: Policy Calculation
// -----------------------------
console.log("[COUNCIL-RUN] Calculating policy…");

const challengeText = exists(challengePath) ? readText(challengePath) : "";
const riskScore = parseRiskScore(challengeText);

// motionLib-backed values (validate_motion gate enforces correctness)
const autoRatifyEnabled = motionParsed.auto_ratify_enabled ?? false;
const maxRiskScore = motionParsed.max_risk_score ?? 0.2;

const scoreboard = safeReadJsonFile(verifyPath, { latest: {} });
const gates = scoreboard.latest || {};

const required_gates = requiredGateList();
const optional_gates = optionalGateList();

const failed_required_gates = required_gates.filter((g) => !gates[g] || gates[g].ok === false).sort();
const failed_optional_gates = optional_gates.filter((g) => !gates[g] || gates[g].ok === false).sort();

const required_ok = failed_required_gates.length === 0;
const eligible_to_vote = required_ok;

const low_risk = riskScore <= maxRiskScore;
const recommended_vote = eligible_to_vote && low_risk ? "yes" : "no";

const blocking_reasons = [];
if (!required_ok) blocking_reasons.push(`Missing/Failed required gates: ${failed_required_gates.join(", ")}`);
if (!low_risk) blocking_reasons.push(`Risk score ${riskScore.toFixed(2)} exceeds threshold ${maxRiskScore.toFixed(2)}`);

const warnings = [];
if (failed_optional_gates.length > 0) warnings.push(`Optional gates failed: ${failed_optional_gates.join(", ")}`);

const policyTemplate = `protocol_version: "${PROTOCOL_VERSION}"
motion_id: ${motionId}
evaluated_at: "${nowIso()}"
target_domain: ${motionTarget.domain ? `"${motionTarget.domain}"` : "null"}
target_repo: ${motionTarget.repo ? `"${motionTarget.repo}"` : "null"}
vote_mode: "${voteMode}"
required_voters: [${requiredRoles.join(", ")}]
risk_score: ${riskScore.toFixed(2)}
max_risk_score: ${maxRiskScore.toFixed(2)}
required_gates: [${required_gates.join(", ")}]
optional_gates: [${optional_gates.join(", ")}]
failed_required_gates: [${failed_required_gates.join(", ")}]
failed_optional_gates: [${failed_optional_gates.join(", ")}]
required_ok: ${required_ok}
eligible_to_vote: ${eligible_to_vote}
recommended_vote: "${recommended_vote}"
blocking_reasons: [${blocking_reasons.map((r) => `"${r.replace(/"/g, '\\"')}"`).join(", ")}]
warnings: [${warnings.map((w) => `"${w.replace(/"/g, '\\"')}"`).join(", ")}]
`;

writeYamlIfChangedIgnoringKeys(policyPath, policyTemplate, ["evaluated_at"]);

appendChat(
    "POLICY_EVAL",
    `Policy evaluation: eligible=${eligible_to_vote}, recommended="${recommended_vote}", vote_mode="${voteMode}", blockers=[${blocking_reasons.join(
        "; "
    )}], warnings=[${warnings.join("; ")}]`,
    1
);

// -----------------------------
// Stage 6: Voting
// -----------------------------
console.log("[COUNCIL-RUN] Checking votes…");
let voteData = safeReadJsonFile(votePath, null);

// Auto-generate vote.json if missing + auto-ratify says "yes" and eligible.
// For role-based modes, generate one YES per required role.
if (!voteData && autoRatifyEnabled && recommended_vote === "yes" && eligible_to_vote) {
    console.log("[COUNCIL-RUN] Auto-generating vote.json...");

    const votes = requiredRoles.map((role) => ({
        voter_id: `auto:${role}`,
        role,
        tier: 0,
        vote: "yes",
        rationale: "Auto-ratify threshold met",
        ts: nowIso(),
    }));

    voteData = {
        version: "0.2",
        protocol_version: PROTOCOL_VERSION,
        motion_id: motionId,
        vote_mode: voteMode,
        votes,
        outcome: {
            yes: votes.length,
            no: 0,
            abstain: 0,
            yes_with_reservations: 0,
            result: "PASS",
            reasons: [],
        },
        last_updated: nowIso(),
    };

    atomicWriteJsonIfChanged(votePath, voteData);
}

let voteResult = "PENDING";
let voteReasons = [];
let missingRequiredRoles = [];

if (voteData) {
    const votes = coerceVotesArray(voteData);

    const evalRes = evaluateVotes({
        voteMode,
        votes,
        requiredRoles,
        allowYesWithReservations,
    });

    voteResult = evalRes.result;
    voteReasons = evalRes.reasons ?? [];
    missingRequiredRoles = evalRes.missing_required_roles ?? [];

    const nextVoteData = {
        ...(voteData ?? {}),
        version: voteData?.version ?? "0.2",
        protocol_version: voteData?.protocol_version ?? PROTOCOL_VERSION,
        motion_id: motionId,
        vote_mode: voteMode,
        required_roles: requiredRoles,
        votes: (voteData?.votes ?? []).map((v) => v), // preserve original structure
        outcome: {
            yes: evalRes.yes ?? 0,
            no: evalRes.no ?? 0,
            abstain: evalRes.abstain ?? 0,
            yes_with_reservations: evalRes.yes_with_reservations ?? 0,
            result: voteResult,
            reasons: voteReasons,
            missing_required_roles: missingRequiredRoles,
        },
        last_updated: nowIso(),
    };

    // Only write if the computed outcome actually differs (avoid timestamp churn)
    const currentOutcome = voteData?.outcome ?? null;
    const nextOutcome = nextVoteData.outcome ?? null;
    const sameOutcome =
        currentOutcome &&
        nextOutcome &&
        currentOutcome.result === nextOutcome.result &&
        currentOutcome.yes === nextOutcome.yes &&
        currentOutcome.no === nextOutcome.no &&
        currentOutcome.abstain === nextOutcome.abstain &&
        currentOutcome.yes_with_reservations === nextOutcome.yes_with_reservations &&
        JSON.stringify(currentOutcome.reasons ?? []) === JSON.stringify(nextOutcome.reasons ?? []) &&
        JSON.stringify(currentOutcome.missing_required_roles ?? []) ===
        JSON.stringify(nextOutcome.missing_required_roles ?? []);

    if (!sameOutcome) {
        atomicWriteJsonIfChanged(votePath, nextVoteData);
    }
}

console.log(`[COUNCIL-RUN] Vote result: ${voteResult}`);
appendChat(
    "VOTE_CHECK",
    `Vote check result: ${voteResult}${voteReasons.length ? ` reasons=${voteReasons.join("; ")}` : ""}${missingRequiredRoles.length ? ` missing_required_roles=${missingRequiredRoles.join(", ")}` : ""
    }`,
    1
);

// -----------------------------
// Stage 7: Ratification (decision refresh)
// -----------------------------
const decisionYaml = exists(decisionPath) ? readText(decisionPath) : "";
let currentStatus = getYamlScalar(decisionYaml, "status") || "DRAFT";
let currentNotes = getYamlScalar(decisionYaml, "notes");
let currentRatifiedBy = getYamlScalar(decisionYaml, "ratified_by");
if (currentRatifiedBy === "null") currentRatifiedBy = null;

function computeDecisionOutcome() {
    let nextStatus = currentStatus;

    const voteBlocking = [];
    if (voteResult === "FAIL") voteBlocking.push("Vote failed.");
    if (voteResult === "PENDING") voteBlocking.push("Vote pending.");
    if (voteReasons.length > 0) voteBlocking.push(...voteReasons.map((r) => `Vote: ${r}`));
    if (missingRequiredRoles.length > 0)
        voteBlocking.push(`Missing required role votes: ${missingRequiredRoles.join(", ")}`);

    const canRatify = voteResult === "PASS" && eligible_to_vote;

    if (canRatify) nextStatus = "RATIFIED";
    else if (blocking_reasons.length > 0 || voteResult === "FAIL") nextStatus = "BLOCKED";
    else if (currentStatus === "RATIFIED" || currentStatus === "BLOCKED") nextStatus = "PROPOSED";

    let nextNotes;
    if (nextStatus === "RATIFIED") {
        const extras = [];
        if (warnings.length > 0) extras.push(`WARN: ${warnings.join("; ")}`);
        if (voteMode !== "majority") extras.push(`vote_mode=${voteMode}`);
        nextNotes = extras.length ? `RATIFIED: ${extras.join(" | ")}` : "RATIFIED: policy PASS + vote PASS";
    } else if (nextStatus === "BLOCKED") {
        const why = [...blocking_reasons, ...voteBlocking].filter(Boolean);
        nextNotes = why.length ? `BLOCKED: ${why.join("; ")}` : "BLOCKED";
    } else if (voteResult === "PENDING") {
        nextNotes = "PENDING: awaiting vote";
    } else {
        nextNotes = currentNotes ?? `Outcome determined by council-run.mjs v${PROTOCOL_VERSION}`;
    }

    let nextRatifiedBy = currentRatifiedBy;
    if (nextStatus === "RATIFIED") {
        // Prefer a YES voter id if present; fall back to existing.
        const rawVoteData = safeReadJsonFile(votePath, null);
        const vts = Array.isArray(rawVoteData?.votes) ? rawVoteData.votes : [];
        const yesVoter = vts.find((v) => normalizeVoteValue(v?.vote) === "yes")?.voter_id;
        nextRatifiedBy = yesVoter || nextRatifiedBy || "voter";
    } else {
        nextRatifiedBy = nextRatifiedBy ?? null;
    }

    return { nextStatus, nextRatifiedBy, nextNotes };
}

const { nextStatus, nextRatifiedBy, nextNotes } = computeDecisionOutcome();

const decisionTemplate = (st, ratBy, note) => `protocol_version: "${PROTOCOL_VERSION}"
motion_id: ${motionId}
status: ${st}
ratified_by: ${ratBy ?? "null"}
target_domain: ${motionTarget.domain ? `"${motionTarget.domain}"` : "null"}
target_repo: ${motionTarget.repo ? `"${motionTarget.repo}"` : "null"}
vote_mode: "${voteMode}"
required_gates: [${required_gates.join(", ")}]
last_updated: "${nowIso()}"
notes: "${String(note ?? `Outcome determined by council-run.mjs v${PROTOCOL_VERSION}`).replace(/"/g, '\\"')}"
`;

writeYamlIfChangedIgnoringKeys(decisionPath, decisionTemplate(nextStatus, nextRatifiedBy, nextNotes), ["last_updated"]);

console.log(`[COUNCIL-RUN] Decision status: ${nextStatus}`);

appendChat("DECISION", `Motion ${motionId} status is ${nextStatus}`, 0);
if (nextStatus === "RATIFIED") appendChat("VOTE_RESULT", `Vote PASSED for motion ${motionId}`, 0);

// -----------------------------
// Run trace bundle (gitignored)
// -----------------------------
const runTrace = {
    version: PROTOCOL_VERSION,
    motion_id: motionId,
    title,
    run_id: runId,
    ts: nowIso(),
    target: motionTarget,
    vote_mode: voteMode,
    required_roles: requiredRoles,
    files: {
        motion: path.relative(repoRoot, motionSpecPath),
        proposal: path.relative(repoRoot, proposalPath),
        challenge: path.relative(repoRoot, challengePath),
        execution: path.relative(repoRoot, executionPath),
        policy: path.relative(repoRoot, policyPath),
        vote: path.relative(repoRoot, votePath),
        decision: path.relative(repoRoot, decisionPath),
        verify: path.relative(repoRoot, verifyPath),
    },
    risk_score: riskScore,
    decision_status: nextStatus,
    policy: {
        eligible_to_vote,
        recommended_vote,
        blocking_reasons,
        warnings,
    },
    vote: safeReadJsonFile(votePath, null)?.outcome ?? null,
    excerpts: {
        proposal: summarizeFile(proposalPath),
        challenge: summarizeFile(challengePath),
        execution: summarizeFile(executionPath),
        decision: summarizeFile(decisionPath),
    },
};

fs.writeFileSync(runTracePath, JSON.stringify(runTrace, null, 2), "utf8");
appendChat(
    "RUNNER_DONE",
    `Council runner v${PROTOCOL_VERSION} finished for motion ${motionId} (vote_mode=${voteMode})`,
    0
);

console.log(`[COUNCIL-RUN] Wrote run trace: ${path.relative(repoRoot, runTracePath)}`);
console.log("[COUNCIL-RUN] Done.\n");
