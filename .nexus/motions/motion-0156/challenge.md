# Challenge: Single-Slot Operator Proof Review Surface v0

**Motion:** motion-0156
**Challenger:** VERIFIER

---

## R-1: Reporting logic accidentally mutates ledger state

**Risk:** A review surface that reuses the wrong helper could rewrite the ledger or fill in
missing lineage fields while reporting.

**Mitigation:** Motion-0156 is read-only by construction. The new builder must use only
read/parse paths and must not call `appendRunRecord` or `updateRunReviewStatus`.

**Residual risk:** Low if the CLI is kept separate from the mutation tools.

---

## R-2: Review surface blurs with review decision

**Risk:** Extending `mark-run-reviewed.ts` would mix read-only proof inspection with the
write path that changes review state.

**Mitigation:** Motion-0156 adds a new CLI instead of extending `mark-run-reviewed.ts`.

**Residual risk:** Very low.

---

## R-3: Report overfits motion-0152 history

**Risk:** The first genuine proof history is concentrated in motion-0152 entries, which can
pull the design toward a one-off historical viewer instead of a general single-slot proof
surface.

**Mitigation:** The view must key off `run_id`, `motion_id`, `task_id`, and existing ledger
state only. No motion-specific logic is allowed.

**Residual risk:** Low.

---

## R-4: Admissibility state and review surface get conflated

**Risk:** The report could start behaving like a controller by turning admissibility state
into imperative next-step guidance.

**Mitigation:** Motion-0156 surfaces current admissibility state as read-only context only.
It must not suggest, trigger, or automate dispatch behavior.

**Residual risk:** Low.
