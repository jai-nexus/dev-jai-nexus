# Proposal: Single-Slot Preflight Admissibility Enforcement v0

**Motion:** motion-0155
**Kind:** builder-proof
**Program:** q2-proof-hardening-preflight-admissibility
**Basis:** motion-0154

---

## 1. Problem statement

Motion-0154 added attempt lineage and explicit supersession metadata to the single-slot run
ledger. That closed post-dispatch lineage reconstruction gaps, but it still leaves one
important admissibility gap before dispatch begins.

1. **Repeated attempts are not gated before dispatch.** `run-slot-dispatch.ts` can start a
   new dispatch even when a prior non-superseded entry already exists for the same
   `(motion_id, task_id)` lineage.
2. **`--supersedes` is not yet lineage-aware.** The current preflight checks existence and
   basic lineage mismatch, but it returns early when `--supersedes` is absent and does not
   require explicit supersession for repeated attempts.
3. **Append-time validation is too late.** `appendRunRecord` remains a correct defense in
   depth boundary, but by that point provider dispatch and artifact write work may already
   have happened.

Motion-0155 closes those gaps with a read-only preflight check in `runtime/runLedger.ts`
and one call site in `runtime/run-slot-dispatch.ts`.

---

## 2. Scope

In scope:
- `runtime/runLedger.ts` — add read-only preflight admissibility enforcement using the
  existing ledger parse path and existing review-status semantics
- `runtime/run-slot-dispatch.ts` — call preflight before any provider dispatch work begins
  and clarify `--supersedes` help text
- `.nexus/motions/motion-0155/**` — governance package

Not in scope:
- `runtime/slotDispatch.ts` — no changes
- `runtime/taskContract.ts` — no changes
- `runtime/mark-run-reviewed.ts` — no changes
- `portal/**`, `package.json` — no changes
- New runtime files, retry behavior, orchestration generalization, controller logic, or
  cross-repo widening
- Moving preflight into `appendRunRecord`

---

## 3. Implementation

### 3.1 `runtime/runLedger.ts`

Export and implement:

```ts
export type PreflightResult =
  | { ok: true }
  | { ok: false; reason: string };

export function checkDispatchAdmissibility(
  motionId: string | null,
  taskId: string,
  supersedes: string | null,
  ledgerPath?: string,
): PreflightResult
```

The function remains read-only. It parses the existing ledger when present, derives the
live lineage for the requested `(motion_id, task_id)` pair, and applies these rules:

- first attempt is allowed only with `supersedes === null`
- repeated attempt requires `--supersedes`
- supplied `--supersedes` must reference the latest live entry for the same lineage
- already-superseded targets are rejected
- mismatched motion/task lineage is rejected with a precise reason
- `reviewed` and `approved` targets are treated as accepted/final review states and may not
  be superseded

`appendRunRecord` keeps its current validation as defense in depth.

### 3.2 `runtime/run-slot-dispatch.ts`

Call `checkDispatchAdmissibility(...)` after argument and scope validation but before:

- provider dispatch
- output artifact write
- ledger mutation

On failure, exit with the returned reason and status `1`.

---

## 4. Acceptance criteria

- P-01: first attempt allowed
- P-02: spurious `--supersedes` on first attempt blocked
- P-03: repeat without `--supersedes` blocked
- P-04: stale supersession target blocked
- P-05: already-superseded target blocked
- P-06: valid latest target allowed
- P-07: all prior superseded -> fresh start allowed
- P-08: accepted/final reviewed target blocked only if current repo semantics support that
  state
- P-09: fail-fast before dispatch
- P-10: ledger missing -> allowed
- P-11: legacy pre-motion-0154 entry treated as live
- P-12: `pnpm -C portal typecheck`
- help text updated to reflect the lineage requirement

---

## 5. Non-goals

No new runtime tools, no retry loop, no selector logic, no orchestration widening, no live
proof-only ledger append, and no reopening of motions `0134` through `0154`.
