# Execution Plan (motion-0014)

## Intended changes
- Make agencyConfig loader resolve config/agency.yaml correctly when cwd is portal/ (pnpm -C portal dev).
- Preserve single SoT at repoRoot/config/agency.yaml (do not duplicate into portal/config).

## Files touched
- portal/src/lib/agencyConfig.ts

## Evidence
- pnpm -C portal typecheck PASS
- operator pages load without ENOENT when portal/config/agency.yaml is missing
