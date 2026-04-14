// portal/src/lib/grid/gridDraft.ts
//
// Client-side draft state for Grid Configuration Mode (motion-0129).
// Stages position changes and connection changes in memory only.
// Nothing in this module writes to any file or canonical config.
//
// Design:
//   - GridDraftState holds an override map (nhId → effective position),
//     a chronological position-change log, and a connections list.
//   - applyDraftToLayout() is a pure function: canonical GridConfig + draft
//     overrides → EffectiveLayout used for rendering.
//   - draftReducer() handles MOVE, CONNECT, REMOVE_CONNECTION, and DISCARD.

import type { ExecutionRole, AgencyAgent, GridConfig } from "./gridConfig";
import type { ConnectionType } from "./connectionValidator";

export type { ConnectionType };

// ── Zone identity ─────────────────────────────────────────────────────────────
// Includes "governance" for agents outside the five execution-role zones.
export type ZoneId = ExecutionRole | "governance";

// ── Position change (slice 2) ─────────────────────────────────────────────────

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

// ── Connection change (slice 3) ───────────────────────────────────────────────

export interface ConnectionChange {
  id: string;           // stable per-session identifier, e.g. "conn-1"
  sourceNhId: string;
  sourceLabel: string;
  targetNhId: string;
  targetLabel: string;
  type: ConnectionType;
}

// ── Draft state ───────────────────────────────────────────────────────────────

export interface GridDraftState {
  // Position overrides — only agents that differ from canonical baseline.
  overrides: Record<string, AgentPosition>;
  // Ordered position-change log — consumed by diff/export in a later slice.
  changes: PositionChange[];
  // Staged connections.
  connections: ConnectionChange[];
}

export const EMPTY_DRAFT: GridDraftState = {
  overrides: {},
  changes: [],
  connections: [],
};

// ── Draft actions ─────────────────────────────────────────────────────────────

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
  | {
      type: "CONNECT";
      connection: ConnectionChange;
    }
  | {
      type: "REMOVE_CONNECTION";
      id: string;
    }
  | { type: "DISCARD" };

// ── Reducer ───────────────────────────────────────────────────────────────────

export function draftReducer(
  state: GridDraftState,
  action: DraftAction,
): GridDraftState {
  switch (action.type) {

    case "MOVE": {
      // Resolve effective current position (may already have an override)
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
        ...state,
        overrides: {
          ...state.overrides,
          [action.nhId]: { zone: action.toZone, rank: action.toRank },
        },
        changes: [...state.changes, change],
      };
    }

    case "CONNECT": {
      return {
        ...state,
        connections: [...state.connections, action.connection],
      };
    }

    case "REMOVE_CONNECTION": {
      return {
        ...state,
        connections: state.connections.filter((c) => c.id !== action.id),
      };
    }

    case "DISCARD":
      return EMPTY_DRAFT;

    default:
      return state;
  }
}

// ── Effective layout computation ──────────────────────────────────────────────
//
// Pure function: merges canonical GridConfig with draft overrides to produce
// the effective layout for rendering. Called on every render; no side effects.

export interface EffectiveAgent {
  agent: AgencyAgent;
  rank: number;
  isDraft: boolean;
  connectionCount: number; // total staged connections touching this agent
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

  // Count staged connections per agent (source + target)
  const connCount = new Map<string, number>();
  for (const conn of draft.connections) {
    connCount.set(conn.sourceNhId, (connCount.get(conn.sourceNhId) ?? 0) + 1);
    connCount.set(conn.targetNhId, (connCount.get(conn.targetNhId) ?? 0) + 1);
  }

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
    bucket.push({
      agent,
      rank: effectiveRank,
      isDraft,
      connectionCount: connCount.get(nhId) ?? 0,
    });
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
