# Q3M7Y26-P1 B9 Receipt Taxonomy v0

## Status and Control Coordinates
| field | value |
| --- | --- |
| Program | Q3M7Y26-P1 |
| Batch | B — Program Lifecycle and Receipt Canon |
| Wave | B-C |
| Lane | B9 — Receipt Taxonomy v0 |
| Lane ID | P1-B-LANE-09 |
| Relationship | P1-REL-014 |
| Route | CT-2026-07-27-Q3M7Y26-P1-START-B9-RECEIPT-TAXONOMY-v0 |
| Role | JAI::DEV::BUILDER |
| Repository | jai-nexus/dev-jai-nexus |
| Required base | 3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8 |
| Branch | docs/q3m7y26-p1-b9-receipt-taxonomy-v0 |
| Artifact | docs/reference/q3m7y26-p1-b9-receipt-taxonomy-v0.md |
| Linear mirror | JAI-204 / MIRROR_ONLY / NOT_INDEPENDENTLY_REFRESHED / NON_CONTROLLING |
| Evidence ceiling | DOCUMENTATION_RECEIPT_TAXONOMY_ONLY |

## Taxonomy
A receipt evidences one exact bounded event or decision. It is not the underlying lifecycle state, authority, credential, token, bundle, or external effect. B10 owns receipt-instance schema, signing, digest, HMAC, authenticity, anti-replay, durability, exactly-once, and integrity.

Closed `receipt_class` vocabulary, in canonical order:

1. `ACKNOWLEDGEMENT_RECEIPT`
2. `OBSERVATION_RECEIPT`
3. `VALIDATION_RECEIPT`
4. `DELIVERY_RECEIPT`
5. `DECISION_RECEIPT`
6. `INDEPENDENT_VERIFICATION_RECEIPT`
7. `CONTROL_ACCEPTANCE_RECEIPT`
8. `REPOSITORY_INTEGRATION_RECEIPT`
9. `EXECUTION_RECEIPT`
10. `EXTERNAL_EFFECT_RECEIPT`
11. `LIFECYCLE_TRANSITION_RECEIPT`
12. `RUNTIME_ACTIVATION_RECEIPT`
13. `MIRROR_RECEIPT`
14. `DEMONSTRATION_RECEIPT`

