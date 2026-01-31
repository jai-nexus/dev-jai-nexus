export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCentral } from "@/lib/time";

type SearchParams = {
    source?: string | string[];
    q?: string | string[];
    limit?: string | string[];
};

interface ChatsPageProps {
    searchParams?: SearchParams | Promise<SearchParams>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
}

export default async function ChatsPage({ searchParams }: ChatsPageProps) {
    const sp = await Promise.resolve(searchParams ?? {});

    const sourceFilter = firstParam(sp.source);
    const searchQuery = firstParam(sp.q);
    const limitParam = firstParam(sp.limit);

    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 100, 500) : 100;

    const where: any = {};

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
            .catch(() => []),
    ]);

    const hasFilters = !!(sourceFilter || searchQuery);

    return (
        <main className="min-h-screen bg-black text-gray-100 p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-semibold">JAI NEXUS · Chat Memory</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Archived conversations with AI models and decision history.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-8">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded">
                        <div className="text-xs text-gray-400 uppercase tracking-tighter">
                            Total Chats
                        </div>
                        <div className="text-2xl font-mono text-zinc-200">{totalCount}</div>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-zinc-900/50 border border-zinc-800 p-3 rounded">
                        <div className="text-xs text-gray-400 uppercase tracking-tighter mb-2">
                            By Source
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {sources.map((s) => (
                                <div key={s.source} className="text-xs flex items-center gap-2">
                                    <Link
                                        href={`/operator/chats?source=${encodeURIComponent(s.source)}`}
                                        className="font-mono text-sky-400 hover:text-sky-300"
                                    >
                                        {s.source}
                                    </Link>
                                    <span className="text-zinc-500">×{s._count.source}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active Filters */}
                {hasFilters && (
                    <div className="flex flex-wrap gap-2 items-center mb-4">
                        {sourceFilter && (
                            <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                                Source: <span className="ml-1 font-mono">{sourceFilter}</span>
                            </span>
                        )}
                        {searchQuery && (
                            <span className="inline-flex items-center rounded-full bg-zinc-900 border border-zinc-700 px-2 py-1 text-[11px]">
                                Search: <span className="ml-1 font-mono">{searchQuery}</span>
                            </span>
                        )}
                        <Link
                            href="/operator/chats"
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
                    placeholder="Search chats..."
                    className="flex-1 rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sky-600"
                />
                <button
                    type="submit"
                    className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
                >
                    Search
                </button>
            </form>

            {/* Chat List */}
            {chats.length === 0 ? (
                <p className="text-sm text-gray-400">
                    No chats found.{" "}
                    {hasFilters
                        ? "Try clearing filters."
                        : "Drop a .txt export into ~/jai-inbox to ingest."}
                </p>
            ) : (
                <div className="space-y-3">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className="rounded-lg border border-gray-800 bg-zinc-950 p-4 hover:bg-zinc-900/60 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium">
                                        <Link
                                            href={`/operator/chats/${chat.id}`}
                                            className="text-sky-400 hover:text-sky-300"
                                        >
                                            {chat.title}
                                        </Link>
                                    </h3>

                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                                        <span>
                                            <span className="text-gray-500">Date:</span>{" "}
                                            {formatCentral(chat.chatDate)}
                                        </span>
                                        <span>
                                            <span className="text-gray-500">Source:</span>{" "}
                                            <Link
                                                href={`/operator/chats?source=${encodeURIComponent(chat.source)}`}
                                                className="text-sky-400 hover:text-sky-300 underline"
                                            >
                                                {chat.source}
                                            </Link>
                                        </span>
                                        {chat.model && (
                                            <span>
                                                <span className="text-gray-500">Model:</span> {chat.model}
                                            </span>
                                        )}
                                        {chat._count.decisions > 0 && (
                                            <span className="text-emerald-400">
                                                {chat._count.decisions} decision
                                                {chat._count.decisions !== 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </div>

                                    {chat.tags.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {chat.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-gray-300"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="text-xs text-gray-600 whitespace-nowrap font-mono">
                                    {chat.chatId}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
