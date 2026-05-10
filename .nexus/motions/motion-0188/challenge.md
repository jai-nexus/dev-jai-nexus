# Challenge: Loop Candidate Source Hardening v0

**Motion:** motion-0188

---

## Risks

### Risk 1: The helper could still be too thin

If the selected-candidate source only exposes ids and labels, consumers will
continue duplicating seam, gate, and boundary strings.

### Risk 2: The selected candidate could drift unintentionally

This seam must preserve `wp-agent-registry-follow-up` as the selected
loop-through candidate and not silently change the proof target.

### Risk 3: Cross-surface copy could diverge

If root, work, deliberation, and passalong do not all consume the same source
fields, the hardening is incomplete.

### Risk 4: The seam could turn into routing infrastructure

This motion must stop at static/local source hardening and must not add
persistence, indexes, or dynamic multi-candidate selection.

---

## Challenger standard

Approve only if:

- `wp-agent-registry-follow-up` remains the selected loop-through candidate
- the hardened helper exposes the required selection reason, seam, status,
  routing target, validation gate, human decision gate, and authority boundary
- root, work, deliberation, and passalong continue to represent the same
  selected candidate consistently
- the seam remains deterministic, read-only, copy-only, and authority-disabled

---

## Required gates

- validate_motion
- validate_agency
- typecheck

Optional supporting gate:

- build

---

## Risk score

risk_score: 0.05
