import assert from "node:assert/strict";

import {
  JAI_PALETTE_ADVISORY_STATEMENT,
  JAI_PALETTE_AGENT_ACTIVATION_STATUSES,
  JAI_PALETTE_AGENT_REVIEW_STATUSES,
  JAI_PALETTE_BLOCKED_AUTHORITIES,
  JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
  JAI_SANDBOX_AGENT_CLASSES,
} from "../jaiPalette/sandboxAgentDraft";
import {
  SANDBOX_NEXUS_BLOCKED_GATES,
  SANDBOX_NEXUS_BOUNDARY_COPY,
  SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY,
  SANDBOX_NEXUS_DRIFT_RISKS,
  SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY,
  SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING,
  SANDBOX_NEXUS_NEXT_ROUTE,
  SANDBOX_NEXUS_RELATIONSHIPS,
  SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER,
  SANDBOX_NEXUS_STATE_VOCABULARY,
  SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY,
  SANDBOX_NEXUS_SURFACE_MODULES,
  SANDBOX_NEXUS_SURFACE_POSTURE,
} from "./sandboxNexusSurface";

function assertIncludesAll(source: string, expected: string[]) {
  for (const value of expected) {
    assert.ok(source.includes(value), `Expected source to include: ${value}`);
  }
}

function assertExcludesAll(source: string, forbidden: string[]) {
  for (const value of forbidden) {
    assert.ok(!source.includes(value), `Expected source to exclude: ${value}`);
  }
}

function testRequiredModulesPresent() {
  assert.deepEqual(
    SANDBOX_NEXUS_SURFACE_MODULES.map((module) => module.module),
    [
      "Sandbox Overview",
      "JAI Palette Drafts",
      "Agent Coverage Map",
      "Fixture Intake",
      "Stress-Test Plan",
      "Closeout Review",
      "Blocked Gates",
      "Safe Activation Ladder",
      "Drift / Hallucination Control Panel",
      "Next Route Panel",
    ],
  );
}

function testStateVocabularyAndBoundaryCopy() {
  assert.deepEqual(
    SANDBOX_NEXUS_STATE_VOCABULARY.map((entry) => entry.state),
    [
      "drafted",
      "candidate",
      "reviewed",
      "accepted",
      "executable",
      "activated",
      "authoritative",
      "held",
      "blocked",
    ],
  );

  assertIncludesAll(
    SANDBOX_NEXUS_STATE_VOCABULARY.map((entry) => entry.boundary).join("\n"),
    [
      "drafted does not mean reviewed.",
      "candidate does not mean accepted.",
      "reviewed does not mean accepted.",
      "accepted does not mean executable.",
      "executable does not mean activated.",
      "activated does not mean authoritative.",
      "authoritative requires explicit CONTROL_THREAD authority.",
      "held means intentionally paused or not routed forward.",
      "blocked means not authorized under current gates.",
    ],
  );
}

function testBlockedGatesPresent() {
  assertIncludesAll(SANDBOX_NEXUS_BLOCKED_GATES.join("\n"), [
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
  ]);
}

function testSafeActivationLadderPresent() {
  assert.deepEqual(
    SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER.map((step) => step.name),
    [
      "Reference definition",
      "Static UI sketch",
      "App-local draft/export",
      "Fixture intake simulation",
      "Manual supervised dry run",
      "Boundary review",
      "Runtime readiness review",
      "Runtime activation",
      "Agent activation",
      "Production gate",
    ],
  );
  assert.equal(
    SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER[1].status,
    "current B15 display-only prototype",
  );
  assert.ok(
    SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER
      .slice(3)
      .some((step) => step.status === "blocked"),
  );
}

function testDriftRisksAndRelationshipsPresent() {
  assert.deepEqual(
    SANDBOX_NEXUS_DRIFT_RISKS.map((risk) => risk.riskClass),
    [
      "authority drift",
      "source-of-truth drift",
      "state vocabulary drift",
      "route drift",
      "repo/domain confusion",
      "agent capability overclaim",
      "sandbox runtime overclaim",
      "provider/model/API dispatch overclaim",
      "target-repo mutation overclaim",
      "accepted-code import overclaim",
      "deployment/production overclaim",
    ],
  );

  assertIncludesAll(
    SANDBOX_NEXUS_RELATIONSHIPS.map((relationship) => relationship.label).join("\n"),
    [
      "sandbox.nexus",
      "sandbox-nexus",
      "dev.jai.nexus",
      "JAI Palette draft coverage",
      "Fixture intake",
      "Stress-test plan",
      "Closeout review",
      "JAI::DEV::AGENTS",
      "JAI::SANDBOX::AGENTS",
    ],
  );
}

