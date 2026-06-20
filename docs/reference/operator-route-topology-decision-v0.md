# Operator Route Topology Decision v0

## 1. Title And Decision Posture

Scope: Operator Route Topology Decision v0 for `dev.jai.nexus`.

Mode: `REPO_EXECUTION / DOCS-REFERENCE / ROUTE-TOPOLOGY-DECISION / INFORMATION-ARCHITECTURE / NO-RUNTIME / NO-EXECUTION`.

Branch: `docs/q2-operator-route-topology-decision-v0`.

Artifact status: decision/reference artifact for CONTROL_THREAD review.

This artifact recommends Operator route topology. It does not implement route
changes, redirect routes, remove routes, remove navigation, promote routes in
code, add backend behavior, activate runtime behavior, alter UI files, alter
route files, alter navigation files, or alter package/dependency files.

Route topology is not execution authority. Navigation does not authorize action.
Route promotion does not open gates. ZERO GATES GRANTED.

## 2. Current Baseline

`dev-jai-nexus` has accepted these Operator cockpit and readiness lanes:

- Control Plane Static Prototype v0.
- Control Plane Cockpit Sync v0.
- Closeout Intake Composer v0.
- Operator Prototype Import Batch v0.
- Operator Security Gate Model v0.
- Operator Slate Primitive Extraction v0.
- Operator Slate Page Upgrade Sweep v0.
- Operator Slate Consistency + Development Readiness Sweep v0.
- dev.jai.nexus Live-Readiness Staging v0.
- dev.jai.nexus Operator Activation Spine v0.

The current cockpit has Operator Slate visual language, readiness surfaces,
canonical read-only source labels, JAI/Council readiness, Agent readiness,
Palette/Grid posture, development-work compose posture, and `.jai / receipt /
gate` dependency planning. The unresolved bottleneck is route topology.

## 3. Decision Questions

### Question 1: Operator Root

Decision: keep `/operator` as the primary Operator entry point for now.

`/operator` is already labeled as the primary entry in the activation-spine
reference and acts as the orientation route. It should become the stable
Operator launchpad/hub until CONTROL_THREAD accepts a stronger cockpit
promotion. It should not become the live dashboard yet because live-dashboard
language still carries activation risk while execution remains blocked.

`/operator/live-dashboard` remains the future primary cockpit candidate.
`/operator/control-plane` remains a control center and authority-adjacent
surface. `/operator` should not become a specialized authority surface because
the root should orient before it controls.

### Question 2: Live Dashboard

Decision: keep `/operator/live-dashboard` as `SECONDARY`, `PROTOTYPE`, and
`PENDING DECISION`.

The route has value as a live-readiness cockpit prototype and as a candidate for
future primary cockpit behavior. It overlaps with control plane by presenting
readiness, gates, route posture, and canonical state. It should not be promoted
while "live" could be misread as live execution, live model calls, live Agent
dispatch, live retrieval, or live gate state.

If promoted later, it should be renamed or relabeled carefully so dashboard
display does not imply authorization.

### Question 3: Control Plane

Decision: keep `/operator/control-plane` as `CONTROL` and
authority-adjacent cockpit surface.

The route is the strongest CONTROL_THREAD-adjacent cockpit candidate because it
contains or connects Control Plane Cockpit Sync v0, Closeout Intake Composer v0,
the Security Gate Model panel, LiveReadinessMatrix, RouteTopologyReadiness,
CanonicalReadOnlySpine, and activation-spine posture.

It should coexist with `/operator/live-dashboard`. The control plane should hold
authority posture, gate posture, closeout intake, and decision-adjacent review.
The live dashboard should remain a broader operational overview until route
promotion is accepted.

### Question 4: Council Route

Decision: keep `/operator/council-prototype` as `PROTOTYPE` and
`PENDING DECISION`; defer `/operator/council`.

The current route is clearly a Council prototype/readiness surface. It connects
to JAI/Council readiness, model-slot readiness, Council lifecycle readiness,
advisory returns, dissent visibility, and contradiction visibility. Promoting it
to `/operator/council` before Council route semantics are settled risks implying
live model dispatch, automatic synthesis, or Council authority.

