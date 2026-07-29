# Q3M7Y26-P1 B10 Acceptance Receipt and Integrity Schema v0

## Status and Control Coordinates
| field | value |
| --- | --- |
| Program | Q3M7Y26-P1 |
| Batch | B — Program Lifecycle and Receipt Canon |
| Wave | B-C |
| Lane | B10R2 — Portable Receipt Subject-Binding Repair v0 |
| Lane ID | P1-B-LANE-10 |
| Relationship | P1-REL-015 |
| Route | REOPEN_BATCH_B_DOCUMENTARY_CANON_FOR_B10R2_PORTABILITY_REPAIR_ONLY |
| Role | JAI::DEV::BUILDER |
| Repository | jai-nexus/dev-jai-nexus |
| Required base | 3cd74bfa39d371a629e91cd7f17fa9743ee75c4f |
| Branch | docs/q3m7y26-p1-b10r2-portable-receipt-subject-binding-repair-v0 |
| Artifact | docs/reference/q3m7y26-p1-b10-acceptance-receipt-integrity-schema-v0.md |
| Linear mirror | JAI-207 / CONTROL_THREAD_VERIFIED / MIRROR_ONLY / NON_CONTROLLING / B10R2_ROUTED |
| Evidence ceiling | DOCUMENTATION_PORTABLE_RECEIPT_SUBJECT_BINDING_REPAIR_ONLY |

## Purpose and Source Precedence

B10 defines a prospective receipt-instance and integrity schema. An acceptance
receipt records an already-authorized bounded decision; it does not create that
decision. Classification, issuance, integrity checking, independent verification,
acceptance, repository integration, execution, and lifecycle transition remain
separate. Accepted decisions control authority, SHA-pinned repository evidence
controls repository content, and Linear is mirror-only. Missing receipt or
integrity evidence proves neither occurrence nor absence.

This B10R2 repair makes only the documentary subject binding portable. This
document issues no receipt, generates or verifies no digest or HMAC, accesses
no key, writes no replay or durable state, consumes no token, and moves no B1
axis.

## B9 Compatibility Boundary

The B9 class ID and name pair is exact and closed. Unknown, duplicate, missing,
or mismatched bindings fail closed. B10 does not alter B9 claim ceilings.
| class_id | class_name | binding_result | lifecycle_effect | authority_effect | evidence_id |
| --- | --- | --- | --- | --- | --- |
| B9-CLASS-001 | ACKNOWLEDGEMENT_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-002 | OBSERVATION_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-003 | VALIDATION_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-004 | DELIVERY_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-005 | DECISION_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-006 | INDEPENDENT_VERIFICATION_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-007 | CONTROL_ACCEPTANCE_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-008 | REPOSITORY_INTEGRATION_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-009 | EXECUTION_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-010 | EXTERNAL_EFFECT_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-011 | LIFECYCLE_TRANSITION_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-012 | RUNTIME_ACTIVATION_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-013 | MIRROR_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |
| B9-CLASS-014 | DEMONSTRATION_RECEIPT | EXACT_ID_NAME_MATCH_REQUIRED | NONE | NONE | B10-E-010 |

`CONTROL_ACCEPTANCE_RECEIPT` remains distinct from every other class.
`DEMONSTRATION_RECEIPT` cannot be upgraded into canonical acceptance.
Taxonomy and schema rows have no lifecycle or authority effect.

## Canonical Record Types
| record_type | field_count | global_ordinal_range | primary_identifier_field | unknown_key_rule |
| --- | --- | --- | --- | --- |
| receipt_candidate_record | 18 | 1-18 | candidate_id | UNKNOWN_OR_DUPLICATE_KEYS_INVALID |
| b9_class_binding_record | 7 | 19-25 | class_binding_id | UNKNOWN_OR_DUPLICATE_KEYS_INVALID |
| subject_coordinate_record | 14 | 26-39 | subject_binding_id | UNKNOWN_OR_DUPLICATE_KEYS_INVALID |
| decision_evidence_binding_record | 11 | 40-50 | binding_id | UNKNOWN_OR_DUPLICATE_KEYS_INVALID |
| payload_descriptor_record | 15 | 51-65 | payload_id | UNKNOWN_OR_DUPLICATE_KEYS_INVALID |
| integrity_boundary_record | 14 | 66-79 | integrity_id | UNKNOWN_OR_DUPLICATE_KEYS_INVALID |
| replay_durability_record | 15 | 80-94 | boundary_id | UNKNOWN_OR_DUPLICATE_KEYS_INVALID |
| evidence_pointer_record | 7 | 95-101 | evidence_id | UNKNOWN_OR_DUPLICATE_KEYS_INVALID |
| non_authorization_record | 6 | 102-107 | non_authorization_id | UNKNOWN_OR_DUPLICATE_KEYS_INVALID |

Canonical type order is the table order. Every primary identifier is unique.
Every reference resolves exactly once to its declared target.

