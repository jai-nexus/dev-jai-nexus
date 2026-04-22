import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  RUN_LEDGER_PATH,
  updateRunReviewStatus,
  type ReviewUpdateStatus,
} from "./runLedger.ts";

type ParsedArgs =
  | {
      ok: true;
      runId: string;
      status: ReviewUpdateStatus;
      ledgerPath: string;
    }
  | {
      ok: false;
      error: string;
    };

const USAGE = [
  "Usage:",
  "  mark-run-reviewed.ts --run-id <run-id> --status <reviewed|approved|rejected> [--ledger <repo-relative-path>]",
  "",
  "Required:",
  "  --run-id   target run identifier in the ledger",
  "  --status   one of reviewed, approved, rejected",
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
    const updatedLedgerPath = updateRunReviewStatus(
      parsedArgs.runId,
      parsedArgs.status,
      parsedArgs.ledgerPath,
    );

    console.log(`run_id: ${parsedArgs.runId}`);
    console.log(`human_review_status: ${parsedArgs.status}`);
    console.log(`ledger_path: ${normalizePathForDisplay(updatedLedgerPath)}`);
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
  const status = args.get("--status");

  if (!runId || !status) {
    return {
      ok: false,
      error: "missing required arguments: --run-id and --status are required",
    };
  }

  if (!isReviewUpdateStatus(status)) {
    return {
      ok: false,
      error: `invalid --status value: ${status}`,
    };
  }

  const ledgerArg = args.get("--ledger");
  const ledgerPath = ledgerArg
    ? path.resolve(process.cwd(), ledgerArg)
    : RUN_LEDGER_PATH;

  return {
    ok: true,
    runId,
    status,
    ledgerPath,
  };
}

function isReviewUpdateStatus(value: string): value is ReviewUpdateStatus {
  return (
    value === "reviewed" ||
    value === "approved" ||
    value === "rejected"
  );
}

function normalizePathForDisplay(targetPath: string): string {
  return targetPath.split(path.sep).join("/");
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
