// portal/src/app/domains/page.tsx
import { prisma } from '@/lib/prisma';

export default async function DomainsPage() {
  const domains = await prisma.domain.findMany({
    orderBy: { domain: 'asc' },
    include: { repo: true },
  });

  type DomainRow = (typeof domains)[number];
  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">JAI NEXUS · Domains</h1>
        <p className="text-sm text-gray-400 mt-1">
          Domain registry from the Nexus DB (Domain table).
        </p>
      </header>

      {domains.length === 0 ? (
        <p className="text-sm text-gray-400">
          No domains recorded yet. Use Prisma Studio to add entries to the
          <code className="mx-1 px-1 py-0.5 rounded bg-zinc-900 text-xs">
            Domain
          </code>{' '}
          table.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
              <tr>
                <th className="py-2 px-3">NH_ID</th>
                <th className="py-2 px-3">Domain</th>
                <th className="py-2 px-3">Key</th>
                <th className="py-2 px-3">Engine Type</th>
                <th className="py-2 px-3">Env</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Expires</th>
                <th className="py-2 px-3">Repo</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d: DomainRow) => (
                <tr
                  key={d.id}
                  className="border-b border-gray-900 hover:bg-zinc-900/60"
                >
                  <td className="py-2 px-3 whitespace-nowrap">
                    {d.nhId || '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {d.domain}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {d.domainKey || '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {d.engineType || '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {d.env || '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs uppercase tracking-wide ${
                        d.status === 'live'
                          ? 'bg-emerald-900 text-emerald-200'
                          : d.status === 'parked'
                          ? 'bg-yellow-900 text-yellow-200'
                          : d.status === 'planned'
                          ? 'bg-sky-900 text-sky-200'
                          : 'bg-zinc-800 text-zinc-200'
                      }`}
                    >
                      {d.status || 'unknown'}
                    </span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-xs">
                    {d.expiresAt
                      ? d.expiresAt.toISOString().slice(0, 10)
                      : '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-xs">
                    {d.repo?.name || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
