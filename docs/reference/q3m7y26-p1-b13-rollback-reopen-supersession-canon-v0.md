# Q3M7Y26-P1 B13 Rollback, Reopen, and Supersession Canon v0

## 1. Status and Purpose

Role: JAI::DEV::BUILDER

Program: Q3M7Y26-P1

Batch: B - Program Lifecycle and Receipt Canon

Wave: B-D

Lane: B13 - Rollback, Reopen, and Supersession Canon v0

Route:
CT-2026-07-28-Q3M7Y26-P1-START-B13-ROLLBACK-REOPEN-SUPERSESSION-CANON-v0

Base: a2997d446a7b4b5bea62a9cc4fca74033ddd851b

Evidence ceiling:
DOCUMENTATION_ROLLBACK_REOPEN_SUPERSESSION_CANON_ONLY

This artifact defines rollback, reopen, and supersession as separate governed
operations. It performs none of them. It does not issue a receipt, create
acceptance, alter lifecycle or credit state, run a repository command, mutate
runtime or external state, or grant continuing authority.

B12 is repository-integrated at this base. Repository integration does not
independently verify or accept B12 and creates no B13 operation authority.

## 2. Source Precedence and Alignment

1. Fresh HUMAN_OPERATOR constitutional authority or CONTROL_THREAD acting
   within exact fresh delegation governs any current operation. B5 authority
   remains non-transitive.
2. B1 owns lifecycle axes, states, and permitted transitions. B13 binds them
   without adding or silently changing a B1 state or transition.
3. B7 owns decision-token structure and exact subject, operation, scope, actor,
   issue, expiry, revocation, and evidence binding. B13 generates no token.
4. B9 receipt classes classify evidence only. A class is not an issued receipt.
5. B10 owns prospective receipt-instance and integrity semantics. Missing
   issuance or integrity evidence remains unavailable or not established.
6. B11 credit dimensions are independent and are not a maturity ladder.
   B13 creates no credit and cannot infer one dimension from another.
7. B12 exceptions are bounded and non-transitive. No exception creates
   rollback, reopen, or supersession authority.
8. Linear JAI-209 is MIRROR_ONLY, non-controlling route corroboration supplied
   by CONTROL_THREAD. It was not accessed or refreshed in this execution.

## 3. Canonical Definitions

| definition_id | operation_kind | definition | allowed_transition_ids | history_effect | authority_requirement | non_implications | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B13-DEF-001 | ROLLBACK | A documentary proposal to reverse one exact bounded effect through a later separately authorized operation. Repository rollback maps only to the B1 integration revert transition when that transition is applicable. | [B1-TR-020] | PRESERVE | Fresh exact authority for the subject, target, scope, action, issue boundary, and expiry boundary. | [NO_HISTORY_ERASURE, NO_GIT_REVERT, NO_FILE_RESTORE, NO_DATABASE_MUTATION, NO_EXTERNAL_EFFECT_UNDO, NO_RUNTIME_CHANGE, NO_ACCEPTANCE] | [B13-E-001, B13-E-002, B13-E-003, B13-E-004, B13-E-005] |
| B13-DEF-002 | REOPEN | A later separately authorized transition from an exact held, expired, failed, stale, frozen, or suspended source state using only a source-supported B1 transition. | [B1-TR-003, B1-TR-006, B1-TR-013, B1-TR-014, B1-TR-022, B1-TR-029, B1-TR-044] | PRESERVE | Fresh exact authority and separately evidenced transition for one B1 axis. | [NO_PRIOR_HISTORY_ERASURE, NO_AUTHORITY_RESTORATION, NO_COMPOUND_AXIS_CHANGE, NO_ACCEPTANCE, NO_CREDIT] | [B13-E-001, B13-E-002, B13-E-003, B13-E-004, B13-E-005, B13-E-006] |
| B13-DEF-003 | SUPERSESSION | A separately governed currentness change in which one named exact replacement takes over the controlling effect of one named predecessor while both histories remain linked. | [B1-TR-025, B1-TR-026] | PRESERVE | Fresh exact authority, named replacement, accepted disposition evidence, bidirectional links, and acyclic history. | [NO_ROLLBACK, NO_CANCELLATION, NO_REJECTION, NO_INVALIDITY, NO_EXECUTION, NO_DELETION, NO_CHRONOLOGY_ONLY_CURRENTNESS] | [B13-E-001, B13-E-002, B13-E-003, B13-E-004, B13-E-005, B13-E-006] |

Rollback, reopen, and supersession are not synonyms. A repository `REVERTED`
event is not `SUPERSEDED`; reopening a held axis is not restoration of an
expired route or token; supersession is not rollback, cancellation, rejection,
invalidity, execution, or deletion.

## 4. Canonical Record Types

