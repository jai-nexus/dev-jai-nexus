# Q3M7Y26-P1 B4 Batch, Wave, and Lane Decomposition Canon v0

## Status

| Field | Value |
| --- | --- |
| Record ID | B4-BATCH-WAVE-LANE-DECOMPOSITION-CANON-v0 |
| Coordinate | Q3M7Y26-P1:B4 |
| Batch / Wave / Lane | B / B-A / B4 - Batch, Wave, and Lane Decomposition Canon |
| Route | CT-2026-07-24-Q3M7Y26-P1-START-B4-BATCH-WAVE-LANE-DECOMPOSITION-CANON-v0 |
| Work Packet | Q3M7Y26-P1-B4-v0 |
| Role | JAI::DEV::BUILDER |
| Repository basis | jai-nexus/dev-jai-nexus@a1c3fe48cce0b26272e8bb12ea00e621724cb320 |
| B3 acceptance | CT-2026-07-24-Q3M7Y26-P1-B3-ACCEPT-v0 |
| Status | DOCUMENTARY_CANON_PROPOSED / PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION |
| Evidence ceiling | BATCH_WAVE_LANE_DECOMPOSITION_DOCUMENTATION_ONLY |

This proposed documentary canon defines structural record shapes only. It does
not route, execute, verify, accept, integrate, close, activate, or otherwise
progress a Program, Batch, Wave, or Lane.

The B3 acceptance token is fresh CONTROL_THREAD evidence supplied by this B4
route. PR #404 and main may prove repository integration only; neither
independently creates B3 acceptance.

## Source precedence

[A2] governs source precedence. Accepted decisions and receipts control only
their named scope and time. SHA-pinned repository content at [BASE] proves
repository content, not authority. The Linear identifiers reproduced from [A6]
are mutable coordination mirrors, classified MIRROR_ONLY; they cannot define
identity, parentage, completion, acceptance, or authority.

| Source class | B4 use | Prohibited inference |
| --- | --- | --- |
| Fresh accepted decision | Records separately accepted scope or disposition | B4 cannot self-authorize one |
| Accepted motion or receipt | Supplies Program, prerequisite, and freeze facts | Does not automatically route children |
| Accepted repository canon | Supplies B1, B2, B3, and A6 constraints | Does not manufacture lifecycle state |
| SHA-pinned repository integration | Proves exact declaration | Does not prove runtime or acceptance |
| Linear or GitHub mirror | Labeled coordination reference only | Never becomes canon |

## Definitions

| Term | Meaning |
| --- | --- |
| Program | B2-bound identity containing structural Batch records; not lifecycle, authority, or runtime state. |
| Batch | Named structural grouping of Waves in one Program. |
| Wave | Named structural grouping of Lanes in one Batch. |
| Lane | B2-coordinate-bounded unit; title is descriptive and has no implied execution authority. |
| Structural parentage | Typed containment only: Program to Batch, Batch to Wave, or Wave to Lane. |
| Dependency | Evidence-bound prerequisite relation that neither satisfies nor routes work. |
| Entry criterion | Named evidence-bound condition for a later separate entry decision. |
| Exit criterion | Named evidence-bound condition for a later separate exit decision. |
| Reservation | Durable identifier/scope record without completion, routing, or execution meaning. |
| Cancellation | Tombstone/history disposition that never deletes or frees accepted identity. |
| Supersession | Named replacement relation that preserves and never renumbers the original. |

## Identity and lifecycle boundaries

B2 coordinate identity remains controlling. Parentage, dependencies, criteria,
reservations, replacements, titles, routes, roles, lifecycle, acceptance,
credit, repository, Linear, and runtime state are not coordinate identity
fields. Titles cannot repair or rename identity.

B1 axes remain independent. Structural presence, parentage, a dependency edge,
or a fixture never manufactures planning, routing, delivery, verification,
acceptance, repository integration, Program operation, runtime activation, or
mirror state. B3 remains prospective Charter documentation and neither
satisfies B4 criteria nor alters the accepted Program 1 opening receipt.

## Typed decomposition schema

All arrays sort by ascending stable record ID. Every listed key occurs once.
Unknown or duplicate keys, duplicate IDs, ambiguous parentage, unbound
evidence, and contradictory state are invalid.

