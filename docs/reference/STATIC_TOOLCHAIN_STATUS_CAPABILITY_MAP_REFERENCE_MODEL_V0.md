# Static Toolchain Status Capability Map Reference Model v0

## Objective

Define a static local reference model for a future Toolchain Status /
Capability Map surface in the `dev-jai-nexus` Operator Control Plane.

This artifact translates settled capability-map planning into concrete
manually maintained model fields, vocabularies, examples, and usage rules. It
does not implement a surface, dashboard, runtime model, app reference module,
schema, validator, parser, formatter, projection, CLI, CI wiring, API, DB
behavior, automation, dispatch, or live telemetry.

## Source baseline

The source baseline is the completed Static Toolchain Status / Capability Map
Surface Planning v0 in `dev-jai-nexus`.

Settled baseline:

- future Toolchain Status / Capability Map visibility should be static,
  read-only, non-interactive, and manually maintained
- no live dashboard behavior is authorized
- no portal/app code was changed in the planning slice
- no runtime behavior, API/DB behavior, validation execution, automation,
  provider/model dispatch, or control buttons are authorized
- `dev-jai-nexus` remains the Operator Control Plane and cross-repo visibility
  coordinator

## Files and artifacts inspected

- `docs/plans/STATIC_TOOLCHAIN_STATUS_CAPABILITY_MAP_SURFACE_PLANNING_V0.md`
- `docs/plans/JAI_TOOLCHAIN_ACTIVE_CAPABILITY_MAP_V0.md`
- `docs/plans/JAI_TOOLCHAIN_WORKFLOW_SPINE_V0.md`
- `docs/reference/JAI_TOOLCHAIN_REPO_ROLE_MAP_V0.md`
- `docs/reference/JAI_TOOLCHAIN_PACKET_FLOW_V0.md`
- `docs/reference/STATIC_JAI_CONTEXT_VISIBILITY_REVIEW_V0.md`
- `docs/plans/WORKFLOW_PACKET_STRICT_SCHEMA_STATIC_VISIBILITY_PLANNING_V0.md`
- `.nexus/canon/toolchain-integration-readiness-matrix-v0.md`
- `.nexus/canon/toolchain-runtime-integration-gate-tracker-v0.md`
- `.nexus/canon/jai-toolchain-product-foundry-routing.md`
- `.nexus/canon/edge-runner-readiness-matrix-v0.md`
- `.nexus/canon/**`
- `README.md`
- `portal/src/app/page.tsx`
- `portal/src/lib/controlPlane/**`
- `package.json`
- `portal/package.json`

## Model purpose

The model gives a future static surface one consistent shape for displaying:

- current useful Toolchain lanes
- static/reference lanes
- planning-only lanes
- paused and deferred lanes
- future tooling, UI, and runtime candidates
- evidence/source references
- owner roles
- next useful moves
- explicit non-authority boundaries

The model is a reference contract for static display and planning continuity
only. It is not an implementation contract and is not a source of runtime
truth.

## Model posture

Required posture:

- docs/reference only in this slice
- static and manually maintained
- read-only if rendered later
- no runtime ingestion
- no polling
- no hooks
- no live status claims
- no control or remediation actions
- no hidden authority expansion from field names, category names, or examples

## Field definitions

### `repo`

- Purpose: identifies the repo or repo lane described by the record.
- Expected values or shape: repo name string such as `dev-jai-nexus`,
  `jai-format`, `orchestrator-nexus`, `jai-edge`, `jai`, `jai-vscode`,
  `jai-pilot`, `api-nexus`, `audit-nexus`, or `docs-nexus`.
- Required: yes.
- Interpretation notes: names the lane owner or visibility target; it does not
  grant mutation authority in that repo.
- Non-authority warning: a listed repo is not being edited, integrated, or
  activated by this model.

### `lane`

- Purpose: gives the operator-facing lane or workstream label.
- Expected values or shape: short lowercase phrase or slug, for example
  `operator-control-plane`, `workflow-packet-and-context-grammar`, or
  `edge-health-signal-source`.
- Required: yes.
- Interpretation notes: lane names are display grouping labels only.
- Non-authority warning: a lane label is not a route selection, dispatch target,
  or implementation approval.

### `capability`

- Purpose: summarizes what the lane can describe, reference, or do within its
  settled boundary.
- Expected values or shape: concise human-readable phrase.
- Required: yes.
- Interpretation notes: should distinguish operational evidence, reference
  semantics, planning, and future candidates.
