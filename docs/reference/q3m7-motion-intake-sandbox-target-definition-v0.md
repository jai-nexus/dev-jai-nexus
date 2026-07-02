# Q3M7 Motion Intake Sandbox Target Definition v0

## 1. Role

Role: JAI::DEV::BUILDER

## 2. Program / batch / wave / lane

- Program: Q3M7Y26 JAI Motion Control Plane Activation v0
- Batch: A
- Wave: A-G
- Lane: A14
- Repo: `dev-jai-nexus`
- Thread: `2026-06-21_dev-jai-nexus`

## 3. Scope

This artifact defines the current sandbox/staging target posture for future A8 motion intake migration consideration.

This is definition/planning only. Sandbox target definition is not migration application. Sandbox target definition is not database mutation. Sandbox target definition is not deployment authorization. Sandbox target definition is not runtime activation. Sandbox target definition is not production migration. Sandbox target definition is not GitHub mutation. Sandbox target definition is not production gate opening. Sandbox target definition is not source-of-truth transfer. Sandbox target definition is not CONTROL_THREAD acceptance.

ZERO GATES GRANTED.

## 4. Reviewed baseline

Reviewed baseline:

- A8 added durable motion intake source persistence with `MotionIntakeRecord`.
- A8 added the source migration at `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql`.
- A8 added server-only persistence helpers and safe blocked preview behavior.
- A8 added the explicit motion intake route.
- A9 recorded persisted motion selection boundaries.
- A10 recorded migration readiness boundaries.
- A11 recorded target-environment identification and recommended `no_target_yet`.
- A12 clarified environment inventory and preserved `no_confirmed_target_environment`.
- A13 defined non-secret environment requirements and readiness vocabulary.

## 5. Files / evidence sources reviewed

| Area | Repo-relative source |
| --- | --- |
| Prisma schema | `portal/prisma/schema.prisma` |
| A8 migration | `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql` |
| Motion intake helper | `portal/src/lib/controlPlane/motionKernel/motion-intake.ts` |
| Server-only persistence helper | `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts` |
| Motion intake route | `portal/src/app/operator/motion-control/motion-intake/route.ts` |
| Operator motion-control page | `portal/src/app/operator/motion-control/page.tsx` |
| Native motion intake composer | `portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx` |
| A9 review | `docs/reference/q3m7-motion-intake-record-review-selection-boundary-v0.md` |
| A10 review | `docs/reference/q3m7-motion-intake-migration-readiness-review-v0.md` |
| A11 review | `docs/reference/q3m7-motion-intake-target-environment-identification-v0.md` |
| A12 review | `docs/reference/q3m7-motion-intake-environment-inventory-clarification-v0.md` |
| A13 plan | `docs/reference/q3m7-motion-intake-environment-definition-plan-v0.md` |
| Safe sandbox/staging evidence search | `docs`, `portal`, `package.json`, `pnpm-lock.yaml` |
| Safe config evidence | `portal/config/dispatch/dev-jai-nexus.yaml`, `portal/config/repo-cards/dev-jai-nexus.yaml`, `portal/docs/operator-v0-overview.md`, `docs/reference/dev-jai-nexus-live-readiness-staging-v0.md` |

`docs/reference/README.md` was not present in this repository state, so no docs/reference index update is required for this lane.

Secret-bearing files were not inspected. `.env`, `.env.*`, private key, and secret-bearing file contents remain out of scope.

## 6. Planning purpose

This plan records whether a concrete sandbox/staging target can currently be defined for future A8 motion intake migration consideration.

The purpose is boundary planning only. It does not define executable schema, parser behavior, route behavior, migration application behavior, provider dispatch, GitHub mutation, production gate behavior, source-of-truth transfer, autonomous execution, runtime activation, database mutation, production telemetry, or deployment authorization.

## 7. Candidate sandbox/staging target definition summary

Outcome: no concrete sandbox/staging target can be defined yet.

Repository evidence supports source-level Prisma/Postgres posture, historical/operator documentation, domain/config references, and readiness/staging language. It does not identify a concrete A8 motion intake migration-capable sandbox or staging target with environment identity, database target, deployed artifact, A8 migration presence in deployed artifact, migration history, backup, rollback, operator access, maintenance expectation, and post-migration verification evidence.

## 8. Concrete target finding or no-concrete-target-yet finding

Outcome B: No concrete target yet.

Findings:

