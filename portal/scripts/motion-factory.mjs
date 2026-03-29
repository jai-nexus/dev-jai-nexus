#!/usr/bin/env node
/**
 * Motion Factory v0
 *
 * Commands:
 *   node portal/scripts/motion-factory.mjs context  --intent "..." [--json]
 *   node portal/scripts/motion-factory.mjs draft    --intent "..." [--no-api] [--provider openai|anthropic] [--preview]
 *   node portal/scripts/motion-factory.mjs promote  --candidate <candidateId> [--no-api] [--provider openai|anthropic] [--preview]
 *   node portal/scripts/motion-factory.mjs revise   --motion motion-NNNN --notes "..." [--files f1,f2] [--provider openai|anthropic] [--preview]
 *   node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file path [--notes "..."] [--files f1,f2] [--provider openai|anthropic] [--preview]
 *   node portal/scripts/motion-factory.mjs status   [--json]
 *
 * context:
 *   Gathers bounded repo-native context from .nexus/ surfaces and prints
 *   a structured summary to stdout. No files written. No API calls.
 *
 * draft:
 *   Creates a 9-file motion package in DRAFT state.
 *   - Structural files remain deterministic.
 *   - Narrative files are either:
 *       a) placeholder scaffolds (--no-api), or
 *       b) model-generated draft content via the selected provider.
 *   - --preview uses the same validation and provider-generation path as apply mode,
 *     but prints the full proposed 9-file package instead of writing files.
 *   - Preview creates no directory and does not reserve motion numbering.
 *
 * promote:
 *   Creates a numbered formal motion draft from an existing candidate artifact.
 *   - Reuses the same draft package-construction path as draft.
 *   - Skips candidate emission because the candidate already exists.
 *   - Writes promotion.json for durable lineage.
 *   - --preview prints the proposed package and promotion.json without writing files.
 *
 * revise:
 *   Updates selected narrative files in an existing motion draft from human notes.
 *   - Narrower than draft: only touches narrative files.
 *   - Atomic apply behavior remains unchanged.
 *   - Structural governance files are never revised.
 *   - --preview uses the same validation and provider-generation path as apply mode,
 *     but prints proposed content instead of writing files.
 *
 * evidence:
 *   Inserts human-provided proof evidence into targeted narrative files.
 *   - Evidence-fed, not evidence-inventing. Source material from operator only.
 *   - Model may quote, organize, summarize, or place provided evidence.
 *   - Model may NOT invent PASS/FAIL claims, upgrade ambiguity, or add results
 *     not present in the evidence file.
 *   - Atomic apply behavior remains unchanged.
 *   - Narrower than revise: never touches motion.yaml.
 *   - --preview uses the same validation and provider-generation path as apply mode,
 *     but prints proposed content instead of writing files.
 *
 * status:
 *   Prints a live local status snapshot for Motion Factory v0.
 *   - No files written.
 *   - No API calls.
 *   - Safe to run anytime.
 *   - Key presence is environmental only; it does not validate correctness,
 *     funding, provider reachability, or live API readiness.
 *
 * Output contract (stable for future consumers):
 *   intent, next_motion_id, branch, head_commit, recent_motions,
 *   staffing_summary, panel_summary, governance_summary
 */

import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import yaml from "js-yaml";

const SCRIPT_VERSION = "motion-factory.v0";
const RECENT_MOTION_WINDOW = 5;

const OPENAI_MODEL = "gpt-5-mini";
const ANTHROPIC_MODEL = "claude-sonnet-4-6";

const SUPPORTED_PROVIDERS = new Set(["openai", "anthropic"]);
const DEFAULT_PROVIDER = "openai";

const STANDARD_MOTION_FILES = [
    "motion.yaml",
    "proposal.md",
    "challenge.md",
    "execution.md",
    "policy.yaml",
    "decision.yaml",
    "decision.md",
    "vote.json",
    "verify.json",
];

const AVAILABLE_COMMANDS = ["context", "draft", "promote", "revise", "evidence", "status"];

const ALLOWED_REVISE_FILES = new Set([
    "proposal.md",
    "challenge.md",
    "execution.md",
    "motion.yaml",
]);

const DEFAULT_REVISE_FILES = [
    "proposal.md",
    "challenge.md",
    "execution.md",
];

const ALLOWED_EVIDENCE_FILES = new Set([
    "proposal.md",
    "execution.md",
    "challenge.md",
]);

const DEFAULT_EVIDENCE_FILES = [
    "proposal.md",
    "execution.md",
];

const PROTECTED_FILES = [
    "policy.yaml",
    "decision.yaml",
    "decision.md",
    "vote.json",
    "verify.json",
];

const MOTION_YAML_STRUCTURAL_FIELDS = new Set([
    "motion_id",
    "title",
    "status",
    "created_at",
    "owner",
    "target",
    "vote",
]);

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function die(msg) {
    console.error(`\n[MOTION-FACTORY] ERROR: ${msg}\n`);
    process.exit(1);
}

function log(msg) {
    console.log(`[MOTION-FACTORY] ${msg}`);
}

function providerName(provider) {
    return provider === "anthropic" ? "Anthropic" : "OpenAI";
}

function providerLabel(provider) {
    return `model-generated (${providerName(provider)})`;
}

function findRepoRoot(startDir) {
    let cur = startDir;
    for (let i = 0; i < 8; i++) {
        const nexusDir = path.join(cur, ".nexus");
        if (fssync.existsSync(nexusDir)) return cur;
        const parent = path.dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return null;
}

function git(repoRoot, args) {
    try {
        return execFileSync("git", args, {
            cwd: repoRoot,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        }).trim();
    } catch {
        return "(unknown)";
    }
}

function safeYamlLoad(text, label) {
    try {
        const obj = yaml.load(text);
        if (!obj || typeof obj !== "object") return null;
        return obj;
    } catch (err) {
        die(`Failed to parse YAML for ${label}: ${err?.message || String(err)}`);
    }
}

async function exists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function readText(p) {
    return await fs.readFile(p, "utf8");
}

function parseArgs(argv) {
    const args = { _: [] };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith("--")) {
            const key = a.slice(2);
            const next = argv[i + 1];
            if (!next || next.startsWith("--")) {
                args[key] = true;
            } else {
                args[key] = next;
                i++;
            }
        } else {
            args._.push(a);
        }
    }
    return args;
}

function resolveProvider(args) {
    const provider = args.provider ? String(args.provider).toLowerCase() : DEFAULT_PROVIDER;
    if (!SUPPORTED_PROVIDERS.has(provider)) {
        die(`Unknown provider: "${provider}"\n  Supported: ${[...SUPPORTED_PROVIDERS].join(", ")}`);
    }
    return provider;
}

function requireApiKey(provider) {
    if (provider === "anthropic") {
        const key = process.env.ANTHROPIC_API_KEY;
        if (!key) {
            die(`Missing ANTHROPIC_API_KEY. Set it in your environment for --provider anthropic.`);
        }
        return key;
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
        die(`Missing OPENAI_API_KEY. Set it in your environment or use --no-api.`);
    }
    return key;
}

function utcNow() {
    return new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z");
}

function stableJson(obj) {
    return JSON.stringify(obj, null, 2) + "\n";
}

