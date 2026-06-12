export type ControlPlaneAuthorityState =
  | "non-authorizing"
  | "advisory-only"
  | "representational-only"
  | "held";

export type ControlPlaneApprovalState =
  | "accepted"
  | "needs-review"
  | "blocked"
  | "deferred"
  | "draft";

export type ControlPlaneGateStatus = "CLOSED";
export type ControlPlaneRisk = "low" | "moderate" | "elevated" | "high";

interface AuthorityRecord {
  syn_id: string;
  non_authorizing: true;
  authority_state: ControlPlaneAuthorityState;
}

export interface ControlPlaneMotion extends AuthorityRecord {
  title: string;
  status: string;
  target_repo: string;
  current_route: string;
  next_action: string;
  risk: ControlPlaneRisk;
  approval_state: ControlPlaneApprovalState;
}

export interface ControlPlaneRoute extends AuthorityRecord {
  target_repo: string;
  mode: string;
  scope: string;
  state: string;
  validation_expected: string;
  authority_boundary: string;
  next_action: string;
  gate_status: ControlPlaneGateStatus;
}

export interface ControlPlaneCouncilSlot extends AuthorityRecord {
  name: string;
  role: string;
  status: string;
  last_advisory: string;
  approval_state: ControlPlaneApprovalState;
  gate_status: ControlPlaneGateStatus;
}

export interface ControlPlaneAgentLane extends AuthorityRecord {
  name: string;
  target_repo: string;
  allowed_scope: string;
  blocked_behaviors: string[];
  required_validation: string;
  evidence_expected: string;
  gate_status: ControlPlaneGateStatus;
}

export interface ControlPlaneRepo extends AuthorityRecord {
  name: string;
  current_lane: string;
  accepted_artifacts: number;
  held_capabilities: number;
  last_receipt: string;
  next_route: string;
  risk: ControlPlaneRisk;
}

export interface ControlPlaneCloseout extends AuthorityRecord {
  receipt_type: string;
  source_repo: string;
  disposition: string;
  evidence_basis: string;
  validation_status: string;
  next_route: string;
  approval_state: ControlPlaneApprovalState;
}

export interface ControlPlaneExecutionGate {
  syn_id: string;
  label: string;
  note: string;
  non_authorizing: true;
  authority_state: "held";
  approval_state: "blocked";
  gate_status: ControlPlaneGateStatus;
  permanence: "permanent" | "separate-doctrine";
}

export interface ControlPlaneNextPrompt extends AuthorityRecord {
  target: string;
  scope: string;
  mode: string;
  reason: string;
  dependencies: string;
  gate_status: ControlPlaneGateStatus;
}

export interface ControlPlanePrototypeFixture {
  fixture_id: string;
  title: string;
  snapshot_label: string;
  provenance: string;
  non_authorizing: true;
  authority_state: "non-authorizing";
  gate_status: ControlPlaneGateStatus;
  gates_granted: 0;
  control_thread: AuthorityRecord & {
    doctrine_baseline: string;
    doctrine_label: string;
    active_batch: string;
    accepted_baseline_count: number;
    approval_state: "accepted";
    gate_status: ControlPlaneGateStatus;
  };
  motions: ControlPlaneMotion[];
  routes: ControlPlaneRoute[];
  council_slots: ControlPlaneCouncilSlot[];
  agent_lanes: ControlPlaneAgentLane[];
  repos: ControlPlaneRepo[];
  closeouts: ControlPlaneCloseout[];
  execution_gates: ControlPlaneExecutionGate[];
  next_prompts: ControlPlaneNextPrompt[];
  non_authorizations: string[];
}

