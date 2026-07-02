# Q3M7 Motion Intake Sandbox Evidence Package v0

## Role

Role: JAI::DEV::BUILDER

## Program / batch / wave / lane

- Program: Q3M7Y26 JAI Motion Control Plane Activation v0
- Batch: A
- Wave: A-H
- Lane: A15
- Thread: 2026-06-21_dev-jai-nexus

## Scope

This artifact defines the non-secret evidence package required before a future sandbox/staging target confirmation review or any later migration application authorization can be considered for the A8 motion intake persistence migration.

This artifact is static planning only. It does not change runtime behavior, source behavior, route behavior, UI behavior, persistence behavior, schema behavior, deployment behavior, provider dispatch, GitHub behavior, production gates, or CONTROL_THREAD authority.

## Reviewed baseline

- A8 durable motion intake persistence baseline: `portal/prisma/schema.prisma`, `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql`, `portal/src/lib/controlPlane/motionKernel/motion-intake.ts`, `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts`, and `portal/src/app/operator/motion-control/motion-intake/route.ts`.
- A9 persisted motion record review / selection boundary: `docs/reference/q3m7-motion-intake-record-review-selection-boundary-v0.md`.
- A10 migration readiness review: `docs/reference/q3m7-motion-intake-migration-readiness-review-v0.md`.
- A11 target environment identification: `docs/reference/q3m7-motion-intake-target-environment-identification-v0.md`.
- A12 environment inventory clarification: `docs/reference/q3m7-motion-intake-environment-inventory-clarification-v0.md`.
- A13 environment definition plan: `docs/reference/q3m7-motion-intake-environment-definition-plan-v0.md`.
- A14 sandbox target definition: `docs/reference/q3m7-motion-intake-sandbox-target-definition-v0.md`.

## Files / evidence sources reviewed

- `portal/prisma/schema.prisma`
- `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql`
- `portal/src/lib/controlPlane/motionKernel/motion-intake.ts`
- `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts`
- `portal/src/app/operator/motion-control/motion-intake/route.ts`
- `portal/src/app/operator/motion-control/page.tsx`
- `portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx`
- `docs/reference/q3m7-motion-intake-record-review-selection-boundary-v0.md`
- `docs/reference/q3m7-motion-intake-migration-readiness-review-v0.md`
- `docs/reference/q3m7-motion-intake-target-environment-identification-v0.md`
- `docs/reference/q3m7-motion-intake-environment-inventory-clarification-v0.md`
- `docs/reference/q3m7-motion-intake-environment-definition-plan-v0.md`
- `docs/reference/q3m7-motion-intake-sandbox-target-definition-v0.md`
- Safe repository search across docs/config references for sandbox, staging, deployment, Prisma, Postgres, migration, backup, rollback, verification, and readiness language.

Secret-bearing files such as `.env`, `.env.*`, private keys, credential files, and secret-bearing config were not inspected. Secret values remain out of scope.

## Planning purpose

The planning purpose is to define what evidence must exist before any future route can decide whether a sandbox or staging target is sufficiently documented for confirmation review. This package defines requirements only. It does not satisfy the requirements unless future non-secret evidence is supplied and reviewed.

## Evidence package purpose

The sandbox evidence package exists to prevent a candidate environment name from being mistaken for migration readiness. It requires non-secret evidence for target identity, purpose, ownership, database posture, deployed artifact posture, migration history, backup, rollback, maintenance, verification, provider-secret boundaries, telemetry boundaries, production exclusion, and CONTROL_THREAD approval path.

The evidence package is a review input only. Evidence presence is not migration authorization.

## A14 Outcome B baseline

A14 recorded Outcome B: no concrete sandbox/staging target can be defined yet from repository evidence.

- A11 `no_target_yet` remains preserved.
- A12 environment inventory remains insufficient for target definition.
- A13 requirements exist but are not satisfied by a concrete environment.
- A14 readiness value remains `undefined`.
- A14 target suitability finding remains `not_defined`.
- Sandbox/staging target confirmation cannot be routed except as a separate evidence-gathering or evidence-package route.
- Migration application authorization cannot be routed yet.
- Production remains excluded.

