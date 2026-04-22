# Proposal: First Agent-Executed Motion v0

**Motion:** motion-0152
**Kind:** builder-proof
**Program:** q2-agent-operationalization-v0
**Basis:** motion-0151

---

## 1. Current repo framing

motion-0150 proved the full dispatch path: slot resolution → provider-backed dispatch → output artifact capture → durable ledger entry → human review.

motion-0151 hardened the execution envelope: canonical `task_id`, `execution_mode: "review_only" | "bounded_write"`, single-file `input_ref` embedding, operator-driven review update, and generic ledger header.

The runtime is now capable of executing `bounded_write` tasks — tasks where the agent produces implementation-class output for operator review and manual application. One gap remains in the CLI entry point: `run-slot-dispatch.ts` does not expose `--execution-mode`, so all dispatches currently default to `review_only` without a way to opt into `bounded_write` mode.

One natural first agent-executed task was deferred from motion-0151 Sub-line E: `.nexus/docs/task-contract-v0.md` — formal spec documentation for the `TaskContract` schema.

**Proof standard for "agent-executed":** The content of `.nexus/docs/task-contract-v0.md` must be produced by a successful provider-backed dispatch through the ratified runtime, captured as an unmodified output artifact at a defined path in `surfaces/agent-ops/results/`, and durable in the run ledger before the operator reviews and applies it. Manual authorship of the artifact, simulation without a real provider call, or attribution of pre-existing content does not satisfy this proof bar.

---

## 2. Problem statement

Two gaps stand between the ratified runtime and the first real `bounded_write` proof:

**Gap 1 — `--execution-mode` not exposed by CLI**
`run-slot-dispatch.ts` creates a `TaskContract` without setting `execution_mode`. Since the field is optional, `resolveTaskContract` defaults it to `"review_only"`. The `slotDispatch.ts` branching on `execution_mode` and `taskContract.ts`'s `DEFAULT_FORBIDDEN_ACTIONS_BY_MODE` are both ready — only the CLI arg is missing.

**Gap 2 — `task_ref` naming inconsistency in CLI entry point**
`run-slot-dispatch.ts` line 135 passes `task_ref: parsedArgs.task_id` to the `RunRecord` constructor. `runLedger.ts` accepts this via `LegacyRunRecordInput` compatibility (no runtime failure), but the entry point should use the canonical `task_id` field that motion-0151 established. Since `pnpm -C portal typecheck` does not cover `runtime/` files, this inconsistency is not caught by the typecheck gate.

Both gaps are in `run-slot-dispatch.ts` only. Both are small and bounded.

---

## 3. Exact scope

**Implementation prerequisite (run-slot-dispatch.ts only):**

- Add `--execution-mode <review_only|bounded_write>` (optional; defaults to `"review_only"`) to `parseArgs`. Validate the parsed value against the two allowed values; return a `ParsedArgs` failure on any other value.
- Pass the resolved `execution_mode` to the `TaskContract` construction.
- Fix `task_ref: parsedArgs.task_id` → `task_id: parsedArgs.task_id` in the `RunRecord` construction.
- Update the USAGE string to document `--execution-mode`.

**Proof task:**
Dispatch `SLOT_BUILDER_01` in `bounded_write` mode with `runtime/taskContract.ts` as the single `input_ref` to produce a formal spec document for the `TaskContract` schema. Operator reviews the output artifact and, if satisfactory, applies it to the repo as `.nexus/docs/task-contract-v0.md`.

**Proof invocation (operator runs after implementation):**
```
node --experimental-strip-types runtime/run-slot-dispatch.ts \
  --slot SLOT_BUILDER_01 \
  --motion motion-0152 \
  --task canon-doc-task-contract-v0 \
  --scope "Produce a formal specification for the JAI NEXUS TaskContract schema grounded in the provided TypeScript source. Cover: all fields with type and semantics, the two execution_mode values (review_only vs bounded_write) and their behavioral implications, operator invocation guidance, and output artifact posture. Format: structured markdown for placement at .nexus/docs/task-contract-v0.md." \
  --input-ref runtime/taskContract.ts \
  --execution-mode bounded_write
```

The scope statement above is under 500 characters (the `MAX_SCOPE_CHARS` limit).

---

## 4. Non-goals

- Producing `.nexus/docs/run-ledger-v0.md` (separate task, deferred).
- Multi-file `input_ref` support.
- Automated application of agent output (operator applies manually).
- New provider paths beyond openai.
- Selector slot dispatch.
- Autonomous commit, PR creation, or merge.
- Changes to `runtime/taskContract.ts`, `runtime/slotDispatch.ts`, `runtime/runLedger.ts`, or `runtime/mark-run-reviewed.ts`.
- Changes to `.claude/**`, `portal/**`, `package.json`, or unrelated infra surfaces.
- Generalized orchestration or controller behavior.

