// portal/src/app/operator/work/[id]/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import crypto from "node:crypto";
import { diffWorkPacket, emitWorkPacketSotEvent } from "@/lib/sotWorkPackets";
import { WorkPacketStatus, type Prisma } from "../../../../../prisma/generated/prisma";

type Props = { params: { id: string } };

const ALLOWED_STATUSES = new Set(Object.values(WorkPacketStatus));

function parseStatus(value: unknown): WorkPacketStatus {
  const s = String(value ?? WorkPacketStatus.DRAFT).trim();
  return ALLOWED_STATUSES.has(s as WorkPacketStatus)
    ? (s as WorkPacketStatus)
    : WorkPacketStatus.DRAFT;
}

// JSON helpers (no `any`)
type JsonValue = Prisma.JsonValue;
type JsonObject = { [k: string]: JsonValue };

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
  const id = Number(params.id);
  if (!Number.isFinite(id)) redirect("/operator/work");

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");

  const p = await prisma.workPacket.findUnique({ where: { id } });
  if (!p) redirect("/operator/work");

  const WORK_PACKET_KINDS = [
    "WORK_PACKET_CREATED",
    "WORK_PACKET_UPDATED",
    "WORK_PACKET_STATUS_CHANGED",
  ] as const;

  // ✅ canonical anchor = workPacketId; legacy fallback = nhId (pre-backfill)
  const events = await prisma.sotEvent.findMany({
    where: {
      kind: { in: [...WORK_PACKET_KINDS] },
      OR: [{ workPacketId: p.id }, { workPacketId: null, nhId: p.nhId }],
    },
    orderBy: { ts: "desc" },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          {p.nhId} · {p.title}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Update AC/Plan, attach PR, mark status.
        </p>
      </header>

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
          <label className="block text-xs text-gray-300">
            Acceptance Criteria (AC)
          </label>
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

      {/* SoT Event Stream */}
      <section className="mt-10 max-w-4xl">
        <h2 className="text-lg font-semibold">SoT Event Stream</h2>
        <p className="mt-1 text-sm text-gray-400">
          Latest {events.length} events for WorkPacket{" "}
          <span className="font-mono">#{p.id}</span> (nhId:{" "}
          <span className="font-mono">{p.nhId}</span>)
        </p>

        <div className="mt-4 space-y-3">
          {events.length === 0 ? (
            <div className="rounded-md border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
              No events yet.
            </div>
          ) : (
            events.map((evt) => {
              const payload = evt.payload;
              const changes = getPayloadChanges(payload);

              return (
                <details
                  key={evt.id}
                  className="rounded-md border border-gray-800 bg-zinc-950 p-3"
                >
                  <summary className="cursor-pointer select-none">
                    <span className="font-mono text-xs text-gray-400">
                      {evt.ts.toISOString()}
                    </span>
                    <span className="ml-3 text-xs font-semibold text-gray-200">
                      {evt.kind}
                    </span>
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
