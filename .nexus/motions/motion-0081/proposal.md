# Proposal: bounded operator receipt closure

**Motion:** motion-0081
**Parent:** motion-0071 (WS-4)
**Date:** 2026-03-30

## Context

WS-3 (motion-0080) is complete. The operator work detail page now shows a
"Governing Motion" section for motion-linked packets, including receipt
status. For packet 880 / motion-0070, this section shows receipt="pending"
because no code path writes `execution.receipt.json`.

The governed loop is visible but does not close. An operator can see the
motion state, press Approve, and the packet transitions to DONE — but the
receipt artifact remains absent and the loop shows "pending" indefinitely.

## What's already wired

In `portal/src/app/operator/work/[id]/page.tsx`:

- `runRouteAction` server action handles all 6 actions (ROUTE_ARCHITECT,
  ROUTE_BUILDER, ROUTE_VERIFIER, ROUTE_OPERATOR_REVIEW, REQUEST_CHANGES,
  APPROVE, REQUEUE) by calling `applyPacketRouteAction`
- `applyPacketRouteAction` emits SoT events and mutates packet/inbox state
- `loadGoverningMotionState` already reads `execution.receipt.json` and
  surfaces it; absent file → "pending"
- `findRepoRoot`, `fs`, `path`, `getMotionFromTags` all already imported

## What's missing

No code path writes `execution.receipt.json` when an operator presses
Approve, Request Changes, or Requeue.

## Proposed change

Add receipt-closure behavior to the three operator decision actions via
the thinnest possible hook.

### 1. `writeReceiptArtifact` inline function

Added to `portal/src/app/operator/work/[id]/page.tsx` before `updatePacket`.

Writes `execution.receipt.json` to `.nexus/motions/<motionId>/`.

Fields written:
| Field            | Value                                        |
|------------------|----------------------------------------------|
| version          | "0.1"                                        |
| motion_id        | motionId                                     |
| packet_nh_id     | packetNhId (from workPacket.nhId)            |
| receipt_id       | `<motionId>-receipt-001`                     |
| closed_at        | ISO timestamp at write time                  |
| closed_by        | `operator:<email>` or `operator:unknown`     |
| outcome          | COMPLETED / CHANGES_REQUESTED / REQUEUED     |
| status           | same as outcome                              |
| operator_action  | APPROVE / REQUEST_CHANGES / REQUEUE          |
| notes            | static acknowledgment string                 |

Outcome mapping:
- APPROVE → COMPLETED
- REQUEST_CHANGES → CHANGES_REQUESTED
- REQUEUE → REQUEUED

All writes are try/catch; failure emits `console.warn` and the server action
continues normally (no crash, redirect still happens).

### 2. `runDecisionAction` server action

New server action in the same page, replacing `runRouteAction` for the
three decision buttons.

Steps:
1. Auth check
2. Fetch latest inbox item tags for `packetId` → extract `motionId`
3. Fetch packet nhId for receipt artifact
4. Call `applyPacketRouteAction(packetId, action, actor)`
5. If `motionId` non-null: call `writeReceiptArtifact`
6. Redirect to `/operator/work/<packetId>`

### 3. Button wiring

Three decision buttons updated:
- `Approve` → `runDecisionAction.bind(null, p.id, "APPROVE")`
- `Request Changes` → `runDecisionAction.bind(null, p.id, "REQUEST_CHANGES")`
- `Requeue` → `runDecisionAction.bind(null, p.id, "REQUEUE")`

Four pure route buttons remain on `runRouteAction`.

## Scope boundary

One file changed: `portal/src/app/operator/work/[id]/page.tsx`.
