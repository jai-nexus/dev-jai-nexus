# Proposal: Bounded Bootstrap Artifact Generator Spec v0

**Motion:** motion-0088
**Parent:** motion-0084 (WS-D)
**Date:** 2026-03-30

## Context

WS-A defined the intake canon. WS-B defined agent demand. WS-C defined
topology and wave sequencing. WS-D is the correct next child motion: it takes
all three outputs and defines exactly what the Wave 0 bootstrap artifact set
looks like and what a future generator is contractually permitted to do.

This motion produces planning artifacts only. The generator implementation
belongs to a separate implementation-oriented child motion after this spec
is ratified.

## Wave 0 artifact inventory

Grounded in the dev-jai-nexus baseline (observed from the repo's actual
`.nexus/` structure and `config/` layout).

### Classification scheme

- **generated** — synthesized by the generator from structured inputs (intake,
  demand matrix, topology plan). Every synthesized field has a declared source.
- **copied** — taken verbatim from the dev-jai-nexus baseline. No modification.
  These are platform-stable governance artifacts that do not vary per project.
- **stubbed** — a template with project-specific placeholders inserted by the
  generator. Human must complete or review the non-placeholder content.
- **manual-only** — the generator creates the file path and shell structure,
  but the substantive content must be human-authored. Generator must not
  pre-fill any governance decision text.

### Wave 0 artifact set (12 artifacts)

