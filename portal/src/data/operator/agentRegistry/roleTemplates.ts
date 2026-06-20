export type AgentRegistryStatus =
  | "TEMPLATE_STAGED"
  | "DOMAIN_ENGINE_STAGED"
  | "PROJECT_CANDIDATE_STAGED"
  | "RECOMMENDED_ONLY"
  | "NOT EXECUTING"
  | "ZERO GATES GRANTED"
  | "READ_ONLY"
  | "FROZEN"
  | "DEPRECATED"
  | "LEGACY"
  | "EXTERNAL_ANCHOR"
  | "BLOCKED_IN_V0";

export type AgentTemplateNamespace =
  | "JAI::AGENT::BUILDER"
  | "JAI::AGENT::VERIFIER"
  | "JAI::AGENT::CHALLENGER"
  | "JAI::AGENT::LIBRARIAN"
  | "JAI::AGENT::SYNTHESIZER"
  | "JAI::AGENT::AUDITOR"
  | "JAI::AGENT::SAFETY_GUARD"
  | "JAI::AGENT::CONTEXT_CURATOR"
  | "JAI::AGENT::RECEIPT_DRAFTER"
  | "JAI::AGENT::ROLLBACK_PLANNER"
  | "JAI::AGENT::ROUTER"
  | "JAI::AGENT::STEWARD"
  | "JAI::AGENT::EXECUTOR_CANDIDATE";

export type AgentDomainEngineNamespace =
  | "JAI::DEV"
  | "JAI::DOCS"
  | "JAI::FORMAT"
  | "JAI::SOT"
  | "JAI::OPS"
  | "JAI::AUDIT"
  | "JAI::SECURITY"
  | "JAI::CUSTOMER"
  | "JAI::API"
  | "JAI::PALETTE"
  | "JAI::GRID"
  | "JAI::COUNCIL"
  | "JAI::RUNTIME"
  | "JAI::BILLING";

export type AgentPostureLabel =
  | "STAGED"
  | "REPRESENTATIONAL"
  | "NON-EXECUTING"
  | "READ-ONLY"
  | "COMPOSE-ONLY"
  | "GATED FUTURE CAPABILITY"
  | "NOT EXECUTING"
  | "ZERO GATES GRANTED";

export type AgentBlockedAction =
  | "execute"
  | "dispatch"
  | "invoke_tool"
  | "write_file"
  | "mutate_repo"
  | "create_branch"
  | "open_pr"
  | "push"
  | "merge"
  | "deploy"
  | "create_receipt"
  | "update_canon"
  | "access_customer_data"
  | "persist_hidden_memory"
  | "run_terminal"
  | "control_browser"
  | "control_desktop"
  | "model_dispatch"
  | "agent_dispatch"
  | "open_gate";

export type AgentAllowedAction =
  | "represent"
  | "stage"
  | "draft"
  | "review"
  | "summarize"
  | "propose"
  | "classify"
  | "request_human_review";

export type AgentVoteClass =
  | "APPROVE_RECOMMENDATION"
  | "REJECT_RECOMMENDATION"
  | "REQUEST_REVISION"
  | "BLOCKER_RAISED"
  | "RISK_FLAG"
  | "ABSTAIN"
  | "DISSENT"
  | "CONTRADICTION_FOUND"
  | "SAFE_ALTERNATIVE_PROPOSED"
  | "NEEDS_MORE_EVIDENCE"
  | "OUT_OF_SCOPE"
  | "DEFER";

export type AgentQuorumStatus =
  | "QUORUM_COMPLETE_NOT_APPROVAL"
  | "QUORUM_INCOMPLETE"
  | "NO_CONSENSUS"
  | "BLOCKED_BY_DISSENT";

export type PaletteRecommendationStatus =
  | "PALETTE_RECOMMENDATION_NOT_CREATION"
  | "CONTROL_THREAD_REVIEW_REQUIRED"
  | "ZERO_GATES_GRANTED"
  | "RECOMMENDED_ONLY";

export type ProjectAgentCandidateStatus =
  | "PROJECT_CANDIDATE_STAGED"
  | "RECOMMENDED_ONLY"
  | "NOT EXECUTING"
  | "ZERO GATES GRANTED";

