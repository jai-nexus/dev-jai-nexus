# JAI Workbench Product Boundary / Inception Decision v0

## Status

Planning-only / non-executable.

This artifact defines a proposed product boundary and inception decision for a
possible future standalone repo named `jai-workbench`. It does not create that
repo and does not authorize implementation.

No repo creation, app implementation, runtime execution, provider/model
dispatch, terminal execution, browser/desktop control, API/DB mutation,
branch/PR automation, telemetry, customer data handling, or production workload
authority is granted by this plan.

## Purpose

`jai-workbench` is the proposed broader future product concept for a local
operator-facing JAI workbench: a place where an operator could eventually plan,
review, and coordinate JAI Toolchain work across repo lanes, IDE context,
browser/extension handoff concepts, passalongs, approvals, and evidence
summaries.

The proposed purpose is product consolidation and operator ergonomics, not
runtime authority. JAI Workbench would be the future product home for an
integrated operator experience if `CONTROL_THREAD` later accepts the boundary,
routes inception work, and approves the required gates.

## Current Baseline

Settled posture:

- `dev-jai-nexus` owns Operator Control Plane posture.
- `CONTROL_THREAD` owns cross-repo prioritization and dependency
  reconciliation.
- `jai-vscode` remains the JAI for VS Code adapter / IDE-boundary repo for
  now.
- `jai-pilot` remains the browser/extension lane and is held.
- JAI Workbench is the broader future product concept.
- Runtime Toolchain integration is not authorized.
- Provider/model dispatch authority is not authorized.
- Branch/PR automation is not authorized.
- Desktop/browser control is not authorized.
- Production/customer workload authority is not authorized.

This baseline keeps the current work in planning/reference posture. A future
Workbench concept must not absorb authority from adjacent repos by naming,
product ambition, or UI expectation.

## Proposed `jai-workbench` Boundary

`jai-workbench` would own, if accepted and later created:

- future product-level Workbench UX concepts
- operator workspace composition across JAI Toolchain lanes
- local product shell direction after separate approval
- product distinction between IDE adapter, browser handoff lane, and broader
  operator workbench
- future non-runtime visual planning surfaces for batches, lanes, approvals,
  passalongs, and evidence summaries
- user-facing workbench terminology and information architecture
- future local-app-shell planning only after gates are satisfied

`jai-workbench` would not own by default:

- `CONTROL_THREAD` authority
- cross-repo prioritization
- repo mutation
- terminal execution
- browser/desktop control
- provider/model dispatch
- API/DB behavior
- telemetry collection
- customer data handling
- production/customer workloads
- VS Code extension implementation
- browser extension implementation
- orchestration runner behavior
- canonical `.jai` grammar
- JAI substrate semantics
- audit/privacy authority

## Ownership Map

### `dev-jai-nexus`

Remains owner of:

- Operator Control Plane posture
- `CONTROL_THREAD` routing and reconciliation posture
- portfolio-routing protocols and planning references
- static/read-only control-plane visibility
- cross-repo prioritization and dependency reconciliation
- approval posture and non-authority framing

Does not transfer to `jai-workbench`:

- `CONTROL_THREAD` authority
- final routing decisions
- cross-repo dependency reconciliation
- acceptance of passalongs as reconciled

### `jai-vscode` / JAI for VS Code

Remains owner of:

- JAI for VS Code adapter / IDE-boundary repo
- IDE-side context handoff boundary
- editor-specific UX and extension behavior
- explicit file/context inclusion rules for IDE surfaces

Does not transfer to `jai-workbench`:

- VS Code extension implementation
- IDE adapter behavior
- IDE authority-hardening obligations

### `jai-pilot`

Remains owner of:

- browser/extension lane
- explicit browser/desktop handoff concept
- visible context selection and action preview concepts

Current posture:

- held
- no browser/desktop control
- no hidden scraping
- no credential/session/token capture

### `orchestrator-nexus`

Remains owner of:

- dry-run/manual-run packaging where separately governed
- evidence normalization
- dispatch target semantics within approved authority
- runner/evidence planning seams

