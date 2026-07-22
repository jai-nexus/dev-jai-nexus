# Q3M7Y26-P1 A6 Control Coordinate Registry v0

Role: JAI::DEV::BUILDER

## 1. Purpose and documentary boundary

This artifact is a deterministic, evidence-classified registry for the current
`Q3M7Y26-P1` Program instance. It indexes coordinate identity separately from
planning, routing, delivery, verification, CONTROL_THREAD acceptance, evidence
credit, and execution authority.

It records exactly one Program, six Batches, twenty-four Waves, and ninety base
Lanes. Repairs, corrections, founder observations, and acceptance events are
`is_lane=false` child events and never increase the base-Lane count.

This is an instance registry only. It does not define the future universal
Control Coordinates Canon assigned to B2, the decomposition canon assigned to
B4, repository ownership, runtime behavior, or authority not already present
in a controlling source.

## 2. Control coordinates and evidence cutoff

| Field | Value |
| --- | --- |
| Program | `Q3M7Y26-P1` |
| Batch | `A — Accepted Main-State Reconciliation` |
| Wave | `A-B` |
| Lane | `A6 — Control Coordinate Registry v0` |
| Route | `CT-2026-07-22-Q3M7Y26-P1-START-A6-CONTROL-COORDINATE-REGISTRY-v0` |
| Work Packet | `Q3M7Y26-P1-A6-v0` |
| A6R1 repair route | `CT-2026-07-22-Q3M7Y26-P1-A6R1-ROUTE-PROVENANCE-COMPLETENESS-v0` |
| A6R1 Work Packet | `Q3M7Y26-P1-A6R1-v0` |
| A6 starting head | `06bf8a288d0040df124d4b139a4c9086bf6d5ed5` |
| Role | `JAI::DEV::BUILDER` |
| Repository | `jai-nexus/dev-jai-nexus` |
| Required base | `933108807587e3cdd03fb439edbc6755a7dd6b97` |
| A5 Control acceptance | `CT-2026-07-22-Q3M7Y26-P1-A5-ACCEPT-v0` |
| A5 accepted head | `79263883e2a487a2ecef1f354394f3ffa47dc0e8` |
| Evidence cutoff | `2026-07-22T19:06:43Z` |
| Evidence ceiling | `DOCUMENTATION_CONTROL_COORDINATE_REGISTRY_ONLY` |

The A5 acceptance token above is fresh CONTROL_THREAD evidence supplied by the
A6 Work Packet. The A5 squash does not independently create acceptance. The
A6R1 repair route is fresh CONTROL_THREAD evidence supplied by the A6R1 Work
Packet; it authorizes this bounded repair and does not accept A6.

## 3. Source basis and authority precedence

| Rank | Source | Reference | Classification | Use |
| --- | --- | --- | --- | --- |
| 1 | Fresh HUMAN_OPERATOR / CONTROL_THREAD decisions | Current A6 and A6R1 Work Packets | `ACCEPTED_CURRENT` | A5 acceptance, A6 route, A6R1 repair route, exact manifest, and current non-authorizations. |
| 2 | Ratified Motion and Program opening | [MOTION-DECISION], [OPENING-RECEIPT] | `ACCEPTED_CURRENT` | Program identity, state, Batch titles, naming grammar, and planning-only boundary. |
| 3 | Accepted A2 precedence | [A2] | `ACCEPTED_CURRENT` | Evidence classes, conflict rules, and relation vocabulary. |
| 4 | Accepted A4 decision registry | [A4] | `RATIFIED_PHASE_SPECIFIC` | Historical route, repair, founder, acceptance, delivery, and exception evidence through D8. |
| 5 | Accepted A5 Program registry | [A5], current A6 Work Packet | `ACCEPTED_CURRENT` | One-active Program state and frozen successors; A5 artifact cutoff remains historical. |
| 6 | Immutable commit and blob evidence | [MAIN] and SHA-pinned blobs or commits in [MOTION-DECISION], [OPENING-RECEIPT], [A1], [A2], [A4], [A5], [ROLES], [ROLEMAP], [TAXONOMY], and [TAXONOMY-TEST] | `STATIC_CONFIGURATION` | Exact source and repository-delivery evidence at the pinned SHA; immutability does not create Control authority. |
| 7 | Mutable GitHub PR metadata | [PR386], [PR387], [PR390], [PR391] | `MIRROR_ONLY` | Live PR bodies, metadata, comments, and check summaries corroborate delivery only and are not immutable. |
| 8 | Running-observed evidence | Founder observations indexed by [A4] | `RATIFIED_PHASE_SPECIFIC` | Limited to each named observation ceiling. |
| 9 | Repository role/taxonomy configuration | [ROLES], [ROLEMAP], [TAXONOMY], [TAXONOMY-TEST] | `STATIC_CONFIGURATION` | Portable role interfaces and legacy display metadata; no current coordinate authority. |
| 10 | Linear Program plan and A6 issue | [LINEAR-PROGRAM], [LINEAR-A6] | `MIRROR_ONLY` | Lane IDs, titles, raw Wave labels, and current coordination posture only. |

The exact Lane manifest is a CONTROL_THREAD-supplied snapshot of the
`MIRROR_ONLY` Program plan. It is preserved without promoting Linear status,
repository metadata, or static source into routing or acceptance authority.

## 4. Program-scoped naming grammar

- Program: exact `Q3M7Y26-P1`.
- Batch: one of `A` through `F`.
- Wave: `<Batch>-<Letter>`.
- Lane: `<Batch><Positive Sequential Number>`.
- Full Lane coordinate: `Q3M7Y26-P1:<Lane>`.
- Tuple fields remain separate even when the full coordinate is displayed.
- Bare identifiers such as `A6` are not globally unique; full Program qualification resolves collision.
- Historical route tokens are opaque evidence strings and are never rewritten to fit one grammar.
- One route token may bind multiple subjects through the junction registry.

## 5. Registry schema and deterministic ordering

Program, Batch, Wave, Lane, route, junction, child-event, and exception IDs in
this file are artifact-local validation keys. They are not canonical route
tokens. Ordering is Program, then Batch `A` through `F`, then Wave `A` through
`D`, then numeric Lane order. Core and boundary rows join only by exact
`lane_registry_id`.

Lane core fields preserve the supplied coordinate identity and mirror
provenance. Lane boundary fields independently record route, role, repository,
mode, delivery, verification, acceptance, credit, exception, child-event,
currentness, and non-authorization posture.

## 6. Program registry — exactly one row

<!-- A6_PROGRAM_REGISTRY_START -->
| program_registry_id | program_code | canonical_program_id | canonical_program_title | current_state | active_count_contribution | standing_execution_authority | source | classification | current_disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A6-P-001` | `Q3M7Y26-P1` | `jai-governance-intelligence-main-state-operating-loop-v0` | Q3M7Y26 JAI Governance Intelligence — Main-State Reconciliation and Minimum Viable Operating Loop v0 | `OPEN_FOR_BATCH_PLANNING_ONLY` | `1` | `NOT_GRANTED` | [OPENING-RECEIPT], [A5], current A6 Work Packet | `ACCEPTED_CURRENT` | Sole recognized active Program; Programs 2–4 remain downstream frozen. |

<!-- A6_PROGRAM_REGISTRY_END -->

## 7. Batch registry — exactly six rows

<!-- A6_BATCH_REGISTRY_START -->
| batch_registry_id | batch_code | exact_batch_title | program_code | wave_count | base_lane_count | planning_posture | execution_authority | exit_credit | source | classification | currentness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A6-B-A` | `A` | Accepted Main-State Reconciliation | `Q3M7Y26-P1` | `4` | `15` | `PLANNING_AUTHORIZED / A1-A6 ROUTE HISTORY` | `NOT_GRANTED` | `NONE` | [OPENING-RECEIPT], current A6 Work Packet, [LINEAR-PROGRAM] | `ACCEPTED_CURRENT` | A6 routed; Batch A exit credit NONE |
| `A6-B-B` | `B` | Program Lifecycle and Receipt Canon | `Q3M7Y26-P1` | `4` | `15` | `PROPOSED / UNROUTED` | `NOT_GRANTED` | `NONE` | [OPENING-RECEIPT], current A6 Work Packet, [LINEAR-PROGRAM] | `MIRROR_ONLY` | No Batch route or execution authority |
| `A6-B-C` | `C` | One-Active-Program Enforcement | `Q3M7Y26-P1` | `4` | `15` | `PROPOSED / UNROUTED` | `NOT_GRANTED` | `NONE` | [OPENING-RECEIPT], current A6 Work Packet, [LINEAR-PROGRAM] | `MIRROR_ONLY` | No Batch route or execution authority |
| `A6-B-D` | `D` | Minimum Viable Operating Loop | `Q3M7Y26-P1` | `4` | `15` | `PROPOSED / D1-D8 CLOSED PHASE-BOUNDED EXCEPTION HISTORY` | `NOT_GRANTED` | `NONE` | [OPENING-RECEIPT] (title); [A4] and `A6-EXC-001` (closed exception); current A6/A6R1 Work Packets and [LINEAR-PROGRAM] (planning posture) | `RATIFIED_PHASE_SPECIFIC` (closed exception) / `MIRROR_ONLY` (current planning posture) | Closed through D8; closure token `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE`; no continuing D9 or Batch D authority; exit credit NONE |
| `A6-B-E` | `E` | Negative Cases and Rollback Validation | `Q3M7Y26-P1` | `4` | `15` | `PROPOSED / UNROUTED` | `NOT_GRANTED` | `NONE` | [OPENING-RECEIPT], current A6 Work Packet, [LINEAR-PROGRAM] | `MIRROR_ONLY` | No Batch route or execution authority |
| `A6-B-F` | `F` | Evidence and Program Closeout | `Q3M7Y26-P1` | `4` | `15` | `PROPOSED / UNROUTED` | `NOT_GRANTED` | `NONE` | [OPENING-RECEIPT], current A6 Work Packet, [LINEAR-PROGRAM] | `MIRROR_ONLY` | No Batch route or execution authority |

