# Execution: bounded operator receipt closure

**Motion:** motion-0081
**Date:** 2026-03-30

## Implementation surface

Single file changed: `portal/src/app/operator/work/[id]/page.tsx`

## Changes applied

### Additions

- `writeReceiptArtifact(motionId, packetNhId, action, actor)` — inline
  function added before `updatePacket`. Uses existing `findRepoRoot`, `fs`,
  `path` imports from motion-0080. Writes `execution.receipt.json` to
  `.nexus/motions/<motionId>/`. All try/catch; never throws.

- `runDecisionAction(packetId, action)` — new server action added after
  `runRouteAction`. Loads inboxTags + packet nhId from DB, calls
  `applyPacketRouteAction`, then calls `writeReceiptArtifact` if motionId
  is non-null.

### Modified

- `Approve` button form: `action` changed from
  `runRouteAction.bind(null, p.id, "APPROVE")` to
  `runDecisionAction.bind(null, p.id, "APPROVE")`

- `Request Changes` button form: `action` changed from
  `runRouteAction.bind(null, p.id, "REQUEST_CHANGES")` to
  `runDecisionAction.bind(null, p.id, "REQUEST_CHANGES")`

- `Requeue` button form: `action` changed from
  `runRouteAction.bind(null, p.id, "REQUEUE")` to
  `runDecisionAction.bind(null, p.id, "REQUEUE")`

### Unchanged

Four route buttons remain on `runRouteAction`:
- Route to architect (ROUTE_ARCHITECT)
- Route to builder (ROUTE_BUILDER)
- Route to verifier (ROUTE_VERIFIER)
- Route to operator review (ROUTE_OPERATOR_REVIEW, if present)

## Receipt artifact fields

```json
{
  "version": "0.1",
  "motion_id": "<motionId>",
  "packet_nh_id": "<nhId>",
  "receipt_id": "<motionId>-receipt-001",
  "closed_at": "<ISO timestamp>",
  "closed_by": "operator:<email or 'unknown'>",
  "outcome": "COMPLETED | CHANGES_REQUESTED | REQUEUED",
  "status": "COMPLETED | CHANGES_REQUESTED | REQUEUED",
  "operator_action": "APPROVE | REQUEST_CHANGES | REQUEUE",
  "notes": "Operator decision recorded via dev-jai-nexus operator surface."
}
```

## Fallback behavior

| Condition                             | Behavior                                      |
|---------------------------------------|-----------------------------------------------|
| No motion tag in inbox tags           | No receipt write; action proceeds as before   |
| Repo root not found                   | console.warn; action proceeds, redirect ok    |
| Motion directory does not exist       | console.warn; action proceeds, redirect ok    |
| fs.writeFileSync throws               | try/catch catches; console.warn; redirect ok  |
| Non-motion-linked packet              | Entire receipt path skipped                   |

## Validation

```
pnpm -C portal typecheck
```
Result: pass, 0 errors

## Proof path

Navigate to `/operator/work/880` (or the actual ID for the motion-0070 packet).
Press **Approve**.

After redirect:
- `.nexus/motions/motion-0070/execution.receipt.json` exists with `status: "COMPLETED"`
- The "Governing Motion" section shows receipt=COMPLETED (emerald chip)
- `cat .nexus/motions/motion-0070/execution.receipt.json` confirms the artifact
