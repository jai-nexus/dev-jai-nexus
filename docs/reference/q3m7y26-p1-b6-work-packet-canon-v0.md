# Q3M7Y26-P1 B6 Work Packet Canon v0

## Status
Role: JAI::DEV::BUILDER
Route: CT-2026-07-26-Q3M7Y26-P1-START-B6-WORK-PACKET-CANON-v0
Packet: Q3M7Y26-P1-B6-v0
Base: 0d7316103bc96366bd781c8f1a09a3ea86e06bd1
Evidence ceiling: DOCUMENTATION_WORK_PACKET_CANON_ONLY

A Work Packet is a bounded instruction envelope structurally capable of execution only after separate external authority validates it and grants the applicable action. It cannot authorize itself or infer authority from completeness, CI, GitHub, Linear, role, implementation reachability, or prior packet. It defines neither B7 token nor disposition.

## Canonical record types
Every record has unique identifier, resolving references, ordered arrays, deterministic field order, and unknown-key rejection. Missing, stale, contradictory, or unknown values fail closed.

| ID | record_type | exact_field_count | Field Registry ordinal range within record_type |
| --- | --- | --- | --- |
| B6-TYPE-01 | work_packet_record | 17 | 1-17 |
| B6-TYPE-02 | control_coordinates_record | 9 | 1-9 |
| B6-TYPE-03 | subject_record | 6 | 1-6 |
| B6-TYPE-04 | authority_envelope_record | 14 | 1-14 |
| B6-TYPE-05 | executor_binding_record | 7 | 1-7 |
| B6-TYPE-06 | repository_scope_record | 13 | 1-13 |
| B6-TYPE-07 | outcome_contract_record | 7 | 1-7 |
| B6-TYPE-08 | preservation_contract_record | 5 | 1-5 |
| B6-TYPE-09 | validation_contract_record | 11 | 1-11 |
| B6-TYPE-10 | stop_condition_record | 5 | 1-5 |
| B6-TYPE-11 | rollback_plan_record | 7 | 1-7 |
| B6-TYPE-12 | delivery_authority_record | 6 | 1-6 |
| B6-TYPE-13 | evidence_requirement_record | 8 | 1-8 |
| B6-TYPE-14 | credit_boundary_record | 8 | 1-8 |
| B6-TYPE-15 | lifecycle_state_vector_record | 14 | 1-14 |
| B6-TYPE-16 | non_authorization_record | 6 | 1-6 |

work_packet_record contains exactly these ordered fields: packet_id, schema_version, control_coordinates, subject, authority_envelope, executor_binding, repository_scope, outcome_contract, preservation_contracts, validation_contracts, stop_conditions, rollback_plan, delivery_authorities, evidence_requirements, credit_boundary, lifecycle_state_vector, non_authorizations.

control_coordinates_record binds byte-exact B2 identity/coordinate, B4 decomposition relationship, and route; it creates no NHID or parent_coordinate. authority_envelope_record fields are authority_source, route_id, portable_role, actor_or_surface, authorized_action_ids, prohibited_action_ids, activation_condition, expiry_condition, revocation_condition, single_use boolean, authority_token_reference nullable, authority_posture enum NOT_GRANTED PHASE_SPECIFIC_EXTERNAL_ROUTE HELD EXPIRED, evidence_pointer_ids. repository_scope_record fields are repository, base_sha, head_sha, branch, worktree_precondition, path_allowlist ordered array, path_denylist ordered array, max_paths integer, base_drift_response, unexpected_path_response, forbidden_dependency_classes; SHA values are lowercase 40-character and wildcard/unbounded paths fail closed.

## Canonical Field Registry

