# Q3M7Y26-P1 A10 Founder Workflow and Surface Map v0

Role: JAI::DEV::BUILDER

## 1. Status, control coordinates, cutoff, and evidence ceiling

| Field | Value |
| --- | --- |
| Program | `Q3M7Y26-P1` |
| Batch | `A - Accepted Main-State Reconciliation` |
| Wave | `A-C` |
| Lane | `A10 - Founder Workflow and Surface Map v0` |
| Coordinate | `Q3M7Y26-P1:A10` |
| Route | `CT-2026-07-23-Q3M7Y26-P1-START-A10-FOUNDER-WORKFLOW-SURFACE-MAP-v0` |
| Work Packet | `Q3M7Y26-P1-A10-v0` |
| Delivery role | `JAI::DEV::BUILDER` |
| Repository | `jai-nexus/dev-jai-nexus` |
| Required base | `1efc6a29fe69629800db50ec1ab710eabb41d69e` |
| Branch | `docs/q3m7y26-p1-a10-founder-workflow-surface-map-v0` |
| Allowlist | `docs/reference/q3m7y26-p1-a10-founder-workflow-surface-map-v0.md` |
| Source cutoff | `2026-07-23T02:07:39Z` |
| Inspection mode | `REPOSITORY_SOURCE_AND_TEST / ACCEPTED_FOUNDER_REPORT / NO_NEW_BROWSER / NO_RUNTIME / NO_DATABASE_ACCESS` |
| Founder live-inspection evidence | `2026-07-22 / PHASE_SPECIFIC_FOUNDER_OBSERVATION / RUNNING_OBSERVED_UI_ONLY / DEPLOYED_SHA_UNAVAILABLE / NO_MUTATION_OBSERVED / NOT_CURRENT_MAIN_PROOF` |
| Linear mirror | `JAI-192 / MIRROR_ONLY / NOT_MUTATED` |
| Evidence ceiling | `DOCUMENTATION_FOUNDER_WORKFLOW_SURFACE_MAP_ONLY` |
| Artifact posture | `ROUTED_CURRENT / UNCOMMITTED / NOT_INDEPENDENTLY_VERIFIED / NOT_ACCEPTED` |

This map is an immutable-source-grounded inventory of the founder-facing
application topology at the required base. It does not assert that the base is
currently deployed. It records repository implementation, focused-test
contracts, phase-specific observations, inference, and unavailable runtime
evidence as separate classes. CONTROL_THREAD supplied and accepted a founder
live-inspection report dated 2026-07-22 at the exact bounded posture recorded
above; no additional browser inspection or visible control exercise occurred
while authoring this artifact. `NO_MUTATION_OBSERVED` records only what was
visible in that report and is not evidence of database, network, filesystem,
provider, or other external-effect absence. The report did not expose a
deployed SHA and therefore cannot identify current-main behavior.

## 2. Source priority and evidence classification

### 2.1 Source priority

| Rank | Source class | A2 posture | Permitted use |
| ---: | --- | --- | --- |
| 1 | Current A10 Work Packet | `ACCEPTED_CURRENT / WORKFLOW_ONLY` | Exact route, role, base, sole-path scope, validation, Draft-PR delivery, and non-authorizations. |
| 2 | [A2] | `ACCEPTED_CURRENT` | Controlling precedence, freshness, contradiction, supersession, status, relation, and unavailable-evidence rules. |
| 3 | [A4], [A5], [A6], [A7], [A8], and [A9] | Source-specific `ACCEPTED_CURRENT`, `RATIFIED_PHASE_SPECIFIC`, `STATIC_CONFIGURATION`, `MIRROR_ONLY`, or `UNAVAILABLE` | Program state, route history, D2-D8 evidence ceilings, coordinate, delivery, role, and capability provenance. |
| 4 | Current source and focused tests at `1efc6a29fe69629800db50ec1ab710eabb41d69e` | `STATIC_CONFIGURATION` | Exact route, component, state, copy, guard, adapter, test, and explicit non-effect declarations. |
| 5 | Phase-specific founder observation evidence indexed by [A4], [A6], [A7], and [A9], plus the accepted 2026-07-22 founder live-inspection report | `RATIFIED_PHASE_SPECIFIC` or `MIRROR_ONLY` | Only the named preview/head/session or report date, observation event, and accepted evidence ceiling; the 2026-07-22 report is `RUNNING_OBSERVED_UI_ONLY / DEPLOYED_SHA_UNAVAILABLE / NO_MUTATION_OBSERVED / NOT_CURRENT_MAIN_PROOF`. |
| 6 | Linear `JAI-192` | `MIRROR_ONLY` | Coordination label only; no source-of-truth, route, acceptance, or currentness effect. |
| 7 | Inference or missing direct evidence | `UNRESOLVED`, `DEFERRED`, or `UNAVAILABLE` | Explicit hypothesis or evidence gap only. |

### 2.2 Classification rules

| Evidence class | Required classification | Rule |
| --- | --- | --- |
| Current repository implementation | `STATIC_CONFIGURATION` | Source presence proves only that the named code path exists at the required base. |
| Focused behavioral test | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | A passing test proves only the deterministic subjects and assertions named by that test. |
| Founder observation | `RATIFIED_PHASE_SPECIFIC` or `MIRROR_ONLY` | The observation remains bound to its exact preview/head/session or accepted report date and ceiling. `DEPLOYED_SHA_UNAVAILABLE` prevents attribution to current main. |
| Current deployed behavior | `UNAVAILABLE` unless direct deployed-SHA evidence exists | Repository main, CI, PR, merge, and Vercel metadata are not substituted for a visible deployed SHA and direct observation. |
| Persistence, provider, network, filesystem, or clipboard effect | `UNRESOLVED` or `UNAVAILABLE` unless directly observed under a separate route | Source declarations and test doubles do not prove environment availability or completed effects. |
| Customer behavior | `DEFERRED` or `UNAVAILABLE` | Founder-only UI and translation hypotheses do not establish customer access, tenancy, safety, or readiness. |
| Linear state | `MIRROR_ONLY` | Linear does not override repository or HUMAN_OPERATOR/CONTROL_THREAD authority. |

The only relations used below are A2 relations: `supersedes`, `narrows`,
`phase-bounds`, `corrects`, `records-later-event`, and
`does-not-supersede`. Claims are normalized to the same subject, scope, and
time before contradiction is considered. No genuine current contradiction is
asserted by this map.

The root middleware matcher re-exports the gatekeeper across the application
surface [MIDDLEWARE]. For the eventual documentary delivery, `docs/reference`
falls through to the repository rolemap default, the Role line and path are
mechanically evaluated by `role_guardrails`, and portal CI is a separate
mechanical evidence surface [ROLEMAP], [ROLE-GUARD], [PORTAL-CI]. Those checks
do not independently verify or accept A10.

## 3. Founder entry point and navigation graph

The required-base application contains 47 `page.tsx` routes grouped into 35
surface families in section 4. The shared global navigation exposes 5
destinations, the operator subnavigation exposes 17 destinations, and the
operator landing page exposes 3 primary cards. Those counts overlap; they are
navigation controls, not authority grants.

<!-- A10_NAV_START -->
| nav_edge_id | navigation mechanism | source context | destination surface_ids | repository-grounded behavior | evidence |
| --- | --- | --- | --- | --- | --- |
| `A10-NAV-001` | Unauthenticated redirect | Any protected page through the gatekeeper | `A10-SRF-001` | Pages redirect to `/login?next=<relative path>`. Protected APIs instead return JSON 401 and create no navigation edge. | [GATEKEEPER], [LOGIN-PAGE] |
| `A10-NAV-002` | Successful credential sign-in | `A10-SRF-001` | `A10-SRF-006` or the sanitized requested surface | Missing/unsafe `next` values fall back to `/operator`; successful sign-in performs a full location change. | [LOGIN-PAGE], [LOGIN-FORM] |
| `A10-NAV-003` | Shared global navigation | Root layout on protected pages | `A10-SRF-002`, `A10-SRF-003`, `A10-SRF-004`, `A10-SRF-005`, `A10-SRF-007` | Labels are Sync Runs, Repos, Domains, Events, and Operator. The Operator link targets `/operator/events`, not `/operator`. | [ROOT-LAYOUT], [GLOBAL-NAV] |
| `A10-NAV-004` | Shared operator subnavigation | Operator layout | `A10-SRF-007`, `A10-SRF-008`, `A10-SRF-009`, `A10-SRF-010`, `A10-SRF-011`, `A10-SRF-012`, `A10-SRF-013`, `A10-SRF-014`, `A10-SRF-015`, `A10-SRF-016`, `A10-SRF-017`, `A10-SRF-018`, `A10-SRF-019`, `A10-SRF-020`, `A10-SRF-021`, `A10-SRF-022`, `A10-SRF-023` | Seventeen operator destinations plus a normal Logout control; the UI explicitly states that navigation is not authority. | [OPERATOR-LAYOUT], [OPERATOR-SUBNAV], [LOGOUT] |
| `A10-NAV-005` | Operator landing cards | `A10-SRF-006` | `A10-SRF-007`, `A10-SRF-008`, `A10-SRF-010` | The landing page offers Events, Agents, and Projects as its three primary cards. | [OPERATOR-HOME] |
| `A10-NAV-006` | Root in-page links | `A10-SRF-002` | `A10-SRF-011`, `A10-SRF-013`, `A10-SRF-016`, `A10-SRF-026`, `A10-SRF-035` | Root links to Work, Deliberation, JAI, Corpus, and dynamically available sync-run review destinations. | [ROOT-PAGE] |
| `A10-NAV-007` | Admin registry links | `A10-SRF-003`, `A10-SRF-004` | `A10-SRF-031`, `A10-SRF-032` | Global read surfaces show registry-management links only to the exact admin email. | [GLOBAL-REPOS], [GLOBAL-DOMAINS] |
| `A10-NAV-008` | Direct/deep-link access | Protected URL entry | `A10-SRF-024`, `A10-SRF-025`, `A10-SRF-027`, `A10-SRF-028`, `A10-SRF-029`, `A10-SRF-030`, `A10-SRF-033`, `A10-SRF-034` | These current surfaces are not first-class destinations in the shared operator subnavigation. No static link to `/operator/motion-control` was found in the inspected app/component source. | [OPERATOR-SUBNAV], [MOTION-CONTROL-PAGE] |
<!-- A10_NAV_END -->

