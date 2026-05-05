# Proposal: Agentic Docs Operations Control Plane v0

**Motion:** motion-0174
**Kind:** builder-proof
**Program:** q2m5-agentic-docs-operations-control-plane-v0
**Basis:** motion-0173

---

## Problem statement

docs-nexus is no longer blocking portfolio routing, but dev-jai-nexus does not yet
have explicit control-plane canon for how JAI Agents could eventually maintain
docs-nexus through staged authority. The workflow-role taxonomy is now settled,
yet docs-nexus authority semantics, role ceilings, and audit expectations remain
implicit.

Motion-0174 closes that gap as a planning and design package only.

---

## Scope

In scope:

- add `.nexus/canon/docs-operations-control-plane.yaml`
- add `.nexus/canon/docs-agent-authority-ladder.yaml`
- add `.nexus/canon/docs-agent-operation-event.yaml`
- add draft motion artifacts under `.nexus/motions/motion-0174/`
- document the dev-jai-nexus and docs-nexus relationship model
- define authority levels 0 through 5
- mark Levels 0 through 2 as designable now
- model Levels 3 through 5 as disabled in v0
- define docs agent roles and default max levels
- document allowed outputs and blocked outputs by level
- document the audit and event model only

Out of scope:

- editing docs-nexus
- creating docs-nexus branches
- creating docs-nexus PRs
- adding automation
- adding schema enforcement
- adding API or DB mutation
- adding hidden persistence
- adding credentials
- adding execution authority
- granting autonomous merge
- promoting raw sources to canon
- implementing Levels 3, 4, or 5
- implementing Agent Assets Library
- implementing live capture
- adding scheduler behavior

---

## Deliverables

### 1. Docs operations control plane

`.nexus/canon/docs-operations-control-plane.yaml` must define:

- docs-nexus ownership of docs, curated source artifacts, motion context packs,
  validation, and source-intelligence library material
- dev-jai-nexus ownership of authority semantics, control-plane policy, docs-agent
  authorization ladder, and audit expectations
- the v0 posture as planning-only with no activation of write or automation

### 2. Docs agent authority ladder

`.nexus/canon/docs-agent-authority-ladder.yaml` must define Levels 0 through 5,
their allowed outputs, blocked outputs, and v0 enablement posture.

### 3. Docs agent roles

The control plane must define:

- `docs_librarian`
- `source_curator`
- `context_packager`
- `docs_patch_planner`
- `docs_verifier`
- `docs_arbiter`
- `operator`

Each role must include canonical role class, purpose, and `default_max_level`,
with explicit language that default max level is not automatic authorization.

### 4. Audit and event model

`.nexus/canon/docs-agent-operation-event.yaml` must define
`DocsAgentOperationEvent` as a model only and must not emit events in v0.

---

## Acceptance criteria

- ADO-01 dev-jai-nexus/docs-nexus relationship is documented
- ADO-02 authority ladder levels 0 through 5 are defined
- ADO-03 Levels 0 through 2 are marked designable now
- ADO-04 Levels 3 through 5 are modeled but disabled
- ADO-05 docs agent roles are defined
- ADO-06 allowed outputs are documented by level
- ADO-07 blocked outputs are documented by level
- ADO-08 docs-nexus integration contract is documented
- ADO-09 audit/event model is documented
- ADO-10 no-main-write guardrail is explicit
- ADO-11 no-autonomous-merge guardrail is explicit
- ADO-12 raw source promotion to canon is blocked
- ADO-13 no hidden persistence is added
- ADO-14 no cross-repo execution authority is added
- ADO-15 no docs-nexus files are edited
- ADO-16 no API route or DB mutation is added
- ADO-17 no credentials or secret values are added
- ADO-18 motion-0174 validates
- ADO-19 agency validation passes
- ADO-20 portal typecheck passes if portal code is touched
