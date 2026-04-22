# Execution: JAI Agent Task Contract and Run Ledger Hardening v0

**Motion:** motion-0151
**Kind:** builder-proof
**Program:** q2-agent-operationalization-v0
**Status:** RATIFIED

---

## Implemented touch list

Implemented within the settled motion-0151 boundary:

**Modified:**
- `runtime/taskContract.ts` - formalized the bounded single-run contract with canonical `task_id`, motion linkage, bounded objective and scope fields, forbidden actions, expected output, and `execution_mode: "review_only" | "bounded_write"`.
- `runtime/slotDispatch.ts` - preserved the proven provider-backed path while adding narrow single-file `input_ref` embedding, explicit unreadable-file failure handling, and execution-envelope branching by `execution_mode`.
- `runtime/runLedger.ts` - normalized the append-only ledger schema around canonical `task_id`, generalized the ledger header, preserved compatibility with existing `task_ref` history, and added explicit operator-invoked review-state updates by `run_id`.
- `surfaces/agent-ops/run-ledger.yaml` - updated the header language to generic agent-ops ledger wording without rewriting existing history entries.

**New:**
- `runtime/mark-run-reviewed.ts` - added the bounded operator-only review update tool for one run entry at a time.

**Motion package evidence updated:**
- `.nexus/motions/motion-0151/execution.md`

**No-touch boundaries held:**
- `.claude/**`
- `portal/**`
- `package.json`
- unrelated infra/runtime surfaces

**Settled-boundary note:**
- The current implementation brief settled motion-0151 to the runtime, ledger, and motion-package paths listed above.
- `runtime/run-slot-dispatch.ts` was not changed in this implementation pass.
- No `.nexus/docs/**` artifacts were added in this implementation pass.

---

## Verification matrix

| ID | Check | Method |
|----|-------|--------|
| V-01 | `TaskContract` formalizes `execution_mode` | `rg "execution_mode" runtime/taskContract.ts` |
| V-02 | `execution_mode` remains bounded to `review_only` and `bounded_write` | `rg "\"review_only\" \| \"bounded_write\"" runtime/taskContract.ts` |
| V-03 | Canonical `task_id` is present in the contract surface | `rg "task_id" runtime/taskContract.ts` |
| V-04 | Contract carries bounded objective and scope fields | `rg "objective|allowed_scope|forbidden_actions|expected_output" runtime/taskContract.ts` |
| V-05 | Dispatch still excludes selector slots | `rg "selector slots excluded from dispatch" runtime/slotDispatch.ts` |
| V-06 | Dispatch embeds only one operator-supplied `input_ref` file | `rg "Embedded operator-supplied input_ref file|input_ref not readable" runtime/slotDispatch.ts` |
| V-07 | Missing or unreadable `input_ref` produces a legible failure | `rg "input_ref not readable" runtime/slotDispatch.ts` |
| V-08 | Dispatch branches the envelope on `execution_mode` | `rg "buildExecutionEnvelope|bounded_write|review_only" runtime/slotDispatch.ts` |
| V-09 | Ledger runtime uses canonical `task_id` going forward | `rg "task_id" runtime/runLedger.ts` |
| V-10 | Ledger preserves compatibility with legacy `task_ref` entries | `rg "task_ref|task_field_name" runtime/runLedger.ts` |
| V-11 | Ledger header is no longer motion-0150-specific | `rg "JAI NEXUS agent ops run ledger|motion-0150" runtime/runLedger.ts surfaces/agent-ops/run-ledger.yaml` |
| V-12 | Review-state updates are operator-invoked and explicit | `rg "updateRunReviewStatus|run_id not found" runtime/runLedger.ts runtime/mark-run-reviewed.ts` |
| V-13 | `mark-run-reviewed.ts` exposes a bounded CLI | `rg -- "--run-id|--status|--ledger" runtime/mark-run-reviewed.ts` |
| V-14 | Review updates reject missing target runs explicitly | `node --experimental-strip-types runtime/mark-run-reviewed.ts --run-id missing-run --status reviewed` |
| V-15 | Motion required gates still pass | gate checks below |

---

## Required gates

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0151/motion.yaml`
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
- `pnpm -C portal typecheck`

---

## Operator smoke checks

- `node --experimental-strip-types runtime/run-slot-dispatch.ts --help`
- `node --experimental-strip-types runtime/mark-run-reviewed.ts --help`

---

## Ratification basis

Motion-0151 satisfies the builder-proof bar when:

1. The contract surface is formalized and remains bounded to a single-run execution envelope.
2. The proven motion-0150 dispatch path still works without selector or automation widening.
3. The ledger is append-oriented, auditable, and readable with explicit review-state handling.
4. The required gates and operator smoke checks pass.
5. Human review of the implementation is complete.

Motion-0151 does not require a new `bounded_write` proof run. The motion is limited to contract and ledger hardening around the already-proven motion-0150 path.
