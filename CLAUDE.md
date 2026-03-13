# CLAUDE.md

## Repo
dev-jai-nexus

## Purpose
dev-jai-nexus is the governed execution and operator-surface repo for JAI NEXUS.

This repo is responsible for:
- motion-based governance workflows,
- operator-facing work packet and routing surfaces,
- executor runtime proofs,
- packet-linked SoT event emission,
- context portability artifacts,
- local substrate artifacts for future council and multi-model work.

## Working assumptions
- Meaningful change should be framed through a motion.
- Durable artifacts are preferred over ad hoc explanation.
- Role boundaries matter:
  - ARCHITECT produces planning/design evidence
  - BUILDER produces implementation/patch evidence
  - VERIFIER produces validation evidence
  - OPERATOR applies governed routing and final decisions
  - LIBRARIAN maintains structure, packaging, and memory artifacts
- Generated context artifacts do not replace canonical governance artifacts.

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
- `.nexus/claude/project-context-pack.md`
- `.nexus/claude/bootstrap-set.yaml`
- `.nexus/claude/operating-workflow.md`

Generated context bundle outputs:
- `surfaces/chat-context/`

## Core commands
- `pnpm council:run motion-XXXX`
- `pnpm -C portal typecheck`
- `pnpm -C portal build`
- `node portal/scripts/generate-context-bundle.mjs --motion motion-XXXX`
- `pnpm -C portal exec tsx scripts/run-architect-once.ts <agentNhId>`
- `pnpm -C portal exec tsx scripts/run-builder-once.ts <agentNhId>`
- `pnpm -C portal exec tsx scripts/run-verifier-once.ts <agentNhId>`

## Editing rules
- Preserve current terminology unless there is a motion-backed reason to change it.
- Prefer minimal, reviewable edits over broad rewrites.
- Keep role semantics explicit.
- Do not silently collapse routing, verification, and approval into one step.
- Do not invent provider-specific slot behavior inside repo-local governance artifacts unless the motion explicitly calls for it.
- Keep generated context artifacts deterministic where practical.
- Prefer compact structure over verbose restatement.

## High-sensitivity surfaces
Take extra care when editing:
- `portal/src/lib/work/*`
- `portal/src/lib/agentRuntime.ts`
- `portal/src/app/operator/work/*`
- `.nexus/motions/*`
- `.nexus/context/*`
- `portal/scripts/council-run.mjs`
- `portal/scripts/generate-*.mjs`

## How to work in this repo
1. Identify the current motion or create a new motion if the change is meaningful.
2. Read the relevant motion package and substrate artifacts.
3. Inspect the touched surface only after understanding the role/governance implications.
4. Make the smallest coherent change that satisfies the motion.
5. Run local validation.
6. Confirm the output/evidence/UI state.
7. Ratify the motion only after proof exists.

## Claude-specific guidance
When operating on this repo:
- treat this file as repo-local operating guidance,
- use the substrate artifacts as stable context,
- use motion packages as the canonical unit of meaningful work,
- use generated context bundles for portability rather than re-explaining the repo from scratch,
- optimize for governance coherence, traceability, and maintainability.
