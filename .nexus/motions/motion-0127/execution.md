# Execution: Corpus V2 governed activation proof v0 — escalate path

**Motion:** motion-0127
**Role:** LIBRARIAN
**Date:** 2026-04-11

---

## Cost estimate

Category: substantial
Basis: intentional declaration to exercise the Corpus V2 ESCALATE activation gate; actual scope is bounded artifact-only (motion package, scripts, no DB writes, no code changes), but Category: substantial is required to trigger ESCALATE behavior in activate-motion.mjs; the mismatch is documented in proposal.md and challenge.md C-1.

---

## Deliberation protocol tier

**Tier 1 + cost-escalation:** kind:staged-activation-proof, cost:substantial →
evidence-falsifiability mandatory + cost-discipline mandatory (per corpus-v2-deliberation-protocol.md
§2 Tier 1 cost_escalation: substantial triggers cost-discipline seat).

This is the **first operational use of the cost-discipline seat assignment** (seat_002,
established by motion-0124). Both evaluation traces are produced by
nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001.

---

## Scope

Artifacts written under `.nexus/motions/motion-0127/`:
- motion package (motion.yaml, proposal.md, challenge.md, execution.md, decision.md,
  decision.yaml, policy.yaml, vote.json, verify.json, agent-vote.json)
- execution.handoff.json
- execution.activation.json
- execution.receipt.json

Evaluation traces:
- evidence-falsifiability trace
- cost-discipline trace

No code changes. No database writes (the --create attempt proves the gate fires
by exiting 1 before any DB call).

---

## Planned evidence

1. `validate-motion` exits 0 for motion-0127
2. `validate-agency` exits 0
3. `execution.handoff.json` shows:
   - `corpus_v2.cost_category: substantial`
   - `corpus_v2.tier_hint: tier2`
   - `corpus_v2.requires_operator_escalation: true`
   - `corpus_v2.activation_outcome: null` at issue time
4. `activate-motion.mjs --motion motion-0127` (dry-run):
   - `outcome=ESCALATE`
   - exits 0
   - writes `execution.activation.json` with `outcome: ESCALATE`, `work_packet_id: null`, `create_requested: false`
5. `activate-motion.mjs --motion motion-0127 --create`:
   - corpus_v2_escalation_gate FAIL
   - exits 1
   - `execution.activation.json` updated: `create_requested: true`, `work_packet_id: null`
   - `execution.handoff.json` synced: `corpus_v2.activation_outcome: ESCALATE`, `requires_operator_escalation: true`
6. `record-execution-receipt.mjs --motion motion-0127 --status BLOCKED`:
   - writes `execution.receipt.json`
   - `status: BLOCKED`
   - `corpus_v2.activation_outcome: ESCALATE`
   - `corpus_v2.requires_operator_escalation: true`
   - `finished_at` set (BLOCKED status sets finished_at per receipt semantics)

---

## Evidence log

1. **validate-motion** — `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0127/motion.yaml`
   - Exit 0. Output: `✅ motion schema OK — Motion: .nexus/motions/motion-0127/motion.yaml — Title: Corpus V2 governed activation proof v0 — escalate path`

2. **validate-agency** — `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
   - Exit 0. Output: `✅ registry-backed agency OK — Domain: dev.jai.nexus Tier 1 (domain): OK — Repo: dev-jai-nexus Tier 2 (repo): OK — agents.generated.yaml: OK (202 agents)`

3. **issue-execution-handoff** — `node portal/scripts/issue-execution-handoff.mjs --motion motion-0127`
   - Issued at: `2026-04-11T14:32:44.000Z`
   - `execution.handoff.json`: `corpus_v2.cost_category: substantial`, `corpus_v2.tier_hint: tier2`, `corpus_v2.requires_operator_escalation: true`, `corpus_v2.activation_outcome: null` at issue time

4. **activate dry-run** — `node portal/scripts/activate-motion.mjs --motion motion-0127`
   - Exit 0. `execution.activation.json` written: `create_requested: false`, `corpus_v2.outcome: ESCALATE`, `work_packet_id: null`
   - Confirms ESCALATE gate fires from `Category: substantial`

5. **activate --create** — `node portal/scripts/activate-motion.mjs --motion motion-0127 --create`
   - Exit 1. `corpus_v2_escalation_gate FAIL`. `execution.activation.json` updated: `create_requested: true`, `corpus_v2.outcome: ESCALATE`, `work_packet_id: null`, `inbox_item_id: null`, `recorded_at: 2026-04-11T14:33:02.000Z`
   - `execution.handoff.json` synced: `corpus_v2.activation_outcome: ESCALATE`, `activation_recorded_at: 2026-04-11T14:33:02.000Z`
   - **Three fields together prove gate fired:** `create_requested: true` (attempt was made) + `outcome: ESCALATE` (gate decision) + `work_packet_id: null` (packet creation refused)

6. **record-execution-receipt BLOCKED** — `node portal/scripts/record-execution-receipt.mjs --motion motion-0127 --status BLOCKED`
   - `execution.receipt.json` written: `status: BLOCKED`, `finished_at: 2026-04-11T14:33:17.000Z`, `corpus_v2.activation_outcome: ESCALATE`, `corpus_v2.requires_operator_escalation: true`
   - `started_at: null` (BLOCKED without execution; lifecycle closed)

7. **Evaluation traces produced:**
   - `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0127-evidence-falsifiability-trace.yaml` — PASS
   - `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0127-cost-discipline-trace.yaml` — PASS (first operational use of seat_002)
