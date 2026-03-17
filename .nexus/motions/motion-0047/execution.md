# Execution Plan - motion-0047

## Goal
Wire the Librarian panel as the first live consumer of
`.nexus/model-slots-phase1.yaml`.

## Plan
1. Identify the existing slot-resolution surface
   - locate the current helper that reads `.nexus/model-slots.yaml` and
     returns provider + model for a given slot name
   - confirm its interface and call sites

2. Extend slot resolution for Librarian
   - add a code path that, for Librarian panel slots (`SLOT_LIBRARIAN_01`,
     `SLOT_LIBRARIAN_02`), reads from `.nexus/model-slots-phase1.yaml`
     instead of the legacy file
   - include file-existence and parse validation with a clear error on failure
   - design the extension for reuse by future panel wiring motions

3. Validate correct resolution
   - confirm `SLOT_LIBRARIAN_01` resolves to `anthropic / claude-haiku-4-5`
   - confirm `SLOT_LIBRARIAN_02` resolves to `openai / gpt-5-mini`
   - confirm all non-Librarian slots still resolve from the legacy path
     unchanged

4. Do not touch panel structure or other panels
   - `.nexus/agent-panels.yaml` is unchanged
   - Architect, Builder, Verifier, Operator resolution is unchanged
   - no selector logic is activated

## Files touched
- Existing portal slot-resolution helper (EDIT — extend, not replace)
- Validation script or test for Librarian resolution (NEW or extend existing)

## Files explicitly not touched
- `.nexus/agent-panels.yaml`
- `.nexus/model-slots.yaml`
- `.nexus/model-routing.yaml`
- `.nexus/council.config.yaml`
- `.nexus/model-slots-phase1.yaml` (read-only consumer; not modified)

## Rollback plan
- Revert the slot-resolution helper to its pre-motion state
- No config files are modified, so no further rollback is needed

## Acceptance criteria
- Librarian panel resolves from `model-slots-phase1.yaml`
- Primary: `anthropic / claude-haiku-4-5`
- Alternate: `openai / gpt-5-mini`
- All other panels resolve unchanged
- No selector logic activated
- Validation passes

## Done means
- The Phase 1 staffing canon has its first live consumer,
- the resolution pattern is proven and reusable,
- and motion-0047 is ratified.
