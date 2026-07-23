# Q3M7Y26-P1 A11 Dependency and External-Effect Map v0

Role: JAI::DEV::BUILDER

## 1. Status, control coordinates, cutoff, and evidence ceiling

| Field | Value |
| --- | --- |
| Program | `Q3M7Y26-P1` |
| Batch / wave / lane | `A / A-C / A11 - Dependency and External-Effect Map v0` |
| Coordinate | `Q3M7Y26-P1:A11` |
| Route | `CT-2026-07-23-Q3M7Y26-P1-START-A11-DEPENDENCY-EXTERNAL-EFFECT-MAP-v0` |
| Repair route | `CT-2026-07-23-Q3M7Y26-P1-A11R1-REFERENCE-JOIN-COMPLETENESS-v0` |
| Redacted-boundary supplement | `CT-2026-07-23-Q3M7Y26-P1-A11-REDACTED-SEED-CREDENTIAL-BOUNDARY-v0` |
| Work Packet | `Q3M7Y26-P1-A11-v0` |
| Repository / base | `jai-nexus/dev-jai-nexus @ 34e84ac3240fd237e93e38502e8a860e32c24f3b` |
| Branch / allowlist | `docs/q3m7y26-p1-a11-dependency-external-effect-map-v0` / `docs/reference/q3m7y26-p1-a11-dependency-external-effect-map-v0.md` |
| Linear mirror | `JAI-193 / MIRROR_ONLY / NOT_MUTATED` |
| Source cutoff | `2026-07-23T03:02:00Z` |
| Inspection mode | `TRACKED_SOURCE_AND_TEST_CONFIGURATION_ONLY / NO_LIVE_ENVIRONMENT / NO_RUNTIME_EFFECT` |
| Evidence ceiling | `DOCUMENTATION_DEPENDENCY_EXTERNAL_EFFECT_MAP_ONLY` |

This artifact maps source reachability only. It does not exercise, validate,
activate, repair, or authorize a mapped dependency or effect. The only external
mutation authorized for this A11 delivery is the separately bounded Git push and
Draft PR creation/update described by the Work Packet. Those executor delivery
actions are not application-level GitHub reachability evidence.

## 2. Source priority and definitions

### 2.1 Priority

1. [A2] controls authority, freshness, contradiction, and status vocabulary.
2. [A4] through [A10] provide immutable documentary inputs; their merge does
   not imply CONTROL_THREAD acceptance.
3. Required-base tracked source, tests, package manifests, and workflows prove
   only the named static call path or declaration.
4. The 2026-07-22 founder report remains phase-specific UI-only evidence and
   does not prove an external effect or current-main deployment identity [A10].
5. Unavailable environment, credential, network, database, browser, and
   deployment evidence remains `UNAVAILABLE`, `UNRESOLVED`, or `DEFERRED`.

### 2.2 Artifact-local reachability vocabulary

| Class | Meaning |
| --- | --- |
| `DIRECT_SOURCE_REACHABLE` | A tracked entrypoint directly calls the named dependency or effect sink. |
| `GUARD_REACHABLE` | A tracked path can reach the sink only after named authentication, authorization, configuration, or runtime gates. |
| `CONFIG_DECLARATION_ONLY` | Source or workflow declares a command, identifier, or configuration shape without a proved current caller. |
| `TEST_ONLY_OR_MOCK` | The named path is a test, mock, fixture, or deterministic local substitute. |
| `STATIC_UI_OR_DOCUMENTARY` | A label, preview, receipt, or documentation surface has no proved effect call. |
| `ABSENT_FROM_BOUNDED_SCAN` | No executable caller was found in the stated scan boundary; this is not an organization-wide absence claim. |
| `UNRESOLVED` | Source establishes a material seam but not the required environment, completed operation, or audit receipt. |

`STATIC_CONFIGURATION`, `RATIFIED_PHASE_SPECIFIC`, `MIRROR_ONLY`,
`UNAVAILABLE`, `UNRESOLVED`, and `DEFERRED` below retain their A2 meanings.
Import presence is not invocation; route presence is not a completed request;
credential identifiers are not credential values or configured credentials.
`SEED_PATH_SOURCE_REACHABLE` means the tracked source path is reachable only
through explicit Prisma seed invocation. It proves neither seed execution nor
production reachability.

## 3. Dependency-node registry

Schema: stable `dependency_id`; one exact source reference; `reachability` is
artifact-local and `evidence_class` is A2-derived.

