# Q3M7 Accepted Main-State Reconciliation Planning v0

Role: JAI::DEV::ARCHITECT

Observed at: `2026-07-17T09:45:12Z`

## 1. Purpose

This artifact defines the planning baseline for accepted main-state
reconciliation in Program 1, Batch A, Wave A-A, Lane A1.

It:

- distinguishes accepted current state from ratified phase-specific history,
  legacy claims, static configuration, placeholders, mocks, deferred or
  disabled facilities, mirrors, unavailable evidence, contradictions, and
  unresolved gaps;
- defines a minimum contradiction-ledger contract;
- records evidence precedence, provenance, freshness, and supersession rules;
- separates control-thread, executor, voting, and model-slot concepts;
- identifies a bounded candidate A2 follow-up without routing it; and
- preserves the accepted one-active-Program and zero-gate boundaries.

This is a planning artifact. It does not implement a ledger, parser, runtime,
provider integration, selector, Council, Agent, persistence layer, API,
database, UI, or automatic progression mechanism.

CONTROL_THREAD decides.

## 2. Program / Batch / Wave / Lane identity

| Field | Value |
| --- | --- |
| Program title | `Q3M7Y26 JAI Governance Intelligence — Main-State Reconciliation and Minimum Viable Operating Loop v0` |
| Program code | `Q3M7Y26-P1` |
| Canonical Program ID | `jai-governance-intelligence-main-state-operating-loop-v0` |
| Batch | `A — Accepted Main-State Reconciliation` |
| Wave | `A-A — DEFINED_FOR_A1 / NO_EXECUTION_AUTHORITY` |
| Lane | `A1 — Accepted Main-State Reconciliation Planning v0` |
| Thread | `2026-07-17_control_thread` |
| Executor-role interface | `JAI::DEV::ARCHITECT` |
| Normalized authorization | `AUTHORIZE_ROUTE_PROGRAM_1_BATCH_A_WAVE_A_A_LANE_A1_PLANNING` |
| Route effect | Defines Wave A-A and routes Lane A1 planning only |
| A2 posture | `NOT_ROUTED` |

Before this route, Batch A was `PLANNING_AUTHORIZED / NOT_ROUTED` and no Wave
or Lane was defined. This route defines Wave A-A and Lane A1 only. It does not
route A2 or grant execution authority.

The executor-role interface is filled by Codex_Control_Thread for this bounded
Work Packet. That classification does not create, activate, dispatch, or
persist a JAI Agent.

## 3. Accepted baseline

The accepted repository basis is:

| Evidence | Accepted ref | Effect |
| --- | --- | --- |
| Motion 0248 | `291e2006f1a7af9711d1b7c822ac46abc9569557` | Ratified the fixed four-Program sequence and opening rules. |
| Motion 0248 receipt repair | `3cc3268d2f2ce1d0219b211e6611fe20ca036acf` | Reconciled the merged execution receipt without opening a Program. |
| Program 1 opening packet | `57f291cf915ca0d2ebaa39fb8f9637d74410d204` | Established readiness for a fresh human opening decision. |
| Program 1 opening receipt | `6f9dea1904066c45a75f3789377d32c2b0b16106` | Durably records Program 1 open for Batch planning only. |

The A1 branch begins at
`6f9dea1904066c45a75f3789377d32c2b0b16106`. At preflight, local `main`,
`origin/main`, and GitHub default `main` matched that SHA after a clean
fast-forward.

Motion 0248, the opening packet, and the opening receipt remain historically
accurate for their own observation times. Later evidence does not rewrite
their earlier zero-active, not-open, or Linear-not-mutated statements. The
opening receipt records the later authoritative `0 -> 1` Program transition,
and the separately created Linear Program mirror records a still later
non-authoritative mirror event.

## 4. Authority and evidence hierarchy

Conflicting claims are evaluated in this order:

1. Fresh explicit HUMAN_OPERATOR instruction.
2. Accepted CONTROL_THREAD decision receipts.
3. Merged Motion and Program records.
4. Ratified historical Motions within their accepted scope.
5. Current repository configuration and source evidence.
6. Generated snapshots and validation evidence.
7. Cross-repository observations.
8. GitHub and Linear mirrors.
9. Legacy, mock, placeholder, illustrative, or unavailable claims.

Higher precedence does not delete lower-precedence history. A lower item may
remain authoritative within its original phase or subject, but it cannot
expand current authority beyond fresher accepted controls.

HUMAN_OPERATOR retains constitutional authority. CONTROL_THREAD routes,
holds, and accepts under HUMAN_OPERATOR authority. Repository artifacts,
GitHub, Linear, executor output, voting output, and model-slot labels cannot
accept themselves or transfer authority.

## 5. Current accepted Program state

Current authoritative state:

```text
PROGRAM_1_OPENING_RECEIPT: ACCEPTED_ON_MAIN
ACTIVE_PROGRAM_COUNT: 1
PROGRAM_1: OPEN_FOR_BATCH_PLANNING_ONLY
NO_OTHER_PROGRAM_ACTIVE: true
BATCH_A: PLANNING_AUTHORIZED / A1_ROUTED
WAVE_A_A: DEFINED_FOR_A1 / NO_EXECUTION_AUTHORITY
LANE_A1: PLANNING_ONLY
A2: NOT_ROUTED
BATCHES_B_F: CANDIDATE / NOT_ROUTED
PROGRAMS_2_4: NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN
EXECUTION_GATES_GRANTED: 0
```

The one-active-Program invariant remains:

`active_program_count <= 1`

Program opening grants bounded Batch planning. It does not grant Batch,
Wave, Lane, Work Packet, runtime, provider, database, deployment, or
production execution.

