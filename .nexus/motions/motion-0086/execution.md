# Execution: Bounded Agent Demand Planner v0

**Motion:** motion-0086
**Role:** ARCHITECT
**Date:** 2026-03-30

## Scope

Single file change:

```
.nexus/planning/agent-demand-matrix.schema.yaml   (update: v0.1 canon)
```

No other files modified. project-intake.schema.yaml, offbook-ai-intake-example.yaml,
agency.yaml, slot-policy.yaml, model-slots.yaml are all read-only references
for this motion.

## Changes applied

### 1. NH-suffix convention corrected

**Before (wrong):**
```yaml
council:    nh_suffix: ".0"      # produced: nh_root.0
proposer:   nh_suffix: ".0.1"   # produced: nh_root.0.1
ARCHITECT:  nh_offset: ".0.10"  # produced: nh_root.0.10
```

**After (correct, grounded in agency.yaml):**
```yaml
council:    no_suffix: true      # nh_id = nh_root itself
proposer:   suffix: ".1"         # nh_id = nh_root + ".1"
ARCHITECT:  offset: ".10"        # nh_id = nh_root + ".10"
```

Validated against:
- `config/agency.yaml`: council=6.0, proposer=6.0.1, architect=6.0.10
- `offbook-ai-intake-example.yaml`: council=7.0, proposer=7.0.1, architect=7.0.10

### 2. scope_actions added to execution_agents item schema

Field added as `type: array`, referencing agency.yaml baseline per role.
Not owned by this schema — recorded as observed convention.

### 3. governance_resident_only added to execution_agents item schema

Boolean field with per-role defaults:
- ARCHITECT: false (spans all repos)
- BUILDER:   false (spans all repos)
- VERIFIER:  false (spans all repos)
- OPERATOR:  true  (governance-resident repo, default; override allowed)
- LIBRARIAN: true  (governance-resident repo, default; override allowed)

### 4. staffing_tier_rules section added

Explicit mapping from staffing_tier to slot count per role:

| Role | minimum_viable | expanded | panel |
|---|---|---|---|
| ARCHITECT | 1 | 3 | 6 |
| BUILDER | 1 | 5 | 6 |
| VERIFIER | 1 | 3 | 6 |
| OPERATOR | 1 | 2 | 6 |
| LIBRARIAN | 1 | 2 | 6 |

expanded counts sourced from slot-policy.yaml minimum_slot_intent.
panel = 5 candidates + 1 selector per model-slots.yaml convention.

### 5. monorepo vs polyrepo scope_repos rules added

Explicit rules section (not embedded in item schema — recorded separately
for clarity):

```
monorepo:
  all_agents: scope_repos = [single repo]

polyrepo:
  ARCHITECT, BUILDER, VERIFIER: scope_repos = all repos in topology.repos
  OPERATOR, LIBRARIAN (default): scope_repos = [governance-resident repo]
  override: governance_resident_only=false for cross-repo operator placement
```

### 6. required_roles and optional_roles defaults clarified

```
required: ARCHITECT, BUILDER, VERIFIER, OPERATOR
optional: LIBRARIAN
```

Rationale embedded in schema description field.

## Validation

OffBook.ai pressure-test against refined schema:
- 5 governance agents (7.0 through 7.0.4) — correct
- 4 execution agents at minimum_viable (7.0.10–7.0.12, 7.0.14) — correct
- LIBRARIAN (7.0.13) absent — correct (optional, not in required_roles)
- ARCHITECT/BUILDER/VERIFIER scope_repos = [offbook-core, offbook-web] — correct
- OPERATOR scope_repos = [offbook-core] (governance-resident) — correct
- All NH IDs match corrected convention — confirmed

No schema violations. No ambiguities remaining in the OffBook.ai case.

## Evidence

Updated schema committed to `.nexus/planning/agent-demand-matrix.schema.yaml`.
All changes are structural/definitional — no runtime code touched.