export type RepoRiskTreatment =
  | "LOW"
  | "MEDIUM"
  | "HIGH-RISK / FUTURE-GATED / NO EXECUTION"
  | "HIGH-RISK / HELD / NO BROWSER-DESKTOP CONTROL"
  | "FROZEN / DEPRECATED / NO MODEL DISPATCH"
  | "FROZEN / NO HIDDEN MEMORY WRITES"
  | "FROZEN / LINEAGE UNLESS REACTIVATED"
  | "EXTERNAL PRODUCT ANCHOR / NON-CONTROL-PLANE / DEPRECATED ANCHOR"
  | "LINEAGE ONLY";

export type TierAgentClass = "TIER_0" | "TIER_1" | "TIER_2";

export type AgentRoleTemplate = {
  namespace: AgentTemplateNamespace;
  displayName: string;
  status: AgentRegistryStatus[];
  allowedOutputs: string[];
  blockedActions: AgentBlockedAction[];
  voteRole: string;
  workRole: string;
  safeV0Posture: AgentPostureLabel[];
  requiredGates: string[];
  sourceDoctrineLabel: string;
};

const commonBlockedActions = [
  "execute",
  "dispatch",
  "invoke_tool",
  "write_file",
  "mutate_repo",
  "create_branch",
  "open_pr",
  "push",
  "merge",
  "deploy",
  "create_receipt",
  "update_canon",
] as const satisfies AgentBlockedAction[];

const commonPosture = [
  "STAGED",
  "REPRESENTATIONAL",
  "NON-EXECUTING",
  "ZERO GATES GRANTED",
] as const satisfies AgentPostureLabel[];