The graph is repository topology, not a running-session observation. Reachable
URLs, redirect success, link usability, BFCache use, and current deployment are
not inferred.

## 4. Founder surface registry

Schema: `surface_id` is the stable join key. `page_routes` is the complete
route family represented by the row. `implementation_class` describes the
current source seam. `state_or_effect_posture` distinguishes read/static,
local-shadow, and pre-existing mutation paths without claiming that any path
ran. `navigation_posture` records shared-nav visibility only.

<!-- A10_SURFACE_START -->
| surface_id | page_routes | route_count | founder-visible purpose | implementation_class | state_or_effect_posture | navigation_posture | observed_status | source_ref |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| `A10-SRF-001` | `/login` | 1 | Credential sign-in and safe return-path handling. | `AUTH_ENTRY_UI` | NextAuth credential request; no application workflow effect claimed. | Gatekeeper redirect target; public auth route. | `STATIC_CONFIGURATION` | [LOGIN-PAGE], [LOGIN-FORM] |
| `A10-SRF-002` | `/` | 1 | Control-plane overview spanning motion, agenda, registry, agent, authority, freshness, and recent sync evidence. | `MIXED_REPOSITORY_DERIVED_AND_DB_READ_OVERVIEW` | Read/derived source only in page code; runtime data availability unverified. | Global-nav destination labeled `Sync Runs`; additional in-page links. | `STATIC_CONFIGURATION` | [ROOT-PAGE], [ROOT-OVERVIEW] |
| `A10-SRF-003` | `/repos` | 1 | Checked-in full repository registry display and admin handoff to the DB registry. | `REPOSITORY_STATIC_DISPLAY` | Read-only canonical registry model; no repository mutation. | Global-nav destination. | `STATIC_CONFIGURATION` | [GLOBAL-REPOS], [REPO-SURFACE-MODEL] |
| `A10-SRF-004` | `/domains` | 1 | DB-backed domain registry display and admin handoff. | `DB_READ_DISPLAY` | Database read path; DNS/provider/live-domain effects explicitly not established. | Global-nav destination. | `STATIC_CONFIGURATION` | [GLOBAL-DOMAINS] |
| `A10-SRF-005` | `/events`; `/events/[id]` | 2 | SoT event list and detail inspection. | `DB_READ_LIST_AND_DETAIL` | Database read path; no event creation from these pages. | Global-nav destination. | `STATIC_CONFIGURATION` | [GLOBAL-EVENTS], [GLOBAL-EVENT-DETAIL] |
| `A10-SRF-006` | `/operator` | 1 | Operator landing counts and cards for Events, Agents, and Projects. | `DB_READ_LANDING` | Database count/read path; no page mutation. | Sanitized login fallback and direct route. | `STATIC_CONFIGURATION` | [OPERATOR-HOME] |
| `A10-SRF-007` | `/operator/events` | 1 | Paginated operator event inspection and freshness display. | `DB_READ_OPERATOR_DISPLAY` | Database read path. | Global Operator destination, subnav, and operator-home card. | `STATIC_CONFIGURATION` | [OPERATOR-EVENTS] |
| `A10-SRF-008` | `/operator/agents` | 1 | Agent and repository-scope posture display. | `REPOSITORY_STATIC_DERIVED_DISPLAY` | Static/derived model; labels do not activate Agents. | Subnav and operator-home card. | `STATIC_CONFIGURATION` | [OPERATOR-AGENTS] |
| `A10-SRF-009` | `/operator/grid` | 1 | Agency/grid topology derived from checked-in configuration. | `FILESYSTEM_CONFIG_READ_DISPLAY` | Explicit no-database/no-write page source. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-GRID] |
| `A10-SRF-010` | `/operator/projects` | 1 | Project portfolio prototype. | `APP_LOCAL_STATIC_FIXTURE_DISPLAY` | Display-only fixture/derived posture. | Subnav and operator-home card. | `STATIC_CONFIGURATION` | [OPERATOR-PROJECTS] |
| `A10-SRF-011` | `/operator/work`; `/operator/work/new`; `/operator/work/[id]` | 3 | Work Packet list, creation, detail, control state, execution-lane metadata, ledger, and handoff history. | `DB_READ_AND_SESSION_GUARDED_SERVER_ACTIONS` | Pre-existing database creates/updates/events are present; no A10 invocation or effect evidence. | Subnav and root in-page link. | `STATIC_CONFIGURATION` | [OPERATOR-WORK], [OPERATOR-WORK-NEW], [OPERATOR-WORK-DETAIL] |
| `A10-SRF-012` | `/operator/portfolio-status` | 1 | Portfolio status, risks, and next-prompt prototype. | `APP_LOCAL_STATIC_DERIVED_DISPLAY` | Read/display only in the mapped page. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-PORTFOLIO] |
| `A10-SRF-013` | `/operator/deliberation` | 1 | Deterministic deliberation candidate and passalong summary. | `APP_LOCAL_STATIC_DERIVED_DISPLAY` | Advisory display; no deliberation provider invocation. | Subnav and root in-page link. | `STATIC_CONFIGURATION` | [OPERATOR-DELIBERATION] |
| `A10-SRF-014` | `/operator/waves`; `/operator/waves/[sessionId]` | 2 | Pilot wave/session and plan-action inspection. | `DB_READ_LIST_AND_DETAIL` | Database reads; adjacent internal wave APIs are not treated as page execution. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-WAVES], [OPERATOR-WAVE-DETAIL] |
| `A10-SRF-015` | `/operator/chats`; `/operator/chats/[id]` | 2 | Stored chat archive list, search, and detail. | `DB_READ_LIST_AND_DETAIL` | Database read path. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-CHATS], [OPERATOR-CHAT-DETAIL] |
| `A10-SRF-016` | `/operator/jai` | 1 | JAI chat/scope/guardrail posture display. | `REPOSITORY_STATIC_DERIVED_DISPLAY` | Labels and candidate models do not establish JAI runtime or activation. | Subnav and root in-page link. | `STATIC_CONFIGURATION` | [OPERATOR-JAI] |
| `A10-SRF-017` | `/operator/control-plane` | 1 | Control-plane prototype fixture and canonical-posture display. | `APP_LOCAL_FIXTURE_PLUS_CANON_READ` | Display-only prototype; no control-plane execution. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-CONTROL-PLANE] |
| `A10-SRF-018` | `/operator/design-system` | 1 | Operator design-system prototype. | `APP_LOCAL_STATIC_PROTOTYPE` | UI demonstration only. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-DESIGN] |
| `A10-SRF-019` | `/operator/live-dashboard` | 1 | Dashboard prototype bearing a live label. | `APP_LOCAL_STATIC_PROTOTYPE` | The label does not prove live data, runtime, or deployment. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-LIVE] |
| `A10-SRF-020` | `/operator/council-prototype` | 1 | Council panel prototype. | `APP_LOCAL_STATIC_PROTOTYPE` | No Council identity, vote, run, or activation. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-COUNCIL] |
| `A10-SRF-021` | `/operator/motions` | 1 | Canonical motion package browser plus separately guarded contender promotion. | `FILESYSTEM_READ_PLUS_GUARDED_PROMOTION_ROUTE` | Read-only browser is distinct from an admin-email/environment-gated filesystem promotion path; neither was invoked. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-MOTIONS], [MOTION-PROMOTE] |
| `A10-SRF-022` | `/operator/decisions` | 1 | Stored decision list, search, and counts. | `DB_READ_OPERATOR_DISPLAY` | Database read path. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-DECISIONS] |
| `A10-SRF-023` | `/operator/dct` | 1 | DCT idea, slot, edge, quality, and provenance inspector with internal-API examples. | `DB_READ_INSPECTOR_PLUS_MACHINE_API_DOCUMENTATION` | Page reads database state; displayed machine-token examples do not execute themselves. | Subnav. | `STATIC_CONFIGURATION` | [OPERATOR-DCT] |
| `A10-SRF-024` | `/operator/motion-control` | 1 | Motion intake/composition, provider-status boundary, manual inference history, and the D2-D8 founder local operating loop. | `MIXED_DB_PERSISTENCE_PROVIDER_BOUNDARY_AND_LOCAL_SHADOW_UI` | Local loop is non-persistent local-shadow; separate intake/manual-inference paths contain persistence/provider seams whose runtime effects are unverified. | Direct/deep link; absent from shared operator subnav. | `STATIC_CONFIGURATION` | [MOTION-CONTROL-PAGE], [MOTION-COMPOSER], [LOCAL-PANEL] |
| `A10-SRF-025` | `/operator/control-thread` | 1 | Passalong/thread-memory router, persistence status, supervised packet, and sandbox.nexus static control surface. | `MIXED_APP_LOCAL_STATIC_AND_OPTIONAL_DB_PERSISTENCE` | Local/static models coexist with environment-dependent passalong reads/writes; no effect was invoked. | Direct/deep link; absent from shared operator subnav. | `STATIC_CONFIGURATION` | [CONTROL-THREAD-PAGE], [PASSALONG-UI], [SANDBOX-SURFACE] |
| `A10-SRF-026` | `/operator/corpus` | 1 | Agent-governance sandbox and draft-review prototype. | `APP_LOCAL_STATIC_PROTOTYPE` | No Agent runtime, source transfer, or activation. | Root in-page link; absent from shared operator subnav. | `STATIC_CONFIGURATION` | [OPERATOR-CORPUS] |
| `A10-SRF-027` | `/operator/operating-context` | 1 | Operating-context, authority-boundary, and rollback display. | `APP_LOCAL_STATIC_DERIVED_DISPLAY` | Read/display only. | Direct/deep link; absent from shared operator subnav. | `STATIC_CONFIGURATION` | [OPERATOR-CONTEXT] |
| `A10-SRF-028` | `/operator/panels`; `/operator/panels/[motionId]/[panelId]` | 2 | Panel queue, rubric, scoring, selection, and winner computation. | `FILESYSTEM_READ_AND_SESSION_PAGE_SERVER_ACTION_WRITE` | Selection writes are present in server actions; no action-local role check or A10 invocation is claimed. | Direct/deep link; coverage page links into it. | `STATIC_CONFIGURATION` | [OPERATOR-PANELS], [OPERATOR-PANEL-DETAIL] |
| `A10-SRF-029` | `/operator/pilot` | 1 | Pilot session list. | `DB_READ_OPERATOR_DISPLAY` | Database read path. | Direct/deep link; absent from shared operator subnav. | `STATIC_CONFIGURATION` | [OPERATOR-PILOT] |
| `A10-SRF-030` | `/operator/registry/coverage` | 1 | Workspace registry and Agent coverage inspection. | `FILESYSTEM_AND_REGISTRY_INDEX_READ` | Read/coverage display; no indexing action from this page. | Direct/deep link; absent from shared operator subnav. | `STATIC_CONFIGURATION` | [REGISTRY-COVERAGE] |
| `A10-SRF-031` | `/operator/registry/domains`; `/operator/registry/domains/new`; `/operator/registry/domains/[id]` | 3 | DB-backed domain list, create, edit, and delete. | `DB_READ_AND_ADMIN_EMAIL_SERVER_ACTION_WRITE` | Pre-existing DB mutation guarded by exact admin email; no DNS/provider/live-domain effect. | Reached from global Domains admin link; not in subnav. | `STATIC_CONFIGURATION` | [REGISTRY-DOMAINS], [REGISTRY-DOMAIN-NEW], [REGISTRY-DOMAIN-DETAIL] |
| `A10-SRF-032` | `/operator/registry/repos`; `/operator/registry/repos/new`; `/operator/registry/repos/[id]` | 3 | DB-backed repository list/index, create, edit, and delete. | `DB_READ_AND_ADMIN_EMAIL_SERVER_ACTION_WRITE` | Pre-existing DB mutation guarded by exact admin email; no GitHub/repository mutation. | Reached from global Repos admin link; not in subnav. | `STATIC_CONFIGURATION` | [REGISTRY-REPOS], [REGISTRY-REPO-NEW], [REGISTRY-REPO-DETAIL] |
| `A10-SRF-033` | `/operator/repos`; `/operator/repos/[repoId]`; `/operator/repos/[repoId]/file` | 3 | DB-backed repository and indexed-file browser. | `DB_AND_FILE_INDEX_READ` | Read-only page/API seam in the mapped flow; source repository mutation not established. | Direct/deep link; absent from shared operator subnav. | `STATIC_CONFIGURATION` | [OPERATOR-REPOS], [OPERATOR-REPO-DETAIL], [OPERATOR-REPO-FILE] |
| `A10-SRF-034` | `/operator/signals` | 1 | Source-signal list. | `DB_READ_OPERATOR_DISPLAY` | Database read path; separate ingest API is outside this founder display action. | Direct/deep link; absent from shared operator subnav. | `STATIC_CONFIGURATION` | [OPERATOR-SIGNALS] |
| `A10-SRF-035` | `/operator/sync-runs/[syncRunId]/review` | 1 | Staged edit review with pre-existing apply/reject controls. | `DB_AND_FILESYSTEM_READ_PLUS_OPERATOR_PROXY_MUTATION` | Client calls operator proxy routes; production is source-disabled while dev may dispatch to machine-token internal apply/reject routes. No effect was invoked or verified. | Dynamic root link when a sync run exists; absent from subnav. | `STATIC_CONFIGURATION` | [SYNC-REVIEW], [SYNC-REVIEW-ACTIONS], [SYNC-APPLY-API], [SYNC-REJECT-API] |
<!-- A10_SURFACE_END -->

