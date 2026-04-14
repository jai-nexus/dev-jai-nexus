# Execution: JAI Grid Configuration Mode v0

**Motion:** motion-0129
**Role:** BUILDER
**Date:** 2026-04-13

---

## Cost estimate

Category: standard
Basis: new operator sub-tab + new route + new lib modules + inline components. No database
schema changes. No writes to canonical governance artifacts. No changes to council-run,
activate-motion, or any governance script. Scope is confined to portal/src/ and the
motion-0129 package.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard → evidence-falsifiability mandatory.

---

## Scope

### New files (actual, post-implementation)

- `portal/src/app/operator/grid/page.tsx` — server component; calls loadGridConfig(),
  passes GridConfig to GridView
- `portal/src/app/operator/grid/GridView.tsx` — "use client"; single-file client component
  containing GridView root, ZoneCard, AgentRow, DraggableGovernanceChip, PropertyPanel,
  EmptyPanel, DraftBanner, ConnectModeBar, ConnectHint, StagedConnectionsList, DiffModal.
  Manages draft state via useReducer(draftReducer), connection mode state, drag state,
  and diff modal state.
- `portal/src/lib/grid/gridConfig.ts` — GridConfig/GridZone types, loadGridConfig()
  (server-only; reads getAgencyConfig(), derives zone layout from EXECUTION_ROLES)
- `portal/src/lib/grid/gridDraft.ts` — GridDraftState, PositionChange, ConnectionChange,
  ZoneId, EffectiveAgent, EffectiveLayout; draftReducer(MOVE/CONNECT/REMOVE_CONNECTION/DISCARD);
  applyDraftToLayout() pure function; EMPTY_DRAFT constant
- `portal/src/lib/grid/connectionValidator.ts` — ConnectionType, ValidationResult;
  validateConnection(source, target, type): no-loops, handoff forward-only via LANE_RANK
  (ARCHITECT=0, BUILDER=1, VERIFIER=2, OPERATOR=3), LIBRARIAN exempt, governance requires
  target.governance_only || execution_roles includes OPERATOR
- `portal/src/lib/grid/gridDiff.ts` — StructuralDiff, NormalizedPositionChange;
  diffGridDraft(config, draft) with rank normalization; serializeMotionDraft(diff) → YAML
  string (hand-built, no external dependency)

### Modified files

- `portal/src/components/operator/OperatorSubnav.tsx` — +1 line: Grid href added to
  links array after Agents

### Commits

- `f0bf1e4` — slice 1: routing + canonical surface (page.tsx, GridView.tsx v1,
  gridConfig.ts, OperatorSubnav.tsx)
- `8fdb13b` — slice 2: staged draft state + drag/reposition (GridView.tsx v2, gridDraft.ts)
- `49a5fc6` — slices 3-4: connection drawing + governed diff + Propose Changes modal
  (GridView.tsx v3, gridDiff.ts)
- `da28e54` — slices 3-4 follow-up: connection validation support
  (connectionValidator.ts, gridDraft.ts update with ConnectionChange/CONNECT/REMOVE_CONNECTION)

### Read-only sources (no writes at runtime)

- `lib/agencyConfig.ts` / `getAgencyConfig()` — read at server-render time for canonical
  agent roster; never written
- `.nexus/context/` — not read at runtime; zone/role definitions come from EXECUTION_ROLES
  enum in agencyConfig.ts

---

## Evidence log

### 1. validate-motion exits 0

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0129/motion.yaml
→ ✅ motion schema OK
```

Confirmed: motion_id, kind, status, required_gates, checks_required all valid.

---

### 2. validate-agency exits 0

```
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK (202 agents)
```

Confirmed: Tier 0/1/2 agents all valid against registry.

---

### 3. pnpm -C portal typecheck exits 0

```
pnpm -C portal typecheck
→ exit 0 (clean)
```

Confirmed: no portal/src/ type errors introduced. Gate recorded in verify.json by
council-run at actual execution timestamp.

---

### 4. /operator/grid route accessible; Grid appears in subnav active state

OperatorSubnav.tsx links array: `{ href: "/operator/grid", label: "Grid" }` added after
Agents (commit f0bf1e4, +1 line). page.tsx at `portal/src/app/operator/grid/page.tsx`
exports default GridPage. Route is accessible via the operator sub-navigation.

---

### 5. Canvas renders 5 zones with correct agents from canonical roster

loadGridConfig() (gridConfig.ts): derives zones via EXECUTION_ROLES.map() →
`["ARCHITECT","BUILDER","VERIFIER","LIBRARIAN","OPERATOR"]`. Agents filtered by
`!a.governance_only && a.execution_roles.includes(role)`, sorted by tier then nh_id.
governanceAgents: agents where `a.governance_only === true`. GridView.tsx renders
executionLane (ARCHITECT/BUILDER/VERIFIER in 3-col grid) + supportRoles (OPERATOR/LIBRARIAN
in 2-col grid) + governance section. All agent data flows from server-side getAgencyConfig().

---

### 6. Drag agent → git status shows no file modifications; draft banner increments

HTML5 drag handlers (handleDragStart, handleDragOverZone, handleDropOnZone) set drag state
in React useState only. handleDropOnZone dispatches MOVE to draftReducer; state lives in
useReducer. No file I/O. DraftBanner appears when `draft.changes.length > 0 ||
draft.connections.length > 0`. No canonical files are modified by drag interaction.

---

### 7. Property panel shows correct agent fields for selected agent

PropertyPanel component renders: label, nh_id, isDraft badge, connectionCount badge,
Tier badge, role, execution_roles, capabilities (V2 optional), constraints (V2 optional),
scope, delegates_to, governance_only note. Populated from AgencyAgent passed via
handleSelectAgent → setSelectedAgent.

---

### 8. Connection validation: forward accepted, backward rejected with reason

validateConnection() in connectionValidator.ts:
- ARCHITECT→BUILDER (handoff): LANE_RANK[ARCHITECT]=0 < LANE_RANK[BUILDER]=1 → ok:true ✅
- VERIFIER→ARCHITECT (handoff): LANE_RANK[VERIFIER]=2 >= LANE_RANK[ARCHITECT]=0 →
  ok:false, reason: "Handoff VERIFIER → ARCHITECT goes backwards…" ✅
- governance target without governance capability:
  ok:false, reason: "<label> is not governance-capable…" ✅
- LIBRARIAN source/target in handoff: exempt → ok:true ✅
- Same-agent loop: ok:false, reason: "Cannot connect an agent to itself." ✅

Duplicate-connection check also enforced client-side before validateConnection() call.

---

### 9. Propose Changes outputs motion-draft YAML block; git status shows no file writes

"Propose Changes" button in DraftBanner → handlePropose() → diffGridDraft(config, draft)
→ serializeMotionDraft(diff) → DiffModal with pre block + "Copy YAML" clipboard button.
serializeMotionDraft() is a pure string builder; no fs writes. gridDiff.ts has no imports
from server-only modules. git status after any Propose Changes interaction: clean.

Rank normalization: diffGridDraft groups overrides by toZone, sorts by toRank, re-indexes
0-based → eliminates collision from multi-agent moves into same zone.

---

### 10. Discard Draft resets canvas to canonical view; draft banner cleared

DraftBanner "Discard Draft" → dispatchDraft({ type: "DISCARD" }), setSelectedAgent(null),
setConnSource(null). draftReducer DISCARD case returns EMPTY_DRAFT
({ overrides: {}, changes: [], connections: [] }). applyDraftToLayout(config, EMPTY_DRAFT)
restores canonical positions. hasDraft = false → DraftBanner unmounts.
