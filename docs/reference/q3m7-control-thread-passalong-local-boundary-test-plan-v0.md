# Q3M7 Control Thread Passalong Local Boundary Test Plan v0

## Role

Role: `JAI::DEV::BUILDER`

## 1. Scope

A27 defines a local-only boundary test plan for the accepted A25 Control Thread passalong persistence behavior before any migration-readiness, target-environment confirmation, sandbox proof path, JAI Agent stress-test, accepted-code import, target-repo import, deployment, or production-gate route.

This artifact is documentation/test-plan only. It does not implement tests, change runtime behavior, change source behavior, change Prisma schema, add migrations, apply migrations, mutate databases, confirm target environments, call APIs, call providers/models, activate sandbox-nexus, activate JAI Agents, automate GitHub, create PRs, deploy, open production gates, or transfer source of truth.

## 2. Accepted baseline

Accepted A26 baseline confirms A25 preserved A17-A24 boundaries in source:

- Persisted passalong records remain app-local and non-authoritative.
- Route status remains descriptive metadata only.
- CONTROL_THREAD remains authority.
- Linear remains temporary mirror only.
- Route handlers remain manual app-local persistence access only.
- No automatic passalong sending was found.
- No automatic route execution was found.
- No JAI Agent activation was found.
- No sandbox runtime activation was found.
- No GitHub mutation behavior was found.
- No target-repo import behavior was found.
- No production gate opening was found.
- No source-of-truth transfer by persisted record was found.
- Prisma migration file was not applied by A26.
- No deployed database was mutated by A26.
- Redaction and secret-risk handling matched A20-A25 boundaries, with conservative pattern-based limitation.

Reviewed evidence targets for a future local test lane include:

- `portal/src/lib/controlPlane/threadMemory/types.ts`
- `portal/src/lib/controlPlane/threadMemory/passalong-persistence-boundary.ts`
- `portal/src/lib/controlPlane/threadMemory/passalong-persistence.ts`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `portal/src/app/operator/control-thread/passalongs/route.ts`
- `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts`
- `portal/prisma/schema.prisma`
- `portal/prisma/migrations/20260704120000_add_control_thread_passalong_records/migration.sql`
- `docs/reviews/A26_CONTROL_THREAD_PASSALONG_SOURCE_IMPLEMENTATION_BOUNDARY_REVIEW_V0.md`

## 3. Test-plan posture

A27 defines test intent only. It does not create executable tests. Any code snippets or test names in this artifact are documentation examples only.

Future implementation tests, if routed separately, should remain local-only, non-migration, non-deployed-database, non-provider, non-sandbox, non-JAI-Agent, non-GitHub, and non-production. They should use fixtures, mocks, static validation, and route/helper unit boundaries unless CONTROL_THREAD separately authorizes a specific local database test environment.

Migration application, target-environment confirmation, sandbox proof path, JAI Agent stress-test, accepted-code import, target-repo import, deployment, production API routing, and production gates remain blocked.

## 4. Local/static test matrix

