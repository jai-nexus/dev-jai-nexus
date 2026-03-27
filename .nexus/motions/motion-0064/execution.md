# Execution Plan - motion-0064

## Goal
Extend portal/scripts/motion-factory.mjs with --preview mode for the
draft command, completing preview coverage for all factory write commands.

## Plan
1. Modify draftCommand to accept a preview flag
   - same context gathering, provider resolution, narrative generation
   - same 9-file package assembly
   - if preview: print all 9 files with per-file markers, no directory
     creation, no file writes
   - if not preview: existing behavior unchanged
   - preview header includes: intent, provisional motion ID, provider,
     preview-only status
   - preview footer includes: no-write confirmation, provisional ID caveat

2. Handle preview failure
   - API failure in preview: print warning, no files, no directory
   - stdout must not imply a package was created
   - failure reported as failed proposed generation

3. Update main() to pass --preview flag to draft

4. Update usage() to document --preview for draft

5. Validate
   - draft --preview --intent "..." (default provider): confirm 9 files
     printed, no directory created
   - draft --preview --no-api --intent "...": confirm placeholder preview
   - draft --preview --provider anthropic --intent "...": confirm
     Anthropic preview (if key available)
   - draft without --preview: confirm normal directory creation unchanged
   - draft --preview without --intent: confirm clear error
   - confirm preview does not create motion directory
   - confirm provisional motion ID caveat is printed
   - confirm preview output uses per-file begin/end markers
   - confirm preview output is labeled proposed-only
   - clean up any test artifacts

## Files touched
- portal/scripts/motion-factory.mjs (EDIT — add --preview to draft)

## Files explicitly not touched
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml
- .nexus/docs/motion-factory-playbook.md

## Rollback plan
- Revert the --preview additions in motion-factory.mjs
- Existing draft behavior unchanged

## Acceptance criteria
- --preview prints proposed 9-file package without creating directory
- Preview output clearly identifies intent, provider, provisional ID,
  and preview-only status
- Clear per-file begin/end markers
- No files written, no directory created in preview mode
- Provisional motion ID caveat printed
- All validation applies in preview mode
- Preview failure reported as failed generation, not partial creation
- Normal draft mode unchanged
- --no-api preview works
- --provider preview works

## Done means
- All factory write commands (draft, revise, evidence) have preview mode,
- operators can inspect any proposed factory output before applying,
- and motion-0064 is ratified.
