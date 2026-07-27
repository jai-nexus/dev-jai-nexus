# Q3M7Y26-P1 B11 Capability and Credit Ledger v0

## Status and Purpose
Role: JAI::DEV::BUILDER
Route: CT-2026-07-27-Q3M7Y26-P1-REVISE-B11-COMPACT-CAPABILITY-CREDIT-LEDGER-v0
Base: c5870f1755dad88082a2be1f0d27fceef2f57dca
Evidence ceiling: DOCUMENTATION_CAPABILITY_AND_CREDIT_LEDGER_ONLY

B11 is documentary only. This route authorizes this file only. Creating it
grants no capability, acceptance, execution, deployment, external-effect,
Batch-exit, Program-exit, or activation credit.

## Canonical Record Types
| type_id | record_type | field_count | ordinals |
| --- | --- | ---: | --- |
| B11-TYPE-01 | credit_dimension_definition | 8 | 1-8 |
| B11-TYPE-02 | credit_ledger_entry | 11 | 1-11 |
| B11-TYPE-03 | evidence_pointer | 5 | 1-5 |
| B11-TYPE-04 | inference_prohibition | 5 | 1-5 |
| B11-TYPE-05 | unresolved_boundary | 5 | 1-5 |
| B11-TYPE-06 | reservation | 4 | 1-4 |

## Canonical Field Registry
| record_type | ordinal | field_name | type | cardinality | requiredness | rule |
| --- | ---: | --- | --- | --- | --- | --- |
| credit_dimension_definition | 1 | dimension_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| credit_dimension_definition | 2 | dimension | closed enum | 1 | required | NOT_A_REFERENCE |
| credit_dimension_definition | 3 | definition | string | 1 | required | NOT_A_REFERENCE |
| credit_dimension_definition | 4 | minimum_evidence | string | 1 | required | NOT_A_REFERENCE |
| credit_dimension_definition | 5 | authority_requirement | string | 1 | required | NOT_A_REFERENCE |
| credit_dimension_definition | 6 | b1_axis_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| credit_dimension_definition | 7 | non_transitive_from | ordered array<reference<credit_dimension_definition>> | 0..* | required | Every nonempty value resolves exactly once |
| credit_dimension_definition | 8 | evidence_ids | ordered array<reference<evidence_pointer>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_evidence_pointer.evidence_id |
| credit_ledger_entry | 1 | entry_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| credit_ledger_entry | 2 | subject | string | 1 | required | NOT_A_REFERENCE |
| credit_ledger_entry | 3 | dimension_id | reference<credit_dimension_definition> | 1 | required | RESOLVES_EXACTLY_ONCE_TO_credit_dimension_definition.dimension_id |
| credit_ledger_entry | 4 | credit_state | enum<ESTABLISHED,NOT_ESTABLISHED,UNAVAILABLE,CONTRADICTORY,REVOKED,EXPIRED,SUPERSEDED> | 1 | required | Exact closed enum |
| credit_ledger_entry | 5 | scope | string | 1 | required | NOT_A_REFERENCE |
| credit_ledger_entry | 6 | evidence_ids | ordered array<reference<evidence_pointer>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_evidence_pointer.evidence_id |
| credit_ledger_entry | 7 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| credit_ledger_entry | 8 | acceptance_state | enum<ESTABLISHED,NOT_ESTABLISHED,UNAVAILABLE,CONTRADICTORY> | 1 | required | Exact closed enum |
| credit_ledger_entry | 9 | integration_state | enum<ESTABLISHED,NOT_ESTABLISHED,UNAVAILABLE,CONTRADICTORY> | 1 | required | Exact closed enum |
| credit_ledger_entry | 10 | invalidation_state | enum<ACTIVE,REVOKED,EXPIRED,SUPERSEDED> | 1 | required | Exact closed enum |
| credit_ledger_entry | 11 | unresolved_boundary_id | reference<unresolved_boundary> or null | 0..1 | nullable | NON_NULL_RESOLVES_EXACTLY_ONCE_TO_unresolved_boundary.unresolved_id |
| evidence_pointer | 1 | evidence_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| evidence_pointer | 2 | source_class | enum<IMMUTABLE,MIRROR_ONLY> | 1 | required | Exact closed enum |
| evidence_pointer | 3 | reference | external pointer | 1 | required | SHA_PINNED_OR_MUTABLE_MIRROR_BOUNDARY |
| evidence_pointer | 4 | claim_ceiling | string | 1 | required | NOT_A_REFERENCE |
| evidence_pointer | 5 | authority_effect | literal<NONE> | 1 | required | NOT_A_REFERENCE |
| inference_prohibition | 1 | prohibition_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| inference_prohibition | 2 | source_basis | reference<credit_dimension_definition> or literal<MIRROR_ONLY> | 1 | required | Dimension reference resolves exactly once; MIRROR_ONLY is the sole literal |
| inference_prohibition | 3 | prohibited_dimension_id | reference<credit_dimension_definition> | 1 | required | Resolves exactly once |
| inference_prohibition | 4 | reason | string | 1 | required | NOT_A_REFERENCE |
| inference_prohibition | 5 | evidence_ids | ordered array<reference<evidence_pointer>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_evidence_pointer.evidence_id |
| unresolved_boundary | 1 | unresolved_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| unresolved_boundary | 2 | subject | string | 1 | required | NOT_A_REFERENCE |
| unresolved_boundary | 3 | missing_evidence | string | 1 | required | NOT_A_REFERENCE |
| unresolved_boundary | 4 | resulting_state | enum<UNAVAILABLE,NOT_ESTABLISHED,CONTRADICTORY> | 1 | required | NOT_A_REFERENCE |
| unresolved_boundary | 5 | evidence_ids | ordered array<reference<evidence_pointer>> | 1..* | required | RESOLVES_EXACTLY_ONCE_TO_evidence_pointer.evidence_id |
| reservation | 1 | reservation_id | identifier | 1 | required | PRIMARY_IDENTIFIER |
| reservation | 2 | lane | string | 1 | required | NOT_A_REFERENCE |
| reservation | 3 | reserved_subject | string | 1 | required | NOT_A_REFERENCE |
| reservation | 4 | execution_authority | literal<NOT_GRANTED> | 1 | required | NOT_A_REFERENCE |

