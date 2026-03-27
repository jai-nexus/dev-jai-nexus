# Execution Plan (motion-0024)

## Intended changes
- Add progress filter UI to Panels index
- Add work queue shortcuts to Panels index
- Add deep links from Coverage progress breakdown to filtered queue views
- Add deterministic next-action hint in Panel Viewer

## Files to modify
- portal/src/app/operator/panels/page.tsx
- portal/src/app/operator/registry/coverage/page.tsx
- portal/src/app/operator/panels/[motionId]/[panelId]/page.tsx

## Evidence
- pnpm -C portal typecheck PASS
- pnpm -C portal dev:
  - /operator/panels exposes progress filter + work queue links
  - /operator/registry/coverage links into filtered queue views
  - /operator/panels/<motion>/<panel> shows next-action hint
