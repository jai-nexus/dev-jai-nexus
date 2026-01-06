# WaveRun 5 Plan (2026-Q1 / wave 0)

## Objectives
- Confirm registry snapshot + hash gate
- Apply wave transitions + persist artifacts
- Verify build + smoke checks
- Ensure SotEvents emitted and reportable

## Steps
1. Apply WaveRun 5
2. Advance through states to COMPLETE
3. Run wave-run-report and confirm:
   - agentRuns populated
   - artifacts created
   - sotEvents emitted
   - gates satisfied

## Acceptance Criteria
- WaveRun 5 reaches COMPLETE
- report shows non-empty sotEvents + artifacts
- no gate failures
