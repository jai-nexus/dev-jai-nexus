# Proposal: JAI Grid Draft Package Ergonomics v0

**Motion:** motion-0131
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-14
**Basis:** motion-0130 (JAI Grid Motion Draft Ingestion v0)

---

## Problem

Motion-0130 delivers `MotionDraftModal` — a four-tab scaffold modal where each tab has a
per-file copy button. The operator flow is:

```
"Propose Changes"
  → MotionDraftModal (4 tabs)
  → operator: copy each tab → paste into .nexus/motions/motion-XXXX/<file>
```

Two ergonomics gaps remain:

**Gap 1 — Manual `motion-XXXX` substitution.**
The placeholder `motion-XXXX` appears in all four scaffold files. The operator must perform
four separate copy → open editor → find → replace → save sequences. There is no mechanism
in the modal to enter the real motion ID and see the substitution applied before copying.

**Gap 2 — Four-copy workflow.**
Packaging a motion requires four separate copy operations (one per tab), each targeting a
different file. There is no single "copy everything" path. For an operator who already knows
the motion ID, the optimal workflow is: enter ID → copy bundle → paste into four files.

---

## Solution

### Slice 1: `gridMotionDraft.ts` — pure ID helpers

Add three exports to `portal/src/lib/grid/gridMotionDraft.ts`:

```typescript
/** Matches motion-0000 through motion-9999 */
export const MOTION_ID_PATTERN = /^motion-\d{4}$/;

/** Returns true iff id matches MOTION_ID_PATTERN */
export function isValidMotionId(id: string): boolean;

/**
 * Returns a new MotionDraftScaffold with every occurrence of "motion-XXXX"
 * replaced by motionId in all four file strings.
 * Pure — does not mutate the input scaffold.
 */
export function substituteMotionId(
  scaffold: MotionDraftScaffold,
  motionId: string,
): MotionDraftScaffold;
```

`substituteMotionId` replaces the literal string `"motion-XXXX"` in
`motionYaml`, `proposalMd`, `executionMd`, and `challengeMd`. It returns a new
`MotionDraftScaffold` object; the input is not mutated.

### Slice 2: `GridView.tsx` — MotionDraftModal ergonomics update

Add to `MotionDraftModal`:

**Motion ID input field**
- Text input with placeholder `motion-XXXX`
- Validates on change via `isValidMotionId()`
- When valid: calls `substituteMotionId(scaffold, motionId)` and stores as
  `resolvedScaffold` (local state); tabs show substituted content
- When empty or invalid: tabs show original scaffold content with `motion-XXXX` placeholder

**Status banner**
- Amber (warning) when motionId is empty or fails `isValidMotionId()`
  → text: `Replace motion-XXXX with the next available motion ID before committing.`
- Green (confirmed) when motionId passes `isValidMotionId()`
  → text: `Motion ID set to <motionId>. Ready to copy.`

**Bundle tab (5th tab)**
- Key: `"bundle"`, label: `"bundle.txt"`
- Content: all four files concatenated with `=== <filename> ===` section headers:

```
=== motion.yaml ===
[motionYaml content]

=== proposal.md ===
[proposalMd content]

=== execution.md ===
[executionMd content]

=== challenge.md ===
[challengeMd content]
```

- Copy button labeled `Copy bundle.txt`
- Allows single-copy delivery of the full four-file scaffold

**Footer path**
- When motionId is valid: `.nexus/motions/<motionId>/<active-filename>`
- When empty/invalid: `.nexus/motions/motion-XXXX/<active-filename>` (unchanged from current)

---

## Design: no auto-increment

Determining the next available motion ID requires reading `.nexus/motions/` at runtime,
which requires a server API route. This is explicitly out of scope for v0. Validated manual
entry is the correct boundary — the operator knows the next ID from `ls .nexus/motions/` or
from the motion governance log.

---

## Design: substituteMotionId is pure

`substituteMotionId` uses `String.prototype.replaceAll("motion-XXXX", motionId)` on each of
the four string fields. It creates and returns a new `MotionDraftScaffold` object. The input
scaffold is unchanged. This preserves the determinism guarantee from motion-0130.

---

## Success criteria

- **SC-1** `MOTION_ID_PATTERN`, `isValidMotionId()`, and `substituteMotionId()` exported
  from `gridMotionDraft.ts`; module remains pure (no new imports, no side effects)
- **SC-2** `substituteMotionId(scaffold, "motion-0131")` replaces `motion-XXXX` in all four
  string fields; input scaffold is not mutated
- **SC-3** `isValidMotionId("motion-0131")` → `true`; `isValidMotionId("motion-XXXX")` →
  `false`; `isValidMotionId("motion-12345")` → `false`
- **SC-4** `MotionDraftModal` shows motion ID input; amber banner when field is empty or
  invalid; green banner when valid ID entered
- **SC-5** Tabs show substituted content when a valid motion ID is entered; show original
  `motion-XXXX` content otherwise
- **SC-6** Bundle tab (5th) present; content is all four files concatenated with
  `=== <filename> ===` delimiters; `Copy bundle.txt` button present
- **SC-7** Footer path updates to use the entered motion ID when valid
- **SC-8** No regression on existing Grid surface or existing four tabs
- **SC-9** `pnpm -C portal typecheck` exits 0 with both updated `gridMotionDraft.ts` and
  updated `GridView.tsx`

---

## Non-goals (v0)

- Auto-incrementing motion IDs (requires server API route — explicitly deferred)
- Writing motion files to `.nexus/motions/` at runtime — no fs writes from the portal
- Validating motion ID uniqueness against the live motion directory
- Council-run integration from the Grid surface
- Changes to `gridDiff.ts`, `gridDraft.ts`, `connectionValidator.ts`, or `gridConfig.ts`
- Live Ops / telemetry / runtime overlays
- Multi-file drag-and-drop or directory creation from the portal