## Closed Dimensions and States
Dimensions: DOCUMENTATION, STATIC_CONFIGURATION, BUILD_ONLY, TESTED_LOCAL,
STATIC_UI, MOCK_OR_SHADOW, RUNNING_OBSERVED, INDEPENDENTLY_VERIFIED,
CONTROL_THREAD_ACCEPTED, REPOSITORY_INTEGRATED, DEPLOYED, FOUNDER_USED,
REPEATED_FOUNDER_USE, CUSTOMER_USED, PROVIDER_EFFECT_OBSERVED,
AGENT_COUNCIL_ACTIVATED, BATCH_EXIT, PROGRAM_EXIT, JAI_ACTIVATED.

States: ESTABLISHED, NOT_ESTABLISHED, UNAVAILABLE, CONTRADICTORY, REVOKED,
EXPIRED, SUPERSEDED. Dimensions are independent, not a maturity ladder.

## Dimension Definitions
| dimension_id | dimension | definition | minimum_evidence | authority_requirement | b1_axis_effect | non_transitive_from | evidence_ids |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B11-DIM-001 | DOCUMENTATION | Durable documentary material exists for the bounded subject. | Exact source-grounded documentary evidence. | NONE | NONE | [] | [B11-E-001] |
| B11-DIM-002 | STATIC_CONFIGURATION | Source-grounded static configuration or repository evidence exists without runtime proof. | Exact immutable repository evidence. | NONE | NONE | [B11-DIM-001] | [B11-E-001, B11-E-002] |
| B11-DIM-003 | BUILD_ONLY | A bounded build completed without establishing runtime, acceptance, or deployment credit. | Exact build command and result evidence. | NONE | NONE | [B11-DIM-001, B11-DIM-002] | [B11-E-001] |
| B11-DIM-004 | TESTED_LOCAL | Local tests directly exercised the bounded subject. | Exact test command, subject, and result evidence. | NONE | NONE | [B11-DIM-001, B11-DIM-002, B11-DIM-003] | [B11-E-001, B11-E-002] |
| B11-DIM-005 | STATIC_UI | Source inspection establishes bounded UI wiring without authenticated runtime observation. | Exact source-path and static-wiring evidence. | NONE | NONE | [B11-DIM-001, B11-DIM-002] | [B11-E-001] |
| B11-DIM-006 | MOCK_OR_SHADOW | A mock, fixture, simulation, or local-shadow surface exercised a bounded behavior. | Exact mock or shadow boundary and result evidence. | NONE | NONE | [B11-DIM-001, B11-DIM-002, B11-DIM-005] | [B11-E-001] |
| B11-DIM-007 | RUNNING_OBSERVED | A running surface was directly observed at a bounded observation time. | Direct observation with deployment identity or an explicit unavailable identity boundary. | NONE | NONE | [B11-DIM-002, B11-DIM-004, B11-DIM-006] | [B11-E-001] |
| B11-DIM-008 | INDEPENDENTLY_VERIFIED | A verifier independently reproduced the bounded evidence and result. | Exact verifier identity, method, subject, and result evidence. | Independent verification route. | NONE | [B11-DIM-004] | [B11-E-001] |
| B11-DIM-009 | CONTROL_THREAD_ACCEPTED | CONTROL_THREAD issued an exact accepted disposition for the bounded subject. | Exact accepted disposition and subject binding. | Exact CONTROL_THREAD acceptance authority. | NONE | [B11-DIM-008] | [B11-E-003] |
| B11-DIM-010 | REPOSITORY_INTEGRATED | Exact evidence is present on the accepted repository main state. | Immutable repository integration evidence at an exact SHA. | NONE | NONE | [B11-DIM-009] | [B11-E-002, B11-E-003] |
| B11-DIM-011 | DEPLOYED | Exact deployment evidence binds a deployed surface to an immutable source revision. | Deployment receipt or equivalent immutable source-to-surface binding. | Exact deployment authority. | NONE | [B11-DIM-010] | [B11-E-001] |
| B11-DIM-012 | FOUNDER_USED | The founder directly used the bounded deployed capability. | Founder observation bound to a deployed subject and observation time. | Founder observation authority only. | NONE | [B11-DIM-011] | [B11-E-001] |
| B11-DIM-013 | REPEATED_FOUNDER_USE | Founder use was directly observed more than once across distinct bounded observations. | Multiple independently bounded founder-use observations. | Founder observation authority only. | NONE | [B11-DIM-012] | [B11-E-001] |
| B11-DIM-014 | CUSTOMER_USED | A customer directly used the bounded deployed capability. | Explicit customer-use evidence with approved sensitive-data boundary. | Separate customer-effect authority. | NONE | [B11-DIM-011, B11-DIM-012] | [B11-E-001] |
| B11-DIM-015 | PROVIDER_EFFECT_OBSERVED | A provider or model effect was directly observed and bounded to the subject. | Exact provider-effect evidence without inferred authority. | Separate provider or model dispatch authority. | NONE | [B11-DIM-002, B11-DIM-007] | [B11-E-001] |
| B11-DIM-016 | AGENT_COUNCIL_ACTIVATED | Exact accepted evidence establishes bounded Agent or Council activation. | Activation receipt and exact activated subject. | Separate Agent or Council activation authority. | NONE | [B11-DIM-001, B11-DIM-002] | [B11-E-001] |
| B11-DIM-017 | BATCH_EXIT | Exact accepted Batch-exit evidence exists. | Exact Batch-exit disposition and receipt evidence. | Separate Batch-exit authority. | NONE | [B11-DIM-004, B11-DIM-008, B11-DIM-009, B11-DIM-010] | [B11-E-001, B11-E-003] |
| B11-DIM-018 | PROGRAM_EXIT | Exact accepted Program-exit evidence exists. | Exact Program-exit disposition and receipt evidence. | Separate Program-exit authority. | NONE | [B11-DIM-017] | [B11-E-001, B11-E-003] |
| B11-DIM-019 | JAI_ACTIVATED | Exact accepted JAI-activation evidence exists. | Exact JAI-activation disposition and receipt evidence. | Separate JAI-activation authority. | NONE | [B11-DIM-018] | [B11-E-001, B11-E-003] |

