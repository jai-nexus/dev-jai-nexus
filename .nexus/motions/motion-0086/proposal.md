# Proposal: Bounded Agent Demand Planner v0

**Motion:** motion-0086
**Parent:** motion-0084 (WS-B)
**Date:** 2026-03-30

## Context

WS-A / motion-0085 produced a refined `project-intake.schema.yaml` v0.1 that
is now the required input object for all downstream planning workstreams. WS-B
is the correct next child motion: agent demand cannot be planned until the
intake canon is stable, and WS-C (topology/waves) and WS-D (generator) both
depend on a correct demand model.

## Problem

The draft `agent-demand-matrix.schema.yaml` has four categories of issues:

### 1. NH-suffix convention errors

The schema defines:
```yaml
council: nh_suffix: ".0"          # wrong: produces 6.0.0
proposer: nh_suffix: ".0.1"       # wrong: produces 6.0.0.1
ARCHITECT: nh_offset: ".0.10"     # wrong: produces 6.0.0.10
```

The canonical `config/agency.yaml` (dev-jai-nexus baseline) uses:
```
council    → 6.0     (council IS the nh_root, no suffix)
proposer   → 6.0.1   (nh_root + ".1")
executor   → 6.0.2
challenger → 6.0.3
arbiter    → 6.0.4
architect  → 6.0.10  (nh_root + ".10")
builder    → 6.0.11
verifier   → 6.0.12
librarian  → 6.0.13
operator   → 6.0.14
```

The offbook-ai-intake-example.yaml already uses the correct flat convention
(`7.0`, `7.0.1`, `7.0.10`, etc.). The bug is in the schema, not the example.

### 2. Missing scope_actions field

`agency.yaml` agents carry an `actions:` list in scope (e.g., `actions:govern`,
`actions:plan`, `actions:patch`). The draft schema has no `scope_actions` field
in the execution_agents item schema. A planner producing agency.yaml output
cannot emit complete agent entries from the demand matrix alone.

### 3. No governance_resident_only flag

OPERATOR and LIBRARIAN in dev-jai-nexus are scoped to the governance-resident
repo only (not to cross-repo paths). ARCHITECT, BUILDER, and VERIFIER span all
repos in a polyrepo project. The draft schema provides no way to express this
distinction — all execution agents appear equivalent.

### 4. Staffing-tier-to-slots mapping undefined

The schema references `staffing_tier` and slot counts but does not define the
mapping. `slot-policy.yaml` defines `minimum_slot_intent` per role but does not
aggregate them into a tier-to-count table.

## Proposed fixes

### NH-suffix correction

```yaml
governance_nh_convention:
  council:    no_suffix: true          # nh_id = nh_root
  proposer:   suffix: ".1"
  executor:   suffix: ".2"
  challenger: suffix: ".3"
  arbiter:    suffix: ".4"

execution_nh_offsets:
  ARCHITECT:  ".10"
  BUILDER:    ".11"
  VERIFIER:   ".12"
  LIBRARIAN:  ".13"
  OPERATOR:   ".14"
```

### scope_actions per role

Grounded in agency.yaml baseline:

| Role | scope_actions |
|---|---|
| ARCHITECT | read, plan, design |
| BUILDER | read, patch, build |
| VERIFIER | read, verify, test |
| OPERATOR | read, review, approve |
| LIBRARIAN | read, document, index |

### governance_resident_only flag

```yaml
governance_resident_only:
  ARCHITECT: false    # spans all repos
  BUILDER:   false    # spans all repos
  VERIFIER:  false    # spans all repos
  OPERATOR:  true     # governance-resident repo only (default)
  LIBRARIAN: true     # governance-resident repo only (default)
```

Override allowed: OPERATOR may be scoped cross-repo for projects with
distributed operator surfaces (WS-C design decision).

### Staffing-tier-to-slots mapping

Grounded in `slot-policy.yaml` minimum_slot_intent counts:

| Role | minimum_viable | expanded | panel |
|---|---|---|---|
| ARCHITECT | 1 | 3 | 6 (5 + selector) |
| BUILDER | 1 | 5 | 6 (5 + selector) |
| VERIFIER | 1 | 3 | 6 (5 + selector) |
| OPERATOR | 1 | 2 | 6 (5 + selector) |
| LIBRARIAN | 1 | 2 | 6 (5 + selector) |

`minimum_viable` = 1 slot per required role (no panel comparison).
`expanded` = role.min_slots from slot-policy.yaml.
`panel` = 5 candidates + 1 selector = 6 slots per role.

### Monorepo vs polyrepo scope_repos rules

**Monorepo:**
- All agents: `scope_repos: [<single repo>]`
- `governance_resident_only` has no practical effect (only one repo exists)

**Polyrepo:**
- ARCHITECT, BUILDER, VERIFIER: `scope_repos: [all repos in topology.repos]`
- OPERATOR, LIBRARIAN (default): `scope_repos: [governance-resident repo only]`
- Override: OPERATOR may be cross-repo if project explicitly requires it

### Required vs optional roles

| Role | Status | Rationale |
|---|---|---|
| ARCHITECT | required | No governed execution without planning evidence |
| BUILDER | required | No governed execution without implementation evidence |
| VERIFIER | required | No loop closure without validation evidence |
| OPERATOR | required | Operator approval is explicit; cannot be inferred automatically |
| LIBRARIAN | optional | Useful for structure/packaging; not required for the base loop |

The minimum governed execution loop requires exactly ARCHITECT + BUILDER +
VERIFIER + OPERATOR. This matches the dev-jai-nexus baseline (LIBRARIAN is
present there but not required to prove the loop).

## OffBook.ai pressure-test

OffBook.ai intake: `project_type: greenfield`, `topology.shape: polyrepo`,
`required_roles: [ARCHITECT, BUILDER, VERIFIER, OPERATOR]`,
`optional_roles: [LIBRARIAN]`, `staffing_tier: minimum_viable`, `nh_root: 7.0`.

Under the refined schema:

| Agent | nh_id | scope_repos | governance_resident_only | slots |
|---|---|---|---|---|
| council | 7.0 | offbook-core | — | — |
| proposer | 7.0.1 | offbook-core | — | — |
| executor | 7.0.2 | offbook-core | — | — |
| challenger | 7.0.3 | offbook-core | — | — |
| arbiter | 7.0.4 | offbook-core | — | — |
| ARCHITECT | 7.0.10 | offbook-core, offbook-web | false | 1 |
| BUILDER | 7.0.11 | offbook-core, offbook-web | false | 1 |
| VERIFIER | 7.0.12 | offbook-core, offbook-web | false | 1 |
| OPERATOR | 7.0.14 | offbook-core | true | 1 |

Total: 9 agents (5 governance + 4 execution).
LIBRARIAN (7.0.13) is optional — not included at minimum_viable.

Fits cleanly. No ambiguities.

## What remains out of scope for WS-B

- How waves sequence the bootstrap (WS-C)
- What files Wave 0 emits (WS-D)
- How dispatch routes motions across repos (WS-E)
- Any runtime/model-slot wiring
