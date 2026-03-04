# Proposal (motion-0012)

## 0.0 Problem
We can view a panel if we already know the URL. There is no discoverable index of existing panels.

## 1.0 Goal
Add an Operator index page at /operator/panels that lists all panels under:
.nexus/motions/*/panels/*

## 2.0 Solution
- Add a bounded filesystem scan helper that reads only:
  - .nexus/motions/<motion>/panels/<panel>/panel.json
  - .nexus/motions/<motion>/panels/<panel>/selection.json
- Render a table with links to /operator/panels/[motionId]/[panelId]
- Handle missing .nexus or missing files gracefully.

## 3.0 Acceptance
- Deterministic ordering:
  - motion_id asc, panel_id asc
- No DB access.
- pnpm -C portal typecheck PASS.

## 4.0 Evidence
- pnpm -C portal typecheck: PASS
- pnpm -C portal dev: visit /operator/panels and click into motion-0010/JAI_DEV_BUILDER_PANEL_V0