| type_id | record_type | field_count | ordinal_range |
| --- | --- | ---: | --- |
| B13-TYPE-01 | operation_definition | 8 | 1-8 |
| B13-TYPE-02 | governed_operation_record | 21 | 1-21 |
| B13-TYPE-03 | lifecycle_transition_binding | 10 | 1-10 |
| B13-TYPE-04 | supersession_link_record | 10 | 1-10 |
| B13-TYPE-05 | receipt_integrity_binding | 12 | 1-12 |
| B13-TYPE-06 | current_state_resolution_record | 10 | 1-10 |
| B13-TYPE-07 | evidence_pointer | 5 | 1-5 |
| B13-TYPE-08 | reservation | 4 | 1-4 |

## 5. Complete Ordinal Field Registry

| record_type | ordinal | field_name | type | cardinality | requiredness | field-specific rule |
| --- | ---: | --- | --- | --- | --- | --- |
| operation_definition | 1 | definition_id | identifier | 1 | required | Unique B13-DEF identifier |
| operation_definition | 2 | operation_kind | enum<ROLLBACK,REOPEN,SUPERSESSION> | 1 | required | Exactly one definition per kind |
| operation_definition | 3 | definition | nonempty string | 1 | required | Distinguishes this operation from the other two |
| operation_definition | 4 | allowed_transition_ids | ordered nonempty array<reference<B1.transition>> | 1..* | required | Every transition resolves and is source-supported for the operation kind |
| operation_definition | 5 | history_effect | literal<PRESERVE> | 1 | required | Accepted and historical records are never erased |
| operation_definition | 6 | authority_requirement | nonempty string | 1 | required | Exact separate authority prerequisite; never a grant |
| operation_definition | 7 | non_implications | ordered nonempty array<nonempty string> | 1..* | required | Every excluded effect is explicit |
| operation_definition | 8 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves exactly once |
| governed_operation_record | 1 | operation_id | identifier | 1 | required | Unique B13-OP identifier |
| governed_operation_record | 2 | operation_kind | enum<ROLLBACK,REOPEN,SUPERSESSION> | 1 | required | Must match definition_id |
| governed_operation_record | 3 | definition_id | reference<operation_definition> | 1 | required | Resolves exactly once and kind matches |
| governed_operation_record | 4 | operation_state | enum<UNRESOLVED_DOCUMENTARY,DRAFT,PROPOSED,AUTHORIZED,COMPLETED,REJECTED,EXPIRED,REVOKED> | 1 | required | Unknown state fails closed |
| governed_operation_record | 5 | subject_id | nonempty string | 1 | required | Exact immutable subject identity; wildcard prohibited |
| governed_operation_record | 6 | subject_coordinate | nonempty string | 1 | required | Exact Program, Batch, Wave, and Lane boundary where applicable |
| governed_operation_record | 7 | current_state_resolution_id | reference<current_state_resolution_record> | 1 | required | Resolves once and binds back to this operation |
| governed_operation_record | 8 | proposed_target_state_id | reference<B1.state> or null | 0..1 | nullable | PROPOSED, AUTHORIZED, or COMPLETED requires exact non-null target |
| governed_operation_record | 9 | reason | nonempty string | 1 | required | Exact bounded reason; chronology alone is invalid |
| governed_operation_record | 10 | scope | nonempty string | 1 | required | Exact action and effect boundary; no wildcard |
| governed_operation_record | 11 | authority_principal_id | reference<B5.authority_principal_record> or null | 0..1 | nullable | AUTHORIZED or COMPLETED requires HUMAN_OPERATOR or CONTROL_THREAD principal |
| governed_operation_record | 12 | authority_classification | reference<B5.authority_principal_record.classification> or null | 0..1 | nullable | Non-null pair must be HUMAN_OPERATOR/CONSTITUTIONAL_ORIGIN or CONTROL_THREAD/DELEGATED_DECISION |
| governed_operation_record | 13 | actor_class | reference<B5.portable_role_record.role_name> or null | 0..1 | nullable | Actor class is delivery context, not authority |
| governed_operation_record | 14 | issued_at | RFC3339 UTC timestamp or null | 0..1 | nullable | AUTHORIZED or COMPLETED requires non-null issue time |
| governed_operation_record | 15 | expires_at | RFC3339 UTC timestamp or null | 0..1 | nullable | AUTHORIZED or COMPLETED requires later non-null expiry |
| governed_operation_record | 16 | decision_token_binding_id | reference<B7.decision_token_record> or null | 0..1 | nullable | AUTHORIZED or COMPLETED requires exact B7-bound token record |
| governed_operation_record | 17 | transition_binding_id | reference<lifecycle_transition_binding> | 1 | required | Resolves once; unperformed fixture binds a NOT_ESTABLISHED transition |
| governed_operation_record | 18 | supersession_link_id | reference<supersession_link_record> or null | 0..1 | nullable | SUPERSESSION requires non-null named acyclic link before PROPOSED |
| governed_operation_record | 19 | receipt_integrity_binding_id | reference<receipt_integrity_binding> | 1 | required | Resolves once and binds back to this operation |
| governed_operation_record | 20 | bounded_effect | literal<NONE> | 1 | required | Documentary record performs no operation |
| governed_operation_record | 21 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves exactly once |
| lifecycle_transition_binding | 1 | transition_binding_id | identifier | 1 | required | Unique B13-TRANS identifier |
| lifecycle_transition_binding | 2 | operation_id | reference<governed_operation_record> | 1 | required | Resolves once and matches operation back-reference |
| lifecycle_transition_binding | 3 | b1_axis_id | reference<B1.axis> or null | 0..1 | nullable | Non-null value resolves to one independent B1 axis |
| lifecycle_transition_binding | 4 | transition_id | reference<B1.transition> or null | 0..1 | nullable | Non-null transition must be allowed by operation definition |
| lifecycle_transition_binding | 5 | source_state_id | reference<B1.state> or null | 0..1 | nullable | Non-null state must match the exact transition source |
| lifecycle_transition_binding | 6 | target_state_id | reference<B1.state> or null | 0..1 | nullable | Non-null state must match the exact transition target |
| lifecycle_transition_binding | 7 | transition_evidence_state | enum<NOT_ESTABLISHED,ESTABLISHED,INVALID> | 1 | required | ESTABLISHED requires complete exact transition evidence |
| lifecycle_transition_binding | 8 | axis_effect | enum<NONE,PROPOSED_EXACT_AXIS_ONLY,COMPLETED_EXACT_AXIS_ONLY> | 1 | required | Effect is limited to the named axis |
| lifecycle_transition_binding | 9 | separate_axis_effects | literal<NONE> | 1 | required | No silent compound-axis change |
| lifecycle_transition_binding | 10 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves exactly once |
| supersession_link_record | 1 | supersession_link_id | identifier | 1 | required | Unique B13-SUPER identifier |
| supersession_link_record | 2 | operation_id | reference<governed_operation_record> | 1 | required | Resolves to one SUPERSESSION operation |
| supersession_link_record | 3 | predecessor_subject_id | nonempty string | 1 | required | Named exact predecessor; null and wildcard prohibited |
| supersession_link_record | 4 | replacement_subject_id | nonempty string | 1 | required | Named exact replacement distinct from predecessor |
| supersession_link_record | 5 | forward_relation | literal<SUPERSEDES> | 1 | required | Replacement points to predecessor |
| supersession_link_record | 6 | reverse_relation | literal<SUPERSEDED_BY> | 1 | required | Predecessor points to replacement |
| supersession_link_record | 7 | predecessor_history_effect | literal<PRESERVE> | 1 | required | Predecessor remains immutable history |
| supersession_link_record | 8 | currentness_change_state | enum<NOT_ESTABLISHED,ESTABLISHED,INVALID> | 1 | required | ESTABLISHED requires exact separately governed evidence |
| supersession_link_record | 9 | cycle_state | enum<ACYCLIC,CYCLIC,UNAVAILABLE> | 1 | required | CYCLIC or UNAVAILABLE fails closed before currentness change |
| supersession_link_record | 10 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves exactly once |
| receipt_integrity_binding | 1 | receipt_integrity_binding_id | identifier | 1 | required | Unique B13-RECEIPT identifier |
| receipt_integrity_binding | 2 | operation_id | reference<governed_operation_record> | 1 | required | Resolves once and matches operation back-reference |
| receipt_integrity_binding | 3 | required_receipt_class_ids | ordered nonempty array<reference<B9.receipt_class_record>> | 1..* | required | Every exact B9 class ID/name join resolves |
| receipt_integrity_binding | 4 | receipt_instance_ids | ordered array<opaque receipt instance ID> | 0..* | required | Empty array means no receipt instance is established |
| receipt_integrity_binding | 5 | issuance_state | enum<NOT_ISSUED,ISSUED,INVALID> | 1 | required | Value byte-matches the B10 issuance_state closed vocabulary and is not a local or cross-record reference |
| receipt_integrity_binding | 6 | integrity_state | enum<UNVERIFIED,VERIFIED,INVALID> | 1 | required | Value byte-matches the B10 integrity_state closed vocabulary and is not a local or cross-record reference |
| receipt_integrity_binding | 7 | authenticity_state | enum<NOT_ESTABLISHED,VERIFIED,INVALID> | 1 | required | Value byte-matches the B10 authenticity_state closed vocabulary and is not a local or cross-record reference |
| receipt_integrity_binding | 8 | decision_evidence_state | enum<NOT_ESTABLISHED,ESTABLISHED,INVALID> | 1 | required | Value byte-matches the B10 decision_evidence_state closed vocabulary and is not a local or cross-record reference |
| receipt_integrity_binding | 9 | lifecycle_transition_receipt_id | opaque receipt instance ID or null | 0..1 | nullable | Null means no lifecycle-transition receipt is established |
| receipt_integrity_binding | 10 | execution_receipt_id | opaque receipt instance ID or null | 0..1 | nullable | Null means no execution receipt is established |
| receipt_integrity_binding | 11 | authority_effect | literal<NONE> | 1 | required | Receipt or integrity metadata grants no authority |
| receipt_integrity_binding | 12 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Every evidence ID resolves exactly once |
| current_state_resolution_record | 1 | current_state_resolution_id | identifier | 1 | required | Unique B13-STATE identifier |
| current_state_resolution_record | 2 | operation_id | reference<governed_operation_record> | 1 | required | Resolves once and matches operation back-reference |
| current_state_resolution_record | 3 | subject_id | nonempty string | 1 | required | Byte-matches governed operation subject |
| current_state_resolution_record | 4 | axis_state_ids | ordered array<reference<B1.state>> | 0..* | required | Every nonempty ID resolves; axes remain independent |
| current_state_resolution_record | 5 | observation_boundary | nonempty string | 1 | required | Exact SHA, accepted receipt boundary, or explicit unavailable boundary |
| current_state_resolution_record | 6 | resolution_state | enum<UNRESOLVED,ESTABLISHED,CONTRADICTORY,STALE> | 1 | required | Only ESTABLISHED may support a proposed currentness change |
| current_state_resolution_record | 7 | evidence_ids | ordered nonempty array<reference<evidence_pointer>> | 1..* | required | Mutable-only evidence cannot establish currentness |
| current_state_resolution_record | 8 | historical_record_ids | ordered array<nonempty string> | 0..* | required | Existing history is retained in declared order |
| current_state_resolution_record | 9 | history_effect | literal<PRESERVE> | 1 | required | No operation erases prior history |
| current_state_resolution_record | 10 | authority_effect | literal<NONE> | 1 | required | Resolution evidence does not grant authority |
| evidence_pointer | 1 | evidence_id | identifier | 1 | required | Unique B13-E identifier |
| evidence_pointer | 2 | source_class | enum<IMMUTABLE,MIRROR_ONLY> | 1 | required | MIRROR_ONLY remains non-controlling |
| evidence_pointer | 3 | reference | absolute URL | 1 | required | IMMUTABLE repository URL is SHA-pinned |
| evidence_pointer | 4 | observation_boundary | nonempty string | 1 | required | Exact base or mutable mirror boundary |
| evidence_pointer | 5 | authority_effect | literal<NONE> | 1 | required | Evidence does not create authority |
| reservation | 1 | reservation_id | identifier | 1 | required | Unique B13-R identifier |
| reservation | 2 | lane | enum<B14,B15> | 1 | required | Exactly one downstream Lane |
| reservation | 3 | reserved_subject | nonempty string | 1 | required | Exact downstream subject |
| reservation | 4 | execution_authority | literal<NOT_GRANTED> | 1 | required | Reservation grants no execution authority |

