# Decision: CR-05 Corpus V2 Opening v0 — first true agent-voted opening event and governed transition into Corpus V2

**Motion:** motion-0123
**Status:** PROPOSED
**Date:** 2026-04-05

---

## Summary

motion-0123 is the actual Corpus V2 opening event — not more planning. Five
motions built the foundation; this motion executes the transition.

The case for this motion being the real opening event rests on three things
that distinguish it from a symbolic declaration:

**First:** It operates against a pre-committed contract. The
cr05-first-agent-voted-motion-contract.md, cr05-panel-staging-guidance.yaml,
cr05-opening-checklist.yaml, and cr05-inherited-context-packet.md were all
committed and ratified in motion-0122 — on a different branch, merged before
this branch was created. The contract was not written to match this motion;
this motion must satisfy the contract as-written.

**Second:** It requires real agent participation. The vote.json for motion-0123
is the first committed vote.json in the corpus with `era: corpus-v2`. An agent
(`nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001`) must produce a governed
evaluation trace and agent-vote.json for this specific motion. The opening
event cannot be ratified without these artifacts in committed repo state.

**Third:** It produces a committed canon baseline. The corpus-v2-canon-baseline.md
is not decision.md prose — it is a separately committed, independently readable
document that addresses every must_extend item from cr05-inherited-context-packet.md,
declares advisory agent participation as the Corpus V2 baseline, and explicitly
defers open governance questions to named follow-on motions.

**Corpus V2 starts only upon ratification of this motion.** This package is
the proposal. Implementation produces the required artifacts. Ratification
is the governed event that crosses the era boundary. Until ratification,
Corpus V2 has not started.

---

## Challenges reviewed

Six challenges were raised and resolved:

- **C-1** (same agent, same non-independence as CR-04): Resolved. The advance
  over CR-04 is in the object of evaluation: the agent evaluates a motion that
  declares an era boundary, not the agent's own instantiation. The
  non-independence limitation must be stated explicitly in the evaluation trace
  and this decision.md. The evaluation trace must aim for all 5 distinctive_questions
  addressed (not just the minimum 3) per C-5 resolution.
- **C-2** (symbolic transition): Resolved. The opening is real because: required
  agent participation is not optional; the canon baseline is a committed artifact
  with specific governance obligations; the pre-committed checklist confirms
  the opening was earned. Modesty is appropriate for a baseline canon.
- **C-3** (era label incoherence): Resolved by the staging guidance rationale.
  The `era: corpus-v2` label declares the result of the transition, not the
  ratification process. The opening uses a Corpus V1 mechanism
  (`unanimous_consent_with_agent_witness`) to produce the first Corpus V2 record.
  This is not circular — it is the constitutional convention model.
- **C-4** (minimal canon): Resolved. The canon baseline addresses all
  `must_extend` items, declares advisory participation explicitly, and names
  deferred questions by condition. Silence is not valid; explicit deferral is.
- **C-5** (minimum agent floor): Resolved. No additional agents can be invented
  for credibility. The mitigation is quality of the single agent's engagement —
  the evaluation trace must aim for all 5 distinctive_questions.
- **C-6** (scope): Resolved. The artifact set is pre-constrained by the contract.
  Three natural pairs with a hard stop if Pair 1 produces a BLOCK verdict.

No blocking challenge identified.

---

## Vote

Pending implementation and ratification vote.

---

## Post-ratification boundary

When this motion is implemented and ratified, the following become true:

**Established by ratification:**
- Corpus V2 has begun: the era boundary is in committed repo state
- CR-05 is met: all ten Corpus V2 readiness criteria are resolved or tracked
- The corpus-v2-canon-baseline.md is the authoritative opening-era governance document
- Advisory agent participation is the baseline for all post-opening motions
- Post-opening motions carry `era: corpus-v2` in their vote.json
- The program graph era boundary is committed: corpus-v1 last = motion-0122

**Explicitly deferred by ratification (require subsequent governed motions):**
- Agent participation weight evolution beyond advisory
- Agent-authored motion proposals (blocked until quality standard extension)
- The first Corpus V2 program establishment (program graph era entry open)
- Additional agent registrations
- Corpus V2 equivalent of the Corpus V1 Program Planning Canon (if structural
  changes are needed for the agent-voted era)
- CR-06 closure (parallel track)
- CR-07 closure (parallel track)

**Stop rules:**
- Do not declare Corpus V2 started before implementation and ratification
- Do not proceed past Pair 1 if the evaluation trace shows `pass_or_block: BLOCK`
- Do not modify agents.generated.yaml as part of this motion
- Do not change the agent vote protocol, seat contracts, or escalation ladder
- Do not author a post-opening Corpus V2 motion in this task or branch