import type { VersionedOperatingContextFixture } from "./versionedOperatingContextTypes";

const versionedOperatingContextFixture: VersionedOperatingContextFixture = {
  generated_label: "Q2M6 Versioned Operating Context static fixture v0",
  status_note:
    "Static local fixture only. Non-live, non-mutating, and non-canonical unless accepted by CONTROL_THREAD. No settings storage, API/DB reads, remote fetch, telemetry, billing, customer data, provider/model calls, runtime ingestion, or route execution.",
  authority_boundary_label:
    "Versioned Operating Context is displayed as checked-in local context doctrine only.",
  context: {
    current_context_id: "voc-q2m6-operator-control-plane-v0",
    object_id: "VERSIONED_OPERATING_CONTEXT_V0",
    nhid: "NH-VOC-Q2M6-OPERATOR-CONTROL-PLANE",
    scope: "workspace",
    version: "0.1.0-static",
    status: "static_viewer_candidate",
    display_name: "Q2M6 Operator Control Plane Context",
    objective:
      "Represent the current JAI NEXUS operating context as a versioned, reviewable object for dashboard modules, metrics, Council defaults, Agent lane defaults, evidence standards, authority boundaries, and rollback posture.",
    active_configuration: [
      {
        label: "Default source",
        value: "checked-in fixture",
        detail: "The viewer reads only local fixture data.",
      },
      {
        label: "Mutation mode",
        value: "disabled",
        detail: "No forms, handlers, persistence, or live setting writes exist.",
      },
      {
        label: "Canonical posture",
        value: "pending CONTROL_THREAD acceptance",
        detail: "Displayed context is not canonical until accepted.",
      },
    ],
    dashboard_modules: [
      {
        module_id: "operator-portfolio-status",
        label: "Operator Portfolio Status",
        status: "static_fixture_visible",
        summary: "Shows portfolio batches and repo lanes from checked-in fixture data.",
      },
      {
        module_id: "jai-project-registry",
        label: "JAI Project Registry",
        status: "static_fixture_visible",
        summary: "Shows active and frozen JAI Project objects from checked-in fixture data.",
      },
      {
        module_id: "versioned-operating-context",
        label: "Versioned Operating Context",
        status: "static_viewer_candidate",
        summary: "Shows this context object as a non-mutating local static viewer.",
      },
    ],
    custom_metrics: [
      {
        label: "Live mutations",
        value: "0",
        detail: "No live settings, route execution, API writes, or DB writes are available.",
      },
      {
        label: "Protected settings",
        value: "6",
        detail: "Blocked settings are governance constraints, not editable preferences.",
      },
      {
        label: "Evidence posture",
        value: "manual review",
        detail: "Snapshots, diffs, and receipts are representational only.",
      },
    ],
    council_defaults: [
      {
        council_id: "authority-review",
        label: "Authority Review",
        posture: "advisory",
        advisory_note:
          "Council defaults may frame critique and missing-gate review, but cannot approve, route, mutate, or execute.",
      },
      {
        council_id: "evidence-review",
        label: "Evidence Review",
        posture: "advisory",
        advisory_note:
          "Evidence review is representational and does not validate live systems or customer data.",
      },
    ],
    agent_lane_defaults: [
      {
        lane_id: "operator-display-lane",
        label: "Operator Display Lane",
        default_status: "representational",
        summary: "Displays static fixture-backed surfaces for operator review.",
        non_executable_note:
          "No Agent lane shown here can run tasks, call providers, create branches, or update repos.",
      },
      {
        lane_id: "context-review-lane",
        label: "Context Review Lane",
        default_status: "representational",
        summary: "Frames future review of context object fields and evidence standards.",
        non_executable_note:
          "No runtime ingestion, automatic diffing, or rollback execution is authorized.",
      },
    ],
    evidence_standards: [
      {
        standard_id: "checked-in-fixture",
        label: "Checked-in fixture",
        requirement:
          "Viewer content must come from local committed fixture data, not API/DB state or remote artifacts.",
      },
      {
        standard_id: "manual-validation",
        label: "Manual validation",
        requirement:
          "Validation is command output and human review only; the viewer does not execute validation.",
      },
      {
        standard_id: "acceptance-boundary",
        label: "CONTROL_THREAD acceptance",
        requirement:
          "Fixture content remains non-canonical unless accepted by CONTROL_THREAD.",
      },
    ],
    authority_boundary:
      "This context viewer is display-only. It does not create live settings, mutate context state, execute rollback, call providers, ingest runtime data, or alter production behavior.",
    blocked_settings: [
      {
        setting_id: "live-settings-storage",
        label: "Live settings storage",
        value: "blocked",
        reason: "Would require separate API/data model governance and persistence review.",
      },
      {
        setting_id: "api-db-backed-context",
        label: "API/DB-backed context",
        value: "blocked",
        reason: "Would require separate api-nexus contract, DB, audit, and migration authority.",
      },
      {
        setting_id: "provider-model-dispatch",
        label: "Provider/model dispatch",
        value: "blocked",
        reason: "Provider calls remain outside this local static viewer scope.",
      },
      {
        setting_id: "runtime-ingestion",
        label: "Runtime ingestion",
        value: "blocked",
        reason: "No live ingestion or automatic context refresh is authorized.",
      },
      {
        setting_id: "route-execution",
        label: "Route execution",
        value: "blocked",
        reason: "The viewer cannot launch tasks, routes, branches, PRs, or rollbacks.",
      },
      {
        setting_id: "customer-data-handling",
        label: "Customer data handling",
        value: "blocked",
        reason: "Fixture content must not require customer data or production workload state.",
      },
    ],
    confirmation_requirements: [
      "CONTROL_THREAD acceptance before treating fixture content as canonical.",
      "Separate route before API/DB-backed context state.",
      "Separate route before live settings storage or mutation.",
      "Separate route before provider/model dispatch.",
      "Separate route before rollback execution or production usage.",
    ],
    last_snapshot: {
      ref_id: "snapshot-q2m6-static-v0",
      label: "Last static snapshot",
      summary:
        "Representational snapshot of current Q2M6 static operating loop objects; not a live capture.",
    },
    last_diff: {
      ref_id: "diff-q2m6-static-v0",
      label: "Last static diff",
      summary:
        "Representational diff posture for future review; no automatic diffing is implemented.",
    },
    last_receipt: {
      ref_id: "receipt-q2m6-static-v0",
      label: "Last static receipt",
      summary:
        "Representational receipt posture for manual closeout; no receipt ingestion is implemented.",
    },
    rollback_posture:
      "Rollback is documented as review posture only. No rollback button, handler, route execution, DB mutation, or production rollback behavior exists.",
  },
  non_authorizations: [
    "no API routes",
    "no DB connection",
    "no api-nexus fetch",
    "no remote artifact fetch",
    "no live settings storage",
    "no live mutation",
    "no telemetry",
    "no billing behavior",
    "no customer data handling",
    "no provider/model dispatch",
    "no runtime ingestion",
    "no route execution",
    "no branch/PR automation",
    "no production readiness claim",
  ],
};

export function getVersionedOperatingContextFixture(): VersionedOperatingContextFixture {
  const context = versionedOperatingContextFixture.context;

  return {
    ...versionedOperatingContextFixture,
    context: {
      ...context,
      active_configuration: context.active_configuration.map((item) => ({ ...item })),
      dashboard_modules: context.dashboard_modules.map((module) => ({ ...module })),
      custom_metrics: context.custom_metrics.map((metric) => ({ ...metric })),
      council_defaults: context.council_defaults.map((councilDefault) => ({
        ...councilDefault,
      })),
      agent_lane_defaults: context.agent_lane_defaults.map((agentLaneDefault) => ({
        ...agentLaneDefault,
      })),
      evidence_standards: context.evidence_standards.map((standard) => ({ ...standard })),
      blocked_settings: context.blocked_settings.map((setting) => ({ ...setting })),
      confirmation_requirements: [...context.confirmation_requirements],
      last_snapshot: { ...context.last_snapshot },
      last_diff: { ...context.last_diff },
      last_receipt: { ...context.last_receipt },
    },
    non_authorizations: [...versionedOperatingContextFixture.non_authorizations],
  };
}
