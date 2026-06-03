# CONTROL_THREAD Portfolio Routing Protocol v0

## Objective

Define a durable `CONTROL_THREAD` protocol for routing several bounded repo
tasks together as a portfolio batch without creating cross-repo confusion,
authority drift, dependency collisions, or ambiguous closeout state.

This protocol is docs/reference only. It does not add portal/app code,
API/DB behavior, runtime behavior, automation, provider/model dispatch,
desktop/browser control, branch/PR automation, production/customer workload
authority, deployment/sync/migration authority, scheduler behavior, live
telemetry, control buttons, remediation controls, or cross-repo mutation.

## Source baseline

The source baseline is the completed Static Toolchain Status / Capability Map
Reference Model v0 in `dev-jai-nexus`.

Settled baseline:

- `dev-jai-nexus` is the Operator Control Plane and cross-repo visibility
  coordinator
- `CONTROL_THREAD` owns cross-repo continuity, prioritization, routing, and
  passalong reconciliation
- repo execution chats own only their explicitly assigned repo-local lane
- existing passalong and repo-routing target contracts are documentary only
- static/reference and planning artifacts do not authorize runtime execution
- live routing, automation, provider/model dispatch, branch/PR automation,
  production/customer workload authority, deployment/sync/migration authority,
  and customer data handling remain off unless separately routed

## Files and artifacts inspected

- `docs/reference/STATIC_TOOLCHAIN_STATUS_CAPABILITY_MAP_REFERENCE_MODEL_V0.md`
- `docs/reference/STATIC_JAI_CONTEXT_VISIBILITY_REVIEW_V0.md`
- `docs/reference/JAI_TOOLCHAIN_REPO_ROLE_MAP_V0.md`
- `docs/reference/JAI_TOOLCHAIN_PACKET_FLOW_V0.md`
- `docs/reference/EDGE_RUNNER_HEALTH_STATUS_CARD_V0.md`
- `docs/reference/EDGE_RUNNER_HEALTH_STATUS_CARD_MOCK_V0.md`
- `docs/plans/STATIC_TOOLCHAIN_STATUS_CAPABILITY_MAP_SURFACE_PLANNING_V0.md`
- `docs/plans/JAI_TOOLCHAIN_ACTIVE_CAPABILITY_MAP_V0.md`
- `docs/plans/JAI_TOOLCHAIN_WORKFLOW_SPINE_V0.md`
- `docs/plans/WORKFLOW_PACKET_STRICT_SCHEMA_STATIC_VISIBILITY_PLANNING_V0.md`
- `.nexus/canon/repo-routing-target-schema.yaml`
- `.nexus/canon/passalong-schema.yaml`
- `.nexus/canon/toolchain-integration-readiness-matrix-v0.md`
- `.nexus/canon/toolchain-runtime-integration-gate-tracker-v0.md`
- `.nexus/canon/jai-toolchain-product-foundry-routing.md`
- `.nexus/canon/**`
- `README.md`
- `portal/src/app/page.tsx`
- `portal/src/lib/controlPlane/authorityPosture.ts`
- `portal/src/lib/controlPlane/rootOperatorOverview.ts`
- `portal/src/lib/controlPlane/repoSurfaceModel.ts`
- `portal/src/lib/controlPlane/types.ts`
- `portal/src/lib/controlPlane/**`
- `package.json`
- `portal/package.json`

## Protocol purpose

The protocol gives `CONTROL_THREAD` one static reference for:

- defining a bounded multi-repo batch before repo chats are opened
- keeping each repo lane independent enough to execute in parallel
- preventing repo-local chats from inventing cross-repo authority
- making dependency status explicit before execution begins
- preserving one branch, one scope, and one passalong expectation per lane
- reconciling lane output after merge, pause, hold, or block
- closing the batch with a clear state rather than scattered repo-local
  closeouts

This protocol is a routing and reconciliation reference. It is not a scheduler,
automation plan, dispatch engine, PR workflow, validation runner, or live state
model.

