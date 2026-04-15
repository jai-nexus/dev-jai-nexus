# Challenge: JAI Grid Council-Run Preconditions v0

**Motion:** motion-0134

---

## Risks

- **R-1: The precondition contract could accidentally collapse into automatic ratification
  behavior** - mitigated: this motion explicitly preserves `council-run` as a separate
  operator-invoked step. Any follow-on implementation must stop at guidance and named
  readiness outcomes.

- **R-2: Readiness checks could drift from read-only review into file repair** - mitigated:
  this motion explicitly forbids mutation, repair, portal-side writes, or any automatic
  file changes during precondition checking.

- **R-3: The scope could reopen motion-0133 instead of building on it** - mitigated:
  motion-0133 is treated as settled merged baseline. This motion addresses only the
  handoff contract from review readiness into explicit operator-invoked council-run.

- **R-4: Operator guidance could become vague and fail to improve usability** - mitigated:
  the package requires explicit ready/blocked outcomes and explicit next-step guidance for
  both states, rather than generic messaging.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.08
