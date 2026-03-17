# Execution Plan - motion-0053

## Goal
Extend portal/scripts/motion-factory.mjs with a draft command that creates
a 9-file motion package in DRAFT state using deterministic scaffolding.

## Plan
1. Add draft command to motion-factory.mjs
   - reuse context-gathering logic to determine next motion ID and
     governance defaults
   - accept --intent (required)
   - check that target motion directory does not exist; if it does, stop
     with a clear error (no overwrite behavior)

2. Implement deterministic file generation
   - motion.yaml: motion_id, title from intent, status proposed, created_at,
     owner, target, placeholder sections with "Draft scaffold — pending"
     markers for summary, problem, proposal, non_goals, success_criteria
   - policy.yaml: protocol_version, vote_mode, required_voters, risk defaults
     from council.config.yaml
   - decision.yaml: DRAFT scaffold
   - decision.md: "DRAFT — awaiting vote"
   - vote.json: PENDING with empty votes
   - verify.json: pending with required_ok false
   - proposal.md: title header, original intent, "Draft scaffold — narrative
     content pending"
   - challenge.md: section headers, "Draft scaffold — risks and objections
     pending"
   - execution.md: section headers, "Draft scaffold — execution plan pending"

3. Print stdout summary
   - created motion ID
   - created path
   - list of 9 created files
   - reminder: "This package is a scaffold only. Narrative completion is
     required before ratification."

4. Validate
   - run draft command with a sample intent
   - confirm 9 files created in correct directory
   - confirm structural files contain correct governance defaults
   - confirm narrative files contain explicit draft scaffold markers
   - confirm motion.yaml placeholder sections have "Draft scaffold — pending"
   - confirm existing directory causes a hard error
   - confirm no API calls made
   - confirm no files written outside motion directory
   - confirm stdout includes file list and scaffold-only reminder

## Files touched
- portal/scripts/motion-factory.mjs (EDIT — add draft command)

## Files explicitly not touched
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- portal/scripts/panel-select.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml

## Rollback plan
- Revert the draft command additions in motion-factory.mjs
- Delete any test motion directory created during validation

## Acceptance criteria
- draft command creates 9 files in .nexus/motions/motion-NNNN/
- Structural files are correctly templated from governance config
- Narrative files are placeholder scaffolds with explicit "Draft scaffold"
  markers
- motion.yaml placeholder sections have "Draft scaffold — pending" markers
- Existing directory causes a hard error (no overwrite)
- stdout prints motion ID, path, file list, and scaffold-only reminder
- No API calls
- No writes outside motion directory
- Generated package is structurally complete but narratively incomplete and
  is not expected to be immediately ratifiable

## Done means
- Motion Factory v0 can deterministically scaffold a complete motion package,
- the structural foundation is ready for model-assisted narrative generation,
- and motion-0053 is ratified.