| ID | Coverage area | Positive case | Negative case | Expected boundary result | Evidence target | Notes |
|----|---------------|---------------|---------------|--------------------------|-----------------|-------|
| A27-001 | Allowed persisted fields | Record includes `id`, `passalongId`, timestamps, `redactionState`, and `schemaVersion`. | Record attempts to treat ids/timestamps as proof of delivery or CONTROL_THREAD acceptance. | Allowed as app-local metadata only; no authority created. | `types.ts`, `passalong-persistence.ts` | Positive fixture should assert shape, not source-of-truth meaning. |
| A27-002 | Constrained persisted fields | Known source/target thread ids, short labels, bounded scope/mode/summary/requested decision, bounded status and lifecycle values. | Unknown thread id, invalid status, invalid lifecycle, or unbounded text. | Valid case accepted; invalid case rejected or blocked before persistence. | `passalong-persistence-boundary.ts` | Covers constrained fields. |
| A27-003 | Provider API keys | Non-secret summary passes validation. | `provider_api_key=...` or similar provider key text appears in summary/manual note/evidence label. | Secret-risk validation blocks save. | `SECRET_RISK_PATTERNS` | Documentation examples only; do not use real keys. |
| A27-004 | API keys | Non-secret operational note passes validation. | `api_key=...` appears in manual note. | Validation blocks save and returns redaction message. | `SECRET_RISK_PATTERNS` | Use fake placeholder strings only. |
| A27-005 | Platform tokens | Normal evidence pointer path passes. | Evidence label includes `token=...`. | Validation blocks save before persistence. | `collectTextValidationErrors` | Tests evidence label risk. |
| A27-006 | Database credentials | Non-secret database category label is absent from record. | `DATABASE_URL=...` appears in requested decision. | Validation blocks save. | `SECRET_RISK_PATTERNS` | Do not connect to a database. |
| A27-007 | Connection strings | Repo-relative docs path passes. | Evidence pointer includes `postgres://`, `mysql://`, or `mongodb://`. | Validation blocks save. | `SECRET_RISK_PATTERNS` | Static helper test only. |
| A27-008 | Passwords | Manual note says `reviewed locally` without secrets. | Manual note contains `password=...`. | Validation blocks save. | `SECRET_RISK_PATTERNS` | Use fake placeholder text. |
| A27-009 | Private keys | Normal summary passes. | Text includes `BEGIN RSA` or `BEGIN OPENSSH`. | Validation blocks save. | `SECRET_RISK_PATTERNS` | No real key material. |
| A27-010 | Raw `.env` content | Evidence pointer references a docs artifact. | Summary/manual note contains raw `.env` text or `raw .env`. | Validation blocks save. | `SECRET_RISK_PATTERNS` | Static string fixture only. |
| A27-011 | Unredacted secret-bearing logs | Evidence pointer label says `redacted local log reference`. | Evidence pointer embeds raw log text with secret-like assignment. | Validation blocks save. | `evidencePointers`, secret scan | Prefer references over logs. |
| A27-012 | Unredacted screenshots exposing secrets | Evidence pointer references `docs/reference/...` artifact. | Evidence pointer label describes unredacted screenshot exposing credentials. | Validation should block if credential-like text is present; future tests should flag this as excluded even if pattern misses exact wording. | A20/A24 exclusions, `SECRET_RISK_PATTERNS` | Residual DLP limitation. |
| A27-013 | Full external chat transcripts | Short non-secret summary passes. | Full copied chat transcript is placed in summary/manual note. | Should be rejected by length/minimization checks or flagged as excluded in future tests. | `FIELD_LIMITS`, A20 exclusions | Test should assert minimized summary instead. |
| A27-014 | Full provider prompts containing secrets | Short requested decision passes. | Full provider prompt with secret-like content appears in requested decision. | Validation blocks on secret-risk or oversized text. | `requestedDecision`, `SECRET_RISK_PATTERNS` | Provider dispatch remains out of scope. |
| A27-015 | Hidden chain-of-thought/private reasoning traces | Operator-visible summary passes. | Text includes `chain-of-thought` or `private reasoning`. | Validation blocks save. | `SECRET_RISK_PATTERNS` | No private reasoning storage. |
| A27-016 | Unnecessary operator personal context | Operational note says `manual review pending`. | Manual note includes unrelated sensitive personal details. | Future tests should require minimization/redaction; current pattern may not catch every personal detail. | `manualOperatorNote`, A20 personal-context boundary | Residual human-review risk. |
| A27-017 | Target repo source files | Evidence pointer names a reviewed artifact path. | Summary/manual note includes target repo source file content or says `target repo source`. | Validation blocks if pattern matches; future tests should keep target source excluded. | `SECRET_RISK_PATTERNS`, A24 exclusions | No accepted-code import. |
| A27-018 | Generated code intended for target-repo import | Import posture remains metadata only. | Manual note contains generated import code or adoption instruction. | Future tests should block as excluded/import authority risk. | A24 import/adoption boundary | Pattern may require explicit fixture wording. |
| A27-019 | Unreviewed runtime execution outputs | Evidence pointer references reviewed closeout only. | Evidence pointer embeds raw unreviewed runtime output. | Future tests should reject raw content; current evidence pointers should remain references. | `evidencePointers` | Runtime execution remains out of scope. |
| A27-020 | Production telemetry | Non-secret operator metadata passes. | Summary/manual note contains `production telemetry`. | Validation blocks save. | `SECRET_RISK_PATTERNS` | No production telemetry storage. |
| A27-021 | Credentials embedded in evidence pointers | `docs/reference/q3m7...md` pointer passes. | Evidence pointer includes credential-bearing URL. | Validation blocks if credential pattern appears; future tests should reject all credential-bearing pointers. | `evidencePointers`, `SECRET_RISK_PATTERNS` | Reference-only boundary. |
| A27-022 | Oversized summary | Summary under `1200` characters passes. | Summary exceeds configured limit. | Validation rejects with field-limit error. | `FIELD_LIMITS.summary` | Boundary helper unit test candidate. |
| A27-023 | Oversized manual note | Manual note under `1000` characters passes. | Manual note exceeds configured limit. | Validation rejects or normalizes to null only if invalid input path is tested; future test should assert no persisted oversized note. | `FIELD_LIMITS.manualOperatorNote` | Manual note is redaction-gated. |
| A27-024 | Oversized evidence label | Evidence pointer under `300` characters passes. | Evidence pointer exceeds configured length. | Future test should assert truncation or rejection according to implementation behavior; document residual truncation behavior. | `constrainStringArray` | Current helper truncates array entries. |
| A27-025 | Invalid route status | `queued`, `needs_review`, `recommended`, `held`, or `archived` passes. | `auto_sent`, `executing`, or `approved` is supplied. | Validation rejects; route status remains descriptive only. | `PASSALONG_ROUTE_STATUSES`, `readRouteStatus` | Covers status vocabulary. |
| A27-026 | Invalid redaction state | `not_required`, `pending_review`, or `redacted` passes. | `secret_saved` or unknown value is supplied. | Validation rejects. | `PASSALONG_REDACTION_STATES` | `blocked_secret_risk` is special blocked posture. |
| A27-027 | `blocked_secret_risk` redaction state | Redacted safe content with `redacted` passes. | Record attempts to persist with `blocked_secret_risk`. | Validation blocks save until redaction occurs. | `validatePersistedPassalongCreateInput`, `validatePersistedPassalongPatchInput` | Explicit A20/A21 posture. |
| A27-028 | Invalid archive/lifecycle states | `active`, `archived`, `marked_for_delete` pass. | `hard_deleted`, `purged`, or `sent` is supplied. | Validation rejects. | `PASSALONG_ARCHIVE_STATES` | Lifecycle is app-local only. |
| A27-029 | Archive marker behavior | PATCH `archiveState: archived` sets/retains `archivedAt` marker. | Archive is treated as source-of-truth archive. | Marker is app-local only; no source-of-truth effect. | `mergePatch`, UI copy | No background cleanup. |
| A27-030 | Mark-for-delete marker behavior | PATCH `archiveState: marked_for_delete` sets/retains `deletedAt` marker. | Marker triggers physical delete or source-of-truth deletion. | Marker only; no hard delete or source-of-truth deletion. | `mergePatch`, UI copy | Physical hard-delete prohibited. |
| A27-031 | Physical hard-delete prohibition | No hard delete route exists. | Test attempts DELETE method or searches for `DELETE FROM`. | No physical hard delete path should exist. | Route handlers, static scan | A25 route has no DELETE handler. |
| A27-032 | Manual create/upsert only | Operator click posts to `/operator/control-thread/passalongs`. | Record is created during render or background load. | Create requires manual action; render only lists/fallbacks. | `PassalongRouterPrototype.tsx`, `route.ts` | UI behavior check candidate. |
| A27-033 | Manual bounded PATCH only | Operator click patches status/lifecycle/redaction/note. | Background process patches route status automatically. | PATCH requires manual action and bounded payload validation. | `[passalongId]/route.ts`, UI controls | No auto-route. |
| A27-034 | No automatic passalong sending | UI displays copyable/static packet only. | Save action sends passalong to other chat/service. | No send path exists; non-authorization copy remains visible. | UI static scan, route handlers | No external API calls. |
| A27-035 | No automatic route execution | Status update persists descriptive metadata. | Status update executes work or changes route authority. | No execution path exists; status is descriptive only. | `passalong-persistence-boundary.ts`, route handlers | No work-packet execution. |
| A27-036 | Safe unavailable fallback | DB/table/config unavailable returns safe unavailable status and static sample fallback. | UI crashes or implies durable persistence exists. | Safe unavailable message; records remain non-authoritative. | `unavailableListResult`, `page.tsx`, UI copy | Do not connect to deployed DB for A27. |
| A27-037 | UI app-local/non-authoritative copy | Persistence panel displays app-local and non-authoritative posture. | UI implies final approval or source of truth. | UI copy preserves boundary. | `PassalongRouterPrototype.tsx` | Static text assertion candidate. |
| A27-038 | UI CONTROL_THREAD authority copy | UI displays CONTROL_THREAD remains authority. | UI says persisted record is CONTROL_THREAD acceptance. | Boundary copy remains explicit. | `PassalongRouterPrototype.tsx` | Copy check. |
| A27-039 | UI Linear mirror-only copy | UI displays Linear remains temporary mirror only. | UI implies Linear is source of truth. | Mirror-only copy remains explicit. | `PassalongRouterPrototype.tsx` | Copy check. |
| A27-040 | Non-authorization scan | Static scan finds only negated/boundary-framed hits. | Scan finds active GitHub/provider/sandbox/agent/deploy/import behavior. | Future implementation-test lane blocks closeout until reviewed. | Source scan command | Required before A28 closeout. |

