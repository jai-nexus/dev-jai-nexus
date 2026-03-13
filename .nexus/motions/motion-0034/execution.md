# Execution Plan - motion-0034

## Goal
Complete the first governed vertical slice by proving the final operator decision layer:
operator review -> approve / request changes.

## Plan
1. Inspect and tighten operator action semantics
   - review current operator actions in `workPacketActions.ts`
   - ensure approve and request-changes are modeled as explicit operator decisions
   - avoid invalid or misleading packet status transitions

2. Prepare approve-branch smoke packet
   - create verifier-routed packet:
     - NH: `1.2.103`
     - Title: `Operator approve smoke test`
   - assign to verifier-capable execution agent
   - run verifier one-shot so the packet becomes operator-review-ready

3. Prove approve path
   - perform approve from operator UI
   - confirm:
     - `WORK_APPROVED`
     - coherent final operator decision state
     - correct operator-facing UI rendering

4. Prepare request-changes smoke packet
   - create verifier-routed packet:
     - NH: `1.2.104`
     - Title: `Operator request changes smoke test`
   - assign to verifier-capable execution agent
   - run verifier one-shot so the packet becomes operator-review-ready

5. Prove request-changes path
   - perform request changes from operator UI
   - confirm:
     - `WORK_REVIEW_REQUESTED`
     - coherent changes-requested operator decision state
     - correct operator-facing UI rendering

6. Validate surfaces
   - packet detail page
   - operator review controls
   - run ledger
   - handoff history
   - SoT event stream

7. Validate local health
   - `pnpm -C portal typecheck`
   - any relevant local build/run validation needed for touched surfaces

## Suggested acceptance criteria
- approve branch is proven live
- request-changes branch is proven live
- `WORK_APPROVED` is emitted for approve
- `WORK_REVIEW_REQUESTED` is emitted for request changes
- operator-facing UI clearly distinguishes review-ready, approved, and changes-requested states
- no misleading status transition remains
- local typecheck passes

## Done means
- the operator decision layer is proven,
- the first vertical governed slice is complete end-to-end,
- motion-0034 is ratified.
