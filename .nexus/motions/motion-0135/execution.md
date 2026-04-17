# Execution: JAI Grid Vote Preparation Ergonomics v0

**Motion:** motion-0135
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

- `portal/scripts/grid-vote-prep.mjs`
  - Read-only vote artifact validator plus explicit scaffold writer when requested
  - Supported flags:
    - `--motion <motion-id>`
    - `--json`
    - `--scaffold`
    - `--help`
  - Default read-only checks:
    1. `DIR_EXISTS`
    2. `MOTION_STATE`
    3. `COUNCIL_CONFIG`
    4. `PREFLIGHT_READY`
    5. `VOTE_ARTIFACT`
    6. `VOTE_JSON_PARSE`
    7. `VOTE_JSON_SCHEMA`
  - Named outcomes:
    - `VOTE_READY`
    - `BLOCKED_MISSING_VOTE`
    - `BLOCKED_MALFORMED_VOTE`
    - `BLOCKED_WRONG_STATE`
    - `BLOCKED_ALREADY_RATIFIED`
  - JSON contract:
    - `{ motion_id, outcome, ready, failed_check, checks, next_step }`
  - Implementation detail:
    - reads motion package files only in default mode
    - reads `required_roles` and `vote_mode` from `.nexus/council.config.yaml`
    - invokes `pnpm grid:preflight --motion <motion-id>`
    - validates `vote.json` shape and role coverage
    - writes `vote.json` only when `--scaffold` is explicitly requested and the file is absent
    - scaffold uses empty `vote` placeholders only
    - never invokes `council-run`

### Modified files (actual)

- `package.json`
  - Added root alias:
    - `"grid:vote-prep": "node portal/scripts/grid-vote-prep.mjs"`

### Unchanged

- `portal/scripts/grid-review-motion-package.mjs` - untouched
- `portal/scripts/grid-council-run-preconditions.mjs` - untouched
- `portal/scripts/council-run.mjs` - untouched
- `portal/scripts/validate-motion.mjs` - untouched
- `portal/scripts/validate-agency.mjs` - untouched
- All portal runtime files - untouched
- All database and cross-repo paths - untouched

---

## Evidence log

### 1. Implementation landed in exactly two product files

- Added `portal/scripts/grid-vote-prep.mjs`
- Modified `package.json`

No portal runtime files, no governance runner files, and no database paths were modified
for the slice-1 feature itself.

---

### 2. Vote-prep remains read-only by default

Inspection result:

- Imports only `fs`, `path`, `process`, `child_process`, `js-yaml`
- Default mode uses `fs.existsSync`, `fs.statSync`, `fs.readFileSync`
- Uses `spawnSync` only for `pnpm grid:preflight`
- Does not import or invoke `council-run`
- Writes only when `--scaffold` is explicitly requested and `vote.json` is absent

This preserves the boundary:

- `grid:review` remains read-only
- `grid:preflight` remains read-only
- `grid:vote-prep` remains read-only by default
- `council-run` remains a separate explicit operator action
- no auto-commit, auto-PR, or automatic governance progression were introduced

---

### 3. Validation and blocked/ready verification

Commands:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0135/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
pnpm grid:vote-prep --motion motion-0135
pnpm grid:vote-prep --motion motion-0135 --json
pnpm grid:vote-prep --motion motion-0135 --scaffold
```

Observed results:

- `validate-motion` -> pass
- `validate-agency` -> pass
- `typecheck` -> pass
- `grid:vote-prep` before scaffold -> `BLOCKED_MISSING_VOTE`
- `grid:vote-prep --json` -> valid machine-readable JSON
- `grid:vote-prep --scaffold` -> wrote a structurally valid `vote.json` template with empty
  vote placeholders and then remained blocked until values were filled

---

### 4. Structural blocked-path verification

Read-only probes confirmed the explicit blocked cases:

- Missing motion directory:
  - `pnpm grid:vote-prep --motion motion-9999`
  - result: `BLOCKED_WRONG_STATE`
- Already ratified:
  - `pnpm grid:vote-prep --motion motion-0134`
  - result: `BLOCKED_ALREADY_RATIFIED`
- Missing required role:
  - simulated by removing `arbiter` from scaffolded `motion-0135/vote.json`
  - result: `BLOCKED_MALFORMED_VOTE`
- Invalid vote value:
  - simulated by setting one vote to `maybe`
  - result: `BLOCKED_MALFORMED_VOTE`
- Valid vote file:
  - simulated on `motion-0135/vote.json` with required roles present and allowed vote values
  - result: `VOTE_READY`

Additional repo observation:

- Some older historical `vote.json` artifacts do not match the current strict `0.2` /
  `0.3.8` / `required_roles[]` contract and are correctly flagged as malformed by the new
  validator.

---

### 5. Scaffold behavior

`--scaffold` only writes when explicitly invoked.

- When `vote.json` is absent:
  - writes template with:
    - `motion_id`
    - `version`
    - `protocol_version`
    - `vote_mode`
    - `required_roles`
    - one `votes[]` entry per required role
    - empty `vote` placeholders
- When `vote.json` is already present:
  - no overwrite occurs

---

### 6. Ratification closeout

Canonical ratification path executed:

```text
pnpm council:run motion-0135
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

- Ran `pnpm grid:vote-prep --motion motion-0135 --scaffold`
- Filled explicit vote values in `.nexus/motions/motion-0135/vote.json`
- Verified `pnpm grid:vote-prep --motion motion-0135` -> `VOTE_READY`
- Re-ran the same canonical command:

```text
pnpm council:run motion-0135
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
