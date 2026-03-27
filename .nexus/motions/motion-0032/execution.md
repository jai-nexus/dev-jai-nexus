# Execution Plan — motion-0032

## Goal
Prove the third live governed execution slice:
verifier claim + verification evidence + operator-review handoff.

## Plan
1. Add `portal/src/lib/work/verifierRuntime.ts`
   - implement verifier-specific runtime behavior on top of the queue-backed runtime base.

2. Add `portal/scripts/run-verifier-once.ts`
   - one-shot local proof entrypoint:
     - accepts verifier agent NH id,
     - attempts one claim,
     - logs success or no-claim result.

3. Ensure verifier claim is role-correct
   - verifier runner should only process packets that are actually verifier-routed / verifier-eligible.

4. Emit verification-shaped evidence
   - write packet-linked `debug.verify` event with compact, readable payload.

5. Add explicit operator-review routing
   - extend `portal/src/lib/work/workPacketActions.ts` with:
     - `ROUTE_OPERATOR_REVIEW`
   - ensure the action:
     - writes `route:OPERATOR_REVIEW`,
     - emits `WORK_ROUTED`,
     - keeps operator review semantically separate from `APPROVE`.

6. Complete verifier run
   - emit:
     - `WORK_CLAIMED`
     - `debug.verify`
     - `WORK_COMPLETED`
     - `WORK_ROUTED -> OPERATOR_REVIEW`

7. Validate packet UI
   - verifier stage shows complete,
   - operator review shows ready,
   - run ledger shows the full verifier event strip,
   - handoff history shows routing to operator review.

8. Proof procedure
   - create a fresh verifier smoke packet,
   - manually assign to a verifier-capable execution agent,
   - run one-shot verifier runtime,
   - confirm live evidence.

## Suggested smoke packet
NH:
`1.2.102`

Title:
`Verifier runtime smoke test`

Execution role:
`VERIFIER`

Suggested assignee:
`6.0.12`

## Suggested AC
- packet is assigned to a verifier-capable execution agent
- queue row exists
- verifier runtime claims packet
- `debug.verify` is emitted
- runtime emits `WORK_COMPLETED`
- packet is routed to operator review
- latest inbox tags reflect `route:OPERATOR_REVIEW`
- operator UI shows the packet as review-ready

## Done means
- live verifier one-shot succeeds,
- packet becomes operator-review-ready,
- typecheck passes,
- council ratifies motion-0032.
