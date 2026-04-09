#!/usr/bin/env node
/**
 * record-execution-receipt.mjs
 *
 * Record actual execution state after a durable execution handoff exists.
 *
 * Purpose:
 * - Governance authority stays in decision.yaml.
 * - Execution state lives in execution.receipt.json.
 * - This script records what actually happened after handoff.
 *
 * Usage:
 *   node portal/scripts/record-execution-receipt.mjs --motion motion-0068 --status ACKNOWLEDGED
 *   node portal/scripts/record-execution-receipt.mjs --motion motion-0068 --status STARTED --actor manual:executor
 *   node portal/scripts/record-execution-receipt.mjs --motion motion-0068 --status COMPLETED --notes "Finished bounded artifact-only execution"
 *   node portal/scripts/record-execution-receipt.mjs --motion motion-0068 --status FAILED --error "validation mismatch"
 *   node portal/scripts/record-execution-receipt.mjs --motion motion-0068 --status REVERTED --revert-of motion-0068-receipt-001
 *
 * Exit codes:
 *   0 = OK
 *   1 = Validation / precondition failure
 *   2 = Unexpected error
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ALLOWED_STATUSES = new Set([
    "ACKNOWLEDGED",
    "STARTED",
    "COMPLETED",
    "BLOCKED",
    "FAILED",
    "REVERTED",
]);

function parseArgs(argv) {
    const args = {
        motion: null,
        status: null,
        actor: "manual:executor",
        notes: "",
        error: null,
        revertOf: null,
    };

    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];

        if (a === "--motion" && argv[i + 1]) {
            args.motion = argv[++i];
            continue;
        }
        if (a === "--status" && argv[i + 1]) {
            args.status = argv[++i];
            continue;
        }
        if (a === "--actor" && argv[i + 1]) {
            args.actor = argv[++i];
            continue;
        }
        if (a === "--notes" && argv[i + 1]) {
            args.notes = argv[++i];
            continue;
        }
        if (a === "--error" && argv[i + 1]) {
            args.error = argv[++i];
            continue;
        }
        if (a === "--revert-of" && argv[i + 1]) {
            args.revertOf = argv[++i];
            continue;
        }
    }

    return args;
}

function die(msg) {
    console.error(`\n[EXECUTION-RECEIPT] ERROR: ${msg}\n`);
    process.exit(1);
}

function ok(msg) {
    console.log(`[EXECUTION-RECEIPT] ${msg}`);
}

function exists(p) {
    return fs.existsSync(p);
}

function readJsonFile(p, label) {
    try {
        const raw = fs.readFileSync(p, "utf8");
        const obj = JSON.parse(raw);
        if (!obj || typeof obj !== "object") {
            die(`${label} root must be a JSON object.`);
        }
        return obj;
    } catch (err) {
        die(`Failed to parse ${label}: ${err?.message || String(err)}`);
    }
}

function readOptionalJsonFile(p) {
    try {
        if (!exists(p)) return null;
        const raw = fs.readFileSync(p, "utf8");
        const obj = JSON.parse(raw);
        return obj && typeof obj === "object" ? obj : null;
    } catch {
        return null;
    }
}

function stableJson(obj) {
    return JSON.stringify(obj, null, 2) + "\n";
}

function utcNow() {
    return new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z");
}

function findRepoRoot(startDir) {
    let cur = startDir;
    for (let i = 0; i < 8; i++) {
        const nexusDir = path.join(cur, ".nexus");
        if (exists(nexusDir)) return cur;
        const parent = path.dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return null;
}

(function main() {
    const args = parseArgs(process.argv);

    if (!args.motion) {
        die(
            `Missing --motion.\n` +
            `Usage: node portal/scripts/record-execution-receipt.mjs --motion motion-0068 --status ACKNOWLEDGED [--actor manual:executor] [--notes "..."]`
        );
    }

    if (!args.status) {
        die(
            `Missing --status.\n` +
            `Allowed: ${[...ALLOWED_STATUSES].join(", ")}`
        );
    }

    const status = String(args.status).trim().toUpperCase();
    if (!ALLOWED_STATUSES.has(status)) {
        die(`Invalid --status '${args.status}'. Allowed: ${[...ALLOWED_STATUSES].join(", ")}`);
    }

    try {
        const repoRoot = findRepoRoot(process.cwd());
        if (!repoRoot) {
            die(`Could not locate repo root (missing .nexus) from cwd: ${process.cwd()}`);
        }

        const motionId = String(args.motion).trim();
        const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
        const handoffPath = path.join(motionDir, "execution.handoff.json");
        const receiptPath = path.join(motionDir, "execution.receipt.json");
        const activationPath = path.join(motionDir, "execution.activation.json");

        if (!exists(motionDir)) {
            die(`Motion directory not found: .nexus/motions/${motionId}`);
        }
        if (!exists(handoffPath)) {
            die(
                `Missing execution handoff: .nexus/motions/${motionId}/execution.handoff.json\n` +
                `A receipt may only be recorded after handoff exists.`
            );
        }

        const handoff = readJsonFile(handoffPath, `${motionId}/execution.handoff.json`);
        const existing = exists(receiptPath)
            ? readJsonFile(receiptPath, `${motionId}/execution.receipt.json`)
            : null;
        const activation = readOptionalJsonFile(activationPath);
        const handoffCorpus = handoff.corpus_v2 && typeof handoff.corpus_v2 === "object" ? handoff.corpus_v2 : null;
        const activationCorpus =
            activation?.corpus_v2 && typeof activation.corpus_v2 === "object" ? activation.corpus_v2 : null;

        const now = utcNow();

        const receipt = {
            version: "0.1",
            motion_id: motionId,
            handoff_id: handoff.handoff_id,
            receipt_id: existing?.receipt_id || `${motionId}-receipt-001`,
            status,
            actor: String(args.actor).trim() || "manual:executor",
            acknowledged_at: existing?.acknowledged_at ?? null,
            started_at: existing?.started_at ?? null,
            finished_at: existing?.finished_at ?? null,
            error: args.error ? String(args.error) : (existing?.error ?? null),
            revert_of: args.revertOf ? String(args.revertOf) : (existing?.revert_of ?? null),
            notes: String(args.notes || "").trim(),
            corpus_v2: {
                cost_category:
                    handoffCorpus?.cost_category ??
                    activationCorpus?.cost_category ??
                    existing?.corpus_v2?.cost_category ??
                    null,
                cost_basis:
                    handoffCorpus?.cost_basis ??
                    activationCorpus?.cost_basis ??
                    existing?.corpus_v2?.cost_basis ??
                    null,
                tier_hint:
                    handoffCorpus?.tier_hint ??
                    activationCorpus?.tier_hint ??
                    existing?.corpus_v2?.tier_hint ??
                    null,
                requires_operator_escalation:
                    handoffCorpus?.requires_operator_escalation ??
                    activationCorpus?.requires_operator_escalation ??
                    existing?.corpus_v2?.requires_operator_escalation ??
                    false,
                activation_outcome:
                    handoffCorpus?.activation_outcome ??
                    activationCorpus?.outcome ??
                    existing?.corpus_v2?.activation_outcome ??
                    null,
                activation_recorded_at:
                    handoffCorpus?.activation_recorded_at ??
                    activation?.recorded_at ??
                    existing?.corpus_v2?.activation_recorded_at ??
                    null,
                activation_reasons:
                    handoffCorpus?.activation_reasons ??
                    activationCorpus?.reasons ??
                    existing?.corpus_v2?.activation_reasons ??
                    [],
            },
        };

        // Timestamp semantics
        if (
            ["ACKNOWLEDGED", "STARTED", "COMPLETED", "FAILED", "REVERTED", "BLOCKED"].includes(status) &&
            !receipt.acknowledged_at
        ) {
            receipt.acknowledged_at = now;
        }

        if (["STARTED", "COMPLETED"].includes(status) && !receipt.started_at) {
            receipt.started_at = now;
        }

        if (["COMPLETED", "FAILED", "REVERTED", "BLOCKED"].includes(status) && !receipt.finished_at) {
            receipt.finished_at = now;
        }

        fs.writeFileSync(receiptPath, stableJson(receipt), "utf8");

        ok(`Execution receipt recorded for ${motionId}`);
        ok(`Path: .nexus/motions/${motionId}/execution.receipt.json`);
        ok(`Receipt ID: ${receipt.receipt_id}`);
        ok(`Handoff ID: ${receipt.handoff_id}`);
        ok(`Status: ${status}`);
    } catch (err) {
        console.error("💥 Unexpected error while recording execution receipt");
        console.error(err?.stack || err?.message || String(err));
        process.exit(2);
    }
})();
