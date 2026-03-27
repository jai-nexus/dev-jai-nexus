# Execution Plan - motion-0048

## Goal
Reconcile .nexus/agent-panels.yaml with Phase 1 staffing canon and relax
the candidate count check in panel-run.mjs.

## Plan

1. Edit .nexus/agent-panels.yaml
   - Builder panel: candidates → [SLOT_BUILDER_01, SLOT_BUILDER_02]
   - Architect panel: candidates → [SLOT_ARCHITECT_01, SLOT_ARCHITECT_02]
   - Verifier panel: candidates → [SLOT_VERIFIER_01, SLOT_VERIFIER_02]
   - Librarian panel: candidates → [SLOT_LIBRARIAN_01, SLOT_LIBRARIAN_02]
   - Operator panel: candidates → [SLOT_OPERATOR_01, SLOT_OPERATOR_02]
   - Each selector block: add `status: deferred`
   - Operator panel: move rubric entries out from under selector to correct
     indentation level

2. Edit portal/scripts/panel-run.mjs
   - Line 348: change `candidates.length !== 5` to `candidates.length < 2`
   - Line 349: update die message accordingly

3. Validate
   - Run scaffold for Librarian panel and confirm 2 candidate files emitted
   - Run scaffold for at least one other panel and confirm 2 candidate files
   - Confirm YAML parses cleanly
   - Confirm loadSlots overlay still works

## Files touched
- `.nexus/agent-panels.yaml` (EDIT)
- `portal/scripts/panel-run.mjs` (EDIT — line 348-349 only)

## Files explicitly not touched
- `.nexus/model-slots-phase1.yaml`
- `.nexus/model-slots.yaml`
- `.nexus/model-routing.yaml`
- `.nexus/council.config.yaml`
- `portal/scripts/panel-select.mjs`

## Rollback plan
- Revert `.nexus/agent-panels.yaml` to pre-motion state (5-candidate structure)
- Revert line 348-349 in panel-run.mjs to `candidates.length !== 5`

## Acceptance criteria
- Each panel lists exactly 2 candidates matching Phase 1 slot names
- Each selector includes status: deferred
- Operator rubric is correctly structured
- Scaffold emits 2 candidate files per panel
- loadSlots overlay from motion-0047 continues to work
- All rubrics unchanged

## Done means
- agent-panels.yaml matches the Phase 1 staffing canon,
- scaffold output reflects real Phase 1 slot assignments,
- and motion-0048 is ratified.
