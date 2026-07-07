import assert from "node:assert/strict";

import {
  buildSandboxPacketDraft,
  buildSandboxPacketDraftJson,
  buildSandboxPacketDraftMarkdown,
  createDefaultSandboxPacketDraft,
  SANDBOX_PACKET_ALLOWED_INPUT_BOUNDARY_COPY,
  SANDBOX_PACKET_ALLOWED_INPUT_CATEGORIES,
  SANDBOX_PACKET_BLOCKED_AUTHORITIES,
  SANDBOX_PACKET_CONTROL_SURFACE_POSTURE,
  SANDBOX_PACKET_CONTROL_THREAD_HANDOFF_COPY,
  SANDBOX_PACKET_EXPORT_LABELS,
  SANDBOX_PACKET_FIXTURE_OPTIONS,
  SANDBOX_PACKET_MOTION_OPTIONS,
  SANDBOX_PACKET_RECEIPT_POSTURE,
  SANDBOX_PACKET_ROLE_CLASS_OPTIONS,
} from "./sandboxPacketControlSurface";

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

function testSelectionOptionsExist() {
  assert.ok(SANDBOX_PACKET_MOTION_OPTIONS.length > 0);
  assert.ok(SANDBOX_PACKET_FIXTURE_OPTIONS.length > 0);
  assert.ok(SANDBOX_PACKET_ROLE_CLASS_OPTIONS.length > 0);

  const motion = SANDBOX_PACKET_MOTION_OPTIONS[0];
  assert.ok(motion.motionId.length > 0);
  assert.ok(motion.motionName.length > 0);
  assert.ok(motion.motionCategory.length > 0);
  assert.ok(motion.motionPurpose.length > 0);
  assert.ok(motion.requiredFixtureClass.length > 0);
  assert.ok(motion.requiredSandboxRoleClass.length > 0);
  assert.ok(motion.allowedInputCategories.length > 0);
  assert.ok(motion.blockedAuthorityCategories.length > 0);
  assert.ok(motion.draftExportEligibility.length > 0);
  assert.ok(motion.controlThreadReviewStatusPlaceholder.length > 0);

  const fixture = SANDBOX_PACKET_FIXTURE_OPTIONS[0];
  assert.ok(fixture.fixtureId.length > 0);
  assert.ok(fixture.fixtureName.length > 0);
  assert.ok(fixture.fixtureCategory.length > 0);
  assert.ok(fixture.sourcePacketPosture.length > 0);
  assert.ok(fixture.expectedInputFields.length > 0);
  assert.ok(fixture.rejectedFieldCategories.length > 0);
  assert.ok(fixture.blockedFieldCategories.length > 0);
  assert.ok(fixture.guardrailStatus.length > 0);
  assert.ok(fixture.compatibilityPosture.length > 0);
  assert.ok(fixture.noAutomaticIntakePosture.length > 0);
  assert.ok(fixture.noSandboxExecutionPosture.length > 0);
  assert.ok(fixture.noRouteExecutionPosture.length > 0);

  const roleClass = SANDBOX_PACKET_ROLE_CLASS_OPTIONS[0];
  assert.ok(roleClass.roleClassId.length > 0);
  assert.ok(roleClass.roleClassName.length > 0);
  assert.ok(roleClass.jaiRoleLabel.length > 0);
  assert.ok(roleClass.candidateResponsibility.length > 0);
  assert.ok(roleClass.allowedPacketFields.length > 0);
  assert.ok(roleClass.blockedPacketFields.length > 0);
  assert.ok(roleClass.authorityLimits.length > 0);
  assert.ok(roleClass.jaiPaletteRelationship.length > 0);
  assert.ok(roleClass.candidateMetadataOnlyPosture.length > 0);
  assert.ok(roleClass.noJaiAgentActivationPosture.length > 0);
  assert.ok(roleClass.noAutonomousExecutionPosture.length > 0);
}

