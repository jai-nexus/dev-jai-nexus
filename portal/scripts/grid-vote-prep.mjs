#!/usr/bin/env node
/**
 * grid-vote-prep.mjs (motion-0135 slice 1)
 *
 * Read-only vote artifact validator plus explicit scaffold writer when requested.
 *
 * Usage:
 *   node portal/scripts/grid-vote-prep.mjs --motion motion-0135
 *   node portal/scripts/grid-vote-prep.mjs --motion motion-0135 --json
 *   node portal/scripts/grid-vote-prep.mjs --motion motion-0135 --scaffold
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import yaml from "js-yaml";

const MOTION_ID_PATTERN = /^motion-\d{4}$/;
const ALLOWED_PRE_VOTE_STATUSES = new Set(["proposed", "draft", "open"]);
const ALREADY_RATIFIED_STATUSES = new Set(["ratified", "blocked", "rejected", "superseded", "closed"]);
const VALID_VOTE_VALUES = new Set(["yes", "no", "abstain", "yes_with_reservations"]);

function parseArgs(argv) {
    const args = {
        motion: null,
        json: false,
        scaffold: false,
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
        if (token === "--scaffold") {
            args.scaffold = true;
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
        "  grid-vote-prep - vote.json validator and explicit scaffold writer",
        "",
        "  Usage:",
        "    node portal/scripts/grid-vote-prep.mjs --motion <motion-id>",
        "    node portal/scripts/grid-vote-prep.mjs --motion <motion-id> --json",
        "    node portal/scripts/grid-vote-prep.mjs --motion <motion-id> --scaffold",
        "",
        "  Options:",
        "    --motion <motion-id>  Motion directory name under .nexus/motions/",
        "    --json                Emit machine-readable JSON",
        "    --scaffold            Write vote.json template only when absent",
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

function readCouncilConfig(configPath) {
    const raw = fs.readFileSync(configPath, "utf8");
    const data = yaml.load(raw);

    const voteMode = data?.voting?.default_mode;
    const requiredRoles = Array.isArray(data?.voting?.required_roles)
        ? data.voting.required_roles.filter((value) => typeof value === "string" && value.trim().length > 0)
        : [];

    return {
        vote_mode: typeof voteMode === "string" && voteMode.trim().length > 0 ? voteMode.trim() : "unanimous_consent",
        required_roles: requiredRoles,
    };
}

function runPnpmGridPreflight(motionId) {
    if (process.platform === "win32") {
        return spawnSync("cmd.exe", ["/d", "/s", "/c", `pnpm grid:preflight --motion ${motionId} --json`], {
            cwd: process.cwd(),
            encoding: "utf8",
            stdio: "pipe",
        });
    }

    return spawnSync("pnpm", ["grid:preflight", "--motion", motionId, "--json"], {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: "pipe",
    });
}

function makeResult({ motionId, outcome, ready, failedCheck, checks, nextStep }) {
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

function validateVoteJson(parsed, { motionId, voteMode, requiredRoles }) {
    const issues = [];

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return ["vote.json root must be a JSON object"];
    }

    if (parsed.motion_id !== motionId) {
        issues.push(`motion_id mismatch: expected ${motionId}, found ${parsed.motion_id ?? "(missing)"}`);
    }

    if (parsed.version !== "0.2") {
        issues.push(`version must be "0.2"`);
    }

    if (parsed.protocol_version !== "0.3.8") {
        issues.push(`protocol_version must be "0.3.8"`);
    }

    if (parsed.vote_mode !== voteMode) {
        issues.push(`vote_mode mismatch: expected ${voteMode}, found ${parsed.vote_mode ?? "(missing)"}`);
    }

    if (!Array.isArray(parsed.required_roles)) {
        issues.push("required_roles must be an array");
    } else {
        const normalizedRequired = parsed.required_roles.map((role) => String(role));
        const missingDeclaredRole = requiredRoles.find((role) => !normalizedRequired.includes(role));
        const extraDeclaredRole = normalizedRequired.find((role) => !requiredRoles.includes(role));

        if (missingDeclaredRole) issues.push(`required_roles missing ${missingDeclaredRole}`);
        if (extraDeclaredRole) issues.push(`required_roles contains unexpected role ${extraDeclaredRole}`);
    }

    if (!Array.isArray(parsed.votes)) {
        issues.push("votes must be an array");
        return issues;
    }

    const roleToVote = new Map();

    for (let i = 0; i < parsed.votes.length; i++) {
        const vote = parsed.votes[i];
        if (!vote || typeof vote !== "object" || Array.isArray(vote)) {
            issues.push(`votes[${i}] must be an object`);
            continue;
        }

        const role = typeof vote.role === "string" ? vote.role.trim() : "";
        const voteValue = typeof vote.vote === "string" ? vote.vote.trim().toLowerCase() : "";

        if (!role) {
            issues.push(`votes[${i}] missing role`);
            continue;
        }

        roleToVote.set(role, voteValue);

        if (!requiredRoles.includes(role)) {
            issues.push(`votes[${i}] has unexpected role ${role}`);
        }

        if (!voteValue) {
            issues.push(`votes[${i}] role ${role} has empty vote value`);
            continue;
        }

        if (!VALID_VOTE_VALUES.has(voteValue)) {
            issues.push(`votes[${i}] role ${role} has invalid vote value ${vote.vote}`);
        }
    }

    for (const role of requiredRoles) {
        if (!roleToVote.has(role)) {
            issues.push(`votes missing required role ${role}`);
        }
    }

    return issues;
}

function scaffoldVoteJson({ motionId, voteMode, requiredRoles }) {
    return {
        motion_id: motionId,
        version: "0.2",
        protocol_version: "0.3.8",
        vote_mode: voteMode,
        required_roles: [...requiredRoles],
        votes: requiredRoles.map((role) => ({
            role,
            vote: "",
        })),
    };
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
    const councilConfigPath = path.resolve(repoRoot, ".nexus", "council.config.yaml");

    const checks = [];
    let outcome = "VOTE_READY";
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
        nextStep = `Create or ingest ${args.motion} under ${motionRelDir} before running pnpm grid:vote-prep --motion ${args.motion}`;
    }

    let motionYamlText = "";
    let status = null;

    if (!failedCheck) {
        motionYamlText = fs.readFileSync(motionYamlPath, "utf8");
        status = normalizeStatus(extractYamlScalar(motionYamlText, "status"));
        const alreadyRatified = status !== null && ALREADY_RATIFIED_STATUSES.has(status);
        const eligible = status !== null && ALLOWED_PRE_VOTE_STATUSES.has(status);

        checks.push({
            name: "MOTION_STATE",
            ok: eligible && !alreadyRatified,
            detail: alreadyRatified
                ? `status=${status} is already beyond vote-prep state`
                : `status=${status ?? "(missing)"}`,
        });

        if (alreadyRatified) {
            outcome = "BLOCKED_ALREADY_RATIFIED";
            failedCheck = "MOTION_STATE";
            nextStep = `Do not run pnpm council:run ${args.motion}; inspect existing governance artifacts in ${motionRelDir}`;
        } else if (!eligible) {
            outcome = "BLOCKED_WRONG_STATE";
            failedCheck = "MOTION_STATE";
            nextStep = `Set ${motionRelDir}\\motion.yaml to an eligible pre-vote state before rerunning pnpm grid:vote-prep --motion ${args.motion}`;
        }
    }

    let voteMode = "unanimous_consent";
    let requiredRoles = ["proposer", "challenger", "arbiter"];

    if (!failedCheck) {
        const config = readCouncilConfig(councilConfigPath);
        voteMode = config.vote_mode;
        requiredRoles = config.required_roles;
        checks.push({
            name: "COUNCIL_CONFIG",
            ok: requiredRoles.length > 0,
            detail: `vote_mode=${voteMode}; required_roles=${requiredRoles.join(", ")}`,
        });

        if (requiredRoles.length === 0) {
            outcome = "BLOCKED_WRONG_STATE";
            failedCheck = "COUNCIL_CONFIG";
            nextStep = `Fix .nexus\\council.config.yaml required_roles before rerunning pnpm grid:vote-prep --motion ${args.motion}`;
        }
    }

    if (!failedCheck) {
        const preflightResult = runPnpmGridPreflight(args.motion);
        const preflightOk = preflightResult.status === 0;
        const preflightParsed = parseEmbeddedJson(preflightResult.stdout?.trim() ?? "");

        let preflightDetail;
        if (preflightOk) {
            preflightDetail = "grid:preflight passed";
        } else if (preflightParsed?.verdict) {
            preflightDetail = `grid:preflight exited ${preflightResult.status ?? 1} — verdict=${preflightParsed.verdict}${preflightParsed.failed_check ? `, failed_check=${preflightParsed.failed_check}` : ""}`;
        } else {
            const raw = [preflightResult.stdout?.trim(), preflightResult.stderr?.trim()].filter(Boolean).join(" | ");
            preflightDetail = `grid:preflight exited ${preflightResult.status ?? 1}${raw ? ` — ${raw}` : ""}`;
        }

        checks.push({
            name: "PREFLIGHT_READY",
            ok: preflightOk,
            detail: preflightDetail,
        });

        if (!preflightOk) {
            outcome = "BLOCKED_WRONG_STATE";
            failedCheck = "PREFLIGHT_READY";
            nextStep = `Fix the preflight failure, rerun pnpm grid:preflight --motion ${args.motion}, then rerun pnpm grid:vote-prep --motion ${args.motion}`;
        }
    }

    if (!failedCheck) {
        const voteExists = fs.existsSync(voteJsonPath);
        const voteDetail = voteExists
            ? `found ${motionRelDir}\\vote.json`
            : `missing ${motionRelDir}\\vote.json`;

        checks.push({
            name: "VOTE_ARTIFACT",
            ok: voteExists,
            detail: voteDetail,
        });

        if (!voteExists && args.scaffold) {
            const scaffold = scaffoldVoteJson({ motionId: args.motion, voteMode, requiredRoles });
            fs.writeFileSync(voteJsonPath, JSON.stringify(scaffold, null, 2) + "\n", "utf8");
            checks.push({
                name: "SCAFFOLD_WRITE",
                ok: true,
                detail: `wrote ${motionRelDir}\\vote.json with empty vote placeholders`,
            });
            outcome = "BLOCKED_MALFORMED_VOTE";
            failedCheck = "VOTE_VALUES";
            nextStep = `Fill the vote values in ${motionRelDir}\\vote.json, then rerun pnpm grid:vote-prep --motion ${args.motion}`;
        } else if (!voteExists) {
            outcome = "BLOCKED_MISSING_VOTE";
            failedCheck = "VOTE_ARTIFACT";
            nextStep = `Run pnpm grid:vote-prep --motion ${args.motion} --scaffold`;
        }
    }

    if (!failedCheck && fs.existsSync(voteJsonPath)) {
        let parsed = null;
        try {
            parsed = JSON.parse(fs.readFileSync(voteJsonPath, "utf8"));
            checks.push({
                name: "VOTE_JSON_PARSE",
                ok: true,
                detail: `parsed ${motionRelDir}\\vote.json successfully`,
            });
        } catch (error) {
            checks.push({
                name: "VOTE_JSON_PARSE",
                ok: false,
                detail: `invalid JSON: ${error.message}`,
            });
            outcome = "BLOCKED_MALFORMED_VOTE";
            failedCheck = "VOTE_JSON_PARSE";
            nextStep = `Fix the JSON syntax in ${motionRelDir}\\vote.json and rerun pnpm grid:vote-prep --motion ${args.motion}`;
        }

        if (!failedCheck) {
            const issues = validateVoteJson(parsed, {
                motionId: args.motion,
                voteMode,
                requiredRoles,
            });

            checks.push({
                name: "VOTE_JSON_SCHEMA",
                ok: issues.length === 0,
                detail: issues.length === 0 ? "vote.json structure is valid" : issues.join("; "),
            });

            if (issues.length > 0) {
                outcome = "BLOCKED_MALFORMED_VOTE";
                failedCheck = "VOTE_JSON_SCHEMA";
                nextStep = `Fix ${motionRelDir}\\vote.json (${issues[0]}) and rerun pnpm grid:vote-prep --motion ${args.motion}`;
            } else {
                outcome = "VOTE_READY";
                nextStep = `Run pnpm council:run ${args.motion}`;
            }
        }
    }

    const ready = outcome === "VOTE_READY";
    const result = makeResult({
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
