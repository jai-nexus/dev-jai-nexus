import assert from "node:assert/strict";

import {
  COMPANY_ASSET_DOMAIN_REGISTRY_BOUNDARY_COPY,
  COMPANY_ASSET_DOMAIN_REGISTRY_DISPLAY_MODEL,
  DOMAIN_CONCEPT_DISPLAY,
  DOMAIN_ENGINE_GROUP_DISPLAY,
  ENVIRONMENT_BINDING_DISPLAY,
  OWNED_DOMAIN_ASSET_DISPLAY,
  PUBLIC_READINESS_POSTURES,
  RENEWAL_EXPIRATION_RISK_POSTURES,
  REPOSITORY_BINDING_DISPLAY,
  summarizeCompanyAssetDomainRegistryDisplayModel,
} from "./companyAssetDomainRegistry";

function assertIncludesAll(source: readonly string[], expected: readonly string[]) {
  for (const item of expected) {
    assert.ok(source.includes(item), `Expected ${item}`);
  }
}

function testDisplayModelCoverage() {
  assert.ok(OWNED_DOMAIN_ASSET_DISPLAY.length > 0, "owned domain asset display model exists");
  assert.ok(DOMAIN_CONCEPT_DISPLAY.length > 0, "domain concept display model exists");
  assert.ok(DOMAIN_ENGINE_GROUP_DISPLAY.length > 0, "domain-engine group display model exists");
  assert.ok(REPOSITORY_BINDING_DISPLAY.length > 0, "repository binding display model exists");
  assert.ok(ENVIRONMENT_BINDING_DISPLAY.length > 0, "environment binding display model exists");
  assert.ok(RENEWAL_EXPIRATION_RISK_POSTURES.length > 0, "renewal/expiration risk posture exists");
  assert.ok(PUBLIC_READINESS_POSTURES.length > 0, "public-readiness posture exists");
  assert.ok(
    COMPANY_ASSET_DOMAIN_REGISTRY_BOUNDARY_COPY.some((line) =>
      line.includes("CONTROL_THREAD accepts it"),
    ),
    "CONTROL_THREAD authority-boundary copy exists",
  );
}

function testRequiredDistinctions() {
  const copy = COMPANY_ASSET_DOMAIN_REGISTRY_BOUNDARY_COPY.join("\n");

  assert.ok(copy.includes("Domain asset is not automatically a repo."));
  assert.ok(copy.includes("Domain concept is not automatically a deployed app."));
  assert.ok(copy.includes("Engine group is not automatically a repository."));
  assert.ok(copy.includes("Repo binding can be many-to-many."));
  assert.ok(copy.includes("Registry display is not source-of-truth transfer."));
  assert.ok(copy.includes("Registry display is not company canon unless CONTROL_THREAD accepts it."));

  const asset = OWNED_DOMAIN_ASSET_DISPLAY[0];
  assert.ok(asset.authority_boundary_summary.includes("Candidate domain asset display only"));
  assert.notEqual(asset.domain_asset_id, asset.linked_repo_bindings[0]);
}

function testManyToManyRepoBindingPosture() {
  const binding = REPOSITORY_BINDING_DISPLAY.find(
    (candidate) => candidate.binding_id === "binding-dev-jai-nexus-operator-surface",
  );

  assert.ok(binding, "expected dev-jai-nexus binding");
  assert.ok(binding.linked_domain_asset_ids.length > 1, "repo can bind multiple domain assets");
  assert.ok(binding.linked_domain_concept_ids.length > 1, "repo can bind multiple concepts");
  assert.ok(
    binding.authority_boundary_summary.includes("does not mutate repos"),
    "binding display is not mutation",
  );
}

function testDomainEngineConceptExamples() {
  const names = DOMAIN_ENGINE_GROUP_DISPLAY.map((group) => group.engine_group_name);

  assertIncludesAll(names, ["frontend-nexus", "backend-nexus", "helper-nexus"]);

  for (const group of DOMAIN_ENGINE_GROUP_DISPLAY) {
    assert.ok(
      group.authority_boundary_summary.includes("not") ||
        group.authority_boundary_summary.includes("does not"),
      `expected boundary copy for ${group.engine_group_id}`,
    );
  }
}

function testRenewalExpirationLabels() {
  assertIncludesAll(RENEWAL_EXPIRATION_RISK_POSTURES, [
    "expiration_unknown",
    "no_known_risk",
    "watch",
    "renewal_due_soon",
    "urgent_renewal_risk",
    "expired_or_unconfirmed",
    "registrar_account_unknown",
    "evidence_required",
  ]);
}

function testPublicReadinessLabels() {
  assertIncludesAll(PUBLIC_READINESS_POSTURES, [
    "not_assessed",
    "internal_only",
    "parked_or_reserved",
    "DNS_planned",
    "DNS_ready",
    "app_planned",
    "app_staged",
    "internal_preview",
    "public_candidate",
    "public_ready_pending_CONTROL_THREAD",
    "public_live_confirmed",
  ]);
}

function testForbiddenActiveCapabilityMetadataAbsent() {
  const serialized = JSON.stringify(COMPANY_ASSET_DOMAIN_REGISTRY_DISPLAY_MODEL, null, 2);

  for (const forbidden of [
    "registryMutation",
    "dnsChange",
    "registrarAction",
    "renewalAction",
    "publicLaunch",
    "deployment",
    "runtimeBehavior",
    "providerDispatch",
    "modelDispatch",
    "apiDispatch",
    "githubMutation",
    "targetRepoMutation",
    "targetRepoImport",
    "acceptedCodeImport",
    "productionGate",
    "sourceOfTruthTransfer",
    "hiddenAutomation",
    "backgroundJob",
    "polling",
    "timer",
  ]) {
    assert.ok(!serialized.includes(`"${forbidden}"`), `Forbidden metadata key ${forbidden}`);
  }
}

function testSummary() {
  const summary = summarizeCompanyAssetDomainRegistryDisplayModel();
  assert.ok(summary.includes("domain asset candidates"));
  assert.ok(summary.includes("many-to-many repo bindings"));
  assert.ok(summary.includes("non-authoritative display model only"));
}

function run() {
  testDisplayModelCoverage();
  testRequiredDistinctions();
  testManyToManyRepoBindingPosture();
  testDomainEngineConceptExamples();
  testRenewalExpirationLabels();
  testPublicReadinessLabels();
  testForbiddenActiveCapabilityMetadataAbsent();
  testSummary();
}

run();
