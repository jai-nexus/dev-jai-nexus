# Proposal: Corpus V2 Deliberation Protocol v0 — tiered agent seat routing, cost discipline gates, and escalation enforcement

**Motion:** motion-0124
**Kind:** governance-policy
**Date:** 2026-04-08

---

## Where we are

Corpus V2 is open. motion-0123 ratified the era transition, committed the canon
baseline, and established the requirement that all post-opening motions include
advisory agent participation. That is the foundation. It is not the operating
manual.

The canon baseline (`.nexus/docs/corpus-v2-canon-baseline.md`) states three
things about post-opening deliberation:

1. At least one registered panel-seat agent must evaluate each motion
2. An agent BLOCK must be addressed in decision.md before the panel overrides
3. Advisory weight means the agent's conclusion informs but does not gate the
   human panel's ratification

What the canon baseline does not specify — and explicitly deferred to subsequent
governed motions — is:

- **Which seat(s) evaluate which tier motions.** The escalation ladder says
  "Cost Discipline and Governance/Safety seats are mandatory for Tier 2" but
  no artifact maps this to actual seat evaluations for a motion. The matrix
  doesn't exist.
- **How cost discipline integrates as a pre-execution gate.** Cost discipline
  is one of the six seat contracts; it has no operational integration with the
  motion lifecycle.
- **What BLOCK and ESCALATE concretely require.** "Must be addressed in
  decision.md" is a principle; the protocol specifies the exact form.
- **How a single agent covers multiple mandatory seat perspectives.** The
  current agent pool has one registered agent assigned to one seat. Tier 2
  requires three mandatory seat evaluations. The resolution is seat assignment
  extension; the mechanics need to be governed.

This motion fills those gaps. It is not a proof of concept or a structural
demonstration. It is the operating manual for deliberation in the Corpus V2 era.

---

## What this motion makes real

### 1. The Corpus V2 deliberation protocol document

**New file:** `.nexus/docs/corpus-v2-deliberation-protocol.md`

The authoritative protocol document governing how post-opening Corpus V2 motions
are deliberated. Sections:
- Authority and scope (what it governs, effective from motion-0125 onward)
- Per-tier seat routing (which seats evaluate which tiers)
- Cost discipline integration (pre-execution estimate, categories, tier elevation)
- Escalation enforcement (PASS/BLOCK/ESCALATE operational handling)
- Multi-seat evaluation with a single agent (seat assignment extension mechanics)
- Protocol evolution (how this protocol is updated)

This document is the governing reference. Everything else in this motion
package is falsifiable against it.

### 2. The tier-seat routing matrix

**New file:** `.nexus/deliberation/corpus-v2-tier-seat-matrix.yaml`

The machine-readable per-tier seat assignment schema. Maps each escalation tier
(0–3) to mandatory seats, optional seats, and minimum evaluation counts. The
protocol document references this file; this file is the canonical source of
truth for which seats must evaluate a given motion.

Per-tier routing:
- **Tier 0 (trivial repair):** evidence-falsifiability mandatory; 1 evaluation minimum
- **Tier 1 (standard motion):** evidence-falsifiability mandatory; 1 domain-relevant
  optional seat per motion kind (governance-policy → governance-safety; implementation
  → execution-pragmatism; cost-declared-substantial+ → cost-discipline required)
- **Tier 2 (high-stakes):** evidence-falsifiability + cost-discipline + governance-safety
  all mandatory; 3 evaluations minimum (may be produced by same agent from 3 seat perspectives)
- **Tier 3 (escalated):** evidence-falsifiability documents the uncertainty; ratification
  blocked until resolution

### 3. Seat assignment extension for Tier 2 coverage

**New files:** `.nexus/deliberation/seat-assignments/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_002.yaml`
             `.nexus/deliberation/seat-assignments/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_003.yaml`

