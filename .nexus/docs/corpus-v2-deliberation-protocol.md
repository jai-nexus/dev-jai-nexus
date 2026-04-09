# Corpus V2 Deliberation Protocol v0

**Established:** motion-0124
**Date:** 2026-04-08
**Version:** v0
**Status:** authoritative for motions 0125 and onward

---

## 1. Authority and scope

This document is the governing operating manual for post-opening Corpus V2 motion
deliberation. It takes effect for all motions numbered 0125 and onward in the
dev-jai-nexus corpus. It does not retroactively govern motion-0124 (the establishing
motion) or any prior motion.

**Foundation:** The Corpus V2 canon baseline (`.nexus/docs/corpus-v2-canon-baseline.md`,
established by motion-0123) defines three governing principles:

1. At least one registered panel-seat agent must evaluate each motion
2. An agent BLOCK must be addressed in decision.md before the panel overrides
3. Advisory weight means the agent's conclusion informs but does not gate the
   human panel's ratification

This protocol operationalizes those principles. Where the canon baseline states
requirements, this document specifies the exact form they take in practice.

**Hierarchy:** This protocol is subordinate to the canon baseline. In any conflict,
the canon baseline governs. This protocol is updated only by a subsequent ratified
governance-policy motion that explicitly names this document as a target.

**Machine-readable source of truth:** The per-tier seat routing matrix is the
canonical seat assignment schema for each escalation tier. See:
`.nexus/deliberation/corpus-v2-tier-seat-matrix.yaml`

---

## 2. Per-tier seat routing

Each motion is assigned an escalation tier in its `policy.yaml` at ratification.
Before ratification, the tier is declared in execution.md (cost section) and
subject to challenge. The tier determines which seat evaluations are mandatory.

### Tier 0 — Trivial repair

**Definition:** Corrections to committed artifacts with no governance impact —
typos, broken file references, manifest formatting errors. No new artifacts, no
policy changes, no scope expansion.

**Mandatory seats:** evidence-falsifiability
**Optional seats:** none
**Minimum evaluations:** 1

**Ratification note:** A single evidence-falsifiability evaluation is sufficient.
The evalutation focuses on whether the repair is actually trivial and contains no
scope expansion.

---

### Tier 1 — Standard motion

**Definition:** The default tier for motions that introduce new artifacts, extend
an existing system, or close a tracked criterion. No novel infrastructure, no
cross-program authority, no changes to core governance policy documents.

**Mandatory seats:** evidence-falsifiability
**Optional seats by motion kind:**
- `governance-policy` → governance-safety available
- `implementation` → execution-pragmatism available
- `architecture` → architecture available
- `documentation` → (no optional seat defined)

**Cost-driven escalation:** If the declared cost category is `substantial` or
`major`, the cost-discipline seat is required regardless of motion kind. This
converts a Tier 1 optional cost review into a mandatory one.

**Minimum evaluations:** 1 (mandatory); optional seats used at author/panel discretion

---

### Tier 2 — High-stakes

**Definition:** Motions that meet any of the following:
- Change core governance policy documents (this protocol, the canon baseline,
  the escalation ladder, seat contracts)
- Expand or restrict agent authority or seat assignments
- Introduce or modify the program graph's era entries or program status
- Declare a tier elevation flag (`novelty_flag: true` or `high_stakes: true` in
  policy.yaml)
- Declared cost category is `major` (>500k tokens estimated agent context)

**Mandatory seats:** evidence-falsifiability, cost-discipline, governance-safety
**Optional seats:** any of the remaining three seat contracts
**Minimum evaluations:** 3 (one per mandatory seat; may be produced by the same
agent from three separate seat perspectives — see §5)

**Ratification gate:** All three mandatory seat evaluations must be present in
committed repo state before ratification. A BLOCK from any mandatory seat must be
addressed in decision.md. The panel may override a BLOCK with explicit written
rationale; the override is itself subject to evidence-falsifiability review.

---

### Tier 3 — Escalated (ratification blocked)

**Definition:** Motions where the evidence-falsifiability evaluation finds that
a material claim cannot be resolved from committed repo state, or where a
BLOCK from a mandatory seat cannot be addressed without additional governed
work. Tier 3 is not declared in advance — it is the output of an evaluation
that cannot reach PASS.

**Required action:** The evidence-falsifiability seat documents the specific
uncertainty or unresolvable claim in the evaluation trace. Ratification is
blocked until the uncertainty is resolved by a separate motion or by new
evidence committed to the repo.

**Minimum evaluations:** evidence-falsifiability (documenting the uncertainty)
**Ratification:** blocked until resolution

---

## 3. Cost discipline integration

### Declaration

Every motion must declare a cost category in `execution.md` in the following
form:

```
## Cost estimate
Category: [minimal | standard | substantial | major]
Basis: [one sentence explaining why this category applies]
```

The declared category informs tier assignment and seat routing.

### Categories

| Category | Rough scope | Tier 1 → Tier 2 trigger |
|---|---|---|
| minimal | <10k tokens estimated agent context; single artifact; no novel infrastructure | No trigger |
| standard | 10k–500k tokens; multiple artifacts; no new priced dependencies | No trigger |
| substantial | 500k–2M tokens; multiple sessions; or introduces new priced dependencies | Cost-discipline seat required (Tier 2 threshold) |
| major | >2M tokens; or changes to substrate/runtime; or multi-program scope | Tier 2 mandatory |

