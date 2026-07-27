# Q3M7Y26-P1 B7 Decision Token and Disposition Canon v0

## Status
| field | value |
| --- | --- |
| Role | JAI::DEV::BUILDER |
| Program | Q3M7Y26-P1 |
| Batch / Wave / Lane | B / B-B / B7 |
| Lane ID / parent relationship | P1-B-LANE-07 / P1-REL-012 |
| Route | CT-2026-07-27-Q3M7Y26-P1-START-B7-DECISION-TOKEN-DISPOSITION-CANON-v0 |
| Repository base | jai-nexus/dev-jai-nexus @ f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| Evidence ceiling | DOCUMENTATION_DECISION_TOKEN_DISPOSITION_CANON_ONLY |
| Linear | JAI-206 / MIRROR_ONLY / DO NOT ACCESS OR MUTATE |

## Purpose and Source Precedence
This canon defines a documentary, deterministic, fail-closed decision-token and
disposition model. It creates no token, route, credential, receipt, acceptance,
execution, lifecycle transition, or external effect.

A2 source precedence governs. HUMAN_OPERATOR is constitutional origin;
CONTROL_THREAD can act only inside fresh explicit human delegation. B1 supplies
lifecycle vocabulary. B2, B3, B4, B5, B6, A6, A8, the local operating-loop
source, and rolemap supply bounded identifiers or static-source context. Linear
is mutable corroboration only.

A decision token is distinct from a route identifier, authority principal,
portable role, Work Packet, disposition, evidence, receipt, acceptance receipt,
execution credential, lifecycle transition, and external effect. A valid token
would require exact subject, coordinates, authority source, scope, disposition,
conditions, action boundary, lifecycle, expiry/revocation boundary, and
evidence boundary. Authority is non-transitive and fails closed.

## Canonical Dispositions
| disposition | B1 mapping | semantics |
| --- | --- | --- |
| ACCEPT | B1-AX-05, B1-ST-ACC-02 to B1-ST-ACC-03 | Exact-subject proposed acceptance contract only; never delivery, integration, deployment, execution, customer effect, Batch exit, Program exit, or activation. |
| HOLD | B1-AX-07, B1-ST-CTL-01 to B1-ST-CTL-02 | Exact bounded proposed control posture only; never pauses or mutates external work. |
| REVISE | NO_LIFECYCLE_MAPPING | Returns only the exact candidate for revision; never accepts, cancels, or supersedes. |
| REJECT | B1-AX-05, B1-ST-ACC-02 to B1-ST-ACC-04 | Exact-candidate proposed rejection contract only; never cancels or mutates external work. |
| UNRESOLVED | NO_LIFECYCLE_MAPPING | Grants nothing and performs no transition. |

The table is a proposed transition contract, not a transition. CANCEL, REOPEN,
ROLLBACK, and SUPERSEDE are not defined here and remain reserved to B13.

## Canonical Record Types
| type_id | record_type | field_count | canonical ordinals |
| --- | --- | --- | --- |
| B7-TYPE-01 | decision_token_record | 15 | 1-15 |
| B7-TYPE-02 | decision_subject_record | 8 | 1-8 |
| B7-TYPE-03 | decision_authority_record | 15 | 1-15 |
| B7-TYPE-04 | decision_scope_record | 14 | 1-14 |
| B7-TYPE-05 | decision_disposition_record | 9 | 1-9 |
| B7-TYPE-06 | decision_condition_record | 7 | 1-7 |
| B7-TYPE-07 | decision_effect_record | 9 | 1-9 |
| B7-TYPE-08 | decision_evidence_boundary_record | 9 | 1-9 |
| B7-TYPE-09 | token_lifecycle_record | 12 | 1-12 |
| B7-TYPE-10 | non_authorization_record | 6 | 1-6 |

## Canonical Field Registry
Every record serializes its fields in ordinal order. Unknown keys, duplicate
keys, invalid enums, missing required fields, and unresolved references fail
closed. Null is valid only where declared.

