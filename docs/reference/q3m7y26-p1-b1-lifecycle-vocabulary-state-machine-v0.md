# Q3M7Y26-P1 B1 Lifecycle Vocabulary and State Machine v0

Recommendation: `GO_TO_CONTROL_THREAD_B1_CANON_DECISION`

## 1. Status, purpose, and documentary boundary

This artifact proposes a canonical lifecycle vocabulary and conceptual
multi-axis state machine for Program governance objects. It separates
planning, routing, delivery, verification, acceptance, repository
integration, control disposition, Program operation, activation, and mirror
posture so that one status cannot silently imply another.

Role: JAI::DEV::BUILDER

Status:
`DOCUMENTARY_PROPOSED_CANON / PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION`

This proposal records no transition and does not ratify itself. Existing
Programs, Batches, Waves, Lanes, Work Packets, repositories, pull requests,
deployments, runtimes, or mirrors retain their accepted source-grounded state.

## 2. Exact Control Coordinates and evidence cutoff

| Field | Value |
| --- | --- |
| Program | `Q3M7Y26-P1` |
| Batch | `B - Program Lifecycle and Receipt Canon` |
| Wave | `B-A` |
| Lane | `B1 - Lifecycle Vocabulary and State Machine v0` |
| Route | `CT-2026-07-23-Q3M7Y26-P1-START-B1-LIFECYCLE-VOCABULARY-STATE-MACHINE-v0` |
| Work Packet | `Q3M7Y26-P1-B1-v0` |
| Repository | `jai-nexus/dev-jai-nexus` |
| Required base | `0bacc2dac38810bf0e70b28a16eb689a6517cb7e` |
| Evidence cutoff | `2026-07-23T23:02:48Z` |
| Linear mirror | `JAI-198 / Backlog / MIRROR_ONLY / NOT_MUTATED` |
| Evidence ceiling | `DOCUMENTATION_PROPOSED_LIFECYCLE_VOCABULARY_AND_STATE_MACHINE_ONLY` |

## 3. Accepted Batch A and current-main baseline

| Baseline fact | Current disposition | Evidence |
| --- | --- | --- |
| Current main | `jai-nexus/dev-jai-nexus@0bacc2dac38810bf0e70b28a16eb689a6517cb7e` | [A15-MERGE] |
| A15 source head | `36afc2172d820f722588672fc01ea0a839546ef6` | [A15-HEAD] |
| A15 repository disposition | Accepted source head squash-merged as current main | [A15], [A15-HEAD], [A15-MERGE] |
| Batch A closeout | `ACCEPTED_COMPLETED_DOCUMENTARY_MAIN_STATE_RECONCILIATION_ONLY` | Current B1 Work Packet; decision `CT-2026-07-23-Q3M7Y26-P1-BATCH-A-CLOSEOUT-ACCEPT-v0` |
| Program 1 | Sole recognized active Program; `OPEN_FOR_BATCH_PLANNING_ONLY` | [OPENING-RECEIPT], [A5], [A15] |
| Programs 2-4 | `NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN` | [MOTION-DECISION], [A5], [A15] |
| Standing execution authority | `NOT_GRANTED` | [OPENING-RECEIPT], [A5], [A8] |
| B1 | Fresh exact route exists; proposed canon is not yet delivered, verified, accepted, or integrated at this cutoff | Current B1 Work Packet |
| Runtime and activation | No provider, Agent, Council, customer, production, or JAI activation credit | [A13], [A14], [A15] |
| Linear | JAI-198 remains a stale `MIRROR_ONLY` planning record | [JAI-198] |

The accepted Batch A closeout is a later workflow event relative to the
pre-acceptance wording inside the merged A15 artifact. It
`records-later-event`; it does not retroactively rewrite A15's cutoff.

## 4. Source vocabulary inventory

| Source ID | Source vocabulary | Source class | B1 treatment | Authority effect |
| --- | --- | --- | --- | --- |
| `B1-SRC-01` | [A2] evidence statuses and conflict/supersession relations | `DOCUMENTARY / ACCEPTED_CURRENT` | Inherit as evidence posture and provenance rules, not lifecycle states. | `NONE` |
| `B1-SRC-02` | [A4] route, delivery, acceptance, repair, exception, and currentness records | `DOCUMENTARY / ACCEPTED_CURRENT` | Preserve event distinctions and phase boundaries. | `NONE` |
| `B1-SRC-03` | A5 Program states and one-active invariant | `DOCUMENTARY / ACCEPTED_CURRENT` | Preserve exact governing Program tokens. | `NONE` |
| `B1-SRC-04` | [A6] planning, route, delivery, verification, acceptance, credit, and mirror fields | `DOCUMENTARY / ACCEPTED_CURRENT` | Separate fields into orthogonal axes. | `NONE` |
| `B1-SRC-05` | A8 responsibility and approval-gate boundaries | `DOCUMENTARY / ACCEPTED_CURRENT` | Require separate authority without defining the B5 role matrix. | `NONE` |
| `B1-SRC-06` | A13 gaps, risks, blockers, gate impact, and conditional future prerequisites | `DOCUMENTARY / ACCEPTED_CURRENT` | Preserve fail-closed blockers and future transition boundaries. | `NONE` |
| `B1-SRC-07` | A14 evidence ceilings, carried HOLDs, and independent-review disposition | `DOCUMENTARY / ACCEPTED_CURRENT` | Preserve review and evidence separation. | `NONE` |
| `B1-SRC-08` | A15 main-state disposition and Batch A closeout candidate | `DOCUMENTARY / ACCEPTED_CURRENT` | Treat merge and later acceptance as different events. | `NONE` |
| `B1-SRC-09` | Motion 0248 sequence, predecessor outcomes, and opening prerequisites | `RATIFIED_PHASE_SPECIFIC / ACCEPTED_CURRENT ENVELOPE` | Preserve fixed order and exact Program transition terms. | `NONE` |
| `B1-SRC-10` | JAI-198 Backlog and `PROPOSED_UNROUTED` text | `MIRROR_ONLY` | Retain as stale mirror evidence; do not use as current route state. | `NONE` |

Source rows: `10`; unique source IDs: `10`; all authority effects: `NONE`.

## 5. Conflict and synonym reconciliation

