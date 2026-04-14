# Challenge: JAI Grid Draft Package Ergonomics v0

**Motion:** motion-0131

---

## Risks

- **R-1: substituteMotionId mutates input** — mitigated by design: `substituteMotionId`
  creates a new `MotionDraftScaffold` object using spread syntax. The input scaffold is not
  mutated. Verifiable by reading the committed module.

- **R-2: MOTION_ID_PATTERN rejects valid IDs** — pattern is `/^motion-\d{4}$/`, matching
  `motion-0000` through `motion-9999`. IDs in this repo are currently motion-0001 through
  motion-0131. No valid motion ID in this repo is outside the 4-digit range. If the repo
  ever exceeds motion-9999, the pattern and UI copy would need updating — explicitly deferred.

- **R-3: Bundle tab enables operator to skip per-file review** — the bundle tab is additive;
  the four individual tabs remain and are the default. Operator mediation is preserved; the
  bundle is a convenience path, not a bypass of review.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.15
