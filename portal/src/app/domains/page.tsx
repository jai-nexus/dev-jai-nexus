import Link from "next/link";

import { getServerAuthSession } from "@/auth";
import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
  type OperatorSlateTone,
} from "@/components/operator/slate";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function statusTone(statusRaw: string | null): OperatorSlateTone {
  const status = statusRaw?.trim().toLowerCase() ?? "";

  if (status === "live" || status === "active") {
    return "readOnly";
  }
  if (status === "parked") {
    return "advisory";
  }
  if (status === "planned") {
    return "pending";
  }

  return "neutral";
}

export default async function DomainsPage() {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";

  const domains = await prisma.domain.findMany({
    orderBy: [{ domain: "asc" }],
    include: { repo: true },
  });

  const liveCount = domains.filter((domain) =>
    ["live", "active"].includes(domain.status?.trim().toLowerCase() ?? ""),
  ).length;
  const parkedCount = domains.filter(
    (domain) => domain.status?.trim().toLowerCase() === "parked",
  ).length;
  const plannedCount = domains.filter(
    (domain) => domain.status?.trim().toLowerCase() === "planned",
  ).length;
  const repoLinkedCount = domains.filter((domain) => domain.repo !== null).length;

  return (
    <main className="min-h-screen bg-[#090d12] text-slate-100">
      <div className="mx-auto max-w-[1480px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <OperatorPanel className="p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl space-y-3">
              <OperatorSectionHeader
                index="00"
                title="Domains"
                right={
                  <>
                    <OperatorBadge tone="readOnly">
                      DB READ-ONLY REGISTRY
                    </OperatorBadge>
                    <OperatorBadge tone="gated">
                      ZERO GATES GRANTED
                    </OperatorBadge>
                  </>
                }
              />
              <p className="text-sm text-slate-400">
                Read-only database registry view. Displayed status is stored
                registry state, not DNS verification, provider confirmation,
                acceptance, or execution authority.
              </p>
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
                <OperatorBadge tone="blocked">NO DOMAIN MUTATION</OperatorBadge>
                <OperatorBadge tone="blocked">
                  NO DNS/PROVIDER INTEGRATION
                </OperatorBadge>
                <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
                <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
              </div>
            </div>

            {isAdmin ? (
              <div className="flex flex-col items-start gap-2 lg:items-end">
                <OperatorBadge tone="readOnly">EXISTING ADMIN ROUTE</OperatorBadge>
                <Link
                  href="/operator/registry/domains"
                  className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-400 hover:bg-slate-800"
                >
                  Manage Domains
                </Link>
                <p className="max-w-xs text-xs text-slate-500 lg:text-right">
                  Navigation only. This page does not mutate domain or DNS state.
                </p>
              </div>
            ) : null}
          </div>
        </OperatorPanel>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <OperatorPanel>
                <OperatorBadge tone="readOnly">DERIVED / READ-ONLY</OperatorBadge>
                <p className="mt-3 text-2xl font-semibold text-slate-100">
                  {domains.length}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                  Registry records
                </p>
              </OperatorPanel>
              <OperatorPanel>
                <OperatorBadge tone="readOnly">DB STATUS / LIVE</OperatorBadge>
                <p className="mt-3 text-2xl font-semibold text-sky-200">
                  {liveCount}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                  Stored live or active
                </p>
              </OperatorPanel>
              <OperatorPanel>
                <OperatorBadge tone="advisory">DB STATUS / PARKED</OperatorBadge>
                <p className="mt-3 text-2xl font-semibold text-amber-200">
                  {parkedCount}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                  Stored parked
                </p>
              </OperatorPanel>
              <OperatorPanel>
                <OperatorBadge tone="pending">DB STATUS / PLANNED</OperatorBadge>
                <p className="mt-3 text-2xl font-semibold text-sky-200">
                  {plannedCount}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                  Stored planned
                </p>
              </OperatorPanel>
            </section>

            <OperatorPanel>
              <OperatorSectionHeader
                index="01"
                title="Domain Inventory"
                right={
                  <>
                    <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
                    <OperatorBadge tone="neutral">DERIVED COUNTS</OperatorBadge>
                  </>
                }
              />
              <p className="mb-4 text-sm text-slate-400">
                {repoLinkedCount} of {domains.length} records are linked to a
                repository. Counts are derived from the existing read-only query.
              </p>

              {domains.length === 0 ? (
                <div className="mt-4">
                  <OperatorGateCard>
                    <div className="flex flex-wrap items-center gap-2">
                      <OperatorBadge tone="readOnly">
                        READ-ONLY / EMPTY
                      </OperatorBadge>
                      <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
                        Domain registry
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      No domain records are currently available from the
                      configured database source.
                    </p>
                  </OperatorGateCard>
                  {isAdmin ? (
                    <Link
                      href="/operator/registry/domains"
                      className="mt-4 inline-flex rounded-md border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-slate-400 hover:text-white"
                    >
                      Open existing domain registry
                    </Link>
                  ) : null}
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800 text-sm">
                    <thead className="bg-slate-950/80 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">NH_ID</th>
                        <th className="px-4 py-3">Domain</th>
                        <th className="px-4 py-3">Key</th>
                        <th className="px-4 py-3">Engine Type</th>
                        <th className="px-4 py-3">Env</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Expires</th>
                        <th className="px-4 py-3">Repo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                      {domains.map((domain) => (
                        <tr key={domain.id} className="align-top">
                          <td className="px-4 py-4">
                            <OperatorIdChip>{domain.nhId}</OperatorIdChip>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <p className="font-semibold text-slate-100">
                                {domain.domain}
                              </p>
                              <OperatorBadge tone="readOnly">
                                DOMAIN / READ-ONLY
                              </OperatorBadge>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <OperatorIdChip>
                              {domain.domainKey ?? "Not recorded"}
                            </OperatorIdChip>
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {domain.engineType ?? "Not recorded"}
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {domain.env ?? "Not recorded"}
                          </td>
                          <td className="px-4 py-4">
                            <OperatorStatusChip
                              status={domain.status ?? "unknown"}
                              tone={statusTone(domain.status)}
                            />
                          </td>
                          <td className="px-4 py-4 text-slate-300">
                            {domain.expiresAt
                              ? domain.expiresAt.toISOString().slice(0, 10)
                              : "Not recorded"}
                          </td>
                          <td className="px-4 py-4">
                            {domain.repo ? (
                              <div className="space-y-1">
                                <p className="font-medium text-slate-200">
                                  {domain.repo.name}
                                </p>
                                <OperatorIdChip>{domain.repo.nhId}</OperatorIdChip>
                              </div>
                            ) : (
                              <OperatorBadge tone="neutral">
                                NO REPO LINK
                              </OperatorBadge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </OperatorPanel>
          </div>

          <OperatorSafetyRail
            title="Domain Registry Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">NO DNS MUTATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO PROVIDER CALLS</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Mutate domain state</OperatorBlockedAction>
              <OperatorBlockedAction>Change DNS records</OperatorBlockedAction>
              <OperatorBlockedAction>Call DNS provider</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Stored domain status is registry evidence only. Dashboard display
              does not authorize action.
            </p>
          </OperatorSafetyRail>
        </div>
      </div>
    </main>
  );
}