## Core terms

### Portfolio batch

A portfolio batch is a bounded set of repo lanes routed by `CONTROL_THREAD`
together.

Required interpretation:

- may contain multiple repos
- must define all lane scopes before routing
- must not require active lanes to depend on unmerged output from other active
  lanes
- must include a batch closeout step after all lanes are settled, paused, held,
  or blocked
- may use settled canon/reference artifacts as baseline
- may use passalongs as routing context, but not as a substitute for settled
  canon where canon is required

Non-authority warning: a portfolio batch does not authorize automation,
branch/PR automation, runtime execution, cross-repo mutation, or autonomous
approval.

### Lane

A lane is a single bounded repo task within a portfolio batch.

Required interpretation:

- has one repo
- has one branch
- has one scope
- has one expected passalong
- should not mutate another repo
- should not silently expand authority
- should return files changed, validation, authority posture, residual risks,
  PR description, and passalong

Non-authority warning: a lane assignment is not permission to widen scope,
touch another repo, add runtime behavior, or approve follow-on work.

### Routing target

A routing target is the repo and lane owner receiving a task.

Required interpretation:

- includes expected repo and branch
- includes expected artifact or artifacts
- includes validation expectations
- includes authority boundary
- includes required return shape
- is compatible with `.nexus/canon/repo-routing-target-schema.yaml`

Non-authority warning: a routing target does not itself authorize branch
creation, PR creation, merge, execution widening, API/DB mutation, runtime
dispatch, automation, or cross-repo mutation.

## Portfolio batch definition

A batch definition should include:

- `batch_id`
- `objective`
- `source_baseline`
- `routing_date`
- `control_thread_owner`
- `lanes`
- `dependency_summary`
- `authority_boundary`
- `non_authorizations`
- `validation_policy`
- `batch_closeout_expected`
- `recommended_next_batch`

Interpretation notes:

- `batch_id` should be stable enough to cite in passalongs.
- `source_baseline` should cite settled canon, reference, plans, or prior
  passalong context.
- `lanes` should be independent unless a lane is explicitly held for a later
  batch.
- `validation_policy` should state repo-local expectations and avoid adding
  cross-repo automation.
- `batch_closeout_expected` should be true for every batch.

## Required lane fields

### `lane_id`

- Purpose: gives the lane a stable identifier inside the batch.
- Expected value or shape: short unique string such as
  `batch-001-dev-static-status-reference`.
- Required: yes.
- Interpretation notes: should be unique within the batch and cited in
  passalong return.
- Non-authority warning: an identifier is not a route approval beyond the
  lane's explicit scope.

### `repo`

- Purpose: names the single repo assigned to the lane.
- Expected value or shape: repo name such as `dev-jai-nexus`,
  `audit-nexus`, `orchestrator-nexus`, `jai-vscode`, or `jai-pilot`.
- Required: yes.
- Interpretation notes: the repo-local chat may mutate only that repo and only
  within the routed scope.
- Non-authority warning: listing related repos in scope or dependencies does
  not authorize mutating them.

### `scope`

- Purpose: states the bounded task the lane owns.
- Expected value or shape: one concise task statement plus explicit allowed and
  blocked surfaces when routed.
- Required: yes.
- Interpretation notes: scope should be narrow enough for a repo chat to
  finish and return a passalong.
- Non-authority warning: scope text must not imply runtime/API/automation or
  customer authority unless separately routed.

### `mode`

- Purpose: states execution posture.
- Expected value or shape: workflow role and posture, for example
  `REPO_EXECUTION / docs-reference only`.
- Required: yes.
- Interpretation notes: should align to the role map and authority posture.
- Non-authority warning: mode is not permission to change workflow role,
  activate tools, or add automation.

### `branch`

- Purpose: gives the expected working branch for the repo lane.
- Expected value or shape: exact branch name or branch naming instruction.
- Required: yes.
- Interpretation notes: one bounded branch per repo per batch is recommended.
- Non-authority warning: branch naming does not authorize branch/PR automation
  or mutation outside the named repo.

