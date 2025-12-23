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
};

interface OperatorEventsPageProps {
  // Next.js 16 can provide this as a Promise in some cases (sync dynamic APIs)
  searchParams?: SearchParamsObj | Promise<SearchParamsObj>;
}

export default async function OperatorEventsPage({
  searchParams,
}: OperatorEventsPageProps) {
  // ✅ Unwrap whether it's an object or Promise (avoids "searchParams is a Promise" crash)
  const sp = await Promise.resolve(searchParams ?? {});

  const nhFilter = firstParam(sp.nh);
  const sourceFilter = firstParam(sp.source);
  const kindFilter = firstParam(sp.kind);

  // Simple typed where clause
  const where: {
    nhId?: string;
    source?: string;
    kind?: string;
  } = {};

  if (nhFilter) where.nhId = nhFilter;
  if (sourceFilter) where.source = sourceFilter;
  if (kindFilter) where.kind = kindFilter;

  const events = await prisma.sotEvent.findMany({
    where,
    orderBy: { ts: "desc" },
    take: 100,
  });

  type SotEventRow = (typeof events)[number];

  const hasFilters = !!(nhFilter || sourceFilter || kindFilter);

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">JAI NEXUS · Events</h1>
        <p className="text-sm text-gray-400 mt-1">
          Stream of record (SoT events) from chats, syncs, and other sources.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-400">
            Showing latest 100 events · America/Chicago
          </span>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              {nhFilter && (
                <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px] text-gray-200">
                  NH: <span className="ml-1 font-mono">{nhFilter}</span>
                </span>
              )}
              {sourceFilter && (
                <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px] text-gray-200">
                  Source:{" "}
                  <span className="ml-1 font-mono">{sourceFilter}</span>
                </span>
              )}
              {kindFilter && (
                <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px] text-gray-200">
                  Kind: <span className="ml-1 font-mono">{kindFilter}</span>
                </span>
              )}

              <Link
                href="/operator/events"
                className="text-[11px] text-sky-400 hover:text-sky-300 underline ml-1"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </header>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400">
          No events found for the current filter.
        </p>
      ) : (
        <section>
          <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                <tr>
                  <th className="py-2 px-3 text-xs text-gray-400">Event time</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Ingested</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Source</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Kind</th>
                  <th className="py-2 px-3 text-xs text-gray-400">NH_ID</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Summary</th>
                </tr>
              </thead>

              {/* DB-backed, time-sensitive data – avoid noisy hydration warnings */}
              <tbody suppressHydrationWarning>
                {events.map((evt: SotEventRow) => (
                  <tr
                    key={evt.id}
                    className="border-b border-gray-900 hover:bg-zinc-900/60"
                  >
                    <td
                      className="py-2 px-3 whitespace-nowrap text-xs"
                      title={formatCentralTooltip(evt.ts)}
                    >
                      {formatCentral(evt.ts)}
                    </td>
                    <td
                      className="py-2 px-3 whitespace-nowrap text-xs text-gray-400"
                      title={formatCentralTooltip(evt.createdAt)}
                    >
                      {formatCentral(evt.createdAt)}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      <Link
                        href={`/operator/events?source=${encodeURIComponent(
                          evt.source,
                        )}`}
                        className="text-[11px] text-sky-300 hover:text-sky-200 underline"
                      >
                        {evt.source}
                      </Link>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      <Link
                        href={`/operator/events?kind=${encodeURIComponent(
                          evt.kind,
                        )}`}
                        className="text-[11px] text-sky-300 hover:text-sky-200 underline"
                      >
                        {evt.kind}
                      </Link>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      {evt.nhId ? (
                        <Link
                          href={`/operator/events?nh=${encodeURIComponent(
                            evt.nhId,
                          )}`}
                          className="text-[11px] text-sky-300 hover:text-sky-200 underline"
                        >
                          {evt.nhId}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 px-3 text-xs max-w-xl truncate">
                      {evt.summary ?? "—"}
                    </td>
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
