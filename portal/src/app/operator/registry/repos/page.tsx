export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";
import { loadRepoConfigs } from "@/lib/reposConfig";

async function importReposFromYaml() {
  "use server";

  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const yamlRepos = loadRepoConfigs();

  for (const r of yamlRepos) {
    const name = r.repo.trim();
    if (!name) continue;

    const nhId = (r.nh_id ?? "").trim();
    const status = (r.status ?? "").trim();

    await prisma.repo.upsert({
      where: { name },
      update: {
        // never null
        ...(nhId ? { nhId } : {}),
        ...(status ? { status } : {}),
      },
      create: {
        name,
        ...(nhId ? { nhId } : {}),
        ...(status ? { status } : {}),
      },
    });
  }

  redirect("/operator/registry/repos");
}

export default async function OperatorRegistryReposPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  const isAdmin = session.user.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/operator");

  const repos = await prisma.repo.findMany({
    orderBy: [{ name: "asc" }],
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Operator · Registry · Repos</h1>
          <p className="text-sm text-gray-400 mt-1">DB-backed repo registry.</p>
        </div>

        <div className="flex items-center gap-2">
          <form action={importReposFromYaml}>
            <button
              type="submit"
              className="rounded-md border border-gray-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
            >
              Import from repos.yaml
            </button>
          </form>

          <Link
            href="/operator/registry/repos/new"
            className="rounded-md border border-gray-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
          >
            + New Repo
          </Link>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-zinc-950 border-b border-gray-800 text-left">
            <tr>
              <th className="py-2 px-3">Repo</th>
              <th className="py-2 px-3">NH_ID</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Owner</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((r) => (
              <tr
                key={r.id}
                className="border-b border-gray-900 hover:bg-zinc-900/60"
              >
                <td className="py-2 px-3 whitespace-nowrap">{r.name}</td>
                <td className="py-2 px-3 whitespace-nowrap">{r.nhId}</td>
                <td className="py-2 px-3 whitespace-nowrap">{r.status ?? "—"}</td>
                <td className="py-2 px-3 whitespace-nowrap">{r.owner ?? "—"}</td>
                <td className="py-2 px-3 whitespace-nowrap">
                  <Link
                    className="underline hover:text-white"
                    href={`/operator/registry/repos/${r.id}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {repos.length === 0 ? (
              <tr>
                <td className="py-6 px-3 text-gray-400" colSpan={5}>
                  No repos yet. Import from YAML or create one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