## Field Registry
| record_type | ordinal | field | type | cardinality | required | reference_rule |
| --- | --- | --- | --- | --- | --- | --- |
| receipt_candidate_record | 1 | candidate_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| receipt_candidate_record | 2 | schema_version | literal<acceptance-receipt-integrity/v0> | 1 | required | NOT_A_REFERENCE |
| receipt_candidate_record | 3 | receipt_instance_id | nullable<opaque_receipt_instance_id> | 0..1 | required key; null until separately issued | NOT_A_REFERENCE |
| receipt_candidate_record | 4 | class_binding_id | reference<b9_class_binding_record.class_binding_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| receipt_candidate_record | 5 | subject_binding_id | reference<subject_coordinate_record.subject_binding_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| receipt_candidate_record | 6 | decision_binding_id | reference<decision_evidence_binding_record.binding_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| receipt_candidate_record | 7 | payload_id | reference<payload_descriptor_record.payload_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| receipt_candidate_record | 8 | integrity_id | reference<integrity_boundary_record.integrity_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| receipt_candidate_record | 9 | replay_durability_id | reference<replay_durability_record.boundary_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| receipt_candidate_record | 10 | non_authorization_ids | ordered array<reference<non_authorization_record.non_authorization_id>> | 1..* | required | EACH_RESOLVES_EXACTLY_ONCE |
| receipt_candidate_record | 11 | evidence_ids | ordered array<reference<evidence_pointer_record.evidence_id>> | 1..* | required | EACH_RESOLVES_EXACTLY_ONCE |
| receipt_candidate_record | 12 | issuance_state | closed enum<NOT_ISSUED, ISSUED, INVALID> | 1 | required | NOT_A_REFERENCE |
| receipt_candidate_record | 13 | b1_verification_posture | accepted B1 verification-axis state string | 1 | required | EXACT_B1_AXIS_VALUE |
| receipt_candidate_record | 14 | b1_acceptance_posture | accepted B1 acceptance-axis state string | 1 | required | EXACT_B1_AXIS_VALUE |
| receipt_candidate_record | 15 | lifecycle_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| receipt_candidate_record | 16 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| receipt_candidate_record | 17 | execution_occurrence | closed enum<NOT_ESTABLISHED, OBSERVED> | 1 | required | NOT_A_REFERENCE |
| receipt_candidate_record | 18 | external_effect_occurrence | closed enum<NOT_ESTABLISHED, OBSERVED> | 1 | required | NOT_A_REFERENCE |
| b9_class_binding_record | 1 | class_binding_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| b9_class_binding_record | 2 | class_id | closed enum<B9-CLASS-001..B9-CLASS-014> | 1 | required | EXACT_B9_CLASS_ID |
| b9_class_binding_record | 3 | class_name | closed enum<B9 receipt_class> | 1 | required | EXACT_B9_ID_NAME_PAIR |
| b9_class_binding_record | 4 | claim_ceiling | nonempty string | 1 | required | NOT_A_REFERENCE |
| b9_class_binding_record | 5 | b9_evidence_id | reference<evidence_pointer_record.evidence_id> | 1 | required | RESOLVES_EXACTLY_ONCE_TO_B9 |
| b9_class_binding_record | 6 | lifecycle_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| b9_class_binding_record | 7 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| subject_coordinate_record | 1 | subject_binding_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| subject_coordinate_record | 2 | program_id | reference<B2 program_code within accepted program_id+program_code binding> | 1 | required | RESOLVES_EXACTLY_ONCE_TO_ACCEPTED_B2_PROGRAM_BINDING |
| subject_coordinate_record | 3 | batch_id | reference<B4 batch_record.batch_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| subject_coordinate_record | 4 | wave_id | reference<B4 wave_record.wave_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| subject_coordinate_record | 5 | lane_id | reference<B4 lane_record.lane_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| subject_coordinate_record | 6 | relationship_id | reference<B4 parent_child_relationship.relationship_id> | 1 | required | RESOLVES_EXACTLY_ONCE |
| subject_coordinate_record | 7 | coordinate | reference<B4 lane_record.coordinate and B2 full_coordinate> | 1 | required | EXACT_COORDINATE_FOR_RESOLVED_PROGRAM_AND_LANE |
| subject_coordinate_record | 8 | repository | normalized nonempty owner/repo identifier | 1 | required | EXACT_SUBJECT_REPOSITORY |
| subject_coordinate_record | 9 | base_sha | exact 40-character Git SHA | 1 | required | EXACT_SUBJECT_REVISION |
| subject_coordinate_record | 10 | branch | nonempty exact routed branch string | 1 | required | EXACT_SUBJECT_BRANCH |
| subject_coordinate_record | 11 | artifact_path | exact repository-relative path | 1 | required | EXACT_SUBJECT_ARTIFACT_PATH |
| subject_coordinate_record | 12 | subject_type | bounded evidence-backed subject-type identifier | 1 | required | PAIRS_WITH_SUBJECT_ID_WITHOUT_CLOSED_VOCABULARY_INFERENCE |
| subject_coordinate_record | 13 | subject_id | stable evidence-backed subject identifier | 1 | required | UNIQUE_WITH_SUBJECT_TYPE_WITHIN_EXACT_SCOPE |
| subject_coordinate_record | 14 | evidence_ids | ordered array<reference<evidence_pointer_record.evidence_id>> | 1..* | required | EACH_RESOLVES_EXACTLY_ONCE |
| decision_evidence_binding_record | 1 | binding_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| decision_evidence_binding_record | 2 | b7_token_instance_id | nullable<opaque B7 token instance ID> | 0..1 | required key | NULL_UNTIL_SEPARATELY_ESTABLISHED |
| decision_evidence_binding_record | 3 | b7_disposition | closed enum<ACCEPT, HOLD, REVISE, REJECT, UNRESOLVED> | 1 | required | EXACT_B7_VOCABULARY |
| decision_evidence_binding_record | 4 | b8_bundle_instance_id | nullable<opaque B8 bundle instance ID> | 0..1 | required key | NULL_UNTIL_SEPARATELY_ESTABLISHED |
| decision_evidence_binding_record | 5 | authority_source_id | nullable<authority principal identifier> | 0..1 | required key | NULL_UNTIL_SEPARATELY_ESTABLISHED |
| decision_evidence_binding_record | 6 | delegation_reference | nullable<opaque delegation reference> | 0..1 | required key | NULL_UNTIL_SEPARATELY_ESTABLISHED |
| decision_evidence_binding_record | 7 | verification_posture | literal<NOT_VERIFIED> | 1 | required | NOT_A_REFERENCE |
| decision_evidence_binding_record | 8 | acceptance_posture | literal<NOT_ACCEPTED> | 1 | required | NOT_A_REFERENCE |
| decision_evidence_binding_record | 9 | decision_evidence_state | closed enum<NOT_ESTABLISHED, ESTABLISHED, INVALID> | 1 | required | NOT_A_REFERENCE |
| decision_evidence_binding_record | 10 | evidence_ids | ordered array<reference<evidence_pointer_record.evidence_id>> | 1..* | required | EACH_RESOLVES_EXACTLY_ONCE |
| decision_evidence_binding_record | 11 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 1 | payload_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| payload_descriptor_record | 2 | schema_version | literal<acceptance-receipt-integrity/v0> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 3 | encoding | literal<UTF-8> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 4 | unicode_normalization | literal<NFC> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 5 | line_endings | literal<LF> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 6 | type_order | literal<DECLARED> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 7 | field_order | literal<DECLARED_ORDINAL> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 8 | array_order | literal<DECLARED> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 9 | null_distinct_from_missing | literal<true> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 10 | unknown_keys_rejected | literal<true> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 11 | duplicate_keys_rejected | literal<true> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 12 | environment_values_prohibited | literal<true> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 13 | generated_values_prohibited | literal<true> | 1 | required | NOT_A_REFERENCE |
| payload_descriptor_record | 14 | evidence_ids | ordered array<reference<evidence_pointer_record.evidence_id>> | 1..* | required | EACH_RESOLVES_EXACTLY_ONCE |
| payload_descriptor_record | 15 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| integrity_boundary_record | 1 | integrity_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| integrity_boundary_record | 2 | digest_algorithm | closed enum<SHA-256, UNAVAILABLE> | 1 | required | NOT_A_REFERENCE |
| integrity_boundary_record | 3 | digest_value | nullable<lowercase hexadecimal digest> | 0..1 | required key | NULL_IN_SAFE_FIXTURE |
| integrity_boundary_record | 4 | authenticity_algorithm | closed enum<HMAC-SHA-256, UNAVAILABLE> | 1 | required | NOT_A_REFERENCE |
| integrity_boundary_record | 5 | hmac_value | nullable<lowercase hexadecimal MAC> | 0..1 | required key | NULL_IN_SAFE_FIXTURE |
| integrity_boundary_record | 6 | key_reference_id | nullable<opaque non-secret key reference> | 0..1 | required key | NULL_IN_SAFE_FIXTURE |
| integrity_boundary_record | 7 | key_version | nullable<opaque key version> | 0..1 | required key | NULL_IN_SAFE_FIXTURE |
| integrity_boundary_record | 8 | signature_support | literal<UNAVAILABLE> | 1 | required | NOT_A_REFERENCE |
| integrity_boundary_record | 9 | integrity_state | closed enum<UNVERIFIED, VERIFIED, INVALID> | 1 | required | NOT_A_REFERENCE |
| integrity_boundary_record | 10 | authenticity_state | closed enum<NOT_ESTABLISHED, VERIFIED, INVALID> | 1 | required | NOT_A_REFERENCE |
| integrity_boundary_record | 11 | trusted_computation_state | closed enum<NOT_ESTABLISHED, ESTABLISHED, INVALID> | 1 | required | NOT_A_REFERENCE |
| integrity_boundary_record | 12 | issuer_authority_state | closed enum<NOT_ESTABLISHED, ESTABLISHED, INVALID> | 1 | required | NOT_A_REFERENCE |
| integrity_boundary_record | 13 | evidence_ids | ordered array<reference<evidence_pointer_record.evidence_id>> | 1..* | required | EACH_RESOLVES_EXACTLY_ONCE |
| integrity_boundary_record | 14 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| replay_durability_record | 1 | boundary_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| replay_durability_record | 2 | replay_key | nullable<opaque replay-key identifier> | 0..1 | required key | NULL_IN_SAFE_FIXTURE |
| replay_durability_record | 3 | freshness_boundary | nullable<explicit freshness boundary> | 0..1 | required key | NULL_IN_SAFE_FIXTURE |
| replay_durability_record | 4 | anti_replay_state | closed enum<UNAVAILABLE, NOT_ESTABLISHED, ESTABLISHED, INVALID> | 1 | required | NOT_A_REFERENCE |
| replay_durability_record | 5 | persistence_medium | nullable<identified durable medium> | 0..1 | required key | NULL_IN_SAFE_FIXTURE |
| replay_durability_record | 6 | write_evidence_id | nullable<reference<evidence_pointer_record.evidence_id>> | 0..1 | required key | NULL_IN_SAFE_FIXTURE |
| replay_durability_record | 7 | readback_evidence_id | nullable<reference<evidence_pointer_record.evidence_id>> | 0..1 | required key | NULL_IN_SAFE_FIXTURE |
| replay_durability_record | 8 | durability_state | closed enum<UNAVAILABLE, NOT_ESTABLISHED, ESTABLISHED, INVALID> | 1 | required | NOT_A_REFERENCE |
| replay_durability_record | 9 | uniqueness_enforcement_state | closed enum<UNAVAILABLE, NOT_ESTABLISHED, ESTABLISHED, INVALID> | 1 | required | NOT_A_REFERENCE |
| replay_durability_record | 10 | idempotency_state | closed enum<UNAVAILABLE, NOT_ESTABLISHED, ESTABLISHED, INVALID> | 1 | required | NOT_A_REFERENCE |
| replay_durability_record | 11 | atomic_consumption_state | closed enum<UNAVAILABLE, NOT_ESTABLISHED, ESTABLISHED, INVALID> | 1 | required | NOT_A_REFERENCE |
| replay_durability_record | 12 | exactly_once_state | closed enum<UNAVAILABLE, NOT_ESTABLISHED, ESTABLISHED, INVALID> | 1 | required | NOT_A_REFERENCE |
| replay_durability_record | 13 | consumption_state | closed enum<NOT_ESTABLISHED, CLAIMED, CONSUMED, INVALID> | 1 | required | NOT_A_REFERENCE |
| replay_durability_record | 14 | evidence_ids | ordered array<reference<evidence_pointer_record.evidence_id>> | 1..* | required | EACH_RESOLVES_EXACTLY_ONCE |
| replay_durability_record | 15 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| evidence_pointer_record | 1 | evidence_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| evidence_pointer_record | 2 | source_class | closed enum<REPOSITORY_CANON, STATIC_CONFIGURATION, TESTED, MUTABLE_CORROBORATING> | 1 | required | NOT_A_REFERENCE |
| evidence_pointer_record | 3 | immutability | closed enum<IMMUTABLE, MUTABLE_CORROBORATING> | 1 | required | NOT_A_REFERENCE |
| evidence_pointer_record | 4 | reference | nonempty string | 1 | required | EXTERNAL_POINTER |
| evidence_pointer_record | 5 | claim | nonempty bounded string | 1 | required | NOT_A_REFERENCE |
| evidence_pointer_record | 6 | observation_boundary | nonempty bounded string | 1 | required | NOT_A_REFERENCE |
| evidence_pointer_record | 7 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 1 | non_authorization_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| non_authorization_record | 2 | prohibited_effect | closed B10 prohibited-effect string | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 3 | reason | nonempty bounded string | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 4 | required_future_route | nonempty bounded string | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 5 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 6 | evidence_ids | ordered array<reference<evidence_pointer_record.evidence_id>> | 1..* | required | EACH_RESOLVES_EXACTLY_ONCE |

