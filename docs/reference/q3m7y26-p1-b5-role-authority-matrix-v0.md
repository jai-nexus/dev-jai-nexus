# Q3M7Y26-P1 B5 Role and Authority Matrix v0

## Status

| Field | Value |
| --- | --- |
| Coordinate | Q3M7Y26-P1:B5 |
| Route | CT-2026-07-26-Q3M7Y26-P1-START-B5-ROLE-AUTHORITY-MATRIX-v0 |
| Packet | Q3M7Y26-P1-B5-v0 |
| Base | 1cdc1327ee2e08289a7fedee4ad909381ce3cbef |
| Role | JAI::DEV::BUILDER |
| B4 acceptance | CT-2026-07-26-Q3M7Y26-P1-B4-ACCEPT-v0 |
| Status | DOCUMENTARY_CANON_PROPOSED |
| Evidence ceiling | ROLE_AUTHORITY_MATRIX_DOCUMENTATION_ONLY |

This canon grants no authority by its existence. [A2] precedence governs: HUMAN_OPERATOR is constitutional authority origin; CONTROL_THREAD acts only inside fresh explicit bounded human delegation; repository references are immutable evidence; Linear JAI-202 is MIRROR_ONLY and non-controlling.

## Canonical records

All IDs are unique strings, all references resolve to evidence_pointer, unknown or duplicate keys fail closed, and serialization order is authority_principal, portable_role, action_class, action_permission, delegation, separation_of_duties, revocation_expiry, mechanical_surface, evidence_pointer.

| Record | Required ordered fields and constraints |
| --- | --- |
| authority_principal_record | principal_id required string identifier; principal_name required enum HUMAN_OPERATOR or CONTROL_THREAD; classification required enum CONSTITUTIONAL_ORIGIN or DELEGATED_DECISION; evidence_pointer required evidence reference; exactly one. |
| portable_role_record | role_id required string identifier; role_name required enum OPERATOR ARCHITECT BUILDER VERIFIER LIBRARIAN; boundary required nonempty string; evidence_pointer required evidence reference; exactly one. |
| action_class_record | action_id required string identifier; action_name required nonempty string; evidence_pointer required evidence reference; exactly one. |
| action_permission_record | permission_id required string identifier; action_id required action reference; HUMAN_OPERATOR CONTROL_THREAD OPERATOR ARCHITECT BUILDER VERIFIER LIBRARIAN LINEAR_MIRROR required permission enums; scope_rule required nonempty string; evidence_pointer required evidence reference; exactly one. |
| delegation_record | delegation_id required string identifier; principal_id required principal reference; delegate scope target time_boundary actor expiry revocation required nonempty strings; repository required string or explicit null; path_allowlist required ordered string array; action_allowlist required ordered action_id array; single_use required boolean; evidence_pointer required evidence reference; exactly one. |
| separation_of_duties_rule | rule_id string, subject string, prohibition string, evidence_pointer; one or more. |
| revocation_expiry_rule | rule_id string, trigger string, effect string, evidence_pointer; one or more. |
| mechanical_surface_record | surface_id string, surface enum GITHUB CI VERCEL LINEAR CHECKS, classification enum MECHANICAL EVIDENCE MIRROR, evidence_pointer; one or more. |
| evidence_pointer | evidence_id required string identifier; source_class required string; immutability required enum IMMUTABLE MUTABLE_CORROBORATING; reference required string; claim required string; observation_boundary required nonempty string. Immutable repository references are SHA-pinned; mutable records remain non-controlling. |

Permission enum: MAY_AUTHORIZE_AS_ORIGIN; MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED; MAY_PERFORM_WHEN_EXPLICITLY_ROUTED; MAY_PROPOSE_ONLY; MAY_VALIDATE_ONLY; MAY_MIRROR_ONLY; PROHIBITED; NOT_APPLICABLE. None supplies a live route, token, credential, or execution authority.

