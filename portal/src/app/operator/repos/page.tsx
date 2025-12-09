import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ReposPage() {
  const repos = await prisma.repo.findMany({
    orderBy: [{ nhId: "asc" }, { name: "asc" }],
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Repos</h1>
        <p className="text-sm text-gray-400 mt-1">
          {repos.length} repos in registry.
        </p>
      </header>

      <div className="rounded-lg border border-gray-800 bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-800 bg-zinc-900 text-gray-400">
            <tr>
              <th className="px-4 py-2">NH_ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Domain Pod</th>
              <th className="px-4 py-2">Engine Group</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo) => (
              <tr
                key={repo.id}
                className="border-b border-gray-900/60 hover:bg-zinc-900/60"
              >
                <td className="px-4 py-1 font-mono text-[11px]">
                  {repo.nhId || "—"}
                </td>
                <td className="px-4 py-1">
                  <Link
                    href={`/operator/repos/${repo.id}`}
                    className="text-blue-300 hover:underline"
                  >
                    {repo.name}
                  </Link>
                </td>
                <td className="px-4 py-1 text-gray-300">
                  {repo.domainPod || "—"}
                </td>
                <td className="px-4 py-1 text-gray-300">
                  {repo.engineGroup || "—"}
                </td>
                <td className="px-4 py-1 text-gray-300">
                  {repo.status || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
