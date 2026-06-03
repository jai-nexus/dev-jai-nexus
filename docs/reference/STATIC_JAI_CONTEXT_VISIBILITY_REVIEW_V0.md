# Static JAI Context Visibility Review v0

## Objective

Evaluate how `dev-jai-nexus` should expose or reference the current settled
`.jai` language and context-graph baseline for `CONTROL_THREAD` visibility in
the Operator Control Plane.

This review is docs/reference only. It does not implement parsing, formatting,
projection, schema enforcement, CLI validation, CI wiring, runtime
interpretation, live routing, automation, provider/model dispatch,
desktop/browser control, API/DB mutation, branch/PR automation, production or
customer workload authority, deployment/sync/migration authority, live
telemetry, control buttons, or remediation controls.

## Source baseline

This review uses the settled passalong baseline for `jai-format` as
documentary input only.

Settled `jai-format` baseline used for this review:

- `.jai` is a governed information routing language
- NHID means Numerical Hierarchy ID
- `.jai` is node-oriented
- information items may be addressed, routed, gated, evidenced, and governed
  by authority metadata
- syntax, semantics, profiles, and execution are separate layers
- execution is not implied by representation
- `workflow-packet/v0` is a profile/projection over Routing Core
- `project-context-graph/v0` is a `.jai` profile over Routing Core for durable
  agent-loadable project context
- canonical `.jai v0` source style is NHID-ledger style
- workflow packet normalized JSON has a Draft 2020-12 schema target
- workflow packet projected JSON examples validate structurally against that
  schema
- schema validity is structural only

This review does not import or mutate `jai-format`. It only recommends how
`dev-jai-nexus` should reference that settled baseline.

## Files and artifacts inspected or considered

### Inspected in `dev-jai-nexus`

- `docs/plans/JAI_TOOLCHAIN_WORKFLOW_SPINE_V0.md`
- `docs/reference/JAI_TOOLCHAIN_REPO_ROLE_MAP_V0.md`
- `docs/reference/JAI_TOOLCHAIN_PACKET_FLOW_V0.md`
- `.nexus/canon/jai-toolchain-product-foundry-routing.md`
- `.nexus/canon/toolchain-integration-readiness-matrix-v0.md`
- `.nexus/canon/toolchain-runtime-integration-gate-tracker-v0.md`
- `.nexus/canon/customer-safe-jai-boundary-intake-v0.md`
- `portal/src/app/page.tsx`
- `portal/src/lib/controlPlane/authorityPosture.ts`
- repo-local lint/validation entries in `package.json` and `portal/package.json`

### Considered conceptually from settled `jai-format` passalong baseline

The following external artifacts were considered as reference candidates only.
They were not imported, executed, parsed, or mutated in this review:

- `docs/reference/JAI_FORMAT_LANGUAGE_BASELINE_REVIEW_V0.md`
- `docs/specs/JAI_ROUTING_CORE_V0.md`
- `docs/specs/JAI_NHID_INDENTATION_SOURCE_STYLE_V0.md`
- `docs/specs/JAI_WORKFLOW_PACKET_PROFILE_V0.md`
- `docs/specs/JAI_PROJECT_CONTEXT_GRAPH_V0.md`
- `docs/examples/prototypes/q2-grid-ingest-routing-prototype-v0.jai`
- `docs/examples/context-graphs/jai-toolchain-context-graph-v0.jai`
- `docs/examples/context-graphs/jai-format-context-graph-v0.jai`
- `docs/examples/context-graphs/pi-observer-lane-context-graph-v0.jai`
- `docs/examples/context-graphs/workflow-packet-context-graph-v0.jai`
- `schemas/workflow-packet.v0.schema.json`
- `docs/examples/workflow-packets-json/`

## `.jai` visibility recommendation

Recommended decision:

- `dev-jai-nexus` should consume the current `.jai` baseline as
  documentation/static reference first
- the first downstream use should be `CONTROL_THREAD` visibility into the
  settled language baseline, profile set, and selected example context graphs
- no parser, projection layer, schema enforcement, runtime interpretation, or
  live-linked context loading should be added in this pass
- future visibility should remain manual/reference-based until a later explicit
  route authorizes a static surface or model

This is the safest first downstream consumption model because it makes `.jai`
useful immediately as governed context without implying execution or runtime
authority.

## Selected `.jai` artifacts for `CONTROL_THREAD` visibility

Recommended selected artifact set:

- JAI Format Language Baseline Review v0
- JAI Routing Core v0
- JAI NHID Indentation / NHID-ledger Source Style v0
- JAI Workflow Packet Profile v0
- JAI Project Context Graph v0
- `jai-toolchain-context-graph-v0.jai`
- `jai-format-context-graph-v0.jai`
- `workflow-packet-context-graph-v0.jai`
- `workflow-packet.v0.schema.json`
- workflow packet projected JSON examples

Optional selected artifact:

- `pi-observer-lane-context-graph-v0.jai`

Rationale for the optional artifact:

- useful only if a later static reference wants to connect `.jai` context
  visibility to the recently settled Edge Runner health workflow
- not required for the first review surface

## Recommended static consumption path

Recommended consumption path for `dev-jai-nexus`:

