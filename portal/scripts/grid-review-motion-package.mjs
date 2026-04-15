#!/usr/bin/env node
/**
 * grid-review-motion-package.mjs (motion-0133 slice 1)
 *
 * Read-only preflight review for a motion package created by grid-ingest.
 *
 * Usage:
 *   node portal/scripts/grid-review-motion-package.mjs --motion motion-0133
 *   node portal/scripts/grid-review-motion-package.mjs --motion motion-0133 --json
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const REQUIRED_FILES = ["motion.yaml", "proposal.md", "execution.md", "challenge.md"];
const MOTION_ID_PATTERN = /^motion-\d{4}$/;

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
        "  grid-review-motion-package - read-only motion package readiness review",
        "",
        "  Usage:",
        "    node portal/scripts/grid-review-motion-package.mjs --motion <motion-id>",
        "    node portal/scripts/grid-review-motion-package.mjs --motion <motion-id> --json",
        "",
        "  Options:",
        "    --motion <motion-id>  Motion directory name under .nexus/motions/",
        "    --json                Emit machine-readable JSON",
        "    --help                Show this message",
        "",
    ].join("\n"));
}

function extractMotionId(motionYamlText) {
    const match = motionYamlText.match(/^motion_id:\s*([^\s#]+)/m);
    return match ? match[1].trim() : null;
}

function runNodeScript(scriptPath, args) {
    return spawnSync(process.execPath, [scriptPath, ...args], {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: "pipe",
    });
}

function runGitStatus(targetRelPath) {
    return spawnSync("git", ["status", "--short", "--", targetRelPath], {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: "pipe",
    });
}

function classifyGitState(statusOutput) {
    const lines = statusOutput
        .split(/\r?\n/)
        .map((line) => line.trimEnd())
        .filter(Boolean);

    if (lines.length === 0) return "clean";

    let hasStaged = false;
    let hasUnstaged = false;
    let hasUntracked = false;

    for (const line of lines) {
        const indexStatus = line[0] ?? " ";
        const worktreeStatus = line[1] ?? " ";

        if (line.startsWith("??")) {
            hasUntracked = true;
            continue;
        }
        if (indexStatus !== " ") hasStaged = true;
        if (worktreeStatus !== " ") hasUnstaged = true;
    }

    const labels = [];
    if (hasStaged) labels.push("staged");
    if (hasUnstaged) labels.push("unstaged");
    if (hasUntracked) labels.push("untracked");
    return labels.join("+");
}

function buildResult({ ready, verdict, failedCheck, checks, motionId, motionDir }) {
    return {
        ready,
        verdict,
        failed_check: failedCheck,
        motion_id: motionId,
        motion_dir: motionDir,
        checks,
    };
}

function printHumanResult(result) {
    console.log("");
    console.log(`Motion: ${result.motion_id}`);
    console.log(`Path:   ${result.motion_dir}`);
    console.log("");

    for (const check of result.checks) {
        const icon = check.ok ? "[PASS]" : "[FAIL]";
        console.log(`${icon} ${check.name} - ${check.detail}`);
    }

    console.log("");
    if (result.ready) {
        console.log(`Final verdict: ${result.verdict}`);
        console.log(`Next step: pnpm council:run ${result.motion_id}`);
    } else {
        const suffix = result.failed_check ? ` (${result.failed_check})` : "";
        console.log(`Final verdict: ${result.verdict}${suffix}`);
    }
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
    const validateMotionPath = path.resolve(repoRoot, "portal", "scripts", "validate-motion.mjs");

    const checks = [];
    let failedCheck = null;

    const dirExists = fs.existsSync(motionDir) && fs.statSync(motionDir).isDirectory();
    checks.push({
        name: "DIR_EXISTS",
        ok: dirExists,
        detail: dirExists ? motionRelDir : `missing directory: ${motionRelDir}`,
    });
    if (!dirExists) failedCheck = "DIR_EXISTS";

    let filesPresent = false;
    let motionYamlText = "";

    if (!failedCheck) {
        const missingFiles = REQUIRED_FILES.filter((filename) => !fs.existsSync(path.join(motionDir, filename)));
        filesPresent = missingFiles.length === 0;
        checks.push({
            name: "FILES_PRESENT",
            ok: filesPresent,
            detail: filesPresent
                ? `found ${REQUIRED_FILES.join(", ")}`
                : `missing ${missingFiles.join(", ")}`,
        });
        if (!filesPresent) {
            failedCheck = "FILES_PRESENT";
        } else {
            motionYamlText = fs.readFileSync(motionYamlPath, "utf8");
        }
    }

    if (!failedCheck) {
        const declaredMotionId = extractMotionId(motionYamlText);
        const idConsistent = declaredMotionId === args.motion;
        checks.push({
            name: "ID_CONSISTENT",
            ok: idConsistent,
            detail: idConsistent
                ? `motion_id matches directory (${args.motion})`
                : `motion.yaml=${declaredMotionId ?? "(missing)"} directory=${args.motion}`,
        });
        if (!idConsistent) failedCheck = "ID_CONSISTENT";
    }

    if (!failedCheck) {
        const validateResult = runNodeScript(validateMotionPath, ["--motion", motionYamlPath]);
        const validateOk = validateResult.status === 0;
        const validateOutput = [validateResult.stdout?.trim(), validateResult.stderr?.trim()]
            .filter(Boolean)
            .join(" | ");

        checks.push({
            name: "VALIDATE_MOTION",
            ok: validateOk,
            detail: validateOk
                ? `exit 0${validateOutput ? ` - ${validateOutput}` : ""}`
                : `exit ${validateResult.status ?? 1}${validateOutput ? ` - ${validateOutput}` : ""}`,
        });
        if (!validateOk) failedCheck = "VALIDATE_MOTION";
    }

    const gitResult = runGitStatus(motionRelDir);
    const gitOutput = [gitResult.stdout?.trim(), gitResult.stderr?.trim()].filter(Boolean).join(" | ");
    const gitOk = gitResult.status === 0;
    const gitState = gitOk ? classifyGitState(gitResult.stdout ?? "") : "git_error";
    const gitDetail = gitOk
        ? `${gitState}${gitOutput ? ` - ${gitOutput}` : ""}`
        : `exit ${gitResult.status ?? 1}${gitOutput ? ` - ${gitOutput}` : ""}`;

    checks.push({
        name: "GIT_STATE",
        ok: gitOk,
        detail: gitDetail,
        informational: true,
    });

    const ready = !failedCheck;
    const result = buildResult({
        ready,
        verdict: ready ? "READY_FOR_COUNCIL_RUN" : "NOT_READY",
        failedCheck,
        checks,
        motionId: args.motion,
        motionDir: motionRelDir,
    });

    if (args.json) {
        process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    } else {
        printHumanResult(result);
    }

    process.exit(ready ? 0 : 1);
}

main();
