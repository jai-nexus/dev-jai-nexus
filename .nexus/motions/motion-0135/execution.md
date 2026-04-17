# Execution: JAI Grid Vote Preparation Ergonomics v0

**Motion:** motion-0135
**Status:** open

---

## Implementation targets

- [ ] `portal/scripts/grid-vote-prep.mjs` — new script
- [ ] `package.json` — add `grid:vote-prep` entry

## Behavior to implement

- Read-only mode: validate motion state, preflight pass, vote.json presence and structure
- Scaffold mode (`--scaffold`): write `vote.json` template with required roles from
  `.nexus/council.config.yaml`; `"vote": ""` placeholders only
- `--scaffold` blocks if `vote.json` already exists unless `--force` is passed
- `--json` flag for machine-readable output
- Named outcomes: `VOTE_READY`, `BLOCKED_MISSING_VOTE`, `BLOCKED_MALFORMED_VOTE`,
  `BLOCKED_WRONG_STATE`, `BLOCKED_ALREADY_RATIFIED`
- Explicit next-step command emitted for each outcome

## Validation gates

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0135/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
```

## Evidence log

_To be filled during implementation._
