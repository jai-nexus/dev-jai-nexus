# Paid Beta Cross-Repo Readiness Matrix v0

## Purpose

This is a `dev-jai-nexus` routing/canon consolidation artifact.

It consolidates paid-beta readiness gates across `dev-jai-nexus`,
`jai-nexus`, `api-nexus`, and `audit-nexus` before any auth, billing,
backend persistence, customer-data handling, or customer-safe JAI
implementation begins.

This matrix is routing/canon only. Paid beta remains closed, no customer data
collection is authorized, no production deployment is authorized, and no
implementation gate is authorized by this artifact.

## Current Cross-Repo Baseline

- `dev-jai-nexus` is settled through `motion-0232`
- `jai-nexus` is settled through PR `#24`
- `api-nexus` is settled through PR `#5`
- `audit-nexus` is settled through PR `#9` / `AUD-2026Q2-001`
- `jai` is settled through PR `#15`

## Readiness Input Sources

- `dev-jai-nexus` motions `0229`-`0232`
- `jai-nexus` PR `#24`: Customer Billing Model & Usage Ledger v0
- `api-nexus` PR `#5`: Customer Console API Interface Contract Plan v0
- `audit-nexus` PR `#9` / `AUD-2026Q2-001`: Paid Beta Privacy/Security Preflight
- `jai` PR `#15`: Customer-Safe JAI Substrate Boundary v0

## Readiness Matrix

| Row | Owner repo | Supporting repo(s) | Current status | Existing evidence artifact | Missing next artifact | Implementation allowed |
| --- | --- | --- | --- | --- | --- | --- |
| commercial offer | `jai-nexus` | `dev-jai-nexus` routing only | planned | `motion-0229`, PR `#24` | `jai-nexus` Commercial Offer v0 / Customer-Facing Value Copy | no |
| plan envelope | `jai-nexus` | `dev-jai-nexus` routing only | boundary_defined | PR `#24`, `motion-0229` | product offer/package finalization plan | no |
| unit economics | `dev-jai-nexus` routing canon | `jai-nexus` | boundary_defined | `motion-0230`, `paid-beta-unit-economics-boundary-v0.md` | customer-facing commercialization route | no |
| billing/Stripe boundary | `jai-nexus` for product UX; `api-nexus` for interface | `dev-jai-nexus` routing only | blocked_by_auth_billing | PR `#24`, PR `#5`, `motion-0229` | usage/billing interface boundary follow-up | no |
| auth/account identity | `jai-nexus` for product UX; `api-nexus` for interface | `jai` if substrate semantics are needed later | blocked_by_auth_billing | PR `#5`, `customer-console-implementation-gates-v0.md` | auth/account boundary plan | no |
| workspace/project data | `jai-nexus` for product model; `api-nexus` for interface | `dev-jai-nexus` routing only | planned | PR `#23`, PR `#5`, `customer-console-implementation-gates-v0.md` | workspace/project model plan | no |
| production infrastructure | later infrastructure owner | `dev-jai-nexus`, `api-nexus`, `jai-nexus` | blocked_by_infrastructure | `motion-0231`, `production-infrastructure-boundary-v0.md` | production infrastructure selection and deployment boundary | no |
| privacy/security preflight | `audit-nexus` | `dev-jai-nexus`, `jai-nexus`, `api-nexus` | preflight_defined | PR `#9` / `AUD-2026Q2-001` | privacy/security evidence checklist follow-up | no |
| customer data boundary | later boundary owner routed via `jai-nexus`/`api-nexus` | `audit-nexus`, `dev-jai-nexus` | blocked_by_security_review | `motion-0232`, PR `#9`, PR `#5` | customer data boundary plan | no |
| provider/model data exposure | `jai` for substrate semantics; `jai-nexus` for product posture | `api-nexus` if interface routing is needed later | boundary_defined | `jai` PR `#15`; `docs/architecture/customer-safe-jai-substrate-boundary-v0.md`; `motion-0232` | customer-safe JAI product/application boundary follow-up | no |
| usage metering/rate limits | `jai-nexus` for product posture; `api-nexus` for interface | `dev-jai-nexus` routing only | planned | PR `#24`, PR `#5` | usage/billing interface contract follow-up | no |
| logs/observability | later infrastructure/API owner | `audit-nexus`, `dev-jai-nexus` | not_started | `motion-0231`, PR `#9` | observability/logging boundary plan | no |
| retention/deletion | later data-boundary owner | `audit-nexus`, `api-nexus`, `jai-nexus` | not_started | PR `#24`, PR `#9` | retention/deletion boundary plan | no |
| incident/rollback/support | later product/infra owner | `jai-nexus`, `api-nexus`, `audit-nexus`, `dev-jai-nexus` | planned | `motion-0232`, `motion-0231` | support and incident posture plan | no |
| audit/event evidence | `api-nexus` for ingress interface; `audit-nexus` if audit canon is later routed | `dev-jai-nexus` routing only | planned | PR `#5`, PR `#9`, `customer-console-implementation-gates-v0.md` | audit/event evidence boundary plan | no |

## Implementation Authorization Posture

Implementation allowed remains `no` for all customer-facing gates in this
matrix.

Current explicit posture:

- paid beta is not open
- no payment collection is authorized
- no customer data collection is authorized
- no production deployment is authorized
- no live Stripe/auth/backend/persistence work is authorized
- no customer-facing provider/model behavior is authorized
- no local/personal machine may serve customers

Customer-safe JAI intake note:

- `jai` PR `#15` now settles the portable substrate boundary for customer-safe JAI semantics
- this improves readiness evidence for substrate-level boundary definition only
- it does not authorize customer-facing provider/model behavior
- it does not authorize customer memory, product/customer UX, account/workspace/project models, billing semantics, API gateway interfaces, auth/session semantics, DB/persistence authority, execution authority, or autonomous agent behavior

## Non-Goals

- mutating `jai-nexus`
- mutating `api-nexus`
- mutating `audit-nexus`
- mutating `jai`
- mutating `docs-nexus`
- opening paid beta
- collecting payment
- implementing auth, billing, persistence, or customer-safe JAI
- selecting final production infrastructure
- deploying customer workloads
- claiming implementation gates are authorized

## Authority Boundary

- No provider/model calls
- No runtime execution
- No branch-write authority
- No PR-creation authority
- No merge authority
- No scheduler/automation
- No API/DB mutation
- No backend persistence
- No auth implementation
- No live Stripe
- No customer data collection
- No hidden persistence

This artifact is docs/canon/routing only.
