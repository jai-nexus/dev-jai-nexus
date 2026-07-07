import assert from "node:assert/strict";

import {
  buildSandboxReceiptReturnDisplayMarkdown,
  SANDBOX_RECEIPT_RETURN_BOUNDARY_COPY,
  SANDBOX_RECEIPT_RETURN_DISPLAY,
} from "./sandboxReceiptReturnDisplay";

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

function testReceiptReturnStaticDisplayData() {
  assert.equal(SANDBOX_RECEIPT_RETURN_DISPLAY.sourceLane, "B34");
  assert.equal(SANDBOX_RECEIPT_RETURN_DISPLAY.reviewLane, "B35");
  assert.equal(
    SANDBOX_RECEIPT_RETURN_DISPLAY.selectedPacket.packetId,
    "q3m7-b31-mock-sandbox-packet-local-001",
  );
  assert.equal(
    SANDBOX_RECEIPT_RETURN_DISPLAY.selectedPacket.packetPath,
    ".nexus/packet-intake/examples/mock-sandbox-packet-v0.yaml",
  );

  assertIncludesAll(SANDBOX_RECEIPT_RETURN_DISPLAY.intakePosture.intakeMode.join("\n"), [
    "manual",
    "fixture-bound",
    "test-data-only",
    "sandbox-local",
  ]);
  assert.equal(
    SANDBOX_RECEIPT_RETURN_DISPLAY.intakePosture.intakeFinding,
    "All required field classes were present and accepted for advisory fixture review.",
  );
  assert.deepEqual(
    SANDBOX_RECEIPT_RETURN_DISPLAY.fieldSummary.rejectedFields,
    ["none"],
  );
  assert.deepEqual(
    SANDBOX_RECEIPT_RETURN_DISPLAY.fieldSummary.blockedFields,
    ["none"],
  );
  assertIncludesAll(SANDBOX_RECEIPT_RETURN_DISPLAY.caveats.join("\n"), [
    "Finding applies only to selected static mock packet.",
    "B35 evidence was passalong-grounded and not locally artifact-grounded in audit-nexus.",
    "This caveat does not create source-of-truth transfer.",
  ]);
  assertIncludesAll(
    Object.values(SANDBOX_RECEIPT_RETURN_DISPLAY.receiptPosture).join("\n"),
    [
      "Receipt return display is advisory only.",
      "Receipt return display is non-authoritative.",
      "Receipt return display is non-executing.",
      "CONTROL_THREAD review/accept/hold remains required.",
    ],
  );
}

function testBoundaryDisplayData() {
  assertIncludesAll(SANDBOX_RECEIPT_RETURN_BOUNDARY_COPY.join("\n"), [
    "No receipt ingestion.",
    "No automatic import.",
    "No sandbox-nexus calls.",
    "No automatic sync.",
    "No API routes.",
    "No database migration.",
    "No runtime behavior.",
    "No packet execution.",
    "No sandbox task execution.",
    "No JAI Agent activation.",
    "No provider/model/API dispatch.",
    "No GitHub/API mutation.",
    "No target-repo mutation/import.",
    "No accepted-code import.",
    "No deployment.",
    "No production gates.",
    "No source-of-truth transfer.",
    "No hidden/background automation.",
    "No timers.",
    "No polling.",
    "No background jobs.",
    "No automatic route execution.",
    "No automatic delivery.",
    "No acceptance authority transfer.",
    "No execution authority transfer.",
  ]);
}

function testMarkdownPreviewIncludesBaselineAndBoundaries() {
  const markdown = buildSandboxReceiptReturnDisplayMarkdown();

  assertIncludesAll(markdown, [
    "# Sandbox Receipt Return Display",
    "Source lane: B34",
    "Review lane: B35",
    "Selected packet id: q3m7-b31-mock-sandbox-packet-local-001",
    "Selected packet path: .nexus/packet-intake/examples/mock-sandbox-packet-v0.yaml",
    "All required field classes were present and accepted for advisory fixture review.",
    "Finding applies only to selected static mock packet.",
    "B35 evidence was passalong-grounded and not locally artifact-grounded in audit-nexus.",
    "Receipt return display is advisory only.",
    "No receipt ingestion.",
    "No automatic delivery.",
  ]);
}

function testForbiddenActiveCapabilityMetadataAbsent() {
  const serialized = JSON.stringify(
    {
      display: SANDBOX_RECEIPT_RETURN_DISPLAY,
      markdown: buildSandboxReceiptReturnDisplayMarkdown(),
    },
    null,
    2,
  );

  assertExcludesAll(serialized, [
    '"endpoint"',
    '"apiRoute"',
    '"webhook"',
    '"runtimeHandler"',
    '"runtimeActivation"',
    '"receiptIngestion"',
    '"receiptImport"',
    '"automaticImport"',
    '"sandboxNexusCall"',
    '"automaticSync"',
    '"packetExecution"',
    '"sandboxTaskExecution"',
    '"jaiAgentActivation"',
    '"providerDispatch"',
    '"modelDispatch"',
    '"apiDispatch"',
    '"githubApiMutation"',
    '"targetRepoMutation"',
    '"targetRepoImport"',
    '"acceptedCodeImport"',
    '"deployment"',
    '"productionGate"',
    '"sourceOfTruthTransfer"',
    '"hiddenAutomation"',
    '"backgroundJob"',
    '"polling"',
    '"timer"',
    "fetch(",
    "axios",
    "octokit",
  ]);
}

function run() {
  testReceiptReturnStaticDisplayData();
  testBoundaryDisplayData();
  testMarkdownPreviewIncludesBaselineAndBoundaries();
  testForbiddenActiveCapabilityMetadataAbsent();
}

run();