<!-- A6_BATCH_REGISTRY_END -->

The word “Accepted” in the Batch A title is a name. It creates no Batch acceptance or exit credit.

## 8. Wave registry — exactly twenty-four rows

<!-- A6_WAVE_REGISTRY_START -->
| wave_registry_id | program_code | batch_code | batch_title | normalized_wave_code | lane_range | lane_count | raw_wave_labels | mapping_rule | source | classification | route_effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A6-W-A-A` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-A` | `A1–A4` | `4` | A-A | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-A-B` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-B` | `A5–A8` | `4` | A-B | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-A-C` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-C` | `A9–A12` | `4` | A-C | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-A-D` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-D` | `A13–A15` | `3` | A-D | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-B-A` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-A` | `B1–B4` | `4` | B-A | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-B-B` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-B` | `B5–B8` | `4` | B-B | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-B-C` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-C` | `B9–B12` | `4` | B-C | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-B-D` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-D` | `B13–B15` | `3` | B-D | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-C-A` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-A` | `C1–C4` | `4` | C-A | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-C-B` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-B` | `C5–C8` | `4` | C-B | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-C-C` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-C` | `C9–C12` | `4` | C-C | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-C-D` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-D` | `C13–C15` | `3` | C-D | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-D-A` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-A` | `D1–D2` | `2` | D-A | `NONUNIFORM_BATCH_D_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-D-B` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-B` | `D3–D8` | `6` | D-B; D-B — Founder Usability and Recovery; D-B — Founder Comprehension; D-B — Founder Comprehension and Deliberate Decisions | `NONUNIFORM_BATCH_D_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-D-C` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-C` | `D9–D13` | `5` | D-C | `NONUNIFORM_BATCH_D_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-D-D` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-D` | `D14–D15` | `2` | D-D | `NONUNIFORM_BATCH_D_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-E-A` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-A` | `E1–E4` | `4` | E-A | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-E-B` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-B` | `E5–E8` | `4` | E-B | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-E-C` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-C` | `E9–E12` | `4` | E-C | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-E-D` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-D` | `E13–E15` | `3` | E-D | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-F-A` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-A` | `F1–F4` | `4` | F-A | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-F-B` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-B` | `F5–F8` | `4` | F-B | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-F-C` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-C` | `F9–F12` | `4` | F-C | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |
| `A6-W-F-D` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-D` | `F13–F15` | `3` | F-D | `STANDARD_4_4_4_3_MAP` | Current A6 Work Packet manifest; [LINEAR-PROGRAM] | `MIRROR_ONLY` | Grouping only; no inherited route, role, acceptance, credit, or execution authority. |

<!-- A6_WAVE_REGISTRY_END -->

Batch D remains nonuniform: `D-A` D1–D2; `D-B` D3–D8; `D-C` D9–D13; `D-D` D14–D15. D4–D7 retain their descriptive raw Wave labels above.

## 9. Lane core registry — exactly ninety rows

<!-- A6_LANE_CORE_START -->
| lane_registry_id | program_code | batch_code | exact_batch_title | normalized_wave_code | raw_wave_label_or_mirror_provenance | lane_code | full_program_qualified_lane_coordinate | lane_title | linear_issue_identifier | coordinate_basis_source | source_classification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A6-L-A1` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-A` | A-A | `A1` | `Q3M7Y26-P1:A1` | Accepted Documentation Baseline | `JAI-183` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A2` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-A` | A-A | `A2` | `Q3M7Y26-P1:A2` | Authority and Evidence Precedence | `JAI-186` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A3` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-A` | A-A | `A3` | `Q3M7Y26-P1:A3` | Canonical Repository and Main Snapshot | `JAI-184` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A4` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-A` | A-A | `A4` | `Q3M7Y26-P1:A4` | Ratified Motion and Decision Registry | `JAI-187` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A5` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-B` | A-B | `A5` | `Q3M7Y26-P1:A5` | Active and Frozen Program Registry | `JAI-185` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A6` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-B` | A-B | `A6` | `Q3M7Y26-P1:A6` | Control Coordinate Registry | `JAI-188` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A7` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-B` | A-B | `A7` | `Q3M7Y26-P1:A7` | PR and Commit Evidence Ledger | `JAI-190` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A8` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-B` | A-B | `A8` | `Q3M7Y26-P1:A8` | Governance Role and Route Reconciliation | `JAI-189` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A9` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-C` | A-C | `A9` | `Q3M7Y26-P1:A9` | Runnable Capability Inventory | `JAI-191` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A10` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-C` | A-C | `A10` | `Q3M7Y26-P1:A10` | Founder Workflow and Surface Map | `JAI-192` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A11` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-C` | A-C | `A11` | `Q3M7Y26-P1:A11` | Dependency and External-Effect Map | `JAI-193` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A12` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-C` | A-C | `A12` | `Q3M7Y26-P1:A12` | Linear Drift and Duplication Audit | `JAI-194` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A13` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-D` | A-D | `A13` | `Q3M7Y26-P1:A13` | Gap, Risk, and Blocker Register | `JAI-195` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A14` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-D` | A-D | `A14` | `Q3M7Y26-P1:A14` | Main-State Capsule and Independent Review | `JAI-196` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-A15` | `Q3M7Y26-P1` | `A` | Accepted Main-State Reconciliation | `A-D` | A-D | `A15` | `Q3M7Y26-P1:A15` | Main-State Disposition and Batch A Closeout | `JAI-197` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B1` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-A` | B-A | `B1` | `Q3M7Y26-P1:B1` | Lifecycle Vocabulary and State Machine | `JAI-198` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B2` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-A` | B-A | `B2` | `Q3M7Y26-P1:B2` | Control Coordinates Canon | `JAI-199` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B3` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-A` | B-A | `B3` | `Q3M7Y26-P1:B3` | Program Charter Schema | `JAI-200` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B4` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-A` | B-A | `B4` | `Q3M7Y26-P1:B4` | Batch, Wave, and Lane Decomposition Canon | `JAI-201` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B5` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-B` | B-B | `B5` | `Q3M7Y26-P1:B5` | Role and Authority Matrix | `JAI-202` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B6` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-B` | B-B | `B6` | `Q3M7Y26-P1:B6` | Work Packet Canon | `JAI-203` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B7` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-B` | B-B | `B7` | `Q3M7Y26-P1:B7` | Decision Token and Disposition Canon | `JAI-206` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B8` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-B` | B-B | `B8` | `Q3M7Y26-P1:B8` | Evidence Bundle Schema | `JAI-205` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B9` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-C` | B-C | `B9` | `Q3M7Y26-P1:B9` | Receipt Taxonomy | `JAI-204` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B10` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-C` | B-C | `B10` | `Q3M7Y26-P1:B10` | Acceptance Receipt and Integrity Schema | `JAI-207` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B11` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-C` | B-C | `B11` | `Q3M7Y26-P1:B11` | Capability and Credit Ledger | `JAI-208` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B12` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-C` | B-C | `B12` | `Q3M7Y26-P1:B12` | Exception and Out-of-Sequence Work Canon | `JAI-211` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B13` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-D` | B-D | `B13` | `Q3M7Y26-P1:B13` | Rollback, Reopen, and Supersession Canon | `JAI-209` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B14` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-D` | B-D | `B14` | `Q3M7Y26-P1:B14` | GitHub–Linear Mirror Protocol | `JAI-210` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-B15` | `Q3M7Y26-P1` | `B` | Program Lifecycle and Receipt Canon | `B-D` | B-D | `B15` | `Q3M7Y26-P1:B15` | Lifecycle Canon Verification and Batch B Closeout | `JAI-212` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C1` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-A` | C-A | `C1` | `Q3M7Y26-P1:C1` | One-Active-Program Invariant Contract v0 | `JAI-213` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C2` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-A` | C-A | `C2` | `Q3M7Y26-P1:C2` | Canonical Active-Program Resolver v0 | `JAI-214` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C3` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-A` | C-A | `C3` | `Q3M7Y26-P1:C3` | Program State Transition Matrix v0 | `JAI-216` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C4` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-A` | C-A | `C4` | `Q3M7Y26-P1:C4` | Activation Eligibility Gate v0 | `JAI-215` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C5` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-B` | C-B | `C5` | `Q3M7Y26-P1:C5` | Server-Derived Activation Authority v0 | `JAI-217` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C6` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-B` | C-B | `C6` | `Q3M7Y26-P1:C6` | Atomic Activation and Supersession v0 | `JAI-218` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C7` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-B` | C-B | `C7` | `Q3M7Y26-P1:C7` | Stale-State and Concurrency Guard v0 | `JAI-219` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C8` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-B` | C-B | `C8` | `Q3M7Y26-P1:C8` | Idempotency and Transition Receipt v0 | `JAI-222` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C9` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-C` | C-C | `C9` | `Q3M7Y26-P1:C9` | Program Binding Propagation v0 | `JAI-220` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C10` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-C` | C-C | `C10` | `Q3M7Y26-P1:C10` | Downstream Active-Program Guard v0 | `JAI-221` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C11` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-C` | C-C | `C11` | `Q3M7Y26-P1:C11` | Frozen-Program Protection v0 | `JAI-223` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C12` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-C` | C-C | `C12` | `Q3M7Y26-P1:C12` | Founder Active-Program Control Surface v0 | `JAI-224` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C13` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-D` | C-D | `C13` | `Q3M7Y26-P1:C13` | Legacy Bypass Inventory and Closure v0 | `JAI-225` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C14` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-D` | C-D | `C14` | `Q3M7Y26-P1:C14` | Reconciliation, Fault Recovery, and Rollback v0 | `JAI-226` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-C15` | `Q3M7Y26-P1` | `C` | One-Active-Program Enforcement | `C-D` | C-D | `C15` | `Q3M7Y26-P1:C15` | Independent Verification and Batch C Exit Evidence v0 | `JAI-227` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D1` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-A` | D-A | `D1` | `Q3M7Y26-P1:D1` | Control-Plane Behavioral CI Enablement v0 | `JAI-228` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D2` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-A` | D-A | `D2` | `Q3M7Y26-P1:D2` | Founder Local Operating Loop Proving Seam v0 | `JAI-229` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D3` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-B` | D-B | `D3` | `Q3M7Y26-P1:D3` | Founder Walkthrough and UX Findings Baseline v0 | `JAI-230` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D4` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-B` | D-B — Founder Usability and Recovery | `D4` | `Q3M7Y26-P1:D4` | Intake Guidance and Error Recovery v0 | `JAI-232` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D5` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-B` | D-B — Founder Usability and Recovery | `D5` | `Q3M7Y26-P1:D5` | Session Expiry and Stale-Response Recovery v0 | `JAI-231` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D6` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-B` | D-B — Founder Comprehension | `D6` | `Q3M7Y26-P1:D6` | Explainable Recommendation and Remediation v0 | `JAI-236` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D7` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-B` | D-B — Founder Comprehension and Deliberate Decisions | `D7` | `Q3M7Y26-P1:D7` | Decision Confirmation and Authority Clarity v0 | `JAI-233` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D8` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-B` | D-B | `D8` | `Q3M7Y26-P1:D8` | Work Packet Preview and Deterministic Export v0 | `JAI-234` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D9` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-C` | D-C | `D9` | `Q3M7Y26-P1:D9` | Batch B Lifecycle Contract Adapter v0 | `JAI-237` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D10` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-C` | D-C | `D10` | `Q3M7Y26-P1:D10` | One-Active-Program Guard Integration v0 | `JAI-235` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D11` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-C` | D-C | `D11` | `Q3M7Y26-P1:D11` | Durable Decision and Receipt Recording v0 | `JAI-238` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D12` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-C` | D-C | `D12` | `Q3M7Y26-P1:D12` | Founder Resume, History, and Reconciliation v0 | `JAI-239` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D13` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-C` | D-C | `D13` | `Q3M7Y26-P1:D13` | Failure Recovery and Idempotent Retry v0 | `JAI-240` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D14` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-D` | D-D | `D14` | `Q3M7Y26-P1:D14` | Founder-Only dev.jai.nexus Acceptance Pilot v0 | `JAI-241` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-D15` | `Q3M7Y26-P1` | `D` | Minimum Viable Operating Loop | `D-D` | D-D | `D15` | `Q3M7Y26-P1:D15` | Independent Verification and Batch D Exit Evidence v0 | `JAI-242` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E1` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-A` | E-A | `E1` | `Q3M7Y26-P1:E1` | Negative-Case Charter and Invariant Matrix | `JAI-243` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E2` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-A` | E-A | `E2` | `Q3M7Y26-P1:E2` | Authentication and ADMIN Boundary Failures | `JAI-244` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E3` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-A` | E-A | `E3` | `Q3M7Y26-P1:E3` | Input Canonicalization and Authority-Injection Rejection | `JAI-247` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E4` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-A` | E-A | `E4` | `Q3M7Y26-P1:E4` | Invalid Transition and Direct-Decision Denial | `JAI-245` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E5` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-B` | E-B | `E5` | `Q3M7Y26-P1:E5` | Proof Tamper, Staleness, and Cross-Actor Rejection | `JAI-246` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E6` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-B` | E-B | `E6` | `Q3M7Y26-P1:E6` | Recommendation and Decision Containment | `JAI-248` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E7` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-B` | E-B | `E7` | `Q3M7Y26-P1:E7` | One-Active-Program Collision and Race Cases | `JAI-249` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E8` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-B` | E-B | `E8` | `Q3M7Y26-P1:E8` | Receipt Authority, Forgery, and Replay Containment | `JAI-252` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E9` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-C` | E-C | `E9` | `Q3M7Y26-P1:E9` | Main-State Drift and Base-SHA Invalidation | `JAI-250` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E10` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-C` | E-C | `E10` | `Q3M7Y26-P1:E10` | Concurrency, Retry, and Deterministic Replay | `JAI-251` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E11` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-C` | E-C | `E11` | `Q3M7Y26-P1:E11` | External-Effect and Dependency Isolation | `JAI-255` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E12` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-C` | E-C | `E12` | `Q3M7Y26-P1:E12` | CI Fail-Closed and Test-Discovery Mutation Cases | `JAI-254` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E13` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-D` | E-D | `E13` | `Q3M7Y26-P1:E13` | Rollback Triggers and Recovery Runbook | `JAI-253` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E14` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-D` | E-D | `E14` | `Q3M7Y26-P1:E14` | Isolated Rollback Rehearsal and Restoration | `JAI-256` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-E15` | `Q3M7Y26-P1` | `E` | Negative Cases and Rollback Validation | `E-D` | E-D | `E15` | `Q3M7Y26-P1:E15` | Independent Adversarial Gate and Batch E Disposition | `JAI-257` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F1` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-A` | F-A | `F1` | `Q3M7Y26-P1:F1` | Closeout Schema and Authority Precedence | `JAI-258` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F2` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-A` | F-A | `F2` | `Q3M7Y26-P1:F2` | Authoritative Artifact Inventory | `JAI-260` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F3` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-A` | F-A | `F3` | `Q3M7Y26-P1:F3` | Control Coordinates and Lane Registry | `JAI-259` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F4` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-A` | F-A | `F4` | `Q3M7Y26-P1:F4` | Batch A Provenance Audit | `JAI-261` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F5` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-B` | F-B | `F5` | `Q3M7Y26-P1:F5` | Batch B Provenance Audit | `JAI-262` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F6` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-B` | F-B | `F6` | `Q3M7Y26-P1:F6` | Batch C Provenance Audit | `JAI-263` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F7` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-B` | F-B | `F7` | `Q3M7Y26-P1:F7` | Batch D Provenance Audit | `JAI-265` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F8` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-B` | F-B | `F8` | `Q3M7Y26-P1:F8` | Batch E Provenance Audit | `JAI-264` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F9` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-C` | F-C | `F9` | `Q3M7Y26-P1:F9` | Motion-to-Evidence Traceability | `JAI-267` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F10` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-C` | F-C | `F10` | `Q3M7Y26-P1:F10` | Security, Authority, and External-Effect Attestation | `JAI-266` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F11` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-C` | F-C | `F11` | `Q3M7Y26-P1:F11` | Founder Workflow Acceptance Observation | `JAI-268` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F12` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-C` | F-C | `F12` | `Q3M7Y26-P1:F12` | Operability and Rollback Readiness Attestation | `JAI-269` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F13` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-D` | F-D | `F13` | `Q3M7Y26-P1:F13` | Residual Risk, Debt, and Adaptation Register | `JAI-270` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F14` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-D` | F-D | `F14` | `Q3M7Y26-P1:F14` | Program Closeout Dossier and Recommendation | `JAI-271` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |
| `A6-L-F15` | `Q3M7Y26-P1` | `F` | Evidence and Program Closeout | `F-D` | F-D | `F15` | `Q3M7Y26-P1:F15` | Human Disposition, Archive, and Mirror Synchronization | `JAI-272` | Current A6 Work Packet exact manifest; [LINEAR-PROGRAM] mirror corroboration | `MIRROR_ONLY` |