### Receipt Class Records
| class_id | class_name | claim_ceiling | producer_prerequisite | subject_scope_binding | required_evidence_class | b1_axis | lifecycle_effect | prohibited_implications | durability_posture | integrity_prerequisite | fail_closed_response | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B9-CLASS-001 | ACKNOWLEDGEMENT_RECEIPT | Acknowledges receipt of one exact bounded item by one named surface only | Identified receiving surface with direct acknowledgement evidence; no authority-principal inference | Exact item, sender where known, receiving surface, coordinate, scope, and observation boundary | Direct bounded acknowledgement evidence at the stated ceiling | NONE | NONE | No delivery, verification, acceptance, integration, execution, deployment, activation, or external-effect implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-003"] |
| B9-CLASS-002 | OBSERVATION_RECEIPT | Records one exact bounded observation only | Identified observer or observation surface with direct evidence and an explicit observation boundary | Exact observed subject, surface, scope, time boundary, and evidence ceiling | Direct bounded observation evidence; not an evidence-bundle substitute | NONE | NONE | No completeness, continuing-state, authority, verification, acceptance, execution, or effect-absence implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-008"] |
| B9-CLASS-003 | VALIDATION_RECEIPT | Records the result of one named validation or mechanical check only | Routed validator or identified mechanical check surface bound to the exact command, subject, environment, and result | Exact validation target, version or head, command or rule, environment, result, diagnostics, and ceiling | Named bounded validation evidence such as STATIC_CONFIGURATION, TESTED, or BUILD_ONLY at its actual ceiling | NONE | NONE | No independent-verification, acceptance, integration, deployment, runtime, or authority implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-008"] |
| B9-CLASS-004 | DELIVERY_RECEIPT | Records production or presentation of the exact routed output only | Builder or executor acting under a fresh exact route and the B5/B6 bounded delivery authority | Exact route, Work Packet, repository, base and head where applicable, branch, paths, outputs, and delivery boundary | B1 EXACT_DELIVERY evidence at the exact routed subject and ceiling | B1-AX-03 / Delivery | NONE | No independent-verification, acceptance, repository-integration, deployment, execution beyond the route, or exit implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-002","B9-E-005","B9-E-006"] |
| B9-CLASS-005 | DECISION_RECEIPT | Records one authorized bounded disposition or decision only | HUMAN_OPERATOR origin or CONTROL_THREAD acting within fresh explicit delegation for the exact decision scope | Exact candidate, decision class, disposition, scope, coordinate, evidence ceiling, and decision boundary | B1 ACCEPTED_DECISION or CONTROL_DISPOSITION_EVIDENCE as applicable to the exact decision | NONE | NONE | No receipt issuance authority, execution credential, delivery, verification, integration, deployment, activation, or reusable-authority implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-007"] |
| B9-CLASS-006 | INDEPENDENT_VERIFICATION_RECEIPT | Records the independently evaluated result for one exact evidence set only | Independently routed Verifier who did not produce, self-route, or accept the subject | Exact subject, version or head, required evidence set, review boundary, result, discrepancies, and ceiling | B1 EXACT_HEAD_EVIDENCE evaluated under INDEPENDENT_VERIFICATION | B1-AX-04 / Verification | NONE | No acceptance, merge, deployment, execution, activation, credit, or verifier self-authorization implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-008"] |
| B9-CLASS-007 | CONTROL_ACCEPTANCE_RECEIPT | Records authorized Control acceptance of one exact subject at one explicit evidence ceiling only | HUMAN_OPERATOR origin or CONTROL_THREAD acting within fresh explicit HUMAN_OPERATOR delegation | Exact subject or candidate, coordinate, repository and head where applicable, disposition, evidence ceiling, and acceptance boundary | B1 ACCEPTED_DECISION with separately established verification or accepted evidence prerequisites | B1-AX-05 / Acceptance | NONE | No delivery, repository integration, merge, deployment, execution, runtime activation, Batch or Program exit, or authority-transfer implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-007","B9-E-008"] |
| B9-CLASS-008 | REPOSITORY_INTEGRATION_RECEIPT | Records one immutable repository integration or revert event only | Separately authorized integration action plus an immutable repository event; GitHub remains a mechanical surface | Exact repository, PR where applicable, source head, integrated main SHA, event kind, and observation boundary | B1 IMMUTABLE_REPOSITORY_EVENT | B1-AX-06 / Repository integration | NONE | No verification, Control acceptance, deployment, runtime activation, Program outcome, or GitHub-principal implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-003","B9-E-008"] |
| B9-CLASS-009 | EXECUTION_RECEIPT | Records occurrence of one exact separately authorized action only | Named executor acting under a fresh route and explicit B5/B6 action authority | Exact action, target, route, Work Packet, scope, version, result boundary, and evidence ceiling | Direct bounded evidence of the authorized action occurrence | NONE | NONE | No broader capability, continuing authority, external-effect completeness, acceptance, exit, or activation implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-006","B9-E-008"] |
| B9-CLASS-010 | EXTERNAL_EFFECT_RECEIPT | Records one directly observed bounded external effect only | Separately authorized actor or system action plus direct evidence of the exact external effect | Exact external target, action, scope, result, observation boundary, and evidence ceiling | Direct bounded external-effect evidence; absence requires its own evidence and cannot be inferred | NONE | NONE | No continuing-state, complete-effect, customer-readiness, acceptance, integration, activation, or authority implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-008"] |
| B9-CLASS-011 | LIFECYCLE_TRANSITION_RECEIPT | Records one separately authorized transition on exactly one B1 axis only | Authority matching the exact B1 transition precondition with all required evidence satisfied | Exact subject, source state, target state, one B1 axis, transition ID, evidence set, and transition boundary | The exact B1 transition evidence requirement class for the named transition | EXACTLY_ONE_OF_B1-AX-01_THROUGH_B1-AX-10 | NONE | No compound-axis progression, adjacent-state inference, child execution, exit, integration, deployment, or activation implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-003","B9-E-004","B9-E-005","B9-E-008"] |
| B9-CLASS-012 | RUNTIME_ACTIVATION_RECEIPT | Records one separately governed bounded runtime activation, suspension, deactivation, or failed attempt only | Fresh ACTIVATION_AUTHORITY plus direct runtime evidence for the exact environment and activation instance | Exact environment, runtime instance, version or head, action, result, observation boundary, and evidence ceiling | B1 DIRECT_RUNTIME_EVIDENCE | B1-AX-09 / Runtime activation | NONE | No inference from documentation, tests, builds, previews, deployments, static UI, acceptance, or integration alone | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-008"] |
| B9-CLASS-013 | MIRROR_RECEIPT | Records one bounded mirror mutation or canonical-source comparison only | Fresh MIRROR_MUTATION_AUTHORITY for the mirror plus comparison with controlling canonical evidence | Exact mirror record, canonical source, compared scope, observation boundary, resulting mirror posture, and ceiling | B1 CANONICAL_SOURCE_COMPARISON | B1-AX-10 / Mirror posture | NONE | No canonical route, delivery, verification, acceptance, integration, Program state, activation, or mirror-governs-canon implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-009"] |
| B9-CLASS-014 | DEMONSTRATION_RECEIPT | Records one mock, fixture, local-shadow, or demonstration result only | Identified demonstration producer or surface within an explicit MOCK_OR_SHADOW boundary | Exact fixture or local input, deterministic operation, visible or tested result, and demonstration boundary | MOCK_OR_SHADOW or STATIC_UI evidence at the actual bounded ceiling | NONE | NONE | No B1 transition, canonical receipt, acceptance, persistence, integrity, replay prevention, execution, deployment, activation, or external-effect implication | UNAVAILABLE | B10 required for integrity, authenticity, and receipt-instance validation | HOLD | NONE | ["B9-E-001","B9-E-002","B9-E-008"] |

