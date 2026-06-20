# dev.jai.nexus Operator Activation Spine v0

## Activation-Spine Thesis

Activation spine does not mean activation. This branch prepares the Operator
information architecture, source posture, route posture, and readiness language
needed before live capabilities can be considered. It does not execute, dispatch,
mutate, evaluate gates, create receipts, update canon, or promote routes.

Commit 1 is the Operator Route Topology Spine only. It makes current route
relationships visible and preserves route questions for a later explicit
CONTROL_THREAD decision.

## Route Topology Posture

Commit 1 keeps the conservative no-promotion posture:

- `/operator` remains the current Operator entry point.
- `/operator/control-plane` remains the current control-plane surface.
- `/operator/live-dashboard` remains a live-readiness prototype, not the
  promoted Operator root.
- `/operator/council-prototype` remains a Council prototype/readiness surface,
  not an active `/operator/council` route.
- `/operator/design-system` remains a design/reference surface.
- `/operator/dct` remains available.
- Legacy top navigation remains available.
- Route topology decision remains pending.

Routes recommend and orient; they do not execute.

## Operator Route Relationship Map

| ID | Route | Labels | Current role | Commit 1 posture |
| --- | --- | --- | --- | --- |
| `SYN-ROUTE-0001` | `/operator` | `PRIMARY`, `READ-ONLY`, `NO ACTIVATION` | Current Operator entry point and orientation surface | Remains root until CONTROL_THREAD decides otherwise |
| `SYN-ROUTE-0002` | `/operator/control-plane` | `PRIMARY`, `CONTROL PLANE`, `READ-ONLY` | Current control-plane surface | Retained; no redirect, replacement, or specialization decision |
| `SYN-ROUTE-0003` | `/operator/live-dashboard` | `SECONDARY`, `PROTOTYPE`, `PENDING DECISION` | Live-readiness prototype and future cockpit candidate | Not promoted to `/operator` |
| `SYN-ROUTE-0004` | `/operator/council-prototype` | `SECONDARY`, `PROTOTYPE`, `PENDING DECISION` | Council advisory prototype/readiness surface | Not promoted to `/operator/council` |
| `SYN-ROUTE-0005` | `/operator/design-system` | `SECONDARY`, `REFERENCE`, `READ-ONLY` | Operator Slate design/reference surface | Retained as reference; does not govern route state |
| `SYN-ROUTE-0006` | `/operator/dct` | `SECONDARY`, `COMPATIBILITY`, `READ-ONLY POSTURE` | Decision/context tooling projection surface | Remains available; no DCT removal or semantics change |
| `SYN-ROUTE-0007` | legacy top nav | `LEGACY`, `COMPATIBILITY`, `READ-ONLY LINKS` | Existing global/top navigation posture | Remains available and unchanged |

All records above are synthetic route-topology fixtures. They describe route
posture only and are not live route-state records.

## Pending Route Topology Decisions

- Should `/operator/live-dashboard` become `/operator`?
- Should `/operator/council-prototype` become `/operator/council`?
- Should `/operator/control-plane` remain, redirect, or become a specialized
  subsection?
- Should `/operator/design-system` remain in subnav?
- Should DCT remain in subnav?
- Should legacy top nav remain?
- Should phase-clustered navigation be introduced?
- Which route should become the primary future live cockpit once gates exist?

## Current Allowed Behavior

- `READ-ONLY` route relationship cards, route labels, and explanatory copy.
- Static `SYN-*` route-topology readiness records.
- Existing accepted canonical reads where already present.
- Existing local/static fixture display.
- Existing local-only `REAL-COMPOSE` copy behavior where already labeled.
- `GATED`, `BLOCKED`, `FUTURE`, and `NOT AUTHORIZED IN V0` labels for future or
  unauthorized capabilities.
- Manual handoff language for later route decisions.

## Current Blocked Behavior

- Route promotion, route redirect, route removal, or destructive redirect.
- DCT removal or legacy top-nav removal.
- Control-plane replacement or council-prototype deletion.
- Runtime execution, route-state mutation, motion-state mutation, gate
  evaluation, receipt creation, or canon update.
- Provider/model dispatch, live model calls, Agent execution, Agent dispatch, or
  GitHub integration.
- New API routes, new server actions, Prisma changes, DB write expansion,
  telemetry, auth/session changes, hidden persistence, production behavior, or
  customer-data handling.

