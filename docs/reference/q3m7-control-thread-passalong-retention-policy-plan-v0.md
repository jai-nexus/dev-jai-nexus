# Q3M7 Control Thread Passalong Retention Policy Plan v0

## Role

Role: JAI::DEV::BUILDER

## Program / batch / wave / lane

- Program: Q3M7Y26 JAI Motion Control Plane Activation v0
- Batch: A
- Wave: A-I
- Lane: A21
- Thread: 2026-06-21_dev-jai-nexus

## Scope

This static retention policy planning artifact defines candidate lifecycle policy for possible future app-local non-authoritative Control Thread passalong records.

This lane is planning only. It does not change application source, change Prisma schema, add migrations, implement persistence, mutate databases, authorize database mutation, add auto-send behavior, add auto-route behavior, activate sandbox runtime, activate JAI Agents, activate Agent PR Factory, mutate GitHub, create branches, create PRs, merge, deploy, import target-repo code, add provider calls, add external API calls, add secrets, or add telemetry.

## Reviewed baseline

- Accepted A16 implementation baseline: static thread-memory/passalong records, route status vocabulary, inbox/outbox helpers, deterministic route recommendations, copyable packet output, `sandbox-nexus` posture, future JAI Agent slot posture, import/adoption posture, and `/operator/control-thread` operator surface.
- Accepted A17 boundary review baseline: A16 remains advisory, non-authoritative, non-executing, static/sample-data based, operator-visible only, not persistent memory, not route authority, not CONTROL_THREAD acceptance, not automatic routing, not sandbox activation, not JAI Agent activation, not GitHub mutation, not target-repo adoption, and not production gate opening.
- Accepted A18 persistence planning baseline: future app-local persistence may support operator recall only and must remain non-authoritative.
- Accepted A19 schema-design baseline: candidate model/table, candidate fields, archive/delete markers, redaction-state marker, indexes/query patterns, excluded fields, and future gates.
- Accepted A20 data minimization baseline: candidate persisted fields must remain minimal, non-secret, constrained, reference-only where possible, and separated from source-of-truth transfer.

## Reviewed files

- `portal/src/lib/controlPlane/threadMemory/types.ts`
- `portal/src/lib/controlPlane/threadMemory/sample-data.ts`
- `portal/src/lib/controlPlane/threadMemory/passalong-router.ts`
- `portal/src/lib/controlPlane/threadMemory/index.ts`
- `portal/src/app/operator/control-thread/page.tsx`
- `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`
- `docs/reference/q3m7-control-thread-passalong-router-boundary-review-v0.md`
- `docs/reference/q3m7-control-thread-passalong-persistence-plan-v0.md`
- `docs/reference/q3m7-control-thread-passalong-persistence-schema-design-v0.md`
- `docs/reference/q3m7-control-thread-passalong-data-minimization-review-v0.md`

No `docs/reference/README.md` index file exists, so no index update is required for this lane.

## Retention policy planning purpose

The purpose is to define candidate app-local lifecycle policy before any persistence implementation exists. The plan separates app-local archive, app-local delete, source-of-truth records, CONTROL_THREAD acceptance records, route authority, execution authority, evidence retention, secret retention, sandbox output lifecycle, and target-repo import/adoption lifecycle.

Topic coverage includes app-local lifecycle definitions, archive policy, delete policy, retention-period recommendation, stale-record handling, redaction-state lifecycle, secret-handling lifecycle, evidence-pointer retention, manual-operator-note retention, route recommendation snapshot retention, copyable packet snapshot retention, source-of-truth lifecycle separation, CONTROL_THREAD decision lifecycle separation, sandbox-nexus output lifecycle separation, target-repo import/adoption lifecycle separation, future implementation gates, CONTROL_THREAD authority, and Linear temporary mirror posture.

## A16/A17/A18/A19/A20 baseline summary

A16 provides static records and pure helpers only. A17 confirmed that the prototype is advisory and non-executing. A18 established that any future durable app-local memory is a convenience layer only. A19 proposed candidate lifecycle fields `archiveState`, `archivedAt`, and `deletedAt` plus redaction-state tracking. A20 classified fields and required secret minimization, reference-only evidence pointers, and redaction before any risky free text could be persisted.

## Candidate model/table reviewed

- Candidate model: `ControlThreadPassalongRecord`
- Candidate table: `control_thread_passalong_records`

These names remain candidate-only. They do not create Prisma schema, database tables, migrations, persistence implementation, database mutation, route authority, execution authority, source-of-truth transfer, or CONTROL_THREAD acceptance.

## Planning distinctions

