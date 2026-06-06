# Operator Portfolio Status Fixture Maintenance v0

## Status

Docs-maintenance checklist only.

This artifact defines how to maintain the static Operator Portfolio Status
fixture and surface after CONTROL_THREAD routes a bounded fixture maintenance
lane. It does not change fixture data, portal code, API behavior, runtime
behavior, automation, telemetry, or production authority.

## Purpose

The static portfolio status fixture gives the Operator Control Plane a local,
checked-in visibility surface for current portfolio batch planning, repo lanes,
known risks, deferred work, and next prompts.

The fixture is a snapshot aid for operator review. It is not live status, not a
repo synchronization mechanism, not an execution surface, and not planning canon
until CONTROL_THREAD accepts the content.

## Current Surface

- UI route: `/operator/portfolio-status`
- Fixture file: `portal/src/lib/controlPlane/portfolioStatusFixture.ts`
- Page file: `portal/src/app/operator/portfolio-status/page.tsx`
- Navigation file: `portal/src/components/operator/OperatorSubnav.tsx`

Current posture:

- static
- local
- checked-in fixture backed
- read-only
- non-live
- non-canonical until CONTROL_THREAD acceptance

## Fixture Shape

The fixture is intentionally plain and inspectable. At a high level, it contains:

- `generated_label`: human-readable fixture label and snapshot marker.
- `status_note`: visible static/local/non-live posture statement.
- `source_refs`: docs, plans, or accepted passalongs used as source context.
- `non_authorizations`: explicit list of behaviors the surface does not grant.
- `batches`: portfolio batch summaries and lane membership.
- `lanes`: repo lane entries with repo, branch, artifact, status, scope, work,
  risks, and prompts.
- `active_work`: top-level active work summary.
- `queued_work`: top-level queued work summary.
- `deferred_work`: top-level deferred work summary.
- `risks`: top-level stale-data, authority, or interpretation risks.
- `next_prompts`: suggested next CONTROL_THREAD prompts or review actions.

These fields are display data only. They do not imply API persistence, live
status refresh, automatic passalong ingestion, validation execution, routing
authority, or agent authority.

## Maintenance Triggers

The fixture should be updated only after a bounded CONTROL_THREAD route when one
or more of the following changes:

- CONTROL_THREAD accepts, rejects, pauses, holds, blocks, or settles a portfolio
  lane represented by the fixture.
- A portfolio batch opens, closes, or changes lane membership.
- A lane passalong is accepted and reconciled by CONTROL_THREAD.
- A recommended next route changes after CONTROL_THREAD reconciliation.
- A queued or deferred lane changes posture.
- A source reference becomes outdated, renamed, or superseded.
- A stale fixture label could mislead operators about the snapshot date or
  planning baseline.

The fixture should not be updated from speculative context, unaccepted
passalongs, live repo state, inferred status, provider output, telemetry, or
automation.

## Manual Update Checklist

Before editing the fixture:

- Confirm CONTROL_THREAD routed a docs or local-static-fixture maintenance lane.
- Confirm the lane authorizes fixture content changes, not API, DB, runtime, or
  automation behavior.
- Identify the accepted source refs or passalongs that justify each status
  change.
- Confirm the fixture remains static, local, checked-in, non-live, and
  non-canonical until accepted.

When editing the fixture:

- Update `generated_label` when the snapshot date, batch, or baseline changes.
- Keep `status_note` explicit about static/local/non-live posture.
- Add or remove `source_refs` only for inspected and relevant source artifacts.
- Keep `non_authorizations` complete and visible.
- Update `batches` and `lanes` from CONTROL_THREAD-accepted context only.
- Keep `active_work`, `queued_work`, and `deferred_work` aligned with lane
  status.
- Keep `risks` current, especially stale-data and live-status confusion risks.
- Keep `next_prompts` framed as manual CONTROL_THREAD prompts, not executable
  actions.
- Avoid adding imports, fetches, API calls, generated schemas, scripts, or
  automation.

Before closeout:

- Inspect the fixture diff for accidental authority expansion.
- Inspect the rendered page or component diff if UI files were intentionally
  routed.
