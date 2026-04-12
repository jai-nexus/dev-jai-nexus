export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";
import {
  getAgentByNhId,
  getExecutionAgents,
  isAgentEligibleForExecutionRole,
  type AgencyAgent,
  type ExecutionRole,
} from "@/lib/agencyConfig";
import { WorkPacketStatus, type Prisma } from "@prisma/client";
import {
  coerceStringArray,
  getActivationOutcomeFromTags,
  getAssigneeFromTags,
  getCostCategoryFromTags,
} from "@/lib/work/workPacketContract";
import { computeWorkPacketControlState } from "@/lib/work/workPacketLifecycle";
import { computeExecutionLaneState } from "@/lib/work/executionLane";
import { DEBUG_LOOP_EVENT_KINDS, RUNTIME_EVENT_KINDS } from "@/lib/work/agentRunContract";

type SearchParamValue = string | string[] | undefined;

type SearchParams = {
  assignee?: SearchParamValue;
  view?: SearchParamValue;
  status?: SearchParamValue;
  q?: SearchParamValue;
};

type Props = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

type JsonValue = Prisma.JsonValue;
type JsonObject = Record<string, JsonValue>;

const WORK_PACKET_ROLE_KINDS = [
  "WORK_PACKET_CREATED",
  "WORK_DELEGATED",
  "WORK_ROUTED",
] as const;

const RUNTIME_KIND_SET = new Set<string>([...RUNTIME_EVENT_KINDS]);
const DEBUG_KIND_SET = new Set<string>([...DEBUG_LOOP_EVENT_KINDS]);

function firstParam(value: SearchParamValue): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function sanitizeNhLike(input?: string): string | undefined {
  const raw = (input ?? "").trim();
  if (!raw) return undefined;
  if (!/^\d+(\.\d+)*$/.test(raw)) return undefined;
  return raw;
}

function sanitizeQuery(input?: string): string | undefined {
  const raw = (input ?? "").trim();
  if (!raw) return undefined;
  return raw.length > 120 ? raw.slice(0, 120) : raw;
}

function sanitizeStatus(input?: string): WorkPacketStatus | undefined {
  const raw = (input ?? "").trim();
  if (!raw) return undefined;
  return Object.values(WorkPacketStatus).includes(raw as WorkPacketStatus)
    ? (raw as WorkPacketStatus)
    : undefined;
}

function isJsonObject(v: JsonValue | null | undefined): v is JsonObject {
  return v !== null && v !== undefined && typeof v === "object" && !Array.isArray(v);
}

function getJsonProp(v: JsonValue | null | undefined, key: string): JsonValue | undefined {
  if (!isJsonObject(v)) return undefined;
  return v[key];
}

function getNestedPayloadData(payload: JsonValue | null | undefined): JsonValue | undefined {
  const directData = getJsonProp(payload, "data");
  if (directData !== undefined) return directData;

  const nestedPayload = getJsonProp(payload, "payload");
  return getJsonProp(nestedPayload, "data");
}

function normalizeRoleLike(value: unknown): string {
  return String(value ?? "").trim().toUpperCase();
}

function parseRequestedRole(value: unknown): ExecutionRole | null {
  const raw = normalizeRoleLike(value);

  if (raw === "ARCHITECT") return "ARCHITECT";
  if (raw === "BUILDER") return "BUILDER";
  if (raw === "VERIFIER") return "VERIFIER";
  if (raw === "LIBRARIAN") return "LIBRARIAN";
  if (raw === "OPERATOR" || raw === "OPERATOR_REVIEW") return "OPERATOR";

  return null;
}

function getRequestedRoleFromTags(tags: string[]): ExecutionRole | null {
  const hit = tags.find((t) => typeof t === "string" && t.startsWith("route:"));
  if (!hit) return null;
  return parseRequestedRole(hit.slice("route:".length));
}

function getRequestedRoleFromPayload(payload: JsonValue | null | undefined): ExecutionRole | null {
  const data = getNestedPayloadData(payload);

  const explicitRole = parseRequestedRole(getJsonProp(data, "requestedRole"));
  if (explicitRole) return explicitRole;

  const targetLaneRole = parseRequestedRole(getJsonProp(data, "targetLane"));
  if (targetLaneRole) return targetLaneRole;

  return null;
}

