# Claude Bootstrap Pack - dev-jai-nexus
generated_for_date: 2026-03-13
repo: dev-jai-nexus
branch: sprint/q1m3-council-pivot-polyrepo-coverage
head_commit: 9a405cc
active_motion: motion-0037

## Purpose
This is the generated Claude bootstrap handoff for dev-jai-nexus. It is a compact, repo-centric setup pack derived from governed Claude artifacts, formal substrate artifacts, and current generated repo context.

## Current Repo State
- latest_commit_subject: feat(claude): add repo-centric Claude project setup artifacts
- active_motion: motion-0037
- branch: sprint/q1m3-council-pivot-polyrepo-coverage
- head_commit: 9a405cc

## Claude-facing Canonical Sources
- CLAUDE.md
- .nexus/claude/project-context-pack.md
- .nexus/claude/bootstrap-set.yaml
- .nexus/claude/operating-workflow.md

## Formal Substrate References
- .nexus/context/project-constitution.yaml
- .nexus/context/repo-capsule.schema.yaml
- .nexus/context/motion-packet.schema.json
- .nexus/context/slot-policy.yaml
- .nexus/context/scoring-rubric.yaml

## Current Generated Context References
- surfaces/chat-context/2026-03-13_motion-snapshots.txt
- surfaces/chat-context/2026-03-13_repo-capsule.txt
- surfaces/chat-context/2026-03-13_active-path-pack.txt
- surfaces/chat-context/2026-03-13_context-bundle_manifest.json

## Repo-root CLAUDE Guidance
## Repo
dev-jai-nexus

## Project Context Summary
## What this pack is
This is the compact Claude-facing onboarding packet for dev-jai-nexus.

Its job is to let Claude begin from governed repo context instead of repeated ad hoc explanation.

## Constitution Excerpt
```yaml
version: "0.1"
artifact: "project-constitution"
project: "JAI NEXUS"
repo_scope: "dev-jai-nexus"

identity:
  summary: >
    JAI NEXUS is a governed AI collaboration platform for structured polyrepo work,
    durable decision trace, executor-role orchestration, and motion-based governance.
  purpose:
    - "Enable governed multi-AI and human-AI collaboration."
    - "Preserve durable trace for decisions, execution, and review."
    - "Support structured polyrepo development across domain and repo tiers."
    - "Reduce repeated recontextualization through governed context artifacts."

governance:
  primary_unit: "motion"
  canonical_sequence:
    - "problem framing"
    - "proposal"
    - "challenge"
    - "execution"
    - "policy evaluation"
    - "vote"
    - "decision"
    - "ratification"
  decision_modes:
    - "unanimous_consent"
    - "majority"
  principles:
    - "Governance before convenience."
    - "Durable artifacts over ephemeral explanation."
    - "Explicit role boundaries over hidden behavior."
    - "Traceable decisions over undocumented intuition."
    - "Small proven increments over speculative overbuild."
```

## Slot Policy Excerpt
```yaml
version: "0.1"
artifact: "slot-policy"
scope: "dev-jai-nexus"

purpose: >
  Defines role-first slot intent for executor-role evaluation and future multi-model
  staffing without binding the policy to any single provider.

principles:
  - "Slots are role-first, not provider-first."
  - "Assignments may change; slot purpose should remain stable."
  - "Diversity is useful when it improves comparison quality, not just variety."
  - "Not every decision requires every slot."
  - "Higher-cost orchestration should be reserved for higher-value decisions."

roles:
  ARCHITECT:
    primary_goal: "Compare design and planning approaches."
    preferred_strengths:
      - "system design"
      - "abstraction quality"
      - "architecture reasoning"
      - "tradeoff analysis"
    minimum_slot_intent:
      - "baseline planner"
      - "alternative planner"
      - "risk-oriented planner"

  BUILDER:
    primary_goal: "Compare implementation candidates and patch quality."
    preferred_strengths:
      - "coding correctness"
      - "patch generation"
      - "type safety"
      - "maintainability"
```

