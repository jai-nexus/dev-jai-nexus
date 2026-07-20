# Q3M7Y26-P1 A2 Authority and Evidence Precedence + Contradiction Ledger v0

Role: JAI::DEV::BUILDER

## 1. Purpose

This artifact implements the bounded A2 Work Packet for Program
`Q3M7Y26-P1`. It turns the accepted A1 authority and evidence inventory into
durable documentary canon for:

- source precedence;
- claim classification;
- provenance and freshness;
- conflict handling;
- supersession;
- the current contradiction ledger;
- repository-visibility limits; and
- the exact read-only A3 reconciliation contract.

This is a documentary, one-path governance artifact. It does not execute A3,
change source or configuration, mutate a mirror, activate a runtime, or open
an execution gate.

## 2. Program / route / lane identity

| Field | Value |
| --- | --- |
| Program | `Q3M7Y26-P1` |
| Batch | `A` |
| Wave | `A-A` |
| Lane | `A2` |
| Route | `CT-2026-07-19-Q3M7Y26-P1-START-A2-A3-D3-v0` |
| Work Packet | `Q3M7Y26-P1-A2-v0` |
| Repository | `jai-nexus/dev-jai-nexus` |
| Required base | `1b1dcd3251092f193440d92406a09c2294f81701` |
| Branch | `docs/q3m7y26-p1-a2-authority-evidence-precedence-v0` |
| Authorized path | `docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md` |
| Mode | `DOCUMENTARY / ONE_PATH / NO_RUNTIME / NO_AUTHORITY_TRANSFER` |
| Artifact posture | `DRAFT_FOR_INDEPENDENT_CONTROL_THREAD_REVIEW` |
| Evidence cutoff | `2026-07-19T22:07:38Z` |

The A2 route was mirrored in Linear issue `JAI-186` and in Linear document
`6b3f74ed-d9aa-4610-a76b-1da97175e0d3`. Those objects describe the routed
packet but remain mirrors. The fresh HUMAN_OPERATOR route and accepted
repository records control.

## 3. Accepted source basis

| Evidence | Pinned source | Current effect |
| --- | --- | --- |
| Motion 0248 | `.nexus/motions/motion-0248/**@291e2006f1a7af9711d1b7c822ac46abc9569557` | Governs the fixed four-Program sequence, one-active invariant, and separate opening rules. |
| Motion 0248 receipt repair | `3cc3268d2f2ce1d0219b211e6611fe20ca036acf` | Reconciles the merged Motion receipt without independently opening a Program. |
| Program 1 opening packet | `57f291cf915ca0d2ebaa39fb8f9637d74410d204` | Records readiness for the later human opening decision. |
| Program 1 opening receipt | `6f9dea1904066c45a75f3789377d32c2b0b16106` | Records Program 1 as the sole active Program, open for Batch planning only. |
| Accepted A1 reconciliation | `docs/reference/q3m7-accepted-main-state-reconciliation-planning-v0.md@cac7fa273cddd5e38ac30d26870fa04ab6476a18` | Supplies the accepted hierarchy, vocabulary, ledger shape, and historical contradiction inventory used here. |
| Current D1 repository event | `.github/workflows/portal-ci-guardrails.yml@a0e7b76af02899659529355773bf293d58269897` | Adds bounded control-plane behavioral tests to the repository CI contract. |
| Current D2 repository event | local operating-loop implementation and tests at `1b1dcd3251092f193440d92406a09c2294f81701` | Adds the bounded local operating-loop proving seam; it does not prove production or provider runtime. |
| Fresh A2 route | `CT-2026-07-19-Q3M7Y26-P1-START-A2-A3-D3-v0` | Routes this one-path documentary lane under `JAI::DEV::BUILDER`. |

The required base is a later repository event than the accepted A1 snapshot.
That temporal relation does not make A1 false at its observation time.

## 4. Source-precedence matrix

Conflicting claims are evaluated in the following order. Precedence controls
the current disposition for a shared scope and time; it does not erase
lower-precedence history.

| Rank | Source class | Authority effect | Evidence treatment | Freshness requirement |
| ---: | --- | --- | --- | --- |
| 1 | Fresh explicit HUMAN_OPERATOR instruction | May authorize, amend, hold, or stop bounded work. | Preserve exact route, scope, and non-authorizations. | Must apply to the current lane and not be superseded by a later human instruction. |
| 2 | Accepted CONTROL_THREAD decision receipt | May route, hold, or accept only within HUMAN_OPERATOR authority. | Governs the named decision and accepted scope. | Must be accepted and pinned to an immutable repository record when one exists. |
| 3 | Merged Motion and Program record | Governs the ratified Motion or Program transition it records. | Treat phase and subject bounds as part of the claim. | Verify against fresh default-branch state. |
| 4 | Ratified historical Motion | Remains authoritative inside its accepted historical phase. | Preserve even when later controls narrow or phase-bound it. | Pin the Motion and identify any later accepted relationship. |
| 5 | Current repository configuration and source | Proves what the repository declares or implements. | Does not prove runtime, activation, authority, provider use, or acceptance by itself. | Pin to a fresh default-branch SHA. |
| 6 | Generated snapshot and validation evidence | Proves the bounded inputs and checks actually represented. | Inherits no authority beyond its sources and validation method. | Record generator, inputs, SHA, command, and observation time. |
| 7 | Cross-repository observation | May describe another repository or dependency edge. | Advisory until that repository is freshly verified under an authorized route. | Record repository, ref, remote-refresh state, and access limits. |
| 8 | GitHub or Linear mirror | Provides delivery, visibility, or coordination evidence. | Cannot route, accept, activate, close, or transfer source-of-truth authority. | Record installation or object ID, query time, result scope, and pagination. |
| 9 | Legacy, mock, placeholder, illustrative, or unavailable evidence | Preserves historical intent, scaffolding, or an evidence gap. | Cannot create current authority or substitute for missing proof. | Retain its original time and scope; do not promote by filename or label. |

