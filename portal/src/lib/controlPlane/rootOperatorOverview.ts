import { prisma } from "@/lib/prisma";
import {
  getCanonicalActiveAgents,
  getPaletteDraftAgents,
} from "@/lib/agents/agentRegistry";
import { getDeterministicAgendaModel } from "@/lib/controlPlane/agendaModel";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";
import { getOperatorLoopCandidate } from "@/lib/controlPlane/operatorLoopCandidate";
import {
  getConfiguredAgentScopeSubset,
  getFullRepoRegistry,
} from "@/lib/controlPlane/repoSurfaceModel";
import type { MotionQueueState, MotionSourceMode } from "@/lib/motion/motionSurface";
import { loadMotionQueueIndex } from "@/lib/motion/motionSurface";
import motionSnapshotData from "@/lib/motion/motionSnapshot.json" with { type: "json" };
import { getProjectsConfig } from "@/lib/projectsConfig";

type MotionSnapshotEntry = {
  motion_id: string;
  item?: {
    title?: string | null;
    queue_state?: MotionQueueState;
  };
};

type MotionSnapshotData = {
  generated_at: string;
  motion_count: number;
  entries: MotionSnapshotEntry[];
};

export interface RootOperatorOverviewLink {
  href: string;
  label: string;
  summary: string;
}

export interface RootOperatorOverviewTelemetrySummary {
  count: number;
  latest_at: Date | null;
  note: string;
}

export interface RootOperatorOverviewLegacySyncRun {
  id: number;
  started_at: Date;
  status: string;
  type: string;
  trigger: string | null;
  repo_name: string | null;
  summary: string | null;
  review_href: string;
}

export interface RootOperatorOverview {
  domain: "dev.jai.nexus";
  control_plane_repo: "jai-nexus/dev-jai-nexus";
  bundled_motion_snapshot: {
    generated_at: string;
    motion_count: number;
    latest_motion_id: string | null;
    latest_motion_title: string | null;
    latest_motion_queue_state: MotionQueueState | null;
    live_source_mode: MotionSourceMode;
    live_source_label: string;
  };
  deterministic_agenda: {
    total_items: number;
    ready_for_review: number;
    blocked: number;
    deferred: number;
    settled: number;
    target_repo_count: number;
    target_surface_count: number;
    action_coverage_count: number;
    note: string;
  };
  first_official_loop_candidate: {
    selected_work_packet_id: string;
    title: string;
    summary: string;
    selected_status_label: string;
    selection_reason: string;
    assigned_agent_label: string;
    canonical_role_label: string;
    target_repo_full_name: string;
    target_surface_label: string;
    source_seam: string;
    requested_actions: string[];
    routing_target: string;
    validation_gate: string;
    human_decision_gate: string;
    authority_boundary: string[];
  };
  operator_jai: {
    href: "/operator/jai";
    posture: string;
    note: string;
  };
  repo_registry: {
    repo_count: number;
    configured_scope_count: number;
    note: string;
  };
  project_registry: {
    project_count: number;
    project_ids: string[];
    note: string;
  };
  agents: {
    canonical_active_count: number;
    palette_draft_count: number;
    execution_lane_count: number;
    governance_lane_count: number;
    note: string;
  };
  authority: {
    blocked_capability_count: number;
    note: string;
  };
  telemetry: {
    events: RootOperatorOverviewTelemetrySummary & {
      latest_kind: string | null;
      latest_source: string | null;
    };
    sync_runs: RootOperatorOverviewTelemetrySummary & {
      recent_runs: RootOperatorOverviewLegacySyncRun[];
    };
    decisions: RootOperatorOverviewTelemetrySummary;
  };
  links: RootOperatorOverviewLink[];
}

const motionSnapshot = motionSnapshotData as MotionSnapshotData;

const ROOT_OVERVIEW_LINKS: RootOperatorOverviewLink[] = [
  {
    href: "/operator",
    label: "Operator home",
    summary: "Top-level operator surface for the control-plane domain.",
  },
  {
    href: "/operator/jai",
    label: "JAI chat",
    summary: "Static, draft-only, read-only JAI control-plane shell.",
  },
  {
    href: "/operator/work",
    label: "Deterministic agenda",
    summary: "Deterministic planning/review agenda for activated JAI agents.",
  },
  {
    href: "/operator/motions",
    label: "Motions",
    summary: "Canonical motion queue and bundled snapshot visibility.",
  },
  {
    href: "/operator/agents",
    label: "Agents",
    summary: "Canonical active agents and JAI Palette draft design layer.",
  },
  {
    href: "/operator/projects",
    label: "Projects",
    summary: "JAI NEXUS-centric project registry surface.",
  },
  {
    href: "/operator/events",
    label: "Events",
    summary: "Partial DB-backed event stream with explicit freshness caveats.",
  },
  {
    href: "/operator/chats",
    label: "Chats",
    summary: "Operator chat archive and motion-linked conversation search.",
  },
  {
    href: "/operator/waves",
    label: "Waves",
    summary: "Wave and planning surfaces without live execution enablement.",
  },
];