Every row is a taxonomy classification only. `lifecycle_effect`, `authority_effect`, and durability remain `NONE`, `NONE`, and `UNAVAILABLE` respectively. The underlying event or decision requires separate authority and evidence.

`MIRROR_RECEIPT` evidences only a mirror mutation or comparison; Linear and dashboard status remain non-controlling. `DEMONSTRATION_RECEIPT` is mock or local-shadow output only and establishes no persistence, authenticity, acceptance, execution, external effect, or authority.

## Non-Receipt Classifications
| non_receipt_id | surface | classification | qualification_requirement | prohibited_inference | evidence_ids |
| --- | --- | --- | --- | --- | --- |
| B9-NR-001 | planning/status mirrors | NON_RECEIPT | Requires a separately authorized mirror mutation or exact canonical-source comparison before a MIRROR_RECEIPT can be classified | Cannot establish canon, route, delivery, verification, acceptance, integration, activation, or authority | ["B9-E-001","B9-E-002","B9-E-009"] |
| B9-NR-002 | route packets and Work Packets | NON_RECEIPT | A later exact event requires its own qualifying receipt evidence; instructions and proposed authority are not event receipts | Cannot establish delivery, token issuance, verification, acceptance, execution, integration, or external effect | ["B9-E-002","B9-E-005","B9-E-006"] |
| B9-NR-003 | builder delivery reports | NON_RECEIPT | Requires exact route, Work Packet, subject, output, and delivery evidence before a DELIVERY_RECEIPT can be classified | Cannot independently verify, accept, integrate, deploy, activate, or grant exit credit | ["B9-E-002","B9-E-005","B9-E-006"] |
| B9-NR-004 | CI, test, lint, typecheck, build, and check results | NON_RECEIPT | May qualify only as named bounded VALIDATION_RECEIPT evidence at the actual command and environment ceiling | Cannot establish independent verification, CONTROL_THREAD acceptance, integration, activation, or authority merely because it passed | ["B9-E-001","B9-E-002","B9-E-008"] |
| B9-NR-005 | B7 tokens and dispositions | NON_RECEIPT | A token-lifecycle event requires separate accepted event evidence; proposed token or disposition data is not a receipt | Cannot establish token issuance, claim, consumption, subject acceptance, execution credential, B1 transition, or reusable authority | ["B9-E-001","B9-E-002","B9-E-007"] |
| B9-NR-006 | B8 Evidence Bundles | NON_RECEIPT | Remains an evidence container with ASSEMBLED_UNVERIFIED, incomplete, contradictory, or readiness posture | Cannot establish receipt issuance, verification, acceptance, integrity, credit, execution, or authority | ["B9-E-001","B9-E-002","B9-E-008"] |
| B9-NR-007 | commits, pushes, pull requests, reviews, and merge events | NON_RECEIPT | Only an exact immutable integration or revert event with complete bindings may support a REPOSITORY_INTEGRATION_RECEIPT | Cannot establish independent verification, CONTROL acceptance, deployment, runtime activation, or Program outcome | ["B9-E-001","B9-E-002","B9-E-003","B9-E-008"] |
| B9-NR-008 | deployment and preview statuses | NON_RECEIPT | Requires separate activation authority and direct runtime evidence before any RUNTIME_ACTIVATION_RECEIPT classification | Cannot establish authorized activation, continuing runtime, customer effect, acceptance, or integration | ["B9-E-001","B9-E-002","B9-E-008"] |
| B9-NR-009 | local-shadow artifacts and UI output | NON_RECEIPT | May qualify only as a DEMONSTRATION_RECEIPT within an explicit MOCK_OR_SHADOW boundary | Cannot establish canonical state, governance acceptance, persistence, integrity, execution, external effect, or authority | ["B9-E-001","B9-E-002","B9-E-008"] |
| B9-NR-010 | this B9 taxonomy document | NON_RECEIPT | Classification documentation only; a real receipt requires a later separately governed instance and evidence | Cannot issue, authenticate, validate, accept, integrate, execute, deploy, activate, or grant authority | ["B9-E-001","B9-E-002","B9-E-008"] |

A qualified event may support a separately classified receipt only after every class-specific evidence, authority, subject, scope, and observation boundary is satisfied. The listed surface remains a non-receipt by itself.

