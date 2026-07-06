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
  SANDBOX_NEXUS_DRIFT_RISKS,
  SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING,
  SANDBOX_NEXUS_NEXT_ROUTE,
  SANDBOX_NEXUS_RELATIONSHIPS,
  SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER,
  SANDBOX_NEXUS_STATE_VOCABULARY,
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

function testNoRuntimeDispatchMutationImportDeploymentMetadata() {
  const serialized = JSON.stringify(
    {
      modules: SANDBOX_NEXUS_SURFACE_MODULES,
      gates: SANDBOX_NEXUS_BLOCKED_GATES,
      ladder: SANDBOX_NEXUS_SAFE_ACTIVATION_LADDER,
      risks: SANDBOX_NEXUS_DRIFT_RISKS,
      relationships: SANDBOX_NEXUS_RELATIONSHIPS,
      jaiPaletteDataWiring: SANDBOX_NEXUS_JAI_PALETTE_DATA_WIRING,
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
  testNoRuntimeDispatchMutationImportDeploymentMetadata();
}

run();