| record_type | ordinal | field_name | value_type | cardinality | required_or_nullable | identifier_or_reference_rule |
| --- | --- | --- | --- | --- | --- | --- |
| work_packet_record | 1 | packet_id | identifier | 1 | required | unique within work_packet_record registry; not a reference |
| work_packet_record | 2 | schema_version | literal<work-packet/v0> | 1 | required | must equal work-packet/v0 exactly; unknown values fail closed |
| work_packet_record | 3 | control_coordinates | reference<control_coordinates_record> | 1 | required | resolves exactly once in control_coordinates_record registry |
| work_packet_record | 4 | subject | reference<subject_record> | 1 | required | resolves exactly once in subject_record registry |
| work_packet_record | 5 | authority_envelope | reference<authority_envelope_record> | 1 | required | resolves exactly once in authority_envelope_record registry |
| work_packet_record | 6 | executor_binding | reference<executor_binding_record> | 1 | required | resolves exactly once in executor_binding_record registry |
| work_packet_record | 7 | repository_scope | reference<repository_scope_record> | 1 | required | resolves exactly once in repository_scope_record registry |
| work_packet_record | 8 | outcome_contract | reference<outcome_contract_record> | 1 | required | resolves exactly once in outcome_contract_record registry |
| work_packet_record | 9 | preservation_contracts | ordered array<reference<preservation_contract_record>> | 1..* | required | every item resolves exactly once in preservation_contract_record registry; order is significant |
| work_packet_record | 10 | validation_contracts | ordered array<reference<validation_contract_record>> | 1..* | required | every item resolves exactly once in validation_contract_record registry; order is significant |
| work_packet_record | 11 | stop_conditions | ordered array<reference<stop_condition_record>> | 1..* | required | every item resolves exactly once in stop_condition_record registry; order is significant |
| work_packet_record | 12 | rollback_plan | reference<rollback_plan_record> | 1 | required | resolves exactly once in rollback_plan_record registry |
| work_packet_record | 13 | delivery_authorities | ordered array<reference<delivery_authority_record>> | exactly 11 | required | every item resolves exactly once in delivery_authority_record registry; order is significant |
| work_packet_record | 14 | evidence_requirements | ordered array<reference<evidence_requirement_record>> | 1..* | required | every item resolves exactly once in evidence_requirement_record registry; order is significant |
| work_packet_record | 15 | credit_boundary | reference<credit_boundary_record> | 1 | required | resolves exactly once in credit_boundary_record registry |
| work_packet_record | 16 | lifecycle_state_vector | reference<lifecycle_state_vector_record> | 1 | required | resolves exactly once in lifecycle_state_vector_record registry |
| work_packet_record | 17 | non_authorizations | ordered array<reference<non_authorization_record>> | 1..* | required | every item resolves exactly once in non_authorization_record registry; order is significant |
| control_coordinates_record | 1 | coordinates_id | identifier | 1 | required | unique within control_coordinates_record registry; not a reference |
| control_coordinates_record | 2 | program_id | reference<B2.program_id> | 1 | required | byte-matches exactly one accepted B2 program_id |
| control_coordinates_record | 3 | program_code | reference<B2.program_code> | 1 | required | jointly binds with program_id to exactly one accepted B2 Program identity |
| control_coordinates_record | 4 | batch_id | reference<B2.batch_id> | 1 | required | byte-matches exactly one accepted B2 batch_id |
| control_coordinates_record | 5 | wave_id | reference<B2.wave_id> | 1 | required | byte-matches exactly one accepted B2 wave_id |
| control_coordinates_record | 6 | lane_id | reference<B2.lane_id> | 1 | required | byte-matches exactly one accepted B2 lane_id |
| control_coordinates_record | 7 | decomposition_relationship_id | reference<B4.parent_child_relationship> | 1 | required | resolves exactly once in the accepted B4 relationship registry |
| control_coordinates_record | 8 | route_id | external_route_identifier | 1 | required | byte-matches the externally supplied route; does not self-authorize |
| control_coordinates_record | 9 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| subject_record | 1 | subject_id | identifier | 1 | required | unique within subject_record registry; not a reference |
| subject_record | 2 | title | string | 1 | required | scalar value; not an identifier or reference |
| subject_record | 3 | artifact_class | string | 1 | required | scalar value; not an identifier or reference |
| subject_record | 4 | objective | string | 1 | required | scalar value; not an identifier or reference |
| subject_record | 5 | source_reference_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| subject_record | 6 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| authority_envelope_record | 1 | authority_envelope_id | identifier | 1 | required | unique within authority_envelope_record registry; not a reference |
| authority_envelope_record | 2 | authority_source | string | 1 | required | scalar value; not an identifier or reference |
| authority_envelope_record | 3 | route_id | external_route_identifier | 1 | required | byte-matches the externally supplied route; does not self-authorize |
| authority_envelope_record | 4 | portable_role | reference<B5.portable_role> | 1 | required | byte-matches exactly one accepted B5 portable-role ID |
| authority_envelope_record | 5 | actor_or_surface | string | 1 | required | scalar value; not an identifier or reference |
| authority_envelope_record | 6 | authorized_action_ids | ordered array<reference<B5.action_record>> | 1..* | required | every item byte-matches exactly one B5 action ID; order is significant |
| authority_envelope_record | 7 | prohibited_action_ids | ordered array<reference<B5.action_record>> | 1..* | required | every item byte-matches exactly one B5 action ID; order is significant |
| authority_envelope_record | 8 | activation_condition | string | 1 | required | scalar value; not an identifier or reference |
| authority_envelope_record | 9 | expiry_condition | string | 1 | required | scalar value; not an identifier or reference |
| authority_envelope_record | 10 | revocation_condition | string | 1 | required | scalar value; not an identifier or reference |
| authority_envelope_record | 11 | single_use | boolean | 1 | required | exact true or false; not an identifier or reference |
| authority_envelope_record | 12 | authority_token_reference | reference<B7.decision_token_record> or null | 0..1 | nullable | when non-null resolves exactly once under separately accepted B7 canon; null grants no authority |
| authority_envelope_record | 13 | authority_posture | enum<NOT_GRANTED,PHASE_SPECIFIC_EXTERNAL_ROUTE,HELD,EXPIRED> | 1 | required | must equal one listed value; unknown values fail closed |
| authority_envelope_record | 14 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| executor_binding_record | 1 | executor_binding_id | identifier | 1 | required | unique within executor_binding_record registry; not a reference |
| executor_binding_record | 2 | execution_surface | string | 1 | required | scalar value; not an identifier or reference |
| executor_binding_record | 3 | portable_role | reference<B5.portable_role> | 1 | required | byte-matches exactly one accepted B5 portable-role ID |
| executor_binding_record | 4 | identity_evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| executor_binding_record | 5 | scope_binding | string | 1 | required | scalar value; not an identifier or reference |
| executor_binding_record | 6 | delegation_reference | reference<B5.delegation_record> or null | 0..1 | nullable | when non-null resolves exactly once in B5 delegation registry; null grants no delegation |
| executor_binding_record | 7 | separation_constraints | ordered array<string> | 1..* | required | ordered scalar values; not identifiers or references |
| repository_scope_record | 1 | repository_scope_id | identifier | 1 | required | unique within repository_scope_record registry; not a reference |
| repository_scope_record | 2 | repository | string | 1 | required | scalar value; not an identifier or reference |
| repository_scope_record | 3 | base_sha | lowercase_sha40 | 1 | required | matches exactly 40 lowercase hexadecimal characters; not an authority reference |
| repository_scope_record | 4 | head_sha | lowercase_sha40 or null | 0..1 | nullable | when non-null matches exactly 40 lowercase hexadecimal characters; not an authority reference |
| repository_scope_record | 5 | branch | string | 1 | required | scalar value; not an identifier or reference |
| repository_scope_record | 6 | worktree_precondition | string | 1 | required | scalar value; not an identifier or reference |
| repository_scope_record | 7 | path_allowlist | ordered array<string> | 1..* | required | ordered scalar values; not identifiers or references |
| repository_scope_record | 8 | path_denylist | ordered array<string> | 0..* | required | ordered scalar values; not identifiers or references |
| repository_scope_record | 9 | max_paths | integer | 1 | required | bounded nonnegative integer; not an identifier or reference |
| repository_scope_record | 10 | base_drift_response | string | 1 | required | scalar value; not an identifier or reference |
| repository_scope_record | 11 | unexpected_path_response | string | 1 | required | scalar value; not an identifier or reference |
| repository_scope_record | 12 | forbidden_dependency_classes | ordered array<string> | 1..* | required | ordered scalar values; not identifiers or references |
| repository_scope_record | 13 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| outcome_contract_record | 1 | outcome_contract_id | identifier | 1 | required | unique within outcome_contract_record registry; not a reference |
| outcome_contract_record | 2 | requested_outcome | string | 1 | required | scalar value; not an identifier or reference |
| outcome_contract_record | 3 | completion_conditions | ordered array<string> | 1..* | required | ordered scalar values; not identifiers or references |
| outcome_contract_record | 4 | deliverables | ordered array<string> | 1..* | required | ordered scalar values; not identifiers or references |
| outcome_contract_record | 5 | allowed_change_classes | ordered array<string> | 1..* | required | ordered scalar values; not identifiers or references |
| outcome_contract_record | 6 | excluded_outcomes | ordered array<string> | 1..* | required | ordered scalar values; not identifiers or references |
| outcome_contract_record | 7 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| preservation_contract_record | 1 | preservation_contract_id | identifier | 1 | required | unique within preservation_contract_record registry; not a reference |
| preservation_contract_record | 2 | invariant | string | 1 | required | scalar value; not an identifier or reference |
| preservation_contract_record | 3 | verification_method | string | 1 | required | scalar value; not an identifier or reference |
| preservation_contract_record | 4 | failure_response | string | 1 | required | scalar value; not an identifier or reference |
| preservation_contract_record | 5 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| validation_contract_record | 1 | validation_contract_id | identifier | 1 | required | unique within validation_contract_record registry; not a reference |
| validation_contract_record | 2 | command | string | 1 | required | scalar value; not an identifier or reference |
| validation_contract_record | 3 | evidence_class | enum<A2.evidence_class> | 1 | required | must byte-match one accepted A2 evidence-class value; unknown values fail closed |
| validation_contract_record | 4 | environment | string | 1 | required | scalar value; not an identifier or reference |
| validation_contract_record | 5 | expected_exit | integer | 1 | required | bounded nonnegative integer; not an identifier or reference |
| validation_contract_record | 6 | expected_output_rule | string | 1 | required | scalar value; not an identifier or reference |
| validation_contract_record | 7 | required | boolean | 1 | required | exact true or false; not an identifier or reference |
| validation_contract_record | 8 | sandbox_boundary | string | 1 | required | scalar value; not an identifier or reference |
| validation_contract_record | 9 | rerun_boundary | string | 1 | required | scalar value; not an identifier or reference |
| validation_contract_record | 10 | failure_response | string | 1 | required | scalar value; not an identifier or reference |
| validation_contract_record | 11 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| stop_condition_record | 1 | stop_condition_id | identifier | 1 | required | unique within stop_condition_record registry; not a reference |
| stop_condition_record | 2 | trigger | string | 1 | required | scalar value; not an identifier or reference |
| stop_condition_record | 3 | required_response | string | 1 | required | scalar value; not an identifier or reference |
| stop_condition_record | 4 | authority_effect | string | 1 | required | scalar value; not an identifier or reference |
| stop_condition_record | 5 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| rollback_plan_record | 1 | rollback_plan_id | identifier | 1 | required | unique within rollback_plan_record registry; not a reference |
| rollback_plan_record | 2 | precommit_strategy | string | 1 | required | scalar value; not an identifier or reference |
| rollback_plan_record | 3 | postcommit_strategy | string | 1 | required | scalar value; not an identifier or reference |
| rollback_plan_record | 4 | postintegration_strategy | string | 1 | required | scalar value; not an identifier or reference |
| rollback_plan_record | 5 | external_rollback_requirement | string | 1 | required | scalar value; not an identifier or reference |
| rollback_plan_record | 6 | verification_method | string | 1 | required | scalar value; not an identifier or reference |
| rollback_plan_record | 7 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| delivery_authority_record | 1 | delivery_authority_id | identifier | 1 | required | unique within delivery_authority_record registry; not a reference |
| delivery_authority_record | 2 | action | enum<EDIT,STAGE,COMMIT,PUSH,DRAFT_PR,READY,MERGE,BRANCH_DELETE,DEPLOY,LINEAR_MUTATION,EXTERNAL_EFFECT> | 1 | required | must equal one listed action; unknown values fail closed |
| delivery_authority_record | 3 | authority_state | enum<GRANTED_BY_CURRENT_ROUTE,NOT_GRANTED,SEPARATE_FUTURE_ROUTE_REQUIRED> | 1 | required | must equal one listed value; unknown values fail closed |
| delivery_authority_record | 4 | required_route | external_route_requirement | 1 | required | names separately required authority; does not grant or create that route |
| delivery_authority_record | 5 | current_evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| delivery_authority_record | 6 | failure_response | string | 1 | required | scalar value; not an identifier or reference |
| evidence_requirement_record | 1 | evidence_requirement_id | identifier | 1 | required | unique within evidence_requirement_record registry; not a reference |
| evidence_requirement_record | 2 | evidence_class | enum<A2.evidence_class> | 1 | required | must byte-match one accepted A2 evidence-class value; unknown values fail closed |
| evidence_requirement_record | 3 | required | boolean | 1 | required | exact true or false; not an identifier or reference |
| evidence_requirement_record | 4 | producer_role | reference<B5.portable_role> | 1 | required | byte-matches exactly one accepted B5 portable-role ID |
| evidence_requirement_record | 5 | consumer_gate | string | 1 | required | scalar value; not an identifier or reference |
| evidence_requirement_record | 6 | content_boundary | string | 1 | required | scalar value; not an identifier or reference |
| evidence_requirement_record | 7 | sensitive_data_rule | string | 1 | required | scalar value; not an identifier or reference |
| evidence_requirement_record | 8 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| credit_boundary_record | 1 | credit_boundary_id | identifier | 1 | required | unique within credit_boundary_record registry; not a reference |
| credit_boundary_record | 2 | maximum_current_credit | string | 1 | required | scalar value; not an identifier or reference |
| credit_boundary_record | 3 | acceptance_credit | string | 1 | required | scalar value; not an identifier or reference |
| credit_boundary_record | 4 | batch_exit_credit | string | 1 | required | scalar value; not an identifier or reference |
| credit_boundary_record | 5 | program_exit_credit | string | 1 | required | scalar value; not an identifier or reference |
| credit_boundary_record | 6 | activation_credit | string | 1 | required | scalar value; not an identifier or reference |
| credit_boundary_record | 7 | prohibited_inferences | ordered array<string> | 1..* | required | ordered scalar values; not identifiers or references |
| credit_boundary_record | 8 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| lifecycle_state_vector_record | 1 | lifecycle_state_vector_id | identifier | 1 | required | unique within lifecycle_state_vector_record registry; not a reference |
| lifecycle_state_vector_record | 2 | planning_state | enum<B1.planning_state> | 1 | required | must byte-match one accepted B1 planning axis state; unknown values fail closed |
| lifecycle_state_vector_record | 3 | routing_state | enum<B1.routing_state> | 1 | required | must byte-match one accepted B1 routing axis state; unknown values fail closed |
| lifecycle_state_vector_record | 4 | delivery_state | enum<B1.delivery_state> | 1 | required | must byte-match one accepted B1 delivery axis state; unknown values fail closed |
| lifecycle_state_vector_record | 5 | verification_state | enum<B1.verification_state> | 1 | required | must byte-match one accepted B1 verification axis state; unknown values fail closed |
| lifecycle_state_vector_record | 6 | acceptance_state | enum<B1.acceptance_state> | 1 | required | must byte-match one accepted B1 acceptance axis state; unknown values fail closed |
| lifecycle_state_vector_record | 7 | integration_state | enum<B1.integration_state> | 1 | required | must byte-match one accepted B1 integration axis state; unknown values fail closed |
| lifecycle_state_vector_record | 8 | control_overlay_state | enum<B1.control_overlay_state> | 1 | required | must byte-match one accepted B1 control_overlay axis state; unknown values fail closed |
| lifecycle_state_vector_record | 9 | program_operation_state | enum<B1.program_operation_state> | 1 | required | must byte-match one accepted B1 program_operation axis state; unknown values fail closed |
| lifecycle_state_vector_record | 10 | activation_state | enum<B1.activation_state> | 1 | required | must byte-match one accepted B1 activation axis state; unknown values fail closed |
| lifecycle_state_vector_record | 11 | mirror_state | enum<B1.mirror_state> | 1 | required | must byte-match one accepted B1 mirror axis state; unknown values fail closed |
| lifecycle_state_vector_record | 12 | evidence_cutoff | string | 1 | required | scalar value; not an identifier or reference |
| lifecycle_state_vector_record | 13 | transition_authority | string | 1 | required | scalar value; not an identifier or reference |
| lifecycle_state_vector_record | 14 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |
| non_authorization_record | 1 | non_authorization_id | identifier | 1 | required | unique within non_authorization_record registry; not a reference |
| non_authorization_record | 2 | prohibited_effect | string | 1 | required | scalar value; not an identifier or reference |
| non_authorization_record | 3 | scope | string | 1 | required | scalar value; not an identifier or reference |
| non_authorization_record | 4 | reason | string | 1 | required | scalar value; not an identifier or reference |
| non_authorization_record | 5 | required_future_route | external_route_requirement | 1 | required | names separately required authority; does not grant or create that route |
| non_authorization_record | 6 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every item resolves exactly once in the Evidence Pointer Registry; order is significant |

