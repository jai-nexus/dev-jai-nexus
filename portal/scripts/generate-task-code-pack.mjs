#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_DIR = path.join(REPO_ROOT, "surfaces", "code-context");

const EXCLUDED_PREFIXES = [
    ".git/",
    ".git\\",
    "node_modules/",
    "node_modules\\",
    ".next/",
    ".next\\",
    "dist/",
    "dist\\",
    "tmp/",
    "tmp\\",
    ".vercel/",
    ".vercel\\",
    ".turbo/",
    ".turbo\\",
    "surfaces/",
    "surfaces\\",
];

const CODE_EXTENSIONS = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".yaml",
    ".yml",
    ".sql",
    ".css",
    ".prisma",
    ".sh",
    ".ps1",
]);

const SPECIAL_CODE_FILENAMES = new Set([
    "package.json",
    "pnpm-workspace.yaml",
    "pnpm-lock.yaml",
    "tsconfig.json",
    "next.config.ts",
    "next.config.js",
]);

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
        }).trimEnd();
    } catch {
        return "";
    }
}

function normalizePath(relPath) {
    return String(relPath ?? "").replace(/\\/g, "/").trim();
}

function getArgValue(flag) {
    const idx = process.argv.indexOf(flag);
    if (idx === -1) return null;
    return process.argv[idx + 1] ?? null;
}

function getArgValues(flag) {
    const values = [];
    for (let i = 0; i < process.argv.length; i += 1) {
        if (process.argv[i] === flag && process.argv[i + 1]) {
            values.push(process.argv[i + 1]);
        }
    }
    return values;
}

function isExcludedPath(relPath) {
    const p = normalizePath(relPath);
    return EXCLUDED_PREFIXES.some((prefix) =>
        p.startsWith(normalizePath(prefix)),
    );
}

function isLikelyCodeSurfacePath(relPath) {
    const p = normalizePath(relPath);
    if (!p || isExcludedPath(p)) return false;

    const base = path.basename(p);
    if (SPECIAL_CODE_FILENAMES.has(base)) return true;

    const ext = path.extname(p).toLowerCase();
    return CODE_EXTENSIONS.has(ext);
}

async function exists(relPath) {
    try {
        await fs.access(path.join(REPO_ROOT, relPath));
        return true;
    } catch {
        return false;
    }
}

async function safeRead(relPath) {
    return fs.readFile(path.join(REPO_ROOT, relPath), "utf8").catch(() => "");
}

function trimBlankEdges(lines) {
    let start = 0;
    let end = lines.length;

    while (start < end && lines[start].trim() === "") start += 1;
    while (end > start && lines[end - 1].trim() === "") end -= 1;

    return lines.slice(start, end);
}

function excerptWithLineNumbers(text, maxLines = 120) {
    const normalized = String(text).replace(/\r\n/g, "\n");
    const rawLines = normalized.split("\n");
    const trimmed = trimBlankEdges(rawLines).slice(0, maxLines);

    return trimmed
        .map((line, idx) => `${String(idx + 1).padStart(4, " ")} | ${line}`)
        .join("\n")
        .trim();
}

function inferFenceLanguage(relPath) {
    const ext = path.extname(relPath).toLowerCase();
    if (ext === ".ts") return "ts";
    if (ext === ".tsx") return "tsx";
    if (ext === ".js" || ext === ".mjs" || ext === ".cjs") return "js";
    if (ext === ".json") return "json";
    if (ext === ".yaml" || ext === ".yml") return "yaml";
    if (ext === ".sql") return "sql";
    if (ext === ".css") return "css";
    if (ext === ".prisma") return "prisma";
    if (ext === ".sh") return "bash";
    if (ext === ".ps1") return "powershell";
    return "";
}

function buildReferenceList(items) {
    if (items.length === 0) return "- none";
    return items.map((item) => `- ${item}`).join("\n");
}

