# Execution: bounded builder motion-context binding

**Motion:** motion-0077
**Date:** 2026-03-30

## Implementation surface

Single file changed: `portal/src/lib/work/builderRuntime.ts`

## Changes applied

### Additions

- `import fs from "node:fs"` and `import path from "node:path"`
- `import { getMotionFromTags } from "@/lib/work/workPacketContract"`
- `import { type WorkPacketRuntimeContext } from "@/lib/agentRuntime"`
- `MotionContext` type (matching architect pattern exactly)
- `findRepoRoot(startDir: string): string | null` (identical to architect)
- `loadMotionContext(inboxTags: string[]): MotionContext | null`
  - Reads `.nexus/motions/<motionId>/motion.yaml` (title only via regex)
  - Reads `.nexus/motions/<motionId>/execution.md` (full text)
  - Returns null if no motion tag or repo root not found (logs warning)
  - Returns `MotionContext` with `executionPlan=''` if execution.md absent
    (logs warning, does not crash)
- `packetLabel(packet: WorkPacketRuntimeContext): string`
- `buildPatchPayload(packet, agentNhId, item, motionContext?)`:
  - Motion-grounded payload when `motionContext` present (adds `motionId`,
    `motionTitle`, `executionPlan` fields and governed patch notes)
  - Existing generic payload when `motionContext` is null
- `BuilderAgentRuntime.canClaimCandidate()` override:
  - Calls `super.canClaimCandidate()` first
  - Returns false if `packet.requestedRole !== "BUILDER"`
- `BuilderAgentRuntime.execute()` refactored:
  - Opens `prisma.$transaction` block (matching architect pattern)
  - Calls `loadWorkPacketContext` inside transaction
  - Guards `requestedRole === "BUILDER"` (throws if violated)
  - Calls `loadMotionContext(loaded.inboxTags)`
  - Emits `debug.patch` via `emitDebugArtifact` inside transaction
  - Returns loaded packet for post-transaction routing

### Removals

- `PacketSnapshot` type (replaced by `WorkPacketRuntimeContext`)
- `compactText` local helper (no longer needed)
- `import crypto from "node:crypto"` (handled by base class)
- `import { Prisma } from "@prisma/client"` (no longer needed)
- `import { assertSotEventV01 } from "@/lib/contracts/sotEventV01"` (no longer needed)
- `loadPacket()` private method (replaced by `loadWorkPacketContext`)
- `emitPatchArtifact()` private method (replaced by `buildPatchPayload` +
  `emitDebugArtifact`)

## Fallback behavior

| Condition                          | Behavior                                          |
|------------------------------------|---------------------------------------------------|
| No motion tag in inbox             | `null` → generic patch payload, existing behavior |
| Repo root not found                | warn + `null` → generic patch payload             |
| `motion.yaml` absent/unreadable    | `motionId` used as title, execution continues     |
| `execution.md` absent              | warn + `executionPlan=''` in payload              |
| `requestedRole !== "BUILDER"`      | `canClaimCandidate` returns false, not claimed    |
| `requestedRole !== "BUILDER"` inside execute | throws, packet fails (defense in depth) |

## Validation

```
pnpm -C portal typecheck
```

Result: pass, 0 errors

## Live proof path

A live builder proof requires a PENDING `AgentQueueItem` for agent `6.0.11`
pointing at the motion-0070 work packet (now at `route:BUILDER` after
architect proof confirmed by motion-0076).

The existing `enqueue-motion-packet.mjs` is ARCHITECT-only and refuses
builder-stage packets. A follow-on script (`enqueue-builder-packet.mjs`)
is required before running:

```
pnpm -C portal exec tsx scripts/run-builder-once.ts 6.0.11
```

This follow-on is out of scope for motion-0077 and is the natural entry
point for a WS-2 phase 4 slice.
