# Workflow Packet Strict Schema Static Visibility Planning v0

## Objective

Define how `dev-jai-nexus` could statically reference the `jai-format`
workflow-packet strict schema lane from the Operator Control Plane without
executing validation, enforcing schemas, selecting routes, dispatching work,
or adding runtime behavior.

This artifact is planning-only and control-plane visibility only. It does not
authorize schema execution, CLI/CI wiring, parser behavior, formatter
behavior, projection behavior, runtime interpretation, live routing,
automation, provider/model dispatch, desktop/browser control, API/DB
mutation, branch/PR automation, production/customer workload authority,
deployment/sync/migration authority, or cross-repo mutation.

## Source baseline

This plan uses the settled `jai-format` strict schema lane baseline as
documentary input only.

Settled baseline for this planning seam:

- `workflow-packet/v0` has a canonical permissive schema:
  `schemas/workflow-packet.v0.schema.json`
- `workflow-packet/v0` has an optional strict schema draft:
  `schemas/workflow-packet.v0.strict.schema.json`
- the optional strict schema validates normalized projected JSON only
- the optional strict schema does not validate source `.jai`
- the permissive schema remains canonical
- the optional strict schema remains optional and non-authorizing
- the optional strict schema covers all 11 current workflow packet classes
- all 11 projected JSON workflow packet fixtures pass both schemas
- active workflow packet fixtures use canonical approval/gate enum values plus
  explicit scope metadata
- transitional approval/gate compatibility aliases were removed from optional
  strict schema compatibility definitions
- no parser, formatter, projection tooling, CLI/CI wiring, runtime behavior,
  automation, provider dispatch, API contract, or downstream enforcement was
  added

This plan does not import, execute, or mutate `jai-format`. It only defines
how `dev-jai-nexus` may reference that strict schema posture statically.

## Files and artifacts inspected or considered

### Inspected in `dev-jai-nexus`

- `docs/reference/STATIC_JAI_CONTEXT_VISIBILITY_REVIEW_V0.md`
- `docs/plans/JAI_TOOLCHAIN_WORKFLOW_SPINE_V0.md`
- `docs/reference/JAI_TOOLCHAIN_PACKET_FLOW_V0.md`
- `docs/reference/JAI_TOOLCHAIN_REPO_ROLE_MAP_V0.md`
- `docs/plans/EDGE_RUNNER_HEALTH_SNAPSHOT_CONTROL_PLANE_VISIBILITY_PLAN_V0.md`
- `.nexus/canon/dry-run-plan-visibility-boundary-v0.md`
- `.nexus/canon/jai-toolchain-product-foundry-routing.md`
- `.nexus/canon/toolchain-integration-readiness-matrix-v0.md`
- `.nexus/canon/toolchain-runtime-integration-gate-tracker-v0.md`
- `.nexus/canon/customer-safe-jai-boundary-intake-v0.md`
- `portal/src/app/page.tsx`
- `portal/src/lib/controlPlane/authorityPosture.ts`
- `package.json`
- `portal/package.json`

### Considered conceptually from settled `jai-format` passalong baseline

The following external `jai-format` artifacts were considered as reference
candidates only. They were not imported, executed, or mutated in this plan:

- strict schema lane closeout artifact
- downstream strict schema consumer evaluation artifact
- `schemas/workflow-packet.v0.schema.json`
- `schemas/workflow-packet.v0.strict.schema.json`
- projected JSON fixture validation results
- approval/gate enum normalization notes
- evidence/reference typing posture notes

## Strict schema lane summary

The strict schema lane should be understood in `dev-jai-nexus` as reference
context only.

The relevant settled facts that may be surfaced statically are:

- a canonical permissive workflow-packet schema exists
- an optional strict workflow-packet schema exists
- the strict schema covers all 11 current packet classes
- all 11 projected JSON fixtures passed both schemas
- the strict schema validates normalized projected JSON only
- the strict schema does not validate source `.jai`
- the strict schema is optional and non-authorizing
- the strict schema does not select downstream consumers
- the strict schema does not create downstream enforcement authority

## Recommended static visibility model

Recommended decision:

- `dev-jai-nexus` may reference the strict schema lane only as static planning
  and control-plane context
- no portal/app code should be added in this pass
- no app/reference model should be added in this pass
- any future Operator Control Plane surface should remain static/read-only
- the first visibility step should be documentary: plan/reference artifacts
  only

This mirrors the repo’s existing posture for dry-run visibility, `.jai`
context visibility, and Toolchain gate visibility:

- reference the existence of the lane
- show what it proves and what it does not prove
- keep denied authority visible
- do not ingest, execute, or enforce anything live

## Allowed static fields

If a later static card/reference model is routed, the following fields may be
shown as static context only:

