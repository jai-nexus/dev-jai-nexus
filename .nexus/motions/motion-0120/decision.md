# Decision: Corpus V2 Readiness Blockers v0 — JAI Agent operational prerequisites before the Corpus V2 opening motion

**Motion:** motion-0120
**Status:** PROPOSED
**Date:** 2026-04-04

---

## Summary

motion-0120 addresses the gap between a complete Corpus V1 governance
foundation (motions 0118 and 0119 ratified) and the first true Corpus V2
agent-voted motion. The Corpus V1 governance foundation is complete. The
remaining path to Corpus V2 runs through CR-04: JAI Agent operational with
a defined panel seat.

CR-04 is currently unmet because "operational" is described but not specified.
Without a precise, falsifiable definition of what "JAI Agent operational"
requires — exact agent identity fields, exact vote schema, exact evidence
that must be committed — CR-04 can only be closed by author assertion, not
by governed proof.

This motion produces the specification layer that makes CR-04 closure
governed rather than declared: a CR-04 readiness spec, an agent vote protocol,
a machine-checkable closure checklist, updated readiness criteria reflecting
current state, a program graph update, and the launch packet that opens the
implementation line.

It does not implement the agent. It does not start Corpus V2. It creates the
pre-committed bar against which the implementation will be measured.

---

## Challenges reviewed

Six challenges were raised and resolved:

- **C-1** (still just documentation): Resolved. The CR-04 spec and agent
  vote protocol are the pre-committed implementation target. Without them,
  the next session begins without a definition of "done."
- **C-2** (premature schema): Resolved with explicit mitigation. The agent
  vote protocol is labeled v0 and must include a forward-compatibility
  mechanism and schema_version field. Recalibration when the first real
  agent output is available is the expected path.
- **C-3** (six artifacts again): Resolved. The six artifacts are three
  natural pairs. Early stop after Pair 1 is coherent and ratifiable.
  C-3 and C-5 from prior motions raised the same concern; the paired
  structure and early-stop guarantee remain the mitigation.
- **C-4** (editing motion-0119's canonical doc): Resolved. Status fields
  in the criteria doc are designed to be updated by subsequent ratified
  motions. Updates are attributed to the promoting motion.
- **C-5** (pre-specifying Corpus V2 architecture): Resolved with framing
  constraint. The CR-04 spec is explicitly minimum viable interface
  requirements, not Corpus V2 architecture. Implementation is underconstrained
  by design; any implementation that satisfies the interface is valid.
- **C-6** (launch packet just for CR-08 credit): Resolved. The launch packet
  is required by the planning canon for any new program line opened after
  motion-0118. CR-08 closure is a side effect, not the motivation.

No blocking challenge identified.

---

## Vote

Pending implementation and ratification vote.

---

## Next step

Implement the six readiness-blocker artifacts. Verify all evidence checklist
items. Ratify via unanimous consent vote.
