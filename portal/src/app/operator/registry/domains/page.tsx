export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { getServerAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  COMPANY_ASSET_DOMAIN_REGISTRY_BOUNDARY_COPY,
  COMPANY_ASSET_DOMAIN_REGISTRY_DISPLAY_MODEL,
  summarizeCompanyAssetDomainRegistryDisplayModel,
} from "@/lib/controlPlane/companyAssetDomainRegistry";

type OperatorDomainRegistryDisplayRow = {
  id: string;
  nhId: string;
  domain: string;
  engineType: string | null;
  env: string | null;
  status: string | null;
  repo: {
    name: string;
  } | null;
};

type RawOperatorDomainRegistryRow = Omit<OperatorDomainRegistryDisplayRow, "id"> & {
  id: number;
};

function CompactList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-1 text-xs text-slate-400">
      {items.map((item) => (
        <li key={item}>- {item}</li>
      ))}
    </ul>
  );
}

export default async function OperatorRegistryDomainsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.email !== "admin@jai.nexus") redirect("/operator");

  const domainRows: RawOperatorDomainRegistryRow[] = await prisma.domain.findMany({
    include: { repo: true },
    orderBy: [{ domain: "asc" }],
  });

  const domains: OperatorDomainRegistryDisplayRow[] = domainRows.map((domain) => ({
    id: String(domain.id),
    nhId: domain.nhId,
    domain: domain.domain,
    engineType: domain.engineType,
    env: domain.env,
    status: domain.status,
    repo: domain.repo
      ? {
          name: domain.repo.name,
        }
      : null,
  }));

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <header className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <OperatorPanel className="space-y-4 p-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <OperatorBadge tone="blocked" label="NON-AUTHORIZING" />
              <OperatorBadge tone="gated" label="ADMIN-GATED" />
              <OperatorBadge tone="readOnly" label="READ-ONLY LIST" />
              <OperatorBadge tone="blocked" label="NO NEW AUTHORITY" />
              <OperatorBadge tone="blocked" label="ZERO GATES GRANTED" />
            </div>
            <h1 className="text-3xl font-semibold">
              Operator - Registry - Domains
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              DB-backed domain registry. Dashboard display does not authorize.
              Read-only is not authority.
            </p>
          </div>

          <OperatorGateCard>
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <OperatorBadge tone="readOnly" label="READ-ONLY INDEX" />
              <OperatorBadge tone="blocked" label="NO DNS WRITES" />
              <OperatorBadge tone="blocked" label="NO PROVIDER CALLS" />
            </div>
            <p className="mb-3 text-sm text-slate-400">
              Domain create/edit/delete controls remain on separate existing
              admin-gated routes. Slate migration does not grant new authority.
            </p>
            <Link
              href="/operator/registry/domains/new"
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs uppercase tracking-wide text-slate-200 hover:bg-slate-900"
            >
              + New Domain
            </Link>
          </OperatorGateCard>
        </OperatorPanel>

        <OperatorSafetyRail
          title="Domain Registry Safety"
          invariants={OPERATOR_SAFETY_INVARIANTS}
        >
          <div className="space-y-2 text-xs text-slate-400">
            <p>
              DNS/provider writes are blocked. Live domain mutation is blocked.
              All execution gates remain closed. Zero gates granted.
            </p>
            <div className="space-y-1.5">
              <OperatorBlockedAction>DNS/provider writes</OperatorBlockedAction>
              <OperatorBlockedAction>Live domain mutation</OperatorBlockedAction>
              <OperatorBlockedAction>Repo mutation</OperatorBlockedAction>
              <OperatorBlockedAction>Branch / PR automation</OperatorBlockedAction>
              <OperatorBlockedAction>Receipt creation</OperatorBlockedAction>
              <OperatorBlockedAction>Canon update</OperatorBlockedAction>
            </div>
          </div>
        </OperatorSafetyRail>
      </header>

      <OperatorPanel className="mb-6 space-y-4 p-5">
        <OperatorSectionHeader
          index="A6"
          title="Corrected Asset / Domain / Repo Display Model"
          right={
            <>
              <OperatorBadge tone="readOnly" label="LOCAL-STATIC MODEL" />
              <OperatorBadge tone="blocked" label="NO REGISTRY MUTATION" />
              <OperatorBadge tone="blocked" label="NOT FINAL CANON" />
            </>
          }
        />
        <p className="text-sm text-slate-400">
          {summarizeCompanyAssetDomainRegistryDisplayModel()}. This display
          separates candidate owned domain assets, domain concepts,
          domain-engine groups, many-to-many repo bindings, environments,
          renewal risk, public-readiness posture, and CONTROL_THREAD authority.
          It does not broaden existing DB-backed admin behavior.
        </p>
        <div className="grid gap-3 xl:grid-cols-4">
          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly" label="ASSETS" />
              <OperatorBadge tone="blocked" label="NO DNS" />
            </div>
            <CompactList
              items={COMPANY_ASSET_DOMAIN_REGISTRY_DISPLAY_MODEL.ownedDomainAssets.map(
                (asset) =>
                  `${asset.domain_name}: ${asset.ownership_status} / ${asset.renewal_risk_level}`,
              )}
            />
          </OperatorGateCard>
          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly" label="CONCEPTS" />
              <OperatorBadge tone="blocked" label="NOT DEPLOYED APPS" />
            </div>
            <CompactList
              items={COMPANY_ASSET_DOMAIN_REGISTRY_DISPLAY_MODEL.domainConcepts.map(
                (concept) =>
                  `${concept.concept_name}: ${concept.public_or_internal_posture}`,
              )}
            />
          </OperatorGateCard>
          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly" label="ENGINE GROUPS" />
              <OperatorBadge tone="blocked" label="NOT REPOS" />
            </div>
            <CompactList
              items={COMPANY_ASSET_DOMAIN_REGISTRY_DISPLAY_MODEL.domainEngineGroups.map(
                (group) => `${group.engine_group_name}: ${group.responsibility}`,
              )}
            />
          </OperatorGateCard>
          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly" label="BINDINGS" />
              <OperatorBadge tone="blocked" label="NO REPO MUTATION" />
            </div>
            <CompactList
              items={COMPANY_ASSET_DOMAIN_REGISTRY_DISPLAY_MODEL.repositoryBindings.map(
                (binding) =>
                  `${binding.binding_id}: ${binding.linked_domain_asset_ids.length} assets / ${binding.linked_engine_group_ids.length} groups`,
              )}
            />
          </OperatorGateCard>
        </div>
        <OperatorGateCard>
          <div className="flex flex-wrap gap-2">
            <OperatorBadge tone="blocked" label="AUTHORITY BOUNDARY" />
            <OperatorBadge tone="readOnly" label="DISPLAY ONLY" />
          </div>
          <CompactList
            items={COMPANY_ASSET_DOMAIN_REGISTRY_BOUNDARY_COPY.slice(0, 8)}
          />
        </OperatorGateCard>
      </OperatorPanel>

      <OperatorPanel className="overflow-hidden p-0">
        <OperatorSectionHeader
          index="01"
          title="Read-Only Domain Rows"
          right={
            <>
              <OperatorBadge tone="readOnly" label="READ-ONLY" />
              <OperatorBadge tone="blocked" label="NO DOMAIN MUTATION" />
              <OperatorBadge
                tone="blocked"
                label="NO DNS/PROVIDER INTEGRATION"
              />
            </>
          }
          className="m-3"
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-slate-800 bg-slate-950 text-left">
              <tr>
                <th className="py-2 px-3">Domain</th>
                <th className="py-2 px-3">NH_ID</th>
                <th className="py-2 px-3">Engine</th>
                <th className="py-2 px-3">Env</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Repo</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-slate-900 hover:bg-slate-900/60"
                >
                  <td className="py-2 px-3 whitespace-nowrap text-slate-100">
                    {d.domain}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <OperatorIdChip>{d.nhId}</OperatorIdChip>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-slate-300">
                    {d.engineType ?? "-"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-slate-300">
                    {d.env ?? "-"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <OperatorBadge tone="readOnly" label={d.status ?? "UNKNOWN"} />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-slate-300">
                    {d.repo?.name ?? "-"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <Link
                      className="font-mono text-xs uppercase tracking-wide text-amber-300 underline-offset-4 hover:underline"
                      href={`/operator/registry/domains/${d.id}`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {domains.length === 0 ? (
                <tr>
                  <td className="py-6 px-3 text-slate-400" colSpan={7}>
                    No domains in DB.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </OperatorPanel>
    </main>
  );
}
