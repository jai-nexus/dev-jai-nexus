# Challenge: Operator Escalation Routing v0

**Motion:** motion-0128

---

## Risks

- **R-1: council-run.mjs modification risk** — council-run is a high-sensitivity surface.
  Injection of escalation logic at two points (Stage 5 post-policy, Stage 7 pre-ratification)
  could break the run flow if not carefully scoped. Mitigation: edits are additive only;
  existing logic paths are not restructured; both injections are guarded by `exists()` checks.

- **R-2: blocking_reasons mutation** — The escalation lifecycle block pushes to `blocking_reasons`
  after it is destructured from `deriveCouncilPolicyOutcome`. This relies on the array being
  mutable post-destructure, which is valid JavaScript but could be surprising. The mutation
  is safe because `blocking_reasons` is passed by reference to `deriveCouncilDecisionOutcome`
  in the same stack frame.

- **R-3: escalation.yaml timestamp churn** — Repeated council-run calls on the same failed
  motion could overwrite escalation.yaml's `emitted_at` on every run. Mitigation: idempotency
  check compares `reason` field; only re-writes if reason changed.

- **R-4: RESOLVED escalation re-emission** — If operator resolves an escalation but the
  underlying gate still fails, a second council-run would re-emit ACTIVE over the RESOLVED
  artifact. This is intentional — a resolved escalation with a still-failing gate means the
  root cause is unresolved. Mitigation: documented behavior, not a bug.

- **R-5: activate-motion parse failure suppression** — The escalation block in activate-motion
  silently skips on parse error to avoid blocking activation when escalation.yaml is malformed.
  This is intentional for v0 — a malformed escalation.yaml should not hard-block activation.

---

## Objections

- **O-1: Two artifacts for one condition** — Having both `escalation.yaml` and
  `escalation-resolution.yaml` might seem redundant. Resolved: strict separation is
  intentional. `escalation.yaml` is machine-written live-state; `escalation-resolution.yaml`
  is operator-written action record. Overloading one artifact conflates detection and resolution.

- **O-2: Why not in decision.yaml?** — decision.yaml already has `status: BLOCKED` when
  required_ok=false. Resolved: `escalation.yaml` provides additional structured metadata
  (severity, blocking, reason) not present in decision.yaml, and is needed for the CLI
  listing query without parsing decision.yaml notes.

- **O-3: Why council-run and not a separate emit script?** — A separate `emit-escalation.mjs`
  script would require a separate invocation and would not be atomic with gate evaluation.
  Resolved: inlining in council-run ensures escalation.yaml is emitted in the same run
  that produces the policy failure.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.18
