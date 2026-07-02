# Q3M7 Control Thread Passalong Data Minimization Review v0

## Role

Role: JAI::DEV::BUILDER

## Program / batch / wave / lane

- Program: Q3M7Y26 JAI Motion Control Plane Activation v0
- Batch: A
- Wave: A-I
- Lane: A20
- Thread: 2026-06-21_dev-jai-nexus

## Scope

This static data minimization review evaluates the accepted A19 candidate passalong persistence schema and classifies each candidate persisted field for future app-local persistence consideration.

This lane is review/planning only. It does not change application source, change Prisma schema, add migrations, implement persistence, mutate databases, authorize database mutation, add auto-send behavior, add auto-route behavior, activate sandbox runtime, activate JAI Agents, activate Agent PR Factory, mutate GitHub, create branches, create PRs, merge, deploy, import target-repo code, add provider calls, add external API calls, add secrets, or add telemetry.

## Reviewed baseline

- Accepted A16 implementation baseline: static thread-memory/passalong records, deterministic inbox/outbox helpers, route recommendation helper, copyable packet helper, `sandbox-nexus` posture, future JAI Agent slot posture, import/adoption posture, and `/operator/control-thread` operator surface.
- Accepted A17 boundary review baseline: the A16 prototype remains advisory, non-authoritative, non-executing, static/sample-data based, operator-visible only, not persistent memory, not route authority, not CONTROL_THREAD acceptance, not automatic routing, not sandbox activation, not JAI Agent activation, not GitHub mutation, not target-repo adoption, and not production gate opening.
- Accepted A18 persistence planning baseline: any future passalong persistence is app-local, non-authoritative, minimized, non-secret, and separately gated.
- Accepted A19 candidate schema-design baseline: candidate model/table names, candidate fields, evidence pointer shape, lifecycle markers, indexes/query patterns, redaction/minimization constraints, excluded fields, and future implementation gates.

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

No `docs/reference/README.md` index file exists, so no index update is required for this lane.

## Review purpose

The purpose is to decide which A19 candidate fields are minimal enough for a possible future persistence implementation and which fields require constraints, references, redaction, or exclusion.

The review confirms future persistent fields remain minimal, non-secret, non-authoritative, and unsuitable for source-of-truth transfer, automatic routing, execution, sandbox activation, JAI Agent activation, GitHub mutation, target-repo import, or production gate opening.

Topic coverage includes candidate field classification, allowed fields, constrained fields, reference-only fields, redaction-before-persisting fields, excluded fields, evidence pointer minimization, manual operator note constraints, secret-handling, prompt/context minimization, personal-context minimization, route status boundary, archive/delete lifecycle, sandbox-nexus, Future JAI Agent slot, Import/adoption, future implementation gates, CONTROL_THREAD authority, and Linear temporary mirror posture.

## A16/A17/A18/A19 baseline summary

A16 uses static TypeScript sample data and pure helper output. A17 confirmed the A16 surface is advisory and non-executing. A18 planned possible future app-local persistence only as a non-authoritative convenience layer. A19 translated that plan into the candidate model `ControlThreadPassalongRecord` and candidate table `control_thread_passalong_records` without creating schema, migrations, or persistence.

A19 also required evidence pointer references over raw content, manual note minimization, secret exclusion, lifecycle boundaries, route status boundaries, sandbox/JAI Agent/import boundaries, and future implementation gates.

## Candidate model/table reviewed

- Candidate model: `ControlThreadPassalongRecord`
- Candidate table: `control_thread_passalong_records`

These names remain candidate-only. They do not create Prisma schema, database tables, migrations, persistence implementation, route authority, database mutation, or CONTROL_THREAD acceptance.

## Classification vocabulary

This review uses exactly these planning classifications:

- `allowed`: field may be persisted as candidate app-local metadata without special redaction beyond normal validation.
- `allowed_with_constraints`: field may be persisted only with explicit limits, validation, length constraints, enum constraints, or bounded values.
- `reference_only`: field should persist references/ids/paths/labels only, not raw content.
- `redact_before_persisting`: field may only persist after secret-bearing or overbroad content is removed.
- `exclude`: field or content must not be persisted.

This vocabulary is planning vocabulary only and does not authorize implementation.

## Candidate field classification table

