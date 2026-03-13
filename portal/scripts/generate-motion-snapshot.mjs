#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const MOTIONS_DIR = path.join(REPO_ROOT, ".nexus", "motions");
const OUTPUT_DIR = path.join(REPO_ROOT, "surfaces", "chat-context");

function todayStamp() {
    return new Date().toISOString().slice(0, 10);
}

function normalizeText(text) {
    return String(text)
        .replace(/\r\n/g, "\n")
        .replace(/[–—]/g, "-")
        .replace(/[→]/g, "->")
        .replace(/\u00a0/g, " ")
        .trim();
}

function safeReadText(filePath) {
    return fs.readFile(filePath, "utf8").catch(() => "");
}

function extractYamlScalar(text, key) {
    const re = new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, "m");
    const value = text.match(re)?.[1]?.trim() ?? null;
    return value ? normalizeText(value) : null;
}

function extractJsonField(text, pathParts) {
    try {
        const obj = JSON.parse(text);
        let cur = obj;
        for (const part of pathParts) {
            cur = cur?.[part];
        }
        return cur == null ? null : normalizeText(String(cur));
    } catch {
        return null;
    }
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

async function getMotionSummary(motionDirName) {
    const dir = path.join(MOTIONS_DIR, motionDirName);
    const motionYaml = await safeReadText(path.join(dir, "motion.yaml"));
    const decisionYaml = await safeReadText(path.join(dir, "decision.yaml"));
    const verifyJson = await safeReadText(path.join(dir, "verify.json"));
    const voteJson = await safeReadText(path.join(dir, "vote.json"));

    const title = extractYamlScalar(motionYaml, "title") ?? "(untitled)";
    const motionStatus = extractYamlScalar(motionYaml, "status") ?? "unknown";
    const decisionStatus =
        extractYamlScalar(decisionYaml, "status") ??
        extractJsonField(voteJson, ["outcome", "result"]) ??
        motionStatus;

    const requiredOk = extractJsonField(verifyJson, ["summary", "required_ok"]);
    const latestUpdated =
        extractJsonField(verifyJson, ["summary", "last_updated"]) ??
        extractYamlScalar(decisionYaml, "last_updated");

    const keyFiles = [
        "motion.yaml",
        "proposal.md",
        "challenge.md",
        "execution.md",
        "policy.yaml",
        "decision.md",
        "decision.yaml",
        "verify.json",
        "vote.json",
    ];

    const existing = [];
    for (const file of keyFiles) {
        try {
            await fs.access(path.join(dir, file));
            existing.push(file);
        } catch {
            // ignore
        }
    }

    return {
        motionId: motionDirName,
        title,
        motionStatus,
        decisionStatus,
        requiredOk,
        latestUpdated,
        existing,
    };
}

async function main() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const entries = await fs.readdir(MOTIONS_DIR, { withFileTypes: true });
    const motionDirs = entries
        .filter((e) => e.isDirectory() && /^motion-\d+$/.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const motions = [];
    for (const motionDir of motionDirs) {
        motions.push(await getMotionSummary(motionDir));
    }

    const ratified = motions.filter(
        (m) => String(m.decisionStatus).toUpperCase() === "RATIFIED",
    ).length;

    const pending = motions.filter((m) => {
        const s = String(m.decisionStatus).toUpperCase();
        return s === "DRAFT" || s === "PENDING" || s === "PROPOSED";
    }).length;

    const latest = motions.at(-1) ?? null;
    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]) || "(unknown)";
    const head = git(["rev-parse", "--short", "HEAD"]) || "(unknown)";

    const lines = [];
    lines.push("# JAI NEXUS Motion Snapshot");
    lines.push(`generated_for_date: ${todayStamp()}`);
    lines.push("repo: dev-jai-nexus");
    lines.push(`branch: ${branch}`);
    lines.push(`head_commit: ${head}`);
    lines.push(`motions_total: ${motions.length}`);
    lines.push(`motions_ratified: ${ratified}`);
    lines.push(`motions_pending_like: ${pending}`);
    lines.push("");

    lines.push("## Latest Motion");
    if (latest) {
        lines.push(`- id: ${latest.motionId}`);
        lines.push(`- title: ${latest.title}`);
        lines.push(`- decision_status: ${latest.decisionStatus}`);
        lines.push(`- required_ok: ${latest.requiredOk ?? "n/a"}`);
        lines.push(`- latest_updated: ${latest.latestUpdated ?? "n/a"}`);
    } else {
        lines.push("- none");
    }
    lines.push("");

    lines.push("## Motion Ledger");
    for (const m of motions) {
        lines.push(
            `- ${m.motionId} | ${String(m.decisionStatus).toUpperCase()} | ${m.title}`,
        );
    }
    lines.push("");

    lines.push("## Motion Briefs");
    for (const m of motions.slice(-10)) {
        lines.push(`### ${m.motionId}`);
        lines.push(`title: ${m.title}`);
        lines.push(`motion_status: ${m.motionStatus}`);
        lines.push(`decision_status: ${m.decisionStatus}`);
        lines.push(`required_ok: ${m.requiredOk ?? "n/a"}`);
        lines.push(`latest_updated: ${m.latestUpdated ?? "n/a"}`);
        lines.push(`artifacts: ${m.existing.join(", ") || "(none)"}`);
        lines.push("");
    }

    const outPath = path.join(
        OUTPUT_DIR,
        `${todayStamp()}_motion-snapshots.txt`,
    );
    await fs.writeFile(outPath, `${lines.join("\n").trimEnd()}\n`, "utf8");

    console.log(outPath);
}

main().catch((err) => {
    console.error("[generate-motion-snapshot] FAILED");
    console.error(err);
    process.exit(1);
});