## Non-Authorizations

This commit and branch do not authorize execution, provider/model dispatch, live
model calls, Agent execution, GitHub API use, repo mutation, file mutation,
branch creation, PR creation, push, merge, commit automation, branch/PR
automation, browser/desktop control, terminal/command execution, schedulers,
autonomous loops, retrieval engines, automatic context injection, live memory
writes, live settings mutation, `.jai` parser/runtime behavior, `.nexus` active
semantics, policy enforcement, automatic scoring, automatic synthesis, automatic
best-agent selection, automatic gate evaluation, receipt creation, canon update,
route-state mutation, motion-state mutation, or opened execution gates.

ZERO GATES GRANTED.

## Pre-Existing Mutation-Capable Paths

The following known paths pre-exist this commit. Commit 1 does not remove,
expand, authorize, or present them as newly authorized:

- `/operator/registry/repos` admin-gated `repos.yaml` import with DB upsert.
- `/operator/sync-runs/[syncRunId]/apply`.
- `/operator/sync-runs/[syncRunId]/reject`.
- DCT API mutation endpoints behind their existing internal-token posture.

## Recommended Later Commit Sequence

1. Commit 2: canonical read-only spine.
2. Commit 3: JAI and JAI Council operator spine.
3. Commit 4: Agents readiness posture and staged-agent non-execution boundary.
4. Commit 5: Palette/Grid readiness posture and visual/source labeling.
5. Commit 6: development compose spine and local-only handoff language.
6. Commit 7: `.jai`, receipt, gate, and dependency readiness documentation.
7. Commit 8: final activation-spine closeout, audit consolidation, and
   validation summary.

Later commits must preserve the hard boundary: CONTROL_THREAD decides.

## Commit 2: Canonical Read-Only Operator Spine

Canonical read-only display is not authority. Commit 2 makes existing state
easier to scan by separating source posture, freshness posture, and authority
posture across the Operator cockpit. It does not create, mutate, accept,
validate, confirm, route, receipt, score, synthesize, or activate anything.

The shared canonical read-only spine uses only values already available to the
touched route at render time. It does not introduce new fetch behavior, API
routes, server actions, DB writes, subscriptions, persistence, or runtime
dispatch.

### Canonical Read-Only Spine Thesis

Operators need to know what they are looking at before they can decide what to
do with it. Commit 2 distinguishes:

- accepted or bundled read-only motion posture;
- DB read-only tables and partial event streams;
- YAML-backed canonical or configuration posture where already present;
- derived counts and groupings;
- fixture and synthetic readiness records;
- unknown-source or unknown-freshness records.

Read-only source display can inform CONTROL_THREAD review, but it cannot become
CONTROL_THREAD review.

### Accepted Read-Only Source Posture

| Surface | Source posture | Freshness posture | Authority posture |
| --- | --- | --- | --- |
| `/operator/control-plane` | Mixed read-only canonical motion posture plus synthetic fixture panels | Motion source label from existing queue index; fixture snapshot label for local panels | Display-only; no gate evaluation or activation |
| `/operator/motions` | `READ-ONLY CANONICAL` motion package browser | Existing source label and stored package snapshot | Browser only; guarded promotion path remains separate and pre-existing |
| `/operator/decisions` | `DB READ-ONLY` extracted decision rows | Query-time DB read; extraction freshness manual/unknown | Extracted claims, not receipts or canon |
| `/operator/repos` | `DB READ-ONLY` repo registry rows | Query-time DB read; sync freshness not verified | Repo display only; no repo mutation or GitHub authority |
| `/operator/events` | `DB READ-ONLY` partial event stream | Query-time DB read; partial stream coverage | Evidence display only; not acceptance or receipt creation |
| `/operator/portfolio-status` | `FIXTURE` checked-in portfolio status | Fixture status date where recorded; upstream freshness not fetched | Static local portfolio view, not live portfolio state |

### Route-Level Source Labels

Commit 2 uses these labels conservatively:

- `READ-ONLY CANONICAL` for existing motion package posture displayed as stored
  reference state.
- `DB READ-ONLY` for database reads that are not writable through the display.
- `YAML-BACKED CANONICAL` for accepted YAML/config sources where a route already
  exposes them. Commit 2 does not add a new YAML loader.
