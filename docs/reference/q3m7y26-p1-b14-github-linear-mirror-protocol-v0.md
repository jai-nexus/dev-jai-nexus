# Q3M7Y26-P1 B14 GitHub-Linear Mirror Protocol v0

Role: JAI::DEV::BUILDER

## 1. Status and Purpose

| field | value |
| --- | --- |
| Program | Q3M7Y26-P1 |
| Batch | B - Program Lifecycle and Receipt Canon |
| Wave | B-D |
| Lane | B14 - GitHub-Linear Mirror Protocol v0 |
| Coordinate | Q3M7Y26-P1:B14 |
| Route | CT-2026-07-28-Q3M7Y26-P1-START-B14-GITHUB-LINEAR-MIRROR-PROTOCOL-v0 |
| Repository | jai-nexus/dev-jai-nexus |
| Required base | cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| Branch | docs/q3m7y26-p1-b14-github-linear-mirror-protocol-v0 |
| Linear mirror | JAI-210 / CONTROL_THREAD_UPDATED_IN_PROGRESS_2026-07-28 / CODEX_FILE_EXECUTION_NOT_ACCESSED_OR_REFRESHED / MIRROR_ONLY / NON_CONTROLLING |
| Protocol state | UNRESOLVED_DOCUMENTARY |
| Evidence ceiling | DOCUMENTATION_GITHUB_LINEAR_MIRROR_PROTOCOL_ONLY |

This artifact defines a prospective, one-way documentary projection protocol.
It performs no GitHub or Linear read or write, issues no receipt, changes no
lifecycle state, and grants no authority. Repository integration does not
prove CONTROL_THREAD acceptance. Linear workflow state never governs canon.

## 2. Source Precedence and Alignment

1. Fresh HUMAN_OPERATOR direction and accepted CONTROL_THREAD evidence govern
   within their exact scope.
2. A2 owns source precedence and contradiction handling. B1 owns lifecycle
   axes and mirror posture. B2 owns coordinate identity. B5 owns roles and
   authority boundaries. B7 owns decision disposition.
3. A7 supplies bounded PR and commit evidence; merge and checks do not imply
   acceptance. A12 supplies prior read-only mirror drift evidence.
4. B8 supplies evidence and freshness boundaries. B9 classifies receipts.
   B10 owns prospective receipt-instance and integrity semantics.
5. B13 owns rollback, reopen, and supersession history rules.
6. Static role-guardrail and PR-template configuration is mechanical evidence,
   not a principal or acceptance source.
7. Linear JAI-210 is mutable, mirror-only, non-controlling route corroboration
   supplied by CONTROL_THREAD. Codex did not access or refresh it.

Lower-precedence or mutable evidence cannot overwrite a controlling source.
Unknown, stale, contradictory, duplicated, unavailable, or ambiguous evidence
fails closed without changing canonical state.

## 3. Canonical Direction and Source-of-Truth Boundary

The only protocol direction is:

`CANONICAL_GITHUB_AND_ACCEPTED_CONTROL_EVIDENCE`
`->`
`MUTABLE_LINEAR_PLANNING_AND_STATUS_MIRROR`

Linear may display a bounded projection after a separately authorized future
mutation. It never routes, verifies, accepts, merges, deploys, executes,
activates, supersedes, or changes a B1 lifecycle state. Linear-origin
differences are drift observations only. They cannot overwrite canonical
evidence without a separately accepted controlling source.

## 4. Canonical Record Types

| type_id | record_type | field_count | ordinal_range |
| --- | --- | ---: | --- |
| B14-TYPE-01 | mirror_protocol_record | 18 | 1-18 |
| B14-TYPE-02 | mirror_subject_record | 12 | 1-12 |
| B14-TYPE-03 | canonical_event_record | 18 | 1-18 |
| B14-TYPE-04 | field_projection_rule | 10 | 1-10 |
| B14-TYPE-05 | update_trigger_record | 13 | 1-13 |
| B14-TYPE-06 | mirror_status_mapping_record | 9 | 1-9 |
| B14-TYPE-07 | idempotency_contract_record | 13 | 1-13 |
| B14-TYPE-08 | concurrency_failure_record | 9 | 1-9 |
| B14-TYPE-09 | history_event_record | 15 | 1-15 |
| B14-TYPE-10 | receipt_integrity_boundary_record | 10 | 1-10 |
| B14-TYPE-11 | sensitive_data_boundary_record | 8 | 1-8 |
| B14-TYPE-12 | evidence_pointer | 6 | 1-6 |
| B14-TYPE-13 | reservation | 4 | 1-4 |

Record types: 13. Field Registry rows: 145.

## 5. Complete Ordinal Field Registry