<!-- A6_LANE_CORE_END -->

## 10. Lane boundary and status registry — exactly ninety joined rows

<!-- A6_LANE_BOUNDARY_START -->
| lane_registry_id | route_posture | assigned_delivery_role_or_unrouted | role_provenance | repository_coordinate_or_unresolved | mode | delivery_posture | verification_posture | acceptance_posture | evidence_ceiling_or_credit | exception_id_or_none | repair_child_event_count | currentness_posture | explicit_non_authorizations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A6-L-A1` | `ROUTED_HISTORICAL` | `JAI::DEV::BUILDER` | [A1], [A4] | `jai-nexus/dev-jai-nexus` | `DOCUMENTARY_PLANNING` | `MERGED` | `REVIEWED_DOCUMENTARY` | `ACCEPTED_BOUNDED` | `ACCEPTED_DOCUMENTATION_ONLY` | `NONE` | `2` | `ACCEPTED_CURRENT` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A2` | `ROUTED_HISTORICAL` | `JAI::DEV::BUILDER` | [A4] | `jai-nexus/dev-jai-nexus` | `DOCUMENTARY_PRECEDENCE_CANON` | `MERGED` | `REVIEWED_DOCUMENTARY` | `ACCEPTED_BOUNDED` | `ACCEPTED_DOCUMENTARY_AUTHORITY_EVIDENCE_CANON_ONLY` | `NONE` | `1` | `ACCEPTED_CURRENT` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A3` | `ROUTED_HISTORICAL` | `JAI::DEV::VERIFIER` | Current A6 Work Packet; [A4] | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `READ_ONLY_RECONCILIATION` | `RESPONSE_ONLY_EVIDENCE` | `NORMALIZED_EVIDENCE_RETURNED` | `ACCEPTED_BOUNDED` | `RECONCILIATION_EVIDENCE_ONLY` | `NONE` | `1` | `ACCEPTED_CURRENT` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A4` | `ROUTED_HISTORICAL` | `JAI::DEV::BUILDER` | [A4], [PR390] | `jai-nexus/dev-jai-nexus` | `DOCUMENTARY_REGISTRY` | `MERGED` | `INDEPENDENTLY_VERIFIED` | `ACCEPTED_BOUNDED` | `DOCUMENTATION_REGISTRY_ONLY` | `NONE` | `3` | `ACCEPTED_CURRENT` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A5` | `ROUTED_HISTORICAL` | `JAI::DEV::BUILDER` | Current A6 Work Packet; [PR391] | `jai-nexus/dev-jai-nexus` | `DOCUMENTARY_PROGRAM_STATE_REGISTRY` | `MERGED` | `INDEPENDENTLY_VERIFIED` | `ACCEPTED_BOUNDED` | `DOCUMENTATION_PROGRAM_STATE_REGISTRY_ONLY` | `NONE` | `2` | `ACCEPTED_CURRENT` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A6` | `ROUTED_CURRENT` | `JAI::DEV::BUILDER` | Current A6 Work Packet | `jai-nexus/dev-jai-nexus` | `DOCUMENTARY / ONE_PATH / DRAFT_PR_ONLY` | `DRAFT_PR_DELIVERY_IN_PROGRESS` | `PENDING_INDEPENDENT_VERIFICATION` | `NOT_ACCEPTED` | `DOCUMENTATION_CONTROL_COORDINATE_REGISTRY_ONLY` | `NONE` | `0` | `ACCEPTED_CURRENT_ROUTE_ONLY` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A7` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A8` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A9` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A10` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A11` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A12` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A13` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A14` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-A15` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B1` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B2` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B3` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B4` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B5` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B6` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B7` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B8` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B9` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B10` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B11` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B12` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B13` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B14` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-B15` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C1` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C2` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C3` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C4` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C5` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C6` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C7` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C8` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C9` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C10` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C11` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C12` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C13` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C14` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-C15` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D1` | `EXCEPTION_BOUND / TOKEN_UNAVAILABLE` | `JAI::DEV::VERIFIER` | [A4] | `jai-nexus/dev-jai-nexus` | `CI_PREREQUISITE_ONLY` | `MERGED` | `MERGED_VERIFIED` | `UNAVAILABLE` | `CI_PREREQUISITE_ONLY` | `A6-EXC-001` | `0` | `STATIC_CONFIGURATION` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D2` | `EXCEPTION_BOUND / TOKEN_UNAVAILABLE` | `JAI::DEV::BUILDER` | [A4] | `jai-nexus/dev-jai-nexus` | `LOCAL_SHADOW_PROVING_SEAM` | `MERGED` | `MERGED_VERIFIED` | `UNAVAILABLE` | `TESTED_LOCAL_SHADOW_PROVING_SEAM_ONLY` | `A6-EXC-001` | `0` | `STATIC_CONFIGURATION` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D3` | `ROUTED_HISTORICAL` | `UNAVAILABLE_IN_CONTROLLING_SOURCE` | [A4]; no portable JAI::DEV delivery-role assignment located | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `FOUNDER_OBSERVATION / SURFACE_EVIDENCE_ONLY` | `RESPONSE_ONLY_EVIDENCE` | `RUNNING_OBSERVED` | `ACCEPTED_BOUNDED` | `FOUNDER_OBSERVATION_EVIDENCE_ONLY` | `A6-EXC-001` | `2` | `ACCEPTED_CURRENT_AT_BOUNDED_CEILING` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D4` | `EXCEPTION_BOUND / TOKEN_UNAVAILABLE` | `JAI::DEV::BUILDER` | [A4] | `jai-nexus/dev-jai-nexus` | `BOUNDED_UI_STATE_CONTRACT` | `MERGED` | `MERGED_VERIFIED` | `ACCEPTED_BOUNDED` | `TESTED_MODEL_PLUS_STATIC_UI_ONLY` | `A6-EXC-001` | `1` | `ACCEPTED_CURRENT_AT_BOUNDED_CEILING` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D5` | `EXCEPTION_BOUND / TOKEN_UNAVAILABLE` | `JAI::DEV::BUILDER` | [A4], [PR386] | `jai-nexus/dev-jai-nexus` | `CLIENT_RECOVERY_CONTRACT` | `MERGED` | `MERGED_VERIFIED_FOUNDER_OBSERVED` | `TOKEN_UNAVAILABLE / NO_ACCEPTANCE_INFERRED` | `TESTED_CLIENT_RECOVERY_CONTRACT_ONLY` | `A6-EXC-001` | `4` | `STATIC_CONFIGURATION_PLUS_MIRROR_OBSERVATION` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D6` | `ROUTED_HISTORICAL` | `JAI::DEV::BUILDER` | [A4], [PR387] | `jai-nexus/dev-jai-nexus` | `EXPLAINABLE_RECOMMENDATION` | `MERGED` | `MERGED_VERIFIED_FOUNDER_ACCEPTED` | `ACCEPTED_BOUNDED` | `TESTED_DETERMINISTIC_EXPLANATION_PLUS_RUNNING_OBSERVED_UI_ONLY` | `A6-EXC-001` | `5` | `ACCEPTED_CURRENT_AT_BOUNDED_CEILING` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D7` | `ROUTED_HISTORICAL` | `JAI::DEV::BUILDER` | [A4] | `jai-nexus/dev-jai-nexus` | `DECISION_CONFIRMATION` | `MERGED` | `MERGED_VERIFIED_FOUNDER_ACCEPTED` | `ACCEPTED_BOUNDED` | `TESTED_DECISION_CONFIRMATION_PLUS_RUNNING_OBSERVED_UI_ONLY` | `A6-EXC-001` | `3` | `ACCEPTED_CURRENT_AT_BOUNDED_CEILING` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D8` | `ROUTED_HISTORICAL` | `JAI::DEV::BUILDER` | [A4] | `jai-nexus/dev-jai-nexus` | `WORK_PACKET_PREVIEW_AND_EXPORT` | `MERGED` | `MERGED_VERIFIED_FOUNDER_ACCEPTED` | `ACCEPTED_BOUNDED` | `TESTED_RECEIPT_PLUS_RUNNING_OBSERVED_UI` | `A6-EXC-001` | `5` | `ACCEPTED_CURRENT_AT_BOUNDED_CEILING` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D9` | `HELD_PENDING_ACCEPTED_BATCH_B` | `UNROUTED` | Current A6 Work Packet | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / HELD` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `HELD` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D10` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D11` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D12` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D13` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D14` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-D15` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E1` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E2` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E3` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E4` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E5` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E6` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E7` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E8` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E9` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E10` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E11` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E12` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E13` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E14` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-E15` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F1` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F2` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F3` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F4` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F5` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F6` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F7` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F8` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F9` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F10` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F11` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F12` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F13` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F14` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |
| `A6-L-F15` | `UNROUTED` | `UNROUTED` | Current A6 Work Packet mirror snapshot | `UNRESOLVED_PENDING_CONTROL_ROUTE` | `PROPOSED / MIRROR_ONLY` | `NOT_DELIVERED` | `NOT_VERIFIED` | `NOT_ACCEPTED` | `NONE` | `NONE` | `0` | `PROPOSED_UNROUTED` | No inferred role, repository ownership, route, acceptance, credit, execution, Batch exit, Program exit, or JAI activation. |

