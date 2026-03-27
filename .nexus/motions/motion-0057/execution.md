# Execution Plan - motion-0057

## Goal
Extend portal/scripts/motion-factory.mjs with an evidence command for
inserting human-provided proof evidence into proof-motion narrative files.

## Plan
1. Add evidence command to motion-factory.mjs
   - require --motion and --evidence-file
   - accept optional --notes and --files
   - validate target motion directory exists
   - validate evidence file exists and is non-empty
   - validate requested files are in the allowed set
   - read OPENAI_API_KEY from process.env, fail if missing

2. Read inputs
   - read evidence file as raw text
   - read existing targeted narrative files from the motion directory
   - read motion.yaml for original intent
   - gather repo context

3. Construct the evidence insertion prompt
   - include: existing file content, raw evidence payload, operator notes,
     original intent, context
   - instruct the model to organize and place provided evidence into the
     appropriate narrative sections
   - hard-ban: inventing PASS/FAIL claims, proof results, vote entries,
     vote rationales, ratification claims beyond what the evidence shows
   - instruct the model to preserve section structure

4. Handle API response
   - parse response into targeted files
   - validate content returned for all targeted files (all-or-nothing)
   - on success: overwrite targeted files atomically
   - on failure or incomplete response: leave existing files untouched,
     print warning

5. Print stdout summary
   - target motion ID
   - evidence file path
   - files updated
   - mode (evidence-fed, model-organized)
   - human-review reminder

6. Validate
   - run evidence command with a real evidence file on an existing draft
   - confirm default files (proposal.md, execution.md) are updated
   - confirm updated content references the provided evidence
   - confirm no invented PASS/FAIL claims beyond source material
   - run with --files to confirm narrow selection
   - run with a disallowed file and confirm clear error
   - run without --evidence-file and confirm clear error
   - run with empty evidence file and confirm clear error
   - run targeting nonexistent motion and confirm clear error
   - confirm structural files are not modified
   - confirm motion.yaml is not modified

## Files touched
- portal/scripts/motion-factory.mjs (EDIT — add evidence command)

## Files explicitly not touched
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- portal/scripts/panel-select.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml
- portal/.env (read-only)

## Rollback plan
- Revert the evidence command additions in motion-factory.mjs
- Existing draft files are preserved if API call fails

## Acceptance criteria
- evidence command reads real evidence and updates targeted narrative files
- Default scope: proposal.md, execution.md
- --files narrows within allowed set
- Disallowed files produce clear error
- motion.yaml never modified by evidence command
- Structural files never modified
- Missing inputs produce clear errors
- Empty evidence file produces clear error
- API failure leaves existing files untouched
- No invented evidence claims
- Stdout prints file list and human-review reminder

## Done means
- Motion Factory v0 has a safe evidence insertion path for proof motions,
- the remaining manual proof-authoring overhead is reduced,
- and motion-0057 is ratified.
