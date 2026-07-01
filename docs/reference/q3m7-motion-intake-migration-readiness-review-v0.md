# Q3M7 Motion Intake Migration Readiness Review v0

## 1. Role

Role: JAI::DEV::BUILDER

## 2. Program / batch / wave / lane

- Program: Q3M7Y26 JAI Motion Control Plane Activation v0
- Batch: A
- Wave: A-E
- Lane: A10
- Repo: `dev-jai-nexus`
- Thread: `2026-06-21_dev-jai-nexus`

## 3. Scope

This artifact statically reviews migration readiness for the accepted A8 durable motion intake persistence migration.

This is a review-only artifact. It does not apply migrations, modify runtime behavior, modify source behavior, add migrations, add persistence behavior, add route behavior, add UI behavior, activate runtime behavior, authorize target-environment migration application, authorize production migration, authorize GitHub mutation, or authorize production gates.

ZERO GATES GRANTED.

## 4. Reviewed baseline

Reviewed baseline:

- A8 introduced durable motion intake persistence for operator-created native motion records.
- A8 added the `MotionIntakeRecord` schema in `portal/prisma/schema.prisma`.
- A8 added the source migration at `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql`.
- A8 added server-only persistence helpers in `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts`.
- A8 added the explicit operator route at `portal/src/app/operator/motion-control/motion-intake/route.ts`.
- A8 preserved persisted motion records as non-authoritative intake metadata.
- A9 reviewed persisted record selection boundaries in `docs/reference/q3m7-motion-intake-record-review-selection-boundary-v0.md`.

## 5. Files reviewed

| Area | Repo-relative file |
| --- | --- |
| Prisma schema | `portal/prisma/schema.prisma` |
| A8 migration | `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql` |
| Motion intake helpers | `portal/src/lib/controlPlane/motionKernel/motion-intake.ts` |
| Server-only persistence helper | `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts` |
| Motion intake types | `portal/src/lib/controlPlane/motionKernel/types.ts` |
| Motion kernel exports | `portal/src/lib/controlPlane/motionKernel/index.ts` |
| Motion intake route | `portal/src/app/operator/motion-control/motion-intake/route.ts` |
| Operator motion-control page | `portal/src/app/operator/motion-control/page.tsx` |
| Native motion intake composer | `portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx` |
| A9 boundary review | `docs/reference/q3m7-motion-intake-record-review-selection-boundary-v0.md` |

`docs/reference/README.md` was not present in this repository state, so no docs/reference index update is required for this lane.

## 6. Review purpose

This review records whether and how the A8 motion intake persistence migration may be considered for a future target-environment application decision.

The review purpose is readiness framing only. Migration application is not authorized by this review. Production migration is not authorized by this review. Runtime activation is not authorized by this review.

## 7. Migration reviewed

Migration reviewed:

`portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql`

The migration creates `MotionIntakeRecord` with text fields for intake identity/content/context, JSONB fields for `evidencePointers` and `nonAuthorizations`, `advisoryOnly` defaulting to `true`, `safeAdvisoryMessage`, and indexes for `createdAt`, `targetThread`, `repoTarget`, `intakeState`, and `authorityState`.

Migration exists in source.

Migration application is not authorized by this review.

## 8. A8 `MotionIntakeRecord` schema review

The A8 schema in `portal/prisma/schema.prisma` defines `MotionIntakeRecord` with:

| Field class | Fields reviewed |
| --- | --- |
| Identity and timestamps | `id`, `createdAt`, `updatedAt` |
| Operator-created intake content | `title`, `proposer`, `purpose`, `scope`, `requestedOutcome`, `risks`, `constraints` |
| Context-only fields | `targetThread`, `repoTarget` |
| Metadata/reference fields | `evidencePointers`, `nonAuthorizations` |
| Authority boundary fields | `intakeState`, `authorityState`, `advisoryOnly`, `safeAdvisoryMessage` |

The schema does not add provider API key fields, GitHub credential fields, branch mutation fields, PR mutation fields, execution authority fields, production gate fields, or source-of-truth transfer fields.

