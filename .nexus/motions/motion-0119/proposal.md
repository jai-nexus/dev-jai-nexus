# Proposal: Corpus V1 Deliberation Readiness v0 — executable seat differentiation, cost-aware escalation, and launch-packet activation

**Motion:** motion-0119
**Kind:** documentation
**Date:** 2026-04-04

---

## Where we are

motion-0118 delivered the Corpus V1 Program Planning Canon v0: the 9-phase
planning workflow, program graph vocabulary, context inheritance rules, motion
quality standard, and the launch-packet template. The repo now has the
theoretical foundation for strategic motion authoring.

What it does not yet have is the executable layer that turns that foundation
into actual deliberation work.

The gap is not more theory. The gap is activation.

---

## The gap: named vs. executable

motion-0118 named six seat perspectives for Corpus V2 panel composition:

- Cost discipline
- Architecture
- Governance / safety
- Operator usability
- Evidence / falsifiability
- Execution pragmatism

These are named. They are not yet executable. A named perspective without a
contract is a label. A contract defines:

- What this seat is specifically responsible for evaluating
- What questions this seat must ask that no other seat asks
- What a PASS looks like from this seat's perspective (specific, not generic)
- What a BLOCK from this seat looks like — the exact conditions under which
  this seat would vote no or escalate
- How this seat's reasoning shape differs materially from every other seat

Until each seat has a contract, a multi-seat panel is just multiple people
(or agents) each running the same generic review. Differentiation must be
explicit, enforced, and verifiable — not assumed from a job title.

---

## The second gap: cost-aware deliberation

Deliberation has a cost. In Corpus V1, that cost is operator time and context
window. In Corpus V2, it is token spend, latency, and panel coordination
overhead. Neither era has a governed escalation ladder.

The result: every motion is treated with the same deliberation weight
regardless of its actual risk, complexity, or downstream impact. A one-line
governance repair gets the same review process as a schema change that
touches six consumers. This is economically irrational.

A cost-aware escalation ladder defines:

- **Tier 0** — Trivial repairs: minimum viable deliberation (gate check + 1
  reviewer). Fast, cheap, appropriate for single-artifact repairs.
- **Tier 1** — Standard motions: full 5-dimension quality check, all three
  roles. The current default.
- **Tier 2** — High-stakes motions: full quality check + mandatory adversarial
  challenge + explicit risk score justification. Required for motions touching
  substrate, runtime, or governance policy.
- **Tier 3** — Escalated / uncertain: deliberation paused pending additional
  context, a baseline read, or explicit stakeholder input. Reserved for
  motions where the right answer is not known yet.

The escalation ladder makes automation economically viable: cheap tiers can
be automated at low cost; expensive tiers are reserved for decisions that
warrant the spend.

---

## The third gap: launch-packet activation

motion-0118 created the launch-packet template. The template exists as a
markdown file with bracketed placeholders. There is no governed activation
path: no defined sequence for how a filled-in launch packet becomes a real
motion package ready for execution.

The activation path must define:

1. How a filled-in launch packet is validated (schema-check, completeness
   review, constraint consistency)
2. How it is converted into a motion-ready state: which motion package files
   it populates, how context inheritance is recorded
3. How subsequent motions in the line inherit and update the launch packet
4. What the launch-packet hand-off looks like when a session ends and the
   next session begins

Without the activation path, the launch packet is a planning artifact that
lives in isolation from the motion work it is supposed to enable.

---

## The fourth gap: motion-folder phase quality

The six motion-package files (motion.yaml, proposal.md, challenge.md,
execution.md, decision.yaml, decision.md) are well-defined structurally. They
are inconsistently authored in practice. Across Corpus V1:

- Some challenges raise genuine adversarial objections; others raise easy
  ones constructed to be dismissed.
- Some execution.mds list exact commands; others describe steps narratively
  without specifying the verifiable output.
- Some decision.mds explain why the vote is correct; others state that it
  passed.

The quality standard from motion-0118 defines the five dimensions. What is
missing is phase-specific authoring guidance: what does a high-quality
challenge.md actually look like, structurally? What makes an execution.md
verifiable rather than merely descriptive?

Phase-level guidance converts the five abstract quality dimensions into
concrete authoring instructions per file. This is the missing link between
"we have a quality standard" and "we are consistently producing high-quality
motion packages."

