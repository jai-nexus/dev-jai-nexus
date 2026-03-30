# Decision: bounded builder queue readiness for motion-linked packets

**Motion:** motion-0078
**Status:** DRAFT
**Date:** 2026-03-30

## Summary

Motion `motion-0078` is a DRAFT bounded WS-2 phase-4 implementation slice.

`portal/scripts/enqueue-builder-packet.mjs` is added, enabling the live
builder proof on the motion-0070 packet now at `route:BUILDER` stage.

## Outcome

Builder queue readiness bridge is complete.

This slice:
- identifies the exact blocker (syncAgentQueueItemForPacket deletes queue
  items when route actions clear the assignee)
- adds a symmetric BUILDER-role script mirroring the proven ARCHITECT
  enqueue pattern from motion-0076
- validates the motion is RATIFIED and the packet is at BUILDER stage
  before writing
- upserts AgentQueueItem with upsert safety
- enables `run-builder-once.ts 6.0.11` to claim and process the packet

## Evidence

- `portal/scripts/enqueue-builder-packet.mjs` added per motion-0078 proposal
- `node --check portal/scripts/enqueue-builder-packet.mjs` PASS
- `pnpm -C portal typecheck` PASS
- proof command documented in execution.md

## Constraints honored

- No files outside `enqueue-builder-packet.mjs` changed
- No schema migration
- No builderRuntime.ts changes
- No verifier runtime changes
- No operator UI changes
- enqueue-motion-packet.mjs unchanged

## Deferred

- Root-cause fix to `syncAgentQueueItemForPacket` / `applyPacketRouteAction`
  to preserve queue items during unassigned route actions (out of scope,
  high-sensitivity surface)
- Verifier queue readiness (WS-2 phase 5 or beyond)

## Notes

This motion package remains DRAFT until governed ratification is completed
through the normal repo workflow.
