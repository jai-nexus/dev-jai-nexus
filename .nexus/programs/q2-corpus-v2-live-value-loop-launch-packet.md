# Launch Packet: Q2 Corpus V2 Live Value Loop

**Program:** q2-corpus-v2-live-value-loop
**Epic:** corpus-v2-live-value-operations
**Era:** corpus-v2
**Parent motion:** motion-0124
**Date:** 2026-04-08
**Status:** open

---

## Program overview

This program governs the first implementation arc that makes Corpus V2 real as
an operating governance system. The Corpus V2 opening event (motion-0123) ratified
the era transition and established the canon baseline. What it did not produce is
an operating manual — the specific rules that govern how post-opening motions are
deliberated in practice.

This program delivers and extends that operating manual:
- The per-tier seat routing matrix (which seats evaluate which tier)
- The cost discipline gate (category declaration, tier elevation rules)
- The escalation enforcement rules (PASS/BLOCK/ESCALATE operational handling)
- The single-agent multi-seat evaluation mechanics
- The first Corpus V2 program arc entry in the program graph

Subsequent motions in this program extend the operating loop into live-value
territory: using the deliberation system in practice, evolving agent participation,
and proving that governance-as-operating-system produces observable output state
changes.

---

## Strategic context

Corpus V1 established the infrastructure for agent-participated governance.
Corpus V2 began with motion-0123. The gap between "ratified transition" and
"governed operation" is this program's responsibility to close.

The key operational gap at program open: no machine-readable artifact maps
escalation tier to mandatory seat evaluations. The escalation ladder says "Tier 2
requires cost-discipline and governance-safety" but nothing governs how that
routing actually works for a motion package. A single agent covers one seat. Tier 2
requires three. The resolution — seat assignment extension with non-independence
acknowledged — requires a governed motion to establish.

This program closes that gap and creates the governed path for everything after it.

---

## Success criteria

**Program-level (all items must be met before program closure):**

1. `.nexus/docs/corpus-v2-deliberation-protocol.md` exists, authoritative, 6 sections
2. `.nexus/deliberation/corpus-v2-tier-seat-matrix.yaml` exists with Tier 0–3 entries
3. Seat assignment extensions committed for cost-discipline and governance-safety
4. At least one motion after motion-0124 evaluated under the deliberation protocol
   (not just canon baseline) — proves the protocol works in practice
5. Program closed by a ratified motion with evidence that criteria 1–4 are met

---

## Motion lines

### live-value-loop-main

**Description:** Establish the deliberation operating manual (motion-0124), then
apply and extend it through subsequent motions in the Corpus V2 operational arc.

**Current motions:**
- motion-0124: Corpus V2 Deliberation Protocol v0 (parent motion, proposed)

**Expected next motions (not yet authored):**
- motion-0125+: First motion evaluated under the deliberation protocol;
  establishes that the protocol is operational, not just documented

---

## Out of scope

- Additional agent registrations (no changes to agents.generated.yaml)
- Agent-authored proposals (deferred from motion-0123)
- Agent vote weight evolution beyond advisory
- CR-07 program graph completeness for motions 0001–0070
- Runtime, portal, UI, DB, or registry changes
- Closing any prior open program (this program does not retroactively govern V1 arcs)

---

## Activation path

This launch packet is activated by the ratification of motion-0124. Prior to
ratification, the program exists in proposed state and motions referencing it
carry `program: q2-corpus-v2-live-value-loop` in their motion.yaml. The program
is open upon motion-0124 ratification.

**Phase 1 (motion-0124):** Protocol and routing matrix established
**Phase 2 (motion-0125+):** First governed motion under the protocol
**Phase N (program close):** Sufficient proof that Corpus V2 operates as documented

---

## Context inheritance

**Inherited from Corpus V1 planning canon:**
- Program graph schema: `.nexus/programs/program-graph.yaml`
- Launch packet template: per motion-0118 planning canon
- Motion quality standard: per motion-0118

**Inherited from Corpus V2 opening:**
- Canon baseline: `.nexus/docs/corpus-v2-canon-baseline.md`
- Agent vote protocol v0.1: `.nexus/deliberation/agent-vote-protocol.md`
- Seat contracts (all six): `.nexus/deliberation/seat-contracts/`
- Escalation ladder: `.nexus/deliberation/escalation-ladder.yaml`
