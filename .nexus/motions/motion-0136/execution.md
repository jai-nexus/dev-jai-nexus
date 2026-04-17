# Execution: JAI Grid Governance Launch Ergonomics v0

**Motion:** motion-0136
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

- `portal/scripts/grid-launch.mjs`
  - Read-only launch handoff checker before explicit `council-run`
  - Supported flags:
    - `--motion <motion-id>`
    - `--json`
    - `--help`
  - Consolidated checks in sequence:
    1. `DIR_EXISTS`
    2. `MOTION_STATE`
    3. `REVIEW_READY`
    4. `PREFLIGHT_READY`
    5. `VOTE_READY`
  - Named outcomes:
    - `LAUNCH_READY`
    - `BLOCKED_REVIEW_FAILED`
    - `BLOCKED_PREFLIGHT_FAILED`
    - `BLOCKED_VOTE_NOT_READY`
    - `BLOCKED_WRONG_STATE`
    - `BLOCKED_ALREADY_RATIFIED`
  - JSON contract:
    - `{ motion_id, outcome, ready, failed_check, checks, next_step }`
  - Implementation detail:
    - reads motion package files only
    - invokes `pnpm grid:review --motion <motion-id> --json`
    - invokes `pnpm grid:preflight --motion <motion-id> --json`
    - invokes `pnpm grid:vote-prep --motion <motion-id> --json`
    - extracts embedded JSON from pnpm-wrapped stdout so probe results can be evaluated
      without changing the subcommands
    - short-circuits on the first blocking result
    - never writes files
    - never invokes `council-run`

### Modified files (actual)

- `package.json`
  - Added root alias:
    - `"grid:launch": "node portal/scripts/grid-launch.mjs"`

### Unchanged

- `portal/scripts/grid-review-motion-package.mjs` - untouched
- `portal/scripts/grid-council-run-preconditions.mjs` - untouched
- `portal/scripts/grid-vote-prep.mjs` - untouched
- `portal/scripts/council-run.mjs` - untouched
- `portal/scripts/validate-motion.mjs` - untouched
- `portal/scripts/validate-agency.mjs` - untouched
- All portal runtime files - untouched
- All database and cross-repo paths - untouched

---

## Evidence log

### 1. Implementation landed in exactly two product files

- Added `portal/scripts/grid-launch.mjs`
- Modified `package.json`

No portal runtime files, no governance runner files, and no database paths were modified
for the slice-1 feature itself.

---

### 2. Launch remains read-only and separate from governance execution

Inspection result:

- Imports only `fs`, `path`, `process`, `child_process`
- Uses `fs.existsSync`, `fs.statSync`, `fs.readFileSync`
- Uses `spawnSync` only for:
  - `pnpm grid:review --motion <motion-id> --json`
  - `pnpm grid:preflight --motion <motion-id> --json`
  - `pnpm grid:vote-prep --motion <motion-id> --json`
- Does not import or invoke `council-run`
- Does not write `.nexus/` or any other file under any code path
- Only emits `pnpm council:run <motion-id>` as `next_step` when all upstream checks pass

This preserves the boundary:

- `grid:review` remains read-only
- `grid:preflight` remains read-only
- `grid:vote-prep` remains read-only by default
- `grid:launch` remains read-only
- `council-run` remains a separate explicit operator action
- no auto-commit, auto-PR, or automatic governance progression were introduced

---

### 3. Validation and launch verification

Commands:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0136/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
pnpm grid:launch --motion motion-0136
pnpm grid:launch --motion motion-0136 --json
```

Observed pre-vote results:

- `validate-motion` -> pass
- `validate-agency` -> pass
- `typecheck` -> pass
- `grid:launch` before `vote.json` -> `BLOCKED_VOTE_NOT_READY`
- `grid:launch --json` before `vote.json` -> valid machine-readable JSON
- `next_step` before `vote.json` -> `Run pnpm grid:vote-prep --motion motion-0136 --scaffold; rerun pnpm grid:launch --motion motion-0136 afterwards`

Observed post-vote results:

- after filling `vote.json`, `pnpm grid:launch --motion motion-0136` -> `LAUNCH_READY`
- after filling `vote.json`, `pnpm grid:launch --motion motion-0136 --json` -> valid machine-readable JSON
- `next_step` when ready -> `pnpm council:run motion-0136`

---

### 4. Structural blocked/ready verification

Read-only probes confirmed the explicit blocked and ready cases:

- Missing motion directory:
  - `pnpm grid:launch --motion motion-9999`
  - result: `BLOCKED_WRONG_STATE`
- Already ratified:
  - `pnpm grid:launch --motion motion-0135`
  - result: `BLOCKED_ALREADY_RATIFIED`
- Review failure:
  - `pnpm grid:launch --motion motion-0031`
  - result: `BLOCKED_REVIEW_FAILED`
- Vote not ready:
  - `pnpm grid:launch --motion motion-0136`
  - result before scaffold: `BLOCKED_VOTE_NOT_READY`
- Ready state:
  - after valid votes were present in `.nexus/motions/motion-0136/vote.json`
  - result: `LAUNCH_READY`

Repo-local note:

- No clean natural package was available during slice-1 verification for a dedicated
  `BLOCKED_PREFLIGHT_FAILED` runtime case without mutating repo state. The code path is still
  implemented directly by checking for non-zero exit or non-ready verdict from
  `grid:preflight`.

---

### 5. Ratification closeout

Canonical ratification path executed:

```text
pnpm council:run motion-0136
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
pnpm grid:vote-prep --motion motion-0136 --scaffold
```

- Filled explicit vote values in `.nexus/motions/motion-0136/vote.json`
- Verified `pnpm grid:launch --motion motion-0136` -> `LAUNCH_READY`
- Re-ran the same canonical command:

```text
pnpm council:run motion-0136
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
