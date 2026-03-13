# Execution Plan - motion-0037

## Goal
Generate a compact, deterministic Claude bootstrap pack that turns the new Claude-facing operating layer into a reusable machine-compiled handoff.

## Plan
1. Add generator script
   - create a new script for Claude bootstrap generation.

2. Define generated output contract
   - emit a dated Claude bootstrap document
   - emit a manifest sidecar

3. Compile source surfaces
   - repo-root `CLAUDE.md`
   - `.nexus/claude/project-context-pack.md`
   - `.nexus/claude/bootstrap-set.yaml`
   - `.nexus/claude/operating-workflow.md`
   - selected substrate references
   - latest generated repo context references

4. Keep output compact
   - summarize where possible
   - avoid raw whole-file dumping
   - preserve clear sections and stable ordering

5. Add invocation path
   - support a simple local command for generation
   - optional package script if useful

6. Prove stability
   - rerun without meaningful repo changes
   - confirm stable output ordering and reusable artifact shape

## Suggested implementation surfaces
- `portal/scripts/generate-claude-bootstrap.mjs`
- optional package script in `package.json` or `portal/package.json`

## Suggested output location
- `surfaces/claude/`

## Suggested outputs
- `YYYY-MM-DD_claude-bootstrap.md`
- `YYYY-MM-DD_claude-bootstrap_manifest.json`

## Suggested smoke proof
- run the generator locally
- confirm both files are created
- inspect the markdown pack for clarity and compactness
- rerun for stability
- confirm the pack can be used as a single Claude setup handoff

## Done means
- Claude bootstrap generation exists,
- the pack is practical for immediate reuse,
- motion-0037 is ratified.
