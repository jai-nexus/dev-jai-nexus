// portal/src/app/operator/waves/[sessionId]/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
} from "@/components/operator/slate";
import { getServerAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { WavePlan, WaveTask } from "@/lib/waves/types";

interface PageProps {
  params: { sessionId: string };
}

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

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
        <header className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / operator / waves / detail
            </div>
            <h1 className="mt-2 text-2xl font-semibold">Wave not found</h1>
            <p className="mt-2 text-sm text-slate-400">
              No Pilot session found for id{" "}
              <span className="font-mono">{params.sessionId}</span>.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Wave Detail Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Create tasks</OperatorBlockedAction>
              <OperatorBlockedAction>Mutate session</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Dashboard display does not authorize. Read-only is not authority.
            </p>
          </OperatorSafetyRail>
        </header>

        <OperatorPanel className="p-4">
          <OperatorSectionHeader
            index="01"
            title="Debug"
            right={<OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>}
          />
          <p className="text-xs text-slate-400">
            This usually means the session id does not exist in the connected
            database, or it was created in a different environment / DB.
          </p>
          <Link
            href="/operator/waves"
            className="mt-4 inline-flex text-sm text-sky-300 underline hover:text-sky-200"
          >
            Back to Waves
          </Link>
        </OperatorPanel>
      </main>
    );
  }

  const { session, planAction, plan } = data;
  const projectKey = session.projectKey ?? "unknown";
  const waveLabel = session.waveLabel ?? "unknown";

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <header className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <OperatorPanel className="p-5">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            dev.jai.nexus / operator / waves / detail
          </div>
          <h1 className="mt-2 text-2xl font-semibold">
            Wave {waveLabel} / {projectKey}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Pilot session #{session.id}
            {planAction
              ? ` / plan action #${planAction.id}`
              : " / no plan action yet"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
            <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
            <OperatorBadge tone="advisory">PLANNING SPINE</OperatorBadge>
            <OperatorBadge tone="blocked">NO SESSION MUTATION</OperatorBadge>
            <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
            <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
          </div>
          <Link
            href="/operator/waves"
            className="mt-4 inline-flex text-sm text-sky-300 underline hover:text-sky-200"
          >
            Back to Waves
          </Link>
        </OperatorPanel>

        <OperatorSafetyRail
          title="Wave Detail Safety"
          invariants={OPERATOR_SAFETY_INVARIANTS}
        >
          <div className="flex flex-wrap gap-2">
            <OperatorBlockedAction>Dispatch wave</OperatorBlockedAction>
            <OperatorBlockedAction>Create receipt</OperatorBlockedAction>
            <OperatorBlockedAction>Update canon</OperatorBlockedAction>
          </div>
          <p className="text-xs text-slate-400">
            Routes recommend; they do not execute. Validation is not acceptance.
          </p>
        </OperatorSafetyRail>
      </header>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <OperatorPanel className="p-4">
          <OperatorSectionHeader
            index="01"
            title="Wave"
            right={<OperatorBadge tone="readOnly">READ-ONLY DB</OperatorBadge>}
          />
          <dl className="space-y-1 text-sm text-slate-400">
            <div className="flex justify-between">
              <dt>Project</dt>
              <dd className="font-mono text-slate-200">{projectKey}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Wave label</dt>
              <dd className="font-mono text-slate-200">{waveLabel}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Created</dt>
              <dd>{session.createdAt.toISOString()}</dd>
            </div>
          </dl>
        </OperatorPanel>

        <OperatorPanel className="p-4 md:col-span-2">
          <OperatorSectionHeader
            index="02"
            title="Summary"
            right={<OperatorBadge tone="advisory">PLAN DISPLAY</OperatorBadge>}
          />
          <p className="text-sm text-slate-200">
            {plan?.summary ??
              "No parsed plan payload found for this wave. Check the associated PilotAction payload."}
          </p>
          {plan?.notes ? (
            <p className="mt-3 whitespace-pre-line text-xs text-slate-400">
              {plan.notes}
            </p>
          ) : null}
        </OperatorPanel>
      </section>

      <OperatorPanel>
        <OperatorSectionHeader
          index="03"
          title="Tasks"
          right={
            <>
              <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">NOT EXECUTION</OperatorBadge>
              {planAction ? (
                <OperatorIdChip>action #{planAction.id}</OperatorIdChip>
              ) : null}
            </>
          }
        />
        {planAction ? (
          <p className="mb-4 text-xs text-slate-500">
            Latest plan action created {planAction.createdAt.toISOString()}.
            Displaying this plan does not create acceptance, a receipt, or
            canon.
          </p>
        ) : null}

        {!plan || !plan.tasks || plan.tasks.length === 0 ? (
          <OperatorGateCard>
            <OperatorBadge tone="readOnly">READ-ONLY / EMPTY</OperatorBadge>
            <p className="mt-2 text-sm text-slate-500">
              No tasks found in this wave plan.
            </p>
          </OperatorGateCard>
        ) : (
          <div className="overflow-hidden rounded border border-slate-800 bg-slate-900">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-950/60">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-300">
                    NH / ID
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-300">
                    Kind
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-300">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-300">
                    Title
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-300">
                    Target
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {plan.tasks.map((task: WaveTask) => (
                  <tr key={task.id}>
                    <td className="px-3 py-2">
                      <OperatorIdChip>{task.nhId ?? task.id}</OperatorIdChip>
                    </td>
                    <td className="px-3 py-2">
                      <OperatorBadge tone="neutral">{task.kind}</OperatorBadge>
                    </td>
                    <td className="px-3 py-2">
                      <OperatorStatusChip
                        status={task.status}
                        tone="advisory"
                      />
                    </td>
                    <td className="px-3 py-2 text-slate-100">
                      {task.title}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-400">
                      {task.target ? (
                        <>
                          <span className="font-mono text-slate-300">
                            {task.target.kind}
                          </span>
                          {" / "}
                          <span className="font-mono">
                            {task.target.path}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </OperatorPanel>
    </main>
  );
}
