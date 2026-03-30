# Challenge: bounded operator motion state surface

**Motion:** motion-0080
**Challenger role:** DEV Challenger (6.0.3)
**Date:** 2026-03-30

## Challenges raised

### C1: Should this be in a shared utility rather than inline in the detail page?

The `findRepoRoot` and motion-context loading pattern already exists in three
runtime files. Adding it again inline to the detail page increases duplication.

**Resolution:** The runtime context loaders return `MotionContext` shaped for
runtime payload production. The operator surface needs `GoverningMotionState`
shaped for display (different fields, different fallback semantics). Creating
a shared utility with two different output shapes adds abstraction pressure
without current justification. Inline is the minimal, reviewable choice.
This is consistent with the CLAUDE.md principle: "Three similar lines of code
is better than a premature abstraction." A shared utility is the right
follow-on when a third distinct consumer exists.

### C2: Should the list page also surface motion identity?

The list page at `/operator/work` already makes motion identity partially
legible: packet titles include `[motion-0070]` prefix and the detail link
leads directly to the governed context.

**Resolution:** The list page is not the right surface for council decision
state, handoff state, and receipt state — those require per-packet file reads
which would be expensive at list scale. The detail page is the correct first
surface. List page enhancements are out of scope for this slice.

### C3: Should receipt status show "—" or "pending" when absent?

The receipt file does not exist yet for packet 880. Showing "—" is accurate
(no file = no record). "pending" is more meaningful for the operator context
since the loop is live and a receipt is expected once WS-4 runs.

**Resolution:** Show "pending" when receiptStatus is null (absent file) on the
assumption that a motion-linked packet at this stage has an expected-but-not-
yet-closed receipt. "—" is used only for fields that are genuinely optional.
The receipt is not optional in the governed loop; it is expected but not yet
written. This is a display-only labeling choice, not a behavior change.

### C4: Does reading .nexus/ files from the Next.js server component introduce any risk?

The detail page already has `export const runtime = "nodejs"` and uses
server-side data loading. File reads are synchronous, small, and wrapped in
try/catch. No I/O risk.

**Resolution:** Acceptable. The pattern is identical to the runtime loaders.
All reads are defensive. The page cannot crash from missing artifacts.

## Verdict

No blockers. Challenges C1–C4 resolved inline. Proceed with implementation.
