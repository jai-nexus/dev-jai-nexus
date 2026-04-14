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

### New files

- `portal/src/lib/grid/gridMotionDraft.ts` — pure module:
  - `MotionDraftScaffold` interface: `motionYaml`, `proposalMd`, `executionMd`,
    `challengeMd`, `generatedAt`, `changesSummary`
  - `MotionDraftOpts` interface: optional `proposer_nh_id`, `council_nh_id`, `program`
  - `buildMotionDraftScaffold(diff: StructuralDiff, opts?: MotionDraftOpts): MotionDraftScaffold`
    — generates all four motion package files as strings from `StructuralDiff`
  - Hand-built string generators for each file (no template library)
  - No imports from server-only modules; no side effects

### Modified files

- `portal/src/app/operator/grid/GridView.tsx`:
  - Import: replace `serializeMotionDraft` from `gridDiff` with
    `buildMotionDraftScaffold` from `gridMotionDraft`
  - State: `diffYaml: string | null` → `scaffold: MotionDraftScaffold | null`
  - `handlePropose()`: calls `buildMotionDraftScaffold(diff)` instead of
    `serializeMotionDraft(diff)`
  - `DiffModal` component → `MotionDraftModal` component: four named sections
    (motion.yaml, proposal.md, execution.md, challenge.md), per-section copy buttons,
    prominent `motion-XXXX` placeholder notice
  - Import `MotionDraftScaffold` type from `gridMotionDraft`

### Unchanged

- `portal/src/lib/grid/gridDiff.ts` — untouched (diffGridDraft + serializeMotionDraft remain)
- `portal/src/lib/grid/gridDraft.ts` — untouched
- `portal/src/lib/grid/connectionValidator.ts` — untouched
- `portal/src/lib/grid/gridConfig.ts` — untouched
- `portal/src/app/operator/grid/page.tsx` — untouched
- All `.nexus/` governance scripts — untouched

---

## Commit plan

### Commit 1 — scaffold generator

- `portal/src/lib/grid/gridMotionDraft.ts` (new)
- All four scaffold generators: `buildMotionYaml()`, `buildProposalMd()`,
  `buildExecutionMd()`, `buildChallengeMd()`
- `buildMotionDraftScaffold()` root function
- Typecheck pass on new file

### Commit 2 — MotionDraftModal in GridView.tsx

- `portal/src/app/operator/grid/GridView.tsx`:
  - Replace `DiffModal` with `MotionDraftModal`
  - Wire `buildMotionDraftScaffold(diff)` in `handlePropose()`
  - Replace `diffYaml: string | null` state with `scaffold: MotionDraftScaffold | null`
- Final typecheck pass

---

## Planned evidence

1. `validate-motion` exits 0 for motion-0130
2. `validate-agency` exits 0
3. `pnpm -C portal typecheck` exits 0 with both new file and updated GridView.tsx
4. `gridMotionDraft.ts` has no server-only imports; pure function
5. Same `StructuralDiff` input → identical scaffold output (deterministic)
6. `MotionDraftModal` shows four sections with per-section filenames and copy buttons
7. `motion-XXXX` placeholder warning visible in modal header
8. git status clean after any modal interaction (no .nexus/ writes)
9. Existing drag/connect/discard behavior unaffected (no regression)

---

## Evidence log

*(Populated during proof execution)*
