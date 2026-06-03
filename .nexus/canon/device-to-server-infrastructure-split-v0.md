# Device-to-Server Infrastructure Split v0

## Purpose

Define the device-to-server split for JAI NEXUS so local private devices can
maximize operator workflow efficiency while future customer-serving production
infrastructure remains a separate, later-routed server boundary.

This artifact is docs/canon/static UI only. It does not create infrastructure,
does not select a final cloud vendor, and does not authorize deployment,
customer workloads, or customer data handling.

## Source baseline

- `dev-jai-nexus` is settled through `motion-0244`
- `orchestrator-nexus` has documented the local Edge Runner fleet and Pi lane
- `jai-edge` is paused as source-recovery/documentation/contract-placeholder
  only
- `syncd` remains separate and settled
- `/home/jerryingram/edge` remains live runtime state, not a governed
  deployment target
- customer/project corpus canon remains future conceptual only
- existing Edge Runner, dry-run visibility, paid-beta, and production-boundary
  canon remains in force

## Local private device fleet

- Work Desktop
- Work MacBook
- Raspberry Pi

These devices are private operator/dev/runtime-lab infrastructure. They are not
customer-serving production infrastructure.

## Local device roles

### Work Desktop

- primary development workstation
- heavy validation
- UI/product work
- branch/PR preparation remains human-driven

### Work MacBook

- portable operator workstation
- secondary validation
- continuity and review

### Raspberry Pi

- private always-on edge node
- syncd/state mirror
- lightweight runtime lab
- dry-run/evidence support
- JAI Edge live-runtime observation only unless separately governed

## Local-device allowed posture

Local devices may support:

- repo sync checks
- validation bundles
- dry-run plan generation
- dry-run plan validation
- evidence metadata validation
- local health snapshots
- syncd checks
- JAI Edge runtime observation
- human-reviewed workflow acceleration

Allowed posture remains private, review-oriented, and non-customer-serving.

## Local-device denied posture

Local devices must not support:

- customer-serving production workloads
- customer data handling
- payment/billing handling
- production auth/session handling
- production database authority
- provider/model dispatch for customers
- autonomous branch writes
- autonomous PR creation/merge
- production deployment
- scheduler authority
- hidden persistence

## Future production infrastructure classes

Future customer-serving infrastructure is a separate class that must later own:

- hosted web app
- API service
- database
- object/file storage
- queue/background jobs
- cache
- auth/session provider
- billing/Stripe integration
- logging/observability
- secrets management
- backup/restore
- deployment pipeline
- incident/rollback path

## Future server gates

Future customer-serving server work requires later approval of all of the
following gates:

- production host selected
- auth owner routed
- database owner routed
- API owner routed
- billing owner routed
- secrets policy drafted
- customer data boundary approved
- privacy/security preflight satisfied
- logging/retention posture approved
- deployment/rollback path approved
- no local personal machine customer-serving role

## Repo routing map

- `dev-jai-nexus` = Operator Control Plane / routing
- `orchestrator-nexus` = local fleet orchestration / dry-run substrate
- `jai-edge` = source-recovery/runtime-contract placeholder, not deployment
  authority
- `api-nexus` = future API/interface/integration boundary
- `jai-nexus` = product/customer surface
- `audit-nexus` = audit/privacy/security evidence
- `docs-nexus` = documentation/source intelligence
- `jai` = portable substrate
- `jai-pilot` = future browser/extension Toolchain product lane
- `jai-vscode` / JAI for VS Code = future IDE Toolchain product lane

## Toolchain next-target note

After this split, `jai-pilot` should be the next product-lane ownership
boundary unless `CONTROL_THREAD` chooses production infrastructure planning
first.

## Non-goals

- mutating `orchestrator-nexus`
- mutating `jai-edge`
- mutating `jai-nexus`
- mutating `api-nexus`
- mutating `jai`
- mutating `audit-nexus`
- mutating `docs-nexus`
- creating server infrastructure
- selecting a final cloud vendor
- deploying anything
- opening Corpus V2
- resetting motion numbering

## Explicitly not-authorized items

This artifact does not authorize:

- API routes
- DB behavior
- auth/session behavior
- billing/payment behavior
- provider/model calls
- customer data collection
- production workload handling
- scheduler authority
- branch-write authority
- PR creation/merge authority
- live dry-run/evidence ingestion
- file watchers
- JAI Edge deployment authority
- `/home/jerryingram/edge` as a governed deployment target

## Authority boundary

- local private devices = workflow acceleration and private runtime-lab support
- future servers = customer-serving production boundary
- no local personal machine may serve customers
- no repo outside `dev-jai-nexus` is mutated by this artifact
- no production authority, deployment authority, scheduler authority, branch
  authority, or PR authority is created here

This artifact defines ownership boundaries only. It does not implement server
infrastructure or change the current read-only/manual governance posture.
