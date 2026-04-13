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
const COST_TAG_PREFIX = "cost:";
const ACTIVATION_OUTCOME_TAG_PREFIX = "activation:";
function buildMotionTag(motionId) {
    return `${MOTION_TAG_PREFIX}${motionId}`;
}
function buildCostCategoryTag(category) {
    return `${COST_TAG_PREFIX}${category}`;
}
function buildActivationOutcomeTag(outcome) {
    return `${ACTIVATION_OUTCOME_TAG_PREFIX}${outcome}`;
}

function isCorpusV2Motion(motionId) {
    const match = /^motion-(\d+)$/.exec(String(motionId).trim());
    if (!match) return false;
    return Number(match[1]) >= 125;
}

function parseCorpusCostEstimate(executionMdText) {
    const categoryMatch = executionMdText.match(/^Category:\s*\[?\s*(minimal|standard|substantial|major)\s*\]?/im);
    const basisMatch = executionMdText.match(/^Basis:\s*(.+)$/im);
    return {
        category: categoryMatch ? categoryMatch[1].toLowerCase() : null,
        basis: basisMatch ? basisMatch[1].trim() : null,
    };
}

function deriveCorpusTierHint(category) {
    if (category === "minimal" || category === "standard") return "tier1";
    if (category === "substantial" || category === "major") return "tier2";
    return null;
}

function evaluateCorpusActivation({ motionId, executionMdPresent, executionMdText }) {
    if (!isCorpusV2Motion(motionId)) {
        return {
            applies: false,
            outcome: "PROCEED",
            costCategory: null,
            basis: null,
            reasons: [],
        };
    }

    if (!executionMdPresent) {
        return {
            applies: true,
            outcome: "BLOCK",
            costCategory: null,
            basis: null,
            reasons: ["Corpus V2 activation requires execution.md with a declared cost category."],
        };
    }

    const parsed = parseCorpusCostEstimate(executionMdText);
    if (!parsed.category || !parsed.basis) {
        return {
            applies: true,
            outcome: "BLOCK",
            costCategory: parsed.category,
            basis: parsed.basis,
            reasons: [
                "Corpus V2 activation requires a cost estimate block in execution.md.",
                "Expected: Category: [minimal|standard|substantial|major] and Basis: ...",
            ],
        };
    }

    if (parsed.category === "substantial" || parsed.category === "major") {
        return {
            applies: true,
            outcome: "ESCALATE",
            costCategory: parsed.category,
            basis: parsed.basis,
            reasons: [
                `Corpus V2 declared cost category is "${parsed.category}", which requires operator escalation before live activation.`,
            ],
        };
    }

    return {
        applies: true,
        outcome: "PROCEED",
        costCategory: parsed.category,
        basis: parsed.basis,
        reasons: [`Corpus V2 declared cost category "${parsed.category}" is within direct activation bounds.`],
    };
}

function writeActivationArtifact({
    motionDir,
    motionId,
    decisionStatus,
    handoffId,
    targetRepo,
    targetDomain,
    packetTitle,
    routeTag,
    activationTag,
    createRequested,
    packetId = null,
    inboxItemId = null,
    activation,
}) {
    const artifactPath = path.join(motionDir, "execution.activation.json");
    const artifact = {
        version: "0.1",
        protocol: "corpus-v2-live-value-activation",
        motion_id: motionId,
        recorded_at: new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z"),
        create_requested: createRequested,
        decision_status: decisionStatus,
        handoff_id: handoffId,
        target_repo: targetRepo,
        target_domain: targetDomain,
        packet_title: packetTitle,
        activation_tag: activationTag,
        route_tag: routeTag,
        corpus_v2: {
            applies: activation.applies,
            cost_category: activation.costCategory,
            cost_basis: activation.basis,
            tier_hint: deriveCorpusTierHint(activation.costCategory),
            requires_operator_escalation: activation.outcome === "ESCALATE",
            outcome: activation.outcome,
            reasons: activation.reasons,
        },
        work_packet_id: packetId,
        inbox_item_id: inboxItemId,
    };
    fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2) + "\n", "utf8");
    return artifactPath;
}

