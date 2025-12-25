export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";

async function updateRepo(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim(); // never null
  const status = String(formData.get("status") ?? "").trim();
  const owner = String(formData.get("owner") ?? "").trim();

  if (!id || !name) redirect("/operator/registry/repos");

  await prisma.repo.update({
    where: { id },
    data: {
      name,
      ...(nhId ? { nhId } : {}),
      ...(status ? { status } : {}),
      ...(owner ? { owner } : {}),
    },
  });

  redirect("/operator/registry/repos");
}

async function deleteRepo(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const id = Number(formData.get("id"));
  if (!id) redirect("/operator/registry/repos");

  await prisma.repo.delete({ where: { id } });
  redirect("/operator/registry/repos");
}

export default async function EditRepoPage({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const id = Number(params.id);
  if (!id) notFound();

  const repo = await prisma.repo.findUnique({ where: { id } });
  if (!repo) notFound();

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Repo</h1>

      <form action={updateRepo} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={repo.id} />

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Repo (name)</div>
          <input
            name="name"
            defaultValue={repo.name}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">NH_ID</div>
          <input
            name="nhId"
            defaultValue={repo.nhId}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Status</div>
          <input
            name="status"
            defaultValue={repo.status ?? ""}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Owner</div>
          <input
            name="owner"
            defaultValue={repo.owner ?? ""}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </label>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="submit"
            className="rounded-md border border-gray-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
          >
            Save
          </button>
        </div>
      </form>

      <form action={deleteRepo} className="max-w-xl mt-6">
        <input type="hidden" name="id" value={repo.id} />
        <button
          type="submit"
          className="rounded-md border border-red-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
        >
          Delete
        </button>
      </form>
    </main>
  );
}
