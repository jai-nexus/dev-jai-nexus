# Proposal: Corpus V2 Readiness Blockers v0 — JAI Agent operational prerequisites before the Corpus V2 opening motion

**Motion:** motion-0120
**Kind:** documentation
**Date:** 2026-04-04

---

## Where we are

motion-0118 delivered the Corpus V1 Program Planning Canon v0.
motion-0119 delivered the Corpus V1 Deliberation Readiness v0.

The Corpus V1 governance foundation is complete. The repo now has:
- A 9-phase planning workflow, program graph vocabulary, and launch-packet template
- Six per-seat contracts with PASS/BLOCK conditions
- A four-tier escalation ladder with numeric and non-numeric triggers
- A motion quality standard and motion-folder phase guide
- A governed launch-packet activation path
- A falsifiable Corpus V2 readiness checklist

Two of ten Corpus V2 readiness criteria are now met (CR-09, CR-10). With the
ratification of motion-0118 and motion-0119, CR-01 and CR-02 are also met.
That brings the current state to four met, two partial, four unmet.

The next move is not more governance documentation. The next move is blocker
closure.

---

## The primary blocker: CR-04

The critical path to the Corpus V2 opening motion (CR-05) runs entirely
through CR-04:

> **CR-04:** A JAI Agent exists that can evaluate a motion against at least
> one of the six seat contract perspectives, produce a structured vote output
> (yes/no/abstain with rationale), and have that output recorded in a vote.json
> that passes validate_motion.

CR-05 cannot be honest until CR-04 is met. A Corpus V2 opening motion that
declares "the first JAI Agent-voted motion occurred" without a real agent
having voted is a fiction, not a governance event.

CR-04 is currently unmet — and the path to closing it is not yet specified
at the level of precision required to execute it.

---

## The gap: CR-04 is described but not specified

The readiness criteria document records CR-04 as unmet and names its closing
action: "A Corpus V2 infrastructure motion that implements at least one
panel-seat agent and produces a governed vote.json from that agent's
evaluation."

This is a description. It is not yet a specification.

A description names what must happen. A specification names:

- Exactly what agent identity fields must be registered and where
- Exactly which seat contract the agent must consume as evaluation context
- Exactly what fields the agent's vote.json must contain beyond the current
  human-vote schema
- Exactly what validation the agent's output must pass before it counts as
  a governed vote
- Exactly what evidence must be committed to the repo for CR-04 to be
  declared met — not by author assertion but by repo-readable proof

Without this specification, CR-04 will never be closed in a governed way. It
will be closed informally when someone decides to call a motion "agent-voted"
without a defined bar. That is not a governed transition — it is drift.

---

## The second gap: no agent vote protocol

The current vote.json schema is designed for human votes. It records:
proposer, challenger, arbiter roles; yes/no/abstain counts; a reasons list.

An agent-produced vote must record different things:
- Which agent produced the vote (agent identity, not human identity)
- Which seat perspective the agent was evaluating from
- Which seat contract version the agent consumed as context
- A traceable evaluation record: did the agent engage the seat's
  distinctive_questions? Did it check the block_conditions?
- The model and operating context used to produce the evaluation

Without an agent vote protocol, there is no governed way to record an agent
vote that is distinguishable from a human operator writing a vote.json with
an agent name in it. The protocol is what makes agent participation verifiable
rather than asserted.

---

## The third gap: CR-01 and CR-02 not yet reflected in the criteria doc

The corpus-v2-readiness-criteria.md was written with motion-0118 and
motion-0119 in progress but not yet ratified. Both are now ratified. The
criteria document must reflect the current state: CR-01 and CR-02 are met,
the summary table must be updated, and the dependency chain must be updated
to show that the first two blockers are cleared.

---

## The fourth gap: no program graph entry for the current arc

motion-0119's program (q2-corpus-v1-deliberation-readiness) does not appear
in `.nexus/programs/program-graph.yaml`. motion-0120's program
(q2-corpus-v2-readiness-blockers) does not appear. The program graph is
stale and must be updated to reflect the current live arc.

---

## The fifth gap: launch-packet pattern never used in practice

CR-08 requires the launch-packet pattern to be used at least once in a real
program line before Corpus V2 begins. motion-0119's arc predated the
launch-packet activation path. motion-0120 is the first motion line that can
demonstrate the full launch-packet pattern.

