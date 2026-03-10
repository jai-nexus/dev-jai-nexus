export const runtime = "nodejs";
export const revalidate = 0;

import crypto from "node:crypto";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { diffWorkPacket, emitWorkPacketSotEvent } from "@/lib/sotWorkPackets";
import { WorkPacketStatus, type Prisma } from "@prisma/client";
import { getAgencyConfig } from "@/lib/agencyConfig";
import {
  coerceStringArray,
  deriveRequestedRoleFromAgentKey,
  getAssigneeFromTags,
} from "@/lib/work/workPacketContract";
import { computeWorkPacketControlState } from "@/lib/work/workPacketLifecycle";
import {
  DEBUG_LOOP_EVENT_KINDS,
  HANDOFF_EVENT_KINDS,
  RUNTIME_EVENT_KINDS,
  toHandoffEntry,
  toRunLedgerEntry,
} from "@/lib/work/agentRunContract";

type Props = {
  params: Promise<{ id: string }>;
};

const ALLOWED_STATUSES = new Set(Object.values(WorkPacketStatus));
const DEBUG_KIND_SET = new Set<string>([...DEBUG_LOOP_EVENT_KINDS]);
const RUNTIME_KIND_SET = new Set<string>([...RUNTIME_EVENT_KINDS]);
const HANDOFF_KIND_SET = new Set<string>([...HANDOFF_EVENT_KINDS]);

function parseStatus(value: unknown): WorkPacketStatus {
  const s = String(value ?? WorkPacketStatus.DRAFT).trim();
  return ALLOWED_STATUSES.has(s as WorkPacketStatus)
    ? (s as WorkPacketStatus)
    : WorkPacketStatus.DRAFT;
}

type JsonValue = Prisma.JsonValue;
type JsonObject = Record<string, JsonValue>;

function isJsonObject(v: JsonValue | null | undefined): v is JsonObject {
  return v !== null && v !== undefined && typeof v === "object" && !Array.isArray(v);
}

function getJsonProp(v: JsonValue | null | undefined, key: string): JsonValue | undefined {
  if (!isJsonObject(v)) return undefined;
  return v[key];
}

function getPayloadChanges(payload: JsonValue | null | undefined): JsonValue | undefined {
  const data = getJsonProp(payload, "data");
  return getJsonProp(data, "changes");
}

function toneForControl(tone: string) {
  if (tone === "emerald") return "bg-emerald-900/50 text-emerald-200 border-emerald-800";
  if (tone === "sky") return "bg-sky-900/50 text-sky-200 border-sky-800";
  if (tone === "amber") return "bg-amber-900/40 text-amber-200 border-amber-800";
  if (tone === "purple") return "bg-purple-900/50 text-purple-200 border-purple-800";
  if (tone === "red") return "bg-red-900/40 text-red-200 border-red-800";
  return "bg-zinc-900 text-gray-200 border-gray-800";
}

async function updatePacket(id: number, formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim();
  const status = parseStatus(formData.get("status"));
  const ac = String(formData.get("ac") ?? "");
  const plan = String(formData.get("plan") ?? "");

  const githubIssueUrl = String(formData.get("githubIssueUrl") ?? "").trim() || null;
  const githubPrUrl = String(formData.get("githubPrUrl") ?? "").trim() || null;
  const verificationUrl = String(formData.get("verificationUrl") ?? "").trim() || null;

  if (!nhId || !title) redirect(`/operator/work/${id}`);

  const mutationId = crypto.randomUUID();

  const result = await prisma.$transaction(async (tx) => {
    const before = await tx.workPacket.findUnique({ where: { id } });
    if (!before) return { type: "missing" as const };

    const after = await tx.workPacket.update({
      where: { id },
      data: {
        title,
        nhId,
        status,
        ac,
        plan,
        githubIssueUrl,
        githubPrUrl,
        verificationUrl,
      },
    });

    const { changes, statusChanged } = diffWorkPacket(before, after);

    if (!statusChanged && Object.keys(changes).length === 0) {
      return { type: "noop" as const };
    }

    const kind = statusChanged ? "WORK_PACKET_STATUS_CHANGED" : "WORK_PACKET_UPDATED";

    const summary = statusChanged
      ? `WorkPacket status: ${after.nhId} ${String(statusChanged.from)} → ${String(
        statusChanged.to,
      )}`
      : `WorkPacket updated: ${after.nhId} · ${after.title}`;

    const data: Prisma.InputJsonValue = {
      contract_version: "work-packet-0.1",
      workPacketId: after.id,
      changes,
      ...(statusChanged ? { statusChanged } : {}),
    };

    await emitWorkPacketSotEvent({
      db: tx,
      kind,
      nhId: after.nhId,
      repoId: after.repoId ?? null,
      summary,
      mutationId,
      workPacket: { id: after.id, nhId: after.nhId },
      actor: { email: user.email ?? null, name: user.name ?? null },
      data,
    });

    return { type: "ok" as const };
  });

  if (result.type === "missing") redirect("/operator/work");
  redirect(`/operator/work/${id}`);
}