- Non-authority warning: capability text must not be read as production,
  runtime, customer-facing, or execution readiness.

### `category`

- Purpose: classifies the lane using the controlled category vocabulary below.
- Expected values or shape: one category value from this artifact.
- Required: yes.
- Interpretation notes: category controls display posture and warning language.
- Non-authority warning: category is not an implementation status by itself and
  must not be used to trigger behavior.

### `useful_now`

- Purpose: states whether the record is useful to an operator today.
- Expected values or shape: `true`, `false`, or in prose examples `partial`
  where a future typed model may need a separate qualifier.
- Required: yes.
- Interpretation notes: `true` means useful for current operator
  understanding, routing, or reference; `false` means future/planning/deferred.
- Non-authority warning: useful now is not authorized to execute, automate,
  mutate, validate, dispatch, or serve customers.

### `current_status`

- Purpose: gives a plain-language current posture.
- Expected values or shape: concise status phrase such as `active coordinator /
  static visibility`, `ready as reference / unenforced`, `currently
  operational`, `planning only`, `paused`, `deferred`, or `not authorized`.
- Required: yes.
- Interpretation notes: should be manually updated when repo lane posture
  changes.
- Non-authority warning: current status is documentary, not live system state.

### `owner_role`

- Purpose: identifies the repo role behind the lane.
- Expected values or shape: short phrase aligned to the repo role map.
- Required: yes.
- Interpretation notes: should name stewardship, visibility, review, evidence,
  grammar, interface, or handoff ownership.
- Non-authority warning: owner role does not grant final approval, execution,
  runtime dispatch, or cross-repo mutation.

### `evidence_source`

- Purpose: cites the planning, canon, reference, PR, or manual evidence basis
  for the record.
- Expected values or shape: path, artifact name, PR reference, or `manual
  evidence only`.
- Required: optional but recommended.
- Interpretation notes: references should remain manually curated.
- Non-authority warning: evidence source is not live ingestion and is not global
  SoT unless separately governed.

### `current_artifact`

- Purpose: names the most relevant static artifact currently representing the
  lane.
- Expected values or shape: repo-local path, external artifact reference, or
  short artifact label.
- Required: optional but recommended.
- Interpretation notes: useful for static links in a later read-only surface.
- Non-authority warning: linking an artifact does not import, execute, validate,
  or mutate it.

### `next_useful_move`

- Purpose: records the next bounded move that would improve operator utility.
- Expected values or shape: short recommendation, usually planning/reference
  language.
- Required: yes.
- Interpretation notes: should describe a possible next route, not an automatic
  action.
- Non-authority warning: a next useful move is not a command, ticket, workflow,
  automation trigger, dispatch instruction, or approval.

### `visibility_allowed`

- Purpose: controls whether and how the record may be shown on a future static
  surface.
- Expected values or shape: one value from the visibility vocabulary below.
- Required: yes.
- Interpretation notes: display posture only.
- Non-authority warning: visibility does not imply live telemetry, current
  runtime truth, or permission to fetch data.

### `implementation_status`

- Purpose: gives static implementation/reference posture using the status
  vocabulary below.
- Expected values or shape: one value from the implementation-status vocabulary
  below.
- Required: yes.
- Interpretation notes: records where a lane stands as documentation, static
  surface, boundary, candidate, paused, deferred, or not authorized.
- Non-authority warning: implementation status is not a build state and must
  not drive app behavior.

### `explicit_non_authority`

- Purpose: keeps the denied authority visible beside every record.
- Expected values or shape: short sentence or list of denied authorities.
- Required: yes.
- Interpretation notes: this field should be rendered prominently if a future
  surface is built.
- Non-authority warning: this field is itself the warning; omitting it from a
  future UI would materially weaken the model.

### `risk_level`

- Purpose: estimates display/authority confusion risk for the record.
- Expected values or shape: `low`, `medium`, or `high`.
- Required: yes.
- Interpretation notes: considers authority confusion, privacy/customer-data
  risk, runtime temptation, likelihood of being mistaken for live capability,
  and need for audit/privacy review.
- Non-authority warning: risk level is not a formal audit classification and
  does not replace `audit-nexus` review.

### `recommended_route`

