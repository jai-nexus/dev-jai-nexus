# Execution Plan (motion-0021)

## Implementation steps
1. Add `loadModelSlots()` helper to read `.nexus/model-slots.yaml` at repo root.
2. Update `loadPanelView()` to compute:
   - `resolved_slots` for candidate slots + selector slot
3. Render a “Slot Bindings” section in the Panel Viewer page.

## Evidence
- `pnpm -C portal typecheck` PASS
- `pnpm -C portal dev`
- Visit:
  - `/operator/panels/motion-0020/JAI_DEV_BUILDER_PANEL_V0`
  - `/operator/panels/motion-0020/JAI_DEV_ARCHITECT_PANEL_V0`
  - `/operator/panels/motion-0020/JAI_DEV_VERIFIER_PANEL_V0`
  - `/operator/panels/motion-0020/JAI_DEV_LIBRARIAN_PANEL_V0`
  - `/operator/panels/motion-0020/JAI_DEV_OPERATOR_PANEL_V0`
- Confirm Slot Bindings show provider/model values from `.nexus/model-slots.yaml`.
