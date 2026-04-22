> Provenance:
> Reviewed run_id: `motion-0152--slot_builder_01--20260422T190831Z--c281lr`
> Applied from artifact: `surfaces/agent-ops/results/motion-0152--slot_builder_01--20260422T190831Z--c281lr.md`

# Task Contract v0

This document defines the contract fields, constants/defaults, and the precise resolution behavior implemented in `runtime/taskContract.ts`.

## ExecutionMode

- `review_only`
- `bounded_write`

## Constants and defaults

- `MAX_SCOPE_CHARS = 500`
- `MAX_SCOPE_SUMMARY_CHARS = 120`

Default expected output per mode:
```ts
const DEFAULT_EXPECTED_OUTPUT_BY_MODE: Record<ExecutionMode, string> = {
  review_only:
    "Produce a bounded human-reviewable artifact with analysis, verification, or summary content only.",
  bounded_write:
    "Produce bounded implementation-class output for operator review and manual application only.",
};
```

Default forbidden actions per mode:
```ts
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
```

## TaskContract fields

- `run_id: string`
- `task_id: string`
- `slot: string`
- `provider: string`
- `model: string`
- `motion_id?: string | null`
- `scope?: string`
- `objective?: string`
- `allowed_scope?: string[]`
- `forbidden_actions?: string[]`
- `expected_output?: string`
- `execution_mode?: ExecutionMode`
- `input_ref: string | null`
- `output_artifact_path: string`
- `human_review_required: true`

Notes:
- `scope` is only used as a fallback source for `objective` during resolution; it is not present in `ResolvedTaskContract`.
- `human_review_required` is a literal `true` (non-optional).

## ResolvedTaskContract fields

- `run_id: string`
- `task_id: string`
- `slot: string`
- `provider: string`
- `model: string`
- `motion_id: string | null`
- `objective: string`
- `allowed_scope: string[]`
- `forbidden_actions: string[]`
- `expected_output: string`
- `execution_mode: ExecutionMode`
- `input_ref: string | null`
- `output_artifact_path: string`
- `human_review_required: true`

Notes:
- All string fields derived from freeform input (`objective`, `expected_output`, `allowed_scope` items, `forbidden_actions` items) are normalized as defined below.

## Exact resolveTaskContract behavior

Given a `TaskContract` input, `resolveTaskContract` returns a `ResolvedTaskContract` with the following deterministic steps:

1. `executionMode`
   - Set to `taskContract.execution_mode` if provided; otherwise `"review_only"`.

2. `objective`
   - Compute from the first non-nullish of:
     - `taskContract.objective`
     - `taskContract.scope`
     - fallback `""`
   - Apply `normalizeScopeInput` to the selected value.

3. `allowed_scope`
   - If `taskContract.allowed_scope` is provided:
     - Apply `normalizeStringList` to that array.
   - Else:
     - If `objective` is a non-empty string, set to `[objective]`; otherwise set to `[]`.
     - Apply `normalizeStringList` to the resulting array.

4. `forbidden_actions`
   - If `taskContract.forbidden_actions` is provided:
     - Apply `normalizeStringList` to that array.
   - Else:
     - Set to `DEFAULT_FORBIDDEN_ACTIONS_BY_MODE[executionMode]`, then apply `normalizeStringList`.

5. `expected_output`
   - If `taskContract.expected_output` is provided:
     - Apply `normalizeScopeInput` to it.
   - Else:
     - Set to `DEFAULT_EXPECTED_OUTPUT_BY_MODE[executionMode]`, then apply `normalizeScopeInput`.

6. `motion_id`
   - Set to `taskContract.motion_id` if provided; otherwise `null`.

7. Directly copied fields (unchanged):
   - `run_id`
   - `task_id`
   - `slot`
   - `provider`
   - `model`
   - `input_ref`
   - `output_artifact_path`

8. `human_review_required`
   - Set to `true` (literal).

9. Return value
   - The function returns an object with all fields listed in `ResolvedTaskContract` populated per the rules above.

## Normalization applied by resolver

- `normalizeScopeInput(scope: string): string`
  - Replace all sequences of whitespace (regex `/\s+/g`) with a single space.
  - Trim leading and trailing whitespace.
  - Return the normalized string.

- `normalizeStringList(values: string[]): string[]`
  - Map each string through `normalizeScopeInput`.
  - Filter out any entries whose length is `0` after normalization.