## Controlling Invariants
Evidence is not automatically a receipt; a class is not an issued instance; validation is not verification; verification is not acceptance; acceptance is not integration; integration is not deployment; deployment is not authorized activation; activation is not customer effect. Missing receipt evidence does not prove absence of an event or external effect. Issuer identity and mechanical surfaces are not authority. Builder cannot verify/accept its work; Verifier cannot self-route/accept; CONTROL_THREAD acceptance requires fresh HUMAN_OPERATOR origin/delegation. All receipt boundaries are exact and non-transitive; stale, contradictory, mutable-only, above-ceiling, mismatched, or unresolved evidence fails closed. This document issues no receipt or transition.

## Closed Vocabularies
| vocabulary_id | field | allowed_values |
| --- | --- | --- |
| B9-VOCAB-001 | receipt_class | ACKNOWLEDGEMENT_RECEIPT, OBSERVATION_RECEIPT, VALIDATION_RECEIPT, DELIVERY_RECEIPT, DECISION_RECEIPT, INDEPENDENT_VERIFICATION_RECEIPT, CONTROL_ACCEPTANCE_RECEIPT, REPOSITORY_INTEGRATION_RECEIPT, EXECUTION_RECEIPT, EXTERNAL_EFFECT_RECEIPT, LIFECYCLE_TRANSITION_RECEIPT, RUNTIME_ACTIVATION_RECEIPT, MIRROR_RECEIPT, DEMONSTRATION_RECEIPT |
| B9-VOCAB-002 | fail_closed_response | HOLD |
| B9-VOCAB-003 | non_receipt_classification | NON_RECEIPT |
| B9-VOCAB-004 | evidence_source_class | REPOSITORY_CANON, LINEAR_MIRROR |
| B9-VOCAB-005 | evidence_immutability | IMMUTABLE, MUTABLE_CORROBORATING |
| B9-VOCAB-006 | prohibited_effect | RECEIPT_ISSUANCE, INTEGRITY_OR_AUTHENTICITY_PROOF, INDEPENDENT_VERIFICATION, CONTROL_ACCEPTANCE, REPOSITORY_INTEGRATION, EXECUTION, DEPLOYMENT_OR_RUNTIME_ACTIVATION, EXTERNAL_OR_CUSTOMER_EFFECT, BATCH_OR_PROGRAM_EXIT, AUTHORITY_OR_CREDIT_TRANSFER |

## Canonical Record Type Registry
| type_id | record_type | field_count | ordinals |
| --- | --- | ---: | --- |
| B9-TYPE-1 | receipt_taxonomy_record | 15 | 1-15 |
| B9-TYPE-2 | receipt_class_record | 14 | 1-14 |
| B9-TYPE-3 | non_receipt_classification_record | 6 | 1-6 |
| B9-TYPE-4 | evidence_pointer_record | 7 | 1-7 |
| B9-TYPE-5 | non_authorization_record | 6 | 1-6 |

