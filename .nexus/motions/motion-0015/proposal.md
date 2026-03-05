# Proposal (motion-0015)

## 0.0 Problem
Panels are scaffolded with a rubric and a durable selection record, and the viewer renders scores,
but the system does not yet provide a deterministic “compute + select” step to turn scored breakdowns
into totals and a winner.

## 1.0 Goal
Add a local, deterministic panel selection runner that:
- reads panel.json rubric weights
- reads selection.json breakdown scores (0–10)
- computes totals (0–100) using the canonical formula
- chooses a winner deterministically (highest total; tie-break by slot name)
- writes selection.json updates without touching anything else

## 2.0 Solution
Add `portal/scripts/panel-select.mjs`:
- bounded to `.nexus/motions/<motionId>/panels/<panelId>/`
- safe id validation (no traversal)
- default dry-run, `--write` to persist

## 3.0 Acceptance
- A panel with nonzero breakdown scores produces nonzero totals and a non-UNKNOWN winner.
- Winner selection rule is deterministic and stable across reruns.
- `pnpm -C portal typecheck` PASS
- Viewer shows the computed totals and highlights the winner.

## 4.0 Non-goals
- No model execution / no candidate generation
- No rubric inference from candidate text
- No network calls
