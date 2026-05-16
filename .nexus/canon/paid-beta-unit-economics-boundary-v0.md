# Paid Beta Unit Economics Boundary v0

## Purpose

This artifact defines planning-only unit-economics guardrails for a future paid
beta before pricing becomes externally committed.

It is canon/routing only. It does not authorize a commercial offer, does not
open paid beta, and does not authorize live product usage, billing, or customer
data collection.

## Unit Economics Principle

JAI NEXUS must avoid unlimited AI economics.

Pricing and plan envelopes must protect exposure across model/API use,
source-analysis cost, storage/retention cost, support burden, and any other
variable-cost surface before a paid beta is offered externally.

Paid-beta economics remain planning only until later commercial authorization.

## Cost-Exposure Categories

The following categories must be treated as explicit cost surfaces:

- model calls
- AI credits
- long deliberation traces
- source/repo analysis jobs
- source-ingest jobs
- agent runs
- storage and retention
- event volume
- support burden

Routing implication:

- cost exposure must be visible before external pricing is presented as live
- expensive categories should not hide inside vague “included” language

## Plan-Envelope Requirements

Future plan design should preserve the following requirements:

- quotas must be bounded
- expensive usage must be metered
- enterprise must remain contracted/custom
- low-tier SSO and custom workflows should remain excluded
- free/sandbox plans must not create unlimited variable-cost exposure
- paid-beta terms must be explicit before any external offer

Additional posture:

- usage semantics must be understandable enough for internal review
- no “unlimited AI” or equivalent open-ended cost language should be used
- support burden must be treated as part of plan design, not an afterthought

## Open Questions

Questions still requiring later commercial/product review:

- initial monthly AI credit budget
- paid-beta discount posture
- first paid tier final price
- whether customers see credits, motions, deliberations, or all three
- what usage is hard-capped vs soft-limited
- what usage requires enterprise/custom handling

## Non-Goals

- setting final external pricing
- opening paid beta
- collecting payment
- adding live Stripe
- adding auth implementation
- adding backend persistence
- adding provider/model calls
- adding runtime execution
- mutating `jai-nexus`
- mutating `api-nexus`

## Authority Boundary

- this artifact is economic-boundary planning only
- it does not create commercial authorization
- it does not create billing authority
- it does not create implementation authority in any repo
- it does not authorize customer-facing workload exposure

This artifact is docs/canon/routing/planning only.
