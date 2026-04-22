import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

export type RunRecord = {
  run_id: string;
  ts: string;
  slot: string;
  provider: string;
  model: string;
  motion_id: string;
  task_ref: string;
  scope_summary: string;
  output_artifact_path: string | null;
  result_status: "success" | "failure" | "partial";
  failure_note: string | null;
  human_review_status: "pending" | "reviewed" | "approved" | "rejected";
};

const LEDGER_DIR_PATH = path.join(process.cwd(), "surfaces", "agent-ops");
export const RUN_LEDGER_PATH = path.join(LEDGER_DIR_PATH, "run-ledger.yaml");

const LEDGER_HEADER_LINES = [
  "# Agent ops run ledger for motion-0150 runtime-minimum dispatch runs.",
  "# Append one top-level YAML sequence entry per operator-invoked dispatch.",
];

const EMPTY_LEDGER_CONTENT = `${LEDGER_HEADER_LINES.join("\n")}\n[]\n`;

export function appendRunRecord(runRecord: RunRecord): string {
  mkdirSync(LEDGER_DIR_PATH, { recursive: true });

  if (!existsSync(RUN_LEDGER_PATH)) {
    writeFileSync(RUN_LEDGER_PATH, EMPTY_LEDGER_CONTENT, "utf8");
  }

  const currentContent = readFileSync(RUN_LEDGER_PATH, "utf8");
  const recordBlock = formatRunRecordBlock(runRecord);

  if (isEmptyLedger(currentContent)) {
    writeFileSync(
      RUN_LEDGER_PATH,
      `${LEDGER_HEADER_LINES.join("\n")}\n${recordBlock}\n`,
      "utf8",
    );
    return RUN_LEDGER_PATH;
  }

  const separator = currentContent.endsWith("\n") ? "" : "\n";
  appendFileSync(RUN_LEDGER_PATH, `${separator}${recordBlock}\n`, "utf8");

  return RUN_LEDGER_PATH;
}

function isEmptyLedger(source: string): boolean {
  const normalized = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .join("\n");

  return normalized === "" || normalized === "[]";
}

function formatRunRecordBlock(runRecord: RunRecord): string {
  return [
    `- run_id: ${yamlScalar(runRecord.run_id)}`,
    `  ts: ${yamlScalar(runRecord.ts)}`,
    `  slot: ${yamlScalar(runRecord.slot)}`,
    `  provider: ${yamlScalar(runRecord.provider)}`,
    `  model: ${yamlScalar(runRecord.model)}`,
    `  motion_id: ${yamlScalar(runRecord.motion_id)}`,
    `  task_ref: ${yamlScalar(runRecord.task_ref)}`,
    `  scope_summary: ${yamlScalar(runRecord.scope_summary)}`,
    `  output_artifact_path: ${yamlNullableScalar(runRecord.output_artifact_path)}`,
    `  result_status: ${yamlScalar(runRecord.result_status)}`,
    `  failure_note: ${yamlNullableScalar(runRecord.failure_note)}`,
    `  human_review_status: ${yamlScalar(runRecord.human_review_status)}`,
  ].join("\n");
}

function yamlScalar(value: string): string {
  return JSON.stringify(value);
}

function yamlNullableScalar(value: string | null): string {
  return value === null ? "null" : yamlScalar(value);
}
