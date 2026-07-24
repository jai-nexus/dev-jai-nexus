# Q3M7Y26-P1 B2 Control Coordinates Canon v0

## 1. Status, purpose, and documentary boundary

| record_id | field | value |
| --- | --- | --- |
| `B2-STA-001` | Status | `PROPOSED_FOR_INDEPENDENT_CONTROL_THREAD_DECISION` |
| `B2-STA-002` | Purpose | Define a repository-portable Control Coordinates identity and schema canon. |
| `B2-STA-003` | Evidence ceiling | `DOCUMENTATION_PROPOSED_CONTROL_COORDINATES_CANON_ONLY` |
| `B2-STA-004` | Runtime effect | `NONE` |
| `B2-STA-005` | Authority effect | `NONE` |

This proposal separates coordinate identity from route, role, repository
binding, delivery, verification, acceptance, capability credit, integration,
mirror state, and runtime activation. A valid coordinate identifies governed
work. It does not route, authorize, execute, accept, merge, deploy, activate,
or create capability credit.

A6 remains the accepted Program 1 instance registry. B1 remains the proposed
lifecycle vocabulary and state-machine source integrated on the required base.
B2 proposes the universal identity contract only. It does not rewrite either
artifact and does not create a runtime schema, validator, package, database
model, API, UI, workflow, generator, migration, or automation.

## 2. Control coordinates and evidence cutoff

| field | exact value |
| --- | --- |
| Program | `Q3M7Y26-P1` |
| Program title | Q3M7Y26 JAI Governance Intelligence - Main-State Reconciliation and Minimum Viable Operating Loop v0 |
| Batch | `B - Program Lifecycle and Receipt Canon` |
| Wave | `B-A` |
| Lane | `B2 - Control Coordinates Canon v0` |
| Full coordinate | `Q3M7Y26-P1:B2` |
| Route | `CT-2026-07-24-Q3M7Y26-P1-START-B2-CONTROL-COORDINATES-CANON-v0` |
| Work Packet | `Q3M7Y26-P1-B2-v0` |
| Required base and evidence cutoff | `e8aaa217bf4079ec2ff3b7f2389d69718c8ad92b` |
| B1 accepted source head | `e5fe81f52675514bff391810b7d4f12b6170e94c` |
| Repository | `jai-nexus/dev-jai-nexus` |
| Role | `JAI::DEV::BUILDER` |
| Linear mirror | `JAI-199 / MIRROR_ONLY / READ_ONLY / NOT_MUTATED` |
| Evidence ceiling | `DOCUMENTATION_PROPOSED_CONTROL_COORDINATES_CANON_ONLY` |

The evidence cutoff is repository main at the required base plus the current
route packet and the read-only JAI-199 observation. The B1 artifact at that
base retains an earlier pending-acceptance cutoff even though [PR402] was
subsequently integrated. No immutable B1 acceptance receipt was found; this
proposal preserves that provenance gap.

## 3. Source precedence and provenance

| source_id | precedence | source | classification | permitted use | excluded inference |
| --- | ---: | --- | --- | --- | --- |
| `B2-SRC-001` | 1 | Current HUMAN_OPERATOR / CONTROL_THREAD B2 route | `ACCEPTED_CURRENT` | Exact B2 delivery scope, route, base, and non-authorizations | B2 acceptance, merge, or later-Lane execution |
| `B2-SRC-002` | 2 | [MOTION-DECISION] | `RATIFIED_PHASE_SPECIFIC` | Four-Program sequence, separate-route rule, and no-NHID-assignment boundary | Current Lane acceptance or execution |
| `B2-SRC-003` | 3 | [OPENING-RECEIPT] | `ACCEPTED_CURRENT` | Program identity, Program code, naming grammar, and planning-only posture | Batch or Lane execution |
| `B2-SRC-004` | 4 | [A2] | `ACCEPTED_CURRENT` | Evidence precedence, freshness, contradiction, and supersession rules | Coordinate schema |
| `B2-SRC-005` | 5 | [A6] | `ACCEPTED_CURRENT` | Program 1 coordinate instances and distinct route/status fields | Universal schema acceptance |
| `B2-SRC-006` | 6 | [A8] | `ACCEPTED_CURRENT` | Role, route, repository, and authority separation | Coordinate identity from role or repository |
| `B2-SRC-007` | 7 | [A15] | `RATIFIED_PHASE_SPECIFIC` | Batch A closeout evidence and unresolved provenance boundaries | Batch B execution or exit |
| `B2-SRC-008` | 8 | [B1], [B1-SOURCE], [B1-MERGE] | `STATIC_CONFIGURATION / INTEGRATED` | Ten lifecycle axes and reserved B2-B15 subjects | Immutable B1 acceptance receipt |
| `B2-SRC-009` | 9 | [JAI-199] | `MIRROR_ONLY` | Stale planning label and objective corroboration | Route, role, acceptance, or source-of-truth authority |

