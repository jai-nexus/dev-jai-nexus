# Q3M7 Control Thread Passalong Persistence Plan v0

## Role

Role: JAI::DEV::BUILDER

## Program / batch / wave / lane

- Program: Q3M7Y26 JAI Motion Control Plane Activation v0
- Batch: A
- Wave: A-I
- Lane: A18
- Thread: 2026-06-21_dev-jai-nexus

## Scope

This static planning artifact evaluates whether and how A16/A17 passalong-router records could later become durable non-authoritative app-local records.

This lane is planning only. It does not implement persistence, change Prisma schema, add migrations, mutate databases, authorize database mutation, add auto-send behavior, add auto-route behavior, activate sandbox runtime, activate JAI Agents, activate Agent PR Factory, mutate GitHub, create branches, create PRs, merge, deploy, import target-repo code, add provider calls, add external API calls, add secrets, or add telemetry.

## Reviewed baseline

- Accepted A16 implementation baseline: static thread-memory types, static sample data, deterministic passalong-router helpers, and `/operator/control-thread` operator surface.
- Accepted A17 boundary review baseline: A16 remains advisory, non-authoritative, non-executing, static/sample-data based, operator-visible only, not persistent memory, not route authority, not CONTROL_THREAD acceptance, not automatic routing, not sandbox activation, not JAI Agent activation, not GitHub mutation, not target-repo adoption, and not production gate opening.

## Reviewed files

- `portal/src/lib/controlPlane/threadMemory/types.ts`
- `portal/src/lib/controlPlane/threadMemory/sample-data.ts`
- `portal/src/lib/controlPlane/threadMemory/passalong-router.ts`
- `portal/src/lib/controlPlane/threadMemory/index.ts`
- `portal/src/app/operator/control-thread/page.tsx`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `docs/reference/q3m7-control-thread-passalong-router-boundary-review-v0.md`

No `docs/reference/README.md` index file exists, so no index update is required for this lane.

## Planning purpose

The purpose is to define a conservative future persistence plan before any implementation route exists. The plan separates durable app-local operator recall from source of truth, CONTROL_THREAD acceptance, route authority, execution authority, sandbox activation, JAI Agent activation, target-repo adoption, and production gates.

## A16/A17 baseline summary

A16 currently uses static TypeScript records and pure helpers. `PassalongRecord` includes passalong id, source thread, target thread, scope, mode, summary, evidence pointers, requested decision, status, created timestamp, authority boundary, non-authorizations, optional sandbox target id, optional sandbox import/adoption posture, and optional sandbox-output marker.

A16 builds inbox/outbox queues by filtering static records, builds route recommendation text from selected passalong data, and builds copyable passalong packet text. The `/operator/control-thread` UI uses local React selection state only.

A17 confirmed that A16 is not persistent memory, not source of truth, not CONTROL_THREAD acceptance, not route authority, not automatic routing, not sandbox activation, not JAI Agent activation, not Agent PR Factory activation, not GitHub mutation, not target-repo adoption, and not production gate opening.

## Candidate persistence purpose

Possible future persistence may support:

- Durable app-local operator recall.
- Reviewing prior passalongs.
- Reconstructing inbox/outbox queue history.
- Seeing route recommendation history.
- Preserving evidence pointer references.
- Tracking manual passalong status as operator metadata.
- Preserving non-authoritative audit context.

Possible future persistence must not support source-of-truth transfer, CONTROL_THREAD acceptance, automatic routing, execution authority, sandbox activation, JAI Agent activation, GitHub mutation, target-repo adoption, or production gates.

## Durable app-local memory distinction

Durable app-local memory may be considered only as a future non-authoritative convenience layer.

- Durable app-local memory is not source of truth.
- Durable app-local memory is not CONTROL_THREAD acceptance.
- Durable app-local memory is not route authority.
- Durable app-local memory is not execution authority.
- Durable app-local memory is not sandbox activation.
- Durable app-local memory is not JAI Agent activation.
- Durable app-local memory is not target-repo adoption.

## Candidate persistence model

A future model could store app-local passalong records separately from the A16 static sample data. A candidate model would likely represent one passalong record per row and derive inbox/outbox views by source and target thread ids.