## Deterministic Serialization

Field order follows Field Registry ordinal; arrays preserve declared order; identifiers are unique; every reference resolves exactly once; unknown and duplicate keys fail closed; nullable differs from missing; applicable A2 normalization rules apply; no generated timestamp, random value, UUID, or inferred authority.

## Current structured fixture

This fixture is documentary and local only. It contains the sixteen canonical
record types in Field Registry order. Evidence-pointer IDs are intentionally
unresolved B6R2D placeholders; no Evidence Pointer Registry is created here.

### work_packet_record

```yaml
packet_id: Q3M7Y26-P1-B6-v0
schema_version: work-packet/v0
control_coordinates: B6-COORD-001
subject: B6-SUBJECT-001
authority_envelope: B6-AUTH-001
executor_binding: B6-EXEC-001
repository_scope: B6-REPO-001
outcome_contract: B6-OUTCOME-001
preservation_contracts: [B6-PRES-001, B6-PRES-002, B6-PRES-003]
validation_contracts: [B6-VAL-001, B6-VAL-002]
stop_conditions: [B6-STOP-001, B6-STOP-002, B6-STOP-003, B6-STOP-004, B6-STOP-005, B6-STOP-006, B6-STOP-007, B6-STOP-008, B6-STOP-009]
rollback_plan: B6-ROLLBACK-001
delivery_authorities: [B6-DELIVERY-001, B6-DELIVERY-002, B6-DELIVERY-003, B6-DELIVERY-004, B6-DELIVERY-005, B6-DELIVERY-006, B6-DELIVERY-007, B6-DELIVERY-008, B6-DELIVERY-009, B6-DELIVERY-010, B6-DELIVERY-011]
evidence_requirements: [B6-EVIDENCE-REQ-001, B6-EVIDENCE-REQ-002, B6-EVIDENCE-REQ-003]
credit_boundary: B6-CREDIT-001
lifecycle_state_vector: B6-LIFECYCLE-001
non_authorizations: [B6-NONAUTH-001, B6-NONAUTH-002, B6-NONAUTH-003, B6-NONAUTH-004, B6-NONAUTH-005, B6-NONAUTH-006, B6-NONAUTH-007]
```

