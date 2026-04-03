# Proposal: Close motion-0111 audit baseline — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0117
**Kind:** governance-closure
**Date:** 2026-04-02

## Background

motion-0111 ("Motion corpus audit — schema family classification and
normalization inventory") established the canonical governance baseline for
the dev-jai-nexus motion corpus as of 2026-03-31. It produced
`.nexus/docs/motion-corpus-audit.md`, which:

- Classified 110 motions (0001–0110) across 4 schema families
- Identified 4 truly open motions (0037, 0083, 0092, 0094) as the
  normalization action registry
- Stated the canonical forward contract for Family D motions
- Established the status-source rule: `decision.yaml` is the authoritative
  status surface, not `motion.yaml`

The bounded repair motions that followed all used motion-0111 as their audit
baseline:

- motion-0112 — repaired motion-0037 (stale draft promotion, P1)
- motion-0113 — repaired motion-0083 (self-unratified closure, P2 first)
- motion-0114 — repaired motion-0092 (self-unratified closure, P2 second)
- motion-0116 — repaired motion-0094 (self-unratified closure, P2 third/final)

All four normalization targets from the audit are now closed.

## Anomaly

motion-0111 itself was never ratified. Its own governance record is incomplete:

| Artifact | State |
|---|---|
| vote.json | **Absent** |
| verify.json | **Absent** |
| policy.yaml | **Absent** |
| decision.yaml | `status: DRAFT`, `ratified_by: null` |
| decision.md | Present — DRAFT header |

The audit canon was used by four downstream repair motions, but the audit
motion itself has no closure artifacts. This is the final governance gap in
the Q2 normalization arc.

## Proposed repair

Write the three missing ratification artifacts and promote decision.yaml:

1. Create `vote.json` — unanimous consent, 3 yes votes, rationale grounded in
   the committed audit document and the four downstream repair motions that
   validated its findings
2. Create `verify.json` — run validate_motion and validate_agency against
   motion-0111's motion.yaml, record results
3. Create `policy.yaml` — risk assessment consistent with documentation motions
4. Update `decision.yaml` — promote status to RATIFIED, set ratified_by,
   update notes and last_updated
5. Update `decision.md` — add `## Status: RATIFIED` reflecting closure

## Scope

This motion package (motion-0117):

```
.nexus/motions/motion-0117/motion.yaml
.nexus/motions/motion-0117/proposal.md
.nexus/motions/motion-0117/challenge.md
.nexus/motions/motion-0117/execution.md
.nexus/motions/motion-0117/decision.yaml
.nexus/motions/motion-0117/decision.md
```

Repair targets (motion-0111 only — written/edited at execution time):

```
.nexus/motions/motion-0111/vote.json        (create)
.nexus/motions/motion-0111/verify.json      (create)
.nexus/motions/motion-0111/policy.yaml      (create)
.nexus/motions/motion-0111/decision.yaml    (edit: RATIFIED promotion)
.nexus/motions/motion-0111/decision.md      (edit: add status header)
```

`.nexus/docs/motion-corpus-audit.md` is NOT edited — it is the canonical
artifact that motion-0111 produced and remains correct as-is.
No scripts, runtime, UI, or DB changes.
After this motion, the repo reaches a clean pause baseline: all four
normalization targets closed, the audit baseline itself ratified.
