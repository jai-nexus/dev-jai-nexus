# Execution Plan - motion-0046

## Goal
Commit the corrected Phase 1 model staffing manifest as the canonical staffing input for JAI NEXUS council operations.

## Plan
1. Add the Phase 1 staffing manifest
   - create `.nexus/model-slots-phase1.yaml`
   - contents as specified in the motion artifact (10 live slots, 5 deferred selectors, 3 voting roles)

2. Validate YAML well-formedness
   - parse the file with a YAML linter
   - confirm no syntax errors, duplicate keys, or encoding issues

3. Validate staffing constraints
   - confirm exactly 10 live executor slots (2 per panel × 5 panels)
   - confirm 5 deferred selector slots with `live: false`
   - confirm 3 voting roles with explicit provider/model assignments
   - confirm only `anthropic` and `openai` in providers allowlist
   - confirm no third-party pricing URLs or external benchmark references

4. Leave model-slots.yaml and model-routing.yaml untouched
   - this motion does not deprecate or modify existing files
   - reconciliation is deferred to a follow-up motion

## Files touched
- `.nexus/model-slots-phase1.yaml` (NEW)

## Files explicitly not touched
- `.nexus/model-slots.yaml` (existing, unchanged)
- `.nexus/model-routing.yaml` (existing, unchanged)
- `.nexus/agent-panels.yaml` (existing, unchanged)
- `.nexus/council.config.yaml` (existing, unchanged)

## Rollback plan
- Delete `.nexus/model-slots-phase1.yaml`
- No other files are modified, so no further rollback is needed

## Suggested proof
- YAML parse succeeds with no errors
- Slot counts match: 10 live, 5 deferred, 3 voting
- Provider allowlist contains exactly `anthropic` and `openai`
- `grep` for pricing URLs returns zero matches
- File is self-consistent (summary block matches actual slot definitions)

## Acceptance criteria
- `.nexus/model-slots-phase1.yaml` exists and parses cleanly
- Slot counts and assignments match the motion specification exactly
- No external pricing or benchmark references present
- The file is ratifiable as the canonical Phase 1 staffing input

## Done means
- dev-jai-nexus has a governed, corrected Phase 1 staffing manifest,
- the council can reference a single canonical file for all model assignments,
- selector slots are honestly deferred rather than falsely activated,
- and motion-0046 is ratified.
