# Q3M7Y26-P1 B8 Evidence Bundle Schema v0

## Status
| field | value |
| --- | --- |
| Role | JAI::DEV::BUILDER |
| Coordinate | Q3M7Y26-P1:B8 |
| Lane / relationship | P1-B-LANE-08 / P1-REL-013 |
| Route | CT-2026-07-27-Q3M7Y26-P1-START-B8-EVIDENCE-BUNDLE-SCHEMA-v0 |
| Base | 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| Credit ceiling | DOCUMENTATION_EVIDENCE_BUNDLE_SCHEMA_ONLY |

## Purpose and Evidence Rules
An evidence bundle assembles bounded evidence without becoming a receipt,
acceptance decision, integrity proof, capability credit, route, Work Packet,
decision token, execution credential, or source-of-truth transfer. Completeness,
assembly, validation, and source resolution cannot make it authoritative.

Each item contains one normalized factual claim, exact subject/coordinate binding,
source provenance, ceiling, separated observation and validation, and no
authority effect. Independent verification, acceptance, receipt, integrity, and
external effect remain separate. Missing evidence is UNAVAILABLE, contradictions
preserve both sides, chronology is never supersession, and absence is never
inferred from a missing event, record, import, call, or visible side effect.

A2 observed_status vocabulary is exactly:
ACCEPTED_CURRENT | RATIFIED_PHASE_SPECIFIC | LEGACY | STATIC_CONFIGURATION |
PLACEHOLDER | MOCK | DEFERRED | DISABLED | MIRROR_ONLY | UNAVAILABLE |
CONTRADICTORY | UNRESOLVED.

## Canonical Record Types
| type_id | record_type | field_count | ordinals |
| --- | --- | --- | --- |
| B8-TYPE-01 | evidence_bundle_record | 16 | 1-16 |
| B8-TYPE-02 | bundle_subject_record | 8 | 1-8 |
| B8-TYPE-03 | bundle_coordinates_record | 12 | 1-12 |
| B8-TYPE-04 | evidence_requirement_binding_record | 11 | 1-11 |
| B8-TYPE-05 | evidence_item_record | 12 | 1-12 |
| B8-TYPE-06 | evidence_source_record | 11 | 1-11 |
| B8-TYPE-07 | evidence_observation_record | 10 | 1-10 |
| B8-TYPE-08 | validation_result_record | 10 | 1-10 |
| B8-TYPE-09 | contradiction_assessment_record | 9 | 1-9 |
| B8-TYPE-10 | freshness_record | 9 | 1-9 |
| B8-TYPE-11 | sensitive_data_boundary_record | 9 | 1-9 |
| B8-TYPE-12 | bundle_disposition_record | 11 | 1-11 |
| B8-TYPE-13 | non_authorization_record | 6 | 1-6 |

## Canonical Field Registry
Fields serialize in ordinal order. Unknown or duplicate keys, missing required
fields, invalid enums, and unresolved references fail closed.

