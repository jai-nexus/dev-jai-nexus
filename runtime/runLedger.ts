import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

export type ResultStatus = "success" | "failure" | "partial";
export type ReviewStatus = "pending" | "reviewed" | "approved" | "rejected";
export type ReviewUpdateStatus = Exclude<ReviewStatus, "pending">;

export type RunRecord = {
  run_id: string;
  ts: string;
  slot: string;
  provider: string;
  model: string;
  motion_id: string | null;
  task_id: string;
  scope_summary: string;
  output_artifact_path: string | null;
  result_status: ResultStatus;
  failure_note: string | null;
  human_review_status: ReviewStatus;
  supersedes?: string | null;
};

type LegacyRunRecordInput = Omit<RunRecord, "task_id"> & {
  task_id?: string;
  task_ref?: string;
};

type StoredLedgerEntry = RunRecord & {
  task_field_name: "task_id" | "task_ref";
  attempt: number | null;
  supersedes: string | null;
  reviewed_at: string | null;
  applied_file: string | null;
  superseded_by: string | null;
};

const LEDGER_DIR_PATH = path.join(process.cwd(), "surfaces", "agent-ops");
export const RUN_LEDGER_PATH = path.join(LEDGER_DIR_PATH, "run-ledger.yaml");

const LEDGER_HEADER_LINES = [
  "# JAI NEXUS agent ops run ledger.",
  "# Append one top-level YAML sequence entry per operator-invoked run.",
];

const EMPTY_LEDGER_CONTENT = `${LEDGER_HEADER_LINES.join("\n")}\n[]\n`;

export function appendRunRecord(
  runRecord: RunRecord | LegacyRunRecordInput,
): string {
  mkdirSync(LEDGER_DIR_PATH, { recursive: true });

  let currentContent: string;
  if (!existsSync(RUN_LEDGER_PATH)) {
    currentContent = EMPTY_LEDGER_CONTENT;
    writeFileSync(RUN_LEDGER_PATH, currentContent, "utf8");
  } else {
    currentContent = readFileSync(RUN_LEDGER_PATH, "utf8");
  }

  const existingEntries = isEmptyLedger(currentContent)
    ? []
    : parseLedgerSequence(currentContent);

  const motionId = runRecord.motion_id ?? null;
  const taskIdForCount = getTaskIdForRecord(runRecord);
  const priorAttempts = existingEntries.filter(
    (e) => e.motion_id === motionId && e.task_id === taskIdForCount,
  ).length;
  const attempt = priorAttempts + 1;

  const storedEntry = normalizeRunRecordInput(runRecord, attempt);

  if (storedEntry.supersedes !== null) {
    const supersededEntry = existingEntries.find(
      (e) => e.run_id === storedEntry.supersedes,
    );
    if (!supersededEntry) {
      throw new Error(`supersedes run_id not found: ${storedEntry.supersedes}`);
    }
    supersededEntry.superseded_by = storedEntry.run_id;
  }

  const allEntries = [...existingEntries, storedEntry];
  writeFileSync(RUN_LEDGER_PATH, formatLedgerFile(allEntries), "utf8");

  return RUN_LEDGER_PATH;
}

export function updateRunReviewStatus(
  runId: string,
  status: ReviewUpdateStatus,
  reviewedAt: string,
  appliedFile: string | null,
  ledgerPath: string = RUN_LEDGER_PATH,
): string {
  let source: string;
  try {
    source = readFileSync(ledgerPath, "utf8");
  } catch (error) {
    throw new Error(
      `run ledger not readable: ${ledgerPath} (${getErrorMessage(error)})`,
    );
  }

  const entries = parseLedgerSequence(source);
  const targetEntry = entries.find((entry) => entry.run_id === runId);

  if (!targetEntry) {
    throw new Error(`run_id not found: ${runId}`);
  }

  targetEntry.human_review_status = status;
  targetEntry.reviewed_at = reviewedAt;
  targetEntry.applied_file = appliedFile;
  writeFileSync(ledgerPath, formatLedgerFile(entries), "utf8");

  return ledgerPath;
}

function getTaskIdForRecord(
  runRecord: RunRecord | LegacyRunRecordInput,
): string {
  if (
    "task_id" in runRecord &&
    typeof runRecord.task_id === "string" &&
    runRecord.task_id.length > 0
  ) {
    return runRecord.task_id;
  }
  if (
    "task_ref" in runRecord &&
    typeof runRecord.task_ref === "string" &&
    runRecord.task_ref.length > 0
  ) {
    return runRecord.task_ref;
  }
  return "";
}