## Deterministic Canonicalization

Types use declared order, records use ascending IDs, fields use declared ordinal
order, and arrays preserve declared order. Encoding is UTF-8, Unicode text is
NFC-normalized, and line endings are LF. Null differs from missing. Unknown or
duplicate keys and IDs are invalid. Canonical construction uses no current
timestamp, randomness, UUID, environment value, or implicit default.

A digest can compare deterministic content only. It cannot prove authenticity,
authority, acceptance, non-repudiation, durability, execution, or effect occurrence.

## Portable Subject Binding Boundary

The historical field name `program_id` is retained to preserve the 14-field
schema and fixture. Its value must resolve to B2 `program_code`, which must in
turn resolve through exactly one accepted B2 `program_id` plus `program_code`
binding. It is not an unconstrained display label. `batch_id`, `wave_id`,
`lane_id`, and `relationship_id` resolve through B4 `batch_record`,
`wave_record`, `lane_record`, and `parent_child_relationship`.

The complete Program, Batch, Wave, Lane, relationship, and coordinate tuple
must describe one coherent subject. The relationship must connect the resolved
Wave to the resolved Lane, the Lane must belong to the resolved Wave, the Wave
must belong to the resolved Batch, and the coordinate must equal the resolved
B2 full coordinate and B4 Lane coordinate. Repository, SHA, branch, artifact
path, subject type, subject ID, and evidence must all describe that same
subject. A mutable Linear identifier cannot substitute for canonical identity.
Unknown, conflicting, cross-subject, display-only, or duplicate bindings fail
closed.