| record_type | ordinal | field | type | cardinality | requirement | rule |
| --- | ---: | --- | --- | --- | --- | --- |
| mirror_protocol_record | 1 | protocol_id | identifier | 1 | required | Unique B14-PROTOCOL identifier |
| mirror_protocol_record | 2 | schema_version | literal<github-linear-mirror-protocol/v0> | 1 | required | Exact protocol version |
| mirror_protocol_record | 3 | direction | literal<CANONICAL_GITHUB_AND_ACCEPTED_CONTROL_EVIDENCE_TO_MUTABLE_LINEAR_PLANNING_AND_STATUS_MIRROR> | 1 | required | Reverse projection is prohibited |
| mirror_protocol_record | 4 | subject_id | reference<mirror_subject_record> | 1 | required | Resolves exactly once |
| mirror_protocol_record | 5 | canonical_event_ids | ordered nonempty array<reference<canonical_event_record>> | 1..* | required | Ascending event ID order |
| mirror_protocol_record | 6 | projection_rule_ids | ordered nonempty array<reference<field_projection_rule>> | 1..* | required | Includes every declared field rule |
| mirror_protocol_record | 7 | trigger_ids | ordered nonempty array<reference<update_trigger_record>> | 1..* | required | Includes all required triggers |
| mirror_protocol_record | 8 | status_mapping_ids | ordered nonempty array<reference<mirror_status_mapping_record>> | 1..* | required | Includes workflow and drift mappings |
| mirror_protocol_record | 9 | idempotency_contract_id | reference<idempotency_contract_record> | 1 | required | Resolves exactly once |
| mirror_protocol_record | 10 | concurrency_failure_ids | ordered nonempty array<reference<concurrency_failure_record>> | 1..* | required | Ascending failure ID order |
| mirror_protocol_record | 11 | history_event_ids | ordered nonempty array<reference<history_event_record>> | 1..* | required | Ascending history ID order |
| mirror_protocol_record | 12 | receipt_boundary_id | reference<receipt_integrity_boundary_record> | 1 | required | Resolves exactly once |
| mirror_protocol_record | 13 | sensitive_boundary_id | reference<sensitive_data_boundary_record> | 1 | required | Resolves exactly once |
| mirror_protocol_record | 14 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves |
| mirror_protocol_record | 15 | reservation_ids | ordered nonempty array<reference<reservation>> | 1..* | required | B15 only |
| mirror_protocol_record | 16 | protocol_state | literal<UNRESOLVED_DOCUMENTARY> | 1 | required | No synchronization occurred |
| mirror_protocol_record | 17 | mutation_performed | literal<false> | 1 | required | Safe fixture is non-mutating |
| mirror_protocol_record | 18 | authority_effect | literal<NONE> | 1 | required | Protocol text grants no authority |
| mirror_subject_record | 1 | subject_id | identifier | 1 | required | Unique B14-SUBJECT identifier |
| mirror_subject_record | 2 | program_coordinate | literal<Q3M7Y26-P1> | 1 | required | B2-aligned Program code |
| mirror_subject_record | 3 | batch_coordinate | literal<B> | 1 | required | Program-local Batch code |
| mirror_subject_record | 4 | wave_coordinate | literal<B-D> | 1 | required | Program-local Wave code |
| mirror_subject_record | 5 | lane_coordinate | literal<Q3M7Y26-P1:B14> | 1 | required | Full coordinate |
| mirror_subject_record | 6 | role | literal<JAI::DEV::BUILDER> | 1 | required | Delivery role, not authority principal |
| mirror_subject_record | 7 | route_id | literal<CT-2026-07-28-Q3M7Y26-P1-START-B14-GITHUB-LINEAR-MIRROR-PROTOCOL-v0> | 1 | required | Current authoring route only |
| mirror_subject_record | 8 | repository | literal<jai-nexus/dev-jai-nexus> | 1 | required | Exact repository |
| mirror_subject_record | 9 | base_sha | sha40 | 1 | required | Must equal required base |
| mirror_subject_record | 10 | branch | literal<docs/q3m7y26-p1-b14-github-linear-mirror-protocol-v0> | 1 | required | Exact local branch |
| mirror_subject_record | 11 | linear_mirror_id | literal<JAI-210> | 1 | required | Mirror identity only |
| mirror_subject_record | 12 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Includes immutable and supplied mirror boundaries |
| canonical_event_record | 1 | event_id | identifier | 1 | required | Unique B14-EVENT identifier |
| canonical_event_record | 2 | event_class | enum<FRESH_EXACT_LANE_ROUTE,ARTIFACT_AUTHORED_UNSTAGED,BRANCH_COMMIT_PUSH,DRAFT_PR_DELIVERY,REPAIR_HEAD_UPDATE,PR_METADATA_UPDATE,INDEPENDENT_VERIFICATION,CONTROL_DISPOSITION,SQUASH_MERGE,REVERT_OR_LATER_REPOSITORY_EVENT,B13_REOPEN,B13_SUPERSESSION,MIRROR_ANOMALY> | 1 | required | Closed trigger vocabulary |
| canonical_event_record | 3 | subject_id | reference<mirror_subject_record> | 1 | required | Resolves exactly once |
| canonical_event_record | 4 | source_identity | nonempty string | 1 | required | Exact event identity |
| canonical_event_record | 5 | route_id | nonempty string or null | 0..1 | nullable | Null only when no route evidence exists |
| canonical_event_record | 6 | repository | repository slug | 1 | required | Exact owner/name |
| canonical_event_record | 7 | base_sha | sha40 or null | 0..1 | nullable | Non-null value must be exact |
| canonical_event_record | 8 | source_head_sha | sha40 or null | 0..1 | nullable | Null before commit evidence |
| canonical_event_record | 9 | integrated_main_sha | sha40 or null | 0..1 | nullable | Null before integration evidence |
| canonical_event_record | 10 | pr_number | positive integer or null | 0..1 | nullable | Null before PR evidence |
| canonical_event_record | 11 | pr_url | absolute HTTPS URL or null | 0..1 | nullable | Must match repository and PR number |
| canonical_event_record | 12 | pr_state | enum<DRAFT,OPEN_READY,CLOSED_UNMERGED,MERGED> or null | 0..1 | nullable | GitHub state is evidence, not acceptance |
| canonical_event_record | 13 | canonical_event_time | nonempty string | 1 | required | Canonical event time or explicit unavailable boundary; never replaced by mirror time |
| canonical_event_record | 14 | mirror_observation_boundary | nonempty string or null | 0..1 | nullable | Exact mirror read boundary; null when no mirror read occurred |
| canonical_event_record | 15 | canonical_evidence_links | ordered nonempty array<absolute HTTPS URL> | 1..* | required | Immutable links preferred; mutable links classified |
| canonical_event_record | 16 | decision_disposition | enum<ACCEPT,HOLD,REVISE,REJECT,UNRESOLVED> | 1 | required | Exact B7 domain; not a B1 acceptance state |
| canonical_event_record | 17 | acceptance_state | enum<NOT_ACCEPTED,ACCEPTANCE_PENDING,ACCEPTED,REJECTED> | 1 | required | Exact B1 acceptance-axis domain; requires separate controlling evidence |
| canonical_event_record | 18 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves |
| field_projection_rule | 1 | projection_rule_id | identifier | 1 | required | Unique B14-FIELD identifier |
| field_projection_rule | 2 | field_name | enum<FIELD_NAME_VOCABULARY> | 1 | required | One declared field only |
| field_projection_rule | 3 | ownership_class | enum<CANONICALLY_PROJECTED,LINEAR_WORKFLOW_DISPLAY,FOUNDER_MANUAL_PRESERVED,SEPARATE_AUTHORITY_REQUIRED,PROHIBITED_AUTOMATIC_MUTATION> | 1 | required | Closed ownership class |
| field_projection_rule | 4 | canonical_source | nonempty string | 1 | required | Exact controlling source or NONE |
| field_projection_rule | 5 | value_type | nonempty string | 1 | required | Scalar or ordered-array shape |
| field_projection_rule | 6 | automatic_mutation_policy | enum<ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE,PRESERVE,SEPARATE_AUTHORITY_REQUIRED,PROHIBITED> | 1 | required | No current mutation authority |
| field_projection_rule | 7 | preservation_rule | nonempty string | 1 | required | Existing manual content behavior |
| field_projection_rule | 8 | authority_requirement | nonempty string | 1 | required | Exact future authority boundary |
| field_projection_rule | 9 | failure_behavior | enum<HOLD,CONFLICT,PRESERVE,NO_ACTION> | 1 | required | Fail-closed result |
| field_projection_rule | 10 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves |
| update_trigger_record | 1 | trigger_id | identifier | 1 | required | Unique B14-TRIGGER identifier |
| update_trigger_record | 2 | event_class | reference<canonical_event_record.event_class> | 1 | required | Byte-matches closed event class |
| update_trigger_record | 3 | canonical_source_event | nonempty string | 1 | required | Exact source event |
| update_trigger_record | 4 | required_evidence | nonempty string | 1 | required | Complete prerequisite set |
| update_trigger_record | 5 | eligible_projection_rule_ids | ordered array<reference<field_projection_rule>> | 0..* | required | Empty means no field eligible |
| update_trigger_record | 6 | resulting_mirror_posture | enum<CURRENT,STALE,CONFLICTING,MISSING_MIRROR,DUPLICATE_MIRROR,ORPHANED_MIRROR,AMBIGUOUS_CANONICAL_SOURCE,PARTIAL_UPDATE,UNAVAILABLE,UNRESOLVED> | 1 | required | Mirror posture only |
| update_trigger_record | 7 | linear_display_status | enum<Backlog,Todo,"In Progress","In Review",Done> or null | 0..1 | nullable | Display mapping only |
| update_trigger_record | 8 | prohibited_inference | nonempty string | 1 | required | No adjacent lifecycle inference |
| update_trigger_record | 9 | idempotency_contract_id | reference<idempotency_contract_record> | 1 | required | Must resolve to B14-IDEMP-001 |
| update_trigger_record | 10 | failure_behavior | enum<HOLD,CONFLICT,NO_ACTION> | 1 | required | No overwrite on failure |
| update_trigger_record | 11 | canonical_effect | literal<NONE> | 1 | required | Mirror action cannot alter canon |
| update_trigger_record | 12 | authority_effect | literal<NONE> | 1 | required | Trigger grants no authority |
| update_trigger_record | 13 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves |
| mirror_status_mapping_record | 1 | mapping_id | identifier | 1 | required | Unique B14-STATUS identifier |
| mirror_status_mapping_record | 2 | source_status | enum<Backlog,Todo,"In Progress","In Review",Done,CURRENT,STALE,CONFLICTING,MISSING_MIRROR,DUPLICATE_MIRROR,ORPHANED_MIRROR,AMBIGUOUS_CANONICAL_SOURCE,PARTIAL_UPDATE,UNAVAILABLE,UNRESOLVED> | 1 | required | Closed status vocabulary |
| mirror_status_mapping_record | 3 | status_class | enum<LINEAR_WORKFLOW_DISPLAY,MIRROR_POSTURE> | 1 | required | Workflow and protocol posture stay distinct |
| mirror_status_mapping_record | 4 | detection_inputs | nonempty string | 1 | required | Exact comparison inputs |
| mirror_status_mapping_record | 5 | canonical_effect | literal<NONE> | 1 | required | No canonical change |
| mirror_status_mapping_record | 6 | mirror_effect | nonempty string | 1 | required | Bounded display or posture only |
| mirror_status_mapping_record | 7 | required_handling | nonempty string | 1 | required | Fail-closed handling |
| mirror_status_mapping_record | 8 | authority_effect | literal<NONE> | 1 | required | Status grants no authority |
| mirror_status_mapping_record | 9 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves |
| idempotency_contract_record | 1 | idempotency_contract_id | identifier | 1 | required | Unique B14-IDEMP identifier |
| idempotency_contract_record | 2 | protocol_version | literal<github-linear-mirror-protocol/v0> | 1 | required | Exact protocol version |
| idempotency_contract_record | 3 | source_identity_component | nonempty string | 1 | required | Exact canonical source identity |
| idempotency_contract_record | 4 | event_class_component | reference<canonical_event_record.event_class> | 1 | required | Exact event class |
| idempotency_contract_record | 5 | subject_coordinate_component | reference<mirror_subject_record.lane_coordinate> | 1 | required | Exact full coordinate |
| idempotency_contract_record | 6 | canonical_boundary_component | nonempty event-specific canonical-boundary string | 1 | required | Must byte-match the serialization table in section 9 |
| idempotency_contract_record | 7 | target_mirror_identity_component | reference<mirror_subject_record.linear_mirror_id> | 1 | required | Exact target mirror identity |
| idempotency_contract_record | 8 | key_serialization | nonempty string | 1 | required | Exact six-component order with byte-preserved values |
| idempotency_contract_record | 9 | read_before_write_required | literal<true> | 1 | required | Mandatory future behavior |
| idempotency_contract_record | 10 | prior_updated_at_required | literal<true> | 1 | required | Concurrency precondition only; never a key component |
| idempotency_contract_record | 11 | atomic_compare_and_set_support | literal<UNAVAILABLE> | 1 | required | No atomic Linear compare-and-set support is established |
| idempotency_contract_record | 12 | retry_behavior | nonempty string | 1 | required | Same-key retry rereads and reconciles before any write |
| idempotency_contract_record | 13 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves |
| concurrency_failure_record | 1 | failure_id | identifier | 1 | required | Unique B14-FAIL identifier |
| concurrency_failure_record | 2 | condition | enum<IDENTICAL_REPLAY,CHANGED_CANONICAL_INPUT,UPDATED_AT_MISMATCH,DUPLICATE_PROTOCOL_HISTORY_EVENT,PARTIAL_MULTI_FIELD_FAILURE,MALFORMED_IDENTITY,UNAVAILABLE_EVIDENCE,RETRY_AFTER_FAILURE> | 1 | required | Closed failure vocabulary |
| concurrency_failure_record | 3 | detection | nonempty string | 1 | required | Exact comparison rule |
| concurrency_failure_record | 4 | handling | enum<NO_ACTION,APPEND_LATER_EVENT,HOLD,CONFLICT> | 1 | required | Never blind overwrite |
| concurrency_failure_record | 5 | history_effect | enum<PRESERVE,APPEND_ONLY> | 1 | required | History is never erased |
| concurrency_failure_record | 6 | success_claim | literal<PROHIBITED_UNLESS_ALL_FIELDS_CONFIRMED> | 1 | required | Partial success cannot claim sync |
| concurrency_failure_record | 7 | canonical_effect | literal<NONE> | 1 | required | Canon remains unchanged |
| concurrency_failure_record | 8 | authority_effect | literal<NONE> | 1 | required | Failure handling grants no authority |
| concurrency_failure_record | 9 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves |
| history_event_record | 1 | history_event_id | identifier | 1 | required | Unique B14-HISTORY identifier |
| history_event_record | 2 | history_event_class | enum<MERGE,REVERT,LATER_REPOSITORY_EVENT,REOPEN,SUPERSESSION> | 1 | required | Closed history vocabulary |
| history_event_record | 3 | event_state | enum<UNRESOLVED_DOCUMENTARY,ESTABLISHED> | 1 | required | Safe fixture defines rules and records no performed history event |
| history_event_record | 4 | canonical_event_id | reference<canonical_event_record> or null | 0..1 | nullable | Non-null only for an established exact event |
| history_event_record | 5 | source_head_sha | sha40 or null | 0..1 | nullable | Byte-preserved event value; never overwritten |
| history_event_record | 6 | integrated_main_sha | sha40 or null | 0..1 | nullable | Byte-preserved integration value; never overwritten |
| history_event_record | 7 | canonical_event_time | nonempty string or null | 0..1 | nullable | Canonical event boundary; distinct from mirror observation |
| history_event_record | 8 | mirror_observation_boundary | nonempty string or null | 0..1 | nullable | Mutable observation boundary; never substitutes for canonical time |
| history_event_record | 9 | mirror_history_effect | enum<APPEND_ONLY,PRESERVE_AND_APPEND> | 1 | required | Never erase prior mirror history |
| history_event_record | 10 | predecessor_id_requirement | nonempty string or null | 0..1 | nullable | Required for supersession |
| history_event_record | 11 | replacement_id_requirement | nonempty string or null | 0..1 | nullable | Named replacement required for supersession |
| history_event_record | 12 | completed_prerequisites | nonempty string | 1 | required | Exact repository or B13 COMPLETED prerequisites |
| history_event_record | 13 | prohibited_behavior | nonempty string | 1 | required | No silent delete or rewrite |
| history_event_record | 14 | authority_effect | literal<NONE> | 1 | required | History projection grants no authority |
| history_event_record | 15 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves |
| receipt_integrity_boundary_record | 1 | receipt_boundary_id | identifier | 1 | required | Unique B14-RECEIPT identifier |
| receipt_integrity_boundary_record | 2 | receipt_class_id | literal<B9-CLASS-013> | 1 | required | Exact MIRROR_RECEIPT class |
| receipt_integrity_boundary_record | 3 | receipt_instance_id | literal<null> | 1 | required | No receipt instance is issued |
| receipt_integrity_boundary_record | 4 | issuance_state | literal<NOT_ISSUED> | 1 | required | B10 value domain |
| receipt_integrity_boundary_record | 5 | integrity_state | literal<UNVERIFIED> | 1 | required | B10 value domain |
| receipt_integrity_boundary_record | 6 | authenticity_state | literal<NOT_ESTABLISHED> | 1 | required | B10 value domain |
| receipt_integrity_boundary_record | 7 | decision_evidence_state | literal<NOT_ESTABLISHED> | 1 | required | B10 value domain |
| receipt_integrity_boundary_record | 8 | durability_posture | literal<UNAVAILABLE> | 1 | required | No persistence proof |
| receipt_integrity_boundary_record | 9 | authority_effect | literal<NONE> | 1 | required | Receipt classification grants no authority |
| receipt_integrity_boundary_record | 10 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | B9 and B10 evidence |
| sensitive_data_boundary_record | 1 | sensitive_boundary_id | identifier | 1 | required | Unique B14-SENSITIVE identifier |
| sensitive_data_boundary_record | 2 | allowed_content | nonempty string | 1 | required | Bounded public repository and mirror metadata |
| sensitive_data_boundary_record | 3 | prohibited_content | nonempty string | 1 | required | Credentials, secrets, tokens, cookies, environments, private identity, and payloads |
| sensitive_data_boundary_record | 4 | public_sha_exception | nonempty string | 1 | required | Public repository commit SHAs only |
| sensitive_data_boundary_record | 5 | repository_wide_absence_claim | literal<PROHIBITED> | 1 | required | Bounded inspection cannot prove absence |
| sensitive_data_boundary_record | 6 | redaction_requirement | literal<FAIL_CLOSED_BEFORE_PUBLICATION> | 1 | required | Sensitive input is never copied |
| sensitive_data_boundary_record | 7 | authority_effect | literal<NONE> | 1 | required | Boundary grants no authority |
| sensitive_data_boundary_record | 8 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves |
| evidence_pointer | 1 | evidence_id | identifier | 1 | required | Unique B14-E identifier |
| evidence_pointer | 2 | source_class | enum<REPOSITORY_CANON,STATIC_CONFIGURATION,CONTROL_THREAD_SUPPLIED_MIRROR_OBSERVATION> | 1 | required | Closed source class |
| evidence_pointer | 3 | immutability | enum<IMMUTABLE,MUTABLE_CORROBORATING> | 1 | required | Mutable evidence is non-controlling |
| evidence_pointer | 4 | reference | nonempty string | 1 | required | Immutable repository URL is SHA-pinned |
| evidence_pointer | 5 | claim | nonempty string | 1 | required | Bounded claim only |
| evidence_pointer | 6 | observation_boundary | nonempty string | 1 | required | Exact base or supplied mutable boundary |
| reservation | 1 | reservation_id | identifier | 1 | required | Unique B14-RES identifier |
| reservation | 2 | reserved_lane | literal<B15> | 1 | required | Separate downstream Lane |
| reservation | 3 | reserved_subject | literal<LIFECYCLE_CANON_VERIFICATION_AND_BATCH_B_CLOSEOUT> | 1 | required | B14 does not verify or close Batch B |
| reservation | 4 | execution_authority | literal<NOT_GRANTED> | 1 | required | Reservation grants no authority |

