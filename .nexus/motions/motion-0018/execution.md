# Execution Plan (motion-0018)

## Steps
1. Apply updates to:
   - `.nexus/model-slots.yaml`
   - `.nexus/agent-panels.yaml`
2. Dry-run bulk instantiation:
   - `node portal/scripts/panel-run.mjs instantiate --motion motion-0018 --all --dry-run`
3. Execute instantiation:
   - `node portal/scripts/panel-run.mjs instantiate --motion motion-0018 --all`
4. Run gates:
   - `pnpm -C portal typecheck`
   - `pnpm council:run motion-0018`

## Evidence expectations
- Dry-run lists 5 panels deterministically
- Instantiation scaffolds 5 panel folders under `.nexus/motions/motion-0018/panels/*`
- typecheck PASS
