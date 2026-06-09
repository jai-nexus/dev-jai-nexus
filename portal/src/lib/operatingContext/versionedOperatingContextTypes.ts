export type OperatingContextScope = "account" | "workspace" | "project";

export interface OperatingContextKeyValue {
  label: string;
  value: string;
  detail?: string;
}

export interface OperatingContextDashboardModule {
  module_id: string;
  label: string;
  status: string;
  summary: string;
}

export interface OperatingContextCouncilDefault {
  council_id: string;
  label: string;
  posture: string;
  advisory_note: string;
}

export interface OperatingContextAgentLaneDefault {
  lane_id: string;
  label: string;
  default_status: string;
  summary: string;
  non_executable_note: string;
}

export interface OperatingContextEvidenceStandard {
  standard_id: string;
  label: string;
  requirement: string;
}

export interface OperatingContextProtectedSetting {
  setting_id: string;
  label: string;
  value: string;
  reason: string;
}

export interface OperatingContextSnapshotRef {
  ref_id: string;
  label: string;
  summary: string;
}

export interface VersionedOperatingContext {
  current_context_id: string;
  object_id: string;
  nhid: string;
  scope: OperatingContextScope;
  version: string;
  status: string;
  display_name: string;
  objective: string;
  active_configuration: OperatingContextKeyValue[];
  dashboard_modules: OperatingContextDashboardModule[];
  custom_metrics: OperatingContextKeyValue[];
  council_defaults: OperatingContextCouncilDefault[];
  agent_lane_defaults: OperatingContextAgentLaneDefault[];
  evidence_standards: OperatingContextEvidenceStandard[];
  authority_boundary: string;
  blocked_settings: OperatingContextProtectedSetting[];
  confirmation_requirements: string[];
  last_snapshot: OperatingContextSnapshotRef;
  last_diff: OperatingContextSnapshotRef;
  last_receipt: OperatingContextSnapshotRef;
  rollback_posture: string;
}

export interface VersionedOperatingContextFixture {
  generated_label: string;
  status_note: string;
  authority_boundary_label: string;
  context: VersionedOperatingContext;
  non_authorizations: string[];
}
