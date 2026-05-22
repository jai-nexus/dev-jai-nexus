export type EdgeRunnerHealthDisplayState =
  | "status_ok"
  | "degraded"
  | "blocked"
  | "review_needed"
  | "stale"
  | "insufficient_evidence"
  | "hold"
  | "control_thread_decision_required";

export interface EdgeRunnerHealthServiceStatus {
  service_name: string;
  http_status: number | null;
  reported_health: string;
  status_note: string;
}

export interface EdgeRunnerHealthStatusCardVariant {
  variant_id: string;
  variant_label: string;
  overall_classification: string;
  display_state: EdgeRunnerHealthDisplayState;
  routing_recommendation: string;
  evidence_example_source: string;
  freshness_state: "fresh" | "stale" | "review_needed" | "insufficient_evidence";
  service_count_healthy: number | null;
  service_count_total: number | null;
  next_recommended_action: string;
  operator_copy: string;
  authority_boundary: string;
  note: string;
}

export interface EdgeRunnerHealthStatusCardModel {
  title: string;
  posture: string;
  static_example_note: string;
  target_host: string;
  source_repo_tool: string;
  snapshot_timestamp: string;
  overall_classification: string;
  display_state: EdgeRunnerHealthDisplayState;
  service_count_healthy: number;
  service_count_total: number;
  service_statuses: EdgeRunnerHealthServiceStatus[];
  exit_code: number;
  evidence_source_reference: string;
  routing_recommendation: string;
  freshness_state: "fresh";
  next_recommended_action: string;
  authority_boundary: string;
  source_refs: string[];
  out_of_scope: string[];
  variants: EdgeRunnerHealthStatusCardVariant[];
}