function syncHandoffCorpusV2({
    handoffPath,
    activationArtifactPath,
    activationArtifact,
}) {
    if (!exists(handoffPath)) return;
    const handoff = readJson(handoffPath, "execution.handoff.json");
    const existingCorpus = handoff.corpus_v2 && typeof handoff.corpus_v2 === "object" ? handoff.corpus_v2 : {};
    const next = {
        ...handoff,
        corpus_v2: {
            ...existingCorpus,
            cost_category: activationArtifact.corpus_v2.cost_category,
            cost_basis: activationArtifact.corpus_v2.cost_basis,
            tier_hint: activationArtifact.corpus_v2.tier_hint,
            requires_operator_escalation: activationArtifact.corpus_v2.requires_operator_escalation,
            activation_outcome: activationArtifact.corpus_v2.outcome,
            activation_recorded_at: activationArtifact.recorded_at,
            activation_artifact: handoff.inputs?.motion
                ? path.relative(path.dirname(handoffPath), activationArtifactPath).split(path.sep).join("/")
                : path.basename(activationArtifactPath),
            activation_reasons: activationArtifact.corpus_v2.reasons,
        },
    };
    fs.writeFileSync(handoffPath, JSON.stringify(next, null, 2) + "\n", "utf8");
}

// --------------------------------------------------
// create mode
// --------------------------------------------------