Future `/operator/council` is reasonable after advisory semantics, model-slot
claims, receipt expectations, and dispatch boundaries are accepted.

### Question 5: Design System Route

Decision: keep `/operator/design-system` visible as `SECONDARY` and
`REFERENCE` for now.

The route is valuable while Operator Slate is still being applied across
readiness and cockpit surfaces. It documents internal style, green-usage,
action taxonomy, blocked/gated language, and no-activation patterns. The risk is
subnav clutter, not runtime authority.

After route roles are accepted, it could move under a reference/development
cluster or become hidden-but-accessible. Do not remove it now.

### Question 6: DCT Route

Decision: keep `/operator/dct` visible as `LEGACY` and `COMPATIBILITY`.

DCT currently preserves decision/context tooling access and has relationship to
Deliberation, Motions, and Decisions. It is not clearly canonical for the new
Operator Slate spine, but removing it before a replacement is accepted risks
breaking existing workflows. Retaining it without compatibility labeling risks
confusion.

Future alignment should label DCT as compatibility or move it into a reference
or legacy cluster once replacement posture is explicit.

### Question 7: Legacy Top Navigation

Decision: keep GlobalNav as-is for compatibility in this decision branch.

Current GlobalNav labels are `Sync Runs`, `Repos`, `Domains`, `Events`, and
`Operator`, with `Operator` linking to `/operator/events` and matching the
`/operator` prefix. Top-level `/repos`, `/domains`, and `/events` still exist.
OperatorSubnav separately lists Operator views.

The global top nav should remain available until CONTROL_THREAD accepts how
legacy surfaces map into Operator Slate. A future implementation branch may
reduce or retarget it, but this decision does not implement navigation changes.

### Question 8: Phase-Clustered Navigation

Decision: defer phase-clustered navigation until after route-role acceptance.

Potential clusters:

- Cockpit: `/operator`, `/operator/control-plane`, `/operator/live-dashboard`.
- Work: `/operator/work`, `/operator/work/new`, `/operator/work/[id]`.
- JAI: `/operator/jai`, `/operator/council-prototype`.
- Agents: `/operator/agents`.
- Knowledge / Context: `/operator/grid`, `/operator/corpus`,
  `/operator/operating-context`, `/operator/chats`.
- Evidence / Decisions: `/operator/motions`, `/operator/decisions`,
  `/operator/events`, `/operator/deliberation`, `/operator/waves`.
- Registry / Infrastructure: `/operator/repos`, `/operator/registry/repos`,
  `/operator/registry/domains`, `/operator/sync-runs/[syncRunId]/review`.
- Reference / Design: `/operator/design-system`, `/operator/dct`.

Phase clustering should be implemented later, not in this branch. It needs
accepted route roles first so grouping does not become an accidental promotion.

### Question 9: Route Status Taxonomy

Decision: use the taxonomy defined in section 5.

The taxonomy should distinguish primary entry, control authority posture,
canonical/read-only state, compose-only work, prototypes, references, legacy
compatibility, hidden-but-accessible routes, pending decisions, blocked routes,
and not-found routes.

### Question 10: Recommended Topology

Decision: accept the conservative topology:

- Keep `/operator` as `PRIMARY` entry and launchpad.
- Keep `/operator/control-plane` as `CONTROL` and authority-adjacent cockpit.
- Keep `/operator/live-dashboard` as `SECONDARY`, `PROTOTYPE`, and
  `PENDING DECISION`.
- Keep `/operator/council-prototype` as `PROTOTYPE` and `PENDING DECISION`.
- Keep `/operator/design-system` as `SECONDARY` and `REFERENCE`.
- Keep `/operator/dct` visible as `LEGACY` and `COMPATIBILITY`.
- Keep legacy top nav available for compatibility.
- Defer phase-clustered navigation until after this route-role decision is
  accepted.
- Keep registry, sync-run review, panel detail, work detail, and legacy routes
  compatibility-accessible.
- Do not route-promote anything in this branch.

### Question 11: Future Implementation Route

Recommended follow-up branch after CONTROL_THREAD acceptance:

`Operator Route Topology Alignment v0`

Suggested mode:

