export const JAI_SANDBOX_AGENT_CLASSES = [
  "JAI::SANDBOX::INTAKE_AGENT",
  "JAI::SANDBOX::FIXTURE_AGENT",
  "JAI::SANDBOX::GUARDRAIL_AGENT",
  "JAI::SANDBOX::CLOSEOUT_AGENT",
  "JAI::SANDBOX::STRESS_AGENT",
  "JAI::SANDBOX::MUTATION_RISK_AGENT",
  "JAI::SANDBOX::PROVIDER_RISK_AGENT",
  "JAI::SANDBOX::EVIDENCE_AGENT",
  "JAI::SANDBOX::COUNCIL_AGENT",
  "JAI::SANDBOX::ESCALATION_AGENT",
] as const;

export type JaiSandboxAgentClass = (typeof JAI_SANDBOX_AGENT_CLASSES)[number];

export const JAI_PALETTE_AGENT_ACTIVATION_STATUSES = [
  "draft",
  "candidate",
] as const;

export type JaiPaletteAgentActivationStatus =
  (typeof JAI_PALETTE_AGENT_ACTIVATION_STATUSES)[number];

export const JAI_PALETTE_AGENT_REVIEW_STATUSES = [
  "pending",
  "held",
  "reviewed",
] as const;

export type JaiPaletteAgentReviewStatus =
  (typeof JAI_PALETTE_AGENT_REVIEW_STATUSES)[number];

export interface JaiPaletteRoutePacketCompatibility {
  compatiblePacketSource: string;
  compatiblePacketPosture: string;
  expectedRoutePacketInputs: string[];
  expectedCloseoutOrEvidenceContribution: string;
  noRouteExecution: string;
  noSandboxRuntimeActivation: string;
  noJaiAgentActivation: string;
}

export interface JaiPaletteSandboxFixtureCompatibility {
  fixtureIntakeCompatibility: string;
  expectedFixtureScenarioRole: string;
  closeoutContribution: string;
  evidenceContribution: string;
  guardrailContribution: string;
  noRuntimeActivation: string;
  noSandboxTaskExecution: string;
  noMutationOrAcceptedCodeImport: string;
}

export interface JaiPaletteSandboxAgentDraftInput {
  agentId: string;
  agentName: string;
  agentClass: JaiSandboxAgentClass;
  sandboxDomain: string;
  purpose: string;
  coverageResponsibility: string;
  allowedInputs: string[];
  expectedOutputs: string[];
  requiredGuardrails: string[];
  blockedAuthorities: string[];
  routePacketCompatibility: JaiPaletteRoutePacketCompatibility;
  sandboxNexusFixtureCompatibility: JaiPaletteSandboxFixtureCompatibility;
  closeoutContribution: string;
  activationStatus: JaiPaletteAgentActivationStatus;
  reviewStatus: JaiPaletteAgentReviewStatus;
  controlThreadAuthority: string;
  advisoryNonAuthoritative: string;
}

export interface JaiPaletteSandboxAgentDraft
  extends JaiPaletteSandboxAgentDraftInput {
  schemaVersion: "jai-palette-agent-draft.b11.v0";
  draftKind: "sandbox_agent_candidate";
  executableRuntime: "not_created";
}

export interface JaiSandboxAgentClassProfile {
  agentClass: JaiSandboxAgentClass;
  defaultName: string;
  sandboxDomain: string;
  purpose: string;
  coverageResponsibility: string;
  expectedFixtureScenarioRole: string;
  closeoutContribution: string;
}

export const JAI_PALETTE_CONTROL_THREAD_AUTHORITY =
  "CONTROL_THREAD remains the review, accept, and hold authority for JAI Palette sandbox agent drafts.";

export const JAI_PALETTE_ADVISORY_STATEMENT =
  "JAI Palette drafts are app-local, non-authoritative candidate metadata only.";

export const JAI_PALETTE_BLOCKED_AUTHORITIES = [
  "No executable agent runtime.",
  "No autonomous execution.",
  "No provider/model/API dispatch.",
  "No sandbox runtime activation.",
  "No sandbox task execution.",
  "No target-repo mutation.",
  "No target-repo import.",
  "No accepted-code import.",
  "No GitHub automation.",
  "No PR automation.",
  "No deployment.",
  "No production gate opening.",
  "No source-of-truth transfer.",
  "No hidden/background automation.",
] as const;

