# Q3M7 Motion Intake Environment Definition Plan v0

## 1. Role

Role: JAI::DEV::BUILDER

## 2. Program / batch / wave / lane

- Program: Q3M7Y26 JAI Motion Control Plane Activation v0
- Batch: A
- Wave: A-G
- Lane: A13
- Repo: `dev-jai-nexus`
- Thread: `2026-06-21_dev-jai-nexus`

## 3. Scope

This artifact defines non-secret requirements for a future motion intake migration-capable target environment before any sandbox/staging target confirmation or migration application authorization may be considered.

This is definition/planning only. Environment definition is not migration application. Environment definition is not database mutation. Environment definition is not deployment authorization. Environment definition is not runtime activation. Environment definition is not production migration. Environment definition is not GitHub mutation. Environment definition is not production gate opening. Environment definition is not source-of-truth transfer. Environment definition is not CONTROL_THREAD acceptance.

ZERO GATES GRANTED.

## 4. Reviewed baseline

Reviewed baseline:

- A8 added the `MotionIntakeRecord` source schema in `portal/prisma/schema.prisma`.
- A8 added the source migration at `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql`.
- A8 added server-only persistence helpers in `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts`.
- A8 added the explicit motion intake route at `portal/src/app/operator/motion-control/motion-intake/route.ts`.
- A9 recorded persisted motion selection boundaries.
- A10 recorded migration readiness boundaries.
- A11 recorded target-environment identification and recommended `no_target_yet`.
- A12 clarified environment inventory and preserved `no_confirmed_target_environment`.

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

`docs/reference/README.md` was not present in this repository state, so no docs/reference index update is required for this lane.

Secret-bearing files were not inspected. `.env`, `.env.*`, private key, and secret-bearing file contents remain out of scope.

## 6. Planning purpose

This plan defines what a future migration-capable target environment must document before sandbox/staging target confirmation or migration application authorization can be considered.

The plan is static guidance only. It does not define executable schema, parser behavior, route behavior, migration application behavior, provider dispatch, GitHub mutation, production gate behavior, source-of-truth transfer, autonomous execution, runtime activation, or deployment authorization.

## 7. Environment definition overview

A target environment definition must be a non-secret evidence package. It should describe identity, purpose, ownership, operator access, database target category, Prisma/Postgres compatibility, migration history visibility, backup, rollback, deployed artifact, maintenance expectations, verification, telemetry posture, and authority boundaries.

The definition may make a candidate ready for a later confirmation review only. It must not make the candidate ready for migration application.

## 8. Environment identity requirements

Required non-secret environment identity fields:

- environment key
- human-readable environment name
- environment class, such as local, sandbox, staging, or blocked production
- non-secret platform description, if known
- non-secret application surface description
- current owner or steward
- explicit statement that the identity does not grant migration authority

Environment identity must not include connection strings, credentials, tokens, passwords, provider keys, or private host details.

## 9. Environment purpose requirements

Required purpose fields:

- intended use of the environment
- whether the environment is shared or local
- whether operator testing is expected
- whether durable motion intake records are operationally required
- whether fallback behavior is acceptable if the migration is not applied
- explicit exclusion of production for sandbox/staging review

Purpose is descriptive only. Purpose is not CONTROL_THREAD acceptance.

## 10. Ownership / operator access requirements

Required ownership and operator access evidence:

- named owner or owner role
- operator role that may request confirmation review
- operator role that may perform future separately approved migration application
- access path described without secrets
- approval path
- maintenance communication path
- emergency contact or rollback steward, if applicable

Operator access evidence does not grant execution authority, database credentials, or final CONTROL_THREAD approval.

## 11. Database target description requirements, non-secret only

Database target descriptions must be non-secret only.

Required database target description:

- database provider family
- environment class for the database target
- non-secret database purpose
- region or locality only if non-secret and already appropriate to disclose
- expected schema owner role, without credentials
- whether the database is isolated from production
- whether the database is disposable or persistent

Disallowed database target content:

- connection strings
- usernames with credential value
- passwords
- tokens
- host passwords
- API keys
- full env objects
- credential-bearing provider config

## 12. Prisma/Postgres requirement categories

Prisma/Postgres requirement categories:

- Prisma schema compatibility
- PostgreSQL compatibility
- migration engine compatibility
- JSON field compatibility for `evidencePointers` and `nonAuthorizations`
- expected ability to create the `MotionIntakeRecord` table if later authorized
- expected ability to index `createdAt`, `targetThread`, `repoTarget`, `intakeState`, and `authorityState`
- clear note that compatibility is not migration authorization

