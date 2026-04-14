// portal/src/lib/grid/gridDiff.ts
//
// Pure diff computation for Grid draft state (motion-0129 slice 4).
// Compares canonical GridConfig with GridDraftState and produces a
// serialized motion-draft YAML block for operator copy.
//
// No file writes. No server-only imports.
//
// Design:
//   - diffGridDraft() uses draft.overrides (final effective positions),
//     not the raw change log, to avoid duplicate entries for agents moved
//     more than once.
//   - Rank normalization: for agents moved to the same zone, draft ranks
//     are re-indexed (sorted, then 0-based) to eliminate collisions.
//   - serializeMotionDraft() hand-builds YAML — no external dependency.

import type { GridConfig } from "./gridConfig";
import type {
  GridDraftState,
  ConnectionChange,
  ZoneId,
} from "./gridDraft";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NormalizedPositionChange {
  nhId: string;
  agentLabel: string;
  fromZone: ZoneId;
  fromRank: number;
  toZone: ZoneId;
  toRank: number; // normalized: 0-based within target zone, draft-ordered
}

export interface StructuralDiff {
  positionChanges: NormalizedPositionChange[];
  connectionChanges: ConnectionChange[];
  generatedAt: string;
}

// ── Diff computation ──────────────────────────────────────────────────────────

export function diffGridDraft(
  config: GridConfig,
  draft: GridDraftState,
): StructuralDiff {
  // Build canonical position map: nhId → { zone, rank, label }
  const canonicalPos = new Map<
    string,
    { zone: ZoneId; rank: number; label: string }
  >();

  config.zones.forEach((zone) => {
    zone.agents.forEach((agent, idx) => {
      canonicalPos.set(agent.nh_id, {
        zone: zone.role as ZoneId,
        rank: idx,
        label: agent.label,
      });
    });
  });
  config.governanceAgents.forEach((agent, idx) => {
    canonicalPos.set(agent.nh_id, {
      zone: "governance",
      rank: idx,
      label: agent.label,
    });
  });

  // Collect agents whose effective position differs from canonical
  const rawChanges: NormalizedPositionChange[] = [];
  for (const [nhId, override] of Object.entries(draft.overrides)) {
    const canonical = canonicalPos.get(nhId);
    if (!canonical) continue;
    // Only include if zone or rank actually changed
    if (canonical.zone === override.zone && canonical.rank === override.rank) {
      continue;
    }
    rawChanges.push({
      nhId,
      agentLabel: canonical.label,
      fromZone: canonical.zone,
      fromRank: canonical.rank,
      toZone: override.zone,
      toRank: override.rank,
    });
  }

  // Normalize ranks within each target zone:
  //   Sort by draft toRank, then re-index 0, 1, 2… to eliminate collisions.
  const byTargetZone = new Map<ZoneId, NormalizedPositionChange[]>();
  for (const change of rawChanges) {
    const bucket = byTargetZone.get(change.toZone) ?? [];
    bucket.push(change);
    byTargetZone.set(change.toZone, bucket);
  }

  const positionChanges: NormalizedPositionChange[] = [];
  for (const bucket of byTargetZone.values()) {
    bucket.sort((a, b) => a.toRank - b.toRank);
    bucket.forEach((change, idx) => {
      positionChanges.push({ ...change, toRank: idx });
    });
  }

  return {
    positionChanges,
    connectionChanges: draft.connections,
    generatedAt: new Date().toISOString(),
  };
}

// ── YAML serialization ────────────────────────────────────────────────────────
//
// Produces a motion-draft YAML block suitable for copy-paste into a
// motion proposal. Hand-built — no external dependency.

export function serializeMotionDraft(diff: StructuralDiff): string {
  const lines: string[] = [];

  lines.push(`motion_draft:`);
  lines.push(`  kind: grid-structural-diff`);
  lines.push(`  generated_at: "${diff.generatedAt}"`);
  lines.push(`  basis: canonical-v0`);
  lines.push(`  summary:`);
  lines.push(`    position_changes: ${diff.positionChanges.length}`);
  lines.push(`    connection_changes: ${diff.connectionChanges.length}`);

  if (diff.positionChanges.length > 0) {
    lines.push(`  position_changes:`);
    for (const c of diff.positionChanges) {
      lines.push(`    - nh_id: "${c.nhId}"`);
      lines.push(`      agent_label: "${c.agentLabel}"`);
      lines.push(`      from_zone: ${c.fromZone}`);
      lines.push(`      from_rank: ${c.fromRank}`);
      lines.push(`      to_zone: ${c.toZone}`);
      lines.push(`      to_rank: ${c.toRank}`);
    }
  } else {
    lines.push(`  position_changes: []`);
  }

  if (diff.connectionChanges.length > 0) {
    lines.push(`  connection_changes:`);
    for (const c of diff.connectionChanges) {
      lines.push(`    - id: "${c.id}"`);
      lines.push(`      source_nh_id: "${c.sourceNhId}"`);
      lines.push(`      source_label: "${c.sourceLabel}"`);
      lines.push(`      target_nh_id: "${c.targetNhId}"`);
      lines.push(`      target_label: "${c.targetLabel}"`);
      lines.push(`      type: ${c.type}`);
    }
  } else {
    lines.push(`  connection_changes: []`);
  }

  return lines.join("\n");
}
