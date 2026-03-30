# Execution: bounded verifier runtime readiness for motion-linked packets

**Motion:** motion-0079
**Date:** 2026-03-30

## Implementation surface

Two files changed:
- `portal/src/lib/work/verifierRuntime.ts` (modified)
- `portal/scripts/enqueue-verifier-packet.mjs` (new)

## verifierRuntime.ts changes

### Removals (dead code)
- `import crypto from "node:crypto"` — unused; emitDebugArtifact handles uuid
- `import { Prisma } from "@prisma/client"` — unused
- `import { assertSotEventV01 } from "@/lib/contracts/sotEventV01"` — unused
- `compactText` helper — defined but never called

### Additions
- `import fs from "node:fs"` and `import path from "node:path"`
- `import { getMotionFromTags } from "@/lib/work/workPacketContract"`
- `MotionContext` type (matching architect/builder pattern exactly)
- `findRepoRoot(startDir: string): string | null` (identical to prior runtimes)
- `loadMotionContext(inboxTags: string[]): MotionContext | null`
  - Reads `motion.yaml` (title via regex), `execution.md` (full text)
  - Returns null if no motion tag or repo root not found (logs warning)
  - Returns `MotionContext` with `executionPlan=''` if execution.md absent
- Updated `buildVerificationPayload(packet, agentNhId, motionContext?)`:
  - Motion-grounded payload when motionContext present
  - Existing generic payload when null (regression-free)
- `loadMotionContext(loaded.inboxTags)` call in `execute()` before emit

## enqueue-verifier-packet.mjs design

Symmetric parallel of `enqueue-builder-packet.mjs`:

| Concern         | BUILDER script              | VERIFIER script             |
|-----------------|-----------------------------|-----------------------------|
| Agent detection | `findBuilderAgent()`        | `findVerifierAgent()`       |
| Route guard     | `currentRoute !== "BUILDER"` | `currentRoute !== "VERIFIER"` |
| Role validation | execution_roles has BUILDER | execution_roles has VERIFIER |
| Auto-detected   | 6.0.11                      | 6.0.12                      |
| Proof command   | `run-builder-once.ts`       | `run-verifier-once.ts`      |

## Fallback behavior

| Condition                            | Behavior                                      |
|--------------------------------------|-----------------------------------------------|
| No motion tag in inbox               | null → generic verify payload, existing behavior |
| Repo root not found                  | warn + null → generic verify payload          |
| motion.yaml absent/unreadable        | motionId used as title                        |
| execution.md absent                  | warn + executionPlan='' in payload            |
| requestedRole !== VERIFIER in claim  | canClaimCandidate returns false (existing)    |
| requestedRole !== VERIFIER in execute | throws (existing defense-in-depth)           |
| route != VERIFIER in enqueue script  | refuses with clear message, exit 1           |

## Validation

```
node --check portal/scripts/enqueue-verifier-packet.mjs
```
Result: pass

```
pnpm -C portal typecheck
```
Result: pass, 0 errors

## Live proof sequence

```bash
# Step 1: create verifier queue item for packet 880 (motion-0070, route:VERIFIER)
node portal/scripts/enqueue-verifier-packet.mjs --motion motion-0070

# Step 2: run verifier proof
pnpm -C portal exec tsx scripts/run-verifier-once.ts 6.0.12
```

Expected: verifier claims packet 880, emits `debug.verify` SoT event with
`motionId`, `motionTitle`, and `executionPlan` fields, routes packet to
`ROUTE_OPERATOR_REVIEW`, exits 0.

## WS-2 completion

After this slice:
- Architect runtime: motion-context-aware (motion-0075)
- Builder runtime: motion-context-aware (motion-0077)
- Verifier runtime: motion-context-aware (motion-0079)
- All three queue bridges proven: enqueue-motion-packet.mjs (0076),
  enqueue-builder-packet.mjs (0078), enqueue-verifier-packet.mjs (0079)
- Live proof chain: architect → builder → verifier proven on motion-0070
