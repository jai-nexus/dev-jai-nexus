# Edge Runner Health Status Card Mock v0

## Objective

Demonstrate how Edge Runner health snapshot evidence should appear to the
operator in the JAI NEXUS Operator Control Plane while preserving the settled
static, manual-evidence-based, non-live, non-remediating, and routing-oriented
posture.

This artifact is a mock/reference only. It does not implement UI behavior,
runtime behavior, evidence ingestion, polling, remediation, or execution.

## Source baseline

- `docs/plans/EDGE_RUNNER_HEALTH_SNAPSHOT_CONTROL_PLANE_VISIBILITY_PLAN_V0.md`
  defines the settled visibility model
- `docs/reference/EDGE_RUNNER_HEALTH_STATUS_CARD_V0.md` defines the settled
  card field shape and vocabulary
- `jai-edge` remains the source repo for the read-only snapshot utility
- `orchestrator-nexus` remains the owner of manual intake, normalization,
  classification vocabulary, and routing recommendation vocabulary
- `dev-jai-nexus` / `CONTROL_THREAD` remains the owner of visibility,
  routing interpretation, and operator posture only

## Copy posture

Preferred control-plane wording for this card:

- `snapshot captured at`
- `manual evidence intake`
- `freshness/staleness state`
- `last submitted evidence`
- `operator review required`
- `no automated remediation`

Avoid wording that implies live telemetry or control:

- `currently healthy`
- `live status`
- `real-time`
- `auto-refresh`
- `monitoring agent`
- `self-healing`
- `restart service`
- `rerun check`

## Static card field model

The static card should include these fields:

- `target host`
- `source repo/tool`
- `snapshot timestamp`
- `overall classification`
- `display state`
- `service count healthy/total`
- `service statuses`
- `exit code`
- `evidence source/reference`
- `routing recommendation`
- `freshness/staleness state`
- `next recommended action`
- `explicit authority boundary`

## Classification / display / routing mapping

| Evidence classification | Display state | Routing posture |
| --- | --- | --- |
| `edge_runner_healthy` | `status_ok` | `pass_control_thread_status_ok` |
| `edge_runner_partial_health_failure` | `degraded` | `pass_control_thread_targeted_service_review` |
| `edge_runner_unreachable` | `blocked` or `review_needed` | `pass_control_thread_local_connectivity_review` |
| `evidence_format_invalid` | `review_needed` | `pass_control_thread_evidence_normalization_review` |
| `evidence_command_failed` | `review_needed` | `pass_control_thread_operator_machine_review` |
| `blocked_until_manual_review` | `insufficient_evidence` or `hold` | `pass_control_thread_evidence_normalization_review` |
| `blocked_until_control_thread_routing` | `stale` or `control_thread_decision_required` | `hold_for_control_thread_review` |

Additional display-state overlays may apply:

- `stale`
- `insufficient_evidence`

## Next recommended action text by state

| Display state / route | Next recommended action |
| --- | --- |
| `status_ok` | `Continue normal monitoring. Wait for the next human-run snapshot.` |
| `degraded` / `pass_control_thread_targeted_service_review` | `Route targeted service review for the failed service(s). Do not restart or remediate automatically.` |
| `blocked` or `review_needed` / `pass_control_thread_local_connectivity_review` | `Route local connectivity review. Do not SSH, ping sweep, call endpoints, or inspect Docker automatically.` |
| `review_needed` / `pass_control_thread_evidence_normalization_review` | `Route evidence normalization review. Do not infer beyond submitted evidence.` |
| `review_needed` / `pass_control_thread_operator_machine_review` | `Route operator machine review. Do not automatically retry.` |
| `hold` | `Hold until manual review completes.` |
| `control_thread_decision_required` or `hold_for_control_thread_review` | `Hold until CONTROL_THREAD selects the next route.` |
| `stale` | `Show stale evidence as historical/manual evidence only. Request a new human-run snapshot if needed.` |
| `insufficient_evidence` | `Do not render as status_ok. Request corrected evidence or route review.` |

## Healthy-state example

This example uses the settled `jai-nexus-pi4` snapshot shape from the current
cross-repo baseline.

