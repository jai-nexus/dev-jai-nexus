# Execution: JAI Grid Governance Execution Visibility v0

**Motion:** motion-0137
**Status:** open

---

## Implementation targets

- [ ] `portal/scripts/grid-status.mjs` — new script
- [ ] `package.json` — add `grid:status` entry

## Behavior to implement

- Reads `motion.yaml`, `decision.yaml`, `verify.json`, `vote.json`, `policy.yaml` from
  `.nexus/motions/{id}/`
- Computes named execution state: `EXECUTION_RATIFIED`, `EXECUTION_BLOCKED`,
  `EXECUTION_PENDING`, `EXECUTION_DRAFT`, `EXECUTION_NOT_STARTED`, `WRONG_STATE`
- `EXECUTION_RATIFIED` exits 0; all other states exit 1
- Human output: decision status, gate results (name + pass/fail), vote summary (per-role
  + outcome), policy summary (risk_score, eligible, recommended)
- `--json` output: `{ motion_id, execution_state, ready, decision, gates, vote, policy, next_step }`
- Absent optional artifacts (`policy.yaml`, `verify.json`) handled gracefully — noted in
  output, not a crash
- Does not write to `.nexus/` under any flag
- Does not invoke `council-run`

## Validation gates

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0137/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
```

## Evidence log

_To be filled during implementation._