## 6. Rollback Rules

1. Rollback preserves accepted and historical records and records any later
   event separately.
2. B13 does not run `git revert`, restore files, mutate a database, undo an
   external effect, or change runtime state.
3. Repository rollback may bind B1-TR-020 only:
   B1-AX-06 / B1-ST-INT-03 / B1-ST-INT-04. The immutable repository event is
   later evidence, not authority or acceptance.
4. Other rollback targets require their own source-supported operation and
   evidence. If no exact B1 transition applies, lifecycle effect remains NONE.
5. Missing execution or qualifying receipt evidence leaves rollback
   unperformed, regardless of proposal text or chronology.

## 7. Reopen Rules

1. Reopen preserves the prior closeout, disposition, receipts, and evidence.
2. Reopen never restores an expired, consumed, revoked, or phase-bound route,
   decision token, exception, or other authority.
3. Reopen may use only B1-TR-003, B1-TR-006, B1-TR-013, B1-TR-014,
   B1-TR-022, B1-TR-029, or B1-TR-044, with exact matching axis and states.
4. Reopen requires fresh exact authority and separately evidenced transition.
5. Reopening one axis leaves every other lifecycle and B11 credit dimension
   unchanged unless a separate governed record establishes another effect.

## 8. Supersession Rules

1. Every supersession record names distinct exact predecessor and replacement
   subjects. An unnamed replacement is invalid.