- Purpose: records the recommended next repo or governance route.
- Expected values or shape: repo name plus brief route label, or `pause`.
- Required: yes.
- Interpretation notes: supports `CONTROL_THREAD` routing decisions.
- Non-authority warning: recommended route is advice only and cannot approve
  implementation, execution, validation, dispatch, or mutation.

## Category vocabulary

### `currently_operational`

- Meaning: a bounded lane provides useful current evidence, manual runner
  behavior, or read-only utility within settled authority.
- Allowed display posture: show as useful and current, with manual/static
  evidence wording.
- Forbidden implication: must not imply broad autonomous execution, production
  authority, deployment authority, live telemetry, or remediation controls.

### `reference_static_only`

- Meaning: the lane is useful as static reference, semantics, canon, or
  visibility context.
- Allowed display posture: show as read-only reference with source links and
  non-authority copy.
- Forbidden implication: must not imply live ingestion, runtime state, or
  implementation approval.

### `planning_only`

- Meaning: the lane is documented as planning direction without implementation.
- Allowed display posture: show as future/possible planning context.
- Forbidden implication: must not imply approval to build, schedule, dispatch,
  or mutate.

### `strict_schema_ready_but_unenforced`

- Meaning: schema/profile posture exists and may be useful as reference, but no
  enforcement or downstream consumer authority exists here.
- Allowed display posture: show as reference-ready and unenforced.
- Forbidden implication: must not imply validator implementation, schema
  execution, source `.jai` validation, route selection, enforcement, or
  production readiness.

### `future_tooling_candidate`

- Meaning: a future tool or review lane could provide utility if separately
  routed.
- Allowed display posture: show as candidate with boundary and review needs.
- Forbidden implication: must not imply implementation start, CLI/CI wiring,
  automation, or dispatch authority.

### `future_ui_candidate`

- Meaning: a future static or explicit user-approved UI/handoff seam may be
  useful after boundaries are routed.
- Allowed display posture: show as future UI candidate with privacy/context
  warnings.
- Forbidden implication: must not imply portal/app code, hidden capture,
  browser/desktop control, or autonomous repo mutation.

### `future_runtime_candidate`

- Meaning: a future interface/runtime lane may be strategically relevant but is
  not authorized now.
- Allowed display posture: show as deferred and not authorized.
- Forbidden implication: must not imply API/DB behavior, live routing, runtime
  packet ingestion, provider/model dispatch, global SoT, or downstream
  enforcement.

### `explicitly_not_authorized`

- Meaning: a capability or action is denied under the current authority
  boundary.
- Allowed display posture: show as blocked/not authorized.
- Forbidden implication: must not imply roadmap commitment, implementation
  approval, or unlock conditions outside separate governance.

## Useful-now, paused, and deferred semantics

`useful_now: true` means:

- useful to the operator today
- useful for reference, routing, review, or manual evidence interpretation
- does not imply automation
- does not imply runtime authority
- does not imply production readiness
- does not imply customer-facing availability

`useful_now: false` means:

- still future, planning, deferred, or not operator-useful without additional
  routed work
- may be strategically important
- not yet operator-useful as an active lane
- not a reason to hide non-authority warnings

`partial` may be used in prose examples only when a lane is useful as reference
but not useful as implementation. A future typed model should prefer explicit
separate fields instead of overloading boolean semantics.

Paused means:

- intentionally stopped after useful planning/reference work
- not abandoned
- not approved for expansion
- should not be shown as active implementation

Deferred means:

- future candidate or future gap
- not authorized in this branch
- should not be treated as scheduled or approved work

## Visibility-allowed semantics

### `yes_static`

- Meaning: may be shown on a static, read-only surface using manually
  maintained content.
- Non-authority implication: no live data, no polling, no hooks, no runtime
  truth claim.

### `reference_only`

- Meaning: may be cited or summarized as reference/canon/source context.
- Non-authority implication: citation is not ingestion, validation, execution,
  enforcement, or ownership transfer.

### `planning_only`

- Meaning: may be shown as planning context only.
- Non-authority implication: planning visibility is not implementation
  approval.

### `no_live_visibility`

- Meaning: should not be displayed as current/live status.
- Non-authority implication: may only be represented with clear blocked,
  deferred, historical, or non-live language.

### `deferred`

- Meaning: should be shown, if at all, as future candidate/deferred lane.
- Non-authority implication: not approved, not scheduled, and not authorized to
  execute.

## Implementation-status semantics

### `operational_manual`

- Meaning: useful bounded manual or evidence lane exists now.
- Non-authority implication: manual operational usefulness is not automation or
  production authority.

