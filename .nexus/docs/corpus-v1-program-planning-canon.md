# Corpus V1 Program Planning Canon v0

**Established:** motion-0118
**Date:** 2026-04-03

---

## Purpose

This document is the canonical reference for how strategic work is planned,
structured, and launched in dev-jai-nexus. It applies to any work that
involves more than one motion, crosses more than one execution session, or
requires coordination across roles.

It does not apply retroactively to the 118 Corpus V1 motions already committed.
It applies forward: to every new program opened from motion-0118 onward.

---

## The era boundary

**Corpus V1** is the era of manually-voted governance. All motions from
0001 through the end of Corpus V1 are ratified by human operator unanimous
consent. The operator (Jerry Ingram), challenger, and arbiter roles are
exercised by the same human working with Claude.

**Corpus V2** begins at the first motion where a JAI Agent panel casts a
genuine vote — not a human simulating one. That boundary has not been
crossed. Corpus V2 planning canon will extend this document when that
transition is governed.

This distinction matters for planning: in Corpus V1, agent and panel strategy
(Phase 6 below) is about operator mode and Claude operating posture. In
Corpus V2, it will govern real panel composition and vote aggregation. Do not
conflate the two.

---

## Program graph vocabulary

Eight terms define the structure of work in this repo:

**Era**
A broad temporal phase defined by the governance model in effect. Corpus V1
(manual votes) and Corpus V2 (agent-voted motions) are the two eras. Era
boundaries are governed events, not calendar dates.

**Epic**
A large coherent goal that spans multiple programs and may last months.
Examples from Corpus V1: Q2 loop activation, OffBook.ai bootstrap, Q2
normalization arc. An epic does not have a single parent motion; it is a
conceptual grouping, not a governed artifact.

**Program**
A coherent set of motions with a shared goal, a declared parent motion (the
umbrella), and a bounded scope. A program is complete when its parent motion
is ratified. Programs are the primary unit of strategic planning.

**Motion line**
An ordered sequence of motions within a program where each motion inherits
context from the prior and advances toward the program goal. A motion line
has a clear direction: motion N enables motion N+1.

**Parent motion**
The umbrella motion that defines a program's scope, success criteria, and
done state. Child motions advance toward or ratify the parent. The parent is
typically ratified last, after all children are complete.

**Child motion**
A bounded motion within a program, subordinate to the parent. A child motion
may itself be a parent to sub-motions (sub-decomposition). Child motions
inherit the parent's goal framing and constraints unless they explicitly
override them with a stated reason.

**Launch motion**
The first motion in a planned line. It carries the full launch packet (see
Phase 9 below) and establishes the baseline for all subsequent motions in
the line.

**Closure motion**
The final motion in a line. It ratifies the parent motion and declares the
program closed. It must verify that all success criteria stated in the parent
motion are met.

---

## The 9-phase pre-motion planning workflow

Before the first motion in any new strategic line is created, complete a
planning pass. The planning pass culminates in a launch packet (Phase 9),
which is the governed artifact that opens the line.

For small bounded repairs (single-motion fixes with no downstream
dependencies), this workflow may be abbreviated. Use judgment: if the motion
touches more than one surface, crosses more than one session, or has
non-trivial sequencing, run the full workflow.

---

### Phase 1 — Goal framing

State the goal in one sentence. Identify what "done" looks like. Name the
success criteria before naming any motion.

**Outputs:**
- One-sentence goal statement
- "Done when" condition (explicit, falsifiable)
- 3–7 success criteria

**Gate:** If the goal cannot be stated cleanly in one sentence, do not
proceed to decomposition. Ambiguous goals produce incoherent motion lines.

**Example:**
> Goal: Establish a governed planning canon for Corpus V1 so that strategic
> motion lines can be opened repeatably and consistently.
> Done when: Seven planning artifacts are committed, both validators pass,
> and a future operator can open a new program line using the launch packet
> template without external instruction.

---

### Phase 2 — Baseline read

Read the current repo state before proposing any change. Identify what is
already true.

**What to read:**
- Relevant substrate artifacts (`.nexus/context/`)
- Prior motions in related programs
- The corpus audit if relevant (`motion-corpus-audit.md`)
- Any open anomalies that intersect this program's scope

**Outputs:**
- List of relevant prior motions
- List of relevant substrate artifacts
- One-paragraph current-state summary: what exists, what is correct,
  what is missing

**Gate:** Do not plan changes to things that are already correct. Baseline
read prevents planning work that has already been done.

---

### Phase 3 — Constraint mapping

