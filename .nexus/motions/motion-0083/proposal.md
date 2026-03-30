# Proposal: bounded governed loop ratification sweep

**Motion:** motion-0083
**Date:** 2026-03-30

## Context

The Q2 governed loop activation arc (motion-0071, WS-1 through WS-5) is
complete end-to-end. packet 880 / motion-0070 is the canonical completed
reference path:

1. RATIFIED decision → ISSUED handoff (pre-existing)
2. motion-linked work packet created (WS-1, motion-0073)
3. Architect executed, debug.plan emitted (WS-2, motion-0075/0076)
4. Builder executed, debug.patch emitted (WS-2, motion-0077/0078)
5. Verifier executed, debug.verify emitted (WS-2, motion-0079)
6. Operator surface shows Governing Motion state (WS-3, motion-0080)
7. Operator approved, execution.receipt.json COMPLETED (WS-4, motion-0081)
8. Loop coherence gate shows COHERENT (WS-5, motion-0082)

All implementation is committed to `sprint/q2s5-loop-coherence-gate`.
All motions remain DRAFT, creating governance ambiguity.

## Ratification basis

The existing repo convention (established by motion-0070) for ratification:
- `decision.yaml`: `status: RATIFIED`, `ratified_by: manual:proposer`,
  `notes: "RATIFIED: vote_mode=unanimous_consent"`
- `decision.md`: updated with Status=RATIFIED, Evidence, Notes

## Motions to ratify

### Closure order

1. **motion-0072** — dry-run activation bridge
   - Evidence: commit `3061e0e`
   - `portal/scripts/activate-motion.mjs` created with dry-run support

2. **motion-0073** — motion-linked work packet creation
   - Evidence: commit `0a49312`
   - packet 880 created with `motion:motion-0070` tag

3. **motion-0074** — happy-path proof
   - Evidence: commit `1c2d082`
   - packet 880 confirmed at ARCHITECT lane with motion tag and route

4. **motion-0075** — architect motion-context binding
   - Evidence: commit `40dd02c`
   - `architectRuntime.ts` loads motion context; `debug.plan` emitted

5. **motion-0076** — architect queue-readiness bridge
   - Evidence: commit `37602d4`
   - `enqueue-motion-packet.mjs` bridges queue gap; architect claimed packet

6. **motion-0077** — builder motion-context binding
   - Evidence: commit `f495321`
   - `builderRuntime.ts` refactored to load motion context; `debug.patch` emitted

7. **motion-0078** — builder queue-readiness bridge
   - Evidence: commit `ad3ed29`
   - `enqueue-builder-packet.mjs` created; builder claimed packet

8. **motion-0079** — verifier runtime readiness
   - Evidence: commit `b855d14`
   - `verifierRuntime.ts` updated; `enqueue-verifier-packet.mjs` created;
     `debug.verify` emitted; packet reached OPERATOR_REVIEW

9. **motion-0080** — operator motion state surface
   - Evidence: commit `950dc0d`
   - Governing Motion section added to operator work detail page;
     motion-0070 shows RATIFIED/ISSUED/pending

10. **motion-0081** — operator receipt closure
    - Evidence: commit `d6b66df`
    - `writeReceiptArtifact` + `runDecisionAction` added to operator page;
      `execution.receipt.json` written with status=COMPLETED

11. **motion-0082** — loop coherence gate
    - Evidence: commit `8bfbb43`
    - `computeLoopCoherence` added; packet 880 shows verdict=COHERENT

12. **motion-0071** — umbrella (ratifies last)
    - Evidence: all child motions ratified; full end-to-end arc committed
    - Program success criteria confirmed by packet 880 reference path

## Scope boundary

Only `decision.yaml` and `decision.md` for each motion are changed.
No application code is touched.
