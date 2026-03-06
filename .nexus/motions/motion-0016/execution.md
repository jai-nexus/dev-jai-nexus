# Execution Plan (motion-0016)

## Part A — Shared scorer library
- Add `portal/src/lib/panels/panelSelect.ts`
- Update `portal/scripts/panel-select.mjs` to call the lib

## Part B — Viewer UX + server actions
- Add minimal score-entry UI to:
  - set breakdown values per slot/criterion
  - save selection.json
  - compute totals + winner (same lib)

## Part C — Coverage signal
- Extend existing operator coverage surface to show panels discovered/completed/incomplete.

## Evidence
- `pnpm -C portal typecheck` PASS
- CLI:
  - dry-run prints deterministic best/winner
  - --write is idempotent
- UI:
  - enter breakdown scores, save, compute winner
  - viewer reflects totals + winner
- Coverage:
  - page shows counts and links to incomplete panels