| record_type | ordinal | field_name | value_type | cardinality | required_or_nullable | identifier_or_reference_rule |
| --- | --- | --- | --- | --- | --- | --- |
| decision_token_record | 1 | token_record_id | identifier | 1 | required | unique local record ID; never an issued token |
| decision_token_record | 2 | token_literal | opaque_decision_token or null | 0..1 | nullable | non-null value must be externally supplied by governing authority, nonempty, byte-preserved, never generated or inferred by B7, and distinct from a route, Work Packet, local record, receipt, or credential |
| decision_token_record | 3 | subject_id | reference<decision_subject_record> | 1 | required | resolves exactly once |
| decision_token_record | 4 | authority_id | reference<decision_authority_record> | 1 | required | resolves exactly once |
| decision_token_record | 5 | scope_id | reference<decision_scope_record> | 1 | required | resolves exactly once |
| decision_token_record | 6 | disposition_id | reference<decision_disposition_record> | 1 | required | resolves exactly once |
| decision_token_record | 7 | condition_ids | ordered array<reference<decision_condition_record>> | 1..* | required | every ID resolves once; order is significant |
| decision_token_record | 8 | effect_ids | ordered array<reference<decision_effect_record>> | 1..* | required | every ID resolves once; order is significant |
| decision_token_record | 9 | evidence_boundary_id | reference<decision_evidence_boundary_record> | 1 | required | resolves exactly once |
| decision_token_record | 10 | lifecycle_id | reference<token_lifecycle_record> | 1 | required | resolves exactly once |
| decision_token_record | 11 | base_sha | lowercase_sha40 | 1 | required | must byte-match the bound repository base |
| decision_token_record | 12 | head_sha | lowercase_sha40 or null | 0..1 | nullable | null does not imply a head or delivery event |
| decision_token_record | 13 | serialization_version | literal<decision-token/v0> | 1 | required | must equal decision-token/v0 exactly |
| decision_token_record | 14 | non_authorization_ids | ordered array<reference<non_authorization_record>> | 1..* | required | every ID resolves once; order is significant |
| decision_token_record | 15 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once in the Evidence Registry |
| decision_subject_record | 1 | subject_id | identifier | 1 | required | unique subject record ID |
| decision_subject_record | 2 | subject_kind | enum<DOCUMENTARY_ARTIFACT,WORK_PACKET,LIFECYCLE_OBJECT> | 1 | required | unknown values fail closed |
| decision_subject_record | 3 | program_code | reference<B2.program_code> | 1 | required | must bind exactly one accepted Program |
| decision_subject_record | 4 | batch_id | reference<B2.batch_id> | 1 | required | must byte-match an accepted batch |
| decision_subject_record | 5 | wave_id | reference<B2.wave_id> | 1 | required | must byte-match an accepted wave |
| decision_subject_record | 6 | lane_id | reference<B2.lane_id> | 1 | required | must byte-match an accepted lane |
| decision_subject_record | 7 | relationship_id | reference<B4.parent_child_relationship> | 1 | required | must resolve exactly once |
| decision_subject_record | 8 | subject_boundary | string | 1 | required | exact named subject boundary; no wildcard |
| decision_authority_record | 1 | authority_id | identifier | 1 | required | unique authority record ID |
| decision_authority_record | 2 | authority_principal_id | reference<B5.authority_principal_record> | 1 | required | must be HUMAN_OPERATOR or CONTROL_THREAD; portable role is invalid |
| decision_authority_record | 3 | authority_source | enum<NOT_ESTABLISHED,CONSTITUTIONAL_ORIGIN,DELEGATED_DECISION> | 1 | required | CONSTITUTIONAL_ORIGIN and DELEGATED_DECISION byte-match B5 authority-principal classifications; unknown values fail closed |
| decision_authority_record | 4 | portable_role_id | reference<B5.portable_role> or null | 0..1 | nullable | role is delivery context only, never a principal |
| decision_authority_record | 5 | actor_surface | string | 1 | required | names an evidentiary surface, not an authority principal |
| decision_authority_record | 6 | route_id | external_route_identifier | 1 | required | route is not a token and does not self-authorize |
| decision_authority_record | 7 | authorized_action_ids | ordered array<reference<B5.action_record>> | 0..* | required | empty array means no B5 action is authorized |
| decision_authority_record | 8 | delegation_reference | reference<B5.delegation_record> or null | 0..1 | nullable | null means no delegation is established |
| decision_authority_record | 9 | scope_binding | string | 1 | required | must describe exact subject and bounded scope |
| decision_authority_record | 10 | expiry_boundary | string | 1 | required | missing or expired boundary fails closed |
| decision_authority_record | 11 | revocation_boundary | string | 1 | required | missing or revoked boundary fails closed |
| decision_authority_record | 12 | single_use_policy | enum<REQUIRED,NOT_REQUIRED,UNRESOLVED> | 1 | required | policy alone is not enforcement |
| decision_authority_record | 13 | enforcement_state | enum<UNVERIFIED,VERIFIED> | 1 | required | VERIFIED requires later accepted integrity evidence |
| decision_authority_record | 14 | self_issuance_prohibited | boolean | 1 | required | must be true for any B7 document record |
| decision_authority_record | 15 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once in the Evidence Registry |
| decision_scope_record | 1 | scope_id | identifier | 1 | required | unique scope record ID |
| decision_scope_record | 2 | repository | string | 1 | required | must name one repository |
| decision_scope_record | 3 | base_sha | lowercase_sha40 | 1 | required | must byte-match the accepted base |
| decision_scope_record | 4 | head_sha | lowercase_sha40 or null | 0..1 | nullable | null cannot imply current-head authority |
| decision_scope_record | 5 | branch | string | 1 | required | must name one exact branch |
| decision_scope_record | 6 | path_allowlist | ordered array<string> | 1..* | required | every path is exact; wildcard paths fail closed |
| decision_scope_record | 7 | max_paths | integer | 1 | required | bounded nonnegative integer |
| decision_scope_record | 8 | action_allowlist | ordered array<reference<B5.action_record>> | 0..* | required | empty array authorizes no action |
| decision_scope_record | 9 | subject_id | reference<decision_subject_record> | 1 | required | resolves exactly once |
| decision_scope_record | 10 | coordinate_binding | string | 1 | required | must bind the exact Program, Batch, Wave, and Lane |
| decision_scope_record | 11 | scope_expansion_response | string | 1 | required | must fail closed |
| decision_scope_record | 12 | base_drift_response | string | 1 | required | must fail closed |
| decision_scope_record | 13 | action_drift_response | string | 1 | required | must fail closed |
| decision_scope_record | 14 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once in the Evidence Registry |
| decision_disposition_record | 1 | disposition_id | identifier | 1 | required | unique disposition record ID |
| decision_disposition_record | 2 | disposition | enum<ACCEPT,HOLD,REVISE,REJECT,UNRESOLVED> | 1 | required | must equal one canonical disposition |
| decision_disposition_record | 3 | subject_binding | string | 1 | required | must limit the disposition to one exact subject |
| decision_disposition_record | 4 | b1_axis_id | reference<B1.axis> or NO_LIFECYCLE_MAPPING | 1 | required | must name an accepted B1 axis or no mapping |
| decision_disposition_record | 5 | from_state | reference<B1.state> or NO_LIFECYCLE_MAPPING | 1 | required | must match the applicable B1 transition contract |
| decision_disposition_record | 6 | to_state | reference<B1.state> or NO_LIFECYCLE_MAPPING | 1 | required | must match the applicable B1 transition contract |
| decision_disposition_record | 7 | transition_posture | enum<PROPOSED_CONTRACT_ONLY,NO_TRANSITION> | 1 | required | does not perform a lifecycle transition |
| decision_disposition_record | 8 | authority_prerequisite | string | 1 | required | missing authority fails closed |
| decision_disposition_record | 9 | non_implications | ordered array<string> | 1..* | required | must enumerate excluded effects |
| decision_condition_record | 1 | condition_id | identifier | 1 | required | unique condition record ID |
| decision_condition_record | 2 | condition_kind | enum<SUBJECT,COORDINATE,AUTHORITY,SCOPE,EVIDENCE,LIFECYCLE> | 1 | required | unknown values fail closed |
| decision_condition_record | 3 | required_value | string | 1 | required | must be exact and bounded |
| decision_condition_record | 4 | observed_state | enum<SATISFIED,UNSATISFIED,UNRESOLVED> | 1 | required | UNRESOLVED cannot authorize |
| decision_condition_record | 5 | contradiction_response | string | 1 | required | must fail closed |
| decision_condition_record | 6 | freshness_requirement | string | 1 | required | stale evidence fails closed |
| decision_condition_record | 7 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once in the Evidence Registry |
| decision_effect_record | 1 | effect_id | identifier | 1 | required | unique effect record ID |
| decision_effect_record | 2 | effect_kind | enum<LIFECYCLE_PROPOSAL,ACCEPTANCE,EXECUTION,EXTERNAL_EFFECT> | 1 | required | unknown values fail closed |
| decision_effect_record | 3 | effect_state | enum<NOT_PERFORMED,PROPOSED_ONLY> | 1 | required | never proves an effect occurred |
| decision_effect_record | 4 | target_b1_axis | reference<B1.axis> or NO_LIFECYCLE_MAPPING | 1 | required | must not invent a B1 axis |
| decision_effect_record | 5 | acceptance_effect | boolean | 1 | required | true requires separate accepted evidence |
| decision_effect_record | 6 | execution_effect | boolean | 1 | required | true requires separate exact execution authority |
| decision_effect_record | 7 | external_effect | boolean | 1 | required | true requires separate direct evidence and authority |
| decision_effect_record | 8 | action_ids | ordered array<reference<B5.action_record>> | 0..* | required | empty array performs no action |
| decision_effect_record | 9 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once in the Evidence Registry |
| decision_evidence_boundary_record | 1 | evidence_boundary_id | identifier | 1 | required | unique evidence-boundary record ID |
| decision_evidence_boundary_record | 2 | source_precedence | reference<A2.source_precedence> | 1 | required | must follow accepted A2 precedence |
| decision_evidence_boundary_record | 3 | immutable_evidence_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once and is immutable |
| decision_evidence_boundary_record | 4 | mutable_evidence_ids | ordered array<evidence_pointer_id> | 0..* | required | mutable evidence is non-controlling |
| decision_evidence_boundary_record | 5 | required_evidence_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once |
| decision_evidence_boundary_record | 6 | observation_boundary | string | 1 | required | must state exact base or mirror observation boundary |
| decision_evidence_boundary_record | 7 | freshness_state | enum<CURRENT_AT_BASE,NOT_INDEPENDENTLY_REFRESHED,MIXED_EXPLICIT_BOUNDARIES> | 1 | required | MIXED_EXPLICIT_BOUNDARIES preserves separate immutable and mutable observation boundaries without upgrading mutable evidence; unknown values fail closed |
| decision_evidence_boundary_record | 8 | missing_evidence_response | string | 1 | required | missing or contradictory evidence fails closed |
| decision_evidence_boundary_record | 9 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once in the Evidence Registry |
| token_lifecycle_record | 1 | lifecycle_id | identifier | 1 | required | unique token-lifecycle record ID |
| token_lifecycle_record | 2 | token_state | enum<DRAFT,ISSUED,CLAIMED,CONSUMED,EXPIRED,REVOKED,INVALID> | 1 | required | must equal one bounded token state |
| token_lifecycle_record | 3 | predecessor_state | same enum or null | 0..1 | nullable | null is valid only for DRAFT |
| token_lifecycle_record | 4 | issuance_requirement | string | 1 | required | structural validation alone is insufficient |
| token_lifecycle_record | 5 | claim_requirement | string | 1 | required | claim requires later accepted integrity evidence |
| token_lifecycle_record | 6 | consume_requirement | string | 1 | required | consume requires later accepted receipt evidence |
| token_lifecycle_record | 7 | expiry_handling | string | 1 | required | expiry fails closed |
| token_lifecycle_record | 8 | revocation_handling | string | 1 | required | revocation fails closed |
| token_lifecycle_record | 9 | drift_handling | string | 1 | required | base, scope, subject, and action drift fail closed |
| token_lifecycle_record | 10 | lifecycle_transition_binding | string | 1 | required | token state changes no B1 axis by itself |
| token_lifecycle_record | 11 | integrity_state | enum<UNVERIFIED,VERIFIED> | 1 | required | VERIFIED requires later accepted integrity evidence |
| token_lifecycle_record | 12 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once in the Evidence Registry |
| non_authorization_record | 1 | non_authorization_id | identifier | 1 | required | unique non-authorization record ID |
| non_authorization_record | 2 | prohibited_effect | string | 1 | required | names one excluded effect |
| non_authorization_record | 3 | scope | string | 1 | required | must state the exact B7 boundary |
| non_authorization_record | 4 | reason | string | 1 | required | must state why no authority is created |
| non_authorization_record | 5 | required_future_route | external_route_requirement | 1 | required | names separately required authority; creates none |
| non_authorization_record | 6 | evidence_pointer_ids | ordered array<evidence_pointer_id> | 1..* | required | every ID resolves once in the Evidence Registry |

