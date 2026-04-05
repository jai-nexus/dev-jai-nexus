# Proposal: CR-05 Corpus V2 Opening Planning v0 — opening boundary, first agent-voted motion shape, and transition guardrails

**Motion:** motion-0122
**Kind:** governance-policy
**Date:** 2026-04-05

---

## Where we are

motion-0118 established the Corpus V1 Program Planning Canon v0.
motion-0119 established the Corpus V1 Deliberation Readiness v0.
motion-0120 established the CR-04 specification layer and agent vote protocol.
motion-0121 closed CR-04: the minimum viable first JAI Agent is registered,
assigned a seat, and has produced a governed evaluation trace and agent-vote.json
that satisfy the agent-vote-protocol v0.1 schema. validate_motion and
validate_agency both exit 0.

The current Corpus V2 readiness state:

| Criterion | Status |
|---|---|
| CR-01 | met — motion-0118 |
| CR-02 | met — motion-0119 |
| CR-03 | partial — 4 of 5 post-0118 motions assessed |
| CR-04 | **met — motion-0121** |
| CR-05 | unmet — no opening motion exists |
| CR-06 | partial — motion-0112 ratification status unconfirmed |
| CR-07 | unmet — motions 0001–0070 uncategorized |
| CR-08 | unmet — launch-packet pattern not yet used in practice |
| CR-09 | met — motion-0108 |
| CR-10 | met — motion-0095 |

The critical path to Corpus V2 is: CR-03 (one more qualifying post-0118 motion)
→ **CR-05 (the Corpus V2 opening motion)**. CR-04 is no longer the blocker.

---

## The gap: CR-05 is named but not planned

The corpus-v2-readiness-criteria.md describes CR-05 as:

> "A motion exists that explicitly declares the Corpus V2 transition: names
> the conditions that were met, records the first agent-voted motion, and
> establishes the Corpus V2 governance canon (extending this planning canon
> for the agent-voted era)."

This is a description. It tells us the outcome. It does not tell us:

- **The exact opening boundary:** what must be confirmed true before the
  opening motion is permitted to exist. Not "CR-04 is met" — that is already
  known. The question is: what else must be true? Must CR-03 be fully closed
  first? Must at least one non-inaugural agent-voted motion exist before the
  opening event? Must the opening motion itself be agent-voted, or only
  witnessed by an agent?

- **The shape of the first Corpus V2 motion:** The opening motion declares
  the transition and establishes the Corpus V2 canon. But it is also the
  first motion authored in the new era. What does that require? Must it be
  agent-voted — and if so, by how many agents, from which seats? If it is
  agent-voted by only one agent (the same one from CR-04), what prevents
  the opening from being as structurally non-independent as the CR-04 proof?

- **Inherited context:** Corpus V2 does not start from nothing. It inherits
  the seat contracts, escalation ladder, agent vote protocol, program planning
  canon, and motion quality standard from Corpus V1. How is this inheritance
  governed? Which artifacts does the opening motion extend, and which does it
  supersede? Without a governed answer, the opening motion may silently break
  compatibility with Corpus V1 artifacts.

- **Panel staging in the opening line:** The opening event will be
  deliberated by some panel. In Corpus V1, panel means JerryIngram in
  proposer/challenger/arbiter roles. In Corpus V2, panel may include agents.
  The opening event must decide: what is the panel composition for the opening
  motion itself? Is it Corpus V1 panel composition (unanimous consent) with
  agent observation, or does the opening event require genuine agent-voted
  ratification? Getting this wrong makes the opening either symbolic (agent
  participation is decorative) or premature (agent ratification before the
  governance canon governing agent ratification exists).

- **Red lines:** What would count as faking a Corpus V2 start? The
  non-independence limitation in CR-04 was acknowledged and accepted because
  the proof was structural, not adversarial. The opening event cannot carry
  the same concession — a Corpus V2 opening ratified entirely by the same
  non-independent agent that closed CR-04 is not a genuine era transition, it
  is a relabeling. The red lines must be stated explicitly before the opening
  motion is drafted, not discovered while reviewing it.

Without answers to these questions, an opening motion will be drafted with
good intentions and ambiguous execution. The ambiguity will compound: the
first motion authored in Corpus V2 is a canonical precedent for every motion
that follows. A weak opening is permanently embedded in the corpus record.

---