For claims normalized to the same subject and time, the higher applicable
source controls. Repository integration proves repository state, not Control
acceptance. Mutable GitHub and Linear objects corroborate delivery or mirror
state only. Unknown, stale, or contradictory identity evidence fails closed.

## 4. Namespace reconciliation

| namespace_id | namespace | canonical meaning | identity effect | authority effect |
| --- | --- | --- | --- | --- |
| `B2-NS-001` | Canonical Program identity | Stable Program object ID, for example `jai-governance-intelligence-main-state-operating-loop-v0` | Identifies the Program object | `NONE` |
| `B2-NS-002` | Program code | Compact accepted Program code, for example `Q3M7Y26-P1` | Qualifies the minimum stable Lane identity | `NONE` |
| `B2-NS-003` | Batch code | Program-local uppercase Batch code, for example `B` | Structural context | `NONE` |
| `B2-NS-004` | Wave code | Program-local `<Batch>-<Letter>` code, for example `B-A` | Structural context | `NONE` |
| `B2-NS-005` | Lane code | Program-local `<Batch><PositiveInteger>` code, for example `B2` | Not globally unique alone | `NONE` |
| `B2-NS-006` | Full Program-qualified coordinate | Exact `<ProgramCode>:<LaneCode>` value | Minimum stable Lane identity | `NONE` |
| `B2-NS-007` | Display title | Human-readable Program, Batch, Wave, or Lane title | Descriptive only | `NONE` |
| `B2-NS-008` | Route token | Opaque, separately issued route identifier | Binds authority evidence to a subject when fresh | No effect by coordinate validity |
| `B2-NS-009` | Work Packet identifier | Identifier for a bounded execution packet | Delivery coordination only | No effect by coordinate validity |
| `B2-NS-010` | Numerical Hierarchy ID | Separate hierarchy/location/reference identifier when assigned | Not a Control Coordinate unless later canon says so | `NONE` |
| `B2-NS-011` | Artifact-local validation identifier | Deterministic row or assertion key such as `B2-VAL-001` | Artifact-local only | `NONE` |
| `B2-NS-012` | Repair, observation, or child-event identifier | Identifier for a later event associated with a stable coordinate | Does not create a new Lane unless separately defined | `NONE` |
| `B2-NS-013` | GitHub branch, PR, and commit identity | Repository delivery and integration evidence | Not coordinate identity | `NONE` |
| `B2-NS-014` | Linear issue identifier | Mirror and coordination identity | Not coordinate identity | `NONE` |
| `B2-NS-015` | Evidence identifier | Identifies a bounded evidence record | Not coordinate identity | `NONE` |
| `B2-NS-016` | Decision identifier | Identifies a bounded Control decision | Not coordinate identity | Only the decision's explicit terms apply |
| `B2-NS-017` | Receipt identifier | Identifies a bounded receipt | Not coordinate identity | Only the receipt's explicit terms apply |

NHID means Numerical Hierarchy ID. Repository evidence supports only that it
is a hierarchy/location/reference namespace, is separate from Batch IDs and
Control Coordinates unless later unified, and carries no authority. No
primary evidence at the cutoff specifies an exact one-to-one or compositional
relationship between NHIDs and Control Coordinates. That relationship is
therefore `UNRESOLVED / DEFERRED`, and no NHID is assigned here.

## 5. Minimal canonical Control Coordinates schema

