// portal/src/app/operator/waves/[sessionId]/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";
import type { WavePlan, WaveTask } from "@/lib/waves/types";

interface PageProps {
  params: { sessionId: string };
}

// Prisma result helpers
type PilotSession = NonNullable<
  Awaited<ReturnType<typeof prisma.pilotSession.findUnique>>
>;

type PilotAction = NonNullable<
  Awaited<ReturnType<typeof prisma.pilotAction.findFirst>>
>;

type LoadedWavePlan = {
  session: PilotSession;
  planAction: PilotAction | null;
  plan: WavePlan | null;
};

async function loadWavePlan(
  sessionIdParam: string,
): Promise<LoadedWavePlan | null> {
  const id = Number.parseInt(sessionIdParam, 10);

  if (!Number.isFinite(id) || id <= 0) {
    console.warn("[WaveDetail] invalid sessionId param:", sessionIdParam);
    return null;
  }

  const session = await prisma.pilotSession.findUnique({
    where: { id },
  });

  if (!session) {
    console.warn("[WaveDetail] no session found for id:", id);
    return null;
  }

  const planAction = await prisma.pilotAction.findFirst({
    where: {
      sessionId: session.id,
      actionType: "plan",
    },
    orderBy: { createdAt: "desc" },
  });

  let plan: WavePlan | null = null;

  if (planAction?.payload) {
    try {
      plan = JSON.parse(planAction.payload) as WavePlan;
    } catch (err) {
      console.error("[WaveDetail] failed to parse plan JSON:", err);
    }
  }

  return {
    session,
    planAction: planAction ?? null,
    plan,
  };
}

export default async function WaveDetailPage({ params }: PageProps) {
  const authSession = await getServerAuthSession();
  if (!authSession) {
    redirect("/login");
  }

  console.log("[WaveDetail] params.sessionId =", params.sessionId);

  const data = await loadWavePlan(params.sessionId);

  // If the session truly isn't in the DB, show an explicit debug view
  if (!data) {
    return (
      <main className="min-h-screen bg-black text-gray-100 p-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Wave not found</h1>
            <p className="mt-1 text-sm text-gray-400">
              No Pilot session found for id{" "}
              <span className="font-mono">{params.sessionId}</span>.
            </p>
          </div>

          <Link
            href="/operator/waves"
            className="text-sm text-gray-400 hover:text-gray-200 underline underline-offset-4"
          >
            ← Back to Waves
          </Link>
        </header>

        <section className="rounded-lg border border-gray-800 bg-zinc-950 p-4">
          <h2 className="text-sm font-semibold text-gray-300">Debug</h2>
          <p className="mt-2 text-xs text-gray-400">
            This usually means the session id does not exist in the connected
            database, or it was created in a different environment / DB.
          </p>
        </section>
      </main>
    );
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
