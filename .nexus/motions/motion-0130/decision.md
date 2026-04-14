# Decision: motion-0130 — JAI Grid Motion Draft Ingestion v0

**Status:** RATIFIED
**Date:** 2026-04-14
**Motion:** motion-0130
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop

---

## Gate results

| Gate | Result | Exit | Timestamp |
|---|---|---|---|
| validate_motion | PASS | 0 | 2026-04-14T16:12:10.813Z |
| validate_agency | PASS | 0 | 2026-04-14T16:12:11.195Z |
| typecheck | PASS | 0 | 2026-04-14T16:12:17.561Z |

All required gates pass. `required_ok: true`. `failed_required_gates: []`.

---

## Vote outcome

| Role | Vote |
|---|---|
| proposer | yes |
| challenger | yes |
| arbiter | yes |

Vote mode: `unanimous_consent` — all required roles present, all yes.
Result: **PASS** → **RATIFIED**

Agent witness: `nhid_2_dev_jai_nexus_dev-jai-nexus_panel_seat_001` (evidence-falsifiability seat) — advisory PASS.
See: `.nexus/motions/motion-0130/agent-vote.json` and evaluation trace.

---

## Deliverables

Two commits deliver the complete motion-draft ingestion surface:

| Commit | File | Description |
|---|---|---|
| `ecf0d8b` | `portal/src/lib/grid/gridMotionDraft.ts` | Slice 1: pure scaffold generator (301 lines) |
| `22a777b` | `portal/src/app/operator/grid/GridView.tsx` | Slice 2: DiffModal → MotionDraftModal (+85/-40) |

**New module:**
- `portal/src/lib/grid/gridMotionDraft.ts` — `buildMotionDraftScaffold(diff, opts?) → MotionDraftScaffold`; generates `motionYaml`, `proposalMd`, `executionMd`, `challengeMd` as strings; pure, deterministic, no server imports

**Modified component:**
- `portal/src/app/operator/grid/GridView.tsx` — `handlePropose()` now calls `buildMotionDraftScaffold`; `DiffModal` replaced by `MotionDraftModal` with four tabs, per-tab copy buttons, `motion-XXXX` placeholder warning

---

## Properties

- **No runtime writes.** Scaffold output lives in React state (`MotionDraftScaffold | null`). `navigator.clipboard` is the only output channel.
- **Typecheck clean.** `pnpm -C portal typecheck` exits 0 with both new module and updated GridView.tsx.
- **Pure function.** `gridMotionDraft.ts` has two `import type` statements and no side effects. Deterministic on any StructuralDiff input.
- **Operator mediation preserved.** Scaffold is copy-only — no auto-creation of motion directories, no council-run integration from the portal.
- **Bounded scope.** Two files changed, no other grid lib modules touched, no governance scripts touched.
- **Risk score:** 0.15 (max 0.20 threshold). No escalation triggered. `escalation_state: null`.

---

## Before → After

Before motion-0130: "Propose Changes" emitted a single `motion_draft:` YAML blob in a single-section modal with one copy button.

After motion-0130: "Propose Changes" opens `MotionDraftModal` showing four tabs:
- `motion.yaml` — valid `protocol_version: "0.3.8"` scaffold with `motion-XXXX` placeholder
- `proposal.md` — Markdown tables of position/connection changes + stub success criteria
- `execution.md` — Tier 1 deliberation note + scope/evidence placeholders
- `challenge.md` — R-1 structural risk + required gates + `risk_score: 0.15`

Each tab has a per-file copy button (`Copy motion.yaml`, `Copy proposal.md`, etc.) and the footer shows the exact destination path (`.nexus/motions/motion-XXXX/<filename>`).
