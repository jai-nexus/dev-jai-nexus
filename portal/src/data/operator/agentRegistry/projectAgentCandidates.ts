import type {
  AgentAllowedAction,
  AgentBlockedAction,
  AgentDomainEngineNamespace,
  AgentTemplateNamespace,
  ProjectAgentCandidateStatus,
  RepoRiskTreatment,
  TierAgentClass,
} from "./roleTemplates";

export type TierAgentModelRecord = {
  tier: TierAgentClass;
  description: string;
  typicalEngines: AgentDomainEngineNamespace[];
  boundary: string;
};

export type ProjectAgentCandidate = {
  candidateId: string;
  namespace: string;
  projectId: "JAI_NEXUS";
  repoScope: string[];
  domainEngine: AgentDomainEngineNamespace;
  roleTemplate: AgentTemplateNamespace;
  displayName: string;
  tier: TierAgentClass;
  status: ProjectAgentCandidateStatus[];
  recommendationSource: string;
  allowedOutputs: string[];
  allowedActions: AgentAllowedAction[];
  blockedActions: AgentBlockedAction[];
  requiredReviews: string[];
  requiredGates: string[];
  receiptExpectation: string;
  riskPosture: RepoRiskTreatment;
  activationBoundary: string;
};

export const tierAgentModel = [
  {
    tier: "TIER_0",
    description: "Core CONTROL_THREAD-adjacent review, read-only, and compose candidates.",
    typicalEngines: ["JAI::DEV", "JAI::DOCS", "JAI::GRID", "JAI::PALETTE"],
    boundary: "Tier does not grant authority. Tier does not authorize execution. Tier does not open gates.",
  },
  {
    tier: "TIER_1",
    description: "Domain work candidates for DEV, DOCS, FORMAT, AUDIT, SECURITY, and SOT.",
    typicalEngines: ["JAI::DEV", "JAI::DOCS", "JAI::FORMAT", "JAI::AUDIT", "JAI::SECURITY", "JAI::SOT"],
    boundary: "Tier does not grant authority. Tier does not authorize execution. Tier does not open gates.",
  },
  {
    tier: "TIER_2",
    description: "Specialized, future-gated, high-risk, frozen, or blocked candidates.",
    typicalEngines: ["JAI::RUNTIME", "JAI::OPS", "JAI::CUSTOMER", "JAI::BILLING"],
    boundary: "Tier does not grant authority. Tier does not authorize execution. Tier does not open gates.",
  },
] as const satisfies TierAgentModelRecord[];

const commonStatus = [
  "PROJECT_CANDIDATE_STAGED",
  "RECOMMENDED_ONLY",
  "NOT EXECUTING",
  "ZERO GATES GRANTED",
] as const satisfies ProjectAgentCandidateStatus[];

const commonAllowed = [
  "represent",
  "stage",
  "draft",
  "review",
  "summarize",
  "propose",
  "request_human_review",
] as const satisfies AgentAllowedAction[];

const commonBlocked = [
  "execute",
  "dispatch",
  "invoke_tool",
  "write_file",
  "mutate_repo",
  "create_branch",
  "open_pr",
  "push",
  "merge",
  "create_receipt",
  "update_canon",
] as const satisfies AgentBlockedAction[];

const boundary =
  "Palette may recommend staged Agent candidates. Palette must not silently create active Agents, activate Agents, dispatch Agents, or open gates.";

