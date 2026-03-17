# Decision - motion-0048

## Status
RATIFIED — unanimous consent.

## Summary
`.nexus/agent-panels.yaml` is now reconciled with the Phase 1 staffing canon.
Each panel lists 2 candidates matching the live slots in
`model-slots-phase1.yaml`. Selector slots are explicitly marked deferred.
The Operator panel YAML structure bug is fixed.

## What was changed
- `.nexus/agent-panels.yaml` — 5→2 candidates per panel, `status: deferred`
  on all selectors, Operator rubric moved to correct indentation level
- `portal/scripts/panel-run.mjs` — exact-5 candidate guard relaxed to 2+

## What was proved
- Librarian scaffold: `candidates/2 files`
- Builder scaffold: `candidates/2 files`
- Phase 1 overlay: `Merged 10 live slot(s) from model-slots-phase1.yaml`
- No secondary fixed-shape assumptions found in panel-select.mjs or panelSelectCore.mjs

## Outcome
All three required roles voted YES. No objections, no reservations.

## Follow-up
- Historical scaffold artifacts under earlier motions retain 5-candidate files; no retroactive cleanup.
