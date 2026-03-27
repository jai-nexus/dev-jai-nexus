# Decision - motion-0066

## Status
RATIFIED - unanimous consent recorded.

## Summary
Motion ratified to add candidate prep artifact emission to Motion Factory draft flow. The change emits a bounded candidate artifact under `.nexus/candidates/` during draft apply, surfaces candidate identity in output, and preserves the boundary between WaveTask, Candidate Motion, and formal Motion.

## Outcome
Approved by proposer, challenger, and arbiter.

## Notes
Local verification confirmed:
- `node -c portal/scripts/motion-factory.mjs` passed
- `draft --no-api --preview` showed provisional candidate identity and wrote nothing
- `draft --no-api` emitted a candidate artifact under `.nexus/candidates/`
- formal draft creation remained atomic with candidate emission
- no Waves, planner, Work UI, or broad execution expansion was introduced in this slice

Human review remains the ratification authority; this decision records that ratification has now been granted.
