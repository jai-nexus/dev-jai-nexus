# Execution Plan (motion-0017)

## Implementation
- Add `instantiate` command to `portal/scripts/panel-run.mjs` (manifest-gated).
- Ensure `--dry-run` prints the exact plan.
- Ensure idempotency on re-run.

## Evidence
- `pnpm -C portal typecheck` PASS
- `node portal/scripts/panel-run.mjs instantiate --motion motion-0017 --all --dry-run`
- `node portal/scripts/panel-run.mjs instantiate --motion motion-0017 --all`
- Re-run the same command and confirm no changes without `--force`