Any exact model, table name, schema, migration, route handler, repository helper, lifecycle state, retention behavior, and operator UI behavior requires a separate implementation route and boundary review.

## Candidate persisted fields

Candidate persisted fields, subject to separate design review, may include:

- Passalong id.
- Source thread id.
- Target thread id.
- Scope.
- Mode.
- Summary.
- Evidence pointer references.
- Requested decision.
- Route status.
- Created timestamp.
- Updated timestamp, if future implementation needs it.
- Authority boundary text.
- Non-authorizations.
- Sandbox posture marker, if relevant.
- Import/adoption posture marker, if relevant.
- Manual operator note, if minimized and non-secret.
- Archive/delete marker, if future lifecycle needs it.

Exact candidate persisted fields require a separate implementation route and boundary review.

## Fields excluded from persistence

Fields and content that must not be persisted include:

- Provider API keys.
- Platform tokens.
- Database credentials.
- Connection strings.
- Passwords.
- Private keys.
- Raw `.env` contents.
- Unredacted secret-bearing logs.
- Unredacted screenshots that expose secrets.
- Full external chat transcripts unless separately reviewed.
- Full provider prompts containing secrets.
- Hidden chain-of-thought or private reasoning traces.
- Unnecessary operator personal context.
- Source files from target repos.
- Generated code intended for target-repo import.
- Runtime execution outputs that have not been reviewed.
- Production telemetry.
- Credentials embedded in evidence pointers.
- Any value that would turn app-local memory into source-of-truth transfer.

## Non-authoritative persistence boundary

Persistence planning is not persistence implementation.

Future persistent passalong records would not be source of truth. Future persistent passalong records would not be CONTROL_THREAD acceptance. Future persistent passalong records would not be route authority. Future persistent passalong records would not be execution authority. Future persistent passalong records would not activate sandbox-nexus. Future persistent passalong records would not activate JAI Agents. Future persistent passalong records would not activate Agent PR Factory. Future persistent passalong records would not mutate GitHub. Future persistent passalong records would not adopt code into target repos. Future persistent passalong records would not open production gates.

Future persistent route status would remain non-authoritative until CONTROL_THREAD approval. Future persistence implementation requires separate route and boundary review. Future migration requires separate route and migration review.

## Route status persistence boundary

A16 route status vocabulary:

- `draft`
- `queued`
- `needs_review`
- `recommended`
- `approved_for_manual_passalong`
- `sent_manually`
- `held`
- `rejected`
- `archived`

Future persisted status values would remain descriptive operator metadata only.

- Persisted `draft` is not route authority.
- Persisted `queued` is not CONTROL_THREAD acceptance.
- Persisted `needs_review` is not a route decision.
- Persisted `recommended` is not route approval.
- Persisted `approved_for_manual_passalong` is not CONTROL_THREAD acceptance unless separately evidenced by CONTROL_THREAD.
- Persisted `sent_manually` is not proof of delivery unless separately evidenced.
- Persisted `held` is not permanent rejection unless separately decided.
- Persisted `rejected` is not global source-of-truth unless CONTROL_THREAD acceptance records it.
- Persisted `archived` is not deletion from source-of-truth records.
- No persisted status value authorizes automatic sending, automatic routing, execution, GitHub mutation, target-repo import, or production gates.

## Inbox/outbox persistence boundary

Future inbox persistence would be a view/index by target thread only. Future outbox persistence would be a view/index by source thread only.

Inbox/outbox persistence would not send messages, route work, approve decisions, mutate GitHub, activate agents, import target-repo code, or replace CONTROL_THREAD.

## Route recommendation persistence boundary

If future route recommendation output is persisted, it must remain advisory.

Persisted route recommendations are text snapshots only. Persisted route recommendations are not route authority. Persisted route recommendations are not CONTROL_THREAD acceptance. Persisted route recommendations do not execute work, send passalongs, activate sandbox runtime, activate JAI Agents, mutate GitHub, or import target-repo code.

## Copyable packet persistence boundary

If future copyable passalong packet output is persisted, it must remain manual text.

