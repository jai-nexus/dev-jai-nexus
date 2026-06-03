# Cross-Repo Canon Routing

## Purpose

Define cross-repo routing for major governance and product-foundry canon threads
without centralizing everything in `dev-jai-nexus`.

This file is a planning and routing reference only. It does not mutate any
other repo and does not declare final ownership beyond the provisional posture
described here.

## Control-plane framing

`dev-jai-nexus`:
- owns the Operator Control Plane expression
- owns operator visibility and cross-repo routing posture
- owns deterministic agenda / deliberation / passalong loop surfaces
- may reference cross-repo canon ownership
- should not be treated as the sole canonical owner of:
  - Golden Script
  - NHID
  - audit canon
  - hygiene canon
  - ritual-assessment canon
  - all product-foundry canon

## Repo/domain routing map

### dev-jai-nexus

Likely canonical ownership:
- Operator Control Plane
- cross-repo coordination
- operator visibility
- agenda / deliberation / passalong loop
- deterministic routing posture
- references to cross-repo canon ownership

Likely non-ownership:
- not sole owner of Golden Script
- not sole owner of NHID
- not sole owner of audit/hygiene/state-direction canon

### audit-nexus

First-class treatment:
- first-class repo/domain in the roadmap and routing model

Likely canonical ownership:
- audit rituals
- project hygiene assessments
- state/direction review records
- audit canon
- likely Golden Script audit semantics after direct repo inspection
- likely NHID audit semantics after direct repo inspection

### docs-nexus

Likely canonical ownership:
- Source Intelligence Library
- documentation canon
- future Agent Assets Library canon
- future motion context packs, if later governed

### jai

Likely canonical ownership:
- portable substrate
- council/chat semantics
- canonical read-only substrate contracts

### jai-nexus

Likely canonical ownership:
- product/customer/operator app surfaces
- customer portal
- prototype/reference lanes
- consumer-side read-only substrate usage

### api-nexus

Likely canonical ownership:
- API/interface governance
- future integration contracts

### jai-format

Likely canonical ownership:
- formatting discipline
- data-shape discipline
- canon representation discipline

### toolchain lanes

Likely canonical ownership by future repo/domain:
- `jai-pilot`
- `jai-vscode`
- future JAI Toolchain developer-product lanes

## Ownership rule

Each repo/domain may own its own `.nexus` canon according to domain
responsibility. `dev-jai-nexus` may route, reference, and coordinate, but
should not absorb canon that belongs in another first-class domain repo.

## Consolidation note

See [cross-repo-ownership-sweep-consolidation.md](./cross-repo-ownership-sweep-consolidation.md)
for the Q2M5 ownership-sweep consolidation that updates this routing layer with
settled repo-local boundaries.
