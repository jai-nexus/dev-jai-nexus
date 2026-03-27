# Proposal - motion-0048

## Title
Reconcile agent-panels.yaml with Phase 1 staffing canon (5→2 candidates per panel)

## Why this motion exists
motion-0046 ratified a Phase 1 staffing manifest with 2 live slots per panel.
motion-0047 proved that `loadSlots()` in `panel-run.mjs` correctly overlays
those slots. But `.nexus/agent-panels.yaml` still declares 5 candidates per
panel, and `panel-run.mjs` enforces `candidates.length !== 5` on line 348.

This creates a mismatch: scaffold emits 5 candidate files per panel even
though only 2 live slots exist. Three of those candidate files reference
legacy placeholder slots that serve no Phase 1 purpose.

## What this motion changes

### .nexus/agent-panels.yaml
For each of the 5 executor panels (Builder, Architect, Verifier, Librarian,
Operator):
- reduce the `candidates` list from 5 entries to 2, keeping only the Phase 1
  primary and alternate slot names,
- add `status: deferred` to the selector block to explicitly mark it non-live,
- fix the Operator panel's pre-existing YAML bug where rubric entries were
  incorrectly indented under `selector` instead of being a sibling key.

All rubric weights and criteria remain unchanged.

### portal/scripts/panel-run.mjs
- Relax line 348 from `candidates.length !== 5` to `candidates.length < 2`,
  so the scaffold accepts panels with 2 or more candidates.

## What this motion does not change
- `.nexus/model-slots-phase1.yaml` (unchanged)
- `.nexus/model-slots.yaml` (unchanged)
- `.nexus/model-routing.yaml` (unchanged)
- `.nexus/council.config.yaml` (unchanged)
- `loadSlots()` overlay logic from motion-0047 (unchanged)
- Selector activation (still deferred)
- Rubric weights or criteria (unchanged)

## Design stance
This is a structural reconciliation motion. It removes a concrete mismatch
between the ratified Phase 1 staffing canon and the panel structure that
consumes it. No new abstractions, no runtime changes, no selector activation.

## Why now
Every scaffold run currently produces 3 phantom candidate files per panel.
The longer this mismatch persists, the more dead artifacts accumulate in
motion panel directories. Reconciling now keeps the repo clean and makes
subsequent panel work (scoring, selection) operate against the real Phase 1
slot set.
