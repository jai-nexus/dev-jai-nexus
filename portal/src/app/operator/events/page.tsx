// portal/src/app/operator/events/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatCentral, formatCentralTooltip } from "@/lib/time";

export default async function OperatorEventsPage() {
  const events = await prisma.sotEvent.findMany({
    orderBy: { ts: "desc" },
    take: 50,
  });

  type EventRow = (typeof events)[number];

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">JAI NEXUS · Events</h1>
        <p className="text-sm text-gray-400 mt-1">
          Stream of record (SoT events) from chats, syncs, and other sources.
          Showing latest 50 events · America/Chicago
        </p>
      </header>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400">
          No SoT events recorded yet. Once agents and scripts emit events into
          the SoT DB, they will appear here.
        </p>
      ) : (
        <section>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                <tr>
                  <th className="py-2 px-3 text-xs text-gray-400">
                    Event time
                  </th>
                  <th className="py-2 px-3 text-xs text-gray-400">
                    Ingested
                  </th>
                  <th className="py-2 px-3 text-xs text-gray-400">Source</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Kind</th>
                  <th className="py-2 px-3 text-xs text-gray-400">NH_ID</th>
                  <th className="py-2 px-3 text-xs text-gray-400">Summary</th>
                </tr>
              </thead>

              {/* Dynamic DB data – avoid hydration mismatch warnings */}
              <tbody suppressHydrationWarning>
                {events.map((ev: EventRow) => (
                  <tr
                    key={ev.id}
                    className="border-b border-gray-900 hover:bg-zinc-900/60"
                  >
                    <td
                      className="py-2 px-3 whitespace-nowrap text-xs"
                      title={formatCentralTooltip(ev.ts)}
                    >
                      {formatCentral(ev.ts)}
                    </td>
                    <td
                      className="py-2 px-3 whitespace-nowrap text-xs text-gray-400"
                      title={formatCentralTooltip(ev.createdAt)}
                    >
                      {formatCentral(ev.createdAt)}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      {ev.source}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      {ev.kind}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      {ev.nhId ?? "—"}
                    </td>
                    <td className="py-2 px-3 text-xs max-w-lg truncate">
                      {ev.summary ?? "—"}
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
