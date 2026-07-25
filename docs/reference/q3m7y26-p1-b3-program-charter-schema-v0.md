# Q3M7Y26-P1 B3 Program Charter Schema v0

## Status

| Field | Value |
| --- | --- |
| Record ID | B3-PROGRAM-CHARTER-SCHEMA-v0 |
| Coordinate | Q3M7Y26-P1:B3 |
| Batch / Wave / Lane | B / B-A / B3 - Program Charter Schema |
| Route | CT-2026-07-24-Q3M7Y26-P1-START-B3-PROGRAM-CHARTER-SCHEMA-v0 |
| Work Packet | Q3M7Y26-P1-B3-v0 |
| Repository basis | jai-nexus/dev-jai-nexus@c0e1dbc6c43fd12ac71d736679766932a598cd2b |
| Status | DOCUMENTARY_SCHEMA_PROPOSED / PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION |
| Evidence ceiling | PROGRAM_CHARTER_SCHEMA_DOCUMENTATION_ONLY |

This document defines the minimum durable documentary contract for opening and governing a Program. It creates neither a Program nor a route, execution, acceptance, integration, capability, runtime, or activation grant. A valid charter is a fail-closed structured record, not evidence that any gate was evaluated or any action may proceed.

## Source precedence

[A2] governs source ranking and conflict treatment. This artifact uses repository evidence pinned to [BASE]. The ratified motion and opening receipt provide the Program 1 fixture facts. A mirror, title, chronology, or adjacent lane cannot supply a missing value or authority.

| Rank | Source class | Allowed B3 use | Authority effect |
| --- | --- | --- | --- |
| 1 | Fresh human route or accepted Control decision | Record a separately accepted decision | B3 grants none |
| 2 | Accepted repository receipt or decision | Record bounded source facts | Receipt scope remains controlling |
| 3 | Current repository source at [BASE] | Record identity, lifecycle, and schema evidence | B3 grants none |
| 4 | Mutable corroborating link | Corroborate only when explicitly labeled | Never controlling |
| 5 | Inference, stale mirror, or unavailable source | Mark UNRESOLVED, DEFERRED, or exclude | Never controlling |

