# Q3M7Y26-P1 A4 Ratified Motion and Decision Registry v0

Role: JAI::DEV::BUILDER

## 1. Purpose and indexing-only effect

This artifact is a deterministic documentary index of Motion 0248, the
Program 1 opening, accepted Batch A evidence through A3, the bounded Batch D
proving-seam exception, and D1-D8 delivery and decision evidence through the
accepted D8 head and its squash onto `main`.

It indexes existing evidence. It does not issue a receipt, manufacture a
decision, convert a merge into acceptance, repair historical evidence, define
new lifecycle canon, expand authority, or prove runtime or external effects.
HUMAN_OPERATOR and CONTROL_THREAD authority remain outside this registry.

## 2. Control Coordinates and evidence cutoff

| Field | Value |
| --- | --- |
| Program | `Q3M7Y26-P1` |
| Batch | `A - Accepted Main-State Reconciliation` |
| Wave | `A-A` |
| Lane | `A4 - Ratified Motion and Decision Registry v0` |
| Parent route | `CT-2026-07-22-Q3M7Y26-P1-START-A4-MOTION-DECISION-REGISTRY-v0` |
| Repair route | `CT-2026-07-22-Q3M7Y26-P1-A4R1-STATUS-PROVENANCE-CHRONOLOGY-v0` |
| Work Packet | `Q3M7Y26-P1-A4-v0` |
| Repository | `jai-nexus/dev-jai-nexus` |
| Required and observed base | `a1194b820a126b23bc1ac992f8d4271acfbfde08` |
| Branch | `docs/q3m7y26-p1-a4-ratified-motion-decision-registry-v0` |
| Allowlisted path | `docs/reference/q3m7y26-p1-a4-ratified-motion-decision-registry-v0.md` |
| Linear mirror | `JAI-187` / `MIRROR_ONLY` |
| Evidence cutoff | `2026-07-22T04:50:46Z` |
| GitHub query scope | Exact PRs `#376` through `#389` returned merged; existing PR `#390` returned open, draft, and unmerged |
| Open-PR scope check | Existing PR `#390` is the sole A4 delivery; no replacement PR was created |
| Evidence ceiling | `DOCUMENTATION_REGISTRY_ONLY` |
| A4 acceptance | `HELD_PENDING_A4R1_FINAL_VERIFICATION` |

## 3. Accepted source basis

The source basis is the refreshed `origin/main` at the required base, the
following immutable repository records, exact GitHub PR metadata, and fresh
workflow authority supplied by the current A4 route:

| Source | Pinned basis | Treatment |
| --- | --- | --- |
| Motion 0248 | [decision][MOTION-DECISION], [execution][MOTION-EXECUTION], and [snapshot][MOTION-SNAPSHOT] | Merged Motion/Program evidence; phase and later-event boundaries preserved. |
| Program opening | [opening packet][OPENING-PACKET] and [opening receipt][OPENING-RECEIPT] | Packet readiness is distinct from the human authorization and CONTROL_THREAD opening decision. |
| Accepted A1 | [A1 artifact][A1-ARTIFACT] | Accepted planning basis as recognized by A2; exact acceptance token is unavailable. |
| Accepted A2 | [A2 artifact][A2-ARTIFACT] | Controlling precedence, classification, conflict, freshness, and relation vocabulary. |
| D1-D8 repository events | [PR381] through [PR389] and their pinned source heads and squashes | Source heads, PR delivery, founder evidence, acceptance, and squashes remain distinct record classes. |
| Current A4/A4R1 routes | Fresh HUMAN_OPERATOR/CONTROL_THREAD workflow instructions | Tier 1/2 `WORKFLOW_ONLY` authority for this lane and repair only; not immutable repository sources. |
| Linear JAI-187 | Exact issue read at the evidence cutoff | `MIRROR_ONLY`; status `In Progress` does not route or accept A4. |

## 4. Immutable source and delivery reference index

All repository links below are pinned to a commit. PR links are delivery
metadata and do not become authority by being linked here.

| Coordinate | Source head | Squash or immutable record | Delivery |
| --- | --- | --- | --- |
| Motion 0248 | `8b5726841dbf292b041833ec3a1b995f1c3bf455` | [291e2006][C291] | [PR376] |
| Motion receipt repair | `ebba9150e7c9a95d41decfbd55d0b82041167e9d` | [3cc3268][C3CC] | [PR377] |
| Program opening packet | `20a4adc7122e0b4f8799b23570000dc942343a6c` | [57f291c][C57F] | [PR378] |
| Program opening receipt | `b00e442e2fe097071bbf970ff674cc05d82bbff7` | [6f9dea1][C6F9] | [PR379] |
| A1 | `7369a0a57de512c8878657d0379258ae5b38ac8f` | [cac7fa2][CCAC] | [PR380] |
| D1 | `2cc01ce507db867c0aa503cd12540bdcefcbf0c6` | [a0e7b76][CA0E] | [PR381] |
| D2 | `12a50e8c2502bf771005ddebbbc9f6b3dc2fdc74` | [1b1dcd3][C1B1] | [PR382] |
| A2 | `b3e708e712ab2e4abe9e472225c95e624d6c1ad7` | [c7eb9fc][CC7E] | [PR383] |
| D4 | `b07b9368694d315344f2089f2299cf04bccf1d3e` | [3417f02][C341] | [PR384] |
| D5 initial | `1f1949eec2fd66e5967444ec6d56d76dddc98638` | [d186596][CD18] | [PR385] |
| D5 final repair | `e1582f0450bb7bb3a398c2332749b815ec80face` | [f7f848a][CF7F] | [PR386] |
| D6 | `d980fec50fd8ede7d6057f68b21d80ac0313ac85` | [e41d0f3][CE41] | [PR387] |
| D7 | `cd689fea19c7ef47a9e2eea40bcc4d4835b27e6d` | [8bb41ab][C8BB] | [PR388] |
| D8 | `4b2915677fdaf7d4990cba4a351384820002bc7e` | [a1194b8][CA11] | [PR389] |

## 5. A2 precedence and classification inheritance

This registry inherits A2 without redefining it.

1. Source tiers remain, in order: fresh HUMAN_OPERATOR instruction; accepted
   CONTROL_THREAD decision; merged Motion/Program record; ratified historical
   Motion; current repository source; generated evidence; cross-repository
   observation; GitHub/Linear mirror; legacy/mock/placeholder/unavailable.
2. `observed_status` uses only: `ACCEPTED_CURRENT`,
   `RATIFIED_PHASE_SPECIFIC`, `LEGACY`, `STATIC_CONFIGURATION`, `PLACEHOLDER`,
   `MOCK`, `DEFERRED`, `DISABLED`, `MIRROR_ONLY`, `UNAVAILABLE`,
   `CONTRADICTORY`, or `UNRESOLVED`.
3. Claims are normalized to the same subject, scope, and time before conflict
   classification. Different time uses `records-later-event` unless an
   accepted source expressly corrects or supersedes the earlier claim.
4. Permitted relations are `supersedes`, `narrows`, `phase-bounds`,
   `corrects`, `records-later-event`, and `does-not-supersede`.
5. Chronology, merge, title, branch, filename, and mirror state never create
   acceptance or supersession by themselves.
6. Exact-token provenance follows four cases:
   - when an immutable authoritative source contains the token, the registry
     records the token with that pinned source;
   - when fresh accepted HUMAN_OPERATOR/CONTROL_THREAD workflow evidence
     supplies the token, the registry records it exactly as `WORKFLOW_ONLY`
     while immutable durability remains unavailable;
   - when only GitHub or Linear metadata contains the token, the registry may
     retain it only as `MIRROR_ONLY` text that establishes no authority; and
   - `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` is used only when no accepted
     source supplies the exact token, with any weaker mirror observation
     explained separately.
   Chronology, title, branch, merge, and narrative similarity never derive a
   token.

## 6. Stable registry schema

Every record is a join of one row in a `core` table and one row in its paired
`boundary` table using the same unique `registry_record_id`.

Schema stability applies to the field names, record IDs, and one-to-one table
join. `observed_status` and relation keywords use the controlled A2
vocabularies. Values in `source_authority_tier`, `currentness`, and
`evidence_class` are human-readable documentary composites; they are not
machine-enforced enums and must not be treated as machine-filterable canon.

| Field | Contract |
| --- | --- |
| `registry_record_id` | Stable unique A4 identifier. |
| `record_class` | Motion, route, source-head, repair, founder disposition, acceptance, or delivery class. |
| `subject_coordinate` | Normalized Program/Batch/Lane/event subject and scope. |
| `issuer` | Exact issuer when evidenced; otherwise `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE`. |
| `decision_token` | Exact token or `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE`. |
| `source_ref` | Immutable repository pointer, exact PR, or explicit workflow-only/unavailable source. |
| `source_authority_tier` | Human-readable A2 tier composite and any mirror limitation; not a machine enum. |
| `effective_scope_or_effect` | Bounded effect; never inferred authority. |
| `observed_status` | Exactly one A2 controlled status. |
| `currentness` | Human-readable current, historical phase-bound, workflow-only, mirror, or unavailable posture; not a machine enum. |
| `bounded_exception_prerequisites` | Bypassed prerequisites or `NONE`. |
| `termination_or_expiry_boundary` | Exact end boundary or `NONE`. |
| `supersession_or_follow_up` | One permitted A2 relation with named target or required follow-up. |
| `evidence_class` | Human-readable workflow, repository, generated, founder, GitHub delivery, or mirror composite; not a machine enum. |
| `evidence_ceiling` | Maximum claim supported by the record. |
| `explicit_non_authorizations` | Prohibited grants retained on the record. |
| `freshness_or_explanatory_notes` | Cutoff, source-head/squash distinction, missing evidence, and scope notes. |

## 7. Ratified Motion and Program-opening records

### 7.1 Core records