## Required evidence package categories

| Category | Required evidence | Acceptable non-secret examples | Unacceptable evidence | Missing-evidence blocker | Related non-authorization boundary |
| --- | --- | --- | --- | --- | --- |
| target identity evidence | Explicit sandbox/staging target identity. | Repo-relative doc naming the target; redacted environment identifier. | Environment name treated as authorization. | No confirmation review without target identity. | No route authority by evidence presence. |
| environment purpose evidence | Stated purpose for motion intake migration evaluation. | Non-secret purpose statement. | Production purpose reused for sandbox/staging. | No suitability finding without purpose. | No production migration authorization. |
| owner/operator access evidence | Owner and operator access model. | Role description without passwords or tokens. | Credentials, personal secrets, unredacted platform access. | No application review without accountable operator. | No deployment authorization. |
| non-secret database target evidence | Non-secret database target description. | `managed Postgres sandbox database` without host/user/password/token. | Connection strings, host passwords, raw environment contents. | No migration consideration without DB target description. | No database mutation. |
| database provider category evidence | Database provider category and compatibility intent. | Postgres-compatible managed database category. | Secret-bearing platform screenshots. | No Prisma/Postgres compatibility finding. | No provider secret storage. |
| Prisma/Postgres compatibility evidence | Evidence target can support the accepted Prisma/Postgres schema posture. | Compatibility note or platform docs summary without credentials. | Runtime connection proof containing secrets. | No target confirmation without compatibility evidence. | No runtime activation. |
| deployed artifact / commit evidence | Commit or artifact planned for the target. | Commit hash or artifact version without credentials. | Deployment credential logs. | Cannot prove A8 migration is deployable to target. | No deployment authorization. |
| A8 migration presence evidence | Evidence deployed artifact includes A8 migration. | Migration file path and artifact manifest summary. | Assuming source existence equals deployed presence. | No migration application authorization route. | No migration application. |
| Prisma migration history evidence | Non-secret migration history status. | Summary that migration history is visible and clean. | Database URLs, credential-bearing CLI output. | No migration application authorization route. | No database mutation. |
| backup availability evidence | Backup availability and restore posture. | Backup policy confirmation without storage credentials. | Backup storage credentials or unredacted console output. | No migration application authorization route. | No production restore authorization. |
| rollback path evidence | Rollback procedure summary. | Non-secret rollback decision tree. | Destructive rollback commands for production. | No application review without rollback posture. | No destructive rollback authorization. |
| maintenance/downtime expectation evidence | Maintenance window or no-downtime expectation. | Operator-approved window statement. | Implicit downtime assumption. | No application review without operator expectation. | No runtime activation. |
| post-migration verification plan evidence | Verification checklist for table availability and non-authority semantics. | Checklist without credentials or connection strings. | Logs with secrets or runtime activation claims. | No application review without verification plan. | No production gate opening. |
| provider-secret boundary evidence | Confirmation provider secrets stay out of records, routes, and drafts. | Boundary statement naming server-only provider key posture. | Provider keys, provider config dumps. | No confirmation review if secret boundary is unclear. | No provider API key exposure. |
| telemetry boundary evidence | Confirmation no telemetry is bundled. | Non-secret telemetry exclusion statement. | Production telemetry logs. | No confirmation review if telemetry scope is unclear. | No production telemetry. |
| production exclusion evidence | Explicit statement production is not targeted. | Production exclusion line in package. | Production-only evidence used for sandbox/staging. | Sandbox route remains blocked if production is ambiguous. | No production gate opening. |
| CONTROL_THREAD approval path evidence | Explicit human / CONTROL_THREAD approval path. | Route note naming required later approval. | Evidence package treated as approval. | No migration authorization without authority path. | No final CONTROL_THREAD approval by evidence presence. |

## Target identity evidence

Target identity evidence must name a specific sandbox or staging target using non-secret terms. It must distinguish the target from production and from local development. A redacted deployment identifier or repository document path is acceptable if it does not expose credentials.

