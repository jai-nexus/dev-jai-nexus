# Edge Runner Health Snapshot Control Plane Visibility Plan v0

## Objective

Define how `dev-jai-nexus` / `CONTROL_THREAD` should represent Edge Runner
health snapshot evidence from `jai-edge` and `orchestrator-nexus` as a visible
operator status signal and routing primitive inside the JAI NEXUS Operator
Control Plane.

This plan is planning-only and visibility-only. It does not authorize
execution, automation, runtime mutation, polling, or any live-control behavior.

## Current cross-repo baseline

- `jai-edge` has completed the validation-to-usefulness arc for the read-only
  operator health snapshot utility
- `jai-edge` source utility: `scripts/edge_health_snapshot.py`
- first recorded live run against `jai-nexus-pi4` passed with `memory`,
  `relay`, `ingest-api`, and `writer-stub` all returning HTTP `200` and
  `healthy`
- `jai-edge` migration remains blocked
- `jai-edge` does not have deployment, sync, live runtime mutation, runtime
  data import, or production/customer workload authority
- `orchestrator-nexus` PR `#16` completed Edge Runner Health Snapshot
  Ingestion Plan v0
- `orchestrator-nexus` PR `#17` completed Edge Runner Health Snapshot Manual
  Intake v0
- `orchestrator-nexus` now owns manual intake, evidence normalization,
  evidence record shape, classification vocabulary, example normalized
  evidence, and routing recommendation vocabulary
- `dev-jai-nexus` owns control-plane visibility, routing interpretation,
  operator posture, and later implementation gating

## Source evidence chain

The source evidence chain for this visibility seam is:

1. `jai-edge` human-run read-only health snapshot utility produces raw
   snapshot output.
2. `orchestrator-nexus` manually intakes that output and normalizes it into an
   Edge Runner evidence record.
3. `dev-jai-nexus` / `CONTROL_THREAD` interprets the normalized evidence as a
   visible operator status card and routing primitive.

`dev-jai-nexus` should treat the normalized evidence record as the immediate
control-plane input. `jai-edge` remains the observational source, and
`orchestrator-nexus` remains the normalization layer.

## Control-plane display/status model

The control plane should show Edge Runner health snapshot evidence as a static,
operator-facing status card rather than as live telemetry.

The display model should:

- identify the target host and source toolchain path
- show snapshot timestamp when present
- show overall classification and control-plane summary state
- summarize healthy service count versus total observed services
- list service-level statuses from submitted evidence
- show exit code and evidence reference
- show routing recommendation and next recommended action
- show freshness/staleness state explicitly
- show an explicit authority-boundary note

The display model must not:

- imply the control plane is polling live endpoints
- imply the control plane is connected to the Pi runtime
- imply the control plane can restart, remediate, retry, or inspect services
- imply old evidence is current live state

## Minimum status summary shape

Minimum status summary shape for `CONTROL_THREAD` visibility:

- `target_host`
- `source_repo_tool`
- `snapshot_timestamp`
- `overall_classification`
- `control_plane_status`
- `service_counts`
- `service_statuses`
- `exit_code`
- `evidence_source_reference`
- `routing_recommendation`
- `freshness_state`
- `next_recommended_action`
- `authority_boundary`

The supporting reference artifact in
`docs/reference/EDGE_RUNNER_HEALTH_STATUS_CARD_V0.md` defines the card more
concretely.

## Classification mapping

`orchestrator-nexus` classification should map into `CONTROL_THREAD`
control-plane statuses as follows:

| Evidence classification | Control-plane status |
| --- | --- |
| `edge_runner_healthy` | `status_ok` |
| `edge_runner_partial_health_failure` | `targeted_service_review` |
| `edge_runner_unreachable` | `local_connectivity_review` |
| `evidence_format_invalid` | `evidence_normalization_review` |
| `evidence_command_failed` | `operator_machine_review` |
| `blocked_until_manual_review` | `hold` |
| `blocked_until_control_thread_routing` | `control_thread_decision_required` |

`edge_runner_degraded` should remain a source-side evidence classification that
the control plane may show as degraded posture when present, but the required
settled routing map for this plan remains the table above.

## Control-plane status definitions

### `status_ok`

`status_ok` means:

- evidence is structurally usable
- timestamp is present and fresh enough for operator context
- classification is `edge_runner_healthy`
- observed service set is fully healthy for the submitted snapshot
- no further action is implied beyond continued human-run monitoring

### `degraded`

`degraded` means:

- evidence is usable
- snapshot indicates reduced health confidence without full loss of evidence
- one or more services are failed, unhealthy, or partial, or the source
  classification explicitly indicates degraded posture
- routing should remain review-oriented rather than corrective

### `blocked`

`blocked` means:

- evidence cannot advance beyond a hold posture without explicit human review
- classification is `blocked_until_manual_review` or
  `blocked_until_control_thread_routing`
- the control plane should preserve visibility and show no autonomous next step

### `review_needed`

`review_needed` means:

- evidence exists but requires interpretation or correction before status can
  be relied upon
- malformed output, missing required fields, missing service detail, or source
  command failure can all produce `review_needed`

### `stale`

`stale` means:

- the evidence remains visible as historical/operator context
- the timestamp is older than the freshness window chosen by later
  implementation
