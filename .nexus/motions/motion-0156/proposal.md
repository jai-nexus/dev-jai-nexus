# Proposal: Single-Slot Operator Proof Review Surface v0

**Motion:** motion-0156
**Kind:** builder-proof
**Program:** q2-proof-hardening-review-surface
**Basis:** motion-0155

---

## 1. Problem statement

The single-slot proof path now records execution proof, review closure, lineage, and
preflight admissibility. The remaining trust gap is operator legibility.

Today an operator must reconstruct proof state manually from:

- `surfaces/agent-ops/run-ledger.yaml`
- `surfaces/agent-ops/results/**`
- `.nexus/motions/motion-015x/execution.md`

The ledger fields are necessary, but they are not yet a review surface. They do not present
one run as a coherent operator-facing proof state with lineage position, current live/latest
status, review closure, and admissibility context in one read-only view.

Motion-0156 closes that gap with one narrow read-only proof-view builder in
`runtime/runLedger.ts` and one new read-only CLI:

- `runtime/show-run-proof.ts`

---

## 2. Scope

In scope:

- `runtime/runLedger.ts` — add one narrow read-only proof-view export
- `runtime/show-run-proof.ts` — add one read-only operator-facing CLI for `--run-id`
- `.nexus/motions/motion-0156/**` — governance package

Not in scope:

- `runtime/run-slot-dispatch.ts` — no changes
- `runtime/mark-run-reviewed.ts` — no changes
- `runtime/slotDispatch.ts` — no changes
- `runtime/taskContract.ts` — no changes
- `surfaces/agent-ops/run-ledger.yaml` — no direct edits
- `surfaces/agent-ops/results/**` — no direct edits
- `portal/**`, `package.json` — no changes
- Any dispatch automation, review automation, orchestration widening, multi-slot behavior,
  cross-repo behavior, or readiness-threshold work

---

## 3. Implementation

### 3.1 `runtime/runLedger.ts`

Add a purpose-built read-only export:

```ts
export type RunProofSurface = {
  run_id: string;
  motion_id: string | null;
  task_id: string;
  slot: string;
  provider: string;
  model: string;
  ts: string;
  current_run_state: "latest_live" | "historical_live_not_latest" | "superseded";
  result_status: ResultStatus;
  failure_note: string | null;
  output_artifact_path: string | null;
  output_artifact_exists: boolean | null;
  human_review_status: ReviewStatus;
  reviewed_at: string | null;
  applied_file: string | null;
  applied_file_exists: boolean | null;
  attempt: number | null;
  attempt_display: string;
  supersedes: string | null;
  superseded_by: string | null;
  latest_live_run_id: string | null;
  latest_live_ts: string | null;
  admissibility_state_now: "fresh_start_allowed" | "requires_supersedes" | "blocked_review_final";
  admissibility_reason_now: string;
  lineage_note: string | null;
};
```

And a narrow read-only builder:

```ts
export function buildRunProofSurface(
  runId: string,
  ledgerPath?: string,
): RunProofSurface
```

The builder reads the ledger, resolves the target run, normalizes legacy entries, computes
lineage state, and performs read-only file-existence checks for the result artifact and
applied file.

### 3.2 `runtime/show-run-proof.ts`

Add a new read-only CLI:

```text
show-run-proof.ts --run-id <run-id> [--ledger <repo-relative-path>]
```

The command prints one human-readable proof review surface to stdout only. It does not
mutate the ledger, artifacts, applied files, or motion files.

---

## 4. Acceptance criteria

- RS-01 read-only behavior
- RS-02 missing ledger
- RS-03 empty ledger
- RS-04 single run display
- RS-05 reviewed run display
- RS-06 rejected run display
- RS-07 superseded run display
- RS-08 current latest live run display
- RS-09 legacy pre-motion-0154 entry
- RS-10 malformed or missing run id
- RS-11 no ledger mutation
- RS-12 help / usage text
- RS-13 required gates pass

---

## 5. Non-goals

No automatic dispatch, no automatic review, no ledger mutation, no generalized
orchestration, no multi-slot behavior, no cross-repo behavior, no readiness-threshold
expansion, and no retroactive migration/backfill.
