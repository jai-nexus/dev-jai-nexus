# CLAUDE.md

## Repo
offbook-core

## Purpose
[TODO: describe project purpose and governance responsibilities]

## Working assumptions
- Meaningful change should be framed through a motion.
- Durable artifacts are preferred over ad hoc explanation.
- Role boundaries matter.
[TODO: add project-specific working assumptions]

## Canonical governance surfaces
Primary motion location:
- `.nexus/motions/`

Context substrate:
- `.nexus/context/project-constitution.yaml`
- `.nexus/context/repo-capsule.schema.yaml`
- `.nexus/context/motion-packet.schema.json`
- `.nexus/context/slot-policy.yaml`
- `.nexus/context/scoring-rubric.yaml`

Claude-facing setup:
- `CLAUDE.md`

## Core commands
- `pnpm council:run motion-XXXX`
- `pnpm -C portal typecheck`
- `pnpm -C portal build`
- `node portal/scripts/generate-context-bundle.mjs --motion motion-XXXX`

## Editing rules
- Preserve current terminology unless there is a motion-backed reason to change it.
- Prefer minimal, reviewable edits over broad rewrites.
- Keep role semantics explicit.
[TODO: add project-specific editing rules]

## High-sensitivity surfaces
[TODO: list paths that require extra care when editing]

## How to work in this repo
[TODO: describe project-specific workflow]
1. Identify the current motion or create a new motion.
2. Read the relevant motion package and substrate artifacts.
3. Make the smallest coherent change that satisfies the motion.
4. Run local validation.
5. Ratify the motion only after proof exists.

## Claude-specific guidance
When operating on this repo:
- treat this file as repo-local operating guidance,
- use the substrate artifacts as stable context,
- use motion packages as the canonical unit of meaningful work.