`subject_type` and `subject_id` form one stable, evidence-backed identity pair
that is unique within the exact repository, revision, coordinate, and artifact
scope. B10R2 does not create an incomplete closed subject-type vocabulary.
Portability is schema representability only and grants no issuance,
acceptance, transition, execution, lifecycle, exit, D9, or external-effect
authority.

| compatibility_id | bounded subject | subject evidence | portability posture | receipt issuance | acceptance or transition | authority effect |
| --- | --- | --- | --- | --- | --- | --- |
| B10R2-PORT-001 | Existing B10 documentary fixture | B10-SUBJECT-BINDING-001 / B10-E-003 / B10-E-005 / B10-E-010 | PASS_AS_PORTABLE_SCHEMA_INSTANCE | NOT_ISSUED | NONE | NONE |
| B10R2-PORT-002 | Integrated B15R2 documentary decision | B10-E-015 | REPRESENTABLE_BY_SCHEMA / NOT_INSTANTIATED | NOT_ISSUED | NONE / NOT_PERFORMED_BY_PORTABILITY | NONE |
| B10R2-PORT-003 | Prospective Batch B lifecycle-transition candidate | SUBJECT_VALUES_UNAVAILABLE | REPRESENTABLE_IN_PRINCIPLE / SUBJECT_VALUES_UNAVAILABLE / NOT_INSTANTIATED | NOT_ISSUED | NONE / NOT_PERFORMED | NONE |

## Digest and Authenticity Boundary

`SHA-256` and `HMAC-SHA-256` are source-grounded static vocabularies only.
A digest differs from an HMAC. HMAC is neither a digital signature nor a
non-repudiation mechanism. An opaque key reference may be represented, but key
bytes, credentials, custody, rotation, trust, and authorization remain unavailable.
Syntax cannot prove trusted computation or authorized issuance. Digital-signature
support remains `UNAVAILABLE`.

## Anti-Replay, Durability, and Exactly-Once Boundary

Receipt IDs, uniqueness, digests, and HMACs do not prove replay prevention or
single consumption. Anti-replay requires an exact replay-key and subject/basis
binding, freshness boundary, and durable state evidence. Durability requires an
identified medium plus write and readback evidence. Clipboard, browser memory,
UI, local variables, logs, Markdown, PR text, and demonstrations are not durable
stores. Exactly-once requires atomic durable consumption, uniqueness or
idempotency enforcement, and direct evidence of the exact result. B10 implements
none of those mechanisms; unsupported properties remain `UNAVAILABLE` or
`NOT_ESTABLISHED`.

## Safe Non-Issued Fixture

The fixture is a documentary candidate, not an issued receipt. It includes no
digest, HMAC, signature, key, nonce, credential, actor email, or proof value.

