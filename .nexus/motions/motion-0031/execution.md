# Execution Plan — motion-0031

## Goal
Prove the second live governed execution slice:
builder claim + patch evidence + verifier handoff.

## Plan
1. Add `portal/src/lib/work/builderRuntime.ts`
   - implement builder-specific runtime behavior on top of the queue-backed runtime base.

2. Add `portal/scripts/run-builder-once.ts`
   - one-shot local proof entrypoint:
     - accepts builder agent NH id,
     - attempts one claim,
     - logs success or no-claim result.

3. Ensure builder claim is role-correct
   - builder runner should only process packets that are actually builder-routed / builder-eligible.

4. Emit patch-shaped evidence
   - write packet-linked `debug.patch` event with compact, readable payload.

5. Complete builder run
   - emit:
     - `WORK_CLAIMED`
     - `debug.patch`
     - `WORK_COMPLETED`
     - `WORK_ROUTED -> VERIFIER`

6. Validate packet UI
   - builder stage shows complete,
   - verifier stage shows ready,
   - run ledger shows the full builder event strip,
   - handoff history shows routing to verifier.

7. Proof procedure
   - create a fresh builder smoke packet,
   - manually assign to a builder-capable execution agent,
   - run one-shot builder runtime,
   - confirm live evidence.

## Suggested smoke packet
NH:
`1.2.101`

Title:
`Builder runtime smoke test`

Execution role:
`BUILDER`

Suggested AC:
- packet is assigned to a builder-capable execution agent
- queue row exists
- builder runtime claims packet
- `debug.patch` is emitted
- runtime emits `WORK_COMPLETED`
- packet is routed to verifier

## Done means
- live builder one-shot succeeds,
- packet becomes verifier-ready,
- typecheck passes,
- council ratifies motion-0031.
