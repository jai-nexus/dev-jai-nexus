# Execution Plan - motion-0067

## Goal
Add candidate artifact discovery to Motion Factory status and context
commands.

## Plan
1. Add enumerateCandidates(repoRoot) helper
   - read .nexus/candidates/*.json
   - parse each file as JSON
   - extract: candidateId, intent, status, createdAt, targetMotionId
   - skip malformed files: increment skipped_malformed counter, warn to stderr
   - sort by createdAt descending
   - return { candidates: [...], skipped_malformed: number }

2. Wire into status command
   - call enumerateCandidates
   - add Candidates section to human-readable output:
     directory, count, skipped_malformed, most recent
   - add candidates object to --json output:
     directory, count, skipped_malformed, most_recent (single object, not unbounded list)

3. Wire into context command
   - call enumerateCandidates
   - add Recent candidates section to human-readable output
     (windowed to RECENT_MOTION_WINDOW, same as recent motions)
   - add recent_candidates array to --json output (windowed)

4. Handle edge cases
   - .nexus/candidates/ does not exist → count 0, skipped_malformed 0, no error
   - empty directory → count 0, skipped_malformed 0
   - malformed JSON file → skip, increment skipped_malformed, warn to stderr, continue
   - file missing required fields (candidateId or intent) → treat as malformed

5. Validate
   - status with existing candidates: confirm count, most recent shown
   - status with no candidates: confirm count 0, no error
   - status --json: confirm candidates object present, no unbounded "all" list
   - context with existing candidates: confirm recent candidates shown
   - context --json: confirm recent_candidates array present, windowed
   - malformed candidate file: confirm skip with warning, skipped_malformed count
   - draft, revise, evidence: confirm unchanged
   - clean up test artifacts

## Files changed
- portal/scripts/motion-factory.mjs (EDIT — add enumerateCandidates,
  wire into statusCommand/buildStatusSnapshot and contextCommand/buildContext)

## Files explicitly not changed
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/council.config.yaml
- .nexus/docs/motion-factory-playbook.md
- .nexus/candidates/*.json (read-only, not modified)
- .vscode/ (not in scope)

## Rollback plan
- Revert enumerateCandidates and wiring changes in motion-factory.mjs
- Status and context revert to pre-discovery output

## Acceptance criteria
- status reports candidate count, skipped_malformed, and most recent candidate
- context reports recent candidates alongside recent motions
- --json includes candidate data in both commands
- status --json does not include unbounded full candidate list
- discovery reads only already-emitted fields (candidateId, intent, status, createdAt, targetMotionId)
- no writes during discovery
- graceful degradation on missing directory or malformed files
- skipped_malformed count reported in output and --json
- draft, revise, evidence commands unchanged

## Done means
- Motion Factory status and context commands discover and report
  candidate prep artifacts,
- the emission/discovery loop from motion-0066 is complete,
- and candidate storage is validated as a usable read surface.
