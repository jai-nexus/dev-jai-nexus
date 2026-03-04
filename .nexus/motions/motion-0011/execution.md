# Execution Plan (motion-0011)

## Intended changes
- Add a small server-side loader that reads panel artifacts from .nexus.
- Add an Operator UI page that displays:
  - panel meta
  - selection record + scores
  - candidate list + previews

## Files to create
- portal/src/lib/panels/panelStore.ts
- portal/src/app/operator/panels/[motionId]/[panelId]/page.tsx

## Evidence
- pnpm -C portal typecheck PASS
- pnpm -C portal dev, open viewer URL, confirm renders
