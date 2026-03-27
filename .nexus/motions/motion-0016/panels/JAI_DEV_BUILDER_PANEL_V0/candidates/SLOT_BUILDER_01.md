# Candidate (SLOT_BUILDER_01)

## Summary
- Operationalize Panels end-to-end: shared deterministic scorer + UI scoring + coverage signal.
- Extract the selection math into a single shared module used by both CLI and server actions (no drift).
- Add minimal operator workflow: enter 0–10 rubric scores per slot, save, then compute winner.
- Surface completion as a measurable signal (winner selected + evidence plan present) in both Panels index and Registry Coverage.

## Files touched
- `portal/src/lib/panels/panelSelectCore.mjs`
- `portal/src/lib/panels/panelSelectCore.d.ts`
- `portal/scripts/panel-select.mjs`
- `portal/src/lib/panels/panelStore.ts`
- `portal/src/lib/panels/panelIndex.ts`
- `portal/src/app/operator/panels/page.tsx`
- `portal/src/app/operator/panels/[motionId]/[panelId]/page.tsx`
- `portal/src/app/operator/registry/coverage/page.tsx`

## Patch sketch
- Shared scorer core (single source of truth):
  - `total = sum(breakdown[criterion] * weight) * 10` (clamped 0–10 per criterion; totals 0–100)
  - deterministic tie-break (slot name asc) when totals equal
- CLI wrapper now calls shared core:
  - preserves `--motion`, `--panel`, `--write`, `--verbose`
  - updates `selection.files` list for viewer context
- UI scoring workflow:
  - server action: save slot scores (clamp + recompute that slot total)
  - server action: compute winner (recalc all totals + winner using same scorer)
- Coverage signal:
  - completed = `winner !== "UNKNOWN"` AND `evidence_plan.commands.length > 0`
  - registry coverage page shows panels discovered/completed/incomplete + links

## Evidence plan
- `pnpm -C portal typecheck`
- `pnpm -C portal dev`
- Visit:
  - `/operator/panels`
  - `/operator/panels/motion-0010/JAI_DEV_BUILDER_PANEL_V0`
  - `/operator/registry/coverage`
- CLI verification:
  - `node portal/scripts/panel-select.mjs --motion motion-0010 --panel JAI_DEV_BUILDER_PANEL_V0 --verbose`
  - `node portal/scripts/panel-select.mjs --motion motion-0010 --panel JAI_DEV_BUILDER_PANEL_V0 --write --verbose`
- Expected:
  - typecheck PASS
  - UI saves breakdown values and updates totals
  - UI compute updates winner when at least one slot total > 0
  - panels index + coverage reflect completion signal

## Risks / tradeoffs
- UI introduces a write lane to `.nexus` artifacts:
  - Mitigation: strict safe-id validation + repo-root discovery + atomic write + bounded paths.
- Potential drift between UI and CLI logic:
  - Mitigation: both call the same `panelSelectCore` implementation.
- “Completed” is a policy choice:
  - Current definition requires both a winner and non-empty evidence commands; adjust later if needed.

## Estimated diff size
- M
