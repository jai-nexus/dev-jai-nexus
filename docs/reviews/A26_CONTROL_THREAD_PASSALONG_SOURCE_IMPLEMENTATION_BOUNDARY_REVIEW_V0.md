# A26 Control Thread Passalong Source Implementation Boundary Review v0

## Role

Role: `JAI::DEV::BUILDER`

## 1. Review scope

A26 reviews the accepted A25 app-local Control Thread passalong persistence source implementation before any migration-readiness, target-environment, sandbox, API-routing, JAI Agent stress-test, accepted-code import, target-repo import, GitHub mutation, deployment, or production gate route.

This review is static and repo-local only. It creates this review artifact and does not change runtime behavior, source implementation, Prisma schema, migrations, APIs, provider/model wiring, route behavior, automation, target repo imports, deployment configuration, or GitHub state.

Future target to preserve: `JAI_Control_Thread  JAI_dev-jai-nexus  JAI_sandbox-nexus  drafted/reviewed outputs  accepted code import only after explicit CONTROL_THREAD acceptance and separate import authority`. This target is future-only. It is not active, authorized, routed, implemented, or accepted by A26.

## 2. Reviewed baseline

Reviewed A25 against the accepted A16-A24 baseline:

- A16 passalong-router prototype: static thread-memory/passalong data, route status vocabulary, pure queue/recommendation helpers, and `/operator/control-thread` UI.
- A17 boundary review: A16 is advisory, static/sample-based, non-authoritative, non-executing, and not persistence.
- A18 persistence planning: future app-local persistence is non-authoritative convenience memory only.
- A19 schema design: candidate `ControlThreadPassalongRecord` / `control_thread_passalong_records` fields, indexes, lifecycle markers, exclusions, and migration gates.
- A20 data minimization review: allowed, constrained, reference-only, redaction-gated, and excluded field boundaries.
- A21 retention policy: app-local `active`, `archived`, `marked_for_delete` lifecycle and no background cleanup or automatic deletion.
- A22 implementation plan: future implementation sequence, schema/migration/target-environment gates, validation, secret scan, and UI boundary requirements.
- A23 readiness confirmation: implementation remained held pending persisted-field boundary check.
- A24 persisted-field boundary check: overall `approved_with_constraints` and source implementation route allowed only if exact boundaries were preserved.
- A25 accepted source implementation: commit `e9439d3 feat(control-plane): persist control thread passalong records`.

## 3. Files inspected

A25 source, schema, migration, route, UI, and helper files inspected:

- `portal/prisma/schema.prisma`
- `portal/prisma/migrations/20260704120000_add_control_thread_passalong_records/migration.sql`
- `portal/src/lib/controlPlane/threadMemory/types.ts`
- `portal/src/lib/controlPlane/threadMemory/index.ts`
- `portal/src/lib/controlPlane/threadMemory/passalong-persistence-boundary.ts`
- `portal/src/lib/controlPlane/threadMemory/passalong-persistence.ts`
- `portal/src/app/operator/control-thread/page.tsx`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `portal/src/app/operator/control-thread/passalongs/route.ts`
- `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts`

Baseline artifacts inspected:

- `docs/reference/q3m7-control-thread-passalong-router-boundary-review-v0.md`
- `docs/reference/q3m7-control-thread-passalong-persistence-plan-v0.md`
- `docs/reference/q3m7-control-thread-passalong-persistence-schema-design-v0.md`
- `docs/reference/q3m7-control-thread-passalong-data-minimization-review-v0.md`
- `docs/reference/q3m7-control-thread-passalong-retention-policy-plan-v0.md`
- `docs/reference/q3m7-control-thread-passalong-persistence-implementation-plan-v0.md`
- `docs/reference/q3m7-control-thread-passalong-implementation-readiness-confirmation-v0.md`
- `docs/reference/q3m7-control-thread-passalong-persisted-field-boundary-check-v0.md`

No pre-existing `docs/reviews` README/index convention was found, so this lane creates only this review artifact.