| Candidate field | Proposed classification | Minimization / redaction rule | Boundary note |
| --- | --- | --- | --- |
| `id` | `allowed` | Stable app-local id only. | Not source of truth or external identity. |
| `passalongId` | `allowed` | Stable passalong id only. | Not proof of delivery or CONTROL_THREAD acceptance. |
| `sourceThreadId` | `allowed_with_constraints` | Must use bounded known thread ids. | Does not create source route authority. |
| `targetThreadId` | `allowed_with_constraints` | Must use bounded known thread ids. | Does not auto-send or activate target thread. |
| Source thread label snapshot | `allowed_with_constraints` | Short non-secret label only. | Context only; not route authority. |
| Target thread label snapshot | `allowed_with_constraints` | Short non-secret label only. | Context only; not execution authority. |
| `scope` | `allowed_with_constraints` | Short bounded text; no secrets or raw transcripts. | Not work authorization. |
| `mode` | `allowed_with_constraints` | Short bounded text or controlled label. | Not execution authority. |
| `summary` | `allowed_with_constraints` | Length-limited non-secret summary; redact if copied content is sensitive. | Not source of truth. |
| `evidencePointers` | `reference_only` | Store ids, repo-relative paths, non-secret labels, or redacted references only. | Not validation approval or source-of-truth transfer. |
| `requestedDecision` | `allowed_with_constraints` | Length-limited request text; no copied secrets, raw prompts, or transcripts. | Not CONTROL_THREAD acceptance. |
| `routeStatus` | `allowed_with_constraints` | Must use A16 status vocabulary only. | Descriptive metadata only. |
| `createdAt` | `allowed` | App-local timestamp only. | Not proof of external delivery. |
| `updatedAt` | `allowed` | App-local timestamp only. | Not source-of-truth timeline. |
| `authorityBoundary` | `allowed_with_constraints` | Use standard boundary text or bounded marker. | Text does not grant authority. |
| `nonAuthorizations` | `allowed_with_constraints` | Use standard visible non-authorization set where possible. | Must travel with derived views. |
| `sandboxPosture` | `allowed_with_constraints` | Nullable bounded posture marker only. | Does not activate `sandbox-nexus`. |
| `importAdoptionPosture` | `allowed_with_constraints` | Use A16 posture values only. | Not target-repo adoption. |
| `manualOperatorNote` | `redact_before_persisting` | Non-secret, length-limited, reviewed text only after redaction. | Not source of truth, acceptance, or route authority. |
| `archiveState` | `allowed_with_constraints` | Use bounded lifecycle values only. | App-local lifecycle only. |
| `archivedAt` | `allowed` | App-local timestamp only. | Archive is not source-of-truth transfer. |
| `deletedAt` | `allowed` | App-local marker timestamp only. | Delete does not delete source-of-truth records. |
| `redactionState` | `allowed` | Bounded redaction-state marker only. | Does not store the redacted value. |
| `schemaVersion` | `allowed` | Version string only. | Not migration authorization. |

## Allowed fields

Allowed fields are stable internal id, passalong id, created timestamp, updated timestamp, archived timestamp, deleted timestamp, redaction state, and schema version.

Allowed fields are app-local metadata only. Allowed fields do not create source of truth, prove external delivery, equal CONTROL_THREAD acceptance, authorize routing, authorize execution, activate sandbox runtime, activate JAI Agents, mutate GitHub, import target-repo code, or open production gates.

## Constrained fields

Constrained fields are source thread id, target thread id, thread label snapshots, scope, mode, summary, requested decision, route status, authority boundary, non-authorizations, sandbox posture, import/adoption posture, and archive state.

Constraints:

- Use bounded values where possible.
- Avoid secrets.
- Avoid credentials.
- Avoid raw external transcript content.
- Avoid source files or generated code.
- Avoid hidden/private reasoning traces.
- Avoid unnecessary personal/operator context.
- Length-limit free text in any future implementation.
- Keep authority/non-authorization text visible and standard where possible.

## Reference-only fields

Reference-only fields include evidence pointers, repo-relative paths, artifact ids, non-secret labels, and redacted external references if separately allowed.

Evidence pointers should prefer references over raw content. Evidence pointers should not embed credentials, raw secret-bearing logs, unredacted screenshots, full documents unless separately reviewed, or source-of-truth content. Evidence pointers do not create validation approval, CONTROL_THREAD acceptance, source-of-truth transfer, route authority, or execution authority.

## Redaction-before-persisting fields

Redaction-before-persisting fields include manual operator note, any free-text summary containing secret-bearing material, requested decision text containing copied secret-bearing context, and evidence labels containing credentials or sensitive content.

Manual operator note constraints:

- Non-secret only.
- Length-limited in future implementation.
- No provider keys.
- No platform tokens.
- No database credentials.
- No connection strings.
- No passwords.
- No private keys.
- No raw `.env` values.
- No hidden/private reasoning traces.
- No unnecessary personal/operator context.
- No raw target-repo source.
- No generated code intended for target-repo import.
- No unreviewed runtime output.
- Not source of truth.
- Not CONTROL_THREAD acceptance.
- Not route authority.
- Redaction required before persistence.

## Excluded fields

The following A19 exclusions remain `exclude`:

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

## Evidence pointer minimization requirements

