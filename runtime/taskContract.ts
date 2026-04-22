export const MAX_SCOPE_CHARS = 500;
export const MAX_SCOPE_SUMMARY_CHARS = 120;

export type ExecutionMode = "review_only" | "bounded_write";

export type TaskContract = {
  run_id: string;
  task_id: string;
  slot: string;
  provider: string;
  model: string;
  motion_id?: string | null;
  scope?: string;
  objective?: string;
  allowed_scope?: string[];
  forbidden_actions?: string[];
  expected_output?: string;
  execution_mode?: ExecutionMode;
  input_ref: string | null;
  output_artifact_path: string;
  human_review_required: true;
};

export type ResolvedTaskContract = {
  run_id: string;
  task_id: string;
  slot: string;
  provider: string;
  model: string;
  motion_id: string | null;
  objective: string;
  allowed_scope: string[];
  forbidden_actions: string[];
  expected_output: string;
  execution_mode: ExecutionMode;
  input_ref: string | null;
  output_artifact_path: string;
  human_review_required: true;
};

const DEFAULT_EXPECTED_OUTPUT_BY_MODE: Record<ExecutionMode, string> = {
  review_only:
    "Produce a bounded human-reviewable artifact with analysis, verification, or summary content only.",
  bounded_write:
    "Produce bounded implementation-class output for operator review and manual application only.",
};

const DEFAULT_FORBIDDEN_ACTIONS_BY_MODE: Record<ExecutionMode, string[]> = {
  review_only: [
    "Do not claim repo mutation or runtime mutation.",
    "Do not perform or claim direct file writes.",
    "Do not commit, push, open pull requests, or merge changes.",
    "Do not start background execution, autonomous loops, or controller behavior.",
  ],
  bounded_write: [
    "Do not perform or claim direct file writes.",
    "Do not commit, push, open pull requests, or merge changes.",
    "Do not start background execution, autonomous loops, or controller behavior.",
    "Do not read additional files beyond the single operator-supplied input_ref content.",
  ],
};

export function normalizeScopeInput(scope: string): string {
  return scope.replace(/\s+/g, " ").trim();
}

export function boundScope(scope: string): {
  scope: string;
  truncated: boolean;
} {
  const normalized = normalizeScopeInput(scope);
  const bounded = normalized.slice(0, MAX_SCOPE_CHARS);

  return {
    scope: bounded,
    truncated: normalized.length > MAX_SCOPE_CHARS,
  };
}

export function buildScopeSummary(scope: string): string {
  const normalized = normalizeScopeInput(scope);
  return normalized.slice(0, MAX_SCOPE_SUMMARY_CHARS);
}

export function resolveTaskContract(
  taskContract: TaskContract,
): ResolvedTaskContract {
  const executionMode = taskContract.execution_mode ?? "review_only";
  const objective = normalizeScopeInput(
    taskContract.objective ?? taskContract.scope ?? "",
  );
  const allowedScope = normalizeStringList(
    taskContract.allowed_scope ?? (objective ? [objective] : []),
  );
  const forbiddenActions = normalizeStringList(
    taskContract.forbidden_actions ??
      DEFAULT_FORBIDDEN_ACTIONS_BY_MODE[executionMode],
  );
  const expectedOutput = normalizeScopeInput(
    taskContract.expected_output ??
      DEFAULT_EXPECTED_OUTPUT_BY_MODE[executionMode],
  );

  return {
    run_id: taskContract.run_id,
    task_id: taskContract.task_id,
    slot: taskContract.slot,
    provider: taskContract.provider,
    model: taskContract.model,
    motion_id: taskContract.motion_id ?? null,
    objective,
    allowed_scope: allowedScope,
    forbidden_actions: forbiddenActions,
    expected_output: expectedOutput,
    execution_mode: executionMode,
    input_ref: taskContract.input_ref,
    output_artifact_path: taskContract.output_artifact_path,
    human_review_required: true,
  };
}

function normalizeStringList(values: string[]): string[] {
  return values
    .map((value) => normalizeScopeInput(value))
    .filter((value) => value.length > 0);
}
