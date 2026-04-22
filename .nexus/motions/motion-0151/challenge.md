# Challenge: JAI Agent Task Contract and Run Ledger v0

**Motion:** motion-0151
**Challenger role:** VERIFIER

---

## R-1 — bounded_write envelope authorization language

**Risk:** If the `bounded_write` envelope text is too permissive or ambiguous, dispatched agents may interpret it as authorization for autonomous repo mutation rather than authorization to produce implementation-class output for operator review.

**Mitigation:** The envelope must state explicitly: the agent produces output only; no direct file writes, commits, pushes, or merges occur; output is captured as an artifact and applied by the operator. The distinction between prohibiting _claims_ of mutation and prohibiting implementation-class _content_ must be stated in the envelope text itself, not only in the canon documentation.

**Accepted:** Yes — the authorization text is operator-reviewable and output is bounded to the result artifact path.

---

## R-2 — Ledger YAML rewrite in updateRunReviewStatus

**Risk:** Unlike the current append-only pattern, `updateRunReviewStatus` is a read-modify-write operation. Malformed YAML, a mismatched `run_id`, or concurrent invocations could corrupt the ledger.

**Mitigation:** The function must: (a) validate the parsed YAML is a sequence before modifying; (b) throw an explicit error if `run_id` is not found, rather than writing a no-op; (c) serialize back to YAML with the same structure. Concurrent write risk is accepted as low — this is an operator CLI tool, not an automated process.

**Accepted:** Yes — with the three-part validation requirement noted above.

---

## R-3 — input_ref content embedded in provider API call

**Risk:** If `input_ref` points to a file containing credentials, private keys, or sensitive internal content, that content is sent to the OpenAI API as part of the dispatch call.

**Mitigation:** `input_ref` is operator-supplied at invocation time. The operator is responsible for ensuring the referenced file is suitable for transmission. No automatic scanning is added in this motion. This risk is inherent to any operator-delegated input reference — equivalent to pasting the file content directly. The risk is scoped to the single-file embedding path only.

**Accepted:** Yes — bounded to operator-supplied references; no automatic scanning in scope.

---

## R-4 — execution_mode is operator-controlled with no slot-level constraint

**Risk:** Nothing in `.nexus/model-slots.yaml` constrains which `execution_mode` values are valid for a given slot. An operator could set `--execution-mode bounded_write` on a slot intended only for review-only tasks.

**Mitigation:** Slot-level execution_mode constraints are not in scope for motion-0151. The operator is the control point. This gap is documented as a deferred extension point in `.nexus/docs/task-contract-v0.md`.

**Accepted:** Yes — slot-level constraints are a named deferred extension point.

---

## R-5 — task_ref → task_id rename and ledger compatibility

**Risk:** Existing ledger entries in `surfaces/agent-ops/run-ledger.yaml` use the field name `task_ref`. After the TypeScript rename to `task_id`, any code reading `RunRecord.task_id` from existing YAML entries will encounter the old field name.

**Mitigation:** The rename is a TypeScript type change only; no YAML backfill is in scope. `mark-run-reviewed.ts` locates entries by `run_id`, not by `task_id`, so the review update path is not broken for pre-motion-0151 entries. The canon doc must note that entries written before motion-0151 used `task_ref`. Readers parsing the ledger should treat `task_ref` in older entries as equivalent to `task_id`.

**Accepted:** Yes — with explicit documentation of the field rename and pre-existing entry state.

---

## R-6 — .nexus/docs/ directory does not exist

**Risk:** Writing `.nexus/docs/task-contract-v0.md` and `.nexus/docs/run-ledger-v0.md` requires creating a new directory in the governed `.nexus/` namespace.

**Mitigation:** `.nexus/docs/` is a natural location for canon documentation that is neither a motion package, a context artifact, nor a codex entry. Directory creation is low-risk and limited to documentation files only.

**Accepted:** Yes — `.nexus/docs/` directory creation is within the scope of this motion.
