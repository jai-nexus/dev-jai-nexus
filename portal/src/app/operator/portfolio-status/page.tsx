export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";

import {
  getPortfolioStatusFixture,
  type PortfolioLaneStatus,
  type PortfolioStatusLane,
} from "@/lib/controlPlane/portfolioStatusFixture";

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

function statusTone(status: PortfolioLaneStatus): "sky" | "amber" | "emerald" | "rose" | "slate" {
  if (status === "active") return "sky";
  if (status === "queued") return "amber";
  if (status === "completed") return "emerald";
  if (status === "blocked") return "rose";
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
  if (!items || items.length === 0) {
    return <EmptyState label={label} />;
  }

  return (
    <ul className="space-y-1 text-sm text-gray-300">
      {items.map((item) => (
        <li key={item}>- {item}</li>
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

function LaneCard({ lane }: { lane: PortfolioStatusLane }) {
  return (
    <article className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-100">{lane.title}</h3>
            <ToneBadge tone={statusTone(lane.status)}>{lane.status}</ToneBadge>
            <ToneBadge tone="slate">{lane.repo}</ToneBadge>
          </div>
          <p className="max-w-4xl text-sm text-gray-300">{lane.scope}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-800 bg-black/30 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">Branch</div>
          <div className="mt-2 font-mono text-xs text-gray-300">{lane.branch}</div>
        </div>
        <div className="rounded-lg border border-gray-800 bg-black/30 p-3 lg:col-span-2">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">Artifact</div>
          <div className="mt-2 font-mono text-xs text-gray-300">{lane.artifact}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Active work</div>
          <TextList items={lane.active_work} label="active work" />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Queued work</div>
          <TextList items={lane.queued_work} label="queued work" />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Risks</div>
          <TextList items={lane.risks} label="risks" />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Next prompts</div>
          <TextList items={lane.next_prompts} label="next prompts" />
        </div>
      </div>
    </article>
  );
}

export default function OperatorPortfolioStatusPage() {
  const fixture = getPortfolioStatusFixture();
  const activeCount = fixture.lanes.filter((lane) => lane.status === "active").length;
  const queuedCount = fixture.lanes.filter((lane) => lane.status === "queued").length;
  const completedCount = fixture.lanes.filter((lane) => lane.status === "completed").length;
  const deferredCount =
    fixture.lanes.filter((lane) => lane.status === "deferred" || lane.status === "held").length +
    fixture.deferred_work.length;

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">Operator Portfolio Status</h1>
            <ToneBadge tone="amber">static</ToneBadge>
            <ToneBadge tone="sky">local fixture</ToneBadge>
            <ToneBadge tone="slate">checked-in data</ToneBadge>
            <ToneBadge tone="rose">non-live</ToneBadge>
          </div>
          <p className="max-w-5xl text-sm text-gray-400">
            Static Operator Control Plane surface for portfolio batches and repo
            lanes. This page is backed only by checked-in fixture data and is
            non-canonical until accepted by CONTROL_THREAD.
          </p>
          <div className="rounded-xl border border-amber-800 bg-amber-950/40 p-4 text-sm text-amber-100">
            {fixture.status_note}
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Current batches"
            value={fixture.batches.length}
            detail={fixture.generated_label}
          />
          <SummaryCard
            label="Active lanes"
            value={activeCount}
            detail="Static fixture count only; not live repo state."
          />
          <SummaryCard
            label="Queued lanes"
            value={queuedCount}
            detail="Manual CONTROL_THREAD routing remains required."
          />
          <SummaryCard
            label="Completed lanes"
            value={completedCount}
            detail="Completion is fixture text, not live repo status."
          />
          <SummaryCard
            label="Deferred / held"
            value={deferredCount}
            detail="Deferred items do not imply implementation approval."
          />
        </section>

        <Section
          title="Current Batches"
          description="Checked-in fixture batches. Batch state is local display data only."
        >
          {fixture.batches.length === 0 ? (
            <EmptyState label="batches" />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {fixture.batches.map((batch) => (
                <article key={batch.batch_id} className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-100">{batch.title}</h3>
                    <ToneBadge tone="slate">{batch.status.replace(/_/g, " ")}</ToneBadge>
                  </div>
                  <p className="mt-3 text-sm text-gray-300">{batch.summary}</p>
                  <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Lane IDs</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {batch.lane_ids.length === 0 ? (
                      <ToneBadge tone="slate">none recorded</ToneBadge>
                    ) : (
                      batch.lane_ids.map((laneId) => (
                        <ToneBadge key={laneId} tone="sky">
                          {laneId}
                        </ToneBadge>
                      ))
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Section>

        <Section
          title="Repo Lanes"
          description="Repo lane cards show fixture status, active work, queued work, risks, and next prompts."
        >
          {fixture.lanes.length === 0 ? (
            <EmptyState label="repo lanes" />
          ) : (
            <div className="space-y-4">
              {fixture.lanes.map((lane) => (
                <LaneCard key={lane.lane_id} lane={lane} />
              ))}
            </div>
          )}
        </Section>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <h2 className="text-lg font-medium text-gray-100">Active Work</h2>
            <div className="mt-3">
              <TextList items={fixture.active_work} label="active work" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <h2 className="text-lg font-medium text-gray-100">Queued Work</h2>
            <div className="mt-3">
              <TextList items={fixture.queued_work} label="queued work" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <h2 className="text-lg font-medium text-gray-100">Deferred Work</h2>
            <div className="mt-3">
              <TextList items={fixture.deferred_work} label="deferred work" />
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-rose-900 bg-rose-950/30 p-4">
            <h2 className="text-lg font-medium text-rose-100">Risks</h2>
            <div className="mt-3">
              <TextList items={fixture.risks} label="risks" />
            </div>
          </div>
          <div className="rounded-xl border border-sky-900 bg-sky-950/30 p-4">
            <h2 className="text-lg font-medium text-sky-100">Next Prompts</h2>
            <div className="mt-3">
              <TextList items={fixture.next_prompts} label="next prompts" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-gray-100">Authority Boundary</h2>
            <ToneBadge tone="rose">display only</ToneBadge>
            <ToneBadge tone="amber">not canonical</ToneBadge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {fixture.non_authorizations.map((item) => (
              <div key={item} className="rounded-lg border border-gray-800 bg-black/30 p-3 text-sm text-gray-300">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs uppercase tracking-wide text-gray-500">Source refs</div>
          <ul className="mt-2 space-y-1 font-mono text-xs text-gray-400">
            {fixture.source_refs.map((sourceRef) => (
              <li key={sourceRef}>{sourceRef}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