`FIELD_NAME_VOCABULARY` is the exact closed ordered list:
`program_coordinate`, `batch_coordinate`, `wave_coordinate`,
`lane_coordinate`, `role`, `route_identifier`, `route_posture`,
`capability_evidence_ceiling`, `repository`, `base_sha`, `source_head_sha`,
`integrated_main_sha`, `branch`, `artifact_paths`, `pr_number`, `pr_url`,
`pr_state`, `check_verification_posture`, `decision_disposition`,
`canonical_event_time`, `canonical_evidence_links`,
`mirror_status`, `mirror_freshness_conflict_posture`, `adaptation_history`,
`title`, `labels`, `priority`, `assignee`, `estimate`, `cycle`, `due_date`,
`project`, `milestone`, `relationships`, `comments`, `documents`,
`archive_state`, `deletion`, `mirror_observation_boundary`,
`acceptance_state`.

Unknown fields, duplicate IDs, invalid enums, malformed SHAs, unresolved
references, and ambiguous coordinates fail closed.

### Decision-Disposition and Acceptance-State Boundary

B7 decision disposition and B1 acceptance state are separate domains. A
decision event may project the B7 disposition only from exact B7 evidence.
Acceptance-state projection additionally requires separate controlling B1
acceptance evidence for the exact subject and boundary.

| B7 decision_disposition | permitted B1 acceptance_state effect |
| --- | --- |
| ACCEPT | ACCEPTED only with separate controlling acceptance evidence; otherwise unchanged |
| HOLD | unchanged; HOLD is never an acceptance state |
| REVISE | unchanged; REVISE is never an acceptance state |
| REJECT | REJECTED only with separate controlling rejection evidence; otherwise unchanged |
| UNRESOLVED | unchanged |

Missing, contradictory, stale, or mismatched disposition or acceptance
evidence fails closed. No disposition is inferred from PR state, merge,
Linear status, or chronology.

## 6. Field Ownership and Projection Matrix

Every row is documentary. `ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE` is not
current mutation authority.

