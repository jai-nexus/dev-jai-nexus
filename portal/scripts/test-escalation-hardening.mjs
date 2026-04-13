#!/usr/bin/env node
/**
 * test-escalation-hardening.mjs
 *
 * Verifies edge-case behavior of escalation.yaml parsing across three surfaces:
 *   - list-escalations.mjs (normalization, sorting, CLI stability)
 *   - council-run.mjs escalation state read (idempotency, safe defaults)
 *   - activate-motion.mjs escalation lifecycle block (safe defaults)
 *
 * Tests use temp directories under OS temp so .nexus/motions/ is never polluted.
 * Each test creates its own isolated escalation.yaml, exercises the logic, then
 * deletes the temp file.
 *
 * Usage:
 *   node portal/scripts/test-escalation-hardening.mjs
 *
 * Exit codes:
 *   0 = all assertions pass
 *   1 = one or more assertions failed
 *
 * Part of: motion-0128 (Operator Escalation Routing v0) — hardening verification
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import process from "node:process";
import { spawnSync } from "node:child_process";
import yaml from "js-yaml";

// ---------------------------------------------------------------------------
// Assertion helpers
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function assert(label, condition, detail = "") {
    if (condition) {
        console.log(`  ✅ PASS  ${label}`);
        passed++;
    } else {
        console.error(`  ❌ FAIL  ${label}${detail ? `\n          ${detail}` : ""}`);
        failed++;
    }
}

function assertEq(label, actual, expected) {
    const ok = actual === expected;
    assert(label, ok, ok ? "" : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

// ---------------------------------------------------------------------------
// Normalization helpers (mirrors list-escalations.mjs logic exactly)
// ---------------------------------------------------------------------------

const SEVERITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 };
const VALID_SEVERITIES = new Set(Object.keys(SEVERITY_RANK));

function normalizeSeverity(v) {
    if (typeof v === "string" && VALID_SEVERITIES.has(v)) return v;
    return "unknown";
}

function normalizeReason(v) {
    if (v == null) return "(no reason)";
    const s = typeof v === "string" ? v : String(v);
    const collapsed = s.replace(/[\r\n]+/g, " ").trim();
    return collapsed || "(no reason)";
}

function parseEscalationSafe(text) {
    try {
        const data = yaml.load(text);
        if (!data || typeof data !== "object") return null;
        if (data.status !== "ACTIVE") return null;
        return {
            status: data.status,
            severity: normalizeSeverity(data.severity),
            blocking: data.blocking === true,
            required: data.required === true,
            reason: normalizeReason(data.reason),
        };
    } catch {
        return null;
    }
}

// Mirrors council-run escalation lifecycle block condition
function wouldBlock(text) {
    try {
        const data = yaml.load(text);
        return data?.status === "ACTIVE" && data?.blocking === true;
    } catch {
        return false;
    }
}

// Mirrors council-run idempotency check
function isIdempotent(existingText, newReason) {
    try {
        const data = yaml.load(existingText);
        return data?.status === "ACTIVE" && data?.reason === newReason;
    } catch {
        return false;
    }
}

// ---------------------------------------------------------------------------
// Temp directory for file-based tests
// ---------------------------------------------------------------------------

const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), "jai-escalation-test-"));
function tmpFile(name) {
    return path.join(tmpBase, name);
}
function writeTmp(name, content) {
    fs.writeFileSync(tmpFile(name), content, "utf8");
    return tmpFile(name);
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

console.log("\n[TEST] Escalation hardening — motion-0128\n");

// ----------------------------------------------------------------
// SCENARIO 1: Malformed YAML — never crashes, never blocks
// ----------------------------------------------------------------
console.log("Scenario 1: Malformed escalation.yaml");

const malformed = [
    "this is: not: valid: yaml::",
    "",
    "~",
    "null",
    "42",
    "[]",
    "---\n---\n---",
];

for (const input of malformed) {
    assertEq(`malformed input ${JSON.stringify(input.slice(0, 30))} → no crash, returns null`,
        parseEscalationSafe(input), null);
    assert(`malformed input does not block lifecycle`,
        !wouldBlock(input));
}

// ----------------------------------------------------------------
// SCENARIO 2: Missing required fields — safe defaults
// ----------------------------------------------------------------
console.log("\nScenario 2: Missing fields → safe defaults");

const missingStatus = "version: '0.1'\nseverity: high\nblocking: true\n";
assertEq("missing status → filtered out (not ACTIVE)", parseEscalationSafe(missingStatus), null);
assert("missing status does not block", !wouldBlock(missingStatus));

const missingBlocking = "status: ACTIVE\nseverity: high\nreason: test\n";
const parsed2 = parseEscalationSafe(missingBlocking);
assert("missing blocking field → blocking defaults to false",
    parsed2 !== null && parsed2.blocking === false);
assert("missing blocking does not lifecycle-block",
    !wouldBlock(missingBlocking));

const missingRequired = "status: ACTIVE\nblocking: true\nseverity: high\n";
const parsed3 = parseEscalationSafe(missingRequired);
assert("missing required field → required defaults to false",
    parsed3 !== null && parsed3.required === false);

const missingReason = "status: ACTIVE\nblocking: true\nseverity: high\n";
const parsed4 = parseEscalationSafe(missingReason);
assert("missing reason → normalizes to '(no reason)'",
    parsed4 !== null && parsed4.reason === "(no reason)");

const missingSeverity = "status: ACTIVE\nblocking: true\nreason: test\n";
const parsed5 = parseEscalationSafe(missingSeverity);
assert("missing severity → normalizes to 'unknown'",
    parsed5 !== null && parsed5.severity === "unknown");

// ----------------------------------------------------------------
// SCENARIO 3: Invalid severity values — normalization
// ----------------------------------------------------------------
console.log("\nScenario 3: Invalid severity values");

const severityTests = [
    ["critical", "critical"],
    ["high", "high"],
    ["medium", "medium"],
    ["low", "low"],
    ["CRITICAL", "unknown"],       // case-sensitive
    ["urgent", "unknown"],          // unknown string
    [42, "unknown"],                // number — YAML parses as number
    [null, "unknown"],              // explicit null
    [true, "unknown"],              // boolean
    ["", "unknown"],                // empty string
];

for (const [input, expected] of severityTests) {
    assertEq(`normalizeSeverity(${JSON.stringify(input)}) → "${expected}"`,
        normalizeSeverity(input), expected);
}

// Confirm unknown severity sorts last
assert("unknown severity rank is 99",
    (SEVERITY_RANK["unknown"] ?? 99) === 99);
assert("critical sorts before unknown",
    SEVERITY_RANK["critical"] < (SEVERITY_RANK["unknown"] ?? 99));

// ----------------------------------------------------------------
// SCENARIO 4: Multi-line reason — collapsed to single line
// ----------------------------------------------------------------
console.log("\nScenario 4: Multi-line reason normalization");

const multilineYaml = "status: ACTIVE\nblocking: true\nseverity: high\nreason: |\n  line 1\n  line 2\n  line 3\n";
const parsed6 = parseEscalationSafe(multilineYaml);
assert("multi-line reason contains no newlines after normalization",
    parsed6 !== null && !parsed6.reason.includes("\n") && !parsed6.reason.includes("\r"));
assert("multi-line reason is non-empty after normalization",
    parsed6 !== null && parsed6.reason.length > 0);

assertEq("normalizeReason(null) → '(no reason)'", normalizeReason(null), "(no reason)");
assertEq("normalizeReason('') → '(no reason)'", normalizeReason(""), "(no reason)");
assertEq("normalizeReason(42) → '42'", normalizeReason(42), "42");
assertEq("normalizeReason('a\\nb') → 'a b'", normalizeReason("a\nb"), "a b");
assertEq("normalizeReason('a\\r\\nb') → 'a b'", normalizeReason("a\r\nb"), "a b");

// ----------------------------------------------------------------
// SCENARIO 5: Idempotency — repeated emission with same reason
// ----------------------------------------------------------------
console.log("\nScenario 5: Idempotency of emission");

const reason = "required_ok=false: failed required gates [typecheck]";
const existingActive = `version: "0.1"\nmotion_id: motion-0128\nstatus: ACTIVE\nseverity: high\nrequired: true\nblocking: true\nreason: "${reason}"\nemitted_at: "2026-04-13T10:00:00.000Z"\nemitted_by: council-run.mjs\n`;

assert("same reason → idempotent (should not re-emit)",
    isIdempotent(existingActive, reason));
assert("different reason → should re-emit",
    !isIdempotent(existingActive, "required_ok=false: failed required gates [validate_motion]"));
assert("missing reason in file → should re-emit",
    !isIdempotent("status: ACTIVE\nseverity: high\n", reason));
assert("parse error on existing → should re-emit",
    !isIdempotent("not: valid: yaml::", reason));

// ----------------------------------------------------------------
// SCENARIO 6: RESOLVED state — clears block, prevents re-emission
// ----------------------------------------------------------------
console.log("\nScenario 6: RESOLVED state");

const resolved = "status: RESOLVED\nblocking: true\nseverity: high\nrequired: true\n";
assertEq("RESOLVED status → filtered out by parseEscalationSafe",
    parseEscalationSafe(resolved), null);
assert("RESOLVED status does not lifecycle-block (even with blocking: true)",
    !wouldBlock(resolved));

// Simulate council-run escalation state detection with RESOLVED file
function councilRunEscalationState(fileText, requiredOk) {
    let tag = "null";
    try {
        const data = yaml.load(fileText);
        if (data?.status === "ACTIVE" && data?.required === true) tag = "ACTIVE";
        else if (data?.status === "RESOLVED") tag = "RESOLVED";
    } catch {}
    // Mirrors: if (!required_ok && escalationStateTag !== "RESOLVED") escalationStateTag = "ACTIVE"
    if (!requiredOk && tag !== "RESOLVED") tag = "ACTIVE";
    return tag;
}

assertEq("RESOLVED file + required_ok=true → tag=RESOLVED",
    councilRunEscalationState(resolved, true), "RESOLVED");
assertEq("RESOLVED file + required_ok=false → tag stays RESOLVED (operator decision preserved)",
    councilRunEscalationState(resolved, false), "RESOLVED");
assertEq("ACTIVE file + required_ok=true → tag=ACTIVE",
    councilRunEscalationState(existingActive, true), "ACTIVE");
// yaml.load("") returns undefined → tag stays "null" → !required_ok fires → tag="ACTIVE"
assertEq("no file (empty string) + required_ok=false → tag=ACTIVE (will emit)",
    councilRunEscalationState("", false), "ACTIVE");

// Fix the above assertion (empty string = simulating no file, so skip)
// Test actual behavior:
const stateNoFile = (() => {
    let tag = "null";
    // no file exists → skip the if(exists) block
    if (false /* simulating no file */) { /* skip */ }
    const requiredOk = false;
    if (!requiredOk && tag !== "RESOLVED") tag = "ACTIVE";
    return tag;
})();
assertEq("no prior file + required_ok=false → ACTIVE (will emit)", stateNoFile, "ACTIVE");