<!-- A11_DEPENDENCY_START -->
| dependency_id | class | source entrypoint / target | trigger | credential identifier | reachability | evidence_class | current non-effect |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `A11-DEP-001` | Session authentication | NextAuth credentials provider, JWT callback, and server session helper | Sign-in or protected server call | `NEXTAUTH_SECRET` | `GUARD_REACHABLE` | `STATIC_CONFIGURATION` | No authenticated session, credential validation, or production access was exercised. |
| `A11-DEP-002` | Edge request gate | Middleware re-export and gatekeeper token/session checks | Protected page or API request | `NEXTAUTH_SECRET`, `JAI_INTERNAL_API_TOKEN` | `GUARD_REACHABLE` | `STATIC_CONFIGURATION` | Source guards do not prove the intended global authorization model. |
| `A11-DEP-003` | Database client | PrismaPg pool and Prisma client | Server import followed by Prisma call | `DIRECT_URL`, `DATABASE_URL` | `GUARD_REACHABLE` | `STATIC_CONFIGURATION` | Client construction does not prove database availability or a completed query. |
| `A11-DEP-004` | `TRACKED_CREDENTIAL_LIKE_SEED_LITERAL` | Tracked Prisma seed declaration | Declared Prisma seed entrypoint | `REDACTED / NOT_RECORDED / NOT_VALIDATED` | `SEED_PATH_SOURCE_REACHABLE` | `UNRESOLVED` | Value, validity, reuse, rotation, production reachability, and authority effect are unverified. |
| `A11-DEP-005` | Context API authentication | Context API bearer comparison | `/api/repos` and named in-route callers | `JAI_CONTEXT_API_KEY` | `GUARD_REACHABLE` | `STATIC_CONFIGURATION` | No request or key validation was performed. |
| `A11-DEP-006` | SoT ingest authentication | Session, ingest-token, or internal-token alternative | SoT ingest route | `SOT_INGEST_TOKEN`, `NEXTAUTH_SECRET`, `JAI_INTERNAL_API_TOKEN` | `GUARD_REACHABLE` | `STATIC_CONFIGURATION` | No ingest or event creation occurred. |
| `A11-DEP-007` | Provider configuration | Server-only provider status and credential accessor | Manual inference route requests env-gated mode | `JAI_MODEL_SLOT_API_KEY` | `GUARD_REACHABLE` | `STATIC_CONFIGURATION` | Identifier presence does not prove configuration or a provider call. |
| `A11-DEP-008` | OpenAI provider connector | Dynamic SDK import and chat-completion call | Configured manual provider deliberation | `JAI_MODEL_SLOT_API_KEY` | `GUARD_REACHABLE` | `UNRESOLVED` | No provider invocation, output, cost, or side effect was observed. |
| `A11-DEP-009` | Local mock deliberation | Deterministic role/model-slot mock output | Manual mock mode or unavailable provider fallback | `NONE_EVIDENCED` | `TEST_ONLY_OR_MOCK` | `STATIC_CONFIGURATION` | Mock output is advisory and is not Agent, Council, or provider activation. |
| `A11-DEP-010` | Motion and deliberation persistence | Motion-intake and deliberation-history adapters | Corresponding route POST | `DIRECT_URL`, `DATABASE_URL` | `GUARD_REACHABLE` | `UNRESOLVED` | Fallback code does not prove durable write or readback. |
| `A11-DEP-011` | Passalong persistence | Passalong collection/detail persistence adapter | Passalong route GET/POST/PATCH | `DIRECT_URL`, `DATABASE_URL` | `GUARD_REACHABLE` | `UNRESOLVED` | Availability and failed/succeeded distinction are source contracts only. |
| `A11-DEP-012` | Internal HTTP client | Node fetch client for internal repo and wave APIs | Explicit library caller | `JAI_INTERNAL_API_BASE`, `JAI_INTERNAL_API_TOKEN` | `DIRECT_SOURCE_REACHABLE` | `UNRESOLVED` | No HTTP request, response, or downstream mutation occurred. |
| `A11-DEP-013` | Sync Run operator proxy | Same-origin fetch from operator proxy to internal apply/reject | Explicit POST to dev-only proxy | `OPERATOR_DEV_BYPASS_TOKEN`, `JAI_INTERNAL_API_TOKEN` | `GUARD_REACHABLE` | `UNRESOLVED` | No Sync Run, filesystem, or database result was exercised. |
| `A11-DEP-014` | Workspace filesystem staging | Local workspace path helpers and Node filesystem APIs | Internal agent commit/apply/reject routes | `JAI_INTERNAL_API_TOKEN` | `GUARD_REACHABLE` | `UNRESOLVED` | No staged edit, copy, cleanup, or repository mutation occurred. |
| `A11-DEP-015` | Process execution | Spawned `pnpm exec tsx` repo-sync process | Internal sync-repos POST on non-Vercel runtime | `NONE_EVIDENCED` | `GUARD_REACHABLE` | `UNRESOLVED` | No process, script, artifact, or database run record was created. |
| `A11-DEP-016` | GitHub REST promotion | GitHub REST reads and writes for draft motion promotion | Admin session, flag, exact target repo, token, and confirmation | `JAI_MOTION_PROMOTION_GITHUB_TOKEN` | `GUARD_REACHABLE` | `UNRESOLVED` | No GitHub API call, branch, commit, tree, blob, or PR was created by the application. |
| `A11-DEP-017` | Browser clipboard | `navigator.clipboard.writeText` controls | Explicit founder copy action | `NONE_EVIDENCED` | `DIRECT_SOURCE_REACHABLE` | `UNRESOLVED` | Source does not prove copied bytes, retention, paste, or disclosure. |
| `A11-DEP-018` | Package and workflow executables | Root/portal scripts and CI workflow commands | Human/CI invocation outside application request path | Workflow secret identifiers only where declared | `CONFIG_DECLARATION_ONLY` | `STATIC_CONFIGURATION` | A declaration is not a live run, Codex dispatch, Agent dispatch, or deployment. |
| `A11-DEP-019` | Agent and Council surfaces | Mock/manual model slots and static sandbox/prototype surfaces | UI rendering or manually invoked local logic | `NONE_EVIDENCED` | `STATIC_UI_OR_DOCUMENTARY` | `STATIC_CONFIGURATION` | No Agent identity, Council vote, provider dispatch, or JAI activation is established. |
<!-- A11_DEPENDENCY_END -->

Observed dependency count: **19 unique records**.

## 4. Credential-identifier registry

Schema: identifiers only. No value, prefix, length, hash, validation, or
environment lookup is recorded.

