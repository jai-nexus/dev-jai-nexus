# Decision: CR-04 JAI Agent Operational v0 — minimum viable first agent, governed seat assignment, and traceable agent vote proof

**Motion:** motion-0121
**Status:** PROPOSED
**Date:** 2026-04-05

---

## Summary

motion-0121 is the first real implementation motion against the CR-04
specification established by motion-0120. It closes the seven-item
CR04 closure checklist by: producing a CR-03 quality-standard compliance
record (entrance gate); registering the minimum viable first JAI Agent
(`jai-agent-001`) in the governance registry; creating a governed seat
assignment to the evidence-falsifiability seat; producing an agent-authored
evaluation trace and agent-vote.json for motion-0121 that satisfies the
agent-vote-protocol schema; and updating the closure checklist and readiness
criteria to reflect actual met status.

This is a structural proof of CR-04, not an adversarial one. The
non-independence limitation (jai-agent-001 and the motion author share
an underlying model) is acknowledged explicitly in the evaluation trace.
What this proof demonstrates: the governance schema works end-to-end.
What it does not demonstrate: adversarial independence. Genuine independence
is a Corpus V2 concern.

After this motion, if successful: CR-04 is met. The critical path advances
to CR-03 (one more post-0118 motion needed) and then to CR-05 planning.

The motion has a hard stop at CR-04 closure. It does not author a Corpus V2
opening motion. It does not declare Corpus V2 started.

---

## Challenges reviewed

Six challenges were raised and resolved:

- **C-1** (performative CR-03 gate): Resolved with adversarial framing
  requirement. The compliance record must cite specific artifacts per
  dimension. A record that gives blanket PASS without evidence is not valid.
- **C-2** (non-independent evaluation): Resolved by honest characterization.
  The evaluation trace must state the non-independence limitation. CR-04
  closure is structural proof, not adversarial proof. Decision.md must
  state this explicitly.
- **C-3** (agents.generated.yaml schema risk): Resolved by mandatory
  pre-flight baseline read and immediate validate_agency check after edit.
  Stop if non-zero exit.
- **C-4** (agent-vote.json vs vote.json naming): Resolved by Option A
  with explicit `note` field in agent-vote.json distinguishing it from
  the ratification vote.json.
- **C-5** (workspace path accessibility): Resolved by mandatory Baseline 1
  confirming the path is readable, parseable, and committable before any
  write attempt.
- **C-6** (seven artifacts, scope concern): Resolved by early-stop
  coherence at Phase 2 and Phase 3. Pairs are logically inseparable.

No blocking challenge identified.

---

## Vote

Pending implementation and ratification vote.

---

## Next step

Implement the four phases. Run all evidence checklist items. Confirm
validate_agency exits 0 after agent registration. Ratify via unanimous
consent vote.

**Stop rule:** Do not draft or ratify a Corpus V2 opening motion in this
task or as a follow-on to this task without a separate explicit instruction
to do so. motion-0121 closes CR-04. CR-05 is a separate governed event.
