# Decision - motion-0099

## Status
DRAFT

## Summary
Motion `motion-0099` introduces the first Codex repo conditioning layer for
dev-jai-nexus: two Claude Code project-level skills and an eval fixture harness.

## Skills created

| Skill | Workflow encoded |
|---|---|
| `/motion-ratify` | Governed ratification sweep (vote.json, verify.json, policy.yaml, decision.yaml → RATIFIED) |
| `/motion-status` | Read-only activation lane analysis (packet/queue/SoT state + next-action table) |

## Eval harness

`motion-ratify-eval.yaml` (8 acceptance criteria, 3 negative test cases) using
motion-0093 as the known-correct reference package.

## Important note

This is **not** model fine-tuning. The skills are structured prompt files
(`.claude/commands/`) that encode repeatable repo-specific workflows. The eval
fixture is a behavioral specification for human/assisted evaluation.

## Next conditioning steps

- `/motion-passalong` skill when passalong patterns stabilize
- `motion-status-eval.yaml` once verifier proof is established (route:VERIFIER is the new reference state)
- MCP reference if a local tool server is established for DB queries
