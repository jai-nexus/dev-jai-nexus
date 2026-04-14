# Proposal: JAI Grid Repo Ingest Workflow v0

**Motion:** motion-0132
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-14
**Basis:** motion-0131 (JAI Grid Draft Package Ergonomics v0)

---

## Problem

Motion-0131 closes the portal-side ergonomics gap: the operator enters a real motion ID in
`MotionDraftModal`, all four scaffold strings are substituted live via `substituteMotionId()`,
and the bundle tab delivers a single-copy `bundle.txt` with `=== <filename> ===` delimiters.

The repo-side ingest step remains entirely manual with no guardrails:

1. Operator must create `.nexus/motions/motion-0132/` themselves (`mkdir`)
2. Operator must split the bundle or use individual tabs to paste four separately-named files
3. No local validation runs before the directory is committed
4. No conflict guard exists if the target directory already exists
5. No check that the motion ID in the modal matches the directory that was created
6. `pnpm council:run` is the first feedback loop — only fires after all files are written
   and committed, meaning schema errors are discovered after working-tree pollution

The seam between "clipboard holds a valid bundle" and "`.nexus/motions/motion-0132/` passes
`validate-motion`" is four manual, unguided steps.

---

## Solution

Add `portal/scripts/grid-ingest-bundle.mjs`: a local Node.js ESM script that:

1. Reads bundle text from `--bundle <path>` (file) or `--stdin` (piped input)
2. Parses `=== <filename> ===` section delimiters — the exact format produced by
   `buildBundle()` in `GridView.tsx`
3. Validates: all four sections present, non-empty, no `motion-XXXX` placeholder, valid
   motion ID, consistent motion ID, `motion.yaml` content passes `parseMotionText()` from
   `motionLib.mjs`
4. Checks target directory does not exist (unless `--force`)
5. Writes exactly four files under `.nexus/motions/<motion-id>/`
6. Spawns `validate-motion` as post-write confirmation
7. Prints next-step instructions: `pnpm council:run <motion-id>`
8. Makes no commit, no PR, no further mutation

Add `"grid:ingest": "node portal/scripts/grid-ingest-bundle.mjs"` to root `package.json`.

The operator flow after this motion:

```
MotionDraftModal (bundle tab)
  → copy bundle.txt to clipboard / paste to file
  → pnpm grid:ingest --bundle /path/to/bundle.txt
  → [validation gates run before any write]
  → .nexus/motions/motion-0132/ materialized (4 files)
  → validate-motion confirms schema OK
  → operator: git diff, review, git add
  → pnpm council:run motion-0132
```

The portal still does not write `.nexus/` at runtime. The ingest script is the explicit,
operator-invoked handoff.

---

## Design: reuse motionLib.mjs, not a parallel validator

`portal/src/lib/motion/motionLib.mjs` already exports `parseMotionText()` which runs the
full Zod schema validation used by `validate-motion.mjs` and `council-run.mjs`. The ingest
script imports from this module directly for pre-write validation. No parallel validation
logic is introduced.

---

## Design: fail before first write

All validation (bundle structure, section completeness, placeholder check, motion ID format,
`parseMotionText` schema, directory conflict) runs before `fs.mkdirSync()`. If any check
fails, exit 1 with a clear error message and zero file system mutations.

---

## Design: no auto-commit, no auto-PR

The script writes four files to `.nexus/motions/<motion-id>/`. Nothing else. The operator
runs `git status`, reviews the diff, stages, and commits under normal governance. The
`council:run` gate is unchanged. No commit creation occurs under any code path.

---

## Success criteria

- **SC-1** `pnpm grid:ingest --bundle <path>` and `pnpm grid:ingest --stdin` both parse the
  `=== <filename> ===` format produced by `buildBundle()` in `GridView.tsx`
- **SC-2** Script validates all four sections present and non-empty before any write
- **SC-3** Script exits non-zero with zero writes if `motion-XXXX` placeholder is present
  in any section
- **SC-4** Script exits non-zero with zero writes if motion ID fails `/^motion-\d{4}$/` or
  is absent from `motion.yaml` content
- **SC-5** Script exits non-zero with zero writes if `motion.yaml` section fails
  `parseMotionText()` schema validation
- **SC-6** Script exits non-zero with zero writes if target directory exists and `--force`
  is not passed
- **SC-7** On success: exactly four files written (`motion.yaml`, `proposal.md`,
  `execution.md`, `challenge.md`); no other files written; no commit created
- **SC-8** Post-write `validate-motion` runs and its output is printed; script warns if
  it fails but does not delete the written files
- **SC-9** `pnpm -C portal typecheck` exits 0 — no TypeScript changes required
- **SC-10** Portal interaction leaves `git status` clean; ingest script only mutates
  `.nexus/` when explicitly invoked

---

## Non-goals

- Portal-side file writes at runtime
- Auto-commit, auto-PR, or auto-ratification from the ingest script
- Writing `policy.yaml`, `vote.json`, `decision.yaml`, `decision.md`, or `verify.json`
  (council-run owns those)
- Auto-incrementing motion IDs
- Semantic validation of operator-authored narrative sections
- Changes to `gridDiff.ts`, `gridDraft.ts`, `connectionValidator.ts`, `gridConfig.ts`,
  `GridView.tsx`, `gridMotionDraft.ts`
- Changes to `council-run.mjs`, `validate-motion.mjs`, `validate-agency.mjs`, `motionLib.mjs`
- Live Ops, telemetry, notifications, collaboration, onboarding automation
- Cross-repo routing or database changes
