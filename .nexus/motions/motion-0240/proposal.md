# Proposal: Dry-Run Plan Visibility Boundary v0

## Purpose

Define how dry-run plans and dry-run evidence records may be surfaced read-only
in `dev-jai-nexus` without ingesting live orchestrator state, executing
commands, or implying scheduler or runner authority.

## Scope

- add a dry-run visibility boundary artifact under `.nexus/canon/`
- document which dry-run and evidence fields may be shown as static/example
  metadata only
- document which live/runtime behaviors must not be surfaced yet
- extend the existing Edge Runner root card with static visibility-boundary
  notes
- preserve static/read-only/no-execution posture
- refresh the bundled motion snapshot through `motion-0240`

## Non-goals

- mutating `orchestrator-nexus`
- ingesting live dry-run artifacts
- enabling command or runner execution
- enabling scheduler or automation authority
- enabling provider/model calls
- enabling API routes, DB behavior, or file watchers