export const JAI_SANDBOX_AGENT_CLASS_PROFILES: Record<
  JaiSandboxAgentClass,
  JaiSandboxAgentClassProfile
> = {
  "JAI::SANDBOX::INTAKE_AGENT": {
    agentClass: "JAI::SANDBOX::INTAKE_AGENT",
    defaultName: "Sandbox Intake Agent Candidate",
    sandboxDomain: "route-packet intake",
    purpose: "Draft intake coverage for manually exported route packets.",
    coverageResponsibility:
      "Check packet completeness, manual handoff posture, and expected intake fields.",
    expectedFixtureScenarioRole:
      "Review whether a fixture can be formed from B5 route-packet fields.",
    closeoutContribution: "Intake completeness finding and missing-field list.",
  },
  "JAI::SANDBOX::FIXTURE_AGENT": {
    agentClass: "JAI::SANDBOX::FIXTURE_AGENT",
    defaultName: "Sandbox Fixture Agent Candidate",
    sandboxDomain: "fixture scenario interpretation",
    purpose: "Draft fixture scenario coverage for sandbox-nexus planning.",
    coverageResponsibility:
      "Map route packets to fixture scenarios and expected fixture inputs.",
    expectedFixtureScenarioRole:
      "Propose fixture shape without executing sandbox tasks.",
    closeoutContribution: "Fixture readiness summary and gap list.",
  },
  "JAI::SANDBOX::GUARDRAIL_AGENT": {
    agentClass: "JAI::SANDBOX::GUARDRAIL_AGENT",
    defaultName: "Sandbox Guardrail Agent Candidate",
    sandboxDomain: "guardrail review",
    purpose: "Draft guardrail review coverage for sandbox fixture planning.",
    coverageResponsibility:
      "Compare packet guardrails and non-authorizations against blocked authorities.",
    expectedFixtureScenarioRole:
      "Ensure fixture scenarios preserve required blocked authorities.",
    closeoutContribution: "Guardrail pass/hold finding.",
  },
  "JAI::SANDBOX::CLOSEOUT_AGENT": {
    agentClass: "JAI::SANDBOX::CLOSEOUT_AGENT",
    defaultName: "Sandbox Closeout Agent Candidate",
    sandboxDomain: "closeout construction",
    purpose: "Draft closeout structure coverage for supervised sandbox proof.",
    coverageResponsibility:
      "Map requested actions and expected outputs to structured closeout fields.",
    expectedFixtureScenarioRole:
      "Prepare fixture-compatible closeout expectations.",
    closeoutContribution: "Structured closeout outline.",
  },
  "JAI::SANDBOX::STRESS_AGENT": {
    agentClass: "JAI::SANDBOX::STRESS_AGENT",
    defaultName: "Sandbox Stress Agent Candidate",
    sandboxDomain: "stress-test observation",
    purpose: "Draft observation coverage for supervised stress-test scenarios.",
    coverageResponsibility:
      "Identify stress conditions, observed outputs, and manual hold points.",
    expectedFixtureScenarioRole:
      "Define observation fields for future dry-run fixtures.",
    closeoutContribution: "Stress observations and hold recommendations.",
  },
  "JAI::SANDBOX::MUTATION_RISK_AGENT": {
    agentClass: "JAI::SANDBOX::MUTATION_RISK_AGENT",
    defaultName: "Sandbox Mutation Risk Agent Candidate",
    sandboxDomain: "mutation-risk detection",
    purpose: "Draft target-repo mutation and import risk coverage.",
    coverageResponsibility:
      "Detect target-repo mutation, target-repo import, accepted-code import, and deployment risk.",
    expectedFixtureScenarioRole:
      "Ensure fixture scenarios do not imply mutation or import authority.",
    closeoutContribution: "Mutation-risk finding.",
  },
  "JAI::SANDBOX::PROVIDER_RISK_AGENT": {
    agentClass: "JAI::SANDBOX::PROVIDER_RISK_AGENT",
    defaultName: "Sandbox Provider Risk Agent Candidate",
    sandboxDomain: "provider/model/API-dispatch risk detection",
    purpose: "Draft provider/model/API dispatch risk coverage.",
    coverageResponsibility:
      "Detect provider/model/API dispatch risk and credential risk.",
    expectedFixtureScenarioRole:
      "Ensure fixtures do not require provider/model/API calls.",
    closeoutContribution: "Provider/model/API dispatch-risk finding.",
  },
  "JAI::SANDBOX::EVIDENCE_AGENT": {
    agentClass: "JAI::SANDBOX::EVIDENCE_AGENT",
    defaultName: "Sandbox Evidence Agent Candidate",
    sandboxDomain: "evidence capture and traceability",
    purpose: "Draft evidence reference and traceability coverage.",
    coverageResponsibility:
      "Track packet evidence references, fixture evidence, and closeout evidence.",
    expectedFixtureScenarioRole:
      "Map fixture evidence to non-secret references.",
    closeoutContribution: "Evidence traceability section.",
  },
  "JAI::SANDBOX::COUNCIL_AGENT": {
    agentClass: "JAI::SANDBOX::COUNCIL_AGENT",
    defaultName: "Sandbox Council Agent Candidate",
    sandboxDomain: "council-style review synthesis",
    purpose: "Draft advisory synthesis coverage across sandbox class findings.",
    coverageResponsibility:
      "Combine class findings into advisory review synthesis.",
    expectedFixtureScenarioRole:
      "Synthesize fixture and closeout findings.",
    closeoutContribution: "Advisory proceed/hold synthesis.",
  },
  "JAI::SANDBOX::ESCALATION_AGENT": {
    agentClass: "JAI::SANDBOX::ESCALATION_AGENT",
    defaultName: "Sandbox Escalation Agent Candidate",
    sandboxDomain: "escalation and hold recommendation",
    purpose: "Draft escalation and hold coverage for CONTROL_THREAD review.",
    coverageResponsibility:
      "Identify blockers requiring CONTROL_THREAD review, hold, or future route.",
    expectedFixtureScenarioRole:
      "Flag fixture gaps requiring separate routing.",
    closeoutContribution: "Escalation or hold recommendation.",
  },
};

