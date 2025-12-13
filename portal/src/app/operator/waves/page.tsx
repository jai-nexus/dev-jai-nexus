// portal/src/app/operator/waves/page.tsx
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { WavePlan } from "@/lib/waves/types";

type WaveRow = {
  id: number;
  projectKey: string;
  waveLabel: string;
  summary: string;
  notes?: string;
  createdAt: Date;
  tasksCount: number;
  pendingCount: number;
  doneCount: number;
};

function parsePlan(payload: unknown): WavePlan | null {
  if (!payload) return null;
  try {
    if (typeof payload === "string") {
      return JSON.parse(payload) as WavePlan;
    }
    return payload as WavePlan;
  } catch {
    return null;
  }
}

export default async function WavesPage() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  // For now: take the most recent sessions, and for each one, use the latest action as its plan.
  const sessions = await prisma.pilotSession.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      actions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const rows: WaveRow[] = [];

  for (const s of sessions) {
    const latest = s.actions[0];
    if (!latest || !latest.payload) continue;

    const plan = parsePlan(latest.payload);
    if (!plan) continue;

    const tasks = plan.tasks ?? [];

    const pendingCount = tasks.filter((t) => t.status === "pending").length;
    const doneCount = tasks.filter((t) => t.status === "done").length;

    rows.push({
      id: s.id,
      projectKey: plan.projectKey,
      waveLabel: plan.waveLabel,
      summary: plan.summary,
      notes: plan.notes,
      createdAt: s.createdAt,
      tasksCount: tasks.length,
      pendingCount,
      doneCount,
    });
  }

  return (
    <main className="min-h-screen bg-black text-gray-100 px-8 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">JAI · Waves</h1>
        <p className="mt-1 text-sm text-gray-400">
          Wave plans logged via jai:wave:plan / jai:wave:apply.
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No wave sessions found yet. Run{" "}
          <code className="rounded bg-zinc-900 px-1 py-0.5 text-xs">
            npm run jai:wave:plan -- 2.1.2 W1.0 Wave 1.0 - tighten auth & internal agents
          </code>{" "}
          to seed one.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/60">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-4 py-3">Wave</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3">Tasks</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900/60"
                >
                  <td className="px-4 py-3 align-top font-mono text-xs text-emerald-300">
                    {row.projectKey}.{row.waveLabel}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-300">
                    {row.projectKey}
                  </td>
                  <td className="px-4 py-3 align-top text-sm text-gray-100">
                    <div className="font-medium">{row.summary}</div>
                    {row.notes ? (
                      <div className="mt-1 text-xs text-gray-400">
                        {row.notes}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-300">
                    <div>{row.tasksCount} total</div>
                    <div className="text-amber-300">
                      {row.pendingCount} pending
                    </div>
                    <div className="text-emerald-300">
                      {row.doneCount} done
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-400">
                    {row.createdAt.toISOString()}
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
