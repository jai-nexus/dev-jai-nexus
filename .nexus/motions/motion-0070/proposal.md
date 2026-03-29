# Proposal - motion-0070

## Title
bounded council policy seam extraction

## Why this motion exists
PR #26 (`sprint/q2m4-council-kernel-alignment`) extracted the vote
evaluation kernel into `councilVoteKernel.mjs`. PR #27
(`sprint/q2m4-council-decision-seam`) extracted the decision outcome
kernel into `councilDecisionKernel.mjs`. The policy outcome derivation
— the logic that turns gate failure lists and a risk score into
required_ok, eligible_to_vote, low_risk, recommended_vote,
blocking_reasons, and warnings — is still inline in council-run.mjs.
This is the next natural seam.

The derivation is already a pure computation: it takes pre-computed
inputs and returns derived fields with no file I/O or side effects. The
extraction is mechanical and bounded.

## What stays local
- `requiredGateList()` and `optionalGateList()` — gate list construction
- gate scoreboard file read (`safeReadJsonFile(verifyPath, ...)`)
- policy.yaml template rendering and write call
- all orchestration, file I/O, and trace emission

## What moves to the kernel
- `required_ok` derivation from `failedRequiredGates`
- `eligible_to_vote` derivation
- `low_risk` derivation from `riskScore` vs `maxRiskScore`
- `recommended_vote` derivation
- `blocking_reasons` construction
- `warnings` construction

## Kernel signature
```
deriveCouncilPolicyOutcome({
  failedRequiredGates,   // string[]
  failedOptionalGates,   // string[]
  riskScore,             // number
  maxRiskScore,          // number
})
→ { required_ok, eligible_to_vote, low_risk, recommended_vote, blocking_reasons, warnings }
```

## Scope boundary
Only two files change:
- `portal/src/lib/council/councilPolicyKernel.mjs` (new)
- `portal/scripts/council-run.mjs` (import + replace inline derivation)

No other files are touched.
