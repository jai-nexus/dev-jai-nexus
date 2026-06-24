# Operator Batch Tracker Static Surface Sketch v0

## 1. Purpose

This docs/reference artifact sketches how `dev.jai.nexus` may eventually present the operator batch tracker.

This is a static docs/reference sketch only.

No UI components were implemented.

No surface behavior was implemented.

Surface sketch must not imply implemented app behavior.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Strategic context

The operator batch tracker needs a future display concept that can show batches, lanes, sublanes, statuses, closeouts, CONTROL_THREAD decisions, dependencies, stale assumptions, blocked routes, held routes, superseded routes, next recommendations, NHID references, Corpus v1 role notes, decision receipt pointers, and ZERO GATES posture.

The sketch should guide future design while preserving that tracker display is not app state, not persistence, not routing authority, not acceptance authority, and not receipt authority.

`Codex_Control_Thread` remains visibility/evidence tracking only.

`ChatGPT_Control_Thread` remains current acceptance authority unless explicitly superseded.

## 3. Accepted baseline

Accepted baseline:

- A1 / Portfolio Batch Tracker Baseline v0 accepted as report-only baseline.
- A2a / `orchestrator-nexus` Portfolio Batch Tracker Static Artifact v0 accepted as static docs/reference tracker baseline artifact.
- A2b / `audit-nexus` Portfolio Batch Tracker Authority Boundary Review v0 accepted as advisory authority-boundary review canon.
- A3 / `dev-jai-nexus` Operator Batch Tracker Display Planning v0 accepted as display planning canon.
- A4 / `dev-jai-nexus` Operator Batch Tracker Field Ownership Review v0 accepted as field-ownership review canon.
- A5 / `orchestrator-nexus` Portfolio Batch Tracker Decision Receipt Template v0 accepted as static decision receipt template.
- A6 / `jai-format` Portfolio Batch Tracker Shared Semantics Planning v0 accepted as non-enforcing shared-semantics planning canon.
- `CLOSEOUT_RECEIVED` does not equal `ACCEPTED`.
- `ACCEPTED` requires explicit `ChatGPT_Control_Thread` acceptance.
- Batch IDs and NHIDs remain separate namespaces unless later unified.
- `Codex_Control_Thread` is visibility/evidence tracking only.
- Operator tracker display planning is not UI implementation.
- Field ownership review is not schema approval.
- Future `dev-jai-nexus` Corpus v1 routes should use `Role: JAI::DEV::BUILDER` unless explicitly overridden.
- JAI Agent role language is Corpus v1 role scaffolding only, not runtime Agent activation.
- ZERO GATES GRANTED.

This baseline is accepted context for static surface sketching only. It does not grant UI, runtime, parser, API, DB, persistence, route-state, motion-state, acceptance, receipt, routing, merge, execution, Agent, provider/model, GitHub/API, or gate authority.

## 4. Evidence inputs

Accepted evidence inputs cited for lineage:

- A1 / Portfolio Batch Tracker Baseline v0
- A2a / `orchestrator-nexus` Portfolio Batch Tracker Static Artifact v0
- A2b / `audit-nexus` Portfolio Batch Tracker Authority Boundary Review v0
- A3 / `dev-jai-nexus` Operator Batch Tracker Display Planning v0
- A4 / `dev-jai-nexus` Operator Batch Tracker Field Ownership Review v0
- A5 / `orchestrator-nexus` Portfolio Batch Tracker Decision Receipt Template v0
- A6 / `jai-format` Portfolio Batch Tracker Shared Semantics Planning v0
- `dev-jai-nexus / Q3M7 Control Thread Slot Architecture Planning v0`
- `dev-jai-nexus / Q3M7 Project Coverage State Operator Planning v0`
- `dev-jai-nexus / Q3M7 Project Coverage State Field Model Review v0`

These are evidence inputs only. They do not grant new authority and do not create implemented app state.

## 5. Static surface sketch scope

