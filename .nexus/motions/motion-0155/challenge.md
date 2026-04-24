# Challenge: Single-Slot Preflight Admissibility Enforcement v0

**Motion:** motion-0155
**Challenger:** VERIFIER

---

## R-1: Legacy entries become the live target

**Risk:** Pre-motion-0154 entries do not carry explicit `superseded_by` fields in the
committed ledger. The parse path defaults them to `null`, so they are treated as live.

**Mitigation:** This is intentional. Legacy entries are still real lineage state. Treating
them as live is more honest than silently ignoring them.

**Residual risk:** Low. Operators must explicitly supersede the latest live entry.

---

## R-2: Reviewed or approved entries cannot be superseded

**Risk:** If the latest live entry is already in an accepted/final review state, a rerun is
blocked instead of silently replacing it.

**Mitigation:** This preserves explicit review closure semantics already present in canon.
Motion-0155 only blocks states that exist in the current repo review model: `reviewed` and
`approved`.

**Residual risk:** Low. Explicit operator intent is preserved; silent replacement is not.

---

## R-3: Preflight duplicates append-time validation

**Risk:** `checkDispatchAdmissibility` and `appendRunRecord` both validate supersession
constraints, which can look redundant.

**Mitigation:** The duplication is intentional. Preflight is fail-fast and read-only;
append-time validation remains defense in depth in case preflight is bypassed.

**Residual risk:** Low. The behavior is consistent and bounded to the same two files.

---

## R-4: Missing ledger path could over-block first runs

**Risk:** A missing ledger file might be treated as an error instead of a clean first-run
state.

**Mitigation:** Motion-0155 explicitly treats missing ledger as zero live entries. First
attempts remain admissible without creating or mutating the ledger.

**Residual risk:** None at the intended boundary.
