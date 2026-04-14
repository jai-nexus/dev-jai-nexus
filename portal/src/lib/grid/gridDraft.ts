// portal/src/lib/grid/gridDraft.ts
//
// Client-side draft state for Grid Configuration Mode (motion-0129).
// Stages position changes (zone reassignments) in memory only.
// Nothing in this module writes to any file or canonical config.
//
// Design:
//   - GridDraftState holds an override map (nhId → effective position) and
//     a chronological change log (for diff/export in a later slice).
//   - applyDraftToLayout() is a pure function: canonical GridConfig + draft
//     overrides → EffectiveLayout used for rendering.
//   - draftReducer() handles MOVE and DISCARD actions.

import type { ExecutionRole, AgencyAgent, GridConfig } from "./gridConfig";

// ZoneId includes "governance" for governance-only agents that sit outside
// the execution-role zones.
export type ZoneId = ExecutionRole | "governance";

export interface AgentPosition {
  zone: ZoneId;
  rank: number; // 0-indexed display order within the zone
}

export interface PositionChange {
  nhId: string;
  agentLabel: string;
  fromZone: ZoneId;
  fromRank: number;
  toZone: ZoneId;
  toRank: number;
}

export interface GridDraftState {
  // Effective position overrides — only agents that differ from canonical baseline.
  overrides: Record<string, AgentPosition>;
  // Ordered change log — consumed by diff/export in a later slice.
  changes: PositionChange[];
}

export const EMPTY_DRAFT: GridDraftState = { overrides: {}, changes: [] };

export type DraftAction =
  | {
      type: "MOVE";
      nhId: string;
      agentLabel: string;
      fromZone: ZoneId;
      fromRank: number;
      toZone: ZoneId;
      toRank: number;
    }
  | { type: "DISCARD" };

export function draftReducer(
  state: GridDraftState,
  action: DraftAction,
): GridDraftState {
  switch (action.type) {
    case "MOVE": {
      // Resolve the agent's current effective position (may already have an override)
      const existing = state.overrides[action.nhId];
      const currentZone = existing?.zone ?? action.fromZone;
      const currentRank = existing?.rank ?? action.fromRank;

      // No-op: same effective position
      if (currentZone === action.toZone && currentRank === action.toRank) {
        return state;
      }

      const change: PositionChange = {
        nhId: action.nhId,
        agentLabel: action.agentLabel,
        fromZone: currentZone,
        fromRank: currentRank,
        toZone: action.toZone,
        toRank: action.toRank,
      };

      return {
        overrides: {
          ...state.overrides,
          [action.nhId]: { zone: action.toZone, rank: action.toRank },
        },
        changes: [...state.changes, change],
      };
    }

    case "DISCARD":
      return EMPTY_DRAFT;

    default:
      return state;
  }
}

// ── Effective layout computation ─────────────────────────────────────────────
//
// Pure function: merges canonical GridConfig with draft overrides to produce
// the effective layout for rendering. Called on every render; no side effects.

export interface EffectiveAgent {
  agent: AgencyAgent;
  rank: number;
  isDraft: boolean;
}

export interface EffectiveZone {
  role: ExecutionRole;
  label: string;
  description: string;
  agents: EffectiveAgent[];
}

export interface EffectiveLayout {
  zones: EffectiveZone[];
  governanceAgents: EffectiveAgent[];
}

export function applyDraftToLayout(
  config: GridConfig,
  draft: GridDraftState,
): EffectiveLayout {
  // Build flat agent lookup and canonical position map
  const allAgents = new Map<string, AgencyAgent>();
  const canonicalPos = new Map<string, { zone: ZoneId; rank: number }>();

  config.zones.forEach((zone) => {
    zone.agents.forEach((agent, idx) => {
      allAgents.set(agent.nh_id, agent);
      canonicalPos.set(agent.nh_id, { zone: zone.role, rank: idx });
    });
  });
  config.governanceAgents.forEach((agent, idx) => {
    allAgents.set(agent.nh_id, agent);
    canonicalPos.set(agent.nh_id, { zone: "governance", rank: idx });
  });

  // Compute effective position per agent, group by zone
  const byZone = new Map<ZoneId, EffectiveAgent[]>();

  for (const [nhId, canonical] of canonicalPos) {
    const agent = allAgents.get(nhId);
    if (!agent) continue;

    const override = draft.overrides[nhId];
    const effectiveZone = override?.zone ?? canonical.zone;
    const effectiveRank = override?.rank ?? canonical.rank;
    const isDraft = Boolean(override);

    const bucket = byZone.get(effectiveZone) ?? [];
    bucket.push({ agent, rank: effectiveRank, isDraft });
    byZone.set(effectiveZone, bucket);
  }

  // Sort each bucket by rank ascending
  for (const bucket of byZone.values()) {
    bucket.sort((a, b) => a.rank - b.rank);
  }

  const zones: EffectiveZone[] = config.zones.map((zone) => ({
    role: zone.role,
    label: zone.label,
    description: zone.description,
    agents: byZone.get(zone.role) ?? [],
  }));

  const governanceAgents = byZone.get("governance") ?? [];

  return { zones, governanceAgents };
}
