// portal/src/app/operator/page.tsx
export const runtime = "nodejs";
export const revalidate = 30;

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAgencyConfig } from "@/lib/agencyConfig";
import { getProjectsConfig } from "@/lib/projectsConfig";

export default async function OperatorHomePage() {
  // Pull lightweight stats for the cards
  const [eventCount, agency, projectsConfig] = await Promise.all([
    prisma.sotEvent.count(),
    getAgencyConfig(),
    getProjectsConfig(),
  ]);

  const agentCount = agency.agents.length;
  const projectCount = projectsConfig.projects.length;

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">JAI NEXUS · Operator</h1>
        <p className="text-sm text-gray-400 mt-1">
          Control panel for NH maps, project registry, and SoT streams.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {/* Events card */}
        <Link
          href="/operator/events"
          className="group rounded-lg border border-gray-800 bg-zinc-950 p-4 hover:border-sky-500/70 hover:bg-zinc-900/60 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-100">Events</h2>
            <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-[11px] text-gray-300">
              {eventCount.toLocaleString()} events
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Stream-of-record (SoT) events from chats, sync runs, and agents.
          </p>
          <span className="text-xs text-sky-300 group-hover:underline">
            View event stream →
          </span>
        </Link>

        {/* Agents card */}
        <Link
          href="/operator/agents"
          className="group rounded-lg border border-gray-800 bg-zinc-950 p-4 hover:border-sky-500/70 hover:bg-zinc-900/60 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-100">Agents</h2>
            <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-[11px] text-gray-300">
              {agentCount} agents
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            NH-based agent map for dev.jai.nexus and attached products.
          </p>
          <span className="text-xs text-sky-300 group-hover:underline">
            View agency map →
          </span>
        </Link>

        {/* Projects card */}
        <Link
          href="/operator/projects"
          className="group rounded-lg border border-gray-800 bg-zinc-950 p-4 hover:border-sky-500/70 hover:bg-zinc-900/60 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-100">Projects</h2>
            <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-[11px] text-gray-300">
              {projectCount} projects
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Registry of NH roots, tiers, and repos for all Nexus projects.
          </p>
          <span className="text-xs text-sky-300 group-hover:underline">
            View project registry →
          </span>
        </Link>
      </section>
    </main>
  );
}
