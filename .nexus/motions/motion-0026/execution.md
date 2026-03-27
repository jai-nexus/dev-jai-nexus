# Execution Plan (motion-0026)

## Intended changes
- add shared execution-loop helper(s) for operator routing actions
- centralize inbox/status/SoT mutation logic for packet execution transitions
- add explicit packet detail actions for governed lane routing
- add explicit current lane / next lane rendering on packet detail view
- optionally add lightweight execution-loop indicators on /operator/work

## Files to create
- portal/src/lib/work/workPacketActions.ts
- portal/src/lib/work/executionLane.ts

## Files to modify
- portal/src/app/operator/work/[id]/page.tsx
- portal/src/app/operator/work/page.tsx

## Likely supporting files (only if needed)
- portal/src/lib/sotWorkPackets.ts
- portal/src/lib/work/workPacketLifecycle.ts
- portal/src/lib/work/agentRunContract.ts

## Evidence
- pnpm -C portal typecheck PASS
- packet detail page exposes governed routing actions
- routing actions emit packet-linked SoT events
- current lane / next lane render correctly on packet detail page
- /operator/work reflects updated execution state after routing
