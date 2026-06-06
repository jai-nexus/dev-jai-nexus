export type PortfolioLaneStatus =
  | "active"
  | "queued"
  | "completed"
  | "deferred"
  | "held"
  | "blocked";

export interface PortfolioStatusLane {
  lane_id: string;
  repo: string;
  title: string;
  status: PortfolioLaneStatus;
  scope: string;
  branch: string;
  artifact: string;
  active_work?: string[];
  queued_work?: string[];
  deferred_work?: string[];
  risks?: string[];
  next_prompts?: string[];
}

export interface PortfolioStatusBatch {
  batch_id: string;
  title: string;
  status: "static_fixture_active" | "static_fixture_review" | "static_fixture_closed";
  summary: string;
  lane_ids: string[];
}

export interface PortfolioStatusFixture {
  generated_label: string;
  status_note: string;
  source_refs: string[];
  non_authorizations: string[];
  batches: PortfolioStatusBatch[];
  lanes: PortfolioStatusLane[];
  active_work: string[];
  queued_work: string[];
  deferred_work: string[];
  risks: string[];
  next_prompts: string[];
}

const portfolioStatusFixture: PortfolioStatusFixture = {
  generated_label: "Q2M6 static checked-in fixture, 2026-06-05",
  status_note:
    "Static local fixture only. Non-live, non-canonical until accepted by CONTROL_THREAD. No passalong ingestion, repo sync, validation execution, API/DB reads, telemetry, or customer data.",
  source_refs: [
    "docs/reference/CONTROL_THREAD_PORTFOLIO_ROUTING_PROTOCOL_V0.md",
    "docs/plans/CONTROL_THREAD_TO_JAI_NEXUS_OPERATING_MODEL_MIGRATION_PLAN_V0.md",
    "docs/plans/jai-workbench-product-boundary-inception-v0.md",
  ],
  non_authorizations: [
    "no live status",
    "no API/DB behavior",
    "no passalong auto-ingestion",
    "no provider/model dispatch",
    "no runtime execution",
    "no branch/PR automation",
    "no browser/desktop control",
    "no telemetry",
    "no customer data handling",
    "not canonical until CONTROL_THREAD accepts it",
  ],
  batches: [
    {
      batch_id: "q2m6-static-operating-loop",
      title: "Q2M6 JAI NEXUS Static Operating Loop",
      status: "static_fixture_active",
      summary:
        "Manual portfolio workflow is beginning to move into static local Operator visibility without live ingestion or execution authority.",
      lane_ids: [
        "dev-jai-nexus-portfolio-status-surface-v0",
        "orchestrator-nexus-static-tracker-surfaces",
        "jai-vscode-rename-sweep",
      ],
    },
    {
      batch_id: "q2m6-rename-sweep-remaining",
      title: "Cross-Repo jai-vscode Rename Sweep Remaining Lanes",
      status: "static_fixture_review",
      summary:
        "Remaining repo sweeps are represented as queued fixture lanes only. This page does not route them or update repo state.",
      lane_ids: [
        "audit-nexus-rename-sweep",
        "jai-format-rename-sweep",
        "jai-rename-sweep",
        "jai-edge-rename-sweep",
        "api-nexus-rename-sweep",
        "jai-pilot-rename-sweep",
      ],
    },
  ],
  lanes: [
    {
      lane_id: "dev-jai-nexus-portfolio-status-surface-v0",
      repo: "dev-jai-nexus",
      title: "Operator Portfolio Status Surface v0",
      status: "active",
      scope: "Local static Operator UI backed by checked-in fixture data.",
      branch: "impl/q2m6-operator-portfolio-status-surface-v0",
      artifact: "portal/src/app/operator/portfolio-status/page.tsx",
      active_work: [
        "Add checked-in portfolio fixture.",
        "Render read-only Operator status surface.",
        "Preserve non-live and non-canonical labels.",
      ],
      risks: [
        "Static fixture may stale after CONTROL_THREAD decisions.",
        "Surface could be mistaken for live repo status without banners.",
      ],
      next_prompts: ["CONTROL_THREAD review/acceptance prompt"],
    },
    {
      lane_id: "orchestrator-nexus-static-tracker-surfaces",
      repo: "orchestrator-nexus",
      title: "Static portfolio artifact generator / tracker surfaces",
      status: "queued",
      scope: "Tracker and artifact surfaces remain repo-local planning context.",
      branch: "not routed in this fixture",
      artifact: "orchestrator-nexus docs/reference tracker artifacts",
      queued_work: ["Future tracker surface follow-up if CONTROL_THREAD routes it."],
      risks: ["Tracker context could be mistaken for live automation."],
      next_prompts: ["Route only after CONTROL_THREAD accepts static UI posture."],
    },
    {
      lane_id: "jai-vscode-rename-sweep",
      repo: "jai-vscode",
      title: "Repo-local rename sweep",
      status: "completed",
      scope: "Repo-local README and documentation rename sweep accepted.",
      branch: "completed upstream",
      artifact: "jai-vscode docs sweep closeout",
      active_work: ["Completed and accepted before this static fixture."],
      risks: ["Downstream repos may still carry historical old-name references."],
      next_prompts: ["Continue remaining queued rename sweeps."],
    },
    {
      lane_id: "audit-nexus-rename-sweep",
      repo: "audit-nexus",
      title: "jai-vscode rename reference sweep",
      status: "queued",
      scope: "Docs/reference sweep for old VS Code repo identity.",
      branch: "not yet routed",
      artifact: "audit-nexus docs/reference TBD",
      queued_work: ["Sweep active docs/reference content."],
      risks: ["Audit history may contain legitimate old-name evidence."],
      next_prompts: ["Route audit-nexus rename sweep prompt."],
    },
    {
      lane_id: "jai-format-rename-sweep",
      repo: "jai-format",
      title: "jai-vscode rename reference sweep",
      status: "queued",
      scope: "Docs/reference sweep for packet and .jai representation references.",
      branch: "not yet routed",
      artifact: "jai-format docs/reference TBD",
      queued_work: ["Sweep active docs/reference content."],
      risks: ["Grammar examples may include historical names."],
      next_prompts: ["Route jai-format rename sweep prompt."],
    },
    {
      lane_id: "jai-rename-sweep",
      repo: "jai",
      title: "jai-vscode rename reference sweep",
      status: "queued",
      scope: "Docs/reference sweep for substrate and reasoning references.",
      branch: "not yet routed",
      artifact: "jai docs/reference TBD",
      queued_work: ["Sweep active docs/reference content."],
      risks: ["Reasoning examples may preserve historical wording."],
      next_prompts: ["Route jai rename sweep prompt."],
    },
    {
      lane_id: "jai-edge-rename-sweep",
      repo: "jai-edge",
      title: "jai-vscode rename reference sweep",
      status: "queued",
      scope: "Docs/reference sweep for edge evidence references.",
      branch: "not yet routed",
      artifact: "jai-edge docs/reference TBD",
      queued_work: ["Sweep active docs/reference content."],
      risks: ["Edge evidence should not imply IDE runtime integration."],
      next_prompts: ["Route jai-edge rename sweep prompt."],
    },
    {
      lane_id: "api-nexus-rename-sweep",
      repo: "api-nexus",
      title: "jai-vscode rename reference sweep",
      status: "queued",
      scope: "Docs/reference sweep for API/interface boundary references.",
      branch: "not yet routed",
      artifact: "api-nexus docs/reference TBD",
      queued_work: ["Sweep active docs/reference content."],
      risks: ["API references must not imply runtime Toolchain integration."],
      next_prompts: ["Route api-nexus rename sweep prompt."],
    },
    {
      lane_id: "jai-pilot-rename-sweep",
      repo: "jai-pilot",
      title: "jai-vscode rename reference sweep",
      status: "held",
      scope: "Browser/extension lane remains held; rename sweep should stay docs-only.",
      branch: "not yet routed",
      artifact: "jai-pilot docs/reference TBD",
      queued_work: ["Sweep active docs/reference content if CONTROL_THREAD unholds lane."],
      risks: ["Browser/desktop control remains explicitly unauthorized."],
      next_prompts: ["Route only if CONTROL_THREAD releases held posture."],
    },
  ],
  active_work: [
    "dev-jai-nexus Operator Portfolio Status Surface v0",
    "manual CONTROL_THREAD review of fixture-backed status wording",
  ],
  queued_work: [
    "audit-nexus rename sweep",
    "jai-format rename sweep",
    "jai rename sweep",
    "jai-edge rename sweep",
    "api-nexus rename sweep",
  ],
  deferred_work: [
    "standalone jai-workbench repo creation",
    "runtime Toolchain integration",
    "provider/model dispatch",
    "branch/PR automation",
    "browser/desktop control",
    "customer or production workload authority",
  ],
  risks: [
    "Static fixture may stale.",
    "Surface could be mistaken for live status.",
    "Repo-lane status is not canon until CONTROL_THREAD accepts it.",
    "Queued lanes may change order after cross-repo reconciliation.",
  ],
  next_prompts: [
    "CONTROL_THREAD acceptance/review prompt for Operator Portfolio Status Surface v0.",
    "Next repo sweep prompt for audit-nexus or jai-format.",
    "Static surface closeout prompt after validation.",
  ],
};

function cloneLane(lane: PortfolioStatusLane): PortfolioStatusLane {
  return {
    ...lane,
    active_work: [...(lane.active_work ?? [])],
    queued_work: [...(lane.queued_work ?? [])],
    deferred_work: [...(lane.deferred_work ?? [])],
    risks: [...(lane.risks ?? [])],
    next_prompts: [...(lane.next_prompts ?? [])],
  };
}

export function getPortfolioStatusFixture(): PortfolioStatusFixture {
  return {
    ...portfolioStatusFixture,
    source_refs: [...portfolioStatusFixture.source_refs],
    non_authorizations: [...portfolioStatusFixture.non_authorizations],
    batches: portfolioStatusFixture.batches.map((batch) => ({
      ...batch,
      lane_ids: [...batch.lane_ids],
    })),
    lanes: portfolioStatusFixture.lanes.map(cloneLane),
    active_work: [...portfolioStatusFixture.active_work],
    queued_work: [...portfolioStatusFixture.queued_work],
    deferred_work: [...portfolioStatusFixture.deferred_work],
    risks: [...portfolioStatusFixture.risks],
    next_prompts: [...portfolioStatusFixture.next_prompts],
  };
}