### `artifact`

- Purpose: names the expected output artifact or artifacts.
- Expected value or shape: repo-local file path, PR description, docs artifact,
  canon artifact, or explicit passalong package.
- Required: yes.
- Interpretation notes: should be concrete enough to validate closeout.
- Non-authority warning: an artifact path is not permission to add adjacent
  runtime files or app code.

### `depends_on`

- Purpose: states dependencies needed before or during the lane.
- Expected value or shape: list of dependency records using the dependency
  statuses in this protocol.
- Required: yes. Use an empty list only when there are no dependencies.
- Interpretation notes: active lanes should not depend on output from another
  active unmerged lane.
- Non-authority warning: dependency references do not let a repo-local chat
  reconcile cross-repo state by itself.

### `blocks`

- Purpose: states what this lane blocks, if anything.
- Expected value or shape: list of lane IDs, future route labels, or `none`.
- Required: yes.
- Interpretation notes: should distinguish true blockers from informational
  sequencing.
- Non-authority warning: claiming to block a future route does not grant
  approval authority over that route.

### `status`

- Purpose: records the lane's current routing state.
- Expected value or shape: one value from the lane status model.
- Required: yes.
- Interpretation notes: should be updated by `CONTROL_THREAD` during routing
  and reconciliation.
- Non-authority warning: status values are documentary and must not drive live
  automation.

### `authority_boundary`

- Purpose: states the explicit lane authority and no-touch constraints.
- Expected value or shape: short list of allowed actions and denied actions.
- Required: yes.
- Interpretation notes: should be repeated in the repo-local prompt and
  returned in passalong.
- Non-authority warning: omitted denials are not implied approvals.

### `validation_expected`

- Purpose: states expected validation before lane return.
- Expected value or shape: command list, static review checklist, or
  `not_run` rationale for docs-only lanes.
- Required: yes.
- Interpretation notes: validation should be repo-local unless the batch
  explicitly routes a cross-repo validation lane.
- Non-authority warning: validation expectations do not authorize CI wiring,
  runtime validation, provider/model calls, or automation.

### `passalong_required`

- Purpose: states whether the lane must return a passalong and what shape it
  must take.
- Expected value or shape: `true` plus required return fields, or a reference
  to the passalong requirements below.
- Required: yes.
- Interpretation notes: every lane in a portfolio batch must return a
  passalong, including paused, held, and blocked lanes.
- Non-authority warning: passalong is documentary only and does not execute or
  approve follow-on work.

## Lane status model

### `ready_to_route`

- Meaning: lane is fully bounded and can be sent to a repo chat.
- Who sets it: `CONTROL_THREAD`.
- Entered when: repo, branch, scope, artifact, authority boundary,
  dependencies, validation, and passalong requirements are clear.
- Exits when: the lane is routed, held, paused, or cancelled from the batch.
- What `CONTROL_THREAD` should do next: route the lane to the repo chat or hold
  it if dependency review changes.

### `in_flight`

- Meaning: lane is active in a repo chat and not yet merged or closed.
- Who sets it: `CONTROL_THREAD` when routed; repo chat may report that it
  remains in flight.
- Entered when: the repo-local task starts.
- Exits when: the lane is blocked, paused, held, merged pending passalong, or
  settled.
- What `CONTROL_THREAD` should do next: wait for repo-local closeout without
  expanding scope or reconciling unfinished output as canon.

### `blocked`

- Meaning: lane cannot proceed because required input, dependency, validation,
  authority, or environment is missing.
- Who sets it: repo chat reports the blocker; `CONTROL_THREAD` records it.
- Entered when: progress cannot continue within the routed boundary.
- Exits when: unblock condition is met and `CONTROL_THREAD` reroutes, pauses,
  holds, or closes the lane.
- What `CONTROL_THREAD` should do next: record the unblock condition and decide
  whether to reroute, defer, or split into a later batch.

