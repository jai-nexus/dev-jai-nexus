// portal/src/app/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCentral, formatCentralTooltip } from "@/lib/time";

export default async function HomePage() {
  const runs = await prisma.syncRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { repo: true },
  });

  type SyncRunRow = (typeof runs)[number];

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">JAI NEXUS · dev.jai.nexus</h1>
          <p className="mt-1 text-sm text-gray-400">
            Control plane for sync runs and operator views across the Nexus.
          </p>
        </div>
      </header>

      {/* Operator shortcuts */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-medium">Operator views</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/operator/events"
            className="rounded-lg border border-gray-800 bg-zinc-950 p-4 text-sm hover:border-sky-700 hover:bg-zinc-900/80"
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Events
            </div>
            <div className="text-sm font-medium text-gray-100">
              Stream-of-record (SoT) events
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Inspect ingest, audit, and product events across the Nexus.
            </p>
          </Link>

          <Link
            href="/operator/agents"
            className="rounded-lg border border-gray-800 bg-zinc-950 p-4 text-sm hover:border-sky-700 hover:bg-zinc-900/80"
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Agency
            </div>
            <div className="text-sm font-medium text-gray-100">
              Agents & delegation
            </div>
            <p className="mt-1 text-xs text-gray-400">
              View NH-based agents, tiers, scopes, and delegation rules.
            </p>
          </Link>

          <Link
            href="/operator/projects"
            className="rounded-lg border border-gray-800 bg-zinc-950 p-4 text-sm hover:border-sky-700 hover:bg-zinc-900/80"
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Projects
            </div>
            <div className="text-sm font-medium text-gray-100">
              Project registry
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Browse all NH-rooted projects (core, portal, OffBook, Autopilot).
            </p>
          </Link>
        </div>
      </section>

      {/* Sync runs table */}
      {runs.length === 0 ? (
        <p className="text-sm text-gray-400">
          No sync runs recorded yet. Hit the{" "}
          <code className="text-[11px] text-gray-300">/api/sync-report</code>{" "}
          endpoint to register the first run.
        </p>
      ) : (
        <section>
          <h2 className="mb-3 text-lg font-medium">
            Recent sync runs
            <span className="ml-2 text-xs text-gray-500">
              (America/Chicago)
            </span>
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b border-gray-800 bg-zinc-950 text-left">
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
              <tbody suppressHydrationWarning>
                {runs.map((run: SyncRunRow) => (
                  <tr
                    key={run.id}
                    className="border-b border-gray-900 hover:bg-zinc-900/60"
                  >
                    <td
                      className="whitespace-nowrap py-2 px-3 text-xs"
                      title={formatCentralTooltip(run.startedAt)}
                    >
                      {formatCentral(run.startedAt)}
                    </td>
                    <td className="whitespace-nowrap py-2 px-3">
                      {run.repo?.name ?? "—"}
                    </td>
                    <td className="py-2 px-3">{run.type}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs uppercase tracking-wide ${
                          run.status === "success"
                            ? "bg-emerald-900 text-emerald-200"
                            : run.status === "failed"
                            ? "bg-red-900 text-red-200"
                            : "bg-yellow-900 text-yellow-200"
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {run.trigger ?? "—"}
                    </td>
                    <td className="max-w-xs truncate py-2 px-3">
                      {run.summary ?? "—"}
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
                        "—"
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
