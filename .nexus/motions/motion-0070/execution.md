# Execution Plan - motion-0070

## Goal
Extract pure policy outcome derivation from council-run.mjs into
councilPolicyKernel.mjs. The policy.yaml output shape and all
orchestration behavior are unchanged.

## Plan

1. Create `portal/src/lib/council/councilPolicyKernel.mjs`
   - Export `deriveCouncilPolicyOutcome({ failedRequiredGates, failedOptionalGates, riskScore, maxRiskScore })`
   - Implement: required_ok, eligible_to_vote, low_risk, recommended_vote,
     blocking_reasons, warnings
   - No imports, no file I/O

2. Refactor `portal/scripts/council-run.mjs`
   - Add import of `deriveCouncilPolicyOutcome` from councilPolicyKernel.mjs
   - Replace inline Stage 5 policy derivation with a call to
     `deriveCouncilPolicyOutcome({ failedRequiredGates: failed_required_gates, failedOptionalGates: failed_optional_gates, riskScore, maxRiskScore })`
   - Destructure returned fields: `{ required_ok, eligible_to_vote, low_risk, recommended_vote, blocking_reasons, warnings }`
   - Keep gate list construction, scoreboard read, template render, and
     write call unchanged

## Files touched
- `portal/src/lib/council/councilPolicyKernel.mjs` (new)
- `portal/scripts/council-run.mjs` (import + call site refactor)

## Rollback plan
- Revert the import line and restore the 14 inline lines in council-run.mjs
- Delete councilPolicyKernel.mjs
