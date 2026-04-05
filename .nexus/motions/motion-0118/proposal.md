# Proposal: Corpus V1 Program Planning Canon v0 — pre-motion planning, program graph, context inheritance, and launch packets

**Motion:** motion-0118
**Kind:** documentation
**Date:** 2026-04-03

---

## Where we are

The Q2 normalization arc is complete. motion-0111 established the corpus
baseline. motions 0112–0114 and 0116 repaired the identified anomalies.
motion-0117 ratified the audit itself. The repo is at a clean pause baseline.

This is the right moment to look at what comes next — not to start it, but
to establish the planning foundation before it begins.

---

## The gap

Corpus V1 has produced 117 motions. Looking across them honestly, the
dominant pattern has been **ticket-mode execution**: a problem is noticed,
a motion is created to fix it, the motion is executed, the next problem
appears. This pattern works for normalization repairs and small bounded
changes. It does not work for strategic work.

The evidence:

- Programs like the Q2 loop activation arc (motions 0071–0083) and the
  bootstrap planning program (motions 0084–0092) were coherent arcs — but
  their structure was discovered in retrospect, not planned in advance.
- Parent/child motion relationships exist in `motion.yaml` but there is no
  canonical definition of what a program, era, or motion line actually is.
- Context inheritance across a motion line — what each motion inherits from
  its parent, what it must restate, what is assumed — has no formal rule.
- Pre-motion planning (framing, decomposition, dependency ordering, agent
  strategy) happens implicitly in chat and is not captured in any governed
  artifact before the first motion of a line is created.
- Quality standards for motions differ significantly across eras. Family A/B
  motions are minimal; Family D motions are richer but still inconsistent.
- There is no template for a launch packet — the artifact that opens a new
  planned motion line with its full context.

Before Corpus V2 begins — specifically, before the first JAI Agent-voted
motion is cast — this repo needs a planning canon that makes strategic motion
authoring repeatable.

---

## What this motion establishes

A **Program Planning Canon v0**: the governed reference for how meaningful
work is planned, structured, decomposed, and launched in dev-jai-nexus.

This is not a process document for its own sake. It is the foundation that
makes the following possible:

- A branch can carry a real strategic arc (6–12 motions) with a coherent
  dependency graph rather than a stack of ad hoc patches.
- A new program can be opened with a launch packet that gives any agent or
  operator the full context needed to execute the first motion.
- Context inheritance rules mean subsequent motions in a line do not re-litigate
  what was already established — they inherit it and extend it.
- Agent and panel strategy is planned before execution, not improvised mid-flight.
- Motion quality is consistent enough that a future JAI Agent can evaluate a
  motion against a known standard.

---

## Concepts this canon must define

### 1. Program graph vocabulary

| Term | Definition |
|---|---|
| **Era** | A broad temporal phase of the corpus (Corpus V1, Corpus V2). Defined by the governance model in effect: manual votes vs. agent-voted motions. |
| **Epic** | A large coherent goal that spans multiple programs. May last months. Examples: Q2 loop activation, OffBook.ai bootstrap, GitHub CLI operator posture. |
| **Program** | A coherent set of motions with a shared goal, a declared parent motion (the umbrella), and a bounded scope. |
| **Motion line** | An ordered sequence of motions within a program, where each motion inherits context from the previous and advances the program toward its goal. |
| **Parent motion** | The umbrella motion that defines a program's scope, success criteria, and success state. Child motions advance toward or close the umbrella. |
| **Child motion** | A bounded motion within a program, subordinate to the parent. May have its own children (sub-decomposition). |
| **Launch motion** | The first motion in a planned line. Must carry the full launch packet. |
| **Closure motion** | The final motion in a line, which ratifies the parent and declares the program closed. |

### 2. Pre-motion planning workflow (9 phases)

Before any motion in a new strategic line is created, a planning pass must
be completed. The planning pass produces a governed planning artifact (the
launch packet for the first motion). The 9 phases are:

**Phase 1 — Goal framing**
State the goal in one sentence. Identify what "done" looks like. Name the
success criteria before naming any motion. If the goal cannot be stated
cleanly, do not proceed to decomposition.

**Phase 2 — Baseline read**
Read the current repo state: relevant substrate artifacts, prior motions in
related programs, the corpus audit, and any open anomalies in scope. Establish
what is already true before planning what to change.

**Phase 3 — Constraint mapping**
Name what this program must not touch. Identify hard constraints (other
motions in flight, frozen surfaces, known dependencies that must not be
disturbed). Identify soft constraints (preferred patterns, conventions to
preserve). Constraints are inputs to decomposition, not afterthoughts.

**Phase 4 — Program decomposition**
Break the goal into a set of bounded, ordered motions. Each motion should
do exactly one meaningful thing. Decomposition is complete when each motion
can be described in one sentence that includes its input state, its change,
and its output state.

**Phase 5 — Dependency graph**
Map the dependency relationships between motions in the program. Identify
which motions are sequential (B requires A to complete first), which are
parallel (C and D can proceed simultaneously), and which are conditional
(E proceeds only if F finds a specific result). Produce a DAG. If the DAG
has cycles, the decomposition is wrong.

