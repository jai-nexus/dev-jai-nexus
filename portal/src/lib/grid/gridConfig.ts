// portal/src/lib/grid/gridConfig.ts
//
// Server-only data layer for Grid Configuration Mode (motion-0129).
// Derives canonical grid topology from two existing sources:
//   - getAgencyConfig()  →  agent roster (canonical source of truth)
//   - EXECUTION_ROLES    →  zone definitions (enum from agencyConfig)
//
// Does NOT write to any file. Does NOT read from any external state.
// Zone layout is derived; it is not a persisted artifact.

import {
  getAgencyConfig,
  EXECUTION_ROLES,
  type ExecutionRole,
  type AgencyAgent,
} from "@/lib/agencyConfig";

export type { ExecutionRole, AgencyAgent };

export interface GridZone {
  role: ExecutionRole;
  label: string;
  description: string;
  agents: AgencyAgent[];
}

export interface GridConfig {
  zones: GridZone[];
  governanceAgents: AgencyAgent[];
}

const ZONE_META: Record<ExecutionRole, { label: string; description: string }> = {
  ARCHITECT: { label: "Architect",  description: "Design and planning" },
  BUILDER:   { label: "Builder",    description: "Implementation and patch" },
  VERIFIER:  { label: "Verifier",   description: "Validation and review" },
  OPERATOR:  { label: "Operator",   description: "Routing and governed decisions" },
  LIBRARIAN: { label: "Librarian",  description: "Packaging and durable memory" },
};

export function loadGridConfig(): GridConfig {
  const agency = getAgencyConfig();

  const zones: GridZone[] = EXECUTION_ROLES.map((role) => ({
    role,
    label: ZONE_META[role].label,
    description: ZONE_META[role].description,
    agents: agency.agents
      .filter((a) => !a.governance_only && a.execution_roles.includes(role))
      .sort((a, b) => {
        if (a.tier !== b.tier) return a.tier - b.tier;
        return a.nh_id.localeCompare(b.nh_id);
      }),
  }));

  const governanceAgents = agency.agents
    .filter((a) => a.governance_only)
    .sort((a, b) => a.nh_id.localeCompare(b.nh_id));

  return { zones, governanceAgents };
}