- `DERIVED` for counts, groupings, highest IDs, and summaries computed from an
  already-read source.
- `PARTIAL STREAM` for event and lineage views that are known not to cover all
  governance artifacts.
- `FIXTURE` for checked-in static readiness or portfolio records.
- `SYNTHETIC` for `SYN-*` readiness records.
- `UNKNOWN SOURCE` when freshness, upstream origin, or coverage cannot be
  verified from the current route.

### Current Allowed Behavior

- Display source posture and freshness posture.
- Link to existing Operator routes.
- Show read-only canonical, DB read-only, derived, partial, fixture, synthetic,
  and unknown-source summaries.
- Show latest motion, attention, risk, stale/partial-source, and source-ref
  posture when already available from accepted read-only sources.
- Preserve existing read-only filters and links.

### Current Blocked Behavior

- New API behavior, server actions, DB writes, Prisma changes, telemetry,
  auth/session changes, hidden persistence, or localStorage/sessionStorage as a
  system of record.
- Motion-state mutation, route-state mutation, canon update, receipt creation,
  automatic gate evaluation, automatic scoring, automatic synthesis, or
  automatic best-agent selection.
- Provider/model dispatch, live model calls, Agent execution, Agent dispatch,
  GitHub integration, GitHub API use, repo mutation, branch creation, PR
  creation, push, merge, commit automation, or branch/PR automation.
- Runtime activation, execution gates, scheduler behavior, autonomous loops,
  retrieval engines, automatic context injection, live memory writes, live
  settings mutation, customer-data handling, or production behavior.

### Stale, Partial, Derived, And Unknown-Source Handling

Stored status is not live verification unless the surface explicitly names a
live verification source. Derived counts are not source-of-truth. Fixture and
synthetic records are not canonical. Unknown or unverified freshness is labeled
as unknown, fixture-backed, partial, or manually maintained rather than current.

### No-Mutation Posture

The canonical read-only spine is presentational. It receives values from existing
route reads and renders cards with `READ-ONLY`, `DISPLAY IS NOT AUTHORITY`, and
`NO MUTATION` posture. It adds no submit behavior and no new copy behavior.

ZERO GATES GRANTED.

### Relationship To Later Commits

Commit 3 covers the JAI and Council spine. Commit 4 covers Agents. Commit 5
covers Palette/Grid. Commit 6 should cover development compose spine.
Commit 7 should cover `.jai`, receipt, and gate alignment. Commit 8 should
consolidate final audit and closeout posture. Later commits must not reinterpret
Commit 2 source labels as authorization.

## Commit 3: JAI + Council Operator Spine

JAI/Council operator spine does not mean live JAI runtime or live Council
runtime. Commit 3 connects the existing JAI shell, Council prototype,
control-plane, and live-dashboard readiness views so operators can see how JAI,
JAI Council, model slots, advisory returns, dissent, contradictions, and
CONTROL_THREAD relate before any activation decision exists.

The shared JAI/Council spine remains read-only and compose-only. It adds no
provider SDK, model call, Council dispatch, automatic synthesis, best-model
selection, receipt creation, canon update, state mutation, persistence, or
runtime activation.

### JAI Operator-Spine Posture

JAI is not live runtime in v0. `/operator/jai` remains a local static shell for
draft prompt reference and read-only control-plane context. Prompt text is not
dispatch. Draft selection is not submission. Display does not grant authority.

Allowed JAI posture in Commit 3:

- read-only context and route links;
- local-only `REAL-COMPOSE` readiness prompt drafting;
- manual handoff language;
- fixture/synthetic readiness records;
- blocked provider/model dispatch and live model calls.

Blocked JAI posture in Commit 3:

- provider/model SDK use;
- model calls or live model calls;
- hidden persistence or memory writes;
- automatic context injection or retrieval engine;
- execution, Agent dispatch, or repo mutation.

### Council Operator-Spine Posture

JAI Council is advisory only. Council agreement is not authority. Model-slot
output produces claims, not facts. Advisory output can be reviewed, but it cannot
decide, merge into canon, create a receipt, dispatch a model, execute, or
advance route/motion state.

The Council prototype remains `/operator/council-prototype`; it is not promoted
to `/operator/council`.

### Council Session Lifecycle Readiness

Commit 3 exposes a synthetic lifecycle map:

| ID | Phase | Allowed posture | Boundary |
| --- | --- | --- | --- |
| `SYN-JAI-LIFE-0001` | draft | Local prompt or packet draft may be composed | `REAL-COMPOSE` only; no submit or persistence |
| `SYN-JAI-LIFE-0002` | route | Manual operator handoff may carry draft text | Routes recommend; they do not execute |
| `SYN-JAI-LIFE-0003` | advisory return | Return can be reviewed as claims and evidence refs | Return cannot decide, dispatch, merge, or create receipts |
| `SYN-JAI-LIFE-0004` | dissent review | Dissent remains visible | No synthesis override and no majority collapse |
| `SYN-JAI-LIFE-0005` | contradiction review | Contradictions remain visible | No automatic scoring, resolution, or best-model selection |
| `SYN-JAI-LIFE-0006` | CONTROL_THREAD decision | Operator decision boundary remains outside Council agreement | Validation is not acceptance; CONTROL_THREAD decides |
| `SYN-JAI-LIFE-0007` | receipt requirement | Future accepted decisions require receipt design | Receipts record; they do not decide |
| `SYN-JAI-LIFE-0008` | canon update | Canon merge remains blocked | No output merge into canon and no canon update |

All lifecycle records are synthetic `SYN-*` readiness records, not live Council
session state.

### Model-Slot Readiness Posture

Model slots are represented as fixture/synthetic readiness records only. They do
not imply provider credentials, model health, dispatch availability, live
provider state, automatic best-agent selection, or best-model selection.

Current represented slots:

- Builder model slot: draft claims only; provider/model dispatch gate required.
- Challenger model slot: dissent and objections; Council session gate required.
- Evidence model slot: evidence-linked claims; evidence/source gate required.
- Future JAI slot: reserved; JAI runtime gate required.

### Advisory Output Boundary

Advisory output may include claims, evidence refs, dissent, contradictions,
unresolved questions, and blockers. Advisory output cannot:

- decide;
- accept;
- validate itself;
- synthesize automatically;
- become canon;
- create a receipt;
- update route state or motion state;
- dispatch a model, provider, Agent, tool, or repo action.

### Dissent And Contradiction Visibility

Dissent must remain visible. Contradictions must remain visible. Neither Council
agreement, synthesis polish, model-slot majority, nor route recommendation may
hide dissent or resolve contradictions automatically.

### CONTROL_THREAD Decision Boundary

CONTROL_THREAD decides. Validation is not acceptance. Receipts record; they do
not decide. Council agreement is not authority. Readiness display is not
authority.

Any future Council-assisted decision path requires explicit CONTROL_THREAD
review, source/evidence review, dissent and contradiction review, named gates,
and a receipt model after acceptance.

### Required Future Gates And Receipts

Future activation would require at least:

- provider/model dispatch gate;
- Council session gate;
- evidence/source gate;
- JAI runtime gate;
- operator confirmation gate;
- receipt model for accepted decisions;
- canon update authority model.

All remain closed or undefined in Commit 3. ZERO GATES GRANTED.

### Relationship To Other Spines

Commit 3 builds on Commit 2 source posture by labeling JAI/Council records as
fixture, synthetic, advisory, read-only, or compose-only. Commit 4 covers
Agents. Commit 5 covers Palette/Grid. Commit 6 should cover development
compose posture. Commit 7 should cover `.jai`, receipt, and gate alignment.
Commit 8 should consolidate final audit and closeout posture.

## Commit 4: JAI Agents Operator Spine

Agent operator spine does not mean Agent execution. Commit 4 connects staged
Agent lane readiness to the Operator cockpit so operators can see candidate
lifecycle, blocked authority classes, expected artifacts, validation
requirements, receipt expectations, rollback requirements, manual handoff
posture, and cross-surface route context before any Agent runtime exists.

The shared Agent spine remains read-only and compose-only. It adds no tool
invocation, Agent runner, scheduler, autonomous loop, GitHub integration, repo
write, file mutation, browser or desktop control, terminal command, branch or PR
automation, receipt creation, canon update, route-state mutation, motion-state
mutation, gate evaluation, persistence, or execution.

### Agent Operator-Spine Posture

