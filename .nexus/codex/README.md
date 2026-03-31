# Codex Repo Conditioning — dev-jai-nexus

## What this is

This directory contains repo-local **Codex conditioning** artifacts for dev-jai-nexus.

"Codex conditioning" means:

- **Repo-scoped skill prompts** (`.claude/commands/`) — Claude Code slash commands
  that encode repeatable dev-jai-nexus workflows as structured prompts.
- **Eval fixtures** (`evals/`) — test cases and acceptance criteria for checking
  whether Claude correctly follows those workflows.

## What this is NOT

This is **not** model fine-tuning. No weights are modified. No training data
is submitted. No provider-specific training API is called.

The conditioning works through:
1. Structured prompts in skill files that encode repo-specific workflow steps.
2. Canonical artifact schemas embedded directly in the skill prompts.
3. Eval fixtures that specify expected behavior against known-correct reference
   motion packages.

Claude follows these workflows because the prompts are precise and grounded in
this repo's actual artifact structures — not because the model has been retrained.

## Current skills

| Skill | File | Workflow |
|---|---|---|
| `/motion-ratify` | `.claude/commands/motion-ratify.md` | Governed motion ratification sweep — creates vote.json, verify.json, policy.yaml; updates decision.yaml/decision.md to RATIFIED |
| `/motion-status` | `.claude/commands/motion-status.md` | Activation lane status — reports current packet/queue/SoT state and what needs to happen next |

## Eval fixtures

| Fixture | Tests |
|---|---|
| `evals/motion-ratify-eval.yaml` | motion-ratify skill against motion-0093 reference package |

## How to use the skills

In Claude Code CLI:

```
/motion-ratify motion-0099
/motion-status motion-0096
```

Or in Claude Projects:
- Attach `.claude/commands/motion-ratify.md` as a skill prompt
- Invoke with `/motion-ratify motion-XXXX`

## How to evaluate

See `evals/motion-ratify-eval.yaml` for the ratification sweep eval fixture.
The fixture specifies: input state, expected artifacts, acceptance criteria.

Run by invoking the skill against a DRAFT test motion and comparing output
to the expected artifact set described in the fixture.

## Extension points

- Add `evals/motion-status-eval.yaml` when verifier proof is established (packet at route:VERIFIER is the new reference state)
- Add `/motion-passalong` skill when passalong generation patterns are stable
- Add MCP reference if a local tool server is established for DB queries
