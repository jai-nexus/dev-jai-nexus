# Proposal: Downstream Builder Proof — WorkPacket 882 (OffBook.ai staged activation)

**Motion:** motion-0098
**Date:** 2026-03-31
**Track:** A (from motion-0097 post-proof assessment)

## Context

motion-0097 codified five readiness layers and recommended four next tracks:

- Track A: Downstream builder/verifier proof for WorkPacket 882
- Track B–D: deferred (second project, promotion planning, Wave 1 scope)

WorkPacket 882 was created and architect-proven as part of the motion-0096 live
activation proof. The packet is currently at `route:BUILDER`:

```
WorkPacket 882
  nhId:   motion-0096
  status: DRAFT
  InboxItem tags: ["motion:motion-0096", "project:offbook-ai", "route:BUILDER"]
  AgentQueueItem: (none — deleted by ROUTE_BUILDER clearAssignee path)
  SoT events: WORK_CLAIMED (6.0.10) → debug.plan → WORK_COMPLETED → WORK_ROUTED → BUILDER
```

## Problem

WorkPacket 882 cannot be claimed by the builder runtime. After the architect
completed and called `applyPacketRouteAction({ action: "ROUTE_BUILDER",
clearAssignee: true })`, `syncAgentQueueItemForPacket` deleted the
`AgentQueueItem` (null-assignee path). No queue item exists for `agentNhId =
"6.0.11"`. `claimNext()` returns null.

## Corrected finding

`enqueue-builder-packet.mjs` already exists (created in motion-0078 / Q2 WS-2
loop activation program). The script is correct: finds BUILDER-capable agent,
enforces `route:BUILDER` stage guard, upserts `AgentQueueItem` with
`agentNhId = "6.0.11"`, `status = "PENDING"`.

**Zero new code required.** The full proof requires running two existing scripts.

## Proposal

Run the two-command builder proof sequence against the existing governed lane:

```
node portal/scripts/enqueue-builder-packet.mjs --motion motion-0096
pnpm -C portal exec tsx scripts/run-builder-once.ts 6.0.11
```

Expected evidence:
- SoT: WORK_CLAIMED by 6.0.11, debug.patch, WORK_COMPLETED, WORK_ROUTED → VERIFIER
- Inbox tags update to `["motion:motion-0096", "project:offbook-ai", "route:VERIFIER"]`
- `project:offbook-ai` tag preserved through builder routing

## Non-goals

- No verifier proof (builder boundary only for this motion)
- No operator approval
- No second staged project
- No new scripts or code changes
- No Wave 1+ or live repo promotion work

## Success criteria

- `enqueue-builder-packet.mjs --motion motion-0096` creates `AgentQueueItem` for `6.0.11`
- `run-builder-once.ts 6.0.11` claims packet 882 and emits `debug.patch`
- SoT events: WORK_CLAIMED → debug.patch → WORK_COMPLETED → WORK_ROUTED → VERIFIER
- `project:offbook-ai` tag present in inbox tags after builder routing
- Rerun of enqueue script dies cleanly: packet no longer at `route:BUILDER`
