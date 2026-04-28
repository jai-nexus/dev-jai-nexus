import type {
  AgentRegistryAgent,
  AgentRegistryScopeKey,
} from "@/lib/agents/types";
import type {
  ControlPlaneProjectEntry,
  ControlPlaneSurfaceEntry,
} from "@/lib/controlPlane/types";
import type { DraftWorkPacketAction } from "@/lib/agents/workPacketTypes";

export type DeliberationCandidateSourceKind =
  | "work_packet"
  | "project"
  | "manual"
  | "motion"
  | "planned_toolchain";

export type DeliberationToolchainTargetKey = "jai-pilot" | "vscode-nexus";

export type DeliberationAdvisoryVote =
  | "support"
  | "support_with_caution"
  | "defer"
  | "out_of_scope";

export interface DeliberationCandidateSeed {
  candidate_id: string;
  title: string;
  summary: string;
  source_kind: DeliberationCandidateSourceKind;
  source_label: string;
  configured_scope_key: AgentRegistryScopeKey | null;
  repo_full_name: string;
  surface_key: ControlPlaneSurfaceEntry["key"];
  project_id: string | null;
  requested_actions: DraftWorkPacketAction[];
  human_gates: string[];
  evidence_expectations: string[];
  verification_commands: string[];
  planned_toolchain_target: DeliberationToolchainTargetKey | null;
}

export interface DeliberationAgentAdvisory {
  agent: AgentRegistryAgent;
  vote: DeliberationAdvisoryVote;
  reasoning: string[];
}

export interface DeliberationConsensusSummary {
  support: number;
  support_with_caution: number;
  defer: number;
  out_of_scope: number;
  consensus_label: string;
  summary: string;
  non_binding: true;
}

export interface DeliberationNextStepPrompt {
  prompt_id: string;
  status: "copy_only";
  text: string;
}

export interface DeliberationCandidate {
  candidate_id: string;
  title: string;
  summary: string;
  source_kind: DeliberationCandidateSourceKind;
  source_label: string;
  configured_scope_key: AgentRegistryScopeKey | null;
  target: {
    repo_full_name: string;
    surface: ControlPlaneSurfaceEntry;
    project: ControlPlaneProjectEntry | null;
  };
  requested_actions: DraftWorkPacketAction[];
  human_gates: string[];
  evidence_expectations: string[];
  verification_commands: string[];
  planned_toolchain_target: DeliberationToolchainTargetKey | null;
  advisory: DeliberationAgentAdvisory[];
  consensus: DeliberationConsensusSummary;
  next_step_prompt: DeliberationNextStepPrompt;
}

export interface DeliberationPanelModel {
  participating_agents: AgentRegistryAgent[];
  candidates: DeliberationCandidate[];
  planned_toolchain_targets: DeliberationToolchainTargetKey[];
}
