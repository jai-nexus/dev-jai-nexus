# Challenge: Corpus V2 Readiness Blockers v0 — JAI Agent operational prerequisites before the Corpus V2 opening motion

**Motion:** motion-0120
**Date:** 2026-04-04

---

## C-1: Is this still governance documentation? After motion-0118 and motion-0119, when does the repo stop writing about doing things and start doing them?

**Concern:** motion-0118 was called "planning canon." motion-0119 was called
"deliberation readiness." motion-0120 is called "readiness blockers." The
pattern is a series of progressively more specific governance documents, each
of which justifies itself as the prerequisite to the next thing. At some
point the repo must start implementing agents, not describing what agents
must do.

**Resolution:** The distinction between motion-0120 and its predecessors is
the distinction between a definition and a specification. motion-0118 named
the concepts. motion-0119 produced the contracts and checklists those concepts
require. motion-0120 produces the implementation specification that the next
session needs to actually build an agent.

Specifically: the CR-04 agent readiness spec and the agent vote protocol are
not descriptions of what agents should do in the abstract. They are the
pre-committed bar against which any implementation will be evaluated. Without
them, the implementation session begins without a definition of "done" —
which guarantees either a false-positive closure ("we have an agent running,
close CR-04") or indefinite deferral ("the agent isn't quite right yet").

The test: after motion-0120, can a new session open the launch packet and
begin implementing CR-04 closure without asking "but what exactly does
CR-04 require?" If yes, motion-0120 is an implementation prerequisite, not
more planning.

---

## C-2: Is the agent vote protocol schema premature? You are designing a schema for something that does not exist yet. The schema may be wrong.

**Concern:** The agent-vote-protocol.yaml defines required fields (agent_id,
seat_id, evaluation_trace_ref, model) for a vote.json that no agent has
produced yet. The schema will be derived from theory, not from an observed
agent output. Schemas designed before the thing they describe tend to be
wrong in predictable ways: they miss fields that turn out to be necessary
and require fields that turn out to be useless.

**Resolution:** This is a real risk, and it is explicitly addressed by the
v0 label and the version field in the protocol schema. The agent-vote-protocol.yaml
is a v0 calibration — a starting point grounded in the existing human vote
schema and the seat contract structure already committed. It is not a frozen
standard.

The alternative — deferring the schema until the first agent output exists
— means the first agent implementation has no target to implement against.
The implementation would produce an output, that output would be called
"the schema," and the schema would be an artifact of the first implementation
rather than a governed pre-commitment. That is worse: it makes the first
agent's choices permanent by default.

The v0 schema is designed to be recalibrated when the first real agent output
is available. The specific mitigation: the schema must include a `schema_version`
field and a mechanism for forward compatibility so that schema updates do not
require re-ratifying all existing agent votes. That requirement is part of
what the implementation motion must satisfy.

---

## C-3: Six artifacts again. This is the third consecutive motion with six primary deliverables. The scope is never narrowing.

**Concern:** motion-0118 had seven artifacts. motion-0119 had six. motion-0120
has six. There is a pattern of maintaining approximately the same artifact
count regardless of the actual scope required. This is scope inflation that
is being rationalized rather than challenged.

**Resolution:** The six artifacts in motion-0120 fall into three natural
pairs, not six independent deliverables:

- Pair 1 (CR-04 spec + closure checklist): Together they constitute the
  complete CR-04 closure definition. The spec says what "operational" means;
  the checklist says how you verify it. Separating them across motions would
  require committing the spec before the checklist that operationalizes it,
  leaving the spec non-actionable.

- Pair 2 (agent vote protocol + criteria update): Together they reflect the
  current state honestly. The protocol defines how agent votes are recorded;
  the criteria update reflects what readiness criteria are now met. The
  criteria update without the protocol leaves an open question about how
  agent votes will be governed.

- Pair 3 (program graph update + launch packet): Together they register and
  open the current arc. The program graph says the arc exists; the launch
  packet makes it executable. A launch packet without a program graph entry
  is an orphan; a program graph entry without a launch packet is inert.

If the implementation must stop early, stopping after Pair 1 still produces
a coherent and ratifiable output. The CR-04 spec and closure checklist are
the highest-value deliverables. Pairs 2 and 3 are supporting artifacts that
make the spec operational.

---

## C-4: Does updating corpus-v2-readiness-criteria.md within motion-0120 create a maintenance problem? The original doc was established by motion-0119. Updating it in motion-0120 sets a precedent of motions editing each other's canonical documents.

**Concern:** The corpus-v2-readiness-criteria.md was established by motion-0119.
If motion-0120 modifies it, future motions may modify it too, turning a
canonical document into a frequently-edited file with unclear ownership.
The governance principle is that each motion owns its outputs.

**Resolution:** The status field within the readiness criteria doc is explicitly
designed to be updated as criteria are met. The doc itself says: "This document
records current-status assessments as of its creation date." The status fields
are not the canonical output of motion-0119 — the criteria and their
falsifiability conditions are. The status values are current-state records
that must be updated to remain useful.

The mitigation is attribution: the update must note which motion promoted
each criterion and when, so the history is traceable. The update follows
the same model as decision.yaml status updates: the schema is established once;
the status field is updated by governed events. Corpus V2 readiness criteria
follow the same ownership model: criteria are established by motion-0119;
status is updated by subsequent ratified motions.

---

## C-5: Does the CR-04 spec pre-specify the Corpus V2 agent architecture in a way that constrains future decisions that should belong to the Corpus V2 canon?

**Concern:** Defining "exactly what fields the agent's vote.json must contain"
and "exactly which seat contract the agent must consume" is not just a
readiness bar — it is the beginning of the Corpus V2 agent architecture.
The Corpus V2 canon is supposed to govern agent behavior. By specifying agent
vote structure in a Corpus V1 motion, this motion may be pre-empting work
that belongs to the Corpus V2 opening motion and its successors.

**Resolution:** The CR-04 spec defines the minimum viable bar for a single
agent to participate in one vote. It does not define the full Corpus V2 agent
architecture — it defines the minimum the architecture must satisfy to
produce a governed output.

The distinction is between interface and implementation. The spec says: the
agent's output must contain these fields and pass this validation. It does
not say: the agent must be implemented this way, use this model, or operate
in this framework. Those are Corpus V2 canon questions. The interface
requirements are Corpus V1 readiness questions — they are the conditions
without which no Corpus V2 canon can produce a verifiable governed vote.

The spec must be explicitly labeled as minimum viable interface requirements,
not as a comprehensive Corpus V2 architecture. Any implementation that
satisfies the interface is valid; the architecture is underconstrained by
design.

---

## C-6: The launch packet closes CR-08, but CR-08 was not on the critical path to Corpus V2. Does delivering it as part of motion-0120 justify the extra scope?

**Concern:** CR-08 (launch-packet pattern used in practice) is a parallel-track
criterion that does not block the Corpus V2 transition. Including a full
launch packet in motion-0120 specifically to close CR-08 is scope expansion
driven by a desire to check a box, not by a genuine dependency.

**Resolution:** The launch packet's value in motion-0120 is not primarily
CR-08 closure. The launch packet is required for motion-0120 to be the
proper opening of a new program line under the planning canon. motion-0118
defined the launch-packet pattern. The first program line opened after
motion-0118 must use it — not as an exercise, but because that is what the
canon requires.

motion-0120 is the first new program line opened after motion-0119. Not
producing a launch packet would mean the first real test of the activation
path is skipped. CR-08 closure is a side effect of doing the right thing
for this arc, not the reason for doing it. The launch packet would need to
exist regardless of whether CR-08 were a criterion.

---

## Resolution

No blocking challenge identified. C-2 identifies a real design risk (premature
schema) that must be explicitly addressed by labeling the agent-vote-protocol
as v0 and including a forward-compatibility mechanism. C-3 identifies a
real scope discipline concern that is mitigated by the paired-artifact structure
and the early-stop guarantee after Pair 1. C-5 identifies a real authority
boundary that must be respected: the CR-04 spec must be framed explicitly
as minimum viable interface requirements, not Corpus V2 architecture. Proceed
to execution.
