# Proposal: JAI Grid Vote Preparation Ergonomics v0

**Motion:** motion-0135
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-15
**Basis:** motion-0134 (JAI Grid Council-Run Preconditions v0)

---

## Problem

Motion-0134 established an explicit precondition contract for the operator handoff into
`pnpm council:run`. That contract includes a check for `vote.json` presence, but only
warns when it is absent — it does not block, scaffold, or validate structure.

The remaining manual seam is:

1. `grid:preflight` passes even when `vote.json` is absent, routing the operator directly
   to `pnpm council:run`
2. `council-run` enters PENDING silently when required roles are missing from `vote.json`
3. The required roles, valid vote values, and correct `vote.json` schema exist in
   `council.config.yaml` and `council-run.mjs` internals but are not exposed at the
   operator surface
4. Operators currently derive `vote.json` structure from prior motion artifacts (tribal
   knowledge), not from a repo-local ergonomic tool
5. There is no pre-run structural validation of an existing `vote.json` before `council-run`

The gap is exactly one operator seam wide: between `grid:preflight PASS` and
`pnpm council:run`.

---

## Solution

Introduce `grid:vote-prep` — a bounded read-only validator and optional scaffold generator
for `vote.json` artifacts. This closes the undocumented seam without automating governance
progression.

### Behavior

**Read-only mode (default):**
- Validates motion state is eligible for vote preparation
- Checks `vote.json` presence
- If present: validates structure (required roles, valid vote values, vote_mode consistency)
- Emits a named outcome and explicit operator next-step guidance

**Scaffold mode (`--scaffold`):**
- Writes a correctly-structured `vote.json` template with required roles sourced from
  `.nexus/council.config.yaml` and empty `"vote": ""` placeholders
- Operator fills vote values explicitly; no auto-population

### Named outcomes

| Outcome | Trigger |
|---|---|
| `VOTE_READY` | vote.json present, structurally valid, all required roles have valid vote values |
| `BLOCKED_MISSING_VOTE` | vote.json absent |
| `BLOCKED_MALFORMED_VOTE` | vote.json present but structurally invalid |
| `BLOCKED_WRONG_STATE` | motion status not eligible or preflight not passed |
| `BLOCKED_ALREADY_RATIFIED` | motion already ratified, blocked, or rejected |

### Boundary preservation

This motion does not authorize:
- Automatic invocation of `council-run`
- Auto-population of vote values
- Silent writes to `.nexus/` — scaffold only writes with explicit `--scaffold` flag
- Modification of `grid:review`, `grid:preflight`, or `council-run`
- Portal runtime changes or database changes

---

## Success criteria

- **SC-1** `pnpm grid:vote-prep --motion X` emits a named outcome for all five cases
- **SC-2** `--scaffold` writes a structurally valid `vote.json` template; vote values are
  empty placeholders that the operator must fill
- **SC-3** `--scaffold` does not overwrite an existing `vote.json` without `--force`
- **SC-4** Required roles are sourced from `.nexus/council.config.yaml` at runtime,
  not hardcoded
- **SC-5** `--json` emits machine-readable output consistent with `grid:review` and
  `grid:preflight` conventions
- **SC-6** `grid:review`, `grid:preflight`, and `council-run` are not modified
- **SC-7** `validate-motion` passes for `motion-0135`
- **SC-8** `validate-agency` passes for `dev.jai.nexus / dev-jai-nexus`
- **SC-9** `pnpm typecheck` passes

---

## Non-goals

- Modifying `grid:review`, `grid:preflight`, or `council-run`
- Auto-populating vote values
- Validating vote outcomes (pass/fail) — that belongs to `council-run`
- Automatic ratification or governance progression
- Portal runtime changes, database changes, cross-repo routing
- Telemetry, notifications, collaboration automation
- Pi syncd or preserved edge
- Generic cleanup or adjacent refactors