## Scoring Rubric Excerpt
```yaml
version: "0.1"
artifact: "scoring-rubric"
scope: "dev-jai-nexus"

purpose: >
  Defines reusable evaluation dimensions for comparing code candidates,
  execution proposals, and governance decisions.

dimensions:
  correctness:
    description: "Does the solution actually satisfy the intended requirement?"
    scale: "1-5"

  scope_discipline:
    description: "Does the solution stay within motion scope and avoid unnecessary expansion?"
    scale: "1-5"

  maintainability:
    description: "Is the result understandable, reviewable, and sustainable?"
    scale: "1-5"

  governance_coherence:
    description: "Does the result align with JAI NEXUS role boundaries and governed workflow?"
    scale: "1-5"

  traceability:
    description: "Does the result preserve clear evidence and durable reasoning trace?"
    scale: "1-5"

  reversibility:
```

## Bootstrap Set Excerpt
```yaml
version: "0.1"
artifact: "claude-bootstrap-set"
scope: "dev-jai-nexus"

purpose: >
  Defines the minimal recommended file set for bootstrapping Claude project work
  in a repo-centric and governance-aware way.

default_bootstrap_order:
  - "CLAUDE.md"
  - ".nexus/context/project-constitution.yaml"
  - ".nexus/context/slot-policy.yaml"
  - ".nexus/context/scoring-rubric.yaml"
  - ".nexus/claude/project-context-pack.md"

recommended_sets:
  strategic_setup:
    description: "Use for starting a new Claude project or high-level strategy chat."
    files:
      - "CLAUDE.md"
      - ".nexus/claude/project-context-pack.md"
      - ".nexus/context/project-constitution.yaml"
      - ".nexus/context/repo-capsule.schema.yaml"
      - ".nexus/context/motion-packet.schema.json"
      - ".nexus/context/slot-policy.yaml"
      - ".nexus/context/scoring-rubric.yaml"

  implementation_setup:
    description: "Use for repo work tied to a specific motion."
    files:
      - "CLAUDE.md"
      - ".nexus/claude/project-context-pack.md"
      - ".nexus/context/project-constitution.yaml"
      - ".nexus/context/slot-policy.yaml"
      - ".nexus/context/scoring-rubric.yaml"
      - "surfaces/chat-context/YYYY-MM-DD_repo-capsule.txt"
      - "surfaces/chat-context/YYYY-MM-DD_active-path-pack.txt"

  motion_review_setup:
    description: "Use for reviewing or continuing a specific motion."
```

## Claude Operating Workflow Excerpt
```md
# Claude Operating Workflow - dev-jai-nexus

## Purpose
This document defines how Claude should be used in dev-jai-nexus in a repo-centric, governance-aware way.

## Core principle
Claude should begin from governed repo context, not from repeated ad hoc explanation.

That means Claude work in this repo should be grounded in:
- `CLAUDE.md`
- substrate artifacts under `.nexus/context/`
- the active motion package
- generated context bundles when portability is needed

## Recommended usage modes

### 1. Strategic project mode
Use this when:
- defining next motions,
- reasoning about architecture,
- refining slot policy,
- refining the local substrate,
- evaluating major workflow decisions.

Recommended inputs:
- `CLAUDE.md`
- `.nexus/claude/project-context-pack.md`
- substrate artifacts
- latest motion snapshot

### 2. Motion implementation mode
Use this when:
- editing code for an active motion,
- reviewing touched files,
- validating proof conditions,
- tightening a specific surface.

Recommended inputs:
- `CLAUDE.md`
- active motion package
- relevant substrate artifacts
- repo capsule
- active path pack

### 3. Closeout / passalong mode
```

## Practical Setup Order
1. Read `CLAUDE.md`.
2. Read `.nexus/claude/project-context-pack.md`.
3. Read the active substrate references needed for the task.
4. Read the active motion package.
5. Use the latest generated repo context artifacts for portability.

## Canonical Truth Reminder
This bootstrap pack is a generated handoff layer. Canonical truth remains in motion artifacts, formal substrate artifacts, and repo sources.
