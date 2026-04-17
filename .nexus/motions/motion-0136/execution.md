# Execution: JAI Grid Governance Launch Ergonomics v0

**Motion:** motion-0136
**Status:** open

---

## Implementation targets

- [ ] `portal/scripts/grid-launch.mjs` — new script
- [ ] `package.json` — add `grid:launch` entry

## Behavior to implement

- Runs `grid:review`, `grid:preflight`, `grid:vote-prep` as read-only sub-probes in sequence
- Short-circuits on first failure with named blocked outcome
- Named outcomes: `LAUNCH_READY`, `BLOCKED_REVIEW_FAILED`, `BLOCKED_PREFLIGHT_FAILED`,
  `BLOCKED_VOTE_NOT_READY`, `BLOCKED_WRONG_STATE`, `BLOCKED_ALREADY_RATIFIED`
- `LAUNCH_READY` emits `pnpm council:run <motion-id>` as the next-step command
- `--json` flag for machine-readable output: `{ motion_id, outcome, ready, failed_check, checks, next_step }`
- No `--scaffold` flag — scaffold belongs to `grid:vote-prep`
- No writes to `.nexus/` under any flag
- Never invokes `council-run`
- Sub-probes invoked via `spawnSync` in default read-only mode

## Validation gates

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0136/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
```

## Evidence log

_To be filled during implementation._