| projection_rule_id | field_name | ownership_class | canonical_source | value_type | automatic_mutation_policy | preservation_rule | authority_requirement | failure_behavior | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B14-FIELD-001 | program_coordinate | CANONICALLY_PROJECTED | B2 accepted Program identity | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | exact replacement only | future exact Linear field route | HOLD | [B14-E-004] |
| B14-FIELD-002 | batch_coordinate | CANONICALLY_PROJECTED | B2/B14 coordinate evidence | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | exact replacement only | future exact Linear field route | HOLD | [B14-E-004] |
| B14-FIELD-003 | wave_coordinate | CANONICALLY_PROJECTED | B2/B14 coordinate evidence | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | exact replacement only | future exact Linear field route | HOLD | [B14-E-004] |
| B14-FIELD-004 | lane_coordinate | CANONICALLY_PROJECTED | B2 full coordinate | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | immutable identity join | future exact Linear field route | HOLD | [B14-E-004] |
| B14-FIELD-005 | role | CANONICALLY_PROJECTED | B5 portable role evidence | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | preserve source spelling | future exact Linear field route | HOLD | [B14-E-005] |
| B14-FIELD-006 | route_identifier | CANONICALLY_PROJECTED | accepted Control route | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | append later route events | future exact Linear field route | HOLD | [B14-E-004, B14-E-005, B14-E-012] |
| B14-FIELD-007 | route_posture | CANONICALLY_PROJECTED | accepted Control route | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | no lifecycle inference | future exact Linear field route | HOLD | [B14-E-003, B14-E-005, B14-E-012] |
| B14-FIELD-008 | capability_evidence_ceiling | CANONICALLY_PROJECTED | accepted evidence record | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | exact ceiling only | future exact Linear field route | HOLD | [B14-E-001, B14-E-006] |
| B14-FIELD-009 | repository | CANONICALLY_PROJECTED | repository event | repository slug | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | exact owner/name | future exact Linear field route | HOLD | [B14-E-001] |
| B14-FIELD-010 | base_sha | CANONICALLY_PROJECTED | repository event | sha40 | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | byte-preserve SHA | future exact Linear field route | HOLD | [B14-E-001] |
| B14-FIELD-011 | source_head_sha | CANONICALLY_PROJECTED | branch commit evidence | sha40 or null | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | preserve each value in a distinct history_event_record; never replace prior event | future exact Linear field route | HOLD | [B14-E-001] |
| B14-FIELD-012 | integrated_main_sha | CANONICALLY_PROJECTED | immutable integration event | sha40 or null | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | preserve each value in a distinct history_event_record; later events never overwrite it | future exact Linear field route | HOLD | [B14-E-001, B14-E-009] |
| B14-FIELD-013 | branch | CANONICALLY_PROJECTED | repository delivery evidence | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | exact branch at event boundary | future exact Linear field route | HOLD | [B14-E-001] |
| B14-FIELD-014 | artifact_paths | CANONICALLY_PROJECTED | exact repository diff | ordered array<string> | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | canonical sort | future exact Linear field route | HOLD | [B14-E-001] |
| B14-FIELD-015 | pr_number | CANONICALLY_PROJECTED | GitHub PR evidence | positive integer or null | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | exact repository join | future exact Linear field route | HOLD | [B14-E-001, B14-E-011] |
| B14-FIELD-016 | pr_url | CANONICALLY_PROJECTED | GitHub PR evidence | HTTPS URL or null | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | exact repository join | future exact Linear field route | HOLD | [B14-E-001, B14-E-011] |
| B14-FIELD-017 | pr_state | CANONICALLY_PROJECTED | GitHub PR evidence | enum or null | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | no acceptance inference | future exact Linear field route | HOLD | [B14-E-001, B14-E-011] |
| B14-FIELD-018 | check_verification_posture | CANONICALLY_PROJECTED | exact checks and accepted verification evidence | string | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | checks and verification remain separate | future exact Linear field route | HOLD | [B14-E-001, B14-E-010, B14-E-011] |
| B14-FIELD-019 | decision_disposition | CANONICALLY_PROJECTED | B7 exact disposition evidence | enum<ACCEPT,HOLD,REVISE,REJECT,UNRESOLVED> | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | keep separate from B1 acceptance state | future exact Linear field route | HOLD | [B14-E-014] |
| B14-FIELD-020 | canonical_event_time | CANONICALLY_PROJECTED | immutable event or accepted Control evidence | timestamp string or explicit unavailable boundary | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | preserve each value in a distinct history_event_record | future exact Linear field route | HOLD | [B14-E-001, B14-E-003] |
| B14-FIELD-021 | canonical_evidence_links | CANONICALLY_PROJECTED | evidence registry | ordered array<HTTPS URL> | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | deduplicate exact URLs | future exact Linear field route | HOLD | [B14-E-001, B14-E-006] |
| B14-FIELD-022 | mirror_status | LINEAR_WORKFLOW_DISPLAY | protocol comparison result | enum | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | display only | future exact Linear status route | CONFLICT | [B14-E-002, B14-E-003] |
| B14-FIELD-023 | mirror_freshness_conflict_posture | LINEAR_WORKFLOW_DISPLAY | canonical-to-mirror comparison | enum | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | canonical effect NONE | future exact Linear status route | CONFLICT | [B14-E-002, B14-E-003] |
| B14-FIELD-024 | adaptation_history | LINEAR_WORKFLOW_DISPLAY | prior idempotent projection events | ordered array<string> | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | append only | future exact Linear history route | HOLD | [B14-E-002, B14-E-003] |
| B14-FIELD-025 | title | FOUNDER_MANUAL_PRESERVED | NONE | string | PRESERVE | never overwrite automatically | separate exact title authority | PRESERVE | [B14-E-002, B14-E-012] |
| B14-FIELD-026 | labels | FOUNDER_MANUAL_PRESERVED | NONE | ordered array<string> | PRESERVE | never overwrite automatically | separate exact labels authority | PRESERVE | [B14-E-002] |
| B14-FIELD-027 | priority | FOUNDER_MANUAL_PRESERVED | NONE | string or null | PRESERVE | never overwrite automatically | separate exact priority authority | PRESERVE | [B14-E-002] |
| B14-FIELD-028 | assignee | FOUNDER_MANUAL_PRESERVED | NONE | external identity or null | PRESERVE | never inspect private identity automatically | separate exact assignee authority | PRESERVE | [B14-E-002] |
| B14-FIELD-029 | estimate | FOUNDER_MANUAL_PRESERVED | NONE | scalar or null | PRESERVE | never overwrite automatically | separate exact estimate authority | PRESERVE | [B14-E-002] |
| B14-FIELD-030 | cycle | FOUNDER_MANUAL_PRESERVED | NONE | external reference or null | PRESERVE | never overwrite automatically | separate exact cycle authority | PRESERVE | [B14-E-002] |
| B14-FIELD-031 | due_date | FOUNDER_MANUAL_PRESERVED | NONE | date or null | PRESERVE | never overwrite automatically | separate exact due-date authority | PRESERVE | [B14-E-002] |
| B14-FIELD-032 | project | FOUNDER_MANUAL_PRESERVED | NONE | external reference or null | PRESERVE | never overwrite automatically | separate exact project authority | PRESERVE | [B14-E-002] |
| B14-FIELD-033 | milestone | FOUNDER_MANUAL_PRESERVED | NONE | external reference or null | PRESERVE | never overwrite automatically | separate exact milestone authority | PRESERVE | [B14-E-002] |
| B14-FIELD-034 | relationships | FOUNDER_MANUAL_PRESERVED | NONE | ordered array<external reference> | PRESERVE | never overwrite automatically | separate exact relationship authority | PRESERVE | [B14-E-002] |
| B14-FIELD-035 | comments | PROHIBITED_AUTOMATIC_MUTATION | NONE | external content | PROHIBITED | preserve all comments | separate exact comment authority | NO_ACTION | [B14-E-002] |
| B14-FIELD-036 | documents | PROHIBITED_AUTOMATIC_MUTATION | NONE | external content | PROHIBITED | preserve all documents | separate exact document authority | NO_ACTION | [B14-E-002] |
| B14-FIELD-037 | archive_state | SEPARATE_AUTHORITY_REQUIRED | NONE | enum | SEPARATE_AUTHORITY_REQUIRED | preserve current state | separate exact archive authority | HOLD | [B14-E-002] |
| B14-FIELD-038 | deletion | PROHIBITED_AUTOMATIC_MUTATION | NONE | literal<PROHIBITED> | PROHIBITED | preserve record and history | separate exact deletion authority | NO_ACTION | [B14-E-002, B14-E-009] |
| B14-FIELD-039 | mirror_observation_boundary | LINEAR_WORKFLOW_DISPLAY | exact mirror read | timestamp string or null | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | never substitute for canonical_event_time | future exact Linear comparison route | HOLD | [B14-E-002, B14-E-013] |
| B14-FIELD-040 | acceptance_state | CANONICALLY_PROJECTED | B1 exact acceptance-axis evidence | enum<NOT_ACCEPTED,ACCEPTANCE_PENDING,ACCEPTED,REJECTED> | ELIGIBLE_ONLY_UNDER_FUTURE_EXACT_ROUTE | never infer from B7 HOLD or REVISE, PR state, merge, or Done | future exact Linear field route with controlling acceptance evidence | HOLD | [B14-E-003, B14-E-014] |

## 7. Update Trigger Matrix

