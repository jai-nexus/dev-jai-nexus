import {
  createDefaultJaiPaletteSandboxAgentDraftInput,
  JAI_PALETTE_ADVISORY_STATEMENT,
  JAI_PALETTE_AGENT_ACTIVATION_STATUSES,
  JAI_PALETTE_AGENT_REVIEW_STATUSES,
  JAI_PALETTE_BLOCKED_AUTHORITIES,
  JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
  JAI_SANDBOX_AGENT_CLASSES,
  JAI_SANDBOX_AGENT_CLASS_PROFILES,
} from "../jaiPalette/sandboxAgentDraft";

type JaiPaletteBlockedAuthority = (typeof JAI_PALETTE_BLOCKED_AUTHORITIES)[number];

function blockedGateFromJaiPaletteAuthority(
  authority: JaiPaletteBlockedAuthority,
): string | null {
  switch (authority) {
    case "No executable agent runtime.":
      return "executable runner";
    case "No autonomous execution.":
      return "autonomous JAI Agent execution";
    case "No provider/model/API dispatch.":
      return "provider/model/API dispatch";
    case "No sandbox runtime activation.":
      return "sandbox runtime activation";
    case "No sandbox task execution.":
      return "sandbox task execution";
    case "No target-repo mutation.":
      return "target-repo mutation";
    case "No target-repo import.":
      return "target-repo import";
    case "No accepted-code import.":
      return "accepted-code import";
    case "No GitHub automation.":
      return "GitHub automation";
    case "No PR automation.":
      return "PR automation";
    case "No deployment.":
      return "deployment";
    case "No production gate opening.":
      return "production gates";
    case "No source-of-truth transfer.":
      return "source-of-truth transfer";
    case "No hidden/background automation.":
      return "hidden/background automation";
    default:
      return null;
  }
}

const JAI_PALETTE_INTAKE_AGENT_DRAFT_INPUT =
  createDefaultJaiPaletteSandboxAgentDraftInput("JAI::SANDBOX::INTAKE_AGENT");

export const SANDBOX_NEXUS_SURFACE_POSTURE = {
  surfaceName: "sandbox.nexus",
  productDefinition:
    "sandbox.nexus is the experimental product/domain concept for drafting, staging, stress-testing, reviewing, and closing out sandbox-bound agent coverage without live runtime authority.",
  repoRelationship:
    "sandbox-nexus is the repo/substrate source; B15 displays it as static cross-repo evidence only.",
  controlSurfaceRelationship:
    "dev.jai.nexus is the app-local control-plane surface where sandbox.nexus can be designed and inspected experimentally.",
  authority:
    "CONTROL_THREAD remains review/accept/hold authority.",
  advisory:
    "This sandbox.nexus surface is app-local, static, display-only, non-authoritative, experimental, advisory-output-only, human-supervised, and non-executing.",
} as const;

export const SANDBOX_NEXUS_BOUNDARY_COPY = [
  "This sandbox.nexus surface is app-local, static, display-only, and non-authoritative.",
  "It is experimental and advisory-output-only.",
  "CONTROL_THREAD remains review/accept/hold authority.",
  JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
  JAI_PALETTE_ADVISORY_STATEMENT,
  "No DNS change occurs.",
  "No deployment occurs.",
  "No live domain activation occurs.",
  "No sandbox runtime activation occurs.",
  "No sandbox task execution occurs.",
  "No executable runner exists.",
  "No autonomous JAI Agent execution occurs.",
  "No provider/model/API dispatch occurs.",
  "No target-repo mutation or import occurs.",
  "No accepted-code import occurs.",
  "No production gate is opened.",
  "No source-of-truth transfer occurs.",
  "No hidden/background automation is added.",
] as const;

