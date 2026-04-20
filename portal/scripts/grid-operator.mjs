#!/usr/bin/env node
/**
 * grid-operator.mjs (motion-0138 slice 1)
 *
 * Read-only operator cockpit that composes vote-prep, preflight, launch, and
 * execution visibility into a single progression surface. Does not invoke
 * council-run; shows the explicit boundary and exits with guidance.
 *
 * Usage:
 *   node portal/scripts/grid-operator.mjs --motion motion-0138
 *   node portal/scripts/grid-operator.mjs --motion motion-0138 --json
 */

import process from "node:process";
import { spawnSync } from "node:child_process";

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
        "  grid-operator - read-only operator progression cockpit",
        "",
        "  Usage:",
        "    node portal/scripts/grid-operator.mjs --motion <motion-id>",
        "    node portal/scripts/grid-operator.mjs --motion <motion-id> --json",
        "",
        "  Options:",
        "    --motion <motion-id>  Motion directory name under .nexus/motions/",
        "    --json                Emit machine-readable JSON",
        "    --help                Show this message",
        "",
        "  Cockpit states:",
        "    READY      - all pre-council gates pass; invoke council-run explicitly",
        "    BLOCKED    - one or more stages have a hard blocking condition",
        "    INCOMPLETE - stages are in progress or not yet started",
        "    EXECUTED   - motion has been ratified",
        "    UNKNOWN    - one or more probes returned no readable output",
        "",
    ].join("\n"));
}

// --- probe helpers (inlined from grid-launch.mjs) ---

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

// --- stage normalizers ---
// Each returns: { state: BLOCKED|INCOMPLETE|READY|EXECUTED|UNKNOWN, detail, next_step }

function normalizeVotePrepProbe(probe) {
    if (!probe.parsed) {
        return {
            state: "UNKNOWN",
            detail: probe.stderr || "no JSON output from grid:vote-prep",
            next_step: null,
        };
    }

    const { outcome, failed_check, next_step } = probe.parsed;

    if (outcome === "VOTE_READY") {
        if (probe.status !== 0) {
            return { state: "UNKNOWN", detail: `grid:vote-prep: outcome=VOTE_READY but exited ${probe.status}`, next_step: null };
        }
        return { state: "READY", detail: "vote.json valid and all roles present", next_step: next_step ?? null };
    }
    if (typeof outcome === "string" && outcome.startsWith("BLOCKED_")) {
        return { state: "BLOCKED", detail: failed_check ?? outcome, next_step: next_step ?? null };
    }

    return { state: "INCOMPLETE", detail: `outcome=${outcome ?? "(missing)"}`, next_step: next_step ?? null };
}

function normalizePreflightProbe(probe) {
    if (!probe.parsed) {
        return {
            state: "UNKNOWN",
            detail: probe.stderr || "no JSON output from grid:preflight",
            next_step: null,
        };
    }

    const { verdict, failed_check, next_step } = probe.parsed;

    if (verdict === "READY_TO_INVOKE_COUNCIL_RUN") {
        if (probe.status !== 0) {
            return { state: "UNKNOWN", detail: `grid:preflight: verdict=READY_TO_INVOKE_COUNCIL_RUN but exited ${probe.status}`, next_step: null };
        }
        return { state: "READY", detail: "council-run preconditions met", next_step: next_step ?? null };
    }
    if (typeof verdict === "string" && verdict.startsWith("BLOCKED_")) {
        return { state: "BLOCKED", detail: failed_check ?? verdict, next_step: next_step ?? null };
    }

    return { state: "UNKNOWN", detail: `verdict=${verdict ?? "(missing)"}`, next_step: next_step ?? null };
}

function normalizeLaunchProbe(probe) {
    if (!probe.parsed) {
        return {
            state: "UNKNOWN",
            detail: probe.stderr || "no JSON output from grid:launch",
            next_step: null,
        };
    }

    const { outcome, failed_check, next_step } = probe.parsed;

    if (outcome === "LAUNCH_READY") {
        if (probe.status !== 0) {
            return { state: "UNKNOWN", detail: `grid:launch: outcome=LAUNCH_READY but exited ${probe.status}`, next_step: null };
        }
        return { state: "READY", detail: "review, preflight, and vote-prep all pass", next_step: next_step ?? null };
    }
    if (typeof outcome === "string" && outcome.startsWith("BLOCKED_")) {
        return { state: "BLOCKED", detail: failed_check ?? outcome, next_step: next_step ?? null };
    }

    return { state: "INCOMPLETE", detail: `outcome=${outcome ?? "(missing)"}`, next_step: next_step ?? null };
}