### control_coordinates_record

```yaml
coordinates_id: B6-COORD-001
program_id: jai-governance-intelligence-main-state-operating-loop-v0
program_code: Q3M7Y26-P1
batch_id: P1-BATCH-B
wave_id: P1-B-WAVE-B
lane_id: P1-B-LANE-06
decomposition_relationship_id: P1-REL-011
route_id: CT-2026-07-26-Q3M7Y26-P1-START-B6-WORK-PACKET-CANON-v0
evidence_pointer_ids: [B6-E-002, B6-E-004]
```

### subject_record

```yaml
subject_id: B6-SUBJECT-001
title: Work Packet Canon v0
artifact_class: DOCUMENTARY_CANON
objective: Define the bounded Work Packet documentary contract without delivery or acceptance authority.
source_reference_ids: [B6-E-003, B6-E-004, B6-E-005]
evidence_pointer_ids: [B6-E-006]
```

### authority_envelope_record

```yaml
authority_envelope_id: B6-AUTH-001
authority_source: HUMAN_OPERATOR_THROUGH_CHATGPT_CONTROL_THREAD
route_id: CT-2026-07-26-Q3M7Y26-P1-START-B6-WORK-PACKET-CANON-v0
portable_role: B5-ROLE-003
actor_or_surface: CODEX_CONTROL_THREAD
authorized_action_ids: [B5-ACTION-003, B5-ACTION-004]
prohibited_action_ids: [B5-ACTION-001, B5-ACTION-002, B5-ACTION-005, B5-ACTION-006, B5-ACTION-007, B5-ACTION-008, B5-ACTION-009, B5-ACTION-010, B5-ACTION-011, B5-ACTION-012, B5-ACTION-013, B5-ACTION-014, B5-ACTION-015, B5-ACTION-016, B5-ACTION-017, B5-ACTION-018, B5-ACTION-019, B5-ACTION-020]
activation_condition: Exact current route, role, base, branch, and sole-artifact boundary remain matched.
expiry_condition: Authority expires on completion, supersession, route expiry, base drift, or scope expansion.
revocation_condition: Stop on human revocation, stale, mismatched, missing, or expanded authority.
single_use: true
authority_token_reference: null
authority_posture: PHASE_SPECIFIC_EXTERNAL_ROUTE
evidence_pointer_ids: [B6-E-003, B6-E-006]
```