<!-- A4_MOTION_CORE_START -->
| registry_record_id | record_class | subject_coordinate | issuer | decision_token | source_ref | source_authority_tier | effective_scope_or_effect | observed_status | currentness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A4-M-001` | `RATIFIED_MOTION` | `motion-0248 / fixed four-Program portfolio` | `HUMAN_OPERATOR` | `RATIFY_SEQUENTIAL_ACTIVATION_PORTFOLIO_MOTION` | [MOTION-DECISION] | `1 human + 3 merged Motion` | Reserves exact sequence; opens no Program. | `RATIFIED_PHASE_SPECIFIC` | Historical issuance state; portfolio envelope remains controlling. |
| `A4-M-002` | `MOTION_DELIVERY` | `motion-0248 / PR376` | `GitHub delivery + repository merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR376], [C291] | `5 repository + 8 GitHub mirror` | Merges the nine-path package/snapshot delivery. | `STATIC_CONFIGURATION` | Merged repository event retained on current main; not accepted authority. |
| `A4-M-003` | `MOTION_RECEIPT_REPAIR` | `motion-0248 / receipt coherence` | `CONTROL_THREAD route; Builder delivery` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [MOTION-EXECUTION], [PR377], [C3CC] | `2 workflow recorded by 5 repository; 8 PR mirror` | Corrects stale required-check wording without opening Program 1. | `STATIC_CONFIGURATION` | Current repaired repository receipt; not a separate accepted decision. |
| `A4-M-004` | `MOTION_ACCEPTANCE` | `motion-0248 / accepted on main / zero activation` | `CONTROL_THREAD` | `ACCEPT_MOTION_0248_ON_MAIN_WITH_ZERO_PROGRAM_ACTIVATION` | [OPENING-PACKET] | `2 workflow evidence recorded by 5 repository` | Accepts Motion on main; active Program count remains zero at that phase. | `ACCEPTED_CURRENT` | Later Program opening is a separate event. |
| `A4-M-005` | `PROGRAM_OPENING_PACKET_DELIVERY` | `Q3M7Y26-P1 / opening readiness packet` | `Builder delivery; CONTROL_THREAD review required` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [OPENING-PACKET], [PR378], [C57F] | `5 repository + 8 PR mirror` | Records readiness for a later human decision; does not open Program 1. | `STATIC_CONFIGURATION` | Historical pre-opening repository packet. |
| `A4-M-006` | `HUMAN_PROGRAM_OPENING_AUTHORIZATION` | `Q3M7Y26-P1 / Batch planning only` | `HUMAN_OPERATOR` | `AUTHORIZE_OPEN_PROGRAM_1_FOR_BATCH_PLANNING` | [OPENING-RECEIPT] | `1 human recorded by 5 repository` | Authorizes CONTROL_THREAD to open Program 1 for Batch planning only. | `ACCEPTED_CURRENT` | Current Program-opening authority origin. |
| `A4-M-007` | `PROGRAM_OPENING_DECISION` | `Q3M7Y26-P1 / sole active Program` | `CONTROL_THREAD` | `OPEN_PROGRAM_1_FOR_BATCH_PLANNING_ONLY` | [OPENING-RECEIPT] | `2 accepted decision recorded by 3/5 repository` | Opens Program 1 for Batch planning only; no Batch/Lane execution. | `ACCEPTED_CURRENT` | Current until a separately accepted Program transition. |
| `A4-M-008` | `PROGRAM_OPENING_RECEIPT_DELIVERY` | `Q3M7Y26-P1 / durable opening receipt` | `Builder delivery; CONTROL_THREAD decision external` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR379], [C6F9], [OPENING-RECEIPT] | `3/5 repository + 8 PR mirror` | Durably records the already-effective opening decision. | `STATIC_CONFIGURATION` | Repository delivery records but does not create the opening decision. |
<!-- A4_MOTION_CORE_END -->

### 7.2 Boundary and evidence fields

<!-- A4_MOTION_BOUNDARY_START -->
| registry_record_id | bounded_exception_prerequisites | termination_or_expiry_boundary | supersession_or_follow_up | evidence_class | evidence_ceiling | explicit_non_authorizations | freshness_or_explanatory_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `A4-M-001` | `NONE` | Material change requires human amendment or superseding Motion. | `phase-bounds` zero-active issuance state; `records-later-event` to `A4-M-007`. | Human ratification plus merged Motion. | Fixed sequence and opening prerequisites only. | No Program opening, execution, provider, Agent, Council, production, or activation. | Decision timestamp `2026-07-15T22:40:43Z`; empty votes and deliberation bypass preserved. |
| `A4-M-002` | `NONE` | Delivery complete at squash. | `does-not-supersede` `A4-M-001`; delivery cannot replace ratification. | Merged repository delivery. | Package and snapshot presence only. | No acceptance by merge; no Program, runtime, or activation grant. | Source head `8b572...` is distinct from squash `291e...`. |
| `A4-M-003` | Merged PR376 and identified receipt contradiction. | Repair complete at squash `3cc3268...`. | `corrects` stale execution wording from [C291]; does not supersede ratification. | Repository correction. | Receipt coherence only. | No Motion self-acceptance, Program opening, runtime, or authority transfer. | Optional agency registry remained unavailable; required checks were preserved as passing. |
| `A4-M-004` | Repaired Motion receipt and separate CONTROL_THREAD review. | Until human amendment or superseding Motion. | `records-later-event` after `A4-M-003`; `phase-bounds` zero-active state at acceptance. | Repository-recorded workflow authority. | Motion acceptance with zero Program activation. | No Program opening, Batch execution, provider, Agent, Council, production, or activation. | Exact token is pinned in the opening packet as workflow evidence, not a machine receipt. |
| `A4-M-005` | Motion accepted; fresh readiness review. | Ends when human opening authorization is issued or packet is held/rejected. | `records-later-event` to `A4-M-006`; does not open Program 1. | Candidate documentary packet. | Opening consideration only. | No opening, Batch execution, persistence, provider, Agent, Council, production, or activation. | Source head `20a4...`; squash `57f...`; merged `2026-07-16T05:01:54Z`. |
| `A4-M-006` | Accepted packet and fresh readiness verification. | Bounded to Program 1 Batch planning. | `records-later-event` to `A4-M-007`. | Human workflow authority recorded in repository. | Authorization to CONTROL_THREAD only. | No direct Batch/Lane execution, provider, Agent, Council, production, or activation. | Raw and normalized human token are preserved in [OPENING-RECEIPT]. |
| `A4-M-007` | Human authorization and verified opening conditions. | Until accepted hold, cancel, close, or other Program transition. | `records-later-event` relative to Motion zero-active phase. | Accepted CONTROL_THREAD decision. | Program open for Batch planning only. | No automatic progression, Batch execution, provider, Agent, Council, production, or activation. | Programs 2-4 remain reserved and unopened. |
| `A4-M-008` | Effective workflow decision already issued. | Durable record persists; decision changes require separate receipt. | `does-not-supersede` `A4-M-007`; records it. | Merged documentary receipt. | Durable record only. | No additional authority, execution, provider, Agent, Council, production, or activation. | Source head `b00e...` is distinct from squash `6f9...`. |
<!-- A4_MOTION_BOUNDARY_END -->

## 8. A1-A4 decision records

### 8.1 Core records

<!-- A4_BATCH_A_CORE_START -->
| registry_record_id | record_class | subject_coordinate | issuer | decision_token | source_ref | source_authority_tier | effective_scope_or_effect | observed_status | currentness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A4-A-001` | `LANE_ROUTE` | `Q3M7Y26-P1:A1` | `HUMAN_OPERATOR / CONTROL_THREAD` | `AUTHORIZE_ROUTE_PROGRAM_1_BATCH_A_WAVE_A_A_LANE_A1_PLANNING` | [A1-ARTIFACT] | `1/2 workflow recorded by 5 repository` | Routes A1 planning only. | `RATIFIED_PHASE_SPECIFIC` | Historical route, completed delivery. |
| `A4-A-002` | `ROUTE_CORRECTION` | `Q3M7Y26-P1:A1 / delivery role` | `CONTROL_THREAD` | `CORRECT_A1_EXECUTOR_ROLE_TO_JAI_DEV_BUILDER_FOR_DOCS_REFERENCE_DELIVERY` | [A1-ARTIFACT] | `2 workflow recorded by 5 repository` | Corrects current delivery role to Builder; preserves planning provenance. | `ACCEPTED_CURRENT` | Correction remains part of A1 provenance. |
| `A4-A-003` | `SOURCE_HEAD_AND_DELIVERY` | `Q3M7Y26-P1:A1` | `Builder delivery + GitHub merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR380], [CCAC] | `5 repository + 8 PR mirror` | Delivers accepted-main reconciliation planning artifact. | `STATIC_CONFIGURATION` | Current repository planning basis; acceptance is separate in `A4-A-004`. |
| `A4-A-004` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:A1` | `CONTROL_THREAD` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [A2-ARTIFACT] plus current A4R1 workflow evidence. | `1/2 fresh accepted status + 5 repository corroboration` | A2 names A1 as accepted basis and the current route retains A1 completion. | `ACCEPTED_CURRENT` | Fresh status is explicit; exact acceptance token remains unavailable and merge alone is not acceptance. |
| `A4-A-005` | `LANE_ROUTE` | `Q3M7Y26-P1:A2` | `HUMAN_OPERATOR / CONTROL_THREAD` | `CT-2026-07-19-Q3M7Y26-P1-START-A2-A3-D3-v0` | [A2-ARTIFACT], [PR383] | `1/2 workflow recorded by 5 repository and 8 PR mirror` | Routes A2 documentary precedence lane. | `RATIFIED_PHASE_SPECIFIC` | Historical route; A2 is accepted. |
| `A4-A-006` | `SOURCE_HEAD_AND_DELIVERY` | `Q3M7Y26-P1:A2` | `Builder delivery + GitHub merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR383], [CC7E] | `5 repository + 8 PR mirror` | Delivers the controlling A2 precedence/contradiction artifact. | `STATIC_CONFIGURATION` | Current controlling repository source; acceptance is separate in `A4-A-007`. |
| `A4-A-007` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:A2` | `CONTROL_THREAD` | `CT-2026-07-20-Q3M7Y26-P1-A2-ACCEPT-v0` | Current A4/A4R1 workflow evidence (`WORKFLOW_ONLY`); no immutable receipt located. | `1 fresh human route + 2 workflow decision` | Accepts A2 documentary canon within Program 1. | `ACCEPTED_CURRENT` | Exact workflow-only token; immutable durability remains unavailable. |
| `A4-A-008` | `LANE_ROUTE` | `Q3M7Y26-P1:A3` | `HUMAN_OPERATOR / CONTROL_THREAD` | `CT-2026-07-19-Q3M7Y26-P1-START-A2-A3-D3-v0` | [A2-ARTIFACT] and current A4 route. | `5 immutable repository + 1/2 workflow` | Routes read-only A3 reconciliation evidence. | `RATIFIED_PHASE_SPECIFIC` | Pinned route token; no durable A3 evidence artifact is assumed. |
| `A4-A-009` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:A3` | `CONTROL_THREAD` | `CT-2026-07-20-Q3M7Y26-P1-A3-ACCEPT-v0` | Current A4/A4R1 workflow evidence (`WORKFLOW_ONLY`); no immutable A3 artifact located. | `1 fresh human route + 2 workflow decision` | Marks the normalized A3 evidence packet accepted; creates no repository ownership. | `ACCEPTED_CURRENT` | Exact workflow-only token; registry records the durable-evidence gap. |
| `A4-A-010` | `LANE_ROUTE` | `Q3M7Y26-P1:A4` | `HUMAN_OPERATOR / CONTROL_THREAD` | `CT-2026-07-22-Q3M7Y26-P1-START-A4-MOTION-DECISION-REGISTRY-v0` | Parent A4 workflow route (`WORKFLOW_ONLY`). | `1 human + 2 CONTROL_THREAD workflow` | Routes one-file documentary delivery and one Draft PR. | `RATIFIED_PHASE_SPECIFIC` | Historical parent route; it did not accept A4. |
| `A4-A-011` | `REPAIR_ROUTE` | `Q3M7Y26-P1:A4R1` | `HUMAN_OPERATOR / CONTROL_THREAD` | `CT-2026-07-22-Q3M7Y26-P1-A4R1-STATUS-PROVENANCE-CHRONOLOGY-v0` | Current A4R1 workflow route (`WORKFLOW_ONLY`). | `1 fresh human + 2 CONTROL_THREAD workflow` | Routes this one-file status, provenance, chronology, exception, and schema repair. | `ACCEPTED_CURRENT` | Current repair route; A4 acceptance remains held pending final verification. |
<!-- A4_BATCH_A_CORE_END -->