export const SANDBOX_NEXUS_SURFACE_MODULES = [
  {
    module: "Sandbox Overview",
    purpose:
      "Summarize sandbox.nexus and its relationship to dev.jai.nexus, sandbox-nexus, and CONTROL_THREAD.",
    displayedState: "experimental / app-local / advisory-output-only",
    primaryRelationship:
      "dev.jai.nexus control surface inspecting the sandbox.nexus product concept.",
    boundary: "No DNS change, deployment, live domain activation, or runtime authority.",
  },
  {
    module: "JAI Palette Drafts",
    purpose: "Display JAI Palette sandbox agent candidate metadata.",
    displayedState: "drafted / candidate / reviewed / held / blocked",
    primaryRelationship:
      "B11 JAI Palette draft coverage and future B13 coverage-set evidence.",
    boundary: "Candidate metadata only; no executable agent runtime.",
  },
  {
    module: "Agent Coverage Map",
    purpose:
      "Show coverage across intake, fixture, guardrail, closeout, stress, mutation risk, provider risk, evidence, council, and escalation.",
    displayedState: "coverage planned / missing / held / blocked",
    primaryRelationship: "JAI::SANDBOX::AGENTS coverage planning.",
    boundary: "Coverage display is not activation.",
  },
  {
    module: "Fixture Intake",
    purpose: "Display fixture/manual intake readiness before runtime exists.",
    displayedState: "fixture candidate / evidence needed / blocked gates",
    primaryRelationship:
      "B5 route-packet compatibility and sandbox-nexus static fixture substrate.",
    boundary: "No automatic intake and no sandbox task execution.",
  },
  {
    module: "Stress-Test Plan",
    purpose: "Stage supervised stress-test planning state.",
    displayedState: "drafted plan / reviewed plan / held / blocked",
    primaryRelationship:
      "Static stress-test scenario planning for future supervised dry run.",
    boundary: "No live sandbox runtime and no executable runner.",
  },
  {
    module: "Closeout Review",
    purpose: "Display expected advisory closeout shapes and evidence needs.",
    displayedState: "closeout draft / evidence needed / CONTROL_THREAD review needed",
    primaryRelationship: "JAI Palette closeout contribution and sandbox-nexus closeout shape.",
    boundary: "Closeout display is not CONTROL_THREAD acceptance.",
  },
  {
    module: "Blocked Gates",
    purpose: "Make every blocked authority visible.",
    displayedState: "blocked",
    primaryRelationship: "B14 blocked-gate model.",
    boundary: "Blocked gates remain blocked until separate CONTROL_THREAD authority.",
  },
  {
    module: "Safe Activation Ladder",
    purpose: "Display the progression from definition to production gate.",
    displayedState: "B15 static operator surface prototype",
    primaryRelationship: "B14 safe activation ladder.",
    boundary: "B15 does not advance to runtime readiness, activation, DNS, deployment, or production gates.",
  },
  {
    module: "Drift / Hallucination Control Panel",
    purpose: "Display authority, source-of-truth, vocabulary, route, repo/domain, capability, runtime, dispatch, mutation, import, deployment, and production overclaim risks.",
    displayedState: "risk visible / evidence required / hold or block trigger",
    primaryRelationship: "Drift control before runtime exists.",
    boundary: "Risk display is advisory and does not self-resolve.",
  },
  {
    module: "Next Route Panel",
    purpose: "Display B16 recommendation posture.",
    displayedState: "B16 boundary review recommended",
    primaryRelationship: "CONTROL_THREAD routing recommendation.",
    boundary: "Recommendation is not route authority.",
  },
] as const;

export const SANDBOX_NEXUS_STATE_VOCABULARY = [
  {
    state: "drafted",
    boundary: "drafted does not mean reviewed.",
  },
  {
    state: "candidate",
    boundary: "candidate does not mean accepted.",
  },
  {
    state: "reviewed",
    boundary: "reviewed does not mean accepted.",
  },
  {
    state: "accepted",
    boundary: "accepted does not mean executable.",
  },
  {
    state: "executable",
    boundary: "executable does not mean activated.",
  },
  {
    state: "activated",
    boundary: "activated does not mean authoritative.",
  },
  {
    state: "authoritative",
    boundary: "authoritative requires explicit CONTROL_THREAD authority.",
  },
  {
    state: "held",
    boundary: "held means intentionally paused or not routed forward.",
  },
  {
    state: "blocked",
    boundary: "blocked means not authorized under current gates.",
  },
] as const;

