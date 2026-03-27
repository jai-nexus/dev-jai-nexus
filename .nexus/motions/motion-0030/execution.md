# Execution Plan (motion-0030)

## Intended changes
- introduce an architect-only live execution runner
- connect packet claim logic to explicit execution-role eligibility
- emit packet-linked runtime and planning evidence
- route completed architect work into builder-ready state

## Likely files
- .nexus/motions/motion-0030/*
- config/agency.yaml
- portal/src/lib/agencyConfig.ts
- portal/src/lib/agentRuntime.ts
- portal/src/lib/work/workPacketContract.ts
- portal/src/lib/work/workPacketLifecycle.ts
- portal/src/lib/work/executionLane.ts
- portal/src/lib/work/workPacketActions.ts
- portal/src/lib/work/agentRunContract.ts
- portal/src/app/operator/work/[id]/page.tsx
- portal/src/app/operator/work/page.tsx
- portal/scripts/* (if a runner entrypoint is needed)

## Suggested implementation order
1) define architect runner claim rules
2) wire role-eligible packet selection
3) emit WORK_CLAIMED
4) emit deterministic planning/debug evidence
5) emit completion + governed handoff
6) verify operator visibility

## Evidence
- pnpm -C portal typecheck PASS
- architect-routed packet can be claimed by architect-capable execution agent
- packet receives runtime + planning evidence
- packet advances into builder-ready state with audit continuity
