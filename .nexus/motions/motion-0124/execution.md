# Execution: motion-0124 — Corpus V2 Deliberation Protocol v0

**Motion:** motion-0124
**Kind:** governance-policy
**Date:** 2026-04-08

---

## Cost estimate

**Category:** standard (100k–500k tokens of agent context across 5 evaluation
pairs; no new infrastructure, no priced dependencies beyond existing LLM access)

---

## Pre-flights

Before beginning implementation, confirm:

- [ ] Branch is `sprint/q2-corpus-v2-live-value-loop` (not main)
- [ ] `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0124/motion.yaml` exits 0
- [ ] `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` exits 0
- [ ] `.nexus/motions/motion-0123/decision.yaml` shows `status: RATIFIED`
- [ ] `.nexus/programs/program-graph.yaml` corpus-v2 era entry exists with `epics: []`
- [ ] `.nexus/docs/corpus-v2-readiness-criteria.md` shows CR-06 `partial`
- [ ] `.nexus/deliberation/seat-assignments/` contains exactly one file (seat_001)

---

## Implementation

### Pair 1: Deliberation protocol document + tier-seat routing matrix

**Step 1A** — Create `.nexus/docs/corpus-v2-deliberation-protocol.md`

Six sections:
1. Authority and scope
2. Per-tier seat routing (references corpus-v2-tier-seat-matrix.yaml)
3. Cost discipline integration
4. Escalation enforcement (PASS / BLOCK / ESCALATE operational handling)
5. Multi-seat evaluation with a single agent
6. Protocol evolution

**Step 1B** — Create `.nexus/deliberation/corpus-v2-tier-seat-matrix.yaml`

Machine-readable per-tier seat assignment schema. Fields per tier:
`tier`, `label`, `mandatory_seats`, `optional_seats_by_kind`,
`min_evaluations`, `ratification_blocked`, `notes`

---

### Pair 2: Seat assignment extensions for existing agent

**Step 2A** — Create `.nexus/deliberation/seat-assignments/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_002.yaml`

Cost-discipline seat assignment for `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001`.
References `.nexus/deliberation/seat-contracts/cost-discipline.yaml`.
Notes: extension granted by motion-0124; non-independence from primary seat acknowledged.

**Step 2B** — Create `.nexus/deliberation/seat-assignments/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_003.yaml`

Governance-safety seat assignment for the same agent.
References `.nexus/deliberation/seat-contracts/governance-safety.yaml`.
Notes: extension granted by motion-0124; non-independence acknowledged.

---

### Pair 3: Program graph update + launch packet

**Step 3A** — Update `.nexus/programs/program-graph.yaml`

In the corpus-v2 era entry:
- Replace `epics: []` with the first epic:
  ```yaml
  epics:
    - epic_id: corpus-v2-live-value-operations
      title: "Corpus V2 Live Value Operations"
      description: >
        All motions that make Corpus V2 real as an operating governance system.
        Encompasses the deliberation protocol, live value loop programs, and
        subsequent operational arc motions.
      programs:
        - program_id: q2-corpus-v2-live-value-loop
          title: "Q2 Corpus V2 Live Value Loop"
          parent_motion: motion-0124
          motion_lines:
            - line_id: live-value-loop-main
              description: >
                Deliberation protocol and tier-seat routing (0124), followed by
                subsequent operational motions on this program arc.
              motions:
                - motion-0124
              status: open
          status: open
  ```

**Step 3B** — Create `.nexus/programs/q2-corpus-v2-live-value-loop-launch-packet.md`

Launch packet following the standard template. Sections: program overview,
strategic context, success criteria, motion lines, out-of-scope, first motion
anchor (motion-0124).

---

### Pair 4: CR-06 promotion in readiness criteria

**Step 4** — Update `.nexus/docs/corpus-v2-readiness-criteria.md`

- CR-06 `current_status:` `partial` → `met`
- CR-06 assessment: motion-0112 is RATIFIED (2026-04-01). All four anomalies
  resolved. Closing action was: "Confirm motion-0112 is ratified." Confirmed.
  Promoted to met as confirmation action — no new work required.
- CR-06 closing action: Closed.
- Summary table: CR-06 row → `**met** *(confirmed by motion-0124)*`
- Summary counts: 9 met / 0 partial / 1 unmet

---

### Pair 5: This motion's advisory agent evaluation + agent-vote.json

**Step 5A** — Create evaluation trace at:
`.nexus/deliberation/evaluation-traces/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0124-trace.yaml`

Seat: evidence-falsifiability. Tier note: this motion is evaluated under
Corpus V2 canon baseline (not the protocol it creates, per scope clause).
Address all 5 distinctive_questions from evidence-falsifiability seat contract.
Check all 4 block_conditions. State non-independence. Target: pass_or_block: PASS.

**Step 5B** — Create `.nexus/motions/motion-0124/agent-vote.json`

Fields: all 8 agent-vote-protocol v0.1 extension fields. era: corpus-v2.
outcome.result: PASS (contingent on evaluation). evaluation_trace_ref resolves.

---

## Evidence checklist

All 8 items must be confirmed from committed repo state before ratification:

1. `.nexus/docs/corpus-v2-deliberation-protocol.md` exists with 6 sections
2. `.nexus/deliberation/corpus-v2-tier-seat-matrix.yaml` exists with Tier 0–3 entries,
   each with mandatory_seats, optional_seats_by_kind, min_evaluations
3. `.nexus/deliberation/seat-assignments/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_002.yaml` exists
4. `.nexus/deliberation/seat-assignments/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_003.yaml` exists
5. `.nexus/programs/program-graph.yaml` corpus-v2 has epic `corpus-v2-live-value-operations`
   and program `q2-corpus-v2-live-value-loop` with motion-0124 as parent_motion
6. `.nexus/programs/q2-corpus-v2-live-value-loop-launch-packet.md` exists
7. `.nexus/docs/corpus-v2-readiness-criteria.md` CR-06 → met; summary 9/0/1
8. Evaluation trace exists with ≥3 questions_evaluated, pass_or_block: PASS;
   agent-vote.json exists with 8 extension fields and outcome.result: PASS
