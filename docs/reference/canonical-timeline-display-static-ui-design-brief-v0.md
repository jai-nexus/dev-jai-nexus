# Canonical Timeline Display Static UI Design Brief v0

## 1. Purpose

This docs/reference artifact briefs a possible future static UI design for canonical timeline display in `dev.jai.nexus`.

This is a static docs/reference design brief only.

Design brief does not approve implementation.

No UI implementation.

No surface implementation.

No component implementation.

No page implementation.

No route implementation.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Strategic context

The Q3M7Y26 Canonical Project Timeline and Motion Governance Kernel needs a future operator-facing display concept for the canonical timeline, Program Header, motions, motion hygiene, work waves, work packets, route packets, closeouts, receipts, evidence, NHIDs, Batch IDs, `.jai` coordination-memory records, `.nexus` project-state records, JAI Agent scaffolds, JAI Panel scaffolds, CONTROL_THREAD decisions, best-motion recommendations, and ZERO GATES markers.

This design brief uses accepted C6 planning, C9 field ownership review, C10 static surface sketch, and C13 static surface sketch review as planning inputs.

The brief is concrete enough to guide future design discussion, but it does not create UI routes, components, pages, CSS, API/DB behavior, persistence, runtime behavior, parser behavior, state mutation, authority, readiness approval, production authority, or gates.

## 3. Accepted baseline

Accepted baseline:

- Batch A Portfolio Batch Tracker Foundation accepted through A9.
- Batch B Organizational Memory Foundation accepted through B12.
- C1 / Program Definition / Motion Timeline Kernel Planning v0 accepted.
- C2 / `.jai` Program and Motion Timeline Shared Semantics Planning v0 accepted.
- C3 / Program / Motion / JAI Panel Authority Boundary Review v0 accepted.
- C4 / Program Header Envelope Candidate Table v0 accepted.
- C5 / Motion Hygiene Field Vocabulary Planning v0 accepted.
- C6 / Canonical Timeline Display Planning v0 accepted.
- C7 / Program Header Envelope / Motion Hygiene Authority Boundary Review v0 accepted.
- C8 / Program Header Envelope Field Ownership Planning v0 accepted.
- C9 / Canonical Timeline Display Field Ownership Review v0 accepted.
- C10 / Canonical Timeline Display Static Surface Sketch v0 accepted.
- C11 / Program Header / Motion Hygiene Field Profile Planning v0 accepted.
- C12 / Program Header / Motion Hygiene Compatibility Mapping v0 accepted.
- C13 / Canonical Timeline Display Static Surface Sketch Review v0 accepted.
- C14 / Program Header / Motion Hygiene Compatibility Authority Boundary Review v0 accepted.
- C15 / Program Header / Motion Hygiene Compatibility Example Set v0 accepted.
- Static UI design brief is not UI implementation.
- Design-brief readiness is not implementation approval.
- Static surface sketch is not surface, component, page, route, or UI implementation.
- CONTROL_THREAD-only fields must remain locked/read-only.
- Motion hygiene display is not approval.
- `hygiene_passed` display is not route selection or acceptance.
- Best-motion recommendation display is not route selection.
- Receipt display is not receipt authority.
- JAI Agent / JAI Panel scaffold display is not activation or voting.
- `.jai` display is not parser/runtime behavior.
- `.nexus` display is not persistence or active runtime state.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

Evidence inputs cited for lineage:

- Batch A Portfolio Batch Tracker Foundation accepted through A9.
- Batch B Organizational Memory Foundation accepted through B12.
- C1 / Program Definition / Motion Timeline Kernel Planning v0.
- C2 / `.jai` Program and Motion Timeline Shared Semantics Planning v0.
- C3 / Program / Motion / JAI Panel Authority Boundary Review v0.
- C4 / Program Header Envelope Candidate Table v0.
- C5 / Motion Hygiene Field Vocabulary Planning v0.
- C6 / `dev-jai-nexus` Canonical Timeline Display Planning v0.
- C7 / Program Header Envelope / Motion Hygiene Authority Boundary Review v0.
- C8 / Program Header Envelope Field Ownership Planning v0.
- C9 / `dev-jai-nexus` Canonical Timeline Display Field Ownership Review v0.
- C10 / `dev-jai-nexus` Canonical Timeline Display Static Surface Sketch v0.
- C11 / Program Header / Motion Hygiene Field Profile Planning v0.
- C12 / Program Header / Motion Hygiene Compatibility Mapping v0.
- C13 / `dev-jai-nexus` Canonical Timeline Display Static Surface Sketch Review v0.
- C14 / Program Header / Motion Hygiene Compatibility Authority Boundary Review v0.
- C15 / Program Header / Motion Hygiene Compatibility Example Set v0.
- `dev-jai-nexus / Q3M7 Corpus v2 Organizational Memory Visibility Planning v0`.
- `dev-jai-nexus / Q3M7 Operator Batch Tracker Static Surface Sketch v0`.
- `dev-jai-nexus / Q3M7 Control Thread Slot Architecture Planning v0`.
- `dev-jai-nexus / Q3M7 Project Coverage State Operator Planning v0`.
- `dev-jai-nexus / Q3M7 Project Coverage State Field Model Review v0`.

These inputs are evidence and lineage references only. They do not claim new authority.

## 4. Static UI design brief scope

This brief covers static design concepts for:

- Program Header summary region
- canonical timeline event list region
- motion queue region
- motion hygiene region
- best-motion recommendation region
- work wave region
- work packet region
- route packet region
- closeout region
- decision receipt region
- evidence/provenance region
- NHID / Batch ID relationship region
- `.jai` coordination-memory preview region
- `.nexus` project-state preview region
- JAI Agent scaffold display region
- JAI Panel scaffold display region
- CONTROL_THREAD locked/read-only decision fields
- ZERO GATES non-authorization marker

The scope is static docs/reference design only.

## 5. Static-only posture

This is a static docs/reference design brief only.

No component, route, page, React implementation, UI implementation, CSS, API, DB, persistence, or runtime behavior may be added.

The brief does not add component/page/route behavior, parser behavior, schema enforcement, validator enforcement, tracker behavior, receipt behavior, receipt index behavior, state mutation, Agent/Panel activation, voting, best-motion automation, authority, readiness approval, production authority, or gates.

## 6. Non-implementation posture

Static UI design brief is not UI implementation.

Design brief does not approve implementation.

Design-brief readiness is not implementation approval.

This brief cannot authorize:

- component/page/route behavior
- API/DB approval
- persistence approval
- runtime approval
- parser/schema/validator approval
- tracker approval
- receipt/index approval
- state mutation
- canon mutation
- Agent/Panel activation
- voting
- best-motion automation
- routing authority
- execution authority
- acceptance authority
- receipt authority
- readiness approval
- production authority
- gate opening

## 7. Design principles

Design principles:

- Static-first visibility.
- CONTROL_THREAD authority clarity.
- Locked/read-only treatment for authority-bearing fields.
- Evidence/provenance separation.
- Program, motion, timeline, work, closeout, receipt, and state separation.
- NHID / Batch ID namespace separation.
- `.jai` and `.nexus` non-runtime display boundaries.
- JAI Agent / JAI Panel scaffolding-only display.
- ZERO GATES visible as non-authorization marker.

These principles are planning constraints only. They do not implement UI.

## 8. Information architecture

Possible static information architecture:

