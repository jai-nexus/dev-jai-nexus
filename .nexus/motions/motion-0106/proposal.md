# Proposal: Codex Conditioning Expansion — passalong canonicalization and /motion-passalong skill

**Motion:** motion-0106
**Date:** 2026-03-31
**Kind:** codex-conditioning

## Context

motions 0102–0105 established the core Codex conditioning layer:
- `/motion-ratify`, `/motion-status`, `/motion-create`, `/run-proof-lane`
- Eval fixtures for all four skills

The README extension points list `/motion-passalong` as the one remaining
deferred workflow. Passalongs — interpretive handoff documents for session
continuity — are one of the highest-leverage workflows in this repo: every
cross-session handoff either rediscovers context or relies on a passalong.

The project constitution identifies "reduce repeated recontextualization through
governed context artifacts" as a core purpose. Passalongs serve this purpose
directly.

The pattern was deferred in motion-0099 because "passalong patterns are not
yet stable." After the Track A proof series and five capability motions, the
pattern is now stable enough to canonicalize.

## Problem

Without a governed passalong schema and skill:
- Each cross-session handoff is ad-hoc, variable in depth, and inconsistent
  in what it covers
- There is no repo-local spec distinguishing orchestrator context needs from
  dev implementation context needs
- The repo has context bundle generators (machine-generated) but no
  interpretive handoff format (human/AI-authored)
- `/motion-passalong` is the only listed skill in the README without an
  implementation

## Approach

**Primary artifacts:**

1. `.nexus/codex/passalong-schema.md` — canonical schema document
   - Defines two target types: `orchestrator` and `dev`
   - Required sections per type with constraints
   - Document templates for both types
   - Output convention (stdout + save recommendation)
   - Hard constraints (no status fabrication, no file embedding)

2. `.claude/commands/motion-passalong.md` — the skill prompt
   - Takes `<target> <motionId>` as arguments
   - Reads governance state (motion.yaml, decision.yaml)
   - Reads git state (branch, log, working tree)
   - Composes passalong using the schema templates
   - Prints to stdout with save path recommendation
   - Does NOT write the file automatically

3. `.nexus/codex/evals/motion-passalong-eval.yaml` — eval fixture
   - Orchestrator happy path (RATIFIED motion, completed wave)
   - Dev happy path (DRAFT motion with uncommitted changes)
   - Dev clean/RATIFIED case
   - Refusal: unknown target, missing motionId, nonexistent motion
   - Refusal: DRAFT claimed as RATIFIED
   - Schema compliance assertions
   - 9 acceptance criteria

## Non-goals

- No auto-saving of passalongs (user/Codex saves them)
- No changes to `generate-context-bundle.mjs` or existing generators
- No new runtime behavior
- No portal/ code changes
- No ratification of motion-0106 in this slice

## Success criteria

- `passalong-schema.md` defines both target types with required sections and templates
- `/motion-passalong` skill reads real governance state, never fabricates
- Eval fixture covers happy paths, refusal cases, schema compliance
- validate_motion, validate_agency both EXIT 0
- README updated with new skill and eval
