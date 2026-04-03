# Proposal: Close motion-0094 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0116
**Kind:** governance-closure
**Audit reference:** motion-0111 corpus audit, P2 (third and final member)
**Date:** 2026-04-02

## Background

The motion-0111 corpus audit identified three motions in the same anomaly class:
self-unratified governance-closure sweeps (0083, 0092, 0094). These motions
executed legitimate ratification work on other motions but were never themselves
ratified. Their downstream effects are already committed and correct in the corpus.
Their own governance records are incomplete.

motion-0113 closed the first member (motion-0083).
motion-0114 closed the second member (motion-0092).
This motion closes the third and final member: motion-0094.

## What motion-0094 did

motion-0094 ("Bounded OffBook.ai Wave 0 Rollout Closeout Sweep") executed a
governance closeout sweep for motion-0093 (first real OffBook.ai Wave 0 bootstrap
rollout):

- Inspected motion-0093 package and all 12 Wave 0 substrate artifacts in
  `out/offbook-ai/`
- Confirmed all 6 motion-0093 success criteria met
- Resolved the bootstrap-manifest.instance.yaml disposition (known gap, deferred,
  not a blocker)
- Created vote.json, verify.json, policy.yaml for motion-0093
- Promoted motion-0093 decision.yaml and decision.md to RATIFIED

All 5 downstream artifacts for motion-0093 are committed in the repository.
motion-0093 is correctly RATIFIED.

## Anomaly

motion-0094's own governance record was never completed:

| Artifact | State |
|---|---|
| vote.json | **Absent** |
| verify.json | **Absent** |
| policy.yaml | **Absent** |
| decision.yaml | `status: DRAFT`, `ratified_by: null`, notes: "DRAFT: OffBook.ai Wave 0 rollout closeout sweep. Ratifies motion-0093." |
| decision.md | Present — records DRAFT status and downstream evidence |

motion-0094 closed motion-0093 but was never itself closed. This is the third
and final member of the self-unratified closure anomaly family.

## Proposed repair

Write the three missing ratification artifacts and promote decision.yaml:

1. Create `vote.json` — unanimous consent, 3 yes votes, rationale grounded in
   the committed downstream evidence (5 artifacts, motion-0093 RATIFIED)
2. Create `verify.json` — run validate_motion and validate_agency against
   motion-0094's motion.yaml, record results
3. Create `policy.yaml` — risk assessment consistent with governance-closure
   motions of this era
4. Update `decision.yaml` — promote status to RATIFIED, set ratified_by,
   update notes and last_updated
5. Update `decision.md` — add `## Status: RATIFIED` reflecting closure

## Scope

This motion package (motion-0116):

```
.nexus/motions/motion-0116/motion.yaml
.nexus/motions/motion-0116/proposal.md
.nexus/motions/motion-0116/challenge.md
.nexus/motions/motion-0116/execution.md
.nexus/motions/motion-0116/decision.yaml
.nexus/motions/motion-0116/decision.md
```

Repair targets (motion-0094 only — written/edited at execution time):

```
.nexus/motions/motion-0094/vote.json        (create)
.nexus/motions/motion-0094/verify.json      (create)
.nexus/motions/motion-0094/policy.yaml      (create)
.nexus/motions/motion-0094/decision.yaml    (edit: RATIFIED promotion)
.nexus/motions/motion-0094/decision.md      (edit: add status header)
```

This is the final member of the self-unratified closure family. No further
repairs remain in the P2 anomaly class after this motion.
No scripts, runtime, UI, or DB changes.
