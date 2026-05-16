# Proposal: Production Infrastructure Boundary v0

## Purpose

Define the boundary between local/dev infrastructure and future customer-facing
production infrastructure for JAI NEXUS.

## Scope

- add a production-infrastructure boundary artifact under `.nexus/canon/`
- define Work Desktop, MacBook, and Raspberry Pi as non-production customer infrastructure
- define allowed local/dev roles and explicit no-customer-workload posture
- record future production requirements without selecting a stack
- preserve no-deploy and no-customer-data boundaries explicitly
- refresh the bundled motion snapshot through `motion-0231`

## Non-Goals

- no final production stack selection
- no deployment authorization
- no customer workload deployment
- no customer data collection
- no Stripe/auth/backend implementation
- no mutation of `jai-nexus`, `api-nexus`, or any other repo
- no runtime behavior or authority expansion
