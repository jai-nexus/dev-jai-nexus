# Operator Slate Page Upgrade Sweep Plan v0

## Status

- `DOCS/REFERENCE-ONLY`
- `MIGRATION PLAN`
- `NON-AUTHORIZING`
- `NO ROUTE TOPOLOGY CHANGES`
- `NO BACKEND CHANGES`
- `NO EXECUTION`

This plan inventories current `dev.jai.nexus` surfaces and proposes a phased
visual migration toward Operator Slate. It does not restyle a page, change a
route, modify navigation, change a data source, or authorize implementation.

## Scope and inspected baseline

The audit inspected:

- current route files under `portal/src/app/`
- the Operator layout and `OperatorSubnav`
- current page imports and local data-read helpers
- the accepted prototypes at `/operator/design-system`,
  `/operator/live-dashboard`, and `/operator/council-prototype`
- the control-plane route and its security gate model panel
- the shared primitives under `portal/src/components/operator/slate/`
- current docs/reference conventions

The current primitive baseline includes semantic tokens, panels, section
headers, badges, status and ID chips, safety rails, compose/read-only/gated/
blocked actions, a copy-only decision composer, dissent and contradiction
cards, gate cards, and shared safety invariants.

No `docs/reference/README.md` exists in the inspected baseline, so this plan
does not create or update a reference index.

## Target visual language

`dev.jai.nexus` should migrate toward Operator Slate as its internal cockpit
language:

- dark cockpit foundation with compact, bounded panels
- semantic badges and status chips instead of decorative color
- authority-visible state near the record or action it qualifies
- explicit canonical, read-only canonical, fixture, sample, and unknown-source
  distinctions
- a right safety rail where authority reminders must remain continuously
  visible
- dense but legible information hierarchy suitable for operator review
- inert actions that look inert
- local copy/draft actions labeled `REAL-COMPOSE`
- no decorative green
- no hidden automation language
- no visual or verbal implication that display state authorizes execution

The governing principles remain:

- `Green is earned.`
- `Provenance drives color.`
- `Claims are not facts.`
- `Dissent is the loudest element.`
- `Inert must look inert.`
- `Synthetic data is grey and labeled.`
- `Speed comes from the operator, not hidden automation.`

Operator Slate is an internal `dev.jai.nexus` cockpit direction. It must not be
silently applied to external or customer-facing `jai.nexus` surfaces without a
separate product and route decision.

## Classification vocabulary

- **already Operator Slate aligned**: uses the accepted primitive vocabulary
  or is the accepted visual reference.
- **partially aligned**: uses a compatible dark cockpit layout and some
  authority wording, but still duplicates local visual primitives or lacks
  full provenance semantics.
- **legacy visual language**: predates Operator Slate and relies on generic
  cards, tables, badges, or status colors.
- **customer/public style**: lies outside the authenticated Operator route
  group or reads as a general registry/public surface.
- **obsolete/replace candidate**: overlaps a newer cockpit surface and needs a
  disposition decision before substantial visual work.
- **route-topology decision needed**: migration depends on a route promotion,
  rename, redirect, or navigation decision.
- **high-risk authority surface**: displays or stages decisions, motions,
  agents, configuration, execution-adjacent state, or mutable records.
- **fixture-labeling risk**: fixture, sample, or derived data could be mistaken
  for live or canonical state.
- **canonical-data opportunity**: an existing safe read path can be retained
  and made more legible through provenance-aware Slate components.

## Page inventory and migration map

The data posture describes the inspected source, not an authorization claim.
Database-backed rows are called read-only here only when the page itself reads
them without adding a write path.

