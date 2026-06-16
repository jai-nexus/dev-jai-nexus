export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorContradictionCard,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSafetyRail,
  OperatorSectionHeader,
  type OperatorSlateTone,
} from "@/components/operator/slate";
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
  index,
  title,
  description,
  children,
  provenance,
}: {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
  provenance: "fixture" | "readOnly";
}) {
  return (
    <section className="space-y-4">
      <OperatorSectionHeader
        index={index}
        title={title}
        right={
          <OperatorBadge tone={provenance}>
            {provenance === "fixture" ? "SEEDED FIXTURE" : "DB READ-ONLY ARCHIVE"}
          </OperatorBadge>
        }
      />
      <p className="text-sm text-slate-400">{description}</p>
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
    <OperatorPanel>
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-100">{value}</div>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </OperatorPanel>
  );
}

function ToneBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "sky" | "amber" | "emerald" | "rose" | "slate";
}) {
  const slateTone: OperatorSlateTone =
    tone === "sky"
      ? "readOnly"
      : tone === "amber"
        ? "advisory"
        : tone === "emerald"
          ? "readOnly"
          : tone === "rose"
            ? "blocked"
            : "neutral";

  return <OperatorBadge tone={slateTone}>{children}</OperatorBadge>;
}

function ContinuityCard({ record }: { record: ConversationRecord }) {
  const artifactAbsolutePath = path.join(process.cwd(), record.artifact_path_preview);
  const artifactExists = fs.existsSync(artifactAbsolutePath);

  return (
    <OperatorPanel className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-100">{record.title}</h3>
            <ToneBadge tone="amber">
              {getConversationSourceKindLabel(record.source_kind)}
            </ToneBadge>
            <OperatorBadge tone="fixture">FIXTURE CAPTURE</OperatorBadge>
            <ToneBadge tone={artifactExists ? "emerald" : "amber"}>
              {artifactExists ? "committed artifact present" : "artifact preview only"}
            </ToneBadge>
          </div>
          <p className="max-w-4xl text-sm text-slate-300">{record.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OperatorIdChip>{record.repo_full_name}</OperatorIdChip>
          <ToneBadge tone="slate">{record.surface_label}</ToneBadge>
          <OperatorIdChip>{record.chat_id}</OperatorIdChip>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <OperatorGateCard>
            <h4 className="text-sm font-semibold text-slate-100">
              Repo-native capture naming
            </h4>
            <ul className="mt-3 space-y-1 text-sm text-slate-300">
              <li>- chat id: {record.chat_id}</li>
              <li>- source label: {record.source_label}</li>
              <li>- captured at: {record.captured_at}</li>
              <li>- artifact path preview: {record.artifact_path_preview}</li>
              <li>- committed artifact present: {artifactExists ? "yes" : "no"}</li>
            </ul>
          </OperatorGateCard>

          <OperatorGateCard>
            <h4 className="text-sm font-semibold text-slate-100">
              Linked operating memory
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {record.related_motion_ids.map((motionId) => (
                <OperatorIdChip key={`${record.chat_id}-${motionId}`}>
                  {motionId}
                </OperatorIdChip>
              ))}
              {record.related_wave_ids.map((waveId) => (
                <OperatorIdChip key={`${record.chat_id}-${waveId}`}>{waveId}</OperatorIdChip>
              ))}
              {record.related_work_packet_ids.map((packetId) => (
                <OperatorIdChip key={`${record.chat_id}-${packetId}`}>
                  {packetId}
                </OperatorIdChip>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
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
          </OperatorGateCard>
        </div>

        <div className="space-y-4">
          <OperatorGateCard>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">
                Extracted decision notes
              </h4>
              <OperatorBadge tone="advisory">NOT A RECEIPT</OperatorBadge>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {record.decisions.map((decision) => (
                <li key={decision}>- {decision}</li>
              ))}
            </ul>
          </OperatorGateCard>
          <OperatorContradictionCard>
            <h4 className="text-sm font-semibold text-slate-100">Risks and tasks</h4>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <ul className="space-y-2 text-sm text-slate-300">
                {record.risks.map((risk) => (
                  <li key={risk}>- {risk}</li>
                ))}
              </ul>
              <ul className="space-y-2 text-sm text-slate-300">
                {record.tasks.map((task) => (
                  <li key={task}>- {task}</li>
                ))}
              </ul>
            </div>
          </OperatorContradictionCard>
          <OperatorGateCard>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">
                Copy-only next prompt
              </h4>
              <OperatorBadge tone="composeOnly">COPY-ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
            </div>
            <textarea
              readOnly
              value={record.next_prompts[0] ?? ""}
              rows={16}
              className="mt-3 w-full rounded border border-slate-800 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-200"
            />
          </OperatorGateCard>
        </div>
      </div>
    </OperatorPanel>
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
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <OperatorPanel className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="mr-2 text-3xl font-semibold">
                JAI NEXUS - Conversation Continuity
              </h1>
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">DB READ-ONLY ARCHIVE</OperatorBadge>
              <OperatorBadge tone="fixture">SEEDED FIXTURE</OperatorBadge>
              <OperatorBadge tone="advisory">CAPTURE / INDEX ONLY</OperatorBadge>
              <OperatorBadge tone="composeOnly">COPY-ONLY OUTPUT</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <p className="mt-4 max-w-4xl text-sm text-slate-400">
              Read-only archive browsing and seeded local continuity records make
              prior reasoning navigable. Archive records and fixtures are shown
              separately; neither source grants authority or establishes canon.
            </p>
            <OperatorGateCard className="mt-4 text-sm text-slate-300">
              <p>
                Naming convention: <OperatorIdChip>{namingExample}</OperatorIdChip>
              </p>
              <p className="mt-2">
                Artifact path convention:{" "}
                <OperatorIdChip>.nexus/chats/{namingExample}.md</OperatorIdChip>
              </p>
              <p className="mt-3 text-xs text-slate-400">
                Prompt text is not dispatch. Extracted decision notes are not
                receipts, automatic acceptance, or canon updates.
              </p>
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail invariants={OPERATOR_SAFETY_INVARIANTS}>
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Capture automatically</OperatorBlockedAction>
              <OperatorBlockedAction>Dispatch prompt</OperatorBlockedAction>
              <OperatorBlockedAction>Create receipt</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Search and filters only read existing archive records. Dashboard
              display does not authorize action.
            </p>
          </OperatorSafetyRail>
        </div>

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
          index="01"
          title="Captured continuity records"
          description="Bundled/static continuity records now include both captured operator deliberations and repo-facing planning captures linked into motions, waves, work packets, and next prompts."
          provenance="fixture"
        >
          <div className="space-y-4">
            {continuityRecords.map((record) => (
              <ContinuityCard key={record.chat_id} record={record} />
            ))}
          </div>
        </Section>

        <Section
          index="02"
          title="Future JAI conversation captures"
          description="This seam defines the naming and indexing model for future captures without enabling automatic live collection."
          provenance="fixture"
        >
          <OperatorPanel className="p-5 text-sm text-slate-300">
            <p>
              Future capture categories are expected to include:
            </p>
            <ul className="mt-3 space-y-2">
              <li>- operator deliberations captured from `/operator/deliberation`</li>
              <li>- repo execution/control threads captured manually after operator review</li>
              <li>- manual continuity captures that bridge motions, waves, and work packets</li>
            </ul>
            <p className="mt-4 text-slate-400">
              No automatic live capture, hidden persistence, DB writes, or API mutation are enabled in v0.
            </p>
          </OperatorPanel>
        </Section>

        <Section
          index="03"
          title="Imported archive chats"
          description="Existing archive browsing remains intact for older imported material."
          provenance="readOnly"
        >
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {sourceFilter && (
                <OperatorBadge tone="readOnly">
                  Source: {sourceFilter}
                </OperatorBadge>
              )}
              {searchQuery && (
                <OperatorBadge tone="readOnly">
                  Search: {searchQuery}
                </OperatorBadge>
              )}
              <Link
                href="/operator/chats"
                className="text-[11px] text-sky-400 underline"
              >
                Clear filters
              </Link>
            </div>
          )}

          <form method="get" className="flex flex-wrap gap-2">
            <input
              name="q"
              defaultValue={searchQuery ?? ""}
              placeholder="Search imported archive chats..."
              className="min-w-64 flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-700 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded border border-sky-800 px-3 py-2 font-mono text-xs uppercase tracking-wide text-sky-300 hover:bg-sky-950"
            >
              Search archive
            </button>
            <OperatorReadOnlyAction>GET FILTER ONLY</OperatorReadOnlyAction>
          </form>

          <OperatorPanel>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
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
          </OperatorPanel>

          {chats.length === 0 ? (
            <OperatorGateCard className="text-sm text-slate-400">
              No imported archive chats found. {hasFilters ? "Try clearing filters." : ""}
            </OperatorGateCard>
          ) : (
            <div className="space-y-3">
              {chats.map((chat) => (
                <OperatorGateCard key={chat.id}>
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
                        <OperatorBadge tone="readOnly">
                          DB READ-ONLY ARCHIVE
                        </OperatorBadge>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span>
                          <span className="text-slate-500">Date:</span>{" "}
                          {formatCentral(chat.chatDate)}
                        </span>
                        <span>
                          <span className="text-slate-500">Source:</span>{" "}
                          <Link
                            href={`/operator/chats?source=${encodeURIComponent(chat.source)}`}
                            className="text-sky-400 underline"
                          >
                            {chat.source}
                          </Link>
                        </span>
                        {chat.model ? (
                          <span>
                            <span className="text-slate-500">Model:</span> {chat.model}
                          </span>
                        ) : null}
                        {chat._count.decisions > 0 ? (
                          <span className="text-amber-300">
                            {chat._count.decisions} decision
                            {chat._count.decisions !== 1 ? "s" : ""} extracted -
                            not receipts
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <OperatorIdChip>{chat.chatId}</OperatorIdChip>
                  </div>
                </OperatorGateCard>
              ))}
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}