### executor_binding_record

```yaml
executor_binding_id: B6-EXEC-001
execution_surface: CODEX_CONTROL_THREAD
portable_role: B5-ROLE-003
identity_evidence_pointer_ids: [B6-E-003, B6-E-007]
scope_binding: One documentary artifact on the named branch at the named base.
delegation_reference: null
separation_constraints: [No implied authority, no action inheritance, no external mutation]
```

### repository_scope_record

```yaml
repository_scope_id: B6-REPO-001
repository: jai-nexus/dev-jai-nexus
base_sha: 0d7316103bc96366bd781c8f1a09a3ea86e06bd1
head_sha: null
branch: docs/q3m7y26-p1-b6-work-packet-canon-v0
worktree_precondition: Clean index and sole authorized untracked artifact.
path_allowlist: [docs/reference/q3m7y26-p1-b6-work-packet-canon-v0.md]
path_denylist: []
max_paths: 1
base_drift_response: HOLD without mutation.
unexpected_path_response: HOLD without mutation.
forbidden_dependency_classes: [Packages, tests, builds, runtime, external systems]
evidence_pointer_ids: [B6-E-008, B6-E-009, B6-E-010, B6-E-012]
```

### outcome_contract_record

```yaml
outcome_contract_id: B6-OUTCOME-001
requested_outcome: Complete the documentary Work Packet Canon fixture and delivery registry.
completion_conditions: [All sixteen record types represented, required counts exact, delivery registry complete]
deliverables: [Single B6 documentary artifact]
allowed_change_classes: [Fixture and delivery authority sections only]
excluded_outcomes: [Staging, commit, push, PR, acceptance, runtime, external effect]
evidence_pointer_ids: [B6-E-005, B6-E-006]
```

### preservation_contract_record

```yaml
preservation_contract_id: B6-PRES-001
invariant: B1 lifecycle axes remain separate from Work Packet validity.
verification_method: Compare fixture lifecycle_state_vector with B1-aligned declared states.
failure_response: HOLD and do not infer lifecycle transition.
evidence_pointer_ids: [B6-E-001]
```

```yaml
preservation_contract_id: B6-PRES-002
invariant: B2 identity and B4 decomposition identifiers remain byte-exact.
verification_method: Check the fixed program, coordinate, and relationship joins.
failure_response: HOLD on any identifier mismatch.
evidence_pointer_ids: [B6-E-002, B6-E-004]
```

```yaml
preservation_contract_id: B6-PRES-003
invariant: B5 role and action boundaries remain non-transitive.
verification_method: Check explicit action IDs and distinct delivery records.
failure_response: HOLD on implied or inherited authority.
evidence_pointer_ids: [B6-E-003]
```

### validation_contract_record

```yaml
validation_contract_id: B6-VAL-001
command: git diff --check
evidence_class: STATIC_CONFIGURATION
environment: local repository worktree
expected_exit: 0
expected_output_rule: Zero diagnostics.
required: true
sandbox_boundary: No package, test, build, runtime, or external command.
rerun_boundary: Run after the bounded documentary edit only.
failure_response: HOLD before any delivery action.
evidence_pointer_ids: [B6-E-006]
```

