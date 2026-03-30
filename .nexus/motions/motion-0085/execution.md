# Execution: Bounded Project Intake Canon v0

**Motion:** motion-0085
**Role:** ARCHITECT
**Date:** 2026-03-30

## Scope

Single file change:

```
.nexus/planning/project-intake.schema.yaml   (update: v0.1 canon)
```

No other files are modified. `agent-demand-matrix.schema.yaml` and
`offbook-ai-intake-example.yaml` are out of scope for this motion.

## Changes applied

### Fields removed

| Field | Reason |
|---|---|
| `execution_profile.scope` | Derived from `topology.shape` by WS-C |
| `bootstrap_wave` | Always 0 for greenfield; constant, not a decision |
| `governance_mode` | Platform invariant; always `motion_first` |

`execution_profile` object is retained (still contains `class`). If `class`
is the only remaining field, the object collapses to a single-field optional.

### Fields added

| Field | Type | Classification |
|---|---|---|
| `project_type` | enum | required_at_intake |

Values: `greenfield`, `migration`, `extension` — defined in schema description.

### Classification annotations added

Every field now carries a `classification` key with one of:
- `required_at_intake`
- `optional`
- `derived_by_planner` (only used in the `derived_fields` section at the bottom
  of the schema for documentation purposes)

### Topology annotations added

Fields whose semantics depend on `topology.shape` carry a `topology_note`.

## Validation

OffBook.ai fits cleanly:
- `project_type: "greenfield"` added
- `execution_profile.scope` line removed (was `cross_repo`)
- `bootstrap_wave` line removed (was 0)
- `governance_mode` line removed (was `motion_first`)
- All required fields present: `project_id`, `project_name`, `domain`,
  `project_type`, `topology`, `required_roles`, `staffing_tier`
- Optional fields with non-default values: `optional_roles`, `nh_root`,
  `execution_profile.class`, `notes`

## Evidence

Updated schema committed to `.nexus/planning/project-intake.schema.yaml`.
OffBook.ai example is validated by inspection against the refined field set.
