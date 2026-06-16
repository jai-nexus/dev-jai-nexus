export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorContradictionCard,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
  type OperatorSlateTone,
} from "@/components/operator/slate";
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

function stateTone(state: JaiProjectState): OperatorSlateTone {
  if (state === "frozen") return "warning";
  if (state === "archived") return "neutral";
  return "fixture";
}

function Section({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <OperatorSectionHeader
        index={index}
        title={title}
        right={<OperatorBadge tone="fixture" label="FIXTURE" />}
      />
      <p className="max-w-5xl text-sm text-slate-400">{description}</p>
      {children}
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-center gap-2">
        <OperatorBadge tone="fixture" label="FIXTURE EMPTY STATE" />
        <span className="text-sm text-slate-500">
          No {label} recorded in the checked-in fixture.
        </span>
      </div>
    </OperatorGateCard>
  );
}

function TextList({ items, label }: { items?: string[]; label: string }) {
  const safeItems = safeArray(items).filter((item) => item.trim().length > 0);

  if (safeItems.length === 0) {
    return <EmptyState label={label} />;
  }

  return (
    <ul className="space-y-1 text-sm text-slate-300">
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
    <OperatorPanel>
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {label}
        </div>
        <OperatorBadge tone="fixture" label="FIXTURE COUNT" />
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold text-slate-100">
        {value}
      </div>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </OperatorPanel>
  );
}

function MetricCard({ metric }: { metric: JaiProjectMetric }) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {safeText(metric.label, "metric")}
        </div>
        <OperatorBadge tone="fixture" label="FIXTURE METRIC" />
      </div>
      <div className="mt-2 font-mono text-xl font-semibold text-slate-100">
        {safeText(metric.value, "none")}
      </div>
      <p className="mt-2 text-xs text-slate-400">{safeText(metric.detail)}</p>
    </OperatorGateCard>
  );
}

function ProjectCard({ project }: { project: JaiProjectRegistryEntry }) {
  const metrics = safeArray(project.custom_metrics);
  const agentLanes = safeArray(project.agent_lanes);

  return (
    <OperatorPanel className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-100">
              {safeText(project.name)}
            </h3>
            <OperatorBadge tone="fixture" label="FIXTURE" />
            <OperatorStatusChip
              status={project.state}
              tone={stateTone(project.state)}
            />
            <OperatorIdChip>{safeText(project.project_id)}</OperatorIdChip>
          </div>
          <p className="max-w-5xl text-sm text-slate-300">
            {safeText(project.objective)}
          </p>
        </div>
        <OperatorIdChip>{safeText(project.nhid)}</OperatorIdChip>
      </div>

      <OperatorGateCard className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Status summary
          </div>
          <OperatorBadge tone="fixture" label="NOT LIVE STATE" />
        </div>
        <p className="mt-2 text-sm text-slate-300">
          {safeText(project.status_summary)}
        </p>
      </OperatorGateCard>

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
        <OperatorGateCard>
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Canon summary
            </div>
            <OperatorBadge tone="fixture" label="FIXTURE CLAIM" />
            <OperatorBadge tone="gated" label="NOT CANON UPDATE" />
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {safeText(project.canon_summary)}
          </p>
        </OperatorGateCard>

        <OperatorGateCard>
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Council posture
            </div>
            <OperatorBadge tone="advisory" label="ADVISORY ONLY" />
            <OperatorBadge tone="fixture" label="FIXTURE" />
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {safeText(project.council_posture.summary)}
          </p>
          <p className="mt-2 text-xs text-amber-300">
            {safeText(project.council_posture.representational_note)}
          </p>
        </OperatorGateCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        <OperatorGateCard>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
            Open questions
          </div>
          <TextList items={project.open_questions} label="open questions" />
        </OperatorGateCard>
        <OperatorGateCard>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
            Deferred ideas
          </div>
          <TextList items={project.deferred_ideas} label="deferred ideas" />
        </OperatorGateCard>
        <OperatorGateCard>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
            Linked repos
          </div>
          <TextList items={project.linked_repos} label="linked repos" />
        </OperatorGateCard>
        <OperatorGateCard>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
            Next prompts
          </div>
          <TextList items={project.next_prompts} label="next prompts" />
        </OperatorGateCard>
      </div>

      <OperatorPanel className="mt-4 border-sky-900 bg-slate-950/50">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-100">Agent lanes</h4>
          <OperatorBadge tone="fixture" label="FIXTURE" />
          <OperatorBadge tone="advisory" label="REPRESENTATIONAL ONLY" />
          <OperatorBadge tone="blocked" label="NO AGENT EXECUTION" />
        </div>
        {agentLanes.length === 0 ? (
          <div className="mt-3">
            <EmptyState label="agent lanes" />
          </div>
        ) : (
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {agentLanes.map((lane) => (
              <OperatorGateCard key={lane.lane_id}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-100">
                    {safeText(lane.label)}
                  </span>
                  <OperatorBadge tone="fixture" label="FIXTURE LANE" />
                  <OperatorStatusChip
                    status={safeText(lane.status, "unknown")}
                    tone={lane.status === "frozen" ? "warning" : "advisory"}
                  />
                  <OperatorIdChip>{safeText(lane.lane_id)}</OperatorIdChip>
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  {safeText(lane.summary)}
                </p>
                <p className="mt-2 text-xs text-red-300">
                  {safeText(lane.authority_boundary)}
                </p>
              </OperatorGateCard>
            ))}
          </div>
        )}
      </OperatorPanel>

      <OperatorContradictionCard className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <OperatorBadge tone="blocked" label="AUTHORITY BOUNDARY" />
          <OperatorBadge tone="fixture" label="FIXTURE RECORD" />
        </div>
        <p className="mt-2 text-sm text-red-200">
          {safeText(project.authority_boundary)}
        </p>
      </OperatorContradictionCard>
    </OperatorPanel>
  );
}

