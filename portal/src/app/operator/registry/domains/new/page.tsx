export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";

async function createDomain(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const domain = String(formData.get("domain") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim(); // string, never null
  const engineType = String(formData.get("engineType") ?? "").trim();
  const env = String(formData.get("env") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const repoIdRaw = String(formData.get("repoId") ?? "").trim();

  if (!domain) redirect("/operator/registry/domains/new");

  const repoId = repoIdRaw ? Number(repoIdRaw) : undefined;

  await prisma.domain.create({
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

export default async function NewDomainPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const repos = await prisma.repo.findMany({ orderBy: [{ name: "asc" }] });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">New Domain</h1>

      <form action={createDomain} className="max-w-xl space-y-4">
        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Domain</div>
          <input
            name="domain"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            placeholder="infra.nexus"
            required
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">NH_ID</div>
          <input
            name="nhId"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            placeholder="2.1.5"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Engine Type</div>
          <input
            name="engineType"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            placeholder="docs | nextjs-portal | landing"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Env</div>
          <input
            name="env"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            placeholder="prod | stage | dev"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Status</div>
          <input
            name="status"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            placeholder="LIVE | PLANNED"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Repo</div>
          <select
            name="repoId"
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
            defaultValue=""
          >
            <option value="">—</option>
            {repos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
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
