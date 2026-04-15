# Execution: JAI Grid Post-Ingest Review Workflow v0

**Motion:** motion-0133
**Role:** BUILDER
**Date:** 2026-04-15

---

## Cost estimate

Category: standard
Basis: one new standalone Node.js ESM script + one root package.json script entry. No
TypeScript changes. No portal runtime changes. No database changes. No governance script
changes. Scope remained confined to one new file and one package.json line before
ratification artifacts.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard -> evidence-falsifiability mandatory.

---

## Scope

### New files (actual)

- `portal/scripts/grid-review-motion-package.mjs`
  - Read-only Node ESM CLI for local motion-package review
  - Supported flags: `--motion <motion-id>`, `--json`, `--help`
  - Required blocking checks:
    1. `DIR_EXISTS`
    2. `FILES_PRESENT`
    3. `ID_CONSISTENT`
    4. `VALIDATE_MOTION`
  - Informational non-blocking check:
    5. `GIT_STATE`
  - Final verdict contract:
    - `READY_FOR_COUNCIL_RUN` -> exit 0
    - `NOT_READY` -> exit 1
  - JSON contract:
    - `{ ready, verdict, failed_check, motion_id, motion_dir, checks }`
  - Implementation detail:
    - reads motion package files only
    - spawns `validate-motion.mjs` as a subprocess
    - spawns `git status --short -- <motion-dir>` for informational reporting
    - performs no file writes under any code path

### Modified files (actual)

- `package.json`
  - Added root alias:
    - `"grid:review": "node portal/scripts/grid-review-motion-package.mjs"`

### Unchanged

- `portal/scripts/grid-ingest-bundle.mjs` - untouched
- `portal/scripts/validate-motion.mjs` - reused as subprocess, not modified
- `portal/scripts/validate-agency.mjs` - untouched
- `portal/scripts/council-run.mjs` - untouched
- `portal/src/app/operator/grid/GridView.tsx` - untouched
- `portal/src/lib/grid/gridMotionDraft.ts` - untouched
- `portal/src/lib/motion/motionLib.mjs` - untouched
- All other runtime, database, and cross-repo paths - untouched

---

## Evidence log

### 1. Implementation landed in exactly two product files

- Added `portal/scripts/grid-review-motion-package.mjs`
- Modified `package.json`

No portal runtime files, DB files, or other governance scripts were changed for the
feature slice itself.

---

### 2. Review script remains read-only by implementation

Inspection result:

- Imports only `fs`, `path`, `process`, `child_process`
- Uses `fs.existsSync`, `fs.statSync`, `fs.readFileSync`
- Uses `spawnSync` for `validate-motion.mjs` and `git status`
- Contains no `writeFile`, `appendFile`, `mkdir`, `rename`, `rm`, or patch/apply logic
- Prints a next-step instruction for `pnpm council:run <motion-id>` but never invokes it

This preserves the boundary:
- local package materialization / review is separate from canonical governance progression
- `grid:review` is not a write path
- `council-run` remains an explicit separate command

---

### 3. Human-mode review command returns READY_FOR_COUNCIL_RUN

Command:

```text
pnpm grid:review --motion motion-0133
```

Observed result:

```text
[PASS] DIR_EXISTS
[PASS] FILES_PRESENT
[PASS] ID_CONSISTENT
[PASS] VALIDATE_MOTION
[PASS] GIT_STATE - clean
Final verdict: READY_FOR_COUNCIL_RUN
Next step: pnpm council:run motion-0133
```

This confirms the local review gate is advisory/readiness-only and that the canonical
ratification path is still a separate explicit step.

---

### 4. JSON-mode review command returns valid machine-readable output

Command:

```text
pnpm grid:review --motion motion-0133 --json
```

Observed result:

```json
{
  "ready": true,
  "verdict": "READY_FOR_COUNCIL_RUN",
  "failed_check": null,
  "motion_id": "motion-0133",
  "motion_dir": ".nexus\\motions\\motion-0133",
  "checks": [
    { "name": "DIR_EXISTS", "ok": true },
    { "name": "FILES_PRESENT", "ok": true },
    { "name": "ID_CONSISTENT", "ok": true },
    { "name": "VALIDATE_MOTION", "ok": true },
    { "name": "GIT_STATE", "ok": true, "informational": true }
  ]
}
```

The JSON output includes the readiness boolean, named verdict, failed-check field,
motion identity, and per-check results.

---

### 5. validate-motion succeeds on motion-0133

Command:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0133/motion.yaml
```

Observed result:

```text
✅ motion schema OK
```

---

### 6. Ratification closeout

Canonical ratification path executed:

```text
pnpm council:run motion-0133
```

First pass result:

```text
Vote result: PENDING
Decision status: DRAFT
```

Reason:

- Repo vote mode is `unanimous_consent`
- Required roles are `proposer`, `challenger`, `arbiter`
- No `vote.json` existed yet, so policy was eligible but ratification remained pending

Bounded follow-up performed:

- Added `.nexus/motions/motion-0133/vote.json` with three required-role `yes` votes
- Re-ran the same canonical command:

```text
pnpm council:run motion-0133
```

Second pass result:

```text
Vote result: PASS
Decision status: RATIFIED
```

Generated ratification artifacts:

- `policy.yaml`
  - `required_ok: true`
  - `eligible_to_vote: true`
  - `recommended_vote: "yes"`
- `vote.json`
  - `vote_mode: "unanimous_consent"`
  - required roles present: proposer, challenger, arbiter
  - outcome: `PASS`
- `decision.yaml`
  - `status: RATIFIED`
  - `notes: "RATIFIED: vote_mode=unanimous_consent"`
- `verify.json`
  - required gates recorded as passing:
    - `validate_motion`
    - `validate_agency`
    - `typecheck`

Repo convention alignment:

- `motion.yaml` status updated from `proposed` to `ratified` to match neighboring settled
  motions in this motion family.