---

## 5. Candidate task options and recommended task

**Option A (recommended): produce `.nexus/docs/task-contract-v0.md` from `runtime/taskContract.ts`**
- Single input file; fits the existing single-ref capability.
- Output is deferred from motion-0151 Sub-line E — delivers on a named commitment.
- Operator can verify output against the actual TypeScript source.
- Uses the already-proven `SLOT_BUILDER_01` slot.

**Option B: produce `surfaces/agent-ops/README.md`**
- Lower priority; the surface works without a README.
- Less reviewable against a concrete source.

**Option C: produce a passalong or session context document**
- Already handled by the motion-passalong skill; not a meaningful first proof task.

**Recommendation:** Option A. It is bounded, well-motivated, operator-reviewable, and delivers a deferred artifact using the proven dispatch path in `bounded_write` mode.

**Slot selection:** `SLOT_BUILDER_01` (proven in motion-0150). `SLOT_LIBRARIAN_01` would be semantically natural for future documentation tasks but is not yet proven on this branch; reserve for a later motion.

---

## 6. Acceptance criteria

1. `run-slot-dispatch.ts` accepts `--execution-mode`; invalid values produce a legible CLI error.
2. `run-slot-dispatch.ts` passes `task_id` (not `task_ref`) to the `RunRecord`.
3. Proof dispatch invocation completes with `result_status: success`.
4. Output artifact captured at `surfaces/agent-ops/results/motion-0152--slot_builder_01--*.md`.
5. Ledger entry exists with `motion_id: motion-0152`, `result_status: success`.
6. Operator reviews the output artifact at `surfaces/agent-ops/results/`: (a) all `TaskContract` fields from the source are present and correctly described; (b) both `execution_mode` values and their behavioral implications are accurately covered; (c) no fields or behaviors are invented that do not appear in the TypeScript source. Result: `HUMAN REVIEW PASSED`.
7. Operator applies output as `.nexus/docs/task-contract-v0.md`.
8. Ledger entry marked `human_review_status: reviewed` via `mark-run-reviewed.ts`.
9. Required gates pass.

---

## 7. Likely touched paths

**Implementation (by the operator):**
- `runtime/run-slot-dispatch.ts` — `--execution-mode` arg, `task_id` fix

**Runtime outputs (by the dispatch invocation):**
- `surfaces/agent-ops/run-ledger.yaml` — new ledger entry
- `surfaces/agent-ops/results/motion-0152--slot_builder_01--*.md` — output artifact

**Applied by operator after human review:**
- `.nexus/docs/task-contract-v0.md` — agent-produced, operator-applied

**Motion package:**
- `.nexus/motions/motion-0152/**`

**No-touch:**
- `runtime/taskContract.ts`
- `runtime/slotDispatch.ts`
- `runtime/runLedger.ts`
- `runtime/mark-run-reviewed.ts`
- `.nexus/model-slots.yaml`
- `.claude/**`
- `portal/**`
- `package.json`

---

## 8. Execution / review design

**Step 1 — Implement prerequisite in `run-slot-dispatch.ts`:**
Add `execution_mode?: string` to `ParsedArgs`, parse `--execution-mode` in `parseArgs`, validate against `["review_only", "bounded_write"]`, pass to `TaskContract`. Fix `task_ref` → `task_id`.

**Step 2 — Operator runs proof invocation** (invocation as specified in section 3).

**Step 3 — Runtime executes:**
- `resolveSlotConfig`: resolves `SLOT_BUILDER_01` → openai / gpt-5
- `loadInputRefSection`: reads `runtime/taskContract.ts`; embeds under labeled section
- `buildExecutionEnvelope`: `bounded_write` envelope (authorizes implementation-class content)
- `fetch`: dispatches to OpenAI Responses API
- `persistDispatchResult`: writes output artifact
- `appendRunRecord`: appends ledger entry; `human_review_status: "pending"`

**Step 4 — Operator reviews output artifact:**
Read `surfaces/agent-ops/results/motion-0152--*.md` (unmodified; do not edit the result artifact). Review criteria — all must hold for HUMAN REVIEW PASSED: (a) all `TaskContract` fields from the source are present and correctly described; (b) both `execution_mode` values and their behavioral implications are accurately covered; (c) no fields or behaviors are invented that do not appear in the source. If all criteria hold: apply the artifact content (minor style edits permitted; substantive content must remain agent-produced) as `.nexus/docs/task-contract-v0.md`. If any criterion fails: do not apply; re-dispatch with refined scope.

**Step 5 — Mark ledger entry reviewed:**
```
node --experimental-strip-types runtime/mark-run-reviewed.ts \
  --run-id <run_id> \
  --status reviewed
```

**Step 6 — Record proof evidence in execution.md and proceed to ratification.**

---

