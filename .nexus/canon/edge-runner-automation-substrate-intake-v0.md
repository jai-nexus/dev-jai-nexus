# Edge Runner Automation Substrate Intake v0

## Purpose

Update `dev-jai-nexus` control-plane canon to intake the tested
`orchestrator-nexus` Edge Runner dry-run substrate while preserving that no
execution authority has been granted.

This artifact is docs/canon/routing only.

## Source Baseline

- `dev-jai-nexus` is settled through `motion-0237`
- `orchestrator-nexus` is settled through PR `#11`

## Orchestrator-Nexus PR #2-#11 Sequence

- PR `#2`: Orchestrator Ownership Boundary
- PR `#3`: Orchestrator Command Hygiene
- PR `#4`: Orchestration Authority Clarification + Edge Runner Fleet Readiness
- PR `#5`: Edge Runner Capability Records v0
- PR `#6`: Dry-Run Runner Protocol v0
- PR `#7`: Dry-Run Plan Generator v0
- PR `#8`: Dry-Run Approval / Confirmation Gates v0
- PR `#9`: Dry-Run Plan Validator v0
- PR `#10`: Structured Dry-Run Plan Schema v0
- PR `#11`: Dry-Run Plan Fixture Harness v0

## Tested Automation Substrate Summary

`orchestrator-nexus` now has a tested, structured, non-executing dry-run
automation substrate:

- dry-run plan generator
- structured dry-run plan schema
- dry-run plan validator
- valid/invalid dry-run validator fixtures
- repeatable fixture harness

Current readiness meaning:

- dry-run plans can be generated
- dry-run plans can be validated
- structured metadata exists
- validator fixtures exist
- fixture harness passes

## Edge Runner Fleet Summary

- Work Desktop = primary operator workstation
- Work MacBook = portable operator / secondary validation workstation
- Raspberry Pi = always-on edge node / syncd / lightweight runtime lab

## Allowed Non-Executing Automation Posture

- generate dry-run plans
- validate dry-run plans
- present dry-run plans for human review
- use fixture harness as evidence of validator behavior
- record substrate readiness in control-plane canon

## Explicitly Denied Authority Posture

- command execution
- runner execution
- scheduler authority
- automation execution
- provider/model calls
- branch-write authority
- PR creation/merge authority
- production deployment
- customer workloads
- customer data collection
- payment/billing handling
- hidden persistence
- cross-repo mutation

## Future Visibility / Routing Implications

This substrate is now suitable for future control-plane visibility and routing
references as a non-executing dry-run capability.

It is not yet a basis for:

- command execution
- orchestration authority
- live fleet polling
- scheduler enablement
- automation rollout

## Non-Goals

- mutating `orchestrator-nexus`
- mutating any repo outside `dev-jai-nexus`
- enabling execution
- enabling scheduler/runner authority
- enabling automation execution
- enabling provider/model calls
- adding customer workload handling

## Authority Boundary

- No provider/model calls
- No runtime execution
- No branch-write authority
- No PR-creation authority
- No merge authority
- No scheduler/automation execution
- No API/DB behavior
- No production deployment
- No customer workloads
- No customer data collection
- No hidden persistence
- No cross-repo mutation

This artifact records dry-run substrate readiness only.
