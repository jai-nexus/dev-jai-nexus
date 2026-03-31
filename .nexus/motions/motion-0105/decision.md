# Decision: Codex Conditioning Expansion — motion-create eval coverage

**Motion:** motion-0105
**Kind:** codex-conditioning

## Status

RATIFIED

## Summary

Motion `motion-0105` adds `motion-create-eval.yaml` — the behavioral specification
for the `/motion-create` skill that was deferred in motion-0103.

Primary artifact: `.nexus/codex/evals/motion-create-eval.yaml`

Ratification artifacts written: `vote.json`, `verify.json`, `policy.yaml`.

## What was added

- `motion-create-eval.yaml`: 5 test cases (happy path, schema assertions, number
  selection, validate-motion gate), 4 refusal cases (unknown kind, missing title,
  no arguments, ambiguous token), 9 acceptance criteria
- README eval fixtures table updated; extension points trimmed to passalong and MCP

## Conditioning layer eval coverage

| Skill | Eval fixture | Status |
|---|---|---|
| `/motion-ratify` | `motion-ratify-eval.yaml` | RATIFIED (motion-0099) |
| `/motion-status` | `motion-status-eval.yaml` | RATIFIED (motion-0103) |
| `/run-proof-lane` | `run-proof-lane-eval.yaml` | RATIFIED (motion-0104) |
| `/motion-create` | `motion-create-eval.yaml` | RATIFIED (motion-0105) |
