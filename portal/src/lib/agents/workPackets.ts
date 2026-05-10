import { getAgentByKey } from "@/lib/agents/agentRegistry";
import type {
  AgentRegistryAgent,
  AgentRegistryCapabilityKey,
  AgentRegistryCapabilityState,
} from "@/lib/agents/types";
import {
  getConfiguredScopeEntry,
  getProjectEntry,
  getSurfaceEntry,
} from "@/lib/controlPlane/repoSurfaceModel";
import type {
  DraftWorkPacket,
  DraftWorkPacketAction,
  DraftWorkPacketActionCompatibility,
  DraftWorkPacketCanonicalRoleResolution,
  DraftWorkPacketCompatibilityState,
  DraftWorkPacketSeed,
} from "@/lib/agents/workPacketTypes";

const WORK_PACKET_SEEDS: DraftWorkPacketSeed[] = [
  {
    packet_id: "wp-landing-homepage-refresh",
    title: "Landing page homepage refresh",
    summary:
      "Draft a homepage refresh plan and preview-only file edits for the main jai-nexus landing page.",
    status: "ready_for_review",
    source: {
      kind: "motion",
      label: "motion-0179 JAI Chat Surface v0 follow-on surface planning",
      motion_id: "motion-0179",
    },
    agent_key: "jai-landing-page-agent",
    configured_scope_key: "jai-nexus",
    target: {
      repo_full_name: "jai-nexus/jai-nexus",
      surface_key: "landing-page",
      project_id: "jai-internal",
    },
    requested_actions: ["draft_plan", "draft_files_preview"],
    allowed_paths: [
      "app/(marketing)/**",
      "components/landing/**",
      "content/homepage/**",
    ],
    blocked_paths: [
      "runtime/**",
      "surfaces/agent-ops/**",
      ".github/**",
    ],
    verification_commands: [
      "# operator must supply jai-nexus/jai-nexus landing-page verification commands before any execution is authorized",
      "# do not execute repository commands from this prompt without separate operator authorization",
    ],
    human_gates: [
      "Human operator must confirm scope before any branch or runtime action is considered.",
      "Human operator must review all draft text and file previews before follow-up work opens.",
      "Human operator must explicitly decide whether any later motion should permit implementation.",
    ],
    evidence_expectations: [
      "Draft homepage plan with page goals, sections, and information hierarchy.",
      "Preview-only file delta description with no repo mutation.",
      "Risk notes describing what remains blocked in v0.",
    ],
    next_prompt_target: {
      target: "REPO_EXECUTION",
      label: "Prepare bounded repo execution prompt",
      prompt:
        "Prepare a bounded REPO_EXECUTION prompt for jai-nexus/jai-nexus landing-page planning only. Preserve preview-only output, name the allowed paths, restate blocked authority, and require operator review before any follow-up motion.",
    },
  },
  {
    packet_id: "wp-customer-intake-map",
    title: "Customer portal intake map",
    summary:
      "Draft an intake-map plan for the customer-portal without opening implementation or execution paths.",
    status: "draft",
    source: {
      kind: "motion",
      label: "motion-0172 customer portal intake planning spine",
      motion_id: "motion-0172",
    },
    agent_key: "jai-customer-portal-agent",
    configured_scope_key: "customer-portal",
    target: {
      repo_full_name: "jai-nexus/jai-nexus",
      surface_key: "customer-portal",
      project_id: "jai-internal",
    },
    requested_actions: ["draft_plan"],
    allowed_paths: [
      "app/intake/**",
      "components/intake/**",
      "lib/intake/**",
    ],
    blocked_paths: [
      "runtime/**",
      "surfaces/agent-ops/**",
      ".github/**",
    ],
    verification_commands: [
      "# operator must supply jai-nexus/jai-nexus customer-portal verification commands before any execution is authorized",
      "# do not execute repository commands from this prompt without separate operator authorization",
    ],
    human_gates: [
      "Human operator must confirm the intake-flow scope and target repo before any follow-up motion.",
      "Human operator must validate that the plan remains documentation-only in this seam.",
    ],
    evidence_expectations: [
      "Draft intake-map plan with actors, flows, and UI sections.",
      "Targeting note showing customer-portal as a surface under jai-nexus/jai-nexus.",
    ],
    next_prompt_target: {
      target: "CONTROL_THREAD",
      label: "Prepare control-thread passalong",
      prompt:
        "Prepare a CONTROL_THREAD passalong that frames the customer-portal intake map as a planning-only surface under jai-nexus/jai-nexus, names the blocked implementation authority, and asks whether a later repo seam should be routed.",
    },
  },
  {
    packet_id: "wp-agent-registry-follow-up",
    title: "Agent registry follow-up",
    summary:
      "Draft a governance follow-up plan for the agent registry without changing execution posture.",
    status: "deferred",
    source: {
      kind: "control_thread",
      label: "CONTROL_THREAD follow-up after agent baseline and palette coherence",
    },
    agent_key: "jai-governance-agent",
    configured_scope_key: "dev-jai-nexus",
    target: {
      repo_full_name: "jai-nexus/dev-jai-nexus",
      surface_key: "operator-agents",
      project_id: "jai-internal",
    },
    requested_actions: ["draft_plan"],
    allowed_paths: [
      "portal/src/app/operator/agents/**",
      "portal/src/lib/agents/**",
      "docs/**",
    ],
    blocked_paths: [
      "runtime/**",
      "surfaces/agent-ops/**",
      "portal/src/app/api/**",
    ],
    verification_commands: [
      "pnpm -C portal typecheck",
      "node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus",
    ],
    human_gates: [
      "Human operator must confirm the follow-up remains governance-only.",
      "Human operator must review evidence expectations before any new motion is opened.",
    ],
    evidence_expectations: [
      "Draft follow-up plan with bounded registry questions and next governance seams.",
      "Explicit statement that no execution enablement is proposed here.",
    ],
    next_prompt_target: {
      target: "ORCHESTRATOR",
      label: "Compare next governance seams",
      prompt:
        "Compare the next governance-only seams for dev-jai-nexus agent registry follow-up. Keep execution disabled, keep JAI Palette intact, and recommend whether the next route should target policy, copy, or workflow documentation.",
    },
  },
  {
    packet_id: "wp-api-contract-review",
    title: "API contract review",
    summary:
      "Draft a read-only API contract review packet for api-nexus, combining verification and planning posture only.",
    status: "blocked",
    source: {
      kind: "motion",
      label: "motion-0180 telemetry and surface freshness follow-up",
      motion_id: "motion-0180",
    },
    agent_key: "jai-verifier",
    configured_scope_key: "api-nexus",
    target: {
      repo_full_name: "jai-nexus/api-nexus",
      surface_key: "api-nexus",
      project_id: "jai-internal",
    },
    requested_actions: ["view_only", "verify", "draft_plan"],
    allowed_paths: [
      "openapi/**",
      "src/contracts/**",
      "docs/api/**",
    ],
    blocked_paths: [
      "runtime/**",
      "surfaces/agent-ops/**",
      ".github/**",
    ],
    verification_commands: [
      "# operator must supply jai-nexus/api-nexus verification commands before any execution is authorized",
      "# do not execute repository commands from this prompt without separate operator authorization",
    ],
    human_gates: [
      "Human operator must confirm the contract review remains read-only.",
      "Human operator must approve any follow-up design or implementation motion separately.",
    ],
    evidence_expectations: [
      "Read-only API contract review notes with observed risks and open questions.",
      "Draft follow-up plan for any schema or interface gaps found.",
    ],
    next_prompt_target: {
      target: "EXPLORATION",
      label: "Bounded read-only review framing",
      prompt:
        "Frame a read-only EXPLORATION review brief for jai-nexus/api-nexus that limits outputs to API contract observations, verification notes, and follow-up planning questions. Do not imply branch write, runtime execution, or PR authority.",
    },
  },
  {
    packet_id: "wp-motion-snapshot-closeout",
    title: "Motion snapshot closeout audit",
    summary:
      "Read the latest motion-bearing seam and verify that the bundled motion snapshot closeout evidence is complete before further routing.",
    status: "settled",
    source: {
      kind: "motion",
      label: "motion-0182 Motion Snapshot Gate v0",
      motion_id: "motion-0182",
    },
    agent_key: "jai-librarian",
    configured_scope_key: "dev-jai-nexus",
    target: {
      repo_full_name: "jai-nexus/dev-jai-nexus",
      surface_key: "operator-motions",
      project_id: "jai-internal",
    },
    requested_actions: ["view_only"],
    allowed_paths: [
      ".nexus/motions/**",
      "portal/src/lib/motion/**",
      "portal/docs/**",
    ],
    blocked_paths: [
      "portal/src/app/api/**",
      "runtime/**",
      "surfaces/agent-ops/**",
    ],
    verification_commands: [
      "node portal/scripts/build-motion-snapshot.mjs --check",
      "node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0182/motion.yaml",
    ],
    human_gates: [
      "Human operator confirms the motion snapshot evidence is complete before merge.",
      "Human operator decides whether any follow-up motion should refine snapshot policy or CI posture.",
    ],
    evidence_expectations: [
      "Snapshot current result naming latest bundled motion and total count.",
      "Read-only closeout note confirming no automation or authority expansion was introduced.",
    ],
    next_prompt_target: {
      target: "CONTROL_THREAD",
      label: "Close the motion-bearing seam",
      prompt:
        "Prepare a CONTROL_THREAD closeout that reports the latest bundled motion, bundled motion count, snapshot check result, and whether any further snapshot-gate refinement is needed.",
    },
  },
];

