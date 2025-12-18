// portal/src/app/operator/work/[id]/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";

type Props = { params: { id: string } };

const WORK_PACKET_STATUSES = [
  "DRAFT",
  "PLANNED",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "DONE",
] as const;

type WorkPacketStatusValue = (typeof WORK_PACKET_STATUSES)[number];

function coerceWorkPacketStatus(v: FormDataEntryValue | null): WorkPacketStatusValue {
  const raw = String(v ?? "DRAFT").trim().toUpperCase();
  return (WORK_PACKET_STATUSES as readonly string[]).includes(raw)
    ? (raw as WorkPacketStatusValue)
    : "DRAFT";
}

async function updatePacket(id: number, formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim();
  const status = coerceWorkPacketStatus(formData.get("status"));

  const ac = String(formData.get("ac") ?? "");
  const plan = String(formData.get("plan") ?? "");

  const githubIssueUrl =
    String(formData.get("githubIssueUrl") ?? "").trim() || null;
  const githubPrUrl =
    String(formData.get("githubPrUrl") ?? "").trim() || null;
  const verificationUrl =
    String(formData.get("verificationUrl") ?? "").trim() || null;

  await prisma.workPacket.update({
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

  redirect(`/operator/work/${id}`);
}

export default async function WorkPacketDetailPage({ params }: Props) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) redirect("/operator/work");

  const p = await prisma.workPacket.findUnique({ where: { id } });
  if (!p) redirect("/operator/work");

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs text-gray-300">NH</label>
            <input
              name="nhId"
              defaultValue={p.nhId}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
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
              {WORK_PACKET_STATUSES.map((s) => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </main>
  );
}