| Record type | Canonical key order | Cardinality and validation |
| --- | --- | --- |
| batch_record | batch_id, batch_code, batch_title, parent_program_id, evidence_pointer | One or more per Program; batch_id/code unique; title descriptive. |
| wave_record | wave_id, wave_code, wave_title, parent_batch_id, evidence_pointer | One or more per Batch; IDs/codes unique within parent. |
| lane_record | lane_id, coordinate, lane_code, lane_title, parent_wave_id, evidence_pointer | One or more per Wave; portable core only; lane_id/coordinate unique. |
| parent_child_relationship | relationship_id, parent_type, parent_id, child_type, child_id, relationship_kind, evidence_pointer | Exactly one structural-parent relation per child; relationship_kind is CONTAINS. |
| dependency_record | dependency_id, dependent_id, prerequisite_id, dependency_kind, status, evidence_pointer | Zero or more; explicit kind/status; not satisfaction. |
| criterion_record | criterion_id, subject_id, criterion_type, statement, status, evidence_pointer | Zero or more; criterion_type ENTRY or EXIT; status evidence-bound. |
| reservation_replacement_relationship | relationship_id, subject_id, disposition, replacement_id, rationale, evidence_pointer | One record when reserved, cancelled, or superseded; replacement_id required only for SUPERSEDED. |
| evidence_pointer | evidence_id, source_class, immutability, reference, claim | One or more; immutability IMMUTABLE or MUTABLE_CORROBORATING. |
| mirror_reference | mirror_reference_id, subject_id, provider, external_id, classification, evidence_pointer | Zero or more per subject; external coordination only. |

### Field-level type contract

Every string below is a non-empty UTF-8 string unless nullable is explicitly
stated. Every identifier matches its record family identifier and is unique
within this document. Every reference is a defined evidence_pointer reference.

| Record | Field contract |
| --- | --- |
| batch_record | batch_id: required stable identifier; batch_code: required B2 Batch-code string; batch_title: required descriptive string; parent_program_id: required accepted Program-ID string; evidence_pointer: required defined reference; cardinality exactly 1 per record. |
| wave_record | wave_id: required stable identifier; wave_code: required B2 Wave-code string; wave_title: nullable descriptive string or exact NONE; parent_batch_id: required existing batch_id; evidence_pointer: required defined reference; cardinality exactly 1 per record. |
| lane_record | lane_id: required stable identifier; coordinate: required B2 full-coordinate string; lane_code: required B2 Lane-code string; lane_title: required descriptive string; parent_wave_id: required existing wave_id; evidence_pointer: required defined reference; cardinality exactly 1 per record. No Linear or GitHub field is permitted. |
| parent_child_relationship | relationship_id: required stable identifier; parent_type: required enum PROGRAM, BATCH, WAVE; parent_id: required existing parent identifier; child_type: required enum BATCH, WAVE, LANE; child_id: required existing child identifier; relationship_kind: exact CONTAINS; evidence_pointer: required defined reference; cardinality exactly 1 per fixture child. |
| dependency_record | dependency_id, dependent_id, prerequisite_id: required identifiers; dependency_kind: required enum STRUCTURAL, EVIDENCE, ENTRY_GATE, EXIT_GATE; status: required enum DECLARED, SATISFIED, NOT_SATISFIED, NOT_EVALUATED, UNRESOLVED; evidence_pointer: required defined reference; cardinality zero or more. |
| criterion_record | criterion_id and subject_id: required identifiers; criterion_type: exact ENTRY or EXIT; statement: required string; status: required enum NOT_EVALUATED, SATISFIED, NOT_SATISFIED, UNRESOLVED; evidence_pointer: required defined reference; cardinality zero or more. Documentary conformance is not satisfaction. |
| reservation_replacement_relationship | relationship_id and subject_id: required identifiers; disposition: exact RESERVED, CANCELLED, or SUPERSEDED; replacement_id: null for RESERVED/CANCELLED and required non-null existing identifier for SUPERSEDED; rationale and evidence_pointer: required strings; cardinality exactly 1 when a disposition exists. SUPERSEDED additionally requires a separately accepted supersession disposition; CANCELLED preserves original identity and history. |
| evidence_pointer | evidence_id: required stable identifier; source_class: required controlled source-class string; immutability: exact IMMUTABLE or MUTABLE_CORROBORATING; reference: required string; claim: required string; cardinality one or more. IMMUTABLE repository references must be SHA-pinned. MUTABLE_CORROBORATING references must record an observation boundary or retrieval date, remain non-controlling, and cannot be represented as immutable. |
| mirror_reference | mirror_reference_id and subject_id: required identifiers; provider: required external-system string; external_id: required provider-scoped string; classification: exact MIRROR_ONLY; evidence_pointer: required defined reference; cardinality zero or more. It affects no identity, parentage, criteria, lifecycle, completion, acceptance, credit, or authority. |