export default async function WorkPacketDetailPage({ params }: Props) {
  const { id: idParam } = await params;

  const id = Number(idParam);
  if (!Number.isFinite(id)) redirect("/operator/work");

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");

  const p = await prisma.workPacket.findUnique({
    where: { id },
    include: { repo: true },
  });
  if (!p) redirect("/operator/work");

  const agency = getAgencyConfig();

  const latestInbox = await prisma.agentInboxItem.findFirst({
    where: { workPacketId: p.id },
    orderBy: { id: "desc" },
    select: {
      id: true,
      status: true,
      priority: true,
      tags: true,
    },
  });

  const assigneeNhId = getAssigneeFromTags(coerceStringArray(latestInbox?.tags));
  const assignedAgent = assigneeNhId
    ? agency.agents.find((a) => a.nh_id === assigneeNhId) ?? null
    : null;
  const requestedRole = deriveRequestedRoleFromAgentKey(assignedAgent?.agent_key ?? null);

  const WORK_PACKET_KINDS = [
    "WORK_PACKET_CREATED",
    "WORK_PACKET_UPDATED",
    "WORK_PACKET_STATUS_CHANGED",
    "WORK_DELEGATED",
  ] as const;

  const ALL_PACKET_KINDS = [
    ...WORK_PACKET_KINDS,
    ...RUNTIME_EVENT_KINDS,
    ...DEBUG_LOOP_EVENT_KINDS,
  ] as const;

  const packetEvents = await prisma.sotEvent.findMany({
    where: {
      kind: { in: [...ALL_PACKET_KINDS] },
      OR: [{ workPacketId: p.id }, { workPacketId: null, nhId: p.nhId }],
    },
    orderBy: { ts: "desc" },
    take: 200,
  });

  const mutationEvents = packetEvents.filter((evt) =>
    ["WORK_PACKET_CREATED", "WORK_PACKET_UPDATED", "WORK_PACKET_STATUS_CHANGED", "WORK_DELEGATED"].includes(evt.kind),
  );

  const runtimeAndDebugEvents = packetEvents.filter(
    (evt) => RUNTIME_KIND_SET.has(evt.kind) || DEBUG_KIND_SET.has(evt.kind),
  );

  const handoffEvents = packetEvents.filter((evt) => HANDOFF_KIND_SET.has(evt.kind));

  const latestRuntimeEvent = runtimeAndDebugEvents.find((evt) => RUNTIME_KIND_SET.has(evt.kind)) ?? null;
  const latestDebugEvent = runtimeAndDebugEvents.find((evt) => DEBUG_KIND_SET.has(evt.kind)) ?? null;

  const control = computeWorkPacketControlState({
    packetStatus: String(p.status),
    assigneeNhId,
    requestedRole,
    githubPrUrl: p.githubPrUrl ?? null,
    verificationUrl: p.verificationUrl ?? null,
    latestRuntimeKind: latestRuntimeEvent?.kind ?? null,
    latestDebugKind: latestDebugEvent?.kind ?? null,
  });

  const latestByKind = new Map<string, (typeof packetEvents)[number]>();
  for (const evt of packetEvents) {
    if (!latestByKind.has(evt.kind)) latestByKind.set(evt.kind, evt);
  }

  const checklist = DEBUG_LOOP_EVENT_KINDS.map((k) => ({
    kind: k,
    evt: latestByKind.get(k) ?? null,
  }));

  const completedCount = checklist.filter((x) => !!x.evt).length;

  const runLedger = runtimeAndDebugEvents.map((evt) =>
    toRunLedgerEntry({
      id: evt.id,
      kind: evt.kind,
      summary: evt.summary,
      ts: evt.ts,
      payload: evt.payload,
    }),
  );

  const handoffHistory = handoffEvents.map((evt) =>
    toHandoffEntry({
      id: evt.id,
      kind: evt.kind,
      summary: evt.summary,
      ts: evt.ts,
      payload: evt.payload,
    }),
  );

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          {p.nhId} · {p.title}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Contract summary, AC/Plan, run ledger, handoff history, and packet mutation stream.
        </p>
      </header>

      <section className="mb-8 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-md border border-gray-800 bg-zinc-950 p-4">
          <h2 className="text-sm font-semibold text-gray-200">Contract Summary</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-300">
            <div>
              <span className="text-gray-500">status:</span>{" "}
              <span className="font-mono">{p.status}</span>
            </div>
            <div>
              <span className="text-gray-500">repo:</span>{" "}
              <span className="font-mono">{p.repo?.name ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">assignee:</span>{" "}
              <span className="font-mono">{assigneeNhId ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">requested role:</span>{" "}
              <span className="font-mono">{requestedRole ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-500">inbox:</span>{" "}
              <span className="font-mono">
                {latestInbox ? `${String(latestInbox.status)} · p${String(latestInbox.priority)}` : "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">tags:</span>{" "}
              <span className="font-mono">
                {latestInbox ? coerceStringArray(latestInbox.tags).join(", ") || "—" : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-800 bg-zinc-950 p-4">
          <h2 className="text-sm font-semibold text-gray-200">Control State</h2>
          <div className="mt-3">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${toneForControl(control.tone)}`}>
              {control.phase}
            </span>
          </div>
          <div className="mt-3 text-sm text-gray-300">{control.reason}</div>
          <div className="mt-2 text-sm text-sky-300">{control.nextAction}</div>
          <div className="mt-4 text-xs text-gray-500">
            latest runtime: <span className="font-mono text-gray-300">{latestRuntimeEvent?.kind ?? "—"}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            latest debug: <span className="font-mono text-gray-300">{latestDebugEvent?.kind ?? "—"}</span>
          </div>
        </div>

        <div className="rounded-md border border-gray-800 bg-zinc-950 p-4">
          <h2 className="text-sm font-semibold text-gray-200">Debug Loop Coverage</h2>
          <div className="mt-3 text-sm text-gray-300">
            {completedCount}/{checklist.length} artifacts present
          </div>
          <div className="mt-3 space-y-1 text-xs text-gray-400">
            {checklist.map(({ kind, evt }) => (
              <div key={kind} className="flex items-center justify-between gap-4">
                <span className="font-mono">{kind}</span>
                <span className={evt ? "text-emerald-300" : "text-amber-300"}>
                  {evt ? "present" : "missing"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <form action={updatePacket.bind(null, p.id)} className="max-w-4xl space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-xs text-gray-300">NH</label>
            <input
              name="nhId"
              defaultValue={p.nhId}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs text-gray-300">Title</label>
            <input
              name="title"
              defaultValue={p.title}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-300">Status</label>
            <select
              name="status"
              defaultValue={p.status}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              {Object.values(WorkPacketStatus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Acceptance Criteria (AC)</label>
          <textarea
            name="ac"
            rows={8}
            defaultValue={p.ac}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Plan</label>
          <textarea
            name="plan"
            rows={8}
            defaultValue={p.plan}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-xs text-gray-300">GitHub Issue URL</label>
            <input
              name="githubIssueUrl"
              defaultValue={p.githubIssueUrl ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-300">GitHub PR URL</label>
            <input
              name="githubPrUrl"
              defaultValue={p.githubPrUrl ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-300">Verification URL</label>
            <input
              name="verificationUrl"
              defaultValue={p.verificationUrl ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          Save
        </button>
      </form>

      <section className="mt-10 max-w-6xl">
        <h2 className="text-lg font-semibold">Run Ledger</h2>
        <p className="mt-1 text-sm text-gray-400">
          Derived from runtime and debug SoT events linked to this packet.
        </p>

        <div className="mt-4 space-y-3">
          {runLedger.length === 0 ? (
            <div className="rounded-md border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
              No runtime or debug events yet.
            </div>
          ) : (
            runLedger.map((entry) => (
              <details key={entry.id} className="rounded-md border border-gray-800 bg-zinc-950 p-3">
                <summary className="cursor-pointer select-none">
                  <span className="font-mono text-xs text-gray-400">{entry.ts.toISOString()}</span>
                  <span className="ml-3 text-xs font-semibold text-gray-200">{entry.kind}</span>
                  <span className="ml-3 text-xs text-sky-300">{entry.role}</span>
                  <span className="ml-3 text-xs text-gray-400">{entry.status}</span>
                  {entry.agentNhId ? (
                    <span className="ml-3 font-mono text-xs text-purple-300">{entry.agentNhId}</span>
                  ) : null}
                  <span className="ml-3 text-sm text-gray-200">{entry.summary}</span>
                </summary>

                <div className="mt-3 text-xs text-gray-400">{entry.detail}</div>

                <pre className="mt-3 overflow-x-auto text-xs text-gray-200">
                  {JSON.stringify(entry.payload, null, 2)}
                </pre>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="mt-10 max-w-6xl">
        <h2 className="text-lg font-semibold">Handoff History</h2>
        <p className="mt-1 text-sm text-gray-400">
          Delegation and execution-lane handoff signals for this packet.
        </p>

        <div className="mt-4 space-y-3">
          {handoffHistory.length === 0 ? (
            <div className="rounded-md border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
              No handoff events yet.
            </div>
          ) : (
            handoffHistory.map((entry) => (
              <details key={entry.id} className="rounded-md border border-gray-800 bg-zinc-950 p-3">
                <summary className="cursor-pointer select-none">
                  <span className="font-mono text-xs text-gray-400">{entry.ts.toISOString()}</span>
                  <span className="ml-3 text-xs font-semibold text-gray-200">{entry.kind}</span>
                  <span className="ml-3 text-xs text-sky-300">{entry.role}</span>
                  <span className="ml-3 text-sm text-gray-200">{entry.summary}</span>
                </summary>

                <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-400 md:grid-cols-3">
                  <div>
                    <span className="text-gray-500">from:</span>{" "}
                    <span className="font-mono text-gray-200">{entry.fromAgentNhId ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">to:</span>{" "}
                    <span className="font-mono text-gray-200">{entry.toAgentNhId ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">role:</span>{" "}
                    <span className="font-mono text-gray-200">{entry.role}</span>
                  </div>
                </div>

                <pre className="mt-3 overflow-x-auto text-xs text-gray-200">
                  {JSON.stringify(entry.payload, null, 2)}
                </pre>
              </details>
            ))
          )}
        </div>
      </section>

      <section className="mt-10 max-w-6xl">
        <h2 className="text-lg font-semibold">SoT Event Stream</h2>
        <p className="mt-1 text-sm text-gray-400">
          Latest {mutationEvents.length} packet-linked events for WorkPacket <span className="font-mono">#{p.id}</span>.
        </p>

        <div className="mt-4 space-y-3">
          {mutationEvents.length === 0 ? (
            <div className="rounded-md border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
              No events yet.
            </div>
          ) : (
            mutationEvents.map((evt) => {
              const payload = evt.payload as JsonValue | null;
              const changes = getPayloadChanges(payload);

              return (
                <details key={evt.id} className="rounded-md border border-gray-800 bg-zinc-950 p-3">
                  <summary className="cursor-pointer select-none">
                    <span className="font-mono text-xs text-gray-400">
                      {evt.ts.toISOString()}
                    </span>
                    <span className="ml-3 text-xs font-semibold text-gray-200">{evt.kind}</span>
                    {evt.summary ? (
                      <span className="ml-3 text-sm text-gray-200">{evt.summary}</span>
                    ) : null}
                  </summary>

                  <pre className="mt-3 overflow-x-auto text-xs text-gray-200">
                    {JSON.stringify(changes ?? payload, null, 2)}
                  </pre>
                </details>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
