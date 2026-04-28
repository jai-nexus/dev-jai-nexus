import { getAgentConfigurationRegistry } from "@/lib/agents/agentRegistry";
import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import type {
  AgentRegistryAgent,
  AgentRegistryCapabilityKey,
  AgentRegistryScopeKey,
} from "@/lib/agents/types";
import {
  getProjectEntry,
  getProjectCatalog,
  getSurfaceEntry,
} from "@/lib/controlPlane/repoSurfaceModel";
import type {
  DeliberationAgentAdvisory,
  DeliberationCandidate,
  DeliberationCandidateSeed,
  DeliberationConsensusSummary,
  DeliberationPanelModel,
} from "@/lib/agents/deliberationTypes";
import type { DraftWorkPacketAction } from "@/lib/agents/workPacketTypes";

const GLOBAL_AGENT_KEYS = new Set([
  "jai-orchestrator",
  "jai-builder",
  "jai-verifier",
  "jai-librarian",
  "jai-governance-agent",
]);

function actionToCapabilityKey(
  action: DraftWorkPacketAction,
): AgentRegistryCapabilityKey {
  if (action === "draft_plan") return "draft_plan";
  if (action === "draft_files_preview") return "draft_files_preview";
  return "view_only";
}

function createCandidateSeeds(): DeliberationCandidateSeed[] {
  const packets = getDraftWorkPackets();

  const packetSeeds: DeliberationCandidateSeed[] = packets.map((packet) => ({
    candidate_id: `candidate-${packet.packet_id}`,
    title: packet.title,
    summary: packet.summary,
    source_kind: "work_packet",
    source_label: `Work packet ${packet.packet_id}`,
    configured_scope_key: packet.configured_scope_key,
    repo_full_name: packet.target.repo_full_name,
    surface_key: packet.target.surface.key,
    project_id: packet.target.project?.project_id ?? null,
    requested_actions: packet.requested_actions,
    human_gates: [...packet.human_gates],
    evidence_expectations: [...packet.evidence_expectations],
    verification_commands: [...packet.verification_commands],
    planned_toolchain_target: null,
  }));

  const projectSeeds: DeliberationCandidateSeed[] = [
    {
      candidate_id: "candidate-project-teacher-copilot-targeting",
      title: "Teacher Copilot targeting clarification",
      summary:
        "Advisory planning candidate for clarifying repo and surface coverage for the planned Teacher Copilot project without enabling execution.",
      source_kind: "project",
      source_label: "Project teacher-copilot",
      configured_scope_key: null,
      repo_full_name: "jai-nexus/teacher-copilot-nexus",
      surface_key: "teacher-copilot",
      project_id: "teacher-copilot",
      requested_actions: ["draft_plan"],
      human_gates: [
        "Human operator must confirm that planned project targets remain planning-only and do not imply repo activation.",
        "Any new repo registration or execution posture must be handled by a separate motion.",
      ],
      evidence_expectations: [
        "Repo-plus-surface mapping note for Teacher Copilot.",
        "Clarified project-to-surface relationship with no execution enablement.",
      ],
      verification_commands: [
        "pnpm -C portal typecheck",
        "node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus",
      ],
      planned_toolchain_target: null,
    },
  ];

  const manualSeeds: DeliberationCandidateSeed[] = [
    {
      candidate_id: "candidate-manual-customer-portal-copy-pass",
      title: "Customer portal surface copy pass",
      summary:
        "Manual candidate for aligning customer portal terminology across operator and product-facing copy without opening implementation authority.",
      source_kind: "manual",
      source_label: "Manual candidate",
      configured_scope_key: "customer-portal",
      repo_full_name: "jai-nexus/jai-nexus",
      surface_key: "customer-portal",
      project_id: "jai-internal",
      requested_actions: ["draft_plan"],
      human_gates: [
        "Human operator must confirm that this remains an advisory copy pass only.",
        "Any file-edit implementation requires a separate authorized work packet or motion.",
      ],
      evidence_expectations: [
        "List of terms that need alignment across customer portal and customer console references.",
        "Operator-ready scope note with no repo mutation.",
      ],
      verification_commands: [
        "# no repository command execution is authorized from this deliberation surface",
      ],
      planned_toolchain_target: null,
    },
  ];

  const motionSeeds: DeliberationCandidateSeed[] = [
    {
      candidate_id: "candidate-motion-0167-follow-up",
      title: "Control-plane wording follow-up",
      summary:
        "Advisory-only follow-up candidate to review whether additional control-plane copy normalization is needed after motion-0167.",
      source_kind: "motion",
      source_label: "Motion motion-0167",
      configured_scope_key: "dev-jai-nexus",
      repo_full_name: "jai-nexus/dev-jai-nexus",
      surface_key: "operator-deliberation",
      project_id: "jai-internal",
      requested_actions: ["draft_plan", "verify"],
      human_gates: [
        "Human operator must decide whether any follow-up belongs in governance, work packets, or stays as advisory only.",
        "No automatic motion creation or ratification is permitted from this surface.",
      ],
      evidence_expectations: [
        "Operator-ready summary of any remaining terminology inconsistencies.",
        "Explicit statement that votes shown here are non-binding.",
      ],
      verification_commands: [
        "pnpm -C portal typecheck",
        "node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus",
      ],
      planned_toolchain_target: null,
    },
  ];

  const toolchainSeeds: DeliberationCandidateSeed[] = [
    {
      candidate_id: "candidate-toolchain-jai-pilot-handoff",
      title: "Planned jai-pilot handoff prompt",
      summary:
        "Planned-only toolchain target for future handoff prompting into jai-pilot. No integration or execution is enabled here.",
      source_kind: "planned_toolchain",
      source_label: "Planned toolchain target",
      configured_scope_key: "dev-jai-nexus",
      repo_full_name: "jai-nexus/dev-jai-nexus",
      surface_key: "operator-deliberation",
      project_id: "jai-internal",
      requested_actions: ["draft_plan"],
      human_gates: [
        "Human operator must authorize any future jai-pilot integration in a separate motion.",
        "This candidate remains planning-only and cannot trigger toolchain execution.",
      ],
      evidence_expectations: [
        "Copy-only handoff prompt for future jai-pilot consideration.",
        "Clear statement that jai-pilot remains a planned target only.",
      ],
      verification_commands: [
        "# no live toolchain command is authorized from this surface",
      ],
      planned_toolchain_target: "jai-pilot",
    },
    {
      candidate_id: "candidate-toolchain-vscode-nexus-handoff",
      title: "Planned vscode-nexus workspace prompt",
      summary:
        "Planned-only toolchain target for future workspace prompting into vscode-nexus. No integration or execution is enabled here.",
      source_kind: "planned_toolchain",
      source_label: "Planned toolchain target",
      configured_scope_key: "dev-jai-nexus",
      repo_full_name: "jai-nexus/dev-jai-nexus",
      surface_key: "operator-deliberation",
      project_id: "jai-internal",
      requested_actions: ["draft_plan"],
      human_gates: [
        "Human operator must authorize any future vscode-nexus integration in a separate motion.",
        "This candidate remains planning-only and cannot trigger workspace execution.",
      ],
      evidence_expectations: [
        "Copy-only workspace prompt for future vscode-nexus consideration.",
        "Clear statement that vscode-nexus remains a planned target only.",
      ],
      verification_commands: [
        "# no live toolchain command is authorized from this surface",
      ],
      planned_toolchain_target: "vscode-nexus",
    },
  ];

  return [
    ...packetSeeds,
    ...projectSeeds,
    ...manualSeeds,
    ...motionSeeds,
    ...toolchainSeeds,
  ];
}

