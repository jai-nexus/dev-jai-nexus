# Execution Plan - motion-0066

## Goal
Emit candidate.motion.json as a local, repo-tracked prep-layer artifact
during Motion Factory draft flow, atomic with formal draft creation.

## Plan
1. Add candidateId generation to draftCommand
   - generate ID from timestamp + intent slug
   - format: cm-YYYYMMDD-HHmmss-<slug>
   - slug: lowercase, hyphens, truncated to ~40 chars

2. Add candidateId collision check
   - if .nexus/candidates/<candidateId>.json already exists, fail with
     clear error before any writes
   - same fail-before-write posture as motion directory collision

3. Add candidate.motion.json emission to draftCommand (apply mode)
   - create .nexus/candidates/ directory if it does not exist
   - write .nexus/candidates/<candidateId>.json
   - canonical upstream fields: candidateId, title, status, source, createdAt
   - local emission metadata: version, targetMotionId, provider, noApi
   - emit BEFORE formal motion directory creation
   - if candidate emission fails, abort draft — do not create motion directory

4. Add cleanup on formal draft failure
   - if formal motion generation fails after candidate was written,
     delete the candidate file
   - ensures atomicity: both exist or neither

5. Add candidate identity to draft apply output
   - print candidateId and candidate artifact path in stdout

6. Add provisional candidate identity to draft preview output
   - print provisional candidateId in preview header
   - explicitly note no candidate artifact written

7. Validate
   - draft apply: confirm candidate.motion.json emitted in .nexus/candidates/
   - draft apply: confirm formal 9-file package still generated
   - draft apply: confirm both artifacts exist after success
   - draft apply: confirm canonical field names match upstream contract
   - draft preview: confirm provisional candidateId shown, no files written
   - draft --no-api: confirm candidate emitted with provider=placeholder
   - draft --provider anthropic: confirm candidate emitted with
     provider=anthropic
   - candidateId collision: confirm clear error, no files written
   - revise: confirm no changes
   - evidence: confirm no changes
   - status: confirm no changes
   - clean up test artifacts

## Repo-tracking note
`.nexus/candidates/` and its contents are repo-tracked. Emitted candidate
artifacts should be committed to git alongside their corresponding formal
motion packages.

## Files changed
- portal/scripts/motion-factory.mjs (EDIT — draftCommand only)

## Files created at runtime
- .nexus/candidates/<candidateId>.json (emitted by draft apply, repo-tracked)

## Files explicitly not changed
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- portal/scripts/panel-select.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/council.config.yaml
- .nexus/docs/motion-factory-playbook.md
- .vscode/ (not in scope)

## Rollback plan
- Revert draftCommand changes in motion-factory.mjs
- Delete .nexus/candidates/ if created during testing

## Acceptance criteria
- candidate.motion.json emitted during draft apply
- candidate stored under .nexus/candidates/, repo-tracked
- canonical upstream field names preserved exactly
- local emission metadata fields clearly distinguished
- candidate emission atomic with draft apply (both or neither)
- candidateId collision produces clear pre-write error
- candidateId and path shown in apply output
- provisional candidateId shown in preview output
- no candidate file written in preview mode
- formal 9-file package unchanged
- other commands unchanged
- --no-api draft emits candidate with provider=placeholder

## Done means
- Motion Factory draft flow emits a local candidate.motion prep artifact,
- emission is atomic with formal draft creation,
- prep state is explicit, durable, and repo-tracked with its own identity,
- and formal motion generation is unaffected.
