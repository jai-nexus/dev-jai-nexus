# Challenge: First Agent-Executed Motion v0

**Motion:** motion-0152
**Challenger role:** VERIFIER

---

## R-1 — bounded_write mode: first real invocation; output scope drift

**Risk:** This is the first real `bounded_write` dispatch. The agent has no prior track record in this mode within this repo. The `bounded_write` envelope authorizes "bounded implementation output, including code, patch text, or file content." The agent may produce content outside the stated task scope, add unrequested sections, or misinterpret "formal specification" as a tutorial or reference guide.

**Mitigation:** The scope statement explicitly names the required sections (fields, execution_mode semantics, operator guidance, output posture). The `bounded_write` forbidden actions include "Do not read additional files beyond the single operator-supplied input_ref content." Operator review is the gate before any artifact is applied. If scope drift is detected, the operator does not apply the output and re-dispatches with a tighter scope.

**Accepted:** Yes — operator review is the explicit control point.

---

## R-2 — Agent spec quality: single-file input limits context

**Risk:** The agent receives only `runtime/taskContract.ts` as input. It will not see how the contract is used by `slotDispatch.ts` or `run-slot-dispatch.ts`. The spec may miss operational semantics (e.g., how `execution_mode` changes the dispatch envelope, how `input_ref` is embedded at dispatch time).

**Mitigation:** The scope statement specifies that `execution_mode` behavioral implications must be covered. `runtime/taskContract.ts` contains `DEFAULT_FORBIDDEN_ACTIONS_BY_MODE` and `DEFAULT_EXPECTED_OUTPUT_BY_MODE`, which encode the key behavioral differences. The operator review compares the output against the actual source and can reject it if critical details are missing. Re-dispatch with a more specific scope is the fallback.

**Accepted:** Yes — with explicit operator verification that `execution_mode` semantics are correctly captured.

---

## R-3 — --execution-mode arg: invalid value must fail explicitly

**Risk:** If the `--execution-mode` argument accepts any string without validation, an operator typo (e.g., `--execution-mode auto`, `--execution-mode write`) would silently construct a `TaskContract` with an invalid or undefined `execution_mode` value, defaulting to `review_only` rather than failing.

**Mitigation:** The implementation must validate the parsed value against `["review_only", "bounded_write"]` and return a `ParsedArgs` failure with a clear message if the value is not in the allowed set. This must be verified (V-11) by invoking with an invalid value and confirming exit code 1.

**Accepted:** Yes — with explicit validation requirement and V-11 verification.

---

## R-4 — Scope statement truncation at 500 chars

**Risk:** `MAX_SCOPE_CHARS = 500`. The proof invocation scope statement must stay under this limit or be silently truncated before dispatch. A truncated scope may omit key instructions to the agent.

**Mitigation:** The scope statement in section 3 of the proposal is under 500 characters. The operator must verify this before dispatching. `run-slot-dispatch.ts` emits a `scope_note` warning if truncation occurs, which the operator can observe in the CLI output. The operator must not proceed if the warning appears without re-drafting a shorter scope.

**Accepted:** Yes — operator is responsible for verifying scope length before dispatch.

---

## R-5 — task_ref rename in run-slot-dispatch.ts: not covered by typecheck gate

**Risk:** `pnpm -C portal typecheck` does not cover `runtime/` files. The `task_ref` → `task_id` rename in `run-slot-dispatch.ts` (and any other changes to `runtime/` files) will not be caught by the required typecheck gate if there are type errors. The only runtime validation is a successful dispatch.

**Mitigation:** The fix is one line: change `task_ref:` to `task_id:` in the `RunRecord` construction. This is a correct alignment with the `RunRecord.task_id` canonical field. `runLedger.ts` will continue to accept the entry via the canonical path (not the legacy path). Operator smoke check (`--help`) verifies the script loads without error.

**Accepted:** Yes — with the understanding that runtime/ type correctness is validated by successful execution, not by the typecheck gate.

---

## R-6 — Output artifact applied to .nexus/docs/: style consistency

**Risk:** `.nexus/docs/` already contains existing canon documents. The agent-produced `task-contract-v0.md` may use a different header structure, section naming convention, or markdown style than the existing files.

**Mitigation:** The scope statement specifies "structured markdown" suitable for the `.nexus/docs/` path. Operator review includes checking that the format is consistent with existing docs in `.nexus/docs/`. The operator may edit the applied artifact for style without re-dispatching.

**Accepted:** Yes — minor style editing by the operator is within the normal review-and-apply flow.