function hasScope(
  agent: AgentRegistryAgent,
  configuredScopeKey: AgentRegistryScopeKey | null,
): boolean {
  if (!configuredScopeKey) {
    return false;
  }

  return agent.configured_scope_keys.includes(configuredScopeKey);
}

function getActionState(
  agent: AgentRegistryAgent,
  action: DraftWorkPacketAction,
): "enabled" | "preview_only" | "disabled" {
  if (action === "verify") {
    return agent.key === "jai-verifier" ? "enabled" : "disabled";
  }

  return agent.capabilities[actionToCapabilityKey(action)];
}

function deriveAgentAdvisory(
  agent: AgentRegistryAgent,
  candidate: Omit<DeliberationCandidate, "advisory" | "consensus" | "next_step_prompt">,
): DeliberationAgentAdvisory {
  const broadAgent = GLOBAL_AGENT_KEYS.has(agent.key);
  const inScope = hasScope(agent, candidate.configured_scope_key);
  const actionStates = candidate.requested_actions.map((action) =>
    getActionState(agent, action),
  );
  const hasDisabledAction = actionStates.includes("disabled");
  const hasPreviewOnlyAction = actionStates.includes("preview_only");
  const reasoning: string[] = [];

  if (candidate.planned_toolchain_target) {
    if (!inScope && !broadAgent) {
      return {
        agent,
        vote: "out_of_scope",
        reasoning: [
          "This planned toolchain target is outside the configured scope subset for this agent.",
        ],
      };
    }

    reasoning.push(
      `${candidate.planned_toolchain_target} remains a planned toolchain target only and is not integrated in v0.`,
    );
    reasoning.push(
      "Any next step should stay copy-only and operator-authorized, with no execution or credential enablement.",
    );
    return {
      agent,
      vote: "support_with_caution",
      reasoning,
    };
  }

  if (!inScope && !broadAgent) {
    return {
      agent,
      vote: "out_of_scope",
      reasoning: [
        "Requested repo and surface target are outside this agent's configured scope subset.",
      ],
    };
  }

  if (!inScope && broadAgent) {
    reasoning.push(
      "Target is not currently represented in a configured scope subset, so this remains a planning-only advisory review.",
    );
  } else {
    reasoning.push(
      `Target resolves within configured scope key ${candidate.configured_scope_key}.`,
    );
  }

  if (hasDisabledAction) {
    reasoning.push(
      "At least one requested action is outside this agent's enabled or preview-only posture.",
    );
    return {
      agent,
      vote: broadAgent ? "defer" : "out_of_scope",
      reasoning,
    };
  }

  if (hasPreviewOnlyAction) {
    reasoning.push(
      "Requested actions include preview-only output, so the recommendation stays non-binding and copy-only.",
    );
    return {
      agent,
      vote: "support_with_caution",
      reasoning,
    };
  }

  if (candidate.source_kind === "project") {
    reasoning.push(
      "This project target is still planned, so advice should stay at planning and scope-clarification level only.",
    );
    return {
      agent,
      vote: "support_with_caution",
      reasoning,
    };
  }

  if (candidate.source_kind === "motion") {
    reasoning.push(
      "Motion-derived follow-up remains advisory only and cannot create or ratify anything from this panel.",
    );
    return {
      agent,
      vote: "support_with_caution",
      reasoning,
    };
  }

  reasoning.push(
    "Requested actions fit the current read-only or planning posture for this agent.",
  );
  return {
    agent,
    vote: "support",
    reasoning,
  };
}

