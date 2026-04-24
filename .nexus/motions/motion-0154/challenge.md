# Challenge: Single-Slot Execution Attempt Lineage and Supersession v0

**Motion:** motion-0154
**Challenger:** VERIFIER

---

## R-1: `attempt: null` default misleads operators on old entries

**Risk:** Pre-motion-0154 entries display `attempt: null`, which is honest but may confuse
operators who expect a sequence number. They might think "null = not counted" rather than
"null = pre-lineage entry."

**Mitigation:** `null` is explicitly chosen over `1` because defaulting all old entries
to `1` would be factually wrong (the six motion-0152 entries were not all first attempts).
`null` is the correct signal for "this entry predates attempt tracking." Operators reading
the ledger after motion-0154 will see new entries with integers and old entries with null —
the distinction is clear.

**Residual risk:** Low. Honest signal over false precision.

---

## R-2: `appendRunRecord` always-parse-then-rewrite is slower and more failure-prone

**Risk:** Replacing the append path with full parse-then-rewrite means every dispatch reads
and rewrites the entire ledger. If the ledger is large or the write is interrupted, data
could be lost.

**Mitigation:** The ledger is a local audit file with tens of entries. Full rewrite is
standard for this scale and consistent with how `updateRunReviewStatus` already works.
`writeFileSync` is atomic at the OS level for normal file sizes. The supersession
validation happens before the write, so no partial state is committed.

**Residual risk:** Low. Acceptable for the current single-slot proof posture.

---

## R-3: Operator supplies a `--supersedes` value for an entry in a different task

**Risk:** There is no enforcement that the superseded entry has the same `task_id` or
`motion_id` as the new run. An operator could accidentally cross-link entries.

**Mitigation:** Validation checks only existence of the `run_id` in the ledger, not semantic
correctness. Cross-task supersession is unusual but not necessarily wrong — the operator
may have a legitimate reason. The link is visible in both entries for review. This is
intentionally left to operator judgment.

**Residual risk:** Low. Operator legibility is preserved; accidental cross-links are visible.

---

## R-4: `appendFileSync` dead import not removed causes confusion

**Risk:** If `appendFileSync` is not removed from the import after the append path is
deleted, it leaves dead code that could mislead future readers.

**Mitigation:** `appendFileSync` is confirmed used only in the removed append path.
The motion-0154 implementation removes it from the `node:fs` import. TypeScript typecheck
would flag an unused import if the tsconfig had `noUnusedLocals` (it may not), so the
removal is done explicitly regardless.

**Residual risk:** None — confirmed removed in implementation.
