# Proposal: Edge Runner Automation Substrate Intake v0

## Purpose

Update `dev-jai-nexus` control-plane canon to intake the tested
`orchestrator-nexus` Edge Runner dry-run substrate while preserving that no
execution authority has been granted.

## Scope

- add a canon/routing artifact summarizing `orchestrator-nexus` PR `#2`-`#11`
- record tested dry-run generation and validation substrate posture
- record Edge Runner fleet summary
- preserve explicit denied authority posture
- add a compact read-only root overview note
- refresh the bundled motion snapshot through `motion-0238`

## Non-goals

- mutating `orchestrator-nexus`
- mutating any repo outside `dev-jai-nexus`
- enabling execution or scheduler authority
- enabling provider/model calls
- enabling branch/PR/merge authority