### 8.2 Boundary and evidence fields

<!-- A4_BATCH_A_BOUNDARY_START -->
| registry_record_id | bounded_exception_prerequisites | termination_or_expiry_boundary | supersession_or_follow_up | evidence_class | evidence_ceiling | explicit_non_authorizations | freshness_or_explanatory_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `A4-A-001` | Program 1 opening for Batch planning. | Ends at A1 delivery/decision. | `records-later-event` to `A4-A-003`; does not route A2. | Repository-recorded route. | A1 planning only. | No A2+, runtime, provider, Agent, Council, production, or activation. | A1 artifact retains original planning scope. |
| `A4-A-002` | Existing A1 route and role-path mismatch. | Ends with corrected A1 delivery. | `corrects` delivery role only; does not supersede architectural planning character. | Repository-recorded correction. | Role/path coherence only. | No rolemap change, persistent Agent identity, runtime, or activation. | Two-commit PR provenance retained. |
| `A4-A-003` | A1 route and correction. | Delivery complete at squash. | `records-later-event` from opening receipt; A2 later builds on it. | Merged documentary source. | Planning evidence only. | No self-acceptance, A2 route, execution, provider, Agent, Council, or activation. | Source head `7369...`; squash `cac...`; merged `2026-07-18T12:26:44Z`. |
| `A4-A-004` | Independent acceptance outside the merge. | Until expressly corrected or superseded. | `does-not-supersede` A1 history; makes A1 the accepted basis for A2. | Downstream accepted-source statement. | Accepted A1 documentary basis only. | No synthesized token, execution, provider, Agent, Council, production, or activation. | Exact token remains unavailable by rule. |
| `A4-A-005` | Accepted A1 and exact one-path route. | Ends at A2 acceptance. | `records-later-event` to `A4-A-007`. | Repository-recorded workflow route. | A2 authoring/delivery only. | No A3 ownership, runtime, provider, Agent, Council, production, or activation. | Exact route appears in A2 artifact and PR body. |
| `A4-A-006` | A2 route and one-path scope. | Durable until accepted correction/supersession. | `records-later-event` relative to A1 snapshot; controls this A4 registry. | Merged documentary canon. | Authority/evidence precedence only. | No routing, acceptance, runtime, provider, Agent, Council, production, or activation by the file itself. | Source head `b3e...`; squash `c7e...`; merged `2026-07-20T02:17:07Z`. |
| `A4-A-007` | Independent review of A2 source head. | Until accepted amendment/supersession. | `records-later-event` after `A4-A-006`; does not erase A1. | Workflow-only acceptance. | Accepted documentary canon only. | No Batch A exit, execution, provider, Agent, Council, production, or activation. | No immutable receipt was located in PR metadata. |
| `A4-A-008` | A2 route also named A3 read-only work. | Ends with A3 acceptance/hold. | `records-later-event` to `A4-A-009`. | Workflow route plus PR corroboration. | Reconciliation evidence only. | No ownership assignment, mutation, routing, runtime, or activation. | A3 response-only packet is not treated as a repository artifact. |
| `A4-A-009` | Completed normalized A3 evidence packet. | Until accepted correction/supersession. | `does-not-supersede` repository-specific ownership evidence; accepts only A3 packet. | Workflow-only acceptance. | Reconciliation evidence only. | No repository owner, contract partition, mutation, provider, Agent, Council, or activation. | Durable A3 source remains unavailable. |
| `A4-A-010` | A1-A3 complete; exact main `a1194b8...`; no collision. | Ends at A4 acceptance/hold/revision. | Required follow-up: independent verification and separate CONTROL_THREAD acceptance. | Fresh workflow route. | `DOCUMENTATION_REGISTRY_ONLY`. | No A5, Batch B/C, D9, merge, deployment, execution, provider, Agent, Council, or activation. | This registry cannot accept itself. |
| `A4-A-011` | A4 source head `39a5a60...` and held A4 review findings. | Ends at A4R1 final acceptance, hold, or revision. | `corrects` A4 status/provenance/chronology semantics; does not accept A4. | Fresh `WORKFLOW_ONLY` repair route. | `DOCUMENTATION_REGISTRY_ONLY`. | No A4 self-acceptance, A5, Batch B/C, D9, merge, deployment, execution, provider, Agent, Council, or activation. | Exact token is fresh workflow evidence; immutable durability is unavailable. |
<!-- A4_BATCH_A_BOUNDARY_END -->

## 9. Bounded out-of-sequence Batch D proving-seam authorization

### 9.1 Core record

<!-- A4_EXCEPTION_CORE_START -->
| registry_record_id | record_class | subject_coordinate | issuer | decision_token | source_ref | source_authority_tier | effective_scope_or_effect | observed_status | currentness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A4-EXC-001` | `BOUNDED_BATCH_EXCEPTION` | `Q3M7Y26-P1 / Batch D proving seam / D1-D8` | `HUMAN_OPERATOR / CONTROL_THREAD` | `AUTHORIZE_PROGRAM_1_BATCH_D_PROVING_SEAM_WITH_CI_FIRST` | Current A4/A4R1 workflow evidence (`WORKFLOW_ONLY`); no immutable receipt located. | `1 fresh human route + 2 workflow-only decision` | Permits bounded local/dev CI-first proving work while observed Batch A, Batch B, and Batch C work remained incomplete, through D8 only. | `RATIFIED_PHASE_SPECIFIC` | Exact formal prerequisite-bypass list is unavailable; exception terminated after accepted D8 head merged as `a1194b8...`. |
<!-- A4_EXCEPTION_CORE_END -->

### 9.2 Boundary and evidence fields

<!-- A4_EXCEPTION_BOUNDARY_START -->
| registry_record_id | bounded_exception_prerequisites | termination_or_expiry_boundary | supersession_or_follow_up | evidence_class | evidence_ceiling | explicit_non_authorizations | freshness_or_explanatory_notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A4-EXC-001` | Observed planning state: remaining Batch A, Batch B, and Batch C work was incomplete. Exact formal prerequisite-bypass list: `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE`. | Exact D1-D8 proving sequence ended with D8 acceptance and squash `a1194b8...`; no continuing exception. | `phase-bounds` D1-D8 only; `does-not-supersede` any separately established Batch dependency. | `WORKFLOW_ONLY` bounded exception plus merged delivery evidence. | Tested/local-shadow and founder-observation evidence through D8 only. | No Batch D exit, D9, persistence, provider, Agent, Council, customer, production, Program exit, or JAI activation. | Exact exception token is fresh workflow evidence; no immutable receipt or complete formal bypass list was located. |
<!-- A4_EXCEPTION_BOUNDARY_END -->

## 10. D1-D8 route, repair, founder, acceptance, source-head, squash, and delivery records

### 10.1 Core records