## Canonical Field Registry
| record_type | ordinal | field_name | value_type | cardinality | required_or_nullable | identifier_or_reference_rule |
| --- | ---: | --- | --- | --- | --- | --- |
| receipt_taxonomy_record | 1 | taxonomy_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| receipt_taxonomy_record | 2 | schema_version | string | 1 | required | NOT_A_REFERENCE |
| receipt_taxonomy_record | 3 | receipt_class_ids | ordered array<reference<receipt_class_record>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_receipt_class_record.class_id |
| receipt_taxonomy_record | 4 | non_receipt_ids | ordered array<reference<non_receipt_classification_record>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_non_receipt_classification_record.non_receipt_id |
| receipt_taxonomy_record | 5 | evidence_ids | ordered array<reference<evidence_pointer_record>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_evidence_pointer_record.evidence_id |
| receipt_taxonomy_record | 6 | non_authorization_ids | ordered array<reference<non_authorization_record>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_non_authorization_record.non_authorization_id |
| receipt_taxonomy_record | 7 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| receipt_taxonomy_record | 8 | receipt_instance_id | literal<null> | 1 | required | NOT_A_REFERENCE |
| receipt_taxonomy_record | 9 | issuance_state | literal<NOT_ISSUED> | 1 | required | NOT_A_REFERENCE |
| receipt_taxonomy_record | 10 | integrity_state | literal<UNVERIFIED> | 1 | required | NOT_A_REFERENCE |
| receipt_taxonomy_record | 11 | b1_verification_posture | literal<NOT_VERIFIED> | 1 | required | NOT_A_REFERENCE |
| receipt_taxonomy_record | 12 | b1_acceptance_posture | literal<NOT_ACCEPTED> | 1 | required | NOT_A_REFERENCE |
| receipt_taxonomy_record | 13 | execution_observed | literal<false> | 1 | required | NOT_A_REFERENCE |
| receipt_taxonomy_record | 14 | external_effect_observed | literal<false> | 1 | required | NOT_A_REFERENCE |
| receipt_taxonomy_record | 15 | persistence_durability_replay_exactly_once | literal<UNAVAILABLE> | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 1 | class_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| receipt_class_record | 2 | class_name | closed enum<receipt_class> | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 3 | claim_ceiling | string | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 4 | producer_prerequisite | string | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 5 | subject_scope_binding | string | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 6 | required_evidence_class | string | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 7 | b1_axis | string | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 8 | lifecycle_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 9 | prohibited_implications | string | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 10 | durability_posture | literal<UNAVAILABLE> | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 11 | integrity_prerequisite | string | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 12 | fail_closed_response | closed enum<fail_closed_response> | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 13 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| receipt_class_record | 14 | evidence_ids | ordered array<reference<evidence_pointer_record>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_evidence_pointer_record.evidence_id |
| non_receipt_classification_record | 1 | non_receipt_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| non_receipt_classification_record | 2 | surface | string | 1 | required | NOT_A_REFERENCE |
| non_receipt_classification_record | 3 | classification | closed enum<non_receipt_classification> | 1 | required | NOT_A_REFERENCE |
| non_receipt_classification_record | 4 | qualification_requirement | string | 1 | required | NOT_A_REFERENCE |
| non_receipt_classification_record | 5 | prohibited_inference | string | 1 | required | NOT_A_REFERENCE |
| non_receipt_classification_record | 6 | evidence_ids | ordered array<reference<evidence_pointer_record>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_evidence_pointer_record.evidence_id |
| evidence_pointer_record | 1 | evidence_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| evidence_pointer_record | 2 | source_class | closed enum<evidence_source_class> | 1 | required | NOT_A_REFERENCE |
| evidence_pointer_record | 3 | immutability | closed enum<evidence_immutability> | 1 | required | NOT_A_REFERENCE |
| evidence_pointer_record | 4 | reference | string | 1 | required | EXTERNAL_POINTER_SUBJECT_TO_SOURCE_CLASS_AND_IMMUTABILITY |
| evidence_pointer_record | 5 | claim | string | 1 | required | NOT_A_REFERENCE |
| evidence_pointer_record | 6 | observation_boundary | string | 1 | required | NOT_A_REFERENCE |
| evidence_pointer_record | 7 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 1 | non_authorization_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| non_authorization_record | 2 | prohibited_effect | closed enum<prohibited_effect> | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 3 | reason | string | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 4 | required_future_route | string | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 5 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| non_authorization_record | 6 | evidence_ids | ordered array<reference<evidence_pointer_record>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_evidence_pointer_record.evidence_id |

## Deterministic Serialization
Canonical type order, ascending IDs, field ordinal order, and declared array order apply. NFC/LF normalization applies where applicable. Null differs from missing. Unknown/duplicate keys, unresolved references, timestamps, randomness, UUIDs, digests, hashes, fingerprints, HMACs, receipts, and inferred authority fail closed.

## Safe Fixture
```json
{
  "taxonomy_id": "B9-TAXONOMY-001",
  "schema_version": "receipt-taxonomy/v0",
  "receipt_class_ids": [
    "B9-CLASS-001"
  ],
  "non_receipt_ids": [
    "B9-NR-001"
  ],
  "evidence_ids": [
    "B9-E-001"
  ],
  "non_authorization_ids": [
    "B9-NONAUTH-001"
  ],
  "authority_effect": "NONE",
  "receipt_instance_id": null,
  "issuance_state": "NOT_ISSUED",
  "integrity_state": "UNVERIFIED",
  "b1_verification_posture": "NOT_VERIFIED",
  "b1_acceptance_posture": "NOT_ACCEPTED",
  "execution_observed": false,
  "external_effect_observed": false,
  "persistence_durability_replay_exactly_once": "UNAVAILABLE"
}
```
The fixture is classification only, never an issued receipt.

