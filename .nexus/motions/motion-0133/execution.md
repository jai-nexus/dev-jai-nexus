# Execution: JAI Grid Post-Ingest Review Workflow v0

**Motion:** motion-0133
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

- `portal/scripts/grid-review-motion-package.mjs` — read-only review script:
  - CLI: `--motion <motion-id>`, `--json`, `--help`
  - Checks (read-only, stop-on-first-failure for required checks):
    1. `DIR_EXISTS` — `fs.existsSync(.nexus/motions/<id>/)`
    2. `FILES_PRESENT` — all four required files present
    3. `ID_CONSISTENT` — `motion_id:` from `motion.yaml` matches `<id>` argument
    4. `VALIDATE_MOTION` — `spawnSync validate-motion.mjs --motion <path>`
    5. `GIT_STATE` — `spawnSync git status --short <dir>` (informational, always runs)
  - Verdict: `READY_FOR_COUNCIL_RUN` (exit 0) or `NOT_READY (<check-name>)` (exit 1)
  - `--json` emits `{ ready, verdict, checks: [{ name, ok, detail }] }`
  - Writes nothing under any code path

### Modified files

- `package.json` — one new entry: `"grid:review": "node portal/scripts/grid-review-motion-package.mjs"`

### Unchanged

- `portal/scripts/grid-ingest-bundle.mjs` — untouched
- `portal/src/lib/motion/motionLib.mjs` — not imported; `validate-motion.mjs` used as subprocess
- `portal/scripts/validate-motion.mjs` — spawned as subprocess, not modified
- `portal/scripts/council-run.mjs` — untouched
- `portal/src/app/operator/grid/GridView.tsx` — untouched
- `portal/src/lib/grid/gridMotionDraft.ts` — untouched
- All other `.nexus/` governance scripts — untouched

---

## Evidence log

*(Populated during proof execution)*
