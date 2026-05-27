# Static Toolchain Status Capability Map Surface Planning v0

## Objective

Plan a static/read-only Operator Control Plane Toolchain Status / Capability
Map surface that translates the settled JAI Toolchain Active Capability Map
into operator-facing visibility direction without adding portal/app
implementation, live telemetry, runtime behavior, automation, validation
execution, API/DB mutation, or control buttons.

This artifact is docs/plans only. It does not authorize portal/app code,
schema changes, `jai-format` mutation, validation execution, parser behavior,
formatter behavior, projection behavior, CLI/CI wiring, runtime
interpretation, live routing, automation, provider/model dispatch,
desktop/browser control, API/DB mutation, branch/PR automation,
production/customer workload authority, deployment/sync/migration authority,
or downstream enforcement.

## Source baseline

Primary source baseline:

- `docs/plans/JAI_TOOLCHAIN_ACTIVE_CAPABILITY_MAP_V0.md`

Related settled planning/reference inputs:

- `docs/plans/JAI_TOOLCHAIN_WORKFLOW_SPINE_V0.md`
- `docs/reference/JAI_TOOLCHAIN_REPO_ROLE_MAP_V0.md`
- `docs/reference/JAI_TOOLCHAIN_PACKET_FLOW_V0.md`
- `docs/plans/WORKFLOW_PACKET_STRICT_SCHEMA_STATIC_VISIBILITY_PLANNING_V0.md`
- `docs/reference/STATIC_JAI_CONTEXT_VISIBILITY_REVIEW_V0.md`

## Files and artifacts inspected

- `docs/plans/JAI_TOOLCHAIN_ACTIVE_CAPABILITY_MAP_V0.md`
- `docs/plans/JAI_TOOLCHAIN_WORKFLOW_SPINE_V0.md`
- `docs/reference/JAI_TOOLCHAIN_REPO_ROLE_MAP_V0.md`
- `docs/reference/JAI_TOOLCHAIN_PACKET_FLOW_V0.md`
- `docs/plans/WORKFLOW_PACKET_STRICT_SCHEMA_STATIC_VISIBILITY_PLANNING_V0.md`
- `.nexus/canon/toolchain-integration-readiness-matrix-v0.md`
- `.nexus/canon/toolchain-runtime-integration-gate-tracker-v0.md`
- `.nexus/canon/jai-toolchain-product-foundry-routing.md`
- `portal/src/app/page.tsx`
- `portal/src/lib/controlPlane/authorityPosture.ts`
- `package.json`
- `portal/package.json`

## Static surface purpose

The future static surface should give `CONTROL_THREAD` and operator-facing
control-plane viewers one compact place to see:

- what the JAI Toolchain can currently do
- which lanes are operational now
- which lanes are static/reference only
- which lanes are planning-only
- which lanes are paused
- which lanes are deferred/runtime candidates
- what the next recommended useful move is
- which actions remain explicitly non-authorized

The surface should be a visibility translation of settled planning material,
not a live dashboard and not an implementation control surface.

## Recommended status/capability sections

Recommended future static sections:

- Toolchain overview
- Useful-now capabilities
- Operational evidence lanes
- Static/reference lanes
- Planning-only lanes
- Paused lanes
- Deferred/runtime lanes
- Repo capability table
- Current recommended next action
- Non-authorizations / forbidden controls

Recommended ordering:

1. top-level Toolchain status summary
2. useful-now capabilities
3. repo/lane capability table
4. paused and deferred lane lists
5. recommendation banner
6. non-authorization banner

## Candidate static fields

Core fields:

- `repo`
- `capability`
- `category`
- `useful_now`
- `owner_role`
- `current_status`
- `next_useful_move`
- `explicit_non_authority`
- `visibility_allowed`
- `implementation_status`

Optional fields if the future static surface needs more specificity:

- `evidence_source`
- `current_artifact`
- `missing_gap`
- `recommended_route`
- `risk_level`
- `downstream_dependency`
- `authority_posture`

Recommended top-level summary fields:

- `toolchain_status_summary`
- `useful_now_count`
- `operational_lane_count`
- `paused_lane_count`
- `deferred_lane_count`
- `recommended_next_action`
- `visibility_posture`

## Visibility model

Recommended visibility model:

- static/read-only
- manually maintained reference content only
- no live data ingestion
- no runtime packet ingestion
- no polling
- no hooks
- no API/DB behavior
- no action surface

Interpretation rules the surface should preserve:

- useful-now does not mean runtime automation
- operational evidence does not imply broad execution authority
- static visibility does not imply live dashboard behavior
- planning-only does not imply implementation approval
- deferred/runtime does not imply authorization

## Repo/lane coverage

The future static surface should cover these repos and lanes:

- `dev-jai-nexus`
  - Operator Control Plane / cross-repo coordinator
  - static visibility planning
  - workflow-packet strict-schema visibility planning
  - static Edge Runner health operator surface
- `jai-format`
  - `.jai` language / Routing Core / NHID / source style
  - workflow-packet profile
  - project-context-graph profile
  - permissive workflow-packet schema
  - optional strict workflow-packet schema
- `orchestrator-nexus`
  - dry-run planning lane
  - manual runner lane
  - Edge Runner health evidence lane
  - Pi scheduled health observer lane
  - evidence normalization
- `jai-edge`
  - read-only health snapshot utility
  - Pi Edge Runner health evidence source
  - private/local evidence node
- `jai`
  - portable substrate / council reasoning semantics
  - motion/council semantics
- `vscode-nexus`
  - IDE bridge
  - role packet / preflight direction
  - repo-context bridge
  - explicit context inclusion posture
