// portal/src/app/operator/registry/domains/[id]/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

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
} from "@/components/operator/slate";
import { prisma } from "@/lib/prisma";
import {
  DOMAIN_ENVS,
  DOMAIN_STATUSES,
  normalizeDomainEnv,
  normalizeDomainStatus,
} from "@/lib/registryEnums";

function parseDateOnly(v: FormDataEntryValue | null): Date | null {
  const s = String(v ?? "").trim();
  if (!s) return null;

  // expects YYYY-MM-DD
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isFinite(d.getTime()) ? d : null;
}

async function updateDomain(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) redirect("/operator/registry/domains");

  const domain = String(formData.get("domain") ?? "").trim();
  const nhId = String(formData.get("nhId") ?? "").trim();
  const domainKey = String(formData.get("domainKey") ?? "").trim();
  const engineType = String(formData.get("engineType") ?? "").trim();

  // keep enum-typed normalizers (fixes TS2322)
  const status = normalizeDomainStatus(formData.get("status"));
  const env = normalizeDomainEnv(formData.get("env"));

  const expiresAt = parseDateOnly(formData.get("expiresAt"));

  const repoIdRaw = String(formData.get("repoId") ?? "").trim();
  const repoId = repoIdRaw ? Number(repoIdRaw) : null;

  if (!domain) redirect(`/operator/registry/domains/${id}`);

  await prisma.domain.update({
    where: { id },
    data: {
      domain,
      nhId,
      domainKey: domainKey || null,
      engineType: engineType || null,
      status, // DomainStatus | null
      env, // DomainEnv | null
      expiresAt,
      repo: repoId ? { connect: { id: repoId } } : { disconnect: true },
    },
  });

  redirect("/operator/registry/domains");
}

async function deleteDomain(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) redirect("/operator/registry/domains");

  await prisma.domain.delete({ where: { id } });
  redirect("/operator/registry/domains");
}

const fieldClass =
  "w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100";
const labelClass = "mb-1 text-sm text-slate-300";

export default async function EditDomainPage({
  params,
}: {
  // Next.js 16: params may be a Promise in server components
  params: { id: string } | Promise<{ id: string }>;
}) {
  const session = await getServerAuthSession();
  const isAdmin = session?.user?.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/domains");

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) redirect("/operator/registry/domains");

  const domainRow = await prisma.domain.findUnique({
    where: { id },
    include: { repo: true },
  });
  if (!domainRow) redirect("/operator/registry/domains");

  const repos = await prisma.repo.findMany({
    orderBy: [{ name: "asc" }],
    select: { id: true, name: true },
  });

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
                Operator / Registry / Domain Edit
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-50">
                Domain registry row
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <OperatorIdChip>DB-DOMAIN-{domainRow.id}</OperatorIdChip>
                <span className="text-sm text-slate-400">
                  {domainRow.domain}
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm text-slate-400">
                This route preserves pre-existing admin-gated DB update and
                delete actions. Slate containment does not grant live DNS
                authority, provider integration, repo mutation, or execution
                gates.
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
            title="Update Domain Row"
            right={
              <>
                <OperatorBadge tone="blocked" label="PRE-EXISTING MUTATION" />
                <OperatorBadge tone="blocked" label="DB UPDATE" />
              </>
            }
          />

          <OperatorGateCard className="mb-4 border-amber-900/70 bg-amber-950/20">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="gated" label="FORM SUBMIT" />
              <OperatorBadge tone="blocked" label="NO EXECUTION" />
            </div>
            <p className="mt-2 text-sm text-amber-100/80">
              This form preserves the existing admin-gated update path. It does
              not create receipts, update canon, mutate live DNS, dispatch
              models, or run Agents.
            </p>
          </OperatorGateCard>

          <form action={updateDomain} className="space-y-4">
            <input type="hidden" name="id" value={domainRow.id} />

            <label className="block">
              <div className={labelClass}>Domain</div>
              <input
                name="domain"
                defaultValue={domainRow.domain}
                className={fieldClass}
                required
              />
            </label>

            <label className="block">
              <div className={labelClass}>NH_ID</div>
              <input
                name="nhId"
                defaultValue={domainRow.nhId ?? ""}
                className={fieldClass}
                placeholder="1.2.3"
              />
            </label>

            <label className="block">
              <div className={labelClass}>Key</div>
              <input
                name="domainKey"
                defaultValue={domainRow.domainKey ?? ""}
                className={fieldClass}
                placeholder="infra"
              />
            </label>

            <label className="block">
              <div className={labelClass}>Engine Type</div>
              <input
                name="engineType"
                defaultValue={domainRow.engineType ?? ""}
                className={fieldClass}
                placeholder="nextjs | worker | static | api"
              />
            </label>

            <label className="block">
              <div className={labelClass}>Env</div>
              <select
                name="env"
                defaultValue={domainRow.env ?? ""}
                className={fieldClass}
              >
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
                defaultValue={String(domainRow.status ?? "planned")}
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
              <div className={labelClass}>Expires</div>
              <input
                type="date"
                name="expiresAt"
                defaultValue={
                  domainRow.expiresAt
                    ? domainRow.expiresAt.toISOString().slice(0, 10)
                    : ""
                }
                className={fieldClass}
              />
            </label>

            <label className="block">
              <div className={labelClass}>Repo</div>
              <select
                name="repoId"
                defaultValue={domainRow.repoId ? String(domainRow.repoId) : ""}
                className={fieldClass}
              >
                <option value="">-</option>
                {repos.map((r) => (
                  <option key={r.id} value={String(r.id)}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="rounded-md border border-amber-800 bg-slate-950 px-3 py-2 font-mono text-xs uppercase tracking-wide text-amber-300 hover:bg-amber-950/40"
            >
              Save domain row
            </button>
          </form>
        </OperatorPanel>

        <OperatorPanel className="border-red-950/80 p-5">
          <OperatorSectionHeader
            index="02"
            title="Delete Domain Row"
            right={
              <>
                <OperatorBadge tone="blocked" label="PRE-EXISTING MUTATION" />
                <OperatorBadge tone="blocked" label="DB DELETE" />
              </>
            }
          />

          <OperatorGateCard className="border-red-950 bg-red-950/20">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="blocked" label="DESTRUCTIVE DB WRITE" />
              <OperatorBadge tone="blocked" label="NO NEW AUTHORITY" />
            </div>
            <p className="mt-2 text-sm text-red-100/80">
              The delete form is a pre-existing admin-gated registry mutation.
              Slate containment labels the risk; it does not authorize live DNS
              deletion, provider action, or repo mutation.
            </p>
            <form action={deleteDomain} className="mt-4">
              <input type="hidden" name="id" value={domainRow.id} />
              <button
                type="submit"
                className="rounded-md border border-red-800 bg-slate-950 px-3 py-2 font-mono text-xs uppercase tracking-wide text-red-300 hover:bg-red-950/40"
              >
                Delete domain row
              </button>
            </form>
          </OperatorGateCard>
        </OperatorPanel>
      </div>
    </main>
  );
}
