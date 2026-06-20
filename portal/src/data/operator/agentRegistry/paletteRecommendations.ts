import type { AgentDomainEngineNamespace, PaletteRecommendationStatus } from "./roleTemplates";

export type PaletteAgentRecommendation = {
  recommendationId: string;
  projectId: "JAI_NEXUS";
  displayName: string;
  scope: string;
  recommendedCandidates: string[];
  rationale: string;
  requiredReviews: string[];
  requiredGates: string[];
  blockedCapabilities: string[];
  safeAlternatives: string[];
  missingEvidence: string[];
  sourcePosture: string;
  operatorReviewRequired: boolean;
  controlThreadAcceptanceRequired: boolean;
  statusLabels: string[];
  status: PaletteRecommendationStatus[];
  primaryDomainEngine: AgentDomainEngineNamespace;
};

const standardLabels = [
  "PALETTE RECOMMENDATION  NOT CREATION",
  "CONTROL_THREAD REVIEW REQUIRED",
  "ZERO GATES GRANTED",
] as const;

const boundaryLabels = [
  "Palette recommendation is not creation.",
  "Palette recommendation is not activation.",
  "Palette recommendation is not dispatch.",
  "Palette recommendation is not authority.",
  "Palette recommends staged Agent candidates for review.",
] as const;

const standardStatus = [
  "PALETTE_RECOMMENDATION_NOT_CREATION",
  "CONTROL_THREAD_REVIEW_REQUIRED",
  "ZERO_GATES_GRANTED",
  "RECOMMENDED_ONLY",
] as const satisfies PaletteRecommendationStatus[];

