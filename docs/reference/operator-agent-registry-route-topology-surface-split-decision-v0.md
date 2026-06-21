# Operator Agent Registry Route Topology + Surface Split Decision v0

## 1. Status

Scope: Operator Agent Registry Route Topology + Surface Split Decision v0.

Mode: `REPO_EXECUTION / DOCS-REFERENCE / ROUTE-TOPOLOGY / SURFACE-SPLIT-DECISION / AGENT-REGISTRY / OPERATOR-UI-PLANNING / NO-RUNTIME / NO-EXECUTION`.

Branch: `docs/q2-operator-agent-registry-route-topology-surface-split-decision-v0`.

Artifact status: docs/reference decision artifact for CONTROL_THREAD review.

This artifact is planning-only. It recommends an information-architecture
posture for Agent Registry surfaces under `/operator/agents`, but it does not
change routes, add routes, alter UI, mutate navigation, implement redirects,
add backend/API/DB behavior, create runtime behavior, update canon beyond this
docs/reference artifact, create receipts, open gates, or authorize Agent
creation, activation, execution, dispatch, vote creation, recommendation
submission, project-state creation, or receipt creation.

Route topology is not execution authority.
Navigation does not authorize action.
Route promotion does not open gates.
Dashboard display does not authorize.
Agent Registry display does not activate Agents.
Palette display does not create Agents.
Vote display does not decide.
CONTROL_THREAD decides.
ZERO GATES GRANTED.

## 2. Current Accepted Baseline

CONTROL_THREAD has accepted these Agent Registry Operator surfaces:

- `Agent Registry Read-Only Surface v0`.
- `Agent Registry Read-Only Surface v0 QA + Operator Slate Density Pass`.
- `Agent Vote Review Surface v0`.
- `Palette Agent Recommendation Surface v0`.

Current accepted route:

- `/operator/agents`.

The current route renders accepted static data and read-only review surfaces.
It is not an activation surface, dispatch surface, vote creation surface,
recommendation submission surface, project-state creation surface, receipt
creation surface, canon update surface, or gate-opening surface.

## 3. Current `/operator/agents` Inventory

The current `/operator/agents` route contains these accepted embedded surfaces:

- Agent Registry overview.
- Role templates.
- Domain engines.
- Polyrepo scope map.
- DNS/service domain scope.
- Tier Agent model.
- Project-scoped Agent candidates.
- Advisory vote review.
- Palette Agent recommendations.
- High-risk/frozen/deprecated treatment.
- Authority boundary rails.

The route also preserves the existing Agent registry identity and capability
posture material that predates the static cross-polyrepo Agent Registry
surface. This means `/operator/agents` is now both a canonical Agent Registry
entry route and a dense review route for several accepted sub-surfaces.

## 4. Surface Density Problem

The route is functioning and compiles as the accepted read-only Agent Registry
surface. The problem is not correctness; it is density and maintainability.

The static data package is intentionally large. Multiple accepted read-only
surfaces are now stacked on one route: registry overview, role templates,
domain engines, polyrepo scope, DNS/service domains, Tier model, candidates,
vote review, Palette recommendations, risk treatment, and authority rails.
Adding more Agent Registry surfaces would increase the scan burden and make the
route harder to maintain.

Immediate route splitting may still be premature. The branch does not yet have
settled `dashboard-state-index/v0` or `route/v0` references for how Agent
Registry sub-surfaces should be indexed, linked, or represented as route-state.
Splitting too early could create route sprawl or imply maturity that the
registry doctrine does not yet authorize.

## 5. Route Topology Options

### Option A: Keep All Agent Registry Surfaces Embedded Under `/operator/agents`

Description: keep every current and near-future Agent Registry surface in the
same route with no local navigation or route split.

Advantages:

- Preserves current route compatibility.
- Avoids route topology changes.
- Keeps all doctrine and rails in one place.
- Lowest implementation risk.

Risks:

- Page remains dense.
- Future surfaces worsen scanability.
- Review sections compete for attention.
- Long-term maintenance cost increases.

Compatibility impact: strongest compatibility preservation because existing
links and route behavior remain unchanged.

Implementation impact: no implementation needed beyond ordinary content
maintenance.

Authority posture: safe if labels remain clear. Embedding does not authorize
creation, activation, dispatch, voting, receipts, canon updates, or gates.

Recommendation: not recommended as the next implementation posture. It is safe
but does not solve the current density problem.

### Option B: Keep `/operator/agents` As Overview And Split Into Adjacent Read-Only Subroutes

Description: keep `/operator/agents` as the overview and split accepted
surfaces into adjacent read-only routes, for example:

