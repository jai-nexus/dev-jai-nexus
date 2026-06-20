export const runtime = "nodejs";
export const revalidate = 30;

import Link from "next/link";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
} from "@/components/operator/slate";
import { RouteTopologyReadiness } from "@/components/operator/RouteTopologyReadiness";
import { getAgencyConfig } from "@/lib/agencyConfig";
import { prisma } from "@/lib/prisma";
import { getProjectsConfig } from "@/lib/projectsConfig";

export default async function OperatorHomePage() {
  const [eventCount, agency, projectsConfig] = await Promise.all([
    prisma.sotEvent.count(),
    getAgencyConfig(),
    getProjectsConfig(),
  ]);

  const agentCount = agency.agents.length;
  const projectCount = projectsConfig.projects.length;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-300 lg:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <OperatorPanel className="p-5">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / operator
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100">
              JAI NEXUS - Operator
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Current primary Operator entry point for event, agent, project,
              and route-topology posture. This root remains the Operator entry
              route until a later CONTROL_THREAD route decision changes it.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorBadge tone="pending">PRIMARY</OperatorBadge>
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              <OperatorBadge tone="gated">ROUTE DECISION PENDING</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
              <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
            </div>
          </OperatorPanel>
          <OperatorSafetyRail
            title="Operator Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <p className="text-xs text-slate-400">
              Counts summarize existing DB and checked-in configuration sources.
              Display does not authorize action.
            </p>
          </OperatorSafetyRail>
        </header>

        <RouteTopologyReadiness index="00" />

        <section>
          <OperatorSectionHeader
            index="01"
            title="Operator Entry Surfaces"
            right={<OperatorBadge tone="readOnly">READ-ONLY LINKS</OperatorBadge>}
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/operator/events" className="group">
              <OperatorPanel className="h-full transition-colors group-hover:border-sky-700">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-100">Events</h2>
                  <OperatorStatusChip
                    status={`${eventCount.toLocaleString()} EVENTS`}
                    tone="readOnly"
                  />
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  DB-backed stream-of-record rows from chats, sync runs, and
                  agents. Database-backed does not imply complete canon.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <OperatorBadge tone="readOnly">DB READ</OperatorBadge>
                  <OperatorReadOnlyAction>Open event stream</OperatorReadOnlyAction>
                </div>
              </OperatorPanel>
            </Link>

            <Link href="/operator/agents" className="group">
              <OperatorPanel className="h-full transition-colors group-hover:border-sky-700">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-100">Agents</h2>
                  <OperatorStatusChip status={`${agentCount} AGENTS`} tone="advisory" />
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Checked-in agency configuration for dev.jai.nexus and attached
                  products. Configuration does not grant execution authority.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <OperatorBadge tone="advisory">CONFIG SOURCE</OperatorBadge>
                  <OperatorReadOnlyAction>Open agency map</OperatorReadOnlyAction>
                </div>
              </OperatorPanel>
            </Link>

            <Link href="/operator/projects" className="group">
              <OperatorPanel className="h-full transition-colors group-hover:border-sky-700">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-100">Projects</h2>
                  <OperatorStatusChip
                    status={`${projectCount} PROJECTS`}
                    tone="fixture"
                  />
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Checked-in project configuration count. The destination page
                  owns its fixture and provenance labels.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <OperatorBadge tone="fixture">CHECKED-IN CONFIG</OperatorBadge>
                  <OperatorIdChip>PROJECT REGISTRY</OperatorIdChip>
                  <OperatorReadOnlyAction>Open project registry</OperatorReadOnlyAction>
                </div>
              </OperatorPanel>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
