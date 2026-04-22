import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  appendRunRecord,
  type RunRecord,
} from "./runLedger.ts";
import {
  dispatchSlot,
  resolveSlotConfig,
  type DispatchResult,
} from "./slotDispatch.ts";
import {
  MAX_SCOPE_CHARS,
  boundScope,
  buildScopeSummary,
  type TaskContract,
} from "./taskContract.ts";

type ParsedArgs =
  | {
      ok: true;
      slot: string;
      motion_id: string;
      task_id: string;
      scope: string;
      input_ref: string | null;
      output_path: string | null;
    }
  | {
      ok: false;
      error: string;
    };

const USAGE = [
  "Usage:",
  "  run-slot-dispatch.ts --slot <SLOT_NAME> --motion <motion-id> --task <task-id> --scope <statement> [--input-ref <ref>] [--output <repo-relative-path>]",
  "",
  "Required:",
  "  --slot     non-selector executor slot from .nexus/model-slots.yaml",
  "  --motion   motion identifier for the bounded task contract",
  "  --task     bounded task identifier for ledger and auditability",
  `  --scope    operator-supplied bounded scope statement (max ${MAX_SCOPE_CHARS} chars after truncation)`,
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

  const boundedScope = boundScope(parsedArgs.scope);
  if (!boundedScope.scope) {
    console.error("scope must not be empty after normalization");
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }

  if (boundedScope.truncated) {
    console.warn(
      `scope_note: supplied scope exceeded ${MAX_SCOPE_CHARS} chars and was truncated before dispatch`,
    );
  }

  const runId = buildRunId(parsedArgs.motion_id, parsedArgs.slot);
  const outputPathResolution = resolveOutputPath(
    parsedArgs.output_path ??
      path.join("surfaces", "agent-ops", "results", `${runId}.md`),
  );

  const slotResolution = resolveSlotConfig(parsedArgs.slot);
  const ts = new Date().toISOString();
  const scopeSummary = buildScopeSummary(boundedScope.scope);

  let provider = "unresolved";
  let model = "unresolved";
  let resultStatus: RunRecord["result_status"] = "failure";
  let failureNote: string | null = null;
  let outputArtifactPath: string | null = null;

  if (slotResolution.ok) {
    provider = slotResolution.slot.provider;
    model = slotResolution.slot.model;
  }

  if (!slotResolution.ok) {
    failureNote = slotResolution.failure_note;
  } else if (!outputPathResolution.ok) {
    failureNote = outputPathResolution.error;
  } else {
    const taskContract: TaskContract = {
      run_id: runId,
      task_id: parsedArgs.task_id,
      slot: slotResolution.slot.slot,
      provider: slotResolution.slot.provider,
      model: slotResolution.slot.model,
      motion_id: parsedArgs.motion_id,
      scope: boundedScope.scope,
      input_ref: parsedArgs.input_ref,
      output_artifact_path: outputPathResolution.repoRelativePath,
      human_review_required: true,
    };

    const dispatchResult = await dispatchSlot(taskContract);
    const appliedResult = persistDispatchResult(
      taskContract,
      dispatchResult,
      outputPathResolution.absolutePath,
      outputPathResolution.repoRelativePath,
    );

    resultStatus = appliedResult.result_status;
    failureNote = appliedResult.failure_note;
    outputArtifactPath = appliedResult.output_artifact_path;
  }

  const runRecord: RunRecord = {
    run_id: runId,
    ts,
    slot: parsedArgs.slot,
    provider,
    model,
    motion_id: parsedArgs.motion_id,
    task_ref: parsedArgs.task_id,
    scope_summary: scopeSummary,
    output_artifact_path: outputArtifactPath,
    result_status: resultStatus,
    failure_note: failureNote,
    human_review_status: "pending",
  };

  let ledgerPath: string;
  try {
    ledgerPath = appendRunRecord(runRecord);
  } catch (error) {
    console.error(`ledger_write_failure: ${getErrorMessage(error)}`);
    process.exitCode = 1;
    return;
  }

  printOperatorResult({
    run_id: runId,
    slot: parsedArgs.slot,
    provider,
    model,
    result_status: resultStatus,
    output_artifact_path: outputArtifactPath,
    failure_note: failureNote,
    ledger_path: normalizePathForDisplay(ledgerPath),
  });

  process.exitCode = resultStatus === "success" ? 0 : 1;
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

  const slot = args.get("--slot");
  const motionId = args.get("--motion");
  const taskId = args.get("--task");
  const scope = args.get("--scope");

  if (!slot || !motionId || !taskId || !scope) {
    return {
      ok: false,
      error:
        "missing required arguments: --slot, --motion, --task, and --scope are all required",
    };
  }

  return {
    ok: true,
    slot,
    motion_id: motionId,
    task_id: taskId,
    scope,
    input_ref: args.get("--input-ref") ?? null,
    output_path: args.get("--output") ?? null,
  };
}

