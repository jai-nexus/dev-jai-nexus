#!/usr/bin/env node
/**
 * issue-execution-handoff.mjs
 *
 * Create a durable execution handoff artifact for a RATIFIED motion.
 *
 * Purpose:
 * - Ratification authorizes a bounded next step.
 * - Ratification does NOT imply execution completion.
 * - This script records the governance-to-execution handoff explicitly.
 *
 * Usage:
 *   node portal/scripts/issue-execution-handoff.mjs --motion motion-0069
 *   node portal/scripts/issue-execution-handoff.mjs --motion motion-0069 --issued-by manual:operator
 *   node portal/scripts/issue-execution-handoff.mjs --motion motion-0069 --issued-by manual:operator --notes "Initial bounded handoff"
 *
 * Exit codes:
 *   0 = OK
 *   1 = Validation / precondition failure
 *   2 = Unexpected error
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import yaml from "js-yaml";

// --------------------------------------------------
// args
// --------------------------------------------------

function parseArgs(argv) {
    const args = {
        motion: null,
        issuedBy: "manual:operator",
        notes: "Ratification authorizes handoff only. No execution completion implied.",
    };

    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];

        if (a === "--motion" && argv[i + 1]) {
            args.motion = argv[++i];
            continue;
        }
        if (a === "--issued-by" && argv[i + 1]) {
            args.issuedBy = argv[++i];
            continue;
        }
        if (a === "--notes" && argv[i + 1]) {
            args.notes = argv[++i];
            continue;
        }
    }

    return args;
}

// --------------------------------------------------
// helpers
// --------------------------------------------------

function die(msg) {
    console.error(`\n[EXECUTION-HANDOFF] ERROR: ${msg}\n`);
    process.exit(1);
}

function ok(msg) {
    console.log(`[EXECUTION-HANDOFF] ${msg}`);
}

function exists(p) {
    return fs.existsSync(p);
}

function readText(p) {
    return fs.readFileSync(p, "utf8");
}

function readYamlFile(p, label) {
    try {
        const obj = yaml.load(readText(p));
        if (!obj || typeof obj !== "object") {
            die(`${label} root must be a YAML mapping/object.`);
        }
        return obj;
    } catch (err) {
        die(`Failed to parse ${label}: ${err?.message || String(err)}`);
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

function rel(repoRoot, p) {
    return path.relative(repoRoot, p).split(path.sep).join("/");
}

function firstNonEmpty(...values) {
    for (const v of values) {
        if (typeof v === "string" && v.trim().length > 0) return v.trim();
    }
    return null;
}

function parseCorpusCostEstimate(executionMdText) {
    const categoryMatch = executionMdText.match(/^Category:\s*\[?\s*(minimal|standard|substantial|major)\s*\]?/im);
    const basisMatch = executionMdText.match(/^Basis:\s*(.+)$/im);
    return {
        category: categoryMatch ? categoryMatch[1].toLowerCase() : null,
        basis: basisMatch ? basisMatch[1].trim() : null,
    };
}

function deriveCorpusTierHint(category) {
    if (category === "minimal" || category === "standard") return "tier1";
    if (category === "substantial" || category === "major") return "tier2";
    return null;
}

// --------------------------------------------------
// main
// --------------------------------------------------

(function main() {
    const args = parseArgs(process.argv);

    if (!args.motion) {
        die(
            `Missing --motion.\n` +
            `Usage: node portal/scripts/issue-execution-handoff.mjs --motion motion-0069 [--issued-by manual:operator] [--notes "..."]`
        );
    }

    try {
        const repoRoot = findRepoRoot(process.cwd());
        if (!repoRoot) {
            die(`Could not locate repo root (missing .nexus) from cwd: ${process.cwd()}`);
        }

        const motionId = String(args.motion).trim();
        const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
        const motionYamlPath = path.join(motionDir, "motion.yaml");
        const decisionYamlPath = path.join(motionDir, "decision.yaml");
        const verifyJsonPath = path.join(motionDir, "verify.json");
        const executionMdPath = path.join(motionDir, "execution.md");
        const handoffPath = path.join(motionDir, "execution.handoff.json");

        if (!exists(motionDir)) {
            die(`Motion directory not found: .nexus/motions/${motionId}`);
        }
        if (!exists(motionYamlPath)) {
            die(`Missing motion spec: .nexus/motions/${motionId}/motion.yaml`);
        }
        if (!exists(decisionYamlPath)) {
            die(`Missing decision artifact: .nexus/motions/${motionId}/decision.yaml`);
        }
        if (!exists(verifyJsonPath)) {
            die(`Missing verify artifact: .nexus/motions/${motionId}/verify.json`);
        }
        if (exists(handoffPath)) {
            die(`Execution handoff already exists: .nexus/motions/${motionId}/execution.handoff.json`);
        }

        const motionObj = readYamlFile(motionYamlPath, `${motionId}/motion.yaml`);
        const decisionObj = readYamlFile(decisionYamlPath, `${motionId}/decision.yaml`);

        const decisionStatus = firstNonEmpty(decisionObj.status);
        if (decisionStatus !== "RATIFIED") {
            die(
                `Motion ${motionId} is not RATIFIED.\n` +
                `Current decision status: ${decisionStatus ?? "(missing)"}\n` +
                `Execution handoff may only be issued for a RATIFIED motion.`
            );
        }

        const targetDomain = firstNonEmpty(
            decisionObj.target_domain,
            motionObj?.target?.domain
        );
        const targetRepo = firstNonEmpty(
            decisionObj.target_repo,
            motionObj?.target?.repo
        );

        const handoffId = `${motionId}-handoff-001`;
        const executionPlanText = exists(executionMdPath) ? readText(executionMdPath) : "";
        const costEstimate = parseCorpusCostEstimate(executionPlanText);

        const artifact = {
            version: "0.1",
            motion_id: motionId,
            handoff_id: handoffId,
            issued_at: utcNow(),
            issued_by: String(args.issuedBy).trim() || "manual:operator",
            decision_status: "RATIFIED",
            target_domain: targetDomain,
            target_repo: targetRepo,
            scope: {
                kind: "repo_local",
                mode: "bounded",
                execution_class: "artifact_only",
            },
            inputs: {
                motion: rel(repoRoot, motionYamlPath),
                execution_plan: exists(executionMdPath) ? rel(repoRoot, executionMdPath) : null,
                decision: rel(repoRoot, decisionYamlPath),
                verify: rel(repoRoot, verifyJsonPath),
            },
            corpus_v2: {
                cost_category: costEstimate.category,
                cost_basis: costEstimate.basis,
                tier_hint: deriveCorpusTierHint(costEstimate.category),
                requires_operator_escalation:
                    costEstimate.category === "substantial" || costEstimate.category === "major",
                activation_outcome: null,
                activation_recorded_at: null,
                activation_artifact: null,
                activation_reasons: [],
            },
            status: "ISSUED",
            notes:
                String(args.notes).trim() ||
                "Ratification authorizes handoff only. No execution completion implied.",
        };

        fs.writeFileSync(handoffPath, stableJson(artifact), "utf8");

        ok(`Execution handoff issued for ${motionId}`);
        ok(`Path: .nexus/motions/${motionId}/execution.handoff.json`);
        ok(`Handoff ID: ${handoffId}`);
        ok(`Target: domain=${targetDomain ?? "(none)"} repo=${targetRepo ?? "(none)"}`);
        ok(`Status: ISSUED`);
    } catch (err) {
        console.error("💥 Unexpected error while issuing execution handoff");
        console.error(err?.stack || err?.message || String(err));
        process.exit(2);
    }
})();