Name what this program must not touch. Constraints are inputs to
decomposition, not afterthoughts discovered during execution.

**Hard constraints:** Things that must not change regardless of program
outcome. Examples: live governance artifacts in other programs, frozen
surfaces, motions currently in flight.

**Soft constraints:** Preferred patterns and conventions to preserve. Examples:
schema naming conventions, commit message format, role boundary discipline.

**Outputs:**
- Hard constraint list (items that would block ratification if violated)
- Soft constraint list (items that should be preserved but are adjustable)

---

### Phase 4 — Program decomposition

Break the goal into a set of bounded, ordered motions. Each motion should do
exactly one meaningful thing.

**Decomposition is complete when:**
- Each motion can be described in one sentence: input state → change →
  output state
- No motion does two independent things that could be separated without
  loss of coherence
- Every success criterion from Phase 1 is covered by at least one motion

**Outputs:**
- Ordered list of motions with: motion_id (tentative), one-sentence
  description, input state, change, output state

**Anti-patterns to avoid:**
- Patch-ticket decomposition: one motion per file changed
- Monolithic decomposition: one motion that does everything
- Premature decomposition: naming motions before understanding dependencies

---

### Phase 5 — Dependency graph

Map the dependency relationships between motions. Produce a directed acyclic
graph (DAG).

**Edge types:**
- **Sequential:** Motion B cannot begin until Motion A is complete.
- **Parallel:** Motions C and D have no dependency on each other; they may
  proceed simultaneously if resources allow.
- **Conditional:** Motion E proceeds only if Motion F finds a specific result
  (e.g., "if the audit finds anomalies, proceed to repair; otherwise, skip").

**Gate:** If the graph has cycles, the decomposition is wrong. Cycles mean
two motions each depend on the other — split or re-order until the DAG is
acyclic.

**Outputs:**
- Dependency graph (table or Mermaid diagram)
- Identification of the critical path (the longest sequential chain)
- Identification of any parallel tracks

---

### Phase 6 — Agent / panel strategy

Identify who executes each motion and what operating mode applies.

**In Corpus V1 (current era):**
- Identify the operator and the Claude operating mode for each motion:
  - **Strategic project mode** — for goal framing, decomposition, policy
    decisions, architecture choices
  - **Motion implementation mode** — for implementing a specific bounded
    change against an active motion
  - **Closeout / passalong mode** — for summarizing completed work and
    preparing continuity artifacts

**In Corpus V2 (future era — do not pre-specify mechanism):**
- A JAI Agent panel will vote on each motion. Panel composition and
  perspective assignments will be governed by the Corpus V2 canon.
- The six seat perspectives being designed for Corpus V2 are:
  - **Cost discipline** — evaluates resource efficiency, token economy,
    and whether the motion's scope justifies its execution cost
  - **Architecture** — evaluates design coherence, schema consistency,
    and long-term structural fit
  - **Governance / safety** — evaluates role boundary discipline, audit
    traceability, and risk surface
  - **Operator usability** — evaluates whether the output is practical
    and executable by a human operator without external instruction
  - **Evidence / falsifiability** — evaluates whether claims in the motion
    are independently verifiable and whether the evidence checklist is
    sufficient
  - **Execution pragmatism** — evaluates whether the implementation plan is
    realistic given the actual repo state and known constraints

These six perspectives are named here as a forward reference only. Their
governance mechanism is Corpus V2 scope.

**Outputs (Corpus V1):**
- Per-motion table: motion_id | operating mode | notes

---

### Phase 7 — Motion quality standard

Before authoring the first motion in the line, confirm the package will meet
the quality standard. The full standard is in
`.nexus/docs/motion-quality-standard.md`.

**Five quality dimensions:**
1. **Proposal precision** — input state, change, and output state are explicit
2. **Challenge adversarialism** — strongest honest objections, not strawmen
3. **Execution specificity** — exact files, exact commands, exact expected output
4. **Evidence traceability** — claims are independently verifiable
5. **Decision rationale** — explains why the vote is correct, not just that it passed

**Gate:** If any dimension cannot be satisfied for a motion in the planned
line, re-scope that motion before creating the package. A motion that cannot
be clearly proposed, challenged, executed, and evidenced should not be opened.

---

### Phase 8 — Cost / escalation design

Estimate the execution cost of the program and pre-commit to escalation
triggers.

**Cost estimate:**
- Approximate number of sessions required
- Approximate number of motions
- Surfaces touched (docs, schemas, portal, governance artifacts)
- Any external dependencies (API keys, environment setup, external services)

