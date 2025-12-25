// portal/src/app/operator/work/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/auth";
import { getAgencyConfig, type AgencyAgent } from "@/lib/agencyConfig";
import { WorkPacketStatus } from "../../../../prisma/generated/prisma";

type SearchParamValue = string | string[] | undefined;

type SearchParams = {
  assignee?: SearchParamValue; // "1.2"
  view?: SearchParamValue; // "assigned" | "unassigned"
  status?: SearchParamValue; // WorkPacketStatus
  q?: SearchParamValue; // search
};

type Props = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

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

function coerceStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") return [v];
  return [];
}

function getAssigneeFromTags(tags: string[]): string | null {
  const hit = tags.find((t) => typeof t === "string" && t.startsWith("assignee:"));
  if (!hit) return null;
  const nh = hit.slice("assignee:".length).trim();
  return sanitizeNhLike(nh) ?? null;
}

function Chip({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "emerald" | "sky" | "amber" | "purple";
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
    ...Object.fromEntries(
      Object.entries(patch).map(([k, v]) => [k, v === null ? undefined : v]),
    ),
  };

  if (next.assignee) sp.set("assignee", next.assignee);
  if (next.view) sp.set("view", next.view);
  if (next.status) sp.set("status", next.status);
  if (next.q) sp.set("q", next.q);

  const qs = sp.toString();
  return qs ? `/operator/work?${qs}` : "/operator/work";
}

type WorkPacketFindManyArgs = NonNullable<Parameters<typeof prisma.workPacket.findMany>[0]>;
type WorkPacketWhereInput = WorkPacketFindManyArgs["where"];

export default async function WorkPage({ searchParams }: Props) {
  // ✅ hard auth guard (prevents incognito/prod crashes & leaks)
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login?next=/operator/work");

  const agency = getAgencyConfig();
  const agents: AgencyAgent[] = [...agency.agents].sort((a, b) =>
    a.nh_id.localeCompare(b.nh_id),
  );

  // ✅ Next 16.1: searchParams may be a Promise
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
        orderBy: { id: "desc" }, // newest first
        select: {
          id: true,
          workPacketId: true,
          status: true,
          priority: true,
          tags: true,
        },
      })
    : [];

  // pick latest inbox row per packet
  const inboxByPacket = new Map<number, (typeof inboxItems)[number]>();
  for (const item of inboxItems) {
    if (!inboxByPacket.has(item.workPacketId)) inboxByPacket.set(item.workPacketId, item);
  }

  const rows = packets.map((p) => {
    const inbox = inboxByPacket.get(p.id) ?? null;
    const tags = coerceStringArray(inbox?.tags);
    const assigneeNh = getAssigneeFromTags(tags);
    return { packet: p, inbox, assigneeNh };
  });

  const filtered = rows.filter((r) => {
    if (assignee && r.assigneeNh !== assignee) return false;
    if (view === "assigned") return !!r.assigneeNh;
    if (view === "unassigned") return !r.assigneeNh;
    return true;
  });

  const assignedCount = rows.filter((r) => !!r.assigneeNh).length;
  const unassignedCount = rows.length - assignedCount;

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
            Architect AC/Plan → Builder PR → Verifier runs → Operator approves.
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

      {/* Filters */}
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
              <option value="">Any</option>
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-zinc-950 border-b border-gray-800 text-left">
            <tr>
              <th className="py-2 px-3 text-xs text-gray-400">NH</th>
              <th className="py-2 px-3 text-xs text-gray-400">Title</th>
              <th className="py-2 px-3 text-xs text-gray-400">Status</th>
              <th className="py-2 px-3 text-xs text-gray-400">Assignee</th>
              <th className="py-2 px-3 text-xs text-gray-400">Inbox</th>
              <th className="py-2 px-3 text-xs text-gray-400">Repo</th>
              <th className="py-2 px-3 text-xs text-gray-400">Updated</th>
              <th className="py-2 px-3 text-xs text-gray-400">Links</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(({ packet: p, inbox, assigneeNh }) => (
              <tr key={p.id} className="border-b border-gray-900 hover:bg-zinc-900/60">
                <td className="py-2 px-3 whitespace-nowrap font-mono text-xs">{p.nhId}</td>

                <td className="py-2 px-3">
                  <Link href={`/operator/work/${p.id}`} className="text-sky-400 underline">
                    {p.title}
                  </Link>
                </td>

                <td className="py-2 px-3 text-xs">{p.status}</td>

                <td className="py-2 px-3 text-xs whitespace-nowrap">
                  {assigneeNh ? <Chip tone="purple">{assigneeNh}</Chip> : <span className="text-gray-500">—</span>}
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

                <td className="py-2 px-3 text-xs">{p.repo?.name ?? "—"}</td>
                <td className="py-2 px-3 text-xs">{p.updatedAt.toISOString()}</td>

                <td className="py-2 px-3 text-xs space-x-2 whitespace-nowrap">
                  {p.githubIssueUrl ? (
                    <a className="text-sky-400 underline" href={p.githubIssueUrl} target="_blank" rel="noreferrer">
                      issue
                    </a>
                  ) : null}
                  {p.githubPrUrl ? (
                    <a className="text-sky-400 underline" href={p.githubPrUrl} target="_blank" rel="noreferrer">
                      pr
                    </a>
                  ) : null}
                  {p.verificationUrl ? (
                    <a className="text-sky-400 underline" href={p.verificationUrl} target="_blank" rel="noreferrer">
                      verify
                    </a>
                  ) : null}
                  {!p.githubIssueUrl && !p.githubPrUrl && !p.verificationUrl ? "—" : null}
                </td>
              </tr>
            ))}

            {filtered.length === 0 ? (
              <tr>
                <td className="py-6 px-3 text-sm text-gray-400" colSpan={8}>
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
