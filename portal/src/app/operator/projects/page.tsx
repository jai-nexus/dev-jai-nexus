export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";

import { getJaiProjectRegistryFixture } from "@/lib/projects/jaiProjectRegistryFixture";
import type {
  JaiProjectMetric,
  JaiProjectRegistryEntry,
  JaiProjectState,
} from "@/lib/projects/jaiProjectTypes";

const FALLBACK_TEXT = "Not recorded in the checked-in fixture.";

function safeText(value: string | undefined, fallback = FALLBACK_TEXT) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function safeArray<T>(items: T[] | undefined) {
  return Array.isArray(items) ? items : [];
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

function stateTone(state: JaiProjectState): "amber" | "emerald" | "slate" {
  if (state === "active") return "emerald";
  if (state === "frozen") return "amber";
  return "slate";
}

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

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-black/30 p-3 text-sm text-gray-500">
      No {label} recorded in the checked-in fixture.
    </div>
  );
}

function TextList({ items, label }: { items?: string[]; label: string }) {
  const safeItems = safeArray(items).filter((item) => item.trim().length > 0);

  if (safeItems.length === 0) {
    return <EmptyState label={label} />;
  }

  return (
    <ul className="space-y-1 text-sm text-gray-300">
      {safeItems.map((item, index) => (
        <li key={`${label}-${index}`}>- {item}</li>
      ))}
    </ul>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
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

function MetricCard({ metric }: { metric: JaiProjectMetric }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-black/30 p-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">
        {safeText(metric.label, "metric")}
      </div>
      <div className="mt-2 text-xl font-semibold text-gray-100">
        {safeText(metric.value, "none")}
      </div>
      <p className="mt-2 text-xs text-gray-400">{safeText(metric.detail)}</p>
    </div>
  );
}

function ProjectCard({ project }: { project: JaiProjectRegistryEntry }) {
  const metrics = safeArray(project.custom_metrics);
  const agentLanes = safeArray(project.agent_lanes);

  return (
    <article className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-100">{safeText(project.name)}</h3>
            <ToneBadge tone={stateTone(project.state)}>{project.state}</ToneBadge>
            <ToneBadge tone="slate">{safeText(project.project_id)}</ToneBadge>
          </div>
          <p className="max-w-5xl text-sm text-gray-300">{safeText(project.objective)}</p>
        </div>
        <div className="font-mono text-xs text-gray-500">{safeText(project.nhid)}</div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-800 bg-black/30 p-4">
        <div className="text-[11px] uppercase tracking-wide text-gray-500">Status summary</div>
        <p className="mt-2 text-sm text-gray-300">{safeText(project.status_summary)}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {metrics.length === 0 ? (
          <EmptyState label="custom metrics" />
        ) : (
          metrics.map((metric) => (
            <MetricCard key={`${project.project_id}-${metric.label}`} metric={metric} />
          ))
        )}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">Canon summary</div>
          <p className="mt-2 text-sm text-gray-300">{safeText(project.canon_summary)}</p>
        </div>
        <div className="rounded-lg border border-amber-900 bg-amber-950/30 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[11px] uppercase tracking-wide text-amber-300">
              Council posture
            </div>
            <ToneBadge tone="amber">representational only</ToneBadge>
          </div>
          <p className="mt-2 text-sm text-amber-100">
            {safeText(project.council_posture.summary)}
          </p>
          <p className="mt-2 text-xs text-amber-200/80">
            {safeText(project.council_posture.representational_note)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Open questions</div>
          <TextList items={project.open_questions} label="open questions" />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Deferred ideas</div>
          <TextList items={project.deferred_ideas} label="deferred ideas" />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Linked repos</div>
          <TextList items={project.linked_repos} label="linked repos" />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Next prompts</div>
          <TextList items={project.next_prompts} label="next prompts" />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-sky-900 bg-sky-950/30 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-sky-100">Agent lanes</h4>
          <ToneBadge tone="sky">representational only</ToneBadge>
        </div>
        {agentLanes.length === 0 ? (
          <div className="mt-3">
            <EmptyState label="agent lanes" />
          </div>
        ) : (
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {agentLanes.map((lane) => (
              <div key={lane.lane_id} className="rounded-lg border border-sky-900 bg-black/30 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-sky-100">{safeText(lane.label)}</span>
                  <ToneBadge tone="slate">{safeText(lane.status, "unknown")}</ToneBadge>
                </div>
                <p className="mt-2 text-xs text-sky-100/80">{safeText(lane.summary)}</p>
                <p className="mt-2 text-xs text-gray-400">{safeText(lane.authority_boundary)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-rose-900 bg-rose-950/30 p-4 text-sm text-rose-100">
        {safeText(project.authority_boundary)}
      </div>
    </article>
  );
}

function ProjectSection({
  title,
  description,
  projects,
}: {
  title: string;
  description: string;
  projects: JaiProjectRegistryEntry[];
}) {
  return (
    <Section title={title} description={description}>
      {projects.length === 0 ? (
        <EmptyState label={title.toLowerCase()} />
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      )}
    </Section>
  );
}

export default function ProjectsPage() {
  const fixture = getJaiProjectRegistryFixture();
  const projects = safeArray(fixture.projects);
  const activeProjects = projects.filter((project) => project.state === "active");
  const frozenProjects = projects.filter((project) => project.state === "frozen");
  const archivedProjects = projects.filter((project) => project.state === "archived");
  const metricCount = projects.reduce(
    (count, project) => count + safeArray(project.custom_metrics).length,
    0,
  );

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">JAI Project Registry</h1>
            <ToneBadge tone="amber">static</ToneBadge>
            <ToneBadge tone="sky">local</ToneBadge>
            <ToneBadge tone="slate">fixture-backed</ToneBadge>
            <ToneBadge tone="rose">non-live</ToneBadge>
            <ToneBadge tone="amber">non-canonical unless accepted</ToneBadge>
          </div>
          <p className="max-w-5xl text-sm text-gray-400">
            Operator Control Plane surface for static JAI Project objects:
            objective, custom metrics, canon summary, Council posture, Agent
            lanes, authority boundary, and next prompts.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-200">
            {safeText(fixture.authority_boundary_label)}
          </div>
          <div className="rounded-xl border border-amber-800 bg-amber-950/40 p-4 text-sm text-amber-100">
            {safeText(fixture.status_note)}
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Projects"
            value={projects.length}
            detail={safeText(fixture.generated_label)}
          />
          <SummaryCard
            label="Active"
            value={activeProjects.length}
            detail="Static fixture count only; not live project state."
          />
          <SummaryCard
            label="Frozen"
            value={frozenProjects.length}
            detail="Frozen entries remain planning context only."
          />
          <SummaryCard
            label="Archived"
            value={archivedProjects.length}
            detail="Empty archives degrade to a safe empty state."
          />
          <SummaryCard
            label="Metrics"
            value={metricCount}
            detail="Custom metrics are representational fixture fields."
          />
        </section>

        <ProjectSection
          title="Active Projects"
          description="Active JAI Project entries from checked-in local fixture data."
          projects={activeProjects}
        />

        <ProjectSection
          title="Frozen Projects"
          description="Frozen or held project entries shown as planning context only."
          projects={frozenProjects}
        />

        <ProjectSection
          title="Archived Projects"
          description="Archived entries are optional; absence is handled as a safe empty state."
          projects={archivedProjects}
        />

        <section className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-gray-100">Explicit Non-Authorizations</h2>
            <ToneBadge tone="rose">display only</ToneBadge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {safeArray(fixture.non_authorizations).length === 0 ? (
              <EmptyState label="non-authorizations" />
            ) : (
              safeArray(fixture.non_authorizations).map((item, index) => (
                <div
                  key={`non-authorization-${index}`}
                  className="rounded-lg border border-gray-800 bg-black/30 p-3 text-sm text-gray-300"
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