Canonical serialization order is Batch, Wave, Lane, parent-child, dependency,
criterion, reservation/replacement, evidence pointers, then mirror references.
Serialization has no lifecycle or authority effect.

## Numbering, reservation, and progression rules

1. The Q3M7Y26-P1 standard 15-Lane convention is Wave A: lanes 1-4; Wave B:
   lanes 5-8; Wave C: lanes 9-12; Wave D: lanes 13-15.
2. This convention is Program-specific, not universal.
3. Accepted identifiers are never silently reused. A gap does not imply
   completion, cancellation, or availability.
4. Cancellation preserves a tombstone/history record; it cannot delete, free,
   or renumber a coordinate.
5. Supersession requires a named replacement and accepted disposition; it
   preserves the original.
6. Work outside a reserved envelope requires a separate Control decision.
7. Parent planning never automatically routes children; parent entry never
   grants child execution.
8. Documented nonuniform mappings, including Batch D, remain source-recorded
   historical mappings with their original source classification preserved. B4
   neither upgrades nor retroactively renumbers them to fit this convention.

## Entry and exit criteria

Criteria must name subject, type, statement, status, and evidence pointer.
Documentary presence is not satisfaction. Child completion does not close a
Wave, Batch, or Program. All progression needs separately accepted evidence and
authority in the applicable B1 axis.

| ID | Subject | Type | B4 posture |
| --- | --- | --- | --- |
| B4-CRIT-001 | Future Batch | ENTRY | Requires named evidence and separate entry decision; not evaluated. |
| B4-CRIT-002 | Future Wave | ENTRY | Requires named evidence and separate entry decision; not evaluated. |
| B4-CRIT-003 | Future Lane | ENTRY | Requires named evidence and exact separate execution route; not evaluated. |
| B4-CRIT-004 | Wave, Batch, or Program | EXIT | Requires named evidence and separate exit decision; never inferred from child artifacts. |

## Batch B structured fixture

The fixture preserves A6 Batch B structure only. Lane records below are the
portable core. The separate mirror-reference table contains the A6 Linear
identifiers; no Linear query, mutation, or authority is involved.

| lane_id | coordinate | lane_code | lane_title | parent_wave_id | evidence_pointer |
| --- | --- | --- | --- | --- | --- |
| P1-B-LANE-01 | Q3M7Y26-P1:B1 | B1 | Lifecycle Vocabulary and State Machine | P1-B-WAVE-A | A6 |
| P1-B-LANE-02 | Q3M7Y26-P1:B2 | B2 | Control Coordinates Canon | P1-B-WAVE-A | A6 |
| P1-B-LANE-03 | Q3M7Y26-P1:B3 | B3 | Program Charter Schema | P1-B-WAVE-A | A6 |
| P1-B-LANE-04 | Q3M7Y26-P1:B4 | B4 | Batch, Wave, and Lane Decomposition Canon | P1-B-WAVE-A | A6 |
| P1-B-LANE-05 | Q3M7Y26-P1:B5 | B5 | Role and Authority Matrix | P1-B-WAVE-B | A6 |
| P1-B-LANE-06 | Q3M7Y26-P1:B6 | B6 | Work Packet Canon | P1-B-WAVE-B | A6 |
| P1-B-LANE-07 | Q3M7Y26-P1:B7 | B7 | Decision Token and Disposition Canon | P1-B-WAVE-B | A6 |
| P1-B-LANE-08 | Q3M7Y26-P1:B8 | B8 | Evidence Bundle Schema | P1-B-WAVE-B | A6 |
| P1-B-LANE-09 | Q3M7Y26-P1:B9 | B9 | Receipt Taxonomy | P1-B-WAVE-C | A6 |
| P1-B-LANE-10 | Q3M7Y26-P1:B10 | B10 | Acceptance Receipt and Integrity Schema | P1-B-WAVE-C | A6 |
| P1-B-LANE-11 | Q3M7Y26-P1:B11 | B11 | Capability and Credit Ledger | P1-B-WAVE-C | A6 |
| P1-B-LANE-12 | Q3M7Y26-P1:B12 | B12 | Exception and Out-of-Sequence Work Canon | P1-B-WAVE-C | A6 |
| P1-B-LANE-13 | Q3M7Y26-P1:B13 | B13 | Rollback, Reopen, and Supersession Canon | P1-B-WAVE-D | A6 |
| P1-B-LANE-14 | Q3M7Y26-P1:B14 | B14 | GitHub-Linear Mirror Protocol | P1-B-WAVE-D | A6 |
| P1-B-LANE-15 | Q3M7Y26-P1:B15 | B15 | Lifecycle Canon Verification and Batch B Closeout | P1-B-WAVE-D | A6 |

