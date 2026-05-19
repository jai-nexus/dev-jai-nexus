# Dry-Run Plan Visibility Boundary v0

## Purpose

Define how `dev-jai-nexus` may surface dry-run plans and dry-run evidence
records from `orchestrator-nexus` in a static, read-only way without ingesting
live orchestrator state, executing commands, or implying scheduler or runner
authority.

## Source baseline

- `dev-jai-nexus` is settled through `motion-0239`
- `orchestrator-nexus` is settled through PR `#13`
- existing `dev-jai-nexus` Edge Runner surfaces already record dry-run
  generation, validation, fixture coverage, and denied execution authority

## orchestrator-nexus PR #13 source-side evidence record context

PR `#13` establishes a dry-run evidence record model and example. That source
side record proves only dry-run plan generation and validation posture.

It does not prove:

- command execution
- command success
- command failure
- runtime mutation
- production deployment
- customer workload handling
- customer data handling
- payment or billing handling
- provider or model output
- scheduler action
- runner action
- branch write
- PR creation
- PR merge
- cross-repo mutation

## Dry-run plan visibility boundary

`dev-jai-nexus` may reference dry-run plans conceptually and may describe what
fields a future read-only visibility surface could show, but it must not ingest
live plan files from `orchestrator-nexus` at this time.

Allowed boundary:

- static summaries
- canon references
- readiness state
- example metadata fields
- denied authority reminders

Disallowed boundary:

- live dry-run plan ingestion
- file watchers
- live orchestrator polling
- local file monitoring for generated artifacts
- any execution or approval control

## Evidence record visibility posture

`dev-jai-nexus` may surface the existence of a dry-run evidence record model,
may explain what the record proves, and may cite source-side canon or repo
references.

`dev-jai-nexus` must not represent evidence records as live control-plane
telemetry, runtime activity, or execution proof.

## Fields that may be surfaced read-only

These fields may be shown only as static/example metadata:

- dry-run plan id
- evidence record id
- target device
- target repo
- target lane
- command class
- validation status
- confirmation required
- human approval required
- no-execution guarantee
- evidence status
- source canon / source repo reference

These fields must not be presented as live state in `dev-jai-nexus`.

## Fields and behaviors that must not be surfaced yet

- live dry-run plan ingestion
- live evidence record ingestion
- live orchestrator polling
- file watchers
- command execution controls
- runner controls
- scheduler controls
- branch or PR automation controls
- provider or model controls
- customer workload controls
- customer data controls

## Allowed static/read-only surface posture

Allowed `dev-jai-nexus` behavior:

- show a compact read-only note that dry-run evidence records now exist
- explain that evidence proves generation and validation only
- show example metadata field names
- cite source canon and source repo references
- keep denied authority posture visible

## Explicitly denied live/runtime posture

Denied posture remains unchanged:

- no live dry-run plan ingestion
- no file watchers
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
- no payment or billing handling
- no hidden persistence

## Non-goals

- mutating `orchestrator-nexus`
- mutating any repo outside `dev-jai-nexus`
- implementing execution
- implementing polling or watchers
- implementing approval workflow controls
- implementing customer workload handling

## Authority boundary

This artifact is docs/canon/static UI only.

It does not:

- authorize execution
- authorize scheduler or runner action
- authorize dry-run ingestion
- authorize branch/PR/merge behavior
- authorize provider/model behavior
- authorize production or customer workload handling
- authorize cross-repo mutation
