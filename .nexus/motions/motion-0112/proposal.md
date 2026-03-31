# Proposal: Close motion-0037 stale promotion — promote decision.yaml to RATIFIED

**Motion:** motion-0112
**Kind:** governance-closure
**Audit reference:** motion-0111 corpus audit, P1
**Date:** 2026-03-31

## Background

motion-0037 ("Claude Bootstrap Generator v0") completed all ratification steps
except the final decision.yaml promotion. The motion-0111 corpus audit identified
it as the highest-priority open anomaly in the 110-motion corpus.

## Anomaly

motion-0037's decision.yaml still reads:

```yaml
status: DRAFT
ratified_by: null
notes: "PENDING: awaiting vote"
```

The vote was cast and passed on 2026-03-13. All ratification artifacts are present
and correct:

| Artifact | State |
|---|---|
| vote.json | outcome: PASS, 3 yes / 0 no / 0 abstain |
| verify.json | validate_motion ok, validate_agency ok, all_required_ok: true |
| policy.yaml | risk_score: 0.08, required_ok: true, eligible_to_vote: true |
| decision.md | Present (Family C era format) |

The only gap is that the decision.yaml promotion step was never executed.

## Proposed repair

1. Update `decision.yaml` for motion-0037:
   - `status: DRAFT` → `status: RATIFIED`
   - `ratified_by: null` → `ratified_by: "manual:proposer"`
   - `notes` → `"RATIFIED: Claude Bootstrap Generator v0 — unanimous consent, 3 yes votes."`
   - `last_updated` → execution timestamp

2. Update `decision.md` for motion-0037:
   - Add `## Status: RATIFIED` section at the top of the document body

## Scope

Strictly limited to two files in one motion directory:

```
.nexus/motions/motion-0037/decision.yaml
.nexus/motions/motion-0037/decision.md
```

No other motions, scripts, runtime, or UI changes.
