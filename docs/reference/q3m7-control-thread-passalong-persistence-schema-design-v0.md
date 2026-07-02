# Q3M7 Control Thread Passalong Persistence Schema Design v0

## Role

Role: JAI::DEV::BUILDER

## Program / batch / wave / lane

- Program: Q3M7Y26 JAI Motion Control Plane Activation v0
- Batch: A
- Wave: A-I
- Lane: A19
- Thread: 2026-06-21_dev-jai-nexus

## Scope

This static schema-design artifact translates the accepted A18 passalong persistence plan into candidate model fields, type categories, indexes, query patterns, lifecycle markers, redaction requirements, excluded fields, and future migration gates.

This lane is schema design only. It does not change application source, change Prisma schema, add migrations, implement persistence, mutate databases, authorize database mutation, add auto-send behavior, add auto-route behavior, activate sandbox runtime, activate JAI Agents, activate Agent PR Factory, mutate GitHub, create branches, create PRs, merge, deploy, import target-repo code, add provider calls, add external API calls, add secrets, or add telemetry.

## Reviewed baseline

- Accepted A16 implementation baseline: static thread-memory records, static passalong records, route status vocabulary, inbox/outbox helpers, deterministic route recommendations, copyable packet output, `sandbox-nexus` target posture, future JAI Agent slot posture, and import/adoption posture.
- Accepted A17 boundary review baseline: A16 is advisory, non-authoritative, non-executing, static/sample-data based, operator-visible only, not persistent memory, not route authority, not CONTROL_THREAD acceptance, not automatic routing, not sandbox activation, not JAI Agent activation, not GitHub mutation, not target-repo adoption, and not production gate opening.
- Accepted A18 persistence planning baseline: future durable app-local passalong memory may be considered only as a non-authoritative convenience layer and requires separate schema, minimization, retention, migration, implementation, and CONTROL_THREAD review gates.

## Reviewed files

- `portal/src/lib/controlPlane/threadMemory/types.ts`
- `portal/src/lib/controlPlane/threadMemory/sample-data.ts`
- `portal/src/lib/controlPlane/threadMemory/passalong-router.ts`
- `portal/src/lib/controlPlane/threadMemory/index.ts`
- `portal/src/app/operator/control-thread/page.tsx`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `docs/reference/q3m7-control-thread-passalong-router-boundary-review-v0.md`
- `docs/reference/q3m7-control-thread-passalong-persistence-plan-v0.md`

No `docs/reference/README.md` index file exists, so no index update is required for this lane.

## Schema design purpose

The purpose is to define a conservative candidate schema shape before any implementation route exists. Schema design is not implementation. Schema design is not Prisma schema mutation. Schema design is not migration. Schema design is not database mutation.

Durable app-local memory may be considered only as a future non-authoritative convenience layer. Durable app-local memory is not source of truth, CONTROL_THREAD acceptance, route authority, execution authority, sandbox activation, JAI Agent activation, or target-repo adoption.

## A16/A17/A18 baseline summary

A16 provides static TypeScript records and pure helpers. `PassalongRecord` includes passalong id, source thread, target thread, scope, mode, summary, evidence pointers, requested decision, status, created timestamp, authority boundary, non-authorizations, optional sandbox target id, optional sandbox import/adoption posture, and optional sandbox-output marker.

A17 confirmed that thread memory, passalong records, route recommendations, copyable packets, operator selection, `sandbox-nexus`, future JAI Agent slot, and import candidate status are advisory only and do not grant authority.

A18 planned possible future app-local persistence for operator recall only. It excluded secrets, credentials, raw `.env` contents, hidden/private reasoning traces, target repo source files, generated import code, unreviewed runtime outputs, production telemetry, and any value that would transfer source of truth.

## Candidate entity/table/model name

This candidate entity is named only for planning.

- Candidate model name: `ControlThreadPassalongRecord`
- Candidate table name: `control_thread_passalong_records`