## Deterministic Serialization
- Record types serialize in declared canonical order.
- Records within each type sort by ascending local record ID.
- Fields serialize in Field Registry ordinal order.
- Arrays preserve declared order.
- NFC and LF normalization apply where textual values are normalized.
- Identifiers are unique and every reference resolves exactly once.
- Null differs from missing.
- Unknown and duplicate keys are rejected.
- No timestamp, randomness, UUID, hash, fingerprint, HMAC, actor email,
  credential, secret, or inferred authority is generated.

## Token Literal Boundary
B7 defines token binding and fail-closed usage only. A non-null token literal
must be externally supplied by the governing authority, nonempty,
byte-preserved, and distinct from a route ID, Work Packet ID, local record ID,
receipt ID, or credential. B7 does not generate a token literal or establish
cryptographic integrity or authenticity; integrity remains reserved to B10.

## Authority Contract
HUMAN_OPERATOR remains constitutional origin. CONTROL_THREAD is delegated
decision authority only inside current human delegation. A portable role is
never an authority principal. A route and a Work Packet are not decision tokens.
Linear is mirror-only. GitHub, CI, Vercel, checks, source code, and visible
controls are mechanical or evidentiary surfaces, not authority.

Completeness, schema validity, deterministic serialization, implementation
reachability, CI success, and merge cannot issue or validate authority. Missing,
stale, expired, revoked, reused, contradictory, subject-mismatched,
coordinate-mismatched, action-mismatched, or scope-expanded authority fails
closed. B7 cannot issue a token for itself.