function buildConsensusSummary(
  candidate: Omit<DeliberationCandidate, "consensus" | "next_step_prompt">,
): DeliberationConsensusSummary {
  const summary = {
    support: candidate.advisory.filter((entry) => entry.vote === "support").length,
    support_with_caution: candidate.advisory.filter(
      (entry) => entry.vote === "support_with_caution",
    ).length,
    defer: candidate.advisory.filter((entry) => entry.vote === "defer").length,
    out_of_scope: candidate.advisory.filter((entry) => entry.vote === "out_of_scope").length,
    consensus_label: "",
    summary: "",
    non_binding: true as const,
  };

  if (candidate.planned_toolchain_target) {
    summary.consensus_label = "planned only";
    summary.summary =
      "Consensus is limited to planning and copy-only handoff preparation. No toolchain integration or execution is authorized.";
    return summary;
  }

  if (summary.support > 0 && summary.defer === 0) {
    summary.consensus_label = "advisory support";
    summary.summary =
      "Advisory consensus supports an operator-reviewed next-step prompt while keeping execution blocked.";
    return summary;
  }

  if (summary.support_with_caution > 0 || summary.defer > 0) {
    summary.consensus_label = "caution";
    summary.summary =
      "Consensus supports planning or evidence gathering only. Human review must decide whether any follow-up work packet or motion is warranted.";
    return summary;
  }

  summary.consensus_label = "out of scope";
  summary.summary =
    "Current participating agents do not have enough in-scope posture to recommend this target beyond non-binding observation.";
  return summary;
}