| Region | Purpose | Boundary |
| --- | --- | --- |
| Page header / Program Header summary | orient operator to Program and authority posture | Program display does not grant execution authority. |
| Timeline body / event list | show canonical timeline events | Timeline display does not mutate canon or state. |
| Motion governance side panel | show motion queue, hygiene, and recommendation posture | Motion display does not mutate motion state. |
| Work organization panel | show work waves, work packets, route packets | Work displays do not execute or route. |
| Closeout / receipt / evidence panel | show closeouts, receipts, evidence, provenance | Closeouts do not accept; receipts do not create authority. |
| ID / namespace panel | show NHID and Batch ID relationships | Batch IDs and NHIDs remain separate namespaces. |
| `.jai` / `.nexus` preview panel | show coordination-memory and project-state references | No parser/runtime, persistence, or active runtime state. |
| Agent / Panel scaffold panel | show inactive scaffolding | No Agent activation, Panel activation, or voting. |
| CONTROL_THREAD decision region | show locked decision fields | CONTROL_THREAD-only fields remain locked/read-only. |
| ZERO GATES region | show non-authorization posture | Not readiness approval. |

This is information architecture planning only.

It does not create routes, pages, components, state, API/DB, persistence, or runtime behavior.

## 9. Canonical timeline page brief

Purpose: provide an operator-facing static timeline view that gathers Program, motion, work, closeout, receipt, evidence, identity, substrate, scaffold, and CONTROL_THREAD decision context in one visible planning surface.

Primary regions:

- Program Header summary
- canonical timeline event list
- motion governance side panel
- work organization panel
- closeout / receipt / evidence panel
- NHID / Batch ID relationship panel
- `.jai` / `.nexus` preview panel
- Agent / Panel scaffold panel
- CONTROL_THREAD locked decision region
- ZERO GATES region

Safe display content includes references, status labels, evidence pointers, boundary warnings, locked decisions, and non-authorization markers.

Locked/read-only fields include CONTROL_THREAD decisions, acceptance fields, receipt decision fields, authority boundaries, route-state/motion-state posture, Agent/Panel activation posture, and ZERO GATES markers.

No page implementation.

No route implementation.

No UI implementation.

## 10. Program Header region brief

Program Header summary region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| `program_id` | Program reference | Identifier only. |
| `program_title` | Program title | Display text only. |
| `program_status` | Planning or accepted baseline visibility | Not approval, acceptance, runtime activation, route-state mutation, or gate opening. |
| `program_scope` | Program scope summary | Does not expand authority. |
| `program_batch_refs` | Batch references | Batch refs only. |
| `program_lane_refs` | Lane references | Lane refs only. |
| `program_nhid_refs` | NHID refs if assigned | Hierarchy/location/reference only. |
| `program_batch_id_refs` | Batch ID refs | Batch IDs are not NHIDs. |
| `program_authority_boundary` | locked boundary note | CONTROL_THREAD-owned where decision-bearing. |
| `program_zero_gates_marker` | ZERO GATES GRANTED | Non-authorization marker. |
| `program_receipt_refs` | receipt refs if accepted | Evidence only. |

Program display does not grant execution authority.

Program Header references do not mutate state.

Program status display is not approval, acceptance, runtime activation, route-state mutation, or gate opening.

## 11. Motion queue region brief

Motion queue region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| `motion_id` | Motion reference | Not motion-state mutation. |
| `motion_title` | Human-readable motion title | Display text only. |
| `motion_type` | Motion type label | Candidate semantics only. |
| `motion_status` | Display status | Not approval, acceptance, route selection, or gate opening. |
| `motion_source` | Source ref | Evidence/reference only. |
| `motion_target` | Target ref | Not routing authority. |
| `motion_hygiene_state` | Hygiene state summary | Not approval. |
| decision refs | locked refs | CONTROL_THREAD-only. |
| ZERO GATES marker | ZERO GATES GRANTED | Non-authorization marker. |

Motion display does not mutate motion state.

Motion status visibility is not approval, acceptance, route selection, or gate opening.

## 12. Motion hygiene region brief