## Current Structured Fixture
The fixture is unresolved documentary state only. It has no issued token,
authorized B5 action, lifecycle transition, acceptance effect, execution,
external effect, single-use enforcement claim, integrity claim, authenticity
claim, durable receipt, or exactly-once claim.

### decision_token_record
| field | value |
| --- | --- |
| token_record_id | B7-TOKEN-001 |
| token_literal | null |
| subject_id | B7-SUBJECT-001 |
| authority_id | B7-AUTH-001 |
| scope_id | B7-SCOPE-001 |
| disposition_id | B7-DISPOSITION-005 |
| condition_ids | [B7-CONDITION-001, B7-CONDITION-002, B7-CONDITION-003, B7-CONDITION-004, B7-CONDITION-005, B7-CONDITION-006] |
| effect_ids | [B7-EFFECT-001] |
| evidence_boundary_id | B7-EVIDENCE-BOUNDARY-001 |
| lifecycle_id | B7-LIFECYCLE-001 |
| base_sha | f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| head_sha | null |
| serialization_version | decision-token/v0 |
| non_authorization_ids | [B7-NONAUTH-001, B7-NONAUTH-002, B7-NONAUTH-003, B7-NONAUTH-004, B7-NONAUTH-005, B7-NONAUTH-006, B7-NONAUTH-007] |
| evidence_pointer_ids | [B7-E-001, B7-E-002, B7-E-003, B7-E-004, B7-E-005, B7-E-006, B7-E-007, B7-E-008, B7-E-009, B7-E-010, B7-E-011, B7-E-012] |

