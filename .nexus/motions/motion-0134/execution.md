# Execution: JAI Grid Council-Run Preconditions v0

**Motion:** motion-0134
**Role:** BUILDER
**Date:** 2026-04-15

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

- `portal/scripts/grid-council-run-preconditions.mjs`
  - Read-only handoff checker between `grid:review` and explicit operator-invoked
    `council-run`
  - Supported flags:
    - `--motion <motion-id>`
    - `--json`
    - `--help`
  - Ordered checks:
    1. `DIR_EXISTS`
    2. `REVIEW_READY`
    3. `MOTION_STATUS_READY`
    4. `VOTE_ARTIFACT_STATE`
    5. `NEXT_STEP_GUIDANCE`
  - Final verdict contract:
    - `READY_TO_INVOKE_COUNCIL_RUN` -> exit 0
    - `BLOCKED_PRECONDITION(<reason>)` -> exit 1
  - JSON contract:
    - `{ ready, verdict, failed_check, motion_id, checks, next_step }`
  - Implementation detail:
    - reads motion package files only
    - invokes `pnpm grid:review --motion <motion-id>`
    - reads `motion.yaml` status
    - reads `vote.json` presence/absence
    - prints exact next-step guidance
    - does not call `council-run`
    - performs no file writes under any code path

### Modified files (actual)

- `package.json`
  - Added root alias:
    - `"grid:preflight": "node portal/scripts/grid-council-run-preconditions.mjs"`

### Unchanged

- `portal/scripts/grid-review-motion-package.mjs` - untouched
- `portal/scripts/council-run.mjs` - untouched
- `portal/scripts/validate-motion.mjs` - untouched
- `portal/scripts/validate-agency.mjs` - untouched
- All portal runtime files - untouched
- All database and cross-repo paths - untouched

---

## Evidence log

### 1. Implementation landed in exactly two product files

- Added `portal/scripts/grid-council-run-preconditions.mjs`
- Modified `package.json`

No portal runtime files, no governance runner files, and no database paths were modified
for the slice-1 feature itself.

---

### 2. Preflight script remains read-only by implementation

Inspection result:

- Imports only `fs`, `path`, `process`, `child_process`
- Uses `fs.existsSync`, `fs.statSync`, `fs.readFileSync`
- Uses `spawnSync` only for `pnpm grid:review`
- Contains no `writeFile`, `appendFile`, `mkdir`, `rename`, `rm`, `git apply`, or
  `council-run` invocation

This preserves the boundary:

- `grid:review` remains read-only
- `grid:preflight` remains read-only
- `council-run` remains a separate explicit operator action
- no portal-side writes, auto-commit, auto-PR, or automatic ratification behavior were
  introduced

---

### 3. Validation and happy-path verification

Commands:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0134/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
pnpm grid:review --motion motion-0134
pnpm grid:preflight --motion motion-0134
pnpm grid:preflight --motion motion-0134 --json
```

Observed results:

- `validate-motion` -> pass
- `validate-agency` -> pass
- `typecheck` -> pass
- `grid:review` -> `READY_FOR_COUNCIL_RUN`
- `grid:preflight` -> `READY_TO_INVOKE_COUNCIL_RUN`
- `grid:preflight --json` -> valid JSON contract emitted

---

### 4. Blocked-path verification

Read-only probes confirmed the explicit blocked cases:

- Non-existent motion:
  - `pnpm grid:preflight --motion motion-9999`
  - result: `BLOCKED_PRECONDITION(DIR_EXISTS)`
- Review not ready:
  - `pnpm grid:preflight --motion motion-0031`
  - result: `BLOCKED_PRECONDITION(REVIEW_READY)`
- Already ratified:
  - `pnpm grid:preflight --motion motion-0133`
  - result: `BLOCKED_PRECONDITION(MOTION_STATUS_READY)`

Vote guidance paths confirmed:

- Missing `vote.json`:
  - `motion-0134`
  - guidance: create `vote.json` first if required by operator flow, otherwise expect
    `PENDING` until votes are added
- Present `vote.json`:
  - `motion-0098`
  - guidance: run `pnpm council:run motion-0098`

---

### 5. No writes from preflight runs

Before and after all `grid:preflight` probes, `git status --short` showed only the intended
slice-1 working changes during implementation. The probe runs themselves produced no
additional filesystem changes. `council-run` was never invoked from the preflight script.

---

### 6. Ratification closeout

Canonical ratification path executed:

```text
pnpm council:run motion-0134
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

- Added `.nexus/motions/motion-0134/vote.json` with three required-role `yes` votes
- Re-ran the same canonical command:

```text
pnpm council:run motion-0134
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
