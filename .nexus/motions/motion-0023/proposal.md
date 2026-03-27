# Proposal (motion-0023)

## 0.0 Problem
We currently treat panel completion as:

- COMPLETE = winner ≠ UNKNOWN AND evidence_plan.commands non-empty

That definition is fine, but the UI cannot explain *why* a panel is incomplete. Operators end up hunting through selection.json to infer whether we’re missing:
- scores
- winner computation
- evidence commands
- or the artifacts are malformed/missing

This slows down workflows and blocks “at scale” panel execution.

## 1.0 Goal
Introduce deterministic progress codes + reasons derived from panel artifacts, and surface them consistently in:
- Panels index (/operator/panels)
- Coverage (/operator/registry/coverage)
- Panel Viewer (/operator/panels/<motion>/<panel>)

## 2.0 Solution
1) Add a shared, deterministic helper:
   - portal/src/lib/panels/panelProgress.ts
   - computes `status` + `reason` from selection.json

2) Extend panels index data:
   - add progress_status + progress_reason
   - optional filter by progress status

3) Display progress status consistently:
   - Panels index table shows progress badge (with tooltip reason)
   - Coverage shows “needs attention” list sorted by severity
   - Panel Viewer shows status + reason in the Selection card

## 3.0 Acceptance
- /operator/panels shows progress badge + reason tooltip for each discovered panel
- /operator/registry/coverage shows deterministic “needs attention” list based on progress severity
- /operator/panels/<motion>/<panel> shows status + reason (no guessing)
- pnpm -C portal typecheck PASS

## 4.0 Non-goals
- No changes to scoring automation
- No new selection artifacts written automatically
- No changes to the definition of “COMPLETE” (still winner + evidence commands)
