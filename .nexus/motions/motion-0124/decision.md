# Decision: motion-0124 — Corpus V2 Deliberation Protocol v0

**Motion:** motion-0124
**Status:** RATIFIED
**Kind:** governance-policy
**Ratified:** 2026-04-09

---

## Ratification record

**Mechanism:** unanimous_consent_with_agent_witness
**Agent evaluation:** nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001 — evidence-falsifiability seat — PASS
**Gates:** validate_motion exit 0; validate_agency exit 0

**Non-independence limitation:** This motion was evaluated under the Corpus V2 canon baseline
(motion-0123), not the protocol it creates. The deliberation protocol's own scope clause
is explicit: effective from motion-0125 onward. This motion is the last motion evaluated
under canon-baseline-only rules. The agent and the motion author share the same underlying
model (claude-sonnet-4-6). Structural proof; non-adversarial. Documented in
evaluation trace and agent-vote.json.

---

## What is now established

| Item | Before | After |
|---|---|---|
| `.nexus/docs/corpus-v2-deliberation-protocol.md` | did not exist | committed, authoritative for motions 0125+ |
| `.nexus/deliberation/corpus-v2-tier-seat-matrix.yaml` | did not exist | committed, canonical seat routing source |
| Agent seat assignments | evidence-falsifiability only (seat_001) | three seat assignments active (seat_001–003) |
| Corpus V2 program graph | `epics: []` | first epic + program registered |
| CR-06 | partial | met (motion-0112 confirmed RATIFIED) |
| Criteria summary | 8 met / 1 partial / 1 unmet | 9 met / 0 partial / 1 unmet |
| Tier 2 evaluation mechanics | no machine-readable routing | governed by deliberation protocol §2 |

---

## What is deferred

- Additional agent registrations (no changes to agents.generated.yaml)
- Agent-authored proposals (deferred from motion-0123)
- Agent vote weight evolution beyond advisory
- CR-07 program graph completeness for motions 0001–0070
- Runtime, portal, UI, DB, or registry changes