function testAllowedInputsAndBlockedAuthorities() {
  assertIncludesAll(SANDBOX_PACKET_ALLOWED_INPUT_CATEGORIES.join("\n"), [
    "selected motion id",
    "selected fixture id",
    "selected role/class id",
    "operator note placeholder",
    "packet purpose",
    "advisory expected output",
    "review request",
    "receipt placeholder",
  ]);
  assertIncludesAll(SANDBOX_PACKET_ALLOWED_INPUT_BOUNDARY_COPY.join("\n"), [
    "No secret collection occurs.",
    "No input persistence occurs.",
    "No input transmission occurs.",
    "No parser authority is created.",
    "No schema enforcement authority is created.",
    "No runtime execution authority is created.",
    "No source-of-truth authority is created.",
  ]);
  assertIncludesAll(SANDBOX_PACKET_BLOCKED_AUTHORITIES.join("\n"), [
    "automatic send",
    "sandbox runtime activation",
    "sandbox task execution",
    "fixture execution",
    "stress-test execution",
    "closeout generation",
    "provider/model/API dispatch",
    "GitHub API mutation",
    "target-repo mutation/import",
    "accepted-code import",
    "automatic intake",
    "automatic route execution",
    "external import",
    "sandbox-nexus calls",
    "API routes",
    "database migration",
    "deployment",
    "production gates",
    "source-of-truth transfer",
    "hidden/background automation",
    "timers",
    "polling",
    "background jobs",
  ]);
}

function testDraftAndExportPreviews() {
  const draft = createDefaultSandboxPacketDraft();
  const json = buildSandboxPacketDraftJson(draft);
  const parsed = JSON.parse(json) as typeof draft;
  const markdown = buildSandboxPacketDraftMarkdown(draft);

  assert.equal(parsed.packetType, "sandbox_packet_candidate");
  assert.equal(
    parsed.selectedSandboxMotion.motionId,
    SANDBOX_PACKET_MOTION_OPTIONS[0].motionId,
  );
  assert.equal(
    parsed.selectedFixture.fixtureId,
    SANDBOX_PACKET_FIXTURE_OPTIONS[0].fixtureId,
  );
  assert.equal(
    parsed.selectedSandboxRoleClass.roleClassId,
    SANDBOX_PACKET_ROLE_CLASS_OPTIONS[2].roleClassId,
  );

  assertIncludesAll(json, [
    "sandbox-packet-draft-placeholder-b29",
    "sandbox_packet_candidate",
    "selectedSandboxMotion",
    "selectedFixture",
    "selectedSandboxRoleClass",
    "allowedInputsSummary",
    "blockedAuthoritiesSummary",
    "Return advisory packet review findings",
    "Future receipt",
    "Manual handoff only",
    "json_and_markdown_preview",
    "Advisory-only manual export preview.",
    "No automatic send.",
    "No sandbox-nexus call.",
    "No GitHub API mutation.",
    "No target-repo mutation.",
    "No accepted-code import.",
  ]);

  assertIncludesAll(markdown, [
    "# Sandbox Packet Draft Preview",
    "## Selected Sandbox Motion",
    "## Selected Fixture",
    "## Selected Sandbox Role / Class",
    "## Allowed Inputs",
    "## Blocked Authorities",
    "## Advisory Output Request",
    "## Receipt Expectation",
    "## CONTROL_THREAD Handoff",
    "## Export Metadata",
    "## Non-Authorization Copy",
    "No automatic send.",
    "No sandbox-nexus call.",
  ]);
}

function testManualBuildUsesSelectedOptions() {
  const draft = buildSandboxPacketDraft({
    motion: SANDBOX_PACKET_MOTION_OPTIONS[1],
    fixture: SANDBOX_PACKET_FIXTURE_OPTIONS[0],
    roleClass: SANDBOX_PACKET_ROLE_CLASS_OPTIONS[3],
  });

  assert.equal(
    draft.selectedSandboxMotion.motionId,
    SANDBOX_PACKET_MOTION_OPTIONS[1].motionId,
  );
  assert.equal(
    draft.selectedSandboxRoleClass.roleClassId,
    SANDBOX_PACKET_ROLE_CLASS_OPTIONS[3].roleClassId,
  );
}

