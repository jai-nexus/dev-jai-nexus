# Decision: motion-0125 — Corpus V2 governed activation gate v0

**Motion:** motion-0125
**Status:** RATIFIED
**Kind:** governance-policy
**Ratified:** 2026-04-09

---

## Ratification record

**Mechanism:** unanimous_consent_with_agent_witness
**Agent evaluation:** nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 — evidence-falsifiability seat — PASS
**Deliberation tier:** Tier 1 (standard; governance-policy kind; cost:standard)
**Gates:** validate_motion exit 0; validate_agency exit 0

**Protocol milestone:** This is the first motion evaluated under the Corpus V2
Deliberation Protocol (motion-0124). Tier 1 routing applied: evidence-falsifiability
mandatory seat satisfied; governance-safety optional seat not requested.

**Non-independence limitation:** Agent and motion author share the same underlying model
(claude-sonnet-4-6). Structural proof of evidence chain integrity. Limitation stated
in evaluation trace and agent-vote.json.

---

## What is now established

| Item | Before | After |
|---|---|---|
| `activate-motion.mjs` | no cost gate | reads cost estimate, derives PROCEED/ESCALATE/BLOCK, writes activation artifact |
| `execution.activation.json` | not produced | produced with corpus_v2 block (cost, tier, outcome) |
| `execution.handoff.json` | no corpus_v2 fields | carries corpus_v2 block from issue time, outcome updated at activation |
| `execution.receipt.json` | no corpus_v2 fields | propagates corpus_v2 block from handoff and activation |
| Operator work UI | no activation state display | surfaces cost category and activation outcome |
| `workPacketContract.ts` | no Corpus V2 types | exports CorpusActivationOutcome, parser |

---

## Evidence

The proof of this motion's effect is motion-0126:
- `execution.handoff.json`: cost_category:standard, tier_hint:tier1, activation_outcome:PROCEED
- `execution.activation.json`: outcome:PROCEED, work_packet_id:883, inbox_item_id:12
- `execution.receipt.json`: same corpus_v2 metadata preserved end-to-end

---

## What is deferred

- ESCALATE outcome proof (reserved for next proof motion)
- BLOCK outcome proof (reserved for separate proof)
- Database-level persistence of corpus_v2 fields
- OffBook.ai, additional agent registrations, schema changes
