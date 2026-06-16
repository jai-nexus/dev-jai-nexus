export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";

import { getServerAuthSession } from "@/auth";
import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
  type OperatorSlateTone,
} from "@/components/operator/slate";
import { getFullRepoRegistry } from "@/lib/controlPlane/repoSurfaceModel";

function statusTone(status: string): OperatorSlateTone {
  if (status === "active") return "canonical";
  if (status === "frozen") return "readOnly";
  if (status === "planned") return "pending";
  if (status === "deprecated") return "blocked";
  return "neutral";
}

function SummaryCard({
  label,
  value,
  detail,
  tone = "readOnly",
}: {
  label: string;
  value: number;
  detail: string;
  tone?: OperatorSlateTone;
}) {
  return (
    <OperatorPanel>
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {label}
        </div>
        <OperatorBadge tone={tone}>DERIVED</OperatorBadge>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-100">{value}</div>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </OperatorPanel>
  );
}

export default async function ReposPage() {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  const repos = getFullRepoRegistry();
  const activeCount = repos.filter((repo) => repo.status === "active").length;
  const plannedCount = repos.filter((repo) => repo.status === "planned").length;
  const projectCount = new Set(repos.flatMap((repo) => repo.project_ids)).size;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="mr-2 text-3xl font-semibold">JAI NEXUS - Repos</h1>
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="canonical">CANONICAL REGISTRY</OperatorBadge>
              <OperatorBadge tone="readOnly">READ-ONLY DISPLAY</OperatorBadge>
              <OperatorBadge tone="blocked">NO REPO MUTATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO GITHUB INTEGRATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <p className="mt-4 max-w-4xl text-sm text-slate-400">
              Full repo registry loaded from the canonical checked-in
              `config/repos.yaml` control-plane source. Registry display is
              read-only and does not authorize repo, branch, PR, or GitHub actions.
            </p>
            <OperatorGateCard className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <OperatorIdChip>config/repos.yaml</OperatorIdChip>
                <OperatorReadOnlyAction>REGISTRY DISPLAY</OperatorReadOnlyAction>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                The Agent Registry remains a configured scope subset. This page
                shows the full canonical registry superset and does not mutate it.
              </p>
            </OperatorGateCard>
            {isAdmin ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  href="/operator/registry/repos"
                  className="rounded border border-amber-800 px-3 py-2 font-mono text-xs uppercase tracking-wide text-amber-300 hover:bg-amber-950"
                >
                  Manage Repos
                </Link>
                <OperatorBadge tone="warning">EXISTING ADMIN ROUTE</OperatorBadge>
                <OperatorBadge tone="blocked">NOT A MUTATION ON THIS PAGE</OperatorBadge>
              </div>
            ) : null}
          </OperatorPanel>

          <OperatorSafetyRail invariants={OPERATOR_SAFETY_INVARIANTS}>
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Mutate repo</OperatorBlockedAction>
              <OperatorBlockedAction>Create branch</OperatorBlockedAction>
              <OperatorBlockedAction>Open PR</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Registry status is descriptive control-plane state. Active does not
              grant execution authority.
            </p>
          </OperatorSafetyRail>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Registered repos"
            value={repos.length}
            detail="Full canonical registry entries, not only configured Agent scope keys."
          />
          <SummaryCard
            label="Active repos"
            value={activeCount}
            detail="Canonical registry status only; active does not imply execution authority."
            tone="canonical"
          />
          <SummaryCard
            label="Planned repos"
            value={plannedCount}
            detail="Planned registry entries remain non-executing."
            tone="pending"
          />
          <SummaryCard
            label="Projects referenced"
            value={projectCount}
            detail="Derived project/workstream links attached to current repo records."
          />
        </section>

        <OperatorPanel>
          <OperatorSectionHeader
            index="01"
            title="Canonical Repo Registry"
            right={
              <>
                <OperatorBadge tone="canonical">CANONICAL SOURCE</OperatorBadge>
                <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              </>
            }
          />
          <div className="overflow-x-auto rounded border border-slate-800">
            <table className="w-full border-collapse text-sm">
              <thead className="border-b border-slate-800 bg-slate-950 text-left">
                <tr>
                  <th className="px-3 py-2 text-xs text-slate-400">Repo ID</th>
                  <th className="px-3 py-2 text-xs text-slate-400">GitHub repo</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Role</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Tier</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Status</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Projects</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Owner</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Notes</th>
                  <th className="px-3 py-2 text-xs text-slate-400">Posture</th>
                </tr>
              </thead>
              <tbody>
                {repos.map((repo) => (
                  <tr
                    key={repo.repo_id}
                    className="border-b border-slate-900 align-top hover:bg-slate-800/60"
                  >
                    <td className="whitespace-nowrap px-3 py-2">
                      <OperatorIdChip>{repo.repo_id}</OperatorIdChip>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <OperatorIdChip>{repo.org_repo}</OperatorIdChip>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-300">
                      {repo.role}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-300">
                      Tier {repo.tier}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <OperatorStatusChip
                        status={repo.status}
                        tone={statusTone(repo.status)}
                      />
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-300">
                      {repo.project_ids.join(", ")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-300">
                      {repo.owner}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-400">
                      {repo.notes}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <OperatorBadge tone="readOnly">
                        REGISTRY / READ-ONLY
                      </OperatorBadge>
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
