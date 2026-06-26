# Canonical Timeline Display Field Ownership Review v0

## 1. Purpose

This docs/reference artifact reviews ownership of canonical timeline display fields before any surface sketch, UI implementation, API/DB, persistence, tracker, receipt, receipt index, schema, parser/runtime, Agent/Panel, voting, or best-motion route proceeds.

This is docs/reference planning and review only.

No UI implementation.

No surface implementation.

No runtime activation.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Strategic context

The Q3M7Y26 Canonical Project Timeline and Motion Governance Kernel needs a clear field ownership posture before timeline display fields move toward surface sketching or shared-semantics routes.

The display field model spans Program Header fields, motion records, motion hygiene, canonical timeline events, work waves, work packets, route packets, closeouts, decision receipts, evidence/provenance, NHID references, Batch ID references, `.jai` coordination-memory references, `.nexus` project-state references, JAI Agent scaffolds, JAI Panel scaffolds, best-motion recommendations, CONTROL_THREAD decisions, and ZERO GATES markers.

This review separates display affordances, candidate shared semantics, future orchestrator compatibility/evidence candidates, audit review candidates, CONTROL_THREAD-only locked fields, and fields that are not ready for implementation.

## 3. Accepted baseline

Accepted baseline:

- Batch A Portfolio Batch Tracker Foundation accepted through A9.
- Batch B Organizational Memory Foundation accepted through B12.
- C1 / Program Definition / Motion Timeline Kernel Planning v0 accepted as static Program definition canon.
- C2 / `.jai` Program and Motion Timeline Shared Semantics Planning v0 accepted as static shared-semantics planning canon.
- C3 / Program / Motion / JAI Panel Authority Boundary Review v0 accepted as advisory authority-boundary review canon.
- C4 / Program Header Envelope Candidate Table v0 accepted as static candidate-table planning canon.
- C5 / Motion Hygiene Field Vocabulary Planning v0 accepted as static field-vocabulary planning canon.
- C6 / Canonical Timeline Display Planning v0 accepted as docs/reference display planning canon.
- C7 / Program Header Envelope / Motion Hygiene Authority Boundary Review v0, if available.
- C8 / Program Header Envelope Field Ownership Planning v0, if available.
- Canonical timeline display planning is not UI implementation.
- Program display does not imply execution authority.
- Motion display does not imply motion-state mutation.
- Motion hygiene display does not imply approval.
- Best-motion recommendation display does not imply route selection.
- `.jai` display does not imply `.jai` runtime behavior.
- `.nexus` display does not imply persistence or active runtime state.
- Work wave / work packet display does not imply execution.
- Route packet display does not imply routing authority.
- Closeout display does not imply acceptance.
- Receipt display does not imply receipt authority.
- JAI Agent / JAI Panel display does not imply activation or voting.
- CONTROL_THREAD-only fields must remain locked/read-only.
- ZERO GATES display is a non-authorization marker, not readiness approval.
- Role: JAI::DEV::BUILDER.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

This baseline is field ownership review context only. It does not authorize UI implementation, schema enforcement, parser/runtime behavior, persistence, timeline state mutation, motion-state mutation, route-state mutation, canon mutation, receipt authority, acceptance authority, voting, Agent activation, Panel activation, or gate behavior.

## 4. Evidence inputs

Accepted evidence inputs cited for lineage:

- Batch A Portfolio Batch Tracker Foundation accepted through A9.
- Batch B Organizational Memory Foundation accepted through B12.
- C1 / Program Definition / Motion Timeline Kernel Planning v0.
- C2 / `.jai` Program and Motion Timeline Shared Semantics Planning v0.
- C3 / Program / Motion / JAI Panel Authority Boundary Review v0.
- C4 / Program Header Envelope Candidate Table v0.
- C5 / Motion Hygiene Field Vocabulary Planning v0.
- C6 / `dev-jai-nexus` Canonical Timeline Display Planning v0.
- C7 / Program Header Envelope / Motion Hygiene Authority Boundary Review v0, if available.
- C8 / Program Header Envelope Field Ownership Planning v0, if available.
- `dev-jai-nexus / Q3M7 Corpus v2 Organizational Memory Visibility Planning v0`.
- `dev-jai-nexus / Q3M7 Operator Batch Tracker Static Surface Sketch v0`.
- `dev-jai-nexus / Q3M7 Control Thread Slot Architecture Planning v0`.
- `dev-jai-nexus / Q3M7 Project Coverage State Operator Planning v0`.
- `dev-jai-nexus / Q3M7 Project Coverage State Field Model Review v0`.

