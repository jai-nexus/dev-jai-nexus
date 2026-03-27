# Execution Plan (motion-0019)

## Commands
- `pnpm -C portal typecheck`
- `node portal/scripts/panel-run.mjs instantiate --motion motion-0019 --all --dry-run`
- `node portal/scripts/panel-run.mjs instantiate --motion motion-0019 --all`
- `node portal/scripts/panel-run.mjs instantiate --motion motion-0019 --all` (idempotency check)
- `pnpm council:run motion-0019`

## Expected
- typecheck PASS
- dry-run prints deterministic list of 5 panels
- instantiate scaffolds 5 panel directories under `.nexus/motions/motion-0019/panels/*`
- second instantiate run reports scaffolds complete with no overwrites (create-if-missing behavior)
- council-run ratifies motion and writes decision/verify artifacts