export const paletteAgentRecommendations = [
  {
    recommendationId: "PAL-AGENT-SET-DEV-JAI-NEXUS-0001",
    projectId: "JAI_NEXUS",
    displayName: "dev-jai-nexus internal operator Agent set",
    scope: "Operator cockpit, static registry, and compose-readiness work",
    recommendedCandidates: [
      "JAI-PROJ-JAI-NEXUS-DEV-BUILDER-0001",
      "JAI-PROJ-JAI-NEXUS-DEV-VERIFIER-0002",
      "JAI-PROJ-JAI-NEXUS-AUDIT-RISK-0005",
    ],
    rationale: "Development changes need Builder, Verifier, Challenger/Audit pressure, and rollback-aware review before any future gated path.",
    requiredReviews: ["Verifier review", "Challenger dissent review", "Audit boundary review"],
    requiredGates: ["future repo gate", "future execution gate"],
    blockedCapabilities: ["GitHub API", "repo mutation", "file mutation", "branch/PR automation", "Agent execution"],
    safeAlternatives: ["read-only display", "compose-only draft", "manual handoff"],
    missingEvidence: ["accepted Agent read-only surface", "accepted .jai profiles", "receipt design"],
    sourcePosture: "static/read-only recommendation example",
    operatorReviewRequired: true,
    controlThreadAcceptanceRequired: true,
    statusLabels: [...standardLabels, ...boundaryLabels],
    status: standardStatus,
    primaryDomainEngine: "JAI::DEV",
  },
  {
    recommendationId: "PAL-AGENT-SET-JAI-NEXUS-PRODUCT-0002",
    projectId: "JAI_NEXUS",
    displayName: "jai.nexus customer/product Agent set",
    scope: "Product context, customer boundary, and Palette/Grid posture",
    recommendedCandidates: [
      "JAI-PROJ-JAI-NEXUS-PALETTE-CURATOR-0003",
      "JAI-PROJ-JAI-NEXUS-AUDIT-RISK-0005",
    ],
    rationale: "Product context should be curated with privacy/security review before any customer-adjacent work is considered.",
    requiredReviews: ["Privacy Boundary Reviewer", "Safety Guard", "Audit review"],
    requiredGates: ["future privacy gate", "future customer-data gate"],
    blockedCapabilities: ["customer-data handling", "hidden persistence", "automatic context injection"],
    safeAlternatives: ["labeled context packet", "blocked customer-data note", "manual review"],
    missingEvidence: ["customer-data policy", "privacy boundary receipt", "project context freshness"],
    sourcePosture: "static/read-only recommendation example",
    operatorReviewRequired: true,
    controlThreadAcceptanceRequired: true,
    statusLabels: [...standardLabels, ...boundaryLabels],
    status: standardStatus,
    primaryDomainEngine: "JAI::CUSTOMER",
  },
  {
    recommendationId: "PAL-AGENT-SET-JAI-FORMAT-0003",
    projectId: "JAI_NEXUS",
    displayName: "jai-format .jai/profile Agent set",
    scope: ".jai profile, schema, compatibility, and examples",
    recommendedCandidates: ["JAI-PROJ-JAI-NEXUS-FORMAT-DESIGNER-0004"],
    rationale: "Profile design should proceed from doctrine to schema review before any parser/runtime path exists.",
    requiredReviews: ["Schema Reviewer", "Compatibility Guard", "Librarian"],
    requiredGates: ["future .jai profile acceptance gate"],
    blockedCapabilities: [".jai parser/runtime behavior", ".jai execution", "automatic profile validation"],
    safeAlternatives: ["profile draft", "schema review note", "example packet"],
    missingEvidence: ["JAI_CORE_OBJECT_MODEL_V0 acceptance", "agent-role-template/v0 profile"],
    sourcePosture: "static/read-only recommendation example",
    operatorReviewRequired: true,
    controlThreadAcceptanceRequired: true,
    statusLabels: [...standardLabels, ...boundaryLabels],
    status: standardStatus,
    primaryDomainEngine: "JAI::FORMAT",
  },
  {
    recommendationId: "PAL-AGENT-SET-AUDIT-SECURITY-0004",
    projectId: "JAI_NEXUS",
    displayName: "audit/security review Agent set",
    scope: "Security gate, abuse-case, privacy, and audit boundary review",
    recommendedCandidates: ["JAI-PROJ-JAI-NEXUS-AUDIT-RISK-0005"],
    rationale: "High-risk and gate-adjacent routes require security and audit evidence before any future progression.",
    requiredReviews: ["Gate Reviewer", "Abuse Case Reviewer", "Privacy Boundary Reviewer", "Auditor"],
    requiredGates: ["future security gate", "future audit receipt gate"],
    blockedCapabilities: ["gate opening", "policy enforcement", "auth/session changes", "customer-data handling"],
    safeAlternatives: ["blocked-class matrix", "risk register", "manual CONTROL_THREAD review"],
    missingEvidence: ["security gate design", "abuse-case review", "privacy review"],
    sourcePosture: "static/read-only recommendation example",
    operatorReviewRequired: true,
    controlThreadAcceptanceRequired: true,
    statusLabels: [...standardLabels, ...boundaryLabels],
    status: standardStatus,
    primaryDomainEngine: "JAI::SECURITY",
  },
  {
    recommendationId: "PAL-AGENT-SET-RUNTIME-BLOCKED-0005",
    projectId: "JAI_NEXUS",
    displayName: "high-risk runtime/jai-pilot blocked Agent set",
    scope: "Runtime, browser/desktop, and executor-candidate posture",
    recommendedCandidates: ["JAI-PROJ-JAI-NEXUS-RUNTIME-EXEC-CANDIDATE-0006"],
    rationale: "Runtime and pilot surfaces are represented only to preserve blockers and future gate requirements.",
    requiredReviews: ["Security Gate Reviewer", "Authority Boundary Reviewer", "Rollback Planner"],
    requiredGates: ["future security gate", "future execution gate", "future tool gate"],
    blockedCapabilities: ["runtime activation", "browser/desktop control", "terminal execution", "Agent dispatch", "tool invocation"],
    safeAlternatives: ["blocked future capability note", "rollback requirement", "risk handoff"],
    missingEvidence: ["execution gate design", "tool gate design", "runtime audit", "rollback plan"],
    sourcePosture: "static/read-only blocked recommendation example",
    operatorReviewRequired: true,
    controlThreadAcceptanceRequired: true,
    statusLabels: [...standardLabels, ...boundaryLabels, "HIGH-RISK / FUTURE-GATED / NO EXECUTION"],
    status: standardStatus,
    primaryDomainEngine: "JAI::RUNTIME",
  },
] as const satisfies PaletteAgentRecommendation[];