Observed registry count: **35 unique surface records covering exactly 47 page
routes**. The route count is a repository-source count, not a deployed-route or
usable-route count.

## 5. UI/API seam and authentication/role boundary matrix

Schema: each `boundary_id` joins exactly one `surface_id`. `page_entry_guard`
describes the shared request boundary. `action_auth_or_guard` records an
additional action-specific rule where source contains one. `effect_class`
describes source capability, never observed execution.

<!-- A10_BOUNDARY_START -->
| boundary_id | surface_id | page_entry_guard | action/API seam | action_auth_or_guard | effect_class | evidence posture and explicit boundary |
| --- | --- | --- | --- | --- | --- | --- |
| `A10-BND-001` | `A10-SRF-001` | Gatekeeper public auth route. | NextAuth credentials provider. | Database user lookup, bcrypt comparison, JWT session callback. | `AUTH_SESSION_CREATE` | Source-only; credentials, tokens, and session contents were not inspected. [AUTH], [LOGIN-FORM] |
| `A10-BND-002` | `A10-SRF-002` | Gatekeeper JWT. | Server reads mixed repository/DB overview data. | Session presence only at middleware boundary. | `READ` | Authenticated visibility is not execution authority. [GATEKEEPER], [ROOT-OVERVIEW] |
| `A10-BND-003` | `A10-SRF-003` | Gatekeeper JWT. | Static registry read; admin link only. | Link visibility uses exact admin email; mutation occurs only on `A10-SRF-032`. | `READ` | Registry display is not repository ownership or mutation. [GLOBAL-REPOS] |
| `A10-BND-004` | `A10-SRF-004` | Gatekeeper JWT. | Domain DB read; admin link only. | Link visibility uses exact admin email; mutation occurs only on `A10-SRF-031`. | `READ` | Stored status is not DNS/provider verification. [GLOBAL-DOMAINS] |
| `A10-BND-005` | `A10-SRF-005` | Gatekeeper JWT. | Prisma event reads. | Session presence only. | `READ` | No event creation by mapped pages. [GLOBAL-EVENTS], [GLOBAL-EVENT-DETAIL] |
| `A10-BND-006` | `A10-SRF-006` | Gatekeeper JWT plus operator-layout server session. | Prisma counts. | Any authenticated user accepted by layout. | `READ` | Operator page access is not ADMIN authority. [OPERATOR-LAYOUT], [OPERATOR-HOME] |
| `A10-BND-007` | `A10-SRF-007` | Gatekeeper JWT plus operator layout. | Prisma event reads. | Any authenticated user accepted by layout. | `READ` | No event mutation. [OPERATOR-EVENTS] |
| `A10-BND-008` | `A10-SRF-008` | Gatekeeper JWT plus operator layout. | Static/derived Agent registry display. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | Agent labels and scopes do not activate Agents. [OPERATOR-AGENTS] |
| `A10-BND-009` | `A10-SRF-009` | Gatekeeper JWT plus operator layout. | Checked-in grid config read. | Any authenticated user accepted by layout. | `FILESYSTEM_CONFIG_READ` | Source comments declare no DB access or writes. [OPERATOR-GRID] |
| `A10-BND-010` | `A10-SRF-010` | Gatekeeper JWT plus operator layout. | Static project prototype. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | No project mutation. [OPERATOR-PROJECTS] |
| `A10-BND-011` | `A10-SRF-011` | Gatekeeper JWT plus operator layout. | Work creation/detail server actions and Prisma transactions. | Action code rechecks session user, not ADMIN role. | `DB_WRITE_PRESENT` | Pre-existing Work/queue/event writes are source-evidenced but not invoked; no Agent execution is established. [OPERATOR-WORK-NEW], [OPERATOR-WORK-DETAIL] |
| `A10-BND-012` | `A10-SRF-012` | Gatekeeper JWT plus operator layout. | Static/derived portfolio display. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | Labels do not establish current portfolio authority. [OPERATOR-PORTFOLIO] |
| `A10-BND-013` | `A10-SRF-013` | Gatekeeper JWT plus operator layout. | Local deterministic candidate/passalong summary. | Any authenticated user accepted by layout. | `LOCAL_ADVISORY_DISPLAY` | No provider deliberation or decision authority. [OPERATOR-DELIBERATION] |
| `A10-BND-014` | `A10-SRF-014` | Gatekeeper JWT plus operator layout. | Prisma session/plan reads. | Any authenticated user accepted by layout. | `READ` | Adjacent internal APIs require machine-token routing and are not page actions here. [OPERATOR-WAVES], [OPERATOR-WAVE-DETAIL] |
| `A10-BND-015` | `A10-SRF-015` | Gatekeeper JWT plus operator layout. | Prisma chat reads. | Any authenticated user accepted by layout. | `READ` | No chat ingestion by mapped pages. [OPERATOR-CHATS], [OPERATOR-CHAT-DETAIL] |
| `A10-BND-016` | `A10-SRF-016` | Gatekeeper JWT plus operator layout. | Static/derived JAI surface. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | JAI label does not establish JAI runtime or activation. [OPERATOR-JAI] |
| `A10-BND-017` | `A10-SRF-017` | Gatekeeper JWT plus operator layout. | Fixture/canon reads. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | No control-plane execution. [OPERATOR-CONTROL-PLANE] |
| `A10-BND-018` | `A10-SRF-018` | Gatekeeper JWT plus operator layout. | Design prototype. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | No product/runtime effect. [OPERATOR-DESIGN] |
| `A10-BND-019` | `A10-SRF-019` | Gatekeeper JWT plus operator layout. | Dashboard prototype. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | `live` naming is not runtime evidence. [OPERATOR-LIVE] |
| `A10-BND-020` | `A10-SRF-020` | Gatekeeper JWT plus operator layout. | Council prototype. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | No Council run, vote, identity, or activation. [OPERATOR-COUNCIL] |
| `A10-BND-021` | `A10-SRF-021` | Gatekeeper JWT plus operator layout. | `/api/operator/motions/promote` for contender promotion. | Route rechecks session, exact `admin@jai.nexus`, and environment availability. | `FILESYSTEM_WRITE_PRESENT` | Browser remains read-only; guarded promotion source exists but was not invoked. [OPERATOR-MOTIONS], [MOTION-PROMOTE] |
| `A10-BND-022` | `A10-SRF-022` | Gatekeeper JWT plus operator layout. | Prisma decision reads. | Any authenticated user accepted by layout. | `READ` | Stored decisions are display evidence, not fresh authority. [OPERATOR-DECISIONS] |
| `A10-BND-023` | `A10-SRF-023` | Gatekeeper JWT plus operator layout. | Page DB reads; displayed `/api/dct/*` command examples. | DCT API routes use in-route internal-token checks. | `READ_PLUS_DOCUMENTED_MACHINE_API` | No command or API was executed. [OPERATOR-DCT], [GATEKEEPER] |
| `A10-BND-024` | `A10-SRF-024` | Gatekeeper JWT plus operator layout. | Local loop API; motion-intake and manual-inference routes. | Local loop requires exact ADMIN role and normalized email; sibling routes retain their own existing boundaries. | `LOCAL_SHADOW_PLUS_DB_PROVIDER_SEAMS` | Local-loop non-effects are explicit; persistence/provider availability and effects remain unverified. [LOCAL-ROUTE], [LOCAL-HANDLER], [MOTION-INTAKE-ROUTE], [MANUAL-INFERENCE-ROUTE] |
| `A10-BND-025` | `A10-SRF-025` | Gatekeeper JWT plus operator layout. | `/operator/control-thread/passalongs` GET/POST/PATCH. | Session middleware boundary; no additional ADMIN role check in mapped collection route. | `DB_READ_WRITE_PRESENT_WITH_UNAVAILABLE_FALLBACK` | App-local static sandbox/passalong models grant no route, send, import, or sandbox activation. [PASSALONG-COLLECTION], [PASSALONG-DETAIL], [PASSALONG-PERSISTENCE] |
| `A10-BND-026` | `A10-SRF-026` | Gatekeeper JWT plus operator layout. | Static governance/draft-review models. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | No Agent or corpus transition. [OPERATOR-CORPUS] |
| `A10-BND-027` | `A10-SRF-027` | Gatekeeper JWT plus operator layout. | Static operating-context model. | Any authenticated user accepted by layout. | `STATIC_DISPLAY` | No authority or rollback action. [OPERATOR-CONTEXT] |
| `A10-BND-028` | `A10-SRF-028` | Gatekeeper JWT plus operator layout. | Panel scoring/winner server actions. | No action-local session/role check visible; page access supplies the shared session boundary. | `FILESYSTEM_WRITE_PRESENT` | Static source shows writes; no write or authority was exercised. [OPERATOR-PANEL-DETAIL] |
| `A10-BND-029` | `A10-SRF-029` | Gatekeeper JWT plus operator layout. | Prisma pilot-session read. | Any authenticated user accepted by layout. | `READ` | No pilot execution. [OPERATOR-PILOT] |
| `A10-BND-030` | `A10-SRF-030` | Gatekeeper JWT plus operator layout. | Registry/coverage file reads. | Any authenticated user accepted by layout. | `FILESYSTEM_READ` | No indexing or registry mutation. [REGISTRY-COVERAGE] |
| `A10-BND-031` | `A10-SRF-031` | Gatekeeper JWT plus operator layout. | Domain create/update/delete server actions. | Each mapped mutation path checks exact `admin@jai.nexus`. | `DB_WRITE_PRESENT` | DB-row mutation is distinct from DNS/provider/live-domain mutation. [REGISTRY-DOMAIN-NEW], [REGISTRY-DOMAIN-DETAIL] |
| `A10-BND-032` | `A10-SRF-032` | Gatekeeper JWT plus operator layout. | Repo index/create/update/delete server actions. | Each mapped mutation path checks exact `admin@jai.nexus`. | `DB_WRITE_PRESENT` | DB registry mutation is not GitHub or source-repository mutation. [REGISTRY-REPOS], [REGISTRY-REPO-NEW], [REGISTRY-REPO-DETAIL] |
| `A10-BND-033` | `A10-SRF-033` | Gatekeeper JWT plus operator layout. | DB/file-index reads and session-protected repo file APIs. | Session middleware boundary. | `READ` | No source repository write. [OPERATOR-REPOS], [OPERATOR-REPO-DETAIL], [OPERATOR-REPO-FILE] |
| `A10-BND-034` | `A10-SRF-034` | Gatekeeper JWT plus operator layout. | Prisma signal read. | Any authenticated user accepted by layout. | `READ` | Ingest is not a mapped founder action on this page. [OPERATOR-SIGNALS] |
| `A10-BND-035` | `A10-SRF-035` | Gatekeeper JWT plus operator layout for page; `/api/operator/*` bypasses middleware session and handles auth in-route. | Client apply/reject -> operator proxy -> machine-token internal agent route. | Proxy is source-disabled in production; in dev an optional bypass token is enforced only when configured. | `FILESYSTEM_AND_DB_MUTATION_DISPATCH_PRESENT` | This is a pre-existing high-risk seam. No call, staged edit, internal token, filesystem effect, or DB effect was observed. [SYNC-REVIEW-ACTIONS], [SYNC-APPLY-API], [SYNC-REJECT-API], [INTERNAL-APPLY], [INTERNAL-REJECT] |
<!-- A10_BOUNDARY_END -->

