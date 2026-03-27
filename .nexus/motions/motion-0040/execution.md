# Execution Plan - motion-0040

## Goal
Prove the first real Claude usage workflow for dev-jai-nexus and capture what the setup stack does and does not yet solve.

## Plan
1. Generate current Claude bootstrap pack
   - run `pnpm claude:bootstrap`

2. Start one real Claude session
   - use the validated setup workflow from motion-0039
   - follow the governed upload/read order

3. Choose one bounded real task
   - keep the task small enough to evaluate in one session
   - keep it meaningful enough to test the setup

4. Record actual setup inputs
   - note which artifacts were used
   - note whether the generated bootstrap pack was sufficient
   - note any manual explanation still required

5. Record session outcome
   - what task was attempted
   - what was completed
   - where friction remained
   - what was missing or redundant

6. Produce validation artifacts
   - a first live usage report
   - a passalong artifact for repeating the process later

7. Confirm repo health
   - if code changed, run relevant local validation such as:
     - `pnpm -C portal typecheck`

## Suggested governed artifact set
- `.nexus/claude/first-live-usage-report.md`
- `.nexus/claude/first-live-passalong.md`

## Suggested proof
- one real Claude session is started,
- the generated bootstrap pack is used,
- one bounded task is attempted,
- validation artifacts are written,
- lessons are concrete and reusable.

## Suggested acceptance criteria
- real Claude session was attempted
- setup inputs are recorded
- one bounded task is recorded
- missing context is recorded honestly
- passalong artifact exists
- validation artifact exists
- resulting lessons are specific enough to guide future motion work

## Done means
- the first real Claude setup proof exists,
- the repo has evidence about actual setup quality,
- motion-0040 is ratified.