export const agentRoleTemplates = [
  {
    namespace: "JAI::AGENT::BUILDER",
    displayName: "Builder",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["implementation plan draft", "safe alternative", "handoff summary"],
    blockedActions: commonBlockedActions,
    voteRole: "advisory readiness recommendation",
    workRole: "draft bounded work artifacts",
    safeV0Posture: commonPosture,
    requiredGates: ["future repo gate", "future execution gate"],
    sourceDoctrineLabel: "Template expansion is recommendation; template instantiation is review.",
  },
  {
    namespace: "JAI::AGENT::VERIFIER",
    displayName: "Verifier",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["verification note", "validation checklist", "evidence gap"],
    blockedActions: commonBlockedActions,
    voteRole: "advisory evidence sufficiency vote",
    workRole: "check claims and validation posture",
    safeV0Posture: commonPosture,
    requiredGates: ["future validation evidence gate"],
    sourceDoctrineLabel: "Validation is not acceptance.",
  },
  {
    namespace: "JAI::AGENT::CHALLENGER",
    displayName: "Challenger",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["dissent", "contradiction", "risk flag"],
    blockedActions: commonBlockedActions,
    voteRole: "advisory blocker or dissent vote",
    workRole: "attack assumptions and preserve conflict",
    safeV0Posture: commonPosture,
    requiredGates: ["future human review gate"],
    sourceDoctrineLabel: "Dissent must remain visible.",
  },
  {
    namespace: "JAI::AGENT::LIBRARIAN",
    displayName: "Librarian",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["lineage note", "source map", "canon boundary note"],
    blockedActions: commonBlockedActions,
    voteRole: "advisory lineage blocker",
    workRole: "check source lineage",
    safeV0Posture: commonPosture,
    requiredGates: ["future canon receipt gate"],
    sourceDoctrineLabel: "Receipts record; they do not decide.",
  },
  {
    namespace: "JAI::AGENT::SYNTHESIZER",
    displayName: "Synthesizer",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["passalong draft", "summary", "reconciliation note"],
    blockedActions: commonBlockedActions,
    voteRole: "comment by default",
    workRole: "prepare manual handoff",
    safeV0Posture: commonPosture,
    requiredGates: ["future receipt review gate"],
    sourceDoctrineLabel: "Synthesis does not decide.",
  },
  {
    namespace: "JAI::AGENT::AUDITOR",
    displayName: "Auditor",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["audit finding", "risk note", "authority boundary note"],
    blockedActions: [...commonBlockedActions, "open_gate"],
    voteRole: "advisory audit blocker",
    workRole: "review evidence and authority",
    safeV0Posture: commonPosture,
    requiredGates: ["future audit receipt gate"],
    sourceDoctrineLabel: "Read-only is not authority.",
  },
  {
    namespace: "JAI::AGENT::SAFETY_GUARD",
    displayName: "Safety Guard",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["blocked capability note", "abuse case", "safe alternative"],
    blockedActions: [...commonBlockedActions, "access_customer_data", "open_gate"],
    voteRole: "advisory safety blocker",
    workRole: "check blocked capabilities",
    safeV0Posture: commonPosture,
    requiredGates: ["future security gate"],
    sourceDoctrineLabel: "Authentication is not authorization.",
  },
  {
    namespace: "JAI::AGENT::CONTEXT_CURATOR",
    displayName: "Context Curator",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["context packet", "source posture note", "missing evidence list"],
    blockedActions: [...commonBlockedActions, "access_customer_data", "persist_hidden_memory"],
    voteRole: "comment by default",
    workRole: "assemble labeled context",
    safeV0Posture: commonPosture,
    requiredGates: ["future privacy gate", "future context gate"],
    sourceDoctrineLabel: "Palette may assemble labeled context but does not grant authority.",
  },
  {
    namespace: "JAI::AGENT::RECEIPT_DRAFTER",
    displayName: "Receipt Drafter",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["receipt request draft", "lineage expectation", "acceptance checklist"],
    blockedActions: commonBlockedActions,
    voteRole: "comment by default",
    workRole: "draft receipt request text",
    safeV0Posture: commonPosture,
    requiredGates: ["future receipt authority gate"],
    sourceDoctrineLabel: "Receipt draft is not receipt.",
  },
  {
    namespace: "JAI::AGENT::ROLLBACK_PLANNER",
    displayName: "Rollback Planner",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["rollback note", "revocation plan", "safe fallback"],
    blockedActions: commonBlockedActions,
    voteRole: "advisory rollback adequacy vote",
    workRole: "plan rollback without executing rollback",
    safeV0Posture: commonPosture,
    requiredGates: ["future rollback gate", "future execution gate"],
    sourceDoctrineLabel: "Rollback requirement is not rollback execution.",
  },
  {
    namespace: "JAI::AGENT::ROUTER",
    displayName: "Router",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["route recommendation", "scope note", "handoff path"],
    blockedActions: commonBlockedActions,
    voteRole: "comment by default",
    workRole: "propose route placement",
    safeV0Posture: commonPosture,
    requiredGates: ["future route decision gate"],
    sourceDoctrineLabel: "Routes recommend; they do not execute.",
  },
  {
    namespace: "JAI::AGENT::STEWARD",
    displayName: "Steward",
    status: ["TEMPLATE_STAGED", "ZERO GATES GRANTED"],
    allowedOutputs: ["registry hygiene note", "review cadence", "supersession note"],
    blockedActions: commonBlockedActions,
    voteRole: "advisory registry hygiene vote",
    workRole: "maintain registry posture",
    safeV0Posture: commonPosture,
    requiredGates: ["future registry acceptance receipt"],
    sourceDoctrineLabel: "Registry presence is not activation.",
  },
  {
    namespace: "JAI::AGENT::EXECUTOR_CANDIDATE",
    displayName: "Executor Candidate",
    status: ["TEMPLATE_STAGED", "NOT EXECUTING", "ZERO GATES GRANTED"],
    allowedOutputs: ["execution readiness note", "required gate list", "rollback requirement"],
    blockedActions: [...commonBlockedActions, "model_dispatch", "agent_dispatch", "run_terminal", "control_browser", "control_desktop"],
    voteRole: "comment only in v0",
    workRole: "represent future gated execution consideration",
    safeV0Posture: ["STAGED", "REPRESENTATIONAL", "NON-EXECUTING", "NOT EXECUTING", "GATED FUTURE CAPABILITY", "ZERO GATES GRANTED"],
    requiredGates: ["future security gate", "future execution gate", "future tool gate"],
    sourceDoctrineLabel: "EXECUTOR_CANDIDATE is the only safe v0 executor-related term.",
  },
] as const satisfies AgentRoleTemplate[];
