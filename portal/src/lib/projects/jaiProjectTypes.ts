export type JaiProjectState = "active" | "frozen" | "archived";

export interface JaiProjectMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface JaiProjectCouncilPosture {
  label: string;
  summary: string;
  representational_note: string;
}

export interface JaiProjectAgentLane {
  lane_id: string;
  label: string;
  status: string;
  summary: string;
  authority_boundary: string;
}

export interface JaiProjectRegistryEntry {
  project_id: string;
  nhid: string;
  name: string;
  state: JaiProjectState;
  objective: string;
  status_summary: string;
  custom_metrics: JaiProjectMetric[];
  canon_summary: string;
  open_questions: string[];
  deferred_ideas: string[];
  linked_repos: string[];
  council_posture: JaiProjectCouncilPosture;
  agent_lanes: JaiProjectAgentLane[];
  authority_boundary: string;
  next_prompts: string[];
}

export interface JaiProjectRegistryFixture {
  generated_label: string;
  status_note: string;
  authority_boundary_label: string;
  projects: JaiProjectRegistryEntry[];
  non_authorizations: string[];
}
