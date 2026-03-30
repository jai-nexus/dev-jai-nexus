# Execution: Bounded Bootstrap Artifact Generator Spec v0

**Motion:** motion-0088
**Role:** ARCHITECT
**Date:** 2026-03-30

## Scope

Two new files created:

```
.nexus/planning/bootstrap-manifest.schema.yaml   (new: v0.1)
.nexus/planning/bootstrap-generator.spec.md      (new: v0.1)
```

No existing files modified.

## Changes applied

### bootstrap-manifest.schema.yaml

Defines the per-project manifest document that the generator produces as a
record of what was emitted. Contains:
- 12 artifact entries for Wave 0 (paths, classifications, sources, completion flags)
- Classification enum: generated | copied | stubbed | manual-only
- Source tracing: each generated artifact has declared input fields
- `wave` field for downstream wave model alignment
- Secondary-repo emission rules (polyrepo: no Wave 0 artifacts in secondary repos)

Challenge resolution incorporated:
- C-4: manual-only artifacts emit structural shell with HTML comment placeholders only

### bootstrap-generator.spec.md

Behavioral contract for the future generator implementation. Covers:
- Input contract (3 documents: intake, demand, topology)
- Output contract (12 Wave 0 artifacts per manifest schema)
- Synthesis rules per generated artifact (field-by-field source tracing)
- Hard prohibitions (what the generator must never do)
- Stub vs manual-only distinction with C-4 clarification
- Implementation notes for the future WS-D implementation motion

## Validation

OffBook.ai pressure-test:
- All 12 artifacts classifiable with no ambiguity
- agency.yaml generation: 9 agents from demand matrix, cross-repo scope from topology
- project-constitution.yaml: project=OffBook AI, repo_scope=offbook-core
- offbook-web receives no Wave 0 artifacts — correct
- proposal.md: manual-only shell with HTML comment placeholders only
- CLAUDE.md: stubbed with offbook-core name, governance surface paths, command templates

Schema internal consistency:
- All classification values traceable to dev-jai-nexus baseline observed structure
- Generated fields traced to specific intake/demand/topology source fields
- Wave 0 scope does not overlap with Wave 1+ artifacts (agent-panels, model-slots, etc.)

No violations. Generator spec is implementable from this document without
further planning work.

## Evidence

New planning artifacts committed to `.nexus/planning/`.
No runtime code touched.
