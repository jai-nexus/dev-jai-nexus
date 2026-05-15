# Customer Console Implementation Gates v0

## Purpose

This is a `dev-jai-nexus` routing/canon consolidation artifact.

It consolidates customer-console implementation gates across `jai-nexus` and
`api-nexus` before any repo begins auth, billing, backend persistence,
account/workspace/project model, or customer-safe JAI implementation work.

This artifact is routing/reference only. It does not mutate any repo and does
not claim that implementation gates are satisfied.

## Current Cross-Repo Baseline

- `dev-jai-nexus` is settled through `motion-0227`
- `jai-nexus` is settled through PR `#23`
- `api-nexus` is settled through PR `#4`

## JAI-Nexus Readiness Posture

Settled posture from PR `#20`-`#23`:

- `apps/app` is the production-direction customer console shell
- `apps/app` uses preview/example-data framing
- Workspace is shell/navigation IA only
- Account is placeholder affordance only
- Projects are example-data route shells
- Settings and Billing remain placeholder-only
- JAI is browser-local, draft-only, route-local, and review-required
- implementation gates remain unsatisfied

## API-Nexus Boundary Posture

Settled boundary posture:

- current runtime remains only `GET /healthz`
- current runtime remains only `POST /ingest/events`
- customer-console API seams are future / not implemented

Future seams documented there include:

- account identity interface
- workspace interface
- project interface
- billing/customer/subscription interface
- auth-adjacent boundary
- customer-safe JAI request/event interface
- audit/event ingress interface

JSONL capture boundary:

- JSONL capture is repo-local raw ingress evidence only
- it is not global SOT
- it is not audit canon
- it is not a replay queue
- it is not orchestration state
- it is not execution state
- it is not product/customer state

## Implementation Gate Map

| Gate | Owner repo | Supporting repos | Current status | Required next artifact | Explicit non-goals | Authority boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Product shell gate | `jai-nexus` | `dev-jai-nexus` routing only | docs/readiness-only; shell and placeholder IA exist | product implementation gate plan in `jai-nexus` | no auth, billing, or persistence | no customer state or backend mutation |
| Account/auth gate | `jai-nexus` for product UX; `api-nexus` for interface boundary | `api-nexus`; possibly `jai` for identity-adjacent substrate semantics | unsatisfied | auth/account boundary plan | no live auth implementation | no live identity or session model |
| Workspace/project data model gate | `jai-nexus` for product model; `api-nexus` for interface | `dev-jai-nexus` routing only | unsatisfied | workspace/project model plan | no persisted tenant/team/project state | no DB or backend persistence |
| Billing/Stripe gate | `jai-nexus` for customer billing UX; `api-nexus` for integration interface | `dev-jai-nexus` routing only | unsatisfied | billing/Stripe boundary plan | no live Stripe integration | no billing/customer/subscription mutation |
| Customer-safe JAI behavior gate | `jai-nexus` for product behavior; `jai` for substrate semantics | `api-nexus` if request/event interface is needed | unsatisfied | customer-safe JAI behavior boundary | no live provider/model calls | JAI remains draft-only and review-required until later authorization |
| API/interface gate | `api-nexus` | `jai-nexus`, `jai` where substrate semantics matter | future/not implemented | customer-console API/interface contract plan | no expanded runtime beyond existing endpoints | no product/customer state or orchestration state |
| Privacy/security review gate | likely `audit-nexus` or later routed privacy/security canon owner; `dev-jai-nexus` coordinates | `jai-nexus`, `api-nexus` | unsatisfied | privacy/security review routing decision | no compliance claim | no production customer data handling claim |
| Audit/event evidence gate | `api-nexus` for ingress interface; `audit-nexus` if/when audit canon is routed | `dev-jai-nexus` routing only | unsatisfied beyond repo-local JSONL raw ingress evidence | audit/event evidence boundary plan | do not promote JSONL to global SOT, audit canon, replay, orchestration, or product state | no global event state |

## Owner / Supporting Repo Matrix

### dev-jai-nexus

Owns:

- coordination and routing
- cross-repo implementation gate posture
- control-plane reference canon

Does not own:

- product implementation
- API implementation
- persistence or customer state

### jai-nexus

Owns:

- product/customer surfaces
- customer console shell posture
- product-facing implementation planning

### api-nexus

Owns:

- API/interface/integration edge concerns
- customer-console interface planning
- ingress-edge boundaries

### jai

Likely owns later:

- substrate semantics for customer-safe JAI behavior

### audit-nexus

Participates only if later routed for:

- privacy/security review posture
- audit/evidence canon

### docs-nexus

Participates only if later routed for:

- documentation or source-intelligence follow-up work

## Routing Recommendations

Customer-console implementation should not begin until the relevant gates are
explicitly planned.

Likely next repo motion should be:

- `api-nexus` customer-console API/interface boundary

unless `CONTROL_THREAD` chooses:

- `jai-nexus` product implementation gate planning first

`dev-jai-nexus` remains the coordinator/reference surface only.

## Non-Goals

- mutating `jai-nexus`
- mutating `api-nexus`
- mutating any other repo
- implementing auth
- implementing billing/Stripe
- implementing persistence
- implementing account/workspace/project model
- implementing customer-safe JAI
- expanding `api-nexus` runtime
- promoting JSONL capture
- opening Corpus V2
- resetting numbering
- granting authority

## Authority Boundary

- No live agent drafting
- No live voting
- No provider/model calls
- No runtime execution
- No branch-write authority
- No PR-creation authority
- No merge authority
- No scheduler/automation
- No API/DB mutation
- No backend persistence
- No auth implementation
- No live billing/Stripe
- No hidden persistence
- No passalong index

This artifact is docs/canon/routing only.
