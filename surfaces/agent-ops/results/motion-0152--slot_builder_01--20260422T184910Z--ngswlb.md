# Agent Dispatch Output

- run_id: motion-0152--slot_builder_01--20260422T184910Z--ngswlb
- motion_id: motion-0152
- task_id: canon-doc-task-contract-v0
- execution_mode: bounded_write
- slot: SLOT_BUILDER_01
- provider: openai
- model: gpt-5
- input_ref: runtime/taskContract.ts
- human_review_required: true

## Scope

Produce a formal specification for the JAI NEXUS TaskContract schema grounded in the provided TypeScript source. Cover all fields with type and semantics, the two execution_mode values and their behavioral implications, operator invocation guidance, and output artifact posture. Format the result as structured markdown for placement at .nexus/docs/task-contract-v0.md.

## Output

# JAI NEXUS TaskContract v0 Specification

Status: Stable (v0)

This document specifies the JAI NEXUS TaskContract schema, its resolution semantics, execution modes and their behavioral implications, operator invocation guidance, and output artifact posture. It is grounded in the runtime/taskContract.ts source.

## 1. Purpose

TaskContract defines the operator-provided parameters for a single, bounded task execution. ResolvedTaskContract defines the fully normalized runtime view used by an agent. The contract explicitly constrains scope and behavior via execution_mode, allowed_scope, and forbidden_actions while defining a single output artifact location and enforcing human review.

## 2. Versioned Types

### 2.1 ExecutionMode

- Type: "review_only" | "bounded_write"
- Semantics:
  - review_only:
    - Output is limited to analysis, verification, or summary artifacts.
    - Mutation claims are disallowed (no repo or runtime mutation).
  - bounded_write:
    - Output may include implementation-class content (e.g., code, patches, file content) suitable for manual operator application.
    - Direct writes or autonomous mutation remain disallowed.
    - Reading is limited to the single operator-supplied input_ref.

### 2.2 TaskContract (operator-provided input)

- Type:
  - run_id: string (required)
  - task_id: string (required)
  - slot: string (required)
  - provider: string (required)
  - model: string (required)
  - motion_id?: string | null (optional; defaults to null in resolution)
  - scope?: string (optional; legacy/alias input to objective)
  - objective?: string (optional; primary textual objective)
  - allowed_scope?: string[] (optional; defaulted from objective)
  - forbidden_actions?: string[] (optional; defaulted by execution_mode)
  - expected_output?: string (optional; defaulted by execution_mode)
  - execution_mode?: ExecutionMode (optional; defaults to "review_only")
  - input_ref: string | null (required; may be null)
  - output_artifact_path: string (required)
  - human_review_required: true (required literal; must be true)

- Key semantics:
  - objective vs. scope:
    - objective is the canonical task objective text.
    - If objective is absent, scope (if present) is used as the objective.
  - input_ref:
    - Path or reference to a single operator-supplied input file/resource, or null.
    - In bounded_write mode, reading is restricted to this input only.
  - output_artifact_path:
    - Filesystem path target for the single output artifact to be placed by the operator after human review.
  - human_review_required:
    - Must be literal true; human review is always required.

### 2.3 ResolvedTaskContract (runtime-normalized)

- Type:
  - run_id: string
  - task_id: string
  - slot: string
  - provider: string
  - model: string
  - motion_id: string | null
  - objective: string
  - allowed_scope: string[]
  - forbidden_actions: string[]
  - expected_output: string
  - execution_mode: ExecutionMode
  - input_ref: string | null
  - output_artifact_path: string
  - human_review_required: true

- Resolution semantics (see Section 4):
  - execution_mode defaults to "review_only" when absent.
  - objective is normalized from objective ?? scope ?? "".
  - allowed_scope defaults to [objective] if objective is non-empty; otherwise [].
  - forbidden_actions defaults by execution_mode.
  - expected_output defaults by execution_mode.
  - motion_id defaults to null if absent.
  - human_review_required is forced true.

## 3. Normalization and Bounding

The following normalization rules and helper behaviors are normative for runtime resolution:

- Whitespace normalization (normalizeScopeInput):
  - For strings normalized by the runtime (objective, expected_output, items in allowed_scope, forbidden_actions):
    - Collapse all runs of whitespace to a single space.
    - Trim leading and trailing whitespace.

- String list normalization (normalizeStringList):
  - Map normalizeScopeInput over input strings.
  - Drop empty strings.

- Scope bounding (boundScope):
  - MAX_SCOPE_CHARS = 500.
  - Given a scope string:
    - Normalize via normalizeScopeInput.
    - Truncate to 500 characters.
    - Return { scope: bounded, truncated: boolean }.

- Scope summary (buildScopeSummary):
  - MAX_SCOPE_SUMMARY_CHARS = 120.
  - Return the first 120 characters of the normalized scope.

Note: The resolver uses normalization for objective, expected_output, allowed_scope items, and forbidden_actions items. It does not automatically truncate objective to MAX_SCOPE_CHARS; boundScope is provided if a caller wishes to pre-bound user input.