## Why plan before opening

The same logic that justified motion-0120 before motion-0121 applies here.
motion-0120 did not implement the agent — it specified the bar against which
implementation would be measured. Without that specification, motion-0121 would
have begun with no definition of "done," and CR-04 closure would have been
an author declaration rather than a governed proof.

CR-05 requires the same pre-commitment discipline. The Corpus V2 opening motion
is the highest-stakes governance event the corpus has produced. It declares the
era boundary, establishes the canon for the agent-voted era, and sets every
precedent the new era will inherit. Getting it right requires knowing, before
drafting begins:

1. What conditions must be confirmed met before the opening motion is allowed
   to exist
2. What evidence the opening motion must produce to be ratifiable as genuine
3. What the panel composition for the opening event should be and why
4. What "Corpus V2 governance canon" means concretely — not just a phrase
   in the criteria description
5. What the opening motion explicitly does not do so its scope cannot drift
   into the entire future of agent governance

This motion is the specification layer for CR-05. It produces the pre-committed
bar. The actual opening event is a separate motion in this same arc.

---

## The seven planning targets

motion-0122 produces governed artifacts for each of the following:

### 1. Opening boundary definition

A falsifiable document naming the exact conditions that must be true before the
Corpus V2 opening motion is authored. Not aspirational prose — specific,
repo-checkable conditions. Example: is CR-03 fully closed (5/5) a prerequisite,
or can the opening motion itself serve as the 5th qualifying motion? This is a
real question with a real governance consequence; it must be answered before
drafting begins.

### 2. Opening criteria checklist

A machine-checkable pre-conditions list for the opening event, modeled on
cr04-closure-checklist.yaml. Each item must be independently verifiable from
repo state. The opening motion ratification must reference this checklist
the way motion-0121 referenced the CR-04 closure checklist.

### 3. First agent-voted motion contract

A governed document defining the shape, requirements, and evidence standard
for the first true Corpus V2 motion. Covers: minimum agent panel composition,
which seats must be represented, what the opening motion must produce as
ratification evidence, and what the relationship is between the agent vote
and the human ratification event in Corpus V2.

This is the most consequential planning artifact. A weak contract produces
a symbolic opening. A strong contract — one that requires the opening event
to be genuinely different from Corpus V1 ratification — produces an opening
worth building a new era on.

### 4. Seat and panel staging guidance

A governed artifact describing how the transition from Corpus V1 panel
composition (unanimous consent by operator) to Corpus V2 panel composition
(agent-participated ratification) should be staged. The staging question is
real: the opening motion cannot be ratified under Corpus V2 rules because
the Corpus V2 governance canon does not yet exist at the time of ratification.
But if it is ratified purely under Corpus V1 rules, is it a Corpus V2 motion?
The staging guidance answers this without assuming the answer.

### 5. Inherited-context packet for the opening line

A governed artifact declaring which Corpus V1 artifacts are inherited by
Corpus V2 and which the opening motion must extend or replace. At minimum:
seat contracts, escalation ladder, agent vote protocol, motion quality standard,
and program planning canon. This packet is what the opening motion's inherited
context section must reference. Without it, the opening motion inherits by
informal assumption — exactly the kind of untraced dependency the governance
system exists to prevent.

### 6. Explicit red lines

A governed artifact declaring what would constitute a false Corpus V2 start.
Specific red lines at minimum:
- The opening motion is ratified by the same structural proof that closed CR-04
  (non-independent single agent, same model as author) without additional
  panel participation
- The opening motion is authored before the opening boundary conditions are
  confirmed met
- The opening motion is authored as a consequence of another motion's
  side-effects rather than as a deliberate opening event
- The Corpus V2 canon is declared by implication within a Corpus V1 motion
  rather than established by the opening motion itself

Red lines are not enforcement mechanisms — they are the pre-committed
definition of what "fake" looks like so no one has to argue about it later.

### 7. Program graph update and launch packet

The opening planning line must be registered in the program graph and given
a launch packet. The launch packet opens the arc so that the next motion in
this line — the actual opening event — can begin with a self-contained brief.

---

## What this motion produces

### Pair 1 — Opening boundary and checklist (highest value, ratifiable if execution stops here)

**New file:** `.nexus/docs/cr05-opening-boundary.md`