| Route | Found | Classification | Current data posture | Priority | Recommended Operator Slate mapping |
| --- | --- | --- | --- | --- | --- |
| `/` | yes | partially aligned; canonical-data opportunity; high-risk authority surface | Mixed read-only control-plane models, checked-in registries, DB telemetry summaries, and explicitly static examples | Phase 1 | `OperatorPanel`, `OperatorSectionHeader`, `OperatorBadge`, `OperatorStatusChip`, `OperatorIdChip`, `OperatorSafetyRail` |
| `/operator` | yes | legacy visual language; obsolete/replace candidate; route-topology decision needed | DB event count plus checked-in agency and project configuration | Decision before or with Phase 1 | Compact `OperatorPanel` front door, provenance badges, safety rail; do not replace with Live Dashboard without a topology decision |
| `/operator/control-plane` | yes | partially aligned; high-risk authority surface; fixture-labeling risk; canonical-data opportunity | Mixed read-only canonical motion posture and labeled `SYN-*` control-plane fixtures; local compose-only state | Phase 1 | Complete adoption of panels, badges, chips, safety rail, gate cards, action primitives, and existing `OperatorDecisionComposer` patterns |
| `/operator/design-system` | yes | already Operator Slate aligned | Local static `SYN-*` prototype constants and visual vocabulary | Reference; no migration phase | Retain as the visual reference; use all primitives as demonstrations, not as live state |
| `/operator/live-dashboard` | yes | already Operator Slate aligned; route-topology decision needed; fixture-labeling risk | Local `SYN-*` fixtures plus clearly marked example-canonical/read-only samples | Reference pending topology decision | Existing shared panels, badges, chips, actions, safety rail, and decision composer |
| `/operator/council-prototype` | yes | already Operator Slate aligned; route-topology decision needed; fixture-labeling risk; high-risk authority surface | Local `SYN-*` Council, slot, return, dissent, and synthesis fixtures | Reference pending topology decision | Existing shared badges, actions, safety rail, decision composer, dissent and contradiction cards |
| `/operator/motions` | yes | partially aligned; high-risk authority surface; canonical-data opportunity | Read-only canonical motion packages and motion queue indexes from existing local motion read helpers; existing promotion availability is separately governed | Phase 1 | `OperatorPanel`, status/ID chips, section headers, contradiction cards for mismatches, gate cards around promotion posture, safety rail |
| `/operator/decisions` | yes | legacy visual language; high-risk authority surface; canonical-data opportunity | Read-only DB `Decision` rows extracted from archived conversations | Phase 1 | Provenance-aware panels, status/ID chips, read-only actions, contradiction/dissent cards where recorded, safety rail |
| `/operator/agents` | yes | partially aligned; high-risk authority surface; canonical-data opportunity | Checked-in agent configuration and registry models, canonical-active records, palette drafts, repo scope models, and static authority posture | Phase 2 | Panels, section headers, agent ID/status chips, gate cards, blocked actions, safety rail |
| `/operator/grid` | yes | legacy visual language; high-risk authority surface; canonical-data opportunity | Checked-in canonical grid configuration plus temporary client-only draft, connection, diff, and motion-scaffold state | Phase 2, separately bounded | Panels and chips for source config; gate cards around draft semantics; gated/blocked actions; contradiction cards for invalid connections; persistent safety rail |
| `/operator/projects` | yes | partially aligned; fixture-labeling risk | Checked-in project registry fixture; explicitly fixture-backed and non-live | Phase 2 | Fixture badges and ID chips on every record, panels, section headers, blocked/gated actions as applicable |
| `/operator/work` | yes | partially aligned; high-risk authority surface; fixture-labeling risk; canonical-data opportunity | Deterministic agenda and loop-candidate models derived from checked-in control-plane/config state; local prompt drafting is representational | Phase 2 | Panels, status/ID chips, gate cards, compose-only actions, safety rail; label derived records and source provenance |
| `/operator/portfolio` | no | route-topology decision needed | Not found. The current subnav points to `/operator/portfolio-status` with label `Portfolio` | Do not create | Decide route disposition before migration |
| `/operator/portfolio-status` | yes | partially aligned; fixture-labeling risk | Checked-in portfolio status fixture only; no live repo status | Phase 2 as the currently implemented portfolio surface | Panels, fixture badges, status/ID chips, contradiction cards for risks, read-only/gated actions |
| `/operator/deliberation` | yes | partially aligned; high-risk authority surface; fixture-labeling risk | Local deliberation, loop-candidate, and passalong models derived from checked-in records; advisory/read-only posture | Phase 3 | Panels, safety rail, dissent and contradiction cards, gate cards, compose-only action vocabulary |
| `/operator/waves` | yes | partially aligned; high-risk authority surface; fixture-labeling risk | Seeded wave plans from local continuity files and filesystem-backed context; no automatic execution | Phase 3 | Panels, section headers, ID/status chips, gate cards, read-only and compose-only actions, safety rail |
| `/operator/chats` | yes | partially aligned; fixture-labeling risk; canonical-data opportunity | Mixed DB chat rows, filesystem import context, and seeded continuity conversation records | Phase 3 | Explicit source badges per row, panels, ID/status chips, read-only actions, safety rail |
| `/operator/jai` | yes | partially aligned; high-risk authority surface; canonical-data opportunity | Local static JAI chat surface model plus checked-in repo registry and configured scope subset; draft-only/read-only posture | Phase 3 | Panels, provenance badges, gate cards, compose-only actions, blocked actions, safety rail |
| `/operator/events` | yes | legacy visual language; canonical-data opportunity | Read-only DB `SotEvent` rows and aggregate counts | Phase 3 | Compact event panels/table, source/status/ID chips, provenance legend, read-only actions |
| `/sync-runs` | no | route-topology decision needed | Not found. A related dynamic review route exists at `/operator/sync-runs/[syncRunId]/review`, but no index route was found | Phase 4 decision only | Do not create or redirect; inventory the dynamic review flow separately before migration |
| `/repos` | yes | partially aligned; customer/public style; canonical-data opportunity | Checked-in full repo registry from the existing control-plane repo model; admin link enters Operator registry management | Phase 4 | Panels, repo ID/status chips, read-only actions, provenance badges; decide whether Slate belongs outside Operator layout |
| `/domains` | yes | legacy visual language; customer/public style; high-risk authority surface; canonical-data opportunity | Read-only DB Domain rows with linked repos; admin link enters Operator registry management | Phase 4 | Panels, domain ID/status chips, read-only actions, authority boundary; separate management controls visually |
| `/events` | yes | legacy visual language; customer/public style; canonical-data opportunity | Read-only DB `SotEvent` rows; mixed manual, script, and runtime-fed provenance | Phase 4 | Source/status/ID chips, provenance legend, read-only table/panels; decide relationship to `/operator/events` |