## 6. Program and Corpus claim state

| Source | Claim posture | Classification | Current treatment |
| --- | --- | --- | --- |
| Program 1 opening receipt | Program 1 is the sole active Program and is open for Batch planning only. | `ACCEPTED_CURRENT` | Governs current Program state. |
| `.nexus/motions/motion-0248/` | Fixed four-Program order, one-active invariant, fresh receipts, and separate execution routes. | `ACCEPTED_CURRENT` | Governs portfolio sequence and Program boundaries. |
| `.nexus/programs/program-graph.yaml` | Partial graph generated `2026-04-05`; Corpus V2 era and `q2-corpus-v2-live-value-loop` are marked open. | `LEGACY` | Historical Program/Corpus taxonomy; not the current active-Program ledger. |
| `.nexus/docs/corpus-v2-readiness-criteria.md` | Corpus V2 began with motion-0123 and advisory Agent participation is required. | `RATIFIED_PHASE_SPECIFIC` | Preserved as the accepted Corpus-era claim for that historical phase; does not activate a current Agent or second Program. |
| `.nexus/canon/corpus/corpus-v2-readiness-gate.md` | Corpus V2 remains blocked and live Agent drafting/voting are absent. | `CONTRADICTORY` | Conflicts with later Corpus V2 opening text; retain both and require explicit scope/time reconciliation. |
| `.nexus/canon/corpus/corpus-v2-readiness-surface.md` | Static display says Corpus V2 is gated/not open and grants no runtime. | `STATIC_CONFIGURATION` | Non-authoritative visibility posture. |

The Program graph declares `coverage: partial` and predates Motion 0248 and the
Program 1 opening receipt. Its open Corpus V2 Program claim cannot increase
the current active count.

Historical Corpus V2 records may remain valid as records of an earlier
governance era. They do not prove current provider execution, active JAI
Agents, an active JAI Council, or current Program authority.

## 7. Control-thread classification

| Name | Current classification | Authority boundary |
| --- | --- | --- |
| `HUMAN_OPERATOR` | Constitutional authority origin | May authorize, amend, hold, or stop work. |
| `ChatGPT_Control_Thread` | Current high-context routing and acceptance workflow under HUMAN_OPERATOR authority | May route and accept only within fresh human authority; does not become JAI participation. |
| `Codex_Control_Thread` | Bounded repository-wide execution and evidence collection | Cannot accept its own work, automatically progress, transfer authority, or represent itself as a persistent JAI Agent. |
| `JAI_Control_Thread` | Future native governance engine | Inactive; no runtime, routing, acceptance, provider, or mutation authority. |

CONTROL_THREAD is a workflow role, not proof of an activated Agent. Current
ChatGPT or Codex analysis is not JAI Agent or JAI Council participation.

## 8. Executor Agent role classification

The current executor-role interfaces are exactly:

| Executor role | Planning interpretation | Activation posture |
| --- | --- | --- |
| `JAI::DEV::OPERATOR` | Triage, handoffs, and task packets | Interface only; not activated or persistently assigned. |
| `JAI::DEV::ARCHITECT` | Specs, contracts, design decisions, and acceptance criteria | Interface only; fills A1 under the fresh route. |
| `JAI::DEV::BUILDER` | Approved implementation diffs | Interface only; no implementation is authorized in A1. |
| `JAI::DEV::VERIFIER` | Reproducible checks and evidence | Interface only; no independent Agent is activated. |
| `JAI::DEV::LIBRARIAN` | Durable documentation and knowledge | Interface only; distinct from the Council voting-role label `librarian`. |

`roles/README.md` calls these portable Roles that any agent/provider can fill.
`roles/rolemap.json` supplies path rules. `jai-agents/MASTER_ROLEMAP.json` is a
dated static registry generated on `2026-01-27` from only `dev-jai-nexus` and
`docs-nexus`; it is partial identity evidence, not current activation evidence.

The term "Agent" in a filename, schema, role ID, or historical record does not
establish identity, tools, memory, runtime, dispatch, provider use, or
authority.

## 9. Voting Agent role classification

Voting roles are separately classified as:

| Voting role | Intended internal function | Current boundary |
| --- | --- | --- |
| `Proposer` | Drafts or amends a candidate Motion posture. | No repository execution or acceptance authority. |
| `Challenger` | Adversarially evaluates claims, evidence, and risk. | No repository execution or acceptance authority. |
| `Arbiter` | Resolves an internal voting posture or deadlock. | Does not supersede HUMAN_OPERATOR or current CONTROL_THREAD acceptance authority. |

Motions 0046-0049 record manual votes for proposer, challenger, and arbiter.
Those vote records are ratified historical evidence for their Motions. They
do not prove that persistent voting Agents or a Council runtime are active
today.

## 10. Executor / voting separation of duties

The minimum separation is:

1. Executor roles execute only fresh, bounded Work Packets.
2. Voting roles deliberate on prioritization, Motion posture, and Program
   acceptance posture.
3. An executor does not vote on its own work by default.
4. A voting role does not receive repository execution authority by voting.
5. Evidence collection does not become a vote.
6. A vote does not become implementation, acceptance, or automatic delivery.
7. Arbiter resolution is internal to the voting posture and remains subject to
   HUMAN_OPERATOR and CONTROL_THREAD authority.
8. The optional Council role `librarian` is not `JAI::DEV::LIBRARIAN`.

Any future combination of executor and voting duties requires an explicit
conflict disclosure, a fresh route, and independent acceptance evidence.

## 11. Model-slot source inventory

