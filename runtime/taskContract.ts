export const MAX_SCOPE_CHARS = 500;
export const MAX_SCOPE_SUMMARY_CHARS = 120;

export type TaskContract = {
  run_id: string;
  task_id: string;
  slot: string;
  provider: string;
  model: string;
  motion_id: string;
  scope: string;
  input_ref: string | null;
  output_artifact_path: string;
  human_review_required: true;
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