Persisted copyable packet text is not automatic routing. Persisted copyable packet text is not proof of manual sending. Persisted copyable packet text is not CONTROL_THREAD acceptance. Persisted copyable packet text does not mutate state, mutate GitHub, create branches or PRs, merge, deploy, or import target-repo code.

## `sandbox-nexus` boundary

Persistent passalong record would not activate sandbox-nexus. Persistent passalong record would not execute sandbox tasks. Persistent passalong record would not make sandbox-nexus source of truth. Persistent passalong record would not export sandbox outputs to canonical repos.

sandbox-nexus outputs require closeout/evidence receipt. sandbox-nexus outputs require CONTROL_THREAD import/discard decision. Target repos import or reimplement only through separate route.

## Future JAI Agent slot boundary

Persistent passalong record would not activate JAI Agents. Persistent passalong record would not activate Agent PR Factory. Persistent passalong record would not dispatch work to agents. Persistent passalong record would not execute work through agents. Persistent passalong record would not create branches. Persistent passalong record would not create PRs. Persistent passalong record would not mutate GitHub.

Future JAI Agent activation requires separate CONTROL_THREAD route and boundary review.

## Import/adoption boundary

The import/adoption posture values remain:

- `discard`
- `archive`
- `iterate`
- `keep_as_example`
- `promote_to_import_candidate`

Persisting import/adoption posture is not target-repo adoption. `promote_to_import_candidate` remains future CONTROL_THREAD review only. No persisted import/adoption value imports code into canonical repos, creates branches, creates PRs, merges, deploys, or opens production gates. Target repos import or reimplement only through separate route.

## Data minimization / redaction requirements

Any future implementation must:

- Persist only fields required for operator recall and queue display.
- Prefer references over raw content.
- Prefer evidence pointer ids/paths over full documents.
- Redact secret-bearing content.
- Avoid raw provider prompts unless separately reviewed.
- Avoid full chat transcripts unless separately reviewed.
- Avoid hidden/private reasoning traces.
- Avoid unnecessary personal/operator context.
- Keep authority boundary and non-authorizations visible.
- Require review of any new persisted field before implementation.
- Require separate migration review for any schema addition.

## Secret / prompt / operator-context minimization

Any future persisted record must avoid secrets, credential-bearing prompts, private reasoning traces, unnecessary operator personal context, and full external chat content unless a separate route explicitly reviews and approves the minimal shape. Provider keys remain out of scope. Prompt text should be summarized or referenced when possible, not stored raw by default.

## Retention / archive / delete posture

Conservative future lifecycle posture:

- `active` records are visible in current operator queues.
- `archived` records are retained as non-authoritative reference only.
- `held` records remain blocked until CONTROL_THREAD decision.
- `rejected` records remain non-authoritative unless CONTROL_THREAD decision records rejection.
- Future delete behavior requires separate retention policy.
- Future retention period requires separate policy decision.
- Archive does not transfer source of truth.
- Delete does not delete source-of-truth records.
- App-local record lifecycle does not alter CONTROL_THREAD decisions.

## Migration requirement if persistence is ever implemented

Future persistence implementation likely requires a schema design route. Future persistence implementation may require Prisma schema changes. Future persistence implementation may require a migration.

Any migration requires separate route and migration review. Planning this migration does not create it. Planning this migration does not authorize it. Planning this migration does not apply it.

Migration application requires separate target-environment confirmation, backup/rollback evidence, migration history review, and CONTROL_THREAD or explicit human approval.

## Required future implementation gates

Before any persistence implementation:

1. CONTROL_THREAD acceptance of A18 planning artifact.
2. Separate persistence schema/design route.
3. Separate boundary review of candidate persisted fields.
4. Separate data minimization / secret-handling review.
5. Separate retention/archive/delete policy decision.
6. Separate migration readiness review, if schema changes are needed.
7. Separate target-environment confirmation, if migration application is needed.
8. Separate implementation route.
9. Separate validation and closeout route.
10. Separate CONTROL_THREAD acceptance of implementation results.

## CONTROL_THREAD authority separation