These are candidate names only. They do not create Prisma schema. They do not create database tables. They do not create migrations. They do not authorize implementation.

## Candidate schema purpose

The candidate schema purpose is app-local operator recall and queue display for future passalong records. It may support reviewing prior passalongs, deriving inbox/outbox views, seeing advisory route recommendation snapshots, preserving non-secret evidence pointer references, tracking manual operator metadata, and preserving non-authoritative audit context.

The candidate schema must not support source-of-truth transfer, CONTROL_THREAD acceptance, automatic routing, execution authority, sandbox activation, JAI Agent activation, GitHub mutation, target-repo adoption, deployment, or production gates.

## Candidate field list

This candidate field list is design-only and does not define executable schema.

| Field | Type category | Purpose | Boundary |
| --- | --- | --- | --- |
| `id` | stable string id | App-local primary identifier. | Not global source of truth. |
| `passalongId` | stable string id | Stable passalong identifier from the A16 model. | Candidate app-local uniqueness only. |
| `sourceThreadId` | thread id string | Source thread reference. | Not route authority. |
| `targetThreadId` | thread id string | Target thread reference. | Does not auto-send or activate target thread. |
| `scope` | short text | Passalong scope label. | Not work authorization. |
| `mode` | short text | Advisory mode label. | Not execution authority. |
| `summary` | long text | Minimized non-secret summary. | Not source of truth. |
| `evidencePointers` | JSON/reference array | Non-secret references to evidence. | References only; no raw secret-bearing content. |
| `requestedDecision` | long text | Decision requested from human / CONTROL_THREAD. | Not CONTROL_THREAD acceptance. |
| `routeStatus` | enum-like string | Descriptive route status. | Not route authority. |
| `createdAt` | timestamp | App-local creation timestamp. | Not proof of external delivery. |
| `updatedAt` | timestamp | App-local update timestamp. | Not source-of-truth timeline. |
| `authorityBoundary` | long text or structured marker | Visible authority boundary. | Text does not grant authority. |
| `nonAuthorizations` | JSON/reference array | Visible non-authorization set. | Must travel with derived views. |
| `sandboxPosture` | nullable enum-like string | Sandbox posture marker when relevant. | Does not activate sandbox-nexus. |
| `importAdoptionPosture` | nullable enum-like string | Import/adoption posture marker when relevant. | Not target-repo adoption. |
| `manualOperatorNote` | nullable minimized text | Optional non-secret operator note. | Not source of truth or route authority. |
| `archiveState` | enum-like string | App-local lifecycle marker. | Does not alter CONTROL_THREAD decisions. |
| `archivedAt` | nullable timestamp | App-local archive timestamp. | Archive is app-local only. |
| `deletedAt` | nullable timestamp | App-local deletion marker timestamp. | Delete is app-local only. |
| `redactionState` | enum-like string | Tracks redaction/minimization posture. | Does not prove safety without review. |
| `schemaVersion` | version string | Future schema compatibility marker. | Not migration authorization. |

Optional future label snapshots, such as `sourceThreadLabelSnapshot` and `targetThreadLabelSnapshot`, require separate review before implementation.

## Candidate field types or type categories

This candidate field types section uses type categories, not Prisma schema.

- Stable string id: `id`, `passalongId`.
- Thread id string: `sourceThreadId`, `targetThreadId`.
- Short text: `scope`, `mode`.
- Long text: `summary`, `requestedDecision`, `authorityBoundary`.
- Enum-like string: `routeStatus`, `sandboxPosture`, `importAdoptionPosture`, `archiveState`, `redactionState`.
- Timestamp: `createdAt`, `updatedAt`.
- JSON/reference array: `evidencePointers`, `nonAuthorizations`.
- Nullable timestamp: `archivedAt`, `deletedAt`.
- Nullable minimized text: `manualOperatorNote`.
- Version string: `schemaVersion`.

No actual Prisma model block is defined by this document.

## Candidate thread reference fields

