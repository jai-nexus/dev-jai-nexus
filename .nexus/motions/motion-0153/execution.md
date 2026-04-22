# Execution: Single-Slot Agent Proof Attestation v0

**Motion:** motion-0153
**Kind:** builder-proof
**Program:** q2-proof-hardening-execution-attestation
**Status:** RATIFIED

---

## Implemented surfaces

Bounded implementation and proof artifacts present in the working tree:

- `runtime/runLedger.ts`
- `runtime/mark-run-reviewed.ts`
- `surfaces/agent-ops/run-ledger.yaml`

This ratification step did not modify `runtime/run-slot-dispatch.ts`, `runtime/taskContract.ts`,
`runtime/slotDispatch.ts`, `portal/**`, `package.json`, or unrelated runtime surfaces.
Ratification edits were confined to `.nexus/motions/motion-0153/**`.

---

## Required gate results

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0153/motion.yaml` → PASS
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` → PASS
- `pnpm -C portal typecheck` → PASS

---

## Smoke check results

- V-04 help text contains `--applied-file`: PASS
- V-05 reviewed + applied-file (exit 0; `reviewed_at` ISO string, `applied_file` path written): PASS
- V-06 reviewed without applied-file (exit 0; `applied_file: null`): PASS
- V-07 rejected path (exit 0; `applied_file: null`): PASS
- V-08 rejected + applied-file blocked (exit 1; `--applied-file is not allowed with --status rejected`): PASS
- V-09 nonexistent run-id (exit 1; `run_id not found`): PASS
- V-10 missing status (exit 1; mentions `--status`): PASS
- V-11 path traversal blocked (exit 1; `must remain inside the repo`): PASS
- V-12 old-entry round-trip (existing entries gain `reviewed_at: null`, `applied_file: null`; no other fields altered): PASS

---

## Live-ledger proof closures

Two real motion-0152 ledger entries were closed using the implemented tool as direct proof evidence.

**Closure 1 — approved entry annotated:**

```
node --experimental-strip-types runtime/mark-run-reviewed.ts \
  --run-id motion-0152--slot_builder_01--20260422T190831Z--c281lr \
  --status reviewed \
  --applied-file .nexus/docs/task-contract-v0.md
```

Output:
```
run_id: motion-0152--slot_builder_01--20260422T190831Z--c281lr
human_review_status: reviewed
reviewed_at: 2026-04-22T22:42:35.920Z
applied_file: .nexus/docs/task-contract-v0.md
ledger_path: surfaces/agent-ops/run-ledger.yaml
```

**Closure 2 — failed-review entry formally rejected:**

```
node --experimental-strip-types runtime/mark-run-reviewed.ts \
  --run-id motion-0152--slot_builder_01--20260422T184910Z--ngswlb \
  --status rejected
```

Output:
```
run_id: motion-0152--slot_builder_01--20260422T184910Z--ngswlb
human_review_status: rejected
reviewed_at: 2026-04-22T22:42:53.865Z
ledger_path: surfaces/agent-ops/run-ledger.yaml
```

Both closures modified only `surfaces/agent-ops/run-ledger.yaml`. No code was changed.

---

## Boundary confirmation

No-touch boundaries held:

- `runtime/run-slot-dispatch.ts` — unchanged
- `runtime/taskContract.ts` — unchanged
- `runtime/slotDispatch.ts` — unchanged
- `portal/**` — unchanged
- `package.json` — unchanged

---

## Ratification basis

1. `runLedger.ts` extends `StoredLedgerEntry` with `reviewed_at` and `applied_file`; `RunRecord` is unchanged, so `run-slot-dispatch.ts` requires no edits.
2. `updateRunReviewStatus` accepts `reviewedAt` and `appliedFile` and sets all three review fields atomically before rewriting the ledger.
3. Old ledger entries parse and rewrite without error; new fields default to `null` via `?? null` in `finalizeParsedEntry`.
4. `mark-run-reviewed.ts` auto-generates `reviewed_at` at invocation time; `--applied-file` is validated to remain inside the repo root; `--status rejected` combined with `--applied-file` exits 1 before any ledger write.
5. All required gates passed.
6. All twelve acceptance checks passed.
7. Live-ledger proof closures confirmed the tool on real motion-0152 entries.