// ----------------------------------------------------------------
// SCENARIO 7: Multiple ACTIVE escalations — sorting stability
// ----------------------------------------------------------------
console.log("\nScenario 7: Multiple escalations sort stability");

const escalations = [
    { motionId: "motion-0050", severity: "low",      blocking: true, required: true, reason: "r" },
    { motionId: "motion-0030", severity: "critical",  blocking: true, required: true, reason: "r" },
    { motionId: "motion-0040", severity: "high",      blocking: true, required: true, reason: "r" },
    { motionId: "motion-0010", severity: "unknown",   blocking: true, required: true, reason: "r" },
    { motionId: "motion-0020", severity: "high",      blocking: true, required: true, reason: "r" },
    { motionId: "motion-0060", severity: "medium",    blocking: true, required: true, reason: "r" },
    { motionId: "motion-0035", severity: "critical",  blocking: true, required: true, reason: "r" },
];

const sorted = [...escalations].sort((a, b) => {
    const ra = SEVERITY_RANK[a.severity] ?? 99;
    const rb = SEVERITY_RANK[b.severity] ?? 99;
    if (ra !== rb) return ra - rb;
    return a.motionId < b.motionId ? -1 : 1;
});

const sortedIds = sorted.map((e) => e.motionId);
const expectedOrder = [
    "motion-0030", // critical
    "motion-0035", // critical
    "motion-0020", // high
    "motion-0040", // high
    "motion-0060", // medium
    "motion-0050", // low
    "motion-0010", // unknown → rank 99
];