async function runCreate({
    motionId,
    activationTag,
    routeTag,
    packetTitle,
    repoRoot,
    extraTags = [],
}) {
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

    // Prisma v7 requires the PrismaPg adapter for PostgreSQL connections.
    // Use DIRECT_URL first (bypasses transaction pooler), fall back to DATABASE_URL.
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { default: pg } = await import("pg");
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

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
                    tags: [activationTag, routeTag, ...extraTags],
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

        return result;
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
        const executionMdText = executionMdPresent ? readText(executionMdPath) : null;
        if (executionMdPresent) {
            pass("execution_md", `present (WS-2 context binding ready)`);
        } else {
            warn("execution_md", `absent — WS-2 agent context binding will not be available`);
        }

        const activation = evaluateCorpusActivation({
            motionId,
            executionMdPresent,
            executionMdText,
        });

        const costTag = activation.costCategory ? buildCostCategoryTag(activation.costCategory) : null;
        const outcomeTag = buildActivationOutcomeTag(activation.outcome);
        const extraTags = [costTag, outcomeTag].filter(Boolean);

        // --------------------------------------------------
        // Derived activation params
        // --------------------------------------------------
        const activationTag = buildMotionTag(motionId);
        const routeTag      = `route:ARCHITECT`;
        const packetTitle   = `[${motionId}] ${motionTitle}`;

        const activationArtifactPath = writeActivationArtifact({
            motionDir,
            motionId,
            decisionStatus,
            handoffId,
            targetRepo,
            targetDomain: firstNonEmpty(decisionObj.target_domain, motionObj?.target?.domain),
            packetTitle,
            routeTag,
            activationTag,
            createRequested: args.create,
            activation,
        });
        const activationArtifact = readJson(activationArtifactPath, "execution.activation.json");
        syncHandoffCorpusV2({
            handoffPath,
            activationArtifactPath,
            activationArtifact,
        });

        if (activation.applies) {
            pass(
                "corpus_v2_activation",
                `outcome=${activation.outcome} cost=${activation.costCategory ?? "(missing)"} artifact=.nexus/motions/${motionId}/execution.activation.json`
            );
            if (activation.basis) {
                console.log(`[ACTIVATE-MOTION] Corpus V2 basis: ${activation.basis}`);
            }
            for (const reason of activation.reasons) {
                console.log(`[ACTIVATE-MOTION] Corpus V2 note:  ${reason}`);
            }
        }

        if (activation.outcome === "BLOCK") {
            fail(
                "corpus_v2_cost_gate",
                `Activation blocked by Corpus V2 cost gate.\n` +
                `  Artifact: ${path.relative(repoRoot, activationArtifactPath).split(path.sep).join("/")}\n` +
                `  Reason: ${activation.reasons.join(" ")}`
            );
        }

        if (activation.outcome === "ESCALATE" && args.create) {
            fail(
                "corpus_v2_escalation_gate",
                `Create refused by Corpus V2 escalation gate.\n` +
                `  Declared cost category: ${activation.costCategory}\n` +
                `  Artifact: ${path.relative(repoRoot, activationArtifactPath).split(path.sep).join("/")}\n` +
                `  Use dry-run output and operator review before bounded live activation.`
            );
        }

        // Escalation lifecycle block: refuse --create when escalation.yaml is ACTIVE+blocking.
        // Only applies in --create mode; dry-run is never blocked (operator can still inspect).
        //
        // Safe-default rules — none of these conditions produce a block:
        //   - No escalation.yaml present        → no block (file absence is not an escalation)
        //   - escalation.yaml parse error        → no block (cannot confirm ACTIVE state)
        //   - status !== "ACTIVE" (or missing)   → no block (RESOLVED, null, unknown → proceed)
        //   - blocking !== true (strict)          → no block (truthy non-booleans not accepted)
        //
        // Only status === "ACTIVE" AND blocking === true together produce a block.
        if (args.create) {
            const _escalYamlPath = path.join(motionDir, "escalation.yaml");
            if (exists(_escalYamlPath)) {
                try {
                    const _escalObj = yaml.load(readText(_escalYamlPath));
                    if (_escalObj?.status === "ACTIVE" && _escalObj?.blocking === true) {
                        fail(
                            "escalation_lifecycle_block",
                            `Create refused: escalation.yaml is ACTIVE with blocking=true.\n` +
                            `  Reason: ${_escalObj.reason ?? "see escalation.yaml"}\n` +
                            `  Resolve the escalation before activating this motion.`
                        );
                    }
                } catch {
                    // Parse error → cannot confirm ACTIVE+blocking → do not block activation.
                    // A malformed escalation.yaml must not prevent unrelated work packet creation.
                    // Correct response is to repair the file, not to veto the activation.
                }
            }
        }

        if (args.create) {
            // Real creation path (WS-1 phase 2)
            console.log();
            console.log(`[ACTIVATE-MOTION] All preconditions passed. Creating work packet...`);
            const result = await runCreate({
                motionId,
                activationTag,
                routeTag,
                packetTitle,
                repoRoot,
                extraTags,
            });
            writeActivationArtifact({
                motionDir,
                motionId,
                decisionStatus,
                handoffId,
                targetRepo,
                targetDomain: firstNonEmpty(decisionObj.target_domain, motionObj?.target?.domain),
                packetTitle,
                routeTag,
                activationTag,
                createRequested: true,
                packetId: result.packet.id,
                inboxItemId: result.inbox.id,
                activation,
            });
            const updatedActivationArtifact = readJson(activationArtifactPath, "execution.activation.json");
            syncHandoffCorpusV2({
                handoffPath,
                activationArtifactPath,
                activationArtifact: updatedActivationArtifact,
            });
            process.exit(0);
        } else {
            // Dry-run output (WS-1 phase 1 behavior — unchanged)
            console.log();
            console.log(`[ACTIVATE-MOTION] --- Activation intent (dry-run) ---`);
            console.log(`[ACTIVATE-MOTION] Activation tag:   ${activationTag}`);
            console.log(`[ACTIVATE-MOTION] Route tag:        ${routeTag}`);
            if (costTag) console.log(`[ACTIVATE-MOTION] Cost tag:         ${costTag}`);
            console.log(`[ACTIVATE-MOTION] Outcome tag:      ${outcomeTag}`);
            console.log(`[ACTIVATE-MOTION] Handoff ID:       ${handoffId}`);
            console.log(`[ACTIVATE-MOTION] Target repo:      ${targetRepo}`);
            console.log(`[ACTIVATE-MOTION] Packet title:     ${packetTitle}`);
            console.log(`[ACTIVATE-MOTION] Tags:             ${JSON.stringify([activationTag, routeTag, ...extraTags])}`);
            console.log(`[ACTIVATE-MOTION] execution.md:     ${executionMdPresent ? "PRESENT" : "ABSENT"}`);
            if (activation.applies) {
                console.log(`[ACTIVATE-MOTION] Corpus V2:       ${activation.outcome}`);
            }
            console.log();
            console.log(
                activation.outcome === "ESCALATE"
                    ? `[ACTIVATE-MOTION] This motion requires operator escalation before live activation.`
                    : `[ACTIVATE-MOTION] This motion is ACTIVATABLE.`
            );
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
