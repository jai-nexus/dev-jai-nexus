import {
  getPortfolioStatusFixture,
  type PortfolioStatusBatchSummary,
  type PortfolioStatusFixture,
  type PortfolioStatusLaneCard,
  type PortfolioStatusSummary,
  type StaticBaselineMetadata,
} from "./portfolioStatusFixture";

export type PortfolioStatusClientSource =
  | {
      kind: "fixture";
    }
  | {
      kind: "future-api";
    };

export const DEFAULT_PORTFOLIO_STATUS_SOURCE: PortfolioStatusClientSource = {
  kind: "fixture",
};

const FALLBACK_AUTHORITY_BOUNDARY =
  "Static local fixture only. Non-live and non-canonical unless accepted by CONTROL_THREAD.";

const FALLBACK_STATUS_SUMMARY: PortfolioStatusSummary = {
  generated_label: "Static local fixture fallback",
  status_note:
    "Static local fixture fallback. No live API, remote fetch, passalong ingestion, or runtime status source is connected.",
  active_work: [],
  queued_work: [],
  deferred_work: [],
};

const FALLBACK_BASELINE_METADATA: StaticBaselineMetadata = {
  status_date: "not recorded",
  artifact_version: "not recorded",
  read_model_version: "not recorded",
  handoff_manifest_path: "not recorded",
  source_baseline_note: "No source baseline note is present in the local fixture.",
  checksum: "",
  checksum_algorithm: "not recorded",
  checksum_scope: "not recorded",
  checksum_integrity_note: "No local checksum metadata is present.",
};

function normalizeText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeStatusSummary(value: Partial<PortfolioStatusSummary> | undefined): PortfolioStatusSummary {
  return {
    generated_label: normalizeText(value?.generated_label, FALLBACK_STATUS_SUMMARY.generated_label),
    status_note: normalizeText(value?.status_note, FALLBACK_STATUS_SUMMARY.status_note),
    active_work: normalizeStringArray(value?.active_work),
    queued_work: normalizeStringArray(value?.queued_work),
    deferred_work: normalizeStringArray(value?.deferred_work),
  };
}

function normalizeBaselineMetadata(
  value: Partial<StaticBaselineMetadata> | undefined,
): StaticBaselineMetadata {
  return {
    status_date: normalizeText(value?.status_date, FALLBACK_BASELINE_METADATA.status_date),
    artifact_version: normalizeText(value?.artifact_version, FALLBACK_BASELINE_METADATA.artifact_version),
    read_model_version: normalizeText(
      value?.read_model_version,
      FALLBACK_BASELINE_METADATA.read_model_version,
    ),
    handoff_manifest_path: normalizeText(
      value?.handoff_manifest_path,
      FALLBACK_BASELINE_METADATA.handoff_manifest_path,
    ),
    source_baseline_note: normalizeText(
      value?.source_baseline_note,
      FALLBACK_BASELINE_METADATA.source_baseline_note,
    ),
    checksum: normalizeText(value?.checksum, FALLBACK_BASELINE_METADATA.checksum),
    checksum_algorithm: normalizeText(
      value?.checksum_algorithm,
      FALLBACK_BASELINE_METADATA.checksum_algorithm,
    ),
    checksum_scope: normalizeText(value?.checksum_scope, FALLBACK_BASELINE_METADATA.checksum_scope),
    checksum_integrity_note: normalizeText(
      value?.checksum_integrity_note,
      FALLBACK_BASELINE_METADATA.checksum_integrity_note ?? "",
    ),
  };
}

function normalizeBatchSummary(batch: Partial<PortfolioStatusBatchSummary>): PortfolioStatusBatchSummary {
  return {
    batch_id: normalizeText(batch.batch_id, "unknown-batch"),
    display_title: normalizeText(batch.display_title, "Untitled batch"),
    status: normalizeText(batch.status, "unknown"),
    summary: normalizeText(batch.summary, "No batch summary recorded."),
    lane_ids: normalizeStringArray(batch.lane_ids),
  };
}

function normalizeLaneCard(lane: Partial<PortfolioStatusLaneCard>): PortfolioStatusLaneCard {
  return {
    lane_id: normalizeText(lane.lane_id, "unknown-lane"),
    repo: normalizeText(lane.repo, "unknown-repo"),
    display_title: normalizeText(lane.display_title, "Untitled lane"),
    status: normalizeText(lane.status, "unknown"),
    scope: normalizeText(lane.scope, "No lane scope recorded."),
    branch: normalizeText(lane.branch, "not recorded"),
    artifact: normalizeText(lane.artifact, "not recorded"),
    active_work: normalizeStringArray(lane.active_work),
    queued_work: normalizeStringArray(lane.queued_work),
    deferred_work: normalizeStringArray(lane.deferred_work),
    risks: normalizeStringArray(lane.risks),
    next_prompts: normalizeStringArray(lane.next_prompts),
  };
}

export function normalizePortfolioStatusReadModel(
  value: Partial<PortfolioStatusFixture> = {},
): PortfolioStatusFixture {
  return {
    display_title: normalizeText(value.display_title, "Operator Portfolio Status"),
    authority_boundary_label: normalizeText(value.authority_boundary_label, FALLBACK_AUTHORITY_BOUNDARY),
    static_baseline_metadata: normalizeBaselineMetadata(value.static_baseline_metadata),
    status_summary: normalizeStatusSummary(value.status_summary),
    batch_summaries: Array.isArray(value.batch_summaries)
      ? value.batch_summaries.map(normalizeBatchSummary)
      : [],
    lane_cards: Array.isArray(value.lane_cards) ? value.lane_cards.map(normalizeLaneCard) : [],
    risk_summary: {
      risks: normalizeStringArray(value.risk_summary?.risks),
    },
    next_prompts: normalizeStringArray(value.next_prompts),
    source_refs: normalizeStringArray(value.source_refs),
    non_authorizations: normalizeStringArray(value.non_authorizations),
  };
}

export function readPortfolioStatusFromFixture(): PortfolioStatusFixture {
  return normalizePortfolioStatusReadModel(getPortfolioStatusFixture());
}

export function readPortfolioStatusFromFutureApi(): never {
  throw new Error(
    "Future API portfolio status source is not authorized or connected. Use the checked-in local fixture source.",
  );
}

export function getPortfolioStatusReadModel(
  source: PortfolioStatusClientSource = DEFAULT_PORTFOLIO_STATUS_SOURCE,
): PortfolioStatusFixture {
  if (source.kind === "fixture") {
    return readPortfolioStatusFromFixture();
  }

  return readPortfolioStatusFromFutureApi();
}