| trigger_id | event_class | canonical_source_event | required_evidence | eligible_projection_rule_ids | resulting_mirror_posture | linear_display_status | prohibited_inference | idempotency_contract_id | failure_behavior | canonical_effect | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B14-TRIGGER-001 | FRESH_EXACT_LANE_ROUTE | Fresh exact CONTROL_THREAD Lane route | route, coordinate, role, repository, base, scope, and supplied route evidence; no mirror read | [B14-FIELD-001, B14-FIELD-002, B14-FIELD-003, B14-FIELD-004, B14-FIELD-005, B14-FIELD-006, B14-FIELD-007, B14-FIELD-008, B14-FIELD-009, B14-FIELD-010, B14-FIELD-013, B14-FIELD-014, B14-FIELD-020, B14-FIELD-021] | UNAVAILABLE | null | Route is not delivery, verification, acceptance, execution, or mirror currentness | B14-IDEMP-001 | HOLD | NONE | NONE | [B14-E-003, B14-E-004, B14-E-005, B14-E-012, B14-E-013] |
| B14-TRIGGER-002 | ARTIFACT_AUTHORED_UNSTAGED | Exact local one-path artifact observation | route, base, path inventory, and unstaged state; local observation only | [] | UNAVAILABLE | null | Local unstaged authoring cannot independently project to Linear and is not delivery or acceptance | B14-IDEMP-001 | NO_ACTION | NONE | NONE | [B14-E-012, B14-E-013] |
| B14-TRIGGER-003 | BRANCH_COMMIT_PUSH | Exact committed and pushed branch head | route, commit SHA, branch, path inventory, and push result; no mirror read | [B14-FIELD-011, B14-FIELD-013, B14-FIELD-014, B14-FIELD-020, B14-FIELD-021] | UNAVAILABLE | In Progress | Commit and push are not PR, verification, acceptance, integration, or mirror currentness | B14-IDEMP-001 | HOLD | NONE | NONE | [B14-E-001, B14-E-003, B14-E-013] |
| B14-TRIGGER-004 | DRAFT_PR_DELIVERY | Exact Draft PR opened from exact head | route, head SHA, PR number, URL, Draft state, and path inventory; no mirror read | [B14-FIELD-011, B14-FIELD-013, B14-FIELD-014, B14-FIELD-015, B14-FIELD-016, B14-FIELD-017, B14-FIELD-020, B14-FIELD-021] | UNAVAILABLE | In Review | Draft PR is not verification, acceptance, merge, deployment, or mirror currentness | B14-IDEMP-001 | HOLD | NONE | NONE | [B14-E-001, B14-E-011, B14-E-013] |
| B14-TRIGGER-005 | REPAIR_HEAD_UPDATE | Exact later repair head | prior head event, later source-head SHA, exact path boundary, and unchanged subject; no mirror read | [B14-FIELD-011, B14-FIELD-013, B14-FIELD-014, B14-FIELD-020, B14-FIELD-021] | UNAVAILABLE | In Review | Repair head does not erase prior head or imply verification, acceptance, or mirror currentness | B14-IDEMP-001 | CONFLICT | NONE | NONE | [B14-E-001, B14-E-013] |
| B14-TRIGGER-006 | INDEPENDENT_VERIFICATION | Exact independently routed verification result | verifier route, exact subject/head, evidence set, result, and ceiling; no mirror read | [B14-FIELD-018, B14-FIELD-020, B14-FIELD-021] | UNAVAILABLE | In Review | Verification is not acceptance, merge, execution, or mirror currentness | B14-IDEMP-001 | HOLD | NONE | NONE | [B14-E-001, B14-E-005, B14-E-008, B14-E-013] |
| B14-TRIGGER-007 | CONTROL_DISPOSITION | Exact controlling disposition evidence | exact decision identity, subject/head, B7 disposition, ceiling, authority boundary, and separate B1 acceptance evidence if acceptance_state is projected; no mirror read | [B14-FIELD-019, B14-FIELD-020, B14-FIELD-021, B14-FIELD-040] | UNAVAILABLE | In Review | Disposition is not integration, deployment, execution, exit, or mirror currentness; HOLD and REVISE never enter the acceptance domain | B14-IDEMP-001 | HOLD | NONE | NONE | [B14-E-003, B14-E-005, B14-E-008, B14-E-013, B14-E-014] |
| B14-TRIGGER-008 | SQUASH_MERGE | Exact immutable repository integration event | exact PR number, source-head SHA, integrated-main SHA, merged-at boundary, and repository relationship; no mirror read | [B14-FIELD-011, B14-FIELD-012, B14-FIELD-015, B14-FIELD-016, B14-FIELD-017, B14-FIELD-020, B14-FIELD-021] | UNAVAILABLE | Done | Done reports exact repository delivery/integration only; merge is not Control acceptance, deployment, activation, or mirror currentness | B14-IDEMP-001 | HOLD | NONE | NONE | [B14-E-001, B14-E-009, B14-E-013] |
| B14-TRIGGER-009 | REVERT_OR_LATER_REPOSITORY_EVENT | Exact later repository event compared with an older observed mirror | prior integration, later immutable event, event relationship, and older mirror observation boundary | [B14-FIELD-012, B14-FIELD-020, B14-FIELD-021, B14-FIELD-023, B14-FIELD-024, B14-FIELD-039] | STALE | In Review | Revert does not erase original integration, cancel acceptance, or establish mirror currentness | B14-IDEMP-001 | CONFLICT | NONE | NONE | [B14-E-001, B14-E-002, B14-E-009, B14-E-013] |
| B14-TRIGGER-010 | B13_REOPEN | B13 operation with explicit operation state | only COMPLETED may project: fresh authority and exact token, established current-state and transition evidence, COMPLETED exact named-axis effect, required integrity and decision evidence, and applicable receipt instances | [B14-FIELD-006, B14-FIELD-007, B14-FIELD-020, B14-FIELD-021, B14-FIELD-022, B14-FIELD-023, B14-FIELD-024] | UNAVAILABLE | In Progress | Reopen changes only its named B1 axis, restores no expired authority, and cannot project acceptance without separate controlling acceptance evidence | B14-IDEMP-001 | HOLD | NONE | NONE | [B14-E-003, B14-E-009, B14-E-013] |
| B14-TRIGGER-011 | B13_SUPERSESSION | B13 operation with explicit operation state | only COMPLETED may project: fresh authority and exact token, established current-state and transition evidence, COMPLETED exact-axis effect, required integrity and decision evidence, applicable receipt instances, named predecessor and replacement, accepted disposition, bidirectional links, currentness, and acyclic evidence | [B14-FIELD-020, B14-FIELD-021, B14-FIELD-022, B14-FIELD-023, B14-FIELD-024] | UNAVAILABLE | null | Chronology alone cannot establish currentness; Done additionally requires the separate exact repository delivery/integration prerequisite | B14-IDEMP-001 | HOLD | NONE | NONE | [B14-E-009, B14-E-013] |
| B14-TRIGGER-012 | MIRROR_ANOMALY | Canonical-to-mirror comparison detects anomaly | exact subject, canonical boundary, target mirror identity, observed updatedAt, mirror observation boundary, and discrepancy evidence | [B14-FIELD-023, B14-FIELD-024, B14-FIELD-039] | UNRESOLVED | null | Anomaly cannot alter canon, authorize repair, or establish mirror currentness | B14-IDEMP-001 | CONFLICT | NONE | NONE | [B14-E-002, B14-E-003, B14-E-013] |
| B14-TRIGGER-013 | PR_METADATA_UPDATE | Generic bounded PR metadata event | exact repository, PR number, source head, metadata field, and observation boundary; no repair-head or check evidence implied | [B14-FIELD-015, B14-FIELD-016, B14-FIELD-017, B14-FIELD-020, B14-FIELD-021] | UNAVAILABLE | In Review | Generic PR metadata cannot alter source_head_sha, check_verification_posture, acceptance, or mirror currentness | B14-IDEMP-001 | CONFLICT | NONE | NONE | [B14-E-001, B14-E-011, B14-E-013] |

## 8. Mirror Status Mapping

Linear display statuses map only to B1 axis 10 after canonical comparison.
They never imply routing, delivery, verification, acceptance, integration, or
activation.

A canonical event alone never establishes `CURRENT`. Without a bounded mirror
read, posture is `UNAVAILABLE` or `UNRESOLVED` as applicable. A later
canonical boundary compared with an older mirror observation is `STALE`.