Producing a filed launch packet for this program line closes CR-08 and
demonstrates that the activation path from motion-0119 is operational —
not just described.

---

## What this motion produces

### Primary implementation artifacts

**`.nexus/deliberation/cr04-agent-readiness-spec.md`**

The precise, falsifiable specification for CR-04 closure. Defines:
- Minimum viable agent identity requirements (what must be registered, where)
- Seat assignment requirements (which seat contract governs the agent's evaluation)
- Agent vote.json field requirements beyond the current human-vote schema
- Validation checks the agent's output must pass
- The exact evidence that must be committed to the repo for CR-04 to be
  declared met — readable without author trust

**`.nexus/deliberation/agent-vote-protocol.yaml`**

The governance schema and protocol for agent-produced votes. Defines:
- Extension fields required in agent vote.json (agent_id, seat_id,
  seat_contract_ref, evaluation_trace_ref, model)
- How an agent vote differs from a human vote in structure and semantics
- What an evaluation_trace must contain to make the agent's reasoning
  independently verifiable
- Compatibility constraints: agent vote.json must also satisfy the existing
  human vote schema fields (outcome nested object, panel, etc.)

**Updated `.nexus/docs/corpus-v2-readiness-criteria.md`**

Promotes CR-01 and CR-02 to `met`, updates the summary table to reflect
current state (4 met, 2 partial, 4 unmet), and updates the dependency chain
and next-blocker commentary.

**Updated `.nexus/programs/program-graph.yaml`**

Adds motion-0119's program (q2-corpus-v1-deliberation-readiness) as closed,
opens motion-0120's program (q2-corpus-v2-readiness-blockers) with its
motion line, and updates the planning-canon program status if not already
reflected.

**`.nexus/deliberation/cr04-closure-checklist.yaml`**

A machine-checkable pre-conditions list. Every item must be true before CR-04
is declared met. Designed so that each item can be verified by reading the
repo without author assertion. Items include: agent registration, seat
assignment, vote output schema compliance, validate_motion pass on agent
vote.json, evaluation trace committed, at minimum one full seat-contract
evaluation cycle evidenced.

**`.nexus/programs/q2-corpus-v2-readiness-blockers-launch-packet.md`**

The filed launch packet for this motion line. First real use of the
launch-packet activation path from motion-0119. Self-contained: any agent
or operator reading it can execute the next motion in the line without
external instruction. Filing this launch packet closes CR-08 (launch-packet
pattern used in practice).

---

## What this motion does NOT do

- Does not implement JAI Agent vote infrastructure. That is a later
  implementation motion in this same program line.
- Does not start Corpus V2. The transition requires CR-04 to be met and a
  separate Corpus V2 opening motion.
- Does not simulate or fake an agent vote.
- Does not declare any prior motion reopened.
- Does not widen into OffBook.ai rollout work.
- Does not change runtime, UI, DB, or portal behavior.
- Does not draft the Corpus V2 opening motion.
- Does not specify the Corpus V2 governance canon (that is CR-05 scope).

---

## Why this is the right next arc

After motion-0120, the repo will have:
1. A precise spec for what CR-04 requires (this motion)
2. The agent vote protocol that governs how agent votes are recorded
3. A closure checklist that makes CR-04 verifiable, not asserted
4. Updated readiness criteria reflecting actual current state
5. A live launch packet opening the implementation line for CR-04 closure

The next motion in this line can begin implementing the agent infrastructure
against the spec, with a clear, pre-committed bar for what "done" means.

Without motion-0120, the implementation line cannot begin honestly: there is
no agreed spec, no agreed protocol, and no agreed evidence standard. The
blocker is not engineering — it is the absence of a governed definition of
what the blocker closure looks like.

---

## Success criteria

- CR-04 agent readiness spec committed with at minimum: agent identity
  requirements, seat assignment requirements, vote.json field requirements,
  and the specific evidence that must be committed for CR-04 to be declared met.
- Agent vote protocol committed as a YAML schema with compatibility note
  against the existing human vote schema.
- corpus-v2-readiness-criteria.md updated: CR-01 and CR-02 promoted to met,
  summary table accurate.
- program-graph.yaml updated: motion-0119 program closed, motion-0120 program
  open with motion line.
- CR-04 closure checklist committed: every item independently verifiable from
  repo state.
- Launch packet filed: self-contained, follows the template, covers all nine
  planning phases, closes CR-08.
- validate_motion and validate_agency pass for motion-0120.