Observed boundary count: **35 unique records with a complete one-to-one join to
the 35 surface records**. The matrix reveals multiple current authorization
patterns; it does not normalize or endorse them.

## 6. Workflow and state-transition registry

Schema: `workflow_id` joins a surface and records one user-visible transition
or recovery rule. `evidence_class` separates source/test evidence from
historical founder observation. `post_state` is local-loop presentation state,
not Program, Batch, route, or execution state.

<!-- A10_WORKFLOW_START -->
| workflow_id | surface_id | trigger/action | pre_state | post_state | founder-visible result | evidence_class | source_ref | authority_non_effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A10-WF-001` | `A10-SRF-001` | Open protected URL without a session, then sign in. | `UNAUTHENTICATED` | `AUTHENTICATED_PAGE_REQUEST` | Login error is generic; a safe `next` target or `/operator` is used after success. | `STATIC_CONFIGURATION` | [GATEKEEPER], [LOGIN-PAGE], [LOGIN-FORM] | Authentication is not workflow, mutation, or decision authority. |
| `A10-WF-002` | `A10-SRF-024` | Select or compose a safe motion. | `NO_SELECTION_OR_PRIOR_PROJECTION` | `DRAFT` | Canonical safe projection becomes the local-loop input; raw projection key is withheld. | `STATIC_CONFIGURATION / STATIC_UI` | [MOTION-COMPOSER], [LOCAL-PANEL] | Selection does not validate, deliberate, route, persist, or execute. |
| `A10-WF-003` | `A10-SRF-024` | `VALIDATE` with structurally valid input. | `DRAFT` | `VALIDATED` | Copy states that request shape is valid and no semantic recommendation exists. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | [LOCAL-MODEL], [LOCAL-HANDLER], [LOCAL-TEST] | Structural validation is not recommendation, acceptance, or authority. |
| `A10-WF-004` | `A10-SRF-024` | `VALIDATE` with structurally invalid input. | `DRAFT` | `DRAFT` | Deterministic allowlisted field remediation appears; selected motion remains available. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR_PLUS_STATIC_UI` | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] | Raw Zod issues, payloads, proofs, and secrets are not founder copy. |
| `A10-WF-005` | `A10-SRF-024` | `DELIBERATE` with current validation proof. | `VALIDATED` | `AWAITING_DECISION` | Server-derived recommendation, ordered finding codes, explanation, and proof boundary appear. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | [LOCAL-MODEL], [LOCAL-HANDLER], [LOCAL-TEST] | Recommendation is advisory and server-derived; no provider or Council run. |
| `A10-WF-006` | `A10-SRF-024` | Choose Review ACCEPT, HOLD, or REJECT. | `AWAITING_DECISION` | `AWAITING_DECISION / REVIEWING` | Confirmation heading receives static UI focus; effects and non-authorizations are shown before submission. | `STATIC_CONFIGURATION / TESTED_MODEL_PLUS_STATIC_UI` | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] | Review is not a submitted decision. |
| `A10-WF-007` | `A10-SRF-024` | Cancel or Escape from decision review. | `AWAITING_DECISION / REVIEWING` | `AWAITING_DECISION` | Confirmation clears and source-button focus restoration is wired. | `STATIC_CONFIGURATION / TESTED_MODEL_PLUS_STATIC_UI` | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] | No decision, packet, artifact, or external effect. |
| `A10-WF-008` | `A10-SRF-024` | Confirm ACCEPT after server-derived GO. | `AWAITING_DECISION / REVIEWING` | `ACCEPTED` | One proposed Work Packet and one terminal artifact may be shown. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | [LOCAL-HANDLER], [LOCAL-MODEL], [LOCAL-TEST] | ACCEPT is local-shadow only and is not CONTROL_THREAD acceptance. |
| `A10-WF-009` | `A10-SRF-024` | Confirm HOLD. | `AWAITING_DECISION / REVIEWING` | `HELD` | No Work Packet; one terminal artifact may be shown. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | [LOCAL-HANDLER], [LOCAL-MODEL], [LOCAL-TEST] | HOLD has no execution or Program effect. |
| `A10-WF-010` | `A10-SRF-024` | Confirm REJECT. | `AWAITING_DECISION / REVIEWING` | `REJECTED` | No Work Packet; one terminal artifact may be shown. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | [LOCAL-HANDLER], [LOCAL-MODEL], [LOCAL-TEST] | REJECT has no execution or Program effect. |
| `A10-WF-011` | `A10-SRF-024` | Change selected motion or canonical composed input. | `VALIDATED_OR_LATER` | `DRAFT` | Projection-key remount clears validation, recommendation, findings, proofs, decision controls, packet, artifact, and receipt state. | `STATIC_CONFIGURATION / TESTED_MODEL_PLUS_STATIC_UI` | [LOCAL-PANEL], [LOCAL-MODEL], [LOCAL-TEST] | Canonical invalidation creates no new decision. |
| `A10-WF-012` | `A10-SRF-024` | Authentication, ADMIN, actor, secret, proof, parse, or fail-closed response error. | `VALIDATED_OR_LATER` | `DRAFT` | Safe recovery message; sign-in-again control appears for identity failures. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR_PLUS_STATIC_UI` | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] | No raw response, token, proof, exception, or secret is intentionally displayed. |
| `A10-WF-013` | `A10-SRF-024` | Browser `pagehide`. | `ANY_LOCAL_LOOP_STATE` | `DRAFT` | Local shadow clears with fresh-validation status copy. | `STATIC_CONFIGURATION / TESTED_MODEL_PLUS_STATIC_UI` | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] | Source wiring is not a current browser observation. |
| `A10-WF-014` | `A10-SRF-024` | Persisted BFCache `pageshow`. | `RESTORED_BROWSER_STATE` | `DRAFT` | Restored state is cleared and fresh validation is required. | `STATIC_CONFIGURATION / TESTED_MODEL_PLUS_STATIC_UI` | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] | BFCache occurrence on current deployment is unobserved. |
| `A10-WF-015` | `A10-SRF-024` | Abort, navigation, projection drift, request supersession, or async classification staleness. | `REQUEST_PENDING` | `CURRENT_SAFE_STATE_UNCHANGED` | Late/stale response is suppressed. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] | No stale result may update the mapped UI contract. |
| `A10-WF-016` | `A10-SRF-024` | Reset local shadow. | `ANY_LOCAL_LOOP_STATE` | `DRAFT` | Derived state clears while the current projection remains available. | `STATIC_CONFIGURATION / STATIC_UI` | [LOCAL-PANEL] | Reset does not delete persisted motion intake or external state. |
| `A10-WF-017` | `A10-SRF-024` | Copy redacted boundary receipt in coherent terminal state. | `ACCEPTED_OR_HELD_OR_REJECTED` | `SAME_TERMINAL_STATE` | One allowlisted receipt write is attempted and status is announced; focus is wired to remain natural. | `STATIC_CONFIGURATION / TESTED_MODEL_PLUS_PHASE_SPECIFIC_OBSERVATION` | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST], [A4], [A9] | Clipboard bytes, readback, retention, paste, disclosure, and external effects remain unverified. |
<!-- A10_WORKFLOW_END -->

Observed workflow count: **17 unique records**. The core local-loop sequence is
exactly `DRAFT -> VALIDATED -> AWAITING_DECISION -> ACCEPTED | HELD |
REJECTED`. Review/confirmation is a UI substate, not a new server transition.

## 7. Founder-visible outcome, packet, artifact, receipt, and proof map

Schema: every `outcome_id` joins one or more section-6 `workflow_id` values.
`cardinality_or_integrity` records deterministic limits. `unverified_boundary`
names what source/tests cannot establish.

<!-- A10_OUTCOME_START -->
| outcome_id | workflow_ids | founder-visible object | cardinality_or_integrity | evidence posture | authority posture | unverified_boundary | source_ref |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A10-OUT-001` | `A10-WF-003` | Validation state and validation proof. | Exactly one current motion fingerprint/proof pair in the successful response; malformed or stale proof fails closed. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | Proof authenticates a server transition only; it is not acceptance or route authority. | Current deployment, secret rotation event, and live session behavior. | [LOCAL-HANDLER], [LOCAL-MODEL], [LOCAL-TEST] |
| `A10-OUT-002` | `A10-WF-005` | Server-derived recommendation and ordered semantic findings. | Recommendation/finding graph must match deterministic motion rules exactly. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | Browser may check coherence but never substitutes a client recommendation. | Provider/Council activity and deployed response are not established. | [LOCAL-MODEL], [LOCAL-HANDLER], [LOCAL-TEST] |
| `A10-OUT-003` | `A10-WF-005` | Deliberation proof, fingerprints, and candidate packet hash. | Content-derived values are checked; HMAC authenticity remains server-bound. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | Browser does not possess `NEXTAUTH_SECRET` and does not authenticate HMAC independently. | Live secret, deployed server, and external effect. | [LOCAL-MODEL], [LOCAL-HANDLER], [LOCAL-TEST] |
| `A10-OUT-004` | `A10-WF-008` | Work Packet preview. | Exactly one only for ACCEPT with GO; status `PROPOSED_ONLY`; execution authority false. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | Non-executable draft; no route, send, GitHub, Linear, provider, or Program effect. | Persistence, transmission, import, execution, and acceptance. | [LOCAL-MODEL], [LOCAL-HANDLER], [LOCAL-TEST] |
| `A10-OUT-005` | `A10-WF-009` | HOLD terminal summary. | Work Packet count 0; artifact count at most 1 when coherent. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | HOLD is local-shadow terminal state only. | Current browser rendering and external effects. | [LOCAL-MODEL], [LOCAL-HANDLER], [LOCAL-TEST] |
| `A10-OUT-006` | `A10-WF-010` | REJECT terminal summary. | Work Packet count 0; artifact count at most 1 when coherent. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | REJECT is local-shadow terminal state only. | Current browser rendering and external effects. | [LOCAL-MODEL], [LOCAL-HANDLER], [LOCAL-TEST] |
| `A10-OUT-007` | `A10-WF-008`, `A10-WF-009`, `A10-WF-010` | Terminal decision artifact. | Exactly one coherent artifact; deterministic ID; receipt authority `DEMONSTRATION_ONLY`; persistence `NONE`; execution authority false. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | Not a CONTROL_THREAD acceptance receipt; no Program effect. | Durable storage, downstream consumption, and external effects. | [LOCAL-HANDLER], [LOCAL-MODEL], [LOCAL-TEST] |
| `A10-OUT-008` | `A10-WF-008`, `A10-WF-009`, `A10-WF-010` | Founder-safe terminal presentation. | Fails closed if packet/artifact/state evidence is incoherent; raw terminal JSON is not the intended presentation. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR_PLUS_STATIC_UI` | Presentation does not increase artifact authority. | Authenticated browser comprehension at current deployment. | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] |
| `A10-OUT-009` | `A10-WF-017` | Redacted boundary receipt. | Allowlisted keys, deterministic serialization, no raw motion content, proof, token, secret, actor email, or full packet/artifact. | `STATIC_CONFIGURATION / TESTED_BEHAVIOR` | `DEMONSTRATION_ONLY`; external persistence effect `UNVERIFIED`. | Clipboard bytes, readback, retention, paste, and disclosure. | [LOCAL-MODEL], [LOCAL-TEST] |
| `A10-OUT-010` | `A10-WF-017` | Copy status and focus behavior. | One active attempt; stale settlements suppressed; static source excludes app persistence, network dispatch, and file download from the control. | `STATIC_CONFIGURATION / TESTED_MODEL_PLUS_PHASE_SPECIFIC_OBSERVATION` | Copy control is not export acceptance, transmission authority, or external-effect proof. | Current browser API availability and all post-write behavior. | [LOCAL-PANEL], [LOCAL-MODEL], [LOCAL-TEST], [A4], [A9] |
<!-- A10_OUTCOME_END -->

Observed outcome count: **10 unique records**. ACCEPT, HOLD, and REJECT all
remain demonstrative. Only ACCEPT with GO can return one `PROPOSED_ONLY` Work
Packet; HOLD and REJECT return none.

## 8. Recovery, invalidation, navigation, terminology, and dead-end findings

Schema: `finding_id` is stable. `surface_ids` references section-4 rows or
`ALL_PROTECTED`. `classification` is an A2 status. Findings describe current
source and evidence posture; they do not authorize repair.

<!-- A10_FINDING_START -->
| finding_id | severity | surface_ids | category | normalized finding | classification | relation | desired outcome | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A10-FND-001` | `LOW` | `A10-SRF-024` | Recovery | Structural failure returns to DRAFT, preserves the selected projection, exposes deterministic field-safe remediation, and statically focuses an alert heading. | `STATIC_CONFIGURATION` | `narrows` | Preserve this contract and obtain browser evidence only through a later routed observation. | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] |
| `A10-FND-002` | `MEDIUM` | `A10-SRF-024` | Recovery | Identity, proof, server-secret, malformed-response, and generic failures share fail-closed DRAFT recovery with safe founder copy. | `STATIC_CONFIGURATION` | `narrows` | Keep raw payload/proof/secret data out of founder-visible output. | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] |
| `A10-FND-003` | `MEDIUM` | `A10-SRF-024` | Invalidation | Projection changes remount the local loop and clear all derived decision evidence. | `STATIC_CONFIGURATION` | `records-later-event` | Preserve canonical invalidation as composed input evolves. | [LOCAL-PANEL], [LOCAL-TEST] |
| `A10-FND-004` | `MEDIUM` | `A10-SRF-024` | Navigation recovery | `pagehide` and persisted `pageshow` clear local state to DRAFT; source/tests do not prove current browser lifecycle behavior. | `STATIC_CONFIGURATION` | `phase-bounds` | Later founder observation may verify the exact deployed browser flow. | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST], [A9] |
| `A10-FND-005` | `HIGH` | `A10-SRF-024` | Stale response | Request identity, projection identity, abort state, and post-await checks suppress late or stale client updates. | `STATIC_CONFIGURATION` | `narrows` | Preserve fail-closed response ownership. | [LOCAL-MODEL], [LOCAL-PANEL], [LOCAL-TEST] |
| `A10-FND-006` | `MEDIUM` | `A10-SRF-024` | Discoverability | The founder local loop exists on `/operator/motion-control`, but the shared operator subnav and operator landing cards do not expose that route. | `STATIC_CONFIGURATION` | `does-not-supersede` | CONTROL_THREAD may later route an information-architecture decision. | [OPERATOR-SUBNAV], [OPERATOR-HOME], [MOTION-CONTROL-PAGE] |
| `A10-FND-007` | `LOW` | `A10-SRF-002` | Terminology | Global `Sync Runs` navigation targets a root page whose own source says it now centers a broader operator overview. | `STATIC_CONFIGURATION` | `records-later-event` | Align label and destination meaning under a separately routed UI decision. | [GLOBAL-NAV], [ROOT-PAGE] |
| `A10-FND-008` | `MEDIUM` | `A10-SRF-021`, `A10-SRF-024` | Terminology | Canonical motion ratification/promotion language and local-shadow ACCEPT language are different scopes; ACCEPT explicitly is not CONTROL_THREAD acceptance. | `STATIC_CONFIGURATION` | `does-not-supersede` | Keep the scopes visibly distinct and avoid a single unqualified `accept` concept. | [OPERATOR-MOTIONS], [MOTION-CONTROL-PAGE], [LOCAL-MODEL] |
| `A10-FND-009` | `MEDIUM` | `A10-SRF-024` | Surface composition | One page combines persistent intake/history, provider status/manual inference, static kernel previews, and a non-persistent local-shadow loop. | `STATIC_CONFIGURATION` | `does-not-supersede` | Preserve explicit seam labels; later product work may simplify the founder journey without changing authority. | [MOTION-CONTROL-PAGE], [MOTION-COMPOSER], [LOCAL-PANEL] |
| `A10-FND-010` | `HIGH` | `A10-SRF-011`, `A10-SRF-021`, `A10-SRF-025`, `A10-SRF-028`, `A10-SRF-031`, `A10-SRF-032`, `A10-SRF-035` | Mutation topology | Founder-visible operator pages coexist with session-only, ADMIN-role, admin-email, environment-gated, machine-token, filesystem, and database mutation seams. | `UNRESOLVED` | `does-not-supersede` | A later security/authority review should reconcile the intended boundary before customer translation. | [GATEKEEPER], [OPERATOR-LAYOUT], [LOCAL-ROUTE], [MOTION-PROMOTE], [SYNC-APPLY-API] |
| `A10-FND-011` | `MEDIUM` | `A10-SRF-019`, `A10-SRF-020`, `A10-SRF-008`, `A10-SRF-016` | Terminology | `live`, Agent, JAI, and Council labels appear on static/prototype surfaces and do not establish runtime or activation. | `DEFERRED` | `does-not-supersede` | Retain explicit prototype/non-activation labels until separately authorized runtime evidence exists. | [OPERATOR-LIVE], [OPERATOR-COUNCIL], [OPERATOR-AGENTS], [OPERATOR-JAI], [A9] |
| `A10-FND-012` | `MEDIUM` | `ALL_PROTECTED` | Evidence boundary | Repository routes and tests do not prove current deployed reachability, exact deployed SHA, authentication success, data availability, or external-effect absence. | `UNAVAILABLE` | `phase-bounds` | Require a separately routed current-deployment observation for runtime claims. | [A2], [A7], [A9] |
| `A10-FND-013` | `MEDIUM` | `A10-SRF-002`, `A10-SRF-035` | Sync Runs | The accepted 2026-07-22 report recorded a phase-specific Sync Runs finding, but the supplied update contains no field-level transcript or deployed SHA from which to assert current-main behavior. | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Preserve the observation as founder evidence and require separately sourced detail before changing Sync Runs behavior or meaning. | Accepted 2026-07-22 founder live-inspection report / `RUNNING_OBSERVED_UI_ONLY` |
| `A10-FND-014` | `MEDIUM` | `A10-SRF-003`, `A10-SRF-032`, `A10-SRF-033` | Repository registry | The accepted report recorded a phase-specific repository-registry finding; exact visible records, data freshness, and deployed-source identity remain unavailable in the supplied update. | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Reconcile repository-registry presentation only through a later bounded decision grounded in exact observed records and source. | Accepted 2026-07-22 founder live-inspection report / `RUNNING_OBSERVED_UI_ONLY` |
| `A10-FND-015` | `MEDIUM` | `A10-SRF-004`, `A10-SRF-031` | Domain registry | The accepted report recorded a phase-specific domain-registry finding; exact visible records, data freshness, and deployed-source identity remain unavailable in the supplied update. | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Reconcile domain-registry presentation only through a later bounded decision grounded in exact observed records and source. | Accepted 2026-07-22 founder live-inspection report / `RUNNING_OBSERVED_UI_ONLY` |
| `A10-FND-016` | `MEDIUM` | `A10-SRF-005`, `A10-SRF-007` | Events | The accepted report recorded a phase-specific Events finding without establishing the deployed revision, durable event source, or external effects. | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Preserve the observation separately from repository event contracts and require exact event evidence before any reconciliation decision. | Accepted 2026-07-22 founder live-inspection report / `RUNNING_OBSERVED_UI_ONLY` |
| `A10-FND-017` | `MEDIUM` | `A10-SRF-006`, `ALL_PROTECTED` | Operator clarity | The accepted report recorded founder-facing Operator clarity findings, but the supplied update does not provide exact control copy or task-level outcomes for current-main attribution. | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Use the report as bounded product evidence only; require a later explicit decision before changing controls, copy, or authority semantics. | Accepted 2026-07-22 founder live-inspection report / `RUNNING_OBSERVED_UI_ONLY` |
| `A10-FND-018` | `MEDIUM` | `A10-SRF-002`, `A10-SRF-006`, `A10-SRF-024` | Navigation | The accepted report recorded a phase-specific navigation finding across founder operating surfaces; it does not establish a current-main route defect or authorize information-architecture work. | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Retain as evidence for a separately routed navigation decision. | Accepted 2026-07-22 founder live-inspection report / `RUNNING_OBSERVED_UI_ONLY` |
| `A10-FND-019` | `HIGH` | `A10-SRF-021`, `A10-SRF-024`, `A10-SRF-025`, `A10-SRF-031`, `A10-SRF-032`, `A10-SRF-035` | Control separation | The report recorded phase-specific control-separation findings. `NO_MUTATION_OBSERVED` describes visible UI only and does not prove that database, repository, filesystem, provider, or network effects were absent. | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Preserve explicit control and authority boundaries; require direct effect evidence before any side-effect claim. | Accepted 2026-07-22 founder live-inspection report / `NO_MUTATION_OBSERVED` |
| `A10-FND-020` | `MEDIUM` | `ALL_PROTECTED` | Accessibility | The accepted report recorded a phase-specific accessibility finding, while exact keyboard, focus, semantic, assistive-technology, and deployed-revision evidence remains unavailable in the supplied update. | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Carry the finding as bounded founder evidence and require a separately scoped accessibility verification before remediation credit. | Accepted 2026-07-22 founder live-inspection report / `RUNNING_OBSERVED_UI_ONLY` |
| `A10-FND-021` | `MEDIUM` | `A10-SRF-002`, `A10-SRF-003`, `A10-SRF-004`, `A10-SRF-005`, `A10-SRF-006`, `A10-SRF-007`, `A10-SRF-035` | Cockpit reconciliation | The report proposed a single reconciliation surface spanning founder cockpit evidence. This is a future candidate only, not a current surface, selected design, routed lane, or implementation authorization. | `DEFERRED` | `does-not-supersede` | CONTROL_THREAD may later decide whether to investigate a bounded reconciliation surface; A10 neither selects nor implements one. | Accepted 2026-07-22 founder live-inspection report / future candidate only |
<!-- A10_FINDING_END -->

