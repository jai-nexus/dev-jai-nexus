# Execution: JAI Grid Motion Draft Ingestion v0

**Motion:** motion-0130
**Role:** BUILDER
**Date:** 2026-04-14

---

## Cost estimate

Category: standard
Basis: one new pure lib module + targeted update to one existing client component.
No database schema changes. No writes to canonical governance artifacts. No changes to
council-run, activate-motion, or any governance script. Scope is confined to two files
in portal/src/.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard → evidence-falsifiability mandatory.

---

## Scope

### New files (actual)

- `portal/src/lib/grid/gridMotionDraft.ts` — pure module (301 lines, commit ecf0d8b):
  - `MotionDraftScaffold` interface: `motionYaml`, `proposalMd`, `executionMd`,
    `challengeMd`, `generatedAt`, `changesSummary`
  - `ChangesSummary` interface: `positionChanges`, `connectionChanges`, `derivedTitle`
  - `MotionDraftOpts` interface: optional `proposer_nh_id`, `council_nh_id`, `program`
  - `buildMotionDraftScaffold(diff: StructuralDiff, opts?: MotionDraftOpts): MotionDraftScaffold`
  - Internal generators: `buildMotionYaml()`, `buildProposalMd()`, `buildExecutionMd()`,
    `buildChallengeMd()`, `buildChangesSummary()`
  - Imports: `import type { StructuralDiff, NormalizedPositionChange } from "./gridDiff"` and
    `import type { ConnectionChange } from "./gridDraft"` — both `import type`, erased at
    compile time; no server-only imports
  - No side effects; no fs writes; deterministic

### Modified files (actual)

- `portal/src/app/operator/grid/GridView.tsx` — commit 22a777b (+85/-40 lines):
  - Import: `serializeMotionDraft` removed; `buildMotionDraftScaffold` and
    `MotionDraftScaffold` type imported from `@/lib/grid/gridMotionDraft`
  - State: `diffYaml: string | null` → `scaffold: MotionDraftScaffold | null`
  - `handlePropose()`: `diffGridDraft(config, draft)` → `buildMotionDraftScaffold(diff)` →
    `setScaffold(scaffold)` → `setShowDiff(true)`
  - `DiffModal` component replaced by `MotionDraftModal`:
    - `SCAFFOLD_TABS` constant: 4 tabs (`motionYaml`, `proposalMd`, `executionMd`, `challengeMd`)
    - `activeTab: ScaffoldTabKey` state (default `"motionYaml"`)
    - `copiedTab: ScaffoldTabKey | null` state — per-tab copy tracking, clears after 2s
    - Amber placeholder warning banner in header (always visible)
    - Per-tab copy button labeled `Copy motion.yaml` / `Copy proposal.md` etc.
    - Footer shows `.nexus/motions/motion-XXXX/<active-filename>` destination path
    - Click-outside and `×` to close; closing does not clear draft state

### Unchanged

- `portal/src/lib/grid/gridDiff.ts` — untouched (diffGridDraft + serializeMotionDraft remain)
- `portal/src/lib/grid/gridDraft.ts` — untouched
- `portal/src/lib/grid/connectionValidator.ts` — untouched
- `portal/src/lib/grid/gridConfig.ts` — untouched
- `portal/src/app/operator/grid/page.tsx` — untouched
- All `.nexus/` governance scripts — untouched

### Commits

- `ecf0d8b` — slice 1: `portal/src/lib/grid/gridMotionDraft.ts` (new)
- `22a777b` — slice 2: `portal/src/app/operator/grid/GridView.tsx` (DiffModal → MotionDraftModal)

---

## Evidence log

### 1. validate-motion exits 0

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0130/motion.yaml
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

Confirmed with both `gridMotionDraft.ts` (new) and updated `GridView.tsx` in place.
Gate recorded in verify.json by council-run at actual execution timestamp.

---

### 4. gridMotionDraft.ts is a pure function with no server-only imports

`gridMotionDraft.ts` imports:
- `import type { StructuralDiff, NormalizedPositionChange } from "./gridDiff"` — type-only, erased at compile time
- `import type { ConnectionChange } from "./gridDraft"` — type-only, erased at compile time

No `fs`, no `path`, no `getAgencyConfig()`, no `loadGridConfig()`. No side effects.
Verifiable by reading the committed file at commit ecf0d8b.

---

### 5. Same StructuralDiff input → identical scaffold output (deterministic)

`buildMotionDraftScaffold()` is a pure function: all generators receive only the `diff`
argument and derived values from it. No `Date.now()`, no `Math.random()`, no external
reads. Timestamps come from `diff.generatedAt` (set by `diffGridDraft()` at call time,
but stable for any given diff object).

Verifiable by reading `gridMotionDraft.ts`: no non-deterministic calls anywhere in the
module.

---

### 6. MotionDraftModal shows four named sections with per-section copy buttons

`SCAFFOLD_TABS` constant in `GridView.tsx`:
```typescript
const SCAFFOLD_TABS = [
  { key: "motionYaml",  label: "motion.yaml"  },
  { key: "proposalMd",  label: "proposal.md"  },
  { key: "executionMd", label: "execution.md" },
  { key: "challengeMd", label: "challenge.md" },
] as const;
```

Each tab renders: filename label in tab bar; `scaffold[activeTab]` in scrollable pre block;
copy button labeled `Copy <filename>`; footer with `.nexus/motions/motion-XXXX/<filename>`
destination path. Verifiable by reading `MotionDraftModal` component in `GridView.tsx`
at commit 22a777b.

---

### 7. motion-XXXX placeholder warning visible in modal header

`MotionDraftModal` renders an amber banner before the tab bar:

```
Replace `motion-XXXX` with the next available motion ID before committing.
No files have been written.
```

Always visible regardless of active tab. Verifiable at commit 22a777b.

---

### 8. git status clean after any modal interaction (no .nexus/ writes)

`MotionDraftModal` uses `navigator.clipboard.writeText()` only. No `fs` imports in
`GridView.tsx` or `gridMotionDraft.ts`. `handlePropose()` calls `buildMotionDraftScaffold()`
(pure function) and `setScaffold()` (React state). No writes to disk, no API calls, no
`.nexus/` mutations. git status remains clean after opening, copying, and closing the modal.

---

### 9. Existing drag/connect/discard behavior unaffected (no regression)

`handlePropose()` change is isolated to the propose path. `draftReducer`, `applyDraftToLayout`,
`handleDragStart`, `handleDropOnZone`, `handleConnectClick`, `exitConnMode`, and the
`DISCARD` path are all unchanged in commit 22a777b. Only the modal component and its
wiring state (`diffYaml` → `scaffold`) changed.
