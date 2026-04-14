# Execution: JAI Grid Repo Ingest Workflow v0

**Motion:** motion-0132
**Role:** BUILDER
**Date:** 2026-04-14

---

## Cost estimate

Category: standard
Basis: one new standalone Node.js ESM script + one root package.json script entry. No
TypeScript changes. No portal runtime changes. No database changes. No governance script
changes. Scope is confined to one new file and one package.json line.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard → evidence-falsifiability mandatory.

---

## Scope

### New files

- `portal/scripts/grid-ingest-bundle.mjs` — standalone Node.js ESM ingest script:
  - CLI: `--bundle <path>`, `--stdin`, `--force`, `--dry-run`
  - Imports: `fs`, `path`, `process`, `child_process` (stdlib only) +
    `parseMotionText` from `../src/lib/motion/motionLib.mjs`
  - Bundle parser: splits on `/^=== ([\w.-]+) ===/m` delimiter regex
  - Pre-write validation: section completeness, non-empty, no `motion-XXXX` placeholder,
    motion ID format `/^motion-\d{4}$/`, `parseMotionText()` schema pass, directory conflict
  - Write path: `fs.mkdirSync` then four `fs.writeFileSync` calls
  - Post-write: spawns `node portal/scripts/validate-motion.mjs --motion <path>` via
    `child_process.spawnSync`
  - Exit 0 on success; exit 1 on any pre-write failure; warn (no exit 1) on post-write
    validate-motion failure

### Modified files

- `package.json` — one new entry in `"scripts"`:
  `"grid:ingest": "node portal/scripts/grid-ingest-bundle.mjs"`

### Unchanged

- `portal/src/lib/grid/gridMotionDraft.ts` — untouched
- `portal/src/lib/grid/gridDiff.ts` — untouched
- `portal/src/app/operator/grid/GridView.tsx` — untouched
- `portal/src/lib/motion/motionLib.mjs` — read-only import, not modified
- `portal/scripts/validate-motion.mjs` — spawned as subprocess, not modified
- `portal/scripts/council-run.mjs` — untouched
- All other `.nexus/` governance scripts — untouched

---

## Evidence log

*(Populated during proof execution)*
