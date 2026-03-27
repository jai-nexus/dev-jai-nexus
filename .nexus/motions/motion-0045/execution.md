# Execution Plan - motion-0045

## Goal
Add a deterministic full-fidelity motion snapshot generator that exports all governed motion artifacts in a branch-aware, reusable format.

## Plan
1. Add the generator script
   - create `portal/scripts/snapshot-motion-full.mjs`

2. Implement repo-root and motion discovery
   - discover repo root via `.nexus/`
   - enumerate `motion-*` directories in deterministic numeric order

3. Implement full file export behavior
   - export full contents for standard motion files when present
   - recurse deterministically into nested directories such as `panels/**` and `evidence/**`

4. Add explicit status markers
   - use `[missing]` for expected-but-absent files
   - use `[empty]` for truly empty files
   - use a binary marker if non-text content is encountered

5. Add branch-aware header metadata
   - include repo
   - include branch
   - include head commit
   - include generated timestamp
   - include motion count / range
   - include generator path

6. Emit manifest sidecar
   - write a dated json manifest beside the snapshot
   - include per-motion metadata where practical

7. Add package script
   - add a package command for repeated invocation

8. Validate output quality
   - confirm full content exists for later motions
   - confirm nested artifacts are included
   - confirm deterministic reruns aside from timestamp/header fields

## Suggested script path
- `portal/scripts/snapshot-motion-full.mjs`

## Suggested package script
- `snapshot:motions`

## Suggested output contract
Emit:
- `surfaces/chat-context/YYYY-MM-DD_motion-snapshot_full.txt`
- `surfaces/chat-context/YYYY-MM-DD_motion-snapshot_full_manifest.json`

## Suggested proof
- run the generator on the current branch
- verify latest motion content is full, not filename-only
- verify nested artifacts are included
- verify header includes branch and head commit
- verify rerun stability

## Suggested acceptance criteria
- full snapshot artifact is emitted
- manifest sidecar is emitted
- latest motion appears with full content
- nested artifacts are included deterministically
- `[missing]` and `[empty]` are handled distinctly
- package script exists
- output is stable enough for repeated use and diffing

## Done means
- dev-jai-nexus has a true full-fidelity motion export path,
- later motion history no longer degrades in portability artifacts,
- motion-0045 is ratified.