export const projectAgentCandidates = [
  {
    candidateId: "JAI-PROJ-JAI-NEXUS-DEV-BUILDER-0001",
    namespace: "JAI::PROJECT::JAI_NEXUS::DEV::BUILDER",
    projectId: "JAI_NEXUS",
    repoScope: ["dev-jai-nexus"],
    domainEngine: "JAI::DEV",
    roleTemplate: "JAI::AGENT::BUILDER",
    displayName: "dev-jai-nexus Builder Candidate",
    tier: "TIER_0",
    status: commonStatus,
    recommendationSource: "static Palette recommendation example",
    allowedOutputs: ["implementation plan draft", "PR body draft", "validation checklist draft"],
    allowedActions: commonAllowed,
    blockedActions: commonBlocked,
    requiredReviews: ["JAI::DEV::VERIFIER", "JAI::DEV::CHALLENGER"],
    requiredGates: ["future repo gate", "future execution gate"],
    receiptExpectation: "future project Agent candidate proposal receipt",
    riskPosture: "MEDIUM",
    activationBoundary: boundary,
  },
  {
    candidateId: "JAI-PROJ-JAI-NEXUS-DEV-VERIFIER-0002",
    namespace: "JAI::PROJECT::JAI_NEXUS::DEV::VERIFIER",
    projectId: "JAI_NEXUS",
    repoScope: ["dev-jai-nexus", "nexus-core"],
    domainEngine: "JAI::DEV",
    roleTemplate: "JAI::AGENT::VERIFIER",
    displayName: "dev-jai-nexus Verifier Candidate",
    tier: "TIER_0",
    status: commonStatus,
    recommendationSource: "static Palette recommendation example",
    allowedOutputs: ["verification note", "validation checklist", "evidence gap"],
    allowedActions: commonAllowed,
    blockedActions: commonBlocked,
    requiredReviews: ["JAI::DEV::CHALLENGER"],
    requiredGates: ["future validation evidence gate"],
    receiptExpectation: "future Agent vote review receipt",
    riskPosture: "LOW",
    activationBoundary: boundary,
  },
  {
    candidateId: "JAI-PROJ-JAI-NEXUS-PALETTE-CURATOR-0003",
    namespace: "JAI::PROJECT::JAI_NEXUS::PALETTE::CONTEXT_CURATOR",
    projectId: "JAI_NEXUS",
    repoScope: ["jai-nexus", "dev-jai-nexus"],
    domainEngine: "JAI::PALETTE",
    roleTemplate: "JAI::AGENT::CONTEXT_CURATOR",
    displayName: "jai.nexus Context Curator Candidate",
    tier: "TIER_0",
    status: commonStatus,
    recommendationSource: "static Palette recommendation example",
    allowedOutputs: ["labeled context packet", "missing evidence list", "source posture note"],
    allowedActions: commonAllowed,
    blockedActions: [...commonBlocked, "access_customer_data", "persist_hidden_memory"],
    requiredReviews: ["JAI::SECURITY::PRIVACY_BOUNDARY_REVIEWER", "JAI::AUDIT::EVIDENCE_REVIEWER"],
    requiredGates: ["future privacy gate", "future context gate"],
    receiptExpectation: "future Agent-set recommendation receipt",
    riskPosture: "MEDIUM",
    activationBoundary: boundary,
  },
  {
    candidateId: "JAI-PROJ-JAI-NEXUS-FORMAT-DESIGNER-0004",
    namespace: "JAI::PROJECT::JAI_NEXUS::FORMAT::PROFILE_DESIGNER",
    projectId: "JAI_NEXUS",
    repoScope: ["jai-format", "jai"],
    domainEngine: "JAI::FORMAT",
    roleTemplate: "JAI::AGENT::BUILDER",
    displayName: "jai-format Profile Designer Candidate",
    tier: "TIER_1",
    status: commonStatus,
    recommendationSource: "static Palette recommendation example",
    allowedOutputs: [".jai profile proposal", "schema note", "example packet"],
    allowedActions: commonAllowed,
    blockedActions: commonBlocked,
    requiredReviews: ["JAI::FORMAT::SCHEMA_REVIEWER", "JAI::FORMAT::COMPATIBILITY_GUARD"],
    requiredGates: ["future .jai profile acceptance gate"],
    receiptExpectation: "future profile acceptance receipt",
    riskPosture: "MEDIUM",
    activationBoundary: boundary,
  },
  {
    candidateId: "JAI-PROJ-JAI-NEXUS-AUDIT-RISK-0005",
    namespace: "JAI::PROJECT::JAI_NEXUS::AUDIT::RISK_REVIEWER",
    projectId: "JAI_NEXUS",
    repoScope: ["audit-nexus", "secureboot-nexus", "privacy-nexus"],
    domainEngine: "JAI::AUDIT",
    roleTemplate: "JAI::AGENT::AUDITOR",
    displayName: "audit/security Risk Reviewer Candidate",
    tier: "TIER_1",
    status: commonStatus,
    recommendationSource: "static Palette recommendation example",
    allowedOutputs: ["risk register", "authority boundary note", "blocker recommendation"],
    allowedActions: commonAllowed,
    blockedActions: [...commonBlocked, "open_gate"],
    requiredReviews: ["JAI::SECURITY::GATE_REVIEWER", "JAI::SECURITY::ABUSE_CASE_REVIEWER"],
    requiredGates: ["future security gate", "future audit receipt gate"],
    receiptExpectation: "future audit receipt",
    riskPosture: "HIGH-RISK / FUTURE-GATED / NO EXECUTION",
    activationBoundary: boundary,
  },
  {
    candidateId: "JAI-PROJ-JAI-NEXUS-RUNTIME-EXEC-CANDIDATE-0006",
    namespace: "JAI::PROJECT::JAI_NEXUS::RUNTIME::EXECUTOR_CANDIDATE",
    projectId: "JAI_NEXUS",
    repoScope: ["runtime-nexus", "jai-pilot"],
    domainEngine: "JAI::RUNTIME",
    roleTemplate: "JAI::AGENT::EXECUTOR_CANDIDATE",
    displayName: "runtime Executor Candidate",
    tier: "TIER_2",
    status: commonStatus,
    recommendationSource: "static blocked high-risk example",
    allowedOutputs: ["execution gate requirement", "rollback requirement", "risk note"],
    allowedActions: ["represent", "stage", "review", "summarize", "request_human_review"],
    blockedActions: [...commonBlocked, "agent_dispatch", "model_dispatch", "run_terminal", "control_browser", "control_desktop"],
    requiredReviews: ["JAI::SECURITY::GATE_REVIEWER", "JAI::AUDIT::AUTHORITY_BOUNDARY_REVIEWER"],
    requiredGates: ["future security gate", "future execution gate", "future tool gate"],
    receiptExpectation: "future execution-gate grant receipt if ever authorized",
    riskPosture: "HIGH-RISK / FUTURE-GATED / NO EXECUTION",
    activationBoundary: boundary,
  },
] as const satisfies ProjectAgentCandidate[];