function testAuthorityAndBoundaryCopy() {
  const surfaceText = [
    SANDBOX_NEXUS_SURFACE_POSTURE.authority,
    SANDBOX_NEXUS_SURFACE_POSTURE.advisory,
    ...SANDBOX_NEXUS_BOUNDARY_COPY,
    SANDBOX_NEXUS_NEXT_ROUTE.title,
    SANDBOX_NEXUS_NEXT_ROUTE.posture,
  ].join("\n");

  assertIncludesAll(surfaceText, [
    "CONTROL_THREAD remains review/accept/hold authority.",
    JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
    JAI_PALETTE_ADVISORY_STATEMENT,
    "app-local, static, display-only, non-authoritative",
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
  ]);
}

function testJaiPaletteLocalStaticDataWiring() {
  assert.deepEqual(
    SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING.agentClassCoverage.map(
      (entry) => entry.agentClass,
    ),
    [...JAI_SANDBOX_AGENT_CLASSES],
  );
  assert.deepEqual(
    SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING.activationStatusMapping.map(
      (entry) => entry.jaiPaletteStatus,
    ),
    [...JAI_PALETTE_AGENT_ACTIVATION_STATUSES],
  );
  assert.deepEqual(
    SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING.reviewStatusMapping.map(
      (entry) => entry.jaiPaletteStatus,
    ),
    [...JAI_PALETTE_AGENT_REVIEW_STATUSES],
  );
  assert.deepEqual(
    SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING.blockedAuthoritySource,
    [...JAI_PALETTE_BLOCKED_AUTHORITIES],
  );
  assert.equal(
    SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING.authority,
    JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
  );
  assert.equal(
    SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING.advisory,
    JAI_PALETTE_ADVISORY_STATEMENT,
  );
  assertIncludesAll(
    JSON.stringify(SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING, null, 2),
    [
      "Candidate metadata only; no executable agent runtime.",
      "Route-packet compatibility does not imply route execution.",
      "Fixture compatibility does not imply runtime activation.",
      "Fixture compatibility does not imply sandbox task execution.",
      "Fixture compatibility does not imply target-repo mutation or accepted-code import.",
      "reviewed does not mean CONTROL_THREAD accepted.",
    ],
  );
}

function testFixtureIntakeDisplayCoverage() {
  assert.ok(SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.fixtureId.length > 0);
  assert.ok(SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.fixtureName.length > 0);
  assert.ok(SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.fixtureCategory.length > 0);
  assert.ok(SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.sourcePacketPosture.length > 0);
  assert.ok(
    SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.expectedInputFields.length > 0,
  );
  assert.ok(
    SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.rejectedFieldCategories.length > 0,
  );
  assert.ok(
    SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.blockedFieldCategories.length > 0,
  );
  assert.ok(
    SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.simulatedIntakeStatus.length > 0,
  );
  assert.ok(SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.guardrailStatus.length > 0);
  assert.ok(
    SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY.advisoryOnlyCloseoutRelationship
      .length > 0,
  );

  const serialized = JSON.stringify(SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY);
  assertIncludesAll(serialized, [
    "packet id",
    "guardrails",
    "non-authorizations",
    "secrets or credentials",
    "provider keys",
    "runtime activation fields",
    "sandbox task fields",
    "Fixture intake display does not execute sandbox work.",
    "Fixture intake display does not automatically ingest route packets.",
    "Route-packet compatibility does not imply route execution.",
    "Fixture intake display does not execute fixtures.",
    "Fixture intake display does not transfer source-of-truth authority.",
    "Local-static candidate/display metadata only",
  ]);
}

function testStressTestPlanDisplayCoverage() {
  assert.ok(SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY.stressTestId.length > 0);
  assert.ok(SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY.stressTestName.length > 0);
  assert.ok(SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY.riskClass.length > 0);
  assert.ok(
    SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY.scenarioDescription.length > 0,
  );
  assert.ok(
    SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY.evidenceRequirement.length > 0,
  );
  assert.ok(SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY.holdBlockTrigger.length > 0);
  assert.ok(
    SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY.controlThreadDecisionRequirement
      .length > 0,
  );
  assert.ok(
    SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY.expectedAdvisoryOutput.length > 0,
  );

  const serialized = JSON.stringify(SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY);
  assertIncludesAll(serialized, [
    "Stress-test plan display does not create an executable runner.",
    "Stress-test plan display does not activate sandbox runtime.",
    "Stress-test plan display does not execute sandbox tasks.",
    "Stress-test plan display does not execute stress tests.",
    "Stress-test plan display does not dispatch to providers, models, or APIs.",
    "Stress-test plan display does not claim production readiness.",
    "CONTROL_THREAD must review, accept, hold, or block",
    "Advisory stress observation",
    "Local-static candidate/display metadata only",
  ]);
}

