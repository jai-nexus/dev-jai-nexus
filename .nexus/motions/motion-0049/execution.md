# Execution Plan - motion-0049

## Goal
Prove all 5 Phase 1 executor panels scaffold cleanly under the reconciled
structure.

## Plan
1. Run scaffold for all 5 panels under motion-0049
   - JAI_DEV_BUILDER_PANEL_V0
   - JAI_DEV_ARCHITECT_PANEL_V0
   - JAI_DEV_VERIFIER_PANEL_V0
   - JAI_DEV_LIBRARIAN_PANEL_V0
   - JAI_DEV_OPERATOR_PANEL_V0

2. Confirm each scaffold reports:
   - candidates/2 files
   - Merged 10 live slot(s) from model-slots-phase1.yaml
   - No errors

3. Record results in proposal.md as the proof artifact

## Files touched
- None. This is a pure validation motion.
- Scaffold output under `.nexus/motions/motion-0049/panels/` is a side effect
  of running the proof, not a deliberate file change.

## Files explicitly not touched
- `.nexus/agent-panels.yaml`
- `.nexus/model-slots-phase1.yaml`
- `.nexus/model-slots.yaml`
- `.nexus/model-routing.yaml`
- `.nexus/council.config.yaml`
- `portal/scripts/panel-run.mjs`
- `portal/scripts/panel-select.mjs`

## Rollback plan
- No code changes to revert.
- Scaffold artifacts under `.nexus/motions/motion-0049/panels/` can be
  deleted if the motion is rejected.

## Acceptance criteria
- All 5 panels scaffold with 2 candidate files each
- Phase 1 overlay merges 10 live slots for each scaffold run
- No errors
- No code changes required

## Done means
- All 5 Phase 1 executor panels are proven to scaffold correctly,
- the full Phase 1 substrate (canon + consumer + structure) is validated,
- and motion-0049 is ratified.