export const controlPlanePrototypeFixture: ControlPlanePrototypeFixture = {
  fixture_id: "SYN-CONTROL-PLANE-0001",
  title: "Operator Control Plane",
  snapshot_label: "LOCAL STATIC SNAPSHOT",
  provenance: "NON-AUTHORIZING / ZERO GATES GRANTED / LOCAL STATIC SNAPSHOT",
  non_authorizing: true,
  authority_state: "non-authorizing",
  gate_status: "CLOSED",
  gates_granted: 0,
  control_thread: {
    syn_id: "SYN-CTRL-0001",
    doctrine_baseline: "SYN-DOCTRINE-0042",
    doctrine_label: "CONTROL_THREAD / accepted fixture posture",
    active_batch: "SYN-BATCH-2026-06-A",
    accepted_baseline_count: 24,
    non_authorizing: true,
    authority_state: "non-authorizing",
    approval_state: "accepted",
    gate_status: "CLOSED",
  },
  motions: [
    {
      syn_id: "SYN-MTN-7741",
      title: "Normalize .jai format frontmatter schema",
      status: "accepted",
      target_repo: "jai-format",
      current_route: "SYN-RTE-2210",
      next_action: "Record accepted documentary baseline",
      risk: "low",
      non_authorizing: true,
      authority_state: "non-authorizing",
      approval_state: "accepted",
    },
    {
      syn_id: "SYN-MTN-7742",
      title: "Orchestrator route ledger compaction",
      status: "closeout received",
      target_repo: "orchestrator-nexus",
      current_route: "SYN-RTE-2211",
      next_action: "Manual operator evidence review",
      risk: "moderate",
      non_authorizing: true,
      authority_state: "advisory-only",
      approval_state: "needs-review",
    },
    {
      syn_id: "SYN-MTN-7743",
      title: "Edge cold-start envelope reduction",
      status: "blocked",
      target_repo: "jai-edge",
      current_route: "SYN-RTE-2213",
      next_action: "Not authorized in v0",
      risk: "high",
      non_authorizing: true,
      authority_state: "held",
      approval_state: "blocked",
    },
    {
      syn_id: "SYN-MTN-7744",
      title: "Operator handoff packet wording",
      status: "draft",
      target_repo: "dev-jai-nexus",
      current_route: "SYN-RTE-2214",
      next_action: "Compose handoff packet for manual use",
      risk: "low",
      non_authorizing: true,
      authority_state: "representational-only",
      approval_state: "draft",
    },
  ],
  routes: [
    {
      syn_id: "SYN-RTE-2210",
      target_repo: "jai-format",
      mode: "docs-profile",
      scope: "frontmatter schema only",
      state: "returned",
      validation_expected: "manual schema evidence review",
      authority_boundary: "docs only; no parser or runtime",
      next_action: "Manual handoff review",
      non_authorizing: true,
      authority_state: "non-authorizing",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-RTE-2211",
      target_repo: "orchestrator-nexus",
      mode: "analysis",
      scope: "route ledger module",
      state: "returned",
      validation_expected: "ledger replay evidence",
      authority_boundary: "advisory only; no repo automation",
      next_action: "Manual operator review",
      non_authorizing: true,
      authority_state: "advisory-only",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-RTE-2214",
      target_repo: "dev-jai-nexus",
      mode: "docs",
      scope: "authority boundary packet",
      state: "ready",
      validation_expected: "human checklist",
      authority_boundary: "manual paste/import only",
      next_action: "Compose handoff packet",
      non_authorizing: true,
      authority_state: "representational-only",
      gate_status: "CLOSED",
    },
  ],
  council_slots: [
    {
      syn_id: "SYN-SLOT-CHATGPT",
      name: "ChatGPT",
      role: "Candidate drafting slot",
      status: "not connected",
      last_advisory: "Synthetic fixture text only",
      non_authorizing: true,
      authority_state: "advisory-only",
      approval_state: "needs-review",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-SLOT-CLAUDE",
      name: "Claude / Fable",
      role: "Candidate structural review slot",
      status: "not connected",
      last_advisory: "Synthetic fixture text only",
      non_authorizing: true,
      authority_state: "advisory-only",
      approval_state: "needs-review",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-SLOT-RESEARCH",
      name: "Research slot",
      role: "Candidate citation review slot",
      status: "not connected",
      last_advisory: "No external research performed",
      non_authorizing: true,
      authority_state: "advisory-only",
      approval_state: "deferred",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-SLOT-FUTURE",
      name: "Future JAI model",
      role: "Reserved representational slot",
      status: "unprovisioned",
      last_advisory: "None",
      non_authorizing: true,
      authority_state: "representational-only",
      approval_state: "deferred",
      gate_status: "CLOSED",
    },
  ],
  agent_lanes: [
    {
      syn_id: "SYN-LANE-BUILDER",
      name: "Builder",
      target_repo: "jai-format",
      allowed_scope: "represented build steps only",
      blocked_behaviors: ["repo mutation", "branch/PR automation", "package publish"],
      required_validation: "manual evidence bundle review",
      evidence_expected: "artifact manifest and logs",
      non_authorizing: true,
      authority_state: "representational-only",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-LANE-VERIFIER",
      name: "Verifier",
      target_repo: "audit-nexus",
      allowed_scope: "represented verification only",
      blocked_behaviors: ["live test execution", "state mutation"],
      required_validation: "deterministic proof review",
      evidence_expected: "verification receipt",
      non_authorizing: true,
      authority_state: "representational-only",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-LANE-AUDITOR",
      name: "Auditor",
      target_repo: "audit-nexus",
      allowed_scope: "represented audit traversal",
      blocked_behaviors: ["customer data", "telemetry emission"],
      required_validation: "manual audit trail review",
      evidence_expected: "synthetic audit summary",
      non_authorizing: true,
      authority_state: "representational-only",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-LANE-DOCS",
      name: "Docs / refiner",
      target_repo: "dev-jai-nexus",
      allowed_scope: "represented documentation refinement",
      blocked_behaviors: ["repo automation", "auto-commit"],
      required_validation: "lint and human review",
      evidence_expected: "diff preview",
      non_authorizing: true,
      authority_state: "representational-only",
      gate_status: "CLOSED",
    },
  ],
  repos: [
    {
      syn_id: "SYN-REPO-DEVNEXUS",
      name: "dev-jai-nexus",
      current_lane: "local static control plane",
      accepted_artifacts: 7,
      held_capabilities: 4,
      last_receipt: "SYN-CO-5512",
      next_route: "SYN-RTE-2214",
      risk: "low",
      non_authorizing: true,
      authority_state: "non-authorizing",
    },
    {
      syn_id: "SYN-REPO-ORCH",
      name: "orchestrator-nexus",
      current_lane: "analysis",
      accepted_artifacts: 11,
      held_capabilities: 7,
      last_receipt: "SYN-CO-5519",
      next_route: "SYN-RTE-2211",
      risk: "moderate",
      non_authorizing: true,
      authority_state: "advisory-only",
    },
    {
      syn_id: "SYN-REPO-AUDIT",
      name: "audit-nexus",
      current_lane: "spec review",
      accepted_artifacts: 9,
      held_capabilities: 6,
      last_receipt: "SYN-CO-5505",
      next_route: "SYN-RTE-2212",
      risk: "moderate",
      non_authorizing: true,
      authority_state: "non-authorizing",
    },
    {
      syn_id: "SYN-REPO-FORMAT",
      name: "jai-format",
      current_lane: "docs profile",
      accepted_artifacts: 14,
      held_capabilities: 3,
      last_receipt: "SYN-CO-5512",
      next_route: "SYN-RTE-2210",
      risk: "low",
      non_authorizing: true,
      authority_state: "non-authorizing",
    },
    {
      syn_id: "SYN-REPO-EDGE",
      name: "jai-edge",
      current_lane: "held",
      accepted_artifacts: 3,
      held_capabilities: 9,
      last_receipt: "SYN-CO-5520",
      next_route: "Not authorized in v0",
      risk: "high",
      non_authorizing: true,
      authority_state: "held",
    },
    {
      syn_id: "SYN-REPO-PILOT",
      name: "jai-pilot",
      current_lane: "deferred",
      accepted_artifacts: 1,
      held_capabilities: 11,
      last_receipt: "SYN-CO-5499",
      next_route: "manual review only",
      risk: "elevated",
      non_authorizing: true,
      authority_state: "held",
    },
  ],
  closeouts: [
    {
      syn_id: "SYN-CO-5512",
      receipt_type: "docs receipt",
      source_repo: "jai-format",
      disposition: "accepted",
      evidence_basis: "manual fixture review",
      validation_status: "reviewed",
      next_route: "SYN-RTE-2210",
      non_authorizing: true,
      authority_state: "non-authorizing",
      approval_state: "accepted",
    },
    {
      syn_id: "SYN-CO-5519",
      receipt_type: "analysis receipt",
      source_repo: "orchestrator-nexus",
      disposition: "needs review",
      evidence_basis: "synthetic ledger replay note",
      validation_status: "partial",
      next_route: "SYN-RTE-2211",
      non_authorizing: true,
      authority_state: "advisory-only",
      approval_state: "needs-review",
    },
    {
      syn_id: "SYN-CO-5520",
      receipt_type: "investigation receipt",
      source_repo: "jai-edge",
      disposition: "blocked",
      evidence_basis: "incomplete synthetic evidence",
      validation_status: "gate closed",
      next_route: "Not authorized in v0",
      non_authorizing: true,
      authority_state: "held",
      approval_state: "blocked",
    },
    {
      syn_id: "SYN-CO-5499",
      receipt_type: "staging receipt",
      source_repo: "jai-pilot",
      disposition: "deferred",
      evidence_basis: "synthetic staging map",
      validation_status: "held",
      next_route: "manual review only",
      non_authorizing: true,
      authority_state: "held",
      approval_state: "deferred",
    },
  ],
  execution_gates: [
    ["SYN-GATE-DISPATCH", "Provider / model dispatch", "separate doctrine required"],
    ["SYN-GATE-LIVECALL", "Live model call", "separate doctrine required"],
    ["SYN-GATE-AGENT", "Agent execution", "blocked in this prototype"],
    ["SYN-GATE-MUTATE", "Repo mutation", "blocked in this prototype"],
    ["SYN-GATE-PR", "Branch / PR automation", "separate doctrine required"],
    ["SYN-GATE-CONTROL", "Browser / desktop control", "blocked in this prototype"],
    ["SYN-GATE-SETTINGS", "Live settings", "separate doctrine required"],
    ["SYN-GATE-STATE", "API / DB state", "blocked in this prototype"],
    ["SYN-GATE-TELEMETRY", "Telemetry", "blocked in this prototype"],
    ["SYN-GATE-CUSTOMER", "Customer data", "blocked in this prototype"],
    ["SYN-GATE-PROD", "Production behavior", "separate doctrine required"],
    ["SYN-GATE-RUNTIME", ".jai parser / runtime", "separate doctrine required"],
    ["SYN-GATE-SEMANTICS", ".nexus repo governance semantics", "separate doctrine required"],
  ].map(([syn_id, label, note], index) => ({
    syn_id,
    label,
    note,
    non_authorizing: true as const,
    authority_state: "held" as const,
    approval_state: "blocked" as const,
    gate_status: "CLOSED" as const,
    permanence: index % 2 === 0 ? ("permanent" as const) : ("separate-doctrine" as const),
  })),
  next_prompts: [
    {
      syn_id: "SYN-NPQ-3301",
      target: "api-nexus",
      scope: "authority boundary document",
      mode: "docs",
      reason: "Close a documentary boundary gap",
      dependencies: "manual CONTROL_THREAD route",
      non_authorizing: true,
      authority_state: "non-authorizing",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-NPQ-3302",
      target: "orchestrator-nexus",
      scope: "ledger compaction review",
      mode: "analysis",
      reason: "Review synthetic closeout evidence",
      dependencies: "manual operator review",
      non_authorizing: true,
      authority_state: "advisory-only",
      gate_status: "CLOSED",
    },
    {
      syn_id: "SYN-NPQ-3303",
      target: "jai-format",
      scope: "VOC cascade semantics profile",
      mode: "docs-profile",
      reason: "Candidate next documentation route",
      dependencies: "separate CONTROL_THREAD acceptance",
      non_authorizing: true,
      authority_state: "representational-only",
      gate_status: "CLOSED",
    },
  ],
  non_authorizations: [
    "no backend, API, DB, server action, or network behavior",
    "no provider/model dispatch or live model calls",
    "no Agent execution or repo automation",
    "no telemetry, customer data, auth, or billing behavior",
    "no live settings or browser storage as system of record",
    "no .jai parser/runtime or .nexus repository governance semantics",
    "no symbolic projection behavior or custom dashboard generation",
    "no production readiness or production evaluation behavior",
  ],
};
