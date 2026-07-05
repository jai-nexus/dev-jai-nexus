import assert from "node:assert/strict";

import {
  buildSupervisedRoutePacket,
  buildSupervisedRoutePacketJson,
  buildSupervisedRoutePacketMarkdown,
  createDefaultSupervisedRoutePacketInput,
  SUPERVISED_ROUTE_PACKET_ADVISORY_STATEMENT,
  SUPERVISED_ROUTE_PACKET_AUTHORITY_STATEMENT,
  SUPERVISED_ROUTE_PACKET_LIFECYCLE_STATUSES,
  SUPERVISED_ROUTE_PACKET_NON_AUTHORIZATIONS,
} from "./supervisedRoutePacket";

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

function testRequiredFieldPresence() {
  const packet = buildSupervisedRoutePacket(
    createDefaultSupervisedRoutePacketInput("2026-07-05T00:00:00.000Z"),
  );

  assert.equal(packet.schemaVersion, "b5.v0");
  assert.equal(packet.packetId, "b5-supervised-route-packet-draft-v0");
  assert.equal(packet.program, "Q3M7Y26 JAI Motion Control Plane Activation v0");
  assert.equal(packet.batch, "B");
  assert.equal(packet.wave, "B-A");
  assert.equal(packet.lane, "B5");
  assert.equal(packet.sourceThread, "JAI_Control_Thread");
  assert.equal(packet.targetRepo, "sandbox-nexus");
  assert.equal(packet.lifecycleStatus, "draft");
  assert.equal(packet.outputPosture, "manual_handoff_only");
  assert.equal(packet.controlThreadAuthority, SUPERVISED_ROUTE_PACKET_AUTHORITY_STATEMENT);
  assert.equal(packet.advisoryNonAuthoritative, SUPERVISED_ROUTE_PACKET_ADVISORY_STATEMENT);
  assert.equal(packet.sandboxNexusCompatibility.fixtureCompatible, true);
  assert.equal(
    packet.sandboxNexusCompatibility.runtimeActivation,
    "not_authorized",
  );
  assert.ok(packet.evidenceReferences.length > 0);
  assert.ok(packet.guardrails.length > 0);
  assert.ok(packet.nonAuthorizations.length > 0);
}

function testExportShapes() {
  const packet = buildSupervisedRoutePacket(
    createDefaultSupervisedRoutePacketInput("static-generated-marker"),
  );
  const json = buildSupervisedRoutePacketJson(packet);
  const parsed = JSON.parse(json) as typeof packet;
  const markdown = buildSupervisedRoutePacketMarkdown(packet);

  assert.equal(parsed.packetId, packet.packetId);
  assert.equal(parsed.outputPosture, "manual_handoff_only");
  assertIncludesAll(json, [
    '"schemaVersion": "b5.v0"',
    '"targetRepo": "sandbox-nexus"',
    '"runtimeActivation": "not_authorized"',
    '"outputPosture": "manual_handoff_only"',
    "CONTROL_THREAD remains the acceptance authority",
    "This route packet is app-local, non-authoritative",
  ]);
  assertIncludesAll(markdown, [
    "# b5-supervised-route-packet-draft-v0",
    "## Manual Handoff Instructions",
    "## Authority",
    "## Advisory / Non-Authoritative Posture",
    "## Non-Authorizations",
    "Runtime activation is not authorized.",
  ]);
}

function testLifecycleVocabulary() {
  for (const lifecycleStatus of SUPERVISED_ROUTE_PACKET_LIFECYCLE_STATUSES) {
    const packet = buildSupervisedRoutePacket({
      ...createDefaultSupervisedRoutePacketInput(),
      lifecycleStatus,
    });
    assert.equal(packet.lifecycleStatus, lifecycleStatus);
  }
}

function testNonAuthorizationGuardrails() {
  const packet = buildSupervisedRoutePacket(createDefaultSupervisedRoutePacketInput());
  const exportText = `${buildSupervisedRoutePacketJson(packet)}\n${buildSupervisedRoutePacketMarkdown(packet)}`;

  assertIncludesAll(exportText, [
    "No automatic send.",
    "No provider/model/API call.",
    "No sandbox-nexus runtime activation.",
    "No sandbox task execution.",
    "No JAI Agent activation.",
    "No target-repo mutation.",
    "No accepted-code import.",
    "No GitHub automation.",
    "No deployed database migration.",
    "No migration application.",
    "No deployed database mutation.",
    "No deployment.",
    "No production gate opening.",
    "No source-of-truth transfer.",
    "No hidden/background automation.",
  ]);
  assert.deepEqual(
    packet.nonAuthorizations,
    [...SUPERVISED_ROUTE_PACKET_NON_AUTHORIZATIONS],
  );
}

function testNoDispatchMetadataOrEndpoints() {
  const packet = buildSupervisedRoutePacket(createDefaultSupervisedRoutePacketInput());
  const exportText = buildSupervisedRoutePacketJson(packet);

  assertExcludesAll(exportText, [
    "sendEndpoint",
    "dispatchEndpoint",
    "webhookUrl",
    "apiKey",
    "providerKey",
    "githubToken",
    "octokit",
    "fetch(",
    "createPullRequest",
  ]);
}

function run() {
  testRequiredFieldPresence();
  testExportShapes();
  testLifecycleVocabulary();
  testNonAuthorizationGuardrails();
  testNoDispatchMetadataOrEndpoints();
}

run();
