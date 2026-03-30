# Proposal: bounded builder motion-context binding

**Motion:** motion-0077
**Parent:** motion-0071 (WS-2 phase 3)
**Date:** 2026-03-30

## Context

WS-2 phase 1 (motion-0075) made the architect runtime motion-context-aware.
WS-2 phase 2 (motion-0076) proved the live architect execution on a
motion-linked packet (motion-0070) succeeds and emits a motion-grounded
debug.plan artifact. The architect runtime now routes completed motion-linked
packets to the BUILDER stage.

The builder runtime is the next execution stage. It currently has no
awareness of the governing motion. Its execute() method uses a private
loadPacket() that does not load inbox tags, making motion detection
impossible without a structural change.

## Proposed change

Refactor `portal/src/lib/work/builderRuntime.ts` to:

1. Replace the private `loadPacket()` with the base class
   `loadWorkPacketContext()` inside a transaction block, exposing inbox tags.
2. Add `loadMotionContext()` using the same pattern as architectRuntime.ts —
   reads `motion.yaml` (title only) and `execution.md`.
3. Add `canClaimCandidate()` override guarding `requestedRole === "BUILDER"`.
4. Add `buildPatchPayload()` that enriches the `debug.patch` payload with
   `motionId`, `motionTitle`, and `executionPlan` when motionContext is
   present.
5. Emit `debug.patch` via `emitDebugArtifact` (base class) inside the
   transaction, matching the architect pattern.

## Scope boundary

Only `portal/src/lib/work/builderRuntime.ts` changes. No other source files,
no schema migration, no new scripts, no verifier or operator surface changes.

## Why refactor execute() rather than add a side query?

The existing `loadPacket()` duplicates base class functionality and does not
load inbox tags. The architect already uses `loadWorkPacketContext` +
`emitDebugArtifact` inside a transaction. Aligning builder to the same
pattern is the governed coherent choice. The alternative (side query after
`loadPacket`) adds a second DB round-trip and leaves private duplication
as technical debt.
