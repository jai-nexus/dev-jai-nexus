# Proposal: Billing Model Routing Update v0

## Purpose

Record `jai-nexus` PR `#24` billing model and usage-ledger posture in
`dev-jai-nexus` routing canon without introducing implementation authority.

## Scope

- add a billing-model routing artifact under the established `.nexus/canon/` pattern
- summarize bounded plan framing from `jai-nexus` PR `#24`
- record primary usage meters and secondary workspace/account envelope categories
- preserve placeholder/non-live billing posture explicitly
- preserve cross-repo routing between `jai-nexus`, `api-nexus`, and `dev-jai-nexus`
- refresh the bundled motion snapshot through `motion-0229`

## Non-Goals

- no mutation of `jai-nexus`
- no mutation of `api-nexus`
- no mutation of any other repo
- no payment collection
- no live Stripe
- no auth implementation
- no backend/API implementation
- no customer data collection
- no runtime or authority expansion