<!-- A4_BATCH_D_CORE_START -->
| registry_record_id | record_class | subject_coordinate | issuer | decision_token | source_ref | source_authority_tier | effective_scope_or_effect | observed_status | currentness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A4-D1-001` | `LANE_ROUTE` | `Q3M7Y26-P1:D1 / CI first` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `A4-EXC-001`; no exact D1 route receipt located. | `9 unavailable bounded by 1/2 exception` | Routes CI prerequisite work within the exception. | `UNAVAILABLE` | Exact route token unavailable; repository result exists. |
| `A4-D1-002` | `SOURCE_HEAD` | `Q3M7Y26-P1:D1` | `JAI::DEV::VERIFIER` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [D1-HEAD] | `5 repository source` | Adds bounded control-plane behavioral tests to CI. | `STATIC_CONFIGURATION` | Historical repository source head; no acceptance authority. |
| `A4-D1-003` | `DELIVERY_AND_SQUASH` | `Q3M7Y26-P1:D1` | `GitHub delivery + repository merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR381], [CA0E] | `5 repository + 8 GitHub mirror` | Delivers D1 CI guardrail event. | `STATIC_CONFIGURATION` | Merged repository event on current main; acceptance remains unavailable. |
| `A4-D1-004` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:D1` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | No immutable acceptance receipt located; merge is not substituted. | `9 unavailable` | No acceptance effect is inferred. | `UNAVAILABLE` | Missing token preserved. |
| `A4-D2-001` | `LANE_ROUTE` | `Q3M7Y26-P1:D2 / local proving seam` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `A4-EXC-001`; no exact D2 route receipt located. | `9 unavailable bounded by 1/2 exception` | Routes bounded local-shadow implementation. | `UNAVAILABLE` | Exact route token unavailable; repository result exists. |
| `A4-D2-002` | `SOURCE_HEAD` | `Q3M7Y26-P1:D2` | `JAI::DEV::BUILDER` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [D2-HEAD] | `5 repository source` | Implements the tested local operating-loop proving seam. | `STATIC_CONFIGURATION` | Historical repository source head; no production or acceptance proof. |
| `A4-D2-003` | `DELIVERY_AND_SQUASH` | `Q3M7Y26-P1:D2` | `GitHub delivery + repository merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR382], [C1B1] | `5 repository + 8 GitHub mirror` | Delivers D2 implementation and tests. | `STATIC_CONFIGURATION` | Merged repository event on current main; acceptance remains unavailable. |
| `A4-D2-004` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:D2` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | No immutable acceptance receipt located; merge is not substituted. | `9 unavailable` | No acceptance effect is inferred. | `UNAVAILABLE` | Missing token preserved. |
| `A4-D3-001` | `FOUNDER_OBSERVATION_ROUTE` | `Q3M7Y26-P1:D3` | `HUMAN_OPERATOR / CONTROL_THREAD` | `CT-2026-07-19-Q3M7Y26-P1-START-A2-A3-D3-v0` | [A2-ARTIFACT] and current A4 route. | `5 immutable repository + 1/2 workflow` | Routes founder observation evidence only. | `RATIFIED_PHASE_SPECIFIC` | Historical route with pinned immutable token. |
| `A4-D3-002` | `FOUNDER_DISPOSITION` | `Q3M7Y26-P1:D3 / product disposition` | `HUMAN_OPERATOR` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | Workflow evidence reports `REVISE`; no immutable observation packet located. | `1 workflow fact; 9 durable source unavailable` | Records founder observation evidence with product disposition `REVISE`. | `RATIFIED_PHASE_SPECIFIC` | Phase-bound input to D4/D5; not Control acceptance. |
| `A4-D3-003` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:D3 / evidence packet` | `CONTROL_THREAD` | `CT-2026-07-20-Q3M7Y26-P1-D3-ACCEPT-v0` | Current A4/A4R1 workflow evidence (`WORKFLOW_ONLY`); no immutable D3 artifact located. | `1 fresh route + 2 workflow decision` | Accepts founder-observation evidence only, with product disposition retained. | `ACCEPTED_CURRENT` | Exact workflow-only token; distinct from founder disposition. |
| `A4-D4-001` | `LANE_ROUTE` | `Q3M7Y26-P1:D4` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | Workflow route existed; exact immutable token not located. | `9 unavailable bounded by A4-EXC-001` | Routes validation/deliberation UX correction. | `UNAVAILABLE` | Repository result and later acceptance exist. |
| `A4-D4-002` | `SOURCE_HEAD` | `Q3M7Y26-P1:D4` | `JAI::DEV::BUILDER` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [D4-HEAD] | `5 repository source` | Clarifies structural validation versus semantic deliberation. | `STATIC_CONFIGURATION` | Repository source head distinct from acceptance and squash. |
| `A4-D4-003` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:D4` | `CONTROL_THREAD` | `CT-2026-07-21-Q3M7Y26-P1-D4-ACCEPT-v0` | Current A4/A4R1 workflow evidence (`WORKFLOW_ONLY`); no immutable decision receipt located. | `1 fresh route + 2 workflow decision` | Accepts bounded D4 evidence. | `ACCEPTED_CURRENT` | Exact workflow-only acceptance. |
| `A4-D4-004` | `DELIVERY_AND_SQUASH` | `Q3M7Y26-P1:D4` | `GitHub delivery + repository merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR384], [C341] | `5 repository + 8 GitHub mirror` | Delivers accepted D4 source. | `STATIC_CONFIGURATION` | Repository delivery only; source head `b07b...`, squash `3417...`. |
| `A4-D5-001` | `LANE_ROUTE` | `Q3M7Y26-P1:D5` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | Workflow route existed; exact immutable token not located. | `9 unavailable bounded by A4-EXC-001` | Routes recovery/invalidation work. | `UNAVAILABLE` | Missing route token preserved. |
| `A4-D5-002` | `SOURCE_HEAD` | `Q3M7Y26-P1:D5 initial` | `JAI::DEV::BUILDER` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [D5-INITIAL-HEAD] | `5 repository source` | Implements client recovery and invalidation baseline. | `STATIC_CONFIGURATION` | Historical repository source head. |
| `A4-D5-003` | `DELIVERY_AND_SQUASH` | `Q3M7Y26-P1:D5 initial` | `GitHub delivery + repository merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR385], [CD18] | `5 repository + 8 GitHub mirror` | Delivers initial D5 implementation. | `STATIC_CONFIGURATION` | Repository delivery event; later repair is separate. |
| `A4-D5-004` | `REPAIR_SOURCE_HEAD` | `Q3M7Y26-P1:D5R1` | `JAI::DEV::BUILDER` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [D5R1-HEAD] | `5 repository source` | Adds fail-closed response coherence. | `STATIC_CONFIGURATION` | Repository repair head; exact repair token unavailable. |
| `A4-D5-005` | `REPAIR_SOURCE_HEAD` | `Q3M7Y26-P1:D5R2` | `JAI::DEV::BUILDER` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [D5R2-HEAD] | `5 repository source` | Binds transitions and deterministic evidence. | `STATIC_CONFIGURATION` | Repository repair head; exact repair token unavailable. |
| `A4-D5-006` | `REPAIR_SOURCE_HEAD` | `Q3M7Y26-P1:D5R3` | `JAI::DEV::BUILDER` | `MIRROR_ONLY_TEXT: CT-2026-07-21-Q3M7Y26-P1-D5R3-TEST-EVIDENCE-CLOSURE-v0` | [D5R3-HEAD], [PR386] | `5 repository source + 8 mirror-only token text` | Adds coordinated false-evidence rejection tests. | `STATIC_CONFIGURATION` | Repository repair head; token appears only in PR metadata and establishes no authority. |
| `A4-D5-007` | `FOUNDER_DISPOSITION` | `Q3M7Y26-P1:D5 / recovery observation` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | No immutable founder recovery packet located. | `9 unavailable` | No founder disposition is inferred. | `UNAVAILABLE` | UI observation history is not promoted without durable evidence. |
| `A4-D5-008` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:D5` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | No immutable acceptance receipt located; current route forbids manufacturing one. | `9 unavailable` | No acceptance token is inferred from two merged PRs. | `UNAVAILABLE` | Explicit required gap. |
| `A4-D5-009` | `FINAL_DELIVERY_AND_SQUASH` | `Q3M7Y26-P1:D5 final repair` | `GitHub delivery + repository merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR386], [CF7F] | `5 repository + 8 GitHub mirror` | Delivers three-commit D5 repair sequence. | `STATIC_CONFIGURATION` | Repository delivery only; final source head `e158...`, squash `f7f...`; acceptance remains unavailable. |
| `A4-D6-001` | `LANE_ROUTE` | `Q3M7Y26-P1:D6` | `HUMAN_OPERATOR / CONTROL_THREAD` | `CT-2026-07-21-Q3M7Y26-P1-START-D6-EXPLAINABLE-RECOMMENDATION-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`) plus [PR387] mirror corroboration. | `1/2 workflow + 8 PR corroboration` | Routes explainable recommendation work. | `RATIFIED_PHASE_SPECIFIC` | Historical workflow-only route. |
| `A4-D6-002` | `SOURCE_HEAD` | `Q3M7Y26-P1:D6 initial` | `JAI::DEV::BUILDER` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [D6-INITIAL-HEAD] | `5 repository source` | Adds deterministic founder-readable explanations. | `STATIC_CONFIGURATION` | Initial repository source before repairs. |
| `A4-D6-003` | `REPAIR_SOURCE_HEAD` | `Q3M7Y26-P1:D6R1` | `JAI::DEV::BUILDER` | `CT-2026-07-21-Q3M7Y26-P1-D6R1-EXPLANATION-COHERENCE-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`), [D6R1-HEAD], and [PR387] mirror corroboration. | `2 workflow + 5 repository + 8 PR mirror` | Closes omitted-finding and pending-proof coherence gaps. | `STATIC_CONFIGURATION` | Historical repository repair; token authority is workflow-only. |
| `A4-D6-008` | `FOUNDER_DISPOSITION` | `Q3M7Y26-P1:D6 / initial observation` | `HUMAN_OPERATOR` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | Current A4R1 workflow evidence plus [PR387] mirror corroboration. | `1 fresh workflow fact + 8 PR mirror` | Records `REVISE` for raw terminal artifact display and staged-projection ambiguity. | `RATIFIED_PHASE_SPECIFIC` | Phase-bound to pre-D6R2 head `91300aa5e6055d30f28825f776b0e7f2f522d3e5`; exact founder token unavailable. |
| `A4-D6-004` | `REPAIR_SOURCE_HEAD` | `Q3M7Y26-P1:D6R2` | `JAI::DEV::BUILDER` | `CT-2026-07-21-Q3M7Y26-P1-D6R2-DISPLAY-CONTAINMENT-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`), [D6R2-HEAD], and [PR387] mirror corroboration. | `2 workflow + 5 repository + 8 PR mirror` | Contains terminal display and staged drift; later accepted source head. | `STATIC_CONFIGURATION` | Repository repair head distinct from founder re-observation, Control acceptance, and squash. |
| `A4-D6-005` | `FOUNDER_REOBSERVATION` | `Q3M7Y26-P1:D6R2 / focused re-observation` | `HUMAN_OPERATOR as reported by PR387` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR387] mirror reports `PASS / ACCEPT`; no immutable founder packet located. | `8 GitHub mirror only` | Records mirror-reported founder re-observation disposition only. | `MIRROR_ONLY` | Phase-bound to accepted head `d980fec50fd8ede7d6057f68b21d80ac0313ac85`; distinct from later Control acceptance. |
| `A4-D6-006` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:D6` | `CONTROL_THREAD` | `CT-2026-07-21-Q3M7Y26-P1-D6-ACCEPT-v0` | Current A4/A4R1 workflow evidence (`WORKFLOW_ONLY`); no immutable decision receipt located. | `1 fresh route + 2 workflow decision` | Accepts D6 bounded evidence. | `ACCEPTED_CURRENT` | Exact workflow-only acceptance, after founder re-observation. |
| `A4-D6-007` | `DELIVERY_AND_SQUASH` | `Q3M7Y26-P1:D6` | `GitHub delivery + repository merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR387], [CE41] | `5 repository + 8 GitHub mirror` | Delivers the three-commit D6 sequence. | `STATIC_CONFIGURATION` | Repository delivery only; source head `d980...`, squash `e41...`. |
| `A4-D7-001` | `LANE_ROUTE` | `Q3M7Y26-P1:D7` | `HUMAN_OPERATOR / CONTROL_THREAD` | `CT-2026-07-21-Q3M7Y26-P1-START-D7-DECISION-CONFIRMATION-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`) plus [PR388] mirror corroboration. | `1/2 workflow + 8 PR corroboration` | Routes decision confirmation and authority clarity. | `RATIFIED_PHASE_SPECIFIC` | Historical workflow-only route. |
| `A4-D7-002` | `SOURCE_HEAD` | `Q3M7Y26-P1:D7 initial` | `JAI::DEV::BUILDER` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [D7-INITIAL-HEAD] | `5 repository source` | Adds deliberate two-step decision confirmation. | `STATIC_CONFIGURATION` | Initial repository source before repair. |
| `A4-D7-003` | `REPAIR_SOURCE_HEAD` | `Q3M7Y26-P1:D7R1` | `JAI::DEV::BUILDER` | `CT-2026-07-21-Q3M7Y26-P1-D7R1-MALFORMED-CONFIRMATION-FAIL-CLOSED-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`), [D7R1-HEAD], and [PR388] mirror corroboration. | `2 workflow + 5 repository + 8 PR mirror` | Fails closed malformed confirmation inputs; later accepted source head. | `STATIC_CONFIGURATION` | Repository repair head distinct from acceptance and squash. |
| `A4-D7-004` | `FOUNDER_OBSERVATION` | `Q3M7Y26-P1:D7` | `HUMAN_OPERATOR` | `CT-2026-07-21-Q3M7Y26-P1-D7-FOUNDER-OBSERVATION-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`); no immutable founder packet located. | `1 workflow event; 9 durable source unavailable` | Records that founder observation occurred; exact packet remains unavailable. | `RATIFIED_PHASE_SPECIFIC` | Historical workflow event; no browser finding is invented. |
| `A4-D7-005` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:D7` | `CONTROL_THREAD` | `CT-2026-07-21-Q3M7Y26-P1-D7-ACCEPT-v0` | Current A4/A4R1 workflow evidence (`WORKFLOW_ONLY`); no immutable decision receipt located. | `1 fresh route + 2 workflow decision` | Accepts D7 bounded evidence. | `ACCEPTED_CURRENT` | Exact workflow-only acceptance, distinct from founder observation and merge. |
| `A4-D7-006` | `DELIVERY_AND_SQUASH` | `Q3M7Y26-P1:D7` | `GitHub delivery + repository merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR388], [C8BB] | `5 repository + 8 GitHub mirror` | Delivers two-commit D7 sequence. | `STATIC_CONFIGURATION` | Repository delivery only; source head `cd689...`, squash `8bb...`. |
| `A4-D8-001` | `LANE_ROUTE` | `Q3M7Y26-P1:D8` | `HUMAN_OPERATOR / CONTROL_THREAD` | `CT-2026-07-22-Q3M7Y26-P1-START-D8-WORK-PACKET-EXPORT-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`) plus [PR389] mirror corroboration. | `1/2 workflow + 8 PR corroboration` | Routes redacted boundary-receipt export work. | `RATIFIED_PHASE_SPECIFIC` | Historical workflow-only route. |
| `A4-D8-002` | `SOURCE_HEAD` | `Q3M7Y26-P1:D8 initial` | `JAI::DEV::BUILDER` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [D8-INITIAL-HEAD] | `5 repository source` | Adds deterministic redacted receipt and clipboard control. | `STATIC_CONFIGURATION` | Initial repository source before repairs. |
| `A4-D8-003` | `REPAIR_SOURCE_HEAD` | `Q3M7Y26-P1:D8R1` | `JAI::DEV::BUILDER` | `CT-2026-07-22-Q3M7Y26-P1-D8R1-DESCRIPTOR-SNAPSHOT-FAIL-CLOSED-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`) and [D8R1-HEAD]. | `2 workflow + 5 repository` | Snapshots descriptor inputs before validation. | `STATIC_CONFIGURATION` | Intermediate repository repair head; token authority is workflow-only. |
| `A4-D8-004` | `FOUNDER_DISPOSITION` | `Q3M7Y26-P1:D8 initial observation` | `HUMAN_OPERATOR` | `CT-2026-07-22-Q3M7Y26-P1-D8-FOUNDER-OBSERVATION-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`) plus [PR389] mirror corroboration. | `1 workflow event + 8 PR mirror` | Requires clipboard-focus correction only. | `RATIFIED_PHASE_SPECIFIC` | Phase-bound to head `8582dd8...`; not acceptance. |
| `A4-D8-005` | `REPAIR_SOURCE_HEAD` | `Q3M7Y26-P1:D8R2` | `JAI::DEV::BUILDER` | `CT-2026-07-22-Q3M7Y26-P1-D8R2-CLIPBOARD-FOCUS-RETENTION-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`) and [D8R2-HEAD]. | `2 workflow + 5 repository` | Preserves natural clipboard-button focus and single-flight behavior; later accepted source head. | `STATIC_CONFIGURATION` | Repository repair head distinct from founder re-observation, acceptance, and squash. |
| `A4-D8-006` | `FOUNDER_REOBSERVATION` | `Q3M7Y26-P1:D8R2` | `HUMAN_OPERATOR` | `CT-2026-07-22-Q3M7Y26-P1-D8R2-FOUNDER-REOBSERVATION-v0` | Parent A4 workflow evidence (`WORKFLOW_ONLY`); immutable founder packet not located. | `1 workflow event; 9 durable source unavailable` | Records re-observation occurrence; exact browser packet is unavailable. | `RATIFIED_PHASE_SPECIFIC` | Historical workflow event; later Control acceptance is separately recorded. |
| `A4-D8-007` | `CONTROL_ACCEPTANCE` | `Q3M7Y26-P1:D8` | `CONTROL_THREAD` | `CT-2026-07-22-Q3M7Y26-P1-D8-ACCEPT-v0` | Current A4/A4R1 workflow evidence (`WORKFLOW_ONLY`); no immutable decision receipt located. | `1 fresh route + 2 workflow decision` | Accepts D8 bounded evidence at source head `4b29156...`. | `ACCEPTED_CURRENT` | Exact workflow-only acceptance; does not prove external-effect absence. |
| `A4-D8-008` | `DELIVERY_AND_SQUASH` | `Q3M7Y26-P1:D8` | `GitHub delivery + repository merge` | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [PR389], [CA11] | `5 repository + 8 GitHub mirror` | Delivers three-commit D8 sequence onto current main. | `STATIC_CONFIGURATION` | Repository delivery only; source head `4b29156...`, squash/current main `a1194b8...`. |
<!-- A4_BATCH_D_CORE_END -->

### 10.2 Boundary and evidence fields

The common non-authorization phrase used below is literal: **No persistence,
provider/model/API dispatch, Agent, Council, customer, production/deployment,
Batch or Program exit, or JAI activation authority.** Additional lane-specific
limits are appended where required.

<!-- A4_BATCH_D_BOUNDARY_START -->
| registry_record_id | bounded_exception_prerequisites | termination_or_expiry_boundary | supersession_or_follow_up | evidence_class | evidence_ceiling | explicit_non_authorizations | freshness_or_explanatory_notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `A4-D1-001` | `A4-EXC-001`; observed Batch A/B/C work was incomplete, while the exact formal bypass list is unavailable. | Ends at D1 delivery. | Required follow-up was D1 source/delivery evidence; acceptance token remains unavailable. | Workflow route unavailable. | CI routing only. | Common non-authorizations; no acceptance by route. | Exact D1 token must not be reconstructed. |
| `A4-D1-002` | `A4-EXC-001`; CI-first requirement. | Source-head phase ended at squash. | `records-later-event` to `A4-D1-003`. | Repository source head. | `CI_PREREQUISITE_ONLY`. | Common non-authorizations; no runtime proof. | Commit exists and changes one workflow path. |
| `A4-D1-003` | D1 source head and checks. | Delivery complete at squash. | `does-not-supersede` missing Control acceptance. | Merged repository event plus PR metadata. | CI prerequisite delivery only. | Common non-authorizations; merge is not acceptance. | Head `2cc...`; squash `a0e...`; merged `2026-07-19T06:34:30Z`. |
| `A4-D1-004` | Independent acceptance evidence required. | Open evidence gap. | Follow-up requires exact immutable or fresh workflow acceptance receipt if needed. | Unavailable authority evidence. | None. | Common non-authorizations; no inferred acceptance. | Required A4 missing-evidence row. |
| `A4-D2-001` | `A4-EXC-001`; observed Batch A/B/C work was incomplete, exact formal bypass list unavailable; D1 CI prerequisite delivered. | Ends at D2 delivery. | `records-later-event` to `A4-D2-003`. | Workflow route unavailable. | Local-shadow route only. | Common non-authorizations; no production route. | Exact D2 token must not be reconstructed. |
| `A4-D2-002` | D1 CI prerequisite. | Source-head phase ended at squash. | `records-later-event` to `A4-D2-003`. | Repository source head. | `TESTED_LOCAL_SHADOW_PROVING_SEAM_ONLY`. | Common non-authorizations; no persistence/provider/runtime claim. | Six-path source head verified. |
| `A4-D2-003` | D2 source head and checks. | Delivery complete at squash. | `records-later-event` from D1; `does-not-supersede` missing acceptance. | Merged repository event plus PR metadata. | Tested local-shadow seam only. | Common non-authorizations; merge is not acceptance. | Head `12a...`; squash `1b1...`; merged `2026-07-19T21:20:50Z`. |
| `A4-D2-004` | Independent acceptance evidence required. | Open evidence gap. | Follow-up requires exact acceptance receipt if needed. | Unavailable authority evidence. | None. | Common non-authorizations; no inferred acceptance. | Required A4 missing-evidence row. |
| `A4-D3-001` | D2 deployed/accessible founder surface under authenticated human operation. | Ends at founder evidence return. | `records-later-event` to `A4-D3-002`. | Workflow observation route. | Founder observation only. | Common non-authorizations; no code or external-system mutation. | Shared A2/A3/D3 route token preserved. |
| `A4-D3-002` | Authenticated founder operation with synthetic content. | Phase-bound after D3; feeds D4/D5. | `records-later-event` to D4/D5; `does-not-supersede` D3 Control acceptance. | Workflow-only founder evidence. | Founder observation evidence only. | Common non-authorizations; product `REVISE` is not rejection or acceptance authority. | Durable packet unavailable. |
| `A4-D3-003` | D3 evidence packet returned. | Until corrected/superseded. | `phase-bounds` product revision findings; accepts evidence only. | Workflow-only Control acceptance. | `FOUNDER_OBSERVATION_EVIDENCE_ONLY`. | Common non-authorizations; no Batch D exit. | Exact acceptance token supplied by current route. |
| `A4-D4-001` | D3 revision evidence and `A4-EXC-001`. | Ends at D4 decision. | `records-later-event` to `A4-D4-003`. | Workflow route unavailable. | Bounded UX implementation only. | Common non-authorizations; no D5 route. | Missing route token is explicit. |
| `A4-D4-002` | Exact three-path allowlist. | Source-head phase ended at squash. | `records-later-event` to `A4-D4-004`. | Repository source head. | `TESTED_MODEL_PLUS_STATIC_UI_ONLY`. | Common non-authorizations; no authenticated-browser focus claim. | Head and changed paths verified. |
| `A4-D4-003` | Independent verification of exact source head. | Until corrected/superseded. | `records-later-event` after source evidence; does not equal merge. | Workflow-only Control acceptance. | Accepted D4 bounded evidence. | Common non-authorizations; no D5 execution grant. | Exact token supplied by current route. |
| `A4-D4-004` | Accepted source head and merge authorization. | Delivery complete at squash. | `does-not-supersede` `A4-D4-003`; records delivery. | Merged repository event plus PR metadata. | D4 tested/static UI only. | Common non-authorizations; no authority by merge. | Merged `2026-07-21T01:24:03Z`. |
| `A4-D5-001` | D4 merge and fresh base under `A4-EXC-001`. | Ends at D5 sequence completion. | `records-later-event` to D5 source/repairs. | Workflow route unavailable. | Recovery/invalidation implementation only. | Common non-authorizations; no acceptance. | Missing route token is explicit. |
| `A4-D5-002` | Exact three-path scope. | Initial phase ended at PR385 squash. | `records-later-event` to `A4-D5-003`. | Repository source head. | `TESTED_CLIENT_RECOVERY_CONTRACT_ONLY`. | Common non-authorizations; browser runtime pending at this phase. | Initial head verified. |
| `A4-D5-003` | Initial D5 checks and delivery. | Delivery complete; later repair remains separate. | `records-later-event` to D5R1-R3; no implied acceptance. | Merged repository event plus PR metadata. | Initial recovery contract only. | Common non-authorizations; merge is not acceptance. | Head `1f19...`; squash `d186...`; merged `2026-07-21T04:20:11Z`. |
| `A4-D5-004` | Initial D5 merge; bounded repair need. | Ends at next repair head. | `records-later-event` to `A4-D5-005`. | Repository repair source. | Fail-closed response coherence only. | Common non-authorizations; no weakened evidence. | Commit `6b65...` verified. |
| `A4-D5-005` | D5R1 source. | Ends at next repair head. | `records-later-event` to `A4-D5-006`. | Repository repair source. | Deterministic evidence coherence only. | Common non-authorizations; no client recommendation authority. | Commit `16aa...` verified. |
| `A4-D5-006` | D5R2 source and identified test-evidence gap. | Ends at final repair delivery. | `records-later-event` to `A4-D5-009`. | Repository test repair plus PR metadata. | Test evidence closure only. | Common non-authorizations; PR token is not acceptance. | Commit `e158...` is final PR386 source head. |
| `A4-D5-007` | Normal founder observation would be required. | Evidence unavailable. | Follow-up only through an exact available founder packet. | Unavailable founder evidence. | None. | Common non-authorizations; no inferred browser result. | No durable packet found. |
| `A4-D5-008` | Independent Control acceptance required. | Evidence unavailable. | Follow-up only through exact decision evidence; merge chronology is insufficient. | Unavailable authority evidence. | None. | Common non-authorizations; no inferred D5 acceptance. | Explicitly required missing token. |
| `A4-D5-009` | Three repair commits and checks. | Delivery complete at squash. | `records-later-event` after initial D5 delivery; `does-not-supersede` missing acceptance. | Merged repository event plus PR metadata. | `TESTED_CLIENT_RECOVERY_CONTRACT_ONLY`. | Common non-authorizations; no external-effect proof. | Merged `2026-07-21T11:48:04Z`. |
| `A4-D6-001` | D5 repository basis and exception. | Ends at D6 acceptance/hold. | `records-later-event` to D6 source/repairs. | `WORKFLOW_ONLY` route plus PR mirror corroboration. | Explainability implementation only. | Common non-authorizations; no server recommendation transfer. | Exact route is supplied by parent A4 workflow evidence; PR text alone would remain mirror-only. |
| `A4-D6-002` | Exact four-path source scope. | Ends at D6R1. | `records-later-event` to `A4-D6-003`. | Repository source head. | Deterministic explanation tests/static UI. | Common non-authorizations; no founder acceptance. | Commit `0ed69...` verified. |
| `A4-D6-003` | D6 initial source and coherence findings. | Ends at initial founder observation. | `records-later-event` to `A4-D6-008`. | Repository repair source with workflow-only route token. | Explanation/proof coherence only. | Common non-authorizations; no client-derived recommendation display. | Commit `91300...` verified; source state precedes the initial founder `REVISE`. |
| `A4-D6-008` | Authenticated initial founder observation at pre-D6R2 head. | Ends at D6R2 repair. | `records-later-event` to `A4-D6-004`. | Fresh workflow founder fact plus GitHub PR mirror corroboration. | Initial founder revision evidence only. | Common non-authorizations; `REVISE` grants no repair, acceptance, or merge authority. | Raw terminal artifact display and staged-projection ambiguity were the two findings; exact founder token unavailable. |
| `A4-D6-004` | D6R1 source plus the initial founder findings. | Ends at focused founder re-observation. | `records-later-event` to `A4-D6-005`. | Repository repair source with workflow-only route token. | Tested display containment and staged-projection clarity only. | Common non-authorizations; no external-effect proof or acceptance by source head. | Final source head `d980...` is repository evidence, not accepted authority by itself. |
| `A4-D6-005` | Authenticated focused re-observation at D6R2 head. | Phase-bound to later D6 Control acceptance. | `records-later-event` to `A4-D6-006`; `does-not-supersede` Control acceptance. | GitHub PR mirror of founder evidence. | Mirror-reported founder `PASS / ACCEPT` only. | Common non-authorizations; no authority from founder UX result. | Exact founder token and durable packet unavailable; accepted head is `d980fec...`. |
| `A4-D6-006` | D6 source, repair, and founder evidence reviewed. | Until corrected/superseded. | `records-later-event` to `A4-D6-007`; distinct from merge. | `WORKFLOW_ONLY` Control acceptance. | Accepted D6 bounded evidence. | Common non-authorizations; no D7 route by implication. | Exact acceptance token supplied by parent A4 workflow evidence. |
| `A4-D6-007` | Accepted source head and merge authorization. | Delivery complete at squash. | `does-not-supersede` Control acceptance; records later delivery. | Merged repository event plus PR metadata. | D6 bounded delivery evidence only. | Common non-authorizations; no authority by merge. | Merged `2026-07-21T21:57:45Z`. |
| `A4-D7-001` | D6 acceptance/merge and exception. | Ends at D7 acceptance/hold. | `records-later-event` to D7 source/repair. | Repository-recorded workflow route. | Decision-confirmation implementation only. | Common non-authorizations; no D8 route by implication. | Exact route in PR body. |
| `A4-D7-002` | Exact three-path source scope. | Ends at D7R1. | `records-later-event` to `A4-D7-003`. | Repository source head. | Tested confirmation contracts plus static UI. | Common non-authorizations; no browser focus claim. | Commit `077045...` verified. |
| `A4-D7-003` | D7 initial source and malformed-input finding. | Source phase ends at squash; accepted evidence remains. | `records-later-event` to founder observation and Control acceptance. | Repository repair source. | `TESTED_MALFORMED_CONFIRMATION_FAIL_CLOSED_PLUS_STATIC_UI_ONLY`. | Common non-authorizations; no decision execution authority. | Final source head `cd689...`. |
| `A4-D7-004` | Authenticated founder operation. | Evidence packet unavailable. | `records-later-event` to Control acceptance; outcome not inferred. | Workflow-only event with durable gap. | Founder observation occurrence only. | Common non-authorizations; no inferred disposition. | Exact token supplied; packet absent. |
| `A4-D7-005` | D7 source/repair and founder evidence reviewed. | Until corrected/superseded. | `records-later-event` before delivery; distinct from merge. | Workflow-only Control acceptance. | Accepted D7 bounded evidence. | Common non-authorizations; no D8 route by implication. | Exact token supplied by current route. |
| `A4-D7-006` | Accepted source head and merge authorization. | Delivery complete at squash. | `does-not-supersede` acceptance; records delivery. | Merged repository event plus PR metadata. | D7 bounded evidence only. | Common non-authorizations; no authority by merge. | Merged `2026-07-22T00:42:59Z`. |
| `A4-D8-001` | D7 acceptance/merge and exception. | Ends at D8 acceptance/hold. | `records-later-event` to D8 source and repairs. | Repository-recorded workflow route. | Receipt/export implementation only. | Common non-authorizations; no D9 route. | Exact route in PR body. |
| `A4-D8-002` | Exact three-path source scope. | Ends at D8R1. | `records-later-event` to `A4-D8-003`. | Repository source head. | Deterministic redacted receipt plus static clipboard UI. | Common non-authorizations; no clipboard readback or external-effect proof. | Commit `a4ec...` verified. |
| `A4-D8-003` | Initial source and descriptor-snapshot finding. | Ends at initial founder observation/D8R2. | `records-later-event` to `A4-D8-004` and `A4-D8-005`. | Repository repair source. | Fail-closed receipt model only. | Common non-authorizations; no browser focus success claim. | Commit `8582...` verified. |
| `A4-D8-004` | Authenticated founder copy observation. | Phase-bound to head `8582dd8...`; ends at D8R2. | `records-later-event` to focus repair; does not reject receipt behavior. | Founder workflow evidence plus PR mirror. | Founder observation evidence only. | Common non-authorizations; `REVISE` grants no repair/merge itself. | PR body records focus loss as sole revision. |
| `A4-D8-005` | Initial founder `REVISE` and exact two-path repair scope. | Source phase ends at D8 acceptance/squash. | `records-later-event` to re-observation and Control acceptance. | Repository repair source. | `TESTED_FOCUS_RETENTION_WIRING_PLUS_STATIC_UI_ONLY`. | Common non-authorizations; no forced focus or external-effect proof. | Final source head `4b29156...`. |
| `A4-D8-006` | Authenticated founder re-observation. | Evidence packet unavailable; later Control acceptance recorded separately. | `records-later-event` to `A4-D8-007`; outcome not reconstructed. | Workflow-only event with durable gap. | Re-observation occurrence only. | Common non-authorizations; no inferred browser findings. | Exact token supplied; packet absent. |
| `A4-D8-007` | D8 source/repairs/founder evidence reviewed. | Until corrected/superseded. | `records-later-event` before delivery; distinct from squash. | Workflow-only Control acceptance. | Accepted D8 bounded evidence. | Common non-authorizations; no external-effect absence, D9, or Batch D exit. | Exact token supplied by current route. |
| `A4-D8-008` | Accepted source head and merge authorization. | Delivery complete at squash. | `does-not-supersede` acceptance; records delivery and advances main. | Merged repository event plus PR metadata. | D8 bounded evidence only. | Common non-authorizations; merge does not open D9 or Batch B. | Merged `2026-07-22T03:23:45Z`; current main exact. |
<!-- A4_BATCH_D_BOUNDARY_END -->

## 11. Bounded-exception register

| Exception | Bypassed prerequisites | Authorized scope | Termination | Current disposition |
| --- | --- | --- | --- | --- |
| `A4-EXC-001` | Observed incomplete Batch A, Batch B, and Batch C work; exact formal prerequisite-bypass list unavailable. | CI-first local/dev proving seam, D1-D8 only. | D8 accepted source head `4b29156...` merged as `a1194b8...`. | `CLOSED_PHASE_BOUND`; grants no continuing Batch D, D9, or other authority. |

No second exception was found. Motion 0248's M0248-A1/A2 package-staging
exception is historical and separately phase-bounded inside the Motion files;
it does not authorize Program 1 delivery work.

## 12. Supersession, correction, narrowing, phase, and later-event relations

| Earlier source | Relation | Later source | Shared scope and effect |
| --- | --- | --- | --- |
| Motion 0248 zero-active issuance state | `records-later-event` | Program opening decision `A4-M-007` | Program count changed later without making issuance-time evidence false. |
| PR376 execution wording | `corrects` | PR377 / `A4-M-003` | Required-check receipt wording only; no Program or authority change. |
| Program opening packet | `records-later-event` | Human authorization and opening decision | Readiness packet precedes and does not create the opening. |
| A1 observed main | `records-later-event` | D1, D2, A2, D4-D8 squashes through `a1194b8...` | Later repository events advance main without rewriting A1's observation time. |
| A1 planning basis | `does-not-supersede` | A2 precedence canon | A2 operationalizes A1 and remains controlling for this registry. |
| Observed incomplete Batch A/B/C planning state | `phase-bounds` | `A4-EXC-001` | Exception permits D1-D8 proving only; no complete formal prerequisite-bypass list is inferred. |
| D5 initial delivery | `records-later-event` | D5R1-R3 final delivery | Repairs advance the implementation; missing acceptance remains missing. |
| D6 initial source and D6R1 | `records-later-event` | Initial founder `REVISE` at pre-D6R2 head | Raw terminal artifact display and staged-projection ambiguity remain phase-bound findings. |
| Initial D6 founder `REVISE` | `records-later-event` | D6R2 source head `d980fec...` | Repository repair addresses the two founder findings but does not self-accept. |
| D6R2 source head | `records-later-event` | Founder re-observation `PASS / ACCEPT` | PR #387 mirror reports the later founder disposition; it remains distinct from Control acceptance. |
| D6R2 founder re-observation | `records-later-event` | D6 Control acceptance | Workflow-only Control acceptance follows rather than being created by founder evidence. |
| D6 Control acceptance | `records-later-event` | D6 squash delivery `e41d0f3...` | Merge records delivery and does not replace the acceptance decision. |
| D7 initial source | `records-later-event` | D7R1 | Malformed confirmation repair advances the implementation. |
| D8 initial/R1 source | `records-later-event` | Founder `REVISE`, D8R2, re-observation, acceptance | Focus repair and later acceptance do not rewrite the initial observation. |
| Pre-merge PR non-authorization text | `phase-bounds` | Later separate Control acceptance and squash | Draft-PR merge prohibition was accurate before later authorization; no conflict. |
| GitHub PR state | `does-not-supersede` | HUMAN_OPERATOR/CONTROL_THREAD decisions | PR metadata proves delivery only. |
| Linear JAI-187 | `does-not-supersede` | Repository and Control evidence | `In Progress` is mirror state only. |

No `supersedes` relation is asserted by chronology alone.

## 13. Current controlling-disposition view

| Subject | Current controlling disposition | Basis | Authority consequence |
| --- | --- | --- | --- |
| Motion 0248 | Accepted on main; fixed four-Program sequence remains controlling. | `A4-M-001` through `A4-M-004` | No activation or automatic progression. |
| Program 1 | Open for Batch planning only; sole recognized active Program. | `A4-M-006` through `A4-M-008` | Every Batch/Lane still requires an exact route. |
| Batch A | A1-A3 complete per fresh route; A4R1 routed and A4 acceptance held pending final verification. | `A4-A-004`, `A4-A-007`, `A4-A-009`, `A4-A-010`, `A4-A-011` | No Batch A exit. |
| Batch D proving seam | D1-D8 bounded sequence ended; D8 accepted and merged. | `A4-EXC-001`, `A4-D8-007`, `A4-D8-008` | No Batch D exit and no continuing exception. |
| Batch B | Not accepted. | Fresh A4 route and JAI-187 mirror context. | D9 remains held. |
| D9 | `HELD_PENDING_ACCEPTED_BATCH_B`. | Fresh A4 route; canonical JAI-237 dependency. | No D9 execution. |
| A5 | Not routed. | A4 route and non-authorizations. | Separate Control decision required after A4 review/acceptance. |
| External effects | Unverified. | D2-D8 evidence ceilings. | No persistence/provider/customer/production claim. |
| JAI, Agents, Council | Not activated. | Motion, Program receipt, and every lane boundary. | No identity, vote, dispatch, execution, or activation authority. |

There is exactly one current controlling disposition for each normalized
subject/scope above. No duplicate current authority claim was found.

## 14. Missing or unavailable decision evidence

| Gap | Classification | Consequence |
| --- | --- | --- |
| Exact A1 acceptance token | `UNAVAILABLE` | A2 may name A1 as accepted basis; this registry cannot invent the token. |
| Durable A3 evidence artifact | `UNAVAILABLE` | A3 acceptance remains workflow-only and does not assign repository ownership. |
| Durable D3 founder packet | `UNAVAILABLE` | Product `REVISE` and Control evidence acceptance remain separate workflow facts. |
| Exact D1 route and acceptance tokens | `UNAVAILABLE` | D1 source and squash remain repository events; merge is not acceptance. |
| Exact D2 route and acceptance tokens | `UNAVAILABLE` | D2 source and squash remain repository events; merge is not acceptance. |
| Exact D4 route token | `UNAVAILABLE` | D4 acceptance token remains separately supplied by the current route. |
| Exact D5 route, D5R1/D5R2 decision, founder, and acceptance tokens | `UNAVAILABLE` | Two merged PRs and three repair commits do not manufacture Control acceptance. |
| Durable initial D6 founder packet/token | `UNAVAILABLE` | Fresh A4R1 evidence preserves `REVISE` and both findings at the pre-D6R2 head; exact founder token remains unavailable. |
| Durable D6R2 founder re-observation packet/token | `UNAVAILABLE` | PR-reported `PASS / ACCEPT` remains `MIRROR_ONLY`; later Control acceptance is separate. |
| Durable D7 founder packet | `UNAVAILABLE` | Observation occurrence is recorded; exact findings are not inferred. |
| Durable D8R2 founder re-observation packet | `UNAVAILABLE` | D8 Control acceptance is recorded separately; browser details remain unavailable. |
| Immutable A4/A4R1 route receipts | `UNAVAILABLE` | Fresh workflow-only routes govern the lane and repair; the registry cannot accept itself. |

These are evidence gaps, not current authority contradictions. Any later
receipt must use `records-later-event`, `corrects`, or another permitted A2
relation; it must not silently rewrite these rows.

## 15. Duplicate, contradiction, and completeness audit

| Audit | Result |
| --- | --- |
| Registry ID uniqueness | `PASS - 66 unique core IDs and no duplicates.` |
| Core/boundary one-to-one join | `PASS - 66 core rows and 66 boundary rows; zero join mismatches.` |
| Required field coverage | `PASS - every joined record exposes all 17 required fields.` |
| PR metadata #376-#389 | All 14 exact PRs returned merged; source head and squash recorded separately. |
| Immutable commit/path resolution | `PASS - 29 unique commit references and 7 pinned path references resolve.` |
| A2 status classification | `PASS - ACCEPTED_CURRENT 13; RATIFIED_PHASE_SPECIFIC 15; STATIC_CONFIGURATION 29; MIRROR_ONLY 1; UNAVAILABLE 8.` |
| Repository-only-not-accepted | `PASS - all 29 repository-only source, repair, package, snapshot, merge, delivery, and squash records are STATIC_CONFIGURATION.` |
| Exact token provenance | `PASS - 29 unique exact token texts audited: 7 IMMUTABLE_PINNED, 21 WORKFLOW_ONLY, and 1 MIRROR_ONLY_TEXT.` |
| Unavailable-token handling | `PASS - 35 records without an accepted exact token use UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE; D1, D2, and D5 acceptance remains unavailable.` |
| Founder versus Control separation | Founder observations never substitute for Control acceptance. |
| D6 founder chronology | Initial `REVISE` -> D6R2 repair -> mirror-reported `PASS / ACCEPT` -> Control acceptance -> squash, with five distinct records and relations. |
| PR/merge versus authority separation | GitHub delivery never substitutes for routing or acceptance. |
| Linear posture | JAI-187 remains `MIRROR_ONLY`; no Linear mutation occurred. |
| Batch D exception provenance | Observed incomplete Batch A/B/C work is separated from the unavailable formal prerequisite-bypass list; D1-D8 boundary remains closed. |
| Schema honesty | Field names, IDs, and joins are stable; three documentary composite fields are explicitly not machine-enforced enums. |
| Current authority conflict | None found after subject/scope/time normalization. |
| Positive grant scan | `PASS - no prohibited persistence, provider, Agent, Council, customer, production, execution, Batch-exit, Program-exit, or JAI-activation grant appears.` |

### 15.1 Exact-token provenance audit

`IMMUTABLE_PINNED` means the exact token appears in the linked immutable
authoritative source. `WORKFLOW_ONLY` means fresh accepted workflow evidence
supplies the exact token without immutable durability. `MIRROR_ONLY_TEXT`
establishes no authority.

<!-- A4_TOKEN_PROVENANCE_START -->
| Exact token | Registry records | Provenance | Source |
| --- | --- | --- | --- |
| `RATIFY_SEQUENTIAL_ACTIVATION_PORTFOLIO_MOTION` | `A4-M-001` | `IMMUTABLE_PINNED` | [MOTION-DECISION] |
| `ACCEPT_MOTION_0248_ON_MAIN_WITH_ZERO_PROGRAM_ACTIVATION` | `A4-M-004` | `IMMUTABLE_PINNED` | [OPENING-PACKET] |
| `AUTHORIZE_OPEN_PROGRAM_1_FOR_BATCH_PLANNING` | `A4-M-006` | `IMMUTABLE_PINNED` | [OPENING-RECEIPT] |
| `OPEN_PROGRAM_1_FOR_BATCH_PLANNING_ONLY` | `A4-M-007` | `IMMUTABLE_PINNED` | [OPENING-RECEIPT] |
| `AUTHORIZE_ROUTE_PROGRAM_1_BATCH_A_WAVE_A_A_LANE_A1_PLANNING` | `A4-A-001` | `IMMUTABLE_PINNED` | [A1-ARTIFACT] |
| `CORRECT_A1_EXECUTOR_ROLE_TO_JAI_DEV_BUILDER_FOR_DOCS_REFERENCE_DELIVERY` | `A4-A-002` | `IMMUTABLE_PINNED` | [A1-ARTIFACT] |
| `CT-2026-07-19-Q3M7Y26-P1-START-A2-A3-D3-v0` | `A4-A-005`, `A4-A-008`, `A4-D3-001` | `IMMUTABLE_PINNED` | [A2-ARTIFACT] |
| `CT-2026-07-20-Q3M7Y26-P1-A2-ACCEPT-v0` | `A4-A-007` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-20-Q3M7Y26-P1-A3-ACCEPT-v0` | `A4-A-009` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-22-Q3M7Y26-P1-START-A4-MOTION-DECISION-REGISTRY-v0` | `A4-A-010` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-22-Q3M7Y26-P1-A4R1-STATUS-PROVENANCE-CHRONOLOGY-v0` | `A4-A-011` | `WORKFLOW_ONLY` | Current A4R1 route |
| `AUTHORIZE_PROGRAM_1_BATCH_D_PROVING_SEAM_WITH_CI_FIRST` | `A4-EXC-001` | `WORKFLOW_ONLY` | Current A4R1 route |
| `CT-2026-07-20-Q3M7Y26-P1-D3-ACCEPT-v0` | `A4-D3-003` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-21-Q3M7Y26-P1-D4-ACCEPT-v0` | `A4-D4-003` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-21-Q3M7Y26-P1-D5R3-TEST-EVIDENCE-CLOSURE-v0` | `A4-D5-006` | `MIRROR_ONLY_TEXT` | [PR386] |
| `CT-2026-07-21-Q3M7Y26-P1-START-D6-EXPLAINABLE-RECOMMENDATION-v0` | `A4-D6-001` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-21-Q3M7Y26-P1-D6R1-EXPLANATION-COHERENCE-v0` | `A4-D6-003` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-21-Q3M7Y26-P1-D6R2-DISPLAY-CONTAINMENT-v0` | `A4-D6-004` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-21-Q3M7Y26-P1-D6-ACCEPT-v0` | `A4-D6-006` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-21-Q3M7Y26-P1-START-D7-DECISION-CONFIRMATION-v0` | `A4-D7-001` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-21-Q3M7Y26-P1-D7R1-MALFORMED-CONFIRMATION-FAIL-CLOSED-v0` | `A4-D7-003` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-21-Q3M7Y26-P1-D7-FOUNDER-OBSERVATION-v0` | `A4-D7-004` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-21-Q3M7Y26-P1-D7-ACCEPT-v0` | `A4-D7-005` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-22-Q3M7Y26-P1-START-D8-WORK-PACKET-EXPORT-v0` | `A4-D8-001` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-22-Q3M7Y26-P1-D8R1-DESCRIPTOR-SNAPSHOT-FAIL-CLOSED-v0` | `A4-D8-003` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-22-Q3M7Y26-P1-D8-FOUNDER-OBSERVATION-v0` | `A4-D8-004` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-22-Q3M7Y26-P1-D8R2-CLIPBOARD-FOCUS-RETENTION-v0` | `A4-D8-005` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-22-Q3M7Y26-P1-D8R2-FOUNDER-REOBSERVATION-v0` | `A4-D8-006` | `WORKFLOW_ONLY` | Parent A4 route |
| `CT-2026-07-22-Q3M7Y26-P1-D8-ACCEPT-v0` | `A4-D8-007` | `WORKFLOW_ONLY` | Parent A4 route |
<!-- A4_TOKEN_PROVENANCE_END -->

