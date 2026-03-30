# Challenge: Bounded Staged Workstream Dispatch Activation v0 — OffBook.ai

**Motion:** motion-0096
**Challenger role:** challenger
**Date:** 2026-03-30

## Review

The seam is minimal and correctly reuses the proven execution lane. Three
objections raised.

---

### C-1: activate-staged-project.mjs does not require a RATIFIED decision.yaml,
but enqueue-motion-packet.mjs does — is this an inconsistency?

**Concern:** `activate-motion.mjs` refuses to create a packet unless the motion
is RATIFIED. The new script only checks that `motion.yaml` exists and has a title.
If an operator runs `--create` and then tries to enqueue, the enqueue step would
fail with "Motion not RATIFIED."

**Resolution:** The split is intentional and documented. `activate-staged-project.mjs`
creates the packet (which can happen while the motion is in DRAFT — the packet
represents work-in-progress). `enqueue-motion-packet.mjs` bridges to the architect
queue (which is an execution step requiring ratification). The script explicitly
warns: "Note: --create + enqueue-motion-packet.mjs require decision.yaml status=RATIFIED."
The operator knows the precondition. The dry-run is fully usable while DRAFT.
Accepted.

---

### C-2: The `project:offbook-ai` tag is not parsed by any existing helper —
how does it show in operator surfaces?

**Concern:** `workPacketContract.ts` has `getMotionFromTags`, `getAssigneeFromTags`,
`getRequestedRoleFromTags`, but no `getProjectFromTags`. The tag would just be in
the raw `inboxTags` array.

**Resolution:** The operator detail page (`/operator/work/[id]`) already renders
`inboxTags.join(", ")` at line 914–915. The `project:offbook-ai` tag is visually
present without any additional parsing. A dedicated helper or filter would be a
natural follow-up but is not required for the seam to work. Accepted.

---

### C-3: The dispatch handle says "all 9 required fields satisfied" but the
spec defines 10 required fields (including wave_state.current_wave).

**Concern:** The output says "all 9 required fields satisfied" which appears
inconsistent with the spec's 10-field table.

**Resolution:** `wave_state.current_wave` is validated in check 3 (a separate,
earlier check). Check 4 validates the remaining 9 handle fields. The total
validation is correct (all 10 fields are checked); the message just reflects
the split. The implementation is correct. Cosmetic only. Accepted.

---

## Verdict

No blocking objections. All three challenges accepted. The seam is minimal,
correct, and reuses the proven execution lane.
