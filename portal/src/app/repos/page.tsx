// portal/src/app/repos/page.tsx
export const dynamic = 'force-dynamic';

import { loadRepoConfigs } from '@/lib/reposConfig';

export default async function ReposPage() {
  const repos = loadRepoConfigs();

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">JAI NEXUS · Repos</h1>
        <p className="text-sm text-gray-400 mt-1">
          View of config/repos.yaml from dev-jai.nexus.
        </p>
      </header>

      {repos.length === 0 ? (
        <p className="text-sm text-gray-400">
          No repos found in config/repos.yaml.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
              <tr>
                <th className="py-2 px-3">NH_ID</th>
                <th className="py-2 px-3">Repo</th>
                <th className="py-2 px-3">Domain Pod</th>
                <th className="py-2 px-3">Engine Group</th>
                <th className="py-2 px-3">Language</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Owner</th>
              </tr>
            </thead>
            <tbody>
              {repos.map((r, i) => (
                <tr
                  key={`${r.repo}-${i}`}
                  className="border-b border-gray-900 hover:bg-zinc-900/60"
                >
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.nh_id ?? '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.repo}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.domain_pod ?? '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.engine_group ?? '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.language ?? '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.status ?? '—'}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.owner ?? '—'}
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
