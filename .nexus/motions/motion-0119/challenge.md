# Challenge: Corpus V1 Deliberation Readiness v0 — executable seat differentiation, cost-aware escalation, and launch-packet activation

**Motion:** motion-0119
**Date:** 2026-04-04

---

## C-1: Isn't this just more planning on top of planning? motion-0118 just delivered a planning canon.

**Concern:** motion-0118 established the Program Planning Canon v0. motion-0119
is another layer of governance/process artifacts. The repo now has theory upon
theory without executing any product work.

**Resolution:** The distinction between motion-0118 and motion-0119 is the
distinction between vocabulary and contract. motion-0118 named seat perspectives,
described the escalation concept, and defined the launch-packet template.
motion-0119 produces the executable artifacts those concepts require:
per-seat YAML contracts with specific PASS/BLOCK conditions, an escalation
ladder with numeric trigger thresholds, and a launch-packet activation path
that converts a filled template into a motion-ready package.

These are not descriptions of how things should work. They are the objects
that make things work. A seat contract without a yaml file is a statement of
intent. A seat contract with a yaml file and specific BLOCK conditions is an
enforceable rule.

The test: after motion-0119, can a new operator (or a future agent) use the
seat contracts to evaluate a motion in materially differentiated ways across
the six perspectives? If yes, motion-0119 is implementation, not planning.

---

## C-2: Should the six seat contracts be deferred until there are real agents to enforce them?

**Concern:** Seat contracts specify agent behavior. In Corpus V1, there are no
real agents — there is one human operator. Writing contracts for agents that
don't exist yet is speculative.

**Resolution:** Seat contracts serve two functions. In Corpus V2, they govern
agent behavior. In Corpus V1, they govern deliberation quality for the human
operator and Claude: they force the review process to explicitly cycle through
each perspective before ratifying a motion.

The cost-discipline seat contract, for example, asks whether the motion's
execution cost is justified by its impact. That question is valid and useful
in Corpus V1 regardless of whether a real Cost Discipline agent is running.
Using the contracts in Corpus V1 as structured checklists improves deliberation
quality now and ensures the contracts are grounded in observed practice rather
than theoretical prediction when Corpus V2 begins.

Writing contracts based on 118 motions of observed behavior is not speculation.
It is induction from evidence.

---

## C-3: Is six implementation artifacts too wide? This risks becoming an unratifiable mega-motion.

**Concern:** motion-0119 targets six primary artifacts plus a new directory.
Challenge C-3 from motion-0118 raised the same concern about seven artifacts.
There is a pattern here of overloading single motions.

**Resolution:** The six artifacts in motion-0119 are more tightly coupled than
the seven in motion-0118. The seat contracts, escalation ladder, and V2
readiness criteria are three facets of the same deliberation readiness picture.
The phase guide and activation path operationalize the quality standard and
launch-packet template already committed by motion-0118. Splitting them across
multiple motions would require either committing incomplete seat contracts
before the escalation ladder that determines when they are invoked, or committing
the escalation ladder before the seat contracts it triggers.

The implementation mitigates the risk: artifacts are sequenced so that the
primary narrative and seat contracts come first (the most valuable deliverables),
and the remaining artifacts depend on them. If the implementation step must
stop early, stopping after the first three deliverables still produces a
coherent and ratifiable output. The evidence checklist in execution.md will
verify each artifact independently.

---

## C-4: Does the V2 readiness criteria document pre-specify the Corpus V2 transition conditions, overstepping Corpus V1 authority?

**Concern:** A document that defines when Corpus V2 begins effectively
legislates the V2 transition from within Corpus V1. This may overstep the
authority of a Corpus V1 motion.

**Resolution:** The readiness criteria document does not declare when Corpus V2
begins. It produces a falsifiable checklist of current-status assessments.
The transition itself requires a separate governed event — a Corpus V2 opening
motion. The readiness criteria document is an input to that motion, not a
substitute for it.

Specifically: the document will record which criteria are currently met and
which are not. It cannot pass the criteria on behalf of the transition — it
can only make the current state legible. This is precisely the kind of honest
self-assessment that Corpus V1 should produce: not "we declare V2 ready" but
"here is what is true, here is what is not, here is what still needs to
happen."

---

## C-5: The escalation ladder assigns numeric trigger thresholds (risk scores). Where do those numbers come from?

**Concern:** Tiered escalation based on risk score thresholds introduces
quantitative governance. The risk scores in existing policy.yaml files were
assigned heuristically, not against a defined scale. Basing escalation tiers
on numbers that were not calibrated to the tier boundaries is circular.

**Resolution:** This is a real risk, and the implementation must address it
explicitly. The escalation ladder will document that the tier thresholds at
v0 are grounded in the observed distribution of risk scores across Corpus V1
policy.yaml files — not derived from first principles. The thresholds will be
stated as v0 calibrations, subject to recalibration as Corpus V2 produces
more observations.

The ladder will also include non-numeric triggers: surface type (substrate,
runtime, governance policy), novelty flag (first motion of its kind in the
corpus), and uncertainty flag (open questions in the challenge that were
marked conditional rather than resolved). These surface-based triggers
provide escalation signal that does not depend on risk score calibration.

---

## C-6: What prevents motion-0119 from being the start of Corpus V2 rather than the end of Corpus V1?

**Concern:** If motion-0119 defines seat contracts, escalation tiers, and V2
readiness criteria, it may be the de facto start of Corpus V2 governance
rather than a Corpus V1 readiness motion.

**Resolution:** The artifacts motion-0119 produces are documentation,
contracts, and schemas. They govern behavior; they do not constitute behavior.
Corpus V2 begins when a motion is actually voted by a JAI Agent panel — not
when the contracts that would govern such a vote are written. The seat contracts
are preparation. The escalation ladder is preparation. The readiness criteria
are preparation.

The transition is a governed event, not a document. motion-0119 gets the repo
ready for that event. It does not perform it.

---

## Resolution

No blocking challenge identified. C-3 and C-5 identify real implementation
risks that must be explicitly addressed in execution: C-3 by sequencing
artifacts so early-stop is coherent; C-5 by documenting the heuristic
calibration basis of tier thresholds and including non-numeric triggers.
Proceed to execution.