- `schema_profile`: `workflow-packet/v0`
- `permissive_schema`: `schemas/workflow-packet.v0.schema.json`
- `strict_schema`: `schemas/workflow-packet.v0.strict.schema.json`
- `strict_schema_status`: `optional`
- `fixture_validation_status`: `11/11 pass`
- `packet_class_coverage`: `11 classes`
- `validates`: `normalized projected JSON`
- `does_not_validate`: `source .jai`
- `permissive_schema_status`: `canonical`
- `approval_gate_vocab_status`: `canonical enums only`
- `scope_metadata_status`: `explicit`
- `authority_posture`: `non-authorizing`
- `downstream_enforcement`: `none`
- `recommended_next_action`: `CONTROL_THREAD decision required`

These fields must remain static, manually maintained reference content only.

## Reference/doc links to expose later

If a future static visibility surface is routed, the recommended references to
list are:

- `jai-format` strict schema lane closeout
- `jai-format` downstream consumer evaluation
- permissive schema artifact path:
  `schemas/workflow-packet.v0.schema.json`
- strict schema artifact path:
  `schemas/workflow-packet.v0.strict.schema.json`
- projected JSON fixture validation results
- approval/gate enum normalization posture
- evidence/reference typing posture

These should be presented as reference links or cited source paths only, not
as auto-ingested live artifacts.

## Control-plane warning copy

A future static surface should warn explicitly:

- schema validity is not approval
- schema validity is not route selection
- schema validity is not dispatch permission
- schema validity is not execution permission
- schema validity is not production readiness
- schema validity is not canon promotion
- schema validity is not downstream enforcement

Additional recommended warning copy:

- strict schema is optional and non-authorizing
- strict schema validates normalized projected JSON only
- source `.jai` is not directly validated by strict schema
- permissive schema remains canonical

## Downstream boundary

`dev-jai-nexus` may:

- reference strict schema posture as static planning/control-plane context
- describe what a future static surface could summarize
- cite upstream schema/profile/fixture references
- keep the boundary between visibility and authority explicit

`dev-jai-nexus` must not:

- become a schema validator in this pass
- select downstream consumers automatically
- execute validation against upstream artifacts
- infer source `.jai` validity from projected JSON validity
- imply that strict schema status changes authority in any downstream repo

Additional downstream boundary facts:

- `vscode-nexus`, `orchestrator-nexus`, `api-nexus`, and `jai` remain
  unelected as consumers unless separately routed
- `jai-format` remains owner of workflow-packet schema/profile artifacts
- strict schema status does not alter authority in any downstream repo

## Deferred implementation paths

Deferred until separately routed:

- validation execution
- CLI/CI validation
- parser behavior
- formatter behavior
- projection behavior
- runtime routing
- provider/model dispatch
- API/DB mutation
- route selection
- dispatch controls
- production/customer workload authority
- downstream enforcement
- automatic ingestion of `jai-format` artifacts
- static app/reference model
- dashboard card or portal surface

## Recommended next implementation posture

Recommended current posture:

- docs/plans artifact now
- static app/reference model later only if separately routed
- dashboard card later only if separately routed
- no UI change in this pass

This keeps the strict schema lane visible to `CONTROL_THREAD` without implying
that `dev-jai-nexus` has become a validator, gate, or dispatcher.

## Non-goals

- adding portal/app code
- adding app/reference models
- executing schema validation from `dev-jai-nexus`
- ingesting `jai-format` artifacts automatically
- creating control buttons
- implying enforcement
- selecting downstream consumers automatically
- mutating `jai-format`
- mutating any repo outside `dev-jai-nexus`

## Explicit forbidden behaviors

This plan does not authorize:

- schema changes
- `jai-format` mutation
- parser implementation
- formatter implementation
- projection implementation
- validation execution
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
- portal/app code changes unless explicitly rerouted later

## Residual risks

- static visibility may be mistaken for validator implementation if the warning
  copy is weak
- `11/11` fixture pass may be mistaken for production readiness
- optional strict schema could be mistaken for canonical enforcement
- projected JSON validity could be mistaken for source `.jai` validity
- downstream repos may prematurely adopt strict schema as a gate unless the
  authority boundary remains prominent
- schema/profile vocabulary can drift if copied too deeply into
  `dev-jai-nexus`

## Recommended next routing

Preferred next route:

- `jai-format` continue grammar/schema stewardship only if more schema/profile
  work is needed

Likely `dev-jai-nexus` follow-up only if `CONTROL_THREAD` wants visibility:

- `dev-jai-nexus` static workflow-packet schema posture card/reference model

Alternative valid routes:

- `audit-nexus` packet/schema authority and privacy review
- `vscode-nexus` context/work packet handoff boundary after grammar/schema is
  more settled
- `orchestrator-nexus` dispatch packet dry-run schema alignment after
  workflow-packet grammar is stable

Current recommendation:

- keep this pass as docs/plans only
- do not add portal or runtime behavior now

## Authority boundary

This artifact is planning-only and control-plane visibility only.

It does not:

- authorize schema execution
- authorize validation enforcement
- authorize runtime behavior
- authorize route selection
- authorize dispatch behavior
- authorize cross-repo mutation