### Required and optional fields

| schema_id | order | field | presence | type | canonical rule |
| --- | ---: | --- | --- | --- | --- |
| `B2-FLD-001` | 1 | `program_id` | Required | non-empty lowercase slug string | Stable canonical Program identity; pattern `^[a-z0-9]+(?:-[a-z0-9]+)*$`. |
| `B2-FLD-002` | 2 | `program_code` | Required | uppercase code string | Pattern `^[A-Z][A-Z0-9]*-P[1-9][0-9]*$`; exact accepted value, no case folding. |
| `B2-FLD-003` | 3 | `batch_code` | Required | one uppercase letter | Pattern `^[A-Z]$`. |
| `B2-FLD-004` | 4 | `wave_code` | Required | structural code string | Pattern `^[A-Z]-[A-Z]$`; prefix must equal `batch_code`. |
| `B2-FLD-005` | 5 | `lane_code` | Required | structural code string | Pattern `^[A-Z][1-9][0-9]*$`; prefix must equal `batch_code`. |
| `B2-FLD-006` | 6 | `full_coordinate` | Required | identity string | Exact concatenation `program_code + ":" + lane_code`. |
| `B2-FLD-007` | 7 | `program_title` | Optional | non-empty display string | Descriptive only; trim outer whitespace; preserve internal text. |
| `B2-FLD-008` | 8 | `batch_title` | Optional | non-empty display string | Descriptive only; trim outer whitespace; preserve internal text. |
| `B2-FLD-009` | 9 | `lane_title` | Optional | non-empty display string | Descriptive only; trim outer whitespace; preserve internal text. |
| `B2-FLD-010` | 10 | `parent_coordinate` | Optional | exact Program-qualified coordinate | Structural relationship only; must resolve to an accepted parent definition. |
| `B2-FLD-011` | 11 | `nhid_ref` | Optional | opaque non-empty reference string | Separate reference namespace; no identity merge or authority effect. |

Unknown fields are invalid. Route, role, repository, branch, PR, commit, Work
Packet, Linear issue, lifecycle state, acceptance, credit, and activation are
not fields in this identity schema. They belong in separately governed
bindings or evidence records.

### Canonical human-display syntax

The canonical Lane display identity is:

```text
<program_code>:<lane_code>
```

For B2 the only canonical display identity is `Q3M7Y26-P1:B2`. A spaced,
slash-delimited, lowercase, title-bearing, or bare-Lane form may be useful
prose, but it is not the canonical identity value.

### Canonical structured representation

```json
{
  "program_id": "jai-governance-intelligence-main-state-operating-loop-v0",
  "program_code": "Q3M7Y26-P1",
  "batch_code": "B",
  "wave_code": "B-A",
  "lane_code": "B2",
  "full_coordinate": "Q3M7Y26-P1:B2",
  "program_title": "Q3M7Y26 JAI Governance Intelligence - Main-State Reconciliation and Minimum Viable Operating Loop v0",
  "batch_title": "Program Lifecycle and Receipt Canon",
  "lane_title": "Control Coordinates Canon v0"
}
```

Canonical serialization uses UTF-8 JSON, the field order above, exact key
spelling, no duplicate keys, and no unknown keys. Strings use their normalized
values. Optional absent fields are omitted, not encoded as empty strings.

### Validation outcome

| validation_id | outcome | meaning |
| --- | --- | --- |
| `B2-VAL-001` | `VALID` | Every required field, grammar, structural join, uniqueness rule, and display/structured equality check passes. |
| `B2-VAL-002` | `INVALID` | At least one deterministic validation rule fails. |
| `B2-VAL-003` | `UNRESOLVED` | Required identity evidence is missing or contradictory; dependent use fails closed. |

Validation reports identity coherence only. `VALID` grants no route, role,
repository authority, execution, acceptance, credit, integration, or runtime
activation.

## 6. Identity and uniqueness rules

