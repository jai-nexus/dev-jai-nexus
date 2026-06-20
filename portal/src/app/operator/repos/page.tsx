// portal/src/app/operator/repos/page.tsx
import Link from "next/link";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
} from "@/components/operator/slate";
import { CanonicalReadOnlySpine } from "@/components/operator/CanonicalReadOnlySpine";
import { DevelopmentWorkReadiness } from "@/components/operator/DevelopmentWorkReadiness";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 0;

export default async function OperatorReposPage() {
  const repos = await prisma.repo.findMany({
    orderBy: [{ nhId: "asc" }],
  });
  const activeRepos = repos.filter(
    (repo) => repo.status?.toUpperCase() === "ACTIVE",
  ).length;
  const unknownRepos = repos.filter((repo) => !repo.status).length;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / operator / repos
            </div>
            <h1 className="mt-2 text-2xl font-semibold">JAI NEXUS / Repos</h1>
            <p className="mt-2 text-sm text-slate-400">
              Active repos registered with dev.jai.nexus. Display only; repo
              listing does not authorize repo mutation.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
              <OperatorBadge tone="advisory">REPO REGISTRY DISPLAY</OperatorBadge>
              <OperatorBadge tone="blocked">NO REPO MUTATION</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Repo Registry Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Sync repos</OperatorBlockedAction>
              <OperatorBlockedAction>Mutate repo state</OperatorBlockedAction>
              <OperatorBlockedAction>Open PR</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              DB-backed display is read-only unless explicitly routed
              otherwise. Dashboard display does not authorize.
            </p>
          </OperatorSafetyRail>
        </header>

        <CanonicalReadOnlySpine
          index="CANON"
          cards={[
            {
              id: "REPO-DB",
              label: "Registered repos",
              value: repos.length,
              source: "DB READ-ONLY",
              freshness: "Current database read; sync freshness is not verified here.",
              detail:
                "Repo registry rows are display-only and do not authorize repo mutation.",
            },
            {
              id: "REPO-ACTIVE",
              label: "Active stored",
              value: activeRepos,
              source: "DERIVED",
              freshness: "Derived from stored repo status values.",
              detail:
                "Stored ACTIVE status is not live GitHub, filesystem, or health verification.",
            },
            {
              id: "REPO-UNKNOWN",
              label: "Unknown status",
              value: unknownRepos,
              source: "UNKNOWN SOURCE",
              freshness: "Missing status is treated conservatively.",
              detail:
                "Unknown status must not be promoted to healthy, active, or live.",
            },
            {
              id: "REPO-WORK",
              label: "Work scaffold",
              value: "readiness",
              source: "SYNTHETIC",
              freshness: "Development work readiness uses local static posture.",
              detail:
                "Readiness display does not dispatch work or mutate repository files.",
            },
          ]}
        />

        <DevelopmentWorkReadiness index="00" />

        <OperatorPanel className="overflow-hidden p-0">
          <OperatorSectionHeader
            index="01"
            title="Registered Repos"
            className="m-3"
            right={
              <>
                <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
                <OperatorIdChip>{repos.length} repos</OperatorIdChip>
              </>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-slate-800 bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-2">NH ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Domain Pod</th>
                  <th className="px-4 py-2">Engine</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Files</th>
                </tr>
              </thead>
              <tbody>
                {repos.map((repo) => (
                  <tr
                    key={repo.id}
                    className="border-b border-slate-800/70 hover:bg-slate-800/60"
                  >
                    <td className="px-4 py-2">
                      <OperatorIdChip>{repo.nhId}</OperatorIdChip>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-100">{repo.name}</span>
                        {repo.githubUrl ? (
                          <a
                            href={repo.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-sky-300 hover:underline"
                          >
                            External repo URL
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {repo.domainPod}
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {repo.engineGroup}
                    </td>
                    <td className="px-4 py-2">
                      <OperatorStatusChip
                        status={repo.status ?? "UNKNOWN"}
                        tone="readOnly"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/operator/repos/${repo.id}`}
                        className="text-[11px] text-sky-300 hover:underline"
                      >
                        View files
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </OperatorPanel>
      </div>
    </main>
  );
}
