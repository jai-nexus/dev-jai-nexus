# Edge Runner Readiness Matrix v0

## Purpose

Add a `dev-jai-nexus` Edge Runner readiness matrix summarizing
`orchestrator-nexus` source-side readiness, device coverage, fixture coverage,
allowed dry-run posture, denied authority, and next gates.

This artifact is docs/canon/static-visibility only. It does not grant
execution authority.

## Source Baseline

- `dev-jai-nexus` is settled through `motion-0238`
- `orchestrator-nexus` is settled through PR `#12`

## Orchestrator-Nexus PR #2-#12 Sequence

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
- PR `#12`: Dry-Run Fixture Expansion v0

## Edge Runner Fleet Summary

- Work Desktop = primary operator workstation
- Work MacBook = portable operator / secondary validation workstation
- Raspberry Pi = always-on edge node / syncd / lightweight runtime lab

## Source-Side Readiness Matrix

| Capability area | Current state | Evidence posture | Execution authorized |
| --- | --- | --- | --- |
| device roles | defined | fleet readiness posture and capability records exist | no |
| capability records | defined | per-device capability records exist | no |
| dry-run generator | available | generator exists and is fixture-covered | no |
| structured schema | available | structured plan schema exists and validates | no |
| validator | available | validator exists and passes known-good fixtures | no |
| fixture harness | available | repeatable fixture harness passes | no |
| expanded fixture coverage | available | PR `#12` expands device/class/metadata/failure coverage | no |
| human review posture | available | dry-run plans may be presented for review | no |
| execution substrate | denied | no runner or execution framework is authorized | no |
| scheduler substrate | denied | no scheduler authority is authorized | no |

## Valid Fixture Coverage Summary

- Work Desktop / validation-bundle
- Work Desktop / repo-sync-check
- Work MacBook / validation-bundle
- Work MacBook / lane-targeted repo-sync-check
- Raspberry Pi / syncd-state-mirror-check
- Raspberry Pi / docker-context-check
- lane-targeted validation-bundle requiring confirmation

## Invalid Fixture Coverage Summary

- missing target device
- unknown target device
- missing target repo and target lane
- missing command class
- missing capability record
- capability record mismatch
- lane target with confirmation_required false
- confirmation required but missing evidence output path
- missing proposed commands
- proposed command text that implies execution
- missing no_execution_guarantee
- no_execution_guarantee false
- denied command class
- confirmation required with empty confirmation reasons
- missing human_approval_required
- unsupported status
- unsupported schema_version

## Allowed Dry-Run Posture

- generate dry-run plans
- validate dry-run plans
- present dry-run plans for human review
- represent dry-run readiness in control-plane canon
- cite fixture harness evidence

## Denied Authority Posture

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

## Next Possible Gates

Future/not-authorized options:

- additional `orchestrator-nexus` fixture expansion
- `dev-jai-nexus` read-only dry-run plan visibility
- human review workflow shape
- dry-run evidence record model
- execution authority review, explicitly deferred and not authorized

## Non-Goals

- mutating `orchestrator-nexus`
- mutating any repo outside `dev-jai-nexus`
- enabling execution
- enabling scheduler or automation authority
- enabling provider/model calls
- adding product or customer workload behavior

## Authority Boundary

- No provider/model calls
- No runtime execution
- No branch-write authority
- No PR-creation authority
- No merge authority
- No scheduler authority
- No automation execution
- No API/DB behavior
- No production deployment
- No customer workloads
- No customer data collection
- No hidden persistence
- No cross-repo mutation

This artifact is docs/canon/static-visibility only.