- No concrete sandbox/staging target can be defined yet.
- A11 `no_target_yet` remains preserved.
- A12 environment inventory remains insufficient for target definition.
- A13 requirements exist but are not yet satisfied by a concrete environment.
- Readiness value is `undefined`.
- Sandbox/staging target confirmation cannot be routed yet except as a separate evidence-gathering route.
- Migration application authorization cannot be routed yet.
- Production remains excluded.

This artifact does not invent environment details. It does not infer a database target from secret-bearing files. It does not infer production/staging readiness from deployment names alone.

## 9. A13 readiness vocabulary assignment

Assigned readiness value: `undefined`.

Reason: no concrete sandbox/staging target environment definition exists from reviewed repository evidence.

Non-authorizing meaning:

- `undefined` does not authorize migration application.
- `undefined` does not authorize database mutation.
- `undefined` does not authorize deployment.
- `undefined` does not authorize runtime activation.
- `undefined` does not authorize production migration.
- `undefined` does not authorize GitHub mutation.
- `undefined` does not authorize production gate opening.

Accepted A13 vocabulary remains:

- `undefined`
- `candidate_only`
- `inventory_known`
- `prechecks_required`
- `ready_for_confirmation_review`
- `blocked`

`ready_for_confirmation_review` is not ready for migration application.

ready_for_confirmation_review is not ready for migration application.

## 10. Evidence used

Evidence used:

- `portal/prisma/schema.prisma` defines a PostgreSQL datasource and `MotionIntakeRecord` source model.
- `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql` creates `MotionIntakeRecord` in source.
- `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts` uses server-only persistence helpers and safe blocked preview behavior.
- `portal/src/app/operator/motion-control/motion-intake/route.ts` exposes explicit `GET`/`POST` behavior with non-authorizations.
- `docs/reference/q3m7-motion-intake-target-environment-identification-v0.md` recommends `no_target_yet`.
- `docs/reference/q3m7-motion-intake-environment-inventory-clarification-v0.md` records `no_confirmed_target_environment`.
- `docs/reference/q3m7-motion-intake-environment-definition-plan-v0.md` defines non-secret requirements and readiness vocabulary.
- `docs/reference/dev-jai-nexus-live-readiness-staging-v0.md` uses readiness/staging language but does not define a migration target.
- `portal/docs/operator-v0-overview.md` references the portal, Prisma, and Neon in historical/operator context, but it does not define a current A8 sandbox/staging migration target.
- `portal/config/dispatch/dev-jai-nexus.yaml` and `portal/config/repo-cards/dev-jai-nexus.yaml` reference `dev.jai.nexus` and gates, but do not provide a sandbox/staging DB target or migration evidence package.

## 11. Missing evidence

Missing evidence:

- explicit sandbox/staging environment identity
- environment purpose for A8 motion intake persistence
- owner / operator access model
- non-secret database target description
- database provider for a concrete target
- Prisma/Postgres compatibility for a concrete target
- current deployed commit or artifact reference
- confirmation that deployed artifact includes the A8 migration
- Prisma migration history visibility
- backup availability
- rollback path
- maintenance/downtime expectation
- post-migration verification checklist
- explicit provider-secret boundary for the target
- telemetry boundary for the target
- confirmation that production is not targeted
- CONTROL_THREAD or explicit human approval path for target confirmation

## 12. Candidate environment identity

Candidate environment identity: not defined.

No reviewed repository evidence identifies a concrete sandbox/staging target for A8 motion intake migration consideration.

Status: `undefined`.

## 13. Candidate environment purpose

Candidate environment purpose: not defined.

The purpose of a future sandbox/staging target would need to state whether it exists to validate A8 durable motion intake records, operator-visible persistence behavior, fallback behavior, and post-migration verification.

No such purpose is currently documented for a concrete target.

## 14. Candidate owner / operator access model

Candidate owner / operator access model: not defined.

Reviewed evidence does not identify:

- owner
- operator access path
- approver
- migration executor
- maintenance communicator
- rollback steward

Operator access evidence remains required before any confirmation route.

## 15. Non-secret database target description

Non-secret database target description: not defined.

Reviewed evidence confirms source-level PostgreSQL usage, but no concrete sandbox/staging database target was identified.

No connection strings, credentials, tokens, host passwords, API keys, full env objects, or credential-bearing provider config were read or copied.

## 16. Database provider category

Database provider category: source-level PostgreSQL only.

