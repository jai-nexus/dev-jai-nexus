#!/usr/bin/env node
/**
 * grid-status.mjs (motion-0137 slice 1)
 *
 * Read-only governance execution visibility checker.
 *
 * Usage:
 *   node portal/scripts/grid-status.mjs --motion motion-0137
 *   node portal/scripts/grid-status.mjs --motion motion-0137 --json
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import yaml from "js-yaml";

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
        "  grid-status - read-only governance execution visibility checker",
        "",
        "  Usage:",
        "    node portal/scripts/grid-status.mjs --motion <motion-id>",
        "    node portal/scripts/grid-status.mjs --motion <motion-id> --json",
        "",
        "  Options:",
        "    --motion <motion-id>  Motion directory name under .nexus/motions/",
        "    --json                Emit machine-readable JSON",
        "    --help                Show this message",
        "",
    ].join("\n"));
}

function readYamlFile(filePath) {
    return yaml.load(fs.readFileSync(filePath, "utf8"));
}

function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function summarizeDecision(decision) {
    if (!decision) return null;

    return {
        status: typeof decision.status === "string" ? decision.status : null,
        ratified_by: typeof decision.ratified_by === "string" ? decision.ratified_by : null,
        notes: typeof decision.notes === "string" ? decision.notes : null,
        last_updated: typeof decision.last_updated === "string" ? decision.last_updated : null,
    };
}

function summarizeGates(verify) {
    if (!verify?.latest || typeof verify.latest !== "object") return null;

    const gateEntries = Object.values(verify.latest).filter((value) => value && typeof value === "object");
    const total = gateEntries.length;
    const passing = gateEntries.filter((entry) => entry.ok === true).length;
    const failing = gateEntries.filter((entry) => entry.ok === false).length;
    const requiredOk = verify?.summary?.required_ok === true;

    return {
        total,
        passing,
        failing,
        required_ok: requiredOk,
        gates: gateEntries.map((entry) => ({
            gate: entry.gate ?? null,
            ok: entry.ok === true,
            status: entry.status ?? null,
        })),
    };
}

function summarizeVote(vote) {
    if (!vote || typeof vote !== "object") return null;

    const votes = Array.isArray(vote.votes) ? vote.votes : [];
    const outcome = vote.outcome && typeof vote.outcome === "object" ? vote.outcome : null;
    const missingRequiredRoles = Array.isArray(outcome?.missing_required_roles) ? outcome.missing_required_roles : [];
    const emptyVotes = votes
        .filter((entry) => entry && typeof entry === "object" && typeof entry.vote === "string" && entry.vote.trim().length === 0)
        .map((entry) => entry.role);

    return {
        vote_mode: typeof vote.vote_mode === "string" ? vote.vote_mode : null,
        required_roles: Array.isArray(vote.required_roles) ? vote.required_roles : [],
        filled_votes: votes.filter((entry) => entry?.vote && String(entry.vote).trim().length > 0).length,
        total_votes: votes.length,
        outcome: outcome
            ? {
                result: typeof outcome.result === "string" ? outcome.result : null,
                yes: outcome.yes ?? 0,
                no: outcome.no ?? 0,
                abstain: outcome.abstain ?? 0,
                yes_with_reservations: outcome.yes_with_reservations ?? 0,
                missing_required_roles: missingRequiredRoles,
            }
            : null,
        empty_votes: emptyVotes,
    };
}

function summarizePolicy(policy) {
    if (!policy) return null;

    return {
        vote_mode: typeof policy.vote_mode === "string" ? policy.vote_mode : null,
        eligible_to_vote: policy.eligible_to_vote === true,
        required_ok: policy.required_ok === true,
        recommended_vote: typeof policy.recommended_vote === "string" ? policy.recommended_vote : null,
        blocking_reasons: Array.isArray(policy.blocking_reasons) ? policy.blocking_reasons : [],
        warnings: Array.isArray(policy.warnings) ? policy.warnings : [],
    };
}

function computeExecutionState({ decision, vote }) {
    if (!decision) {
        return "EXECUTION_NOT_STARTED";
    }

    const status = typeof decision.status === "string" ? decision.status.trim().toUpperCase() : "";
    if (status === "RATIFIED") return "EXECUTION_RATIFIED";
    if (status === "BLOCKED") return "EXECUTION_BLOCKED";

    if (status === "DRAFT") {
        const voteResult = typeof vote?.outcome?.result === "string" ? vote.outcome.result.trim().toUpperCase() : null;
        const missingRequiredRoles = Array.isArray(vote?.outcome?.missing_required_roles) ? vote.outcome.missing_required_roles : [];
        const emptyVotes = Array.isArray(vote?.empty_votes) ? vote.empty_votes : [];

        if (voteResult === "PENDING" || missingRequiredRoles.length > 0 || emptyVotes.length > 0) {
            return "EXECUTION_PENDING";
        }

        return "EXECUTION_DRAFT";
    }

    return "EXECUTION_DRAFT";
}

function nextStepForState(state, motionId) {
    if (state === "WRONG_STATE") {
        return `Create or ingest ${motionId} under .nexus\\motions\\${motionId} before checking grid:status`;
    }
    if (state === "EXECUTION_NOT_STARTED") {
        return `Run pnpm grid:launch --motion ${motionId}, then pnpm council:run ${motionId}`;
    }
    if (state === "EXECUTION_PENDING") {
        return `Inspect vote.json, validate with pnpm grid:vote-prep --motion ${motionId}, then rerun pnpm council:run ${motionId}`;
    }
    if (state === "EXECUTION_DRAFT") {
        return `Inspect decision.yaml and related artifacts, then continue through pnpm grid:launch --motion ${motionId} or pnpm grid:vote-prep --motion ${motionId} as needed before rerunning pnpm council:run ${motionId}`;
    }
    if (state === "EXECUTION_BLOCKED") {
        return `Inspect decision.yaml and policy.yaml for blocking reasons, and open a superseding motion if appropriate`;
    }
    return "No further governance action required";
}

function printHumanResult(result) {
    console.log("");
    console.log(`Motion: ${result.motion_id}`);
    console.log(`Execution state: ${result.execution_state}`);
    console.log("");
    console.log(`Decision status: ${result.decision?.status ?? "(missing)"}`);
    console.log(`Gate summary: ${formatGateSummary(result.gates)}`);
    console.log(`Vote summary: ${formatVoteSummary(result.vote)}`);
    console.log(`Policy summary: ${formatPolicySummary(result.policy)}`);
    console.log("");
    console.log(`Next step: ${result.next_step}`);
    console.log("");
}

function formatGateSummary(gates) {
    if (!gates) return "no verify.json present";
    return `${gates.passing}/${gates.total} passing; required_ok=${gates.required_ok}`;
}

function formatVoteSummary(vote) {
    if (!vote) return "no vote.json present";
    const result = vote.outcome?.result ?? "no outcome";
    const missing = vote.outcome?.missing_required_roles?.length ?? 0;
    const empty = vote.empty_votes?.length ?? 0;
    return `result=${result}; filled_votes=${vote.filled_votes}/${vote.total_votes}; missing_required_roles=${missing}; empty_votes=${empty}`;
}

function formatPolicySummary(policy) {
    if (!policy) return "no policy.yaml present";
    return `eligible_to_vote=${policy.eligible_to_vote}; required_ok=${policy.required_ok}; recommended_vote=${policy.recommended_vote ?? "(missing)"}`;
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
    const motionDir = path.resolve(repoRoot, ".nexus", "motions", args.motion);
    const motionYamlPath = path.join(motionDir, "motion.yaml");
    const decisionYamlPath = path.join(motionDir, "decision.yaml");
    const verifyJsonPath = path.join(motionDir, "verify.json");
    const voteJsonPath = path.join(motionDir, "vote.json");
    const policyYamlPath = path.join(motionDir, "policy.yaml");

    const dirExists = fs.existsSync(motionDir) && fs.statSync(motionDir).isDirectory();
    if (!dirExists) {
        const result = {
            motion_id: args.motion,
            execution_state: "WRONG_STATE",
            ready: false,
            decision: null,
            gates: null,
            vote: null,
            policy: null,
            next_step: nextStepForState("WRONG_STATE", args.motion),
        };

        if (args.json) process.stdout.write(JSON.stringify(result, null, 2) + "\n");
        else printHumanResult(result);
        process.exit(1);
    }

    const motion = fs.existsSync(motionYamlPath) ? readYamlFile(motionYamlPath) : null;
    const decision = fs.existsSync(decisionYamlPath) ? readYamlFile(decisionYamlPath) : null;
    const verify = fs.existsSync(verifyJsonPath) ? readJsonFile(verifyJsonPath) : null;
    const vote = fs.existsSync(voteJsonPath) ? readJsonFile(voteJsonPath) : null;
    const policy = fs.existsSync(policyYamlPath) ? readYamlFile(policyYamlPath) : null;

    const summarizedDecision = summarizeDecision(decision);
    const summarizedGates = summarizeGates(verify);
    const summarizedVote = summarizeVote(vote);
    const summarizedPolicy = summarizePolicy(policy);
    const executionState = computeExecutionState({
        motion,
        decision: summarizedDecision,
        vote: summarizedVote,
        policy: summarizedPolicy,
    });

    const result = {
        motion_id: args.motion,
        execution_state: executionState,
        ready: executionState === "EXECUTION_RATIFIED",
        decision: summarizedDecision,
        gates: summarizedGates,
        vote: summarizedVote,
        policy: summarizedPolicy,
        next_step: nextStepForState(executionState, args.motion),
    };

    if (args.json) process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    else printHumanResult(result);

    process.exit(result.ready ? 0 : 1);
}

main();
