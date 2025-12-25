export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";

async function createRepo(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const name = String(formData.get("name") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim(); // string, never null
  const status = String(formData.get("status") ?? "").trim();
  const owner = String(formData.get("owner") ?? "").trim();

  if (!name) redirect("/operator/registry/repos/new");

  await prisma.repo.create({
    data: {
      name,
      ...(nhId ? { nhId } : {}),
      ...(status ? { status } : {}),
      ...(owner ? { owner } : {}),
    },
  });

  redirect("/operator/registry/repos");
}

export default async function NewRepoPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">New Repo</h1>

      <form action={createRepo} className="max-w-xl space-y-4">
        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Repo (name)</div>
          <input
            name="name"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            placeholder="jai-nexus/dev-jai-nexus"
            required
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">NH_ID</div>
          <input
            name="nhId"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            placeholder="1.2"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Status</div>
          <input
            name="status"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            placeholder="active | frozen | planned"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Owner</div>
          <input
            name="owner"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            placeholder="Jerry Ingram"
          />
        </label>

        <button
          type="submit"
          className="rounded-md border border-gray-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
        >
          Create
        </button>
      </form>
    </main>
  );
}
