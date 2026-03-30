# Execution: Bounded Dispatch and Coverage Integration Spec v0

**Motion:** motion-0091
**Role:** ARCHITECT
**Date:** 2026-03-30

## Scope

Two files created:

```
.nexus/planning/coverage-declaration.schema.yaml    (new)
.nexus/planning/dispatch-integration.spec.md        (new)
```

No runtime code touched. No portal/ changes.

## Steps

### Step 1 — Coverage declaration schema

Created `coverage-declaration.schema.yaml` with the following sections:

- **Identity**: project_id, project_name, domain, declaration_date, declared_by
- **Execution scope**: execution_scope (repo_local | cross_repo), topology_shape
- **Governance placement**: governance_resident_repo + governance_surface
  (agency_config_path, council_config_path, constitution_path,
  slot_policy_path, motions_root)
- **Agent coverage**: per-agent list with nh_id, role, agent_key,
  scope_repos, scope_paths, governance_resident_only
- **Wave state**: current_wave, proof_gates_satisfied, next_gate, entry_wave
- **Validation rules**: 6 rules covering nh_root prefix consistency,
  governance_resident_only repo scoping, cross_repo multi-repo requirement,
  wave ordering, path format
- **OffBook.ai example**: complete 9-agent coverage declaration with all
  Wave 0 proof gates listed

Every field carries a `provenance` annotation indicating originating
workstream, source field, and planner vs operator ownership.

### Step 2 — Dispatch integration spec

Created `dispatch-integration.spec.md` with the following sections:

- **Dispatch handle field table**: 13 fields (10 planner-owned, 3
  implementation-owned); required/optional; provenance and ownership
- **Field provenance detail**: narrative explanation of each field's origin
- **Planner/implementation boundary diagram**: ASCII block diagram showing
  the freeze boundary
- **Integration contract**: what callers may and may not assume
- **Dispatch-readiness checklist**: 5-item Wave 0 operator checklist
- **OffBook.ai pressure test**: all 10 required planner-owned fields
  satisfied from existing planning artifacts — no new intake fields needed
- **Relationship table**: maps each planning artifact to its contribution
- **Out of scope list**: runtime conductor/queue/auth/routing explicitly
  excluded

### Step 3 — WS consistency check

Verified that all field references in both artifacts are consistent with:
- WS-A project-intake.schema.yaml
- WS-B agent-demand-matrix.schema.yaml
- WS-C topology-plan.schema.yaml and wave-model.schema.yaml
- WS-D bootstrap-manifest.schema.yaml

No schema inconsistencies found.

## Evidence

- coverage-declaration.schema.yaml created with 6 top-level sections,
  full provenance annotations, and passing OffBook.ai example ✓
- dispatch-integration.spec.md created with planner/impl boundary,
  integration contract, and OffBook.ai pressure test ✓
- OffBook.ai pressure test: all 10 required handle fields satisfiable
  from existing WS-A through WS-D artifacts ✓
- No new intake fields required ✓
- No runtime code created ✓