These inputs are evidence and lineage references only. They do not create implementation authority.

## 5. Field ownership review scope

This review classifies canonical timeline display fields across:

- local UI affordance candidates
- future `jai-format` shared-semantics/profile candidates
- future `orchestrator-nexus` compatibility candidates
- future `orchestrator-nexus` evidence/timeline candidates
- CONTROL_THREAD-only locked fields
- future `audit-nexus` review candidates
- fields not ready for implementation

Field ownership review is not UI implementation.

Local display affordance does not implement a surface.

CONTROL_THREAD-only fields must remain locked/read-only.

Shared semantics candidate does not mean schema enforcement.

Orchestrator compatibility candidate does not mean tracker, receipt, or timeline implementation.

Evidence/timeline candidate does not mean persistence.

Motion hygiene display does not approve a motion.

Best-motion display does not select a route.

Receipt display does not create receipt authority.

JAI Agent / JAI Panel scaffold display does not activate Agents, a Panel, or voting.

ZERO GATES display remains a non-authorization marker.

## 6. Display field ownership categories

Ownership categories are review labels only, not implementation authority.

| Category | Meaning | Boundary |
| --- | --- | --- |
| `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Future display/sorting/filtering/grouping candidate only. | Does not implement a surface. |
| `CONTROL_THREAD_LOCKED_READ_ONLY` | Visible only as locked/read-only because CONTROL_THREAD owns the decision or authority meaning. | Not editable by ordinary display. |
| `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Possible future shared semantics/profile field candidate. | Not schema enforcement. |
| `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Possible future compatibility mapping field. | Not tracker, receipt, or timeline implementation. |
| `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Possible future evidence/timeline support candidate. | Not persistence. |
| `AUDIT_REVIEW_CANDIDATE` | Field or display posture needing future authority-boundary review. | Not approval. |
| `NOT_READY_FOR_UI_IMPLEMENTATION` | Not safe for UI implementation. | Requires separate route. |
| `NOT_READY_FOR_SCHEMA` | Not safe for schema/profile enforcement. | Candidate only. |
| `NOT_READY_FOR_PERSISTENCE` | Not safe for storage or API/DB-backed state. | No persistence. |
| `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | Marker showing non-authorization only. | Not readiness approval. |

## 7. Program Header display fields

Program Header field ownership:

| Field | Primary category | Secondary review | Boundary note |
| --- | --- | --- | --- |
| `program_id` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Identifier only; not execution authority. |
| `program_title` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Display text only. |
| `program_status` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | `AUDIT_REVIEW_CANDIDATE` | Status visibility is not approval, acceptance, runtime activation, or gate opening. |
| `program_scope` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Scope display does not expand authority. |
| `program_batch_refs` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Batch refs only. |
| `program_lane_refs` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Lane refs only. |
| `program_nhid_refs` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | NHID references are hierarchy/location/reference only. |
| `program_batch_id_refs` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Batch IDs are not NHIDs. |
| `program_authority_boundary` | `CONTROL_THREAD_LOCKED_READ_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Does not grant authority. |
| `program_zero_gates_marker` | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Non-authorization marker only. |
| `program_receipt_refs` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Receipt refs are evidence only. |

Program display does not imply execution authority.

Program definition does not grant execution authority.

Program status visibility is not gate opening, approval, acceptance, runtime activation, or route-state mutation.

## 8. Motion record display fields

Motion record field ownership:

| Field | Primary category | Secondary review | Boundary note |
| --- | --- | --- | --- |
| `motion_id` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Identifier only; not mutation authority. |
| `motion_title` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Display text only. |
| `motion_type` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | `AUDIT_REVIEW_CANDIDATE` | Type label does not grant behavior. |
| `motion_status` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | `AUDIT_REVIEW_CANDIDATE` | Status visibility is not approval or acceptance. |
| `motion_source` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Source reference only. |
| `motion_target` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `AUDIT_REVIEW_CANDIDATE` | Target display is not routing authority. |
| `motion_hygiene_state` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | `AUDIT_REVIEW_CANDIDATE` | Hygiene display does not approve. |
| `motion_authority_boundary` | `CONTROL_THREAD_LOCKED_READ_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Authority boundary is locked review context. |
| `motion_evidence_refs` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `NOT_READY_FOR_PERSISTENCE` | Evidence display is not persistence. |
| `motion_receipt_refs` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Receipt display is not receipt authority. |
| `motion_decision_refs` | `CONTROL_THREAD_LOCKED_READ_ONLY` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Decision refs are locked evidence. |
| `motion_zero_gates_marker` | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Not readiness approval. |

Motion objects do not mutate state by themselves.

Motion display does not imply motion-state mutation.

Motion status visibility is not approval or acceptance.

## 9. Motion hygiene display fields

Motion hygiene field ownership:

| Field | Primary category | Secondary review | Boundary note |
| --- | --- | --- | --- |
| hygiene completeness | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Readiness/quality visibility only. |
| authority-boundary clarity | `AUDIT_REVIEW_CANDIDATE` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Does not approve a motion. |
| source and target clarity | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Display clarity only. |
| evidence pointer presence | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `NOT_READY_FOR_PERSISTENCE` | Evidence/timeline candidate does not mean persistence. |
| closeout pointer presence | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Closeout pointer is not acceptance. |
| decision pointer presence | `CONTROL_THREAD_LOCKED_READ_ONLY` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Decision pointer is locked. |
| stale assumption marker | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Does not self-resolve. |
| blocked marker | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Does not unblock work. |
| held marker | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Does not authorize resumption. |
| superseded marker | `CONTROL_THREAD_LOCKED_READ_ONLY` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Does not route replacement work. |

Motion hygiene is not approval.

Motion hygiene display does not approve a motion.

Hygiene display is readiness/quality visibility only, not acceptance, execution, route selection, or gate opening.

## 10. Canonical timeline event display fields

Canonical timeline event field ownership:

| Field | Primary category | Secondary review | Boundary note |
| --- | --- | --- | --- |
| `timeline_event_ref` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Event reference only. |
| `timeline_event_type` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Candidate type label only. |
| `timeline_position` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `NOT_READY_FOR_PERSISTENCE` | Ordering display does not mutate canon or state. |
| `program_ref` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Program reference only. |
| `batch_ref` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Batch reference only. |
| `lane_ref` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Lane reference only. |
| `nhid_ref` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Hierarchy/location/reference only. |
| `batch_id_ref` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Batch IDs remain separate from NHIDs. |
| `source_artifact_ref` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `NOT_READY_FOR_PERSISTENCE` | Artifact reference does not mutate artifact. |
| `event_evidence_ref` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `NOT_READY_FOR_PERSISTENCE` | Evidence display is not persistence. |
| `event_decision_ref` | `CONTROL_THREAD_LOCKED_READ_ONLY` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Decision refs remain locked. |
| `event_authority_boundary` | `CONTROL_THREAD_LOCKED_READ_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Boundary note does not grant authority. |
| `event_zero_gates_marker` | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Non-authorization marker only. |

Timeline display does not create persistence or active runtime state.

Timeline ordering display does not mutate canon or state.

## 11. Work wave display fields

Work wave field ownership:

| Field | Primary category | Boundary note |
| --- | --- | --- |
| wave reference | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Reference only. |
| wave title | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Display text only. |
| related Program | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Program relation only. |
| related Batch ID | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Batch ID is not NHID. |
| related NHID reference | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Hierarchy/location/reference only. |
| related work packets | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Evidence/timeline candidate only. |
| related route packets | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Not routing authority. |
| wave status | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Not execution. |
| ZERO GATES marker | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | Not readiness approval. |

Work waves organize work; they do not execute.

Work wave display does not imply execution.

## 12. Work packet display fields

Work packet field ownership:

| Field | Primary category | Boundary note |
| --- | --- | --- |
| work packet ref | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Packet reference only. |
| scope | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Does not expand authority. |
| target repo or control surface | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Display target only. |
| role note | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Role scaffolding only. |
| files allowed / files blocked | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Candidate semantics only, not enforcement. |
| validation expectations | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Validation is not approval. |
| closeout expectations | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Closeout is not acceptance. |
| ZERO GATES marker | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | Non-authorization marker only. |

Work packets define scoped work; they do not execute.

Work packet display does not imply execution.

## 13. Route packet display fields

Route packet field ownership:

| Field | Primary category | Boundary note |
| --- | --- | --- |
| route packet ref | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Packet reference only. |
| recommended route | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Recommendation only. |
| recommended repo | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Not routing authority. |
| blocked routes | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Blocker display does not resolve blockers. |
| dependencies | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Dependency display does not route work. |
| stale assumptions | `AUDIT_REVIEW_CANDIDATE` | Does not self-resolve. |
| closeout target | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Target reference only. |
| authority boundary | `CONTROL_THREAD_LOCKED_READ_ONLY` | Locked boundary note. |
| ZERO GATES marker | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | Non-authorization marker only. |

Route packets recommend; they do not route themselves.

Route packet display does not imply routing authority.

## 14. Closeout display fields

Closeout field ownership:

| Field | Primary category | Boundary note |
| --- | --- | --- |
| closeout refs | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Evidence reference only. |
| closeout status | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Not acceptance. |
| closeout evidence | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Evidence display does not create authority. |
| validation summary | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Validation is not approval. |
| risks/follow-ups | `AUDIT_REVIEW_CANDIDATE` | Review context only. |
| recommended next route | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Recommendation only. |
| receipt pointer | `CONTROL_THREAD_LOCKED_READ_ONLY` | Evidence pointer only. |
| CONTROL_THREAD review posture | `CONTROL_THREAD_LOCKED_READ_ONLY` | Locked decision posture. |

Closeouts report completion; they do not accept.

Closeout display does not imply acceptance.

Acceptance still requires explicit CONTROL_THREAD acceptance.

## 15. Decision receipt display fields

Decision receipt field ownership:

| Field | Primary category | Secondary review | Boundary note |
| --- | --- | --- | --- |
| decision receipt refs | `CONTROL_THREAD_LOCKED_READ_ONLY` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Evidence/reference only. |
| receipt index pointers | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `NOT_READY_FOR_PERSISTENCE` | Not receipt index implementation. |
| acceptance decision refs | `CONTROL_THREAD_LOCKED_READ_ONLY` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Locked acceptance evidence. |
| CONTROL_THREAD decision refs | `CONTROL_THREAD_LOCKED_READ_ONLY` | `AUDIT_REVIEW_CANDIDATE` | CONTROL_THREAD-owned. |
| accepted-by reference | `CONTROL_THREAD_LOCKED_READ_ONLY` | `NOT_READY_FOR_SCHEMA` | Does not self-validate acceptance. |
| receipt authority posture | `AUDIT_REVIEW_CANDIDATE` | `NOT_READY_FOR_UI_IMPLEMENTATION` | Receipt display does not create receipt authority. |
| ZERO GATES marker | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Non-authorization marker only. |

Receipts record CONTROL_THREAD decisions; they do not create authority.

Receipt display does not create receipt authority.

Decision receipt display is evidence/reference display only.

## 16. Evidence and provenance display fields

Evidence and provenance field ownership:

| Field | Primary category | Boundary note |
| --- | --- | --- |
| `evidence_ref` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Evidence display does not create authority. |
| `source_artifact_ref` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Artifact reference only. |
| `source_repo_ref` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Repo reference does not assign ownership. |
| `source_branch_ref` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Branch evidence only. |
| `source_commit_ref` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Commit evidence only. |
| `source_closeout_ref` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Closeout ref is not acceptance. |
| `source_receipt_ref` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Receipt ref is evidence only. |
| `provenance_note` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Note display only. |
| `stale_assumption_note` | `AUDIT_REVIEW_CANDIDATE` | Does not self-resolve. |

Evidence display does not create authority.

Provenance display does not create acceptance, receipt, or canon mutation.

## 17. NHID / Batch ID display fields

NHID means Numerical Hierarchy ID.

NHIDs are hierarchy/location/reference identifiers only.

NHID and Batch ID field ownership:

| Field | Primary category | Boundary note |
| --- | --- | --- |
| `nhid_ref` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Hierarchy/location/reference only. |
| `nhid_parent` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Relationship reference only. |
| `nhid_path` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Display path only. |
| `nhid_level` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Hierarchy display only. |
| `timeline_event_ref` | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Event reference only. |
| `batch_id_ref` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Batch IDs are not NHIDs. |
| `batch_sequence` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Display sequence only. |
| `batch_lane_ref` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Lane reference only. |
| `program_ref` | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Program reference only. |

Batch IDs and NHIDs remain separate namespaces unless later unified.

Batch IDs must not be presented as NHIDs.

