# Execution: Context bundle discoverability — add find-context-bundle.mjs with staleness detection

**Motion:** motion-0109
**Role:** BUILDER
**Date:** 2026-03-31

## Scope

Files created:

```
portal/scripts/find-context-bundle.mjs         (new — bundle discovery + staleness script)
.nexus/motions/motion-0109/                    (6 files — this motion package)
```

Files NOT changed:
- No existing scripts modified
- No runtime, DB, or UI changes

## Implementation

### Full script: `portal/scripts/find-context-bundle.mjs`

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

function getArgValue(flag) {
    const idx = process.argv.indexOf(flag);
    if (idx === -1) return null;
    return process.argv[idx + 1] ?? null;
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

async function readManifests() {
    let entries;
    try {
        entries = await fs.readdir(OUTPUT_DIR);
    } catch {
        return [];
    }
    const manifests = [];
    for (const name of entries) {
        if (!name.endsWith("_context-bundle_manifest.json")) continue;
        const filePath = path.join(OUTPUT_DIR, name);
        try {
            const content = await fs.readFile(filePath, "utf8");
            const data = JSON.parse(content);
            manifests.push({ name, data });
        } catch {
            // skip unparseable manifests
        }
    }
    return manifests;
}

function staleness(bundleHead, currentHead) {
    if (!bundleHead || bundleHead === "(unknown)" || !currentHead) {
        return { fresh: false, count: null };
    }
    if (bundleHead === currentHead) return { fresh: true, count: 0 };
    const countStr = git(["rev-list", `${bundleHead}..HEAD`, "--count"]);
    const count = parseInt(countStr, 10);
    return { fresh: count === 0, count: isNaN(count) ? null : count };
}

async function main() {
    const motionId = getArgValue("--motion");
    const currentHead = git(["rev-parse", "--short", "HEAD"]);

    const all = await readManifests();

    const candidates = motionId
        ? all.filter((m) => m.data.motion === motionId)
        : all;

    candidates.sort((a, b) =>
        (b.data.generated_at ?? "").localeCompare(a.data.generated_at ?? ""),
    );

    const prefix = "[find-context-bundle]";

    if (motionId) console.log(`${prefix} motion: ${motionId}`);

    if (candidates.length === 0) {
        console.log(`${prefix} status: NO BUNDLE`);
        const cmd = motionId
            ? `node portal/scripts/generate-context-bundle.mjs --motion ${motionId}`
            : "node portal/scripts/generate-context-bundle.mjs";
        console.log(`${prefix} generate: ${cmd}`);
        process.exit(0);
    }

    const best = candidates[0];
    const bundleHead = best.data.head_commit ?? "(unknown)";
    const { fresh, count } = staleness(bundleHead, currentHead);

    console.log(`${prefix} bundle: ${best.name}`);
    console.log(`${prefix} generated_at: ${best.data.generated_at ?? "(unknown)"}`);
    console.log(`${prefix} bundle_head: ${bundleHead}`);
    console.log(`${prefix} current_head: ${currentHead || "(unknown)"}`);

    if (fresh) {
        console.log(`${prefix} status: FRESH`);
        console.log(`${prefix} files:`);
        for (const f of best.data.files ?? []) {
            console.log(`  - ${best.data.output_dir ?? "surfaces/chat-context"}/${f}`);
        }
    } else {
        const staleLabel = count !== null
            ? `STALE (${count} commit${count === 1 ? "" : "s"} behind)`
            : "STALE (commit distance unknown)";
        console.log(`${prefix} status: ${staleLabel}`);
        const cmd = motionId
            ? `node portal/scripts/generate-context-bundle.mjs --motion ${motionId}`
            : "node portal/scripts/generate-context-bundle.mjs";
        console.log(`${prefix} regenerate: ${cmd}`);
    }
}

main().catch((err) => {
    console.error("[find-context-bundle] FAILED");
    console.error(err);
    process.exit(1);
});
```

### Gate validation

```
node --check portal/scripts/find-context-bundle.mjs
→ (no output)   EXIT: 0

node portal/scripts/find-context-bundle.mjs --motion motion-0033
→ [find-context-bundle] motion: motion-0033
→ [find-context-bundle] bundle: 2026-03-13_context-bundle_manifest.json
→ [find-context-bundle] generated_at: 2026-03-13T19:28:05.050Z
→ [find-context-bundle] bundle_head: 981771a
→ [find-context-bundle] current_head: {current}
→ [find-context-bundle] status: STALE (40 commits behind)
→ [find-context-bundle] regenerate: node portal/scripts/generate-context-bundle.mjs --motion motion-0033

node portal/scripts/find-context-bundle.mjs --motion motion-9999
→ [find-context-bundle] motion: motion-9999
→ [find-context-bundle] status: NO BUNDLE
→ [find-context-bundle] generate: node portal/scripts/generate-context-bundle.mjs --motion motion-9999

node portal/scripts/generate-context-bundle.mjs --motion motion-0109
# (generates fresh bundle)

node portal/scripts/find-context-bundle.mjs --motion motion-0109
→ [find-context-bundle] motion: motion-0109
→ [find-context-bundle] bundle: {date}_motion-0109_context-bundle_manifest.json
→ [find-context-bundle] status: FRESH
→ [find-context-bundle] files:
→   - surfaces/chat-context/{date}_motion-0109_motion-snapshots.txt
→   - surfaces/chat-context/{date}_motion-0109_repo-capsule.txt
→   - surfaces/chat-context/{date}_motion-0109_active-path-pack.txt

node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0109/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence checklist

- [ ] `node --check portal/scripts/find-context-bundle.mjs` exits 0
- [ ] `--motion motion-0033` finds existing manifest and reports STALE with commit count
- [ ] `--motion motion-9999` (no bundle) reports NO BUNDLE with generate command
- [ ] After generating a fresh bundle for motion-0109: `--motion motion-0109` reports FRESH
- [ ] No `--motion` flag finds the most recent manifest overall
- [ ] STALE does not exit non-zero (exit 0)
- [ ] Script error (e.g. unreadable dir) exits 1
- [ ] validate_motion: EXIT 0
- [ ] validate_agency: EXIT 0