Does not transfer to `jai-workbench`:

- runner behavior
- dispatch execution
- evidence normalization authority

### `audit-nexus`

Remains owner of:

- authority/privacy/security review
- context inclusion review
- token/secret leakage review
- telemetry and customer-data risk review

Does not transfer to `jai-workbench`:

- audit authority
- privacy approval
- security approval

### `jai`

Remains owner of:

- JAI substrate semantics
- council/motion reasoning semantics
- shared reasoning vocabulary

Does not transfer to `jai-workbench`:

- substrate authority
- reasoning semantics ownership
- approval authority

### `jai-format`

Remains owner of:

- canonical `.jai` workflow packet language
- packet/profile grammar
- routing metadata representation
- authority metadata representation
- passalong and evidence representation concepts

Does not transfer to `jai-workbench`:

- `.jai` grammar ownership
- parser/profile/schema authority
- representation semantics

### `api-nexus`

Remains owner of:

- future API/interface layer
- Toolchain packet/event interface boundary
- bounded ingress interface planning if later governed

Does not transfer to `jai-workbench`:

- API runtime
- DB persistence
- global source-of-truth behavior
- event ingestion authority

## Product Distinctions

### JAI Workbench

JAI Workbench is the broader future product concept: an operator-facing local
workspace for planning, reviewing, and coordinating JAI Toolchain work. It may
eventually combine visibility, structured planning, explicit approvals,
passalong review, evidence summaries, and handoff previews after gates are
satisfied.

JAI Workbench is not currently a repo, app, runtime, agent, or automation
surface.

### JAI IDE

JAI IDE is the broader product idea for IDE-native JAI experiences. It may
include editor context, code review context, file selection, packet preview,
and developer workflow affordances.

JAI IDE is a product concept, not the current implementation repo by itself.

### `jai-vscode` / JAI for VS Code

`jai-vscode` is the current repo for JAI for VS Code, the VS Code adapter /
IDE-boundary lane. It remains the concrete repo for VS Code extension boundary
planning and implementation if separately routed.

`jai-vscode` is narrower than JAI Workbench. It is IDE-specific and does not
own browser handoff, global product shell, or control-plane routing authority.

### `jai-pilot`

`jai-pilot` is the browser/extension lane and remains held. It is narrower than
JAI Workbench and specifically concerns browser/desktop handoff concepts.

`jai-pilot` does not authorize hidden scraping, credential/session/token
capture, autonomous browser action, or customer data handling.

## Initial Non-Executable Scope

Initial JAI Workbench scope is non-executable and planning-only:

- define product boundary
- define ownership boundaries
- distinguish Workbench from IDE, VS Code adapter, and browser/extension lane
- list gates before any expansion
- preserve current repo ownership
- preserve `CONTROL_THREAD` authority
- identify open questions and risks
- recommend whether to create a standalone repo

Initial scope explicitly excludes:

- repo creation
- app shell
- UI implementation
- runtime execution
- provider/model calls
- repo mutation
- terminal execution
- browser control
- API/DB behavior
- telemetry
- customer data handling
- production usage

## Gates Required Before Expansion

### Before repo creation

Required gates:

- `CONTROL_THREAD` accepts this boundary artifact
- repo purpose and name are approved
- ownership map is accepted
- initial docs-only skeleton scope is approved
- no runtime or product implementation authority is inferred

### Before UI implementation

Required gates:

- accepted product UX boundary
- accepted static/read-only surface model
- clear non-authority banner requirements
- approval that UI is display/planning only
- no controls or execution affordances unless separately governed

### Before local app shell

Required gates:

- local app shell architecture plan
- security and filesystem boundary review
- authority review for local context visibility
- explicit denial of terminal/browser/repo mutation authority by default
- `CONTROL_THREAD` route approving only the shell scope

### Before provider/model calls

Required gates:

- provider/model dispatch boundary
- audit/privacy review
- prompt/context inclusion policy
- token/secret handling policy
- human approval gate for every model-assisted action class
- explicit non-production path unless separately approved