| Reconciliation ID | Terms that may appear synonymous | Canonical distinction | Verdict |
| --- | --- | --- | --- |
| `B1-REC-01` | `PLANNED` and `ROUTED` | Planning maturity and route authority are different axes. | `DIFFERENT_SCOPE` |
| `B1-REC-02` | `ROUTED` and `DELIVERED` | A route permits bounded work; delivery records an output event. | `DIFFERENT_SCOPE` |
| `B1-REC-03` | `DELIVERED` and `VERIFIED` | Executor delivery cannot supply independent verification. | `DIFFERENT_SCOPE` |
| `B1-REC-04` | `VERIFIED` and `ACCEPTED` | Verification is evidence; acceptance is a separate decision. | `DIFFERENT_SCOPE` |
| `B1-REC-05` | `MERGED` and `ACCEPTED` | Merge is repository integration and does not create Control acceptance. | `DIFFERENT_SCOPE` |
| `B1-REC-06` | `ACCEPTED` and `ACTIVATED` | Governance acceptance does not start runtime behavior. | `DIFFERENT_SCOPE` |
| `B1-REC-07` | `active Program` and `activated runtime` | Program portfolio posture and runtime activation are different axes. | `DIFFERENT_SCOPE` |
| `B1-REC-08` | `HELD` and `REJECTED` | Hold is reversible by fresh authority; rejection is terminal for the exact candidate. | `DIFFERENT_SCOPE` |
| `B1-REC-09` | `CLOSED_ACCEPTED` and repository `MERGED` | Program outcome and repository integration are different axes. | `DIFFERENT_SCOPE` |
| `B1-REC-10` | A2 `ACCEPTED_CURRENT` and lifecycle `ACCEPTED` | The former classifies evidence; the latter records a governance decision axis. | `DIFFERENT_SCOPE` |
| `B1-REC-11` | Linear `Done` and lifecycle `ACCEPTED` | Linear is mirror state only. | `DIFFERENT_SCOPE` |
| `B1-REC-12` | local-shadow `ACCEPTED` and governance `ACCEPTED` | Local UI state is demonstration-only and non-authorizing. | `DIFFERENT_SCOPE` |
| `B1-REC-13` | `live`, `open`, or `configured` and `ACTIVATED` | Static labels require direct runtime and authority evidence. | `UNRESOLVED_WITHOUT_DIRECT_EVIDENCE` |
| `B1-REC-14` | `REVERTED` and `SUPERSEDED` | Revert is repository integration history; supersession retires an exact control record. | `DIFFERENT_SCOPE` |
| `B1-REC-15` | Program `CANCELLED` and object `CONTROL_CANCELLED` | The exact Program outcome is axis-specific; the control overlay may apply to other objects. | `OVERLAP_NOT_CONFLICT` |
| `B1-REC-16` | receipt status and lifecycle state | A receipt evidences a transition but is not itself the state. | `DIFFERENT_SCOPE` |

No genuine contradiction remains after subject, axis, and time normalization.
Unknown scope or missing direct evidence fails closed.

## 6. Canonical lifecycle axes

| Axis ID | Axis | Question answered | Entry state | Independent effect |
| --- | --- | --- | --- | --- |
| `B1-AX-01` | Planning maturity | Has a bounded object been planned? | `UNPLANNED` | No route or execution authority. |
| `B1-AX-02` | Routing authority | Does a fresh exact route currently apply? | `UNROUTED` | No delivery, acceptance, or merge by itself. |
| `B1-AX-03` | Delivery | Has the routed output been produced? | `NOT_DELIVERED` | No verification or acceptance by itself. |
| `B1-AX-04` | Verification | Has required evidence been independently evaluated? | `NOT_VERIFIED` | No acceptance by itself. |
| `B1-AX-05` | Acceptance | Has authorized Control accepted the exact subject and ceiling? | `NOT_ACCEPTED` | No repository integration or activation by itself. |
| `B1-AX-06` | Repository integration | Has an exact repository change been integrated? | `NOT_INTEGRATED` | No Control acceptance or runtime effect by itself. |
| `B1-AX-07` | Control disposition overlay | Is progression active, held, cancelled, or superseded? | `CONTROL_ACTIVE` | Does not alter other axes without explicit transitions. |
| `B1-AX-08` | Program operation | What is the accepted Program portfolio posture? | `NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN` | Opening grants planning only. |
| `B1-AX-09` | Runtime activation | Has separately governed runtime activation occurred? | `NOT_ACTIVATED` | No inference from documentation, tests, builds, previews, or acceptance. |
| `B1-AX-10` | Mirror posture | How accurately does a downstream mirror reflect canonical evidence? | `NOT_MIRRORED` | Never governs another axis. |

Axes are orthogonal. A state transition on one axis changes no other axis
unless a separate transition with its own evidence and authority is recorded.

Transition precondition classes used below are:
`PLANNING_AUTHORITY`, `FRESH_ROUTE`, `ROUTED_DELIVERY`,
`INDEPENDENT_VERIFICATION`, `ACCEPTANCE_DECISION`,
`INTEGRATION_AUTHORIZATION`, `CONTROL_DISPOSITION`,
`PROGRAM_TRANSITION_AUTHORITY`, `ACTIVATION_AUTHORITY`, and
`MIRROR_MUTATION_AUTHORITY`.

Evidence requirement classes used below are:
`BOUNDED_PLAN`, `EXACT_ROUTE`, `EXACT_DELIVERY`, `EXACT_HEAD_EVIDENCE`,
`ACCEPTED_DECISION`, `IMMUTABLE_REPOSITORY_EVENT`,
`CONTROL_DISPOSITION_EVIDENCE`, `FRESH_MAIN_STATE_RECEIPT`,
`DIRECT_RUNTIME_EVIDENCE`, and `CANONICAL_SOURCE_COMPARISON`.
These classes name conceptual prerequisites only; B8-B10 own later schemas
and receipt structures.

## 7. Canonical state catalog

