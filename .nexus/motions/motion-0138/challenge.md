# Challenge: JAI Grid Governance Operator Cockpit v0

**Motion:** motion-0138

---

## Risks

- **R-1: grid:operator could be mistaken for an execution trigger** — mitigated:
  `grid:operator` is strictly a probe compositor. It calls four backing commands with
  `--json` and reads their output. `pnpm council:run` appears only as text in the
  `next_step` field and the `council_run_command` output field when `cockpit_state ===
  READY`. No subprocess invocation of `council-run` exists anywhere in the
  implementation.

- **R-2: EXECUTED state could be reached without real ratification artifacts** —
  mitigated: `EXECUTED` is produced exclusively by `normalizeStatusProbe` when
  `execution_state === EXECUTION_RATIFIED` AND `probe.status === 0`. `BLOCKED_ALREADY_RATIFIED`
  signals from `grid:vote-prep` and `grid:launch` are mapped to `BLOCKED`, not `EXECUTED`.
  The only authoritative path to EXECUTED is a `grid:status` probe that exits 0 and reports
  `EXECUTION_RATIFIED`, which requires a real `decision.yaml status=RATIFIED` artifact.

- **R-3: A success token without a clean exit could produce a false READY or EXECUTED** —
  mitigated: all positive branches (VOTE_READY, READY_TO_INVOKE_COUNCIL_RUN, LAUNCH_READY,
  EXECUTION_RATIFIED) require `probe.status === 0` in addition to the matching success token.
  If a probe emits a success token but exits non-zero, the stage is downgraded to UNKNOWN
  with a diagnostic detail string.

- **R-4: cockpit state READY could be interpreted as "council-run will run automatically"** —
  mitigated: the `council_run_command` field is a plain string in the output, not an
  invocation. The human output labels it explicitly as a boundary: `Council-run boundary -->
  pnpm council:run <id>`. The operator must invoke it separately and explicitly.

- **R-5: UNKNOWN could silently swallow an actionable BLOCKED state if multiple probes
  fail simultaneously** — mitigated: all four stage states are always reported individually
  in the `stages` object, regardless of top-level cockpit state. The operator can inspect
  each stage independently. UNKNOWN at the cockpit level means at least one probe failed
  to return readable output; BLOCKED stages are still visible in the stage breakdown.

---

## Required gates

- validate_motion
- validate_agency
- typecheck

## Risk score

risk_score: 0.05