## 5. Bounded persisted-field cases

Future local tests should confirm `PersistedPassalongRecord` uses only the A24 field set:

- Allowed metadata: `id`, `passalongId`, `createdAt`, `updatedAt`, `archivedAt`, `deletedAt`, `redactionState`, `schemaVersion`.
- Constrained fields: `sourceThreadId`, `targetThreadId`, source/target labels, `scope`, `mode`, `summary`, `requestedDecision`, `routeStatus`, `authorityBoundary`, `nonAuthorizations`, `sandboxPosture`, `importAdoptionPosture`, `archiveState`.
- Reference-only field: `evidencePointers`.
- Redaction-gated field: `manualOperatorNote`.

Documentation example only:

```ts
// Example test intent only; do not add in A27.
expect(validatePersistedPassalongCreateInput(validFixture).ok).toBe(true);
expect(validatePersistedPassalongCreateInput({ ...validFixture, routeStatus: "auto_sent" }).ok).toBe(false);
```

## 6. Constrained field-limit cases

Future local tests should cover:

- `summary` maximum length of `1200`.
- `requestedDecision` maximum length of `1200`.
- `manualOperatorNote` maximum length of `1000`.
- `evidencePointers` entry maximum handling at `300`.
- `scope`, `mode`, labels, authority boundary, sandbox posture, and non-authorization bounds.