`REPO_EXECUTION / UI-ROUTE-LABELING / NAV-CLARITY / COMPATIBILITY-PRESERVING / NO-RUNTIME / NO-EXECUTION`

Possible implementation scope:

- Update route labels.
- Update route descriptions.
- Update OperatorSubnav grouping or ordering if accepted.
- Preserve compatibility routes and access.
- Avoid destructive redirects.
- Avoid route removal unless explicitly accepted.
- Avoid runtime activation.

This artifact does not implement that follow-up.

## 4. Route Inventory And Status Map

| Route | Observed file path | Existence | Current inferred role | Recommended status | Visibility / disposition | Future implementation notes |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `portal/src/app/page.tsx` | `FOUND` | Sync runs root / legacy operational landing | `LEGACY`, `COMPATIBILITY` | Keep compatibility-accessible | Do not treat as Operator root without separate decision. |
| `/operator` | `portal/src/app/operator/page.tsx` | `FOUND` | Operator entry and orientation | `PRIMARY`, `CANONICAL`, `PENDING DECISION` | Visible primary entry | Keep as launchpad until live cockpit promotion is accepted. |
| `/operator/control-plane` | `portal/src/app/operator/control-plane/page.tsx` | `FOUND` | Control center and authority-adjacent cockpit | `CONTROL`, `SECONDARY`, `READ-ONLY CANONICAL` | Visible | Keep as CONTROL_THREAD-adjacent surface. |
| `/operator/live-dashboard` | `portal/src/app/operator/live-dashboard/page.tsx` | `FOUND` | Live-readiness cockpit prototype | `SECONDARY`, `PROTOTYPE`, `PENDING DECISION` | Visible | Do not promote until "live" semantics are accepted. |
| `/operator/design-system` | `portal/src/app/operator/design-system/page.tsx` | `FOUND` | Operator Slate internal reference | `REFERENCE`, `SECONDARY` | Visible for now | Later move to Reference / Design cluster or hidden-but-accessible. |
| `/operator/council-prototype` | `portal/src/app/operator/council-prototype/page.tsx` | `FOUND` | Council advisory prototype | `PROTOTYPE`, `PENDING DECISION` | Visible for now | Consider `/operator/council` only after semantics are accepted. |
| `/operator/jai` | `portal/src/app/operator/jai/page.tsx` | `FOUND` | JAI readiness and context surface | `SECONDARY`, `READ-ONLY CANONICAL`, `PENDING DECISION` | Visible | Keep non-runtime labels; connect to future JAI profile decisions. |
| `/operator/agents` | `portal/src/app/operator/agents/page.tsx` | `FOUND` | Staged Agent readiness | `SECONDARY`, `READ-ONLY CANONICAL`, `BLOCKED IN V0` | Visible | Keep Agents staged, not executing. |
| `/operator/grid` | `portal/src/app/operator/grid/page.tsx` | `FOUND` | Palette/Grid operational-state and context surface | `SECONDARY`, `COMPOSE-ONLY`, `READ-ONLY CANONICAL` | Visible | Clarify Grid display vs execution in future grouping. |
| `/operator/work` | `portal/src/app/operator/work/page.tsx` | `FOUND` | Development work queue and compose surface | `SECONDARY`, `COMPOSE-ONLY`, `READ-ONLY CANONICAL` | Visible | Keep compose-only; no GitHub/repo action. |
| `/operator/work/new` | `portal/src/app/operator/work/new/page.tsx` | `FOUND` | Work intake / draft creation surface | `COMPOSE-ONLY`, `SECONDARY` | Visible or Work-cluster child | Preserve compose boundary. |
| `/operator/work/[id]` | `portal/src/app/operator/work/[id]/page.tsx` | `FOUND` | Work detail surface | `READ-ONLY CANONICAL`, `COMPOSE-ONLY` | Compatibility-accessible child | Keep linked from work; avoid primary subnav clutter. |
| `/operator/repos` | `portal/src/app/operator/repos/page.tsx` | `FOUND` | Repo registry read surface | `READ-ONLY CANONICAL`, `SECONDARY` | Visible | Keep distinct from registry admin/import routes. |
| `/operator/repos/[repoId]` | `portal/src/app/operator/repos/[repoId]/page.tsx` | `FOUND` | Repo detail read/compose surface | `READ-ONLY CANONICAL`, `COMPOSE-ONLY` | Compatibility-accessible child | Keep detail route accessible from repo list. |
| `/operator/portfolio-status` | `portal/src/app/operator/portfolio-status/page.tsx` | `FOUND` | Portfolio readiness/status view | `READ-ONLY CANONICAL`, `SECONDARY` | Visible | Consider Work or Cockpit cluster later. |
| `/operator/motions` | `portal/src/app/operator/motions/page.tsx` | `FOUND` | Motion package browser | `READ-ONLY CANONICAL`, `SECONDARY` | Visible | Keep evidence/decision cluster candidate. |
| `/operator/decisions` | `portal/src/app/operator/decisions/page.tsx` | `FOUND` | Extracted decision records | `READ-ONLY CANONICAL`, `SECONDARY` | Visible | Keep evidence/decision cluster candidate. |
| `/operator/events` | `portal/src/app/operator/events/page.tsx` | `FOUND` | Operator event stream | `READ-ONLY CANONICAL`, `SECONDARY` | Visible | GlobalNav currently points Operator here; future retarget requires decision. |
| `/operator/chats` | `portal/src/app/operator/chats/page.tsx` | `FOUND` | Chat/readiness context surface | `SECONDARY`, `READ-ONLY CANONICAL` | Visible or Knowledge child | Cluster under Knowledge / Context later. |
| `/operator/chats/[id]` | `portal/src/app/operator/chats/[id]/page.tsx` | `FOUND` | Chat detail surface | `READ-ONLY CANONICAL` | Hidden-but-accessible child | Keep linked from chats. |
| `/operator/deliberation` | `portal/src/app/operator/deliberation/page.tsx` | `FOUND` | Deliberation/advisory workflow | `SECONDARY`, `COMPOSE-ONLY` | Visible | Cluster with Evidence / Decisions later. |
| `/operator/waves` | `portal/src/app/operator/waves/page.tsx` | `FOUND` | Wave/session overview | `SECONDARY`, `READ-ONLY CANONICAL` | Visible | Consider Evidence / Decisions or Work cluster. |
| `/operator/waves/[sessionId]` | `portal/src/app/operator/waves/[sessionId]/page.tsx` | `FOUND` | Wave/session detail | `READ-ONLY CANONICAL` | Hidden-but-accessible child | Keep linked from waves. |
| `/operator/corpus` | `portal/src/app/operator/corpus/page.tsx` | `FOUND` | Corpus/source posture surface | `SECONDARY`, `READ-ONLY CANONICAL` | Visible | Cluster under Knowledge / Context. |
| `/operator/operating-context` | `portal/src/app/operator/operating-context/page.tsx` | `FOUND` | Operating context posture | `SECONDARY`, `READ-ONLY CANONICAL` | Visible | Cluster under Knowledge / Context. |
| `/operator/dct` | `portal/src/app/operator/dct/page.tsx` | `FOUND` | Decision/context tooling compatibility surface | `LEGACY`, `COMPATIBILITY` | Visible for now | Retain until replacement is accepted. |
| `/operator/sync-runs/[syncRunId]/review` | `portal/src/app/operator/sync-runs/[syncRunId]/review/page.tsx` | `FOUND` | Sync-run review route | `READ-ONLY CANONICAL`, `COMPATIBILITY` | Hidden-but-accessible child | Keep linked from sync-run flows. |
| `/operator/registry/repos` | `portal/src/app/operator/registry/repos/page.tsx` | `FOUND` | Registry repo admin/import surface | `CONTROL`, `COMPATIBILITY`, `BLOCKED IN V0` | Compatibility-accessible; not primary | Label as pre-existing mutation-capable if surfaced. |
| `/operator/registry/repos/new` | `portal/src/app/operator/registry/repos/new/page.tsx` | `FOUND` | Registry repo creation form | `CONTROL`, `COMPATIBILITY`, `BLOCKED IN V0` | Hidden-but-accessible child | Preserve access; avoid new authorization. |
| `/operator/registry/repos/[id]` | `portal/src/app/operator/registry/repos/[id]/page.tsx` | `FOUND` | Registry repo detail/edit surface | `CONTROL`, `COMPATIBILITY`, `BLOCKED IN V0` | Hidden-but-accessible child | Preserve access; label mutation posture if grouped. |
| `/operator/registry/domains/new` | `portal/src/app/operator/registry/domains/new/page.tsx` | `FOUND` | Registry domain creation form | `CONTROL`, `COMPATIBILITY`, `BLOCKED IN V0` | Hidden-but-accessible child | Preserve access; not primary. |
| `/operator/registry/domains/[id]` | `portal/src/app/operator/registry/domains/[id]/page.tsx` | `FOUND` | Registry domain detail/edit surface | `CONTROL`, `COMPATIBILITY`, `BLOCKED IN V0` | Hidden-but-accessible child | Preserve access; not primary. |
| `/operator/panels/[motionId]/[panelId]` | `portal/src/app/operator/panels/[motionId]/[panelId]/page.tsx` | `FOUND` | Panel detail route | `READ-ONLY CANONICAL`, `HIDDEN-BUT-ACCESSIBLE` | Hidden-but-accessible child | Keep detail route; do not expose as primary nav. |
| `/repos` | `portal/src/app/repos/page.tsx` | `FOUND` | Legacy/global repos route | `LEGACY`, `COMPATIBILITY` | Global top-nav visible | Preserve until legacy nav decision. |
| `/domains` | `portal/src/app/domains/page.tsx` | `FOUND` | Legacy/global domains route | `LEGACY`, `COMPATIBILITY` | Global top-nav visible | Preserve until legacy nav decision. |
| `/events` | `portal/src/app/events/page.tsx` | `FOUND` | Legacy/global events route | `LEGACY`, `COMPATIBILITY` | Global top-nav visible | Preserve until legacy nav decision. |

