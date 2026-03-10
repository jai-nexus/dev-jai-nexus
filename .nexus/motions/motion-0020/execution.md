# Execution Plan (motion-0020)

## Steps
1. Update `.nexus/model-slots.yaml` to OpenAI-only assignments.
2. Run:
   - `pnpm -C portal typecheck`
3. Bulk instantiate into this motion (proof it works with new slots):
   - `node portal/scripts/panel-run.mjs instantiate --motion motion-0020 --all --dry-run`
   - `node portal/scripts/panel-run.mjs instantiate --motion motion-0020 --all`
4. Run:
   - `pnpm council:run motion-0020`

## Evidence expectations
- typecheck PASS
- dry-run lists 5 panels deterministically
- instantiate scaffolds 5 panel folders under `.nexus/motions/motion-0020/panels/*`
- council-run writes verify/decision artifacts and reaches RATIFIED after vote