<!-- A6_LANE_BOUNDARY_END -->

No planned Lane receives inferred role, repository ownership, route, delivery, verification, acceptance, evidence credit, or execution authority.

The D3 observation actor remains `HUMAN_OPERATOR` in `A6-CE-D3-01`. Any
Linear role or repository value for D3 is `MIRROR_ONLY` and grants neither a
portable delivery role nor repository ownership.

## 11. Route-token registry

<!-- A6_ROUTE_REGISTRY_START -->
| route_registry_id | exact_opaque_route_token | issuer | source_pointer | evidence_classification | bounded_scope | non_authorizations |
| --- | --- | --- | --- | --- | --- | --- |
| `A6-R-001` | `AUTHORIZE_ROUTE_PROGRAM_1_BATCH_A_WAVE_A_A_LANE_A1_PLANNING` | HUMAN_OPERATOR / CONTROL_THREAD | [A1] | `RATIFIED_PHASE_SPECIFIC` | A1 planning route only | No acceptance, credit, execution, Batch exit, Program exit, or activation by route alone. |
| `A6-R-002` | `CT-2026-07-19-Q3M7Y26-P1-START-A2-A3-D3-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A2], [A4] | `RATIFIED_PHASE_SPECIFIC` | One opaque route binding A2, A3, and D3 | No acceptance, credit, execution, Batch exit, Program exit, or activation by route alone. |
| `A6-R-003` | `CT-2026-07-22-Q3M7Y26-P1-START-A4-MOTION-DECISION-REGISTRY-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4], [LINEAR-PROGRAM] | `RATIFIED_PHASE_SPECIFIC` | A4 documentary delivery | No acceptance, credit, execution, Batch exit, Program exit, or activation by route alone. |
| `A6-R-004` | `CT-2026-07-22-Q3M7Y26-P1-START-A5-ACTIVE-FROZEN-PROGRAM-REGISTRY-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A5], [LINEAR-PROGRAM] | `RATIFIED_PHASE_SPECIFIC` | A5 documentary delivery | No acceptance, credit, execution, Batch exit, Program exit, or activation by route alone. |
| `A6-R-005` | `CT-2026-07-22-Q3M7Y26-P1-START-A6-CONTROL-COORDINATE-REGISTRY-v0` | HUMAN_OPERATOR / CONTROL_THREAD | Current A6 Work Packet; [LINEAR-A6] | `ACCEPTED_CURRENT` | A6 one-path Draft PR delivery only | No acceptance, credit, execution, Batch exit, Program exit, or activation by route alone. |
| `A6-R-006` | `CT-2026-07-21-Q3M7Y26-P1-START-D6-EXPLAINABLE-RECOMMENDATION-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4], [PR387] | `RATIFIED_PHASE_SPECIFIC` | D6 bounded proving work | No acceptance, credit, execution, Batch exit, Program exit, or activation by route alone. |
| `A6-R-007` | `CT-2026-07-21-Q3M7Y26-P1-START-D7-DECISION-CONFIRMATION-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4] | `RATIFIED_PHASE_SPECIFIC` | D7 bounded proving work | No acceptance, credit, execution, Batch exit, Program exit, or activation by route alone. |
| `A6-R-008` | `CT-2026-07-22-Q3M7Y26-P1-START-D8-WORK-PACKET-EXPORT-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4] | `RATIFIED_PHASE_SPECIFIC` | D8 bounded proving work | No acceptance, credit, execution, Batch exit, Program exit, or activation by route alone. |
| `A6-R-009` | `CT-2026-07-22-Q3M7Y26-P1-A4R1-STATUS-PROVENANCE-CHRONOLOGY-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4] | `RATIFIED_PHASE_SPECIFIC` | A4R1 repair route; parent `Q3M7Y26-P1:A4`; child `A6-CE-A4-01` | No new Lane, acceptance, credit, execution, Batch exit, Program exit, or activation. |
| `A6-R-010` | `CT-2026-07-22-Q3M7Y26-P1-A4R2-TOKEN-FIELD-NORMALIZATION-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [PR390] | `MIRROR_ONLY` | A4R2 repair route; parent `Q3M7Y26-P1:A4`; child `A6-CE-A4-02` | No new Lane, acceptance, credit, execution, Batch exit, Program exit, or activation. |
| `A6-R-011` | `CT-2026-07-22-Q3M7Y26-P1-A5R1-SUCCESSOR-NAMING-PROVENANCE-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [PR391] | `MIRROR_ONLY` | A5R1 repair route; parent `Q3M7Y26-P1:A5`; child `A6-CE-A5-01` | No new Lane, acceptance, credit, execution, Batch exit, Program exit, or activation. |
| `A6-R-012` | `CT-2026-07-21-Q3M7Y26-P1-D6R1-EXPLANATION-COHERENCE-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4], [PR387] | `RATIFIED_PHASE_SPECIFIC` | D6R1 repair route; parent `Q3M7Y26-P1:D6`; child `A6-CE-D6-01` | No new Lane, acceptance, credit, execution, Batch exit, Program exit, or activation. |
| `A6-R-013` | `CT-2026-07-21-Q3M7Y26-P1-D6R2-DISPLAY-CONTAINMENT-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4], [PR387] | `RATIFIED_PHASE_SPECIFIC` | D6R2 repair route; parent `Q3M7Y26-P1:D6`; child `A6-CE-D6-03` | No new Lane, acceptance, credit, execution, Batch exit, Program exit, or activation. |
| `A6-R-014` | `CT-2026-07-21-Q3M7Y26-P1-D7R1-MALFORMED-CONFIRMATION-FAIL-CLOSED-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4] | `RATIFIED_PHASE_SPECIFIC` | D7R1 repair route; parent `Q3M7Y26-P1:D7`; child `A6-CE-D7-01` | No new Lane, acceptance, credit, execution, Batch exit, Program exit, or activation. |
| `A6-R-015` | `CT-2026-07-22-Q3M7Y26-P1-D8R1-DESCRIPTOR-SNAPSHOT-FAIL-CLOSED-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4] | `RATIFIED_PHASE_SPECIFIC` | D8R1 repair route; parent `Q3M7Y26-P1:D8`; child `A6-CE-D8-01` | No new Lane, acceptance, credit, execution, Batch exit, Program exit, or activation. |
| `A6-R-016` | `CT-2026-07-22-Q3M7Y26-P1-D8R2-CLIPBOARD-FOCUS-RETENTION-v0` | HUMAN_OPERATOR / CONTROL_THREAD | [A4] | `RATIFIED_PHASE_SPECIFIC` | D8R2 repair route; parent `Q3M7Y26-P1:D8`; child `A6-CE-D8-03` | No new Lane, acceptance, credit, execution, Batch exit, Program exit, or activation. |

<!-- A6_ROUTE_REGISTRY_END -->

This registry covers base-Lane route authorizations and authorization-bearing
`REPAIR_ROUTE` child events. Corrections, observations, acceptances, delivery,
and source-head tokens remain in the child-event registry and are not treated
as independent route authorizations. Unavailable D1, D2, D4, and D5 base-route
tokens remain in section 15 rather than being synthesized.

## 12. Route-to-coordinate junction registry

<!-- A6_ROUTE_JUNCTION_START -->
| junction_registry_id | route_registry_id | full_subject_coordinate | child_event_id_or_none | relationship | source_classification |
| --- | --- | --- | --- | --- | --- |
| `A6-RJ-001` | `A6-R-001` | `Q3M7Y26-P1:A1` | `NONE` | `routes` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-002` | `A6-R-002` | `Q3M7Y26-P1:A2` | `NONE` | `routes` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-003` | `A6-R-002` | `Q3M7Y26-P1:A3` | `NONE` | `routes` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-004` | `A6-R-002` | `Q3M7Y26-P1:D3` | `NONE` | `routes founder observation evidence` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-005` | `A6-R-003` | `Q3M7Y26-P1:A4` | `NONE` | `routes` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-006` | `A6-R-004` | `Q3M7Y26-P1:A5` | `NONE` | `routes` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-007` | `A6-R-005` | `Q3M7Y26-P1:A6` | `NONE` | `routes` | `ACCEPTED_CURRENT` |
| `A6-RJ-008` | `A6-R-006` | `Q3M7Y26-P1:D6` | `NONE` | `routes` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-009` | `A6-R-007` | `Q3M7Y26-P1:D7` | `NONE` | `routes` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-010` | `A6-R-008` | `Q3M7Y26-P1:D8` | `NONE` | `routes` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-011` | `A6-R-009` | `Q3M7Y26-P1:A4` | `A6-CE-A4-01` | `routes existing repair child; child remains is_lane=false` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-012` | `A6-R-010` | `Q3M7Y26-P1:A4` | `A6-CE-A4-02` | `routes existing repair child; child remains is_lane=false` | `MIRROR_ONLY` |
| `A6-RJ-013` | `A6-R-011` | `Q3M7Y26-P1:A5` | `A6-CE-A5-01` | `routes existing repair child; child remains is_lane=false` | `MIRROR_ONLY` |
| `A6-RJ-014` | `A6-R-012` | `Q3M7Y26-P1:D6` | `A6-CE-D6-01` | `routes existing repair child; child remains is_lane=false` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-015` | `A6-R-013` | `Q3M7Y26-P1:D6` | `A6-CE-D6-03` | `routes existing repair child; child remains is_lane=false` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-016` | `A6-R-014` | `Q3M7Y26-P1:D7` | `A6-CE-D7-01` | `routes existing repair child; child remains is_lane=false` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-017` | `A6-R-015` | `Q3M7Y26-P1:D8` | `A6-CE-D8-01` | `routes existing repair child; child remains is_lane=false` | `RATIFIED_PHASE_SPECIFIC` |
| `A6-RJ-018` | `A6-R-016` | `Q3M7Y26-P1:D8` | `A6-CE-D8-03` | `routes existing repair child; child remains is_lane=false` | `RATIFIED_PHASE_SPECIFIC` |