| Source | Observed shape | Classification | Authority boundary |
| --- | --- | --- | --- |
| `.nexus/model-slots.yaml` | Five candidates and one selector for each of five panels; all use `openai / gpt-5`. | `PLACEHOLDER / LEGACY` | Does not represent independent reasoning, current staffing, runtime, or activation. |
| `.nexus/model-slots-phase1.yaml` | Ten executor slots, two per panel, across Anthropic and OpenAI; five deferred selectors; three voting-role assignments. | `RATIFIED_PHASE_SPECIFIC` | Canonical only for Phase 1 staffing; `live` and `active` labels are configuration metadata. |
| `.nexus/agent-panels.yaml` | Five executor panels, two candidate slots each, selectors marked `deferred`. | `STATIC_CONFIGURATION` | Defines scaffold shape only. |
| Motions 0047-0049 panel artifacts | Two candidate files per panel; placeholder selection records use `UNKNOWN` winners and zero scores. | `MOCK / PLACEHOLDER` | Scaffold evidence; not selection, provider dispatch, or runtime evidence. |
| `.nexus/council.config.yaml` | Voting mechanics, three required roles, two optional roles, deadlock setting. | `STATIC_CONFIGURATION` | Configuration does not prove Council activation or binding authority. |

Model slots are reasoning positions. They are not Agents, executor roles,
voting roles, votes, providers, sessions, or authority.

The Phase 1 manifest lists Proposer and Arbiter on the same Anthropic model and
lists Challenger on OpenAI. Shared model or provider assignments must be
disclosed. They must not be represented as independent consensus merely
because they occupy different named slots.

## 12. Selector, panel, and Council state

Current selector and panel findings:

- each executor panel has exactly two configured candidates;
- all five selector blocks are `status: deferred`;
- the Phase 1 deferred selector slots have `live: false`;
- Motion 0049 proves scaffold parity only;
- Motion 0049 explicitly leaves scoring, winner determination, selector
  activation, runtime orchestration, and Agent loops unproven;
- generated selection records under Motions 0047-0049 contain `task:
  "UNKNOWN"`, `winner: "UNKNOWN"`, and zero scores; and
- no selector, panel, Council, or provider command was run in A1.

`.nexus/council.config.yaml` is a static default for voting mechanics. Its
required roles are proposer, challenger, and arbiter. Its optional
`librarian` and `meta_analyst` labels are Council vocabulary, not executor
identity or activation.

The Council configuration permits an Arbiter action after deadlock. That
mechanical setting does not grant final human authority and does not
supersede current CONTROL_THREAD acceptance.

## 13. Motions 0046-0049 reconciliation

| Motion | Ratified scope | Preserved finding | Current reconciliation |
| --- | --- | --- | --- |
| `motion-0046` | Phase 1 dual-provider staffing manifest, deferred selectors, and voting-role assignments. | Ratified historical governance state; no silent amendment. | Phase-specific configuration remains evidence. "Live/active" does not prove runtime. Arbiter "final decision authority" wording conflicts with current human-supervised acceptance and requires future explicit reconciliation. |
| `motion-0047` | `loadSlots()` Phase 1 overlay and first Librarian scaffold consumer. | Proves repository code can overlay Phase 1 slots. | Does not prove provider calls, persistent Agents, or runtime orchestration. |
| `motion-0048` | Two candidates per panel and deferred selectors. | Current panel structure is reconciled to the Phase 1 manifest. | Does not activate selection or Council behavior. |
| `motion-0049` | Scaffold parity across five executor panels. | All five panels scaffold with two candidates and the overlay. | Selection, winner behavior, selector activation, runtime orchestration, and Agent loops remain explicitly unproven. |

Motion 0046 is not invalidated. Its staffing decision remains ratified within
its Phase 1 scope. Current HUMAN_OPERATOR direction and later accepted
controls bound its authority language without rewriting its record.

Any amendment to Motion 0046, the Phase 1 manifest, panel configuration, or
Council configuration requires a separate explicit route. A1 recommends no
such mutation.

## 14. Minimum-five target and Program 2 boundary

The current HUMAN_OPERATOR target is a minimum five-model-slot reasoning
subset per JAI Thread or JAI Agent.

That target is an accepted planning requirement, not evidence of:

- a five-slot implementation;
- five independent models;
- five independent providers;
- active provider sessions;
- activated Agents;
- a synthesis kernel;
- voting or consensus authority; or
- accepted runtime behavior.

Same-model and same-provider slots require explicit provenance disclosure and
must not be counted as independent consensus without qualification.

Program 2 owns the future
`jai-five-slot-compounded-reasoning-shadow-kernel-v0` scope. Program 2 remains
`NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN`. Motion 0248 requires Program 1
to be `CLOSED_ACCEPTED` before Program 2 may open, plus a fresh main-state
receipt and named opening receipt.

A1 may identify missing contracts and contradictions. It may not draft,
route, ratify, implement, run, or validate the Program 2 shadow kernel.

## 15. Motion-to-Program / PR surface state

`portal/src/lib/controlPlane/jaiControlThreadMotionProposal.ts` is an
app-local static display helper with posture:

`APP_LOCAL / LOCAL_STATIC_DISPLAY_DRAFT_METADATA / NON_AUTHORITATIVE`

The helper explicitly states:

- CONTROL_THREAD remains routing, acceptance, and hold authority;
- proposal display and advisory review are not acceptance;
- Council/advisory votes are not binding;
- planning seeds are not routed work;
- no JAI Control Thread, Council, or Agent runtime is activated;
- no provider/model/API dispatch occurs;
- no GitHub or target-repository mutation occurs; and
- no automatic routing, delivery, or progression occurs.

