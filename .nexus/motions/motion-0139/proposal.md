# Proposal: JAI Grid Governance Contract Hardening v0

**Motion:** motion-0139
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-20
**Basis:** motion-0138 (JAI Grid Governance Operator Cockpit v0)

---

## Problem

Motions 0134–0138 established a coherent read-only grid governance surface. Two of
the five grid commands — `grid:preflight` and `grid:vote-prep` — call their backing
sub-commands using binary exit-code checks rather than structured JSON probes:

- `grid:preflight` calls `grid:review` without `--json`. When `grid:review` fails,
  the `REVIEW_READY` check detail shows only `"grid:review exited 1"`. The structured
  `verdict` and `failed_check` from the review script are discarded.

- `grid:vote-prep` calls `grid:preflight` without `--json`. When `grid:preflight`
  fails, the `PREFLIGHT_READY` check detail shows only `"grid:preflight exited 1 -
  ..."`. The structured `verdict` and `failed_check` are discarded.

By contrast, `grid:launch` (motion-0136) and `grid:operator` (motion-0138) already
use the `runJsonProbe` / `parseEmbeddedJson` pattern to surface structured failure
reasons. The two older scripts pre-date that pattern.

Additionally, `grid:launch` emits `"pnpm council:run <id>"` in its success `next_step`
while every other grid script emits `"Run pnpm council:run <id>"` — a wording
inconsistency that a future operator surface or parser could interpret differently.

No verified contract documentation exists for any of the five grid commands.

---

## Solution

### Sub-line A — Contract hardening

Upgrade `grid:preflight` and `grid:vote-prep` to surface structured failure reasons
from their backing sub-commands.

**`grid-council-run-preconditions.mjs`:**
- Add `parseEmbeddedJson(stdout)` (verbatim pattern from `grid-launch.mjs`)
- Upgrade `runPnpmGridReview` to append `--json` to the command invocation
- Upgrade `REVIEW_READY` fail detail: when parsed JSON is available, emit
  `"grid:review exited N — verdict=X, failed_check=Y"`; fall back to raw output
  when JSON parse fails

**`grid-vote-prep.mjs`:**
- Add `parseEmbeddedJson(stdout)`
- Upgrade `runPnpmGridPreflight` to append `--json` to the command invocation
- Upgrade `PREFLIGHT_READY` fail detail: when parsed JSON is available, emit
  `"grid:preflight exited N — verdict=X, failed_check=Y"`; fall back to raw output
  when JSON parse fails

### Sub-line B — Verification pack

Add `portal/scripts/fixtures/grid-contracts.json` — a static fixture documenting the
JSON output contract for all five grid commands. Covers one PASS/READY and one
FAIL/BLOCKED representative example per command. Uses `_notes` sibling fields for
annotation.

### Sub-line C — Wording polish

Fix `grid:launch` success `next_step` from `"pnpm council:run <id>"` to
`"Run pnpm council:run <id>"` — a one-string wording alignment with all other grid
scripts.

### Boundary preservation

This motion does not authorize:
- Automatic or implicit invocation of `council-run`
- Any writes to `.nexus/` or governance artifacts
- JSON output schema changes (no new fields, no renamed fields, no type changes)
- Exit code changes for any grid script
- Modification of `grid:launch`, `grid:status`, or `grid:operator` logic
- `package.json` changes
- Portal runtime, database, or cross-repo state mutation

---

## Success criteria

- **SC-1** `grid:preflight --motion X --json` `REVIEW_READY` fail detail includes
  `verdict` and `failed_check` from `grid:review --json` output when parseable
- **SC-2** `grid:vote-prep --motion X --json` `PREFLIGHT_READY` fail detail includes
  `verdict` and `failed_check` from `grid:preflight --json` output when parseable
- **SC-3** Both upgraded scripts fall back to raw stdout/stderr detail when
  `parseEmbeddedJson` returns null
- **SC-4** Exit codes are identical to pre-patch for all five scripts
- **SC-5** JSON output schemas are identical to pre-patch for all five scripts
- **SC-6** `grid:launch --json` success `next_step` starts with `"Run pnpm council:run"`
- **SC-7** `portal/scripts/fixtures/grid-contracts.json` covers all five commands with
  at least one PASS/READY and one BLOCKED/FAIL example each
- **SC-8** `grid:operator --json` composes correctly against the patched upstream scripts
- **SC-9** `validate-motion` passes for `motion-0139`
- **SC-10** `validate-agency` passes for `dev.jai.nexus / dev-jai-nexus`
- **SC-11** `pnpm typecheck` passes

---

## Non-goals

- Automatic or implicit invocation of `council-run`
- JSON output schema changes
- Exit code changes
- Extracting a shared utility module across grid scripts
- Modifying `grid:launch`, `grid:status`, or `grid:operator` logic
- `package.json` changes
- Portal runtime, database, or cross-repo state mutation
- Modifying `council-run.mjs` or any gate script
- Widening into Pi syncd, preserved edge, Live Ops, telemetry, notifications,
  collaboration, onboarding, or generic infra cleanup
- Auto-commit, auto-PR, or automatic governance progression