The falsifiable definition of what must be true before the Corpus V2 opening
motion is authored. Structured as: confirmed pre-conditions (what must already
be ratified), confirmed non-conditions (what is explicitly not required), the
era-boundary event itself (what the opening motion must do), and the hard stop
(what it must not do).

**New file:** `.nexus/deliberation/cr05-opening-checklist.yaml`

A machine-checkable list of opening pre-conditions, modeled on
cr04-closure-checklist.yaml. Each item: description, artifact_ref or command
for independent verification, status (initially unmet), closed_by (initially
null). The opening motion must reference this checklist and provide evidence
for each item.

### Pair 2 — Opening motion contract and panel staging

**New file:** `.nexus/deliberation/cr05-first-agent-voted-motion-contract.md`

The governed contract defining what a valid first Corpus V2 motion looks like.
Sections: minimum panel composition, required evidence artifacts, what the
opening motion establishes vs. what it merely inherits, and what a valid
agent ratification in the new era looks like (as distinct from the structural
CR-04 proof).

**New file:** `.nexus/deliberation/cr05-panel-staging-guidance.yaml`

Structured guidance for how panel composition should evolve from Corpus V1
unanimous consent to Corpus V2 agent-participated ratification. Records the
staged transition decision — what the opening motion uses for ratification,
what Corpus V2 motions after the opening use, and the governance reasoning
for the transition approach chosen.

### Pair 3 — Context inheritance and arc registration

**New file:** `.nexus/deliberation/cr05-inherited-context-packet.md`

The governed list of Corpus V1 artifacts that carry forward into Corpus V2
unchanged, those that must be extended by the opening motion, and those that
are Corpus V1-specific and do not carry forward. This packet is the
authoritative inheritance record — the opening motion references it rather
than asserting inheritance informally.

**Updated file:** `.nexus/programs/program-graph.yaml`

Registers the `q2-cr05-opening-planning` program under the
corpus-v2-readiness-blockers epic with motion-0122 as first entry.

**New file:** `.nexus/programs/q2-cr05-opening-planning-launch-packet.md`

The launch packet for this opening-planning arc. Self-contained: covers goal,
done-when condition, baseline, constraints, decomposition, and first-motion
scope. Done-when: all six Pair 1-3 artifacts are committed and ratified; the
opening boundary conditions are machine-checkable from the cr05-opening-checklist;
the next motion in this line (the actual Corpus V2 opening event) has a
complete brief and pre-committed bar to execute against.

---

## What this motion does NOT do

- Does not author the Corpus V2 opening motion
- Does not declare Corpus V2 started
- Does not ratify the opening motion or declare CR-05 met
- Does not assert that CR-03 is closed (it remains at 4/5; this motion may
  qualify as the 5th if later implemented and ratified well, but that is a
  consequence of good work, not the purpose)
- Does not reopen normalization (CR-06 tracking is a parallel track)
- Does not widen into OffBook.ai rollout work
- Does not modify runtime, portal, UI, or DB behavior
- Does not change the agent vote protocol or seat contracts
- Does not simulate a Corpus V2 ratification process

---

## Success criteria

1. `.nexus/docs/cr05-opening-boundary.md` exists with falsifiable pre-conditions,
   explicit non-conditions, and a hard stop against opening-before-ready.
2. `.nexus/deliberation/cr05-opening-checklist.yaml` exists with every item
   independently verifiable from repo state; all items initially `status: unmet`.
3. `.nexus/deliberation/cr05-first-agent-voted-motion-contract.md` exists with
   minimum panel composition, required evidence artifacts, and a clear
   distinction between what the opening motion establishes and what it inherits.
4. `.nexus/deliberation/cr05-panel-staging-guidance.yaml` exists with a governed
   answer to the ratification-mechanism question for the opening event.
5. `.nexus/deliberation/cr05-inherited-context-packet.md` exists listing which
   Corpus V1 artifacts carry forward, which must be extended, and which are V1-only.
6. `.nexus/programs/program-graph.yaml` registers `q2-cr05-opening-planning` as open.
7. `.nexus/programs/q2-cr05-opening-planning-launch-packet.md` exists with no
   bracketed placeholders.
8. `validate_motion` and `validate_agency` both exit 0.
9. The motion package is strong enough in quality to qualify as the 5th
   post-0118 motion for CR-03 purposes — but this is assessed after
   implementation and ratification, not asserted here.