| # | Path (relative to governance-resident repo) | Class | Human completion |
|---|---|---|---|
| 1 | `config/agency.yaml` | generated | no |
| 2 | `.nexus/context/project-constitution.yaml` | generated | no |
| 3 | `.nexus/agent-manifest.yaml` | generated | no |
| 4 | `.nexus/council.config.yaml` | copied | no |
| 5 | `.nexus/council.deps.yaml` | copied | no |
| 6 | `.nexus/context/slot-policy.yaml` | copied | no |
| 7 | `.nexus/context/scoring-rubric.yaml` | copied | no |
| 8 | `.nexus/context/motion-packet.schema.json` | copied | no |
| 9 | `.nexus/context/repo-capsule.schema.yaml` | copied | no |
| 10 | `.nexus/motions/motion-0001/motion.yaml` | stubbed | partial (title, summary) |
| 11 | `.nexus/motions/motion-0001/proposal.md` | manual-only | yes (full body) |
| 12 | `CLAUDE.md` | stubbed | yes (## Purpose, operating decisions) |

**All 12 artifacts land in the governance-resident repo.**
Secondary repos (polyrepo) receive no Wave 0 artifacts — their agents are
scoped via `config/agency.yaml` in the governance-resident repo.

## Generation contract

### What the generator reads (inputs)

1. `project-intake.schema.yaml` instance — project identity, topology, roles
2. `agent-demand-matrix` instance — NH IDs, agent keys, scope_repos, scope_actions
3. `topology-plan` instance — governance_resident_repo, repo_profiles, execution_scope

### What each generated artifact synthesizes

**`config/agency.yaml`**
- `owner.name`, `owner.handle`, `owner.nh_root` ← intake.project_id + demand.nh_root
- All agent entries ← demand matrix (governance_agents + execution_agents)
- Per-agent `scope` paths ← topology plan repo_profiles[].agent_scope_paths
- Per-agent `scope_actions` ← demand matrix execution_agents[].scope_actions

**`.nexus/context/project-constitution.yaml`**
- `project` ← intake.project_name
- `repo_scope` ← topology.governance_resident_repo
- `identity.summary` ← template string using intake.project_name and intake.domain
- `roles.executor_roles` ← demand.required_roles + demand.optional_roles
- `current_scope.focus` ← template using intake.project_id
- `current_scope.exclusions` ← baseline defaults (cross-repo federation, etc.)

**`.nexus/agent-manifest.yaml`**
- `version: "0.1"`, `description` ← template with intake.project_id
- Existence marker only at Wave 0; content to be wired at Wave 1+

**`.nexus/motions/motion-0001/motion.yaml`**
- `motion_id: "motion-0001"`, `status: "proposed"`
- `created_at` ← generation timestamp
- `owner` ← intake (project owner, or left as placeholder)
- `title` ← placeholder: "Inaugural Governance Motion — <project_name>"
- `target.domain` ← intake.domain
- `target.repo` ← topology.governance_resident_repo
- `summary` ← placeholder text; requires human authorship

**`CLAUDE.md`**
- `## Repo` section ← topology.governance_resident_repo name
- `## Core commands` ← baseline template (pnpm commands, etc.)
- `## Purpose`, `## High-sensitivity surfaces`, `## How to work` ← stubs with
  `[TODO: describe project purpose and governance surface]` placeholders
- `## Canonical governance surfaces` ← generated from governance_surface paths

### What the generator must never auto-author

1. **Governance decision text** — proposal.md body, challenge.md, any rationale
   or argument. These are human governance judgments, not synthesizable fields.
2. **Ratified artifacts** — decision.yaml with `status: RATIFIED`, vote.json
   with `outcome: PASS`. Ratification is a governed act requiring council process.
3. **Model/provider assignments** — model-slots.yaml, agent-panels.yaml. These
   are staffing decisions, not bootstrap decisions.
4. **Architecture decisions** — any domain-specific invariants, API design, or
   project-specific constraints. These belong in proposal.md.
5. **Secrets or env files** — `.env*`, any credentials or tokens.
6. **Beyond motion-0001** — the generator emits only the motion-0001 stub.
   Motion-0002 and beyond are created through normal governance process.

### Fields safe to synthesize

A field is safe to synthesize if:
- It is fully determined by intake, demand, or topology plan data
- It carries no governance judgment (no rationale, no decision)
- It is structural/mechanical (IDs, paths, timestamps, counts)
- Getting it wrong is recoverable (can be edited before Wave 0 proof gate)

Fields that require human authorship are those where:
- The content expresses intent, rationale, or architectural decisions
- The content will be cited in governance reviews or ratification
- Getting it wrong could create a misleading governance trace

## OffBook.ai pressure-test

Given OffBook.ai intake + demand + topology:

| Artifact | Classification | Notes |
|---|---|---|
| `config/agency.yaml` | generated | 9 agents (5 governance + 4 execution); ARCHITECT/BUILDER/VERIFIER span both repos; OPERATOR scoped to offbook-core |
| `.nexus/context/project-constitution.yaml` | generated | project=OffBook AI, domain=offbook.ai, repo_scope=offbook-core |
| `.nexus/agent-manifest.yaml` | generated | offbook-ai project metadata |
| `.nexus/council.config.yaml` | copied | standard JAI NEXUS defaults |
| `.nexus/council.deps.yaml` | copied | informational placeholder |
| `.nexus/context/slot-policy.yaml` | copied | |
| `.nexus/context/scoring-rubric.yaml` | copied | |
| `.nexus/context/motion-packet.schema.json` | copied | |
| `.nexus/context/repo-capsule.schema.yaml` | copied | |
| `.nexus/motions/motion-0001/motion.yaml` | stubbed | title: "Inaugural Governance Motion — OffBook AI" |
| `.nexus/motions/motion-0001/proposal.md` | manual-only | Human must author inaugural governance decision |
| `CLAUDE.md` | stubbed | ## Repo: offbook-core; ## Purpose: [TODO] |

All 12 artifacts placed in offbook-core (governance-resident repo).
offbook-web: no Wave 0 artifacts — its agents already have scope entries
in the generated `config/agency.yaml`.

Fits cleanly. No ambiguities.

## What remains out of scope for WS-D

- Generator script implementation (WS-D implementation child motion)
- `.nexus/agent-panels.yaml` — panel config (Wave 1+, expanded/panel tier)
- `.nexus/model-routing.yaml` — model routing (Wave 1+)
- `.nexus/model-slots.yaml` — staffing assignment (Wave 1+)
- `.nexus/claude/` operational guides — Wave 1+, manual
- `surfaces/` context bundles — Wave 1+ generated
- Cross-repo dispatch bridge (WS-E)