## 9. Existing Prisma/Postgres persistence posture

The repository uses Prisma with a PostgreSQL datasource in `portal/prisma/schema.prisma`.

The A8 persistence helper uses the same app-local Prisma posture:

- `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts` imports `server-only`.
- It uses `prisma.$executeRaw` for insert and `prisma.$queryRaw` for list.
- It stores `evidencePointers` and `nonAuthorizations` as JSON metadata.
- It forces `authorityState` to `non_authoritative` and `advisoryOnly` to `true`.
- It returns a safe blocked preview if table/database access is unavailable.

This posture supports a future separately authorized migration-readiness decision, but it does not itself authorize any target-environment migration application.

## 10. Target-environment assumptions

Assumptions that must be checked before any future separately authorized migration application:

- Target environment identity is known.
- Database provider and connection target are confirmed.
- Current deployed commit and schema baseline are known.
- A8 source migration is present in the deployed artifact.
- Prisma migration history is clean.
- A current database backup exists.
- Rollback path is documented.
- Maintenance window or explicit operator approval requirements are known.
- Development, sandbox/staging, and production environment boundaries are clear.
- Durable motion intake records are operationally required in that target environment.
- Existing fallback behavior is acceptable if the migration is not applied.

This artifact does not claim these assumptions are satisfied. Repository evidence proves the source migration exists; it does not prove any target-environment readiness state.

## 11. Required migration prechecks

Recommended prechecks for a future separately authorized migration application:

- Confirm target environment.
- Confirm current `main` commit and migration set.
- Confirm database connection target.
- Confirm Prisma migration status.
- Confirm backup availability.
- Confirm rollback plan.
- Confirm operator downtime/maintenance expectations.
- Confirm no provider secrets are involved.
- Confirm no GitHub mutation or deployment authority is bundled into migration application.
- Confirm CONTROL_THREAD or explicit human approval before application.

These prechecks are review recommendations only. They are not authorization to execute environment commands.

## 12. Backup / rollback considerations

Backup and rollback considerations before any future separately authorized application:

- A database backup should exist before migration application.
- A rollback plan should exist before migration application.
- Rollback may require database restore or manual migration rollback depending on target-environment policy.
- Rollback scope should distinguish schema rollback from data retention decisions for any persisted motion intake records.
- Operator approval should confirm whether downtime or maintenance windows are required.
- No destructive rollback is authorized by this lane.
- No production restore is authorized by this lane.
- No production migration is authorized by this lane.
- No runtime activation is authorized by this lane.

This artifact intentionally avoids executable production commands.

## 13. Development / sandbox / production boundary

Development / sandbox / production posture:

| Environment class | Review posture |
| --- | --- |
| Local development | Local review of source migration is allowed by this lane. |
| Sandbox/staging | Sandbox/staging migration application is not authorized by this lane. |
| Production | Production migration application is not authorized by this lane. |

Production gate opening is not authorized by this lane.

Any target-environment application must remain separately routed or manually approved.

## 14. Durable record availability boundary

Durable records are unavailable in any target environment until migration is applied there.

If the target database does not have `MotionIntakeRecord`, A8 helper behavior returns a blocked preview record with a safe advisory message. That fallback is operator-visible boundary behavior, not durable persistence.

Applying the migration would make the durable table available in that target environment, but applying the migration would not make persisted motions approved work, routed work, CONTROL_THREAD acceptance, autonomous execution, route authority, execution authority, GitHub mutation authority, or production gate authority.

## 15. Operator surface dependency review

The operator surface in `portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx` can display:

- sample motion option
- local composed motion option
- persisted motion options
- selected motion source
- persisted record count
- persistence status
- target thread
- repo target
- non-authorizations

The operator surface depends on persisted records only when the target environment has the migration applied and the server-only helper can access the table. If unavailable, fallback preview behavior remains non-authoritative.

Persisted motion selection remains non-executing.

## 16. Persistence status and fallback behavior

A8 fallback behavior reviewed:

- Insert failure returns the requested record with `intakeState: "draft"`, `authorityState: "non_authoritative"`, `advisoryOnly: true`, and a safe blocked persistence message.
- List failure returns a `motion-intake-persistence-blocked-preview` record.
- Fallback does not route work.
- Fallback does not execute work packets.
- Fallback does not mutate GitHub.
- Fallback does not open production gates.

This review does not alter fallback behavior.

## 17. Provider-secret boundary

Provider-secret boundary findings:

- Provider API keys are not persisted by the motion intake migration.
- Provider API keys are not exposed to client components by migration application.
- Provider API keys are not returned by persisted motion routes.
- Provider API keys are not included in persisted motion records.
- Provider API keys are not included in draft outputs.
- `JAI_MODEL_SLOT_API_KEY` remains server-side only.
- Persisted motion records must not contain full env objects.
- Persisted motion records must not contain credential-bearing provider config.

Migration application, if separately authorized in the future, must not be bundled with provider secret exposure, provider dispatch, or provider credential storage.

## 18. Persisted motion non-authoritative semantics

Persisted motion authority boundary:

- Persisted motion is not approved work.
- Persisted motion is not routed work.
- Persisted motion is not CONTROL_THREAD acceptance.
- Persisted motion is not autonomous execution.
- Persisted target thread is not route authority.
- Persisted repo target is not repo execution authority.
- Persisted evidence pointer is not validation approval.
- Selected persisted motion basis is not final authority.
- Applying the migration does not change any of those semantics.

## 19. CONTROL_THREAD authority separation

CONTROL_THREAD remains authority.

Migration readiness review is not CONTROL_THREAD acceptance. Migration existence is not CONTROL_THREAD acceptance. Persisted motion records are not CONTROL_THREAD acceptance. Selected persisted motion basis is not final authority.

This review does not grant final CONTROL_THREAD approval by persisted motion, migration application, motion intake, or selected motion basis.

## 20. Linear temporary mirror posture

Linear remains a temporary mirror only.

Migration readiness does not transfer source of truth to Linear. Applying the migration in a future separately authorized target environment would not transfer source of truth to Linear, GitHub, `dev.jai.nexus`, persisted motion records, selected motion basis, or draft outputs.

Linear mirror posture does not create route authority, acceptance authority, execution authority, production authority, or production gate opening.

## 21. Application boundary

Application boundary:

- The migration exists in source.
- Target-environment migration application is not authorized by this lane.
- Target-environment migration readiness/application must remain separately routed or manually approved.
- Durable records are unavailable in any target environment until the migration is applied there.
- This review does not apply the migration.
- This review does not authorize production migration.
- This review does not authorize production gate opening.
- This review does not authorize runtime activation.
- This review does not authorize schema changes beyond the already accepted source migration.
- This review does not authorize any environment command execution.

## 22. Required findings

Required findings:

| Finding | Status |
| --- | --- |
| Migration exists in source. | Recorded |
| Migration application is not authorized by this review. | Recorded |
| Production migration is not authorized by this review. | Recorded |
| Runtime activation is not authorized by this review. | Recorded |
| Durable records are unavailable in any target environment until migration is applied there. | Recorded |
| Applying the migration would not make persisted motions approved work. | Recorded |
| Applying the migration would not make persisted motions routed work. | Recorded |
| Applying the migration would not make persisted motions CONTROL_THREAD acceptance. | Recorded |
| Applying the migration would not authorize auto-run deliberation. | Recorded |
| Applying the migration would not authorize auto-route work. | Recorded |
| Applying the migration would not authorize work-packet execution. | Recorded |
| Applying the migration would not authorize GitHub mutation. | Recorded |
| Applying the migration would not authorize production gate opening. | Recorded |
| CONTROL_THREAD remains authority. | Recorded |
| Linear remains a temporary mirror only. | Recorded |

## 23. Blocked routes

Blocked by this review:

- Target-environment migration application without separate routing or manual approval.
- Production migration.
- Runtime activation.
- Schema changes beyond the already accepted A8 source migration.
- Environment command execution.
- GitHub mutation.
- PR creation.
- Branch mutation.
- Merge action.
- Branch deletion.
- Work-packet execution.
- Auto-submit to agents.
- Auto-run deliberation.
- Auto-route work.
- Source-of-truth transfer.
- Production gate opening.