Missing target identity evidence blocks sandbox target confirmation and migration application authorization.

## Environment purpose evidence

Environment purpose evidence must explain why the target exists and why it is being considered for A8 motion intake persistence validation. The purpose must be limited to sandbox/staging review and must not imply production readiness, runtime activation, or CONTROL_THREAD acceptance.

## Owner / operator access evidence

Owner/operator access evidence must identify the responsible owner or operator role and the human approval path. It may describe access roles but must not include usernames with credentials, passwords, tokens, private keys, or platform secrets.

## Non-secret database target evidence

Non-secret database target evidence must describe the database target category without connection strings, credentials, tokens, host passwords, API keys, or raw environment values. A description such as `managed Postgres sandbox database` is acceptable only as a non-secret category description.

## Database provider category evidence

Database provider category evidence must show whether the target is Postgres-compatible and suitable for Prisma migration review. It must not rely on secret-bearing platform output. Evidence may cite a non-secret platform category, service class, or repository document.

## Prisma/Postgres compatibility evidence

Prisma/Postgres compatibility evidence must connect the target database category to the accepted source posture: `portal/prisma/schema.prisma` uses a PostgreSQL datasource and A8 adds `MotionIntakeRecord` with JSON fields and non-authoritative markers.

Compatibility evidence is not runtime connection evidence and does not authorize database access.

## Deployed artifact / commit evidence

Deployed artifact / commit evidence must identify the source commit or deployment artifact intended for review. It must not include deployment credentials. It must make clear whether the artifact contains the A8 migration file.

## A8 migration presence evidence

A8 migration presence evidence must show that `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql` is included in the deployed artifact under review. Source repository existence alone does not prove target deployment presence.

## Prisma migration history evidence

Prisma migration history evidence must summarize whether migration history is visible and clean for the target. It must not include database connection strings or credential-bearing command output. This evidence is required before migration application authorization can even be considered.

## Backup availability evidence

Backup availability evidence must show that a current backup exists or that an explicit backup policy covers the target. It must not expose storage credentials or console secrets. A backup claim must include restore posture at a non-secret level.

## Rollback path evidence

Rollback path evidence must describe the rollback option, such as database restore or manually governed migration rollback under environment policy. This lane authorizes no destructive rollback and no production restore.

## Maintenance / downtime expectation evidence

Maintenance/downtime expectation evidence must state whether an operator-approved maintenance window, expected downtime, or no-downtime posture is required. The statement must be reviewed before any migration application authorization route.

## Post-migration verification plan evidence

Post-migration verification plan evidence must define how a future separately authorized route would verify table availability, route behavior, persistence status, and non-authoritative semantics without exposing secrets or opening production gates.

Verification evidence does not create validation approval by itself.

## Provider-secret boundary evidence

Provider-secret boundary evidence must preserve that provider API keys are not persisted by the motion intake migration, not exposed to client components, not returned by persisted motion routes, not included in persisted motion records, and not included in draft outputs.

`JAI_MODEL_SLOT_API_KEY` remains server-side only. Persisted motion records must not contain full environment objects or credential-bearing provider config.

## Telemetry boundary evidence

Telemetry boundary evidence must state that the sandbox evidence package does not authorize telemetry, production telemetry, background collection, or provider/model routing telemetry. Any telemetry posture remains separately routed and reviewed.

## Production exclusion evidence

Production exclusion evidence must explicitly state that production is not included in the sandbox evidence package, production is not the first target for A8 motion intake migration application, and production remains blocked unless CONTROL_THREAD routes a separate production readiness review with explicit production evidence.

## CONTROL_THREAD approval path evidence

CONTROL_THREAD approval path evidence must identify the later human approval or CONTROL_THREAD route required before target confirmation and before migration application authorization. Evidence package presence is not CONTROL_THREAD acceptance.

## Acceptable non-secret evidence examples