## Implementation Reconciliation
| reconciliation_id | surface_or_artifact | classification | qualifying_source_and_minimum_binding | may_evidence | must_not_imply | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- |
| B9-REC-001 | planning or status mirror | NON_RECEIPT / MIRROR_SURFACE_ONLY | Canonical source citation, observation boundary, and freshness comparison | B1 mirror posture only: MIRRORED_CURRENT, MIRROR_STALE, or MIRROR_CONFLICTING | Route, delivery, verification, acceptance, integration, activation, or authority | ["B9-E-001","B9-E-002","B9-E-009"] |
| B9-REC-002 | Builder delivery report | NON_RECEIPT_BY_ITSELF / DELIVERY_CANDIDATE | Fresh exact route and Work Packet, subject, repository, base and head where applicable, paths, and delivered outputs | Exact B1 delivery event when every DELIVERY_RECEIPT prerequisite is satisfied | Independent verification, acceptance, merge, deployment, runtime, exit credit, or authority | ["B9-E-002","B9-E-005","B9-E-006"] |
| B9-REC-003 | CI, build, test, lint, typecheck, or check result | VALIDATION_EVIDENCE / NON_RECEIPT_BY_ITSELF | Exact head, command or check, environment, result, diagnostics, and actual evidence ceiling | The named bounded validation result only | B1 VERIFIED, CONTROL_THREAD acceptance, integration, activation, or authority merely because it passed | ["B9-E-001","B9-E-002","B9-E-008"] |
| B9-REC-004 | independent-verification receipt candidate | INDEPENDENT_VERIFICATION_RECEIPT_CLASSIFICATION_ONLY | Independently routed Verifier, exact subject and head, required evidence set, review boundary, result, and ceiling | B1 verification-axis result for the exact evidence set after all class prerequisites are satisfied | Acceptance, merge, deployment, execution, activation, credit, self-route, or self-acceptance | ["B9-E-001","B9-E-002","B9-E-005","B9-E-008"] |
| B9-REC-005 | CONTROL_THREAD acceptance receipt candidate | CONTROL_ACCEPTANCE_RECEIPT_CLASSIFICATION_ONLY / B10_RESERVED | HUMAN_OPERATOR origin or fresh explicit delegation, exact subject and head where applicable, evidence ceiling, and accepted disposition | B1 acceptance-axis transition only after a later valid B10-compatible receipt instance is separately established | Delivery, integration, merge, deployment, runtime activation, Batch or Program exit, or authority transfer | ["B9-E-001","B9-E-002","B9-E-005","B9-E-007","B9-E-008"] |
| B9-REC-006 | repository-integration receipt candidate | REPOSITORY_INTEGRATION_RECEIPT_CLASSIFICATION_ONLY | Exact repository, PR where applicable, source head, integrated main SHA, event kind, and immutable observation boundary | B1 repository-integration axis after every class prerequisite is satisfied | Verification, CONTROL_THREAD acceptance, deployment, activation, Program outcome, or GitHub authority-principal status | ["B9-E-001","B9-E-002","B9-E-003","B9-E-008"] |
| B9-REC-007 | runtime or activation receipt candidate | RUNTIME_ACTIVATION_RECEIPT_CLASSIFICATION_ONLY | Fresh activation authority and direct evidence bound to exact environment, runtime instance, version, action, and observation boundary | B1 runtime-activation axis after separately governed activation and direct evidence | Activation inferred from documentation, tests, build, preview, deployment status, static UI, acceptance, or integration | ["B9-E-001","B9-E-002","B9-E-005","B9-E-008"] |
| B9-REC-008 | local-shadow demonstration artifact | DEMONSTRATION_ONLY / NON_RECEIPT_BY_ITSELF | Exact fixture or local input, deterministic operation, result, and MOCK_OR_SHADOW boundary | Local demonstration behavior only | Any B1 transition, canonical receipt, acceptance, integrity, persistence, replay prevention, execution, deployment, or external effect | ["B9-E-001","B9-E-002","B9-E-008"] |
| B9-REC-009 | B8 Evidence Bundle | EVIDENCE_CONTAINER / NON_RECEIPT | Exact provenance, observations, validation results, freshness, contradictions, and evidence ceiling | ASSEMBLED_UNVERIFIED, incomplete, contradictory, or ready-for-independent-verification posture | Receipt, verification, acceptance, digest, integrity, credit, execution, or authority | ["B9-E-001","B9-E-002","B9-E-008"] |
| B9-REC-010 | B7 token-lifecycle evidence | TOKEN_EVENT_EVIDENCE / NON_RECEIPT_BY_ITSELF | Exact externally issued B7 token plus separately accepted evidence of one issuance, claim, consumption, expiry, or revocation event | The exact token-lifecycle event only after later qualifying evidence | Token creation, execution credential, subject acceptance, B1 transition, reusable authority, or CONSUMED inferred from proposal text | ["B9-E-001","B9-E-002","B9-E-007","B9-E-008"] |

These rows classify sources and candidates; they issue no receipt and perform no lifecycle transition. Missing receipt evidence does not prove absence of an event or external effect.