Batch record: P1-BATCH-B / B / Program Lifecycle and Receipt Canon /
parent_program_id jai-governance-intelligence-main-state-operating-loop-v0 /
evidence_pointer A6.

Wave records, in canonical order: P1-B-WAVE-A / B-A / wave_title NONE;
P1-B-WAVE-B / B-B / wave_title NONE; P1-B-WAVE-C / B-C / wave_title NONE;
P1-B-WAVE-D / B-D / wave_title NONE. Each parent_batch_id is P1-BATCH-B and
each evidence_pointer is A6. Membership is B-A: B1-B4; B-B: B5-B8; B-C:
B9-B12; B-D: B13-B15. This is not evidence of entry, execution, completion,
acceptance, or Batch exit.

| Mirror reference ID | Subject ID | Provider | External ID | Classification | Evidence pointer |
| --- | --- | --- | --- | --- | --- |
| P1-B-MIRROR-01 | P1-B-LANE-01 | Linear | JAI-198 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-02 | P1-B-LANE-02 | Linear | JAI-199 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-03 | P1-B-LANE-03 | Linear | JAI-200 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-04 | P1-B-LANE-04 | Linear | JAI-201 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-05 | P1-B-LANE-05 | Linear | JAI-202 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-06 | P1-B-LANE-06 | Linear | JAI-203 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-07 | P1-B-LANE-07 | Linear | JAI-206 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-08 | P1-B-LANE-08 | Linear | JAI-205 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-09 | P1-B-LANE-09 | Linear | JAI-204 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-10 | P1-B-LANE-10 | Linear | JAI-207 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-11 | P1-B-LANE-11 | Linear | JAI-208 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-12 | P1-B-LANE-12 | Linear | JAI-211 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-13 | P1-B-LANE-13 | Linear | JAI-209 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-14 | P1-B-LANE-14 | Linear | JAI-210 | MIRROR_ONLY | A6 |
| P1-B-MIRROR-15 | P1-B-LANE-15 | Linear | JAI-212 | MIRROR_ONLY | A6 |

| relationship_id | parent_type | parent_id | child_type | child_id | relationship_kind | evidence_pointer |
| --- | --- | --- | --- | --- | --- | --- |
| P1-REL-001 | PROGRAM | jai-governance-intelligence-main-state-operating-loop-v0 | BATCH | P1-BATCH-B | CONTAINS | A6 |
| P1-REL-002 | BATCH | P1-BATCH-B | WAVE | P1-B-WAVE-A | CONTAINS | A6 |
| P1-REL-003 | BATCH | P1-BATCH-B | WAVE | P1-B-WAVE-B | CONTAINS | A6 |
| P1-REL-004 | BATCH | P1-BATCH-B | WAVE | P1-B-WAVE-C | CONTAINS | A6 |
| P1-REL-005 | BATCH | P1-BATCH-B | WAVE | P1-B-WAVE-D | CONTAINS | A6 |
| P1-REL-006 | WAVE | P1-B-WAVE-A | LANE | P1-B-LANE-01 | CONTAINS | A6 |
| P1-REL-007 | WAVE | P1-B-WAVE-A | LANE | P1-B-LANE-02 | CONTAINS | A6 |
| P1-REL-008 | WAVE | P1-B-WAVE-A | LANE | P1-B-LANE-03 | CONTAINS | A6 |
| P1-REL-009 | WAVE | P1-B-WAVE-A | LANE | P1-B-LANE-04 | CONTAINS | A6 |
| P1-REL-010 | WAVE | P1-B-WAVE-B | LANE | P1-B-LANE-05 | CONTAINS | A6 |
| P1-REL-011 | WAVE | P1-B-WAVE-B | LANE | P1-B-LANE-06 | CONTAINS | A6 |
| P1-REL-012 | WAVE | P1-B-WAVE-B | LANE | P1-B-LANE-07 | CONTAINS | A6 |
| P1-REL-013 | WAVE | P1-B-WAVE-B | LANE | P1-B-LANE-08 | CONTAINS | A6 |
| P1-REL-014 | WAVE | P1-B-WAVE-C | LANE | P1-B-LANE-09 | CONTAINS | A6 |
| P1-REL-015 | WAVE | P1-B-WAVE-C | LANE | P1-B-LANE-10 | CONTAINS | A6 |
| P1-REL-016 | WAVE | P1-B-WAVE-C | LANE | P1-B-LANE-11 | CONTAINS | A6 |
| P1-REL-017 | WAVE | P1-B-WAVE-C | LANE | P1-B-LANE-12 | CONTAINS | A6 |
| P1-REL-018 | WAVE | P1-B-WAVE-D | LANE | P1-B-LANE-13 | CONTAINS | A6 |
| P1-REL-019 | WAVE | P1-B-WAVE-D | LANE | P1-B-LANE-14 | CONTAINS | A6 |
| P1-REL-020 | WAVE | P1-B-WAVE-D | LANE | P1-B-LANE-15 | CONTAINS | A6 |

