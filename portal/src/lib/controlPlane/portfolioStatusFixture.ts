export type PortfolioLaneStatus =
  | "active"
  | "queued"
  | "completed"
  | "deferred"
  | "held"
  | "blocked";

export interface PortfolioStatusSummary {
  generated_label: string;
  status_note: string;
  active_work: string[];
  queued_work: string[];
  deferred_work: string[];
}

export interface PortfolioStatusLaneCard {
  lane_id: string;
  repo: string;
  display_title: string;
  status: PortfolioLaneStatus | string;
  scope: string;
  branch: string;
  artifact: string;
  active_work?: string[];
  queued_work?: string[];
  deferred_work?: string[];
  risks?: string[];
  next_prompts?: string[];
}

export interface PortfolioStatusBatchSummary {
  batch_id: string;
  display_title: string;
  status: "static_fixture_active" | "static_fixture_review" | "static_fixture_closed" | string;
  summary: string;
  lane_ids: string[];
}

export interface PortfolioRiskSummary {
  risks: string[];
}

export interface StaticBaselineMetadata {
  status_date: string;
  artifact_version: string;
  read_model_version: string;
  handoff_manifest_path: string;
  source_baseline_note: string;
  checksum: string;
  checksum_algorithm: string;
  checksum_scope: string;
  checksum_integrity_note?: string;
}

export interface PortfolioStatusFixture {
  display_title: string;
  authority_boundary_label: string;
  static_baseline_metadata: StaticBaselineMetadata;
  status_summary: PortfolioStatusSummary;
  batch_summaries: PortfolioStatusBatchSummary[];
  lane_cards: PortfolioStatusLaneCard[];
  risk_summary: PortfolioRiskSummary;
  next_prompts: string[];
  source_refs: string[];
  non_authorizations: string[];
}