```yaml
validation_contract_id: B6-VAL-002
command: git diff --no-index --check /dev/null docs/reference/q3m7y26-p1-b6-work-packet-canon-v0.md
evidence_class: STATIC_CONFIGURATION
environment: local repository worktree
expected_exit: 1
expected_output_rule: Raw exit 1 with zero diagnostics for an untracked file.
required: true
sandbox_boundary: No package, test, build, runtime, or external command.
rerun_boundary: Run after the bounded documentary edit only.
failure_response: HOLD if diagnostics are emitted or the raw exit differs.
evidence_pointer_ids: [B6-E-006]
```

### stop_condition_record

```yaml
stop_condition_id: B6-STOP-001
trigger: Base SHA drift.
required_response: HOLD before mutation.
authority_effect: Current route authority does not apply.
evidence_pointer_ids: [B6-E-006]
```

```yaml
stop_condition_id: B6-STOP-002
trigger: Branch mismatch.
required_response: HOLD before mutation.
authority_effect: Current route authority does not apply.
evidence_pointer_ids: [B6-E-006]
```

```yaml
stop_condition_id: B6-STOP-003
trigger: Nonempty index or unexpected worktree path.
required_response: HOLD before mutation.
authority_effect: Scope is invalid.
evidence_pointer_ids: [B6-E-006]
```

```yaml
stop_condition_id: B6-STOP-004
trigger: Required fixed source identifier is unavailable or mismatched.
required_response: HOLD before mutation.
authority_effect: Source join is invalid.
evidence_pointer_ids: [B6-E-002, B6-E-003, B6-E-004, B6-E-005, B6-E-007]
```

```yaml
stop_condition_id: B6-STOP-005
trigger: A second path or thirteenth evidence pointer is required.
required_response: HOLD before mutation.
authority_effect: Scope expansion is prohibited.
evidence_pointer_ids: [B6-E-006]
```

```yaml
stop_condition_id: B6-STOP-006
trigger: Authority must be inferred.
required_response: HOLD before mutation.
authority_effect: Inferred authority is invalid.
evidence_pointer_ids: [B6-E-006]
```

```yaml
stop_condition_id: B6-STOP-007
trigger: Authority is missing, stale, mismatched, expired, or expanded.
required_response: HOLD before action.
authority_effect: Every delivery action fails closed.
evidence_pointer_ids: [B6-E-003, B6-E-006]
```

```yaml
stop_condition_id: B6-STOP-008
trigger: Required documentary validation fails.
required_response: HOLD before any delivery action.
authority_effect: No validation result creates authority.
evidence_pointer_ids: [B6-E-006]
```

```yaml
stop_condition_id: B6-STOP-009
trigger: Sensitive literal, external action, or unapproved transmission is required.
required_response: HOLD before mutation or disclosure.
authority_effect: External and sensitive boundaries remain prohibited.
evidence_pointer_ids: [B6-E-006]
```

### rollback_plan_record

```yaml
rollback_plan_id: B6-ROLLBACK-001
precommit_strategy: Restore only the sole documentary artifact if separately authorized.
postcommit_strategy: Use a separately routed exact reversal.
postintegration_strategy: Use a separately accepted integration reversal.
external_rollback_requirement: NONE because no external effect is authorized.
verification_method: Recheck exact path inventory and whitespace diagnostics.
evidence_pointer_ids: [B6-E-006]
```

## Delivery authority

Every delivery record is independent. No action inherits authority from another
action. Each record fails closed on missing, stale, mismatched, expired, or
expanded authority.

```yaml
delivery_authority_id: B6-DELIVERY-001
action: EDIT
authority_state: GRANTED_BY_CURRENT_ROUTE
required_route: CT-2026-07-26-Q3M7Y26-P1-B6R2C-FIXTURE-DELIVERY-v0
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without editing if current route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-002
action: STAGE
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_STAGE_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without staging if separate route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-003
action: COMMIT
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_COMMIT_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without committing if separate route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-004
action: PUSH
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_PUSH_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without pushing if separate route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-005
action: DRAFT_PR
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_DRAFT_PR_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without creating or updating a Draft PR if separate route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-006
action: READY
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_READY_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without ready conversion if separate route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-007
action: MERGE
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_MERGE_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without merging if separate route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-008
action: BRANCH_DELETE
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_BRANCH_DELETE_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without deleting a branch if separate route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-009
action: DEPLOY
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_DEPLOY_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without deployment if separate route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-010
action: LINEAR_MUTATION
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_LINEAR_MUTATION_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without Linear mutation if separate route authority is missing, stale, mismatched, expired, or expanded.
```

```yaml
delivery_authority_id: B6-DELIVERY-011
action: EXTERNAL_EFFECT
authority_state: SEPARATE_FUTURE_ROUTE_REQUIRED
required_route: FUTURE_EXACT_EXTERNAL_EFFECT_ROUTE_REQUIRED
current_evidence_pointer_ids: [B6-E-003, B6-E-006]
failure_response: HOLD without external effect if separate route authority is missing, stale, mismatched, expired, or expanded.
```

### evidence_requirement_record

```yaml
evidence_requirement_id: B6-EVIDENCE-REQ-001
evidence_class: STATIC_CONFIGURATION
required: true
producer_role: B5-ROLE-003
consumer_gate: Source-grounded documentary evidence only; no runtime claim.
content_boundary: Source-grounded documentary evidence only; no runtime claim.
sensitive_data_rule: Do not include secrets, credentials, tokens, or sensitive content.
evidence_pointer_ids: [B6-E-008, B6-E-009, B6-E-010, B6-E-012]
```

```yaml
evidence_requirement_id: B6-EVIDENCE-REQ-002
evidence_class: MIRROR_ONLY
required: false
producer_role: B5-ROLE-003
consumer_gate: Mutable non-controlling corroboration only.
content_boundary: Mutable non-controlling corroboration only.
sensitive_data_rule: Do not include secrets, credentials, tokens, or sensitive content.
evidence_pointer_ids: [B6-E-011]
```