This static surface sketch covers display planning for:

- batch list rows
- lane and sublane rows
- status columns
- closeout versus acceptance distinction
- locked CONTROL_THREAD-only fields
- decision receipt pointer references
- dependencies and stale assumptions
- held, blocked, and superseded posture
- next route recommendations
- NHID references
- Corpus v1 role notes
- ZERO GATES posture

This artifact is not a UI implementation, not a component spec, not parser-ready schema, and not a persistence model.

## 6. Operator tracker surface principles

Surface principles:

- `CLOSEOUT_RECEIVED` and `ACCEPTED` must be visually and semantically distinct.
- CONTROL_THREAD-only fields must be visibly locked / non-editable in the sketch.
- Tracker recommendations must be displayed as recommendations only, not routing authority.
- Decision receipt pointers must be displayed as evidence pointers only, not receipt authority.
- Batch IDs must not be presented as NHIDs.
- NHID references, if present, must be references only.
- JAI Agent role language must be presented as Corpus v1 role scaffolding, not runtime Agent activation.
- ZERO GATES posture must remain visible.
- Surface sketch must not imply implemented app behavior.

Field posture:

- Local UI affordance fields may be shown as future display/sorting/filtering candidates only.
- Future `jai-format` shared semantics candidates must remain candidate semantics only.
- Future `orchestrator-nexus` evidence packet candidates must remain evidence-alignment candidates only.
- CONTROL_THREAD-only decision fields must remain locked/read-only.
- Fields not ready for implementation must be explicitly marked not implementation-ready.

## 7. Batch list surface sketch

Possible batch list columns:

| Batch | Batch posture | Accepted baseline | Active lanes | Held / blocked lanes | Closeouts received | Accepted decisions | ZERO GATES posture | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Batch A | active display sequence | A1-A7 baseline context | A1-A7 | none in this sketch | display-only counts | explicit accepted decisions only | ZERO GATES GRANTED | batch IDs are not NHIDs |
| Future Batch | queued candidate | none accepted | candidate only | candidate only | none | none | ZERO GATES GRANTED | not routed by this sketch |

The batch list is display-only. It does not create tracker persistence, route work, execute work, accept work, or open gates.

## 8. Lane and sublane row sketch

Possible lane and sublane columns:

| Lane | Sublane | Scope | Repo / control surface | Role note | Status | Closeout | Acceptance | Decision receipt pointer | Dependencies | Stale assumptions | Blocked / held / superseded posture | Next recommendation | NHID reference | ZERO GATES |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | A7 | Static surface sketch | `dev-jai-nexus` | `Role: JAI::DEV::BUILDER` | `DRAFT` or `ROUTED` as evidence supports | none until closeout observed | locked/not accepted unless explicit | evidence pointer only | A1-A6 | A4 local file may not be present on every branch | none | review static surface sketch | reference only if assigned | ZERO GATES GRANTED |

Rows are static display examples only. Tracker rows are not state mutation.

## 9. Status column sketch

Required status column states:

| Status | Display meaning | Authority boundary |
| --- | --- | --- |
| `DRAFT` | Work is planned or sketched, not routed for execution. | Draft display does not authorize route execution. |
| `ROUTED` | Work has been routed by CONTROL_THREAD instruction. | Routed display is evidence only, not automatic execution. |
| `EXECUTING` | Scoped repo work is underway or in progress. | Executing display does not authorize broader scope. |
| `CLOSEOUT_RECEIVED` | A closeout has been received or observed. | `CLOSEOUT_RECEIVED` does not equal `ACCEPTED`. |
| `ACCEPTED` | Explicit `ChatGPT_Control_Thread` acceptance has occurred. | Final `ACCEPTED` state is CONTROL_THREAD-only. |
| `HELD` | Work is intentionally paused or awaiting decision. | Held display does not approve resumption. |
| `BLOCKED` | Work cannot proceed due to missing evidence, authority, dependency, or risk. | Blocked display does not resolve blockers. |
| `SUPERSEDED` | Another route or artifact replaced this row. | Superseded display does not route replacement work. |