```json
{
  "receipt_candidate_record": {
    "candidate_id": "B10-CANDIDATE-001",
    "schema_version": "acceptance-receipt-integrity/v0",
    "receipt_instance_id": null,
    "class_binding_id": "B10-CLASS-BINDING-001",
    "subject_binding_id": "B10-SUBJECT-BINDING-001",
    "decision_binding_id": "B10-DECISION-BINDING-001",
    "payload_id": "B10-PAYLOAD-001",
    "integrity_id": "B10-INTEGRITY-001",
    "replay_durability_id": "B10-REPLAY-DURABILITY-001",
    "non_authorization_ids": [
      "B10-NONAUTH-001",
      "B10-NONAUTH-002",
      "B10-NONAUTH-003",
      "B10-NONAUTH-004",
      "B10-NONAUTH-005",
      "B10-NONAUTH-006",
      "B10-NONAUTH-007",
      "B10-NONAUTH-008",
      "B10-NONAUTH-009",
      "B10-NONAUTH-010",
      "B10-NONAUTH-011",
      "B10-NONAUTH-012"
    ],
    "evidence_ids": [
      "B10-E-001",
      "B10-E-002",
      "B10-E-003",
      "B10-E-004",
      "B10-E-005",
      "B10-E-006",
      "B10-E-007",
      "B10-E-008",
      "B10-E-009",
      "B10-E-010",
      "B10-E-011",
      "B10-E-012",
      "B10-E-013"
    ],
    "issuance_state": "NOT_ISSUED",
    "b1_verification_posture": "NOT_VERIFIED",
    "b1_acceptance_posture": "NOT_ACCEPTED",
    "lifecycle_effect": "NONE",
    "authority_effect": "NONE",
    "execution_occurrence": "NOT_ESTABLISHED",
    "external_effect_occurrence": "NOT_ESTABLISHED"
  },
  "b9_class_binding_record": {
    "class_binding_id": "B10-CLASS-BINDING-001",
    "class_id": "B9-CLASS-007",
    "class_name": "CONTROL_ACCEPTANCE_RECEIPT",
    "claim_ceiling": "DOCUMENTATION_ACCEPTANCE_RECEIPT_INTEGRITY_SCHEMA_ONLY",
    "b9_evidence_id": "B10-E-010",
    "lifecycle_effect": "NONE",
    "authority_effect": "NONE"
  },
  "subject_coordinate_record": {
    "subject_binding_id": "B10-SUBJECT-BINDING-001",
    "program_id": "Q3M7Y26-P1",
    "batch_id": "P1-BATCH-B",
    "wave_id": "P1-B-WAVE-C",
    "lane_id": "P1-B-LANE-10",
    "relationship_id": "P1-REL-015",
    "coordinate": "Q3M7Y26-P1:B10",
    "repository": "jai-nexus/dev-jai-nexus",
    "base_sha": "5eff88be70610bb774af687d33b94a7de63c229e",
    "branch": "docs/q3m7y26-p1-b10-acceptance-receipt-integrity-schema-v0",
    "artifact_path": "docs/reference/q3m7y26-p1-b10-acceptance-receipt-integrity-schema-v0.md",
    "subject_type": "DOCUMENTARY_SCHEMA_CANDIDATE",
    "subject_id": "B10-ACCEPTANCE-RECEIPT-INTEGRITY-SCHEMA-v0",
    "evidence_ids": [
      "B10-E-003",
      "B10-E-005",
      "B10-E-010"
    ]
  },
  "decision_evidence_binding_record": {
    "binding_id": "B10-DECISION-BINDING-001",
    "b7_token_instance_id": null,
    "b7_disposition": "UNRESOLVED",
    "b8_bundle_instance_id": null,
    "authority_source_id": null,
    "delegation_reference": null,
    "verification_posture": "NOT_VERIFIED",
    "acceptance_posture": "NOT_ACCEPTED",
    "decision_evidence_state": "NOT_ESTABLISHED",
    "evidence_ids": [
      "B10-E-002",
      "B10-E-008",
      "B10-E-009",
      "B10-E-010"
    ],
    "authority_effect": "NONE"
  },
  "payload_descriptor_record": {
    "payload_id": "B10-PAYLOAD-001",
    "schema_version": "acceptance-receipt-integrity/v0",
    "encoding": "UTF-8",
    "unicode_normalization": "NFC",
    "line_endings": "LF",
    "type_order": "DECLARED",
    "field_order": "DECLARED_ORDINAL",
    "array_order": "DECLARED",
    "null_distinct_from_missing": true,
    "unknown_keys_rejected": true,
    "duplicate_keys_rejected": true,
    "environment_values_prohibited": true,
    "generated_values_prohibited": true,
    "evidence_ids": [
      "B10-E-001",
      "B10-E-002",
      "B10-E-010",
      "B10-E-011",
      "B10-E-012"
    ],
    "authority_effect": "NONE"
  },
  "integrity_boundary_record": {
    "integrity_id": "B10-INTEGRITY-001",
    "digest_algorithm": "SHA-256",
    "digest_value": null,
    "authenticity_algorithm": "HMAC-SHA-256",
    "hmac_value": null,
    "key_reference_id": null,
    "key_version": null,
    "signature_support": "UNAVAILABLE",
    "integrity_state": "UNVERIFIED",
    "authenticity_state": "NOT_ESTABLISHED",
    "trusted_computation_state": "NOT_ESTABLISHED",
    "issuer_authority_state": "NOT_ESTABLISHED",
    "evidence_ids": [
      "B10-E-010",
      "B10-E-011",
      "B10-E-012"
    ],
    "authority_effect": "NONE"
  },
  "replay_durability_record": {
    "boundary_id": "B10-REPLAY-DURABILITY-001",
    "replay_key": null,
    "freshness_boundary": null,
    "anti_replay_state": "UNAVAILABLE",
    "persistence_medium": null,
    "write_evidence_id": null,
    "readback_evidence_id": null,
    "durability_state": "UNAVAILABLE",
    "uniqueness_enforcement_state": "UNAVAILABLE",
    "idempotency_state": "UNAVAILABLE",
    "atomic_consumption_state": "UNAVAILABLE",
    "exactly_once_state": "UNAVAILABLE",
    "consumption_state": "NOT_ESTABLISHED",
    "evidence_ids": [
      "B10-E-010",
      "B10-E-011",
      "B10-E-012",
      "B10-E-013"
    ],
    "authority_effect": "NONE"
  }
}
```

All fixture objects use the exact Field Registry order. Evidence Pointer and
Non-Authorization records are the ID-backed tables below. The fixture establishes
neither occurrence nor absence of execution or external effects.

