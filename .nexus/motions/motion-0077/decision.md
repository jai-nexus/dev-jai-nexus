# Decision: bounded builder motion-context binding

**Motion:** motion-0077
**Status:** DRAFT
**Date:** 2026-03-30

## Summary

Motion `motion-0077` is a DRAFT bounded WS-2 phase-3 implementation slice.

The builder runtime motion-context binding is implemented locally in
`portal/src/lib/work/builderRuntime.ts`.

## Outcome

Code-level builder motion-context binding is complete.

This slice:
- detects motion-linked packets using the canonical motion tag path
- loads governed motion context from:
  - `motion.yaml` (title)
  - `execution.md` (full text)
- emits motion-grounded builder patch payloads when motion context is present
- preserves existing generic behavior for non-motion-linked packets
- falls back safely for incomplete motion context

## Evidence

- `portal/src/lib/work/builderRuntime.ts` modified per motion-0077 proposal
- `pnpm -C portal typecheck` PASS
- motion detection uses `getMotionFromTags(...)`
- fallback behavior documented in `execution.md`

## Constraints honored

- No files outside `builderRuntime.ts` changed in code
- No schema migration
- No verifier runtime changes
- No operator UI changes
- No new SoT event kinds required for this slice

## Deferred live proof

Live builder proof is deferred to the next bounded slice because a builder-stage
queue item is not yet created by the current runtime bridge.

The natural next step is:
- WS-2 phase 4
- add a bounded builder queue-readiness bridge so a builder-stage
  motion-linked packet can be claimed by `run-builder-once.ts`

## Notes

This motion package remains DRAFT until governed ratification is completed
through the normal repo workflow.