| State ID | Axis ID | Canonical token | Exact meaning | State character |
| --- | --- | --- | --- | --- |
| `B1-ST-PLN-01` | `B1-AX-01` | `UNPLANNED` | No accepted bounded plan exists. | Entry; nonterminal. |
| `B1-ST-PLN-02` | `B1-AX-01` | `PLANNED` | A bounded plan exists; no route is implied. | Progression; nonterminal. |
| `B1-ST-PLN-03` | `B1-AX-01` | `PLANNING_FROZEN` | Planning is intentionally prevented pending a named condition. | Held-like; reversible only by fresh authority. |
| `B1-ST-RTE-01` | `B1-AX-02` | `UNROUTED` | No current exact route applies. | Entry; nonterminal. |
| `B1-ST-RTE-02` | `B1-AX-02` | `ROUTED` | A fresh route binds exact subject, scope, executor, and boundary. | Progression; nonterminal. |
| `B1-ST-RTE-03` | `B1-AX-02` | `ROUTE_EXPIRED` | A prior route ended at its completion, revocation, head, or time boundary. | Terminal for that route; rerouting creates a later event. |
| `B1-ST-DLV-01` | `B1-AX-03` | `NOT_DELIVERED` | No bounded output is recorded. | Entry; nonterminal. |
| `B1-ST-DLV-02` | `B1-AX-03` | `DELIVERY_IN_PROGRESS` | Authorized execution began but no complete delivery is recorded. | Progression; nonterminal. |
| `B1-ST-DLV-03` | `B1-AX-03` | `DELIVERED` | The routed output exists at an exact evidence boundary. | Terminal for that delivery event. |
| `B1-ST-VER-01` | `B1-AX-04` | `NOT_VERIFIED` | Required independent verification is absent. | Entry; nonterminal. |
| `B1-ST-VER-02` | `B1-AX-04` | `VERIFICATION_PENDING` | Verification is routed or underway but not concluded. | Progression; nonterminal. |
| `B1-ST-VER-03` | `B1-AX-04` | `VERIFIED` | Required checks and independent review passed for the exact subject and ceiling. | Terminal for the exact evidence set; may later become stale. |
| `B1-ST-VER-04` | `B1-AX-04` | `VERIFICATION_FAILED` | Required verification failed or found a blocker. | Held-like; retry requires fresh or corrected evidence. |
| `B1-ST-VER-05` | `B1-AX-04` | `VERIFICATION_STALE` | Previously verified evidence no longer matches the current subject, head, or prerequisite set. | Held-like; reverify required. |
| `B1-ST-ACC-01` | `B1-AX-05` | `NOT_ACCEPTED` | No acceptance decision exists for the exact subject and ceiling. | Entry; nonterminal. |
| `B1-ST-ACC-02` | `B1-AX-05` | `ACCEPTANCE_PENDING` | The exact subject is awaiting an authorized decision. | Progression; nonterminal. |
| `B1-ST-ACC-03` | `B1-AX-05` | `ACCEPTED` | Authorized Control accepted the exact subject at an explicit evidence ceiling. | Terminal for that decision record. |
| `B1-ST-ACC-04` | `B1-AX-05` | `REJECTED` | Authorized Control rejected the exact candidate. | Terminal for that candidate. |
| `B1-ST-INT-01` | `B1-AX-06` | `NOT_INTEGRATED` | No repository integration event exists. | Entry; nonterminal. |
| `B1-ST-INT-02` | `B1-AX-06` | `INTEGRATION_PENDING` | Exact integration is authorized or mechanically pending but incomplete. | Progression; nonterminal. |
| `B1-ST-INT-03` | `B1-AX-06` | `INTEGRATED` | The exact repository change was merged or otherwise integrated. | Terminal for that integration event. |
| `B1-ST-INT-04` | `B1-AX-06` | `REVERTED` | A later repository event reverses the integrated change. | Terminal historical event; does not erase prior integration. |
| `B1-ST-CTL-01` | `B1-AX-07` | `CONTROL_ACTIVE` | No hold, cancellation, or supersession currently blocks the object. | Entry overlay; nonterminal. |
| `B1-ST-CTL-02` | `B1-AX-07` | `HELD` | Progression is paused while existing axis states and evidence remain preserved. | Reversible only by fresh Control disposition. |
| `B1-ST-CTL-03` | `B1-AX-07` | `CONTROL_CANCELLED` | Further progression of the exact object is ended without rewriting history. | Terminal for the exact object. |
| `B1-ST-CTL-04` | `B1-AX-07` | `SUPERSEDED` | A named later object or decision replaces this exact object's controlling effect. | Terminal; replacement has its own identity and states. |
| `B1-ST-PRG-01` | `B1-AX-08` | `NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN` | Program is reserved and unopened; downstream progression is frozen. | Entry for successor Programs; nonterminal only through every opening gate. |
| `B1-ST-PRG-02` | `B1-AX-08` | `OPEN_FOR_BATCH_PLANNING_ONLY` | Program is open only for bounded Batch planning; standing execution authority is not granted. | Active Program posture; nonterminal. |
| `B1-ST-PRG-03` | `B1-AX-08` | `UNRESOLVED_HOLD` | A named unresolved Program condition blocks progression and freezes downstream Programs. | Held-like; reversible only by accepted disposition. |
| `B1-ST-PRG-04` | `B1-AX-08` | `CLOSED_ACCEPTED` | Program is accepted and closed at its bounded outcome; successor consideration remains separately gated. | Terminal Program outcome. |
| `B1-ST-PRG-05` | `B1-AX-08` | `CLOSED_NO_GO` | Program closes without an accepted-go outcome and downstream Programs remain frozen. | Terminal Program outcome. |
| `B1-ST-PRG-06` | `B1-AX-08` | `CANCELLED` | Program is cancelled and downstream Programs remain frozen. | Terminal Program outcome. |
| `B1-ST-PRG-07` | `B1-AX-08` | `FAILED` | Program fails and downstream Programs remain frozen. | Terminal Program outcome. |
| `B1-ST-ACT-01` | `B1-AX-09` | `NOT_ACTIVATED` | No accepted runtime activation exists. | Entry; current portfolio posture. |
| `B1-ST-ACT-02` | `B1-AX-09` | `ACTIVATION_PENDING` | A separately governed activation decision is pending; runtime remains inactive. | Progression; nonterminal. |
| `B1-ST-ACT-03` | `B1-AX-09` | `ACTIVATED` | Direct evidence and fresh governing authority establish bounded runtime activation. | Runtime-active; nonterminal. |
| `B1-ST-ACT-04` | `B1-AX-09` | `ACTIVATION_SUSPENDED` | Accepted authority has temporarily stopped an activated runtime. | Held-like; reversible only by fresh authority. |
| `B1-ST-ACT-05` | `B1-AX-09` | `DEACTIVATED` | Accepted authority has ended the bounded runtime activation. | Terminal for that activation instance. |
| `B1-ST-ACT-06` | `B1-AX-09` | `ACTIVATION_FAILED` | An authorized activation attempt failed without establishing active runtime. | Terminal for that attempt; runtime remains inactive. |
| `B1-ST-MIR-01` | `B1-AX-10` | `NOT_MIRRORED` | No downstream mirror record is established. | Entry; nonterminal. |
| `B1-ST-MIR-02` | `B1-AX-10` | `MIRRORED_CURRENT` | Mirror text accurately reflects cited canonical evidence at its observation time. | Non-authoritative and freshness-bound. |
| `B1-ST-MIR-03` | `B1-AX-10` | `MIRROR_STALE` | Mirror text lags a later canonical event. | Held-like mirror posture; canonical state is unaffected. |
| `B1-ST-MIR-04` | `B1-AX-10` | `MIRROR_CONFLICTING` | Mirror text conflicts with canonical evidence for the same scope and time. | Fail-closed mirror posture; canonical state is unaffected. |