- Repo-relative documentation path naming an environment without secret values.
- Non-secret environment inventory table.
- Redacted deployment identifier.
- Redacted database target description such as `managed Postgres sandbox database` without host, user, password, token, or connection string.
- Deployed commit hash or artifact version without credentials.
- Migration status summary with no connection string.
- Backup policy confirmation with no storage credentials.
- Rollback procedure summary with no secret values.
- Operator access role description without passwords or tokens.
- Maintenance window statement.
- Post-migration verification checklist.
- Explicit production exclusion statement.
- CONTROL_THREAD approval path statement.

## Unacceptable evidence examples

- Raw `.env` contents.
- Database connection strings.
- API keys.
- Provider tokens.
- Passwords.
- Private keys.
- Unredacted platform credentials.
- Screenshots or logs that expose secrets.
- Production-only evidence used to authorize sandbox/staging.
- Deployment names without database, backup, rollback, migration history, and operator-access evidence.
- Environment names treated as authorization.
- Readiness vocabulary treated as authorization.
- Evidence package presence treated as migration approval.

## Missing-evidence blockers

Missing target identity, non-secret database target, database provider category, Prisma/Postgres compatibility, deployed artifact, A8 migration presence in artifact, migration history visibility, backup availability, rollback path, owner/operator access, maintenance expectation, verification plan, provider-secret boundary, telemetry boundary, production exclusion, or CONTROL_THREAD approval path blocks sandbox target confirmation.

Missing accepted sandbox target confirmation, confirmed database target, clean/visible migration history, current/restorable backup, documented rollback plan, confirmed operator access, approved maintenance window if needed, post-migration verification plan, intact provider-secret boundary, intact telemetry boundary, explicit production exclusion, and explicit CONTROL_THREAD or human approval path blocks migration application authorization.

## Readiness vocabulary mapping

| Readiness value | Evidence package meaning | Allowed use | Disallowed implication | Migration application authorization |
| --- | --- | --- | --- | --- |
| `undefined` | No target identity or insufficient evidence. | Record absent target evidence. | Does not imply a candidate exists. | No. |
| `candidate_only` | Candidate named but evidence incomplete. | Track candidate for evidence gathering. | Does not imply target confirmation. | No. |
| `inventory_known` | Inventory is known but confirmation prechecks are incomplete. | Support inventory review. | Does not imply readiness. | No. |
| `prechecks_required` | Enough evidence exists to identify prechecks, but prechecks are not complete. | Route precheck gathering. | Does not imply authorization. | No. |
| `ready_for_confirmation_review` | Evidence package is complete enough for a later sandbox target confirmation review only. | Route confirmation review. | Does not imply migration application. | No. |
| `blocked` | Evidence is missing, contradictory, secret-bearing, production-only, or unsafe. | Stop confirmation and application routing. | Does not imply approval after time passes. | No. |

No readiness value authorizes migration application. No readiness value authorizes database mutation. No readiness value authorizes deployment. No readiness value authorizes runtime activation. No readiness value authorizes production migration. No readiness value authorizes GitHub mutation. No readiness value authorizes production gate opening. Evidence presence is not migration authorization. ready_for_confirmation_review is not ready for migration application.

## Sandbox target confirmation threshold

Sandbox target confirmation can be routed only when the evidence package includes, at minimum:

- Explicit sandbox/staging target identity.
- Environment purpose.
- Owner/operator access model.
- Non-secret database target description.
- Database provider category.
- Prisma/Postgres compatibility.
- Deployed artifact / commit reference.
- A8 migration presence in deployed artifact.
- Migration history visibility.
- Backup availability.
- Rollback path.
- Maintenance/downtime expectation.
- Post-migration verification plan.
- Provider-secret boundary.
- Telemetry boundary.
- Production exclusion evidence.
- CONTROL_THREAD approval path.

This threshold routes confirmation review only. It does not authorize migration application.

## Migration application threshold

Migration application authorization can be considered only after:

- Sandbox target confirmation is accepted.
- Target environment identity is confirmed.
- Database target is confirmed without exposing secrets.
- Deployed artifact includes A8 migration.
- Prisma migration history is clean / visible.
- Backup is current and restorable.
- Rollback plan is documented.
- Operator access is confirmed.
- Maintenance/downtime window is approved if needed.
- Post-migration verification plan exists.
- Provider-secret boundary remains intact.
- Telemetry boundary remains intact.
- Production remains excluded unless a separate production readiness route exists.
- No GitHub/deployment authority is bundled into migration application.
- No runtime activation is bundled into migration application.
- CONTROL_THREAD or explicit human approval path is explicit.

This threshold is a threshold for considering authorization, not authorization itself.

## Secret-handling boundary

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
- Evidence package entries must use non-secret descriptions only.
- Database targets must be described without connection strings, credentials, tokens, host passwords, or API keys.
- Provider keys remain server-side only.
- Secret-bearing files remain out of scope for this planning lane.

## Production exclusion boundary

- Production is not included in this sandbox evidence package.
- Production evidence does not authorize sandbox/staging migration application.
- Production is not the first target for A8 motion intake migration application.
- Production migration is not authorized by this lane.
- Production restore is not authorized by this lane.
- Production rollback is not authorized by this lane.
- Production telemetry is not authorized by this lane.
- Production gate opening is not authorized by this lane.
- Production readiness review remains separate if production is ever considered.
- Production must remain `blocked` unless CONTROL_THREAD routes a separate production readiness review with explicit production evidence.

## Migration application boundary

- Sandbox evidence package does not apply the A8 migration.
- Sandbox evidence package does not authorize applying the A8 migration.
- Sandbox evidence package does not make the migration target-ready.
- Evidence package completeness may support a future confirmation review only.
- Future migration application requires separate target confirmation, backup/rollback evidence, deployed artifact confirmation, migration history review, post-migration verification plan, and CONTROL_THREAD or explicit human approval.
- Applying the migration in any environment remains a separately routed or manually approved action.

## Database mutation boundary

- Sandbox evidence package does not connect to any database.
- Sandbox evidence package does not mutate any database.
- Sandbox evidence package does not create, alter, drop, seed, or delete tables.
- Sandbox evidence package does not create durable records.
- Sandbox evidence package does not change Prisma migration history.
- Sandbox evidence package does not grant database credentials or access.

## Deployment authorization boundary

- Sandbox evidence package does not deploy code.
- Sandbox evidence package does not modify deployment config.
- Sandbox evidence package does not authorize deployment.
- Sandbox evidence package does not authorize Vercel or platform changes.
- Sandbox evidence package does not authorize production changes.
- Sandbox evidence package does not authorize source-of-truth transfer.

## Durable records availability boundary

- Durable motion intake records are unavailable in any target environment until the A8 migration is applied there.
- Source migration existence does not create records.
- Sandbox evidence package does not create records.
- Evidence package completeness does not create records.
- Future migration application would make the table available only in that specific target environment, if separately authorized and successfully applied.
- Durable record availability does not make records authoritative.

## Persisted motion authority boundary

- Persisted motion is not approved work.
- Persisted motion is not routed work.
- Persisted motion is not CONTROL_THREAD acceptance.
- Persisted motion is not autonomous execution.
- Persisted target thread is not route authority.
- Persisted repo target is not repo execution authority.
- Persisted evidence pointer is not validation approval.
- Selected persisted motion basis is not final authority.
- Sandbox evidence package does not change any of those semantics.

## CONTROL_THREAD authority separation

CONTROL_THREAD remains authority. The sandbox evidence package, evidence presence, readiness vocabulary, candidate environment selection, migration existence, persisted motion records, selected persisted motion basis, motion intake, thread selection, repo targets, and draft outputs are not final authority.

Human / CONTROL_THREAD approval remains required before any target confirmation, migration application authorization, database mutation, deployment, runtime activation, production consideration, or downstream route use.

## Linear temporary mirror posture

Linear remains temporary mirror only. Linear references, if any, do not create target identity, migration application authorization, database mutation authority, runtime activation, production gates, or CONTROL_THREAD acceptance.

## Required findings

