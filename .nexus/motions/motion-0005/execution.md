# Execution Plan (motion-0005)

## Intended changes
- Implement Coverage v0 (CRL-0..3) as computed state in dev-jai-nexus.
- Add RepoCard v0 + Health Snapshot v0 artifact generation and storage.
- Add Dispatch v0: motion → repo work packets → staged edits (SyncRun) → review/apply.
- Ensure trace events + living state updates occur on completion.

## Files touched (expected)
- portal/src/app/operator/registry/coverage/** (coverage UI)
- portal/src/lib/** (registry + coverage computation helpers)
- portal/scripts/** (repo card / health snapshot generators)
- config/** or portal/config/** (only if required; respect lock policy)

## Rollback plan
- Feature flag coverage/dispatch behind a single config toggle.
- Keep existing registry pages read-only and additive.