State rows: `43`; unique state IDs: `43`; axes represented: `10`.

Entry means the default state when no stronger accepted evidence exists.
Terminality applies only to the named axis and exact record. Reopening a held
object is a new transition backed by fresh authority; it does not erase the
hold. Supersession preserves the retired record and requires a named
replacement.

## 8. Valid conceptual transition matrix

Every unlisted transition is invalid. `FAIL_CLOSED` means preserve the source
state, record the contradiction or missing evidence, and require an explicit
Control disposition. No transition executes automatically.

| Transition ID | Axis ID | Source state | Target state | Precondition class | Evidence requirement class | Separate authority required | Target terminality | Invalid-transition behavior |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `B1-TR-001` | `B1-AX-01` | `B1-ST-PLN-01` | `B1-ST-PLN-02` | `PLANNING_AUTHORITY` | `BOUNDED_PLAN` | `YES` | Nonterminal | `FAIL_CLOSED` |
| `B1-TR-002` | `B1-AX-01` | `B1-ST-PLN-02` | `B1-ST-PLN-03` | `CONTROL_DISPOSITION` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Reversible hold | `FAIL_CLOSED` |
| `B1-TR-003` | `B1-AX-01` | `B1-ST-PLN-03` | `B1-ST-PLN-02` | `PLANNING_AUTHORITY` | `BOUNDED_PLAN` | `YES` | Nonterminal | `FAIL_CLOSED` |
| `B1-TR-004` | `B1-AX-02` | `B1-ST-RTE-01` | `B1-ST-RTE-02` | `FRESH_ROUTE` | `EXACT_ROUTE` | `YES` | Nonterminal | `FAIL_CLOSED` |
| `B1-TR-005` | `B1-AX-02` | `B1-ST-RTE-02` | `B1-ST-RTE-03` | `CONTROL_DISPOSITION` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Terminal route event | `FAIL_CLOSED` |
| `B1-TR-006` | `B1-AX-02` | `B1-ST-RTE-03` | `B1-ST-RTE-02` | `FRESH_ROUTE` | `EXACT_ROUTE` | `YES` | Nonterminal later route | `FAIL_CLOSED` |
| `B1-TR-007` | `B1-AX-03` | `B1-ST-DLV-01` | `B1-ST-DLV-02` | `ROUTED_DELIVERY` | `EXACT_ROUTE` | `YES` | Nonterminal | `FAIL_CLOSED` |
| `B1-TR-008` | `B1-AX-03` | `B1-ST-DLV-02` | `B1-ST-DLV-03` | `ROUTED_DELIVERY` | `EXACT_DELIVERY` | `YES` | Terminal delivery event | `FAIL_CLOSED` |
| `B1-TR-009` | `B1-AX-04` | `B1-ST-VER-01` | `B1-ST-VER-02` | `INDEPENDENT_VERIFICATION` | `EXACT_HEAD_EVIDENCE` | `YES` | Nonterminal | `FAIL_CLOSED` |
| `B1-TR-010` | `B1-AX-04` | `B1-ST-VER-02` | `B1-ST-VER-03` | `INDEPENDENT_VERIFICATION` | `EXACT_HEAD_EVIDENCE` | `YES` | Exact evidence terminal | `FAIL_CLOSED` |
| `B1-TR-011` | `B1-AX-04` | `B1-ST-VER-02` | `B1-ST-VER-04` | `INDEPENDENT_VERIFICATION` | `EXACT_HEAD_EVIDENCE` | `YES` | Reversible after correction | `FAIL_CLOSED` |
| `B1-TR-012` | `B1-AX-04` | `B1-ST-VER-03` | `B1-ST-VER-05` | `CONTROL_DISPOSITION` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Reverify required | `FAIL_CLOSED` |
| `B1-TR-013` | `B1-AX-04` | `B1-ST-VER-04` | `B1-ST-VER-02` | `INDEPENDENT_VERIFICATION` | `EXACT_HEAD_EVIDENCE` | `YES` | Nonterminal retry | `FAIL_CLOSED` |
| `B1-TR-014` | `B1-AX-04` | `B1-ST-VER-05` | `B1-ST-VER-02` | `INDEPENDENT_VERIFICATION` | `EXACT_HEAD_EVIDENCE` | `YES` | Nonterminal recheck | `FAIL_CLOSED` |
| `B1-TR-015` | `B1-AX-05` | `B1-ST-ACC-01` | `B1-ST-ACC-02` | `ACCEPTANCE_DECISION` | `EXACT_HEAD_EVIDENCE` | `YES` | Nonterminal | `FAIL_CLOSED` |
| `B1-TR-016` | `B1-AX-05` | `B1-ST-ACC-02` | `B1-ST-ACC-03` | `ACCEPTANCE_DECISION` | `ACCEPTED_DECISION` | `YES` | Terminal decision | `FAIL_CLOSED` |
| `B1-TR-017` | `B1-AX-05` | `B1-ST-ACC-02` | `B1-ST-ACC-04` | `ACCEPTANCE_DECISION` | `ACCEPTED_DECISION` | `YES` | Terminal candidate | `FAIL_CLOSED` |
| `B1-TR-018` | `B1-AX-06` | `B1-ST-INT-01` | `B1-ST-INT-02` | `INTEGRATION_AUTHORIZATION` | `ACCEPTED_DECISION` | `YES` | Nonterminal | `FAIL_CLOSED` |
| `B1-TR-019` | `B1-AX-06` | `B1-ST-INT-02` | `B1-ST-INT-03` | `INTEGRATION_AUTHORIZATION` | `IMMUTABLE_REPOSITORY_EVENT` | `YES` | Terminal integration event | `FAIL_CLOSED` |
| `B1-TR-020` | `B1-AX-06` | `B1-ST-INT-03` | `B1-ST-INT-04` | `INTEGRATION_AUTHORIZATION` | `IMMUTABLE_REPOSITORY_EVENT` | `YES` | Terminal revert event | `FAIL_CLOSED` |
| `B1-TR-021` | `B1-AX-07` | `B1-ST-CTL-01` | `B1-ST-CTL-02` | `CONTROL_DISPOSITION` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Reversible hold | `FAIL_CLOSED` |
| `B1-TR-022` | `B1-AX-07` | `B1-ST-CTL-02` | `B1-ST-CTL-01` | `CONTROL_DISPOSITION` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Reopened, nonterminal | `FAIL_CLOSED` |
| `B1-TR-023` | `B1-AX-07` | `B1-ST-CTL-01` | `B1-ST-CTL-03` | `CONTROL_DISPOSITION` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Terminal object | `FAIL_CLOSED` |
| `B1-TR-024` | `B1-AX-07` | `B1-ST-CTL-02` | `B1-ST-CTL-03` | `CONTROL_DISPOSITION` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Terminal object | `FAIL_CLOSED` |
| `B1-TR-025` | `B1-AX-07` | `B1-ST-CTL-01` | `B1-ST-CTL-04` | `CONTROL_DISPOSITION` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Terminal superseded record | `FAIL_CLOSED` |
| `B1-TR-026` | `B1-AX-07` | `B1-ST-CTL-02` | `B1-ST-CTL-04` | `CONTROL_DISPOSITION` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Terminal superseded record | `FAIL_CLOSED` |
| `B1-TR-027` | `B1-AX-08` | `B1-ST-PRG-01` | `B1-ST-PRG-02` | `PROGRAM_TRANSITION_AUTHORITY` | `FRESH_MAIN_STATE_RECEIPT` | `YES` | Nonterminal Program | `FAIL_CLOSED` |
| `B1-TR-028` | `B1-AX-08` | `B1-ST-PRG-02` | `B1-ST-PRG-03` | `PROGRAM_TRANSITION_AUTHORITY` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Reversible hold | `FAIL_CLOSED` |
| `B1-TR-029` | `B1-AX-08` | `B1-ST-PRG-03` | `B1-ST-PRG-02` | `PROGRAM_TRANSITION_AUTHORITY` | `FRESH_MAIN_STATE_RECEIPT` | `YES` | Reopened Program | `FAIL_CLOSED` |
| `B1-TR-030` | `B1-AX-08` | `B1-ST-PRG-02` | `B1-ST-PRG-04` | `PROGRAM_TRANSITION_AUTHORITY` | `ACCEPTED_DECISION` | `YES` | Terminal Program | `FAIL_CLOSED` |
| `B1-TR-031` | `B1-AX-08` | `B1-ST-PRG-02` | `B1-ST-PRG-05` | `PROGRAM_TRANSITION_AUTHORITY` | `ACCEPTED_DECISION` | `YES` | Terminal Program | `FAIL_CLOSED` |
| `B1-TR-032` | `B1-AX-08` | `B1-ST-PRG-02` | `B1-ST-PRG-06` | `PROGRAM_TRANSITION_AUTHORITY` | `ACCEPTED_DECISION` | `YES` | Terminal Program | `FAIL_CLOSED` |
| `B1-TR-033` | `B1-AX-08` | `B1-ST-PRG-02` | `B1-ST-PRG-07` | `PROGRAM_TRANSITION_AUTHORITY` | `ACCEPTED_DECISION` | `YES` | Terminal Program | `FAIL_CLOSED` |
| `B1-TR-034` | `B1-AX-08` | `B1-ST-PRG-03` | `B1-ST-PRG-04` | `PROGRAM_TRANSITION_AUTHORITY` | `ACCEPTED_DECISION` | `YES` | Terminal Program | `FAIL_CLOSED` |
| `B1-TR-035` | `B1-AX-08` | `B1-ST-PRG-03` | `B1-ST-PRG-05` | `PROGRAM_TRANSITION_AUTHORITY` | `ACCEPTED_DECISION` | `YES` | Terminal Program | `FAIL_CLOSED` |
| `B1-TR-036` | `B1-AX-08` | `B1-ST-PRG-03` | `B1-ST-PRG-06` | `PROGRAM_TRANSITION_AUTHORITY` | `ACCEPTED_DECISION` | `YES` | Terminal Program | `FAIL_CLOSED` |
| `B1-TR-037` | `B1-AX-08` | `B1-ST-PRG-03` | `B1-ST-PRG-07` | `PROGRAM_TRANSITION_AUTHORITY` | `ACCEPTED_DECISION` | `YES` | Terminal Program | `FAIL_CLOSED` |
| `B1-TR-038` | `B1-AX-09` | `B1-ST-ACT-01` | `B1-ST-ACT-02` | `ACTIVATION_AUTHORITY` | `DIRECT_RUNTIME_EVIDENCE` | `YES` | Nonterminal; runtime inactive | `FAIL_CLOSED` |
| `B1-TR-039` | `B1-AX-09` | `B1-ST-ACT-02` | `B1-ST-ACT-03` | `ACTIVATION_AUTHORITY` | `DIRECT_RUNTIME_EVIDENCE` | `YES` | Runtime active | `FAIL_CLOSED` |
| `B1-TR-040` | `B1-AX-09` | `B1-ST-ACT-02` | `B1-ST-ACT-01` | `ACTIVATION_AUTHORITY` | `CONTROL_DISPOSITION_EVIDENCE` | `YES` | Runtime inactive | `FAIL_CLOSED` |
| `B1-TR-041` | `B1-AX-09` | `B1-ST-ACT-02` | `B1-ST-ACT-06` | `ACTIVATION_AUTHORITY` | `DIRECT_RUNTIME_EVIDENCE` | `YES` | Terminal attempt | `FAIL_CLOSED` |
| `B1-TR-042` | `B1-AX-09` | `B1-ST-ACT-03` | `B1-ST-ACT-04` | `ACTIVATION_AUTHORITY` | `DIRECT_RUNTIME_EVIDENCE` | `YES` | Reversible suspension | `FAIL_CLOSED` |
| `B1-TR-043` | `B1-AX-09` | `B1-ST-ACT-03` | `B1-ST-ACT-05` | `ACTIVATION_AUTHORITY` | `DIRECT_RUNTIME_EVIDENCE` | `YES` | Terminal activation instance | `FAIL_CLOSED` |
| `B1-TR-044` | `B1-AX-09` | `B1-ST-ACT-04` | `B1-ST-ACT-03` | `ACTIVATION_AUTHORITY` | `DIRECT_RUNTIME_EVIDENCE` | `YES` | Runtime active | `FAIL_CLOSED` |
| `B1-TR-045` | `B1-AX-09` | `B1-ST-ACT-04` | `B1-ST-ACT-05` | `ACTIVATION_AUTHORITY` | `DIRECT_RUNTIME_EVIDENCE` | `YES` | Terminal activation instance | `FAIL_CLOSED` |
| `B1-TR-046` | `B1-AX-10` | `B1-ST-MIR-01` | `B1-ST-MIR-02` | `MIRROR_MUTATION_AUTHORITY` | `CANONICAL_SOURCE_COMPARISON` | `YES` | Freshness-bound mirror | `FAIL_CLOSED` |
| `B1-TR-047` | `B1-AX-10` | `B1-ST-MIR-02` | `B1-ST-MIR-03` | `MIRROR_MUTATION_AUTHORITY` | `CANONICAL_SOURCE_COMPARISON` | `YES` | Mirror stale | `FAIL_CLOSED` |
| `B1-TR-048` | `B1-AX-10` | `B1-ST-MIR-02` | `B1-ST-MIR-04` | `MIRROR_MUTATION_AUTHORITY` | `CANONICAL_SOURCE_COMPARISON` | `YES` | Mirror conflicting | `FAIL_CLOSED` |
| `B1-TR-049` | `B1-AX-10` | `B1-ST-MIR-03` | `B1-ST-MIR-02` | `MIRROR_MUTATION_AUTHORITY` | `CANONICAL_SOURCE_COMPARISON` | `YES` | Freshness-bound mirror | `FAIL_CLOSED` |
| `B1-TR-050` | `B1-AX-10` | `B1-ST-MIR-04` | `B1-ST-MIR-02` | `MIRROR_MUTATION_AUTHORITY` | `CANONICAL_SOURCE_COMPARISON` | `YES` | Freshness-bound mirror | `FAIL_CLOSED` |