| mapping_id | source_status | status_class | detection_inputs | canonical_effect | mirror_effect | required_handling | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B14-STATUS-001 | Backlog | LINEAR_WORKFLOW_DISPLAY | observed Linear status and exact subject join | NONE | planning display only | compare canon before classification | NONE | [B14-E-002, B14-E-003] |
| B14-STATUS-002 | Todo | LINEAR_WORKFLOW_DISPLAY | observed Linear status and exact subject join | NONE | planning display only | compare canon before classification | NONE | [B14-E-003] |
| B14-STATUS-003 | In Progress | LINEAR_WORKFLOW_DISPLAY | observed Linear status and exact subject join | NONE | work-display only | compare canon before classification | NONE | [B14-E-003] |
| B14-STATUS-004 | In Review | LINEAR_WORKFLOW_DISPLAY | observed Linear status and exact subject join | NONE | review-display only | compare canon before classification | NONE | [B14-E-003] |
| B14-STATUS-005 | Done | LINEAR_WORKFLOW_DISPLAY | exact PR number, source-head SHA, integrated-main SHA, and repository integration relationship | NONE | exact repository delivery/integration display only | never infer Control acceptance; B13 supersession requires this separate Done prerequisite | NONE | [B14-E-001, B14-E-003, B14-E-009] |
| B14-STATUS-006 | CURRENT | MIRROR_POSTURE | exact equality of every governed projected field at one current mirror observation boundary; after mutation, post-write readback plus proof that all protected and manual fields remained unchanged | NONE | mirror records bounded current comparison | preserve both canonical and mirror boundaries and recheck after any canonical change | NONE | [B14-E-002, B14-E-003, B14-E-013] |
| B14-STATUS-007 | STALE | MIRROR_POSTURE | later canonical boundary compared with an older mirror observation boundary | NONE | mark stale | hold overwrite until fresh comparison and authority | NONE | [B14-E-002, B14-E-003, B14-E-013] |
| B14-STATUS-008 | CONFLICTING | MIRROR_POSTURE | same scope/time values disagree | NONE | mark conflict | preserve both observations and HOLD | NONE | [B14-E-002, B14-E-003] |
| B14-STATUS-009 | MISSING_MIRROR | MIRROR_POSTURE | canonical subject has no exact mirror join | NONE | record missing mirror | require future create authority | NONE | [B14-E-002, B14-E-003] |
| B14-STATUS-010 | DUPLICATE_MIRROR | MIRROR_POSTURE | more than one exact mirror subject join | NONE | record all candidates | HOLD all candidates; no archive or delete | NONE | [B14-E-002, B14-E-003] |
| B14-STATUS-011 | ORPHANED_MIRROR | MIRROR_POSTURE | mirror subject lacks canonical join | NONE | retain historical record | HOLD; do not infer deletion | NONE | [B14-E-002, B14-E-003] |
| B14-STATUS-012 | AMBIGUOUS_CANONICAL_SOURCE | MIRROR_POSTURE | multiple controlling candidates or unresolved precedence | NONE | no projection | HOLD pending Control source selection | NONE | [B14-E-002, B14-E-004] |
| B14-STATUS-013 | PARTIAL_UPDATE | MIRROR_POSTURE | requested fields do not all confirm at one post-write boundary | NONE | record failure only | never claim synchronization; preserve idempotency key | NONE | [B14-E-003] |
| B14-STATUS-014 | UNAVAILABLE | MIRROR_POSTURE | required source, mirror, or observation boundary inaccessible | NONE | no projection | record unavailable without positive inference | NONE | [B14-E-006] |
| B14-STATUS-015 | UNRESOLVED | MIRROR_POSTURE | evidence is insufficient but not proved conflicting | NONE | no projection | preserve uncertainty and HOLD | NONE | [B14-E-006] |

## 9. Idempotency and Retry Contract

| idempotency_contract_id | protocol_version | source_identity_component | event_class_component | subject_coordinate_component | canonical_boundary_component | target_mirror_identity_component | key_serialization | read_before_write_required | prior_updated_at_required | atomic_compare_and_set_support | retry_behavior | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B14-IDEMP-001 | github-linear-mirror-protocol/v0 | exact canonical source event identity | exact canonical event class | Q3M7Y26-P1:B14 | event-specific serialization below | JAI-210 | protocol_version + source_identity + event_class + subject_coordinate + canonical_boundary + target_mirror_identity, UTF-8 byte-preserved in this exact order | true | true | UNAVAILABLE | same-key retry rereads the target, recognizes already-applied governed fields, preserves protected and manual fields, and applies nothing when concurrent authorship cannot be distinguished | [B14-E-001, B14-E-002, B14-E-003, B14-E-013] |

The stable logical-event key contains exactly six components in this order:
`protocol_version`, `source_identity`, `event_class`, `subject_coordinate`,
`canonical_boundary`, `target_mirror_identity`. Linear `updatedAt` and the
mirror observation boundary are concurrency evidence only and are never key
components.

Canonical-boundary serialization is event-specific and byte-preserved:

| event family | canonical_boundary serialization |
| --- | --- |
| FRESH_EXACT_LANE_ROUTE / ARTIFACT_AUTHORED_UNSTAGED | `base_sha:route_id` |
| BRANCH_COMMIT_PUSH / REPAIR_HEAD_UPDATE | `source_head_sha` |
| DRAFT_PR_DELIVERY / PR_METADATA_UPDATE | `repository#pr_number@source_head_sha` |
| INDEPENDENT_VERIFICATION / CONTROL_DISPOSITION | exact accepted decision or evidence boundary identifier |
| SQUASH_MERGE / REVERT_OR_LATER_REPOSITORY_EVENT | exact immutable integrated or later repository-event SHA |
| B13_REOPEN / B13_SUPERSESSION | exact B13 operation ID plus its COMPLETED evidence boundary |
| MIRROR_ANOMALY | exact compared canonical boundary |

Read-before-write and comparison with the previously observed Linear
`updatedAt` boundary are mandatory concurrency preconditions for any future
implementation. Repeated identical canonical input produces no additional
mutation. On same-key partial failure, the protocol rereads the target,
recognizes fields already applied under the same logical event, preserves all
protected and manual fields, and applies nothing if concurrent authorship
cannot be distinguished. Atomic compare-and-set support is `UNAVAILABLE`.
The protocol does not claim exactly-once execution, durable replay prevention,
or atomic cross-system mutation.

## 10. Concurrency and Partial-Failure Contract

| failure_id | condition | detection | handling | history_effect | success_claim | canonical_effect | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B14-FAIL-001 | IDENTICAL_REPLAY | same idempotency key and same projected values | NO_ACTION | PRESERVE | PROHIBITED_UNLESS_ALL_FIELDS_CONFIRMED | NONE | NONE | [B14-E-002, B14-E-003] |
| B14-FAIL-002 | CHANGED_CANONICAL_INPUT | same subject with later canonical boundary | APPEND_LATER_EVENT | APPEND_ONLY | PROHIBITED_UNLESS_ALL_FIELDS_CONFIRMED | NONE | NONE | [B14-E-001, B14-E-003] |
| B14-FAIL-003 | UPDATED_AT_MISMATCH | current Linear updatedAt differs from read boundary | CONFLICT | PRESERVE | PROHIBITED_UNLESS_ALL_FIELDS_CONFIRMED | NONE | NONE | [B14-E-002, B14-E-003] |
| B14-FAIL-004 | DUPLICATE_PROTOCOL_HISTORY_EVENT | exact B14 adaptation-history event for the same logical key already exists | NO_ACTION | PRESERVE | PROHIBITED_UNLESS_ALL_FIELDS_CONFIRMED | NONE | NONE | [B14-E-002] |
| B14-FAIL-005 | PARTIAL_MULTI_FIELD_FAILURE | any eligible field lacks confirmed post-write equality | HOLD | PRESERVE | PROHIBITED_UNLESS_ALL_FIELDS_CONFIRMED | NONE | NONE | [B14-E-003, B14-E-013] |
| B14-FAIL-006 | MALFORMED_IDENTITY | coordinate, SHA, PR join, or subject is invalid or ambiguous | HOLD | PRESERVE | PROHIBITED_UNLESS_ALL_FIELDS_CONFIRMED | NONE | NONE | [B14-E-004] |
| B14-FAIL-007 | UNAVAILABLE_EVIDENCE | required canonical or mirror evidence cannot be obtained | HOLD | PRESERVE | PROHIBITED_UNLESS_ALL_FIELDS_CONFIRMED | NONE | NONE | [B14-E-006] |
| B14-FAIL-008 | RETRY_AFTER_FAILURE | same-key prior attempt failed without complete confirmed equality; reread must distinguish already-applied values from concurrent authorship | HOLD | PRESERVE | PROHIBITED_UNLESS_ALL_FIELDS_CONFIRMED | NONE | NONE | [B14-E-003, B14-E-013] |

No future implementation may silently overwrite concurrent or unexpected
Linear changes. Partial multi-field failure remains `PARTIAL_UPDATE` and
cannot claim successful synchronization. Duplicate handling is limited to the
protocol-owned adaptation-history event. It never implies mutation of
comments, documents, attachments, relationships, archive state, or deletion.

## 11. Drift, Conflict, Duplication, and Orphan Handling

Sections 7, 8, and 10 jointly define every required posture: `CURRENT`,
`STALE`, `CONFLICTING`, `MISSING_MIRROR`, `DUPLICATE_MIRROR`,
`ORPHANED_MIRROR`, `AMBIGUOUS_CANONICAL_SOURCE`, `PARTIAL_UPDATE`,
`UNAVAILABLE`, and `UNRESOLVED`.

For every posture, canonical effect and authority effect are `NONE`.
Duplicates, conflicts, missing coordinates, malformed SHAs, ambiguous
subjects, stale observation boundaries, and unavailable evidence fail closed.
No mirror record is automatically created, archived, deleted, relinked, or
rewritten.

## 12. History, Revert, Reopen, and Supersession Handling