The current agent (`nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001`) is
assigned only to the evidence-falsifiability seat. Tier 2 requires cost-discipline
and governance-safety evaluations. Rather than leaving Tier 2 operationally blocked
until a second agent is registered, this motion extends the existing agent's seat
coverage to include cost-discipline and governance-safety.

Operationally: the same agent can produce three separate evaluation traces from
three seat perspectives (one trace per seat, each consuming the respective seat
contract's distinctive_questions and block_conditions). The non-independence
limitation (same underlying model for all three traces) is acknowledged in each
trace. This is the same structural-proof caveat that applied to motion-0121 and
motion-0123 — it is a known limitation, honestly stated.

The seat assignment files are named with seat-specific suffixes (_002 for
cost-discipline, _003 for governance-safety) to distinguish them from the
evidence-falsifiability assignment.

### 4. First Corpus V2 program and epic in program-graph.yaml

**Updated file:** `.nexus/programs/program-graph.yaml`

The corpus-v2 era entry currently has `epics: []`. This motion opens the first
epic and program:

- **Epic:** `corpus-v2-live-value-operations` — the overarching Corpus V2 era
  operational arc. Encompasses all motions that make Corpus V2 real as an operating
  governance system, not just a ratified transition.
- **Program:** `q2-corpus-v2-live-value-loop` — the specific program governing
  this branch's work. Parent motion: motion-0124.

This is the governed home for all motions on this branch and subsequent branches
in the operational arc. Without it, post-opening motions are uncategorized.

### 5. CR-06 promoted to met and corpus-v2-readiness-criteria.md updated

**Updated file:** `.nexus/docs/corpus-v2-readiness-criteria.md`

CR-06 criterion: all truly open motions identified by corpus audit (motion-0111)
are ratified. Closing action: "Confirm motion-0112 is ratified." motion-0112
status: RATIFIED (2026-04-01). All four anomalies are resolved. CR-06 is met.

This is a confirmation action. No new closure work is required. The criteria
doc is updated to reflect the confirmed state. Summary advances from 8 met /
1 partial / 1 unmet to 9 met / 0 partial / 1 unmet.

CR-07 (program graph completeness for motions 0001–0070) remains unmet. It is
a parallel track not addressed by this motion.

---

## What this motion does NOT do

- Does not modify agents.generated.yaml (no new agent registrations)
- Does not change the agent vote protocol (v0.1 carries forward)
- Does not change the six seat contracts (carry forward from Corpus V1)
- Does not touch runtime, portal, UI, DB, or registry files
- Does not close CR-07 (documentation task, not this branch's scope)
- Does not govern agent-authored proposals (deferred from motion-0123, still deferred)
- Does not change escalation-ladder.yaml (the ladder is the authority; this
  motion adds the seat routing matrix that operationalizes it)

---

## Success criteria

1. `.nexus/docs/corpus-v2-deliberation-protocol.md` committed with 6 sections
   (authority/scope, per-tier seat routing, cost discipline integration, escalation
   enforcement, multi-seat evaluation, protocol evolution)
2. `.nexus/deliberation/corpus-v2-tier-seat-matrix.yaml` committed with Tier 0–3
   entries, each specifying mandatory seats, optional seats, and minimum evaluation count
3. Two additional seat assignment files committed for the existing agent
   (cost-discipline seat, governance-safety seat)
4. `.nexus/programs/program-graph.yaml` updated: corpus-v2 epic `corpus-v2-live-value-operations`
   added; program `q2-corpus-v2-live-value-loop` added with motion-0124 as parent_motion
5. `.nexus/programs/q2-corpus-v2-live-value-loop-launch-packet.md` committed
6. `.nexus/docs/corpus-v2-readiness-criteria.md` CR-06 → met; summary 9/0/1
7. This motion's own advisory agent evaluation trace committed (evidence-falsifiability
   seat, Tier 2 evaluation) + agent-vote.json
8. `validate_motion` exit 0; `validate_agency` exit 0

All success criteria must be confirmed from committed repo state. No criterion
may be satisfied by author assertion alone.