HUMAN_OPERATOR is principal origin. Portable roles are interfaces, not identities or principals. CODEX_CONTROL_THREAD is a delivery surface in an explicitly routed portable role. JAI_CONTROL_THREAD is future architecture unless separately activated. GitHub, CI, Vercel, Linear, and checks are mechanical/evidence/mirror surfaces, never principals.

## Canonical instance registries

All fields use the declared order; IDs match `B5-[A-Z]+-[0-9]{3}`; unknown keys,
duplicate IDs, unresolved references, and invalid enum values fail closed.

| principal_id | principal_name | classification | evidence_pointer |
| --- | --- | --- |
| B5-PRINCIPAL-001 | HUMAN_OPERATOR | CONSTITUTIONAL_ORIGIN | B5-E-001 |
| B5-PRINCIPAL-002 | CONTROL_THREAD | DELEGATED_DECISION | B5-E-002 |

| role_id | role_name | boundary | evidence_pointer |
| --- | --- | --- |
| B5-ROLE-001 | OPERATOR | triage, handoffs, task packets; no core code edits | B5-E-002 |
| B5-ROLE-002 | ARCHITECT | specifications, contracts, design; no core code edits | B5-E-002 |
| B5-ROLE-003 | BUILDER | routed implementation diffs/assigned documentary artifacts; no independent verification or acceptance | B5-E-002 |
| B5-ROLE-004 | VERIFIER | checks, validation, review artifacts, evidence; no self-routing, implementation mutation, or acceptance | B5-E-002 |
| B5-ROLE-005 | LIBRARIAN | documentation, runbooks, changelogs, durable knowledge; no core code edits | B5-E-002 |

| delegation_id | principal_id | delegate | scope | target | repository | path_allowlist | time_boundary | actor | action_allowlist | expiry | revocation | single_use | evidence_pointer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B5-DELEGATION-001 | B5-PRINCIPAL-001 | CONTROL_THREAD -> BUILDER/CODEX_CONTROL_THREAD | B5 authoring | single artifact | jai-nexus/dev-jai-nexus | ["docs/reference/q3m7y26-p1-b5-role-authority-matrix-v0.md"] | current task | CODEX_CONTROL_THREAD | ["B5-ACTION-003"] | task completion | human revocation | true | B5-E-001 |
| B5-DELEGATION-002 | B5-PRINCIPAL-002 | VERIFIER | independent verification | exact B5 head | jai-nexus/dev-jai-nexus | ["exact reviewed artifact"] | future routed task | independent verifier | ["B5-ACTION-005"] | review completion | route revocation | true | B5-E-002 |
| B5-DELEGATION-003 | B5-PRINCIPAL-001 | merge executor | exact-head merge | named future head | jai-nexus/dev-jai-nexus | ["named future path set"] | future only | named executor | ["B5-ACTION-013"] | named future expiry | fresh human revocation | true | B5-E-001 |

| rule_id | subject | prohibition | evidence_pointer |
| --- | --- | --- | --- |
| B5-SOD-001 | Builder | cannot independently verify or accept own work | B5-E-002 |
| B5-SOD-002 | Verifier | cannot self-route or convert checks into acceptance | B5-E-002 |
| B5-SOD-003 | CONTROL_THREAD | cannot self-expand human delegation | B5-E-001 |
| B5-SOD-004 | Linear | cannot route, accept, merge, deploy, or expand scope | B5-E-010 |

| rule_id | trigger | effect | evidence_pointer |
| --- | --- | --- | --- |
| B5-REVOKE-001 | stale, reused, expired, revoked, mismatched, or expanded authority | fail closed before action | B5-E-001 |
| B5-REVOKE-002 | merge request without fresh exact-head route | no merge, acceptance, or deployment | B5-E-002 |

| surface_id | surface | classification | evidence_pointer |
| --- | --- | --- | --- |
| B5-SURFACE-001 | GITHUB | MECHANICAL | B5-E-009 |
| B5-SURFACE-002 | CI | EVIDENCE | B5-E-008 |
| B5-SURFACE-003 | VERCEL | EVIDENCE | B5-E-002 |
| B5-SURFACE-004 | LINEAR | MIRROR | B5-E-010 |
| B5-SURFACE-005 | CHECKS | EVIDENCE | B5-E-008 |