<!-- A11_CREDENTIAL_START -->
| credential_id | identifier or redacted subject | source path | source use | value posture | validity / reuse / rotation | current effect |
| --- | --- | --- | --- | --- | --- |
| `A11-CRED-001` | `NEXTAUTH_SECRET` | [AUTH], [GATEKEEPER], [LOCAL-LOOP-ROUTE], [SOT-AUTH] | JWT/session verification | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No session was verified. |
| `A11-CRED-002` | `JAI_INTERNAL_API_TOKEN` | [GATEKEEPER], [INTERNAL-AUTH], [INTERNAL-CLIENT] | Machine-token comparison and internal HTTP header | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No internal request occurred. |
| `A11-CRED-003` | `JAI_CONTEXT_API_KEY` | [CONTEXT-AUTH] | Context API bearer comparison | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No context API call occurred. |
| `A11-CRED-004` | `SOT_INGEST_TOKEN` | [SOT-AUTH] | SoT ingest alternative authentication | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No ingest occurred. |
| `A11-CRED-005` | `OPERATOR_DEV_BYPASS_TOKEN` | [SYNC-APPLY-PROXY], [SYNC-REJECT-PROXY] | Optional dev-only proxy guard | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No proxy request occurred. |
| `A11-CRED-006` | `JAI_MODEL_SLOT_API_KEY` | [PROVIDER-CONFIG], [PROVIDER-CONNECTOR] | Server-only provider credential accessor | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No provider call occurred. |
| `A11-CRED-007` | `JAI_MOTION_PROMOTION_GITHUB_TOKEN` | [MOTION-PROMOTION] | GitHub REST authorization header | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No application GitHub operation occurred. |
| `A11-CRED-008` | `DATABASE_URL` | [PRISMA], [PORTAL-CI], [SYNC-WORKFLOW] | Prisma/PG connection declaration | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No live database connection was made by A11. |
| `A11-CRED-009` | `DIRECT_URL` | [PRISMA], [PORTAL-CI] | Preferred Prisma/PG connection declaration | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No live database connection was made by A11. |
| `A11-CRED-010` | `TRACKED_CREDENTIAL_LIKE_SEED_LITERAL` | [PRISMA-SEED] | `adminPasswordHash` declaration in seed-function hash input; passed to Prisma user-upsert password-hash property | `REDACTED / NOT_RECORDED / NOT_VALIDATED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | `NONE`; only `SEED_PATH_SOURCE_REACHABLE` is established. |
| `A11-CRED-011` | `REPO_SYNC_TOKEN_ORG` | [SYNC-WORKFLOW] | Workflow-declared repository synchronization credential identifier | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No workflow or GitHub operation was invoked. |
| `A11-CRED-012` | `REPO_SYNC_TOKEN_USER` | [SYNC-WORKFLOW] | Workflow-declared repository synchronization credential identifier | `NOT_RECORDED` | `UNVERIFIED / UNVERIFIED / UNVERIFIED` | No workflow or GitHub operation was invoked. |
<!-- A11_CREDENTIAL_END -->

Observed credential-identifier count: **12 unique records**. The redacted seed
finding requires `SEPARATELY_ROUTED_SECURITY_REMEDIATION_DECISION`; A11 does
not decide whether the literal is safe, synthetic, active, reused, or compromised.

## 5. External and persistent effect-sink registry

<!-- A11_EFFECT_START -->
| effect_id | effect class / source path | operation and target | guard / activation gate | reachability | rollback or audit posture | explicit current non-effect |
| --- | --- | --- | --- | --- | --- | --- |
| `A11-EFF-001` | Auth DB read / [AUTH] | User lookup and password-hash comparison | Credentials provider and `NEXTAUTH_SECRET` | `GUARD_REACHABLE` | `UNAVAILABLE` | No login or user read occurred. |
| `A11-EFF-002` | Motion intake DB write / [MOTION-INTAKE-PERSIST] | Insert and list `MotionIntakeRecord` | Route payload plus database configuration | `GUARD_REACHABLE` | Safe fallback only; durable receipt `UNAVAILABLE` | No motion was persisted. |
| `A11-EFF-003` | Deliberation-history DB write / [DELIBERATION-HISTORY] | Store manual/provider deliberation history | Manual-inference POST plus database configuration | `GUARD_REACHABLE` | Safe fallback only; durable receipt `UNAVAILABLE` | No deliberation history was persisted. |
| `A11-EFF-004` | Passalong DB read/write / [PASSALONG-PERSIST] | Persist/list passalong records | Passalong route plus database configuration | `GUARD_REACHABLE` | Adapter reports availability; completed effect `UNAVAILABLE` | No passalong was written or read. |
| `A11-EFF-005` | Registry DB mutation / [REGISTRY-DOMAIN-NEW], [REGISTRY-DOMAIN-DETAIL] | Create, update, delete domain rows | Session, operator layout, exact admin-email source guard | `GUARD_REACHABLE` | `UNAVAILABLE` | No registry row or domain/provider effect occurred. |
| `A11-EFF-006` | Registry DB mutation / [REGISTRY-REPO-NEW], [REGISTRY-REPO-DETAIL] | Create, update, delete repository rows | Session, operator layout, exact admin-email source guard | `GUARD_REACHABLE` | `UNAVAILABLE` | No registry row, GitHub, or repository effect occurred. |
| `A11-EFF-007` | SoT/Event/Chat/DCT persistence / [SOT-INGEST], [CHAT-INGEST], [DCT-IDEA] | Route-specific Prisma reads or mutations | Named in-route auth and database configuration | `GUARD_REACHABLE` | `UNAVAILABLE` | No event, chat, DCT, or related record was created. |
| `A11-EFF-008` | Agent staged-edit filesystem write / [INTERNAL-AGENT-COMMIT] | Write proposed content below `.jai-agent-edits/<id>` | Internal token, non-Vercel runtime, path sanitization, repository row | `GUARD_REACHABLE` | SyncRun record and checksum are source-defined; receipt `UNAVAILABLE` | No staged file was written. |
| `A11-EFF-009` | Sync Run apply filesystem and DB mutation / [INTERNAL-APPLY] | Copy staged files into workspace repo, update SyncRun, remove staging | Internal token, non-Vercel runtime, pending review, sanitized path | `GUARD_REACHABLE` | Source-defined applied-file metadata; completed effect `UNAVAILABLE` | No file copy, cleanup, or SyncRun update occurred. |
| `A11-EFF-010` | Sync Run reject filesystem and DB mutation / [INTERNAL-REJECT] | Remove staged files and mark SyncRun rejected | Internal token, non-Vercel runtime, pending review | `GUARD_REACHABLE` | Source-defined status update; completed effect `UNAVAILABLE` | No cleanup or SyncRun update occurred. |
| `A11-EFF-011` | Repo-sync process, artifacts, and DB run record / [INTERNAL-SYNC-REPOS] | Spawn repo-sync, write logs/artifacts, create/update PilotRun | Non-Vercel runtime and route invocation | `GUARD_REACHABLE` | Source-defined run record; completed process/effect `UNAVAILABLE` | No process, file, or database run occurred. |
| `A11-EFF-012` | GitHub REST read/write / [MOTION-PROMOTION] | Read refs/contents and create blobs, tree, commit, and branch | Authenticated exact-admin session, feature flag, exact repo, token, confirmation | `GUARD_REACHABLE` | API response is source-defined; live audit receipt `UNAVAILABLE` | No application GitHub request or mutation occurred. |
| `A11-EFF-013` | Provider/model network call / [PROVIDER-CONNECTOR] | OpenAI chat completion | Enabled provider config, supported provider, model, server credential, manual route | `GUARD_REACHABLE` | Safe fallback is source-defined; invocation/cost/response receipt `UNAVAILABLE` | No provider request occurred. |
| `A11-EFF-014` | Browser clipboard write / [LOCAL-PANEL] | Write redacted boundary receipt text | Secure context, browser API, coherent terminal state, explicit founder action | `DIRECT_SOURCE_REACHABLE` | UI settlement state only; bytes/retention/paste audit `UNAVAILABLE` | A11 did not invoke clipboard access. |
| `A11-EFF-015` | Same-origin browser/API fetch / [MOTION-COMPOSER], [MANUAL-INFERENCE-UI], [PASSALONG-UI] | Submit motion, manual inference, or passalong requests | UI event and each route's independent contract | `DIRECT_SOURCE_REACHABLE` | Request/result evidence `UNAVAILABLE` | A11 did not submit a request. |
| `A11-EFF-016` | Operator Sync Run proxy fetch / [SYNC-APPLY-PROXY], [SYNC-REJECT-PROXY] | Call internal apply/reject endpoint | Non-production, optional bypass token, internal token | `GUARD_REACHABLE` | Proxy response only; downstream receipt `UNAVAILABLE` | A11 did not invoke a proxy. |
| `A11-EFF-017` | Prisma seed DB mutation / [PRISMA-SEED], [PRISMA-CONFIG] | Seed users and related fixture data through Prisma seed command | Explicit seed command plus runtime database configuration | `SEED_PATH_SOURCE_REACHABLE` | Seed execution/audit receipt `UNAVAILABLE` | A11 did not execute seed, database, or authentication behavior. |
| `A11-EFF-018` | Workflow repository synchronization / [SYNC-WORKFLOW] | CI workflow probes GitHub and runs repository synchronization script | Manual or configured workflow trigger and workflow secret identifiers | `CONFIG_DECLARATION_ONLY` | Workflow logs/artifacts are external to A11 inspection | A11 did not dispatch workflow, GitHub, or repository action. |
| `A11-EFF-019` | Package-script filesystem/process operations / [ROOT-PACKAGE], [PORTAL-PACKAGE] | Declared seed, migration, snapshot, council, grid, and export commands | Human/CI command invocation and each script's own gates | `CONFIG_DECLARATION_ONLY` | Script-specific receipt `UNAVAILABLE` | A11 did not run package, process, Codex, Agent, or Council commands. |
| `A11-EFF-020` | Node/internal HTTP requests / [INTERNAL-CLIENT] | Node `fetch` requests to internal repository and wave endpoints | Explicit exported client-method call plus internal base/token configuration | `DIRECT_SOURCE_REACHABLE` | Request/result evidence `UNAVAILABLE`; no identifier-based caller was found in the bounded scan | A11 did not invoke an internal HTTP request. |
<!-- A11_EFFECT_END -->

Observed effect-sink count: **20 unique records**.

## 6. Entry-point-to-dependency edge registry

<!-- A11_EDGE_START -->
| edge_id | entrypoint | dependency_id | effect_id | trigger | guard / gate | reachability |
| --- | --- | --- | --- | --- | --- | --- |
| `A11-EDGE-001` | `/api/auth/[...nextauth]` | `A11-DEP-001` | `A11-EFF-001` | Credential sign-in | NextAuth credentials flow | `GUARD_REACHABLE` |
| `A11-EDGE-002` | Shared protected request | `A11-DEP-002` | `NONE` | Page/API request | Gatekeeper session or in-route token lane | `GUARD_REACHABLE` |
| `A11-EDGE-003` | Motion intake composer -> motion-intake route | `A11-DEP-010` | `A11-EFF-002`, `A11-EFF-015` | Founder submit | Route parsing and database configuration | `GUARD_REACHABLE` |
| `A11-EDGE-004` | Manual deliberation action -> manual-inference route | `A11-DEP-007`, `A11-DEP-008`, `A11-DEP-010` | `A11-EFF-003`, `A11-EFF-013`, `A11-EFF-015` | Explicit manual action | Requested mode and provider/database gates | `GUARD_REACHABLE` |
| `A11-EDGE-005` | Passalong router -> collection/detail route | `A11-DEP-011` | `A11-EFF-004`, `A11-EFF-015` | Explicit create/list/edit request | Route contract and database configuration | `GUARD_REACHABLE` |
| `A11-EDGE-006` | Local operating-loop panel -> route | `A11-DEP-001` | `NONE` | Validate/deliberate/decide local-shadow request | JWT, ADMIN role, normalized actor, proof coherence | `GUARD_REACHABLE` |
| `A11-EDGE-007` | Sync review action -> apply proxy | `A11-DEP-013` | `A11-EFF-016` | Explicit Apply click | Non-production and optional bypass-token gate | `GUARD_REACHABLE` |
| `A11-EDGE-008` | Sync review action -> reject proxy | `A11-DEP-013` | `A11-EFF-016` | Explicit Reject click | Non-production and optional bypass-token gate | `GUARD_REACHABLE` |
| `A11-EDGE-009` | Apply proxy -> internal agent apply | `A11-DEP-014` | `A11-EFF-009` | Proxy POST | Internal token, pending review, non-Vercel runtime | `GUARD_REACHABLE` |
| `A11-EDGE-010` | Reject proxy -> internal agent reject | `A11-DEP-014` | `A11-EFF-010` | Proxy POST | Internal token, pending review, non-Vercel runtime | `GUARD_REACHABLE` |
| `A11-EDGE-011` | Internal agent commit route | `A11-DEP-014` | `A11-EFF-008` | Internal POST | Internal token, path sanitization, non-Vercel runtime | `GUARD_REACHABLE` |
| `A11-EDGE-012` | Internal sync-repos route | `A11-DEP-015` | `A11-EFF-011` | Internal POST | Non-Vercel runtime; route-specific access boundary | `GUARD_REACHABLE` |
| `A11-EDGE-013` | Motion contender form -> promotion route | `A11-DEP-016` | `A11-EFF-012` | Typed confirmation and POST | Exact-admin session, feature flag, repo, token | `GUARD_REACHABLE` |
| `A11-EDGE-014` | Domain registry actions | `A11-DEP-003` | `A11-EFF-005` | Create/edit/delete form action | Session plus exact admin-email source guard | `GUARD_REACHABLE` |
| `A11-EDGE-015` | Repository registry actions | `A11-DEP-003` | `A11-EFF-006` | Create/edit/delete form action | Session plus exact admin-email source guard | `GUARD_REACHABLE` |
| `A11-EDGE-016` | SoT/Event/Chat/DCT API routes | `A11-DEP-003`, `A11-DEP-005`, `A11-DEP-006` | `A11-EFF-007` | Route-specific request | In-route token/session guards | `GUARD_REACHABLE` |
| `A11-EDGE-017` | Boundary-receipt copy control | `A11-DEP-017` | `A11-EFF-014` | Explicit copy action | Browser secure-context and coherent-state checks | `DIRECT_SOURCE_REACHABLE` |
| `A11-EDGE-018` | Portal/root package scripts | `A11-DEP-018` | `A11-EFF-017`, `A11-EFF-019` | Human or CI command | Command-specific configuration | `CONFIG_DECLARATION_ONLY` |
| `A11-EDGE-019` | Repository-sync workflow | `A11-DEP-018` | `A11-EFF-018` | Workflow dispatch/schedule configuration | Workflow secret identifiers and workflow environment | `CONFIG_DECLARATION_ONLY` |
| `A11-EDGE-020` | Agent/Council/sandbox UI surfaces | `A11-DEP-009`, `A11-DEP-019` | `NONE` | UI render or mock/manual helper | Static/mock non-authorization contract | `STATIC_UI_OR_DOCUMENTARY` |
| `A11-EDGE-021` | Prisma seed entrypoint | `A11-DEP-004`, `A11-DEP-018` | `A11-EFF-017` | Explicit Prisma seed invocation | Prisma seed declaration and runtime database configuration | `SEED_PATH_SOURCE_REACHABLE` |
| `A11-EDGE-022` | `jaiInternalClient.ts` exported `listRepos` / `createWave` / `logWaveAction` | `A11-DEP-012` | `A11-EFF-020` | Explicit exported client-method call; no identifier-based caller found in the bounded scan | Internal base/token configuration and each method's source guard | `DIRECT_SOURCE_REACHABLE` |
<!-- A11_EDGE_END -->

Observed edge count: **22 unique records**.

## 7. Effect-chain and activation-gate registry

<!-- A11_GATE_START -->
| gate_id | chain | required guard or activation condition | source evidence | evidence ceiling | current status |
| --- | --- | --- | --- | --- | --- |
| `A11-GATE-001` | Credential sign-in -> user lookup | Supplied credentials, DB availability, bcrypt result, `NEXTAUTH_SECRET` | [AUTH], [PRISMA] | Static source only | `UNRESOLVED` |
| `A11-GATE-002` | Protected request -> page/API | Valid JWT or route-specific auth exception | [GATEKEEPER] | Static source only | `UNRESOLVED` |
| `A11-GATE-003` | Context API route | Bearer identifier configured and valid; dev behavior differs | [CONTEXT-AUTH] | Static source only | `UNRESOLVED` |
| `A11-GATE-004` | SoT ingestion | Session, ingest token, or internal token | [SOT-AUTH] | Static source only | `UNRESOLVED` |
| `A11-GATE-005` | Provider completion | Enabled flag, provider, model, credential, supported provider, manual request | [PROVIDER-CONFIG], [PROVIDER-CONNECTOR], [MANUAL-INFERENCE-ROUTE] | Static source only | `UNRESOLVED` |
| `A11-GATE-006` | Motion/passalong/deliberation persistence | Route parse plus database configuration and completed query | [MOTION-INTAKE-ROUTE], [PASSALONG-ROUTE], [MANUAL-INFERENCE-ROUTE] | Static source only | `UNRESOLVED` |
| `A11-GATE-007` | Sync Run staged edit | Internal token, non-Vercel runtime, pending review, sanitized path | [INTERNAL-AGENT-COMMIT] | Static source only | `UNRESOLVED` |
| `A11-GATE-008` | Sync Run apply/reject | Operator proxy dev guard, internal token, pending review, workspace access | [SYNC-APPLY-PROXY], [SYNC-REJECT-PROXY], [INTERNAL-APPLY], [INTERNAL-REJECT] | Static source only | `UNRESOLVED` |
| `A11-GATE-009` | GitHub motion promotion | Authenticated exact-admin session, flag, repo match, token, confirmation | [MOTION-PROMOTION], [MOTION-PROMOTE-ROUTE] | Static source only | `UNRESOLVED` |
| `A11-GATE-010` | Browser clipboard | Secure context, browser API, coherent terminal state, explicit action | [LOCAL-PANEL] | Static source plus phase-specific A10 evidence | `UNRESOLVED` |
| `A11-GATE-011` | Seed execution | Explicit Prisma seed command and runtime database configuration | [PRISMA-CONFIG], [PRISMA-SEED], [PORTAL-PACKAGE] | Static source only | `UNRESOLVED` |
| `A11-GATE-012` | Workflow repo synchronization | Workflow trigger, declared secret identifiers, GitHub/network availability | [SYNC-WORKFLOW] | Workflow declaration only | `UNRESOLVED` |
| `A11-GATE-013` | Node/internal HTTP request | Explicit exported internal-client method call, internal base/token configuration, and reachable internal endpoint | [INTERNAL-CLIENT] | Static source only | `UNRESOLVED` |
<!-- A11_GATE_END -->

Observed activation-gate count: **13 unique records**. No gate is opened by
this artifact.

## 8. Founder-surface and route-to-effect matrix

<!-- A11_SURFACE_START -->
| surface_id | route or surface | reachable edge_ids | observed source posture | explicit non-effect |
| --- | --- | --- | --- | --- |
| `A11-SRF-001` | `/login` and NextAuth route | `A11-EDGE-001`, `A11-EDGE-002` | Credentials/session seam | No authentication attempt. |
| `A11-SRF-002` | `/operator/motion-control` intake | `A11-EDGE-003` | Motion persistence seam | No motion persistence. |
| `A11-SRF-003` | `/operator/motion-control` manual inference | `A11-EDGE-004` | Mock/provider and history seam | No provider or history effect. |
| `A11-SRF-004` | `/operator/motion-control` local loop | `A11-EDGE-006`, `A11-EDGE-017` | Local-shadow and clipboard seam | No decision, clipboard, or external effect. |
| `A11-SRF-005` | `/operator/control-thread` passalongs | `A11-EDGE-005` | Passalong persistence seam | No passalong action. |
| `A11-SRF-006` | `/operator/registry/domains` | `A11-EDGE-014` | Domain registry DB action seam | No DB, DNS, or provider effect. |
| `A11-SRF-007` | `/operator/registry/repos` | `A11-EDGE-015` | Repository registry DB action seam | No DB, GitHub, or repository effect. |
| `A11-SRF-008` | `/operator/motions` | `A11-EDGE-013` | GitHub promotion UI/route seam | No application GitHub operation. |
| `A11-SRF-009` | `/operator/sync-runs/[syncRunId]/review` | `A11-EDGE-007` through `A11-EDGE-010` | Dev-only proxy and local workspace seam | No apply, reject, staged edit, or repository mutation. |
| `A11-SRF-010` | `/api/repos`, SoT, Event, Chat, DCT routes | `A11-EDGE-016` | In-route auth and DB seam | No API or database request. |
| `A11-SRF-011` | `/api/internal/sync-repos` | `A11-EDGE-012` | Process/filesystem/DB seam | No process run or artifact write. |
| `A11-SRF-012` | `/api/internal/agents/commit` | `A11-EDGE-011` | Staged filesystem/SyncRun seam | No agent dispatch or file write. |
| `A11-SRF-013` | Agent, Council, and sandbox surfaces | `A11-EDGE-020` | Static or mock/manual display seam | No Agent/Council/JAI activation. |
<!-- A11_SURFACE_END -->

Observed route/surface count: **13 unique records**.

## 9. Authentication and authorization topology

| topology_id | subject | source guard | bounded conclusion | authority non-effect |
| --- | --- | --- | --- | --- |
| `A11-AUTH-001` | General pages/API | NextAuth JWT in [GATEKEEPER] | Session gate is source-reachable. | Authentication is not authority to mutate. |
| `A11-AUTH-002` | Internal APIs | Machine-token checks in [GATEKEEPER], [INTERNAL-AUTH] | Machine-token guard is source-reachable. | No token was read, validated, or used. |
| `A11-AUTH-003` | Context API | [CONTEXT-AUTH] | Config-dependent bearer gate, with source-declared development behavior. | A11 does not select or modify the policy. |
| `A11-AUTH-004` | SoT ingestion | [SOT-AUTH] | Session/token alternatives are source-reachable. | No event ingestion or authorization proof. |
| `A11-AUTH-005` | Local operating loop | JWT plus role/actor/proof checks in [LOCAL-LOOP-ROUTE] | Local-loop route has additional source checks. | Local ACCEPT is not CONTROL_THREAD acceptance. |
| `A11-AUTH-006` | Registry actions | Session plus exact admin-email source guard | Action-specific guard is source-reachable. | No ownership, registry, or external-domain authority. |
| `A11-AUTH-007` | Sync proxies | Non-production gate and optional bypass token | Dev-only source restriction is present. | No runtime/deployment claim. |
| `A11-AUTH-008` | Motion promotion | Session, exact-admin, flag, token, exact repo, confirmation | Multi-gated source path is present. | No branch, commit, or GitHub authority is granted. |

A10-GAP-006 remains `UNRESOLVED`: this map records multiple source-enforced
patterns but does not select, reconcile, or alter a global authorization model.

## 10. Negative isolation and test-evidence matrix

<!-- A11_NEGATIVE_START -->
| negative_id | bounded subject | result | evidence class | limitation |
| --- | --- | --- | --- | --- |
| `A11-NEG-001` | A11 executor activity | No mapped application effect invoked. | `STATIC_CONFIGURATION` | Bounded to A11's static source/test inspection; executor Git push/PR delivery is separate, authorized tooling. |
| `A11-NEG-002` | Live environment values | Not inspected. | `UNAVAILABLE` | Bounded to A11's value-free source inspection; identifier names do not prove values exist or work. |
| `A11-NEG-003` | Credential-like seed literal | Value suppressed and not recorded. | `UNRESOLVED` | Bounded to the redacted structural seed-path scan; structural seed-path reachability only. |
| `A11-NEG-004` | Provider/model behavior | No provider request invoked. | `UNRESOLVED` | Bounded to A11's source/test inspection; source connector can be guard-reachable. |
| `A11-NEG-005` | Clipboard disclosure | No clipboard API invoked. | `UNRESOLVED` | Bounded to A11's source/test inspection; source cannot prove bytes, retention, paste, or disclosure. |
| `A11-NEG-006` | GitHub application effect | No application REST call invoked. | `UNRESOLVED` | Bounded to A11's source/test inspection; promotion source is guard-reachable. |
| `A11-NEG-007` | Linear application effect | No executable Linear caller found in the bounded `portal/src`, `portal/scripts`, package-manifest, and workflow scan. | `ABSENT_FROM_BOUNDED_SCAN` | Does not prove organization-wide or external Linear absence; A12 remains separate. |
| `A11-NEG-008` | Codex/process application dispatch | No executable Codex caller found in the bounded application scan. Process scripts/routes are separately mapped where source-reachable. | `ABSENT_FROM_BOUNDED_SCAN` | Does not prove shell, CI, or executor-tool absence. |
| `A11-NEG-009` | Agent/Council activation | Static/mock/manual source surfaces are present; no activation was invoked. | `STATIC_UI_OR_DOCUMENTARY` | Bounded to A11's static source/test inspection; labels and mock outputs are not runtime proof. |
| `A11-NEG-010` | Focused tests | Fifteen specified tests are bounded deterministic evidence only. | `TEST_ONLY_OR_MOCK` | They do not prove live database, provider, network, filesystem, clipboard, or external effects [A9]. |
<!-- A11_NEGATIVE_END -->

Observed negative-isolation count: **10 unique records**.

## 11. Environment and runtime-evidence limitations

- No `.env`, `.env.local`, credential, token, cookie, session, keychain,
  browser, database, provider, API, deployment, or external-system value was
  inspected or exercised.
- `DATABASE_URL`, `DIRECT_URL`, provider identifiers, token identifiers, and
  workflow secret identifiers are names only; configuration, availability, and
  validity remain `UNVERIFIED`.
- The tracked [PRISMA-SEED] finding at line 121 is classified only as
  `TRACKED_CREDENTIAL_LIKE_SEED_LITERAL`: a `VariableDeclaration` / hash-call
  input in the local `main` seed function, passed through `adminPasswordHash`
  to a Prisma user-upsert password-hash property. The identifier-reference scan
  found no caller outside the tracked seed path, and [PRISMA-CONFIG] declares
  that path as the Prisma seed entrypoint. Its value is `REDACTED / NOT_RECORDED / NOT_VALIDATED`; credential validity, real-world reuse, rotation, and production reachability are `UNVERIFIED` / `UNKNOWN`. The bounded source scan establishes `SEED_PATH_SOURCE_REACHABLE` only. Current authority effect: `NONE`. Required future action: `SEPARATELY_ROUTED_SECURITY_REMEDIATION_DECISION`.
- Vercel/CI configuration and success, if later observed, cannot establish
  deployed source identity or completed application effects [A7], [A10].
- The 2026-07-22 founder report established `NO_MUTATION_OBSERVED` only in its
  bounded session. It does not establish side-effect absence or current-main
  deployment identity [A10].
- All `ABSENT_FROM_BOUNDED_SCAN` rows exclude historical embedded content in
  `portal/src/lib/motion/motionSnapshot.json`; they are not broad absence claims.

## 12. Gap, contradiction, and missing-proof ledger

<!-- A11_GAP_START -->
| gap_id | inherited or observed claim pair | classification | relation | current disposition | required missing proof | explicit non-effect |
| --- | --- | --- | --- | --- | --- | --- |
| `A11-GAP-001` | A9-GAP-002 tests versus live side effects | `UNRESOLVED` | `narrows` | Tests remain bounded deterministic evidence. | Separately authorized environment-bound receipt. | No live effect credit. |
| `A11-GAP-002` | A9-GAP-003 route/auth/Prisma presence versus durable persistence | `DEFERRED` | `does-not-supersede` | Source seams are mapped. | Authenticated request, completed write/readback, durable receipt. | No persistence credit. |
| `A11-GAP-003` | A9-GAP-006 / A10-GAP-003 clipboard control versus disclosure | `UNRESOLVED` | `narrows` | Clipboard source path is mapped. | Separately authorized clipboard/effect evidence. | No disclosure or external-effect claim. |
| `A11-GAP-004` | A10-GAP-002 source seams versus completed DB/provider/filesystem effect | `UNRESOLVED` | `does-not-supersede` | Material effect sinks are mapped. | Exact environment, request, result, durable state, and audit receipt. | No completed effect claim. |
| `A11-GAP-005` | A10-GAP-004 Sync Run source versus result | `UNRESOLVED` | `does-not-supersede` | Proxy, internal route, filesystem, and DB chains are mapped. | Authorized run, state transition, file/result audit, rollback evidence. | No staged edit, Agent action, or repository mutation. |
| `A11-GAP-006` | Credential identifier versus credential configuration | `UNAVAILABLE` | `narrows` | Identifier registry is value-free. | Separately authorized secure configuration verification. | No credential validity or rotation claim. |
| `A11-GAP-007` | `TRACKED_CREDENTIAL_LIKE_SEED_LITERAL` structural finding | `UNRESOLVED` | `records-later-event` | `SEED_PATH_SOURCE_REACHABLE`; production reachability `UNKNOWN`. | `SEPARATELY_ROUTED_SECURITY_REMEDIATION_DECISION`. | No value, validation, remediation, or authority effect. |
| `A11-GAP-008` | GitHub promotion source versus application GitHub mutation | `UNRESOLVED` | `does-not-supersede` | Guarded REST path is mapped. | Authorized environment-bound request and audit receipt. | A11 delivery tooling does not prove application reachability. |
| `A11-GAP-009` | Linear labels versus application Linear reachability | `MIRROR_ONLY` | `does-not-supersede` | No executable caller in bounded scan; A12 not absorbed. | Separately routed A12 reconciliation. | No Linear source-of-truth or effect claim. |
| `A11-GAP-010` | Agent/Council/provider naming versus activation | `DEFERRED` | `does-not-supersede` | Static/mock/manual surfaces are mapped. | Separately authorized runtime and authority evidence. | No Agent, Council, provider, or JAI activation. |
| `A11-GAP-011` | Workflow declaration versus deployment/repository synchronization | `UNRESOLVED` | `narrows` | Workflow command and secret identifiers are mapped. | Authorized workflow execution and redacted receipts. | No workflow, GitHub, repository, or deployment claim. |
| `A11-GAP-012` | Source scan versus organization-wide absence | `UNAVAILABLE` | `narrows` | Absence claims name their exact scan boundary. | Broader separately authorized inventory. | No organization-wide absence claim. |
<!-- A11_GAP_END -->

Observed gap count: **12 unique records**. Genuine current contradictions:
**0**. A12 Linear reconciliation records are not absorbed.

## 13. Current A11 authority envelope

<!-- A11_ENVELOPE_START -->
| envelope_id | route | coordinate | role | base | allowlist | evidence ceiling | current authority | downstream authority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A11-ENV-001` | `CT-2026-07-23-Q3M7Y26-P1-A11R1-REFERENCE-JOIN-COMPLETENESS-v0` | `Q3M7Y26-P1:A11R1` | `JAI::DEV::BUILDER` | `34e84ac3240fd237e93e38502e8a860e32c24f3b` | `docs/reference/q3m7y26-p1-a11-dependency-external-effect-map-v0.md` | `DOCUMENTATION_DEPENDENCY_EXTERNAL_EFFECT_MAP_ONLY` | `ONE_PATH / DOCUMENTARY / NO_RUNTIME / EXISTING_DRAFT_PR_ONLY` | `A12=NOT_GRANTED; D9=HELD; BATCH_EXIT=NONE; PROGRAM_EXIT=NONE; JAI_ACTIVATION=NONE` |
<!-- A11_ENVELOPE_END -->

