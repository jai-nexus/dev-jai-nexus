# Proposal (motion-0018)

## 0.0 Problem
Panel instantiation now supports `instantiate --all`, but the manifest currently defines only one panel (Builder). To scale, we need role panels + their model slots.

## 1.0 Goal
Expand the panel manifest and model slots so panels can be instantiated for key dev roles:
- Architect
- Verifier
- Librarian
- Operator

## 2.0 Changes
- Update `.nexus/model-slots.yaml` to add:
  - SLOT_ARCHITECT_01..05 + SLOT_ARCHITECT_SELECTOR
  - SLOT_VERIFIER_01..05 + SLOT_VERIFIER_SELECTOR
  - SLOT_LIBRARIAN_01..05 + SLOT_LIBRARIAN_SELECTOR
  - SLOT_OPERATOR_01..05 + SLOT_OPERATOR_SELECTOR
- Update `.nexus/agent-panels.yaml` to register:
  - JAI_DEV_ARCHITECT_PANEL_V0
  - JAI_DEV_VERIFIER_PANEL_V0
  - JAI_DEV_LIBRARIAN_PANEL_V0
  - JAI_DEV_OPERATOR_PANEL_V0

## 3.0 Acceptance
- `node portal/scripts/panel-run.mjs instantiate --motion motion-0018 --all --dry-run` lists 5 panels
- `node portal/scripts/panel-run.mjs instantiate --motion motion-0018 --all` scaffolds all panels successfully
- `pnpm -C portal typecheck` PASS

## 4.0 Non-goals
- No LLM calls
- No panel scoring/winner selection changes (separate tool)
