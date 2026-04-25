import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  RUN_LEDGER_PATH,
  buildRunProofSurface,
  type RunProofSurface,
} from "./runLedger.ts";

type ParsedArgs =
  | {
      ok: true;
      runId: string;
      ledgerPath: string;
    }
  | {
      ok: false;
      error: string;
    };

const USAGE = [
  "Usage:",
  "  show-run-proof.ts --run-id <run-id> [--ledger <repo-relative-path>]",
  "",
  "Required:",
  "  --run-id  target run identifier to inspect",
  "",
  "Optional:",
  "  --ledger  repo-relative path to the ledger file (defaults to surfaces/agent-ops/run-ledger.yaml)",
  "",
  "Notes:",
  "  This command is read-only and prints the current proof review surface for one run id.",
].join("\n");

async function main(): Promise<void> {
  if (process.argv.slice(2).includes("--help")) {
    console.log(USAGE);
    process.exitCode = 0;
    return;
  }

  const parsedArgs = parseArgs(process.argv.slice(2));
  if (!parsedArgs.ok) {
    console.error(parsedArgs.error);
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }

  try {
    const surface = buildRunProofSurface(parsedArgs.runId, parsedArgs.ledgerPath);
    console.log(
      renderProofSurface(
        surface,
        normalizePathForDisplay(parsedArgs.ledgerPath),
      ),
    );
  } catch (error) {
    console.error(getErrorMessage(error));
    process.exitCode = 1;
  }
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = new Map<string, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("--")) {
      return {
        ok: false,
        error: `unexpected argument: ${arg}`,
      };
    }

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      return {
        ok: false,
        error: `missing value for ${arg}`,
      };
    }

    args.set(arg, value);
    index += 1;
  }

  const runId = args.get("--run-id");
  if (!runId) {
    return {
      ok: false,
      error: "missing required argument: --run-id",
    };
  }

  const ledgerArg = args.get("--ledger");
  const ledgerResolution = ledgerArg
    ? resolveLedgerPath(ledgerArg)
    : { ok: true as const, absolutePath: RUN_LEDGER_PATH };

  if (!ledgerResolution.ok) {
    return {
      ok: false,
      error: ledgerResolution.error,
    };
  }

  return {
    ok: true,
    runId,
    ledgerPath: ledgerResolution.absolutePath,
  };
}

function resolveLedgerPath(
  rawPath: string,
): { ok: true; absolutePath: string } | { ok: false; error: string } {
  const repoRoot = path.resolve(process.cwd());
  const absolutePath = path.resolve(repoRoot, rawPath);
  const normalizedRepoRoot = `${repoRoot}${path.sep}`;

  if (
    absolutePath !== repoRoot &&
    !absolutePath.startsWith(normalizedRepoRoot)
  ) {
    return {
      ok: false,
      error: `ledger path must remain inside the repo: ${rawPath}`,
    };
  }

  return {
    ok: true,
    absolutePath,
  };
}

function renderProofSurface(
  surface: RunProofSurface,
  ledgerPath: string,
): string {
  return [
    "Run Proof Review",
    `run_id: ${surface.run_id}`,
    `motion_id: ${renderNullable(surface.motion_id)}`,
    `task_id: ${surface.task_id}`,
    `slot: ${surface.slot}`,
    `provider: ${surface.provider}`,
    `model: ${surface.model}`,
    `ts: ${surface.ts}`,
    "",
    `current_run_state: ${surface.current_run_state}`,
    `result_status: ${surface.result_status}`,
    `failure_note: ${renderNullable(surface.failure_note)}`,
    `output_artifact_path: ${renderNullable(surface.output_artifact_path)}`,
    `output_artifact_exists: ${renderNullableBoolean(surface.output_artifact_exists)}`,
    "",
    `human_review_status: ${surface.human_review_status}`,
    `reviewed_at: ${renderNullable(surface.reviewed_at)}`,
    `applied_file: ${renderNullable(surface.applied_file)}`,
    `applied_file_exists: ${renderNullableBoolean(surface.applied_file_exists)}`,
    "",
    `attempt: ${renderNullableNumber(surface.attempt)}`,
    `attempt_display: ${surface.attempt_display}`,
    `supersedes: ${renderNullable(surface.supersedes)}`,
    `superseded_by: ${renderNullable(surface.superseded_by)}`,
    `latest_live_run_id: ${renderNullable(surface.latest_live_run_id)}`,
    `latest_live_ts: ${renderNullable(surface.latest_live_ts)}`,
    `admissibility_state_now: ${surface.admissibility_state_now}`,
    `admissibility_reason_now: ${surface.admissibility_reason_now}`,
    `lineage_note: ${renderNullable(surface.lineage_note)}`,
    `ledger_path: ${ledgerPath}`,
  ].join("\n");
}

function renderNullable(value: string | null): string {
  return value ?? "null";
}

function renderNullableNumber(value: number | null): string {
  return value === null ? "null" : String(value);
}

function renderNullableBoolean(value: boolean | null): string {
  return value === null ? "null" : String(value);
}

function normalizePathForDisplay(targetPath: string): string {
  const repoRoot = path.resolve(process.cwd());
  const relativePath = path.relative(repoRoot, targetPath);
  const preferredPath = relativePath.length > 0 ? relativePath : targetPath;

  return preferredPath.split(path.sep).join("/");
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}

if (process.argv[1]) {
  const invokedUrl = pathToFileURL(path.resolve(process.argv[1])).href;
  if (import.meta.url === invokedUrl) {
    void main();
  }
}