### `static_surface_exists`

- Meaning: a static/read-only surface or card exists in `dev-jai-nexus`.
- Non-authority implication: static display is not live telemetry, control, or
  remediation authority.

### `docs_reference_exists`

- Meaning: a docs/reference artifact exists.
- Non-authority implication: reference does not implement behavior.

### `docs_plan_exists`

- Meaning: a docs/plans artifact exists.
- Non-authority implication: planning does not approve implementation.

### `schema_ready_unenforced`

- Meaning: schema/profile posture is ready as reference but enforcement is not
  active.
- Non-authority implication: no validation execution, downstream enforcement,
  route selection, or runtime interpretation.

### `boundary_defined`

- Meaning: authority, privacy, interface, or ownership boundary is documented.
- Non-authority implication: a boundary is not a build plan and does not grant
  execution.

### `future_candidate`

- Meaning: could be valuable later if separately routed.
- Non-authority implication: not approved or authorized now.

### `paused`

- Meaning: intentionally stopped at the current planning/reference boundary.
- Non-authority implication: no active implementation or expansion.

### `deferred`

- Meaning: future work is explicitly delayed.
- Non-authority implication: not scheduled and not authorized.

### `not_authorized`

- Meaning: explicitly denied under current posture.
- Non-authority implication: must not be surfaced as available or pending
  activation.

## Risk-level semantics

### `low`

- Meaning: low chance of authority confusion if non-authority fields remain
  visible.
- Considerations: static reference, docs-only planning, limited privacy
  exposure, no runtime temptation.

### `medium`

- Meaning: moderate chance of being mistaken for implementation readiness or
  live capability.
- Considerations: operational evidence, schema readiness, future UI, or
  interface language could be overread without warnings.

### `high`

- Meaning: high chance of authority, privacy, runtime, or customer-data
  confusion.
- Considerations: desktop/browser handoff, API/runtime integration,
  provider/model dispatch, live telemetry, credential/session/token risk,
  customer-data risk, or need for formal audit/privacy review.

Risk levels are local display-planning risk notes only. They are not formal
audit classifications and do not replace `audit-nexus` review.

## Example static records

These examples are illustrative static records. They are not app data, not a
schema, and not a source of runtime truth.

