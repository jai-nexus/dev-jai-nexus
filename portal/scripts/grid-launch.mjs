#!/usr/bin/env node
/**
 * grid-launch.mjs (motion-0136 slice 1)
 *
 * Read-only launch handoff checker that consolidates review, preflight, and
 * vote-prep readiness before the operator explicitly invokes council-run.
 *
 * Usage:
 *   node portal/scripts/grid-launch.mjs --motion motion-0136
 *   node portal/scripts/grid-launch.mjs --motion motion-0136 --json
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const MOTION_ID_PATTERN = /^motion-\d{4}$/;
const ALLOWED_PRE_COUNCIL_STATUSES = new Set(["proposed", "draft", "open"]);
const ALREADY_RATIFIED_STATUSES = new Set(["ratified", "blocked", "rejected", "superseded", "closed"]);

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
        "  grid-launch - read-only launch handoff checker before council-run",
        "",
        "  Usage:",
        "    node portal/scripts/grid-launch.mjs --motion <motion-id>",
        "    node portal/scripts/grid-launch.mjs --motion <motion-id> --json",
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

function runPnpmCommand(command) {
    if (process.platform === "win32") {
        return spawnSync("cmd.exe", ["/d", "/s", "/c", command], {
            cwd: process.cwd(),
            encoding: "utf8",
            stdio: "pipe",
        });
    }

    const segments = command.split(" ");
    return spawnSync(segments[0], segments.slice(1), {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: "pipe",
    });
}

function runJsonProbe(command) {
    const result = runPnpmCommand(command);
    const stdout = result.stdout?.trim() ?? "";
    const stderr = result.stderr?.trim() ?? "";

    const parsed = parseEmbeddedJson(stdout);

    return {
        status: result.status ?? 1,
        stdout,
        stderr,
        parsed,
    };
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

function summarizeProbeOutput(probe) {
    const parts = [];

    if (probe.parsed?.verdict) parts.push(`verdict=${probe.parsed.verdict}`);
    if (probe.parsed?.outcome) parts.push(`outcome=${probe.parsed.outcome}`);
    if (probe.parsed?.failed_check) parts.push(`failed_check=${probe.parsed.failed_check}`);
    if (probe.parsed?.next_step) parts.push(`next_step=${probe.parsed.next_step}`);
    if (!probe.parsed && probe.stdout) parts.push(probe.stdout);
    if (probe.stderr) parts.push(`stderr=${probe.stderr}`);

    return parts.join(" | ");
}

function buildResult({ motionId, outcome, ready, failedCheck, checks, nextStep }) {
    return {
        motion_id: motionId,
        outcome,
        ready,
        failed_check: failedCheck,
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
    console.log(`Outcome: ${result.outcome}`);
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

    const checks = [];
    let outcome = "LAUNCH_READY";
    let failedCheck = null;
    let nextStep = `Run pnpm council:run ${args.motion}`;

    const dirExists = fs.existsSync(motionDir) && fs.statSync(motionDir).isDirectory();
    checks.push({
        name: "DIR_EXISTS",
        ok: dirExists,
        detail: dirExists ? `found ${motionRelDir}` : `missing directory: ${motionRelDir}`,
    });

    if (!dirExists) {
        outcome = "BLOCKED_WRONG_STATE";
        failedCheck = "DIR_EXISTS";
        nextStep = `Create or ingest ${args.motion} under ${motionRelDir} before rerunning pnpm grid:launch --motion ${args.motion}`;
    }

    if (!failedCheck) {
        if (!fs.existsSync(motionYamlPath)) {
            checks.push({
                name: "MOTION_STATE",
                ok: false,
                detail: `missing ${motionRelDir}\\motion.yaml`,
            });
            outcome = "BLOCKED_WRONG_STATE";
            failedCheck = "MOTION_STATE";
            nextStep = `Add ${motionRelDir}\\motion.yaml with a valid pre-council status before rerunning pnpm grid:launch --motion ${args.motion}`;
        } else {
            const motionYamlText = fs.readFileSync(motionYamlPath, "utf8");
            const status = normalizeStatus(extractYamlScalar(motionYamlText, "status"));
            const alreadyRatified = status !== null && ALREADY_RATIFIED_STATUSES.has(status);
            const validPreCouncil = status !== null && ALLOWED_PRE_COUNCIL_STATUSES.has(status);

            let detail = `status=${status ?? "(missing)"}`;
            if (alreadyRatified) detail = `status=${status} is already beyond launch state`;
            else if (!validPreCouncil) detail = `status=${status ?? "(missing)"} is not a valid pre-council state`;

            checks.push({
                name: "MOTION_STATE",
                ok: validPreCouncil && !alreadyRatified,
                detail,
            });

            if (alreadyRatified) {
                outcome = "BLOCKED_ALREADY_RATIFIED";
                failedCheck = "MOTION_STATE";
                nextStep = `Do not run pnpm council:run ${args.motion}; inspect existing governance artifacts in ${motionRelDir}`;
            } else if (!validPreCouncil) {
                outcome = "BLOCKED_WRONG_STATE";
                failedCheck = "MOTION_STATE";
                nextStep = `Set ${motionRelDir}\\motion.yaml to a valid pre-council state before rerunning pnpm grid:launch --motion ${args.motion}`;
            }
        }
    }

    if (!failedCheck) {
        const reviewProbe = runJsonProbe(`pnpm grid:review --motion ${args.motion} --json`);
        const reviewVerdict = reviewProbe.parsed?.verdict;
        const reviewOk = reviewProbe.status === 0 && reviewVerdict === "READY_FOR_COUNCIL_RUN";

        checks.push({
            name: "REVIEW_READY",
            ok: reviewOk,
            detail: reviewOk
                ? "grid:review returned READY_FOR_COUNCIL_RUN"
                : summarizeProbeOutput(reviewProbe) || `grid:review exited ${reviewProbe.status}`,
        });

        if (!reviewOk) {
            outcome = "BLOCKED_REVIEW_FAILED";
            failedCheck = "REVIEW_READY";
            nextStep = `Fix and rerun pnpm grid:review --motion ${args.motion}, then rerun pnpm grid:launch --motion ${args.motion}`;
        }
    }

    if (!failedCheck) {
        const preflightProbe = runJsonProbe(`pnpm grid:preflight --motion ${args.motion} --json`);
        const preflightVerdict = preflightProbe.parsed?.verdict;
        const preflightOk = preflightProbe.status === 0 && preflightVerdict === "READY_TO_INVOKE_COUNCIL_RUN";

        checks.push({
            name: "PREFLIGHT_READY",
            ok: preflightOk,
            detail: preflightOk
                ? "grid:preflight returned READY_TO_INVOKE_COUNCIL_RUN"
                : summarizeProbeOutput(preflightProbe) || `grid:preflight exited ${preflightProbe.status}`,
        });

        if (!preflightOk) {
            outcome = "BLOCKED_PREFLIGHT_FAILED";
            failedCheck = "PREFLIGHT_READY";
            nextStep = `Fix and rerun pnpm grid:preflight --motion ${args.motion}, then rerun pnpm grid:launch --motion ${args.motion}`;
        }
    }

    if (!failedCheck) {
        const voteProbe = runJsonProbe(`pnpm grid:vote-prep --motion ${args.motion} --json`);
        const voteOutcome = voteProbe.parsed?.outcome;
        const voteOk = voteProbe.status === 0 && voteOutcome === "VOTE_READY";

        checks.push({
            name: "VOTE_READY",
            ok: voteOk,
            detail: voteOk
                ? "grid:vote-prep returned VOTE_READY"
                : summarizeProbeOutput(voteProbe) || `grid:vote-prep exited ${voteProbe.status}`,
        });

        if (!voteOk) {
            outcome = "BLOCKED_VOTE_NOT_READY";
            failedCheck = "VOTE_READY";
            nextStep = voteProbe.parsed?.next_step
                ? `${voteProbe.parsed.next_step}; rerun pnpm grid:launch --motion ${args.motion} afterwards`
                : `Fix and rerun pnpm grid:vote-prep --motion ${args.motion}, then rerun pnpm grid:launch --motion ${args.motion}`;
        }
    }

    const ready = outcome === "LAUNCH_READY";
    const result = buildResult({
        motionId: args.motion,
        outcome,
        ready,
        failedCheck,
        checks,
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
