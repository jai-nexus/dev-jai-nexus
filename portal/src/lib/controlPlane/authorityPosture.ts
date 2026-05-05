export type AuthorityPostureStatus =
  | "exercised_planning_safe"
  | "modeled_disabled"
  | "static_material";

export interface WorkflowRolePosture {
  key: "CONTROL_THREAD" | "ORCHESTRATOR" | "REPO_EXECUTION" | "EXPLORATION";
  summary: string;
}

export interface DocsOpsLevelPosture {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  label: string;
  status: AuthorityPostureStatus;
  summary: string;
}

export interface AgentAssetsPosture {
  status: AuthorityPostureStatus;
  location: string;
  authority: "none";
  summary: string;
}

export interface ControlPlaneAuthorityPosture {
  workflow_roles: WorkflowRolePosture[];
  docs_ops_levels: DocsOpsLevelPosture[];
  agent_assets: AgentAssetsPosture;
  blocked_capabilities: string[];
  notes: string[];
}

const CONTROL_PLANE_AUTHORITY_POSTURE: ControlPlaneAuthorityPosture = {
  workflow_roles: [
    {
      key: "CONTROL_THREAD",
      summary: "Cross-repo continuity, priority control, and passalong routing.",
    },
    {
      key: "ORCHESTRATOR",
      summary: "Candidate seam comparison and next-step packaging only.",
    },
    {
      key: "REPO_EXECUTION",
      summary: "Bounded repo-local work inside explicit motion and path limits.",
    },
    {
      key: "EXPLORATION",
      summary: "Bounded ideation and framing without execution or ratification.",
    },
  ],
  docs_ops_levels: [
    {
      level: 0,
      label: "read curated context",
      status: "exercised_planning_safe",
      summary: "Curated docs context can be read and summarized in planning-safe posture.",
    },
    {
      level: 1,
      label: "recommendations / curation / relevance",
      status: "exercised_planning_safe",
      summary: "Recommendation-only docs-ops output is canonized and exercised without mutation.",
    },
    {
      level: 2,
      label: "non-mutating patch plans / PR draft text",
      status: "exercised_planning_safe",
      summary: "Level 2 planning artifacts are allowed as text only; no branch, PR, or file mutation.",
    },
    {
      level: 3,
      label: "constrained PR creation",
      status: "modeled_disabled",
      summary: "Modeled only. Constrained docs-nexus PR creation remains disabled.",
    },
    {
      level: 4,
      label: "controlled rolling branches",
      status: "modeled_disabled",
      summary: "Modeled only. Rolling branch update authority remains disabled.",
    },
    {
      level: 5,
      label: "allowlisted auto-merge",
      status: "modeled_disabled",
      summary: "Modeled only. Auto-merge authority remains disabled.",
    },
  ],
  agent_assets: {
    status: "static_material",
    location: ".nexus/agent-assets/**",
    authority: "none",
    summary:
      "Static reusable operating material for prompts, checklists, role cards, and review assets.",
  },
  blocked_capabilities: [
    "docs-nexus edits",
    "jai-nexus edits",
    "branch-write authority",
    "PR-creation authority",
    "execution authority",
    "automation",
    "scheduler",
    "hidden persistence",
    "credentials",
    "provider dispatch",
    "API/DB mutation",
    "live capture",
    "autonomous merge",
    "Level 3/4/5 activation",
  ],
  notes: [
    "Read-only control-plane visibility only.",
    "Agent assets do not grant authority.",
    "Disabled authority remains disabled.",
    "No branch, PR, execution, automation, or scheduler capability is enabled here.",
  ],
};

export function getControlPlaneAuthorityPosture(): ControlPlaneAuthorityPosture {
  return {
    workflow_roles: CONTROL_PLANE_AUTHORITY_POSTURE.workflow_roles.map((entry) => ({
      ...entry,
    })),
    docs_ops_levels: CONTROL_PLANE_AUTHORITY_POSTURE.docs_ops_levels.map((entry) => ({
      ...entry,
    })),
    agent_assets: { ...CONTROL_PLANE_AUTHORITY_POSTURE.agent_assets },
    blocked_capabilities: [...CONTROL_PLANE_AUTHORITY_POSTURE.blocked_capabilities],
    notes: [...CONTROL_PLANE_AUTHORITY_POSTURE.notes],
  };
}
