# Operator Batch Tracker Field Ownership Review v0

## 1. Purpose

This docs/reference artifact reviews field ownership before any operator batch tracker surface sketch, UI implementation, profile route, persistence route, or evidence-packet route.

Field ownership review is not UI implementation.

Field ownership review is not schema implementation.

Field ownership review is not tracker persistence.

Field ownership review is not API/DB/Prisma behavior.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Strategic context

The operator batch tracker needs a future field model that can display batch, lane, sublane, closeout, decision, dependency, stale-assumption, blocked/held/superseded, NHID, and ZERO GATES posture without turning display rows into workflow state.

This review separates fields into local UI affordances, future shared semantic candidates, future evidence packet candidates, CONTROL_THREAD-only decision fields, and fields not ready for implementation.

Field ownership review does not automate `Codex_Control_Thread`.

Field ownership review does not mutate route state or motion state.

Field ownership review does not create acceptance authority.

## 3. Accepted baseline

Accepted baseline:

- A1 / Portfolio Batch Tracker Baseline v0 accepted by `ChatGPT_Control_Thread` as report-only baseline.
- A2a / `orchestrator-nexus` Portfolio Batch Tracker Static Artifact v0 accepted as static docs/reference tracker baseline artifact.
- A2b / `audit-nexus` Portfolio Batch Tracker Authority Boundary Review v0 accepted as advisory tracker authority-boundary review canon.
- A3 / `dev-jai-nexus` Operator Batch Tracker Display Planning v0 accepted as docs/reference operator tracker display planning canon.
- Batch sequence restarts at Batch A.
- Prior accepted Q3M7 work remains historical accepted context.
- `Codex_Control_Thread` is a visibility/evidence tracker only.
- `CLOSEOUT_RECEIVED` does not equal `ACCEPTED`.
- `ACCEPTED` requires explicit `ChatGPT_Control_Thread` acceptance.
- Batch IDs and NHIDs remain separate namespaces unless later unified.
- Operator tracker display planning is not UI implementation.
- NHID = Numerical Hierarchy ID.
- ZERO GATES GRANTED.

Batch IDs and NHIDs remain separate namespaces unless CONTROL_THREAD later accepts unification.

## 4. Evidence inputs

Evidence inputs for this review:

- A1 / Portfolio Batch Tracker Baseline v0
- A2a / `orchestrator-nexus` Portfolio Batch Tracker Static Artifact v0
- A2b / `audit-nexus` Portfolio Batch Tracker Authority Boundary Review v0
- A3 / `dev-jai-nexus` Operator Batch Tracker Display Planning v0
- `docs/reference/operator-batch-tracker-display-planning-v0.md`
- `docs/reference/operator-portfolio-active-subset-display-planning-v0.md`
- `docs/reference/control-thread-slot-architecture-planning-v0.md`
- `docs/reference/project-coverage-state-operator-planning-v0.md`
- `docs/reference/project-coverage-state-field-model-review-v0.md`

These inputs are evidence and planning context only. They do not grant UI, schema, persistence, API, DB, route-state, motion-state, acceptance, receipt, cleanup, branch repair, routing, merge, execution, Agent, GitHub/API, or gate authority.

## 5. Field ownership review model

Required field categories:

- local UI affordance only
- future `jai-format` shared semantics candidate
- future `orchestrator-nexus` evidence packet candidate
- CONTROL_THREAD-only decision field
- not ready for implementation

Ownership category definitions:

- local UI affordance only: useful for visual grouping, scanning, labels, filters, or prompts, but not shared semantics or persistence.
- future `jai-format` shared semantics candidate: may need shared profile semantics later, but is not implemented here.
- future `orchestrator-nexus` evidence packet candidate: may need evidence capture or cross-repo packet support later, but is not implemented here.
- CONTROL_THREAD-only decision field: represents explicit decision or acceptance authority and must not be editable by ordinary tracker display.
- not ready for implementation: would require authority, persistence, parser/schema finalization, app automation, state mutation, cleanup, repair, routing, merge, execution, or gate behavior.