| rule_id | rule | fail-closed result |
| --- | --- | --- |
| `B2-ID-001` | A bare Lane code is Program-local and is not globally unique. | Reject it as a complete Lane identity. |
| `B2-ID-002` | The Program-qualified coordinate is the minimum stable Lane identity. | Require exact `program_code:lane_code`. |
| `B2-ID-003` | `full_coordinate` must equal the structured `program_code` and `lane_code`. | `INVALID` on mismatch. |
| `B2-ID-004` | Each `full_coordinate` is unique within a canonical registry snapshot. | Reject every duplicate pending reconciliation. |
| `B2-ID-005` | Titles, route tokens, Work Packets, GitHub identities, and Linear IDs are not coordinate identity. | Keep them in separate namespaces. |
| `B2-ID-006` | Repository, branch, PR, and commit bindings are route or evidence facts. | Never derive identity or authority from them. |
| `B2-ID-007` | One coordinate may participate in bounded polyrepo delivery. | Preserve one coordinate and separately route each repository binding. |
| `B2-ID-008` | Cross-repository participation grants no repository ownership or authority. | Require an exact repository route for every mutation. |
| `B2-ID-009` | Historical aliases never silently replace a canonical coordinate. | Preserve alias evidence and require explicit reconciliation. |

## 7. Parent, child, and inheritance rules

| rule_id | rule | permitted inheritance |
| --- | --- | --- |
| `B2-INH-001` | A canonical stored record materializes every required field. | None at rest. |
| `B2-INH-002` | A nested authoring envelope may supply `program_id` and `program_code` to a child before validation. | Structural context only; values must be materialized and revalidated. |
| `B2-INH-003` | `batch_code`, `wave_code`, and `lane_code` must reconcile by prefix. | Structural consistency only. |
| `B2-INH-004` | A `parent_coordinate` must resolve exactly and cannot alter child identity. | Structural relationship only. |
| `B2-INH-005` | A Wave groups member Lanes but does not route them. | No route, role, or authority. |
| `B2-INH-006` | A Batch route does not silently grant Lane execution authority. | No Lane route or execution. |
| `B2-INH-007` | Route, role, repository, delivery, verification, acceptance, credit, integration, and activation never inherit from a parent coordinate. | None. |
| `B2-INH-008` | Child repairs, observations, decisions, and receipts retain the parent coordinate as context but use separate event identifiers. | Coordinate reference only. |
| `B2-INH-009` | Unsupported or implicit inheritance is invalid. | `INVALID / FAIL_CLOSED`. |

## 8. Stability and event rules

| rule_id | rule |
| --- | --- |
| `B2-EVT-001` | Coordinate identity remains stable across all B1 lifecycle transitions. |
| `B2-EVT-002` | A correction, repair, observation, route, decision, integration, or receipt is a separate event or identifier. |
| `B2-EVT-003` | A later event may cite the stable coordinate but may not silently rewrite it. |
| `B2-EVT-004` | Historical coordinates and evidence remain immutable when current posture changes. |
| `B2-EVT-005` | A renamed display title does not change identity unless an authorized identity migration explicitly says so. |
| `B2-EVT-006` | Supersession follows B1: a named replacement and accepted disposition are required. Chronology alone is insufficient. |
| `B2-EVT-007` | A route expiry, repository revert, mirror drift, or runtime transition does not change coordinate identity. |
| `B2-EVT-008` | Unknown event provenance cannot update canonical identity. |

## 9. Fail-closed validation rules

| check_id | condition | result |
| --- | --- | --- |
| `B2-CHK-001` | Required field missing, null, or empty | `INVALID` |
| `B2-CHK-002` | Unknown or duplicate field | `INVALID` |
| `B2-CHK-003` | Program, Batch, Wave, or Lane code malformed | `INVALID` |
| `B2-CHK-004` | Human display is not exact canonical `program_code:lane_code` | `INVALID` for canonical identity use |
| `B2-CHK-005` | Batch, Wave, Lane, or parent/child structural mismatch | `INVALID` |
| `B2-CHK-006` | Duplicate `full_coordinate` in one canonical snapshot | `INVALID / HOLD_ALL_DUPLICATES` |
| `B2-CHK-007` | Structured and display representations differ | `INVALID` |
| `B2-CHK-008` | Bare identifier is ambiguous | `INVALID / REQUIRE_PROGRAM_QUALIFICATION` |
| `B2-CHK-009` | Route, role, repository, delivery, verification, acceptance, credit, integration, or activation is inherited | `INVALID / UNSUPPORTED_INHERITANCE` |
| `B2-CHK-010` | Required identity evidence is unresolved, stale, or contradictory | `UNRESOLVED / FAIL_CLOSED` |
| `B2-CHK-011` | NHID is treated as a Batch ID or Control Coordinate without accepted mapping evidence | `INVALID / NAMESPACE_COLLISION` |
| `B2-CHK-012` | Coordinate validity is used as positive authority | `INVALID / AUTHORITY_BOUNDARY_VIOLATION` |