### `merged_pending_passalong`

- Meaning: branch was squashed, merged, or deleted, but closeout passalong has
  not yet been reconciled into `CONTROL_THREAD`.
- Who sets it: `CONTROL_THREAD` after observing or receiving merge/close
  evidence without complete passalong reconciliation.
- Entered when: repo-local merge/closeout happened before batch reconciliation.
- Exits when: required passalong is collected and reconciled, or when missing
  passalong becomes a held or blocked closeout issue.
- What `CONTROL_THREAD` should do next: collect files changed, validation,
  authority posture, residual risks, PR description, and passalong before
  marking settled.

### `settled`

- Meaning: lane is merged or otherwise closed and passalong has been
  reconciled into `CONTROL_THREAD`.
- Who sets it: `CONTROL_THREAD`.
- Entered when: closeout state, validation, files changed, authority posture,
  residual risks, PR description, and passalong have been reconciled.
- Exits when: normally does not exit inside the batch; later work should be a
  new lane or new batch.
- What `CONTROL_THREAD` should do next: include the lane in batch closeout and
  use settled output as baseline only where appropriate.

### `paused`

- Meaning: lane is intentionally stopped without being blocked.
- Who sets it: `CONTROL_THREAD`, or repo chat recommends it and
  `CONTROL_THREAD` records it.
- Entered when: continuing is not useful now, but no missing input prevents
  future resumption.
- Exits when: `CONTROL_THREAD` explicitly reroutes or closes the lane in a
  later decision.
- What `CONTROL_THREAD` should do next: record pause rationale and take no
  action until rerouted.

### `held`

- Meaning: lane is waiting for `CONTROL_THREAD` decision, human approval, or
  cross-repo reconciliation.
- Who sets it: `CONTROL_THREAD`, or repo chat requests a hold and
  `CONTROL_THREAD` records it.
- Entered when: proceeding would require authority, priority, dependency, or
  reconciliation decisions outside the repo-local lane.
- Exits when: explicit reroute, approval, reconciliation, pause, or block
  decision is recorded.
- What `CONTROL_THREAD` should do next: decide, approve, reconcile, reroute, or
  split into a later batch. Repo chat should not continue without explicit
  reroute.

## Portfolio routing rules

- One bounded branch per repo per batch.
- No active lane depends on unmerged output from another active lane.
- No repo mutates another repo.
- Every lane returns a passalong.
- Every lane must state files changed, validation, authority posture, residual
  risks, PR description, and passalong.
- `CONTROL_THREAD` reconciles after batch completion.
- `CONTROL_THREAD` owns cross-repo prioritization and dependency
  reconciliation.
- Repo chats own only their assigned lane.
- Runtime/API/automation/provider/desktop/production authority remains off
  unless separately routed.
- Branch/PR automation remains off unless separately routed.
- Live execution remains off unless separately routed.
- Customer data handling remains off unless separately routed.
- Repo-local execution may cite settled artifacts as baseline, but may not
  promote active lane output to canon by itself.
- Repo-local execution must report any authority ambiguity as held or blocked
  rather than widening scope.

## Dependency status model

### Settled dependency

Meaning:

- dependency is already merged, closed, canonized, or recorded as settled
  baseline before the batch starts.

Allowed use:

- may be referenced as baseline.

Control rule:

- cite the settled artifact or PR/passalong source.

### Informational dependency

Meaning:

- dependency gives context but is not required to complete the lane.

Allowed use:

- may be cited in routing context or passalong.

Control rule:

- must not be treated as a gate or blocker.

### Active dependency

Meaning:

- dependency is being worked in another active lane.

Allowed use:

- may be tracked for awareness only.

Control rule:

- an active lane should not require output from another active unmerged lane.
  If output is required, hold or split the dependent work into a later batch.

### Blocking dependency

Meaning:

- lane cannot proceed until dependency output, input, validation, authority, or
  environment is available.

Allowed use:

- set lane status to `blocked` or `held` depending on whether the missing item
  is an unblock condition or a decision/reconciliation issue.

Control rule:

- `CONTROL_THREAD` records the unblock condition before rerouting.

### Deferred dependency

Meaning:

- dependency is real but intentionally left for a later route or batch.

Allowed use:

- lane can proceed only if deferred dependency is not required for current
  closeout.

Control rule:

- include it in residual risks or recommended next routing.

### Non-dependency

Meaning:

- related context that does not affect lane execution or closeout.

Allowed use:

- may be listed as context but should not clutter `depends_on`.

Control rule:

- do not convert adjacency into dependency.

## Dependency rules

- Active lanes should not depend on output from another active unmerged lane.
- If a lane needs another lane's output, it should be held or split into a
  later batch.
- Settled artifacts may be referenced as baseline.
- Passalongs may be used for routing context, but not as a substitute for
  merged settled canon where canon is required.
- Cross-repo dependency changes must be reconciled by `CONTROL_THREAD`, not by
  repo-local execution chats.
- Informational dependencies must not be escalated into blockers without a
  concrete missing input, validation, authority, or artifact.
- Blocking dependencies must state the unblock condition.
- Deferred dependencies must appear in residual risks or next routing.

## Batch lifecycle

1. Batch planning
2. Lane definition
3. Dependency check
4. Route lanes
5. Repo execution
6. PR review/merge per lane
7. Lane passalong collection
8. `CONTROL_THREAD` reconciliation
9. Batch closeout
10. Next batch decision

Lifecycle notes:

- batch planning defines objective, source baseline, authority boundary, and
  non-authorizations
- lane definition creates one bounded lane record per repo task
- dependency check prevents active unmerged dependency collisions
- route lanes only after each lane is `ready_to_route`
- repo execution remains repo-local and scope-bound
- PR review/merge remains per lane and does not create batch-level merge
  automation
- passalong collection is required for settled, paused, held, and blocked
  lanes
- reconciliation is where `CONTROL_THREAD` updates batch state and next
  routing
- batch closeout must happen before launching a dependent follow-on batch

## Batch closeout requirements

Batch closeout should include:

- lanes routed
- lanes settled
- lanes paused
- lanes held
- lanes blocked
- changed canon/reference artifacts
- dependency updates
- authority posture preserved
- recommended next batch
- residual risks
- open questions

Closeout interpretation:

- settled lanes may become baseline for later routing only after passalong has
  been reconciled
- paused lanes require no action until rerouted
- held lanes require a `CONTROL_THREAD` or human decision before continuation
- blocked lanes require an unblock condition before reroute
- batch closeout should explicitly say whether the next batch may start now or
  should wait for reconciliation

## Passalong requirements

Every lane passalong should include:

- source repo
- target `CONTROL_THREAD`
- scope
- baseline before lane
- files changed
- settled outputs
- validation results
- authority boundary
- non-authorizations
- residual risks
- recommended next route
- whether lane is settled, paused, held, or blocked

Recommended additional fields:

- lane ID
- branch
- PR description
- dependency updates
- open questions
- unblock conditions, when blocked
- pause or hold rationale, when paused or held

Passalong interpretation:

- passalong is documentary only
- passalong does not replace canon, decision files, or ratification artifacts
- passalong does not authorize repo mutation, branch creation, PR creation,
  runtime execution, automation, or follow-on approval
- passalong should preserve deferred ideas rather than silently dropping them

## Merge and passalong reconciliation

`CONTROL_THREAD` should reconcile each merged or closed lane by checking:

- branch or PR closeout state
- files changed
- validation results and any skipped validation rationale
- authority boundary preserved
- non-authorizations preserved
- residual risks
- recommended next route
- passalong completeness

If a branch is merged but passalong is missing:

- set lane status to `merged_pending_passalong`
- do not mark lane `settled`
- request or reconstruct the missing closeout package from available repo-local
  evidence
- if passalong cannot be completed, set lane `held` or `blocked` with the
  reason