```yaml
card_title: "Edge Runner Health Snapshot"
target_host: "jai-nexus-pi4"
source_repo_tool: "jai-edge / scripts/edge_health_snapshot.py"
snapshot_captured_at: "<snapshot_timestamp_utc>"
overall_classification: "edge_runner_healthy"
display_state: "status_ok"
service_count_healthy: 4
service_count_total: 4
service_statuses:
  - service_name: "memory"
    http_status: 200
    reported_health: "healthy"
    card_copy: "HTTP 200 / healthy"
  - service_name: "relay"
    http_status: 200
    reported_health: "healthy"
    card_copy: "HTTP 200 / healthy"
  - service_name: "ingest-api"
    http_status: 200
    reported_health: "healthy"
    card_copy: "HTTP 200 / healthy"
  - service_name: "writer-stub"
    http_status: 200
    reported_health: "healthy"
    card_copy: "HTTP 200 / healthy"
exit_code: 0
evidence_source_reference: "last submitted evidence / manual evidence intake"
routing_recommendation: "pass_control_thread_status_ok"
freshness_staleness_state: "fresh"
next_recommended_action: "Continue normal monitoring. Wait for the next human-run snapshot."
authority_boundary: "Manual evidence only. No automated action, no live endpoint calls, no polling, no remediation authority."
```

Illustrative pseudo-card:

```text
Edge Runner Health Snapshot

Target host: jai-nexus-pi4
Source repo/tool: jai-edge / scripts/edge_health_snapshot.py
Snapshot captured at: <snapshot_timestamp_utc>
Last submitted evidence: manual evidence intake

Overall classification: edge_runner_healthy
Display state: status_ok
Service count: 4 / 4 healthy
Exit code: 0
Routing recommendation: pass_control_thread_status_ok
Freshness/staleness state: fresh

Service statuses
- memory: HTTP 200 / healthy
- relay: HTTP 200 / healthy
- ingest-api: HTTP 200 / healthy
- writer-stub: HTTP 200 / healthy

Next recommended action
Continue normal monitoring. Wait for the next human-run snapshot.

Authority boundary
Manual evidence only. No automated action. No live endpoint calls. No automated remediation.
```

## Degraded / partial-failure example

```text
Edge Runner Health Snapshot

Target host: jai-nexus-pi4
Source repo/tool: jai-edge / scripts/edge_health_snapshot.py
Snapshot captured at: <snapshot_timestamp_utc>
Last submitted evidence: manual evidence intake

Overall classification: edge_runner_partial_health_failure
Display state: degraded
Service count: 3 / 4 healthy
Exit code: 0
Routing recommendation: pass_control_thread_targeted_service_review
Freshness/staleness state: fresh

Service statuses
- memory: HTTP 200 / healthy
- relay: HTTP 200 / healthy
- ingest-api: HTTP 503 / unhealthy
- writer-stub: HTTP 200 / healthy

Next recommended action
Route targeted service review for the failed service(s). Do not restart or remediate automatically.

Authority boundary
Manual evidence only. No restart controls. No automated remediation. No live endpoint calls.
```

## Unreachable / blocked-review example

```text
Edge Runner Health Snapshot

Target host: jai-nexus-pi4
Source repo/tool: jai-edge / scripts/edge_health_snapshot.py
Snapshot captured at: <snapshot_timestamp_utc>
Last submitted evidence: manual evidence intake

Overall classification: edge_runner_unreachable
Display state: blocked
Service count: 0 / 0 confirmed
Exit code: 0
Routing recommendation: pass_control_thread_local_connectivity_review
Freshness/staleness state: fresh

Service statuses
- no service-level confirmations were available from the submitted snapshot

Next recommended action
Route local connectivity review. Do not SSH, ping sweep, call endpoints, or inspect Docker automatically.

Authority boundary
No live connectivity checks are performed by this surface. No Pi inspection. No runtime control.
```

If the source classification is instead `blocked_until_manual_review`, the card
should show:

- `display state: insufficient_evidence` or `hold`
- `routing recommendation: pass_control_thread_evidence_normalization_review`
- `next recommended action: Do not render as status_ok. Request corrected evidence or route review.`

If the source classification is `blocked_until_control_thread_routing`, the
card should show:

- `display state: stale` or `control_thread_decision_required`
- `routing recommendation: hold_for_control_thread_review`
- `next recommended action: Hold until CONTROL_THREAD selects the next route.`

## Malformed evidence example

```text
Edge Runner Health Snapshot

Target host: jai-nexus-pi4
Source repo/tool: jai-edge / scripts/edge_health_snapshot.py
Snapshot captured at: <snapshot_timestamp_utc>
Last submitted evidence: manual evidence intake

Overall classification: evidence_format_invalid
Display state: review_needed
Service count: not trustworthy from submitted evidence
Exit code: unknown from malformed evidence
Routing recommendation: pass_control_thread_evidence_normalization_review
Freshness/staleness state: review_needed

Service statuses
- submitted evidence could not be normalized reliably

Next recommended action
Route evidence normalization review. Do not infer beyond submitted evidence.

Authority boundary
Malformed evidence is not interpreted as service truth. No inferred live state. No automated correction.
```

## Command failure example

```text
Edge Runner Health Snapshot

Target host: jai-nexus-pi4
Source repo/tool: jai-edge / scripts/edge_health_snapshot.py
Snapshot captured at: <snapshot_timestamp_utc>
Last submitted evidence: manual evidence intake

Overall classification: evidence_command_failed
Display state: review_needed
Service count: no trustworthy service count
Exit code: <nonzero_exit_code>
Routing recommendation: pass_control_thread_operator_machine_review
Freshness/staleness state: fresh

Service statuses
- snapshot command did not complete successfully on the operator machine

Next recommended action
Route operator machine review. Do not automatically retry.

Authority boundary
No automatic retry. No hidden re-execution. No live endpoint fallback.
```

## Stale evidence example

```text
Edge Runner Health Snapshot

Target host: jai-nexus-pi4
Source repo/tool: jai-edge / scripts/edge_health_snapshot.py
Snapshot captured at: <older_snapshot_timestamp_utc>
Last submitted evidence: manual evidence intake

Overall classification: blocked_until_control_thread_routing
Display state: stale
Service count: 4 / 4 healthy in submitted snapshot
Exit code: 0
Routing recommendation: hold_for_control_thread_review
Freshness/staleness state: stale

Service statuses
- memory: HTTP 200 / healthy
- relay: HTTP 200 / healthy
- ingest-api: HTTP 200 / healthy
- writer-stub: HTTP 200 / healthy

Next recommended action
Show stale evidence as historical/manual evidence only. Request a new human-run snapshot if needed.

Authority boundary
Old evidence is not treated as current live state. No auto-refresh. No polling.
```

## Insufficient-evidence note

If `snapshot timestamp` is missing or critical normalization fields are absent,
the card should not render as `status_ok` even if some positive service wording
appears in the raw submission.

Recommended treatment:

- `display state: insufficient_evidence`
- `freshness/staleness state: insufficient_evidence`
- `next recommended action: Do not render as status_ok. Request corrected evidence or route review.`

## UI / product out of scope

The following remain out of scope for any UI/product implementation based on
this mock:

- live endpoint calls
- runtime polling
- auto-refresh
- schedulers
- automatic retries
- remediation controls
- restart buttons
- Docker or Pi inspection
- inspection of `/home/jerryingram/edge`
- runtime data import
- live env import
- API or DB persistence
- customer-facing availability claims
- customer data handling
- deployment, sync, or migration authority
- branch or PR automation

## Explicit authority boundary

This mock does not authorize:

- execution of the `jai-edge` utility
- evidence ingestion automation
- live telemetry
- runtime polling
- remediation
- restarts
- retries
- scheduler behavior
- Docker/Pi inspection
- runtime mutation
- deployment safety claims
- remediation readiness claims
- cross-repo mutation

This is static operator-facing copy only.

## Residual risks

- a weakly worded card could still be mistaken for live telemetry
- operators may overread endpoint health as deployment safety
- stale evidence may remain visually prominent if freshness language is weak
- malformed evidence may appear more trustworthy than it is if fallback copy is
  too polished
- future UI implementation could drift into action controls unless the explicit
  authority boundary remains visible

## Mockup note

The required reference file contains the static mock examples directly. A
separate `docs/mockups/` artifact was unnecessary for this branch because the
mock variants are already expressed as pseudo-card blocks here.
