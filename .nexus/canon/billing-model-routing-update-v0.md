# Billing Model Routing Update v0

## Purpose

This artifact records the settled `jai-nexus` PR `#24` customer billing model
and usage-ledger posture in `dev-jai-nexus` routing canon.

It is routing/reference only. It does not mutate `jai-nexus`, does not mutate
`api-nexus`, does not authorize live billing, and does not claim that billing
implementation gates are satisfied.

## Source Baseline

- `dev-jai-nexus` is settled through `motion-0228`
- `jai-nexus` is settled through PR `#24`: Customer Billing Model & Usage Ledger v0
- `api-nexus` is settled through PR `#5`: Customer Console API Interface Contract Plan v0
- `jai-nexus` owns the product/customer billing surface posture
- `api-nexus` documents future billing/customer/subscription interface seams only

## Plan Framing

Settled `jai-nexus` product-model framing:

- `Sandbox` - `$0`
- `Operator` - `$99`
- `Operator Plus` - `$249`
- `Command / Enterprise` - `Custom`

Routing posture:

- this is product-surface framing only
- the plan model remains bounded and review-oriented
- no external commercial offer is authorized by this routing update

## Usage Meter Routing

Primary bounded usage meters recorded from `jai-nexus` PR `#24`:

- motion runs
- deliberation transcripts
- AI credits
- source/repo analysis jobs
- agent runs
- events
- storage
- retention

Routing implication:

- metered product posture is the intended planning direction
- unlimited AI or source-analysis exposure should not be inferred
- any future live usage ledger requires later routed API/backend ownership

## Workspace / Account Envelope Routing

Secondary account/workspace envelope categories recorded from `jai-nexus` PR `#24`:

- workspaces
- projects
- seats
- domains
- integrations

Routing implication:

- envelope concepts remain secondary to the primary AI/motion usage ledger
- domain limits belong in the account/workspace envelope, not the core reasoning meter
- customer-visible envelope semantics may evolve later, but remain non-live today

## Current Placeholder / Non-Live Posture

Current non-live billing posture remains explicit:

- billing remains prototype/placeholder only
- no live Stripe exists
- no auth implementation exists
- no backend/API customer billing implementation exists
- no customer billing data collection exists
- no payment collection is authorized
- no webhook handling exists

## Future Implementation Dependencies

Later implementation would require at minimum:

- customer-commercial offer routing
- plan-envelope finalization
- Stripe/billing owner routing
- auth/account owner routing
- backend/API ownership routing
- usage-ledger semantics definition
- privacy/security review
- production infrastructure routing

## Non-Goals

- mutating `jai-nexus`
- mutating `api-nexus`
- mutating any other repo
- opening paid beta
- collecting payment
- adding live Stripe
- adding auth implementation
- adding backend persistence or API implementation
- adding customer data collection
- adding provider/model calls
- adding runtime execution

## Authority Boundary

- `jai-nexus` owns product/customer billing surface posture
- `api-nexus` likely participates in future billing/customer/subscription interface seams
- `dev-jai-nexus` records and routes only
- this artifact creates no billing authority, payment authority, API authority, or customer-data authority

This artifact is docs/canon/routing/planning only.