```yaml
- repo: dev-jai-nexus
  lane: operator-control-plane
  capability: cross-repo coordination and static visibility
  category: reference_static_only
  useful_now: true
  current_status: active coordinator / static visibility
  owner_role: Operator Control Plane visibility and routing owner
  evidence_source: docs/plans/STATIC_TOOLCHAIN_STATUS_CAPABILITY_MAP_SURFACE_PLANNING_V0.md
  current_artifact: docs/reference/STATIC_TOOLCHAIN_STATUS_CAPABILITY_MAP_REFERENCE_MODEL_V0.md
  next_useful_move: route static TypeScript reference model only if separately approved
  visibility_allowed: yes_static
  implementation_status: docs_reference_exists
  explicit_non_authority: no runtime execution, no API/DB mutation, no automation, no control buttons
  risk_level: low
  recommended_route: dev-jai-nexus static TypeScript reference model v0, or pause

- repo: jai-format
  lane: workflow-packet-and-context-grammar
  capability: .jai language baseline, workflow-packet profile, context graph profile, permissive schema, optional strict schema
  category: strict_schema_ready_but_unenforced
  useful_now: true as reference; false as enforcement
  current_status: ready as reference / unenforced
  owner_role: canonical grammar, profile, and schema owner
  evidence_source: docs/plans/WORKFLOW_PACKET_STRICT_SCHEMA_STATIC_VISIBILITY_PLANNING_V0.md
  current_artifact: upstream jai-format workflow-packet schema/profile artifacts
  next_useful_move: continue grammar/schema stewardship only if more schema/profile work is needed
  visibility_allowed: reference_only
  implementation_status: schema_ready_unenforced
  explicit_non_authority: no parser/runtime/enforcement authority and no jai-format mutation here
  risk_level: medium
  recommended_route: jai-format stewardship or pause until a downstream consumer is elected

- repo: orchestrator-nexus
  lane: evidence-normalization-and-manual-runner
  capability: Edge Runner evidence normalization, manual runner, scheduled observer evidence
  category: currently_operational
  useful_now: true
  current_status: currently operational within bounded manual/evidence lanes
  owner_role: dry-run, manual-run, and evidence normalization owner
  evidence_source: .nexus/canon/edge-runner-readiness-matrix-v0.md
  current_artifact: Edge Runner manual runner and scheduled observer evidence lane
  next_useful_move: evidence index / latest.json consumption planning if routed
  visibility_allowed: yes_static
  implementation_status: operational_manual
  explicit_non_authority: no broad autonomous execution or remediation
  risk_level: medium
  recommended_route: orchestrator-nexus evidence index/latest.json consumption planning

- repo: jai-edge
  lane: edge-health-signal-source
  capability: read-only health snapshot utility
  category: currently_operational
  useful_now: true
  current_status: currently operational as read-only signal source
  owner_role: private/local read-only Edge Runner evidence node
  evidence_source: docs/reference/EDGE_RUNNER_HEALTH_STATUS_CARD_V0.md
  current_artifact: jai-edge / scripts/edge_health_snapshot.py
  next_useful_move: preserve as read-only source and connect only through governed evidence lanes
  visibility_allowed: yes_static
  implementation_status: operational_manual
  explicit_non_authority: no deployment, no customer workload, no runtime mutation
  risk_level: medium
  recommended_route: pause unless new manual evidence visibility is routed

- repo: jai
  lane: substrate-council-semantics
  capability: portable substrate / council reasoning semantics
  category: reference_static_only
  useful_now: true as semantics reference
  current_status: semantics reference
  owner_role: substrate, motion, council, and reasoning semantics owner
  evidence_source: docs/plans/JAI_TOOLCHAIN_WORKFLOW_SPINE_V0.md
  current_artifact: shared semantics references in jai
  next_useful_move: support downstream packet/approval clarity if routed
  visibility_allowed: reference_only
  implementation_status: docs_reference_exists
  explicit_non_authority: no product UI/API/runtime execution
  risk_level: low
  recommended_route: pause or route semantics clarification only if needed

- repo: jai-vscode
  lane: ide-context-handoff
  capability: IDE bridge / role packet / preflight direction
  category: future_ui_candidate
  useful_now: partial; false until next boundary for implementation
  current_status: future UI / handoff candidate
  owner_role: future IDE-side context and packet review surface owner
  evidence_source: .nexus/canon/toolchain-integration-readiness-matrix-v0.md
  current_artifact: IDE ownership and authority-hardening boundary references
  next_useful_move: context/work packet handoff boundary
  visibility_allowed: deferred
  implementation_status: future_candidate
  explicit_non_authority: no hidden file capture, no autonomous repo mutation
  risk_level: high
  recommended_route: jai-vscode context/work packet handoff boundary after audit posture is explicit

- repo: jai-pilot
  lane: browser-desktop-handoff
  capability: future explicit handoff UX
  category: future_ui_candidate
  useful_now: false
  current_status: future UI candidate
  owner_role: future browser/desktop handoff owner
  evidence_source: .nexus/canon/toolchain-integration-readiness-matrix-v0.md
  current_artifact: product / extension ownership boundary references
  next_useful_move: explicit handoff UX boundary
  visibility_allowed: deferred
  implementation_status: future_candidate
  explicit_non_authority: no hidden scraping, no credential/session/token capture, no autonomous browser/desktop actions
  risk_level: high
  recommended_route: jai-pilot explicit handoff UX boundary after audit/privacy review

- repo: api-nexus
  lane: interface-integration-boundary
  capability: future API/interface/data-contract surface
  category: future_runtime_candidate
  useful_now: false
  current_status: future runtime/interface candidate; runtime integration not authorized
  owner_role: future API/interface boundary owner
  evidence_source: .nexus/canon/toolchain-runtime-integration-gate-tracker-v0.md
  current_artifact: Toolchain integration interface and validation boundary references
  next_useful_move: interface planning only after clearer packet consumer demand
  visibility_allowed: no_live_visibility
  implementation_status: deferred
  explicit_non_authority: no global SoT, no runtime Toolchain integration, no downstream enforcement by default
  risk_level: high
  recommended_route: api-nexus interface planning only if CONTROL_THREAD routes it

- repo: audit-nexus
  lane: authority-privacy-risk-review
  capability: future packet/context/privacy/security review
  category: future_tooling_candidate
  useful_now: true as review candidate; false as implementation gate unless routed
  current_status: review candidate / boundary support
  owner_role: privacy, security, and authority review owner
  evidence_source: docs/plans/JAI_TOOLCHAIN_WORKFLOW_SPINE_V0.md
  current_artifact: packet/schema authority and privacy review references
  next_useful_move: packet/schema authority and privacy review before client-side handoff work
  visibility_allowed: planning_only
  implementation_status: boundary_defined
  explicit_non_authority: review does not grant implementation authority by itself
  risk_level: medium
  recommended_route: audit-nexus packet/schema authority and privacy review

- repo: docs-nexus
  lane: canon-source-intelligence
  capability: documentation/source intelligence/canon support
  category: reference_static_only
  useful_now: true
  current_status: static documentation and canon support
  owner_role: documentation, source-intelligence, and canon support owner
  evidence_source: docs/reference/JAI_TOOLCHAIN_REPO_ROLE_MAP_V0.md
  current_artifact: docs/canon/source-intelligence references
  next_useful_move: support canon packaging and source-intelligence continuity
  visibility_allowed: reference_only
  implementation_status: docs_reference_exists
  explicit_non_authority: no runtime execution or product state
  risk_level: low
  recommended_route: docs-nexus support only if CONTROL_THREAD routes documentation work
```