## Evidence Pointer Registry
| evidence_id | source_class | immutability | reference | claim | observation_boundary | authority_effect |
| --- | --- | --- | --- | --- | --- | --- |
| B9-E-001 | REPOSITORY_CANON | IMMUTABLE | [A2](https://github.com/jai-nexus/dev-jai-nexus/blob/3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md) | bounded documentary source | Base 3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8 | NONE |
| B9-E-002 | REPOSITORY_CANON | IMMUTABLE | [B1](https://github.com/jai-nexus/dev-jai-nexus/blob/3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md) | bounded documentary source | Base 3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8 | NONE |
| B9-E-003 | REPOSITORY_CANON | IMMUTABLE | [B2](https://github.com/jai-nexus/dev-jai-nexus/blob/3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md) | bounded documentary source | Base 3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8 | NONE |
| B9-E-004 | REPOSITORY_CANON | IMMUTABLE | [B4](https://github.com/jai-nexus/dev-jai-nexus/blob/3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8/docs/reference/q3m7y26-p1-b4-batch-wave-lane-decomposition-canon-v0.md) | bounded documentary source | Base 3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8 | NONE |
| B9-E-005 | REPOSITORY_CANON | IMMUTABLE | [B5](https://github.com/jai-nexus/dev-jai-nexus/blob/3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8/docs/reference/q3m7y26-p1-b5-role-authority-matrix-v0.md) | bounded documentary source | Base 3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8 | NONE |
| B9-E-006 | REPOSITORY_CANON | IMMUTABLE | [B6](https://github.com/jai-nexus/dev-jai-nexus/blob/3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8/docs/reference/q3m7y26-p1-b6-work-packet-canon-v0.md) | bounded documentary source | Base 3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8 | NONE |
| B9-E-007 | REPOSITORY_CANON | IMMUTABLE | [B7](https://github.com/jai-nexus/dev-jai-nexus/blob/3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8/docs/reference/q3m7y26-p1-b7-decision-token-disposition-canon-v0.md) | bounded documentary source | Base 3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8 | NONE |
| B9-E-008 | REPOSITORY_CANON | IMMUTABLE | [B8](https://github.com/jai-nexus/dev-jai-nexus/blob/3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8/docs/reference/q3m7y26-p1-b8-evidence-bundle-schema-v0.md) | bounded documentary source | Base 3e878bcd9ccfb436a763f5b9607c33c3fd0a3ec8 | NONE |
| B9-E-009 | LINEAR_MIRROR | MUTABLE_CORROBORATING | Linear JAI-204 | MIRROR_ONLY / NON_CONTROLLING | NOT_INDEPENDENTLY_REFRESHED | NONE |

## Non-Authorization Records
| non_authorization_id | prohibited_effect | reason | required_future_route | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- |
| B9-NONAUTH-001 | RECEIPT_ISSUANCE | B9 classifies receipt kinds but creates no receipt instance or issuance event | B10 receipt-instance schema plus a fresh exact issuance route | NONE | ["B9-E-001","B9-E-002","B9-E-007","B9-E-008"] |
| B9-NONAUTH-002 | INTEGRITY_OR_AUTHENTICITY_PROOF | No digest, signature, HMAC, authenticity, anti-replay, durability, or exactly-once mechanism exists in B9 | B10 Acceptance Receipt and Integrity Schema | NONE | ["B9-E-001","B9-E-002","B9-E-007","B9-E-008"] |
| B9-NONAUTH-003 | INDEPENDENT_VERIFICATION | Taxonomy authoring and validation cannot independently verify the resulting artifact | Separately routed independent verification, including B15 where applicable | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-008"] |
| B9-NONAUTH-004 | CONTROL_ACCEPTANCE | Documentation, validation, delivery, CI, or mirror state cannot create an authorized acceptance decision | Fresh HUMAN_OPERATOR-origin or explicitly delegated CONTROL_THREAD decision | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-007"] |
| B9-NONAUTH-005 | REPOSITORY_INTEGRATION | B9 authoring neither authorizes nor performs commit, push, pull-request, merge, revert, or branch deletion | Separately authorized exact-head repository-integration route | NONE | ["B9-E-001","B9-E-002","B9-E-003","B9-E-005"] |
| B9-NONAUTH-006 | EXECUTION | Receipt taxonomy does not grant action capability or execute a Work Packet | Fresh exact execution route satisfying B5 and B6 | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-006"] |
| B9-NONAUTH-007 | DEPLOYMENT_OR_RUNTIME_ACTIVATION | Documentation, tests, builds, previews, acceptance, and integration do not activate runtime | Separately governed deployment or activation route with direct runtime evidence | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-008"] |
| B9-NONAUTH-008 | EXTERNAL_OR_CUSTOMER_EFFECT | B9 authoring grants no provider, database, customer, production, or external-effect authority and establishes neither occurrence nor absence of such effects | Separately governed external-effect or customer-action route | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-008"] |
| B9-NONAUTH-009 | BATCH_OR_PROGRAM_EXIT | One documentary Lane and its receipt taxonomy cannot close Batch B or Program 1 | B15 verification and a separate authorized Batch or Program closeout decision | NONE | ["B9-E-001","B9-E-002","B9-E-003","B9-E-004"] |
| B9-NONAUTH-010 | AUTHORITY_OR_CREDIT_TRANSFER | Receipt classification is non-transitive and grants no standing capability or credit | B11 ledger treatment plus a separate explicit authority or credit decision | NONE | ["B9-E-001","B9-E-002","B9-E-005","B9-E-006"] |

## Invalid Examples
| invalid_id | claim | response |
| --- | --- | --- |
| B9-INV-001 | Linear Done proves acceptance | INVALID / FAIL_CLOSED |
| B9-INV-002 | Dashboard is canonical receipt | INVALID / FAIL_CLOSED |
| B9-INV-003 | Builder self-verifies | INVALID / FAIL_CLOSED |
| B9-INV-004 | Commit/push/PR/check proves verification | INVALID / FAIL_CLOSED |
| B9-INV-005 | Tests prove acceptance | INVALID / FAIL_CLOSED |
| B9-INV-006 | Verifier authorizes merge | INVALID / FAIL_CLOSED |
| B9-INV-007 | Acceptance means deployed | INVALID / FAIL_CLOSED |
| B9-INV-008 | Merge proves activation | INVALID / FAIL_CLOSED |
| B9-INV-009 | Deployment proves activation | INVALID / FAIL_CLOSED |
| B9-INV-010 | UI live proves activation | INVALID / FAIL_CLOSED |
| B9-INV-011 | Local-shadow ACCEPTED is governance acceptance | INVALID / FAIL_CLOSED |
| B9-INV-012 | Copyable receipt is durable | INVALID / FAIL_CLOSED |
| B9-INV-013 | Hash/HMAC proves B10 integrity | INVALID / FAIL_CLOSED |
| B9-INV-014 | B7 token is receipt | INVALID / FAIL_CLOSED |
| B9-INV-015 | B8 bundle is receipt | INVALID / FAIL_CLOSED |
| B9-INV-016 | Receipt ID is credential | INVALID / FAIL_CLOSED |
| B9-INV-017 | Consumed token established | INVALID / FAIL_CLOSED |
| B9-INV-018 | Role/surface is principal | INVALID / FAIL_CLOSED |
| B9-INV-019 | Drift reuses receipt | INVALID / FAIL_CLOSED |
| B9-INV-020 | Chronology supersedes | INVALID / FAIL_CLOSED |
| B9-INV-021 | No log proves no external effect | INVALID / FAIL_CLOSED |
| B9-INV-022 | Receipt grants exit credit | INVALID / FAIL_CLOSED |
| B9-INV-023 | One receipt collapses B1 axes | INVALID / FAIL_CLOSED |
| B9-INV-024 | B9 creates real receipt | INVALID / FAIL_CLOSED |

## Reservations
| reservation_id | boundary |
| --- | --- |
| B9-R-001 | B10 Acceptance Receipt and Integrity Schema |
| B9-R-002 | B11 Capability and Credit Ledger |
| B9-R-003 | B12 Exception Canon |
| B9-R-004 | B13 Rollback/Reopen/Supersession |
| B9-R-005 | B14 GitHub-Linear Mirror Protocol |
| B9-R-006 | B15 Lifecycle Verification and Batch Closeout |

## B9R1D Final Audit
| audit_id | gate | result | authority_effect |
| --- | --- | --- | --- |
| B9-AUDIT-001 | Canonical type and Field Registry alignment | PASS / 5 types / 48 fields / 5 primary identifiers | NONE |
| B9-AUDIT-002 | Receipt Class matrix | PASS / 14 rows / 14 columns / class-specific semantics | NONE |
| B9-AUDIT-003 | Non-Receipt matrix | PASS / 10 rows / 6 columns | NONE |
| B9-AUDIT-004 | Non-Authorization matrix | PASS / 10 rows / 6 columns | NONE |
| B9-AUDIT-005 | Closed vocabularies | PASS / 6 rows | NONE |
| B9-AUDIT-006 | Fixture schema, literals, and local joins | PASS / 15 ordered fields / non-issued / unverified / non-accepted | NONE |
| B9-AUDIT-007 | Evidence Registry and joins | PASS / 9 defined and used / 8 immutable / 1 mutable corroborating | NONE |
| B9-AUDIT-008 | Immutable path resolution at required base | PASS / 8 of 8 | NONE |
| B9-AUDIT-009 | Implementation reconciliation | PASS / 10 bounded distinctions | NONE |
| B9-AUDIT-010 | Invalid examples and reservations | PASS / 24 invalid / 6 reserved B10-B15 boundaries | NONE |
| B9-AUDIT-011 | B10 and sensitive-data boundary | PASS / no integrity mechanism or sensitive value | NONE |
| B9-AUDIT-012 | Whitespace and one-path scope | PASS / zero diagnostics / sole untracked artifact | NONE |

This is an author-side documentary audit, not independent verification, CONTROL_THREAD acceptance, receipt issuance, or B10 integrity evidence.

## Non-authorizations
No receipt issuance, integrity proof, acceptance, integration, execution, deployment, activation, external effect, Batch exit, or Program exit authority.

B9_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_RECEIPT_TAXONOMY_ONLY
B9_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B9_FURTHER_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B9_RECEIPT_TAXONOMY
