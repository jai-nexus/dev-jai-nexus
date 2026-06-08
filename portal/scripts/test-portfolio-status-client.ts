import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  assertFutureApiSourceUnavailableForRuntime,
  readPortfolioStatusFromApiBoundaryForTestOnly,
} from "../src/lib/controlPlane/portfolioStatusApiClientAdapter.testSupport";
import {
  DEFAULT_PORTFOLIO_STATUS_SOURCE,
  getPortfolioStatusReadModel,
  normalizePortfolioStatusReadModel,
  readPortfolioStatusFromFixture,
  readPortfolioStatusFromFutureApi,
} from "../src/lib/controlPlane/portfolioStatusClient";
import type { PortfolioStatusFixture } from "../src/lib/controlPlane/portfolioStatusFixture";

const originalFetch = globalThis.fetch;
let fetchCalls = 0;

globalThis.fetch = (async () => {
  fetchCalls += 1;
  throw new Error("Network fetch must not be called by portfolio status client tests.");
}) as typeof fetch;

try {
  assert.deepEqual(DEFAULT_PORTFOLIO_STATUS_SOURCE, { kind: "fixture" });

  const defaultReadModel = getPortfolioStatusReadModel();
  assert.equal(defaultReadModel.display_title, "Operator Portfolio Status");
  assert.equal(
    defaultReadModel.authority_boundary_label,
    "Static local fixture only. Non-live and non-canonical unless accepted by CONTROL_THREAD.",
  );
  assert.equal(
    defaultReadModel.static_baseline_metadata.read_model_version,
    "q2m6-portfolio-status-ui-read-model-v0",
  );
  assert.ok(Array.isArray(defaultReadModel.batch_summaries));
  assert.ok(defaultReadModel.batch_summaries.length > 0);
  assert.ok(Array.isArray(defaultReadModel.lane_cards));
  assert.ok(defaultReadModel.lane_cards.length > 0);

  const explicitFixtureReadModel = getPortfolioStatusReadModel({ kind: "fixture" });
  const directFixtureReadModel = readPortfolioStatusFromFixture();
  assert.equal(explicitFixtureReadModel.display_title, directFixtureReadModel.display_title);
  assert.equal(
    explicitFixtureReadModel.static_baseline_metadata.artifact_version,
    directFixtureReadModel.static_baseline_metadata.artifact_version,
  );

  const emptyReadModel = normalizePortfolioStatusReadModel({
    display_title: "",
    authority_boundary_label: "",
    status_summary: {
      generated_label: "",
      status_note: "",
      active_work: [],
      queued_work: [],
      deferred_work: [],
    },
  } satisfies Partial<PortfolioStatusFixture>);

  assert.equal(emptyReadModel.display_title, "Operator Portfolio Status");
  assert.equal(
    emptyReadModel.authority_boundary_label,
    "Static local fixture only. Non-live and non-canonical unless accepted by CONTROL_THREAD.",
  );
  assert.deepEqual(emptyReadModel.status_summary.active_work, []);
  assert.deepEqual(emptyReadModel.batch_summaries, []);
  assert.deepEqual(emptyReadModel.lane_cards, []);
  assert.deepEqual(emptyReadModel.risk_summary.risks, []);
  assert.deepEqual(emptyReadModel.next_prompts, []);

  const apiShapedMockReadModel = readPortfolioStatusFromApiBoundaryForTestOnly({
    read_model: {
      display_title: "Mock Portfolio Status",
      authority_boundary_label:
        "Static local fixture only. Non-live and non-canonical unless accepted by CONTROL_THREAD.",
      static_baseline_metadata: {
        status_date: "2026-06-07",
        artifact_version: "mock-static-artifact-v0",
        read_model_version: "q2m6-portfolio-status-ui-read-model-v0",
        handoff_manifest_path: "local/mock/manifest.json",
        source_baseline_note: "Local mock response for test-only adapter coverage.",
        checksum: "mock-checksum",
        checksum_algorithm: "mock-token",
        checksum_scope: "test-only local mock response",
      },
      status_summary: {
        generated_label: "mock generated label",
        status_note: "Mock static API-shaped response; not live.",
        active_work: ["mock active work"],
        queued_work: [],
        deferred_work: [],
      },
      batch_summaries: [
        {
          batch_id: "mock-batch",
          display_title: "Mock Batch",
          status: "static_fixture_review",
          summary: "Mock batch summary.",
          lane_ids: ["mock-lane"],
        },
      ],
      lane_cards: [
        {
          lane_id: "mock-lane",
          repo: "dev-jai-nexus",
          display_title: "Mock Lane",
          status: "active",
          scope: "Test-only adapter mock lane.",
          branch: "local-test-only",
          artifact: "local mock response",
        },
      ],
      risk_summary: {
        risks: ["mock risk"],
      },
      next_prompts: ["mock next prompt"],
      source_refs: ["local mock response"],
      non_authorizations: ["no network/API fetch"],
    },
  });

  assert.equal(apiShapedMockReadModel.display_title, "Mock Portfolio Status");
  assert.equal(apiShapedMockReadModel.batch_summaries[0]?.batch_id, "mock-batch");
  assert.equal(apiShapedMockReadModel.lane_cards[0]?.lane_id, "mock-lane");
  assert.deepEqual(apiShapedMockReadModel.risk_summary.risks, ["mock risk"]);

  const copiedFixturePath = path.join(
    process.cwd(),
    "src",
    "lib",
    "controlPlane",
    "__fixtures__",
    "q2m6-test-only-portfolio-status-response-v0.json",
  );
  const copiedApiResponse = JSON.parse(fs.readFileSync(copiedFixturePath, "utf8")) as unknown;
  const copiedReadModel = readPortfolioStatusFromApiBoundaryForTestOnly(copiedApiResponse);

  assert.equal(copiedReadModel.display_title, "Q2M6 Portfolio Status");
  assert.equal(
    copiedReadModel.authority_boundary_label,
    "Local static status only; not live telemetry or production state.",
  );
  assert.equal(
    copiedReadModel.static_baseline_metadata.read_model_version,
    "q2m6-portfolio-status-ui-read-model-v0",
  );
  assert.equal(copiedReadModel.batch_summaries[0]?.batch_id, "q2m6");
  assert.equal(
    copiedReadModel.batch_summaries[0]?.display_title,
    "Q2M6 JAI NEXUS operating model transition",
  );
  assert.equal(
    copiedReadModel.lane_cards[0]?.lane_id,
    "q2m6-static-portfolio-status-artifact-v0",
  );
  assert.equal(copiedReadModel.lane_cards[0]?.repo, "orchestrator-nexus");
  assert.equal(
    copiedReadModel.lane_cards[1]?.lane_id,
    "q2m6-static-status-read-model-contract-validator-v0",
  );
  assert.deepEqual(copiedReadModel.risk_summary.risks, [
    "Static status must not be interpreted as live telemetry or production state.",
    "A local draft contract could be mistaken for a deployed API contract.",
  ]);
  assert.ok(
    copiedReadModel.source_refs.includes(
      "api-nexus/fixtures/static/q2m6-test-only-portfolio-status-response-v0.json",
    ),
  );

  for (const wrapperKey of ["read_model", "data", "portfolio_status"] as const) {
    const wrappedReadModel = readPortfolioStatusFromApiBoundaryForTestOnly({
      [wrapperKey]: copiedApiResponse,
    });
    assert.equal(wrappedReadModel.display_title, copiedReadModel.display_title);
    assert.equal(wrappedReadModel.batch_summaries[0]?.batch_id, "q2m6");
    assert.equal(wrappedReadModel.lane_cards.length, 2);
  }

  const emptyApiShapedMockReadModel = readPortfolioStatusFromApiBoundaryForTestOnly({
    data: {
      display_title: "",
      status_summary: {
        generated_label: "",
        status_note: "",
        active_work: [],
        queued_work: [],
        deferred_work: [],
      },
    },
  });
  assert.equal(emptyApiShapedMockReadModel.display_title, "Operator Portfolio Status");
  assert.deepEqual(emptyApiShapedMockReadModel.batch_summaries, []);
  assert.deepEqual(emptyApiShapedMockReadModel.lane_cards, []);

  const operatorPageSource = fs.readFileSync(
    path.join(process.cwd(), "src", "app", "operator", "portfolio-status", "page.tsx"),
    "utf8",
  );
  assert.match(operatorPageSource, /getPortfolioStatusFixture/);
  assert.doesNotMatch(operatorPageSource, /portfolioStatusApiClientAdapter/);
  assert.match(operatorPageSource, /Static/);
  assert.match(operatorPageSource, /non-live/i);
  assert.match(operatorPageSource, /fixture-backed/i);

  assert.throws(
    () => getPortfolioStatusReadModel({ kind: "future-api" }),
    /not authorized or connected/i,
  );
  assert.throws(() => readPortfolioStatusFromFutureApi(), /not authorized or connected/i);
  assert.throws(() => assertFutureApiSourceUnavailableForRuntime(), /not authorized or connected/i);
  assert.equal(fetchCalls, 0);

  console.log("portfolio status client boundary tests passed");
} finally {
  globalThis.fetch = originalFetch;
}
