# Decision - motion-0094

## Status
DRAFT

## Summary
Motion `motion-0094` is a governance closeout sweep for the first real OffBook.ai
Wave 0 bootstrap rollout (motion-0093).

Scope of this sweep: inspect motion-0093, verify the 12 Wave 0 substrate artifacts
in `out/offbook-ai/`, resolve the `bootstrap-manifest.instance.yaml` disposition,
run required validation gates, and produce the full ratification artifact set for
motion-0093. No rollout artifacts changed. No code changed beyond what was already
committed on the rollout branch.

## What this sweep established
- motion-0093 success criteria: all 6 met
- out/offbook-ai/: 12 Wave 0 artifacts present and verified
- bootstrap-manifest.instance.yaml: known gap from motion-0089, deferred to a
  separate bounded follow-up motion, not a blocker for ratification
- validate_motion: EXIT 0
- validate_agency: EXIT 0
- challenge.md: no blocking objections
- motion-0093 decision.yaml: updated DRAFT → RATIFIED

## Known gap
`bootstrap-manifest.instance.yaml` not emitted by `generate-bootstrap.mjs`.
Documented in `bootstrap-generator.spec.md` (motion-0088) as a planned output
record. Known since motion-0089. Does not block Wave 0 governance use.
Deferred to a separate bounded motion.

## Next step
A follow-up bounded motion to implement `bootstrap-manifest.instance.yaml`
emission in `generate-bootstrap.mjs` as specified in motion-0088.