Tracker rows are not state mutation.

Tracker recommendations are not route authority.

## 6. Local UI affordance fields

Likely local UI affordance only fields:

- `route title`
- `target repo or control surface`
- `owner-review needed`
- local display grouping labels
- local display filters
- local visual status grouping

These fields help operators scan the tracker. They should not become shared semantics, tracker persistence, or route state without separate CONTROL_THREAD acceptance.

## 7. Future `jai-format` shared semantics candidates

Likely future `jai-format` shared semantics candidates:

- `batch_id`
- `lane_id`
- `sublane_id`
- `NHID reference`
- `mode`
- `artifact path`
- `status`
- `dependencies`
- `stale assumptions`
- `authority boundary notes`
- `next route recommendation`
- `ZERO GATES flag`
- `historical context pointer`

These fields may need shared profile support if a future parser-ready or profile-ready tracker object is accepted.

This review does not implement schema and does not mutate `jai-format` canon.

## 8. Future `orchestrator-nexus` evidence packet candidates

Likely future `orchestrator-nexus` evidence packet candidates:

- `branch`
- `commit hash`
- `merge commit`
- `closeout received`
- `blocked reason`
- `held reason`
- `superseded-by pointer`
- `acceptance evidence pointer`, as evidence pointer only and not acceptance authority

These fields may need evidence-packet support to establish where evidence came from, when it was observed, and whether it is stale.

Evidence-packet ownership does not create acceptance authority, routing authority, cleanup authority, branch repair authority, merge authority, or gate authority.

## 9. CONTROL_THREAD-only decision fields

CONTROL_THREAD-only decision fields:

- `CONTROL_THREAD decision`
- `decision timestamp`
- final `ACCEPTED` state
- acceptance evidence / acceptance receipt pointer where it records explicit `ChatGPT_Control_Thread` acceptance

CONTROL_THREAD-only fields must not be editable by ordinary tracker display.

`ACCEPTED` requires explicit `ChatGPT_Control_Thread` acceptance.

Ordinary tracker display may show these fields as evidence references only after explicit acceptance evidence exists.

## 10. Fields not ready for implementation

Fields are not ready for implementation when they require:

- persistence
- API/DB behavior
- parser behavior
- schema finalization
- route-state mutation
- motion-state mutation
- automatic acceptance
- app-controlled Codex automation
- branch repair
- cleanup authorization
- clone/delete/archive authorization
- gate behavior

Not-ready examples:

- editable `CONTROL_THREAD decision`
- editable final `ACCEPTED` state
- `cleanup_authorized`
- `clone_authorized`
- `delete_authorized`
- `archive_authorized`
- `branch_repair_authorized`
- `routing_authority`
- `merge_authority`
- `execution_authority`
- `gate_open_state`

These fields should remain absent from any near-term tracker surface.

## 11. Tracker status field ownership

The `status` field is a future `jai-format` shared semantics candidate because status vocabulary should be consistent across batch tracker views.

Required status vocabulary:

- `DRAFT`
- `ROUTED`
- `EXECUTING`
- `CLOSEOUT_RECEIVED`
- `ACCEPTED`
- `HELD`
- `BLOCKED`
- `SUPERSEDED`

`CLOSEOUT_RECEIVED` and `ACCEPTED` must remain distinct.

`CLOSEOUT_RECEIVED` means closeout evidence has been returned or observed.

`ACCEPTED` means explicit `ChatGPT_Control_Thread` acceptance has occurred.

Final `ACCEPTED` state is CONTROL_THREAD-only.

## 12. Batch / lane / sublane field ownership

Batch, lane, and sublane fields should be split by semantics:

- `batch_id`: future `jai-format` shared semantics candidate.
- `lane_id`: future `jai-format` shared semantics candidate.
- `sublane_id`: future `jai-format` shared semantics candidate.
- `route title`: local UI affordance only.
- `target repo or control surface`: local UI affordance only until shared repo/control-surface semantics are accepted.
- `mode`: future `jai-format` shared semantics candidate.
- `branch`: future `orchestrator-nexus` evidence packet candidate.

Batch and lane identifiers should help display sequence and relationship only. They do not route work, create tracker persistence, or mutate route state.

## 13. NHID reference field ownership

`NHID reference` is a future `jai-format` shared semantics candidate.

NHID means Numerical Hierarchy ID.

NHID identifies hierarchy; it does not execute work.

NHID references may help align batch, lane, and sublane display with broader work hierarchy. They should not unify with batch IDs unless CONTROL_THREAD later accepts unification.

Batch IDs and NHIDs remain separate namespaces unless CONTROL_THREAD later accepts unification.

## 14. Closeout and acceptance field ownership

Closeout and acceptance fields require strict separation:

- `closeout received`: future `orchestrator-nexus` evidence packet candidate.
- `CONTROL_THREAD decision`: CONTROL_THREAD-only decision field.
- `decision timestamp`: CONTROL_THREAD-only decision field.
- `acceptance evidence pointer`: future `orchestrator-nexus` evidence packet candidate as evidence pointer; CONTROL_THREAD-only where it records explicit acceptance.
- final `ACCEPTED` state: CONTROL_THREAD-only decision field.

`CLOSEOUT_RECEIVED` does not equal `ACCEPTED`.

`CLOSEOUT_RECEIVED` and `ACCEPTED` must remain distinct.

A closeout packet must not become an acceptance receipt unless `ChatGPT_Control_Thread` explicitly accepts it.

Field ownership review does not create acceptance authority.

## 15. Dependency / stale assumption field ownership

Dependency and stale assumption fields should separate shared semantics from evidence capture:

- `dependencies`: future `jai-format` shared semantics candidate.
- `stale assumptions`: future `jai-format` shared semantics candidate, with evidence-packet support likely needed later for source and freshness.

Dependencies and stale assumptions are review context. They do not route work, mutate route state, execute work, approve work, or open gates.

## 16. Held / blocked / superseded field ownership

Held, blocked, and superseded fields need evidence and authority boundaries:

- `blocked reason`: future `orchestrator-nexus` evidence packet candidate.
- `held reason`: future `orchestrator-nexus` evidence packet candidate.
- `superseded-by pointer`: future `orchestrator-nexus` evidence packet candidate and possible future `jai-format` shared semantics candidate after ownership review.

Held, blocked, and superseded display does not authorize cleanup, clone/delete/archive, branch repair, routing, merge, execution, or gate opening.

Supersession pointers should remain evidence and lineage until CONTROL_THREAD accepts any replacement route.

## 17. ZERO GATES field ownership

`ZERO GATES flag` is a future `jai-format` shared semantics candidate because the phrase needs consistent display semantics across tracker, portfolio, and coverage surfaces.

ZERO GATES GRANTED.

The ZERO GATES flag is display posture only. It does not open gates, close gates, evaluate gates, or grant authority.

Gate-opening fields remain not ready for implementation.

## 18. Field ownership matrix

