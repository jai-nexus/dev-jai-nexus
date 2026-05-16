# Paid Beta Next-Routing Decision v0

## Purpose

Record the next recommended cross-repo route after the paid-beta readiness
matrix.

This is routing-only. It does not mutate any destination repo and does not
authorize paid beta, billing, auth, persistence, customer data handling, or
customer-facing provider/model behavior.

## Route Options Considered

- `jai-nexus` Commercial Offer v0 / Customer-Facing Value Copy
- `api-nexus` Usage/Billing Interface Boundary
- `jai` Customer-Safe JAI Substrate Boundary
- `audit-nexus` Privacy/Security Evidence Checklist follow-up
- `docs-nexus` non-final customer-facing docs/policy boundary

## Recommended Route

Recommended next route:

- `jai-nexus` Commercial Offer v0 / Customer-Facing Value Copy

## Rationale

- billing model framing exists in `jai-nexus` PR `#24`
- unit economics boundary exists in `dev-jai-nexus` `motion-0230`
- privacy/security preflight exists in `audit-nexus` PR `#9` / `AUD-2026Q2-001`
- product shell posture already exists in `jai-nexus`
- customer-facing value framing should be clarified before deeper API,
  billing, or infrastructure implementation planning

## Non-Goals

- mutating `jai-nexus`
- authorizing paid beta
- authorizing customer-facing offer publication
- authorizing billing, auth, persistence, customer data, or provider/model behavior
- choosing a final implementation owner for every downstream seam

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

## Next Prompt Seed

Suggested next routing prompt seed:

- `jai-nexus`: Commercial Offer v0 / Customer-Facing Value Copy
- posture: product/customer copy and offer framing only
- non-goals: no publication, no billing implementation, no auth, no persistence
