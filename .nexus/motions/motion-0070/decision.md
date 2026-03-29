# Decision - motion-0070

## Status
RATIFIED

## Summary
Motion `motion-0070` is ratified.

The council policy seam extraction is accepted as a bounded semantic refactor:
- `portal/src/lib/council/councilPolicyKernel.mjs` now exports `deriveCouncilPolicyOutcome(...)`
- `portal/scripts/council-run.mjs` now consumes that helper for Stage 5 policy derivation
- gate list construction, file reads, policy artifact rendering, gate execution, verify/history writes, and broader orchestration remain local to `council-run.mjs`

## Evidence
- `node --check portal/scripts/council-run.mjs` PASS
- `node --check portal/src/lib/council/councilPolicyKernel.mjs` PASS
- `pnpm -C portal typecheck` PASS
- `pnpm council:run motion-0070` completed and wrote policy/verify/decision artifacts

## Notes
This closes the governance lifecycle for the already-merged policy seam implementation.
