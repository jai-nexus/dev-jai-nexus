# Customer-Safe JAI Boundary Intake v0

## Purpose

Record the settled `jai` customer-safe substrate boundary in
`dev-jai-nexus` routing canon so the paid-beta matrix reflects the current
cross-repo baseline.

## Source Baseline

- `dev-jai-nexus` is settled through `motion-0236`
- `jai` is settled through PR `#15`: Customer-Safe JAI Substrate Boundary v0
- `jai-nexus` is settled through PR `#25`
- `api-nexus` is settled through PR `#6`
- `audit-nexus` is settled through `AUD-2026Q2-001`

## Settled By JAI PR #15

The following are now documented as settled substrate-boundary posture:

- customer-safe substrate semantics
- portable substrate ownership for customer-safe JAI boundaries
- later ownership of customer-safe read model contracts
- later ownership of transcript projection contracts
- later ownership of validation helpers
- later ownership of compatibility helpers

## What JAI Owns

- portable substrate semantics for customer-safe JAI boundaries
- substrate-facing boundary contracts below product/customer UX
- future thin compatibility and validation helpers where later routed

## What JAI Does Not Own

- product/customer UX
- provider/model calls
- customer memory
- account/workspace/project models
- billing or usage ledger semantics
- API gateway interfaces
- auth/session semantics
- DB/persistence authority beyond thin substrate utilities
- execution authority
- autonomous agent behavior

## Paid-Beta Readiness Impact

Impact on paid-beta readiness is narrow:

- substrate-boundary evidence is now stronger
- customer-safe JAI is no longer completely unstarted at the substrate layer
- implementation remains unauthorized
- customer-facing provider/model behavior remains unauthorized

## Routing Posture

This intake does not change repo ownership:

- `dev-jai-nexus` records and routes
- `jai` owns substrate semantics
- `jai-nexus` still owns product/customer behavior and UX framing
- `api-nexus` still owns interface/gateway boundary work

## Non-Goals

- mutating `jai`
- mutating `jai-nexus`
- mutating `api-nexus`
- mutating `audit-nexus`
- mutating `docs-nexus`
- authorizing implementation
- opening paid beta
- authorizing provider/model behavior

## Authority Boundary

- No provider/model calls
- No runtime execution
- No branch-write authority
- No PR-creation authority
- No merge authority
- No scheduler/automation
- No API/DB mutation
- No backend persistence
- No customer data collection

This artifact is docs/canon/routing only.
