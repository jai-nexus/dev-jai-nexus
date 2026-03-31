#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_DIR = path.join(REPO_ROOT, "surfaces", "chat-context");

const EXCLUDED_PREFIXES = [
    "surfaces/",
    "surfaces\\",
    "node_modules/",
    "node_modules\\",
    ".git/",
    ".git\\",
    ".next/",
    ".next\\",
    "dist/",
    "dist\\",
    "tmp/",
    "tmp\\",
    ".vercel/",
    ".vercel\\",
];

function todayStamp() {
    return new Date().toISOString().slice(0, 10);
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

function normalizeText(text) {
    return String(text)
        .replace(/\r\n/g, "\n")
        .replace(/[–—]/g, "-")
        .replace(/[→]/g, "->")
        .replace(/\u00a0/g, " ");
}

function shouldIncludePath(relPath) {
    const normalized = String(relPath).trim().replaceAll("\\", "/");
    if (!normalized) return false;
    return !EXCLUDED_PREFIXES.some((prefix) =>
        normalized.startsWith(prefix.replaceAll("\\", "/")),
    );
}

async function safeReadText(relPath) {
    const full = path.join(REPO_ROOT, relPath);
    return fs.readFile(full, "utf8").catch(() => "");
}

async function isRegularFile(relPath) {
    try {
        const stat = await fs.stat(path.join(REPO_ROOT, relPath));
        return stat.isFile();
    } catch {
        return false;
    }
}

function excerpt(text, maxLines = 40) {
    const lines = normalizeText(text).split("\n");
    return lines.slice(0, maxLines).join("\n").trim();
}

async function main() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const motionId = getArgValue("--motion");
    const explicitPaths = getArgValues("--path").filter(shouldIncludePath);

    const gitStatus = git(["status", "--short"]);
    const modifiedPaths = gitStatus
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.slice(3).trim())
        .filter(Boolean)
        .map((p) => p.replaceAll("\\", "/"))
        .filter(shouldIncludePath)
        .sort()
        .slice(0, 20);

    const pathSet = new Set();

    if (motionId) {
        pathSet.add(`.nexus/motions/${motionId}/motion.yaml`);
        pathSet.add(`.nexus/motions/${motionId}/proposal.md`);
        pathSet.add(`.nexus/motions/${motionId}/challenge.md`);
        pathSet.add(`.nexus/motions/${motionId}/execution.md`);
        pathSet.add(`.nexus/motions/${motionId}/policy.yaml`);
        pathSet.add(`.nexus/motions/${motionId}/decision.yaml`);
        pathSet.add(`.nexus/motions/${motionId}/decision.md`);
        pathSet.add(`.nexus/motions/${motionId}/vote.json`);
        pathSet.add(`.nexus/motions/${motionId}/verify.json`);
    }

    for (const p of explicitPaths) pathSet.add(p);
    for (const p of modifiedPaths) pathSet.add(p);

    const candidatePaths = [...pathSet]
        .map((p) => p.replaceAll("\\", "/"))
        .filter(shouldIncludePath)
        .sort();

    const paths = [];
    for (const relPath of candidatePaths) {
        if (await isRegularFile(relPath)) {
            paths.push(relPath);
        }
    }

    const lines = [];
    lines.push("# Active Path Pack");
    lines.push(`generated_for_date: ${todayStamp()}`);
    lines.push(`motion: ${motionId ?? "n/a"}`);
    lines.push("");

    lines.push("## Selected Paths");
    if (paths.length === 0) {
        lines.push("- none");
    } else {
        for (const p of paths) lines.push(`- ${p}`);
    }
    lines.push("");

    for (const relPath of paths) {
        const content = await safeReadText(relPath);
        if (!content) continue;

        lines.push(`## ${relPath}`);
        lines.push("```");
        lines.push(excerpt(content, 50));
        lines.push("```");
        lines.push("");
    }

    const outPath = path.join(
        OUTPUT_DIR,
        `${todayStamp()}_active-path-pack.txt`,
    );
    await fs.writeFile(outPath, `${lines.join("\n").trimEnd()}\n`, "utf8");

    console.log(outPath);
}

main().catch((err) => {
    console.error("[generate-active-path-pack] FAILED");
    console.error(err);
    process.exit(1);
});
