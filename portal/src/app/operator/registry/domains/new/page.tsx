// portal/src/app/operator/registry/domains/new/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { prisma } from "@/lib/prisma";
import {
  DOMAIN_ENVS,
  DOMAIN_STATUSES,
  normalizeDomainEnv,
  normalizeDomainStatus,
} from "@/lib/registryEnums";

async function createDomain(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const domain = String(formData.get("domain") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim();
  const domainKey = String(formData.get("domainKey") ?? "").trim();
  const engineType = String(formData.get("engineType") ?? "").trim();

  const status = normalizeDomainStatus(formData.get("status"));
  const env = normalizeDomainEnv(formData.get("env"));

  const repoIdRaw = String(formData.get("repoId") ?? "").trim();
  const repoId = repoIdRaw ? Number(repoIdRaw) : null;

  if (!domain) redirect("/operator/registry/domains/new");

  await prisma.domain.create({
    data: {
      domain,
      nhId,
      domainKey: domainKey || null,
      engineType: engineType || null,
      status,
      env, // DomainEnv | null
      ...(repoId ? { repo: { connect: { id: repoId } } } : {}),
    },
  });

  redirect("/operator/registry/domains");
}

const fieldClass =
  "w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100";
const labelClass = "mb-1 text-sm text-slate-300";

export default async function NewDomainPage() {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const repos = await prisma.repo.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <OperatorPanel className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="blocked" label="NON-AUTHORIZING" />
              <OperatorBadge tone="blocked" label="PRE-EXISTING MUTATION" />
              <OperatorBadge tone="gated" label="ADMIN-GATED" />
              <OperatorBadge tone="blocked" label="ZERO GATES GRANTED" />
              <OperatorBadge tone="readOnly" label="NO NEW AUTHORITY" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
                Operator / Registry / Domain Create
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-50">
                New domain registry row
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                This route contains a pre-existing admin-gated DB create action.
                Slate containment labels the authority boundary; it does not add
                DNS/provider integration, live domain mutation, repo mutation,
                or execution gates.
              </p>
            </div>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Registry Mutation Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                Existing mutation controls are not new Slate authority. Slate
                migration does not grant new authority. Authentication is not
                authorization. Verified session does not open execution gates.
              </p>
              <div className="space-y-1.5">
                <OperatorBlockedAction>DNS/provider write</OperatorBlockedAction>
                <OperatorBlockedAction>Live domain mutation</OperatorBlockedAction>
                <OperatorBlockedAction>Repo mutation</OperatorBlockedAction>
              </div>
            </div>
          </OperatorSafetyRail>
        </header>

        <OperatorPanel className="p-5">
          <OperatorSectionHeader
            index="01"
            title="Create Domain Row"
            right={
              <>
                <OperatorBadge tone="blocked" label="PRE-EXISTING MUTATION" />
                <OperatorBadge tone="blocked" label="DB CREATE" />
              </>
            }
          />

          <OperatorGateCard className="mb-4 border-amber-900/70 bg-amber-950/20">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="gated" label="FORM SUBMIT" />
              <OperatorBadge tone="blocked" label="NO EXECUTION" />
            </div>
            <p className="mt-2 text-sm text-amber-100/80">
              This form preserves the existing admin-gated create path. It does
              not create receipts, update canon, mutate live DNS, dispatch
              models, or run Agents.
            </p>
          </OperatorGateCard>

          <form action={createDomain} className="space-y-4">
            <label className="block">
              <div className={labelClass}>Domain</div>
              <input
                name="domain"
                className={fieldClass}
                placeholder="dev.jai.nexus"
                required
              />
            </label>

            <label className="block">
              <div className={labelClass}>NH_ID</div>
              <input
                name="nhId"
                className={fieldClass}
                placeholder="2.1.3"
              />
            </label>

            <label className="block">
              <div className={labelClass}>Key</div>
              <input
                name="domainKey"
                className={fieldClass}
                placeholder="DEV"
              />
            </label>

            <label className="block">
              <div className={labelClass}>Engine Type</div>
              <input
                name="engineType"
                className={fieldClass}
                placeholder="nextjs-portal"
              />
            </label>

            <label className="block">
              <div className={labelClass}>Env</div>
              <select name="env" defaultValue="" className={fieldClass}>
                <option value="">-</option>
                {DOMAIN_ENVS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className={labelClass}>Status</div>
              <select
                name="status"
                defaultValue="planned"
                className={fieldClass}
              >
                {DOMAIN_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className={labelClass}>Repo</div>
              <select name="repoId" defaultValue="" className={fieldClass}>
                <option value="">-</option>
                {repos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="rounded-md border border-amber-800 bg-slate-950 px-3 py-2 font-mono text-xs uppercase tracking-wide text-amber-300 hover:bg-amber-950/40"
            >
              Create domain row
            </button>
          </form>
        </OperatorPanel>
      </div>
    </main>
  );
}
