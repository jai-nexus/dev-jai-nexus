export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";

import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";
import { getRootOperatorOverview } from "@/lib/controlPlane/rootOperatorOverview";
import { formatCentral, formatCentralTooltip } from "@/lib/time";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-medium text-gray-100">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-100">{value}</div>
      <p className="mt-2 text-sm text-gray-400">{detail}</p>
    </div>
  );
}

function ToneBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "sky" | "amber" | "emerald" | "rose" | "slate";
}) {
  const toneClass =
    tone === "sky"
      ? "border-sky-800 bg-sky-950 text-sky-200"
      : tone === "amber"
        ? "border-amber-800 bg-amber-950 text-amber-200"
        : tone === "emerald"
          ? "border-emerald-800 bg-emerald-950 text-emerald-200"
          : tone === "rose"
            ? "border-rose-800 bg-rose-950 text-rose-200"
            : "border-gray-800 bg-zinc-900 text-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function formatTimestamp(value: Date | null): string {
  if (!value) return "none recorded";
  return formatCentralTooltip(value);
}

export default async function HomePage() {
  const overview = await getRootOperatorOverview();
  const authority = getControlPlaneAuthorityPosture();

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">JAI NEXUS - dev.jai.nexus</h1>
            <ToneBadge tone="sky">operator control plane overview</ToneBadge>
            <ToneBadge tone="amber">read-only / display-only</ToneBadge>
            <ToneBadge tone="rose">execution disabled</ToneBadge>
          </div>
          <p className="max-w-4xl text-sm text-gray-400">
            Front-door overview for the dev.jai.nexus control plane. Root now leads
            with motion, agenda, registry, agent, authority, and freshness posture
            instead of centering Sync Runs as if they were a live heartbeat.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              This surface stays read-only. No provider/model calls, no execution,
              no branch write, no PR proposal, no scheduler, and no mutation
              authority is introduced here.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Latest bundled motion"
            value={overview.bundled_motion_snapshot.latest_motion_id ?? "none"}
            detail={`Bundled snapshot currently includes ${overview.bundled_motion_snapshot.motion_count} motions and is sourced ${overview.bundled_motion_snapshot.live_source_mode}.`}
          />
          <SummaryCard
            label="Deterministic agenda"
            value={String(overview.deterministic_agenda.total_items)}
            detail={`${overview.deterministic_agenda.ready_for_review} ready for review, ${overview.deterministic_agenda.blocked + overview.deterministic_agenda.deferred} blocked or deferred.`}
          />
          <SummaryCard
            label="Loop-through candidate"
            value={overview.first_official_loop_candidate.selected_work_packet_id}
            detail="First official agenda-to-deliberation-to-passalong proof candidate."
          />
          <SummaryCard
            label="Operator JAI"
            value="draft-only"
            detail="Static, read-only JAI control-plane shell with visible blocked authority posture."
          />
          <SummaryCard
            label="Repo registry"
            value={String(overview.repo_registry.repo_count)}
            detail={`${overview.repo_registry.configured_scope_count} configured scope keys remain a curated subset.`}
          />
        </section>

        <Section
          title="Control-Plane Overview"
          description="Read-only status cards summarizing current motion, agenda, registry, agent, and authority posture."
        >
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Motion snapshot posture</h3>
                <ToneBadge tone="emerald">
                  {overview.bundled_motion_snapshot.latest_motion_queue_state ?? "unknown"}
                </ToneBadge>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li>- latest bundled motion: {overview.bundled_motion_snapshot.latest_motion_id ?? "none"}</li>
                <li>- title: {overview.bundled_motion_snapshot.latest_motion_title ?? "none"}</li>
                <li>- bundled motion count: {overview.bundled_motion_snapshot.motion_count}</li>
                <li>- snapshot generated: {overview.bundled_motion_snapshot.generated_at}</li>
                <li>- live source mode: {overview.bundled_motion_snapshot.live_source_mode}</li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Deterministic agenda posture</h3>
                <ToneBadge tone="amber">planning/review only</ToneBadge>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li>- agenda items: {overview.deterministic_agenda.total_items}</li>
                <li>- target repos: {overview.deterministic_agenda.target_repo_count}</li>
                <li>- target surfaces: {overview.deterministic_agenda.target_surface_count}</li>
                <li>- action coverage: {overview.deterministic_agenda.action_coverage_count}</li>
                <li>- settled items: {overview.deterministic_agenda.settled}</li>
              </ul>
              <p className="mt-3 text-xs text-gray-400">{overview.deterministic_agenda.note}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Operator JAI entry point</h3>
                <ToneBadge tone="sky">{overview.operator_jai.posture}</ToneBadge>
              </div>
              <p className="mt-3 text-sm text-gray-300">{overview.operator_jai.note}</p>
              <Link
                href={overview.operator_jai.href}
                className="mt-4 inline-flex text-sm font-medium text-sky-300 underline"
              >
                Open /operator/jai
              </Link>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">First official loop-through candidate</h3>
                <ToneBadge tone="amber">deterministic</ToneBadge>
                <ToneBadge tone="rose">copy-only routing</ToneBadge>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li>- packet: {overview.first_official_loop_candidate.selected_work_packet_id}</li>
                <li>- title: {overview.first_official_loop_candidate.title}</li>
                <li>- status: {overview.first_official_loop_candidate.selected_status_label}</li>
                <li>- agent: {overview.first_official_loop_candidate.assigned_agent_label}</li>
                <li>- canonical role: {overview.first_official_loop_candidate.canonical_role_label}</li>
                <li>- repo: {overview.first_official_loop_candidate.target_repo_full_name}</li>
                <li>- surface: {overview.first_official_loop_candidate.target_surface_label}</li>
                <li>- next target: {overview.first_official_loop_candidate.routing_target}</li>
              </ul>
              <p className="mt-3 text-xs text-gray-400">{overview.first_official_loop_candidate.summary}</p>
              <p className="mt-3 text-xs text-gray-400">{overview.first_official_loop_candidate.selection_reason}</p>
              <p className="mt-3 text-xs text-gray-400">
                Validation gate: {overview.first_official_loop_candidate.validation_gate}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Human decision: {overview.first_official_loop_candidate.human_decision_gate}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <Link href="/operator/work" className="text-sky-300 underline">
                  Open /operator/work
                </Link>
                <Link href="/operator/deliberation" className="text-sky-300 underline">
                  Open /operator/deliberation
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Registry posture</h3>
                <ToneBadge tone="sky">{overview.repo_registry.repo_count} repos</ToneBadge>
                <ToneBadge tone="amber">{overview.project_registry.project_count} projects</ToneBadge>
              </div>
              <p className="mt-3 text-sm text-gray-300">{overview.repo_registry.note}</p>
              <p className="mt-3 text-xs text-gray-400">{overview.project_registry.note}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {overview.project_registry.project_ids.map((projectId) => (
                  <ToneBadge key={projectId} tone="slate">
                    {projectId}
                  </ToneBadge>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Agent posture</h3>
                <ToneBadge tone="emerald">
                  {overview.agents.canonical_active_count} canonical
                </ToneBadge>
                <ToneBadge tone="amber">
                  {overview.agents.palette_draft_count} palette drafts
                </ToneBadge>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li>- execution lane: {overview.agents.execution_lane_count}</li>
                <li>- governance lane: {overview.agents.governance_lane_count}</li>
                <li>- registry/model unchanged in this seam</li>
              </ul>
              <p className="mt-3 text-xs text-gray-400">{overview.agents.note}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Authority posture</h3>
                <ToneBadge tone="rose">
                  {overview.authority.blocked_capability_count} blocked capabilities
                </ToneBadge>
              </div>
              <p className="mt-3 text-sm text-gray-300">{overview.authority.note}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ToneBadge tone="rose">execution blocked</ToneBadge>
                <ToneBadge tone="rose">branch_write disabled</ToneBadge>
                <ToneBadge tone="rose">propose_pr disabled</ToneBadge>
                <ToneBadge tone="rose">execute_runtime disabled</ToneBadge>
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Operator Surfaces"
          description="Primary control-plane entry points reachable from the root overview."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overview.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-xl border border-gray-800 bg-zinc-950 p-4 transition-colors hover:border-sky-500/70 hover:bg-zinc-900/60"
              >
                <div className="text-sm font-semibold text-gray-100">{link.label}</div>
                <p className="mt-2 text-sm text-gray-400">{link.summary}</p>
                <div className="mt-3 text-xs text-sky-300 group-hover:underline">
                  Open {link.href}
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section
          title="Telemetry Freshness Notes"
          description="Current read-only posture for Events, Sync Runs, and Decisions without implying live comprehensive telemetry."
        >
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Events</h3>
                <ToneBadge tone="amber">partial stream</ToneBadge>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li>- total events: {overview.telemetry.events.count}</li>
                <li>- latest event: {formatTimestamp(overview.telemetry.events.latest_at)}</li>
                <li>- latest kind: {overview.telemetry.events.latest_kind ?? "none"}</li>
                <li>- latest source: {overview.telemetry.events.latest_source ?? "none"}</li>
              </ul>
              <p className="mt-3 text-xs text-gray-400">{overview.telemetry.events.note}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Sync Runs</h3>
                <ToneBadge tone="amber">legacy review feed</ToneBadge>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li>- total sync runs: {overview.telemetry.sync_runs.count}</li>
                <li>- latest sync run: {formatTimestamp(overview.telemetry.sync_runs.latest_at)}</li>
                <li>- long-term root role: no longer SyncRun-first</li>
              </ul>
              <p className="mt-3 text-xs text-gray-400">{overview.telemetry.sync_runs.note}</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">Decisions</h3>
                <ToneBadge tone="slate">manual extraction</ToneBadge>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li>- total decisions: {overview.telemetry.decisions.count}</li>
                <li>- latest extracted decision: {formatTimestamp(overview.telemetry.decisions.latest_at)}</li>
              </ul>
              <p className="mt-3 text-xs text-gray-400">{overview.telemetry.decisions.note}</p>
            </div>
          </div>
        </Section>

        <Section
          title="Disabled Authority"
          description="Read-only boundary reminders pulled from the current control-plane authority model."
        >
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <ul className="space-y-2 text-sm text-gray-300">
                {authority.notes.map((note) => (
                  <li key={note}>- {note}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Blocked capabilities
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {authority.blocked_capabilities.map((capability) => (
                  <ToneBadge key={capability} tone="rose">
                    {capability}
                  </ToneBadge>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Legacy SyncRun Review Feed"
          description="Compact legacy/review surface only. Sync Runs remain sparse agent-edit and sync artifacts, not a full repo heartbeat."
        >
          {overview.telemetry.sync_runs.recent_runs.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-400">
              No SyncRun rows are currently recorded.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-zinc-950">
              <table className="w-full border-collapse text-sm">
                <thead className="border-b border-gray-800 bg-black/20 text-left">
                  <tr>
                    <th className="px-3 py-2 text-xs text-gray-400">When</th>
                    <th className="px-3 py-2 text-xs text-gray-400">Repo</th>
                    <th className="px-3 py-2 text-xs text-gray-400">Type</th>
                    <th className="px-3 py-2 text-xs text-gray-400">Status</th>
                    <th className="px-3 py-2 text-xs text-gray-400">Trigger</th>
                    <th className="px-3 py-2 text-xs text-gray-400">Summary</th>
                    <th className="px-3 py-2 text-xs text-gray-400">Review</th>
                  </tr>
                </thead>
                <tbody suppressHydrationWarning>
                  {overview.telemetry.sync_runs.recent_runs.map((run) => (
                    <tr
                      key={run.id}
                      className="border-b border-gray-900 hover:bg-zinc-900/60"
                    >
                      <td
                        className="whitespace-nowrap px-3 py-2 text-xs"
                        title={formatCentralTooltip(run.started_at)}
                      >
                        {formatCentral(run.started_at)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs">
                        {run.repo_name ?? "none"}
                      </td>
                      <td className="px-3 py-2 text-xs">{run.type}</td>
                      <td className="px-3 py-2 text-xs">{run.status}</td>
                      <td className="px-3 py-2 text-xs">{run.trigger ?? "none"}</td>
                      <td className="max-w-xs truncate px-3 py-2 text-xs">
                        {run.summary ?? "none"}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <Link href={run.review_href} className="text-sky-300 underline">
                          review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}