### Related routes discovered

These were not in the minimum route list but affect migration planning:

- `/operator/portfolio-status` is the implemented route behind the current
  `Portfolio` subnav item.
- `/operator/repos` is a separate DB-backed operator repo list from the
  top-level `/repos` registry model.
- `/operator/registry/repos` and `/operator/registry/domains` are management
  surfaces and must not be visually migrated in a way that obscures mutation
  authority.
- `/operator/sync-runs/[syncRunId]/review` is a dynamic review route with
  filesystem diff and existing review actions; it requires a separately
  bounded authority audit before a Slate migration.
- Additional Operator routes such as `/operator/corpus`,
  `/operator/operating-context`, `/operator/panels`, `/operator/pilot`,
  `/operator/signals`, and `/operator/dct` should enter a later inventory
  extension rather than being silently included in the first sweep.

## Migration phases

### Phase 1 - front door and authority spine

Targets:

- `/`
- `/operator/control-plane`
- `/operator/motions`
- `/operator/decisions`

Objectives:

- make the front door and control plane share one provenance-aware Slate
  vocabulary
- distinguish canonical motion and DB decision records from fixtures and
  static examples
- centralize authority reminders without changing read paths
- replace decorative or category-driven green with earned canonical/accepted
  semantics
- keep all existing motion and decision behavior unchanged

`/operator` needs a topology decision in this phase because it overlaps the
root overview and the Live Dashboard prototype. It must not be replaced merely
as a side effect of styling work.

### Phase 2 - operational planning surfaces

Targets:

- `/operator/agents`
- `/operator/grid`
- `/operator/projects`
- `/operator/work`
- `/operator/portfolio-status` as the currently implemented portfolio route

Objectives:

- expose source provenance and authority boundaries beside agent, grid,
  project, agenda, and portfolio state
- make temporary grid drafts visibly local and non-persistent
- make fixture-only project and portfolio records uniformly grey and labeled
- preserve execution-disabled and human-gated semantics

The Grid should be a separately bounded implementation within Phase 2 because
its local drafting interactions are execution-adjacent even though they do not
write state.

### Phase 3 - deliberation and continuity surfaces

Targets:

- `/operator/deliberation`
- `/operator/waves`
- `/operator/chats`
- `/operator/jai`
- `/operator/events`

Objectives:

- preserve dissent, contradictions, unresolved questions, and source
  provenance as first-class elements
- distinguish DB rows, filesystem context, seeded records, and derived local
  models
