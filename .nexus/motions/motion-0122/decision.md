# Decision: CR-05 Corpus V2 Opening Planning v0 — opening boundary, first agent-voted motion shape, and transition guardrails

**Motion:** motion-0122
**Status:** PROPOSED
**Date:** 2026-04-05

---

## Summary

motion-0122 is the deliberate planning motion that must land before any honest
Corpus V2 opening motion can be authored. CR-04 is now met: the minimum viable
first JAI Agent exists, has a governed seat assignment, and has produced a
governed evaluation trace and agent-vote.json. The question is no longer "can
an agent exist?" The question is "how should the opening motion be designed so
it is real, governed, and not symbolic?"

This motion answers that question by producing the pre-committed specification
layer for the CR-05 opening event:
- A falsifiable opening boundary document with machine-checkable pre-conditions
- An opening criteria checklist (cr05-opening-checklist.yaml) analogous to the
  cr04-closure-checklist.yaml that governed CR-04 closure
- A first-agent-voted-motion contract defining the shape, panel composition, and
  evidence requirements for the opening event
- Panel staging guidance resolving the ratification-mechanism question for the
  opening event specifically
- An inherited-context packet declaring which Corpus V1 artifacts carry into V2
  and which must be extended
- Program graph registration and launch packet opening the arc

The opening motion (CR-05) is not authored in this motion or in this branch arc.
The opening event is a separate governed motion that depends on this planning
arc being ratified first. Corpus V2 has not started. CR-03 remains partial at
4/5; this motion may qualify as the 5th if implemented and ratified well, but
closing CR-03 is a consequence of quality, not the purpose.

---

## Challenges reviewed

Six challenges were raised and resolved:

- **C-1** (planning for more planning): Resolved. The opening event is the
  highest-stakes governance motion in the corpus so far. Its failure mode is
  semantic, not technical — a weak opening is a permanent precedent. The
  test is whether, after motion-0122 is ratified, a new session can author
  the opening motion without asking "what exactly does a valid opening require?"
  If yes, this motion is an implementation prerequisite.
- **C-2** (circular contract): Resolved by arc separation. The planning arc
  must be ratified and merged before the opening arc begins. The contract is
  a committed artifact before the opening motion is drafted. The launch packet
  makes this hard constraint explicit in its done-when and constraints sections.
- **C-3** (CR-03 delay): Resolved. CR-03 closure is a consequence of quality,
  not the purpose. The early-stop guarantee after Pair 1 means that even a
  partial implementation produces a ratifiable output that may qualify as the
  5th CR-03 motion.
- **C-4** (pre-specifying Corpus V2 canon): Resolved with scope constraint.
  cr05-panel-staging-guidance.yaml is scoped to the opening event only. It
  must not declare post-opening Corpus V2 panel rules. That is Corpus V2 canon
  scope. A scope check item in the evidence checklist enforces this.
- **C-5** (self-authored red lines): Resolved by specificity requirement.
  Red lines must reference named artifacts or agent_ids. Prose-only conditions
  are invalid. A reviewer who has not seen the planning arc must be able to
  check each red line independently against the opening motion.
- **C-6** (six artifacts): Resolved. Three natural pairs with early-stop
  guarantee after Pair 1. The program graph update is a single field addition.
  The launch packet instantiates a template.

No blocking challenge identified.

---

## Vote

Pending implementation and ratification vote.

---

## Next step

Implement the three pairs. Run all evidence checklist items including both
validators. Ratify via unanimous consent.

**Stop rules:**
- Do not author the Corpus V2 opening motion in this task or as a follow-on
  to this task without a separate explicit instruction to do so.
- Do not author the opening motion in the same branch arc as these planning
  artifacts.
- Do not declare Corpus V2 started.
- Do not update corpus-v2-readiness-criteria.md in this motion (no criterion
  changes state as a direct result of this planning motion).
- CR-05 remains out of scope until the opening event is separately ratified.
