export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import type { Prisma } from "@prisma/client";
import Link from "next/link";

import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorReadOnlyAction,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
  type OperatorSlateTone,
} from "@/components/operator/slate";
import { prisma } from "@/lib/prisma";
import { formatCentral } from "@/lib/time";

type SearchParams = {
  category?: string | string[];
  status?: string | string[];
  q?: string | string[];
  chatId?: string | string[];
};

interface DecisionsPageProps {
  searchParams?: SearchParams | Promise<SearchParams>;
}

type CategoryGroupRow = {
  category: string | null;
  _count: { category: number };
};

type StatusGroupRow = {
  status: string;
  _count: { status: number };
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function statusTone(status: string): OperatorSlateTone {
  const normalized = status.toLowerCase();
  if (normalized === "deprecated") return "blocked";
  if (normalized === "superseded") return "advisory";
  return "readOnly";
}

function categoryTone(category: string | null): OperatorSlateTone {
  const normalized = category?.toLowerCase();
  if (normalized === "deprecated") return "blocked";
  if (normalized === "milestone" || normalized === "timeline") return "advisory";
  return "neutral";
}

export default async function DecisionsPage({
  searchParams,
}: DecisionsPageProps) {
  const sp = await Promise.resolve(searchParams ?? {});
  const categoryFilter = firstParam(sp.category);
  const statusFilter = firstParam(sp.status);
  const searchQuery = firstParam(sp.q);
  const chatIdFilter = firstParam(sp.chatId);

  const where: Prisma.DecisionWhereInput = {};

  if (categoryFilter) where.category = categoryFilter;
  if (statusFilter) where.status = statusFilter;

  if (chatIdFilter) {
    const parsedChatId = Number.parseInt(chatIdFilter, 10);
    if (Number.isFinite(parsedChatId)) where.chatId = parsedChatId;
  }

  if (searchQuery) {
    where.OR = [
      { text: { contains: searchQuery, mode: "insensitive" } },
      { context: { contains: searchQuery, mode: "insensitive" } },
      { chat: { title: { contains: searchQuery, mode: "insensitive" } } },
    ];
  }

  const [decisions, totalCount, categories, statuses] = await Promise.all([
    prisma.decision.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        chat: {
          select: { id: true, title: true, chatDate: true, source: true },
        },
      },
    }),
    prisma.decision.count({ where }),
    prisma.decision
      .groupBy({
        by: ["category"],
        _count: { category: true },
      })
      .catch((): CategoryGroupRow[] => []),
    prisma.decision
      .groupBy({
        by: ["status"],
        _count: { status: true },
      })
      .catch((): StatusGroupRow[] => []),
  ]);

  const hasFilters = Boolean(
    categoryFilter || statusFilter || searchQuery || chatIdFilter,
  );

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-300 lg:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <OperatorPanel className="p-5">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              dev.jai.nexus / operator / decisions
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100">
              JAI NEXUS - Decisions
            </h1>
            <p className="mt-2 max-w-4xl text-sm text-slate-400">
              Read-only DB records extracted from archived AI conversations.
              These rows preserve source-chat lineage, but extraction is not
              acceptance, canon, a receipt, or execution authority.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">NON-AUTHORIZING</OperatorBadge>
              <OperatorBadge tone="readOnly">DB READ-ONLY</OperatorBadge>
              <OperatorBadge tone="advisory">EXTRACTED CLAIMS</OperatorBadge>
              <OperatorBadge tone="blocked">NOT RECEIPTS</OperatorBadge>
              <OperatorBadge tone="blocked">NO EXECUTION</OperatorBadge>
              <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
            </div>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Decision Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <p className="text-xs text-slate-400">
              Status describes an extracted row. It does not establish canonical
              doctrine or replace a CONTROL_THREAD decision.
            </p>
          </OperatorSafetyRail>
        </header>

        <section>
          <OperatorSectionHeader
            index="01"
            title="Extracted Decision Posture"
            right={
              <>
                <OperatorBadge tone="readOnly">SOURCE: DECISION TABLE</OperatorBadge>
                <OperatorBadge tone="advisory">MANUAL EXTRACTION FRESHNESS</OperatorBadge>
              </>
            }
          />
          <div className="grid gap-3 md:grid-cols-3">
            <OperatorPanel>
              <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                Matching decisions
              </div>
              <div className="mt-2 font-mono text-2xl text-slate-100">
                {totalCount}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                DB rows matching the active filters.
              </p>
            </OperatorPanel>

            <OperatorPanel>
              <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                By category
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const label = category.category ?? "uncategorized";
                  const href = category.category
                    ? `/operator/decisions?category=${encodeURIComponent(
                        category.category,
                      )}`
                    : "/operator/decisions";
                  return (
                    <Link key={label} href={href}>
                      <OperatorBadge tone={categoryTone(category.category)}>
                        {label} x{category._count.category}
                      </OperatorBadge>
                    </Link>
                  );
                })}
              </div>
            </OperatorPanel>

            <OperatorPanel>
              <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                By status
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Link
                    key={status.status}
                    href={`/operator/decisions?status=${encodeURIComponent(
                      status.status,
                    )}`}
                  >
                    <OperatorBadge tone={statusTone(status.status)}>
                      {status.status} x{status._count.status}
                    </OperatorBadge>
                  </Link>
                ))}
              </div>
            </OperatorPanel>
          </div>
        </section>

        <OperatorPanel>
          <OperatorSectionHeader
            index="02"
            title="Read-Only Filters"
            right={<OperatorBadge tone="readOnly">QUERY ONLY</OperatorBadge>}
          />

          {hasFilters ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {categoryFilter ? (
                <OperatorBadge tone="neutral">
                  CATEGORY: {categoryFilter}
                </OperatorBadge>
              ) : null}
              {statusFilter ? (
                <OperatorBadge tone="neutral">STATUS: {statusFilter}</OperatorBadge>
              ) : null}
              {chatIdFilter ? (
                <OperatorBadge tone="neutral">CHAT ID: {chatIdFilter}</OperatorBadge>
              ) : null}
              {searchQuery ? (
                <OperatorBadge tone="neutral">SEARCH: {searchQuery}</OperatorBadge>
              ) : null}
              <Link
                href="/operator/decisions"
                className="font-mono text-xs uppercase tracking-wide text-sky-300 underline"
              >
                Clear filters
              </Link>
            </div>
          ) : null}

          <form method="get" className="flex gap-2">
            <input
              name="q"
              defaultValue={searchQuery ?? ""}
              placeholder="Search extracted decisions..."
              className="flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-700 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded border border-sky-800 bg-sky-950 px-4 py-2 font-mono text-xs uppercase tracking-wide text-sky-300"
            >
              Filter records
            </button>
          </form>
        </OperatorPanel>

        <section>
          <OperatorSectionHeader
            index="03"
            title="Decision Records And Source Lineage"
            right={
              <>
                <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
                <OperatorBadge tone="blocked">RECEIPT: NONE CREATED</OperatorBadge>
              </>
            }
          />

          {decisions.length === 0 ? (
            <OperatorPanel className="text-sm text-slate-400">
              No decision records found.{" "}
              {hasFilters
                ? "Try clearing filters."
                : "The extraction process has not populated matching rows."}
            </OperatorPanel>
          ) : (
            <div className="space-y-3">
              {decisions.map((decision) => (
                <OperatorPanel key={decision.id} className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <OperatorIdChip>DECISION-{decision.id}</OperatorIdChip>
                        <OperatorStatusChip
                          status={decision.status}
                          tone={statusTone(decision.status)}
                        />
                        <OperatorBadge tone={categoryTone(decision.category)}>
                          {decision.category ?? "uncategorized"}
                        </OperatorBadge>
                        <OperatorBadge tone="advisory">EXTRACTED RECORD</OperatorBadge>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-100">
                        {decision.text}
                      </p>
                      {decision.context ? (
                        <OperatorGateCard className="mt-3">
                          <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                            Extracted context
                          </div>
                          <p className="mt-2 text-xs italic text-slate-400">
                            {decision.context}
                          </p>
                        </OperatorGateCard>
                      ) : null}
                    </div>

                    <OperatorGateCard className="w-full shrink-0 lg:w-80">
                      <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
                        Source lineage
                      </div>
                      <dl className="mt-2 space-y-2 text-xs">
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-500">Chat record</dt>
                          <dd className="font-mono text-slate-200">
                            CHAT-{decision.chat.id}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-500">Source</dt>
                          <dd className="text-right text-slate-200">
                            {decision.chat.source}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-500">Chat date</dt>
                          <dd className="text-right text-slate-200">
                            {formatCentral(decision.chat.chatDate)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-500">Line</dt>
                          <dd className="font-mono text-slate-200">
                            {decision.lineNumber ?? "not recorded"}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-3">
                        <Link href={`/operator/chats/${decision.chat.id}`}>
                          <OperatorReadOnlyAction>
                            Open source chat: {decision.chat.title}
                          </OperatorReadOnlyAction>
                        </Link>
                      </div>
                    </OperatorGateCard>
                  </div>

                  <div className="mt-4 border-t border-slate-800 pt-3">
                    <div className="flex flex-wrap gap-2">
                      <OperatorBadge tone="blocked">NOT A RECEIPT</OperatorBadge>
                      <OperatorBadge tone="blocked">NOT AUTOMATIC CANON</OperatorBadge>
                      <OperatorBadge tone="advisory">
                        CONTROL_THREAD REVIEW REQUIRED
                      </OperatorBadge>
                    </div>
                  </div>
                </OperatorPanel>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
