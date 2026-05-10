# Challenge: Loop Candidate Selection Criteria v0

**Motion:** motion-0189

---

## Risks

### Risk 1: Criteria could be implied but not actually modeled

If the criteria stay in UI copy only, future selection remains subjective.

### Risk 2: The current selected candidate could drift

This seam must preserve `wp-agent-registry-follow-up` as the current selected
candidate while only defining future-selection criteria.

### Risk 3: Criteria could grow into a ranking engine

The seam must stop at static deterministic criteria visibility, not dynamic
scoring or multi-candidate routing.

### Risk 4: Cross-surface copy could diverge

If root, work, deliberation, and passalong do not reuse the helper-level
criteria summary, selection rationale will drift again.

---

## Challenger standard

Approve only if:

- `wp-agent-registry-follow-up` remains the selected loop-through candidate
- future-selection criteria are explicitly modeled in the helper
- criteria include repo-local preference, governance-safe preference,
  draft/review-only posture, validation gate requirement, human gate
  requirement, no unauthorized docs/jai mutation, and no authority expansion
- surfaces stay deterministic, read-only, copy-only, and human-gated

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
