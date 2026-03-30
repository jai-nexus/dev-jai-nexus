# Decision: bounded operator motion state surface

**Motion:** motion-0080
**Status:** DRAFT
**Date:** 2026-03-30

## Summary

Motion `motion-0080` is a DRAFT WS-3 phase-1 implementation slice.

`portal/src/app/operator/work/[id]/page.tsx` is modified to render a
"Governing Motion" section for motion-linked packets, surfacing:
- motionId (from inbox tags via canonical helper)
- motion title (from motion.yaml)
- council decision state (from decision.yaml)
- handoff state (from execution.handoff.json)
- receipt state (from execution.receipt.json, absent = "pending")

## Outcome

Packet 880 / motion-0070 at `/operator/work/<id>` now shows governed loop
state without requiring manual .nexus/ file inspection.

## Evidence

- `portal/src/app/operator/work/[id]/page.tsx` modified per motion-0080 proposal
- `pnpm -C portal typecheck` PASS
- Governing Motion section rendered only for motion-tagged packets
- Full fallback for missing artifacts documented in execution.md

## Constraints honored

- Only `portal/src/app/operator/work/[id]/page.tsx` changed
- No schema migration
- No receipt closure actions
- No new page routes
- No shared utility file (inline pattern)
- No runtime changes

## Notes

This motion package remains DRAFT until governed ratification is completed
through the normal repo workflow.