The candidate thread reference shape includes:

- `sourceThreadId`.
- `targetThreadId`.
- Optional source thread label snapshot.
- Optional target thread label snapshot.

Thread references are contextual app-local metadata. Thread references are not route authority, execution authority, target thread activation, automatic passalong sending, source-of-truth transfer, or CONTROL_THREAD acceptance.

## Candidate route status field

The candidate route status field preserves the A16 vocabulary:

- `draft`
- `queued`
- `needs_review`
- `recommended`
- `approved_for_manual_passalong`
- `sent_manually`
- `held`
- `rejected`
- `archived`

Candidate persisted route status remains descriptive metadata only. Candidate persisted route status is not CONTROL_THREAD acceptance, route authority, execution authority, auto-send authorization, auto-route authorization, GitHub mutation authorization, target-repo import authorization, or production gate authorization.

## Candidate evidence pointer field shape

The candidate evidence pointer field shape should store references, not raw content. A future reference entry may include:

- Evidence pointer id.
- Label.
- Repo-relative path or non-secret reference.
- Evidence type.
- Created or observed timestamp, if needed.
- Redaction state.

Required exclusions: no credentials embedded in evidence pointers, no raw secret-bearing logs, no unredacted screenshots, no full documents unless separately reviewed, and no source-of-truth transfer by evidence pointer.

## Candidate authority boundary field shape

The candidate authority boundary field shape may be visible text or a structured marker. It must preserve:

- CONTROL_THREAD remains authority.
- Linear remains temporary mirror only.
- Persistent passalong record is not source of truth.
- Persistent passalong record is not CONTROL_THREAD acceptance.
- Persistent passalong record is not route authority.
- Persistent passalong record is not execution authority.

Authority boundary text does not itself grant authority and does not substitute for CONTROL_THREAD decision.

## Candidate non-authorizations field shape

The candidate non-authorizations field shape may be a visible structured string list or a reference to a standard non-authorization set.

Non-authorizations must remain visible if persistence is implemented later. Non-authorizations must travel with persisted passalong record views and must be included in any future route recommendation or copyable packet output derived from persistence.

This document does not implement the field.

## Candidate sandbox posture field shape

The candidate sandbox posture field shape may be a nullable enum-like marker. Candidate values may reference:

- No sandbox target.
- Sandbox candidate.
- Sandbox evidence required.
- Sandbox closeout required.
- Sandbox import decision required.

The sandbox posture field does not activate sandbox-nexus, execute sandbox tasks, make sandbox-nexus source of truth, export sandbox outputs to canonical repos, authorize runtime activation, or authorize production gates.

## Candidate import/adoption posture field shape

The candidate import/adoption posture field shape preserves A16/A18 values:

- `discard`
- `archive`
- `iterate`
- `keep_as_example`
- `promote_to_import_candidate`

Persisted import/adoption posture is not target-repo adoption. `promote_to_import_candidate` remains future CONTROL_THREAD review only. No value imports code into canonical repos, creates branches, creates PRs, merges, deploys, or opens production gates.

## Candidate manual operator note field shape

The candidate manual operator note field shape is optional minimized text.

Required constraints:

- Non-secret only.
- No provider keys.
- No credentials.
- No raw `.env` values.
- No hidden/private reasoning traces.
- No unnecessary personal/operator context.
- Redaction required before persistence.
- Length-limited in any future implementation.
- Not source of truth.
- Not CONTROL_THREAD acceptance.
- Not route authority.

## Candidate archive/delete marker field shape

The candidate archive/delete marker field shape includes:

- `archiveState`.
- `archivedAt`.
- `deletedAt`.

Candidate lifecycle states:

- `active`
- `archived`
- `marked_for_delete`

Archive is app-local only. Delete is app-local only. Archive does not transfer source of truth. Delete does not delete source-of-truth records. App-local lifecycle does not alter CONTROL_THREAD decisions. Retention/delete policy requires a separate route.

