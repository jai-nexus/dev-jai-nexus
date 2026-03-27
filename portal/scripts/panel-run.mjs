#!/usr/bin/env node
/**
 * Panel Runner v0 (scaffold + score + instantiate)
 *
 * Creates durable panel artifacts under:
 *   .nexus/motions/<motionId>/panels/<panelId>/
 *
 * Commands:
 *   node portal/scripts/panel-run.mjs scaffold     --motion motion-0010 --panel JAI_DEV_BUILDER_PANEL_V0 [--force]
 *   node portal/scripts/panel-run.mjs score        --motion motion-0010 --panel JAI_DEV_BUILDER_PANEL_V0
 *
 * Bulk:
 *   node portal/scripts/panel-run.mjs instantiate  --motion motion-0016 --all [--force] [--dry-run]
 *   node portal/scripts/panel-run.mjs instantiate  --motion motion-0016 --all --only JAI_DEV_BUILDER_PANEL_V0,JAI_DEV_ARCHITECT_PANEL_V0
 *   node portal/scripts/panel-run.mjs instantiate  --motion motion-0016 --all --exclude JAI_DEV_HELPER_PANEL_V0
 *   node portal/scripts/panel-run.mjs instantiate  --motion motion-0016 --panels JAI_DEV_BUILDER_PANEL_V0,JAI_DEV_LIBRARIAN_PANEL_V0
 *
 * Notes:
 * - No LLM calls. This is scaffolding + record keeping only.
 * - Idempotent: scaffold does not overwrite existing files unless --force is used.
 * - Manifest-gated: panels must be registered in .nexus/agent-panels.yaml
 */

import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import process from "node:process";
import yaml from "js-yaml";

const SCRIPT_VERSION = "panel-run.v0";

function die(msg) {
    console.error(`\n[PANEL-RUN] ERROR: ${msg}\n`);
    process.exit(1);
}

function log(msg) {
    console.log(`[PANEL-RUN] ${msg}`);
}

function isSafeId(id) {
    return /^[a-zA-Z0-9._-]+$/.test(String(id ?? ""));
}

async function exists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function ensureDir(p) {
    await fs.mkdir(p, { recursive: true });
}

async function readText(p) {
    return await fs.readFile(p, "utf8");
}

async function writeTextIfMissing(p, contents) {
    if (!(await exists(p))) {
        await fs.writeFile(p, contents, "utf8");
        return true;
    }
    return false;
}

async function writeTextIfChanged(p, contents) {
    const next = normalizeText(contents);
    if (await exists(p)) {
        const old = normalizeText(await readText(p));
        if (old === next) return false;
    }
    await fs.writeFile(p, next, "utf8");
    return true;
}

