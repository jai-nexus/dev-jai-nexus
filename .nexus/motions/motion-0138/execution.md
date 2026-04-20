# Execution: JAI Grid Governance Operator Cockpit v0

**Motion:** motion-0138
**Role:** BUILDER
**Date:** 2026-04-20

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

- `portal/scripts/grid-operator.mjs`
  - Read-only operator progression cockpit
  - Supported flags:
    - `--motion <motion-id>`
    - `--json`
    - `--help`
  - Composes four backing grid commands via `runJsonProbe`:
    - `pnpm grid:vote-prep --motion <id> --json`
    - `pnpm grid:preflight --motion <id> --json`
    - `pnpm grid:launch --motion <id> --json`
    - `pnpm grid:status --motion <id> --json`
  - Cockpit progression states:
    - `READY`
    - `BLOCKED`
    - `INCOMPLETE`
    - `EXECUTED`
    - `UNKNOWN`
  - JSON contract:
    - `{ motion_id, cockpit_state, council_run_ready, council_run_command, stages, next_step }`
  - Implementation detail:
    - inlines `runPnpmCommand`, `parseEmbeddedJson`, `runJsonProbe` from grid-launch.mjs pattern
    - calls all four probes unconditionally (no short-circuit)
    - does not spawn `council-run` under any code path
    - does not write files
    - `EXECUTED` exclusive to `normalizeStatusProbe` (`execution_state === EXECUTION_RATIFIED`
      AND `probe.status === 0`)
    - all READY / EXECUTED positive branches require `probe.status === 0` guard
    - `BLOCKED_ALREADY_RATIFIED` from vote-prep and launch is mapped to `BLOCKED`

### Modified files (actual)

- `package.json`
  - Added root alias:
    - `"grid:operator": "node portal/scripts/grid-operator.mjs"`

### Unchanged

- `portal/scripts/grid-review-motion-package.mjs` - untouched
- `portal/scripts/grid-council-run-preconditions.mjs` - untouched
- `portal/scripts/grid-vote-prep.mjs` - untouched
- `portal/scripts/grid-launch.mjs` - untouched
- `portal/scripts/grid-status.mjs` - untouched
- `portal/scripts/council-run.mjs` - untouched
- `portal/scripts/validate-motion.mjs` - untouched
- `portal/scripts/validate-agency.mjs` - untouched
- All portal runtime files - untouched
- All database and cross-repo paths - untouched

---

## Evidence log

### 1. Implementation landed in exactly two product files

- Added `portal/scripts/grid-operator.mjs`
- Modified `package.json`

No portal runtime files, no governance runner files, and no database paths were modified
for the slice-1 feature itself.

---

### 2. Cockpit is read-only and does not invoke council-run

Inspection result:

- Imports only `process`, `child_process` (spawnSync for sub-command probing)
- Calls `grid:vote-prep`, `grid:preflight`, `grid:launch`, `grid:status` via `runJsonProbe`
- Does not import or invoke `council-run`
- Does not write `.nexus/` or any other file under any code path
- `council_run_command` field is a plain string populated only when `cockpit_state === READY`;
  it is never passed to `spawnSync` or any execution primitive

This preserves the boundary:

- `grid:vote-prep` remains read-only
- `grid:preflight` remains read-only
- `grid:launch` remains read-only
- `grid:status` remains read-only
- `council-run` remains a separate explicit operator action
- no auto-commit, auto-PR, or automatic governance progression were introduced

---

### 3. Correctness review — defects identified and corrected in-session

An in-session correctness review identified three defects before ratification. All were
corrected before the governance package was written.

**Defect 1 — EXECUTED mapped from BLOCKED_ALREADY_RATIFIED in vote-prep and launch normalizers**

`grid:vote-prep` and `grid:launch` emit `BLOCKED_ALREADY_RATIFIED` for all terminal statuses
(`ratified`, `blocked`, `rejected`, `superseded`, `closed`). The initial implementation mapped
this outcome to `state: "EXECUTED"` in both normalizers. This was incorrect: only `ratified`
implies executed, while the other terminal statuses are genuinely BLOCKED.

Fix: `BLOCKED_ALREADY_RATIFIED` in both normalizers now falls into the `startsWith("BLOCKED_")`
branch, producing `state: "BLOCKED"`. EXECUTED is produced exclusively by `normalizeStatusProbe`.

**Defect 2 — computeCockpitState had no guard for rogue EXECUTED values in non-status stages**

As a consequence of Defect 1, `vote_prep.state` or `launch.state` could be `"EXECUTED"`.
This value was neither UNKNOWN nor BLOCKED, so neither reducer guard fired. The READY check
also failed (requiring all three to be `"READY"`). The reducer fell to INCOMPLETE, producing
a cockpit_state of INCOMPLETE while individual stages reported EXECUTED — a silent
inconsistency. Fix: resolved by Defect 1 fix; EXECUTED no longer appears in non-status stages.

**Defect 3 — READY / EXECUTED positive branches did not require probe.status === 0**

The initial normalizers checked only for a matching success token (e.g., `outcome ===
"VOTE_READY"`) without checking `probe.status`. If a backing command emitted a success token
but exited non-zero, the cockpit would report READY or EXECUTED falsely.

Fix: all four positive branches now require `probe.status !== 0` → downgrade to UNKNOWN with
a diagnostic detail. READY and EXECUTED are only returned when both conditions hold:
`probe.status === 0` AND matching success token.

---

### 4. Validation and status verification

Commands run:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0138/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
pnpm grid:operator --motion motion-0138
pnpm grid:operator --motion motion-0138 --json
```

Observed results:

- `validate-motion` -> pass
- `validate-agency` -> pass
- `typecheck` -> pass
- `grid:operator --motion motion-0138` before ratification -> `INCOMPLETE`
  (`execution_state=EXECUTION_NOT_STARTED`; pre-council stages reflect motion-0138 package state)
- `grid:operator --motion motion-0138 --json` -> valid machine-readable JSON with all five
  stage fields present
- After ratification artifacts present -> `grid:operator --motion motion-0138` -> `EXECUTED`

---

### 5. Ratification closeout

Ratification path for motion-0138 followed the same canonical pattern as motion-0137:

```text
pnpm grid:vote-prep --motion motion-0138 --scaffold
pnpm grid:launch --motion motion-0138   # confirmed LAUNCH_READY
pnpm council:run motion-0138
```

Result:

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

- `motion.yaml` status set to `ratified` to match neighboring settled motions in this
  motion family.
