// portal/src/app/operator/repos/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 0;

export default async function OperatorReposPage() {
  const repos = await prisma.repo.findMany({
    orderBy: [{ nhId: "asc" }],
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">JAI NEXUS · Repos</h1>
        <p className="text-sm text-gray-400 mt-1">
          Active repos registered with dev.jai.nexus.
        </p>
      </header>

      <div className="rounded-lg border border-gray-800 bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-800 bg-zinc-900 text-gray-400">
            <tr>
              <th className="px-4 py-2">NH ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Domain Pod</th>
              <th className="px-4 py-2">Engine</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Files</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((r) => (
              <tr
                key={r.id}
                className="border-b border-gray-900/60 hover:bg-zinc-900/60"
              >
                <td className="px-4 py-2 font-mono text-[11px]">{r.nhId}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span>{r.name}</span>
                    {r.githubUrl && (
                      <a
                        href={r.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-400 hover:underline"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-gray-300">{r.domainPod}</td>
                <td className="px-4 py-2 text-gray-300">{r.engineGroup}</td>
                <td className="px-4 py-2 text-gray-300">{r.status}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/operator/repos/${r.id}`}
                    className="text-[11px] text-sky-400 hover:underline"
                  >
                    View files →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