## 4. A25 source boundary findings

Findings:

- A25 implements app-local passalong persistence through bounded helpers and route handlers, not through autonomous execution.
- A25 preserves A16 static/sample passalong behavior as fallback/example data in `page.tsx` and `PassalongRouterPrototype.tsx`.
- Persisted records use A24 candidate fields only: ids/timestamps/version, bounded thread/status/lifecycle/redaction/posture fields, reference-only evidence pointers, non-authorizations, and optional manual note.
- Persistence helper errors fail closed with safe messages when database/table access is unavailable.
- No code path was found for automatic passalong sending, automatic route execution, JAI Agent activation, sandbox runtime activation, GitHub mutation, target-repo import, deployment, production gate opening, or source-of-truth transfer.

Evidence:

- `portal/src/lib/controlPlane/threadMemory/passalong-persistence.ts` returns unavailable/blocked results on errors and includes `safeMessage`/`nonAuthorizations`.
- `portal/src/lib/controlPlane/threadMemory/passalong-persistence-boundary.ts` defines `PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS`.
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx` only triggers create/update from button `onClick` handlers.

## 5. Prisma / schema / migration findings

Findings:

- Prisma schema changed in A25 by adding `ControlThreadPassalongRecord` mapped to `control_thread_passalong_records`.
- Repo-local migration file added: `portal/prisma/migrations/20260704120000_add_control_thread_passalong_records/migration.sql`.
- Migration SQL creates the table and indexes only; no `DROP TABLE`, `DELETE FROM`, background cleanup, data backfill, production target, or target-environment logic was found.
- A26 did not apply migrations and did not mutate any database.
- A25 implementation uses raw Prisma SQL helpers and does not require generated model access in source helper code.

Evidence:

- `portal/prisma/schema.prisma` model `ControlThreadPassalongRecord`.
- `portal/prisma/migrations/20260704120000_add_control_thread_passalong_records/migration.sql` contains `CREATE TABLE` and `CREATE INDEX` statements only.
- A26 validation used only `git diff --check` and static `rg` scans; no migration command was run.

## 6. Route / API behavior findings

Findings:

- `GET /operator/control-thread/passalongs` lists persisted app-local records.
- `POST /operator/control-thread/passalongs` creates/upserts a persisted record after boundary validation.
- `PATCH /operator/control-thread/passalongs/[passalongId]` updates bounded metadata/lifecycle fields after boundary validation.
- `GET /operator/control-thread/passalongs/[passalongId]` returns 405 with boundary language and does not mutate state.
- No route handler sends passalongs, routes work, calls GitHub, creates PRs/branches, merges, deletes branches, deploys, activates sandbox runtime, activates JAI Agents, imports target-repo code, exposes secrets, performs background cleanup, performs automatic deletion, or opens production gates.

Evidence:

- `portal/src/app/operator/control-thread/passalongs/route.ts`.
- `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts`.
- Route handlers call only `listPersistedPassalongRecords`, `persistPassalongRecord`, and `updatePersistedPassalongRecord`.

## 7. Operator UI copy and control findings

Findings:

- UI labels persisted records as app-local and non-authoritative.
- UI states route status is descriptive metadata only.
- UI states archive/delete lifecycle is app-local only.
- UI states CONTROL_THREAD remains authority and Linear remains temporary mirror only.
- UI manual save/update/archive/mark-for-delete controls require operator button clicks.
- UI includes non-authorization copy for no send, route, approval, execution, GitHub mutation, sandbox runtime activation, JAI Agent activation, target-repo import, deploy, gates, hard delete, background cleanup, automatic deletion, auto-send, and auto-route.

Evidence:

- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx` persistence panel copy and manual controls.
- Save/update handlers are attached to explicit `onClick` buttons.

## 8. Redaction and secret-risk findings

Findings:

- A25 includes field-length limits for passalong id, thread labels, scope, mode, summary, requested decision, authority boundary, sandbox posture, manual operator note, evidence pointers, and non-authorizations.
- A25 validates thread ids, route status, archive state, redaction state, and import/adoption posture against bounded vocabularies.
- A25 scans free text and evidence labels for obvious secret-risk patterns including API key assignment, secret/token/password assignment, private keys, database URL, connection strings, credential URLs, raw `.env`, hidden/private reasoning, target repo source, and production telemetry.
- `blocked_secret_risk` prevents persistence and requires redaction before saving.
- Manual operator notes are optional and length-limited.
- Residual risk: this is conservative pattern-based validation, not a comprehensive DLP system. Future migration/readiness or supervised stress-test routes should include focused tests for boundary failures before any broader routing.

Evidence:

- `portal/src/lib/controlPlane/threadMemory/passalong-persistence-boundary.ts` constants `FIELD_LIMITS`, `SECRET_RISK_PATTERNS`, `PASSALONG_ARCHIVE_STATES`, `PASSALONG_REDACTION_STATES`, `PASSALONG_ROUTE_STATUSES`, and validation functions.

## 9. Required review-check matrix

| # | Check | Finding | Evidence | Status |
|---|-------|---------|----------|--------|
| 1 | Persisted records remain app-local and non-authoritative. | Confirmed. Helpers and UI state this boundary. | `passalong-persistence-boundary.ts`, `PassalongRouterPrototype.tsx` | Confirmed |
| 2 | Route status remains descriptive metadata only. | Confirmed. Copy states route status is descriptive metadata only and route statuses are bounded. | `types.ts`, `passalong-persistence-boundary.ts`, `PassalongRouterPrototype.tsx` | Confirmed |
| 3 | CONTROL_THREAD remains authority. | Confirmed. Non-authorization constants and UI copy preserve this. | `passalong-persistence-boundary.ts`, `PassalongRouterPrototype.tsx` | Confirmed |
| 4 | Linear remains mirror only. | Confirmed. UI and non-authorization copy say Linear remains temporary mirror only. | `passalong-persistence-boundary.ts`, `PassalongRouterPrototype.tsx` | Confirmed |
| 5 | No automatic passalong sending. | Confirmed. No send integration found; UI says no auto-send. | Route handlers, UI scan | Confirmed |
| 6 | No automatic route execution. | Confirmed. Route handlers only list/create/update persistence records. | `passalongs/route.ts`, `[passalongId]/route.ts` | Confirmed |
| 7 | No JAI Agent activation. | Confirmed. No agent dispatch path found; UI/non-auth copy negates activation. | Static scan, `passalong-persistence-boundary.ts` | Confirmed |
| 8 | No sandbox runtime activation. | Confirmed. Sandbox posture is metadata only; no sandbox runtime path found. | Static scan, UI copy | Confirmed |
| 9 | No GitHub mutation. | Confirmed. No GitHub/Octokit calls found in A25 files. | Static scan | Confirmed |
| 10 | No target-repo import. | Confirmed. Import/adoption posture is bounded metadata only. | `passalong-persistence-boundary.ts`, UI copy | Confirmed |
| 11 | No production gate opening. | Confirmed. No production gate logic found; non-auth copy negates gates. | Static scan | Confirmed |
| 12 | No source-of-truth transfer by persisted record. | Confirmed. UI/helper copy negates source-of-truth transfer. | `passalong-persistence-boundary.ts`, UI copy | Confirmed |
| 13 | Prisma migration file was not applied by this lane. | Confirmed for A26. A26 ran no migration commands. A25 closeout also reported no migration applied. | Command history for A26; A25 closeout context | Confirmed |
| 14 | No deployed database was mutated by this lane. | Confirmed for A26. A26 performed no runtime DB command. A25 closeout also reported no DB mutation. | A26 command set | Confirmed |
| 15 | Secret/redaction handling matches A20-A25 boundaries. | Confirmed with residual pattern-scan limitation. A25 blocks obvious secret-risk content and `blocked_secret_risk`. | `passalong-persistence-boundary.ts` | Confirmed |

## 10. Non-authorization scan

