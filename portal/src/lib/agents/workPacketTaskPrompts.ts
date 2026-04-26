import { getAgentConfigurationRegistry } from "@/lib/agents/agentRegistry";
import type { DraftWorkPacket, DraftWorkPacketTaskPrompt } from "@/lib/agents/workPacketTypes";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function buildBranchSuggestion(packet: DraftWorkPacket): string {
  return `draft/${packet.agent.key}/${slugify(packet.packet_id)}`;
}

export function buildDraftWorkPacketTaskPrompt(
  packet: DraftWorkPacket,
): DraftWorkPacketTaskPrompt {
  const registry = getAgentConfigurationRegistry();
  const assignedAgentExists = registry.named_agents.some(
    (agent) => agent.key === packet.agent.key,
  );
  const assignedAgentIsSharedAlias =
    registry.shared_aliases.some((alias) => alias.handle === packet.agent.handle) ||
    packet.agent.handle === "agent@jai.nexus";
  const repoScopeCompatible = packet.compatibility.repo_scope_in_scope;
  const requestedActionsCompatible = packet.compatibility.requested_action_statuses.every(
    (compatibility) => compatibility.status !== "blocked",
  );

  const warnings: string[] = [];
  const blockedReasons: string[] = [];

  if (!assignedAgentExists) {
    blockedReasons.push(
      "Assigned agent is not present in the named JAI agent registry.",
    );
  }

  if (assignedAgentIsSharedAlias) {
    blockedReasons.push(
      "Shared alias identities such as agent@jai.nexus cannot be used as execution or draft packet assignees.",
    );
  }

  if (!repoScopeCompatible) {
    blockedReasons.push(
      "Requested repo is outside the configured repo scope for this named agent.",
    );
  }

  for (const compatibility of packet.compatibility.requested_action_statuses) {
    if (compatibility.status === "blocked") {
      blockedReasons.push(compatibility.reason);
    } else if (compatibility.status === "preview_only") {
      warnings.push(compatibility.reason);
    }
  }

  warnings.push(
    "Do not execute unless separately authorized by the operator.",
  );

  const status = blockedReasons.length
    ? "blocked"
    : warnings.length > 1
      ? "warning"
      : "ready_preview";

  const branchNameSuggestion = buildBranchSuggestion(packet);
  const branchSuggestionNote =
    "Suggestion only. No branch write is enabled from this prompt surface.";

  const promptLines = [
    `# Agent Task Prompt Preview`,
    ``,
    `Prompt ID: prompt-${packet.packet_id}`,
    `Packet ID: ${packet.packet_id}`,
    `Assigned agent key: ${packet.agent.key}`,
    `Assigned agent display name: ${packet.agent.label}`,
    `Assigned agent handle: ${packet.agent.handle}`,
    `Target repo: ${packet.repo_scope}`,
    `Target surface: ${packet.target_surface}`,
    `Branch suggestion (suggestion only): ${branchNameSuggestion}`,
    `Branch suggestion note: ${branchSuggestionNote}`,
    ``,
    `Requested actions:`,
    ...packet.requested_actions.map((action) => `- ${action}`),
    ``,
    `Allowed paths:`,
    ...packet.allowed_paths.map((allowedPath) => `- ${allowedPath}`),
    ``,
    `Blocked paths:`,
    ...packet.blocked_paths.map((blockedPath) => `- ${blockedPath}`),
    ``,
    `Compatibility summary:`,
    `- agent exists: ${assignedAgentExists ? "yes" : "no"}`,
    `- shared alias blocked: ${assignedAgentIsSharedAlias ? "yes" : "no"}`,
    `- repo in scope: ${repoScopeCompatible ? "yes" : "no"}`,
    `- requested capability compatibility: ${requestedActionsCompatible ? "compatible or preview_only" : "blocked"}`,
    `- execution blocked in v0: yes`,
    ``,
    `Human gates:`,
    ...packet.human_gates.map((gate) => `- ${gate}`),
    ``,
    `Verification commands:`,
    ...packet.verification_commands.map((command) => `- ${command}`),
    ``,
    `Evidence expectations:`,
    ...packet.evidence_expectations.map((expectation) => `- ${expectation}`),
    ``,
    `Credential posture (env names only, no values):`,
    ...packet.agent.credential_posture.map(
      (credential) => `- ${credential.env_var}: ${credential.purpose}`,
    ),
    ``,
    `Operator guardrail: Do not execute unless separately authorized by the operator.`,
    `Operator guardrail: No branch write, PR creation, dispatch, scheduler behavior, DB mutation, API mutation, or runtime execution is enabled from this prompt.`,
  ];

  if (warnings.length > 0) {
    promptLines.push("", "Warnings:", ...warnings.map((warning) => `- ${warning}`));
  }

  if (blockedReasons.length > 0) {
    promptLines.push(
      "",
      "Blocked reasons:",
      ...blockedReasons.map((reason) => `- ${reason}`),
    );
  }

  return {
    prompt_id: `prompt-${packet.packet_id}`,
    packet_id: packet.packet_id,
    assigned_agent_key: packet.agent.key,
    assigned_agent_label: packet.agent.label,
    branch_name_suggestion: branchNameSuggestion,
    branch_suggestion_note: branchSuggestionNote,
    status,
    warnings,
    blocked_reasons: blockedReasons,
    validation: {
      agent_exists: assignedAgentExists,
      assigned_agent_is_shared_alias: assignedAgentIsSharedAlias,
      repo_scope_compatible: repoScopeCompatible,
      requested_actions_compatible: requestedActionsCompatible,
    },
    prompt_text: promptLines.join("\n"),
  };
}
