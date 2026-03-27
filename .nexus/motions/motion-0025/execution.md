# Execution Plan (motion-0025)

## Intended changes
- add shared work packet contract helpers
- add shared packet control/lifecycle helper
- add shared run ledger / handoff mapping helpers
- update Work Packets index to display lifecycle/control info
- update New Work Packet flow to emit richer contract-aware payloads
- update Work Packet detail page to display contract summary, run ledger, and handoff history

## Files to create
- portal/src/lib/work/workPacketContract.ts
- portal/src/lib/work/workPacketLifecycle.ts
- portal/src/lib/work/agentRunContract.ts

## Files to modify
- portal/src/app/operator/work/page.tsx
- portal/src/app/operator/work/new/page.tsx
- portal/src/app/operator/work/[id]/page.tsx

## Evidence
- pnpm -C portal typecheck PASS
- /operator/work shows lifecycle + next action
- /operator/work/new creates packets and emits contract-aware metadata
- /operator/work/[id] shows run ledger + handoff history