## 14. Mechanical invariants

| Invariant | Required result |
| --- | --- |
| Dependency nodes | `19 unique` |
| Credential identifiers | `12 unique / values 0` |
| Effect sinks | `20 unique` |
| Entry-to-dependency edges | `22 unique` |
| Activation gates | `13 unique` |
| Route/surface records | `13 unique` |
| Negative-isolation records | `10 unique` |
| Gap records | `12 unique / genuine current contradictions 0` |
| Current authority envelopes | `1 unique` |
| Duplicate IDs / orphan joins | `0 / 0` |
| Credential values, prefixes, lengths, hashes, or validation results | `0` |
| Immutable references | `PASS / 46 definitions / 46 unique targets / 0 undefined uses / 0 unresolved` |
| Positive execution, persistence, provider, customer, deployment, Batch-exit, Program-exit, Agent/Council, or activation grants | `0` |
| Changed repository paths | `exactly 1, this artifact` |

## 15. Risks, rollback, and explicit non-authorizations

Risks are documentary omission, false reachability, incorrect source joins, or
accidental sensitive-value inclusion. Rollback is a normal revert of the
eventual documentation commit. No application, database, provider, filesystem,
network, browser, deployment, or external-system rollback is required.

This artifact does not authorize or perform mapped-effect execution, credential
probing, database/provider/filesystem/network application effect, Sync Run
action, registry import, motion/passalong persistence, clipboard operation,
GitHub/Linear application mutation, Codex/process execution, Agent/Council
dispatch, customer effect, deployment, merge, ready conversion, branch deletion,
Batch exit, Program exit, or JAI activation. It does not modify `seed.ts` or
classify the redacted seed literal as harmless, synthetic, active, reused, or
compromised.