export function buildJaiPaletteSandboxAgentDraft(
  input: JaiPaletteSandboxAgentDraftInput,
): JaiPaletteSandboxAgentDraft {
  return {
    ...input,
    allowedInputs: cleanList(input.allowedInputs),
    expectedOutputs: cleanList(input.expectedOutputs),
    requiredGuardrails: cleanList(input.requiredGuardrails),
    blockedAuthorities: cleanList(input.blockedAuthorities),
    schemaVersion: "jai-palette-agent-draft.b11.v0",
    draftKind: "sandbox_agent_candidate",
    executableRuntime: "not_created",
  };
}

export function createDefaultJaiPaletteSandboxAgentDraftInput(
  agentClass: JaiSandboxAgentClass,
): JaiPaletteSandboxAgentDraftInput {
  const profile = JAI_SANDBOX_AGENT_CLASS_PROFILES[agentClass];

  return {
    agentId: agentClass.toLowerCase().replace(/::/g, "-").replace(/_/g, "-"),
    agentName: profile.defaultName,
    agentClass,
    sandboxDomain: profile.sandboxDomain,
    purpose: profile.purpose,
    coverageResponsibility: profile.coverageResponsibility,
    allowedInputs: [
      "B5 manual route-packet export",
      "non-secret evidence references",
      "sandbox-nexus fixture planning fields",
    ],
    expectedOutputs: [
      profile.closeoutContribution,
      "advisory finding for CONTROL_THREAD review",
    ],
    requiredGuardrails: [
      "Keep the draft app-local and non-authoritative.",
      "Use route-packet references only; do not require automatic route execution.",
      "Preserve all blocked authorities.",
    ],
    blockedAuthorities: [...JAI_PALETTE_BLOCKED_AUTHORITIES],
    routePacketCompatibility: {
      compatiblePacketSource: "dev-jai-nexus manual route-packet export",
      compatiblePacketPosture:
        "app-local / non-authoritative / manual handoff",
      expectedRoutePacketInputs: [
        "packet id",
        "scope",
        "purpose",
        "requested action",
        "expected output shape",
        "evidence references",
        "guardrails",
        "non-authorizations",
      ],
      expectedCloseoutOrEvidenceContribution: profile.closeoutContribution,
      noRouteExecution:
        "Route-packet compatibility does not imply route execution.",
      noSandboxRuntimeActivation:
        "Route-packet compatibility does not imply sandbox runtime activation.",
      noJaiAgentActivation:
        "Route-packet compatibility does not imply JAI Agent activation.",
    },
    sandboxNexusFixtureCompatibility: {
      fixtureIntakeCompatibility:
        "fixture/manual intake compatibility only unless separately routed",
      expectedFixtureScenarioRole: profile.expectedFixtureScenarioRole,
      closeoutContribution: profile.closeoutContribution,
      evidenceContribution:
        "Preserve non-secret evidence references for fixture review.",
      guardrailContribution:
        "Preserve blocked authorities in fixture planning.",
      noRuntimeActivation:
        "Fixture compatibility does not imply runtime activation.",
      noSandboxTaskExecution:
        "Fixture compatibility does not imply sandbox task execution.",
      noMutationOrAcceptedCodeImport:
        "Fixture compatibility does not imply target-repo mutation or accepted-code import.",
    },
    closeoutContribution: profile.closeoutContribution,
    activationStatus: "draft",
    reviewStatus: "pending",
    controlThreadAuthority: JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
    advisoryNonAuthoritative: JAI_PALETTE_ADVISORY_STATEMENT,
  };
}

