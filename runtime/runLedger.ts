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
export type PreflightResult =
  | { ok: true }
  | { ok: false; reason: string };
export type RunProofSurface = {
  run_id: string;
  motion_id: string | null;
  task_id: string;
  slot: string;
  provider: string;
  model: string;
  ts: string;
  current_run_state: "latest_live" | "historical_live_not_latest" | "superseded";
  result_status: ResultStatus;
  failure_note: string | null;
  output_artifact_path: string | null;
  output_artifact_exists: boolean | null;
  human_review_status: ReviewStatus;
  reviewed_at: string | null;
  applied_file: string | null;
  applied_file_exists: boolean | null;
  attempt: number | null;
  attempt_display: string;
  supersedes: string | null;
  superseded_by: string | null;
  latest_live_run_id: string | null;
  latest_live_ts: string | null;
  admissibility_state_now:
    | "fresh_start_allowed"
    | "requires_supersedes"
    | "blocked_review_final";
  admissibility_reason_now: string;
  lineage_note: string | null;
};

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
const FINAL_ACCEPTED_REVIEW_STATUSES: ReviewStatus[] = ["reviewed", "approved"];

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

export function checkDispatchAdmissibility(
  motionId: string | null,
  taskId: string,
  supersedes: string | null,
  ledgerPath: string = RUN_LEDGER_PATH,
): PreflightResult {
  let entries: StoredLedgerEntry[] = [];
  try {
    entries = readLedgerEntriesIfPresent(ledgerPath);
  } catch (error) {
    return preflightFailure(getErrorMessage(error));
  }

  const liveEntries = getLiveLineageEntries(entries, motionId, taskId);

  if (liveEntries.length === 0) {
    if (supersedes !== null) {
      return preflightFailure(
        "no active entry for this task; --supersedes is not valid here",
      );
    }

    return { ok: true };
  }

  const latestLiveEntry = getLatestEntryByTimestamp(liveEntries);
  if (!latestLiveEntry) {
    return { ok: true };
  }

  if (supersedes === null) {
    return preflightFailure(
      `prior non-superseded entry exists for this task; supply --supersedes ${latestLiveEntry.run_id}`,
    );
  }

  const supersededEntry = entries.find((entry) => entry.run_id === supersedes);
  if (!supersededEntry) {
    return preflightFailure(`supersedes run_id not found: ${supersedes}`);
  }

  if (supersededEntry.motion_id !== motionId) {
    return preflightFailure(
      `supersedes motion_id mismatch: expected ${motionId ?? "null"}, found ${supersededEntry.motion_id ?? "null"}`,
    );
  }

  if (supersededEntry.task_id !== taskId) {
    return preflightFailure(
      `supersedes task_id mismatch: expected ${taskId}, found ${supersededEntry.task_id}`,
    );
  }

  if (supersededEntry.superseded_by !== null) {
    return preflightFailure(
      `run-id ${supersedes} is already superseded; it cannot be used as a supersession target`,
    );
  }

  if (supersededEntry.run_id !== latestLiveEntry.run_id) {
    return preflightFailure(
      `--supersedes must reference the latest non-superseded entry (latest: ${latestLiveEntry.run_id}, got: ${supersedes})`,
    );
  }

  if (isAcceptedFinalReviewStatus(supersededEntry.human_review_status)) {
    return preflightFailure(
      `run-id ${supersedes} has review status "${supersededEntry.human_review_status}"; cannot supersede a reviewed or approved entry`,
    );
  }

  return { ok: true };
}

