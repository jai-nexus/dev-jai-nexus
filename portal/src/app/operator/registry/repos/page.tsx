// portal/src/app/operator/registry/repos/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";
import { normalizeRepoStatus, REPO_STATUSES } from "@/lib/registryEnums";
import { RepoStatus } from "@/lib/dbEnums";

type RepoYamlRow = {
  nh_id?: string;
  repo: string;
  description?: string;
  domain_pod?: string;
  engine_group?: string;
  language?: string;
  status?: string;
  owner?: string;
  owner_agent_nh_id?: string;
  default_branch?: string;
  github_url?: string;
};

type RepoYamlFile =
  | RepoYamlRow[]
  | {
      schema_version?: string;
      repos?: RepoYamlRow[];
    };

function readReposYaml(): RepoYamlRow[] {
  const configPath = path.join(process.cwd(), "config", "repos.yaml");
  const raw = fs.readFileSync(configPath, "utf8");
  const parsed = YAML.parse(raw) as RepoYamlFile;

  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.repos)) return parsed.repos;
  return [];
}

function inferOwner(row: RepoYamlRow): string | null {
  if (row.owner && row.owner.trim()) return row.owner.trim();
  if (row.owner_agent_nh_id && row.owner_agent_nh_id.trim()) {
    return `agent:${row.owner_agent_nh_id.trim()}`;
  }
  return null;
}

async function importFromReposYaml() {
  "use server";

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/repos");

  const rows = readReposYaml();

  for (const row of rows) {
    const name = String(row.repo ?? "").trim();
    if (!name) continue;

    const data = {
      name,
      nhId: String(row.nh_id ?? "").trim(),
      description: row.description ?? null,
      domainPod: row.domain_pod ?? null,
      engineGroup: row.engine_group ?? null,
      language: row.language ?? null,
      status: normalizeRepoStatus(row.status), // ✅ enum-safe (UPPERCASE)
      owner: inferOwner(row),
      defaultBranch: row.default_branch ?? null,
      githubUrl: row.github_url ?? null,
    };

    await prisma.repo.upsert({
      where: { name },
      update: data,
      create: data,
    });
  }

  redirect("/operator/registry/repos");
}

export default async function OperatorRegistryReposPage() {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/repos");

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

        <div className="flex gap-2">
          <form action={importFromReposYaml}>
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
                <td className="py-2 px-3 whitespace-nowrap">{r.nhId ?? "—"}</td>
                <td className="py-2 px-3 whitespace-nowrap">
                  {r.status ?? RepoStatus.PLANNED}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">{r.owner ?? "—"}</td>
                <td className="py-2 px-3 whitespace-nowrap">
                  <Link href={`/operator/registry/repos/${r.id}`} className="underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {repos.length === 0 ? (
              <tr>
                <td className="py-3 px-3 text-gray-400" colSpan={5}>
                  No repos yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Allowed repo statuses: {REPO_STATUSES.join(", ")}
      </p>
    </main>
  );
}
