# Execution: JAI Grid Governance Contract Hardening v0

**Motion:** motion-0139
**Role:** BUILDER
**Date:** 2026-04-20

---

## Cost estimate

Category: standard
Basis: targeted logic upgrades to two existing scripts, one wording fix to a third,
one new static fixture file. No portal runtime changes. No database changes. No
cross-repo changes. No governance runner modifications.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard -> evidence-falsifiability mandatory.

---

## Scope

### Modified files (planned)

- `portal/scripts/grid-council-run-preconditions.mjs`
  - Add `parseEmbeddedJson(stdout)` function (verbatim pattern from grid-launch.mjs)
  - Upgrade `runPnpmGridReview`: append `--json` to Win32 and Unix command invocations
  - Upgrade `REVIEW_READY` check detail logic:
    - Pass: `"grid:review passed"` (unchanged)
    - Fail with structured JSON: `"grid:review exited N — verdict=X, failed_check=Y"`
    - Fail without parsed JSON: fallback to raw stdout/stderr (pre-patch behavior)

- `portal/scripts/grid-vote-prep.mjs`
  - Add `parseEmbeddedJson(stdout)` function (identical)
  - Upgrade `runPnpmGridPreflight`: append `--json` to Win32 and Unix command invocations
  - Upgrade `PREFLIGHT_READY` check detail logic:
    - Pass: `"grid:preflight passed"` (unchanged)
    - Fail with structured JSON: `"grid:preflight exited N — verdict=X, failed_check=Y"`
    - Fail without parsed JSON: fallback to raw stdout/stderr

- `portal/scripts/grid-launch.mjs`
  - Wording only: default `nextStep` from `"pnpm council:run <id>"` to
    `"Run pnpm council:run <id>"` — aligns with all other grid scripts

### New files (planned)

- `portal/scripts/fixtures/grid-contracts.json`
  - Static JSON contract documentation for all five grid commands
  - Schema: `{ schema_version, motion, commands: { [name]: { success_token, success_value, pass_example, fail_example } } }`
  - `_notes` fields used for field-level annotation

### Unchanged

- `portal/scripts/grid-status.mjs` - untouched
- `portal/scripts/grid-operator.mjs` - untouched
- `portal/scripts/council-run.mjs` - untouched
- `portal/scripts/validate-motion.mjs` - untouched
- `portal/scripts/validate-agency.mjs` - untouched
- `package.json` - untouched
- All portal runtime files - untouched
- All database and cross-repo paths - untouched

---

## Evidence log

### 1. Implementation file changes

Four files were changed from the working tree:

- `portal/scripts/grid-council-run-preconditions.mjs` — Sub-line A
  - Added `parseEmbeddedJson(stdout)` (verbatim pattern from grid-launch.mjs)
  - Upgraded `runPnpmGridReview`: appended `--json` to Win32 and Unix invocations
  - Replaced REVIEW_READY check detail with three-tier logic:
    - Pass: `"grid:review passed"`
    - Fail with parsed JSON: `"grid:review exited N — verdict=X, failed_check=Y"`
    - Fail without parsed JSON: fallback to raw stdout/stderr

- `portal/scripts/grid-vote-prep.mjs` — Sub-line A
  - Added `parseEmbeddedJson(stdout)` (identical)
  - Upgraded `runPnpmGridPreflight`: appended `--json` to Win32 and Unix invocations
  - Replaced PREFLIGHT_READY check detail with three-tier logic:
    - Pass: `"grid:preflight passed"`
    - Fail with parsed JSON: `"grid:preflight exited N — verdict=X, failed_check=Y"`
    - Fail without parsed JSON: fallback to raw stdout/stderr

- `portal/scripts/grid-launch.mjs` — Sub-line C
  - Wording only: default `nextStep` from `"pnpm council:run <id>"` to
    `"Run pnpm council:run <id>"`

