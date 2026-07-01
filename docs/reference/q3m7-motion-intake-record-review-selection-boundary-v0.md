# Q3M7 Motion Intake Record Review / Selection Boundary v0

## 1. Role

Role: JAI::DEV::BUILDER

## 2. Program / batch / wave / lane

- Program: Q3M7Y26 JAI Motion Control Plane Activation v0
- Batch: A
- Wave: A-E
- Lane: A9
- Repo: `dev-jai-nexus`
- Thread: `2026-06-21_dev-jai-nexus`

## 3. Scope

This boundary review covers the accepted A8 durable motion intake persistence baseline for native operator-created Control Thread and Repo Thread motions in `dev.jai.nexus`.

This is a static review artifact only. It does not modify runtime behavior, source behavior, migrations, persistence behavior, route behavior, UI behavior, provider dispatch, GitHub behavior, production gates, source-of-truth records, or autonomous execution.

ZERO GATES GRANTED.

## 4. Reviewed baseline

Reviewed A8 baseline:

- A8 added durable motion intake records for operator-created native motions.
- A8 preserved A1 motion kernel, A2 manual deliberation adapter, A3 secure provider connector, A4 deliberation run history persistence, A5 operator deliberation action surface, A6 approval/draft surface, and A7 native motion intake composer.
- A8 added persisted motion basis selection for manual deliberation and approval/draft generation.
- A8 preserved provider-secret non-persistence and non-exposure.
- A8 preserved CONTROL_THREAD authority separation.
- A8 preserved Linear as a temporary mirror only.
- A8 did not authorize migration application in any target environment.

## 5. Files reviewed

Reviewed files:

| Area | Repo-relative file |
| --- | --- |
| Prisma schema | `portal/prisma/schema.prisma` |
| Motion intake migration | `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql` |
| Motion intake types and helpers | `portal/src/lib/controlPlane/motionKernel/types.ts` |
| Motion intake basis builder | `portal/src/lib/controlPlane/motionKernel/motion-intake.ts` |
| Server-only persistence helper | `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts` |
| Motion kernel exports | `portal/src/lib/controlPlane/motionKernel/index.ts` |
| Operator page integration | `portal/src/app/operator/motion-control/page.tsx` |
| Native motion composer / selection UI | `portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx` |
| Motion intake GET/POST route | `portal/src/app/operator/motion-control/motion-intake/route.ts` |
| Manual deliberation selected basis | `portal/src/app/operator/motion-control/ManualDeliberationAction.tsx` |
| Approval/draft selected basis | `portal/src/app/operator/motion-control/MotionApprovalDraftSurface.tsx` |

`docs/reference/README.md` was not present in this repo state, so no reference index update was required.

## 6. Review purpose

This review records safe-use boundaries for persisted motion intake records before any richer lifecycle, target-environment migration application, downstream route use, work-packet execution, autonomous execution, GitHub mutation, PR automation, source-of-truth transfer, or production gate behavior.

The review purpose is boundary confirmation only. It is not implementation approval, route approval, migration approval, acceptance approval, runtime activation, production approval, or gate opening.

## 7. A8 persistence schema review

The A8 schema adds `MotionIntakeRecord` in `portal/prisma/schema.prisma`.

Reviewed persisted fields include:

| Field class | Fields |
| --- | --- |
| Identity and timestamps | `id`, `createdAt`, `updatedAt` |
| Intake content | `title`, `proposer`, `purpose`, `scope`, `requestedOutcome`, `risks`, `constraints` |
| Context only | `targetThread`, `repoTarget` |
| Metadata/reference | `evidencePointers`, `nonAuthorizations` |
| Boundary state | `intakeState`, `authorityState`, `advisoryOnly`, `safeAdvisoryMessage` |

Boundary finding: the schema records operator-created motion intake metadata. It does not include provider API keys, GitHub credentials, branch mutation fields, PR mutation fields, route execution authority fields, production gate authority fields, or source-of-truth transfer fields.

## 8. Migration readiness boundary

The migration exists in source at `portal/prisma/migrations/20260701120000_add_motion_intake_records/migration.sql`.

