# Execution: bounded builder queue readiness for motion-linked packets

**Motion:** motion-0078
**Date:** 2026-03-30

## Implementation surface

Single file added: `portal/scripts/enqueue-builder-packet.mjs`

## Root cause confirmed

`applyPacketRouteAction("ROUTE_BUILDER", clearAssignee=true)` →
`syncAgentQueueItemForPacket(tx, { assigneeNhId: null })` →
`agentQueueItem.deleteMany({ where: { workPacketId } })` →
`claimNext()` finds no queue item → builder proof blocked.

## Script design

`enqueue-builder-packet.mjs` is a symmetric parallel of
`enqueue-motion-packet.mjs` with these role-specific changes:

| Concern         | ARCHITECT script           | BUILDER script              |
|-----------------|----------------------------|-----------------------------|
| Agent detection | `findArchitectAgent()`     | `findBuilderAgent()`        |
| Route guard     | `currentRoute !== "ARCHITECT"` | `currentRoute !== "BUILDER"` |
| Role validation | `execution_roles` has ARCHITECT | `execution_roles` has BUILDER |
| Proof command   | `run-architect-once.ts`    | `run-builder-once.ts`       |

All other logic (RATIFIED check, motion artifact reads, repoScope derivation,
upsert semantics, DB setup, dotenv loading, exit codes) is identical.

## Validation

```
node --check portal/scripts/enqueue-builder-packet.mjs
```
Result: pass (no syntax errors)

```
pnpm -C portal typecheck
```
Result: pass, 0 errors (script is .mjs, not TypeScript; typecheck confirms
no TS regressions from this slice)

## Live proof sequence

After script is added:

```bash
# Step 1: create builder queue item for motion-0070 packet
node portal/scripts/enqueue-builder-packet.mjs --motion motion-0070

# Step 2: run builder proof
pnpm -C portal exec tsx scripts/run-builder-once.ts 6.0.11
```

Expected: builder claims the motion-0070 packet, emits a `debug.patch`
SoT event with `motionId`, `motionTitle`, and `executionPlan` fields,
routes packet to verifier stage, exits 0.

## Fallback behavior inherited from motion-0077

Non-motion-linked packets processed by builder runtime continue to use
the existing generic debug.patch payload. Incomplete motion context
degrades gracefully. This script only manages queue readiness; the
fallback behavior lives in builderRuntime.ts.
