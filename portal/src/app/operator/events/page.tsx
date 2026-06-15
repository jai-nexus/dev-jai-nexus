export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSafetyRail,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { prisma } from "@/lib/prisma";

type SearchParamValue = string | string[] | undefined;

function firstParam(value: SearchParamValue): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

type SearchParamsObj = {
  nh?: SearchParamValue;
  source?: SearchParamValue;
  kind?: SearchParamValue;
  limit?: SearchParamValue;
};

interface OperatorEventsPageProps {
  searchParams?: SearchParamsObj | Promise<SearchParamsObj>;
}

type KindBreakdownRow = {
  kind: string;
  _count: { kind: number };
};

function formatStableTs(value: Date): string {
  return value.toISOString();
}

export default async function OperatorEventsPage({
  searchParams,
}: OperatorEventsPageProps) {
  const sp = await Promise.resolve(searchParams ?? {});

  const nhFilter = firstParam(sp.nh);
  const sourceFilter = firstParam(sp.source);
  const kindFilter = firstParam(sp.kind);

  let limit = 100;
  if (sp.limit) {
    const parsed = parseInt(firstParam(sp.limit) || "0", 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limit = Math.min(parsed, 500);
    }
  }

  const where: { nhId?: string; source?: string; kind?: string } = {};
  if (nhFilter) where.nhId = nhFilter;
  if (sourceFilter) where.source = sourceFilter;
  if (kindFilter) where.kind = kindFilter;

  const cutoff = new Date();
  cutoff.setTime(cutoff.getTime() - 24 * 60 * 60 * 1000);

  const [events, total24h, latestEvent, kindsBreakdown] = await Promise.all([
    prisma.sotEvent.findMany({
      where,
      orderBy: [{ ts: "desc" }, { eventId: "desc" }],
      take: limit,
    }),
    prisma.sotEvent.count({
      where: { ts: { gt: cutoff } },
    }),
    prisma.sotEvent.findFirst({
      orderBy: { ts: "desc" },
      select: { ts: true },
    }),
    prisma.sotEvent
      .groupBy({
        by: ["kind"],
        where,
        _count: { kind: true },
        orderBy: { _count: { kind: "desc" } },
        take: 6,
      })
      .catch((): KindBreakdownRow[] => []),
  ]);

  type SotEventRow = (typeof events)[number];

  const hasFilters = Boolean(nhFilter || sourceFilter || kindFilter);
  const lastIngest = latestEvent?.ts ? formatStableTs(latestEvent.ts) : "Never";
  const topKinds = kindsBreakdown.slice(0, 5);
  const hasMoreKinds = kindsBreakdown.length > 5;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="mr-2 text-3xl font-semibold">JAI NEXUS - Events</h1>
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
              <OperatorBadge tone="warning">PARTIAL EVENT STREAM</OperatorBadge>
              <OperatorBadge tone="blocked">NOT A RECEIPT</OperatorBadge>
              <OperatorBadge tone="blocked">NO MUTATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <p className="mt-4 max-w-4xl text-sm text-slate-400">
              Read-only stream-of-record events from chats, syncs, and other
              configured sources. Event presence is evidence display only; it is
              not acceptance, canon update, receipt creation, or execution authority.
            </p>
            <OperatorGateCard className="mt-4 text-sm text-amber-200">
              This is a partial event stream. Current motion and governance
              ratification artifacts are not automatically emitted into Events in v0.
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail invariants={OPERATOR_SAFETY_INVARIANTS}>
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Emit event</OperatorBlockedAction>
              <OperatorBlockedAction>Create receipt</OperatorBlockedAction>
              <OperatorBlockedAction>Accept evidence</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Filters and links only read existing event records. Dashboard display
              does not authorize action.
            </p>
          </OperatorSafetyRail>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OperatorPanel>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Events (24h)
            </div>
            <div className="mt-2 font-mono text-2xl text-slate-200">{total24h}</div>
            <OperatorBadge tone="readOnly">DERIVED / READ-ONLY</OperatorBadge>
          </OperatorPanel>

          <OperatorPanel>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Last Event
            </div>
            <div
              className="mt-2 truncate font-mono text-lg text-slate-200"
              title={lastIngest}
            >
              {lastIngest}
            </div>
            <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
          </OperatorPanel>

          <OperatorPanel className="col-span-1 overflow-hidden md:col-span-2">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Top Kinds {hasFilters ? "(Filtered)" : "(Global)"}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {topKinds.length === 0 ? (
                <span className="text-xs italic text-slate-500">No events found</span>
              ) : (
                topKinds.map((entry) => (
                  <div key={entry.kind} className="flex items-center gap-2 text-xs">
                    <Link
                      href={`/operator/events?kind=${encodeURIComponent(entry.kind)}`}
                      className="max-w-[200px] truncate font-mono text-sky-400 hover:text-sky-300"
                      title={entry.kind}
                    >
                      {entry.kind}
                    </Link>
                    <OperatorBadge tone="readOnly">{entry._count.kind}</OperatorBadge>
                  </div>
                ))
              )}
              {hasMoreKinds ? (
                <span className="text-xs italic text-slate-500">+ others</span>
              ) : null}
            </div>
          </OperatorPanel>
        </section>

        <OperatorPanel>
          <OperatorSectionHeader
            index="01"
            title="Event Filters"
            right={<OperatorReadOnlyAction>QUERY FILTERS</OperatorReadOnlyAction>}
          />
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400">
              Showing latest {limit} events - UTC
            </span>
            {hasFilters ? (
              <div className="flex flex-wrap items-center gap-2">
                {nhFilter ? (
                  <OperatorBadge tone="readOnly">NH: {nhFilter}</OperatorBadge>
                ) : null}
                {sourceFilter ? (
                  <OperatorBadge tone="readOnly">
                    Source: {sourceFilter}
                  </OperatorBadge>
                ) : null}
                {kindFilter ? (
                  <OperatorBadge tone="readOnly">Kind: {kindFilter}</OperatorBadge>
                ) : null}
                <Link
                  href="/operator/events"
                  className="ml-1 text-xs text-sky-400 underline hover:text-sky-300"
                >
                  Clear filters
                </Link>
              </div>
            ) : null}
          </div>
        </OperatorPanel>

        {events.length === 0 ? (
          <OperatorGateCard className="text-sm text-slate-400">
            No events found for the current filter.
          </OperatorGateCard>
        ) : (
          <OperatorPanel>
            <OperatorSectionHeader
              index="02"
              title="Read-Only Event Records"
              right={<OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>}
            />
            <div className="overflow-x-auto rounded border border-slate-800">
              <table className="w-full border-collapse text-sm">
                <thead className="border-b border-slate-800 bg-slate-950 text-left">
                  <tr>
                    <th className="px-3 py-2 text-xs text-slate-400">Event time</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Source</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Kind</th>
                    <th className="px-3 py-2 text-xs text-slate-400">NH_ID</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Event ID</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Summary</th>
                    <th className="px-3 py-2 text-xs text-slate-400">Posture</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: SotEventRow) => (
                    <tr
                      key={event.id}
                      className="border-b border-slate-900 align-top hover:bg-slate-800/60"
                    >
                      <td
                        className="whitespace-nowrap px-3 py-2 text-xs"
                        title={event.ts.toISOString()}
                      >
                        {formatStableTs(event.ts)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs">
                        <Link
                          href={`/operator/events?source=${encodeURIComponent(event.source)}`}
                          className="text-sky-300 underline hover:text-sky-200"
                        >
                          {event.source}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs">
                        <Link
                          href={`/operator/events?kind=${encodeURIComponent(event.kind)}`}
                          className="text-sky-300 underline hover:text-sky-200"
                        >
                          {event.kind}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs">
                        {event.nhId ? (
                          <Link
                            href={`/operator/events?nh=${encodeURIComponent(event.nhId)}`}
                            className="text-sky-300 underline hover:text-sky-200"
                          >
                            {event.nhId}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs">
                        <OperatorIdChip>
                          {event.eventId?.slice(0, 8)}...
                        </OperatorIdChip>
                      </td>
                      <td className="max-w-xl truncate px-3 py-2 text-xs">
                        {event.summary ?? "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs">
                        <OperatorBadge tone="readOnly">EVENT / READ-ONLY</OperatorBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </OperatorPanel>
        )}
      </div>
    </main>
  );
}
