# Execution: Bounded Topology and Wave Planner v0

**Motion:** motion-0087
**Role:** ARCHITECT
**Date:** 2026-03-30

## Scope

Two new files created:

```
.nexus/planning/topology-plan.schema.yaml   (new: v0.1)
.nexus/planning/wave-model.schema.yaml      (new: v0.1)
```

No existing files modified. Intake schema, demand matrix, agency.yaml,
OffBook.ai example, and all motion packages are read-only for this motion.

## Changes applied

### topology-plan.schema.yaml

New schema defining:
- Input declaration (intake canon + demand matrix output)
- `execution_scope` as a WS-C derived field (not intake)
- `governance_resident_repo` as a WS-C derived pointer
- `repo_profiles[]` with `agent_scope_paths[]` (populated by planner),
  `roles_scoped_here[]`, and governance flags
- `cross_repo_links[]` (polyrepo only; optional) with defined relationship enum
- `governance_surface` object defining `.nexus/` and `config/agency.yaml`
  placement

Challenge resolutions incorporated:
- C-2: `agent_scope_paths` annotated as `populated_by: planner`
- C-4: `cross_repo_links.relationship` enum values defined

### wave-model.schema.yaml

New schema defining:
- Five waves (0–4) with names and responsibilities
- Per-wave proof gates (minimum conditions for advancement)
- Proof-based advancement rule (not calendar-based)
- Wave 2 topology-variant proof gate (polyrepo addition for cross-repo scope)
- Monorepo vs polyrepo differences section

Challenge resolutions incorporated:
- C-3: Wave 0 artifact categories only (not specific file paths — those belong to WS-D)
- C-5: Wave 2 polyrepo proof gate embedded directly in wave definition

## Validation

OffBook.ai pressure-test:

Topology plan:
- `execution_scope: cross_repo` — derived correctly from `polyrepo`
- `governance_resident_repo: offbook-core` — correct (governance_resident=true)
- offbook-core profile: governance + ARCHITECT/BUILDER/VERIFIER/OPERATOR
- offbook-web profile: ARCHITECT/BUILDER/VERIFIER only
- `cross_repo_links`: offbook-web → offbook-core, relationship: api_consumer
- All fields well-typed and planner-complete

Wave model:
- Wave 0: agency.yaml to offbook-core, inaugural motion committed
- Wave 2 polyrepo gate requires builder/verifier to touch offbook-web path
- All 5 gates reachable from OffBook.ai intake + demand output

Schema internal consistency:
- `execution_scope` values match WS-B `monorepo_vs_polyrepo_rules`
- `governance_resident_repo` references same field name as WS-B
  `governance_resident_only` convention
- Wave proof gates reference artifact types defined in dev-jai-nexus baseline
  (decision.yaml, execution.receipt.json, loop coherence verdict)

No violations. No ambiguities remaining in OffBook.ai case.

## Evidence

New schemas committed to `.nexus/planning/`.
No runtime code touched.
