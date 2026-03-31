# Execution: Governed context bundle scoping — encode motion ID in bundle output filenames

**Motion:** motion-0107
**Role:** BUILDER
**Date:** 2026-03-31

## Scope

Files changed:

```
portal/scripts/generate-context-bundle.mjs    (modified — rename logic, schema bump)
.nexus/motions/motion-0107/                   (6 files — this motion package)
```

Files NOT changed:
- `generate-motion-snapshot.mjs` — untouched
- `generate-repo-capsule.mjs` — untouched
- `generate-active-path-pack.mjs` — untouched
- No runtime, DB, or UI changes

## Implementation plan

### Step 1 — Understand the current script

`generate-context-bundle.mjs` (92 lines) does:
1. Accepts `--motion motion-XXXX` via `getArgValue`
2. Runs three sub-scripts; passes `--motion` to `generate-active-path-pack.mjs` only
3. Constructs a `files` array with default date-prefixed filenames
4. Writes `{date}_context-bundle_manifest.json` with schema `"context-bundle-0.1"`

The sub-scripts write their own output files to `surfaces/chat-context/` using
hardcoded `{date}_` prefixes. The orchestrator has no control over sub-script
output filenames without modifying the sub-scripts.

### Step 2 — Implement rename logic

After the three sub-scripts complete, if `motionId` is present:

```js
// Default basenames — what sub-scripts write
const defaultBasenames = [
    `${date}_motion-snapshots.txt`,
    `${date}_repo-capsule.txt`,
    `${date}_active-path-pack.txt`,
];

// Scoped basenames — what we want
const prefix = motionId ? `${date}_${motionId}` : date;
const files = defaultBasenames.map(f =>
    motionId ? f.replace(`${date}_`, `${prefix}_`) : f
);

// Rename the three txt files if motion-scoped
if (motionId) {
    for (let i = 0; i < defaultBasenames.length; i++) {
        const src = path.join(OUTPUT_DIR, defaultBasenames[i]);
        const dst = path.join(OUTPUT_DIR, files[i]);
        await fs.rename(src, dst);
    }
}
```

### Step 3 — Update manifest construction

Replace the manifest block to:
- Bump `schema` to `"context-bundle-0.2"`
- Add `motion_scoped: motionId !== null`
- Use `files` (which now contains renamed or unchanged names depending on flag)
- Use `prefix` to compute the manifest filename

```js
const manifest = {
    schema: "context-bundle-0.2",
    generated_at: utcNow(),
    repo: "dev-jai-nexus",
    branch: git(["rev-parse", "--abbrev-ref", "HEAD"]) || "(unknown)",
    head_commit: git(["rev-parse", "--short", "HEAD"]) || "(unknown)",
    motion: motionId,
    motion_scoped: motionId !== null,
    output_dir: path.relative(REPO_ROOT, OUTPUT_DIR).replaceAll("\\", "/"),
    files,
};

const manifestBasename = `${prefix}_context-bundle_manifest.json`;
const manifestPath = path.join(OUTPUT_DIR, manifestBasename);
```

### Step 4 — Gate validation

```
node --check portal/scripts/generate-context-bundle.mjs
→ (no output)   EXIT: 0

node portal/scripts/generate-context-bundle.mjs --motion motion-0107
→ surfaces/chat-context/{date}_motion-0107_context-bundle_manifest.json

node portal/scripts/generate-context-bundle.mjs
→ surfaces/chat-context/{date}_context-bundle_manifest.json

node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0107/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

### Step 5 — Evidence

After Step 4, inspect `surfaces/chat-context/`:

```
{date}_motion-0107_motion-snapshots.txt        ← motion-scoped
{date}_motion-0107_repo-capsule.txt            ← motion-scoped
{date}_motion-0107_active-path-pack.txt        ← motion-scoped
{date}_motion-0107_context-bundle_manifest.json ← motion-scoped, schema: context-bundle-0.2

{date}_motion-snapshots.txt                    ← generic run (if run without --motion)
{date}_context-bundle_manifest.json            ← generic run, schema: context-bundle-0.2
```

Manifest for motion-scoped run (expected content):
```json
{
  "schema": "context-bundle-0.2",
  "generated_at": "...",
  "repo": "dev-jai-nexus",
  "branch": "sprint/q2-codex-real-workflow-pilot",
  "head_commit": "...",
  "motion": "motion-0107",
  "motion_scoped": true,
  "output_dir": "surfaces/chat-context",
  "files": [
    "{date}_motion-0107_motion-snapshots.txt",
    "{date}_motion-0107_repo-capsule.txt",
    "{date}_motion-0107_active-path-pack.txt"
  ]
}
```

## Evidence checklist

- [ ] `node --check portal/scripts/generate-context-bundle.mjs` exits 0
- [ ] `--motion motion-0107` produces 4 motion-scoped files, none with default names
- [ ] No `--motion` flag produces 4 default-named files unchanged
- [ ] Manifest `schema`: `"context-bundle-0.2"` in both cases
- [ ] Manifest `motion_scoped: true` when flag present, `false` when absent
- [ ] Two consecutive `--motion` runs overwrite, not duplicate
- [ ] validate_motion: EXIT 0
- [ ] validate_agency: EXIT 0