`CLOSEOUT_RECEIVED` means a closeout has been received or observed.

`ACCEPTED` means explicit `ChatGPT_Control_Thread` acceptance has occurred.

A row must not move from `CLOSEOUT_RECEIVED` to `ACCEPTED` without explicit `ChatGPT_Control_Thread` acceptance.

## 10. Closeout vs acceptance display sketch

Closeout state examples:

| Closeout state | Meaning | Boundary |
| --- | --- | --- |
| `none` | No closeout observed. | No acceptance implied. |
| `received` | Closeout returned or observed. | Review still required. |
| `review-needed` | Closeout needs CONTROL_THREAD review. | Does not self-accept. |

Acceptance state examples:

| Acceptance state | Meaning | Boundary |
| --- | --- | --- |
| `not accepted` | No explicit acceptance. | Default until CONTROL_THREAD accepts. |
| `accepted by ChatGPT_Control_Thread` | Explicit acceptance exists. | Requires decision evidence. |
| `superseded` | Another accepted path replaced this row. | Does not accept current row by itself. |

Decision receipt pointer: evidence/reference only.

No status logic or implemented behavior is created by this sketch.

## 11. CONTROL_THREAD decision display sketch

CONTROL_THREAD decision fields should be visibly locked/read-only:

| Locked field | Example display | Boundary |
| --- | --- | --- |
| `CONTROL_THREAD decision` | locked: pending / accepted / held / superseded | CONTROL_THREAD-only; ordinary tracker display cannot edit. |
| `decision timestamp` | locked: evidence timestamp if present | Timestamp does not create acceptance. |
| `acceptance evidence pointer` | locked: reference if explicit acceptance exists | Evidence pointer is not authority. |
| final `ACCEPTED` state | locked: only after explicit acceptance | A row cannot self-accept. |
| decision receipt pointer | locked: evidence pointer only | Not receipt authority. |

CONTROL_THREAD-only fields must be visibly locked / non-editable in the sketch.

## 12. Decision receipt pointer display sketch

Decision receipt pointers may be displayed as references only:

| Pointer | Display posture | Boundary |
| --- | --- | --- |
| A5 static decision receipt template | template reference | Not receipt creation. |
| acceptance evidence pointer | evidence reference | Not acceptance authority. |
| decision receipt pointer | locked reference | Not receipt authority. |

Decision receipt pointers must be displayed as evidence pointers only, not receipt authority.

Receipt pointers do not create receipts, update canon, approve work, or open gates.

## 13. Dependency and stale-assumption display sketch

Dependency and stale-assumption display examples:

| Field | Example display | Boundary |
| --- | --- | --- |
| Dependencies | A1-A6 accepted inputs | Dependencies do not route work. |
| Stale assumptions | evidence freshness needs review | Stale display does not self-resolve. |
| Blocked route refs | none / pending review | Blocker display does not resolve blockers. |
| Review needed | owner review / CONTROL_THREAD review | Prompt does not self-accept. |

Dependencies and stale assumptions are review context only.

## 14. Held / blocked / superseded display sketch

Held / blocked / superseded display examples:

| Posture | Example display | Boundary |
| --- | --- | --- |
| `HELD` | awaiting CONTROL_THREAD decision | Does not authorize resumption. |
| `BLOCKED` | missing accepted evidence or authority | Does not resolve blocker. |
| `SUPERSEDED` | replaced by later accepted route | Does not route replacement work. |

Held, blocked, and superseded posture does not authorize cleanup, branch repair, routing, merge, execution, or gate opening.

## 15. Next route recommendation display sketch

Next route recommendation examples:

| Recommendation | Display posture | Boundary |
| --- | --- | --- |
| Future operator tracker surface sketch review | recommendation only | Not routing authority. |
| Future evidence-packet alignment route | recommendation only | Requires CONTROL_THREAD routing. |
| Future `jai-format` profile candidate route | recommendation only | Not schema implementation. |
| Future static UI design brief route | recommendation only | Not UI implementation. |

Tracker recommendations must be displayed as recommendations only, not routing authority.

## 16. NHID reference display sketch

NHID reference display examples:

| Field | Display posture | Boundary |
| --- | --- | --- |
| Batch ID | `Batch A` | Batch IDs must not be presented as NHIDs. |
| NHID reference | reference only if assigned | NHID references are references only. |
| NHID path | optional future evidence | Does not execute work. |

NHID means Numerical Hierarchy ID.

NHID references, if present, must be references only.

Batch IDs must not be presented as NHIDs.

## 17. Corpus v1 role-note display sketch

Corpus v1 role-note display examples:

| Role note | Display meaning | Boundary |
| --- | --- | --- |
| `Role: JAI::DEV::BUILDER` | default future `dev-jai-nexus` Corpus v1 route role unless explicitly overridden | Role note only. |
| JAI Agent role language | Corpus v1 role scaffolding only | Not runtime Agent activation. |
| Override note | explicit CONTROL_THREAD override if present | Does not activate Agents. |

Future `dev-jai-nexus` Corpus v1 routes use `Role: JAI::DEV::BUILDER` unless explicitly overridden.

JAI Agent role language is Corpus v1 role scaffolding only.

Role notes do not activate runtime Agents, assign Agents, dispatch Agents, or create execution authority.

## 18. ZERO GATES display sketch

ZERO GATES display examples:

| Location | Display | Boundary |
| --- | --- | --- |
| Tracker header | ZERO GATES GRANTED | Gate posture only. |
| Batch row | ZERO GATES GRANTED | Does not open gates. |
| Lane row | ZERO GATES GRANTED | Does not authorize execution. |
| Decision area | ZERO GATES GRANTED | Acceptance does not imply gate opening unless separately accepted. |

ZERO GATES posture must remain visible.

ZERO GATES GRANTED.

## 19. Locked CONTROL_THREAD-only fields

Locked CONTROL_THREAD-only fields:

- `CONTROL_THREAD decision`
- `decision timestamp`
- `acceptance evidence pointer`
- final `ACCEPTED` state
- decision receipt pointer where it records explicit acceptance

These fields are read-only display references in the sketch.

CONTROL_THREAD-only fields must be visibly locked / non-editable in the sketch.

## 20. Editable local UI affordance fields

Possible future editable local UI affordance fields, if a later UI route is accepted:

- local display grouping label
- local display filter
- local sort preference
- visual grouping mode
- row density preference

These are future display/sorting/filtering candidates only.

Local UI affordance fields may be shown as future display/sorting/filtering candidates only.

This artifact does not implement editable fields.

## 21. Read-only evidence fields

Read-only evidence fields:

- `branch`
- `commit hash`
- `merge commit`
- `closeout received`
- `blocked reason`
- `held reason`
- `superseded-by pointer`
- `acceptance evidence pointer`

Future `orchestrator-nexus` evidence packet candidates must remain evidence-alignment candidates only.

Evidence fields display observed or accepted evidence. They do not authorize repair, cleanup, merge, routing, acceptance, or receipt creation.

## 22. Fields not ready for implementation

Fields not ready for implementation:

- `acceptance_authority`
- `receipt_creation_authority`
- `routing_authority`
- `merge_authority`
- `execution_authority`
- `cleanup_authorized`
- `clone_authorized`
- `delete_authorized`
- `archive_authorized`
- `branch_repair_authorized`
- `gate_open_state`
- `codex_automation_enabled`

Fields not ready for implementation must be explicitly marked not implementation-ready.

These fields should not appear as editable controls or authority-bearing tracker fields in a future surface without separate CONTROL_THREAD acceptance.

## 23. Example Batch A rows