### decision_subject_record
| subject_id | subject_kind | program_code | batch_id | wave_id | lane_id | relationship_id | subject_boundary |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B7-SUBJECT-001 | DOCUMENTARY_ARTIFACT | Q3M7Y26-P1 | P1-BATCH-B | P1-B-WAVE-B | P1-B-LANE-07 | P1-REL-012 | Sole B7 documentary artifact |

### decision_authority_record
| authority_id | authority_principal_id | authority_source | portable_role_id | actor_surface | route_id | authorized_action_ids | delegation_reference | scope_binding | expiry_boundary | revocation_boundary | single_use_policy | enforcement_state | self_issuance_prohibited | evidence_pointer_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B7-AUTH-001 | B5-PRINCIPAL-002 | NOT_ESTABLISHED | B5-ROLE-003 | CODEX_CONTROL_THREAD | CT-2026-07-27-Q3M7Y26-P1-START-B7-DECISION-TOKEN-DISPOSITION-CANON-v0 | [] | null | Sole B7 artifact only | Route completion or base/scope drift | Human revocation or mismatch | UNRESOLVED | UNVERIFIED | true | [B7-E-005, B7-E-007, B7-E-009] |

### decision_scope_record
| scope_id | repository | base_sha | head_sha | branch | path_allowlist | max_paths | action_allowlist | subject_id | coordinate_binding | scope_expansion_response | base_drift_response | action_drift_response | evidence_pointer_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B7-SCOPE-001 | jai-nexus/dev-jai-nexus | f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e | null | docs/q3m7y26-p1-b7-decision-token-disposition-canon-v0 | [docs/reference/q3m7y26-p1-b7-decision-token-disposition-canon-v0.md] | 1 | [] | B7-SUBJECT-001 | Q3M7Y26-P1 / P1-BATCH-B / P1-B-WAVE-B / P1-B-LANE-07 / P1-REL-012 | HOLD without mutation | HOLD without mutation | HOLD without mutation | [B7-E-002, B7-E-004, B7-E-008] |