- `jai-pilot`
  - future desktop/browser/operator handoff surface
  - explicit user-approved handoff UX candidate
- `api-nexus`
  - future interface / integration / data-contract surface
- `audit-nexus`
  - packet/context/privacy/security review lane
- `docs-nexus`
  - documentation/source intelligence/canon support

## Useful-now capability treatment

Useful-now capabilities the future surface should emphasize:

### Edge Runner health evidence loop

- `jai-edge` read-only signal
- `orchestrator-nexus` normalized evidence / manual runner / scheduled observer
- `dev-jai-nexus` static operator visibility

This should be framed as:

- currently useful
- operational evidence lane
- not broad runtime authority
- not deployment authority

### `CONTROL_THREAD` passalong/routing workflow

Should be shown as:

- useful now
- coordination/routing utility
- non-executing by itself

### `dev-jai-nexus` cross-repo planning/canon surface

Should be shown as:

- useful now
- static/reference utility
- not runtime implementation

### `jai-format` workflow packet and context graph baseline

Should be shown as:

- useful now as reference utility
- strict-schema ready but unenforced
- not downstream enforcement

### Static docs/reference coordination maps

Should be shown as:

- useful now for alignment
- not live system state

## Paused/deferred lane treatment

Paused lanes the future surface may show:

- `dev-jai-nexus` strict-schema visibility work after docs/plans-only review
- direct portal/app implementation for strict-schema visibility
- deeper schema work in `dev-jai-nexus` unless a real consumer appears
- runtime Toolchain integration
- live dashboard implementation

Deferred lanes the future surface may show:

- unified live Toolchain dashboard
- runtime packet ingestion
- parser/projection runtime
- schema enforcement in `dev-jai-nexus`
- API/DB persistence
- provider/model dispatch
- approved desktop/browser handoff implementation
- automated branch/PR workflow
- customer-facing `.jai` surfaces
- production/customer workload path

Recommended treatment:

- paused lanes should be visible as intentionally stopped, not abandoned
- deferred lanes should be visible as future candidates, not approved work

## Warning / non-authorization copy

A future static surface should make clear:

- status display is not runtime authority
- capability category is not implementation readiness
- operational evidence lane is not production authority
- schema readiness is not enforcement
- reference/static lane is not live ingestion
- planning-only lane is not implementation approval
- deferred/runtime lane is not authorized
- no control buttons should be present
- no remediation, dispatch, validation execution, or live routing is authorized

Recommended banner-style copy:

- `Read-only capability overview only. No live telemetry, no dispatch, no validation execution, no remediation controls.`
- `Operational lane means useful evidence or coordination exists now. It does not grant runtime, deployment, or production authority.`

## Implementation recommendation

Recommended posture for this slice:

- planning only
- docs/plans artifact first
- no portal/app code
- no runtime dashboard behavior
- no live data ingestion
- no validation execution
- no API/DB persistence
- no control buttons
- no implication of runtime authority

Recommended decision among the implementation options:

- no UI implementation yet
- static app/reference model later only if separately routed
- static dashboard card later only if separately routed

Do not proceed to portal/app implementation from this branch.

## Implementation levels

### Level 0 - docs/plans only

- current slice
- no UI/app files
- no runtime behavior

### Level 1 - static app/reference model

- future separately routed
- local static data only
- no live rendering requirements beyond static material
- no API/DB behavior

### Level 2 - static dashboard card

- future separately routed
- non-interactive card(s)
- no live data
- no hooks
- no polling
- no buttons

### Level 3 - live dashboard

- explicitly deferred and unauthorized
- would require separate governance
- would require API/data model design
- would require privacy/security review
- would require runtime authority

## Future surface shape

If later routed, the static surface may show:

- top-level Toolchain status summary
- useful-now capability cards
- operational evidence loop summary
- repo capability table
- paused/deferred lane list
- recommended next action
- non-authorization banner

It must not show:

- live status claims
- real-time indicators
- auto-refresh language
- action buttons
- remediation controls
- dispatch controls
- validation execution controls
- provider/model controls
- branch/PR automation controls

## Deferred implementation paths

Deferred until separately routed:

- static app/reference model
- static dashboard card
- portal rendering implementation
- evidence index consumption
- runtime packet ingestion
- schema enforcement display tied to execution
- interactive filtering, controls, or actions
- live dashboard behavior

## Residual risks

- static surface planning could be mistaken for dashboard implementation
  approval
- capability categories could be overread as readiness
- operational evidence lanes could be mistaken for broad runtime authority
- strict-schema readiness could be mistaken for enforcement
- future UI could drift toward live-dashboard expectations
- control-plane visibility could become crowded without prioritization
- client-side lanes could be pursued before audit/privacy review is explicit
  enough

## Recommended next routing

Suggested final recommendation:

- route next to `dev-jai-nexus` for Static Toolchain Status / Capability Map
  Reference Model v0 only if `CONTROL_THREAD` wants implementation planning to
  continue

Otherwise:

- pause after this planning artifact

Alternative valid next routes:

- `orchestrator-nexus` evidence index / `latest.json` consumption planning
- `audit-nexus` packet/schema authority and privacy review
- `vscode-nexus` context/work packet handoff boundary
- `jai-pilot` explicit handoff UX boundary
- `jai-format` typed-reference fixture examples

## Non-authorizations preserved

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
- downstream enforcement
- customer data handling
- credential/session/token capture
- live telemetry
- control buttons
- remediation controls

## Authority boundary

This artifact is docs/plans only.

It does not:

- implement a surface
- authorize portal/app changes
- authorize runtime integration
- authorize execution or automation
- authorize downstream enforcement
- authorize cross-repo mutation