| Field name | Likely ownership category | Rationale | Implementation readiness | Authority boundary note |
| --- | --- | --- | --- | --- |
| `batch_id` | future `jai-format` shared semantics candidate | Batch identity should be consistent across tracker displays. | Not implemented; needs profile review. | Identifier only; not route or execution authority. |
| `lane_id` | future `jai-format` shared semantics candidate | Lane identity should be portable across batch tracker views. | Not implemented; needs profile review. | Lane rows do not self-accept. |
| `sublane_id` | future `jai-format` shared semantics candidate | Sublane identity may need shared semantics for nested display. | Not implemented; needs profile review. | Sublane display is not route-state mutation. |
| `NHID reference` | future `jai-format` shared semantics candidate | NHID links tracker posture to hierarchy. | Not implemented; needs NHID/profile alignment. | NHID identifies hierarchy; it does not execute work. |
| `route title` | local UI affordance only | Human-readable display label. | Display-only planning; not schema. | Title does not authorize route execution. |
| `target repo or control surface` | local UI affordance only | Helps scan target context before shared semantics exist. | Display-only planning; not schema. | Target display does not authorize repo mutation. |
| `mode` | future `jai-format` shared semantics candidate | Mode semantics may need consistent profile vocabulary. | Not implemented; needs profile review. | Mode display is not authority. |
| `branch` | future `orchestrator-nexus` evidence packet candidate | Branch is evidence from repo state. | Not implemented; needs evidence packet support. | Branch display does not authorize repair, checkout, push, or merge. |
| `artifact path` | future `jai-format` shared semantics candidate | Artifact references may need shared path semantics. | Not implemented; needs profile review. | Path display does not mutate files. |
| `status` | future `jai-format` shared semantics candidate | Status vocabulary should be shared. | Not implemented; requires status semantics review. | Final `ACCEPTED` remains CONTROL_THREAD-only. |
| `commit hash` | future `orchestrator-nexus` evidence packet candidate | Commit evidence belongs to observed repo state. | Not implemented; needs evidence packet support. | Hash display does not merge or accept. |
| `merge commit` | future `orchestrator-nexus` evidence packet candidate | Merge evidence is observed after external merge. | Not implemented; needs evidence packet support. | Merge commit display does not grant merge authority. |
| `closeout received` | future `orchestrator-nexus` evidence packet candidate | Closeout arrival is evidence. | Not implemented; needs evidence packet support. | `CLOSEOUT_RECEIVED` does not equal `ACCEPTED`. |
| `CONTROL_THREAD decision` | CONTROL_THREAD-only decision field | Decision authority belongs to CONTROL_THREAD. | Not editable by tracker display. | Ordinary tracker display must not edit it. |
| `decision timestamp` | CONTROL_THREAD-only decision field | Timestamp records explicit decision evidence. | Not editable by tracker display. | Timestamp does not create acceptance by itself. |
| `dependencies` | future `jai-format` shared semantics candidate | Dependencies need shared reference semantics. | Not implemented; needs profile review. | Dependency display does not route work. |
| `stale assumptions` | future `jai-format` shared semantics candidate | Staleness needs shared review semantics. | Not implemented; may also need evidence support. | Stale display does not self-resolve. |
| `authority boundary notes` | future `jai-format` shared semantics candidate | Boundary notes should be consistent across surfaces. | Not implemented; needs profile review. | Notes do not grant authority. |
| `next route recommendation` | future `jai-format` shared semantics candidate | Recommendation vocabulary may need shared semantics. | Not implemented; needs profile review. | Tracker recommendations are not route authority. |
| `ZERO GATES flag` | future `jai-format` shared semantics candidate | ZERO GATES posture needs consistent display. | Not implemented; needs profile review. | ZERO GATES flag does not open gates. |
| `historical context pointer` | future `jai-format` shared semantics candidate | Historical context may need shared lineage references. | Not implemented; needs profile review. | Historical context does not self-accept current work. |
| `superseded-by pointer` | future `orchestrator-nexus` evidence packet candidate | Supersession requires evidence and lineage. | Not implemented; needs evidence packet support. | Supersession display does not route replacement work. |
| `blocked reason` | future `orchestrator-nexus` evidence packet candidate | Blocker reason is evidence from route or review. | Not implemented; needs evidence packet support. | Blocker display does not resolve blocker. |
| `held reason` | future `orchestrator-nexus` evidence packet candidate | Held reason is evidence/review posture. | Not implemented; needs evidence packet support. | Held display does not approve resumption. |
| `owner-review needed` | local UI affordance only | Useful operator prompt. | Display-only planning; not schema. | Prompt does not self-accept. |
| `acceptance evidence pointer` | future `orchestrator-nexus` evidence packet candidate | Pointer may cite acceptance evidence. | Not implemented; CONTROL_THREAD-only where it records acceptance. | Evidence pointer is not acceptance authority. |

