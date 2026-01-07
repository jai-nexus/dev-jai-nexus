// portal/src/app/operator/events/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCentral, formatCentralTooltip } from "@/lib/time";

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
  // Next.js 16 can provide this as a Promise in some cases
  searchParams?: SearchParamsObj | Promise<SearchParamsObj>;
}

type KindBreakdownRow = {
  kind: string;
  _count: { kind: number };
};

export default async function OperatorEventsPage({ searchParams }: OperatorEventsPageProps) {
  const sp = await Promise.resolve(searchParams ?? {});

  const nhFilter = firstParam(sp.nh);
  const sourceFilter = firstParam(sp.source);
  const kindFilter = firstParam(sp.kind);

  // Parse limit: default 100, max 500, min 1
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

  // ✅ React purity: avoid Date.now() in render path
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

  const hasFilters = !!(nhFilter || sourceFilter || kindFilter);
  const lastIngest = latestEvent?.ts ? formatCentral(latestEvent.ts) : "Never";

  const topKinds = kindsBreakdown.slice(0, 5);
  const hasMoreKinds = kindsBreakdown.length > 5;

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">JAI NEXUS · Events</h1>
        <p className="text-sm text-gray-400 mt-1">
          Stream of record (SoT events) from chats, syncs, and other sources.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded">
            <div className="text-xs text-gray-400 uppercase tracking-tighter">Events (24h)</div>
            <div className="text-2xl font-mono text-zinc-200">{total24h}</div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded">
            <div className="text-xs text-gray-400 uppercase tracking-tighter">Last Event</div>
            <div className="text-lg font-mono text-zinc-200 truncate" title={lastIngest}>
              {lastIngest}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 bg-zinc-900/50 border border-zinc-800 p-3 rounded overflow-hidden">
            <div className="text-xs text-gray-400 uppercase tracking-tighter mb-2">
              Top Kinds {hasFilters ? "(Filtered)" : "(Global)"}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {topKinds.length === 0 ? (
                <span className="text-xs text-zinc-500 italic">No events found</span>
              ) : (
                topKinds.map((k) => (
                  <div key={k.kind} className="text-xs flex items-center gap-2">
                    <Link
                      href={`/operator/events?kind=${encodeURIComponent(k.kind)}`}
                      className="font-mono text-sky-400 hover:text-sky-300 truncate max-w-[200px]"
                      title={k.kind}
                    >
                      {k.kind}
                    </Link>
                    <span className="text-zinc-500">×{k._count.kind}</span>
                  </div>
                ))
              )}

              {hasMoreKinds && <span className="text-xs text-zinc-500 italic">+ others</span>}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-400">Showing latest {limit} events · America/Chicago</span>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              {nhFilter && (
                <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px] text-gray-200">
                  NH: <span className="ml-1 font-mono">{nhFilter}</span>
                </span>
              )}
              {sourceFilter && (
                <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px] text-gray-200">
                  Source: <span className="ml-1 font-mono">{sourceFilter}</span>
                </span>
              )}
              {kindFilter && (
                <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px] text-gray-200">
                  Kind: <span className="ml-1 font-mono">{kindFilter}</span>
                </span>
              )}

              <Link href="/operator/events" className="text-[11px] text-sky-400 hover:text-sky-300 underline ml-1">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </header>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400">No events found for the current filter.</p>
      ) : (
        <section>
          <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                <tr>
                  <th className="py-2 px-3 text-xs text-gray-400">Event time</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Source</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Kind</th>
                  <th className="py-2 px-3 text-xs text-gray-400">NH_ID</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Event ID</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Summary</th>
                </tr>
              </thead>

              <tbody suppressHydrationWarning>
                {events.map((evt: SotEventRow) => (
                  <tr key={evt.id} className="border-b border-gray-900 hover:bg-zinc-900/60">
                    <td className="py-2 px-3 whitespace-nowrap text-xs" title={formatCentralTooltip(evt.ts)}>
                      {formatCentral(evt.ts)}
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      <Link
                        href={`/operator/events?source=${encodeURIComponent(evt.source)}`}
                        className="text-[11px] text-sky-300 hover:text-sky-200 underline"
                      >
                        {evt.source}
                      </Link>
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      <Link
                        href={`/operator/events?kind=${encodeURIComponent(evt.kind)}`}
                        className="text-[11px] text-sky-300 hover:text-sky-200 underline"
                      >
                        {evt.kind}
                      </Link>
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      {evt.nhId ? (
                        <Link
                          href={`/operator/events?nh=${encodeURIComponent(evt.nhId)}`}
                          className="text-[11px] text-sky-300 hover:text-sky-200 underline"
                        >
                          {evt.nhId}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap text-xs text-gray-600 font-mono">
                      {evt.eventId?.slice(0, 8)}...
                    </td>

                    <td className="py-2 px-3 text-xs max-w-xl truncate">{evt.summary ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
