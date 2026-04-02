#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_DIR = path.join(REPO_ROOT, "surfaces", "chat-context");
const PREFIX = "[find-context-bundle]";

function getArgValue(flag) {
    const idx = process.argv.indexOf(flag);
    if (idx === -1) return null;
    return process.argv[idx + 1] ?? null;
}

function git(args) {
    return execFileSync("git", args, {
        cwd: REPO_ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
    }).trim();
}

async function readManifestEntries() {
    const entries = await fs.readdir(OUTPUT_DIR, { withFileTypes: true });
    const manifests = [];

    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith("_context-bundle_manifest.json")) {
            continue;
        }

        const fullPath = path.join(OUTPUT_DIR, entry.name);
        try {
            const parsed = JSON.parse(await fs.readFile(fullPath, "utf8"));
            manifests.push({
                name: entry.name,
                fullPath,
                data: parsed,
            });
        } catch {
            // Skip unreadable or malformed manifests rather than failing discovery.
        }
    }

    return manifests;
}

function compareManifestsDesc(a, b) {
    const aTs = a.data.generated_at ?? "";
    const bTs = b.data.generated_at ?? "";
    return bTs.localeCompare(aTs) || b.name.localeCompare(a.name);
}

function manifestOutputDir(manifest) {
    return String(manifest.data.output_dir ?? "surfaces/chat-context").replaceAll("\\", "/");
}

function printHeader(motionId) {
    console.log(`${PREFIX} motion: ${motionId ?? "(any)"}`);
}

function printGenerateLine(motionId, label) {
    const cmd = motionId
        ? `node portal/scripts/generate-context-bundle.mjs --motion ${motionId}`
        : "node portal/scripts/generate-context-bundle.mjs";
    console.log(`${PREFIX} ${label}: ${cmd}`);
}

function commitDistance(bundleHead, currentHead) {
    if (!bundleHead || bundleHead === "(unknown)" || !currentHead) return null;
    if (bundleHead === currentHead) return 0;

    const count = git(["rev-list", `${bundleHead}..HEAD`, "--count"]);
    const parsed = Number.parseInt(count, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

async function main() {
    const motionId = getArgValue("--motion");
    const currentHead = git(["rev-parse", "--short", "HEAD"]);
    const manifests = await readManifestEntries();

    const candidates = motionId
        ? manifests.filter((entry) => entry.data.motion === motionId)
        : manifests;

    candidates.sort(compareManifestsDesc);

    printHeader(motionId);

    if (candidates.length === 0) {
        console.log(`${PREFIX} status: NO BUNDLE`);
        printGenerateLine(motionId, "generate");
        return;
    }

    const best = candidates[0];
    const bundleHead = String(best.data.head_commit ?? "(unknown)");
    const distance = commitDistance(bundleHead, currentHead);

    console.log(`${PREFIX} bundle: ${best.name}`);
    console.log(`${PREFIX} generated_at: ${best.data.generated_at ?? "(unknown)"}`);
    console.log(`${PREFIX} bundle_head: ${bundleHead}`);
    console.log(`${PREFIX} current_head: ${currentHead || "(unknown)"}`);

    if (distance === 0) {
        console.log(`${PREFIX} status: FRESH`);
        console.log(`${PREFIX} files:`);
        for (const file of best.data.files ?? []) {
            console.log(`  - ${manifestOutputDir(best)}/${file}`);
        }
        return;
    }

    if (distance === null) {
        console.log(`${PREFIX} status: STALE (commit distance unknown)`);
    } else {
        console.log(`${PREFIX} status: STALE (${distance} commits behind)`);
    }
    printGenerateLine(motionId, "regenerate");
}

main().catch((err) => {
    console.error("[find-context-bundle] FAILED");
    console.error(err);
    process.exit(1);
});
