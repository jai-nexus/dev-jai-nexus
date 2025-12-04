// portal/src/app/events/page.tsx
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { formatCentral, formatCentralTooltip } from '@/lib/time';

const tz = 'America/Chicago';

export default async function EventsPage() {
  const events = await prisma.sotEvent.findMany({
    orderBy: { ts: 'desc' }, // or { createdAt: 'desc' } if you want ingest order
    take: 50,
    include: {
      repo: true,
      domain: true,
    },
  });

  type SotEventRow = (typeof events)[number];

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">JAI NEXUS · Events</h1>
        <p className="text-sm text-gray-400 mt-1">
          Stream of record (SoT events) from chats, syncs, and other sources.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Showing latest 50 events · {tz}
        </p>
      </header>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400">
          No events recorded yet. Use the ingest script or future pipelines to
          append{' '}
          <code className="mx-1 px-1 py-0.5 rounded bg-zinc-900 text-xs">
            SotEvent
          </code>{' '}
          rows.
        </p>
      ) : (
        <section>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                <tr>
                  <th className="py-2 px-3">Event time</th>
                  <th className="py-2 px-3">Ingested</th>
                  <th className="py-2 px-3">Source</th>
                  <th className="py-2 px-3">Kind</th>
                  <th className="py-2 px-3">NH_ID</th>
                  <th className="py-2 px-3">Repo</th>
                  <th className="py-2 px-3">Domain</th>
                  <th className="py-2 px-3">Summary</th>
                  <th className="py-2 px-3">Payload</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event: SotEventRow) => {
                  const eventTime = formatCentral(event.ts);
                  const ingestedTime = formatCentral(event.createdAt);

                  const payloadString =
                    event.payload != null ? JSON.stringify(event.payload) : '';
                  const payloadPreview =
                    payloadString === ''
                      ? '—'
                      : payloadString.slice(0, 60) +
                        (payloadString.length > 60 ? '…' : '');

                  return (
                    <tr
                      key={event.id}
                      className="border-b border-gray-900 hover:bg-zinc-900/60"
                    >
                      <td
                        className="py-2 px-3 whitespace-nowrap text-xs"
                        title={formatCentralTooltip(event.ts)}
                      >
                        {eventTime}
                      </td>
                      <td
                        className="py-2 px-3 whitespace-nowrap text-xs text-gray-400"
                        title={formatCentralTooltip(event.createdAt)}
                      >
                        {ingestedTime}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-xs uppercase text-gray-300">
                        {event.source}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-xs">
                        {event.kind}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-xs">
                        {event.nhId || '—'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-xs">
                        {event.repo?.name ?? '—'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-xs">
                        {event.domain?.domain ?? '—'}
                      </td>
                      <td className="py-2 px-3 max-w-xs truncate">
                        {event.summary ?? '—'}
                      </td>
                      <td className="py-2 px-3 max-w-xs truncate text-xs text-gray-400">
                        {payloadPreview}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