function getNamedAgent(agentKey: string): AgentRegistryAgent {
  const agent = getAgentByKey(agentKey);

  if (!agent) {
    throw new Error(`Named agent not found in registry: ${agentKey}`);
  }

  return agent;
}

export function resolveCanonicalRoleForPacket(
  packet:
    | DraftWorkPacket
    | {
        agent: AgentRegistryAgent;
      },
): DraftWorkPacketCanonicalRoleResolution {
  const { agent } = packet;

  if (agent.agent_class === "canonical_active") {
    return {
      canonical_role_key: agent.canonical_key ?? null,
      canonical_role_label: agent.label,
      palette_draft_key: null,
      palette_draft_label: null,
    };
  }

  if (agent.palette_proposed_role) {
    const canonicalAgent = getAgentByKey(agent.palette_proposed_role);
    return {
      canonical_role_key: agent.palette_proposed_role,
      canonical_role_label: canonicalAgent?.label ?? null,
      palette_draft_key: agent.key,
      palette_draft_label: agent.label,
    };
  }

  return {
    canonical_role_key: null,
    canonical_role_label: null,
    palette_draft_key: agent.key,
    palette_draft_label: agent.label,
  };
}

function actionToCapabilityKey(
  action: DraftWorkPacketAction,
): AgentRegistryCapabilityKey {
  if (action === "view_only") return "view_only";
  if (action === "draft_plan") return "draft_plan";
  if (action === "draft_files_preview") return "draft_files_preview";
  return "view_only";
}