## Portable roles and separation

The five exact portable roles are JAI::DEV::OPERATOR, JAI::DEV::ARCHITECT, JAI::DEV::BUILDER, JAI::DEV::VERIFIER, and JAI::DEV::LIBRARIAN. Builder cannot independently verify or accept its work. Verifier cannot self-route or convert checks to acceptance. CONTROL_THREAD acceptance remains distinct from delivery and review. A merge executor is mechanical. Founder observation reports only observed evidence. Linear cannot route, accept, merge, deploy, or expand scope. No tool, role, workflow, mirror, or surface self-expands authority.

rolemap and role_guardrails are mechanical implementations, not policy principals. Verifier allowlist bypass is a mechanical admission gap, not mutation authority. docs/reference fallback admission is not universal canon. These observed gaps are recorded without repair.

## Action registry

The permission matrix below is the compact serialization of exactly twenty action_permission records, one per row, in ascending action_id order. Each row has a unique permission_id, an action_id reference, a row-specific scope_rule, and evidence_pointer B5-E-002; every MAY value is conditional on that row's scope rule.

| action_id | action_name | evidence_pointer |
| --- | --- | --- |
| B5-ACTION-001 | planning/proposal | B5-E-002 |
| B5-ACTION-002 | routing | B5-E-002 |
| B5-ACTION-003 | authoring/building | B5-E-002 |
| B5-ACTION-004 | validation | B5-E-002 |
| B5-ACTION-005 | independent verification | B5-E-002 |
| B5-ACTION-006 | founder observation | B5-E-002 |
| B5-ACTION-007 | acceptance/HOLD/REVISE | B5-E-002 |
| B5-ACTION-008 | Git staging | B5-E-002 |
| B5-ACTION-009 | Git commit | B5-E-002 |
| B5-ACTION-010 | Git push | B5-E-002 |
| B5-ACTION-011 | Draft PR creation/update | B5-E-002 |
| B5-ACTION-012 | ready-for-review conversion | B5-E-002 |
| B5-ACTION-013 | merge | B5-E-002 |
| B5-ACTION-014 | branch deletion | B5-E-002 |
| B5-ACTION-015 | Linear mirror mutation | B5-E-002 |
| B5-ACTION-016 | deployment | B5-E-002 |
| B5-ACTION-017 | provider/model dispatch | B5-E-002 |
| B5-ACTION-018 | Agent/Council activation | B5-E-002 |
| B5-ACTION-019 | customer/production effect | B5-E-002 |
| B5-ACTION-020 | Batch/Program exit | B5-E-002 |

## Conditional Action Matrix

Every MAY value is conditional on the row's scope_rule. No matrix cell grants a current route, token, credential, acceptance, or execution authority.

