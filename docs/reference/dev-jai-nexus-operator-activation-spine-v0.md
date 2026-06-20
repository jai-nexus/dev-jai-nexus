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

1. Commit 2: canonical read-only spine, JAI, and JAI Council readiness surfaces.
2. Commit 3: Agents readiness posture and staged-agent non-execution boundary.
3. Commit 4: Palette/Grid readiness posture and visual/source labeling.
4. Commit 5: development compose spine and local-only handoff language.
5. Commit 6: `.jai`, receipt, gate, and dependency readiness documentation.
6. Commit 7: source posture and audit consolidation.
7. Commit 8: final activation-spine closeout and validation summary.

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

Commit 3 should cover the JAI and Council spine. Commit 4 should cover Agents.
Commit 5 should cover Palette/Grid. Commit 6 should cover development compose
spine. Commit 7 should cover `.jai`, receipt, and gate alignment. Commit 8
should consolidate final audit and closeout posture. Later commits must not
reinterpret Commit 2 source labels as authorization.
