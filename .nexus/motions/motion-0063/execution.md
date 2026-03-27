# Execution Plan - motion-0063

## Goal
Extend portal/scripts/motion-factory.mjs with --preview mode for revise
and evidence commands.

## Plan
1. Modify reviseCommand to accept a preview flag
   - same validation, API call, parsing, and all-or-nothing check
   - if preview: print proposed content with per-file markers, no writes
   - if not preview: existing atomic write behavior unchanged
   - preview stdout clearly labeled as proposed-only / not applied

2. Modify evidenceCommand to accept a preview flag
   - same approach as revise: print instead of write
   - evidence trust boundaries (non-invention, ambiguity preservation)
     apply identically in preview mode
   - preview is not a looser interpretation lane

3. Update main() to pass --preview flag to revise and evidence

4. Update usage() to document --preview for revise and evidence

5. Validate
   - revise --preview: confirm proposed content printed, no files written
   - evidence --preview: confirm proposed content printed, no files written
   - revise without --preview: confirm normal atomic apply unchanged
   - evidence without --preview: confirm normal atomic apply unchanged
   - revise --preview with --files narrow: confirm single file preview
   - revise --preview with disallowed file: confirm clear error
   - revise --preview with missing motion: confirm clear error
   - evidence --preview with missing evidence file: confirm clear error
   - confirm preview output uses per-file begin/end markers
   - confirm preview output is labeled proposed-only / not applied
   - confirm no misleading success wording in preview output
   - clean up any test artifacts

## Files touched
- portal/scripts/motion-factory.mjs (EDIT — add --preview to revise and evidence)

## Files explicitly not touched
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml
- .nexus/docs/motion-factory-playbook.md (update deferred to a future motion)

## Rollback plan
- Revert the --preview additions in motion-factory.mjs
- Existing apply behavior is unchanged

## Acceptance criteria
- --preview prints proposed content without writing files
- Preview output clearly labeled as proposed-only / not applied
- Clear per-file begin/end markers in preview output
- No file writes in preview mode under any success or failure path
- All validation applies in preview mode
- Preview uses same pipeline as apply (validation, generation, parsing)
- Evidence preview preserves non-invention and ambiguity-preservation rules
- Normal apply mode unchanged

## Done means
- Motion Factory v0 has preview mode for revise and evidence,
- operators can inspect proposed changes before applying,
- and motion-0063 is ratified.
