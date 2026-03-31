# Execution: Codex Conditioning Expansion — motion-create skill and motion-status eval fixture

**Motion:** motion-0103
**Role:** LIBRARIAN
**Date:** 2026-03-31

## Scope

Governance and conditioning artifacts only. No runtime changes. No portal/ code
changes.

Files intended for this motion:

```
.claude/commands/motion-create.md            (draft skill prompt)
.nexus/codex/evals/motion-status-eval.yaml   (draft eval fixture)
.nexus/motions/motion-0103/                  (6 files — this motion package)
```

## Steps

### Step 1 — Read current conditioning baseline

Read:
- `.nexus/codex/codex-exec-policy.md`
- `.nexus/codex/README.md`
- motion-0099 (conditioning baseline)
- motion-0102 (execution policy)

Confirm:
- existing skills: `/motion-ratify`, `/motion-status`
- existing evals: `motion-ratify-eval.yaml`
- motion-0102 explicitly reserves `/motion-create` and `motion-status-eval.yaml`
  for this next slice

### Step 2 — Draft `/motion-create`

Create `.claude/commands/motion-create.md` with:
- role: LIBRARIAN
- usage: `/motion-create <kind> <title>`
- deterministic scaffolding workflow for the six standard motion files
- hard constraints that prevent ratification, runtime edits, portal edits, or
  speculative scope decisions

### Step 3 — Draft `motion-status-eval.yaml`

Create `.nexus/codex/evals/motion-status-eval.yaml` with:
- input expectations for a target motion id
- expected report fields
- lane-state coverage for all current route outcomes
- negative cases that require stop-and-report behavior

### Step 4 — Leave motion in DRAFT

Do not ratify motion-0103 in this slice.
Do not create `vote.json`, `verify.json`, or `policy.yaml`.
Do not run ratification gates as a substitute for drafting.

## Evidence

- `motion-0103` package drafted with six standard files
- `/motion-create` draft skill added
- `motion-status-eval.yaml` draft fixture added
- No runtime changes, no portal/ changes