### decision_disposition_record
| disposition_id | disposition | subject_binding | b1_axis_id | from_state | to_state | transition_posture | authority_prerequisite | non_implications |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B7-DISPOSITION-001 | ACCEPT | Exact named subject | B1-AX-05 | B1-ST-ACC-02 | B1-ST-ACC-03 | PROPOSED_CONTRACT_ONLY | Fresh authorized acceptance decision | [No delivery, no integration, no deployment, no activation] |
| B7-DISPOSITION-002 | HOLD | Exact named subject | B1-AX-07 | B1-ST-CTL-01 | B1-ST-CTL-02 | PROPOSED_CONTRACT_ONLY | Fresh authorized control disposition | [No external pause, no external mutation] |
| B7-DISPOSITION-003 | REVISE | Exact candidate | NO_LIFECYCLE_MAPPING | NO_LIFECYCLE_MAPPING | NO_LIFECYCLE_MAPPING | NO_TRANSITION | Exact revision route | [No acceptance, no cancellation, no supersession] |
| B7-DISPOSITION-004 | REJECT | Exact candidate | B1-AX-05 | B1-ST-ACC-02 | B1-ST-ACC-04 | PROPOSED_CONTRACT_ONLY | Fresh authorized rejection decision | [No cancellation, no external mutation] |
| B7-DISPOSITION-005 | UNRESOLVED | Exact B7 documentary fixture | NO_LIFECYCLE_MAPPING | NO_LIFECYCLE_MAPPING | NO_LIFECYCLE_MAPPING | NO_TRANSITION | No authority established | [No grant, no transition, no effect] |

### decision_condition_record
| condition_id | condition_kind | required_value | observed_state | contradiction_response | freshness_requirement | evidence_pointer_ids |
| --- | --- | --- | --- | --- | --- | --- |
| B7-CONDITION-001 | SUBJECT | Exact B7-SUBJECT-001 | SATISFIED | HOLD | Exact subject match | [B7-E-002] |
| B7-CONDITION-002 | COORDINATE | Q3M7Y26-P1 / P1-BATCH-B / P1-B-WAVE-B / P1-B-LANE-07 / P1-REL-012 | SATISFIED | HOLD | Exact coordinate match | [B7-E-002, B7-E-004] |
| B7-CONDITION-003 | AUTHORITY | Fresh explicit decision-token issuance authority for the exact token subject and scope | UNSATISFIED | HOLD | Separate exact decision-token issuance route required | [B7-E-005, B7-E-007] |
| B7-CONDITION-004 | SCOPE | One named artifact and no action | SATISFIED | HOLD | Exact base, branch, path, and empty action set | [B7-E-008] |
| B7-CONDITION-005 | EVIDENCE | Required immutable evidence | SATISFIED | HOLD | Current at exact base | [B7-E-001, B7-E-006] |
| B7-CONDITION-006 | LIFECYCLE | No B1 transition | SATISFIED | HOLD | Exact disposition mapping | [B7-E-001] |

### decision_effect_record
| effect_id | effect_kind | effect_state | target_b1_axis | acceptance_effect | execution_effect | external_effect | action_ids | evidence_pointer_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B7-EFFECT-001 | LIFECYCLE_PROPOSAL | NOT_PERFORMED | NO_LIFECYCLE_MAPPING | false | false | false | [] | [B7-E-001, B7-E-005] |

### decision_evidence_boundary_record
| evidence_boundary_id | source_precedence | immutable_evidence_ids | mutable_evidence_ids | required_evidence_ids | observation_boundary | freshness_state | missing_evidence_response | evidence_pointer_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B7-EVIDENCE-BOUNDARY-001 | A2 source precedence | [B7-E-001, B7-E-002, B7-E-003, B7-E-004, B7-E-005, B7-E-006, B7-E-007, B7-E-008, B7-E-009, B7-E-010, B7-E-011] | [B7-E-012] | [B7-E-001, B7-E-002, B7-E-005, B7-E-007] | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e; Linear not independently refreshed | MIXED_EXPLICIT_BOUNDARIES | HOLD without inference | [B7-E-007, B7-E-012] |