NHIDs do not execute work, route work, mutate state, approve work, accept work, activate Agents, open gates, or grant authority.

Do not use any incorrect legacy NHID expansion.

## 18. `.jai` coordination-memory display fields

`.jai` coordination-memory field ownership:

| Field | Primary category | Boundary note |
| --- | --- | --- |
| `.jai` record ref | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Coordination-memory reference only. |
| coordination-memory role | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Not runtime behavior. |
| Program ref | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Reference only. |
| motion ref | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Reference only. |
| timeline event ref | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Not persistence. |
| work packet ref | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Not execution. |
| route packet ref | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Not routing. |
| closeout ref | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Not acceptance. |
| receipt ref | `CONTROL_THREAD_LOCKED_READ_ONLY` | Not receipt authority. |
| authority boundary | `CONTROL_THREAD_LOCKED_READ_ONLY` | Locked boundary context. |

`.jai` represents coordination memory only.

`.jai` display does not imply `.jai` parser/runtime behavior.

`.jai` semantics are not executable runtime behavior.

## 19. `.nexus` project-state display fields

`.nexus` project-state field ownership:

| Field | Primary category | Boundary note |
| --- | --- | --- |
| `.nexus` project-state ref | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Planning/reference visibility only. |
| Program planning ref | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Not active runtime state. |
| motion planning ref | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | Not motion-state mutation. |
| timeline planning ref | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | Not persistence. |
| domain-engine planning ref | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Not activation. |
| coverage-state ref | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Coverage display is not approval. |
| ZERO GATES marker | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | Not readiness approval. |

`.nexus` timeline planning is not persistence or active runtime state.

`.nexus` display does not imply `.nexus` active runtime semantics.

`.nexus` visibility does not mutate route state, motion state, project state, or canon.

## 20. JAI Agent scaffold display fields

JAI Agent scaffold field ownership:

| Field | Primary category | Secondary review | Boundary note |
| --- | --- | --- | --- |
| role scaffold ref | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Role scaffolding only. |
| suggested role label | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` | Does not activate Agents. |
| deliberation prompt ref | `ORCHESTRATOR_COMPATIBILITY_CANDIDATE` | `AUDIT_REVIEW_CANDIDATE` | Prompt reference only. |
| evidence refs | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `NOT_READY_FOR_PERSISTENCE` | Evidence display only. |
| boundary note | `CONTROL_THREAD_LOCKED_READ_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Locked authority context. |
| ZERO GATES marker | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Non-authorization marker only. |

JAI Agent scaffold display does not imply Agent activation.

JAI Agent / JAI Panel language remains staged scaffolding only unless separately activated.

No Agent activation, dispatch, creation, assignment, execution, provider/model dispatch, or tool invocation is authorized.

## 21. JAI Panel scaffold display fields

JAI Panel scaffold field ownership:

| Field | Primary category | Secondary review | Boundary note |
| --- | --- | --- | --- |
| panel scaffold ref | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Scaffold reference only. |
| proposed panel role mix | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Does not activate a Panel. |
| evidence refs | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `NOT_READY_FOR_PERSISTENCE` | Evidence display only. |
| dissent/reflection prompts | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Prompt display only. |
| voting posture | `AUDIT_REVIEW_CANDIDATE` | `NOT_READY_FOR_UI_IMPLEMENTATION` | No active panel voting. |
| ZERO GATES marker | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Non-authorization marker only. |

JAI Panel scaffold display does not imply active panel voting.

No JAI Panel activation.

No voting implementation.

No best-motion automation.

## 22. Best-motion recommendation display fields

Best-motion recommendation field ownership:

| Field | Primary category | Secondary review | Boundary note |
| --- | --- | --- | --- |
| candidate motion refs | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `AUDIT_REVIEW_CANDIDATE` | Candidate refs only. |
| recommendation rationale | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Recommendation only. |
| dissent or blocker notes | `AUDIT_REVIEW_CANDIDATE` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Review context only. |
| missing evidence | `ORCHESTRATOR_EVIDENCE_TIMELINE_CANDIDATE` | `AUDIT_REVIEW_CANDIDATE` | Does not fetch or validate evidence. |
| stale assumptions | `AUDIT_REVIEW_CANDIDATE` | `LOCAL_DISPLAY_AFFORDANCE_ONLY` | Does not self-resolve. |
| CONTROL_THREAD review required | `CONTROL_THREAD_LOCKED_READ_ONLY` | `AUDIT_REVIEW_CANDIDATE` | Locked review posture. |
| ZERO GATES marker | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | `CONTROL_THREAD_LOCKED_READ_ONLY` | Not readiness approval. |