CONTROL_THREAD remains authority. Persistence planning, future persistent passalong records, persisted route status, persisted route recommendations, persisted copyable packet text, sandbox-nexus target option, future JAI Agent slot, and persisted import candidate status are not final authority.

## Linear temporary mirror posture

Linear remains temporary mirror only. Future passalong persistence, if separately implemented, must not make Linear source of truth, route authority, execution authority, or CONTROL_THREAD acceptance.

## Required findings

- Persistence planning is not persistence implementation.
- Persistent passalong record would not be source of truth.
- Persistent passalong record would not be CONTROL_THREAD acceptance.
- Persistent passalong record would not be route authority.
- Persistent passalong record would not be execution authority.
- Persistent passalong record would not activate sandbox-nexus.
- Persistent passalong record would not activate JAI Agents.
- Persistent passalong record would not adopt code into target repos.
- Persistent route status would remain non-authoritative until CONTROL_THREAD approval.
- Future persistence implementation requires separate route and boundary review.
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
- No final CONTROL_THREAD approval by persistent passalong record.
- No final CONTROL_THREAD approval by persisted route status.
- No final CONTROL_THREAD approval by persisted route recommendation.
- No final CONTROL_THREAD approval by persisted copyable packet text.
- No route authority by persistent passalong record.
- No route authority by persisted route status.
- No route authority by persisted route recommendation.
- No route authority by persisted copyable packet text.
- No execution authority by persistent passalong record.
- No execution authority by sandbox-nexus target option.
- No execution authority by future JAI Agent slot.
- No target-repo adoption by persisted import candidate status.

## Risks and follow-ups

- Risk: persistence planning may be mistaken for persistence implementation. Mitigation: preserve planning-only and no-schema/no-migration wording.
- Risk: durable app-local memory may be mistaken for source of truth. Mitigation: preserve non-authoritative convenience-layer boundary.
- Risk: persisted status may be mistaken for route authority. Mitigation: preserve descriptive metadata wording for every status.
- Risk: persisted route recommendation or copyable packet text may be mistaken for routing. Mitigation: preserve text-snapshot/manual-text-only boundaries.
- Risk: persisted import posture may be mistaken for target-repo adoption. Mitigation: preserve separate target-repo workflow requirement.
- Risk: future schema work may skip migration readiness. Mitigation: require separate schema, migration, target-environment, backup/rollback, and CONTROL_THREAD gates.

## Recommended next decision path

1. CONTROL_THREAD acceptance of this A18 persistence planning artifact.
2. Separate passalong persistence schema/design route only if durable app-local records are desired.
3. Separate persisted-field boundary review.
4. Separate data minimization / secret-handling review.
5. Separate retention/archive/delete policy route.
6. Separate migration readiness review if schema changes are proposed.
7. Separate implementation route only after planning and review gates.
8. Separate target-environment migration route only if implementation requires migration application.

Possible next routes, not approved by this plan:

- Q3M7 Control Thread Passalong Persistence Schema Design v0.
- Q3M7 Control Thread Passalong Data Minimization Review v0.
- Q3M7 Control Thread Passalong Retention Policy Plan v0.
- Q3M7 Motion Intake Sandbox Evidence Intake v0.
- Q3M7 sandbox-nexus Playground Boundary Plan v0.

## Validation plan

- Run `git diff --check`.
- Run `git diff --cached --check`.
- Confirm required finding phrases are present.
- Confirm required non-authorization phrases are present.
- Confirm required planning sections and topics are present.
- Review implementation and authorization language hits to ensure they are negated, future-gated, or boundary-framed.
- Confirm no source behavior changed.
- Confirm no persistence implementation was added.
- Confirm no Prisma schema change was added.
- Confirm no migration was added.
- Confirm no database mutation was authorized.
- Confirm CONTROL_THREAD remains authority.
- Confirm Linear remains temporary mirror only.

## ZERO GATES GRANTED

ZERO GATES GRANTED. This plan grants no persistence implementation, no Prisma schema change, no migration, no database mutation, no automatic passalong sending, no automatic route execution, no sandbox activation, no JAI Agent activation, no Agent PR Factory activation, no GitHub mutation, no target-repo import, no deployment, and no production gate opening.
