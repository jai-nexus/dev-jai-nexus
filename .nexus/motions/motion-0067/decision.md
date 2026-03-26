# Decision - motion-0067

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory status and context commands now discover and report
candidate prep artifacts emitted under .nexus/candidates/. Read-only
discovery with graceful degradation. Completes the emission/discovery
loop opened by motion-0066.

## What was added
- portal/scripts/motion-factory.mjs (EDIT — enumerateCandidates helper,
  wired into buildStatusSnapshot, statusCommand, buildContext, contextCommand)

## What was proved
| Test | Result |
|------|--------|
| status (human-readable) | PASS — candidate count, most recent, skipped |
| context (human-readable) | PASS — recent candidates alongside motions |
| status --json | PASS — lightweight, most_recent only, no unbounded list |
| intent field name | PASS — matches canonical emitted field |
| skipped_malformed | PASS — reported in both output modes |
| draft/revise/evidence | PASS — unchanged |

## Candidate discovery surface
- `status`: directory, count, skipped_malformed, most_recent
- `context`: recent_candidates (windowed same as recent_motions)
- Both include candidate data in --json output
- Read-only: no writes, no promotion, no lifecycle changes

## Outcome
All three required roles voted YES. No objections, no reservations.
```

---

### Recommended commit message
```
feat(factory): candidate artifact discovery in status and context (motion-0067)
