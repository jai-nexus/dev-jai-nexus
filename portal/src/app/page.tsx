// portal/src/app/page.tsx
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const runs = await prisma.syncRun.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { repo: true },
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">JAI NEXUS · dev.jai.nexus</h1>
          <p className="text-sm text-gray-400 mt-1">
            Control plane for sync runs across the Nexus.
          </p>
        </div>
      </header>

      {runs.length === 0 ? (
        <p className="text-sm text-gray-400">
          No sync runs recorded yet. Hit the /api/sync-report endpoint to
          register the first run.
        </p>
      ) : (
        <section>
          <h2 className="text-lg font-medium mb-3">Recent sync runs</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-zinc-950 border-b border-gray-800 text-left">
                <tr>
                  <th className="py-2 px-3">When</th>
                  <th className="py-2 px-3">Repo</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Trigger</th>
                  <th className="py-2 px-3">Summary</th>
                  <th className="py-2 px-3">Workflow</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-gray-900 hover:bg-zinc-900/60"
                  >
                    <td className="py-2 px-3 whitespace-nowrap text-xs">
                      {run.startedAt.toISOString()}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {run.repo?.name ?? '—'}
                    </td>
                    <td className="py-2 px-3">{run.type}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs uppercase tracking-wide ${
                          run.status === 'success'
                            ? 'bg-emerald-900 text-emerald-200'
                            : run.status === 'failed'
                            ? 'bg-red-900 text-red-200'
                            : 'bg-yellow-900 text-yellow-200'
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {run.trigger ?? '—'}
                    </td>
                    <td className="py-2 px-3 max-w-xs truncate">
                      {run.summary ?? '—'}
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {run.workflowRunUrl ? (
                        <a
                          href={run.workflowRunUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-400 underline"
                        >
                          view
                        </a>
                      ) : (
                        '—'
                      )}
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