| record_type | ordinal | field_name | value_type | cardinality | required_or_nullable | identifier_or_reference_rule |
| --- | --- | --- | --- | --- | --- | --- |
| evidence_bundle_record | 1 | bundle_id | identifier | 1 | required | bundle_id is the unique primary ID for evidence_bundle_record |
| evidence_bundle_record | 2 | schema_version | string | 1 | required | schema version is one exact bounded scalar; no default is inferred |
| evidence_bundle_record | 3 | subject_id | reference<bundle_subject_record> | 1 | required | subject_id resolves exactly once to the declared target |
| evidence_bundle_record | 4 | coordinates_id | reference<bundle_coordinates_record> | 1 | required | coordinates_id resolves exactly once to the declared target |
| evidence_bundle_record | 5 | requirement_binding_ids | ordered array<reference<evidence_requirement_binding_record>> | 0..* | required | requirement_binding_ids resolves exactly once to the declared target |
| evidence_bundle_record | 6 | evidence_item_ids | ordered array<reference<evidence_item_record>> | 0..* | required | evidence_item_ids resolves exactly once to the declared target |
| evidence_bundle_record | 7 | source_ids | ordered array<reference<evidence_source_record>> | 0..* | required | source_ids resolves exactly once to the declared target |
| evidence_bundle_record | 8 | observation_ids | ordered array<reference<evidence_observation_record>> | 0..* | required | observation_ids resolves exactly once to the declared target |
| evidence_bundle_record | 9 | validation_result_ids | ordered array<reference<validation_result_record>> | 0..* | required | validation_result_ids resolves exactly once to the declared target |
| evidence_bundle_record | 10 | contradiction_ids | ordered array<reference<contradiction_assessment_record>> | 0..* | required | contradiction_ids resolves exactly once to the declared target |
| evidence_bundle_record | 11 | freshness_id | reference<freshness_record> | 1 | required | freshness_id resolves exactly once to the declared target |
| evidence_bundle_record | 12 | sensitive_boundary_id | reference<sensitive_data_boundary_record> | 1 | required | sensitive_boundary_id resolves exactly once to the declared target |
| evidence_bundle_record | 13 | disposition_id | reference<bundle_disposition_record> | 1 | required | disposition_id resolves exactly once to the declared target |
| evidence_bundle_record | 14 | non_authorization_ids | ordered array<reference<non_authorization_record>> | 0..* | required | non_authorization_ids resolves exactly once to the declared target |
| evidence_bundle_record | 15 | base_sha | lowercase_sha40 | 1 | required | must byte-match the fixture base SHA exactly |
| evidence_bundle_record | 16 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 0..* | required | evidence_pointer_ids preserves declared order; every nonempty member resolves once |
| bundle_subject_record | 1 | subject_id | identifier | 1 | required | subject_id is the unique primary ID for bundle_subject_record |
| bundle_subject_record | 2 | subject_kind | enum<SUBJECT_KIND_VOCABULARY> | 1 | required | subject_kind must match its closed declared vocabulary |
| bundle_subject_record | 3 | program_id | reference<B2 accepted program identity> | 1 | required | program_id resolves exactly once to the declared target |
| bundle_subject_record | 4 | program_code | string | 1 | required | program code is one exact bounded scalar; no default is inferred |
| bundle_subject_record | 5 | batch_id | reference<B4 batch_record> | 1 | required | batch_id resolves exactly once to the declared target |
| bundle_subject_record | 6 | wave_id | reference<B4 wave_record> | 1 | required | wave_id resolves exactly once to the declared target |
| bundle_subject_record | 7 | lane_id | reference<B4 lane_record> | 1 | required | lane_id resolves exactly once to the declared target |
| bundle_subject_record | 8 | subject_boundary | string | 1 | required | subject boundary is one exact bounded scalar; no default is inferred |
| bundle_coordinates_record | 1 | coordinates_id | identifier | 1 | required | coordinates_id is the unique primary ID for bundle_coordinates_record |
| bundle_coordinates_record | 2 | program_id | reference<B2 accepted program identity> | 1 | required | program_id resolves exactly once to the declared target |
| bundle_coordinates_record | 3 | program_code | string | 1 | required | program code is one exact bounded scalar; no default is inferred |
| bundle_coordinates_record | 4 | batch_id | reference<B4 batch_record> | 1 | required | batch_id resolves exactly once to the declared target |
| bundle_coordinates_record | 5 | wave_id | reference<B4 wave_record> | 1 | required | wave_id resolves exactly once to the declared target |
| bundle_coordinates_record | 6 | lane_id | reference<B4 lane_record> | 1 | required | lane_id resolves exactly once to the declared target |
| bundle_coordinates_record | 7 | relationship_id | reference<B4 parent_child_relationship> | 1 | required | relationship_id resolves exactly once to the declared target |
| bundle_coordinates_record | 8 | repository | string | 1 | required | repository is one exact bounded scalar; no default is inferred |
| bundle_coordinates_record | 9 | base_sha | lowercase_sha40 | 1 | required | must byte-match the fixture base SHA exactly |
| bundle_coordinates_record | 10 | head_sha | lowercase_sha40 or null | 0..1 | nullable | null records no head; missing is invalid |
| bundle_coordinates_record | 11 | branch | string | 1 | required | branch is one exact bounded scalar; no default is inferred |
| bundle_coordinates_record | 12 | path_allowlist | ordered array<exact repository path> | 1..* | required | paths are exact, ordered, and reject wildcards |
| evidence_requirement_binding_record | 1 | binding_id | identifier | 1 | required | binding_id is the unique primary ID for evidence_requirement_binding_record |
| evidence_requirement_binding_record | 2 | b6_requirement_reference | reference<B6 evidence_requirement_record> | 1 | required | b6_requirement_reference resolves exactly once to the declared target |
| evidence_requirement_binding_record | 3 | required | boolean | 1 | required | must be true or false exactly |
| evidence_requirement_binding_record | 4 | evidence_class | enum<EVIDENCE_CLASS_VOCABULARY> | 1 | required | evidence_class must match its closed declared vocabulary |
| evidence_requirement_binding_record | 5 | producer_role | reference<B5 portable_role_record> | 1 | required | producer_role resolves exactly once to the declared target |
| evidence_requirement_binding_record | 6 | consumer_gate | string | 1 | required | consumer gate is one exact bounded scalar; no default is inferred |
| evidence_requirement_binding_record | 7 | content_boundary | string | 1 | required | content boundary is one exact bounded scalar; no default is inferred |
| evidence_requirement_binding_record | 8 | sensitive_data_rule | string | 1 | required | sensitive data rule is one exact bounded scalar; no default is inferred |
| evidence_requirement_binding_record | 9 | satisfaction_state | enum<SATISFACTION_STATE_VOCABULARY> | 1 | required | satisfaction_state must match its closed declared vocabulary |
| evidence_requirement_binding_record | 10 | evidence_item_ids | ordered array<reference<evidence_item_record>> | 0..* | required | evidence_item_ids resolves exactly once to the declared target |
| evidence_requirement_binding_record | 11 | unresolved_reason | string | 1 | required | unresolved reason is one exact bounded scalar; no default is inferred |
| evidence_item_record | 1 | item_id | identifier | 1 | required | item_id is the unique primary ID for evidence_item_record |
| evidence_item_record | 2 | normalized_claim | string | 1 | required | normalized claim is one exact bounded scalar; no default is inferred |
| evidence_item_record | 3 | source_id | reference<evidence_source_record> | 1 | required | source_id resolves exactly once to the declared target |
| evidence_item_record | 4 | observation_id | reference<evidence_observation_record> | 1 | required | observation_id resolves exactly once to the declared target |
| evidence_item_record | 5 | validation_result_ids | ordered array<reference<validation_result_record>> | 0..* | required | validation_result_ids resolves exactly once to the declared target |
| evidence_item_record | 6 | subject_id | reference<bundle_subject_record> | 1 | required | subject_id resolves exactly once to the declared target |
| evidence_item_record | 7 | temporal_scope | string | 1 | required | temporal scope is one exact bounded scalar; no default is inferred |
| evidence_item_record | 8 | observed_status | enum<OBSERVED_STATUS_VOCABULARY> | 1 | required | observed_status must match its closed declared vocabulary |
| evidence_item_record | 9 | inclusion_state | enum<INCLUSION_STATE_VOCABULARY> | 1 | required | inclusion_state must match its closed declared vocabulary |
| evidence_item_record | 10 | sensitive_data_state | enum<SENSITIVE_DATA_STATE_VOCABULARY> | 1 | required | sensitive_data_state must match its closed declared vocabulary |
| evidence_item_record | 11 | authority_effect | literal<NONE> | 1 | required | must equal NONE; the record cannot grant authority |
| evidence_item_record | 12 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 0..* | required | evidence_pointer_ids preserves declared order; every nonempty member resolves once |
| evidence_source_record | 1 | source_id | identifier | 1 | required | source_id is the unique primary ID for evidence_source_record |
| evidence_source_record | 2 | source_kind | enum<SOURCE_KIND_VOCABULARY> | 1 | required | source_kind must match its closed declared vocabulary |
| evidence_source_record | 3 | immutability | enum<IMMUTABILITY_VOCABULARY> | 1 | required | immutability must match its closed declared vocabulary |
| evidence_source_record | 4 | repository_or_object | string | 1 | required | repository or object is one exact bounded scalar; no default is inferred |
| evidence_source_record | 5 | commit_or_observation_boundary | string | 1 | required | commit or observation boundary is one exact bounded scalar; no default is inferred |
| evidence_source_record | 6 | access_posture | string | 1 | required | access posture is one exact bounded scalar; no default is inferred |
| evidence_source_record | 7 | evidence_ceiling | string | 1 | required | evidence ceiling is one exact bounded scalar; no default is inferred |
| evidence_source_record | 8 | authority_effect | literal<NONE> | 1 | required | must equal NONE; the record cannot grant authority |
| evidence_source_record | 9 | reference | evidence_pointer_id | 1 | required | reference uses the declared bounded value rule |
| evidence_source_record | 10 | source_claim | string | 1 | required | source claim is one exact bounded scalar; no default is inferred |
| evidence_source_record | 11 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 0..* | required | evidence_pointer_ids preserves declared order; every nonempty member resolves once |
| evidence_observation_record | 1 | observation_id | identifier | 1 | required | observation_id is the unique primary ID for evidence_observation_record |
| evidence_observation_record | 2 | source_id | reference<evidence_source_record> | 1 | required | source_id resolves exactly once to the declared target |
| evidence_observation_record | 3 | observed_claim | string | 1 | required | observed claim is one exact bounded scalar; no default is inferred |
| evidence_observation_record | 4 | observation_boundary | string | 1 | required | observation boundary is one exact bounded scalar; no default is inferred |
| evidence_observation_record | 5 | query_or_command | string or null | 0..1 | nullable | null is allowed only when no query or command applies; missing is invalid |
| evidence_observation_record | 6 | observed_status | enum<OBSERVED_STATUS_VOCABULARY> | 1 | required | observed_status must match its closed declared vocabulary |
| evidence_observation_record | 7 | scope_limit | string | 1 | required | scope limit is one exact bounded scalar; no default is inferred |
| evidence_observation_record | 8 | temporal_limit | string | 1 | required | temporal limit is one exact bounded scalar; no default is inferred |
| evidence_observation_record | 9 | inference_prohibitions | string | 1 | required | inference prohibitions is one exact bounded scalar; no default is inferred |
| evidence_observation_record | 10 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 0..* | required | evidence_pointer_ids preserves declared order; every nonempty member resolves once |
| validation_result_record | 1 | validation_id | identifier | 1 | required | validation_id is the unique primary ID for validation_result_record |
| validation_result_record | 2 | validation_class | enum<VALIDATION_CLASS_VOCABULARY> | 1 | required | validation_class must match its closed declared vocabulary |
| validation_result_record | 3 | status | enum<STATUS_VOCABULARY> | 1 | required | status must match its closed declared vocabulary |
| validation_result_record | 4 | subject_id | reference<bundle_subject_record> | 1 | required | subject_id resolves exactly once to the declared target |
| validation_result_record | 5 | evidence_item_ids | ordered array<reference<evidence_item_record>> | 0..* | required | evidence_item_ids resolves exactly once to the declared target |
| validation_result_record | 6 | command_or_method | string | 1 | required | command or method is one exact bounded scalar; no default is inferred |
| validation_result_record | 7 | result_boundary | string | 1 | required | result boundary is one exact bounded scalar; no default is inferred |
| validation_result_record | 8 | diagnostics_boundary | string | 1 | required | diagnostics boundary is one exact bounded scalar; no default is inferred |
| validation_result_record | 9 | verification_effect | literal<NONE> | 1 | required | must equal NONE; validation PASS cannot establish B1 VERIFIED |
| validation_result_record | 10 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 0..* | required | evidence_pointer_ids preserves declared order; every nonempty member resolves once |
| contradiction_assessment_record | 1 | contradiction_id | identifier | 1 | required | contradiction_id is the unique primary ID for contradiction_assessment_record |
| contradiction_assessment_record | 2 | claim_a_id | reference<evidence_item_record> | 1 | required | claim_a_id resolves exactly once to the declared target |
| contradiction_assessment_record | 3 | claim_b_id | reference<evidence_item_record> or null | 0..1 | nullable | null is allowed only for NONE_OBSERVED_AT_BOUNDARY; non-null resolves exactly once |
| contradiction_assessment_record | 4 | normalized_scope | string | 1 | required | normalized scope is one exact bounded scalar; no default is inferred |
| contradiction_assessment_record | 5 | normalized_time | string | 1 | required | normalized time is one exact bounded scalar; no default is inferred |
| contradiction_assessment_record | 6 | assessment_state | enum<ASSESSMENT_STATE_VOCABULARY> | 1 | required | assessment_state must match its closed declared vocabulary |
| contradiction_assessment_record | 7 | provenance_relation | string | 1 | required | provenance relation is one exact bounded scalar; no default is inferred |
| contradiction_assessment_record | 8 | resolution_posture | string | 1 | required | resolution posture is one exact bounded scalar; no default is inferred |
| contradiction_assessment_record | 9 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 0..* | required | evidence_pointer_ids preserves declared order; every nonempty member resolves once |
| freshness_record | 1 | freshness_id | identifier | 1 | required | freshness_id is the unique primary ID for freshness_record |
| freshness_record | 2 | freshness_state | enum<FRESHNESS_STATE_VOCABULARY> | 1 | required | freshness_state must match its closed declared vocabulary |
| freshness_record | 3 | immutable_boundary | string | 1 | required | immutable boundary is one exact bounded scalar; no default is inferred |
| freshness_record | 4 | mutable_boundary | string | 1 | required | mutable boundary is one exact bounded scalar; no default is inferred |
| freshness_record | 5 | subject_id | reference<bundle_subject_record> | 1 | required | subject_id resolves exactly once to the declared target |
| freshness_record | 6 | staleness_trigger | string | 1 | required | staleness trigger is one exact bounded scalar; no default is inferred |
| freshness_record | 7 | currentness_limit | string | 1 | required | currentness limit is one exact bounded scalar; no default is inferred |
| freshness_record | 8 | failure_response | string | 1 | required | failure response is one exact bounded scalar; no default is inferred |
| freshness_record | 9 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 0..* | required | evidence_pointer_ids preserves declared order; every nonempty member resolves once |
| sensitive_data_boundary_record | 1 | sensitive_boundary_id | identifier | 1 | required | sensitive_boundary_id is the unique primary ID for sensitive_data_boundary_record |
| sensitive_data_boundary_record | 2 | sensitive_data_state | enum<SENSITIVE_DATA_STATE_VOCABULARY> | 1 | required | sensitive_data_state must match its closed declared vocabulary |
| sensitive_data_boundary_record | 3 | allowed_content | string | 1 | required | allowed content is one exact bounded scalar; no default is inferred |
| sensitive_data_boundary_record | 4 | prohibited_content | string | 1 | required | prohibited content is one exact bounded scalar; no default is inferred |
| sensitive_data_boundary_record | 5 | redaction_requirement | string | 1 | required | redaction requirement is one exact bounded scalar; no default is inferred |
| sensitive_data_boundary_record | 6 | repository_wide_absence_claim | literal<PROHIBITED> | 1 | required | must equal PROHIBITED; repository-wide absence cannot be inferred |
| sensitive_data_boundary_record | 7 | credential_like_literal_rule | string | 1 | required | credential like literal rule is one exact bounded scalar; no default is inferred |
| sensitive_data_boundary_record | 8 | failure_response | string | 1 | required | failure response is one exact bounded scalar; no default is inferred |
| sensitive_data_boundary_record | 9 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 0..* | required | evidence_pointer_ids preserves declared order; every nonempty member resolves once |
| bundle_disposition_record | 1 | disposition_id | identifier | 1 | required | disposition_id is the unique primary ID for bundle_disposition_record |
| bundle_disposition_record | 2 | bundle_state | enum<BUNDLE_STATE_VOCABULARY> | 1 | required | bundle_state must match its closed declared vocabulary |
| bundle_disposition_record | 3 | completeness_boundary | string | 1 | required | completeness boundary is one exact bounded scalar; no default is inferred |
| bundle_disposition_record | 4 | contradiction_posture | string | 1 | required | contradiction posture is one exact bounded scalar; no default is inferred |
| bundle_disposition_record | 5 | freshness_posture | string | 1 | required | freshness posture is one exact bounded scalar; no default is inferred |
| bundle_disposition_record | 6 | sensitive_data_posture | string | 1 | required | sensitive data posture is one exact bounded scalar; no default is inferred |
| bundle_disposition_record | 7 | b1_verification_state | enum<B1_VERIFICATION_STATE_VOCABULARY> | 1 | required | b1_verification_state must match its closed declared vocabulary |
| bundle_disposition_record | 8 | b1_acceptance_state | enum<B1_ACCEPTANCE_STATE_VOCABULARY> | 1 | required | b1_acceptance_state must match its closed declared vocabulary |
| bundle_disposition_record | 9 | consumer_recommendation | string | 1 | required | consumer recommendation is one exact bounded scalar; no default is inferred |
| bundle_disposition_record | 10 | authority_effect | literal<NONE> | 1 | required | must equal NONE; the record cannot grant authority |
| bundle_disposition_record | 11 | automatic_progression_prohibited | boolean | 1 | required | automatic_progression_prohibited uses the declared bounded value rule |
| non_authorization_record | 1 | non_authorization_id | identifier | 1 | required | non_authorization_id is the unique primary ID for non_authorization_record |
| non_authorization_record | 2 | prohibited_effect | string | 1 | required | prohibited effect is one exact bounded scalar; no default is inferred |
| non_authorization_record | 3 | scope | string | 1 | required | scope is one exact bounded scalar; no default is inferred |
| non_authorization_record | 4 | reason | string | 1 | required | reason is one exact bounded scalar; no default is inferred |
| non_authorization_record | 5 | required_future_route | string | 1 | required | required future route is one exact bounded scalar; no default is inferred |
| non_authorization_record | 6 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 0..* | required | evidence_pointer_ids preserves declared order; every nonempty member resolves once |