The accepted source baseline uses Prisma with a PostgreSQL datasource. Target compatibility must still be confirmed for the specific target environment.

## 13. Migration history visibility requirements

Migration history visibility requirements:

- current target migration status can be inspected by an authorized operator
- deployed artifact includes the A8 migration before application is considered
- migration history is clean or known
- pending migrations are identified
- drift status is known or explicitly unknown
- migration history evidence is non-secret

Migration history visibility does not authorize migration application.

## 14. Backup availability requirements

Backup availability requirements:

- current backup exists before any future application route
- backup scope is known
- backup timestamp or recency policy is documented without secrets
- backup owner/steward is known
- restore posture is known
- backup limitations are recorded

Backup evidence does not authorize restore, rollback, production restore, production migration, or database mutation.

## 15. Rollback path requirements

Rollback path requirements:

- rollback owner/steward is known
- rollback decision path is known
- rollback mechanism is documented at a non-secret level
- expected rollback effect on schema is understood
- expected rollback effect on records is understood
- destructive rollback risks are recorded
- production rollback remains excluded by this lane

Rollback planning is not rollback authorization.

## 16. Deployed artifact / commit reference requirements

Required deployed artifact evidence:

- current deployed commit or artifact reference
- confirmation that the artifact includes A8 migration source
- confirmation that the operator surface version is compatible with the target
- confirmation that route behavior remains non-authoritative
- confirmation that no unrelated deployment authority is bundled

A deployed artifact reference is evidence only. It is not deployment authorization or runtime activation.

## 17. Maintenance window expectations

Maintenance window expectations:

- whether downtime is expected
- whether operator notification is required
- whether a change window is required
- whether a freeze window exists
- expected verification window
- explicit human approval path

Maintenance planning does not authorize migration application, database mutation, production migration, or runtime activation.

## 18. Post-migration verification checklist

Post-migration verification checklist for a future separately authorized route:

- target environment identity verified
- migration status verified
- `MotionIntakeRecord` table availability verified in that target only
- safe motion intake `GET` behavior verified
- safe motion intake `POST` behavior verified
- fallback behavior remains safe if persistence is unavailable
- provider-secret boundary remains intact
- persisted records remain advisory and non-authoritative
- no auto-submit to agents introduced
- no auto-run deliberation introduced
- no auto-route work introduced
- no GitHub mutation introduced
- no production gate behavior introduced
- CONTROL_THREAD authority remains explicit
- Linear remains temporary mirror only

This checklist is not a command list and does not authorize execution.

## 19. Secret-handling requirements

Secret-handling requirements:

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
- Environment definitions must use non-secret descriptions only.
- Database targets must be described without connection strings, credentials, tokens, host passwords, or API keys.
- Provider keys remain server-side only.
- Secret-bearing files remain out of scope for this planning lane.

## 20. Telemetry boundary

Environment definition does not authorize telemetry.

Environment definition does not authorize production telemetry. Environment definition does not authorize background collection. Environment definition does not authorize provider/model routing telemetry. Any telemetry posture remains separately routed and reviewed.

## 21. Sandbox/staging suitability rules

Sandbox/staging suitability rules:

- A sandbox/staging environment may become `ready_for_confirmation_review` only after minimum evidence is documented.
- Sandbox/staging confirmation is not migration application.
- Sandbox/staging confirmation is not database mutation.
- Sandbox/staging confirmation is not deployment authorization.
- Sandbox/staging confirmation is not runtime activation.
- Sandbox/staging confirmation is not CONTROL_THREAD acceptance.
- Sandbox/staging confirmation must not include production.
- Sandbox/staging confirmation must not expose secrets.
- Any later migration application remains separately routed or manually approved.

## 22. Production exclusion boundary

Production exclusion rule:

- Production is not the first target for A8 motion intake migration application.
- Production migration is not authorized by this lane.
- Production restore is not authorized by this lane.
- Production rollback is not authorized by this lane.
- Production telemetry is not authorized by this lane.
- Production gate opening is not authorized by this lane.
- Production readiness review remains separate if production is ever considered.
- Production must remain `blocked` unless CONTROL_THREAD routes a separate production readiness review with explicit production evidence.

## 23. Authority boundary

Environment definition is descriptive planning only.

It does not create route authority, acceptance authority, execution authority, database mutation authority, deployment authority, GitHub mutation authority, provider/model routing authority, production gate authority, source-of-truth authority, or final CONTROL_THREAD approval.

## 24. Readiness status vocabulary

Required readiness vocabulary:

| Value | Meaning | Allowed use | Disallowed implication | Authorizes migration application? |
| --- | --- | --- | --- | --- |
| `undefined` | No target environment definition exists. | Use when identity and purpose are missing. | Does not imply candidate existence. | No |
| `candidate_only` | A candidate name or category exists but evidence is incomplete. | Use for named local, sandbox, staging, or other candidates with partial evidence. | Does not imply inventory completeness. | No |
| `inventory_known` | Non-secret inventory evidence is documented. | Use when identity, purpose, and basic non-secret facts are known. | Does not imply prechecks are complete. | No |
| `prechecks_required` | Inventory is known, but required prechecks remain incomplete. | Use when backup, rollback, migration history, artifact, or access evidence is missing. | Does not imply confirmation review readiness. | No |
| `ready_for_confirmation_review` | Minimum evidence is documented for a later confirmation review. | Use only before a separate target confirmation review. | Does not imply ready for migration application. | No |
| `blocked` | Candidate is not suitable for this phase or lacks required evidence. | Use for production in this phase or any candidate with blocking gaps. | Does not imply permanent rejection or authority. | No |

No readiness value authorizes migration application. No readiness value authorizes database mutation. No readiness value authorizes deployment. No readiness value authorizes runtime activation. No readiness value authorizes production migration. No readiness value authorizes GitHub mutation. No readiness value authorizes production gate opening.

`ready_for_confirmation_review` means ready for a later review only; it is not ready for migration application.

## 25. Minimum evidence requirements

Minimum evidence before any future sandbox/staging target confirmation review:

- explicit environment identity
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

If any item is missing, the target must remain `prechecks_required` or `blocked`.

## 26. Target-environment precondition checklist

A future candidate must satisfy this checklist before migration application authorization can even be considered:

- [ ] target environment identity confirmed
- [ ] environment purpose confirmed
- [ ] operator/owner confirmed
- [ ] non-secret DB target description recorded
- [ ] DB provider confirmed
- [ ] Prisma/Postgres compatibility confirmed
- [ ] deployed artifact / commit reference confirmed
- [ ] A8 migration present in deployed artifact
- [ ] migration history clean / visible
- [ ] backup exists and restore posture is known
- [ ] rollback path documented
- [ ] maintenance window or downtime expectation confirmed
- [ ] post-migration verification plan exists
- [ ] provider-secret boundary remains intact
- [ ] telemetry boundary remains intact
- [ ] production exclusion confirmed for sandbox/staging review
- [ ] CONTROL_THREAD approval path explicit
- [ ] no deployment authority bundled
- [ ] no GitHub mutation authority bundled
- [ ] no runtime activation bundled

Checklist completion is not migration application.

## 27. Migration application boundary

Environment definition does not apply the A8 migration.

Environment definition does not authorize applying the A8 migration. Environment definition does not make the migration target-ready. Future migration application requires separate target confirmation, backup/rollback evidence, deployed artifact confirmation, migration history review, post-migration verification plan, and CONTROL_THREAD or explicit human approval.

Applying the migration in any environment remains a separately routed or manually approved action.

## 28. Database mutation boundary

Environment definition does not connect to any database.

Environment definition does not mutate any database. Environment definition does not create, alter, drop, seed, or delete tables. Environment definition does not create durable records. Environment definition does not change Prisma migration history. Environment definition does not grant database credentials or access.

## 29. Deployment authorization boundary

Environment definition does not deploy code.

Environment definition does not modify deployment config. Environment definition does not authorize deployment. Environment definition does not authorize Vercel or platform changes. Environment definition does not authorize production changes. Environment definition does not authorize source-of-truth transfer.

## 30. Durable records availability boundary

Durable motion intake records are unavailable in any target environment until the A8 migration is applied there.

Source migration existence does not create records. Environment definition does not create records. Candidate environment definition does not create records.

Future migration application would make the table available only in that specific target environment, if separately authorized and successfully applied. Durable record availability does not make records authoritative.

## 31. Persisted motion authority boundary

Persisted motion authority boundary:

- Persisted motion is not approved work.
- Persisted motion is not routed work.
- Persisted motion is not CONTROL_THREAD acceptance.
- Persisted motion is not autonomous execution.
- Persisted target thread is not route authority.
- Persisted repo target is not repo execution authority.
- Persisted evidence pointer is not validation approval.
- Selected persisted motion basis is not final authority.
- Environment definition does not change any of those semantics.

## 32. CONTROL_THREAD authority separation

CONTROL_THREAD remains authority.

Environment definition is not CONTROL_THREAD acceptance. Candidate environment selection is not CONTROL_THREAD acceptance. Readiness vocabulary is not CONTROL_THREAD acceptance. Migration existence is not CONTROL_THREAD acceptance. Persisted motion records are not CONTROL_THREAD acceptance.

