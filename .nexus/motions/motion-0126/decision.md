# Decision: motion-0126 — Corpus V2 governed activation proof v0 — proceed path

**Motion:** motion-0126
**Status:** RATIFIED
**Kind:** staged-activation-proof
**Ratified:** 2026-04-09

---

## Ratification record

**Mechanism:** unanimous_consent_with_agent_witness
**Agent evaluation:** nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 — evidence-falsifiability seat — PASS
**Deliberation tier:** Tier 1 (standard; kind:staged-activation-proof; cost:standard)
**Gates:** validate_motion exit 0; validate_agency exit 0

**Sequencing note:** The human panel voted on gate results (unanimous consent, 3 yes)
before the agent evaluation trace was produced. The agent evaluation was subsequently
produced as a confirmatory post-commit record to satisfy the Corpus V2 Deliberation
Protocol §1 requirement. The evidence chain is intact and unaffected by the sequencing.
This gap is recorded honestly; the human panel's ratification authority is not
diminished by the sequencing. Future motions should produce the agent evaluation
trace before human panel vote.

**Non-independence limitation:** Agent and motion author share the same underlying
model (claude-sonnet-4-6). Structural proof of evidence chain integrity.

---

## What is proved

| Item | Status |
|---|---|
| Corpus V2 activation gate is live | proved — activate-motion.mjs reads cost, derives PROCEED |
| `execution.activation.json` carries corpus_v2 metadata | proved — outcome:PROCEED, work_packet_id:883 |
| `execution.handoff.json` carries corpus_v2 metadata | proved — cost_category:standard, tier_hint:tier1 |
| `execution.receipt.json` preserves corpus_v2 metadata | proved — same fields, status:ACKNOWLEDGED |
| Real work packet created with motion/cost/activation tags | proved — packet 883 with motion:motion-0126, cost:standard, activation:PROCEED |
| Receipt is honest — not over-stated | proved — ACKNOWLEDGED, not COMPLETED |

---

## What is deferred

- ESCALATE outcome proof (reserved for next proof motion)
- BLOCK outcome proof (reserved for separate proof)
- Full execution loop (ARCHITECT → BUILDER → VERIFIER → operator approval) — beyond the scope of this bounded proof
