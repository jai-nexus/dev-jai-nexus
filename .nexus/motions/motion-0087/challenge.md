# Challenge: Bounded Topology and Wave Planner v0

**Motion:** motion-0087
**Challenger role:** challenger
**Date:** 2026-03-30

## Review

The proposal is well-grounded in the dev-jai-nexus baseline and the WS-A/B
outputs. Five objections are raised for the record.

---

### C-1: "At least one proof" is too permissive as a wave gate

**Concern:** Requiring only a single instance before wave advancement could
allow a project to declare Wave 2 complete with a trivially synthetic packet
that was never part of real governed work. The gate seems to lack quality
controls.

**Resolution:** The gate is intentionally minimal for the planning model. The
dev-jai-nexus baseline itself advanced waves using a single reference path
(packet 880 / motion-0070). The planning canon defines the minimum proof
condition — not the production quality bar. Quality is a governance judgment
made by the council and operator at ratification time, not a structural
constraint in the wave model. The wave model defines "can we advance?"
not "is this production-ready?" Accepted as stated.

---

### C-2: `agent_scope_paths` are project-specific and cannot be fully defined by the planner schema

**Concern:** The topology plan shows example path patterns like `paths:src/**`
for OffBook.ai, but the actual paths depend on the project's internal repo
structure. If offbook-core uses `app/` instead of `src/`, the schema would
produce wrong entries. The schema cannot know this at planning time.

**Resolution:** The schema defines `agent_scope_paths` as a planner-populated
field, not a schema-computed field. The schema provides the convention and
the path pattern format grounded in agency.yaml; the actual values are filled
in by the planner (human or generator) based on each repo's actual structure.
The WS-D generator spec will note that `scope_paths` require per-repo
inspection before emission. The schema correctly annotates this as
`populated_by: planner`. Accepted with this annotation added to the schema.

---

### C-3: Wave 0 artifacts list overlaps with WS-D scope

**Concern:** The proposal lists specific Wave 0 artifacts (agency.yaml,
project-constitution.yaml, etc.). This feels like it is previewing WS-D's
bootstrap manifest schema, which may create divergence if WS-D changes the
list.

**Resolution:** The wave model schema lists Wave 0 artifact *categories*
(governance substrate artifacts) not specific file paths or generation rules.
WS-D owns the specific manifest. WS-C only needs to say "Wave 0 is
responsible for governance substrate" with enough specificity to define the
proof gate. The proof gate ("agency.yaml committed + council agent present +
inaugural motion present") references categories, not a specific file list
owned by WS-D. There is no functional overlap. Accepted.

---

### C-4: `cross_repo_links` relationship enum is under-defined

**Concern:** The enum values `[api_consumer, shared_infra, sibling]` are not
defined beyond the names. A planner cannot determine which value applies
without definitions.

**Resolution:** The schema will include definitions:
- `api_consumer`: repo consumes an API surface exposed by another repo
- `shared_infra`: repos share infrastructure (database, queue, auth service)
- `sibling`: repos are independently deployable but share governance scope;
  no direct API or infra dependency
These three cover the primary polyrepo relationship patterns. The field is
optional in the schema and has no effect on wave sequencing — it is metadata
for WS-D path-scope generation and future dispatch (WS-E). Accepted.

---

### C-5: The monorepo Wave 2 proof gate doesn't explicitly require cross-repo scope for polyrepo

**Concern:** The wave model lists the Wave 2 proof gate in a single definition
that applies to both topologies. The polyrepo requirement (builder/verifier
touching a secondary repo path) is stated in the "monorepo vs polyrepo
differences" section but is not embedded in the wave gate definition itself.
A consumer reading only the wave gates would not see the distinction.

**Resolution:** The wave-model schema will embed topology-specific proof gate
variants directly in the Wave 2 definition:
```
wave_2.proof_gate.polyrepo_addition:
  "At least one builder or verifier evidence artifact references a path in
  a secondary repo (not governance-resident repo), proving cross-repo scope
  is operational."
```
This makes the distinction machine-readable without duplicating the wave
definition. Accepted.

---

## Verdict

No blocking objections. All five resolved. Motion-0087 may proceed.
