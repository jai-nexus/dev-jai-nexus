# Proposal: Codex Conditioning Expansion — motion-create eval coverage

**Motion:** motion-0105
**Date:** 2026-03-31
**Kind:** codex-conditioning

## Context

motion-0103 added `/motion-create` as a skill and listed `motion-create-eval.yaml`
in the README extension points as deferred. motion-0104 added `/run-proof-lane`
and its eval fixture. The eval fixtures table now has coverage for ratify, status,
and run-proof-lane — but `/motion-create` still has no behavioral spec.

`/motion-create` is a Codex-eligible task with load-bearing correctness requirements:
wrong motion numbering, malformed motion.yaml, or a wrong kind creates governance
artifacts that require cleanup. An eval fixture makes the correctness contract explicit.

## Problem

Without an eval fixture for `/motion-create`:
- The skill's kind-validation and number-selection behavior is only implied by the
  skill prompt itself
- There is no repo-local spec for what a correctly-scaffolded motion package must look like
- Refusal cases (unknown kind, missing arguments) have no canonical expected behavior
- Codex cannot self-check a motion-create output against a known-correct reference

## Approach

**Primary artifact:** `.nexus/codex/evals/motion-create-eval.yaml`

The fixture tests:
1. Known kind validation — 10 allowed kinds, unknown kinds refused
2. Next motion number selection — glob, find max, +1, correct zero-padding
3. Six-file scaffold correctness — schema assertions per file
4. Forbidden artifacts — no vote.json, verify.json, policy.yaml, no ratification
5. parent_motion guard — must remain commented out, not set
6. validate-motion gate — runs immediately after scaffold, must exit 0
7. Refusal on unknown kind — no files created
8. Refusal on missing/ambiguous arguments — stop and ask

**Secondary:** `.nexus/codex/README.md` updated to move eval from deferred
extension point into the fixtures inventory table.

## Non-goals

- No changes to the `/motion-create` skill prompt itself
- No new skills
- No portal/ or runtime changes
- No ratification of motion-0105 in this slice

## Success criteria

- `motion-create-eval.yaml` exists with kind-validation, scaffold, forbidden-artifact,
  and refusal test cases; at least 9 acceptance criteria
- validate_motion, validate_agency both EXIT 0 for motion-0105
- README eval table updated
