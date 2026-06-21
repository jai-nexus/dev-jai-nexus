# /operator/agents route/v0 Sketch

## 1. Status

Scope: `/operator/agents route/v0 Sketch`.

Mode: `REPO_EXECUTION / DOCS-REFERENCE / ROUTE-SKETCH / OPERATOR-SURFACE / AGENT-REGISTRY / STATIC-DATA / NO-RUNTIME / NO-EXECUTION`.

Branch: `docs/q2-operator-agents-route-v0-sketch`.

Artifact status: docs/reference route/v0 sketch.

This sketch is reference-only. It is not parser-ready unless a later
CONTROL_THREAD route explicitly accepts a parser-ready object.

It grants no route creation, route promotion, route-state mutation, UI,
navigation, redirect, dashboard-state, project-state, repo-lane, receipt,
backend, runtime, Agent, Palette, vote, model/provider, GitHub/tool, branch/PR,
or gate authority.

ZERO GATES GRANTED.

## 2. Current Accepted Baseline

Accepted baseline:

- `dashboard-state-index/v0 + route/v0 Alignment Review`.
- `/operator/agents dashboard-state-index/v0 Sketch`.
- Accepted route: `/operator/agents`.
- Accepted topology: Option C - keep `/operator/agents` canonical and use
  local-only in-page navigation.

Relevant accepted surface baseline:

- `Agent Registry Read-Only Surface v0`.
- `Agent Registry Read-Only Surface v0 QA + Operator Slate Density Pass`.
- `Agent Vote Review Surface v0`.
- `Palette Agent Recommendation Surface v0`.
- `Agent Registry Local Surface Navigation v0`.

Accepted artifacts:

- `docs/reference/dashboard-state-route-alignment-review-v0.md`
- `docs/reference/operator-agents-dashboard-state-index-v0-sketch.md`

## 3. Sketch Purpose

This sketch records how `/operator/agents` could be safely represented by a
future `route/v0` object.

The sketch is not a route object. The sketch is not route creation. The sketch
is not route promotion. The sketch is not route-state mutation. The sketch is
not dashboard-state creation. The sketch is not live verification. The sketch
is not gate opening.

route/v0 represents route recommendation structure.

route/v0 does not create routes.

route/v0 does not mutate route state.

route/v0 does not dispatch Agents.

route/v0 does not execute.

route/v0 does not create branches.

route/v0 does not open PRs.

route/v0 does not create receipts.

route/v0 does not update canon.

route/v0 does not open gates.

## 4. Route Identity

Sketch fields:

- `route_id`: `operator-agents`
- `stable_display_name`: `Operator Agent Registry`
- `route_family`: `operator_agent_registry`
- `surface_family`: `agent_registry`
- `accepted_topology`: `option_c_local_in_page_navigation`
- `accepted_topology_reference`:
  `docs/reference/operator-agent-registry-route-topology-surface-split-decision-v0.md`

The route identity is a future route recommendation reference only. It does not
create a route, promote a route, mutate route state, create dashboard state,
create project state, create repo lanes, create receipts, update canon, open
gates, create Agents, activate Agents, dispatch Agents, or execute.

## 5. Route Path And Canonical Posture

Sketch fields:

- `route_path`: `/operator/agents`
- `canonical_status`: `canonical_agent_registry_route`

`/operator/agents` remains canonical. Local anchors are not routes. No adjacent
subroutes are authorized by this sketch. Any future route split requires
separate CONTROL_THREAD acceptance.

## 6. Route Kind And Surface Group

Sketch fields:

- `route_kind`: `operator_read_only_surface`
- `surface_group`: `agent_registry`

The route is read-only, static, and display-only. The route does not imply
execution, activation, dispatch, approval, recommendation submission, vote
submission, receipt creation, canon update, route-state mutation, or gate
opening.

Agent Registry display does not activate Agents.

Palette display does not create Agents.

Vote display does not decide.

## 7. Navigation Mode

Sketch field:

- `navigation_mode`: `local_static_fragment_anchors`

Local anchors preserve compatibility. Anchors are not route records. Anchors do
not create route state. Anchors do not persist workflow state. Anchors do not
authorize action.

Navigation does not authorize action.

Route promotion does not open gates.

## 8. Local Anchor Groups

Sketch field:

- `local_anchor_groups`

Current local anchor groups:

- Overview.
- Registry.
- Domain Engines.
- Polyrepo Scope.
- Service Domains.
- Candidates.
- Votes.
- Palette.
- Risk / Frozen.
- Authority Boundary.

Anchor groups are display organization only. Anchor groups do not authorize
action. Anchor groups do not create routes. Anchor groups do not mutate route
state.

## 9. Static Data Sources

Sketch field:

- `static_data_sources`

Accepted static data source references:

- `portal/src/data/operator/agentRegistry/`
- `portal/src/data/operator/agentRegistry/roleTemplates.ts`
- `portal/src/data/operator/agentRegistry/domainEngines.ts`
- `portal/src/data/operator/agentRegistry/repoDomainScope.ts`
- `portal/src/data/operator/agentRegistry/projectAgentCandidates.ts`
- `portal/src/data/operator/agentRegistry/paletteRecommendations.ts`
- `portal/src/data/operator/agentRegistry/agentVotes.ts`
- `portal/src/data/operator/agentRegistry/index.ts`

These are static source references only. There is no live fetch, runtime
verification, persistence, mutation, hidden storage, API call, server action,
DB/Prisma read/write, provider/model call, GitHub/tool integration, or Agent
dispatch.

## 10. Source Artifacts

Sketch field:

- `source_artifacts`

Source artifacts:

- `source`: `docs/reference/dashboard-state-route-alignment-review-v0.md`
- `source`: `docs/reference/operator-agents-dashboard-state-index-v0-sketch.md`
- `unresolved_reference`: `docs/specs/profiles/dashboard-state-index-v0.md`
- `unresolved_reference`: `docs/specs/profiles/route-v0.md`
- `unresolved_reference`: `docs/specs/profiles/project-state-v0.md`
- `unresolved_reference`: `docs/specs/profiles/receipt-v0.md`
- `unresolved_reference`: `docs/specs/profiles/agent-role-template-v0.md`
- `unresolved_reference`: `docs/specs/profiles/agent-registry-entry-v0.md`
- `unresolved_reference`: `docs/specs/profiles/agent-domain-engine-v0.md`
- `unresolved_reference`: `docs/specs/profiles/agent-set-recommendation-v0.md`
- `unresolved_reference`: `docs/specs/profiles/project-agent-candidate-v0.md`
- `unresolved_reference`: `docs/specs/profiles/agent-vote-v0.md`
- `source`:
  `docs/reference/operator-agent-registry-route-topology-surface-split-decision-v0.md`
- `source`: `docs/reference/polyrepo-agent-registry-static-data-v0.md`

The `docs/specs/profiles/*` paths above were not present in the local repo at
the time of this sketch. They are recorded as unresolved references because the
accepted route names them as profile drafts or likely follow-up profiles. This
sketch does not infer content from missing files.

## 11. Route Authority Boundary

Sketch fields:

- `route_authority_boundary`: `display_only_non_authorizing`
- `non_authorizations`
- `requires_control_thread_review`: `true`

CONTROL_THREAD decides.

route/v0 does not create routes.

route/v0 does not mutate route state.

Navigation does not authorize action.

Route promotion does not open gates.

Agent Registry display does not activate Agents.

Palette display does not create Agents.

Vote display does not decide.

receipt records.

acceptance decides.

ZERO GATES GRANTED.

## 12. Gate Posture

Sketch field:

- `gate_posture`: `closed`

ZERO GATES GRANTED.

No execution gates opened. No Agent gates opened. No route gates opened. No
dashboard activation gates opened. No branch/PR authority opened. No
recommendation gates opened. No vote progression gates opened. No receipt/canon
gates opened.

