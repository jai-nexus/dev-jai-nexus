// portal/src/lib/grid/connectionValidator.ts
//
// Structural validation for staged Grid connections (motion-0129).
// Pure functions — no file I/O, no state, no side effects.
//
// Two connection types are supported:
//   handoff    — work flows forward through the execution lane
//   governance — oversight / approval connection to a governance-capable agent
//
// Validation rules:
//   All types: no same-agent loops
//   handoff:   source must not be governance-only
//              target must not be governance-only
//              LIBRARIAN agents are exempt from direction constraint
//              otherwise direction must be strictly forward:
//                ARCHITECT(0) → BUILDER(1) → VERIFIER(2) → OPERATOR(3)
//   governance: target must be governance-capable
//               (governance_only === true OR execution_roles includes OPERATOR)

import type { AgencyAgent, ExecutionRole } from "./gridConfig";

export type ConnectionType = "handoff" | "governance";

export interface ValidationResult {
  ok: boolean;
  reason?: string; // populated only when ok === false
}

// Execution lane ranks for directional handoff checks.
// LIBRARIAN is intentionally absent — it is exempt from direction constraints.
const LANE_RANK: Partial<Record<ExecutionRole, number>> = {
  ARCHITECT: 0,
  BUILDER: 1,
  VERIFIER: 2,
  OPERATOR: 3,
};

function laneRanksOf(agent: AgencyAgent): number[] {
  return agent.execution_roles
    .filter((r): r is ExecutionRole => LANE_RANK[r] !== undefined)
    .map((r) => LANE_RANK[r] as number);
}

function isGovernanceCapable(agent: AgencyAgent): boolean {
  return agent.governance_only || agent.execution_roles.includes("OPERATOR");
}

export function validateConnection(
  source: AgencyAgent,
  target: AgencyAgent,
  type: ConnectionType,
): ValidationResult {
  // ── Rule: no same-agent loops ─────────────────────────────────────────────
  if (source.nh_id === target.nh_id) {
    return { ok: false, reason: "Cannot connect an agent to itself." };
  }

  // ── Handoff ───────────────────────────────────────────────────────────────
  if (type === "handoff") {
    if (source.governance_only) {
      return {
        ok: false,
        reason: `${source.label} is governance-only and cannot be a handoff source.`,
      };
    }
    if (target.governance_only) {
      return {
        ok: false,
        reason: `${target.label} is governance-only and cannot receive a handoff. Use a governance connection instead.`,
      };
    }

    // LIBRARIAN is exempt from lane-direction constraints
    const srcIsLib = source.execution_roles.includes("LIBRARIAN");
    const tgtIsLib = target.execution_roles.includes("LIBRARIAN");
    if (srcIsLib || tgtIsLib) {
      return { ok: true };
    }

    const srcRanks = laneRanksOf(source);
    const tgtRanks = laneRanksOf(target);

    if (srcRanks.length === 0) {
      return {
        ok: false,
        reason: `${source.label} has no execution-lane role and cannot be a handoff source.`,
      };
    }
    if (tgtRanks.length === 0) {
      return {
        ok: false,
        reason: `${target.label} has no execution-lane role and cannot receive a handoff.`,
      };
    }

    // Forward-only: min source rank must be strictly less than min target rank
    const minSrc = Math.min(...srcRanks);
    const minTgt = Math.min(...tgtRanks);

    if (minSrc >= minTgt) {
      const srcLabel = source.execution_roles
        .filter((r) => r !== "LIBRARIAN")
        .join(", ");
      const tgtLabel = target.execution_roles
        .filter((r) => r !== "LIBRARIAN")
        .join(", ");
      return {
        ok: false,
        reason: `Handoff ${srcLabel} → ${tgtLabel} goes backwards in the execution lane. Handoffs must flow forward: ARCHITECT → BUILDER → VERIFIER → OPERATOR.`,
      };
    }

    return { ok: true };
  }

  // ── Governance ────────────────────────────────────────────────────────────
  if (type === "governance") {
    if (!isGovernanceCapable(target)) {
      return {
        ok: false,
        reason: `${target.label} is not governance-capable. Governance connections must target an OPERATOR or governance-only agent.`,
      };
    }
    return { ok: true };
  }

  return { ok: false, reason: `Unknown connection type.` };
}
