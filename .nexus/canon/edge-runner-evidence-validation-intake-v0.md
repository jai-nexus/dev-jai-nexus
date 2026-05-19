# Edge Runner Evidence Validation Intake v0

## Purpose

Update `dev-jai-nexus` control-plane canon to include the settled
`orchestrator-nexus` dry-run evidence validation layer from PR `#14` while
preserving static/read-only visibility only.

## Source baseline

- `dev-jai-nexus` is settled through `motion-0240`
- `orchestrator-nexus` is settled through PR `#14`
- existing `dev-jai-nexus` Edge Runner surfaces already record dry-run
  readiness, visibility boundaries, and denied execution authority

## orchestrator-nexus PR #14 source-side evidence validation context

PR `#14` adds a source-side evidence validation layer for dry-run evidence
records.

Settled source-side posture:

- dry-run evidence record schema exists
- dry-run evidence record example exists
- evidence record validator exists
- valid evidence fixtures exist
- invalid evidence fixtures exist
- repeatable evidence fixture harness exists
- fixture harness result: PASS

## Evidence validator posture

The source-side evidence validator checks:

- `evidence_schema_version`
- required metadata fields
- evidence status vocabulary
- source plan identity and path
- human approval requirement
- no-execution guarantee
- proposed command hash or summary
- evidence artifact path presence
- operator review status

The source-side evidence validator rejects records that claim:

- command execution
- command success
- command failure
- scheduler action
- runner action
- branch write
- PR creation or merge
- production deployment
- customer data handling
- payment/billing handling
- provider/model output
- hidden persistence
- cross-repo mutation

## Evidence fixture and harness summary

`orchestrator-nexus` now has repeatable evidence validation coverage through:

- valid evidence fixtures
- invalid evidence fixtures
- repeatable fixture harness
- harness result recorded as PASS

This is source-side validation evidence only. It does not authorize `dev-jai-nexus`
to ingest live evidence files.

## What evidence validation proves

The settled source-side evidence validation layer proves:

- metadata shape
- dry-run plan generation posture
- dry-run plan validation posture
- no-execution guarantee
- unsafe evidence claims are blocked by source-side validation

## What evidence validation does not prove

Evidence validation does not prove:

- command execution
- command success
- command failure
- runtime mutation
- scheduler action
- runner action
- branch write
- PR creation
- PR merge
- provider/model output
- production deployment
- customer workload handling
- customer data handling
- payment/billing handling
- hidden persistence
- cross-repo mutation

## Static/read-only visibility impact

`dev-jai-nexus` may now reference that source-side evidence validation exists
and may describe its validation boundary in static/read-only control-plane
surfaces.

Allowed visibility impact:

- cite PR `#14` as settled source-side validation evidence
- explain what the evidence validator checks
- explain what evidence validation proves and does not prove
- keep denied execution and runtime posture visible

## Explicitly denied live/runtime posture

Denied posture remains unchanged:

- no live dry-run or evidence file ingestion
- no file watchers
- no live orchestrator polling
- no API routes
- no DB behavior
- no command execution
- no runner execution
- no scheduler authority
- no automation execution
- no provider/model calls
- no branch-write authority
- no PR creation or merge authority
- no production deployment
- no customer workloads
- no customer data collection
- no payment/billing handling
- no hidden persistence
- no cross-repo mutation

## Non-goals

- mutating `orchestrator-nexus`
- mutating any repo outside `dev-jai-nexus`
- ingesting live dry-run or evidence files
- implementing execution
- implementing scheduler or runner authority
- implementing polling or watchers

## Authority boundary

This artifact is docs/canon/static UI only.

It does not:

- authorize execution
- authorize execution evidence claims
- authorize dry-run or evidence ingestion
- authorize scheduler or runner action
- authorize branch/PR/merge behavior
- authorize provider/model behavior
- authorize production or customer workload handling
- authorize cross-repo mutation
