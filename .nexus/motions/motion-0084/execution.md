# Execution: Project Bootstrap and Agency Planning v0

**Motion:** motion-0084
**Date:** 2026-03-30

## Implementation surface

Planning artifacts only. No application code. No runtime changes.

## Artifacts committed in this planning branch

### motion-0084 package (this motion)
- `.nexus/motions/motion-0084/motion.yaml`
- `.nexus/motions/motion-0084/proposal.md`
- `.nexus/motions/motion-0084/challenge.md`
- `.nexus/motions/motion-0084/execution.md` (this file)
- `.nexus/motions/motion-0084/decision.yaml`
- `.nexus/motions/motion-0084/decision.md`

### WS-A planning schema (committed with this motion)
- `.nexus/planning/project-intake.schema.yaml` v0.1

### WS-B planning schema (committed with this motion)
- `.nexus/planning/agent-demand-matrix.schema.yaml` v0.1
- `.nexus/planning/offbook-ai-intake-example.yaml` (OffBook.ai example object)

## Deferred to child motions

| Workstream | Artifact | Motion |
|---|---|---|
| WS-C | topology-plan.schema.yaml | motion-0085 (TBD) |
| WS-C | wave-model.schema.yaml | motion-0085 (TBD) |
| WS-D | bootstrap-manifest.schema.yaml | motion-0086 (TBD) |
| WS-D | generator script spec | motion-0086 (TBD) |
| WS-E | coverage-declaration.schema.yaml | motion-0087 (TBD) |
| WS-E | dispatch bridge spec | motion-0087 (TBD) |

## Validation

No `pnpm -C portal typecheck` needed — no app code touched.

Inspection: confirm `.nexus/planning/` directory created with schemas.

## Branch

`plan/q3-bootstrap-agency-planning`