Agents are staged, not executing. Agent lane candidate does not execute. No
Agent execution authority exists in v0. `/operator/agents` remains the Agent
registry and readiness surface. `/operator/work` remains the deterministic
agenda and manual work handoff surface. Commit 4 places the shared Agent spine
in the control plane and live-dashboard context without changing route
promotion, navigation, or backend behavior.

Allowed Agent posture in Commit 4:

- `READ-ONLY` Agent readiness review;
- `REAL-COMPOSE` local Agent handoff draft;
- `MANUAL HANDOFF` language for CONTROL_THREAD review;
- `SYN-*` staged lane candidate and lifecycle records;
- blocked authority display for tools, runners, schedulers, repos, terminal,
  browser, GitHub, branch/PR automation, receipts, canon, and gates.

Blocked Agent posture in Commit 4:

- tool invocation, Agent runner, scheduler, or autonomous loop;
- GitHub integration, GitHub API use, repo write, file mutation, branch
  creation, PR creation, push, merge, or commit automation;
- browser or desktop control;
- terminal or command execution;
- Agent dispatch or Agent execution;
- receipt creation, canon update, rollback execution, or gate evaluation.

### Agent Lane Candidate Lifecycle

Commit 4 exposes a synthetic lifecycle map:

| ID | Phase | Allowed posture | Boundary |
| --- | --- | --- | --- |
| `SYN-AGENT-LIFE-0001` | candidate drafted | `READ-ONLY` | Candidate record describes a possible lane; it does not execute |
| `SYN-AGENT-LIFE-0002` | manual handoff composed | `REAL-COMPOSE` | Local clipboard draft only; no submit, dispatch, or persistence |
| `SYN-AGENT-LIFE-0003` | validation expected | `GATED` | Validation evidence is required later, but validation is not acceptance |
| `SYN-AGENT-LIFE-0004` | artifact expected | `FUTURE` | Artifact shape is named for handoff; no files are written here |
| `SYN-AGENT-LIFE-0005` | receipt expected | `FUTURE` | Receipt expectation is not receipt creation and grants no authority |
| `SYN-AGENT-LIFE-0006` | rollback expected | `MANUAL HANDOFF` | Rollback must be documented for future work; rollback does not execute |
| `SYN-AGENT-LIFE-0007` | execution blocked | `BLOCKED` | No Agent runner, tools, terminal command, browser control, or repo mutation |
| `SYN-AGENT-LIFE-0008` | CONTROL_THREAD decision required | `NOT AUTHORIZED IN V0` | CONTROL_THREAD decides before any future gate, receipt, or canon path |

All lifecycle records are synthetic readiness records, not live Agent runtime
state.

### Blocked Agent Authority Classes

Commit 4 keeps these classes visibly blocked: tool invocation, Agent runner,
scheduler, autonomous loop, terminal or command execution, repo mutation, branch
creation, PR creation, branch/PR automation, browser/desktop control,
provider/model dispatch, live model calls, receipt creation, canon update, and
gate evaluation.

### Expected Artifacts

Agent lane candidates may name expected artifacts for future manual review:
plan, diff summary, validation transcript, closeout passalong, receipt request,
and rollback note. These are expectations only. They do not write files, create
receipts, update canon, open PRs, run checks, or execute rollback.

### Validation Requirements

Validation requirements name evidence an operator would need before a later
CONTROL_THREAD decision. Validation does not accept work, select an Agent,
create a receipt, merge output into canon, evaluate gates, or open execution
authority.

### Receipt Expectations

Receipt expectations remain future-facing. Receipts record; they do not decide.
Commit 4 does not create receipts, request a live receipt service, write receipt
files, or grant gates.

### Rollback Requirements

Rollback requirements are documentation expectations. They do not execute
rollback, call tools, mutate repos, revert files, run terminal commands, or
change route or motion state.

### Local-Only Handoff Posture

The Agent handoff composer is `REAL-COMPOSE` only. It copies local draft text
for manual handoff and has no submit path, persistence, dispatch behavior, tool
invocation, Agent execution, GitHub API call, repo write, receipt creation,
canon update, route-state mutation, or motion-state mutation.

### Pre-Gate Allowed Behavior

Before gates exist, the Agent spine permits only:

- read readiness;
- compose a local handoff draft;
- copy a local draft;
- manually route outside the app through CONTROL_THREAD.

### Required Future Gates And Receipts