`A11_END_TO_END_DISPOSITION: DRAFT_PR_DELIVERED`

`A11_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_DEPENDENCY_EXTERNAL_EFFECT_MAP_ONLY`

`A11_RUNTIME_EFFECT_CREDIT: NONE`

`A11_EXTERNAL_EFFECT_ABSENCE_CREDIT: NONE`

`A11R1_DISPOSITION: REPAIR_DELIVERED`

`A11_ACCEPTANCE: HELD_PENDING_A11R1_FINAL_VERIFICATION`

`A11_MERGE_AUTHORITY: NOT_GRANTED`

`A12_EXECUTION_AUTHORITY: NOT_GRANTED`

`BATCH_A_EXIT_CREDIT: NONE`

`BATCH_B_EXECUTION_AUTHORITY: NOT_GRANTED`

`D9_EXECUTION_AUTHORITY: HELD_PENDING_ACCEPTED_BATCH_B`

`PROGRAM_EXIT_CREDIT: NONE`

`JAI_ACTIVATION_CREDIT: NONE`

`NEXT_REQUIRED_DECISION: ACCEPT_A11R1_FOR_FINAL_INDEPENDENT_VERIFICATION`

## 16. Immutable reference definitions

[A2]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md
[A4]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/docs/reference/q3m7y26-p1-a4-ratified-motion-decision-registry-v0.md
[A7]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/docs/reference/q3m7y26-p1-a7-pr-commit-evidence-ledger-v0.md
[A9]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/docs/reference/q3m7y26-p1-a9-runnable-capability-inventory-v0.md
[A10]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/docs/reference/q3m7y26-p1-a10-founder-workflow-surface-map-v0.md
[AUTH]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/auth.ts
[GATEKEEPER]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/gatekeeper.ts
[INTERNAL-AUTH]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/internalAuth.ts
[INTERNAL-CLIENT]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/jaiInternalClient.ts
[CONTEXT-AUTH]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/contextApiAuth.ts
[SOT-AUTH]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/sotIngestAuth.ts
[PRISMA]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/prisma.ts
[PRISMA-CONFIG]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/prisma.config.ts
[PRISMA-SEED]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/prisma/seed.ts
[MOTION-INTAKE-PERSIST]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/controlPlane/motionKernel/motion-intake-persistence.ts
[MOTION-INTAKE-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/motion-control/motion-intake/route.ts
[DELIBERATION-HISTORY]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/controlPlane/motionKernel/deliberation-run-history.ts
[MANUAL-INFERENCE-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/motion-control/manual-inference/route.ts
[MANUAL-INFERENCE-UI]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/motion-control/ManualDeliberationAction.tsx
[PASSALONG-PERSIST]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/controlPlane/threadMemory/passalong-persistence.ts
[PASSALONG-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/control-thread/passalongs/route.ts
[PASSALONG-UI]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx
[LOCAL-LOOP-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/operator/motion-control/local-operating-loop/route.ts
[LOCAL-PANEL]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/motion-control/LocalOperatingLoopPanel.tsx
[MOTION-COMPOSER]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx
[PROVIDER-CONFIG]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/controlPlane/motionKernel/server-provider-config.ts
[PROVIDER-CONNECTOR]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/controlPlane/motionKernel/provider-connector.ts
[MOTION-PROMOTION]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/lib/motion/motionPromotion.ts
[MOTION-PROMOTE-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/operator/motions/promote/route.ts
[SYNC-APPLY-PROXY]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/operator/sync-runs/%5BsyncRunId%5D/apply/route.ts
[SYNC-REJECT-PROXY]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/operator/sync-runs/%5BsyncRunId%5D/reject/route.ts
[INTERNAL-APPLY]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/internal/agents/apply/route.ts
[INTERNAL-REJECT]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/internal/agents/reject/route.ts
[INTERNAL-AGENT-COMMIT]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/internal/agents/commit/route.ts
[INTERNAL-SYNC-REPOS]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/internal/sync-repos/route.ts
[REGISTRY-DOMAIN-NEW]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/registry/domains/new/page.tsx
[REGISTRY-DOMAIN-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/registry/domains/%5Bid%5D/page.tsx
[REGISTRY-REPO-NEW]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/registry/repos/new/page.tsx
[REGISTRY-REPO-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/operator/registry/repos/%5Bid%5D/page.tsx
[SOT-INGEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/sot-events/ingest/route.ts
[CHAT-INGEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/ingest/chat/route.ts
[DCT-IDEA]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/src/app/api/dct/idea/route.ts
[ROOT-PACKAGE]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/package.json
[PORTAL-PACKAGE]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/portal/package.json
[PORTAL-CI]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/.github/workflows/portal-ci-guardrails.yml
[SYNC-WORKFLOW]: https://github.com/jai-nexus/dev-jai-nexus/blob/34e84ac3240fd237e93e38502e8a860e32c24f3b/.github/workflows/portal-sync-repos.yml
