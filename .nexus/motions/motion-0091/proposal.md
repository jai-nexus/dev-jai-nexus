# Proposal: Bounded Dispatch and Coverage Integration Spec v0

**Motion:** motion-0091
**Workstream:** WS-E
**Parent:** motion-0084
**Date:** 2026-03-30

## Problem

WS-D (motion-0088, motion-0089, motion-0090) delivers a Wave 0 bootstrap
generator that emits a governance substrate. What it does not define is:

1. **What the bootstrapped project declares about itself** — its repo
   coverage, agent roster, governance placement, and wave state. There is
   no schema for this declaration.

2. **What dispatch needs to know** — the minimum field surface a project
   must expose so that a future conductor or routing layer can address it.
   Without a spec, the integration boundary is undefined and any future
   implementation is guesswork.

WS-E closes this gap at the planning level. No runtime code is in scope.

## Proposed artifacts

### `.nexus/planning/coverage-declaration.schema.yaml`

A schema for the post-bootstrap declaration an operator produces (manually
or via a future generator) after Wave 0 is complete. It captures:

- **Identity**: `project_id`, `domain`, `nh_root`
- **Execution scope**: `execution_scope` (repo_local | cross_repo), derived
  from WS-C topology output
- **Governance placement**: `governance_resident_repo` and its key artifact
  paths (`agency_config_path`, `council_config_path`, `constitution_path`)
- **Agent coverage**: per-role entry with `nh_id`, `agent_key`,
  `scope_repos`, `scope_paths`, `governance_resident_only` flag
- **Wave state**: `current_wave`, `proof_gates_satisfied[]`,
  `next_gate` — traceable to the wave-model schema (WS-C)
- **Field provenance annotations** on every field: which workstream
  populates it and whether it is planner-owned or operator-declared

### `.nexus/planning/dispatch-integration.spec.md`

A spec document defining the handle surface a project must expose for
dispatch routing. It defines:

- **Handle fields**: the minimum identifiers a router needs (project_id,
  domain, nh_root, governance_resident_repo, agency_config_path,
  council_nh_id, proposer_nh_id)
- **Provenance table**: where each handle field originates (intake,
  demand matrix, topology plan, bootstrap output)
- **Planner-owned vs implementation-owned boundary**: what the planning
  system defines and freezes vs what a runtime implementation wires up
- **Integration contract**: what a caller may rely on; what is explicitly
  out of scope for WS-E
- **OffBook.ai example**: concrete field values from the planning example

## OffBook.ai pressure test

Both artifacts are validated against `offbook-ai-intake-example.yaml`.
All required handle fields must be satisfiable from existing planning
artifacts without adding new intake fields.

## Scope boundary

| In scope | Out of scope |
|---|---|
| coverage-declaration schema | bootstrap generator emitting coverage declarations |
| dispatch handle spec | conductor / queue wiring |
| provenance annotations | Wave 1+ artifact generation |
| OffBook.ai field-level pressure test | any OffBook.ai implementation |

## Completion criterion

After WS-E, motion-0084 has a complete planning foundation:
WS-A (intake) → WS-B (demand) → WS-C (topology + wave model) →
WS-D (bootstrap generator + proof) → WS-E (coverage declaration +
dispatch spec). The branch is ready for review and merge.