The source schema declares PostgreSQL. A concrete target provider remains unknown because no sandbox/staging target was defined.

Source-level provider evidence does not identify a target database.

## 17. Prisma/Postgres compatibility posture

Prisma/Postgres compatibility posture: source-compatible, target-unverified.

The A8 source migration uses PostgreSQL-compatible SQL and JSONB fields. A concrete target compatibility posture remains unknown until a target environment is identified and non-secret compatibility evidence is provided.

## 18. Deployed artifact / commit reference status

Deployed artifact / commit reference status: unknown.

Reviewed evidence does not identify a current deployed artifact for a sandbox/staging target, nor whether that artifact includes A8 motion intake migration source.

## 19. A8 migration presence in deployed artifact

A8 migration presence in deployed artifact: unknown.

The A8 migration exists in source. Reviewed evidence does not prove it is present in any sandbox/staging deployed artifact.

## 20. Migration history visibility status

Migration history visibility status: unknown.

Reviewed evidence does not provide target migration history, clean migration status, drift status, or pending migration status for any sandbox/staging target.

## 21. Backup availability status

Backup availability status: unknown.

Reviewed evidence does not provide backup existence, backup recency, backup owner, or restore posture for any sandbox/staging target.

## 22. Rollback path status

Rollback path status: unknown.

Reviewed evidence does not provide rollback owner, rollback decision path, non-secret rollback mechanism, schema rollback expectation, record rollback expectation, or destructive rollback risk for any sandbox/staging target.

## 23. Maintenance / downtime expectation

Maintenance / downtime expectation: unknown.

Reviewed evidence does not define maintenance window, downtime expectation, operator notification, freeze window, or verification window for an A8 motion intake sandbox/staging migration target.

## 24. Post-migration verification status

Post-migration verification status: not defined.

A future verification plan must include target identity, migration status, `MotionIntakeRecord` availability, safe route behavior, fallback behavior, provider-secret boundary, persisted record non-authority, no auto-submit, no auto-run deliberation, no auto-route, no GitHub mutation, no production gate behavior, CONTROL_THREAD authority, and Linear temporary mirror posture.

No target-specific post-migration verification plan exists yet.

## 25. Provider-secret boundary

Provider-secret boundary:

- Provider API keys are not persisted by the motion intake migration.
- Provider API keys are not exposed to client components by sandbox target definition.
- Provider API keys are not returned by persisted motion routes.
- Provider API keys are not included in persisted motion records.
- Provider API keys are not included in draft outputs.
- `JAI_MODEL_SLOT_API_KEY` remains server-side only.
- Persisted motion records must not contain full env objects.
- Persisted motion records must not contain credential-bearing provider config.
- Secret values must not be copied into the review artifact.
- Secret-bearing files remain out of scope for this lane.

## 26. Telemetry boundary

Sandbox target definition does not authorize telemetry.

Sandbox target definition does not authorize production telemetry. Sandbox target definition does not authorize background collection. Sandbox target definition does not authorize provider/model routing telemetry. Any telemetry posture remains separately routed and reviewed.

## 27. Production exclusion boundary

Production exclusion boundary:

- Production is not included in this sandbox/staging target definition.
- Production is not the first target for A8 motion intake migration application.
- Production migration is not authorized by this lane.
- Production restore is not authorized by this lane.
- Production rollback is not authorized by this lane.
- Production telemetry is not authorized by this lane.
- Production gate opening is not authorized by this lane.
- Production readiness review remains separate if production is ever considered.
- Production must remain `blocked` unless CONTROL_THREAD routes a separate production readiness review with explicit production evidence.

## 28. Target suitability finding

Target suitability finding: `not_defined`.

Consequence:

- Sandbox/staging target confirmation cannot proceed as a confirmation route yet.
- A separate evidence package or environment provisioning/definition route is required first.
- Migration application authorization cannot proceed.
- Production remains excluded.

This finding does not use `approved`, `authorized`, or ready-for-migration language.

## 29. Required evidence before sandbox target confirmation

Required evidence before any sandbox/staging target confirmation route:

- explicit sandbox/staging environment identity
- environment purpose
- owner / operator access model
- non-secret database target description
- database provider
- Prisma/Postgres compatibility
- current deployed commit or artifact reference
- confirmation that deployed artifact includes the A8 migration
- Prisma migration history visibility
- backup availability
- rollback path
- maintenance/downtime expectation
- post-migration verification checklist
- provider-secret boundary
- telemetry boundary
- confirmation that production is not targeted
- CONTROL_THREAD or explicit human approval path