No requested route in the inventory is `NOT FOUND`. `/operator/council` was
considered in the decision questions but is not present in the repository and
is not created by this artifact.

## 5. Route Status Taxonomy

`PRIMARY`: main entry route for the Operator experience.

`SECONDARY`: visible route that supports the primary route without replacing it.

`CANONICAL`: accepted route for a named Operator concept or workflow.

`CONTROL`: authority-adjacent route for review, gate posture, registry posture,
or CONTROL_THREAD-adjacent operations. Control is not execution authority.

`READ-ONLY CANONICAL`: route displays accepted or stored state without write,
acceptance, execution, or gate authority.

`COMPOSE-ONLY`: route or action can draft/copy local text only. It does not
submit, persist, dispatch, mutate, create receipts, or update canon.

`PROTOTYPE`: route represents a prototype/readiness surface and must not imply
production, live runtime, or acceptance.

`REFERENCE`: internal reference route for design, taxonomy, style, doctrine, or
readiness language.

`LEGACY`: route or nav item from an earlier surface model that remains available
for continuity.

`COMPATIBILITY`: route remains accessible to avoid breaking existing workflows,
links, or review paths.

`HIDDEN-BUT-ACCESSIBLE`: route should not be primary navigation, but should
remain reachable by direct links or parent route flows.

