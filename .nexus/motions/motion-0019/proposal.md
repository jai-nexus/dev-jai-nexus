# Proposal (motion-0019)

## 0.0 Problem
We now have:
- `panel-run instantiate` (motion-0017)
- multiple registered panels + slots (motion-0018)

We need a concrete end-to-end proof that `instantiate --all` scaffolds *all* registered panels for a new motion, deterministically and idempotently.

## 1.0 Goal
Create a demo motion that:
- scaffolds all registered panel types under `.nexus/motions/motion-0019/panels/*`
- proves idempotency on re-run
- validates repo remains type-safe

## 2.0 Execution
- Run dry-run to print the deterministic plan
- Run instantiate to write panel artifacts
- Re-run instantiate to confirm no changes without `--force`

## 3.0 Acceptance
- Dry-run lists 5 panels:
  - JAI_DEV_BUILDER_PANEL_V0
  - JAI_DEV_ARCHITECT_PANEL_V0
  - JAI_DEV_VERIFIER_PANEL_V0
  - JAI_DEV_LIBRARIAN_PANEL_V0
  - JAI_DEV_OPERATOR_PANEL_V0
- Instantiate creates 5 panel directories with:
  - `panel.json`, `selector.md`, `selection.json`, `candidates/*.md`
- Re-running instantiate produces no changes unless `--force`
- `pnpm -C portal typecheck` PASS

## 4.0 Non-goals
- No scoring / winner selection (panel-select is separate)
- No LLM calls