Rules:

1. HUMAN_OPERATOR remains the constitutional authority origin.
2. CONTROL_THREAD acts only within fresh human authority.
3. Codex output, executor output, voting output, repository text, GitHub, and
   Linear cannot accept themselves.
4. A higher-ranked source controls only an overlapping claim, scope, and time.
5. A later observation is not automatically a superseding authority.
6. Repository implementation evidence is distinct from operational,
   production, provider, and acceptance evidence.
7. A mirror may corroborate a repository event but cannot replace its merged
   record.

## 5. Claim-classification vocabulary

Every ledger row uses exactly one `observed_status` value from this controlled
vocabulary.

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
| `CONTRADICTORY` | Two preserved claims cannot both govern the same scope and time. |
| `UNRESOLVED` | A known gap lacks an accepted disposition or follow-up receipt. |

Classification describes the evidence posture. It does not grant authority.
Terms such as `live`, `active`, `Agent`, `Council`, `canon`, `default`, or
`In Progress` do not change classification without the evidence required by
this contract.

## 6. Minimum contradiction-ledger contract

Every row contains exactly these semantic fields:

| Field | Requirement |
| --- | --- |
| `claim_id` | Stable, unique identifier; never reused after supersession. |
| `domain` | Bounded subject such as Program, Motion, role, model slot, GitHub, Linear, or cross-repo. |
| `claim` | One normalized factual or authority claim; no hidden compound claims. |
| `source_ref` | Exact path, object ID, branch, commit SHA, or observation reference. |
| `observed_status` | Exactly one value from the controlled vocabulary. |
| `conflict_or_gap` | Explicit contradiction, missing evidence, scope mismatch, or `none`. |
| `current_disposition` | Current handling without deleting history or implying acceptance. |
| `supersession_or_follow_up` | Exact relation, superseding evidence, owner, or separately routed follow-up. |
| `notes` | Observation time, freshness limit, authority boundary, and useful context. |

Ledger rules:

1. Use one normalized claim per row. Link paired rows for a conflict.
2. Append or supersede; never erase history to manufacture coherence.
3. Pin repository claims to immutable commits whenever practical.
4. Record external object IDs, observation times, query scope, and access
   limitations.
5. Separate descriptive truth from authority.
6. Treat static labels as static unless independent runtime evidence exists.
7. Preserve both sides of a contradiction.
8. Name an explicit supersession relation; chronology alone is insufficient.
9. Require a fresh CONTROL_THREAD disposition for unresolved authority or
   acceptance-path conflicts.
10. A row cannot route work, activate behavior, cast a vote, accept evidence,
    mutate a mirror, or open a gate.

## 7. Provenance rules

Every new observation must record:

- evidence owner or authority origin;
- exact repository and path or external object ID;
- commit SHA, branch/ref, or immutable URL when available;
- UTC observation time;
- whether remote state was refreshed;
- classification;
- the scope and time in which the claim is valid;
- validation method;
- known gaps and inaccessible sources; and
- the accepted receipt controlling the current disposition.

For GitHub installation evidence, also record the installation ID, account,
query, pagination, visible result count, and whether organization-wide
completeness was independently established.

For Linear evidence, record the Project, issue, or document ID and the
repository receipt it mirrors. A Linear status or update timestamp is not a
Program transition.

For generated evidence, record the generator, exact input refs, output path,
validation command, and content hash when the output is expected to become
durable.

## 8. Freshness rules

1. Repository-current claims require a refreshed `origin/main` and an exact
   default-branch SHA.
2. A local working tree is advisory until its remote basis is refreshed.
3. A historical default-branch snapshot remains valid for its observation
   time but must not be presented as the current tip after later merges.
4. GitHub branch, pull-request, check, and installation results are mirrors of
   the result scope returned by the connected installation.
5. Linear is a coordination mirror and must cite the governing repository
   receipt.
6. Cross-repository claims require a fresh, repository-specific observation.
   A repository name is not responsibility evidence.
7. Generated snapshots inherit freshness only from their pinned inputs and
   successful validation.
8. Runtime, provider, credential, security, database, and production claims
   require direct evidence. Configuration and tests alone are insufficient.