2. `SUPERSEDES` and `SUPERSEDED_BY` links are both required.
3. The superseded predecessor remains immutable history.
4. B1-TR-025 applies from CONTROL_ACTIVE and B1-TR-026 from HELD; both target
   SUPERSEDED on B1-AX-07 and require separate Control disposition evidence.
5. A cyclic, self-referential, duplicated, or unresolved chain fails closed.
6. Supersession does not imply rollback, cancellation, rejection, invalidity,
   execution, deletion, or acceptance.
7. Chronology, repository integration, and Linear status cannot make a
   proposed replacement current.

## 9. Current-State Resolution and History Preservation

Currentness is resolved per exact subject and B1 axis at an explicit evidence
boundary. One operation cannot collapse independent axes or B11 dimensions.
`ESTABLISHED` requires immutable or otherwise accepted controlling evidence;
mutable-only, stale, contradictory, duplicate, or unresolved evidence fails
closed.

Rollback records a later reversal event without erasing prior integration.
Reopen appends a later authorized transition while retaining prior closeout.
Supersession changes controlling effect only after exact accepted evidence and
retains both predecessor and replacement histories with bidirectional links.

## 10. Authority and Decision-Token Boundary

For AUTHORIZED or COMPLETED, every governed operation requires:

- exact HUMAN_OPERATOR / CONSTITUTIONAL_ORIGIN or
  CONTROL_THREAD / DELEGATED_DECISION pairing;
