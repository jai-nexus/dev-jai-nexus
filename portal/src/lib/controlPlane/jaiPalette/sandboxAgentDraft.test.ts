import assert from "node:assert/strict";

import {
  buildJaiPaletteSandboxAgentDraft,
  buildJaiPaletteSandboxAgentDraftJson,
  buildJaiPaletteSandboxAgentDraftMarkdown,
  createDefaultJaiPaletteSandboxAgentDraftInput,
  JAI_PALETTE_ADVISORY_STATEMENT,
  JAI_PALETTE_AGENT_ACTIVATION_STATUSES,
  JAI_PALETTE_AGENT_REVIEW_STATUSES,
  JAI_PALETTE_BLOCKED_AUTHORITIES,
  JAI_PALETTE_CONTROL_THREAD_AUTHORITY,
  JAI_SANDBOX_AGENT_CLASSES,
} from "./sandboxAgentDraft";

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

function testRequiredClassesPresent() {
  assert.deepEqual(JAI_SANDBOX_AGENT_CLASSES, [
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
  ]);
}

function testRequiredFieldPresence() {
  for (const agentClass of JAI_SANDBOX_AGENT_CLASSES) {
    const draft = buildJaiPaletteSandboxAgentDraft(
      createDefaultJaiPaletteSandboxAgentDraftInput(agentClass),
    );

    assert.equal(draft.schemaVersion, "jai-palette-agent-draft.b11.v0");
    assert.equal(draft.draftKind, "sandbox_agent_candidate");
    assert.equal(draft.executableRuntime, "not_created");
    assert.equal(draft.agentClass, agentClass);
    assert.equal(draft.activationStatus, "draft");
    assert.equal(draft.reviewStatus, "pending");
    assert.equal(draft.controlThreadAuthority, JAI_PALETTE_CONTROL_THREAD_AUTHORITY);
    assert.equal(draft.advisoryNonAuthoritative, JAI_PALETTE_ADVISORY_STATEMENT);
    assert.ok(draft.agentId.length > 0);
    assert.ok(draft.agentName.length > 0);
    assert.ok(draft.sandboxDomain.length > 0);
    assert.ok(draft.purpose.length > 0);
    assert.ok(draft.coverageResponsibility.length > 0);
    assert.ok(draft.allowedInputs.length > 0);
    assert.ok(draft.expectedOutputs.length > 0);
    assert.ok(draft.requiredGuardrails.length > 0);
    assert.deepEqual(draft.blockedAuthorities, [...JAI_PALETTE_BLOCKED_AUTHORITIES]);
  }
}

function testExportShapes() {
  const draft = buildJaiPaletteSandboxAgentDraft(
    createDefaultJaiPaletteSandboxAgentDraftInput(
      "JAI::SANDBOX::MUTATION_RISK_AGENT",
    ),
  );
  const json = buildJaiPaletteSandboxAgentDraftJson(draft);
  const parsed = JSON.parse(json) as typeof draft;
  const markdown = buildJaiPaletteSandboxAgentDraftMarkdown(draft);

  assert.equal(parsed.agentClass, "JAI::SANDBOX::MUTATION_RISK_AGENT");
  assertIncludesAll(json, [
    '"schemaVersion": "jai-palette-agent-draft.b11.v0"',
    '"draftKind": "sandbox_agent_candidate"',
    '"executableRuntime": "not_created"',
    '"activationStatus": "draft"',
    '"reviewStatus": "pending"',
    "Route-packet compatibility does not imply route execution.",
    "Fixture compatibility does not imply target-repo mutation or accepted-code import.",
  ]);
  assertIncludesAll(markdown, [
    "# Sandbox Mutation Risk Agent Candidate",
    "## Route-Packet Compatibility",
    "## Sandbox-Nexus Fixture Compatibility",
    "## Blocked Authorities",
    "CONTROL_THREAD remains the review, accept, and hold authority",
    "JAI Palette drafts are app-local, non-authoritative",
  ]);
}

function testStatusVocabularies() {
  assert.deepEqual(JAI_PALETTE_AGENT_ACTIVATION_STATUSES, [
    "draft",
    "candidate",
  ]);
  assert.deepEqual(JAI_PALETTE_AGENT_REVIEW_STATUSES, [
    "pending",
    "held",
    "reviewed",
  ]);

  const allStatuses = [
    ...JAI_PALETTE_AGENT_ACTIVATION_STATUSES,
    ...JAI_PALETTE_AGENT_REVIEW_STATUSES,
  ].join("\n");
  assertExcludesAll(allStatuses, [
    "active",
    "running",
    "executing",
    "approved",
    "accepted",
    "deployed",
    "enabled",
    "live",
  ]);
}

function testBoundaryPresenceAndNoRuntimeMetadata() {
  const draft = buildJaiPaletteSandboxAgentDraft(
    createDefaultJaiPaletteSandboxAgentDraftInput(
      "JAI::SANDBOX::PROVIDER_RISK_AGENT",
    ),
  );
  const exportText = `${buildJaiPaletteSandboxAgentDraftJson(draft)}\n${buildJaiPaletteSandboxAgentDraftMarkdown(draft)}`;

  assertIncludesAll(exportText, [
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
  ]);
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
    "runtimeEndpoint",
  ]);
}

function run() {
  testRequiredClassesPresent();
  testRequiredFieldPresence();
  testExportShapes();
  testStatusVocabularies();
  testBoundaryPresenceAndNoRuntimeMetadata();
}

run();
