# Execution Plan (motion-0029)

## Intended changes
- extend agency configuration with explicit execution-role metadata
- add helper logic for governance/execution separation
- update work packet creation and packet detail surfaces to use execution-eligible agent pools
- surface invalid legacy role/assignee combinations clearly

## Likely files
- config/agency.yaml
- portal/src/lib/agencyConfig.ts
- portal/src/lib/work/workPacketContract.ts
- portal/src/lib/work/executionLane.ts
- portal/src/app/operator/work/new/page.tsx
- portal/src/app/operator/work/[id]/page.tsx
- portal/src/app/operator/work/page.tsx

## Optional helper additions
- portal/src/lib/work/executionAgents.ts

## Evidence
- pnpm -C portal typecheck PASS
- requested execution role filters assignee choices correctly
- governance-only agents are excluded from execution assignment surfaces
- legacy mismatches are rendered visibly