## Evidence Pointer Registry
| evidence_id | source_class | immutability | reference | claim | observation_boundary | authority_effect |
| --- | --- | --- | --- | --- | --- | --- |
| B10-E-001 | REPOSITORY_CANON | IMMUTABLE | [A2](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md) | Authority and evidence precedence | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-002 | REPOSITORY_CANON | IMMUTABLE | [B1](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md) | Independent lifecycle axes and state boundaries | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-003 | REPOSITORY_CANON | IMMUTABLE | [B2](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md) | Control Coordinate identity binding | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-004 | REPOSITORY_CANON | IMMUTABLE | [B3](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-b3-program-charter-schema-v0.md) | Program charter and unresolved-boundary discipline | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-005 | REPOSITORY_CANON | IMMUTABLE | [B4](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-b4-batch-wave-lane-decomposition-canon-v0.md) | B10 identity, relationship, Wave, and mirror mapping | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-006 | REPOSITORY_CANON | IMMUTABLE | [B5](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-b5-role-authority-matrix-v0.md) | Authority principal and action boundaries | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-007 | REPOSITORY_CANON | IMMUTABLE | [B6](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-b6-work-packet-canon-v0.md) | Work Packet and delivery authority separation | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-008 | REPOSITORY_CANON | IMMUTABLE | [B7](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-b7-decision-token-disposition-canon-v0.md) | Decision token and disposition boundaries | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-009 | REPOSITORY_CANON | IMMUTABLE | [B8](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-b8-evidence-bundle-schema-v0.md) | Evidence Bundle boundary | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-010 | REPOSITORY_CANON | IMMUTABLE | [B9](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/docs/reference/q3m7y26-p1-b9-receipt-taxonomy-v0.md) | Receipt classes and B10 reservation | Required base 5eff88be70610bb774af687d33b94a7de63c229e | NONE |
| B10-E-011 | STATIC_CONFIGURATION | IMMUTABLE | [portal/src/lib/controlPlane/motionKernel/local-operating-loop.ts](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/portal/src/lib/controlPlane/motionKernel/local-operating-loop.ts) | Static local-shadow receipt, proof, digest, HMAC, and ID structures | Required base 5eff88be70610bb774af687d33b94a7de63c229e; no runtime inference | NONE |
| B10-E-012 | STATIC_CONFIGURATION | IMMUTABLE | [portal/src/lib/controlPlane/motionKernel/local-operating-loop.test.ts](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/portal/src/lib/controlPlane/motionKernel/local-operating-loop.test.ts) | Behavioral test source exists; B10 does not rerun or claim passage | Required base 5eff88be70610bb774af687d33b94a7de63c229e; no runtime inference | NONE |
| B10-E-013 | STATIC_CONFIGURATION | IMMUTABLE | [portal/src/lib/controlPlane/sandboxNexus/sandboxReceiptReturnDisplay.test.ts](https://github.com/jai-nexus/dev-jai-nexus/blob/5eff88be70610bb774af687d33b94a7de63c229e/portal/src/lib/controlPlane/sandboxNexus/sandboxReceiptReturnDisplay.test.ts) | Sandbox receipt-display test source exists; B10 does not rerun it | Required base 5eff88be70610bb774af687d33b94a7de63c229e; no runtime inference | NONE |
| B10-E-014 | MUTABLE_CORROBORATING | MUTABLE_CORROBORATING | Linear JAI-207 | MIRROR_ONLY / NON_CONTROLLING | CONTROL_THREAD_VERIFIED / MIRROR_ONLY / NON_CONTROLLING / B10R2_ROUTED | NONE |
| B10-E-015 | REPOSITORY_CANON | IMMUTABLE | [B15R2](https://github.com/jai-nexus/dev-jai-nexus/blob/3cd74bfa39d371a629e91cd7f17fa9743ee75c4f/docs/reference/q3m7y26-p1-b15r2-batch-b-control-thread-closeout-decision-candidate-v0.md) | Integrated B15R2 documentary closeout decision | Required base 3cd74bfa39d371a629e91cd7f17fa9743ee75c4f | NONE |

Codex file execution did not access Linear. The JAI-207 observation was
supplied by CONTROL_THREAD and remains mutable, mirror-only, and
non-controlling.

## Non-Authorization Records
| non_authorization_id | prohibited_effect | reason | required_future_route | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- |
| B10-NONAUTH-001 | RECEIPT_ISSUANCE | A schema candidate is not an issued receipt | Fresh exact receipt-issuance route with established decision and evidence | NONE | ["B10-E-001","B10-E-008","B10-E-009","B10-E-010"] |
| B10-NONAUTH-002 | CRYPTOGRAPHIC_COMPUTATION_OR_VERIFICATION | B10 defines metadata only and performs no digest, HMAC, or signature operation | Separately reviewed implementation and execution route | NONE | ["B10-E-010","B10-E-011","B10-E-012"] |
| B10-NONAUTH-003 | KEY_ACCESS_OR_TRUST | No key bytes, credentials, custody, rotation, trust, or authorization are established | Separately governed key-management and security route | NONE | ["B10-E-001","B10-E-006","B10-E-011"] |
| B10-NONAUTH-004 | REPLAY_OR_DURABLE_STORE_MUTATION | No replay ledger, persistence medium, write, or readback exists in this lane | Separately reviewed persistence and anti-replay implementation route | NONE | ["B10-E-010","B10-E-011","B10-E-012"] |
| B10-NONAUTH-005 | TOKEN_CLAIM_OR_CONSUMPTION | B7 token state and exactly-once consumption remain unestablished | Fresh B7-compatible consumption route with durable atomic evidence | NONE | ["B10-E-007","B10-E-008","B10-E-010"] |
| B10-NONAUTH-006 | INDEPENDENT_VERIFICATION | Builder authoring and author-side checks are not independent verification | Separately routed Verifier review | NONE | ["B10-E-002","B10-E-006","B10-E-009"] |
| B10-NONAUTH-007 | CONTROL_ACCEPTANCE_OR_LIFECYCLE_TRANSITION | A receipt schema cannot create acceptance or move a B1 axis | Fresh HUMAN_OPERATOR-origin or delegated CONTROL_THREAD decision | NONE | ["B10-E-001","B10-E-002","B10-E-008","B10-E-010"] |
| B10-NONAUTH-008 | GIT_DELIVERY_OR_INTEGRATION | File execution does not authorize stage, commit, push, PR, merge, or branch deletion | Separately authorized exact-head Git delivery route | NONE | ["B10-E-003","B10-E-006","B10-E-007"] |
| B10-NONAUTH-009 | GITHUB_OR_LINEAR_MUTATION | Repository and mirror systems remain outside file-execution authority | Separately authorized target-specific mutation route | NONE | ["B10-E-001","B10-E-005","B10-E-014"] |
| B10-NONAUTH-010 | EXECUTION_OR_EXTERNAL_EFFECT | B10 establishes neither occurrence nor absence of execution or external effects | Separately governed action route with direct bounded evidence | NONE | ["B10-E-001","B10-E-006","B10-E-010","B10-E-011"] |
| B10-NONAUTH-011 | DOWNSTREAM_LANES_OR_EXIT | B11-B15, Batch B exit, D9, and Program exit remain separately governed | Applicable later Lane plus separate closeout decision | NONE | ["B10-E-002","B10-E-004","B10-E-005","B10-E-010"] |
| B10-NONAUTH-012 | AGENT_COUNCIL_OR_JAI_ACTIVATION | Documentary schema work creates no activation authority or runtime capability | Separately governed future activation route | NONE | ["B10-E-001","B10-E-002","B10-E-006"] |

## Validation and Fail-Closed Examples
| invalid_id | invalid_condition | required_response |
| --- | --- | --- |
| B10-INV-001 | B9 class ID/name mismatch | INVALID / FAIL_CLOSED |
| B10-INV-002 | Unknown or duplicate B9 receipt class | INVALID / FAIL_CLOSED |
| B10-INV-003 | Missing or mismatched subject binding | INVALID / FAIL_CLOSED |
| B10-INV-004 | Stale or mismatched Control Coordinates | INVALID / FAIL_CLOSED |
| B10-INV-005 | Missing B7, B8, or B9 boundary binding | INVALID / FAIL_CLOSED |
| B10-INV-006 | Mutable-only evidence treated as controlling | INVALID / FAIL_CLOSED |
| B10-INV-007 | Digest treated as authenticity | INVALID / FAIL_CLOSED |
| B10-INV-008 | HMAC treated as authority, signature, or non-repudiation | INVALID / FAIL_CLOSED |
| B10-INV-009 | Key bytes, credential, or secret value embedded | INVALID / FAIL_CLOSED |
| B10-INV-010 | Replay prevention inferred from uniqueness or receipt ID | INVALID / FAIL_CLOSED |
| B10-INV-011 | Durability inferred from UI, clipboard, log, Markdown, or PR | INVALID / FAIL_CLOSED |
| B10-INV-012 | Exactly-once inferred from ID, digest, or HMAC | INVALID / FAIL_CLOSED |
| B10-INV-013 | Acceptance inferred from schema or non-issued fixture | INVALID / FAIL_CLOSED |
| B10-INV-014 | DEMONSTRATION_RECEIPT upgraded to canonical acceptance | INVALID / FAIL_CLOSED |
| B10-INV-015 | Builder self-verifies or self-accepts | INVALID / FAIL_CLOSED |
| B10-INV-016 | One receipt collapses multiple B1 axes | INVALID / FAIL_CLOSED |
| B10-INV-017 | Missing receipt proves no event or external effect | INVALID / FAIL_CLOSED |
| B10-INV-018 | Document or repository SHA treated as receipt digest | INVALID / FAIL_CLOSED |
| B10-INV-019 | Syntactically valid MAC treated as trusted computation | INVALID / FAIL_CLOSED |
| B10-INV-020 | B10 artifact treated as an issued receipt | INVALID / FAIL_CLOSED |
| B10-INV-021 | Program, Batch, Wave, or Lane identifiers do not form one accepted B2/B4 tuple | INVALID / FAIL_CLOSED |
| B10-INV-022 | Relationship is unknown, conflicting, or does not connect the resolved Wave and Lane | INVALID / FAIL_CLOSED |
| B10-INV-023 | Coordinate differs from the resolved B2 full coordinate or B4 Lane coordinate | INVALID / FAIL_CLOSED |
| B10-INV-024 | Repository, SHA, branch, or artifact path describes a different subject | INVALID / FAIL_CLOSED |
| B10-INV-025 | subject_id is unstable, display-only, reused, or not evidence-bound | INVALID / FAIL_CLOSED |
| B10-INV-026 | Linear issue ID substitutes for canonical subject identity | INVALID / FAIL_CLOSED |
| B10-INV-027 | evidence_ids cross subject, revision, coordinate, or artifact boundaries | INVALID / FAIL_CLOSED |
| B10-INV-028 | Portable representability interpreted as receipt issuance, acceptance, transition, exit, D9, or authority | INVALID / FAIL_CLOSED |

Invalid processing must not echo a supplied sensitive value.

## Implementation Reconciliation
| reconciliation_id | surface | evidence_ceiling | establishes | must_not_imply | evidence_ids |
| --- | --- | --- | --- | --- | --- |
| B10-REC-001 | Local operating-loop receipt, proof, digest, HMAC, hash, and ID structures | STATIC_CONFIGURATION | Source structure only | Live authenticity, key trust, persistence, replay prevention, durability, or exactly-once | ["B10-E-010","B10-E-011"] |
| B10-REC-002 | Local operating-loop behavioral test source | STATIC_CONFIGURATION / TEST_SOURCE_NOT_RERUN | Declared test cases only | Runtime key trust, durable state, transport security, or external-effect absence | ["B10-E-011","B10-E-012"] |
| B10-REC-003 | Sandbox receipt-return display test source | STATIC_CONFIGURATION / MOCK_OR_SHADOW_SOURCE | Declared sandbox assertions only | Canonical receipt issuance, persistence, customer readiness, or production behavior | ["B10-E-010","B10-E-013"] |
| B10-REC-004 | Linear JAI-207 | MIRROR_ONLY | CONTROL_THREAD-verified mutable coordination identifier at B10R2 route boundary | Canon, acceptance, completion, authority, or source-of-truth status | ["B10-E-005","B10-E-014"] |
| B10-REC-005 | Unobserved runtime and external effects | UNKNOWN | No positive or negative occurrence claim | Persistence, provider, database, customer, production, or effect absence | ["B10-E-001","B10-E-010","B10-E-011"] |

## Historical Reservations

These five rows preserve the original B10 reservation posture at its
integration boundary. Later B11-B15 repository history is not erased,
reopened, absorbed, or reclassified by B10R2.

| reservation_id | boundary | B10 treatment |
| --- | --- | --- |
| B10-R-001 | B11 Capability and Credit Ledger | RESERVED / NOT_ABSORBED |
| B10-R-002 | B12 Exception and Out-of-Sequence Work Canon | RESERVED / NOT_ABSORBED |
| B10-R-003 | B13 Rollback, Reopen, and Supersession Canon | RESERVED / NOT_ABSORBED |
| B10-R-004 | B14 GitHub-Linear Mirror Protocol | RESERVED / NOT_ABSORBED |
| B10-R-005 | B15 Lifecycle Canon Verification and Batch B Closeout | RESERVED / NOT_ABSORBED |

## B10R2 Repair and Temporal History

| history_id | event | immutable boundary | current effect | evidence |
| --- | --- | --- | --- | --- |
| B10R2-HIST-001 | Original B10 repository integration | c5870f1755dad88082a2be1f0d27fceef2f57dca | HISTORICAL_REPOSITORY_EVIDENCE / NOT_REWRITTEN | Git history for the B10 artifact |
| B10R2-HIST-002 | B15R2 documentary closeout acceptance | 3cd74bfa39d371a629e91cd7f17fa9743ee75c4f | BATCH_B_DOCUMENTARY_CLOSEOUT_HISTORY_ACCEPTED / NO_LIFECYCLE_EXIT | B10-E-015 |
| B10R2-HIST-003 | Current B10R2 reopening | Current HUMAN_OPERATOR route at base 3cd74bfa39d371a629e91cd7f17fa9743ee75c4f | REOPENED_FOR_B10R2_PORTABILITY_REPAIR_ONLY / REPOSITORY_INTEGRATION_PENDING | CURRENT_ROUTE / NOT_IMMUTABLE_REPOSITORY_EVIDENCE |

BATCH_B_DOCUMENTARY_CLOSEOUT_HISTORY: ACCEPTED
B10_DOCUMENTARY_CANON_CURRENT_STATE: REOPENED_FOR_B10R2_PORTABILITY_REPAIR_ONLY
B10_RECEIPT_ISSUANCE: NOT_ISSUED
BATCH_B_LIFECYCLE_EXIT: NOT_ESTABLISHED
BATCH_B_EXIT_CREDIT: NONE
D9_EXECUTION_AUTHORITY: NOT_GRANTED
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE

## B10R2 Author-Side Final Audit
| audit_id | gate | result | authority_effect |
| --- | --- | --- | --- |
| B10-AUDIT-001 | Canonical type and Field Registry alignment | PASS / 9 types / 107 fields / 14 ordered subject-coordinate fields | NONE |
| B10-AUDIT-002 | B9 class binding coverage | PASS / 14 exact ID-name pairs | NONE |
| B10-AUDIT-003 | Portable subject Field Registry | PASS / 14 fields / 0 B10-fixture-specific literal constraints | NONE |
| B10-AUDIT-004 | Safe fixture schema and local references | PASS / each key once / Field Registry order / non-issued / unverified / non-accepted | NONE |
| B10-AUDIT-005 | B2 and B4 subject joins | PASS / one coherent Program, Batch, Wave, Lane, relationship, and coordinate tuple | NONE |
| B10-AUDIT-006 | B9 and B15R2 compatibility | PASS / 14 B9 ID-name pairs / B15R2 representable but not instantiated | NONE |
| B10-AUDIT-007 | Evidence registry | PASS / 15 defined and used / 14 immutable / 1 mutable corroborating | NONE |
| B10-AUDIT-008 | Immutable path resolution | PASS / 14 of 14 | NONE |
| B10-AUDIT-009 | Fixture integrity, replay, durability, and exactly-once boundary | PASS / UNAVAILABLE or NOT_ESTABLISHED / no positive inference | NONE |
| B10-AUDIT-010 | Invalid examples and historical reservations | PASS / 28 invalid / 5 historical B11-B15 reservations | NONE |
| B10-AUDIT-011 | Positive current receipt, acceptance, lifecycle, exit, D9, Program-exit, or activation grants | PASS / 0 / historical B15R2 documentary acceptance preserved | NONE |
| B10-AUDIT-012 | Whitespace and one-path scope | PASS / zero diagnostics / sole modified artifact / index empty | NONE |

This is author-side documentary validation only. It is not independent
verification, CONTROL_THREAD acceptance, receipt issuance, integrity proof,
cryptographic verification, persistence evidence, or lifecycle transition.

## Non-Authorizations

No receipt issuance, key access, cryptographic computation, replay or durable
store mutation, token claim or consumption, independent verification, acceptance,
lifecycle transition, Git delivery, GitHub or Linear mutation, execution, external
effect, downstream Lane, Batch exit, D9, Program exit, or activation authority.

B10R2_DISPOSITION: PORTABLE_RECEIPT_SUBJECT_BINDING_REPAIR_CANDIDATE_ONLY
B10_DOCUMENTARY_CANON_CURRENT_STATE: REOPENED_FOR_B10R2_PORTABILITY_REPAIR_ONLY
B10_RECEIPT_ISSUANCE: NOT_ISSUED
BATCH_B_DOCUMENTARY_CLOSEOUT_HISTORY: ACCEPTED
BATCH_B_LIFECYCLE_EXIT: NOT_ESTABLISHED
BATCH_B_EXIT_CREDIT: NONE
D9_EXECUTION_AUTHORITY: NOT_GRANTED
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B10R2_PORTABILITY_REPAIR
