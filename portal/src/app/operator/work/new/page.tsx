// portal/src/app/operator/work/new/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import crypto from "node:crypto";
import { emitWorkPacketSotEvent } from "@/lib/sotWorkPackets";
import { getAgencyConfig } from "@/lib/agencyConfig";
import {
  InboxItemStatus,
  WorkPacketStatus,
  type Prisma,
} from "@prisma/client";

type SearchParamValue = string | string[] | undefined;

type Props = {
  searchParams?: Promise<{
    assignee?: SearchParamValue;
    nhId?: SearchParamValue;
    title?: SearchParamValue;
  }>;
};

function firstParam(v: SearchParamValue): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function sanitizeNh(v: string | undefined): string | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  if (!/^\d+(\.\d+)*$/.test(s)) return null;
  return s;
}

async function createPacket(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user) redirect("/login");

  const nhId = String(formData.get("nhId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const ac = String(formData.get("ac") ?? "");
  const plan = String(formData.get("plan") ?? "");

  const assigneeNhId = sanitizeNh(String(formData.get("assigneeNhId") ?? ""));

  if (!nhId || !title) redirect("/operator/work/new");

  const mutationId = crypto.randomUUID();

  const created = await prisma.$transaction(async (tx) => {
    const created = await tx.workPacket.create({
      data: {
        nhId,
        title,
        ac,
        plan,
        status: WorkPacketStatus.DRAFT,
      },
    });

    const tags: string[] = [];
    if (assigneeNhId) tags.push(`assignee:${assigneeNhId}`);

    const inbox = await tx.agentInboxItem.create({
      data: {
        workPacketId: created.id,
        status: InboxItemStatus.QUEUED,
        priority: 50,
        tags,
      },
      select: { id: true, status: true, priority: true, tags: true },
    });

    const data: Prisma.InputJsonValue = {
      workPacketId: created.id,
      nhId: created.nhId,
      title: created.title,
      status: created.status,
      ...(created.repoId != null ? { repoId: created.repoId } : {}),
      ...(assigneeNhId ? { assigneeNhId } : {}),
      inbox: {
        inboxItemId: inbox.id,
        status: inbox.status,
        priority: inbox.priority,
        tags: inbox.tags,
      },
    };

    await emitWorkPacketSotEvent({
      db: tx,
      kind: "WORK_PACKET_CREATED",
      nhId: created.nhId,
      repoId: created.repoId ?? null,
      summary: `WorkPacket created: ${created.nhId} · ${created.title}`,
      mutationId,
      workPacket: { id: created.id, nhId: created.nhId },
      actor: { email: user.email ?? null, name: user.name ?? null },
      data,
    });

    return created;
  });

  redirect(`/operator/work/${created.id}`);
}

export default async function NewWorkPacketPage({ searchParams }: Props) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login?next=/operator/work/new");

  const sp = await Promise.resolve(searchParams);

  const prefillNh = firstParam(sp?.nhId);
  const prefillTitle = firstParam(sp?.title);

  const agency = getAgencyConfig();
  const agents = [...agency.agents].sort((a, b) => a.nh_id.localeCompare(b.nh_id));

  const assigneeFromQuery = sanitizeNh(firstParam(sp?.assignee));
  const assigneeIsValid =
    !!assigneeFromQuery && agents.some((a) => a.nh_id === assigneeFromQuery);

  const defaultAssignee = assigneeIsValid ? assigneeFromQuery : "";

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">New Work Packet</h1>
        <p className="text-sm text-gray-400 mt-1">
          Minimum: NH + Title. AC/Plan recommended. Optional: assign to an agent.
        </p>
      </header>

      <form action={createPacket} className="max-w-4xl space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs text-gray-300">NH ID</label>
            <input
              name="nhId"
              placeholder="1.2.3"
              required
              defaultValue={prefillNh ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-300">Assignee</label>
            <select
              name="assigneeNhId"
              defaultValue={defaultAssignee}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              <option value="">— Unassigned —</option>
              {agents.map((a) => (
                <option key={a.nh_id} value={a.nh_id}>
                  {a.nh_id} · {a.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500">
              Delegation is recorded as an inbox tag{" "}
              <span className="font-mono">assignee:&lt;nh&gt;</span> + included in the SoT
              event payload.
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Title</label>
          <input
            name="title"
            placeholder="Protect Context API + add Work Packets"
            required
            defaultValue={prefillTitle ?? ""}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Acceptance Criteria (AC)</label>
          <textarea
            name="ac"
            rows={8}
            defaultValue={"- [ ] ..."}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Plan</label>
          <textarea
            name="plan"
            rows={8}
            defaultValue={"1) ..."}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          Create packet
        </button>
      </form>
    </main>
  );
}
