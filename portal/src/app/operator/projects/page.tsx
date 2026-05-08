export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";
import { getRepoEntry } from "@/lib/controlPlane/repoSurfaceModel";
import { getProjectsConfig, type ProjectConfigEntry } from "@/lib/projectsConfig";

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-100">{value}</div>
      <p className="mt-2 text-sm text-gray-400">{detail}</p>
    </div>
  );
}

function ToneBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "sky" | "amber" | "emerald" | "rose" | "slate";
}) {
  const toneClass =
    tone === "sky"
      ? "border-sky-800 bg-sky-950 text-sky-200"
      : tone === "amber"
        ? "border-amber-800 bg-amber-950 text-amber-200"
        : tone === "emerald"
          ? "border-emerald-800 bg-emerald-950 text-emerald-200"
          : tone === "rose"
            ? "border-rose-800 bg-rose-950 text-rose-200"
            : "border-gray-800 bg-zinc-900 text-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function statusTone(status: ProjectConfigEntry["status"]) {
  if (status === "active") return "emerald";
  if (status === "frozen") return "slate";
  if (status === "deprecated") return "rose";
  return "sky";
}

export default function ProjectsPage() {
  const projects = [...getProjectsConfig().projects].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.root_nh_id.localeCompare(b.root_nh_id);
  });

  const repoLinks = new Set(projects.map((project) => project.repo));

  return (
    <main className="min-h-screen bg-black p-8 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">JAI NEXUS - Projects</h1>
            <ToneBadge tone="sky">project registry</ToneBadge>
            <ToneBadge tone="emerald">JAI NEXUS centric</ToneBadge>
            <ToneBadge tone="slate">read only</ToneBadge>
          </div>
          <p className="max-w-3xl text-sm text-gray-400">
            This registry is intentionally limited to internal JAI NEXUS control-plane
            and spine projects for dev.jai.nexus.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              External product incubation remains possible elsewhere, but this
              dev.jai.nexus registry is reserved for JAI NEXUS internal governance,
              operator, and spine work only.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Projects"
            value={String(projects.length)}
            detail="Current internal JAI NEXUS project records in the portal config."
          />
          <SummaryCard
            label="Repo links"
            value={String(repoLinks.size)}
            detail="Each registered project maps to a single repo anchor in this config."
          />
          <SummaryCard
            label="Active projects"
            value={String(projects.filter((project) => project.status === "active").length)}
            detail="Active internal JAI NEXUS project entries."
          />
          <SummaryCard
            label="Tier 0 projects"
            value={String(projects.filter((project) => project.tier === 0).length)}
            detail="Core spine projects retained in the dev.jai.nexus registry."
          />
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-gray-100">Project matrix</h2>
            <p className="text-sm text-gray-400">
              Only internal JAI NEXUS projects are listed here. Repo coverage remains
              distinct from the broader canonical repo registry.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-zinc-950">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Repo
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Owner NH
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {projects.map((project) => (
                  <tr key={project.project_id}>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-gray-100">{project.name}</div>
                      <div className="mt-1 font-mono text-xs text-gray-500">
                        {project.project_id} - NH {project.root_nh_id}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-gray-300">
                      Tier {project.tier}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <ToneBadge tone={statusTone(project.status)}>
                        {project.status}
                      </ToneBadge>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <ToneBadge tone={getRepoEntry(project.repo) ? "sky" : "amber"}>
                        {project.repo}
                      </ToneBadge>
                    </td>
                    <td className="px-4 py-3 align-top font-mono text-xs text-gray-300">
                      {project.owner_agent_nh_id}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-gray-300">
                      {project.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
