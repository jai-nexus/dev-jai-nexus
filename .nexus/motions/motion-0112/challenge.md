# Challenge: Close motion-0037 stale promotion — promote decision.yaml to RATIFIED

**Motion:** motion-0112
**Date:** 2026-03-31

## Authority challenge

**Q: Does a governance-closure motion have authority to promote another motion's
decision.yaml without a new vote on the underlying work?**

The vote on motion-0037 was unanimous (3 yes, 0 no, 0 abstain). The outcome is
PASS in vote.json. This motion does not re-litigate the vote — it records that
the vote already passed and executes the one missing administrative step:
promoting decision.yaml to reflect the vote outcome. The authority is the
existing passing vote, not this motion.

## Necessity challenge

**Q: Is a governed motion needed to edit decision.yaml, or can the correction be
made directly?**

decision.yaml is a canonical governance artifact. Its status field is the
authoritative governance status for the corpus (see motion-0111 status-source
rule). Edits to it require a governed motion to preserve traceability. The
motion-0111 audit explicitly classified this as a P1 action requiring a
governance-closure motion.

## Scope challenge

**Q: Should this motion also close motions 0083, 0092, and 0094 (the other open
motions)?**

No. The other three open motions (0083, 0092, 0094) require writing vote.json,
verify.json, and policy.yaml artifacts — a structurally different repair with
a different risk profile. motion-0037 is bounded to two file edits where all
supporting artifacts already exist. Bundling them would merge two distinct
anomaly types into one motion and increase scope without governance justification.
The audit's normalization action registry explicitly separates P1 (motion-0037)
from P2 (0083/0092/0094).

## Re-verification challenge

**Q: Should validate-motion and validate-agency be re-run against motion-0037
before promoting its status?**

motion-0037's verify.json already records both gates passing as of
2026-03-13T21:06:03. Re-running them as gate evidence for this governance-closure
motion is included in the execution plan. The pass result is not in doubt —
the gates are stable schema and agency validators that have not changed in a way
that would reverse the motion-0037 result.

## Resolution

No blocking challenge identified. Proceed to execution.
