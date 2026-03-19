# Execution Plan - motion-0066

## Goal
Consume canonical `candidate.motion` artifacts in `dev-jai-nexus` and define the bounded promotion path from Candidate Motion into Motion Factory draft creation.

## Plan
1. Inspect current Waves types, agent planning flow, and Motion Factory integration points.
2. Introduce local types/helpers needed to consume canonical `candidate.motion` artifacts without redefining the upstream contract.
3. Define how a wave session can store or attach one or more Candidate Motions.
4. Update Waves UI to render Candidate Motion as a first-class planning artifact.
5. Define a narrow mapping from agent planner output into Candidate Motion-shaped data.
6. Define promotion from Candidate Motion into Motion Factory draft creation, including lineage fields.
7. Preserve clear separation between:
   - WaveTask
   - Candidate Motion
   - formal Motion
8. Defer broad execution/runtime changes to later motions.

## Files touched
Draft scope likely includes:
- `portal/src/lib/waves/types.ts`
- `portal/src/lib/waves/agentPlanner.ts`
- `portal/src/app/operator/waves/page.tsx`
- `portal/src/app/operator/waves/[sessionId]/page.tsx`
- any bounded Candidate Motion helper/storage files
- any bounded Motion Factory promotion surface required for draft creation

## Files explicitly not touched
- broad terminal-backed execution runtime
- Council vote semantics
- ratification policy surfaces
- autonomous apply flows
- formal Motion contract design in `jai-format`
- unrestricted agent shell access

## Rollback plan
If Candidate Motion consumption introduces confusion or excessive complexity, revert the Candidate Motion integration layer and preserve the current Waves planning flow. Because this motion is bounded to prep-layer consumption and promotion, rollback should not affect existing ratified motions or work-run history.

## Acceptance criteria
- `dev-jai-nexus` can consume canonical `candidate.motion` artifacts without redefining their semantics.
- A Waves session can attach or represent one or more Candidate Motions.
- Waves UI renders Candidate Motion distinctly from generic tasks.
- Agent planning output can be mapped into Candidate Motion-shaped artifacts in a bounded way.
- Promotion from Candidate Motion to Motion Factory draft is explicitly defined.
- Candidate Motion remains distinct from formal Motion and WaveTask.
- Existing Council and ratification semantics remain unchanged.

## Done means
`dev-jai-nexus` becomes a real downstream consumer of canonical Candidate Motion, allowing Waves and Motion Factory to work together through a governed prep-layer artifact while preserving formal motion integrity.
