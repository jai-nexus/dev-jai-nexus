# Execution Plan (motion-0028)

## Intended changes
- prove one governed Work Packet vertical slice end-to-end
- refine packet detail UI where needed to make the slice observable
- ensure routing and evidence visibility are strong enough for the full path
- optionally tighten helper behavior only where required for the slice

## Files likely to modify
- portal/src/app/operator/work/[id]/page.tsx
- portal/src/app/operator/work/page.tsx
- portal/src/lib/work/workPacketActions.ts
- portal/src/lib/work/executionLane.ts
- portal/src/lib/sotWorkPackets.ts

## Optional supporting files (only if needed)
- portal/src/lib/work/agentRunContract.ts
- portal/src/lib/work/workPacketLifecycle.ts
- portal/src/app/operator/work/new/page.tsx

## Evidence
- pnpm -C portal typecheck PASS
- packet routed through architect lane
- packet routed through builder lane
- packet routed through verifier lane
- operator approves or requests changes
- run ledger / handoff history / SoT stream all show the slice coherently
