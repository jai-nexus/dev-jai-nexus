# Execution Plan (motion-0008)

## Intended changes
1) Add DispatchConfig v0 schema doc:
   - portal/config/dispatch/README.md

2) Seed dispatch config for dev-jai-nexus:
   - portal/config/dispatch/dev-jai-nexus.yaml

## Acceptance criteria
- Dispatch schema doc exists.
- dev-jai-nexus dispatch config exists.
- No application code touched.

## Rollback plan
- Delete portal/config/dispatch/ if rejected.