## 16. A5 handoff prerequisites without routing A5

A5 remains un-routed. CONTROL_THREAD may consider a separate A5 route only
after all of the following are true:

1. The A4 Draft PR is independently reviewed.
2. Registry completeness, unique IDs, source pointers, unavailable evidence,
   and A2 relation use are independently verified.
3. CONTROL_THREAD separately accepts or revises A4.
4. Any accepted A4 delivery is merged and a fresh `origin/main` SHA is
   recorded.
5. The A5 packet names its exact canonical scope, role, base, branch,
   allowlist, validation, stop conditions, and non-authorizations.
6. No unresolved current authority conflict or overlapping active work exists.

This section does not select A5 content, create an A5 Work Packet, or grant A5
execution authority.

## 17. Validation and evidence

### 17.1 Read-only source evidence

- Repository remote: `https://github.com/jai-nexus/dev-jai-nexus.git`.
- Fresh `origin/main`: `a1194b820a126b23bc1ac992f8d4271acfbfde08`.
- Starting branch/head: exact routed branch at
  `39a5a6004bcf1e6d2d9176eeb43b5c13944b950f`; worktree clean.
- Existing Draft PR #390: open, draft, unmerged, exact one-path scope.
- Authorized path before repair: existing sole A4 path; no second path changed.
- GitHub PR metadata: exact PRs #376-#389 returned merged; PR #390 returned
  open and draft.
