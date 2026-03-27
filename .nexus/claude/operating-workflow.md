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
Use this when:
- summarizing a finished motion,
- preparing next-chat continuity,
- creating a compact handoff.

Recommended inputs:
- active motion package
- generated context bundle
- recent proofs or screenshots if needed

## Workflow expectations
1. Identify the active motion.
2. Read only the relevant substrate and motion artifacts first.
3. Use generated context bundles to reduce recontextualization.
4. Make or propose the smallest coherent change.
5. Validate locally.
6. Confirm proof.
7. Ratify only after evidence exists.

## Guidance for Claude behavior
Claude should:
- preserve established terminology,
- distinguish stable substrate from temporary work state,
- avoid broad speculative redesigns unless requested,
- prefer governed artifacts over conversational summaries,
- respect role and stage boundaries,
- remain aware that operator decisions are explicit and not implicit.

Claude should not:
- assume generic startup-style workflow,
- treat generated context files as canonical truth over motion artifacts,
- collapse governance, execution, and review into one step,
- default to whole-repo briefing when a compact governed bootstrap set is available.

## Practical setup recommendation
For immediate use:
- create one primary Claude project for dev-jai-nexus,
- use `.nexus/claude/project-context-pack.md` as the stable repo-facing overview,
- use `CLAUDE.md` as the repo-local operating guide,
- use context bundle outputs for refreshed motion-local context,
- keep motion packages canonical.

## Intended result
Claude becomes project-centric because the repo supplies governed context artifacts and a repeatable operating method, not because long memory is assumed.