function normalizeText(t) {
    return (
        String(t ?? "")
            .replace(/\r\n/g, "\n")
            .split("\n")
            .map((l) => l.replace(/[ \t]+$/g, ""))
            .join("\n")
            .trimEnd() + "\n"
    );
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

function safeYamlLoad(text, label) {
    try {
        const obj = yaml.load(text);
        if (!obj || typeof obj !== "object") return null;
        return obj;
    } catch (err) {
        die(`Failed to parse YAML for ${label}: ${err?.message || String(err)}`);
    }
}

function assertString(v, label) {
    if (typeof v !== "string" || v.trim().length === 0) die(`${label} must be a non-empty string`);
    return v.trim();
}

function assertArray(v, label) {
    if (!Array.isArray(v)) die(`${label} must be an array`);
    return v;
}

function splitCsv(v) {
    const raw = String(v ?? "").trim();
    if (!raw) return [];
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function toPanelDir(repoRoot, motionId, panelId) {
    return path.join(repoRoot, ".nexus", "motions", motionId, "panels", panelId);
}

async function loadPanelsManifest(repoRoot) {
    const panelsPath = path.join(repoRoot, ".nexus", "agent-panels.yaml");
    if (!(await exists(panelsPath))) die(`Missing .nexus/agent-panels.yaml`);

    const obj = safeYamlLoad(await readText(panelsPath), ".nexus/agent-panels.yaml");
    const panels = obj?.panels;
    if (!panels || typeof panels !== "object") die(`agent-panels.yaml missing "panels:" root`);

    return { panelsPath, panels };
}

async function loadPanelSpec(repoRoot, panelId) {
    const { panelsPath, panels } = await loadPanelsManifest(repoRoot);
    const spec = panels[panelId];
    if (!spec) die(`Panel "${panelId}" not found in .nexus/agent-panels.yaml`);
    return { panelsPath, spec };
}

async function loadSlots(repoRoot) {
    const slotsPath = path.join(repoRoot, ".nexus", "model-slots.yaml");
    if (!(await exists(slotsPath))) die(`Missing .nexus/model-slots.yaml`);
    const slotsObj = safeYamlLoad(await readText(slotsPath), ".nexus/model-slots.yaml");
    const slots = slotsObj?.slots;
    if (!slots || typeof slots !== "object") die(`model-slots.yaml missing "slots:" root`);

    // Phase 1 overlay: merge live slots from model-slots-phase1.yaml if present
    const phase1Path = path.join(repoRoot, ".nexus", "model-slots-phase1.yaml");
    if (await exists(phase1Path)) {
        const phase1Obj = safeYamlLoad(await readText(phase1Path), ".nexus/model-slots-phase1.yaml");
        const phase1Slots = phase1Obj?.slots;
        if (phase1Slots && typeof phase1Slots === "object") {
            for (const [key, val] of Object.entries(phase1Slots)) {
                if (val?.live === true) {
                    slots[key] = val;
                }
            }
            log(`Merged ${Object.keys(phase1Slots).filter(k => phase1Slots[k]?.live === true).length} live slot(s) from model-slots-phase1.yaml`);
        }
    }

    return { slotsPath, slotsObj, slots };
}

function validateRubric(rubric) {
    const arr = assertArray(rubric, "rubric");
    const ids = new Set();
    let sum = 0;

    for (const item of arr) {
        if (!item || typeof item !== "object") die(`rubric entries must be objects`);
        const id = assertString(item.id, "rubric[].id");
        if (ids.has(id)) die(`rubric has duplicate id: ${id}`);
        ids.add(id);

        const w = item.weight;
        if (typeof w !== "number" || !Number.isFinite(w) || w < 0) die(`rubric weight for ${id} must be a number >= 0`);
        sum += w;
    }

    const close = Math.abs(sum - 1.0) < 0.0001;
    if (!close) die(`rubric weights must sum to 1.00 (got ${sum.toFixed(4)})`);

    return Array.from(ids);
}

function selectionTemplate({ panelId, motionId, candidateSlots, rubricIds }) {
    const scores = {};
    for (const s of candidateSlots) {
        const breakdown = {};
        for (const rid of rubricIds) breakdown[rid] = 0;
        scores[s] = { total: 0, breakdown };
    }

    return {
        version: "panel.selection.v0",
        panel_id: panelId,
        motion_id: motionId,
        task: "UNKNOWN",
        winner: "UNKNOWN",
        scores,
        winner_rationale: [],
        reservations: [],
        evidence_plan: { commands: [], expected: [] },
        files: [],
    };
}

function panelMeta({ panelId, roleId, candidateSlots, selectorSlot, rubric }) {
    return {
        version: "panel.meta.v0",
        panel_id: panelId,
        role_id: roleId,
        candidates: candidateSlots,
        selector: selectorSlot,
        rubric,
    };
}

function candidateMdTemplate(slot) {
    return `# Candidate (${slot})

## Summary
- UNKNOWN

## Files touched
- UNKNOWN

## Patch sketch
- (paste key code blocks here)

## Evidence plan
- \`pnpm -C portal typecheck\`
- (add more)

## Risks / tradeoffs
- UNKNOWN

## Estimated diff size
- XS | S | M | L
`;
}

function selectorMdTemplate(panelId, rubric) {
    const lines = rubric
        .map((r) => `- ${r.id} (${r.weight.toFixed(2)}): ${r.description ?? ""}`.trimEnd())
        .join("\n");

    return `# Selector (${panelId})

You are the selector for this panel. Your job is to score each candidate with explicit numbers and pick ONE winner.

## Rubric (0–10 each)
${lines}

## Scoring rules
- Each criterion scored 0–10 per candidate.
- Weighted total = sum(score * weight) * 10 -> 0–100.
- Provide 1–3 bullets justifying the winner and the runner-up.

## Output expectation
Update selection.json:
- scores.<slot>.breakdown.<criterion> numbers (0–10)
- scores.<slot>.total computed (0–100)
- winner set to the chosen slot
- winner_rationale filled
- reservations optional (if any)
- evidence_plan filled if applicable
- files list updated
`;
}

function stableJson(obj) {
    return JSON.stringify(obj, null, 2) + "\n";
}

function computeTotals(selection, rubric) {
    const rubricIds = rubric.map((r) => r.id);
    const weights = Object.fromEntries(rubric.map((r) => [r.id, r.weight]));

    const scores = selection?.scores && typeof selection.scores === "object" ? selection.scores : null;
    if (!scores) die(`selection.json missing "scores" object`);

    for (const [slot, entry] of Object.entries(scores)) {
        const breakdown = entry?.breakdown;
        if (!breakdown || typeof breakdown !== "object") die(`scores.${slot}.breakdown missing or not object`);

        let weighted = 0;
        for (const id of rubricIds) {
            const raw = breakdown[id];
            const n = typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
            const clamped = Math.max(0, Math.min(10, n));
            breakdown[id] = clamped;
            weighted += clamped * (weights[id] ?? 0);
        }
        entry.total = Math.round(weighted * 10 * 100) / 100;
    }

    return selection;
}

async function scaffold({ repoRoot, motionId, panelId, force }) {
    if (!isSafeId(motionId)) die(`Unsafe motion id: ${motionId}`);
    if (!isSafeId(panelId)) die(`Unsafe panel id: ${panelId}`);

    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
    if (!(await exists(motionDir))) die(`Motion folder missing: .nexus/motions/${motionId}`);

    const { spec } = await loadPanelSpec(repoRoot, panelId);
    const { slots } = await loadSlots(repoRoot);

    const roleId = assertString(spec.role_id, `panels.${panelId}.role_id`);
    const candidates = assertArray(spec.candidates, `panels.${panelId}.candidates`).map((s) => assertString(s, "candidate slot"));
    if (candidates.length < 2) {
        die(`Panel ${panelId} must define at least 2 candidates (got ${candidates.length})`);
    }

    const selectorSlot = assertString(spec?.selector?.slot, `panels.${panelId}.selector.slot`);
    const rubric = assertArray(spec.rubric, `panels.${panelId}.rubric`);
    const rubricIds = validateRubric(rubric);

    for (const s of [...candidates, selectorSlot]) {
        if (!slots[s]) die(`model-slots.yaml missing slot: ${s}`);
    }

    const panelDir = toPanelDir(repoRoot, motionId, panelId);
    const candidatesDir = path.join(panelDir, "candidates");
    await ensureDir(candidatesDir);

    const panelJsonPath = path.join(panelDir, "panel.json");
    const selectorMdPath = path.join(panelDir, "selector.md");
    const selectionJsonPath = path.join(panelDir, "selection.json");

    const panelJson = panelMeta({ panelId, roleId, candidateSlots: candidates, selectorSlot, rubric });

    if (force) await writeTextIfChanged(panelJsonPath, stableJson(panelJson));
    else await writeTextIfMissing(panelJsonPath, stableJson(panelJson));

    const selectorMd = selectorMdTemplate(panelId, rubric);
    if (force) await writeTextIfChanged(selectorMdPath, selectorMd);
    else await writeTextIfMissing(selectorMdPath, selectorMd);

    for (const slot of candidates) {
        const p = path.join(candidatesDir, `${slot}.md`);
        if (force) await writeTextIfChanged(p, candidateMdTemplate(slot));
        else await writeTextIfMissing(p, candidateMdTemplate(slot));
    }

    const selectionObj = selectionTemplate({ panelId, motionId, candidateSlots: candidates, rubricIds });
    if (force) await writeTextIfChanged(selectionJsonPath, stableJson(selectionObj));
    else await writeTextIfMissing(selectionJsonPath, stableJson(selectionObj));

    log(`Scaffold complete: ${path.relative(repoRoot, panelDir)}`);
    log(`- panel.json`);
    log(`- selector.md`);
    log(`- candidates/${candidates.length} files`);
    log(`- selection.json`);
}

async function instantiate({ repoRoot, motionId, panelIds, force, dryRun }) {
    if (!isSafeId(motionId)) die(`Unsafe motion id: ${motionId}`);

    const motionDir = path.join(repoRoot, ".nexus", "motions", motionId);
    if (!(await exists(motionDir))) die(`Motion folder missing: .nexus/motions/${motionId}`);

    const unique = Array.from(new Set(panelIds)).sort((a, b) => a.localeCompare(b));
    for (const id of unique) {
        if (!isSafeId(id)) die(`Unsafe panel id in list: ${id}`);
    }

    if (dryRun) {
        log(`Dry run: would scaffold ${unique.length} panel(s) into .nexus/motions/${motionId}/panels/*`);
        for (const id of unique) log(`- ${id}`);
        return;
    }

    log(`Instantiating ${unique.length} panel(s) for ${motionId}…`);
    for (const panelId of unique) {
        await scaffold({ repoRoot, motionId, panelId, force });
    }
    log(`Instantiate done: ${unique.length} panel(s)`);
}

async function score({ repoRoot, motionId, panelId }) {
    if (!isSafeId(motionId)) die(`Unsafe motion id: ${motionId}`);
    if (!isSafeId(panelId)) die(`Unsafe panel id: ${panelId}`);

    const panelDir = toPanelDir(repoRoot, motionId, panelId);
    const panelJsonPath = path.join(panelDir, "panel.json");
    const selectionJsonPath = path.join(panelDir, "selection.json");

    if (!(await exists(panelJsonPath))) die(`Missing panel.json (run scaffold first): ${path.relative(repoRoot, panelJsonPath)}`);
    if (!(await exists(selectionJsonPath))) die(`Missing selection.json (run scaffold first): ${path.relative(repoRoot, selectionJsonPath)}`);

    const panelObj = JSON.parse(await readText(panelJsonPath));
    const rubric = assertArray(panelObj.rubric, "panel.json rubric");
    validateRubric(rubric);

    const selectionObj = JSON.parse(await readText(selectionJsonPath));
    const updated = computeTotals(selectionObj, rubric);

    const nextText = stableJson(updated);
    const oldText = await readText(selectionJsonPath);
    if (normalizeText(oldText) !== normalizeText(nextText)) {
        await fs.writeFile(selectionJsonPath, nextText, "utf8");
        log(`Updated totals in ${path.relative(repoRoot, selectionJsonPath)}`);
    } else {
        log(`No changes (totals already consistent): ${path.relative(repoRoot, selectionJsonPath)}`);
    }

    const scores = updated.scores ?? {};
    const entries = Object.entries(scores).map(([slot, v]) => ({ slot, total: v?.total ?? 0 }));
    entries.sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
    log(`Score summary (highest first):`);
    for (const e of entries) log(`- ${e.slot}: ${e.total}`);
}

function usage() {
    console.log(`
PANEL-RUN ${SCRIPT_VERSION}

Usage:
  node portal/scripts/panel-run.mjs scaffold    --motion motion-0010 --panel JAI_DEV_BUILDER_PANEL_V0 [--force]
  node portal/scripts/panel-run.mjs score       --motion motion-0010 --panel JAI_DEV_BUILDER_PANEL_V0

Bulk (manifest-gated):
  node portal/scripts/panel-run.mjs instantiate --motion motion-0016 --all [--force] [--dry-run]
  node portal/scripts/panel-run.mjs instantiate --motion motion-0016 --panels A,B,C [--force] [--dry-run]
  node portal/scripts/panel-run.mjs instantiate --motion motion-0016 --all --only A,B
  node portal/scripts/panel-run.mjs instantiate --motion motion-0016 --all --exclude A,B

Notes:
  - scaffold creates panel artifacts under .nexus/motions/<motion>/panels/<panel>/
  - score recomputes totals in selection.json using the panel rubric
  - instantiate scaffolds multiple panels using .nexus/agent-panels.yaml (no free-form panels)
  - --force overwrites templates; without it, scaffold is create-if-missing
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
    if (!repoRoot) die(`Could not locate repo root (missing .nexus) from cwd: ${process.cwd()}`);

    const motionId = args.motion ? String(args.motion) : null;
    const panelId = args.panel ? String(args.panel) : null;
    const force = args.force === true;

    if (!motionId) die(`Missing --motion (e.g., --motion motion-0010)`);

    if (cmd === "scaffold") {
        if (!panelId) die(`Missing --panel (e.g., --panel JAI_DEV_BUILDER_PANEL_V0)`);
        await scaffold({ repoRoot, motionId, panelId, force });
        return;
    }

    if (cmd === "score") {
        if (!panelId) die(`Missing --panel (e.g., --panel JAI_DEV_BUILDER_PANEL_V0)`);
        await score({ repoRoot, motionId, panelId });
        return;
    }

    if (cmd === "instantiate") {
        const dryRun = args["dry-run"] === true || args.dryrun === true;
        const all = args.all === true;

        const only = splitCsv(args.only);
        const exclude = splitCsv(args.exclude);
        const panelsCsv = splitCsv(args.panels);

        let panelIds = [];

        if (all) {
            const { panels } = await loadPanelsManifest(repoRoot);
            panelIds = Object.keys(panels).sort((a, b) => a.localeCompare(b));
        } else if (panelsCsv.length) {
            panelIds = panelsCsv;
        } else if (panelId) {
            panelIds = [panelId];
        } else {
            die(`instantiate requires --all, or --panels A,B,C, or --panel <panelId>`);
        }

        if (only.length) {
            const set = new Set(only);
            // validate requested panel ids exist if using --all
            if (all) {
                const { panels } = await loadPanelsManifest(repoRoot);
                for (const id of only) if (!panels[id]) die(`--only panel not found in agent-panels.yaml: ${id}`);
            }
            panelIds = panelIds.filter((id) => set.has(id));
        }

        if (exclude.length) {
            const set = new Set(exclude);
            panelIds = panelIds.filter((id) => !set.has(id));
        }

        if (panelIds.length === 0) die(`instantiate resolved to 0 panels (check --only/--exclude filters)`);

        await instantiate({ repoRoot, motionId, panelIds, force, dryRun });
        return;
    }

    usage();
    die(`Unknown command: ${cmd}`);
}

main().catch((err) => die(err?.message || String(err)));
