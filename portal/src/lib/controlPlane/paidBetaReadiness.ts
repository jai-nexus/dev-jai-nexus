export type PaidBetaGateStatus =
  | "not_started"
  | "planned"
  | "boundary_defined"
  | "preflight_defined"
  | "blocked_by_missing_owner"
  | "blocked_by_security_review"
  | "blocked_by_infrastructure"
  | "blocked_by_auth_billing"
  | "ready_for_implementation_planning"
  | "implementation_authorized";

export interface PaidBetaReadinessGate {
  gate_id: string;
  gate_label: string;
  owner_repo: string;
  supporting_repos: string[];
  status: PaidBetaGateStatus;
  existing_evidence_artifact: string;
  missing_next_artifact: string;
  implementation_allowed: "yes" | "no";
}

export interface PaidBetaReadinessModel {
  paid_beta_status: "not_open";
  payment_collection: "not_authorized";
  customer_data: "not_authorized";
  production_infrastructure: "not_selected";
  local_machine_posture: "not_customer_serving";
  gates: PaidBetaReadinessGate[];
  counts: Record<PaidBetaGateStatus, number>;
  recommended_next_route: string;
  note: string;
  source_refs: string[];
}

const paidBetaGates: PaidBetaReadinessGate[] = [
  {
    gate_id: "commercial_offer",
    gate_label: "Commercial offer",
    owner_repo: "jai-nexus",
    supporting_repos: ["dev-jai-nexus"],
    status: "planned",
    existing_evidence_artifact: "jai-nexus PR #24; .nexus/canon/billing-model-routing-update-v0.md",
    missing_next_artifact: "jai-nexus Commercial Offer v0 / Customer-Facing Value Copy",
    implementation_allowed: "no",
  },
  {
    gate_id: "plan_envelope",
    gate_label: "Plan envelope",
    owner_repo: "jai-nexus",
    supporting_repos: ["dev-jai-nexus"],
    status: "boundary_defined",
    existing_evidence_artifact: "jai-nexus PR #24; motion-0229",
    missing_next_artifact: "product offer/package finalization plan",
    implementation_allowed: "no",
  },
  {
    gate_id: "unit_economics",
    gate_label: "Unit economics",
    owner_repo: "dev-jai-nexus",
    supporting_repos: ["jai-nexus"],
    status: "boundary_defined",
    existing_evidence_artifact: ".nexus/canon/paid-beta-unit-economics-boundary-v0.md",
    missing_next_artifact: "customer-facing commercialization route",
    implementation_allowed: "no",
  },
  {
    gate_id: "billing_stripe_boundary",
    gate_label: "Billing / Stripe boundary",
    owner_repo: "jai-nexus + api-nexus",
    supporting_repos: ["dev-jai-nexus"],
    status: "blocked_by_auth_billing",
    existing_evidence_artifact: "jai-nexus PR #24; api-nexus PR #5; motion-0229",
    missing_next_artifact: "usage/billing interface boundary follow-up",
    implementation_allowed: "no",
  },
  {
    gate_id: "auth_account_identity",
    gate_label: "Auth / account identity",
    owner_repo: "jai-nexus + api-nexus",
    supporting_repos: ["jai"],
    status: "blocked_by_auth_billing",
    existing_evidence_artifact: "api-nexus PR #5; customer-console-implementation-gates-v0.md",
    missing_next_artifact: "auth/account boundary plan",
    implementation_allowed: "no",
  },
  {
    gate_id: "workspace_project_data",
    gate_label: "Workspace / project data",
    owner_repo: "jai-nexus + api-nexus",
    supporting_repos: ["dev-jai-nexus"],
    status: "planned",
    existing_evidence_artifact: "jai-nexus PR #23; api-nexus PR #5",
    missing_next_artifact: "workspace/project model plan",
    implementation_allowed: "no",
  },
  {
    gate_id: "production_infrastructure",
    gate_label: "Production infrastructure",
    owner_repo: "later infrastructure owner",
    supporting_repos: ["dev-jai-nexus", "api-nexus", "jai-nexus"],
    status: "blocked_by_infrastructure",
    existing_evidence_artifact: ".nexus/canon/production-infrastructure-boundary-v0.md",
    missing_next_artifact: "production infrastructure selection and deployment boundary",
    implementation_allowed: "no",
  },
  {
    gate_id: "privacy_security_preflight",
    gate_label: "Privacy / security preflight",
    owner_repo: "audit-nexus",
    supporting_repos: ["dev-jai-nexus", "jai-nexus", "api-nexus"],
    status: "preflight_defined",
    existing_evidence_artifact: "audit-nexus PR #9 / AUD-2026Q2-001",
    missing_next_artifact: "privacy/security evidence checklist follow-up",
    implementation_allowed: "no",
  },
  {
    gate_id: "customer_data_boundary",
    gate_label: "Customer data boundary",
    owner_repo: "later boundary owner",
    supporting_repos: ["audit-nexus", "jai-nexus", "api-nexus"],
    status: "blocked_by_security_review",
    existing_evidence_artifact: "motion-0232; audit-nexus PR #9; api-nexus PR #5",
    missing_next_artifact: "customer data boundary plan",
    implementation_allowed: "no",
  },
  {
    gate_id: "provider_model_data_exposure",
    gate_label: "Provider/model data exposure",
    owner_repo: "jai + jai-nexus",
    supporting_repos: ["api-nexus"],
    status: "not_started",
    existing_evidence_artifact: "motion-0232; product posture notes",
    missing_next_artifact: "customer-safe JAI substrate boundary",
    implementation_allowed: "no",
  },
  {
    gate_id: "usage_metering_rate_limits",
    gate_label: "Usage metering / rate limits",
    owner_repo: "jai-nexus + api-nexus",
    supporting_repos: ["dev-jai-nexus"],
    status: "planned",
    existing_evidence_artifact: "jai-nexus PR #24; api-nexus PR #5",
    missing_next_artifact: "usage/billing interface contract follow-up",
    implementation_allowed: "no",
  },
  {
    gate_id: "logs_observability",
    gate_label: "Logs / observability",
    owner_repo: "later infrastructure/API owner",
    supporting_repos: ["audit-nexus", "dev-jai-nexus"],
    status: "not_started",
    existing_evidence_artifact: "motion-0231; audit preflight baseline",
    missing_next_artifact: "observability/logging boundary plan",
    implementation_allowed: "no",
  },
  {
    gate_id: "retention_deletion",
    gate_label: "Retention / deletion",
    owner_repo: "later data-boundary owner",
    supporting_repos: ["audit-nexus", "api-nexus", "jai-nexus"],
    status: "not_started",
    existing_evidence_artifact: "jai-nexus PR #24; audit-nexus PR #9",
    missing_next_artifact: "retention/deletion boundary plan",
    implementation_allowed: "no",
  },
  {
    gate_id: "incident_rollback_support",
    gate_label: "Incident / rollback / support",
    owner_repo: "later product/infra owner",
    supporting_repos: ["jai-nexus", "api-nexus", "audit-nexus", "dev-jai-nexus"],
    status: "planned",
    existing_evidence_artifact: "motion-0232; motion-0231",
    missing_next_artifact: "support and incident posture plan",
    implementation_allowed: "no",
  },
  {
    gate_id: "audit_event_evidence",
    gate_label: "Audit / event evidence",
    owner_repo: "api-nexus + audit-nexus",
    supporting_repos: ["dev-jai-nexus"],
    status: "planned",
    existing_evidence_artifact: "api-nexus PR #5; audit-nexus PR #9",
    missing_next_artifact: "audit/event evidence boundary plan",
    implementation_allowed: "no",
  },
];

