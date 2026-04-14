# Execution: JAI Grid Draft Package Ergonomics v0

**Motion:** motion-0131
**Role:** BUILDER
**Date:** 2026-04-14

---

## Cost estimate

Category: standard
Basis: three new pure helpers in existing lib module + targeted update to one existing client
component. No database schema changes. No writes to canonical governance artifacts. No changes
to council-run, activate-motion, or any governance script. Scope is confined to two files
in portal/src/.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard → evidence-falsifiability mandatory.

---

## Scope

### Modified files

- `portal/src/lib/grid/gridMotionDraft.ts` — slice 1:
  - `MOTION_ID_PATTERN: RegExp` — `/^motion-\d{4}$/`
  - `isValidMotionId(id: string): boolean`
  - `substituteMotionId(scaffold: MotionDraftScaffold, motionId: string): MotionDraftScaffold`
  - No new imports; module remains pure

- `portal/src/app/operator/grid/GridView.tsx` — slice 2:
  - Import: `isValidMotionId`, `substituteMotionId` added from `@/lib/grid/gridMotionDraft`
  - `MotionDraftModal`: motion ID input field, `resolvedScaffold` local state, amber/green
    status banner, Bundle tab (5th), footer path update

### Unchanged

- `portal/src/lib/grid/gridDiff.ts` — untouched
- `portal/src/lib/grid/gridDraft.ts` — untouched
- `portal/src/lib/grid/connectionValidator.ts` — untouched
- `portal/src/lib/grid/gridConfig.ts` — untouched
- `portal/src/app/operator/grid/page.tsx` — untouched
- All `.nexus/` governance scripts — untouched

---

## Evidence log

*(Populated during proof execution)*