- Linear JAI-187: `In Progress`, updated `2026-07-22T03:40:18.870Z`,
  `MIRROR_ONLY`, and not mutated.

### 17.2 Precommit validation receipt

| Check | Result |
| --- | --- |
| Exact one-path worktree | `PASS - only the allowlisted A4 artifact changed.` |
| Required headings and fields | `PASS - 19 numbered sections; 66 complete 17-field joined records.` |
| Unique IDs and paired-table join | `PASS - 66/66 unique core/boundary rows with zero mismatches.` |
| Immutable path/commit pointers | `PASS - all 29 commit and 7 pinned path references resolve.` |
| A2 status and relation audit | `PASS - 13 accepted, 15 phase-specific, 29 static, 1 mirror-only, and 8 unavailable; permitted relation semantics only.` |
| Repository-only-not-accepted audit | `PASS - all 29 repository-only records are STATIC_CONFIGURATION.` |
| Token provenance audit | `PASS - 29 unique exact token texts join 1:1 to 7 immutable, 21 workflow-only, and 1 mirror-only provenance entries; 35 absent-token rows remain explicit.` |
| D6 chronology audit | `PASS - initial REVISE, D6R2 repair, mirror PASS / ACCEPT, Control acceptance, and squash are separate and ordered.` |
| Exception/currentness audit | `PASS - observed incomplete Batch A/B/C state is distinct from the unavailable formal bypass list; one D1-D8 exception is closed with no continuing D9 or Batch authority.` |
| Schema-honesty audit | `PASS - stable fields/IDs/join are separated from three non-enum documentary composite values.` |
| Current-disposition/conflict audit | `PASS - no duplicate current accepted authority and no genuine current conflict after normalization.` |
| Positive-authority-grant scan | `PASS - no prohibited authority grant appears.` |
| Unresolved authoring-marker scan | `PASS - no unresolved authoring marker remains.` |
| Control-plane behavioral inventory | `PASS - deterministic byte-order discovery returned exactly 15 test files.` |
| All 15 focused behavioral tests | `PASS - A4R1 rerun 15/15 exited 0; exact unchanged commands used the continuing outside-sandbox authorization after the established tsx listen EPERM restriction.` |
| `git diff --check` | `PASS - no whitespace errors.` |
| `git diff --cached --check` | `PASS - no whitespace errors after staging the one authorized path.` |
| Cached one-path inventory | `PASS - exactly the allowlisted A4 artifact.` |
| Base immediately before commit | `PASS - origin/main remained a1194b820a126b23bc1ac992f8d4271acfbfde08.` |

