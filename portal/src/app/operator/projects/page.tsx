export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";
import {
  getProjectCatalog,
  getRepoEntry,
  getSurfaceEntry,
} from "@/lib/controlPlane/repoSurfaceModel";
import type { ControlPlaneProjectEntry } from "@/lib/controlPlane/types";

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

function statusTone(status: ControlPlaneProjectEntry["status"]) {
  if (status === "active") return "emerald";
  if (status === "planned") return "sky";
  if (status === "frozen") return "slate";
  return "rose";
}

export default function ProjectsPage() {
  const projects = getProjectCatalog().sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.root_nh_id.localeCompare(b.root_nh_id);
  });

  const repoLinks = new Set(
    projects.flatMap((project) => project.repo_full_names),
  );
  const surfaceLinks = new Set(
    projects.flatMap((project) => project.surface_keys),
  );

  return (
    <main className="min-h-screen bg-black p-8 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">JAI NEXUS - Projects</h1>
            <ToneBadge tone="sky">project registry</ToneBadge>
            <ToneBadge tone="slate">read only</ToneBadge>
          </div>
          <p className="max-w-3xl text-sm text-gray-400">
            Projects are workstreams. They map to one or more repos and one or
            more surfaces, but they are not repos or surfaces themselves.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              Use <Link href="/repos" className="text-sky-300 underline">/repos</Link>{" "}
              for the full repo registry. Use{" "}
              <Link href="/operator/agents" className="text-sky-300 underline">
                /operator/agents
              </Link>{" "}
              for the configured agent scope subset. This page shows project
              overlays across both.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Projects"
            value={String(projects.length)}
            detail="Current project/workstream records in the control-plane model."
          />
          <SummaryCard
            label="Repo links"
            value={String(repoLinks.size)}
            detail="Project coverage can span multiple actual repos."
          />
          <SummaryCard
            label="Surface links"
            value={String(surfaceLinks.size)}
            detail="Project coverage can span multiple product and operator surfaces."
          />
          <SummaryCard
            label="Planned projects"
            value={String(projects.filter((project) => project.status === "planned").length)}
            detail="Projects may reference planned repos or surfaces before they are fully registered."
          />
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-gray-100">Project matrix</h2>
            <p className="text-sm text-gray-400">
              Each project is shown with its repo coverage, surface coverage,
              and current planning posture.
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
                    Repo coverage
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Surface coverage
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Owner
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Summary
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
                      <div className="mt-2">
                        <ToneBadge tone="slate">
                          priority {project.priority_level}
                        </ToneBadge>
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
                      <div className="flex flex-wrap gap-2">
                        {project.repo_full_names.map((repoFullName) => {
                          const repoEntry = getRepoEntry(repoFullName);

                          return (
                            <ToneBadge
                              key={`${project.project_id}-${repoFullName}`}
                              tone={repoEntry ? "sky" : "amber"}
                            >
                              {repoEntry ? repoFullName : `${repoFullName} (planned)`}
                            </ToneBadge>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-wrap gap-2">
                        {project.surface_keys.map((surfaceKey) => {
                          const surface = getSurfaceEntry(surfaceKey);

                          return (
                            <ToneBadge
                              key={`${project.project_id}-${surfaceKey}`}
                              tone="slate"
                            >
                              {surface?.label ?? surfaceKey}
                            </ToneBadge>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-gray-300">
                      {project.owner}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-gray-300">
                      <div>{project.summary}</div>
                      <ul className="mt-2 space-y-1 text-gray-400">
                        {project.notes.map((note) => (
                          <li key={note}>- {note}</li>
                        ))}
                      </ul>
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
