# Execution Plan — motion-0033

## Goal
Prove that dev-jai-nexus can generate its own reusable context bundle for multi-chat and multi-model workflows.

## Plan
1. Add motion snapshot generation
   - compile motion history into a dated summary artifact.

2. Add repo capsule generation
   - compile repo purpose, branch/head state, bounded tree, key files, and important commands into a dated artifact.

3. Add active path pack generation
   - compile current motion / touched paths / selected task-local context into a dated artifact.

4. Add bundle orchestration
   - emit all dated artifacts together plus a manifest sidecar.

5. Add ignore/filter logic
   - exclude build paths, vendor noise, generated folders, and irrelevant heavy outputs.

6. Add deterministic ordering
   - sort motions, paths, and sections consistently.

7. Add invocation path
   - provide a simple command for local generation.

## Suggested script surface
- `portal/scripts/generate-motion-snapshot.mjs`
- `portal/scripts/generate-repo-capsule.mjs`
- `portal/scripts/generate-active-path-pack.mjs`
- `portal/scripts/generate-context-bundle.mjs`

## Suggested command
Example:
`node portal/scripts/generate-context-bundle.mjs --motion motion-0032`

## Suggested output contract
Emit:
- `YYYY-MM-DD_motion-snapshots.txt`
- `YYYY-MM-DD_repo-capsule.txt`
- `YYYY-MM-DD_active-path-pack.txt`
- `YYYY-MM-DD_context-bundle_manifest.json`

## Suggested smoke proof
- run the bundle generator on the current branch,
- confirm all dated artifacts are created,
- confirm stable ordering,
- confirm build junk is excluded,
- confirm the motion snapshot includes recently ratified motion-0032,
- confirm the output is compact enough for real chat upload use.

## Done means
- context bundle scripts exist,
- bundle generation works locally,
- emitted artifacts are stable and readable,
- typecheck passes,
- motion-0033 is ratified.
