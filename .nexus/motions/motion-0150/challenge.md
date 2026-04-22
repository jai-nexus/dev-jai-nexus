# Challenge: JAI Agent Dispatch Runtime Minimum v0

**Motion:** motion-0150
**Challenger role:** Identify risks, boundary violations, and failure modes before ratification.

---

## Challenges and risks

### R-1 — Provider credentials not available at dispatch time

**Risk:** `SLOT_BUILDER_01` resolves to `provider: openai, model: gpt-5`, but no OpenAI
API key is set in the environment. The dispatch script fails with an auth error or
unhandled exception rather than a legible run record with `result_status: failure`.

**Mitigation:** The dispatch module must check for provider credentials before making any
API call and record a legible failure note if the precondition fails. The acceptance path
(SC-5) requires that failure states produce a run record with `result_status: failure`
and a `failure_note` — a bare console exit does not satisfy the acceptance criteria.

**Residual:** Medium. This is the most likely first-run failure mode. The failure recording
path must be tested explicitly, not only the happy path.

---

### R-2 — Model identifier `gpt-5` not recognized by provider API

**Risk:** `.nexus/model-slots.yaml` specifies `model: gpt-5` for all slots. If this model
identifier is not current or not available under the operator's API access tier, all
dispatch attempts will fail at the API call level. The config will appear correct while
the dispatch systematically fails.

**Mitigation:** The dispatch module must verify the model identifier is recognized by the
provider before passing the task contract. A model-not-found failure must produce a
legible run record with `result_status: failure` and a diagnostic note naming the
unrecognized model identifier. This is a known risk at the time of package drafting;
the implementation should not assume config is ground truth for API availability.

**Residual:** High. The model-slots.yaml content is a config placeholder. If `gpt-5` is
not the correct model ID, the first dispatch will fail. The failure must be legible and
diagnosable — not a requirement to change the config before first dispatch proof.

---

### R-3 — Selector slots dispatched despite exclusion rule

**Risk:** An implementation bug or misread of the proposal routes a dispatch request to
`SLOT_BUILDER_SELECTOR` (or another `*_SELECTOR` slot) rather than the intended
non-selector executor slot `SLOT_BUILDER_01`. Selector slots are deferred per the current
agent-panels.yaml; dispatching them is out of scope for this motion.

**Mitigation:** The slot dispatch module must explicitly check for and reject selector
slots before dispatch. A slot name ending in `_SELECTOR` must produce a legible error,
not a dispatch attempt. The V-matrix must verify the selector exclusion check.

**Residual:** Low if the check is implemented. Execution V-matrix should verify selector
slot rejection with a direct unit check.

---

### R-4 — Agent output not bounded — runs indefinitely or produces oversized output

**Risk:** The task contract's `scope` field is not effectively bounded. The dispatched
agent interprets the execution.md contents as permission to make broad changes, producing
output that exceeds the expected artifact size or attempts actions outside the task scope.

**Mitigation:** The dispatch entry point must construct a bounded scope statement (max 500
chars, per the task contract spec) rather than passing execution.md verbatim. The scope
statement must describe a specific, reviewable task — not an open-ended instruction.
The operator review checkpoint (SC-5, human_review_required: true) remains the safety net.

**Residual:** Medium. Bounding the scope statement at the entry point is the primary
control. The human review checkpoint is the backup.

---

### R-5 — Run ledger file write fails silently

**Risk:** The `runLedger.ts` module attempts to write to
`surfaces/agent-ops/run-ledger.yaml` but the directory does not exist or lacks write
permissions. The dispatch completes but no run record is created. The output artifact
exists but is unindexed.

**Mitigation:** The run ledger module must create the `surfaces/agent-ops/` directory if
it does not exist before writing. A ledger write failure must surface as a legible error
to the operator — not a silent skip. The acceptance criteria (SC-5) requires a run record
to exist; a missing record is a failing state, not an acceptable outcome.

**Residual:** Low. Directory creation before write is a standard precondition. The test
should verify ledger write under clean directory state.

---

### R-6 — Existing work packet runtime modified to accommodate first dispatch

**Risk:** During implementation, the path of least resistance appears to be modifying
`portal/src/lib/agentRuntime.ts`, `portal/src/lib/work/builderRuntime.ts`, or
`portal/scripts/run-builder-once.ts` to route slot-config-backed dispatch through the
existing DB packet system. This would entangle the minimal dispatch proof with the
existing infrastructure and widen the scope of this motion.

**Mitigation:** The proposal explicitly excludes modification of the existing work packet
runtime. The sub-line A deliverable (`slotDispatch.ts`) is a new module, not an extension
of `agentRuntime.ts`. The no-touch list in execution.md must name all existing runtime
files explicitly. The V-matrix must check that no existing runtime files are modified.

**Residual:** Low if the no-touch list is enforced. Execution V-matrix should include a
`git diff --name-only` check against existing runtime file paths.

---

## Boundary verification

The following must not occur as a result of this motion:

- [ ] No autonomous loop, scheduling, or background orchestration introduced
- [ ] No automatic commit, PR, or merge of agent output
- [ ] No controller or autopilot behavior
- [ ] No cross-repo writes
- [ ] No modification to `portal/src/lib/agentRuntime.ts`
- [ ] No modification to `portal/src/lib/work/builderRuntime.ts`
- [ ] No modification to `portal/scripts/run-builder-once.ts`
- [ ] No modification to `portal/src/app/operator/work/*`
- [ ] No selector slot dispatched
- [ ] No multi-provider dispatch attempted
- [ ] No changes to `.nexus/docs/**`, `.claude/**`, or `package.json`
- [ ] Council-run boundary preserved — no council-run behavior automated

---

## Verdict

Proceed to execution with the following watch items for the V-matrix:

1. Dispatch module explicitly rejects selector slots before attempting dispatch
2. Failure states (auth, model-not-found, timeout) write a legible run record — not a console exit
3. Run ledger write creates `surfaces/agent-ops/` directory if absent
4. Scope field in task contract is bounded at construction time, not passed verbatim from execution.md
5. No existing work packet runtime files appear in `git diff --name-only`
6. Human review is recorded in the run ledger before ratification — not assumed
