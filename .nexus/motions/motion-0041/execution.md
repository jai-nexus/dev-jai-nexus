# Execution Plan - motion-0041

## Goal
Stress-test the Claude operating stack on one real code-heavy bounded task in dev-jai-nexus and capture what the current setup does and does not yet solve for implementation work.

## Plan
1. Generate current Claude bootstrap pack
   - run `pnpm claude:bootstrap`

2. Start one real Claude session
   - use the validated setup workflow from motion-0039
   - use the current bootstrap pack from motion-0038
   - apply lessons from motion-0040

3. Choose one bounded code-heavy task
   - keep it small enough for one session
   - keep it meaningful enough to require actual code context
   - ensure it has a clear validation path

4. Record actual setup inputs
   - note which governance/substrate/Claude artifacts were used
   - note which code files were additionally required
   - note what still required manual explanation

5. Attempt the task
   - keep the active motion package central
   - load only the relevant code surfaces
   - evaluate whether motion-local generated context was sufficient

6. Record session outcome
   - what task was attempted
   - what code surfaces were needed
   - what was completed
   - what friction remained
   - what should improve next

7. Produce validation artifacts
   - a second live usage report
   - a code-heavy session passalong artifact

8. Confirm repo health
   - if code changed, run relevant validation such as:
     - `pnpm -C portal typecheck`

## Suggested governed artifact set
- `.nexus/claude/second-live-usage-report.md`
- `.nexus/claude/second-live-passalong.md`

## Suggested proof
- one real code-heavy Claude session is attempted
- the generated bootstrap pack is used
- one bounded code task is attempted
- setup inputs and missing context are recorded
- passalong artifact exists
- resulting lessons are concrete and reusable

## Suggested acceptance criteria
- real code-heavy Claude session was attempted
- setup inputs are recorded
- relevant code surfaces are recorded
- missing context is recorded honestly
- second live usage report exists
- second live passalong exists
- resulting lessons are specific enough to guide future code-heavy Claude work

## Done means
- the Claude setup stack has a real code-heavy live proof,
- the repo has stronger evidence about implementation-stage setup quality,
- motion-0041 is ratified.