function deriveRequestedRoleFromAgentKeyCompat(agentKey: string | null | undefined): ExecutionRole | null {
  const raw = String(agentKey ?? "").trim().toUpperCase();

  if (raw.includes("ARCHITECT")) return "ARCHITECT";
  if (raw.includes("BUILDER")) return "BUILDER";
  if (raw.includes("VERIFIER")) return "VERIFIER";
  if (raw.includes("LIBRARIAN")) return "LIBRARIAN";
  if (raw.includes("OPERATOR")) return "OPERATOR";

  return null;
}

function Chip({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "emerald" | "sky" | "amber" | "purple" | "red";
}) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-900/50 text-emerald-200 border-emerald-800"
      : tone === "sky"
        ? "bg-sky-900/50 text-sky-200 border-sky-800"
        : tone === "amber"
          ? "bg-amber-900/40 text-amber-200 border-amber-800"
          : tone === "purple"
            ? "bg-purple-900/50 text-purple-200 border-purple-800"
            : tone === "red"
              ? "bg-red-900/40 text-red-200 border-red-800"
              : "bg-zinc-900 text-gray-200 border-gray-800";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>
      {children}
    </span>
  );
}

function hrefWith(
  current: { assignee?: string; view?: string; status?: string; q?: string },
  patch: Partial<{
    assignee: string | null;
    view: string | null;
    status: string | null;
    q: string | null;
  }>,
) {
  const sp = new URLSearchParams();

  const next = {
    assignee: current.assignee ?? undefined,
    view: current.view ?? undefined,
    status: current.status ?? undefined,
    q: current.q ?? undefined,
    ...Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, v === null ? undefined : v])),
  } as {
    assignee?: string;
    view?: string;
    status?: string;
    q?: string;
  };

  if (next.assignee) sp.set("assignee", next.assignee);
  if (next.view) sp.set("view", next.view);
  if (next.status) sp.set("status", next.status);
  if (next.q) sp.set("q", next.q);

  const qs = sp.toString();
  return qs ? `/operator/work?${qs}` : "/operator/work";
}

function laneTone(lane: string) {
  if (lane === "COMPLETE") return "emerald";
  if (lane === "ATTENTION") return "red";
  if (lane === "VERIFIER") return "purple";
  if (lane === "BUILDER") return "sky";
  if (lane === "ARCHITECT") return "amber";
  if (lane === "OPERATOR_REVIEW") return "emerald";
  return "slate";
}

function corpusOutcomeTone(outcome: string | null) {
  if (outcome === "PROCEED") return "emerald";
  if (outcome === "ESCALATE") return "amber";
  if (outcome === "BLOCK") return "red";
  return "slate";
}

function eligibilityTone(valid: boolean | null) {
  if (valid === true) return "emerald";
  if (valid === false) return "red";
  return "slate";
}

function eligibilityLabel(valid: boolean | null) {
  if (valid === true) return "VALID";
  if (valid === false) return "INVALID";
  return "N/A";
}

type WorkPacketFindManyArgs = NonNullable<Parameters<typeof prisma.workPacket.findMany>[0]>;
type WorkPacketWhereInput = WorkPacketFindManyArgs["where"];

