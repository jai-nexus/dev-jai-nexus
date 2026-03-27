# Proposal (motion-0021)

## 0.0 Problem
Model slots are now bound (motion-0020), but operator surfaces do not show what each slot resolves to. This makes panels harder to trust and harder to debug.

## 1.0 Goal
Display the resolved slot bindings (provider/model/notes) in the Panel Viewer for:
- candidate slots (5)
- selector slot (1)

## 2.0 Solution
- Extend the panel loader (`loadPanelView`) to also load `.nexus/model-slots.yaml`.
- Resolve the panel’s candidate slots + selector slot against the slots map.
- Return a `resolved_slots` map in the view payload.
- Render a “Slot Bindings” block in the viewer UI.

## 3.0 Acceptance
- `pnpm -C portal typecheck` PASS
- `/operator/panels/motion-0020/JAI_DEV_BUILDER_PANEL_V0` shows:
  - SLOT_BUILDER_01 → openai / <model>
  - …
  - SLOT_BUILDER_SELECTOR → openai / <model>
- Same for Architect/Verifier/Librarian/Operator panels under motion-0020.
- No changes to selection/scoring behavior.

## 4.0 Non-goals
- No routing logic changes
- No multi-provider budgeting/mixes
- No LLM execution