Portal lint, typecheck, Prisma validation, and local production build:

`N/A - documentation-only change; no portal, package, schema, dependency, workflow, or runtime path changed.`

Remote `portal_ci_guardrails` remains required to run its Prisma, typecheck,
15-test behavioral inventory, and production-build gates on the Draft PR.

## 18. Risks and rollback

The principal risk is accidental promotion of workflow-only, GitHub delivery,
or Linear mirror evidence into authority. Secondary risks are collapsing
source head into squash, treating founder observation as Control acceptance,
and using chronology as supersession. The paired schema, A2 statuses,
explicit unavailable markers, and relation audit bound those risks.

Rollback is a normal revert of the A4R1 documentary repair commit. Revert
restores the prior index text only; it does not reverse, reject, or alter any
indexed Motion, Program, route, observation, acceptance, source commit, merge,
or mirror.

## 19. Explicit non-authorizations and zero-credit posture

This artifact and its Draft PR do not authorize A5, Batch B, Batch C, D9,
persistence, provider/model/API dispatch, packet execution, GitHub or Linear
mutation beyond the authorized Draft PR delivery, Agents, Council, customers,
deployment, production, Batch exit, Program exit, source-of-truth transfer, or
JAI activation. They do not issue a durable receipt, accept themselves, merge
the branch, enable auto-merge, convert the PR to ready, or delete the branch.

