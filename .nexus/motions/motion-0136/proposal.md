# Proposal: JAI Grid Governance Launch Ergonomics v0

**Motion:** motion-0136
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-16
**Basis:** motion-0135 (JAI Grid Vote Preparation Ergonomics v0)

---

## Problem

Motion-0135 established `grid:vote-prep` as an explicit vote artifact validator and
scaffold generator. That closed the vote preparation seam, but the pre-council operator
flow still requires running four separate commands and mentally aggregating their outputs
before `council:run` can be invoked with confidence:

1. `pnpm grid:review --motion X`
2. `pnpm grid:preflight --motion X`
3. `pnpm grid:vote-prep --motion X`
4. Evaluate all three outputs manually
5. `pnpm council:run X`

Each command has its own output format and its own named outcome. There is no single
command that runs the full upstream chain and emits a unified verdict. An operator who
runs `grid:vote-prep` directly (skipping `grid:preflight`) can reach `VOTE_READY` with
preflight still broken, and there is nothing that catches this before `council:run`.

The remaining seam is exactly one operator step wide: a single consolidated
launch-readiness check that confirms the full upstream chain and tells the operator with
confidence "every prerequisite is satisfied — run `pnpm council:run X` now."

---

## Solution

Introduce `grid:launch` — a single read-only consolidated launch-readiness command that:

1. Runs `grid:review`, `grid:preflight`, and `grid:vote-prep` as read-only sub-probes
   in sequence
2. Short-circuits on the first failure with a named blocked outcome and concrete next-step
3. Emits `LAUNCH_READY` with `pnpm council:run <motion-id>` as the next-step command
   when all checks pass
4. Never invokes `council-run`
5. Never writes to `.nexus/`

### Named outcomes

| Outcome | Trigger |
|---|---|
| `LAUNCH_READY` | All upstream checks pass |
| `BLOCKED_REVIEW_FAILED` | `grid:review` exit non-zero |
| `BLOCKED_PREFLIGHT_FAILED` | `grid:preflight` exit non-zero |
| `BLOCKED_VOTE_NOT_READY` | `grid:vote-prep` exit non-zero or outcome not `VOTE_READY` |
| `BLOCKED_WRONG_STATE` | Motion dir missing or status not pre-council |
| `BLOCKED_ALREADY_RATIFIED` | Motion already in terminal state |

### Internal check sequence

```
DIR_EXISTS      → motion directory present
MOTION_STATE    → motion.yaml status in {proposed, draft, open}
REVIEW_READY    → pnpm grid:review --motion X exits 0
PREFLIGHT_READY → pnpm grid:preflight --motion X exits 0
VOTE_READY      → pnpm grid:vote-prep --motion X exits 0
```

### Boundary preservation

This motion does not authorize:
- Automatic invocation of `council-run`
- Any writes to `.nexus/` or governance artifacts
- Vote scaffolding (that is `grid:vote-prep --scaffold`)
- Modification of `grid:review`, `grid:preflight`, `grid:vote-prep`, or `council-run`
- Portal runtime changes or database changes

---

## Success criteria

- **SC-1** `pnpm grid:launch --motion X` runs all five checks sequentially and emits a
  single named outcome
- **SC-2** `LAUNCH_READY` emits exactly `pnpm council:run <motion-id>` as the next-step
  command
- **SC-3** Each blocked outcome emits the concrete next-step command to fix the blocking
  check
- **SC-4** `--json` emits machine-readable output with contract
  `{ motion_id, outcome, ready, failed_check, checks, next_step }`
- **SC-5** `grid:launch` does not write to `.nexus/` under any flag
- **SC-6** `grid:launch` does not invoke `council-run`
- **SC-7** `grid:review`, `grid:preflight`, `grid:vote-prep`, and `council-run` are not
  modified
- **SC-8** `validate-motion` passes for `motion-0136`
- **SC-9** `validate-agency` passes for `dev.jai.nexus / dev-jai-nexus`
- **SC-10** `pnpm typecheck` passes

---

## Non-goals

- Modifying `grid:review`, `grid:preflight`, `grid:vote-prep`, or `council-run`
- Automatic invocation of `council-run`
- Any writes to `.nexus/` or any governance artifacts
- Vote scaffolding
- Auto-commit, auto-PR, or automatic governance progression
- Portal runtime changes, database changes, cross-repo routing
- Live Ops, telemetry, notifications, collaboration automation
- Pi syncd or preserved edge
- Generic cleanup or adjacent refactors