export const SANDBOX_NEXUS_BLOCKED_GATES = [
  "DNS change",
  "live domain activation",
  "automatic intake",
  "automatic route execution",
  ...JAI_PALETTE_BLOCKED_AUTHORITIES.map(blockedGateFromJaiPaletteAuthority).filter(
    (gate): gate is string => gate !== null,
  ),
];

export const SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER = [
  {
    step: 1,
    name: "Reference definition",
    status: "completed by B14",
  },
  {
    step: 2,
    name: "Static UI sketch",
    status: "current B15 display-only prototype",
  },
  {
    step: 3,
    name: "App-local draft/export",
    status: "future integration review required",
  },
  {
    step: 4,
    name: "Fixture intake simulation",
    status: "blocked",
  },
  {
    step: 5,
    name: "Manual supervised dry run",
    status: "blocked",
  },
  {
    step: 6,
    name: "Boundary review",
    status: "recommended next route",
  },
  {
    step: 7,
    name: "Runtime readiness review",
    status: "blocked",
  },
  {
    step: 8,
    name: "Runtime activation",
    status: "blocked",
  },
  {
    step: 9,
    name: "Agent activation",
    status: "blocked",
  },
  {
    step: 10,
    name: "Production gate",
    status: "blocked",
  },
] as const;

export const SANDBOX_NEXUS_DRIFT_RISKS = [
  {
    riskClass: "authority drift",
    meaning: "A label or state implies authority that has not been granted.",
    requiredEvidence: "Exact CONTROL_THREAD route or acceptance reference.",
    holdBlockTrigger:
      "Any copy implies acceptance, execution, activation, or authority without evidence.",
    controlThreadDecision: "Accept, revise, hold, or block.",
  },
  {
    riskClass: "source-of-truth drift",
    meaning: "A local or advisory artifact is treated as canonical.",
    requiredEvidence: "Explicit source-of-truth designation.",
    holdBlockTrigger: "App-local output is treated as source of truth.",
    controlThreadDecision: "Decide authority or require correction.",
  },
  {
    riskClass: "state vocabulary drift",
    meaning: "State labels collapse distinct authority boundaries.",
    requiredEvidence: "B14 state vocabulary mapping.",
    holdBlockTrigger:
      "Drafted, reviewed, accepted, executable, activated, or authoritative states are conflated.",
    controlThreadDecision: "Approve vocabulary change or hold.",
  },
  {
    riskClass: "route drift",
    meaning: "A surface implies an unrouted future lane is active.",
    requiredEvidence: "Current route artifact and branch evidence.",
    holdBlockTrigger: "Future route is displayed as active or accepted.",
    controlThreadDecision: "Route, hold, or reject.",
  },
  {
    riskClass: "repo/domain confusion",
    meaning:
      "sandbox-nexus, sandbox.nexus, and dev.jai.nexus are treated as interchangeable.",
    requiredEvidence: "Repo/product/control-surface framing evidence.",
    holdBlockTrigger:
      "Repo content is treated as live domain activation or control authority.",
    controlThreadDecision: "Clarify route framing.",
  },
  {
    riskClass: "agent capability overclaim",
    meaning: "Candidate agents are described as active or runnable.",
    requiredEvidence: "B10/B11/B12 evidence and executable-runtime evidence.",
    holdBlockTrigger: "Candidate is described as active, approved, live, or runnable.",
    controlThreadDecision: "Hold or route runtime review.",
  },
  {
    riskClass: "sandbox runtime overclaim",
    meaning: "The surface implies a live sandbox runtime exists.",
    requiredEvidence: "Runtime readiness or activation artifact.",
    holdBlockTrigger: "Surface implies live sandbox runtime.",
    controlThreadDecision: "Hold or route runtime readiness.",
  },
  {
    riskClass: "provider/model/API dispatch overclaim",
    meaning: "The surface implies providers, models, or APIs can be called.",
    requiredEvidence: "Dispatch authorization and credential boundary evidence.",
    holdBlockTrigger: "Any dispatch capability is implied without route authority.",
    controlThreadDecision: "Hold or route dispatch boundary review.",
  },
  {
    riskClass: "target-repo mutation overclaim",
    meaning: "The surface implies target repos can be mutated.",
    requiredEvidence: "Mutation authority and target-repo boundary evidence.",
    holdBlockTrigger: "Any write or import path is implied.",
    controlThreadDecision: "Hold or route mutation boundary review.",
  },
  {
    riskClass: "accepted-code import overclaim",
    meaning: "The surface implies accepted code can be imported.",
    requiredEvidence: "Explicit accepted-code import authority.",
    holdBlockTrigger: "Import is implied by closeout, coverage, or fixture status.",
    controlThreadDecision: "Hold or route import review.",
  },
  {
    riskClass: "deployment/production overclaim",
    meaning: "The surface implies deployment or production gates are available.",
    requiredEvidence: "Deployment or production gate authority.",
    holdBlockTrigger:
      "Surface implies deployability, production readiness, or gate opening.",
    controlThreadDecision: "Hold or route production gate review.",
  },
] as const;

