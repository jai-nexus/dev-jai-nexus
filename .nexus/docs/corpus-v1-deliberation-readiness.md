# Corpus V1 Deliberation Readiness v0

**Established:** motion-0119
**Date:** 2026-04-04

---

## Overview

This document ties together the three deliberation readiness components
produced by motion-0119:

1. **Six seat contracts** (`.nexus/deliberation/seat-contracts/`) — per-seat
   YAML files that define what each of the six Corpus V2 panel perspectives is
   responsible for, what questions it asks that no other seat asks, and the
   exact PASS and BLOCK conditions for that seat.

2. **Escalation ladder** (`.nexus/deliberation/escalation-ladder.yaml`) — a
   four-tier framework that assigns a deliberation weight to each motion based
   on its risk score and surface type. Tier 0 is a trivial repair; Tier 3 is
   a paused escalation. Tiers determine required deliberation steps and
   automation eligibility.

3. **Motion-folder phase guide** (`.nexus/docs/motion-folder-phase-guide.md`)
   — concrete authoring guidance for each of the six motion-package files,
   with before/after examples of weak vs. strong authoring.

Together, these components convert the planning vocabulary from motion-0118
into an executable deliberation workflow. Before motion-0119, a deliberation
pass meant "run the validators and review the proposal." After motion-0119, a
deliberation pass means: determine the escalation tier, cycle through each
seat contract as a structured checklist, and verify that the evidence chain
satisfies the quality standard dimensions.

---

## How to use the seat contracts in Corpus V1

In Corpus V1, there are no real JAI Agent panel seats. The seat contracts
serve as structured deliberation checklists for the human operator working
with Claude. Using them produces materially better deliberation quality than
a generic review, and ensures the contracts are grounded in observed practice
rather than theoretical prediction when Corpus V2 begins.

**Workflow for each motion:**

1. **Determine the escalation tier** using `.nexus/deliberation/escalation-ladder.yaml`:
   - Read the motion's `policy.yaml` risk_score (or estimate it if pre-ratification).
   - Check non-numeric triggers: does the motion touch substrate, runtime, or
     governance-policy surface? Is it the first of its kind (novelty_flag)?
     Are there open conditional challenges (uncertainty_flag)?
   - Assign the highest applicable tier. Record it in `policy.yaml` under
     `escalation_tier`.

2. **Apply the required deliberation steps** for that tier:
   - Tier 0: gate check + single reviewer confirmation.
   - Tier 1: full 5-dimension quality check, all three roles, validators pass.
   - Tier 2: Tier 1 requirements + mandatory adversarial challenge + explicit
     risk justification in policy.yaml notes.
   - Tier 3: pause, identify the uncertainty, resolve it before proceeding.

3. **Cycle through the seat contracts as checklists** (at Tier 1 and above):
   For each seat contract, read the `distinctive_questions` section and confirm
   the motion addresses them. Read the `block_conditions` and confirm none apply.
   If a block condition applies, the motion must be revised or the block must
   be explicitly waived with a stated rationale in decision.md.

4. **Record the deliberation** in decision.md: which seats were evaluated, which
   block conditions were checked and cleared, and why the vote is correct given
   the full seat-by-seat assessment.

**Note:** In Corpus V1, the same operator is exercising all six seat perspectives.
The value is not multi-agent diversity — it is structured coverage. Cycling
through six distinct perspectives forces the review to ask questions it would
not ask from a single generic perspective.

---

## How escalation tier is determined

Tier assignment follows this decision tree:

```
1. Read risk_score from policy.yaml (or estimate before ratification).
2. Start at risk_score-implied tier:
   - 0.00–0.05 → Tier 0
   - 0.06–0.19 → Tier 1
   - 0.20+     → Tier 2
3. Check non-numeric escalation triggers:
   - surface_type == substrate | runtime → escalate to at least Tier 2
   - surface_type == governance-policy → escalate to at least Tier 1
   - novelty_flag == true → escalate to at least Tier 2
   - uncertainty_flag == true → escalate to Tier 3
4. Final tier = highest tier reached by any trigger.
   Triggers can only escalate, never de-escalate.
5. Record tier in policy.yaml: escalation_tier field.
   If tier exceeds risk_score-implied level, note the trigger.
```

