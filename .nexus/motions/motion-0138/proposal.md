# Proposal: JAI Grid Governance Operator Cockpit v0

**Motion:** motion-0138
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-20
**Basis:** motion-0137 (JAI Grid Governance Execution Visibility v0)

---

## Problem

Motions 0134–0137 established four individual grid commands — `grid:preflight`,
`grid:vote-prep`, `grid:launch`, and `grid:status` — each addressing one stage of the
governance progression. Each command is self-contained and correct for its stage, but
the operator has no single surface that shows the full progression at once.

To understand where a motion stands, the operator must:

1. Run `grid:vote-prep --motion X` to check vote artifact readiness
2. Run `grid:preflight --motion X` to check council-run preconditions
3. Run `grid:launch --motion X` to confirm consolidated pre-council readiness
4. Run `grid:status --motion X` to check post-execution state
5. Mentally aggregate all four outputs to determine the overall progression state

There is no single command that composes these four stages, normalizes their outputs
into a unified progression state, and routes the operator to the correct next action.

---

## Solution

Introduce `grid:operator` — a read-only operator cockpit that calls all four grid
commands with `--json`, normalizes their outputs into five canonical progression states,
and surfaces the next concrete step in a single view.

### Cockpit progression states

| State | Meaning |
|---|---|
| `READY` | All pre-council gates pass; `pnpm council:run` boundary shown explicitly |
| `BLOCKED` | One or more stages have a hard blocking condition |
| `INCOMPLETE` | Stages are in progress or not yet started |
| `EXECUTED` | `grid:status` reports `EXECUTION_RATIFIED` with `probe.status === 0` |
| `UNKNOWN` | One or more probes returned no readable output |

### What grid:operator surfaces

- Per-stage normalized state (vote-prep, preflight, launch, status)
- Per-stage detail and next-step from the backing command's JSON output
- Top-level cockpit state computed from all four stages
- Explicit council-run boundary when `cockpit_state === READY`
- Single `next_step` field pointing to the correct next action

### State computation rules

- `EXECUTED` requires `grid:status` probe to return both `probe.status === 0` AND
  `execution_state === EXECUTION_RATIFIED`
- `READY` requires all three pre-council probes (vote-prep, preflight, launch) to return
  both `probe.status === 0` AND their respective success token
- `EXECUTED` takes precedence over all other states; if `grid:status` is EXECUTED the
  cockpit is EXECUTED regardless of pre-council stage states
- `UNKNOWN` takes precedence over `BLOCKED`; `BLOCKED` takes precedence over `READY`

### Boundary preservation

This motion does not authorize:

- Automatic or implicit invocation of `council-run`
- Any writes to `.nexus/` or governance artifacts
- Mutation of portal runtime, database, or cross-repo state
- Modification of any existing grid tool or `council-run`
- Widening into Pi syncd, preserved ~edge, Live Ops, telemetry, notifications, or
  collaboration surfaces

---

## Success criteria

- **SC-1** `pnpm grid:operator --motion X` emits a cockpit state for all five cases
- **SC-2** `READY` exits 0; `EXECUTED` exits 0; `BLOCKED`/`INCOMPLETE`/`UNKNOWN` exit 1
- **SC-3** `READY` surfaces `pnpm council:run X` as a boundary label, never as an invocation
- **SC-4** `EXECUTED` is only reachable when `grid:status` probe returns `probe.status === 0`
  AND `execution_state === EXECUTION_RATIFIED`
- **SC-5** `READY` is only reachable when all three pre-council probes return `probe.status === 0`
  AND their respective success tokens
- **SC-6** `EXECUTED` is not reachable from vote-prep or launch `BLOCKED_ALREADY_RATIFIED` signals
- **SC-7** `--json` emits `{ motion_id, cockpit_state, council_run_ready, council_run_command, stages, next_step }`
- **SC-8** `grid:operator` does not invoke `council-run` under any code path
- **SC-9** `grid:operator` does not write to `.nexus/` or any other path under any flag
- **SC-10** All backing grid scripts and `council-run` are not modified
- **SC-11** `validate-motion` passes for `motion-0138`
- **SC-12** `validate-agency` passes for `dev.jai.nexus / dev-jai-nexus`
- **SC-13** `pnpm typecheck` passes

---

## Non-goals

- Automatic or implicit invocation of `council-run`
- Any writes to `.nexus/` or governance artifacts
- Portal runtime changes, database changes, cross-repo routing
- Modifying any existing grid tool or `council-run`
- Live Ops, telemetry, notifications, collaboration automation
- Pi syncd or preserved edge
- Generic cleanup or adjacent refactors to backing scripts
- Introducing shared utility modules between grid scripts
