# Decision - motion-0066

## Status
RATIFIED

## Summary
Motion Factory draft flow now emits `candidate.motion.json` as a real prep-layer
artifact in `.nexus/candidates/<candidate-id>/` and surfaces candidate identity
in apply and preview output.

## Outcome
Approved as a bounded implementation slice. Validation, promotion linkage, and
Waves/UI consumption remain deferred.

## Notes
This motion is intentionally scoped to Candidate Motion consumption and promotion only. It does not expand broad terminal-backed agent execution, does not redefine `candidate.motion` locally, and does not collapse Candidate Motion into either WaveTask or formal Motion.
