#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { computeSelection } from "../src/lib/panels/panelSelectCore.mjs";

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

    const panelDir = path.join(repoRoot, ".nexus", "motions", args.motion, "panels", args.panel);

    const panelJsonPath = path.join(panelDir, "panel.json");
    const selectionJsonPath = path.join(panelDir, "selection.json");
    const selectorMdPath = path.join(panelDir, "selector.md");

    if (!(await pathExists(panelDir))) die(`Panel folder not found: ${panelDir}`);
    if (!(await pathExists(panelJsonPath))) die(`Missing panel.json: ${panelJsonPath}`);
    if (!(await pathExists(selectionJsonPath))) die(`Missing selection.json: ${selectionJsonPath}`);

    const panel = await readJson(panelJsonPath);
    let selection = await readJson(selectionJsonPath);

    // self-heal ids (bounded + harmless)
    selection.motion_id = args.motion;
    selection.panel_id = args.panel;

    const { next, meta } = computeSelection(panel, selection, { forceWinner: args.forceWinner });
    selection = next;

    // files list (useful for viewer)
    const files = new Set();
    files.add("panel.json");
    files.add("selection.json");
    if (await pathExists(selectorMdPath)) files.add("selector.md");
    for (const f of await listCandidateFiles(panelDir)) files.add(f);
    selection.files = Array.from(files).sort((a, b) => a.localeCompare(b));

    console.log(`[PANEL-SELECT] motion=${args.motion} panel=${args.panel}`);
    console.log(`[PANEL-SELECT] slots=${meta.slots}`);
    if (meta.best) console.log(`[PANEL-SELECT] best=${meta.best.slot} total=${meta.best.total}`);
    console.log(`[PANEL-SELECT] winner=${selection.winner}`);
    console.log(`[PANEL-SELECT] mode=${args.write ? "WRITE" : "DRY-RUN"}`);

    if (args.verbose && selection?.scores) {
        const slots = Object.keys(selection.scores).sort((a, b) => a.localeCompare(b));
        for (const s of slots) console.log(`  - ${s}: ${selection.scores[s]?.total ?? 0}`);
    }

    if (args.write) {
        const changed = await atomicWriteJsonIfChanged(selectionJsonPath, selection);
        console.log(changed ? `[PANEL-SELECT] wrote selection.json` : `[PANEL-SELECT] no changes (already up to date)`);
    } else {
        console.log(`[PANEL-SELECT] (dry-run) pass --write to persist`);
    }
})().catch((e) => die(e?.stack || e?.message || String(e)));
