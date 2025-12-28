// portal/src/app/operator/registry/repos/[id]/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/internalAuth";
import { RepoStatus } from "@/lib/dbEnums";
import { REPO_STATUS_ORDER } from "@/lib/registryEnums";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function saveRepo(formData: FormData) {
  "use server";
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) redirect("/operator/registry/repos");

  const nhId = String(formData.get("nhId") ?? "").trim() || "0.0";
  const name = String(formData.get("name") ?? "").trim();
  const githubUrl = String(formData.get("githubUrl") ?? "").trim() || null;
  const defaultBranch = String(formData.get("defaultBranch") ?? "").trim() || null;

  const statusRaw = String(formData.get("status") ?? "").trim();
  const status = (RepoStatus as any)[statusRaw] ? (RepoStatus as any)[statusRaw] : RepoStatus.PLANNED;

  if (!name) redirect(`/operator/registry/repos/${id}`);

  await prisma.repo.update({
    where: { id },
    data: {
      name,
      nhId,
      status,
      githubUrl,
      defaultBranch,
    },
  });

  redirect("/operator/registry/repos");
}

export default async function EditRepoPage({ params }: PageProps) {
  await requireAdmin();

  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) redirect("/operator/registry/repos");

  const repo = await prisma.repo.findUnique({ where: { id } });
  if (!repo) redirect("/operator/registry/repos");

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Repo</h1>

      <form action={saveRepo} className="max-w-2xl space-y-4">
        <input type="hidden" name="id" value={repo.id} />

        <div>
          <label className="block text-xs text-gray-400 mb-1">Repo</label>
          <input
            name="name"
            defaultValue={repo.name}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">NH_ID</label>
          <input
            name="nhId"
            defaultValue={repo.nhId}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Status</label>
          <select
            name="status"
            defaultValue={String(repo.status)}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          >
            {REPO_STATUS_ORDER.map((s) => (
              <option key={String(s)} value={String(s)}>
                {String(s)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">GitHub URL</label>
          <input
            name="githubUrl"
            defaultValue={repo.githubUrl ?? ""}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Default branch</label>
          <input
            name="defaultBranch"
            defaultValue={repo.defaultBranch ?? ""}
            className="w-full rounded-md bg-zinc-950 border border-gray-800 px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm">
            Save
          </button>
          <a className="text-sm text-gray-300 underline" href="/operator/registry/repos">
            Cancel
          </a>
        </div>
      </form>
    </main>
  );
}