## Current Documentary Fixture
| entry_id | subject | dimension_id | credit_state | scope | evidence_ids | authority_effect | acceptance_state | integration_state | invalidation_state | unresolved_boundary_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B11-ENTRY-001 | Q3M7Y26-P1:D1 | B11-DIM-002 | ESTABLISHED | CI prerequisite/static repository source only | [B11-E-002] | NONE | UNAVAILABLE | ESTABLISHED | ACTIVE | B11-U-001 |
| B11-ENTRY-002 | Q3M7Y26-P1:D2 | B11-DIM-004 | ESTABLISHED | TESTED_LOCAL_SHADOW_PROVING_SEAM_ONLY | [B11-E-002] | NONE | UNAVAILABLE | ESTABLISHED | ACTIVE | B11-U-002 |
| B11-ENTRY-003 | Batch D | B11-DIM-017 | NOT_ESTABLISHED | Batch D closure | [B11-E-002] | NONE | NOT_ESTABLISHED | NOT_ESTABLISHED | ACTIVE | B11-U-003 |
| B11-ENTRY-004 | Q3M7Y26-P1 | B11-DIM-018 | NOT_ESTABLISHED | Program exit | [B11-E-003] | NONE | NOT_ESTABLISHED | NOT_ESTABLISHED | ACTIVE | B11-U-004 |
| B11-ENTRY-005 | JAI | B11-DIM-019 | NOT_ESTABLISHED | JAI activation | [B11-E-001] | NONE | NOT_ESTABLISHED | NOT_ESTABLISHED | ACTIVE | B11-U-005 |