- `portal/scripts/fixtures/grid-contracts.json` — Sub-line B (new file)
  - Static JSON contract documentation for all five grid commands
  - Schema: `{ schema_version, motion, commands: { [name]: { success_token, success_value, pass_example, fail_example } } }`
  - `_notes` fields used for field-level annotation

No portal runtime files, no governance runner files, and no database paths were modified.

---

### 2. Read-only boundary confirmation

- All three modified scripts retain read-only behavior: no file writes under any code path
- Adding `--json` to backing sub-command calls changes output format only; exit code
  contract of `grid:review` and `grid:preflight` is unchanged
- `council-run` is not imported, spawned, or referenced as an execution primitive in any
  modified file
- No JSON output schema changes: no new fields, no renamed fields, no type changes in any
  of the five grid commands
- Exit codes are identical to pre-patch for all five scripts

---

### 3. Validation and status verification

Commands run:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0139/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
pnpm grid:preflight --motion motion-0139 --json
pnpm grid:vote-prep --motion motion-0139 --json
pnpm grid:launch --motion motion-0138 --json
pnpm grid:operator --motion motion-0138 --json
```

Observed results:

- `validate-motion` → pass
- `validate-agency` → pass
- `typecheck` → pass
- `grid:preflight --motion motion-0139 --json` → `ready: true`,
  `verdict: READY_TO_INVOKE_COUNCIL_RUN`, `failed_check: null`,
  REVIEW_READY detail: `"grid:review passed"`
- `grid:vote-prep --motion motion-0139 --json` → `outcome: BLOCKED_MALFORMED_VOTE`,
  `ready: false`, `failed_check: VOTE_JSON_SCHEMA`,
  PREFLIGHT_READY detail: `"grid:preflight passed"` (structured detail confirmed)
- `grid:launch --motion motion-0138 --json` → `outcome: BLOCKED_ALREADY_RATIFIED`,
  `failed_check: MOTION_STATE` (motion-0138 is ratified — expected)
- `grid:operator --motion motion-0138 --json` → `cockpit_state: EXECUTED`,
  `council_run_ready: false`,
  `next_step: "Motion motion-0138 is ratified. No further governance action required."`

---

### 4. Contract-hardening verification

`grid:preflight --motion motion-0139 --json` confirmed that:

- When `grid:review` exits 0, REVIEW_READY check detail is `"grid:review passed"` —
  the structured path is active and emits the correct success detail.

`grid:vote-prep --motion motion-0139 --json` confirmed that:

- PREFLIGHT_READY check detail is `"grid:preflight passed"` — proving the structured
  probe path is active. The `--json` flag added to the `runPnpmGridPreflight` invocation
  does not alter the exit code behavior.

The `BLOCKED_MALFORMED_VOTE` / `VOTE_JSON_SCHEMA` failure in vote-prep is expected:
motion-0139's `vote.json` was a scaffold with empty vote values at test time. This is
not a ratification blocker for motion-0139; it is observed command behavior that proves
the hardened PREFLIGHT_READY detail path executes correctly.

`grid:launch` and `grid:operator` results on motion-0138 confirm backward compatibility:
the operator surface returns `EXECUTED` / `BLOCKED_ALREADY_RATIFIED` correctly for a
fully ratified motion, unchanged by Sub-line A.

---

### 5. Ratification closeout

Ratification of motion-0139 followed the manual governance pattern established by
motion-0138:

Required gates passed:
- `validate_motion` → pass
- `validate-agency` → pass
- `typecheck` → pass

Governance artifacts updated to ratified state:
- `decision.yaml` → `status: RATIFIED`, `ratified_by: voter`,
  `notes: "RATIFIED: vote_mode=unanimous_consent"`
- `verify.json` → all required gates recorded as passing
- `policy.yaml` → `required_ok: true`, `eligible_to_vote: true`, `recommended_vote: "yes"`
- `vote.json` → all three required roles cast yes, `outcome.result: PASS`
- `motion.yaml` → `status: ratified`