```yaml
evidence_requirement_id: B6-EVIDENCE-REQ-003
evidence_class: UNAVAILABLE
required: false
producer_role: B5-ROLE-003
consumer_gate: Explicitly records missing evidence without positive inference.
content_boundary: Missing evidence is recorded without positive inference.
sensitive_data_rule: Do not include secrets, credentials, tokens, or sensitive content.
evidence_pointer_ids: [B6-E-006]
```

### credit_boundary_record

```yaml
credit_boundary_id: B6-CREDIT-001
maximum_current_credit: DOCUMENTATION_WORK_PACKET_CANON_ONLY
acceptance_credit: NONE
batch_exit_credit: NONE
program_exit_credit: NONE
activation_credit: NONE
prohibited_inferences: [Validation is not acceptance, merge is not acceptance, CI is not acceptance, source is not runtime]
evidence_pointer_ids: [B6-E-001, B6-E-006]
```

### lifecycle_state_vector_record

```yaml
lifecycle_state_vector_id: B6-LIFECYCLE-001
planning_state: PLANNED
routing_state: ROUTED
delivery_state: NOT_DELIVERED
verification_state: NOT_VERIFIED
acceptance_state: NOT_ACCEPTED
integration_state: NOT_INTEGRATED
control_overlay_state: CONTROL_ACTIVE
program_operation_state: OPEN_FOR_BATCH_PLANNING_ONLY
activation_state: NOT_ACTIVATED
mirror_state: MIRROR_STALE
evidence_cutoff: B6R2C local documentary observation boundary
transition_authority: No lifecycle transition is authorized by this fixture.
evidence_pointer_ids: [B6-E-001]
```

### non_authorization_record

```yaml
non_authorization_id: B6-NONAUTH-001
prohibited_effect: Acceptance
scope: B6 current route
reason: Documentary fixture does not establish acceptance.
required_future_route: FUTURE_EXACT_ACCEPTANCE_ROUTE_REQUIRED
evidence_pointer_ids: [B6-E-003, B6-E-006]
```

```yaml
non_authorization_id: B6-NONAUTH-002
prohibited_effect: Merge
scope: B6 current route
reason: EDIT authority does not include merge.
required_future_route: FUTURE_EXACT_MERGE_ROUTE_REQUIRED
evidence_pointer_ids: [B6-E-003, B6-E-006]
```

```yaml
non_authorization_id: B6-NONAUTH-003
prohibited_effect: Deployment
scope: B6 current route
reason: No deployment authority is supplied.
required_future_route: FUTURE_EXACT_DEPLOY_ROUTE_REQUIRED
evidence_pointer_ids: [B6-E-003, B6-E-006]
```

```yaml
non_authorization_id: B6-NONAUTH-004
prohibited_effect: External effect
scope: B6 current route
reason: No external-effect authority is supplied.
required_future_route: FUTURE_EXACT_EXTERNAL_EFFECT_ROUTE_REQUIRED
evidence_pointer_ids: [B6-E-003, B6-E-006]
```

```yaml
non_authorization_id: B6-NONAUTH-005
prohibited_effect: Batch exit
scope: Batch B
reason: This lane grants no Batch exit credit.
required_future_route: FUTURE_EXACT_BATCH_EXIT_ROUTE_REQUIRED
evidence_pointer_ids: [B6-E-001, B6-E-006]
```

```yaml
non_authorization_id: B6-NONAUTH-006
prohibited_effect: Program exit
scope: Q3M7Y26-P1
reason: This lane grants no Program exit credit.
required_future_route: FUTURE_EXACT_PROGRAM_EXIT_ROUTE_REQUIRED
evidence_pointer_ids: [B6-E-001, B6-E-006]
```

```yaml
non_authorization_id: B6-NONAUTH-007
prohibited_effect: JAI activation
scope: JAI NEXUS
reason: This lane grants no activation authority.
required_future_route: FUTURE_EXACT_ACTIVATION_ROUTE_REQUIRED
evidence_pointer_ids: [B6-E-001, B6-E-006]
```

## Fail-closed fixtures
| fixture | failure |
| --- | --- |
| complete unrouted packet | authority_posture NOT_GRANTED |
| stale-base packet | stop before action |
| role-mismatched packet | executor binding fails |
| local-shadow proposed-only packet presented executable | reject; execution authority false |

## Implementation reconciliation
| surface | posture | evidence_pointer |
| --- | --- | --- |
| Prisma WorkPacket model | STATIC_SOURCE / PERSISTENCE_REACHABLE / NOT_EXECUTED | B6-E-008 |
| sotWorkPackets | STATIC_SOURCE / MUTATION_REACHABLE / NOT_INVOKED | B6-E-009 |
| supervisedRoutePacket | STATIC_SOURCE / MANUAL_HANDOFF_ONLY | B6-E-010 |
| local operating-loop Work Packet | MOCK_OR_SHADOW / PROPOSED_ONLY / EXECUTION_AUTHORITY_FALSE | B6-E-012 |

## Invalid examples
| ID | invalid claim |
| --- | --- |
| B6-INV-01 | self-granted authority / fail closed |
| B6-INV-02 | missing base SHA / fail closed |
| B6-INV-03 | wildcard allowlist / fail closed |
| B6-INV-04 | unbounded outcome / fail closed |
| B6-INV-05 | missing validation contract / fail closed |
| B6-INV-06 | missing stop condition / fail closed |
| B6-INV-07 | missing rollback plan / fail closed |
| B6-INV-08 | transitive action authority / fail closed |
| B6-INV-09 | CI treated as acceptance / fail closed |
| B6-INV-10 | merge treated as acceptance / fail closed |
| B6-INV-11 | local-shadow as canonical executable / fail closed |
| B6-INV-12 | Prisma row as canonical authority / fail closed |
| B6-INV-13 | stale base / fail closed |
| B6-INV-14 | Linear mirror as routing authority / fail closed |
| B6-INV-15 | invented B7 token / fail closed |