function parsePathsFromText(text) {
    const found = new Set();

    const backtickRe = /`([^`\n]+)`/g;
    for (const match of text.matchAll(backtickRe)) {
        const candidate = normalizePath(match[1]);
        if (candidate.includes("/")) {
            found.add(candidate);
        }
    }

    const lineRe =
        /(?:^|\n)\s*-\s+([A-Za-z0-9._/@-]+(?:\/[A-Za-z0-9._/@-]+)+)/g;
    for (const match of text.matchAll(lineRe)) {
        found.add(normalizePath(match[1]));
    }

    return [...found].sort();
}

async function getMotionDerivedPaths(motionId) {
    if (!motionId) return [];

    const motionDir = `.nexus/motions/${motionId}`;
    const files = [
        `${motionDir}/execution.md`,
        `${motionDir}/proposal.md`,
        `${motionDir}/challenge.md`,
    ];

    const derived = new Set();

    for (const file of files) {
        const text = await safeRead(file);
        if (!text) continue;

        for (const candidate of parsePathsFromText(text)) {
            if (
                !candidate.startsWith(".nexus/motions/") &&
                isLikelyCodeSurfacePath(candidate)
            ) {
                derived.add(candidate);
            }
        }
    }

    return [...derived].sort();
}

function parseGitStatusPath(rawLine) {
    const line = String(rawLine ?? "");
    if (!line) return "";

    if (line.startsWith("?? ")) {
        return normalizePath(line.slice(3));
    }

    if (line.length >= 4) {
        const candidate = normalizePath(line.slice(3));
        if (candidate.includes(" -> ")) {
            return normalizePath(candidate.split(" -> ").at(-1) ?? "");
        }
        return candidate;
    }

    return "";
}

function getGitModifiedPaths() {
    const status = git(["status", "--short"]);
    if (!status) return [];

    return status
        .split("\n")
        .map((line) => parseGitStatusPath(line))
        .filter(Boolean)
        .filter((p) => isLikelyCodeSurfacePath(p))
        .sort();
}

async function main() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const motionId = getArgValue("--motion");
    const explicitPaths = getArgValues("--path")
        .map(normalizePath)
        .filter(Boolean);

    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]) || "(unknown)";
    const head = git(["rev-parse", "--short", "HEAD"]) || "(unknown)";
    const latestCommitSubject =
        git(["log", "-1", "--pretty=%s"]) || "(unknown)";

    const motionDerivedPaths = await getMotionDerivedPaths(motionId);
    const gitModifiedPaths = getGitModifiedPaths();

    const selectedSet = new Set();

    for (const p of explicitPaths) {
        if (isLikelyCodeSurfacePath(p) && (await exists(p))) {
            selectedSet.add(p);
        }
    }

    for (const p of motionDerivedPaths) {
        if (await exists(p)) {
            selectedSet.add(p);
        }
    }

    for (const p of gitModifiedPaths.slice(0, 12)) {
        if (await exists(p)) {
            selectedSet.add(p);
        }
    }

    const selectedFiles = [...selectedSet].sort();
    const date = todayStamp();
    const outputFile = `${date}_task-code-pack.txt`;
    const manifestFile = `${date}_task-code-pack_manifest.json`;

    const lines = [];
    lines.push("# Task-Local Code Surface Pack");
    lines.push(`generated_for_date: ${date}`);
    lines.push("repo: dev-jai-nexus");
    lines.push(`branch: ${branch}`);
    lines.push(`head_commit: ${head}`);
    lines.push(`motion: ${motionId ?? "n/a"}`);
    lines.push(`selected_files_count: ${selectedFiles.length}`);
    lines.push("");

    lines.push("## Purpose");
    lines.push(
        "This is a generated task-local code surface pack for code-heavy Claude sessions. It is a bounded file-context layer meant to reduce manual file gathering. Canonical truth remains in the actual repo source files.",
    );
    lines.push("");

    lines.push("## Current Repo State");
    lines.push(`- latest_commit_subject: ${latestCommitSubject}`);
    lines.push(`- motion: ${motionId ?? "n/a"}`);
    lines.push(`- branch: ${branch}`);
    lines.push(`- head_commit: ${head}`);
    lines.push("");

    lines.push("## Generation Inputs");
    lines.push("### Explicit Paths");
    lines.push(buildReferenceList(explicitPaths));
    lines.push("");

    lines.push("### Motion-Derived Paths");
    lines.push(buildReferenceList(motionDerivedPaths));
    lines.push("");

    lines.push("### Git-Modified Paths Considered");
    lines.push(buildReferenceList(gitModifiedPaths.slice(0, 12)));
    lines.push("");

    lines.push("## Selected Files");
    lines.push(buildReferenceList(selectedFiles));
    lines.push("");

    for (const relPath of selectedFiles) {
        const content = await safeRead(relPath);
        const language = inferFenceLanguage(relPath);

        lines.push(`## ${relPath}`);
        lines.push("Path is canonical. Use the actual repo file as source of truth.");
        lines.push("");

        if (!content) {
            lines.push("(missing or unreadable)");
            lines.push("");
            continue;
        }

        lines.push(`~~~${language}`);
        lines.push(excerptWithLineNumbers(content, 120) || "(empty)");
        lines.push("~~~");
        lines.push("");
    }

    const outPath = path.join(OUTPUT_DIR, outputFile);
    await fs.writeFile(outPath, `${lines.join("\n").trimEnd()}\n`, "utf8");

    const manifest = {
        schema: "task-code-pack-0.1",
        generated_at: utcNow(),
        repo: "dev-jai-nexus",
        branch,
        head_commit: head,
        motion: motionId ?? null,
        output_dir: "surfaces/code-context",
        files: [outputFile],
        inputs: {
            explicit_paths: explicitPaths,
            motion_derived_paths: motionDerivedPaths,
            git_modified_paths_considered: gitModifiedPaths.slice(0, 12),
        },
        selected_files: selectedFiles,
    };

    const manifestPath = path.join(OUTPUT_DIR, manifestFile);
    await fs.writeFile(
        manifestPath,
        `${JSON.stringify(manifest, null, 2)}\n`,
        "utf8",
    );

    console.log(outPath);
    console.log(manifestPath);
}

main().catch((err) => {
    console.error("[generate-task-code-pack] FAILED");
    console.error(err);
    process.exit(1);
});
