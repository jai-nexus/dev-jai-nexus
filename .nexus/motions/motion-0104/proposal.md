# Proposal: Codex Conditioning Expansion — run-proof-lane skill

**Motion:** motion-0104
**Date:** 2026-03-31
**Kind:** codex-conditioning

## Context

motion-0099 established the conditioning baseline (`/motion-ratify`, `/motion-status`).
motion-0103 added `/motion-create` and `motion-status-eval.yaml`.
motion-0102 listed `/run-proof-lane` as a Codex-eligible task class in the
execution policy (section 2).

The Track A proof execution pattern — enqueue + run-once + verify — was run
manually three times across motions 0098, 0100, and 0101. The pattern is now
stable and fully covered by existing scripts:

| Stage | Enqueue script | Run script |
|---|---|---|
| ARCHITECT | `enqueue-motion-packet.mjs` | `run-architect-once.ts 6.0.10` |
| BUILDER | `enqueue-builder-packet.mjs` | `run-builder-once.ts 6.0.11` |
| VERIFIER | `enqueue-verifier-packet.mjs` | `run-verifier-once.ts 6.0.12` |

All three enqueue scripts have proven route guards and require a RATIFIED motion.
No new runtime scripts are needed.

## Problem

Each proof execution still requires manually looking up:
- which enqueue script maps to the current stage
- which agent NhId maps to that stage
- which run-once script to call
- what evidence to capture

Without a skill, each invocation rediscovers this table. The `/run-proof-lane`
skill encodes the full sequence as a single governed prompt.

## Approach

**Primary artifact:** `.claude/commands/run-proof-lane.md`

The skill:
- Takes `<stage> <motionId>` as arguments
- Pre-flight: verifies motion is RATIFIED and packet is at the expected stage
- Runs the correct enqueue script
- Runs the correct run-once script
- Captures and reports SoT evidence
- Verifies the packet advanced to the next expected stage
- OPERATOR_REVIEW is explicitly excluded (human gate — no skill can close it)

**Secondary artifact:** `.nexus/codex/evals/run-proof-lane-eval.yaml`

Eval fixture covering all three valid stages, the OPERATOR_REVIEW refusal,
the DRAFT-motion refusal, and the wrong-stage refusal.

## Non-goals

- No new runtime scripts or portal code
- No OPERATOR_REVIEW automation (human gate, enforced by design)
- No multi-stage orchestration in a single invocation
- No ratification of motion-0104 in this slice

## Success criteria

- `.claude/commands/run-proof-lane.md` exists as a complete skill prompt
- `.nexus/codex/evals/run-proof-lane-eval.yaml` exists as a behavioral spec
- validate_motion, validate_agency both EXIT 0
- No portal/ changes