Transition rows: `50`; unique transition IDs: `50`; all source and target
states resolve; all transitions require separately granted authority.

## 9. Cross-axis invariants

| Invariant ID | Required invariant | Contradictory example | Required handling |
| --- | --- | --- | --- |
| `B1-INV-01` | `PLANNED` does not imply `ROUTED`. | Planning row used as route authority. | `FAIL_CLOSED` |
| `B1-INV-02` | `ROUTED` does not imply `DELIVERED`. | Route token used as delivery receipt. | `FAIL_CLOSED` |
| `B1-INV-03` | `DELIVERED` does not imply `VERIFIED`. | Commit or PR used as independent review. | `FAIL_CLOSED` |
| `B1-INV-04` | `VERIFIED` does not imply `ACCEPTED`. | Green checks used as Control decision. | `FAIL_CLOSED` |
| `B1-INV-05` | `ACCEPTED` does not imply `INTEGRATED`. | Acceptance token used as merge evidence. | `FAIL_CLOSED` |
| `B1-INV-06` | `INTEGRATED` does not imply `ACCEPTED`. | Merge used as acceptance evidence. | `FAIL_CLOSED` |
| `B1-INV-07` | `ACCEPTED` or `INTEGRATED` does not imply `ACTIVATED`. | Accepted docs or merged code treated as runtime. | `FAIL_CLOSED` |
| `B1-INV-08` | `HELD` preserves all other axis states and stops progression. | Hold clears or upgrades evidence. | `FAIL_CLOSED` |
| `B1-INV-09` | Reopen requires fresh Control disposition and records a later event. | Hold silently removed. | `FAIL_CLOSED` |
| `B1-INV-10` | `SUPERSEDED` requires a named replacement and preserves history. | Newer timestamp silently replaces record. | `FAIL_CLOSED` |
| `B1-INV-11` | Program active count remains `<= 1`. | Two Programs in `OPEN_FOR_BATCH_PLANNING_ONLY`. | `FAIL_CLOSED / HOLD_PORTFOLIO` |
| `B1-INV-12` | Successor opening requires immediate predecessor `CLOSED_ACCEPTED` plus every fresh Motion gate. | Merge or planning completion opens next Program. | `FAIL_CLOSED / KEEP_DOWNSTREAM_FROZEN` |
| `B1-INV-13` | `CLOSED_NO_GO`, Program `CANCELLED`, `FAILED`, or `UNRESOLVED_HOLD` freezes every downstream Program. | Successor transitions to open. | `FAIL_CLOSED / KEEP_DOWNSTREAM_FROZEN` |
| `B1-INV-14` | Linear mirror state changes no governance, repository, or activation axis. | Linear `Done` used as acceptance. | `FAIL_CLOSED` |
| `B1-INV-15` | Local-shadow UI states change no governance axis. | Demonstration `ACCEPTED` used as Program acceptance. | `FAIL_CLOSED` |
| `B1-INV-16` | Evidence class and capability credit cannot exceed the exact source ceiling. | Static docs promoted to runtime evidence. | `FAIL_CLOSED` |
| `B1-INV-17` | Unknown axis state prevents dependent progression. | Missing acceptance treated as accepted. | `FAIL_CLOSED / PRESERVE_UNKNOWN` |
| `B1-INV-18` | A terminal state on one axis does not automatically terminate other axes. | Repository revert silently cancels Program. | `FAIL_CLOSED` |