function yamlEscape(value) {
    return String(value ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function blockText(text, indent = 2) {
    const normalized = String(text ?? "").trim() || "Draft scaffold — content pending.";
    const pad = " ".repeat(indent);
    return normalized
        .split("\n")
        .map((line) => `${pad}${line}`)
        .join("\n");
}

function yamlList(items, indent = 0) {
    const values =
        Array.isArray(items) && items.length > 0
            ? items
            : ["Draft scaffold — content pending."];
    const pad = " ".repeat(indent);
    return values.map((item) => `${pad}- "${yamlEscape(item)}"`).join("\n");
}

function stripMarkdownFences(text) {
    const raw = String(text ?? "").trim();
    if (!raw.startsWith("```")) return raw;
    return raw.replace(/^```[a-zA-Z0-9_-]*\s*/, "").replace(/\s*```$/, "").trim();
}

function extractOutputText(payload) {
    const output = Array.isArray(payload?.output) ? payload.output : [];
    for (const item of output) {
        if (item?.type === "message" && Array.isArray(item?.content)) {
            for (const c of item.content) {
                if (c?.type === "output_text" && typeof c?.text === "string") {
                    return c.text;
                }
            }
        }
    }
    throw new Error("OpenAI response did not contain output_text.");
}

function parseMarkedFiles(raw, targetFiles) {
    const results = {};
    for (const filename of targetFiles) {
        const startMarker = `=== FILE: ${filename} ===`;
        const endMarker = `=== END FILE ===`;
        const startIdx = raw.indexOf(startMarker);
        if (startIdx === -1) continue;

        const contentStart = startIdx + startMarker.length;
        const endIdx = raw.indexOf(endMarker, contentStart);
        if (endIdx === -1) continue;

        const content = raw.slice(contentStart, endIdx).trim();
        if (content) {
            results[filename] = `${content}\n`;
        }
    }
    return results;
}

function mergeMotionYamlNarrative(existingYaml, revisedContent) {
    const existing = safeYamlLoad(existingYaml, "motion.yaml (existing)");
    if (!existing) return existingYaml;

    const revised = safeYamlLoad(revisedContent, "motion.yaml (revised)");
    if (!revised) return existingYaml;

    const merged = { ...existing };
    for (const [key, value] of Object.entries(revised)) {
        if (!MOTION_YAML_STRUCTURAL_FIELDS.has(key)) {
            merged[key] = value;
        }
    }

    return yaml.dump(merged, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
        forceQuotes: false,
    });
}

function printPreviewFiles({
    motionId,
    operation,
    headerLines = [],
    targetFiles,
    contentsByFile,
    footerLines = [],
}) {
    log(`Preview for ${motionId} (${operation})`);
    for (const line of headerLines) {
        log(line);
    }
    log(`Status:        PREVIEW ONLY — proposed content not applied`);
    log(`─────────────────────────────────────────`);

    for (const f of targetFiles) {
        log(`=== BEGIN PREVIEW FILE: ${f} ===`);
        process.stdout.write(contentsByFile[f] ?? "");
        if (!String(contentsByFile[f] ?? "").endsWith("\n")) {
            process.stdout.write("\n");
        }
        log(`=== END PREVIEW FILE: ${f} ===`);
    }

    log(`─────────────────────────────────────────`);
    log(`⚠  PREVIEW ONLY — no files were written.`);
    log(`   This preview used the same validation and provider-generation path as apply mode.`);
    for (const line of footerLines) {
        log(line);
    }
    log(`   To apply, run the same command without --preview.`);
    log(`─────────────────────────────────────────`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Execution surface reader (read-only, derived display state)
// ──────────────────────────────────────────────────────────────────────────────

async function safeJsonRead(filePath) {
    if (!(await exists(filePath))) return { data: null, error: null };
    try {
        const raw = await readText(filePath);
        const obj = JSON.parse(raw);
        if (!obj || typeof obj !== "object") return { data: null, error: "parsed value is not an object" };
        return { data: obj, error: null };
    } catch (err) {
        return { data: null, error: err.message || String(err) };
    }
}

async function readExecutionSurface(motionDir) {
    const decisionPath = path.join(motionDir, "decision.yaml");
    let governance_status = null;
    if (await exists(decisionPath)) {
        const dec = safeYamlLoad(await readText(decisionPath), "decision.yaml");
        if (dec?.status) governance_status = String(dec.status).trim();
    }

    const handoff = await safeJsonRead(path.join(motionDir, "execution.handoff.json"));
    const handoff_exists = handoff.data !== null || handoff.error !== null;
    const handoff_status = handoff.data?.status ? String(handoff.data.status) : null;
    const handoff_id = handoff.data?.handoff_id ? String(handoff.data.handoff_id) : null;
    const issued_at = handoff.data?.issued_at ? String(handoff.data.issued_at) : null;
    const handoff_error = handoff.error || null;

    const receipt = await safeJsonRead(path.join(motionDir, "execution.receipt.json"));
    const receipt_exists = receipt.data !== null || receipt.error !== null;
    const receipt_status = receipt.data?.status ? String(receipt.data.status) : null;
    const receipt_id = receipt.data?.receipt_id ? String(receipt.data.receipt_id) : null;
    const actor = receipt.data?.actor ? String(receipt.data.actor) : null;
    const acknowledged_at = receipt.data?.acknowledged_at ? String(receipt.data.acknowledged_at) : null;
    const started_at = receipt.data?.started_at ? String(receipt.data.started_at) : null;
    const finished_at = receipt.data?.finished_at ? String(receipt.data.finished_at) : null;
    const receipt_error = receipt.error || null;

    let execution_summary;
    if (handoff_error || receipt_error) {
        execution_summary = "INVALID_EXECUTION_ARTIFACT";
    } else if (receipt_exists && receipt_status) {
        execution_summary = `RECEIPT_${receipt_status.toUpperCase()}`;
    } else if (handoff_exists && handoff_status) {
        execution_summary = `HANDOFF_${handoff_status.toUpperCase()}`;
    } else if (governance_status && governance_status.toUpperCase() === "RATIFIED") {
        execution_summary = "RATIFIED_NO_HANDOFF";
    } else {
        execution_summary = "NO_EXECUTION_STATE";
    }

    return {
        governance_status,
        handoff_exists, handoff_status, handoff_id, issued_at, handoff_error,
        receipt_exists, receipt_status, receipt_id, actor, acknowledged_at, started_at, finished_at, receipt_error,
        execution_summary,
    };
}

// ──────────────────────────────────────────────────────────────────────────────
// Candidate enumeration
// ──────────────────────────────────────────────────────────────────────────────

async function enumerateCandidates(repoRoot) {
    const candidatesDir = path.join(repoRoot, ".nexus", "candidates");
    if (!(await exists(candidatesDir))) {
        return { candidates: [], skipped_malformed: 0 };
    }

    const entries = await fs.readdir(candidatesDir, { withFileTypes: true });
    const jsonFiles = entries
        .filter((e) => e.isFile() && e.name.endsWith(".json"))
        .map((e) => e.name);

    const candidates = [];
    let skipped_malformed = 0;

    for (const filename of jsonFiles) {
        const fp = path.join(candidatesDir, filename);
        try {
            const raw = await readText(fp);
            const obj = JSON.parse(raw);
            if (!obj.candidateId || !obj.intent) {
                console.error(`[MOTION-FACTORY] Warning: skipping malformed candidate file (missing candidateId or intent): ${filename}`);
                skipped_malformed++;
                continue;
            }
            candidates.push({
                candidateId: String(obj.candidateId),
                intent: String(obj.intent),
                status: String(obj.status || "unknown"),
                createdAt: String(obj.createdAt || ""),
                targetMotionId: String(obj.targetMotionId || ""),
                source: String(obj.source || ""),
                provider: String(obj.provider || ""),
                noApi: !!obj.noApi,
                version: String(obj.version || ""),
            });
        } catch (err) {
            console.error(`[MOTION-FACTORY] Warning: skipping malformed candidate file: ${filename} (${err.message})`);
            skipped_malformed++;
        }
    }

    candidates.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return { candidates, skipped_malformed };
}

async function enumerateMotions(repoRoot) {
    const motionsDir = path.join(repoRoot, ".nexus", "motions");
    if (!(await exists(motionsDir))) return [];

    const entries = await fs.readdir(motionsDir, { withFileTypes: true });
    return entries
        .filter((e) => e.isDirectory() && MOTION_DIR_RE.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => {
            const na = parseInt(a.replace("motion-", ""), 10);
            const nb = parseInt(b.replace("motion-", ""), 10);
            return na - nb;
        });
}

const MOTION_DIR_RE = /^motion-(\d+)$/;

function formatMotionId(num) {
    return `motion-${String(num).padStart(4, "0")}`;
}

function motionIdToNumber(id) {
    const match = MOTION_DIR_RE.exec(String(id).trim());
    if (!match) return null;
    return parseInt(match[1], 10);
}

function buildMotionInventory(motionDirs) {
    const numbers = motionDirs
        .map((id) => motionIdToNumber(id))
        .filter((n) => Number.isInteger(n))
        .sort((a, b) => a - b);

    const existingMotionDirectoryCount = numbers.length;
    const highestDiscoveredMotionNumber =
        numbers.length > 0 ? numbers[numbers.length - 1] : 0;
    const highestDiscoveredMotionId =
        highestDiscoveredMotionNumber > 0
            ? formatMotionId(highestDiscoveredMotionNumber)
            : null;

    const seen = new Set(numbers);
    const missingMotionIds = [];
    for (let n = 1; n <= highestDiscoveredMotionNumber; n++) {
        if (!seen.has(n)) missingMotionIds.push(formatMotionId(n));
    }

    const nextMotionNumber =
        highestDiscoveredMotionNumber > 0
            ? highestDiscoveredMotionNumber + 1
            : 1;

    return {
        existing_motion_directory_count: existingMotionDirectoryCount,
        highest_discovered_motion_number: highestDiscoveredMotionNumber,
        highest_discovered_motion_id: highestDiscoveredMotionId,
        next_motion_id: formatMotionId(nextMotionNumber),
        missing_motion_ids: missingMotionIds,
        has_gaps: missingMotionIds.length > 0,
    };
}

function nextMotionId(motionDirs) {
    return buildMotionInventory(motionDirs).next_motion_id;
}

async function readRecentMotions(repoRoot, motionDirs, window) {
    const recent = motionDirs.slice(-window);
    const results = [];

    for (const dir of recent) {
        const motionYamlPath = path.join(repoRoot, ".nexus", "motions", dir, "motion.yaml");
        const decisionYamlPath = path.join(repoRoot, ".nexus", "motions", dir, "decision.yaml");

        let title = "(unknown)";
        let status = "(unknown)";

        if (await exists(motionYamlPath)) {
            const obj = safeYamlLoad(await readText(motionYamlPath), `${dir}/motion.yaml`);
            if (obj?.title) title = String(obj.title).trim();
            if (obj?.status) status = String(obj.status).trim();
        }

        if (await exists(decisionYamlPath)) {
            const dec = safeYamlLoad(await readText(decisionYamlPath), `${dir}/decision.yaml`);
            if (dec?.status) status = String(dec.status).trim();
        }

        const execution = await readExecutionSurface(
            path.join(repoRoot, ".nexus", "motions", dir)
        );
        results.push({ motion_id: dir, title, status, execution });
    }

    return results;
}

// ──────────────────────────────────────────────────────────────────────────────
// Config summaries
// ──────────────────────────────────────────────────────────────────────────────

async function readStaffingSummary(repoRoot) {
    const p = path.join(repoRoot, ".nexus", "model-slots-phase1.yaml");
    if (!(await exists(p))) return { available: false };

    const obj = safeYamlLoad(await readText(p), "model-slots-phase1.yaml");
    if (!obj) return { available: false };

    const slots = obj.slots || {};
    const deferred = obj.deferred_slots || {};
    const voting = obj.voting || {};
    const providers =
        obj.providers?.allowlist || Object.keys(obj.providers?.catalog || obj.providers || {});

    const liveSlots = Object.values(slots).filter((s) => s?.live === true).length;
    const deferredCount = Object.keys(deferred).length;
    const votingRoles = Object.keys(voting);

    return {
        available: true,
        providers: Array.isArray(providers) ? providers : [],
        live_slots: liveSlots,
        deferred_selectors: deferredCount,
        voting_roles: votingRoles,
    };
}

async function readPanelSummary(repoRoot) {
    const p = path.join(repoRoot, ".nexus", "agent-panels.yaml");
    if (!(await exists(p))) return { available: false };

    const obj = safeYamlLoad(await readText(p), "agent-panels.yaml");
    if (!obj?.panels) return { available: false };

    const panels = obj.panels;
    const panelIds = Object.keys(panels);
    const panelDetails = panelIds.map((id) => {
        const spec = panels[id];
        const candidates = Array.isArray(spec?.candidates) ? spec.candidates.length : 0;
        const selectorStatus = spec?.selector?.status || "unknown";
        return {
            panel_id: id,
            candidates,
            selector_status: selectorStatus,
        };
    });

    return {
        available: true,
        panel_count: panelIds.length,
        panels: panelDetails,
    };
}

async function readGovernanceSummary(repoRoot) {
    const p = path.join(repoRoot, ".nexus", "council.config.yaml");
    if (!(await exists(p))) return { available: false };

    const obj = safeYamlLoad(await readText(p), "council.config.yaml");
    if (!obj) return { available: false };

    const voting = obj.voting || {};

    return {
        available: true,
        version: obj.version || "(unknown)",
        vote_mode: voting.default_mode || "(unknown)",
        required_roles: voting.required_roles || [],
        allow_yes_with_reservations: voting.allow_yes_with_reservations ?? false,
        max_amendment_rounds: voting.max_amendment_rounds ?? 0,
        any_no_blocks: voting.any_no_blocks ?? true,
    };
}

// ──────────────────────────────────────────────────────────────────────────────
// Context builder / command
// ──────────────────────────────────────────────────────────────────────────────

async function buildContext(repoRoot, intent) {
    const branch = git(repoRoot, ["rev-parse", "--abbrev-ref", "HEAD"]);
    const headCommit = git(repoRoot, ["rev-parse", "--short", "HEAD"]);

    const motionDirs = await enumerateMotions(repoRoot);
    const motionInventory = buildMotionInventory(motionDirs);
    const nextId = motionInventory.next_motion_id;
    const recentMotions = await readRecentMotions(repoRoot, motionDirs, RECENT_MOTION_WINDOW);

    const staffingSummary = await readStaffingSummary(repoRoot);
    const panelSummary = await readPanelSummary(repoRoot);
    const governanceSummary = await readGovernanceSummary(repoRoot);

    const candidateDiscovery = await enumerateCandidates(repoRoot);
    const recentCandidates = candidateDiscovery.candidates.slice(0, RECENT_MOTION_WINDOW);

    return {
        version: SCRIPT_VERSION,
        intent,
        next_motion_id: nextId,
        branch,
        head_commit: headCommit,
        total_motions: motionInventory.existing_motion_directory_count,
        recent_motions: recentMotions,
        recent_candidates: recentCandidates.map((c) => ({
            candidateId: c.candidateId,
            intent: c.intent,
            status: c.status,
            createdAt: c.createdAt,
            targetMotionId: c.targetMotionId,
        })),
        candidates_skipped_malformed: candidateDiscovery.skipped_malformed,
        staffing_summary: staffingSummary,
        panel_summary: panelSummary,
        governance_summary: governanceSummary,
    };
}

async function contextCommand({ repoRoot, intent, jsonOutput }) {
    const context = await buildContext(repoRoot, intent);

    if (jsonOutput) {
        console.log(JSON.stringify(context, null, 2));
        return;
    }

    log(`Context for Motion Factory v0`);
    log(`─────────────────────────────────────────`);
    log(`Intent:          ${context.intent}`);
    log(`Next motion ID:  ${context.next_motion_id}`);
    log(`Branch:          ${context.branch}`);
    log(`Head commit:     ${context.head_commit}`);
    log(`Total motions:   ${context.total_motions}`);
    log(``);
    log(`Recent motions:`);
    for (const m of context.recent_motions) {
        const exec = m.execution?.execution_summary || "NO_EXECUTION_STATE";
        log(`  ${m.motion_id}: ${m.title} [${m.status}] -> ${exec}`);

        if (m.execution?.handoff_exists) {
            log(
                `    handoff: ${m.execution.handoff_status || "(unknown)"} ` +
                `${m.execution.handoff_id ? `[${m.execution.handoff_id}]` : ""}`
            );
        }

        if (m.execution?.receipt_exists) {
            log(
                `    receipt: ${m.execution.receipt_status || "(unknown)"} ` +
                `${m.execution.receipt_id ? `[${m.execution.receipt_id}]` : ""}` +
                `${m.execution.actor ? ` actor=${m.execution.actor}` : ""}`
            );
        }

        if (m.execution?.handoff_error) {
            log(`    handoff_error: ${m.execution.handoff_error}`);
        }

        if (m.execution?.receipt_error) {
            log(`    receipt_error: ${m.execution.receipt_error}`);
        }
    }
    log(``);
    log(`Recent candidates:`);
    if (context.recent_candidates.length > 0) {
        for (const c of context.recent_candidates) {
            log(`  ${c.candidateId}: ${c.intent} [${c.status}] → ${c.targetMotionId}`);
        }
    } else {
        log(`  (none)`);
    }
    if (context.candidates_skipped_malformed > 0) {
        log(`  (${context.candidates_skipped_malformed} malformed candidate file(s) skipped)`);
    }
    log(``);
    log(`Governance:`);
    if (context.governance_summary.available) {
        log(`  Config version:  ${context.governance_summary.version}`);
        log(`  Vote mode:       ${context.governance_summary.vote_mode}`);
        log(`  Required roles:  ${context.governance_summary.required_roles.join(", ")}`);
        log(`  Any NO blocks:   ${context.governance_summary.any_no_blocks}`);
    } else {
        log(`  (council.config.yaml not found)`);
    }
    log(``);
    log(`Staffing:`);
    if (context.staffing_summary.available) {
        log(`  Providers:          ${context.staffing_summary.providers.join(", ")}`);
        log(`  Live slots:         ${context.staffing_summary.live_slots}`);
        log(`  Deferred selectors: ${context.staffing_summary.deferred_selectors}`);
        log(`  Voting roles:       ${context.staffing_summary.voting_roles.join(", ")}`);
    } else {
        log(`  (model-slots-phase1.yaml not found)`);
    }
    log(``);
    log(`Panels:`);
    if (context.panel_summary.available) {
        log(`  Panel count: ${context.panel_summary.panel_count}`);
        for (const p of context.panel_summary.panels) {
            log(`  ${p.panel_id}: ${p.candidates} candidates, selector ${p.selector_status}`);
        }
    } else {
        log(`  (agent-panels.yaml not found)`);
    }
    log(`─────────────────────────────────────────`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Status command
// ──────────────────────────────────────────────────────────────────────────────

function buildStatusSnapshot({ repoRoot, branch, motionInventory, candidateDiscovery, executionSummary }) {
    const openaiKeyPresent = !!process.env.OPENAI_API_KEY;
    const anthropicKeyPresent = !!process.env.ANTHROPIC_API_KEY;

    return {
        version: SCRIPT_VERSION,
        repo_root: repoRoot,
        branch,
        next_motion_id: motionInventory.next_motion_id,

        // Backward-compatible alias for existing consumers.
        total_motions: motionInventory.existing_motion_directory_count,

        motion_inventory: {
            existing_motion_directory_count:
                motionInventory.existing_motion_directory_count,
            highest_discovered_motion_number:
                motionInventory.highest_discovered_motion_number,
            highest_discovered_motion_id:
                motionInventory.highest_discovered_motion_id,
            missing_motion_ids: [...motionInventory.missing_motion_ids],
            has_gaps: motionInventory.has_gaps,
        },

        commands: [...AVAILABLE_COMMANDS],
        providers: {
            default: DEFAULT_PROVIDER,
            supported: [...SUPPORTED_PROVIDERS],
            openai_key_present: openaiKeyPresent,
            anthropic_key_present: anthropicKeyPresent,
            key_presence_semantics:
                "present/missing only; does not validate correctness, funding, provider reachability, or live API readiness",
        },
        file_scopes: {
            revise_default: [...DEFAULT_REVISE_FILES],
            revise_allowed: [...ALLOWED_REVISE_FILES],
            evidence_default: [...DEFAULT_EVIDENCE_FILES],
            evidence_allowed: [...ALLOWED_EVIDENCE_FILES],
            protected: [...PROTECTED_FILES],
        },
        candidates: {
            directory: ".nexus/candidates/",
            count: candidateDiscovery.candidates.length,
            skipped_malformed: candidateDiscovery.skipped_malformed,
            most_recent: candidateDiscovery.candidates.length > 0
                ? {
                    candidateId: candidateDiscovery.candidates[0].candidateId,
                    intent: candidateDiscovery.candidates[0].intent,
                    status: candidateDiscovery.candidates[0].status,
                    createdAt: candidateDiscovery.candidates[0].createdAt,
                    targetMotionId: candidateDiscovery.candidates[0].targetMotionId,
                }
                : null,
        },
        post_ratification_execution: executionSummary || {
            ratified_count: 0, handoff_count: 0, receipt_count: 0, invalid_count: 0, recent: [],
        },
        workflow: {
            placeholder_first: true,
            structural_files_deterministic: true,
            human_review_required: true,
            status_vs_context:
                "status = local factory readiness/configuration snapshot; context = motion-specific repo context for a given intent",
        },
    };
}

async function statusCommand({ repoRoot, jsonOutput }) {
    const branch = git(repoRoot, ["rev-parse", "--abbrev-ref", "HEAD"]);
    const motionDirs = await enumerateMotions(repoRoot);
    const motionInventory = buildMotionInventory(motionDirs);

    const candidateDiscovery = await enumerateCandidates(repoRoot);

    const recentMotions = await readRecentMotions(repoRoot, motionDirs, RECENT_MOTION_WINDOW);
    const executionSummary = {
        ratified_count: recentMotions.filter((m) => m.status?.toUpperCase() === "RATIFIED").length,
        handoff_count: recentMotions.filter((m) => m.execution?.handoff_exists).length,
        receipt_count: recentMotions.filter((m) => m.execution?.receipt_exists).length,
        invalid_count: recentMotions.filter((m) => m.execution?.execution_summary === "INVALID_EXECUTION_ARTIFACT").length,
        recent: recentMotions
            .filter((m) => m.execution?.execution_summary && m.execution.execution_summary !== "NO_EXECUTION_STATE")
            .map((m) => ({
                motion_id: m.motion_id,
                governance_status: m.execution?.governance_status || m.status,
                execution_summary: m.execution?.execution_summary,
            })),
    };

    const status = buildStatusSnapshot({
        repoRoot,
        branch,
        motionInventory,
        candidateDiscovery,
        executionSummary,
    });

    if (jsonOutput) {
        console.log(JSON.stringify(status, null, 2));
        return;
    }

    log(`Motion Factory v0 - Status`);
    log(`─────────────────────────────────────────`);
    log(`Script version:    ${status.version}`);
    log(`Repo root:         ${status.repo_root}`);
    log(`Branch:            ${status.branch}`);
    log(`Next motion ID:    ${status.next_motion_id}`);
    log(`Motion dirs:       ${status.motion_inventory.existing_motion_directory_count}`);
    log(`Highest motion ID: ${status.motion_inventory.highest_discovered_motion_id ?? "(none)"}`);

    if (status.motion_inventory.has_gaps) {
        log(
            `Missing motions:   ${status.motion_inventory.missing_motion_ids.join(", ")}`
        );
    } else {
        log(`Missing motions:   (none)`);
    }

    log(``);
    log(`Commands:`);
    log(`  context   - inspect repo context for a given intent (no files, no API)`);
    log(`  draft     - create a 9-file motion package`);
    log(`  promote   - create a draft motion package from an existing candidate`);
    log(`  revise    - update narrative files from notes`);
    log(`  evidence  - insert proof evidence into narrative files`);
    log(`  status    - local factory readiness/configuration snapshot`);
    log(``);
    log(`Providers:`);
    log(`  Default:           ${status.providers.default}`);
    log(`  Supported:         ${status.providers.supported.join(", ")}`);
    log(
        `  OPENAI_API_KEY:    ${status.providers.openai_key_present ? "present" : "missing"}`
    );
    log(
        `  ANTHROPIC_API_KEY: ${status.providers.anthropic_key_present ? "present" : "missing"}`
    );
    log(`  (Key presence is environmental only; does not validate`);
    log(`   correctness, funding, provider reachability, or live API readiness.)`);
    log(``);
    log(`File scopes:`);
    log(`  Revise default:    ${status.file_scopes.revise_default.join(", ")}`);
    log(`  Revise allowed:    ${status.file_scopes.revise_allowed.join(", ")}`);
    log(`  Evidence default:  ${status.file_scopes.evidence_default.join(", ")}`);
    log(`  Evidence allowed:  ${status.file_scopes.evidence_allowed.join(", ")}`);
    log(`  Protected:         ${status.file_scopes.protected.join(", ")}`);
    log(``);
    log(`Candidates:`);
    log(`  Directory:       .nexus/candidates/`);
    log(`  Count:           ${status.candidates.count}`);
    log(`  Skipped:         ${status.candidates.skipped_malformed} malformed`);
    if (status.candidates.most_recent) {
        log(`  Most recent:     ${status.candidates.most_recent.candidateId}`);
    } else {
        log(`  Most recent:     (none)`);
    }
    log(``);
    log(`Post-ratification execution:`);
    if (status.post_ratification_execution.recent.length > 0) {
        for (const m of status.post_ratification_execution.recent) {
            log(`  ${m.motion_id}: ${m.governance_status} → ${m.execution_summary}`);
        }
    } else {
        log(`  (no execution state in recent motions)`);
    }
    if (status.post_ratification_execution.invalid_count > 0) {
        log(`  ⚠  ${status.post_ratification_execution.invalid_count} motion(s) have malformed execution artifacts`);
    }
    log(``);
    log(`Workflow:`);
    log(`  Placeholder-first: every motion starts with draft`);
    log(`  Structural files:  deterministic, never model-generated`);
    log(`  Human review:      required before ratification`);
    log(`  status vs context: status = readiness snapshot; context = intent-specific repo context`);
    log(`─────────────────────────────────────────`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Deterministic scaffold generators
// ──────────────────────────────────────────────────────────────────────────────

function generateMotionYaml({ motionId, intent, owner, domain, repo }) {
    return `motion_id: "${yamlEscape(motionId)}"
title: "${yamlEscape(intent)}"

status: "proposed"
created_at: "${utcNow()}"
owner: "${yamlEscape(owner)}"

target:
  domain: "${yamlEscape(domain)}"
  repo: "${yamlEscape(repo)}"

summary: >
${blockText("Draft scaffold — summary pending.", 2)}

problem: >
${blockText("Draft scaffold — problem statement pending.", 2)}

proposal:
${yamlList(["Draft scaffold — proposal pending."], 2)}

non_goals:
${yamlList(["Draft scaffold — non-goals pending."], 2)}

success_criteria:
${yamlList(["Draft scaffold — success criteria pending."], 2)}

vote:
  mode: "unanimous_consent"
  required_roles:
    - "proposer"
    - "challenger"
    - "arbiter"
`;
}

function generateMotionYamlFromNarrative({ motionId, intent, owner, domain, repo, narrative }) {
    const summary = narrative?.summary || "Draft scaffold — summary pending.";
    const problem = narrative?.problem || "Draft scaffold — problem statement pending.";
    const proposal =
        Array.isArray(narrative?.proposal) && narrative.proposal.length > 0
            ? narrative.proposal
            : ["Draft scaffold — proposal pending."];
    const nonGoals =
        Array.isArray(narrative?.non_goals) && narrative.non_goals.length > 0
            ? narrative.non_goals
            : ["Draft scaffold — non-goals pending."];
    const successCriteria =
        Array.isArray(narrative?.success_criteria) && narrative.success_criteria.length > 0
            ? narrative.success_criteria
            : ["Draft scaffold — success criteria pending."];

    return `motion_id: "${yamlEscape(motionId)}"
title: "${yamlEscape(intent)}"

status: "proposed"
created_at: "${utcNow()}"
owner: "${yamlEscape(owner)}"

target:
  domain: "${yamlEscape(domain)}"
  repo: "${yamlEscape(repo)}"

summary: >
${blockText(summary, 2)}

problem: >
${blockText(problem, 2)}

proposal:
${yamlList(proposal, 2)}

non_goals:
${yamlList(nonGoals, 2)}

success_criteria:
${yamlList(successCriteria, 2)}

vote:
  mode: "unanimous_consent"
  required_roles:
    - "proposer"
    - "challenger"
    - "arbiter"
`;
}

function generatePolicyYaml({ motionId, governance }) {
    const version = governance.available ? governance.version : "0.3.8";
    const voteMode = governance.available ? governance.vote_mode : "unanimous_consent";
    const roles = governance.available
        ? governance.required_roles
        : ["proposer", "challenger", "arbiter"];

    return `protocol_version: "${yamlEscape(version)}"
motion_id: ${motionId}
evaluated_at: "${utcNow()}"
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "${yamlEscape(voteMode)}"
required_voters: [${roles.join(", ")}]
risk_score: 0.00
max_risk_score: 0.20
required_gates: [validate_motion, validate_agency]
optional_gates: []
failed_required_gates: []
failed_optional_gates: []
required_ok: true
eligible_to_vote: true
recommended_vote: "yes"
blocking_reasons: []
warnings: []
`;
}

function generateDecisionYaml({ motionId, governance }) {
    const version = governance.available ? governance.version : "0.3.8";
    const voteMode = governance.available ? governance.vote_mode : "unanimous_consent";

    return `protocol_version: "${yamlEscape(version)}"
motion_id: ${motionId}
status: DRAFT
ratified_by: null
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "${yamlEscape(voteMode)}"
required_gates: [validate_motion, validate_agency]
last_updated: "${utcNow()}"
notes: "PENDING: awaiting vote"
`;
}

function generateDecisionMd({ motionId }) {
    return `# Decision - ${motionId}

## Status
DRAFT — awaiting vote.

## Summary
Pending ratification. This package is a draft artifact and requires human
review before ratification.

## Outcome
Not yet determined.
`;
}

function generateVoteJson({ motionId, governance }) {
    const version = governance.available ? governance.version : "0.3.8";
    const voteMode = governance.available ? governance.vote_mode : "unanimous_consent";
    const roles = governance.available
        ? governance.required_roles
        : ["proposer", "challenger", "arbiter"];

    return stableJson({
        version: "0.2",
        motion_id: motionId,
        votes: [],
        protocol_version: version,
        vote_mode: voteMode,
        required_roles: [...roles],
        outcome: {
            yes: 0,
            no: 0,
            abstain: 0,
            yes_with_reservations: 0,
            result: "PENDING",
            reasons: [],
            missing_required_roles: [...roles],
        },
        last_updated: utcNow(),
    });
}

function generateVerifyJson({ motionId }) {
    return stableJson({
        version: "0.2",
        motion_id: motionId,
        latest: {},
        summary: {
            required_ok: false,
            last_updated: utcNow(),
            notes: "Gates not yet executed. Run council-run.mjs to populate.",
        },
    });
}

function generateProposalMd({ motionId, intent }) {
    return `# Proposal - ${motionId}

## Title
${intent}

## Intent
${intent}

## Why this motion exists
Draft scaffold — narrative content pending.

## What this motion changes
Draft scaffold — narrative content pending.

## What this motion does not change
Draft scaffold — narrative content pending.

## Design stance
Draft scaffold — narrative content pending.

## Why now
Draft scaffold — narrative content pending.
`;
}

function generateChallengeMd({ motionId }) {
    return `# Challenge (${motionId})

## Risks
Draft scaffold — risks pending.

## Objections
Draft scaffold — objections pending.

## Mitigations
Draft scaffold — mitigations pending.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
`;
}

function generateExecutionMd({ motionId }) {
    return `# Execution Plan - ${motionId}

## Goal
Draft scaffold — execution plan pending.

## Plan
Draft scaffold — execution plan pending.

## Files touched
Draft scaffold — execution plan pending.

## Files explicitly not touched
Draft scaffold — execution plan pending.

## Rollback plan
Draft scaffold — execution plan pending.

## Acceptance criteria
Draft scaffold — execution plan pending.

## Done means
Draft scaffold — execution plan pending.
`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Draft narrative generation
// ──────────────────────────────────────────────────────────────────────────────

function normalizeNarrativePayload(parsed) {
    const motionYaml = parsed?.motion_yaml ?? {};

    return {
        motion_yaml: {
            summary: typeof motionYaml.summary === "string" ? motionYaml.summary.trim() : "",
            problem: typeof motionYaml.problem === "string" ? motionYaml.problem.trim() : "",
            proposal: Array.isArray(motionYaml.proposal)
                ? motionYaml.proposal.map((x) => String(x).trim()).filter(Boolean)
                : [],
            non_goals: Array.isArray(motionYaml.non_goals)
                ? motionYaml.non_goals.map((x) => String(x).trim()).filter(Boolean)
                : [],
            success_criteria: Array.isArray(motionYaml.success_criteria)
                ? motionYaml.success_criteria.map((x) => String(x).trim()).filter(Boolean)
                : [],
        },
        proposal_md: typeof parsed?.proposal_md === "string" ? parsed.proposal_md.trim() : "",
        challenge_md: typeof parsed?.challenge_md === "string" ? parsed.challenge_md.trim() : "",
        execution_md: typeof parsed?.execution_md === "string" ? parsed.execution_md.trim() : "",
    };
}

async function generateNarrativeWithOpenAI({ context, motionId, intent }) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        die(`Missing OPENAI_API_KEY. Set it in the environment or use --no-api.`);
    }

    const instructions = [
        "You are generating draft-only JAI NEXUS motion artifacts.",
        "Return JSON only. Do not use markdown fences.",
        "Use repo-native motion conventions.",
        "Do not generate evidence tables.",
        "Do not generate PASS/FAIL claims.",
        "Do not generate proof-result claims.",
        "Do not generate executed test results.",
        "Do not generate vote entries or vote rationales.",
        "Do not generate ratification claims.",
        "Do not claim that any motion has passed validation.",
        "Keep content reviewable and clearly draft-quality.",
        "Generate only the requested narrative fields.",
    ].join(" ");

    const task = {
        task: "Generate draft-only motion narrative content",
        motion_id: motionId,
        intent,
        context,
        requested_fields: {
            motion_yaml: ["summary", "problem", "proposal", "non_goals", "success_criteria"],
            markdown_files: ["proposal_md", "challenge_md", "execution_md"],
        },
        output_schema: {
            motion_yaml: {
                summary: "string",
                problem: "string",
                proposal: ["string"],
                non_goals: ["string"],
                success_criteria: ["string"],
            },
            proposal_md: "string",
            challenge_md: "string",
            execution_md: "string",
        },
    };

    const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            instructions,
            input: JSON.stringify(task),
            text: {
                format: { type: "text" },
                verbosity: "medium",
            },
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`OpenAI API request failed (${res.status}): ${body}`);
    }

    const payload = await res.json();
    const text = stripMarkdownFences(extractOutputText(payload));

    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (err) {
        throw new Error(`Failed to parse model JSON output: ${err.message}`);
    }

    return normalizeNarrativePayload(parsed);
}

// ──────────────────────────────────────────────────────────────────────────────
// Anthropic API helpers
// ──────────────────────────────────────────────────────────────────────────────

async function callAnthropicApi({ apiKey, systemPrompt, userContent, maxTokens = 8000 }) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: ANTHROPIC_MODEL,
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [{ role: "user", content: userContent }],
        }),
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "(unreadable)");
        throw new Error(`Anthropic API returned ${res.status}: ${body}`);
    }

    const payload = await res.json();
    const content = payload?.content;
    if (!Array.isArray(content) || content.length === 0) {
        throw new Error("Anthropic response contained no content blocks.");
    }

    const text = content.filter((c) => c.type === "text").map((c) => c.text).join("");
    if (!text) {
        throw new Error("Anthropic response contained no text content.");
    }
    return text;
}