## Candidate timestamps

Candidate timestamps include:

- Created timestamp.
- Updated timestamp.
- Archived timestamp, nullable.
- Deleted timestamp, nullable.

Timestamps are app-local metadata only. Timestamps are not proof of external delivery, CONTROL_THREAD acceptance, or source-of-truth timeline unless separately evidenced.

## Candidate indexes / query patterns

Candidate query patterns:

- List inbox by target thread and status.
- List outbox by source thread and status.
- List recent passalongs by created timestamp.
- List archived passalongs.
- List records by route status.
- List records involving sandbox-nexus.
- List records with import candidate posture.
- Find by passalong id.

Candidate indexes may include:

- `targetThreadId + routeStatus + createdAt`
- `sourceThreadId + routeStatus + createdAt`
- `routeStatus + createdAt`
- `importAdoptionPosture + createdAt`
- `sandboxPosture + createdAt`
- `passalongId` unique candidate

Indexes support viewing/search only. Indexes do not send messages, route work, approve decisions, mutate GitHub, activate agents, import target-repo code, or replace CONTROL_THREAD.

## Candidate uniqueness constraints

Candidate uniqueness constraints:

- App-local primary `id` unique.
- `passalongId` unique within app-local persistence.

No uniqueness constraint should imply source-of-truth authority. No uniqueness constraint should imply global canonical passalong identity outside `dev-jai-nexus` unless separately routed.

## Candidate retention/archive/delete lifecycle

Candidate retention lifecycle:

- `active`: visible in current operator queues.
- `archived`: retained as non-authoritative reference only.
- `marked_for_delete`: pending future app-local deletion review.

Lifecycle states are app-local metadata. Lifecycle states do not alter CONTROL_THREAD decisions, delete source-of-truth records, prove manual passalong delivery, authorize routing, authorize execution, or authorize target-repo adoption. Retention period and deletion policy require separate policy routes.

## Redaction/minimization requirements

Redaction and minimization requirements for any future implementation:

- Persist only fields required for operator recall and queue display.
- Prefer references over raw content.
- Prefer evidence pointer ids/paths over full documents.
- Redact secret-bearing content.
- Exclude provider keys and credentials.
- Avoid raw provider prompts unless separately reviewed.
- Avoid full chat transcripts unless separately reviewed.
- Avoid hidden/private reasoning traces.
- Avoid unnecessary personal/operator context.
- Length-limit manual notes in future implementation.
- Require redaction-state tracking.
- Require review of any new persisted field before implementation.
- Require separate migration review for any schema addition.

## Fields explicitly excluded from schema

Excluded fields:

- Provider API keys.
- Platform tokens.
- Database credentials.
- Connection strings.
- Passwords.
- Private keys.
- Raw `.env` contents.
- Unredacted secret-bearing logs.
- Unredacted screenshots exposing secrets.
- Full external chat transcripts unless separately reviewed.
- Full provider prompts containing secrets.
- Hidden chain-of-thought or private reasoning traces.
- Unnecessary operator personal context.
- Target repo source files.
- Generated code intended for target-repo import.
- Unreviewed runtime execution outputs.
- Production telemetry.
- Credentials embedded in evidence pointers.
- Any field that would turn app-local memory into source-of-truth transfer.

## Route status boundary

Persisted `draft` is not route authority. Persisted `queued` is not CONTROL_THREAD acceptance. Persisted `needs_review` is not a route decision. Persisted `recommended` is not route approval. Persisted `approved_for_manual_passalong` is not CONTROL_THREAD acceptance unless separately evidenced by CONTROL_THREAD. Persisted `sent_manually` is not proof of delivery unless separately evidenced. Persisted `held` is not permanent rejection unless separately decided. Persisted `rejected` is not global source-of-truth unless CONTROL_THREAD acceptance records it. Persisted `archived` is not deletion from source-of-truth records.

