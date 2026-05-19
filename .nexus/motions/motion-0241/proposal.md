# Proposal: Edge Runner Evidence Validation Intake v0

## Purpose

Update `dev-jai-nexus` control-plane canon to include the settled
`orchestrator-nexus` dry-run evidence validation layer from PR `#14` while
preserving static/read-only visibility only.

## Scope

- add an Edge Runner evidence-validation intake artifact under `.nexus/canon/`
- record source-side evidence validator posture, fixture coverage, and PASS
  harness result
- add one small cross-reference to the dry-run visibility boundary artifact
- extend the existing Edge Runner root card with one compact static evidence
  validation note
- preserve static/read-only/no-execution posture
- refresh the bundled motion snapshot through `motion-0241`

## Non-goals

- mutating `orchestrator-nexus`
- ingesting live dry-run or evidence artifacts
- enabling command or runner execution
- enabling scheduler or automation authority
- enabling provider/model calls
- enabling API routes, DB behavior, or file watchers
