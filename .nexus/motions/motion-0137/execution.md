# Execution: JAI Grid Governance Execution Visibility v0

**Motion:** motion-0137
**Role:** BUILDER
**Date:** 2026-04-16

---

## Cost estimate

Category: standard
Basis: one new standalone Node.js ESM script plus one root package alias. No portal runtime
changes. No database changes. No cross-repo changes. No governance runner modifications.
Scope remained confined to one new script and one package.json entry before ratification
artifacts.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard -> evidence-falsifiability mandatory.

---

## Scope

### New files (actual)

- `portal/scripts/grid-status.mjs`
  - Read-only governance execution visibility checker
  - Supported flags:
    - `--motion <motion-id>`
    - `--json`
    - `--help`
  - Reads motion-local artifacts only:
    - `motion.yaml`
    - `decision.yaml`
    - `verify.json`
    - `vote.json`
    - `policy.yaml`
  - Named execution states:
    - `EXECUTION_RATIFIED`
    - `EXECUTION_BLOCKED`
    - `EXECUTION_PENDING`
    - `EXECUTION_DRAFT`
    - `EXECUTION_NOT_STARTED`
    - `WRONG_STATE`
  - JSON contract:
    - `{ motion_id, execution_state, ready, decision, gates, vote, policy, next_step }`
  - Implementation detail:
    - reads YAML via `js-yaml`
    - reads JSON via `JSON.parse`
    - computes execution state strictly from motion-local artifacts
    - does not spawn subprocesses
    - does not write files
    - never invokes `council-run`

### Modified files (actual)

- `package.json`
  - Added root alias:
    - `"grid:status": "node portal/scripts/grid-status.mjs"`

### Unchanged

- `portal/scripts/grid-review-motion-package.mjs` - untouched
- `portal/scripts/grid-council-run-preconditions.mjs` - untouched
- `portal/scripts/grid-vote-prep.mjs` - untouched
- `portal/scripts/grid-launch.mjs` - untouched
- `portal/scripts/council-run.mjs` - untouched
- `portal/scripts/validate-motion.mjs` - untouched
- `portal/scripts/validate-agency.mjs` - untouched
- All portal runtime files - untouched
- All database and cross-repo paths - untouched

---

## Evidence log

### 1. Implementation landed in exactly two product files

- Added `portal/scripts/grid-status.mjs`
- Modified `package.json`

No portal runtime files, no governance runner files, and no database paths were modified
for the slice-1 feature itself.

---

### 2. Status remains read-only and limited to motion-local artifacts

Inspection result:

- Imports only `fs`, `path`, `process`, `js-yaml`
- Uses `fs.existsSync`, `fs.statSync`, `fs.readFileSync`
- Parses only motion-local YAML and JSON artifacts
- Does not spawn subprocesses
- Does not import or invoke `council-run`
- Does not write `.nexus/` or any other file under any code path
- Reports existing governance state from artifacts and does not recompute governance beyond
  those artifacts

This preserves the boundary:

- `grid:review` remains read-only
- `grid:preflight` remains read-only
- `grid:vote-prep` remains read-only by default
- `grid:launch` remains read-only
- `grid:status` remains read-only
- `council-run` remains a separate explicit operator action
- no auto-commit, auto-PR, or automatic governance progression were introduced

---

### 3. Validation and status verification

Commands:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0137/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
pnpm grid:status --motion motion-0137
pnpm grid:status --motion motion-0137 --json
```

Observed pre-ratification results:

- `validate-motion` -> pass
- `validate-agency` -> pass
- `typecheck` -> pass
- `grid:status` before any `decision.yaml` existed -> `EXECUTION_NOT_STARTED`
- `grid:status --json` before any `decision.yaml` existed -> valid machine-readable JSON
- `next_step` before governance execution -> `Run pnpm grid:launch --motion motion-0137, then pnpm council:run motion-0137`

Observed post-ratification results:

- after ratification artifacts were present, `pnpm grid:status --motion motion-0137` -> `EXECUTION_RATIFIED`
- after ratification artifacts were present, `pnpm grid:status --motion motion-0137 --json` -> valid machine-readable JSON
- `next_step` when ratified -> `No further governance action required`

---

### 4. Structural state verification

Read-only probes confirmed the explicit visibility states that existed in repo or in the
motion-0137 execution path:

- Missing motion directory:
  - `pnpm grid:status --motion motion-9999`
  - result: `WRONG_STATE`
- Not started:
  - `pnpm grid:status --motion motion-0137`
  - result before `decision.yaml`: `EXECUTION_NOT_STARTED`
- Ratified:
  - `pnpm grid:status --motion motion-0136`
  - result: `EXECUTION_RATIFIED`
- Ratified:
  - `pnpm grid:status --motion motion-0137`
  - result after canonical closeout: `EXECUTION_RATIFIED`

Repo-local note:

- No committed `BLOCKED` decisions were present during slice-1 verification.
- No committed `DRAFT` decisions remained in-repo at verification time because the motion-0137
  draft state was superseded by the successful second council pass.
- No committed `vote.json` artifacts with `result: PENDING` were present during verification.
- The `EXECUTION_BLOCKED`, `EXECUTION_DRAFT`, and `EXECUTION_PENDING` branches are therefore
  implemented against the current artifact schema but were not all runtime-proved from a
  committed example in this slice.

---

### 5. Ratification closeout

Canonical ratification path executed:

```text
pnpm council:run motion-0137
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

```text
pnpm grid:vote-prep --motion motion-0137 --scaffold
```

- Filled explicit vote values in `.nexus/motions/motion-0137/vote.json`
- Verified `pnpm grid:launch --motion motion-0137` -> `LAUNCH_READY`
- Re-ran the same canonical command:

```text
pnpm council:run motion-0137
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

Artifact note:

- `decision.md` was not created by this flow and was not required for ratification

Repo convention alignment:

- `motion.yaml` status updated from `open` to `ratified` to match neighboring settled
  motions in this motion family.
