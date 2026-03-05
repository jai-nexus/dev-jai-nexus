# Execution Plan (motion-0015)

## Intended changes
- Add `portal/scripts/panel-select.mjs` (local deterministic selection runner).
- Use rubric weights from `panel.json`.
- Compute totals + winner into `selection.json`.

## Evidence
- pnpm -C portal typecheck PASS
- Run panel-select on the existing builder panel:
  - edit one slot breakdown values in selection.json (nonzero)
  - run `node portal/scripts/panel-select.mjs --motion motion-0010 --panel JAI_DEV_BUILDER_PANEL_V0 --write`
  - open viewer page and confirm:
    - totals are nonzero
    - winner is not UNKNOWN
    - winner row is highlighted
