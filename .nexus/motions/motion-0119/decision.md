# Decision: Corpus V1 Deliberation Readiness v0 — executable seat differentiation, cost-aware escalation, and launch-packet activation

**Motion:** motion-0119
**Status:** RATIFIED
**Vote:** yes=3, no=0, abstain=0 — PASS
**Ratified:** 2026-04-04

---

## Summary

motion-0119 proposes the executable deliberation readiness layer for Corpus V1. Where motion-0118 established planning vocabulary and workflow theory, motion-0119 produces the artifacts that make deliberation enforceable: six per-seat contracts with specific PASS/BLOCK conditions, a four-tier cost-aware escalation ladder, a primary readiness narrative with worked example, per-file motion-folder authoring guidance, a governed launch-packet activation path, and a falsifiable Corpus V2 readiness checklist.

---

## Challenges reviewed

Six challenges were raised and resolved:

- **C-1** (planning-on-planning): Resolved. The artifacts are executable contracts and schemas, not further description. A seat contract without BLOCK conditions is a label; with BLOCK conditions it is an enforceable rule.
- **C-2** (defer contracts until agents exist): Resolved. Seat contracts serve as structured deliberation checklists for the human operator in Corpus V1, grounded in 118 motions of observed behavior.
- **C-3** (too-wide scope): Resolved with mitigation. Artifacts are sequenced so early-stop after the first three deliverables still produces a coherent output. The evidence checklist verifies each artifact independently.
- **C-4** (V2 authority overreach): Resolved. The readiness criteria document records current status; it does not declare the V2 transition. The transition requires a separate governed event.
- **C-5** (numeric threshold calibration): Resolved with explicit mitigation. The escalation ladder will document that v0 thresholds are heuristic calibrations from observed Corpus V1 distribution, not derived from first principles. Non-numeric triggers provide calibration-independent escalation signal.
- **C-6** (is this the start of V2): Resolved. Corpus V2 begins at the first JAI Agent-voted motion, not when the contracts governing such a vote are written.

No blocking challenge identified.

---

## Vote

**yes=3, no=0, abstain=0 — PASS — unanimous consent**

All six seat contracts verified present at `.nexus/deliberation/seat-contracts/`
with differentiated `block_conditions` across all six perspectives. Escalation
ladder verified at `.nexus/deliberation/escalation-ladder.yaml` with four tiers,
heuristic calibration note, and non-numeric triggers (surface_type, novelty_flag,
uncertainty_flag). Primary readiness narrative verified at
`.nexus/docs/corpus-v1-deliberation-readiness.md` with worked example referencing
motion-0115. Motion-folder phase guide verified with before/after examples for all
six motion-package files. Launch-packet activation path verified at
`.nexus/programs/launch-packet-activation.md` with four steps. Corpus V2
readiness criteria verified at `.nexus/docs/corpus-v2-readiness-criteria.md`
with 10 falsifiable criteria and honest status assessments (2 met, 2 partial,
6 unmet).

`validate_motion` exit 0 (`✅ motion schema OK`).
`validate_agency` exit 0 (`✅ registry-backed agency OK`).

No runtime, portal, UI, or DB files modified. Corpus V2 is not declared started.
The transition remains a separate governed event requiring CR-04 (JAI Agent
operational) and CR-05 (Corpus V2 opening motion).

---

## Why this vote is correct

motion-0119 is ratified because the implementation is complete and the evidence
is traceable. The seat contracts are not renamed copies — each has a materially
different `reasoning_shape` and `block_conditions` that would produce different
deliberation outcomes on the same motion. The escalation ladder addresses
challenge C-5 explicitly with the calibration note. The V2 readiness criteria
address challenge C-4 by recording current status without declaring the
transition. The early-stop design from challenge C-3 is verified: the first
three artifacts (seat contracts, escalation ladder, primary narrative) are
coherent and ratifiable independently of the remaining three.

The Corpus V1 governance record is now complete: planning canon (motion-0118)
plus deliberation readiness (motion-0119) together constitute the full Corpus V1
governance foundation. What follows is either closing unmet V2 readiness criteria
or the Corpus V2 transition itself.
