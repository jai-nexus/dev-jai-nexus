// portal/src/app/events/[id]/page.tsx
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type EventPageProps = {
  params: {
    id: string;
  };
};

export default async function EventDetailPage({ params }: EventPageProps) {
  const eventId = Number(params.id);

  if (!Number.isFinite(eventId) || eventId <= 0) {
    notFound();
  }

  const event = await prisma.sotEvent.findUnique({
    where: { id: eventId },
    include: {
      repo: true,
      domain: true,
    },
  });

  if (!event) {
    notFound();
  }

  const tz = 'America/Chicago';
  const when = event.ts.toLocaleString('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          JAI NEXUS · Event #{event.id}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Detailed view of a single SoT event from the Nexus stream.
        </p>
      </header>

      <section className="space-y-4">
        <div className="grid gap-2 text-sm">
          <div>
            <span className="text-gray-500 mr-2">When:</span>
            <span>{when} ({tz})</span>
          </div>
          <div>
            <span className="text-gray-500 mr-2">Source:</span>
            <span className="uppercase tracking-wide">{event.source}</span>
          </div>
          <div>
            <span className="text-gray-500 mr-2">Kind:</span>
            <span>{event.kind}</span>
          </div>
          <div>
            <span className="text-gray-500 mr-2">NH_ID:</span>
            <span>{event.nhId || '—'}</span>
          </div>
          <div>
            <span className="text-gray-500 mr-2">Repo:</span>
            <span>{event.repo?.name ?? '—'}</span>
          </div>
          <div>
            <span className="text-gray-500 mr-2">Domain:</span>
            <span>{event.domain?.domain ?? '—'}</span>
          </div>
          <div>
            <span className="text-gray-500 mr-2">Summary:</span>
            <span>{event.summary ?? '—'}</span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-300 mb-2">
            Payload (canonical blob)
          </h2>
          <pre className="text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
            {JSON.stringify(event.payload, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}