If a passalong recommends cross-repo follow-up:

- `CONTROL_THREAD` records it as routing context
- repo-local chat does not route or approve the next repo by itself
- follow-up work becomes a new lane or a later batch decision

## Paused, held, and blocked semantics

### Paused

Paused means:

- intentionally stopped
- not a failure
- can be resumed later by `CONTROL_THREAD`
- no action until rerouted

Paused lane passalong should state:

- why it was paused
- what remains useful
- what would make resumption worthwhile

### Held

Held means:

- waiting on `CONTROL_THREAD` decision, human approval, or reconciliation
- should not continue without explicit reroute
- may be moved into a later batch after decision

Held lane passalong should state:

- exact decision needed
- who owns the decision
- what would happen if the lane were resumed

### Blocked

Blocked means:

- cannot proceed because input, dependency, validation, authority, or
  environment is missing
- requires an unblock condition before reroute
- may be split into later work if the blocker is structural

Blocked lane passalong should state:

- blocker
- unblock condition
- affected artifact or validation
- recommended next route or pause

## Validation expectations

Portfolio routing validation should be repo-local and proportionate to the
lane.

Required expectations:

- docs-only lanes should at minimum run diff hygiene checks when available
- repo-local docs/static validation may run when normal repo practice clearly
  supports it
- portal/app typecheck or build should not run for docs-only lanes unless
  portal/app/code files are touched
- lint should run only when normal repo practice for docs-only PRs clearly
  requires it
- failed validation from unrelated pre-existing issues should be reported
  without expanding scope

Validation must distinguish:

- `pass`
- `fail`
- `not_run`
- `not_applicable`
- `blocked`

Validation does not authorize CI wiring, runtime validation, schema
enforcement, automation, live telemetry, provider/model calls, or cross-repo
checks.

## Authority boundary

This protocol authorizes only static docs/reference routing guidance inside
`dev-jai-nexus`.

`CONTROL_THREAD` authority preserved:

- define portfolio batch scope
- define lane scope
- route bounded repo-local tasks
- reconcile passalongs
- decide next batch routing
- preserve cross-repo dependency state

Repo-local chat authority preserved:

- execute only the assigned lane
- mutate only the assigned repo and allowed files/surfaces
- report blockers, holds, pauses, validation, risks, and passalong
- avoid cross-repo mutation and authority expansion

This protocol does not grant implementation, runtime, automation, dispatch,
approval, merge, or customer authority.

## Non-authorizations

This protocol does not authorize:

- portal/app code
- API/DB behavior
- runtime behavior
- live routing
- automation
- scheduler behavior
- provider/model dispatch
- desktop/browser control
- branch/PR automation
- production/customer workload authority
- deployment/sync/migration authority
- customer data handling
- credential/session/token capture
- live telemetry
- control buttons
- remediation controls
- cross-repo mutation
- autonomous execution
- autonomous approval
- autonomous merge

## Example portfolio batch

This example is illustrative only. It does not route actual work.

