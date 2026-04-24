# Proposal: Single-Slot Execution Attempt Lineage and Supersession v0

**Motion:** motion-0154
**Kind:** builder-proof
**Program:** q2-proof-hardening-rerun-semantics
**Basis:** motion-0153

---

## 1. Problem statement

The run ledger is append-only and flat. Every invocation of `run-slot-dispatch.ts` produces
an independent entry with no relationship to prior entries for the same task. Four concrete
gaps follow from this.

1. **No attempt sequencing.** The live ledger has six motion-0152 entries for
   `canon-doc-task-contract-v0`. An operator reading it must count timestamps manually to
   understand which was the first, third, or sixth attempt. There is no `attempt` field.

2. **No supersession record at dispatch time.** When `c281lr` was dispatched, there was no
   way to say "this replaces `ngswlb`" in the ledger. The relationship exists only in
   `execution.md` prose. Future reruns will produce the same situation.

3. **No `superseded_by` marker on old entries.** Even after motion-0153 closed `ngswlb` as
   `rejected`, the ledger has no pointer to the run that replaced it. Lineage is only
   reconstructable externally.

4. **`appendRunRecord` never parses existing entries.** The non-empty-ledger path uses
   `appendFileSync` without parsing, making attempt counting and supersession validation
   impossible in the current implementation.

Motion-0154 closes all four gaps with minimal targeted changes to two runtime files.

---

## 2. Scope

In scope:
- `runtime/runLedger.ts` — add `supersedes?: string | null` to `RunRecord`; add `attempt`,
  `supersedes`, `superseded_by` to `StoredLedgerEntry`; replace the append-only path in
  `appendRunRecord` with always-parse-then-rewrite; compute `attempt` from existing entries;
  validate and apply `supersedes` atomically; update serialize/parse/format paths; add
  `yamlNullableInteger` helper; remove dead `appendFileSync` import
- `runtime/run-slot-dispatch.ts` — add optional `--supersedes <run-id>` CLI flag; parse it;
  pass it through to `RunRecord`
- `.nexus/motions/motion-0154/**` — governance package

Not in scope:
- `runtime/mark-run-reviewed.ts` — no changes
- `runtime/taskContract.ts` — no changes
- `runtime/slotDispatch.ts` — no changes
- `portal/**`, `package.json` — no changes
- No new runtime tools
- No automated retry or orchestration
- No cross-repo widening

---

## 3. Implementation: `runtime/runLedger.ts`

### 3.1 `RunRecord` extension

One optional field added:

```typescript
supersedes?: string | null;
```

The field is optional so all existing callers constructing `RunRecord` objects remain
valid without changes.

### 3.2 `StoredLedgerEntry` extension

Three fields added:

```typescript
attempt: number | null;       // auto-computed from existing entries at dispatch time
supersedes: string | null;    // from RunRecord; operator-supplied
superseded_by: string | null; // set retroactively on the old entry during appendRunRecord
```

`attempt` is `number | null` (not `number`) so pre-motion-0154 entries parse as `null`
rather than a misleading `1`.

### 3.3 `appendRunRecord` — parse-then-rewrite

The append-only path is replaced with a full read-parse-rewrite cycle:

1. Read current ledger (or initialize empty)
2. Parse all existing entries via `parseLedgerSequence`
3. Compute `attempt`: count entries with matching `(motion_id, task_id)` + 1
4. Normalize new entry with `normalizeRunRecordInput(runRecord, attempt)`
5. If `supersedes` is non-null: find the referenced entry; throw before any write if not
   found; set `superseded_by` on the found entry
6. Append new entry and rewrite the full ledger atomically

`appendFileSync` is removed (dead after this change).

### 3.4 Serialization

`formatRunRecordBlock` adds three lines: `attempt` and `supersedes` after the task field,
`superseded_by` after `applied_file`. `attempt` serializes as an unquoted integer or `null`
via `yamlNullableInteger`.

### 3.5 Backward-compatible parse path

`applyParsedField` gains cases for `attempt`, `supersedes`, `superseded_by`. All three
default to `null` in `finalizeParsedEntry` when absent — old entries parse and round-trip
without error or data loss.

---

## 4. Implementation: `runtime/run-slot-dispatch.ts`

One optional CLI flag added:

```
--supersedes <run-id>   run-id of a prior ledger entry this run explicitly supersedes
```

`parseArgs` stores it as `supersedes: string | null`. The `RunRecord` construction passes
`supersedes: parsedArgs.supersedes`. No other changes.

---

## 5. Design decisions

- `superseded` is NOT added as a `ReviewStatus` — supersession is lineage, not review
- Old entries default to `attempt: null`, not `attempt: 1` — false sequencing is worse
  than no sequencing
- Supersession is only at dispatch time via `--supersedes`; no retroactive supersession
  without a new dispatch
- `appendRunRecord` validates `supersedes` existence before any write — no dangling pointers

---

## 6. Acceptance criteria

- A-01: First attempt for a (motion_id, task_id) pair → `attempt: 1`
- A-02: Second attempt, no `--supersedes` → `attempt: 2`; prior entry unchanged
- A-03: `--supersedes <id>` → new entry has `supersedes: <id>`
- A-04: Supersession is atomic — old entry's `superseded_by` and new entry written together
- A-05: Stale failure then explicit superseding run → prior entry gets `superseded_by`
- A-06: Rejected-review run then rerun with `--supersedes` → both entries correct
- A-07: `--supersedes <nonexistent-id>` → throws before any ledger write
- A-08: `--supersedes` with no value → exit 1; `missing value for --supersedes`
- A-09: Old entries survive parse + rewrite with `attempt: null`, `supersedes: null`, `superseded_by: null`
- A-10: Legacy `task_ref` entries survive round-trip
- A-11: Superseded entry retains all original fields; only `superseded_by` changes
- A-12: Attempt counter is per (motion_id, task_id) — different task starts at 1
- A-13: `pnpm -C portal typecheck` passes
- A-14: `run-slot-dispatch.ts --help` output contains `--supersedes`

---

## 7. Non-goals

No automated retry, no `superseded` review status, no bulk supersession, no cross-ledger
references, no new runtime tools, no changes outside the two touch files.