## Unresolved Boundaries
| unresolved_id | subject | missing_evidence | resulting_state | evidence_ids |
| --- | --- | --- | --- | --- |
| B11-U-001 | D1 | Exact acceptance receipt/token | UNAVAILABLE | [B11-E-002] |
| B11-U-002 | D2 | Exact acceptance receipt/token | UNAVAILABLE | [B11-E-002] |
| B11-U-003 | Batch D | Accepted Batch closure receipt | NOT_ESTABLISHED | [B11-E-002] |
| B11-U-004 | Program | Accepted Program closure receipt | NOT_ESTABLISHED | [B11-E-003] |
| B11-U-005 | JAI | Direct activation evidence and authority | NOT_ESTABLISHED | [B11-E-001] |

## Inference Prohibitions
| prohibition_id | source_basis | prohibited_dimension_id | reason | evidence_ids |
| --- | --- | --- | --- | --- |
| B11-P-001 | B11-DIM-001 | B11-DIM-004 | Documentation is not testing. | [B11-E-001] |
| B11-P-002 | B11-DIM-004 | B11-DIM-009 | Testing is not acceptance. | [B11-E-001] |
| B11-P-003 | B11-DIM-009 | B11-DIM-010 | Acceptance is not repository integration. | [B11-E-001] |
| B11-P-004 | B11-DIM-010 | B11-DIM-011 | Repository integration is not deployment. | [B11-E-001] |
| B11-P-005 | B11-DIM-011 | B11-DIM-012 | Deployment is not founder use. | [B11-E-001] |
| B11-P-006 | B11-DIM-012 | B11-DIM-013 | One founder use is not repeated founder use. | [B11-E-001] |
| B11-P-007 | B11-DIM-011 | B11-DIM-014 | Deployment is not customer use. | [B11-E-001] |
| B11-P-008 | B11-DIM-002 | B11-DIM-015 | Static configuration is not an observed provider effect. | [B11-E-001] |
| B11-P-009 | B11-DIM-001 | B11-DIM-016 | Agent or Council documentation is not activation. | [B11-E-001] |
| B11-P-010 | B11-DIM-002 | B11-DIM-017 | Static configuration or Lane completion is not Batch exit. | [B11-E-001] |
| B11-P-011 | B11-DIM-017 | B11-DIM-018 | Batch completion is not Program exit. | [B11-E-001] |
| B11-P-012 | B11-DIM-018 | B11-DIM-019 | Program exit is not JAI activation. | [B11-E-001] |
| B11-P-013 | MIRROR_ONLY | B11-DIM-009 | Linear mirror text grants no credit or acceptance. | [B11-E-004] |

