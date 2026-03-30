# Proposal: bounded builder queue readiness for motion-linked packets

**Motion:** motion-0078
**Parent:** motion-0071 (WS-2 phase 4)
**Date:** 2026-03-30

## Context

motion-0077 completed the builder runtime motion-context binding at code
level. The builder runtime now detects motion-linked packets, loads governed
context, and emits motion-grounded `debug.patch` artifacts. However, the
live proof was blocked because no `AgentQueueItem` exists for the
builder-stage packet.

## Root cause of the blocker

After architect runtime completes and calls:

```typescript
applyPacketRouteAction({ action: "ROUTE_BUILDER", clearAssignee: true, ... })
```

The action handler calls `syncAgentQueueItemForPacket` with `assigneeNhId=null`
because `clearAssignee` defaults to `true` for route actions. That function,
when called with a null assignee, **deletes** the `AgentQueueItem`. The
`claimNext()` query is `AgentQueueItem`-exclusive, so builder runtime finds
nothing to claim.

The existing `enqueue-motion-packet.mjs` cannot bridge this because it is
ARCHITECT-only: it auto-detects only ARCHITECT agents and its route guard
explicitly refuses packets that are not at `route:ARCHITECT`.

## Proposed change

Add `portal/scripts/enqueue-builder-packet.mjs` — a direct symmetric
parallel of `enqueue-motion-packet.mjs` for the BUILDER role:

- finds the motion-linked `AgentInboxItem` with `motion:<motionId>` tag
- validates current route tag is `route:BUILDER` (refuses clearly otherwise)
- auto-detects the first BUILDER-capable agent from `config/agency.yaml`
  (6.0.11 in this repo), overridable via `--agent`
- derives `repoScope=[targetRepo]` from `decision.yaml` or `motion.yaml`
- upserts `AgentQueueItem` with `status=PENDING` for that agent and scope
- prints the builder proof command

## Why not generalize enqueue-motion-packet.mjs instead?

The ARCHITECT bridge is proven and ratified by motion-0076. Modifying it
risks regression in a validated path. A symmetric BUILDER-specific script
is narrower, independently reviewable, and keeps each role's readiness
bridge independently auditable. The pattern cost is duplication; the
benefit is isolation.

## Scope boundary

Only `portal/scripts/enqueue-builder-packet.mjs` is added. No source
files, no schema migration, no existing script changes.