const portfolioStatusFixture: PortfolioStatusFixture = {
  display_title: "Operator Portfolio Status",
  authority_boundary_label:
    "Static local fixture only. Non-live and non-canonical unless accepted by CONTROL_THREAD.",
  static_baseline_metadata: {
    status_date: "2026-06-06",
    artifact_version: "q2m6-static-status-handoff-bundle-v0",
    read_model_version: "q2m6-portfolio-status-ui-read-model-v0",
    handoff_manifest_path:
      "orchestrator-nexus/generated/portfolio-status/handoff/q2m6-static-status-handoff-bundle-v0/manifest.json",
    source_baseline_note:
      "Manual checked-in fixture refresh from accepted Q2M6 static status baseline. The upstream handoff path is source context only and is not fetched or connected.",
    checksum: "q2m6-static-status-handoff-bundle-v0-local-integrity-baseline",
    checksum_algorithm: "static-baseline-token",
    checksum_scope:
      "Documentary local parity token for the accepted Q2M6 static handoff baseline; not a cryptographic digest.",
    checksum_integrity_note:
      "Local fixture stores a documentary integrity token for parity checks. Cryptographic artifact integrity remains manual-review only unless a future routed baseline supplies a digest.",
  },
  status_summary: {
    generated_label: "Q2M6 refreshed static checked-in fixture, 2026-06-06",
    status_note:
      "Static local fixture only. Non-live, non-canonical until accepted by CONTROL_THREAD. No passalong ingestion, repo sync, validation execution, API/DB reads, telemetry, or customer data.",
    active_work: [
      "dev-jai-nexus Operator Portfolio Fixture Refresh from Static Baseline v0",
      "manual CONTROL_THREAD review of refreshed fixture-backed status wording",
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
  },
  source_refs: [
    "docs/reference/CONTROL_THREAD_PORTFOLIO_ROUTING_PROTOCOL_V0.md",
    "docs/plans/CONTROL_THREAD_TO_JAI_NEXUS_OPERATING_MODEL_MIGRATION_PLAN_V0.md",
    "docs/plans/jai-workbench-product-boundary-inception-v0.md",
    "docs/plans/operator-portfolio-status-fixture-maintenance-v0.md",
    "orchestrator-nexus/generated/portfolio-status/q2m6-portfolio-status-ui-read-model-v0.json (manual reference only; not fetched)",
  ],
  non_authorizations: [
    "no live status",
    "no API/DB behavior",
    "no orchestrator-nexus connection",
    "no remote artifact fetch",
    "no passalong auto-ingestion",
    "no provider/model dispatch",
    "no runtime execution",
    "no branch/PR automation",
    "no browser/desktop control",
    "no telemetry",
    "no customer data handling",
    "not canonical until CONTROL_THREAD accepts it",
  ],
  batch_summaries: [
    {
      batch_id: "q2m6-static-operating-loop",
      display_title: "Q2M6 JAI NEXUS Static Operating Loop",
      status: "static_fixture_active",
      summary:
        "Manual portfolio workflow is represented in static local Operator visibility using checked-in fixture data only. Surface hardening, read-model alignment, and lint cleanup are accepted baseline context; fixture refresh remains manual and reviewable.",
      lane_ids: [
        "dev-jai-nexus-portfolio-status-surface-v0",
        "dev-jai-nexus-portfolio-status-hardening-v0",
        "dev-jai-nexus-read-model-alignment-v0",
        "dev-jai-nexus-ui-lint-cleanup-v0",
        "dev-jai-nexus-fixture-refresh-v0",
        "orchestrator-nexus-ui-read-model-v0",
        "jai-vscode-rename-sweep",
      ],
    },
    {
      batch_id: "q2m6-rename-sweep-remaining",
      display_title: "Cross-Repo jai-vscode Rename Sweep Remaining Lanes",
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
  lane_cards: [
    {
      lane_id: "dev-jai-nexus-portfolio-status-surface-v0",
      repo: "dev-jai-nexus",
      display_title: "Operator Portfolio Status Surface v0",
      status: "completed",
      scope: "Accepted local static Operator UI backed by checked-in fixture data.",
      branch: "impl/q2m6-operator-portfolio-status-surface-v0",
      artifact: "portal/src/app/operator/portfolio-status/page.tsx",
      active_work: [
        "Checked-in portfolio fixture added.",
        "Read-only Operator status surface rendered.",
        "Non-live and non-canonical labels preserved.",
      ],
      risks: [
        "Static fixture may stale after CONTROL_THREAD decisions.",
        "Surface could be mistaken for live repo status without banners.",
      ],
      next_prompts: ["Use accepted surface as baseline for manual fixture refresh lanes."],
    },
    {
      lane_id: "dev-jai-nexus-portfolio-status-hardening-v0",
      repo: "dev-jai-nexus",
      display_title: "Operator Portfolio Status Surface Hardening v0",
      status: "completed",
      scope: "Local static UI hardening for defensive fixture rendering and explicit static posture labels.",
      branch: "impl/q2m6-operator-portfolio-status-surface-hardening-v0",
      artifact: "portal/src/app/operator/portfolio-status/page.tsx",
      active_work: ["Completed and accepted as static/local UI hardening baseline."],
      risks: ["Hardening does not make fixture data live or canonical."],
      next_prompts: ["Preserve safe empty-state behavior during fixture refreshes."],
    },
    {
      lane_id: "dev-jai-nexus-read-model-alignment-v0",
      repo: "dev-jai-nexus",
      display_title: "Operator Portfolio Status Read Model Alignment v0",
      status: "completed",
      scope: "Local fixture shape aligned to UI read-model-oriented fields where practical.",
      branch: "impl/q2m6-operator-portfolio-status-read-model-alignment-v0",
      artifact: "portal/src/lib/controlPlane/portfolioStatusFixture.ts",
      active_work: ["Completed and accepted as fixture shape baseline."],
      risks: ["Read-model alignment could be mistaken for orchestrator ingestion."],
      next_prompts: ["Keep future updates manual and checked in locally."],
    },
    {
      lane_id: "dev-jai-nexus-ui-lint-cleanup-v0",
      repo: "dev-jai-nexus",
      display_title: "Q2M6 UI Validation Friction Repo-Wide Lint Cleanup v0",
      status: "completed",
      scope: "Repo-wide UI lint cleanup completed with behavior-preserving type/import/hook/navigation fixes.",
      branch: "chore/q2m6-ui-lint-cleanup-v0",
      artifact: "portal lint/typecheck/build validation baseline",
      active_work: ["Repo-wide lint, typecheck, build, and diff whitespace validation passed."],
      risks: ["Loose JSON/YAML panel data typing remains review-sensitive despite lint cleanup."],
      next_prompts: ["Use clean validation baseline for fixture refresh closeout."],
    },
    {
      lane_id: "dev-jai-nexus-fixture-refresh-v0",
      repo: "dev-jai-nexus",
      display_title: "Operator Portfolio Fixture Refresh from Static Baseline v0",
      status: "active",
      scope: "Manual checked-in refresh of local portfolio status fixture from accepted Q2M6 static status baseline.",
      branch: "impl/q2m6-operator-portfolio-status-fixture-refresh-v0",
      artifact: "portal/src/lib/controlPlane/portfolioStatusFixture.ts",
      active_work: [
        "Refresh display title, status summary, batch summaries, lane cards, risk summary, and next prompts.",
        "Preserve static/local/fixture-backed/non-live/non-canonical posture.",
      ],
      risks: [
        "Fixture refresh can become stale after CONTROL_THREAD changes.",
        "Manual source refs may be mistaken for live imports.",
      ],
      next_prompts: ["CONTROL_THREAD review/accept fixture refresh closeout."],
    },
    {
      lane_id: "orchestrator-nexus-ui-read-model-v0",
      repo: "orchestrator-nexus",
      display_title: "Portfolio Status UI Read Model v0",
      status: "completed",
      scope: "External repo produces a UI-facing read model; dev-jai-nexus references its shape manually without connecting to it.",
      branch: "completed upstream",
      artifact: "generated/portfolio-status/q2m6-portfolio-status-ui-read-model-v0.json",
      active_work: ["Completed as external static read-model reference context."],
      risks: ["External read model could be mistaken for live sync or direct ingestion."],
      next_prompts: ["Keep dev-jai-nexus fixture updates manual and checked in locally."],
    },
    {
      lane_id: "jai-vscode-rename-sweep",
      repo: "jai-vscode",
      display_title: "Repo-local rename sweep",
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
      display_title: "jai-vscode rename reference sweep",
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
      display_title: "jai-vscode rename reference sweep",
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
      display_title: "jai-vscode rename reference sweep",
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
      display_title: "jai-vscode rename reference sweep",
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
      display_title: "jai-vscode rename reference sweep",
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
      display_title: "jai-vscode rename reference sweep",
      status: "held",
      scope: "Browser/extension lane remains held; rename sweep should stay docs-only.",
      branch: "not yet routed",
      artifact: "jai-pilot docs/reference TBD",
      queued_work: ["Sweep active docs/reference content if CONTROL_THREAD unholds lane."],
      risks: ["Browser/desktop control remains explicitly unauthorized."],
      next_prompts: ["Route only if CONTROL_THREAD releases held posture."],
    },
  ],
  risk_summary: {
    risks: [
      "Static fixture may stale.",
      "Surface could be mistaken for live status.",
      "Repo-lane status is not canon until CONTROL_THREAD accepts it.",
      "Queued lanes may change order after cross-repo reconciliation.",
      "External read-model references may be mistaken for live ingestion.",
      "Accepted validation baseline may drift after future unrelated UI changes.",
    ],
  },
  next_prompts: [
    "CONTROL_THREAD acceptance/review prompt for Operator Portfolio Fixture Refresh from Static Baseline v0.",
    "Next repo sweep prompt for audit-nexus or jai-format.",
    "Static fixture closeout prompt after validation.",
  ],
};

function cloneLane(lane: PortfolioStatusLaneCard): PortfolioStatusLaneCard {
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
    static_baseline_metadata: { ...portfolioStatusFixture.static_baseline_metadata },
    status_summary: {
      ...portfolioStatusFixture.status_summary,
      active_work: [...portfolioStatusFixture.status_summary.active_work],
      queued_work: [...portfolioStatusFixture.status_summary.queued_work],
      deferred_work: [...portfolioStatusFixture.status_summary.deferred_work],
    },
    source_refs: [...portfolioStatusFixture.source_refs],
    non_authorizations: [...portfolioStatusFixture.non_authorizations],
    batch_summaries: portfolioStatusFixture.batch_summaries.map((batch) => ({
      ...batch,
      lane_ids: [...batch.lane_ids],
    })),
    lane_cards: portfolioStatusFixture.lane_cards.map(cloneLane),
    risk_summary: {
      ...portfolioStatusFixture.risk_summary,
      risks: [...portfolioStatusFixture.risk_summary.risks],
    },
    next_prompts: [...portfolioStatusFixture.next_prompts],
  };
}
