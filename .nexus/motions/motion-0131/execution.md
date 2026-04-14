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

### Modified files (actual)

- `portal/src/lib/grid/gridMotionDraft.ts` — commit be6d5ff (+28 lines):
  - `MOTION_ID_PATTERN: RegExp` — `/^motion-\d{4}$/`
  - `isValidMotionId(id: string): boolean`
  - `substituteMotionId(scaffold: MotionDraftScaffold, motionId: string): MotionDraftScaffold`
    — pure, uses `replaceAll("motion-XXXX", motionId)` on all four string fields; returns
    new object via spread, input not mutated
  - No new imports; module remains two `import type` only; no side effects

- `portal/src/app/operator/grid/GridView.tsx` — commit 0e6849b (+57/-10 lines):
  - Import: `isValidMotionId`, `substituteMotionId` added from `@/lib/grid/gridMotionDraft`
  - `buildBundle(s: MotionDraftScaffold): string` — pure helper: concatenates 4 file strings
    with `=== <filename> ===` section headers
  - `MotionDraftModal`:
    - `motionId: string` state (default `""`)
    - `idValid = isValidMotionId(motionId)` — drives banner color and substitution
    - `resolved` — `substituteMotionId(scaffold, motionId)` when idValid, else raw scaffold
    - `activeContent` — `buildBundle(resolved)` for bundle tab, `resolved[activeTab]` otherwise
    - `footerPath` — `.nexus/motions/<motionId>/<label>` when valid, else `motion-XXXX`
    - Motion ID input field: font-mono, placeholder `motion-XXXX`, focus border amber
    - Status banner: amber when empty/invalid, green (emerald) when valid
    - Bundle tab (5th): key `"bundle"`, label `"bundle.txt"`
    - `activeLabel` extracted once — used in footer and copy button label

### Unchanged

- `portal/src/lib/grid/gridDiff.ts` — untouched
- `portal/src/lib/grid/gridDraft.ts` — untouched
- `portal/src/lib/grid/connectionValidator.ts` — untouched
- `portal/src/lib/grid/gridConfig.ts` — untouched
- `portal/src/app/operator/grid/page.tsx` — untouched
- All `.nexus/` governance scripts — untouched

### Commits

- `be6d5ff` — slice 1: `portal/src/lib/grid/gridMotionDraft.ts` (pure ID helpers)
- `0e6849b` — slice 2: `portal/src/app/operator/grid/GridView.tsx` (modal ergonomics)

---

## Evidence log

### 1. validate-motion exits 0

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0131/motion.yaml
→ ✅ motion schema OK
```

Confirmed: motion_id, kind, status, required_gates, checks_required all valid.

---

### 2. validate-agency exits 0

```
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK (202 agents)
```

---

### 3. pnpm -C portal typecheck exits 0

```
pnpm -C portal typecheck
→ exit 0 (clean)
```

Confirmed with both updated `gridMotionDraft.ts` (commit be6d5ff) and updated `GridView.tsx`
(commit 0e6849b) in place. Gate recorded in verify.json by council-run at actual execution
timestamp.

---

### 4. gridMotionDraft.ts remains a pure module with no new imports

`gridMotionDraft.ts` after slice 1 still imports only:
- `import type { StructuralDiff, NormalizedPositionChange } from "./gridDiff"` — type-only
- `import type { ConnectionChange } from "./gridDraft"` — type-only

`MOTION_ID_PATTERN`, `isValidMotionId`, and `substituteMotionId` introduce no new imports.
No `fs`, no `path`, no server-only modules. Verifiable at commit be6d5ff.

---

### 5. substituteMotionId is pure and does not mutate input

`substituteMotionId` spreads the input scaffold and overwrites only the four string fields
using `replaceAll`. Returns a new `MotionDraftScaffold`. The input object is not mutated.
Verifiable at commit be6d5ff.

---

### 6. isValidMotionId boundary cases

`MOTION_ID_PATTERN = /^motion-\d{4}$/`:
- `"motion-0131"` → `true`
- `"motion-XXXX"` → `false` (X is not a digit)
- `"motion-12345"` → `false` (5 digits, not 4)
- `""` → `false`

Verifiable by reading `MOTION_ID_PATTERN` and calling `isValidMotionId` at commit be6d5ff.

---

### 7. MotionDraftModal — motion ID input and status banner

`MotionDraftModal` at commit 0e6849b:
- Input renders with `placeholder="motion-XXXX"`, `font-mono`, amber focus border
- `idValid = isValidMotionId(motionId)` drives `resolved` scaffold and banner variant
- Amber banner: `border-amber-700/50 bg-amber-950/40 text-amber-300`
- Green banner: `border-emerald-700/50 bg-emerald-950/40 text-emerald-300`
- Green banner text: `Motion ID set to <motionId>. Ready to copy.`

---

### 8. Bundle tab — content and copy button

Bundle tab (5th, key `"bundle"`, label `"bundle.txt"`) at commit 0e6849b:
```
=== motion.yaml ===
[motionYaml]

=== proposal.md ===
[proposalMd]

=== execution.md ===
[executionMd]

=== challenge.md ===
[challengeMd]
```
Copy button label: `Copy bundle.txt`. Content uses `resolved` scaffold — if a valid motion
ID is entered, `motion-XXXX` is replaced in the bundle output.

---

### 9. Footer path updates with valid motion ID

`footerPath = .nexus/motions/${idValid ? motionId : "motion-XXXX"}/${activeLabel}`

When `motionId = "motion-0131"` and `activeTab = "motionYaml"`:
→ `.nexus/motions/motion-0131/motion.yaml`

When `motionId = ""`:
→ `.nexus/motions/motion-XXXX/motion.yaml`

---

### 10. No regression — existing four tabs and draft surface unaffected

`SCAFFOLD_TABS` now has 5 entries; the first four (motionYaml, proposalMd, executionMd,
challengeMd) are unchanged in key and label. `activeContent` for the original four tabs
uses `resolved[activeTab]` — same indexing as before, now substitution-aware.
`draftReducer`, `handleDragStart`, `handleDropOnZone`, `handleConnectClick`, `exitConnMode`,
and the DISCARD path are all unchanged in commit 0e6849b. Only `MotionDraftModal` and the
import line changed.
