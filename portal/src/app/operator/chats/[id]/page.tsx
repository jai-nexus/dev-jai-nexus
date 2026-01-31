export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCentral } from "@/lib/time";

interface ChatPageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { id } = await Promise.resolve(params);
    const chatId = parseInt(id, 10);

    if (isNaN(chatId)) notFound();

    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
            decisions: {
                orderBy: { lineNumber: "asc" },
            },
        },
    });

    if (!chat) notFound();

    return (
        <main className="min-h-screen bg-black text-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Back link */}
                <Link
                    href="/operator/chats"
                    className="text-sm text-sky-400 hover:text-sky-300 mb-4 inline-block"
                >
                    ← Back to chats
                </Link>

                {/* Header */}
                <h1 className="text-3xl font-semibold mb-2">{chat.title}</h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-4">
                    <span>Date: {formatCentral(chat.chatDate)}</span>
                    <span>Source: {chat.source}</span>
                    {chat.model && <span>Model: {chat.model}</span>}
                    {chat.nhId && <span>NH: {chat.nhId}</span>}
                    <span className="text-gray-600 font-mono text-xs">{chat.chatId}</span>
                </div>

                {chat.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-6">
                        {chat.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-1 text-xs text-gray-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Decisions */}
                {chat.decisions.length > 0 && (
                    <div className="mb-8 rounded-lg border border-emerald-800 bg-emerald-950/20 p-4">
                        <h2 className="text-lg font-semibold text-emerald-400 mb-3">
                            Extracted Decisions ({chat.decisions.length})
                        </h2>

                        <div className="space-y-3">
                            {chat.decisions.map((decision) => (
                                <div
                                    key={decision.id}
                                    className="rounded-md border border-emerald-800/50 bg-black/40 p-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm text-gray-200">{decision.text}</p>
                                        {decision.lineNumber && (
                                            <span className="text-xs text-gray-600 whitespace-nowrap font-mono">
                                                L{decision.lineNumber}
                                            </span>
                                        )}
                                    </div>

                                    {decision.context && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Context: {decision.context}
                                        </p>
                                    )}

                                    <div className="flex gap-2 mt-2">
                                        {decision.category && (
                                            <span className="inline-flex items-center rounded-full bg-emerald-900/50 px-2 py-0.5 text-[10px] text-emerald-300">
                                                {decision.category}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-gray-400">
                                            {decision.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Full Text */}
                <div className="rounded-lg border border-gray-800 bg-zinc-950 p-6">
                    <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-tighter">
                        Full Conversation
                    </h2>
                    <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300 leading-relaxed">
                        {chat.fullText}
                    </pre>
                </div>
            </div>
        </main>
    );
}
