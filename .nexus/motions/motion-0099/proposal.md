# Proposal: Codex Repo Conditioning — motion-ratify and motion-status skills

**Motion:** motion-0099
**Date:** 2026-03-31

## Context

dev-jai-nexus has established a stable governed execution foundation through
motion-0093 through motion-0098:

- The ratification sweep pattern is repeated for every motion (vote.json,
  verify.json, policy.yaml, decision.yaml update, decision.md update).
- The activation lane analysis pattern (packet/queue/SoT state, what's next)
  is repeated at every builder/verifier handoff.

Neither workflow has a skill prompt that encodes the exact artifact schemas,
gate commands, and hard constraints this repo requires. Claude must re-derive
the patterns from scratch in each new chat session.

## Important distinction

This is **not** model fine-tuning. No weights are modified. The "conditioning"
is a set of precise, repo-scoped skill prompts that guide Claude through the
correct workflow steps using this repo's actual artifact structures and gate
commands.

## Problem

1. Each new Claude session re-derives the ratification artifact set from
   context clues, leading to occasional schema drift (wrong schema_version,
   missing fields, wrong motion.yaml status).

2. Activation lane analysis requires reading multiple DB tables and knowing
   which enqueue script to use per lane stage — easy to get wrong without
   the exact reference table.

3. No eval fixtures exist for verifying whether Claude followed the correct
   workflow. Correctness is currently verified only by the human operator.

## Proposal

### Part 1: Claude Code skills (`.claude/commands/`)

Create two project-level Claude Code slash commands:

**`.claude/commands/motion-ratify.md`**
- Role: LIBRARIAN
- Workflow: complete ratification sweep for a DRAFT motion
- Encodes: gate commands, all three artifact schemas (vote-0.2, verify-0.2,
  policy.yaml), decision.yaml/md update steps, hard constraints
- Usage: `/motion-ratify motion-XXXX`

**`.claude/commands/motion-status.md`**
- Role: OPERATOR / LIBRARIAN
- Workflow: read-only activation lane status check
- Encodes: bounded DB check script pattern, lane-state → next-action table
  for all five stages (ARCHITECT / BUILDER / VERIFIER / OPERATOR_REVIEW / none)
- Usage: `/motion-status motion-XXXX`

### Part 2: Codex conditioning artifacts (`.nexus/codex/`)

**`.nexus/codex/README.md`**
- Explains what "Codex conditioning" means (vs fine-tuning)
- Documents current skills and eval fixtures
- Notes extension points

**`.nexus/codex/evals/motion-ratify-eval.yaml`**
- Eval fixture for the `/motion-ratify` skill
- Reference: motion-0093 (canonical first real rollout, known-correct artifacts)
- Specifies: input state, expected artifact set, 8 acceptance criteria,
  3 negative test cases (already ratified, gate failure, blocking objection)

## Non-goals

- No model fine-tuning or training data submission
- No MCP server (no existing tool server to reference)
- No plugin ecosystem
- No passalong skill yet (patterns not stable enough for a single canonical form)
- No runtime changes
- No changes to portal/

## Success criteria

- `.claude/commands/motion-ratify.md` exists with correct schema references
- `.claude/commands/motion-status.md` exists with correct lane-state table
- `.nexus/codex/evals/motion-ratify-eval.yaml` covers 8 acceptance criteria
- `/motion-ratify motion-0099` produces valid ratification artifacts
- `/motion-status motion-0096` reports correct lane state (route:VERIFIER)
- No runtime mutations, no code changes