async function generateNarrativeWithAnthropic({ context, motionId, intent, apiKey }) {
    const systemPrompt = [
        "You are generating draft-only JAI NEXUS motion artifacts.",
        "Return JSON only. Do not use markdown fences.",
        "Use repo-native motion conventions.",
        "Do not generate evidence tables.",
        "Do not generate PASS/FAIL claims.",
        "Do not generate proof-result claims.",
        "Do not generate executed test results.",
        "Do not generate vote entries or vote rationales.",
        "Do not generate ratification claims.",
        "Do not claim that any motion has passed validation.",
        "Keep content reviewable and clearly draft-quality.",
        "Generate only the requested narrative fields.",
    ].join(" ");

    const task = {
        task: "Generate draft-only motion narrative content",
        motion_id: motionId,
        intent,
        context,
        requested_fields: {
            motion_yaml: ["summary", "problem", "proposal", "non_goals", "success_criteria"],
            markdown_files: ["proposal_md", "challenge_md", "execution_md"],
        },
        output_schema: {
            motion_yaml: {
                summary: "string",
                problem: "string",
                proposal: ["string"],
                non_goals: ["string"],
                success_criteria: ["string"],
            },
            proposal_md: "string",
            challenge_md: "string",
            execution_md: "string",
        },
    };

    const raw = await callAnthropicApi({
        apiKey,
        systemPrompt,
        userContent: JSON.stringify(task),
    });

    const cleaned = stripMarkdownFences(raw);
    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    } catch (err) {
        throw new Error(`Failed to parse Anthropic JSON output: ${err.message}`);
    }
    return normalizeNarrativePayload(parsed);
}