## 4. Resolution Algorithm (resolveTaskContract)

Given a TaskContract, resolution proceeds:

1. execution_mode := taskContract.execution_mode ?? "review_only"
2. objective := normalizeScopeInput(taskContract.objective ?? taskContract.scope ?? "")
3. allowed_scope := normalizeStringList(
   taskContract.allowed_scope ?? (objective ? [objective] : [])
)
4. forbidden_actions := normalizeStringList(
   taskContract.forbidden_actions ?? DEFAULT_FORBIDDEN_ACTIONS_BY_MODE[execution_mode]
)
5. expected_output := normalizeScopeInput(
   taskContract.expected_output ?? DEFAULT_EXPECTED_OUTPUT_BY_MODE[execution_mode]
)
6. motion_id := taskContract.motion_id ?? null
7. Assemble ResolvedTaskContract with the above values and:
   - run_id, task_id, slot, provider, model, input_ref, output_artifact_path passed through from TaskContract.
   - human_review_required := true

## 5. Execution Modes: Behavioral Implications

### 5.1 review_only

- Default expected_output:
  - "Produce a bounded human-reviewable artifact with analysis, verification, or summary content only."
- Default forbidden_actions:
  - "Do not claim repo mutation or runtime mutation."
  - "Do not perform or claim direct file writes."
  - "Do not commit, push, open pull requests, or merge changes."
  - "Do not start background execution, autonomous loops, or controller behavior."
- Output constraints:
  - Artifact must be non-mutative in nature (analysis/verification/summary).
  - No code or patch content intended for direct application, unless clearly framed as analysis and not as implementation deliverables.

### 5.2 bounded_write

- Default expected_output:
  - "Produce bounded implementation-class output for operator review and manual application only."
- Default forbidden_actions:
  - "Do not perform or claim direct file writes."
  - "Do not commit, push, open pull requests, or merge changes."
  - "Do not start background execution, autonomous loops, or controller behavior."
  - "Do not read additional files beyond the single operator-supplied input_ref content."
- Output constraints:
  - Implementation-class output is allowed (code, patch text, or file content) but must be bounded to the contract and intended solely for manual application after human review.
  - Reading is restricted to the single input_ref resource (if any) supplied by the operator.
  - No claims of having executed writes, commits, or background tasks.

## 6. Field-by-Field Semantics (TaskContract → ResolvedTaskContract)

- run_id: string
  - Unique identifier of the run. Passed through unchanged.
- task_id: string
  - Stable identifier of the task objective. Passed through unchanged.
- slot: string
  - Named execution slot or channel. Passed through unchanged.
- provider: string
  - Upstream AI provider (e.g., "openai"). Passed through unchanged.
- model: string
  - Model name or identifier (e.g., "gpt-5"). Passed through unchanged.
- motion_id?: string | null
  - Optional motion/batch identifier. Defaults to null when absent.
- scope?: string
  - Optional legacy/alias input for objective. If objective is absent, scope is used as objective. Normalized when used.
- objective?: string
  - Canonical textual objective for the task. Normalized. If absent and scope is also absent, resolves to "".
- allowed_scope?: string[]
  - Optional. Normalized per entry. Defaults to [objective] if objective is non-empty; otherwise [].
  - Defines the positive bounds within which the agent must remain.
- forbidden_actions?: string[]
  - Optional. Normalized per entry. Defaults based on execution_mode (see Section 5).
  - Defines explicit prohibitions for the agent’s behavior.
- expected_output?: string
  - Optional. Normalized. Defaults based on execution_mode (see Section 5).
  - Describes the expected posture and nature of the output artifact.
- execution_mode?: ExecutionMode
  - Optional. Defaults to "review_only" when absent.
  - Controls default forbidden_actions and expected_output and constrains behavioral posture.
- input_ref: string | null
  - Required. May be null.
  - Operator-supplied reference to a single input resource. In bounded_write mode, agent file-reading is limited strictly to this input.
- output_artifact_path: string
  - Required. Filesystem path for the single output artifact to be placed by the operator after review. The agent must not claim direct writes.
- human_review_required: true
  - Required literal. Must be true. The runtime enforces this and the resolver always returns true.

## 7. Output Artifact Posture

- Single artifact path:
  - The contract declares a single output_artifact_path. The agent’s output must be a bounded, human-reviewable artifact intended for manual application to that path by the operator.
- No direct writes:
  - The agent must not claim to have written to the filesystem, committed changes, or triggered background processes.
- Bounded implementation output (bounded_write):
  - When in bounded_write mode, the artifact may include code, patch text (e.g., unified diffs), or full file content. It must remain within allowed_scope and respect forbidden_actions.
- Review-first policy:
  - human_review_required is always true. Operators must review the artifact before any application.

## 8. Operator Invocation Guidance

- Choose execution_mode:
  - Use review_only for analytical, verification, or summarization tasks.
  - Use bounded_write for tasks that should produce implementation-class output while still prohibiting any direct mutation.
