export type OperatorSecurityGateStatus = "CLOSED";

export interface OperatorSecurityGateClass {
  gate_id: string;
  name: string;
  purpose: string;
  v0_status: OperatorSecurityGateStatus;
  required_evidence: string[];
  blocked_capabilities: string[];
  future_activation_requirements: string[];
  non_authorizing_note: string;
}

export interface OperatorSecurityCapability {
  capability_id: string;
  capability: string;
  v0_status: OperatorSecurityGateStatus;
  future_gate_requirements: string[];
}

export interface OperatorSecurityGateModelFixture {
  model_id: string;
  status: "LOCAL STATIC MODEL";
  non_authorizing: true;
  gates_granted: 0;
  posture_labels: string[];
  summary: string;
  gate_classes: OperatorSecurityGateClass[];
  capability_matrix: OperatorSecurityCapability[];
  doctrine_invariants: string[];
  non_authorizations: string[];
  deferred_items: string[];
  review_questions: string[];
  recommended_next_routes: string[];
}

const closedGate = (
  gate_id: string,
  name: string,
  purpose: string,
  required_evidence: string[],
  blocked_capabilities: string[],
  future_activation_requirements: string[],
  non_authorizing_note: string,
): OperatorSecurityGateClass => ({
  gate_id,
  name,
  purpose,
  v0_status: "CLOSED",
  required_evidence,
  blocked_capabilities,
  future_activation_requirements,
  non_authorizing_note,
});

