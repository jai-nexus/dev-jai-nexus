# Proposal (motion-0022)

## 0.0 Problem
Slot bindings are now visible inside the Panel Viewer (motion-0021), but operators still can’t see binding health at-a-glance on:
- Panels Index (/operator/panels)
- Workspace Coverage (/operator/registry/coverage)

This makes it hard to spot drift or UNKNOWN bindings across many panels/motions.

## 1.0 Goal
Surface a compact “Bindings Summary” on list pages:
- Panels Index: show provider/model summary and bound/unknown counts per panel
- Coverage: show aggregate counts and highlight panels with unknown bindings

## 2.0 Solution
- Extend panel indexing/coverage loaders to resolve:
  - candidate slots + selector slot → provider/model/notes (via .nexus/model-slots.yaml)
- Compute per-panel summary:
  - total_slots = candidates + selector (usually 6)
  - unknown_slots count (provider/model UNKNOWN)
  - provider/model set:
    - if all identical: show "openai:gpt-5"
    - else show "mixed" and counts
- Render:
  - Panels Index: add columns for “Bindings” and “Bound”
  - Coverage: add cards for “Slots bound” and “Slots unknown”, plus a “Needs attention” list for panels with unknown bindings

## 3.0 Acceptance
- `pnpm -C portal typecheck` PASS
- `/operator/panels` shows a Binding Summary per row:
  - example: `openai:gpt-5` + `6/6 bound` (or `4/6 bound`)
- `/operator/registry/coverage` shows aggregate binding health:
  - slots_bound, slots_unknown
  - panels_with_unknown link list to viewer pages
- No change to scoring / winner selection semantics.

## 4.0 Non-goals
- No routing logic changes
- No multi-provider budgeting/mixes
- No LLM calls