## Evidence Pointer Registry
| evidence_id | source_class | reference | claim_ceiling | authority_effect |
| --- | --- | --- | --- | --- |
| B11-E-001 | IMMUTABLE | [B1](https://github.com/jai-nexus/dev-jai-nexus/blob/c5870f1755dad88082a2be1f0d27fceef2f57dca/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md) | Lifecycle separation and non-transitivity | NONE |
| B11-E-002 | IMMUTABLE | [A4](https://github.com/jai-nexus/dev-jai-nexus/blob/c5870f1755dad88082a2be1f0d27fceef2f57dca/docs/reference/q3m7y26-p1-a4-ratified-motion-decision-registry-v0.md) | D1/D2 bounded credits, squashes, unavailable acceptance, no Batch D exit | NONE |
| B11-E-003 | IMMUTABLE | [B10](https://github.com/jai-nexus/dev-jai-nexus/blob/c5870f1755dad88082a2be1f0d27fceef2f57dca/docs/reference/q3m7y26-p1-b10-acceptance-receipt-integrity-schema-v0.md) | Acceptance/receipt boundaries; no issued receipt | NONE |
| B11-E-004 | MIRROR_ONLY | https://linear.app/jai-nexus/issue/JAI-208/q3m7y26-p1b11-capability-and-credit-ledger | CONTROL_THREAD_READ_CONFIRMED_BACKLOG_2026-07-27 / CODEX_FILE_EXECUTION_NOT_REFRESHED / NON_CONTROLLING | NONE |

## Implementation Reconciliation
Repository source and tests establish only their exact STATIC_CONFIGURATION or
TESTED_LOCAL ceiling. They prove no runtime, deployment, provider/customer
effect, cryptographic authenticity, or repository-wide absence.

## Deterministic Serialization
Record types use declared order; fields use ordinal order; rows sort by ID;
arrays and evidence IDs use declared ascending order; null is literal null.
Unknown keys, duplicates, unresolved references, and undeclared enums fail
closed.

## Reservations
| reservation_id | lane | reserved_subject | execution_authority |
| --- | --- | --- | --- |
| B11-R-001 | B12 | Exception and Out-of-Sequence Work Canon | NOT_GRANTED |
| B11-R-002 | B13 | Rollback, Reopen, and Supersession Canon | NOT_GRANTED |
| B11-R-003 | B14 | GitHub-Linear Mirror Protocol | NOT_GRANTED |
| B11-R-004 | B15 | Lifecycle Canon Verification and Batch B Closeout | NOT_GRANTED |

## Final Audit and Non-Authorizations
| check | result |
| --- | --- |
| Record types | PASS — 6 |
| Field Registry rows | PASS — 38 |
| Dimension definitions | PASS — 19 complete eight-field rows |
| Fixture entries | PASS — 5 |
| Inference prohibitions | PASS — 13 |
| Unresolved boundaries | PASS — 5 |
| Reservations | PASS — 4 |
| Unique primary identifiers | PASS |
| Dimension-reference resolution | PASS — zero undefined references |
| Unresolved-boundary joins | PASS — zero undefined joins |
| Evidence IDs defined and used | PASS — every defined ID is used and every use resolves |
| Evidence records | PASS — 4 |
| Immutable paths resolved | PASS — 3/3 at the required base |
| Fixture/schema coherence | PASS |
| Enum conformance | PASS |
| D1/D2 bounded credit | PASS — STATIC_CONFIGURATION and TESTED_LOCAL only; acceptance UNAVAILABLE |
| Batch D exit | NOT_ESTABLISHED |
| Program exit | NOT_ESTABLISHED |
| JAI activation | NOT_ESTABLISHED |
| Positive authority grants | PASS — 0 |
| Sensitive-value findings | PASS — 0 |
| B12-B15 absorption | PASS — 0; four reservations preserved |
| Whitespace validation | PASS — git diff --check exit 0; no-index raw exit 1 with zero diagnostics |

No acceptance, execution, deployment, provider/customer effect, Agent/Council
activation, Batch exit, Program exit, or JAI activation authority is granted.

B11_MAXIMUM_CURRENT_CREDIT:
DOCUMENTATION_CAPABILITY_AND_CREDIT_LEDGER_ONLY

B11_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B11_MERGE_AUTHORITY: NOT_GRANTED
B12_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B11_CAPABILITY_CREDIT_LEDGER
