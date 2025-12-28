// portal/src/app/operator/registry/repos/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { redirect } from "next/navigation";
import YAML from "yaml";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/internalAuth";
import { normalizeRepoStatus, REPO_STATUS_INPUTS } from "@/lib/registryEnums";

type YamlRepoRowLegacy = {
  repo?: string; // "jai-nexus/dev-jai-nexus"
  nh_id?: string;
  description?: string;
  tier?: number;
  role?: string;
  status?: string;
  owner_agent_nh_id?: string;
  notes?: string;
  default_branch?: string;
  github_url?: string;
};

type YamlRepoRowV2 = {
  repo_id?: string;
  org_repo?: string; // "jai-nexus/dev-jai-nexus" OR "JerryIngram/offbook-ai"
  nh_root?: string;
  tier?: number;
  role?: string;
  status?: string;
  owner?: string;
  notes?: string;
  default_branch?: string;
  github_url?: string;
};

function readReposYaml(): Array<YamlRepoRowLegacy | YamlRepoRowV2> {
  const candidates = [
    // if a config folder exists under portal/
    path.join(process.cwd(), "config", "repos.yaml"),
    // dev-jai-nexus/config/repos.yaml (common)
    path.join(process.cwd(), "..", "config", "repos.yaml"),
  ];

  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) return [];

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = YAML.parse(raw) as unknown;

  // Shape A: { repos: [...] }
  if (
    parsed &&
    typeof parsed === "object" &&
    "repos" in (parsed as Record<string, unknown>) &&
    Array.isArray((parsed as Record<string, unknown>).repos)
  ) {
    return (parsed as { repos: Array<YamlRepoRowLegacy | YamlRepoRowV2> }).repos;
  }

  // Shape B: [...] direct list
  if (Array.isArray(parsed)) return parsed as Array<YamlRepoRowLegacy | YamlRepoRowV2>;

  return [];
}

function toGithubUrl(orgRepoOrUrl: string | undefined): string | undefined {
  if (!orgRepoOrUrl) return undefined;
  const v = orgRepoOrUrl.trim();
  if (!v) return undefined;

  if (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("git@")) return v;
  return `https://github.com/${v}`;
}

function rowRepoName(row: YamlRepoRowLegacy | YamlRepoRowV2): string | undefined {
  const v2 = (row as YamlRepoRowV2).org_repo?.trim();
  if (v2) return v2;

  const legacy = (row as YamlRepoRowLegacy).repo?.trim();
  if (legacy) return legacy;

  return undefined;
}

function rowNhId(row: YamlRepoRowLegacy | YamlRepoRowV2): string | undefined {
  const v2 = (row as YamlRepoRowV2).nh_root?.trim();
  if (v2) return v2;

  const legacy = (row as YamlRepoRowLegacy).nh_id?.trim();
  if (legacy) return legacy;

  return undefined;
}

function rowOwnerAgent(row: YamlRepoRowLegacy | YamlRepoRowV2): string | undefined {
  const legacy = (row as YamlRepoRowLegacy).owner_agent_nh_id?.trim();
  if (legacy) return legacy;

  const owner = (row as YamlRepoRowV2).owner?.trim();
  if (!owner) return undefined;

  // If the YAML owner already looks like agent:* keep it.
  if (owner.startsWith("agent:")) return owner;

  // Otherwise don’t guess; store as-is if your schema supports it,
  // or leave undefined to avoid schema mismatch.
  return undefined;
}

async function importFromReposYaml() {
  "use server";
  await requireAdmin();

  const rows = readReposYaml();
  let upserted = 0;

  for (const row of rows) {
    const name = rowRepoName(row);
    if (!name) continue;

    const nhId = rowNhId(row) ?? "0.0";
    const tier = typeof (row as any).tier === "number" ? (row as any).tier : 0;
    const role = (row as any).role ? String((row as any).role) : null;
    const notes = (row as any).notes ? String((row as any).notes) : null;
    const description = (row as any).description ? String((row as any).description) : null;

    const status = normalizeRepoStatus((row as any).status);
    const ownerAgentNhId = rowOwnerAgent(row);

    const githubUrl =
      toGithubUrl((row as any).github_url) ?? toGithubUrl(name);

    const defaultBranch =
      (row as any).default_branch ? String((row as any).default_branch) : null;

    await prisma.repo.upsert({
      where: { name },
      update: {
        nhId,
        tier,
        role,
        status,
        notes,
        description,
        githubUrl,
        defaultBranch,
        ...(ownerAgentNhId ? { ownerAgentNhId } : {}),
      },
      create: {
        name,
        nhId,
        tier,
        role,
        status,
        notes,
        description,
        githubUrl,
        defaultBranch,
        ...(ownerAgentNhId ? { ownerAgentNhId } : {}),
      },
    });

    upserted += 1;
  }

  redirect(`/operator/registry/repos?imported=${upserted}`);
}

export default async function OperatorRegistryReposPage() {
  await requireAdmin();

  const repos = await prisma.repo.findMany({
    orderBy: [{ name: "asc" }],
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Operator · Registry · Repos</h1>
          <p className="text-sm text-gray-400 mt-1">DB-backed repo registry.</p>
        </div>

        <div className="flex items-center gap-3">
          <form action={importFromReposYaml}>
            <button className="rounded-lg border border-gray-800 bg-zinc-950 px-4 py-2 text-sm hover:bg-zinc-900">
              Import from repos.yaml
            </button>
          </form>

          <Link
            className="rounded-lg border border-gray-800 bg-zinc-950 px-4 py-2 text-sm hover:bg-zinc-900"
            href="/operator/registry/repos/new"
          >
            + New Repo
          </Link>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-950 text-gray-300">
            <tr>
              <th className="text-left p-3">Repo</th>
              <th className="text-left p-3">NH_ID</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Owner</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((r) => (
              <tr key={r.id} className="border-t border-gray-900">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-gray-300">{r.nhId}</td>
                <td className="p-3 text-gray-300">{String(r.status)}</td>
                <td className="p-3 text-gray-300">{(r as any).ownerAgentNhId ?? "—"}</td>
                <td className="p-3">
                  <Link className="underline text-gray-200" href={`/operator/registry/repos/${r.id}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {repos.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan={5}>
                  No repos yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        YAML status inputs accepted: {REPO_STATUS_INPUTS.join(", ")}
      </p>
    </main>
  );
}
