# Execution Plan - motion-0071

## Goal

Define and ratify the Q2 governed loop activation program for
dev-jai-nexus. This motion is a planning and decomposition artifact.
Its execution is the act of ratifying the program structure, not
writing implementation code.

All implementation happens through short-lived child branches. Each
child slice will be governed by its own bounded motion or ratified as
a standalone PR with appropriate evidence. No quarter-long
implementation branch will be created.

---

## Quarter decomposition plan

### WS-1 — Motion-to-packet activation bridge
**Branch:** `sprint/q2s1-motion-packet-bridge`
**Scope:** Two files. No schema migration.
- Add `getMotionFromTags` and `buildMotionTag` helpers to
  `workPacketContract.ts`
- Add `portal/scripts/activate-motion.mjs` that reads a RATIFIED
  motion's `execution.handoff.json` and creates a motion-tagged work
  packet routed to ARCHITECT

**Acceptance gate:** A RATIFIED motion with an issued handoff can
produce a work packet carrying `motion:X` identity in its inbox tags.

**Child motion:** Yes — this slice is narrow enough to stand alone
as a single ratified PR. A child motion will be proposed before
implementation begins.

---

### WS-2 — Agent runtime motion context binding
**Branch:** `sprint/q2s2-agent-motion-context`
**Scope:** `architectRuntime.ts`, possibly `builderRuntime.ts`.
- Given a work packet with `motion:X` tag, load `execution.md` from
  the motion directory as the plan source
- Plan artifact must contain content derived from `execution.md`,
  not a hardcoded template

**Acceptance gate:** Architect runtime plan artifact for a
motion-linked packet contains the motion's execution plan summary.

**Child motion:** Yes — requires its own motion because it changes
agent runtime behavior.
**Prerequisite:** WS-1 must be ratified and deployed.

---

### WS-3 — Operator motion state surface
**Branch:** `sprint/q2s3-operator-motion-surface`
**Scope:** New or extended operator route.
- Server-side read of `decision.yaml`, `execution.handoff.json`,
  `execution.receipt.json` for a given motionId
- Display council decision status, handoff state, and receipt state
  in one operator view

**Acceptance gate:** Operator can navigate to a motion's live state
and see governance + execution state without reading `.nexus/`
files manually.

**Child motion:** Yes.
**Prerequisite:** WS-1 (motionId must exist on work packets for the
surface to correlate packet and motion).

---

### WS-4 — Receipt closure from operator approval
**Branch:** `sprint/q2s4-receipt-closure`
**Scope:** Operator work UI approval action or `workPacketActions.ts`.
- When operator approves a packet tagged `motion:X`, surface an
  explicit action to record `execution.receipt.json` as COMPLETED
- The receipt records the approving operator and completion timestamp

**Acceptance gate:** Operator approval of a motion-linked packet
produces a durable `execution.receipt.json` with status COMPLETED.

**Child motion:** Yes.
**Prerequisite:** WS-1, WS-3.

---

### WS-5 — Loop coherence gate
**Branch:** `sprint/q2s5-loop-coherence-gate`
**Scope:** New script only.
- `portal/scripts/validate-loop-coherence.mjs --motion motion-XXXX`
- Checks: RATIFIED decision, ISSUED handoff, motion-tagged work
  packet present, receipt COMPLETED if packet DONE
- Exits 0 (PASS) or 1 (FAIL) with a clear per-check report

**Acceptance gate:** Script produces a reproducible PASS result for
a fully closed loop and a clear FAIL with diagnostics for a partial
or broken one.

**Child motion:** Yes.
**Prerequisite:** WS-1 through WS-4.

---

## Notes on sequencing

- WS-1 is the load-bearing first slice. Nothing downstream is
  possible without it.
- WS-2 and WS-3 can proceed in parallel once WS-1 is ratified.
- WS-4 depends on WS-3 being visible but can be drafted in parallel.
- WS-5 is the integration validator and should come last.
- Child motions should be proposed immediately before their
  implementation begins — not all at once upfront.

## What this motion does NOT authorize

- Implementing any workstream code directly on this branch
- Merging WS-1 through WS-5 code without child motion ratification
- Expanding scope beyond the five listed workstreams without a new
  motion
- Any broad control-plane refactor, schema redesign, or council seam
  extraction under the program umbrella