// ──────────────────────────────────────────────────────────────────────────────
// Revise generation
// ──────────────────────────────────────────────────────────────────────────────

async function callOpenAIRevise({
    apiKey,
    context,
    existingContent,
    revisionNotes,
    targetFiles,
    originalIntent,
}) {
    const fileDescriptions = targetFiles
        .map((f) => `--- ${f} ---\n${existingContent[f] || "(empty)"}\n--- end ${f} ---`)
        .join("\n\n");

    const instructions = [
        "You are a governance motion revision assistant for the dev-jai-nexus repository.",
        "You are revising existing draft motion files based on human revision notes.",
        "",
        "HARD RULES — you must NEVER generate any of the following:",
        "- Evidence tables",
        "- PASS/FAIL claims",
        "- Executed test-result claims",
        "- Proof-result claims",
        "- Vote entries or vote rationales",
        "- Ratification claims or ratification outcomes",
        "- Any content that implies work has already been performed or validated",
        "",
        "Your output is DRAFT content only. It will be reviewed by a human before ratification.",
        "",
        "REVISION RULES:",
        "- Incorporate the human revision notes into the targeted files",
        "- Preserve the section structure and headers of each file",
        "- Use repo-native conventions: bounded scope, exact file surfaces, low-churn language",
        "- Keep content precise and ratifiable",
        "- Do not add speculative expansion beyond the revision notes",
        "",
        "OUTPUT FORMAT:",
        "Return each revised file separated by markers exactly like this:",
        "=== FILE: filename.md ===",
        "(revised content)",
        "=== END FILE ===",
        "",
        "Return ONLY the targeted files in this format. Do not return files that were not requested.",
    ].join("\n");

    const input = [
        "## Original intent",
        originalIntent,
        "",
        "## Context",
        JSON.stringify(context, null, 2),
        "",
        "## Revision notes",
        revisionNotes,
        "",
        "## Files to revise",
        targetFiles.join(", "),
        "",
        "## Current content of targeted files",
        fileDescriptions,
        "",
        "Please revise the targeted files incorporating the revision notes.",
    ].join("\n");

    const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            instructions,
            input,
            text: {
                format: { type: "text" },
                verbosity: "medium",
            },
        }),
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "(unreadable)");
        throw new Error(`OpenAI API returned ${res.status}: ${body}`);
    }

    const payload = await res.json();
    return extractOutputText(payload);
}

