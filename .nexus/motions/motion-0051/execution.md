# Execution Plan - motion-0051

## Goal
Prove that nonzero differentiated breakdown scores produce expected ranking
and winner determination on a 2-candidate Phase 1 executor panel.

## Plan
1. Populate differentiated scores
   - edit an existing scaffolded selection.json with nonzero breakdown scores
   - ensure one candidate clearly outscores the other
   - pre-calculate expected totals from rubric weights

2. Run panel-run.mjs score
   - confirm recomputed totals match pre-calculated expectations

3. Run panel-select.mjs --verbose
   - confirm ranking order matches expected highest-first
   - confirm winner matches the highest-scoring candidate

4. Record results in proposal.md as the proof artifact

## Files touched
- None. This is a pure behavior-proof motion.
- The differentiated scores were applied to an existing scaffolded
  selection.json for testing purposes only.

## Files explicitly not touched
- `.nexus/agent-panels.yaml`
- `.nexus/model-slots-phase1.yaml`
- `.nexus/model-slots.yaml`
- `portal/scripts/panel-run.mjs`
- `portal/scripts/panel-select.mjs`
- `portal/src/lib/panels/panelSelectCore.mjs`

## Rollback plan
- No code changes to revert.

## Acceptance criteria
- Recomputed totals match pre-calculated expectations exactly
- Ranking order is correct (highest first)
- Winner is the highest-scoring candidate
- No code changes required

## Done means
- Differentiated-score ranking is formally validated on the 2-candidate shape,
- the Phase 1 scoring formula is confirmed to produce expected results,
- and motion-0051 is ratified.
