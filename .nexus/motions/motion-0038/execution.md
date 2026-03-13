# Execution Plan - motion-0038

## Goal
Polish the Claude bootstrap generator into a cleaner and easier-to-run repo operating surface.

## Plan
1. Improve section extraction
   - adjust extraction so generated summaries do not surface awkward nested headings
   - preserve compact readable output

2. Tighten bootstrap markdown layout
   - improve section readability without bloating the output
   - keep ordering stable

3. Add package script
   - add a simple repo command for generating the Claude bootstrap pack

4. Validate determinism
   - rerun the bootstrap generator without meaningful repo changes
   - confirm markdown stability remains intact
   - confirm manifest remains valid

5. Perform practical setup validation
   - treat the generated pack as the primary handoff for Claude setup
   - confirm it is readable and sufficient for real reuse

## Suggested touched surfaces
- `portal/scripts/generate-claude-bootstrap.mjs`
- `package.json`

## Suggested command
- `pnpm claude:bootstrap`

## Suggested proof
- run package script successfully
- inspect polished bootstrap markdown
- inspect manifest
- rerun and confirm stable markdown hash
- confirm the pack reads cleanly enough for direct reuse

## Suggested acceptance criteria
- duplicated section heading issue is resolved or materially improved
- package script exists and works
- markdown bootstrap output remains deterministic
- manifest remains complete and valid
- polished output is practically usable as a setup handoff

## Done means
- Claude bootstrap generation is cleaner,
- invocation is easier,
- practical setup reuse is validated,
- motion-0038 is ratified.
