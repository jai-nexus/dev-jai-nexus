#!/usr/bin/env node
/**
 * enqueue-builder-packet.mjs
 *
 * Create or upsert an AgentQueueItem for a builder-stage motion-linked
 * work packet.
 *
 * Purpose:
 * - After architect runtime completes, applyPacketRouteAction("ROUTE_BUILDER")
 *   clears the assignee, causing syncAgentQueueItemForPacket to delete the
 *   AgentQueueItem. The builder runtime claimNext() queries AgentQueueItem
 *   exclusively, so the packet becomes unclaimable.
 * - This script bridges the gap: given a motionId whose packet is at
 *   route:BUILDER stage, it upserts a queue item so builder runtime can
 *   claim it.
 *
 * Usage:
 *   node portal/scripts/enqueue-builder-packet.mjs --motion motion-0070
 *   node portal/scripts/enqueue-builder-packet.mjs --motion motion-0070 --agent 6.0.11
 *
 * Exit codes:
 *   0 = queue item created / upserted
 *   1 = validation / precondition failure
 *   2 = unexpected error
 *
 * Part of: motion-0078 / Q2 WS-2 loop activation program (phase 4)
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import yaml from "js-yaml";

// --------------------------------------------------
// args
// --------------------------------------------------

function parseArgs(argv) {
    const args = { motion: null, agent: null };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--motion" && argv[i + 1]) { args.motion = argv[++i]; continue; }
        if (a === "--agent"  && argv[i + 1]) { args.agent  = argv[++i]; continue; }
    }
    return args;
}

// --------------------------------------------------
// helpers
// --------------------------------------------------

function die(msg) {
    console.error(`\n[ENQUEUE-BUILDER] ERROR: ${msg}\n`);
    process.exit(1);
}

function ok(msg) {
    console.log(`[ENQUEUE-BUILDER] ${msg}`);
}

function exists(p) { return fs.existsSync(p); }
function readText(p) { return fs.readFileSync(p, "utf8"); }

function readYaml(p, label) {
    try {
        const obj = yaml.load(readText(p));
        if (!obj || typeof obj !== "object") die(`${label} root is not a YAML object.`);
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

function parseRouteFromTags(tags) {
    if (!Array.isArray(tags)) return null;
    const hit = tags.find((t) => typeof t === "string" && t.startsWith("route:"));
    if (!hit) return null;
    return hit.slice("route:".length).trim().toUpperCase();
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

// --------------------------------------------------
// agency helpers (reads YAML directly — cannot import TS agencyConfig)
// --------------------------------------------------

function loadAgencyConfig(repoRoot) {
    const agencyPath = path.join(repoRoot, "config", "agency.yaml");
    if (!exists(agencyPath)) die("Agency config not found: config/agency.yaml");
    return readYaml(agencyPath, "config/agency.yaml");
}

function findBuilderAgent(agencyConfig) {
    const agents = Array.isArray(agencyConfig.agents) ? agencyConfig.agents : [];
    for (const agent of agents) {
        const roles = Array.isArray(agent.execution_roles) ? agent.execution_roles : [];
        const capable = agent.execution_capable === true && agent.governance_only !== true;
        if (capable && roles.some((r) => String(r).toUpperCase() === "BUILDER")) {
            return agent;
        }
    }
    return null;
}

function getAgentByNhId(agencyConfig, nhId) {
    const agents = Array.isArray(agencyConfig.agents) ? agencyConfig.agents : [];
    return agents.find((a) => String(a.nh_id) === String(nhId)) ?? null;
}

// --------------------------------------------------
// main
// --------------------------------------------------

async function main() {
    const args = parseArgs(process.argv);

    if (!args.motion) {
        console.error(
            "Usage: node portal/scripts/enqueue-builder-packet.mjs --motion <motionId> [--agent <nhId>]\n" +
            "Example: node portal/scripts/enqueue-builder-packet.mjs --motion motion-0070\n" +
            "         node portal/scripts/enqueue-builder-packet.mjs --motion motion-0070 --agent 6.0.11",
        );
        process.exit(1);
    }

    const repoRoot = findRepoRoot(process.cwd());
    if (!repoRoot) die("Could not locate repo root (no .nexus directory found).");

    const motionId = String(args.motion).trim();
    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
    const motionYamlPath = path.join(motionDir, "motion.yaml");
    const decisionYamlPath = path.join(motionDir, "decision.yaml");

    if (!exists(motionDir))        die(`Motion directory not found: .nexus/motions/${motionId}`);
    if (!exists(motionYamlPath))   die(`Missing: .nexus/motions/${motionId}/motion.yaml`);
    if (!exists(decisionYamlPath)) die(`Missing: .nexus/motions/${motionId}/decision.yaml`);

    const motionObj   = readYaml(motionYamlPath,   "motion.yaml");
    const decisionObj = readYaml(decisionYamlPath, "decision.yaml");

    const decisionStatus = firstNonEmpty(decisionObj.status);
    if (decisionStatus !== "RATIFIED") {
        die(`Motion ${motionId} is not RATIFIED (status=${decisionStatus ?? "(missing)"}). ` +
            "Only RATIFIED motions may be enqueued.");
    }

    const targetRepo = firstNonEmpty(decisionObj.target_repo, motionObj?.target?.repo);
    if (!targetRepo) {
        die(`Cannot derive target repo from decision.yaml or motion.yaml for ${motionId}`);
    }

    // Resolve agent
    const agencyConfig = loadAgencyConfig(repoRoot);
    let agent;

    if (args.agent) {
        agent = getAgentByNhId(agencyConfig, args.agent);
        if (!agent) die(`Agent not found in config/agency.yaml: ${args.agent}`);
        const roles = Array.isArray(agent.execution_roles) ? agent.execution_roles : [];
        const capable = agent.execution_capable === true && agent.governance_only !== true;
        if (!capable || !roles.some((r) => String(r).toUpperCase() === "BUILDER")) {
            die(
                `Agent ${args.agent} (${agent.label}) is not BUILDER-capable.\n` +
                `execution_capable=${agent.execution_capable} execution_roles=${JSON.stringify(roles)}`,
            );
        }
    } else {
        agent = findBuilderAgent(agencyConfig);
        if (!agent) {
            die(
                "No BUILDER-capable agent found in config/agency.yaml.\n" +
                "Use --agent <nhId> to specify one explicitly.",
            );
        }
    }

    const agentNhId = String(agent.nh_id);
    const activationTag = `motion:${motionId}`;

    console.log(`[ENQUEUE-BUILDER] Motion:    ${motionId}`);
    console.log(`[ENQUEUE-BUILDER] Agent:     ${agentNhId} (${agent.label})`);
    console.log(`[ENQUEUE-BUILDER] Repo:      ${targetRepo}`);
    console.log(`[ENQUEUE-BUILDER] Repo root: ${repoRoot}`);
    console.log();

    // DB setup
    if (!process.env.DATABASE_URL) {
        const envPath = path.join(repoRoot, "portal", ".env.local");
        if (exists(envPath)) {
            const { default: dotenv } = await import("dotenv");
            dotenv.config({ path: envPath, override: false });
        }
    }
    if (!process.env.DATABASE_URL) {
        console.error("[ENQUEUE-BUILDER] ERROR: DATABASE_URL is not set.");
        console.error("[ENQUEUE-BUILDER] Set it in the environment or in portal/.env.local");
        process.exit(1);
    }

    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg }     = await import("@prisma/adapter-pg");
    const { default: pg }  = await import("pg");
    const pool    = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma  = new PrismaClient({ adapter });

    try {
        // Find the live motion-linked inbox item
        const inboxItem = await prisma.agentInboxItem.findFirst({
            where: {
                tags:   { has: activationTag },
                status: { notIn: ["DONE", "CANCELED"] },
            },
            select: { id: true, workPacketId: true, status: true, tags: true },
        });

        if (!inboxItem) {
            console.error(
                `[ENQUEUE-BUILDER] ERROR: No live AgentInboxItem found with tag ${activationTag}\n` +
                `[ENQUEUE-BUILDER] Activate the motion first:\n` +
                `[ENQUEUE-BUILDER]   node portal/scripts/activate-motion.mjs --motion ${motionId} --create`,
            );
            process.exit(1);
        }

        ok(`Found inbox item  ID=${inboxItem.id}  workPacketId=${inboxItem.workPacketId}  status=${inboxItem.status}`);

        // Guard: refuse to enqueue for builder if the packet is not at builder stage.
        // Only packets with route:BUILDER can be enqueued for builder runtime.
        const currentRoute = parseRouteFromTags(inboxItem.tags);
        if (currentRoute !== "BUILDER") {
            console.error(
                `\n[ENQUEUE-BUILDER] ERROR: Packet is not at builder stage.\n` +
                `[ENQUEUE-BUILDER] Current route tag: ${currentRoute ? `route:${currentRoute}` : "(none — no route tag found)"}\n` +
                `[ENQUEUE-BUILDER] Current tags:      ${JSON.stringify(inboxItem.tags)}\n` +
                `[ENQUEUE-BUILDER] Only packets with route:BUILDER can be enqueued for builder runtime.\n` +
                `[ENQUEUE-BUILDER] Motion ${motionId} is not yet at builder stage — run architect first.\n`,
            );
            process.exit(1);
        }

        // Upsert AgentQueueItem
        const repoScope = [targetRepo];

        const queueItem = await prisma.agentQueueItem.upsert({
            where:  { workPacketId: inboxItem.workPacketId },
            create: {
                workPacketId: inboxItem.workPacketId,
                agentNhId,
                repoScope,
                status: "PENDING",
            },
            update: {
                agentNhId,
                repoScope,
                status:      "PENDING",
                claimedAt:   null,
                leaseExpiry: null,
            },
            select: { id: true, agentNhId: true, status: true, repoScope: true },
        });

        console.log();
        console.log(`[ENQUEUE-BUILDER] --- Queue item ready ---`);
        console.log(`[ENQUEUE-BUILDER] AgentQueueItem ID:  ${queueItem.id}`);
        console.log(`[ENQUEUE-BUILDER] agentNhId:          ${queueItem.agentNhId}`);
        console.log(`[ENQUEUE-BUILDER] repoScope:          ${JSON.stringify(queueItem.repoScope)}`);
        console.log(`[ENQUEUE-BUILDER] status:             ${queueItem.status}`);
        console.log(`[ENQUEUE-BUILDER] WorkPacket ID:      ${inboxItem.workPacketId}`);
        console.log();
        console.log(`[ENQUEUE-BUILDER] Motion-linked packet is now claimable by builder ${agentNhId}.`);
        console.log(`[ENQUEUE-BUILDER] Run builder proof:`);
        console.log(`[ENQUEUE-BUILDER]   pnpm -C portal exec tsx scripts/run-builder-once.ts ${agentNhId}`);
        console.log();

        process.exit(0);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main().catch((err) => {
    console.error("[ENQUEUE-BUILDER] Unexpected error");
    console.error(err?.stack || err?.message || String(err));
    process.exit(2);
});
