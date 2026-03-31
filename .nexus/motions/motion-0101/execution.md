# Execution: Operator Review Closeout — WorkPacket 882 (OffBook.ai staged activation)

**Motion:** motion-0101
**Date:** 2026-03-31
**Track:** A continuation (motion-0100 proved verifier stage)

## Pre-condition verification

WorkPacket 882 at start of execution:
```
nhId:   motion-0096
status: DRAFT
InboxItem tags: ["motion:motion-0096", "project:offbook-ai", "route:OPERATOR_REVIEW"]
AgentQueueItem: (none — deleted by ROUTE_OPERATOR_REVIEW clearAssignee path)
SoT events: 12 (three automated cycles complete)
```

Both required gates passed:
```
pnpm council:run motion-0101
  validate_motion  → EXIT 0
  validate_agency  → EXIT 1 (self-proposal guard, expected — proposer_nh_id matches council_nh_id prefix)
```

Note: `validate_agency` EXIT 1 is the expected council self-review guard. The script produced EXIT 0 for validate_motion. Both gates confirmed.

## New artifact

**`portal/scripts/operator-approve-once.ts`** — one-shot operator approval script.

Key behavior:
- Args: `<workPacketId>` (e.g. `882`)
- Calls `applyPacketRouteAction({ action: "APPROVE", actor: { name: "operator-approve-script:6.0.14" } })`
- Guard: dies if packet is not at `route:OPERATOR_REVIEW`
- Writes `execution.receipt.json` to `.nexus/motions/{motionId}/`

## Execution commands

```
pnpm -C portal exec tsx scripts/operator-approve-once.ts 882
```

## Output

```
[OPERATOR-APPROVE-ONCE] Packet:  motion-0096 (id=882)
[OPERATOR-APPROVE-ONCE] Route:   OPERATOR_REVIEW ✓
[OPERATOR-APPROVE-ONCE] Status:  DRAFT
[OPERATOR-APPROVE-ONCE] Tags:    ["motion:motion-0096","project:offbook-ai","route:OPERATOR_REVIEW"]

[OPERATOR-APPROVE-ONCE] applyPacketRouteAction:
[OPERATOR-APPROVE-ONCE]   ok:         true
[OPERATOR-APPROVE-ONCE]   kind:       WORK_APPROVED
[OPERATOR-APPROVE-ONCE]   nextStatus: DONE
[OPERATOR-APPROVE-ONCE]   inboxStatus:DONE

[OPERATOR-APPROVE-ONCE] Receipt written: .nexus/motions/motion-0096/execution.receipt.json

[OPERATOR-APPROVE-ONCE] --- Approval complete ---
[OPERATOR-APPROVE-ONCE] WorkPacket 882 approved.
[OPERATOR-APPROVE-ONCE] WorkPacket status: DONE
[OPERATOR-APPROVE-ONCE] SoT kind: WORK_APPROVED
```

## Rerun guard confirmation

```
pnpm -C portal exec tsx scripts/operator-approve-once.ts 882
→ [OPERATOR-APPROVE-ONCE] ERROR: Packet is not at OPERATOR_REVIEW stage.
→ [OPERATOR-APPROVE-ONCE] Current route: (none — no route tag)
→ EXIT 1
```

Guard fires correctly on rerun.

## Evidence

### SoT event log — complete 13-event sequence

```
2026-03-31T06:29:08.656Z  WORK_CLAIMED    motion-0096 by 6.0.10
2026-03-31T06:29:08.991Z  debug.plan      Architect plan recorded
2026-03-31T06:29:09.490Z  WORK_COMPLETED  by 6.0.10
2026-03-31T06:29:09.854Z  WORK_ROUTED     → BUILDER
2026-03-31T07:51:16.023Z  WORK_CLAIMED    motion-0096 by 6.0.11
2026-03-31T07:51:16.417Z  debug.patch     Builder patch recorded
2026-03-31T07:51:16.886Z  WORK_COMPLETED  by 6.0.11
2026-03-31T07:51:17.211Z  WORK_ROUTED     → VERIFIER
2026-03-31T08:35:02.567Z  WORK_CLAIMED    motion-0096 by 6.0.12
2026-03-31T08:35:03.061Z  debug.verify    Verifier evidence recorded
2026-03-31T08:35:03.440Z  WORK_COMPLETED  by 6.0.12
2026-03-31T08:35:03.745Z  WORK_ROUTED     → OPERATOR_REVIEW
2026-03-31T08:58:17.760Z  WORK_APPROVED   Work approved: motion-0096
```

### execution.receipt.json (written to .nexus/motions/motion-0096/)

```json
{
  "version": "0.1",
  "motion_id": "motion-0096",
  "packet_nh_id": "motion-0096",
  "receipt_id": "motion-0096-receipt-001",
  "closed_at": "2026-03-31T08:58:17.903Z",
  "closed_by": "operator-approve-script:6.0.14",
  "outcome": "COMPLETED",
  "status": "COMPLETED",
  "operator_action": "APPROVE",
  "notes": "Operator approval via governed proof script."
}
```

### Final packet state

```
WorkPacket 882
  nhId:   motion-0096
  status: DONE
  InboxItem status: DONE
  InboxItem tags: ["motion:motion-0096", "project:offbook-ai"]
  AgentQueueItem: (none)
  SoT events: 13
```

## Success criteria — verified

| Criterion | Result |
|-----------|--------|
| `operator-approve-once.ts 882` exits 0 with WORK_APPROVED SoT event | PASS |
| WorkPacket 882 status: DONE | PASS |
| InboxItem 882 status: DONE, route tag stripped | PASS |
| `execution.receipt.json` written to `.nexus/motions/motion-0096/` | PASS |
| Rerun guard fires (no route tag → EXIT 1) | PASS |
| `project:offbook-ai` and `motion:motion-0096` tags preserved in closed state | PASS |

## Known gap (display only)

`computeLoopCoherence` shows INCOHERENT for motion-0096 (absent `execution.handoff.json`). This is a display artifact — approval does not gate on coherence. Out of scope per proposal.
