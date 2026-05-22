# Edge Runner Health Status Card v0

## Purpose

Define the reference shape for a static/read-only Edge Runner health status
card in the JAI NEXUS Operator Control Plane.

This card is a visibility artifact only. It displays manually supplied,
normalized health snapshot evidence. It is not live telemetry, not a control
surface, and not execution authority.

## Status card fields

The status card should include:

- `target_host`
- `source_repo_tool`
- `snapshot_timestamp`
- `overall_classification`
- `control_plane_status`
- `service_count_healthy`
- `service_count_total`
- `service_statuses`
- `exit_code`
- `evidence_source_reference`
- `routing_recommendation`
- `freshness_state`
- `next_recommended_action`
- `authority_boundary`

## Field definitions

### `target_host`

The observed Edge Runner host named in the submitted evidence.

Example:

- `jai-nexus-pi4`

### `source_repo_tool`

The source repo and tool that produced the raw observation.

Example:

- `jai-edge / scripts/edge_health_snapshot.py`

### `snapshot_timestamp`

The timestamp attached to the snapshot evidence. This is the evidence capture
time, not an assertion of current live state.

If absent, the card should downgrade to `insufficient_evidence` or
`review_needed`.

### `overall_classification`

The normalized `orchestrator-nexus` evidence classification.

Supported visibility set for this seam:

- `edge_runner_healthy`
- `edge_runner_degraded`
- `edge_runner_unreachable`
- `edge_runner_partial_health_failure`
- `evidence_command_failed`
- `evidence_format_invalid`
- `blocked_until_manual_review`
- `blocked_until_control_thread_routing`

### `control_plane_status`

The `CONTROL_THREAD` interpretation shown to the operator.

Required mapping:

| Evidence classification | Control-plane status |
| --- | --- |
| `edge_runner_healthy` | `status_ok` |
| `edge_runner_partial_health_failure` | `targeted_service_review` |
| `edge_runner_unreachable` | `local_connectivity_review` |
| `evidence_format_invalid` | `evidence_normalization_review` |
| `evidence_command_failed` | `operator_machine_review` |
| `blocked_until_manual_review` | `hold` |
| `blocked_until_control_thread_routing` | `control_thread_decision_required` |

Additional display-state vocabulary that may apply alongside the mapped status:

- `degraded`
- `blocked`
- `review_needed`
- `stale`
- `insufficient_evidence`

### `service_count_healthy`

The number of observed services reported healthy in the submitted snapshot.

### `service_count_total`

The total number of observed services in the submitted snapshot.

### `service_statuses`

The service-by-service breakdown from normalized evidence.

Minimum per-service shape:

- `service_name`
- `http_status`
- `reported_health`
- `status_note`

Example services for the first recorded live run:

- `memory`
- `relay`
- `ingest-api`
- `writer-stub`

### `exit_code`

The source command exit code recorded in evidence.

The first recorded live run source baseline used exit code `0`, but the card
must treat exit code as evidence content rather than as a universal success
assumption.

### `evidence_source_reference`

The evidence provenance reference shown to the operator.

This may include:

- source repo/tool reference
- normalized evidence record reference
- manual intake record reference
- canon or PR reference for the normalization path

### `routing_recommendation`

The normalized routing recommendation vocabulary supplied through
`orchestrator-nexus`.

Examples:

- `pass_control_thread_status_ok`
- `pass_control_thread_targeted_service_review`
- `pass_control_thread_local_connectivity_review`
- `pass_control_thread_evidence_normalization_review`
- `pass_control_thread_operator_machine_review`

### `freshness_state`

The control-plane freshness interpretation.

Allowed values:

- `fresh`
- `stale`
- `timestamp_missing`
- `insufficient_evidence`

Freshness must stay descriptive only. The card must not auto-refresh, poll, or
infer current live state from old evidence.

### `next_recommended_action`

The explicit manual next step shown to the operator.

Examples:

- `continue normal monitoring and wait for the next human-run snapshot`
- `review failed services only; no automated remediation`
- `perform local connectivity review outside the control plane`
- `review normalization and submitted evidence shape`
- `review operator machine conditions; no automatic retry`
- `hold until CONTROL_THREAD decision`

### `authority_boundary`

The card must show a compact explicit/manual authority boundary.

Minimum required meaning:

- manually supplied evidence only
- no live endpoint calls
- no polling
- no auto-refresh
- no scheduler or automation behavior
- no restart/remediation controls
- no runtime mutation

## Status interpretation rules

### `status_ok`

Use when:

- classification is `edge_runner_healthy`
- evidence is structurally usable
- timestamp is present and fresh enough for operator context

### `degraded`

Use when:

- evidence is usable
- some reduced-health condition is present without full evidence failure

### `blocked`

Use when:

- evidence is held for manual review or control-thread routing

### `review_needed`

Use when:

- evidence exists but requires interpretation or correction before trust

### `stale`

Use when:

- timestamp exists but is too old to imply current state

### `insufficient_evidence`

Use when:

- timestamp or other critical fields are missing
- evidence cannot support trustworthy control-plane interpretation

## Recommended card copy posture

The card should use wording like:

- `snapshot captured at`
- `last submitted evidence`
- `manual evidence intake`
- `not live telemetry`
- `no automated action`

The card should avoid wording like:

- `currently healthy`
- `live now`
- `auto-retrying`
- `control available`
- `runtime connected`

## Illustrative card shape

```yaml
target_host: "jai-nexus-pi4"
source_repo_tool: "jai-edge / scripts/edge_health_snapshot.py"
snapshot_timestamp: "2026-05-22T00:00:00Z"
overall_classification: "edge_runner_healthy"
control_plane_status: "status_ok"
service_count_healthy: 4
service_count_total: 4
service_statuses:
  - service_name: "memory"
    http_status: 200
    reported_health: "healthy"
    status_note: "submitted evidence only"
  - service_name: "relay"
    http_status: 200
    reported_health: "healthy"
    status_note: "submitted evidence only"
  - service_name: "ingest-api"
    http_status: 200
    reported_health: "healthy"
    status_note: "submitted evidence only"
  - service_name: "writer-stub"
    http_status: 200
    reported_health: "healthy"
    status_note: "submitted evidence only"
exit_code: 0
evidence_source_reference: "manual intake normalized by orchestrator-nexus"
routing_recommendation: "pass_control_thread_status_ok"
freshness_state: "fresh"
next_recommended_action: "continue normal monitoring and wait for the next human-run snapshot"
authority_boundary: "read-only manually supplied evidence; no polling, no automation, no remediation authority"
```

## Non-authorizations

This reference does not authorize:

- snapshot execution
- endpoint polling
- live telemetry
- scheduler behavior
- automatic retries
- automation controls
- runtime mutation
- cross-repo mutation
- Pi inspection
- deployment, sync, or migration authority
- provider/model calls
- customer data handling
- production/customer workload authority

## Authority boundary

This reference is static control-plane guidance only.

It does not:

- claim live runtime state
- create a control button or operator action surface
- bypass `orchestrator-nexus` normalization ownership
- bypass `CONTROL_THREAD` decision posture
