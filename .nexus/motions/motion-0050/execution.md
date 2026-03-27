# Execution Plan - motion-0050

## Goal
Prove that the existing selection/scoring path operates correctly on
2-candidate Phase 1 executor panels.

## Plan
1. Run panel-run.mjs score on a scaffolded 2-candidate panel
   - confirm totals recompute without error
   - confirm both slots reported

2. Run panel-select.mjs dry-run on a scaffolded 2-candidate panel
   - confirm slots=2
   - confirm winner=UNKNOWN with zero scores

3. Run panel-select.mjs --force-winner on a scaffolded 2-candidate panel
   - confirm winner is selected via tiebreak
   - confirm no errors

4. Inspect panelSelectCore.mjs computeSelection
   - confirm no hardcoded candidate count
   - confirm scoring iterates dynamically over Object.keys(scores)
   - confirm no _03/_04/_05 references

5. Record results in proposal.md as the proof artifact

## Files touched
- None. This is a pure behavior-proof motion.

## Files explicitly not touched
- `.nexus/agent-panels.yaml`
- `.nexus/model-slots-phase1.yaml`
- `.nexus/model-slots.yaml`
- `.nexus/model-routing.yaml`
- `portal/scripts/panel-run.mjs`
- `portal/scripts/panel-select.mjs`
- `portal/src/lib/panels/panelSelectCore.mjs`

## Rollback plan
- No code changes to revert.

## Acceptance criteria
- score, select, and force-winner all execute without error on 2-candidate panels
- panelSelectCore.mjs confirmed shape-agnostic
- No code changes required

## Done means
- The Phase 1 selection/scoring path is formally validated on the 2-candidate shape,
- behavior proof extends the governed confirmation beyond scaffold parity,
- and motion-0050 is ratified.
