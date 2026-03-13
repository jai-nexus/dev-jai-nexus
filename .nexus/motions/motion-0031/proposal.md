# Proposal — motion-0031

## Title
Second Live Execution Runner v0: builder claim + patch evidence + verifier handoff

## Why this motion exists
Motion-0030 proved the first live execution slice for architect:
- assigned queue-backed packet creation,
- architect claim from AgentQueueItem,
- `WORK_CLAIMED`,
- `debug.plan`,
- `WORK_COMPLETED`,
- `WORK_ROUTED -> BUILDER`.

That means the next disciplined step is the builder leg. We should prove that a builder-capable execution agent can claim a builder-routed packet, emit patch evidence, and move the packet into verifier-ready state.

## What this motion changes
This motion adds the builder runtime proof path:
1. one-shot builder runner entrypoint,
2. builder runtime implementation,
3. packet-linked patch evidence emission,
4. builder completion and explicit routing to verifier.

## Governance stance
This motion keeps the system role-first and operator-governed:
- operator still chooses execution role,
- operator still assigns builder-capable assignee manually,
- system proves live execution only after assignment exists,
- no auto-handoff logic is introduced here.

## Intended proof packet behavior
A builder-routed packet assigned to a builder-capable execution agent should:
- be claimable by the builder runner,
- emit `WORK_CLAIMED`,
- emit `debug.patch`,
- emit `WORK_COMPLETED`,
- emit `WORK_ROUTED` toward `VERIFIER`,
- appear in the UI as builder complete and verifier ready.

## Expected files
- `portal/scripts/run-builder-once.ts`
- `portal/src/lib/work/builderRuntime.ts`

Possible touchpoints:
- `portal/src/lib/agentRuntime.ts`
- `portal/src/lib/work/workPacketActions.ts`
- `portal/src/lib/work/agentRunContract.ts`
- work surfaces only if small UI adjustments are needed

## Acceptance proof
A live smoke packet should demonstrate:
- builder claim,
- patch artifact evidence,
- completion,
- verifier handoff,
- clean typecheck,
- successful council ratification.
