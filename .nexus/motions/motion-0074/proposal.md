# Proposal - motion-0074

## Title
bounded motion activation happy-path proof

## Parent
motion-0071 (WS-1 phase 3, Q2 loop activation program)
Extends: motion-0073 (WS-1 phase 2 — real creation path)

## What this motion does

Exercises the full activation bridge end-to-end against one real ratified
motion in live repo conditions. The bridge (activate-motion.mjs --create)
was built and unit-validated in phases 1 and 2 but has not been run
against an actual governed candidate with a live database. This phase
provides durable proof that the happy path works, that the resulting
packet is correctly shaped and tagged, and that duplicate prevention
holds.

---

## Candidate selection

**Chosen candidate: motion-0070** — "bounded council policy seam extraction"

| Property | Value |
|---|---|
| Status | RATIFIED |
| verify.json | present (required by issue-execution-handoff.mjs) |
| execution.md | present (WS-2 readiness signal) |
| execution.handoff.json | absent (to be issued in this slice) |
| Scope | Pure code refactor — council policy kernel extraction |
| Motion Factory | not involved |
| Handoff/receipt semantics | not involved (avoids circularity) |

**Why not motion-0068?**
motion-0068 involves Motion Factory — explicitly out of scope for WS-1
phase 3 per program constraints.

**Why not motion-0069?**
motion-0069 is the motion that defined the handoff/receipt system itself.
Using it as the proof candidate would be circular and obscures evidence
about the bridge rather than illuminating it.

**Why motion-0070?**
Smallest, cleanest candidate: a bounded, already-implemented refactor
with no external dependencies, no Motion Factory surface, and no overlap
with the handoff/receipt machinery being exercised.

---

## Proof sequence

### Step 0 — Syntax check
```
node --check portal/scripts/activate-motion.mjs
pnpm -C portal typecheck
```

### Step 1 — Issue handoff
```
node portal/scripts/issue-execution-handoff.mjs --motion motion-0070
```
Produces: `.nexus/motions/motion-0070/execution.handoff.json` with
`status=ISSUED`.

### Step 2 — Dry-run activation
```
node portal/scripts/activate-motion.mjs --motion motion-0070
```
Expected: exits 0. All six required checks pass. No DB write.

### Step 3 — Real creation (happy path)
```
node portal/scripts/activate-motion.mjs --motion motion-0070 --create
```
Expected: exits 0. Prints WorkPacket ID, InboxItem ID, and tags.
Tags must include `motion:motion-0070` and `route:ARCHITECT`.

### Step 4 — Duplicate prevention
```
node portal/scripts/activate-motion.mjs --motion motion-0070 --create
```
Expected: exits 1. Prints existing InboxItem ID and WorkPacket ID.
No new packet is created.

---

## Evidence requirements

The execution.md for this motion records exact command outputs for
steps 1–4. The outputs are the canonical proof artifact for WS-1 phase 3.

---

## What is not changed

- `portal/scripts/activate-motion.mjs` — no change
- `portal/scripts/issue-execution-handoff.mjs` — no change
- `portal/src/lib/work/workPacketContract.ts` — no change
- Prisma schema — no change
- Any operator UI surface — no change
- Any agent runtime — no change

---

## Files added

| File | Purpose |
|---|---|
| `.nexus/motions/motion-0074/` | governance package for this proof slice |
| `.nexus/motions/motion-0070/execution.handoff.json` | handoff prerequisite for proof candidate |
