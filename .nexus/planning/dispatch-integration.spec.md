# Dispatch and Coverage Integration Spec v0

**Motion:** motion-0091
**Workstream:** WS-E
**Date:** 2026-03-30
**Status:** DRAFT

---

## Purpose

This spec defines the **dispatch handle surface**: the minimum set of fields
a bootstrapped project must expose so that a future conductor, work-packet
router, or integration caller can address it correctly.

It also defines the **planner/implementation boundary** — what the planning
system owns and freezes at Wave 0 close vs what a runtime implementation
wires up later.

No runtime implementation is prescribed or in scope for WS-E.

---

## Definitions

**Dispatch handle** — the complete, addressable identity of a project from
the perspective of a router or conductor. A caller holding a valid dispatch
handle can identify the project, locate its governance surface, and address
its council without any additional lookup.

**Planner-owned field** — a field whose value is determined by the planning
system (WS-A through WS-E). The value is committed in planning artifacts and
must not be mutated by runtime code without a governed motion.

**Implementation-owned field** — a field whose value is determined by
runtime wiring (e.g., conductor registration, queue bindings, deployed
endpoint URLs). It is out of scope for the planning system.

---

## Dispatch handle fields

The following table defines every field in a dispatch handle. All fields
marked `required: true` must be satisfiable from existing planning artifacts
before a project can be considered dispatch-ready.

| Field | Type | Required | Provenance | Owned by |
|---|---|---|---|---|
| `project_id` | string | yes | WS-A: project-intake | planner |
| `domain` | string | yes | WS-A: project-intake | planner |
| `nh_root` | string | yes | WS-B: agent-demand-matrix | planner |
| `execution_scope` | enum | yes | WS-C: topology-plan | planner |
| `governance_resident_repo` | string | yes | WS-C: topology-plan | planner |
| `agency_config_path` | string | yes | WS-D: bootstrap-manifest | planner |
| `council_config_path` | string | yes | WS-D: bootstrap-manifest | planner |
| `council_nh_id` | string | yes | WS-B: agent-demand-matrix | planner |
| `proposer_nh_id` | string | yes | WS-B: agent-demand-matrix | planner |
| `wave_state.current_wave` | integer | yes | WS-E: coverage-declaration | operator |
| `conductor_endpoint` | string | no | runtime registration | implementation |
| `queue_binding` | string | no | runtime registration | implementation |
| `auth_handle` | string | no | runtime registration | implementation |

**Rules:**

1. All `planner`-owned fields must be populated before Wave 1 can begin.
2. `implementation`-owned fields are not required for Wave 0 or Wave 1
   bootstrap; they become relevant when active dispatch is enabled.
3. `council_nh_id` is always `nh_root` itself (the council IS the root node).
4. `proposer_nh_id` is always `nh_root + ".1"`.

---

## Field provenance detail

### project_id, domain
Declared in `project-intake.schema.yaml` (WS-A). Stable once intake is
ratified. These form the outermost identity layer and must never change
without a governed motion.

### nh_root
Assigned at WS-B planning time. All agent NH IDs in the project are derived
from this root. The value is committed in `agent-demand-matrix` output and
mirrored in `config/agency.yaml` (Wave 0 bootstrap artifact).

### execution_scope, governance_resident_repo
Derived by WS-C topology planner from `project-intake.topology`. Not
re-derivable at runtime — treat as a frozen planner decision.

### agency_config_path, council_config_path
Default paths established by the WS-D bootstrap manifest. An operator may
override by declaring non-default paths in the coverage declaration, but
defaults should be used unless there is a governed reason to deviate.

### council_nh_id, proposer_nh_id
Derived from `nh_root` by NH convention (council = nh_root, proposer =
nh_root + ".1"). No lookup needed; always computable from `nh_root` alone.

---

## Planner / implementation boundary