- exact subject, operation kind, coordinate, scope, and actor class;
- non-null issue and later expiry boundaries;
- a separately supplied B7-compatible decision-token binding;
- exact transition and receipt-integrity bindings;
- no mismatch, expansion, transfer, reuse, expiry, or revocation.

Missing or mismatched authority or token evidence fails closed. A role,
repository state, receipt class, exception, mirror, or this artifact cannot
self-authorize an operation. Terms such as rollback, reopen, and supersession
grant no Git or runtime authority.

### Operation-State Coherence

Every governed operation must satisfy its complete row. A record that mixes
states, omits a required binding, or joins stale, contradictory, incomplete,
null, or mismatched evidence fails closed.

| operation_state | required cross-record coherence | prohibited or fail-closed condition |
| --- | --- | --- |
| UNRESOLVED_DOCUMENTARY | Authority principal, authority classification, issue time, expiry time, decision-token binding, and proposed target are null; current-state resolution is not ESTABLISHED; transition evidence is NOT_ESTABLISHED; axis effect and separate-axis effects are NONE; receipt issuance is NOT_ISSUED; integrity is UNVERIFIED; authenticity and decision evidence are NOT_ESTABLISHED; receipt-instance array is empty; lifecycle-transition and execution receipt IDs are null. | Any authority, target, transition, currentness, receipt, integrity, execution, acceptance, or effect claim fails closed. |
| DRAFT | Subject, definition, current-state resolution, transition binding, receipt-integrity binding, scope, and reason resolve; target may be null; transition cannot be completed; axis effect cannot be COMPLETED_EXACT_AXIS_ONLY; execution and lifecycle-transition receipt IDs are null; no currentness change, execution, acceptance, or operation completion is claimed. | Completed transition, completed axis effect, completed-operation receipt, currentness change, or execution claim fails closed. |
| PROPOSED | DRAFT coherence holds and proposed target is exact and non-null; any proposed B1-axis effect is PROPOSED_EXACT_AXIS_ONLY; transition evidence cannot establish completion; execution and lifecycle-transition receipt IDs are null; supersession additionally has a named bidirectional link whose currentness change remains NOT_ESTABLISHED. | Missing target, completed transition or axis effect, operation-occurrence receipt, currentness change, execution, or acceptance claim fails closed. |
| AUTHORIZED | Exact valid authority pair, issue and later expiry boundaries, target, subject, scope, actor class, B7 token binding, transition binding, receipt-integrity binding, and evidence all match; authorization evidence remains distinct from completion. Axis effect is not COMPLETED_EXACT_AXIS_ONLY; transition evidence and supersession currentness do not claim completion; execution and lifecycle-transition receipt IDs remain null. | Missing or mismatched authority, token, target, subject, scope, transition, receipt, or expiry evidence, or any completed operation effect, fails closed. |
| COMPLETED | Exact AUTHORIZED coherence remains valid; current-state resolution is ESTABLISHED; transition evidence is ESTABLISHED; an operation changing a B1 axis has COMPLETED_EXACT_AXIS_ONLY; receipt issuance is ISSUED; integrity and authenticity are VERIFIED; decision evidence is ESTABLISHED; receipt-instance array is nonempty; applicable lifecycle-transition and execution receipt IDs are non-null; required B9 receipt classes are represented; authority, token, target, subject, scope, transition, and receipt bindings match exactly. Completed supersession additionally requires currentness_change_state ESTABLISHED and cycle_state ACYCLIC. | Any missing, null, contradictory, stale, incomplete, duplicated, or mismatched completion evidence rejects COMPLETED and fails closed. |
| REJECTED | Rejection preserves all prior history and creates no later operation effect; transition and axis effect are not completed; execution and lifecycle-transition receipt IDs are null. Any issued receipt is limited to the rejection decision and cannot assert operation occurrence. A later proposal requires fresh authority. | Completed axis effect, completed-operation receipt, currentness change, execution, acceptance-by-inference, or reuse as later authority fails closed. |
| EXPIRED | Expiry preserves all prior history and creates no later operation effect; transition and axis effect are not completed; execution and lifecycle-transition receipt IDs are null. A later proposal requires fresh authority and a new operation identity or separately governed later record. | Completed axis effect, completed-operation receipt, currentness change, execution, or expired authority reuse fails closed. |
| REVOKED | Revocation preserves all prior history and creates no later operation effect; transition and axis effect are not completed; execution and lifecycle-transition receipt IDs are null. A later proposal requires fresh authority and cannot reuse the revoked authority or token. | Completed axis effect, completed-operation receipt, currentness change, execution, or revoked authority reuse fails closed. |

