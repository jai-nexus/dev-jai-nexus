# Execution: Corpus V2 governed activation proof v0 — proceed path

**Motion:** motion-0126
**Role:** LIBRARIAN
**Date:** 2026-04-09

## Cost estimate
Category: standard
Basis: single proof motion using the already-implemented governed activation path; one live work packet, no new infrastructure, no new priced dependency, and no scope beyond proving the `PROCEED` branch.

## Scope

Artifacts written under `.nexus/motions/motion-0126/`:
- ratification artifacts
- execution handoff artifact
- activation artifact
- execution receipt artifact

Live actions:
- validate motion package
- validate agency binding
- issue handoff
- activate dry-run
- activate live packet creation
- record receipt as `ACKNOWLEDGED`

## Planned evidence

1. `validate-motion` exits 0 for motion-0126
2. `validate-agency` exits 0
3. `execution.handoff.json` shows:
   - `cost_category: standard`
   - `tier_hint: tier1`
   - `requires_operator_escalation: false`
4. `execution.activation.json` shows:
   - `outcome: PROCEED`
   - same cost metadata
   - created packet/inbox ids after `--create`
5. created packet shows tags including:
   - `motion:motion-0126`
   - `cost:standard`
   - `activation:PROCEED`
6. `execution.receipt.json` preserves the same Corpus V2 metadata

## Evidence log

1. `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0126/motion.yaml`
   - `EXIT 0`
   - `motion schema OK`
2. `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
   - `EXIT 0`
   - `registry-backed agency OK`
3. `node portal/scripts/issue-execution-handoff.mjs --motion motion-0126 --issued-by manual:operator --notes "Initial bounded handoff for Corpus V2 PROCEED-path proof."`
   - wrote `.nexus/motions/motion-0126/execution.handoff.json`
   - `handoff_id: motion-0126-handoff-001`
   - `corpus_v2.cost_category: standard`
   - `corpus_v2.tier_hint: tier1`
   - `corpus_v2.requires_operator_escalation: false`
4. `node portal/scripts/activate-motion.mjs --motion motion-0126`
   - `EXIT 0`
   - dry-run confirmed `outcome=PROCEED`
   - wrote `.nexus/motions/motion-0126/execution.activation.json`
5. `node portal/scripts/activate-motion.mjs --motion motion-0126 --create`
   - `EXIT 0`
   - created `work_packet_id: 883`
   - created `inbox_item_id: 12`
   - created packet tags:
     - `motion:motion-0126`
     - `route:ARCHITECT`
     - `cost:standard`
     - `activation:PROCEED`
6. `node portal/scripts/record-execution-receipt.mjs --motion motion-0126 --status ACKNOWLEDGED --actor manual:executor --notes "..."`
   - wrote `.nexus/motions/motion-0126/execution.receipt.json`
   - `status: ACKNOWLEDGED`
   - receipt refreshed after packet creation so `corpus_v2.activation_recorded_at` matches the final activation artifact timestamp
7. Final durable proof state
   - `execution.handoff.json` preserves `cost_category: standard`, `tier_hint: tier1`, `requires_operator_escalation: false`, `activation_outcome: PROCEED`
   - `execution.activation.json` preserves `outcome: PROCEED`, `work_packet_id: 883`, `inbox_item_id: 12`
   - `execution.receipt.json` preserves `cost_category: standard`, `tier_hint: tier1`, `activation_outcome: PROCEED`, `activation_recorded_at: 2026-04-09T19:43:57.000Z`
