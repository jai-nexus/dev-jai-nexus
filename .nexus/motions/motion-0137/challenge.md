# Challenge: JAI Grid Governance Execution Visibility v0

**Motion:** motion-0137

---

## Risks

- **R-1: grid:status could be mistaken for a command that re-evaluates governance
  outcomes** — mitigated: `grid:status` reads `vote.json outcome` and `decision.yaml
  status` as written by `council-run`. It does not recompute PASS/FAIL/PENDING. Vote
  outcome evaluation belongs exclusively to `council-run`.

- **R-2: The EXECUTION_PENDING and EXECUTION_DRAFT states could be conflated** —
  mitigated: the implementation must distinguish them explicitly. `EXECUTION_PENDING` means
  `vote.json` is present and `outcome.result=PENDING` (missing required roles).
  `EXECUTION_DRAFT` means `vote.json` is absent or has no evaluated outcome. Each must
  emit a different next-step command.

- **R-3: The tool could introduce a false sense of completion for partially-executed
  motions** — mitigated: only `decision.yaml status=RATIFIED` produces `EXECUTION_RATIFIED`
  with exit 0. All other states exit 1 and include a concrete remediation next-step.

- **R-4: policy.yaml or verify.json could be absent in older motions, causing parse
  failures** — mitigated: the implementation must handle absent optional artifact files
  gracefully, noting their absence in output rather than crashing.

- **R-5: The tool could be used to invoke council-run as a side effect** — mitigated:
  `grid:status` has no execution flag. It is strictly a reader. `council-run` appears
  only as text in the `next_step` field of certain states, not as an invocation.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.05
