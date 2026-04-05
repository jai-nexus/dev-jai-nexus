# Decision: Corpus V2 Readiness Blockers v0 — JAI Agent operational prerequisites before the Corpus V2 opening motion

**Motion:** motion-0120
**Status:** RATIFIED
**Vote:** yes=3, no=0, abstain=0 — PASS
**Ratified:** 2026-04-04

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

**yes=3, no=0, abstain=0 — PASS — unanimous consent**

CR-04 agent readiness spec verified at `.nexus/deliberation/cr04-agent-readiness-spec.md`:
six sections present, minimum viable first agent definition specific and falsifiable
(one agent, one seat, one real motion, one governed vote, one committed trace).

CR-04 closure checklist verified at `.nexus/deliberation/cr04-closure-checklist.yaml`:
seven items (CR04-01 through CR04-07), each with `artifact_ref` or `command` field,
all `status: unmet` — machine-checkable pre-conditions for CR-04 closure without
author assertion.

Agent vote protocol verified at `.nexus/deliberation/agent-vote-protocol.yaml`:
extension fields (vote_type enum human|agent, agent_id, seat_id, seat_contract_ref,
seat_contract_version, evaluation_trace_ref, model, protocol_version), evaluation
trace schema, compatibility note (additive — no validator changes required),
forward-compatibility mechanism (protocol_version field), anti-patterns (human-authored
agent vote, untraced vote, simulation).

`corpus-v2-readiness-criteria.md` verified: CR-01 `current_status: met` (motion-0118),
CR-02 `current_status: met` (motion-0119). Summary: 4 met / 2 partial / 4 unmet.
Attribution note added.

`program-graph.yaml` verified: planning-canon closed, q2-corpus-v1-deliberation-readiness
closed, q2-corpus-v2-readiness-blockers open with motion-0120 as first line entry.

Launch packet verified at `.nexus/programs/q2-corpus-v2-readiness-blockers-launch-packet.md`:
nine sections complete, no bracketed placeholders. First real use of the launch-packet
activation path — closes CR-08.

`validate_motion` exit 0 (`✅ motion schema OK`).
`validate_agency` exit 0 (`✅ registry-backed agency OK`).

No runtime, portal, UI, or DB files modified.

---

## Why this vote is correct

motion-0120 is ratified because the specification layer required before any
CR-04 implementation motion can begin is now committed and verifiable. The
CR-04 agent readiness spec converts the criteria description ("a JAI Agent
exists that can evaluate a motion") into a falsifiable implementation target.
The closure checklist makes CR-04 closure a verifiable repo state rather than
an author declaration.

Challenge C-2 (premature schema) is addressed: the protocol carries `version: v0`
and a `protocol_version` field in each agent vote, enabling recalibration when the
first real agent output is available. Challenge C-5 (architecture pre-specification)
is addressed: the spec is explicitly framed as minimum viable interface requirements —
any implementation that satisfies the interface is valid.

**What this ratification does not do:**
CR-04 is not declared met. The closure checklist has seven items all at
`status: unmet` — that is the correct honest state. The next motion in this
line (motion-0121) implements the agent and closes those items.
Corpus V2 is not declared started. CR-05 remains out of scope.
The critical path is now: CR-03 → **CR-04 (next motion)** → CR-05.
