# Execution Plan - motion-0043

## Goal
Prove the first real Claude code-edit session that uses both the generated bootstrap pack and the generated task-local code surface pack.

## Plan
1. Generate current setup artifacts
   - run `pnpm claude:bootstrap`
   - run `pnpm code:pack -- --motion motion-0043`

2. Start one real Claude session
   - use the validated setup workflow from motion-0039
   - use the live-usage lessons from motions 0040 and 0041
   - include the task-local code pack from motion-0042

3. Choose one bounded code-edit task
   - keep it small enough for one session
   - keep it meaningful enough to require real file context
   - ensure a clear local validation step exists

4. Record actual setup inputs
   - note which canonical artifacts were used
   - note which generated artifacts were used
   - note which source files were actually needed
   - note what still required manual explanation

5. Attempt the implementation task
   - keep the active motion package central
   - use the task-local code pack as the file-context layer
   - preserve canonical source-file truth

6. Run validation
   - run the relevant local validation step
   - record the command and result

7. Produce validation artifacts
   - a third live usage report
   - a third live passalong artifact

## Suggested governed artifact set
- `.nexus/claude/third-live-usage-report.md`
- `.nexus/claude/third-live-passalong.md`

## Suggested proof
- one real bounded code-edit task is attempted
- bootstrap pack is used
- task-local code pack is used
- local validation is run
- the report records concrete operational lessons
- the passalong artifact helps future repetition

## Suggested acceptance criteria
- real code-edit session was attempted
- setup inputs are recorded
- task-local code pack was actually used
- relevant source files are recorded
- validation step is recorded
- third live usage report exists
- third live passalong exists
- lessons are specific enough to guide future code-edit Claude sessions

## Done means
- the full current Claude stack has a real code-edit proof,
- dev-jai-nexus has stronger evidence about implementation-stage setup quality,
- motion-0043 is ratified.
