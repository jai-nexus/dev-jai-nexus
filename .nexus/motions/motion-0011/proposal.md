# Proposal (motion-0011)

## 0.0 Problem
We now have Agent Panels v0 and a panel-run scaffold that writes durable artifacts under:
.nexus/motions/<motionId>/panels/<panelId>/

But there is no first-class Operator UI for viewing:
- panel meta (role, candidates, rubric)
- selection record (winner, scores, rationale)
- candidate outputs

Without a viewer, panels remain “filesystem-only” and hard to review quickly.

## 1.0 Goal
Create an internal Operator UI page that renders panel artifacts for a given motion + panel id.

## 2.0 Solution
Add a viewer route:

/operator/panels/[motionId]/[panelId]

The page reads ONLY:
- .nexus/motions/<motionId>/panels/<panelId>/panel.json
- .nexus/motions/<motionId>/panels/<panelId>/selection.json
- .nexus/motions/<motionId>/panels/<panelId>/candidates/*.md (list + previews)

It must not scan outside the .nexus/motions subtree.

## 3.0 Acceptance Criteria
- Page renders with helpful errors if artifacts are missing.
- Deterministic ordering:
  - candidates sorted by filename
  - score table sorted by total desc then slot name
- No DB access.
- Typecheck PASS.
- Re-running council-run produces stable artifacts.

## 4.0 Evidence
- pnpm -C portal typecheck: PASS
- pnpm -C portal dev, then open:
  http://localhost:3000/operator/panels/motion-0010/JAI_DEV_BUILDER_PANEL_V0
- (Optional) Screenshot in PR description

## 5.0 Rollback
Delete:
- portal/src/lib/panels/panelStore.ts
- portal/src/app/operator/panels/[motionId]/[panelId]/page.tsx
