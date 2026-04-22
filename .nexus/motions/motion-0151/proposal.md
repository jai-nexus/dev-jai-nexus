# Proposal: JAI Agent Task Contract and Run Ledger v0

**Motion:** motion-0151
**Kind:** builder-proof
**Program:** q2-agent-operationalization-v0
**Basis:** motion-0150

---

## Background

Motion-0150 ratified the dispatch runtime minimum: slot resolution, provider dispatch, output capture, and run ledger. The proof run succeeded. Five concrete gaps were exposed by the first dispatch and by reading the motion-0150 implementation.

---

## Problem statement

The five gaps, each grounded in the current implementation:

**Gap 1 — No review update mechanism**
`human_review_status` in `RunRecord` is initialized to `"pending"` by `run-slot-dispatch.ts` and never updated programmatically. No script exists to transition it to `"reviewed"`, `"approved"`, or `"rejected"`. The motion-0150 proof required manual YAML editing to mark the ledger entry reviewed. This is error-prone and unauditable.

**Gap 2 — Execution envelope hardcoded prohibitive**
`buildDispatchInput` in `slotDispatch.ts` unconditionally includes: _"Do not claim repo mutation, commits, PR creation, or background execution."_ This prohibition is correct for review-only tasks. It will block motion-0152, which requires the dispatched agent to produce bounded implementation output (code, patches, or file content) for operator review and application. The envelope is not parameterized.

**Gap 3 — input_ref content not embedded**
`TaskContract.input_ref` is a path string. When `dispatchOpenAI` serializes the task contract as JSON into the prompt, only the path string is passed. The dispatched agent cannot read files. The motion-0150 proof artifact explicitly noted the agent could not access the referenced file. Input content must be embedded at dispatch time.

**Gap 4 — Ledger header hardcoded to motion-0150**
`LEDGER_HEADER_LINES` in `runLedger.ts` reads: _"Agent ops run ledger for motion-0150 runtime-minimum dispatch runs."_ This is wrong for all subsequent dispatch runs. The header should identify the ledger generically.

**Gap 5 — task_id / task_ref naming inconsistency**
`TaskContract` uses `task_id: string`. `RunRecord` uses `task_ref: string`. Both fields hold the operator-supplied `--task` argument from `run-slot-dispatch.ts`. This inconsistency creates confusion when tracing a run from contract to ledger entry.

---

## Proposal

Motion-0151 authorizes targeted fixes for all five gaps, plus canon documentation for the task contract and run ledger schemas.

### Sub-line A — Execution envelope parameterization

Add `execution_mode: "review_only" | "bounded_write"` to `TaskContract`. Update `buildDispatchInput` in `slotDispatch.ts` to branch on this field:

- `review_only` (default): retain current prohibition on repo mutation claims.
- `bounded_write`: replace the prohibition with bounded authorization text indicating the agent may produce bounded implementation output (code, patches, file content) for operator review and application. The agent does not directly commit, push, or merge — output is captured in the result artifact and applied by the operator.

Update `run-slot-dispatch.ts` to accept an optional `--execution-mode` argument (defaults to `review_only`).

### Sub-line B — input_ref content embedding

Update `dispatchOpenAI` in `slotDispatch.ts` to read the file at `taskContract.input_ref` before building the dispatch input. Embed the file content in the prompt under a labeled section. If `input_ref` is null, skip embedding. If the file cannot be read, return `DispatchResult { ok: false, failure_note: "input_ref not readable: <path>" }` rather than dispatching with a missing reference.

### Sub-line C — Review update mechanism

Add `updateRunReviewStatus(runId: string, status: "reviewed" | "approved" | "rejected", ledgerPath: string): void` to `runLedger.ts`. This function reads the ledger, locates the entry by `run_id`, updates `human_review_status`, and rewrites the file. Add `runtime/mark-run-reviewed.ts` as an operator-facing script accepting `--run-id <id> --status <reviewed|approved|rejected> [--ledger <path>]`.

### Sub-line D — Ledger and naming hardening

Replace `LEDGER_HEADER_LINES` with a generic header: _"JAI NEXUS agent ops run ledger."_ Rename `task_ref` to `task_id` in `RunRecord` (aligns with `TaskContract.task_id`). Pre-motion-0151 ledger entries using `task_ref` are not migrated; the rename is a TypeScript type change only.

### Sub-line E — Canon documentation

Add:
- `.nexus/docs/task-contract-v0.md`: formal spec for `TaskContract`, field semantics, `execution_mode` values, and operator guidance.
- `.nexus/docs/run-ledger-v0.md`: formal spec for `RunRecord`, field semantics, `human_review_status` lifecycle, and ledger path policy.

---

## Success criteria

1. `TaskContract` has `execution_mode: "review_only" | "bounded_write"` with `review_only` as default.
2. `buildDispatchInput` branches on `execution_mode`; `bounded_write` replaces the prohibition with bounded authorization text.
3. `dispatchOpenAI` embeds `input_ref` file content in the prompt; null and missing-file cases handled.
4. `updateRunReviewStatus` exists in `runLedger.ts` and is called by `mark-run-reviewed.ts`.
5. `LEDGER_HEADER_LINES` no longer references motion-0150.
6. `RunRecord.task_ref` renamed to `RunRecord.task_id`.
7. Canon docs exist at `.nexus/docs/task-contract-v0.md` and `.nexus/docs/run-ledger-v0.md`.
8. Required gates pass.

---

## Non-goals

- Autonomous orchestration, multi-slot dispatch, or controller behavior.
- Selector slot dispatch.
- Auto-commit, PR creation, or merge logic.
- Provider support beyond openai.
- Agent filesystem write access; `bounded_write` mode produces output artifacts only.
- Generalized multi-ref input embedding (only the single `input_ref` field is in scope).
- Ledger migration or backfill of pre-motion-0151 entries.
- Slot-level execution_mode constraints in `.nexus/model-slots.yaml`.

---

## Boundary rules

Motion-0151 does not:
- Introduce autonomous dispatch or scheduling.
- Add selector slot dispatch paths.
- Touch `.claude/**`, `portal/**`, `package.json`, or unrelated infra surfaces.
- Authorize the dispatched agent to directly write, commit, push, or merge.
- Trigger automatic review status transitions; `mark-run-reviewed.ts` is an operator-invoked tool only.
- Change the ledger path (`surfaces/agent-ops/run-ledger.yaml`).
- Modify the run-id format.
- Add new provider paths beyond the existing openai path.
- Modify `.nexus/motions/**` outside this motion's own directory.