export const SANDBOX_NEXUS_RELATIONSHIPS = [
  {
    label: "sandbox.nexus",
    display:
      "Experimental product/domain concept for sandbox-bound agent coverage planning.",
    boundary: "No DNS change, deployment, or live domain activation.",
  },
  {
    label: "sandbox-nexus",
    display: "Repo/substrate source with static .nexus evidence from B13.",
    boundary: "Static cross-repo evidence only; no automatic import.",
  },
  {
    label: "dev.jai.nexus",
    display: "Control-plane surface for designing and inspecting sandbox.nexus.",
    boundary: "App-local display only; not source of truth.",
  },
  {
    label: "JAI Palette draft coverage",
    display: "Candidate sandbox agent metadata from B11/B13.",
    boundary: "Candidate metadata only; no executable agents.",
  },
  {
    label: "Fixture intake",
    display: "Display/planning view of fixture readiness.",
    boundary: "No automatic intake and no sandbox task execution.",
  },
  {
    label: "Stress-test plan",
    display: "Display/planning view of future supervised stress-test evidence.",
    boundary: "No live sandbox runtime.",
  },
  {
    label: "Closeout review",
    display: "Display/planning view of advisory closeout shape.",
    boundary: "Not CONTROL_THREAD acceptance.",
  },
  {
    label: "JAI::DEV::AGENTS",
    display: "Future dev control-plane candidates only.",
    boundary: "Not drafted or activated by B15.",
  },
  {
    label: "JAI::SANDBOX::AGENTS",
    display: "Future sandbox candidates only.",
    boundary: "Draft/candidate/non-executing until separately activated.",
  },
] as const;

export const SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY = {
  fixtureId: "sandbox-nexus-fixture-intake-candidate-b21",
  fixtureName: "Fixture Intake Display Candidate",
  fixtureCategory: "fixture/manual intake",
  sourcePacketPosture:
    JAI_PALETTE_INTAKE_AGENT_DRAFT_INPUT.routePacketCompatibility
      .compatiblePacketPosture,
  expectedInputFields: [
    ...JAI_PALETTE_INTAKE_AGENT_DRAFT_INPUT.routePacketCompatibility
      .expectedRoutePacketInputs,
  ],
  rejectedFieldCategories: [
    "secrets or credentials",
    "endpoint URLs",
    "provider keys",
    "GitHub tokens",
    "deployment data",
    "DNS records",
  ],
  blockedFieldCategories: [
    "runtime activation fields",
    "sandbox task fields",
    "executable runner fields",
    "target-repo mutation or import fields",
    "accepted-code import fields",
    "production gate fields",
    "hidden/background automation fields",
  ],
  simulatedIntakeStatus: "candidate / evidence needed / blocked gates visible",
  guardrailStatus: "blocked authorities preserved for display review",
  advisoryOnlyCloseoutRelationship:
    JAI_PALETTE_INTAKE_AGENT_DRAFT_INPUT.sandboxNexusFixtureCompatibility
      .closeoutContribution,
  noSandboxExecution:
    "Fixture intake display does not execute sandbox work.",
  noAutomaticIntake:
    "Fixture intake display does not automatically ingest route packets.",
  noRouteExecution:
    JAI_PALETTE_INTAKE_AGENT_DRAFT_INPUT.routePacketCompatibility
      .noRouteExecution,
  noFixtureExecution:
    "Fixture intake display does not execute fixtures.",
  noSourceOfTruthTransfer:
    "Fixture intake display does not transfer source-of-truth authority.",
  posture:
    "Local-static candidate/display metadata only; not accepted source, executable task, runtime state, activation state, production state, or authoritative source-of-truth state.",
} as const;