function normalizeRunRecordInput(
  runRecord: RunRecord | LegacyRunRecordInput,
  attempt: number | null,
): StoredLedgerEntry {
  const hasCanonicalTaskId =
    "task_id" in runRecord &&
    typeof runRecord.task_id === "string" &&
    runRecord.task_id.length > 0;

  const legacyTaskId =
    "task_ref" in runRecord &&
    typeof runRecord.task_ref === "string" &&
    runRecord.task_ref.length > 0
      ? runRecord.task_ref
      : undefined;

  const taskId = hasCanonicalTaskId ? runRecord.task_id : legacyTaskId;

  if (!taskId) {
    throw new Error("run record missing canonical task identifier");
  }

  return {
    run_id: runRecord.run_id,
    ts: runRecord.ts,
    slot: runRecord.slot,
    provider: runRecord.provider,
    model: runRecord.model,
    motion_id: runRecord.motion_id ?? null,
    task_id: taskId,
    scope_summary: runRecord.scope_summary,
    output_artifact_path: runRecord.output_artifact_path,
    result_status: runRecord.result_status,
    failure_note: runRecord.failure_note,
    human_review_status: runRecord.human_review_status,
    task_field_name: hasCanonicalTaskId ? "task_id" : "task_ref",
    attempt,
    supersedes: runRecord.supersedes ?? null,
    reviewed_at: null,
    applied_file: null,
    superseded_by: null,
  };
}

function isEmptyLedger(source: string): boolean {
  const normalized = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .join("\n");

  return normalized === "" || normalized === "[]";
}

function parseLedgerSequence(source: string): StoredLedgerEntry[] {
  const normalized = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  if (normalized.length === 0 || normalized.join("\n") === "[]") {
    return [];
  }

  if (!normalized[0].startsWith("- ")) {
    throw new Error("run ledger must be a YAML sequence");
  }

  const parsedEntries: StoredLedgerEntry[] = [];
  let currentEntry: Partial<StoredLedgerEntry> | null = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith("#") || trimmed === "[]") {
      continue;
    }

    const firstFieldMatch = rawLine.match(/^- ([a-z_]+):\s*(.*)$/);
    if (firstFieldMatch) {
      if (currentEntry) {
        parsedEntries.push(finalizeParsedEntry(currentEntry));
      }

      currentEntry = {};
      applyParsedField(currentEntry, firstFieldMatch[1], firstFieldMatch[2]);
      continue;
    }

    const fieldMatch = rawLine.match(/^  ([a-z_]+):\s*(.*)$/);
    if (fieldMatch && currentEntry) {
      applyParsedField(currentEntry, fieldMatch[1], fieldMatch[2]);
      continue;
    }

    throw new Error("run ledger must be a YAML sequence");
  }

  if (currentEntry) {
    parsedEntries.push(finalizeParsedEntry(currentEntry));
  }

  return parsedEntries;
}

function applyParsedField(
  entry: Partial<StoredLedgerEntry>,
  fieldName: string,
  rawValue: string,
): void {
  const parsedValue = parseYamlValue(rawValue);

  switch (fieldName) {
    case "run_id":
    case "ts":
    case "slot":
    case "provider":
    case "model":
    case "scope_summary":
      entry[fieldName] = expectStringField(fieldName, parsedValue);
      return;
    case "motion_id":
      entry.motion_id = parsedValue;
      return;
    case "task_id":
      entry.task_id = expectStringField(fieldName, parsedValue);
      entry.task_field_name = "task_id";
      return;
    case "task_ref":
      entry.task_id = expectStringField(fieldName, parsedValue);
      entry.task_field_name = "task_ref";
      return;
    case "attempt":
      entry.attempt =
        parsedValue === null
          ? null
          : expectPositiveIntegerField(fieldName, parsedValue);
      return;
    case "supersedes":
      entry.supersedes = parsedValue;
      return;
    case "output_artifact_path":
      entry.output_artifact_path = parsedValue;
      return;
    case "result_status":
      entry.result_status = expectResultStatus(parsedValue);
      return;
    case "failure_note":
      entry.failure_note = parsedValue;
      return;
    case "human_review_status":
      entry.human_review_status = expectReviewStatus(parsedValue);
      return;
    case "reviewed_at":
      entry.reviewed_at = parsedValue;
      return;
    case "applied_file":
      entry.applied_file = parsedValue;
      return;
    case "superseded_by":
      entry.superseded_by = parsedValue;
      return;
    default:
      return;
  }
}

