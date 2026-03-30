#!/usr/bin/env node
/**
 * activate-staged-project.mjs
 *
 * Reads a coverage-declaration.yaml for a staged project, derives the
 * planner-owned dispatch handle, and creates a motion-linked work packet
 * in the dev-jai-nexus governed execution lane.
 *
 * The work packet is tagged with:
 *   motion:<motionId>   — links to the governing motion
 *   project:<project_id> — shows staged project in operator surfaces
 *   route:ARCHITECT     — enters the architect execution lane
 *
 * Reuses the same WorkPacket/AgentInboxItem pattern as activate-motion.mjs.
 * After creation, use enqueue-motion-packet.mjs to bridge to the architect
 * queue, then run-architect-once.ts to prove the execution lane.
 *
 * Usage:
 *   node portal/scripts/activate-staged-project.mjs \
 *     --coverage out/offbook-ai/coverage-declaration.yaml \
 *     --motion motion-0096
 *
 *   node portal/scripts/activate-staged-project.mjs \
 *     --coverage out/offbook-ai/coverage-declaration.yaml \
 *     --motion motion-0096 --create
 *
 * Exit codes:
 *   0 = dry-run passed / packet created
 *   1 = validation failure / precondition / duplicate refused
 *   2 = unexpected error
 *
 * Part of: motion-0096 / Q2 staged workstream dispatch activation v0
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import yaml from "js-yaml";

// --------------------------------------------------
// args
// --------------------------------------------------

function parseArgs(argv) {
    const args = { coverage: null, motion: null, create: false };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--coverage" && argv[i + 1]) { args.coverage = argv[++i]; continue; }
        if (a === "--motion"   && argv[i + 1]) { args.motion   = argv[++i]; continue; }
        if (a === "--create") { args.create = true; continue; }
    }
    return args;
}

// --------------------------------------------------
// helpers
// --------------------------------------------------

function die(msg) {
    console.error(`\n[ACTIVATE-STAGED] ERROR: ${msg}\n`);
    process.exit(2);
}

function fail(check, reason) {
    console.error(`[ACTIVATE-STAGED] FAIL  ${check}: ${reason}`);
    console.error(`[ACTIVATE-STAGED] NOT ACTIVATABLE — resolve the above before activating.`);
    process.exit(1);
}

function pass(check, detail) {
    console.log(`[ACTIVATE-STAGED] PASS  ${check}${detail ? `: ${detail}` : ""}`);
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
// dispatch handle derivation (WS-E contract)
//
// All 10 planner-owned fields from dispatch-integration.spec.md:
//   project_id, domain, nh_root, execution_scope,
//   governance_resident_repo, agency_config_path, council_config_path,
//   council_nh_id (= nh_root), proposer_nh_id (= nh_root + ".1"),
//   wave_state.current_wave
// --------------------------------------------------

function deriveNhRoot(decl) {
    // Prefer explicit nh_root field if present
    if (decl.nh_root) return String(decl.nh_root);

    // Fallback: find council agent in agent_coverage (governance_resident_only,
    // nh_id without a dot-suffix, or role === "council")
    const agents = Array.isArray(decl.agent_coverage) ? decl.agent_coverage : [];
    const council = agents.find(
        (a) => a.role === "council" ||
               (a.governance_resident_only && !String(a.nh_id ?? "").includes("."))
    );
    return council ? String(council.nh_id) : null;
}

function deriveDispatchHandle(decl) {
    const gov    = decl.governance ?? {};
    const surf   = gov.governance_surface ?? {};
    const nhRoot = deriveNhRoot(decl);

    return {
        project_id:               decl.project_id,
        domain:                   decl.domain,
        nh_root:                  nhRoot,
        execution_scope:          decl.execution_scope,
        governance_resident_repo: gov.governance_resident_repo,
        agency_config_path:       surf.agency_config ?? "config/agency.yaml",
        council_config_path:      surf.council_config ?? ".nexus/council.config.yaml",
        council_nh_id:            nhRoot,                             // convention: council IS nh_root
        proposer_nh_id:           nhRoot ? `${nhRoot}.1` : null,      // convention: proposer = nh_root + ".1"
        wave_state_current_wave:  decl.wave_state?.current_wave ?? 0,
    };
}

const REQUIRED_HANDLE_FIELDS = [
    "project_id", "domain", "nh_root", "execution_scope",
    "governance_resident_repo", "agency_config_path", "council_config_path",
    "council_nh_id", "proposer_nh_id",
];

function validateDispatchHandle(handle) {
    return REQUIRED_HANDLE_FIELDS.filter((k) => !handle[k]);
}

// --------------------------------------------------
// work packet content builders
// --------------------------------------------------

function buildPacketTitle(motionObj, projectId) {
    const title = String(motionObj.title ?? "").trim();
    return title ? `${title} [${projectId}]` : `Staged project activation: ${projectId}`;
}

function buildPacketPlan(handle) {
    return [
        `Staged project dispatch activation: ${handle.project_id} (${handle.domain})`,
        "",
        "Dispatch handle (WS-E, motion-0091):",
        `  project_id:               ${handle.project_id}`,
        `  domain:                   ${handle.domain}`,
        `  nh_root:                  ${handle.nh_root}`,
        `  execution_scope:          ${handle.execution_scope}`,
        `  governance_resident_repo: ${handle.governance_resident_repo}`,
        `  agency_config_path:       ${handle.agency_config_path}`,
        `  council_config_path:      ${handle.council_config_path}`,
        `  council_nh_id:            ${handle.council_nh_id}`,
        `  proposer_nh_id:           ${handle.proposer_nh_id}`,
        `  wave_state.current_wave:  ${handle.wave_state_current_wave}`,
    ].join("\n");
}

function buildPacketAc(handle) {
    return [
        `- [ ] Architect review of ${handle.project_id} Wave 0 dispatch seam`,
        `- [ ] Confirm all 10 required dispatch handle fields are populated`,
        `- [ ] Confirm ${handle.agency_config_path} exists in ${handle.governance_resident_repo}`,
        `- [ ] Confirm council_nh_id=${handle.council_nh_id} and proposer_nh_id=${handle.proposer_nh_id} appear in agency.yaml`,
        `- [ ] Record governed architect evidence before BUILDER handoff`,
    ].join("\n");
}

// --------------------------------------------------
// create mode (writes to DB)
// --------------------------------------------------

async function runCreate({
    motionId, activationTag, projectTag, routeTag,
    packetTitle, packetPlan, packetAc, repoRoot,
}) {
    if (!process.env.DATABASE_URL) {
        const envPath = path.join(repoRoot, "portal", ".env.local");
        if (exists(envPath)) {
            const { default: dotenv } = await import("dotenv");
            dotenv.config({ path: envPath, override: false });
        }
    }
    if (!process.env.DATABASE_URL) {
        console.error(`[ACTIVATE-STAGED] ERROR: DATABASE_URL is not set.`);
        console.error(`[ACTIVATE-STAGED] Set it in the environment or in portal/.env.local`);
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
        // Idempotency guard: refuse if a live motion-tagged packet exists.
        // Same check as activate-motion.mjs to prevent duplicate creation.
        const existingInbox = await prisma.agentInboxItem.findFirst({
            where: {
                tags:   { has: activationTag },
                status: { notIn: ["DONE", "CANCELED"] },
            },
            select: { id: true, workPacketId: true, status: true },
        });

        if (existingInbox) {
            console.error(`[ACTIVATE-STAGED] REFUSE: Live packet already exists for ${motionId}`);
            console.error(`[ACTIVATE-STAGED] Existing inbox item ID:   ${existingInbox.id}`);
            console.error(`[ACTIVATE-STAGED] Existing work packet ID:  ${existingInbox.workPacketId}`);
            console.error(`[ACTIVATE-STAGED] Existing status:          ${existingInbox.status}`);
            console.error(`[ACTIVATE-STAGED] Resolve or close the existing packet before re-activating.`);
            process.exit(1);
        }

        const result = await prisma.$transaction(async (tx) => {
            const packet = await tx.workPacket.create({
                data: {
                    nhId:   motionId,
                    title:  packetTitle,
                    ac:     packetAc,
                    plan:   packetPlan,
                    status: "DRAFT",
                },
            });

            const inbox = await tx.agentInboxItem.create({
                data: {
                    workPacketId: packet.id,
                    status:   "QUEUED",
                    priority: 60,
                    tags:     [activationTag, projectTag, routeTag],
                },
                select: { id: true, status: true, priority: true, tags: true },
            });

            return { packet, inbox };
        });

        console.log();
        console.log(`[ACTIVATE-STAGED] --- Work packet created ---`);
        console.log(`[ACTIVATE-STAGED] WorkPacket ID:   ${result.packet.id}`);
        console.log(`[ACTIVATE-STAGED] nhId:            ${result.packet.nhId}`);
        console.log(`[ACTIVATE-STAGED] Title:           ${result.packet.title}`);
        console.log(`[ACTIVATE-STAGED] Status:          ${result.packet.status}`);
        console.log(`[ACTIVATE-STAGED] InboxItem ID:    ${result.inbox.id}`);
        console.log(`[ACTIVATE-STAGED] Inbox status:    ${result.inbox.status}`);
        console.log(`[ACTIVATE-STAGED] Inbox priority:  ${result.inbox.priority}`);
        console.log(`[ACTIVATE-STAGED] Tags:            ${JSON.stringify(result.inbox.tags)}`);
        console.log();
        console.log(`[ACTIVATE-STAGED] Staged project packet is now live. Next steps:`);
        console.log(`[ACTIVATE-STAGED]   1. node portal/scripts/enqueue-motion-packet.mjs --motion ${motionId}`);
        console.log(`[ACTIVATE-STAGED]      (requires motion ${motionId} decision.yaml to be RATIFIED)`);
        console.log(`[ACTIVATE-STAGED]   2. pnpm -C portal exec tsx scripts/run-architect-once.ts 6.0.10`);
        console.log();

        process.exit(0);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

// --------------------------------------------------
// main
// --------------------------------------------------

async function main() {
    const args = parseArgs(process.argv);

    if (!args.coverage || !args.motion) {
        console.error(
            `Usage: node portal/scripts/activate-staged-project.mjs \\\n` +
            `         --coverage <coverage-declaration-path> --motion <motionId> [--create]\n` +
            `\n` +
            `  --coverage  Path to coverage-declaration.yaml for the staged project\n` +
            `  --motion    Governing motion ID in dev-jai-nexus (e.g. motion-0096)\n` +
            `  --create    Write to the database (default: dry-run only)\n` +
            `\n` +
            `Example (dry-run):\n` +
            `  node portal/scripts/activate-staged-project.mjs \\\n` +
            `    --coverage out/offbook-ai/coverage-declaration.yaml \\\n` +
            `    --motion motion-0096\n` +
            `\n` +
            `Example (create):\n` +
            `  node portal/scripts/activate-staged-project.mjs \\\n` +
            `    --coverage out/offbook-ai/coverage-declaration.yaml \\\n` +
            `    --motion motion-0096 --create`,
        );
        process.exit(1);
    }

    const repoRoot = findRepoRoot(process.cwd());
    if (!repoRoot) die(`Could not locate repo root (no .nexus directory found).`);

    const coveragePath = path.resolve(process.cwd(), args.coverage);
    const motionId     = String(args.motion).trim();

    console.log(`[ACTIVATE-STAGED] Coverage: ${args.coverage}`);
    console.log(`[ACTIVATE-STAGED] Motion:   ${motionId}`);
    console.log(`[ACTIVATE-STAGED] Mode:     ${args.create ? "CREATE" : "dry-run"}`);
    console.log();

    // Check 1 — coverage-declaration file
    if (!exists(coveragePath)) {
        fail("coverage_file", `Not found: ${args.coverage}`);
    }
    const decl = readYaml(coveragePath, "coverage-declaration.yaml");
    pass("coverage_file", args.coverage);

    // Check 2 — required top-level fields
    for (const f of ["project_id", "domain", "execution_scope", "governance"]) {
        if (!decl[f]) fail("coverage_fields", `Missing required field: ${f}`);
    }
    pass("coverage_fields", `project_id=${decl.project_id}  domain=${decl.domain}`);

    // Check 3 — wave_state
    const wave = decl.wave_state?.current_wave;
    if (wave === undefined || wave === null) {
        fail("wave_state", "Missing wave_state.current_wave in coverage-declaration");
    }
    pass("wave_state", `current_wave=${wave}`);

    // Check 4 — dispatch handle derivation + validation
    const handle      = deriveDispatchHandle(decl);
    const missingFlds = validateDispatchHandle(handle);
    if (missingFlds.length > 0) {
        fail("dispatch_handle", `Missing required handle fields: ${missingFlds.join(", ")}`);
    }
    pass("dispatch_handle", `all ${REQUIRED_HANDLE_FIELDS.length} required fields satisfied`);

    // Check 5 — motion.yaml exists and has a title
    const motionDir      = path.join(repoRoot, ".nexus", "motions", motionId);
    const motionYamlPath = path.join(motionDir, "motion.yaml");
    if (!exists(motionDir)) {
        fail("motion_dir", `Not found: .nexus/motions/${motionId} — scaffold the motion first`);
    }
    if (!exists(motionYamlPath)) {
        fail("motion_yaml", `Missing: .nexus/motions/${motionId}/motion.yaml`);
    }
    const motionObj   = readYaml(motionYamlPath, "motion.yaml");
    const motionTitle = String(motionObj.title ?? "").trim();
    if (!motionTitle) fail("motion_yaml", "motion.yaml has no readable title field.");
    pass("motion_yaml", `title="${motionTitle}"`);

    // Build packet content from validated handle
    const packetTitle = buildPacketTitle(motionObj, decl.project_id);
    const packetPlan  = buildPacketPlan(handle);
    const packetAc    = buildPacketAc(handle);

    const activationTag = `motion:${motionId}`;
    const projectTag    = `project:${decl.project_id}`;
    const routeTag      = "route:ARCHITECT";

    if (!args.create) {
        console.log();
        console.log(`[ACTIVATE-STAGED] --- Dry-run: packet would be created ---`);
        console.log(`[ACTIVATE-STAGED] nhId:    ${motionId}`);
        console.log(`[ACTIVATE-STAGED] title:   ${packetTitle}`);
        console.log(`[ACTIVATE-STAGED] tags:    ${JSON.stringify([activationTag, projectTag, routeTag])}`);
        console.log(`[ACTIVATE-STAGED] plan:`);
        packetPlan.split("\n").forEach((l) => console.log(`[ACTIVATE-STAGED]   ${l}`));
        console.log(`[ACTIVATE-STAGED] ac:`);
        packetAc.split("\n").forEach((l) => console.log(`[ACTIVATE-STAGED]   ${l}`));
        console.log();
        console.log(`[ACTIVATE-STAGED] Re-run with --create to write to the database.`);
        console.log(`[ACTIVATE-STAGED] Note: --create + enqueue-motion-packet.mjs require`);
        console.log(`[ACTIVATE-STAGED]   .nexus/motions/${motionId}/decision.yaml status=RATIFIED.`);
        console.log();
        process.exit(0);
    }

    await runCreate({
        motionId, activationTag, projectTag, routeTag,
        packetTitle, packetPlan, packetAc, repoRoot,
    });
}

main().catch((err) => {
    console.error("[ACTIVATE-STAGED] Unexpected error");
    console.error(err?.stack || err?.message || String(err));
    process.exit(2);
});