## 24. Risks and follow-ups

Risks:

- Migration existence in source could be mistaken for target-environment migration approval.
- Applying the migration could be mistaken for persisted motion approval.
- Durable records could be mistaken for routed work.
- Persisted target thread could be mistaken for route authority.
- Persisted repo target could be mistaken for repo execution authority.
- Persisted evidence pointer could be mistaken for validation approval.
- Production migration could be mistakenly bundled with runtime activation.
- Linear mirror posture could be mistaken for source-of-truth transfer.

Follow-ups:

- Identify the target environment before any application decision.
- Confirm backup and rollback path before any application decision.
- Confirm migration status before any application decision.
- Confirm CONTROL_THREAD or explicit human approval before any application decision.
- Keep production readiness separate from sandbox/staging readiness.

## 25. Recommended next decision path

Recommended bounded path only; none of these steps are approved by this review:

1. CONTROL_THREAD acceptance of this readiness artifact.
2. Separate target-environment identification.
3. Separate migration application authorization decision.
4. Separate backup/rollback confirmation.
5. Separate sandbox/staging application, if authorized.
6. Separate post-migration verification route.
7. Separate production readiness review, if production is ever considered.

Possible next routes:

- `Q3M7 Motion Intake Target Environment Identification v0`
- `Q3M7 Motion Intake Migration Application Authorization v0`
- `Q3M7 Motion Intake Post-Migration Verification Plan v0`
- `Q3M7 Persisted Motion Lifecycle Boundary Plan v0`

## 26. Validation plan

Validation for this docs-only review should confirm:

- The artifact exists at `docs/reference/q3m7-motion-intake-migration-readiness-review-v0.md`.
- A8 migration is reviewed.
- A8 `MotionIntakeRecord` schema is reviewed.
- Existing Prisma/Postgres persistence posture is reviewed.
- Target-environment dependency assumptions are recorded.
- Required migration prechecks are recorded.
- Required backup / rollback considerations are recorded.
- Development vs sandbox vs production boundary is recorded.
- Durable record availability after migration is recorded.
- Operator surface dependency on persisted records is recorded.
- Persistence status and fallback behavior is recorded.
- Provider-secret non-persistence and non-exposure are recorded.
- Persisted motion non-authoritative semantics are recorded.
- CONTROL_THREAD authority separation is recorded.
- Linear temporary mirror posture is recorded.
- Migration application is not authorized.
- Production migration is not authorized.
- Runtime activation is not authorized.
- No source behavior changed.
- No migration was applied.

Planned validation commands:

```bash
git diff --check
git diff --cached --check
rg "Migration application is not authorized|Production migration is not authorized|Runtime activation is not authorized|Durable records are unavailable|Applying the migration would not make persisted motions approved work|Applying the migration would not authorize GitHub mutation|Applying the migration would not authorize production gate opening|CONTROL_THREAD remains authority|Linear remains a temporary mirror" docs/reference/q3m7-motion-intake-migration-readiness-review-v0.md
rg "No autonomous execution|No GitHub mutation|No production migration authorization|No runtime activation|No production gate opening|No source-of-truth transfer|No work-packet execution|No auto-run deliberation|No auto-route work" docs/reference/q3m7-motion-intake-migration-readiness-review-v0.md
```

## 27. ZERO GATES GRANTED

ZERO GATES GRANTED.

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
- No final CONTROL_THREAD approval by persisted motion.
- No final CONTROL_THREAD approval by migration application.
- No final CONTROL_THREAD approval by selected motion basis.
- No route authority by persisted motion.
- No route authority by persisted target thread.
- No route authority by persisted repo target.
- No execution authority by persisted motion.
- No execution authority by persisted target thread.
- No execution authority by persisted repo target.
- No production gate authority by persisted motion.
- No production gate authority by migration application.
- No production gate authority by selected motion basis.