Observed finding count: **21 unique records**. The final nine records preserve
the accepted report's category-level findings without inventing absent field
values or deployed-source identity. These findings are map output,
not A11/A12 implementation or a later-lane route.

## 9. Founder-only versus future-customer translation matrix

Schema: `translation_id` is stable. Every future-customer statement is an
explicit `UNRESOLVED` or `DEFERRED` hypothesis, never a current capability or
authorization.

<!-- A10_TRANSLATION_START -->
| translation_id | surface_ids | founder-only current source fact | future-customer translation hypothesis | classification | required evidence or decision | authority_non_effect |
| --- | --- | --- | --- | --- | --- | --- |
| `A10-TRN-001` | `A10-SRF-001` | Credential login exposes known internal account labels and a single JWT session model. | Customer entry would require tenant-aware identity, enrollment, recovery, role lifecycle, and privacy-safe copy. | `DEFERRED` | Separate security/product design, implementation, and customer evidence. | No customer identity or access is created. |
| `A10-TRN-002` | `A10-SRF-002`, `A10-SRF-006` | Broad founder overview surfaces expose internal motion, Agent, Program, and sync concepts. | Customer home would need task-centered, tenant-scoped status and progressive disclosure. | `UNRESOLVED` | Founder information-architecture decision and customer research. | No customer navigation or readiness claim. |
| `A10-TRN-003` | `A10-SRF-024` | Founder selects/composes a motion and advances a local-shadow operating loop. | Customer intake would require a bounded request object, policy-visible validation, consent, tenancy, retention, and support path. | `DEFERRED` | Separate customer contract and persistence/authority design. | No customer motion intake is authorized. |
| `A10-TRN-004` | `A10-SRF-024` | ADMIN reviews a server-derived recommendation and confirms ACCEPT, HOLD, or REJECT. | Customer decision UX would need explicit decision rights, appeal/escalation, audit, and safe terminal outcomes. | `DEFERRED` | Customer decision-authority model and human-factors verification. | Founder ADMIN semantics do not transfer to customers. |
| `A10-TRN-005` | `A10-SRF-024`, `A10-SRF-025` | Work Packets, artifacts, receipts, and passalongs are proposed, demonstrative, static, or environment-dependent. | Customer receipts would need durable provenance, retention, export, access control, and effect reconciliation. | `DEFERRED` | A11 external-effect/dependency evidence if separately routed, then product/authority decisions. | No durable customer receipt or export. |
| `A10-TRN-006` | `A10-SRF-003`, `A10-SRF-004`, `A10-SRF-031`, `A10-SRF-032`, `A10-SRF-033` | Founder inspects checked-in and DB registries; exact admin email gates some writes. | Customer asset views would require tenant isolation, ownership proof, change approval, audit, and integration boundaries. | `DEFERRED` | Security/tenancy architecture and direct effect evidence. | No customer registry or external repository/domain control. |
| `A10-TRN-007` | `A10-SRF-011`, `A10-SRF-014`, `A10-SRF-028`, `A10-SRF-035` | Internal Work, wave, panel, and staged-edit concepts expose high-context control workflows. | Customer workflow would need bounded tasks, understandable approvals, non-destructive recovery, and supportable lifecycle semantics. | `UNRESOLVED` | Product topology and authority review before implementation. | No customer execution, staged edit, or Agent assignment. |
| `A10-TRN-008` | `A10-SRF-024` | Local-loop recovery is deterministic, safe-copy, and fail-closed in source/tests. | Customer recovery would additionally need observed session, device, concurrency, accessibility, and support behavior. | `UNRESOLVED` | Separately routed deployed browser/accessibility observation. | Static UI/test evidence is not customer usability proof. |
| `A10-TRN-009` | `A10-SRF-008`, `A10-SRF-016`, `A10-SRF-019`, `A10-SRF-020`, `A10-SRF-023` | Internal acronyms and Agent/JAI/Council/live/DCT labels are founder/engineering language. | Customer language would require plain-language naming and removal of unneeded internal governance concepts. | `DEFERRED` | Founder/customer terminology decision and comprehension evidence. | No naming change or customer representation. |
| `A10-TRN-010` | `ALL_PROTECTED` | Current surfaces mix repository, DB, filesystem, network, static, and local-shadow evidence classes. | Customer operation would require explicit effect previews, receipts, audit logs, data boundaries, and support ownership per action. | `DEFERRED` | A11 mapping if separately routed plus security, privacy, and product acceptance. | No external-effect, customer, production, or readiness claim. |
<!-- A10_TRANSLATION_END -->

