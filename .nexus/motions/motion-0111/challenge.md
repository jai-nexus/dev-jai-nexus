# Challenge: Motion corpus audit — schema family classification and normalization inventory

**Motion:** motion-0111
**Date:** 2026-03-31

## Necessity challenge

**Q: Is a committed audit document necessary, or is the information available
from running `generate-motion-snapshot.mjs`?**

The motion snapshot generator produces a runtime ledger (decision status + artifact
list per motion). It does not classify motions into schema families, does not
distinguish governance-open from schema-evolution gaps, does not state the canonical
forward contract, and does not produce a normalization action registry. These
require interpretation of artifacts across the corpus — they are analysis products,
not raw data. A committed document preserves the analysis so future sessions do
not need to re-derive it.

## Authority challenge

**Q: Does an audit document have authority to declare which motions are "open"?**

The document records observations from artifact reads. It does not declare closure
or ratification — those require separate governed motions. The open motion register
identifies which motions have DRAFT decision.yaml status and what type of gap
exists. Closing them requires subsequent motions (e.g. a ratification closure
motion for 0037, a governance-sweep motion for 0083/0092/0094). The audit is
evidence, not action.

## Scope challenge

**Q: Should the audit also fix the four open motions in the same motion?**

No. Fixing the open motions requires separate bounded motions — each with its
own challenge, execution, and ratification artifacts. Bundling normalization with
the audit would make the audit's scope unbounded and its ratification contingent
on disputed normalization decisions. The audit ships first as a read-only record.

## Family boundary challenge

**Q: Are the family boundaries derived from actual artifact reads or from assumed
patterns?**

Actual artifact reads. The boundary data comes from:
- `grep "^protocol_version:"` across all motion.yaml files
- `grep "^status:"` across all motion.yaml files
- `grep "^protocol_version:"` across all decision.yaml files
- artifact presence checks (vote.json, verify.json, policy.yaml, decision.md, trace.json)
- decision.yaml status values per motion

No family boundary is assumed; all are derived from the actual files as they
exist on the branch at audit time.

## Resolution

No blocking challenge identified. Proceed to execution.