```yaml
batch_id: portfolio-batch-example-000
objective: illustrate independent multi-repo routing lanes
source_baseline:
  - docs/reference/STATIC_TOOLCHAIN_STATUS_CAPABILITY_MAP_REFERENCE_MODEL_V0.md
authority_boundary:
  - docs/reference and planning only
  - no runtime/API/automation/provider/desktop/production authority
lanes:
  - lane_id: example-dev-static-status-capability-reference
    repo: dev-jai-nexus
    scope: static status/capability reference model follow-up summary
    mode: REPO_EXECUTION / docs-reference only
    branch: docs/example-dev-static-status-capability-reference
    artifact: docs/reference example artifact
    depends_on:
      - type: settled_dependency
        artifact: docs/reference/STATIC_TOOLCHAIN_STATUS_CAPABILITY_MAP_REFERENCE_MODEL_V0.md
    blocks: none
    status: ready_to_route
    authority_boundary: no portal/app code; no runtime behavior
    validation_expected: git diff --check
    passalong_required: true

  - lane_id: example-audit-packet-schema-privacy-review
    repo: audit-nexus
    scope: packet/schema authority privacy review planning
    mode: REPO_EXECUTION / docs-reference only
    branch: docs/example-packet-schema-privacy-review
    artifact: audit/privacy review reference
    depends_on:
      - type: informational_dependency
        artifact: docs/reference/JAI_TOOLCHAIN_PACKET_FLOW_V0.md
    blocks: future client handoff implementation planning
    status: ready_to_route
    authority_boundary: review only; no implementation approval
    validation_expected: repo-local docs/static validation if available
    passalong_required: true

  - lane_id: example-orchestrator-evidence-index-latest-json-planning
    repo: orchestrator-nexus
    scope: evidence index/latest.json planning
    mode: REPO_EXECUTION / docs-reference only
    branch: docs/example-evidence-index-latest-json-planning
    artifact: evidence index/latest.json planning reference
    depends_on:
      - type: settled_dependency
        artifact: .nexus/canon/edge-runner-readiness-matrix-v0.md
    blocks: none
    status: ready_to_route
    authority_boundary: no live runner or scheduler changes
    validation_expected: repo-local docs/static validation if available
    passalong_required: true

  - lane_id: example-vscode-context-handoff-boundary
    repo: jai-vscode
    scope: context handoff boundary planning
    mode: REPO_EXECUTION / docs-reference only
    branch: docs/example-context-handoff-boundary
    artifact: context handoff boundary planning reference
    depends_on:
      - type: informational_dependency
        artifact: .nexus/canon/toolchain-integration-readiness-matrix-v0.md
    blocks: hidden file capture or agent-control implementation
    status: ready_to_route
    authority_boundary: no hidden file capture; no autonomous repo mutation
    validation_expected: repo-local docs/static validation if available
    passalong_required: true

  - lane_id: example-jai-pilot-explicit-handoff-ux-boundary
    repo: jai-pilot
    scope: explicit handoff UX boundary planning
    mode: REPO_EXECUTION / docs-reference only
    branch: docs/example-explicit-handoff-ux-boundary
    artifact: explicit handoff UX boundary planning reference
    depends_on:
      - type: informational_dependency
        artifact: .nexus/canon/toolchain-runtime-integration-gate-tracker-v0.md
    blocks: browser/desktop implementation routing
    status: ready_to_route
    authority_boundary: no hidden scraping; no credential/session/token capture
    validation_expected: repo-local docs/static validation if available
    passalong_required: true
```

Example interpretation:

- all five lanes are independent enough to route together
- none requires unmerged output from another active lane
- each lane has one repo, one branch, one scope, and one passalong
- future implementation routes remain blocked unless separately routed
- `CONTROL_THREAD` still owns final reconciliation and next batch decision

## Residual risks

- a portfolio batch could be mistaken for automation or scheduler behavior
- a lane could silently widen scope if authority boundaries are not repeated in
  repo-local prompts
- passalong context could be overread as settled canon
- active dependencies could be misclassified as informational dependencies
- merged lanes could be treated as settled before passalong reconciliation
- repo-local chats could recommend cross-repo follow-up in a way that sounds
  like approval
- branch names could be mistaken for branch/PR automation authority
- validation expectations could be mistaken for CI/runtime validation authority
- manual batch state can drift if `CONTROL_THREAD` does not reconcile promptly

## Recommended next routing

Use this protocol before launching the next multi-repo portfolio batch.

Next possible `CONTROL_THREAD` action:

- define Portfolio Batch 001 with independent lanes only
- or pause and keep using sequential routing until a concrete batch is ready

Recommended Portfolio Batch 001 constraint:

- include only lanes with settled or informational dependencies
- hold any lane that requires active unmerged output from another lane
- require every lane to return passalong before batch closeout
- keep runtime/API/automation/provider/desktop/production/customer authority
  off unless separately routed
