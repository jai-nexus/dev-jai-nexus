# Decision - motion-0047

## Status
RATIFIED — unanimous consent.

## Summary
The existing slot-resolution surface in `portal/scripts/panel-run.mjs` now reads `.nexus/model-slots-phase1.yaml` and merges live Phase 1 slots over legacy placeholders. The Librarian panel is the first proven consumer of the Phase 1 staffing canon.

## What was changed
- `portal/scripts/panel-run.mjs`
  - extended `loadSlots()` with a Phase 1 overlay that additively merges live slots from `.nexus/model-slots-phase1.yaml` over legacy slots from `.nexus/model-slots.yaml`

## What was proved
- Librarian panel scaffold resolves:
  - `SLOT_LIBRARIAN_01` → `anthropic / claude-haiku-4-5`
  - `SLOT_LIBRARIAN_02` → `openai / gpt-5-mini`
- All 10 live Phase 1 slots merged successfully
- No config files were modified
- No selector logic was activated
- The scaffold still produced 5 candidate files because `.nexus/agent-panels.yaml` remains unchanged in this motion; panel structure reconciliation is deferred

## Outcome
All three required roles voted YES. No objections, no reservations.

## Follow-up
- Wire remaining panels (Architect, Builder, Verifier, Operator) in subsequent motions
- Reconcile `agent-panels.yaml` candidate counts (5 → 2) in a future panel-structure motion