| history_event_id | history_event_class | event_state | canonical_event_id | source_head_sha | integrated_main_sha | canonical_event_time | mirror_observation_boundary | mirror_history_effect | predecessor_id_requirement | replacement_id_requirement | completed_prerequisites | prohibited_behavior | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B14-HISTORY-001 | MERGE | UNRESOLVED_DOCUMENTARY | null | null | null | null | null | APPEND_ONLY | null | null | exact PR, source-head SHA, integrated-main SHA, repository relationship, and canonical event time | do not infer Control acceptance or erase source-head history | NONE | [B14-E-001, B14-E-009] |
| B14-HISTORY-002 | REVERT | UNRESOLVED_DOCUMENTARY | null | null | null | null | null | PRESERVE_AND_APPEND | null | null | exact later immutable repository event linked to the original integration | do not overwrite the original integrated-main SHA or silently mark rejected | NONE | [B14-E-001, B14-E-009] |
| B14-HISTORY-003 | LATER_REPOSITORY_EVENT | UNRESOLVED_DOCUMENTARY | null | null | null | null | null | APPEND_ONLY | null | null | exact later immutable event and relation to the prior event | do not rewrite chronology into currentness or replace prior event values | NONE | [B14-E-001, B14-E-009] |
| B14-HISTORY-004 | REOPEN | UNRESOLVED_DOCUMENTARY | null | null | null | null | null | PRESERVE_AND_APPEND | null | null | B13 operation state COMPLETED with fresh authority and exact token, established current-state and transition evidence, named-axis effect COMPLETED_EXACT_AXIS_ONLY, required integrity and decision evidence, and applicable receipt instances | do not restore expired route, token, or authority; do not change another B1 axis or acceptance state | NONE | [B14-E-003, B14-E-009] |
| B14-HISTORY-005 | SUPERSESSION | UNRESOLVED_DOCUMENTARY | null | null | null | null | null | PRESERVE_AND_APPEND | exact named predecessor required | exact named replacement required | B13 operation state COMPLETED with fresh authority and exact token, established current-state and transition evidence, exact-axis effect, required integrity and decision evidence, applicable receipt instances, accepted disposition, established currentness, bidirectional links, and acyclic evidence | do not delete predecessor, infer supersession from chronology, or display Done without separate repository delivery/integration evidence | NONE | [B14-E-009] |

Linear records must not be silently deleted or overwritten to imitate
rollback, reopen, or supersession. Predecessor and replacement histories
remain preserved. Every established history event is a distinct record that
byte-preserves its source-head SHA, integrated-main SHA, canonical event time,
and mirror observation boundary. A later event or revert appends a new record
and never replaces the original integrated-main SHA.

### B13 Operation-State Boundary

| B13 operation state | B14 projection effect |
| --- | --- |
| PROPOSED | none; documentary proposal is not authority or performance |
| AUTHORIZED | none; authority to attempt is not evidence of completion |
| COMPLETED | eligible only after every applicable B13 COMPLETED prerequisite is established |

For reopen, `COMPLETED` changes only the named B1 axis. It produces no
acceptance-state projection without separate controlling B1 acceptance
evidence. For supersession, `COMPLETED` establishes no Linear `Done` display
unless the separate exact repository delivery/integration prerequisite is
also satisfied.

## 13. Receipt and Integrity Boundary

| receipt_boundary_id | receipt_class_id | receipt_instance_id | issuance_state | integrity_state | authenticity_state | decision_evidence_state | durability_posture | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B14-RECEIPT-001 | B9-CLASS-013 | null | NOT_ISSUED | UNVERIFIED | NOT_ESTABLISHED | NOT_ESTABLISHED | UNAVAILABLE | NONE | [B14-E-007, B14-E-008] |

`B9-CLASS-013 / MIRROR_RECEIPT` is the exact available classification. This
fixture does not issue an instance. A future MIRROR_RECEIPT requires fresh
exact mirror-mutation authority plus comparison with controlling canonical
evidence. A mirror update record or link is not an
acceptance, lifecycle-transition, or execution receipt; proof of authenticity,
durable persistence, replay prevention, or exactly-once processing; or an
authority grant.

## 14. Sensitive-Data and Publication Boundary

| sensitive_boundary_id | allowed_content | prohibited_content | public_sha_exception | repository_wide_absence_claim | redaction_requirement | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B14-SENSITIVE-001 | exact coordinates, role, route, repository, public commit SHAs, branch, artifact paths, public PR metadata, bounded status, checks, acceptance posture, evidence links, and adaptation history | credentials, secrets, tokens, cookies, environment values, raw HMAC/signature/proof/hash/fingerprint material beyond public commit SHAs, actor emails, private identities, private payloads, and network-response bodies | public repository commit SHAs only | PROHIBITED | FAIL_CLOSED_BEFORE_PUBLICATION | NONE | [B14-E-006, B14-E-010, B14-E-011] |

## 15. Safe Non-Mutating Documentary Fixture

The registries in sections 6-14 form the complete safe fixture. Its root,
subject, and current event are:

| record_type | ordered field values |
| --- | --- |
| mirror_protocol_record | B14-PROTOCOL-001; github-linear-mirror-protocol/v0; CANONICAL_GITHUB_AND_ACCEPTED_CONTROL_EVIDENCE_TO_MUTABLE_LINEAR_PLANNING_AND_STATUS_MIRROR; B14-SUBJECT-001; [B14-EVENT-001]; [B14-FIELD-001, B14-FIELD-002, B14-FIELD-003, B14-FIELD-004, B14-FIELD-005, B14-FIELD-006, B14-FIELD-007, B14-FIELD-008, B14-FIELD-009, B14-FIELD-010, B14-FIELD-011, B14-FIELD-012, B14-FIELD-013, B14-FIELD-014, B14-FIELD-015, B14-FIELD-016, B14-FIELD-017, B14-FIELD-018, B14-FIELD-019, B14-FIELD-020, B14-FIELD-021, B14-FIELD-022, B14-FIELD-023, B14-FIELD-024, B14-FIELD-025, B14-FIELD-026, B14-FIELD-027, B14-FIELD-028, B14-FIELD-029, B14-FIELD-030, B14-FIELD-031, B14-FIELD-032, B14-FIELD-033, B14-FIELD-034, B14-FIELD-035, B14-FIELD-036, B14-FIELD-037, B14-FIELD-038, B14-FIELD-039, B14-FIELD-040]; [B14-TRIGGER-001, B14-TRIGGER-002, B14-TRIGGER-003, B14-TRIGGER-004, B14-TRIGGER-005, B14-TRIGGER-006, B14-TRIGGER-007, B14-TRIGGER-008, B14-TRIGGER-009, B14-TRIGGER-010, B14-TRIGGER-011, B14-TRIGGER-012, B14-TRIGGER-013]; [B14-STATUS-001, B14-STATUS-002, B14-STATUS-003, B14-STATUS-004, B14-STATUS-005, B14-STATUS-006, B14-STATUS-007, B14-STATUS-008, B14-STATUS-009, B14-STATUS-010, B14-STATUS-011, B14-STATUS-012, B14-STATUS-013, B14-STATUS-014, B14-STATUS-015]; B14-IDEMP-001; [B14-FAIL-001, B14-FAIL-002, B14-FAIL-003, B14-FAIL-004, B14-FAIL-005, B14-FAIL-006, B14-FAIL-007, B14-FAIL-008]; [B14-HISTORY-001, B14-HISTORY-002, B14-HISTORY-003, B14-HISTORY-004, B14-HISTORY-005]; B14-RECEIPT-001; B14-SENSITIVE-001; [B14-E-001, B14-E-002, B14-E-003, B14-E-004, B14-E-005, B14-E-006, B14-E-007, B14-E-008, B14-E-009, B14-E-010, B14-E-011, B14-E-012, B14-E-013, B14-E-014]; [B14-RES-001]; UNRESOLVED_DOCUMENTARY; false; NONE |
| mirror_subject_record | B14-SUBJECT-001; Q3M7Y26-P1; B; B-D; Q3M7Y26-P1:B14; JAI::DEV::BUILDER; CT-2026-07-28-Q3M7Y26-P1-START-B14-GITHUB-LINEAR-MIRROR-PROTOCOL-v0; jai-nexus/dev-jai-nexus; cbc547bf2ad0022bdc27263cc655d488215afeb4; docs/q3m7y26-p1-b14-github-linear-mirror-protocol-v0; JAI-210; [B14-E-001, B14-E-002, B14-E-003, B14-E-004, B14-E-005, B14-E-006, B14-E-007, B14-E-008, B14-E-009, B14-E-010, B14-E-011, B14-E-012, B14-E-013, B14-E-014] |
| canonical_event_record | B14-EVENT-001; FRESH_EXACT_LANE_ROUTE; B14-SUBJECT-001; CT-2026-07-28-Q3M7Y26-P1-START-B14-GITHUB-LINEAR-MIRROR-PROTOCOL-v0; CT-2026-07-28-Q3M7Y26-P1-START-B14-GITHUB-LINEAR-MIRROR-PROTOCOL-v0; jai-nexus/dev-jai-nexus; cbc547bf2ad0022bdc27263cc655d488215afeb4; null; null; null; null; null; CONTROL_THREAD_ROUTE_OBSERVATION_2026-07-28; null; [https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md, https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md, https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md, https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b5-role-authority-matrix-v0.md, https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b7-decision-token-disposition-canon-v0.md]; UNRESOLVED; NOT_ACCEPTED; [B14-E-003, B14-E-004, B14-E-005, B14-E-012, B14-E-013, B14-E-014] |

Every fixture array explicitly lists its members in ascending ID order. No
projection action, external read, write, receipt, or mutation occurred.

## 16. Invalid Examples