export default async function WorkPage({ searchParams }: Props) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login?next=/operator/work");

  const agents: AgencyAgent[] = [...getExecutionAgents(null)].sort((a, b) =>
    a.nh_id.localeCompare(b.nh_id),
  );

  const sp = (await Promise.resolve(searchParams)) ?? ({} as SearchParams);

  const assignee = sanitizeNhLike(firstParam(sp.assignee));
  const view = firstParam(sp.view);
  const status = sanitizeStatus(firstParam(sp.status));
  const q = sanitizeQuery(firstParam(sp.q));

  const where: WorkPacketWhereInput = {};

  if (status) where.status = status;

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { nhId: { contains: q, mode: "insensitive" } },
    ];
  }

  const packets = await prisma.workPacket.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { repo: true },
  });

  const ids = packets.map((p) => p.id);

  const inboxItems = ids.length
    ? await prisma.agentInboxItem.findMany({
      where: { workPacketId: { in: ids } },
      orderBy: { id: "desc" },
      select: {
        id: true,
        workPacketId: true,
        status: true,
        priority: true,
        tags: true,
      },
    })
    : [];

  const packetEvents = ids.length
    ? await prisma.sotEvent.findMany({
      where: {
        workPacketId: { in: ids },
        kind: { in: [...WORK_PACKET_ROLE_KINDS, ...RUNTIME_EVENT_KINDS, ...DEBUG_LOOP_EVENT_KINDS] },
      },
      orderBy: { ts: "desc" },
      select: {
        id: true,
        workPacketId: true,
        kind: true,
        summary: true,
        ts: true,
        payload: true,
      },
    })
    : [];

  const inboxByPacket = new Map<number, (typeof inboxItems)[number]>();
  for (const item of inboxItems) {
    if (!inboxByPacket.has(item.workPacketId)) inboxByPacket.set(item.workPacketId, item);
  }

  const latestRuntimeByPacket = new Map<number, (typeof packetEvents)[number]>();
  const latestDebugByPacket = new Map<number, (typeof packetEvents)[number]>();
  const requestedRoleByPacket = new Map<number, ExecutionRole>();

  for (const evt of packetEvents) {
    if (evt.workPacketId == null) continue;

    if (RUNTIME_KIND_SET.has(evt.kind) && !latestRuntimeByPacket.has(evt.workPacketId)) {
      latestRuntimeByPacket.set(evt.workPacketId, evt);
    }

    if (DEBUG_KIND_SET.has(evt.kind) && !latestDebugByPacket.has(evt.workPacketId)) {
      latestDebugByPacket.set(evt.workPacketId, evt);
    }

    if (!requestedRoleByPacket.has(evt.workPacketId)) {
      const requestedRole = getRequestedRoleFromPayload(evt.payload as JsonValue | null);
      if (requestedRole) {
        requestedRoleByPacket.set(evt.workPacketId, requestedRole);
      }
    }
  }

  const rows = packets.map((p) => {
    const inbox = inboxByPacket.get(p.id) ?? null;
    const tags = coerceStringArray(inbox?.tags);
    const assigneeNh = getAssigneeFromTags(tags);
    const costCategory = getCostCategoryFromTags(tags);
    const activationOutcome = getActivationOutcomeFromTags(tags);
    const requestedRoleFromTags = getRequestedRoleFromTags(tags);
    const assigneeAgent = assigneeNh ? getAgentByNhId(assigneeNh) : null;
    const requestedRoleFromEvents = requestedRoleByPacket.get(p.id) ?? null;
    const inferredRole = deriveRequestedRoleFromAgentKeyCompat(assigneeAgent?.agent_key ?? null);
    const requestedRole = requestedRoleFromTags ?? requestedRoleFromEvents ?? inferredRole;

    const latestRuntime = latestRuntimeByPacket.get(p.id) ?? null;
    const latestDebug = latestDebugByPacket.get(p.id) ?? null;

    const eligibility =
      assigneeAgent && requestedRole
        ? isAgentEligibleForExecutionRole(assigneeAgent, requestedRole)
        : assigneeNh
          ? false
          : null;

    const control = computeWorkPacketControlState({
      packetStatus: String(p.status),
      assigneeNhId: assigneeNh,
      requestedRole,
      githubPrUrl: p.githubPrUrl ?? null,
      verificationUrl: p.verificationUrl ?? null,
      latestRuntimeKind: latestRuntime?.kind ?? null,
      latestDebugKind: latestDebug?.kind ?? null,
    });

    const lane = computeExecutionLaneState({
      packetStatus: String(p.status),
      assigneeNhId: assigneeNh,
      requestedRole,
      githubPrUrl: p.githubPrUrl ?? null,
      verificationUrl: p.verificationUrl ?? null,
      latestRuntimeKind: latestRuntime?.kind ?? null,
      latestDebugKind: latestDebug?.kind ?? null,
    });

    return {
      packet: p,
      inbox,
      assigneeNh,
      assigneeAgent,
      costCategory,
      activationOutcome,
      requestedRole,
      latestRuntime,
      latestDebug,
      control,
      lane,
      eligibility,
    };
  });

  const filtered = rows.filter((r) => {
    if (assignee && r.assigneeNh !== assignee) return false;
    if (view === "assigned") return !!r.assigneeNh;
    if (view === "unassigned") return !r.assigneeNh;
    return true;
  });

  const assignedCount = rows.filter((r) => !!r.assigneeNh).length;
  const unassignedCount = rows.length - assignedCount;
  const mismatchCount = rows.filter((r) => r.eligibility === false).length;

  const current = {
    assignee,
    view,
    status: status ?? undefined,
    q,
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Work Packets</h1>
          <p className="text-sm text-gray-400 mt-1">
            Governed execution queue with explicit execution-role eligibility and execution-only assignee pools.
          </p>
        </div>

        <Link
          href={
            assignee
              ? `/operator/work/new?assignee=${encodeURIComponent(assignee)}`
              : "/operator/work/new"
          }
          className="w-fit rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          New packet
        </Link>
      </header>

      <section className="mb-6 rounded-lg border border-gray-800 bg-zinc-950 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={hrefWith(current, { view: null })}>
              <Chip tone="slate">
                All <span className="ml-2 text-gray-400">{rows.length}</span>
              </Chip>
            </Link>

            <Link href={hrefWith(current, { view: "assigned" })}>
              <Chip tone="sky">
                Assigned <span className="ml-2 text-sky-200/80">{assignedCount}</span>
              </Chip>
            </Link>

            <Link href={hrefWith(current, { view: "unassigned" })}>
              <Chip tone="amber">
                Unassigned <span className="ml-2 text-amber-200/80">{unassignedCount}</span>
              </Chip>
            </Link>

            <Chip tone={mismatchCount > 0 ? "red" : "emerald"}>
              Role mismatches <span className="ml-2">{mismatchCount}</span>
            </Chip>

            {assignee ? (
              <Chip tone="purple">
                assignee:{assignee}
                <Link
                  className="ml-2 text-gray-200/80 underline"
                  href={hrefWith(current, { assignee: null })}
                >
                  clear
                </Link>
              </Chip>
            ) : null}
          </div>

          <div className="text-xs text-gray-400">
            Showing <span className="text-gray-200">{filtered.length}</span> / {rows.length}
          </div>
        </div>

        <form method="get" className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-400 mb-1">Search</label>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="title or NH…"
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Status</label>
            <select
              name="status"
              defaultValue={status ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              <option value="">Any</option>
              {Object.values(WorkPacketStatus).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Assignee</label>
            <select
              name="assignee"
              defaultValue={assignee ?? ""}
              className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm"
            >
              <option value="">Any execution agent</option>
              {agents.map((a) => (
                <option key={a.nh_id} value={a.nh_id}>
                  {a.nh_id} · {a.label}
                </option>
              ))}
            </select>
          </div>

          {view ? <input type="hidden" name="view" value={view} /> : null}

          <div className="md:col-span-4 flex items-center gap-2">
            <button
              type="submit"
              className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
            >
              Apply
            </button>
            <Link
              href="/operator/work"
              className="rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-gray-200 hover:bg-zinc-900"
            >
              Reset
            </Link>
          </div>
        </form>
      </section>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-zinc-950 border-b border-gray-800 text-left">
            <tr>
              <th className="py-2 px-3 text-xs text-gray-400">NH</th>
              <th className="py-2 px-3 text-xs text-gray-400">Title</th>
              <th className="py-2 px-3 text-xs text-gray-400">Status</th>
              <th className="py-2 px-3 text-xs text-gray-400">Corpus V2</th>
              <th className="py-2 px-3 text-xs text-gray-400">Role</th>
              <th className="py-2 px-3 text-xs text-gray-400">Control</th>
              <th className="py-2 px-3 text-xs text-gray-400">Lane</th>
              <th className="py-2 px-3 text-xs text-gray-400">Assignee</th>
              <th className="py-2 px-3 text-xs text-gray-400">Eligibility</th>
              <th className="py-2 px-3 text-xs text-gray-400">Inbox</th>
              <th className="py-2 px-3 text-xs text-gray-400">Execution</th>
              <th className="py-2 px-3 text-xs text-gray-400">Repo</th>
              <th className="py-2 px-3 text-xs text-gray-400">Updated</th>
              <th className="py-2 px-3 text-xs text-gray-400">Links</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(
              ({
                packet: p,
                inbox,
                assigneeNh,
                costCategory,
                activationOutcome,
                requestedRole,
                latestRuntime,
                latestDebug,
                control,
                lane,
                eligibility,
              }) => (
                <tr key={p.id} className="border-b border-gray-900 hover:bg-zinc-900/60">
                  <td className="py-2 px-3 whitespace-nowrap font-mono text-xs">{p.nhId}</td>

                  <td className="py-2 px-3 min-w-[260px]">
                    <Link href={`/operator/work/${p.id}`} className="text-sky-400 underline">
                      {p.title}
                    </Link>
                    <div className="mt-1 text-[11px] text-gray-500">{control.nextAction}</div>
                  </td>

                  <td className="py-2 px-3 text-xs whitespace-nowrap">{p.status}</td>

                  <td className="py-2 px-3 text-xs min-w-[150px]">
                    <div className="flex flex-wrap items-center gap-2">
                      {costCategory ? <Chip tone="amber">{costCategory}</Chip> : null}
                      {activationOutcome ? (
                        <Chip tone={corpusOutcomeTone(activationOutcome)}>{activationOutcome}</Chip>
                      ) : null}
                      {!costCategory && !activationOutcome ? (
                        <span className="text-gray-500">—</span>
                      ) : null}
                    </div>
                  </td>

                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    {requestedRole ? (
                      <Chip tone="purple">{requestedRole}</Chip>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    <Chip tone={control.tone}>{control.phase}</Chip>
                  </td>

                  <td className="py-2 px-3 text-xs min-w-[170px]">
                    <div className="flex items-center gap-2">
                      <Chip tone={laneTone(lane.currentLane)}>{lane.currentLane}</Chip>
                      {lane.nextLane ? (
                        <>
                          <span className="text-gray-500">→</span>
                          <Chip tone={laneTone(lane.nextLane)}>{lane.nextLane}</Chip>
                        </>
                      ) : null}
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500">{lane.reason}</div>
                  </td>

                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    {assigneeNh ? (
                      <Chip tone="purple">{assigneeNh}</Chip>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    <Chip tone={eligibilityTone(eligibility)}>{eligibilityLabel(eligibility)}</Chip>
                  </td>

                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    {inbox ? (
                      <span className="font-mono text-gray-200">
                        {String(inbox.status)} · p{String(inbox.priority)}
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="py-2 px-3 text-xs min-w-[220px]">
                    {latestRuntime ? (
                      <div className="font-mono text-gray-200">{latestRuntime.kind}</div>
                    ) : latestDebug ? (
                      <div className="font-mono text-gray-200">{latestDebug.kind}</div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                    <div className="mt-1 text-[11px] text-gray-500">
                      {latestRuntime?.summary ?? latestDebug?.summary ?? control.reason}
                    </div>
                  </td>

                  <td className="py-2 px-3 text-xs">{p.repo?.name ?? "—"}</td>
                  <td className="py-2 px-3 text-xs whitespace-nowrap">{p.updatedAt.toISOString()}</td>

                  <td className="py-2 px-3 text-xs space-x-2 whitespace-nowrap">
                    {p.githubIssueUrl ? (
                      <a
                        className="text-sky-400 underline"
                        href={p.githubIssueUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        issue
                      </a>
                    ) : null}
                    {p.githubPrUrl ? (
                      <a
                        className="text-sky-400 underline"
                        href={p.githubPrUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        pr
                      </a>
                    ) : null}
                    {p.verificationUrl ? (
                      <a
                        className="text-sky-400 underline"
                        href={p.verificationUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        verify
                      </a>
                    ) : null}
                    {!p.githubIssueUrl && !p.githubPrUrl && !p.verificationUrl ? "—" : null}
                  </td>
                </tr>
              ),
            )}

            {filtered.length === 0 ? (
              <tr>
                <td className="py-6 px-3 text-sm text-gray-400" colSpan={14}>
                  No work packets match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
