export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function WorkPage() {
  const packets = await prisma.workPacket.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { repo: true },
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Work Packets</h1>
          <p className="text-sm text-gray-400 mt-1">
            Architect AC/Plan → Builder PR → Verifier runs → Operator approves.
          </p>
        </div>

        <Link
          href="/operator/work/new"
          className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          New packet
        </Link>
      </header>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-zinc-950 border-b border-gray-800 text-left">
            <tr>
              <th className="py-2 px-3 text-xs text-gray-400">NH</th>
              <th className="py-2 px-3 text-xs text-gray-400">Title</th>
              <th className="py-2 px-3 text-xs text-gray-400">Status</th>
              <th className="py-2 px-3 text-xs text-gray-400">Repo</th>
              <th className="py-2 px-3 text-xs text-gray-400">Updated</th>
              <th className="py-2 px-3 text-xs text-gray-400">Links</th>
            </tr>
          </thead>
          <tbody>
            {packets.map((p) => (
              <tr key={p.id} className="border-b border-gray-900 hover:bg-zinc-900/60">
                <td className="py-2 px-3 whitespace-nowrap font-mono text-xs">{p.nhId}</td>
                <td className="py-2 px-3">
                  <Link href={`/operator/work/${p.id}`} className="text-sky-400 underline">
                    {p.title}
                  </Link>
                </td>
                <td className="py-2 px-3 text-xs">{p.status}</td>
                <td className="py-2 px-3 text-xs">{p.repo?.name ?? "—"}</td>
                <td className="py-2 px-3 text-xs">{p.updatedAt.toISOString()}</td>
                <td className="py-2 px-3 text-xs space-x-2">
                  {p.githubIssueUrl ? (
                    <a className="text-sky-400 underline" href={p.githubIssueUrl} target="_blank" rel="noreferrer">
                      issue
                    </a>
                  ) : null}
                  {p.githubPrUrl ? (
                    <a className="text-sky-400 underline" href={p.githubPrUrl} target="_blank" rel="noreferrer">
                      pr
                    </a>
                  ) : null}
                  {p.verificationUrl ? (
                    <a className="text-sky-400 underline" href={p.verificationUrl} target="_blank" rel="noreferrer">
                      verify
                    </a>
                  ) : null}
                  {!p.githubIssueUrl && !p.githubPrUrl && !p.verificationUrl ? "—" : null}
                </td>
              </tr>
            ))}
            {packets.length === 0 ? (
              <tr>
                <td className="py-6 px-3 text-sm text-gray-400" colSpan={6}>
                  No work packets yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
