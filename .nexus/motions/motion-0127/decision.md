# Decision: Corpus V2 governed activation proof v0 — escalate path

**Motion:** motion-0127
**Status:** RATIFIED
**Result:** PASS
**Ratified at:** 2026-04-11T14:33:17.000Z
**Ratified by:** unanimous_consent_with_agent_witness

---

## Ratification record

| Role | Identity | Vote |
|------|----------|------|
| Proposer | JerryIngram (nh_id: 6.0.1) | yes |
| Challenger | JerryIngram (nh_id: 6.0.1) | yes |
| Arbiter | JerryIngram (nh_id: 6.0) | yes |
| Agent witness (evidence-falsifiability) | nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 | PASS (advisory) |
| Agent witness (cost-discipline) | nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 | PASS (advisory) |

Agent evaluation was produced contemporaneously with the motion package — no sequencing gap.
Both mandatory seats evaluated (Tier 1 + cost-escalation: `cost:substantial` triggers `cost-discipline` mandatory per deliberation protocol §2).

---

## What this motion proved

| Claim | Proof artifact | Fields |
|-------|---------------|--------|
| ESCALATE gate fires for `substantial` cost category | `execution.activation.json` | `corpus_v2.outcome: ESCALATE` |
| Activation attempt was made (not a dry-run result) | `execution.activation.json` | `create_requested: true` |
| No work packet was created | `execution.activation.json` | `work_packet_id: null` |
| Escalation rationale propagates to handoff | `execution.handoff.json` | `requires_operator_escalation: true`, `tier_hint: tier2` |
| Artifact chain preserves escalation through receipt | `execution.receipt.json` | `status: BLOCKED`, `activation_outcome: ESCALATE`, `finished_at` set |
| cost-discipline seat (seat_002) activated and evaluated | evaluation trace | First operational use since motion-0124 assignment |

Three fields in `execution.activation.json` together constitute the gate proof:
- `create_requested: true` — the `--create` call was made
- `corpus_v2.outcome: ESCALATE` — the gate fired
- `work_packet_id: null` — packet creation was refused

These three fields cannot all be simultaneously true unless the gate correctly ran and refused creation.

---

## Intentional cost mismatch

`Category: substantial` was declared for a proof motion whose actual execution scope is standard (artifact-only, no code changes, no DB writes). This mismatch is intentional and is the proof mechanism: substantial triggers the ESCALATE gate. The mismatch is documented in proposal.md, challenge.md C-1, execution.md Cost estimate basis, and in the cost-discipline evaluation trace.

The cost-discipline seat found no block conditions triggered — the "no stated reason" condition requires an undocumented mismatch; this mismatch is fully stated.

---

## Boundary table

| Item | In scope | Out of scope |
|------|----------|-------------|
| ESCALATE activation gate behavior | ✓ proved | — |
| Corpus V2 metadata chain through BLOCKED receipt | ✓ proved | — |
| First cost-discipline seat operational use | ✓ proved | — |
| BLOCK-path proof (missing Category) | — | deferred (motion-0128 or later) |
| Full execution loop with real work packet | — | out of scope for this branch |
| Operator UI surface for escalation routing | — | separate motion line |

---

## Deferred items

- **BLOCK-path proof:** `activate-motion.mjs` BLOCK behavior (missing `Category:` field) has not been exercised with durable artifacts. Separate proof motion if needed.
- **Operator escalation routing:** The `requires_operator_escalation: true` flag is now present in artifacts but no operator UI surface routes on it. Separate motion line.