function deriveVerifyStatus(agent: AgentRegistryAgent): {
  capabilityState: AgentRegistryCapabilityState;
  status: DraftWorkPacketCompatibilityState;
  reason: string;
} {
  if (agent.key === "jai-verifier") {
    return {
      capabilityState: agent.capabilities.view_only,
      status: "compatible",
      reason:
        "Verify requests are read-only in v0 and are compatible with the verifier's view-only review posture.",
    };
  }

  return {
    capabilityState: agent.capabilities.view_only,
    status: "blocked",
    reason:
      "Verify requests remain blocked unless the named verifier identity is assigned to the packet.",
  };
}

function deriveActionCompatibility(
  agent: AgentRegistryAgent,
  action: DraftWorkPacketAction,
): DraftWorkPacketActionCompatibility {
  if (action === "verify") {
    const verify = deriveVerifyStatus(agent);
    return {
      requested_action: action,
      registry_capability_key: "view_only",
      registry_capability_state: verify.capabilityState,
      status: verify.status,
      reason: verify.reason,
    };
  }

  const capabilityKey = actionToCapabilityKey(action);
  const capabilityState = agent.capabilities[capabilityKey];

  if (capabilityState === "enabled") {
    return {
      requested_action: action,
      registry_capability_key: capabilityKey,
      registry_capability_state: capabilityState,
      status: "compatible",
      reason:
        "Requested action is compatible with the current configuration-only registry posture.",
    };
  }

  if (capabilityState === "preview_only") {
    return {
      requested_action: action,
      registry_capability_key: capabilityKey,
      registry_capability_state: capabilityState,
      status: "preview_only",
      reason:
        "Requested action is limited to preview-only output and cannot mutate repositories in v0.",
    };
  }

  return {
    requested_action: action,
    registry_capability_key: capabilityKey,
    registry_capability_state: capabilityState,
    status: "blocked",
    reason:
      "Requested action is blocked by the current v0 capability posture.",
  };
}

export function getDraftWorkPackets(): DraftWorkPacket[] {
  return WORK_PACKET_SEEDS.map((seed) => {
    const agent = getNamedAgent(seed.agent_key);
    const configuredScope = getConfiguredScopeEntry(seed.configured_scope_key);
    const surface = getSurfaceEntry(seed.target.surface_key);
    const project = seed.target.project_id
      ? (getProjectEntry(seed.target.project_id) ?? null)
      : null;

    if (!configuredScope) {
      throw new Error(
        `Configured agent scope key not found in control-plane model: ${seed.configured_scope_key}`,
      );
    }

    if (!surface) {
      throw new Error(
        `Target surface not found in control-plane model: ${seed.target.surface_key}`,
      );
    }

    return {
      packet_id: seed.packet_id,
      title: seed.title,
      summary: seed.summary,
      status: seed.status,
      source: { ...seed.source },
      configured_scope_key: seed.configured_scope_key,
      target: {
        repo_full_name: seed.target.repo_full_name,
        surface,
        project,
      },
      requested_actions: seed.requested_actions,
      allowed_paths: seed.allowed_paths,
      blocked_paths: seed.blocked_paths,
      verification_commands: seed.verification_commands,
      agent,
      canonical_role: resolveCanonicalRoleForPacket({ agent }),
      compatibility: {
        agent_exists: true,
        configured_scope_exists: true,
        target_repo_in_scope:
          agent.configured_scope_keys.includes(seed.configured_scope_key) &&
          configuredScope.repo_full_name === seed.target.repo_full_name,
        target_surface_in_scope:
          agent.configured_scope_keys.includes(seed.configured_scope_key) &&
          configuredScope.surface_keys.includes(seed.target.surface_key),
        execution_blocked: true,
        requested_action_statuses: seed.requested_actions.map((action) =>
          deriveActionCompatibility(agent, action),
        ),
      },
      human_gates: seed.human_gates,
      evidence_expectations: seed.evidence_expectations,
      next_prompt_target: { ...seed.next_prompt_target },
    };
  });
}
