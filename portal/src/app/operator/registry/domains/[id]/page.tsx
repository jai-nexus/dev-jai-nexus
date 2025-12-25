export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";

async function updateDomain(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const id = Number(formData.get("id"));
  if (!id) redirect("/operator/registry/domains");

  const domain = String(formData.get("domain") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim(); // never null
  const engineType = String(formData.get("engineType") ?? "").trim();
  const env = String(formData.get("env") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const repoIdRaw = String(formData.get("repoId") ?? "").trim();

  if (!domain) redirect(`/operator/registry/domains/${id}`);

  const repoId = repoIdRaw ? Number(repoIdRaw) : undefined;

  await prisma.domain.update({
    where: { id },
    data: {
      domain,
      ...(nhId ? { nhId } : {}),
      ...(engineType ? { engineType } : {}),
      ...(env ? { env } : {}),
      ...(status ? { status } : {}),
      ...(repoId ? { repo: { connect: { id: repoId } } } : {}),
    },
  });

  redirect("/operator/registry/domains");
}

async function deleteDomain(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const id = Number(formData.get("id"));
  if (!id) redirect("/operator/registry/domains");

  await prisma.domain.delete({ where: { id } });
  redirect("/operator/registry/domains");
}

export default async function EditDomainPage({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const id = Number(params.id);
  if (!id) notFound();

  const domainRow = await prisma.domain.findUnique({
    where: { id },
    include: { repo: true },
  });
  if (!domainRow) notFound();

  const repos = await prisma.repo.findMany({ orderBy: [{ name: "asc" }] });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Domain</h1>

      <form action={updateDomain} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={domainRow.id} />

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Domain</div>
          <input
            name="domain"
            defaultValue={domainRow.domain}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">NH_ID</div>
          <input
            name="nhId"
            defaultValue={domainRow.nhId}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Engine Type</div>
          <input
            name="engineType"
            defaultValue={domainRow.engineType ?? ""}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Env</div>
          <input
            name="env"
            defaultValue={domainRow.env ?? ""}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Status</div>
          <input
            name="status"
            defaultValue={domainRow.status ?? ""}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Repo</div>
          <select
            name="repoId"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            defaultValue={domainRow.repo?.id ?? ""}
          >
            <option value="">—</option>
            {repos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
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

      <form action={deleteDomain} className="max-w-xl mt-6">
        <input type="hidden" name="id" value={domainRow.id} />
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
