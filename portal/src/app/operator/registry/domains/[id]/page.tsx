// portal/src/app/operator/registry/domains/[id]/page.tsx
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

function parseDateOnly(v: FormDataEntryValue | null): Date | null {
  const s = String(v ?? "").trim();
  if (!s) return null;

  // expects YYYY-MM-DD
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isFinite(d.getTime()) ? d : null;
}

async function updateDomain(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) redirect("/operator/registry/domains");

  const domain = String(formData.get("domain") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim();
  const domainKey = String(formData.get("domainKey") ?? "").trim();
  const engineType = String(formData.get("engineType") ?? "").trim();

  // ✅ keep enum-typed normalizers (fixes TS2322)
  const status = normalizeDomainStatus(formData.get("status"));
  const env = normalizeDomainEnv(formData.get("env"));

  const expiresAt = parseDateOnly(formData.get("expiresAt"));

  const repoIdRaw = String(formData.get("repoId") ?? "").trim();
  const repoId = repoIdRaw ? Number(repoIdRaw) : null;

  if (!domain) redirect(`/operator/registry/domains/${id}`);

  await prisma.domain.update({
    where: { id },
    data: {
      domain,
      nhId,
      domainKey: domainKey || null,
      engineType: engineType || null,
      status, // DomainStatus | null
      env, // DomainEnv | null
      expiresAt,
      repo: repoId ? { connect: { id: repoId } } : { disconnect: true },
    },
  });

  redirect("/operator/registry/domains");
}

async function deleteDomain(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) redirect("/operator/registry/domains");

  await prisma.domain.delete({ where: { id } });
  redirect("/operator/registry/domains");
}

export default async function EditDomainPage({
  params,
}: {
  // ✅ Next.js 16: params may be a Promise in server components
  params: { id: string } | Promise<{ id: string }>;
}) {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) redirect("/operator/registry/domains");

  const domainRow = await prisma.domain.findUnique({
    where: { id },
    include: { repo: true },
  });
  if (!domainRow) redirect("/operator/registry/domains");

  const repos = await prisma.repo.findMany({
    orderBy: [{ name: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">
          Operator · Registry · Edit Domain
        </h1>
        <p className="text-sm text-gray-400 mt-1">{domainRow.domain}</p>
      </header>

      <form action={updateDomain} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={domainRow.id} />

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Domain</div>
          <input
            name="domain"
            defaultValue={domainRow.domain}
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">NH_ID</div>
          <input
            name="nhId"
            defaultValue={domainRow.nhId ?? ""}
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="1.2.3"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Key</div>
          <input
            name="domainKey"
            defaultValue={domainRow.domainKey ?? ""}
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="infra"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Engine Type</div>
          <input
            name="engineType"
            defaultValue={domainRow.engineType ?? ""}
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="nextjs | worker | static | api"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Env</div>
          <select
            name="env"
            defaultValue={domainRow.env ?? ""}
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
            defaultValue={String(domainRow.status ?? "planned")}
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
          <div className="text-sm text-gray-300 mb-1">Expires</div>
          <input
            type="date"
            name="expiresAt"
            defaultValue={
              domainRow.expiresAt
                ? domainRow.expiresAt.toISOString().slice(0, 10)
                : ""
            }
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Repo</div>
          <select
            name="repoId"
            defaultValue={domainRow.repoId ? String(domainRow.repoId) : ""}
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
          >
            <option value="">—</option>
            {repos.map((r) => (
              <option key={r.id} value={String(r.id)}>
                {r.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="rounded-md border border-gray-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
        >
          Save
        </button>
      </form>

      <form action={deleteDomain} className="max-w-xl mt-6">
        <input type="hidden" name="id" value={domainRow.id} />
        <button
          type="submit"
          className="rounded-md border border-red-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-red-950"
        >
          Delete
        </button>
      </form>
    </main>
  );
}
