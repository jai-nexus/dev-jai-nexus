# Execution Plan - motion-0042

## Goal
Create a bounded task-local code surface pack generator that reduces manual file selection for code-heavy Claude sessions.

## Plan
1. Add generator script
   - create a script that generates a dated task-local code surface pack.

2. Define selection inputs
   - support `--motion motion-XXXX`
   - support repeated `--path path/to/file`
   - optionally include a bounded number of currently modified git paths

3. Add ignore/filter rules
   - exclude build outputs, vendor folders, generated artifacts, and irrelevant heavy paths

4. Add bounded excerpt logic
   - emit canonical path headings
   - emit only bounded excerpts per file
   - preserve stable ordering

5. Emit manifest sidecar
   - record generation inputs
   - record selected files
   - record output files

6. Add invocation path
   - support direct node invocation
   - optionally add a package script for repeatable use

7. Prove practical usefulness
   - generate a real task-local code pack
   - confirm it is useful for a code-heavy Claude setup flow
   - rerun to confirm stable markdown/text output

## Suggested implementation surfaces
- `portal/scripts/generate-task-code-pack.mjs`
- optional package script in `package.json`

## Suggested output location
- `surfaces/code-context/`

## Suggested outputs
- `YYYY-MM-DD_task-code-pack.txt`
- `YYYY-MM-DD_task-code-pack_manifest.json`

## Suggested smoke proof
- run the generator for `motion-0042`
- confirm both files are created
- inspect the pack for useful bounded file excerpts
- rerun for stability
- confirm the pack is suitable for a code-heavy Claude handoff

## Done means
- task-local code surface generation exists,
- code-heavy Claude setup requires less manual file gathering,
- motion-0042 is ratified.
