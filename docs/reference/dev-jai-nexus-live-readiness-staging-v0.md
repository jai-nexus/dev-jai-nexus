# dev.jai.nexus Live-Readiness Staging v0

## Live-Readiness Thesis

Live-ready does not mean live-executing. For this staging branch, live-readiness means the Operator shell exposes the visible structure, route posture, readiness labels, activation blockers, gate requirements, and read-only workflows needed before live activation can be considered.

Commit 1 stages the Operator route topology readiness shell only. It does not promote routes, redirect routes, remove legacy access, redesign navigation, or enable execution.

## Commit 1: Route Topology Readiness Shell

The Operator route topology shell makes existing route relationships legible without deciding them. It uses local static `SYN-*` records and read-only labels only.

Current action posture:

- `READ-ONLY` for route labels, inventories, and relationship cards.
- `GATED` or `BLOCKED` for future or unauthorized capabilities.
- `MANUAL HANDOFF` for any later route decision work.
- `NOT AUTHORIZED IN V0` for execution, dispatch, mutation, promotion, redirect, or navigation redesign.

## Route Relationship Inventory

| Surface | Current role | Commit 1 posture |
| --- | --- | --- |
| `/operator` | Current Operator entry point | Remains the entry route; not replaced. |
| `/operator/control-plane` | Current control-plane route | Remains current route; not redirected. |
| `/operator/live-dashboard` | Prototype/readiness surface | Not promoted to `/operator`. |
| `/operator/council-prototype` | Prototype/readiness surface | Not promoted to `/operator/council`. |
| `/operator/design-system` | Design/reference surface | Remains design/reference. |
| DCT | Existing decision/context tooling surface | Remains available. |
| Legacy nav | Existing global/top navigation posture | Remains available. |

## Route Topology Decisions Deferred

- Should `/operator/live-dashboard` become `/operator`?
- Should `/operator/council-prototype` become `/operator/council`?
- Should `/operator/control-plane` remain, redirect, or become a specialized subsection?
- Should `/operator/design-system` remain in subnav?
- Should DCT remain in subnav?
- Should legacy top nav remain?
- Should phase-clustered navigation be introduced?

## Current Allowed Behavior

- Read-only route relationship cards.
- Page-level role labels for Operator topology surfaces.
- Static `SYN-*` readiness records.
- Conservative fixture/source labeling.
- Non-authorizing explanation copy.
- Existing read-only canonical reads where already accepted by the route.
- Local-only copy behavior only where it already exists and remains visibly labeled `REAL-COMPOSE`.

## Current Blocked Behavior

- Route promotion.
- Route redirects.
- DCT removal.
- Legacy top-nav removal.
- Phase-clustered navigation implementation.
- Navigation redesign.
- Execution, provider/model dispatch, live model calls, Agent execution, GitHub integration, repo mutation, branch creation, PR creation, branch/PR automation, or runtime activation.
- API route, server action, database, Prisma, telemetry, auth/session, localStorage/sessionStorage, `.jai`, `.nexus`, policy enforcement, gate evaluation, receipt creation, canon update, motion-state mutation, or route-state mutation expansion.

## Activation Blockers

- `CONTROL_THREAD` has not decided route topology.
- Execution gates remain closed.
- Step-up verification, if present later, can confirm operator presence only.
- Authentication remains separate from authorization.
- Receipts record; they do not decide.
- Validation is not acceptance.
- Council agreement is not authority.
- Agents are staged, not executing.
- Dashboard display does not authorize.
- Read-only is not authority.
- ZERO GATES GRANTED.

## Non-Authorizations

Commit 1 does not authorize execution, route promotion, route redirect, live runtime behavior, provider/model calls, Agent execution, GitHub automation, repo mutation, customer data handling, production behavior, automatic scoring, automatic synthesis, automatic best-agent selection, automatic gate evaluation, receipt creation, canon update, motion-state mutation, route-state mutation, or opened execution gates.

## Recommended Later Commit Sequence

1. Commit 2: deepen source/readiness labels without changing route topology.
2. Commit 3: add activation blocker visibility where existing surfaces need clearer gate language.
3. Commit 4: improve read-only compose and manual handoff posture without dispatch.
4. Commit 5: refine prototype/canonical/fixture source posture.
5. Commit 6: consolidate gate/readiness matrix.
6. Commit 7: final live-readiness staging review and closeout, still without activation unless separately authorized.
