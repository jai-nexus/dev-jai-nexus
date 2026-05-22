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
  freshness_state: "fresh" | "stale" | "review_needed" | "insufficient_evidence";
  service_count_healthy: number | null;
  service_count_total: number | null;
  next_recommended_action: string;
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
        freshness_state: "fresh",
        service_count_healthy: 4,
        service_count_total: 4,
        next_recommended_action:
          "Continue normal monitoring. Wait for the next human-run snapshot.",
        note: "All observed services report HTTP 200 / healthy in the submitted snapshot.",
      },
      {
        variant_id: "degraded",
        variant_label: "Partial failure",
        overall_classification: "edge_runner_partial_health_failure",
        display_state: "degraded",
        routing_recommendation: "targeted_service_review",
        freshness_state: "fresh",
        service_count_healthy: 3,
        service_count_total: 4,
        next_recommended_action:
          "Route targeted service review for the failed service(s). Do not restart or remediate automatically.",
        note: "Use when one or more submitted services are unhealthy but evidence remains structurally usable.",
      },
      {
        variant_id: "blocked",
        variant_label: "Unreachable target",
        overall_classification: "edge_runner_unreachable",
        display_state: "blocked",
        routing_recommendation: "local_connectivity_review",
        freshness_state: "fresh",
        service_count_healthy: 0,
        service_count_total: 0,
        next_recommended_action:
          "Route local connectivity review. Do not SSH, ping sweep, call endpoints, or inspect Docker automatically.",
        note: "Use when the submitted snapshot cannot confirm service reachability.",
      },
      {
        variant_id: "stale",
        variant_label: "Stale evidence",
        overall_classification: "edge_runner_healthy",
        display_state: "stale",
        routing_recommendation: "pass_control_thread_status_ok",
        freshness_state: "stale",
        service_count_healthy: 4,
        service_count_total: 4,
        next_recommended_action:
          "Show stale evidence as historical/manual evidence only. Request a new human-run snapshot if needed.",
        note: "Old evidence remains visible as history only and must not be treated as current live state.",
      },
      {
        variant_id: "insufficient",
        variant_label: "Insufficient evidence",
        overall_classification: "evidence_format_invalid",
        display_state: "insufficient_evidence",
        routing_recommendation: "evidence_normalization_review",
        freshness_state: "insufficient_evidence",
        service_count_healthy: null,
        service_count_total: null,
        next_recommended_action:
          "Do not render as status_ok. Request corrected evidence or route review.",
        note: "Use when timestamp or critical normalization fields are missing or untrustworthy.",
      },
    ],
  };
}
