# Challenge (motion-0048)

## Risks
- Reducing candidates from 5 to 2 is a one-way structural change in
  agent-panels.yaml. If a future motion needs to expand back to 5 candidates,
  it would need to re-add slots.
- Relaxing the candidate count check from exactly 5 to 2+ removes a guardrail
  that previously caught misconfigured panels. A panel with 1 candidate would
  now need a different validation path.
- Existing scaffolded panel directories under earlier motions still contain
  5 candidate files. This motion does not retroactively clean those up.

## Objections
- The 5→2 reduction is correct for Phase 1 and matches the ratified staffing
  canon. Expansion back to more candidates would be a future staffing motion,
  not a rollback.
- Relaxing to 2+ rather than exactly 2 is the safer choice — it allows future
  staffing motions to add candidates without changing panel-run.mjs again.
- Legacy 5-candidate scaffold artifacts in older motions are historical and
  do not need retroactive cleanup.

## Mitigations
- The count check `candidates.length < 2` still rejects 0-candidate and
  1-candidate panels, which are never valid.
- All rubrics are preserved unchanged, so scoring logic remains correct
  regardless of candidate count.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.05