export const operatorSecurityGateModelFixture: OperatorSecurityGateModelFixture = {
  model_id: "SYN-SECURITY-GATE-MODEL-001",
  status: "LOCAL STATIC MODEL",
  non_authorizing: true,
  gates_granted: 0,
  posture_labels: [
    "NON-AUTHORIZING",
    "LOCAL STATIC MODEL",
    "READ-ONLY",
    "ZERO GATES GRANTED",
    "ALL EXECUTION GATES CLOSED",
    "REPRESENTATIONAL ONLY",
    "NO DISPATCH",
    "NO EXECUTION",
  ],
  summary:
    "Future-review gate vocabulary for reasoning about possible privileged authority. This fixture evaluates nothing and grants nothing.",
  gate_classes: [
    closedGate(
      "SYN-GATE-001",
      "Identity / Operator Presence Gate",
      "Represents evidence that an identified operator is present. Authentication is not authorization.",
      ["operator identity reference", "session recency evidence", "step-up method description"],
      ["all privileged capabilities"],
      ["separately governed identity assurance profile", "explicit action-bound confirmation design"],
      "Presence evidence alone must never grant authority.",
    ),
    closedGate(
      "SYN-GATE-002",
      "Authority Scope Gate",
      "Represents the governed account, workspace, project, repo, lane, motion, and action scope.",
      ["scope declaration", "repo and lane ownership evidence", "motion or route reference"],
      ["out-of-scope mutation", "cross-repo action", "scope expansion"],
      ["explicit bounded scope", "separate approval for any scope expansion"],
      "Scope description does not grant authority automatically.",
    ),
    closedGate(
      "SYN-GATE-003",
      "Doctrine Compatibility Gate",
      "Represents review against accepted doctrine baselines without automatic acceptance or canonization.",
      ["named doctrine baselines", "compatibility review", "recorded conflicts and unresolved questions"],
      ["doctrine-conflicting action", "automatic canon update"],
      ["human doctrine review", "CONTROL_THREAD disposition"],
      "Compatibility findings remain advisory until explicitly decided.",
    ),
    closedGate(
      "SYN-GATE-004",
      "Evidence / Validation Gate",
      "Represents required validation evidence before any future privileged action. Validation is not acceptance.",
      ["validation command record", "reviewer identity", "expected and observed result", "known gaps"],
      ["unvalidated privileged action", "automatic approval"],
      ["action-specific validation profile", "human evidence review"],
      "Validation evidence cannot approve execution.",
    ),
    closedGate(
      "SYN-GATE-005",
      "CONTROL_THREAD Decision Gate",
      "Represents an explicit CONTROL_THREAD decision requirement. CONTROL_THREAD decides.",
      ["decision record", "accepted scope", "conditions", "non-authorizations"],
      ["implicit approval", "route-as-authority", "Council-as-authority"],
      ["explicit decision tied to one bounded action", "recorded conditions and expiry"],
      "No future privileged action may infer a decision from advisory artifacts.",
    ),
    closedGate(
      "SYN-GATE-006",
      "Capability Gate",
      "Separates each privileged capability so authority cannot transfer between capability classes.",
      ["named capability", "capability-specific risk review", "required upstream gate evidence"],
      [
        "model dispatch",
        "Agent execution",
        "repo mutation",
        "branch/PR automation",
        "browser/desktop control",
        "live settings mutation",
        "API/DB writes",
        "telemetry emission",
      ],
      ["separate activation decision per capability", "no inherited grants"],
      "Every listed capability remains closed in v0.",
    ),
    closedGate(
      "SYN-GATE-007",
      "Blast Radius Gate",
      "Represents hard bounds for repo, branch, path, environment, motion, route, timeout, and rollback.",
      ["repo and branch bounds", "file path allowlist", "environment", "motion and route IDs", "timeout", "rollback plan"],
      ["unbounded action", "production action", "cross-environment action"],
      ["machine-checkable bounds only after separate authorization", "fail-closed design review"],
      "This fixture describes bounds but does not enforce them.",
    ),
    closedGate(
      "SYN-GATE-008",
      "Human Confirmation Gate",
      "Represents explicit, action-specific operator confirmation requirements.",
      ["action preview", "scope preview", "risk summary", "confirmation identity and time"],
      ["silent execution", "background execution", "confirmation reuse"],
      ["separately implemented confirmation workflow", "short-lived action binding"],
      "No live confirmation workflow is implemented in v0.",
    ),
    closedGate(
      "SYN-GATE-009",
      "Rollback / Recovery Gate",
      "Represents recovery readiness required before a future privileged change.",
      ["rollback procedure", "recovery owner", "restore point", "failure stop conditions"],
      ["change without recovery posture", "automatic rollback execution"],
      ["tested recovery procedure", "bounded rollback authority"],
      "Rollback is represented only and cannot execute from this surface.",
    ),
    closedGate(
      "SYN-GATE-010",
      "Audit / Receipt Gate",
      "Represents post-action evidence and receipt expectations. Receipts record; they do not decide.",
      ["actor and action identity", "scope", "timestamps", "before/after evidence", "validation results"],
      ["receipt-as-approval", "automatic acceptance", "canon mutation"],
      ["accepted receipt schema", "durable evidence destination", "manual reconciliation path"],
      "Receipt expectations do not create a receipt or authorize an action.",
    ),
  ],
  capability_matrix: [
    ["SYN-CAP-001", "Model dispatch", ["SYN-GATE-001", "SYN-GATE-002", "SYN-GATE-003", "SYN-GATE-005", "SYN-GATE-006", "SYN-GATE-007", "SYN-GATE-008", "SYN-GATE-010"]],
    ["SYN-CAP-002", "Agent execution", ["SYN-GATE-001", "SYN-GATE-002", "SYN-GATE-003", "SYN-GATE-004", "SYN-GATE-005", "SYN-GATE-006", "SYN-GATE-007", "SYN-GATE-008", "SYN-GATE-009", "SYN-GATE-010"]],
    ["SYN-CAP-003", "Repo mutation", ["SYN-GATE-001", "SYN-GATE-002", "SYN-GATE-004", "SYN-GATE-005", "SYN-GATE-006", "SYN-GATE-007", "SYN-GATE-008", "SYN-GATE-009", "SYN-GATE-010"]],
    ["SYN-CAP-004", "Branch / PR automation", ["SYN-GATE-001", "SYN-GATE-002", "SYN-GATE-004", "SYN-GATE-005", "SYN-GATE-006", "SYN-GATE-007", "SYN-GATE-008", "SYN-GATE-009", "SYN-GATE-010"]],
    ["SYN-CAP-005", "Browser / desktop control", ["SYN-GATE-001", "SYN-GATE-002", "SYN-GATE-005", "SYN-GATE-006", "SYN-GATE-007", "SYN-GATE-008", "SYN-GATE-009", "SYN-GATE-010"]],
    ["SYN-CAP-006", "Live settings mutation", ["SYN-GATE-001", "SYN-GATE-002", "SYN-GATE-003", "SYN-GATE-004", "SYN-GATE-005", "SYN-GATE-006", "SYN-GATE-007", "SYN-GATE-008", "SYN-GATE-009", "SYN-GATE-010"]],
    ["SYN-CAP-007", "API / DB write behavior", ["SYN-GATE-001", "SYN-GATE-002", "SYN-GATE-004", "SYN-GATE-005", "SYN-GATE-006", "SYN-GATE-007", "SYN-GATE-008", "SYN-GATE-009", "SYN-GATE-010"]],
    ["SYN-CAP-008", "Telemetry emission", ["SYN-GATE-001", "SYN-GATE-002", "SYN-GATE-003", "SYN-GATE-005", "SYN-GATE-006", "SYN-GATE-007", "SYN-GATE-008", "SYN-GATE-010"]],
  ].map(([capability_id, capability, future_gate_requirements]) => ({
    capability_id: capability_id as string,
    capability: capability as string,
    v0_status: "CLOSED" as const,
    future_gate_requirements: future_gate_requirements as string[],
  })),
  doctrine_invariants: [
    "Authentication is not authorization.",
    "Validation is not acceptance.",
    "Receipts record; they do not decide.",
    "Routes recommend; they do not execute.",
    "Council agreement is not authority.",
    "Agents are staged, not executing.",
    "ZERO GATES GRANTED.",
    "CONTROL_THREAD decides.",
    "No code push authority in v0.",
    "No Agent execution authority in v0.",
    "No model dispatch in v0.",
    "No execution gates opened.",
  ],
  non_authorizations: [
    "No automatic gate evaluation, approval, acceptance, canon update, or policy enforcement.",
    "No execution, provider/model dispatch, Agent execution, repo mutation, branch/PR automation, or browser control.",
    "No API route, server action, DB write, telemetry, persistence, GitHub integration, scheduler, or production behavior.",
    "No live confirmation, rollback, receipt creation, security enforcement, .jai runtime, or .nexus active semantics.",
  ],
  deferred_items: [
    "Gate calibration and evidence sufficiency criteria",
    "Action-bound confirmation protocol",
    "Receipt schema and durable evidence destination",
    "Expiry, revocation, rollback, and incident response profiles",
    "Any runtime gate evaluator or enforcement implementation",
  ],
  review_questions: [
    "Which capability class should receive the first separate doctrine review?",
    "What evidence is mandatory before CONTROL_THREAD may review a bounded activation?",
    "How should grants expire, revoke, and remain action-specific?",
    "Which blocked capabilities must remain permanently non-gateable?",
  ],
  recommended_next_routes: [
    "Operator Security Gate Review Receipt v0",
    "Control Plane Motion Queue Real Overlay v0",
  ],
};