function buildCounts(): Record<PaidBetaGateStatus, number> {
  const statuses: PaidBetaGateStatus[] = [
    "not_started",
    "planned",
    "boundary_defined",
    "preflight_defined",
    "blocked_by_missing_owner",
    "blocked_by_security_review",
    "blocked_by_infrastructure",
    "blocked_by_auth_billing",
    "ready_for_implementation_planning",
    "implementation_authorized",
  ];

  const counts = Object.fromEntries(statuses.map((status) => [status, 0])) as Record<
    PaidBetaGateStatus,
    number
  >;

  for (const gate of paidBetaGates) {
    counts[gate.status] += 1;
  }

  return counts;
}

export function getPaidBetaReadinessModel(): PaidBetaReadinessModel {
  return {
    paid_beta_status: "not_open",
    payment_collection: "not_authorized",
    customer_data: "not_authorized",
    production_infrastructure: "not_selected",
    local_machine_posture: "not_customer_serving",
    gates: paidBetaGates.map((gate) => ({ ...gate, supporting_repos: [...gate.supporting_repos] })),
    counts: buildCounts(),
    recommended_next_route: "jai-nexus Commercial Offer v0 / Customer-Facing Value Copy",
    note:
      "Read-only routing summary only. No paid beta opening, no implementation authorization, no payment collection, and no customer data collection are introduced here.",
    source_refs: [
      ".nexus/canon/paid-beta-cross-repo-readiness-matrix-v0.md",
      ".nexus/canon/paid-beta-gate-status-model-v0.md",
      ".nexus/canon/paid-beta-next-routing-decision-v0.md",
      ".nexus/canon/paid-beta-readiness-gate-v0.md",
    ],
  };
}
