# Execution: Context bundle refresh workflow — add refresh-context-bundle.mjs as single-command entrypoint

**Motion:** motion-0110
**Role:** BUILDER
**Date:** 2026-03-31

## Scope

Files created:

```
portal/scripts/refresh-context-bundle.mjs      (new — single-command refresh entrypoint)
.nexus/motions/motion-0110/                    (6 files — this motion package)
```

Files NOT changed:
- No existing scripts modified
- No runtime, DB, or UI changes

## Implementation

### Full script: `portal/scripts/refresh-context-bundle.mjs`

```js
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

async function readManifests() {
    let entries;
    try {
        entries = await fs.readdir(OUTPUT_DIR, { withFileTypes: true });
    } catch {
        return [];
    }
    const manifests = [];
    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith("_context-bundle_manifest.json")) {
            continue;
        }
        const fullPath = path.join(OUTPUT_DIR, entry.name);
        try {
            const data = JSON.parse(await fs.readFile(fullPath, "utf8"));
            manifests.push({ name: entry.name, data });
        } catch {
            // skip unreadable or malformed manifests
        }
    }
    return manifests;
}

function bestManifest(manifests, motionId) {
    const candidates = motionId
        ? manifests.filter((m) => m.data.motion === motionId)
        : manifests;
    return candidates.sort((a, b) =>
        (b.data.generated_at ?? "").localeCompare(a.data.generated_at ?? "") ||
        b.name.localeCompare(a.name),
    )[0] ?? null;
}

function isFresh(manifest, currentHead) {
    const bundleHead = String(manifest.data.head_commit ?? "(unknown)");
    if (!bundleHead || bundleHead === "(unknown)" || !currentHead) return false;
    if (bundleHead === currentHead) return true;
    const count = execFileSync("git", ["rev-list", `${bundleHead}..HEAD`, "--count"], {
        cwd: REPO_ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return Number.parseInt(count, 10) === 0;
}

function stalenessLabel(manifest, currentHead) {
    const bundleHead = String(manifest.data.head_commit ?? "(unknown)");
    if (!bundleHead || bundleHead === "(unknown)" || !currentHead) {
        return "STALE (commit distance unknown)";
    }
    try {
        const count = execFileSync("git", ["rev-list", `${bundleHead}..HEAD`, "--count"], {
            cwd: REPO_ROOT,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        }).trim();
        const n = Number.parseInt(count, 10);
        return `STALE (${n} commit${n === 1 ? "" : "s"} behind)`;
    } catch {
        return "STALE (commit distance unknown)";
    }
}

function printFiles(manifest) {
    const outDir = String(manifest.data.output_dir ?? "surfaces/chat-context").replaceAll("\\", "/");
    console.log(`${PREFIX} files:`);
    for (const f of manifest.data.files ?? []) {
        console.log(`  - ${outDir}/${f}`);
    }
}

function runGenerator(motionId) {
    const scriptPath = path.join(REPO_ROOT, "portal", "scripts", "generate-context-bundle.mjs");
    const args = motionId ? ["--motion", motionId] : [];
    execFileSync("node", [scriptPath, ...args], {
        cwd: REPO_ROOT,
        stdio: "inherit",
    });
}

async function main() {
    const motionId = getArgValue("--motion");
    const currentHead = git(["rev-parse", "--short", "HEAD"]);

    if (motionId) console.log(`${PREFIX} motion: ${motionId}`);

    const manifests = await readManifests();
    const best = bestManifest(manifests, motionId);

    if (best && isFresh(best, currentHead)) {
        console.log(`${PREFIX} status: FRESH`);
        printFiles(best);
        return;
    }

    if (best) {
        console.log(`${PREFIX} status: ${stalenessLabel(best, currentHead)} — regenerating...`);
    } else {
        console.log(`${PREFIX} status: NO BUNDLE — generating...`);
    }

    runGenerator(motionId);

    // Re-read manifests after generation to get the new bundle
    const refreshed = await readManifests();
    const newBest = bestManifest(refreshed, motionId);
    if (!newBest) {
        throw new Error("generation succeeded but no manifest found after re-read");
    }

    printFiles(newBest);
}

main().catch((err) => {
    console.error(`${PREFIX} FAILED`);
    console.error(err);
    process.exit(1);
});
```

### Gate validation

```
node --check portal/scripts/refresh-context-bundle.mjs
→ (no output)   EXIT: 0

# NO BUNDLE case (no bundle for motion-0110 yet)
node portal/scripts/refresh-context-bundle.mjs --motion motion-0110
→ [refresh-context-bundle] motion: motion-0110
→ [refresh-context-bundle] status: NO BUNDLE — generating...
→ {generator output}
→ [refresh-context-bundle] files:
→   - surfaces/chat-context/{date}_motion-0110_motion-snapshots.txt
→   - surfaces/chat-context/{date}_motion-0110_repo-capsule.txt
→   - surfaces/chat-context/{date}_motion-0110_active-path-pack.txt
   EXIT: 0

# FRESH case (run again immediately — same HEAD)
node portal/scripts/refresh-context-bundle.mjs --motion motion-0110
→ [refresh-context-bundle] motion: motion-0110
→ [refresh-context-bundle] status: FRESH
→ [refresh-context-bundle] files:
→   - surfaces/chat-context/{date}_motion-0110_motion-snapshots.txt
→   ...
   EXIT: 0

# STALE case (existing 2026-03-13 bundle for motion-0033)
node portal/scripts/refresh-context-bundle.mjs --motion motion-0033
→ [refresh-context-bundle] motion: motion-0033
→ [refresh-context-bundle] status: STALE (40 commits behind) — regenerating...
→ {generator output}
→ [refresh-context-bundle] files:
→   - surfaces/chat-context/{date}_motion-0033_...
   EXIT: 0

node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0110/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence checklist

- [ ] `node --check portal/scripts/refresh-context-bundle.mjs` exits 0
- [ ] NO BUNDLE case: generates bundle, prints files, exits 0
- [ ] FRESH case: skips generation, prints files, exits 0 (no generator output)
- [ ] STALE case: regenerates, prints new files, exits 0
- [ ] All three cases end with a `files:` block
- [ ] Two consecutive runs when FRESH: second run skips generation entirely
- [ ] validate_motion: EXIT 0
- [ ] validate_agency: EXIT 0