Observed translation count: **10 unique, non-routing hypotheses**. Future
customer translation is not implemented or accepted by this artifact.

## 10. Gap and contradiction ledger

Schema: `gap_id` is stable. `future_owner_or_lane` may name A11 or A12 only
where the accepted A10 packet explicitly assigns that later subject. Naming a
later lane is evidence classification, not execution authority.

<!-- A10_GAP_START -->
| gap_id | normalized claim pair | controlling evidence | classification | relation | present disposition | missing proof | future_owner_or_lane | explicit_current_non_effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A10-GAP-001` | Required-base source versus current deployed application | [A2], [A7], [A9], this source inventory, and the accepted 2026-07-22 report | `UNAVAILABLE` | `phase-bounds` | A live UI report exists, but its deployed SHA is unavailable and it is not current-main proof. | Visible deployed SHA plus separately routed direct observation attributable to that SHA. | `CONTROL_THREAD / future founder observation` | No deployment, current-main runtime, or production claim. |
| `A10-GAP-002` | DB/persistence/provider/filesystem route presence versus completed effects | [A9] and section 5 | `UNRESOLVED` | `does-not-supersede` | Source seams exist; environment availability and effects remain unverified. | Exact environment, request, result, durable state, and effect receipt. | `A11 only if separately routed` | No persistence, provider, filesystem, or external-effect credit. |
| `A10-GAP-003` | Receipt copy control versus clipboard/disclosure effect | [A4], [A9], `A10-OUT-009`, `A10-OUT-010` | `UNRESOLVED` | `narrows` | Allowlisted serialization and copy-control behavior do not prove copied bytes or downstream use. | Separately authorized clipboard/effect evidence without secret exposure. | `A11 only if separately routed` | No disclosure, retention, paste, or external-effect claim. |
| `A10-GAP-004` | Sync-run apply/reject source versus repository/filesystem/DB result | `A10-BND-035` | `UNRESOLVED` | `does-not-supersede` | Dev-only proxy/internal mutation path exists; no request or result was observed. | Exact environment, authorization, staged input, result, rollback, and audit receipt. | `A11 only if separately routed`; security owner otherwise `UNRESOLVED` | No staged edit, Agent action, repository mutation, or acceptance. |
| `A10-GAP-005` | Current A10 route versus Linear JAI-192 state | Current Work Packet and Linear label supplied by the packet | `MIRROR_ONLY` | `does-not-supersede` | JAI-192 is coordination context only and was not queried or mutated. | Separately routed current-versus-legacy Linear reconciliation. | `A12 only if separately routed` | No Linear currentness, mutation, or source-of-truth transfer. |
| `A10-GAP-006` | Shared authenticated operator access versus action-specific ADMIN/admin-email/machine-token/session-only guards | [GATEKEEPER], [OPERATOR-LAYOUT], section 5 | `UNRESOLVED` | `does-not-supersede` | Multiple source-enforced patterns coexist; A10 does not select the intended global authorization model. | Security/authority specification and independent implementation audit. | `CONTROL_THREAD / future security-authority lane` | No guard change, role expansion, or mutation authority. |
| `A10-GAP-007` | Tested local-loop recovery versus current founder browser behavior | [LOCAL-TEST], [A4], [A9], and the accepted 2026-07-22 report | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Tests and phase-specific observations remain bounded; the report's deployed SHA is unavailable and it is not current-main proof. | Exact deployed head plus routed browser observation attributable to that head. | `CONTROL_THREAD / future founder observation` | No current-main browser, accessibility-runtime, or side-effect-absence claim. |
| `A10-GAP-008` | Founder-only topology versus future-customer workflow | Section 9 | `DEFERRED` | `does-not-supersede` | Translation rows are hypotheses only. | Customer identity, tenancy, research, product contract, security, and effect evidence. | `CONTROL_THREAD / future customer-program route` | No customer access, readiness, or production authority. |
| `A10-GAP-009` | Existing page-route inventory versus coherent founder navigation | Sections 3, 4, and 8 | `UNRESOLVED` | `records-later-event` | All page routes are mapped; source exposes deep-link dependencies, and the accepted report records navigation and cockpit-reconciliation findings without selecting a design. | Exact founder task evidence and separately routed navigation decision. | `CONTROL_THREAD / future information-architecture lane` | No reconciliation surface, navigation repair, or new route is selected or authorized. |
| `A10-GAP-010` | D3-D8 preview observations versus current-main behavior | [A4], [A7], [A9] | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Historical founder evidence remains valid only at its named head/session/ceiling; it is not contradictory to unobserved current behavior. | Direct current-main deployed observation if required. | `CONTROL_THREAD` | No preview-to-production projection and no reconstructed missing packet. |
<!-- A10_GAP_END -->

Observed ledger count: **10 unique gap records**. Genuine current
contradictions: **0**. A11 and A12 remain not started and not authorized.

## 11. Current A10 authority envelope

<!-- A10_ENVELOPE_START -->
| envelope_id | exact_route | work_packet | coordinate | role | repository | exact_base | branch | allowlist | mode | evidence_ceiling | artifact_state | independent_verification | acceptance | merge | downstream_authority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A10-ENV-001` | `CT-2026-07-23-Q3M7Y26-P1-START-A10-FOUNDER-WORKFLOW-SURFACE-MAP-v0` | `Q3M7Y26-P1-A10-v0` | `Q3M7Y26-P1:A10` | `JAI::DEV::BUILDER` | `jai-nexus/dev-jai-nexus` | `1efc6a29fe69629800db50ec1ab710eabb41d69e` | `docs/q3m7y26-p1-a10-founder-workflow-surface-map-v0` | `docs/reference/q3m7y26-p1-a10-founder-workflow-surface-map-v0.md` | `ONE_PATH / DOCUMENTARY / NO_RUNTIME / DRAFT_PR_ONLY` | `DOCUMENTATION_FOUNDER_WORKFLOW_SURFACE_MAP_ONLY` | `ROUTED_CURRENT / UNCOMMITTED / NOT_VERIFIED / NOT_ACCEPTED` | `NOT_RECORDED` | `NOT_RECORDED` | `NOT_AUTHORIZED` | `A11=NOT_GRANTED; A12=NOT_GRANTED; D9=HELD; BATCH_EXIT=NONE; PROGRAM_EXIT=NONE; JAI_ACTIVATION=NONE` |
<!-- A10_ENVELOPE_END -->