The migration creates `MotionIntakeRecord` and indexes `createdAt`, `targetThread`, `repoTarget`, `intakeState`, and `authorityState`.

Required migration posture:

- The migration exists in source.
- Target-environment migration application is not authorized by this lane.
- The target-environment migration application is not authorized by this review artifact.
- Target-environment migration readiness/application must remain separately routed or manually approved.
- Durable records are unavailable in any target environment until the migration is applied there.
- This review does not apply the migration.
- This review does not authorize production migration.
- This review does not authorize production gate opening.
- This review does not authorize runtime activation.

## 9. Motion intake GET/POST route review

The A8 route is `portal/src/app/operator/motion-control/motion-intake/route.ts`.

Route behavior reviewed:

| Method | Reviewed behavior | Boundary |
| --- | --- | --- |
| `GET` | Lists recent safe motion intake records and builds motion bases from records. | Listing is operator-visible review context only. |
| `POST` | Accepts a `MotionIntakeDraft`, builds a persistable intake record, persists it through the server helper, and returns a safe motion basis. | Creation is explicit operator intake only; it is not routing, approval, execution, GitHub mutation, or gate opening. |

The route returns non-authorizations. It does not return provider API keys, full env objects, credential-bearing provider config, GitHub credentials, branch mutation authority, or production gate authority.

## 10. Server-only persistence helper review

The A8 helper is `portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts`.

Review findings:

- The module imports `server-only`.
- It uses the existing Prisma raw SQL pattern to insert and list `MotionIntakeRecord` rows.
- It persists `evidencePointers` and `nonAuthorizations` as JSON metadata.
- It forces `authorityState` to `non_authoritative` and `advisoryOnly` to `true`.
- It returns a blocked preview record if the table or database access is unavailable.
- It does not persist provider API keys.
- It does not expose provider API keys to client components.
- It does not route work, execute work packets, mutate GitHub, create PRs, mutate branches, merge, delete branches, open production gates, or transfer source of truth.

## 11. Persisted motion record semantics

Persisted motion intake records are durable intake metadata only.

Required findings:

- Persisted motion is not approved work.
- Persisted motion is not routed work.
- Persisted motion is not CONTROL_THREAD acceptance.
- Persisted motion is not autonomous execution.
- Persisted target thread is not route authority.
- Persisted repo target is not repo execution authority.
- Persisted evidence pointer is not validation approval.
- Selected persisted motion basis is not final authority.
- CONTROL_THREAD remains authority.
- Linear remains a temporary mirror only.

## 12. Selected persisted motion basis semantics

Selecting a persisted motion is an operator UI basis selection only.

Required selected-motion-basis boundary:

- Selecting a persisted motion does not submit to agents.
- Selecting a persisted motion does not run deliberation.
- Selecting a persisted motion does not route work.
- Selecting a persisted motion does not execute work packets.
- Selecting a persisted motion does not mutate GitHub.
- Selecting a persisted motion does not create PRs, branches, merges, or deletions.
- Selecting a persisted motion does not open production gates.
- Selecting a persisted motion does not create CONTROL_THREAD acceptance.
- Selecting a persisted motion does not create final authority.

## 13. Deliberation-basis boundary

`NativeMotionIntakeComposer.tsx` passes the selected motion list and selected motion id to `ManualDeliberationAction.tsx`.

Boundary review:

- Persisted motion can become the selected basis for manual deliberation.
- Manual deliberation remains operator-triggered only.
- Persisted motion selection does not auto-submit to agents.
- Persisted motion selection does not auto-run deliberation.
- Persisted motion selection does not auto-route work.
- Persisted motion selection does not execute work packets.
- Persisted motion selection does not mutate GitHub.
- Persisted motion selection does not open production gates.

## 14. Approval/draft-basis boundary

`NativeMotionIntakeComposer.tsx` passes the selected motion list and selected motion id to `MotionApprovalDraftSurface.tsx`.

Boundary review:

- Persisted motion can become the selected basis for approval/draft generation.
- Draft output remains copyable planning text only.
- Draft work packet is not routed work.
- Draft route packet is not CONTROL_THREAD acceptance.
- Closeout placeholder is not closeout.
- Evidence pointer is not validation approval.
- Draft output does not create route authority, acceptance authority, execution authority, GitHub mutation authority, production gate authority, or source-of-truth transfer.

