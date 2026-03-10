# Execution Plan (motion-0023)

## Intended changes
- Add deterministic progress computation for panel completion:
  - INVALID
  - NEEDS_SCORES
  - NEEDS_WINNER
  - NEEDS_EVIDENCE
  - COMPLETE

- Surface it in:
  - Panels index (table + filter)
  - Coverage (counts + needs-attention list)
  - Panel viewer (status + reason)

## Files to create
- portal/src/lib/panels/panelProgress.ts

## Files to modify
- portal/src/lib/panels/panelIndex.ts
- portal/src/app/operator/panels/page.tsx
- portal/src/app/operator/registry/coverage/page.tsx
- portal/src/app/operator/panels/[motionId]/[panelId]/page.tsx

## Evidence
- pnpm -C portal typecheck PASS
- pnpm -C portal dev:
  - /operator/panels shows progress + filter works
  - /operator/registry/coverage shows progress needs-attention list
  - /operator/panels/<motion>/<panel> shows status + reason