Any future target confirmation or migration application must remain separately routed or manually approved.

## 33. Linear temporary mirror posture

Linear remains temporary mirror only.

Environment definition does not transfer source of truth to Linear. Candidate environment selection does not transfer source of truth to Linear. Persisted motion records do not transfer source of truth to Linear.

Linear mirror posture does not create route authority, acceptance authority, execution authority, production authority, or production gate opening.

## 34. Required findings

Required findings:

- Environment definition is not migration application.
- Environment definition is not database mutation.
- Environment definition is not deployment authorization.
- Environment definition is not runtime activation.
- Environment definition is not production migration.
- Environment definition is not CONTROL_THREAD acceptance.
- Environment definition does not create durable records.
- Environment definition does not authorize GitHub mutation.
- Environment definition does not authorize production gate opening.
- CONTROL_THREAD remains authority.
- Linear remains temporary mirror only.

## 35. Non-authorizations

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
- No final CONTROL_THREAD approval by environment definition.
- No final CONTROL_THREAD approval by candidate environment selection.
- No final CONTROL_THREAD approval by readiness vocabulary.
- No final CONTROL_THREAD approval by persisted motion.
- No route authority by environment definition.
- No route authority by candidate environment selection.
- No route authority by readiness vocabulary.
- No route authority by persisted motion.
- No route authority by persisted target thread.
- No route authority by persisted repo target.
- No execution authority by environment definition.
- No execution authority by candidate environment selection.
- No execution authority by readiness vocabulary.
- No execution authority by persisted motion.
- No execution authority by persisted target thread.
- No execution authority by persisted repo target.
- No production gate authority by environment definition.
- No production gate authority by candidate environment selection.
- No production gate authority by readiness vocabulary.
- No production gate authority by persisted motion.

## 36. Risks and follow-ups

Risks:

- A named environment could be mistaken for migration approval.
- `ready_for_confirmation_review` could be mistaken for ready to migrate.
- Database target descriptions could accidentally include secrets if operators do not follow the non-secret rule.
- Production could be considered too early without a separate production readiness route.
- Durable record availability could be mistaken for persisted motion authority.
- Linear mirror posture could be mistaken for source-of-truth transfer.

Follow-ups:

- Define a candidate sandbox/staging environment using this template only if one exists.
- Gather non-secret database target, backup, rollback, migration history, artifact, operator access, and verification evidence.
- Keep production excluded until a separate CONTROL_THREAD production readiness review exists.
- Preserve A8-A12 non-authority boundaries.

## 37. Recommended next decision path

Recommended next decision path:

1. CONTROL_THREAD acceptance of this environment definition artifact.
2. Separate sandbox/staging target definition using this template, only if a candidate environment exists.
3. Separate sandbox/staging target confirmation review after evidence is complete.
4. Separate migration application authorization route only after target identity, DB target, backup, rollback, operator access, migration history, deployed artifact, and post-migration verification are confirmed.
5. Separate post-migration verification route.
6. Separate production readiness route only if production is ever considered.

Possible future routes:

- `Q3M7 Motion Intake Sandbox Target Definition v0`
- `Q3M7 Motion Intake Sandbox Target Confirmation v0`
- `Q3M7 Motion Intake Migration Application Authorization v0`
- `Q3M7 Motion Intake Post-Migration Verification Plan v0`
- `Q3M7 Persisted Motion Lifecycle Boundary Plan v0`

These are recommendations only. They are not approved by this plan.

## 38. Validation plan

Validation plan:

- Confirm this is a static docs/reference artifact.
- Confirm no runtime/source behavior changed.
- Confirm no migration was applied.
- Confirm no route behavior changed.
- Confirm no UI behavior changed.
- Confirm no secret values were copied into the artifact.
- Confirm required readiness vocabulary is present.
- Confirm required findings are present.
- Confirm required non-authorizations are present.
- Run `git diff --check`.
- Run `git diff --cached --check`.
- Run phrase checks for required environment definition findings.
- Run phrase checks for readiness vocabulary.
- Run phrase checks for required non-authorizations.
- Run a conservative secret-looking-value scan on this artifact and manually review any hits.

## 39. ZERO GATES GRANTED

ZERO GATES GRANTED.

This artifact grants no migration application, database mutation, deployment authorization, runtime activation, production migration, GitHub mutation, production gate opening, source-of-truth transfer, provider/model routing authority, route authority, execution authority, acceptance authority, durable record authority, or final CONTROL_THREAD approval.