export function buildRunProofSurface(
  runId: string,
  ledgerPath: string = RUN_LEDGER_PATH,
): RunProofSurface {
  const entries = readLedgerEntries(ledgerPath);

  if (entries.length === 0) {
    throw new Error("run ledger contains no run entries");
  }

  const targetEntry = entries.find((entry) => entry.run_id === runId);
  if (!targetEntry) {
    throw new Error(`run_id not found: ${runId}`);
  }

  const lineageEntries = entries.filter(
    (entry) =>
      entry.motion_id === targetEntry.motion_id &&
      entry.task_id === targetEntry.task_id,
  );
  const liveEntries = getLiveLineageEntries(
    entries,
    targetEntry.motion_id,
    targetEntry.task_id,
  );
  const latestLiveEntry = getLatestEntryByTimestamp(liveEntries);
  const currentRunState = getCurrentRunState(targetEntry, latestLiveEntry);
  const admissibility = buildAdmissibilityState(latestLiveEntry);

  return {
    run_id: targetEntry.run_id,
    motion_id: targetEntry.motion_id,
    task_id: targetEntry.task_id,
    slot: targetEntry.slot,
    provider: targetEntry.provider,
    model: targetEntry.model,
    ts: targetEntry.ts,
    current_run_state: currentRunState,
    result_status: targetEntry.result_status,
    failure_note: targetEntry.failure_note,
    output_artifact_path: targetEntry.output_artifact_path,
    output_artifact_exists: getRepoRelativePathExists(
      targetEntry.output_artifact_path,
    ),
    human_review_status: targetEntry.human_review_status,
    reviewed_at: targetEntry.reviewed_at,
    applied_file: targetEntry.applied_file,
    applied_file_exists: getRepoRelativePathExists(targetEntry.applied_file),
    attempt: targetEntry.attempt,
    attempt_display:
      targetEntry.attempt === null
        ? "legacy/not-recorded"
        : String(targetEntry.attempt),
    supersedes: targetEntry.supersedes,
    superseded_by: targetEntry.superseded_by,
    latest_live_run_id: latestLiveEntry?.run_id ?? null,
    latest_live_ts: latestLiveEntry?.ts ?? null,
    admissibility_state_now: admissibility.state,
    admissibility_reason_now: admissibility.reason,
    lineage_note: buildLineageNote(
      targetEntry,
      latestLiveEntry,
      currentRunState,
      lineageEntries.length,
    ),
  };
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

function readLedgerEntriesIfPresent(ledgerPath: string): StoredLedgerEntry[] {
  if (!existsSync(ledgerPath)) {
    return [];
  }

  return readLedgerEntries(ledgerPath);
}

function readLedgerEntries(ledgerPath: string): StoredLedgerEntry[] {
  let source: string;
  try {
    source = readFileSync(ledgerPath, "utf8");
  } catch (error) {
    throw new Error(
      `run ledger not readable: ${ledgerPath} (${getErrorMessage(error)})`,
    );
  }

  try {
    return isEmptyLedger(source) ? [] : parseLedgerSequence(source);
  } catch (error) {
    throw new Error(`run ledger parse failed: ${getErrorMessage(error)}`);
  }
}

function preflightFailure(reason: string): PreflightResult {
  return {
    ok: false,
    reason: `preflight_failure: ${reason}`,
  };
}

function getCurrentRunState(
  targetEntry: StoredLedgerEntry,
  latestLiveEntry: StoredLedgerEntry | null,
): RunProofSurface["current_run_state"] {
  if (targetEntry.superseded_by !== null) {
    return "superseded";
  }

  if (latestLiveEntry?.run_id === targetEntry.run_id) {
    return "latest_live";
  }

  return "historical_live_not_latest";
}

function buildAdmissibilityState(
  latestLiveEntry: StoredLedgerEntry | null,
): {
  state: RunProofSurface["admissibility_state_now"];
  reason: string;
} {
  if (!latestLiveEntry) {
    return {
      state: "fresh_start_allowed",
      reason:
        "No live entry exists for this motion/task lineage; a fresh dispatch may proceed without --supersedes.",
    };
  }

  if (isAcceptedFinalReviewStatus(latestLiveEntry.human_review_status)) {
    return {
      state: "blocked_review_final",
      reason: `run-id ${latestLiveEntry.run_id} has review status "${latestLiveEntry.human_review_status}"; cannot supersede a reviewed or approved entry`,
    };
  }

  return {
    state: "requires_supersedes",
    reason: `prior non-superseded entry exists for this task; supply --supersedes ${latestLiveEntry.run_id}`,
  };
}

function buildLineageNote(
  targetEntry: StoredLedgerEntry,
  latestLiveEntry: StoredLedgerEntry | null,
  currentRunState: RunProofSurface["current_run_state"],
  lineageEntryCount: number,
): string | null {
  const notes: string[] = [];

  if (targetEntry.attempt === null) {
    notes.push(
      "Legacy pre-motion-0154 entry: attempt lineage fields were not recorded at write time.",
    );
  }

  if (currentRunState === "superseded" && targetEntry.superseded_by) {
    notes.push(`This run has been superseded by ${targetEntry.superseded_by}.`);
  } else if (
    currentRunState === "historical_live_not_latest" &&
    latestLiveEntry
  ) {
    notes.push(
      `This run remains live but is not the latest live entry; latest live run is ${latestLiveEntry.run_id}.`,
    );
  } else if (currentRunState === "latest_live") {
    notes.push("This run is the latest live entry for its lineage.");
  }

  if (lineageEntryCount > 1) {
    notes.push(`Lineage entry count: ${lineageEntryCount}.`);
  }

  return notes.length > 0 ? notes.join(" ") : null;
}

function getLiveLineageEntries(
  entries: StoredLedgerEntry[],
  motionId: string | null,
  taskId: string,
): StoredLedgerEntry[] {
  return entries.filter(
    (entry) =>
      entry.motion_id === motionId &&
      entry.task_id === taskId &&
      entry.superseded_by === null,
  );
}

function getLatestEntryByTimestamp(
  entries: StoredLedgerEntry[],
): StoredLedgerEntry | null {
  if (entries.length === 0) {
    return null;
  }

  return entries.reduce((latest, current) =>
    current.ts > latest.ts ? current : latest,
  );
}

function isAcceptedFinalReviewStatus(status: ReviewStatus): boolean {
  return FINAL_ACCEPTED_REVIEW_STATUSES.includes(status);
}

function getRepoRelativePathExists(rawPath: string | null): boolean | null {
  if (rawPath === null) {
    return null;
  }

  const repoRoot = path.resolve(process.cwd());
  const absolutePath = path.resolve(repoRoot, rawPath);
  const normalizedRepoRoot = `${repoRoot}${path.sep}`;

  if (
    absolutePath !== repoRoot &&
    !absolutePath.startsWith(normalizedRepoRoot)
  ) {
    return false;
  }

  return existsSync(absolutePath);
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
