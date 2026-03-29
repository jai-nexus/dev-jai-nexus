# Execution Plan - motion-0069

## Goal
Add the smallest bounded post-ratification execution boundary in dev-jai-nexus
through durable handoff and receipt artifacts.

## Plan
1. Define a durable `execution.handoff.json` artifact for ratified motions.
2. Define a durable `execution.receipt.json` artifact for actual execution state.
3. Add a bounded script to issue execution handoff for a ratified motion.
4. Add a bounded script to record execution receipt state.
5. Keep execution state separate from governance state.
6. Keep the first slice repo-local and inspectable.

## Files touched
- `portal/scripts/council-run.mjs` only if needed for read/consistency, not for automatic execution
- new script for issuing execution handoff
- new script for recording execution receipt
- motion-local artifacts under `.nexus/motions/motion-0069/` for design and governance

## Files explicitly not touched
- Waves execution surfaces
- planner surfaces
- Work UI
- autonomous execution paths
- cross-repo execution flows

## Rollback plan
If the new handoff/receipt artifacts or scripts are confusing or misleading,
remove the new scripts and artifacts and revert to the prior boundary where
ratification remains the terminal governed state.

## Acceptance criteria
- A ratified motion can issue an execution handoff artifact.
- A non-ratified motion cannot issue an execution handoff artifact.
- A separate execution receipt artifact can record real execution state.
- Handoff and receipt are clearly distinct from ratification.
- No execution completion is implied without a receipt artifact.
- The slice remains bounded to repo-local semantics only.

## Done means
dev-jai-nexus can honestly represent the first bounded step after ratification
without implying that execution has already occurred.