export const SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY = {
  stressTestId: "sandbox-nexus-stress-test-plan-candidate-b21",
  stressTestName: "Stress-Test Plan Display Candidate",
  riskClass: "authority / runtime / dispatch / mutation / import / production drift",
  scenarioDescription:
    "Static supervised stress-test scenario planning for future CONTROL_THREAD review.",
  evidenceRequirement:
    "Non-secret fixture evidence references, guardrail findings, and route context references.",
  holdBlockTrigger:
    "Hold or block if copy implies execution, activation, dispatch, mutation, import, deployment, production readiness, or source-of-truth authority.",
  controlThreadDecisionRequirement:
    "CONTROL_THREAD must review, accept, hold, or block before any future route changes status.",
  expectedAdvisoryOutput:
    "Advisory stress observation and hold recommendation for CONTROL_THREAD review.",
  noExecutableRunner:
    "Stress-test plan display does not create an executable runner.",
  noRuntimeActivation:
    "Stress-test plan display does not activate sandbox runtime.",
  noSandboxTaskExecution:
    "Stress-test plan display does not execute sandbox tasks.",
  noStressTestExecution:
    "Stress-test plan display does not execute stress tests.",
  noProviderModelApiDispatch:
    "Stress-test plan display does not dispatch to providers, models, or APIs.",
  noProductionReadinessClaim:
    "Stress-test plan display does not claim production readiness.",
  posture:
    "Local-static candidate/display metadata only; not accepted source, executable task, runtime state, activation state, production state, or authoritative source-of-truth state.",
} as const;