- Provide objective/scope:
  - Prefer objective. If only scope is supplied, it will be used as objective.
  - Consider pre-bounding large objectives using boundScope if user input may exceed 500 characters (optional).
- Set input_ref:
  - Provide a single file path or reference if the agent must read context. For bounded_write, the agent is restricted to reading only this input.
  - If no reading is required, set input_ref to null.
- Set output_artifact_path:
  - Provide the exact filesystem path where the operator intends to place the final artifact after review.
- Adjust allowed_scope and forbidden_actions as needed:
  - Defaults are safe and mode-appropriate; override only to further constrain or clarify behavior.
- expected_output:
  - Defaults are appropriate to the mode; override to specify exact artifact requirements (e.g., “Provide a single Markdown file with …”).
- Always enforce human review:
  - Set human_review_required to true (required).
- Resolve before dispatch:
  - Apply resolveTaskContract to produce a ResolvedTaskContract that the agent will consume. This guarantees consistent defaults and normalization.
- Example dispatch flow:
  1) Construct TaskContract.
  2) Optionally apply boundScope/buildScopeSummary for UI or size-limiting.
  3) Call resolveTaskContract.
  4) Provide ResolvedTaskContract to the agent.
  5) Capture the produced artifact content and manually write it to output_artifact_path after review.

## 9. Defaults by Execution Mode

- DEFAULT_EXPECTED_OUTPUT_BY_MODE:
  - review_only:
    - "Produce a bounded human-reviewable artifact with analysis, verification, or summary content only."
  - bounded_write:
    - "Produce bounded implementation-class output for operator review and manual application only."
- DEFAULT_FORBIDDEN_ACTIONS_BY_MODE:
  - review_only:
    - "Do not claim repo mutation or runtime mutation."
    - "Do not perform or claim direct file writes."
    - "Do not commit, push, open pull requests, or merge changes."
    - "Do not start background execution, autonomous loops, or controller behavior."
  - bounded_write:
    - "Do not perform or claim direct file writes."
    - "Do not commit, push, open pull requests, or merge changes."
    - "Do not start background execution, autonomous loops, or controller behavior."
    - "Do not read additional files beyond the single operator-supplied input_ref content."

## 10. Examples

### 10.1 Review-only (minimal)

Input TaskContract:
{
  "run_id": "run-001",
  "task_id": "doc-audit-01",
  "slot": "SLOT_A",
  "provider": "openai",
  "model": "gpt-5",
  "objective": "Audit the design doc for consistency and completeness.",
  "input_ref": null,
  "output_artifact_path": "surfaces/reports/doc-audit-01.md",
  "human_review_required": true
}

ResolvedTaskContract (key fields shown):
{
  "execution_mode": "review_only",
  "objective": "Audit the design doc for consistency and completeness.",
  "allowed_scope": ["Audit the design doc for consistency and completeness."],
  "forbidden_actions": [
    "Do not claim repo mutation or runtime mutation.",
    "Do not perform or claim direct file writes.",
    "Do not commit, push, open pull requests, or merge changes.",
    "Do not start background execution, autonomous loops, or controller behavior."
  ],
  "expected_output": "Produce a bounded human-reviewable artifact with analysis, verification, or summary content only.",
  "human_review_required": true
}

### 10.2 Bounded-write (implementation-class output)

Input TaskContract:
{
  "run_id": "run-002",
  "task_id": "patch-readme-01",
  "slot": "SLOT_B",
  "provider": "openai",
  "model": "gpt-5",
  "execution_mode": "bounded_write",
  "objective": "Prepare a README patch that adds installation steps for Linux.",
  "input_ref": "docs/README.md",
  "output_artifact_path": "surfaces/patches/patch-readme-01.md",
  "human_review_required": true
}

ResolvedTaskContract (key fields shown):
{
  "execution_mode": "bounded_write",
  "objective": "Prepare a README patch that adds installation steps for Linux.",
  "allowed_scope": ["Prepare a README patch that adds installation steps for Linux."],
  "forbidden_actions": [
    "Do not perform or claim direct file writes.",
    "Do not commit, push, open pull requests, or merge changes.",
    "Do not start background execution, autonomous loops, or controller behavior.",
    "Do not read additional files beyond the single operator-supplied input_ref content."
  ],
  "expected_output": "Produce bounded implementation-class output for operator review and manual application only.",
  "human_review_required": true
}

## 11. Compliance Rules for Agents

- Always adhere to allowed_scope and forbidden_actions.
- Never claim direct file writes, commits, merges, or background process execution.
- In bounded_write:
  - Limit reads to the single operator-provided input_ref.
  - Produce implementation-class output only as a human-reviewable artifact.
- Always respect the expected_output posture defined by the contract or its defaults.

## 12. Constants

- MAX_SCOPE_CHARS: 500
- MAX_SCOPE_SUMMARY_CHARS: 120

These constants are used by helper functions to bound and summarize textual scope content.

---

End of JAI NEXUS TaskContract v0 Specification.
