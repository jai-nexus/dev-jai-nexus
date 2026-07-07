import assert from "node:assert/strict";

import {
  CLOSEOUT_REQUIRED_TAXONOMY_FIELDS,
  formatTaxonomyValue,
  WAVES_REQUIRED_TAXONOMY_FIELDS,
  WAVES_TAXONOMY_ALIGNMENT,
  WORK_REQUIRED_TAXONOMY_FIELDS,
  WORK_TAXONOMY_ALIGNMENT,
  WORK_WAVES_AUTHORITY_BOUNDARY_COPY,
  WORK_WAVES_CONTROL_THREAD_DECISION_VOCABULARY,
  WORK_WAVES_EVIDENCE_STATUS_VOCABULARY,
  WORK_WAVES_TAXONOMY_FIELDS,
} from "./workWavesProgramTaxonomy";

function assertIncludesAll(source: readonly string[], expected: readonly string[]) {
  for (const item of expected) {
    assert.ok(source.includes(item), `Expected ${item}`);
  }
}

function assertRecordHasFields(record: Record<string, unknown>, fields: readonly string[]) {
  for (const field of fields) {
    assert.ok(Object.hasOwn(record, field), `Expected record field ${field}`);
  }
}

function testRequiredTaxonomyFields() {
  assertRecordHasFields(WORK_TAXONOMY_ALIGNMENT.fields, WORK_WAVES_TAXONOMY_FIELDS);
  assertRecordHasFields(WAVES_TAXONOMY_ALIGNMENT.fields, WORK_WAVES_TAXONOMY_FIELDS);
  assertRecordHasFields(WORK_TAXONOMY_ALIGNMENT.fields, WORK_REQUIRED_TAXONOMY_FIELDS);
  assertRecordHasFields(WAVES_TAXONOMY_ALIGNMENT.fields, WAVES_REQUIRED_TAXONOMY_FIELDS);
  assertRecordHasFields(WORK_TAXONOMY_ALIGNMENT.fields, CLOSEOUT_REQUIRED_TAXONOMY_FIELDS);
}

function testEvidenceAndCloseoutVocabulary() {
  assertIncludesAll(WORK_WAVES_EVIDENCE_STATUS_VOCABULARY, [
    "missing",
    "referenced",
    "passalong-grounded",
    "repo-local",
    "reviewed",
    "accepted",
    "held",
    "blocked",
    "superseded",
    "closeout-ready",
    "program-close-candidate",
  ]);
}

function testControlThreadDecisionVocabulary() {
  assertIncludesAll(WORK_WAVES_CONTROL_THREAD_DECISION_VOCABULARY, [
    "routed",
    "in progress",
    "closeout submitted",
    "reviewed",
    "accepted",
    "held",
    "blocked",
    "rejected",
    "review required",
    "program close candidate",
  ]);
}

function testBoundaryCopy() {
  const copy = WORK_WAVES_AUTHORITY_BOUNDARY_COPY.join("\n");

  assert.ok(copy.includes("CONTROL_THREAD remains routing/acceptance/hold authority."));
  assert.ok(
    copy.includes(
      "UI display does not accept, reject, execute, route, deploy, mutate, or transfer source-of-truth authority.",
    ),
  );
  assert.ok(copy.includes("Closeout display is not acceptance."));
  assert.ok(copy.includes("Program-close candidate is not production readiness."));
  assert.ok(copy.includes("Display readiness is not execution readiness."));
  assert.ok(copy.includes("Evidence referenced is not evidence verified."));
  assert.ok(copy.includes("Passalong-grounded evidence is not repo-local evidence."));
}

function testForbiddenActiveCapabilityMetadataAbsent() {
  const serialized = JSON.stringify(
    {
      work: WORK_TAXONOMY_ALIGNMENT,
      waves: WAVES_TAXONOMY_ALIGNMENT,
      evidence: WORK_WAVES_EVIDENCE_STATUS_VOCABULARY,
      decision: WORK_WAVES_CONTROL_THREAD_DECISION_VOCABULARY,
      boundary: WORK_WAVES_AUTHORITY_BOUNDARY_COPY,
    },
    null,
    2,
  );

  for (const forbidden of [
    "runtimeHandler",
    "runtimeBehavior",
    "packetExecution",
    "sandboxTaskExecution",
    "jaiAgentActivation",
    "providerDispatch",
    "modelDispatch",
    "apiDispatch",
    "githubApiMutation",
    "targetRepoMutation",
    "targetRepoImport",
    "acceptedCodeImport",
    "deployment",
    "productionGate",
    "sourceOfTruthTransfer",
    "hiddenAutomation",
    "backgroundJob",
    "polling",
    "timer",
    "automaticRouteExecution",
    "automaticDelivery",
    "acceptanceAuthorityTransfer",
    "executionAuthorityTransfer",
  ]) {
    assert.ok(!serialized.includes(`"${forbidden}"`), `Forbidden metadata key ${forbidden}`);
  }
}

function testFormatter() {
  assert.equal(formatTaxonomyValue(true), "yes");
  assert.equal(formatTaxonomyValue(false), "no");
  assert.equal(formatTaxonomyValue(["a", "b"]), "a; b");
  assert.equal(formatTaxonomyValue("ready"), "ready");
}

function run() {
  testRequiredTaxonomyFields();
  testEvidenceAndCloseoutVocabulary();
  testControlThreadDecisionVocabulary();
  testBoundaryCopy();
  testForbiddenActiveCapabilityMetadataAbsent();
  testFormatter();
}

run();