function finalizeParsedEntry(
  entry: Partial<StoredLedgerEntry>,
): StoredLedgerEntry {
  if (!entry.run_id || !entry.ts || !entry.slot || !entry.provider) {
    throw new Error("run ledger entry missing required identity fields");
  }

  if (!entry.model || !entry.task_id || !entry.scope_summary) {
    throw new Error("run ledger entry missing required task fields");
  }

  if (!entry.result_status || !entry.human_review_status) {
    throw new Error("run ledger entry missing required result fields");
  }

  return {
    run_id: entry.run_id,
    ts: entry.ts,
    slot: entry.slot,
    provider: entry.provider,
    model: entry.model,
    motion_id: entry.motion_id ?? null,
    task_id: entry.task_id,
    scope_summary: entry.scope_summary,
    output_artifact_path: entry.output_artifact_path ?? null,
    result_status: entry.result_status,
    failure_note: entry.failure_note ?? null,
    human_review_status: entry.human_review_status,
    task_field_name: entry.task_field_name ?? "task_id",
    attempt: entry.attempt ?? null,
    supersedes: entry.supersedes ?? null,
    reviewed_at: entry.reviewed_at ?? null,
    applied_file: entry.applied_file ?? null,
    superseded_by: entry.superseded_by ?? null,
  };
}

function formatLedgerFile(entries: StoredLedgerEntry[]): string {
  if (entries.length === 0) {
    return EMPTY_LEDGER_CONTENT;
  }

  const recordBlocks = entries
    .map((entry) => formatRunRecordBlock(entry))
    .join("\n");

  return `${LEDGER_HEADER_LINES.join("\n")}\n${recordBlocks}\n`;
}

function formatRunRecordBlock(runRecord: StoredLedgerEntry): string {
  const taskFieldName = runRecord.task_field_name;

  return [
    `- run_id: ${yamlScalar(runRecord.run_id)}`,
    `  ts: ${yamlScalar(runRecord.ts)}`,
    `  slot: ${yamlScalar(runRecord.slot)}`,
    `  provider: ${yamlScalar(runRecord.provider)}`,
    `  model: ${yamlScalar(runRecord.model)}`,
    `  motion_id: ${yamlNullableScalar(runRecord.motion_id)}`,
    `  ${taskFieldName}: ${yamlScalar(runRecord.task_id)}`,
    `  attempt: ${yamlNullableInteger(runRecord.attempt)}`,
    `  supersedes: ${yamlNullableScalar(runRecord.supersedes)}`,
    `  scope_summary: ${yamlScalar(runRecord.scope_summary)}`,
    `  output_artifact_path: ${yamlNullableScalar(runRecord.output_artifact_path)}`,
    `  result_status: ${yamlScalar(runRecord.result_status)}`,
    `  failure_note: ${yamlNullableScalar(runRecord.failure_note)}`,
    `  human_review_status: ${yamlScalar(runRecord.human_review_status)}`,
    `  reviewed_at: ${yamlNullableScalar(runRecord.reviewed_at)}`,
    `  applied_file: ${yamlNullableScalar(runRecord.applied_file)}`,
    `  superseded_by: ${yamlNullableScalar(runRecord.superseded_by)}`,
  ].join("\n");
}

function parseYamlValue(rawValue: string): string | null {
  const trimmed = rawValue.trim();

  if (trimmed === "null") {
    return null;
  }

  if (trimmed.startsWith('"')) {
    return JSON.parse(trimmed) as string;
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function expectStringField(fieldName: string, value: string | null): string {
  if (value === null) {
    throw new Error(`run ledger field must be a string: ${fieldName}`);
  }

  return value;
}

function expectPositiveIntegerField(fieldName: string, value: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`run ledger field must be a positive integer: ${fieldName}`);
  }
  return n;
}

function expectResultStatus(value: string | null): ResultStatus {
  if (value === "success" || value === "failure" || value === "partial") {
    return value;
  }

  throw new Error("run ledger field must be a valid result_status");
}

function expectReviewStatus(value: string | null): ReviewStatus {
  if (
    value === "pending" ||
    value === "reviewed" ||
    value === "approved" ||
    value === "rejected"
  ) {
    return value;
  }

  throw new Error("run ledger field must be a valid human_review_status");
}

function yamlScalar(value: string): string {
  return JSON.stringify(value);
}

function yamlNullableScalar(value: string | null): string {
  return value === null ? "null" : yamlScalar(value);
}

function yamlNullableInteger(value: number | null): string {
  return value === null ? "null" : String(value);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}
