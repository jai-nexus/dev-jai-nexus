#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const NEXUS_DIR = path.join(REPO_ROOT, ".nexus");
const MOTIONS_DIR = path.join(NEXUS_DIR, "motions");
const OUTPUT_DIR = path.join(REPO_ROOT, "surfaces", "chat-context");

const STANDARD_MOTION_FILES = [
    "motion.yaml",
    "proposal.md",
    "challenge.md",
    "execution.md",
    "policy.yaml",
    "verify.json",
    "vote.json",
    "decision.yaml",
    "decision.md",
];

const ROOT_CONFIG_PREFERRED_ORDER = [
    ".nexus/agent-manifest.yaml",
    ".nexus/agent-panels.yaml",
    ".nexus/model-slots.yaml",
];

const TEXT_EXTENSIONS = new Set([
    ".md",
    ".txt",
    ".yaml",
    ".yml",
    ".json",
    ".jsonl",
    ".mjs",
    ".js",
    ".ts",
    ".tsx",
    ".cjs",
    ".sh",
    ".ps1",
    ".sql",
    ".css",
    ".prisma",
    ".xml",
    ".html",
]);

function todayStamp() {
    return new Date().toISOString().slice(0, 10);
}

function utcNow() {
    return new Date().toISOString();
}

function normalizePath(relPath) {
    return String(relPath ?? "").replace(/\\/g, "/").trim();
}

