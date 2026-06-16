export const runtime = "nodejs";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import crypto from "node:crypto";
import { emitWorkPacketSotEvent } from "@/lib/sotWorkPackets";
import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import {
  EXECUTION_ROLES,
  getAgentByNhId,
  getExecutionAgents,
  isAgentEligibleForExecutionRole,
  type AgencyAgent,
  type ExecutionRole,
} from "@/lib/agencyConfig";
import { InboxItemStatus, WorkPacketStatus, type Prisma } from "@prisma/client";
import { validateReposAgainstAgentScope } from "@/lib/scopeValidator";
import { syncAgentQueueItemForPacket } from "@/lib/work/workPacketQueue";
import { buildInboxTags, sanitizeNhLike } from "@/lib/work/workPacketContract";

type SearchParamValue = string | string[] | undefined;

type Props = {
  searchParams?: Promise<{
    assignee?: SearchParamValue;
    assigneeNhId?: SearchParamValue;
    requestedRole?: SearchParamValue;
    nhId?: SearchParamValue;
    title?: SearchParamValue;
    agentKey?: SearchParamValue;
    scope?: SearchParamValue;
    labels?: SearchParamValue;
    githubLabels?: SearchParamValue;
    error?: SearchParamValue;
  }>;
};

function firstParam(v: SearchParamValue): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function splitCsv(v: string | undefined): string[] {
  return String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function sanitizeNh(v: string | undefined): string | null {
  return sanitizeNhLike(v) ?? null;
}

function sanitizeRequestedRole(v: string | undefined): ExecutionRole | null {
  const raw = String(v ?? "").trim().toUpperCase();
  if (!raw) return null;
  return EXECUTION_ROLES.includes(raw as ExecutionRole) ? (raw as ExecutionRole) : null;
}

function buildRouteTags(role: ExecutionRole | null): string[] {
  return role ? [`route:${role}`] : [];
}

function sortAgents(list: AgencyAgent[]): AgencyAgent[] {
  return [...list].sort((a, b) => a.nh_id.localeCompare(b.nh_id));
}

function safeRedirectWithError(
  baseAssignee: string | null,
  requestedRole: ExecutionRole | null,
  message: string,
): never {
  const qs = new URLSearchParams();
  if (baseAssignee) {
    qs.set("assigneeNhId", baseAssignee);
    qs.set("assignee", baseAssignee);
  }
  if (requestedRole) {
    qs.set("requestedRole", requestedRole);
  }
  qs.set("error", message);
  redirect(`/operator/work/new?${qs.toString()}`);
}

async function createPacket(formData: FormData) {
  "use server";

  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user) redirect("/login");

  const nhId = String(formData.get("nhId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const ac = String(formData.get("ac") ?? "");
  const plan = String(formData.get("plan") ?? "");

  const assigneeNhId = sanitizeNh(String(formData.get("assigneeNhId") ?? ""));
  const requestedRole = sanitizeRequestedRole(String(formData.get("requestedRole") ?? ""));

  const repoIdRaw = String(formData.get("repoId") ?? "").trim();
  const repoId = repoIdRaw ? Number(repoIdRaw) : null;

  if (repoIdRaw && (!Number.isFinite(repoId) || Number.isNaN(repoId))) {
    safeRedirectWithError(assigneeNhId, requestedRole, `Invalid repoId: ${repoIdRaw}`);
  }

  if (!nhId || !title) {
    redirect("/operator/work/new");
  }

  if (!requestedRole) {
    safeRedirectWithError(
      assigneeNhId,
      requestedRole,
      "Execution role is required for governed work packets.",
    );
  }

  if (assigneeNhId && repoId == null) {
    safeRedirectWithError(
      assigneeNhId,
      requestedRole,
      "Scope enforcement: assigned work requires a repo. Choose a repo within the assignee scope.",
    );
  }

  const agent = assigneeNhId ? getAgentByNhId(assigneeNhId) : null;

  if (assigneeNhId && !agent) {
    safeRedirectWithError(
      assigneeNhId,
      requestedRole,
      `Agent not found for assignee NH: ${assigneeNhId}`,
    );
  }

  if (assigneeNhId && agent && !agent.execution_capable) {
    safeRedirectWithError(
      assigneeNhId,
      requestedRole,
      `Agent ${agent.nh_id} (${agent.agent_key}) is governance-only and not eligible for execution assignment.`,
    );
  }

  if (
    assigneeNhId &&
    agent &&
    requestedRole &&
    !isAgentEligibleForExecutionRole(agent, requestedRole)
  ) {
    safeRedirectWithError(
      assigneeNhId,
      requestedRole,
      `Agent ${agent.nh_id} (${agent.agent_key}) is not eligible for execution role '${requestedRole}'. Allowed roles: ${agent.execution_roles.join(", ") || "—"}`,
    );
  }

  const mutationId = crypto.randomUUID();

  const created = await prisma.$transaction(async (tx) => {
    let selectedRepoName: string | null = null;

    if (assigneeNhId && repoId != null) {
      const repo = await tx.repo.findUnique({
        where: { id: repoId },
        select: { id: true, name: true },
      });

      if (!repo) {
        safeRedirectWithError(
          assigneeNhId,
          requestedRole,
          `Unknown repoId: ${repoId}`,
        );
      }

      selectedRepoName = repo.name;

      const res = validateReposAgainstAgentScope(assigneeNhId, [repo.name]);

      if (!res.valid) {
        safeRedirectWithError(
          assigneeNhId,
          requestedRole,
          `Scope violation. Agent ${res.agent.nh_id} (${res.agent.agent_key}) cannot work in repo '${repo.name}'. Allowed: ${res.allowedScope.join(", ")}`,
        );
      }
    }

    const created = await tx.workPacket.create({
      data: {
        nhId,
        title,
        ac,
        plan,
        status: WorkPacketStatus.DRAFT,
        ...(repoId != null ? { repoId } : {}),
      },
    });

    const tags = [
      ...buildInboxTags(assigneeNhId),
      ...buildRouteTags(requestedRole),
    ];

    const inbox = await tx.agentInboxItem.create({
      data: {
        workPacketId: created.id,
        status: InboxItemStatus.QUEUED,
        priority: 50,
        tags,
      },
      select: { id: true, status: true, priority: true, tags: true },
    });

    if (assigneeNhId) {
      await syncAgentQueueItemForPacket(tx, {
        workPacketId: created.id,
        assigneeNhId,
        repoScope: selectedRepoName ? [selectedRepoName] : [],
      });
    }

    const createdPayload: Prisma.InputJsonValue = {
      contract_version: "work-packet-0.1",
      workPacketId: created.id,
      nhId: created.nhId,
      title: created.title,
      status: created.status,
      requestedRole,
      requiresOperatorApproval: true,
      ...(created.repoId != null ? { repoId: created.repoId } : {}),
      ...(assigneeNhId ? { assigneeNhId } : {}),
      inbox: {
        inboxItemId: inbox.id,
        status: inbox.status,
        priority: inbox.priority,
        tags: inbox.tags,
      },
      queue: assigneeNhId
        ? {
          agentNhId: assigneeNhId,
          repoScope: selectedRepoName ? [selectedRepoName] : [],
          status: "PENDING",
        }
        : null,
    };

    await emitWorkPacketSotEvent({
      db: tx,
      kind: "WORK_PACKET_CREATED",
      nhId: created.nhId,
      repoId: created.repoId ?? null,
      summary: `WorkPacket created: ${created.nhId} · ${created.title}`,
      mutationId,
      workPacket: { id: created.id, nhId: created.nhId },
      actor: { email: user.email ?? null, name: user.name ?? null },
      data: createdPayload,
    });

    if (assigneeNhId && agent) {
      await emitWorkPacketSotEvent({
        db: tx,
        kind: "WORK_DELEGATED",
        nhId: created.nhId,
        repoId: created.repoId ?? null,
        summary: `Work delegated: ${created.nhId} → ${assigneeNhId}`,
        mutationId: crypto.randomUUID(),
        workPacket: { id: created.id, nhId: created.nhId },
        actor: { email: user.email ?? null, name: user.name ?? null },
        data: {
          contract_version: "work-packet-0.1",
          workPacketId: created.id,
          fromAgent: { nhId: "1.0", agentKey: "JAI::OPERATOR" },
          toAgentNhId: assigneeNhId,
          toAgentKey: agent.agent_key,
          requestedRole,
          executionRoles: agent.execution_roles,
          repoId: created.repoId ?? null,
          allowedScope: agent.scope,
          githubLabels: agent.github_labels,
          requiresOperatorApproval: true,
        } satisfies Prisma.InputJsonValue,
      });
    }

    return created;
  });

  redirect(`/operator/work/${created.id}`);
}

export default async function NewWorkPacketPage({ searchParams }: Props) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login?next=/operator/work/new");

  const sp = await Promise.resolve(searchParams);

  const prefillNh = firstParam(sp?.nhId);
  const prefillTitle = firstParam(sp?.title);
  const errorMsg = firstParam(sp?.error);

  const requestedRoleFromQuery = sanitizeRequestedRole(firstParam(sp?.requestedRole));
  const allExecutionAgents = sortAgents(getExecutionAgents(null));
  const eligibleAgents = sortAgents(getExecutionAgents(requestedRoleFromQuery));

  const assigneeFromQuery = sanitizeNh(
    firstParam(sp?.assigneeNhId) ?? firstParam(sp?.assignee),
  );

  const assigneeIsValid =
    !!assigneeFromQuery &&
    allExecutionAgents.some((a) => a.nh_id === assigneeFromQuery);

  const defaultAssignee = assigneeIsValid ? assigneeFromQuery : "";

  const requestedScope = splitCsv(firstParam(sp?.scope));
  const requestedLabels = splitCsv(
    firstParam(sp?.githubLabels) ?? firstParam(sp?.labels),
  );

  const repos = await prisma.repo.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const selectedAgent = defaultAssignee
    ? allExecutionAgents.find((a) => a.nh_id === defaultAssignee) ?? null
    : null;

  const selectedAgentEligible =
    selectedAgent && requestedRoleFromQuery
      ? isAgentEligibleForExecutionRole(selectedAgent, requestedRoleFromQuery)
      : true;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <OperatorPanel className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="blocked" label="NON-AUTHORIZING" />
              <OperatorBadge tone="blocked" label="PRE-EXISTING MUTATION" />
              <OperatorBadge tone="gated" label="AUTH REQUIRED" />
              <OperatorBadge tone="blocked" label="ZERO GATES GRANTED" />
              <OperatorBadge tone="readOnly" label="NO NEW AUTHORITY" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">
                Operator / Work Packet Create
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-50">
                New work packet
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                This route preserves a pre-existing work-packet creation path
                that writes packet, inbox, queue, and SoT event state. Slate
                containment labels the authority boundary; it does not add
                dispatch, Agent execution, receipt creation, canon update, or
                execution gates.
              </p>
            </div>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Work Packet Mutation Safety"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                Existing mutation controls are not new Slate authority. Slate
                migration does not grant new authority. Authentication is not
                authorization. Verified session does not open execution gates.
              </p>
              <p>
                Prompt text is not dispatch. Generated content is not
                acceptance. Derived output is not canon.
              </p>
              <div className="space-y-1.5">
                <OperatorBlockedAction>Agent execution</OperatorBlockedAction>
                <OperatorBlockedAction>Repo mutation</OperatorBlockedAction>
                <OperatorBlockedAction>Receipt creation</OperatorBlockedAction>
              </div>
            </div>
          </OperatorSafetyRail>
        </header>

      {errorMsg ? (
        <div className="mb-4 rounded-md border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </div>
      ) : null}

      <OperatorPanel className="p-5">
        <OperatorSectionHeader
          index="01"
          title="Role-Scoped Assignee Filter"
          right={
            <>
              <OperatorBadge tone="readOnly" label="GET FILTER" />
              <OperatorBadge tone="gated" label="PREVIEW-ONLY" />
            </>
          }
        />
        <h2 className="text-sm font-semibold text-gray-200">Role-Scoped Assignee Filter</h2>
        <p className="mt-1 text-sm text-gray-400">
          Choose an execution role first to narrow the assignee pool to eligible execution agents.
        </p>

        <form method="get" className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[240px]">
            <label className="block text-xs text-gray-300 mb-1">Execution Role</label>
            <select
              name="requestedRole"
              defaultValue={requestedRoleFromQuery ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              <option value="">— Select role —</option>
              {EXECUTION_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rounded-md border border-sky-800 bg-slate-950 px-3 py-2 font-mono text-xs uppercase tracking-wide text-sky-300 hover:bg-sky-950/40"
          >
            Apply role filter
          </button>

          <Link
            href="/operator/work/new"
            className="rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-gray-200 hover:bg-zinc-900"
          >
            Reset
          </Link>
        </form>

        <div className="mt-3 text-xs text-gray-500">
          Eligible assignees:{" "}
          <span className="font-mono text-gray-300">{eligibleAgents.length}</span>
        </div>
      </OperatorPanel>

      <OperatorPanel className="p-5">
        <OperatorSectionHeader
          index="02"
          title="Create Work Packet"
          right={
            <>
              <OperatorBadge tone="blocked" label="PRE-EXISTING MUTATION" />
              <OperatorBadge tone="blocked" label="DB TRANSACTION" />
              <OperatorBadge tone="blocked" label="EVENT WRITE" />
            </>
          }
        />

        <OperatorGateCard className="mb-4 border-amber-900/70 bg-amber-950/20">
          <div className="flex flex-wrap items-center gap-2">
            <OperatorBadge tone="gated" label="FORM SUBMIT" />
            <OperatorBadge tone="blocked" label="NO EXECUTION" />
          </div>
          <p className="mt-2 text-sm text-amber-100/80">
            This form preserves the existing creation transaction. It may create
            work-packet, inbox, queue, and SoT event rows through the existing
            server action, but it does not dispatch a model, execute an Agent,
            mutate repos, create receipts, or update canon.
          </p>
        </OperatorGateCard>

      <form action={createPacket} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs text-gray-300">NH ID</label>
            <input
              name="nhId"
              placeholder="1.2.3"
              required
              defaultValue={prefillNh ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-300">Execution Role</label>
            <select
              name="requestedRole"
              defaultValue={requestedRoleFromQuery ?? ""}
              required
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              <option value="">— Select role —</option>
              {EXECUTION_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <p className="text-[11px] text-gray-500">
              This is the canonical governed lane for the packet.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs text-gray-300">Repo</label>
            <select
              name="repoId"
              defaultValue=""
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              <option value="">— None —</option>
              {repos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500">
              If you assign an agent, you must choose a repo, and it must be within that agent’s scope.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-gray-300">Assignee</label>
            <select
              name="assigneeNhId"
              defaultValue={defaultAssignee}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              <option value="">
                {requestedRoleFromQuery ? "— Unassigned —" : "— Select role first —"}
              </option>
              {eligibleAgents.map((a) => (
                <option key={a.nh_id} value={a.nh_id}>
                  {a.nh_id} · {a.label}
                </option>
              ))}
            </select>

            <p className="text-[11px] text-gray-500">
              Only execution-capable agents eligible for the selected role are shown here.
            </p>

            {selectedAgent ? (
              <div className="mt-2 space-y-1 text-[11px] text-gray-400">
                <div>
                  <span className="text-gray-500">agent_key:</span>{" "}
                  <span className="font-mono">{selectedAgent.agent_key || "—"}</span>
                </div>

                <div>
                  <span className="text-gray-500">execution roles:</span>{" "}
                  <span className="font-mono">
                    {selectedAgent.execution_roles.length
                      ? selectedAgent.execution_roles.join(", ")
                      : "—"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">governance only:</span>{" "}
                  <span className="font-mono">
                    {selectedAgent.governance_only ? "true" : "false"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">allowed scope:</span>{" "}
                  <span className="font-mono">
                    {selectedAgent.scope.length ? selectedAgent.scope.join(", ") : "—"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">labels:</span>{" "}
                  <span className="font-mono">
                    {selectedAgent.github_labels.length
                      ? selectedAgent.github_labels.join(", ")
                      : "—"}
                  </span>
                </div>

                {!selectedAgentEligible ? (
                  <div className="pt-1 text-red-300">
                    Selected assignee is not eligible for the currently requested execution role.
                  </div>
                ) : null}

                {requestedScope.length || requestedLabels.length ? (
                  <div className="pt-1 text-[11px] text-gray-500">
                    <div>
                      <span className="text-gray-600">prefill scope (query):</span>{" "}
                      <span className="font-mono">
                        {requestedScope.length ? requestedScope.join(", ") : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">prefill labels (query):</span>{" "}
                      <span className="font-mono">
                        {requestedLabels.length ? requestedLabels.join(", ") : "—"}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      (query prefill is informational only; execution eligibility comes from agency.yaml)
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Title</label>
          <input
            name="title"
            placeholder="Protect Context API + add Work Packets"
            required
            defaultValue={prefillTitle ?? ""}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Acceptance Criteria (AC)</label>
          <textarea
            name="ac"
            rows={8}
            defaultValue={"- [ ] ..."}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-300">Plan</label>
          <textarea
            name="plan"
            rows={8}
            defaultValue={"1) ..."}
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm font-mono"
          />
        </div>

        <button
          type="submit"
          className="rounded-md border border-amber-800 bg-slate-950 px-3 py-2 font-mono text-xs uppercase tracking-wide text-amber-300 hover:bg-amber-950/40"
        >
          Create work packet
        </button>
      </form>
      </OperatorPanel>
      </div>
    </main>
  );
}