function buildRunId(motionId: string, slot: string): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const slotSuffix = slot.toLowerCase();
  const entropy = Math.random().toString(36).slice(2, 8);

  return `${motionId}--${slotSuffix}--${timestamp}--${entropy}`;
}

function resolveOutputPath(outputPath: string):
  | {
      ok: true;
      absolutePath: string;
      repoRelativePath: string;
    }
  | {
      ok: false;
      error: string;
    } {
  const repoRoot = path.resolve(process.cwd());
  const absolutePath = path.resolve(repoRoot, outputPath);
  const normalizedRepoRoot = `${repoRoot}${path.sep}`;

  if (
    absolutePath !== repoRoot &&
    !absolutePath.startsWith(normalizedRepoRoot)
  ) {
    return {
      ok: false,
      error: "output path must remain inside the current repo",
    };
  }

  return {
    ok: true,
    absolutePath,
    repoRelativePath: normalizePathForDisplay(path.relative(repoRoot, absolutePath)),
  };
}

function persistDispatchResult(
  taskContract: TaskContract,
  dispatchResult: DispatchResult,
  absoluteOutputPath: string,
  repoRelativeOutputPath: string,
): {
  result_status: RunRecord["result_status"];
  failure_note: string | null;
  output_artifact_path: string | null;
} {
  if (!dispatchResult.ok) {
    return {
      result_status: "failure",
      failure_note: dispatchResult.failure_note,
      output_artifact_path: null,
    };
  }

  try {
    mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
    writeFileSync(
      absoluteOutputPath,
      buildOutputArtifact(taskContract, dispatchResult.output),
      "utf8",
    );

    return {
      result_status: "success",
      failure_note: null,
      output_artifact_path: repoRelativeOutputPath,
    };
  } catch (error) {
    return {
      result_status: "partial",
      failure_note: `dispatch succeeded but output artifact write failed: ${getErrorMessage(error)}`,
      output_artifact_path: null,
    };
  }
}

function buildOutputArtifact(
  taskContract: TaskContract,
  output: string,
): string {
  return [
    "# Agent Dispatch Output",
    "",
    `- run_id: ${taskContract.run_id}`,
    `- motion_id: ${taskContract.motion_id}`,
    `- task_id: ${taskContract.task_id}`,
    `- slot: ${taskContract.slot}`,
    `- provider: ${taskContract.provider}`,
    `- model: ${taskContract.model}`,
    `- input_ref: ${taskContract.input_ref ?? "null"}`,
    `- human_review_required: ${taskContract.human_review_required}`,
    "",
    "## Scope",
    "",
    taskContract.scope,
    "",
    "## Output",
    "",
    output.trim(),
    "",
  ].join("\n");
}

function normalizePathForDisplay(targetPath: string): string {
  return targetPath.split(path.sep).join("/");
}

function printOperatorResult(result: {
  run_id: string;
  slot: string;
  provider: string;
  model: string;
  result_status: RunRecord["result_status"];
  output_artifact_path: string | null;
  failure_note: string | null;
  ledger_path: string;
}): void {
  console.log(`run_id: ${result.run_id}`);
  console.log(`slot: ${result.slot}`);
  console.log(`provider: ${result.provider}`);
  console.log(`model: ${result.model}`);
  console.log(`result_status: ${result.result_status}`);

  if (result.output_artifact_path) {
    console.log(`output_artifact_path: ${result.output_artifact_path}`);
  }

  if (result.failure_note) {
    console.log(`failure_note: ${result.failure_note}`);
  }

  console.log(`ledger_path: ${result.ledger_path}`);
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