### Before repo mutation

Required gates:

- repo mutation authority model
- allowed operation list
- human approval gates
- audit/review path
- rollback and evidence policy
- explicit branch/PR boundary

### Before terminal execution

Required gates:

- terminal execution threat model
- allowlist and sandbox policy
- human confirmation requirements
- evidence capture policy
- no production/customer workload authority
- audit review

### Before browser control

Required gates:

- browser control boundary
- hidden scraping denial
- credential/session/token capture denial
- visible action preview
- explicit user confirmation
- audit/privacy review

### Before API/DB behavior

Required gates:

- API/data model plan
- persistence boundary
- source-of-truth policy
- audit/privacy review
- migration/sync authority review
- explicit denial of automatic routing unless separately approved

### Before telemetry

Required gates:

- telemetry purpose and minimization plan
- opt-in/consent boundary
- privacy review
- retention policy
- customer data separation
- no hidden telemetry

### Before customer data handling

Required gates:

- customer data boundary
- privacy/security review
- data minimization plan
- retention and deletion policy
- access control plan
- production/customer authority approval

### Before production usage

Required gates:

- production readiness plan
- deployment/sync/migration authority review
- runtime safety model
- incident/rollback plan
- customer data handling approval, if applicable
- audit approval
- explicit `CONTROL_THREAD` production route

## Explicit Non-Goals

This artifact does not authorize:

- repo creation
- app implementation
- runtime execution
- provider/model dispatch
- terminal execution
- browser/desktop control
- API/DB mutation
- branch/PR automation
- telemetry
- customer data handling
- production workload authority
- route dispatch
- repo mutation
- CI/config changes
- scripts or automation
- schemas or runtime data models
- incident/outage file changes

## Repo Creation Recommendation

Recommendation:

- defer standalone `jai-workbench` repo creation until `CONTROL_THREAD`
  accepts this boundary artifact

Do not create the repo in this task.

Rationale:

- the boundary is not yet accepted
- ownership separation across `dev-jai-nexus`, `jai-vscode`, `jai-pilot`,
  `orchestrator-nexus`, `audit-nexus`, `jai`, `jai-format`, and `api-nexus`
  must remain explicit
- creating the repo too early may imply implementation momentum or product
  authority not yet granted
- a docs-only skeleton should only be created after `CONTROL_THREAD` accepts
  the boundary and routes repo creation explicitly

## Open Questions

- Should JAI Workbench start as a docs-only skeleton repo after acceptance, or
  should it remain a concept in `dev-jai-nexus` until UI boundaries are ready?
- Should JAI Workbench eventually be local-first desktop, web-based local app,
  IDE-adjacent app, or a composition of separate adapter surfaces?
- What exact boundary separates JAI Workbench from JAI IDE once `jai-vscode`
  remains the VS Code adapter?
- Which passalong, portfolio batch, and `.jai` representations should be
  visible in a future Workbench before any runtime behavior exists?
- What audit/privacy review is required before any provider/model-assisted
  planning or context summarization?

## Risks

- JAI Workbench could be mistaken for implementation approval.
- A standalone repo could create pressure to build UI or runtime behavior
  before gates are satisfied.
- Product naming could blur ownership with `jai-vscode` or `jai-pilot`.
- Workbench scope could drift into terminal execution, browser control, or repo
  mutation.
- Provider/model assistance could be overread as provider/model dispatch
  authority.
- Future telemetry or customer data handling could be proposed before audit
  review.
- `CONTROL_THREAD` authority could be weakened if Workbench is treated as an
  autonomous router rather than an operator-facing product surface.

## Recommended Next Route

Recommended next route:

- return this boundary artifact to `CONTROL_THREAD` for acceptance decision

If accepted, the next possible route is:

- create a docs-only `jai-workbench` skeleton repo with no app/runtime code and
  no automation

If not accepted, the next route is:

- keep JAI Workbench as a future product concept in `dev-jai-nexus` planning
  and continue routing concrete adapter work through existing repos
