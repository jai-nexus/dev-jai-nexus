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
import { normalizeRepoStatus, REPO_STATUS_VALUES } from "@/lib/registryEnums";
import type { RepoStatus } from "@/lib/dbEnums";
import { RepoStatus as RepoStatusEnum } from "@/lib/dbEnums";

type RepoYamlRow = {
  // “portal” schema keys
  nh_id?: string;
  repo?: string;
  description?: string;
  domain_pod?: string;
  engine_group?: string;
  language?: string;
  status?: string;
  owner?: string;
  owner_agent_nh_id?: string;
  default_branch?: string;
  github_url?: string;

  // “root dev-jai-nexus/config” schema keys
  repo_id?: string;
  org_repo?: string;
  nh_root?: string;
  notes?: string;
  role?: string;
};

type RepoYamlFile =
  | RepoYamlRow[]
  | {
      schema_version?: string;
      repos?: RepoYamlRow[];
    };

function readReposYaml(): RepoYamlRow[] {
  const candidates = [
    path.join(process.cwd(), "config", "repos.yaml"),
    path.join(process.cwd(), "..", "config", "repos.yaml"),
  ];

  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, "utf8");
    const parsed = YAML.parse(raw) as RepoYamlFile;

    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.repos)) return parsed.repos;
    return [];
  }

  return [];
}

function opt(v: string | null | undefined): string | undefined {
  const s = (v ?? "").trim();
  return s.length ? s : undefined;
}

function inferOwner(row: RepoYamlRow): string | undefined {
  const owner = opt(row.owner);
  if (owner) return owner;

  const agent = opt(row.owner_agent_nh_id);
  if (agent) return `agent:${agent}`;

  return undefined;
}

/**
 * Canonical Repo.name in DB should be FULL "org/repo"
 */
function inferName(row: RepoYamlRow): string {
  const orgRepo = (row.org_repo ?? "").trim();
  if (orgRepo) {
    return orgRepo
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/^git@github\.com:/, "")
      .replace(/\.git$/, "")
      .trim();
  }

  const repo = (row.repo ?? "").trim();
  if (repo) {
    return repo
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/^git@github\.com:/, "")
      .replace(/\.git$/, "")
      .trim();
  }

  return (row.repo_id ?? "").trim();
}

function inferGithubUrl(row: RepoYamlRow): string | undefined {
  const direct = opt(row.github_url);
  if (direct) {
    const cleaned = direct
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/^git@github\.com:/, "")
      .replace(/\.git$/, "")
      .trim();

    if (cleaned.includes("/")) return `https://github.com/${cleaned}`;
    return direct;
  }

  const orgRepo = opt(row.org_repo);
  if (orgRepo) {
    const cleaned = orgRepo
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/^git@github\.com:/, "")
      .replace(/\.git$/, "")
      .trim();
    return `https://github.com/${cleaned}`;
  }

  const repo = opt(row.repo);
  if (repo) {
    const cleaned = repo
      .replace(/^https?:\/\/github\.com\//, "")
      .replace(/^git@github\.com:/, "")
      .replace(/\.git$/, "")
      .trim();
    return `https://github.com/${cleaned}`;
  }

  return undefined;
}

function inferNhId(row: RepoYamlRow): string | undefined {
  const nh = (row.nh_id ?? row.nh_root ?? "").trim();
  return nh.length ? nh : undefined;
}

function inferDescription(row: RepoYamlRow): string | undefined {
  return opt(row.description ?? row.notes);
}

function labelStatus(s: RepoStatus): string {
  const lower = String(s).toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

async function requireAdmin() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");

  const isAdmin = session.user.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/operator/registry/repos");
}

async function importFromReposYaml() {
  "use server";

  await requireAdmin();

  const rows = readReposYaml();

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const name = inferName(row);
    if (!name) {
      skipped++;
      continue;
    }

    const nhId = inferNhId(row);
    const githubUrl = inferGithubUrl(row);

    // NOTE:
    // Repo.nhId is non-null (default ""), so NEVER pass null.
    // Use undefined to omit, or string to set.
    const data = {
      name,
      nhId: nhId ?? undefined,
      description: inferDescription(row) ?? undefined,
      domainPod: opt(row.domain_pod),
      engineGroup: opt(row.engine_group ?? row.role),
      language: opt(row.language),
      owner: inferOwner(row) ?? undefined,
      defaultBranch: opt(row.default_branch) ?? "main",
      githubUrl: githubUrl ?? undefined,

      // If YAML omits status, normalize will fall back (typically planned).
      // If you want “omit when missing”, change to:
      // status: row.status ? normalizeRepoStatus(row.status) : undefined,
      status: normalizeRepoStatus(row.status),
    };

    try {
      await prisma.repo.upsert({
        where: { name },
        update: data,
        create: data,
      });
      imported++;
    } catch (err) {
      failed++;
      console.error("[repos.yaml import] failed", { name, row, err });
    }
  }

  console.log(
    `[repos.yaml import] imported=${imported} skipped=${skipped} failed=${failed}`,
  );

  redirect("/operator/registry/repos");
}

export default async function OperatorRegistryReposPage() {
  await requireAdmin();

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
            {repos.map((r) => {
              // IMPORTANT:
              // Never render magic strings like "PLANNED" here.
              // Use a real enum fallback so you don’t accidentally create drift.
              const s: RepoStatus = r.status ?? RepoStatusEnum.planned;

              return (
                <tr
                  key={r.id}
                  className="border-b border-gray-900 hover:bg-zinc-900/60"
                >
                  <td className="py-2 px-3 whitespace-nowrap">{r.name}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {r.nhId && r.nhId.length ? r.nhId : "—"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {labelStatus(s)}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{r.owner ?? "—"}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <Link
                      href={`/operator/registry/repos/${r.id}`}
                      className="underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}

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
        Allowed repo statuses: {REPO_STATUS_VALUES.join(", ")}
      </p>
    </main>
  );
}
