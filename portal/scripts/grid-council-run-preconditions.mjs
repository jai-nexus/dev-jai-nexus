#!/usr/bin/env node
/**
 * grid-council-run-preconditions.mjs (motion-0134 slice 1)
 *
 * Read-only precondition checker for the operator handoff from grid review
 * into the explicit council-run path.
 *
 * Usage:
 *   node portal/scripts/grid-council-run-preconditions.mjs --motion motion-0134
 *   node portal/scripts/grid-council-run-preconditions.mjs --motion motion-0134 --json
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const MOTION_ID_PATTERN = /^motion-\d{4}$/;
const BLOCKING_STATUSES = new Set(["ratified", "blocked", "rejected", "superseded", "closed"]);
const ALLOWED_PRE_COUNCIL_STATUSES = new Set(["proposed", "draft", "open"]);

function parseArgs(argv) {
    const args = {
        motion: null,
        json: false,
        help: false,
    };

    for (let i = 2; i < argv.length; i++) {
        const token = argv[i];
        if (token === "--motion" && argv[i + 1]) {
            args.motion = argv[++i];
            continue;
        }
        if (token === "--json") {
            args.json = true;
            continue;
        }
        if (token === "--help" || token === "-h") {
            args.help = true;
            continue;
        }
    }

    return args;
}

function printUsage() {
    console.log([
        "",
        "  grid-council-run-preconditions - read-only council-run handoff checker",
        "",
        "  Usage:",
        "    node portal/scripts/grid-council-run-preconditions.mjs --motion <motion-id>",
        "    node portal/scripts/grid-council-run-preconditions.mjs --motion <motion-id> --json",
        "",
        "  Options:",
        "    --motion <motion-id>  Motion directory name under .nexus/motions/",
        "    --json                Emit machine-readable JSON",
        "    --help                Show this message",
        "",
    ].join("\n"));
}

function extractYamlScalar(yamlText, key) {
    const match = yamlText.match(new RegExp(`^\\s*${key}:\\s*(.+)\\s*$`, "m"));
    return match ? match[1].trim().replace(/^"|"$/g, "") : null;
}

function normalizeStatus(status) {
    return typeof status === "string" ? status.trim().toLowerCase() : null;
}

function parseEmbeddedJson(stdout) {
    if (!stdout) return null;
    const startIndex = stdout.indexOf("{");
    const endIndex = stdout.lastIndexOf("}");
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) return null;
    const candidate = stdout.slice(startIndex, endIndex + 1);
    try {
        return JSON.parse(candidate);
    } catch {
        return null;
    }
}

function runPnpmGridReview(motionId) {
    if (process.platform === "win32") {
        return spawnSync("cmd.exe", ["/d", "/s", "/c", `pnpm grid:review --motion ${motionId} --json`], {
            cwd: process.cwd(),
            encoding: "utf8",
            stdio: "pipe",
        });
    }

    return spawnSync("pnpm", ["grid:review", "--motion", motionId, "--json"], {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: "pipe",
    });
}

function buildResult({ ready, verdict, failedCheck, checks, motionId, nextStep }) {
    return {
        ready,
        verdict,
        failed_check: failedCheck,
        motion_id: motionId,
        checks,
        next_step: nextStep,
    };
}

function printHumanResult(result) {
    console.log("");
    console.log(`Motion: ${result.motion_id}`);
    console.log("");

    for (const check of result.checks) {
        const icon = check.ok ? "[PASS]" : "[FAIL]";
        console.log(`${icon} ${check.name} - ${check.detail}`);
    }

    console.log("");
    console.log(`Final verdict: ${result.verdict}`);
    console.log(`Next step: ${result.next_step}`);
    console.log("");
}

function main() {
    const args = parseArgs(process.argv);
    if (args.help) {
        printUsage();
        process.exit(0);
    }

    if (!args.motion) {
        printUsage();
        console.error("Missing --motion <motion-id>.");
        process.exit(1);
    }

    if (!MOTION_ID_PATTERN.test(args.motion)) {
        console.error(`Invalid motion id: ${args.motion}`);
        process.exit(1);
    }

    const repoRoot = process.cwd();
    const motionRelDir = path.join(".nexus", "motions", args.motion);
    const motionDir = path.resolve(repoRoot, motionRelDir);
    const motionYamlPath = path.join(motionDir, "motion.yaml");
    const voteJsonPath = path.join(motionDir, "vote.json");

    const checks = [];
    let failedCheck = null;
    let nextStep = `Run pnpm council:run ${args.motion}`;

    const dirExists = fs.existsSync(motionDir) && fs.statSync(motionDir).isDirectory();
    checks.push({
        name: "DIR_EXISTS",
        ok: dirExists,
        detail: dirExists ? `found ${motionRelDir}` : `missing directory: ${motionRelDir}`,
    });
    if (!dirExists) {
        failedCheck = "DIR_EXISTS";
        nextStep = `Create or ingest ${args.motion} under ${motionRelDir} before retrying pnpm grid:preflight --motion ${args.motion}`;
    }

    let motionYamlText = "";

    if (!failedCheck) {
        const reviewResult = runPnpmGridReview(args.motion);
        const reviewOk = reviewResult.status === 0;
        const reviewParsed = parseEmbeddedJson(reviewResult.stdout?.trim() ?? "");

        let reviewDetail;
        if (reviewOk) {
            reviewDetail = "grid:review passed";
        } else if (reviewParsed?.verdict) {
            reviewDetail = `grid:review exited ${reviewResult.status ?? 1} — verdict=${reviewParsed.verdict}${reviewParsed.failed_check ? `, failed_check=${reviewParsed.failed_check}` : ""}`;
        } else {
            const raw = [reviewResult.stdout?.trim(), reviewResult.stderr?.trim()].filter(Boolean).join(" | ");
            reviewDetail = `grid:review exited ${reviewResult.status ?? 1}${raw ? ` — ${raw}` : ""}`;
        }

        checks.push({
            name: "REVIEW_READY",
            ok: reviewOk,
            detail: reviewDetail,
        });

        if (!reviewOk) {
            failedCheck = "REVIEW_READY";
            nextStep = `Fix the review failure, rerun pnpm grid:review --motion ${args.motion}, then rerun pnpm grid:preflight --motion ${args.motion}`;
        } else if (fs.existsSync(motionYamlPath)) {
            motionYamlText = fs.readFileSync(motionYamlPath, "utf8");
        }
    }

    if (!failedCheck) {
        const status = normalizeStatus(extractYamlScalar(motionYamlText, "status"));
        const statusKnown = status !== null;
        const statusReady = statusKnown && ALLOWED_PRE_COUNCIL_STATUSES.has(status);
        const statusBlocked = statusKnown && BLOCKING_STATUSES.has(status);
        const ok = statusReady && !statusBlocked;

        let detail = `status=${status ?? "(missing)"}`;
        if (!statusKnown) detail = "motion.yaml missing status field";
        else if (statusBlocked) detail = `status=${status} is beyond pre-council-run state`;
        else if (!statusReady) detail = `status=${status} is not an allowed pre-council-run state`;

        checks.push({
            name: "MOTION_STATUS_READY",
            ok,
            detail,
        });

        if (!ok) {
            failedCheck = "MOTION_STATUS_READY";
            nextStep = statusBlocked
                ? `Do not run pnpm council:run ${args.motion}; inspect ${motionRelDir}\\motion.yaml and existing governance artifacts first`
                : `Set ${motionRelDir}\\motion.yaml to a valid pre-council-run status and rerun pnpm grid:preflight --motion ${args.motion}`;
        }
    }

    if (!failedCheck) {
        const voteExists = fs.existsSync(voteJsonPath);
        const detail = voteExists
            ? `vote.json present - council-run will evaluate existing votes in ${motionRelDir}\\vote.json`
            : `vote.json absent - expected before ratification in unanimous_consent flow; prepare votes before or immediately after first council-run if repo policy requires it`;

        checks.push({
            name: "VOTE_ARTIFACT_STATE",
            ok: true,
            detail,
        });

        nextStep = voteExists
            ? `Run pnpm council:run ${args.motion}`
            : `If your operator flow requires votes first, create ${motionRelDir}\\vote.json; otherwise run pnpm council:run ${args.motion} and be prepared for a PENDING result until votes are added`;
    }

    checks.push({
        name: "NEXT_STEP_GUIDANCE",
        ok: !failedCheck,
        detail: nextStep,
    });

    const ready = !failedCheck;
    const result = buildResult({
        ready,
        verdict: ready ? "READY_TO_INVOKE_COUNCIL_RUN" : `BLOCKED_PRECONDITION(${failedCheck})`,
        failedCheck,
        checks,
        motionId: args.motion,
        nextStep,
    });

    if (args.json) {
        process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    } else {
        printHumanResult(result);
    }

    process.exit(ready ? 0 : 1);
}

main();