Validation never guesses a missing value, normalizes malformed codes into a
different identity, resolves contradictions by chronology alone, or imports
authority from a parent, mirror, title, repository, or lifecycle state.

## 10. Exact Program 1 mappings

| mapping_id | program_id | program_code | batch_code | wave_code | lane_code | full_coordinate | lane_title | A6 source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `B2-MAP-001` | `jai-governance-intelligence-main-state-operating-loop-v0` | `Q3M7Y26-P1` | `A` | `A-A` | `A1` | `Q3M7Y26-P1:A1` | Accepted Documentation Baseline | `A6-L-A1` |
| `B2-MAP-002` | `jai-governance-intelligence-main-state-operating-loop-v0` | `Q3M7Y26-P1` | `D` | `D-A` | `D1` | `Q3M7Y26-P1:D1` | Control-Plane Behavioral CI Enablement v0 | `A6-L-D1` |
| `B2-MAP-003` | `jai-governance-intelligence-main-state-operating-loop-v0` | `Q3M7Y26-P1` | `D` | `D-A` | `D2` | `Q3M7Y26-P1:D2` | Founder Local Operating Loop Proving Seam v0 | `A6-L-D2` |
| `B2-MAP-004` | `jai-governance-intelligence-main-state-operating-loop-v0` | `Q3M7Y26-P1` | `B` | `B-A` | `B2` | `Q3M7Y26-P1:B2` | Control Coordinates Canon v0 | `A6-L-B2` |

All four rows satisfy exact field grammar, Batch/Wave/Lane prefix joins, and
`full_coordinate = program_code + ":" + lane_code`. The A6 B2 status row is a
historical cutoff that says `PROPOSED_UNROUTED`; the current route is a later
event and does not alter B2's coordinate identity.

## 11. Example non-authority proof

| example_id | mapping_id | valid identity | route granted | role granted | repository authority granted | execution granted | acceptance granted | capability credit granted | runtime activation granted |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `B2-EX-001` | `B2-MAP-001` | `YES` | `NO` | `NO` | `NO` | `NO` | `NO` | `NO` | `NO` |
| `B2-EX-002` | `B2-MAP-002` | `YES` | `NO` | `NO` | `NO` | `NO` | `NO` | `NO` | `NO` |
| `B2-EX-003` | `B2-MAP-003` | `YES` | `NO` | `NO` | `NO` | `NO` | `NO` | `NO` | `NO` |
| `B2-EX-004` | `B2-MAP-004` | `YES` | `NO` | `NO` | `NO` | `NO` | `NO` | `NO` | `NO` |

The historical A1, D1, and D2 route, delivery, or integration evidence lives
outside coordinate validity. The current B2 route likewise comes only from
the exact current Control packet, not from the B2 coordinate.

## 12. A6 instance-field mapping