function ProjectSection({
  index,
  title,
  description,
  projects,
}: {
  index: string;
  title: string;
  description: string;
  projects: JaiProjectRegistryEntry[];
}) {
  return (
    <Section index={index} title={title} description={description}>
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
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <OperatorPanel className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="gated" label="NON-AUTHORIZING" />
              <OperatorBadge tone="fixture" label="FIXTURE-BACKED" />
              <OperatorBadge tone="readOnly" label="LOCAL STATIC" />
              <OperatorBadge tone="blocked" label="NON-LIVE" />
              <OperatorBadge tone="blocked" label="NO EXECUTION" />
              <OperatorBadge tone="blocked" label="NO DISPATCH" />
              <OperatorBadge tone="gated" label="ZERO GATES GRANTED" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                Operator Slate / Project registry fixture
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">
                JAI Project Registry
              </h1>
            </div>
            <p className="max-w-5xl text-sm text-slate-400">
              Local fixture view for project objectives, custom metrics, canon
              summaries, Council posture, Agent lanes, authority boundaries, and
              next prompts. Every displayed record is fixture-backed and does not
              represent live project, repo, customer, or Agent state.
            </p>
            <OperatorGateCard>
              <div className="flex flex-wrap items-center gap-2">
                <OperatorBadge tone="fixture" label="FIXTURE SOURCE" />
                <OperatorBadge tone="gated" label="NOT CANON UNTIL ACCEPTED" />
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {safeText(fixture.authority_boundary_label)}
              </p>
              <p className="mt-2 text-xs text-amber-300">
                {safeText(fixture.status_note)}
              </p>
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Project Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Update project</OperatorBlockedAction>
              <OperatorBlockedAction>Dispatch Agent lane</OperatorBlockedAction>
              <OperatorBlockedAction>Accept fixture</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Dashboard display does not authorize action. Fixture state, Council
              posture, metrics, and next prompts remain representational only.
            </p>
          </OperatorSafetyRail>
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
            detail="Fixture state only; active does not mean live or authorized."
          />
          <SummaryCard
            label="Frozen"
            value={frozenProjects.length}
            detail="Frozen entries remain planning context only."
          />
          <SummaryCard
            label="Archived"
            value={archivedProjects.length}
            detail="Empty archives degrade to a labeled fixture empty state."
          />
          <SummaryCard
            label="Metrics"
            value={metricCount}
            detail="Custom metrics are representational fixture fields."
          />
        </section>

        <ProjectSection
          index="01"
          title="Active Projects"
          description="Active labels come from checked-in fixture data and do not describe live system state."
          projects={activeProjects}
        />

        <ProjectSection
          index="02"
          title="Frozen Projects"
          description="Frozen or held fixture entries are planning context only."
          projects={frozenProjects}
        />

        <ProjectSection
          index="03"
          title="Archived Projects"
          description="Archived fixture entries are optional; absence is handled as a labeled empty state."
          projects={archivedProjects}
        />

        <Section
          index="04"
          title="Explicit Non-Authorizations"
          description="These boundaries are fixture posture and remain closed."
        >
          <OperatorPanel>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {safeArray(fixture.non_authorizations).length === 0 ? (
                <EmptyState label="non-authorizations" />
              ) : (
                safeArray(fixture.non_authorizations).map((item, index) => (
                  <OperatorGateCard key={`non-authorization-${index}`}>
                    <OperatorBadge tone="blocked" label="BLOCKED" />
                    <p className="mt-2 text-sm text-slate-300">{item}</p>
                  </OperatorGateCard>
                ))
              )}
            </div>
          </OperatorPanel>
        </Section>
      </div>
    </main>
  );
}