<!-- A6_ROUTE_JUNCTION_END -->

The combined A2/A3/D3 route is one route record with three explicit junctions.
Each repair-route junction binds one existing parent Lane and one existing
`is_lane=false` child event; no repair creates a new Lane.

## 13. Child-event registry

<!-- A6_CHILD_EVENT_START -->
| child_event_id | parent_lane | event_class | event_sequence | is_lane | issuer | exact_token_or_unavailable | source_pointer | evidence_classification | observed_status | relationship_to_parent | credit_authority_effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A6-CE-A1-01` | `A1` | `ROUTE_CORRECTION` | `1` | `false` | CONTROL_THREAD | `CORRECT_A1_EXECUTOR_ROLE_TO_JAI_DEV_BUILDER_FOR_DOCS_REFERENCE_DELIVERY` | [A1], [A4] | `ACCEPTED_CURRENT` | `ROLE_CORRECTED` | corrects delivery role only | `NONE` |
| `A6-CE-A1-02` | `A1` | `CONTROL_ACCEPTANCE` | `2` | `false` | CONTROL_THREAD | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | Current A6 Work Packet; [A4] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | records-later-event after delivery | `ACCEPTED_DOCUMENTATION_ONLY` |
| `A6-CE-A2-01` | `A2` | `CONTROL_ACCEPTANCE` | `1` | `false` | CONTROL_THREAD | `CT-2026-07-20-Q3M7Y26-P1-A2-ACCEPT-v0` | [A4] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | records-later-event after delivery | `ACCEPTED_DOCUMENTARY_AUTHORITY_EVIDENCE_CANON_ONLY` |
| `A6-CE-A3-01` | `A3` | `CONTROL_ACCEPTANCE` | `1` | `false` | CONTROL_THREAD | `CT-2026-07-20-Q3M7Y26-P1-A3-ACCEPT-v0` | [A4] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | does-not-supersede repository ownership evidence | `RECONCILIATION_EVIDENCE_ONLY` |
| `A6-CE-A4-01` | `A4` | `REPAIR_ROUTE` | `1` | `false` | HUMAN_OPERATOR / CONTROL_THREAD | `CT-2026-07-22-Q3M7Y26-P1-A4R1-STATUS-PROVENANCE-CHRONOLOGY-v0` | [A4] | `RATIFIED_PHASE_SPECIFIC` | `DELIVERED_REPAIR` | corrects status, provenance, chronology, exception, and schema treatment | `NONE` |
| `A6-CE-A4-02` | `A4` | `REPAIR_ROUTE` | `2` | `false` | HUMAN_OPERATOR / CONTROL_THREAD | `CT-2026-07-22-Q3M7Y26-P1-A4R2-TOKEN-FIELD-NORMALIZATION-v0` | [PR390] | `MIRROR_ONLY` | `DELIVERED_REPAIR` | corrects one mirror-only token field | `NONE` |
| `A6-CE-A4-03` | `A4` | `CONTROL_ACCEPTANCE` | `3` | `false` | CONTROL_THREAD | `CT-2026-07-22-Q3M7Y26-P1-A4-ACCEPT-v0` | Current A6 Work Packet; [LINEAR-PROGRAM] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | records-later-event after A4R2 | `DOCUMENTATION_REGISTRY_ONLY` |
| `A6-CE-A5-01` | `A5` | `REPAIR_ROUTE` | `1` | `false` | HUMAN_OPERATOR / CONTROL_THREAD | `CT-2026-07-22-Q3M7Y26-P1-A5R1-SUCCESSOR-NAMING-PROVENANCE-v0` | [PR391] | `MIRROR_ONLY` | `DELIVERED_REPAIR` | corrects successor naming provenance without rename authority | `NONE` |
| `A6-CE-A5-02` | `A5` | `CONTROL_ACCEPTANCE` | `2` | `false` | CONTROL_THREAD | `CT-2026-07-22-Q3M7Y26-P1-A5-ACCEPT-v0` | Current A6 Work Packet; [LINEAR-PROGRAM] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | records-later-event after A5R1 | `DOCUMENTATION_PROGRAM_STATE_REGISTRY_ONLY` |
| `A6-CE-D3-01` | `D3` | `FOUNDER_OBSERVATION` | `1` | `false` | HUMAN_OPERATOR | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [A4] | `RATIFIED_PHASE_SPECIFIC` | `REVISE` | phase-bounds the product finding to the observed surface | `NONE` |
| `A6-CE-D3-02` | `D3` | `CONTROL_ACCEPTANCE` | `2` | `false` | CONTROL_THREAD | `CT-2026-07-20-Q3M7Y26-P1-D3-ACCEPT-v0` | [A4] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | records-later-event after founder observation | `FOUNDER_OBSERVATION_EVIDENCE_ONLY` |
| `A6-CE-D4-01` | `D4` | `CONTROL_ACCEPTANCE` | `1` | `false` | CONTROL_THREAD | `CT-2026-07-21-Q3M7Y26-P1-D4-ACCEPT-v0` | [A4] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | records-later-event after delivery | `TESTED_MODEL_PLUS_STATIC_UI_ONLY` |
| `A6-CE-D5-01` | `D5` | `REPAIR` | `1` | `false` | JAI::DEV::BUILDER | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [A4], [PR386] | `STATIC_CONFIGURATION` | `DELIVERED_REPAIR` | records-later-event after initial D5 delivery | `NONE` |
| `A6-CE-D5-02` | `D5` | `REPAIR` | `2` | `false` | JAI::DEV::BUILDER | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [A4], [PR386] | `STATIC_CONFIGURATION` | `DELIVERED_REPAIR` | records-later-event after D5R1 | `NONE` |
| `A6-CE-D5-03` | `D5` | `REPAIR` | `3` | `false` | JAI::DEV::BUILDER | `CT-2026-07-21-Q3M7Y26-P1-D5R3-TEST-EVIDENCE-CLOSURE-v0` | [A4], [PR386] | `MIRROR_ONLY` | `DELIVERED_REPAIR` | records-later-event after D5R2; token remains mirror-only | `NONE` |
| `A6-CE-D5-04` | `D5` | `FOUNDER_OBSERVATION` | `4` | `false` | HUMAN_OPERATOR | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [LINEAR-PROGRAM]; durable packet unavailable | `MIRROR_ONLY` | `RUNNING_OBSERVED_REPORTED` | does-not-supersede missing Control acceptance | `NONE` |
| `A6-CE-D6-01` | `D6` | `REPAIR_ROUTE` | `1` | `false` | HUMAN_OPERATOR / CONTROL_THREAD | `CT-2026-07-21-Q3M7Y26-P1-D6R1-EXPLANATION-COHERENCE-v0` | [A4], [PR387] | `RATIFIED_PHASE_SPECIFIC` | `DELIVERED_REPAIR` | records-later-event after initial D6 source | `NONE` |
| `A6-CE-D6-02` | `D6` | `FOUNDER_OBSERVATION` | `2` | `false` | HUMAN_OPERATOR | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [A4], [PR387] | `RATIFIED_PHASE_SPECIFIC` | `REVISE` | phase-bounds findings to pre-D6R2 head | `NONE` |
| `A6-CE-D6-03` | `D6` | `REPAIR_ROUTE` | `3` | `false` | HUMAN_OPERATOR / CONTROL_THREAD | `CT-2026-07-21-Q3M7Y26-P1-D6R2-DISPLAY-CONTAINMENT-v0` | [A4], [PR387] | `RATIFIED_PHASE_SPECIFIC` | `DELIVERED_REPAIR` | records-later-event after initial founder observation | `NONE` |
| `A6-CE-D6-04` | `D6` | `FOUNDER_REOBSERVATION` | `4` | `false` | HUMAN_OPERATOR | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | [A4], [PR387] | `MIRROR_ONLY` | `PASS_ACCEPT_REPORTED` | does-not-supersede later Control acceptance | `NONE` |
| `A6-CE-D6-05` | `D6` | `CONTROL_ACCEPTANCE` | `5` | `false` | CONTROL_THREAD | `CT-2026-07-21-Q3M7Y26-P1-D6-ACCEPT-v0` | [A4] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | records-later-event after re-observation | `TESTED_DETERMINISTIC_EXPLANATION_PLUS_RUNNING_OBSERVED_UI_ONLY` |
| `A6-CE-D7-01` | `D7` | `REPAIR_ROUTE` | `1` | `false` | HUMAN_OPERATOR / CONTROL_THREAD | `CT-2026-07-21-Q3M7Y26-P1-D7R1-MALFORMED-CONFIRMATION-FAIL-CLOSED-v0` | [A4] | `RATIFIED_PHASE_SPECIFIC` | `DELIVERED_REPAIR` | records-later-event after initial D7 source | `NONE` |
| `A6-CE-D7-02` | `D7` | `FOUNDER_OBSERVATION` | `2` | `false` | HUMAN_OPERATOR | `CT-2026-07-21-Q3M7Y26-P1-D7-FOUNDER-OBSERVATION-v0` | [A4] | `RATIFIED_PHASE_SPECIFIC` | `OBSERVATION_OCCURRED` | records-later-event after repair | `NONE` |
| `A6-CE-D7-03` | `D7` | `CONTROL_ACCEPTANCE` | `3` | `false` | CONTROL_THREAD | `CT-2026-07-21-Q3M7Y26-P1-D7-ACCEPT-v0` | [A4] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | records-later-event after founder observation | `TESTED_DECISION_CONFIRMATION_PLUS_RUNNING_OBSERVED_UI_ONLY` |
| `A6-CE-D8-01` | `D8` | `REPAIR_ROUTE` | `1` | `false` | HUMAN_OPERATOR / CONTROL_THREAD | `CT-2026-07-22-Q3M7Y26-P1-D8R1-DESCRIPTOR-SNAPSHOT-FAIL-CLOSED-v0` | [A4] | `RATIFIED_PHASE_SPECIFIC` | `DELIVERED_REPAIR` | records-later-event after initial D8 source | `NONE` |
| `A6-CE-D8-02` | `D8` | `FOUNDER_OBSERVATION` | `2` | `false` | HUMAN_OPERATOR | `CT-2026-07-22-Q3M7Y26-P1-D8-FOUNDER-OBSERVATION-v0` | [A4] | `RATIFIED_PHASE_SPECIFIC` | `REVISE` | phase-bounds focus finding to D8R1 head | `NONE` |
| `A6-CE-D8-03` | `D8` | `REPAIR_ROUTE` | `3` | `false` | HUMAN_OPERATOR / CONTROL_THREAD | `CT-2026-07-22-Q3M7Y26-P1-D8R2-CLIPBOARD-FOCUS-RETENTION-v0` | [A4] | `RATIFIED_PHASE_SPECIFIC` | `DELIVERED_REPAIR` | records-later-event after founder revision | `NONE` |
| `A6-CE-D8-04` | `D8` | `FOUNDER_REOBSERVATION` | `4` | `false` | HUMAN_OPERATOR | `CT-2026-07-22-Q3M7Y26-P1-D8R2-FOUNDER-REOBSERVATION-v0` | [A4] | `RATIFIED_PHASE_SPECIFIC` | `OBSERVATION_OCCURRED` | records-later-event after D8R2 | `NONE` |
| `A6-CE-D8-05` | `D8` | `CONTROL_ACCEPTANCE` | `5` | `false` | CONTROL_THREAD | `CT-2026-07-22-Q3M7Y26-P1-D8-ACCEPT-v0` | [A4] | `ACCEPTED_CURRENT` | `ACCEPTED_BOUNDED` | records-later-event after re-observation | `TESTED_RECEIPT_PLUS_RUNNING_OBSERVED_UI` |

<!-- A6_CHILD_EVENT_END -->

All twenty-nine child events join to one existing base Lane. Repair and observation suffixes are never promoted into base coordinates.

## 14. Batch D proving-exception overlay

<!-- A6_EXCEPTION_START -->
| exception_id | exact_opaque_decision_text | scope | prerequisite_evidence | termination | closure_token | classification | credit_effect | explicit_non_authorizations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A6-EXC-001` | `AUTHORIZE_PROGRAM_1_BATCH_D_PROVING_SEAM_WITH_CI_FIRST` | `Q3M7Y26-P1:D1–D8 / NON_COORDINATE_OVERLAY` | `Exact formal bypass list UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | Ended after accepted D8 head merged as `a1194b820a126b23bc1ac992f8d4271acfbfde08`. | `UNAVAILABLE_NOT_IN_IMMUTABLE_SOURCE` | `RATIFIED_PHASE_SPECIFIC` | `NONE` | No general Batch D activation, D9, retroactive Batch A/B/C credit, Batch D exit, Program exit, or JAI activation. |

<!-- A6_EXCEPTION_END -->

The overlay `phase-bounds` D1–D8 and `does-not-supersede` any Batch dependency. No formal exception-closure token is invented.

## 15. Legacy, collision, contradiction, and unavailable-evidence ledger

| claim_id | domain | observed_claim | source | classification | conflict_or_gap | current_disposition | relation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `A6-CLM-001` | Bare coordinate collision | Bare `A6` is globally unique. | Current A6 Work Packet | `CONTRADICTORY` | Legacy Linear and repository records reuse short identifiers. | Use full `Q3M7Y26-P1:A6`; retain bare value only as tuple field. | `does-not-supersede` |
| `A6-CLM-002` | Legacy Program ID | `Q3M7Y26` | [TAXONOMY] | `STATIC_CONFIGURATION` | Current Program code is `Q3M7Y26-P1`. | Legacy display metadata only; zero coordinate authority. | `phase-bounds` |
| `A6-CLM-003` | Legacy Program title | Q3M7Y26 JAI Motion Control Plane Activation v0 | [TAXONOMY] | `STATIC_CONFIGURATION` | Differs from current Program title. | Legacy display metadata only. | `phase-bounds` |
| `A6-CLM-004` | Pseudo-Lane | `B40-WORK` | [TAXONOMY] | `STATIC_CONFIGURATION` | Can be mistaken for B4 or a current base Lane. | Do not map to B4; contributes zero to the ninety-Lane registry. | `does-not-supersede` |
| `A6-CLM-005` | Pseudo-Lane | `B40-WAVES-GROUPING` | [TAXONOMY] | `STATIC_CONFIGURATION` | Can be mistaken for B4 or a current base Lane. | Do not map to B4; contributes zero to the ninety-Lane registry. | `does-not-supersede` |
| `A6-CLM-006` | Legacy posture | `program-close-candidate` | [TAXONOMY], [TAXONOMY-TEST] | `STATIC_CONFIGURATION` | No Program closeout or exit is established. | Legacy display posture only; Program 1 remains open for Batch planning. | `does-not-supersede` |
| `A6-CLM-007` | Linear authority | Linear `In Progress` and `Done` statuses establish routing or acceptance. | [LINEAR-PROGRAM], [LINEAR-A6] | `MIRROR_ONLY` | Mirror state can look operational. | Coordination only; fresh human/CONTROL_THREAD decisions govern. | `does-not-supersede` |
| `A6-CLM-008` | Missing base routes | D1, D2, D4, and D5 exact route tokens. | [A4] | `UNAVAILABLE` | Repository delivery exists but exact route tokens are unavailable. | Preserve unavailable; do not reconstruct from chronology. | `does-not-supersede` |
| `A6-CLM-009` | Missing acceptance tokens | D1, D2, and D5 exact Control acceptance tokens. | [A4], current A6 Work Packet | `UNAVAILABLE` | Merge, verification, or observation cannot substitute. | No acceptance inferred. | `does-not-supersede` |
| `A6-CLM-010` | Missing founder tokens | D3, D5, and D6 founder event tokens are partly unavailable. | [A4], [PR386], [PR387] | `UNAVAILABLE` | Event evidence exists at bounded ceilings but token durability is incomplete. | Preserve event posture and missing-token classification separately. | `phase-bounds` |
| `A6-CLM-011` | A5 artifact cutoff | A5 artifact says acceptance pending and A6 not granted. | [A5] | `RATIFIED_PHASE_SPECIFIC` | Fresh A5 acceptance and A6 route occurred later. | Historical text remains accurate at its cutoff. | `records-later-event` |
| `A6-CLM-012` | Batch D exception | D1–D8 delivery implies continuing D9 authority. | [A4], current A6 Work Packet | `CONTRADICTORY` | The exception terminated after D8. | D9 remains `HELD_PENDING_ACCEPTED_BATCH_B`. | `phase-bounds` |

## 16. No-retroactive-credit audit

| Registered evidence | What it may prove | What it cannot supply | Audit result |
| --- | --- | --- | --- |
| GitHub branch, commit, PR, merge | Repository delivery state | Missing route, verification, acceptance, credit, Batch exit, Program exit, or activation | `PASS` |
| Vercel or configured checks | Configured check result | Runtime authority, external-effect absence, acceptance, or production readiness | `PASS` |
| Linear status or milestone | Mirror coordination posture | Route, repository ownership, acceptance, execution, or credit | `PASS` |
| UI label or deployed surface | Observed presentation within its evidence ceiling | Canonical coordinate ownership, missing receipt, or authority | `PASS` |
| Neighboring Lane chronology | Temporal order | Automatic next-Lane, Batch, or Program routing | `PASS` |
| Static taxonomy | Legacy display configuration | Current Program identity, B4 mapping, or coordinate authority | `PASS` |
| Child event | Repair, observation, correction, or acceptance event at its source ceiling | A new base Lane or retroactive parent-Lane credit | `PASS` |

Registering evidence under a coordinate does not retroactively route, deliver,
verify, accept, complete, or credit that work. A6 cannot accept itself or
A1–A5, close Batch A or D, route A7 or A8, open Batch B or C, route D9,
grant execution authority, transition a Program, or activate JAI.

## 17. Current disposition and bounded A7/A8 handoff

| Subject | Current posture | Evidence ceiling or credit | Next boundary |
| --- | --- | --- | --- |
| Program 1 | `OPEN_FOR_BATCH_PLANNING_ONLY` | `STANDING_EXECUTION_AUTHORITY_NOT_GRANTED` | Separate accepted Program transition required. |
| A1–A5 | `ACCEPTED_AT_EXACT_BOUNDED_CEILINGS` | `NO_BATCH_A_EXIT_CREDIT` | No retroactive expansion. |
| A6 | `ROUTED_FOR_A6R1_DOCUMENTARY_REPAIR / NOT_ACCEPTED` | `DOCUMENTATION_CONTROL_COORDINATE_REGISTRY_ONLY` | A6R1 final independent verification and separate CONTROL_THREAD acceptance. |
| A7–A15 | `PROPOSED / UNROUTED` | `NONE` | Fresh accepted main and separate exact route. |
| B1–B15 | `PROPOSED / UNROUTED` | `NONE` | Batch B not opened for execution. |
| C1–C15 | `PROPOSED / UNROUTED` | `NONE` | Batch C not opened for execution. |
| D1–D8 | `HISTORICAL_PHASE_BOUNDED_DELIVERY / MIXED ACCEPTANCE EVIDENCE` | `NO_BATCH_D_EXIT_CREDIT` | No continuing exception. |
| D9 | `HELD_PENDING_ACCEPTED_BATCH_B` | `NONE` | Accepted Batch B plus separate D9 route. |
| D10–D15 | `PROPOSED / UNROUTED` | `NONE` | Separate future routes. |
| E1–E15 | `PROPOSED / UNROUTED` | `NONE` | Batch E not opened for execution. |
| F1–F15 | `PROPOSED / UNROUTED` | `NONE` | Batch F not opened for execution. |
| Programs 2–4 | `NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN` | `NONE` | Immediate predecessor `CLOSED_ACCEPTED` plus every fresh opening gate. |

A7 or A8 may consume this registry only after A6R1 final independent
verification, separate CONTROL_THREAD A6 acceptance, squash merge, branch
deletion, fresh main reconciliation, and a separately issued exact route. This
is a handoff boundary, not routing authority.

## 18. Validation evidence

| Validation | Required result | Recorded result |
| --- | --- | --- |
| Program rows | Exactly 1 | `PASS — 1` |
| Batch rows | Exactly 6 | `PASS — 6` |
| Wave rows | Exactly 24 | `PASS — 24` |
| Lane core rows | Exactly 90 | `PASS — 90` |
| Lane boundary rows | Exactly 90 | `PASS — 90` |
| Base Lanes per Batch | Exactly 15 each | `PASS — A=15; B=15; C=15; D=15; E=15; F=15` |
| Core/boundary joins | Exact one-to-one; zero duplicates or orphans | `PASS — 90 joined; 0 duplicate IDs; 0 orphans` |
| Wave map | Standard map for A/B/C/E/F; exact nonuniform D map | `PASS` |
| Route registry | Unique exact tokens; combined route retained once | `PASS — 16 routes; 18 unique junctions; 0 orphans` |
| Artifact-local registry IDs | Exactly 185 unique IDs | `PASS — 185 unique; 0 duplicates` |
| Child events | All `is_lane=false`; every parent exists | `PASS — 29 child events; 0 orphans` |
| Frozen table preservation | Program, Wave, Lane core, child-event, and exception tables unchanged from A6 head | `PASS — byte-identical` |
| Legacy collision audit | B40 values excluded from base registry | `PASS` |
| No-retroactive-credit audit | No inferred route, acceptance, credit, or execution | `PASS` |
| D3 role/repository provenance | No mirror-derived role or ownership | `PASS — role unavailable; repository unresolved; HUMAN_OPERATOR observation and bounded evidence preserved` |
| Immutable/mutable GitHub evidence | SHA-pinned evidence separated from mutable PR metadata | `PASS — immutable commit/blob row separated from MIRROR_ONLY PR metadata` |
| Batch D provenance | Closed exception grounded in A4; planning remains mirror-only | `PASS — title, closed exception, and planning sources separated; closure token unavailable; no D9 authority` |
| Source classification | Every material claim sourced or explicitly unavailable | `PASS — 17 reference definitions; 0 unresolved; 10 SHA-pinned blob references` |
| Initial A6 behavioral inventory | Exactly 15 files including local-operating-loop | `PASS — 15 exact files; includes motionKernel/local-operating-loop.test.ts` |
| Initial A6 behavioral execution | All 15 individual focused commands exit 0 | `PASS — 15/15 exit 0` |
| Initial A6 `git diff --check` | PASS | `PASS — no findings` |
| Initial A6 cached path and whitespace | One allowlisted path; cached check PASS | `PASS — one path; no findings` |
| A6R1 local behavioral/lint/typecheck/Prisma/build | Documentation-only repair | `N/A — no production or test path changed; required through portal_ci_guardrails` |
| A6R1 `git diff --check` | PASS | `PASS — no findings` |
| A6R1 cached path and whitespace | One allowlisted path; cached check PASS | `PASS — one path; no findings` |

For initial A6 validation, all fifteen exact commands first encountered the established sandbox-only
`listen EPERM` before test execution. They were rerun unchanged outside the
sandbox under explicit approval, and all fifteen exited `0`.

For A6R1, local behavioral tests, lint, typecheck, Prisma validation, and
production build are:

`N/A — documentation-only change; required through portal_ci_guardrails.`

No validation script or generated file is stored in the repository.

## 19. Risks, rollback, and explicit non-authorizations

Risk is limited to documentary misclassification, stale evidence, coordinate
duplication, incorrect Wave normalization, or authority overstatement. The
mechanical joins, raw-label preservation, unavailable classifications, and
no-retroactive-credit audit constrain those risks.

Rollback is a normal revert of the affected documentary commit. No runtime, data,
schema, migration, provider, deployment, or external-system rollback is
required.

This artifact and its Draft PR do not authorize or perform:

- merge, auto-merge, ready-for-review conversion, deployment, or branch deletion;
- Linear mutation or source-of-truth transfer;
- A7 or A8 execution, Batch B or C execution, or D9 execution;
- persistence, provider/model/API dispatch, customer effect, Agent, Council, or runtime execution;
- Batch A exit, Batch D exit, Program transition, Program exit, or JAI activation;
- repository ownership assignment for unresolved planned Lanes;
- conversion of legacy B40 values into B4 or current Program coordinates;
- any acceptance, credit, or authority not explicitly recorded by its controlling source.

`A6_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_CONTROL_COORDINATE_REGISTRY_ONLY`

`A6R1_MAXIMUM_CREDIT: DOCUMENTATION_CONTROL_COORDINATE_REGISTRY_ONLY`

`A6_ACCEPTANCE: HELD_PENDING_A6R1_FINAL_VERIFICATION`

`A7_EXECUTION_AUTHORITY: NOT_GRANTED`

`A8_EXECUTION_AUTHORITY: NOT_GRANTED`

`BATCH_A_EXIT_CREDIT: NONE`

`BATCH_B_EXECUTION_AUTHORITY: NOT_GRANTED`

`D9_EXECUTION_AUTHORITY: HELD_PENDING_ACCEPTED_BATCH_B`

`BATCH_D_EXIT_CREDIT: NONE`

`PROGRAM_EXIT_CREDIT: NONE`

`JAI_ACTIVATION_CREDIT: NONE`

`NEXT_REQUIRED_DECISION: ACCEPT_A6R1_FOR_FINAL_INDEPENDENT_VERIFICATION`

[MOTION-DECISION]: https://github.com/jai-nexus/dev-jai-nexus/blob/291e2006f1a7af9711d1b7c822ac46abc9569557/.nexus/motions/motion-0248/decision.yaml
[OPENING-RECEIPT]: https://github.com/jai-nexus/dev-jai-nexus/blob/6f9dea1904066c45a75f3789377d32c2b0b16106/docs/reference/q3m7y26-jai-governance-intelligence-main-state-operating-loop-program-opening-receipt-v0.md
[A1]: https://github.com/jai-nexus/dev-jai-nexus/blob/cac7fa273cddd5e38ac30d26870fa04ab6476a18/docs/reference/q3m7-accepted-main-state-reconciliation-planning-v0.md
[A2]: https://github.com/jai-nexus/dev-jai-nexus/blob/c7eb9fcda25e9606dd552c63d82f08dc6a8df6eb/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md
[A4]: https://github.com/jai-nexus/dev-jai-nexus/blob/2160fc4e3feaa1d5d4bc110e6f9f5498a9a4545e/docs/reference/q3m7y26-p1-a4-ratified-motion-decision-registry-v0.md
[A5]: https://github.com/jai-nexus/dev-jai-nexus/blob/933108807587e3cdd03fb439edbc6755a7dd6b97/docs/reference/q3m7y26-p1-a5-active-frozen-program-registry-v0.md
[ROLES]: https://github.com/jai-nexus/dev-jai-nexus/blob/933108807587e3cdd03fb439edbc6755a7dd6b97/roles/README.md
[ROLEMAP]: https://github.com/jai-nexus/dev-jai-nexus/blob/933108807587e3cdd03fb439edbc6755a7dd6b97/roles/rolemap.json
[TAXONOMY]: https://github.com/jai-nexus/dev-jai-nexus/blob/933108807587e3cdd03fb439edbc6755a7dd6b97/portal/src/lib/controlPlane/workWavesProgramTaxonomy.ts
[TAXONOMY-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/933108807587e3cdd03fb439edbc6755a7dd6b97/portal/src/lib/controlPlane/workWavesProgramTaxonomy.test.ts
[MAIN]: https://github.com/jai-nexus/dev-jai-nexus/commit/933108807587e3cdd03fb439edbc6755a7dd6b97
[PR386]: https://github.com/jai-nexus/dev-jai-nexus/pull/386
[PR387]: https://github.com/jai-nexus/dev-jai-nexus/pull/387
[PR390]: https://github.com/jai-nexus/dev-jai-nexus/pull/390
[PR391]: https://github.com/jai-nexus/dev-jai-nexus/pull/391
[LINEAR-PROGRAM]: https://linear.app/jai-nexus/project/q3m7y26-jai-governance-intelligence-main-state-reconciliation-mv-loop-9841da077546
[LINEAR-A6]: https://linear.app/jai-nexus/issue/JAI-188/q3m7y26-p1a6-control-coordinate-registry
