# Proposal: Single-Slot Agent Proof Attestation v0

**Motion:** motion-0153
**Kind:** builder-proof
**Program:** q2-proof-hardening-execution-attestation
**Basis:** motion-0152

---

## 1. Problem statement

Motion-0152 established the first genuine agent-executed repo task. The run ledger records
each invocation, result, and human review status. Three concrete attestation gaps remain
in the post-review step:

1. **No `reviewed_at` timestamp.** The ledger records `human_review_status` transitions
   (pending → reviewed / approved / rejected) but does not record when the transition
   occurred. The operator knows the review happened but cannot place it in time from the
   ledger alone.

2. **No `applied_file` field.** When an operator applies a reviewed agent output to the
   repo, the ledger does not record which file was produced. The link between the ledger
   entry and the applied artifact exists only in prose (`execution.md`) and in the
   artifact's own provenance comment.

3. **Rejected reviews are not durably distinguished.** The `human_review_status` enum
   already includes `rejected`, but `mark-run-reviewed.ts` does not enforce any semantic
   distinction between accepted and rejected reviews. A `rejected` entry with an
   `applied_file` would produce a contradictory ledger state with no guard at the CLI.

Motion-0153 closes all three gaps with minimal targeted changes to two runtime files.

---

## 2. Scope

In scope:
- `runtime/runLedger.ts` — extend `StoredLedgerEntry` with `reviewed_at` and
  `applied_file`; extend `updateRunReviewStatus` to accept and persist both fields;
  update ledger serialization and backward-compat parse paths
- `runtime/mark-run-reviewed.ts` — add `--applied-file` CLI option; auto-generate
  `reviewed_at` at invocation time; block `rejected` + `--applied-file`; enforce
  `applied_file` repo-root boundary; pass both fields to `updateRunReviewStatus`
- `.nexus/motions/motion-0153/**` — governance package

Not in scope:
- `runtime/run-slot-dispatch.ts` — no changes
- `runtime/taskContract.ts` — no changes
- `runtime/slotDispatch.ts` — no changes
- `portal/**`, `package.json` — no changes
- New attestation subsystem, directory, or schema
- Generalized orchestration, autonomous behavior, or cross-repo widening

---

## 3. Implementation: `runtime/runLedger.ts`

### 3.1 `StoredLedgerEntry` type extension

Two nullable fields added to `StoredLedgerEntry` (the internal persisted type).
`RunRecord` is not modified — `run-slot-dispatch.ts` requires no changes.

```typescript
type StoredLedgerEntry = RunRecord & {
  task_field_name: "task_id" | "task_ref";
  reviewed_at: string | null;
  applied_file: string | null;
};
```

### 3.2 `normalizeRunRecordInput`

New entries start with both attestation fields null:

```typescript
reviewed_at: null,
applied_file: null,
```

### 3.3 `updateRunReviewStatus` signature

Extended to accept the new attestation fields before the optional `ledgerPath`:

```typescript
export function updateRunReviewStatus(
  runId: string,
  status: ReviewUpdateStatus,
  reviewedAt: string,
  appliedFile: string | null,
  ledgerPath: string = RUN_LEDGER_PATH,
): string
```

All three review fields are set atomically on the found entry before the ledger is
rewritten. The only caller is `mark-run-reviewed.ts`, which is co-updated.

### 3.4 Ledger serialization

`formatRunRecordBlock` appends two new lines after `human_review_status`:

```
  reviewed_at: <ISO string or null>
  applied_file: <repo-relative path or null>
```

### 3.5 Backward-compatible parse path

`applyParsedField` gains two new cases (`reviewed_at`, `applied_file`).
`finalizeParsedEntry` defaults both fields to `null` via `?? null` — existing ledger
entries without these fields parse and rewrite without error or data loss.

---

## 4. Implementation: `runtime/mark-run-reviewed.ts`

### 4.1 `--applied-file` option

Optional. Accepts a repo-relative path. Resolved against `process.cwd()` and validated
to remain inside the repo root — the same boundary check used by `loadInputRefSection`
in `slotDispatch.ts`. The stored value is always the normalized repo-relative form.

### 4.2 `reviewed_at` auto-generation

The operator does not supply a timestamp. `reviewedAt = new Date().toISOString()` is
set in `main` at invocation time and passed directly to `updateRunReviewStatus`.

### 4.3 `rejected` + `--applied-file` guard

If `--status rejected` is combined with `--applied-file`, `parseArgs` returns an error
and exits 1 before any ledger write:

```
--applied-file is not allowed with --status rejected
```

### 4.4 Operator output

`main` prints `reviewed_at` unconditionally and `applied_file` when non-null.

---

## 5. Acceptance criteria

- Reviewed ledger entries record `reviewed_at` (ISO 8601).
- Reviewed entries with `--applied-file` record the repo-relative path in `applied_file`.
- Rejected entries record `reviewed_at` and `applied_file: null`.
- `--status rejected --applied-file ...` exits 1 with a legible error.
- Nonexistent `--run-id` exits 1 with a legible error.
- Missing `--status` exits 1 with a legible error.
- Old ledger entries (without `reviewed_at` / `applied_file`) survive parse and rewrite without corruption.
- Legacy `task_ref` / `task_field_name` round-trip behavior is preserved.
- `applied_file` path traversal and absolute paths are rejected.
- `pnpm -C portal typecheck` passes.

---

## 6. Non-goals

No new attestation subsystem, no directory changes outside `.nexus/motions/motion-0153/`,
no changes to slots, providers, or dispatch logic, no orchestration, no autonomous behavior.