`A4_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_REGISTRY_ONLY`

`A4_ACCEPTANCE: HELD_PENDING_A4R1_FINAL_VERIFICATION`

`A5_EXECUTION_AUTHORITY: NOT_GRANTED`

`BATCH_B_EXECUTION_AUTHORITY: NOT_GRANTED`

`D9_EXECUTION_AUTHORITY: HELD_PENDING_ACCEPTED_BATCH_B`

`BATCH_A_EXIT_CREDIT: NONE`

`BATCH_D_EXIT_CREDIT: NONE`

`PROGRAM_EXIT_CREDIT: NONE`

`JAI_ACTIVATION_CREDIT: NONE`

`NEXT_REQUIRED_DECISION: ACCEPT_A4R1_FOR_FINAL_INDEPENDENT_VERIFICATION`

[MOTION-DECISION]: https://github.com/jai-nexus/dev-jai-nexus/blob/291e2006f1a7af9711d1b7c822ac46abc9569557/.nexus/motions/motion-0248/decision.yaml
[MOTION-EXECUTION]: https://github.com/jai-nexus/dev-jai-nexus/blob/3cc3268d2f2ce1d0219b211e6611fe20ca036acf/.nexus/motions/motion-0248/execution.md
[MOTION-SNAPSHOT]: https://github.com/jai-nexus/dev-jai-nexus/blob/291e2006f1a7af9711d1b7c822ac46abc9569557/portal/src/lib/motion/motionSnapshot.json
[OPENING-PACKET]: https://github.com/jai-nexus/dev-jai-nexus/blob/57f291cf915ca0d2ebaa39fb8f9637d74410d204/docs/reference/jai-governance-intelligence-main-state-operating-loop-program-opening-packet-v0.md
[OPENING-RECEIPT]: https://github.com/jai-nexus/dev-jai-nexus/blob/6f9dea1904066c45a75f3789377d32c2b0b16106/docs/reference/q3m7y26-jai-governance-intelligence-main-state-operating-loop-program-opening-receipt-v0.md
[A1-ARTIFACT]: https://github.com/jai-nexus/dev-jai-nexus/blob/cac7fa273cddd5e38ac30d26870fa04ab6476a18/docs/reference/q3m7-accepted-main-state-reconciliation-planning-v0.md
[A2-ARTIFACT]: https://github.com/jai-nexus/dev-jai-nexus/blob/c7eb9fcda25e9606dd552c63d82f08dc6a8df6eb/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md
[PR376]: https://github.com/jai-nexus/dev-jai-nexus/pull/376
[PR377]: https://github.com/jai-nexus/dev-jai-nexus/pull/377
[PR378]: https://github.com/jai-nexus/dev-jai-nexus/pull/378
[PR379]: https://github.com/jai-nexus/dev-jai-nexus/pull/379
[PR380]: https://github.com/jai-nexus/dev-jai-nexus/pull/380
[PR381]: https://github.com/jai-nexus/dev-jai-nexus/pull/381
[PR382]: https://github.com/jai-nexus/dev-jai-nexus/pull/382
[PR383]: https://github.com/jai-nexus/dev-jai-nexus/pull/383
[PR384]: https://github.com/jai-nexus/dev-jai-nexus/pull/384
[PR385]: https://github.com/jai-nexus/dev-jai-nexus/pull/385
[PR386]: https://github.com/jai-nexus/dev-jai-nexus/pull/386
[PR387]: https://github.com/jai-nexus/dev-jai-nexus/pull/387
[PR388]: https://github.com/jai-nexus/dev-jai-nexus/pull/388
[PR389]: https://github.com/jai-nexus/dev-jai-nexus/pull/389
[C291]: https://github.com/jai-nexus/dev-jai-nexus/commit/291e2006f1a7af9711d1b7c822ac46abc9569557
[C3CC]: https://github.com/jai-nexus/dev-jai-nexus/commit/3cc3268d2f2ce1d0219b211e6611fe20ca036acf
[C57F]: https://github.com/jai-nexus/dev-jai-nexus/commit/57f291cf915ca0d2ebaa39fb8f9637d74410d204
[C6F9]: https://github.com/jai-nexus/dev-jai-nexus/commit/6f9dea1904066c45a75f3789377d32c2b0b16106
[CCAC]: https://github.com/jai-nexus/dev-jai-nexus/commit/cac7fa273cddd5e38ac30d26870fa04ab6476a18
[CA0E]: https://github.com/jai-nexus/dev-jai-nexus/commit/a0e7b76af02899659529355773bf293d58269897
[C1B1]: https://github.com/jai-nexus/dev-jai-nexus/commit/1b1dcd3251092f193440d92406a09c2294f81701
[CC7E]: https://github.com/jai-nexus/dev-jai-nexus/commit/c7eb9fcda25e9606dd552c63d82f08dc6a8df6eb
[C341]: https://github.com/jai-nexus/dev-jai-nexus/commit/3417f02e000fec3a995e871dd8ad20f157cdbdd7
[CD18]: https://github.com/jai-nexus/dev-jai-nexus/commit/d186596f285334b6184b3a185c1acda841ab294a
[CF7F]: https://github.com/jai-nexus/dev-jai-nexus/commit/f7f848a5a7bf97abd969e709832d5c1e0df77ba5
[CE41]: https://github.com/jai-nexus/dev-jai-nexus/commit/e41d0f3308c493953662ce9a76737a191f6d1baa
[C8BB]: https://github.com/jai-nexus/dev-jai-nexus/commit/8bb41ab7e83beb36196df08275976afacca620ef
[CA11]: https://github.com/jai-nexus/dev-jai-nexus/commit/a1194b820a126b23bc1ac992f8d4271acfbfde08
[D1-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/2cc01ce507db867c0aa503cd12540bdcefcbf0c6
[D2-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/12a50e8c2502bf771005ddebbbc9f6b3dc2fdc74
[D4-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/b07b9368694d315344f2089f2299cf04bccf1d3e
[D5-INITIAL-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/1f1949eec2fd66e5967444ec6d56d76dddc98638
[D5R1-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/6b65b409c45bac97ec24aa4c49af92d01c91c2ae
[D5R2-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/16aabb262901111ebd201409d57dd8e61eb2d659
[D5R3-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/e1582f0450bb7bb3a398c2332749b815ec80face
[D6-INITIAL-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/0ed69aa40bc7ca24a66948b35f7c0fe48059f05b
[D6R1-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/91300aa5e6055d30f28825f776b0e7f2f522d3e5
[D6R2-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/d980fec50fd8ede7d6057f68b21d80ac0313ac85
[D7-INITIAL-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/07704514aa55ec947949ca788153414ed575fad9
[D7R1-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/cd689fea19c7ef47a9e2eea40bcc4d4835b27e6d
[D8-INITIAL-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/a4ec0593773ffa986c5b6ece06dd4599e6e3d34c
[D8R1-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/8582dd8efdc9adef912a73e675627abec82adf1d
[D8R2-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/4b2915677fdaf7d4990cba4a351384820002bc7e