- Confirm no portal source files were touched for docs-only maintenance lanes.
- Return a passalong that states whether the fixture remains non-canonical or
  has been accepted by CONTROL_THREAD.

## Validation Checklist

For docs-only maintenance:

- Run `git status --short`.
- Run `git diff --check`.
- Run repo-local Markdown tooling only when clearly available.
- Do not run portal build or typecheck unless portal source files changed or the
  repo convention requires it for docs-only changes.

For fixture-content maintenance:

- Run `git status --short`.
- Run `git diff --check`.
- Inspect the fixture diff.
- Verify the route remains `/operator/portfolio-status`.
- Verify labels still state static, local, checked-in fixture backed, non-live,
  and non-canonical until accepted.
- Run repo-supported app checks only when the routed lane touches portal source
  files.

## Canon / Authority Boundary

Static local fixture visibility:

- Checked-in display data for the Operator Control Plane.
- Useful for review, planning visibility, and manual status scanning.
- May be stale or incomplete.
- Does not become canon by appearing in the UI.

CONTROL_THREAD accepted canon:

- Created only when CONTROL_THREAD reviews and accepts the fixture content or a
  related planning/reference artifact.
- Owns cross-repo prioritization, lane settlement, dependency reconciliation,
  and next-route decisions.
- May use fixture content as input, but acceptance must be explicit.

Future live operating loop behavior:

- Deferred and unauthorized by this artifact.
- Would require separate governance, API/data model review, audit/privacy
  review, validation strategy, authority design, production boundaries, and
  human approval gates.

## Explicit Non-Authorizations

This artifact does not authorize:

- API/DB-backed status
- passalong ingestion
- provider/model calls
- runtime execution
- branch/PR automation
- terminal/browser/desktop control
- telemetry
- customer data handling
- production workload authority
- live repo synchronization
- automatic validation
- route dispatch
- agent approval
- autonomous execution
- autonomous merge
- remediation controls

## Risks and Mitigations

Risk: static fixture data may become stale after CONTROL_THREAD decisions.

Mitigation: update `generated_label`, `source_refs`, and represented lane status
only through routed maintenance lanes after accepted source context exists.

Risk: operators may mistake the surface for live status.

Mitigation: keep `status_note`, visible labels, and `non_authorizations`
explicit on every fixture revision.

Risk: fixture content may be mistaken for CONTROL_THREAD canon.

Mitigation: preserve the distinction between local visibility and accepted
canon, and require CONTROL_THREAD acceptance before treating content as
planning canon.

Risk: passalong review may drift into automatic ingestion.

Mitigation: require human-submitted, CONTROL_THREAD-reconciled passalongs before
fixture updates.

Risk: future convenience pressure may soften approval gates.

Mitigation: keep route selection, fixture acceptance, lane settlement, batch
closeout, and expansion approvals manual until separately governed.

Risk: a future UI update may imply controls or execution authority.

Mitigation: keep this surface read-only unless a separate route authorizes a
governed expansion.

## Future Gates Before Expansion

Before any live, API-backed, DB-backed, automated, or production-facing
portfolio status surface, CONTROL_THREAD must separately approve:

- source-of-truth model for portfolio batches, lanes, passalongs, and status
- API/data model design
- database persistence model
- passalong intake and reconciliation policy
- audit, privacy, and customer-data boundary review
- authentication and authorization model
- validation strategy and failure handling
- telemetry policy, if any
- provider/model authority, if any
- runtime execution authority, if any
- branch/PR automation authority, if any
- production deployment and support boundary
- human approval gates for route launch, passalong acceptance, lane settlement,
  batch closeout, and escalation

No future gate is satisfied by this maintenance checklist.

## Recommended Next Route

Use this checklist for future static fixture updates after CONTROL_THREAD routes
a bounded fixture maintenance lane.

Recommended next route:

- CONTROL_THREAD reviews and accepts this maintenance checklist.
- Continue maintaining the portfolio status surface as static, local,
  checked-in fixture visibility only.
- Defer live/API/DB-backed portfolio status behavior until a separate
  governance and implementation route is accepted.
