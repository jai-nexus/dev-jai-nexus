# Proposal: Bounded Staged Workstream Dispatch Activation v0 — OffBook.ai

**Motion:** motion-0096
**Date:** 2026-03-30

## Context

The OffBook.ai Wave 0 bootstrap is complete and ratified (motion-0093, motion-0095).
All 10 planner-owned dispatch handle fields are satisfiable from the staged
planning artifacts:

- `project_id`, `domain`: from `offbook-ai-intake.yaml` (WS-A)
- `nh_root`, `council_nh_id`, `proposer_nh_id`: from `derived_agents` in intake (WS-B)
- `execution_scope`, `governance_resident_repo`: from intake topology (WS-C)
- `agency_config_path`, `council_config_path`: from bootstrap manifest defaults (WS-D)
- `wave_state.current_wave`: operator-declared at Wave 0 close (WS-E)

The dispatch-integration spec (motion-0091, WS-E) defines the handle surface
and the coverage-declaration schema. The coverage-declaration for OffBook.ai
does not yet exist as a committed operator artifact.

## Problem

No script exists to bridge staged project planning artifacts → motion-linked
work packet → architect queue. The existing `activate-motion.mjs` targets
dev-jai-nexus governance motions and does not read a coverage-declaration or
emit a `project:<project_id>` tag. Without this linkage, the operator cannot
distinguish staged-project work packets in the work surface or operator routes.

## Proposal

1. **`out/offbook-ai/coverage-declaration.yaml`** — operator-authored Wave 0
   declaration conforming to the WS-E schema. Captures all 10 planner-owned
   dispatch handle fields plus agent_coverage (9 agents) and dispatch_readiness
   summary. Committed in the staged output directory alongside the 12 Wave 0
   substrate artifacts.

2. **`portal/scripts/activate-staged-project.mjs`** — new script that:
   - Reads `coverage-declaration.yaml` for a staged project
   - Derives the 10 planner-owned dispatch handle fields
   - Validates completeness (all required fields present)
   - Checks that the governing motion.yaml exists and has a title
   - Dry-run (default): prints packet that would be created — no DB writes
   - `--create`: creates WorkPacket + AgentInboxItem with tags
     `["motion:<motionId>", "project:<project_id>", "route:ARCHITECT"]`
   - Idempotency guard: refuses if a live motion-tagged packet already exists
   - Shows next-step commands after creation

3. **Does not modify** `activate-motion.mjs`, `enqueue-motion-packet.mjs`,
   any runtime, or any UI.

## Non-goals

- No Wave 1+ work
- No live repo promotion to offbook-core
- No conductor, queue_binding, or auth_handle work
- No UI changes to operator surfaces (tags already rendered at `/operator/work/[id]`)
- No changes to enqueue-motion-packet.mjs or run-architect-once.ts

## Success criteria

- `out/offbook-ai/coverage-declaration.yaml` satisfies all 10 required dispatch
  handle fields
- Dry-run validates and prints correct packet content
- Two consecutive dry-runs produce identical output (idempotency)
- `node --check portal/scripts/activate-staged-project.mjs` exits 0
- `validate_motion` and `validate_agency` both exit 0
- Full activation command chain documented
