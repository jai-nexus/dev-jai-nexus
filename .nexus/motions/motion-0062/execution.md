# Execution Plan - motion-0062

## Goal
Improve discoverability and operator-facing clarity for Motion Factory v0.

## Plan
1. Update usage() in portal/scripts/motion-factory.mjs
   - add Examples section with PowerShell-ready copy-paste commands
   - ensure --provider described consistently for draft/revise/evidence
   - ensure --json listed for both context and status
   - add status vs context distinction to command descriptions
   - verify no behavioral changes

2. Check .nexus/docs/motion-factory-playbook.md for actual CLI drift
   - confirm status command is documented
   - confirm status --json is documented
   - confirm status vs context distinction matches help text
   - confirm all examples are current and PowerShell-ready
   - update only if actual drift found
   - leave untouched if already matching

3. Verify
   - run `node portal/scripts/motion-factory.mjs` (no args) and confirm
     updated help text with examples
   - confirm all copy-paste examples are present and PowerShell-ready
   - confirm provider flag consistency
   - confirm status vs context distinction
   - run `node portal/scripts/motion-factory.mjs status` to confirm
     no behavioral change
   - run `node portal/scripts/motion-factory.mjs draft --no-api --intent "test"`
     to confirm no behavioral change
   - clean up any test artifacts

## Files touched
- portal/scripts/motion-factory.mjs (EDIT — usage text only)
- .nexus/docs/motion-factory-playbook.md (EDIT — only if actual CLI drift found)

## Files explicitly not touched
- portal/scripts/council-run.mjs
- portal/scripts/panel-run.mjs
- .nexus/agent-panels.yaml
- .nexus/model-slots-phase1.yaml
- .nexus/model-slots.yaml
- .nexus/model-routing.yaml
- .nexus/council.config.yaml

## Rollback plan
- Revert usage text changes in motion-factory.mjs
- Revert playbook changes if any were made

## Acceptance criteria
- Help text includes PowerShell-ready copy-paste examples for all five commands
- Provider flag consistent across draft/revise/evidence descriptions
- --json listed for both context and status
- Status vs context distinction explicit
- Playbook matches real CLI surface (updated only if drift found)
- No behavioral changes: no routing, no provider semantics, no file scopes,
  no write behavior, no atomicity changes

## Done means
- Motion Factory v0 operator-facing text is polished and discoverable,
- help text and playbook match the exact current CLI surface,
- and motion-0062 is ratified.