### token_lifecycle_record
| lifecycle_id | token_state | predecessor_state | issuance_requirement | claim_requirement | consume_requirement | expiry_handling | revocation_handling | drift_handling | lifecycle_transition_binding | integrity_state | evidence_pointer_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B7-LIFECYCLE-001 | DRAFT | null | Governing authority and exact scope required; structural validation is not issuance | Later accepted integrity evidence required | Later accepted receipt evidence required | Expired token fails closed | Revoked token fails closed | Base, scope, subject, and action drift fail closed | Token state changes no B1 axis without separate accepted decision | UNVERIFIED | [B7-E-001, B7-E-006] |

### non_authorization_record
| non_authorization_id | prohibited_effect | scope | reason | required_future_route | evidence_pointer_ids |
| --- | --- | --- | --- | --- | --- |
| B7-NONAUTH-001 | Acceptance | B7 fixture | UNRESOLVED is not acceptance | FUTURE_EXACT_ACCEPTANCE_ROUTE_REQUIRED | [B7-E-005, B7-E-007] |
| B7-NONAUTH-002 | Delivery | B7 fixture | No delivery action is authorized | FUTURE_EXACT_DELIVERY_ROUTE_REQUIRED | [B7-E-005] |
| B7-NONAUTH-003 | Integration | B7 fixture | Token model is not repository integration | FUTURE_EXACT_INTEGRATION_ROUTE_REQUIRED | [B7-E-001] |
| B7-NONAUTH-004 | Deployment | B7 fixture | No deployment authority exists | FUTURE_EXACT_DEPLOY_ROUTE_REQUIRED | [B7-E-005] |
| B7-NONAUTH-005 | Execution and external effect | B7 fixture | No action or effect is authorized | FUTURE_EXACT_EXECUTION_ROUTE_REQUIRED | [B7-E-005, B7-E-010] |
| B7-NONAUTH-006 | Batch or Program exit | Q3M7Y26-P1 | Documentary canon grants no exit credit | FUTURE_EXACT_EXIT_ROUTE_REQUIRED | [B7-E-001] |
| B7-NONAUTH-007 | JAI activation | JAI NEXUS | Documentary canon grants no activation | FUTURE_EXACT_ACTIVATION_ROUTE_REQUIRED | [B7-E-001, B7-E-009] |

## Token Lifecycle
The only bounded states are DRAFT, ISSUED, CLAIMED, CONSUMED, EXPIRED,
REVOKED, and INVALID. Structural validation is not issuance. Issuance requires
governing authority and exact scope. Claiming or consuming cannot be asserted
durably without later accepted integrity or receipt evidence. A single-use
policy may be required, but enforcement is UNVERIFIED in the current fixture.
Expiry, revocation, base drift, scope drift, subject drift, and action drift
fail closed. Token state does not alter any B1 axis without a separately
accepted decision.

## Validation Rules
1. Reject unknown or missing fields.
2. Reject duplicate IDs and unresolved references.
3. Reject a disposition outside the five canonical values.
4. Reject a token state outside the seven bounded lifecycle values.
5. Reject an absent authority source or a portable role presented as principal.
6. Reject a route or Work Packet presented as a decision token.
7. Reject self-issued authority or any B7 self-issued token.
8. Reject subject, coordinate, base, head, path, or action mismatch.
9. Reject scope expansion, missing evidence, contradictory evidence, stale evidence, or mutable evidence treated as controlling.
10. Reject expired, revoked, reused, or unverified-single-use token use.
11. Reject a disposition/B1-axis mismatch.
12. Reject any positive external effect without separately accepted authority and direct evidence.

## Invalid Examples
| invalid_id | rejected claim | fail-closed response |
| --- | --- | --- |
| B7-INV-001 | Unknown field is accepted | INVALID |
| B7-INV-002 | Duplicate local ID is accepted | INVALID |
| B7-INV-003 | Unresolved reference is accepted | INVALID |
| B7-INV-004 | CANCEL is a canonical disposition | INVALID |
| B7-INV-005 | ACTIVE is a valid token state | INVALID |
| B7-INV-006 | Portable role is authority principal | INVALID |
| B7-INV-007 | Route identifier is token literal | INVALID |
| B7-INV-008 | Work Packet is token literal | INVALID |
| B7-INV-009 | B7 self-issues a token | INVALID |
| B7-INV-010 | Subject or coordinate mismatch proceeds | INVALID |
| B7-INV-011 | Base/head or path/action scope expands | INVALID |
| B7-INV-012 | Missing or contradictory evidence authorizes | INVALID |
| B7-INV-013 | Expired, revoked, reused, or unverified single-use token proceeds | INVALID |
| B7-INV-014 | Disposition causes mismatched B1 transition | INVALID |
| B7-INV-015 | Token creates an external effect | INVALID |