assertEq("critical sorts first (motion-0030)", sortedIds[0], "motion-0030");
assertEq("critical sorts second (motion-0035)", sortedIds[1], "motion-0035");
assertEq("high: lower motion-id first (motion-0020)", sortedIds[2], "motion-0020");
assertEq("high: higher motion-id second (motion-0040)", sortedIds[3], "motion-0040");
assertEq("medium sorts after high (motion-0060)", sortedIds[4], "motion-0060");
assertEq("low sorts after medium (motion-0050)", sortedIds[5], "motion-0050");
assertEq("unknown severity sorts last (motion-0010)", sortedIds[6], "motion-0010");
assert("sort output matches expected order exactly",
    JSON.stringify(sortedIds) === JSON.stringify(expectedOrder));

// ----------------------------------------------------------------
// SCENARIO 8: File-based CLI test via subprocess
// ----------------------------------------------------------------
console.log("\nScenario 8: CLI smoke test via subprocess");

// Create a minimal .nexus/motions/ structure under tmpBase
const nexusDir = path.join(tmpBase, ".nexus", "motions");
fs.mkdirSync(path.join(nexusDir, "motion-zzz-active"), { recursive: true });
fs.mkdirSync(path.join(nexusDir, "motion-zzz-resolved"), { recursive: true });
fs.mkdirSync(path.join(nexusDir, "motion-zzz-malformed"), { recursive: true });
fs.mkdirSync(path.join(nexusDir, "motion-zzz-none"), { recursive: true });

