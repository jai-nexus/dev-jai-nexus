export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { getServerAuthSession } from "@/auth";
import { getFullRepoRegistry } from "@/lib/controlPlane/repoSurfaceModel";

function statusBadgeClasses(status: string) {
  if (status === "active") return "bg-emerald-900 text-emerald-200";
  if (status === "frozen") return "bg-sky-900 text-sky-200";
  if (status === "planned") return "bg-zinc-800 text-zinc-200";
  return "bg-zinc-800 text-zinc-200";
}

export default async function ReposPage() {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  const repos = getFullRepoRegistry();

  return (
    <main className="min-h-screen bg-black p-8 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-semibold">JAI NEXUS - Repos</h1>
              <p className="mt-1 text-sm text-gray-400">
                Full repo registry for the current control-plane model.
              </p>
            </div>
            <div className="max-w-3xl rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
              <p>
                This page is the full repo registry. The Agent Registry shows
                only a configured scope subset that maps into these repos and
                their surfaces.
              </p>
            </div>
          </div>

          {isAdmin ? (
            <Link
              href="/operator/registry/repos"
              className="rounded-md border border-gray-700 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
            >
              Manage Repos
            </Link>
          ) : null}
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Registered repos
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-100">
              {repos.length}
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Full registry entries, not just agent-scope subset keys.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Active repos
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-100">
              {repos.filter((repo) => repo.status === "active").length}
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Currently active repos in the full registry.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Planned repos
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-100">
              {repos.filter((repo) => repo.status === "planned").length}
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Planned repo entries remain part of the full registry.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Projects referenced
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-100">
              {new Set(repos.flatMap((repo) => repo.project_ids)).size}
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Project/workstream links attached to current repo records.
            </p>
          </div>
        </section>

        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-zinc-950">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-gray-800 bg-zinc-950 text-left">
              <tr>
                <th className="px-3 py-2">Repo ID</th>
                <th className="px-3 py-2">GitHub repo</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Tier</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Projects</th>
                <th className="px-3 py-2">Owner</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {repos.map((repo) => (
                <tr
                  key={repo.repo_id}
                  className="border-b border-gray-900 hover:bg-zinc-900/60"
                >
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className="font-mono text-xs text-gray-300">
                      {repo.repo_id}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-sky-200">
                    {repo.org_repo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-300">
                    {repo.role}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-300">
                    Tier {repo.tier}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs uppercase tracking-wide ${statusBadgeClasses(
                        repo.status,
                      )}`}
                    >
                      {repo.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-300">
                    {repo.project_ids.join(", ")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-300">
                    {repo.owner}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-400">
                    {repo.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
