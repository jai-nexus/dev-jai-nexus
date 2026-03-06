# Proposal (motion-0016)

## 0.0 Problem
Panels are now selectable via a deterministic CLI runner (motion-0015), but operational usage still has friction:
- scoring is manual JSON editing
- selection logic is trapped in a script (harder to reuse in UI)
- panel completion is not reflected in operator coverage surfaces

## 1.0 Goal
Operationalize panels end-to-end:
1) Extract selection logic into a shared library
2) Add minimal viewer UX to enter scores and compute winner safely
3) Emit a simple “Panels Completed” coverage signal in operator surfaces

## 2.0 Decisions
- Create `portal/src/lib/panels/panelSelect.ts` as the canonical scorer
- Keep CLI (`portal/scripts/panel-select.mjs`) but make it a wrapper calling the lib
- Add server actions to:
  - write breakdown values (clamped 0–10)
  - compute totals and winner (idempotent)
- Define "panel completed" as:
  - selection.winner != "UNKNOWN"
  - evidence_plan.commands is non-empty

## 3.0 Acceptance Criteria
- CLI still works exactly as before (dry-run + --write)
- Viewer allows setting breakdown scores and computing winner without manual file edits
- Operator coverage page shows:
  - total panels
  - completed panels
  - list of incomplete panels linked to viewer
- `pnpm -C portal typecheck` PASS

## 4.0 Non-goals
- No model execution
- No automatic scoring from candidate text
- No DB storage (still filesystem artifacts under .nexus)