The route authorizes only the exact A10 documentary delivery operations named
in the Work Packet. It does not grant the application capabilities cataloged
above. The artifact cannot verify or accept itself, route another lane, or
turn an implementation or mirror record into authority.

### 11.1 Mechanical inventory invariants

| Invariant | Required result |
| --- | --- |
| Page routes | `47 exact routes represented once across surface families` |
| Founder surface records | `35 unique` |
| Navigation-edge records | `8 unique` |
| Auth/role boundary records | `35 unique / one-to-one surface join` |
| Workflow/state records | `17 unique` |
| Outcome/proof records | `10 unique` |
| Recovery/navigation/terminology and observation findings | `21 unique` |
| Founder/customer translation records | `10 unique` |
| Gap/contradiction records | `10 unique / genuine current contradictions 0` |
| Current authority envelopes | `1 unique` |
| Duplicate IDs | `0` |
| Join mismatches or orphan records | `0` |
| Unknown A2 statuses or relations | `0` |
| A11/A12 absorbed implementation or reconciliation records | `0` |
| Positive execution, customer, deployment, Batch-exit, Program-exit, or activation grants | `0` |
| Immutable SHA/path references | `PASS / 87 definitions / 87 unique targets / 0 unresolved` |
| Changed repository paths | `exactly 1, this artifact` |

