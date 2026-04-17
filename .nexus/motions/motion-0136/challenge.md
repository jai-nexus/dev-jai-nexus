# Challenge: JAI Grid Governance Launch Ergonomics v0

**Motion:** motion-0136

---

## Risks

- **R-1: grid:launch could be mistaken for a command that invokes council-run** — mitigated:
  `grid:launch` is strictly read-only. It runs sub-probes and emits a verdict. The
  `LAUNCH_READY` next-step command must be printed as text for the operator to run
  explicitly. No auto-invocation of `council-run` under any flag.

- **R-2: Sub-probe output could be swallowed, hiding failure detail from the operator** —
  mitigated: blocked outcomes must include the sub-probe's exit code and a relevant excerpt
  from its output in the check detail field. The operator must not need to re-run the
  sub-probe to understand why it failed.

- **R-3: The scope could expand to include vote scaffolding** — mitigated: `grid:launch`
  has no `--scaffold` flag. Scaffold behavior belongs to `grid:vote-prep`. The blocked
  `BLOCKED_VOTE_NOT_READY` outcome must point the operator to `grid:vote-prep --scaffold`,
  not duplicate that behavior.

- **R-4: The tool could write to .nexus/ as a side effect of running sub-probes** —
  mitigated: all sub-probes (`grid:review`, `grid:preflight`, `grid:vote-prep`) are
  confirmed read-only in their default modes. `grid:launch` must invoke them in default
  mode (no `--scaffold`, no mutation flags).

- **R-5: A stale sub-probe result could produce a false LAUNCH_READY** — mitigated:
  `grid:launch` must invoke each sub-probe fresh at runtime via `spawnSync`. It must not
  cache or persist sub-probe results between runs.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.06
