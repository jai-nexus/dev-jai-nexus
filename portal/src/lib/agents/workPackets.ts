import { getAgentConfigurationRegistry } from "@/lib/agents/agentRegistry";
import type {
  AgentRegistryAgent,
  AgentRegistryCapabilityKey,
  AgentRegistryCapabilityState,
} from "@/lib/agents/types";
import type {
  DraftWorkPacket,
  DraftWorkPacketAction,
  DraftWorkPacketActionCompatibility,
  DraftWorkPacketCompatibilityState,
  DraftWorkPacketSeed,
} from "@/lib/agents/workPacketTypes";

const WORK_PACKET_SEEDS: DraftWorkPacketSeed[] = [
  {
    packet_id: "wp-landing-homepage-refresh",
    title: "Landing page homepage refresh",
    summary:
      "Draft a homepage refresh plan and preview-only file edits for the main jai-nexus landing page.",
    agent_key: "jai-landing-page-agent",
    repo_scope: "jai-nexus",
    requested_actions: ["draft_plan", "draft_files_preview"],
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
  },
  {
    packet_id: "wp-customer-intake-map",
    title: "Customer portal intake map",
    summary:
      "Draft an intake-map plan for the customer-portal without opening implementation or execution paths.",
    agent_key: "jai-customer-portal-agent",
    repo_scope: "customer-portal",
    requested_actions: ["draft_plan"],
    human_gates: [
      "Human operator must confirm the intake-flow scope and target repo before any follow-up motion.",
      "Human operator must validate that the plan remains documentation-only in this seam.",
    ],
    evidence_expectations: [
      "Draft intake-map plan with actors, flows, and UI sections.",
      "Repo-scope note showing customer-portal compatibility.",
    ],
  },
  {
    packet_id: "wp-agent-registry-follow-up",
    title: "Agent registry follow-up",
    summary:
      "Draft a governance follow-up plan for the agent registry without changing execution posture.",
    agent_key: "jai-governance-agent",
    repo_scope: "dev-jai-nexus",
    requested_actions: ["draft_plan"],
    human_gates: [
      "Human operator must confirm the follow-up remains governance-only.",
      "Human operator must review evidence expectations before any new motion is opened.",
    ],
    evidence_expectations: [
      "Draft follow-up plan with bounded registry questions and next governance seams.",
      "Explicit statement that no execution enablement is proposed here.",
    ],
  },
  {
    packet_id: "wp-api-contract-review",
    title: "API contract review",
    summary:
      "Draft a read-only API contract review packet for api-nexus, combining verification and planning posture only.",
    agent_key: "jai-verifier",
    repo_scope: "api-nexus",
    requested_actions: ["verify", "draft_plan"],
    human_gates: [
      "Human operator must confirm the contract review remains read-only.",
      "Human operator must approve any follow-up design or implementation motion separately.",
    ],
    evidence_expectations: [
      "Read-only API contract review notes with observed risks and open questions.",
      "Draft follow-up plan for any schema or interface gaps found.",
    ],
  },
];

function getNamedAgent(agentKey: string): AgentRegistryAgent {
  const registry = getAgentConfigurationRegistry();
  const agent = registry.named_agents.find((entry) => entry.key === agentKey);

  if (!agent) {
    throw new Error(`Named agent not found in registry: ${agentKey}`);
  }

  return agent;
}

function actionToCapabilityKey(
  action: DraftWorkPacketAction,
): AgentRegistryCapabilityKey {
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

    return {
      packet_id: seed.packet_id,
      title: seed.title,
      summary: seed.summary,
      repo_scope: seed.repo_scope,
      requested_actions: seed.requested_actions,
      agent,
      compatibility: {
        agent_exists: true,
        repo_scope_in_scope: agent.repo_scopes.includes(seed.repo_scope),
        execution_blocked: true,
        requested_action_statuses: seed.requested_actions.map((action) =>
          deriveActionCompatibility(agent, action),
        ),
      },
      human_gates: seed.human_gates,
      evidence_expectations: seed.evidence_expectations,
    };
  });
}
