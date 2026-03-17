# Execution Plan - motion-0052

## Goal
Add portal/scripts/motion-factory.mjs with an inspectable context command.

## Plan
1. Create portal/scripts/motion-factory.mjs
   - implement repo root discovery (reuse .nexus/ walk pattern)
   - implement git helpers for branch and head commit
   - implement YAML reading with safeYamlLoad pattern
   - implement motion directory enumeration and next-ID computation
   - implement context assembly from .nexus/ surfaces
   - implement --intent and --json CLI flags
   - implement structured stdout output

2. Validate
   - run context command with a sample intent
   - confirm output includes: next motion ID, recent motions, branch,
     head commit, governance config, staffing summary, panel summary, intent
   - confirm --json produces valid JSON
   - confirm no files are written
   - confirm no API calls are made

## Files touched
- portal/scripts/motion-factory.mjs (NEW)

## Files explicitly not touched
- portal/scripts/generate-context-bundle.mjs
- portal/scripts/generate-repo-capsule.mjs
- portal/scripts/panel-run.mjs
- portal/scripts/panel-select.mjs
- portal/scripts/council-run.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml

## Rollback plan
- Delete portal/scripts/motion-factory.mjs

## Acceptance criteria
- Script runs without error
- context command prints structured context summary
- Output includes all expected fields
- --json produces valid parseable JSON
- No files written
- No API calls made

## Done means
- Motion Factory v0 has its first inspectable user-facing surface,
- context gathering is proven and ready for future draft/revise commands,
- and motion-0052 is ratified.
