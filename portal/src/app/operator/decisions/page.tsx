export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCentral } from "@/lib/time";
import type { Prisma } from "@prisma/client";

type SearchParams = {
    category?: string | string[];
    status?: string | string[];
    q?: string | string[];
    chatId?: string | string[];
};

interface DecisionsPageProps {
    searchParams?: SearchParams | Promise<SearchParams>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
}

type CategoryGroupRow = {
    category: string | null;
    _count: { category: number };
};

type StatusGroupRow = {
    status: string;
    _count: { status: number };
};

export default async function DecisionsPage({ searchParams }: DecisionsPageProps) {
    const sp = await Promise.resolve(searchParams ?? {});

    const categoryFilter = firstParam(sp.category);
    const statusFilter = firstParam(sp.status);
    const searchQuery = firstParam(sp.q);
    const chatIdFilter = firstParam(sp.chatId);

    const where: Prisma.DecisionWhereInput = {};

    if (categoryFilter) where.category = categoryFilter;
    if (statusFilter) where.status = statusFilter;

    if (chatIdFilter) {
        const n = parseInt(chatIdFilter, 10);
        if (Number.isFinite(n)) {
            // If your Decision.chatId is Int, this is correct.
            // If it's String in your schema, change this to: where.chatId = chatIdFilter;
            where.chatId = n;
        }
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
            .then((rows) =>
                // normalize away null/empty status if your schema ever allows it
                rows.filter(
                    (r): r is { status: string; _count: { status: number } } =>
                        typeof r.status === "string" && r.status.length > 0
                )
            )
            .catch((): StatusGroupRow[] => []),
    ]);

    const hasFilters = Boolean(categoryFilter || statusFilter || searchQuery || chatIdFilter);

    const categoryColors: Record<string, string> = {
        deprecated: "border-red-800 bg-red-950/30 text-red-300",
        milestone: "border-amber-800 bg-amber-950/30 text-amber-300",
        timeline: "border-purple-800 bg-purple-950/30 text-purple-300",
        architecture: "border-blue-800 bg-blue-950/30 text-blue-300",
        decision: "border-emerald-800 bg-emerald-950/30 text-emerald-300",
    };

    const statusColors: Record<string, string> = {
        active: "bg-emerald-900/40 text-emerald-300",
        superseded: "bg-amber-900/40 text-amber-300",
        deprecated: "bg-red-900/40 text-red-300",
    };

    return (
        <main className="min-h-screen bg-black text-gray-100 p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-semibold">JAI NEXUS · Decisions</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Extracted decisions from archived AI conversations.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-8">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded">
                        <div className="text-xs text-gray-400 uppercase tracking-tighter">
                            Total Decisions
                        </div>
                        <div className="text-2xl font-mono text-zinc-200">{totalCount}</div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded">
                        <div className="text-xs text-gray-400 uppercase tracking-tighter mb-2">
                            By Category
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {categories.map((c) => {
                                const label = c.category ?? "uncategorized";
                                const href = c.category
                                    ? `/operator/decisions?category=${encodeURIComponent(c.category)}`
                                    : `/operator/decisions?category=${encodeURIComponent("uncategorized")}`;
                                return (
                                    <div key={label} className="text-xs flex items-center gap-1">
                                        <Link
                                            href={href}
                                            className="font-mono text-sky-400 hover:text-sky-300"
                                        >
                                            {label}
                                        </Link>
                                        <span className="text-zinc-500">×{c._count.category}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded">
                        <div className="text-xs text-gray-400 uppercase tracking-tighter mb-2">
                            By Status
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {statuses.map((s) => (
                                <div key={s.status} className="text-xs flex items-center gap-1">
                                    <Link
                                        href={`/operator/decisions?status=${encodeURIComponent(s.status)}`}
                                        className="font-mono text-sky-400 hover:text-sky-300"
                                    >
                                        {s.status}
                                    </Link>
                                    <span className="text-zinc-500">×{s._count.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active Filters */}
                {hasFilters && (
                    <div className="flex flex-wrap gap-2 items-center mb-4">
                        {categoryFilter && (
                            <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                                Category: <span className="ml-1 font-mono">{categoryFilter}</span>
                            </span>
                        )}
                        {statusFilter && (
                            <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                                Status: <span className="ml-1 font-mono">{statusFilter}</span>
                            </span>
                        )}
                        {searchQuery && (
                            <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                                Search: <span className="ml-1 font-mono">{searchQuery}</span>
                            </span>
                        )}
                        <Link
                            href="/operator/decisions"
                            className="text-[11px] text-sky-400 hover:text-sky-300 underline"
                        >
                            Clear filters
                        </Link>
                    </div>
                )}
            </header>

            {/* Search */}
            <form method="get" className="mb-6 flex gap-2">
                <input
                    name="q"
                    defaultValue={searchQuery ?? ""}
                    placeholder="Search decisions..."
                    className="flex-1 rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sky-600"
                />
                <button
                    type="submit"
                    className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
                >
                    Search
                </button>
            </form>

            {/* Decisions List */}
            {decisions.length === 0 ? (
                <p className="text-sm text-gray-400">
                    No decisions found.{" "}
                    {hasFilters ? "Try clearing filters." : "Run extract:decisions to populate."}
                </p>
            ) : (
                <div className="space-y-3">
                    {decisions.map((d) => {
                        const catKey = d.category ?? "decision";
                        const catClass = categoryColors[catKey] ?? categoryColors.decision;
                        const statusClass = statusColors[d.status] ?? statusColors.active;

                        return (
                            <div key={d.id} className={`rounded-lg border p-4 ${catClass}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-100 leading-relaxed">{d.text}</p>

                                        {d.context && (
                                            <p className="text-xs text-gray-500 mt-2 italic">
                                                Context: {d.context}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono ${statusClass}`}
                                        >
                                            {d.status}
                                        </span>
                                        {d.category && (
                                            <span className="text-[10px] text-gray-500 font-mono">
                                                {d.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Source chat link */}
                                <div className="mt-3 pt-2 border-t border-current/20 flex items-center justify-between">
                                    <Link
                                        href={`/operator/chats/${d.chat.id}`}
                                        className="text-xs text-sky-400 hover:text-sky-300"
                                    >
                                        ← from: {d.chat.title}
                                    </Link>
                                    <span className="text-xs text-gray-600">
                                        {formatCentral(d.chat.chatDate)}
                                        {d.lineNumber && <span className="ml-2 font-mono">L{d.lineNumber}</span>}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
