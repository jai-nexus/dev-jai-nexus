# JAI-Nexus Product Readiness Routing v0

## Purpose

This artifact updates `dev-jai-nexus` routing canon with the settled
`jai-nexus` product readiness arc through PR `#23`.

It is a control-plane routing reference only. It does not mutate `jai-nexus`,
does not claim implementation gates are satisfied, and does not authorize
runtime behavior or authority expansion.

## Current JAI-Nexus Baseline

`jai-nexus` is currently paused at product readiness / placeholder IA state.

This means:
- public-positioning and trust-framing surfaces are settled
- customer-console shell direction is settled
- placeholder IA is coherent enough for pause/review
- implementation-gated work remains deferred

## Settled JAI-Nexus PR Sequence

- PR `#20`: Product / Customer Surface Ownership Boundary v0
- PR `#21`: Customer Portal / Product Surface Readiness v0
- PR `#22`: Customer Portal Shell Copy / Placeholder Coherence v0
- PR `#23`: Account / Workspace IA Placeholder Plan v0

These PRs establish a stable product-surface framing seam without claiming that
auth, billing, persistence, or customer-safe JAI behavior already exists.

## Settled Product-Surface Posture

- `apps/web` = public-positioning and trust-framing surface
- `apps/app` = production-direction customer console shell
- `apps/app` uses preview/example-data framing
- Workspace is shell/navigation IA only, not persisted tenant/team state
- Account is placeholder affordance only, not live identity
- Projects are example-data route shells
- Settings and Billing remain placeholder-only
- JAI is browser-local, draft-only, route-local, and review-required
- `apps/operator` is repo-local product/admin shell, not `dev-jai-nexus`
  control-plane canon
- `apps/live-chat` and `apps/prototype` remain prototype/reference lanes

## Future Implementation Gates

The following implementation gates remain unsatisfied and should be treated as
future work only:

- auth
- billing / Stripe
- backend persistence
- customer account model
- workspace / project data model
- customer-safe JAI behavior

No gate above is claimed satisfied by this artifact.

## Cross-Repo Boundary Map

### dev-jai-nexus

Owns:
- control-plane routing
- cross-repo coordination
- operator visibility
- routing references to settled repo-local boundaries

Does not own:
- `jai-nexus` product implementation
- customer account implementation
- customer data persistence

### jai-nexus

Owns:
- product/customer surfaces
- customer-facing shell posture
- product IA placeholder planning
- browser-local draft-only JAI customer surface framing

Paused posture:
- stable enough for routing pause
- not implementation-complete
- not gate-complete

### api-nexus

Likely future participant for:
- API/interface seams
- customer-facing integration contracts
- backend interface coordination

### jai

Likely future participant for:
- substrate semantics
- canonical behavior contracts below product-shell framing

### audit-nexus

Participates only if later routed for:
- product-readiness audit posture
- implementation hygiene review

### docs-nexus

Participates only if later routed for:
- customer/product documentation canon
- source-intelligence or asset packaging follow-ups

## Routing Recommendation / Paused Posture

`dev-jai-nexus` should treat `jai-nexus` as stable enough to pause at product
readiness / placeholder IA state until implementation-gated work is explicitly
routed later.

Routing recommendation:
- reference the settled PR `#20`-`#23` arc as stable readiness framing
- do not claim implementation gates are satisfied
- do not route implementation work until a later explicit seam covers it

## Non-Goals

- mutating `jai-nexus`
- opening Corpus V2
- resetting numbering
- claiming implementation-gate completion
- adding runtime behavior, provider/model calls, automation, or authority

## Authority Boundary

- No provider/model calls
- No runtime execution
- No branch-write authority
- No PR-creation authority
- No merge authority
- No scheduler
- No automation
- No API/DB mutation
- No hidden persistence

This artifact is routing/canon only.