## Invalid examples

| ID | Invalid condition | Required result |
| --- | --- | --- |
| B4-INV-001 | Reused accepted lane identity. | Invalid; preserve original and require separately accepted new identity. |
| B4-INV-002 | Parent Batch planning inferred as child authority. | Invalid; parent planning never routes or executes a child. |
| B4-INV-003 | Nonuniform history silently renumbered. | Invalid; preserve history and record amendment separately. |
| B4-INV-004 | SUPERSEDED without replacement_id and accepted disposition. | Invalid; named replacement is required. |
| B4-INV-005 | Cancellation treated as deletion. | Invalid; preserve tombstone/history. |
| B4-INV-006 | Gap treated as completion or availability. | Invalid; gap has no lifecycle meaning. |
| B4-INV-007 | Mutable mirror treated as canon. | Invalid; mirrors remain MIRROR_ONLY. |
| B4-INV-008 | Batch exit inferred from merged Lane artifacts. | Invalid; Batch exit has its own evidence-bound accepted criterion. |

## Reserved downstream boundaries

| Reservation ID | Subject | Boundary |
| --- | --- | --- |
| B4-R-01 | B5 Role and Authority Matrix | No role assignment or authority matrix. |
| B4-R-02 | B6 Work Packet Canon | No Work Packet semantics or issuance. |
| B4-R-03 | B7 Decision Token and Disposition Canon | No token or disposition semantics. |
| B4-R-04 | B8 Evidence Bundle Schema | No bundle construction or acceptance. |
| B4-R-05 | B9 Receipt Taxonomy | No receipt taxonomy. |
| B4-R-06 | B10 Acceptance Receipt and Integrity Schema | No acceptance receipt or integrity schema. |
| B4-R-07 | B11 Capability and Credit Ledger | No capability or credit determination. |
| B4-R-08 | B12 Exception and Out-of-Sequence Work Canon | No exception or out-of-sequence authorization. |
| B4-R-09 | B13 Rollback, Reopen, and Supersession Canon | No rollback, reopen, or supersession disposition. |
| B4-R-10 | B14 GitHub-Linear Mirror Protocol | No GitHub or Linear action, state, or protocol change. |
| B4-R-11 | B15 Lifecycle Canon Verification and Batch B Closeout | No verification, Batch exit, or closeout. |

## Unresolved evidence, risks, and non-authorizations

| ID | Boundary | Treatment |
| --- | --- | --- |
| B4-U-001 | Current Batch B entry and execution authority | NOT_GRANTED; no Batch-wide entry or execution authority. The B4 route grants only this one-file documentary authoring authority. |
| B4-U-002 | Current acceptance receipts for Batches, Waves, and Lanes | UNRESOLVED; no receipt is fabricated from structure. |
| B4-U-003 | Completion evidence for Batch B fixture | UNRESOLVED; A6 and mirrors do not prove completion. |
| B4-U-004 | Universal decomposition convention | UNRESOLVED; 15-Lane convention is Program-specific. |

Risk: treating structural adjacency, merged artifacts, or a mutable mirror as
authority or completion. B4 fails closed. A later accepted documentary repair
may correct this artifact, but B4 does not cancel, reopen, supersede, renumber,
route, or change a record.

