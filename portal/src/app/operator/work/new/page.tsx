// portal/src/app/operator/work/new/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import crypto from "node:crypto";
import { emitWorkPacketSotEvent } from "@/lib/sotWorkPackets";
import {
  InboxItemStatus,
  WorkPacketStatus,
  type Prisma,
} from "../../../../../prisma/generated/prisma";

async function createPacket(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user) redirect("/login");

  const nhId = String(formData.get("nhId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const ac = String(formData.get("ac") ?? "");
  const plan = String(formData.get("plan") ?? "");

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

    // ✅ Q1: enqueue a single backlog item (unassigned) so agents can claim it later
    const inboxItem = await tx.agentInboxItem.create({
      data: {
        status: InboxItemStatus.QUEUED,
        priority: 50,
        workPacket: { connect: { id: created.id } },
        // agentUserId intentionally omitted => unassigned backlog
        tags: [],
        // notes omitted => undefined
      },
      select: {
        id: true,
        status: true,
        priority: true,
      },
    });

    const data: Prisma.InputJsonValue = {
      workPacketId: created.id,
      nhId: created.nhId,
      title: created.title,
      status: created.status,
      ...(created.repoId != null ? { repoId: created.repoId } : {}),
      inbox: {
        inboxItemId: inboxItem.id,
        status: inboxItem.status,
        priority: inboxItem.priority,
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

export default async function NewWorkPacketPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">New Work Packet</h1>
        <p className="text-sm text-gray-400 mt-1">
          Minimum: NH + Title. AC/Plan recommended.
        </p>
      </header>

      <form action={createPacket} className="max-w-4xl space-y-4">
        <div className="space-y-1">
          <label className="block text-xs text-gray-300">NH ID</label>
          <input
            name="nhId"
            placeholder="1.2.3"
            required
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Title</label>
          <input
            name="title"
            placeholder="Protect Context API + add Work Packets"
            required
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">
            Acceptance Criteria (AC)
          </label>
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