Motion hygiene region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| `motion_hygiene_state` | hygiene posture | Not approval. |
| `hygiene_passed` | visible check marker only | Not route selection or acceptance. |
| `hygiene_completeness` | completeness posture | Readiness/quality visibility only. |
| `authority_boundary_clarity` | boundary clarity marker | Does not approve a motion. |
| `evidence_pointer_presence` | evidence present/missing | Evidence presence is not validation. |
| `closeout_pointer_presence` | closeout pointer posture | Closeout pointer is not acceptance. |
| `decision_pointer_presence` | decision pointer posture | Locked/read-only. |
| `stale_assumption_marker` | stale marker | Does not self-resolve. |
| `blocked_marker` | blocked marker | Does not unblock work. |
| `held_marker` | held marker | Does not authorize resumption. |
| `superseded_marker` | superseded marker | Does not route replacement work. |

Motion hygiene display is not approval.

`hygiene_passed` display is not route selection or acceptance.

Motion hygiene references do not approve, route, accept, vote, execute, or mutate.

## 13. Best-motion recommendation region brief

Best-motion recommendation region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| candidate motions | candidate motion refs | Candidate refs only. |
| recommendation rationale | summary text | Recommendation only. |
| dissent or blocker notes | review notes | Does not resolve blockers. |
| missing evidence | evidence gap list | Does not fetch or validate evidence. |
| stale assumptions | stale markers | Does not self-resolve. |
| CONTROL_THREAD review required | locked marker | CONTROL_THREAD-only. |
| ZERO GATES marker | ZERO GATES GRANTED | Non-authorization marker. |

Best-motion recommendation display does not select a route.

Best-motion recommendation display does not dispatch an Agent.

Best-motion recommendation display does not activate a Panel.

Best-motion recommendation display does not implement voting.

Best-motion recommendation display should receive future audit review before implementation if CONTROL_THREAD requires it.

## 14. Work wave region brief

Work wave region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| wave ref | work wave reference | Reference only. |
| wave title | display title | Display text only. |
| Program ref | Program relationship | Program reference only. |
| Batch ID ref | Batch relationship | Batch ID is not NHID. |
| NHID ref | NHID relationship | Hierarchy/location/reference only. |
| related work packets | packet refs | Not execution. |
| related route packets | route packet refs | Not routing. |
| wave status | display status | Not execution. |
| ZERO GATES marker | ZERO GATES GRANTED | Non-authorization marker. |

Work waves organize work; they do not execute.

Work wave display does not execute.

## 15. Work packet region brief

Work packet region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| work packet ref | packet reference | Reference only. |
| scope | scoped work summary | Does not expand authority. |
| target repo or control surface | target display | Not dispatch. |
| role note | role scaffolding | Not Agent activation. |
| files allowed / files blocked | scoped file visibility | Not enforcement. |
| validation expectations | validation expectations | Validation is not approval. |
| closeout expectations | closeout expectations | Closeout is not acceptance. |
| ZERO GATES marker | ZERO GATES GRANTED | Non-authorization marker. |

Work packets define scoped work; they do not execute.

Work packet display does not execute.

## 16. Route packet region brief

Route packet region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| route packet ref | packet reference | Reference only. |
| recommended route | recommendation label | Recommendation only. |
| recommended repo | repo target label | Not routing authority. |
| blocked routes | blocker refs | Does not resolve blockers. |
| dependencies | dependency refs | Does not route work. |
| stale assumptions | stale markers | Does not self-resolve. |
| closeout target | target reference | Not acceptance. |
| authority boundary | locked boundary note | CONTROL_THREAD-owned where decision-bearing. |
| ZERO GATES marker | ZERO GATES GRANTED | Non-authorization marker. |

Route packets recommend; they do not route themselves.

Route packet display does not grant routing authority.

## 17. Closeout region brief

Closeout region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| closeout refs | closeout references | Evidence only. |
| closeout state | none / closeout-received / review-needed | Closeout display does not accept. |
| closeout evidence | evidence summary | Evidence display does not create authority. |
| validation summary | validation result summary | Validation is not approval. |
| risks/follow-ups | risk notes | Review context only. |
| recommended next route | recommendation label | Not routing authority. |
| receipt pointer | locked pointer if accepted | Evidence only. |
| CONTROL_THREAD review posture | locked review state | CONTROL_THREAD-only. |

