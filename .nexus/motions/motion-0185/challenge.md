# Challenge: Deterministic Deliberation Quality v0

**Motion:** motion-0185

---

## Risks

### Risk 1: Cosmetic differentiation without real role reasoning

If the change only adds labels while keeping the reasoning body effectively the
same, deliberation quality will still feel mechanical.

### Risk 2: Deliberation could overstate authority

More polished role-specific reasoning could be mistaken for a live decision
engine if advisory posture is not kept explicit.

### Risk 3: Scope drift into ranking or toolchain orchestration

The seam must improve deterministic transcript quality only, not expand into new
execution systems, passalong indexes, or ranking models.

### Risk 4: Too many participants dilute role clarity

The deliberation surface should focus on the canonical deterministic reasoning
subset instead of every named identity in the registry.

---

## Challenger standard

Approve only if:

- most agent turns are visibly distinct by role lens
- evidence basis, confidence, posture, and caution fields are explicit
- the transcript remains deterministic and copy-only
- no provider/model/runtime/authority expansion is introduced

---

## Required gates

- validate_motion
- validate_agency
- typecheck

Optional supporting gate:

- build

---

## Risk score

risk_score: 0.08
