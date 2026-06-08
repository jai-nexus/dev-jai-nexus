import {
  normalizePortfolioStatusReadModel,
  readPortfolioStatusFromFutureApi,
} from "./portfolioStatusClient";
import type {
  PortfolioStatusBatchSummary,
  PortfolioStatusFixture,
  PortfolioStatusLaneCard,
  PortfolioStatusSummary,
} from "./portfolioStatusFixture";

export type PortfolioStatusApiMockResponse =
  | unknown
  | {
      data?: unknown;
      portfolio_status?: unknown;
      read_model?: unknown;
    };

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function unwrapApiResponse(response: PortfolioStatusApiMockResponse): unknown {
  if (!isRecord(response)) return {};
  return response.data ?? response.portfolio_status ?? response.read_model ?? response;
}

function stringField(record: JsonRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
}

function stringArrayField(record: JsonRecord, key: string): string[] {
  const value = record[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function recordArrayField(record: JsonRecord, key: string): JsonRecord[] {
  const value = record[key];
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord);
}

function normalizeApiStatusSummary(record: JsonRecord): PortfolioStatusSummary | undefined {
  const statusSummary = record.status_summary;
  if (!isRecord(statusSummary)) return undefined;

  return {
    generated_label: stringField(statusSummary, "generated_label") ?? stringField(record, "display_title") ?? "",
    status_note: stringField(statusSummary, "status_note") ?? "Local test-only API-shaped response.",
    active_work: stringArrayField(statusSummary, "active_work"),
    queued_work: stringArrayField(statusSummary, "queued_work"),
    deferred_work: stringArrayField(statusSummary, "deferred_work"),
  };
}

function normalizeApiBatchSummary(batch: JsonRecord): PortfolioStatusBatchSummary {
  return {
    batch_id: stringField(batch, "batch_id") ?? "unknown-batch",
    display_title: stringField(batch, "display_title") ?? stringField(batch, "title") ?? "Untitled batch",
    status: stringField(batch, "status") ?? "static_fixture_review",
    summary: stringField(batch, "summary") ?? "No batch summary recorded.",
    lane_ids: stringArrayField(batch, "lane_ids"),
  };
}

function normalizeApiLaneCard(lane: JsonRecord): PortfolioStatusLaneCard {
  return {
    lane_id: stringField(lane, "lane_id") ?? "unknown-lane",
    repo: stringField(lane, "repo") ?? "unknown-repo",
    display_title: stringField(lane, "display_title") ?? stringField(lane, "title") ?? "Untitled lane",
    status: stringField(lane, "status") ?? "unknown",
    scope: stringField(lane, "scope") ?? stringField(lane, "summary") ?? "No lane scope recorded.",
    branch: stringField(lane, "branch") ?? stringField(lane, "mode") ?? "not recorded",
    artifact: stringField(lane, "artifact") ?? stringField(lane, "source_artifact") ?? "test-only API response",
    active_work: stringArrayField(lane, "active_work"),
    queued_work: stringArrayField(lane, "queued_work"),
    deferred_work: stringArrayField(lane, "deferred_work"),
    risks: stringArrayField(lane, "risks"),
    next_prompts: stringArrayField(lane, "next_prompts"),
  };
}

function normalizeApiFixtureShape(payload: unknown): Partial<PortfolioStatusFixture> {
  if (!isRecord(payload)) return {};

  return {
    display_title: stringField(payload, "display_title"),
    authority_boundary_label: stringField(payload, "authority_boundary_label"),
    static_baseline_metadata: {
      status_date: stringField(payload, "status_date") ?? "not recorded",
      artifact_version:
        stringField(payload, "artifact_version") ?? stringField(payload, "source_artifact") ?? "not recorded",
      read_model_version: stringField(payload, "read_model_version") ?? "not recorded",
      handoff_manifest_path: stringField(payload, "handoff_manifest_path") ?? "local copied test fixture",
      source_baseline_note:
        stringField(payload, "source_baseline_note") ?? stringField(payload, "source_artifact") ?? "not recorded",
      checksum: stringField(payload, "checksum") ?? "",
      checksum_algorithm: stringField(payload, "checksum_algorithm") ?? "not recorded",
      checksum_scope: stringField(payload, "checksum_scope") ?? "local test-only copied fixture",
      checksum_integrity_note: stringField(payload, "checksum_integrity_note"),
    },
    status_summary: normalizeApiStatusSummary(payload),
    batch_summaries: recordArrayField(payload, "batch_summaries").map(normalizeApiBatchSummary),
    lane_cards: recordArrayField(payload, "lane_cards").map(normalizeApiLaneCard),
    risk_summary: {
      risks: Array.isArray(payload.risk_summary)
        ? stringArrayField(payload, "risk_summary")
        : stringArrayField(isRecord(payload.risk_summary) ? payload.risk_summary : {}, "risks"),
    },
    next_prompts: stringArrayField(payload, "next_prompts"),
    source_refs: [
      stringField(payload, "source_artifact"),
      "api-nexus/fixtures/static/q2m6-test-only-portfolio-status-response-v0.json",
    ].filter((item): item is string => typeof item === "string"),
    non_authorizations: stringArrayField(payload, "non_authorizations"),
  };
}

export function normalizeTestOnlyPortfolioStatusApiResponse(
  response: PortfolioStatusApiMockResponse = {},
): PortfolioStatusFixture {
  return normalizePortfolioStatusReadModel(normalizeApiFixtureShape(unwrapApiResponse(response)));
}

export function readPortfolioStatusFromApiBoundaryForTestOnly(
  response: PortfolioStatusApiMockResponse,
): PortfolioStatusFixture {
  return normalizeTestOnlyPortfolioStatusApiResponse(response);
}

export function assertFutureApiSourceUnavailableForRuntime(): void {
  readPortfolioStatusFromFutureApi();
}
