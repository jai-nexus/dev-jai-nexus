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
      appliedFile: string | null;
    }
  | {
      ok: false;
      error: string;
    };

const USAGE = [
  "Usage:",
  "  mark-run-reviewed.ts --run-id <run-id> --status <reviewed|approved|rejected> [--ledger <repo-relative-path>] [--applied-file <repo-relative-path>]",
  "",
  "Required:",
  "  --run-id       target run identifier in the ledger",
  "  --status       one of reviewed, approved, rejected",
  "",
  "Optional:",
  "  --ledger       repo-relative path to the ledger file (defaults to surfaces/agent-ops/run-ledger.yaml)",
  "  --applied-file repo-relative path of the file the operator applied; not allowed with --status rejected",
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

  const reviewedAt = new Date().toISOString();

  try {
    const updatedLedgerPath = updateRunReviewStatus(
      parsedArgs.runId,
      parsedArgs.status,
      reviewedAt,
      parsedArgs.appliedFile,
      parsedArgs.ledgerPath,
    );

    console.log(`run_id: ${parsedArgs.runId}`);
    console.log(`human_review_status: ${parsedArgs.status}`);
    console.log(`reviewed_at: ${reviewedAt}`);
    if (parsedArgs.appliedFile) {
      console.log(`applied_file: ${parsedArgs.appliedFile}`);
    }
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

  const appliedFileArg = args.get("--applied-file");

  if (status === "rejected" && appliedFileArg !== undefined) {
    return {
      ok: false,
      error: "--applied-file is not allowed with --status rejected",
    };
  }

  let appliedFile: string | null = null;
  if (appliedFileArg !== undefined) {
    const appliedFileResolution = resolveAppliedFile(appliedFileArg);
    if (!appliedFileResolution.ok) {
      return {
        ok: false,
        error: appliedFileResolution.error,
      };
    }
    appliedFile = appliedFileResolution.repoRelativePath;
  }

  return {
    ok: true,
    runId,
    status,
    ledgerPath,
    appliedFile,
  };
}

function isReviewUpdateStatus(value: string): value is ReviewUpdateStatus {
  return (
    value === "reviewed" ||
    value === "approved" ||
    value === "rejected"
  );
}

function resolveAppliedFile(
  rawPath: string,
): { ok: true; repoRelativePath: string } | { ok: false; error: string } {
  const repoRoot = path.resolve(process.cwd());
  const absolutePath = path.resolve(repoRoot, rawPath);
  const normalizedRepoRoot = `${repoRoot}${path.sep}`;

  if (absolutePath !== repoRoot && !absolutePath.startsWith(normalizedRepoRoot)) {
    return {
      ok: false,
      error: `applied_file must remain inside the repo: ${rawPath}`,
    };
  }

  return {
    ok: true,
    repoRelativePath: normalizePathForDisplay(path.relative(repoRoot, absolutePath)),
  };
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