function toWindowsPath(relPath) {
    return normalizePath(relPath).replace(/\//g, "\\");
}

function inferFenceLanguage(relPath) {
    const ext = path.extname(relPath).toLowerCase();
    if (ext === ".md") return "md";
    if (ext === ".yaml" || ext === ".yml") return "yaml";
    if (ext === ".json" || ext === ".jsonl") return "json";
    if (ext === ".mjs" || ext === ".cjs" || ext === ".js") return "js";
    if (ext === ".ts") return "ts";
    if (ext === ".tsx") return "tsx";
    if (ext === ".sh") return "bash";
    if (ext === ".ps1") return "powershell";
    if (ext === ".sql") return "sql";
    if (ext === ".css") return "css";
    if (ext === ".prisma") return "prisma";
    if (ext === ".xml") return "xml";
    if (ext === ".html") return "html";
    return "";
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

function hasFlag(flag) {
    return process.argv.includes(flag);
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

function printHelp() {
    console.log(`
snapshot-motion-full.mjs

Usage:
  node portal/scripts/snapshot-motion-full.mjs [options]

Options:
  --manifest              Also write a manifest sidecar JSON
  --motion <motion-id>    Export only the given motion(s); may be repeated
  --path <repo-path>      Export only the given file(s)/dir(s) in the exact order provided; may be repeated
  --include-root-config   Include top-level .nexus root config files
  --help                  Show this help text

Behavior:
  - No --path / no --motion  => exports the full motion tree
  - --motion ...             => exports only the selected motion directories
  - --path ...               => exports exactly those files/dirs, in the order provided
  - --include-root-config    => appends top-level .nexus root config files after the selected entries
`);
}

async function exists(relPath) {
    try {
        await fs.access(path.join(REPO_ROOT, normalizePath(relPath)));
        return true;
    } catch {
        return false;
    }
}

async function statRel(relPath) {
    return fs.stat(path.join(REPO_ROOT, normalizePath(relPath)));
}

function normalizeText(text) {
    return String(text).replace(/\r\n/g, "\n");
}

function extractYamlScalar(text, key) {
    const re = new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, "m");
    return text.match(re)?.[1]?.trim() ?? null;
}

async function readTextOrBinary(relPath) {
    const fullPath = path.join(REPO_ROOT, normalizePath(relPath));
    const buffer = await fs.readFile(fullPath);

    const ext = path.extname(relPath).toLowerCase();
    const likelyText = TEXT_EXTENSIONS.has(ext);

    if (!likelyText && buffer.includes(0)) {
        return {
            status: "binary",
            content: null,
            sizeBytes: buffer.length,
        };
    }

    if (buffer.includes(0)) {
        return {
            status: "binary",
            content: null,
            sizeBytes: buffer.length,
        };
    }

    const text = normalizeText(buffer.toString("utf8"));

    if (text.length === 0) {
        return {
            status: "empty",
            content: "",
            sizeBytes: buffer.length,
        };
    }

    return {
        status: "text",
        content: text,
        sizeBytes: buffer.length,
    };
}

async function listMotionDirs() {
    const entries = await fs.readdir(MOTIONS_DIR, { withFileTypes: true }).catch(() => []);
    return entries
        .filter((e) => e.isDirectory() && /^motion-\d+$/.test(e.name))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function listTopLevelNexusRootFiles() {
    const entries = await fs.readdir(NEXUS_DIR, { withFileTypes: true }).catch(() => []);
    const files = entries
        .filter((e) => e.isFile())
        .map((e) => `.nexus/${e.name}`);

    const preferred = ROOT_CONFIG_PREFERRED_ORDER.filter((p) => files.includes(p));
    const remaining = files
        .filter((p) => !preferred.includes(p))
        .sort((a, b) => a.localeCompare(b));

    return [...preferred, ...remaining];
}

function dedupePreserveOrder(items) {
    const seen = new Set();
    const out = [];
    for (const item of items) {
        const normalized = normalizePath(item);
        if (!normalized || seen.has(normalized)) continue;
        seen.add(normalized);
        out.push(normalized);
    }
    return out;
}

async function listFilesRecursive(dirRel) {
    const startPath = path.join(REPO_ROOT, normalizePath(dirRel));
    const results = [];

    async function walk(currentAbs, currentRel) {
        const entries = await fs.readdir(currentAbs, { withFileTypes: true });
        entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        for (const entry of entries) {
            const childAbs = path.join(currentAbs, entry.name);
            const childRel = normalizePath(path.join(currentRel, entry.name));

            if (entry.isDirectory()) {
                await walk(childAbs, childRel);
            } else if (entry.isFile()) {
                results.push(childRel);
            }
        }
    }

    await walk(startPath, normalizePath(dirRel));
    return results.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
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

    const bulletPathRe = /(?:^|\n)\s*-\s+([A-Za-z0-9._/@-]+(?:\/[A-Za-z0-9._/@-]+)+)/g;
    for (const match of text.matchAll(bulletPathRe)) {
        found.add(normalizePath(match[1]));
    }

    return [...found].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function getMotionDerivedPaths(motionId) {
    if (!motionId) return [];

    const motionDir = `.nexus/motions/${motionId}`;
    const candidates = [
        `${motionDir}/execution.md`,
        `${motionDir}/proposal.md`,
        `${motionDir}/challenge.md`,
    ];

    const out = new Set();

    for (const file of candidates) {
        if (!(await exists(file))) continue;
        const text = await fs.readFile(path.join(REPO_ROOT, file), "utf8").catch(() => "");
        for (const candidate of parsePathsFromText(text)) {
            out.add(candidate);
        }
    }

    return [...out].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function getMotionSummary(motionId) {
    const dir = `.nexus/motions/${motionId}`;
    const motionText = await fs.readFile(path.join(REPO_ROOT, dir, "motion.yaml"), "utf8").catch(() => "");
    const decisionText = await fs.readFile(path.join(REPO_ROOT, dir, "decision.yaml"), "utf8").catch(() => "");

    return {
        motion_id: motionId,
        title: extractYamlScalar(motionText, "title"),
        status: extractYamlScalar(decisionText, "status") ?? extractYamlScalar(motionText, "status"),
        derived_paths: await getMotionDerivedPaths(motionId),
    };
}

class SnapshotBuilder {
    constructor() {
        this.lines = [];
        this.emittedPaths = new Set();
        this.fileRecords = [];
        this.missingCount = 0;
        this.emptyCount = 0;
        this.binaryCount = 0;
    }

    add(line = "") {
        this.lines.push(line);
    }

    async emitFile(relPath) {
        const normalized = normalizePath(relPath);
        if (!normalized || this.emittedPaths.has(normalized)) return;
        this.emittedPaths.add(normalized);

        const winPath = toWindowsPath(normalized);
        const language = inferFenceLanguage(normalized);

        if (!(await exists(normalized))) {
            this.add(`## ${winPath}`);
            this.add("Path is canonical. Use the actual repo file as source of truth.");
            this.add("");
            this.add("[missing]");
            this.add("");
            this.fileRecords.push({
                path: normalized,
                status: "missing",
                language,
            });
            this.missingCount += 1;
            return;
        }

        const payload = await readTextOrBinary(normalized);

        this.add(`## ${winPath}`);
        this.add("Path is canonical. Use the actual repo file as source of truth.");
        this.add("");

        if (payload.status === "binary") {
            this.add(`[binary: ${payload.sizeBytes} bytes]`);
            this.add("");
            this.fileRecords.push({
                path: normalized,
                status: "binary",
                size_bytes: payload.sizeBytes,
                language,
            });
            this.binaryCount += 1;
            return;
        }

        if (payload.status === "empty") {
            this.add("[empty]");
            this.add("");
            this.fileRecords.push({
                path: normalized,
                status: "empty",
                size_bytes: payload.sizeBytes,
                language,
            });
            this.emptyCount += 1;
            return;
        }

        this.add(`~~~${language}`);
        this.add(payload.content ?? "");
        this.add("~~~");
        this.add("");

        this.fileRecords.push({
            path: normalized,
            status: "text",
            size_bytes: payload.sizeBytes,
            language,
        });
    }

    async emitMotionDir(motionDirRel) {
        const motionDir = normalizePath(motionDirRel);

        for (const fileName of STANDARD_MOTION_FILES) {
            await this.emitFile(`${motionDir}/${fileName}`);
        }

        const allFiles = await listFilesRecursive(motionDir).catch(() => []);
        const excluded = new Set(
            STANDARD_MOTION_FILES.map((f) => normalizePath(`${motionDir}/${f}`)),
        );

        for (const fileRel of allFiles) {
            if (excluded.has(normalizePath(fileRel))) continue;
            await this.emitFile(fileRel);
        }
    }

    async emitGenericEntry(relPath) {
        const normalized = normalizePath(relPath);
        if (!normalized) return;

        if (!(await exists(normalized))) {
            await this.emitFile(normalized);
            return;
        }

        const stats = await statRel(normalized);
        if (stats.isFile()) {
            await this.emitFile(normalized);
            return;
        }

        if (stats.isDirectory()) {
            const allFiles = await listFilesRecursive(normalized);
            for (const fileRel of allFiles) {
                await this.emitFile(fileRel);
            }
        }
    }
}

async function buildSelectedEntries({ mode, motionIds, explicitPaths, includeRootConfig }) {
    const entries = [];

    if (mode === "explicit_paths") {
        entries.push(...dedupePreserveOrder(explicitPaths));
    } else if (mode === "motion_subset") {
        entries.push(
            ...dedupePreserveOrder(
                motionIds.map((motionId) => `.nexus/motions/${normalizePath(motionId)}`),
            ),
        );
    } else {
        const motionDirs = await listMotionDirs();
        entries.push(...motionDirs.map((motionId) => `.nexus/motions/${motionId}`));
    }

    if (includeRootConfig) {
        const rootFiles = await listTopLevelNexusRootFiles();
        entries.push(...rootFiles);
    }

    return dedupePreserveOrder(entries);
}

async function main() {
    if (hasFlag("--help")) {
        printHelp();
        return;
    }

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const explicitPaths = dedupePreserveOrder(getArgValues("--path"));
    const motionIds = dedupePreserveOrder(getArgValues("--motion"));
    const wantsManifest = hasFlag("--manifest");
    const includeRootConfig =
        hasFlag("--include-root-config") ||
        (explicitPaths.length === 0 && motionIds.length === 0);

    const mode =
        explicitPaths.length > 0
            ? "explicit_paths"
            : motionIds.length > 0
                ? "motion_subset"
                : "full_tree";

    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]) || "(unknown)";
    const headCommit = git(["rev-parse", "--short", "HEAD"]) || "(unknown)";
    const latestCommitSubject = git(["log", "-1", "--pretty=%s"]) || "(unknown)";
    const dirtyStatus = git(["status", "--short"]) ? "DIRTY" : "CLEAN";

    const allMotionIds = await listMotionDirs();
    const includedMotionIds =
        mode === "motion_subset"
            ? dedupePreserveOrder(motionIds)
            : mode === "explicit_paths"
                ? []
                : allMotionIds;

    const selectedEntries = await buildSelectedEntries({
        mode,
        motionIds,
        explicitPaths,
        includeRootConfig,
    });

    const builder = new SnapshotBuilder();

    builder.add("# Full Motion Snapshot");
    builder.add(`generated_for_date: ${todayStamp()}`);
    builder.add(`generated_at: ${utcNow()}`);
    builder.add("repo: dev-jai-nexus");
    builder.add(`branch: ${branch}`);
    builder.add(`head_commit: ${headCommit}`);
    builder.add(`dirty_status: ${dirtyStatus}`);
    builder.add("snapshot_kind: full_motion_snapshot");
    builder.add(`mode: ${mode}`);
    builder.add(`generator: ${toWindowsPath("portal/scripts/snapshot-motion-full.mjs")}`);
    builder.add("");

    builder.add("## Purpose");
    builder.add(
        "This is a deterministic full-fidelity motion snapshot export for dev-jai-nexus. It preserves full motion artifact contents and nested motion artifacts. Canonical truth remains in the actual repo source files.",
    );
    builder.add("");

    builder.add("## Current Repo State");
    builder.add(`- latest_commit_subject: ${latestCommitSubject}`);
    builder.add(`- branch: ${branch}`);
    builder.add(`- head_commit: ${headCommit}`);
    builder.add(`- dirty_status: ${dirtyStatus}`);
    builder.add("");

    builder.add("## Generation Inputs");
    builder.add(`### Mode`);
    builder.add(`- ${mode}`);
    builder.add("");
    builder.add("### Explicit Paths");
    builder.add(explicitPaths.length ? explicitPaths.map((p) => `- ${toWindowsPath(p)}`).join("\n") : "- none");
    builder.add("");
    builder.add("### Motion IDs");
    builder.add(motionIds.length ? motionIds.map((m) => `- ${m}`).join("\n") : "- none");
    builder.add("");
    builder.add("### Include Root Config");
    builder.add(`- ${includeRootConfig ? "true" : "false"}`);
    builder.add("");
    builder.add("### Selected Entries");
    builder.add(
        selectedEntries.length
            ? selectedEntries.map((p) => `- ${toWindowsPath(p)}`).join("\n")
            : "- none",
    );
    builder.add("");

    if (includedMotionIds.length > 0) {
        builder.add("## Motion Range");
        builder.add(`- motions_count: ${includedMotionIds.length}`);
        builder.add(`- first_motion: ${includedMotionIds[0]}`);
        builder.add(`- last_motion: ${includedMotionIds[includedMotionIds.length - 1]}`);
        builder.add("");
    }

    for (const entry of selectedEntries) {
        const normalized = normalizePath(entry);
        if (/^\.nexus\/motions\/motion-\d+$/.test(normalized)) {
            await builder.emitMotionDir(normalized);
        } else {
            await builder.emitGenericEntry(normalized);
        }
    }

    const date = todayStamp();
    const snapshotFileName = `${date}_motion-snapshot_full.txt`;
    const manifestFileName = `${date}_motion-snapshot_full_manifest.json`;
    const snapshotPath = path.join(OUTPUT_DIR, snapshotFileName);

    await fs.writeFile(snapshotPath, `${builder.lines.join("\n").trimEnd()}\n`, "utf8");

    const motionSummary = [];
    const summaryIds =
        mode === "explicit_paths"
            ? []
            : mode === "motion_subset"
                ? dedupePreserveOrder(motionIds)
                : allMotionIds;

    for (const motionId of summaryIds) {
        motionSummary.push(await getMotionSummary(motionId));
    }

    if (wantsManifest) {
        const manifest = {
            schema: "motion-snapshot-full-0.1",
            generated_at: utcNow(),
            repo: "dev-jai-nexus",
            branch,
            head_commit: headCommit,
            dirty_status: dirtyStatus,
            snapshot_kind: "full_motion_snapshot",
            mode,
            output_dir: "surfaces/chat-context",
            files: [snapshotFileName, manifestFileName],
            inputs: {
                explicit_paths: explicitPaths,
                motion_ids: motionIds,
                include_root_config: includeRootConfig,
                selected_entries: selectedEntries,
            },
            motion_range:
                summaryIds.length > 0
                    ? {
                        count: summaryIds.length,
                        first_motion: summaryIds[0],
                        last_motion: summaryIds[summaryIds.length - 1],
                    }
                    : null,
            emitted: {
                file_records_count: builder.fileRecords.length,
                missing_count: builder.missingCount,
                empty_count: builder.emptyCount,
                binary_count: builder.binaryCount,
            },
            motions: motionSummary,
        };

        const manifestPath = path.join(OUTPUT_DIR, manifestFileName);
        await fs.writeFile(
            manifestPath,
            `${JSON.stringify(manifest, null, 2)}\n`,
            "utf8",
        );
        console.log(snapshotPath);
        console.log(manifestPath);
        return;
    }

    console.log(snapshotPath);
}

main().catch((err) => {
    console.error("[snapshot-motion-full] FAILED");
    console.error(err);
    process.exit(1);
});