## 15. Target thread context-only boundary

Persisted `targetThread` is review context only.

Supported target thread values remain the A7/A8 role-slot vocabulary:

- `JAI_CONTROL_THREAD`
- `JAI_ORCHESTRATOR_NEXUS`
- `JAI_DEV_JAI_NEXUS`
- `JAI_AUDIT_NEXUS`
- `JAI_FORMAT`
- `JAI_REPO_GENERIC`

Persisted target thread is not route authority. Persisted target thread is not execution authority. Persisted target thread is not CONTROL_THREAD acceptance.

## 16. Repo target context-only boundary

Persisted `repoTarget` is intended review context only.

Persisted repo target is not repo execution authority. Persisted repo target does not authorize repo access, branch creation, PR creation, merge action, branch deletion, GitHub mutation, work-packet execution, or production gate opening.

## 17. Evidence pointer metadata/reference boundary

Persisted evidence pointers are metadata/reference only.

Boundary review:

- Persisted evidence pointer is not validation approval.
- Evidence pointer storage does not crawl evidence.
- Evidence pointer storage does not validate evidence.
- Evidence pointer storage does not mutate evidence.
- Evidence pointer storage does not transfer source of truth.
- Evidence pointer storage does not create CONTROL_THREAD acceptance.

## 18. Non-authorizations visibility

A8 visibly preserves non-authorizations through:

- `MOTION_INTAKE_NON_AUTHORIZATIONS` in `portal/src/lib/controlPlane/motionKernel/motion-intake.ts`
- route `nonAuthorizations` in `portal/src/app/operator/motion-control/motion-intake/route.ts`
- operator-facing cards and persisted record list in `NativeMotionIntakeComposer.tsx`
- persisted `nonAuthorizations` JSON in `MotionIntakeRecord`

Required non-authorizations remain visible:

- No autonomous execution.
- No GitHub mutation.
- No PR creation.
- No branch mutation.
- No merge action.
- No branch deletion.
- No production gate opening.
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
- No final CONTROL_THREAD approval by motion intake.
- No final CONTROL_THREAD approval by selected motion basis.
- No route authority by persisted motion.
- No route authority by persisted target thread.
- No route authority by persisted repo target.
- No execution authority by persisted motion.
- No execution authority by persisted target thread.
- No execution authority by persisted repo target.
- No production gate authority by persisted motion.
- No production gate authority by selected motion basis.

## 19. Provider-secret boundary

Provider-secret boundary findings:

- Provider API keys are not persisted in motion intake records.
- Provider API keys are not exposed to client components by persisted motion selection.
- Provider API keys are not returned by the motion intake route.
- Provider API keys are not included in draft outputs.
- `JAI_MODEL_SLOT_API_KEY` remains server-side only.
- Persisted motion records must not contain full env objects.
- Persisted motion records must not contain credential-bearing provider config.

This review does not authorize provider dispatch, provider credential exposure, provider credential persistence, or client-side provider-key handling.

## 20. Linear temporary mirror posture

Linear remains a temporary mirror only.

Persisted motion intake records do not transfer source of truth to Linear, GitHub, `dev.jai.nexus`, a persisted record, a selected motion basis, or a draft packet.

Linear mirror status does not create acceptance authority, route authority, execution authority, validation approval, production authority, or gate opening.

## 21. CONTROL_THREAD authority separation

CONTROL_THREAD remains authority.

Persisted motion is not CONTROL_THREAD acceptance. Motion intake is not CONTROL_THREAD acceptance. Selected persisted motion basis is not final authority. Draft route packet is not CONTROL_THREAD acceptance.

This review does not create CONTROL_THREAD approval, replace CONTROL_THREAD, mutate CONTROL_THREAD records, or transfer CONTROL_THREAD authority.

## 22. Required findings

Required findings are recorded as follows:

| Finding | Status |
| --- | --- |
| Persisted motion is not approved work. | Recorded |
| Persisted motion is not routed work. | Recorded |
| Persisted motion is not CONTROL_THREAD acceptance. | Recorded |
| Persisted motion is not autonomous execution. | Recorded |
| Persisted target thread is not route authority. | Recorded |
| Persisted repo target is not repo execution authority. | Recorded |
| Persisted evidence pointer is not validation approval. | Recorded |
| Selected persisted motion basis is not final authority. | Recorded |
| Persisted motion selection does not auto-submit to agents. | Recorded |
| Persisted motion selection does not auto-run deliberation. | Recorded |
| Persisted motion selection does not auto-route work. | Recorded |
| Persisted motion selection does not execute work packets. | Recorded |
| Persisted motion selection does not mutate GitHub. | Recorded |
| Persisted motion selection does not open production gates. | Recorded |
| CONTROL_THREAD remains authority. | Recorded |
| Linear remains a temporary mirror only. | Recorded |

## 23. Blocked routes

Blocked by this boundary review:

- Richer persisted motion lifecycle activation without a separate route.
- Target-environment migration application without separate routing or manual approval.
- Downstream route use without separate boundary review.
- Work-packet execution.
- Autonomous execution.
- GitHub mutation.
- PR automation.
- Branch creation, branch mutation, merge action, or branch deletion.
- Source-of-truth transfer.
- Runtime activation.
- Production migration approval.
- Production gate opening.

## 24. Risks and remaining blockers

Risks:

- Persisted motion records could be mistaken for approved work.
- Persisted motion records could be mistaken for routed work.
- Selected persisted motion basis could be mistaken for final authority.
- Persisted target thread could be mistaken for route authority.
- Persisted repo target could be mistaken for repo execution authority.
- Persisted evidence pointer could be mistaken for validation approval.
- Migration existence in source could be mistaken for target-environment migration approval.
- Durable persistence could be mistaken for source-of-truth transfer.
- Linear mirror posture could be mistaken for source of truth.

Remaining blockers:

- Target-environment migration application requires separate routing or manual approval.
- Richer lifecycle state transitions require separate boundary review.
- Downstream draft use beyond copyable planning text requires separate review.
- Any work-packet execution, GitHub mutation, PR automation, runtime activation, production migration, or production gate behavior remains blocked.

## 25. Recommended next routes

Recommended next routes only; none are approved by this artifact:

- `Q3M7 Motion Intake Migration Readiness Review v0`
- `Q3M7 Persisted Motion Lifecycle Boundary Plan v0`
- `Q3M7 Persisted Motion Audit Review v0`
- `Q3M7 Persisted Motion Downstream Draft Use Review v0`

## 26. Validation plan

Validation for this docs-only review should confirm:

- The artifact exists at `docs/reference/q3m7-motion-intake-record-review-selection-boundary-v0.md`.
- The artifact records the A8 schema, migration, route, persistence helper, and selection boundaries.
- Required findings are present.
- Required migration posture is present.
- Required provider-secret boundary is present.
- Required selected-motion-basis boundary is present.
- Required non-authorizations are present.
- Migration application is not authorized.
- Runtime activation is not authorized.
- GitHub mutation authority is not added.
- Production gate authority is not added.
- CONTROL_THREAD authority remains explicit.
- Linear remains a temporary mirror only.

Planned validation commands:

```bash
git diff --check
git diff --cached --check
grep -R "Persisted motion is not approved work\|Persisted motion is not routed work\|Persisted motion is not CONTROL_THREAD acceptance\|Persisted target thread is not route authority\|Persisted repo target is not repo execution authority\|Selected persisted motion basis is not final authority\|CONTROL_THREAD remains authority\|Linear remains a temporary mirror" -n docs/reference/q3m7-motion-intake-record-review-selection-boundary-v0.md
grep -R "target-environment migration application is not authorized\|does not authorize production migration\|does not authorize runtime activation\|No GitHub mutation\|No production gate" -n docs/reference/q3m7-motion-intake-record-review-selection-boundary-v0.md
```

## 27. ZERO GATES GRANTED

ZERO GATES GRANTED.

This review does not grant readiness approval, route authority, acceptance authority, execution authority, runtime activation, GitHub mutation authority, PR automation, source-of-truth transfer, production authority, migration application authority, or production gate opening.