export const SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY = {
  closeoutId: "sandbox-nexus-closeout-review-candidate-b21",
  closeoutName: "Closeout Review Display Candidate",
  sourcePacketId: "manual-route-packet-reference-only",
  intakeStatus: "candidate / evidence needed / CONTROL_THREAD review needed",
  acceptedFields: [
    "packet id",
    "scope",
    "purpose",
    "expected output shape",
    "non-secret evidence references",
    "guardrails",
    "non-authorizations",
  ],
  rejectedFields: [
    "secrets or credentials",
    "provider keys",
    "GitHub tokens",
    "runtime endpoints",
    "deployment credentials",
    "DNS records",
  ],
  blockedFields: [
    "fixture execution fields",
    "stress-test execution fields",
    "closeout generation fields",
    "runtime activation fields",
    "route authority fields",
    "source-of-truth authority fields",
    "production authority fields",
  ],
  simulatedActionSummary:
    "Static summary of candidate fixture, stress, and closeout review posture.",
  outputArtifactReferences: [
    "docs/reference/q3m7-sandbox-dot-nexus-fixture-stress-closeout-display-planning-v0.md",
    "docs/reviews/B19_SANDBOX_DOT_NEXUS_STATIC_OPERATOR_SURFACE_LOCAL_DATA_WIRING_BOUNDARY_REVIEW_V0.md",
  ],
  guardrailFindings:
    "Blocked authorities remain preserved and visible for CONTROL_THREAD review.",
  nonAuthorizationsPreserved: [
    "No fixture execution.",
    "No stress-test execution.",
    "No closeout generation.",
    "No external import.",
    "No sandbox-nexus call.",
    "No automatic sync.",
    "No runtime activation.",
    "No sandbox task execution.",
    "No executable runner.",
    "No provider/model/API dispatch.",
    "No target-repo mutation or import.",
    "No accepted-code import.",
    "No deployment.",
    "No production gate opening.",
    "No source-of-truth transfer.",
    "No hidden/background automation.",
  ],
  blockers: [
    "CONTROL_THREAD acceptance remains required.",
    "Runtime activation remains blocked.",
    "Execution and generation remain blocked.",
  ],
  recommendation:
    "Route a boundary review before any future runtime, execution, import, deployment, or production consideration.",
  controlThreadReviewStatusPlaceholder:
    "pending CONTROL_THREAD review / accept / hold decision",
  advisoryNonAuthoritativePosture:
    "Closeout review display is advisory, non-authoritative, and candidate metadata only.",
  noCloseoutGeneration:
    "Closeout review display does not generate closeouts.",
  noAcceptanceAuthority:
    "Closeout review display does not create acceptance authority.",
  noRouteAuthority:
    "Closeout review display does not create route authority.",
  noActivationAuthority:
    "Closeout review display does not create activation authority.",
  noExecutableAuthority:
    "Closeout review display does not create executable authority.",
  noSourceOfTruthAuthority:
    "Closeout review display does not create source-of-truth authority.",
  noProductionAuthority:
    "Closeout review display does not create production authority.",
  posture:
    "Local-static candidate/display metadata only; not accepted source, executable task, runtime state, activation state, production state, or authoritative source-of-truth state.",
} as const;

export const SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING = {
  agentClassCoverage: JAI_SANDBOX_AGENT_CLASSES.map((agentClass) => {
    const profile = JAI_SANDBOX_AGENT_CLASS_PROFILES[agentClass];

    return {
      agentClass,
      sandboxDomain: profile.sandboxDomain,
      coverageResponsibility: profile.coverageResponsibility,
      expectedFixtureScenarioRole: profile.expectedFixtureScenarioRole,
      closeoutContribution: profile.closeoutContribution,
      boundary: "Candidate metadata only; no executable agent runtime.",
    };
  }),
  activationStatusMapping: JAI_PALETTE_AGENT_ACTIVATION_STATUSES.map((status) => ({
    jaiPaletteStatus: status,
    sandboxNexusDisplayState: status === "draft" ? "drafted" : "candidate",
    boundary:
      status === "draft"
        ? "draft does not mean reviewed, accepted, executable, activated, or authoritative."
        : "candidate does not mean accepted, executable, activated, or authoritative.",
  })),
  reviewStatusMapping: JAI_PALETTE_AGENT_REVIEW_STATUSES.map((status) => ({
    jaiPaletteStatus: status,
    sandboxNexusDisplayState:
      status === "pending" ? "drafted" : status,
    boundary:
      status === "reviewed"
        ? "reviewed does not mean CONTROL_THREAD accepted."
        : "review status does not create execution or activation authority.",
  })),
  blockedAuthoritySource: [...JAI_PALETTE_BLOCKED_AUTHORITIES],
  routePacketCompatibilityPosture:
    JAI_PALETTE_INTAKE_AGENT_DRAFT_INPUT.routePacketCompatibility,
  sandboxNexusFixtureCompatibilityPosture:
    JAI_PALETTE_INTAKE_AGENT_DRAFT_INPUT.sandboxNexusFixtureCompatibility,
  authority: JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
  advisory: JAI_PALETTE_ADVISORY_STATEMENT,
} as const;

export const SANDBOX_NEXUS_NEXT_ROUTE = {
  lane: "B16",
  title: "sandbox.nexus Static Operator Surface Boundary Review v0",
  posture:
    "review-only; confirm display-only implementation and all blocked gates remain blocked",
} as const;
