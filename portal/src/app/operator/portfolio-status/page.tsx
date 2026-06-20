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
import { CanonicalReadOnlySpine } from "@/components/operator/CanonicalReadOnlySpine";
import {
  getPortfolioStatusFixture,
  type PortfolioStatusLaneCard,
} from "@/lib/controlPlane/portfolioStatusFixture";
import { PaletteGridReadiness } from "@/components/operator/PaletteGridReadiness";

const FALLBACK_TEXT = "Not recorded in the checked-in fixture.";

function statusTone(status?: string): OperatorSlateTone {
  if (status === "blocked") return "blocked";
  if (status === "queued" || status === "deferred" || status === "held") {
    return "warning";
  }
  return "fixture";
}

function safeText(value: string | undefined, fallback = FALLBACK_TEXT) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function safeArray<T>(items: T[] | undefined) {
  return Array.isArray(items) ? items : [];
}

function formatStatus(status: string | undefined) {
  return safeText(status, "unknown").replace(/_/g, " ");
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

function MetadataItem({ label, value }: { label: string; value?: string }) {
  return (
    <OperatorGateCard>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {label}
        </div>
        <OperatorBadge tone="fixture" label="STATIC METADATA" />
      </div>
      <div className="mt-2 break-words font-mono text-xs text-slate-300">
        {safeText(value)}
      </div>
    </OperatorGateCard>
  );
}

function LaneCard({ lane }: { lane: PortfolioStatusLaneCard }) {
  return (
    <OperatorPanel className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-100">
              {safeText(lane.display_title)}
            </h3>
            <OperatorBadge tone="fixture" label="FIXTURE LANE" />
            <OperatorStatusChip
              status={formatStatus(lane.status)}
              tone={statusTone(lane.status)}
            />
            <OperatorIdChip>{safeText(lane.repo, "unknown repo")}</OperatorIdChip>
          </div>
          <p className="max-w-4xl text-sm text-slate-300">
            {safeText(lane.scope)}
          </p>
        </div>
        <OperatorIdChip>{safeText(lane.lane_id)}</OperatorIdChip>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <MetadataItem label="Branch" value={lane.branch} />
        <div className="lg:col-span-2">
          <MetadataItem label="Artifact" value={lane.artifact} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <OperatorGateCard>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
            Active work
          </div>
          <TextList items={lane.active_work} label="active work" />
        </OperatorGateCard>
        <OperatorGateCard>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
            Queued work
          </div>
          <TextList items={lane.queued_work} label="queued work" />
        </OperatorGateCard>
        <OperatorGateCard>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
            Deferred work
          </div>
          <TextList items={lane.deferred_work} label="deferred work" />
        </OperatorGateCard>
        <OperatorContradictionCard>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-red-300">
            Risks
          </div>
          <TextList items={lane.risks} label="risks" />
        </OperatorContradictionCard>
        <OperatorGateCard>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
            Next prompts
          </div>
          <TextList items={lane.next_prompts} label="next prompts" />
        </OperatorGateCard>
      </div>

      <OperatorContradictionCard className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <OperatorBadge tone="fixture" label="FIXTURE STATE" />
          <OperatorBadge tone="gated" label="NOT LIVE REPO STATE" />
          <OperatorBadge tone="blocked" label="NO ROUTE EXECUTION" />
        </div>
        <p className="mt-2 text-sm text-red-200">
          Lane display, completion, branch, artifact, and work lists are checked-in
          fixture claims. They do not mutate repos, route work, create receipts, or
          update canon.
        </p>
      </OperatorContradictionCard>
    </OperatorPanel>
  );
}

export default function OperatorPortfolioStatusPage() {
  const fixture = getPortfolioStatusFixture();
  const statusSummary = fixture.status_summary;
  const baselineMetadata = fixture.static_baseline_metadata;
  const batches = safeArray(fixture.batch_summaries);
  const lanes = safeArray(fixture.lane_cards);
  const deferredWork = safeArray(statusSummary?.deferred_work);
  const activeCount = lanes.filter((lane) => lane.status === "active").length;
  const queuedCount = lanes.filter((lane) => lane.status === "queued").length;
  const completedCount = lanes.filter((lane) => lane.status === "completed").length;
  const deferredCount =
    lanes.filter((lane) => lane.status === "deferred" || lane.status === "held").length +
    deferredWork.length;

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
                Operator Slate / Portfolio fixture posture
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">
                {safeText(fixture.display_title)}
              </h1>
            </div>
            <p className="max-w-5xl text-sm text-slate-400">
              Static local Operator Control Plane view for portfolio batches and repo
              lanes. This route reads checked-in fixture data only; it does not fetch
              remote artifacts, synchronize repos, or represent live status.
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
                {safeText(statusSummary?.status_note)}
              </p>
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Portfolio Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Route lane</OperatorBlockedAction>
              <OperatorBlockedAction>Sync repo</OperatorBlockedAction>
              <OperatorBlockedAction>Create receipt</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Dashboard display does not authorize action. Fixture completion does
              not create acceptance, a receipt, or a canon update.
            </p>
          </OperatorSafetyRail>
        </header>

        <CanonicalReadOnlySpine
          index="CANON"
          cards={[
            {
              id: "PORT-FIXTURE",
              label: "Fixture source",
              value: fixture.static_baseline_metadata.read_model_version,
              source: "FIXTURE",
              freshness:
                fixture.static_baseline_metadata.status_date ??
                "Fixture status date not recorded.",
              detail:
                "Checked-in portfolio fixture is not live portfolio verification.",
            },
            {
              id: "PORT-LANES",
              label: "Repo lanes",
              value: lanes.length,
              source: "DERIVED",
              freshness: "Derived from checked-in fixture lane cards.",
              detail:
                "Lane counts do not route work, update repos, or create receipts.",
            },
            {
              id: "PORT-RISK",
              label: "Risks",
              value: safeArray(fixture.risk_summary?.risks).length,
              source: "FIXTURE",
              freshness: "Risk list is fixture-backed and manually maintained.",
              detail:
                "Risk display is advisory posture only, not automatic evaluation.",
            },
            {
              id: "PORT-SOURCE",
              label: "Source refs",
              value: safeArray(fixture.source_refs).length,
              source: "UNKNOWN SOURCE",
              freshness:
                "References are recorded in fixture; upstream freshness is not fetched.",
              detail:
                "Recorded references are provenance hints, not live source confirmation.",
            },
          ]}
        />

        <PaletteGridReadiness index="P/G" compact />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Current batches"
            value={batches.length}
            detail={safeText(statusSummary?.generated_label)}
          />
          <SummaryCard
            label="Active lanes"
            value={activeCount}
            detail="Fixture count only; active does not mean live or authorized."
          />
          <SummaryCard
            label="Queued lanes"
            value={queuedCount}
            detail="Manual CONTROL_THREAD routing remains required."
          />
          <SummaryCard
            label="Completed lanes"
            value={completedCount}
            detail="Fixture completion is not a receipt, acceptance, or live repo status."
          />
          <SummaryCard
            label="Deferred / held"
            value={deferredCount}
            detail="Deferred items do not imply implementation approval."
          />
        </section>

        <Section
          index="01"
          title="Static Baseline Metadata"
          description="Manual checked-in baseline context. This metadata is not live sync and does not fetch upstream artifacts."
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <MetadataItem label="Status date" value={baselineMetadata?.status_date} />
            <MetadataItem
              label="Artifact version"
              value={baselineMetadata?.artifact_version}
            />
            <MetadataItem
              label="Read model version"
              value={baselineMetadata?.read_model_version}
            />
            <MetadataItem
              label="Authority boundary"
              value={fixture.authority_boundary_label}
            />
            <MetadataItem
              label="Source baseline note"
              value={baselineMetadata?.source_baseline_note}
            />
            <MetadataItem label="Checksum" value={baselineMetadata?.checksum} />
            <MetadataItem
              label="Checksum algorithm"
              value={baselineMetadata?.checksum_algorithm}
            />
            <MetadataItem
              label="Checksum scope"
              value={baselineMetadata?.checksum_scope}
            />
          </div>
          <OperatorGateCard>
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="fixture" label="DOCUMENTARY TOKEN" />
              <OperatorBadge tone="gated" label="MANUAL REVIEW ONLY" />
            </div>
            <p className="mt-2 text-sm text-slate-300">
              {safeText(baselineMetadata?.checksum_integrity_note)}
            </p>
          </OperatorGateCard>
          <MetadataItem
            label="Handoff manifest path"
            value={baselineMetadata?.handoff_manifest_path}
          />
        </Section>

        <Section
          index="02"
          title="Current Batches"
          description="Checked-in fixture batches. Batch state is local display data only."
        >
          {batches.length === 0 ? (
            <EmptyState label="batches" />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {batches.map((batch) => (
                <OperatorPanel key={batch.batch_id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-100">
                      {safeText(batch.display_title)}
                    </h3>
                    <OperatorBadge tone="fixture" label="FIXTURE BATCH" />
                    <OperatorStatusChip
                      status={formatStatus(batch.status)}
                      tone="fixture"
                    />
                    <OperatorIdChip>{batch.batch_id}</OperatorIdChip>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    {safeText(batch.summary)}
                  </p>
                  <div className="mt-4 font-mono text-xs uppercase tracking-widest text-slate-500">
                    Lane IDs
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {safeArray(batch.lane_ids).length === 0 ? (
                      <OperatorBadge tone="fixture" label="NONE RECORDED" />
                    ) : (
                      safeArray(batch.lane_ids).map((laneId) => (
                        <OperatorIdChip key={laneId}>{laneId}</OperatorIdChip>
                      ))
                    )}
                  </div>
                </OperatorPanel>
              ))}
            </div>
          )}
        </Section>

        <Section
          index="03"
          title="Repo Lanes"
          description="Repo lane cards show checked-in fixture status, work lists, risks, and next prompts."
        >
          {lanes.length === 0 ? (
            <EmptyState label="repo lanes" />
          ) : (
            <div className="space-y-4">
              {lanes.map((lane) => (
                <LaneCard key={lane.lane_id} lane={lane} />
              ))}
            </div>
          )}
        </Section>

        <Section
          index="04"
          title="Portfolio Work Summary"
          description="Summary lists are fixture claims only and do not route or mutate work."
        >
          <div className="grid gap-4 xl:grid-cols-3">
            <OperatorPanel>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-slate-100">Active Work</h3>
                <OperatorBadge tone="fixture" label="FIXTURE" />
              </div>
              <div className="mt-3">
                <TextList items={statusSummary?.active_work} label="active work" />
              </div>
            </OperatorPanel>
            <OperatorPanel>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-slate-100">Queued Work</h3>
                <OperatorBadge tone="warning" label="FIXTURE QUEUE" />
              </div>
              <div className="mt-3">
                <TextList items={statusSummary?.queued_work} label="queued work" />
              </div>
            </OperatorPanel>
            <OperatorPanel>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-slate-100">Deferred Work</h3>
                <OperatorBadge tone="warning" label="FIXTURE DEFERRED" />
              </div>
              <div className="mt-3">
                <TextList items={statusSummary?.deferred_work} label="deferred work" />
              </div>
            </OperatorPanel>
          </div>
        </Section>

        <section className="grid gap-4 xl:grid-cols-2">
          <OperatorContradictionCard>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-medium text-red-100">Risks</h2>
              <OperatorBadge tone="fixture" label="FIXTURE RISKS" />
            </div>
            <div className="mt-3">
              <TextList items={fixture.risk_summary?.risks} label="risks" />
            </div>
          </OperatorContradictionCard>
          <OperatorPanel>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-medium text-slate-100">Next Prompts</h2>
              <OperatorBadge tone="advisory" label="ADVISORY ONLY" />
              <OperatorBadge tone="fixture" label="FIXTURE" />
            </div>
            <div className="mt-3">
              <TextList items={fixture.next_prompts} label="next prompts" />
            </div>
          </OperatorPanel>
        </section>

        <Section
          index="05"
          title="Authority Boundary"
          description="Display-only non-authorizations and source references remain explicit."
        >
          <OperatorPanel>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
            <div className="mt-4 font-mono text-xs uppercase tracking-widest text-slate-500">
              Source refs
            </div>
            <ul className="mt-2 space-y-2">
              {safeArray(fixture.source_refs).length === 0 ? (
                <li className="text-sm text-slate-500">
                  No source refs recorded in the checked-in fixture.
                </li>
              ) : (
                safeArray(fixture.source_refs).map((sourceRef, index) => (
                  <li key={`source-ref-${index}`}>
                    <OperatorIdChip>{sourceRef}</OperatorIdChip>
                  </li>
                ))
              )}
            </ul>
          </OperatorPanel>
        </Section>
      </div>
    </main>
  );
}