| mapping_id | A6 instance field | B2 universal field or boundary | transformation |
| --- | --- | --- | --- |
| `B2-A6-001` | `canonical_program_id` | `program_id` | Exact copy. |
| `B2-A6-002` | `program_code` | `program_code` | Exact copy. |
| `B2-A6-003` | `batch_code` | `batch_code` | Exact copy. |
| `B2-A6-004` | `normalized_wave_code` | `wave_code` | Exact copy. |
| `B2-A6-005` | `lane_code` | `lane_code` | Exact copy. |
| `B2-A6-006` | `full_program_qualified_lane_coordinate` | `full_coordinate` | Exact copy and deterministic recomputation check. |
| `B2-A6-007` | `canonical_program_title` | `program_title` | Optional descriptive copy. |
| `B2-A6-008` | `exact_batch_title` | `batch_title` | Optional descriptive copy. |
| `B2-A6-009` | `lane_title` | `lane_title` | Optional descriptive copy. |
| `B2-A6-010` | `lane_registry_id` | Artifact-local validation identifier | Keep outside canonical identity. |
| `B2-A6-011` | `linear_issue_identifier` | Linear mirror binding | Keep outside canonical identity. |
| `B2-A6-012` | Core provenance/classification fields | Evidence binding | Keep outside canonical identity. |
| `B2-A6-013` | Route, role, repository, mode, delivery, verification, acceptance, credit, exception, child-event, and currentness fields | B1 lifecycle or separately governed binding | Keep outside canonical identity. |

This mapping reads A6; it does not modify A6, retroactively validate all A6
records, or convert A6's instance registry into the universal canon.

## 13. Alignment with B1's ten orthogonal axes

| alignment_id | B1 axis | relationship to coordinate identity |
| --- | --- | --- |
| `B2-B1-001` | `B1-AX-01 / Planning maturity` | Planning may change while the coordinate stays fixed. |
| `B2-B1-002` | `B1-AX-02 / Routing authority` | Routes are separate events; coordinate validity grants no route. |
| `B2-B1-003` | `B1-AX-03 / Delivery` | Delivery evidence cites but does not alter the coordinate. |
| `B2-B1-004` | `B1-AX-04 / Verification` | Verification evaluates an exact subject/evidence set, not identity authority. |
| `B2-B1-005` | `B1-AX-05 / Acceptance` | Acceptance is a separate authorized decision. |
| `B2-B1-006` | `B1-AX-06 / Repository integration` | Integration binds exact repository evidence without changing identity. |
| `B2-B1-007` | `B1-AX-07 / Control disposition overlay` | Hold, cancellation, or supersession preserves historical identity. |
| `B2-B1-008` | `B1-AX-08 / Program operation` | Program posture is separately evidenced and is not encoded in a Lane coordinate. |
| `B2-B1-009` | `B1-AX-09 / Runtime activation` | Runtime activation requires direct evidence and fresh authority. |
| `B2-B1-010` | `B1-AX-10 / Mirror posture` | Mirror freshness or conflict never governs coordinate identity. |

Coordinate validity is orthogonal to every B1 axis. No transition on any axis
creates, routes, accepts, or activates a coordinate, and a valid coordinate
does not advance any axis.

## 14. Cross-repository and mirror boundaries

| boundary_id | boundary |
| --- | --- |
| `B2-BND-001` | A coordinate is repository-portable; repository ownership is not. |
| `B2-BND-002` | Each repository mutation requires an exact separately authorized binding even when several repositories share one coordinate. |
| `B2-BND-003` | Branch, PR, and commit identities are delivery/evidence facts and never become coordinate fields. |
| `B2-BND-004` | GitHub metadata can corroborate repository delivery but cannot route, accept, or activate work. |
| `B2-BND-005` | Linear remains mirror-only. JAI-199 neither created nor routed B2 and was not mutated in this Lane. |
| `B2-BND-006` | A mirror may display the canonical coordinate, but mirror freshness is a separate B1 axis. |
| `B2-BND-007` | Mirror renames, duplicates, or stale status never silently rewrite canonical identity. |
| `B2-BND-008` | Source-of-truth transfer requires a separate accepted decision and is not performed here. |

## 15. Contradictions and unresolved questions

