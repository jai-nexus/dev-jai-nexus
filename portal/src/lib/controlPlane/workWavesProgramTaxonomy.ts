export const WORK_WAVES_TAXONOMY_FIELDS = [
  "motion_id",
  "program_id",
  "program_name",
  "batch_id",
  "wave_id",
  "lane_id",
  "thread_id",
  "repo",
  "scope",
  "mode",
  "role",
  "lane_type",
  "status",
  "evidence_refs",
  "closeout_refs",
  "validation_summary",
  "non_authorizations",
  "blockers",
  "recommended_next_route",
  "control_thread_decision_status",
  "control_thread_decision_required",
  "authority_boundary_summary",
] as const;

export const WORK_REQUIRED_TAXONOMY_FIELDS = [
  "lane_id",
  "repo",
  "thread_id",
  "role",
  "scope",
  "mode",
  "lane_type",
  "status",
  "evidence_refs",
  "closeout_refs",
  "validation_summary",
  "non_authorizations",
  "blockers",
  "recommended_next_route",
  "control_thread_decision_status",
  "control_thread_decision_required",
  "authority_boundary_summary",
] as const;

export const WAVES_REQUIRED_TAXONOMY_FIELDS = [
  "program_id",
  "program_name",
  "batch_id",
  "wave_id",
  "lane_id",
  "thread_id",
  "status",
  "evidence_refs",
  "closeout_refs",
  "blockers",
  "recommended_next_route",
  "control_thread_decision_status",
  "control_thread_decision_required",
  "authority_boundary_summary",
] as const;

export const CLOSEOUT_REQUIRED_TAXONOMY_FIELDS = [
  "lane_id",
  "repo",
  "evidence_refs",
  "closeout_refs",
  "validation_summary",
  "non_authorizations",
  "blockers",
  "recommended_next_route",
  "control_thread_decision_status",
  "control_thread_decision_required",
  "authority_boundary_summary",
] as const;

export const WORK_WAVES_EVIDENCE_STATUS_VOCABULARY = [
  "missing",
  "referenced",
  "passalong-grounded",
  "repo-local",
  "reviewed",
  "accepted",
  "held",
  "blocked",
  "superseded",
  "closeout-ready",
  "program-close-candidate",
] as const;

export const WORK_WAVES_CONTROL_THREAD_DECISION_VOCABULARY = [
  "routed",
  "in progress",
  "closeout submitted",
  "reviewed",
  "accepted",
  "held",
  "blocked",
  "rejected",
  "review required",
  "program close candidate",
] as const;

export const WORK_WAVES_AUTHORITY_BOUNDARY_COPY = [
  "CONTROL_THREAD remains routing/acceptance/hold authority.",
  "UI display does not accept, reject, execute, route, deploy, mutate, or transfer source-of-truth authority.",
  "Closeout display is not acceptance.",
  "Program-close candidate is not production readiness.",
  "Display readiness is not execution readiness.",
  "Evidence referenced is not evidence verified.",
  "Passalong-grounded evidence is not repo-local evidence.",
  "No autonomous execution.",
  "No provider/model/API dispatch.",
  "No GitHub/API mutation.",
  "No target-repo mutation/import.",
  "No accepted-code import.",
  "No deployment.",
  "No production gates.",
  "No source-of-truth transfer.",
  "No hidden/background automation.",
] as const;

export interface WorkWavesTaxonomyRecord {
  surface: "work" | "waves";
  title: string;
  fields: Record<(typeof WORK_WAVES_TAXONOMY_FIELDS)[number], string | readonly string[] | boolean>;
  display_groups: readonly {
    label: string;
    fields: readonly (typeof WORK_WAVES_TAXONOMY_FIELDS)[number][];
  }[];
}

const sharedProgram = {
  motion_id: "Q3M7Y26 motion-control-plane-close-planning",
  program_id: "Q3M7Y26",
  program_name: "Q3M7Y26 JAI Motion Control Plane Activation v0",
  batch_id: "B",
  wave_id: "B-C",
  thread_id: "CONTROL_THREAD",
  repo: "dev-jai-nexus",
  mode: "APP-LOCAL / LOCAL-STATIC-DISPLAY-METADATA / ADVISORY-DISPLAY-ONLY",
  role: "JAI::DEV::BUILDER",
  status: "program-close-candidate",
  evidence_refs: [
    "docs/reference/q3m7-work-waves-program-taxonomy-alignment-planning-v0.md",
    "docs/reference/q3m7-sandbox-receipt-return-display-receipt-v0.md",
  ],
  closeout_refs: ["B39 repo-lane closeout", "B40 pending closeout"],
  validation_summary: "Display metadata validation only; source validation remains lane-scoped.",
  non_authorizations: WORK_WAVES_AUTHORITY_BOUNDARY_COPY,
  blockers: [
    "Agent inspection passalong was CONTROL_THREAD-provided context, not repo-local evidence.",
    "Pre-existing Work DB routes must remain visually distinct from local-static display metadata.",
  ],
  recommended_next_route: "B41 Work and Waves Program Taxonomy Alignment Boundary Review v0",
  control_thread_decision_status: "routed",
  control_thread_decision_required: true,
  authority_boundary_summary:
    "Non-authoritative display only; CONTROL_THREAD remains routing/acceptance/hold authority.",
} as const;

export const WORK_TAXONOMY_ALIGNMENT: WorkWavesTaxonomyRecord = {
  surface: "work",
  title: "Work taxonomy alignment",
  fields: {
    ...sharedProgram,
    lane_id: "B40-WORK",
    scope:
      "Lane/repo/thread/role/status/evidence/closeout detail for Work surface program-close planning.",
    lane_type: "SOURCE_IMPLEMENTATION / LOCAL_STATIC_DISPLAY_METADATA",
  },
  display_groups: [
    {
      label: "Lane identity",
      fields: ["program_id", "batch_id", "wave_id", "lane_id", "thread_id"],
    },
    {
      label: "Work detail",
      fields: ["repo", "scope", "mode", "role", "lane_type", "status"],
    },
    {
      label: "Evidence and closeout",
      fields: [
        "evidence_refs",
        "closeout_refs",
        "validation_summary",
        "blockers",
        "recommended_next_route",
      ],
    },
    {
      label: "CONTROL_THREAD posture",
      fields: [
        "control_thread_decision_status",
        "control_thread_decision_required",
        "authority_boundary_summary",
      ],
    },
  ],
} as const;

export const WAVES_TAXONOMY_ALIGNMENT: WorkWavesTaxonomyRecord = {
  surface: "waves",
  title: "Waves taxonomy alignment",
  fields: {
    ...sharedProgram,
    lane_id: "B40-WAVES-GROUPING",
    scope:
      "Program/batch/wave grouping, sequencing, evidence readiness, and closeout readiness for Waves surface program-close planning.",
    lane_type: "SOURCE_IMPLEMENTATION / LOCAL_STATIC_DISPLAY_METADATA",
  },
  display_groups: [
    {
      label: "Program grouping",
      fields: ["program_id", "program_name", "batch_id", "wave_id", "lane_id"],
    },
    {
      label: "Readiness posture",
      fields: ["status", "evidence_refs", "closeout_refs", "blockers"],
    },
    {
      label: "CONTROL_THREAD posture",
      fields: [
        "recommended_next_route",
        "control_thread_decision_status",
        "control_thread_decision_required",
        "authority_boundary_summary",
      ],
    },
  ],
} as const;

export function formatTaxonomyValue(value: string | readonly string[] | boolean): string {
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (typeof value === "string") return value;
  return value.join("; ");
}