Future Agent activation would require explicit CONTROL_THREAD authority, named
Agent execution gates, tool-invocation gates, repo and branch/PR gates where
applicable, browser/desktop or terminal gates where applicable, validation
evidence, rollback documentation, and receipt design. All remain closed or
undefined in Commit 4.

ZERO GATES GRANTED.

### Relationship To Other Spines

Commit 4 builds on Commit 2 source posture by labeling Agent records as
synthetic, read-only, advisory, gated, blocked, manual handoff, or compose-only.
It builds on Commit 3 by keeping model/Council output advisory and separate from
Agent execution. Commit 5 covers Palette/Grid. Commit 6 should cover
development compose posture. Commit 7 should cover `.jai`, receipt, and gate
alignment. Commit 8 should consolidate final audit and closeout posture.

## Commit 5: JAI Palette + JAI Grid Operator Spine

Palette/Grid operator spine does not mean retrieval, memory, dispatch, live
context injection, customer-data handling, or execution. Commit 5 connects
Palette and Grid readiness to the Operator cockpit so operators can understand
context assembly, operational-state display, project/repo/work relationships,
queues, capability maps, source posture, freshness posture, privacy boundaries,
customer-data boundaries, and live-readiness blockers before any runtime exists.

The shared Palette/Grid spine remains read-only and compose-only. It adds no
retrieval engine, automatic context injection, live memory write, hidden
persistence, customer-data handling, model dispatch, Agent dispatch, execution,
API route, server action, DB write, Prisma change, receipt creation, canon
update, route-state mutation, motion-state mutation, gate evaluation, or live
runtime activation.

### Palette Operator-Spine Posture

Palette assembles context; it does not authorize. Palette readiness represents
project context, repo context, motion/receipt context, Council context, Agent
lane context, source posture, freshness posture, blocked context classes, the
customer-data boundary, and the privacy boundary.

Allowed Palette posture in Commit 5:

- `READ-ONLY` context readiness review;
- `REAL-COMPOSE` local context packet draft;
- `MANUAL HANDOFF` language for CONTROL_THREAD review;
- `SYN-*` context assembly lifecycle records;
- source and freshness labels for canonical, DB, YAML, derived, partial,
  fixture, synthetic, and unknown-source context.

Blocked Palette posture in Commit 5:

- retrieval engine;
- automatic context injection;
- live memory writes or hidden persistence;
- customer-data handling;
- model dispatch or Agent dispatch;
- source selection as authority;
- unknown-source context appearing canonical.

### Grid Operator-Spine Posture

Grid displays operational state; it does not execute. Grid readiness represents
the operational-state map, project/repo/work relationships, workflow lanes,
route queues, motion queues, work queues, capability maps, live-readiness
blockers, and source posture.

Allowed Grid posture in Commit 5:

- `READ-ONLY` operational-state display;
- relationship and queue posture cards;
- capability map cards labeled as gated/readiness posture;
- route links to existing Operator surfaces.

Blocked Grid posture in Commit 5:

- execution;
- route-state or motion-state mutation;
- repo/file mutation;
- branch or PR automation;
- scheduler or autonomous loop;
- automatic gate evaluation;
- dashboard state as authorization.

### Context Assembly Posture

Commit 5 exposes a synthetic Palette lifecycle map:

| ID | Phase | Allowed posture | Boundary |
| --- | --- | --- | --- |
| `SYN-PALETTE-LIFE-0001` | select context class | `READ-ONLY` | Context class selection orients review; it does not authorize |
| `SYN-PALETTE-LIFE-0002` | label source posture | `READ-ONLY` | Unknown-source context must remain unknown, not canonical |
| `SYN-PALETTE-LIFE-0003` | check freshness | `GATED` | Freshness is a label, not live verification or acceptance |
| `SYN-PALETTE-LIFE-0004` | exclude blocked context | `BLOCKED` | Customer data, private memory, unknown-source canon, and injection remain blocked |
| `SYN-PALETTE-LIFE-0005` | compose packet locally | `REAL-COMPOSE` | Clipboard draft only; no retrieval, injection, persistence, or dispatch |
| `SYN-PALETTE-LIFE-0006` | manual handoff only | `MANUAL HANDOFF` | CONTROL_THREAD decides; packet display does not grant authority |

All lifecycle records are synthetic readiness records, not live retrieval or
context-injection state.

