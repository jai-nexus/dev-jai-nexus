# Execution Plan (motion-0027)

## Intended changes
- wire execution lane state into Work Packets list page
- wire current lane / next lane into Work Packet detail page
- wire governed operator routing actions into Work Packet detail page
- consume shared helpers from motion-0026 instead of duplicating logic

## Files to modify
- portal/src/app/operator/work/page.tsx
- portal/src/app/operator/work/[id]/page.tsx

## Likely supporting files (only if needed)
- portal/src/lib/work/workPacketActions.ts
- portal/src/lib/work/executionLane.ts
- portal/src/lib/work/workPacketLifecycle.ts
- portal/src/lib/work/agentRunContract.ts

## Evidence
- pnpm -C portal typecheck PASS
- /operator/work shows lane-aware state
- /operator/work/[id] shows current lane + next lane
- /operator/work/[id] supports governed routing actions