## 19. Surface sketch prerequisites

Before any operator batch tracker surface sketch:

- field categories should be accepted by CONTROL_THREAD
- `CLOSEOUT_RECEIVED` and `ACCEPTED` separation should remain visible
- CONTROL_THREAD-only fields should be read-only display references
- tracker rows should remain display-only
- no persistence, API/DB behavior, route-state mutation, or motion-state mutation should be added
- ZERO GATES posture should remain visible

Surface sketch work requires separate CONTROL_THREAD acceptance.

## 20. Profile/schema prerequisites

Before any profile or schema route:

- shared status vocabulary needs profile ownership review
- batch/lane/sublane identifiers need namespace review
- NHID relationship needs explicit non-unification or accepted unification posture
- acceptance fields need CONTROL_THREAD-only semantics
- route recommendation fields need non-authority semantics
- ZERO GATES flag needs display-only semantics

Field ownership review is not schema implementation.

## 21. Evidence-packet prerequisites

Before any evidence-packet route:

- branch, commit hash, merge commit, closeout received, blocked reason, held reason, superseded-by pointer, and acceptance evidence pointer need source/evidence rules
- evidence freshness and stale assumptions need review cadence
- evidence pointers must not create acceptance authority
- evidence packet support must not automate GitHub/API calls from `dev.jai.nexus`

Evidence packet support requires separate CONTROL_THREAD acceptance.

## 22. Non-authorized behaviors

This field ownership review does not authorize:

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

## 23. Risks

- Risk: field ownership may be mistaken for schema readiness. Mitigation: preserve that field ownership review is not schema implementation.
- Risk: CONTROL_THREAD-only fields may be made editable by a future tracker display. Mitigation: preserve read-only decision field posture.
- Risk: `CLOSEOUT_RECEIVED` may be conflated with `ACCEPTED`. Mitigation: preserve distinct ownership and semantics.
- Risk: recommendations may imply route authority. Mitigation: preserve that tracker recommendations are not route authority.
- Risk: rows may imply state mutation. Mitigation: preserve that tracker rows are not state mutation.
- Risk: Batch IDs and NHIDs may be unified prematurely. Mitigation: preserve separate namespaces unless CONTROL_THREAD later accepts unification.
- Risk: evidence fields may imply app automation. Mitigation: preserve evidence-packet-only posture and no Codex/GitHub automation by app.

## 24. Recommended follow-up routes

Recommended next route:

- `Q3M7 Operator Batch Tracker Static Surface Sketch v0`

Alternative follow-up routes:

- `Q3M7 Batch Tracker Closeout Acceptance Boundary Review v0`
- `Q3M7 Batch Tracker NHID Mapping Review v0`
- `Q3M7 Batch Tracker Evidence Packet Alignment Review v0`
- `Q3M7 Batch Tracker jai-format Semantics Planning v0`

Future implementation routes require separate CONTROL_THREAD acceptance.

## 25. Verification notes

Verification notes:

- All 26 required sections are present.
- All required field categories are included.
- Every required field is classified in the field ownership matrix.
- `CLOSEOUT_RECEIVED` and `ACCEPTED` remain distinct.
- CONTROL_THREAD-only decision fields are identified and marked non-editable by ordinary tracker display.
- Batch IDs and NHIDs remain separate namespaces unless CONTROL_THREAD later accepts unification.
- No UI, surface, runtime, parser, API, DB, Prisma, persistence, Codex automation, route-state, motion-state, acceptance authority, receipt authority, cleanup, clone/delete/archive, branch repair, routing, merge, execution, Agent, provider/model, GitHub/API, or gate behavior is added.

## 26. ZERO GATES GRANTED

ZERO GATES GRANTED.
