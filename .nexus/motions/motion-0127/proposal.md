# Proposal: Corpus V2 governed activation proof v0 — escalate path

**Motion:** motion-0127
**Kind:** staged-activation-proof
**Parent motion:** motion-0126
**Date:** 2026-04-11

---

## Problem

motion-0126 proved the `PROCEED` path of the Corpus V2 governed activation gate.
It demonstrated that `Category: standard` produces `outcome: PROCEED`, a live work
packet is created, and corpus_v2 metadata is preserved through the artifact chain.

The `ESCALATE` branch is equally important and has not been proven:

- A motion declaring `substantial` or `major` cost should not proceed directly to
  live activation — it requires operator review first.
- The activation artifact must record `outcome: ESCALATE` and `requires_operator_escalation: true`.
- The `--create` flag must be refused by the `corpus_v2_escalation_gate` (exit 1).
- The artifact chain must preserve the escalation outcome through handoff and receipt.

Without a proof, the ESCALATE branch is implementation-only. It has no committed
artifact demonstrating the gate actually fires and the escalation rationale persists.

## Proposal

Use motion-0127 itself as the ESCALATE-path proof.

This motion intentionally declares `Category: substantial` in execution.md. The actual
implementation scope is bounded artifact-only (no code changes, no new infrastructure,
no database writes). The `substantial` declaration is not a scope claim — it is the
deliberate trigger for the ESCALATE gate. This choice is documented in proposal.md,
challenge.md, and execution.md to make the intent transparent and auditable.

Secondary effect: `substantial` cost under the Corpus V2 Deliberation Protocol
(motion-0124) triggers the cost-discipline mandatory seat (Tier 1 + cost-escalation).
This is the **first real operational use of the seat_002 cost-discipline assignment**
established by motion-0124. The motion therefore proves both the activation-level
ESCALATE gate and the deliberation-level cost-discipline seat routing.

## What this proof produces

1. `execution.handoff.json` — issued with `requires_operator_escalation: true`
   before activation (derived from declared cost category at handoff time)

2. `execution.activation.json` — dry-run: `outcome: ESCALATE`, exits 0.
   Then `--create` attempt: `create_requested: true`, `work_packet_id: null`,
   `corpus_v2_escalation_gate` error, exits 1.
   The final artifact shows the gate fired and packet creation was refused.

3. `execution.receipt.json` — `status: BLOCKED` to record that the normal execution
   path was refused. corpus_v2 fields preserved: `activation_outcome: ESCALATE`,
   `requires_operator_escalation: true`.

## Scope

Artifacts written under `.nexus/motions/motion-0127/`:
- ratification package
- execution handoff, activation, and receipt artifacts

Live actions (no --create packet succeeds):
- validate motion package
- validate agency
- issue handoff
- activate dry-run (confirms ESCALATE, exits 0)
- activate --create (proves gate refuses, exits 1)
- record receipt as BLOCKED

Out of scope:
- No new infrastructure
- No code changes to activation scripts
- No OffBook.ai work
- No new agent registrations

## Success criteria

1. `execution.handoff.json` issued with `corpus_v2.requires_operator_escalation: true`
   and `corpus_v2.tier_hint: tier2`
2. `execution.activation.json` records `outcome: ESCALATE`, `create_requested: true`,
   `work_packet_id: null` (proof the gate fired and refused creation)
3. `execution.receipt.json` preserves `activation_outcome: ESCALATE`,
   `requires_operator_escalation: true`, `status: BLOCKED`
4. Evaluation traces produced for both evidence-falsifiability and cost-discipline seats
   (first operational use of seat_002 cost-discipline assignment from motion-0124)