Static scan command used:

```bash
rg -n "automatic|auto-send|auto-route|JAI Agent|Agent PR Factory|sandbox runtime|GitHub|target-repo|production gate|source-of-truth|CONTROL_THREAD|Linear|migrate|DELETE FROM|DROP TABLE|provider|secret|DATABASE_URL|connection string" portal/src/lib/controlPlane/threadMemory portal/src/app/operator/control-thread portal/prisma/schema.prisma portal/prisma/migrations/20260704120000_add_control_thread_passalong_records/migration.sql
```

Scan result:

- Hits in A25 files are boundary-framed or negated UI/helper copy, bounded validation pattern names, schema provider metadata, existing A16 sample-data non-authorizations, or the A25 table/model references.
- No `DROP TABLE`, `DELETE FROM`, migration application command, GitHub API call, Octokit call, provider/model dispatch, sandbox runtime invocation, JAI Agent dispatch, target-repo import operation, deployment operation, or production gate opening path was found.

## 11. Blockers before A27-A31

Blockers that remain before any A27-A31 future route:

- Migration readiness review remains required before migration application.
- Target-environment confirmation remains required before any database migration application or environment-specific persistence enablement.
- No deployed database may be mutated without separate explicit authority.
- Supervised stress-test route must remain local, non-mutating, and non-authoritative unless separately approved.
- Sandbox-nexus runtime activation remains blocked.
- JAI Agent activation remains blocked.
- Accepted-code import remains blocked until explicit CONTROL_THREAD acceptance and separate import authority.
- GitHub mutation, PR creation, deployment, and production gates remain blocked.
- Secret/redaction test cases should be added before any broader supervised proof route.

## 12. Recommendation for fastest safe future route

Fastest safe future route:

`Q3M7 Control Thread Passalong Local Persistence Boundary Test Plan v0`

Recommended objective:

Define and run a local-only, non-mutating boundary test plan for A25 validation/redaction, route/API behavior, UI copy, unavailable-persistence fallback, archive/mark-for-delete markers, and non-authorization preservation. This should run before migration-readiness or target-environment confirmation.

After that, if CONTROL_THREAD chooses to proceed, route migration-readiness and target-environment confirmation separately. The future supervised proof path toward `JAI_Control_Thread  JAI_dev-jai-nexus | JAI_sandbox-nexus` stress testing should remain advisory/local-only until explicit CONTROL_THREAD acceptance and separate import authority exist.

## 13. Validation

Safe static validation for A26:

- `git diff --check`: passed.
- Static `rg` non-authorization scan over A25 implementation areas: completed; hits were expected boundary-framed or negated references, schema provider metadata, validation pattern names, A16 sample-data non-authorizations, or this review artifact text.

No runtime validation was run. No migration commands were run. No database connection was attempted by A26. No APIs/providers/models were called. No sandbox runtime, JAI Agent, GitHub mutation, push, PR, deployment, accepted-code import, target-repo import, or production gate action was performed.

## 14. Authority boundary

A26 is review-only. This artifact does not authorize migration application, deployed database mutation, target-environment confirmation, production API routing, provider/model dispatch, secret use, customer data access, autonomous execution, JAI Agent activation, sandbox-nexus runtime activation, accepted-code import, target-repo import, GitHub mutation, PR creation, deployment, or production gates.

CONTROL_THREAD remains authority. Linear remains temporary mirror only. Persisted records, route status, lifecycle markers, UI controls, route handlers, schema files, migration files, validation results, and this review artifact are not CONTROL_THREAD acceptance, route authority, execution authority, source of truth, target-repo adoption, sandbox activation, JAI Agent activation, GitHub mutation authority, deployment authority, or production gate authority.

## 15. Repo-lane closeout

Files changed:

- `docs/reviews/A26_CONTROL_THREAD_PASSALONG_SOURCE_IMPLEMENTATION_BOUNDARY_REVIEW_V0.md`

A25 source boundary findings:

- A25 preserves app-local, non-authoritative persistence boundaries.
- No source path was found for autonomous execution, auto-send, auto-route, sandbox runtime activation, JAI Agent activation, GitHub mutation, target-repo import, deployment, production gate opening, or source-of-truth transfer.

Prisma/schema/migration findings:

- A25 added `ControlThreadPassalongRecord` and a repo-local migration SQL file.
- A26 did not apply migrations and did not mutate any deployed database.
- Migration file contains create-table and indexes only.

Route/API findings:

- A25 added manual app-local `GET`, `POST`, and `PATCH` persistence routes only.
- No route handler sends passalongs, routes work, calls GitHub, activates sandbox/JAI Agents, imports target-repo code, deploys, or opens gates.

UI copy/control findings:

- UI labels persisted records app-local and non-authoritative.
- UI labels route status descriptive only and archive/delete lifecycle app-local only.
- UI requires operator button clicks for save/update/archive/mark-for-delete.

Redaction/secret findings:

- A25 includes bounded vocabularies, field length limits, secret-risk regex checks, `blocked_secret_risk` blocking, optional manual notes, and reference-only evidence pointer constraints.
- Residual risk remains because validation is pattern-based; future boundary tests should include negative cases.

Non-authorization scan:

- Static scan found only negated/boundary-framed hits and expected schema/provider metadata. No prohibited behavior path was found.

Blockers before A27-A31:

- Migration readiness, target-environment confirmation, deployed DB mutation, sandbox runtime activation, JAI Agent activation, accepted-code import, target-repo import, GitHub mutation, PR creation, deployment, and production gates remain blocked.

Recommendation for fastest safe route to supervised `JAI_Control_Thread  JAI_dev-jai-nexus | JAI_sandbox-nexus` stress test:

- Route `Q3M7 Control Thread Passalong Local Persistence Boundary Test Plan v0` first, then only after CONTROL_THREAD acceptance consider migration-readiness and target-environment confirmation. Keep the future stress test local, supervised, non-mutating, and non-authoritative until separate explicit authority exists.

PR description draft:

```md
## Role

Role: `JAI::DEV::BUILDER`

## Summary

Created A26 static boundary review for the accepted A25 Control Thread passalong source implementation.

## Files changed

- `docs/reviews/A26_CONTROL_THREAD_PASSALONG_SOURCE_IMPLEMENTATION_BOUNDARY_REVIEW_V0.md`

## Boundary review findings

A25 preserves app-local, non-authoritative passalong persistence boundaries and does not add auto-send, auto-route, execution, sandbox activation, JAI Agent activation, GitHub mutation, target-repo import, deployment, production gates, or source-of-truth transfer.

## Prisma / schema / migration findings

A25 added bounded Prisma schema and repo-local migration file for `ControlThreadPassalongRecord` / `control_thread_passalong_records`. A26 applied no migration and mutated no database.

## Route / API findings

A25 route handlers are manual app-local persistence access only: list, create/upsert, and bounded PATCH metadata/lifecycle updates.

## Operator UI findings

UI copy labels records app-local and non-authoritative, route status descriptive only, archive/delete lifecycle app-local only, CONTROL_THREAD as authority, and Linear as temporary mirror only.

## Redaction / secret-risk findings

A25 includes bounded vocabularies, field limits, secret-risk scans, `blocked_secret_risk` blocking, optional minimized manual notes, and reference-only evidence pointer constraints.

## Non-authorizations

No migration application, deployed DB mutation, target-environment confirmation, production API routing, provider/model dispatch, secret use, customer data access, autonomous execution, JAI Agent activation, sandbox runtime activation, accepted-code import, target-repo import, GitHub mutation, PR creation, deployment, or production gates.

## Validation

- `git diff --check`
- Static non-authorization `rg` scan

## Risks

Secret/redaction validation is conservative and pattern-based. Future local boundary tests should add negative cases before migration-readiness or stress-test routing.

## Recommended next route

`Q3M7 Control Thread Passalong Local Persistence Boundary Test Plan v0`
```