Best-motion recommendation is not route selection.

Best-motion display does not select a route.

Recommendation display does not select routes, execute routes, mutate state, dispatch Agents, activate Panels, or open gates.

## 23. CONTROL_THREAD-only locked fields

CONTROL_THREAD-only fields must remain locked/read-only.

Locked field examples:

| Field | Category | Boundary note |
| --- | --- | --- |
| CONTROL_THREAD decision fields | `CONTROL_THREAD_LOCKED_READ_ONLY` | CONTROL_THREAD owns final decision meaning. |
| acceptance decision fields | `CONTROL_THREAD_LOCKED_READ_ONLY` | Acceptance still requires explicit CONTROL_THREAD acceptance. |
| receipt decision fields | `CONTROL_THREAD_LOCKED_READ_ONLY` | Receipt display is not receipt authority. |
| Program authority boundary fields where they record decisions | `CONTROL_THREAD_LOCKED_READ_ONLY` | Boundary records are not editable by ordinary display. |
| motion authority boundary fields where they record decisions | `CONTROL_THREAD_LOCKED_READ_ONLY` | Boundary records are locked. |
| ZERO GATES markers | `ZERO_GATES_NON_AUTHORIZATION_DISPLAY` | Non-authorization marker only. |
| route-state and motion-state posture | `CONTROL_THREAD_LOCKED_READ_ONLY` | Does not mutate route state or motion state. |
| JAI Agent activation posture | `CONTROL_THREAD_LOCKED_READ_ONLY` | No Agent activation. |
| JAI Panel activation posture | `CONTROL_THREAD_LOCKED_READ_ONLY` | No Panel activation. |
| best-motion recommendation posture where it could be mistaken for authority | `AUDIT_REVIEW_CANDIDATE` | Needs future authority review. |

## 24. Local UI affordance candidates

Local UI affordance candidates:

- grouping by Program
- grouping by Batch ID
- grouping by NHID reference
- filtering by motion hygiene state
- filtering by work wave / work packet / route packet
- filtering by closeout state
- filtering by receipt pointer presence
- filtering by ZERO GATES marker
- visual lock marker for CONTROL_THREAD-only fields
- visual marker for `.jai` memory references
- visual marker for `.nexus` planning references

Local UI affordance candidates are display/sorting/filtering candidates only.

They are not UI implementation authority.

Local display affordance does not implement a surface.

## 25. Future `jai-format` shared semantics candidates

Future `jai-format` shared semantics candidates may include:

- Program ID and Program status vocabulary
- motion ID, motion type, and motion status vocabulary
- motion hygiene field names
- work wave, work packet, and route packet reference vocabulary
- NHID reference fields
- Batch ID reference posture
- coverage-state relationships
- ZERO GATES marker vocabulary

Shared semantics candidate does not mean schema enforcement.

Shared semantics candidate does not authorize parser/runtime behavior.

Shared semantics candidate does not create canon mutation authority.

## 26. Future `orchestrator-nexus` compatibility/evidence candidates

Future `orchestrator-nexus` compatibility/evidence candidates may include:

- Program to batch/lane mapping
- motion to timeline event mapping
- timeline event evidence refs
- route packet, work packet, and closeout refs
- receipt pointer refs
- receipt index pointer posture
- source repo, branch, commit, and artifact refs
- NHID and Batch ID cross-reference mapping
- stale assumption and blocker evidence refs

Orchestrator compatibility candidate does not mean tracker, receipt, or timeline implementation.

Evidence/timeline candidate does not mean persistence.

Compatibility/evidence candidates do not create routing, receipt, acceptance, execution, or gate authority.

## 27. Future `audit-nexus` review candidates

Future `audit-nexus` review candidates:

- best-motion recommendation display
- JAI Panel scaffold display
- receipt display posture
- CONTROL_THREAD locked-field handling
- ZERO GATES marker posture
- motion authority boundary display
- Program status display where it could imply acceptance
- any field that could imply authority, voting, acceptance, receipt creation, execution, or gate opening

Audit review candidates are review prompts only. They do not approve implementation, activate Panels, select routes, or open gates.

## 28. Fields not ready for implementation

