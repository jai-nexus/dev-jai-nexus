# Challenge: Agenda Source Metadata Hardening v0

**Motion:** motion-0190

---

## Risks

### Risk 1: Metadata could stay implicit

If repo posture, work class, action class, mutation boundary, and chain
completeness are still inferred ad hoc, future candidate selection will remain
fragile.

### Risk 2: The selected candidate could drift

This seam must preserve `wp-agent-registry-follow-up` as the current selected
loop-through candidate and only harden the source metadata.

### Risk 3: The helper and agenda source could diverge

If `operatorLoopCandidate.ts` does not consume the new agenda metadata, the new
source fields do not materially improve future selection.

### Risk 4: The seam could grow into ranking or routing logic

This motion must stop at metadata hardening and low-risk visibility, not evolve
into dynamic scoring, persistence, or new route complexity.

---

## Challenger standard

Approve only if:

- explicit agenda-source metadata exists for repo posture, work class, action
  class, gate presence, mutation boundary, authority boundary, and chain completeness
- `wp-agent-registry-follow-up` remains the selected candidate
- selected-candidate criteria align to the hardened agenda metadata
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

risk_score: 0.06