- Evidence pointers store ids/paths/labels only where possible.
- Prefer repo-relative artifact path over raw artifact content.
- Prefer non-secret reference over external content copy.
- Include redaction state if risk exists.
- Exclude credentials from evidence pointer values.
- Exclude connection strings from evidence pointer values.
- Exclude raw logs/screenshots unless separately reviewed and redacted.
- Exclude full documents unless separately reviewed.
- Evidence pointer references are not validation approval.
- Evidence pointer references are not source-of-truth transfer.
- Evidence pointer references are not CONTROL_THREAD acceptance.

## Manual operator note constraints

Manual operator notes are untrusted until reviewed and redacted. They must remain optional, minimized, non-secret, length-limited, and operationally relevant.

Manual notes must not contain provider keys, API keys, platform tokens, database credentials, connection strings, passwords, private keys, raw `.env` values, hidden/private reasoning traces, unnecessary personal/operator context, target repo source files, generated target-repo import code, unreviewed runtime output, or production telemetry.

## Secret-handling requirements

Future implementation must exclude:

- Provider keys.
- API keys.
- Platform tokens.
- Database credentials.
- Connection strings.
- Passwords.
- Private keys.
- Raw `.env` values.
- Secret-bearing logs.
- Secret-bearing screenshots.
- Credential-bearing URLs.
- Credential-bearing evidence pointers.
- Unreviewed runtime output that may contain secrets.

Any accidental secret-like content must be redacted before persistence. Redaction state should be recorded without storing the secret value. Future implementation needs validation scans for secret-like patterns.

## Prompt/context minimization requirements

- No hidden/private reasoning traces.
- No full provider prompts unless separately reviewed.
- No full external chat transcripts unless separately reviewed.
- No raw chain-of-thought.
- No unnecessary deliberation context.
- No unbounded prompt capture.
- Prefer short summaries and evidence references.
- Preserve only operator-visible, reviewable context.
- Keep route recommendation snapshots minimal if persisted later.
- Keep copyable packet snapshots minimal if persisted later.

## Personal-context minimization requirements

- Avoid unnecessary operator personal context.
- Avoid personal notes unrelated to route or passalong handling.
- Minimize manual notes.
- Length-limit manual notes.
- Prohibit sensitive personal details unless separately reviewed and explicitly necessary.
- Prefer operational labels over personal content.
- Treat operator-entered notes as untrusted until redacted.
- Do not turn app-local memory into a personal dossier.

## Route status boundary

Route status remains descriptive metadata only. Persisted route status is not CONTROL_THREAD acceptance, route authority, execution authority, auto-send authorization, auto-route authorization, GitHub mutation authorization, target-repo import authorization, or production gate authorization.

Persisted `approved_for_manual_passalong` is not CONTROL_THREAD acceptance unless separately evidenced by CONTROL_THREAD. Persisted `sent_manually` is not proof of delivery unless separately evidenced.

## Archive/delete lifecycle boundary

Archive state is app-local metadata only. Archived timestamp is app-local metadata only. Deleted timestamp is app-local metadata only.

Archive does not transfer source of truth. Delete does not delete source-of-truth records. Lifecycle does not alter CONTROL_THREAD decisions. Lifecycle does not prove manual passalong delivery. Retention period requires separate policy route. Deletion policy requires separate policy route.

## Candidate indexes/query-pattern minimization

Indexes should use minimal metadata only. Indexes should not index raw secret-bearing content, full transcripts, target-repo source content, generated target-repo import code, hidden/private reasoning traces, or production telemetry.

Indexes support viewing/search only. Indexes do not send messages, route work, approve decisions, mutate GitHub, activate agents, import target-repo code, or replace CONTROL_THREAD.

## `sandbox-nexus` boundary

Candidate persisted fields do not activate `sandbox-nexus`, execute sandbox tasks, make `sandbox-nexus` source of truth, or export sandbox outputs to canonical repos.

Sandbox outputs require closeout/evidence receipt. Sandbox outputs require CONTROL_THREAD import/discard decision. Target repos import or reimplement only through separate route.

## Future JAI Agent slot boundary

Candidate persisted fields do not activate JAI Agents, activate Agent PR Factory, dispatch work to agents, execute work through agents, create branches, create PRs, or mutate GitHub.

Future JAI Agent activation requires separate CONTROL_THREAD route and boundary review.

## Import/adoption boundary

Import/adoption values remain:

- `discard`
- `archive`
- `iterate`
- `keep_as_example`
- `promote_to_import_candidate`

Persisted import/adoption posture is review labeling only. `promote_to_import_candidate` remains future CONTROL_THREAD review only. Candidate persisted import posture is not target-repo adoption. No value imports code into canonical repos, creates branches, creates PRs, merges, deploys, or opens production gates.

## Required future implementation gates

Required gates before implementation:

1. CONTROL_THREAD acceptance of A20 data minimization artifact.
2. Separate retention/archive/delete policy decision.
3. Separate persistence implementation plan.
4. Separate Prisma schema mutation route, if needed.
5. Separate migration readiness review, if schema changes are needed.
6. Separate target-environment confirmation, if migration application is needed.
7. Separate validation and secret-scan requirements.
8. Separate implementation route.
9. Separate validation and closeout route.
10. Separate CONTROL_THREAD acceptance of implementation results.

## CONTROL_THREAD authority separation

CONTROL_THREAD remains authority. Data minimization review, candidate persisted fields, candidate persisted route status, candidate indexes, candidate lifecycle markers, `sandbox-nexus` target option, future JAI Agent slot, and candidate import posture are not final authority.

Persistence does not create source of truth. Persistence does not create CONTROL_THREAD acceptance. Persistence does not create route authority. Persistence does not create execution authority.

## Linear temporary mirror posture

Linear remains temporary mirror only. Linear entries, mirrored notes, route labels, candidate field classifications, and future persisted passalong records do not transfer source of truth or grant route, execution, GitHub, deployment, production gate, sandbox, JAI Agent, or target-repo import authority.

## Required findings

- Data minimization review is not implementation.
- Data minimization review is not Prisma schema mutation.
- Data minimization review is not migration.
- Data minimization review is not database mutation.
- Candidate persisted fields remain non-authoritative.
- Candidate persisted fields must not store secrets.
- Candidate persisted fields must not store provider keys.
- Candidate persisted fields must not store database credentials.
- Candidate persisted fields must not store raw `.env` contents.
- Candidate persisted fields must not store hidden/private reasoning traces.
- Candidate persisted fields must not store unnecessary operator personal context.
- Evidence pointers should prefer references over raw content.
- Manual operator notes must be minimized, non-secret, and length-limited if ever implemented.
- Route status remains descriptive metadata only.
- Persistence does not create source of truth.
- Persistence does not create CONTROL_THREAD acceptance.
- Persistence does not create route authority.
- Persistence does not create execution authority.
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
- No final CONTROL_THREAD approval by candidate persisted field.
- No final CONTROL_THREAD approval by candidate persisted route status.
- No final CONTROL_THREAD approval by candidate persisted route recommendation.
- No final CONTROL_THREAD approval by candidate persisted copyable packet text.
- No route authority by candidate persisted field.
- No route authority by candidate persisted route status.
- No route authority by candidate persisted route recommendation.
- No route authority by candidate persisted copyable packet text.
- No execution authority by candidate persisted field.
- No execution authority by sandbox-nexus target option.
- No execution authority by future JAI Agent slot.
- No target-repo adoption by candidate persisted import posture.

## Risks and follow-ups

- Manual operator notes remain the highest minimization risk because free text can accidentally include secrets, prompts, personal context, or overbroad content.
- Evidence labels can become secret-bearing if copied from URLs, logs, screenshots, or external systems without redaction.
- Retention/archive/delete policy remains undefined and requires a separate route before implementation.
- Future schema implementation requires validation scans and field-level review before persistence is safe to consider.

## Recommended next decision path

Recommended bounded next path:

1. CONTROL_THREAD acceptance of this A20 data minimization review artifact.
2. Separate retention/archive/delete policy plan before implementation.
3. Separate persistence implementation plan only after schema design, minimization review, and retention policy are accepted.
4. Separate Prisma schema mutation route only if implementation is authorized.
5. Separate migration readiness review if schema changes are proposed.
6. Separate target-environment confirmation if migration application is needed.
7. Separate validation/closeout and CONTROL_THREAD acceptance after implementation.

Possible future routes, not approved by this data minimization review:

- `Q3M7 Control Thread Passalong Retention Policy Plan v0`
- `Q3M7 Control Thread Passalong Persistence Implementation Plan v0`
- `Q3M7 Motion Intake Sandbox Evidence Intake v0`
- `Q3M7 sandbox-nexus Playground Boundary Plan v0`

## Validation plan

Planned validation:

- Run `git diff --check`.
- Run `git diff --cached --check`.
- Confirm required findings are present with `rg`.
- Confirm classification vocabulary is present with `rg`.
- Confirm required non-authorizations are present with `rg`.
- Confirm required review topics are present with `rg`.
- Review broad implementation/authorization/secret wording hits manually and confirm they are negated, future-gated, minimized, redacted, excluded, or boundary-framed.

## ZERO GATES GRANTED

ZERO GATES GRANTED. This data minimization review grants no persistence implementation, Prisma schema change, migration, database mutation, auto-send behavior, auto-route behavior, sandbox runtime activation, JAI Agent activation, Agent PR Factory activation, GitHub mutation, PR creation, branch mutation, merge action, deployment, target-repo import, production gate opening, provider/model routing authority, source-of-truth transfer, or CONTROL_THREAD acceptance.
