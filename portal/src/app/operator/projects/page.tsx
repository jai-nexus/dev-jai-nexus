// portal/src/app/operator/projects/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import {
  getProjectsConfig,
  type ProjectConfigEntry,
} from "@/lib/projectsConfig";

export default function ProjectsPage() {
  const config = getProjectsConfig();

  const projects: ProjectConfigEntry[] = [...config.projects].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.root_nh_id.localeCompare(b.root_nh_id);
  });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">JAI NEXUS · Projects</h1>
        <p className="text-sm text-gray-400 mt-1">
          Project registry for dev.jai.nexus and attached repos.
        </p>

        <div className="mt-4 inline-flex items-center gap-3 rounded-lg border border-gray-800 bg-zinc-950 px-4 py-3">
          <span className="text-xs text-gray-300">
            Total projects:{" "}
            <span className="font-semibold">{projects.length}</span>
          </span>
          <span className="inline-flex items-center rounded-full bg-sky-900/40 px-2 py-1 text-[11px] font-medium text-sky-200">
            schema v{config.schema_version.toFixed(1)}
          </span>
        </div>
      </header>

      <section>
        <h2 className="text-lg font-medium mb-3">Projects</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
              <tr>
                <th className="py-2 px-3 text-xs text-gray-400">NH</th>
                <th className="py-2 px-3 text-xs text-gray-400">Project</th>
                <th className="py-2 px-3 text-xs text-gray-400">Tier</th>
                <th className="py-2 px-3 text-xs text-gray-400">Status</th>
                <th className="py-2 px-3 text-xs text-gray-400">Repo</th>
                <th className="py-2 px-3 text-xs text-gray-400">
                  Owner agent
                </th>
                <th className="py-2 px-3 text-xs text-gray-400">Events</th>
                <th className="py-2 px-3 text-xs text-gray-400">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.project_id}
                  className="border-b border-gray-900 hover:bg-zinc-900/60"
                >
                  <td className="py-2 px-3 whitespace-nowrap text-xs text-gray-300">
                    {project.root_nh_id}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      {/* Project name → NH-scoped events */}
                      <Link
                        href={`/operator/events?nh=${encodeURIComponent(
                          project.root_nh_id,
                        )}`}
                        className="font-medium text-sky-300 hover:text-sky-200 hover:underline"
                        title={`View SoT events for NH ${project.root_nh_id}`}
                      >
                        {project.name}
                      </Link>
                      <span className="text-xs text-gray-500">
                        {project.project_id}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-xs">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                        project.tier === 0
                          ? "bg-emerald-900/60 text-emerald-200"
                          : project.tier === 1
                          ? "bg-sky-900/60 text-sky-200"
                          : "bg-purple-900/60 text-purple-200"
                      }`}
                    >
                      Tier {project.tier}
                    </span>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-xs">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                        project.status === "active"
                          ? "bg-emerald-900/60 text-emerald-200"
                          : project.status === "planned"
                          ? "bg-sky-900/60 text-sky-200"
                          : project.status === "frozen"
                          ? "bg-zinc-800 text-zinc-200"
                          : "bg-red-900/60 text-red-200"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    <code className="text-[11px] text-gray-300">
                      {project.repo}
                    </code>
                  </td>
                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    {project.owner_agent_nh_id}
                  </td>
                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    <Link
                      href={`/operator/events?nh=${encodeURIComponent(
                        project.root_nh_id,
                      )}`}
                      className="text-sky-400 hover:text-sky-300 underline"
                    >
                      View events
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-xs max-w-md">
                    <span className="text-gray-300">
                      {project.description}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
