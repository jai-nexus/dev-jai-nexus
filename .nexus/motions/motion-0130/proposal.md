# Proposal: JAI Grid Motion Draft Ingestion v0

**Motion:** motion-0130
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-14

---

## Problem

Motion-0129 (Grid Configuration Mode v0) delivers a "Propose Changes" button that
serializes staged Grid structural changes into a `motion_draft:` YAML payload. The
operator receives one text block with the diff content and a footer hint:
"Paste into `.nexus/motions/motion-XXXX/proposal.md`".

This is insufficient. A motion requires four files with specific schema requirements:

1. `motion.yaml` — `protocol_version`, `motion_id`, `kind`, `status`, `required_gates`,
   `checks_required`, `proposer_nh_id`, `council_nh_id`, `target.repo`, `target.domain`,
   `created_at`
2. `proposal.md` — problem, solution, success criteria, non-goals
3. `execution.md` — scope (actual touched files), commit plan, evidence log
4. `challenge.md` — risks, objections, required gates, risk score

Currently the operator must construct all four files manually from institutional memory,
wrapping the raw diff blob in the right structure. This is friction between the governed
diff surface and the canonical motion governance path.

---

## Solution

Add `portal/src/lib/grid/gridMotionDraft.ts`: a pure function
`buildMotionDraftScaffold(diff, opts?) → MotionDraftScaffold` that consumes the
`StructuralDiff` produced by `gridDiff.ts` and returns a typed object with all four
file contents as strings, ready for operator copy.

Update `GridView.tsx` to replace `DiffModal` with `MotionDraftModal`: a tabbed modal
showing each of the four motion package files as separate sections with per-section
copy buttons and a prominent `motion-XXXX` placeholder notice.

The operator flow becomes:

```
Grid draft state
  → diffGridDraft(config, draft)        → StructuralDiff
  → buildMotionDraftScaffold(diff)      → MotionDraftScaffold { motionYaml, proposalMd,
                                                                  executionMd, challengeMd }
  → MotionDraftModal                    → four tabs, four copy buttons
  → operator: mkdir .nexus/motions/motion-XXXX/ && paste each file
  → validate-motion gate                → catches schema errors before commit
```

Operator mediation is fully preserved:
- No files are written by the portal
- The operator reviews each scaffold section
- The operator manually creates the directory and pastes files
- `validate-motion` runs as a required gate before any ratification

---

## Design: diff-based, not snapshot-based

The scaffold's `proposal.md` describes *what changed* (position and connection tables),
not the full topology. A snapshot approach would require the operator to manually
extract the intent from a 200+ agent dump. Diff-based tables (agent, from_zone, to_zone)
are immediately readable and map directly to the `StructuralDiff` type.

The canonical state is referenced by `basis: canonical-v0 (motion-0129)`. A reviewer
can reconstruct the full picture from that reference plus the diff tables.

---

## Design: no canonical grid-config.yaml introduced

The canonical agent roster lives in `agency.yaml` (read by `getAgencyConfig()`).
Zone layout is derived at render time from `EXECUTION_ROLES`. Introducing a
`grid-config.yaml` would create a second source of truth for zone assignments, diverging
from `agency.yaml`. This motion explicitly defers that question. The scaffold output is
the transport artifact; it describes changes to be applied to the existing canonical
sources.

---

## Success criteria

- **SC-1** `buildMotionDraftScaffold(diff, opts?) → MotionDraftScaffold` is a pure
  function: no imports from server-only modules, no side effects, deterministic output
- **SC-2** `MotionDraftScaffold` provides `motionYaml`, `proposalMd`, `executionMd`,
  `challengeMd`, `generatedAt`, `changesSummary`
- **SC-3** `motionYaml` output passes `validate-motion` schema after operator substitutes
  `motion-XXXX` with a real ID; contains `protocol_version: "0.3.8"`, `kind: builder-proof`,
  `status: proposed`, `checks_required: [typecheck]`
- **SC-4** `proposalMd` embeds diff content as Markdown tables: position changes by
  agent/nh_id/from_zone/to_zone; connection changes by source/type/target; stub success
  criteria with correct counts
- **SC-5** Same `StructuralDiff` input → identical scaffold output (deterministic)
- **SC-6** `MotionDraftModal` shows four named sections with per-section copy buttons;
  `motion-XXXX` placeholder warning visible before any section content
- **SC-7** No regression on existing Grid surface: drag/reposition, connection draw,
  Discard Draft all still function correctly
- **SC-8** `pnpm -C portal typecheck` exits 0 with both new `gridMotionDraft.ts` and
  updated `GridView.tsx`
- **SC-9** No `.nexus/` writes occur at runtime; git status remains clean after any
  modal interaction

---

## Non-goals (v0)

- Writing motion files to `.nexus/motions/` at runtime — no fs writes from the portal
- Auto-incrementing motion IDs (requires runtime fs read; explicitly deferred)
- Council-run integration from the Grid surface
- Semantic validation of the operator-filled narrative sections
- Snapshot-based full topology output in the scaffold
- Changes to `gridDiff.ts`, `gridDraft.ts`, `connectionValidator.ts`, or `gridConfig.ts`
- Live Ops / telemetry / runtime overlays
- Notifications, collaboration, onboarding automation
- Cross-repo routing or multi-domain topology output