## 9. Bounded commit plan

**Commit 1 — Prerequisite:**
`runtime/run-slot-dispatch.ts` only. Adds `--execution-mode` arg and fixes `task_ref`.

**Commit 2 — Agent-applied artifact:**
`.nexus/docs/task-contract-v0.md` only. Agent-produced, operator-reviewed, operator-applied.

**Commit 3 — Governance ratification:**
`.nexus/motions/motion-0152/**` all 8 files in ratified state.

All commits on `program/q2-agent-operationalization-v0`. No separate PR per motion — program branch collected into one PR at program completion.

---

## 10. PR description

**Title:** `motion-0152: first agent-executed motion v0`

**Body summary:**
- Adds `--execution-mode` to `run-slot-dispatch.ts`; fixes `task_ref` naming
- Dispatches `SLOT_BUILDER_01` in `bounded_write` mode; input: `runtime/taskContract.ts`
- Agent-produced `.nexus/docs/task-contract-v0.md` reviewed and applied by operator
- Ledger entry: `result_status: success`, `human_review_status: reviewed`
- Bounded to single slot, single task, single reviewed artifact; no automation widening

---

## 11. Verification steps

| ID | Check | Method |
|----|-------|--------|
| V-01 | `--execution-mode` arg present in CLI entry point | `grep "\-\-execution-mode" runtime/run-slot-dispatch.ts` |
| V-02 | `--execution-mode` defaults to `review_only` | `grep "review_only" runtime/run-slot-dispatch.ts` |
| V-03 | `execution_mode` passed to `TaskContract` | `grep "execution_mode" runtime/run-slot-dispatch.ts` |
| V-04 | `task_id` used in `RunRecord` construction (not `task_ref`) | `grep "task_id:" runtime/run-slot-dispatch.ts` |
| V-05 | `task_ref` no longer in `RunRecord` construction | `grep "task_ref:" runtime/run-slot-dispatch.ts` → 0 matches expected |
| V-06 | Proof dispatch `result_status: success` in ledger | `grep "motion-0152" surfaces/agent-ops/run-ledger.yaml` |
| V-07 | Output artifact exists at defined path | file exists `surfaces/agent-ops/results/motion-0152--slot_builder_01--*.md` |
| V-08 | `.nexus/docs/task-contract-v0.md` exists | file exists `.nexus/docs/task-contract-v0.md` |
| V-09 | Ledger entry marked reviewed | `grep "reviewed" surfaces/agent-ops/run-ledger.yaml` for motion-0152 run |
| V-10 | `--help` still passes (no regression) | `node --experimental-strip-types runtime/run-slot-dispatch.ts --help` |
| V-11 | Invalid `--execution-mode` value produces CLI error | `node --experimental-strip-types runtime/run-slot-dispatch.ts --slot X --motion Y --task Z --scope S --execution-mode invalid` → exit 1 |
| V-12 | Required gates pass | gate: validate_motion, validate_agency, typecheck |

---

## 12. Rollback plan

**If dispatch fails:**
Ledger records `result_status: failure` with `failure_note`. No artifact applied. No repo change needed beyond the ledger entry. Re-dispatch with corrected invocation or credentials.

**If output artifact quality is insufficient:**
Operator does not apply to `.nexus/docs/task-contract-v0.md`. Re-dispatch with a refined `--scope` statement. The previous failed dispatch remains in the ledger as a legible record.

**If applied artifact has errors discovered after application:**
Delete or revert `.nexus/docs/task-contract-v0.md`. Re-dispatch with corrected scope and re-apply.

**If `run-slot-dispatch.ts` prerequisite causes a regression in the existing dispatch path:**
Revert `runtime/run-slot-dispatch.ts` to the pre-motion-0152 state using git. Motion-0152 proof is deferred until the prerequisite is resolved cleanly.

**If multiple re-dispatch attempts consistently fail to produce a satisfactory artifact:**
Motion-0152's current scope cannot be ratified. The operator may select a different bounded task, update the proof invocation accordingly, and retry. The proof bar requires a genuinely agent-produced artifact — if the chosen task is consistently out of reach, changing the task is the correct response, not lowering the bar.

---

## Boundary rules

Motion-0152 does not:
- Introduce autonomous dispatch or scheduling.
- Add selector slot dispatch paths.
- Touch `runtime/taskContract.ts`, `runtime/slotDispatch.ts`, `runtime/runLedger.ts`, or `runtime/mark-run-reviewed.ts`.
- Touch `.claude/**`, `portal/**`, `package.json`, or unrelated infra surfaces.
- Authorize the dispatched agent to directly write, commit, push, or merge.
- Trigger automatic review status transitions.
- Produce `.nexus/docs/run-ledger-v0.md` (deferred).
- Widen into multi-slot dispatch, multi-model orchestration, or controller behavior.
