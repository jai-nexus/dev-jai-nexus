// portal/src/app/domains/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";

function statusBadgeClasses(statusRaw: string | null) {
  const s = (statusRaw ?? "").toLowerCase();
  if (s === "live" || s === "active") return "bg-emerald-900 text-emerald-200";
  if (s === "parked") return "bg-yellow-900 text-yellow-200";
  if (s === "planned") return "bg-sky-900 text-sky-200";
  return "bg-zinc-800 text-zinc-200";
}

export default async function DomainsPage() {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";

  const domains = await prisma.domain.findMany({
    orderBy: [{ domain: "asc" }],
    include: { repo: true },
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">JAI NEXUS · Domains</h1>
          <p className="text-sm text-gray-400 mt-1">
            Domain registry from the Nexus DB (Domain table).
          </p>
        </div>

        {isAdmin ? (
          <Link
            href="/operator/registry/domains"
            className="rounded-md border border-gray-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
          >
            Manage Domains
          </Link>
        ) : null}
      </header>

      {domains.length === 0 ? (
        <p className="text-sm text-gray-400">
          No domains recorded yet.
          {isAdmin ? (
            <>
              {" "}
              Add them in{" "}
              <Link
                href="/operator/registry/domains"
                className="underline hover:text-gray-200"
              >
                Operator → Registry → Domains
              </Link>
              .
            </>
          ) : null}
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
              {domains.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-gray-900 hover:bg-zinc-900/60"
                >
                  <td className="py-2 px-3 whitespace-nowrap">{d.nhId ?? "—"}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{d.domain}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {d.domainKey ?? "—"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {d.engineType ?? "—"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{d.env ?? "—"}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs uppercase tracking-wide ${statusBadgeClasses(
                        d.status
                      )}`}
                    >
                      {d.status ?? "unknown"}
                    </span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-xs">
                    {d.expiresAt ? d.expiresAt.toISOString().slice(0, 10) : "—"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-xs">
                    {d.repo?.name ?? "—"}
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