### Operational-State Map Posture

Commit 5 exposes a synthetic Grid lifecycle map:

| ID | Phase | Allowed posture | Boundary |
| --- | --- | --- | --- |
| `SYN-GRID-LIFE-0001` | display relationships | `READ-ONLY` | Project/repo/work relationships are display posture only |
| `SYN-GRID-LIFE-0002` | display queues | `READ-ONLY` | Route, motion, and work queues do not schedule or execute |
| `SYN-GRID-LIFE-0003` | display capability map | `GATED` | Capability display is not activation or gate evaluation |
| `SYN-GRID-LIFE-0004` | display blockers | `BLOCKED` | Blockers remain visible and cannot be bypassed by dashboard state |
| `SYN-GRID-LIFE-0005` | no execution | `NOT AUTHORIZED IN V0` | Grid displays operational state; it does not execute |
| `SYN-GRID-LIFE-0006` | no mutation | `NOT AUTHORIZED IN V0` | No route-state, motion-state, repo, file, receipt, canon, or memory mutation |

All lifecycle records are synthetic readiness records, not active operational
state.

### Source Posture And Freshness Labels

Commit 5 uses the existing Commit 2 source label vocabulary for Palette/Grid
context:

- `READ-ONLY CANONICAL` for accepted stored shapes shown for review;
- `DB READ-ONLY` for database rows read for display;
- `YAML-BACKED CANONICAL` for checked-in canonical/config source;
- `DERIVED` for computed display values;
- `PARTIAL STREAM` for known partial queue or event posture;
- `FIXTURE` for local/static readiness records;
- `SYNTHETIC` for `SYN-*` future readiness records;
- `UNKNOWN SOURCE` for context that must remain conservative and never appear
  canonical.

Stored status is not live verification. Context selection is not authority.
Unknown-source context must not appear canonical.

### Blocked Context Classes

Commit 5 keeps these classes visibly blocked: unknown-source context as
canonical, unknown-source records, stale records as current, customer-data
handling, private context without policy, private memory writes, hidden
persistence, automatic context injection, retrieval engine, live memory write,
model dispatch, Agent dispatch, execution, gate evaluation, receipt creation,
and canon update.

### Customer-Data And Privacy Boundaries

Customer data is not handled in this readiness surface. Private,
unknown-source, or customer-origin context remains blocked unless future gates,
provenance, privacy review, customer-data authorization, and receipts are
explicitly established by CONTROL_THREAD.

Privacy boundaries are not optional. Read-only context display does not allow
customer-data handling, private memory writes, hidden persistence, automatic
context injection, or production behavior.

### Project / Repo / Work Relationships

Grid relationship cards represent project, repo, and work posture only.
Relationships do not route work, mutate repos, create branches, create PRs,
dispatch Agents, schedule work, or evaluate gates.

### Route / Motion / Work Queue Posture

Route queues recommend; they do not execute. Motion queues display read-only
posture; they do not mutate motion state. Work queues display agenda posture;
they do not schedule, dispatch, run Agents, or operate terminal/browser tools.

### Capability Map Posture

Capability map cards describe readiness only. Palette can frame context packets;
it cannot inject them. Grid can display state; it cannot execute state. Council
context remains advisory claims, not facts. Agent lane context remains staged,
not executing or dispatching.

### Local-Only Context Packet Posture

The context packet composer is `REAL-COMPOSE` only. It copies local draft text
for manual handoff and has no submit path, retrieval behavior, automatic
context injection, persistence, live memory write, customer-data handling, model
call, Agent dispatch, receipt creation, canon update, route-state mutation, or
motion-state mutation.

### Live-Readiness Blockers

Palette/Grid live readiness remains blocked by no retrieval engine, no
automatic context injection, no customer-data handling, no live memory writes,
no model dispatch, no Agent dispatch, no execution gates, and no receipt/canon
authority model.

ZERO GATES GRANTED.

### Relationship To Other Spines

Commit 5 builds on Commit 2 source posture by carrying source and freshness
labels into context assembly and operational-state display. It builds on Commit
3 by keeping Council context advisory. It builds on Commit 4 by keeping Agent
lane context staged and non-executing. Commit 6 should cover development
compose posture. Commit 7 should cover `.jai`, receipt, and gate alignment.
Commit 8 should consolidate final audit and closeout posture.
