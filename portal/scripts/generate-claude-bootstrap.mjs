#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_DIR = path.join(REPO_ROOT, "surfaces", "claude");

const CLAUDE_ROOT_FILE = "CLAUDE.md";
const CLAUDE_FILES = [
    ".nexus/claude/project-context-pack.md",
    ".nexus/claude/bootstrap-set.yaml",
    ".nexus/claude/operating-workflow.md",
];

const SUBSTRATE_FILES = [
    ".nexus/context/project-constitution.yaml",
    ".nexus/context/repo-capsule.schema.yaml",
    ".nexus/context/motion-packet.schema.json",
    ".nexus/context/slot-policy.yaml",
    ".nexus/context/scoring-rubric.yaml",
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

function getArgValue(flag) {
    const idx = process.argv.indexOf(flag);
    if (idx === -1) return null;
    return process.argv[idx + 1] ?? null;
}

function normalizeText(text) {
    return String(text)
        .replace(/\r\n/g, "\n")
        .replace(/[–—]/g, "-")
        .replace(/[→]/g, "->")
        .replace(/\u00a0/g, " ")
        .trim();
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

function excerpt(text, maxLines = 40) {
    const lines = normalizeText(text).split("\n");
    return lines.slice(0, maxLines).join("\n").trim();
}

function trimBlankEdges(lines) {
    let start = 0;
    let end = lines.length;

    while (start < end && lines[start].trim() === "") start += 1;
    while (end > start && lines[end - 1].trim() === "") end -= 1;

    return lines.slice(start, end);
}

function sectionBody(text, heading, maxLines = 24) {
    const normalized = normalizeText(text);
    if (!normalized) return "";

    const lines = normalized.split("\n");
    const target = `## ${heading}`;
    const startIdx = lines.findIndex((line) => line.trim() === target);
    if (startIdx === -1) return "";

    const body = [];
    for (let i = startIdx + 1; i < lines.length; i += 1) {
        const line = lines[i];
        if (line.startsWith("## ")) break;
        body.push(line);
    }

    return trimBlankEdges(body).slice(0, maxLines).join("\n").trim();
}

function leadBlock(text, maxLines = 16) {
    const normalized = normalizeText(text);
    if (!normalized) return "";

    const lines = normalized.split("\n");
    const collected = [];
    let skippedTopHeading = false;

    for (const line of lines) {
        if (!skippedTopHeading) {
            if (line.startsWith("# ")) {
                skippedTopHeading = true;
                continue;
            }
            if (line.trim() === "") continue;
            skippedTopHeading = true;
        }

        if (line.startsWith("## ")) break;
        collected.push(line);
    }

    return trimBlankEdges(collected).slice(0, maxLines).join("\n").trim();
}

function joinBlocks(blocks) {
    return blocks
        .map((block) => String(block ?? "").trim())
        .filter(Boolean)
        .join("\n\n")
        .trim();
}

async function latestMotionId() {
    const motionsDir = path.join(REPO_ROOT, ".nexus", "motions");
    const entries = await fs.readdir(motionsDir, { withFileTypes: true }).catch(() => []);
    const motions = entries
        .filter((e) => e.isDirectory() && /^motion-\d+$/.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return motions.at(-1) ?? null;
}

function buildReferenceList(items) {
    if (items.length === 0) return "- none";
    return items.map((item) => `- ${item}`).join("\n");
}

async function getCurrentContextArtifacts() {
    const date = todayStamp();
    const candidates = [
        `surfaces/chat-context/${date}_motion-snapshots.txt`,
        `surfaces/chat-context/${date}_repo-capsule.txt`,
        `surfaces/chat-context/${date}_active-path-pack.txt`,
        `surfaces/chat-context/${date}_context-bundle_manifest.json`,
    ];

    const present = [];
    for (const file of candidates) {
        if (await exists(file)) present.push(file);
    }
    return present;
}

async function main() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const motionId = getArgValue("--motion") ?? (await latestMotionId()) ?? "n/a";
    const date = todayStamp();

    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]) || "(unknown)";
    const head = git(["rev-parse", "--short", "HEAD"]) || "(unknown)";
    const latestCommitSubject = git(["log", "-1", "--pretty=%s"]) || "(unknown)";

    const currentContextArtifacts = await getCurrentContextArtifacts();

    const claudeRootText = await safeRead(CLAUDE_ROOT_FILE);
    const projectContextText = await safeRead(".nexus/claude/project-context-pack.md");
    const workflowText = await safeRead(".nexus/claude/operating-workflow.md");
    const bootstrapYaml = await safeRead(".nexus/claude/bootstrap-set.yaml");
    const constitutionText = await safeRead(".nexus/context/project-constitution.yaml");
    const slotPolicyText = await safeRead(".nexus/context/slot-policy.yaml");
    const scoringRubricText = await safeRead(".nexus/context/scoring-rubric.yaml");

    const canonicalInputs = [
        CLAUDE_ROOT_FILE,
        ...CLAUDE_FILES,
        ...SUBSTRATE_FILES,
    ];

    const repoClaudeGuidance = joinBlocks([
        sectionBody(claudeRootText, "Purpose", 14),
        sectionBody(claudeRootText, "Working assumptions", 14),
        leadBlock(claudeRootText, 12),
    ]);

    const projectContextSummary = joinBlocks([
        sectionBody(projectContextText, "What this pack is", 8),
        sectionBody(projectContextText, "Repo identity", 8),
        sectionBody(projectContextText, "Core working model", 10),
        leadBlock(projectContextText, 12),
    ]);

    const lines = [];
    lines.push("# Claude Bootstrap Pack - dev-jai-nexus");
    lines.push(`generated_for_date: ${date}`);
    lines.push("repo: dev-jai-nexus");
    lines.push(`branch: ${branch}`);
    lines.push(`head_commit: ${head}`);
    lines.push(`active_motion: ${motionId}`);
    lines.push("");

    lines.push("## Purpose");
    lines.push(
        "This is the generated Claude bootstrap handoff for dev-jai-nexus. It is a compact, repo-centric setup pack derived from governed Claude artifacts, formal substrate artifacts, and current generated repo context.",
    );
    lines.push("");

    lines.push("## Current Repo State");
    lines.push(`- latest_commit_subject: ${latestCommitSubject}`);
    lines.push(`- active_motion: ${motionId}`);
    lines.push(`- branch: ${branch}`);
    lines.push(`- head_commit: ${head}`);
    lines.push("");

    lines.push("## Claude-facing Canonical Sources");
    lines.push(buildReferenceList([
        CLAUDE_ROOT_FILE,
        ...CLAUDE_FILES,
    ]));
    lines.push("");

    lines.push("## Formal Substrate References");
    lines.push(buildReferenceList(SUBSTRATE_FILES));
    lines.push("");

    lines.push("## Current Generated Context References");
    lines.push(buildReferenceList(currentContextArtifacts));
    lines.push("");

    lines.push("## Repo-root CLAUDE Guidance");
    lines.push(repoClaudeGuidance || "(missing)");
    lines.push("");

    lines.push("## Project Context Summary");
    lines.push(projectContextSummary || "(missing)");
    lines.push("");

    lines.push("## Constitution Excerpt");
    lines.push("```yaml");
    lines.push(excerpt(constitutionText, 35) || "# missing");
    lines.push("```");
    lines.push("");

    lines.push("## Slot Policy Excerpt");
    lines.push("```yaml");
    lines.push(excerpt(slotPolicyText, 35) || "# missing");
    lines.push("```");
    lines.push("");

    lines.push("## Scoring Rubric Excerpt");
    lines.push("```yaml");
    lines.push(excerpt(scoringRubricText, 30) || "# missing");
    lines.push("```");
    lines.push("");

    lines.push("## Bootstrap Set Excerpt");
    lines.push("```yaml");
    lines.push(excerpt(bootstrapYaml, 40) || "# missing");
    lines.push("```");
    lines.push("");

    lines.push("## Claude Operating Workflow Excerpt");
    lines.push("```md");
    lines.push(excerpt(workflowText, 45) || "# missing");
    lines.push("```");
    lines.push("");

    lines.push("## Practical Setup Order");
    lines.push("1. Run `pnpm claude:bootstrap`.");
    lines.push("2. Read `CLAUDE.md`.");
    lines.push("3. Read `.nexus/claude/project-context-pack.md`.");
    lines.push("4. Read the active substrate references needed for the task.");
    lines.push("5. Read the active motion package.");
    lines.push("6. Use the latest generated repo context artifacts for portability.");
    lines.push("");

    lines.push("## Canonical Truth Reminder");
    lines.push(
        "This bootstrap pack is a generated handoff layer. Canonical truth remains in motion artifacts, formal substrate artifacts, and repo sources.",
    );
    lines.push("");

    const bootstrapPath = path.join(
        OUTPUT_DIR,
        `${date}_claude-bootstrap.md`,
    );

    await fs.writeFile(
        bootstrapPath,
        `${lines.join("\n").trimEnd()}\n`,
        "utf8",
    );

    const manifest = {
        schema: "claude-bootstrap-0.1",
        generated_at: utcNow(),
        repo: "dev-jai-nexus",
        branch,
        head_commit: head,
        motion: motionId,
        output_dir: "surfaces/claude",
        files: [`${date}_claude-bootstrap.md`],
        canonical_inputs: canonicalInputs,
        context_inputs: currentContextArtifacts,
    };

    const manifestPath = path.join(
        OUTPUT_DIR,
        `${date}_claude-bootstrap_manifest.json`,
    );

    await fs.writeFile(
        manifestPath,
        `${JSON.stringify(manifest, null, 2)}\n`,
        "utf8",
    );

    console.log(bootstrapPath);
    console.log(manifestPath);
}

main().catch((err) => {
    console.error("[generate-claude-bootstrap] FAILED");
    console.error(err);
    process.exit(1);
});
