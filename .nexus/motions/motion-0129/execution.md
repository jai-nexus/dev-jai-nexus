# Execution: JAI Grid Configuration Mode v0

**Motion:** motion-0129
**Role:** BUILDER
**Date:** 2026-04-13

---

## Cost estimate

Category: standard
Basis: new operator sub-tab + new route + new lib module + new components. No database
schema changes. No writes to canonical governance artifacts. No changes to council-run,
activate-motion, or any governance script. Scope is confined to portal/src/ and the
motion-0129 package.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard → evidence-falsifiability mandatory.

---

## Scope

### New files

- `portal/src/app/operator/grid/page.tsx` — server component; reads GridConfig, renders GridCanvas
- `portal/src/app/operator/grid/GridCanvas.tsx` — "use client"; canvas, drag, mode switcher
- `portal/src/components/operator/grid/GridZone.tsx` — zone container
- `portal/src/components/operator/grid/GridAgent.tsx` — draggable agent card
- `portal/src/components/operator/grid/GridConnection.tsx` — SVG connection line
- `portal/src/components/operator/grid/PropertyPanel.tsx` — read-only agent detail
- `portal/src/components/operator/grid/DraftBanner.tsx` — pending changes + Propose/Discard
- `portal/src/lib/grid/gridConfig.ts` — GridConfig type, loadGridConfig()
- `portal/src/lib/grid/gridDraft.ts` — GridDraftState, PositionChange, ConnectionChange, reducer
- `portal/src/lib/grid/gridDiff.ts` — diffGridDraft(), serializeMotionDraft()
- `portal/src/lib/grid/connectionValidator.ts` — validateConnection(from, to, type)

### Modified files

- `portal/src/components/operator/OperatorSubnav.tsx`:
  - Add `{ href: "/operator/grid", label: "Grid" }` to `links` array (1 line addition)

### Read-only sources (no writes at runtime)

- `.nexus/context/slot-policy.yaml` — read by gridConfig.ts for zone/role definitions
- `lib/agencyConfig.ts` / `getAgencyConfig()` — read for canonical agent roster

---

## Commit plan

### Commit 1 — routing + skeleton
- Add Grid link to OperatorSubnav.tsx
- Create portal/src/app/operator/grid/page.tsx (static skeleton)

### Commit 2 — data layer
- portal/src/lib/grid/gridConfig.ts
- portal/src/lib/grid/gridDraft.ts
- portal/src/lib/grid/connectionValidator.ts
- typecheck pass on new lib files

### Commit 3 — canvas rendering
- GridZone, GridAgent, GridConnection components
- GridCanvas client component (render only, no interactivity yet)
- page.tsx wires loadGridConfig() → GridCanvas

### Commit 4 — interactivity: drag + selection + property panel
- GridCanvas drag/reposition → GridDraftState dispatch
- PropertyPanel component
- DraftBanner (pending changes count)

### Commit 5 — connection drawing + validation
- Connection drawing mode in GridCanvas
- connectionValidator.ts enforced on draw
- GridConnection renders staged connections

### Commit 6 — governed diff output + final pass
- portal/src/lib/grid/gridDiff.ts
- "Propose Changes" → diff YAML output modal/pre block
- Discard Draft reset
- Final typecheck pass

---

## Planned evidence

1. `validate-motion` exits 0 for motion-0129
2. `validate-agency` exits 0
3. `pnpm -C portal typecheck` exits 0
4. `/operator/grid` route accessible; Grid appears in subnav active state
5. Canvas renders 5 zones (ARCHITECT, BUILDER, VERIFIER, OPERATOR, LIBRARIAN) with
   correct agents from canonical roster
6. Drag agent → `git status` shows no file modifications; draft banner increments
7. Property panel shows correct agent fields for selected agent
8. Connection draw: ARCHITECT→BUILDER (handoff) accepted; VERIFIER→ARCHITECT (handoff)
   rejected with validator reason
9. "Propose Changes" outputs motion-draft YAML block; `git status` shows no file
   modifications
10. Discard Draft resets canvas to canonical view; draft banner cleared

---

## Evidence log

*(Populated during proof execution)*
