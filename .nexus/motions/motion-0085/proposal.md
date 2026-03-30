# Proposal: Bounded Project Intake Canon v0

**Motion:** motion-0085
**Parent:** motion-0084 (WS-A)
**Date:** 2026-03-30

## Problem

The draft `project-intake.schema.yaml` committed under motion-0084 contains
three categories of noise:

1. **Invariant fields** — `governance_mode` is always `motion_first` for every
   JAI NEXUS project. It is a platform constant, not a per-project decision.

2. **Always-constant fields for new projects** — `bootstrap_wave` is always 0
   for greenfield projects. It has no decision impact at intake time.

3. **Derived fields** — `execution_profile.scope` (`repo_local` vs `cross_repo`)
   is deterministically derived from `topology.shape` by WS-C. Including it in
   the intake object invites inconsistent values and doubles the maintenance
   burden.

Additionally, the draft schema provides no classification annotations. A planner
cannot tell which fields are required to proceed with demand planning and which
can be deferred.

## Proposed changes

### Remove

| Field | Reason |
|---|---|
| `execution_profile.scope` | Derived from `topology.shape` by WS-C topology planner |
| `bootstrap_wave` | Always 0 for new projects; not a planning decision |
| `governance_mode` | Platform invariant; always `motion_first` |

### Add

| Field | Type | Classification |
|---|---|---|
| `project_type` | enum: `greenfield \| migration \| extension` | required_at_intake |

`project_type` is a genuine decision input: migration and extension projects
may enter at Wave 1 or later, inherit existing NH roots, or require different
Wave 0 artifacts. It cannot be derived from any other field.

### Classify all remaining fields

Each field is annotated with one of:

- `required_at_intake` — must be present before any WS-B/C/D planning can begin
- `optional` — has a default; may be omitted for standard greenfield projects
- `derived_by_planner` — not in the intake object; computed by a downstream
  workstream (WS-B for NH assignment, WS-C for scope derivation)

### Topology shape annotations

Two fields change semantics based on `topology.shape`:

- `topology.repos[].governance_resident` — for monorepo, always true (implicit);
  for polyrepo, must be explicitly set on exactly one repo.
- `execution_profile.scope` — removed from intake; WS-C derives it as
  `repo_local` for monorepo and `cross_repo` for polyrepo.

## Pressure-test: OffBook.ai

The OffBook.ai example object fits cleanly under the refined schema:

- `project_type: "greenfield"` — new field, applies
- `execution_profile.scope` removed — was `cross_repo`, now derived by WS-C
  from `topology.shape: "polyrepo"`
- `bootstrap_wave` removed — was 0 (implicit for greenfield)
- `governance_mode` removed — was `motion_first` (platform invariant)
- All other fields unchanged

No OffBook.ai planning decisions are lost. The demand derivation in
`offbook-ai-intake-example.yaml` (WS-B illustration) is unaffected.

## Deliverable

Updated `project-intake.schema.yaml` v0.1 with:
- Three fields removed
- `project_type` added
- All fields annotated with `classification` tier
- Mono/polyrepo annotations where topology shape changes field semantics
