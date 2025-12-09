// portal/src/app/operator/pilot/page.tsx
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PilotPage() {
  const sessions = await prisma.pilotSession.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { actions: { take: 10, orderBy: { ts: "desc" } } },
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">JAI Pilot · Sessions</h1>
        <p className="text-sm text-gray-400 mt-1">
          Recent Pilot sessions and actions recorded by dev.jai.nexus.
        </p>
      </header>

      <div className="space-y-6">
        {sessions.map((session) => (
          <section
            key={session.id}
            className="rounded-lg border border-gray-800 bg-zinc-950 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">
                  Session #{session.id} ·{" "}
                  <span className="text-sm text-gray-400">
                    {session.surface} · {session.mode}
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  Created by {session.createdBy} ·{" "}
                  {session.startedAt.toISOString()}
                </p>
                {session.projectKey && (
                  <p className="text-xs text-gray-500">
                    Project: {session.projectKey} · Wave:{" "}
                    {session.waveLabel ?? "—"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">
                Recent actions
              </h3>
              {session.actions.length === 0 ? (
                <p className="text-xs text-gray-500">No actions recorded.</p>
              ) : (
                <ul className="space-y-1 text-xs text-gray-300">
                  {session.actions.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-start justify-between gap-2"
                    >
                      <div>
                        <div>
                          <span className="font-mono text-[11px] text-gray-400 mr-2">
                            {a.ts.toISOString()}
                          </span>
                          <span className="inline-flex items-center rounded border border-gray-700 px-1 py-0.5 text-[10px] uppercase tracking-wide text-gray-300">
                            {a.mode} · {a.actionType}
                          </span>
                        </div>
                        <div className="mt-1">
                          {a.targetNodeId && (
                            <span className="text-[11px] text-gray-500">
                              target: {a.targetNodeId} ·{" "}
                            </span>
                          )}
                          <span className="text-[11px] text-gray-200">
                            {a.reason || "(no reason)"}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