## Required Record Semantics
Requirement bindings carry B6 requirement metadata and satisfaction state
SATISFIED_AT_DECLARED_CEILING, PARTIALLY_SATISFIED, UNSATISFIED, or UNAVAILABLE;
satisfaction never implies verification or acceptance. Evidence items use one
claim, one source, one observation, zero or more validation results, an A2
status, inclusion state INCLUDED, EXCLUDED_ABOVE_CEILING, HELD_CONTRADICTORY,
or HELD_UNAVAILABLE, sensitive-data posture, and authority_effect NONE.

Sources are REPOSITORY_CANON, STATIC_SOURCE, GENERATED_EVIDENCE,
CROSS_REPOSITORY_OBSERVATION, GITHUB_MIRROR, LINEAR_MIRROR, or
UNAVAILABLE_SOURCE; immutability is IMMUTABLE, MUTABLE_CORROBORATING, or
UNAVAILABLE. Observations state only inspected content and boundary; query_or_command
may be null. Validation classes are STRUCTURAL, SEMANTIC, REFERENCE_RESOLUTION,
WHITESPACE, SOURCE_ALIGNMENT, or NOT_RUN; statuses are PASS, FAIL, NOT_RUN, or
UNAVAILABLE. PASS proves only the named bounded check.

Contradictions normalize scope and time first; states are NONE_OBSERVED_AT_BOUNDARY,
CONTRADICTORY, or UNRESOLVED; provenance relation uses accepted A2 relations or
NONE. Freshness is CURRENT_AT_BASE, HISTORICAL_PINNED,
NOT_INDEPENDENTLY_REFRESHED, UNAVAILABLE, or MIXED_EXPLICIT_BOUNDARIES.
Sensitive-data states are CLEAR_AT_INCLUDED_METADATA_BOUNDARY, REDACTED, HELD,
or UNVERIFIED. No repository-wide secret-absence claim is allowed.

