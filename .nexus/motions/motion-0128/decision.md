# Decision: Operator Escalation Routing v0

**Motion:** motion-0128
**Status:** RATIFIED
**Ratified at:** 2026-04-13T23:07:38.549Z
**Vote mode:** unanimous_consent (proposer, challenger, arbiter — all yes)
**Program:** q2-corpus-v2-live-value-loop

---

## Summary

motion-0128 introduces the Operator Escalation Routing v0 surface to dev-jai-nexus.
When a motion fails required governance gates (required_ok=false), council-run now
emits a live-state escalation.yaml artifact that persists across runs, enforces a
lifecycle block on RATIFIED transition (and activation), and is operator-resolvable
via a RESOLVED status write. A companion CLI (list-escalations.mjs) surfaces all
ACTIVE escalations in deterministic severity-sorted order.

---

## Gate results

| Gate            | Result | Exit code | Timestamp                    |
|-----------------|--------|-----------|------------------------------|
| validate_motion | PASS   | 0         | 2026-04-13T23:07:33.094Z     |
| validate_agency | PASS   | 0         | 2026-04-13T23:07:33.495Z     |
| typecheck       | PASS   | 0         | 2026-04-13T23:07:38.533Z     |

All three required gates passed. required_ok=true. risk_score=0.18 (max 0.20). No
blocking_reasons. No escalation emitted.

---

## Vote outcome

unanimous_consent — all three required roles voted yes:
- proposer: yes (2026-04-13T12:00:00.000Z)
- challenger: yes (2026-04-13T12:00:05.000Z)
- arbiter: yes (2026-04-13T12:00:10.000Z)

Agent witness (nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001, seat: evidence-falsifiability):
advisory PASS. Full evaluation trace at:
`.nexus/deliberation/evaluation-traces/nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001-motion-0128-evidence-falsifiability-trace.yaml`

---

## Deliverables ratified

**New files:**
- `portal/scripts/list-escalations.mjs` — CLI listing ACTIVE escalations, sorted by severity rank then motion id
- `portal/scripts/test-escalation-hardening.mjs` — 65-assertion test suite (8 scenarios)
- `.nexus/motions/motion-0128/` — full 7-file motion package

**Modified files:**
- `portal/scripts/council-run.mjs` — 4 injections:
  1. Escalation state read (ACTIVE/RESOLVED/null detection before policy write)
  2. `escalation_state` field in policy.yaml template
  3. Emit `escalation.yaml` when `required_ok=false && escalationStateTag === "ACTIVE"` (idempotent)
  4. Lifecycle block: pushes to `blocking_reasons` when escalation ACTIVE+blocking
- `portal/scripts/activate-motion.mjs` — 1 injection:
  - Refuses `--create` with `escalation_lifecycle_block` fail() when escalation ACTIVE+blocking

**Artifact schemas introduced:**
- `escalation.yaml` (machine-written by council-run): fields version, motion_id, status, severity, required, blocking, reason, emitted_at, emitted_by
- `escalation-resolution.yaml` (operator-written action record): documents resolution action, prior_status, resolved_by

---

## Hardening properties ratified

- Malformed or absent escalation.yaml never crashes or incorrectly blocks (7 malformed-input variants tested)
- Invalid severity values normalize to "unknown" (sorts last at rank 99)
- Multi-line reason values collapsed to single line
- RESOLVED status preserved across council-run re-runs even when required_ok=false (operator decision stands)
- Idempotent emission: escalation.yaml not overwritten when existing reason matches

---

## Agent witness note

Evaluation produced in-session concurrent with ratification. Human panel vote and
agent evaluation are aligned in sequencing for this motion (no post-commit gap as in
motion-0126). Evidence chain: 65-assertion test suite + three PASS gate results in
verify.json + committed script implementations.