Closeout display does not accept.

Acceptance still requires explicit CONTROL_THREAD acceptance.

## 18. Decision receipt region brief

Decision receipt region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| decision receipt refs | receipt refs | Evidence/reference only. |
| receipt index pointers | index pointer refs | Not receipt index implementation. |
| acceptance decision refs | locked decision refs | CONTROL_THREAD-only. |
| CONTROL_THREAD decision refs | locked refs | CONTROL_THREAD-owned. |
| accepted-by reference | locked acceptance actor/ref | Does not self-validate acceptance. |
| receipt authority posture | no receipt authority | Receipt display does not create authority. |
| ZERO GATES marker | ZERO GATES GRANTED | Non-authorization marker. |

Receipt display does not create authority.

Receipt display is not receipt authority.

Decision receipts record CONTROL_THREAD decisions; they do not create authority.

## 19. Evidence / provenance region brief

Evidence/provenance region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| evidence refs | evidence references | Evidence display does not create authority. |
| provenance refs | lineage references | Does not mutate canon. |
| source artifact refs | artifact references | Reference only. |
| source repo refs | repo references | Does not assign ownership. |
| source branch refs | branch evidence refs | Not branch automation. |
| source commit refs | commit evidence refs | Not GitHub/API automation. |
| stale assumption notes | review-needed notes | Does not self-resolve. |

Evidence/provenance display does not create authority, acceptance, or canon mutation.

## 20. NHID / Batch ID region brief

NHID means Numerical Hierarchy ID.

NHIDs are hierarchy/location/reference identifiers only.

NHID / Batch ID region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| NHID ref | hierarchy/location/reference | Reference only. |
| NHID parent/path/level | hierarchy display | Not execution. |
| Batch ID ref | batch/lane reference | Batch IDs are not NHIDs. |
| Program ref | Program reference | Reference only. |
| timeline event ref | event reference | Not persistence. |

Batch IDs and NHIDs remain separate namespaces unless later unified.

Batch IDs must not be presented as NHIDs.

NHIDs do not execute work, route work, mutate state, approve work, accept work, activate Agents, open gates, or grant authority.

Do not use any incorrect legacy NHID expansion.

## 21. `.jai` coordination-memory preview brief

`.jai` coordination-memory preview region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| `.jai` record ref | coordination-memory reference | Reference only. |
| coordination-memory role | Program/motion/timeline context | Not runtime behavior. |
| Program ref | Program reference | Reference only. |
| motion ref | motion reference | Not motion-state mutation. |
| timeline event ref | timeline reference | Not persistence. |
| work packet ref | work packet reference | Not execution. |
| route packet ref | route packet reference | Not routing. |
| closeout ref | closeout reference | Not acceptance. |
| receipt ref | receipt reference | Not receipt authority. |
| authority boundary | locked note | CONTROL_THREAD-owned where decision-bearing. |

`.jai` display is not `.jai` parser/runtime behavior.

`.jai` represents coordination memory only.

`.jai` semantics are not executable runtime behavior.

## 22. `.nexus` project-state preview brief

`.nexus` project-state preview region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| `.nexus` project-state ref | project-state reference | Planning/reference visibility only. |
| Program planning ref | Program planning reference | Not active runtime state. |
| motion planning ref | motion planning reference | Not motion-state mutation. |
| timeline planning ref | timeline planning reference | Not persistence. |
| domain-engine planning ref | domain planning reference | Not activation. |
| coverage-state ref | readiness visibility | Coverage display is not approval. |
| ZERO GATES marker | ZERO GATES GRANTED | Non-authorization marker. |

`.nexus` display is not persistence or active runtime state.

`.nexus` display does not imply `.nexus` active runtime semantics.

`.nexus` visibility does not mutate route state, motion state, project state, or canon.