**Phase 6 — Agent / panel strategy**
Identify which role executes each motion. For current Corpus V1 manual-vote
motions, identify the operator and the expected Claude operating mode
(strategic project, motion implementation, or closeout/passalong). For
future Corpus V2 agent-voted motions, identify the panel composition and
which perspectives (cost, architecture, governance, operator usability,
evidence/falsifiability, execution pragmatism) are required for each motion
class.

**Phase 7 — Motion quality standard**
Before authoring the first motion in the line, confirm the motion package
will meet the quality standard defined in `.nexus/docs/motion-quality-standard.md`.
The standard covers: proposal precision, challenge adversarialism, execution
specificity, evidence traceability, and decision rationale.

**Phase 8 — Cost / escalation design**
Estimate the execution cost of the program (tokens, operator time, number
of sessions). Identify escalation triggers: conditions under which a motion
in the line should be paused, re-scoped, or abandoned rather than pushed
through. Pre-commit to what a clean exit looks like at each stage.

**Phase 9 — Launch packet**
Produce the launch packet for the first motion in the line. The launch packet
is a self-contained context artifact that gives any agent or operator the
full picture: goal, baseline, constraints, decomposition summary, the first
motion's specific scope, and what the first motion must prove to enable the
next motion in the sequence.

### 3. Context inheritance rules

Within a motion line, context is inherited progressively. The rules are:

- A child motion inherits the goal framing, baseline read, and constraints
  from its parent unless it explicitly overrides them with a stated reason.
- Each motion in a line must restate only what has changed since the prior
  motion. It must not re-litigate what the prior motion already resolved.
- If a motion needs to override an inherited constraint, it must name the
  constraint, state why it is being overridden, and confirm the override
  does not violate a hard constraint at the program level.
- Launch packets are cumulative: each subsequent motion in a line may produce
  an updated launch packet for the next motion. The updated packet replaces
  the prior one as the canonical context for the remaining line.

### 4. Motion quality standard (summary)

A motion meets the Corpus V1 quality standard when:

- The proposal states its input state, change, and output state explicitly.
- The challenge raises the strongest honest objections — not strawmen.
- The execution lists exact files changed and exact commands to verify.
- Evidence is inspectable: a reader can verify the claim without trusting
  the author.
- The decision rationale explains why the vote is correct given the evidence,
  not just that it passed.

---

## What this motion will produce

### Primary implementation artifacts

```
.nexus/docs/corpus-v1-program-planning-canon.md
```
The canonical reference document for Corpus V1 program planning. Covers all
9 phases, program graph vocabulary, context inheritance rules, and the
relationship between planning canon and the Corpus V2 transition.

```
.nexus/docs/motion-quality-standard.md
```
The explicit quality standard for Corpus V1 motions. Referenced from the
planning canon and usable as a checklist before ratifying any motion.

```
.nexus/programs/program-graph.schema.yaml
```
The schema for a program graph entry: era, epic, program, motion line,
parent/child relationships, status.

```
.nexus/programs/program-graph.yaml
```
The actual program graph for Corpus V1 (motions 0001–0118), structured
according to the schema. This is the authoritative map of what was built.

```
.nexus/programs/program-plan.schema.yaml
```
The schema for a planning artifact: goal, baseline, constraints,
decomposition, dependency graph, agent/panel strategy, cost estimate.

```
.nexus/programs/context-inheritance.schema.yaml
```
The formal schema for context inheritance rules within a motion line.

```
.nexus/programs/motion-launch-packet.template.md
```
The template for a launch packet. Every new planned motion line begins
with an instance of this template, filled in for the specific program.

---

## What this motion does NOT do

- Does not start Corpus V2. The transition to agent-voted motions is a
  separate governed event, bounded by its own motion when the conditions
  are met.
- Does not reopen the normalization arc or any prior repair motions.
- Does not change runtime, UI, DB, or portal behavior.
- Does not add package.json scripts or portal dependencies.
- Does not pretend that current manual votes are agent votes.
- Does not attempt to produce the full Corpus V1 retrospective (that is
  a separate motion if needed).

---

## Why this is the right next Corpus V1 move

The repo now has 117 clean motions, a ratified audit, a repaired corpus, and
a governed operator posture. What it lacks is a plan for how to plan.

Corpus V2 will begin at the first truly agent-voted motion. That transition
requires that:

1. The planning canon is in place so agents operate within a governed
   planning framework, not ad hoc.
2. Motion quality is high enough that agent evaluation is meaningful.
3. The program graph is legible so agents can orient themselves within
   the arc of prior work.

motion-0118 is the final Corpus V1 foundation move. After it is ratified,
the repo will have everything it needs to open Corpus V2 cleanly.

---

## Success criteria

- `.nexus/docs/corpus-v1-program-planning-canon.md` committed and accurate.
- `.nexus/docs/motion-quality-standard.md` committed and usable as a checklist.
- `.nexus/programs/` directory created with all 4 schema/data files.
- `.nexus/programs/motion-launch-packet.template.md` committed and complete.
- All 7 implementation artifacts pass a quality review: each is internally
  consistent, grounded in the actual Corpus V1 corpus, and does not
  over-specify Corpus V2 behavior.
- validate_motion and validate_agency pass for motion-0118.
