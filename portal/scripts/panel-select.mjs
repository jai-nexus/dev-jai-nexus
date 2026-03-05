#!/usr/bin/env node
/**
 * Panel Selection Runner v0
 *
 * Reads:
 * - .nexus/motions/<motionId>/panels/<panelId>/panel.json
 * - .nexus/motions/<motionId>/panels/<panelId>/selection.json
 *
 * Computes:
 * - scores.<slot>.total = sum(breakdown[criterion] * weight) * 10  -> 0..100
 * - winner = max total (tie-break slot name asc)
 *
 * Writes (only if --write):
 * - selection.json (atomic write)
 *
 * No API calls. No secrets. Deterministic.
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function die(msg) {
    console.error(`\n[PANEL-SELECT] ERROR: ${msg}\n`);
    process.exit(1);
}

function isSafeId(id) {
    return /^[a-zA-Z0-9._-]+$/.test(id);
}

async function pathExists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function findRepoRoot(startDir) {
    let cur = path.resolve(startDir);
    for (let i = 0; i < 10; i++) {
        const nexusDir = path.join(cur, ".nexus");
        if (await pathExists(nexusDir)) return cur;
        const parent = path.dirname(cur);
        if (parent === cur) break;
        cur = parent;
    }
    return null;
}

function parseArgs(argv) {
    const args = {
        motion: null,
        panel: null,
        write: false,
        forceWinner: false,
        verbose: false,
    };

    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--motion" && argv[i + 1]) args.motion = argv[++i];
        else if (a === "--panel" && argv[i + 1]) args.panel = argv[++i];
        else if (a === "--write") args.write = true;
        else if (a === "--force-winner") args.forceWinner = true;
        else if (a === "--verbose") args.verbose = true;
    }
    return args;
}

async function readJson(p) {
    const txt = await fs.readFile(p, "utf8");
    return JSON.parse(txt);
}

async function atomicWriteJsonIfChanged(p, obj) {
    const text = JSON.stringify(obj, null, 2);
    let cur = null;
    try {
        cur = await fs.readFile(p, "utf8");
    } catch {
        // ignore
    }
    if (cur === text) return false;

    const tmp = `${p}.tmp`;
    await fs.writeFile(tmp, text, "utf8");
    await fs.rename(tmp, p);
    return true;
}

function clamp01to10(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return 0;
    if (x < 0) return 0;
    if (x > 10) return 10;
    return x;
}

function round2(n) {
    return Math.round(n * 100) / 100;
}

function computeTotal(breakdown, rubric) {
    // sum(score * weight) * 10 => 0..100
    let sum = 0;
    for (const r of rubric) {
        const id = String(r?.id ?? "").trim();
        const w = Number(r?.weight ?? 0);
        if (!id || !Number.isFinite(w)) continue;
        const s = clamp01to10(breakdown?.[id] ?? 0);
        sum += s * w;
    }
    return round2(sum * 10);
}

async function listCandidateFiles(panelDir) {
    const candidatesDir = path.join(panelDir, "candidates");
    if (!(await pathExists(candidatesDir))) return [];
    const entries = await fs.readdir(candidatesDir, { withFileTypes: true });
    return entries
        .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
        .map((e) => `candidates/${e.name}`)
        .sort((a, b) => a.localeCompare(b));
}

(async function main() {
    const args = parseArgs(process.argv);

    if (!args.motion) die("Missing --motion <motionId>");
    if (!args.panel) die("Missing --panel <panelId>");
    if (!isSafeId(args.motion)) die(`Unsafe motion id: ${args.motion}`);
    if (!isSafeId(args.panel)) die(`Unsafe panel id: ${args.panel}`);

    const repoRoot = await findRepoRoot(process.cwd());
    if (!repoRoot) die("Repo root not found (missing .nexus directory).");

    const panelDir = path.join(
        repoRoot,
        ".nexus",
        "motions",
        args.motion,
        "panels",
        args.panel
    );

    const panelJsonPath = path.join(panelDir, "panel.json");
    const selectionJsonPath = path.join(panelDir, "selection.json");
    const selectorMdPath = path.join(panelDir, "selector.md");

    if (!(await pathExists(panelDir))) die(`Panel folder not found: ${panelDir}`);
    if (!(await pathExists(panelJsonPath))) die(`Missing panel.json: ${panelJsonPath}`);
    if (!(await pathExists(selectionJsonPath))) die(`Missing selection.json: ${selectionJsonPath}`);

    const panel = await readJson(panelJsonPath);
    const selection = await readJson(selectionJsonPath);

    const rubric = Array.isArray(panel?.rubric) ? panel.rubric : [];
    if (rubric.length === 0) die("panel.json rubric is missing or empty.");

    const scores = selection?.scores ?? {};
    const slots = Object.keys(scores).sort((a, b) => a.localeCompare(b));

    if (slots.length === 0) die("selection.json has no scores entries.");

    let anyNonZero = false;
    const totalsBySlot = [];

    for (const slot of slots) {
        const entry = scores[slot] ?? {};
        const breakdown = entry.breakdown ?? {};
        const total = computeTotal(breakdown, rubric);

        if (total > 0) anyNonZero = true;

        // normalize breakdown values to clamped numbers (0..10)
        const nextBreakdown = { ...breakdown };
        for (const r of rubric) {
            const id = String(r?.id ?? "").trim();
            if (!id) continue;
            nextBreakdown[id] = clamp01to10(nextBreakdown[id] ?? 0);
        }

        scores[slot] = {
            total,
            breakdown: nextBreakdown,
        };

        totalsBySlot.push({ slot, total });
    }

    totalsBySlot.sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        return a.slot.localeCompare(b.slot);
    });

    const best = totalsBySlot[0];
    const computedWinner =
        (anyNonZero || args.forceWinner) && best ? best.slot : "UNKNOWN";

    // update selection record core ids to match path (safe + self-healing)
    selection.motion_id = args.motion;
    selection.panel_id = args.panel;

    selection.scores = scores;

    // only override winner if we actually computed one OR force is set
    if (computedWinner !== "UNKNOWN" || args.forceWinner) {
        selection.winner = computedWinner;
    } else {
        // keep UNKNOWN if nothing is scored yet
        selection.winner = "UNKNOWN";
    }

    // update files list (bounded + useful)
    const files = new Set();
    files.add("panel.json");
    files.add("selection.json");
    if (await pathExists(selectorMdPath)) files.add("selector.md");
    for (const f of await listCandidateFiles(panelDir)) files.add(f);
    selection.files = Array.from(files).sort((a, b) => a.localeCompare(b));

    // show result
    console.log(`[PANEL-SELECT] motion=${args.motion} panel=${args.panel}`);
    console.log(`[PANEL-SELECT] slots=${slots.length}`);
    console.log(`[PANEL-SELECT] best=${best.slot} total=${best.total}`);
    console.log(`[PANEL-SELECT] winner=${selection.winner}`);
    console.log(`[PANEL-SELECT] mode=${args.write ? "WRITE" : "DRY-RUN"}`);

    if (args.verbose) {
        for (const t of totalsBySlot) console.log(`  - ${t.slot}: ${t.total}`);
    }

    if (args.write) {
        const changed = await atomicWriteJsonIfChanged(selectionJsonPath, selection);
        console.log(changed ? `[PANEL-SELECT] wrote selection.json` : `[PANEL-SELECT] no changes (already up to date)`);
    } else {
        console.log(`[PANEL-SELECT] (dry-run) pass --write to persist`);
    }
})().catch((e) => die(e?.stack || e?.message || String(e)));