Expected result: oversized free text is rejected or blocked according to the helper boundary. If a helper truncates reference arrays, the future A28 lane should explicitly decide whether truncation is acceptable or should become rejection.

## 7. Redaction and secret-risk cases

Future local tests should include negative fixtures for:

- provider API keys
- API keys
- platform tokens
- database credentials
- connection strings
- passwords
- private keys
- raw `.env` content
- secret-bearing logs
- credential-bearing evidence pointers
- hidden chain-of-thought/private reasoning
- target repo source/import code
- production telemetry

Expected result: validation blocks persistence and returns a redaction/secret-risk message. `blocked_secret_risk` must prevent persistence until redaction occurs.

Use fake placeholder strings only. Do not use real secrets.

## 8. Evidence pointer cases

Future local tests should confirm evidence pointers remain references:

- Positive: repo-relative docs/reference path, artifact id, non-secret label.
- Negative: credential-bearing URL, connection string, raw log content, unredacted screenshot description with credentials, full document content, provider prompt containing secrets, target repo source, generated import code.

Expected result: reference-only pointers pass; raw or credential-bearing content is blocked or flagged as excluded.

## 9. Route-status vocabulary cases

Future local tests should cover the exact A16 vocabulary:

- `draft`
- `queued`
- `needs_review`
- `recommended`
- `approved_for_manual_passalong`
- `sent_manually`
- `held`
- `rejected`
- `archived`

Negative examples:

- `auto_sent`
- `auto_route`
- `executing`
- `approved`
- `production_ready`

Expected result: invalid vocabulary is rejected. Valid vocabulary remains descriptive metadata only and never creates CONTROL_THREAD acceptance, route authority, or execution authority.

## 10. Lifecycle marker cases

Future local tests should cover:

- `active`: current app-local record posture only.
- `archived`: app-local archive marker only, with `archivedAt`.
- `marked_for_delete`: app-local delete-review marker only, with `deletedAt`.

Negative examples:

- `hard_deleted`
- `purged`
- `source_of_truth_deleted`