Example Batch A rows:

| Row | Scope | Repo / control surface | Role note | Status | Closeout | Acceptance | Decision receipt pointer | Next recommendation | ZERO GATES |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | Portfolio Batch Tracker Baseline v0 accepted/report-only baseline | portfolio tracker | historical accepted context | `ACCEPTED` if explicit acceptance evidence exists | received or historical | locked / accepted by `ChatGPT_Control_Thread` only | evidence pointer only | preserve baseline | ZERO GATES GRANTED |
| A2a | `orchestrator-nexus` Portfolio Batch Tracker Static Artifact v0 accepted/static artifact | `orchestrator-nexus` | evidence packet context | `ACCEPTED` if explicit acceptance evidence exists | received or historical | locked / accepted by `ChatGPT_Control_Thread` only | evidence pointer only | preserve static artifact | ZERO GATES GRANTED |
| A2b | `audit-nexus` Portfolio Batch Tracker Authority Boundary Review v0 accepted/advisory review canon | `audit-nexus` | advisory authority review | `ACCEPTED` if explicit acceptance evidence exists | received or historical | locked / accepted by `ChatGPT_Control_Thread` only | evidence pointer only | preserve boundary canon | ZERO GATES GRANTED |
| A3 | `dev-jai-nexus` Operator Batch Tracker Display Planning v0 accepted/display planning canon | `dev-jai-nexus` | `Role: JAI::DEV::BUILDER` unless overridden | `ACCEPTED` if explicit acceptance evidence exists | received or historical | locked / accepted by `ChatGPT_Control_Thread` only | evidence pointer only | use as display baseline | ZERO GATES GRANTED |
| A4 | `dev-jai-nexus` Operator Batch Tracker Field Ownership Review v0 accepted/field ownership review canon | `dev-jai-nexus` | `Role: JAI::DEV::BUILDER` unless overridden | `ACCEPTED` if explicit acceptance evidence exists | received or historical | locked / accepted by `ChatGPT_Control_Thread` only | evidence pointer only | use as ownership baseline | ZERO GATES GRANTED |
| A5 | `orchestrator-nexus` Portfolio Batch Tracker Decision Receipt Template v0 accepted/static decision receipt template | `orchestrator-nexus` | receipt template context | `ACCEPTED` if explicit acceptance evidence exists | received or historical | locked / accepted by `ChatGPT_Control_Thread` only | evidence pointer only | use as receipt pointer template | ZERO GATES GRANTED |
| A6 | `jai-format` Portfolio Batch Tracker Shared Semantics Planning v0 accepted/non-enforcing shared-semantics planning canon | `jai-format` | shared semantics planning | `ACCEPTED` if explicit acceptance evidence exists | received or historical | locked / accepted by `ChatGPT_Control_Thread` only | evidence pointer only | preserve non-enforcing semantics | ZERO GATES GRANTED |
| A7 | `dev-jai-nexus` Operator Batch Tracker Static Surface Sketch v0 current route / static surface sketch | `dev-jai-nexus` | `Role: JAI::DEV::BUILDER` | `DRAFT` / `ROUTED` / `CLOSEOUT_RECEIVED` as evidence supports | none until closeout observed | locked / not accepted until explicit | evidence pointer only | review static sketch | ZERO GATES GRANTED |

These are example sketch rows only and do not imply implemented app state.

## 24. Example queued / future Batch rows

Example queued / future rows:

| Candidate row | Display posture | Boundary |
| --- | --- | --- |
| Future operator tracker surface sketch review | recommendation only | Requires CONTROL_THREAD route. |
| Future evidence-packet alignment route | recommendation only | Not evidence-packet implementation. |
| Future `jai-format` profile candidate route | recommendation only | Not schema implementation. |
| Future static UI design brief route | recommendation only | Not UI implementation. |

These rows are recommendations or future candidates only.

## 25. Surface sketch limitations

Limitations:

- The sketch does not implement UI components.
- The sketch does not define app behavior.
- The sketch does not create tracker persistence.
- The sketch does not define parser-ready schema.
- The sketch does not create API, DB, or Prisma behavior.
- The sketch does not create route-state or motion-state mutation.
- The sketch does not create acceptance authority or receipt authority.
- The sketch does not authorize routing, merge, execution, cleanup, branch repair, Agent activation, Agent dispatch, GitHub/API automation, or gate opening.

Surface sketch must not imply implemented app behavior.

## 26. Non-authorized behaviors

This static surface sketch does not authorize:

- UI implementation
- surface implementation
- runtime activation
- parser implementation
- API behavior
- DB behavior
- Prisma behavior
- persistence
- Codex automation by app
- cleanup authorization
- clone authorization
- delete authorization
- archive authorization
- branch repair authorization
- routing authority
- merge authority
- execution authority
- acceptance authority
- receipt authority
- Agent activation
- Agent dispatch
- Agent execution
- Agent creation
- automatic Agent assignment
- provider/model dispatch
- live model calls
- GitHub/API automation
- browser/desktop control
- terminal execution by the app
- scheduler
- autonomous loop
- telemetry
- customer-data handling
- `.jai` parser/runtime behavior
- `.nexus` active runtime semantics
- `JAI_Control_Thread` authority activation
- `JAI_<repo>` runtime-agent activation
- route-state mutation
- motion-state mutation
- receipt creation as authority
- policy enforcement
- gate opening

ZERO GATES GRANTED.

## 27. Risks

- Risk: static sketch rows may be mistaken for implemented app state. Mitigation: preserve that the sketch is docs/reference-only.
- Risk: `CLOSEOUT_RECEIVED` may be mistaken for `ACCEPTED`. Mitigation: preserve visual and semantic distinction.
- Risk: decision receipt pointers may be mistaken for receipt authority. Mitigation: preserve evidence-pointer-only posture.
- Risk: Batch IDs may be mistaken for NHIDs. Mitigation: preserve separate namespace posture.
- Risk: Corpus v1 role notes may be mistaken for runtime Agent activation. Mitigation: preserve role scaffolding only language.
- Risk: recommendations may be mistaken for route authority. Mitigation: preserve recommendation-only posture.
- Risk: ZERO GATES display may be mistaken for a gate control. Mitigation: preserve ZERO GATES GRANTED and no gate behavior.

## 28. Recommended follow-up routes

Recommended next route:

- `Q3M7 Operator Batch Tracker Static Surface Sketch Review v0`

Alternative follow-up routes:

- `Q3M7 Batch Tracker Evidence Packet Alignment Review v0`
- `Q3M7 Batch Tracker jai-format Profile Candidate Planning v0`
- `Q3M7 Batch Tracker Static UI Design Brief v0`
- `Q3M7 Batch Tracker Closeout Acceptance Boundary Review v0`

Future implementation routes require separate CONTROL_THREAD acceptance.

## 29. Verification notes

Verification notes:

- All 30 required sections are present.
- Accepted baseline statements are preserved.
- Required display states are listed.
- `CLOSEOUT_RECEIVED` and `ACCEPTED` remain visually and semantically distinct.
- CONTROL_THREAD-only fields are shown locked/read-only.
- Decision receipt pointers are evidence pointers only, not receipt authority.
- Batch IDs are not presented as NHIDs.
- NHID references are references only.
- JAI Agent role language is Corpus v1 role scaffolding only, not runtime Agent activation.
- Example Batch A rows and queued/future rows are included as non-authorizing sketch examples.
- No UI, surface, runtime, parser, API, DB, Prisma, persistence, Codex automation, route-state, motion-state, acceptance authority, receipt authority, cleanup, clone/delete/archive, branch repair, routing, merge, execution, Agent, provider/model, GitHub/API, or gate behavior is added.

## 30. ZERO GATES GRANTED

ZERO GATES GRANTED.