## Future surface usage rules

Any future Toolchain Status / Capability Map surface using this model must:

- be static/read-only unless separately governed
- use manually maintained model data
- avoid live dashboard wording
- avoid real-time status claims
- avoid action buttons
- avoid remediation controls
- avoid dispatch controls
- avoid validation execution controls
- avoid provider/model controls
- avoid branch/PR automation controls
- keep non-authority fields visible
- clearly distinguish useful-now from authorized-to-execute
- show operational evidence lanes as bounded/manual, not production authority
- show future runtime candidates as deferred/not authorized

## Implementation recommendation

Recommended posture:

- this slice creates only this docs/reference model
- no portal/app implementation in this branch
- no static TypeScript model in this branch
- no dashboard card in this branch
- no runtime or live dashboard behavior in this branch

A later separately routed slice may create:

- static TypeScript reference model
- static dashboard card
- static status/capability overview

Live dashboard behavior remains deferred and unauthorized.

## Implementation non-goals

This reference model does not implement:

- portal/app code
- app/reference TypeScript models
- live data
- polling
- hooks
- API/DB behavior
- validation execution
- parser behavior
- formatter behavior
- projection behavior
- CLI behavior
- CI wiring
- provider/model dispatch
- runtime interpretation
- automation
- branch/PR automation
- customer data handling
- credential/session/token capture
- deployment/sync/migration behavior

## Explicit forbidden behaviors

This artifact does not authorize:

- portal/app code
- schema changes
- `jai-format` mutation
- validation execution
- parser implementation
- formatter implementation
- projection implementation
- CLI implementation
- CI wiring
- runtime interpreter
- live routing
- automation
- provider/model dispatch
- desktop/browser control
- API/DB mutation
- branch/PR automation
- production/customer workload authority
- deployment/sync/migration authority
- runtime execution
- automation execution
- downstream enforcement
- customer data handling
- credential/session/token capture
- live telemetry
- control buttons
- remediation controls
- live dashboard behavior

## Residual risks

- reference model may be mistaken for implementation
- `useful_now` may be mistaken for `authorized_to_execute`
- operational evidence lanes may be mistaken for production authority
- future UI may omit non-authority fields
- risk levels may be overread as formal audit classification
- model can drift if not updated after major repo lane changes
- manual maintenance can become stale
- schema readiness may be mistaken for validation execution or enforcement
- future runtime candidates may be overread as approved roadmap work

## Recommended next routing

If `CONTROL_THREAD` wants implementation planning to continue:

- route `dev-jai-nexus` Static Toolchain Status / Capability Map TypeScript
  Reference Model v0

If `CONTROL_THREAD` wants to avoid UI expansion:

- pause after this docs/reference model

Alternative valid routes:

- `audit-nexus` packet/schema authority and privacy review before any
  client-side handoff work
- `orchestrator-nexus` evidence index/latest.json consumption planning
- `jai-vscode` context/work packet handoff boundary
- `jai-pilot` explicit handoff UX boundary

## Authority boundary

This artifact is docs/reference only.

It does not:

- implement a surface
- authorize portal/app changes
- authorize runtime integration
- authorize execution or automation
- authorize downstream enforcement
- authorize cross-repo mutation
- authorize live dashboard behavior
