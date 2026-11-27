# Q4M11Y26-P2 C1 — Five-Slot Decision Contract & Seven Failure Fixtures (v0)

## Convention-Proposed Functional Slots & G2 Traceability Crosswalk

| Functional slot | Recorded responsibility |
|---|---|
| Proposal | Frame the candidate, scope and assumptions. |
| Evidence | Identify committed sources and assess sufficiency. |
| Challenge | Surface contradictions, missing evidence and dissent. |
| Risk-Economics | Record failure and timeout exposure, authority risks and L1–L4 costs. |
| Synthesis | Qualify confidence and carry unresolved positions forward. |

At base `e088cd730a95cd142507ccc0bb651cd2d57c39b9`, motion-0248 reserves the Program name “Five-Slot Compounded Reasoning Shadow Kernel v0”. Decision line 88 reads “This decision does not implement the five-slot shadow kernel, founder workflow pilot, or bounded Agent/Council pilot.” The execution file records staging. The vote file concerns motion-0248 alone and records `NOT_APPLICABLE_NO_VOTE`. The five names above are C1 conventions with zero Council vote attribution. [Motion](../../.nexus/motions/motion-0248/motion.yaml) · [Decision](../../.nexus/motions/motion-0248/decision.yaml#L88) · [Proposal](../../.nexus/motions/motion-0248/proposal.md) · [Execution](../../.nexus/motions/motion-0248/execution.md) · [Vote](../../.nexus/motions/motion-0248/vote.json)

Amendment line 23 sets the objective “Evaluate the Five-Slot Shadow Kernel against pre-registered alternatives using independently verifiable decision evidence and measured founder time.” The frozen C1 contract identifies the lane, dependencies and writers. [Amendment](../../.nexus/amendments/corpus-v1/motion-0248/amendment-01-q4m11y26-p2-scoping-and-format-2.yaml#L23) · [C1 contract](../../.nexus/programs/corpus-v1/motion-0248/jai-five-slot-compounded-reasoning-shadow-kernel-v0/lanes/C1/contract.yaml)

P1 FIVE-SLOT-001 says “Each JAI Thread or JAI Agent should use at least five model slots.” Its classification is `ACCEPTED_CURRENT`, with “Planning target only.” and “Same-model/provider disclosure required.” C1 records `functional_slots_are_not_model_slots: true` and `five_independent_models_claimed: false`. [P1 reconciliation](q3m7-accepted-main-state-reconciliation-planning-v0.md#L444)

## Three-record intelligence_configuration

CONSTRUCTION identifies declared models and lineage, tools, prompt versions, validators, shared-model groups and provenance. Output evidence indices refer to entries in that envelope’s provenance array. C1 checks their structure. C2 binds committed objects and receipt hashes. All fixture decisions are synthetic.

COORDINATION records one-model, two-seat, three-seat, five-slot or deterministic mode. In five-slot mode both the model declarations and outputs must each contain every canonical name exactly once. Other modes permit free non-empty slot names. Every mode records `adds_c3_benchmark_arms: false`.

Five-slot validation compares recorded claims across all ten slot pairs. It applies NFKC normalization, lowercases text, removes ASCII and Unicode punctuation, collapses whitespace runs to one space and trims the result. An empty claim or a duplicate after normalization yields `C1_ROLE_COLLAPSE`.

GOVERNANCE requires `authority_granted: false`, `HUMAN_OPERATOR_ONLY`, zero spend and false execution and inference flags. The validator returns a diagnostic or null and leaves the recorded envelope intact.

## Seven failure fixtures diagnostic matrix

| Fixture | Diagnostic | Evidence retained or checked |
|---|---|---|
| disagreement | C1_UNRESOLVED_DISAGREEMENT | Both “Proceed with the provisional evidence.” and “Hold until the missing record arrives.” survive unchanged. |
| missing_evidence | C1_MISSING_EVIDENCE | Recorded claim lacks a resolving provenance index. |
| malformed_output | C1_MALFORMED_OUTPUT | Undeclared output field fails the closed schema. |
| false_consensus | C1_FALSE_CONSENSUS | Independent agreement claimed for a shared model. |
| role_collapse | C1_ROLE_COLLAPSE | Challenge repeats Proposal verbatim. |
| timeout_or_failure | C1_TIMEOUT_OR_FAILURE | Evidence retains TIMEOUT even when Synthesis reports a recorded result. |
| authority_escalation | C1_AUTHORITY_ESCALATION | Claimed authority blocks readiness. |

## CONTROL_THREAD-approved additions

F1 and F2 extend the committed lane scope for C2–C4 readiness. F1 preserves either measured interval, minutes, retries and capture method or explicit unmeasured nulls. C1 accepts both. The envelope validator and C3 scoring helper use the same clock schema. A measured clock requires ordered ISO timestamps, finite nonnegative active minutes within the elapsed interval (tolerance 0.000001 minutes), a nonnegative integer retry count, a nonblank capture method and exactly the declared fields. The helper returns null for a valid measured clock, `C1_UNMEASURED_FOUNDER_CLOCK` for a valid unmeasured clock and `C1_MALFORMED_OUTPUT` for malformed input. The frozen estimate of 45 founder minutes is a prior.

F2 validates the configuration and compares the trimmed verifier family with each declared construction model family, ignoring case. Valid declarations with at least one model and distinct verifier and construction families yield `{ separated: true, code: null }`. An invalid configuration, empty model list, missing or blank family, or matching family yields `{ separated: false, code: "C1_VERIFIER_SELF_GRADING_CONFLICT" }`. Undeclared external tooling and omitted upstream lineage require independent C4 audit.

## B9 ownership and required-test pin

Builder owns 004 delivery and 008 integration evidence in the proposed PR. Independent Claude Verifier owns 006, CONTROL_THREAD owns 007 acceptance, and the Auditor owns the 013 Linear mirror. The required runner discovers the new suite. Pinning it in the required-test manifest belongs to a separate VERIFIER packet.
