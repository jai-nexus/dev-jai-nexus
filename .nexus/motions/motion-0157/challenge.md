# Challenge: JAI Motion Operations Surface v0

**Motion:** motion-0157

---

## 1. Key risks

- The surface could drift into workflow control instead of staying read-only.
- Queue derivation could overfit to modern motion packages and break on older ones.
- The UI could hide real package mismatches by collapsing motion and decision state too
  aggressively.
- Secondary artifacts could accidentally become required even though they are optional.

---

## 2. Required protections

- Read only from `.nexus/motions/**`; do not write from the UI.
- Surface both `motion.yaml` status and `decision.yaml` status explicitly.
- Treat parse failures and missing core files as attention states, not silent fallbacks.
- Keep optional secondary files recognized but non-blocking.
- Preserve the existing known `motion-0151` mismatch as evidence rather than repairing it.

---

## 3. Out of scope

- no scheduler behavior
- no readiness-threshold system
- no motion mutation from the UI
- no runtime proof behavior changes
- no cross-repo surface
- no orchestration or autonomy expansion
