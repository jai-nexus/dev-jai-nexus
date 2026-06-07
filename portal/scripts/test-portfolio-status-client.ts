import assert from "node:assert/strict";

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

  assert.throws(
    () => getPortfolioStatusReadModel({ kind: "future-api" }),
    /not authorized or connected/i,
  );
  assert.throws(() => readPortfolioStatusFromFutureApi(), /not authorized or connected/i);
  assert.equal(fetchCalls, 0);

  console.log("portfolio status client boundary tests passed");
} finally {
  globalThis.fetch = originalFetch;
}
