# Execution Plan - motion-0061

## Goal
Extend portal/scripts/motion-factory.mjs with a status command for
live operator visibility.

## Plan
1. Add statusCommand function to motion-factory.mjs
   - gather: script version, repo root, branch, next motion ID
   - report: available commands, default provider, supported providers
   - report: OPENAI_API_KEY presence, ANTHROPIC_API_KEY presence
     (present/missing only, never the actual value)
   - include inline caveat that key presence is environmental only
   - report: revise file scope (default + allowed), evidence file scope
     (default + allowed), protected structural files
   - report: placeholder-first reminder, structural files reminder,
     human review reminder
   - print structured summary to stdout
   - --json flag for machine-readable output

2. Add status command routing in main()
   - no required arguments
   - optional --json flag

3. Update usage text
   - document status command

4. Validate
   - run status and confirm concise output
   - run status --json and confirm machine-readable output
   - confirm no files written
   - confirm no API calls
   - confirm key presence reported as present/missing only
   - confirm key presence caveat is displayed
   - confirm next motion ID is correct
   - confirm branch is correct

## Files touched
- portal/scripts/motion-factory.mjs (EDIT — add status command)

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
- Revert the status command additions in motion-factory.mjs
- Existing commands are unchanged

## Acceptance criteria
- status command prints live factory configuration summary
- --json produces machine-readable output
- No files written, no API calls
- Key presence reported as present/missing only (not key values)
- Key presence does not claim provider health or readiness
- Branch, repo root, next motion ID reported
- Commands, providers, file scopes reported
- Safe to run anytime

## Done means
- Motion Factory v0 has a live status command for operator visibility,
- the command complements the static playbook,
- and motion-0061 is ratified.
