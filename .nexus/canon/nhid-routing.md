# NHID Routing

## NHID

NHID is the compartmentalization and coordinate system for durable project
intelligence.

NHID should help the system track where project intelligence lives, how it is
referenced, and which repo/domain owns which intelligence thread.

## Routing posture

NHID should be treated as cross-repo durable-intelligence infrastructure, not
as canon owned only by `dev-jai-nexus`.

Provisional ownership/routing:
- `dev-jai-nexus`
  - operator routing and cross-repo coordination references
- `audit-nexus`
  - likely audit-specific NHID semantics after inspection
- `docs-nexus`
  - likely documentation/source-intelligence NHID semantics after governance
- `jai`
  - portable substrate semantics where NHID must remain durable and portable

## Constraint

This repo may reference NHID for control-plane coordination, but must not
declare itself the sole canonical owner of NHID semantics.