- Sandbox evidence package is not migration application.
- Sandbox evidence package is not database mutation.
- Sandbox evidence package is not deployment authorization.
- Sandbox evidence package is not runtime activation.
- Sandbox evidence package is not production migration.
- Sandbox evidence package is not CONTROL_THREAD acceptance.
- Sandbox evidence package does not create durable records.
- Sandbox evidence package does not authorize GitHub mutation.
- Sandbox evidence package does not authorize production gate opening.
- Evidence presence is not migration authorization.
- ready_for_confirmation_review is not ready for migration application.
- CONTROL_THREAD remains authority.
- Linear remains temporary mirror only.

## Non-authorizations

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
- No final CONTROL_THREAD approval by sandbox evidence package.
- No final CONTROL_THREAD approval by evidence presence.
- No final CONTROL_THREAD approval by candidate environment selection.
- No final CONTROL_THREAD approval by readiness vocabulary.
- No final CONTROL_THREAD approval by persisted motion.
- No route authority by sandbox evidence package.
- No route authority by evidence presence.
- No route authority by candidate environment selection.
- No route authority by readiness vocabulary.
- No route authority by persisted motion.
- No route authority by persisted target thread.
- No route authority by persisted repo target.
- No execution authority by sandbox evidence package.
- No execution authority by evidence presence.
- No execution authority by candidate environment selection.
- No execution authority by readiness vocabulary.
- No execution authority by persisted motion.
- No execution authority by persisted target thread.
- No execution authority by persisted repo target.
- No production gate authority by sandbox evidence package.
- No production gate authority by evidence presence.
- No production gate authority by candidate environment selection.
- No production gate authority by readiness vocabulary.
- No production gate authority by persisted motion.

## Risks and follow-ups

- Risk: evidence package presence may be mistaken for migration approval. Mitigation: preserve that Evidence presence is not migration authorization.
- Risk: a deployment name may be overread as target readiness. Mitigation: require database, backup, rollback, migration history, and operator access evidence.
- Risk: secret-bearing evidence could leak into review docs. Mitigation: require non-secret descriptions and keep secret-bearing files out of scope.
- Risk: production-only evidence could be used to shortcut sandbox/staging review. Mitigation: production remains excluded and blocked unless separately routed.
- Risk: persisted motion records could be mistaken for approved work after migration. Mitigation: preserve persisted motion non-authoritative semantics.

## Recommended next decision path

1. CONTROL_THREAD acceptance of this sandbox evidence package requirements artifact.
2. Separate creation or submission of a non-secret sandbox/staging evidence package.
3. Separate sandbox target confirmation review only after the evidence package satisfies the confirmation threshold.
4. Separate migration application authorization only after target confirmation is accepted and all application threshold evidence exists.
5. Separate backup / rollback confirmation.
6. Separate post-migration verification route.
7. Separate production readiness route only if production is ever considered.

Possible next routes, not approved by this artifact:

- Q3M7 Motion Intake Sandbox Evidence Intake v0.
- Q3M7 Motion Intake Sandbox Target Confirmation v0.
- Q3M7 Motion Intake Migration Application Authorization v0.
- Q3M7 Motion Intake Post-Migration Verification Plan v0.
- Q3M7 Persisted Motion Lifecycle Boundary Plan v0.

## Validation plan

- Run `git diff --check`.
- Run `git diff --cached --check`.
- Confirm required finding phrases are present.
- Confirm required evidence package category phrases are present.
- Confirm A13 readiness vocabulary appears and remains non-authorizing.
- Confirm required non-authorizations are present.
- Confirm no secret-looking values were added to this artifact.
- Confirm no source behavior changed.
- Confirm no migration was applied.
- Confirm no route behavior changed.
- Confirm no UI behavior changed.

## ZERO GATES GRANTED

ZERO GATES GRANTED. This artifact grants no migration application, no database mutation, no deployment authorization, no runtime activation, no production migration, no GitHub mutation, no production gate opening, no source-of-truth transfer, and no CONTROL_THREAD acceptance.