Its proposed Program, Batch, Wave, and Lane fields are static preview data for
an earlier Q3M7 Program. They do not compete with Motion 0248 or create current
Program work.

Current GitHub state has zero open PRs. A1 may create a branch, commit, and
push under the route, but it may not create or merge a PR. A future PR cannot
accept the artifact by its own existence.

## 16. GitHub, Linear, cross-repo, and mirror state

### GitHub

Preflight observed:

- default branch: `main`;
- default SHA: `6f9dea1904066c45a75f3789377d32c2b0b16106`;
- PR 379: closed and merged;
- PR 379 title: `docs(reference): record Program 1 opening receipt`;
- PR 379 squash: `6f9dea1904066c45a75f3789377d32c2b0b16106`;
- receipt artifact: present on `main`;
- open PR count: `0`; and
- target A1 branch: absent before local creation.

Four older Q3M7 remote branches remain, each one commit ahead of an old merge
base and substantially behind current `main`:

| Branch | Ahead | Behind | Current treatment |
| --- | ---: | ---: | --- |
| `docs/q3m7-control-thread-passalong-persistence-implementation-plan-v0` | 1 | 85 | Stale, unaccepted branch evidence; owner review. |
| `docs/q3m7-operator-batch-tracker-field-ownership-review-v0` | 1 | 128 | Stale, unaccepted branch evidence; owner review. |
| `docs/q3m7-sandbox-dot-nexus-experimental-surface-definition-v0` | 1 | 68 | Stale, unaccepted branch evidence; owner review. |
| `feature/q3m7-native-motion-intake-composer-v0` | 1 | 100 | Stale source branch; no current execution authority. |

### Linear

The Program-level mirror remains:

| Field | Value |
| --- | --- |
| Project ID | `95da6eaa-73a3-4eb2-adfc-1a08a3ac67ba` |
| Display alias | `Q3M7Y26 JAI Governance Intelligence — Main-State Reconciliation + MV Loop v0` |
| Canonical title in description | Exact 100-character Program title |
| State | `In Progress` |
| Team | `CONTROL_THREAD` / `JAI` |
| Posture | `MIRROR_ONLY / PROGRAM_OPEN / CONTROL_THREAD_REMAINS_AUTHORITY` |

The older `JAI Motion Control Plane Activation v0` Project remains a separate
historical temporary mirror. Neither Project is Program authority. Linear was
read only in A1.

### Sibling repositories

Sibling observations are local checkout evidence only. No sibling was fetched
or mutated in A1, so remote-ref freshness is not independently established.

| Repository | Local HEAD | Observed checkout posture |
| --- | --- | --- |
| `api-nexus` | `38f0ec7353994eef2aa81a1e78a73eaa8f8bd203` | `main`, 17 behind observed `origin/main` |
| `audit-nexus` | `6964c2bfa50e753468082a46187e88b3b0a99956` | Clean review branch |
| `jai-format` | `9ca9654d7d2c333964b7caee5192ea8597ea9108` | Gone docs branch |
| `vscode-nexus` | `929d5beb823db9e60c299048827eac2a12486968` | Gone docs branch |
| `docs-nexus` | `d6eeb406f5d1d21b2b8b36bd8d3375ad20425551` | Gone branch; untracked `AGENTS.md` and `CLAUDE.md` |
| `lifecycle-nexus` | `14e71846af0aa33c0adda2b3880267f646f04963` | Clean `main`, aligned to observed `origin/main` |
| `jai-nexus-legacy` | `6b832d7d623d47b100978363774221ce2936fecb` | Clean `main`, historical archive |
| `compliance-nexus` | `d0036cb28cfcbeb03b0547682d330c941d04ef59` | Clean `main`, aligned to observed `origin/main` |
| `orchestrator-nexus` | `b16fc84a5f796502a394b5f598c1009277ef3ab5` | Gone docs branch |
| `jai-nexus` | `12264f0835e3c2c91f908a29a4a4a4420c0b3466` | `main`, 26 behind observed `origin/main` |
| `workflow-nexus` | `f985db54bfb05a9f7d65e79498b32b4425776454` | Clean `main`, aligned to observed `origin/main` |
| `.github` | `83f4136c0185e1b64194e67eb8533a7c56517e7d` | Non-main branch; untracked deployment workflow |
| `sandbox-nexus` | `93fb80aa032748b01ed1943e04ba030a475284d9` | Gone docs branch |
| `jai-edge` | `182978c7befe0540b525455967c5a4c812e3749d` | Gone CI branch |

These observations do not transfer authority, establish accepted cross-repo
state, or authorize cleanup.

## 17. Contradiction inventory

This A1 inventory uses the minimum ledger shape. It is planning evidence, not
an accepted machine ledger.

