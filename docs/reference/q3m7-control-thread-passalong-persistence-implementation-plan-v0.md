# Q3M7 Control Thread Passalong Persistence Implementation Plan v0

## Role

Role: JAI::DEV::BUILDER

## Program / batch / wave / lane

Program: Q3M7Y26 JAI Motion Control Plane Activation v0

Batch: A

Wave: A-I

Lane: A22

## Scope

Scope: Q3M7 Control Thread Passalong Persistence Implementation Plan v0.

This artifact is implementation planning only for possible future durable app-local non-authoritative Control Thread passalong records. It does not change application source, Prisma schema, migrations, databases, runtime behavior, provider calls, secrets, telemetry, GitHub behavior, target-repo imports, sandbox runtime, JAI Agents, Agent PR Factory, production gates, background cleanup, automatic deletion, automatic passalong sending, or automatic route execution.

## Reviewed baseline

The plan builds from the accepted A16 through A21 baseline:

- A16 local/static JAI_Control_Thread memory and passalong-router prototype.
- A17 boundary review confirming the prototype is advisory, static, non-authoritative, non-executing, and operator-visible only.
- A18 persistence planning artifact for possible future app-local non-authoritative records.
- A19 candidate schema-design artifact for `ControlThreadPassalongRecord` / `control_thread_passalong_records`.
- A20 data minimization review for candidate fields.
- A21 retention policy planning artifact for app-local lifecycle boundaries.

## Reviewed files

Reviewed A16 implementation files:

- `portal/src/lib/controlPlane/threadMemory/types.ts`
- `portal/src/lib/controlPlane/threadMemory/sample-data.ts`
- `portal/src/lib/controlPlane/threadMemory/passalong-router.ts`
- `portal/src/lib/controlPlane/threadMemory/index.ts`
- `portal/src/app/operator/control-thread/page.tsx`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`

Reviewed A17 through A21 planning and boundary artifacts:

- `docs/reference/q3m7-control-thread-passalong-router-boundary-review-v0.md`
- `docs/reference/q3m7-control-thread-passalong-persistence-plan-v0.md`
- `docs/reference/q3m7-control-thread-passalong-persistence-schema-design-v0.md`
- `docs/reference/q3m7-control-thread-passalong-data-minimization-review-v0.md`
- `docs/reference/q3m7-control-thread-passalong-retention-policy-plan-v0.md`

No `docs/reference/README.md` file is present, so no docs/reference index update is required for this lane.

## Implementation-plan purpose

This plan may identify:

- safest future implementation sequence
- likely source areas requiring future review
- candidate schema/migration route dependencies
- candidate validation and secret-scan requirements
- UI/UX boundary requirements
- retention/archive/delete implementation boundaries
- required future gates before source changes

This plan must not:

- implement persistence
- mutate Prisma schema
- create migration
- mutate database
- authorize persistence
- authorize background cleanup
- authorize automatic deletion
- authorize automatic passalong sending
- authorize automatic routing
- transfer source of truth
- create CONTROL_THREAD acceptance
- create route authority
- create execution authority
- activate sandbox-nexus
- activate JAI Agents
- mutate GitHub
- import target-repo code
- open production gates

## A16/A17/A18/A19/A20/A21 baseline summary

A16 provides static TypeScript records and pure helpers for thread memory, passalong queues, deterministic route recommendation text, and copyable passalong packet text. The `/operator/control-thread` surface provides local operator selection and display only.

A17 confirms the A16 prototype is advisory, non-authoritative, non-executing, static/sample-data based, not persistent memory, not route authority, not CONTROL_THREAD acceptance, not automatic routing, not sandbox activation, not JAI Agent activation, not Agent PR Factory activation, not GitHub mutation, not target-repo adoption, and not production gate opening.

A18 plans possible durable app-local memory only as a future non-authoritative convenience layer. Persistence planning is not persistence implementation, not source-of-truth transfer, not CONTROL_THREAD acceptance, not route authority, and not execution authority.

A19 translates the A18 plan into candidate schema-design fields, type categories, indexes, query patterns, lifecycle markers, redaction requirements, excluded fields, and future migration gates. A19 does not create Prisma schema, migrations, tables, or database mutations.

A20 classifies candidate fields using `allowed`, `allowed_with_constraints`, `reference_only`, `redact_before_persisting`, and `exclude`. It requires evidence pointers to prefer references over raw content, manual notes to be minimized and non-secret, and excluded content to stay out of future persistence.

A21 defines app-local lifecycle planning with `active`, `archived`, and `marked_for_delete`, plus redaction states such as `not_required`, `pending_review`, `redacted`, and `blocked_secret_risk`. It prohibits background cleanup and automatic deletion unless separately reviewed and explicitly approved in a future route.

## Candidate model/table reviewed

Candidate model name: `ControlThreadPassalongRecord`.

Candidate table name: `control_thread_passalong_records`.

These names are candidate-only planning labels. They do not create Prisma schema, database tables, migrations, persistence implementation, database reads, database writes, route handlers, source changes, or implementation authority.

## Candidate field set reviewed

The A19/A20 candidate field set reviewed for future implementation planning includes:

- `id`
- `passalongId`
- `sourceThreadId`
- `targetThreadId`
- source thread label snapshot
- target thread label snapshot
- `scope`
- `mode`
- `summary`
- `evidencePointers`
- `requestedDecision`
- `routeStatus`
- `createdAt`
- `updatedAt`
- `authorityBoundary`
- `nonAuthorizations`
- `sandboxPosture`
- `importAdoptionPosture`
- `manualOperatorNote`
- `archiveState`
- `archivedAt`
- `deletedAt`
- `redactionState`
- `schemaVersion`

These candidate fields remain app-local and non-authoritative. Exact persisted fields require a separate persisted-field boundary check, separate implementation route, and separate CONTROL_THREAD or explicit human approval before any source or schema work.

## Candidate excluded fields reviewed

The future implementation sequence must preserve exclusion of:

- provider API keys
- platform tokens
- database credentials
- connection strings
- passwords
- private keys
- raw `.env` contents
- unredacted secret-bearing logs
- unredacted screenshots exposing secrets
- full external chat transcripts unless separately reviewed
- full provider prompts containing secrets
- hidden chain-of-thought or private reasoning traces
- unnecessary operator personal context
- target repo source files
- generated code intended for target-repo import
- unreviewed runtime execution outputs
- production telemetry
- credentials embedded in evidence pointers
- any field that would turn app-local memory into source-of-truth transfer

## Future implementation sequence

The safest future sequence is:

1. implementation readiness confirmation
2. persisted-field boundary check
3. Prisma schema mutation route, if accepted
4. migration readiness review, if schema changes are proposed
5. target-environment confirmation, if migration application is needed
6. source implementation route
7. validation / secret scan / non-authorization scan
8. closeout
9. CONTROL_THREAD acceptance

Defining this sequence does not authorize any step. Each step remains blocked until separately routed, reviewed, and accepted.

## Implementation readiness confirmation

A future readiness confirmation should verify:

- A18 persistence planning remains accepted.
- A19 candidate schema design remains accepted.
- A20 data minimization classifications remain accepted.
- A21 retention lifecycle planning remains accepted.
- The operator still wants durable app-local non-authoritative passalong records.
- No source-of-truth transfer is intended.
- No automatic passalong sending is intended.
- No automatic route execution is intended.
- No sandbox runtime, JAI Agent, Agent PR Factory, GitHub mutation, target-repo import, deployment, or production gate behavior is intended.

Implementation readiness confirmation is not implementation, persistence authorization, Prisma schema mutation, migration, database mutation, route authority, execution authority, or CONTROL_THREAD acceptance of future implementation results.

## Persisted-field boundary check

A future persisted-field boundary check should confirm:

- Every field is still needed for operator recall, queue display, review history, or visible non-authorization posture.
- `evidencePointers` remain reference-only.
- `manualOperatorNote` remains optional, minimized, non-secret, length-limited, and redacted before persistence.
- `routeStatus` remains descriptive metadata only.
- `archiveState`, `archivedAt`, and `deletedAt` remain app-local lifecycle metadata only.
- `authorityBoundary` and `nonAuthorizations` remain visible with record detail.
- `sandboxPosture` does not activate sandbox-nexus.
- `importAdoptionPosture` does not create target-repo adoption.
- Excluded fields remain excluded.

The persisted-field boundary check is not schema mutation, migration, database mutation, route authority, execution authority, or persistence implementation.

## Candidate source areas/files, if any

Candidate future source areas may include:

- `portal/prisma/schema.prisma`
- future Prisma migration directory under `portal/prisma/migrations/**`
- `portal/src/lib/controlPlane/threadMemory/**`
- `portal/src/app/operator/control-thread/**`
- possible future route handler under `portal/src/app/operator/control-thread/**`
- possible future persistence helper under `portal/src/lib/controlPlane/threadMemory/**`

Candidate source areas are planning targets only. No source changes are authorized by this lane. No Prisma schema mutation is authorized by this lane. No migration is authorized by this lane. No route handler is authorized by this lane. No persistence helper is authorized by this lane. No database read/write is authorized by this lane.

## Candidate Prisma/schema route requirements

A future Prisma/schema route should:

- confirm A19 candidate model/table remains accepted
- confirm A20 data minimization classifications remain accepted
- confirm A21 retention lifecycle remains accepted
- produce Prisma schema mutation only in a separately routed implementation/schema lane
- preserve excluded fields
- preserve redaction state
- preserve non-authorizations
- preserve app-local non-authoritative wording
- include no provider keys, credentials, raw env, hidden/private reasoning traces, target-repo source, generated import code, production telemetry, or secret-bearing content
- require migration readiness review before migration application

This plan does not mutate Prisma schema. This plan does not create a Prisma model. This plan does not create a database table. This plan does not create or apply migrations. This plan does not authorize database mutation.

## Candidate migration-readiness requirements

A future migration-readiness review should require:

- separate migration readiness review if schema changes are proposed
- target environment identification
- non-secret DB target confirmation
- backup evidence
- rollback plan
- migration history review
- deployed artifact / commit confirmation
- maintenance window or downtime expectation
- post-migration verification plan
- secret-handling confirmation
- production exclusion unless separately routed
- CONTROL_THREAD or explicit human approval

No migration is created by this plan. No migration is applied by this plan. No migration authority is granted by this plan. No database mutation is authorized by this plan. Target-environment migration remains blocked until separately approved.

## Candidate target-environment requirements

A future target-environment confirmation should include:

- environment identity
- environment purpose
- non-secret database target description
- database provider category
- Prisma/Postgres compatibility, if applicable
- operator access posture
- deployed artifact / commit hash
- migration history visibility
- backup availability
- rollback path
- maintenance/downtime expectation
- verification plan
- provider-secret boundary
- telemetry boundary
- production exclusion unless separately routed

Target-environment confirmation is not migration application. Target-environment confirmation is not production authorization. Target-environment confirmation is not runtime activation. Target-environment confirmation is not source-of-truth transfer.

## Future source implementation route boundary

A future source implementation route may implement only the source changes separately accepted by CONTROL_THREAD or explicit human approval. It must preserve static A16 advisory behavior until persistence is separately accepted, preserve provider-secret boundaries, preserve non-authorizations, preserve app-local labeling, and avoid any external integration.

Future source implementation must not include auto-send controls, auto-route controls, JAI Agent dispatch controls, sandbox activation controls, GitHub mutation controls, target-repo import controls, deployment controls, production gate controls, background cleanup, automatic deletion, or hidden background execution unless each capability is separately routed and explicitly approved.

## Future validation requirements

The exact validation set must be confirmed in the future implementation route. Likely future commands and checks include:

- `pnpm -C portal typecheck`
- `pnpm -C portal lint`
- `pnpm -C portal build`
- `git diff --check`
- `git diff --cached --check`
- migration/schema validation if schema route is separately authorized
- route/API tests if route handlers are separately authorized
- UI smoke checks for `/operator/control-thread` if UI changes are separately authorized

Validation planning is not implementation approval, migration approval, production approval, route authority, or execution authority.

## Future secret-scan requirements

Future secret scans must check for:

- provider keys
- API keys
- platform tokens
- database credentials
- connection strings
- passwords
- private keys
- raw `.env` values
- credential-bearing evidence pointers
- secret-bearing logs/screenshots
- hidden/private reasoning traces
- target-repo source/import code
- production telemetry

Secret scans must verify excluded content is not persisted, provider keys are not stored, DB credentials are not stored, raw `.env` contents are not stored, hidden/private reasoning traces are not stored, target-repo source/import code is not stored, and production telemetry is not stored.

## Future non-authorization scan requirements

Future implementation must preserve explicit non-authorizations for:

- no automatic passalong sending
- no automatic route execution
- no JAI Agent activation
- no Agent PR Factory activation
- no sandbox runtime activation
- no sandbox task execution
- no target-repo import
- no GitHub mutation
- no PR creation
- no branch mutation
- no merge action
- no branch deletion
- no deployment
- no production gate opening
- no source-of-truth transfer
- no final CONTROL_THREAD approval by persisted record
- no route authority by persisted status
- no execution authority by lifecycle state

Future non-authorization scans should also check UI copy, helper output, route handlers if any, and persistence helpers if any for accidental authorization language.

## Future UI/UX boundary requirements

Future UI must:

- label persisted passalong records as app-local and non-authoritative
- label route status as descriptive metadata only
- label archive/delete lifecycle as app-local only
- show CONTROL_THREAD remains authority
- show Linear remains temporary mirror only
- show non-authorizations with record detail
- avoid wording that implies approval, execution, route authority, delivery proof, GitHub mutation, or target-repo adoption
- avoid auto-send buttons unless separately routed and authorized
- avoid auto-route controls
- avoid JAI Agent dispatch controls
- avoid sandbox activation controls
- avoid GitHub mutation controls
- avoid target-repo import controls
- avoid production gate controls

## App-local non-authoritative boundary

Future persistent passalong records would remain app-local and non-authoritative. Future persistent passalong records would not be source of truth. Future persistent passalong records would not be CONTROL_THREAD acceptance. Future persistent route status would not be route authority. Future persistent lifecycle state would not alter source-of-truth lifecycle. Future persistent lifecycle state would not alter CONTROL_THREAD decisions. Future persistent evidence pointer references would not be validation approval. Future persistent manual notes would not be route authority. Future persisted route recommendations would not be route authority. Future copyable packet snapshots would not be proof of manual sending.

## Source-of-truth separation

Source-of-truth records remain in repo history, accepted docs, commits, PRs, closeouts, CONTROL_THREAD decisions, or separately accepted systems.

Persistent app-local passalong records would not transfer source of truth. App-local archive is not source-of-truth archive. App-local delete is not source-of-truth delete. App-local lifecycle does not delete accepted artifacts. App-local lifecycle does not supersede CONTROL_THREAD decisions. App-local lifecycle does not mutate repositories.

## CONTROL_THREAD decision lifecycle separation

CONTROL_THREAD acceptance requires explicit CONTROL_THREAD decision. Persistent record creation is not CONTROL_THREAD acceptance. Persistent status update is not CONTROL_THREAD acceptance. App-local archive is not CONTROL_THREAD rejection. App-local delete is not CONTROL_THREAD withdrawal. App-local lifecycle does not approve routes. App-local lifecycle does not reject routes unless CONTROL_THREAD records rejection. App-local lifecycle does not execute routes. App-local lifecycle does not create authority.

## Retention/archive/delete implementation boundary

Retention/archive/delete implementation requires separate route. Background cleanup requires separate operational review. Automatic deletion requires separate operational review. `marked_for_delete` is not deletion authorization. `archivedAt` is not proof of source-of-truth archive. `deletedAt` is not proof of source-of-truth deletion. No automatic deletion should be included in a first implementation unless separately routed.

## Background cleanup / automatic deletion prohibition

No background cleanup is authorized. No automatic deletion is authorized. No scheduled cleanup job is authorized. No retention cron is authorized. No background worker is authorized. Any future background cleanup requires separate operational review. Any future automatic deletion requires separate operational review and explicit CONTROL_THREAD or human approval.

## `sandbox-nexus` boundary

Future passalong persistence does not activate `sandbox-nexus`. Future passalong persistence does not execute sandbox tasks. Future passalong persistence does not make `sandbox-nexus` source of truth. Future passalong persistence does not export sandbox outputs to canonical repos. Sandbox outputs require closeout/evidence receipt. Sandbox outputs require CONTROL_THREAD import/discard decision. `sandbox-nexus` import/discard decision is separate from app-local passalong lifecycle.

## Future JAI Agent slot boundary

Future passalong persistence does not activate JAI Agents. Future passalong persistence does not activate Agent PR Factory. Future passalong persistence does not dispatch work to agents. Future passalong persistence does not execute work through agents. Future passalong persistence does not create branches. Future passalong persistence does not create PRs. Future passalong persistence does not mutate GitHub. Future JAI Agent activation requires separate CONTROL_THREAD route and boundary review.

## GitHub mutation boundary

Future passalong persistence does not mutate GitHub. Future passalong persistence does not create branches. Future passalong persistence does not create PRs. Future passalong persistence does not merge. Future passalong persistence does not delete branches. Future passalong persistence does not commit. Future passalong persistence does not push. GitHub mutation remains outside passalong persistence implementation unless separately routed and accepted.

## Target-repo import/adoption boundary

Future passalong persistence does not import target-repo code. Future passalong persistence does not adopt sandbox output into canonical repos. Future passalong persistence does not mark target-repo adoption. Import candidate status remains future CONTROL_THREAD review only. Target repos import or reimplement only through separate route. No persistence value creates branches, PRs, merges, deployments, or production gates.

## Linear temporary mirror posture

CONTROL_THREAD remains authority. Linear remains temporary mirror only.

Linear mirror posture does not create source of truth, route authority, execution authority, final approval, target-repo adoption, GitHub mutation, sandbox activation, JAI Agent activation, Agent PR Factory activation, production gate opening, or persistence implementation approval.

## Required future gates

Required future gates before implementation:

1. CONTROL_THREAD acceptance of A22 implementation plan.
2. Separate implementation readiness confirmation.
3. Separate persisted-field boundary check.
4. Separate Prisma schema mutation route, if accepted.
5. Separate migration readiness review, if schema changes are proposed.
6. Separate target-environment confirmation, if migration application is needed.
7. Separate source implementation route.
8. Separate validation / secret scan / non-authorization scan.
9. Separate closeout.
10. Separate CONTROL_THREAD acceptance.
11. Separate operational review before any background cleanup or automatic deletion behavior.

## Required findings

- Implementation planning is not implementation.
- Implementation planning is not Prisma schema mutation.
- Implementation planning is not migration.
- Implementation planning is not database mutation.
- Implementation planning is not persistence authorization.
- Future persistent passalong records would remain app-local and non-authoritative.
- Future persistent passalong records would not be source of truth.
- Future persistent passalong records would not be CONTROL_THREAD acceptance.
- Future persistent route status would not be route authority.
- Future persistent lifecycle state would not alter source-of-truth lifecycle.
- Future persistent lifecycle state would not alter CONTROL_THREAD decisions.
- Future implementation must preserve data minimization.
- Future implementation must preserve retention policy.
- Future implementation must exclude secrets.
- Future implementation must include validation and secret-scan requirements.
- Background cleanup and automatic deletion require separate operational review.
- CONTROL_THREAD remains authority.
- Linear remains temporary mirror only.

## Non-authorizations

- No persistence implementation.
- No Prisma schema change.
- No migration.
- No database mutation.
- No background cleanup.
- No automatic deletion.
- No automatic passalong sending.
- No automatic route execution.
- No JAI Agent activation.
- No Agent PR Factory activation.
- No sandbox runtime activation.
- No sandbox task execution.
- No target-repo import.
- No GitHub mutation.
- No PR creation.
- No branch mutation.
- No merge action.
- No branch deletion.
- No deployment.
- No production gate opening.
- No source-of-truth transfer.
- No autonomous execution.
- No work-packet execution.
- No auto-submit to agents.
- No auto-send to other chats.
- No auto-run deliberation.
- No auto-route work.
- No provider/model routing authority.
- No production telemetry.
- No provider API key persistence.
- No provider API key exposure.
- No provider secret storage.
- No final CONTROL_THREAD approval by persisted passalong record.
- No final CONTROL_THREAD approval by persisted route status.
- No final CONTROL_THREAD approval by persisted lifecycle state.
- No final CONTROL_THREAD approval by retained record.
- No route authority by persisted passalong record.
- No route authority by persisted route status.
- No route authority by persisted lifecycle state.
- No execution authority by persisted passalong record.
- No execution authority by persisted lifecycle state.
- No execution authority by sandbox-nexus target option.
- No execution authority by future JAI Agent slot.
- No target-repo adoption by persisted import posture.

## Risks and follow-ups

Risks:

- A future implementation could accidentally broaden persistence fields without a persisted-field boundary check.
- A future UI could imply delivery, approval, or route authority unless labels remain explicit.
- A future schema/migration path could be mistaken for migration authorization unless each route is separated.
- Future cleanup behavior could become background cleanup or automatic deletion unless separately reviewed.

Follow-ups:

- Decide whether CONTROL_THREAD accepts this A22 implementation planning artifact.
- Route implementation readiness confirmation only if durable app-local records are still desired.
- Route persisted-field boundary check before any schema/source work.
- Route Prisma/schema mutation and migration readiness only if schema changes are accepted.

## Recommended next decision path

Likely next path:

1. CONTROL_THREAD acceptance of this A22 implementation planning artifact.
2. Separate implementation readiness confirmation route.
3. Separate persisted-field boundary check route.
4. Separate Prisma schema mutation route only if CONTROL_THREAD accepts readiness and field boundary.
5. Separate migration readiness review if schema changes are proposed.
6. Separate target-environment confirmation if migration application is needed.
7. Separate source implementation route.
8. Separate validation/closeout and CONTROL_THREAD acceptance after implementation.

Possible recommended next routes:

- `Q3M7 Control Thread Passalong Implementation Readiness Confirmation v0`
- `Q3M7 Control Thread Passalong Persisted-Field Boundary Check v0`
- `Q3M7 Control Thread Passalong Migration Readiness Review v0`
- `Q3M7 Motion Intake Sandbox Evidence Intake v0`
- `Q3M7 sandbox-nexus Playground Boundary Plan v0`

None of these routes are approved by this implementation plan.

## Validation plan

Validation for this lane should include:

- `git diff --check`
- `git diff --cached --check`
- required finding scan
- required non-authorization scan
- required topic scan
- manual review of authorization-language hits to confirm they are negated, future-gated, minimized, redacted, excluded, or boundary-framed

Topic coverage includes future implementation sequence, candidate source areas, Prisma/schema route requirements, migration-readiness requirements, target-environment requirements, future validation requirements, secret-scan requirements, non-authorization scan requirements, UI/UX boundary requirements, app-local non-authoritative boundary, source-of-truth separation, CONTROL_THREAD decision lifecycle separation, retention/archive/delete implementation boundary, background cleanup, automatic deletion, sandbox-nexus boundary, Future JAI Agent slot boundary, GitHub mutation boundary, target-repo import/adoption boundary, future gates, CONTROL_THREAD authority, and Linear temporary mirror posture.

## ZERO GATES GRANTED

ZERO GATES GRANTED.

This artifact grants no persistence implementation, no Prisma schema change, no migration, no database mutation, no background cleanup, no automatic deletion, no automatic passalong sending, no automatic route execution, no sandbox runtime activation, no JAI Agent activation, no Agent PR Factory activation, no GitHub mutation, no branch creation, no PR creation, no merge, no deployment, no target-repo import, no source-of-truth transfer, no production telemetry, and no production gate opening.