function testReceiptPostureAndHandoff() {
  assertIncludesAll(JSON.stringify(SANDBOX_PACKET_RECEIPT_POSTURE), [
    "sandbox-packet-receipt-placeholder-b29",
    "packet id placeholder",
    "advisory display source",
    "candidate / held / rejected display placeholder",
    "CONTROL_THREAD review decision",
    "No receipt ingestion.",
    "No closeout generation.",
    "No packet acceptance.",
    "No route authority.",
    "No runtime authority.",
    "No source-of-truth transfer.",
    "Receipt posture is advisory display only",
  ]);
  assertIncludesAll(SANDBOX_PACKET_CONTROL_THREAD_HANDOFF_COPY.join("\n"), [
    "Operator selects motion, fixture, and role/class.",
    "Operator inspects allowed inputs and blocked authorities.",
    "Operator previews the sandbox packet draft.",
    "Operator manually exports the packet preview.",
    "Downstream sandbox-local handling requires a separate route.",
    "Receipt display remains advisory until CONTROL_THREAD review.",
    "CONTROL_THREAD may accept, reject, or hold.",
    "No automatic route execution or hidden automation is allowed.",
  ]);
}

function testPostureAndLabels() {
  const serialized = JSON.stringify(
    {
      posture: SANDBOX_PACKET_CONTROL_SURFACE_POSTURE,
      labels: SANDBOX_PACKET_EXPORT_LABELS,
      motions: SANDBOX_PACKET_MOTION_OPTIONS,
      fixtures: SANDBOX_PACKET_FIXTURE_OPTIONS,
      roles: SANDBOX_PACKET_ROLE_CLASS_OPTIONS,
      receipt: SANDBOX_PACKET_RECEIPT_POSTURE,
    },
    null,
    2,
  );

  assertIncludesAll(serialized, [
    "app-local / local-static display-export draft metadata",
    "manual operator export only",
    "non-authoritative",
    "CONTROL_THREAD remains the review, accept, and hold authority",
    "JAI Palette drafts are app-local, non-authoritative candidate metadata only.",
    "No automatic send.",
    "No sandbox-nexus call.",
    "No GitHub API mutation.",
    "No target-repo mutation.",
    "No accepted-code import.",
    "candidate metadata only",
  ]);
}

function testForbiddenActiveCapabilityMetadataAbsent() {
  const draft = createDefaultSandboxPacketDraft();
  const serialized = JSON.stringify(
    {
      draft,
      posture: SANDBOX_PACKET_CONTROL_SURFACE_POSTURE,
      motions: SANDBOX_PACKET_MOTION_OPTIONS,
      fixtures: SANDBOX_PACKET_FIXTURE_OPTIONS,
      roles: SANDBOX_PACKET_ROLE_CLASS_OPTIONS,
      receipt: SANDBOX_PACKET_RECEIPT_POSTURE,
      labels: SANDBOX_PACKET_EXPORT_LABELS,
    },
    null,
    2,
  );

  assertExcludesAll(serialized, [
    "endpoint",
    "apiRoute",
    "webhook",
    "runtimeHandler",
    "runtimeActivation",
    "sandboxTaskExecution",
    "executableRunner",
    "providerDispatch",
    "modelDispatch",
    "apiDispatch",
    "githubApiMutation",
    "targetRepoMutation",
    "targetRepoImport",
    "acceptedCodeImport",
    "productionGate",
    "automaticSend",
    "automaticSync",
    "backgroundJob",
    '"timer":',
    "allowedCapability",
    "activeCapability",
  ]);
}

function run() {
  testSelectionOptionsExist();
  testAllowedInputsAndBlockedAuthorities();
  testDraftAndExportPreviews();
  testManualBuildUsesSelectedOptions();
  testReceiptPostureAndHandoff();
  testPostureAndLabels();
  testForbiddenActiveCapabilityMetadataAbsent();
}

run();