`PENDING DECISION`: route role, promotion, rename, grouping, or visibility needs
CONTROL_THREAD acceptance before implementation.

`BLOCKED IN V0`: route or capability is visibly unavailable for activation,
execution, dispatch, mutation, or gate opening in v0.

`NOT FOUND`: route requested or considered but no matching repository route file
was found. Do not create it without a future implementation decision.

## 6. Recommended Topology

| Route | Recommended role | Recommended visibility | Rationale | Future implementation note |
| --- | --- | --- | --- | --- |
| `/operator` | `PRIMARY`, `CANONICAL` | Primary entry | Stable launchpad avoids premature live-dashboard promotion. | Strengthen root hub copy after decision acceptance. |
| `/operator/control-plane` | `CONTROL`, `SECONDARY` | Visible | Best CONTROL_THREAD-adjacent cockpit and gate posture surface. | Keep authority-adjacent, not execution-authorizing. |
| `/operator/live-dashboard` | `SECONDARY`, `PROTOTYPE`, `PENDING DECISION` | Visible | Future cockpit candidate, but live naming risks confusion. | Reassess promotion after route semantics and gates are accepted. |
| `/operator/council-prototype` | `PROTOTYPE`, `PENDING DECISION` | Visible for now | Advisory-only Council readiness is not live Council runtime. | Consider `/operator/council` later. |
| `/operator/design-system` | `REFERENCE`, `SECONDARY` | Visible for now | Useful internal Slate/reference route during migration. | Later move to Reference / Design cluster or hidden access. |
| `/operator/dct` | `LEGACY`, `COMPATIBILITY` | Visible for now | Existing decision/context workflows need continuity. | Label compatibility and decide replacement later. |
| Global top nav | `LEGACY`, `COMPATIBILITY` | Keep as-is | Top-level routes still exist and preserve access. | Reduce or retarget only after accepted migration plan. |
| Detail/admin child routes | `HIDDEN-BUT-ACCESSIBLE`, `COMPATIBILITY` | Parent-linked/direct | Avoid primary nav clutter while preserving workflows. | Keep accessible; label mutation-capable admin paths where relevant. |
| Phase clusters | `PENDING DECISION` | Deferred | Good fit after roles are accepted; premature now. | Implement in future alignment branch only. |