---

## Mapping to the motion quality standard

The five quality dimensions from `.nexus/docs/motion-quality-standard.md` map
to seat contracts as follows. When a seat contract's block conditions are cleared,
the corresponding quality dimensions are satisfied:

| Quality dimension | Primary seat(s) |
|---|---|
| Proposal precision | Architecture, Operator Usability |
| Challenge adversarialism | Governance/Safety, Execution Pragmatism |
| Execution specificity | Operator Usability, Execution Pragmatism |
| Evidence traceability | Evidence/Falsifiability |
| Decision rationale | Evidence/Falsifiability, Governance/Safety |

A motion that clears all six seat contracts at the appropriate tier has, by
definition, satisfied all five quality dimensions. The seat-contract review
is the structured mechanism by which the quality standard is applied.

---

## Worked example: motion-0115

**Motion:** motion-0115 — GitHub CLI-first operator posture
**Kind:** governance-policy
**Risk score:** 0.08 (from `.nexus/motions/motion-0115/policy.yaml`)
**Surface touched:** governance-policy (`.nexus/codex/codex-exec-policy.md`)

**Step 1 — Determine escalation tier:**
- risk_score 0.08 → Tier 1 implied by score.
- surface_type governance-policy → escalate to at least Tier 1. No further escalation.
- novelty_flag: motion-0115 is the first operator-tool-precedence policy in the corpus → escalate to Tier 2.
- uncertainty_flag: none.
- **Assigned tier: Tier 2** (novelty_flag trigger).

**Step 2 — Required deliberation steps for Tier 2:**
- Full 5-dimension quality check ✓
- All three roles exercised ✓
- Mandatory adversarial challenge ✓ (challenge.md raised C-1 through C-4)
- Explicit risk justification in policy.yaml notes ✓
- Validators pass ✓

**Step 3 — Seat contract cycle:**

*Cost Discipline:* motion-0115 creates one new doc and amends two existing files.
Scope is proportionate to the governance gap it closes. No redundant artifacts.
Block conditions: none triggered. → **PASS**

*Architecture:* New doc placed in `.nexus/docs/` (correct). Amendments to
`.nexus/codex/` follow existing naming. No new schema introduced.
Block conditions: none triggered. → **PASS**

*Governance/Safety:* Motion modifies operator posture policy within Codex surface
it is authorized to touch. Does not change runtime. Era boundary maintained.
Block conditions: none triggered. → **PASS**

*Operator Usability:* `.nexus/docs/github-cli-operator-flow.md` provides concrete
command examples with copy-pasteable `gh` invocations. Phase guide confirms
before/after format is present. → **PASS**

*Evidence/Falsifiability:* vote.json cites committed artifact paths. decision.md
names the specific files changed. verify.json records actual gate commands.
Block conditions: none triggered. → **PASS**

*Execution Pragmatism:* execution.md named exact files and sections. Amendments
were bounded to two specific sections (§8 and `## Operating policy`). No
undocumented dependencies. → **PASS**

**Step 4 — Record:** decision.md for motion-0115 records RATIFIED status. The
example above would strengthen the rationale by citing the seat-by-seat assessment,
establishing a traceability pattern for future Tier 2 decisions.

---

## Forward reference: Corpus V2 use of these artifacts

In Corpus V2, the seat contracts will govern real JAI Agent panel composition
and vote behavior:

- The `distinctive_questions` field will be the primary prompt context for
  each panel agent when evaluating a motion.
- The `block_conditions` field will be machine-checkable where the conditions
  reference structured fields (risk_score, surface_type, novelty_flag).
- The `reasoning_shape` field will inform the operating-mode configuration
  for each seat's agent.
- The escalation ladder's `automation_eligibility` field will gate which tiers
  can be processed without full panel deliberation.

The transition to Corpus V2 does not require rewriting these artifacts — it
requires implementing the agent infrastructure that consumes them. The contracts
are designed to be consumed by agents now. They function as checklists in
Corpus V1 and as agent contracts in Corpus V2 without structural change.