These thresholds are calibrated for estimation, not billing precision. They are
contestable by any panel member: a challenger may assert that a declared
`standard` motion should be `substantial` if the scope evidence supports it.
False categorization is a quality-standard failure.

### Variance

The declared category is a pre-execution estimate. If the actual execution scope
diverges materially from the estimate (e.g., additional implementation pairs were
added mid-execution), the updated category must be noted in the evidence checklist
section of execution.md before ratification. Undeclared scope expansion without
a category update is a cost-discipline block condition.

---

## 4. Escalation enforcement

### PASS

The agent evaluation trace sets `pass_or_block: PASS`. Ratification may proceed
subject to human panel unanimous consent (or other ratification mechanism
in force for the era).

The agent's PASS is advisory. The panel ratifies; the agent witnesses.

### BLOCK

The agent evaluation trace sets `pass_or_block: BLOCK` and names the
`block_condition` triggered. The specific block condition entry from the seat
contract must be quoted or cited in the trace.

**Required response before ratification:**
1. The motion author or challenger must add a `## Agent BLOCK Response` section
   to decision.md that:
   - Names the triggered block condition
   - States what artifact or action resolves it
   - Either: (a) commits the resolving artifact and notes it as resolved, or
     (b) explains why the panel is overriding the BLOCK (override requires
     explicit rationale, not just disagreement)
2. The agent evaluation trace must reference the decision.md response location.
3. If the BLOCK is resolved by committing a new artifact, a follow-up evaluation
   trace entry should confirm the resolution (or the evidence checklist should
   include a binary check that the resolving artifact exists and is correctly
   formed).

A BLOCK that is not addressed in decision.md makes the motion non-ratifiable.

### ESCALATE

The agent evaluation trace sets `pass_or_block: ESCALATE` when a concern does
not clearly trigger a block condition but rises above an advisory note. ESCALATE
is not a BLOCK — ratification is not gated. However:
1. The ESCALATE finding must be acknowledged in decision.md.
2. If the panel proceeds over an ESCALATE finding, the decision.md must note
   what monitoring or follow-up motion addresses the concern, or why no
   follow-up is warranted.

Ignored ESCALATE findings with no decision.md acknowledgment constitute a
evidence-falsifiability quality gap in the ratification record.

---

## 5. Multi-seat evaluation with a single agent

### Context

The current agent pool has one registered agent
(`nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001`) with seat assignments for
three seats: evidence-falsifiability (seat_001), cost-discipline (seat_002), and
governance-safety (seat_003). Tier 2 requires evaluations from all three mandatory
seats.

### Operating mechanics

A single registered agent may produce evaluations from multiple seat perspectives
when all of the following hold:

1. The agent has a valid seat assignment file for each seat being evaluated
2. Each evaluation is a **separate evaluation trace file**, one per seat
3. Each trace file references the specific seat contract it is operating under
   (via `seat_contract_ref` and `seat_contract_version`)
4. Each trace independently addresses the `distinctive_questions` and checks
   all `block_conditions` from that seat's contract
5. The non-independence limitation is explicitly stated in each trace:
   "This evaluation is produced by the same model as the other seat evaluations
   for this motion. The traces are independent in reasoning scope but share the
   same underlying model. This is a structural proof, not adversarial independence."

### Naming convention

Evaluation trace files for multi-seat evaluations follow the pattern:
```
{agent_id}-motion-{XXXX}-{seat_id}-trace.yaml
```

Example for Tier 2:
- `nhid_2_..._panel_seat_001-motion-0125-evidence-falsifiability-trace.yaml`
- `nhid_2_..._panel_seat_001-motion-0125-cost-discipline-trace.yaml`
- `nhid_2_..._panel_seat_001-motion-0125-governance-safety-trace.yaml`

### agent-vote.json for multi-seat evaluations

A Tier 2 motion with three seat evaluations produces three `agent-vote.json`-style
records. The canonical motion-level agent participation record is the primary
evidence-falsifiability vote. The cost-discipline and governance-safety evaluations
are referenced in the verify.json implementation checks.

### Limitation acknowledgment

The non-independence of multi-seat single-agent evaluations is a known limitation
of the current operating state. It is accepted because:
- The alternative (blocking all Tier 2 motions until a second agent registers)
  would halt the operational arc
- The limitation is honestly stated in every trace and ratification record
- The human panel retains full ratification authority and is not bound by any
  single-agent evaluation

When a second independent agent is registered, Tier 2 evaluations should route
one mandatory seat to each registered agent. This protocol does not mandate the
split assignment; a subsequent governed motion may.

---

## 6. Protocol evolution

This protocol is updated only by a ratified governance-policy motion that:

1. Explicitly names this document (`.nexus/docs/corpus-v2-deliberation-protocol.md`)
   as a target artifact
2. Increments the version field (v0 → v1, etc.)
3. Includes a changelog entry summarizing what changed and why
4. Is itself evaluated at Tier 2 (as a change to a core governance policy document)

Minor corrections (typos, broken references, formatting) may be made as a
Tier 0 repair without incrementing the version, provided no normative content
changes.

**Version history:**

| Version | Motion | Date | Summary |
|---|---|---|---|
| v0 | motion-0124 | 2026-04-08 | Initial protocol — tiered seat routing, cost discipline integration, escalation enforcement, single-agent multi-seat mechanics |