export function getEdgeRunnerHealthStatusCardModel(): EdgeRunnerHealthStatusCardModel {
  return {
    title: "Edge Runner health status",
    posture: "static read-only operator card",
    static_example_note:
      "Static example from manual evidence intake only. This surface does not poll, auto-refresh, or claim live runtime state.",
    target_host: "jai-nexus-pi4",
    source_repo_tool: "jai-edge / scripts/edge_health_snapshot.py",
    snapshot_timestamp: "<snapshot_timestamp_utc>",
    overall_classification: "edge_runner_healthy",
    display_state: "status_ok",
    service_count_healthy: 4,
    service_count_total: 4,
    service_statuses: [
      {
        service_name: "memory",
        http_status: 200,
        reported_health: "healthy",
        status_note: "HTTP 200 / healthy",
      },
      {
        service_name: "relay",
        http_status: 200,
        reported_health: "healthy",
        status_note: "HTTP 200 / healthy",
      },
      {
        service_name: "ingest-api",
        http_status: 200,
        reported_health: "healthy",
        status_note: "HTTP 200 / healthy",
      },
      {
        service_name: "writer-stub",
        http_status: 200,
        reported_health: "healthy",
        status_note: "HTTP 200 / healthy",
      },
    ],
    exit_code: 0,
    evidence_source_reference:
      "manual evidence intake from orchestrator-nexus-normalized jai-edge snapshot output",
    routing_recommendation: "pass_control_thread_status_ok",
    freshness_state: "fresh",
    next_recommended_action:
      "Continue normal monitoring. Wait for the next human-run snapshot.",
    authority_boundary:
      "No automated action. Manual evidence only. No live telemetry, no polling, and no remediation authority.",
    source_refs: [
      "docs/plans/EDGE_RUNNER_HEALTH_SNAPSHOT_CONTROL_PLANE_VISIBILITY_PLAN_V0.md",
      "docs/reference/EDGE_RUNNER_HEALTH_STATUS_CARD_V0.md",
      "docs/reference/EDGE_RUNNER_HEALTH_STATUS_CARD_MOCK_V0.md",
    ],
    out_of_scope: [
      "live endpoint calls",
      "runtime polling",
      "auto-refresh",
      "automatic retries",
      "remediation controls",
      "Docker/Pi inspection",
      "API/DB persistence",
      "deployment/sync/migration authority",
    ],
    variants: [
      {
        variant_id: "healthy",
        variant_label: "Healthy example",
        overall_classification: "edge_runner_healthy",
        display_state: "status_ok",
        routing_recommendation: "pass_control_thread_status_ok",
        evidence_example_source: "settled jai-nexus-pi4 healthy snapshot baseline",
        freshness_state: "fresh",
        service_count_healthy: 4,
        service_count_total: 4,
        next_recommended_action:
          "Continue normal monitoring. Wait for the next human-run snapshot.",
        operator_copy:
          "Static example from the last submitted evidence. Manual evidence only. No automated remediation.",
        authority_boundary:
          "No automated action. Manual evidence only. No live telemetry, no polling, and no remediation authority.",
        note: "All observed services report HTTP 200 / healthy in the submitted snapshot.",
      },
      {
        variant_id: "degraded",
        variant_label: "Partial failure",
        overall_classification: "edge_runner_partial_health_failure",
        display_state: "degraded",
        routing_recommendation: "pass_control_thread_targeted_service_review",
        evidence_example_source:
          "docs/evidence/EDGE_RUNNER_HEALTH_SNAPSHOT_DEGRADED_EXAMPLE_V0.md",
        freshness_state: "fresh",
        service_count_healthy: 3,
        service_count_total: 4,
        next_recommended_action:
          "Route targeted service review for the failed service(s). Do not restart or remediate automatically.",
        operator_copy:
          "Operator review required for failed services from the last submitted evidence. No automated remediation.",
        authority_boundary:
          "Manual evidence only. No restart controls. No automated remediation. No live endpoint calls.",
        note: "Use when one or more submitted services are unhealthy but evidence remains structurally usable.",
      },
      {
        variant_id: "unreachable",
        variant_label: "Unreachable target",
        overall_classification: "edge_runner_unreachable",
        display_state: "blocked",
        routing_recommendation: "pass_control_thread_local_connectivity_review",
        evidence_example_source:
          "docs/evidence/EDGE_RUNNER_HEALTH_SNAPSHOT_UNREACHABLE_EXAMPLE_V0.md",
        freshness_state: "fresh",
        service_count_healthy: 0,
        service_count_total: 0,
        next_recommended_action:
          "Route local connectivity review. Do not SSH, ping sweep, call endpoints, or inspect Docker automatically.",
        operator_copy:
          "Manual evidence intake could not confirm service reachability. Operator review required.",
        authority_boundary:
          "No live connectivity checks are performed by this surface. No Pi inspection. No runtime control.",
        note: "Use when the submitted snapshot cannot confirm service reachability.",
      },
      {
        variant_id: "malformed",
        variant_label: "Malformed evidence",
        overall_classification: "evidence_format_invalid",
        display_state: "review_needed",
        routing_recommendation: "pass_control_thread_evidence_normalization_review",
        evidence_example_source:
          "docs/evidence/EDGE_RUNNER_HEALTH_SNAPSHOT_MALFORMED_EXAMPLE_V0.md",
        freshness_state: "review_needed",
        service_count_healthy: null,
        service_count_total: null,
        next_recommended_action:
          "Route evidence normalization review. Do not infer beyond submitted evidence.",
        operator_copy:
          "Submitted evidence could not be normalized reliably. Operator review required.",
        authority_boundary:
          "Malformed evidence is not interpreted as service truth. No inferred live state. No automated correction.",
        note: "Use when the submitted material is malformed or normalization-critical fields are unreliable.",
      },
      {
        variant_id: "command_failure",
        variant_label: "Command failure",
        overall_classification: "evidence_command_failed",
        display_state: "review_needed",
        routing_recommendation: "pass_control_thread_operator_machine_review",
        evidence_example_source:
          "docs/evidence/EDGE_RUNNER_HEALTH_SNAPSHOT_COMMAND_FAILURE_EXAMPLE_V0.md",
        freshness_state: "fresh",
        service_count_healthy: null,
        service_count_total: null,
        next_recommended_action:
          "Route operator machine review. Do not automatically retry.",
        operator_copy:
          "The snapshot command did not complete successfully on the operator machine. Manual review only.",
        authority_boundary:
          "No automatic retry. No hidden re-execution. No live endpoint fallback.",
        note: "Use when the command fails before trustworthy service-level evidence is available.",
      },
      {
        variant_id: "stale",
        variant_label: "Stale evidence",
        overall_classification: "blocked_until_control_thread_routing",
        display_state: "stale",
        routing_recommendation: "hold_for_control_thread_review",
        evidence_example_source:
          "docs/evidence/EDGE_RUNNER_HEALTH_SNAPSHOT_STALE_EXAMPLE_V0.md",
        freshness_state: "stale",
        service_count_healthy: 4,
        service_count_total: 4,
        next_recommended_action:
          "Show stale evidence as historical/manual evidence only. Request a new human-run snapshot if needed.",
        operator_copy:
          "This surface shows stale evidence as history only. It does not imply current live state.",
        authority_boundary:
          "Old evidence is not treated as current live state. No auto-refresh. No polling.",
        note: "Old evidence remains visible as history only and must not be treated as current live state.",
      },
      {
        variant_id: "insufficient",
        variant_label: "Insufficient evidence",
        overall_classification: "blocked_until_manual_review",
        display_state: "insufficient_evidence",
        routing_recommendation: "pass_control_thread_evidence_normalization_review",
        evidence_example_source:
          "docs/evidence/EDGE_RUNNER_HEALTH_SNAPSHOT_INSUFFICIENT_EXAMPLE_V0.md",
        freshness_state: "insufficient_evidence",
        service_count_healthy: null,
        service_count_total: null,
        next_recommended_action:
          "Do not render as status_ok. Request corrected evidence or route review.",
        operator_copy:
          "Insufficient evidence prevents a trustworthy status view. Operator review required.",
        authority_boundary:
          "Do not render missing or untrustworthy evidence as service truth. No inferred live state.",
        note: "Use when timestamp or critical normalization fields are missing or untrustworthy.",
      },
    ],
  };
}