- `/operator/agents/registry`
- `/operator/agents/votes`
- `/operator/agents/palette`
- `/operator/agents/candidates`
- `/operator/agents/risk`

Advantages:

- Strong surface separation.
- Smaller pages.
- Easier future surface ownership.
- Clearer direct links to votes, Palette recommendations, candidates, and risk.

Risks:

- Creates route sprawl before `dashboard-state-index/v0` and `route/v0`
  references are settled.
- Subroutes may imply maturity or authority if labels are weak.
- Requires route and navigation decisions that this artifact does not
  authorize.
- Deep links could become compatibility obligations before route roles are
  accepted.

Compatibility impact: existing `/operator/agents` can remain compatible, but
new subroutes would create new compatibility surfaces.

Implementation impact: higher. Requires route files, route labels, possible
subnav or local route linking, and future route-state alignment.

Authority posture: safe only if every subroute is labeled read-only and
non-authorizing. Route split does not open gates.

Recommendation: not recommended for immediate implementation. Reconsider after
`dashboard-state-index/v0` and `route/v0` are more settled.

### Option C: Keep `/operator/agents` Canonical And Add Local-Only Tabs/Anchors

Description: preserve `/operator/agents` as the canonical Agent Registry route
and add local-only tabs, anchors, or in-page surface navigation within the same
route.

Advantages:

- Preserves route compatibility.
- Reduces perceived density without route sprawl.
- Keeps doctrine and authority rails in one canonical place.
- Avoids route topology changes before route/profile references settle.
- Allows direct in-page orientation to Overview, Registry, Votes, Palette,
  Candidates, Risk, and Authority Boundary sections.

Risks:

- Tabs/anchors may appear interactive and must remain read-only.
- Hidden or off-screen content could weaken doctrine visibility if implemented
  too aggressively.
- Future developers may mistake local navigation for route promotion unless
  labels are explicit.

Compatibility impact: strong. Existing `/operator/agents` links remain valid.
Anchors can be added without breaking route compatibility.

Implementation impact: moderate. Requires a local presentational navigation
component or anchor index, but no routes, redirects, backend behavior, or
navigation mutation.

Authority posture: safe if labels remain explicit. Local navigation does not
authorize Agent creation, Agent activation, Agent dispatch, vote creation,
recommendation submission, project-state creation, receipt creation, canon
update, or gate opening.

Recommendation: recommended for the next implementation branch.

### Option D: Defer Splitting Until `dashboard-state-index/v0` And `route/v0` Are Settled

Description: record the surface density problem now but defer any local
navigation or route split until route/profile references settle.

Advantages:

- Avoids premature IA commitments.
- Aligns future work to route/profile doctrine.
- Prevents accidental route sprawl.

Risks:

- Does not improve current density soon.
- More Agent Registry surfaces could stack before the split decision is
  implemented.
- Operators keep scanning a long route for longer.

Compatibility impact: no change.

Implementation impact: none immediately.

Authority posture: safe. Deferral grants no route, navigation, runtime,
backend, Agent, Palette, vote, project-state, receipt, or gate authority.

Recommendation: record as fallback, not the primary next step.

## 6. Recommended Topology

Decision: recommend Option C.

Keep `/operator/agents` as the canonical Agent Registry route and add
local-only tabs, anchors, or in-page surface navigation in a future
implementation branch.

This recommendation does not create routes. It does not mutate navigation. It
does not redirect. It does not open gates. It does not authorize action. It
does not create Agents, activate Agents, dispatch Agents, submit
recommendations, create votes, create project state, create receipts, update
canon, or mutate route/motion/gate state.

Recommended next implementation posture:

- preserve `/operator/agents`;
- add local-only read-only section navigation;
- keep critical doctrine visible outside any hidden interaction;
- keep `ZERO GATES GRANTED` visible near the top and in the authority boundary
  rail;
- keep advisory votes and Palette recommendations labeled as non-authority;
- avoid route files, redirects, top-nav changes, sidebar changes, API routes,
  server actions, DB/Prisma changes, package changes, or runtime behavior.

Option D remains the fallback: defer actual route splitting until
`dashboard-state-index/v0` and `route/v0` references are more settled.

## 7. Surface Split Candidates

Recommended future local tab/anchor groups under `/operator/agents`:

- Overview.
- Registry.
- Domain Engines.
- Polyrepo Scope.
- Service Domains.
- Candidates.
- Votes.
- Palette.
- Risk / Frozen / Deprecated.
- Authority Boundary.

Possible future adjacent subroutes if later accepted by CONTROL_THREAD:

- `/operator/agents/registry`
- `/operator/agents/votes`
- `/operator/agents/palette`
- `/operator/agents/candidates`
- `/operator/agents/risk`

These future adjacent subroutes are not authorized by this artifact. They
remain route-topology candidates only.

## 8. Navigation Posture

No navigation changes are authorized by this artifact.

This artifact authorizes no top-nav changes, sidebar changes, OperatorSubnav
changes, route promotion, route creation, route removal, or redirects.

Local-only anchors/tabs are recommended for a future implementation branch if
CONTROL_THREAD accepts this decision. Those anchors/tabs should be read-only
presentation, not persistence, route-state mutation, motion-state mutation,
gate-state mutation, or action authorization.

Navigation does not authorize action.

## 9. Compatibility Posture

`/operator/agents` remains canonical.

Existing route access is preserved. Existing links remain valid. Future local
anchors/tabs should not break deep route compatibility. Future adjacent
subroutes require separate CONTROL_THREAD route-topology acceptance.

Any future implementation should treat local navigation as a scanability aid
only. It should not change the accepted source data, route semantics, Agent
authority posture, vote authority posture, Palette recommendation posture,
project-state posture, receipt posture, or gate posture.

## 10. Risks

- Continuing to embed all surfaces may keep the page dense. Mitigation:
  implement Option C local anchors/tabs before adding more surfaces.
- Local tabs/anchors may appear interactive and must remain read-only.
  Mitigation: label them as local navigation and avoid persistence or stateful
  submission behavior.
- Splitting too early may create route sprawl. Mitigation: defer adjacent
  subroutes until `dashboard-state-index/v0` and `route/v0` references settle.
- Subroutes may imply maturity or authority if labels are weak. Mitigation:
  preserve `READ-ONLY`, `STATIC DATA`, `NOT AUTHORITY`, and `ZERO GATES
  GRANTED` labels on every future surface.
- Future developers may mistake topology recommendation for implementation
  authority. Mitigation: require a separate implementation branch and
  CONTROL_THREAD acceptance.
- Future surfaces may weaken doctrine visibility if content is hidden too
  aggressively. Mitigation: keep critical doctrine and authority rails visible
  near the top and near each relevant surface.

## 11. Deferred Work

Deferred implementation items:

- Local-only tab/anchor implementation branch.
- Possible later route split after `dashboard-state-index/v0` and `route/v0`.
- Deeper Grid alignment.
- Dedicated vote review route, if later accepted.
- Dedicated Palette recommendation route, if later accepted.
- Accessibility/density QA after local navigation.
- Route/profile reference alignment.

No deferred item is implemented by this artifact.

## 12. Non-Authorizations

This artifact does not authorize:

- execution
- runtime activation
- provider/model dispatch
- live model calls
- Agent execution
- Agent dispatch
- Agent creation
- Agent activation
- tool invocation
- GitHub integration
- GitHub API use
- route changes
- navigation changes
- redirects
- repo mutation outside docs/reference
- file mutation outside docs/reference
- branch/PR automation
- browser/desktop control
- terminal/command execution
- scheduler
- autonomous loop
- retrieval engine
- automatic context injection
- live memory writes
- hidden persistence
- live settings mutation
- new API routes
- new server actions
- DB writes
- Prisma changes
- telemetry
- auth/session changes
- customer-data handling
- production behavior
- `.jai` parser/runtime behavior
- `.jai` execution behavior
- `.nexus` active semantics
- policy enforcement
- execution gates opened
- automatic scoring
- automatic synthesis
- automatic best-agent selection
- automatic gate evaluation
- automatic profile validation
- recommendation submission
- recommendation persistence
- project-state creation
- repo-lane creation
- route creation
- vote creation
- vote submission
- receipt creation
- canon update
- route-state mutation
- motion-state mutation
- gate opening

## 13. Recommended Next Route

Recommended next route: `Agent Registry Local Surface Navigation v0`.

Recommended mode:
`REPO_EXECUTION / READ-ONLY-UI / LOCAL-SURFACE-NAVIGATION / AGENT-REGISTRY / OPERATOR-SURFACE / NO-RUNTIME / NO-EXECUTION`.

Recommended implementation scope:

- Keep `/operator/agents` canonical.
- Add local-only tabs, anchors, or in-page surface navigation.
- Preserve all accepted Agent Registry surfaces.
- Preserve static data imports.
- Preserve read-only doctrine and authority rails.
- Add no routes, redirects, API behavior, server actions, DB/Prisma behavior,
  runtime behavior, persistence, receipt creation, canon update, gate opening,
  route-state mutation, or motion-state mutation.

Alternative next route:
`dashboard-state-index/v0 + route/v0 Alignment Review`.
