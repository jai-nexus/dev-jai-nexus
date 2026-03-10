# Execution Plan (motion-0022)

## Implementation steps
1. Add/extend a panel index loader to compute per-panel binding summary:
   - total_slots, unknown_slots, provider_model_label
2. Update Panels Index page:
   - show Binding Summary and Bound count per row
3. Update Coverage page:
   - show aggregate binding health + “needs attention” list for unknown bindings

## Evidence
- `pnpm -C portal typecheck` PASS
- `pnpm -C portal dev`
- Verify:
  - `/operator/panels` shows binding summary per panel
  - `/operator/registry/coverage` shows binding health cards and unknown list (if any)

- `pnpm council:run motion-0022`