function buildNextStepPrompt(
  candidate: Omit<DeliberationCandidate, "next_step_prompt">,
): DeliberationCandidate["next_step_prompt"] {
  const agentLine = candidate.advisory
    .filter((entry) => entry.vote !== "out_of_scope")
    .map((entry) => `${entry.agent.key}: ${entry.vote}`)
    .join(", ");

  const lines = [
    "# Operator Deliberation Next-Step Prompt",
    "",
    `Candidate ID: ${candidate.candidate_id}`,
    `Title: ${candidate.title}`,
    `Source: ${candidate.source_label} (${candidate.source_kind})`,
    `Target repo: ${candidate.target.repo_full_name}`,
    `Target surface: ${candidate.target.surface.label}`,
    `Target project: ${candidate.target.project?.name ?? "none"}`,
    `Configured scope key: ${candidate.configured_scope_key ?? "none"}`,
    `Requested actions: ${candidate.requested_actions.join(", ")}`,
    candidate.planned_toolchain_target
      ? `Planned toolchain target: ${candidate.planned_toolchain_target}`
      : "Planned toolchain target: none",
    "",
    `Consensus: ${candidate.consensus.consensus_label}`,
    `Consensus summary: ${candidate.consensus.summary}`,
    `Participating agent posture: ${agentLine || "no in-scope advisory votes"}`,
    "",
    "Human gates:",
    ...candidate.human_gates.map((gate) => `- ${gate}`),
    "",
    "Evidence expectations:",
    ...candidate.evidence_expectations.map((expectation) => `- ${expectation}`),
    "",
    "Verification commands:",
    ...candidate.verification_commands.map((command) => `- ${command}`),
    "",
    "Operator guardrail: votes are non-binding and advisory only.",
    "Operator guardrail: Do not execute unless separately authorized by the operator.",
    "Operator guardrail: No branch write, PR creation, dispatch, scheduler behavior, DB mutation, API mutation, or runtime execution is enabled from this panel.",
  ];

  return {
    prompt_id: `deliberation-prompt-${candidate.candidate_id}`,
    status: "copy_only",
    text: lines.join("\n"),
  };
}

export function getAgentDeliberationPanel(): DeliberationPanelModel {
  const registry = getAgentConfigurationRegistry();
  const participatingAgents = registry.named_agents;

  const candidates = createCandidateSeeds().map((seed) => {
    const surface = getSurfaceEntry(seed.surface_key);
    const project = seed.project_id ? getProjectEntry(seed.project_id) ?? null : null;

    if (!surface) {
      throw new Error(`Deliberation surface not found: ${seed.surface_key}`);
    }

    const candidateBase = {
      candidate_id: seed.candidate_id,
      title: seed.title,
      summary: seed.summary,
      source_kind: seed.source_kind,
      source_label: seed.source_label,
      configured_scope_key: seed.configured_scope_key,
      target: {
        repo_full_name: seed.repo_full_name,
        surface,
        project,
      },
      requested_actions: seed.requested_actions,
      human_gates: seed.human_gates,
      evidence_expectations: seed.evidence_expectations,
      verification_commands: seed.verification_commands,
      planned_toolchain_target: seed.planned_toolchain_target,
    };

    const advisory = participatingAgents.map((agent) =>
      deriveAgentAdvisory(agent, candidateBase),
    );

    const candidateWithAdvisory = {
      ...candidateBase,
      advisory,
    };

    const consensus = buildConsensusSummary(candidateWithAdvisory);
    const next_step_prompt = buildNextStepPrompt({
      ...candidateWithAdvisory,
      consensus,
    });

    return {
      ...candidateWithAdvisory,
      consensus,
      next_step_prompt,
    };
  });

  return {
    participating_agents: participatingAgents,
    candidates,
    planned_toolchain_targets: ["jai-pilot", "vscode-nexus"],
  };
}
