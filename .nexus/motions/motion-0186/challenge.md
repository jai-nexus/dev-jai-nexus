# Challenge: Deliberation Passalong Block v0

**Motion:** motion-0186

---

## Risks

### Risk 1: The passalong could duplicate or contradict the transcript

If the block is not derived directly from the deterministic transcript, it
could become a second inconsistent summary system.

### Risk 2: A useful handoff block could be mistaken for persistence or dispatch

The UI must remain clearly copy-only and must not suggest save, submit, or
runtime handoff behavior.

### Risk 3: Strongest caution selection could become arbitrary

If caution priority is not deterministic and explicit, the summary will look
subjective instead of governed.

### Risk 4: The seam could drift into indexing or workflow infrastructure

This motion must stop at a local page block and helper, not evolve into a
passalong registry or routing system.

---

## Challenger standard

Approve only if:

- the passalong block is visibly present on `/operator/deliberation`
- the block is computed from existing deterministic role/lens data
- strongest caution selection follows the explicit deterministic priority
- the block remains copy-only with no persistence or authority path

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