1. record the settled `.jai` baseline in a static review/reference artifact
2. use that review as the routing basis for any later Operator Control Plane
   static card/surface discussion
3. preserve all `.jai` source/profile/schema examples as manually referenced
   upstream material, not locally loaded runtime content
4. route any future surface only as a static/read-only visibility seam

This path keeps `dev-jai-nexus` aligned with its existing role:

- Operator Control Plane visibility
- cross-repo routing
- approval posture
- documentary passalong and evidence interpretation

It avoids turning `dev-jai-nexus` into:

- a parser owner
- a schema owner
- a projection engine
- a context runtime
- a client handoff executor

## Static visibility model

A future static Operator Control Plane card or reference surface, if routed
later, may show:

- language baseline: settled
- context graph profile: settled
- workflow packet profile: settled
- source style: NHID-ledger
- schema posture: Draft 2020-12 target / structural validation only
- representation boundary: execution not implied
- selected context graphs: manual reference only
- next downstream consumers:
  - `dev-jai-nexus` static visibility
  - `jai-format` packet grammar/schema continuation
  - `jai-vscode` explicit context handoff boundary
  - `jai-pilot` explicit handoff UX boundary
  - `audit-nexus` packet/context privacy review

Recommended posture for that future surface:

- static/read-only
- reference-oriented
- no live-linked context loading
- no parser output
- no control action surface

## Representation-only authority boundary

Static `.jai` context visibility must preserve:

- `.jai` is representation/governance language first
- execution is not implied by representation
- syntax, semantics, profiles, and execution remain separate layers
- structural schema validity is not runtime authority
- context graph visibility is not agent execution authority

This means a future `dev-jai-nexus` static surface must not imply:

- parser behavior
- formatter behavior
- projection behavior
- schema enforcement
- CLI validation
- CI validation
- runtime interpretation
- live routing
- automation
- provider/model dispatch
- desktop/browser control
- API/DB mutation
- branch/PR automation
- production/customer workload authority
- deployment/sync/migration authority
- remediation/control authority

## Deferred implementation paths

Deferred until separately routed:

- static Operator Control Plane `.jai` context card
- static packet-flow visibility surface
- parser/projection implementation
- workflow packet schema enforcement
- CLI validation
- CI validation
- provider/model-backed agent contextualization
- runtime interpretation
- live routing
- API/DB persistence
- client handoff implementation
- customer-facing `.jai` surfaces

## Future static card/surface recommendation

Recommended current decision:

- do not add a portal model or app surface in this pass
- keep this review docs/reference only
- route a later explicit static card/surface seam only if `CONTROL_THREAD`
  wants operator-facing summarization beyond docs

Reason:

- the current request is satisfied by a reference review
- the portal already has a strong static/read-only posture
- adding a new model now would create a second artifact to maintain before the
  exact visibility scope is chosen

If a later surface is routed, prefer a compact static model that cites:

- baseline review
- Routing Core
- NHID-ledger source style
- workflow-packet/v0
- project-context-graph/v0
- representation-only authority boundary

## Non-goals

- implementing a parser
- implementing a formatter
- implementing projection behavior
- implementing schema enforcement
- implementing CLI validation
- wiring CI validation
- adding a runtime interpreter
- adding live routing
- adding automation
- adding provider/model dispatch
- adding desktop/browser control
- adding API/DB mutation
- adding branch/PR automation
- adding production/customer workload authority
- adding deployment/sync/migration authority
- adding live telemetry
- adding control buttons
- adding remediation controls
- mutating `jai-format`
- mutating any repo outside `dev-jai-nexus`

## Explicit forbidden behaviors

This review does not authorize:

- parser implementation
- formatter implementation
- projection implementation
- schema implementation
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
- live telemetry
- control buttons
- remediation controls
- external repo mutation
- `jai-format` mutation

## Residual risks

- a static visibility surface could still be overread as execution readiness if
  the representation-only boundary is not kept prominent
- schema-target language could be mistaken for parser or validator readiness if
  structural-only status is not repeated clearly
- context graph examples could be mistaken for live-loaded context unless the
  manual/reference posture remains explicit
- `.jai` profile vocabulary may continue evolving upstream, which could create
  review drift if `dev-jai-nexus` later mirrors too much detail locally
- future requests may try to collapse reference visibility and implementation
  work into one seam before authority boundaries are settled

## Recommended next routing

Preferred next route:

- `dev-jai-nexus` static Operator Control Plane `.jai` context card/surface
  decision, still reference-only, only if `CONTROL_THREAD` wants a visible
  operator summary beyond docs

Alternative valid next routes:

- `jai-format` workflow packet grammar/schema continuation
- `jai-vscode` explicit context handoff boundary
- `jai-pilot` explicit handoff UX boundary
- `audit-nexus` packet/context privacy review

Current recommendation:

- accept docs/reference review as the safest first downstream consumption of
  `.jai`
- do not add portal/runtime behavior in this pass

## Authority boundary

This artifact is docs/reference only.

It does not:

- implement `.jai` behavior
- implement validation behavior
- implement runtime behavior
- implement packet routing
- implement context loading
- authorize execution
- authorize cross-repo mutation
