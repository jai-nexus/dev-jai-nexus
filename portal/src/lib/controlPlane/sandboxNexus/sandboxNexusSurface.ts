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
  "deployment",
  "live domain activation",
  "sandbox runtime activation",
  "sandbox task execution",
  "executable runner",
  "automatic intake",
  "automatic route execution",
  "provider/model/API dispatch",
  "autonomous JAI Agent execution",
  "target-repo mutation",
  "target-repo import",
  "accepted-code import",
  "GitHub automation",
  "PR automation",
  "production gates",
  "source-of-truth transfer",
  "hidden/background automation",
] as const;

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

export const SANDBOX_NEXUS_NEXT_ROUTE = {
  lane: "B16",
  title: "sandbox.nexus Static Operator Surface Boundary Review v0",
  posture:
    "review-only; confirm display-only implementation and all blocked gates remain blocked",
} as const;