B4 grants no positive route, execution, delivery, verification, acceptance,
integration, Batch exit, Program exit, runtime, deployment, provider, model,
API, database, customer, Agent, Council, GitHub, Linear, merge, or JAI
activation authority. It creates no Work Packet, receipt, criterion
satisfaction, lifecycle state, credit, or external effect.

## Reference definitions

All references are immutable and SHA-pinned to [BASE]; they are definitions,
not proof that a mutable external system agrees.

| evidence_id | source_class | immutability | reference | claim |
| --- | --- | --- | --- | --- |
| B4-E-001 | Repository basis | IMMUTABLE | BASE | B4 cutoff. |
| B4-E-002 | Accepted repository reference | IMMUTABLE | A2 | Precedence. |
| B4-E-003 | Accepted repository reference | IMMUTABLE | A5 | Active/frozen posture. |
| B4-E-004 | Accepted repository reference | IMMUTABLE | A6 | Fixture coordinates, titles, and mirror-only identifiers. |
| B4-E-005 | Accepted repository reference | IMMUTABLE | A8 | Role-route separation. |
| B4-E-006 | Accepted repository reference | IMMUTABLE | B1 | Lifecycle separation. |
| B4-E-007 | Accepted repository reference | IMMUTABLE | B2 | Coordinate identity limits. |
| B4-E-008 | Accepted repository reference | IMMUTABLE | B3 | Charter boundary. |
| B4-E-009 | Accepted repository receipt | IMMUTABLE | OPENING-RECEIPT | Planning-only posture. |
| B4-E-010 | Ratified repository motion | IMMUTABLE | MOTION-DECISION | Sequence and freeze rules. |

| Ref | Immutable definition | Claim |
| --- | --- | --- |
| [BASE] | [commit a1c3fe4](https://github.com/jai-nexus/dev-jai-nexus/tree/a1c3fe48cce0b26272e8bb12ea00e621724cb320) | B4 cutoff. |
| [A2] | [A2](https://github.com/jai-nexus/dev-jai-nexus/blob/a1c3fe48cce0b26272e8bb12ea00e621724cb320/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md) | Precedence. |
| [A5] | [A5](https://github.com/jai-nexus/dev-jai-nexus/blob/a1c3fe48cce0b26272e8bb12ea00e621724cb320/docs/reference/q3m7y26-p1-a5-active-frozen-program-registry-v0.md) | Active/frozen posture. |
| [A6] | [A6](https://github.com/jai-nexus/dev-jai-nexus/blob/a1c3fe48cce0b26272e8bb12ea00e621724cb320/docs/reference/q3m7y26-p1-a6-control-coordinate-registry-v0.md) | Batch B titles and mirror IDs. |
| [A8] | [A8](https://github.com/jai-nexus/dev-jai-nexus/blob/a1c3fe48cce0b26272e8bb12ea00e621724cb320/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md) | Role-route separation. |
| [B1] | [B1](https://github.com/jai-nexus/dev-jai-nexus/blob/a1c3fe48cce0b26272e8bb12ea00e621724cb320/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md) | Lifecycle separation. |
| [B2] | [B2](https://github.com/jai-nexus/dev-jai-nexus/blob/a1c3fe48cce0b26272e8bb12ea00e621724cb320/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md) | Identity limits. |
| [B3] | [B3](https://github.com/jai-nexus/dev-jai-nexus/blob/a1c3fe48cce0b26272e8bb12ea00e621724cb320/docs/reference/q3m7y26-p1-b3-program-charter-schema-v0.md) | Charter boundary. |
| [OPENING-RECEIPT] | [opening receipt](https://github.com/jai-nexus/dev-jai-nexus/blob/a1c3fe48cce0b26272e8bb12ea00e621724cb320/docs/reference/q3m7y26-jai-governance-intelligence-main-state-operating-loop-program-opening-receipt-v0.md) | Planning-only and zero execution gates. |
| [MOTION-DECISION] | [motion-0248 decision](https://github.com/jai-nexus/dev-jai-nexus/blob/a1c3fe48cce0b26272e8bb12ea00e621724cb320/.nexus/motions/motion-0248/decision.yaml) | Sequence, routes, freezes. |

B4_MAXIMUM_CURRENT_CREDIT: BATCH_WAVE_LANE_DECOMPOSITION_DOCUMENTATION_ONLY
B4_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B4_FURTHER_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B4_DECOMPOSITION_CANON