## Implementation Reconciliation
| surface | classification | bounded reconciliation |
| --- | --- | --- |
| B6 authority_token_reference | STATIC_CONFIGURATION | Nullable reference supports no grant when null and requires separately accepted B7 canon when non-null. |
| local operating-loop decision and proof behavior | STATIC_CONFIGURATION | Local decision/proof behavior is not token issuance, HMAC authenticity, persistence, replay prevention, deployed behavior, or external-effect evidence. |

## Evidence Registry
| evidence_id | source_class | immutability | reference | claim | observation_boundary |
| --- | --- | --- | --- | --- | --- |
| B7-E-001 | Repository canon | IMMUTABLE | [B1 lifecycle vocabulary and state machine](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md) | B1 lifecycle vocabulary and state machine; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-002 | Repository canon | IMMUTABLE | [B2 Control Coordinates canon](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md) | B2 Control Coordinates canon; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-003 | Repository canon | IMMUTABLE | [B3 Program Charter schema](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/docs/reference/q3m7y26-p1-b3-program-charter-schema-v0.md) | B3 Program Charter schema; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-004 | Repository canon | IMMUTABLE | [B4 Batch/Wave/Lane decomposition canon](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/docs/reference/q3m7y26-p1-b4-batch-wave-lane-decomposition-canon-v0.md) | B4 Batch/Wave/Lane decomposition canon; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-005 | Repository canon | IMMUTABLE | [B5 Role and Authority Matrix](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/docs/reference/q3m7y26-p1-b5-role-authority-matrix-v0.md) | B5 Role and Authority Matrix; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-006 | Repository canon | IMMUTABLE | [B6 Work Packet canon](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/docs/reference/q3m7y26-p1-b6-work-packet-canon-v0.md) | B6 Work Packet canon; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-007 | Repository canon | IMMUTABLE | [A2 authority/evidence precedence](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md) | A2 authority/evidence precedence; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-008 | Repository canon | IMMUTABLE | [A6 Control Coordinate registry](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/docs/reference/q3m7y26-p1-a6-control-coordinate-registry-v0.md) | A6 Control Coordinate registry; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-009 | Repository canon | IMMUTABLE | [A8 governance role/route reconciliation](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md) | A8 governance role/route reconciliation; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-010 | Static source | IMMUTABLE | [local operating-loop decision/proof behavior](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/portal/src/lib/controlPlane/motionKernel/local-operating-loop.ts) | local operating-loop decision/proof behavior; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-011 | Static source | IMMUTABLE | [role map](https://github.com/jai-nexus/dev-jai-nexus/blob/f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e/roles/rolemap.json) | role map; static or documentary evidence only | Base f9b5d84f5c0d8dce1f835daa4c82d2d1710f280e |
| B7-E-012 | Linear mirror | MUTABLE_CORROBORATING | Linear JAI-206 | MIRROR_ONLY / non-controlling / not independently refreshed | B7_ROUTE_OBSERVATION_ONLY_NOT_INDEPENDENTLY_REFRESHED |

## Reservations
| reservation_id | reserved subject |
| --- | --- |
| B7-R-001 | B8 Evidence Bundle Schema |
| B7-R-002 | B9 Receipt Taxonomy |
| B7-R-003 | B10 Acceptance Receipt and Integrity Schema |
| B7-R-004 | B11 Capability and Credit Ledger |
| B7-R-005 | B12 Exception and Out-of-Sequence Work Canon |
| B7-R-006 | B13 Rollback, Reopen, and Supersession Canon |
| B7-R-007 | B14 GitHub-Linear Mirror Protocol |
| B7-R-008 | B15 Lifecycle Canon Verification and Batch B Closeout |

## Risks and Rollback
Risk: a route, role, check, mirror, or local surface could be mistaken for a
token or authority. Mitigation: exact binding and fail-closed validation.
Rollback: a separately authorized documentary correction; no runtime or
external rollback applies because this artifact performs no external effect.

## Non-authorizations
No positive acceptance, delivery, integration, deployment, execution, external
effect, Batch exit, Program exit, or activation authority is granted. B8-B15
remain reserved.

B7_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_DECISION_TOKEN_DISPOSITION_CANON_ONLY
B7_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B7_FURTHER_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B7_DECISION_TOKEN_DISPOSITION_CANON