No persisted status value authorizes automatic sending, automatic routing, execution, GitHub mutation, target-repo import, or production gates.

## Inbox/outbox query boundary

Inbox/outbox query views may be derived from candidate persisted passalong records.

- Future inbox query support would be a view/index by target thread only.
- Future outbox query support would be a view/index by source thread only.
- Inbox/outbox query support would not send messages.
- Inbox/outbox query support would not route work.
- Inbox/outbox query support would not approve decisions.
- Inbox/outbox query support would not mutate GitHub.
- Inbox/outbox query support would not activate agents.
- Inbox/outbox query support would not import target-repo code.
- Inbox/outbox query support would not replace CONTROL_THREAD.

## Archive/delete lifecycle boundary

Archive/delete lifecycle is app-local metadata only.

- Archive does not transfer source of truth.
- Delete does not delete source-of-truth records.
- App-local lifecycle does not alter CONTROL_THREAD decisions.
- App-local lifecycle does not prove manual passalong delivery.
- App-local lifecycle does not authorize route execution.
- App-local lifecycle does not authorize GitHub mutation.
- App-local lifecycle does not authorize target-repo import.

## `sandbox-nexus` boundary

Candidate persisted passalong records would not activate sandbox-nexus. Candidate persisted passalong records would not execute sandbox tasks, make sandbox-nexus source of truth, export sandbox outputs to canonical repos, authorize runtime activation, or authorize production gate opening.

`sandbox-nexus` outputs require closeout/evidence receipt and CONTROL_THREAD import/discard decision. Target repos import or reimplement only through a separate route.

## Future JAI Agent slot boundary

Candidate persisted passalong records would not activate JAI Agents, activate Agent PR Factory, dispatch work to agents, execute work through agents, create branches, create PRs, mutate GitHub, merge, deploy, or import target-repo code.

Future JAI Agent activation requires a separate CONTROL_THREAD route and boundary review.

## Import/adoption boundary

Persisting import/adoption posture is not target-repo adoption. `promote_to_import_candidate` remains future CONTROL_THREAD review only.

No persisted import/adoption value imports code into canonical repos, creates branches, creates PRs, merges, deploys, or opens production gates. Target repos import or reimplement only through a separate route.

## Migration considerations

Future implementation may require Prisma schema design. Future implementation may require Prisma schema mutation. Future implementation may require migration.

This A19 schema design does not create schema changes. This A19 schema design does not create migrations. This A19 schema design does not authorize migration. This A19 schema design does not authorize database mutation.

Any future migration requires separate route and migration review. Migration application requires target-environment confirmation, backup/rollback evidence, migration history review, and CONTROL_THREAD or explicit human approval.

## Required future implementation gates

Required future implementation gates before any implementation:

1. CONTROL_THREAD acceptance of A19 schema design artifact.
2. Separate persisted-field boundary review, if not bundled by CONTROL_THREAD.
3. Separate data minimization / secret-handling review, if not already accepted as sufficient.
4. Separate retention/archive/delete policy decision.
5. Separate implementation route.
6. Separate Prisma schema mutation route, if needed.
7. Separate migration readiness review, if schema changes are needed.
8. Separate target-environment confirmation, if migration application is needed.
9. Separate validation and closeout route.
10. Separate CONTROL_THREAD acceptance of implementation results.

## CONTROL_THREAD authority separation

CONTROL_THREAD remains authority. Schema design, candidate persisted passalong records, candidate persisted route status, candidate indexes, candidate lifecycle markers, `sandbox-nexus` target option, future JAI Agent slot, and candidate import posture are not final authority.

App-local records may support recall only if later implemented through a separate approved route. They do not replace repo history, commits, accepted artifacts, closeouts, PR records, or CONTROL_THREAD decisions.

## Linear temporary mirror posture

Linear remains temporary mirror only. Linear entries, mirrored notes, route labels, candidate schema details, and future persisted passalong records do not transfer source of truth or grant route, execution, GitHub, deployment, production gate, sandbox, JAI Agent, or target-repo import authority.