- use compose-only vocabulary only for text drafting or clipboard behavior
- prevent advisory output from appearing accepted or executable

### Phase 4 - legacy top-level surfaces

Targets:

- `/sync-runs` disposition, noting that the requested index route is not found
- `/repos`
- `/domains`
- `/events`
- related legacy top-nav and management surfaces after separate inventory

Objectives:

- decide whether internal Operator Slate belongs on each top-level route
- reconcile duplicate or overlapping `/events` and `/operator/events` roles
- separate read-only registry displays from privileged management links
- avoid turning an internal cockpit migration into an external product restyle

## Route topology questions

This plan records but does not decide:

1. Should `/operator/live-dashboard` become `/operator`?
2. Should `/operator/council-prototype` become `/operator/council`?
3. Should `/operator/control-plane` remain, redirect, or become a specialized
   subsection?
4. Should `/operator/design-system` remain in the Operator subnav forever?
5. Should DCT remain in the subnav?
6. Should the legacy top navigation remain?
7. Should phase-clustered navigation be introduced?
8. Should `/operator/portfolio-status` remain the implementation behind the
   `Portfolio` label, or should a separately approved `/operator/portfolio`
   route exist?
9. Should `/events` and `/operator/events` remain separate?
10. Should `/repos` and `/operator/repos` remain separate registry views?
11. Should a `/sync-runs` index exist, given that only dynamic Operator review
    routes were found?

No route promotion, rename, redirect, alias, or navigation redesign is
authorized by this document.

## Component mapping guidance

### Foundation

- Use `OperatorPanel` for bounded cockpit regions and table containers.
- Use `OperatorSectionHeader` for compact title, description, and posture
  hierarchy.
- Use semantic token names rather than route-local color decisions.

### Provenance and status

- Use `OperatorBadge` for posture labels such as `NON-AUTHORIZING`,
  `READ-ONLY`, `FIXTURE`, and `REAL-COMPOSE`.
- Use `OperatorStatusChip` for record status only after defining whether the
  status is canonical, derived, advisory, fixture, stale, gated, or blocked.
- Use `OperatorIdChip` for motion, decision, agent, project, work, event, repo,
  domain, wave, chat, and synthetic fixture identifiers.
- Green is reserved for accepted or canonical facts whose provenance supports
  that meaning. Active-looking UI alone does not earn green.

### Authority and action

- Use `OperatorSafetyRail` on high-risk authority surfaces and dense cockpit
  pages where invariants would otherwise scroll out of view.
- Use `OperatorGateCard` for capability, promotion, grid-draft, dispatch,
  mutation, or acceptance boundaries.
- Use compose, read-only, gated, and blocked action primitives instead of
  generic buttons whose authority is ambiguous.
- Use `OperatorDecisionComposer` only for local copy/draft behavior. It must
  not create a receipt, submit a decision, persist state, update canon, or call
  a server action.

### Deliberation

- Use `OperatorDissentCard` for minority positions, objections, or explicit
  dissent.
- Use `OperatorContradictionCard` for source conflicts, status mismatches,
  unresolved evidence, and incompatible claims.
- Risks, dissent, and contradictions must remain expanded and visible by
  default on authority-bearing surfaces.

## Data posture rules

Each migration PR must record the source of every displayed record:

| Data posture | Required display treatment |
| --- | --- |
| canonical data | Identify the canonical source and use canonical tone only when acceptance/provenance is established |
| read-only canonical data | Add `READ-ONLY` and source provenance; do not imply the page can mutate it |
| `SYN-*` fixture data | Add a visible row/card-level `FIXTURE` label and grey fixture tone |
| sample data | Label `SAMPLE` or `READ-ONLY SAMPLE`; never present it as current state |
| stale fixture data | Label both `FIXTURE` and `STALE`, with the snapshot date/source when known |
| mixed canonical/synthetic data | Separate the groups structurally and label every synthetic row |
| unknown source | Label `SOURCE UNKNOWN`; do not use canonical/accepted green |
| temporary local draft state | Label local, non-persistent, and non-authorizing; do not call it saved or submitted |

Additional rules:

- Synthetic data must be labeled.
- Canonical data must be visibly distinguished from fixture/sample data.
- Derived data must identify its inputs and must not silently inherit
  canonical status.
