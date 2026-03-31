# Proposal: Downstream Verifier Proof — WorkPacket 882 (OffBook.ai staged activation)

**Motion:** motion-0100
**Date:** 2026-03-31
**Track:** A continuation (motion-0098 proved builder stage)

## Context

motion-0098 proved the ARCHITECT → BUILDER lane for WorkPacket 882.
Packet is now at `route:VERIFIER`:

```
WorkPacket 882
  nhId:   motion-0096
  status: DRAFT
  InboxItem tags: ["motion:motion-0096", "project:offbook-ai", "route:VERIFIER"]
  AgentQueueItem: (none — deleted by ROUTE_VERIFIER clearAssignee path)
  SoT events so far: 8 (architect + builder cycles complete)
```

## Problem

Identical to the builder gap: after `applyPacketRouteAction({ action:
"ROUTE_VERIFIER", clearAssignee: true })`, `syncAgentQueueItemForPacket` deleted
the `AgentQueueItem`. Verifier runtime `claimNext()` returns null. Packet is not
claimable.

## Corrected finding

`enqueue-verifier-packet.mjs` already exists (pre-created in motion-0079).
Stage guard: dies if `currentRoute !== "VERIFIER"`. Verifier agent: `6.0.12`.

**Zero new code required.**

## Proposal

```
node portal/scripts/enqueue-verifier-packet.mjs --motion motion-0096
pnpm -C portal exec tsx scripts/run-verifier-once.ts 6.0.12
```

Expected evidence:
- SoT: WORK_CLAIMED by 6.0.12, debug.verify, WORK_COMPLETED, WORK_ROUTED → OPERATOR_REVIEW
- Inbox tags: `["motion:motion-0096", "project:offbook-ai", "route:OPERATOR_REVIEW"]`
- priority: 90 (ROUTE_OPERATOR_REVIEW priority per workPacketActions.ts)
- `project:offbook-ai` tag preserved

## Non-goals

- No operator approval
- No second staged project
- No new scripts or code changes
- No Wave 1+ or live repo promotion work

## Success criteria

- `enqueue-verifier-packet.mjs --motion motion-0096` creates `AgentQueueItem` for `6.0.12`
- `run-verifier-once.ts 6.0.12` claims packet 882 and emits `debug.verify`
- SoT: WORK_CLAIMED → debug.verify → WORK_COMPLETED → WORK_ROUTED → OPERATOR_REVIEW
- `project:offbook-ai` tag present after verifier routing
- Rerun of enqueue script dies cleanly (route:OPERATOR_REVIEW guard)
- Rerun of verifier-once is clean no-op
