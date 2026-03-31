# Proposal: Codex Execution Policy — Codex-exec / Claude-drafts operating split

**Motion:** motion-0102
**Date:** 2026-03-31
**Kind:** codex-exec-policy

## Context

motions 0095–0101 close the Track A proof chain for WorkPacket 882:
- Full ARCHITECT → BUILDER → VERIFIER → OPERATOR_REVIEW lane proven and ratified.
- Codex conditioning baseline established in motion-0099: `/motion-ratify`, `/motion-status`, `motion-ratify-eval.yaml`.

The next arc begins here. The program has accumulated enough repeatable workflow
patterns to warrant a formal operating split between:

- **Codex** — the executor: runs scripted, structured workflows against the repo
  using repo-native skill prompts (`.claude/commands/`)
- **Claude** — the capability drafter: designs skills, eval fixtures, policy
  documents, and new motion proposals that require judgment

This motion establishes that split as a governance-backed policy artifact
and makes it the operating baseline for subsequent motions on this branch.

## Problem

Without a codified operating split:
- Each session rediscovers which tasks Codex can do autonomously vs. which
  require Claude's judgment.
- The conditioning layer has no stated scope — skills and evals accumulate
  without a clear boundary for what Codex is trusted to execute.
- Future motions that should be "Codex-first" have no governance basis
  for that designation.

## Approach

**Primary artifact:** `.nexus/codex/codex-exec-policy.md`

The policy defines:
1. The Codex-exec / Claude-drafts split (which motion classes belong where)
2. The handoff protocol (Claude drafts → Codex executes → ratification closes loop)
3. dev-jai-nexus boundary commitments (governance surfaces that stay in this repo)
4. The conditioning interface (`.claude/commands/` skill prompts as the execution boundary)
5. Non-delegation rules (what Codex must not attempt without Claude review)

**Secondary artifact:** `.nexus/codex/README.md` updated to reference the policy.

This motion is itself Claude-drafted and Codex-ratified — making it the
first concrete instance of the split it defines.

## Non-goals

- No new runtime behavior
- No code changes in `portal/`
- No Wave 1+ or live repo promotion
- No Codex API binding or provider-specific configuration
- No delegation of judgment-requiring tasks (new proposals, architecture, scope)

## Success criteria

- `codex-exec-policy.md` written to `.nexus/codex/`
- Policy clearly classifies all current and near-term motion classes
- Policy states the handoff protocol in executable terms
- validate_motion, validate_agency both EXIT 0
- decision.yaml and decision.md advance to RATIFIED