9. Unavailable evidence remains unavailable. Do not synthesize a replacement.
10. Record a new row or `records-later-event` relation when a fresh observation
    advances state.

## 9. Conflict rules

A conflict exists only after claim scope and time are normalized.

| Condition | Required handling |
| --- | --- |
| Same scope and time; claims cannot both govern | Mark the relevant claim `CONTRADICTORY`, preserve both source refs, and require disposition. |
| Different observation times | Use `records-later-event` unless an accepted source explicitly corrects or supersedes the earlier claim. |
| Different visibility scopes | Mark the completeness gap `UNRESOLVED`; do not infer deletion, creation, or absence. |
| Authority claim versus mirror claim | Preserve the mirror as `MIRROR_ONLY`; the mirror cannot displace the accepted authority record. |
| Static declaration versus runtime claim | Preserve static evidence as `STATIC_CONFIGURATION`; require direct runtime evidence. |
| Historical phase versus current phase | Use `phase-bounds` or `narrows`; do not rewrite the historical record. |
| Source unavailable | Mark `UNAVAILABLE`, name the missing evidence, and stop any conclusion that depends on it. |

Uncertainty must be carried forward explicitly. Numeric disagreement does not
establish which source is complete until query scope and freshness are
reconciled.

## 10. Supersession rules

Only these explicit relations are permitted:

- `supersedes`: intentionally replaces a prior claim for the same scope;
- `narrows`: limits an earlier broad claim;
- `phase-bounds`: preserves a claim only for its named phase;
- `corrects`: repairs an error while preserving provenance;
- `records-later-event`: records a later transition without making the prior
  observation false; and
- `does-not-supersede`: parallel, advisory, or differently scoped evidence.

Every relation must name both source refs and the shared scope. A merge, newer
timestamp, filename, branch name, or mirror update does not imply
supersession.

Current mandatory relations:

- the Program 1 opening receipt `records-later-event` relative to Motion
  0248's issuance-time zero-active posture;
- the Program 1 Linear mirror `records-later-event` only as a mirror relative
  to the receipt's issuance-time `LINEAR_MIRROR: NOT_MUTATED` observation;
- accepted A1 remains the controlling planning basis, while
  `records-later-event` relates the D1 and D2 repository changes to A1's
  earlier main snapshot;
- current `origin/main` at
  `1b1dcd3251092f193440d92406a09c2294f81701`
  `records-later-event` relative to A1's observed
  `6f9dea1904066c45a75f3789377d32c2b0b16106`;
- the connected GitHub installation's 19 visible repositories
  `does-not-supersede` the historical 68-repository planning input because
  completeness and visibility scope are unresolved; and
- the current Program 1 Linear mirror `does-not-supersede` the older Motion
  Control Plane Project; both remain mirrors, while only repository receipts
  govern Program state.

## 11. Current repository evidence

Fresh preflight established:

```text
origin/main: 1b1dcd3251092f193440d92406a09c2294f81701
required base: 1b1dcd3251092f193440d92406a09c2294f81701
base match: true
working branch: docs/q3m7y26-p1-a2-authority-evidence-precedence-v0
branch start: origin/main
pre-authoring worktree: clean
authorized path absent before authoring: true
```

The latest accepted repository sequence at the A2 base is:

| Commit | Repository event | Bounded evidence effect |
| --- | --- | --- |
| `6f9dea1904066c45a75f3789377d32c2b0b16106` | Program 1 opening receipt merged. | Program 1 is the sole active Program and is open for planning only. |
| `cac7fa273cddd5e38ac30d26870fa04ab6476a18` | Accepted A1 reconciliation merged. | A1 precedence, vocabulary, ledger, and provenance rules become the basis for A2. |
| `a0e7b76af02899659529355773bf293d58269897` | D1 CI guardrail merged. | The portal CI contract includes bounded control-plane behavioral tests. |
| `1b1dcd3251092f193440d92406a09c2294f81701` | D2 local operating-loop proving seam merged. | The local, mock-or-shadow proving seam and tests exist on main; no production/runtime activation is established. |

D1 and D2 are current repository evidence. Their merged code, tests, and CI
contract do not by themselves establish founder observation, provider
dispatch, production readiness, authority transfer, or Program acceptance.

## 12. Repository-visibility limitations

The historical artifact
`docs/reference/operator-portfolio-active-subset-display-planning-v0.md`
records an accepted display-planning input of 68 GitHub repositories at
commit `1dfbb6b1bb874b82fbed929c332783591945925b`, committed on
`2026-06-24`. That artifact explicitly did not re-run inventory.

The GitHub installation connected during A2 evidence collection was:

| Field | Observation |
| --- | --- |
| Installation ID | `73964376` |
| Account | `jai-nexus` |
| Query | Installed repositories visible to the connected installation |
| Evidence cutoff | `2026-07-19T22:07:38Z` |
| Visible count | `19` |
| Organization-wide completeness proven | `false` |

The 19 visible repository names were:

