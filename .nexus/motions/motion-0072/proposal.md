# Proposal - motion-0072

## Title
bounded motion-to-packet bridge activation

## Parent
motion-0071 (WS-1, Q2 loop activation program)

## What this motion does

Adds the foundational identity link between the governance loop and the
execution loop:

1. **Motion tag convention** — two pure helpers in `workPacketContract.ts`
   that define how a work packet carries its governing motion identity.

2. **Dry-run activation script** — `activate-motion.mjs` that reads a
   RATIFIED motion's artifacts and outputs the exact activation intent
   for a motion-linked work packet, without performing any database writes.

This is WS-1 phase 1. It establishes the convention and the inspection
path. Live work packet creation comes in WS-1 phase 2 (a separate child
slice).

---

## Activatability definition

`activate-motion.mjs` will declare a motion "activatable" when all of
the following are true:

| Check | Source | Required |
|---|---|---|
| Motion directory exists | `.nexus/motions/<motionId>/` | yes |
| `motion.yaml` is readable | motion artifact | yes |
| `decision.yaml` status is `RATIFIED` | governance artifact | yes |
| `execution.handoff.json` exists | execution artifact | yes |
| `execution.handoff.json` status is `ISSUED` | execution artifact | yes |
| Target repo is derivable | `decision.yaml` or `motion.yaml` | yes |
| `execution.md` is present | motion artifact | warn only (WS-2 signal) |

If any required check fails, the script exits 1 with the specific
failing check identified. `execution.md` absence is a warning, not a
blocker — a packet can be activated without WS-2 context binding being
ready.

---

## Tag convention

The existing tag system in `workPacketContract.ts` uses:
- `assignee:<nhId>` — who owns the work
- `route:<ROLE>` — which lane the packet is in

`stripManagedTags` in `workPacketActions.ts` strips `assignee:` and
`route:` on re-routing. It does NOT strip `motion:` — so the motion
identity tag persists through the full architect → builder → verifier →
operator routing chain naturally, without any changes to the routing
system.

New convention added by this motion:
- `motion:<motionId>` — e.g. `motion:motion-0072`

New helpers added to `workPacketContract.ts`:
- `buildMotionTag(motionId: string): string`
  → returns `"motion:motion-0072"`
- `getMotionFromTags(tags: string[]): string | null`
  → returns `"motion-0072"` or `null`

Both follow the exact same pattern as the existing `assignee:` helpers.

---

## Dry-run output shape

```
[ACTIVATE-MOTION] Motion: motion-0072
[ACTIVATE-MOTION] Title: bounded motion-to-packet bridge activation
[ACTIVATE-MOTION] Decision status: RATIFIED ✓
[ACTIVATE-MOTION] Handoff status: ISSUED ✓
[ACTIVATE-MOTION] Handoff ID: motion-0072-handoff-001
[ACTIVATE-MOTION] Target repo: dev-jai-nexus

[ACTIVATE-MOTION] --- Activation intent (dry-run) ---
[ACTIVATE-MOTION] Activation tag:  motion:motion-0072
[ACTIVATE-MOTION] Route tag:       route:ARCHITECT
[ACTIVATE-MOTION] Packet title:    [motion-0072] bounded motion-to-packet bridge activation
[ACTIVATE-MOTION] execution.md:    PRESENT (WS-2 context binding ready)

[ACTIVATE-MOTION] This motion is activatable.
[ACTIVATE-MOTION] DRY-RUN ONLY — no database writes performed.
```

---

## Why this is the right first slice

Without `motion:` identity on a work packet:
- WS-2 (agent runtime context binding) has no motionId to load `execution.md` from
- WS-3 (operator motion surface) has no packet to correlate with a motion
- WS-4 (receipt closure) has no packet to detect as DONE
- WS-5 (coherence gate) has no packet to check

The tag convention and the dry-run script together provide the
inspection and planning surface for all downstream workstreams, at
zero DB-write risk.

---

## Files changed

| File | Change |
|---|---|
| `portal/src/lib/work/workPacketContract.ts` | Add `buildMotionTag`, `getMotionFromTags` |
| `portal/scripts/activate-motion.mjs` | New dry-run activation script |
