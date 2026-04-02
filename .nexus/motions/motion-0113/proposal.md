# Proposal: Close motion-0083 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0113
**Kind:** governance-closure
**Audit reference:** motion-0111 corpus audit, P2 (first member)
**Date:** 2026-04-01

## Background

The motion-0111 corpus audit identified three motions in the same anomaly class:
self-unratified governance-closure sweeps (0083, 0092, 0094). These motions
executed legitimate ratification work on other motions but were never themselves
ratified. Their downstream effects are already committed and correct in the corpus.
Their own governance records are incomplete.

This motion closes the first member of that family: motion-0083.

## What motion-0083 did

motion-0083 ("bounded governed loop ratification sweep") executed a ratification
sweep of 12 motions in the Q2 governed loop activation arc:
- Ratified motion-0072 through motion-0082 in workstream sequence order
- Ratified motion-0071 last as the umbrella program motion
- Created 60 governance artifact files (decision.yaml + decision.md + vote.json +
  verify.json + policy.yaml for each of the 12 motions)

All 60 downstream artifacts are committed in the repository. The work is complete
and the downstream motions are correctly RATIFIED.

## Anomaly

motion-0083's own governance record was never completed:

| Artifact | State |
|---|---|
| vote.json | **Absent** |
| verify.json | **Absent** |
| policy.yaml | **Absent** |
| decision.yaml | `status: DRAFT`, `ratified_by: null`, notes: "DRAFT: ratification sweep implemented locally; 12 motions ratified." |
| decision.md | Present — records DRAFT status and downstream evidence |

motion-0083 closed 12 other motions but was never itself closed.

## Proposed repair

Write the three missing ratification artifacts and promote decision.yaml:

1. Create `vote.json` — unanimous consent, 3 yes votes, rationale grounded in
   the committed downstream evidence (60 artifacts, 12 RATIFIED motions)
2. Create `verify.json` — run validate_motion and validate_agency against
   motion-0083's motion.yaml, record results
3. Create `policy.yaml` — risk assessment consistent with governance-closure
   motions of this era
4. Update `decision.yaml` — promote status to RATIFIED, set ratified_by,
   update notes and last_updated
5. Update `decision.md` — add `## Status: RATIFIED` reflecting closure

## Scope

This motion package (motion-0113):

```
.nexus/motions/motion-0113/motion.yaml
.nexus/motions/motion-0113/proposal.md
.nexus/motions/motion-0113/challenge.md
.nexus/motions/motion-0113/execution.md
.nexus/motions/motion-0113/decision.yaml
.nexus/motions/motion-0113/decision.md
```

Repair targets (motion-0083 only — written/edited at execution time):

```
.nexus/motions/motion-0083/vote.json        (create)
.nexus/motions/motion-0083/verify.json      (create)
.nexus/motions/motion-0083/policy.yaml      (create)
.nexus/motions/motion-0083/decision.yaml    (edit: RATIFIED promotion)
.nexus/motions/motion-0083/decision.md      (edit: add status header)
```

No other motions edited. motion-0092 and motion-0094 are the same anomaly class
but are handled by separate bounded motions on this branch.
No scripts, runtime, UI, or DB changes.