| permission_id | action_id | action_name | HUMAN_OPERATOR | CONTROL_THREAD | OPERATOR | ARCHITECT | BUILDER | VERIFIER | LIBRARIAN | LINEAR_MIRROR | scope_rule | evidence_pointer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B5-PERM-001 | B5-ACTION-001 | planning/proposal | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | MAY_PROPOSE_ONLY | MAY_PROPOSE_ONLY | MAY_PROPOSE_ONLY | MAY_VALIDATE_ONLY | MAY_PROPOSE_ONLY | MAY_MIRROR_ONLY | FRESH_EXACT_ROUTE_ONLY | B5-E-002 |
| B5-PERM-002 | B5-ACTION-002 | routing | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | FRESH_EXACT_ROUTE_ONLY | B5-E-002 |
| B5-PERM-003 | B5-ACTION-003 | authoring/building | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | PROHIBITED | FRESH_EXACT_ROUTE_AND_PORTABLE_ROLE_ARTIFACT_BOUNDARY | B5-E-002 |
| B5-PERM-004 | B5-ACTION-004 | validation | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | MAY_PROPOSE_ONLY | MAY_PROPOSE_ONLY | MAY_VALIDATE_ONLY | MAY_VALIDATE_ONLY | MAY_PROPOSE_ONLY | NOT_APPLICABLE | FRESH_EXACT_ROUTE_ONLY | B5-E-002 |
| B5-PERM-005 | B5-ACTION-005 | independent verification | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | MAY_PROPOSE_ONLY | PROHIBITED | MAY_VALIDATE_ONLY | PROHIBITED | NOT_APPLICABLE | FRESH_EXACT_ROUTE_ONLY | B5-E-002 |
| B5-PERM-006 | B5-ACTION-006 | founder observation | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | FRESH_EXACT_ROUTE_ONLY | B5-E-002 |
| B5-PERM-007 | B5-ACTION-007 | acceptance/HOLD/REVISE | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | FRESH_EXACT_ROUTE_ONLY | B5-E-002 |
| B5-PERM-008 | B5-ACTION-008 | Git staging | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | PROHIBITED | FRESH_EXACT_ROUTE_AND_PORTABLE_ROLE_ARTIFACT_BOUNDARY | B5-E-002 |
| B5-PERM-009 | B5-ACTION-009 | Git commit | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | PROHIBITED | FRESH_EXACT_ROUTE_AND_PORTABLE_ROLE_ARTIFACT_BOUNDARY | B5-E-002 |
| B5-PERM-010 | B5-ACTION-010 | Git push | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | PROHIBITED | FRESH_EXACT_ROUTE_AND_PORTABLE_ROLE_ARTIFACT_BOUNDARY | B5-E-002 |
| B5-PERM-011 | B5-ACTION-011 | Draft PR creation/update | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | PROHIBITED | FRESH_EXACT_ROUTE_AND_PORTABLE_ROLE_ARTIFACT_BOUNDARY | B5-E-002 |
| B5-PERM-012 | B5-ACTION-012 | ready-for-review conversion | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | FRESH_EXACT_ROUTE_ONLY | B5-E-002 |
| B5-PERM-013 | B5-ACTION-013 | merge | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | PROHIBITED | PROHIBITED | PROHIBITED | FUTURE_EXACT_HEAD_SEPARATE_ROUTE_ONLY | B5-E-002 |
| B5-PERM-014 | B5-ACTION-014 | branch deletion | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | PROHIBITED | PROHIBITED | PROHIBITED | FUTURE_EXACT_HEAD_SEPARATE_ROUTE_ONLY | B5-E-002 |
| B5-PERM-015 | B5-ACTION-015 | Linear mirror mutation | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | MAY_PERFORM_WHEN_EXPLICITLY_ROUTED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | MAY_MIRROR_ONLY | FRESH_EXACT_ROUTE_AND_LINEAR_TARGET_ONLY | B5-E-002 |
| B5-PERM-016 | B5-ACTION-016 | deployment | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | SEPARATE_HUMAN_AUTHORITY_REQUIRED_NO_PORTABLE_ROLE_PERMISSION | B5-E-002 |
| B5-PERM-017 | B5-ACTION-017 | provider/model dispatch | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | SEPARATE_HUMAN_AUTHORITY_REQUIRED_NO_PORTABLE_ROLE_PERMISSION | B5-E-002 |
| B5-PERM-018 | B5-ACTION-018 | Agent/Council activation | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | SEPARATE_HUMAN_AUTHORITY_REQUIRED_NO_PORTABLE_ROLE_PERMISSION | B5-E-002 |
| B5-PERM-019 | B5-ACTION-019 | customer/production effect | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | SEPARATE_HUMAN_AUTHORITY_REQUIRED_NO_PORTABLE_ROLE_PERMISSION | B5-E-002 |
| B5-PERM-020 | B5-ACTION-020 | Batch/Program exit | MAY_AUTHORIZE_AS_ORIGIN | MAY_AUTHORIZE_WHEN_EXPLICITLY_DELEGATED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | PROHIBITED | SEPARATE_HUMAN_AUTHORITY_REQUIRED_NO_PORTABLE_ROLE_PERMISSION | B5-E-002 |

