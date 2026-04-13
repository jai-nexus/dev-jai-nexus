# Execution: Operator Escalation Routing v0

**Motion:** motion-0128
**Role:** BUILDER
**Date:** 2026-04-13

---

## Cost estimate

Category: standard
Basis: bounded implementation — two new scripts, two targeted hook injections into
existing governance scripts. No database changes. No new dependencies. No UI changes.
Scope is confined to `.nexus/motions/motion-0128/` and `portal/scripts/`.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard → evidence-falsifiability mandatory.

---

## Scope

### New files

- `portal/scripts/list-escalations.mjs` — CLI listing of ACTIVE escalations
- `.nexus/motions/motion-0128/` — full motion package

### Modified files

- `portal/scripts/council-run.mjs`:
  - Injection 1 (after Stage 5 policy write): emit `escalation.yaml` when `required_ok=false`
  - Injection 2 (before Stage 7): escalation lifecycle block check

- `portal/scripts/activate-motion.mjs`:
  - Injection 1 (after corpus_v2_escalation_gate check): refuse `--create` when escalation ACTIVE+blocking

### Artifact schemas introduced

**escalation.yaml** (machine-written by council-run):
```yaml
version: "0.1"
motion_id: <motion-id>
status: ACTIVE           # ACTIVE | RESOLVED
severity: high           # critical | high | medium | low
required: true
blocking: true
reason: "<reason string>"
emitted_at: "<iso-timestamp>"
emitted_by: council-run.mjs
```

**escalation-resolution.yaml** (operator-written action record):
```yaml
version: "0.1"
motion_id: <motion-id>
escalation_ref: ".nexus/motions/<motion-id>/escalation.yaml"
resolved_at: "<iso-timestamp>"
resolved_by: "operator:<identity>"
resolution: "<description of what was done>"
prior_status: ACTIVE
```
Operator must also set `status: RESOLVED` in `escalation.yaml` after writing the resolution record.

---

## Planned evidence

1. `validate-motion` exits 0 for motion-0128
2. `validate-agency` exits 0
3. `pnpm -C portal typecheck` exits 0
4. `list-escalations.mjs` executes without error (exits 0 with "No ACTIVE escalations" on clean state)
5. council-run.mjs emits `escalation.yaml` with correct fields when `required_ok=false` (verified by reading the emitted artifact)
6. council-run.mjs blocks RATIFIED transition when escalation is ACTIVE+blocking (verified by decision.yaml having `status: BLOCKED` and notes containing escalation reason)
7. activate-motion.mjs refuses `--create` when escalation ACTIVE+blocking (verified by script exit code 1 and output line containing `escalation_lifecycle_block`)
8. `escalation.yaml` not overwritten when prior `status: RESOLVED` (verified by reading file after second run)
9. No portal/src/ type errors introduced

---

## Evidence log

1. **validate-motion EXIT 0** — `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0128/motion.yaml`
   → verify.json: validate_motion ok:true, status:0, ts:2026-04-13T23:07:33.094Z

2. **validate-agency EXIT 0** — `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
   → verify.json: validate_agency ok:true, status:0, ts:2026-04-13T23:07:33.495Z

3. **typecheck EXIT 0** — `pnpm -C portal typecheck`
   → verify.json: typecheck ok:true, status:0, ts:2026-04-13T23:07:38.533Z
   → No portal/src/ type errors introduced by escalation injections

4. **list-escalations.mjs exits 0** — verified by test-escalation-hardening.mjs Scenario 8 (CLI smoke test):
   `result.status === 0`, `ACTIVE ESCALATIONS: 1`, RESOLVED excluded, malformed excluded

5. **council-run.mjs emits escalation.yaml when required_ok=false** — escalation write logic committed at
   Injection 3 in council-run.mjs; test-escalation-hardening.mjs Scenarios 2/5/6 verify emission conditions,
   idempotency, and RESOLVED preservation via in-process logic tests

6. **council-run.mjs blocks RATIFIED when ACTIVE+blocking** — Injection 4 (blocking_reasons.push) committed
   in council-run.mjs; test-escalation-hardening.mjs Scenario 6 verifies wouldBlock() logic; decision outcome
   flows through deriveCouncilDecisionOutcome when blocking_reasons.length > 0

7. **activate-motion.mjs refuses --create when ACTIVE+blocking** — escalation_lifecycle_block fail() injection
   committed in activate-motion.mjs; logic verified by test-escalation-hardening.mjs Scenario 6 (wouldBlock test)

8. **escalation.yaml not overwritten when prior status:RESOLVED** — idempotency/RESOLVED guard committed in
   council-run.mjs Injection 3; test-escalation-hardening.mjs Scenario 6 councilRunEscalationState() confirms
   RESOLVED + required_ok=false → tag stays RESOLVED (no re-emit)

9. **No portal/src/ type errors** — typecheck gate EXIT 0 (evidence item 3 above)