async function callAnthropicRevise({
    apiKey,
    context,
    existingContent,
    revisionNotes,
    targetFiles,
    originalIntent,
}) {
    const fileDescriptions = targetFiles
        .map((f) => `--- ${f} ---\n${existingContent[f] || "(empty)"}\n--- end ${f} ---`)
        .join("\n\n");

    const systemPrompt = [
        "You are a governance motion revision assistant for the dev-jai-nexus repository.",
        "You are revising existing draft motion files based on human revision notes.",
        "",
        "HARD RULES — you must NEVER generate any of the following:",
        "- Evidence tables",
        "- PASS/FAIL claims",
        "- Executed test-result claims",
        "- Proof-result claims",
        "- Vote entries or vote rationales",
        "- Ratification claims or ratification outcomes",
        "- Any content that implies work has already been performed or validated",
        "",
        "Your output is DRAFT content only. It will be reviewed by a human before ratification.",
        "",
        "REVISION RULES:",
        "- Incorporate the human revision notes into the targeted files",
        "- Preserve the section structure and headers of each file",
        "- Use repo-native conventions",
        "- Keep content precise and ratifiable",
        "- Do not add speculative expansion beyond the revision notes",
        "",
        "OUTPUT FORMAT:",
        "Return each revised file separated by markers exactly like this:",
        "=== FILE: filename.md ===",
        "(revised content)",
        "=== END FILE ===",
        "",
        "Return ONLY the targeted files in this format.",
    ].join("\n");

    const userContent = [
        `## Original intent`,
        originalIntent,
        ``,
        `## Context`,
        JSON.stringify(context, null, 2),
        ``,
        `## Revision notes`,
        revisionNotes,
        ``,
        `## Files to revise`,
        targetFiles.join(", "),
        ``,
        `## Current content of targeted files`,
        fileDescriptions,
        ``,
        `Please revise the targeted files incorporating the revision notes.`,
    ].join("\n");

    return await callAnthropicApi({ apiKey, systemPrompt, userContent });
}

// ──────────────────────────────────────────────────────────────────────────────
// Evidence generation
// ──────────────────────────────────────────────────────────────────────────────

async function callOpenAIEvidence({
    apiKey,
    context,
    existingContent,
    evidenceText,
    operatorNotes,
    targetFiles,
    originalIntent,
}) {
    const fileDescriptions = targetFiles
        .map((f) => `--- ${f} ---\n${existingContent[f] || "(empty)"}\n--- end ${f} ---`)
        .join("\n\n");

    const instructions = [
        "You are an evidence placement assistant for the dev-jai-nexus repository.",
        "You are inserting real operator-provided evidence into existing draft motion narrative files.",
        "",
        "CRITICAL BOUNDARY — evidence-fed, not evidence-inventing:",
        "You may ONLY do the following with the provided evidence:",
        "- Quote it directly",
        "- Organize it into the appropriate narrative sections",
        "- Summarize it when the source material clearly supports the summary",
        "- Place terminal output, command logs, and results where they belong",
        "",
        "You must NEVER do any of the following:",
        "- Invent PASS/FAIL claims not explicitly present in the evidence",
        "- Upgrade ambiguous evidence into definitive conclusions",
        "- Add proof results that were not in the evidence file",
        "- Claim tests passed or failed beyond what the evidence explicitly shows",
        "- Generate vote entries or vote rationales",
        "- Generate ratification claims or ratification outcomes",
        "- Resolve ambiguity — if evidence is inconclusive, preserve that ambiguity",
        "",
        "Your output will be reviewed by a human before ratification.",
        "",
        "PLACEMENT RULES:",
        "- Incorporate the evidence into the appropriate sections of each targeted file",
        "- Preserve the section structure and headers of each file",
        "- Use repo-native conventions",
        "- If operator notes are provided, use them for placement guidance",
        "- Keep the evidence attribution clear (what came from the evidence file vs existing content)",
        "",
        "OUTPUT FORMAT:",
        "Return each updated file separated by markers exactly like this:",
        "=== FILE: filename.md ===",
        "(updated content with evidence placed)",
        "=== END FILE ===",
        "",
        "Return ONLY the targeted files in this format. Do not return files that were not requested.",
    ].join("\n");

    const notesSection = operatorNotes ? `## Operator notes\n${operatorNotes}\n` : "";

    const input = [
        `## Original intent`,
        originalIntent,
        ``,
        `## Context`,
        JSON.stringify(context, null, 2),
        ``,
        notesSection,
        `## Evidence payload (operator-provided, source material)`,
        `The following is raw evidence provided by the operator. Place and organize`,
        `this evidence into the targeted files. Do not invent claims beyond what`,
        `this evidence shows.`,
        ``,
        `--- EVIDENCE START ---`,
        evidenceText,
        `--- EVIDENCE END ---`,
        ``,
        `## Files to update with evidence`,
        targetFiles.join(", "),
        ``,
        `## Current content of targeted files`,
        fileDescriptions,
        ``,
        `Please update the targeted files by placing the provided evidence into the appropriate sections.`,
    ].join("\n");

    const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            instructions,
            input,
            text: {
                format: { type: "text" },
                verbosity: "medium",
            },
        }),
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "(unreadable)");
        throw new Error(`OpenAI API returned ${res.status}: ${body}`);
    }

    const payload = await res.json();
    return extractOutputText(payload);
}