Bundle states are DRAFT, ASSEMBLED_UNVERIFIED, INCOMPLETE, CONTRADICTORY,
READY_FOR_INDEPENDENT_VERIFICATION, or INVALID. They never equal VERIFIED,
ACCEPTED, RECEIPTED, INTEGRATED, or ACTIVATED.

## Current Structured Fixture
| record_type | compact fixture |
| --- | --- |
| evidence_bundle_record | B8-BUNDLE-001; evidence-bundle/v0; B8-SUBJECT-001; B8-COORD-001; [B8-REQ-001, B8-REQ-002, B8-REQ-003]; [B8-ITEM-001, B8-ITEM-002]; [B8-SOURCE-001, B8-SOURCE-002]; [B8-OBS-001, B8-OBS-002]; [B8-VAL-001, B8-VAL-002, B8-VAL-003]; [B8-CONTRA-001]; B8-FRESH-001; B8-SENSITIVE-001; B8-DISPOSITION-001; [B8-NONAUTH-001, B8-NONAUTH-002, B8-NONAUTH-003]; 5d843ca457e648d7445b55bfaf2244ccb28421f9; [B8-E-001, B8-E-002, B8-E-003, B8-E-004, B8-E-005, B8-E-006, B8-E-007, B8-E-008, B8-E-009, B8-E-010, B8-E-011, B8-E-012, B8-E-013] |
| bundle_subject_record | B8-SUBJECT-001; DOCUMENTARY_ARTIFACT; jai-governance-intelligence-main-state-operating-loop-v0; Q3M7Y26-P1; P1-BATCH-B; P1-B-WAVE-B; P1-B-LANE-08; sole B8 artifact |
| bundle_coordinates_record | B8-COORD-001; jai-governance-intelligence-main-state-operating-loop-v0; Q3M7Y26-P1; P1-BATCH-B; P1-B-WAVE-B; P1-B-LANE-08; P1-REL-013; jai-nexus/dev-jai-nexus; 5d843ca457e648d7445b55bfaf2244ccb28421f9; null; docs/q3m7y26-p1-b8-evidence-bundle-schema-v0; [docs/reference/q3m7y26-p1-b8-evidence-bundle-schema-v0.md] |
| evidence_requirement_binding_record | B8-REQ-001; B6-EVIDENCE-REQ-001; true; STATIC_CONFIGURATION; B5-ROLE-003; documentary fixture consumer; source-grounded metadata only; no sensitive material; SATISFIED_AT_DECLARED_CEILING; [B8-ITEM-001]; NONE |
| evidence_requirement_binding_record | B8-REQ-002; B6-EVIDENCE-REQ-002; false; MIRROR_ONLY; B5-ROLE-003; non-controlling corroboration only; mutable mirror metadata only; no sensitive material; SATISFIED_AT_DECLARED_CEILING; [B8-ITEM-002]; NONE |
| evidence_requirement_binding_record | B8-REQ-003; B6-EVIDENCE-REQ-003; false; UNAVAILABLE; B5-ROLE-003; unavailable evidence boundary; missing runtime integrity and receipt evidence; no sensitive material; UNAVAILABLE; []; Missing runtime, integrity, and receipt evidence |
| evidence_item_record | B8-ITEM-001; Aggregate twelve-path resolution at declared base; B8-SOURCE-001; B8-OBS-001; [B8-VAL-002]; B8-SUBJECT-001; base-bound; STATIC_CONFIGURATION; INCLUDED; CLEAR_AT_INCLUDED_METADATA_BOUNDARY; NONE; [B8-E-001, B8-E-002, B8-E-003, B8-E-004, B8-E-005, B8-E-006, B8-E-007, B8-E-008, B8-E-009, B8-E-010, B8-E-011, B8-E-012] |
| evidence_item_record | B8-ITEM-002; Supplied Linear JAI-205 mirror identifier not independently refreshed; B8-SOURCE-002; B8-OBS-002; []; B8-SUBJECT-001; supplied mirror boundary; MIRROR_ONLY; INCLUDED; CLEAR_AT_INCLUDED_METADATA_BOUNDARY; NONE; [B8-E-013] |
| evidence_source_record | B8-SOURCE-001; REPOSITORY_CANON; IMMUTABLE; jai-nexus/dev-jai-nexus; 5d843ca457e648d7445b55bfaf2244ccb28421f9; LOCAL_READ_ONLY; DOCUMENTATION_WORK_PACKET_CANON_ONLY; NONE; B8-E-001; repository canon at exact base; [B8-E-001] |
| evidence_source_record | B8-SOURCE-002; LINEAR_MIRROR; MUTABLE_CORROBORATING; Linear JAI-205; B8_ROUTE_OBSERVATION_ONLY_NOT_INDEPENDENTLY_REFRESHED; NOT_ACCESSED; MIRROR_ONLY; NONE; B8-E-013; non-controlling mirror identifier only; [B8-E-013] |
| evidence_observation_record | B8-OBS-001; B8-SOURCE-001; path resolved at base; 5d843ca457e648d7445b55bfaf2244ccb28421f9; git cat-file -e; STATIC_CONFIGURATION; listed source only; base-bound; no runtime, authority, persistence, deployment, or absence inference; [B8-E-001] |
| evidence_observation_record | B8-OBS-002; B8-SOURCE-002; mirror not independently refreshed; UNAVAILABLE; null; MIRROR_ONLY; supplied identifier only; UNAVAILABLE; no mirror-currentness or authority inference; [B8-E-013] |
| validation_result_record | B8-VAL-001; STRUCTURAL; PASS; B8-SUBJECT-001; [B8-ITEM-001]; Field Registry count; local document structure; zero diagnostics; NONE; [B8-E-001] |
| validation_result_record | B8-VAL-002; REFERENCE_RESOLUTION; PASS; B8-SUBJECT-001; [B8-ITEM-001]; git cat-file -e; exact base paths; zero diagnostics; NONE; [B8-E-001, B8-E-012] |
| validation_result_record | B8-VAL-003; WHITESPACE; PASS; B8-SUBJECT-001; [B8-ITEM-001]; git diff checks; local artifact; zero diagnostics; NONE; [B8-E-001] |
| contradiction_assessment_record | B8-CONTRA-001; B8-ITEM-001; null; exact B8 fixture scope; 5d843ca457e648d7445b55bfaf2244ccb28421f9; NONE_OBSERVED_AT_BOUNDARY; NONE; preserve future conflict if observed; [B8-E-001] |
| freshness_record | B8-FRESH-001; MIXED_EXPLICIT_BOUNDARIES; 5d843ca457e648d7445b55bfaf2244ccb28421f9; B8_ROUTE_OBSERVATION_ONLY_NOT_INDEPENDENTLY_REFRESHED; B8-SUBJECT-001; source or mirror drift; immutable currentness does not upgrade mirror; HOLD; [B8-E-001, B8-E-013] |
| sensitive_data_boundary_record | B8-SENSITIVE-001; CLEAR_AT_INCLUDED_METADATA_BOUNDARY; bounded metadata and redacted descriptions; credentials/tokens/cookies/secrets/env values/raw proof/HMAC/hash/fingerprint/actor email; stop before copying sensitive source; PROHIBITED; value-free boundary; HOLD; [B8-E-010, B8-E-011] |
| bundle_disposition_record | B8-DISPOSITION-001; ASSEMBLED_UNVERIFIED; COMPLETE_FOR_DOCUMENTARY_FIXTURE_ONLY; NONE_OBSERVED_AT_BOUNDARY; MIXED_EXPLICIT_BOUNDARIES; CLEAR_AT_INCLUDED_METADATA_BOUNDARY; B1-ST-VER-01 NOT_VERIFIED; B1-ST-ACC-01 NOT_ACCEPTED; NO_AUTOMATIC_PROGRESSION; NONE; true |
| non_authorization_record | B8-NONAUTH-001; receipt/digest/integrity proof; B8 bundle; bundle is not receipt or integrity; FUTURE_B9_B10_ROUTE_REQUIRED; [B8-E-007, B8-E-008] |
| non_authorization_record | B8-NONAUTH-002; acceptance/credit/exception; B8 bundle; assembly cannot accept or credit; FUTURE_ACCEPTANCE_ROUTE_REQUIRED; [B8-E-002, B8-E-006] |
| non_authorization_record | B8-NONAUTH-003; mirror mutation/external effect/exit/activation; B8 bundle; evidence does not mutate or activate; FUTURE_SEPARATE_ROUTE_REQUIRED; [B8-E-006, B8-E-013] |