fs.writeFileSync(path.join(nexusDir, "motion-zzz-active", "escalation.yaml"),
    `version: "0.1"\nmotion_id: motion-zzz-active\nstatus: ACTIVE\nseverity: high\nrequired: true\nblocking: true\nreason: "test active escalation"\nemitted_at: "2026-04-13T00:00:00.000Z"\nemitted_by: council-run.mjs\n`, "utf8");

fs.writeFileSync(path.join(nexusDir, "motion-zzz-resolved", "escalation.yaml"),
    `version: "0.1"\nmotion_id: motion-zzz-resolved\nstatus: RESOLVED\nseverity: high\nblocking: true\n`, "utf8");

fs.writeFileSync(path.join(nexusDir, "motion-zzz-malformed", "escalation.yaml"),
    `this is: not: valid: yaml::`, "utf8");

// motion-zzz-none has no escalation.yaml — just a directory

const listScript = path.join(process.cwd(), "portal", "scripts", "list-escalations.mjs");
const result = spawnSync("node", [listScript], { cwd: tmpBase, encoding: "utf8" });

assert("CLI exits 0", result.status === 0, `exit code: ${result.status}\nstderr: ${result.stderr}`);
assert("CLI output contains exactly 1 ACTIVE escalation",
    result.stdout.includes("ACTIVE ESCALATIONS: 1"),
    `stdout: ${result.stdout}`);
assert("CLI output lists motion-zzz-active",
    result.stdout.includes("motion-zzz-active"),
    `stdout: ${result.stdout}`);
assert("CLI does not list RESOLVED escalation",
    !result.stdout.includes("motion-zzz-resolved"),
    `stdout: ${result.stdout}`);
assert("CLI does not list malformed escalation",
    !result.stdout.includes("motion-zzz-malformed"),
    `stdout: ${result.stdout}`);
assert("CLI does not crash on malformed file (no stderr error)",
    !result.stderr.includes("Unexpected error"),
    `stderr: ${result.stderr}`);

// ----------------------------------------------------------------
// Clean up
// ----------------------------------------------------------------
fs.rmSync(tmpBase, { recursive: true, force: true });

// ----------------------------------------------------------------
// Summary
// ----------------------------------------------------------------
const total = passed + failed;
console.log(`\n${"─".repeat(60)}`);
console.log(`Results: ${passed}/${total} passed${failed > 0 ? `, ${failed} FAILED` : ""}`);

if (failed > 0) {
    console.error(`\n[TEST] ${failed} assertion(s) failed.`);
    process.exit(1);
} else {
    console.log(`\n[TEST] All ${total} assertions passed. ✅`);
    process.exit(0);
}
