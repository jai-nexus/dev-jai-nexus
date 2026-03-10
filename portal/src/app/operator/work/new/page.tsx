export const runtime = "nodejs";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import crypto from "node:crypto";
import { emitWorkPacketSotEvent } from "@/lib/sotWorkPackets";
import { getAgencyConfig } from "@/lib/agencyConfig";
import { InboxItemStatus, WorkPacketStatus, type Prisma } from "@prisma/client";
import { validateReposAgainstAgentScope } from "@/lib/scopeValidator";
import {
  buildInboxTags,
  deriveRequestedRoleFromAgentKey,
  sanitizeNhLike,
} from "@/lib/work/workPacketContract";

type SearchParamValue = string | string[] | undefined;

type Props = {
  searchParams?: Promise<{
    assignee?: SearchParamValue;
    assigneeNhId?: SearchParamValue;
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

function safeRedirectWithError(baseAssignee: string | null, message: string): never {
  const qs = new URLSearchParams();
  if (baseAssignee) {
    qs.set("assigneeNhId", baseAssignee);
    qs.set("assignee", baseAssignee);
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
  const repoIdRaw = String(formData.get("repoId") ?? "").trim();
  const repoId = repoIdRaw ? Number(repoIdRaw) : null;

  if (repoIdRaw && (!Number.isFinite(repoId) || Number.isNaN(repoId))) {
    safeRedirectWithError(assigneeNhId, `Invalid repoId: ${repoIdRaw}`);
  }

  if (!nhId || !title) redirect("/operator/work/new");

  if (assigneeNhId && repoId == null) {
    safeRedirectWithError(
      assigneeNhId,
      "Scope enforcement: assigned work requires a repo. Choose a repo within the assignee scope.",
    );
  }

  const agency = getAgencyConfig();
  const agent = assigneeNhId
    ? agency.agents.find((a) => a.nh_id === assigneeNhId) ?? null
    : null;

  if (assigneeNhId && !agent) {
    safeRedirectWithError(assigneeNhId, `Agent not found for assignee NH: ${assigneeNhId}`);
  }

  const requestedRole = deriveRequestedRoleFromAgentKey(agent?.agent_key ?? null);
  const mutationId = crypto.randomUUID();

  const created = await prisma.$transaction(async (tx) => {
    if (assigneeNhId && repoId != null) {
      const repo = await tx.repo.findUnique({
        where: { id: repoId },
        select: { id: true, name: true },
      });

      if (!repo) {
        safeRedirectWithError(assigneeNhId, `Unknown repoId: ${repoId}`);
      }

      const res = validateReposAgainstAgentScope(assigneeNhId, [repo.name]);

      if (!res.valid) {
        safeRedirectWithError(
          assigneeNhId,
          `Scope violation. Agent ${res.agent.nh_id} (${res.agent.agent_key}) cannot work in repo '${repo.name}'. Allowed: ${res.allowedScope.join(
            ", ",
          )}`,
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

    const tags = buildInboxTags(assigneeNhId);

    const inbox = await tx.agentInboxItem.create({
      data: {
        workPacketId: created.id,
        status: InboxItemStatus.QUEUED,
        priority: 50,
        tags,
      },
      select: { id: true, status: true, priority: true, tags: true },
    });

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

    if (assigneeNhId) {
      const toAgent = agency.agents.find((a) => a.nh_id === assigneeNhId) ?? null;

      const derivedAgentKey = toAgent?.agent_key ?? "";
      const derivedLabels: string[] = toAgent?.github_labels ?? [];
      const derivedScope: string[] = toAgent?.scope ?? [];

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
          toAgentKey: derivedAgentKey,
          requestedRole,
          repoId: created.repoId ?? null,
          allowedScope: derivedScope,
          githubLabels: derivedLabels,
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

  const agency = getAgencyConfig();
  const agents = [...agency.agents].sort((a, b) => a.nh_id.localeCompare(b.nh_id));

  const assigneeFromQuery = sanitizeNh(
    firstParam(sp?.assigneeNhId) ?? firstParam(sp?.assignee),
  );

  const assigneeIsValid =
    !!assigneeFromQuery && agents.some((a) => a.nh_id === assigneeFromQuery);

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
    ? agents.find((a) => a.nh_id === defaultAssignee) ?? null
    : null;

  const agentKey = selectedAgent?.agent_key ?? "";
  const agentScope: string[] = selectedAgent?.scope ?? [];
  const agentLabels: string[] = selectedAgent?.github_labels ?? [];
  const requestedRole = deriveRequestedRoleFromAgentKey(agentKey);

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">New Work Packet</h1>
        <p className="text-sm text-gray-400 mt-1">
          Minimum: NH + Title. AC/Plan recommended. Optional: assign to an agent and enter governed execution.
        </p>
      </header>

      {errorMsg ? (
        <div className="mb-4 rounded-md border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </div>
      ) : null}

      <form action={createPacket} className="max-w-4xl space-y-4">
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
            <label className="block text-xs text-gray-300">Assignee</label>
            <select
              name="assigneeNhId"
              defaultValue={defaultAssignee}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              <option value="">— Unassigned —</option>
              {agents.map((a) => (
                <option key={a.nh_id} value={a.nh_id}>
                  {a.nh_id} · {a.label}
                </option>
              ))}
            </select>

            <p className="text-[11px] text-gray-500">
              Delegation is recorded as an inbox tag{" "}
              <span className="font-mono">assignee:&lt;nh&gt;</span> and emitted into SoT payloads.
            </p>

            {selectedAgent ? (
              <div className="mt-2 space-y-1 text-[11px] text-gray-400">
                <div>
                  <span className="text-gray-500">agent_key:</span>{" "}
                  <span className="font-mono">{agentKey || "—"}</span>
                </div>

                <div>
                  <span className="text-gray-500">requested role:</span>{" "}
                  <span className="font-mono">{requestedRole ?? "—"}</span>
                </div>

                <div>
                  <span className="text-gray-500">allowed scope (from agency.yaml):</span>{" "}
                  <span className="font-mono">
                    {agentScope.length ? agentScope.join(", ") : "—"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">labels (from agency.yaml):</span>{" "}
                  <span className="font-mono">
                    {agentLabels.length ? agentLabels.join(", ") : "—"}
                  </span>
                </div>

                {(requestedScope.length || requestedLabels.length) ? (
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
                      (query prefill is informational only; enforcement uses agency.yaml)
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-1">
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
            If you assign an agent, you must choose a repo, and it must be within the agent’s scope.
          </p>
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
          className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          Create packet
        </button>
      </form>
    </main>
  );
}
