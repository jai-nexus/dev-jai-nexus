# Challenge: Close motion-0092 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0114
**Date:** 2026-04-02

## Authority challenge

**Q: Does a governance-closure motion have authority to write vote.json,
verify.json, and policy.yaml for a motion that has already executed its work?**

Yes, with one condition: the artifacts must reflect a genuine ratification
decision, not a retroactive rubber stamp. In this case:

- motion-0092's work (40 artifacts across 8 motions) is committed and
  inspectable in the repository. The rationale in vote.json can be grounded
  in that committed evidence.
- The vote is being cast now, not backdated. The `last_updated` timestamps
  in the new artifacts reflect the actual ratification date (execution date
  of motion-0114), not the original execution date of motion-0092.
- This is the same pattern established by motion-0113 closing motion-0083.

## Legitimacy challenge

**Q: Is motion-0092's own challenge.md fully resolved?**

Yes. The challenge.md for motion-0092 raised two objections:

1. C-1 (motion.yaml status field not updated) — resolved: repo convention
   keeps motion.yaml at "proposed"; decision.yaml is the authoritative status.
2. C-2 (execution.handoff.json and execution.receipt.json absent) — resolved:
   planning-only motions (0084–0091) involve no executor handoff; omitting
   them is correct.

Both are resolved with "Accepted" verdicts in the original challenge.md.

## Downstream validity challenge

**Q: Does ratifying motion-0092 now retroactively validate or invalidate the
8 motions it closed?**

No. The 8 downstream motions (0084–0091) already have their own complete
ratification artifact sets (decision.yaml RATIFIED, vote.json, verify.json,
policy.yaml, decision.md). Their status is independent of whether motion-0092
itself is ratified. Ratifying motion-0092 closes the governance record for
the sweep motion; it does not re-open or modify any downstream motion.

## Sweep challenge

**Q: Should this motion close motion-0092 and motion-0094 together?**

No. Each sweep motion represents a distinct execution context with different
downstream effects and different evidence bases. motion-0092 closed the
motion-0084 bootstrap planning program (motions 0084–0091). motion-0094
closed a different program. Bundling them would make the vote rationale
ambiguous. The bounded-motion approach produces a traceable governance record
per closure, as established by motion-0113.

## Validator challenge

**Q: motion-0092's motion.yaml is Family C/D era (non-standard structure,
no top-level protocol_version). Will validate-motion.mjs pass?**

The audit established that Family C/D boundary motions pass the current
validator or emit only warnings. The validator is intentionally permissive
on older schema fields. The verify.json will record the actual gate output
including any warnings and report the exit code. Exit code 0 = ok: true.

## Resolution

No blocking challenge identified. Proceed to execution.
