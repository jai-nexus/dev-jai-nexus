# Proposal: Codex Conditioning Expansion — motion-create skill and motion-status eval fixture

**Motion:** motion-0103
**Date:** 2026-03-31
**Kind:** codex-conditioning

## Context

motion-0099 established the first Codex conditioning baseline:
- `/motion-ratify`
- `/motion-status`
- `motion-ratify-eval.yaml`

motion-0102 then ratified the Codex-exec / Claude-drafts operating split and
explicitly listed the next conditioning expansions on this branch:
- `/motion-create` — motion package scaffolding
- `motion-status-eval.yaml` — behavioral specification for the status skill

Those two gaps are now the limiting factor for making the conditioning layer
more complete without expanding into runtime or portal work.

## Problem

Two repeatable workflows remain under-specified:

1. **Motion package scaffolding**
   New governance motions still require re-deriving the draft package structure
   (`motion.yaml`, `proposal.md`, `challenge.md`, `execution.md`, `decision.yaml`,
   `decision.md`) and the repo’s metadata conventions each session.

2. **Status skill evaluation**
   `/motion-status` exists, but there is no repo-local eval fixture describing
   what a correct status report must contain for common lane states and refusal
   cases. The skill is useful, but not yet bounded by a behavioral spec.

## Proposal

### Part 1: Add `/motion-create` skill draft

Create `.claude/commands/motion-create.md` as a draft skill prompt for
template-based motion package scaffolding.

The skill should:
- accept `/motion-create <kind> <title>`
- derive the next motion directory and create the six draft files only
- preserve repo conventions for protocol version, target repo/domain, gate list,
  and DRAFT decision status
- stop if the required scope or metadata is ambiguous

The skill is intentionally limited to deterministic scaffolding. It does not
ratify, does not decide policy, and does not alter runtime or portal surfaces.

### Part 2: Add `motion-status-eval.yaml` draft

Create `.nexus/codex/evals/motion-status-eval.yaml` as the behavioral
specification for `/motion-status`.

The fixture should cover:
- expected report fields for governance status, packet state, route tag, queue
  state, recent SoT events, and next action
- route-based expectations for `ARCHITECT`, `BUILDER`, `VERIFIER`,
  `OPERATOR_REVIEW`, and “no live inbox item”
- refusal cases where the skill must not enqueue, mutate, or run agents

## Non-goals

- No runtime behavior changes
- No code changes in `portal/`
- No gate script changes
- No proof execution skill (`/run-proof-lane`) yet
- No ratification of motion-0103 in this slice

## Success criteria

- `.claude/commands/motion-create.md` exists as a draft skill prompt
- `.nexus/codex/evals/motion-status-eval.yaml` exists as a draft eval fixture
- motion-0103 draft package exists with the six standard motion files
- No runtime changes, no portal/ changes

