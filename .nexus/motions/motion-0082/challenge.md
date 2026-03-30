# Challenge: bounded loop coherence gate

**Motion:** motion-0082
**Challenger role:** DEV Challenger (6.0.3)
**Date:** 2026-03-30

## Challenges raised

### C1: Should computeLoopCoherence live in a shared lib file rather than inline?

The function has no side effects and could be reused by a future WS-6
coherence script.

**Resolution:** Inline is correct at this stage. The function takes
`GoverningMotionState` and execution event flags — types defined in this
same page file. Moving it to a shared lib would either require exporting
those types or duplicating them. The rule applies: "Three similar lines of
code is better than a premature abstraction." A shared coherence lib is the
right follow-on when a second consumer exists. The function is small enough
(~30 lines) that inline adds no meaningful maintenance burden.

### C2: Should INCOHERENT vs PROGRESSING be a binary, not a four-way verdict?

Two verdicts (ok / not-ok) are simpler to surface and explain.

**Resolution:** Three meaningful states exist: loop closed (COHERENT),
loop advancing normally (PROGRESSING), and loop in a state that should not
exist (INCOHERENT). Collapsing these into two values forces the caller to
re-derive the distinction from reasons text. The four-way verdict
(COHERENT / PROGRESSING / INCOHERENT / NOT_GOVERNED) maps cleanly to chip
colors and operator action: emerald = loop closed, sky = in flight,
amber = needs attention, slate = not applicable.

### C3: Should the gate block operator actions for incoherent packets?

If the packet is INCOHERENT, the Approve button should probably be disabled.

**Resolution:** Out of scope for WS-5. The gate is observational in this
slice: compute and surface, do not enforce. Enforcement logic would need
to thread the coherence verdict into `canResolveOperatorDecision`, which
is an additional behavioral change requiring its own motion. The surface
verdict is immediately useful to the operator and does not require
enforcement to deliver value.

### C4: Does PROGRESSING correctly handle packets that are at OPERATOR_REVIEW
but not yet approved?

At OPERATOR_REVIEW, execution evidence is present (architect + builder +
verifier) but `operatorDecisionKind` may still be null.

**Resolution:** Yes. The function checks execution evidence first, then
terminal state. A packet at OPERATOR_REVIEW with full execution evidence
but no operator decision yet will reach condition 5 (`WORK_APPROVED + receipt
COMPLETED`) as the only remaining incomplete condition, and return PROGRESSING
with reason "Operator approval not yet recorded." This is correct: the packet
is progressing normally through the final stage.

### C5: Should `p.githubPrUrl` and `p.verificationUrl` count as execution
evidence for coherence?

These are already used as evidence supplements in `sliceStages`.

**Resolution:** Yes. The `builderPresent` and `verifierPresent` flags in the
coherence call mirror the same logic as `builderState` and `verifierState` in
`sliceStages`: `!!(builderEvt || p.githubPrUrl)` and
`!!(verifierEvt || p.verificationUrl)`. Consistency with the existing
evidence model is more important than a stricter debug-artifact-only check.

## Verdict

No blockers. Challenges C1–C5 resolved inline. Proceed with implementation.
