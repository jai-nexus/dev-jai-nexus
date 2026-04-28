export type ConversationSourceKind =
  | "imported_archive"
  | "operator_deliberation"
  | "repo_execution"
  | "control_thread"
  | "manual_capture";

export interface ConversationRecord {
  chat_id: string;
  title: string;
  source_kind: ConversationSourceKind;
  source_label: string;
  repo_full_name: string;
  surface_label: string;
  related_motion_ids: string[];
  related_wave_ids: string[];
  related_work_packet_ids: string[];
  related_candidate_ids: string[];
  status: "captured" | "planned_capture";
  captured_at: string;
  artifact_path_preview: string;
  summary: string;
  decisions: string[];
  risks: string[];
  tasks: string[];
  next_prompts: string[];
}

export interface WaveNode {
  nh_id: string;
  title: string;
  status: "planned" | "active" | "blocked" | "deferred" | "done";
  summary: string;
  linked_motion_ids: string[];
  linked_chat_ids: string[];
  linked_work_packet_ids: string[];
  linked_candidate_ids: string[];
  acceptance_notes: string[];
  children: WaveNode[];
}

export interface WavePlan {
  wave_id: string;
  title: string;
  status: "planned" | "active" | "blocked" | "deferred" | "done";
  repo_full_name: string;
  surface_label: string;
  project_label: string | null;
  related_motion_ids: string[];
  related_chat_ids: string[];
  related_work_packet_ids: string[];
  related_candidate_ids: string[];
  deliberation_route: string;
  next_prompt_preview: string;
  artifact_path_preview: {
    wave_yaml: string;
    plan_md: string;
  };
  nodes: WaveNode[];
}
