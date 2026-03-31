#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_DIR = path.join(REPO_ROOT, "surfaces", "chat-context");
const PREFIX = "[refresh-context-bundle]";

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
            // Skip unreadable or malformed manifests rather than failing refresh.
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

function commitDistance(bundleHead, currentHead) {
    if (!bundleHead || bundleHead === "(unknown)" || !currentHead) return null;
    if (bundleHead === currentHead) return 0;

    const count = git(["rev-list", `${bundleHead}..HEAD`, "--count"]);
    const parsed = Number.parseInt(count, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

function printFiles(manifest) {
    console.log(`${PREFIX} files:`);
    for (const file of manifest.data.files ?? []) {
        console.log(`  - ${manifestOutputDir(manifest)}/${file}`);
    }
}

function runGenerator(motionId) {
    const args = [path.join(REPO_ROOT, "portal", "scripts", "generate-context-bundle.mjs")];
    if (motionId) {
        args.push("--motion", motionId);
    }
    execFileSync("node", args, {
        cwd: REPO_ROOT,
        stdio: "inherit",
    });
}

async function selectBestManifest(motionId) {
    const manifests = await readManifestEntries();
    const candidates = motionId
        ? manifests.filter((entry) => entry.data.motion === motionId)
        : manifests;

    candidates.sort(compareManifestsDesc);
    return candidates[0] ?? null;
}

async function main() {
    const motionId = getArgValue("--motion");
    const currentHead = git(["rev-parse", "--short", "HEAD"]);

    console.log(`${PREFIX} motion: ${motionId ?? "(any)"}`);

    let best = await selectBestManifest(motionId);

    if (best) {
        const bundleHead = String(best.data.head_commit ?? "(unknown)");
        const distance = commitDistance(bundleHead, currentHead);

        if (distance === 0) {
            console.log(`${PREFIX} status: FRESH`);
            printFiles(best);
            return;
        }

        if (distance === null) {
            console.log(`${PREFIX} status: STALE (commit distance unknown) - regenerating...`);
        } else {
            console.log(`${PREFIX} status: STALE (${distance} commits behind) - regenerating...`);
        }
    } else {
        console.log(`${PREFIX} status: NO BUNDLE - generating...`);
    }

    runGenerator(motionId);

    best = await selectBestManifest(motionId);
    if (!best) {
        throw new Error("generation succeeded but no manifest was found afterward");
    }

    printFiles(best);
}

main().catch((err) => {
    console.error(`${PREFIX} FAILED`);
    console.error(err);
    process.exit(1);
});
