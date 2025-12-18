export const runtime = "nodejs";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";

async function createPacket(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");

  const nhId = String(formData.get("nhId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const ac = String(formData.get("ac") ?? "").trim();
  const plan = String(formData.get("plan") ?? "").trim();

  if (!nhId || !title) return;

  const created = await prisma.workPacket.create({
    data: { nhId, title, ac, plan },
  });

  redirect(`/operator/work/${created.id}`);
}

export default function NewWorkPacketPage() {
  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">New Work Packet</h1>
        <p className="text-sm text-gray-400 mt-1">Minimum: NH + Title. AC/Plan recommended.</p>
      </header>

      <form action={createPacket} className="max-w-3xl space-y-4">
        <div className="space-y-1">
          <label className="block text-xs text-gray-300" htmlFor="nhId">
            NH ID
          </label>
          <input
            id="nhId"
            name="nhId"
            placeholder="1.2.3"
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            placeholder="Protect Context API + add Work Packets"
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300" htmlFor="ac">
            Acceptance Criteria (AC)
          </label>
          <textarea
            id="ac"
            name="ac"
            rows={6}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
            placeholder="- [ ] …"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300" htmlFor="plan">
            Plan
          </label>
          <textarea
            id="plan"
            name="plan"
            rows={6}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
            placeholder="1) …"
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
