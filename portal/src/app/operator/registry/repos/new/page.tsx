// portal/src/app/operator/registry/repos/new/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
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
import type { RepoStatus } from "@/lib/dbEnums";
import { RepoStatus as RepoStatusEnum } from "@/lib/dbEnums";
import { prisma } from "@/lib/prisma";
import { normalizeRepoStatus, REPO_STATUS_VALUES } from "@/lib/registryEnums";

function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}

function optStr(v: FormDataEntryValue | null): string | null {
  const s = str(v);
  return s.length ? s : null;
}

function labelStatus(s: RepoStatus): string {
  const lower = String(s).toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

async function requireAdmin() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");

  const isAdmin = session.user.email === "admin@jai.nexus";
  if (!isAdmin) redirect("/operator/registry/repos");
}

async function createRepo(formData: FormData) {
  "use server";

  await requireAdmin();

  const name = str(formData.get("name"));
  if (!name) redirect("/operator/registry/repos/new");

  // Non-null string column: never pass null ("" is allowed)
  const nhId = str(formData.get("nhId"));

  const owner = optStr(formData.get("owner"));
  const description = optStr(formData.get("description"));
  const domainPod = optStr(formData.get("domainPod"));
  const engineGroup = optStr(formData.get("engineGroup"));
  const language = optStr(formData.get("language"));
  const githubUrl = optStr(formData.get("githubUrl"));
  const defaultBranch = optStr(formData.get("defaultBranch"));

  const status = normalizeRepoStatus(formData.get("status"));

  await prisma.repo.create({
    data: {
      name,
      nhId,
      status,
      owner,
      description,
      domainPod,
      engineGroup,
      language,
      githubUrl,
      defaultBranch,
    },
  });

  redirect("/operator/registry/repos");
}

const fieldClass =
  "w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100";
const labelClass = "mb-1 text-sm text-slate-300";

export default async function NewRepoPage() {
  await requireAdmin();

  const statusDefault: RepoStatus = RepoStatusEnum.planned;

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
                Operator / Registry / Repo Create
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-50">
                New repo registry row
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                This route contains a pre-existing admin-gated DB create action.
                Slate containment labels the authority boundary; it does not add
                repo mutation authority, GitHub integration, sync behavior, or
                execution gates.
              </p>
            </div>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Registry Mutation Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                Existing mutation controls are not new Slate authority.
                Authentication is not authorization. Verified session does not
                open execution gates.
              </p>
              <div className="space-y-1.5">
                <OperatorBlockedAction>Repo sync</OperatorBlockedAction>
                <OperatorBlockedAction>GitHub write</OperatorBlockedAction>
                <OperatorBlockedAction>
                  Branch / PR automation
                </OperatorBlockedAction>
              </div>
            </div>
          </OperatorSafetyRail>
        </header>

        <OperatorPanel className="p-5">
          <OperatorSectionHeader
            index="01"
            title="Create Repo Row"
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
              not create receipts, update canon, mutate repos outside the DB
              registry row, dispatch models, or run Agents.
            </p>
          </OperatorGateCard>

          <form action={createRepo} className="space-y-4">
            <label className="block">
              <div className={labelClass}>Repo (org/repo)</div>
              <input
                name="name"
                className={fieldClass}
                placeholder="jai-nexus/dev-jai-nexus"
                required
              />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <div className={labelClass}>NH_ID</div>
                <input
                  name="nhId"
                  className={fieldClass}
                  placeholder="1.2.3"
                />
              </label>

              <label className="block">
                <div className={labelClass}>Status</div>
                <select
                  name="status"
                  defaultValue={statusDefault}
                  className={fieldClass}
                >
                  {REPO_STATUS_VALUES.map((s) => (
                    <option key={s} value={s}>
                      {labelStatus(s)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <div className={labelClass}>Owner</div>
              <input
                name="owner"
                className={fieldClass}
                placeholder='e.g. "agent:1.2" or a name'
              />
            </label>

            <label className="block">
              <div className={labelClass}>Description</div>
              <textarea name="description" rows={3} className={fieldClass} />
            </label>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <div className={labelClass}>Domain Pod</div>
                <input
                  name="domainPod"
                  className={fieldClass}
                  placeholder="DEV / DOCS / NEXUS / ..."
                />
              </label>

              <label className="block">
                <div className={labelClass}>Engine Group</div>
                <input
                  name="engineGroup"
                  className={fieldClass}
                  placeholder="operator-console / tooling / docs / ..."
                />
              </label>

              <label className="block">
                <div className={labelClass}>Language</div>
                <input
                  name="language"
                  className={fieldClass}
                  placeholder="ts / md / py / ..."
                />
              </label>

              <label className="block">
                <div className={labelClass}>Default Branch</div>
                <input
                  name="defaultBranch"
                  className={fieldClass}
                  placeholder="main"
                />
              </label>
            </div>

            <label className="block">
              <div className={labelClass}>GitHub URL</div>
              <input
                name="githubUrl"
                className={fieldClass}
                placeholder="https://github.com/jai-nexus/dev-jai-nexus"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-md border border-amber-800 bg-slate-950 px-3 py-2 font-mono text-xs uppercase tracking-wide text-amber-300 hover:bg-amber-950/40"
              >
                Create repo row
              </button>

              <Link
                href="/operator/registry/repos"
                className="text-sm text-slate-400 hover:text-slate-200"
              >
                Cancel
              </Link>
            </div>
          </form>
        </OperatorPanel>
      </div>
    </main>
  );
}
