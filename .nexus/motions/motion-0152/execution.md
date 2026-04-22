# Execution: First Agent-Executed Motion v0

**Motion:** motion-0152
**Kind:** builder-proof
**Program:** q2-agent-operationalization-v0
**Status:** RATIFIED

---

## Implemented proof surfaces

Bounded implementation and proof artifacts present in the working tree:

- `runtime/run-slot-dispatch.ts`
- `surfaces/agent-ops/run-ledger.yaml`
- `surfaces/agent-ops/results/motion-0152--slot_builder_01--20260422T190831Z--c281lr.md`
- `.nexus/docs/task-contract-v0.md`

This ratification step did not modify `runtime/**`, `surfaces/agent-ops/**`,
`.nexus/docs/task-contract-v0.md`, `portal/**`, `.claude/**`, `package.json`,
or unrelated runtime surfaces. Ratification edits were confined to
`.nexus/motions/motion-0152/**`.

---

## Required gate results

Recorded verification evidence:

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0152/motion.yaml` -> PASS
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` -> PASS
- `pnpm -C portal typecheck` -> PASS

Motion-0152-specific smoke checks:

- `node --experimental-strip-types runtime/run-slot-dispatch.ts --help` -> PASS
- `node --experimental-strip-types runtime/run-slot-dispatch.ts --slot X --motion Y --task Z --scope S --execution-mode invalid` -> PASS (exit 1 with legible error)

---

## Runtime proof evidence

Successful provider-backed dispatch run:

- `run_id`: `motion-0152--slot_builder_01--20260422T190831Z--c281lr`
- `slot`: `SLOT_BUILDER_01`
- `provider`: `openai`
- `model`: `gpt-5`
- `result_status`: `success`
- `output_artifact_path`: `surfaces/agent-ops/results/motion-0152--slot_builder_01--20260422T190831Z--c281lr.md`
- `ledger_path`: `surfaces/agent-ops/run-ledger.yaml`

Bounded operator invocation used for the successful proof:

```text
node --experimental-strip-types runtime/run-slot-dispatch.ts --slot SLOT_BUILDER_01 --motion motion-0152 --task canon-doc-task-contract-v0 --scope "Document only TaskContract and ResolvedTaskContract fields, defaults/constants present in runtime/taskContract.ts, and exact resolveTaskContract behavior. Exclude examples, status labels, operator workflow, and manual-application guidance. Output structured markdown for .nexus/docs/task-contract-v0.md." --input-ref runtime/taskContract.ts --execution-mode bounded_write
```

Proof observations:

- One non-selector slot was resolved from `.nexus/model-slots.yaml`.
- A real provider-backed `bounded_write` dispatch completed successfully.
- The runtime produced one unmodified output artifact for review.
- A durable ledger entry was written for the successful run.
- The proof remained bounded to one slot, one task, one reviewed artifact, and one applied repo file.

Honest failure evidence also remains recorded in the same ledger:

- earlier motion-0152 credential-gated failures remain as bounded `result_status: "failure"` records with `failure_note: "provider credentials not set: OPENAI_API_KEY"`
- `motion-0152--slot_builder_01--20260422T184910Z--ngswlb` succeeded at dispatch but failed human review and was not applied

These earlier attempts were preserved as visible audit evidence rather than overwritten.

---

## Human review and apply evidence

Reviewed artifact:

- `surfaces/agent-ops/results/motion-0152--slot_builder_01--20260422T190831Z--c281lr.md`

Human review result:

- `HUMAN REVIEW PASSED`

Evidence state:

- The successful ledger entry for `motion-0152--slot_builder_01--20260422T190831Z--c281lr`
  is now marked `human_review_status: "reviewed"`.
- The reviewed runtime artifact itself was not edited before review.
- The bounded applied repo artifact now exists at `.nexus/docs/task-contract-v0.md`.
- The applied copy includes provenance linking it back to the reviewed run and reviewed artifact.

---

## Boundary confirmation

Implementation and proof remained confined to:

- `runtime/run-slot-dispatch.ts`
- `surfaces/agent-ops/**`
- `.nexus/docs/task-contract-v0.md`
- `.nexus/motions/motion-0152/**`

No-touch boundaries held for:

- `.claude/**`
- `portal/**`
- `package.json`
- unrelated runtime surfaces

Motion-0152 ratifies only one bounded first agent-executed repo task proof. It does not
ratify generalized orchestration, selector behavior, autonomous execution, background
services, cross-repo behavior, or controller logic.

---

## Ratification basis

Motion-0152 now satisfies the bounded proof bar stated in the proposal:

1. `run-slot-dispatch.ts` accepts validated `--execution-mode`.
2. A real provider-backed `bounded_write` dispatch occurred.
3. A durable output artifact was captured at a defined path.
4. A durable run record exists in `surfaces/agent-ops/run-ledger.yaml`.
5. Human review completed and the successful ledger entry is marked reviewed.
6. The reviewed artifact was applied as one bounded repo file: `.nexus/docs/task-contract-v0.md`.
7. Required gates passed.
