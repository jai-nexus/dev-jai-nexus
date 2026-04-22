# Challenge: Single-Slot Agent Proof Attestation v0

**Motion:** motion-0153
**Challenger:** VERIFIER

---

## R-1: Old ledger entries fail to parse after serialization change

**Risk:** Existing ledger entries do not have `reviewed_at` or `applied_file` fields.
If `finalizeParsedEntry` requires them, old entries will throw on parse.

**Mitigation:** `finalizeParsedEntry` defaults both fields to `null` via `?? null`.
`applyParsedField` already ignores unknown field names via a `default: return` case;
the two new cases handle the new fields when present and the `?? null` fallback covers
their absence. Round-trip behavior is verified by acceptance test V-12.

**Residual risk:** Low.

---

## R-2: `applied_file` path traversal

**Risk:** An operator supplies `--applied-file ../../../etc/passwd` or an absolute path.
The stored value would point outside the repo, misleading attestation.

**Mitigation:** `resolveAppliedFile` uses the same boundary check as `loadInputRefSection`
in `slotDispatch.ts`: resolve to absolute, verify the result starts with the normalized
repo root. Absolute paths and traversal paths that escape the repo root both fail this
check before any ledger write.

**Residual risk:** Very low.

---

## R-3: `updateRunReviewStatus` signature change breaks callers

**Risk:** Adding `reviewedAt` and `appliedFile` before the optional `ledgerPath` changes
the positional call signature. Any caller passing `ledgerPath` positionally would silently
misinterpret the new parameters.

**Mitigation:** The only caller is `mark-run-reviewed.ts`, co-updated in the same motion.
No other file imports `updateRunReviewStatus`. TypeScript typecheck (required gate) will
surface any missed caller with a type error.

**Residual risk:** Low. Co-update is atomic; typecheck is required.

---

## R-4: `rejected` + `applied_file` contradiction accepted silently

**Risk:** An operator passes `--status rejected` and `--applied-file`, producing a ledger
entry that records both a rejection and an applied artifact — a contradictory state.

**Mitigation:** `parseArgs` returns an error and exits 1 before any ledger write when
`--status rejected` and `--applied-file` are combined. The error is explicit. Direct
callers of `updateRunReviewStatus` are not validated at the function level — this is
intentional; the function does not know the caller's intent and the CLI is the boundary.

**Residual risk:** None at the CLI boundary.
