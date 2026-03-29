# Decision - motion-0075

## Status
DRAFT

## Summary
Motion `motion-0075` is a DRAFT bounded WS-2 phase-1 implementation slice.

WS-2 phase 1 architect motion context binding is implemented locally.

## What was done

`portal/src/lib/work/architectRuntime.ts` now:
- detects motion-linked packets via `getMotionFromTags(loaded.inboxTags)`
- reads `motion.yaml` (title) and `execution.md` from `.nexus/motions/<motionId>/`
- produces a motion-grounded `debug.plan` SoT artifact when motion context is available
- falls back to the existing generic plan for non-motion-linked packets
- handles all missing-artifact cases with explicit warn-and-continue fallback

## Evidence

- `pnpm -C portal typecheck` PASS (clean, no errors)
- Diff: +87 lines in `portal/src/lib/work/architectRuntime.ts`
  - 2 new Node imports (`fs`, `path`)
  - 1 new import from workPacketContract (`getMotionFromTags`)
  - `MotionContext` type
  - `findRepoRoot` helper
  - `loadMotionContext` helper
  - `buildArchitectPlan` updated with optional third param
  - 1 added call in `execute()`: `loadMotionContext(loaded.inboxTags)`

## Binding point
`ArchitectAgentRuntime.execute()` → existing transaction block →
after `loadWorkPacketContext` + role validation → before `emitDebugArtifact`

## Motion artifacts used as plan input
- `motion.yaml` → `title:` field → `motionTitle` in plan payload
- `execution.md` → full text → `plan.executionPlan` in plan payload

## Live runtime proof — deferred (confirmed blockers)

Investigated on 2026-03-29. Two confirmed DB-level blockers prevent a live
proof against WorkPacket 880 (motion-0070) on this branch:

1. `AgentQueueItem for wp 880: []` — `claimNext()` queries `AgentQueueItem`;
   no queue item exists for the motion-linked packet.
2. `WorkPacket 880 repoId=null` — `reposToCheck` falls back to `repoName=null`
   → claim loop skips the packet even if a queue item existed.

The architect runtime code path is correct and typecheck-verified.
The live proof requires a routing slice that bridges `AgentInboxItem` →
`AgentQueueItem` and sets `repoId` on the work packet — both outside WS-2
phase 1 scope. Deferred explicitly.

## Notes
Implemented on 2026-03-29.
No files outside `portal/src/lib/work/architectRuntime.ts` were changed.