## Reservations
| ID | reserved lane |
| --- | --- |
| B6-R-01 | B7 Decision Token and Disposition Canon |
| B6-R-02 | B8 Evidence Bundle Schema |
| B6-R-03 | B9 Receipt Taxonomy |
| B6-R-04 | B10 Acceptance Receipt and Integrity Schema |
| B6-R-05 | B11 Capability and Credit Ledger |
| B6-R-06 | B12 Exception and Out-of-Sequence Work Canon |
| B6-R-07 | B13 Rollback, Reopen, and Supersession Canon |
| B6-R-08 | B14 GitHub-Linear Mirror Protocol |
| B6-R-09 | B15 Lifecycle Canon Verification and Batch B Closeout |

## Evidence Pointer Registry
| evidence_id | source_class | immutability | reference | claim | observation_boundary |
| --- | --- | --- | --- | --- | --- |
| B6-E-001 | Repository canon | IMMUTABLE | [B6-REF-001] | B1 lifecycle canon | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-002 | Repository canon | IMMUTABLE | [B6-REF-002] | B2 Control Coordinates canon | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-003 | Repository canon | IMMUTABLE | [B6-REF-003] | B5 Role and Authority Matrix | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-004 | Repository canon | IMMUTABLE | [B6-REF-004] | B4 Batch/Wave/Lane decomposition canon | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-005 | Repository canon | IMMUTABLE | [B6-REF-005] | B3 Program Charter schema | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-006 | Repository canon | IMMUTABLE | [B6-REF-006] | A2 authority/evidence precedence | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-007 | Repository canon | IMMUTABLE | [B6-REF-007] | A8 governance role/route reconciliation | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-008 | Static source | IMMUTABLE | [B6-REF-008] | Prisma WorkPacket model | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-009 | Static source | IMMUTABLE | [B6-REF-009] | sotWorkPackets source | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-010 | Static source | IMMUTABLE | [B6-REF-010] | supervisedRoutePacket source | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |
| B6-E-011 | Linear mirror | MUTABLE_CORROBORATING | [B6-REF-011] | MIRROR_ONLY / non-controlling | B6_ROUTE_OBSERVATION_ONLY_NOT_INDEPENDENTLY_REFRESHED |
| B6-E-012 | Static source | IMMUTABLE | [B6-REF-012] | local operating-loop Work Packet source | Base 0d7316103bc96366bd781c8f1a09a3ea86e06bd1 |

## Reference Definitions
| reference_id | reference | immutability |
| --- | --- | --- |
| B6-REF-001 | [B1 lifecycle canon](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md) | IMMUTABLE |
| B6-REF-002 | [B2 Control Coordinates canon](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md) | IMMUTABLE |
| B6-REF-003 | [B5 Role and Authority Matrix](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/docs/reference/q3m7y26-p1-b5-role-authority-matrix-v0.md) | IMMUTABLE |
| B6-REF-004 | [B4 Batch/Wave/Lane decomposition canon](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/docs/reference/q3m7y26-p1-b4-batch-wave-lane-decomposition-canon-v0.md) | IMMUTABLE |
| B6-REF-005 | [B3 Program Charter schema](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/docs/reference/q3m7y26-p1-b3-program-charter-schema-v0.md) | IMMUTABLE |
| B6-REF-006 | [A2 authority/evidence precedence](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md) | IMMUTABLE |
| B6-REF-007 | [A8 governance role/route reconciliation](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md) | IMMUTABLE |
| B6-REF-008 | [Prisma WorkPacket model](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/portal/prisma/schema.prisma) | IMMUTABLE |
| B6-REF-009 | [sotWorkPackets source](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/portal/src/lib/sotWorkPackets.ts) | IMMUTABLE |
| B6-REF-010 | [supervisedRoutePacket source](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/portal/src/lib/controlPlane/routePackets/supervisedRoutePacket.ts) | IMMUTABLE |
| B6-REF-011 | [Linear JAI-203](https://linear.app/jai-nexus/issue/JAI-203) | MUTABLE_CORROBORATING |
| B6-REF-012 | [local operating-loop Work Packet source](https://github.com/jai-nexus/dev-jai-nexus/blob/0d7316103bc96366bd781c8f1a09a3ea86e06bd1/portal/src/lib/controlPlane/motionKernel/local-operating-loop.ts) | IMMUTABLE |

## B6R2D Final Audit
| check | factual result |
| --- | --- |
| Immutable path resolution | PASS: 11 of 11 required paths resolved with local `git cat-file -e` at base `0d7316103bc96366bd781c8f1a09a3ea86e06bd1`. |
| Fixture and Field Registry | PASS: 16 type rows, 143 Field Registry rows, 45 fixture records, exact field order, and zero duplicate or unresolved local fixture IDs. |
| Evidence registry and joins | PASS: 12 evidence records, 11 immutable SHA-pinned references, one mutable non-controlling Linear mirror, and every B6-E-001 through B6-E-012 defined and used. |
| Validation contracts | PASS: B6-VAL-001 expected exit 0; B6-VAL-002 expected raw exit 1; both use STATIC_CONFIGURATION; no DOCUMENTARY evidence class remains. |
| Delivery authority | PASS: 11 records; EDIT is the sole GRANTED_BY_CURRENT_ROUTE action; ten actions require separate future routes. |
| Whitespace checks | PASS: `git diff --check` emitted zero diagnostics; no-index whitespace check emitted zero diagnostics with raw exit 1. |

## Non-authorizations
No positive acceptance, merge, deployment, external effect, Batch exit, Program exit, or activation authority. B7-B15 remain reserved.

B6_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_WORK_PACKET_CANON_ONLY
B6_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B6_FURTHER_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B6_WORK_PACKET_CANON