Authorities are non-transitive: commit does not imply push; push does not imply PR creation; PR creation does not imply ready conversion; checks do not imply acceptance; merge does not imply acceptance or deployment. Delegation fails closed on missing, stale, mismatched, expanded, reused, expired, or revoked scope.

## Deterministic Serialization

- Record types serialize in declared canonical order.
- Records within each type sort by ascending record ID.
- Fields serialize in their declared order.
- Arrays preserve declared order.
- No inferred defaults are permitted.
- Null is allowed only where explicitly declared.
- Unknown keys, duplicate IDs, invalid enums, and unresolved references fail closed.

## Fixtures

| Fixture | Structured posture |
| --- | --- |
| B5 authoring envelope | HUMAN_OPERATOR -> CONTROL_THREAD -> JAI::DEV::BUILDER represented by CODEX_CONTROL_THREAD; scope is this one unstaged artifact only; expiry is task completion; single_use true; no Git mutation. |
| Independent verification handoff | Separately routed JAI::DEV::VERIFIER reviews exact head and artifact; produces evidence only; cannot self-route or accept. |
| Exact-head merge | FUTURE / SEPARATELY_AUTHORIZED_ONLY; requires named exact head and fresh authority; mechanical merge does not accept or deploy. |

## Invalid examples

| ID | Invalid claim | Result |
| --- | --- | --- |
| B5-INV-01 | Role string is authority. | PROHIBITED. |
| B5-INV-02 | CI success is acceptance. | PROHIBITED. |
| B5-INV-03 | Builder self-accepts. | PROHIBITED. |
| B5-INV-04 | Linear status routes work. | PROHIBITED. |
| B5-INV-05 | Merge is acceptance. | PROHIBITED. |
| B5-INV-06 | CONTROL_THREAD self-expands. | PROHIBITED. |
| B5-INV-07 | Stale token reused. | Fail closed. |
| B5-INV-08 | Verifier bypass is mutation authority. | PROHIBITED. |
| B5-INV-09 | Vercel proves deployment authority. | PROHIBITED. |
| B5-INV-10 | JAI_CONTROL_THREAD is assumed active. | PROHIBITED. |

## Reserved downstream boundaries

| ID | Reserved Lane |
| --- | --- |
| B5-R-01 | B6 Work Packet Canon |
| B5-R-02 | B7 Decision Token and Disposition Canon |
| B5-R-03 | B8 Evidence Bundle Schema |
| B5-R-04 | B9 Receipt Taxonomy |
| B5-R-05 | B10 Acceptance Receipt and Integrity Schema |
| B5-R-06 | B11 Capability and Credit Ledger |
| B5-R-07 | B12 Exception and Out-of-Sequence Work Canon |
| B5-R-08 | B13 Rollback, Reopen, and Supersession Canon |
| B5-R-09 | B14 GitHub-Linear Mirror Protocol |
| B5-R-10 | B15 Lifecycle Canon Verification and Batch B Closeout |

## Risks, unresolved boundaries, and non-authorizations

Unresolved: current live delegation/credentials, current acceptance receipt for B5, and future JAI_CONTROL_THREAD activation are not evidenced here. Risk is authority inflation from roles, checks, or mirrors; rollback is a separately authorized documentary repair.

No positive Batch exit, Program exit, deployment, external effect, provider, customer, Agent, Council, or activation authority is granted.

## Evidence Pointer Registry

