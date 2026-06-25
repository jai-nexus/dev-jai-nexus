# Corpus v2 Organizational Memory Visibility Planning v0

## 1. Purpose

This docs/reference artifact plans how `dev.jai.nexus` may eventually display Corpus v2 organizational memory visibility.

This is docs/reference planning only.

No UI implementation.

No surface implementation.

No API/DB behavior.

No persistence.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Strategic context

Corpus v2 organizational memory visibility needs an operator-facing model that can show memory object references, NHID references, batch/lane references, route/work/closeout references, closeout pointers, decision receipt pointers, receipt index posture, `accepted_by_ref`, decision references, authority-boundary notes, stale assumptions, domain-engine references, JAI Agent scaffolding references, Corpus v1 / Corpus v2 posture, and ZERO GATES markers.

The visibility model should help operators reason about organizational memory lineage without activating Corpus v2 infrastructure, creating storage behavior, implementing receipt indexes, validating acceptance, or turning `.jai` semantics into runtime behavior.

Corpus v2 planning must be visibly distinct from active Corpus v2 infrastructure.

This planning must not imply implemented UI.

## 3. Accepted baseline

Accepted baseline:

- Batch A Portfolio Batch Tracker Foundation accepted through A9.
- B1 / `jai-format` Corpus v1 to Corpus v2 Organizational Memory Semantics Planning v0 accepted as static shared-semantics planning canon.
- B2 / `orchestrator-nexus` Organizational Memory Object / NHID / Receipt Index Mapping v0 accepted as static compatibility mapping canon.
- B3 / `audit-nexus` Corpus v1 / Corpus v2 Organizational Memory Authority Boundary Review v0 accepted as advisory authority-boundary review canon.
- B4 / `orchestrator-nexus` Organizational Memory Object Field Vocabulary v0, if available.
- B5 / `orchestrator-nexus` Receipt Index Planning Posture v0, if available.
- Corpus v2 planning is not Corpus v2 activation.
- `.jai` organizational memory semantics are not `.jai` parser/runtime behavior.
- NHIDs are hierarchy/location/reference identifiers only.
- Memory object references are planning/evidence references only, not persistence or API/DB-backed state.
- Receipt index planning is not receipt index implementation.
- Decision receipt pointers are evidence pointers only, not receipt authority.
- `accepted_by_ref` and decision refs do not self-validate acceptance.
- JAI Agent role language is Corpus v1 role scaffolding only, not Agent activation, dispatch, or creation.
- Domain-engine references are planning references only, not activation or repo ownership.
- ZERO GATES is an explicit non-authorization marker, not readiness approval.
- Future `dev-jai-nexus` Corpus v1 routes should use `Role: JAI::DEV::BUILDER` unless explicitly overridden.
- ZERO GATES GRANTED.

This baseline is visibility planning context only. It does not authorize organizational memory activation, Corpus v2 activation, receipt index implementation, receipt behavior, schema enforcement, validator enforcement, parser/runtime behavior, persistence, API/DB-backed state, or gate behavior.

## 4. Evidence inputs

Accepted evidence inputs cited for lineage:

- Batch A Portfolio Batch Tracker Foundation accepted through A9.
- B1 / `jai-format` Corpus v1 to Corpus v2 Organizational Memory Semantics Planning v0.
- B2 / `orchestrator-nexus` Organizational Memory Object / NHID / Receipt Index Mapping v0.
- B3 / `audit-nexus` Corpus v1 / Corpus v2 Organizational Memory Authority Boundary Review v0.
- B4 / `orchestrator-nexus` Organizational Memory Object Field Vocabulary v0, if available.
- B5 / `orchestrator-nexus` Receipt Index Planning Posture v0, if available.
- `dev-jai-nexus / Q3M7 Operator Batch Tracker Static Surface Sketch v0`.
- `dev-jai-nexus / Q3M7 Operator Batch Tracker Field Ownership Review v0`.
- `dev-jai-nexus / Q3M7 Control Thread Slot Architecture Planning v0`.
- `dev-jai-nexus / Q3M7 Project Coverage State Operator Planning v0`.
- `dev-jai-nexus / Q3M7 Project Coverage State Field Model Review v0`.

These are evidence inputs only. They do not grant new authority and do not implement Corpus v2, organizational memory, receipts, receipt index, API/DB state, UI, storage, parser, validator, Agent, domain-engine activation, or gates.

## 5. Visibility planning scope

This visibility planning covers future display posture for:

- organizational memory objects
- NHID references
- batch/lane references
- route/work/closeout references
- closeout pointers
- decision receipt pointers
- receipt index posture
- `accepted_by_ref`
- decision references
- authority-boundary notes
- stale assumptions
- domain-engine references
- JAI Agent scaffolding references
- Corpus v1 / Corpus v2 posture
- ZERO GATES markers