## 30. Required evidence before migration application authorization

Required evidence before any migration application authorization route:

- target environment identity
- database connection target confirmed without exposing secrets
- deployed artifact includes the A8 migration
- migration history is clean / visible
- backup is current and restorable
- rollback plan is documented
- operator access is confirmed
- maintenance window is approved if needed
- post-migration verification plan exists
- provider-secret boundary remains intact
- telemetry boundary remains intact
- production exclusion remains explicit unless a separate production readiness route exists
- no GitHub/deployment authority is bundled into migration application
- no runtime activation is bundled into migration application
- CONTROL_THREAD approval path is explicit

## 31. Migration application boundary

Sandbox target definition does not apply the A8 migration.

Sandbox target definition does not authorize applying the A8 migration. Sandbox target definition does not make the migration target-ready. Future migration application requires separate target confirmation, backup/rollback evidence, deployed artifact confirmation, migration history review, post-migration verification plan, and CONTROL_THREAD or explicit human approval.

Applying the migration in any environment remains a separately routed or manually approved action.

## 32. Database mutation boundary

Sandbox target definition does not connect to any database.

Sandbox target definition does not mutate any database. Sandbox target definition does not create, alter, drop, seed, or delete tables. Sandbox target definition does not create durable records. Sandbox target definition does not change Prisma migration history. Sandbox target definition does not grant database credentials or access.

## 33. Deployment authorization boundary

Sandbox target definition does not deploy code.

Sandbox target definition does not modify deployment config. Sandbox target definition does not authorize deployment. Sandbox target definition does not authorize Vercel or platform changes. Sandbox target definition does not authorize production changes. Sandbox target definition does not authorize source-of-truth transfer.

## 34. Durable records availability boundary

Durable motion intake records are unavailable in any target environment until the A8 migration is applied there.

Source migration existence does not create records. Sandbox target definition does not create records. Candidate environment definition does not create records.

Future migration application would make the table available only in that specific target environment, if separately authorized and successfully applied. Durable record availability does not make records authoritative.

## 35. Persisted motion authority boundary

Persisted motion authority boundary:

- Persisted motion is not approved work.
- Persisted motion is not routed work.
- Persisted motion is not CONTROL_THREAD acceptance.
- Persisted motion is not autonomous execution.
- Persisted target thread is not route authority.
- Persisted repo target is not repo execution authority.
- Persisted evidence pointer is not validation approval.
- Selected persisted motion basis is not final authority.
- Sandbox target definition does not change any of those semantics.

## 36. CONTROL_THREAD authority separation

CONTROL_THREAD remains authority.

Sandbox target definition is not CONTROL_THREAD acceptance. Candidate environment selection is not CONTROL_THREAD acceptance. Readiness vocabulary is not CONTROL_THREAD acceptance. Migration existence is not CONTROL_THREAD acceptance. Persisted motion records are not CONTROL_THREAD acceptance.

Any future target confirmation or migration application must remain separately routed or manually approved.

## 37. Linear temporary mirror posture

Linear remains temporary mirror only.

Sandbox target definition does not transfer source of truth to Linear. Candidate environment selection does not transfer source of truth to Linear. Persisted motion records do not transfer source of truth to Linear.

Linear mirror posture does not create route authority, acceptance authority, execution authority, production authority, or production gate opening.

## 38. Required findings

Required findings:

- Sandbox target definition is not migration application.
- Sandbox target definition is not database mutation.
- Sandbox target definition is not deployment authorization.
- Sandbox target definition is not runtime activation.
- Sandbox target definition is not production migration.
- Sandbox target definition is not CONTROL_THREAD acceptance.
- Sandbox target definition does not create durable records.
- Sandbox target definition does not authorize GitHub mutation.
- Sandbox target definition does not authorize production gate opening.
- `ready_for_confirmation_review` is not ready for migration application.
- CONTROL_THREAD remains authority.
- Linear remains temporary mirror only.

## 39. Non-authorizations

Required handling:

- Do not read or print secret values.
- Do not commit secrets.
- Do not mutate environment files.
- Do not modify deployment config.
- Do not connect to databases.
- Do not apply migrations.
- Do not deploy.
- Do not run runtime activation.
- Do not run production telemetry.
- Do not create provider/model routing authority.