- App-local archive is not source-of-truth archive.
- App-local delete is not source-of-truth delete.
- App-local lifecycle does not alter CONTROL_THREAD decisions.
- App-local lifecycle does not prove manual passalong delivery.
- Evidence retention should retain references, not raw content.
- Secret-bearing records must not be retained unredacted.
- Sandbox output lifecycle remains separate from passalong record lifecycle.
- Target-repo import/adoption lifecycle remains separate from app-local passalong lifecycle.

## Candidate retention policy purpose

Candidate future retention policy may support app-local operator recall, queue hygiene, review of recent passalong history, archive of non-authoritative passalong metadata, cleanup of stale app-local records, redaction-state tracking, and separation between app-local lifecycle and source-of-truth lifecycle.

It must not support source-of-truth transfer, CONTROL_THREAD acceptance, route authority, execution authority, proof of manual passalong delivery, automatic routing, sandbox activation, JAI Agent activation, Agent PR Factory activation, GitHub mutation, target-repo import/adoption, or production gates.

## App-local lifecycle definitions

Candidate app-local lifecycle states:

- `active`: visible in current operator queues and recent views.
- `archived`: retained as non-authoritative app-local reference only.
- `marked_for_delete`: flagged for future app-local deletion review or cleanup workflow.

Lifecycle states are app-local metadata only. Lifecycle states do not alter CONTROL_THREAD decisions, prove manual passalong delivery, alter source-of-truth records, route work, execute work, mutate GitHub, or import target-repo code.

## Candidate route status lifecycle

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

Route status remains descriptive metadata only. Route status lifecycle is separate from app-local archive/delete lifecycle. `approved_for_manual_passalong` does not equal CONTROL_THREAD acceptance unless separately evidenced. `sent_manually` does not prove delivery unless separately evidenced. `rejected` is not source-of-truth rejection unless CONTROL_THREAD records it. `archived` route status is not source-of-truth archive.

No route status authorizes automatic passalong sending, automatic route execution, GitHub mutation, target-repo import, or production gates.

## Candidate archive/delete lifecycle fields

Candidate lifecycle fields:

- `archiveState`
- `archivedAt`
- `deletedAt`

`archiveState` is app-local metadata only. `archivedAt` is app-local metadata only. `deletedAt` is app-local metadata only. `archivedAt` is not proof of source-of-truth archive. `deletedAt` is not proof of source-of-truth deletion. Timestamps are not proof of external delivery. Timestamps are not CONTROL_THREAD acceptance. Retention/delete behavior requires separate implementation route.

## App-local archive policy

Candidate archive triggers may include:

- Operator manually archives app-local record.
- Record reaches accepted non-authoritative retention period.
- Route status becomes `archived`.
- Record is superseded by a later CONTROL_THREAD-accepted artifact.
- Record is retained only for reference after closeout.

Archive is app-local only. Archive does not delete source-of-truth records, prove manual passalong delivery, change CONTROL_THREAD decisions, prevent later CONTROL_THREAD review, approve work, reject work, route work, execute work, mutate GitHub, or import target-repo code.

## App-local delete policy

Candidate delete posture:

- Delete is app-local only.
- Delete should normally follow archive / marked-for-delete review.
- Delete should require explicit operator action in any future implementation.
- Delete should not occur automatically in the first implementation unless separately routed.
- Delete should preserve source-of-truth separation.
- Delete should not remove CONTROL_THREAD decisions, PRs, commits, closeouts, accepted docs, external chat records, or canonical artifacts.
- Delete should not remove evidence from source-of-truth repositories.

App-local delete is not source-of-truth delete. App-local delete does not alter CONTROL_THREAD decisions, prove withdrawal, prove rejection, prove acceptance, mutate GitHub, import target-repo code, or remove target-repo code. App-local delete policy requires a separate implementation route.

## Retention-period recommendation

Candidate retention-period recommendation:

- Retain `active` records while they are in current operator queues or open review.
- Archive completed or superseded app-local records after a future configurable period.
- Use a conservative initial planning window such as 90 days for app-local active review before archive consideration.
- Do not hard-delete records automatically in the first persistence implementation.
- Use manual review before delete.
- Treat retention periods as policy candidates only, not implemented values.

Retention period is candidate planning only. Retention period does not authorize background cleanup jobs, automatic deletion, source-of-truth record changes, or CONTROL_THREAD decision changes.

## Stale-record handling

Potential stale indicators:

- Superseded by CONTROL_THREAD-accepted artifact.
- Replaced by later passalong.
- Blocked by missing evidence.
- Associated route closed.
- Associated sandbox output discarded.
- Associated import candidate rejected.
- Target thread no longer relevant.

Stale marker is app-local only. Stale marker is not rejection unless CONTROL_THREAD records rejection. Stale marker is not source-of-truth lifecycle. Stale marker does not delete records, route work, execute work, mutate GitHub, or import target-repo code.

