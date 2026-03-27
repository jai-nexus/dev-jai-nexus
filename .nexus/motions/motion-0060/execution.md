# Execution Plan - motion-0060

## Goal
Create the canonical operator playbook for Motion Factory v0.

## Plan
1. Create .nexus/docs/ directory if it does not exist
2. Create .nexus/docs/motion-factory-playbook.md with the content
   specified in the proposal
3. Verify the playbook covers all six sections:
   - placeholder-first workflow
   - command guide with concrete CLI examples
   - provider guide with default vs optional distinction
   - trust boundaries
   - recommended end-to-end workflow
   - failure handling and operator hygiene
4. Verify the playbook includes concrete copy-pastable CLI examples for:
   - context
   - draft (default provider)
   - draft (--provider anthropic)
   - draft (--no-api)
   - revise (default scope)
   - revise (--files, --provider)
   - evidence (default scope)
   - evidence (--provider)
5. Verify the playbook clearly distinguishes default provider behavior
   from optional provider-selected behavior
6. Verify the playbook is operator-usable, not purely descriptive
7. Verify provenance references to motions 0052–0059 are present
8. Verify no code changes to motion-factory.mjs

## Files touched
- .nexus/docs/motion-factory-playbook.md (NEW)

## Files explicitly not touched
- portal/scripts/motion-factory.mjs
- portal/scripts/council-run.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml

## Rollback plan
- Delete .nexus/docs/motion-factory-playbook.md

## Acceptance criteria
- Playbook exists at .nexus/docs/motion-factory-playbook.md
- All six sections present and practical
- Concrete CLI examples present for all four commands
- Default vs optional provider behavior clearly distinguished
- Provenance references present
- Playbook is operator-usable
- No code changes
- No governance config changes

## Done means
- Motion Factory v0 has a canonical operator playbook with concrete examples,
- the workflow is documented and session-independent,
- and motion-0060 is ratified.