Fields are not ready for implementation if they require:

- UI implementation
- surface behavior
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
- JAI Agent activation/dispatch/creation/assignment
- JAI Panel activation
- voting implementation
- best-motion automation
- provider/model dispatch
- GitHub/API automation
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

Not-ready categories include `NOT_READY_FOR_UI_IMPLEMENTATION`, `NOT_READY_FOR_SCHEMA`, and `NOT_READY_FOR_PERSISTENCE`.

## 29. Ownership conflicts and ambiguity

Ambiguous ownership boundaries:

- Program Header fields may belong to `jai-format` shared semantics but need `dev-jai-nexus` display affordance planning.
- Motion hygiene fields may require `jai-format` vocabulary, `orchestrator-nexus` evidence mapping, and `audit-nexus` boundary review.
- Receipt pointer fields may require `orchestrator-nexus` alignment but must remain CONTROL_THREAD evidence references.
- Best-motion display fields may require audit review before any display sketch.
- JAI Panel scaffold fields may require audit review before any surface sketch.
- NHID / Batch ID fields may require ownership separation before schema/profile planning.

No ambiguous field is implementation-ready by default.

CONTROL_THREAD decides whether ambiguity becomes a route, a profile candidate, an audit review, or a blocked item.

## 30. Non-authorized behaviors

This field ownership review does not authorize:

- UI implementation
- surface implementation
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

## 31. Risks

- Risk: Shared semantics candidates may be mistaken for schema enforcement. Mitigation: keep `JAI_FORMAT_SHARED_SEMANTICS_CANDIDATE` explicitly non-enforcing.
- Risk: Orchestrator compatibility candidates may be mistaken for tracker, receipt, or timeline implementation. Mitigation: keep compatibility/evidence fields planning-only.
- Risk: Evidence/timeline candidates may be mistaken for persistence. Mitigation: preserve that evidence/timeline candidate does not mean persistence.
- Risk: CONTROL_THREAD fields may be treated as editable display state. Mitigation: mark them `CONTROL_THREAD_LOCKED_READ_ONLY`.
- Risk: Motion hygiene may be mistaken for approval. Mitigation: preserve that motion hygiene display does not approve a motion.
- Risk: Best-motion recommendation may be mistaken for route selection. Mitigation: route any best-motion display posture through future audit review.
- Risk: JAI Agent / JAI Panel scaffold display may imply activation or voting. Mitigation: preserve staged scaffolding language and no activation.
- Risk: ZERO GATES marker may be mistaken for readiness approval. Mitigation: preserve `ZERO_GATES_NON_AUTHORIZATION_DISPLAY`.

## 32. Recommended follow-up routes

Recommended next route:

- `Q3M7 Canonical Timeline Display Static Surface Sketch v0`

Possible prerequisite or parallel routes:

- `Q3M7 Canonical Timeline Display Audit Boundary Review v0`
- `Q3M7 Motion Hygiene Display Vocabulary Alignment v0`
- `Q3M7 Program Header Envelope Display Surface Sketch v0`
- `Q3M7 Canonical Timeline Evidence Mapping Planning v0`
- `Q3M7 NHID / Batch ID Timeline Reference Review v0`

Any future implementation route requires separate CONTROL_THREAD acceptance.

## 33. Verification notes

Verification notes:

- All 34 required sections are present.
- Required ownership categories are defined and used.
- Accepted baseline is preserved.
- Field ownership review is not UI implementation.
- Local display affordance does not implement a surface.
- CONTROL_THREAD-only fields must remain locked/read-only.
- Shared semantics candidate does not mean schema enforcement.
- Orchestrator compatibility candidate does not mean tracker, receipt, or timeline implementation.
- Evidence/timeline candidate does not mean persistence.
- Motion hygiene display does not approve a motion.
- Best-motion display does not select a route.
- Receipt display does not create receipt authority.
- JAI Agent / JAI Panel scaffold display does not activate Agents, a Panel, or voting.
- `.jai` display does not imply `.jai` runtime behavior.
- `.nexus` display does not imply `.nexus` active runtime semantics.
- ZERO GATES display remains a non-authorization marker.
- NHID means Numerical Hierarchy ID.
- The incorrect legacy NHID expansion is not used.

## 34. ZERO GATES GRANTED

ZERO GATES GRANTED.

CONTROL_THREAD decides.

This artifact is docs/reference field ownership review only.