## Implementation Reconciliation
| surface | classification | bounded statement |
| --- | --- | --- |
| B6 evidence_requirement_record | STATIC_CONFIGURATION | Requirement structure is static source only; it grants no authority. |
| B7 decision_evidence_boundary_record | STATIC_CONFIGURATION | Boundary structure is static source only; it is not integrity or acceptance evidence. |
| local operating-loop evidence/proof structures | STATIC_CONFIGURATION | No deployed behavior, HMAC authenticity, persistence, replay prevention, provider behavior, external-effect absence, or runtime identity is claimed. |
| supervised route-packet evidence structures | STATIC_CONFIGURATION | No deployed behavior, HMAC authenticity, persistence, replay prevention, provider behavior, external-effect absence, or runtime identity is claimed. |

## Evidence Registry
| evidence_id | source_class | immutability | reference | claim | observation_boundary |
| --- | --- | --- | --- | --- | --- |
| B8-E-001 | REPOSITORY_CANON | IMMUTABLE | [A2 authority/evidence precedence](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-002 | REPOSITORY_CANON | IMMUTABLE | [B1 lifecycle vocabulary](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-003 | REPOSITORY_CANON | IMMUTABLE | [B2 Control Coordinates canon](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-004 | REPOSITORY_CANON | IMMUTABLE | [B3 Program Charter schema](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-b3-program-charter-schema-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-005 | REPOSITORY_CANON | IMMUTABLE | [B4 decomposition canon](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-b4-batch-wave-lane-decomposition-canon-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-006 | REPOSITORY_CANON | IMMUTABLE | [B5 Role and Authority Matrix](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-b5-role-authority-matrix-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-007 | REPOSITORY_CANON | IMMUTABLE | [B6 Work Packet canon](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-b6-work-packet-canon-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-008 | REPOSITORY_CANON | IMMUTABLE | [B7 decision token canon](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-b7-decision-token-disposition-canon-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-009 | REPOSITORY_CANON | IMMUTABLE | [A8 role/route reconciliation](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-010 | REPOSITORY_CANON | IMMUTABLE | [A11 dependency map](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/docs/reference/q3m7y26-p1-a11-dependency-external-effect-map-v0.md) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-011 | STATIC_SOURCE | IMMUTABLE | [local operating-loop source](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/portal/src/lib/controlPlane/motionKernel/local-operating-loop.ts) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-012 | STATIC_SOURCE | IMMUTABLE | [supervised route-packet source](https://github.com/jai-nexus/dev-jai-nexus/blob/5d843ca457e648d7445b55bfaf2244ccb28421f9/portal/src/lib/controlPlane/routePackets/supervisedRoutePacket.ts) | Static or documentary evidence only | Base 5d843ca457e648d7445b55bfaf2244ccb28421f9 |
| B8-E-013 | LINEAR_MIRROR | MUTABLE_CORROBORATING | Linear JAI-205 | MIRROR_ONLY / non-controlling / not independently refreshed | B8_ROUTE_OBSERVATION_ONLY_NOT_INDEPENDENTLY_REFRESHED |

## Invalid Examples
| invalid_id | rejected claim |
| --- | --- |
| B8-INV-001 | unknown or missing field |
| B8-INV-002 | duplicate ID |
| B8-INV-003 | unresolved reference |
| B8-INV-004 | compound claim |
| B8-INV-005 | source without provenance |
| B8-INV-006 | mutable mirror controlling |
| B8-INV-007 | missing evidence synthesized |
| B8-INV-008 | unavailable treated present |
| B8-INV-009 | PASS treated verification |
| B8-INV-010 | verification treated acceptance |
| B8-INV-011 | bundle treated receipt |
| B8-INV-012 | digest or integrity invented |
| B8-INV-013 | contradiction side deleted |
| B8-INV-014 | chronology treated supersession |
| B8-INV-015 | stale evidence current |
| B8-INV-016 | scope subject coordinate mismatch |
| B8-INV-017 | credential-like literal copied |
| B8-INV-018 | secret absence inferred |
| B8-INV-019 | external-effect absence inferred |
| B8-INV-020 | bundle self-acceptance |

## Deterministic Serialization
Record types serialize in declared order; records sort by ascending ID; fields use
Field Registry order; arrays preserve order; NFC/LF normalization applies where
applicable; IDs and references are exact; null differs from missing; unknown and
duplicate keys fail closed. No timestamps, randomness, UUIDs, digests, hashes,
fingerprints, HMACs, receipts, or inferred authority are generated.

## Reservations
| reservation_id | reserved boundary |
| --- | --- |
| B8-R-001 | B9 Receipt Taxonomy |
| B8-R-002 | B10 Acceptance Receipt and Integrity Schema |
| B8-R-003 | B11 Capability and Credit Ledger |
| B8-R-004 | B12 Exception and Out-of-Sequence Work Canon |
| B8-R-005 | B13 Rollback, Reopen, and Supersession Canon |
| B8-R-006 | B14 GitHub-Linear Mirror Protocol |
| B8-R-007 | B15 Lifecycle Canon Verification and Batch B Closeout |

## Non-authorizations
No receipt, digest, integrity proof, acceptance, credit, exception, mirror
mutation, external effect, Batch exit, Program exit, or activation authority is
granted.

B8_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_EVIDENCE_BUNDLE_SCHEMA_ONLY
B8_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B8_FURTHER_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B8_EVIDENCE_BUNDLE_SCHEMA
