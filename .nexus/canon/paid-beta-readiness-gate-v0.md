# Paid Beta Readiness Gate v0

## Purpose

This artifact defines the minimum gates before a paid beta can be offered to
real customers.

It is gate/canon only. It does not open paid beta, does not authorize payment
collection, and does not authorize live Stripe, auth, backend persistence,
customer data collection, or production workload deployment.

## Paid Beta Gate List

The following gates must be satisfied later before paid beta can open:

- commercial offer accepted internally
- plan envelope finalized
- Stripe/auth/backend owner routed
- production infrastructure selected
- privacy/security/audit review routed
- customer data boundary defined
- usage ledger semantics defined
- support posture defined
- no-local-production-hosting confirmed
- review-required product posture preserved

## Required Proof / Evidence Before Paid Beta

Evidence expected before any later paid-beta opening:

- explicit internal commercial approval record
- finalized plan and bounded usage envelope
- routed owner for billing, auth, and backend implementation
- explicit production infrastructure selection and deployment posture
- privacy/security review path and evidence owner
- documented customer-data boundary
- settled usage-ledger/customer-facing semantics
- documented support and escalation posture
- explicit confirmation that local/personal machines are not customer-serving

## Explicit Paid Beta Not Open Language

Current status remains:

- paid beta is not open
- no customer payment collection is authorized
- no production customer data is authorized
- no live Stripe/auth/backend/persistence work is authorized
- no production workload deployment is authorized
- no customer-facing provider/model behavior is authorized

## Future Routing Options

After this gate definition, likely next repo routes include:

- `jai-nexus` Commercial Offer v0 / Customer-Facing Value Copy
- `audit-nexus` Privacy/Security Paid Beta Preflight
- `api-nexus` Usage/Billing Interface Boundary

## Non-Goals

- opening paid beta
- collecting payment
- enabling live Stripe
- enabling auth implementation
- enabling backend persistence
- selecting final infrastructure in this motion
- deploying customer workloads
- collecting customer data
- mutating `jai-nexus`
- mutating `api-nexus`

## Authority Boundary

- this artifact defines a gate only
- it does not satisfy the gate
- it does not create implementation authority
- it does not create billing, auth, backend, or deployment authority
- it does not authorize customer-facing runtime behavior

This artifact is docs/canon/routing/planning only.
