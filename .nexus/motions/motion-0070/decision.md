# Decision - motion-0070

## Status
DRAFT

## Summary
Motion `motion-0070` proposes bounded council policy seam extraction
for `dev-jai-nexus`.

This slice adds `councilPolicyKernel.mjs` exporting
`deriveCouncilPolicyOutcome` — a pure function that derives policy
outcome fields from pre-computed gate failure lists and risk values.
council-run.mjs is refactored to call the kernel instead of computing
these fields inline.

The policy.yaml output shape is unchanged. Gate list construction,
file reads, template rendering, and all orchestration remain local
to council-run.mjs.

## Required gates
- validate_motion
- validate_agency
- typecheck

## Notes
Pending vote and validation.
