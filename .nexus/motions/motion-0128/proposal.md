# Proposal: Operator Escalation Routing v0

**Motion:** motion-0128
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop

---

## 0.0 Problem

After motion-0127 proved the Corpus V2 ESCALATE activation gate, the flag
`requires_operator_escalation: true` exists in the artifact chain but no
governance surface acts on it. Motions reaching an escalation condition have
no durable live-state record and no lifecycle enforcement: council-run can
still produce RATIFIED, and activate-motion --create can still be attempted,
even when a blocking condition exists.

The gap is not in the gate (that works) but in the downstream routing:
there is no `escalation.yaml` artifact, no lifecycle block hook, and no CLI
for operators to see what needs attention.

---

## 1.0 Implications

- ESCALATE-state motions can be ratified or activated without operator review
- No durable record of when and why an escalation was raised
- Operator has no canonical listing of motions in ACTIVE escalation state
- Resolution cannot be recorded as a governance artifact

---

## 2.0 Solutions

Introduce a minimal two-artifact escalation pattern:

- `escalation.yaml` — live state; emitted by verifier (council-run) under
  defined trigger conditions; status: ACTIVE | RESOLVED
- `escalation-resolution.yaml` — operator action record; written by operator
  at resolution time; separate from live-state artifact

Lifecycle enforcement via two hooks:
- council-run.mjs: block RATIFIED transition when escalation is ACTIVE+blocking
- activate-motion.mjs: block --create when escalation is ACTIVE+blocking

CLI surface:
- `list-escalations.mjs`: reads all `escalation.yaml` files, filters ACTIVE,
  sorts deterministically by severity then motion id

---

## 3.0 Decision Proposal

Implement Operator Escalation Routing v0 with the following boundaries:
- Escalation artifacts scoped to `.nexus/motions/<motion-id>/`
- Emission triggered by verifier (council-run) when required_ok=false
- Lifecycle blocks in council-run and activate-motion only
- No UI changes, no cross-repo routing, no notification system
- No prioritization queues beyond deterministic sort

---

## 4.0 Evidence / Links

- motion-0127: proved ESCALATE gate (execution.activation.json with outcome:ESCALATE)
- motion-0125: established Corpus V2 activation gate infrastructure
- motion-0124: established Corpus V2 Deliberation Protocol with cost-escalation routing
- CLAUDE.md high-sensitivity surfaces: portal/src/lib/work/*, portal/scripts/council-run.mjs

---

## 5.0 Success Criteria

SC-1: `escalation.yaml` is emitted by council-run when `required_ok=false`
SC-2: `escalation.yaml` contains `status: ACTIVE`, `severity`, `blocking`, `reason`, `emitted_at`
SC-3: policy.yaml includes `escalation_state: ACTIVE` when escalation is ACTIVE+required
SC-4: council-run blocks RATIFIED transition when escalation is ACTIVE+blocking
SC-5: activate-motion --create refuses when escalation is ACTIVE+blocking
SC-6: `list-escalations.mjs` lists ACTIVE escalations sorted by severity then motion id
SC-7: `escalation-resolution.yaml` schema is defined; operator can write it manually
SC-8: `escalation.yaml` is NOT overwritten if prior status is RESOLVED
SC-9: no baseline behavior changed outside escalation hooks
SC-10: `pnpm -C portal typecheck` exits 0
