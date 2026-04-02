# Proposal: Close motion-0092 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0114
**Kind:** governance-closure
**Audit reference:** motion-0111 corpus audit, P2 (second member)
**Date:** 2026-04-02

## Background

The motion-0111 corpus audit identified three motions in the same anomaly class:
self-unratified governance-closure sweeps (0083, 0092, 0094). These motions
executed legitimate ratification work on other motions but were never themselves
ratified. Their downstream effects are already committed and correct in the corpus.
Their own governance records are incomplete.

motion-0113 closed the first member (motion-0083) on this branch.
This motion closes the second member: motion-0092.

## What motion-0092 did

motion-0092 ("Bounded Bootstrap Planning Ratification Sweep") executed a
ratification sweep of 8 motions in the Q3 bootstrap planning program:

- Ratified motion-0085 (WS-A) through motion-0091 (WS-E) in workstream order
- Ratified motion-0084 (umbrella) last
- Created governance artifact sets (vote.json + verify.json + policy.yaml +
  decision.yaml RATIFIED + decision.md RATIFIED) for all 8 motions (40 artifacts)

All 40 downstream artifacts are committed in the repository. The work is complete
and all 8 downstream motions are correctly RATIFIED.

## Anomaly

motion-0092's own governance record was never completed:

| Artifact | State |
|---|---|
| vote.json | **Absent** |
| verify.json | **Absent** |
| policy.yaml | **Absent** |
| decision.yaml | `status: DRAFT`, `ratified_by: null`, notes: "DRAFT: governance closure sweep for motion-0084 planning program. Ratifies motion-0085 through motion-0091 and motion-0084." |
| decision.md | Present — records DRAFT status and downstream evidence |

motion-0092 closed 8 other motions but was never itself closed.

## Proposed repair

Write the three missing ratification artifacts and promote decision.yaml:

1. Create `vote.json` — unanimous consent, 3 yes votes, rationale grounded in
   the committed downstream evidence (40 artifacts, 8 RATIFIED motions)
2. Create `verify.json` — run validate_motion and validate_agency against
   motion-0092's motion.yaml, record results
3. Create `policy.yaml` — risk assessment consistent with governance-closure
   motions of this era
4. Update `decision.yaml` — promote status to RATIFIED, set ratified_by,
   update notes and last_updated
5. Update `decision.md` — add `## Status: RATIFIED` reflecting closure

## Scope

This motion package (motion-0114):

```
.nexus/motions/motion-0114/motion.yaml
.nexus/motions/motion-0114/proposal.md
.nexus/motions/motion-0114/challenge.md
.nexus/motions/motion-0114/execution.md
.nexus/motions/motion-0114/decision.yaml
.nexus/motions/motion-0114/decision.md
```

Repair targets (motion-0092 only — written/edited at execution time):

```
.nexus/motions/motion-0092/vote.json        (create)
.nexus/motions/motion-0092/verify.json      (create)
.nexus/motions/motion-0092/policy.yaml      (create)
.nexus/motions/motion-0092/decision.yaml    (edit: RATIFIED promotion)
.nexus/motions/motion-0092/decision.md      (edit: add status header)
```

No other motions edited. motion-0094 is the same anomaly class but is handled
by a separate bounded motion on this branch.
No scripts, runtime, UI, or DB changes.
