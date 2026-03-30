# Proposal: Project Bootstrap and Agency Planning v0

**Motion:** motion-0084
**Date:** 2026-03-30

## Context

The Q2 governed loop activation arc is complete and governance-closed
(motion-0071 through motion-0082 ratified via motion-0083). The canonical
reference path — packet 880 / motion-0070 — proves the full loop end-to-end
in dev-jai-nexus.

What is now missing is a reusable model for starting the next project.
Starting OffBook.ai (or any future JAI NEXUS project) currently requires
manual decisions that are not captured anywhere:

- How to choose mono vs polyrepo?
- How to assign agent NH identities for a new project?
- Which agents are required vs optional for a given project profile?
- What governance artifacts must exist before the first motion can run?
- What order do things bootstrap in?

This umbrella defines five planning workstreams to answer these questions.

## What the closed baseline proves

| Proof | Implication for bootstrap planning |
|---|---|
| Motion → execution bridge works | The intake object must produce a valid first motion and handoff |
| Agent context inheritance works | Agents need scope + motion.yaml + execution.md at claim time |
| Queue-to-claim path is bridgeable | Per-role enqueue scripts are part of the Wave 2 bootstrap artifact set |
| Operator surface works | Wave 3 includes operator page setup |
| Receipt closure is durable | Wave 3 terminal proof requires execution.receipt.json |
| Loop coherence gate works | Wave 4 declares coverage complete |

## Proposed workstreams

### WS-A — Project Intake Canon

**What must be known before any bootstrap decision can be made?**

Minimum intake object fields:
- `project_id`, `project_name`, `domain`
- `topology.shape` (monorepo | polyrepo)
- `topology.repos[]` (name, domain_scope, tier, governance_resident)
- `execution_profile.class` (artifact_only | live_patch | hybrid)
- `required_roles[]` and `optional_roles[]`
- `staffing_tier` (minimum_viable | expanded | panel)
- `bootstrap_wave` (0 for new projects)

Deliverable: `project-intake.schema.yaml` v0.1

### WS-B — Agent Demand Planner

**Given an intake object, which agents are required?**

Rules:
- governance-resident repo always gets: council, proposer, challenger, arbiter
- each required execution role → one execution agent per staffing_tier
- expanded tier → role.min_slots from slot-policy.yaml
- panel tier → role.max_slots
- NH assignment: new convention needed (WS-B design decision)

OffBook.ai minimum viable: 8 agents
(council, proposer, challenger, arbiter + architect, builder, verifier, operator)

Deliverable: `agent-demand-matrix.schema.yaml` v0.1 + OffBook.ai example

### WS-C — Topology and Wave Planner

**What is the repo shape and wave sequence?**

Wave model:
- Wave 0: Governance substrate (agency.yaml, constitution, slot-policy, council config, inaugural motion)
- Wave 1: Planning activation (first architect, first ratified motion, first work packet)
- Wave 2: Execution activation (builder + verifier + queue bridges, full chain proven)
- Wave 3: Operator surface (governing motion section, receipt closure)
- Wave 4: Coherence and coverage (loop coherence gate, coverage declarations)

Wave gating rule: Wave N+1 requires at least one completed proof from Wave N.

Mono vs polyrepo difference at Wave 0:
- Monorepo: single agency.yaml, single .nexus/
- Polyrepo: governance-resident repo hosts .nexus/; secondary repos get repo-scoped agents; cross-repo scope entries needed

Deliverable: `topology-plan.schema.yaml` + `wave-model.schema.yaml` v0.1

### WS-D — Bootstrap Artifact Generator

**What files must the generator emit for Wave 0?**

Auto-generated (from intake + demand):
- `config/agency.yaml` — from demand matrix
- `.nexus/context/project-constitution.yaml` — from intake
- `.nexus/motions/motion-0001/motion.yaml` — stub only

Must be manually authored:
- `.nexus/motions/motion-0001/proposal.md` — governance decision
- Any domain-specific invariants

Copied from dev-jai-nexus baseline (no modification):
- `.nexus/context/slot-policy.yaml`
- `.nexus/context/scoring-rubric.yaml`
- `.nexus/context/motion-packet.schema.json`

Deliverable: `bootstrap-manifest.schema.yaml` + generator script spec

### WS-E — Dispatch and Coverage Integration

**How does the bootstrap wire into a running governance loop?**

This workstream is the most speculative and should only begin after WS-A through WS-D have at least draft schemas. It addresses:
- How dev-jai-nexus tracks which projects are live
- How coverage is declared (which repos are under governed execution)
- How the operator surface can show cross-project motion state
- Dispatch bridge spec for routing motions across repos

Deliverable: `coverage-declaration.schema.yaml` + dispatch bridge spec (text)

## Planning branch justification

The following are concrete enough to commit now:
- motion-0084 motion package
- `project-intake.schema.yaml` v0.1
- `agent-demand-matrix.schema.yaml` v0.1 (with OffBook.ai example)

The following should wait for their child motion:
- Generator script implementation
- Coverage declaration schema
- Dispatch bridge

Suggested branch: `plan/q3-bootstrap-agency-planning`