async function callAnthropicEvidence({
    apiKey,
    context,
    existingContent,
    evidenceText,
    operatorNotes,
    targetFiles,
    originalIntent,
}) {
    const fileDescriptions = targetFiles
        .map((f) => `--- ${f} ---\n${existingContent[f] || "(empty)"}\n--- end ${f} ---`)
        .join("\n\n");

    const systemPrompt = [
        "You are an evidence placement assistant for the dev-jai-nexus repository.",
        "You are inserting real operator-provided evidence into existing draft motion narrative files.",
        "",
        "CRITICAL BOUNDARY — evidence-fed, not evidence-inventing:",
        "You may ONLY: quote, organize, summarize, or place operator-provided evidence.",
        "You must NEVER: invent PASS/FAIL claims, upgrade ambiguity, add results not in the evidence,",
        "generate vote entries, generate ratification claims, or resolve ambiguity.",
        "",
        "OUTPUT FORMAT:",
        "Return each updated file separated by markers exactly like this:",
        "=== FILE: filename.md ===",
        "(updated content with evidence placed)",
        "=== END FILE ===",
        "",
        "Return ONLY the targeted files in this format.",
    ].join("\n");

    const notesSection = operatorNotes ? `## Operator notes\n${operatorNotes}\n\n` : "";
    const userContent = [
        `## Original intent`,
        originalIntent,
        ``,
        `## Context`,
        JSON.stringify(context, null, 2),
        ``,
        notesSection,
        `## Evidence payload`,
        `--- EVIDENCE START ---`,
        evidenceText,
        `--- EVIDENCE END ---`,
        ``,
        `## Files to update`,
        targetFiles.join(", "),
        ``,
        `## Current content`,
        fileDescriptions,
        ``,
        `Please update the targeted files by placing the provided evidence.`,
    ].join("\n");

    return await callAnthropicApi({ apiKey, systemPrompt, userContent });
}

// ──────────────────────────────────────────────────────────────────────────────
// Candidate artifact helpers
// ──────────────────────────────────────────────────────────────────────────────

function generateCandidateId(intent) {
    const now = new Date();
    const date = now.toISOString().replace(/[-T:.Z]/g, "").slice(0, 14); // YYYYMMDD + HHmmss
    const dateFormatted = `${date.slice(0, 8)}-${date.slice(8, 14)}`;
    const slug = String(intent || "untitled")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40);
    return `cm-${dateFormatted}-${slug}`;
}

function generateCandidateArtifact({ candidateId, intent, targetMotionId, provider, noApi }) {
    return stableJson({
        version: "0.1",
        candidateId,
        intent,
        status: "emitted",
        source: "motion-factory:draft",
        createdAt: utcNow(),
        targetMotionId,
        provider: noApi ? "placeholder" : provider,
        noApi: !!noApi,
    });
}

async function readCandidateArtifact(repoRoot, candidateId) {
    const candidatesDir = path.join(repoRoot, ".nexus", "candidates");
    const candidatePath = path.join(candidatesDir, `${candidateId}.json`);

    if (!(await exists(candidatePath))) {
        die(`Candidate artifact not found: .nexus/candidates/${candidateId}.json`);
    }

    let obj;
    try {
        obj = JSON.parse(await readText(candidatePath));
    } catch (err) {
        die(`Failed to parse candidate artifact ${candidateId}: ${err.message}`);
    }

    if (!obj || typeof obj !== "object") {
        die(`Malformed candidate artifact ${candidateId}: root must be an object.`);
    }

    if (!obj.candidateId || String(obj.candidateId).trim() !== candidateId) {
        die(`Malformed candidate artifact ${candidateId}: candidateId missing or mismatched.`);
    }

    if (!obj.intent || !String(obj.intent).trim()) {
        die(`Malformed candidate artifact ${candidateId}: intent is required.`);
    }

    return {
        candidatePath,
        candidate: obj,
    };
}

function validatePromotableCandidate(candidate) {
    if (String(candidate.status || "").trim() === "promoted") {
        die(`Candidate ${candidate.candidateId} is already marked promoted.`);
    }
}

function generatePromotionArtifact({ candidate, targetMotionId }) {
    return stableJson({
        version: "0.1",
        source: "motion-factory:promote",
        candidateId: String(candidate.candidateId),
        targetMotionId,
        promotedAt: utcNow(),
        promotedBy: "operator",
        candidateStatusAtRead: String(candidate.status || "unknown"),
    });
}

async function writeMotionPackage(motionDir, files) {
    await fs.mkdir(motionDir, { recursive: true });
    for (const f of files) {
        await fs.writeFile(path.join(motionDir, f.name), f.content, "utf8");
    }
}

async function writeCandidatePromotionBackfill(candidatePath, candidate, targetMotionId) {
    const updated = {
        ...candidate,
        status: "promoted",
        targetMotionId,
    };
    await fs.writeFile(candidatePath, stableJson(updated), "utf8");
}

// ──────────────────────────────────────────────────────────────────────────────
// Draft command
// ──────────────────────────────────────────────────────────────────────────────

async function buildDraftPackage({
    repoRoot,
    motionId,
    intent,
    noApi,
    provider,
}) {
    const context = await buildContext(repoRoot, intent);
    const governanceSummary = context.governance_summary;

    const owner = "Jerry Ingram";
    const domain = "dev.jai.nexus";
    const repo = "dev-jai-nexus";

    let narrativeMode = "placeholder";
    let warning = null;
    let narrative = null;

    if (!noApi) {
        try {
            const apiKey = requireApiKey(provider);
            if (provider === "anthropic") {
                narrative = await generateNarrativeWithAnthropic({ context, motionId, intent, apiKey });
            } else {
                narrative = await generateNarrativeWithOpenAI({ context, motionId, intent });
            }
            narrativeMode = providerLabel(provider);
        } catch (err) {
            narrativeMode = "placeholder";
            warning = err?.message || String(err);
        }
    }

    const files = [
        {
            name: "motion.yaml",
            content: narrative
                ? generateMotionYamlFromNarrative({
                    motionId,
                    intent,
                    owner,
                    domain,
                    repo,
                    narrative: narrative.motion_yaml,
                })
                : generateMotionYaml({ motionId, intent, owner, domain, repo }),
        },
        { name: "proposal.md", content: narrative?.proposal_md || generateProposalMd({ motionId, intent }) },
        { name: "challenge.md", content: narrative?.challenge_md || generateChallengeMd({ motionId }) },
        { name: "execution.md", content: narrative?.execution_md || generateExecutionMd({ motionId }) },
        { name: "policy.yaml", content: generatePolicyYaml({ motionId, governance: governanceSummary }) },
        { name: "decision.yaml", content: generateDecisionYaml({ motionId, governance: governanceSummary }) },
        { name: "decision.md", content: generateDecisionMd({ motionId }) },
        { name: "vote.json", content: generateVoteJson({ motionId, governance: governanceSummary }) },
        { name: "verify.json", content: generateVerifyJson({ motionId }) },
    ];

    return {
        context,
        files,
        narrativeMode,
        warning,
    };
}

async function draftCommand({ repoRoot, intent, noApi, provider, preview }) {
    const context = await buildContext(repoRoot, intent);
    const motionId = context.next_motion_id;
    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);

    if (!preview && (await exists(motionDir))) {
        die(
            `Motion directory already exists: .nexus/motions/${motionId}\nDelete it manually before running draft again.`
        );
    }

    if (!noApi) {
        requireApiKey(provider);
    }

    const candidateId = generateCandidateId(intent);
    const candidatesDir = path.join(repoRoot, ".nexus", "candidates");
    const candidatePath = path.join(candidatesDir, `${candidateId}.json`);

    if (!preview && await exists(candidatePath)) {
        die(`Candidate artifact already exists: .nexus/candidates/${candidateId}.json\nResolve the collision before running draft again.`);
    }

    const { files, narrativeMode, warning } = await buildDraftPackage({
        repoRoot,
        motionId,
        intent,
        noApi,
        provider,
    });

    if (preview) {
        const contentsByFile = Object.fromEntries(files.map((f) => [f.name, f.content]));
        printPreviewFiles({
            motionId,
            operation: "draft",
            headerLines: [
                `Intent:        ${intent}`,
                `Motion ID:     ${motionId} (provisional, not reserved)`,
                `Candidate ID:  ${candidateId} (provisional)`,
                `Candidate:     (preview only — no candidate artifact written)`,
                `Narrative:     ${narrativeMode}`,
                ...(warning ? [`Warning:       ${warning}`] : []),
            ],
            targetFiles: files.map((f) => f.name),
            contentsByFile,
            footerLines: [
                `   No directory was created. No candidate artifact was written.`,
                `   Motion ID ${motionId} is provisional and not reserved.`,
            ],
        });
        return;
    }

    await fs.mkdir(candidatesDir, { recursive: true });
    try {
        const candidateContent = generateCandidateArtifact({
            candidateId,
            intent,
            targetMotionId: motionId,
            provider,
            noApi,
        });
        await fs.writeFile(candidatePath, candidateContent, "utf8");
    } catch (err) {
        die(`Failed to emit candidate artifact: ${err.message}\nNo motion directory was created.`);
    }

    try {
        await writeMotionPackage(motionDir, files);
    } catch (err) {
        try { await fs.unlink(candidatePath); } catch { }
        try { await fs.rm(motionDir, { recursive: true, force: true }); } catch { }
        die(`Failed to write formal motion package: ${err.message}\nCandidate artifact cleaned up. No partial artifacts remain.`);
    }

    log(`Draft scaffold created for ${motionId}`);
    log(`─────────────────────────────────────────`);
    log(`Motion ID:      ${motionId}`);
    log(`Path:           .nexus/motions/${motionId}/`);
    log(`Candidate ID:   ${candidateId}`);
    log(`Candidate:      .nexus/candidates/${candidateId}.json`);
    log(`Intent:         ${intent}`);
    log(`Narrative:      ${narrativeMode}`);
    if (warning) {
        log(`Warning:        ${warning}`);
    }
    log(`Files created:`);
    for (const f of files) {
        log(`  - ${f.name}`);
    }
    log(``);
    log(`⚠  This package is DRAFT-only and requires human review before ratification.`);
    if (narrativeMode === "placeholder") {
        log(`⚠  Narrative content is placeholder scaffold content.`);
    } else {
        log(`⚠  Narrative content is ${narrativeMode} draft content, not evidence-backed content.`);
    }
    log(`─────────────────────────────────────────`);
}

