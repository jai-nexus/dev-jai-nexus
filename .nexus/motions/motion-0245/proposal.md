# Proposal: Device-to-Server Infrastructure Split v0

## Purpose

Define the device-to-server split for JAI NEXUS, clarifying what Desktop,
MacBook, Raspberry Pi, and future cloud/server infrastructure each own so JAI
NEXUS can maximize local workflow efficiency while preparing for real customer
scale.

## Scope

- add `.nexus/canon/device-to-server-infrastructure-split-v0.md`
- define the local private device fleet and per-device roles
- define allowed and denied local-device posture
- define future production infrastructure classes and required gates
- define repo routing across local fleet, product, API, docs, audit, and
  Toolchain lanes
- add one compact static root overview note
- refresh the bundled motion snapshot through `motion-0245`

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
- adding API routes
- adding DB behavior
- adding auth/session behavior
- adding billing/payment behavior
- adding provider/model calls
- collecting customer data
- adding production workload handling
- adding scheduler authority
- adding branch-write authority
- adding PR creation/merge authority
- opening Corpus V2
- resetting motion numbering
