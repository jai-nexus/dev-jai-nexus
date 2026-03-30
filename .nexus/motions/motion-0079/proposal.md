# Proposal: bounded verifier runtime readiness for motion-linked packets

**Motion:** motion-0079
**Parent:** motion-0071 (WS-2 phase 5 / WS-2 completion)
**Date:** 2026-03-30

## Context

motion-0077 completed builder motion-context binding. motion-0078 proved
live builder execution on packet 880 (motion-0070), which is now at
`route:VERIFIER` stage. WS-2 completes with this slice.

The verifier runtime is already structurally aligned with the architect
pattern: it uses `loadWorkPacketContext` inside a transaction,
`emitDebugArtifact`, and `canClaimCandidate` with a VERIFIER role guard.
The motion-context layer can be added with minimal structural change.

## Two gaps to close

**Gap 1 — No motion-context binding in verifierRuntime.ts:**
`buildVerificationPayload` produces a generic stub. `loadMotionContext`
is not called. The inbox tags are available (via `loaded.inboxTags`) but
never inspected for a motion tag.

**Gap 2 — Queue item deleted after ROUTE_VERIFIER:**
`applyPacketRouteAction("ROUTE_VERIFIER", clearAssignee=true)` →
`syncAgentQueueItemForPacket(null)` → `deleteMany` → claimNext() finds
nothing. Same root cause as the builder gap (motion-0078).

## Proposed changes

### verifierRuntime.ts (one source file)

1. Remove dead imports: `crypto`, `Prisma`, `assertSotEventV01` — these
   were left over and are no longer used now that `emitDebugArtifact`
   handles SoT emission.
2. Remove dead `compactText` helper (defined but never called).
3. Add `fs`, `path`, `getMotionFromTags` imports.
4. Add `MotionContext` type, `findRepoRoot`, `loadMotionContext` — exact
   pattern from architectRuntime.ts and builderRuntime.ts.
5. Update `buildVerificationPayload` to accept optional `MotionContext`.
6. Call `loadMotionContext(loaded.inboxTags)` inside `execute()` and pass
   result to `buildVerificationPayload`.

### enqueue-verifier-packet.mjs (one new script)

Symmetric parallel of `enqueue-builder-packet.mjs` for VERIFIER role:
- `findVerifierAgent()` auto-detects 6.0.12 from `config/agency.yaml`
- route guard: `currentRoute !== "VERIFIER"`
- proof command: `run-verifier-once.ts 6.0.12`

## Scope boundary

Two files only: `verifierRuntime.ts` (modified) and
`enqueue-verifier-packet.mjs` (new). WS-2 is complete after this slice.
