# Challenge: First Agenda Deliberation Passalong v0

**Motion:** motion-0187

---

## Risks

### Risk 1: Different surfaces could point at different candidates

If root, agenda, deliberation, and passalong each derive their own preferred
item, the loop will not be credible as a single deterministic chain.

### Risk 2: The selected item could imply execution or cross-repo work

The candidate must stay repo-local, governance-safe, and bounded to
deterministic planning/review semantics.

### Risk 3: The passalong could omit chain fields needed by CONTROL_THREAD

If the handoff text does not include packet id, repo, surface, role, gate, and
next target, the loop is only cosmetically connected.

### Risk 4: The seam could drift into new routing infrastructure

This motion must stop at a local deterministic selector and visible framing, not
create persistence, indexing, or workflow automation.

---

## Challenger standard

Approve only if:

- one existing seeded agenda item is selected and reused consistently
- root `/`, `/operator/work`, `/operator/deliberation`, and the passalong block
  all identify the same candidate
- the full deterministic chain is visible or encoded for that candidate
- the seam remains read-only, copy-only, and authority-disabled

---

## Required gates

- validate_motion
- validate_agency
- typecheck

Optional supporting gate:

- build

---

## Risk score

risk_score: 0.07