## 23. JAI Agent scaffold display brief

JAI Agent scaffold display region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| role scaffold ref | role reference | Scaffolding only. |
| suggested role label | role label | Does not activate Agents. |
| deliberation prompt ref | prompt reference | Prompt display only. |
| evidence refs | evidence references | Evidence display only. |
| boundary note | no activation / no dispatch | Locked authority context. |
| ZERO GATES marker | ZERO GATES GRANTED | Non-authorization marker. |

JAI Agent display does not activate, dispatch, create, execute, or assign Agents.

JAI Agent scaffold display remains staged scaffolding only.

## 24. JAI Panel scaffold display brief

JAI Panel scaffold display region:

| Field | Static display intent | Boundary |
| --- | --- | --- |
| panel scaffold ref | panel scaffold reference | Scaffold only. |
| proposed panel role mix | proposed role mix | Does not activate a Panel. |
| evidence refs | evidence references | Evidence display only. |
| dissent/reflection prompts | prompt references | Prompt display only. |
| voting posture | no active voting | No Panel voting activation. |
| ZERO GATES marker | ZERO GATES GRANTED | Non-authorization marker. |

JAI Panel display does not activate Panel voting.

JAI Panel scaffold display remains staged scaffolding only.

No voting implementation.

No best-motion automation.

## 25. CONTROL_THREAD decision region brief

CONTROL_THREAD decision region:

| Locked/read-only field | Static display intent | Boundary |
| --- | --- | --- |
| CONTROL_THREAD decision fields | locked decision state | CONTROL_THREAD-only. |
| acceptance decision fields | locked acceptance refs | Does not self-accept. |
| receipt decision fields | locked receipt refs | Not receipt authority. |
| Program authority boundary fields where they record decisions | locked boundary note | Not editable display state. |
| motion authority boundary fields where they record decisions | locked boundary note | Not editable display state. |
| ZERO GATES markers | ZERO GATES GRANTED | Non-authorization marker. |
| route-state and motion-state posture | locked posture | No state mutation. |
| JAI Agent activation posture | locked inactive posture | No Agent activation. |
| JAI Panel activation posture | locked inactive posture | No Panel activation. |
| best-motion recommendation posture where it could be mistaken for authority | locked/review-needed | Recommendation only. |

CONTROL_THREAD-only fields remain locked/read-only.

CONTROL_THREAD decides.

The design brief does not create acceptance, receipt, routing, execution, or gate authority.

## 26. ZERO GATES marker brief

ZERO GATES marker region:

| Placement | Static display intent | Boundary |
| --- | --- | --- |
| page header | ZERO GATES GRANTED | Non-authorization marker. |
| Program Header | ZERO GATES GRANTED | Does not open gates. |
| motion / hygiene regions | ZERO GATES GRANTED | Does not approve motions. |
| work / route regions | ZERO GATES GRANTED | Does not execute or route. |
| closeout / receipt regions | ZERO GATES GRANTED | Does not accept or create receipts. |
| Agent / Panel regions | ZERO GATES GRANTED | Does not activate Agents, a Panel, or voting. |

ZERO GATES display is a non-authorization marker, not readiness approval.

ZERO GATES does not open gates.

ZERO GATES does not approve implementation.

ZERO GATES does not grant production authority.

## 27. Locked / read-only field treatment

Locked/read-only treatment:

- use visible locked/read-only labels for CONTROL_THREAD-only decision fields
- keep acceptance fields locked as evidence refs only
- keep receipt fields locked as evidence refs only
- keep Program and motion authority boundary fields locked where decision-bearing
- keep ZERO GATES markers locked as non-authorization posture
- keep route-state and motion-state posture read-only
- keep Agent and Panel activation posture read-only and inactive
- keep best-motion recommendation posture review-needed where authority confusion is possible

Locked/read-only display does not implement permissions, persistence, validation, or enforcement.

## 28. Empty / pending / held / blocked states