---

## The fifth gap: honest pre-Corpus-V2 readiness

Corpus V2 begins at the first true JAI Agent-voted motion. That transition
should not happen by drift — by a moment when someone decides to call a motion
"agent-voted" without a defined readiness state. It should happen by
deliberate transition governed by a readiness checklist that the corpus
actually meets.

The readiness criteria must be:

- Specific and falsifiable (not "the system feels ready")
- Grounded in observable corpus state (not predicted future behavior)
- Honest about what is still unproven (not optimistic about things not yet tested)
- Actionable: each unmet criterion points to a specific motion that could close it

This is the final Corpus V1 deliverable: a document that the repo can either
hold up and say "we meet all of these" — or use to identify what still needs
to be done before the transition.

---

## What this motion produces

### Primary implementation artifacts

**`.nexus/deliberation/seat-contracts/`** — six per-seat contract files:

```
cost-discipline.yaml
architecture.yaml
governance-safety.yaml
operator-usability.yaml
evidence-falsifiability.yaml
execution-pragmatism.yaml
```

Each contract defines: seat responsibility, distinctive questions, PASS
criteria, BLOCK conditions, and reasoning shape. Together they make panel
differentiation enforced rather than assumed.

**`.nexus/deliberation/escalation-ladder.yaml`**

The four-tier escalation ladder with: tier definitions, trigger conditions
(risk score thresholds, surface type, uncertainty flag), required deliberation
steps per tier, and automation eligibility per tier.

**`.nexus/docs/corpus-v1-deliberation-readiness.md`**

The primary narrative. Ties the six seat contracts, the escalation ladder,
and the motion-folder phase guide into a coherent deliberation readiness
picture. Explains how these components work together in practice, with a
worked example for a representative Corpus V1 motion.

**`.nexus/docs/motion-folder-phase-guide.md`**

Concrete authoring guidance for each of the six motion-package files. Per
file: structural requirements, common failure modes, and a before/after
example contrasting a weak and a strong version. References the motion
quality standard dimensions.

**`.nexus/programs/launch-packet-activation.md`**

The governed activation path for the launch packet template: how a filled-in
launch packet is validated, how it populates a motion package, how subsequent
motions inherit and update it, and what a clean session hand-off looks like.

**`.nexus/docs/corpus-v2-readiness-criteria.md`**

The honest, falsifiable readiness checklist for the Corpus V2 transition.
Per criterion: description, current status (met / unmet / unknown), and the
motion or action that would close an unmet criterion.

---

## What this motion does NOT do

- Does not start Corpus V2. The transition requires the readiness checklist
  to be met, not just written.
- Does not implement JAI Agent vote infrastructure. That is Corpus V2 scope.
- Does not pretend that current manual votes are agent votes.
- Does not reopen the normalization arc or any prior repair motions.
- Does not change runtime, UI, DB, or portal behavior.
- Does not add package.json scripts or portal dependencies.
- Does not widen into OffBook.ai rollout work.

---

## Why this is the right final major Corpus V1 arc

After motion-0119, the repo will have:

1. Planning canon (motion-0118): vocabulary, 9-phase workflow, program graph
2. Deliberation readiness (motion-0119): seat contracts, escalation ladder,
   launch-packet activation, phase quality guide, V2 readiness criteria

That is a complete Corpus V1 governance foundation. What comes after is either
addressing unmet items from the V2 readiness checklist, or the Corpus V2
transition itself.

motion-0119 is the line that converts planning theory into executable
deliberation workflow. It is broad enough to justify a full branch arc
(roughly 8–12 commits), coherent enough to stay on one branch, and bounded
enough to ratify as a single program unit.

---

## Success criteria

- Six seat contract files committed under `.nexus/deliberation/seat-contracts/`,
  each with differentiated reasoning shape (not just renamed copies).
- Escalation ladder committed with four tiers, clear trigger conditions, and
  automation eligibility flags.
- Primary deliberation readiness doc committed and internally consistent.
- Motion-folder phase guide committed with concrete before/after examples.
- Launch-packet activation path committed and consistent with the template
  in `.nexus/programs/motion-launch-packet.template.md`.
- V2 readiness criteria committed with honest current-status assessments.
- All six quality dimensions (from motion quality standard) satisfied for this
  motion package itself.
- validate_motion and validate_agency pass for motion-0119.