Immutable repository references and their SHA-pinned definitions are listed in [Reference definitions](#reference-definitions). Mutable corroborating references used: 0.

## Charter schema

A charter is valid only when every required field is present once, typed, deterministically ordered, and source-classified. Explicit unresolved form is allowed for documentary completeness, but never satisfies a gate.

The canonical top-level key order is: `schema_version`, `program_identity`,
`goal`, `founder_outcome`, `included_scope`, `excluded_scope`, `dependencies`,
`entry_prerequisites_and_gates`, `measurable_success_conditions`,
`freeze_conditions`, `authority_envelope`, `evidence_pointers`. A charter has
exactly one value for each key and no unknown top-level key.

| Field ID | Required field | Canonical type | Cardinality and order |
| --- | --- | --- | --- |
| B3-F-01 | schema_version | exact string | Exactly 1; exact literal B3-PROGRAM-CHARTER-SCHEMA-v0. |
| B3-F-02 | program_identity | program_identity record | Exactly 1; nested key order below. |
| B3-F-03 | goal | non-empty string | Exactly 1; source-grounded statement. |
| B3-F-04 | founder_outcome | resolved_founder_outcome record or unresolved object | Exactly 1; nested key order below. |
| B3-F-05 | included_scope | array of scope records | One or more; ascending stable scope_id. |
| B3-F-06 | excluded_scope | array of scope records | One or more; ascending stable scope_id. |
| B3-F-07 | dependencies | array of dependency records | One or more; ascending stable dependency_id. |
| B3-F-08 | entry_prerequisites_and_gates | array of gate records | One or more; ascending stable gate_id. |
| B3-F-09 | measurable_success_conditions | array of resolved success-condition records or unresolved object | Exactly 1; arrays ascend by stable success_condition_id. |
| B3-F-10 | freeze_conditions | array of freeze-condition records | One or more; ascending stable freeze_condition_id. |
| B3-F-11 | authority_envelope | authority_envelope record | Exactly 1; nested key order below. |
| B3-F-12 | evidence_pointers | array of evidence-pointer records | One or more; ascending stable evidence_id. |

### Canonical nested record shapes

Every listed key is required exactly once and appears in the stated order.
Unknown or duplicate nested keys are invalid. All arrays use their stable
record IDs as their deterministic sort key.

| Record type | Canonical key order | Type and cardinality |
| --- | --- | --- |
| program_identity | program_id, program_code, program_title | Object, exactly 1; all non-empty strings; ID/code must resolve under B2. |
| resolved_founder_outcome | outcome_id, statement, measure, evidence_pointer | Object, exactly 1; non-empty strings; evidence_pointer names one defined pointer. |
| scope_record | scope_id, statement, evidence_pointer | Object; array member; non-empty strings and one defined pointer. |
| dependency_record | dependency_id, statement, status, evidence_pointer, freshness | Object; array member; non-empty strings; status and freshness are explicit classifications. |
| gate_record | gate_id, statement, observed_value, status, freshness, evidence_pointer | Object; array member; non-empty strings; status is an observed gate classification, not a B3 evaluation. |
| resolved_success_condition | success_condition_id, statement, measure, evidence_pointer | Object; array member; non-empty strings and one defined pointer. |
| freeze_condition | freeze_condition_id, condition, effect, evidence_pointer | Object; array member; non-empty strings and one defined pointer. |
| authority_envelope | program_state, batch_planning_authority, batch_execution_authority, execution_gates_granted, other_authority, evidence_pointer | Object, exactly 1; first five fields are strings and evidence_pointer names one defined pointer. |
| evidence_pointer | evidence_id, source_class, immutability, reference, claim | Object; array member; non-empty strings; immutability is IMMUTABLE or MUTABLE_CORROBORATING. |
| unresolved object | status, reason, source_boundary, next_control_decision | Object, exactly 1; status is exact UNRESOLVED and remaining fields are non-empty strings. |

## Identity and lifecycle separation

Under [B2], program_id and program_code must resolve to exactly one accepted Program definition before this charter or a full coordinate is valid. Missing, mismatched, duplicated, or conflicting binding is invalid. Title is descriptive only.

Program identity is separate from every [B1] lifecycle axis: planning, routing, delivery, verification, acceptance, repository integration, control disposition, program operation, runtime activation, and mirror posture. A charter may cite evidence from an axis but cannot collapse axes, derive a state, or treat a state as authority.

## Validation rules

Validation is ordered. The first failure returns CHARTER_INVALID; there is no partial validity, inferred default, or permissive continuation.

| Rule ID | Validation | Fail-closed result |
| --- | --- | --- |
| B3-V-01 | All twelve required fields occur exactly once. | Missing, duplicate, or unknown field is invalid. |
| B3-V-02 | Schema version is the exact B3 literal. | Unknown or changed schema version is invalid. |
| B3-V-03 | ID/code resolves to one accepted Program definition. | Missing, mismatch, ambiguity, or conflict is invalid. |
| B3-V-04 | Every source-grounded claim has a defined pointer. | Undefined, mutable-as-immutable, or unpinned repository reference is invalid. |
| B3-V-05 | Lists are deterministically ordered and semantically deduplicated. | Ambiguous order or duplicate meaning is invalid. |
| B3-V-06 | Each unresolved field uses the complete explicit form. | Bare TBD, blank, guess, or unspecified gap is invalid. |
| B3-V-07 | Scope and authority agree with exclusions, freezes, and evidence. | Contradictory, ambiguous, or authority-bearing input is invalid. |
| B3-V-08 | Gates and success conditions are explicitly classified. | Documentary text treated as a satisfied gate is invalid. |
| B3-V-09 | Charter validity is separate from all B1 axes and credit. | Any route, execution, acceptance, integration, runtime, or activation claim is invalid. |

CHARTER_VALID_DOCUMENTARY_ONLY means schema conformance only. It does not mean planned, routed, delivered, verified, accepted, integrated, capability-credited, or activated; each needs its own accepted evidence.

## Program 1 fixture

The following complete structured documentary fixture has all twelve top-level
fields in canonical order. It uses only source-grounded facts; the two
unresolved objects are not inferred values.

```yaml
schema_version: B3-PROGRAM-CHARTER-SCHEMA-v0
program_identity:
  program_id: jai-governance-intelligence-main-state-operating-loop-v0
  program_code: Q3M7Y26-P1
  program_title: Q3M7Y26 JAI Governance Intelligence — Main-State Reconciliation and Minimum Viable Operating Loop v0
goal: Main-State Reconciliation and Minimum Viable Operating Loop v0
founder_outcome:
  status: UNRESOLVED
  reason: No accepted source in the B3 source set defines a Program-level measurable founder outcome.
  source_boundary: MOTION-DECISION, OPENING-RECEIPT, and A5
  next_control_decision: Bounded Program 1 charter-content decision.
included_scope:
  - scope_id: P1-SCOPE-001
    statement: Program 1 Batch planning for candidate Batches A through F.
    evidence_pointer: OPENING-RECEIPT
excluded_scope:
  - scope_id: P1-EXCLUSION-001
    statement: Batch and Lane execution; Program 2-4 opening; provider, model, API, runtime, deployment, customer, Agent, Council, Linear, and activation actions.
    evidence_pointer: MOTION-DECISION
dependencies:
  - dependency_id: P1-DEP-001
    statement: Ratified motion-0248.
    status: ACCEPTED
    evidence_pointer: MOTION-DECISION
    freshness: HISTORICAL_AT_ISSUANCE
  - dependency_id: P1-DEP-002
    statement: Fresh MAIN_STATE_RECEIPT for a future Program opening use.
    status: REQUIRED_FOR_FUTURE_USE
    evidence_pointer: MOTION-DECISION
    freshness: NOT_REVALIDATED_BY_B3
  - dependency_id: P1-DEP-003
    statement: Named Control opening receipt for a future Program opening use.
    status: REQUIRED_FOR_FUTURE_USE
    evidence_pointer: MOTION-DECISION
    freshness: NOT_REVALIDATED_BY_B3
  - dependency_id: P1-DEP-004
    statement: Separate accepted execution route for each Batch or Lane execution.
    status: REQUIRED_FOR_FUTURE_USE
    evidence_pointer: OPENING-RECEIPT
    freshness: NOT_REVALIDATED_BY_B3
entry_prerequisites_and_gates:
  - gate_id: P1-GATE-001
    statement: general_prerequisites_at_issuance
    observed_value: "15/15"
    status: SATISFIED
    freshness: HISTORICAL_AT_ISSUANCE / NOT_REVALIDATED_BY_B3
    evidence_pointer: OPENING-RECEIPT
  - gate_id: P1-GATE-002
    statement: program_specific_prerequisites_at_issuance
    observed_value: "15/15"
    status: SATISFIED
    freshness: HISTORICAL_AT_ISSUANCE / NOT_REVALIDATED_BY_B3
    evidence_pointer: OPENING-RECEIPT
  - gate_id: P1-GATE-003
    statement: active_program_count_before
    observed_value: "0"
    status: OBSERVED
    freshness: HISTORICAL_AT_ISSUANCE / NOT_REVALIDATED_BY_B3
    evidence_pointer: OPENING-RECEIPT
  - gate_id: P1-GATE-004
    statement: active_program_count_after
    observed_value: "1"
    status: OBSERVED
    freshness: HISTORICAL_AT_ISSUANCE / NOT_REVALIDATED_BY_B3
    evidence_pointer: OPENING-RECEIPT
measurable_success_conditions:
  status: UNRESOLVED
  reason: No accepted source in the B3 source set provides Program-level measurable success conditions.
  source_boundary: OPENING-RECEIPT and A5
  next_control_decision: Bounded Program 1 success-condition decision.
freeze_conditions:
  - freeze_condition_id: P1-FREEZE-001
    condition: Closed, no-go, cancelled, failed, or unresolved-held Program or prerequisite.
    effect: Downstream Programs remain frozen pending separately accepted resolution and opening prerequisites.
    evidence_pointer: MOTION-DECISION
authority_envelope:
  program_state: OPEN_FOR_BATCH_PLANNING_ONLY
  batch_planning_authority: GRANTED
  batch_execution_authority: NOT_GRANTED
  execution_gates_granted: 0
  other_authority: NOT_GRANTED
  evidence_pointer: OPENING-RECEIPT
evidence_pointers:
  - evidence_id: P1-EVIDENCE-001
    source_class: Repository basis
    immutability: IMMUTABLE
    reference: BASE
    claim: B3 repository basis.
  - evidence_id: P1-EVIDENCE-002
    source_class: Accepted repository motion
    immutability: IMMUTABLE
    reference: MOTION-DECISION
    claim: Program sequence, prerequisites, freezes, and non-authorizations.
  - evidence_id: P1-EVIDENCE-003
    source_class: Accepted repository receipt
    immutability: IMMUTABLE
    reference: OPENING-RECEIPT
    claim: Program 1 identity, issuance facts, state, and bounded planning authority.
  - evidence_id: P1-EVIDENCE-004
    source_class: Accepted repository reference
    immutability: IMMUTABLE
    reference: A2
    claim: Source precedence and contradiction treatment.
  - evidence_id: P1-EVIDENCE-005
    source_class: Accepted repository reference
    immutability: IMMUTABLE
    reference: A5
    claim: Sole active Program and downstream freeze posture.
  - evidence_id: P1-EVIDENCE-006
    source_class: Accepted repository reference
    immutability: IMMUTABLE
    reference: A6
    claim: Published B3 coordinate and lane title.
  - evidence_id: P1-EVIDENCE-007
    source_class: Accepted repository reference
    immutability: IMMUTABLE
    reference: A8
    claim: Role-route separation and non-authorizations.
  - evidence_id: P1-EVIDENCE-008
    source_class: Accepted repository reference
    immutability: IMMUTABLE
    reference: B1
    claim: Orthogonal lifecycle axes and downstream freeze behavior.
  - evidence_id: P1-EVIDENCE-009
    source_class: Accepted repository reference
    immutability: IMMUTABLE
    reference: B2
    claim: Exact Program identity binding and coordinate limits.
```

Fixture result: CHARTER_VALID_DOCUMENTARY_ONLY / OPENING_GATE_NOT_EVALUATED / EXECUTION_AUTHORITY_NOT_GRANTED.

### Prospective boundary

B3 applies prospectively to future charter use. It does not retroactively
invalidate, reopen, condition, or replace the accepted Program 1 opening
receipt. The unresolved fixture fields block only future uses that require B3
conformance; they do not alter the already accepted receipt or its stated
historical issuance facts.

## Bounded invalid examples

| Example ID | Invalid input | Required result |
| --- | --- | --- |
| B3-INV-01 | Program 1 ID with absent or different Program code. | CHARTER_INVALID; identity binding fails before coordinate or authority evaluation. |
| B3-INV-02 | founder_outcome: TBD without source boundary and next decision. | CHARTER_INVALID; bare placeholder is not unresolved form. |
| B3-INV-03 | Scope says execute Batch B while envelope says zero execution gates. | CHARTER_INVALID; contradictory authority-bearing scope. |
| B3-INV-04 | Mutable PR cited as immutable source or pointer lacks observation boundary. | CHARTER_INVALID; contradictory provenance. |
| B3-INV-05 | OPEN_FOR_BATCH_PLANNING_ONLY treated as delivery, acceptance, or activation. | CHARTER_INVALID; lifecycle collapse and unauthorized credit. |
| B3-INV-06 | Program 2 marked active while Program 1 is sole active Program. | CHARTER_INVALID; one-active-Program invariant violated. |

## B1/B2 alignment and downstream freeze

| Alignment ID | Requirement |
| --- | --- |
| B3-A-01 | B1 axes remain orthogonal; charter validity manufactures no lifecycle state. |
| B3-A-02 | Program 1 observed program-operation state is OPEN_FOR_BATCH_PLANNING_ONLY, not Batch execution authority. |
| B3-A-03 | B2 identity binding is validated before the charter is valid; title cannot substitute. |
| B3-A-04 | B2 full-coordinate rules remain intact; B3 neither defines parent relations nor replaces B4. |
| B3-A-05 | Accepted invariant is active_program_count <= 1; charter content cannot open Program 2-4. |
| B3-A-06 | Closed, no-go, cancelled, failed, or unresolved-held conditions preserve downstream freeze until separately resolved. |

## Unresolved evidence and contradictions

| Item ID | Unresolved item | Treatment | Smallest later decision |
| --- | --- | --- | --- |
| B3-U-01 | Program 1 measurable founder outcome | UNRESOLVED; no value inferred. | Bounded charter-content decision. |
| B3-U-02 | Program 1 measurable success conditions | UNRESOLVED; no threshold fabricated. | Bounded success-condition decision. |
| B3-U-03 | Freshness of future opening prerequisites | NOT_REVALIDATED_BY_B3; receipt is historical issuance evidence. | Separately authorized current-main opening review. |
| B3-U-04 | Parent relationships and decomposition | DEFERRED; no parent field introduced. | B4 only. |

No contradiction is resolved by selecting a controlling source outside the precedence model. Any future conflict must be normalized by scope and time.

## Reserved boundaries

| Reserved ID | Subject | B3 boundary |
| --- | --- | --- |
| B3-R-01 | B4 decomposition and parent relationships | No hierarchy or parent field. |
| B3-R-02 | B5 roles and authority matrix | No role assignment or authority transfer. |
| B3-R-03 | B6 Work Packet canon | No Work Packet creation, validation, or authority. |
| B3-R-04 | B7 decision-token canon | No token semantics. |
| B3-R-05 | B8 evidence-bundle schema | No evidence bundle assembled or accepted. |
| B3-R-06 | B9 Receipt Taxonomy | No receipt taxonomy is defined or changed. |
| B3-R-07 | B10 Acceptance Receipt and Integrity Schema | No acceptance receipt or integrity schema is defined, replaced, or issued. |
| B3-R-08 | B11 capability and credit ledger | No capability or credit claimed. |
| B3-R-09 | B12 exceptions | No exception created or interpreted. |
| B3-R-10 | B13 rollback, reopen, supersession | No rollback, reopen, or supersession rule. |
| B3-R-11 | B14 GitHub-Linear mirror protocol | No mirror action or authority. |
| B3-R-12 | B15 independent verification and Batch closeout | No verification, acceptance, or closeout. |

## Risks, rollback, and recommendation

The material risk is interpreting a documentary charter or unresolved field as an operating grant. These validation rules fail closed against that reading. A later accepted repository repair may supersede this document through normal review; this artifact itself neither reopens, supersedes, rolls back, nor changes Program state.

Recommendation: submit this schema for independent Control review as a documentation-only contract. Before using a charter as opening input, separately define and evidence Program 1 founder outcome and measurable success conditions, then evaluate fresh opening prerequisites.

## Explicit non-authorizations

This artifact grants no positive route, planning beyond the already recorded receipt, execution, delivery, verification, acceptance, repository integration, capability credit, runtime, deployment, provider, model, API, database, customer, Agent, Council, GitHub, Linear, merge, or JAI activation authority. It does not open a Program, Batch, Wave, or Lane; create a Work Packet or receipt; alter lifecycle state; select an owner; or resolve an unknown without separately accepted evidence.

## Reference definitions

All repository references are immutable and SHA-pinned to [BASE]. They are definitions, not proof that a mutable external system agrees with them.

| Reference | Source class | Immutable definition | Claim supported |
| --- | --- | --- | --- |
| [BASE] | Repository basis | [commit c0e1dbc](https://github.com/jai-nexus/dev-jai-nexus/tree/c0e1dbc6c43fd12ac71d736679766932a598cd2b) | Observation cutoff. |
| [MOTION-DECISION] | Accepted repository motion | [motion-0248 decision](https://github.com/jai-nexus/dev-jai-nexus/blob/c0e1dbc6c43fd12ac71d736679766932a598cd2b/.nexus/motions/motion-0248/decision.yaml) | Sequence, prerequisites, freezes, and non-authorizations. |
| [OPENING-RECEIPT] | Accepted repository receipt | [program-opening-receipt-v0.md](https://github.com/jai-nexus/dev-jai-nexus/blob/c0e1dbc6c43fd12ac71d736679766932a598cd2b/docs/reference/q3m7y26-jai-governance-intelligence-main-state-operating-loop-program-opening-receipt-v0.md) | Program 1 identity, observed state, and bounded planning authority. |
| [A2] | Accepted repository reference | [a2-authority-evidence-precedence-contradiction-ledger-v0.md](https://github.com/jai-nexus/dev-jai-nexus/blob/c0e1dbc6c43fd12ac71d736679766932a598cd2b/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md) | Precedence and conflict rules. |
| [A5] | Accepted repository reference | [a5-active-frozen-program-registry-v0.md](https://github.com/jai-nexus/dev-jai-nexus/blob/c0e1dbc6c43fd12ac71d736679766932a598cd2b/docs/reference/q3m7y26-p1-a5-active-frozen-program-registry-v0.md) | Sole active Program and freezes. |
| [A6] | Accepted repository reference | [a6-control-coordinate-registry-v0.md](https://github.com/jai-nexus/dev-jai-nexus/blob/c0e1dbc6c43fd12ac71d736679766932a598cd2b/docs/reference/q3m7y26-p1-a6-control-coordinate-registry-v0.md) | B3 coordinate and title. |
| [A8] | Accepted repository reference | [a8-governance-role-route-reconciliation-v0.md](https://github.com/jai-nexus/dev-jai-nexus/blob/c0e1dbc6c43fd12ac71d736679766932a598cd2b/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md) | Role-route separation. |
| [B1] | Accepted repository reference | [b1-lifecycle-vocabulary-state-machine-v0.md](https://github.com/jai-nexus/dev-jai-nexus/blob/c0e1dbc6c43fd12ac71d736679766932a598cd2b/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md) | Orthogonal axes and freezes. |
| [B2] | Accepted repository reference | [b2-control-coordinates-canon-v0.md](https://github.com/jai-nexus/dev-jai-nexus/blob/c0e1dbc6c43fd12ac71d736679766932a598cd2b/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md) | Identity binding and coordinate limits. |

B3_MAXIMUM_CURRENT_CREDIT: PROGRAM_CHARTER_SCHEMA_DOCUMENTATION_ONLY
B3_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B3_FURTHER_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B3_PROGRAM_CHARTER_SCHEMA
