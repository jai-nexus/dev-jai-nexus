import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";
import type { WavePlan, WaveTask } from "@/lib/waves/types";

interface PageProps {
  params: { sessionId: string };
}

async function loadWavePlan(sessionIdParam: string) {
  const id = Number.parseInt(sessionIdParam, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const session = await prisma.pilotSession.findUnique({
    where: { id },
  });

  if (!session) {
    return null;
  }

  const planAction = await prisma.pilotAction.findFirst({
    where: {
      sessionId: session.id,
      actionType: "plan",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!planAction) {
    return { session, planAction: null, plan: null as WavePlan | null };
  }

  let plan: WavePlan | null = null;

  if (planAction.payload) {
    try {
      plan = JSON.parse(planAction.payload) as WavePlan;
    } catch {
      // Leave plan as null if payload isn't valid JSON
      plan = null;
    }
  }

  return { session, planAction, plan };
}

export default async function WaveDetailPage({ params }: PageProps) {
  const authSession = await getServerAuthSession();
  if (!authSession) {
    redirect("/login");
  }

  const data = await loadWavePlan(params.sessionId);

  if (!data) {
    notFound();
  }

  const { session, planAction, plan } = data;
  const projectKey = session.projectKey ?? "unknown";
  const waveLabel = session.waveLabel ?? "unknown";

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Wave {waveLabel} · {projectKey}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Pilot session #{session.id}
            {planAction
              ? ` · plan action #${planAction.id}`
              : " · no plan action yet"}
          </p>
        </div>

        <Link
          href="/operator/waves"
          className="text-sm text-gray-400 hover:text-gray-200 underline underline-offset-4"
        >
          ← Back to Waves
        </Link>
      </header>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-800 bg-zinc-950 p-4">
          <h2 className="text-sm font-semibold text-gray-300">Wave</h2>
          <dl className="mt-2 space-y-1 text-sm text-gray-400">
            <div className="flex justify-between">
              <dt>Project</dt>
              <dd className="font-mono text-gray-200">{projectKey}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Wave label</dt>
              <dd className="font-mono text-gray-200">{waveLabel}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Created</dt>
              <dd>{session.createdAt.toISOString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-gray-800 bg-zinc-950 p-4 md:col-span-2">
          <h2 className="text-sm font-semibold text-gray-300">Summary</h2>
          <p className="mt-2 text-sm text-gray-200">
            {plan?.summary ??
              "No parsed plan payload found for this wave. Check the associated PilotAction payload."}
          </p>
          {plan?.notes ? (
            <p className="mt-3 whitespace-pre-line text-xs text-gray-400">
              {plan.notes}
            </p>
          ) : null}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300">Tasks</h2>
          {planAction && (
            <span className="text-xs text-gray-500">
              action #{planAction.id} ·{" "}
              {planAction.createdAt.toISOString()}
            </span>
          )}
        </div>

        {!plan || !plan.tasks || plan.tasks.length === 0 ? (
          <p className="text-sm text-gray-500">
            No tasks found in this wave plan.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-zinc-950">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-300">
                    NH / ID
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-300">
                    Kind
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-300">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-300">
                    Title
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-300">
                    Target
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {plan.tasks.map((task: WaveTask) => (
                  <tr key={task.id}>
                    <td className="px-3 py-2 font-mono text-xs text-gray-300">
                      {task.nhId ?? task.id}
                    </td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs uppercase tracking-wide text-gray-200">
                        {task.kind}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="rounded-full border border-gray-700 px-2 py-0.5 text-xs uppercase tracking-wide text-gray-300">
                        {task.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-100">
                      {task.title}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-400">
                      {task.target ? (
                        <>
                          <span className="font-mono text-gray-300">
                            {task.target.kind}
                          </span>
                          {" · "}
                          <span className="font-mono">
                            {task.target.path}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
