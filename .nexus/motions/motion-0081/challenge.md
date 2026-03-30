# Challenge: bounded operator receipt closure

**Motion:** motion-0081
**Challenger role:** DEV Challenger (6.0.3)
**Date:** 2026-03-30

## Challenges raised

### C1: Should receipt writing be in workPacketActions.ts instead of the page?

`applyPacketRouteAction` already has access to inbox tags and packet data
inside the transaction. Putting receipt writing there would be DRY.

**Resolution:** `workPacketActions.ts` is a shared library that should not
acquire filesystem I/O side effects. The receipt write is an operator-surface
concern: only the operator surface should close the governed loop. The
separation is intentional. A shared library that writes `.nexus/` files
would couple execution state to governance artifact I/O in the wrong layer.
The page-level `runDecisionAction` is the right insertion point.

### C2: Is it safe to write execution.receipt.json from a Next.js server action?

Server actions run in Node.js. The page already has `export const runtime =
"nodejs"` and the WS-3 surface already reads `.nexus/` files synchronously
from the same process. Writing synchronously is acceptable for the same
reasons reading is acceptable: small files, fast I/O, all wrapped in
try/catch.

**Resolution:** Acceptable. The write is defensive (try/catch), the directory
must already exist (motion must be active to have produced inboxTags), and the
artifact is idempotent: overwriting with new data on a second operator action
is correct behavior (outcome may change from REQUEUED to COMPLETED after
rework).

### C3: Should receipt_id be a UUID or a fixed `<motionId>-receipt-001`?

A UUID would be unique per invocation; a fixed id is stable and overwritable.

**Resolution:** Fixed `<motionId>-receipt-001`. The receipt is a per-motion
singleton: one motion has one receipt reflecting the current terminal operator
decision. The fixed id mirrors the `handoff_id` pattern in `execution.handoff.json`.
If the operator later changes their decision (REQUEUED then APPROVED after
rework), the receipt file is overwritten with the new outcome. This is
correct behavior for a mutable terminal state artifact.

### C4: Should REQUEST_CHANGES and REQUEUE write a receipt?

APPROVE clearly closes the loop. REQUEST_CHANGES and REQUEUE are reversible
mid-loop states — they do not permanently close the packet.

**Resolution:** Yes, write receipt for all three. The receipt reflects the
current operator decision, not permanent closure. If the packet is later
re-approved after changes, the receipt will be overwritten with
status=COMPLETED. Writing for CHANGES_REQUESTED and REQUEUED gives the
operator surface and any future loop-coherence gate a complete view of the
current operator decision at all times, not only at final approval.

### C5: Does the Governing Motion section automatically reflect the new receipt?

The section reads `execution.receipt.json` on each server-side page render.
After the server action writes the file and redirects, the page reloads and
reads the new status.

**Resolution:** Yes. No UI change is required. motion-0080 already handles
this correctly.

## Verdict

No blockers. Challenges C1–C5 resolved inline. Proceed with implementation.