| issue_id | observation | classification | disposition |
| --- | --- | --- | --- |
| `B2-ISS-001` | A6 records B2 as `PROPOSED_UNROUTED`; the current packet later routes B2. | `DIFFERENT_TIME` | Preserve A6's cutoff and record the current route separately. |
| `B2-ISS-002` | JAI-199 remains Backlog and says `UNROUTED / PROPOSED_UNROUTED`. | `MIRROR_STALE` | Keep mirror-only; do not mutate or use it as authority. |
| `B2-ISS-003` | B1 is integrated on main, but its artifact cutoff still says acceptance pending and no immutable acceptance receipt is present. | `PROVENANCE_GAP` | Use B1 as integrated documentary source; do not invent acceptance receipt evidence. |
| `B2-ISS-004` | Repository sources define NHID as Numerical Hierarchy ID and a separate reference namespace but do not define an exact relationship to Control Coordinates. | `UNRESOLVED / DEFERRED` | Keep `nhid_ref` optional and opaque; no assignment or semantic merge. |
| `B2-ISS-005` | Universal uniqueness beyond one accepted registry snapshot needs a future registry governance decision. | `DEFERRED` | Require exact full-coordinate uniqueness in every canonical snapshot; do not define a global service. |
| `B2-ISS-006` | Program identity migration and alias retirement are not defined by B2. | `DEFERRED` | Fail closed and require a separately routed accepted migration contract. |

None of these issues blocks the documentary proposal. Each blocks only the
unsupported dependent inference named in its disposition.

## 16. Reserved B3-B15 ownership boundaries

| boundary_id | future Lane | reserved subject | B2 exclusion |
| --- | --- | --- | --- |
| `B2-RES-001` | `B3` | Program Charter Schema | No charter schema or charter authority. |
| `B2-RES-002` | `B4` | Batch/Wave/Lane Decomposition Canon | No ownership, decomposition process, or routing topology. |
| `B2-RES-003` | `B5` | Role and Authority Matrix | No role assignment or authority matrix. |
| `B2-RES-004` | `B6` | Work Packet Canon | No Work Packet schema or issuance protocol. |
| `B2-RES-005` | `B7` | Decision Token and Disposition Canon | No token grammar or decision protocol. |
| `B2-RES-006` | `B8` | Evidence Bundle Schema | No evidence-bundle schema. |
| `B2-RES-007` | `B9` | Receipt Taxonomy | No receipt taxonomy. |
| `B2-RES-008` | `B10` | Acceptance Receipt and Integrity Schema | No acceptance receipt or integrity mechanism. |
| `B2-RES-009` | `B11` | Capability and Credit Ledger | No credit computation or grant. |
| `B2-RES-010` | `B12` | Exception and Out-of-Sequence Work Canon | No exception route or exception semantics. |
| `B2-RES-011` | `B13` | Rollback, Reopen, and Supersession detail | No rollback protocol or supersession receipt. |
| `B2-RES-012` | `B14` | GitHub-Linear Mirror Protocol | No mirror transport, mutation, or synchronization protocol. |
| `B2-RES-013` | `B15` | Independent verification and Batch B closeout | No self-verification, acceptance, or Batch exit. |

Reserved rows: `13`. No future Lane is routed, implemented, or absorbed.

## 17. Risks and rollback

| risk_id | risk | mitigation |
| --- | --- | --- |
| `B2-RSK-001` | A valid coordinate could be mistaken for execution authority. | Repeat the zero-authority rule in schema, examples, and validation. |
| `B2-RSK-002` | Titles or mirror IDs could be mistaken for identity. | Keep namespaces separate and fail closed on alias-only input. |
| `B2-RSK-003` | Polyrepo work could imply global repository ownership. | Require exact repository-specific routes for every mutation. |
| `B2-RSK-004` | Parent context could leak route or credit to children. | Permit only explicit structural materialization and reject all authority inheritance. |
| `B2-RSK-005` | NHID could be silently merged with Batch or coordinate identity. | Preserve the unresolved separate-namespace boundary. |
| `B2-RSK-006` | The B1 provenance gap could be overstated as immutable acceptance. | Distinguish integrated source state from missing immutable acceptance receipt. |
| `B2-RSK-007` | A documentary schema could be treated as runtime implementation. | Keep the evidence ceiling documentary and add no executable path. |

Rollback is a normal revert of the single B2 documentation commit if the
proposal is rejected or superseded. Revert changes repository integration
history only; it does not erase the route or review record and does not alter
runtime, database, provider, mirror, or external-system state.

## 18. Recommendation

`GO_TO_CONTROL_THREAD_B2_CANON_DECISION`