Invariant rows: `18`; unique invariant IDs: `18`.

## 10. Accepted historical-term mapping

`NO_LIFECYCLE_MAPPING / EVIDENCE_ONLY` means the term remains an evidence
classification and must not be converted into a lifecycle state.

| Mapping ID | Accepted or historical term | Source scope | Canonical state reference or exclusion | Mapping posture |
| --- | --- | --- | --- | --- |
| `B1-MAP-01` | `OPEN_FOR_BATCH_PLANNING_ONLY` | Program | `B1-ST-PRG-02` | `EXACT_PRESERVED` |
| `B1-MAP-02` | `NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN` | Program | `B1-ST-PRG-01` | `EXACT_PRESERVED` |
| `B1-MAP-03` | `CLOSED_ACCEPTED` | Program | `B1-ST-PRG-04` | `EXACT_PRESERVED` |
| `B1-MAP-04` | `CLOSED_NO_GO` | Program | `B1-ST-PRG-05` | `EXACT_PRESERVED` |
| `B1-MAP-05` | `CANCELLED` | Program | `B1-ST-PRG-06` | `EXACT_PRESERVED` |
| `B1-MAP-06` | `FAILED` | Program | `B1-ST-PRG-07` | `EXACT_PRESERVED` |
| `B1-MAP-07` | `UNRESOLVED_HOLD` | Program | `B1-ST-PRG-03` | `EXACT_PRESERVED` |
| `B1-MAP-08` | `PROPOSED / UNROUTED` | A6 Lane | `B1-ST-PLN-02`, `B1-ST-RTE-01` | `MULTI_AXIS_NORMALIZED` |
| `B1-MAP-09` | `NOT_DELIVERED` | A6 Lane | `B1-ST-DLV-01` | `EXACT_PRESERVED` |
| `B1-MAP-10` | `NOT_VERIFIED` | A6 Lane | `B1-ST-VER-01` | `EXACT_PRESERVED` |
| `B1-MAP-11` | `NOT_ACCEPTED` | A6 Lane | `B1-ST-ACC-01` | `EXACT_PRESERVED` |
| `B1-MAP-12` | `ROUTED_FOR_* / NOT_ACCEPTED` | Routed Lane | `B1-ST-RTE-02`, `B1-ST-ACC-01` | `MULTI_AXIS_NORMALIZED` |
| `B1-MAP-13` | `MERGED` | GitHub repository | `B1-ST-INT-03` | `REPOSITORY_AXIS_ONLY` |
| `B1-MAP-14` | `REVIEWED_DOCUMENTARY` or exact check pass | Evidence | `NO_LIFECYCLE_MAPPING / EVIDENCE_ONLY` | `EXCLUDED_FROM_STATE` |
| `B1-MAP-15` | A2 `ACCEPTED_CURRENT` | Evidence classification | `NO_LIFECYCLE_MAPPING / EVIDENCE_ONLY` | `EXCLUDED_FROM_STATE` |
| `B1-MAP-16` | `STATIC_CONFIGURATION` | Evidence classification | `NO_LIFECYCLE_MAPPING / EVIDENCE_ONLY` | `EXCLUDED_FROM_STATE` |
| `B1-MAP-17` | `MIRROR_ONLY` | Evidence classification | `NO_LIFECYCLE_MAPPING / EVIDENCE_ONLY` | `EXCLUDED_FROM_STATE` |
| `B1-MAP-18` | `CLOSED_PHASE_BOUND` | Historical exception | `B1-ST-RTE-03`, `B1-ST-CTL-04` | `MULTI_AXIS_NORMALIZED` |
| `B1-MAP-19` | `HELD_PENDING_ACCEPTED_BATCH_B` | D9 control posture | `B1-ST-CTL-02`, `B1-ST-RTE-01` | `MULTI_AXIS_NORMALIZED` |
| `B1-MAP-20` | `DOCUMENTARY`, `TESTED`, `BUILD_ONLY`, `STATIC_UI`, `MOCK_OR_SHADOW`, `RUNNING_OBSERVED`, `UNKNOWN` | A14/A15 evidence ceiling | `NO_LIFECYCLE_MAPPING / EVIDENCE_ONLY` | `EXCLUDED_FROM_STATE` |
| `B1-MAP-21` | local-shadow `DRAFT`, `VALIDATED`, `AWAITING_DECISION` | Local UI | `NO_LIFECYCLE_MAPPING / LOCAL_SHADOW_ONLY` | `EXCLUDED_FROM_STATE` |
| `B1-MAP-22` | local-shadow `ACCEPTED`, `HELD`, `REJECTED` | Local UI | `NO_LIFECYCLE_MAPPING / LOCAL_SHADOW_ONLY` | `EXCLUDED_FROM_STATE` |
| `B1-MAP-23` | GitHub Draft PR or open PR | Repository surface | `B1-ST-DLV-03`, `B1-ST-INT-01` | `MULTI_AXIS_NORMALIZED` |
| `B1-MAP-24` | Vercel preview success | Build/preview evidence | `NO_LIFECYCLE_MAPPING / EVIDENCE_ONLY` | `EXCLUDED_FROM_STATE` |
| `B1-MAP-25` | Linear `Backlog`, `In Progress`, or `Done` | Mirror | `B1-ST-MIR-02`, `B1-ST-MIR-03`, or `B1-ST-MIR-04` only after comparison | `MIRROR_AXIS_ONLY` |
| `B1-MAP-26` | `live`, `active`, or `configured` without direct receipts | Static or ambiguous source | `B1-ST-ACT-01` or `UNKNOWN`; never `B1-ST-ACT-03` | `FAIL_CLOSED` |
| `B1-MAP-27` | `records-later-event` | A2 provenance relation | `NO_LIFECYCLE_MAPPING / RELATION_ONLY` | `EXCLUDED_FROM_STATE` |
| `B1-MAP-28` | `supersedes` | A2 provenance relation | `B1-ST-CTL-04` only with a named replacement and accepted disposition | `CONDITIONALLY_NORMALIZED` |