## Required findings

- Schema design is not implementation.
- Schema design is not Prisma schema mutation.
- Schema design is not migration.
- Schema design is not database mutation.
- Candidate persisted passalong records would not be source of truth.
- Candidate persisted passalong records would not be CONTROL_THREAD acceptance.
- Candidate persisted passalong records would not be route authority.
- Candidate persisted passalong records would not be execution authority.
- Candidate persisted passalong records would not activate sandbox-nexus.
- Candidate persisted passalong records would not activate JAI Agents.
- Candidate persisted passalong records would not adopt code into target repos.
- Candidate persisted route status would remain non-authoritative until CONTROL_THREAD approval.
- Future implementation requires separate route and boundary review.
- Future migration requires separate route and migration review.
- CONTROL_THREAD remains authority.
- Linear remains temporary mirror only.

## Non-authorizations

- No persistence implementation.
- No Prisma schema change.
- No migration.
- No database mutation.
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
- No final CONTROL_THREAD approval by candidate persisted passalong record.
- No final CONTROL_THREAD approval by candidate persisted route status.
- No final CONTROL_THREAD approval by candidate persisted route recommendation.
- No final CONTROL_THREAD approval by candidate persisted copyable packet text.
- No route authority by candidate persisted passalong record.
- No route authority by candidate persisted route status.
- No route authority by candidate persisted route recommendation.
- No route authority by candidate persisted copyable packet text.
- No execution authority by candidate persisted passalong record.
- No execution authority by sandbox-nexus target option.
- No execution authority by future JAI Agent slot.
- No target-repo adoption by candidate persisted import posture.

## Risks and follow-ups

- Candidate fields may still be too broad until a dedicated persisted-field boundary review validates minimization.
- Retention and deletion policy remains undefined and requires separate CONTROL_THREAD routing before implementation.
- Any future schema implementation may require a migration readiness review, target-environment confirmation, and backup/rollback evidence before migration application.
- Manual operator notes create redaction risk unless future implementation enforces length limits, non-secret constraints, and review.
- Evidence pointer references must avoid embedding credentials or transferring source-of-truth content.

## Recommended next decision path

Recommended bounded next path:

1. CONTROL_THREAD acceptance of this A19 schema design artifact.
2. Separate data minimization / secret-handling review if CONTROL_THREAD wants additional review before implementation.
3. Separate retention/archive/delete policy plan before implementation.
4. Separate implementation route only after schema design and policy decisions are accepted.
5. Separate migration readiness review if schema changes are proposed.
6. Separate target-environment confirmation if migration application is needed.
7. Separate validation/closeout and CONTROL_THREAD acceptance after implementation.

Possible future routes, not approved by this schema design:

- `Q3M7 Control Thread Passalong Data Minimization Review v0`
- `Q3M7 Control Thread Passalong Retention Policy Plan v0`
- `Q3M7 Control Thread Passalong Persistence Implementation Plan v0`
- `Q3M7 Motion Intake Sandbox Evidence Intake v0`
- `Q3M7 sandbox-nexus Playground Boundary Plan v0`

## Validation plan

Planned validation:

- Run `git diff --check`.
- Run `git diff --cached --check`.
- Confirm required findings are present with `rg`.
- Confirm required non-authorizations are present with `rg`.
- Confirm required schema design topics are present with `rg`.
- Review broad authorization/implementation wording hits manually and confirm they are negated, future-gated, or boundary-framed.

## ZERO GATES GRANTED

ZERO GATES GRANTED. This schema design grants no persistence implementation, Prisma schema change, migration, database mutation, auto-send behavior, auto-route behavior, sandbox runtime activation, JAI Agent activation, Agent PR Factory activation, GitHub mutation, PR creation, branch mutation, merge action, deployment, target-repo import, production gate opening, provider/model routing authority, source-of-truth transfer, or CONTROL_THREAD acceptance.
