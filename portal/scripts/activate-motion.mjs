#!/usr/bin/env node
/**
 * activate-motion.mjs
 *
 * Reads a RATIFIED motion's governance artifacts and either:
 *   - (default) derives the work-packet activation intent as a dry-run
 *   - (--create) creates a real motion-linked work packet in the database
 *
 * Usage:
 *   node portal/scripts/activate-motion.mjs --motion motion-0073
 *   node portal/scripts/activate-motion.mjs --motion motion-0073 --create
 *
 * Exit codes:
 *   0 = success (dry-run activatable, or packet created)
 *   1 = not activatable / duplicate refused / precondition failed
 *   2 = unexpected error
 *
 * Part of: motion-0073 / Q2 WS-1 loop activation program (phase 2)
 * Extends: motion-0072 (phase 1 — dry-run bridge)
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import yaml from "js-yaml";

// --------------------------------------------------
// args
// --------------------------------------------------

function parseArgs(argv) {
    const args = { motion: null, create: false };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--motion" && argv[i + 1]) {
            args.motion = argv[++i];
        } else if (a === "--create") {
            args.create = true;
        }
    }
    return args;
}

// --------------------------------------------------
// helpers
// --------------------------------------------------

function die(msg) {
    console.error(`\n[ACTIVATE-MOTION] ERROR: ${msg}\n`);
    process.exit(2);
}

function fail(check, reason) {
    console.error(`[ACTIVATE-MOTION] FAIL  ${check}: ${reason}`);
    console.error(`[ACTIVATE-MOTION] NOT ACTIVATABLE — resolve the above before activating.`);
    process.exit(1);
}

function pass(check, detail) {
    console.log(`[ACTIVATE-MOTION] PASS  ${check}${detail ? `: ${detail}` : ""}`);
}

function warn(check, detail) {
    console.warn(`[ACTIVATE-MOTION] WARN  ${check}${detail ? `: ${detail}` : ""}`);
}

function exists(p) {
    return fs.existsSync(p);
}

function readText(p) {
    return fs.readFileSync(p, "utf8");
}

function readYaml(p, label) {
    try {
        const obj = yaml.load(readText(p));
        if (!obj || typeof obj !== "object") die(`${label} root is not a YAML object.`);
        return obj;
    } catch (err) {
        die(`Failed to parse ${label}: ${err?.message || String(err)}`);
    }
}

function readJson(p, label) {
    try {
        const obj = JSON.parse(readText(p));
        if (!obj || typeof obj !== "object") die(`${label} root is not a JSON object.`);
        return obj;
    } catch (err) {
        die(`Failed to parse ${label}: ${err?.message || String(err)}`);
    }
}

function firstNonEmpty(...values) {
    for (const v of values) {
        if (typeof v === "string" && v.trim().length > 0) return v.trim();
    }
    return null;
}

function findRepoRoot(startDir) {
    let cur = startDir;
    for (let i = 0; i < 8; i++) {
        if (exists(path.join(cur, ".nexus"))) return cur;
        const parent = path.dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return null;
}

// Mirrors portal/src/lib/work/workPacketContract.ts:buildMotionTag exactly.
// Cannot import the .ts source directly from a .mjs script; this must stay
// in sync with the canonical helper if the prefix ever changes.
const MOTION_TAG_PREFIX = "motion:";
function buildMotionTag(motionId) {
    return `${MOTION_TAG_PREFIX}${motionId}`;
}

// --------------------------------------------------
// create mode
// --------------------------------------------------

async function runCreate({ motionId, activationTag, routeTag, packetTitle, repoRoot }) {
    if (!process.env.DATABASE_URL) {
        const envPath = path.join(repoRoot, "portal", ".env.local");
        if (exists(envPath)) {
            const { default: dotenv } = await import("dotenv");
            dotenv.config({ path: envPath, override: false });
        }
    }
    if (!process.env.DATABASE_URL) {
        console.error(`[ACTIVATE-MOTION] ERROR: DATABASE_URL is not set.`);
        console.error(`[ACTIVATE-MOTION] Set it in the environment or in portal/.env.local`);
        process.exit(1);
    }

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    try {
        // Idempotency check: refuse if a live motion-tagged packet exists
        const existingInbox = await prisma.agentInboxItem.findFirst({
            where: {
                tags: { has: activationTag },
                status: { notIn: ["DONE", "CANCELED"] },
            },
            select: { id: true, workPacketId: true, status: true },
        });

        if (existingInbox) {
            console.error(`[ACTIVATE-MOTION] REFUSE: Live packet already exists for ${motionId}`);
            console.error(`[ACTIVATE-MOTION] Existing inbox item ID:   ${existingInbox.id}`);
            console.error(`[ACTIVATE-MOTION] Existing work packet ID:  ${existingInbox.workPacketId}`);
            console.error(`[ACTIVATE-MOTION] Existing status:          ${existingInbox.status}`);
            console.error(`[ACTIVATE-MOTION] Resolve or close the existing packet before re-activating.`);
            process.exit(1);
        }

        // Create WorkPacket + AgentInboxItem
        const result = await prisma.$transaction(async (tx) => {
            const packet = await tx.workPacket.create({
                data: {
                    nhId: motionId,
                    title: packetTitle,
                    ac: "",
                    plan: "",
                    status: "DRAFT",
                },
            });

            const inbox = await tx.agentInboxItem.create({
                data: {
                    workPacketId: packet.id,
                    status: "QUEUED",
                    priority: 60,
                    tags: [activationTag, routeTag],
                },
                select: { id: true, status: true, priority: true, tags: true },
            });

            return { packet, inbox };
        });

        console.log();
        console.log(`[ACTIVATE-MOTION] --- Work packet created ---`);
        console.log(`[ACTIVATE-MOTION] WorkPacket ID:   ${result.packet.id}`);
        console.log(`[ACTIVATE-MOTION] nhId:            ${result.packet.nhId}`);
        console.log(`[ACTIVATE-MOTION] Title:           ${result.packet.title}`);
        console.log(`[ACTIVATE-MOTION] Status:          ${result.packet.status}`);
        console.log(`[ACTIVATE-MOTION] InboxItem ID:    ${result.inbox.id}`);
        console.log(`[ACTIVATE-MOTION] Inbox status:    ${result.inbox.status}`);
        console.log(`[ACTIVATE-MOTION] Inbox priority:  ${result.inbox.priority}`);
        console.log(`[ACTIVATE-MOTION] Tags:            ${JSON.stringify(result.inbox.tags)}`);
        console.log();
        console.log(`[ACTIVATE-MOTION] Motion ${motionId} is now LIVE in the execution system.`);
        console.log();

        process.exit(0);
    } finally {
        await prisma.$disconnect();
    }
}

// --------------------------------------------------
// main
// --------------------------------------------------

async function main() {
    const args = parseArgs(process.argv);

    if (!args.motion) {
        console.error(
            `Usage: node portal/scripts/activate-motion.mjs --motion <motionId> [--create]\n` +
            `Example: node portal/scripts/activate-motion.mjs --motion motion-0073\n` +
            `         node portal/scripts/activate-motion.mjs --motion motion-0073 --create`
        );
        process.exit(1);
    }

    try {
        const repoRoot = findRepoRoot(process.cwd());
        if (!repoRoot) die(`Could not locate repo root (no .nexus directory found.).`);

        const motionId = String(args.motion).trim();

        const motionDir        = path.join(repoRoot, ".nexus", "motions", motionId);
        const motionYamlPath   = path.join(motionDir, "motion.yaml");
        const decisionYamlPath = path.join(motionDir, "decision.yaml");
        const handoffPath      = path.join(motionDir, "execution.handoff.json");
        const executionMdPath  = path.join(motionDir, "execution.md");

        console.log(`[ACTIVATE-MOTION] Motion: ${motionId}`);
        console.log(`[ACTIVATE-MOTION] Repo root: ${repoRoot}`);
        console.log();

        // Check 1 — motion directory
        if (!exists(motionDir)) {
            fail("motion_dir", `Not found: .nexus/motions/${motionId}`);
        }
        pass("motion_dir", `.nexus/motions/${motionId}`);

        // Check 2 — motion.yaml
        if (!exists(motionYamlPath)) {
            fail("motion_yaml", `Missing: .nexus/motions/${motionId}/motion.yaml`);
        }
        const motionObj = readYaml(motionYamlPath, "motion.yaml");
        const motionTitle = firstNonEmpty(motionObj.title);
        if (!motionTitle) {
            fail("motion_yaml", `motion.yaml has no readable title field.`);
        }
        pass("motion_yaml", `title="${motionTitle}"`);

        // Check 3 — decision.yaml exists and is RATIFIED
        if (!exists(decisionYamlPath)) {
            fail("decision_ratified", `Missing: .nexus/motions/${motionId}/decision.yaml`);
        }
        const decisionObj = readYaml(decisionYamlPath, "decision.yaml");
        const decisionStatus = firstNonEmpty(decisionObj.status);
        if (decisionStatus !== "RATIFIED") {
            fail(
                "decision_ratified",
                `decision.yaml status is "${decisionStatus ?? "(missing)"}" — must be RATIFIED`
            );
        }
        pass("decision_ratified", `status=RATIFIED`);

        // Check 4 — execution.handoff.json exists
        if (!exists(handoffPath)) {
            fail(
                "handoff_present",
                `Missing: .nexus/motions/${motionId}/execution.handoff.json\n` +
                `  Issue a handoff first: node portal/scripts/issue-execution-handoff.mjs --motion ${motionId}`
            );
        }
        pass("handoff_present", `execution.handoff.json found`);

        // Check 5 — handoff status is ISSUED
        const handoffObj = readJson(handoffPath, "execution.handoff.json");
        const handoffStatus = firstNonEmpty(handoffObj.status);
        if (handoffStatus !== "ISSUED") {
            fail(
                "handoff_issued",
                `execution.handoff.json status is "${handoffStatus ?? "(missing)"}" — must be ISSUED`
            );
        }
        const handoffId = firstNonEmpty(handoffObj.handoff_id) ?? `${motionId}-handoff-001`;
        pass("handoff_issued", `status=ISSUED handoff_id=${handoffId}`);

        // Check 6 — target repo derivable
        const targetRepo = firstNonEmpty(
            decisionObj.target_repo,
            motionObj?.target?.repo
        );
        if (!targetRepo) {
            fail(
                "target_repo",
                `Could not derive target repo from decision.yaml or motion.yaml`
            );
        }
        pass("target_repo", targetRepo);

        // Warn — execution.md (WS-2 readiness)
        const executionMdPresent = exists(executionMdPath);
        if (executionMdPresent) {
            pass("execution_md", `present (WS-2 context binding ready)`);
        } else {
            warn("execution_md", `absent — WS-2 agent context binding will not be available`);
        }

        // --------------------------------------------------
        // Derived activation params
        // --------------------------------------------------
        const activationTag = buildMotionTag(motionId);
        const routeTag      = `route:ARCHITECT`;
        const packetTitle   = `[${motionId}] ${motionTitle}`;

        if (args.create) {
            // Real creation path (WS-1 phase 2)
            console.log();
            console.log(`[ACTIVATE-MOTION] All preconditions passed. Creating work packet...`);
            await runCreate({ motionId, activationTag, routeTag, packetTitle, repoRoot });
        } else {
            // Dry-run output (WS-1 phase 1 behavior — unchanged)
            console.log();
            console.log(`[ACTIVATE-MOTION] --- Activation intent (dry-run) ---`);
            console.log(`[ACTIVATE-MOTION] Activation tag:   ${activationTag}`);
            console.log(`[ACTIVATE-MOTION] Route tag:        ${routeTag}`);
            console.log(`[ACTIVATE-MOTION] Handoff ID:       ${handoffId}`);
            console.log(`[ACTIVATE-MOTION] Target repo:      ${targetRepo}`);
            console.log(`[ACTIVATE-MOTION] Packet title:     ${packetTitle}`);
            console.log(`[ACTIVATE-MOTION] Tags:             ["${activationTag}", "${routeTag}"]`);
            console.log(`[ACTIVATE-MOTION] execution.md:     ${executionMdPresent ? "PRESENT" : "ABSENT"}`);
            console.log();
            console.log(`[ACTIVATE-MOTION] This motion is ACTIVATABLE.`);
            console.log(`[ACTIVATE-MOTION] DRY-RUN ONLY — no database writes performed.`);
            console.log(`[ACTIVATE-MOTION] To create the packet: add --create`);
            console.log();

            process.exit(0);
        }
    } catch (err) {
        console.error(`[ACTIVATE-MOTION] Unexpected error`);
        console.error(err?.stack || err?.message || String(err));
        process.exit(2);
    }
}

main().catch((err) => {
    console.error(`[ACTIVATE-MOTION] Unexpected error`);
    console.error(err?.stack || err?.message || String(err));
    process.exit(2);
});