Mapping rows: `28`; unique mapping IDs: `28`; every canonical state reference
or explicit exclusion resolves.

## 11. Required surface separation

| Surface | Controlling representation | May establish | Cannot establish |
| --- | --- | --- | --- |
| Governance lifecycle | Axes `B1-AX-01`, `02`, `04`, `05`, `07`, and `08` | Bounded planning, route, review, decision, disposition, and Program posture when separately evidenced | Repository integration, runtime activation, or mirror truth by implication |
| Repository and PR lifecycle | Axes `B1-AX-03` and `06` | Delivery and integration events at exact commits/PRs | Verification, acceptance, Program transition, or activation |
| Evidence classification | Accepted A2 and A14/A15 evidence vocabularies | Provenance, confidence, freshness, and ceiling | Lifecycle transition or authority |
| Local UI or shadow loop | Local kernel/UI terms at their exact test or observation ceiling | Local demonstration behavior only | Program, Batch, Lane, Work Packet, CONTROL_THREAD, or runtime lifecycle |
| Runtime and activation | Axis `B1-AX-09` plus future separately governed evidence | Runtime posture only with direct evidence and fresh authority | Inference from docs, tests, builds, previews, observation text, or acceptance |
| Linear mirror | Axis `B1-AX-10` | Mirror freshness or conflict posture | Canonical route, delivery, verification, acceptance, integration, Program state, or activation |

## 12. Fail-closed unknown and contradiction handling

1. If an axis is omitted, record that axis as `UNKNOWN`; do not substitute an
   adjacent state.
2. If two claims address different axes, preserve both and do not call them a
   contradiction.
3. If two claims address the same axis, subject, scope, and time and cannot
   both govern, preserve both, classify the conflict, and set the dependent
   transition to `HELD`.
4. If evidence is stale, unavailable, mirror-only, local-shadow, or above its
   ceiling, dependent progression is prohibited.
5. If a transition is not listed in section 8, it is invalid.
6. An invalid transition preserves the source state, emits no target state,
   grants no authority, and requires a fresh explicit disposition.