Static display states:

| State | Static display intent | Boundary |
| --- | --- | --- |
| empty | no evidence or row present | Does not create missing work. |
| pending | awaiting evidence or CONTROL_THREAD review | Does not self-accept. |
| held | intentionally paused | Does not authorize resumption. |
| blocked | blocked by evidence, dependency, authority, or risk | Does not resolve blocker. |
| superseded | replaced by another accepted route or artifact | Does not route replacement work. |
| stale | evidence or assumption needs review | Does not refresh evidence. |
| review-needed | CONTROL_THREAD or audit review required | Prompt only. |
| closeout-received | closeout has been returned or observed | Distinct from accepted. |
| accepted | explicit CONTROL_THREAD acceptance exists | Locked CONTROL_THREAD decision only. |

These are display-state concepts only.

State display does not mutate route state, motion state, canon, receipts, acceptance, or gates.

`closeout-received` is distinct from `accepted`.

Accepted requires explicit CONTROL_THREAD acceptance.

## 29. Safe carry-forward panels

Static panels that can safely carry forward into future design discussion:

- Program Header summary region
- canonical timeline event list region
- work wave region
- work packet region
- NHID / Batch ID relationship region
- CONTROL_THREAD locked/read-only marker region
- ZERO GATES marker region
- evidence/provenance region, if reference-only

Conditional carry-forward:

- motion hygiene and `hygiene_passed`, only with strong boundary warnings or future audit review
- best-motion recommendation, only as non-authorizing and with future audit review
- receipts, only with evidence/reference-only and no receipt authority
- JAI Agent / JAI Panel, only as inactive scaffolding and with audit review before implementation
- `.jai`, only with parser/runtime warnings
- `.nexus`, only with non-persistence and non-active-runtime warnings

## 30. Panels requiring future audit before implementation

Panels likely requiring future audit before implementation:

- best-motion recommendation region
- JAI Agent scaffold display region
- JAI Panel scaffold display region
- receipt display posture
- `hygiene_passed` display posture
- motion hygiene display if visually prominent
- `.jai` / `.nexus` display if it risks runtime/persistence ambiguity

Future audit review should assess authority confusion, state-mutation implications, voting implications, receipt authority, and gate posture before implementation.

## 31. Fields not ready for implementation

Fields are not ready for implementation if they require:

- UI implementation
- component/page/route behavior
- API/DB behavior
- persistence
- parser/runtime behavior
- schema/profile enforcement
- validator behavior
- tracker behavior
- receipt or receipt index implementation
- Agent/Panel activation
- voting
- best-motion automation
- state mutation
- canon mutation
- authority
- gate opening

Not-ready examples:

- writable Program status
- writable motion status
- active `hygiene_passed` control
- active best-motion selection
- editable CONTROL_THREAD decision fields
- receipt creation controls
- active Agent or Panel controls
- gate-open indicators

## 32. What this design brief can support

This design brief can support:

- future design discussion
- future static UI design brief refinement
- future audit review routing
- future `jai-format` shared-semantics/profile planning
- future `orchestrator-nexus` compatibility/evidence/timeline alignment
- future implementation-readiness review

It can help CONTROL_THREAD compare region placement, boundary labeling, locked-field treatment, and non-authorizing timeline display concepts.

## 33. What this design brief cannot decide

This design brief cannot decide:

- implementation approval
- UI route approval
- component/page/route behavior
- API/DB approval
- persistence approval
- runtime approval
- parser/schema/validator approval
- tracker approval
- receipt/index approval
- state mutation
- canon mutation
- Agent/Panel activation
- voting
- best-motion automation
- routing authority
- execution authority
- acceptance authority
- receipt authority
- readiness approval
- production authority
- gate opening

## 34. Non-authorized behaviors

This design brief does not authorize:

- UI implementation
- surface implementation
- component implementation
- page implementation
- route implementation
- runtime activation
- parser implementation
- schema enforcement
- validator enforcement
- ID generator implementation
- tracker implementation
- receipt implementation
- receipt index implementation
- API behavior
- DB behavior
- Prisma behavior
- persistence implementation
- storage behavior
- `.jai` parser/runtime behavior
- `.nexus` active runtime semantics
- motion-state mutation
- route-state mutation
- canon mutation
- JAI Agent activation
- JAI Agent dispatch
- JAI Agent execution
- JAI Agent creation
- JAI Agent assignment
- automatic Agent assignment
- JAI Panel activation
- voting implementation
- best-motion automation
- provider/model dispatch
- live model calls
- GitHub/API automation
- browser/desktop control
- terminal execution by the app
- customer-data handling
- telemetry
- policy enforcement
- routing authority
- merge authority
- execution authority
- acceptance authority
- receipt authority
- Corpus v2 activation
- organizational memory activation
- readiness approval
- production authority
- gate opening

ZERO GATES GRANTED.

## 35. Risks

- Risk: Static UI design brief could be mistaken for implementation approval. Mitigation: preserve static-only and design-brief-does-not-approve-implementation wording.
- Risk: Program or motion statuses could be mistaken for writable state. Mitigation: keep status display read-only and non-mutating.
- Risk: `hygiene_passed` could be mistaken for route selection or acceptance. Mitigation: preserve explicit boundary language and audit-review posture.
- Risk: Best-motion recommendation could be mistaken for route selection. Mitigation: require audit review before implementation.
- Risk: Receipt display could be mistaken for receipt authority. Mitigation: keep receipt display evidence/reference-only.
- Risk: JAI Agent / JAI Panel scaffolds could imply activation or voting. Mitigation: preserve staged scaffolding-only labels.
- Risk: `.jai` and `.nexus` previews could imply runtime or persistence. Mitigation: preserve non-runtime, non-persistent, and non-active-runtime labels.
- Risk: ZERO GATES could be mistaken for readiness approval. Mitigation: label it as a non-authorization marker.

## 36. Recommended follow-up routes

Recommended next route:

- `Q3M7 Canonical Timeline Display Static UI Design Brief Review v0`

Recommended parallel or prerequisite reviews before implementation:

- `Q3M7 Best-Motion Display Authority Boundary Review v0`
- `Q3M7 JAI Agent / Panel Scaffold Display Authority Review v0`
- `Q3M7 Motion Hygiene Visual Semantics Review v0`
- `Q3M7 Receipt Display Evidence Boundary Review v0`
- `Q3M7 .jai / .nexus Reference Preview Boundary Review v0`

Any implementation route requires separate CONTROL_THREAD acceptance.

## 37. Verification notes

Verification notes:

- All 38 required sections are present.
- Required design brief components are included.
- This is a static docs/reference design brief only.
- No component, route, page, React implementation, UI implementation, CSS, API, DB, persistence, or runtime behavior may be added.
- Design brief does not approve implementation.
- Program display does not grant execution authority.
- Motion display does not mutate motion state.
- Motion hygiene display does not approve a motion.
- `hygiene_passed` display does not select a route or accept a motion.
- Best-motion recommendation display does not select a route.
- Work wave and work packet display do not execute.
- Route packet display does not grant routing authority.
- Closeout display does not accept.
- Receipt display does not create authority.
- CONTROL_THREAD-only fields remain locked/read-only.
- JAI Agent display does not activate, dispatch, create, execute, or assign Agents.
- JAI Panel display does not activate Panel voting.
- `.jai` display is not `.jai` parser/runtime behavior.
- `.nexus` display is not persistence or active runtime state.
- ZERO GATES display is a non-authorization marker, not readiness approval.
- NHID means Numerical Hierarchy ID.
- The incorrect legacy NHID expansion is not used.

## 38. ZERO GATES GRANTED

ZERO GATES GRANTED.

CONTROL_THREAD decides.

This artifact is a static docs/reference design brief only.
