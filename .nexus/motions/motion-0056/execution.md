# Execution Plan - motion-0056

## Goal
Execute the Motion Factory v0 workflow end-to-end on a real governed motion
and establish placeholder-first as the default operator convention.

## Plan
1. Execute the factory workflow on motion-0056
   - run context to inspect repo state
   - run draft to generate the 9-file scaffold
   - human reviews the generated package
   - run revise with tightening notes if needed
   - human performs final review
   - record each step and real outcome in the proposal proof table

2. Complete the proof record
   - fill in each row of the workflow table in proposal.md with real
     command invocations and outcomes before ratification

3. State the placeholder-first operator convention
   - future motions start with `motion-factory.mjs draft`
   - review and revise before ratification
   - replaces manual 9-file creation
   - convention only, not an enforcement gate

4. Ratify and commit
   - run council:run
   - record vote
   - commit

## Files touched
- .nexus/motions/motion-0056/ (NEW — 9-file motion package)

## Files explicitly not touched
- portal/scripts/motion-factory.mjs (no changes)
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml

## Rollback plan
- Delete .nexus/motions/motion-0056/
- The placeholder-first convention is an operator workflow rule, not a code
  change, so rollback is simply discontinuing the convention.

## Acceptance criteria
- motion-0056 was executed using the factory workflow
- proposal.md contains the completed proof record with real outcomes
- Placeholder-first convention is stated as an operator convention
- No code changes to motion-factory.mjs
- Human review occurred before ratification

## Done means
- Motion Factory v0 is proven end-to-end on a real governed motion,
- placeholder-first is the default operator convention for future motions,
- and motion-0056 is ratified.
