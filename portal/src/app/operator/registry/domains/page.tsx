export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";

export default async function OperatorRegistryDomainsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const domains = await prisma.domain.findMany({
    include: { repo: true },
    orderBy: [{ domain: "asc" }],
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Operator · Registry · Domains</h1>
          <p className="text-sm text-gray-400 mt-1">DB-backed domain registry.</p>
        </div>

        <Link
          href="/operator/registry/domains/new"
          className="rounded-md border border-gray-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
        >
          + New Domain
        </Link>
      </header>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-zinc-950 border-b border-gray-800 text-left">
            <tr>
              <th className="py-2 px-3">Domain</th>
              <th className="py-2 px-3">NH_ID</th>
              <th className="py-2 px-3">Engine</th>
              <th className="py-2 px-3">Env</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Repo</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => (
              <tr
                key={d.id}
                className="border-b border-gray-900 hover:bg-zinc-900/60"
              >
                <td className="py-2 px-3 whitespace-nowrap">{d.domain}</td>
                <td className="py-2 px-3 whitespace-nowrap">{d.nhId}</td>
                <td className="py-2 px-3 whitespace-nowrap">{d.engineType ?? "—"}</td>
                <td className="py-2 px-3 whitespace-nowrap">{d.env ?? "—"}</td>
                <td className="py-2 px-3 whitespace-nowrap">{d.status ?? "—"}</td>
                <td className="py-2 px-3 whitespace-nowrap">{d.repo?.name ?? "—"}</td>
                <td className="py-2 px-3 whitespace-nowrap">
                  <Link
                    className="underline hover:text-white"
                    href={`/operator/registry/domains/${d.id}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {domains.length === 0 ? (
              <tr>
                <td className="py-6 px-3 text-gray-400" colSpan={7}>
                  No domains in DB.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