- Database-backed does not automatically mean canonical.
- Dashboard display does not authorize action.
- A freshness timestamp does not prove completeness or acceptance.
- A route, receipt, validation result, Council output, or Agent assignment does
  not grant execution authority.

## Authority posture requirements

Migrated pages must preserve or add the applicable visible labels:

- `NON-AUTHORIZING`
- `READ-ONLY`
- `LOCAL STATIC SNAPSHOT` where applicable
- `FIXTURE` where applicable
- `REAL-COMPOSE` only for local copy/draft behavior
- `NO EXECUTION`
- `NO DISPATCH`
- `ZERO GATES GRANTED`

Shared invariants must remain visible where relevant:

- `CONTROL_THREAD decides.`
- `Validation is not acceptance.`
- `Receipts record; they do not decide.`
- `Routes recommend; they do not execute.`
- `Council agreement is not authority.`
- `Agents are staged, not executing.`

Visual migration must not weaken existing route-specific blocked-capability,
closed-gate, manual-review, or non-persistence language.

## Do not migrate yet

Defer the following until separate decisions and bounded routes exist:

- promotion of `/operator/live-dashboard` to `/operator`
- rename or promotion of `/operator/council-prototype`
- redirect or retirement of `/operator/control-plane`
- creation of `/operator/portfolio` or `/sync-runs`
- global navigation redesign or phase-clustered navigation
- removal of DCT, legacy top navigation, or existing Operator links
- production or customer-facing application of Operator Slate
- backend/API state changes introduced to satisfy a visual field
- live model dispatch or provider selection
- autonomous Agent execution
- GitHub, branch, PR, repo, browser, or desktop actions
- receipt creation or automatic acceptance
- canon mutation
- policy enforcement or automatic gate evaluation
- opening execution gates
- migration of management forms without a separate authority and mutation audit

## Recommended first implementation PR

Recommended route:

`Operator Root + Control Plane Slate Migration v0`

Bounded scope:

- migrate `/` and `/operator/control-plane` to the accepted shared primitives
- preserve all existing read helpers and local compose behavior
- add no new data source, API, mutation, or navigation behavior
- make static examples, fixtures, derived state, and canonical/read-only state
  structurally distinct
- retain all closed-gate and blocked-capability language
- leave `/operator` route disposition unchanged

This is preferred over beginning with Motions and Decisions because the root
and control plane establish the shared cockpit shell and provenance legend
that later migrations can reuse. If CONTROL_THREAD wants the first
implementation to focus on authority-bearing records instead, the bounded
alternative is:

`Motions + Decisions Slate Migration v0`

That alternative must preserve the existing motion promotion boundary and keep
the Decisions surface read-only.

## Risks

- A broad restyle could hide behavior or data-source changes inside visual
  churn.
- Shared primitives could normalize route-specific semantics that should
  remain distinct.
- Green could be overused for active, healthy, or visually positive states
  that are not accepted canonical facts.
- Prototype pages could be mistaken for live cockpit surfaces.
- Route topology could change without an explicit decision.
- External `jai.nexus` style could be conflated with the internal
  `dev.jai.nexus` cockpit language.
- Fixture, sample, derived, database-backed, and canonical data could blur.
- Navigation could become overloaded as prototypes and operational surfaces
  coexist.
- Local drafting surfaces such as Grid could look persistent or executable
  after visual polish.
- Duplicate top-level and Operator routes could appear equivalent despite
  different data sources and authority boundaries.
- A safety rail could become decorative boilerplate rather than a visible,
  route-specific authority boundary.

## Non-authorizations

This plan does not authorize:

- execution
- provider/model dispatch
- live model calls
- Agent execution
- repo mutation
- branch/PR automation
- browser/desktop control
- live settings mutation
- API routes
- server actions
- DB writes
- Prisma changes
- telemetry
- auth/session changes
- GitHub integration
- `localStorage` or `sessionStorage` as system of record
- production behavior
- `.jai` parser/runtime behavior
- `.nexus` active semantics
- policy enforcement
- execution gates opened
- automatic scoring
- automatic synthesis
- automatic best-agent selection
- automatic gate evaluation
- receipt creation
- canon update
- route promotion
- route redirects
- navigation redesign

This document is a non-authorizing migration plan. Every implementation phase
requires a separately routed, bounded review.