## 11. Receipt and Integrity Bindings

B13 uses only these exact B9 classes where applicable:

- B9-CLASS-005 / DECISION_RECEIPT
- B9-CLASS-008 / REPOSITORY_INTEGRATION_RECEIPT
- B9-CLASS-009 / EXECUTION_RECEIPT
- B9-CLASS-011 / LIFECYCLE_TRANSITION_RECEIPT

B10 states remain exact: receipt issuance is NOT_ISSUED, ISSUED, or INVALID;
integrity is UNVERIFIED, VERIFIED, or INVALID; authenticity is
NOT_ESTABLISHED, VERIFIED, or INVALID; decision evidence is NOT_ESTABLISHED,
ESTABLISHED, or INVALID.

An issued class-compatible receipt still does not create the underlying
authority or decision. Missing receipt, execution, lifecycle-transition, or
integrity evidence remains NOT_ISSUED, NOT_ESTABLISHED, or UNVERIFIED and
cannot be inferred from IDs, document text, checks, chronology, or mirrors.

## 12. Safe Non-Active Documentary Fixture

This fixture is synthetic documentary schema data. It proposes no real
rollback target and contains no active rollback, reopen, or supersession; no
issued receipt; no acceptance; no lifecycle transition; no execution; and no
external effect.

### governed_operation_record

| operation_id | operation_kind | definition_id | operation_state | subject_id | subject_coordinate | current_state_resolution_id | proposed_target_state_id | reason | scope | authority_principal_id | authority_classification | actor_class | issued_at | expires_at | decision_token_binding_id | transition_binding_id | supersession_link_id | receipt_integrity_binding_id | bounded_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B13-OP-001 | ROLLBACK | B13-DEF-001 | UNRESOLVED_DOCUMENTARY | B13-SAFE-DOCUMENTARY-FIXTURE | Q3M7Y26-P1:B13 / SAFE_DOCUMENTARY_FIXTURE | B13-STATE-001 | null | Schema conformance only; no real rollback is proposed. | NO_ACTION / NO_TARGET_MUTATION | null | null | null | null | null | null | B13-TRANS-001 | null | B13-RECEIPT-001 | NONE | [B13-E-001, B13-E-002, B13-E-003, B13-E-004, B13-E-005, B13-E-007, B13-E-008] |

### lifecycle_transition_binding

| transition_binding_id | operation_id | b1_axis_id | transition_id | source_state_id | target_state_id | transition_evidence_state | axis_effect | separate_axis_effects | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B13-TRANS-001 | B13-OP-001 | null | null | null | null | NOT_ESTABLISHED | NONE | NONE | [B13-E-001, B13-E-007] |

### receipt_integrity_binding

| receipt_integrity_binding_id | operation_id | required_receipt_class_ids | receipt_instance_ids | issuance_state | integrity_state | authenticity_state | decision_evidence_state | lifecycle_transition_receipt_id | execution_receipt_id | authority_effect | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B13-RECEIPT-001 | B13-OP-001 | [B9-CLASS-005, B9-CLASS-008, B9-CLASS-009, B9-CLASS-011] | [] | NOT_ISSUED | UNVERIFIED | NOT_ESTABLISHED | NOT_ESTABLISHED | null | null | NONE | [B13-E-004, B13-E-005, B13-E-007] |

### current_state_resolution_record

| current_state_resolution_id | operation_id | subject_id | axis_state_ids | observation_boundary | resolution_state | evidence_ids | historical_record_ids | history_effect | authority_effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B13-STATE-001 | B13-OP-001 | B13-SAFE-DOCUMENTARY-FIXTURE | [] | UNAVAILABLE_DOCUMENTARY_FIXTURE_BOUNDARY | UNRESOLVED | [B13-E-001, B13-E-007, B13-E-008] | [] | PRESERVE | NONE |

No `supersession_link_record` fixture exists. Therefore no predecessor,
replacement, currentness change, or supersession chain is asserted.

## 13. Invalid Examples

