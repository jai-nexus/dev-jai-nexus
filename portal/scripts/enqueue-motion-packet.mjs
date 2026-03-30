#!/usr/bin/env node
/**
 * enqueue-motion-packet.mjs
 *
 * Create or upsert an AgentQueueItem for a motion-linked work packet.
 *
 * Purpose:
 * - activate-motion.mjs --create creates WorkPacket + AgentInboxItem only.
 * - architect runtime claimNext() queries AgentQueueItem exclusively.
 * - This script bridges the gap: given a motionId, it upserts a queue item
 *   so the motion-linked packet becomes claimable by architect runtime.
 *
 * Usage:
 *   node portal/scripts/enqueue-motion-packet.mjs --motion motion-0070
 *   node portal/scripts/enqueue-motion-packet.mjs --motion motion-0070 --agent 6.0.10
 *
 * Exit codes:
 *   0 = queue item created / upserted
 *   1 = validation / precondition failure
 *   2 = unexpected error
 *
 * Part of: motion-0076 / Q2 WS-2 loop activation program (phase 2)
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
        if (a === "--agent" && argv[i + 1])  { args.agent  = argv[++i]; continue; }
    }
    return args;
}

// --------------------------------------------------
// helpers
// --------------------------------------------------

function die(msg) {
    console.error(`\n[ENQUEUE-MOTION] ERROR: ${msg}\n`);
    process.exit(1);
}

function ok(msg) {
    console.log(`[ENQUEUE-MOTION] ${msg}`);
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

function findArchitectAgent(agencyConfig) {
    const agents = Array.isArray(agencyConfig.agents) ? agencyConfig.agents : [];
    for (const agent of agents) {
        const roles = Array.isArray(agent.execution_roles) ? agent.execution_roles : [];
        const capable = agent.execution_capable === true && agent.governance_only !== true;
        if (capable && roles.some((r) => String(r).toUpperCase() === "ARCHITECT")) {
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
            "Usage: node portal/scripts/enqueue-motion-packet.mjs --motion <motionId> [--agent <nhId>]\n" +
            "Example: node portal/scripts/enqueue-motion-packet.mjs --motion motion-0070\n" +
            "         node portal/scripts/enqueue-motion-packet.mjs --motion motion-0070 --agent 6.0.10",
        );
        process.exit(1);
    }

    const repoRoot = findRepoRoot(process.cwd());
    if (!repoRoot) die("Could not locate repo root (no .nexus directory found).");

    const motionId = String(args.motion).trim();
    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
    const motionYamlPath = path.join(motionDir, "motion.yaml");
    const decisionYamlPath = path.join(motionDir, "decision.yaml");

    if (!exists(motionDir))       die(`Motion directory not found: .nexus/motions/${motionId}`);
    if (!exists(motionYamlPath))  die(`Missing: .nexus/motions/${motionId}/motion.yaml`);
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
        if (!capable || !roles.some((r) => String(r).toUpperCase() === "ARCHITECT")) {
            die(
                `Agent ${args.agent} (${agent.label}) is not ARCHITECT-capable.\n` +
                `execution_capable=${agent.execution_capable} execution_roles=${JSON.stringify(roles)}`,
            );
        }
    } else {
        agent = findArchitectAgent(agencyConfig);
        if (!agent) {
            die(
                "No ARCHITECT-capable agent found in config/agency.yaml.\n" +
                "Use --agent <nhId> to specify one explicitly.",
            );
        }
    }

    const agentNhId = String(agent.nh_id);
    const activationTag = `motion:${motionId}`;

    console.log(`[ENQUEUE-MOTION] Motion:   ${motionId}`);
    console.log(`[ENQUEUE-MOTION] Agent:    ${agentNhId} (${agent.label})`);
    console.log(`[ENQUEUE-MOTION] Repo:     ${targetRepo}`);
    console.log(`[ENQUEUE-MOTION] Repo root: ${repoRoot}`);
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
        console.error("[ENQUEUE-MOTION] ERROR: DATABASE_URL is not set.");
        console.error("[ENQUEUE-MOTION] Set it in the environment or in portal/.env.local");
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
                `[ENQUEUE-MOTION] ERROR: No live AgentInboxItem found with tag ${activationTag}\n` +
                `[ENQUEUE-MOTION] Activate the motion first:\n` +
                `[ENQUEUE-MOTION]   node portal/scripts/activate-motion.mjs --motion ${motionId} --create`,
            );
            process.exit(1);
        }

        ok(`Found inbox item  ID=${inboxItem.id}  workPacketId=${inboxItem.workPacketId}  status=${inboxItem.status}`);

        // Guard: refuse to enqueue for architect if the packet is no longer at architect stage.
        // The latest inbox tags carry the current route. Enqueuing for architect on a
        // builder- or verifier-stage packet creates an unclaimable queue item.
        const currentRoute = parseRouteFromTags(inboxItem.tags);
        if (currentRoute !== "ARCHITECT") {
            console.error(
                `\n[ENQUEUE-MOTION] ERROR: Packet is not at architect stage.\n` +
                `[ENQUEUE-MOTION] Current route tag: ${currentRoute ? `route:${currentRoute}` : "(none — no route tag found)"}\n` +
                `[ENQUEUE-MOTION] Current tags:      ${JSON.stringify(inboxItem.tags)}\n` +
                `[ENQUEUE-MOTION] Only packets with route:ARCHITECT can be enqueued for the architect runtime.\n` +
                `[ENQUEUE-MOTION] Motion ${motionId} is already past the architect stage — do not re-enqueue it.\n`,
            );
            process.exit(1);
        }

        // Upsert AgentQueueItem
        // repoScope stores only the repo name so claimNext() scope validation passes.
        // Storing the full agent scope array would fail validation because paths:/deny:/actions:
        // entries normalize to non-repo strings not present in the agent's allowed repo set.
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
        console.log(`[ENQUEUE-MOTION] --- Queue item ready ---`);
        console.log(`[ENQUEUE-MOTION] AgentQueueItem ID:  ${queueItem.id}`);
        console.log(`[ENQUEUE-MOTION] agentNhId:          ${queueItem.agentNhId}`);
        console.log(`[ENQUEUE-MOTION] repoScope:          ${JSON.stringify(queueItem.repoScope)}`);
        console.log(`[ENQUEUE-MOTION] status:             ${queueItem.status}`);
        console.log(`[ENQUEUE-MOTION] WorkPacket ID:      ${inboxItem.workPacketId}`);
        console.log();
        console.log(`[ENQUEUE-MOTION] Motion-linked packet is now claimable by architect ${agentNhId}.`);
        console.log(`[ENQUEUE-MOTION] Run architect proof:`);
        console.log(`[ENQUEUE-MOTION]   pnpm -C portal exec tsx scripts/run-architect-once.ts ${agentNhId}`);
        console.log();

        process.exit(0);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main().catch((err) => {
    console.error("[ENQUEUE-MOTION] Unexpected error");
    console.error(err?.stack || err?.message || String(err));
    process.exit(2);
});
