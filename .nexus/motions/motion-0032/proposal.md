# Proposal — motion-0032

## Title
Third Live Execution Runner v0: verifier claim + verification evidence + operator-review handoff

## Why this motion exists
Motion-0030 proved the first live execution slice for architect:
- assigned queue-backed packet creation,
- architect claim from AgentQueueItem,
- `WORK_CLAIMED`,
- `debug.plan`,
- `WORK_COMPLETED`,
- `WORK_ROUTED -> BUILDER`.

Motion-0031 then proved the second live execution slice for builder:
- builder claim from AgentQueueItem,
- `WORK_CLAIMED`,
- `debug.patch`,
- `WORK_COMPLETED`,
- `WORK_ROUTED -> VERIFIER`.

That means the next disciplined step is the verifier leg. We should prove that a verifier-capable execution agent can claim a verifier-routed packet, emit verification evidence, and move the packet into operator-review-ready state.

## What this motion changes
This motion adds the verifier runtime proof path:
1. one-shot verifier runner entrypoint,
2. verifier runtime implementation,
3. packet-linked verification evidence emission,
4. verifier completion and explicit routing to operator review,
5. small routing cleanup so verifier handoff uses a dedicated `ROUTE_OPERATOR_REVIEW` action instead of overloading `APPROVE`.

## Governance stance
This motion keeps the system role-first and operator-governed:
- operator still chooses execution role,
- operator still controls final review/approval,
- system proves live verifier execution only after assignment exists,
- no auto-approval logic is introduced here,
- no hidden operator assignment behavior is added here.

## Intended proof packet behavior
A verifier-routed packet assigned to a verifier-capable execution agent should:
- be claimable by the verifier runner,
- emit `WORK_CLAIMED`,
- emit `debug.verify`,
- emit `WORK_COMPLETED`,
- emit `WORK_ROUTED` toward `OPERATOR_REVIEW`,
- appear in the UI as verifier complete and operator review ready.

## Expected files
- `portal/src/lib/work/verifierRuntime.ts`
- `portal/scripts/run-verifier-once.ts`

Expected touchpoints:
- `portal/src/lib/work/workPacketActions.ts`

Possible touchpoints:
- `portal/src/lib/work/agentRunContract.ts`
- `portal/src/app/operator/work/[id]/page.tsx`
- `portal/src/app/operator/work/page.tsx`

## Acceptance proof
A live smoke packet should demonstrate:
- verifier claim,
- verification artifact evidence,
- completion,
- operator-review handoff,
- clean typecheck,
- successful council ratification.
