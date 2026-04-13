#!/usr/bin/env node
/**
 * list-escalations.mjs
 *
 * Lists all ACTIVE escalations across .nexus/motions/<motion-id>/escalation.yaml.
 * Sorted deterministically:
 *   1. severity: critical > high > medium > low
 *   2. motion id ascending
 *
 * Usage:
 *   node portal/scripts/list-escalations.mjs
 *
 * Exit codes:
 *   0 = success (zero or more ACTIVE escalations listed)
 *   2 = unexpected error
 *
 * Part of: motion-0128 (Operator Escalation Routing v0)
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import yaml from "js-yaml";

// Canonical severity values and their sort rank.
// Anything not in this set is treated as "unknown" and sorts last (rank 99).
// This guarantees the sort is stable even when escalation.yaml contains an
// unexpected or non-string severity value.
const SEVERITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 };
const VALID_SEVERITIES = new Set(Object.keys(SEVERITY_RANK));

/**
 * Return the canonical severity string or "unknown" for any invalid value.
 * Prevents padEnd() TypeError when severity is a non-string (e.g. severity: 42 in YAML).
 */
function normalizeSeverity(v) {
    if (typeof v === "string" && VALID_SEVERITIES.has(v)) return v;
    return "unknown";
}

/**
 * Coerce reason to a single-line string.
 * YAML block scalars (|, >) produce multi-line strings that would break table
 * column alignment. We collapse all newlines to spaces and trim the result.
 * Non-string values are coerced via String() so they never cause TypeError.
 */
function normalizeReason(v) {
    if (v == null) return "(no reason)";
    const s = typeof v === "string" ? v : String(v);
    const collapsed = s.replace(/[\r\n]+/g, " ").trim();
    return collapsed || "(no reason)";
}

function findRepoRoot(startDir) {
    let cur = startDir;
    for (let i = 0; i < 8; i++) {
        if (fs.existsSync(path.join(cur, ".nexus"))) return cur;
        const parent = path.dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return null;
}

try {
    const repoRoot = findRepoRoot(process.cwd());
    if (!repoRoot) {
        console.error("[LIST-ESCALATIONS] ERROR: Could not find repo root (.nexus directory not found).");
        process.exit(2);
    }

    const motionsDir = path.join(repoRoot, ".nexus", "motions");

    if (!fs.existsSync(motionsDir)) {
        console.log("No .nexus/motions directory found.");
        process.exit(0);
    }

    const motionDirs = fs.readdirSync(motionsDir)
        .filter((d) => {
            try {
                return fs.statSync(path.join(motionsDir, d)).isDirectory();
            } catch {
                return false;
            }
        })
        .sort();

    const active = [];

    for (const motionId of motionDirs) {
        const escalationPath = path.join(motionsDir, motionId, "escalation.yaml");
        if (!fs.existsSync(escalationPath)) continue;

        try {
            const text = fs.readFileSync(escalationPath, "utf8");
            const data = yaml.load(text);
            if (!data || typeof data !== "object") continue;
            if (data.status !== "ACTIVE") continue;
            active.push({
                motionId,
                // normalizeSeverity() guarantees a known string — prevents padEnd() TypeError
                // if YAML author wrote a non-string (e.g. severity: 42) or an unrecognised value.
                severity: normalizeSeverity(data.severity),
                // Strict === comparison: js-yaml parses `blocking: yes` as boolean true,
                // but we intentionally reject truthy non-booleans (e.g. blocking: 1).
                blocking: data.blocking === true,
                required: data.required === true,
                // normalizeReason() collapses YAML block scalars to a single line so the
                // table format is never broken by embedded newlines in the reason field.
                reason: normalizeReason(data.reason),
                emitted_at: data.emitted_at ?? null,
                emitted_by: data.emitted_by ?? null,
            });
        } catch {
            // Malformed escalation.yaml (invalid YAML, non-object root, etc.) is silently
            // skipped. A single bad file must never prevent other escalations from listing.
            // Crucially, this catch does NOT affect lifecycle blocking — council-run and
            // activate-motion have their own independent try/catch that also skip on error,
            // meaning a malformed file never incorrectly blocks ratification or activation.
        }
    }

    // Sort: severity rank asc (critical=0), then motionId asc.
    // normalizeSeverity() guarantees every entry has a string severity in SEVERITY_RANK
    // or "unknown". Unknown maps to rank 99, so invalid entries sort last deterministically.
    active.sort((a, b) => {
        const ra = SEVERITY_RANK[a.severity] ?? 99;
        const rb = SEVERITY_RANK[b.severity] ?? 99;
        if (ra !== rb) return ra - rb;
        return a.motionId < b.motionId ? -1 : 1;
    });

    if (active.length === 0) {
        console.log("No ACTIVE escalations.");
        process.exit(0);
    }

    console.log(`ACTIVE ESCALATIONS: ${active.length}\n`);

    const col1 = 18;
    const col2 = 10;
    const col3 = 10;
    const col4 = 10;

    console.log(
        `${"MOTION".padEnd(col1)}${"SEVERITY".padEnd(col2)}${"BLOCKING".padEnd(col3)}${"REQUIRED".padEnd(col4)}REASON`
    );
    console.log("-".repeat(90));

    for (const e of active) {
        const blocking = e.blocking ? "yes" : "no";
        const required = e.required ? "yes" : "no";
        console.log(
            `${e.motionId.padEnd(col1)}${e.severity.padEnd(col2)}${blocking.padEnd(col3)}${required.padEnd(col4)}${e.reason}`
        );
    }

    process.exit(0);
} catch (err) {
    console.error(`[LIST-ESCALATIONS] Unexpected error: ${err?.message || String(err)}`);
    process.exit(2);
}
