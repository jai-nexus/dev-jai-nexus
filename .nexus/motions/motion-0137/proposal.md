# Proposal: JAI Grid Governance Execution Visibility v0

**Motion:** motion-0137
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-16
**Basis:** motion-0136 (JAI Grid Governance Launch Ergonomics v0)

---

## Problem

Motion-0136 established `grid:launch` as a consolidated launch-readiness surface that
confirms the full upstream chain and routes the operator to `pnpm council:run`. That
closed the pre-execution seam, but the post-execution seam remains open.

After `pnpm council:run` completes, four artifact files are written to
`.nexus/motions/{id}/`:

- `decision.yaml` — `status` (RATIFIED/BLOCKED/DRAFT), `vote_mode`, `notes`
- `verify.json` — gate results per name, `summary.required_ok`
- `vote.json` — per-role votes, `outcome.result` (PASS/FAIL/PENDING), `missing_required_roles`
- `policy.yaml` — `risk_score`, `eligible_to_vote`, `recommended_vote`

There is no single command that reads these four files, computes the execution state, and
tells the operator what happened and what to do next. The operator must:

1. Manually open `decision.yaml` to check status
2. Manually open `verify.json` to check gate results
3. Manually open `vote.json` to check vote outcome and missing roles
4. Mentally aggregate all four to determine whether ratification is complete, pending, or
   blocked

Additionally, `decision.yaml status=DRAFT` covers two distinct states — vote PENDING
(missing required roles) and vote not yet evaluated (no `vote.json`) — with no single
command that distinguishes them or guides the operator to the correct fix.

---

## Solution

Introduce `grid:status` — a single read-only command that reads the existing motion-local
artifact set and surfaces a unified named execution state with explicit next-step guidance.

### Named execution states

| State | Trigger |
|---|---|
| `EXECUTION_RATIFIED` | `decision.yaml` exists, `status=RATIFIED` |
| `EXECUTION_BLOCKED` | `decision.yaml` exists, `status=BLOCKED` |
| `EXECUTION_PENDING` | `decision.yaml` exists, `status=DRAFT`, `vote.json` outcome=PENDING |
| `EXECUTION_DRAFT` | `decision.yaml` exists, `status=DRAFT`, `vote.json` absent or unevaluated |
| `EXECUTION_NOT_STARTED` | `decision.yaml` absent |
| `WRONG_STATE` | Motion directory missing |

### What grid:status surfaces

- Decision: status, vote_mode, notes
- Gates: name + pass/fail for each gate in verify.json
- Vote: per-role value, outcome result, missing_required_roles
- Policy: risk_score, eligible_to_vote, recommended_vote
- Single named execution state
- Explicit next-step command for each state

### Boundary preservation

This motion does not authorize:
- Automatic invocation of `council-run`
- Any writes to `.nexus/` or governance artifacts
- Re-evaluation of vote outcomes — reads `vote.json outcome` as written by `council-run`
- Modification of any existing grid tool or `council-run`

---

## Success criteria

- **SC-1** `pnpm grid:status --motion X` emits a named execution state for all six cases
- **SC-2** `EXECUTION_RATIFIED` exits 0; all other states exit 1
- **SC-3** Each state emits a concrete next-step command or "no further action required"
- **SC-4** Human output surfaces decision, gates, vote, and policy summary in one view
- **SC-5** `--json` emits `{ motion_id, execution_state, ready, decision, gates, vote, policy, next_step }`
- **SC-6** `grid:status` does not write to `.nexus/` under any flag
- **SC-7** `grid:status` does not invoke `council-run`
- **SC-8** All existing grid tools and `council-run` are not modified
- **SC-9** `validate-motion` passes for `motion-0137`
- **SC-10** `validate-agency` passes for `dev.jai.nexus / dev-jai-nexus`
- **SC-11** `pnpm typecheck` passes

---

## Non-goals

- Modifying any existing grid tool or `council-run`
- Automatic invocation of `council-run`
- Any writes to `.nexus/` or governance artifacts
- Vote scaffolding — that is `grid:vote-prep --scaffold`
- Re-evaluating vote outcomes — `grid:status` reads what `council-run` wrote
- Auto-commit, auto-PR, or automatic governance progression
- Portal runtime changes, database changes, cross-repo routing
- Live Ops, telemetry, notifications, collaboration automation
- Pi syncd or preserved edge
- Generic cleanup or adjacent refactors