7. A compound update must validate every affected axis independently. One
   valid axis change cannot carry an invalid one.
8. A later event does not erase earlier evidence. Use an accepted
   `records-later-event`, `corrects`, `narrows`, `phase-bounds`, or
   `supersedes` relation as applicable.
9. A held object may be reopened only through the listed transition and fresh
   authority. Reopen preserves the prior hold record.
10. A superseded record remains immutable historical evidence and cannot be
    reactivated; a replacement uses a new identity.

## 13. Deferred dependencies on B2-B15

| Future Lane | Reserved subject | B1 boundary |
| --- | --- | --- |
| `B2` | Control Coordinates Canon | B1 uses existing coordinates but defines no coordinate schema. |
| `B3` | Program Charter Schema | B1 defines no charter fields. |
| `B4` | Batch/Wave/Lane Decomposition Canon | B1 assigns no decomposition or ownership. |
| `B5` | Role and Authority Matrix | B1 names authority classes but assigns no role or principal. |
| `B6` | Work Packet Canon | B1 defines no packet schema. |
| `B7` | Decision Token and Disposition Canon | B1 defines no token format or issuance protocol. |
| `B8` | Evidence Bundle Schema | B1 names evidence requirement classes but defines no bundle schema. |
| `B9` | Receipt Taxonomy | B1 does not define receipt classes. |
| `B10` | Acceptance Receipt and Integrity Schema | B1 defines no acceptance receipt or integrity mechanism. |
| `B11` | Capability and Credit Ledger | B1 grants and calculates no capability credit. |
| `B12` | Exception and Out-of-Sequence Work Canon | B1 creates no exception. |
| `B13` | Rollback, Reopen, and Supersession detail | B1 defines conceptual semantics only, not implementation or receipt detail. |
| `B14` | GitHub-Linear Mirror Protocol | B1 defines mirror posture only, not synchronization protocol. |
| `B15` | Independent verification and Batch B closeout | B1 cannot verify itself or close Batch B. |

Deferred rows: `14`; no future Lane is routed or absorbed.

## 14. Risks, rollback, and open questions

Primary risks are collapsing axes in downstream tools, confusing evidence
classification with lifecycle state, treating merge or Linear status as
acceptance, and interpreting Program `active` as runtime `ACTIVATED`. The
invariants and fail-closed rules prevent those upgrades.

Open questions reserved for later Control decisions:

- whether every object type must materialize all ten axes or only applicable
  axes;
- exact receipt and integrity representation for each transition;
- role-specific transition authority and separation-of-duties rules;
- exception, retry, rollback, and supersession implementation mechanics; and
- mirror transport, conflict repair, and freshness thresholds.

Rollback is a separately authorized normal revert of the single B1
documentation commit. This proposal changes no runtime, schema, workflow,
package, database, provider, mirror, or external system.

## 15. Recommendation to CONTROL_THREAD

`GO_TO_CONTROL_THREAD_B1_CANON_DECISION`

The accepted source terms reconcile into ten orthogonal axes, 43 unique
states, 50 valid conceptual transitions, 18 fail-closed invariants, and 28
historical mappings without inventing authority or absorbing B2-B15.
CONTROL_THREAD may independently review the exact B1 head and decide whether
to accept, hold, or revise the proposal.

This recommendation does not make the vocabulary canon, accept B1, authorize
merge, route B2, close Batch B, route D9, change Program state, or activate
any system.

## 16. Explicit non-authorizations

This artifact does not authorize or perform source, test, workflow, package,
schema, configuration, browser, runtime, provider, database, persistence,
network, credential, GitHub-application, Linear, Agent, Council, customer, or
production mutation; role assignment; coordinate creation; Work Packet,
decision-token, evidence-bundle, receipt, integrity, capability-credit,
exception, rollback-protocol, mirror-protocol, or acceptance-outcome
definition beyond the bounded conceptual terms above; ready conversion;
merge; deployment; branch deletion; B1 self-acceptance; B2-B15 execution;
Batch B exit; D9 execution; Program transition or exit; authority transfer;
or JAI activation.

`B1_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_PROPOSED_LIFECYCLE_VOCABULARY_AND_STATE_MACHINE_ONLY`

`B1_RECOMMENDATION: GO_TO_CONTROL_THREAD_B1_CANON_DECISION`

`B1_ACCEPTANCE: PENDING_INDEPENDENT_CONTROL_THREAD_VERIFICATION`

`B1_MERGE_AUTHORITY: NOT_GRANTED`

`B2_EXECUTION_AUTHORITY: NOT_GRANTED`

`BATCH_B_EXIT_CREDIT: NONE`

`D9_EXECUTION_AUTHORITY: HELD_PENDING_ACCEPTED_BATCH_B`

`PROGRAM_EXIT_CREDIT: NONE`

`JAI_ACTIVATION_CREDIT: NONE`

`NEXT_REQUIRED_DECISION: ACCEPT_B1_BUILDER_PR_FOR_CONTROL_THREAD_DECISION`

## 17. Immutable reference definitions

[MOTION-DECISION]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/.nexus/motions/motion-0248/decision.yaml
[OPENING-RECEIPT]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/docs/reference/q3m7y26-jai-governance-intelligence-main-state-operating-loop-program-opening-receipt-v0.md
[A2]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md
[A4]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/docs/reference/q3m7y26-p1-a4-ratified-motion-decision-registry-v0.md
[A5]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/docs/reference/q3m7y26-p1-a5-active-frozen-program-registry-v0.md
[A6]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/docs/reference/q3m7y26-p1-a6-control-coordinate-registry-v0.md
[A8]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md
[A13]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/docs/reference/q3m7y26-p1-a13-gap-risk-blocker-register-v0.md
[A14]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/docs/reference/q3m7y26-p1-a14-main-state-capsule-independent-review-v0.md
[A15]: https://github.com/jai-nexus/dev-jai-nexus/blob/0bacc2dac38810bf0e70b28a16eb689a6517cb7e/docs/reference/q3m7y26-p1-a15-main-state-disposition-batch-a-closeout-v0.md
[A15-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/36afc2172d820f722588672fc01ea0a839546ef6
[A15-MERGE]: https://github.com/jai-nexus/dev-jai-nexus/commit/0bacc2dac38810bf0e70b28a16eb689a6517cb7e
[JAI-198]: https://linear.app/jai-nexus/issue/JAI-198/q3m7y26-p1b1-lifecycle-vocabulary-and-state-machine
