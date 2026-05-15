# Cross-Repo Ownership Sweep Consolidation

## Purpose

This artifact consolidates the settled Q2M5 cross-repo ownership sweep into the
`dev-jai-nexus` control-plane canon layer.

`dev-jai-nexus` remains:
- the Operator Control Plane
- the cross-repo routing layer
- the operator visibility surface
- the agenda / deliberation / passalong loop owner
- the repo/domain coordination surface

`dev-jai-nexus` does **not** become the owner of all repo-local canon. It
references and routes settled ownership boundaries that belong elsewhere.

## Relationship to motion-0194

- `motion-0194` established provisional cross-repo routing canon.
- `motion-0195` updates that routing layer with repo-local boundaries settled by
  the subsequent ownership sweep.
- this artifact is a consolidation/reference layer only
- no destination repo canon is rewritten here

## Settled repo-local ownership boundaries

### dev-jai-nexus

Settled control-plane ownership:
- Operator Control Plane
- cross-repo routing
- operator visibility
- deterministic agenda / deliberation / passalong loop
- repo/domain coordination

Non-ownership posture:
- not sole owner of Golden Script
- not sole owner of NHID
- not sole owner of audit/hygiene/state-direction canon
- not sole owner of product-foundry canon

### audit-nexus

Settled boundary:
- audit / hygiene boundary settled

Likely owned canon:
- audit rituals
- project hygiene assessments
- state/direction review records
- audit canon

First-class posture:
- `audit-nexus` is first-class and must remain explicitly routed as such in the
  control-plane model

Still future-routed:
- any global Golden Script audit semantics not already settled there
- any global NHID audit taxonomy not already settled there

### docs-nexus

Settled boundary:
- Source Intelligence / Agent Assets boundary settled

Likely owned canon:
- documentation canon
- source intelligence
- agent asset library
- context-pack semantics where later governed

### jai

Settled boundary:
- portable substrate boundary settled

Likely owned canon:
- council/chat substrate semantics
- read-only portable substrate contracts

### jai-nexus

Settled boundary:
- product / customer surface boundary settled

Likely owned canon:
- customer portal
- customer/product/operator app surfaces
- prototype/reference lanes
- consumer-facing read-only substrate usage

### api-nexus

Settled boundary:
- interface / integration / API boundary settled

Likely owned canon:
- integration contracts
- API surface governance
- interface seams

### jai-format

Settled boundary:
- representation / formatting / contract-shape boundary settled

Likely owned canon:
- formatting discipline
- canonical data-shape conventions
- representation contracts

### orchestrator-nexus

Settled boundary:
- orchestration / fleet-inventory / local-command boundary settled

Follow-up status:
- command hygiene follow-up completed

Likely owned canon:
- local command posture
- fleet inventory
- orchestration seam hygiene

Still future-routed:
- broad command authority still requires safety gates and later governance

## Unresolved / future-routed seams

The following remain unresolved or explicitly future-routed:

- global NHID taxonomy
- global Golden Script doctrine
- `.jai` native language / structural nhID doctrine
- source-tree representation
- agent execution authority
- scheduler authority
- branch-write / PR creation / merge authority
- provider/model dispatch
- dry-run / safety gates for broad orchestrator fleet commands

None of the above are settled by this consolidation artifact.

## Q2M5 operator-loop relationship

Q2M5 established the operator-loop proof in `dev-jai-nexus`:
- root overview
- deterministic agenda
- deterministic deliberation
- passalong-ready handoff
- cross-repo routing posture

This consolidation places that operator-loop work inside the broader
cross-repo ownership map:
- `dev-jai-nexus` coordinates and routes
- destination repos/domains own their repo-local canon
- authority expansion remains deferred and staged

## Routing rule

When a canon thread clearly belongs to a first-class repo/domain:
- `dev-jai-nexus` should reference it
- `dev-jai-nexus` should route toward it
- `dev-jai-nexus` should not absorb it by default

This control-plane repo remains the coordinator/reference surface, not the
owner of every settled canon thread in the system.
