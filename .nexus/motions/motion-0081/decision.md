# Decision: bounded operator receipt closure

**Motion:** motion-0081
**Status:** DRAFT
**Date:** 2026-03-30

## Summary

Motion `motion-0081` is a DRAFT WS-4 phase-1 implementation slice.

`portal/src/app/operator/work/[id]/page.tsx` is modified to write
`execution.receipt.json` when an operator takes a decision action
(APPROVE, REQUEST_CHANGES, REQUEUE) on a motion-linked work packet.

Changes:
- `writeReceiptArtifact` inline function added
- `runDecisionAction` server action added
- Three decision buttons wired to `runDecisionAction` instead of `runRouteAction`

## Outcome

Operator approval of packet 880 / motion-0070 at `/operator/work/<id>` now
writes `.nexus/motions/motion-0070/execution.receipt.json` with
`status: "COMPLETED"`, closing the governed loop with a durable receipt
artifact. The Governing Motion section reflects the new receipt status on
next page load.

## Evidence

- `portal/src/app/operator/work/[id]/page.tsx` modified per motion-0081 proposal
- `pnpm -C portal typecheck` PASS
- Receipt artifact written by `writeReceiptArtifact` on decision actions
- Governing Motion section updated via existing motion-0080 surface

## Constraints honored

- Only `portal/src/app/operator/work/[id]/page.tsx` changed
- No schema migration
- No modification to `workPacketActions.ts`
- No new page routes
- No receipt browsing surface
- No agent runtime changes
- No council seam changes

## Notes

This motion package remains DRAFT until governed ratification is completed
through the normal repo workflow.