## Redaction-state lifecycle

Candidate redaction states:

- `not_required`
- `pending_review`
- `redacted`
- `blocked_secret_risk`

Records with secret risk should be blocked from persistence or require redaction before persistence. Redaction state records the posture, not the secret value. Redaction state does not retain secret-bearing content. `blocked_secret_risk` does not authorize persistence. Redaction state does not create source-of-truth transfer or CONTROL_THREAD acceptance.

## Secret-handling lifecycle

Secret-bearing records must not be retained unredacted. Provider keys must not be retained. Platform tokens must not be retained. Database credentials must not be retained. Connection strings must not be retained. Passwords must not be retained. Private keys must not be retained. Raw `.env` values must not be retained. Credential-bearing evidence pointers must not be retained. Secret-bearing logs/screenshots must not be retained unless separately reviewed and redacted.

Accidental secret-like content must be redacted before persistence. Future implementation requires validation scans for secret-like patterns.

## Evidence-pointer retention policy

Evidence-pointer retention should retain references, not raw content.

- Prefer repo-relative docs/reference paths.
- Prefer artifact ids.
- Prefer non-secret labels.
- Include redaction state if risk exists.
- Do not retain credentials in evidence pointers.
- Do not retain connection strings in evidence pointers.
- Do not retain raw secret-bearing logs.
- Do not retain unredacted screenshots.
- Do not retain full documents unless separately reviewed.

Evidence pointer retention is not validation approval, source-of-truth transfer, or CONTROL_THREAD acceptance.

## Manual-operator-note retention policy

Manual notes should be optional, minimized, non-secret, length-limited in future implementation, redacted before persistence, treated as untrusted until redacted, and limited to operationally necessary content.

Manual notes should avoid unnecessary personal/operator context, sensitive personal details unless separately reviewed and explicitly necessary, raw target-repo source, generated import code, hidden/private reasoning traces, secrets, credentials, raw prompts, full transcripts, unreviewed runtime output, and production telemetry.

Manual note retention is not source of truth, CONTROL_THREAD acceptance, route authority, execution authority, or proof of delivery.

## Route recommendation snapshot retention

If future route recommendation snapshots are persisted, snapshots should be minimized, non-secret, avoid raw prompts/transcripts, preserve non-authorizations, and preserve CONTROL_THREAD authority.

Snapshot retention is not route authority, CONTROL_THREAD acceptance, execution authority, automatic passalong sending, automatic route execution, sandbox activation, JAI Agent activation, GitHub mutation, target-repo import, or production gate opening.

## Copyable packet snapshot retention

If future copyable passalong packet snapshots are persisted, they are optional and should be minimized. Prefer regenerating packets from fields over storing full packet text. If stored, packet text must be non-secret and redacted.

Copyable packet snapshot retention is not automatic routing, proof of manual sending, CONTROL_THREAD acceptance, GitHub mutation, branch creation, PR creation, merge action, deployment, target-repo import, or production gate opening.

## Source-of-truth lifecycle separation

App-local archive is not source-of-truth archive. App-local delete is not source-of-truth delete.

Source-of-truth records remain in repo history, accepted docs, commits, PRs, closeouts, CONTROL_THREAD decisions, or separately accepted systems. App-local passalong lifecycle does not mutate repositories, delete accepted artifacts, supersede CONTROL_THREAD decisions, or transfer source of truth.

## CONTROL_THREAD decision lifecycle separation

CONTROL_THREAD acceptance requires explicit CONTROL_THREAD decision. App-local retention status is not CONTROL_THREAD acceptance. App-local archive is not CONTROL_THREAD rejection. App-local delete is not CONTROL_THREAD withdrawal.

App-local lifecycle does not approve routes, reject routes unless CONTROL_THREAD records rejection, execute routes, or create authority.

## `sandbox-nexus` output lifecycle separation

Sandbox output lifecycle is separate from passalong record lifecycle. App-local passalong archive does not discard sandbox output. App-local passalong delete does not delete sandbox output.

Sandbox outputs require closeout/evidence receipt. Sandbox outputs require CONTROL_THREAD import/discard decision. `sandbox-nexus` import/discard decision is separate from app-local archive/delete. Target repos import or reimplement only through separate route.

## Target-repo import/adoption lifecycle separation

Target-repo import/adoption lifecycle is separate from passalong retention lifecycle. App-local retention does not import code. App-local archive does not mark target-repo adoption. App-local delete does not remove target-repo code.

Import candidate status remains future CONTROL_THREAD review only. Target repos import or reimplement only through separate route. No retention policy value creates branches, PRs, merges, deployments, or production gates.

## Linear temporary mirror posture

