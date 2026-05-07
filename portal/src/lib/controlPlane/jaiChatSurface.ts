export interface JaiChatDraftAction {
  label: string;
  prompt: string;
}

export interface JaiChatLinkedSurface {
  href: string;
  label: string;
  summary: string;
}

export interface JaiChatSurfaceModel {
  domain: string;
  repo_full_name: string;
  baseline_motion_id: string;
  route: string;
  badges: string[];
  linked_surfaces: JaiChatLinkedSurface[];
  draft_actions: JaiChatDraftAction[];
  guardrails: string[];
  placeholder_response: string;
  status_notes: string[];
}

const JAI_CHAT_SURFACE_MODEL: JaiChatSurfaceModel = {
  domain: "dev.jai.nexus",
  repo_full_name: "jai-nexus/dev-jai-nexus",
  baseline_motion_id: "motion-0178",
  route: "/operator/jai",
  badges: [
    "Control-plane domain",
    "Draft-only",
    "Read-only context",
    "No execution authority",
  ],
  linked_surfaces: [
    {
      href: "/operator/chats",
      label: "Chats",
      summary: "Conversation continuity and imported archive browsing.",
    },
    {
      href: "/operator/waves",
      label: "Waves",
      summary: "Wave state, orchestration context, and cross-seam continuity.",
    },
    {
      href: "/operator/work",
      label: "Work",
      summary: "Draft work packets and operator execution prompts.",
    },
    {
      href: "/operator/agents",
      label: "Agents",
      summary: "Configured agent scope subset and capability posture.",
    },
    {
      href: "/operator/motions",
      label: "Motions",
      summary: "Canonical motion browser and contender review surface.",
    },
  ],
  draft_actions: [
    {
      label: "Summarize current control-plane posture",
      prompt:
        "Summarize the current dev.jai.nexus control-plane posture, with repo scope, authority boundaries, and open operating gaps.",
    },
    {
      label: "Prepare a passalong",
      prompt:
        "Draft a CONTROL_THREAD passalong for the current seam with completed work, blocked capabilities, validation state, and next routing options.",
    },
    {
      label: "Compare next routing options",
      prompt:
        "Compare the next plausible routing seams without assuming authority expansion or execution enablement.",
    },
    {
      label: "Draft a repo execution prompt",
      prompt:
        "Prepare a bounded repo-execution prompt for dev-jai-nexus that stays inside the current motion and path limits.",
    },
    {
      label: "Review authority boundaries",
      prompt:
        "Review the current authority boundaries for dev.jai.nexus and identify which capabilities remain explicitly disabled.",
    },
  ],
  guardrails: [
    "no live provider/model integration",
    "no execution",
    "no branch writes",
    "no PR creation",
    "no API/DB mutation",
    "no scheduler",
    "no hidden persistence",
    "no credentials",
    "no cross-repo mutation",
  ],
  placeholder_response:
    "Placeholder only: this JAI shell can stage operator prompts and surface local control-plane context, but it does not call a live model or perform any runtime action in v0.",
  status_notes: [
    "Agent Assets Library is static operating material only and does not grant authority.",
    "Remaining event stream, sync-run freshness, capability-matrix posture, and agent PR workflow gaps stay deferred here.",
    "This route is a control-plane shell, not a chat backend, memory service, or execution console.",
  ],
};

export function getJaiChatSurfaceModel(): JaiChatSurfaceModel {
  return {
    ...JAI_CHAT_SURFACE_MODEL,
    badges: [...JAI_CHAT_SURFACE_MODEL.badges],
    linked_surfaces: JAI_CHAT_SURFACE_MODEL.linked_surfaces.map((entry) => ({ ...entry })),
    draft_actions: JAI_CHAT_SURFACE_MODEL.draft_actions.map((entry) => ({ ...entry })),
    guardrails: [...JAI_CHAT_SURFACE_MODEL.guardrails],
    status_notes: [...JAI_CHAT_SURFACE_MODEL.status_notes],
  };
}
