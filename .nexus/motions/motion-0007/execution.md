# Execution Plan (motion-0007)

## Intended changes
1) Add endpoint:
   - portal/src/app/api/internal/registry/coverage/route.ts

2) Add helper(s):
   - portal/src/lib/registryCoverage.ts (or similar)
   - Reads portal/config/repos.yaml and checks presence of:
     - portal/config/repo-cards/<repo>.yaml
     - portal/config/dispatch/<repo>.yaml (if present)
   - Computes CRL counts and wilderness list.

## Acceptance criteria
- Hitting the endpoint returns JSON with:
  total, crl0, crl1, crl2, crl3, wilderness[]
- No directory scanning outside explicit config paths.
- `pnpm -C portal typecheck` passes (or your equivalent typecheck command).

## Evidence
- Paste the typecheck command output and one example API response JSON.

## Rollback plan
- Remove the endpoint file and helper if rejected.