Linear remains temporary mirror only. Linear entries, mirrored notes, route labels, candidate retention states, archived markers, delete markers, and future retained passalong records do not transfer source of truth or grant route, execution, GitHub, deployment, production gate, sandbox, JAI Agent, or target-repo import authority.

## Required future implementation gates

Required gates before implementation:

1. CONTROL_THREAD acceptance of A21 retention policy artifact.
2. Separate persistence implementation plan.
3. Separate Prisma schema mutation route, if needed.
4. Separate migration readiness review, if schema changes are needed.
5. Separate target-environment confirmation, if migration application is needed.
6. Separate validation and secret-scan requirements.
7. Separate implementation route.
8. Separate validation and closeout route.
9. Separate CONTROL_THREAD acceptance of implementation results.
10. Separate operational review before any background cleanup or automatic deletion behavior.

## Required findings

- Retention policy planning is not implementation.
- Retention policy planning is not Prisma schema mutation.
- Retention policy planning is not migration.
- Retention policy planning is not database mutation.
- App-local archive is not source-of-truth archive.
- App-local delete is not source-of-truth delete.
- App-local lifecycle does not alter CONTROL_THREAD decisions.
- App-local lifecycle does not prove manual passalong delivery.
- Retention policy does not create CONTROL_THREAD acceptance.
- Retention policy does not create route authority.
- Retention policy does not create execution authority.
- Retention policy does not authorize automatic passalong sending.
- Retention policy does not authorize automatic route execution.
- Retention policy does not activate sandbox-nexus.
- Retention policy does not activate JAI Agents.
- Retention policy does not authorize target-repo import.
- Secret-bearing records must not be retained unredacted.
- Evidence pointers should retain references, not raw content.
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
- No final CONTROL_THREAD approval by app-local lifecycle state.
- No final CONTROL_THREAD approval by app-local archive marker.
- No final CONTROL_THREAD approval by app-local delete marker.
- No final CONTROL_THREAD approval by candidate retained record.
- No route authority by app-local lifecycle state.
- No route authority by app-local archive marker.
- No route authority by app-local delete marker.
- No execution authority by app-local lifecycle state.
- No execution authority by sandbox-nexus target option.
- No execution authority by future JAI Agent slot.
- No target-repo adoption by app-local retention state.

## Risks and follow-ups

- Risk: retention policy may be mistaken for persistence implementation. Mitigation: preserve planning-only, no-schema, no-migration, and no-database-mutation wording.
- Risk: app-local archive/delete may be mistaken for source-of-truth lifecycle. Mitigation: keep source-of-truth lifecycle separation visible in every future route.
- Risk: automatic cleanup may be added too early. Mitigation: require separate operational review before background cleanup or automatic deletion behavior.
- Risk: manual notes or evidence pointers may retain secrets. Mitigation: require redaction, reference-only evidence, and secret scans.
- Risk: sandbox/import lifecycle may be confused with passalong lifecycle. Mitigation: require separate CONTROL_THREAD decisions for sandbox output and target-repo import/adoption.

## Recommended next decision path

Recommended bounded next path:

1. CONTROL_THREAD acceptance of this A21 retention policy planning artifact.
2. Separate persistence implementation plan only after A18/A19/A20/A21 are accepted as sufficient.
3. Separate Prisma schema mutation route only if implementation is authorized.
4. Separate migration readiness review if schema changes are proposed.
5. Separate target-environment confirmation if migration application is needed.
6. Separate operational review before any background cleanup or automatic deletion behavior.
7. Separate validation/closeout and CONTROL_THREAD acceptance after implementation.

Possible future routes, not approved by this retention policy plan:

- `Q3M7 Control Thread Passalong Persistence Implementation Plan v0`
- `Q3M7 Control Thread Passalong Migration Readiness Review v0`
- `Q3M7 Motion Intake Sandbox Evidence Intake v0`
- `Q3M7 sandbox-nexus Playground Boundary Plan v0`

## Validation plan

Planned validation:

- Run `git diff --check`.
- Run `git diff --cached --check`.
- Confirm required findings are present with `rg`.
- Confirm required non-authorizations are present with `rg`.
- Confirm required review topics are present with `rg`.
- Review broad implementation/authorization/lifecycle wording hits manually and confirm they are negated, future-gated, minimized, redacted, excluded, or boundary-framed.

## ZERO GATES GRANTED

ZERO GATES GRANTED. This retention policy plan grants no persistence implementation, Prisma schema change, migration, database mutation, automatic passalong sending, automatic route execution, sandbox runtime activation, JAI Agent activation, Agent PR Factory activation, GitHub mutation, PR creation, branch mutation, merge action, deployment, target-repo import, production gate opening, provider/model routing authority, source-of-truth transfer, or CONTROL_THREAD acceptance.