export function buildJaiPaletteSandboxAgentDraftJson(
  draft: JaiPaletteSandboxAgentDraft,
): string {
  return JSON.stringify(draft, null, 2);
}

export function buildJaiPaletteSandboxAgentDraftMarkdown(
  draft: JaiPaletteSandboxAgentDraft,
): string {
  return [
    `# ${draft.agentName}`,
    "",
    "## Candidate",
    "",
    `- Agent id: ${draft.agentId}`,
    `- Agent class: ${draft.agentClass}`,
    `- Sandbox domain: ${draft.sandboxDomain}`,
    `- Activation status: ${draft.activationStatus}`,
    `- Review status: ${draft.reviewStatus}`,
    `- Executable runtime: ${draft.executableRuntime}`,
    "",
    "## Purpose",
    "",
    draft.purpose,
    "",
    "## Coverage Responsibility",
    "",
    draft.coverageResponsibility,
    "",
    "## Allowed Inputs",
    "",
    listMarkdown(draft.allowedInputs),
    "",
    "## Expected Outputs",
    "",
    listMarkdown(draft.expectedOutputs),
    "",
    "## Required Guardrails",
    "",
    listMarkdown(draft.requiredGuardrails),
    "",
    "## Route-Packet Compatibility",
    "",
    `- Source: ${draft.routePacketCompatibility.compatiblePacketSource}`,
    `- Posture: ${draft.routePacketCompatibility.compatiblePacketPosture}`,
    `- Contribution: ${draft.routePacketCompatibility.expectedCloseoutOrEvidenceContribution}`,
    `- ${draft.routePacketCompatibility.noRouteExecution}`,
    `- ${draft.routePacketCompatibility.noSandboxRuntimeActivation}`,
    `- ${draft.routePacketCompatibility.noJaiAgentActivation}`,
    "",
    "## Sandbox-Nexus Fixture Compatibility",
    "",
    `- Intake: ${draft.sandboxNexusFixtureCompatibility.fixtureIntakeCompatibility}`,
    `- Scenario role: ${draft.sandboxNexusFixtureCompatibility.expectedFixtureScenarioRole}`,
    `- Closeout: ${draft.sandboxNexusFixtureCompatibility.closeoutContribution}`,
    `- Evidence: ${draft.sandboxNexusFixtureCompatibility.evidenceContribution}`,
    `- Guardrail: ${draft.sandboxNexusFixtureCompatibility.guardrailContribution}`,
    `- ${draft.sandboxNexusFixtureCompatibility.noRuntimeActivation}`,
    `- ${draft.sandboxNexusFixtureCompatibility.noSandboxTaskExecution}`,
    `- ${draft.sandboxNexusFixtureCompatibility.noMutationOrAcceptedCodeImport}`,
    "",
    "## Blocked Authorities",
    "",
    listMarkdown(draft.blockedAuthorities),
    "",
    "## Authority",
    "",
    draft.controlThreadAuthority,
    "",
    "## Advisory / Non-Authoritative Posture",
    "",
    draft.advisoryNonAuthoritative,
  ].join("\n");
}

function cleanList(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

function listMarkdown(values: string[]): string {
  return values.length ? values.map((value) => `- ${value}`).join("\n") : "- None";
}
