# Launch Packet: [Program Title] — [First Motion Title]

<!-- 
  INSTRUCTIONS FOR USE
  --------------------
  Copy this template. Replace all [bracketed placeholders]. Delete this
  comment block before committing.

  A launch packet is the governed artifact that opens a new planned motion
  line. It must be self-contained: any agent or operator reading it should
  be able to execute the first motion without external instruction.

  Produce one launch packet per program or major motion line, completing
  all 9 planning phases (see .nexus/docs/corpus-v1-program-planning-canon.md)
  before filling this template.

  This launch packet covers the FIRST motion in the planned line. Subsequent
  motions inherit context from this packet (and any updates to it produced
  by intervening motions). See context inheritance rules at:
  .nexus/docs/corpus-v1-program-planning-canon.md §Context inheritance rules
-->

**Program:** [program_id]
**First motion:** [motion_id — e.g., motion-0119]
**Branch:** [sprint/q2-<short-description>-<motion-id>]
**Prepared:** [iso8601 date]
**Prepared by:** [operator / role]

---

## 1. Goal

<!-- Phase 1 output. One sentence. -->
[One-sentence goal statement.]

### Done when

<!-- Explicit, falsifiable completion condition. Not "when the work is done" — what specific state must be true. -->
[Done when: ...]

### Success criteria

<!-- 3–7 items. Each must be independently verifiable. -->
1. [criterion]
2. [criterion]
3. [criterion]

---

## 2. Baseline

<!-- Phase 2 output. What is already true. What is already correct. What is missing. -->

### Relevant prior motions

| Motion | What it established |
|---|---|
| [motion-NNNN] | [one-line summary] |

### Relevant substrate artifacts

- [`.nexus/context/...`]

### Current state

<!-- One paragraph. What exists, what is correct, what is missing or broken. -->
[Current state summary.]

---

## 3. Constraints

<!-- Phase 3 output. -->

### Hard constraints — must not be violated

<!-- Items that would block ratification if violated. -->
- [constraint]

### Soft constraints — preserve unless stated reason

<!-- Preferred patterns, naming conventions, role discipline. -->
- [constraint]

---

## 4. Decomposition

<!-- Phase 4 output. Each motion described as input → change → output. -->

| Motion (tentative) | Description | Input state | Change | Output state |
|---|---|---|---|---|
| [motion-NNNN+0] | [description] | [input] | [change] | [output] |
| [motion-NNNN+1] | [description] | [input] | [change] | [output] |

---

## 5. Dependency graph

<!-- Phase 5 output. Use table or Mermaid diagram. Confirm it is a DAG. -->

| From | To | Type | Condition (if conditional) |
|---|---|---|---|
| [motion-NNNN+0] | [motion-NNNN+1] | sequential | — |

**Critical path:** [ordered list of motion_ids on the longest sequential chain]

**Parallel tracks (if any):** [list of motions that may proceed simultaneously]

---

## 6. Agent / panel strategy

<!-- Phase 6 output. For Corpus V1: operator + Claude operating mode. -->

| Motion | Operating mode | Notes |
|---|---|---|
| [motion-NNNN+0] | [strategic-project \| motion-implementation \| closeout-passalong] | [notes] |

<!-- For Corpus V2 (when applicable — not yet):
     Replace operating mode with panel seat assignments.
     Mechanism defined in Corpus V2 canon. -->

---

## 7. First motion scope

<!-- What the first motion in this line does — and explicitly does not do. -->

### In scope

- [specific file or artifact created/changed]

### Out of scope

- [explicit exclusion]

---

## 8. What the first motion must prove

<!-- Explicit exit criteria. What must be true after the first motion for the second motion to begin. -->

The first motion ([motion-NNNN+0]) enables the second ([motion-NNNN+1]) when:

1. [specific, falsifiable condition]
2. [specific, falsifiable condition]

If any condition is not met, pause and re-scope before opening motion-NNNN+1.

---

## 9. Cost estimate and escalation

<!-- Phase 8 output. -->

### Estimate

| Dimension | Estimate |
|---|---|
| Sessions | [N] |
| Motions | [N] |
| Primary surfaces | [docs \| schemas \| portal \| governance artifacts] |

### Escalation triggers

<!-- Conditions under which this program should pause or re-scope. -->
- [trigger]

### Clean exit checkpoints

| Checkpoint | Repo state if execution stops here |
|---|---|
| After [motion-NNNN+0] | [what is true and what is incomplete] |

---

## Context inheritance for subsequent motions

<!-- Record which fields subsequent motions inherit from this packet. -->

Subsequent motions in this line inherit the following without restatement:

- Goal framing (§1)
- Hard constraints (§3)
- Dependency graph structure (§5) unless a motion changes sequencing

Motions must restate if changed:

- Baseline (§2) — if repo state changed since prior motion
- Soft constraints (§3) — if a convention was adjusted with stated reason
- First motion scope (§7) — replaced by each motion's own scope section

Motions must not re-litigate:

- Resolved challenges from prior motions in this line (unless new evidence)
- Success criteria already verified by prior motions

---

<!-- 
  LAUNCH PACKET UPDATE INSTRUCTIONS
  ----------------------------------
  When a motion in this line completes, it may produce an updated launch
  packet for the next motion. The updated packet:
  - Is filed at .nexus/programs/<program_id>-launch-packet-<motion_id>.md
  - Supersedes this packet for the remaining line
  - Must note what changed and why at the top of the document
  - Does not need to repeat unchanged sections verbatim — reference this
    packet for unchanged sections and restate only what changed
-->