## 13. Non-Authorizations

This artifact does not authorize:

- execution
- runtime activation
- provider/model dispatch
- live model calls
- Agent execution
- Agent dispatch
- Agent creation
- Agent activation
- Agent instantiation
- tool invocation
- model calls
- GitHub integration
- GitHub API use
- route changes
- route creation
- route promotion
- route-state mutation
- navigation changes
- redirects
- UI changes
- repo mutation outside docs/reference
- file mutation outside docs/reference
- branch creation
- PR creation
- push
- merge
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
- dashboard state creation
- dashboard activation
- project-state creation
- repo-lane creation
- vote creation
- vote submission
- receipt creation
- canon update
- motion-state mutation
- gate opening

## 14. Dashboard-State-Index Relationship

Sketch field:

- `dashboard_state_index_ref`:
  `docs/reference/operator-agents-dashboard-state-index-v0-sketch.md`

`route/v0` may reference `dashboard-state-index/v0` posture. `route/v0` does
not create dashboard state. `route/v0` does not activate dashboards. `route/v0`
does not create dashboard surfaces. `route/v0` does not mutate dashboard state.

Dashboard display does not authorize.

## 15. Project-State Relationship

Sketch field:

- `project_state_ref`: `unresolved_reference_or_future_profile`

`route/v0` may reference `project-state/v0` posture. `route/v0` does not create
project state. `route/v0` does not accept project state. `route/v0` does not
mutate project state.

Project-state references are static/review context only unless separately
accepted by CONTROL_THREAD.

## 16. Receipt Relationship

Sketch field:

- `receipt_ref`: `unresolved_reference_or_future_profile`

`route/v0` may reference `receipt/v0` posture. `route/v0` does not create
receipts.

receipt records.

acceptance decides.

CONTROL_THREAD decides.

## 17. Agent Registry Relationship

`route/v0` may reference Agent Registry display posture. `route/v0` does not
create Agents. `route/v0` does not activate Agents. `route/v0` does not
dispatch Agents. `route/v0` does not open gates.

Static Agent Registry display remains non-executing. Agent Registry display
does not activate Agents. Palette display does not create Agents. Vote display
does not decide.

## 18. Open Gaps

Sketch field:

- `open_gaps`

Open gaps:

- no formal parser-ready `route/v0` object.
- no route-state mutation authorized.
- no live route verification.
- no accepted route-state storage.
- no accepted staleness policy.
- no adjacent subroute decision accepted.
- no profile-backed route index.
- no local navigation accessibility QA receipt accepted.
- no parser-ready dashboard-state-index object yet.
- no formal route/profile linkage for local anchors beyond this sketch.

## 19. Staleness Notes

Sketch field:

- `staleness_notes`

This route sketch is static and may become stale. Route posture should carry a
review timestamp or receipt reference later after those concepts are accepted.
Static data should not be treated as live verification. A future `route/v0`
object should include source artifact references and staleness posture.

No live runtime verification is performed by this sketch.

## 20. Recommended Next Route

Recommended next route: `Agent Registry Local Surface Navigation Accessibility QA v0`.

Recommended mode:
`REPO_EXECUTION / READ-ONLY-UI / ACCESSIBILITY-QA / LOCAL-NAVIGATION / OPERATOR-SLATE / AGENT-REGISTRY / NO-RUNTIME / NO-EXECUTION`.

Recommended scope:

- Review local anchor navigation accessibility and scanability.
- Preserve `/operator/agents` as canonical.
- Preserve no-runtime and no-execution boundaries.
- Do not create routes, mutate route state, alter global navigation, add
  redirects, create dashboard state, create project state, create repo lanes,
  create receipts, update canon, open gates, or authorize Agent execution or
  dispatch.

Alternative next route: `Static Agent Registry Staleness Policy v0`.

Optional future route: `/operator/agents parser-ready dashboard-state-index/v0 Object Draft`.