1. `jai-nexus`
2. `datacontracts-nexus`
3. `orchestrator-nexus`
4. `.github`
5. `docs-nexus`
6. `jai-edge`
7. `codex-core`
8. `jai-pilot`
9. `jai-format`
10. `jai`
11. `api-nexus`
12. `jai-nexus-legacy`
13. `dev-jai-nexus`
14. `nexus-core`
15. `community-nexus`
16. `integrations-nexus`
17. `sot-nexus`
18. `audit-nexus`
19. `jai-vscode`

The difference between 68 and 19 is 49, but that arithmetic is not lifecycle
evidence. It does not prove that 49 repositories are missing, deleted,
archived, private, renamed, transferred, or outside the organization. It
proves only that the historical portfolio count and the current connected
installation result cannot be reconciled without broader authorized evidence.

No ownership or dependency direction may be inferred from repository names.
The connected installation result is a bounded visible subset, not a complete
organization inventory.

## 13. Linear mirror state

| Linear object | Observed state | Classification | Current treatment |
| --- | --- | --- | --- |
| Project `95da6eaa-73a3-4eb2-adfc-1a08a3ac67ba` | Current Program 1 mirror, `In Progress`; records A1 accepted, D1/D2 merged, A2 and D3 routed-ready, and A3 blocked by A2. | `MIRROR_ONLY` | Current coordination visibility only. Repository receipts govern. |
| Issue `JAI-186` | Mirrors the exact A2 packet, base, branch, role, path, checks, and stop conditions. | `MIRROR_ONLY` | Corroborates the fresh route; cannot accept A2. |
| Document `6b3f74ed-d9aa-4610-a76b-1da97175e0d3` | Mirrors the coordinated A2 to A3 and D3 route. | `MIRROR_ONLY` | Supplies the mirrored A3 contract reproduced below. |
| Project `fc8749fe-0eac-4105-9157-f83110a66870` | Older `JAI Motion Control Plane Activation v0` temporary mirror remains `In Progress`. | `MIRROR_ONLY` | Historical mirror only; not current Program 1 and not authority. |

The two `In Progress` Projects do not prove two active Programs. The current
Program mirror records the later coordination state. The legacy Project is
stale for current Program identity but remains preserved as historical mirror
evidence. Neither can route, accept, close, or mutate Program state.

## 14. Current contradiction ledger

This ledger preserves A1 claims and adds current A2 observations. Paired rows
are used where two source claims form one conflict.

