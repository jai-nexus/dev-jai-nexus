# Challenge: Close motion-0094 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0116
**Date:** 2026-04-02

## Authority challenge

**Q: Does a governance-closure motion have authority to write vote.json,
verify.json, and policy.yaml for a motion that has already executed its work?**

Yes, with one condition: the artifacts must reflect a genuine ratification
decision, not a retroactive rubber stamp. In this case:

- motion-0094's work (5 artifacts for motion-0093) is committed and
  inspectable in the repository. The rationale in vote.json can be grounded
  in that committed evidence.
- The vote is being cast now, not backdated. The `last_updated` timestamps
  in the new artifacts reflect the actual ratification date (execution date
  of motion-0116), not the original execution date of motion-0094.
- This is the same pattern established by motion-0113 (closing motion-0083)
  and motion-0114 (closing motion-0092).

## Legitimacy challenge

**Q: Is motion-0094's own challenge.md fully resolved?**

Yes. The challenge.md for motion-0094 raised one objection (C-1): whether
ratifying motion-0093 without bootstrap-manifest.instance.yaml was honest
closure. Resolved: the 12 Wave 0 substrate artifacts are present and verified;
the manifest instance is a generator output record, not a substrate artifact;
the gap was known since motion-0089 and explicitly accepted. Verdict:
"no blocking objections."

## Downstream validity challenge

**Q: Does ratifying motion-0094 now retroactively validate or invalidate
motion-0093?**

No. motion-0093 already has its own complete ratification artifact set
(decision.yaml RATIFIED, vote.json, verify.json, policy.yaml, decision.md).
Its status is independent of whether motion-0094 itself is ratified.
Ratifying motion-0094 closes the governance record for the sweep motion; it
does not re-open or modify motion-0093.

## Completeness challenge

**Q: Is this the final member of the self-unratified closure family? Are
there other members not identified by the audit?**

The motion-0111 corpus audit explicitly named three members: 0083, 0092, 0094.
motion-0113 closed 0083. motion-0114 closed 0092. This motion closes 0094.
The audit is the baseline. No additional members are named. This motion
completes the P2 anomaly family.

## Validator challenge

**Q: motion-0094's motion.yaml is Family C era (no top-level protocol_version).
Will validate-motion.mjs pass?**

The audit established that Family C motions pass the current validator or emit
only warnings. Exit code 0 = ok: true regardless of warnings. The verify.json
will record the actual gate output and exit code.

## Resolution

No blocking challenge identified. Proceed to execution.
