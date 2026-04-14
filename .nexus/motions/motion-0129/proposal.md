# Proposal: JAI Grid Configuration Mode v0

**Motion:** motion-0129
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-13

---

## Problem

The operator has no visual surface for inspecting or intentionally modifying the agent
topology. Changes to role assignments, zone membership, and handoff/governance connections
today require hand-editing YAML artifacts (agencyConfig, slot-policy) with no structural
validation, no diff, and no path into governance.

The missing piece is a **Configuration Mode** canvas: a view where the operator can see
the canonical topology, compose structural changes against it, validate those changes
locally, and route the resulting diff through a motion rather than mutating canonical
files directly.

This motion delivers Configuration Mode v0 — a read-first, staged-change surface that
produces a governed diff output. Live Ops (runtime telemetry overlay) is explicitly
deferred to a later motion.

---

## Solution

Add a Grid sub-tab to the Operator portal at `/operator/grid`. The canvas:

1. **Renders canonical state** — zones from `slot-policy.yaml` execution roles;
   agents from `getAgencyConfig()` roster placed in their execution-role zones.

2. **Supports selection and inspection** — clicking an agent opens a read-only
   property panel (nh_id, role, tier, capabilities, constraints, scope).

3. **Supports drag/reposition** — snap-grid drag of agents within or across zones.
   All position mutations are staged in client-side `GridDraftState`, not written
   to any file.

4. **Supports connection drawing** — within Configuration Mode, the operator can
   draw `handoff` or `governance` connections between agents. A connection validator
   rejects structurally invalid pairs before they enter the draft.

5. **Accumulates a staged diff** — all positional and connection changes accumulate
   in `GridDraftState`. A draft banner shows pending change count.

6. **Produces governed diff output** — "Propose Changes" serializes the staged diff
   as a motion-draft YAML block for operator copy/paste into a new motion. The action
   does not create a motion automatically; the operator routes it into governance.

7. **Discard path** — "Discard Draft" resets `GridDraftState` to baseline; canvas
   returns to canonical view.

---

## Why Configuration Mode before Live Ops

Configuration Mode is the deliberate composition surface. Live Ops is a telemetry
overlay that shows runtime state against a stable topology. Without a stable,
operator-confirmed topology, Live Ops has nothing reliable to overlay. Configuration
Mode must come first.

Connection drawing is a tool within Configuration Mode, not a separate top-level mode.
It is bounded by the same staged-change invariant: drawn connections are draft until
they exit through a governed diff.

---

## Success criteria

- **SC-1** `/operator/grid` route is reachable; Grid link appears in OperatorSubnav
  alongside Agents
- **SC-2** Canvas renders one zone per execution role from `slot-policy.yaml`;
  each zone displays its agents from the canonical roster
- **SC-3** Clicking an agent opens a property panel showing nh_id, role, tier,
  capabilities, constraints, scope (read-only display)
- **SC-4** Drag/reposition of an agent stages a `PositionChange` in `GridDraftState`;
  no file is written; draft banner increments
- **SC-5** Connection drawing tool creates `handoff` or `governance` connections
  between agents; staged in `GridDraftState`
- **SC-6** Connection validator rejects: same-agent loops, handoff pairs where the
  source role cannot hand off to the target role, governance connections to agents
  without a governance capability
- **SC-7** "Propose Changes" serializes `GridDraftState` diff as a motion-draft YAML
  block; output displayed in-page for operator copy; no file written
- **SC-8** "Discard Draft" resets `GridDraftState` to baseline
- **SC-9** No writes to `slot-policy.yaml`, `agencyConfig`, or any file under
  `.nexus/` at runtime
- **SC-10** `pnpm -C portal typecheck` exits 0 with no new errors

---

## Non-goals (v0)

- Live Ops / telemetry / runtime status overlays
- Automatic motion creation from the diff output
- Persistence of canvas layout positions (ephemeral per session)
- Multi-user collaboration or session locking
- Notifications or webhooks triggered by draft changes
- Cross-repo routing or multi-domain topologies
- Any writes to canonical governance artifacts at runtime