Required non-authorizations preserved:

- No autonomous execution.
- No GitHub mutation.
- No PR creation.
- No branch mutation.
- No merge action.
- No branch deletion.
- No production gate opening.
- No production migration authorization.
- No runtime activation.
- No database mutation.
- No migration application.
- No deployment authorization.
- No production telemetry.
- No provider/model routing authority.
- No source-of-truth transfer.
- No hidden background execution.
- No automatic route execution.
- No work-packet execution.
- No auto-submit to agents.
- No auto-run deliberation.
- No auto-route work.
- No provider API key persistence.
- No provider API key exposure.
- No provider secret storage.
- No final CONTROL_THREAD approval by sandbox target definition.
- No final CONTROL_THREAD approval by candidate environment selection.
- No final CONTROL_THREAD approval by readiness vocabulary.
- No final CONTROL_THREAD approval by persisted motion.
- No route authority by sandbox target definition.
- No route authority by candidate environment selection.
- No route authority by readiness vocabulary.
- No route authority by persisted motion.
- No route authority by persisted target thread.
- No route authority by persisted repo target.
- No execution authority by sandbox target definition.
- No execution authority by candidate environment selection.
- No execution authority by readiness vocabulary.
- No execution authority by persisted motion.
- No execution authority by persisted target thread.
- No execution authority by persisted repo target.
- No production gate authority by sandbox target definition.
- No production gate authority by candidate environment selection.
- No production gate authority by readiness vocabulary.
- No production gate authority by persisted motion.

## 40. Risks and follow-ups

Risks:

- General staging/readiness language could be mistaken for a concrete sandbox/staging target.
- Historical Neon/Prisma/Vercel references could be mistaken for current migration target evidence.
- `dev.jai.nexus` domain references could be mistaken for target database identity.
- Source migration existence could be mistaken for deployed artifact presence.
- Production could be considered too early without separate production readiness evidence.
- Persisted records could be mistaken for CONTROL_THREAD acceptance if boundaries are hidden.

Follow-ups:

- Gather a non-secret sandbox/staging evidence package.
- Confirm target identity, owner, operator access, database target, deployed artifact, migration history, backup, rollback, maintenance, and verification.
- Repeat sandbox target definition or route sandbox target confirmation only after evidence exists.
- Keep production excluded until a separate production readiness route exists.

## 41. Recommended next decision path

Recommended next decision path:

1. CONTROL_THREAD acceptance of this sandbox target definition artifact.
2. Separate sandbox/staging environment provisioning or external environment evidence gathering.
3. Repeat sandbox target definition or route sandbox target confirmation only after evidence exists.
4. Separate migration application authorization only after target identity, DB target, backup, rollback, operator access, migration history, deployed artifact, and post-migration verification are confirmed.
5. Separate post-migration verification route.
6. Separate production readiness route only if production is ever considered.

Possible future routes:

- `Q3M7 Motion Intake Sandbox Evidence Package v0`
- `Q3M7 Motion Intake Sandbox Target Confirmation v0`
- `Q3M7 Motion Intake Migration Application Authorization v0`
- `Q3M7 Motion Intake Post-Migration Verification Plan v0`
- `Q3M7 Persisted Motion Lifecycle Boundary Plan v0`

These are recommendations only. They are not approved by this plan.

## 42. Validation plan

Validation plan:

- Confirm this is a static docs/reference artifact.
- Confirm no runtime/source behavior changed.
- Confirm no migration was applied.
- Confirm no route behavior changed.
- Confirm no UI behavior changed.
- Confirm no secret values were copied into the artifact.
- Confirm the no-concrete-target-yet finding is present.
- Confirm A13 readiness vocabulary assignment is present.
- Confirm target suitability finding is present.
- Confirm required findings are present.
- Confirm required non-authorizations are present.
- Run `git diff --check`.
- Run `git diff --cached --check`.
- Run phrase checks for required sandbox target definition findings.
- Run phrase checks for readiness vocabulary.
- Run phrase checks for required non-authorizations.
- Run a conservative secret-looking-value scan on this artifact and manually review any hits.

## 43. ZERO GATES GRANTED

ZERO GATES GRANTED.

This artifact grants no migration application, database mutation, deployment authorization, runtime activation, production migration, GitHub mutation, production gate opening, source-of-truth transfer, provider/model routing authority, route authority, execution authority, acceptance authority, durable record authority, or final CONTROL_THREAD approval.