async function promoteCommand({ repoRoot, candidateId, noApi, provider, preview }) {
    const { candidatePath, candidate } = await readCandidateArtifact(repoRoot, candidateId);
    validatePromotableCandidate(candidate);

    const motionDirs = await enumerateMotions(repoRoot);
    const motionId = nextMotionId(motionDirs);
    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);

    if (!noApi) {
        requireApiKey(provider);
    }

    const { files, narrativeMode, warning } = await buildDraftPackage({
        repoRoot,
        motionId,
        intent: String(candidate.intent),
        noApi,
        provider,
    });

    const promotionJson = generatePromotionArtifact({
        candidate,
        targetMotionId: motionId,
    });

    if (preview) {
        const contentsByFile = Object.fromEntries(files.map((f) => [f.name, f.content]));
        contentsByFile["promotion.json"] = promotionJson;

        printPreviewFiles({
            motionId,
            operation: "promote",
            headerLines: [
                `Candidate ID:   ${candidateId}`,
                `Intent:         ${candidate.intent}`,
                `Motion ID:      ${motionId} (provisional, not reserved)`,
                `Narrative:      ${narrativeMode}`,
                ...(warning ? [`Warning:        ${warning}`] : []),
            ],
            targetFiles: [...STANDARD_MOTION_FILES, "promotion.json"],
            contentsByFile,
            footerLines: [
                `   No directory was created. Candidate status was not updated.`,
                `   Motion ID ${motionId} is provisional and not reserved.`,
            ],
        });
        return;
    }

    if (await exists(motionDir)) {
        die(`Motion directory already exists: .nexus/motions/${motionId}`);
    }

    try {
        await writeMotionPackage(motionDir, files);
        await fs.writeFile(path.join(motionDir, "promotion.json"), promotionJson, "utf8");
    } catch (err) {
        try { await fs.rm(motionDir, { recursive: true, force: true }); } catch { }
        die(`Failed to write promoted motion package: ${err.message}`);
    }

    let reconciliationWarning = null;
    try {
        await writeCandidatePromotionBackfill(candidatePath, candidate, motionId);
    } catch (err) {
        reconciliationWarning = err?.message || String(err);
    }

    log(`Candidate promoted to draft motion ${motionId}`);
    log(`─────────────────────────────────────────`);
    log(`Candidate ID:   ${candidateId}`);
    log(`Motion ID:      ${motionId}`);
    log(`Path:           .nexus/motions/${motionId}/`);
    log(`Narrative:      ${narrativeMode}`);
    if (warning) {
        log(`Warning:        ${warning}`);
    }
    if (reconciliationWarning) {
        log(`Reconciliation: candidate write-back failed after promotion completed`);
        log(`Warning:        ${reconciliationWarning}`);
    }
    log(`Files created:`);
    for (const name of [...STANDARD_MOTION_FILES, "promotion.json"]) {
        log(`  - ${name}`);
    }
    log(`─────────────────────────────────────────`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Revise command
// ──────────────────────────────────────────────────────────────────────────────

async function reviseCommand({ repoRoot, motionId, notes, requestedFiles, provider, preview }) {
    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
    if (!(await exists(motionDir))) {
        die(`Motion directory not found: .nexus/motions/${motionId}`);
    }

    const targetFiles = requestedFiles.length > 0 ? requestedFiles : [...DEFAULT_REVISE_FILES];

    for (const f of targetFiles) {
        if (!ALLOWED_REVISE_FILES.has(f)) {
            die(`File "${f}" is not in the allowed revise set.\n  Allowed: ${[...ALLOWED_REVISE_FILES].join(", ")}`);
        }
    }

    const apiKey = requireApiKey(provider);

    const existingContent = {};
    for (const f of targetFiles) {
        const fp = path.join(motionDir, f);
        existingContent[f] = (await exists(fp)) ? await readText(fp) : "";
    }

    const motionYamlPath = path.join(motionDir, "motion.yaml");
    let originalIntent = "(unknown)";
    if (await exists(motionYamlPath)) {
        const motionObj = safeYamlLoad(await readText(motionYamlPath), "motion.yaml");
        if (motionObj?.title) originalIntent = String(motionObj.title).trim();
    }

    const context = await buildContext(repoRoot, originalIntent);

    log(`Revising ${targetFiles.length} file(s) for ${motionId}...`);

    let revisedPayload;
    try {
        const callRevise = provider === "anthropic" ? callAnthropicRevise : callOpenAIRevise;
        const raw = await callRevise({
            apiKey,
            context,
            existingContent,
            revisionNotes: notes,
            targetFiles,
            originalIntent,
        });
        revisedPayload = parseMarkedFiles(raw, targetFiles);
    } catch (err) {
        log(`⚠  API call failed: ${err.message}`);
        log(`   Existing files were NOT overwritten.`);
        log(`   Preview/apply wrote nothing.`);
        log(`   Draft remains in its pre-revision state.`);
        return;
    }

    const missingFiles = targetFiles.filter((f) => !revisedPayload[f]);
    if (missingFiles.length > 0) {
        log(`⚠  API did not return content for: ${missingFiles.join(", ")}`);
        log(`   Existing files were NOT overwritten (all-or-nothing).`);
        log(`   Preview/apply wrote nothing.`);
        log(`   Draft remains in its pre-revision state.`);
        return;
    }

    const resolvedPayload = {};
    for (const f of targetFiles) {
        let content = revisedPayload[f];
        if (f === "motion.yaml") {
            const existingYaml = existingContent["motion.yaml"] || "";
            content = mergeMotionYamlNarrative(existingYaml, content);
        }
        resolvedPayload[f] = content;
    }

    if (preview) {
        printPreviewFiles({
            motionId,
            operation: "revise",
            headerLines: [
                `Target motion: ${motionId}`,
                `Provider:      ${providerName(provider)}`,
                `Files:         ${targetFiles.join(", ")}`,
                `Revision notes: ${notes}`,
            ],
            targetFiles,
            contentsByFile: resolvedPayload,
        });
        return;
    }

    for (const f of targetFiles) {
        await fs.writeFile(path.join(motionDir, f), resolvedPayload[f], "utf8");
    }

    log(`Revision complete for ${motionId}`);
    log(`─────────────────────────────────────────`);
    log(`Motion ID:       ${motionId}`);
    log(`Files requested: ${targetFiles.join(", ")}`);
    log(`Files revised:   ${targetFiles.join(", ")}`);
    log(`Mode:            ${providerLabel(provider)}`);
    log(`Revision notes:  ${notes}`);
    log(``);
    log(`⚠  Human review is required before ratification.`);
    log(`   Check revised content with: git diff .nexus/motions/${motionId}/`);
    log(`─────────────────────────────────────────`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Evidence command
// ──────────────────────────────────────────────────────────────────────────────

async function evidenceCommand({
    repoRoot,
    motionId,
    evidenceFilePath,
    operatorNotes,
    requestedFiles,
    provider,
    preview,
}) {
    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
    if (!(await exists(motionDir))) {
        die(`Motion directory not found: .nexus/motions/${motionId}`);
    }

    const resolvedEvidencePath = path.resolve(evidenceFilePath);
    if (!(await exists(resolvedEvidencePath))) {
        die(`Evidence file not found: ${evidenceFilePath}`);
    }

    const evidenceText = (await readText(resolvedEvidencePath)).trim();
    if (!evidenceText) {
        die(`Evidence file is empty: ${evidenceFilePath}`);
    }

    const targetFiles = requestedFiles.length > 0 ? requestedFiles : [...DEFAULT_EVIDENCE_FILES];
    for (const f of targetFiles) {
        if (!ALLOWED_EVIDENCE_FILES.has(f)) {
            die(`File "${f}" is not in the allowed evidence insertion set.\n  Allowed: ${[...ALLOWED_EVIDENCE_FILES].join(", ")}`);
        }
    }

    const apiKey = requireApiKey(provider);

    const existingContent = {};
    for (const f of targetFiles) {
        const fp = path.join(motionDir, f);
        existingContent[f] = (await exists(fp)) ? await readText(fp) : "";
    }

    const motionYamlPath = path.join(motionDir, "motion.yaml");
    let originalIntent = "(unknown)";
    if (await exists(motionYamlPath)) {
        const motionObj = safeYamlLoad(await readText(motionYamlPath), "motion.yaml");
        if (motionObj?.title) originalIntent = String(motionObj.title).trim();
    }

    const context = await buildContext(repoRoot, originalIntent);

    log(`Inserting evidence into ${targetFiles.length} file(s) for ${motionId}...`);
    log(`Evidence file: ${evidenceFilePath} (${evidenceText.length} chars)`);

    let updatedPayload;
    try {
        const callEvidence = provider === "anthropic" ? callAnthropicEvidence : callOpenAIEvidence;
        const raw = await callEvidence({
            apiKey,
            context,
            existingContent,
            evidenceText,
            operatorNotes: operatorNotes || null,
            targetFiles,
            originalIntent,
        });
        updatedPayload = parseMarkedFiles(raw, targetFiles);
    } catch (err) {
        log(`⚠  API call failed: ${err.message}`);
        log(`   Existing files were NOT overwritten.`);
        log(`   Preview/apply wrote nothing.`);
        log(`   Draft remains in its pre-evidence state.`);
        return;
    }

    const missingFiles = targetFiles.filter((f) => !updatedPayload[f]);
    if (missingFiles.length > 0) {
        log(`⚠  API did not return content for: ${missingFiles.join(", ")}`);
        log(`   Existing files were NOT overwritten (all-or-nothing).`);
        log(`   Preview/apply wrote nothing.`);
        log(`   Draft remains in its pre-evidence state.`);
        return;
    }

    if (preview) {
        printPreviewFiles({
            motionId,
            operation: "evidence",
            headerLines: [
                `Target motion: ${motionId}`,
                `Provider:      ${providerName(provider)}`,
                `Files:         ${targetFiles.join(", ")}`,
                `Evidence file: ${evidenceFilePath}`,
                ...(operatorNotes ? [`Operator notes: ${operatorNotes}`] : []),
                `Evidence mode: source-fed, non-inventing`,
            ],
            targetFiles,
            contentsByFile: updatedPayload,
        });
        return;
    }

    for (const f of targetFiles) {
        await fs.writeFile(path.join(motionDir, f), updatedPayload[f], "utf8");
    }

    log(`Evidence insertion complete for ${motionId}`);
    log(`─────────────────────────────────────────`);
    log(`Motion ID:       ${motionId}`);
    log(`Evidence file:   ${evidenceFilePath}`);
    log(`Files requested: ${targetFiles.join(", ")}`);
    log(`Files updated:   ${targetFiles.join(", ")}`);
    log(`Mode:            evidence-fed, ${providerLabel(provider)}`);
    if (operatorNotes) {
        log(`Operator notes:  ${operatorNotes}`);
    }
    log(``);
    log(`⚠  Human review is required before ratification.`);
    log(`   The model organized provided evidence but may not have placed it perfectly.`);
    log(`   Verify no claims were added beyond what the evidence shows.`);
    log(`   Check updated content with: git diff .nexus/motions/${motionId}/`);
    log(`─────────────────────────────────────────`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Usage / main
// ──────────────────────────────────────────────────────────────────────────────

function usage() {
    console.log(`
MOTION-FACTORY ${SCRIPT_VERSION}

Usage:
  node portal/scripts/motion-factory.mjs context  --intent "..." [--json]
  node portal/scripts/motion-factory.mjs draft    --intent "..." [--no-api] [--provider openai|anthropic] [--preview]
  node portal/scripts/motion-factory.mjs promote  --candidate <candidateId> [--no-api] [--provider openai|anthropic] [--preview]
  node portal/scripts/motion-factory.mjs revise   --motion motion-NNNN --notes "..." [--files f1,f2] [--provider openai|anthropic] [--preview]
  node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file path [--notes "..."] [--files f1,f2] [--provider openai|anthropic] [--preview]
  node portal/scripts/motion-factory.mjs status   [--json]

Commands:
  context    Inspect motion-specific repo context for a given intent.
             Writes no files. Calls no API. Requires --intent.

  draft      Create a 9-file motion package in DRAFT state.
             Structural files remain deterministic.
             Narrative files are placeholders (--no-api) or provider-generated.
             Provider: openai (default) or anthropic via --provider.
             Use --preview to print the proposed 9-file package without writing files.

  promote    Create a formal draft motion from an existing candidate artifact.
             Reuses the draft package-construction path but skips candidate emission.
             Writes promotion.json for durable lineage.
             Provider: openai (default) or anthropic via --provider.
             Use --preview to print the proposed package without writing files.

  revise     Revise narrative files in an existing draft from human notes.
             Narrower than draft: only touches narrative files.
             Atomic apply mode remains unchanged.
             Provider: openai (default) or anthropic via --provider.
             Use --preview to print proposed changes without writing files.

  evidence   Insert operator-provided evidence into proof-motion narrative files.
             Narrower than revise: never touches motion.yaml.
             Evidence-fed only: model organizes provided evidence, never invents results.
             Atomic apply mode remains unchanged.
             Provider: openai (default) or anthropic via --provider.
             Use --preview to print proposed changes without writing files.

  status     Show live factory configuration and readiness snapshot.
             No files written. No API calls. No arguments required.
             Unlike context, does not require --intent and reports factory
             configuration rather than motion-specific repo state.

Flags:
  --intent         (required for context/draft) Human intent prompt.
  --candidate      (promote only) Existing candidate ID under .nexus/candidates/.
  --json           (context/status) Output as a stable JSON object.
  --no-api         (draft/promote) Skip API generation; use placeholder scaffolds.
  --provider       (draft/promote/revise/evidence) Provider: openai (default) or anthropic.
  --preview        (draft/promote/revise/evidence) Preview proposed output without writing files.
  --motion         (revise/evidence) Target motion ID (e.g., motion-NNNN).
  --notes          (revise: required, evidence: optional) Human notes.
  --files          (revise/evidence) Comma-separated list of files to update.
  --evidence-file  (evidence only, required) Path to evidence file.

Revise file scope:
  Default: proposal.md, challenge.md, execution.md
  Allowed: proposal.md, challenge.md, execution.md, motion.yaml
  Never:   policy.yaml, decision.yaml, decision.md, vote.json, verify.json

Evidence file scope:
  Default: proposal.md, execution.md
  Allowed: proposal.md, execution.md, challenge.md
  Never:   motion.yaml, policy.yaml, decision.yaml, decision.md, vote.json, verify.json

Examples (PowerShell-ready):
  node portal/scripts/motion-factory.mjs context --intent "Reconcile model-routing.yaml"
  node portal/scripts/motion-factory.mjs draft --intent "Legacy cleanup motion"
  node portal/scripts/motion-factory.mjs draft --intent "Legacy cleanup" --provider anthropic
  node portal/scripts/motion-factory.mjs draft --intent "Quick scaffold" --no-api
  node portal/scripts/motion-factory.mjs draft --intent "Preview scaffold" --no-api --preview
  node portal/scripts/motion-factory.mjs draft --intent "Preview with Anthropic" --provider anthropic --preview
  node portal/scripts/motion-factory.mjs promote --candidate cm-20260327-000001-bounded-candidate-promotion --no-api --preview
  node portal/scripts/motion-factory.mjs promote --candidate cm-20260327-000001-bounded-candidate-promotion --no-api
  node portal/scripts/motion-factory.mjs promote --candidate cm-20260327-000001-bounded-candidate-promotion --provider anthropic --preview
  node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --notes "Tighten scope"
  node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --notes "Rewrite" --provider anthropic
  node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --notes "Preview rewrite" --preview
  node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file proof.txt
  node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file proof.txt --provider anthropic
  node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file proof.txt --preview
  node portal/scripts/motion-factory.mjs status
  node portal/scripts/motion-factory.mjs status --json
`);
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const cmd = args._[0];

    if (!cmd) {
        usage();
        process.exit(1);
    }

    const repoRoot = findRepoRoot(process.cwd());
    if (!repoRoot) {
        die(`Could not locate repo root (missing .nexus) from cwd: ${process.cwd()}`);
    }

    if (cmd === "context") {
        const intent = args.intent ? String(args.intent) : null;
        if (!intent) {
            die(
                `Missing --intent. Motion Factory requires human intent to operate.\n  Usage: node portal/scripts/motion-factory.mjs context --intent "..."`
            );
        }

        const jsonOutput = args.json === true;
        await contextCommand({ repoRoot, intent, jsonOutput });
        return;
    }

    if (cmd === "draft") {
        const intent = args.intent ? String(args.intent) : null;
        if (!intent) {
            die(
                `Missing --intent. Motion Factory requires human intent to operate.\n  Usage: node portal/scripts/motion-factory.mjs draft --intent "..." [--no-api] [--provider openai|anthropic] [--preview]`
            );
        }

        const noApi = args["no-api"] === true;
        const provider = resolveProvider(args);
        const preview = args.preview === true;
        await draftCommand({ repoRoot, intent, noApi, provider, preview });
        return;
    }

    if (cmd === "promote") {
        const candidateId = args.candidate ? String(args.candidate) : null;
        if (!candidateId) {
            die(
                `Missing --candidate.\n  Usage: node portal/scripts/motion-factory.mjs promote --candidate <candidateId> [--no-api] [--provider openai|anthropic] [--preview]`
            );
        }

        const noApi = args["no-api"] === true;
        const provider = resolveProvider(args);
        const preview = args.preview === true;
        await promoteCommand({ repoRoot, candidateId, noApi, provider, preview });
        return;
    }

    if (cmd === "revise") {
        const motionId = args.motion ? String(args.motion) : null;
        if (!motionId) {
            die(
                `Missing --motion.\n  Usage: node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --notes "..." [--files f1,f2] [--provider openai|anthropic] [--preview]`
            );
        }

        const notes = args.notes ? String(args.notes) : null;
        if (!notes) {
            die(
                `Missing --notes.\n  Usage: node portal/scripts/motion-factory.mjs revise --motion motion-NNNN --notes "..." [--files f1,f2] [--provider openai|anthropic] [--preview]`
            );
        }

        const requestedFiles = args.files
            ? String(args.files).split(",").map((f) => f.trim()).filter(Boolean)
            : [];

        const provider = resolveProvider(args);
        const preview = args.preview === true;
        await reviseCommand({ repoRoot, motionId, notes, requestedFiles, provider, preview });
        return;
    }

    if (cmd === "evidence") {
        const motionId = args.motion ? String(args.motion) : null;
        if (!motionId) {
            die(
                `Missing --motion.\n  Usage: node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file path [--notes "..."] [--files f1,f2] [--provider openai|anthropic] [--preview]`
            );
        }

        const evidenceFilePath = args["evidence-file"] ? String(args["evidence-file"]) : null;
        if (!evidenceFilePath) {
            die(
                `Missing --evidence-file.\n  Usage: node portal/scripts/motion-factory.mjs evidence --motion motion-NNNN --evidence-file path [--notes "..."] [--files f1,f2] [--provider openai|anthropic] [--preview]`
            );
        }

        const operatorNotes = args.notes ? String(args.notes) : null;
        const requestedFiles = args.files
            ? String(args.files).split(",").map((f) => f.trim()).filter(Boolean)
            : [];

        const provider = resolveProvider(args);
        const preview = args.preview === true;
        await evidenceCommand({
            repoRoot,
            motionId,
            evidenceFilePath,
            operatorNotes,
            requestedFiles,
            provider,
            preview,
        });
        return;
    }

    if (cmd === "status") {
        const jsonOutput = args.json === true;
        await statusCommand({ repoRoot, jsonOutput });
        return;
    }

    usage();
    die(`Unknown command: ${cmd}`);
}

main().catch((err) => die(err?.message || String(err)));