| claim_id | domain | claim | source_ref | observed_status | conflict_or_gap | current_disposition | supersession_or_follow_up | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PROGRAM-001` | Program | Program 1 is the sole active Program and is open for Batch planning only. | `docs/reference/q3m7y26-jai-governance-intelligence-main-state-operating-loop-program-opening-receipt-v0.md@6f9dea1` | `ACCEPTED_CURRENT` | Legacy open-Program claims exist elsewhere. | Governing current state. | Preserve legacy rows; current receipt controls active count. | Active count is one. |
| `MOTION-0248-001` | Motion | Fixed four-Program sequence; opening grants planning only; separate routes are required. | `.nexus/motions/motion-0248/**@6f9dea1` | `ACCEPTED_CURRENT` | Earlier artifacts use different Program and activation vocabulary. | Governing portfolio envelope. | Material change requires human amendment or superseding Motion. | Programs 2-4 remain frozen. |
| `PROGRAM-LEGACY-001` | Program | Corpus V2 live-value-loop Program is open. | `.nexus/programs/program-graph.yaml` | `LEGACY` | Conflicts with the receipt-backed one-active Program ledger. | Historical taxonomy only. | Reconcile in a separately routed ledger; do not count as active. | Graph is partial and dated `2026-04-05`. |
| `CORPUS-001` | Corpus | Corpus V2 began at motion-0123 and advisory Agent participation is required. | `.nexus/docs/corpus-v2-readiness-criteria.md` | `RATIFIED_PHASE_SPECIFIC` | Does not establish current Agent runtime or Program authority. | Preserve within historical Corpus-era scope. | Record temporal and authority bounds in future ledger. | Motion-era claim, not deletion candidate. |
| `CORPUS-002` | Corpus | Corpus V2 remains blocked and live Agent drafting/voting are absent. | `.nexus/canon/corpus/corpus-v2-readiness-gate.md` | `CONTRADICTORY` | Conflicts with later Corpus V2 begun/open text. | Retain as contradictory historical evidence. | Future route must establish dates, accepted scope, and supersession. | No silent rewrite. |
| `CONTROL-001` | Control thread | HUMAN_OPERATOR governs; ChatGPT routes/accepts; Codex executes/evidences; JAI_Control_Thread is inactive. | Fresh A1 route plus accepted opening receipt | `ACCEPTED_CURRENT` | Older static architecture may use broader control-thread language. | Governing classification for A1. | Future native activation requires separate Program authority. | No JAI participation inferred. |
| `EXECUTOR-001` | Executor roles | Five `JAI::DEV::*` names are portable executor-role interfaces. | `roles/README.md`; `roles/rolemap.json` | `STATIC_CONFIGURATION` | "Agent" terminology can be mistaken for activation. | Use as role interfaces only. | Future registry work must separate identity, role, and runtime. | Exactly five current dev roles. |
| `EXECUTOR-002` | Executor roles | MASTER_ROLEMAP is a complete current Agent registry. | `jai-agents/MASTER_ROLEMAP.json` | `LEGACY` | Generated `2026-01-27`; scans only two repos and proves no runtime. | Partial static inventory. | Refresh only through a separate registry route. | External agency registry remains unavailable. |
| `ROLE-GUARD-001` | Role guard | A1 uses `JAI::DEV::ARCHITECT` for a `docs/reference` planning artifact. | Fresh A1 route; `roles/rolemap.json`; `.github/workflows/role-guardrails.yml` | `UNRESOLVED` | `docs/reference` matches no explicit rule, and default allowed roles omit Architect; a future PR is expected to fail the mechanical role guard. | CONTROL_THREAD hold for acceptance-path reconciliation. | Separate decision must authorize a rolemap/path correction or another explicit compliant acceptance path. | A1 does not modify guardrails or change the required role. |
| `VOTING-001` | Voting roles | Motion 0046 says Arbiter makes final governance calls. | `.nexus/motions/motion-0046/proposal.md`; `.nexus/model-slots-phase1.yaml` | `CONTRADICTORY` | Current direction limits Arbiter to internal voting posture under HUMAN_OPERATOR and CONTROL_THREAD. | Motion 0046 remains ratified within phase scope; current authority is human-supervised. | Possible future Motion vocabulary reconciliation; no A1 amendment. | Arbiter cannot supersede human authority. |
| `VOTING-002` | Voting roles | Council optional `librarian` is the executor `JAI::DEV::LIBRARIAN`. | `.nexus/council.config.yaml`; `roles/README.md` | `UNRESOLVED` | Same word names different namespaces and duties. | Treat as distinct labels. | Future schema should add explicit namespace/type fields. | No identity merge. |
| `MODEL-LEGACY-001` | Model slots | Thirty all-OpenAI candidate slots and five selectors represent current staffing. | `.nexus/model-slots.yaml` | `PLACEHOLDER` | Superseded for Phase 1 by Motion 0046, but file remains present. | Legacy fallback/config evidence only. | Future reconciliation may deprecate through a separate Motion. | Same model in every slot is not independence. |
| `MODEL-P1-001` | Model slots | Ten dual-provider slots are canonical Phase 1 staffing. | `.nexus/model-slots-phase1.yaml`; motion-0046 | `RATIFIED_PHASE_SPECIFIC` | Labels do not prove provider sessions or current runtime. | Preserve as Phase 1 staffing configuration. | Program 2 must define any future five-slot kernel separately. | Two candidates per executor panel. |
| `MODEL-LIVE-001` | Model slots | `live: true`, `providers_active`, and `models_active` prove execution. | `.nexus/model-slots-phase1.yaml` | `STATIC_CONFIGURATION` | No provider/runtime evidence accompanies the labels. | Non-runtime configuration only. | Require provider-neutral runtime receipts in a separately opened Program. | No dispatch in A1. |
| `SELECTOR-001` | Selectors | Selectors are active and choose winners. | `.nexus/agent-panels.yaml`; `.nexus/model-slots-phase1.yaml` | `DEFERRED` | All selector blocks are deferred and Phase 1 selector slots have `live: false`. | Not active. | Separate evaluation-harness and activation route required. | No selector command run. |
| `SELECTOR-002` | Selectors | Motion panel selection files prove winner behavior. | `.nexus/motions/motion-0047..0049/panels/**/selection.json` | `MOCK` | Records contain unknown tasks/winners and zero scores. | Scaffold placeholders only. | Future tests must prove scoring and winner behavior. | Motion 0049 says behavior is unproven. |
| `COUNCIL-001` | Council | Council config proves an active Council and binding vote path. | `.nexus/council.config.yaml` | `STATIC_CONFIGURATION` | No activation, provider, participant, or current vote receipt exists. | Static mechanics only. | Program 4 owns any bounded activation pilot. | No Council run in A1. |
| `FIVE-SLOT-001` | Model slots | Each JAI Thread or JAI Agent should use at least five model slots. | Fresh HUMAN_OPERATOR A1 route | `ACCEPTED_CURRENT` | No accepted implementation, independence contract, or runtime proof exists. | Planning target only. | Program 2 may address after Program 1 closes accepted and is separately opened. | Same-model/provider disclosure required. |
| `PROGRAM2-001` | Program boundary | Five-slot shadow-kernel implementation may occur in Program 1. | Motion 0248 plus fresh A1 route | `DISABLED` | Program 2 exclusively owns this future scope and is frozen. | Prohibited in Program 1. | Wait for Program 1 `CLOSED_ACCEPTED` and a fresh Program 2 opening receipt. | No draft or implementation in A1. |
| `SURFACE-001` | Static source | Motion proposal helper can route or accept work. | `portal/src/lib/controlPlane/jaiControlThreadMotionProposal.ts` | `STATIC_CONFIGURATION` | Source explicitly says display, review, votes, and planning seeds are non-authoritative. | Static preview only. | Any runtime adoption requires separate source route and acceptance. | No source change in A1. |
| `GITHUB-001` | GitHub | Four old Q3M7 branches represent current routed work. | GitHub branch/compare readback at `2026-07-17T09:45:12Z` | `UNRESOLVED` | Each is one commit ahead but 68-128 commits behind current main; no open PR exists. | Stale branch evidence with no current authority. | Owner review; no cleanup authorized. | A1 branch was absent at preflight. |
| `LINEAR-001` | Linear | Program 1 mirror is Program authority. | Linear Project `95da6eaa-73a3-4eb2-adfc-1a08a3ac67ba` | `MIRROR_ONLY` | Project is In Progress but cannot route, accept, or change active count. | Current non-authoritative mirror. | Keep linked to receipt; update only by separate route. | Linear read only in A1. |
| `LINEAR-002` | Linear | Historical Motion Control Plane Project is current Program 1. | Linear Project `fc8749fe-0eac-4105-9157-f83110a66870` | `MIRROR_ONLY` | Separate older temporary mirror. | Historical mirror only. | Independent mirror-hygiene route if ever changed. | No mutation authorized. |
| `AGENCY-001` | External registry | A current external agency registry proves Agent readiness. | Search for `agents.index.json` and `agents.generated.yaml`; Motion 0248 validation receipt | `UNAVAILABLE` | No registry is available in the local workspace. | No Agent/Council readiness claim. | Resolve before any activation claim. | No substitute registry fabricated. |
| `CROSS-REPO-001` | Cross-repo | Sibling checkout state is current portfolio authority. | Local sibling HEAD/status observations at `2026-07-17T09:45:12Z` | `UNRESOLVED` | Several checkouts are stale, gone-branch, behind, or dirty; remote refs were not refreshed. | Advisory observations only. | Fresh per-repo routes required before use. | No cross-repo mutation. |

## 18. Minimum contradiction-ledger contract

The minimum ledger row must contain exactly these semantic fields:

| Field | Requirement |
| --- | --- |
| `claim_id` | Stable, unique identifier; never reused after supersession. |
| `domain` | Bounded subject such as Program, Corpus, control thread, role, model slot, Motion, GitHub, Linear, or cross-repo. |
| `claim` | One normalized factual or authority claim; no compound hidden claims. |
| `source_ref` | Exact path, object ID, URL, branch, commit SHA, or observation reference. |
| `observed_status` | Exactly one value from the controlled vocabulary below. |
| `conflict_or_gap` | Explicit contradiction, missing evidence, scope mismatch, or `none`. |
| `current_disposition` | Current handling without deleting history or implying acceptance. |
| `supersession_or_follow_up` | Exact superseding evidence or separately routed follow-up. |
| `notes` | Observation time, freshness limit, authority boundary, and useful context. |

Controlled `observed_status` vocabulary:

| Status | Meaning |
| --- | --- |
| `ACCEPTED_CURRENT` | Current receipt-backed or freshly directed state. |
| `RATIFIED_PHASE_SPECIFIC` | Ratified within a bounded historical phase or subject. |
| `LEGACY` | Older evidence retained for history but not current control. |
| `STATIC_CONFIGURATION` | Repository declaration without runtime proof. |
| `PLACEHOLDER` | Deliberately provisional value or scaffold. |
| `MOCK` | Non-production or illustrative evidence. |
| `DEFERRED` | Intentionally postponed and not active. |
| `DISABLED` | Explicitly unavailable or prohibited in current scope. |
| `MIRROR_ONLY` | External visibility record without source-of-truth authority. |
| `UNAVAILABLE` | Required evidence could not be accessed or does not exist. |
| `CONTRADICTORY` | Two preserved claims cannot both govern the same scope/time. |
| `UNRESOLVED` | A known gap lacks an accepted disposition or follow-up receipt. |

Contract rules:

1. One claim per row.
2. Append or supersede; never erase history to create coherence.
3. Pin repository claims to a commit whenever practical.
4. Record external object IDs, observation timestamps, and freshness limits.
5. Separate descriptive truth from authority claims.
6. Treat static labels as static unless independent runtime evidence exists.
7. Record both sides of a contradiction.
8. Name the superseding receipt; do not infer supersession from chronology
   alone.
9. Require a fresh CONTROL_THREAD disposition for every `UNRESOLVED` authority
   or acceptance-path conflict.
10. A ledger row cannot route work, activate behavior, cast a vote, accept
    evidence, or open a gate.

## 19. Provenance and freshness rules

Every future ledger observation must record:

- evidence owner or authority origin;
- exact repository and path or external object ID;
- commit SHA, branch/ref, or immutable URL where available;
- observation timestamp in UTC;
- whether remote state was refreshed;
- whether the evidence is accepted, ratified for a phase, static, generated,
  mirrored, historical, or unavailable;
- scope and time for which the claim is valid;
- validation method;
- known gaps and inaccessible sources; and
- the receipt that controls current disposition.

Freshness rules:

1. `origin/main` and GitHub default `main` must agree for repository-current
   claims.
2. Local sibling checkout evidence is advisory unless that repository is
   freshly fetched under its own route.
3. GitHub branch and PR observations are mirrors of repository delivery state,
   not Program acceptance.
4. Linear observations are mirrors and must cite the governing repository
   receipt.
5. Generated snapshots inherit authority only from accepted source inputs and
   validation.
6. Runtime, provider, security, credential, and database claims require direct
   evidence; configuration labels are insufficient.
7. Unavailable evidence remains unavailable. No synthetic substitute is
   permitted.

## 20. Supersession rules

Supersession requires an explicit relation:

- `supersedes`: newer evidence intentionally replaces a prior claim for the
  same scope;
- `narrows`: newer evidence limits an earlier broad claim;
- `phase-bounds`: an earlier claim remains valid only for its named phase;
- `corrects`: newer evidence repairs an error while preserving provenance;
- `records-later-event`: a newer receipt records a later state transition
  without making the earlier observation false; or
- `does-not-supersede`: evidence is parallel, advisory, or about another
  domain.

Chronology alone does not supersede ratified history. A filename containing
`canon`, `live`, `active`, `Agent`, or `Council` does not establish current
authority.

Specific A1 relationships:

- the Program 1 opening receipt records a later event than Motion 0248's
  zero-active state;
- the Linear Program mirror records a later mirror event than the receipt's
  issuance-time `LINEAR_MIRROR: NOT_MUTATED` observation;
- Motion 0046 phase-bounds the Phase 1 staffing manifest but does not prove
  current runtime;
- current human-supervised authority narrows Motion 0046 Arbiter wording
  without silently amending the Motion; and
- Motion 0248 and the opening receipt control active-Program state over the
  partial legacy Program graph.

## 21. Batch A prerequisites

Before later Batch A work may be routed:

1. A1 must be reviewed and accepted through a separate CONTROL_THREAD
   disposition.
2. The `JAI::DEV::ARCHITECT` versus `docs/reference` role-guard mismatch must
   receive an explicit compliant resolution.
3. The A1 artifact must be the only changed path in its branch.
4. `origin/main` and GitHub default `main` must be freshly reverified.
5. No conflicting open PR or current lane may cover the same scope.
6. The contradiction-ledger fields, vocabulary, evidence hierarchy,
   provenance rules, and supersession rules must be accepted.
7. Motion 0046 must remain unmodified unless a separate Motion route is
   explicitly authorized.
8. Program 2 scope must remain frozen.
9. Linear must remain mirror-only.
10. External agency-registry unavailability must remain explicit.
11. No runtime, provider, database, Agent, Council, deployment, or production
    readiness may be inferred from planning evidence.
12. A new route must state exact repository, branch, artifact, role, scope,
    validation, and non-authorizations.

## 22. Candidate A2 follow-up boundary

A2 is a candidate only. It is not routed by A1.

A separately authorized A2 could:

- turn the A1 inventory into a durable, reviewed contradiction-ledger
  artifact;
- pin every current repository claim to a fresh accepted SHA;
- assign explicit disposition owners and follow-up classes;
- reconcile the Architect/docs-reference acceptance-path mismatch;
- propose, without applying, a Motion 0046 Arbiter vocabulary reconciliation;
- define namespace-safe executor, voting, and Council role fields; and
- identify which claims require later Batch B lifecycle or receipt work.

A2 may not, unless separately and expressly authorized:

- edit `.nexus`, Motion 0046, rolemaps, model-slot files, panel files, Council
  configuration, source, tests, workflows, packages, schemas, or validators;
- implement a parser, ledger service, runtime, provider path, database, API,
  or UI;
- activate an Agent, Council, selector, model slot, or Program 2 capability;
  or
- route A3, another Wave, another Batch, or a Work Packet.

The A2 candidate remains blocked behind independent A1 acceptance and the
named role-guard disposition.

## 23. A1 acceptance and exit evidence

A1 may be considered for acceptance only when the external lane closeout
records:

- starting and ending `origin/main`;
- exact branch and one commit;
- exact one-file scope;
- artifact line count;
- required section, ledger-column, vocabulary, role, boundary, and
  recommendation checks;
- `git diff --check`;
- `git diff --cached --check`;
- portal lint and typecheck exits;
- push and upstream synchronization;
- final clean worktree;
- GitHub branch readback;
- unchanged Linear mirror readback;
- explicit non-actions; and
- independent CONTROL_THREAD disposition.

The artifact cannot accept itself. A branch, commit, push, or future PR does
not resolve the role-guard hold or route A2.

A1 exit posture before independent acceptance is:

`STAGED_PENDING_PR / CONTROL_THREAD_REVIEW_REQUIRED`

## 24. Non-authorized behaviors

A1 does not authorize:

- edits to `.nexus`;
- Motion or motionSnapshot changes;
- opening-receipt changes;
- source-code or test changes;
- workflow, package, dependency, schema, validator, rolemap, model-slot,
  Agent-panel, or Council-config changes;
- parser, persistence, API, database, migration, or UI implementation;
- runtime activation;
- provider/model/API dispatch or spending;
- credential or secret access;
- five-slot implementation;
- Agent identity creation, activation, dispatch, or persistent assignment;
- Council or panel activation;
- synthetic votes;
- Motion acceptance;
- Program acceptance, closure, or active-count change;
- Program 2-4 activity;
- Batch B-F routing;
- A2 routing;
- Work Packet creation;
- Linear mutation;
- cross-repository mutation;
- PR creation or merge;
- deployment or production gates;
- automatic routing, delivery, acceptance, or progression; or
- authority or source-of-truth transfer.

## 25. Risks and holds

| Risk | Severity | Current disposition |
| --- | --- | --- |
| Required Architect role is not allowed by the default rolemap path for `docs/reference`. | High acceptance-path risk | Named CONTROL_THREAD hold; no silent role change or guardrail edit. |
| Motion 0046 calls Arbiter final decision authority. | Medium governance-language risk | Preserve Motion; current human-supervised boundary controls; future explicit reconciliation candidate. |
| Program graph and Corpus documents contain open/active claims that conflict across time and scope. | Medium ledger risk | Preserve and classify; current receipt controls Program count. |
| Phase 1 files use `live` and `active` labels without runtime/provider evidence. | High interpretation risk | Static configuration only. |
| External agency registry is unavailable. | High future activation risk | No activation/readiness claim; non-blocking for planning only. |
| Four old Q3M7 branches remain far behind main. | Medium stale-work risk | Owner review; no cleanup authorized. |
| Several sibling checkouts are stale, gone-branch, behind, or dirty. | Medium cross-repo freshness risk | Advisory only; fresh per-repo routes required. |
| Linear mirrors can appear operational because they are In Progress. | Low authority-confusion risk | Mirror-only labels and repository receipt links remain controlling. |

The acceptance-path risk is procedural but concrete: the current workflow
would evaluate `docs/reference/q3m7-accepted-main-state-reconciliation-planning-v0.md`
under `defaultAllowedRoles`, which lists Builder and Verifier but not
Architect. A1 neither conceals nor repairs that mismatch.

## 26. Verification notes

Pre-authoring verification:

- worktree clean;
- `origin/main` fetched;
- local `main` fast-forwarded cleanly;
- local `main`, `origin/main`, and GitHub default `main` all
  `6f9dea1904066c45a75f3789377d32c2b0b16106`;
- PR 379 closed and merged at the exact receipt squash;
- receipt artifact present on `main`;
- open PR count zero;
- target branch and artifact absent;
- Linear Program mirror unchanged and read only;
- external agency-registry filenames absent from the local workspace; and
- no conflicting A1 artifact observed.

Read-only repository evidence included:

- the Program opening packet and receipt;
- Motion 0248;
- Motions 0046-0049 and their scaffold artifacts;
- both model-slot manifests;
- Agent panel and Council configuration;
- rolemap, role documentation, MASTER_ROLEMAP, and role-guard workflow;
- Program graph and relevant Corpus V2 claims;
- the static JAI Control Thread motion-proposal helper;
- current GitHub branch and PR state;
- current Linear Program mirror; and
- locally available sibling-repository HEAD and status observations.

Final pre-staging validation against the completed artifact:

- required section and order scan: exit `0`; 28/28 sections;
- contradiction-ledger shape scan: exit `0`; required columns and 25
  inventory rows;
- observed-status vocabulary scan: exit `0`;
- authority, role, separation, provenance, Program 2, mirror, A2, and
  recommendation scans: exit `0`;
- unresolved template-marker scan: exit `0`;
- positive execution-authority scan: no match;
- one-file untracked scope scan: exact authorized artifact only;
- `git diff --check`: exit `0`;
- untracked artifact whitespace check: no diagnostic;
- `corepack pnpm -C portal lint`: exit `0`; and
- `corepack pnpm -C portal typecheck`: exit `0`.

Cached-diff, commit, push, upstream, GitHub branch-readback, and final-clean
results belong to the external lane closeout and are not preclaimed here.

No test, runtime, provider, selector, Council, Agent, database, migration,
browser, deployment, or production command was required or run.

## 27. Decision recommendation

`HOLD_FOR_CONTROL_THREAD_RECONCILIATION`

Reason:

The evidence domains are sufficiently classified for planning, but the
required `JAI::DEV::ARCHITECT` PR role conflicts with the repository's
mechanical default role allowance for the only changed `docs/reference` path.
That acceptance-path mismatch must receive an explicit CONTROL_THREAD
resolution before A1 can be accepted or A2 can be separately considered.

This hold does not reject Motion 0046, change Program state, route A2, or grant
permission to edit role guardrails.

## 28. ZERO GATES GRANTED

```text
PROGRAM: Q3M7Y26-P1
PROGRAM_1: OPEN_FOR_BATCH_PLANNING_ONLY
BATCH_A: PLANNING_AUTHORIZED / A1_ROUTED
WAVE_A_A: DEFINED_FOR_A1 / NO_EXECUTION_AUTHORITY
LANE_A1: PLANNING_ONLY / STAGED_PENDING_PR
A2: NOT_ROUTED
BATCHES_B_F: CANDIDATE / NOT_ROUTED
PROGRAMS_2_4: DOWNSTREAM_FROZEN
LINEAR_AUTHORITY: NONE
EXECUTION_GATES_GRANTED: 0
ZERO EXECUTION GATES GRANTED
```