export async function getRootOperatorOverview(): Promise<RootOperatorOverview> {
  const agenda = getDeterministicAgendaModel();
  const authority = getControlPlaneAuthorityPosture();
  const loopCandidate = getOperatorLoopCandidate();
  const repos = getFullRepoRegistry();
  const configuredScopes = getConfiguredAgentScopeSubset();
  const projects = getProjectsConfig().projects;
  const canonicalAgents = getCanonicalActiveAgents();
  const paletteAgents = getPaletteDraftAgents();
  const motionQueue = await loadMotionQueueIndex();

  const [latestEvent, eventCount, latestSyncRun, syncRunCount, recentSyncRuns, latestDecision, decisionCount] =
    await Promise.all([
      prisma.sotEvent.findFirst({
        orderBy: { ts: "desc" },
        select: { ts: true, kind: true, source: true },
      }),
      prisma.sotEvent.count(),
      prisma.syncRun.findFirst({
        orderBy: { startedAt: "desc" },
        select: { startedAt: true },
      }),
      prisma.syncRun.count(),
      prisma.syncRun.findMany({
        orderBy: { startedAt: "desc" },
        take: 5,
        include: { repo: true },
      }),
      prisma.decision.findFirst({
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
      }),
      prisma.decision.count(),
    ]);

  const latestBundledEntry = motionSnapshot.entries[0];

  return {
    domain: "dev.jai.nexus",
    control_plane_repo: "jai-nexus/dev-jai-nexus",
    bundled_motion_snapshot: {
      generated_at: motionSnapshot.generated_at,
      motion_count: motionSnapshot.motion_count,
      latest_motion_id: latestBundledEntry?.motion_id ?? null,
      latest_motion_title: latestBundledEntry?.item?.title ?? null,
      latest_motion_queue_state: latestBundledEntry?.item?.queue_state ?? null,
      live_source_mode: motionQueue.source_mode,
      live_source_label: motionQueue.source_label,
    },
    deterministic_agenda: {
      total_items: agenda.summary.total_items,
      ready_for_review: agenda.summary.status_counts.ready_for_review,
      blocked: agenda.summary.status_counts.blocked,
      deferred: agenda.summary.status_counts.deferred,
      settled: agenda.summary.status_counts.settled,
      target_repo_count: agenda.summary.repo_count,
      target_surface_count: agenda.summary.surface_count,
      action_coverage_count: Object.values(agenda.summary.requested_action_counts).filter(
        (count) => count > 0,
      ).length,
      note:
        "Deterministic planning/review posture only. No execution, branch write, PR creation, or runtime dispatch is enabled.",
    },
    first_official_loop_candidate: {
      selected_work_packet_id: loopCandidate.selected_work_packet_id,
      title: loopCandidate.candidate_label,
      summary: loopCandidate.candidate_summary,
      selected_status_label: loopCandidate.selected_status_label,
      selection_reason: loopCandidate.selection_reason,
      assigned_agent_label: loopCandidate.assigned_agent_label,
      canonical_role_label: loopCandidate.canonical_role_label,
      target_repo_full_name: loopCandidate.target_repo_full_name,
      target_surface_label: loopCandidate.target_surface_label,
      source_seam: loopCandidate.source_seam,
      requested_actions: loopCandidate.requested_actions,
      routing_target: loopCandidate.routing_target,
      validation_gate: loopCandidate.validation_gate,
      human_decision_gate: loopCandidate.human_decision_gate,
      authority_boundary: loopCandidate.authority_boundary,
    },
    operator_jai: {
      href: "/operator/jai",
      posture: "static, draft-only, read-only",
      note:
        "Operator JAI remains a bounded shell with visible control-plane context and no live provider/model integration.",
    },
    repo_registry: {
      repo_count: repos.length,
      configured_scope_count: configuredScopes.length,
      note:
        "The full repo registry is the superset. Configured scope keys remain a curated operator subset, not the full repo list.",
    },
    project_registry: {
      project_count: projects.length,
      project_ids: projects.map((project) => project.project_id),
      note:
        "The project registry shown on dev.jai.nexus remains JAI NEXUS-centric only and does not represent the broader strategic backlog.",
    },
    agents: {
      canonical_active_count: canonicalAgents.length,
      palette_draft_count: paletteAgents.length,
      execution_lane_count: canonicalAgents.filter(
        (agent) => agent.canonical_lane === "execution",
      ).length,
      governance_lane_count: canonicalAgents.filter(
        (agent) => agent.canonical_lane === "governance",
      ).length,
      note:
        "Canonical active JAI agents remain distinct from JAI Palette draft/custom agent designs. Drafts do not gain execution authority in this surface.",
    },
    authority: {
      blocked_capability_count: authority.blocked_capabilities.length,
      note:
        "Read-only/display-only overview. Disabled authority remains disabled across execution, branch write, PR proposal, scheduler, provider dispatch, and mutation paths.",
    },
    telemetry: {
      events: {
        count: eventCount,
        latest_at: latestEvent?.ts ?? null,
        latest_kind: latestEvent?.kind ?? null,
        latest_source: latestEvent?.source ?? null,
        note:
          "Events is a real DB-backed stream, but it remains partial and stale. Motion and governance ratification do not auto-emit into Events in v0.",
      },
      sync_runs: {
        count: syncRunCount,
        latest_at: latestSyncRun?.startedAt ?? null,
        note:
          "Sync Runs remain sparse review artifacts tied to agent-edit and sync surfaces. They are not a full live heartbeat for the repo registry.",
        recent_runs: recentSyncRuns.map((run) => ({
          id: run.id,
          started_at: run.startedAt,
          status: run.status,
          type: run.type,
          trigger: run.trigger,
          repo_name: run.repo?.name ?? null,
          summary: run.summary,
          review_href: `/operator/sync-runs/${run.id}/review`,
        })),
      },
      decisions: {
        count: decisionCount,
        latest_at: latestDecision?.updatedAt ?? null,
        note:
          "Decisions remain a manual extraction surface. Freshness depends on explicit extraction, not automated live capture.",
      },
    },
    links: ROOT_OVERVIEW_LINKS.map((link) => ({ ...link })),
  };
}