- the control plane must downgrade confidence and request refresh rather than
  imply current live state

This plan intentionally leaves the exact freshness threshold as a later
implementation constant so the wording can stay stable without inventing a
runtime SLA.

### `insufficient_evidence`

`insufficient_evidence` means:

- the submitted material cannot support a trustworthy status interpretation
- timestamp is missing, evidence is incomplete, or normalization-critical fields
  are absent
- the control plane may show the card only with explicit uncertainty language

## Routing rules

### Healthy snapshot

If the normalized evidence shows a healthy snapshot:

- show control-plane status `status_ok`
- preserve visible source classification `edge_runner_healthy`
- do not trigger automated action
- next action: continue normal monitoring and wait for the next human-run
  snapshot

### Partial service failure

If the normalized evidence shows partial service failure:

- show control-plane status `targeted_service_review`
- identify failed or unhealthy services by name
- preserve review-needed posture if evidence remains structurally usable
- do not restart services
- do not trigger remediation automation
- next action: human-targeted service review only

### Unreachable target

If the normalized evidence shows an unreachable target:

- show control-plane status `local_connectivity_review`
- preserve visible source classification `edge_runner_unreachable`
- do not perform SSH, ping sweep, Docker inspection, or live endpoint calls
- next action: local connectivity review by a human operator outside this plan

### Malformed output

If the normalized evidence is malformed:

- show control-plane status `evidence_normalization_review`
- preserve visible source classification `evidence_format_invalid`
- make no inference beyond submitted evidence
- next action: review normalization/input fidelity only

### Command failure

If the snapshot command failed on the operator machine:

- show control-plane status `operator_machine_review`
- preserve visible source classification `evidence_command_failed`
- do not retry automatically
- next action: operator machine review only

### Blocked/manual review

If the normalized evidence is blocked pending review or routing:

- show control-plane status `hold` or
  `control_thread_decision_required` as applicable
- preserve the blocked posture visibly
- do not infer health state beyond the submitted evidence
- next action: hold until explicit `CONTROL_THREAD` decision

## Staleness/freshness handling

Freshness handling for this seam should follow these rules:

- fresh evidence means the timestamp is recent enough for operator context
- stale evidence must remain visible but downgraded to `stale` or
  `needs refresh`
- missing timestamp should produce `insufficient_evidence` or
  `review_needed`
- the control plane must not auto-refresh
- the control plane must not call live endpoints
- the control plane must not schedule future checks
- the control plane must not imply live state from old evidence
- freshness wording should explicitly distinguish `snapshot captured at` from
  `current state`

## Ownership boundaries

### `jai-edge`

`jai-edge` owns:

- the read-only utility
- repo-local utility behavior
- the source health snapshot command/reference
- live runtime observation utility

### `orchestrator-nexus`

`orchestrator-nexus` owns:

- manual intake
- normalization
- evidence record shape
- classification vocabulary
- routing recommendation vocabulary

### `dev-jai-nexus` / `CONTROL_THREAD`

`dev-jai-nexus` / `CONTROL_THREAD` owns:

- operator visibility model
- routing interpretation
- status card shape
- decision posture
- future implementation gating

### Pi runtime / `/home/jerryingram/edge`

Pi runtime owns:

- live runtime state only

Pi runtime does not become:

- a governed deployment target
- a mutated target under this plan
- a data source directly inspected by `dev-jai-nexus`

## Explicit non-authorizations

This plan does not authorize:

- planning beyond visibility/routing-only posture
- execution of the `jai-edge` utility
- live endpoint calls
- scheduler behavior
- autonomous execution
- automatic retries
- mutation of `jai-edge`
- mutation of `orchestrator-nexus`
- mutation of the Pi runtime
- inspection of `/home/jerryingram/edge`
- runtime data import
- live env value import
- Docker commands on the Pi
- deployment, sync, or migration authority
- provider/model calls
- customer data handling
- production/customer workload authority
- branch/PR automation
- API/DB behavior
- runtime polling
- live telemetry
- control buttons
- claims of live runtime state

## Residual risks

- evidence may become stale while still appearing operator-visible
- manually supplied output may be malformed or incomplete
- a weakly worded status card could be mistaken for live telemetry
- health snapshot evidence proves endpoint reachability and reported health
  only, not deployment safety
- no remediation authority exists even when problems are visible
- a future UI implementation could accidentally erode the manual-review posture
  if status language is too assertive

## Next routing decision

Recommended next route after this planning artifact merges:

- `dev-jai-nexus` static operator status card mock/reference implementation

That next route should proceed only if the currently settled
`orchestrator-nexus` example coverage is sufficient for the classifications the
control plane needs to display.

If classification coverage proves insufficient, the next route should instead
be:

- `orchestrator-nexus` additional evidence examples for uncovered
  classifications

Current recommendation: route next to `dev-jai-nexus` for static status
card/reference implementation after this plan is merged.

## Authority boundary

This artifact is planning-only and control-plane visibility only.

It does not:

- authorize health snapshot execution
- authorize evidence ingestion automation
- authorize polling or runtime telemetry
- authorize remediation or runtime control
- authorize cross-repo mutation
- authorize deployment or customer-serving behavior