```
┌─────────────────────────────────────────────────────────────────┐
│  PLANNER-OWNED (WS-A through WS-E, frozen at Wave 0 close)      │
│                                                                  │
│  project_id · domain · nh_root · execution_scope                │
│  governance_resident_repo · agency_config_path                   │
│  council_config_path · council_nh_id · proposer_nh_id           │
│  agent_coverage (roles, nh_ids, scope_repos)                     │
│  wave_state.current_wave · wave_state.proof_gates_satisfied      │
└─────────────────────────────────────────────────────────────────┘
                           │
                    planning boundary
                           │
┌─────────────────────────────────────────────────────────────────┐
│  IMPLEMENTATION-OWNED (Wave 1+ runtime wiring)                   │
│                                                                  │
│  conductor_endpoint · queue_binding · auth_handle                │
│  deployed agency slot assignments · active model selection       │
│  runtime health status · request telemetry                       │
└─────────────────────────────────────────────────────────────────┘
```

The planning system does not prescribe how implementation-owned fields are
populated. A future dispatch spec (motion-XXXX) will define that contract.

---

## Integration contract

What a caller holding a dispatch handle MAY rely on:

- `project_id` uniquely identifies the project within the JAI NEXUS NH tree.
- `governance_resident_repo` contains `.nexus/` and `config/agency.yaml` at
  the path given in `agency_config_path`.
- `council_nh_id` addresses the council agent for the project.
- `nh_root` + NH convention is sufficient to derive any agent's NH ID.
- `wave_state.current_wave` reflects the highest wave with satisfied proof
  gates, as declared by the operator in the coverage declaration.

What a caller must NOT assume:

- That `conductor_endpoint` or `queue_binding` are populated at Wave 0.
- That agents are deployed or active simply because the handle exists.
- That `wave_state` is auto-updated — it is operator-declared at each wave
  close, not a live runtime value.

---

## Dispatch-readiness checklist (Wave 0 close)

For a project to be considered dispatch-ready at Wave 0, the operator must
confirm:

- [ ] `coverage-declaration.yaml` exists and is valid against the
  coverage-declaration schema
- [ ] All required dispatch handle fields are populated in the declaration
- [ ] `config/agency.yaml` exists in `governance_resident_repo` and parses
  as valid YAML
- [ ] `council_nh_id` and `proposer_nh_id` match entries in `agency.yaml`
- [ ] `wave_state.current_wave = 0` and all Wave 0 proof gates are listed in
  `proof_gates_satisfied`

Implementation-owned fields (conductor endpoint, queue bindings) are
explicitly not required for Wave 0 dispatch-readiness.

---

## OffBook.ai pressure test

Applying the dispatch handle spec to `offbook-ai-intake-example.yaml`:

| Handle field | Value | Source |
|---|---|---|
| `project_id` | `offbook-ai` | intake |
| `domain` | `offbook.ai` | intake |
| `nh_root` | `7.0` | intake (WS-B illustrative) |
| `execution_scope` | `cross_repo` | derived (polyrepo) |
| `governance_resident_repo` | `offbook-core` | intake topology |
| `agency_config_path` | `config/agency.yaml` | bootstrap manifest default |
| `council_config_path` | `council.config.yaml` | bootstrap manifest default |
| `council_nh_id` | `7.0` | nh_root (convention) |
| `proposer_nh_id` | `7.0.1` | nh_root + ".1" (convention) |
| `wave_state.current_wave` | `0` | operator-declared at Wave 0 close |

**Result:** All required handle fields are satisfiable from existing WS-A
through WS-D artifacts. No new intake fields are needed. Pressure test passes.

---

## Relationship to other planning artifacts

| Artifact | Role |
|---|---|
| `project-intake.schema.yaml` (WS-A) | Source of project_id, domain, topology |
| `agent-demand-matrix.schema.yaml` (WS-B) | Source of nh_root, NH IDs, roles |
| `topology-plan.schema.yaml` (WS-C) | Source of execution_scope, governance_resident_repo |
| `wave-model.schema.yaml` (WS-C) | Source of proof gate IDs and advancement rules |
| `bootstrap-manifest.schema.yaml` (WS-D) | Source of default governance surface paths |
| `coverage-declaration.schema.yaml` (WS-E) | Aggregates all of the above into one declaration |
| `dispatch-integration.spec.md` (WS-E, this doc) | Defines the handle surface and boundary |

---

## Out of scope for WS-E

- Conductor or queue implementation
- Runtime agent slot assignment
- Model provider binding
- Auth and secrets for deployed agents
- Work-packet routing logic
- Any OffBook.ai implementation work