function testCloseoutReviewDisplayCoverage() {
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.closeoutId.length > 0);
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.closeoutName.length > 0);
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.sourcePacketId.length > 0);
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.intakeStatus.length > 0);
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.acceptedFields.length > 0);
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.rejectedFields.length > 0);
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.blockedFields.length > 0);
  assert.ok(
    SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.simulatedActionSummary.length > 0,
  );
  assert.ok(
    SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.outputArtifactReferences.length > 0,
  );
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.guardrailFindings.length > 0);
  assert.ok(
    SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.nonAuthorizationsPreserved.length > 0,
  );
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.blockers.length > 0);
  assert.ok(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.recommendation.length > 0);
  assert.ok(
    SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.controlThreadReviewStatusPlaceholder
      .length > 0,
  );
  assert.ok(
    SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY.advisoryNonAuthoritativePosture
      .length > 0,
  );

  const serialized = JSON.stringify(SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY);
  assertIncludesAll(serialized, [
    "Closeout review display does not generate closeouts.",
    "Closeout review display does not create acceptance authority.",
    "Closeout review display does not create route authority.",
    "Closeout review display does not create activation authority.",
    "Closeout review display does not create executable authority.",
    "Closeout review display does not create source-of-truth authority.",
    "Closeout review display does not create production authority.",
    "No fixture execution.",
    "No stress-test execution.",
    "No closeout generation.",
    "No sandbox-nexus call.",
    "No automatic sync.",
    "No provider/model/API dispatch.",
    "No source-of-truth transfer.",
    "Closeout review display is advisory, non-authoritative, and candidate metadata only.",
    "pending CONTROL_THREAD review / accept / hold decision",
  ]);
}

function testFixtureStressCloseoutCandidateMetadataOnly() {
  const serialized = JSON.stringify(
    {
      fixture: SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY,
      stress: SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY,
      closeout: SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY,
    },
    null,
    2,
  );

  assertIncludesAll(serialized, [
    "Local-static candidate/display metadata only",
    "not accepted source",
    "executable task",
    "runtime state",
    "activation state",
    "production state",
    "authoritative source-of-truth state",
  ]);
  assertExcludesAll(serialized, [
    "allowedExecution",
    "allowedRuntime",
    "allowedDispatch",
    "allowedMutation",
    "allowedImport",
    "allowedDeployment",
    "allowedProduction",
    "acceptedSource: true",
    "runtimeState: active",
    "activationState: active",
  ]);
}

function testNoRuntimeDispatchMutationImportDeploymentMetadata() {
  const serialized = JSON.stringify(
    {
      modules: SANDBOX_NEXUS_SURFACE_MODULES,
      gates: SANDBOX_NEXUS_BLOCKED_GATES,
      ladder: SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER,
      risks: SANDBOX_NEXUS_DRIFT_RISKS,
      relationships: SANDBOX_NEXUS_RELATIONSHIPS,
      jaiPaletteDataWiring: SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING,
      fixtureIntake: SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY,
      stressTestPlan: SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY,
      closeoutReview: SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY,
      nextRoute: SANDBOX_NEXUS_NEXT_ROUTE,
    },
    null,
    2,
  );

  assertExcludesAll(serialized, [
    "sendEndpoint",
    "dispatchEndpoint",
    "runtimeEndpoint",
    "webhookUrl",
    "apiKey",
    "providerKey",
    "githubToken",
    "octokit",
    "fetch(",
    "axios",
    "setInterval",
    "setTimeout",
    "createPullRequest",
    "deployCommand",
    "dnsRecord",
  ]);
}

function run() {
  testRequiredModulesPresent();
  testStateVocabularyAndBoundaryCopy();
  testBlockedGatesPresent();
  testSafeActivationLadderPresent();
  testDriftRisksAndRelationshipsPresent();
  testAuthorityAndBoundaryCopy();
  testJaiPaletteLocalStaticDataWiring();
  testFixtureIntakeDisplayCoverage();
  testStressTestPlanDisplayCoverage();
  testCloseoutReviewDisplayCoverage();
  testFixtureStressCloseoutCandidateMetadataOnly();
  testNoRuntimeDispatchMutationImportDeploymentMetadata();
}

run();
