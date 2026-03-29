# Challenge (motion-0070)

## Risks
- Adding a third council kernel introduces import/dependency surface.
  Each new helper is one more file that can diverge from the runner.
- The derivation is currently 14 lines inline. A kernel adds indirection
  for a small gain.
- If the kernel signature changes later, council-run.mjs must update its
  call site.

## Objections
- The pattern is already established: councilVoteKernel.mjs and
  councilDecisionKernel.mjs use the same approach. Consistency is a
  net gain.
- 14 lines of pure derivation is a natural extraction boundary. The
  function has no side effects and is testable in isolation.
- The kernel signature is stable: it mirrors the existing inline
  variable names exactly. Divergence risk is low.

## Mitigations
- The kernel is pure (no file I/O, no imports). Syntax check via
  `node --check` is sufficient to validate it in isolation.
- The call site in council-run.mjs is a direct 1:1 replacement.
  The policy.yaml output shape is unchanged.
- Validation gate: `node --check` on both files + `pnpm -C portal typecheck`.

## Required gates
- validate_motion
- validate_agency
- typecheck

## Risk score
risk_score: 0.05