The scope is display planning only. It is not schema enforcement, validator enforcement, parser/runtime behavior, storage behavior, receipt index behavior, receipt behavior, or organizational memory activation.

## 6. Operator visibility principles

Operator visibility principles:

- Corpus v2 planning must be visibly distinct from active Corpus v2 infrastructure.
- `.jai` memory semantics must not be displayed as executable runtime behavior.
- NHID references must be displayed as hierarchy/location/reference only.
- Receipt pointers must be displayed as evidence pointers only, not receipt authority.
- `accepted_by_ref` and decision refs must not imply self-validating acceptance.
- JAI Agent role references must be displayed as Corpus v1 role scaffolding only.
- Domain-engine references must not imply activation or repo ownership.
- ZERO GATES must be displayed as a non-authorization marker, not readiness approval.
- CONTROL_THREAD-only fields must remain locked/read-only.
- This planning must not imply implemented UI.

## 7. Corpus layer display concept

A future operator display may distinguish Corpus layers as follows:

| Corpus layer | Display meaning | Boundary |
| --- | --- | --- |
| Corpus v1 active/current planning context | Current accepted role and planning scaffolding. | Planning context only. |
| Corpus v2 planning context | Candidate organizational memory visibility semantics. | Corpus v2 planning is not Corpus v2 activation. |
| Corpus v2 candidate semantics | Shared-semantics candidates from B1/B2/B4. | Candidate semantics only, not schema enforcement. |
| Corpus v2 non-active infrastructure posture | Explicitly inactive implementation posture. | No persistence, API/DB state, runtime, or storage behavior. |
| Blocked activation posture | Activation requires future explicit gates. | ZERO GATES GRANTED. |

Corpus v2 visibility does not imply persistence, schema enforcement, API/DB state, or runtime behavior.

## 8. Memory object display concept

Possible memory object display fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| `memory_object_ref` | reference identifier | Planning/evidence reference only. |
| `memory_object_title` | human-readable title | Local display affordance only. |
| `corpus_layer` | Corpus v1 or Corpus v2 planning layer | Does not activate Corpus v2. |
| `object_kind` | memory object kind | Candidate semantics only. |
| `source_batch` | batch source reference | Batch reference only. |
| `source_lane` | lane source reference | Lane reference only. |
| `source_repo` | source repo reference | Does not assign repo ownership. |
| `source_artifact_path` | artifact reference path | Does not mutate files or canon. |
| `nhid_ref` | hierarchy/location/reference | NHID reference only. |
| `receipt_pointer` | receipt evidence pointer | Not receipt authority. |
| `decision_ref` | decision evidence reference | Does not self-validate acceptance. |
| `accepted_by_ref` | acceptance actor/reference | Locked/read-only; does not self-validate. |
| `authority_boundary_note` | boundary text | Does not grant authority. |
| `stale_assumption_note` | freshness warning | Does not self-resolve. |
| `zero_gates_marker` | non-authorization marker | Not readiness approval. |

Memory object references are planning/evidence references only.

Memory object visibility does not create storage behavior, persistence, API/DB-backed state, canon mutation, or organizational memory activation.

## 9. NHID reference display concept

NHID means Numerical Hierarchy ID.

NHIDs are hierarchy/location/reference identifiers only.

NHID references should display:

- `nhid_ref`
- `nhid_parent`, if available
- `nhid_path`, if available
- related batch/lane route references
- related work/closeout references

NHID references must be displayed as hierarchy/location/reference only.

NHIDs do not execute work, route work, mutate state, approve work, accept work, activate Agents, open gates, or grant authority.

Do not use any incorrect legacy NHID expansion.

## 10. Batch / lane reference display concept

Batch and lane reference display may show:

| Field | Display posture | Boundary |
| --- | --- | --- |
| `source_batch` | Batch A/B route source | Batch reference only. |
| `source_lane` | lane or sublane source | Lane reference only. |
| `batch_tracker_row_ref` | tracker row reference | Not tracker persistence. |
| `route_packet_ref` | route context reference | Not routing authority. |

Batch/lane references help locate memory objects in the work hierarchy. They do not execute, route, accept, or mutate tracker state.

## 11. Route / work / closeout reference display concept

Route, work, and closeout references may show:

- route/work packet references
- source branch references, if evidence supports them
- closeout pointers
- validation report references
- stale assumption notes
- blocked or held route references

Route/work/closeout references are evidence and lineage references only.

Closeout pointers are not acceptance.

Route references do not route themselves.

## 12. Decision receipt pointer display concept

Decision receipt pointer display may show:

| Pointer | Display posture | Boundary |
| --- | --- | --- |
| `receipt_pointer` | evidence/reference only | Not receipt authority. |
| `decision_receipt_pointer` | decision evidence pointer | Not receipt creation. |
| `acceptance_evidence_ref` | explicit acceptance evidence, if present | Does not self-validate. |
| `accepted_by_ref` | locked acceptance actor/reference | CONTROL_THREAD acceptance still required. |

Receipt pointers must be displayed as evidence pointers only, not receipt authority.

Decision receipt pointers are evidence pointers only, not receipt authority.

Receipt pointers do not create receipts, update canon, validate acceptance, or open gates.

## 13. Receipt index posture display concept

Receipt index posture display may show:

- receipt index planning reference
- receipt index mapping reference
- receipt pointer presence
- missing receipt pointer posture
- stale receipt pointer posture
- acceptance evidence reference
- `accepted_by_ref`

Receipt index planning is not receipt index implementation.

Receipt index posture display does not create an index, update an index, validate receipt references, create receipts, or grant acceptance authority.

## 14. Authority-boundary note display concept

Authority-boundary notes may show:

- planning-only posture
- no persistence
- no API/DB state
- no parser/runtime behavior
- no receipt authority
- no acceptance authority
- no Agent activation
- no domain-engine activation
- no repo ownership assignment
- ZERO GATES marker

Authority-boundary notes are display text only. They do not enforce policy, validate objects, grant authority, or open gates.

## 15. `accepted_by_ref` display concept

`accepted_by_ref` display should be locked/read-only.

`accepted_by_ref` and decision refs do not self-validate acceptance.

`accepted_by_ref` may point to acceptance evidence only after explicit CONTROL_THREAD acceptance exists.

Acceptance still requires explicit CONTROL_THREAD acceptance.

`accepted_by_ref` is not editable by ordinary memory visibility display.

## 16. Stale assumption display concept

Stale assumption display may show:

- `stale_assumption_note`
- stale source artifact warning
- stale receipt pointer warning
- stale NHID mapping warning
- stale domain-engine reference warning
- stale Corpus v2 planning warning

Stale assumption display is review context only. It does not refresh evidence, mutate state, validate references, accept work, or resolve stale posture.

## 17. Domain-engine reference display concept

Domain-engine reference display may show:

| Field | Display posture | Boundary |
| --- | --- | --- |
| `domain_engine_ref` | planning reference | Not activation. |
| `domain_engine_context` | context label | Not repo ownership. |
| `domain_engine_relationship` | relationship note | Not runtime behavior. |
| `domain_engine_activation_state` | locked/non-active posture | Not activation control. |

Domain-engine references are planning references only.

Domain-engine references must not imply activation or repo ownership.

Domain-engine references do not assign repo ownership, activate domain engines, dispatch Agents, or open gates.

## 18. JAI Agent scaffolding display concept

JAI Agent scaffolding display may show:

| Role reference | Display posture | Boundary |
| --- | --- | --- |
| `JAI::DEV::BUILDER` | Corpus v1 route role scaffolding | Not Agent activation. |
| `JAI::FORMAT::ARCHITECT` | role-language example | Not Agent creation. |
| `JAI::ORCHESTRATOR::*` | wildcard role namespace example | Not assignment. |
| `JAI::AUDIT::VERIFIER` | role-language example | Not dispatch. |
| `JAI::AGENT::<role>` | generic role slot | Not runtime Agent. |

JAI Agent role references must be displayed as Corpus v1 role scaffolding only.

JAI Agent role language is Corpus v1 role scaffolding only.

JAI Agent role references do not activate Agents, dispatch Agents, create Agents, assign Agents, or create execution authority.

## 19. ZERO GATES display concept

ZERO GATES display may show:

| Marker | Display meaning | Boundary |
| --- | --- | --- |
| ZERO GATES GRANTED | explicit non-authorization marker | Not readiness approval. |
| ZERO GATES marker | object-level boundary marker | Does not open gates. |
| blocked activation marker | activation unavailable | Does not evaluate gates. |

ZERO GATES must be displayed as a non-authorization marker, not readiness approval.

ZERO GATES is an explicit non-authorization marker, not readiness approval.

ZERO GATES GRANTED.

## 20. Locked / read-only fields

Fields that should remain locked/read-only in future display:

- CONTROL_THREAD decision fields
- acceptance decision fields
- `accepted_by_ref`
- decision refs
- receipt pointer fields where they could be mistaken for authority
- ZERO GATES markers
- Corpus v2 activation posture
- domain-engine activation posture
- JAI Agent activation posture

CONTROL_THREAD-only fields must remain locked/read-only.

Locked/read-only display does not implement permissions, persistence, validation, or enforcement.

## 21. Local UI affordance candidates

Local UI affordance candidates:

- grouping by corpus layer
- filtering by batch/lane
- filtering by NHID ref
- filtering by receipt pointer presence
- grouping by domain-engine reference
- grouping by stale assumption state
- visual marker for ZERO GATES
- visual marker for Corpus v2 planning vs active infrastructure

Local UI affordance candidates are display/sorting/filtering candidates only.

They are not UI implementation authority.

## 22. Fields not ready for implementation

Fields are not ready for implementation if they require:

- Corpus v2 activation
- organizational memory activation
- receipt index implementation
- receipt implementation
- persistence
- API/DB behavior
- schema enforcement
- validator enforcement
- parser/runtime behavior
- route-state mutation
- motion-state mutation
- canon mutation
- acceptance authority
- Agent activation/dispatch/creation/assignment
- repo ownership assignment
- gate opening

Not-ready examples:

- active Corpus v2 object state
- writable organizational memory object state
- receipt index mutation
- receipt creation
- editable `accepted_by_ref`
- editable CONTROL_THREAD decision refs
- domain-engine activation state
- JAI Agent activation state
- repo ownership assignment
- gate-open state

## 23. Corpus v2 non-activation display rule

Corpus v2 planning is not Corpus v2 activation.

Corpus v2 planning must be visibly distinct from active Corpus v2 infrastructure.

Corpus v2 visibility does not imply persistence, schema enforcement, validator enforcement, API/DB state, storage behavior, parser/runtime behavior, organizational memory activation, receipt index implementation, or gate behavior.

Any future display should use explicit labels such as `Corpus v2 planning`, `candidate semantics`, `not active infrastructure`, and `ZERO GATES GRANTED`.

## 24. Non-authorized behaviors

This planning artifact does not authorize:

- UI implementation
- surface implementation
- runtime activation
- parser implementation
- schema enforcement
- validator enforcement
- API behavior
- DB behavior
- Prisma behavior
- persistence
- storage behavior
- receipt index implementation
- receipt implementation
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
- Agent assignment
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
- canon mutation
- repo ownership assignment
- Corpus v2 activation
- organizational memory activation
- policy enforcement
- gate opening

ZERO GATES GRANTED.

## 25. Risks

- Risk: Corpus v2 planning may be mistaken for active Corpus v2 infrastructure. Mitigation: preserve explicit non-activation labels.
- Risk: `.jai` memory semantics may be mistaken for runtime behavior. Mitigation: preserve non-runtime wording.
- Risk: receipt pointers may be mistaken for receipt authority. Mitigation: display pointers as evidence only.
- Risk: `accepted_by_ref` may be mistaken for self-validating acceptance. Mitigation: keep it locked/read-only and require CONTROL_THREAD acceptance.
- Risk: JAI Agent role references may be mistaken for Agent activation or assignment. Mitigation: preserve Corpus v1 role scaffolding posture.
- Risk: domain-engine references may be mistaken for activation or repo ownership. Mitigation: preserve planning-reference-only posture.
- Risk: ZERO GATES markers may be mistaken for readiness approval. Mitigation: preserve non-authorization marker language.

## 26. Recommended follow-up routes

Recommended next route:

- `Q3M7 Corpus v2 Organizational Memory Visibility Field Ownership Review v0`

Alternative follow-up routes:

- `Q3M7 Corpus v2 Receipt Pointer Visibility Sketch v0`
- `Q3M7 Organizational Memory NHID Reference Display Review v0`
- `Q3M7 Corpus v2 JAI Agent Scaffolding Boundary Review v0`
- `Q3M7 Corpus v2 Domain Engine Reference Boundary Review v0`

Future implementation routes require separate CONTROL_THREAD acceptance.

## 27. Verification notes

Verification notes:

- All 28 required sections are present.
- Accepted baseline statements are preserved.
- Corpus v2 planning is visibly distinct from active Corpus v2 infrastructure.
- `.jai` memory semantics are not executable runtime behavior.
- NHID references are hierarchy/location/reference only.
- The incorrect NHID expansion is not used.
- Receipt pointers are evidence pointers only, not receipt authority.
- `accepted_by_ref` and decision refs do not self-validate acceptance.
- JAI Agent role references are Corpus v1 role scaffolding only.
- Domain-engine references do not imply activation or repo ownership.
- ZERO GATES is a non-authorization marker, not readiness approval.
- No UI, surface, runtime, parser, schema enforcement, validator enforcement, API, DB, Prisma, persistence, storage, receipt index, receipt, Codex automation, route-state, motion-state, acceptance authority, receipt authority, Agent, provider/model, GitHub/API, Corpus v2 activation, organizational memory activation, canon mutation, repo ownership assignment, or gate behavior is added.

## 28. ZERO GATES GRANTED

ZERO GATES GRANTED.