## 12. Risks, rollback, and explicit non-authorizations

Risks are documentary misclassification, an incomplete route or join,
confusing source presence with runtime behavior, flattening distinct auth
boundaries, promoting phase-specific founder evidence to current deployment,
or turning future-customer hypotheses into product claims. The rollback is a
normal revert of the eventual single documentation commit. No runtime, data,
provider, deployment, customer, or external-system rollback is required.

This artifact does not authorize or perform:

- additional live browser inspection, development server startup, authentication action,
  database access, provider/model/API dispatch, clipboard access, filesystem
  application mutation, or deployed behavior observation;
- source, test, route, UI, auth, middleware, workflow, package, dependency,
  schema, Prisma, application configuration, persistence, provider, or runtime
  change;
- GitHub application mutation beyond the separately authorized A10 branch,
  commit, push, and single Draft-PR delivery envelope;
- Linear mutation, JAI-192 reconciliation, source-of-truth transfer, ownership,
  customer translation, acceptance, ready conversion, merge, deployment, or
  branch deletion;
- A11, A12, D9, Batch B, Batch A exit, Batch D exit, Program exit, provider,
  Agent, Council, customer, production, external-effect, or JAI activation.

`A10_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_FOUNDER_WORKFLOW_SURFACE_MAP_ONLY`

`A10_ACCEPTANCE: NOT_ACCEPTED / PENDING_INDEPENDENT_VERIFICATION`

`A10_MERGE_AUTHORITY: NOT_GRANTED`

`A11_EXECUTION_AUTHORITY: NOT_GRANTED`

`A12_EXECUTION_AUTHORITY: NOT_GRANTED`

`BATCH_A_EXIT_CREDIT: NONE`

`BATCH_B_EXECUTION_AUTHORITY: NOT_GRANTED`

`D9_EXECUTION_AUTHORITY: HELD_PENDING_ACCEPTED_BATCH_B`

`BATCH_D_EXIT_CREDIT: NONE`

`PROGRAM_EXIT_CREDIT: NONE`

`JAI_ACTIVATION_CREDIT: NONE`

`NEXT_REQUIRED_DECISION: ACCEPT_A10_BUILDER_PR_FOR_INDEPENDENT_VERIFICATION`

## 13. Immutable reference definitions

Every repository reference below is pinned to the exact required base. Earlier
historical source heads and founder evidence remain inside A4-A9 and are not
rewritten as current-main runtime proof.

[A2]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md
[A4]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/docs/reference/q3m7y26-p1-a4-ratified-motion-decision-registry-v0.md
[A5]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/docs/reference/q3m7y26-p1-a5-active-frozen-program-registry-v0.md
[A6]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/docs/reference/q3m7y26-p1-a6-control-coordinate-registry-v0.md
[A7]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/docs/reference/q3m7y26-p1-a7-pr-commit-evidence-ledger-v0.md
[A8]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md
[A9]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/docs/reference/q3m7y26-p1-a9-runnable-capability-inventory-v0.md
[ROOT-LAYOUT]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/layout.tsx
[GLOBAL-NAV]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/components/GlobalNav.tsx
[GATEKEEPER]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/gatekeeper.ts
[MIDDLEWARE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/middleware.ts
[AUTH]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/auth.ts
[LOGIN-PAGE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/login/page.tsx
[LOGIN-FORM]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/login/LoginForm.tsx
[LOGOUT]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/components/auth/LogoutButton.tsx
[OPERATOR-LAYOUT]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/layout.tsx
[OPERATOR-SUBNAV]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/components/operator/OperatorSubnav.tsx
[ROOT-PAGE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/page.tsx
[ROOT-OVERVIEW]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/lib/controlPlane/rootOperatorOverview.ts
[OPERATOR-HOME]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/page.tsx
[GLOBAL-REPOS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/repos/page.tsx
[REPO-SURFACE-MODEL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/lib/controlPlane/repoSurfaceModel.ts
[GLOBAL-DOMAINS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/domains/page.tsx
[GLOBAL-EVENTS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/events/page.tsx
[GLOBAL-EVENT-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/events/%5Bid%5D/page.tsx
[OPERATOR-EVENTS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/events/page.tsx
[OPERATOR-AGENTS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/agents/page.tsx
[OPERATOR-GRID]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/grid/page.tsx
[OPERATOR-PROJECTS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/projects/page.tsx
[OPERATOR-WORK]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/work/page.tsx
[OPERATOR-WORK-NEW]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/work/new/page.tsx
[OPERATOR-WORK-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/work/%5Bid%5D/page.tsx
[OPERATOR-PORTFOLIO]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/portfolio-status/page.tsx
[OPERATOR-DELIBERATION]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/deliberation/page.tsx
[OPERATOR-WAVES]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/waves/page.tsx
[OPERATOR-WAVE-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/waves/%5BsessionId%5D/page.tsx
[OPERATOR-CHATS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/chats/page.tsx
[OPERATOR-CHAT-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/chats/%5Bid%5D/page.tsx
[OPERATOR-JAI]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/jai/page.tsx
[OPERATOR-CONTROL-PLANE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/control-plane/page.tsx
[OPERATOR-DESIGN]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/design-system/page.tsx
[OPERATOR-LIVE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/live-dashboard/page.tsx
[OPERATOR-COUNCIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/council-prototype/page.tsx
[OPERATOR-MOTIONS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/motions/page.tsx
[MOTION-PROMOTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/api/operator/motions/promote/route.ts
[OPERATOR-DECISIONS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/decisions/page.tsx
[OPERATOR-DCT]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/dct/page.tsx
[MOTION-CONTROL-PAGE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/motion-control/page.tsx
[MOTION-COMPOSER]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx
[LOCAL-PANEL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/motion-control/LocalOperatingLoopPanel.tsx
[LOCAL-MODEL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/lib/controlPlane/motionKernel/local-operating-loop.ts
[LOCAL-HANDLER]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/lib/controlPlane/motionKernel/local-operating-loop-handler.ts
[LOCAL-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/api/operator/motion-control/local-operating-loop/route.ts
[LOCAL-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/lib/controlPlane/motionKernel/local-operating-loop.test.ts
[MOTION-INTAKE-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/motion-control/motion-intake/route.ts
[MANUAL-INFERENCE-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/motion-control/manual-inference/route.ts
[CONTROL-THREAD-PAGE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/control-thread/page.tsx
[PASSALONG-UI]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx
[PASSALONG-COLLECTION]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/control-thread/passalongs/route.ts
[PASSALONG-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/control-thread/passalongs/%5BpassalongId%5D/route.ts
[PASSALONG-PERSISTENCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/lib/controlPlane/threadMemory/passalong-persistence.ts
[SANDBOX-SURFACE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.ts
[OPERATOR-CORPUS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/corpus/page.tsx
[OPERATOR-CONTEXT]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/operating-context/page.tsx
[OPERATOR-PANELS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/panels/page.tsx
[OPERATOR-PANEL-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/panels/%5BmotionId%5D/%5BpanelId%5D/page.tsx
[OPERATOR-PILOT]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/pilot/page.tsx
[REGISTRY-COVERAGE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/registry/coverage/page.tsx
[REGISTRY-DOMAINS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/registry/domains/page.tsx
[REGISTRY-DOMAIN-NEW]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/registry/domains/new/page.tsx
[REGISTRY-DOMAIN-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/registry/domains/%5Bid%5D/page.tsx
[REGISTRY-REPOS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/registry/repos/page.tsx
[REGISTRY-REPO-NEW]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/registry/repos/new/page.tsx
[REGISTRY-REPO-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/registry/repos/%5Bid%5D/page.tsx
[OPERATOR-REPOS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/repos/page.tsx
[OPERATOR-REPO-DETAIL]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/repos/%5BrepoId%5D/page.tsx
[OPERATOR-REPO-FILE]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/repos/%5BrepoId%5D/file/page.tsx
[OPERATOR-SIGNALS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/signals/page.tsx
[SYNC-REVIEW]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/sync-runs/%5BsyncRunId%5D/review/page.tsx
[SYNC-REVIEW-ACTIONS]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/operator/sync-runs/%5BsyncRunId%5D/review/ReviewActions.tsx
[SYNC-APPLY-API]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/api/operator/sync-runs/%5BsyncRunId%5D/apply/route.ts
[SYNC-REJECT-API]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/api/operator/sync-runs/%5BsyncRunId%5D/reject/route.ts
[INTERNAL-APPLY]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/api/internal/agents/apply/route.ts
[INTERNAL-REJECT]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/portal/src/app/api/internal/agents/reject/route.ts
[ROLEMAP]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/roles/rolemap.json
[ROLE-GUARD]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/.github/workflows/role-guardrails.yml
[PORTAL-CI]: https://github.com/jai-nexus/dev-jai-nexus/blob/1efc6a29fe69629800db50ec1ab710eabb41d69e/.github/workflows/portal-ci-guardrails.yml
