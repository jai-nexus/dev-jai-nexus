# Challenge: Close motion-0083 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0113
**Date:** 2026-04-01

## Authority challenge

**Q: Does a governance-closure motion have authority to write vote.json,
verify.json, and policy.yaml for a motion that has already executed its work?**

Yes, with one condition: the artifacts must reflect a genuine ratification
decision, not a retroactive rubber stamp. In this case:

- motion-0083's work (60 artifacts across 12 motions) is committed and
  inspectable in the repository. The rationale in vote.json can be grounded
  in that committed evidence.
- The vote is being cast now, not backdated. The `last_updated` timestamps
  in the new artifacts reflect the actual ratification date (execution date
  of motion-0113), not the original execution date of motion-0083.
- This is the same pattern used across the broader governed corpus: a motion
  executes work, then a vote cast after inspection closes the record.

## Legitimacy challenge

**Q: Is it appropriate to ratify motion-0083 when its non_goals explicitly
state "Do not create policy/verify/vote artifacts for these motions"?**

That non_goal applies to the 12 motions being swept by motion-0083 (i.e.,
0071–0082), not to motion-0083 itself. motion-0083's own governance record
requires vote.json, verify.json, and policy.yaml to be considered ratified
under the corpus-wide canonical contract. The non_goal does not exempt
motion-0083 from its own ratification requirements.

## Downstream validity challenge

**Q: Does ratifying motion-0083 now retroactively validate or invalidate the
12 motions it closed?**

No. The 12 downstream motions (0071–0082) already have their own complete
ratification artifact sets (decision.yaml RATIFIED, vote.json, verify.json,
policy.yaml, decision.md). Their status is independent of whether motion-0083
itself is ratified. Ratifying motion-0083 closes the governance record for
the sweep motion; it does not re-open or modify any downstream motion.

## Sweep challenge

**Q: Should this motion close all three self-unratified sweeps (0083, 0092,
0094) at once?**

No. Each sweep motion represents a distinct execution context with different
downstream effects and different evidence bases. Bundling them would make the
challenge and rationale in vote.json ambiguous. The audit's P2 action permits
"one sweep motion or three individual motions" — the bounded-motion approach
is cleaner and produces a traceable governance record per closure.

## Validator challenge

**Q: motion-0083's motion.yaml is Family C era (no protocol_version). Will
validate-motion.mjs pass?**

The audit established that Family C motions will pass the current validator
or emit only warnings. The validator is intentionally permissive on older
schema fields. The verify.json for motion-0083 will record the actual gate
output at execution time, including any warnings, and report the exit code.

## Resolution

No blocking challenge identified. Proceed to execution.
