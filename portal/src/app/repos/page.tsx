// portal/src/app/repos/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";

function statusBadgeClasses(statusRaw: string | null) {
  const s = (statusRaw ?? "").toLowerCase();
  if (s === "active" || s === "live") return "bg-emerald-900 text-emerald-200";
  if (s === "frozen") return "bg-sky-900 text-sky-200";
  if (s === "parked") return "bg-yellow-900 text-yellow-200";
  if (s === "planned") return "bg-zinc-800 text-zinc-200";
  return "bg-zinc-800 text-zinc-200";
}

export default async function ReposPage() {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";

  const repos = await prisma.repo.findMany({
    orderBy: [{ nhId: "asc" }, { name: "asc" }],
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">JAI NEXUS · Repos</h1>
          <p className="text-sm text-gray-400 mt-1">
            Repo registry from Nexus DB (Repo table).
          </p>
        </div>

        {isAdmin ? (
          <Link
            href="/operator/registry/repos"
            className="rounded-md border border-gray-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
          >
            Manage Repos
          </Link>
        ) : null}
      </header>

      {repos.length === 0 ? (
        <p className="text-sm text-gray-400">No repos found in DB.</p>
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
              {repos.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-900 hover:bg-zinc-900/60"
                >
                  <td className="py-2 px-3 whitespace-nowrap">{r.nhId ?? "—"}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{r.name}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.domainPod ?? "—"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.engineGroup ?? "—"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.language ?? "—"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs uppercase tracking-wide ${statusBadgeClasses(
                        r.status
                      )}`}
                    >
                      {r.status ?? "unknown"}
                    </span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{r.owner ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