The proposed schema deterministically reconciles Program, Batch, Wave, Lane,
and full-coordinate forms; keeps route and evidence namespaces separate;
preserves B1 lifecycle orthogonality; maps A6 without rewriting it; and fails
closed on ambiguity, contradiction, duplicate identity, or unsupported
inheritance.

This recommendation does not accept B2, authorize merge, route B3-B15, close
Batch B, route D9, change Program state, or activate any runtime.

## 19. Explicit non-authorizations

This artifact and its Draft PR do not authorize or perform B2
self-acceptance; ready conversion; merge; deployment; branch deletion; Linear
mutation; source-of-truth transfer; B3-B15 planning or execution; Batch B
exit; D9 execution; Program transition or exit; source, test, workflow,
package, dependency, schema, configuration, API, UI, database, migration,
persistence, browser, runtime, provider, network, credential, Agent, Council,
customer, or production mutation; production gates; repository ownership;
role assignment; Work Packet issuance; decision or receipt issuance;
capability credit; authority transfer; or JAI activation.

Program 1 remains `OPEN_FOR_BATCH_PLANNING_ONLY`. Standing execution authority
remains `NOT_GRANTED`. Coordinates identify work and grant zero gates.

`B2_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_PROPOSED_CONTROL_COORDINATES_CANON_ONLY`

`B2_RECOMMENDATION: GO_TO_CONTROL_THREAD_B2_CANON_DECISION`

`B2_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION`

`B2_MERGE_AUTHORITY: NOT_GRANTED`

`B3_EXECUTION_AUTHORITY: NOT_GRANTED`

`BATCH_B_EXIT_CREDIT: NONE`

`D9_EXECUTION_AUTHORITY: HELD_PENDING_ACCEPTED_BATCH_B`

`PROGRAM_EXIT_CREDIT: NONE`

`JAI_ACTIVATION_CREDIT: NONE`

`NEXT_REQUIRED_DECISION: ACCEPT_B2_BUILDER_PR_FOR_CONTROL_THREAD_DECISION`

## 20. Immutable reference definitions

[MOTION-DECISION]: https://github.com/jai-nexus/dev-jai-nexus/blob/e8aaa217bf4079ec2ff3b7f2389d69718c8ad92b/.nexus/motions/motion-0248/decision.yaml
[OPENING-RECEIPT]: https://github.com/jai-nexus/dev-jai-nexus/blob/e8aaa217bf4079ec2ff3b7f2389d69718c8ad92b/docs/reference/q3m7y26-jai-governance-intelligence-main-state-operating-loop-program-opening-receipt-v0.md
[A2]: https://github.com/jai-nexus/dev-jai-nexus/blob/e8aaa217bf4079ec2ff3b7f2389d69718c8ad92b/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md
[A6]: https://github.com/jai-nexus/dev-jai-nexus/blob/e8aaa217bf4079ec2ff3b7f2389d69718c8ad92b/docs/reference/q3m7y26-p1-a6-control-coordinate-registry-v0.md
[A8]: https://github.com/jai-nexus/dev-jai-nexus/blob/e8aaa217bf4079ec2ff3b7f2389d69718c8ad92b/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md
[A15]: https://github.com/jai-nexus/dev-jai-nexus/blob/e8aaa217bf4079ec2ff3b7f2389d69718c8ad92b/docs/reference/q3m7y26-p1-a15-main-state-disposition-batch-a-closeout-v0.md
[B1]: https://github.com/jai-nexus/dev-jai-nexus/blob/e8aaa217bf4079ec2ff3b7f2389d69718c8ad92b/docs/reference/q3m7y26-p1-b1-lifecycle-vocabulary-state-machine-v0.md
[B1-SOURCE]: https://github.com/jai-nexus/dev-jai-nexus/commit/e5fe81f52675514bff391810b7d4f12b6170e94c
[B1-MERGE]: https://github.com/jai-nexus/dev-jai-nexus/commit/e8aaa217bf4079ec2ff3b7f2389d69718c8ad92b
[PR402]: https://github.com/jai-nexus/dev-jai-nexus/pull/402
[JAI-199]: https://linear.app/jai-nexus/issue/JAI-199/q3m7y26-p1b2-control-coordinates-canon
