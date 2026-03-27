# Execution Plan - motion-0055

## Goal
Extend portal/scripts/motion-factory.mjs with a revise command that updates
selected narrative files in an existing motion draft from human notes.

## Plan
1. Add revise command to motion-factory.mjs
   - require --motion and --notes
   - validate target motion directory exists
   - read OPENAI_API_KEY from process.env, fail if missing
   - determine default or explicit file scope
   - validate all requested files are in the allowed set

2. Read existing draft content
   - read the targeted narrative files from the motion directory
   - read motion.yaml for original intent (title field)
   - gather repo context (reuses existing context logic)

3. Construct the revision prompt
   - include: existing file content, context payload, revision notes,
     original intent
   - instruct the model to revise the specified files incorporating the
     human notes
   - hard-ban: evidence tables, PASS/FAIL claims, vote entries, vote
     rationales, ratification claims
   - instruct the model to preserve section structure and repo conventions

4. Handle API response
   - on success: overwrite targeted narrative files with revised content
   - on failure: leave existing files untouched, print warning

5. For motion.yaml revision (opt-in only)
   - parse existing motion.yaml
   - replace only narrative fields from model output
   - preserve structural fields (motion_id, title, status, created_at,
     owner, target, vote config)
   - rewrite the file with merged content

6. Print stdout summary
   - target motion ID
   - files revised
   - note that content was model-generated
   - reminder that human review is required before ratification

7. Validate
   - run revise with --motion and --notes on an existing draft
   - confirm default files (proposal.md, challenge.md, execution.md) are
     updated
   - run revise with --files challenge.md to confirm narrow selection
   - run revise with --files motion.yaml to confirm narrative-only revision
   - run revise with a disallowed file and confirm clear error
   - run revise without --motion and confirm clear error
   - run revise without --notes and confirm clear error
   - run revise targeting a nonexistent motion and confirm clear error
   - confirm structural files are not modified in any case
   - inspect revised content for absence of evidence tables and vote entries

## Files touched
- portal/scripts/motion-factory.mjs (EDIT — add revise command)

## Files explicitly not touched
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- portal/scripts/panel-select.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml
- portal/.env (read-only, not modified)

## Rollback plan
- Revert the revise command additions in motion-factory.mjs
- Existing draft files are preserved if API call fails

## Acceptance criteria
- revise with --motion and --notes updates default narrative files
- revise with --files narrows to selected files
- revise with disallowed file produces clear error
- revise with --files motion.yaml preserves structural fields
- Missing --motion, --notes, or target directory produce clear errors
- Missing OPENAI_API_KEY produces clear error
- API failure leaves existing files untouched
- Structural governance files are never modified
- No evidence tables, PASS/FAIL claims, vote entries, or ratification claims
- stdout prints revised files and human-review reminder

## Done means
- Motion Factory v0 has a working revise command,
- the full draft-review-revise cycle is supported by the factory,
- and motion-0055 is ratified.