| invalid_id | rejected claim | fail-closed reason |
| --- | --- | --- |
| B13-INV-001 | Rollback erases accepted or integrated history. | History effect must be PRESERVE. |
| B13-INV-002 | B13 text runs git revert, restores files, or mutates a database. | Documentary canon performs no operation. |
| B13-INV-003 | Missing execution or receipt evidence is treated as completed rollback. | Unperformed state remains NOT_ESTABLISHED. |
| B13-INV-004 | Reopen restores expired, consumed, revoked, or phase-bound authority. | Fresh exact authority is required. |
| B13-INV-005 | Reopen uses an undeclared B1 transition. | Only source-supported transition IDs are valid. |
| B13-INV-006 | Reopening one axis silently alters another axis or credit dimension. | Independent axes and dimensions are preserved. |
| B13-INV-007 | Supersession omits the replacement subject. | Named exact replacement is mandatory. |
| B13-INV-008 | Supersession has only a forward or reverse link. | Both relations are mandatory. |
| B13-INV-009 | Supersession chain is cyclic or self-referential. | Only proven acyclic chains may establish currentness. |
| B13-INV-010 | A newer timestamp silently supersedes a predecessor. | Chronology is not accepted disposition evidence. |
| B13-INV-011 | Repository integration makes a proposed replacement current. | Integration is an independent B1 axis. |
| B13-INV-012 | Linear JAI-209 or another mirror establishes currentness. | MIRROR_ONLY is non-controlling. |
| B13-INV-013 | A B12 exception grants rollback, reopen, or supersession authority. | Exception authority is non-transitive. |
| B13-INV-014 | Decision token subject, operation, scope, actor, issue, or expiry mismatches. | Exact B7 binding is required. |
| B13-INV-015 | Receipt class or ID creates authority, acceptance, or execution. | Receipt classification and authority are independent. |
| B13-INV-016 | Rollback, reopen, or supersession term grants Git authority. | Git actions require separate exact authority. |
| B13-INV-017 | COMPLETED rollback joins unresolved current state, NOT_ESTABLISHED transition evidence, or missing execution and lifecycle receipts. | Incomplete rollback completion evidence rejects COMPLETED. |
| B13-INV-018 | COMPLETED reopen lacks ESTABLISHED current state or transition evidence, verified receipt integrity, or exact authority and token binding. | Incomplete reopen completion evidence rejects COMPLETED. |
| B13-INV-019 | COMPLETED supersession lacks a named bidirectional link, ESTABLISHED currentness, ACYCLIC chain, or complete receipt evidence. | Incomplete supersession completion evidence rejects COMPLETED. |

## 14. Implementation Reconciliation

| surface or claim | B13 classification | bounded result |
| --- | --- | --- |
| B1 integration `REVERTED` | SOURCE_SUPPORTED_TRANSITION | Repository history event only; prior integration preserved. |
| B1 held-to-active transition | SOURCE_SUPPORTED_REOPEN_TRANSITION | Exact control-axis transition only with fresh evidence. |
| B1 `SUPERSEDED` | SOURCE_SUPPORTED_CONTROL_STATE | Named replacement and accepted disposition required. |
| Git revert or file restoration | NOT_EXECUTED | Requires separate exact repository mutation authority. |
| Database, runtime, or external-effect rollback | NOT_EXECUTED | Requires separate target-specific authority and direct evidence. |
| B12 exception | NON_TRANSITIVE_INPUT | Creates no B13 operation authority. |
| B13 safe fixture | UNRESOLVED_DOCUMENTARY | No active operation, receipt, transition, execution, or effect. |
| Linear JAI-209 | MIRROR_ONLY | Non-controlling route corroboration; not accessed or refreshed. |

## 15. Evidence Pointer Registry

| evidence_id | source_class | reference | observation_boundary | authority_effect |
| --- | --- | --- | --- | --- |
| B13-E-001 | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/a2997d446a7b4b5bea62a9cc4fca74033ddd851b/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md | REQUIRED_BASE / exact lifecycle axes, states, and transitions | NONE |
| B13-E-002 | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/a2997d446a7b4b5bea62a9cc4fca74033ddd851b/docs/reference/q3m7y26-p1-b5-role-authority-matrix-v0.md | REQUIRED_BASE / authority principals, classifications, scope, expiry, and non-transitivity | NONE |
| B13-E-003 | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/a2997d446a7b4b5bea62a9cc4fca74033ddd851b/docs/reference/q3m7y26-p1-b7-decision-token-disposition-canon-v0.md | REQUIRED_BASE / exact decision-token binding and B13 reservation | NONE |
| B13-E-004 | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/a2997d446a7b4b5bea62a9cc4fca74033ddd851b/docs/reference/q3m7y26-p1-b9-receipt-taxonomy-v0.md | REQUIRED_BASE / exact receipt class IDs and non-receipt boundaries | NONE |
| B13-E-005 | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/a2997d446a7b4b5bea62a9cc4fca74033ddd851b/docs/reference/q3m7y26-p1-b10-acceptance-receipt-integrity-schema-v0.md | REQUIRED_BASE / non-issued and unverified receipt-integrity semantics | NONE |
| B13-E-006 | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/a2997d446a7b4b5bea62a9cc4fca74033ddd851b/docs/reference/q3m7y26-p1-b11-capability-credit-ledger-v0.md | REQUIRED_BASE / independent credit dimensions and non-transitive boundaries | NONE |
| B13-E-007 | IMMUTABLE | https://github.com/jai-nexus/dev-jai-nexus/blob/a2997d446a7b4b5bea62a9cc4fca74033ddd851b/docs/reference/q3m7y26-p1-b12-exception-out-of-sequence-work-canon-v0.md | REQUIRED_BASE / exception non-authority and B13 reservation | NONE |
| B13-E-008 | MIRROR_ONLY | https://linear.app/jai-nexus/issue/JAI-209 | CONTROL_THREAD_SUPPLIED_ROUTE_CORROBORATION / CODEX_NOT_ACCESSED_OR_REFRESHED / NON_CONTROLLING | NONE |

