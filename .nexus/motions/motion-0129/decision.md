# Decision: motion-0129 — JAI Grid Configuration Mode v0

**Status:** RATIFIED
**Date:** 2026-04-14
**Motion:** motion-0129
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop

---

## Gate results

| Gate | Result | Exit | Timestamp |
|---|---|---|---|
| validate_motion | PASS | 0 | 2026-04-14T02:01:10.851Z |
| validate_agency | PASS | 0 | 2026-04-14T02:01:11.189Z |
| typecheck | PASS | 0 | 2026-04-14T02:01:15.843Z |

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
See: `.nexus/motions/motion-0129/agent-vote.json` and evaluation trace.

---

## Deliverables

Four commits deliver the complete Grid Configuration Mode surface:

| Commit | Files | Description |
|---|---|---|
| `f0bf1e4` | page.tsx, GridView.tsx (v1), gridConfig.ts, OperatorSubnav.tsx | Slice 1: route + canonical surface |
| `8fdb13b` | GridView.tsx (v2), gridDraft.ts | Slice 2: staged draft state + drag/reposition |
| `49a5fc6` | GridView.tsx (v3), gridDiff.ts | Slices 3-4: connection drawing + governed diff + Propose Changes modal |
| `da28e54` | connectionValidator.ts, gridDraft.ts (update) | Slices 3-4 follow-up: connection validation |

**New modules:**
- `portal/src/lib/grid/gridConfig.ts` — canonical read layer (loadGridConfig, GridZone, GridConfig)
- `portal/src/lib/grid/gridDraft.ts` — client draft state (GridDraftState, draftReducer, applyDraftToLayout)
- `portal/src/lib/grid/connectionValidator.ts` — structural validation (validateConnection, LANE_RANK)
- `portal/src/lib/grid/gridDiff.ts` — diff computation + YAML serialization (diffGridDraft, serializeMotionDraft)
- `portal/src/app/operator/grid/page.tsx` — server component (route entry)
- `portal/src/app/operator/grid/GridView.tsx` — client component (all sub-components inlined)

**Modified:**
- `portal/src/components/operator/OperatorSubnav.tsx` — +1 line Grid link

---

## Properties

- **No runtime writes.** All draft state (position moves, connections) lives in React useReducer. The Propose Changes output is a pure string to clipboard. No .nexus/ writes at runtime.
- **Typecheck clean.** `pnpm -C portal typecheck` exits 0 with all four modules and GridView.tsx.
- **Bounded scope.** Configuration Mode only — no Live Ops, no notifications, no multi-user, no database changes, no cross-repo routing.
- **Canonical data.** Agent roster flows from getAgencyConfig() at server-render time. Grid layout is derived; it is not a persisted artifact.
- **Governed diff path.** Structural changes serialize to a motion-draft YAML block for operator copy into a new motion proposal. No silent canon mutation.
- **Risk score:** 0.19 (max 0.20 threshold). No escalation triggered. `escalation_state: null`.
