# Execution Plan - motion-0068

## Goal
Add a promote command to Motion Factory that creates a formal draft from
an existing candidate artifact with explicit lineage.

## Plan
1. Add promoteCommand function
   - read candidate artifact from .nexus/candidates/<candidateId>.json
   - validate: exists, parseable, has intent, status is emitted
   - extract intent from candidate
   - call existing draft pipeline (buildContext, narrative generation,
     9-file package assembly) but skip candidate emission
   - write formal motion directory and 9 files
   - write promotion.json in formal motion directory
   - update candidate artifact: status → promoted, targetMotionId → motionId
   - if candidate update fails after promotion.json exists, surface
     reconciliation warning (promotion is still considered complete)

2. Add preview support for promote
   - same pipeline, print proposed output including promotion.json,
     write nothing, update nothing

3. Wire promote into main()
   - parse --candidate flag
   - pass --no-api, --provider, --preview as with draft

4. Update usage() to document promote command

5. Update AVAILABLE_COMMANDS to include "promote"

6. Validate
   - promote with valid emitted candidate: confirm formal draft created,
     promotion.json present, candidate status updated
   - promote --preview: confirm proposed output shown, nothing written
   - promote --no-api: confirm placeholder draft from candidate
   - promote with missing candidate: confirm clear error, no writes
   - promote with malformed candidate: confirm clear error, no writes
   - promote with already-promoted candidate: confirm clear error, no writes
   - draft: confirm still emits its own candidate (unchanged)
   - status: confirm candidate shows as promoted after promotion
   - status: confirm discovered candidate count is correct
   - revise/evidence: confirm unchanged
   - clean up test artifacts

## Source of truth rule
- promotion.json is the durable source of truth for completed promotion
- candidate write-back is intended but may fail after promotion.json exists
- if candidate write-back fails, promotion is complete and reconciliation
  warning is surfaced

## Files changed
- portal/scripts/motion-factory.mjs (EDIT — add promoteCommand, wire
  into main, update usage, update AVAILABLE_COMMANDS)

## Files explicitly not changed
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/council.config.yaml
- .nexus/docs/motion-factory-playbook.md
- .vscode/ (not in scope)

## Rollback plan
- Revert promoteCommand and wiring in motion-factory.mjs
- Remove any test promotion.json files
- Revert any candidate status updates from testing

## Acceptance criteria
- promote creates a formal draft from a candidate artifact
- promotion.json records durable lineage in the formal motion directory
- promotion.json is the source of truth for completed promotion
- candidate artifact write-back to status: promoted + targetMotionId
  succeeds in the normal case
- if candidate write-back fails after promotion.json is written,
  reconciliation warning is surfaced and promotion is not rolled back
- promote skips candidate emission (no duplicate candidate)
- promote --preview shows output without writing
- promote rejects missing, malformed, or already-promoted candidates
- draft, revise, evidence, context, status unchanged
- promote supports --no-api and --provider

## Done means
- Motion Factory has a bounded promotion path from candidate to formal draft,
- durable lineage between candidate and formal motion is recorded via
  promotion.json,
- the emit → discover → promote loop is complete,
- and formal motion generation through promotion follows the existing
  draft pipeline.
