export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCentral } from "@/lib/time";
import {
  buildConversationArtifactId,
  getConversationSourceKindLabel,
  getSeededConversationRecords,
} from "@/lib/continuity/conversations";
import type { ConversationRecord } from "@/lib/continuity/types";
import type { Prisma } from "@prisma/client";
import type { ReactNode } from "react";

type SearchParams = {
  source?: string | string[];
  q?: string | string[];
  limit?: string | string[];
};

interface ChatsPageProps {
  searchParams?: SearchParams | Promise<SearchParams>;
}

type SourceGroupRow = {
  source: string;
  _count: { source: number };
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-medium text-gray-100">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-100">{value}</div>
      <p className="mt-2 text-sm text-gray-400">{detail}</p>
    </div>
  );
}

function ToneBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "sky" | "amber" | "emerald" | "rose" | "slate";
}) {
  const toneClass =
    tone === "sky"
      ? "border-sky-800 bg-sky-950 text-sky-200"
      : tone === "amber"
        ? "border-amber-800 bg-amber-950 text-amber-200"
        : tone === "emerald"
          ? "border-emerald-800 bg-emerald-950 text-emerald-200"
          : tone === "rose"
            ? "border-rose-800 bg-rose-950 text-rose-200"
            : "border-gray-800 bg-zinc-900 text-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function ContinuityCard({ record }: { record: ConversationRecord }) {
  return (
    <article className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-100">{record.title}</h3>
            <ToneBadge tone="amber">
              {getConversationSourceKindLabel(record.source_kind)}
            </ToneBadge>
            <ToneBadge tone="rose">captured v0</ToneBadge>
          </div>
          <p className="max-w-4xl text-sm text-gray-300">{record.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ToneBadge tone="sky">{record.repo_full_name}</ToneBadge>
          <ToneBadge tone="slate">{record.surface_label}</ToneBadge>
          <ToneBadge tone="emerald">{record.chat_id}</ToneBadge>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">
              Repo-native capture naming
            </h4>
            <ul className="mt-3 space-y-1 text-sm text-gray-300">
              <li>- chat id: {record.chat_id}</li>
              <li>- source label: {record.source_label}</li>
              <li>- captured at: {record.captured_at}</li>
              <li>- artifact path preview: {record.artifact_path_preview}</li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Linked operating memory</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {record.related_motion_ids.map((motionId) => (
                <ToneBadge key={`${record.chat_id}-${motionId}`} tone="amber">
                  {motionId}
                </ToneBadge>
              ))}
              {record.related_wave_ids.map((waveId) => (
                <ToneBadge key={`${record.chat_id}-${waveId}`} tone="sky">
                  {waveId}
                </ToneBadge>
              ))}
              {record.related_work_packet_ids.map((packetId) => (
                <ToneBadge key={`${record.chat_id}-${packetId}`} tone="emerald">
                  {packetId}
                </ToneBadge>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
              <Link href="/operator/deliberation" className="text-sky-300 underline">
                /operator/deliberation
              </Link>
              <Link href="/operator/waves" className="text-sky-300 underline">
                /operator/waves
              </Link>
              <Link href="/operator/work" className="text-sky-300 underline">
                /operator/work
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Decisions</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              {record.decisions.map((decision) => (
                <li key={decision}>- {decision}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <h4 className="text-sm font-semibold text-gray-100">Risks and tasks</h4>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <ul className="space-y-2 text-sm text-gray-300">
                {record.risks.map((risk) => (
                  <li key={risk}>- {risk}</li>
                ))}
              </ul>
              <ul className="space-y-2 text-sm text-gray-300">
                {record.tasks.map((task) => (
                  <li key={task}>- {task}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-100">
                Copy-only next prompt
              </h4>
              <ToneBadge tone="amber">capture only</ToneBadge>
            </div>
            <textarea
              readOnly
              value={record.next_prompts[0] ?? ""}
              rows={16}
              className="mt-3 w-full rounded-lg border border-gray-800 bg-black px-3 py-3 font-mono text-xs text-gray-200"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function ChatsPage({ searchParams }: ChatsPageProps) {
  const sp = await Promise.resolve(searchParams ?? {});

  const sourceFilter = firstParam(sp.source);
  const searchQuery = firstParam(sp.q);
  const limitParam = firstParam(sp.limit);

  const parsedLimit = limitParam ? parseInt(limitParam, 10) : NaN;
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 500)
    : 100;

  const where: Prisma.ChatWhereInput = {};

  if (sourceFilter) {
    where.source = sourceFilter;
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { fullText: { contains: searchQuery, mode: "insensitive" } },
      { chatId: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const [chats, totalCount, sources] = await Promise.all([
    prisma.chat.findMany({
      where,
      orderBy: { chatDate: "desc" },
      take: limit,
      include: {
        _count: {
          select: { decisions: true },
        },
      },
    }),
    prisma.chat.count({ where }),
    prisma.chat
      .groupBy({
        by: ["source"],
        _count: { source: true },
      })
      .then((rows) =>
        rows
          .filter(
            (row): row is { source: string; _count: { source: number } } =>
              typeof row.source === "string",
          )
          .map((row) => ({ source: row.source, _count: { source: row._count.source } })),
      )
      .catch((): SourceGroupRow[] => []),
  ]);

  const continuityRecords = getSeededConversationRecords();
  const hasFilters = Boolean(sourceFilter || searchQuery);
  const namingExample = buildConversationArtifactId(
    "2026-04-28",
    "operator-deliberation",
    "customer-portal-intake-map",
  );

  return (
    <main className="min-h-screen bg-black p-8 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">JAI NEXUS - Conversation Continuity</h1>
            <ToneBadge tone="amber">capture/index only</ToneBadge>
            <ToneBadge tone="rose">no automatic live capture</ToneBadge>
          </div>
          <p className="max-w-4xl text-sm text-gray-400">
            Repo-native continuity layer for imported archive chats, captured
            operator deliberations, and future JAI conversation captures. This
            v0 seam makes reasoning durable and navigable without adding hidden
            persistence, DB mutation, or execution authority.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              Naming convention: <span className="font-mono">{namingExample}</span>
            </p>
            <p className="mt-1">
              Artifact path convention:{" "}
              <span className="font-mono">
                .nexus/chats/{namingExample}.md
              </span>
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Captured continuity records"
            value={String(continuityRecords.length)}
            detail="Seeded repo-native captures derived from current deliberation output."
          />
          <SummaryCard
            label="Imported archive chats"
            value={String(totalCount)}
            detail="Existing archive browsing remains available from the prior chat memory surface."
          />
          <SummaryCard
            label="Source groups"
            value={String(sources.length)}
            detail="Imported archive sources remain filterable without changing archive detail pages."
          />
          <SummaryCard
            label="Execution posture"
            value="blocked"
            detail="This seam captures and indexes reasoning only. No run, dispatch, branch write, or PR capability is added."
          />
        </section>

        <Section
          title="Captured operator deliberations"
          description="New continuity records are bundled/static in v0 and link deliberation output into motions, waves, work packets, and next prompts."
        >
          <div className="space-y-4">
            {continuityRecords.map((record) => (
              <ContinuityCard key={record.chat_id} record={record} />
            ))}
          </div>
        </Section>

        <Section
          title="Future JAI conversation captures"
          description="This seam defines the naming and indexing model for future captures without enabling automatic live collection."
        >
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5 text-sm text-gray-300">
            <p>
              Future capture categories are expected to include:
            </p>
            <ul className="mt-3 space-y-2">
              <li>- operator deliberations captured from `/operator/deliberation`</li>
              <li>- repo execution/control threads captured manually after operator review</li>
              <li>- manual continuity captures that bridge motions, waves, and work packets</li>
            </ul>
            <p className="mt-4 text-gray-400">
              No automatic live capture, hidden persistence, DB writes, or API mutation are enabled in v0.
            </p>
          </div>
        </Section>

        <Section
          title="Imported archive chats"
          description="Existing archive browsing remains intact for older imported material."
        >
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {sourceFilter && (
                <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px]">
                  Source: <span className="ml-1 font-mono">{sourceFilter}</span>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px]">
                  Search: <span className="ml-1 font-mono">{searchQuery}</span>
                </span>
              )}
              <Link
                href="/operator/chats"
                className="text-[11px] text-sky-400 underline"
              >
                Clear filters
              </Link>
            </div>
          )}

          <form method="get" className="flex gap-2">
            <input
              name="q"
              defaultValue={searchQuery ?? ""}
              placeholder="Search imported archive chats..."
              className="flex-1 rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-sky-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
            >
              Search
            </button>
          </form>

          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Imported archive sources
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {sources.map((source) => (
                <div key={source.source} className="text-xs">
                  <Link
                    href={`/operator/chats?source=${encodeURIComponent(source.source)}`}
                    className="font-mono text-sky-400 underline"
                  >
                    {source.source}
                  </Link>
                  <span className="ml-2 text-zinc-500">x{source._count.source}</span>
                </div>
              ))}
            </div>
          </div>

          {chats.length === 0 ? (
            <p className="text-sm text-gray-400">
              No imported archive chats found. {hasFilters ? "Try clearing filters." : ""}
            </p>
          ) : (
            <div className="space-y-3">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="rounded-lg border border-gray-800 bg-zinc-950 p-4 transition-colors hover:bg-zinc-900/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium">
                          <Link
                            href={`/operator/chats/${chat.id}`}
                            className="text-sky-400 hover:text-sky-300"
                          >
                            {chat.title}
                          </Link>
                        </h3>
                        <ToneBadge tone="slate">imported archive</ToneBadge>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                        <span>
                          <span className="text-gray-500">Date:</span>{" "}
                          {formatCentral(chat.chatDate)}
                        </span>
                        <span>
                          <span className="text-gray-500">Source:</span>{" "}
                          <Link
                            href={`/operator/chats?source=${encodeURIComponent(chat.source)}`}
                            className="text-sky-400 underline"
                          >
                            {chat.source}
                          </Link>
                        </span>
                        {chat.model ? (
                          <span>
                            <span className="text-gray-500">Model:</span> {chat.model}
                          </span>
                        ) : null}
                        {chat._count.decisions > 0 ? (
                          <span className="text-emerald-400">
                            {chat._count.decisions} decision
                            {chat._count.decisions !== 1 ? "s" : ""}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-xs font-mono whitespace-nowrap text-gray-600">
                      {chat.chatId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}
