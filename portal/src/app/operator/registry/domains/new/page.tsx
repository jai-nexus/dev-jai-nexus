// portal/src/app/operator/registry/domains/new/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import {
  DOMAIN_ENVS,
  DOMAIN_STATUSES,
  normalizeDomainEnv,
  normalizeDomainStatus,
} from "@/lib/registryEnums";

async function createDomain(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const domain = String(formData.get("domain") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim();
  const domainKey = String(formData.get("domainKey") ?? "").trim();
  const engineType = String(formData.get("engineType") ?? "").trim();

  const status = normalizeDomainStatus(formData.get("status"));
  const env = normalizeDomainEnv(formData.get("env"));

  const repoIdRaw = String(formData.get("repoId") ?? "").trim();
  const repoId = repoIdRaw ? Number(repoIdRaw) : null;

  if (!domain) redirect("/operator/registry/domains/new");

  await prisma.domain.create({
    data: {
      domain,
      nhId,
      domainKey: domainKey || null,
      engineType: engineType || null,
      status,
      env, // ✅ DomainEnv | null
      ...(repoId ? { repo: { connect: { id: repoId } } } : {}),
    },
  });

  redirect("/operator/registry/domains");
}

export default async function NewDomainPage() {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const repos = await prisma.repo.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Operator · Registry · New Domain</h1>
        <p className="text-sm text-gray-400 mt-1">Create a DB-backed domain entry.</p>
      </header>

      <form action={createDomain} className="max-w-xl space-y-4">
        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Domain</div>
          <input
            name="domain"
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="dev.jai.nexus"
            required
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">NH_ID</div>
          <input
            name="nhId"
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="2.1.3"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Key</div>
          <input
            name="domainKey"
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="DEV"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Engine Type</div>
          <input
            name="engineType"
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="nextjs-portal"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Env</div>
          <select
            name="env"
            defaultValue=""
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="">—</option>
            {DOMAIN_ENVS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Status</div>
          <select
            name="status"
            defaultValue="planned"
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            {DOMAIN_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Repo</div>
          <select
            name="repoId"
            defaultValue=""
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
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
