# JAI founder vision and P3+ seam vault

    AUTHORITY: REPRESENTATION_ONLY
    STATUS: DORMANT_PRESERVED
    EXECUTION_AUTHORITY: NONE

“Make the intangible, tangible.” The founder should be able to compare a proposed decision with its alternatives, inspect the evidence and abandon a hypothesis when the experiment warrants it.

## Governed Conjecture Chambers and Speculative Graph Forks

Chamber A is the **Safe-to-Be-Wrong Conjecture Space**. A hypothesis in `.nexus/conjectures/` carries `authority_granted: false`. Retain rejected conjectures as `FALSIFIED_USEFUL` with the observation that falsified them. They remain evidence of learning. They earn zero execution credit.

Chamber B is the **Verified Execution and Receipt Gate**. A separately routed Program uses `.nexus/programs/<corpus_id>/<motion_id>/<program_slug>/`. Its key is the corpus, Motion and Program code together. Program ordinals restart for each Motion. Each lane contract binds one write repository. Ratified execution contracts are immutable. Independent verification and human acceptance require separate records.

Events and B9 receipts share one append-only history at `.nexus/ledger/<corpus_id>/<motion_id>/<program_slug>/<lane>/<writer_role>/<UTC>-<ULID>.json`. Lane status, rework, founder time and velocity can be derived from those records. A Wave groups work. The Ready Frontier consists of lanes whose dependencies have been satisfied. A Pulse could coordinate across Programs in the future. The namespace `.nexus/pulses/` is dormant and the active Program limit is one.

An independently ratified future Motion could consider governed forks at **motion-0249 or later**. The number remains unallocated. A conjecture would need a separately scoped proposal and independently bound evidence before Chamber B could use its findings.

## Three-Level Recursive Intelligence Acquisition

1. **Founder Cost-to-Execution Horizon.** Measure elapsed founder minutes, rework and decision quality from a question through a verified outcome. Preserve negative results so repeated experiments can inform the decision to stop.
2. **Composable intelligence configuration.** Describe construction (tools, models and prompts), coordination (roles and handoffs) and governance (who may approve or veto). Record shared-model correlation when comparing configurations.
3. **Engine construction.** JAI::HOST and JAI::CLONE remain dormant proposals. Authority leases, recursive construction and autonomous recovery would require their own evidence and human decisions.

## Three protected P3+ seams

| Seam | Meaning preserved for a future contract |
| --- | --- |
| Proposal and receipt ancestry | `parent_proposal_hash` identifies a proposal input. `expected_base_sha` pins the proposed repository base. `prev_ledger_entry_hash` identifies a predecessor receipt. Each reference answers a different audit question. |
| Optional cohort fan-in | A future cohort could group proposals for comparison while preserving rejected alternatives and their distinct approval subjects. Membership confers zero quorum or write authority. |
| Review gates | Gate 0 checks deterministic integrity. Gate 1 checks scope and cost. Gate 2 synthesizes proposals and disagreement. Gate 3 reserves finality to the human operator. These gates describe a candidate design. |

## Cost and complexity

The Four-Layer Cost Rule reserves L1 for allocated subscription cash, L2 for metered provider/API cash, L3 for non-cash token equivalents and L4 for measured non-cash founder time. The monthly cash allocation ceiling is USD 200.00. Authorized L2 spend is USD 0.00.

Task complexity has its own vocabulary of `T1_ATOMIC`, `T2_COMPOSABLE`, `T3_CROSS_DOMAIN` and `T4_PARADOX`.

Canonical records live in `.nexus/`. A future schema-validated `.jai` projection should preserve identity and round-trip semantics under jai-format. This catalogue grants no compiler, writable projection, runtime, Program opening or execution authority.