## 7. Rejected Interpretations

- Route topology is not execution authority.
- Navigation changes do not authorize action.
- Route promotion does not open gates.
- Live-dashboard naming does not imply live execution.
- Control-plane visibility does not imply authority to execute.
- Council route readiness does not imply model dispatch.
- Agent route readiness does not imply Agent execution.
- Palette/Grid visibility does not imply retrieval, injection, memory write, or
  execution.
- Development compose visibility does not imply GitHub integration, branch
  creation, PR creation, push, merge, repo/file mutation, receipt creation,
  canon update, or commit automation.

## 8. Deferred Implementation Items

- Route label updates.
- Route description updates.
- OperatorSubnav grouping or ordering.
- Phase-clustered navigation.
- Possible route renames or promotions.
- Possible `/operator/council` route.
- Possible live-dashboard promotion.
- Possible design-system visibility change.
- Possible DCT visibility change.
- Legacy top-nav reduction or retargeting.
- Compatibility route treatment.
- Hidden-but-accessible detail/admin route treatment.
- Registry/admin mutation posture labels where applicable.

## 9. Required Doctrine Language

Route topology is not execution authority.

Navigation does not authorize action.

Route promotion does not open gates.

Dashboard display does not authorize.

CONTROL_THREAD decides.

Validation is not acceptance.

Receipts record; they do not decide.

Routes recommend; they do not execute.

Council agreement is not authority.

Agents are staged, not executing.

ZERO GATES GRANTED.

## 10. Required Non-Authorizations

This decision does not authorize execution, runtime activation, provider/model
dispatch, live model calls, Agent execution, Agent dispatch, GitHub integration,
GitHub API use, repo mutation, file mutation, branch creation, PR creation,
push, merge, commit automation, branch/PR automation, browser/desktop control,
terminal/command execution, scheduler, autonomous loop, retrieval engine,
automatic context injection, live memory writes, hidden persistence, live
settings mutation, new API routes, new server actions, DB writes, Prisma
changes, telemetry, auth/session changes, localStorage/sessionStorage as system
of record, customer-data handling, production behavior, `.jai` parser/runtime
behavior, `.jai` execution behavior, `.nexus` active semantics, policy
enforcement, execution gates opened, automatic scoring, automatic synthesis,
automatic best-agent selection, automatic gate evaluation, automatic profile
validation, receipt creation, canon update, route-state mutation, motion-state
mutation, route removal, destructive redirect, or navigation removal.

ZERO GATES GRANTED.

## 11. Validation Plan

Validation for this artifact:

- `git diff --check`.
- Confirm only `docs/reference/operator-route-topology-decision-v0.md` changed,
  unless an existing reference index with a clear pattern is updated.
- Confirm no route files changed.
- Confirm no navigation files changed.
- Confirm no UI files changed.
- Confirm no backend/API/DB/Prisma/provider/model/Agent/GitHub behavior changed.
- Confirm no package/dependency changes.
- Confirm no route topology changed in code.

No `docs/reference/README.md` exists in this repository, so no reference index
was updated.