**Escalation triggers** — conditions under which a motion in the line should
be paused, re-scoped, or abandoned rather than pushed through:
- A gate fails and the fix is unclear
- A dependency turns out to be different from what the baseline read found
- A constraint is discovered that was not in the constraint map
- The cost is tracking significantly above estimate

**Clean exit design:** Pre-commit to what a clean, partial exit looks like
at each major checkpoint. A program that stops cleanly at checkpoint N is
better than one that continues past a blocker and produces inconsistent state.

**Outputs:**
- Cost estimate table
- Escalation trigger list
- Clean exit checkpoints per phase

---

### Phase 9 — Launch packet

The launch packet is the governed artifact that opens a new planned motion
line. It is self-contained: any agent or operator reading it should be able
to execute the first motion without external instruction.

**Required contents:**
- Goal statement (from Phase 1)
- Done-when condition and success criteria
- Baseline state summary (from Phase 2)
- Hard and soft constraints (from Phase 3)
- Decomposition summary table (from Phase 4)
- Dependency graph (from Phase 5)
- Agent/panel strategy table (from Phase 6)
- First motion scope (what it does, what it does not do)
- What the first motion must prove to enable the second
- Cost estimate and escalation triggers (from Phase 8)

The template for a launch packet is at
`.nexus/programs/motion-launch-packet.template.md`.

**Progressive updates:** Each motion in a line may produce an updated launch
packet for the next motion. The updated packet replaces the prior one as the
canonical context for the remaining line. This means context does not need
to be re-derived from scratch at each step; it is inherited and updated.

---

## Context inheritance rules

Within a motion line, context is inherited progressively. These four rules
govern what must be restated and what may be inherited:

**Rule 1 — Inherit unless overriding.**
A child motion inherits the goal framing, baseline, and constraints from its
parent unless it explicitly overrides them with a stated reason. Restating
inherited context verbatim is noise; omitting it is not a gap.

**Rule 2 — Restate only what changed.**
Each motion must restate only what is different since the prior motion. If
the baseline has not changed, do not re-describe it. If a constraint was
lifted, state that it was lifted and why.

**Rule 3 — Never re-litigate resolved challenges.**
A challenge that was resolved in a prior motion in the line is resolved. Do
not re-raise it in a subsequent motion unless new evidence has emerged that
changes the answer. Re-litigating resolved challenges wastes review capacity
and introduces inconsistency.

**Rule 4 — Launch packets are cumulative.**
Each motion may produce an updated launch packet for the next motion. The
updated packet is the authoritative context for the remaining line. If a
launch packet update contradicts the original, the update governs — but the
contradiction must be explained.

---

## What makes a motion branch-worthy

Not every motion needs a dedicated branch. But a motion or motion line is
branch-worthy when:

- It touches more than one surface and those surfaces interact
- It requires more than one session to complete
- Its changes benefit from isolation before merge (e.g., schema + data +
  narrative that must be reviewed together)
- It has a dependency on another branch that has not yet merged

Branch-worthy work should live on a sprint branch named for the arc:
`sprint/q2-<short-description>-<motion-id>`.

A single branch should carry one coherent strategic arc. Do not mix unrelated
motions on the same branch unless they are tightly coupled.

---

## The Corpus V2 transition

Corpus V2 begins at the first motion where a JAI Agent panel casts a genuine
vote. That event is a governed transition, not a calendar event. It requires:

1. This planning canon to be in place and ratified.
2. The motion quality standard to be in place and applicable.
3. At least one JAI Agent with a defined panel seat to be operational.
4. A governed Corpus V2 opening motion that declares the transition.

Until all four conditions are met, all motions remain Corpus V1 manual-vote
motions. Do not simulate Corpus V2 agent votes in Corpus V1 motions.

The six panel seat perspectives named in Phase 6 are the intended design for
Corpus V2 panel composition. Their specification and governance mechanism is
Corpus V2 scope, not defined here.

---

## Quick reference: opening a new program

1. State the goal in one sentence. Can you say what "done" looks like?
2. Read the baseline. What already exists? What is already correct?
3. Map constraints. What must you not touch? What patterns should you preserve?
4. Decompose. What are the ordered motions? Can each be described as
   input → change → output?
5. Draw the dependency graph. Is it a DAG? What is the critical path?
6. Plan agent/panel strategy. Who runs each motion? In what mode?
7. Check quality standard. Can each motion be proposed, challenged, executed,
   and evidenced cleanly?
8. Estimate cost and name escalation triggers.
9. Write the launch packet. Is it self-contained?

If you cannot answer all nine, the program is not ready to open.