Every evidence ID is used. B13-E-008 contributes no state, currentness,
authority, receipt, acceptance, or execution evidence.

## 16. Deterministic Serialization

1. Record types serialize in this order: `operation_definition`,
   `governed_operation_record`, `lifecycle_transition_binding`,
   `supersession_link_record`, `receipt_integrity_binding`,
   `current_state_resolution_record`, `evidence_pointer`, `reservation`.
2. Fields serialize by declared ordinal.
3. Rows sort by ascending primary identifier.
4. Arrays preserve declared order. Reference arrays use ascending ID order
   unless an accepted predecessor canon defines semantic order.
5. Timestamps use RFC3339 UTC with `Z`.
6. Missing nullable values serialize as literal `null`; empty arrays serialize
   as `[]`.
7. Unknown keys, duplicate IDs, undeclared enums, unresolved references,
   invalid principal/classification pairs, transition mismatches, unnamed
   replacements, missing reverse links, stale evidence, and cyclic chains fail
   closed.

## 17. Separate B14 and B15 Reservations

| reservation_id | lane | reserved_subject | execution_authority |
| --- | --- | --- | --- |
| B13-R-001 | B14 | GitHub-Linear Mirror Protocol | NOT_GRANTED |
| B13-R-002 | B15 | Lifecycle Canon Verification and Batch B Closeout | NOT_GRANTED |

B13 does not absorb, execute, or authorize B14 or B15.

## 18. Risks, Rollback, and Recommendation

The primary risks are history erasure, authority restoration by implication,
cross-axis state collapse, unnamed or cyclic supersession, and chronology or
mirror status treated as currentness evidence.

Rollback of this documentary artifact means a separately authorized later
repository event or documentary correction. This section does not authorize
`git revert`, file restoration, branch deletion, or history rewrite.

Recommendation: route independent verification of record counts, exact B1,
B5, B7, B9, B10, B11, and B12 joins, safe fixture conformance, and all
non-authorization boundaries before any B13 acceptance decision.

## 19. Final Audit and Explicit Non-Authorizations

| check | result |
| --- | --- |
| Record types and Field Registry | PASS - 8 types / 80 fields |
| Primary identifiers | PASS - unique |
| Operation definitions | PASS - 3 distinct operations |
| Safe fixture/schema coherence | PASS - UNRESOLVED_DOCUMENTARY tuple exactly conforms; no completed fixture |
| Local references | PASS - all resolve with matching back-references |
| B1 transition and state joins | PASS - exact rollback, reopen, and supersession allowlists resolve |
| B5 authority joins | PASS - exact principals, classifications, and pair rules |
| B7 token boundary | PASS - nullable binding; fixture value null |
| B9 receipt-class joins | PASS - 4 exact ID/name pairs |
| B10 value-domain conformance | PASS - 4 exact closed enums byte-match B10 and are not references |
| Operation-state coherence | PASS - all 8 states have complete cross-record rules |
| COMPLETED fail-closed coherence | PASS - rollback, reopen, and supersession reject incomplete evidence |
| Evidence IDs defined and used | PASS - 8/8 |
| Immutable paths resolved | PASS - 7/7 at the required base |
| Unnamed supersession replacements | PASS - 0 |
| Cyclic supersession chains | PASS - 0 |
| Active operation fixtures | PASS - 0 |
| Issued receipt fixtures | PASS - 0 |
| Lifecycle transitions performed | PASS - 0 |
| Positive authority or acceptance grants | PASS - 0 |
| Execution or external-effect grants | PASS - 0 |
| Batch, Program, or JAI credit grants | PASS - 0 |
| Sensitive-value findings | PASS - 0 within this artifact |
| B14/B15 absorption | PASS - 0; two reservations preserved |
| Whitespace and one-path scope | PASS - git diff --check exit 0; no-index raw exit 1 with zero diagnostics |

No staging, commit, push, PR, GitHub or Linear mutation, package/test/build,
runtime, rollback, reopen, supersession, receipt issuance, acceptance,
execution, external effect, deployment, branch deletion, Batch exit, Program
exit, or JAI activation authority is granted.

B13_MAXIMUM_CURRENT_CREDIT:
DOCUMENTATION_ROLLBACK_REOPEN_SUPERSESSION_CANON_ONLY

B13_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B13_MERGE_AUTHORITY: NOT_GRANTED
B14_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B13_ROLLBACK_REOPEN_SUPERSESSION_CANON
