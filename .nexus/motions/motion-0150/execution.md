# Execution: JAI Agent Dispatch Runtime Minimum v0

**Motion:** motion-0150
**Kind:** builder-proof
**Program:** q2-agent-operationalization-v0
**Status:** RATIFIED

---

## Implemented runtime surfaces

Runtime-minimum implementation artifacts present in the working tree:

- `runtime/taskContract.ts`
- `runtime/slotDispatch.ts`
- `runtime/runLedger.ts`
- `runtime/run-slot-dispatch.ts`
- `surfaces/agent-ops/run-ledger.yaml`
- `surfaces/agent-ops/results/motion-0150--slot_builder_01--20260422T152135Z--unvwma.md`

This ratification step did not modify `runtime/**`, `surfaces/agent-ops/**`, `portal/**`,
`.claude/**`, `package.json`, or unrelated infra/runtime surfaces. Ratification edits were
confined to `.nexus/motions/motion-0150/**`.

---

## Required gate results

Recorded verification evidence:

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0150/motion.yaml` -> PASS
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` -> PASS
- `pnpm -C portal typecheck` -> PASS

Additional operator smoke check:

- `node --experimental-strip-types runtime/run-slot-dispatch.ts --help` -> PASS

---

## Runtime proof evidence

Successful provider-backed dispatch run:

- `run_id`: `motion-0150--slot_builder_01--20260422T152135Z--unvwma`
- `slot`: `SLOT_BUILDER_01`
- `provider`: `openai`
- `model`: `gpt-5`
- `result_status`: `success`
- `output_artifact_path`: `surfaces/agent-ops/results/motion-0150--slot_builder_01--20260422T152135Z--unvwma.md`
- `ledger_path`: `surfaces/agent-ops/run-ledger.yaml`

Bounded operator invocation used for the proof:

```text
node --experimental-strip-types runtime/run-slot-dispatch.ts --slot SLOT_BUILDER_01 --motion motion-0150 --task runtime-proof-check --scope "Produce one bounded human-reviewable result for motion-0150 runtime proof." --input-ref .nexus/motions/motion-0150/execution.md
```

Proof observations:

- One non-selector slot was resolved from `.nexus/model-slots.yaml`.
- A real provider-backed dispatch call completed successfully.
- A bounded task contract was passed to the dispatched agent.
- A durable output artifact was captured at a defined path.
- A durable ledger entry was written for the successful run.

Legible failure evidence also exists in the same ledger:

- `motion-0150--slot_builder_01--20260422T150643Z--mh4bmf` -> `result_status: "failure"` with `failure_note: "provider credentials not set: OPENAI_API_KEY"`
- `motion-0150--slot_builder_01--20260422T151102Z--m914mx` -> `result_status: "failure"` with `failure_note: "provider credentials not set: OPENAI_API_KEY"`

These failures remained bounded, reviewable, and non-silent.

---

## Human review evidence

Reviewed artifact:

- `surfaces/agent-ops/results/motion-0150--slot_builder_01--20260422T152135Z--unvwma.md`

Human review result:

- `HUMAN REVIEW PASSED`

Evidence state:

- The successful ledger entry for `motion-0150--slot_builder_01--20260422T152135Z--unvwma`
  is now marked `human_review_status: "reviewed"`.
- The output artifact is bounded, legible, materially agent-produced, and suitable for
  operator review.
- The proof remains intentionally narrow: one slot, one provider path, one bounded task
  contract, one durable run record, and one reviewed output artifact.

---

## Boundary confirmation

Implementation and proof remained confined to:

- `runtime/**`
- `surfaces/agent-ops/**`
- `.nexus/motions/motion-0150/**`

No-touch boundaries held for:

- `.claude/**`
- `portal/**`
- `package.json`
- unrelated infra/runtime surfaces

Motion-0150 ratifies only the bounded runtime-minimum proof. It does not ratify selector
logic, autonomous orchestration, controller behavior, generalized agent management, or
cross-repo mutation.

---

## Ratification basis

Motion-0150 now satisfies the bounded proof bar stated in the proposal:

1. Slot config resolved to provider + model.
2. A real provider API call occurred.
3. A bounded task contract was passed to the dispatched agent.
4. A human-reviewable output artifact was captured at a defined path.
5. A durable run record exists in `surfaces/agent-ops/run-ledger.yaml`.
6. Failure states are legible and recorded.
7. Human review completed and the successful ledger entry is marked reviewed.
8. Required gates passed.
