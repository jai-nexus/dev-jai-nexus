# Proposal: Operator Review Closeout — WorkPacket 882 (OffBook.ai staged activation)

**Motion:** motion-0101
**Date:** 2026-03-31
**Track:** A completion (motion-0100 proved verifier stage)

## Context

motion-0100 proved the full automated lane (ARCHITECT + BUILDER + VERIFIER).
Packet 882 arrived at `route:OPERATOR_REVIEW`, priority 90:

```
WorkPacket 882
  nhId:   motion-0096
  status: DRAFT
  InboxItem tags: ["motion:motion-0096", "project:offbook-ai", "route:OPERATOR_REVIEW"]
  AgentQueueItem: (none)
  SoT events: 12 (three automated cycles complete)
```

## Problem

The OPERATOR_REVIEW stage is a human decision gate — no `run-operator-once.ts`
exists and none should exist for general use. However, for a bounded governance
proof of the complete lane, a one-shot script that calls `applyPacketRouteAction`
with `action: "APPROVE"` mirrors exactly what the web UI does and closes the
proof.

No equivalent enqueue-operator script exists or is needed (OPERATOR_REVIEW is
not a claimable queue stage — it is a direct action gate).

## Approach

**`portal/scripts/operator-approve-once.ts`** — new one-shot approval script:
- Args: `<workPacketId>` (e.g. `882`)
- Guard: dies if packet is not at `route:OPERATOR_REVIEW`
- Calls `applyPacketRouteAction({ action: "APPROVE", actor: { name: "operator-approve-script:6.0.14" } })`
- Writes `execution.receipt.json` to the motion directory (mirrors web UI behavior)
- Usage: `pnpm -C portal exec tsx scripts/operator-approve-once.ts 882`

## Known gap: execution.handoff.json

`computeLoopCoherence` in `/operator/work/[id]/page.tsx` requires
`execution.handoff.json` with `status: "ISSUED"` for a COHERENT verdict.
motion-0096 has no `execution.handoff.json` (the handoff pattern was not
established until later in the program). The loop coherence display will show
INCOHERENT due to this absent artifact.

This does **not** block the approval action — `runDecisionAction` in the web UI
calls `applyPacketRouteAction` directly without checking loop coherence. The
gap is a display artifact, not a gate. Creating `execution.handoff.json` for
motion-0096 is out of scope (no reopening of motion-0096).

## Non-goals

- No general operator automation framework
- No second staged project
- No new runtime lane
- No reopening motion-0096 to add handoff.json
- No Wave 1+ or live repo promotion work

## Success criteria

- `operator-approve-once.ts 882` exits 0 with WORK_APPROVED SoT event
- WorkPacket 882 status: DONE
- InboxItem 882 status: DONE, route tag stripped
- `execution.receipt.json` written to `.nexus/motions/motion-0096/`
- Rerun guard fires (no route tag → "not at OPERATOR_REVIEW")
- `project:offbook-ai` and `motion:motion-0096` tags preserved in closed state
