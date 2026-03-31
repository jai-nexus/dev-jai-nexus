# Proposal: Governed context bundle scoping — encode motion ID in bundle output filenames

**Motion:** motion-0107
**Date:** 2026-03-31
**Kind:** builder-proof

## Context

`portal/scripts/generate-context-bundle.mjs` generates three context artifacts
and a manifest for each session:

```
surfaces/chat-context/
  {date}_motion-snapshots.txt
  {date}_repo-capsule.txt
  {date}_active-path-pack.txt
  {date}_context-bundle_manifest.json
```

The script already accepts a `--motion motion-XXXX` flag, which is passed to
`generate-active-path-pack.mjs` for scope filtering. The manifest includes a
`"motion"` field when the flag is present. However, output filenames use only
the date prefix — not the motion ID.

The operating workflow (`operating-workflow.md`) recommends context bundles as
the primary portability tool across sessions. The passalong schema (`passalong-schema.md`)
references context bundles in the Reference layers section. Both assume that a
bundle can be identified as belonging to a specific motion.

Current reality: the last committed bundles in `surfaces/chat-context/` are from
2026-03-13 and carry no motion ID anywhere in their filenames.

## Problem

- Two same-day bundle runs for different motions silently overwrite each other —
  filename collision is guaranteed in any multi-motion session
- Bundle filenames do not communicate which motion they cover; the only way to
  identify the motion is to read the manifest file
- The manifest schema `context-bundle-0.1` does not distinguish motion-scoped
  from generic bundles
- Operators and future sessions cannot select the right bundle from
  `surfaces/chat-context/` without reading manifests — friction that degrades
  the portability benefit context bundles are intended to provide

## Approach

**One file change: `portal/scripts/generate-context-bundle.mjs`**

When `--motion motion-XXXX` is passed:

1. Run the three sub-scripts as before (no sub-script changes)
2. Rename the four output files after generation to insert the motion ID:
   - `{date}_motion-XXXX_motion-snapshots.txt`
   - `{date}_motion-XXXX_repo-capsule.txt`
   - `{date}_motion-XXXX_active-path-pack.txt`
   - `{date}_motion-XXXX_context-bundle_manifest.json`
3. Update the `files` array in the manifest to reflect renamed filenames
4. Bump manifest `schema` to `"context-bundle-0.2"`
5. Add `motion_scoped: true` to the manifest

When `--motion` is not passed:

- Filenames unchanged: `{date}_*.txt`
- Manifest schema bumps to `"context-bundle-0.2"`
- Manifest gains `motion_scoped: false`

Rename implementation: after sub-scripts complete, read the known default
filenames, call `fs.rename()` for each. The manifest is rewritten after rename
with the corrected `files` array. Existing files at the target path are
overwritten (same idempotency guarantee as the current script).

## Non-goals

- No changes to `generate-motion-snapshot.mjs`, `generate-repo-capsule.mjs`,
  or `generate-active-path-pack.mjs`
- No runtime changes
- No DB changes
- No UI changes
- No changes to `CLAUDE.md` or substrate artifacts
- No changes to `passalong-schema.md` — save path convention
  `{date}_passalong_{kind}_{motionId}.md` is already motion-scoped and unaffected
- No changes to `operating-workflow.md` — the recommendation to use context bundles
  is already correct; this motion makes it more reliable

## Success criteria

- `node portal/scripts/generate-context-bundle.mjs --motion motion-0107` outputs:
  - `{date}_motion-0107_motion-snapshots.txt`
  - `{date}_motion-0107_repo-capsule.txt`
  - `{date}_motion-0107_active-path-pack.txt`
  - `{date}_motion-0107_context-bundle_manifest.json`
- `node portal/scripts/generate-context-bundle.mjs` (no flag) outputs:
  - `{date}_motion-snapshots.txt` etc. — unchanged behavior
- Both cases: manifest `schema: "context-bundle-0.2"`, `motion_scoped: true/false`
- `node --check portal/scripts/generate-context-bundle.mjs` exits 0
- Two consecutive runs with `--motion motion-0107` produce identical files
  (idempotent rename, no duplicate files)
- `validate_motion` and `validate_agency` both exit 0
