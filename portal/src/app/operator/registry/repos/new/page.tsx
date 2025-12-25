// portal/src/app/operator/registry/repos/new/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import { normalizeRepoStatus } from "@/lib/registryEnums";

const REPO_STATUS_OPTIONS = ["active", "frozen", "planned", "parked"] as const;
type RepoStatus = (typeof REPO_STATUS_OPTIONS)[number];

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function optStr(v: FormDataEntryValue | null): string | null {
  const s = str(v);
  return s.length ? s : null;
}

async function requireAdmin() {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/repos");
}

async function createRepo(formData: FormData) {
  "use server";

  await requireAdmin();

  const name = str(formData.get("name"));
  if (!name) redirect("/operator/registry/repos/new");

  const nhId = str(formData.get("nhId"));
  const owner = optStr(formData.get("owner"));

  const description = optStr(formData.get("description"));
  const domainPod = optStr(formData.get("domainPod"));
  const engineGroup = optStr(formData.get("engineGroup"));
  const language = optStr(formData.get("language"));
  const githubUrl = optStr(formData.get("githubUrl"));
  const defaultBranch = optStr(formData.get("defaultBranch"));

  const status = normalizeRepoStatus(formData.get("status")) as RepoStatus;

  await prisma.repo.create({
    data: {
      name,
      nhId,
      status,
      owner,

      description,
      domainPod,
      engineGroup,
      language,
      githubUrl,
      defaultBranch,
    },
  });

  redirect("/operator/registry/repos");
}

export default async function NewRepoPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Operator · Registry · New Repo</h1>
        <p className="text-sm text-gray-400 mt-1">Create a DB-backed repo entry.</p>
      </header>

      <form action={createRepo} className="max-w-2xl space-y-4">
        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Repo (name)</div>
          <input
            name="name"
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="jai-nexus/dev-jai-nexus"
            required
          />
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-sm text-gray-300 mb-1">NH_ID</div>
            <input
              name="nhId"
              className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
              placeholder="1.2"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-300 mb-1">Status</div>
            <select
              name="status"
              defaultValue="planned"
              className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            >
              {REPO_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Owner</div>
          <input
            name="owner"
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="agent:1.0"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Description</div>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-sm text-gray-300 mb-1">Domain Pod</div>
            <input
              name="domainPod"
              className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
              placeholder="DEV / DOCS / NEXUS / ..."
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-300 mb-1">Engine Group</div>
            <input
              name="engineGroup"
              className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
              placeholder="operator-console / tooling / docs / ..."
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-300 mb-1">Language</div>
            <input
              name="language"
              className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
              placeholder="ts / md / py / ..."
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-300 mb-1">Default Branch</div>
            <input
              name="defaultBranch"
              className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
              placeholder="main"
            />
          </label>
        </div>

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">GitHub URL</div>
          <input
            name="githubUrl"
            className="w-full rounded-md border border-gray-800 bg-zinc-950 px-3 py-2 text-sm"
            placeholder="https://github.com/org/repo"
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
