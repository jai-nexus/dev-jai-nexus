# Proposal: Bounded OffBook.ai Wave 0 Rollout Closeout Sweep

**Motion:** motion-0094
**Date:** 2026-03-30

## Problem

motion-0093 (first real OffBook.ai Wave 0 bootstrap rollout) was executed and
committed. All six success criteria are met:

- ✓ out/offbook-ai/ contains all 12 Wave 0 artifacts
- ✓ agency.yaml parses as valid YAML with 9 agents, correct NH IDs
- ✓ proposal.md contains headings + HTML comment placeholders only
- ✓ Second run skips all 12 (idempotency)
- ✓ All generated content references offbook-ai / offbook-core correctly
- ✓ No dev-jai-nexus-specific paths in generated artifacts

All three challenges in challenge.md are resolved with no blocking objections.
The motion package is complete but lacks the ratification artifact set
(vote.json, verify.json, policy.yaml, decision.yaml=RATIFIED, decision.md=RATIFIED).

## Bootstrap-manifest.instance.yaml — blocker or follow-up?

**Not a blocker.** The challenge.md (C-3) explicitly accepted this as a
known implementation gap from motion-0089 that does not block Wave 0 governance
use. The spec documents manifest instance emission as a future requirement.
The 12 Wave 0 artifacts required by the bootstrap-manifest.schema.yaml are all
present. Ratification can proceed truthfully without it.

The manifest instance should be addressed in a separate bounded motion after
closeout, not as a pre-condition for motion-0093 ratification.

## Approach

1. Run validate_motion and validate_agency gates for motion-0093.
2. Confirm all success criteria are met by inspecting committed artifacts.
3. Produce the full ratification artifact set for motion-0093:
   - vote.json
   - verify.json
   - policy.yaml
   - decision.yaml (RATIFIED)
   - decision.md (RATIFIED)
4. Do not create execution.handoff.json / execution.receipt.json — rollout
   motions involve no executor agent handoff.
5. Do not change any rollout artifacts, generator code, or planning artifacts.

## After closeout

The next bounded follow-up after motion-0094 is **manifest instance emission**:
a small bounded motion to implement `bootstrap-manifest.instance.yaml`
generation in `generate-bootstrap.mjs`, as specified in
`bootstrap-generator.spec.md` (motion-0088) and noted as a known gap in
motion-0093.
