# Decision: Codex Conditioning Expansion — run-proof-lane skill

**Motion:** motion-0104
**Kind:** codex-conditioning

## Status

RATIFIED

## Summary

Motion `motion-0104` adds the `/run-proof-lane` skill — the final piece of the
Codex conditioning layer for the Track A execution program.

Primary artifact: `.claude/commands/run-proof-lane.md`

Ratification artifacts written: `vote.json`, `verify.json`, `policy.yaml`.

## What was added

- `/run-proof-lane <stage> <motionId>` — orchestrates enqueue + run-once + post-check
  for ARCHITECT, BUILDER, and VERIFIER stages
- `run-proof-lane-eval.yaml` — 3 valid cases, 5 refusal cases, 8 AC
- OPERATOR_REVIEW explicitly excluded (human gate)

## Conditioning layer state after this motion

| Skill | Purpose |
|---|---|
| `/motion-ratify` | Governance ratification |
| `/motion-status` | Lane state read |
| `/motion-create` | Motion package scaffolding |
| `/run-proof-lane` | Proof lane execution |

The core Codex conditioning layer for the offbook-ai-bootstrap program is complete
and RATIFIED for this motion.