function normalizeStatusProbe(probe) {
    if (!probe.parsed) {
        return {
            state: "UNKNOWN",
            detail: probe.stderr || "no JSON output from grid:status",
            next_step: null,
        };
    }

    const { execution_state, next_step } = probe.parsed;

    if (execution_state === "EXECUTION_RATIFIED") {
        if (probe.status !== 0) {
            return { state: "UNKNOWN", detail: `grid:status: execution_state=EXECUTION_RATIFIED but exited ${probe.status}`, next_step: null };
        }
        return { state: "EXECUTED", detail: "motion ratified", next_step: next_step ?? null };
    }
    if (execution_state === "EXECUTION_BLOCKED" || execution_state === "WRONG_STATE") {
        return { state: "BLOCKED", detail: `execution_state=${execution_state}`, next_step: next_step ?? null };
    }
    if (
        execution_state === "EXECUTION_NOT_STARTED" ||
        execution_state === "EXECUTION_PENDING" ||
        execution_state === "EXECUTION_DRAFT"
    ) {
        return { state: "INCOMPLETE", detail: `execution_state=${execution_state}`, next_step: next_step ?? null };
    }

    return { state: "UNKNOWN", detail: `execution_state=${execution_state ?? "(missing)"}`, next_step: next_step ?? null };
}

// --- cockpit composer ---

function computeCockpitState(stages) {
    const { vote_prep, preflight, launch, status } = stages;

    if (status.state === "EXECUTED") return "EXECUTED";

    const stateValues = [vote_prep.state, preflight.state, launch.state, status.state];

    if (stateValues.includes("UNKNOWN")) return "UNKNOWN";
    if (stateValues.includes("BLOCKED")) return "BLOCKED";

    if (vote_prep.state === "READY" && preflight.state === "READY" && launch.state === "READY") {
        return "READY";
    }

    return "INCOMPLETE";
}

function resolveNextStep(cockpitState, motionId, stages) {
    if (cockpitState === "EXECUTED") {
        return `Motion ${motionId} is ratified. No further governance action required.`;
    }
    if (cockpitState === "READY") {
        return `Run pnpm council:run ${motionId}`;
    }

    const stageOrder = ["vote_prep", "preflight", "launch", "status"];

    if (cockpitState === "BLOCKED" || cockpitState === "UNKNOWN") {
        for (const key of stageOrder) {
            if (stages[key].state === cockpitState && stages[key].next_step) {
                return stages[key].next_step;
            }
        }
        return cockpitState === "BLOCKED"
            ? `Resolve blocked stage(s), then rerun pnpm grid:operator --motion ${motionId}`
            : `One or more probes returned no readable output. Check pnpm grid:vote-prep, grid:preflight, grid:launch, grid:status individually for ${motionId}`;
    }

    // INCOMPLETE — surface the first non-ready, non-executed stage's next_step
    for (const key of stageOrder) {
        const s = stages[key];
        if (s.state !== "READY" && s.state !== "EXECUTED" && s.next_step) {
            return s.next_step;
        }
    }

    return `Resolve incomplete stage(s), then rerun pnpm grid:operator --motion ${motionId}`;
}

function buildCockpitResult(motionId, cockpitState, stages) {
    const councilRunReady = cockpitState === "READY";
    return {
        motion_id: motionId,
        cockpit_state: cockpitState,
        council_run_ready: councilRunReady,
        council_run_command: councilRunReady ? `pnpm council:run ${motionId}` : null,
        stages,
        next_step: resolveNextStep(cockpitState, motionId, stages),
    };
}

// --- formatters ---

function stageRow(label, stage) {
    return `  ${label.padEnd(10)} [${stage.state}]  ${stage.detail}`;
}

function printHumanResult(result) {
    console.log("");
    console.log(`Motion:        ${result.motion_id}`);
    console.log(`Cockpit state: ${result.cockpit_state}`);
    console.log("");
    console.log(stageRow("vote-prep", result.stages.vote_prep));
    console.log(stageRow("preflight", result.stages.preflight));
    console.log(stageRow("launch", result.stages.launch));
    console.log(stageRow("status", result.stages.status));
    console.log("");
    if (result.council_run_ready) {
        console.log(`  Council-run boundary --> ${result.council_run_command}`);
        console.log("");
    }
    console.log(`Next step: ${result.next_step}`);
    console.log("");
}

function printJsonResult(result) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

// --- main ---

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

    const motionId = args.motion;

    const votePrepProbe  = runJsonProbe(`pnpm grid:vote-prep --motion ${motionId} --json`);
    const preflightProbe = runJsonProbe(`pnpm grid:preflight --motion ${motionId} --json`);
    const launchProbe    = runJsonProbe(`pnpm grid:launch --motion ${motionId} --json`);
    const statusProbe    = runJsonProbe(`pnpm grid:status --motion ${motionId} --json`);

    const stages = {
        vote_prep: normalizeVotePrepProbe(votePrepProbe),
        preflight: normalizePreflightProbe(preflightProbe),
        launch:    normalizeLaunchProbe(launchProbe),
        status:    normalizeStatusProbe(statusProbe),
    };

    const cockpitState = computeCockpitState(stages);
    const result = buildCockpitResult(motionId, cockpitState, stages);

    if (args.json) {
        printJsonResult(result);
    } else {
        printHumanResult(result);
    }

    process.exit(cockpitState === "EXECUTED" || cockpitState === "READY" ? 0 : 1);
}

main();