| invalid_id | invalid input | fail-closed result |
| --- | --- | --- |
| B14-INV-001 | Linear status treated as B1 acceptance or integration | REJECT |
| B14-INV-002 | Linear-origin difference overwrites canonical evidence | HOLD |
| B14-INV-003 | Missing or malformed full coordinate | HOLD |
| B14-INV-004 | Malformed base, head, or integrated SHA | HOLD |
| B14-INV-005 | Duplicate exact mirror subjects | CONFLICT |
| B14-INV-006 | Mirror subject has no canonical join | HOLD |
| B14-INV-007 | Multiple controlling canonical candidates | HOLD |
| B14-INV-008 | Stale observed updatedAt boundary | CONFLICT |
| B14-INV-009 | Partial field update claims synchronization | REJECT |
| B14-INV-010 | Retry changes idempotency key without canonical change | REJECT |
| B14-INV-011 | Identical input creates a duplicate protocol-owned adaptation-history event | REJECT |
| B14-INV-012 | Founder/manual title or planning field overwritten | REJECT |
| B14-INV-013 | Comment, document, archive, or deletion changed automatically | REJECT |
| B14-INV-014 | Merge interpreted as CONTROL_THREAD acceptance | REJECT |
| B14-INV-015 | Done interpreted as verification, acceptance, or activation | REJECT |
| B14-INV-016 | Revert erases prior merge evidence | REJECT |
| B14-INV-017 | Reopen restores expired authority | REJECT |
| B14-INV-018 | Supersession lacks named replacement or bidirectional links | HOLD |
| B14-INV-019 | Mirror record treated as issued B9/B10 receipt | REJECT |
| B14-INV-020 | Sensitive or private content enters projection | HOLD |

## 17. Implementation Reconciliation

| source surface | classification | bounded conclusion |
| --- | --- | --- |
| A2 precedence canon | STATIC_CONFIGURATION | Controlling, corroborating, stale, conflicting, and unavailable evidence remain source-classified and fail closed. |
| A7 PR and commit ledger | STATIC_CONFIGURATION | Immutable repository events and mutable PR metadata remain distinct; neither creates acceptance. |
| A12 Linear audit | STATIC_CONFIGURATION | Prior bounded drift and duplication evidence demonstrates mirror-only comparison, not mutation authority. |
| B1 mirror axis | STATIC_CONFIGURATION | Mirror states are orthogonal and non-authoritative. |
| B2 coordinates | STATIC_CONFIGURATION | Full coordinate is identity; Linear ID is a separate mirror namespace. |
| B5 role canon | STATIC_CONFIGURATION | Roles and mechanical surfaces do not self-expand authority. |
| B7 decision canon | STATIC_CONFIGURATION | ACCEPT, HOLD, REVISE, REJECT, and UNRESOLVED remain decision dispositions and do not collapse into the B1 acceptance axis. |
| B8 evidence schema | STATIC_CONFIGURATION | Freshness, contradiction, unavailable, and sensitive boundaries remain explicit. |
| B9/B10 receipts | STATIC_CONFIGURATION | MIRROR_RECEIPT is a class only; no instance or integrity is established. |
| B13 history canon | STATIC_CONFIGURATION | Merge, revert, reopen, and supersession append history without erasure. |
| role-guardrails workflow | STATIC_CONFIGURATION | PR role/path/evidence admission is mechanical and not acceptance. |
| PR template | STATIC_CONFIGURATION | Role, evidence, risk, and handoff fields guide PR metadata only. |
| JAI-210 | MIRROR_ONLY | CONTROL_THREAD_UPDATED_IN_PROGRESS_2026-07-28 / CODEX_FILE_EXECUTION_NOT_ACCESSED_OR_REFRESHED; non-controlling route evidence only. |

No executable synchronization implementation, connector, credential,
transport, persistence layer, replay store, or cross-system transaction was
observed or created by B14.

## 18. Evidence Pointer Registry

| evidence_id | source_class | immutability | reference | claim | observation_boundary |
| --- | --- | --- | --- | --- | --- |
| B14-E-001 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-a7-pr-commit-evidence-ledger-v0.md | PR, commit, integration, check, and acceptance separation | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-002 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-a12-linear-drift-duplication-audit-v0.md | Mirror drift, duplication, source precedence, and safe publication | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-003 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md | Mirror axis, lifecycle separation, and fail-closed transitions | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-004 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md | Coordinate identity and mirror namespace separation | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-005 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b5-role-authority-matrix-v0.md | Role, authority, separation-of-duty, and mechanical-surface boundaries | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-006 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b8-evidence-bundle-schema-v0.md | Evidence, freshness, contradiction, unavailable, and sensitive boundaries | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-007 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b9-receipt-taxonomy-v0.md | B9-CLASS-013 MIRROR_RECEIPT classification and non-receipt boundaries | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-008 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b10-acceptance-receipt-integrity-schema-v0.md | Receipt issuance and integrity value domains | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-009 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b13-rollback-reopen-supersession-canon-v0.md | History preservation, revert, reopen, and supersession rules | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-010 | STATIC_CONFIGURATION | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/.github/workflows/role-guardrails.yml | Mechanical PR role, path, and evidence admission | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-011 | STATIC_CONFIGURATION | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/.github/PULL_REQUEST_TEMPLATE.md | Static PR role, evidence, risk, and handoff fields | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-012 | CONTROL_THREAD_SUPPLIED_MIRROR_OBSERVATION | MUTABLE_CORROBORATING | Linear JAI-210 | CONTROL_THREAD_UPDATED_IN_PROGRESS_2026-07-28 / CODEX_FILE_EXECUTION_NOT_ACCESSED_OR_REFRESHED | MIRROR_ONLY / NON_CONTROLLING / B14_ROUTE_OBSERVATION_ONLY |
| B14-E-013 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md | Source precedence, freshness, conflict, supersession, and unavailable-evidence rules | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |
| B14-E-014 | REPOSITORY_CANON | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/cbc547bf2ad0022bdc27263cc655d488215afeb4/docs/reference/q3m7y26-p1-b7-decision-token-disposition-canon-v0.md | Exact decision disposition domain and fail-closed disposition boundary | base cbc547bf2ad0022bdc27263cc655d488215afeb4 |

Immutable evidence records: 13. Mutable corroborating records: 1.

## 19. Deterministic Serialization

- Record types serialize in B14-TYPE ascending order.
- Fields serialize by declared ordinal.
- Records within each type sort by ascending record ID.
- Arrays preserve declared order; ID arrays use ascending ID order unless an
  exact source order is required and stated.
- The idempotency key uses the exact component order declared in section 9.
- Null is allowed only where explicitly declared.
- No inferred defaults are permitted.
- Unknown keys, duplicate IDs, invalid enums, malformed SHAs, unresolved
  references, ambiguous coordinates, or undeclared fields fail closed.

## 20. Separate B15 Reservation

| reservation_id | reserved_lane | reserved_subject | execution_authority |
| --- | --- | --- | --- |
| B14-RES-001 | B15 | LIFECYCLE_CANON_VERIFICATION_AND_BATCH_B_CLOSEOUT | NOT_GRANTED |

B14 does not independently verify itself, accept B14, close Batch B, route D9,
or create exit evidence.

## 21. Risks, Rollback, and Recommendation

Risks are source-precedence inversion, stale mirror overwrite, duplicate
side effects, partial-update overclaim, manual-field loss, sensitive-data
publication, and history erasure. Every risk fails closed to `HOLD`,
`CONFLICT`, `PRESERVE`, or `NO_ACTION`.

Documentary rollback is a later separately authorized repository revert or
repair that preserves this artifact's history. No Linear, runtime, database,
provider, or external-system rollback is authorized or required by this
document.

Recommendation: independently verify this schema, its 40 field ownership
rules, 13 triggers, 15 status mappings, idempotency boundary, B13 history
alignment, evidence resolution, and non-authorizations before any B14
acceptance decision. Any implementation or Linear mutation requires a
separate exact future route.

## 22. Final Audit and Explicit Non-Authorizations

| check | result |
| --- | --- |
| Record types and Field Registry | PASS - 13 types / 145 aligned fields |
| Primary identifiers | PASS - 13 unique primary IDs |
| Safe fixture/schema coherence | PASS - exact field counts; UNRESOLVED_DOCUMENTARY / mutation false |
| Local and predecessor joins | PASS - 0 unresolved or duplicate local definitions; exact B9/B10 joins |
| Field ownership completeness | PASS - 40 fields across 5 ownership classes |
| Update trigger completeness | PASS - 13 unique events; no source-only CURRENT; canonical and authority effects NONE |
| Status mapping non-authority | PASS - 5 workflow displays plus 10 mirror postures; effects NONE |
| Idempotency and retry | PASS - exact 6-component logical key, B14-IDEMP-001 joined by all 13 triggers, updatedAt excluded from key, read-before-write, same-key partial reconciliation, atomic compare-and-set UNAVAILABLE |
| Concurrency and partial failure | PASS - 8 fail-closed conditions; no partial-success claim |
| Drift/conflict/duplicate/orphan coverage | PASS - all 10 required postures defined |
| Evidence IDs defined and used | PASS - 14/14 |
| Immutable paths resolved | PASS - 13/13 at required base |
| Sensitive-data boundary | PASS - bounded metadata only; repository-wide absence claim prohibited |
| Positive authority or synchronization grants | PASS - 0 |
| B15 absorption | PASS - 0; one separate reservation |
| Whitespace and one-path scope | PASS - git diff --check exit 0; no-index raw exit 1 with zero diagnostics |

No staging, commit, push, PR, ready conversion, merge, deployment, branch
deletion, GitHub mutation, Linear mutation, connector execution, automated
synchronization, acceptance, Batch exit, Program exit, D9 execution, runtime,
database, provider/model/API dispatch, Agent, Council, customer effect,
authority transfer, or JAI activation is authorized or performed.

B14_MAXIMUM_CURRENT_CREDIT:
DOCUMENTATION_GITHUB_LINEAR_MIRROR_PROTOCOL_ONLY

B14_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B14_MERGE_AUTHORITY: NOT_GRANTED
B15_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B14R1
