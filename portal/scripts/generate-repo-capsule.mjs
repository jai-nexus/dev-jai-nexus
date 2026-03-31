#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_DIR = path.join(REPO_ROOT, "surfaces", "chat-context");

const IGNORE_DIRS = new Set([
    ".git",
    "node_modules",
    ".next",
    "dist",
    "tmp",
    ".vercel",
    ".turbo",
]);

const KEY_PATHS = [
    ".nexus/motions",
    ".nexus/model-slots.yaml",
    ".nexus/agent-panels.yaml",
    ".nexus/agent-manifest.yaml",
    "portal/scripts/council-run.mjs",
    "portal/src/lib/agentRuntime.ts",
    "portal/src/lib/work",
    "portal/src/app/operator",
    "portal/package.json",
];

function todayStamp() {
    return new Date().toISOString().slice(0, 10);
}

function utcNow() {
    return new Date().toISOString();
}

function git(args) {
    try {
        return execFileSync("git", args, {
            cwd: REPO_ROOT,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        }).trim();
    } catch {
        return "";
    }
}

async function pathExists(relPath) {
    try {
        await fs.access(path.join(REPO_ROOT, relPath));
        return true;
    } catch {
        return false;
    }
}

async function buildTree(dir, depth = 0, maxDepth = 4, lines = [], prefix = "") {
    if (depth > maxDepth) return lines;

    const entries = await fs.readdir(dir, { withFileTypes: true });
    const filtered = entries
        .filter((e) => !IGNORE_DIRS.has(e.name))
        .sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) return -1;
            if (!a.isDirectory() && b.isDirectory()) return 1;
            return a.name.localeCompare(b.name);
        });

    for (const entry of filtered) {
        const full = path.join(dir, entry.name);
        const rel = path.relative(REPO_ROOT, full).replaceAll("\\", "/");
        lines.push(`${prefix}${entry.isDirectory() ? "📁" : "📄"} ${rel}`);
        if (entry.isDirectory()) {
            await buildTree(full, depth + 1, maxDepth, lines, prefix);
        }
    }

    return lines;
}

async function main() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]) || "(unknown)";
    const head = git(["rev-parse", "--short", "HEAD"]) || "(unknown)";
    const dirty = git(["status", "--porcelain"]);
    const latestSubject = git(["log", "-1", "--pretty=%s"]) || "(unknown)";
    const latestMotionDir = (
        await fs.readdir(path.join(REPO_ROOT, ".nexus", "motions"), {
            withFileTypes: true,
        })
    )
        .filter((e) => e.isDirectory() && /^motion-\d+$/.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .at(-1);

    const treeLines = await buildTree(REPO_ROOT, 0, 3);
    const limitedTree = treeLines.slice(0, 250);

    const lines = [];
    lines.push("# Repo Capsule: dev-jai-nexus");
    lines.push(`generated_for_date: ${todayStamp()}`);
    lines.push("repo: dev-jai-nexus");
    lines.push(`branch: ${branch}`);
    lines.push(`head_commit: ${head}`);
    lines.push(`dirty_status: ${dirty ? "DIRTY" : "CLEAN"}`);
    lines.push(`latest_commit_subject: ${latestSubject}`);
    lines.push("");

    lines.push("## Purpose");
    lines.push(
        "- Governed execution and operator surfaces for JAI NEXUS development workflows.",
    );
    lines.push(
        "- Houses motion protocols, executor runtime logic, operator UI, and supporting scripts.",
    );
    lines.push("");

    lines.push("## Current Work Front");
    lines.push(`- latest_motion_dir: ${latestMotionDir ?? "n/a"}`);
    lines.push("- recent proven runtime strip: ARCHITECT -> BUILDER -> VERIFIER");
    lines.push("");

    lines.push("## Key Paths");
    for (const relPath of KEY_PATHS) {
        const ok = await pathExists(relPath);
        lines.push(`- ${ok ? "[x]" : "[ ]"} ${relPath}`);
    }
    lines.push("");

    lines.push("## Important Commands");
    lines.push(`- pnpm council:run ${latestMotionDir ?? "motion-XXXX"}`);
    lines.push("- pnpm -C portal typecheck");
    lines.push("- pnpm -C portal build");
    lines.push(
        `- node portal/scripts/generate-context-bundle.mjs --motion ${latestMotionDir ?? "motion-XXXX"}`,
    );
    lines.push("");

    lines.push("## Directory Tree (bounded)");
    for (const line of limitedTree) {
        lines.push(`- ${line}`);
    }
    if (treeLines.length > limitedTree.length) {
        lines.push(`- ... truncated ${treeLines.length - limitedTree.length} more entries`);
    }
    lines.push("");

    const outPath = path.join(OUTPUT_DIR, `${todayStamp()}_repo-capsule.txt`);
    await fs.writeFile(outPath, `${lines.join("\n").trimEnd()}\n`, "utf8");

    console.log(outPath);
}

main().catch((err) => {
    console.error("[generate-repo-capsule] FAILED");
    console.error(err);
    process.exit(1);
});