| evidence_id | source_class | immutability | reference | claim | observation_boundary |
| --- | --- | --- | --- | --- | --- |
| B5-E-001 | Repository canon | IMMUTABLE | [A2] | precedence | exact base 1cdc1327ee2e08289a7fedee4ad909381ce3cbef |
| B5-E-002 | Repository canon | IMMUTABLE | [A8] | role boundaries | exact base 1cdc1327ee2e08289a7fedee4ad909381ce3cbef |
| B5-E-003 | Repository canon | IMMUTABLE | [B1] | lifecycle separation | exact base 1cdc1327ee2e08289a7fedee4ad909381ce3cbef |
| B5-E-004 | Repository canon | IMMUTABLE | [B2] | identity separation | exact base |
| B5-E-005 | Repository canon | IMMUTABLE | [B3] | charter boundary | exact base |
| B5-E-006 | Repository canon | IMMUTABLE | [B4] | downstream lanes | exact base |
| B5-E-007 | Repository configuration | IMMUTABLE | [ROLEMAP] | portable roles | exact base |
| B5-E-008 | Repository workflow | IMMUTABLE | [ROLE-GUARD] | mechanical enforcement | exact base |
| B5-E-009 | Repository template | IMMUTABLE | [PR-TEMPLATE] | PR evidence structure | exact base |
| B5-E-010 | Linear mirror | MUTABLE_CORROBORATING | [B5-LINEAR] | MIRROR_ONLY / non-controlling | B5_ROUTE_OBSERVATION_ONLY_NOT_INDEPENDENTLY_REFRESHED |

| Ref | SHA-pinned blob |
| --- | --- |
| [A2] | [A2](https://github.com/jai-nexus/dev-jai-nexus/blob/1cdc1327ee2e08289a7fedee4ad909381ce3cbef/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md) |
| [A8] | [A8](https://github.com/jai-nexus/dev-jai-nexus/blob/1cdc1327ee2e08289a7fedee4ad909381ce3cbef/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md) |
| [B1] | [B1](https://github.com/jai-nexus/dev-jai-nexus/blob/1cdc1327ee2e08289a7fedee4ad909381ce3cbef/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md) |
| [B2] | [B2](https://github.com/jai-nexus/dev-jai-nexus/blob/1cdc1327ee2e08289a7fedee4ad909381ce3cbef/docs/reference/q3m7y26-p1-b2-control-coordinates-canon-v0.md) |
| [B3] | [B3](https://github.com/jai-nexus/dev-jai-nexus/blob/1cdc1327ee2e08289a7fedee4ad909381ce3cbef/docs/reference/q3m7y26-p1-b3-program-charter-schema-v0.md) |
| [B4] | [B4](https://github.com/jai-nexus/dev-jai-nexus/blob/1cdc1327ee2e08289a7fedee4ad909381ce3cbef/docs/reference/q3m7y26-p1-b4-batch-wave-lane-decomposition-canon-v0.md) |
| [ROLEMAP] | [rolemap](https://github.com/jai-nexus/dev-jai-nexus/blob/1cdc1327ee2e08289a7fedee4ad909381ce3cbef/roles/rolemap.json) |
| [ROLE-GUARD] | [guardrail](https://github.com/jai-nexus/dev-jai-nexus/blob/1cdc1327ee2e08289a7fedee4ad909381ce3cbef/.github/workflows/role-guardrails.yml) |
| [PR-TEMPLATE] | [template](https://github.com/jai-nexus/dev-jai-nexus/blob/1cdc1327ee2e08289a7fedee4ad909381ce3cbef/.github/PULL_REQUEST_TEMPLATE.md) |
| [B5-LINEAR] | Linear JAI-202 / MIRROR_ONLY / non-controlling |

B5_MAXIMUM_CURRENT_CREDIT: ROLE_AUTHORITY_MATRIX_DOCUMENTATION_ONLY
B5_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION
B5_FURTHER_EXECUTION_AUTHORITY: NOT_GRANTED
BATCH_B_EXIT_CREDIT: NONE
PROGRAM_EXIT_CREDIT: NONE
JAI_ACTIVATION_CREDIT: NONE
NEXT_REQUIRED_DECISION: ACCEPT_HOLD_OR_REVISE_B5_ROLE_AUTHORITY_MATRIX