Expected result: invalid states are rejected. Archive and delete markers do not hard delete, mutate source-of-truth records, prove delivery, alter CONTROL_THREAD decisions, trigger background cleanup, or authorize automatic deletion.

## 11. Manual-only route behavior cases

Future local tests should cover route/API behavior with mocks/fixtures:

- `GET /operator/control-thread/passalongs` lists app-local records or safe unavailable fallback.
- `POST /operator/control-thread/passalongs` creates/upserts only after explicit operator action and validation.
- `PATCH /operator/control-thread/passalongs/[passalongId]` updates bounded metadata only after explicit operator action and validation.
- Direct `GET` on `[passalongId]` remains non-mutating and returns method-boundary copy.

Negative cases:

- no automatic create during render
- no background PATCH
- no send passalong behavior
- no route execution behavior
- no provider/model call
- no sandbox runtime call
- no JAI Agent dispatch
- no GitHub mutation
- no target-repo import

## 12. Safe unavailable fallback cases

Future local tests should verify unavailable persistence does not break the operator surface:

- Mock missing DB/table/config and assert `available: false`.
- Assert safe message says persistence is unavailable and static sample records remain fallback only.
- Assert no stack trace, credential, raw environment value, or connection string is returned.
- Assert no durable state is implied.

A27 does not authorize connecting to any deployed database to test this.

## 13. Non-authoritative UI/API copy cases

Future local tests should statically assert visible UI/API copy:

- Persisted records are app-local and non-authoritative.
- Route status is descriptive metadata only.
- Archive/delete lifecycle is app-local only.
- CONTROL_THREAD remains authority.
- Linear remains temporary mirror only.
- No automatic passalong sending.
- No automatic route execution.
- No JAI Agent activation.
- No sandbox runtime activation.
- No GitHub mutation.
- No target-repo import.
- No deployment or production gate opening.
- Evidence pointer references are not validation approval.
- Manual notes are not route authority.

Negative copy cases should fail if UI/API text implies approval, CONTROL_THREAD acceptance, route authority, execution authority, delivery proof, source-of-truth transfer, sandbox activation, JAI Agent activation, GitHub mutation, target-repo adoption, deployment, or production readiness.

## 14. Non-authorization scan requirements

Future A28 implementation-test lane should include static scans equivalent to:

```bash
rg -n "send passalong|auto-send|automatic send|auto-route|automatic route|dispatch.*agent|Agent PR Factory|sandbox runtime|createPullRequest|pull request|create branch|delete branch|merge branch|github|octokit|deploy|production gate|target-repo import|source-of-truth transfer|migrate deploy|migrate dev|DROP TABLE|DELETE FROM" portal/src/lib/controlPlane/threadMemory portal/src/app/operator/control-thread portal/prisma/schema.prisma portal/prisma/migrations
```

Expected result: hits must be negated, boundary-framed, static fixture text, or reviewed schema/migration artifacts. Any active behavior path should block closeout.

Future secret scan should include:

```bash
rg -n "api[_-]?key|secret|token|password|private key|BEGIN RSA|BEGIN OPENSSH|DATABASE_URL|connection string|postgres://|mysql://|mongodb://|sk-[A-Za-z0-9]|raw \\.env|chain-of-thought|private reasoning|target repo source|production telemetry" portal/src/lib/controlPlane/threadMemory portal/src/app/operator/control-thread portal/prisma/schema.prisma portal/prisma/migrations
```

Expected result: no real secret values. Hits should be validation patterns, boundary wording, field names, or pre-existing unrelated auth schema terms.

## 15. Implementation-test routing recommendation

Recommendation: route a future A28 implementation-test lane, but do not authorize it from A27.

Recommended future lane:

`Q3M7 Control Thread Passalong Local Boundary Test Implementation v0`

Required posture for A28:

- local-only tests
- no migration application
- no deployed database mutation
- no target-environment confirmation
- no provider/model/API dispatch
- no sandbox runtime activation
- no JAI Agent activation
- no GitHub automation
- no accepted-code import
- no target-repo import
- no deployment
- no production gates

Recommended A28 test strategy:

- Prefer helper-level unit tests for `validatePersistedPassalongCreateInput`, `validatePersistedPassalongPatchInput`, and lifecycle merge behavior.
- Prefer static UI/API copy tests or snapshots for boundary copy.
- Prefer mocked repository/route tests for unavailable fallback.
- Use fixtures/mocks/local static validation unless CONTROL_THREAD separately authorizes a specific local database test environment.

Migration application and target-environment confirmation remain blocked after A27.

## 16. Risks and blockers

Risks:

- Secret-risk checks are conservative and pattern-based, not comprehensive DLP.
- Current evidence pointer string handling may truncate oversized entries; a future implementation-test lane should decide whether truncation is acceptable or should become rejection.
- UI copy could drift and imply authority unless static copy tests are routed.
- Route handlers could be expanded later unless non-authorization scans remain required.
- Local DB-backed tests could accidentally become target-environment tests unless explicitly mocked or separately authorized.

Blockers:

- No migration application.
- No deployed database mutation.
- No target-environment confirmation.
- No sandbox proof path.
- No JAI Agent stress-test.
- No accepted-code import.
- No GitHub automation.
- No deployment.
- No production gates.

## 17. Validation

A27 validation:

- `git diff --check`

No repo-local docs/reference validation command was found. No runtime validation was run. No migration tests were run. No migrations were applied. No database connection was attempted. No APIs, providers, or models were called. No sandbox-nexus execution occurred. No JAI Agent activation occurred. No deployment or production-gate action occurred.

## 18. Authority boundary

A27 is a documentation/test-plan artifact only. It does not authorize implementation tests, migration application, deployed database mutation, target-environment confirmation, production API routing, provider/model dispatch, secret use, customer data access, autonomous execution, JAI Agent activation, sandbox-nexus runtime activation, accepted-code import, target-repo import, GitHub automation, PR automation, deployment, production gates, or source-of-truth transfer.

CONTROL_THREAD remains authority. Linear remains temporary mirror only. A27 test cases, future A28 recommendations, persisted records, route statuses, lifecycle markers, schema/migration files, and UI/API copy are not final CONTROL_THREAD acceptance, route authority, execution authority, source of truth, target-repo adoption, sandbox activation, JAI Agent activation, GitHub mutation authority, deployment authority, or production gate authority.

## 19. Repo-lane closeout

Files changed:

- `docs/reference/q3m7-control-thread-passalong-local-boundary-test-plan-v0.md`

Test-plan summary:

- Defines local/static positive and negative boundary cases for A25 passalong persistence before migration-readiness, target-environment confirmation, sandbox proof path, JAI Agent stress-test, or accepted-code import routing.

Positive boundary cases:

- Allowed fields, bounded constrained fields, reference-only evidence pointers, valid route statuses, valid lifecycle markers, manual create/upsert, manual bounded PATCH, safe unavailable fallback, and non-authoritative UI/API copy.

Negative boundary cases:

- Excluded secret-bearing content, invalid vocabularies, oversized fields, raw evidence content, physical hard delete, automatic send, automatic route execution, sandbox runtime activation, JAI Agent activation, GitHub mutation, target-repo import, deployment, production gates, and source-of-truth transfer.

Secret/redaction test cases:

- Provider/API/platform/database credential patterns, connection strings, passwords, private keys, raw `.env`, unredacted logs/screenshots, full transcripts/prompts containing secrets, hidden/private reasoning, target repo source/import code, unreviewed runtime output, production telemetry, and credential-bearing evidence pointers.

Manual-only route behavior cases:

- Future tests should verify `GET`, `POST`, and `PATCH` route behavior remains app-local persistence access only and is triggered only by explicit operator action.

Safe unavailable fallback cases:

- Future tests should mock missing DB/table/config and confirm safe unavailable responses without secrets, stack traces, or durable-state implication.

Non-authoritative UI/API copy cases:

- Future tests should assert app-local/non-authoritative, CONTROL_THREAD authority, Linear mirror-only, descriptive route status, app-local lifecycle, and non-authorization copy remains visible.

Validation:

- `git diff --check`

Push/PR boundary:

- This branch may be committed and pushed as a documentation branch after validation. A27 does not authorize PR creation, PR automation, merge, deployment, migration application, runtime activation, provider/API dispatch, sandbox activation, JAI Agent activation, target-repo import, accepted-code import, production gates, or CONTROL_THREAD acceptance.

Recommended next route:

- `Q3M7 Control Thread Passalong Local Boundary Test Implementation v0`