| claim_id | domain | claim | source_ref | observed_status | conflict_or_gap | current_disposition | supersession_or_follow_up | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PROGRAM-001` | Program | Program 1 is the sole active Program and is open for Batch planning only. | Program opening receipt `@6f9dea1904066c45a75f3789377d32c2b0b16106` | `ACCEPTED_CURRENT` | Legacy open-Program claims exist. | Governing current state. | Motion 0248 and the receipt control; HUMAN_OPERATOR owns any amendment. | Active count remains one; A2 changes no Program state. |
| `MOTION-0248-001` | Motion | The fixed four-Program sequence, one-active invariant, and separate opening rules govern. | `.nexus/motions/motion-0248/**@291e2006f1a7af9711d1b7c822ac46abc9569557` | `ACCEPTED_CURRENT` | Earlier artifacts use other Program and activation vocabulary. | Governing portfolio envelope. | Human amendment or superseding accepted Motion required for change. | Programs 2-4 remain frozen. |
| `PROGRAM-LEGACY-001` | Program | The partial Program graph marks a Corpus V2 Program open. | `.nexus/programs/program-graph.yaml` | `LEGACY` | Conflicts with the current receipt-backed active count if read as current. | Historical taxonomy only. | `phase-bounds` to its historical graph scope; future ledger review owner: CONTROL_THREAD. | Graph is partial and predates Motion 0248. |
| `CORPUS-001` | Corpus | Corpus V2 began at motion-0123 and advisory Agent participation is required. | `.nexus/docs/corpus-v2-readiness-criteria.md` | `RATIFIED_PHASE_SPECIFIC` | Does not establish current Agent runtime or Program authority. | Preserve inside historical Corpus-era scope. | `phase-bounds`; future lifecycle review owner: CONTROL_THREAD. | No activation inference. |
| `CORPUS-002` | Corpus | Corpus V2 remains blocked and live Agent drafting or voting are absent. | `.nexus/canon/corpus/corpus-v2-readiness-gate.md` | `CONTRADICTORY` | Conflicts with later Corpus V2 begun/open text. | Retain both historical claims. | Separately routed temporal reconciliation; owner: CONTROL_THREAD. | No silent rewrite. |
| `CONTROL-001` | Control thread | HUMAN_OPERATOR governs; current CONTROL_THREAD routes and accepts; JAI_Control_Thread is inactive. | Fresh A2 route; Program opening receipt | `ACCEPTED_CURRENT` | Static architecture may use broader native control-thread language. | Governing authority classification. | Native activation requires separate accepted Program authority. | Codex analysis is not JAI participation. |
| `EXECUTOR-001` | Executor roles | The five `JAI::DEV::*` names are portable executor-role interfaces. | `roles/README.md`; `roles/rolemap.json@1b1dcd3251092f193440d92406a09c2294f81701` | `STATIC_CONFIGURATION` | Agent terminology can be mistaken for activation. | Role interfaces only. | Future registry work must separate identity, role, runtime, and authority. | Builder is the current delivery role. |
| `EXECUTOR-002` | Executor roles | MASTER_ROLEMAP is a complete current Agent registry. | `jai-agents/MASTER_ROLEMAP.json` | `LEGACY` | Dated and partial; proves no runtime. | Partial static inventory. | Separate registry route; owner: CONTROL_THREAD. | External complete registry remains unavailable. |
| `ROLE-GUARD-001` | Role guard | `docs/reference` has no explicit path rule and uses Builder/Verifier defaults. | `roles/rolemap.json@1b1dcd3251092f193440d92406a09c2294f81701`; A1 role-correction receipt | `ACCEPTED_CURRENT` | A1's original Architect label did not match delivery defaults. | Builder is valid for A2 under the fresh route and current defaults. | Explicit path rule remains non-blocking separate factory-hardening work. | No guardrail change in A2. |
| `VOTING-001` | Voting roles | Motion 0046 says Arbiter makes final governance calls. | `.nexus/motions/motion-0046/proposal.md` | `CONTRADICTORY` | Current authority remains HUMAN_OPERATOR-supervised. | Preserve Motion within phase scope; current authority is human-supervised. | Possible separately routed vocabulary reconciliation; owner: HUMAN_OPERATOR/CONTROL_THREAD. | Arbiter cannot supersede human authority. |
| `VOTING-002` | Voting roles | Council optional `librarian` and executor `JAI::DEV::LIBRARIAN` name one identity. | `.nexus/council.config.yaml`; `roles/README.md` | `UNRESOLVED` | Shared label crosses distinct namespaces and duties. | Treat as distinct labels. | Future schema may add namespace/type fields; owner: CONTROL_THREAD. | No identity merge. |
| `MODEL-LEGACY-001` | Model slots | Thirty all-OpenAI candidate slots and five selectors represent current staffing. | `.nexus/model-slots.yaml` | `PLACEHOLDER` | Motion 0046 provides a later Phase 1 manifest, but both files remain. | Legacy fallback/config evidence only. | `phase-bounds`; any deprecation needs a separate Motion. | Same model in every slot is not independence. |
| `MODEL-P1-001` | Model slots | Ten dual-provider slots are canonical Phase 1 staffing. | `.nexus/model-slots-phase1.yaml`; motion-0046 | `RATIFIED_PHASE_SPECIFIC` | Labels do not prove sessions or runtime. | Preserve as Phase 1 configuration. | Any future runtime requires separate Program authority. | No provider use in A2. |
| `MODEL-LIVE-001` | Model slots | `live`, `providers_active`, and `models_active` labels prove execution. | `.nexus/model-slots-phase1.yaml` | `STATIC_CONFIGURATION` | No provider/runtime receipt accompanies the labels. | Configuration only. | Require direct provider-neutral runtime evidence under a separate route. | No dispatch claim. |
| `SELECTOR-001` | Selectors | Selectors are active and choose winners. | `.nexus/agent-panels.yaml`; `.nexus/model-slots-phase1.yaml` | `DEFERRED` | Selector blocks are deferred and selector slots have `live: false`. | Not active. | Separate evaluation and activation route required. | No selector command run. |
| `SELECTOR-002` | Selectors | Motion panel selection files prove winner behavior. | `.nexus/motions/motion-0047..0049/panels/**/selection.json` | `MOCK` | Unknown tasks/winners and zero scores. | Scaffold only. | Future tests must prove scoring and selection behavior. | No runtime proof. |
| `COUNCIL-001` | Council | Council configuration proves an active Council and binding vote path. | `.nexus/council.config.yaml` | `STATIC_CONFIGURATION` | No activation, provider, participant, or current vote receipt exists. | Static mechanics only. | Separate Program authority required. | No Council run. |
| `FIVE-SLOT-001` | Model slots | Each JAI Thread or Agent should use at least five model slots. | Accepted A1 planning requirement | `ACCEPTED_CURRENT` | No accepted implementation, independence contract, or runtime proof exists. | Planning requirement only. | Future work remains outside A2; owner: CONTROL_THREAD. | Same-provider disclosure remains required. |
| `PROGRAM2-001` | Program boundary | Five-slot shadow-kernel implementation may occur in Program 1. | Motion 0248; accepted A1 | `DISABLED` | That scope belongs to a later Program and remains frozen. | Prohibited in current Program. | Wait for current Program closure and a separate human opening receipt. | A2 does not scope Programs 2-4. |
| `SURFACE-001` | Static source | Motion proposal helper can route or accept work. | `portal/src/lib/controlPlane/jaiControlThreadMotionProposal.ts@1b1dcd3251092f193440d92406a09c2294f81701` | `STATIC_CONFIGURATION` | Source describes non-authoritative display and planning data. | Static preview only. | Any runtime adoption requires a separate source route. | No source change in A2. |
| `PORTFOLIO-HIST-001` | Repository visibility | The historical accepted display-planning input records 68 GitHub repositories. | `docs/reference/operator-portfolio-active-subset-display-planning-v0.md@1dfbb6b1bb874b82fbed929c332783591945925b` | `RATIFIED_PHASE_SPECIFIC` | Paired with `PORTFOLIO-VISIBLE-001`; observation time and inventory method differ. | Preserve as a historical planning input, not a current complete inventory. | `does-not-supersede`; A3 must reconcile scope read only. | Committed `2026-06-24`; source said it did not re-run inventory. |
| `PORTFOLIO-VISIBLE-001` | Repository visibility | The connected GitHub installation exposes 19 repositories for `jai-nexus`. | Installation `73964376`; read-only installed-repository query; `2026-07-19T22:07:38Z` cutoff | `MIRROR_ONLY` | Paired with `PORTFOLIO-HIST-001`; organization-wide completeness is unproven. | Treat as the current connector-visible subset only. | `does-not-supersede`; A3 owner: read-only verifier under a separate accepted start. | The 49-count difference has no lifecycle meaning. |
| `REPO-SNAPSHOT-A1-001` | Repository state | A1 observed default `main` at `6f9dea1904066c45a75f3789377d32c2b0b16106`. | Accepted A1 `@cac7fa273cddd5e38ac30d26870fa04ab6476a18` | `RATIFIED_PHASE_SPECIFIC` | Paired with `REPO-SNAPSHOT-CURRENT-001`; it is no longer the current tip. | Accurate A1 observation-time snapshot. | Current base `records-later-event`; no correction to A1. | A1 also recorded zero open PRs then. |
| `REPO-SNAPSHOT-CURRENT-001` | Repository state | Current refreshed `origin/main` is `1b1dcd3251092f193440d92406a09c2294f81701`. | A2 git preflight; refreshed `origin/main`; `2026-07-19T22:07:38Z` cutoff | `ACCEPTED_CURRENT` | D1 and D2 merged after A1's snapshot. | Governing repository basis for A2. | `records-later-event` relative to A1. | Exact required-base match. |
| `D1-EVIDENCE-001` | Repository CI | D1 adds bounded control-plane behavioral tests to portal CI. | `.github/workflows/portal-ci-guardrails.yml@a0e7b76af02899659529355773bf293d58269897` | `STATIC_CONFIGURATION` | A1 predates this repository event; workflow text is not runtime authority. | Current merged CI contract. | `records-later-event`; future failures are evaluated through CI evidence. | PR 381 delivery is mirror evidence only. |
| `D2-EVIDENCE-001` | Proving seam | D2 adds a local operating-loop implementation and tests on main. | Six D2 paths `@1b1dcd3251092f193440d92406a09c2294f81701` | `STATIC_CONFIGURATION` | A1 predates D2; implementation/tests do not prove production or provider runtime. | Current local mock-or-shadow proving capability. | `records-later-event`; founder observation remains separate evidence. | PR 382 and green checks corroborate delivery only. |
| `LINEAR-CURRENT-001` | Linear | Project `95da6eaa-73a3-4eb2-adfc-1a08a3ac67ba` is the current Program 1 coordination mirror. | Linear Project read at A2 evidence collection | `MIRROR_ONLY` | Paired with `LINEAR-LEGACY-001`; both display `In Progress`. | Current mirror for coordination visibility. | `does-not-supersede` repository receipts; mirror-hygiene owner: CONTROL_THREAD. | Cannot route or accept A2. |
| `LINEAR-LEGACY-001` | Linear | Project `fc8749fe-0eac-4105-9157-f83110a66870` is a current authoritative Program. | Legacy Linear Project read at A2 evidence collection | `MIRROR_ONLY` | Paired with `LINEAR-CURRENT-001`; its stale title/status can imply a competing active Program. | Historical temporary mirror only. | `phase-bounds`; any archive/status correction requires a separate Linear route. | No Linear mutation authorized. |
| `AGENCY-001` | External registry | A current external agency registry proves Agent readiness. | A1 search for `agents.index.json` and `agents.generated.yaml`; Motion 0248 validation receipt | `UNAVAILABLE` | No complete registry is available in the repository basis. | No Agent/Council readiness claim. | Resolve before any activation claim; owner: HUMAN_OPERATOR/CONTROL_THREAD. | No substitute fabricated. |
| `CROSS-REPO-001` | Cross-repo | A1 sibling checkout observations establish current portfolio authority. | Accepted A1 sibling table at `cac7fa273cddd5e38ac30d26870fa04ab6476a18` | `UNRESOLVED` | Checkouts were not freshly fetched and several were stale, gone, behind, or dirty. | Historical advisory observations only. | A3 may inspect connector-visible repositories read only after accepted A2. | No cross-repo mutation. |
| `OWNERSHIP-001` | Cross-repo | Repository names establish contract ownership and dependency direction. | Current names including `nexus-core`, `datacontracts-nexus`, `sot-nexus`, and `jai-format` | `UNRESOLVED` | Names and Linear history are insufficient evidence. | Ownership remains unresolved. | A3 must gather source-backed responsibility and dependency evidence. | No ownership assignment in A2. |

## 15. Disposition owners and follow-up classes

An owner names who may receive a future decision packet. It does not route
that work.

| Follow-up class | Appropriate owner | Required next evidence | Current authority |
| --- | --- | --- | --- |
| Human constitutional or Program amendment | HUMAN_OPERATOR | Fresh explicit instruction and accepted receipt | None granted by A2 |
| Ledger disposition or route decision | CONTROL_THREAD | Accepted A2 plus a fresh bounded route | None granted by this artifact |
| Repository implementation evidence | Separately routed `JAI::DEV::*` role | Exact repo, base, branch, allowlist, validation, and independent acceptance | None |
| Read-only repository reconciliation | A3 verifier named by a future start disposition | Accepted A2 and the contract in Section 16 | Blocked pending accepted A2 |
| Linear mirror hygiene | CONTROL_THREAD under explicit Linear mutation authority | Exact object, desired mutation, repository receipt, and human authorization | None |
| Agent, Council, provider, runtime, or activation evidence | HUMAN_OPERATOR and separately opened governing Program | Direct runtime evidence plus explicit activation authority | Prohibited in A2 |

## 16. Exact A3 reconciliation contract

The coordinated route defines A3 as
`Q3M7Y26-P1-A3-READONLY-v0`. This section records that contract without
starting A3.

### 16.1 Start condition

A3 may start only after A2 is independently accepted. An A2 artifact, branch,
commit, push, pull request, or passing check does not satisfy that condition
by itself.

### 16.2 Mode

```text
READ_ONLY
REPOSITORY_RECONCILIATION
NO_REPOSITORY_MUTATION
NO_LINEAR_MUTATION
NO_AUTHORITY_TRANSFER
```

### 16.3 Bounded scope

A3 may inspect:

- repositories visible through the connected GitHub installation;
- exact default branches and tip SHAs for the visible repositories;
- evidence-backed repository responsibility;
- evidence-backed dependency direction;
- authority status; and
- candidate Program-lane relevance as an evidence classification only.

A3 must distinguish connected-installation visibility from complete
organization inventory. It must not infer ownership, responsibility,
dependency direction, lifecycle state, or authority from repository names or
Linear history.

### 16.4 Required evidence shape

For each visible repository, A3 must record:

- repository name and immutable repository identifier when available;
- installation and visibility basis;
- default branch;
- default tip SHA;
- UTC observation time and pagination state;
- source-backed responsibility evidence or `UNRESOLVED`;
- source-backed dependency direction or `UNRESOLVED`;
- authority classification;
- candidate Program-lane relevance, clearly marked non-routing; and
- access, freshness, ownership, and completeness gaps.

The result must separately state:

- the connected installation's visible count;
- whether all installation-result pages were read;
- that organization-wide completeness is either independently proven or
  `UNRESOLVED`;
- the unresolved relation between the historical 68-repository input and the
  current 19-repository visible subset;
- that inaccessible repositories remain `UNAVAILABLE`, not absent; and
- that repository responsibility remains unassigned where source evidence is
  insufficient.

### 16.5 Output and durable-target boundary

A3 produces a read-only evidence packet for CONTROL_THREAD. It does not choose
or mutate a durable repository target. A later explicit CONTROL_THREAD
decision must choose any durable artifact target, exact repository, base,
branch, path, role, validation, and non-authorizations.

### 16.6 Stop conditions

A3 must stop and report if:

- accepted A2 cannot be established;
- the connected installation cannot bound or paginate its visible result;
- a requested conclusion depends on inaccessible repository evidence;
- establishing ownership or dependency direction would require inference from
  a name or mirror;
- any repository or Linear mutation would be required;
- any source, test, workflow, package, schema, runtime, provider, Agent,
  Council, customer, deployment, or production action would be required; or
- the work would route, open, execute, or accept another Program, Batch, Wave,
  Lane, or Work Packet.

### 16.7 Authority boundary

A3 may describe evidence and unresolved gaps. It cannot:

- declare a complete organization inventory without direct proof;
- assign repository ownership;
- accept A2 or its own evidence;
- change Program state;
- route candidate lanes;
- activate any JAI component;
- mutate GitHub, Linear, a repository, or a working tree; or
- transfer source-of-truth or acceptance authority.

## 17. A2 acceptance contract

A2 may be considered for independent review only when the lane closeout
records:

- starting `origin/main` exactly
  `1b1dcd3251092f193440d92406a09c2294f81701`;
- exact branch and one-path scope;
- `Role: JAI::DEV::BUILDER`;
- the source-precedence matrix;
- the controlled vocabulary and nine-field ledger shape;
- provenance, freshness, conflict, and supersession rules;
- the three required contradiction pairs;
- repository-visibility limitations and the exact 19-name visible subset;
- the exact A3 read-only contract;
- explicit non-authorizations;
- `git diff --check`;
- repository-prescribed checks;
- staged one-path and cached-diff checks;
- commit, push, upstream synchronization, and final clean worktree;
- an Evidence-compliant draft pull-request description; and
- a separate CONTROL_THREAD acceptance disposition.

The three required contradiction pairs are:

1. `PORTFOLIO-HIST-001` and `PORTFOLIO-VISIBLE-001`: historical 68-repository
   planning evidence versus 19 repositories visible through the connected
   GitHub installation.
2. `REPO-SNAPSHOT-A1-001` and `REPO-SNAPSHOT-CURRENT-001`, supported by
   `D1-EVIDENCE-001` and `D2-EVIDENCE-001`: current D1/D2 repository events
   versus A1's older repository snapshot.
3. `LINEAR-CURRENT-001` and `LINEAR-LEGACY-001`: the current Program mirror
   versus stale legacy Linear state.

The artifact cannot accept itself or start A3.

## 18. Repository-visibility risk controls

| Risk | Severity | Required control |
| --- | --- | --- |
| Treating 19 visible repositories as a complete organization inventory | High | Label the result as installation-visible only and preserve completeness as unresolved. |
| Treating the 49-count difference as missing or deleted repositories | High | Prohibit lifecycle inference; require broader direct inventory evidence. |
| Assigning ownership from names such as `sot-nexus` or `datacontracts-nexus` | High | Require source-backed responsibility evidence in A3. |
| Treating A1's old default SHA as erroneous | Medium | Preserve it as observation-time truth and use `records-later-event`. |
| Treating merged D1/D2 tests as production activation | High | Classify repository behavior separately from runtime and authority evidence. |
| Treating two `In Progress` Linear Projects as two active Programs | High | Preserve both as mirrors; the repository receipt controls active count. |
| Treating this ledger as a routing engine | High | Require a fresh CONTROL_THREAD disposition for every follow-up. |

## 19. Explicit non-authorizations

A2 does not authorize:

- a second changed path;
- edits to `.nexus`, Motions, receipts, source, tests, workflows, packages,
  dependencies, schemas, validators, rolemaps, model slots, panels, or Council
  configuration;
- parser, service, API, UI, persistence, database, migration, or runtime
  implementation;
- repository creation, archival, deletion, rename, transfer, cloning, cleanup,
  branch repair, or lifecycle classification;
- GitHub installation, repository, issue, branch, pull-request, or settings
  mutation;
- Linear creation, update, archive, status change, or other mutation;
- cross-repository mutation;
- provider, model, API, browser, or customer dispatch;
- API spending or credential access;
- Agent identity creation, activation, dispatch, persistent assignment, or
  participation;
- Council, selector, panel, or voting activation;
- synthetic votes or representation of Codex/CONTROL_THREAD analysis as a
  vote;
- founder observation or any synthetic substitute;
- Program acceptance, closure, opening, active-count change, or execution;
- Program 2-4 planning, routing, implementation, or activation;
- Batch, Wave, Lane, Work Packet, A3, or D3 execution;
- pull-request creation or merge without separate authorization;
- deployment, production behavior, or a production gate;
- automatic progression; or
- authority or source-of-truth transfer.

## 20. Verification notes

Pre-authoring evidence:

- `origin/main` was fetched;
- `HEAD`, `origin/main`, and the required base matched
  `1b1dcd3251092f193440d92406a09c2294f81701`;
- the target branch was created from that exact base;
- the pre-authoring worktree was clean;
- the authorized artifact did not exist;
- the target branch had no conflicting open pull request;
- `roles/rolemap.json` had no explicit `docs/reference` rule;
- `defaultAllowedRoles` included `JAI::DEV::BUILDER` and
  `JAI::DEV::VERIFIER`;
- A1, D1, and D2 were present in the current main history;
- GitHub and Linear were read only; and
- no second path was required.

Final diff, prescribed-check, staged-scope, commit, push, upstream, and clean
worktree results belong to the lane closeout and are not preclaimed here.

No source, test, runtime, provider, Agent, Council, customer, database,
migration, deployment, or production command is required by this documentary
artifact.

## 21. Decision recommendation

`PASS_FOR_INDEPENDENT_A2_REVIEW`

Reason:

The accepted A1 hierarchy and ledger contract are now expressed as durable
A2 canon at the current D1/D2 repository base. The required conflicts are
preserved with explicit scope, freshness, and follow-up boundaries. The A3
contract is exact and read only, while remaining blocked behind independent
A2 acceptance.

This recommendation does not accept A2, start A3, route D3, change Program
state, mutate Linear, or open an execution gate.

## 22. ZERO GATES GRANTED

```text
PROGRAM: Q3M7Y26-P1
PROGRAM_1: SOLE ACTIVE PROGRAM / OPEN FOR BATCH PLANNING ONLY
BATCH_A: PLANNING AUTHORIZED / A2 DOCUMENTARY LANE ROUTED
LANE_A2: DRAFT_FOR_INDEPENDENT_CONTROL_THREAD_REVIEW
A3: BLOCKED_PENDING_ACCEPTED_A2
D3: NOT_EXECUTED_BY_A2
PROGRAMS_2_4: DOWNSTREAM_FROZEN
LINEAR_AUTHORITY: NONE
GITHUB_INSTALLATION_VISIBILITY: 19 / ORGANIZATION_COMPLETENESS_UNRESOLVED
EXECUTION_GATES_GRANTED: 0
ZERO EXECUTION GATES GRANTED
```
